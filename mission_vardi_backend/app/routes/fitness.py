from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

from app.models.fitness_model import FitnessLogCreate
from app.services.mongodb_service import fitness_logs_collection

router = APIRouter(
    prefix="/fitness",
    tags=["Fitness"]
)

@router.post("")
def create_fitness_log(log: FitnessLogCreate):
    log_id = str(uuid4())
    
    # If no date provided, use today's date YYYY-MM-DD
    log_date = log.date if log.date else datetime.now().strftime("%Y-%m-%d")
    
    log_data = {
        "id": log_id,
        "user_id": log.user_id,
        "run_1600m_seconds": log.run_1600m_seconds,
        "run_100m_seconds": log.run_100m_seconds,
        "shot_put_meters": log.shot_put_meters,
        "date": log_date,
        "notes": log.notes,
        "created_at": str(datetime.now())
    }
    
    fitness_logs_collection.insert_one(log_data)
    log_data.pop("_id", None)
    
    return {
        "status": True,
        "message": "Fitness log saved successfully",
        "data": log_data
    }

@router.get("/{user_id}")
def get_fitness_logs(user_id: str):
    logs = list(
        fitness_logs_collection.find({"user_id": user_id}, {"_id": 0})
        .sort("date", -1)
    )
    
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": logs
    }

@router.delete("/{log_id}")
def delete_fitness_log(log_id: str):
    result = fitness_logs_collection.delete_one({"id": log_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
        
    return {
        "status": True,
        "message": "Fitness log deleted successfully"
    }
