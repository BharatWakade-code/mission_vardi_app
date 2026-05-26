from pydantic import BaseModel
from typing import Optional

class NotificationCreate(BaseModel):
    title: str
    body: str
    imageUrl: Optional[str] = None

class AlertCreate(BaseModel):
    message_mr: str
    message_en: str
