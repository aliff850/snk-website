from functools import reduce
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator
import re
import traceback
from urllib.parse import unquote

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


# UPGRADE: Added dynamic page_number parameter to support the pagination loop
def build_url(query: SearchQuery, filters: SearchFilters, strict=True, page_number=1) -> str:
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
    
    # Inject the dynamic page number here
    query_params = [f"page_number={page_number}", "page_size=50"]
    filter_items = filters.model_dump(exclude_none=True).items()

    for parameter, value in filter_items:
        if not value: continue
        # Don't add page_size again if it's already hardcoded above
        if parameter == 'page_size': continue
        query_params.append(f'{parameter}={str(value).split(",")[0]}')

    if query_params:
        url += "?" + "&".join(query_params)
    
    return url


@carlistRouter.post('/search')
def Search(query: SearchQuery, filters: SearchFilters,
            whitelist_attributes: Optional[list[str]] = None):
    
    seen_identifiers = set()
    result_list = []
    
    # UPGRADE: Pagination Loop. Scrape up to 4 pages (roughly 200 raw cars) to bypass Carlist's limit
    max_pages_to_scrape = 4
    
    print(f"\n{'='*50}\n[CARLIST MASTER DIAGNOSTIC START]")
    
    for current_page in range(1, max_pages_to_scrape + 1):
        target_url = build_url(query, filters, strict=True, page_number=current_page)
        print(f"\n[PAGE {current_page}] Fetching: {target_url}")
        
        try:
            response = requests.get(target_url, headers=HEADERS, impersonate="chrome", timeout=15)
        except Exception as e:
            print(f"[FATAL NETWORK ERROR ON PAGE {current_page}]: {e}")
            if current_page == 1:
                return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"meta": f"Network error: {str(e)}"})
            break

        if response.status_code == 404 and (query.variant or query.body_type):
            print(f"[PAGE {current_page}] STRICT 404: Retrying without variant/body_type slug...")
            target_url = build_url(query, filters, strict=False, page_number=current_page)
            try:
                response = requests.get(target_url, headers=HEADERS, impersonate="chrome", timeout=15)
            except Exception as e:
                print(f"[FALLBACK NETWORK ERROR]: {e}")
                pass

        if not response.ok:
            print(f"[HTTP FAIL] Status {response.status_code}")
            if current_page == 1:
                return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"meta": f"Carlist returned status: {response.status_code}"})
            break

        try:
            tree = etree.fromstring(response.text, htmlParser)
            article_nodes = tree.xpath('//article[contains(@class, "listing")]')
            print(f"[PAGE {current_page}] Found {len(article_nodes)} raw HTML cards.")
            
            if not article_nodes:
                break

            stats = {"added": 0, "duplicates": 0, "missing_price": 0}
            
            for node in article_nodes:
                identifier = node.get('data-listing-id') or node.get('data-url')
                if identifier in seen_identifiers:
                    stats["duplicates"] += 1
                    continue
                if identifier:
                    seen_identifiers.add(identifier)
                
                make = node.get('data-make')
                model = node.get('data-model')
                variant = node.get('data-variant')
                year = node.get('data-year')
                mileage = node.get('data-mileage')
                transmission = node.get('data-transmission')
                condition = node.get('data-ad-type')
                url = node.get('data-url')
                
                image_src = node.get('data-image-src')
                if not image_src:
                    img_nodes = node.xpath('.//img[contains(@class, "listing__img")]/@data-src')
                    if img_nodes: image_src = img_nodes[0]
                    
                price = None
                
                share_text = node.get('data-default-line-text') or node.get('data-default-whatsapp-text')
                if share_text:
                    decoded_text = unquote(share_text)
                    price_match = re.search(r'RM\s*([\d,]+)', decoded_text)
                    if price_match:
                        clean_price_str = price_match.group(1).replace(',', '')
                        if clean_price_str.isdigit():
                            price = int(clean_price_str)
                
                if not price:
                    price_nodes = node.xpath('.//span[contains(@class, "listing__price")]/text()')
                    for p_text in price_nodes:
                        clean_p = re.sub(r'[^\d]', '', p_text)
                        if clean_p.isdigit() and int(clean_p) > 5000:
                            price = int(clean_p)
                            break
                
                filtered_item = {
                    "image": image_src,
                    "image[0].url": image_src,
                    "brand.name": make,
                    "model": model,
                    "variant": variant,
                    "itemCondition": condition,
                    "vehicleModelDate": year,
                    "fuelType": None,
                    "offers.price": price,
                    "mileageFromOdometer.value": int(mileage) if mileage and mileage.isdigit() else None,
                    "vehicleTransmission": transmission,
                    "mainEntityOfPage": url,
                    "url": url
                }
                
                if not filtered_item["offers.price"]:
                    stats["missing_price"] += 1
                    continue

                if whitelist_attributes:
                    for attribute in whitelist_attributes:
                        if attribute not in filtered_item:
                            filtered_item[attribute] = None

                result_list.append(filtered_item)
                stats["added"] += 1
                
            print(f"[PAGE {current_page} STATS] Passed: {stats['added']} | Dropped as Duplicates: {stats['duplicates']} | Dropped (No Price Found): {stats['missing_price']}")
            
            if stats["added"] == 0 and stats["missing_price"] == 0:
                break
                
        except Exception as e:
            # THIS IS THE MAGIC LINE: It will print the exact line of code that caused the crash
            print(f"[FATAL PARSING ERROR ON PAGE {current_page}]:")
            traceback.print_exc()
            break

    print(f"\n[FINAL CARLIST COUNT]: {len(result_list)} unique cars sent to frontend.")
    print(f"{'='*50}\n")

    if not result_list:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"meta": f"No listings for '{query.condition or ''} {query.make} {query.model}' found."})

    return result_list


@carlistRouter.get('/all_vehicles')
def vehicle_map(make: str = None):
    if not make: return VEHICLE_MAP
    make_lower = make.lower().replace(" ", "-")
    if make_lower not in VEHICLE_MAP:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"meta": f"Unknown make: {make}"})
    return VEHICLE_MAP[make_lower]