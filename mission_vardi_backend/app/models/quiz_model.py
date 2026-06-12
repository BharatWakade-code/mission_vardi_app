from pydantic import BaseModel
from typing import List, Optional


class AnswerItem(BaseModel):
    question_id: str
    selected_option: str

class Question(BaseModel):
    id: str
    text: str
    text_mr: Optional[str] = None
    options: List[str]
    options_mr: Optional[List[str]] = None
    correctAnswer: str

class QuizCreate(BaseModel):
    title: str
    title_mr: Optional[str] = None
    description: str
    description_mr: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    questions: List[Question]

class QuizResultSubmit(BaseModel):
    user_id: str
    score: int
    total: int
    time_spent_seconds: Optional[int] = 0
    answers: Optional[List[AnswerItem]] = []
