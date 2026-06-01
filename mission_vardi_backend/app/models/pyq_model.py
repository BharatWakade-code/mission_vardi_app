from pydantic import BaseModel
from typing import Optional

class PYQCreate(BaseModel):
    title: str
    year: int
    description: Optional[str] = None
    pdfUrl: Optional[str] = None
    category: Optional[str] = None
