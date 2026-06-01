from fastapi import APIRouter, Query
from typing import Optional
from uuid import uuid4
from datetime import datetime

from app.models.pyq_model import PYQCreate
from app.services.mongodb_service import pyqs_collection

router = APIRouter(
    prefix="/pyqs",
    tags=["Previous Year Question Papers"]
)

@router.post("")
async def create_pyq(pyq: PYQCreate):
    pyq_id = str(uuid4())
    
    pyq_data = {
        "id": pyq_id,
        "title": pyq.title,
        "year": pyq.year,
        "description": pyq.description,
        "pdfUrl": pyq.pdfUrl,
        "category": pyq.category,
        "createdAt": str(datetime.now())
    }
    
    pyqs_collection.insert_one(pyq_data)
    pyq_data.pop("_id", None)
    return {
        "status": True,
        "message": "PYQ created successfully",
        "data": pyq_data
    }

@router.get("")
async def list_pyqs(year: Optional[int] = None, category: Optional[str] = None):
    query = {}
    if year:
        query["year"] = year
    if category:
        query["category"] = category
        
    pyqs = list(
        pyqs_collection.find(query, {"_id": 0})
        .sort("year", -1)
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": pyqs
    }

@router.delete("/{pyq_id}")
async def delete_pyq(pyq_id: str):
    result = pyqs_collection.delete_one({"id": pyq_id})
    if result.deleted_count == 1:
        return {
            "status": True,
            "message": "PYQ deleted successfully"
        }
    return {
        "status": False,
        "message": "PYQ not found"
    }
