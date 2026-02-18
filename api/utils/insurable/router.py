from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from supabase import create_client, Client
from uuid import uuid5, NAMESPACE_OID
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
    vehicle_string = ','.join([str(x) for x in list(vehicle_detail.model_dump().values()) if x and str(x).strip()])
    vehicle_id = uuid5(NAMESPACE_OID, vehicle_string)

    res = supabase.table('vehicle_values').select('*').eq('vehicle_id', vehicle_id).execute()
    return res.data

