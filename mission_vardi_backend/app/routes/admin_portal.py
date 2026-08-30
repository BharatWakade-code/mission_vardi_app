from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.services.mongodb_service import (
    users_collection,
    orders_collection,
    coupons_collection,
    questions_collection,
    tests_collection,
    test_series_collection,
    main_categories_collection,
    sub_categories_collection,
    exams_collection,
    categories_collection,
    subjects_collection,
    pyqs_collection,
    notes_collection,
    notifications_collection,
    settings_collection,
    results_collection,
    attempts_collection,
    db
)

from app.services.auth_service import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin Portal CRUD"])


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """FastAPI dependency: ensures the caller is authenticated AND has the admin role."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required.")
    return current_user


# ─── Analytics & Users & Orders ───────────────────────────────────────────────
@router.get("/analytics")
async def get_admin_analytics(_: dict = Depends(require_admin)):
    total_students = users_collection.count_documents({"role": {"$ne": "admin"}})
    total_orders = orders_collection.count_documents({"status": "successful"})
    
    successful_orders = list(orders_collection.find({"status": "successful"}))
    total_revenue = sum(o.get("amount", 0) for o in successful_orders)
    total_tests = tests_collection.count_documents({})

    analytics = {
        "totalStudents": total_students,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalTests": total_tests,
        "monthlyRevenue": [
            {"month": "May", "revenue": round(total_revenue * 0.15)},
            {"month": "Jun", "revenue": round(total_revenue * 0.20)},
            {"month": "Jul", "revenue": round(total_revenue * 0.25)},
            {"month": "Aug", "revenue": round(total_revenue * 0.40)}
        ]
    }
    return {"status": True, "analytics": analytics, "data": analytics}


@router.get("/students")
async def get_admin_students(_: dict = Depends(require_admin)):
    students = list(users_collection.find({}, {"_id": 0, "hashed_password": 0}))
    return {"status": True, "students": students, "data": students}


@router.put("/students/{id}/role")
async def update_student_role(id: str, payload: dict, _: dict = Depends(require_admin)):
    new_role = payload.get("role", "student")
    res = users_collection.update_one({"id": id}, {"$set": {"role": new_role}})
    u = users_collection.find_one({"id": id}, {"_id": 0, "hashed_password": 0})
    return {"status": True, "user": u, "data": u}


@router.delete("/students/{id}")
async def delete_student(id: str, _: dict = Depends(require_admin)):
    users_collection.delete_one({"id": id})
    return {"status": True, "success": True}


@router.get("/orders")
async def get_admin_orders(_: dict = Depends(require_admin)):
    orders = list(orders_collection.find({}, {"_id": 0}).sort("createdAt", -1))
    return {"status": True, "orders": orders, "data": orders}


# ─── Coupons CRUD ─────────────────────────────────────────────────────────────
@router.get("/coupons")
async def get_admin_coupons(_: dict = Depends(require_admin)):
    items = list(coupons_collection.find({}, {"_id": 0}))
    return {"status": True, "coupons": items, "data": items}


@router.post("/coupons")
async def create_admin_coupon(payload: dict, _: dict = Depends(require_admin)):
    cid = payload.get("id") or str(uuid.uuid4())
    doc = {
        "id": cid,
        "code": (payload.get("code") or "").upper().strip(),
        "discountType": payload.get("discountType", "percentage"),
        "discountValue": float(payload.get("discountValue", 0)),
        "minOrderValue": float(payload.get("minOrderValue", 0)),
        "maxDiscount": float(payload.get("maxDiscount")) if payload.get("maxDiscount") else None,
        "timesUsed": 0,
        "usageLimit": int(payload.get("usageLimit", 100)),
        "isActive": payload.get("isActive", True),
        "expiresAt": payload.get("expiresAt") or (datetime.utcnow().replace(year=datetime.utcnow().year+1)).isoformat()
    }
    coupons_collection.insert_one(doc)
    doc.pop("_id", None)
    return {"status": True, "coupon": doc, "data": doc}


@router.put("/coupons/{id}")
async def update_admin_coupon(id: str, payload: dict, _: dict = Depends(require_admin)):
    coupons_collection.update_one({"id": id}, {"$set": payload})
    c = coupons_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "coupon": c, "data": c}


@router.delete("/coupons/{id}")
async def delete_admin_coupon(id: str, _: dict = Depends(require_admin)):
    coupons_collection.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Questions CRUD & Bulk Import ─────────────────────────────────────────────
@router.get("/question-banks")
async def get_question_banks(_: dict = Depends(require_admin)):
    banks = [
        {"id": "qb_sci", "title": "Science Question Bank", "count": 250},
        {"id": "qb_math", "title": "Mathematics Question Bank", "count": 300},
        {"id": "qb_pol", "title": "Polity & Constitution Bank", "count": 400}
    ]
    return {"status": True, "questionBanks": banks, "data": banks}


@router.get("/questions")
async def get_admin_questions(subjectId: Optional[str] = Query(None), _: dict = Depends(require_admin)):
    query = {}
    if subjectId:
        query["subjectId"] = subjectId
    items = list(questions_collection.find(query, {"_id": 0}))
    return {"status": True, "questions": items, "data": items}


@router.post("/questions")
async def create_admin_question(payload: dict, _: dict = Depends(require_admin)):
    qid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = qid
    questions_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "question": payload, "data": payload}


@router.put("/questions/{id}")
async def update_admin_question(id: str, payload: dict, _: dict = Depends(require_admin)):
    questions_collection.update_one({"id": id}, {"$set": payload})
    q = questions_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "question": q, "data": q}


@router.delete("/questions/{id}")
async def delete_admin_question(id: str, _: dict = Depends(require_admin)):
    questions_collection.delete_one({"id": id})
    return {"status": True, "success": True}


@router.post("/questions/bulk")
async def bulk_import_questions(payload: dict, _: dict = Depends(require_admin)):
    qs = payload.get("questions", [])
    created = []
    for q in qs:
        if "id" not in q:
            q["id"] = str(uuid.uuid4())
        questions_collection.update_one({"id": q["id"]}, {"$set": q}, upsert=True)
        created.append(q)
    return {"status": True, "created": created, "count": len(created)}


@router.get("/questions/analytics")
async def get_question_analytics(_: dict = Depends(require_admin)):
    all_qs = list(questions_collection.find({}, {"_id": 0}))
    analytics = [{"questionId": q.get("id"), "title": q.get("question", "")[:30], "accuracy": 75.5, "attempts": 120} for q in all_qs[:10]]
    return {"status": True, "analytics": analytics, "data": analytics}


# ─── Tests CRUD ───────────────────────────────────────────────────────────────
@router.get("/tests")
async def get_admin_tests(_: dict = Depends(require_admin)):
    items = list(tests_collection.find({}, {"_id": 0}))
    return {"status": True, "tests": items, "data": items}


@router.post("/tests")
async def create_admin_test(payload: dict, _: dict = Depends(require_admin)):
    tid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = tid
    if "createdAt" not in payload:
        payload["createdAt"] = datetime.utcnow().isoformat()
    tests_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "test": payload, "data": payload}


@router.put("/tests/{id}")
async def update_admin_test(id: str, payload: dict, _: dict = Depends(require_admin)):
    tests_collection.update_one({"id": id}, {"$set": payload})
    t = tests_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "test": t, "data": t}


@router.delete("/tests/{id}")
async def delete_admin_test(id: str, _: dict = Depends(require_admin)):
    tests_collection.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Test Series CRUD ─────────────────────────────────────────────────────────
@router.post("/test-series")
async def create_admin_test_series(payload: dict, _: dict = Depends(require_admin)):
    sid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = sid
    test_series_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "series": payload, "data": payload}


@router.put("/test-series/{id}")
async def update_admin_test_series(id: str, payload: dict, _: dict = Depends(require_admin)):
    test_series_collection.update_one({"id": id}, {"$set": payload})
    s = test_series_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "series": s, "data": s}


@router.delete("/test-series/{id}")
async def delete_admin_test_series(id: str, _: dict = Depends(require_admin)):
    test_series_collection.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Main & Sub Categories CRUD ───────────────────────────────────────────────
@router.get("/main-categories")
async def get_admin_main_categories(_: dict = Depends(require_admin)):
    items = list(main_categories_collection.find({}, {"_id": 0}))
    return {"status": True, "mainCategories": items, "data": items}


@router.post("/main-categories")
async def create_admin_main_category(payload: dict, _: dict = Depends(require_admin)):
    mid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = mid
    main_categories_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "mainCategory": payload, "data": payload}


@router.put("/main-categories/{id}")
async def update_admin_main_category(id: str, payload: dict, _: dict = Depends(require_admin)):
    main_categories_collection.update_one({"id": id}, {"$set": payload})
    mc = main_categories_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "mainCategory": mc, "data": mc}


@router.delete("/main-categories/{id}")
async def delete_admin_main_category(id: str, _: dict = Depends(require_admin)):
    main_categories_collection.delete_one({"id": id})
    sub_categories_collection.delete_many({"mainCategoryId": id})
    return {"status": True, "success": True}


@router.get("/sub-categories")
async def get_admin_sub_categories(mainCategoryId: Optional[str] = Query(None), _: dict = Depends(require_admin)):
    query = {}
    if mainCategoryId:
        query["mainCategoryId"] = mainCategoryId
    items = list(sub_categories_collection.find(query, {"_id": 0}))
    return {"status": True, "subCategories": items, "data": items}


@router.post("/sub-categories")
async def create_admin_sub_category(payload: dict, _: dict = Depends(require_admin)):
    sid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = sid
    sub_categories_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "subCategory": payload, "data": payload}


@router.put("/sub-categories/{id}")
async def update_admin_sub_category(id: str, payload: dict, _: dict = Depends(require_admin)):
    sub_categories_collection.update_one({"id": id}, {"$set": payload})
    sc = sub_categories_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "subCategory": sc, "data": sc}


@router.delete("/sub-categories/{id}")
async def delete_admin_sub_category(id: str, _: dict = Depends(require_admin)):
    sub_categories_collection.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Exams, Categories & Subjects CRUD ───────────────────────────────────────
@router.get("/exams")
async def get_admin_exams(_: dict = Depends(require_admin)):
    items = list(exams_collection.find({}, {"_id": 0}))
    return {"status": True, "exams": items, "data": items}


@router.post("/exams")
async def create_admin_exam(payload: dict, _: dict = Depends(require_admin)):
    eid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = eid
    exams_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "exam": payload, "data": payload}


@router.put("/exams/{id}")
async def update_admin_exam(id: str, payload: dict, _: dict = Depends(require_admin)):
    exams_collection.update_one({"id": id}, {"$set": payload})
    ex = exams_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "exam": ex, "data": ex}


@router.delete("/exams/{id}")
async def delete_admin_exam(id: str, _: dict = Depends(require_admin)):
    exams_collection.delete_one({"id": id})
    return {"status": True, "success": True}


@router.get("/categories")
async def get_admin_categories(examId: Optional[str] = Query(None), _: dict = Depends(require_admin)):
    query = {}
    if examId:
        query["examId"] = examId
    items = list(categories_collection.find(query, {"_id": 0}))
    return {"status": True, "categories": items, "data": items}


@router.post("/categories")
async def create_admin_category(payload: dict, _: dict = Depends(require_admin)):
    cid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = cid
    categories_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "category": payload, "data": payload}


@router.put("/categories/{id}")
async def update_admin_category(id: str, payload: dict, _: dict = Depends(require_admin)):
    categories_collection.update_one({"id": id}, {"$set": payload})
    c = categories_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "category": c, "data": c}


@router.delete("/categories/{id}")
async def delete_admin_category(id: str, _: dict = Depends(require_admin)):
    categories_collection.delete_one({"id": id})
    return {"status": True, "success": True}


@router.get("/subjects")
async def get_admin_subjects(_: dict = Depends(require_admin)):
    items = list(subjects_collection.find({}, {"_id": 0}))
    return {"status": True, "subjects": items, "data": items}


@router.post("/subjects")
async def create_admin_subject(payload: dict, _: dict = Depends(require_admin)):
    sid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = sid
    subjects_collection.insert_one(payload)
    payload.pop("_id", None)
    return {"status": True, "subject": payload, "data": payload}


@router.put("/subjects/{id}")
async def update_admin_subject(id: str, payload: dict, _: dict = Depends(require_admin)):
    subjects_collection.update_one({"id": id}, {"$set": payload})
    sb = subjects_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "subject": sb, "data": sb}


@router.delete("/subjects/{id}")
async def delete_admin_subject(id: str, _: dict = Depends(require_admin)):
    subjects_collection.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Admin PYQ, Notes, Alerts CRUD ────────────────────────────────────────────
@router.get("/pyqs")
async def get_admin_pyqs(_: dict = Depends(require_admin)):
    items = list(pyqs_collection.find({}, {"_id": 0}))
    return {"status": True, "pyqs": items, "data": items}


@router.put("/pyqs/{id}")
async def update_admin_pyq(id: str, payload: dict, _: dict = Depends(require_admin)):
    pyqs_collection.update_one({"id": id}, {"$set": payload})
    p = pyqs_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "pyq": p, "data": p}


@router.get("/notes")
async def get_admin_notes(_: dict = Depends(require_admin)):
    items = list(notes_collection.find({}, {"_id": 0}))
    return {"status": True, "notes": items, "data": items}


@router.put("/notes/{id}")
async def update_admin_note(id: str, payload: dict, _: dict = Depends(require_admin)):
    notes_collection.update_one({"id": id}, {"$set": payload})
    n = notes_collection.find_one({"id": id}, {"_id": 0})
    return {"status": True, "note": n, "data": n}


@router.get("/alerts")
async def get_admin_alerts(_: dict = Depends(require_admin)):
    alerts_col = db["alerts"]
    items = list(alerts_col.find({}, {"_id": 0}))
    return {"status": True, "alerts": items, "data": items}


@router.put("/alerts/{id}")
async def update_admin_alert(id: str, payload: dict, _: dict = Depends(require_admin)):
    alerts_col = db["alerts"]
    alerts_col.update_one({"id": id}, {"$set": payload})
    a = alerts_col.find_one({"id": id}, {"_id": 0})
    return {"status": True, "alert": a, "data": a}


@router.delete("/alerts/{id}")
async def delete_admin_alert(id: str, _: dict = Depends(require_admin)):
    alerts_col = db["alerts"]
    alerts_col.delete_one({"id": id})
    return {"status": True, "success": True}


# ─── Admin Settings & Notifications ──────────────────────────────────────────
@router.get("/settings")
async def get_admin_settings(_: dict = Depends(require_admin)):
    st = settings_collection.find_one({}, {"_id": 0}) or {}
    return {"status": True, "settings": st, "data": st}


@router.put("/settings")
async def update_admin_settings(payload: dict, _: dict = Depends(require_admin)):
    settings_collection.update_one({}, {"$set": payload}, upsert=True)
    st = settings_collection.find_one({}, {"_id": 0})
    return {"status": True, "settings": st, "data": st}


@router.post("/notifications/broadcast")
async def broadcast_notification(payload: dict, _: dict = Depends(require_admin)):
    all_users = list(users_collection.find({}, {"id": 1}))
    broadcast_items = []
    now = datetime.utcnow().isoformat()
    for u in all_users:
        nid = str(uuid.uuid4())
        doc = {
            "id": nid,
            "userId": u["id"],
            "title": payload.get("title", "Announcement"),
            "message": payload.get("message", ""),
            "link": payload.get("link"),
            "isRead": False,
            "createdAt": now
        }
        broadcast_items.append(doc)

    if broadcast_items:
        notifications_collection.insert_many(broadcast_items)

    return {"status": True, "message": "Broadcast sent successfully", "count": len(broadcast_items)}
