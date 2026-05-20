from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from uuid import uuid4
from datetime import datetime

from app.models.quiz_model import QuizCreate, QuizResultSubmit
from app.services.s3_service import save_document, get_document, list_documents

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

@router.post("")
async def create_quiz(quiz: QuizCreate):
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
    
    save_document("quizzes", quiz_id, quiz_data)
    return {
        "status": True,
        "message": "Quiz created successfully",
        "data": quiz_data
    }

@router.get("")
async def list_quizzes(category: Optional[str] = None, type: Optional[str] = None):
    quizzes = list_documents("quizzes/")
    
    if category:
        quizzes = [q for q in quizzes if q.get("category") == category]
        
    if type:
        quizzes = [q for q in quizzes if q.get("type") == type]
        
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": quizzes
    }

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = get_document("quizzes", quiz_id)
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
    quiz = get_document("quizzes", quiz_id)
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
    
    # Save to a specific result prefix that we can easily query for leaderboards
    save_document(f"results/{quiz_id}", result.user_id, result_data)
    
    return {
        "status": True,
        "message": "Result saved successfully",
        "data": result_data
    }
