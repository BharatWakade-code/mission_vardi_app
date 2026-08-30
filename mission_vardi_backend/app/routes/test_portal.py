from fastapi import APIRouter, HTTPException, Query, Depends, Request
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from uuid import uuid4

from app.services.auth_service import get_current_user
from app.services.mongodb_service import (
    tests_collection,
    test_series_collection,
    attempts_collection,
    results_collection,
    purchases_collection,
    settings_collection,
    user_stats_collection,
    users_collection,
    questions_collection,
)

router = APIRouter(tags=["Tests & Attempt Engine"])


# ─── Helper Functions ────────────────────────────────────────────────────────
def check_user_access_to_test(user_id: Optional[str], test: Dict[str, Any]) -> bool:
    if test.get("isFree") or (test.get("price", 0) == 0):
        return True
    if not user_id:
        return False
    
    # Direct purchase check
    now_iso = datetime.utcnow().isoformat()
    purchase = purchases_collection.find_one({
        "userId": user_id,
        "productId": test.get("id"),
        "expiresAt": {"$gt": now_iso}
    })
    if purchase:
        return True

    # Series purchase check
    all_series = list(test_series_collection.find({"testIds": test.get("id")}))
    for s in all_series:
        sp = purchases_collection.find_one({
            "userId": user_id,
            "productId": s.get("id"),
            "productType": "test_series",
            "expiresAt": {"$gt": now_iso}
        })
        if sp:
            return True

    return False


# ─── Public Tests & Series ───────────────────────────────────────────────────
@router.get("/tests")
async def get_tests(
    mainCategoryId: Optional[str] = Query(None),
    main_category_id: Optional[str] = Query(None),
    subCategoryId: Optional[str] = Query(None),
    sub_category_id: Optional[str] = Query(None),
    subcategoryId: Optional[str] = Query(None),
    examId: Optional[str] = Query(None),
    categoryId: Optional[str] = Query(None),
    subjectId: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    isFree: Optional[bool] = Query(None),
    access_type: Optional[str] = Query(None),
    includeInPackage: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
):
    query: Dict[str, Any] = {}

    main_cat = mainCategoryId or main_category_id
    if main_cat and main_cat != 'all':
        query["$or"] = [
            {"mainCategoryId": main_cat},
            {"main_category_id": main_cat},
            {"categoryId": main_cat}
        ]

    sub_cat = subCategoryId or sub_category_id or subcategoryId
    if sub_cat and sub_cat != 'all':
        sub_filter = [
            {"subCategoryId": sub_cat},
            {"sub_category_id": sub_cat},
            {"subcategoryId": sub_cat},
            {"category": sub_cat}
        ]
        if "$or" in query:
            query["$and"] = [{"$or": query.pop("$or")}, {"$or": sub_filter}]
        else:
            query["$or"] = sub_filter

    if examId and examId != 'all':
        query["examId"] = examId
    if categoryId and categoryId != 'all':
        query["categoryId"] = categoryId
    if subjectId and subjectId != 'all':
        query["subjectId"] = subjectId

    if access_type and access_type != 'all':
        if access_type == 'free':
            query["$or"] = [{"isFree": True}, {"price": 0}]
        elif access_type == 'paid':
            query["isFree"] = False
            query["price"] = {"$gt": 0}

    if isFree is not None:
        query["isFree"] = isFree
    if includeInPackage is not None:
        query["includeInPackage"] = includeInPackage

    items = list(tests_collection.find(query, {"_id": 0}))

    if language and language != 'all':
        items = [t for t in items if t.get("language", "").lower() == language.lower() or t.get("language", "").lower() == "bilingual"]
    if difficulty and difficulty != 'all':
        items = [t for t in items if t.get("difficulty", "").lower() == difficulty.lower()]

    if search:
        q = search.lower()
        items = [
            t for t in items
            if q in t.get("title", "").lower()
            or q in t.get("titleMarathi", "")
            or q in t.get("description", "").lower()
            or q in t.get("mainCategoryName", "").lower()
            or q in t.get("subCategoryName", "").lower()
        ]

    if sort == 'popularity':
        items.sort(key=lambda x: x.get("attemptsCount", 0), reverse=True)
    elif sort == 'price_asc':
        items.sort(key=lambda x: x.get("price", 0))
    elif sort == 'price_desc':
        items.sort(key=lambda x: x.get("price", 0), reverse=True)
    elif sort == 'newest':
        items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)

    return {
        "status": True,
        "tests": items,
        "data": items
    }


@router.get("/tests/{id}")
async def get_test_by_id(id: str):
    test = tests_collection.find_one({"id": id}, {"_id": 0})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return {
        "status": True,
        "test": test,
        "data": test
    }


