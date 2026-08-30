from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.services.mongodb_service import (
    main_categories_collection,
    sub_categories_collection,
    exams_collection,
    categories_collection,
    subjects_collection,
    topics_collection,
    tests_collection,
)

router = APIRouter(tags=["Meta & Categories"])

@router.get("/main-categories")
async def get_main_categories():
    items = list(main_categories_collection.find({}, {"_id": 0}))
    items.sort(key=lambda x: x.get("order", 99))
    
    # Calculate counts
    all_sub = list(sub_categories_collection.find({}, {"_id": 0}))
    all_tests = list(tests_collection.find({}, {"_id": 0}))

    for item in items:
        mc_id = item.get("id")
        sub_count = len([sc for sc in all_sub if sc.get("mainCategoryId") == mc_id])
        t_count = len([t for t in all_tests if t.get("mainCategoryId") == mc_id or t.get("main_category_id") == mc_id or t.get("categoryId") == mc_id or t.get("category") == item.get("name")])
        item["subCategoriesCount"] = sub_count
        item["totalTests"] = t_count

    return {
        "status": True,
        "mainCategories": items,
        "data": items
    }

@router.get("/main-categories/{id}")
async def get_main_category_by_id(id: str):
    item = main_categories_collection.find_one({"id": id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Main Category not found")
    return {
        "status": True,
        "mainCategory": item,
        "data": item
    }

@router.get("/sub-categories")
async def get_sub_categories(mainCategoryId: Optional[str] = Query(None)):
    query = {}
    if mainCategoryId and mainCategoryId != 'all':
        query["mainCategoryId"] = mainCategoryId

    items = list(sub_categories_collection.find(query, {"_id": 0}))
    all_tests = list(tests_collection.find({}, {"_id": 0}))
    all_mains = {mc["id"]: mc.get("name", "") for mc in main_categories_collection.find({}, {"_id": 0})}

    for item in items:
        sc_id = item.get("id")
        parent_name = item.get("mainCategoryName") or all_mains.get(item.get("mainCategoryId"), "")
        item["mainCategoryName"] = parent_name
        t_count = len([t for t in all_tests if t.get("subCategoryId") == sc_id or t.get("sub_category_id") == sc_id or t.get("subcategoryId") == sc_id or t.get("category") == item.get("name")])
        item["totalTests"] = t_count

    return {
        "status": True,
        "subCategories": items,
        "data": items
    }

@router.get("/sub-categories/{id}")
async def get_sub_category_by_id(id: str):
    item = sub_categories_collection.find_one({"id": id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Sub Category not found")
    return {
        "status": True,
        "subCategory": item,
        "data": item
    }

@router.get("/exams")
async def get_exams():
    items = list(exams_collection.find({}, {"_id": 0}))
    return {
        "status": True,
        "exams": items,
        "data": items
    }

@router.get("/categories")
async def get_categories(examId: Optional[str] = Query(None)):
    query = {}
    if examId:
        query["examId"] = examId
    items = list(categories_collection.find(query, {"_id": 0}))
    return {
        "status": True,
        "categories": items,
        "data": items
    }

@router.get("/subjects")
async def get_subjects():
    items = list(subjects_collection.find({}, {"_id": 0}))
    return {
        "status": True,
        "subjects": items,
        "data": items
    }

@router.get("/topics")
async def get_topics(subjectId: Optional[str] = Query(None)):
    query = {}
    if subjectId:
        query["subjectId"] = subjectId
    items = list(topics_collection.find(query, {"_id": 0}))
    return {
        "status": True,
        "topics": items,
        "data": items
    }
