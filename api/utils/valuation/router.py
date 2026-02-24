"""
Unified valuation endpoint.
Handles JWT authentication, token deduction, and delegates to existing search functions.
Each call to POST /valuation/get_marketdata costs 1 token.
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, timezone

from supabase import create_client, Client
from os import getenv
from dotenv import load_dotenv

# Import existing search functions and models
from api.utils.mudah.router import search as mudah_search, CarSearchQuery, MotorSearchQuery
from api.utils.carlist.router import Search as carlist_search, SearchQuery as CarlistSearchQuery, SearchFilters as CarlistSearchFilters
from api.utils.insurable.router import get_insurable as insurable_search, vehicle_identification

load_dotenv('.env.local')

url = getenv("SUPABASE_URL")
key = getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

valuationRouter = APIRouter(prefix='/valuation')


# --- Request Models ---

class MudahSearchParams(BaseModel):
    """Parameters for Mudah vehicle search."""
    searchQuery: dict
    whitelist_attributes: Optional[list[str]] = None

class CarlistSearchParams(BaseModel):
    """Parameters for Carlist vehicle search."""
    query: dict
    filters: dict = {}
    whitelist_attributes: Optional[list[str]] = None

class InsurableSearchParams(BaseModel):
    """Parameters for insurable value lookup."""
    vehicle_detail: dict

class ValuationRequest(BaseModel):
    """Unified valuation request. Specify which sources to query."""
    vehicle_type: Literal['car', 'motorcycle', 'commercial']
    mudah: Optional[MudahSearchParams] = None
    carlist: Optional[CarlistSearchParams] = None
    insurable: Optional[InsurableSearchParams] = None


# --- Token Helpers ---

def _get_user_from_token(authorization: str) -> dict:
    """Verify JWT and return user data."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    jwt_token = authorization.split("Bearer ")[1]
    
    try:
        user_response = supabase.auth.get_user(jwt_token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


def _check_and_deduct_token(user) -> int:
    """
    Check if user has tokens remaining. If yes, deduct 1 and return remaining count.
    Raises HTTPException 403 if no tokens.
    """
    metadata = user.user_metadata or {}
    tokens_remaining = metadata.get('tokens_remaining', 0)

    if tokens_remaining <= 0:
        raise HTTPException(
            status_code=403,
            detail="No valuation tokens remaining. Tokens refresh weekly."
        )

    # Deduct 1 token
    new_count = tokens_remaining - 1
    try:
        supabase.auth.admin.update_user_by_id(
            user.id,
            {"user_metadata": {"tokens_remaining": new_count}}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update token count: {str(e)}")

    return new_count


# --- Unified Endpoint ---

@valuationRouter.post('/get_marketdata', summary="Unified market data endpoint. Costs 1 token per call.")
def get_marketdata(
    request: ValuationRequest,
    authorization: str = Header(...)
):
    """
    Unified valuation endpoint that:
    1. Verifies the user's JWT
    2. Deducts 1 token from the user's account
    3. Calls the requested data sources (Mudah, Carlist, Insurable)
    4. Returns combined results
    """
    # 1. Authenticate
    user = _get_user_from_token(authorization)

    # 2. Check and deduct token
    tokens_after = _check_and_deduct_token(user)

    # 3. Call requested sources
    results = {}
    errors = {}

    # Mudah search
    if request.mudah:
        try:
            params = request.mudah
            search_query_data = params.searchQuery

            # Determine if car or motorcycle search
            if request.vehicle_type == 'motorcycle':
                query_model = MotorSearchQuery(**search_query_data)
            else:
                query_model = CarSearchQuery(**search_query_data)

            whitelist = params.whitelist_attributes or [
                'model_name', 'make_name', 'condition_name', 'manufactured_year',
                'fueltype', 'price', 'mileage', 'transmission_name',
                'engine_capacity', 'car_type_name', 'adview_url', 'image', 'variant'
            ]

            result = mudah_search(query_model, whitelist)
            results['mudah'] = result
        except HTTPException:
            raise
        except Exception as e:
            errors['mudah'] = str(e)

    # Carlist search
    if request.carlist:
        try:
            params = request.carlist
            query_model = CarlistSearchQuery(**params.query)
            filters_model = CarlistSearchFilters(**params.filters)

            whitelist = params.whitelist_attributes or [
                "brand.name", "model", "itemCondition", "vehicleModelDate",
                "fuelType", "offers.price", "mileageFromOdometer.value",
                "vehicleTransmission", "image[0].url", "mainEntityOfPage"
            ]

            result = carlist_search(query_model, filters_model, whitelist)
            results['carlist'] = result
        except HTTPException:
            raise
        except Exception as e:
            errors['carlist'] = str(e)

    # Insurable value search
    if request.insurable:
        try:
            params = request.insurable
            vehicle_model = vehicle_identification(**params.vehicle_detail)
            result = insurable_search(vehicle_model)
            results['insurable'] = result
        except HTTPException:
            raise
        except Exception as e:
            errors['insurable'] = str(e)

    return {
        "results": results,
        "errors": errors if errors else None,
        "tokens_remaining": tokens_after
    }


@valuationRouter.get('/tokens', summary="Get the current user's token count.")
def get_tokens(authorization: str = Header(...)):
    """Returns the current token count for the authenticated user."""
    user = _get_user_from_token(authorization)
    metadata = user.user_metadata or {}
    return {
        "tokens_remaining": metadata.get('tokens_remaining', 0),
        "tokens_per_week": metadata.get('tokens_per_week', 3),
    }
