from fastapi import APIRouter
from app.services.mongodb_service import db, notes_collection, quotes_collection, config_collection
from datetime import datetime

router = APIRouter(prefix="/home", tags=["Home"])
alerts_collection = db["alerts"]

@router.get("/dashboard")
async def get_home_dashboard():
    # Fetch Notes
    notes = list(notes_collection.find({}, {"_id": 0}).sort("createdAt", -1))
    
    # Fetch Alerts
    alerts = list(alerts_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    
    # Fetch Quotes from DB
    quotes = list(quotes_collection.find({}, {"_id": 0}))
    if not quotes:
        quotes = [
            {
                "en": "“Duty, Honor, Courage. The uniform is not a job, it's a responsibility.”",
                "mr": "“कर्तव्य, सन्मान, धाडस. वर्दी ही नोकरी नाही, ती एक जबाबदारी आहे.”"
            },
            {
                "en": "“Sweat more in training, bleed less in battle.”",
                "mr": "“सराव करताना जास्त घाम गाळा, जेणेकरून युद्धात कमी रक्त सांडेल.”"
            },
            {
                "en": "“Success isn't given. It's earned. On the track and in the books.”",
                "mr": "“यश मिळत नाही, ते मिळवावे लागते. धावपट्टीवर आणि पुस्तकांमध्ये.”"
            }
        ]
        # Optionally auto-seed DB if empty
        try:
            quotes_collection.insert_many(quotes)
        except Exception:
            pass

    # Fetch Countdown details from config collection
    countdown_config = config_collection.find_one({"type": "exam_date"})
    
    countdown = {
        "daysLeft": 0,
        "hoursLeft": 0,
        "minutesLeft": 0,
        "secondsLeft": 0
    }
    
    if countdown_config and "target_date" in countdown_config:
        try:
            # Assuming target_date is a string in ISO format like "2026-10-10T10:00:00Z"
            if isinstance(countdown_config["target_date"], str):
                target = datetime.fromisoformat(countdown_config["target_date"].replace('Z', '+00:00')).replace(tzinfo=None)
            else:
                target = countdown_config["target_date"]
                
            now = datetime.utcnow()
            diff = target - now
            
            if diff.total_seconds() > 0:
                days = diff.days
                hours, remainder = divmod(diff.seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                
                countdown = {
                    "daysLeft": days,
                    "hoursLeft": hours,
                    "minutesLeft": minutes,
                    "secondsLeft": seconds
                }
        except Exception as e:
            print("Error parsing target_date:", e)
    else:
        # Fallback config if not in DB yet
        countdown = {
            "daysLeft": 132,
            "hoursLeft": 4,
            "minutesLeft": 35,
            "secondsLeft": 19
        }
        try:
            config_collection.insert_one({
                "type": "exam_date",
                "target_date": datetime.utcnow().replace(year=datetime.utcnow().year + 1).isoformat()
            })
        except Exception:
            pass

    return {
        "status": True,
        "message": "Dashboard data fetched successfully",
        "data": {
            "notes": notes,
            "alerts": alerts,
            "daily_quotes": quotes,
            "countdown": countdown
        }
    }

@router.get("/districts")
async def get_districts():
    vidarbha_districts = [
        "Amravati", "Akola", "Bhandara", "Buldhana", "Chandrapur",
        "Gadchiroli", "Gondia", "Nagpur", "Wardha", "Washim", "Yavatmal"
    ]
    return {
        "status": True,
        "message": "Districts fetched successfully",
        "data": vidarbha_districts
    }
