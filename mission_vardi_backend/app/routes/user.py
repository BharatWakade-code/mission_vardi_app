from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.user_model import UserCreate, UserUpdate
from fastapi import HTTPException
from app.services.s3_service import (
    save_document,
    get_document
)

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.post("/create")
async def create_user(user: UserCreate):

    user_id = str(uuid4())

    user_data = {
        "id": user_id,
        "name": user.name,
        "mobile": user.mobile,
        "district": user.district,
        "createdAt": str(datetime.now())
    }

    save_document(
        "users",
        user_id,
        user_data
    )

    return {
        "status": True,
        "message": "User created successfully",
        "data": user_data
    }

@router.get("/{user_id}")
async def get_user(user_id: str):

    user = get_document("users", user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": user
    }

@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    user_data = get_document("users", user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            user_data[key] = value
            
    save_document("users", user_id, user_data)
    return {
        "status": True,
        "message": "User updated successfully",
        "data": user_data
    }
