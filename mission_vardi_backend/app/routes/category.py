from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
from datetime import datetime
from app.services.mongodb_service import categories_collection
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/category", tags=["Category Management"])

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    isActive: bool = True

@router.get("/")
async def get_categories():
    categories = list(categories_collection.find({}, {"_id": 0}))
    return {"status": True, "data": categories}

@router.post("/")
async def create_category(data: CategoryBase, current_user: dict = Depends(get_current_user)):
    # Check permissions
    if "manage_categories" not in current_user.get("permissions", []):
        raise HTTPException(status_code=403, detail="Not authorized to manage categories")

    cat_id = str(uuid4())
    doc = {
        "id": cat_id,
        "name": data.name,
        "description": data.description,
        "isActive": data.isActive,
        "createdAt": str(datetime.now())
    }
    categories_collection.insert_one(doc)
    doc.pop("_id", None)
    return {"status": True, "message": "Category created", "data": doc}

@router.delete("/{category_id}")
async def delete_category(category_id: str, current_user: dict = Depends(get_current_user)):
    if "manage_categories" not in current_user.get("permissions", []):
        raise HTTPException(status_code=403, detail="Not authorized to manage categories")

    result = categories_collection.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"status": True, "message": "Category deleted"}

@router.put("/{category_id}")
async def update_category(category_id: str, data: CategoryBase, current_user: dict = Depends(get_current_user)):
    if "manage_categories" not in current_user.get("permissions", []):
        raise HTTPException(status_code=403, detail="Not authorized to manage categories")

    result = categories_collection.update_one(
        {"id": category_id},
        {"$set": {
            "name": data.name,
            "description": data.description,
            "isActive": data.isActive
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"status": True, "message": "Category updated successfully"}
