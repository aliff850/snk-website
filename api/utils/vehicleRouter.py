from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict, Any, List
from requests import post, get
import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import partial

valuationRouter = APIRouter(prefix="/utils")

# Field mapping configurations
FIELD_MAPPINGS = {
    'transmission': {
        'auto': {'mudah': 'auto', 'carlist': 'Automatic'},
        'manual': {'mudah': 'manual', 'carlist': 'Manual'}
    },
    'fuel_type': {
        'petrol': {'mudah': 'petrol', 'carlist': 'Petrol'},
        'diesel': {'mudah': 'diesal', 'carlist': 'Diesel'},  # Note: Mudah has typo
        'electric': {'mudah': 'electric', 'carlist': 'Electric'},
        'hybrid': {'mudah': None, 'carlist': 'Hybrid'}
    },
    'body_type': {
        'sedan': {'mudah': 'sedan', 'carlist': 'sedan'},
        'suv': {'mudah': 'suvs', 'carlist': 'suv'},
        'mpv': {'mudah': 'mpvs', 'carlist': 'MPV'},
        'hatchback': {'mudah': 'hatchback', 'carlist': 'Hatchback'},
        'coupe': {'mudah': 'coupe', 'carlist': 'Coupe'},
        'pickup': {'mudah': 'pick_up', 'carlist': 'pickup'},
        'sports': {'mudah': 'sports', 'carlist': None},
        'wagon': {'mudah': None, 'carlist': 'wagon'},
        'van': {'mudah': None, 'carlist': 'van'},
        'convertible': {'mudah': None, 'carlist': 'Convertible'},
        '4_wheels': {'mudah': '4_wheels', 'carlist': None},
        'other': {'mudah': 'other', 'carlist': None}
    },
    'condition': {
        'new': {'mudah': 'new', 'carlist': 'new'},
        'used': {'mudah': 'used', 'carlist': 'used'},
        'recon': {'mudah': 'recon', 'carlist': 'recon'}
    }
}


class UnifiedSearchQuery(BaseModel):
    """Unified search parameters that work across platforms"""
    make: str = Field(..., description="Vehicle make (e.g., toyota, honda)")
    model: str = Field(..., description="Vehicle model (e.g., vios, civic)")
    
    # Optional filters - common across both platforms
    year: Optional[str] = Field(None, description="Manufacturing year (YYYY format)")
    transmission: Optional[Literal['auto', 'manual']] = None
    fuel_type: Optional[Literal['petrol', 'diesel', 'electric', 'hybrid']] = None
    body_type: Optional[Literal['sedan', 'suv', 'mpv', 'hatchback', 'coupe', 'pickup', 'sports', 'wagon', 'van', 'convertible', '4_wheels', 'other']] = None
    condition: Optional[Literal['new', 'used', 'recon']] = None
    
    # Price range
    min_price: Optional[int] = Field(None, ge=0)
    max_price: Optional[int] = Field(None, ge=0)
    
    # Mileage range (in KM)
    min_mileage: Optional[int] = Field(None, ge=0)
    max_mileage: Optional[int] = Field(None, ge=0)
    
    # Result controls
    limit: Optional[int] = Field(50, gt=0, le=100, description="Maximum results per platform")
    
    # Platform selection
    sources: List[Literal['mudah', 'carlist']] = Field(['mudah', 'carlist'], description="Which platforms to search")


def transform_to_mudah_format(params: Dict[str, Any]) -> Dict[str, Any]:
    """Convert unified params to Mudah-specific format"""
    mudah_params = {
        'make_id': params['make'].lower().replace(' ', '-'),
        'model_id': params['model'].lower().replace(' ', '-'),
        'From': 0,
        'limit': params.get('limit', 50),
        'type': 'sell'
    }
    
    # Map transmission
    if params.get('transmission'):
        mapped = FIELD_MAPPINGS['transmission'].get(params['transmission'], {}).get('mudah')
        if mapped:
            mudah_params['transmission_id'] = mapped
    
    # Map fuel type
    if params.get('fuel_type'):
        mapped = FIELD_MAPPINGS['fuel_type'].get(params['fuel_type'], {}).get('mudah')
        if mapped:
            mudah_params['fueltype'] = mapped
    
    # Map body type
    if params.get('body_type'):
        mapped = FIELD_MAPPINGS['body_type'].get(params['body_type'], {}).get('mudah')
        if mapped:
            mudah_params['car_type_id'] = mapped
    
    # Map condition
    if params.get('condition'):
        mapped = FIELD_MAPPINGS['condition'].get(params['condition'], {}).get('mudah')
        if mapped:
            mudah_params['condition'] = mapped
    
    # Year range - Mudah uses YYYY-YYYY format
    if params.get('year'):
        mudah_params['mfg_year'] = f"{params['year']}-{params['year']}"
    
    # Mileage range - Mudah uses min-max format
    if params.get('min_mileage') or params.get('max_mileage'):
        min_m = params.get('min_mileage', 0)
        max_m = params.get('max_mileage', 999999)
        mudah_params['mileage'] = f"{min_m}-{max_m}"
    
    # Price range
    if params.get('min_price') or params.get('max_price'):
        min_p = params.get('min_price', 0)
        max_p = params.get('max_price', 9999999)
        mudah_params['price'] = f"{min_p}-{max_p}"
    
    return mudah_params


