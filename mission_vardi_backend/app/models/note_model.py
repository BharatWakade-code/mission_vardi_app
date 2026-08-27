from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    title: str
    title_mr: Optional[str] = None
    description: str
    description_mr: Optional[str] = None
    pdfUrl: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    content: Optional[str] = None
    content_mr: Optional[str] = None
    is_premium: Optional[bool] = False
    price: Optional[float] = 0.0
