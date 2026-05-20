from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.notification_model import NotificationCreate
from app.services.s3_service import save_document, list_documents

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
    
    save_document("notifications", notif_id, notif_data)
    return {
        "status": True,
        "message": "Notification created successfully",
        "data": notif_data
    }

@router.get("")
async def list_notifications():
    notifications = list_documents("notifications/")
    
    # Sort by createdAt descending (newest first)
    sorted_notifications = sorted(
        notifications, 
        key=lambda x: x.get("createdAt", ""), 
        reverse=True
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": sorted_notifications
    }
