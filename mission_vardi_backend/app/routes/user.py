from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

from app.models.user_model import UserCreate, UserUpdate, ProfileUpdate
from app.services.mongodb_service import users_collection, user_stats_collection, study_sessions_collection, results_collection

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

# ─── Badge Definitions ────────────────────────────────────────────────────────
BADGES = [
    {"id": "first_quiz",   "title": "पहिला प्रश्नमंजुषा", "desc": "First quiz completed",       "condition": lambda s: s.get("total_quizzes", 0) >= 1},
    {"id": "quiz_10",      "title": "दहावा टप्पा",         "desc": "10 quizzes completed",       "condition": lambda s: s.get("total_quizzes", 0) >= 10},
    {"id": "quiz_50",      "title": "पन्नास पूर्ण",        "desc": "50 quizzes completed",       "condition": lambda s: s.get("total_quizzes", 0) >= 50},
    {"id": "quiz_100",     "title": "शंभरी",               "desc": "100 quizzes completed",      "condition": lambda s: s.get("total_quizzes", 0) >= 100},
    {"id": "streak_7",     "title": "७ दिवस सलग",          "desc": "7-day study streak",         "condition": lambda s: s.get("best_streak_days", 0) >= 7},
    {"id": "streak_30",    "title": "महिना सलग",           "desc": "30-day study streak",        "condition": lambda s: s.get("best_streak_days", 0) >= 30},
    {"id": "merit",        "title": "गुणवत्ता",            "desc": "Average score above 80%",    "condition": lambda s: s.get("average_score_percent", 0) >= 80},
    {"id": "time_1000",    "title": "अभ्यासू",             "desc": "1000+ minutes studied",      "condition": lambda s: s.get("total_time_seconds", 0) >= 60000},
]


# ─── Profile ──────────────────────────────────────────────────────────────────
@router.get("/getProfile", summary="Full profile with study stats")
async def get_profile(user_id: str):
    user = users_collection.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    stats = user_stats_collection.find_one({"user_id": user_id}, {"_id": 0}) or {}

    recent_results = list(results_collection.find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("submittedAt", -1).limit(5))

    return {
        "status": True,
        "message": "Profile fetched",
        "data": {
            **user,
            "stats": {
                "total_quizzes": stats.get("total_quizzes", 0),
                "total_time_seconds": stats.get("total_time_seconds", 0),
                "average_score_percent": stats.get("average_score_percent", 0.0),
                "current_streak_days": stats.get("current_streak_days", 0),
                "best_streak_days": stats.get("best_streak_days", 0),
                "last_studied_at": stats.get("last_studied_at"),
                "recent_sessions": recent_results,
            }
        }
    }



@router.put("/updateProfile/{user_id}", summary="Update profile fields")
async def update_profile(user_id: str, profile: ProfileUpdate):
    user = users_collection.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {k: v for k, v in profile.dict(exclude_unset=True).items() if v is not None}
    if update_data:
        users_collection.update_one({"id": user_id}, {"$set": update_data})
        user.update(update_data)

    user.pop("hashed_password", None)
    return {"status": True, "message": "Profile updated", "data": user}


# ─── Stats ────────────────────────────────────────────────────────────────────
@router.get("/{user_id}/stats", summary="Detailed study statistics with category breakdown")
async def get_stats(user_id: str):
    stats = user_stats_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not stats:
        return {
            "status": True,
            "message": "No study data yet",
            "data": {
                "total_quizzes": 0,
                "total_time_seconds": 0,
                "average_score_percent": 0.0,
                "current_streak_days": 0,
                "best_streak_days": 0,
                "category_stats": {},
            }
        }
    return {"status": True, "message": "Stats fetched", "data": stats}


# ─── Badges ───────────────────────────────────────────────────────────────────
@router.get("/{user_id}/badges", summary="Earned & locked badges")
async def get_badges(user_id: str):
    stats = user_stats_collection.find_one({"user_id": user_id}, {"_id": 0}) or {}

    earned = []
    locked = []

    for badge in BADGES:
        entry = {
            "id": badge["id"],
            "title": badge["title"],
            "description": badge["desc"],
        }
        if badge["condition"](stats):
            earned.append(entry)
        else:
            locked.append(entry)

    return {
        "status": True,
        "message": "Badges fetched",
        "data": {
            "earned": earned,
            "locked": locked,
            "total_earned": len(earned),
        }
    }
