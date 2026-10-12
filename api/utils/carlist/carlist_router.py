import os
import re
import json
import concurrent.futures
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional, Annotated
from os import path

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator
from lxml import etree
from dotenv import load_dotenv

from zenrows import ZenRowsClient

from api.utils import market_cache
from api.utils.auth import require_admin
from api.utils.db import supabase, execute
from api.utils.error_log import log_error

load_dotenv(".env.local")

carlistRouter = APIRouter(prefix="/carlist")

CACHE_TABLE = "temporary_carlist"
# Raise this whenever the URL builder or matching logic changes, so results saved by older code are ignored.
SCRAPER_VERSION = 1

# A Carlist path: make, optionally model group and model, e.g. "bmw", "bmw/1-series", "bmw/1-series/118i"
CARLIST_PATH = re.compile(r"^[a-z0-9][a-z0-9\-]*(/[a-z0-9][a-z0-9\-]*){0,2}$")

vehicle_map_path = path.join(path.dirname(__file__), "vehicle_map.json")
with open(vehicle_map_path, "r") as f:
    VEHICLE_MAP = json.load(f)

class SearchQuery(BaseModel):
    make: str
    model: str
    condition: str = "used"
    variant: Optional[str] = None
    body_type: Optional[str] = None
    year: Optional[str] = None
    cc: Optional[str] = None
    # Exact path segments taken from Carlist's own filter links (Current Market Valuation page),
    # e.g. "1-5-e" and "body-Sedan". When set, no guessing or title matching is needed.
    variant_slug: Optional[str] = None
    body_slug: Optional[str] = None
    # Carlist's own path for the make/model group/model, e.g. "bmw/1-series/118i" or "honda/civic".
    # Comes from Carlist's filter links, so it is used as-is instead of the saved vehicle map.
    path: Optional[str] = None

    @model_validator(mode='after')
    def validate_model(self):
        if self.path:
            if not CARLIST_PATH.match(self.path):
                raise RequestValidationError(f"Invalid path '{self.path}'.")
            return self
        models = VEHICLE_MAP.get(self.make.lower())
        if models is None:
            raise RequestValidationError(f"Make '{self.make}' not found in vehicle map")
        if self.model.lower() not in models:
            raise RequestValidationError(f"Model '{self.model}' not found for make '{self.make}'.")
        return self

class SearchFilters(BaseModel):
    page_size: Optional[Annotated[int, Field(gt=1)]] = 50
    sort: Optional[str] = None
    min_year: Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    max_year: Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    min_price: Optional[Annotated[int, Field(ge=0)]] = None
    max_price: Optional[Annotated[int, Field(ge=0)]] = None
    min_mileage: Optional[Annotated[int, Field(ge=0)]] = None
    max_mileage: Optional[Annotated[int, Field(ge=0)]] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    driven_wheel: Optional[str] = None

def slugify_variant(query: SearchQuery) -> Optional[str]:
    """Generates Carlist path slugs (e.g., '1-5-e' for 1498cc Civic E, or '2-0i')."""
    if not query.variant:
        return None
        
    v = query.variant.lower().replace("(cbu)", "").replace("(ckd)", "").strip()
    
    # Single-letter trims (e.g. E, V, RS) require engine displacement prefixes
    if len(v) <= 2 and query.cc:
        try:
            cc_float = round(int(query.cc) / 1000.0, 1)
            return f"{str(cc_float).replace('.', '-')}-{v}"
        except Exception:
            pass
            
    s = v.replace(".", "-").replace(" ", "-")
    s = re.sub(r'[^a-z0-9\-]', '', s)
    slug = re.sub(r'-+', '-', s).strip('-')
    return slug if len(slug) > 1 else None

