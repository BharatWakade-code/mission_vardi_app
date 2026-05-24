from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.models.study_model import StudySessionStart, StudySessionEnd
from app.services.auth_service import get_current_user
from app.services.mongodb_service import (
    quizzes_collection,
    results_collection,
    study_sessions_collection,
    user_stats_collection,
)

router = APIRouter(prefix="/study", tags=["Study"])


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _compute_percentage(score: int, total: int) -> float:
    if total == 0:
        return 0.0
    return round((score / total) * 100, 2)


def _update_user_stats(user_id: str):
    """Recompute and upsert user_stats from all study_sessions for this user."""
    sessions = list(study_sessions_collection.find(
        {"user_id": user_id, "status": "completed"}, {"_id": 0}
    ))

    if not sessions:
        return

    total_quizzes = len(sessions)
    total_time = sum(s.get("time_spent_seconds", 0) for s in sessions)
    avg_score = round(
        sum(s.get("percentage", 0) for s in sessions) / total_quizzes, 2
    )

    # Category breakdown
    category_stats: dict = {}
    for s in sessions:
        cat = s.get("category") or "general"
        if cat not in category_stats:
            category_stats[cat] = {"quizzes": 0, "total_score": 0}
        category_stats[cat]["quizzes"] += 1
        category_stats[cat]["total_score"] += s.get("percentage", 0)

    for cat, data in category_stats.items():
        data["avg_score"] = round(data["total_score"] / data["quizzes"], 2)
        del data["total_score"]

    # Streak — count consecutive calendar days with at least one session (most recent first)
    study_dates = sorted(
        {s["ended_at"][:10] for s in sessions if s.get("ended_at")},
        reverse=True,
    )
    streak = 0
    today = datetime.utcnow().date()
    for i, d in enumerate(study_dates):
        day = datetime.strptime(d, "%Y-%m-%d").date()
        expected = today - timedelta(days=i)
        if day == expected:
            streak += 1
        else:
            break

    # Best streak — scan all dates ascending
    sorted_asc = sorted(study_dates)
    best_streak = cur = 1
    for i in range(1, len(sorted_asc)):
        prev = datetime.strptime(sorted_asc[i - 1], "%Y-%m-%d").date()
        curr = datetime.strptime(sorted_asc[i], "%Y-%m-%d").date()
        if (curr - prev).days == 1:
            cur += 1
            best_streak = max(best_streak, cur)
        else:
            cur = 1

    last_session = max(sessions, key=lambda s: s.get("ended_at", ""))

    stats = {
        "user_id": user_id,
        "total_quizzes": total_quizzes,
        "total_time_seconds": total_time,
        "average_score_percent": avg_score,
        "current_streak_days": streak,
        "best_streak_days": best_streak,
        "category_stats": category_stats,
        "last_studied_at": last_session.get("ended_at"),
    }

    user_stats_collection.update_one(
        {"user_id": user_id}, {"$set": stats}, upsert=True
    )


