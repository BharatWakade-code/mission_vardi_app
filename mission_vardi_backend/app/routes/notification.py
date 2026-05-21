from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.notification_model import NotificationCreate
from app.services.mongodb_service import notifications_collection

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.post("")
async def create_notification(notification: NotificationCreate):
    notif_id = str(uuid4())
    
    notif_data = {
        "id": notif_id,
        "title": notification.title,
        "body": notification.body,
        "imageUrl": notification.imageUrl,
        "createdAt": str(datetime.now())
    }
    
    notifications_collection.insert_one(notif_data)
    notif_data.pop("_id", None)
    return {
        "status": True,
        "message": "Notification created successfully",
        "data": notif_data
    }

@router.get("")
async def list_notifications():
    notifications = list(
        notifications_collection.find({}, {"_id": 0})
        .sort("createdAt", -1)
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": notifications
    }
