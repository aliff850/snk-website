import os
import re
import concurrent.futures
from typing import Literal, Optional, Annotated
from json import load, loads
from os import path

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator
from lxml import etree
from dotenv import load_dotenv

# Database and Scraping API imports
from supabase import create_client, Client
from zenrows import ZenRowsClient

# --- SETUP CREDENTIALS ---
# Load your .env.local file to grab the keys
load_dotenv(".env.local")

# Initialize the Supabase client
supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") 
supabase: Client = create_client(supabase_url, supabase_key)

carlistRouter = APIRouter(prefix="/carlist")

# Fetch vehicle group info from vehicle_map.json
vehicle_map_path = path.join(path.dirname(__file__), "vehicle_map.json")
with open(vehicle_map_path, "r") as f:
    VEHICLE_MAP = load(f)

class SearchQuery(BaseModel):
    make: str
    model: str
    condition: str = "used"  # Defaulting to "used" to prevent broken URLs
    variant: Optional[str] = None
    body_type: Optional[str] = None

    @field_validator('make')
    @classmethod
    def validate_make(cls, v: str) -> str:
        make_lower = v.lower()
        if make_lower not in VEHICLE_MAP:
            raise RequestValidationError(f"Make '{v}' not found in vehicle map")
        return v

    @model_validator(mode='after')
    def validate_model(self):
        make_lower = self.make.lower()
        model_lower = self.model.lower()
        models = VEHICLE_MAP.get(make_lower)
        if model_lower not in models:
            raise RequestValidationError(f"Model '{self.model}' not found for make '{self.make}'.")
        return self


class SearchFilters(BaseModel):
    page_size: Optional[Annotated[int, Field(gt=1)]] = 50
    sort: Optional[Literal['asc', 'desc']] = None
    min_year: Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    max_year: Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    min_price: Optional[Annotated[int, Field(ge=0)]] = None
    max_price: Optional[Annotated[int, Field(ge=0)]] = None
    min_mileage: Optional[Annotated[int, Field(ge=0)]] = None
    max_mileage: Optional[Annotated[int, Field(ge=0)]] = None
    transmission: Optional[Literal['Manual', 'Automatic']] = None
    fuel_type: Optional[Literal['Petrol', 'Hybrid', 'Diesel', 'Electric', 'Unleaded']] = None
    driven_wheel: Optional[Literal['FWD', 'AWD', 'RWD', '4WD']] = None

    @field_validator('sort', mode='after')
    def format_sort(cls, value: str):
        if not value: return None
        return "price."+value


def build_url(query: SearchQuery, filters: SearchFilters) -> str:
    path_parts = ["https://www.carlist.my/"]
    path_parts.append(f"{query.condition}-cars-for-sale/")
    path_parts.append(f"{query.make}/")
    
    group = None
    models = VEHICLE_MAP.get(query.make.lower(), [])
    if models:
        group = models.get(query.model.lower())
        if group:
            path_parts.append(f"{group}/{query.model}/")
        else:
            path_parts.append(f"{query.model}/")

    if query.variant: path_parts.append(f"{query.variant}/")
    if query.body_type: path_parts.append(f"body-{query.body_type}/")
    path_parts.append("malaysia")
    
    url = "".join(path_parts)
    query_params = ["page_number=1"]
    
    for parameter, value in filters.model_dump().items():
        if not value: continue
        query_params.append(f'{parameter}={str(value).split(",")[0]}')

    url += "?" + "&".join(query_params)
    return url

