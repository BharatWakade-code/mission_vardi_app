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


class ProfileUpdate(BaseModel):
    """Extended profile fields editable by the user."""
    name: Optional[str] = None
    mobile: Optional[str] = None
    district: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    target_exam: Optional[str] = None   # "police_bharti" | "psi" | "sti" | "other"
    study_goal_minutes: Optional[int] = None
