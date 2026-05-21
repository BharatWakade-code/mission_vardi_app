from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.user_model import UserCreate, UserUpdate
from fastapi import HTTPException
from app.services.mongodb_service import users_collection

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

    users_collection.insert_one(user_data)
    user_data.pop("_id", None)

    return {
        "status": True,
        "message": "User created successfully",
        "data": user_data
    }

@router.get("/{user_id}")
async def get_user(user_id: str):

    user = users_collection.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": user
    }

@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    user_data = users_collection.find_one({"id": user_id}, {"_id": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = user_update.dict(exclude_unset=True)
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    if update_data:
        users_collection.update_one({"id": user_id}, {"$set": update_data})
        user_data.update(update_data)
            
    return {
        "status": True,
        "message": "User updated successfully",
        "data": user_data
    }
