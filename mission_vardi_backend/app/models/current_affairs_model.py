from pydantic import BaseModel
from typing import Optional, List

class CurrentAffairsCreate(BaseModel):
    title_en: str
    title_mr: str
    description_en: str
    description_mr: str
    content_en: str
    content_mr: str
    category: str  # e.g., 'National', 'Maharashtra', 'Sports', 'Defense', 'Awards'
    imageUrl: Optional[str] = None
    pdfUrl: Optional[str] = None
    publishedDate: Optional[str] = None
    isTrending: Optional[bool] = False
    
    # Dynamic practice quiz fields for student recall
    quizQEn: Optional[str] = None
    quizQMr: Optional[str] = None
    quizOptionsEn: Optional[List[str]] = None
    quizOptionsMr: Optional[List[str]] = None
    quizCorrect: Optional[int] = None
    quizExpEn: Optional[str] = None
    quizExpMr: Optional[str] = None