def transform_to_carlist_format(params: Dict[str, Any]) -> tuple[Dict[str, Any], Dict[str, Any]]:
    """Convert unified params to Carlist-specific format (query + filters)"""
    # Carlist uses separate query and filters
    query = {
        'make': params['make'].lower(),
        'model': params['model'].lower(),
    }
    
    filters = {
        'page_size': params.get('limit', 50)
    }
    
    # Map transmission
    if params.get('transmission'):
        mapped = FIELD_MAPPINGS['transmission'].get(params['transmission'], {}).get('carlist')
        if mapped:
            filters['transmission'] = mapped
    
    # Map fuel type
    if params.get('fuel_type'):
        mapped = FIELD_MAPPINGS['fuel_type'].get(params['fuel_type'], {}).get('carlist')
        if mapped:
            filters['fuel_type'] = mapped
    
    # Map body type
    if params.get('body_type'):
        mapped = FIELD_MAPPINGS['body_type'].get(params['body_type'], {}).get('carlist')
        if mapped:
            query['body_type'] = mapped
    
    # Map condition
    if params.get('condition'):
        mapped = FIELD_MAPPINGS['condition'].get(params['condition'], {}).get('carlist')
        if mapped:
            query['condition'] = mapped
    
    # Price range
    if params.get('min_price'):
        filters['min_price'] = params['min_price']
    if params.get('max_price'):
        filters['max_price'] = params['max_price']
    
    # Mileage range
    if params.get('min_mileage'):
        filters['min_mileage'] = params['min_mileage']
    if params.get('max_mileage'):
        filters['max_mileage'] = params['max_mileage']
    
    return query, filters


def normalize_mudah_listing(listing: Dict[str, Any]) -> Dict[str, Any]:
    """Convert Mudah listing to standard format"""
    return {
        'id': str(listing.get('listing_id', '')),
        'source': 'Mudah',
        'make': listing.get('make_name', ''),
        'model': listing.get('model_name', ''),
        'variant': listing.get('variant', ''),
        'year': listing.get('manufactured_year'),
        'price': listing.get('price', 0),
        'mileage': listing.get('mileage'),
        'transmission': listing.get('transmission_name', ''),
        'fuel_type': listing.get('fueltype', ''),
        'condition': listing.get('condition_name', ''),
        'image': listing.get('image', ''),
        'url': listing.get('adview_url', ''),
        'body_type': listing.get('car_type_name', ''),
        'engine_capacity': listing.get('engine_capacity'),
        'raw_data': listing
    }


def normalize_carlist_listing(listing: Dict[str, Any]) -> Dict[str, Any]:
    """Convert Carlist listing to standard format"""
    return {
        'id': listing.get('url', ''),
        'source': 'Carlist',
        'make': listing.get('brand.name', ''),
        'model': listing.get('model', ''),
        'variant': None,
        'year': listing.get('vehicleModelDate'),
        'price': listing.get('offers.price', 0),
        'mileage': listing.get('mileageFromOdometer.value'),
        'transmission': listing.get('vehicleTransmission', ''),
        'fuel_type': listing.get('fuelType', ''),
        'condition': listing.get('itemCondition', ''),
        'image': None,
        'url': listing.get('url', ''),
        'body_type': None,
        'engine_capacity': None,
        'raw_data': listing
    }


