from fastapi import APIRouter
from app.services.mongodb_service import results_collection, users_collection

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)

@router.get("/{quiz_id}")
def get_leaderboard(quiz_id: str, limit: int = 10):
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

def _get_computed_global_leaderboard(user_stats_collection, users_collection):
    stats = list(user_stats_collection.find({}, {"_id": 0}))
    if not stats:
        return []
        
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
        
        points = int(score * quizzes)
        
        leaderboard.append({
            "user_id": u_id,
            "name": u_name,
            "district": u_district,
            "points": points,
            "score_str": f"{points} Points",
        })
        
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    return leaderboard

def _get_user_ranks(user_id, full_leaderboard):
    user_item = next((u for u in full_leaderboard if u["user_id"] == user_id), None)
    if not user_item:
        return None
        
    global_rank = full_leaderboard.index(user_item) + 1
    
    district_rank = None
    district = user_item.get("district")
    if district and district != "Unknown":
        district_users = [u for u in full_leaderboard if u.get("district") == district]
        district_rank = district_users.index(user_item) + 1
        
    return {
        "global_rank": global_rank,
        "district_rank": district_rank,
        **user_item
    }

@router.get("/global")
def get_global_leaderboard(limit: int = 10, user_id: str = None):
    from app.services.mongodb_service import user_stats_collection
    
    full_leaderboard = _get_computed_global_leaderboard(user_stats_collection, users_collection)
    if not full_leaderboard:
        return {"status": True, "message": "No data found", "data": [], "user_rank": None}
        
    user_rank_data = None
    if user_id:
        user_rank_data = _get_user_ranks(user_id, full_leaderboard)
        if user_rank_data:
            user_rank_data["rank"] = user_rank_data["global_rank"]
            
    return {
        "status": True,
        "message": "Global leaderboard fetched",
        "data": full_leaderboard[:limit],
        "user_rank": user_rank_data
    }

@router.get("/global/district/{district_name}")
def get_district_leaderboard(district_name: str, limit: int = 10, user_id: str = None):
    from app.services.mongodb_service import user_stats_collection
    
    full_leaderboard = _get_computed_global_leaderboard(user_stats_collection, users_collection)
    district_leaderboard = [u for u in full_leaderboard if u.get("district") == district_name]
    
    if not district_leaderboard:
        return {"status": True, "message": f"No data found for district {district_name}", "data": [], "user_rank": None}
        
    user_rank_data = None
    if user_id:
        user_rank_data = _get_user_ranks(user_id, full_leaderboard)
        if user_rank_data:
            user_rank_data["rank"] = user_rank_data.get("district_rank", user_rank_data["global_rank"])

    return {
        "status": True,
        "message": f"Leaderboard for {district_name} fetched",
        "data": district_leaderboard[:limit],
        "user_rank": user_rank_data
    }
