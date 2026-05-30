from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FitnessLogCreate(BaseModel):
    user_id: str
    run_1600m_seconds: Optional[int] = None # Time in seconds
    run_100m_seconds: Optional[float] = None # Time in seconds
    shot_put_meters: Optional[float] = None # Distance in meters
    date: Optional[str] = None # YYYY-MM-DD
    notes: Optional[str] = None

class FitnessLogResponse(FitnessLogCreate):
    id: str
    created_at: str
