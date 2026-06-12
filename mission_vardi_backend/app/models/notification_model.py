from pydantic import BaseModel
from typing import Optional, List

class NotificationFilter(BaseModel):
    minAccuracy: Optional[float] = None
    interests: Optional[List[str]] = None
    target_exam: Optional[str] = None
    district: Optional[str] = None

class NotificationCreate(BaseModel):
    title: str
    title_mr: Optional[str] = None
    body: str
    body_mr: Optional[str] = None
    imageUrl: Optional[str] = None
    targetUserId: Optional[str] = None
    targetToken: Optional[str] = None
    filters: Optional[NotificationFilter] = None

class AlertCreate(BaseModel):
    message_mr: str
    message_en: str
