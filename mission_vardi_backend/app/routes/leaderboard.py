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

@router.get("/global")
async def get_global_leaderboard(limit: int = 10):
    from app.services.mongodb_service import user_stats_collection
    # Fetch all stats
    stats = list(user_stats_collection.find({}, {"_id": 0}))
    
    if not stats:
        return {"status": True, "message": "No data found", "data": []}
    
    user_ids = [st["user_id"] for st in stats]
    users = list(users_collection.find({"id": {"$in": user_ids}}, {"_id": 0}))
    user_map = {u["id"]: u for u in users}
    
    leaderboard = []
    for st in stats:
        u_id = st["user_id"]
        u_name = user_map.get(u_id, {}).get("name", "Unknown User")
        u_district = user_map.get(u_id, {}).get("district", "Unknown")
        score = st.get("average_score_percent", 0.0)
        quizzes = st.get("total_quizzes", 0)
        
        # Points = average accuracy * total quizzes taken
        points = int(score * quizzes)
        
        leaderboard.append({
            "user_id": u_id,
            "name": u_name,
            "points": points,
            "score_str": f"{points} Points",
        })
        
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return {
        "status": True,
        "message": "Global leaderboard fetched",
        "data": leaderboard[:limit]
    }
