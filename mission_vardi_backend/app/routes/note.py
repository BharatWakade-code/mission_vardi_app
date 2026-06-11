from fastapi import APIRouter, Query
from typing import Optional
from uuid import uuid4
from datetime import datetime

from app.models.note_model import NoteCreate
from app.services.mongodb_service import notes_collection

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
        "subject": note.subject,
        "content": note.content,
        "createdAt": str(datetime.now())
    }
    
    notes_collection.insert_one(note_data)
    note_data.pop("_id", None)
    return {
        "status": True,
        "message": "Note created successfully",
        "data": note_data
    }

@router.get("")
async def list_notes(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
        
    notes = list(
        notes_collection.find(query, {"_id": 0})
        .sort("createdAt", -1)
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": notes
    }

@router.delete("/{note_id}")
async def delete_note(note_id: str):
    result = notes_collection.delete_one({"id": note_id})
    if result.deleted_count == 1:
        return {
            "status": True,
            "message": "Note deleted successfully"
        }
    return {
        "status": False,
        "message": "Note not found"
    }
