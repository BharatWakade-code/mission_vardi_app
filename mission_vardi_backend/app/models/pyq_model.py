from pydantic import BaseModel
from typing import Optional

class PYQCreate(BaseModel):
    title: str
    title_mr: Optional[str] = None
    year: int
    description: Optional[str] = None
    description_mr: Optional[str] = None
    pdfUrl: Optional[str] = None
    category: Optional[str] = None