@router.get("/test-series")
async def get_test_series():
    items = list(test_series_collection.find({}, {"_id": 0}))
    return {
        "status": True,
        "testSeries": items,
        "data": items
    }


@router.get("/test-series/{id}")
async def get_test_series_by_id(id: str):
    series = test_series_collection.find_one({"id": id}, {"_id": 0})
    if not series:
        raise HTTPException(status_code=404, detail="Test Series not found")
    return {
        "status": True,
        "testSeries": series,
        "data": series
    }


# ─── Test Attempt Engine ─────────────────────────────────────────────────────
@router.post("/tests/{test_id}/start")
async def start_attempt(test_id: str, current_user: Optional[dict] = Depends(get_current_user)):
    test = tests_collection.find_one({"id": test_id}, {"_id": 0})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    user_id = current_user["id"] if current_user else "user-student-1"

    if not check_user_access_to_test(user_id, test):
        raise HTTPException(status_code=403, detail="ACCESS_DENIED_PAYMENT_REQUIRED")

    attempt_id = str(uuid4())
    attempt = {
        "id": attempt_id,
        "testId": test_id,
        "testTitle": test.get("title"),
        "userId": user_id,
        "status": "in_progress",
        "startedAt": datetime.utcnow().isoformat(),
        "totalTimeSeconds": (test.get("durationMinutes", 60)) * 60,
        "timeRemainingSeconds": (test.get("durationMinutes", 60)) * 60,
        "answers": {},
        "markedForReview": [],
        "timePerQuestion": {},
    }

    attempts_collection.insert_one(attempt)
    attempt.pop("_id", None)

    return {
        "status": True,
        "message": "Attempt started successfully",
        "attempt": attempt,
        "data": attempt
    }


@router.get("/attempts/{attempt_id}")
async def get_attempt(attempt_id: str):
    attempt = attempts_collection.find_one({"id": attempt_id}, {"_id": 0})
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return {
        "status": True,
        "attempt": attempt,
        "data": attempt
    }


@router.post("/attempts/{attempt_id}/answer")
async def save_answer(attempt_id: str, payload: dict):
    attempt = attempts_collection.find_one({"id": attempt_id})
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.get("status") == "submitted":
        raise HTTPException(status_code=400, detail="Attempt already submitted")

    question_id = payload.get("questionId")
    selected_option = payload.get("selectedOption")
    is_marked = payload.get("isMarkedForReview", False)
    time_spent = payload.get("timeSpentSeconds", 0)

    answers = attempt.get("answers", {})
    marked = attempt.get("markedForReview", [])
    time_per_q = attempt.get("timePerQuestion", {})

    if selected_option is not None:
        answers[question_id] = selected_option
    else:
        answers.pop(question_id, None)

    if is_marked and question_id not in marked:
        marked.append(question_id)
    elif not is_marked and question_id in marked:
        marked.remove(question_id)

    time_per_q[question_id] = (time_per_q.get(question_id, 0)) + time_spent

    attempts_collection.update_one(
        {"id": attempt_id},
        {"$set": {
            "answers": answers,
            "markedForReview": marked,
            "timePerQuestion": time_per_q,
            "updatedAt": datetime.utcnow().isoformat()
        }}
    )

    return {
        "status": True,
        "success": True,
        "answers": answers,
        "data": {"answers": answers}
    }


