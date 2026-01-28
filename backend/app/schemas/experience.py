from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class InterviewRound(BaseModel):
    round_name: str
    round_type: str  # "Technical", "HR", "Managerial", "DSA"
    questions: List[str]
    difficulty: Optional[str] = None


class ExperienceCreateRequest(BaseModel):
    company_name: str
    role: str
    package_offered: Optional[float] = None
    interview_rounds: Optional[List[Dict[str, Any]]] = None
    questions_asked: Optional[Dict[str, List[str]]] = None
    preparation_strategy: Optional[str] = None
    resources_followed: Optional[List[str]] = None
    rejection_reasons: Optional[str] = None
    final_result: str  # "Selected" or "Rejected"
    is_anonymous: bool = False


class ExperienceUpdateRequest(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    package_offered: Optional[float] = None
    interview_rounds: Optional[List[Dict[str, Any]]] = None
    questions_asked: Optional[Dict[str, List[str]]] = None
    preparation_strategy: Optional[str] = None
    resources_followed: Optional[List[str]] = None
    rejection_reasons: Optional[str] = None
    final_result: Optional[str] = None
    is_anonymous: Optional[bool] = None


class ExperienceResponse(BaseModel):
    id: int
    company_name: str
    role: str
    package_offered: Optional[float]
    interview_rounds: Optional[List[Dict[str, Any]]]
    questions_asked: Optional[Dict[str, List[str]]]
    preparation_strategy: Optional[str]
    resources_followed: Optional[List[str]]
    rejection_reasons: Optional[str]
    final_result: str
    is_anonymous: bool
    is_approved: bool
    is_published: bool
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
