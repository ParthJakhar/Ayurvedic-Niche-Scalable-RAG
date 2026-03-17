from fastapi import APIRouter, Query
from typing import List
from app.services.hospital_service import get_nearby_hospitals
from app.models.hospital_model import Hospital

router = APIRouter()

@router.get("/hospitals", response_model=List[Hospital])
def fetch_hospitals(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude")
):
    return get_nearby_hospitals(lat, lon)