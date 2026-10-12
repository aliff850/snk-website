import os
import re
import concurrent.futures
from typing import Optional, Any, Dict, List, Literal
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(".env.local")

supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

valuationRouter = APIRouter(prefix="/valuation", tags=["valuation"])

try:
    from api.utils.carlist.carlist_router import SearchQuery as CarlistSearchQuery, SearchFilters as CarlistSearchFilters, Search as search_carlist, find_listings as find_carlist_listings, VEHICLE_MAP as CARLIST_MAP
except ImportError:
    try:
        from utils.carlist.carlist_router import SearchQuery as CarlistSearchQuery, SearchFilters as CarlistSearchFilters, Search as search_carlist, find_listings as find_carlist_listings, VEHICLE_MAP as CARLIST_MAP
    except ImportError:
        search_carlist = None

try:
    from api.utils.mudah.mudah_router import search as search_mudah, CarSearchQuery as MudahCarQuery, MotorSearchQuery as MudahMotorQuery
except ImportError:
    try:
        from utils.mudah.mudah_router import search as search_mudah, CarSearchQuery as MudahCarQuery, MotorSearchQuery as MudahMotorQuery
    except ImportError:
        search_mudah = None

from api.utils.error_log import log_error
from api.utils.auth import get_current_user, use_token, get_tokens, is_admin
from api.utils.listings import (
    VehicleDetails, slug, mudah_car_query, mudah_motorcycle_query, carlist_query,
    filter_mudah_by_variant, from_mudah, from_carlist, for_viewer,
)

def normalize_db_model(make: str, model: str) -> List[str]:
    make_clean = make.strip().upper()
    model_clean = model.strip().upper()
    candidates = [model_clean]
    if make_clean in ("BMW", "MERCEDES-BENZ", "MERCEDES"):
        stripped = model_clean.replace("SERIES", "").replace("CLASS", "").replace("-", " ").strip()
        if stripped and stripped not in candidates: candidates.append(stripped)
    no_spaces = model_clean.replace(" ", "").replace("-", "")
    if no_spaces not in candidates: candidates.append(no_spaces)
    return candidates

# Vehicle category values in our database for each tab on the Insurable Value page.
# Both spellings: older data was loaded in lowercase, the admin upload page saves UPPERCASE.
CATEGORIES = {
    "car": ["PRIVATE", "private"],
    "motorcycle": ["MOTORCYCLE", "motorcycle"],
    "light": ["LIGHT", "light"],
    "heavy": ["HEAVY", "heavy"],
    "commercial": ["LIGHT", "light", "HEAVY", "heavy"],
}

def make_pattern(make: str) -> str:
    """Case-insensitive match where a dash and a space count as the same, so 'MERCEDES-BENZ',
    'Mercedes Benz' and 'HARLEY-DAVIDSON' all find the rows saved in the database."""
    return re.sub(r"[-\s]+", "_", make.strip())

def vehicles_query(columns: str, make: str, model: str, category: Optional[str] = None):
    """vehicles rows for a make/model, limited to one tab's categories when given."""
    # Only vehicles in the current list (older rows replaced by a newer upload are marked inactive)
    query = supabase.table("vehicles").select(columns).eq("active", True).ilike("make", make_pattern(make)).in_("model", normalize_db_model(make, model))
    return query.in_("category", CATEGORIES[category]) if category in CATEGORIES else query

