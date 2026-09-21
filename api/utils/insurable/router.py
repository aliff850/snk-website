from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from supabase import create_client, Client
from os import getenv
from dotenv import load_dotenv

load_dotenv('.env.local')

url = getenv("SUPABASE_URL")
key = getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

insurableRouter = APIRouter(prefix="/insurable")

class vehicle_identification(BaseModel):
    make: str
    model: str
    variant: Optional[str] = None
    series: Optional[str] = None
    year: str
    cc: Optional[str] = None
    import_status: Optional[str] = None
    transmission: Optional[str] = None
    style: Optional[str] = None

@insurableRouter.post("/search")
def get_insurable(vehicle_detail: vehicle_identification):
    # 1. Base query for the vehicles table
    query = supabase.table('vehicles').select('id')
    
    # 2. Add exact matches based on what the frontend provides
    query = query.eq('make', vehicle_detail.make.upper())
    query = query.eq('model', vehicle_detail.model.upper())
    query = query.eq('year', vehicle_detail.year)
    
    # 3. Add optional matches if the user selected them
    if vehicle_detail.variant:
        query = query.eq('variant', vehicle_detail.variant.upper())
    if vehicle_detail.cc:
        query = query.eq('cc', vehicle_detail.cc)
    if vehicle_detail.style:
        query = query.eq('style', vehicle_detail.style.upper())
        
    # 4. Transmission gets a fuzzy match ("AUTO" will match "4 SP AUTO")
    if vehicle_detail.transmission:
        query = query.ilike('transmission', f'%{vehicle_detail.transmission.upper()}%')

    # 5. Execute query to find all matching vehicle IDs
    res = query.execute()
    
    if not res.data:
        return {"meta": "No vehicle found"}
        
    vehicle_ids = [v['id'] for v in res.data]
    
    # 6. Query the vehicle_values table for the prices attached to those IDs
    val_res = supabase.table('vehicle_values').select('value').in_('vehicle_id', vehicle_ids).execute()
    
    if not val_res.data:
        return {"meta": "No vehicle values found"}
        
    # 7. Calculate lowest, average, and highest to match our frontend UI
    values = [v['value'] for v in val_res.data if v.get('value') is not None]
    
    if not values:
        return {"meta": "No valid values found"}
        
    return {
        "lowest": int(min(values)),
        "average": int(sum(values) / len(values)),
        "highest": int(max(values))
    }

@insurableRouter.get('/years')
def get_years(make: str, model: str):
    res = supabase.table('vehicles').select('year').match({'make': make.upper(), 'model': model.upper()}).execute()

    if not res.data:
        return {"years": []}

    years = sorted(list(set(d['year'] for d in res.data if d.get('year'))), reverse=True)
    return {"years": years}


@insurableRouter.get('/details')
def get_details(make: str, model: str, year: str):
    res = supabase.table('vehicles').select('variant,series,style,cc').match({'make': make.upper(), 'model': model.upper(), 'year': year}).execute()
    
    if not res.data:
        return {"meta": "No vehicle found"}

    columns = ['variant', 'series', 'style', 'cc']
    return {
        col: sorted(list(set(d[col] for d in res.data if d.get(col))))
        for col in columns
    }