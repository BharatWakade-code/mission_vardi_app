from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Union, List
from uuid import uuid4
from datetime import datetime

from app.models.quiz_model import QuizCreate, QuizResultSubmit
from app.services.mongodb_service import quizzes_collection, results_collection

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

@router.post("")
async def create_quiz(quiz: Union[QuizCreate, List[QuizCreate]]):
    if isinstance(quiz, list):
        quizzes_data = []
        for q in quiz:
            quiz_id = str(uuid4())
            quiz_data = {
                "id": quiz_id,
                "title": q.title,
                "description": q.description,
                "category": q.category,
                "type": q.type,
                "questions": [question.dict() for question in q.questions],
                "createdAt": str(datetime.now())
            }
            quizzes_data.append(quiz_data)
            
        if quizzes_data:
            quizzes_collection.insert_many(quizzes_data)
            for d in quizzes_data:
                d.pop("_id", None)
                
        return {
            "status": True,
            "message": f"{len(quizzes_data)} quizzes created successfully",
            "data": quizzes_data
        }
    else:
        quiz_id = str(uuid4())
        
        quiz_data = {
            "id": quiz_id,
            "title": quiz.title,
            "description": quiz.description,
            "category": quiz.category,
            "type": quiz.type,
            "questions": [q.dict() for q in quiz.questions],
            "createdAt": str(datetime.now())
        }
        
        quizzes_collection.insert_one(quiz_data)
        quiz_data.pop("_id", None)
        return {
            "status": True,
            "message": "Quiz created successfully",
            "data": quiz_data
        }

@router.get("")
async def list_quizzes(category: Optional[str] = None, type: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if type:
        query["type"] = type
        
    quizzes = list(quizzes_collection.find(query, {"_id": 0, "questions": 0}))
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": quizzes
    }

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = quizzes_collection.find_one({"id": quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": quiz
    }

@router.post("/{quiz_id}/result")
async def save_result(quiz_id: str, result: QuizResultSubmit):
    # Verify quiz exists
    quiz = quizzes_collection.find_one({"id": quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    result_id = f"{quiz_id}_{result.user_id}"
    
    result_data = {
        "id": result_id,
        "quiz_id": quiz_id,
        "user_id": result.user_id,
        "score": result.score,
        "total": result.total,
        "submittedAt": str(datetime.now())
    }
    
    # Save/update user result in MongoDB
    results_collection.update_one(
        {"id": result_id},
        {"$set": result_data},
        upsert=True
    )
    
    return {
        "status": True,
        "message": "Result saved successfully",
        "data": result_data
    }
