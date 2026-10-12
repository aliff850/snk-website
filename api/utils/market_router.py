from typing import Literal

from fastapi import APIRouter, Depends, HTTPException

from api.utils.auth import get_current_user
from api.utils.carlist.carlist_router import VEHICLE_MAP as CARLIST_CARS, get_menu
from api.utils.mudah.mudah_router import VEHICLE_MAP as MUDAH_CARS, MOTORCYCLE_MAP as MUDAH_MOTORCYCLES

# Neutral make/model lists for the dropdowns, merged from all sources without naming them
marketRouter = APIRouter(prefix="/market")

# Keys inside the maps that are ids rather than models
ID_KEYS = ("__id__", "@id")


def _maps(vehicle_type: str):
    return [MUDAH_MOTORCYCLES] if vehicle_type == "motorcycle" else [MUDAH_CARS, CARLIST_CARS]


@marketRouter.get("/makes")
def makes(type: Literal["car", "motorcycle"] = "car"):
    return {"makes": sorted({make for m in _maps(type) for make in m})}


@marketRouter.get("/models")
def models(make: str, type: Literal["car", "motorcycle"] = "car"):
    found = set()
    for m in _maps(type):
        entry = m.get(make.lower())
        if isinstance(entry, dict):
            found.update(k for k in entry if k not in ID_KEYS)
    return {"models": sorted(found)}


# --- Current Market Valuation page: every dropdown is Carlist's own filter menu ---

# Login required: the first time a page is opened it costs a scraping request (then saved for 30 days)
@marketRouter.get("/options/menu")
def market_menu(path: str = "", user=Depends(get_current_user)):
    """Carlist's filter menus for one step of the form: "" (makes), "bmw" (model groups / models),
    "bmw/1-series" (models in the group), "bmw/1-series/118i" (variants, body types, years...)."""
    menu = get_menu(path)
    if menu is None:
        raise HTTPException(status_code=503, detail="Could not load the options right now. Please try again.")
    return menu