def build_carlist_url(query: SearchQuery, filters: SearchFilters, sort_order: str) -> str:
    path_parts = ["https://www.carlist.my/"]
    path_parts.append(f"{query.condition}-cars-for-sale/")

    if query.path:
        path_parts.append(f"{query.path}/")
    else:
        path_parts.append(f"{query.make.lower()}/")
        models = VEHICLE_MAP.get(query.make.lower(), {})
        clean_model = query.model.lower()
        group = models.get(clean_model) if isinstance(models, dict) else None
        path_parts.append(f"{group}/{clean_model}/" if group else f"{clean_model}/")

    var_slug = query.variant_slug or slugify_variant(query)
    if var_slug:
        path_parts.append(f"{var_slug}/")

    if query.body_slug:
        path_parts.append(f"{query.body_slug}/")
    elif query.body_type:
        clean_body = query.body_type.replace("4D ", "").replace("2D ", "").strip().capitalize()
        path_parts.append(f"body-{clean_body}/")

    year_val = filters.min_year or query.year
    if year_val:
        path_parts.append(f"year-{year_val}/")

    path_parts.append("malaysia")
    url = "".join(path_parts)
    
    # Query parameters
    query_params = [f"sort={sort_order}", "page_number=1"]
    
    if filters.transmission:
        trans_str = filters.transmission.lower()
        if "auto" in trans_str:
            query_params.append("transmission=automatic")
        elif "manual" in trans_str:
            query_params.append("transmission=manual")

    if filters.fuel_type and re.fullmatch(r"[A-Za-z]+", filters.fuel_type):
        query_params.append(f"fuel_type={filters.fuel_type}")
            
    url += "?" + "&".join(query_params)
    return url

def fetch_page(url: str, timeout: int = 25):
    """Fetches a Carlist page through ZenRows and returns its parsed HTML tree, or None on failure."""
    api_key = os.environ.get("ZENROWS_API_KEY")
    if not api_key:
        log_error("carlist", "config_error", "ZENROWS_API_KEY is not set")
        return None

    client = ZenRowsClient(api_key)
    params = {
        "js_render": "true",
        "antibot": "true",
        "premium_proxy": "true",
        "block_resources": "image,media,font,stylesheet"
    }
    try:
        response = client.get(url, params=params, timeout=timeout)
        if response.status_code != 200:
            log_error("carlist", "scrape_failed", f"HTTP {response.status_code} for {url}")
            return None
        tree = etree.HTML(response.text, etree.HTMLParser())
        if tree is None:
            log_error("carlist", "scrape_failed", f"Empty page for {url}")
        return tree
    except Exception as e:
        log_error("carlist", "scrape_failed", f"{e} for {url}")
        return None

def zenrows_scrape(url: str):
    """Returns a list of listings ([] means Carlist had none), or None if the scrape failed."""
    tree = fetch_page(url)
    if tree is None:
        return None

    try:
        script_tags = tree.xpath('//script[@type="application/ld+json"]')
        if not script_tags:
            log_error("carlist", "scrape_failed", f"No listing data on page for {url}")
            return None

        data = json.loads(script_tags[0].text)[-1].get("itemListElement")
        return [i['item'] for i in data] if data else []
    except Exception as e:
        log_error("carlist", "scrape_failed", f"{e} for {url}")
        return None

def search_inputs(query: SearchQuery, filters: SearchFilters) -> dict:
    """Every input that changes the Carlist URL. cc is included because it changes the variant slug."""
    return {
        "make": query.make,
        "model": query.model,
        "condition": query.condition,
        "variant": query.variant,
        "cc": query.cc,
        "body_type": query.body_type,
        "variant_slug": query.variant_slug,
        "body_slug": query.body_slug,
        "path": query.path,
        "year": filters.min_year or query.year,
        "transmission": filters.transmission,
        "fuel_type": filters.fuel_type,
    }

def vehicle_key(inputs: dict) -> str:
    """Identifies the car itself, ignoring condition/cc/transmission, for linking to insurable later."""
    return market_cache.build_key({k: inputs[k] for k in ("make", "model", "path", "variant", "variant_slug", "body_type", "body_slug", "year")})

def scrape_low_and_high(query: SearchQuery, filters: SearchFilters):
    """Scrapes the cheapest and priciest pages at the same time."""
    url_low = build_carlist_url(query, filters, sort_order="price.asc")
    url_high = build_carlist_url(query, filters, sort_order="price.desc")
    print(f"Scraping Carlist Lowest URL:  {url_low}")
    print(f"Scraping Carlist Highest URL: {url_high}")
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_low = executor.submit(zenrows_scrape, url_low)
        future_high = executor.submit(zenrows_scrape, url_high)
        return future_low.result(), future_high.result()

