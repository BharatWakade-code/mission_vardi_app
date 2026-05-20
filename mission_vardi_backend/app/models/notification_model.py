from pydantic import BaseModel
from typing import Optional

class NotificationCreate(BaseModel):
    title: str
    body: str
    imageUrl: Optional[str] = None
