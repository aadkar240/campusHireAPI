from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    linkedin_id: Optional[str] = None
    github_id: Optional[str] = None
    college_name: Optional[str] = None
    branch: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    linkedin_id: Optional[str]
    github_id: Optional[str]
    college_name: Optional[str]
    branch: Optional[str]
    profile_completed: bool
    profile_completion_percentage: int
    created_at: datetime
    
    class Config:
        from_attributes = True