def local_match(title: str, target_variant: str) -> bool:
    if not title or not target_variant:
        return True
        
    t = title.upper()
    v = target_variant.upper().replace("(CBU)", "").replace("(CKD)", "").strip()
    
    # Single-letter trims (e.g. 'E', 'V', 'RS')
    if len(v) <= 2:
        patterns = [
            rf"\b{re.escape(v)}\b",
            rf"\b\d+\.\d+\s*{re.escape(v)}\b",
            rf"\b{re.escape(v)}\s*SPEC\b",
            rf"\b{re.escape(v)}\s*SEDAN\b"
        ]
        return any(re.search(p, t) for p in patterns)

    tokens = [tok for tok in re.split(r"[\s\-_/()]+", v) if len(tok) > 1]
    if not tokens:
        return v in t

    if "20I" in tokens:
        return any(term in t for term in ["20I", "120I", "320I"])

    matched = [tok for tok in tokens if tok in t]
    return len(matched) >= max(1, len(tokens) - 1)

# Carlist's listing condition for each search condition (recon listings are marked "Refurbished")
CONDITION_SCHEMA = {"new": "NewCondition", "used": "UsedCondition", "recon": "RefurbishedCondition"}

def _plain(value) -> str:
    """'BR-V' -> 'brv', 'Mercedes-Benz' -> 'mercedesbenz', so names and URL slugs compare equal."""
    return re.sub(r"[^a-z0-9]", "", str(value or "").lower())

def _variant_tokens(slug: str) -> list[str]:
    """'3-0-competition' -> ['3.0', 'competition']; '2-0-e-hev-rs' -> ['2.0', 'e', 'hev', 'rs']."""
    text = re.sub(r"(\d)-(\d)", r"\1.\2", slug.lower())
    return [t for t in text.split("-") if t]

def _has_token(text: str, token: str) -> bool:
    # Whole words only, so 'e' does not match inside 'competition'; engine sizes may be written '3.0L'
    suffix = "l?" if re.fullmatch(r"\d+(\.\d+)?", token) else ""
    return re.search(rf"(?<![a-z0-9.]){re.escape(token)}{suffix}(?![a-z0-9])", text) is not None

def strict_match(item: dict, query: SearchQuery, filters: SearchFilters) -> bool:
    """Keeps only listings that are exactly what was searched for. Carlist adds featured or similar
    cars to pages with few matches; those fail at least one of these checks."""
    segments = (query.path or "").split("/")
    brand = item.get("brand")
    brand_name = brand.get("name") if isinstance(brand, dict) else brand
    if _plain(brand_name) != _plain(segments[0]):
        return False
    if _plain(item.get("model")) != _plain(segments[-1]):
        return False

    year = filters.min_year or query.year
    if year and str(item.get("vehicleModelDate")) != str(year):
        return False

    expected_condition = CONDITION_SCHEMA.get(query.condition)
    if expected_condition and expected_condition not in str(item.get("itemCondition") or ""):
        return False

    # Optional choices: checked when chosen and the listing states them
    if query.body_slug and item.get("bodyType") and _plain(item["bodyType"]) != _plain(query.body_slug.removeprefix("body-")):
        return False
    if filters.transmission and item.get("vehicleTransmission") and not str(item["vehicleTransmission"]).lower().startswith(filters.transmission.lower()[:4]):
        return False
    if filters.fuel_type and item.get("fuelType") and _plain(item["fuelType"]) != _plain(filters.fuel_type):
        return False

    # There is no variant field, so every word of the variant must appear in the title or description
    if query.variant_slug:
        text = re.sub(r"[^a-z0-9.]+", " ", f"{item.get('name') or ''} {item.get('description') or ''}".lower())
        if not all(_has_token(text, token) for token in _variant_tokens(query.variant_slug)):
            return False
    return True

def listing_id(item: dict) -> str:
    """'https://www.carlist.my/used-cars-for-sale/...?sort=price.asc#listing_18907179' -> 'listing_18907179'"""
    url = item.get("url") or ""
    return url.rsplit("#", 1)[-1] if "#" in url else url