def zenrows_scrape(url: str):
    """Uses ZenRows API to bypass Cloudflare and fetch the HTML."""
    api_key = os.environ.get("ZENROWS_API_KEY")
    if not api_key:
        print("ZENROWS_API_KEY is missing from .env.local!")
        return None
        
    client = ZenRowsClient(api_key)
    
    # We added 'block_resources' to massively speed up the headless browser
    params = {
        "js_render": "true", 
        "antibot": "true",
        "premium_proxy": "true",
        "block_resources": "image,media,font,stylesheet"
    }

    try:
        print(f"Fetching via ZenRows: {url}")
        response = client.get(url, params=params)
        
        print(f"ZenRows Status Code: {response.status_code}") 
        
        if response.status_code != 200:
            print(f"ZenRows failed with status: {response.status_code}")
            return None
            
        html_content = response.text
        htmlParser = etree.HTMLParser()
        tree = etree.HTML(html_content, htmlParser)
        
        if tree is None: return None
        
        script_tags = tree.xpath('//script[@type="application/ld+json"]')
        if not script_tags: 
            print("No JSON-LD data found on the page.")
            return None
        
        data = loads(script_tags[0].text)[-1].get("itemListElement")
        return [i['item'] for i in data] if data else []
        
    except Exception as e:
        print(f"ZenRows error: {e}")
        return None


@carlistRouter.post('/search')
def Search(query: SearchQuery, filters: SearchFilters,
            whitelist_attributes: Optional[list[str]] = ["brand.name", "model", "itemCondition", "vehicleModelDate", "fuelType", "offers.price", "mileageFromOdometer.value", "vehicleTransmission", "image[0].url", "mainEntityOfPage"]):
    
    # --- 1. THE CACHE CHECK ---
    try:
        cache_response = supabase.table("carlist_cache") \
            .select("data") \
            .eq("make", query.make.lower()) \
            .eq("model", query.model.lower()) \
            .eq("condition", query.condition) \
            .execute()
            
        if cache_response.data and len(cache_response.data) > 0:
            print("Found in Supabase Cache! Skipping ZenRows scrape.")
            return cache_response.data[0]["data"]
    except Exception as e:
        print(f"Cache read error: {e}")

    # --- 2. THE ZENROWS MULTI-THREADED SCRAPE ---
    print("Not in cache. Starting concurrent ZenRows scrape for High and Low prices...")
    
    filters.sort = "asc"
    url_low = build_url(query, filters)
    
    filters.sort = "desc"
    url_high = build_url(query, filters)
    
    # Run both scrapes at the exact same time
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_low = executor.submit(zenrows_scrape, url_low)
        future_high = executor.submit(zenrows_scrape, url_high)
        
        cheapest_listings = future_low.result() or []
        priciest_listings = future_high.result() or []
    
    all_listings = cheapest_listings + priciest_listings
    
    # Deduplicate listings by URL
    unique_listings = {item.get('url'): item for item in all_listings if item.get('url')}.values()
    
    response_data = []
    if not whitelist_attributes: 
        response_data = list(unique_listings)
    else:
        for item in unique_listings:
            filtered_item = {}
            for attribute in whitelist_attributes:
                keys = []
                for part in attribute.split('.'):
                    matches = re.findall(r'([^\[\]]+)', part)
                    keys.extend(matches)
                
                value = item
                try:
                    for key in keys:
                        if isinstance(value, list) and key.isdigit():
                            value = value[int(key)]
                        else:
                            value = value[key]
                    filtered_item[attribute] = value
                except (KeyError, IndexError, TypeError):
                    filtered_item[attribute] = None
            response_data.append(filtered_item)
    
    # --- 3. SAVE TO CACHE ---
    if len(response_data) > 0:
        try:
            supabase.table("carlist_cache").upsert({
                "make": query.make.lower(),
                "model": query.model.lower(),
                "condition": query.condition,
                "data": response_data
            }).execute()
            print("Saved new ZenRows scrape to Supabase cache.")
        except Exception as e:
            print(f"Cache write error: {e}")
            
    return response_data




@carlistRouter.get('/all_vehicles')
def vehicle_map(make: str = None):
    if not make: return VEHICLE_MAP
    make_lower = make.lower()
    if make_lower not in VEHICLE_MAP:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"meta": f"Unknown make provided: {make}"})
    return VEHICLE_MAP[make_lower]