from pydantic import BaseModel
from typing import List, Optional


class AnswerItem(BaseModel):
    question_id: str
    selected_option: str


class StudySessionStart(BaseModel):
    user_id: str
    quiz_id: str
    mode: Optional[str] = "Timed"


class StudySessionEnd(BaseModel):
    answers: List[AnswerItem]
    time_spent_seconds: int


class QuizResultSubmitV2(BaseModel):
    """Extended result submit — use this instead of the legacy QuizResultSubmit."""
    user_id: str
    score: int
    total: int
    time_spent_seconds: Optional[int] = 0
    answers: Optional[List[AnswerItem]] = []