def find_listings(query: SearchQuery, filters: SearchFilters):
    """Returns (matching raw listings, when they were scraped as an ISO date string).
    Uses a saved result from the last 7 days when there is one, otherwise scrapes."""
    inputs = search_inputs(query, filters)
    search_key = market_cache.build_key(inputs)

    saved = market_cache.get_fresh(CACHE_TABLE, search_key, SCRAPER_VERSION)
    if saved is not None:
        unique_listings = saved["listings"]
        scraped_at = saved["scraped_at"]
    else:
        scraped_at = datetime.now(timezone.utc).isoformat()
        cheapest_listings, priciest_listings = scrape_low_and_high(query, filters)

        # Fallback to broader URL path if slug returns zero results.
        # Not for exact Carlist slugs: those are what the user picked, so a broader search would be wrong.
        if not cheapest_listings and not priciest_listings and query.variant and not query.variant_slug:
            broad_query = query.model_copy(update={"variant": None})
            cheapest_listings, priciest_listings = scrape_low_and_high(broad_query, filters)

        unique_listings = [item for item in (cheapest_listings or []) + (priciest_listings or []) if item.get('url')]

        # Only save real results: a failed or empty scrape should be retried by the next search.
        if unique_listings:
            market_cache.save(CACHE_TABLE, search_key, vehicle_key(inputs), SCRAPER_VERSION, inputs, unique_listings)
        elif cheapest_listings is None and priciest_listings is None:
            log_error("carlist", "scrape_failed", "Both price pages failed", inputs)

    # A listing on both the cheapest and priciest page must count once. Its url is the page address plus
    # "#listing_<id>", and the page address differs by sort order, so compare the listing id.
    # Done after loading too, because results saved before this fix contain such pairs.
    unique_listings = list({listing_id(item): item for item in unique_listings}.values())

    filtered_listings = []
    for item in unique_listings:
        title = item.get("name", "")
        # Current Market Valuation searches (exact Carlist path): strict field-by-field check
        if query.path:
            if strict_match(item, query, filters):
                filtered_listings.append(item)
        # Title matching is only needed when the variant was guessed from our database wording
        elif query.variant and not query.variant_slug:
            if local_match(title, query.variant):
                filtered_listings.append(item)
        else:
            filtered_listings.append(item)

    prices = [
        int(item.get("offers", {}).get("price", 0)) 
        for item in filtered_listings 
        if item.get("offers", {}).get("price")
    ]
    if prices:
        print(f"Matched {len(filtered_listings)} listings. Price Range: RM {min(prices):,} -> RM {max(prices):,}")
    else:
        print(f"Matched {len(filtered_listings)} listings.")

    return filtered_listings, scraped_at

# Admin-only when called over HTTP; the valuation endpoint calls Search() directly in Python.
@carlistRouter.post('/search', dependencies=[Depends(require_admin)])
def Search(
    query: SearchQuery,
    filters: SearchFilters,
    whitelist_attributes: Optional[list[str]] = [
        "brand.name", "model", "itemCondition", "vehicleModelDate",
        "fuelType", "offers.price", "mileageFromOdometer.value",
        "vehicleTransmission", "image[0].url", "mainEntityOfPage"
    ]
):
    filtered_listings, _ = find_listings(query, filters)

    response_data = []
    if not whitelist_attributes: 
        response_data = filtered_listings
    else:
        for item in filtered_listings:
            filtered_item = {}
            for attribute in whitelist_attributes:
                keys = []
                for part in attribute.split('.'):
                    keys.extend(re.findall(r'([^\[\]]+)', part))
                value = item
                try:
                    for key in keys:
                        value = value[int(key)] if isinstance(value, list) and key.isdigit() else value[key]
                    filtered_item[attribute] = value
                except (KeyError, IndexError, TypeError):
                    filtered_item[attribute] = None
            response_data.append(filtered_item)

    return response_data

OPTIONS_TABLE = "carlist_filter_options"
# Carlist's filter menus change slowly, so each page is fetched at most once per this many days
OPTIONS_FRESH_DAYS = 30
# Raise when the parser changes, so menus saved by older code are fetched again
OPTIONS_VERSION = 3

def _relative_path(href: str) -> str:
    """'https://www.carlist.my/used-cars-for-sale/bmw/1-series/malaysia?x=1' -> 'bmw/1-series'"""
    p = re.sub(r"^https?://www\.carlist\.my/", "", href.split("?")[0]).strip("/")
    p = re.sub(r"^[a-z]*-?cars-for-sale/?", "", p)
    return re.sub(r"/?malaysia$", "", p).strip("/")

