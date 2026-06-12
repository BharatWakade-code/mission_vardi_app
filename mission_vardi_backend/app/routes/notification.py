from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.models.notification_model import NotificationCreate
from app.services.mongodb_service import notifications_collection, users_collection, user_stats_collection
from app.services.firebase_service import send_push_notification, send_multicast_notification

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
        "title_mr": notification.title_mr,
        "body": notification.body,
        "body_mr": notification.body_mr,
        "imageUrl": notification.imageUrl,
        "targetUserId": notification.targetUserId,
        "filters": notification.filters.model_dump() if notification.filters else None,
        "createdAt": str(datetime.now())
    }
    
    notifications_collection.insert_one(notif_data)
    notif_data.pop("_id", None)
    
    # Send actual Push Notification to Mobile App
    kwargs = {
        "title": notification.title,
        "body": notification.body,
        "data": {
            "imageUrl": notification.imageUrl or "",
            "title_mr": notification.title_mr or "",
            "body_mr": notification.body_mr or ""
        }
    }
    
    fcm_response = None
    
    if notification.filters:
        # Build query for users
        user_query = {}
        
        # 1. Filter by accuracy from user_stats_collection
        if notification.filters.minAccuracy is not None:
            stats = user_stats_collection.find({"average_score_percent": {"$gte": notification.filters.minAccuracy}})
            valid_user_ids = [st["user_id"] for st in stats]
            user_query["id"] = {"$in": valid_user_ids}
            
        # 2. Filter by interests
        if notification.filters.interests:
            user_query["interests"] = {"$in": notification.filters.interests}
            
        # 3. Filter by target exam
        if notification.filters.target_exam:
            user_query["target_exam"] = notification.filters.target_exam
            
        # 4. Filter by district
        if notification.filters.district:
            user_query["district"] = notification.filters.district
            
        # Find matching users and collect tokens
        matching_users = list(users_collection.find(user_query, {"fcmToken": 1, "_id": 0}))
        tokens = [u["fcmToken"] for u in matching_users if u.get("fcmToken")]
        
        if tokens:
            fcm_response = send_multicast_notification(**kwargs, tokens=tokens)
        else:
            fcm_response = {"status": "no_users_found"}
            
    elif notification.targetToken:
        fcm_response = send_push_notification(**kwargs, token=notification.targetToken)
        
    elif notification.targetUserId:
        user = users_collection.find_one({"id": notification.targetUserId})
        if user and user.get("fcmToken"):
            fcm_response = send_push_notification(**kwargs, token=user["fcmToken"])
        else:
            fcm_response = {"status": "user_or_token_not_found"}
            
    else:
        # Default to all_users topic if no specific target or filters are provided
        fcm_response = send_push_notification(**kwargs, topic="all_users")
    
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

@router.delete("/{notif_id}")
async def delete_notification(notif_id: str):
    result = notifications_collection.delete_one({"id": notif_id})
    if result.deleted_count == 1:
        return {
            "status": True,
            "message": "Notification deleted successfully"
        }
    return {
        "status": False,
        "message": "Notification not found"
    }
