from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.api.dependencies import get_current_user
from app.schemas.user import ProfileUpdateRequest, UserResponse

router = APIRouter()


def calculate_profile_completion(user: User) -> int:
    """Calculate profile completion percentage"""
    fields = [
        user.full_name,
        user.email,
        user.linkedin_id,
        user.github_id,
        user.college_name,
        user.branch
    ]
    completed = sum(1 for field in fields if field)
    return int((completed / len(fields)) * 100)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    update_data = request.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    # Calculate profile completion
    current_user.profile_completion_percentage = calculate_profile_completion(current_user)
    current_user.profile_completed = current_user.profile_completion_percentage == 100
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/profile-completion", response_model=dict)
async def get_profile_completion(
    current_user: User = Depends(get_current_user)
):
    """Get profile completion status"""
    return {
        "percentage": current_user.profile_completion_percentage,
        "completed": current_user.profile_completed,
        "fields": {
            "full_name": bool(current_user.full_name),
            "email": bool(current_user.email),
            "linkedin_id": bool(current_user.linkedin_id),
            "github_id": bool(current_user.github_id),
            "college_name": bool(current_user.college_name),
            "branch": bool(current_user.branch)
        }
    }
