"""Builds the source searches from neutral vehicle details and turns their results into
neutral listings, so the browser never sees which sites the market data comes from."""
import hashlib
import re
from typing import Optional

from pydantic import BaseModel

# Only admins receive these fields
ADMIN_ONLY_FIELDS = ("source", "url", "image")


class VehicleDetails(BaseModel):
    make: str
    model: str
    year: Optional[str] = None
    variant: Optional[str] = None
    style: Optional[str] = None          # body type as written in our database, e.g. "4D SEDAN"
    cc: Optional[str] = None
    transmission: Optional[str] = None   # as written in our database, e.g. "7 SP AUTOMATIC CVT"
    fuel_type: Optional[str] = None      # petrol / diesel / hybrid / electric
    import_status: Optional[str] = None  # Imported New / Local Assembled / Imported Recon
    category: Optional[str] = None       # Insurable Value tab: car / motorcycle / commercial


def slug(s: str) -> str:
    return re.sub(r"\s+", "-", s.strip().lower())


def _mapped_transmission(v: VehicleDetails) -> Optional[str]:
    t = (v.transmission or "").lower()
    return "auto" if "auto" in t else "manual" if "manual" in t else None


def _body_types(style: Optional[str]):
    """Returns (mudah body, carlist body) for a database style like '4D SEDAN'."""
    s = (style or "").lower()
    if "sedan" in s: return "sedan", "sedan"
    if "hatchback" in s: return "hatchback", "Hatchback"
    if "suv" in s: return "suvs", "suv"
    if "mpv" in s: return "mpvs", "MPV"
    if "pick" in s or "cab" in s: return "pick_up", "pickup"
    return "other", style


def mudah_car_query(v: VehicleDetails) -> dict:
    q = {"make_id": slug(v.make), "model_id": slug(v.model), "From": 0, "limit": 50, "sortby": "price_asc", "type": "sell"}
    if v.year: q["mfg_year"] = f"{v.year}-{v.year}"
    # Mudah's search only accepts these fuel values; for others search without the filter
    if v.fuel_type in ("petrol", "electric"): q["fueltype"] = v.fuel_type
    if v.style: q["car_type_id"] = _body_types(v.style)[0]
    if _mapped_transmission(v): q["transmission_id"] = _mapped_transmission(v)
    return q


def mudah_motorcycle_query(v: VehicleDetails) -> dict:
    q = {"motorcycle_make_id": slug(v.make), "motorcycle_model_id": slug(v.model), "From": 0, "limit": 50, "sortby": "price_asc"}
    if v.year: q["mfg_year"] = f"{v.year}-{v.year}"
    return q


def carlist_query(v: VehicleDetails):
    """Returns (query, filters) for the Carlist search."""
    query = {"make": slug(v.make), "model": slug(v.model), "condition": "recon" if v.import_status in ("Imported Recon", "Imported Recond") else "used"}
    if v.style: query["body_type"] = _body_types(v.style)[1]
    if v.variant: query["variant"] = v.variant
    # cc lets the URL builder construct slugs like '1-5-e' for short trims
    if v.fuel_type != "electric" and v.cc: query["cc"] = v.cc

    filters = {"page_size": 50, "sort": "asc"}
    if v.year: filters["min_year"] = filters["max_year"] = int(v.year)
    if _mapped_transmission(v): filters["transmission"] = "Automatic" if _mapped_transmission(v) == "auto" else "Manual"
    return query, filters


def filter_mudah_by_variant(items: list, variant: Optional[str]) -> list:
    """Mudah cannot filter by variant, so keep listings whose variant/model text mentions it."""
    tokens = [t for t in re.split(r"[\s-]+", (variant or "").lower()) if len(t) > 2]
    if not tokens:
        return items
    return [i for i in items if any(t in f"{i.get('variant') or ''} {i.get('model_name') or ''}".lower() for t in tokens)]


def _listing_id(url: str) -> str:
    # Stable, anonymous id so the frontend can remove a listing without knowing its link
    return hashlib.sha1(url.encode()).hexdigest()[:16]


def _price(value) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def from_mudah(a: dict) -> dict:
    url = a.get("adview_url") or ""
    return {
        "id": _listing_id(url or repr(a)),
        "make": a.get("make_name") or "",
        "model": a.get("model_name") or "",
        "variant": a.get("variant"),
        "year": a.get("manufactured_year") or "",
        "price": _price(a.get("price")),
        "mileage": a.get("mileage"),
        "transmission": a.get("transmission_name"),
        "fuelType": a.get("fueltype"),
        "condition": a.get("condition_name"),
        "bodyType": a.get("car_type_name"),
        "engineCapacity": a.get("engine_capacity"),
        "source": "Mudah",
        "url": url,
        "image": a.get("image"),
    }


def from_carlist(i: dict) -> dict:
    url = i.get("url") or i.get("mainEntityOfPage") or ""
    if isinstance(url, dict):
        url = url.get("@id", "")
    image = i.get("image")
    if isinstance(image, list):
        image = image[0] if image else None
    if isinstance(image, dict):
        image = image.get("url")
    brand = i.get("brand")
    mileage = (i.get("mileageFromOdometer") or {}).get("value")
    condition = str(i.get("itemCondition") or "")
    return {
        "id": _listing_id(url or repr(i)),
        "make": brand.get("name", "") if isinstance(brand, dict) else (brand or ""),
        "model": i.get("model") or "",
        "variant": None,
        "year": i.get("vehicleModelDate") or "",
        "price": _price((i.get("offers") or {}).get("price")),
        "mileage": f"{mileage} km" if mileage else None,
        "transmission": i.get("vehicleTransmission"),
        "fuelType": i.get("fuelType"),
        "condition": "New" if "NewCondition" in condition else "Used" if "UsedCondition" in condition else None,
        "bodyType": i.get("bodyType"),
        "engineCapacity": None,
        "source": "Carlist",
        "url": url,
        "image": image,
    }


def for_viewer(listings: list, admin: bool) -> list:
    """Removes duplicates, sorts by price, and strips source/link/image for non-admins."""
    unique = list({l["id"]: l for l in listings}.values())
    unique.sort(key=lambda l: l["price"])
    if admin:
        return unique
    return [{k: v for k, v in l.items() if k not in ADMIN_ONLY_FIELDS} for l in unique]
