from pydantic import BaseModel
from typing import Optional

class Hospital(BaseModel):
    name: str
    lat: float
    lon: float
    distance: float
    phone: Optional[str] = None
    maps_url: str