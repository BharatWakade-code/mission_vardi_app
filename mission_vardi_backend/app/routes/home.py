from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.mongodb_service import db, notes_collection, quotes_collection, config_collection
from datetime import datetime
import uuid

router = APIRouter(prefix="/home", tags=["Home"])
alerts_collection = db["alerts"]

class QuoteCreate(BaseModel):
    en: str
    mr: str

class CountdownConfigUpdate(BaseModel):
    title: str
    target_date: str # ISO format string e.g., "2026-10-10T10:00:00Z"

@router.get("/dashboard")
async def get_home_dashboard():
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


    # Fetch Countdown details from config collection
    countdown_config = config_collection.find_one({"type": "exam_date"})
    
    countdown = {
        "title": countdown_config.get("title", "Exam Countdown") if countdown_config else "Exam Countdown",
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
                    "title": countdown_config.get("title", "Exam Countdown"),
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
            "title": "Maharashtra Police Bharti",
            "daysLeft": 132,
            "hoursLeft": 4,
            "minutesLeft": 35,
            "secondsLeft": 19
        }

    return {
        "status": True,
        "message": "Dashboard data fetched successfully",
        "data": {
            "daily_quotes": quotes,
            "countdown": countdown
        }
    }

@router.post("/quotes")
async def add_quote(quote: QuoteCreate):
    quote_dict = quote.dict()
    quote_dict["id"] = str(uuid.uuid4())
    quotes_collection.insert_one(quote_dict)
    del quote_dict["_id"]
    return {
        "status": True,
        "message": "Quote added successfully",
        "data": quote_dict
    }

@router.delete("/quotes/{quote_id}")
async def delete_quote(quote_id: str):
    result = quotes_collection.delete_one({"id": quote_id})
    if result.deleted_count > 0:
        return {"status": True, "message": "Quote deleted successfully"}
    return {"status": False, "message": "Quote not found"}

@router.post("/config/exam")
async def update_exam_config(config: CountdownConfigUpdate):
    config_dict = config.dict()
    config_dict["type"] = "exam_date"
    config_collection.update_one(
        {"type": "exam_date"},
        {"$set": config_dict},
        upsert=True
    )
    return {
        "status": True,
        "message": "Exam configuration updated successfully",
        "data": config_dict
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