def fetch_mudah_listings(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Fetch listings from Mudah API"""
    try:
        # Construct the Mudah search query
        search_query = transform_to_mudah_format(params)
        
        # Call local Mudah endpoint
        response = post(
            'http://localhost:8000/api/mudah/search',
            json={'searchQuery': search_query},
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.ok:
            listings = response.json()
            return [normalize_mudah_listing(listing) for listing in listings]
        else:
            print(f"Mudah API error: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Error fetching from Mudah: {e}")
        return []


def fetch_carlist_listings(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Fetch listings from Carlist API"""
    try:
        query, filters = transform_to_carlist_format(params)
        
        # Call local Carlist endpoint
        response = post(
            'http://localhost:8000/api/carlist/search',
            json={'query': query, 'filters': filters},
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.ok:
            listings = response.json()
            return [normalize_carlist_listing(listing) for listing in listings]
        else:
            print(f"Carlist API error: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Error fetching from Carlist: {e}")
        return []


async def fetch_from_both_platforms(params: Dict[str, Any], sources: List[str]) -> tuple[List[Dict], List[Dict]]:
    """Fetch from both platforms concurrently using thread pool"""
    loop = asyncio.get_event_loop()
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        tasks = []
        
        # Only fetch from requested sources
        should_fetch_mudah = 'mudah' in sources
        should_fetch_carlist = 'carlist' in sources
        
        if should_fetch_mudah:
            mudah_task = loop.run_in_executor(
                executor,
                partial(fetch_mudah_listings, params)
            )
            tasks.append(mudah_task)
        else:
            tasks.append(asyncio.create_task(asyncio.sleep(0, result=[])))
        
        if should_fetch_carlist:
            carlist_task = loop.run_in_executor(
                executor,
                partial(fetch_carlist_listings, params)
            )
            tasks.append(carlist_task)
        else:
            tasks.append(asyncio.create_task(asyncio.sleep(0, result=[])))
        
        mudah_results, carlist_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        if isinstance(mudah_results, Exception):
            print(f"Mudah exception: {mudah_results}")
            mudah_results = []
        
        if isinstance(carlist_results, Exception):
            print(f"Carlist exception: {carlist_results}")
            carlist_results = []
        
        return mudah_results, carlist_results


@valuationRouter.post('/search')
async def unified_search(search_params: UnifiedSearchQuery):
    """
    Unified search endpoint that aggregates results from Mudah and Carlist.
    
    Returns normalized listings from both platforms with source attribution.
    """
    params = search_params.model_dump()
    sources = params.get('sources', ['mudah', 'carlist'])
    
    # Fetch from selected platforms concurrently
    mudah_listings, carlist_listings = await fetch_from_both_platforms(params, sources)
    
    # Combine all listings
    all_listings = []
    all_listings.extend(mudah_listings)
    all_listings.extend(carlist_listings)
    
    # Remove duplicates based on similar characteristics
    # (price, make, model, year, mileage within tolerance)
    seen = set()
    unique_listings = []
    
    for listing in all_listings:
        # Create a signature for deduplication
        signature = (
            listing['make'].lower(),
            listing['model'].lower(),
            listing['year'],
            listing['price'],
            listing.get('mileage')
        )
        
        if signature not in seen:
            seen.add(signature)
            unique_listings.append(listing)
    
    # Sort by price (ascending)
    unique_listings.sort(key=lambda x: x.get('price', 0) or 0)
    
    # Calculate statistics
    prices = [l['price'] for l in unique_listings if l.get('price')]
    
    stats = {}
    if prices:
        stats = {
            'total_count': len(unique_listings),
            'min_price': min(prices),
            'max_price': max(prices),
            'avg_price': sum(prices) // len(prices),
            'median_price': sorted(prices)[len(prices) // 2]
        }
    
    return {
        'success': True,
        'listings': unique_listings,
        'listings_ascending': unique_listings,
        'listings_descending': sorted(unique_listings, key=lambda x: x.get('price', 0) or 0, reverse=True),
        'sources': {
            'mudah_count': len([l for l in unique_listings if l['source'] == 'Mudah']),
            'carlist_count': len([l for l in unique_listings if l['source'] == 'Carlist']),
            'total_count': len(unique_listings)
        },
        'statistics': stats,
        'query': {
            'make': params['make'],
            'model': params['model'],
            'filters_applied': {k: v for k, v in params.items() if v is not None and k not in ['make', 'model', 'limit', 'sources']}
        }
    }


@valuationRouter.get('/supported_makes')
async def get_supported_makes():
    """
    Get all supported makes across both platforms.
    Merges make lists from Mudah and Carlist.
    """
    try:
        mudah_makes = get('http://localhost:8000/api/mudah/all_vehicles', timeout=10)
        carlist_response = get('http://localhost:8000/api/carlist/all_vehicles', timeout=10)
        
        all_makes = set()
        
        if mudah_makes.ok:
            mudah_data = mudah_makes.json()
            all_makes.update(mudah_data.keys())
        
        if carlist_response.ok:
            carlist_data = carlist_response.json()
            # Carlist returns a nested dict structure, extract top-level keys (makes)
            if isinstance(carlist_data, dict):
                all_makes.update(carlist_data.keys())
        
        # Combine makes from both platforms
        return {
            'makes': sorted(list(all_makes)),
            'total': len(all_makes)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch makes: {str(e)}")


@valuationRouter.get('/supported_models/{make}')
async def get_supported_models(make: str):
    """
    Get all supported models for a specific make across both platforms.
    """
    try:
        make_slug = make.lower().replace(' ', '-')
        
        mudah_models = get(f'http://localhost:8000/api/mudah/all_vehicles?make={make_slug}', timeout=10)
        
        all_models = set()
        
        if mudah_models.ok:
            mudah_data = mudah_models.json()
            # Filter out __id__ key
            all_models.update([k for k in mudah_data.keys() if k != '__id__'])
        
        return {
            'make': make,
            'models': sorted(list(all_models)),
            'total': len(all_models)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch models: {str(e)}")