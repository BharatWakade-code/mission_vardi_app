from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.notification_model import NotificationCreate
from app.services.mongodb_service import notifications_collection
from app.services.firebase_service import send_push_notification

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
    
    # Send actual Push Notification to Mobile App
    # Ensure your app subscribes to 'all_users' on app start
    fcm_response = send_push_notification(
        title=notification.title,
        body=notification.body,
        topic="all_users"
    )
    
    return {
        "status": True,
        "message": "Notification created and pushed successfully",
        "data": notif_data,
        "fcm_response": fcm_response
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
