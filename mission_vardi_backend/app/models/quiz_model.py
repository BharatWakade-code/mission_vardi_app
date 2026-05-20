from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    id: str
    text: str
    options: List[str]
    correctAnswer: str

class QuizCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    type: Optional[str] = None
    questions: List[Question]

class QuizResultSubmit(BaseModel):
    user_id: str
    score: int
    total: int