def _count(li) -> int:
    """Listing count shown in brackets after an option, e.g. '2022 (384)' -> 384."""
    match = re.search(r"\((\d+)\)\s*$", " ".join("".join(li.itertext()).split()))
    return int(match.group(1)) if match else 0

def parse_menus(tree) -> dict:
    """Reads Carlist's own filter menus from a listing page. Each option keeps Carlist's link path,
    so the next step and the final search use exactly what Carlist uses."""
    def items(name):
        # Match the exact class: "smenu__select--year" must not also pick up "--year-min" / "--year-max"
        return tree.xpath(f'//ul[contains(concat(" ", normalize-space(@class), " "), " smenu__select--{name} ")]/li')

    def linked(name, label_from_value=False):
        options = []
        for li in items(name):
            href = (li.xpath('.//a/@href') or [""])[0]
            value = li.get("data-value")
            if value and href:
                label = value.replace("-", " ").upper() if label_from_value else value
                options.append({"label": label, "path": _relative_path(href)})
        return options

    def query_values(name, param):
        values = []
        for li in items(name):
            for href in li.xpath('.//a/@href'):
                match = re.search(rf"{param}=(\w+)", href)
                if match and match.group(1) not in values:
                    values.append(match.group(1))
        return values

    variants = [{"label": o["label"], "slug": o["path"].rsplit("/", 1)[-1]} for o in linked("variant")]
    body_types = [{"label": o["label"], "slug": o["path"].rsplit("/", 1)[-1]} for o in linked("body-type")]
    # Only years that currently have listings, newest first, each once
    years = sorted({li.get("data-value") for li in items("year") if (li.get("data-value") or "").isdigit() and _count(li) > 0}, reverse=True)

    return {
        "version": OPTIONS_VERSION,
        "makes": linked("brand"),
        "model_groups": linked("model_group", label_from_value=True),
        "models": linked("model"),
        "variants": variants,
        "body_types": body_types,
        "years": years,
        "transmissions": query_values("transmission", "transmission"),
        "fuel_types": query_values("fuel-type", "fuel_type"),
    }

def get_menu(path: str = "") -> Optional[dict]:
    """Carlist's filter menus for a page ("" = all makes, "bmw", "bmw/1-series", "bmw/1-series/118i").
    Uses the saved copy if newer than OPTIONS_FRESH_DAYS, otherwise fetches the page once and saves it."""
    path = path.strip("/").lower()
    if path and not CARLIST_PATH.match(path):
        return None
    make, _, rest = path.partition("/")
    cutoff = (datetime.now(timezone.utc) - timedelta(days=OPTIONS_FRESH_DAYS)).isoformat()
    try:
        res = execute(lambda: supabase.table(OPTIONS_TABLE).select("options").eq("make", make).eq("model", rest).gte("fetched_at", cutoff).limit(1))
        if res.data and res.data[0]["options"].get("version") == OPTIONS_VERSION:
            return res.data[0]["options"]
    except Exception as e:
        log_error("cache", "db_error", f"Reading {OPTIONS_TABLE}: {e}", {"path": path})

    # "cars-for-sale" covers new, used and recon listings, so the menus include every option
    url = f"https://www.carlist.my/cars-for-sale/{path + '/' if path else ''}malaysia"
    print(f"Fetching Carlist filter menus: {url}")
    # Listing pages are large (over 1 MB) and need browser rendering, so allow extra time.
    # Each page is only fetched once every OPTIONS_FRESH_DAYS.
    tree = fetch_page(url, timeout=90)
    if tree is None:
        return None

    menus = parse_menus(tree)
    if not any(menus[k] for k in ("makes", "model_groups", "models", "variants", "body_types", "years")):
        log_error("carlist", "no_filter_options", f"No filter menus found on {url}", {"path": path})
        return menus

    try:
        execute(lambda: supabase.table(OPTIONS_TABLE).upsert(
            {"make": make, "model": rest, "options": menus, "fetched_at": datetime.now(timezone.utc).isoformat()},
            on_conflict="make,model",
        ))
    except Exception as e:
        log_error("cache", "db_error", f"Saving {OPTIONS_TABLE}: {e}", {"path": path})
    return menus

