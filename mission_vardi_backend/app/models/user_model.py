from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    mobile: str
    district: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    district: Optional[str] = None
    profileImage: Optional[str] = None
