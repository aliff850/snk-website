from functools import reduce
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, model_validator
from cloudscraper import create_scraper
import re

from typing import Literal, Optional, Annotated
from json import load, loads
from os import path
from lxml import etree

carlistRouter = APIRouter(prefix="/carlist")
htmlParser = etree.HTMLParser()
get = create_scraper().get

# Fetch vehicle group info from vehicle_map.json
vehicle_map_path = path.join(path.dirname(__file__), "vehicle_map.json")
with open(vehicle_map_path, "r") as f:
    VEHICLE_MAP = load(f)

#URL = """
# https://www.carlist.my/
# {condition}cars-for-sale/
# {make}/
# {group}/
# {model}/
# {variant}/
# body-{body}/
# malaysia?page_size={size}&
# page_number=1&
# sort=price.{order}&
# &_pjax=#classified-listings-result&
# min_year={min_year}&
# max_year={max_year}&
# min_price={min_price}&
# max_price={max_price}&
# min_mileage={min_mileage}&
# max_mileage={max_mileage}&
# transmission={transmission}&
# fuel_type={fuel_type}&
# driven_wheel={driven_wheel}
# """

class SearchQuery(BaseModel):
    make: str
    model: str
    condition:      Optional[Literal['recon', 'used', 'new']] = None
    variant:        Optional[str] = None
    body_type:      Optional[Literal['Convertible', 'Coupe', 'Hatchback', 'Lorry', 'MPV', 'pickup', 'suv', 'sedan', 'van', 'wagon']] = None

    @field_validator('make')
    @classmethod
    def validate_make(cls, v: str) -> str:
        """Validate that the make exists in VEHICLE_MAP."""
        make_lower = v.lower()
        if make_lower not in VEHICLE_MAP:
            raise RequestValidationError(f"Make '{v}' not found in vehicle map")
        return v

    @model_validator(mode='after')
    def validate_model(self):
        """Validate that the model exists for the given make in VEHICLE_MAP."""
        make_lower = self.make.lower()
        model_lower = self.model.lower()
        
        models = VEHICLE_MAP.get(make_lower)
        if models is None:
            # This should not happen if make validator passed, but double-check
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
    transmission:   Optional[Literal['Manual', 'Automatic']] = None
    fuel_type:      Optional[Literal['Petrol', 'Hybrid', 'Diesel', 'Electric', 'Unleaded']] = None
    driven_wheel:   Optional[Literal['FWD', 'AWD', 'RWD', '4WD']] = None

    @field_validator('sort', mode='after')
    def format_sort(value: str):
        if not value: return

        return "price."+value


def build_url(query: SearchQuery, filters: SearchFilters) -> str:
    """
    Build a Carlist.my URL based on provided search parameters.
    Omits any parameters that were not provided.
    
    Args:
        query: SearchQuery object containing search parameters
        filters: SearchFilters object containing search filters
        
    Returns:
        str: Formatted URL string
    """
    # Build query components
    path_parts = ["https://www.carlist.my/"]
    
    # Optional path parameters
    path_parts.append(f"{query.condition if query.condition else ''}-cars-for-sale/")
    path_parts.append(f"{query.make}/")
    
    group = None
    models = VEHICLE_MAP.get(query.make.lower(), [])
    # models is a list of {model: group} dicts
    if models:
        group = models.get(query.model.lower())
        if group:
            path_parts.append(f"{group}/{query.model}/")
        else:
            path_parts.append(f"{query.model}/")

    if query.variant:
        path_parts.append(f"{query.variant}/")
    
    if query.body_type:
        path_parts.append(f"body-{query.body_type}/")

    # Add malaysia base query
    path_parts.append("malaysia")
    
    # Combine path
    url = "".join(path_parts)
    
    # Build filter parameters
    query_params = ["page_number=1"]
    filter_items = filters.model_dump().items()

    # APPEND ALL FILTERS TO QUERY PARAMETERS
    for parameter, value in filter_items:
        if not value: continue
        query_params.append(f'{parameter}={str(value).split(",")[0]}')

    # Add query parameters to URL
    url += "?" + "&".join(query_params)
    
    return url
    
# def temp_map_vehicles():
#     from json import load, dump
#     keywords = load(open(r'api\utils\carlist\temp_vehicle_keywords.json'))
#     keywords = list(keywords.keys())

#     make_model_group = {}
#     for i in keywords:
#         cleaned = i.strip('/').split('/')[1:-1]
#         if len(cleaned) == 1: continue

#         # Create the array for models of a make
#         if not make_model_group.get(cleaned[0]):
#             make_model_group[cleaned[0]] = {}

#         make_model_group[cleaned[0]][cleaned[-1]] = None if cleaned[1] == cleaned[-1] else cleaned[1]

#     with open(r'api\utils\carlist\vehicle_map.json', 'w') as f:
#         dump(make_model_group, f)

# temp_map_vehicles()

# Function to search Carlist
@carlistRouter.post('/search')
def Search(query: SearchQuery, filters: SearchFilters,
            whitelist_attributes: Optional[list[str]] = ["brand.name", "model", "itemCondition", "vehicleModelDate", "fuelType", "offers.price", "mileageFromOdometer.value", "vehicleTransmission", "image[0].url", "mainEntityOfPage"]):
    # print(query.model_dump())
    URL = build_url(query, filters)
    print(f"Generated URL: {URL}")

    html = get(URL)
    if not html.ok and html.status_code != 200:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"meta": "An unexpected error occured."}
        )

    tree = etree.fromstring(html.text, htmlParser)
    data = loads(tree.xpath('//script[@type="application/ld+json"]')[0].text)[-1].get("itemListElement")
    if not data: return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"meta": f"No listings for '{query.condition} {query.make} {query.model}' found."}
        )
    listings = [i['item'] for i in data]
    
    # Filter for selected attributes
    response = []
    if not whitelist_attributes: return listings
    for item in listings:
        filtered_item = {}
        for attribute in whitelist_attributes:
            # keys = attribute.split('.')
            # Changed this to handle square brackets (due to the image attribute)
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

        response.append(filtered_item)
    
    return response


@carlistRouter.get('/all_vehicles',
                 summary="Returns a map of every make and model available with their corresponding IDs. Or return a list of models from a specified make with their corresponding IDs",
                 response_model=dict[str, dict[str, str | None]] | dict[str, str | None])
def vehicle_map(make: str = None):
    """
    Get all makes and models from Carlist vehicle map.
    If make is provided, returns only models for that make.
    Otherwise returns the complete vehicle map.
    """
    # Return full map if no make specified
    if not make: 
        return VEHICLE_MAP

    # Validate and return specific make's models
    make_lower = make.lower()
    if make_lower not in VEHICLE_MAP:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"meta": f"Unknown make provided: {make}"}
        )

    return VEHICLE_MAP[make_lower]


# Search(SearchQuery(
#     make="toyotaas",
#     model="vios",
#     condition="used",
#     variant="1-5-g",
#     # body_type="suv"
# ), SearchFilters(
#     page_size=5,
#     sort="asc",
#     min_year=2022,
#     max_year=2024,
#     # min_price=10_000,
#     # max_price=1_000_000,
#     # min_mileage=5000,
#     # max_mileage=100_000,
# ))

# temp_map_vehicles()