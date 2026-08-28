from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Union, List
from uuid import uuid4
from datetime import datetime

from app.models.quiz_model import QuizCreate, QuizResultSubmit
from app.services.mongodb_service import quizzes_collection, results_collection, config_collection

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
                "totalQuestions": len(q.questions),
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
            "totalQuestions": len(quiz.questions),
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
    if quiz_id == "daily-challenge" or quiz_id.startswith("daily_challenge"):
        daily_quiz_id = quiz_id if quiz_id != "daily-challenge" else f"daily_challenge_{datetime.now().strftime('%Y-%m-%d')}"
        
        # Check if challenge already exists
        daily_quiz = quizzes_collection.find_one({"id": daily_quiz_id}, {"_id": 0})
        
        if not daily_quiz:
            import random
            
            # Fetch all questions from all quizzes
            all_quizzes = list(quizzes_collection.find({"type": {"$ne": "challenge"}}, {"questions": 1, "category": 1}))
            all_questions = []
            for qz in all_quizzes:
                for q in qz.get("questions", []):
                    all_questions.append(q)
            
            if len(all_questions) < 3:
                all_questions = [
                    {
                        "id": 1,
                        "questionText": "महाराष्ट्र राज्याची राजधानी कोणती आहे?",
                        "questionTextEn": "What is the capital of Maharashtra?",
                        "options": ["पुणे", "मुंबई", "नागपूर", "नाशिक"],
                        "correctOptionIndex": 1,
                        "explanation": "महाराष्ट्र राज्याची राजधानी मुंबई आहे, तर नागपूर ही उपराजधानी आहे.",
                        "marks": 2
                    },
                    {
                        "id": 2,
                        "questionText": "महाराष्ट्र पोलीस दलाचे मुख्य ब्रीदवाक्य कोणते आहे?",
                        "questionTextEn": "What is the motto of Maharashtra Police?",
                        "options": ["सद्रक्षणाय खलनिग्रहणाय", "सेवा परमो धर्मः", "जय हिंद", "सत्यमेव जयते"],
                        "correctOptionIndex": 0,
                        "explanation": "'सद्रक्षणाय खलनिग्रहणाय' (सज्जनांचे रक्षण आणि दुर्जनांचा संहार) हे महाराष्ट्र पोलीस दलाचे ब्रीदवाक्य आहे.",
                        "marks": 2
                    },
                    {
                        "id": 3,
                        "questionText": "महाराष्ट्रातील सर्वात लांब नदी कोणती आहे?",
                        "questionTextEn": "Which is the longest river in Maharashtra?",
                        "options": ["कृष्णा", "भीमा", "गोदावरी", "तापी"],
                        "correctOptionIndex": 2,
                        "explanation": "गोदावरी ही महाराष्ट्रातील तसेच दक्षिण भारताची सर्वात लांब नदी आहे (दक्षिण गंगा).",
                        "marks": 2
                    },
                    {
                        "id": 4,
                        "questionText": "महाराष्ट्राचे सध्याचे राज्यपाल कोण आहेत?",
                        "questionTextEn": "Who is the current Governor of Maharashtra?",
                        "options": ["रमेश बैस", "सी. पी. राधाकृष्णन", "भगतसिंग कोश्यारी", "विद्यासागर राव"],
                        "correctOptionIndex": 1,
                        "explanation": "महाराष्ट्राचे राज्यपाल सी. पी. राधाकृष्णन आहेत.",
                        "marks": 2
                    },
                    {
                        "id": 5,
                        "questionText": "महाराष्ट्र दिन कोणत्या तारखेला साजरा केला जातो?",
                        "questionTextEn": "On which date is Maharashtra Day celebrated?",
                        "options": ["१५ ऑगस्ट", "२६ जानेवारी", "१ मे", "१७ सप्टेंबर"],
                        "correctOptionIndex": 2,
                        "explanation": "१ मे १९६० रोजी महाराष्ट्र राज्याची स्थापना झाली, म्हणून १ मे हा महाराष्ट्र दिन म्हणून साजरा केला जातो.",
                        "marks": 2
                    }
                ]
                
            selected = random.sample(all_questions, min(10, len(all_questions)))
            
            daily_quiz = {
                "id": daily_quiz_id,
                "title": f"Daily Challenge ({daily_quiz_id.replace('daily_challenge_', '')})",
                "description": "Test your knowledge with 10 random Marathi competitive exam questions!",
                "category": "Daily Challenge",
                "type": "challenge",
                "totalQuestions": len(selected),
                "durationMinutes": 15,
                "questions": selected,
                "createdAt": str(datetime.now())
            }
            
            quizzes_collection.insert_one(daily_quiz)
            daily_quiz.pop("_id", None)

        return {
            "status": True,
            "message": "Daily challenge fetched successfully",
            "data": daily_quiz
        }

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

@router.delete("/{quiz_id}")
async def delete_quiz(quiz_id: str):
    result = quizzes_collection.delete_one({"id": quiz_id})
    if result.deleted_count == 1:
        return {
            "status": True,
            "message": "Quiz deleted successfully"
        }
    return {
        "status": False,
        "message": "Quiz not found"
    }

from app.services.auth_service import get_current_user
from fastapi import Depends

@router.get("/user/my-results", summary="Get current user's quiz results")
async def get_my_results(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    results = list(results_collection.find({"user_id": user_id}, {"_id": 0}).sort("submittedAt", 1))
    
    # We might also want to fetch quiz titles for each result
    # For a small platform, we can just grab all quizzes and map them
    all_quizzes = list(quizzes_collection.find({}, {"id": 1, "title": 1, "_id": 0}))
    quiz_map = {q["id"]: q.get("title", "Unknown Quiz") for q in all_quizzes}
    
    for r in results:
        r["quiz_title"] = quiz_map.get(r["quiz_id"], "Unknown Quiz")
        
    return {
        "status": True,
        "message": "Results fetched successfully",
        "data": results
    }
