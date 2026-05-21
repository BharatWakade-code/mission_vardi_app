from fastapi import APIRouter
from app.services.mongodb_service import results_collection, users_collection

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)

@router.get("/{quiz_id}")
async def get_leaderboard(quiz_id: str, limit: int = 10):
    # Fetch top results for this quiz sorted by score descending directly in MongoDB
    results = list(
        results_collection.find({"quiz_id": quiz_id}, {"_id": 0})
        .sort("score", -1)
        .limit(limit)
    )
    
    leaderboard = []
    for r in results:
        user_id = r.get("user_id")
        user_doc = users_collection.find_one({"id": user_id}, {"_id": 0})
        
        user_name = user_doc.get("name", "Unknown User") if user_doc else "Unknown User"
        
        leaderboard.append({
            "user_id": user_id,
            "name": user_name,
            "score": r.get("score"),
            "total": r.get("total"),
            "submittedAt": r.get("submittedAt")
        })
        
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": leaderboard
    }