@valuationRouter.get('/options/variants')
def get_variants(make: str, model: str, category: Optional[str] = None):
    try:
        res = vehicles_query("variant", make, model, category).execute()
        variant_map = {}
        for row in res.data:
            v = row.get("variant")
            if v and str(v).strip():
                clean_v = re.sub(r'\s+', ' ', str(v)).strip()
                variant_map[clean_v.upper()] = clean_v
        return {"variants": sorted(list(variant_map.values()))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@valuationRouter.get('/options/body-types')
def get_body_types(make: str, model: str, variant: str, category: Optional[str] = None):
    try:
        res = vehicles_query("style", make, model, category).ilike("variant", f"%{variant.strip()}%").execute()
        body_types = sorted(list({str(row["style"]).strip().upper() for row in res.data if row.get("style")}))
        return {"body_types": body_types}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@valuationRouter.get('/options/years')
def get_years(make: str, model: str, variant: str, style: str, category: Optional[str] = None):
    try:
        res = vehicles_query("year", make, model, category).ilike("variant", f"%{variant.strip()}%").ilike("style", style.strip()).execute()
        years = sorted(list({int(row["year"]) for row in res.data if row.get("year")}), reverse=True)
        return {"years": years}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@valuationRouter.get('/options/variant-specs')
def get_variant_specs(make: str, model: str, variant: str, style: str, year: int, category: Optional[str] = None):
    try:
        res = vehicles_query("cc, transmission, specs, import_status", make, model, category).ilike("variant", f"%{variant.strip()}%").ilike("style", style.strip()).eq("year", str(year)).execute()

        engine_ccs, engine_watts, transmissions, fuel_types = set(), set(), set(), set()
        translated_statuses = set()
        for row in res.data:
            if row.get("cc"): engine_ccs.add(str(row["cc"]).strip())
            if row.get("transmission"): transmissions.add(str(row["transmission"]).strip())
            
            specs = row.get("specs") or {}
            if isinstance(specs, dict):
                fuel = specs.get("fuel_type") or specs.get("fuel")
                if fuel: fuel_types.add(str(fuel).strip().upper())
                watt = specs.get("engine_power_watt") or specs.get("power_watt") or specs.get("watt")
                if watt: engine_watts.add(str(watt).strip())

            st = row.get("import_status")
            if st:
                clean_st = str(st).strip().upper()
                if clean_st in IMPORT_STATUS_LABELS: translated_statuses.add(IMPORT_STATUS_LABELS[clean_st])

        return {
            "engine_ccs": sorted(list(engine_ccs)), 
            "engine_watts": sorted(list(engine_watts)), 
            "transmissions": sorted(list(transmissions)), 
            "fuel_types": sorted(list(fuel_types)),
            "import_statuses": sorted(list(translated_statuses))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MarketDataRequest(BaseModel):
    vehicle_type: Literal["car", "motorcycle"] = "car"
    vehicle: VehicleDetails

@valuationRouter.post("/get_marketdata", summary="Unified market data endpoint. Costs 1 token per call.")
def get_marketdata(request: MarketDataRequest, user=Depends(get_current_user)):
    tokens_after = use_token(user)
    v = request.vehicle
    is_motorcycle = request.vehicle_type == "motorcycle"
    listings, results, errors = [], {}, {}

    # The source searches are built here rather than in the browser, so requests never name the sources
    if search_mudah:
        try:
            query = MudahMotorQuery(**mudah_motorcycle_query(v)) if is_motorcycle else MudahCarQuery(**mudah_car_query(v))
            mudah_listings = search_mudah(searchQuery=query, whitelist_attributes=None)
            # search() returns an error response instead of a list when Mudah fails
            if isinstance(mudah_listings, list):
                if not is_motorcycle:
                    mudah_listings = filter_mudah_by_variant(mudah_listings, v.variant)
                listings += [from_mudah(item) for item in mudah_listings]
        except Exception as e:
            log_error("mudah", "search_error", str(e), v.model_dump())
            errors["mudah"] = str(e)

    # The model list merges both sources, so skip Carlist for models it doesn't have
    if search_carlist and not is_motorcycle and slug(v.model) in (CARLIST_MAP.get(slug(v.make)) or {}):
        try:
            query, filters = carlist_query(v)
            carlist_listings = search_carlist(query=CarlistSearchQuery(**query), filters=CarlistSearchFilters(**filters), whitelist_attributes=None)
            listings += [from_carlist(item) for item in carlist_listings]
        except Exception as e:
            log_error("carlist", "search_error", str(e), v.model_dump())
            errors["carlist"] = str(e)

    results["listings"] = for_viewer(listings, is_admin(user))

    if not is_motorcycle and v.year:
        try:
            results["insurable"] = lookup_insurable(v)
        except Exception as e:
            log_error("insurable", "db_error", str(e), v.model_dump())
            errors["insurable"] = str(e)

    # Error messages can contain source URLs, so only admins see them (everything is in error_logs)
    return {"results": results, "errors": (errors or None) if is_admin(user) else None, "tokens_remaining": tokens_after}


# Import status as saved in the database (the uploaded list's short code) -> what the form shows
IMPORT_STATUS_LABELS = {"CBU": "Imported New", "CKD": "Local Assembled", "RECON": "Imported Recon", "RECOND": "Imported Recon", "RCN": "Imported Recon"}

def _same(a, b) -> bool:
    """Compares a database value with a form choice, ignoring case, extra spaces and '1998' vs '1998.0'."""
    norm = lambda x: re.sub(r"\.0+$", "", re.sub(r"\s+", " ", str(x)).strip().upper())
    return norm(a) == norm(b)

def lookup_insurable(v: VehicleDetails) -> dict:
    """Insurable value for the vehicle chosen on the form. Each vehicle's latest quarter gives its value (average)
    and its lowest / highest range; when the choices still match several vehicles, the widest range is shown."""
    query = supabase.table('vehicles').select('id, style, transmission, cc, import_status').eq('active', True)

    # Same make and model matching as the dropdowns (vehicles_query), so every option offered can be found
    query = query.ilike('make', make_pattern(v.make)).in_('model', normalize_db_model(v.make, v.model))

    query = query.eq('year', str(v.year))
    if v.variant: query = query.ilike('variant', v.variant.strip())
    if v.category in CATEGORIES: query = query.in_('category', CATEGORIES[v.category])

    rows = query.execute().data
    # The other choices on the form, compared in Python so differences in spacing or number format don't matter
    if v.style: rows = [r for r in rows if _same(r.get('style'), v.style)]
    if v.transmission: rows = [r for r in rows if _same(r.get('transmission'), v.transmission)]
    if v.cc: rows = [r for r in rows if _same(r.get('cc'), v.cc)]
    if v.import_status:
        rows = [r for r in rows if IMPORT_STATUS_LABELS.get(str(r.get('import_status') or '').strip().upper()) == v.import_status]
    if not rows:
        return {"meta": "No vehicle found"}

    vehicle_ids = [row['id'] for row in rows]
    val_res = supabase.table('vehicle_values').select('vehicle_id, value, lowest_value, highest_value, valuation_period').in_('vehicle_id', vehicle_ids).execute()
    if not val_res.data:
        return {"meta": "No vehicle values found"}

    # Each vehicle can have values from several quarters; use only its latest one
    latest = {}
    for row in val_res.data:
        if row.get('value') is None:
            continue
        current = latest.get(row['vehicle_id'])
        if current is None or str(row['valuation_period']) > str(current['valuation_period']):
            latest[row['vehicle_id']] = row
    if not latest:
        return {"meta": "No valid values found"}

    values = [float(r['value']) for r in latest.values()]
    # A vehicle without a saved range falls back to its value
    lows = [float(r['lowest_value'] if r.get('lowest_value') is not None else r['value']) for r in latest.values()]
    highs = [float(r['highest_value'] if r.get('highest_value') is not None else r['value']) for r in latest.values()]
    return {"lowest": int(min(lows)), "average": int(sum(values) / len(values)), "highest": int(max(highs))}


# --- Insurable Value page (our database only) ---

@valuationRouter.get('/options/makes')
def get_makes(category: str = "car"):
    try:
        cats = CATEGORIES.get(category, CATEGORIES["car"])
        return {"makes": [row["make"] for row in supabase.rpc("vehicle_makes", {"p_categories": cats}).execute().data]}
    except Exception as e:
        log_error("insurable", "db_error", f"vehicle_makes: {e}")
        raise HTTPException(status_code=500, detail="Could not load makes.")


@valuationRouter.get('/options/models')
def get_models(make: str, category: str = "car"):
    try:
        cats = CATEGORIES.get(category, CATEGORIES["car"])
        return {"models": [row["model"] for row in supabase.rpc("vehicle_models", {"p_make": make.strip(), "p_categories": cats}).execute().data]}
    except Exception as e:
        log_error("insurable", "db_error", f"vehicle_models: {e}", {"make": make})
        raise HTTPException(status_code=500, detail="Could not load models.")


@valuationRouter.post("/insurable", summary="Insurable value from our database. Costs 1 token per call.")
def insurable(vehicle: VehicleDetails, user=Depends(get_current_user)):
    if not vehicle.year:
        raise HTTPException(status_code=400, detail="Please select a year.")
    tokens_after = use_token(user)
    try:
        result = lookup_insurable(vehicle)
    except Exception as e:
        log_error("insurable", "db_error", str(e), vehicle.model_dump())
        result = {"meta": "Lookup failed"}
    return {"insurable": result, "tokens_remaining": tokens_after}


# --- Current Market Valuation page (market source only, using its own filter values) ---

# Import status shown to users -> the market source's listing conditions to search.
# The source's "new" and "used" listings both cover Imported New and Local Assembled cars.
IMPORT_STATUS_CONDITIONS = {
    "imported_new": ["new", "used"],
    "local_assembled": ["new", "used"],
    "imported_recon": ["recon"],
}


class MarketSearch(BaseModel):
    # Carlist's own path for the chosen model, e.g. "honda/civic" or "bmw/1-series/118i"
    path: str
    import_status: Literal["imported_new", "local_assembled", "imported_recon"] = "local_assembled"
    variant_slug: Optional[str] = None
    body_slug: Optional[str] = None
    # Required: chosen last, from the years that have listings for the other choices
    year: int
    transmission: Optional[Literal["automatic", "manual"]] = None
    fuel_type: Optional[str] = None


@valuationRouter.post("/market", summary="Current market listings. Costs 1 token per call.")
def market(search: MarketSearch, user=Depends(get_current_user)):
    segments = search.path.strip("/").lower().split("/")
    if len(segments) < 2:
        raise HTTPException(status_code=400, detail="Please select a model.")
    for slug_value in (search.variant_slug, search.body_slug):
        if slug_value and not re.fullmatch(r"[A-Za-z0-9\-]+", slug_value):
            raise HTTPException(status_code=400, detail="Invalid option.")
    queries = [
        CarlistSearchQuery(make=segments[0], model=segments[-1], path="/".join(segments), condition=condition,
                           variant_slug=search.variant_slug, body_slug=search.body_slug)
        for condition in IMPORT_STATUS_CONDITIONS[search.import_status]
    ]
    filters = CarlistSearchFilters(min_year=search.year, max_year=search.year, transmission=search.transmission, fuel_type=search.fuel_type)
    tokens_after = use_token(user)

    items, dates = [], []
    # Each condition is a separate search (and saved result); run them at the same time
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(queries)) as executor:
        futures = [executor.submit(find_carlist_listings, q, filters) for q in queries]
        for future in futures:
            try:
                found, scraped_at = future.result()
                items += found
                if scraped_at: dates.append(scraped_at)
            except Exception as e:
                log_error("carlist", "search_error", str(e), search.model_dump())
    listings = for_viewer([from_carlist(item) for item in items], is_admin(user))
    # Show the oldest date when the results were combined from more than one search
    return {"listings": listings, "as_of": min(dates) if dates else None, "tokens_remaining": tokens_after}


@valuationRouter.get('/tokens', summary="Get the current user's token count (applies the weekly refill if due).")
def tokens(user=Depends(get_current_user)):
    return get_tokens(user)