# ─── Session Start ────────────────────────────────────────────────────────────
@router.post("/session/start", summary="Start a quiz study session")
async def start_session(data: StudySessionStart):
    quiz = quizzes_collection.find_one({"id": data.quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    session_id = str(uuid4())
    now = datetime.utcnow().isoformat()

    session_doc = {
        "id": session_id,
        "user_id": data.user_id,
        "quiz_id": data.quiz_id,
        "quiz_title": quiz.get("title", ""),
        "category": quiz.get("category"),
        "started_at": now,
        "ended_at": None,
        "time_spent_seconds": 0,
        "score": None,
        "total": len(quiz.get("questions", [])),
        "percentage": None,
        "status": "in_progress",
        "answers": [],
    }

    study_sessions_collection.insert_one(session_doc)
    session_doc.pop("_id", None)

    return {
        "status": True,
        "message": "Session started",
        "data": {"session_id": session_id, "started_at": now},
    }


# ─── Session End ──────────────────────────────────────────────────────────────
@router.put("/session/{session_id}/end", summary="Submit answers and end session")
async def end_session(session_id: str, data: StudySessionEnd):
    session = study_sessions_collection.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session["status"] == "completed":
        raise HTTPException(status_code=400, detail="Session already completed")

    # Fetch quiz questions to auto-grade
    quiz = quizzes_collection.find_one({"id": session["quiz_id"]}, {"_id": 0})
    answer_map = {a.question_id: a.selected_option for a in data.answers}

    graded_answers = []
    score = 0
    if quiz:
        for q in quiz.get("questions", []):
            selected = answer_map.get(q["id"], "")
            correct = q["correctAnswer"] == selected
            if correct:
                score += 1
            graded_answers.append({
                "question_id": q["id"],
                "selected_option": selected,
                "correct_answer": q["correctAnswer"],
                "is_correct": correct,
            })

    total = session["total"]
    percentage = _compute_percentage(score, total)
    now = datetime.utcnow().isoformat()

    update = {
        "ended_at": now,
        "time_spent_seconds": data.time_spent_seconds,
        "score": score,
        "percentage": percentage,
        "status": "completed",
        "answers": graded_answers,
    }

    study_sessions_collection.update_one({"id": session_id}, {"$set": update})

    # Mirror to legacy results_collection for leaderboard compatibility
    result_doc = {
        "id": f"{session['quiz_id']}_{session['user_id']}",
        "quiz_id": session["quiz_id"],
        "user_id": session["user_id"],
        "score": score,
        "total": total,
        "time_spent_seconds": data.time_spent_seconds,
        "percentage": percentage,
        "submittedAt": now,
    }
    results_collection.update_one(
        {"id": result_doc["id"]}, {"$set": result_doc}, upsert=True
    )

    # Update aggregated user stats
    _update_user_stats(session["user_id"])

    return {
        "status": True,
        "message": "Session completed",
        "data": {
            "session_id": session_id,
            "score": score,
            "total": total,
            "percentage": percentage,
            "time_spent_seconds": data.time_spent_seconds,
            "answers": graded_answers,
        },
    }


# ─── Get Single Session ───────────────────────────────────────────────────────
@router.get("/session/{session_id}", summary="Get a specific session detail")
async def get_session(session_id: str):
    session = study_sessions_collection.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": True, "message": "Data fetched", "data": session}


# ─── History ──────────────────────────────────────────────────────────────────
@router.get("/history/{user_id}", summary="Full paginated quiz history")
async def get_history(
    user_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    category: Optional[str] = None,
    status: Optional[str] = None,
):
    query: dict = {"user_id": user_id}
    if category:
        query["category"] = category
    if status:
        query["status"] = status

    skip = (page - 1) * limit
    total_count = study_sessions_collection.count_documents(query)
    sessions = list(
        study_sessions_collection.find(query, {"_id": 0, "answers": 0})
        .sort("started_at", -1)
        .skip(skip)
        .limit(limit)
    )

    return {
        "status": True,
        "message": "History fetched",
        "data": {
            "page": page,
            "limit": limit,
            "total": total_count,
            "sessions": sessions,
        },
    }


@router.get("/history/{user_id}/recent", summary="Last 5 quiz attempts")
async def get_recent(user_id: str):
    sessions = list(
        study_sessions_collection.find(
            {"user_id": user_id, "status": "completed"}, {"_id": 0, "answers": 0}
        )
        .sort("ended_at", -1)
        .limit(5)
    )
    return {"status": True, "message": "Recent history fetched", "data": sessions}


@router.get("/history/{user_id}/summary", summary="Aggregated study statistics")
async def get_summary(user_id: str):
    stats = user_stats_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not stats:
        # Compute on-demand if stats haven't been cached yet
        _update_user_stats(user_id)
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
            },
        }

    return {"status": True, "message": "Summary fetched", "data": stats}
