from functools import reduce
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator
import re
import traceback

from typing import Literal, Optional, Annotated
from json import load, loads
from os import path
from lxml import etree

from curl_cffi import requests

carlistRouter = APIRouter(prefix="/carlist")
htmlParser = etree.HTMLParser()

# Fetch vehicle group info from vehicle_map.json
vehicle_map_path = path.join(path.dirname(__file__), "vehicle_map.json")
with open(vehicle_map_path, "r") as f:
    VEHICLE_MAP = load(f)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.carlist.my/",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Upgrade-Insecure-Requests": "1"
}

def extract_all_item_lists(data, path="root"):
    items = []
    if isinstance(data, dict):
        if 'itemListElement' in data:
            val = data['itemListElement']
            if isinstance(val, list):
                print(f"[CARLIST DEBUG-PARSE] Found 'itemListElement' with {len(val)} items at '{path}'")
                items.extend(val)
        for key, val in data.items():
            if key != 'itemListElement':
                items.extend(extract_all_item_lists(val, f"{path}.{key}"))
    elif isinstance(data, list):
        for idx, entry in enumerate(data):
            items.extend(extract_all_item_lists(entry, f"{path}[{idx}]"))
    return items


class SearchQuery(BaseModel):
    make: str
    model: str
    condition: Optional[str] = None
    variant: Optional[str] = None
    body_type: Optional[str] = None
    cc: Optional[str] = None

    @field_validator('condition', mode='before')
    @classmethod
    def map_condition(cls, v):
        if not v: return None
        v_str = str(v).lower()
        if 'recon' in v_str or 'rebuilt' in v_str: return 'recon'
        if 'new' in v_str: return 'new'
        if 'used' in v_str: return 'used'
        return None

    @model_validator(mode='after')
    def validate_model(self):
        make_lower = self.make.lower().replace(" ", "-")
        model_lower = self.model.lower().replace(" ", "-")
        
        models = VEHICLE_MAP.get(make_lower)
        if models is None:
            raise RequestValidationError(f"Make '{self.make}' not found in vehicle map.")
        
        if model_lower not in models:
            raise RequestValidationError(f"Model '{self.model}' not found for make '{self.make}'.")
        
        return self


class SearchFilters(BaseModel):
    page_size:      Optional[Annotated[int, Field(gt=1)]] = 50
    sort:           Optional[Literal['asc', 'desc']] = None
    min_year:       Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    max_year:       Optional[Annotated[int, Field(ge=1900, le=2100)]] = None
    min_price:      Optional[Annotated[int, Field(ge=0)]] = None
    max_price:      Optional[Annotated[int, Field(ge=0)]] = None
    min_mileage:    Optional[Annotated[int, Field(ge=0)]] = None
    max_mileage:    Optional[Annotated[int, Field(ge=0)]] = None
    transmission:   Optional[str] = None
    fuel_type:      Optional[str] = None
    driven_wheel:   Optional[str] = None

    @field_validator('sort', mode='after')
    @classmethod
    def format_sort(cls, value: str):
        if not value: return
        return "price." + value


def build_url(query: SearchQuery, filters: SearchFilters, strict=True) -> str:
    path_parts = ["https://www.carlist.my/"]
    
    if query.condition:
        path_parts.append(f"{query.condition}-cars-for-sale/")
    else:
        path_parts.append("cars-for-sale/")
        
    safe_make = query.make.lower().replace(" ", "-")
    safe_model = query.model.lower().replace(" ", "-")
    
    path_parts.append(f"{safe_make}/")
    
    group = None
    models = VEHICLE_MAP.get(safe_make, [])
    if models:
        group = models.get(safe_model)
        if group and group != "no-group":
            path_parts.append(f"{group}/{safe_model}/")
        else:
            path_parts.append(f"{safe_model}/")

    if strict:
        if query.variant:
            variant_slug = query.variant.lower().replace(" ", "-")
            if query.cc and query.cc.isdigit():
                cc_val = int(query.cc)
                rounded_cc = round(cc_val / 100) / 10
                cc_slug = f"{rounded_cc:.1f}".replace(".", "-")
                if not variant_slug.startswith(cc_slug):
                    variant_slug = f"{cc_slug}-{variant_slug}"
            
            path_parts.append(f"{variant_slug}/")
            
        if query.body_type:
            bt_slug = query.body_type.lower().replace(' ', '-')
            path_parts.append(f"body-{bt_slug}/")

    path_parts.append("malaysia")
    url = "".join(path_parts)
    
    query_params = ["page_number=1"]
    filter_items = filters.model_dump(exclude_none=True).items()

    for parameter, value in filter_items:
        if not value: continue
        query_params.append(f'{parameter}={str(value).split(",")[0]}')

    if query_params:
        url += "?" + "&".join(query_params)
    
    return url


