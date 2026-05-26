from fastapi import APIRouter
from app.services.mongodb_service import db
from app.models.notification_model import AlertCreate

router = APIRouter(prefix="/alerts", tags=["Alerts"])
alerts_collection = db["alerts"]

@router.get("/global")
async def get_global_alerts():
    # Sort alerts by timestamp descending to get latest first
    alerts = list(alerts_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    
    return {
        "status": True,
        "message": "Alerts fetched successfully",
        "data": alerts
    }

@router.post("/global", summary="Post a new police bharti update")
async def post_global_alert(alert: AlertCreate):
    import uuid
    from datetime import datetime
    
    alert_doc = {
        "id": str(uuid.uuid4()),
        "message_mr": alert.message_mr,
        "message_en": alert.message_en,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    alerts_collection.insert_one(alert_doc)
    alert_doc.pop("_id", None)
    
    return {
        "status": True,
        "message": "Alert posted successfully",
        "data": alert_doc
    }
