from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    title: str
    description: str
    pdfUrl: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    content: Optional[str] = None