@carlistRouter.post('/search')
def Search(query: SearchQuery, filters: SearchFilters,
            whitelist_attributes: Optional[list[str]] = None):
    
    print(f"\n{'='*60}\n[CARLIST DIAGNOSTIC SEARCH START]")
    print(f"[CARLIST INCOMING WHITELIST]: {whitelist_attributes}")

    target_url = build_url(query, filters, strict=True)
    print(f"[CARLIST FETCH URL]: {target_url}")
    
    try:
        response = requests.get(target_url, headers=HEADERS, impersonate="chrome", timeout=15)
        print(f"[CARLIST HTTP STATUS]: {response.status_code}")
    except Exception as e:
        print(f"[CARLIST HTTP ERROR]: {str(e)}")
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"meta": f"Network error: {str(e)}"})

    if response.status_code == 404 and (query.variant or query.body_type):
        print("[CARLIST STRICT 404]: Retrying without variant/body_type slug...")
        target_url = build_url(query, filters, strict=False)
        print(f"[CARLIST FALLBACK URL]: {target_url}")
        try:
            response = requests.get(target_url, headers=HEADERS, impersonate="chrome", timeout=15)
            print(f"[CARLIST FALLBACK HTTP STATUS]: {response.status_code}")
        except Exception as e:
            print(f"[CARLIST FALLBACK HTTP ERROR]: {str(e)}")
            pass

    if not response.ok:
        print(f"[CARLIST FINAL HTTP FAIL]: Status {response.status_code}")
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"meta": f"Carlist returned status: {response.status_code}"})

    tree = etree.fromstring(response.text, htmlParser)
    
    # Check total HTML listing cards on the actual page
    article_nodes = tree.xpath('//article | //div[contains(@class, "listing")] | //div[contains(@class, "card")]')
    print(f"[CARLIST HTML NODES]: Found {len(article_nodes)} potential card/article elements in HTML.")

    script_tags = tree.xpath('//script[@type="application/ld+json"]')
    print(f"[CARLIST JSON-LD TAGS]: Found {len(script_tags)} ld+json script tags.")

    raw_items = []
    for idx, tag in enumerate(script_tags):
        if tag.text:
            try:
                parsed_json = loads(tag.text)
                found = extract_all_item_lists(parsed_json, path=f"tag[{idx}]")
                if found:
                    print(f"[CARLIST SCRIPT #{idx+1}]: Extracted {len(found)} itemListElement entries.")
                    raw_items.extend(found)
                else:
                    tag_type = parsed_json.get('@type') if isinstance(parsed_json, dict) else type(parsed_json)
                    print(f"[CARLIST SCRIPT #{idx+1}]: @type='{tag_type}', no 'itemListElement'.")
            except Exception as e:
                print(f"[CARLIST SCRIPT #{idx+1} JSON ERROR]: {str(e)}")
                continue

    print(f"[CARLIST TOTAL RAW ITEMS BEFORE DEDUP]: {len(raw_items)}")

    seen_identifiers = set()
    unique_listings = []
    for entry in raw_items:
        item = entry.get('item', {}) if isinstance(entry, dict) else {}
        if not item:
            continue
        
        identifier = item.get('mainEntityOfPage') or item.get('url') or item.get('offers', {}).get('url') or str(item.get('name'))
        if identifier and identifier in seen_identifiers:
            continue
        if identifier:
            seen_identifiers.add(identifier)
            
        unique_listings.append(item)

    print(f"[CARLIST UNIQUE LISTINGS EXTRACTED]: {len(unique_listings)}")

    if unique_listings:
        sample = unique_listings[0]
        print(f"[CARLIST SAMPLE RAW LISTING KEYS]: {list(sample.keys())}")
        print(f"[CARLIST SAMPLE RAW IMAGE FIELD]: {sample.get('image')}")

    result_list = []
    for idx, item in enumerate(unique_listings):
        # Extract Image URL
        image_url = None
        raw_img = item.get('image') or item.get('photos') or item.get('thumbnailUrl')
        
        if isinstance(raw_img, str):
            image_url = raw_img
        elif isinstance(raw_img, list) and len(raw_img) > 0:
            first_elem = raw_img[0]
            if isinstance(first_elem, str):
                image_url = first_elem
            elif isinstance(first_elem, dict):
                image_url = first_elem.get('url') or first_elem.get('contentUrl')
        elif isinstance(raw_img, dict):
            image_url = raw_img.get('url') or raw_img.get('contentUrl')

        if idx < 3:
            print(f"[CARLIST LISTING #{idx+1} RESOLVED IMAGE]: {image_url}")

        # Extract attributes
        filtered_item = {
            "image": image_url,
            "image[0].url": image_url,
            "brand.name": (item.get('brand', {}).get('name') if isinstance(item.get('brand'), dict) else item.get('brand')),
            "model": item.get('model'),
            "itemCondition": item.get('itemCondition'),
            "vehicleModelDate": item.get('vehicleModelDate'),
            "fuelType": item.get('fuelType'),
            "offers.price": (item.get('offers', {}).get('price') if isinstance(item.get('offers'), dict) else item.get('offers.price')),
            "mileageFromOdometer.value": (item.get('mileageFromOdometer', {}).get('value') if isinstance(item.get('mileageFromOdometer'), dict) else item.get('mileageFromOdometer.value')),
            "vehicleTransmission": item.get('vehicleTransmission'),
            "mainEntityOfPage": item.get('mainEntityOfPage') or item.get('url'),
            "url": item.get('mainEntityOfPage') or item.get('url')
        }

        # Keep extra attributes if custom whitelist provided
        if whitelist_attributes:
            for attribute in whitelist_attributes:
                if attribute in filtered_item:
                    continue
                keys = [m for part in attribute.split('.') for m in re.findall(r'([^\[\]]+)', part)]
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

        result_list.append(filtered_item)
    
    print(f"[CARLIST RETURNING {len(result_list)} ITEMS TO BACKEND/FRONTEND]")
    print(f"{'='*60}\n")
    return result_list


@carlistRouter.get('/all_vehicles')
def vehicle_map(make: str = None):
    if not make: return VEHICLE_MAP
    make_lower = make.lower().replace(" ", "-")
    if make_lower not in VEHICLE_MAP:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"meta": f"Unknown make: {make}"})
    return VEHICLE_MAP[make_lower]