@router.post("/attempts/{attempt_id}/submit")
async def submit_attempt(attempt_id: str):
    attempt = attempts_collection.find_one({"id": attempt_id}, {"_id": 0})
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    test = tests_collection.find_one({"id": attempt["testId"]}, {"_id": 0})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    questions = test.get("questions", [])
    user_answers = attempt.get("answers", {})
    time_per_q = attempt.get("timePerQuestion", {})

    marks_per_q = test.get("marksPerQuestion", 1)
    negative_marking = test.get("negativeMarking", 0)

    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0
    score = 0.0

    sections_analysis: Dict[str, Any] = {}

    for q in questions:
        q_id = q.get("id")
        user_ans = user_answers.get(q_id)
        correct_ans = q.get("correctAnswer")
        section_name = q.get("sectionName") or q.get("subjectName") or "General"

        if section_name not in sections_analysis:
            sections_analysis[section_name] = {
                "sectionName": section_name,
                "totalQuestions": 0,
                "attempted": 0,
                "correct": 0,
                "incorrect": 0,
                "marksObtained": 0.0,
                "accuracy": 0.0
            }

        sec = sections_analysis[section_name]
        sec["totalQuestions"] += 1

        if user_ans is None or user_ans == "" or (isinstance(user_ans, list) and len(user_ans) == 0):
            unanswered_count += 1
        else:
            sec["attempted"] += 1
            if user_ans == correct_ans:
                correct_count += 1
                sec["correct"] += 1
                score += marks_per_q
                sec["marksObtained"] += marks_per_q
            else:
                incorrect_count += 1
                sec["incorrect"] += 1
                score -= negative_marking
                sec["marksObtained"] -= negative_marking

    total_questions = len(questions)
    total_marks = test.get("totalMarks", total_questions * marks_per_q)

    for sec in sections_analysis.values():
        if sec["attempted"] > 0:
            sec["accuracy"] = round((sec["correct"] / sec["attempted"]) * 100, 2)

    accuracy = round((correct_count / max(1, (correct_count + incorrect_count))) * 100, 2)
    percentage = round((max(0, score) / max(1, total_marks)) * 100, 2)
    total_time_spent = sum(time_per_q.values())

    result_id = str(uuid4())

    result = {
        "id": result_id,
        "attemptId": attempt_id,
        "testId": attempt["testId"],
        "testTitle": test.get("title"),
        "userId": attempt["userId"],
        "score": round(score, 2),
        "totalMarks": total_marks,
        "percentage": percentage,
        "accuracy": accuracy,
        "correctCount": correct_count,
        "incorrectCount": incorrect_count,
        "unansweredCount": unanswered_count,
        "totalQuestions": total_questions,
        "totalTimeSpentSeconds": total_time_spent,
        "cutoffMarks": test.get("cutoffMarks", math_floor(total_marks * 0.4)),
        "isPassed": score >= test.get("cutoffMarks", total_marks * 0.4),
        "sectionsAnalysis": list(sections_analysis.values()),
        "submittedAt": datetime.utcnow().isoformat()
    }

    # Mark attempt as submitted
    attempts_collection.update_one({"id": attempt_id}, {"$set": {"status": "submitted", "submittedAt": result["submittedAt"]}})
    results_collection.insert_one(result)
    result.pop("_id", None)

    # Increment test attempts count
    tests_collection.update_one({"id": attempt["testId"]}, {"$inc": {"attemptsCount": 1}})

    return {
        "status": True,
        "message": "Attempt submitted successfully",
        "result": result,
        "data": result
    }


def math_floor(val: float) -> int:
    return int(val)


# ─── Results & Student Dashboard ─────────────────────────────────────────────
@router.get("/results/{result_id}")
async def get_result_by_id(result_id: str):
    res = results_collection.find_one({"id": result_id}, {"_id": 0})
    if not res:
        raise HTTPException(status_code=404, detail="Result not found")
    
    attempt = attempts_collection.find_one({"id": res.get("attemptId")}, {"_id": 0})
    test = tests_collection.find_one({"id": res.get("testId")}, {"_id": 0})

    return {
        "status": True,
        "result": res,
        "attempt": attempt,
        "test": test,
        "data": {"result": res, "attempt": attempt, "test": test}
    }


@router.get("/student/dashboard")
async def get_student_dashboard(current_user: Optional[dict] = Depends(get_current_user)):
    user_id = current_user["id"] if current_user else "user-student-1"
    user_results = list(results_collection.find({"userId": user_id}, {"_id": 0}))

    total_tests = len(user_results)
    avg_score = round(sum(r.get("percentage", 0) for r in user_results) / max(1, total_tests), 2)
    avg_accuracy = round(sum(r.get("accuracy", 0) for r in user_results) / max(1, total_tests), 2)
    total_time = sum(r.get("totalTimeSpentSeconds", 0) for r in user_results)

    stats = {
        "totalTestsTaken": total_tests,
        "averagePercentage": avg_score,
        "averageAccuracy": avg_accuracy,
        "totalStudyHours": round(total_time / 3600, 2),
        "recentResults": user_results[-5:]
    }

    return {
        "status": True,
        "stats": stats,
        "data": stats
    }


@router.get("/student/results")
async def get_student_results(current_user: Optional[dict] = Depends(get_current_user)):
    user_id = current_user["id"] if current_user else "user-student-1"
    res_list = list(results_collection.find({"userId": user_id}, {"_id": 0}).sort("submittedAt", -1))
    return {
        "status": True,
        "results": res_list,
        "data": res_list
    }


@router.get("/student/purchases")
async def get_student_purchases(current_user: Optional[dict] = Depends(get_current_user)):
    user_id = current_user["id"] if current_user else "user-student-1"
    pur_list = list(purchases_collection.find({"userId": user_id}, {"_id": 0}).sort("createdAt", -1))
    return {
        "status": True,
        "purchases": pur_list,
        "data": pur_list
    }


@router.get("/settings")
async def get_settings():
    s = settings_collection.find_one({}, {"_id": 0})
    if not s:
        s = {
            "siteName": "Mission Vardi Mock Test Portal",
            "razorpayEnabled": True,
            "razorpayKeyId": "rzp_test_MissionVardiKey",
            "allowGuestTests": True
        }
    return {
        "status": True,
        "settings": s,
        "data": s
    }
