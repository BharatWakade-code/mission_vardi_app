from fastapi import APIRouter, Query
from typing import Optional
from uuid import uuid4
from datetime import datetime

from app.models.note_model import NoteCreate
from app.services.s3_service import save_document, list_documents

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)

@router.post("")
async def create_note(note: NoteCreate):
    note_id = str(uuid4())
    
    note_data = {
        "id": note_id,
        "title": note.title,
        "description": note.description,
        "pdfUrl": note.pdfUrl,
        "category": note.category,
        "createdAt": str(datetime.now())
    }
    
    save_document("notes", note_id, note_data)
    return {
        "status": True,
        "message": "Note created successfully",
        "data": note_data
    }

@router.get("")
async def list_notes(category: Optional[str] = None):
    notes = list_documents("notes/")
    
    if category:
        notes = [n for n in notes if n.get("category") == category]
    
    # Sort by createdAt descending
    sorted_notes = sorted(
        notes, 
        key=lambda x: x.get("createdAt", ""), 
        reverse=True
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": sorted_notes
    }
