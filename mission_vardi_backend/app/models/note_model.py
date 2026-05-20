from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    title: str
    description: str
    pdfUrl: str
    category: Optional[str] = None