# Choices change which cars are listed, so the narrowed menus for a set of choices are kept for less time
FILTERED_FRESH_DAYS = 7
FILTER_SLUG = re.compile(r"^[A-Za-z0-9\-]+$")
FILTERED_KEYS = ("years", "body_types", "transmissions", "fuel_types")

def _filtered_page(path: str, condition: str, variant_slug, body_slug, transmission, fuel_type) -> Optional[dict]:
    """Carlist's menus on one condition's listing page with these choices applied. Saved for FILTERED_FRESH_DAYS."""
    make, _, rest = path.partition("/")
    # Saved in the same table as the model menus, under a key that includes every choice
    key = f"{rest}|filtered|{condition}|{variant_slug or ''}|{body_slug or ''}|{transmission or ''}|{fuel_type or ''}"
    cutoff = (datetime.now(timezone.utc) - timedelta(days=FILTERED_FRESH_DAYS)).isoformat()
    try:
        res = execute(lambda: supabase.table(OPTIONS_TABLE).select("options").eq("make", make).eq("model", key).gte("fetched_at", cutoff).limit(1))
        if res.data and res.data[0]["options"].get("version") == OPTIONS_VERSION:
            return res.data[0]["options"]
    except Exception as e:
        log_error("cache", "db_error", f"Reading {OPTIONS_TABLE}: {e}", {"path": path, "key": key})

    segments = "".join(f"{s}/" for s in (variant_slug, body_slug) if s)
    params = "&".join(f"{k}={v}" for k, v in (("transmission", transmission), ("fuel_type", fuel_type)) if v)
    url = f"https://www.carlist.my/{condition}-cars-for-sale/{path}/{segments}malaysia" + (f"?{params}" if params else "")
    print(f"Fetching Carlist filtered menus: {url}")
    tree = fetch_page(url, timeout=90)
    if tree is None:
        return None
    menus = parse_menus(tree)
    # No years means no listings for these choices, so the other menus on that page don't apply
    page = {"version": OPTIONS_VERSION, **({k: menus[k] for k in FILTERED_KEYS} if menus["years"] else {k: [] for k in FILTERED_KEYS})}
    try:
        execute(lambda: supabase.table(OPTIONS_TABLE).upsert(
            {"make": make, "model": key, "options": page, "fetched_at": datetime.now(timezone.utc).isoformat()},
            on_conflict="make,model",
        ))
    except Exception as e:
        log_error("cache", "db_error", f"Saving {OPTIONS_TABLE}: {e}", {"path": path, "key": key})
    return page

def get_filtered(path: str, conditions: list[str], variant_slug: Optional[str] = None, body_slug: Optional[str] = None,
                 transmission: Optional[str] = None, fuel_type: Optional[str] = None) -> Optional[dict]:
    """Years, body types, transmissions and fuel types that have listings for exactly these choices, read from
    Carlist's own menus on the pages the search will use (one page per condition, e.g. new + used)."""
    path = path.strip("/").lower()
    if not CARLIST_PATH.match(path) or "/" not in path:
        return None
    if any(s and not FILTER_SLUG.match(s) for s in (variant_slug, body_slug, fuel_type)):
        return None
    if transmission not in (None, "automatic", "manual"):
        return None

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(conditions)) as executor:
        pages = list(executor.map(lambda c: _filtered_page(path, c, variant_slug, body_slug, transmission, fuel_type), conditions))
    found = [p for p in pages if p is not None]
    if not found:
        return None

    def merge(key, id_field=None):
        out, seen = [], set()
        for p in found:
            for item in p[key]:
                ident = item[id_field] if id_field else item
                if ident not in seen:
                    seen.add(ident)
                    out.append(item)
        return out

    return {
        "years": sorted(merge("years"), reverse=True),
        "body_types": merge("body_types", "slug"),
        "transmissions": merge("transmissions"),
        "fuel_types": merge("fuel_types"),
    }

@carlistRouter.get('/all_vehicles', dependencies=[Depends(require_admin)])
def vehicle_map(make: str = None):
    if not make:
        return VEHICLE_MAP
    if make.lower() not in VEHICLE_MAP:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"meta": f"Unknown make: {make}"})
    return VEHICLE_MAP[make.lower()]