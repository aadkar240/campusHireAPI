from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Experience, Bookmark, User
from app.api.dependencies import get_current_user
from app.schemas.experience import (
    ExperienceCreateRequest,
    ExperienceUpdateRequest,
    ExperienceResponse
)

router = APIRouter()


@router.post("/", response_model=ExperienceResponse)
async def create_experience(
    request: ExperienceCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview experience"""
    experience = Experience(
        user_id=current_user.id,
        **request.dict()
    )
    db.add(experience)
    db.commit()
    db.refresh(experience)
    
    # Use model_validate for Pydantic v2
    response = ExperienceResponse.model_validate(experience, from_attributes=True)
    if not experience.is_anonymous:
        response.user_name = current_user.full_name
    
    return response


@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(
    company_name: Optional[str] = None,
    role: Optional[str] = None,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all experiences with optional filters"""
    try:
        query = db.query(Experience)
        
        if published_only:
            query = query.filter(Experience.is_published == True)
        
        if company_name:
            query = query.filter(Experience.company_name.ilike(f"%{company_name}%"))
        
        if role:
            query = query.filter(Experience.role.ilike(f"%{role}%"))
        
        experiences = query.order_by(Experience.created_at.desc()).all()
        
        # Return empty list if no experiences
        if not experiences:
            return []
        
        # Use model_validate for Pydantic v2
        results = []
        for exp in experiences:
            try:
                response = ExperienceResponse.model_validate(exp, from_attributes=True)
                
                if not exp.is_anonymous and exp.user_id:
                    user = db.query(User).filter(User.id == exp.user_id).first()
                    if user:
                        response.user_name = user.full_name
                
                results.append(response)
            except Exception as e:
                print(f"Error processing experience {exp.id if exp else 'unknown'}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        return results
    except Exception as e:
        print(f"Error in get_experiences: {e}")
        import traceback
        traceback.print_exc()
        return []


@router.get("/my-experiences", response_model=List[ExperienceResponse])
async def get_my_experiences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's experiences"""
    experiences = db.query(Experience).filter(
        Experience.user_id == current_user.id
    ).order_by(Experience.created_at.desc()).all()
    
    return [ExperienceResponse.model_validate(exp, from_attributes=True) for exp in experiences]


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(
    experience_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific experience"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    # Use model_validate for Pydantic v2
    response = ExperienceResponse.model_validate(experience, from_attributes=True)
    if not experience.is_anonymous and experience.user_id:
        user = db.query(User).filter(User.id == experience.user_id).first()
        if user:
            response.user_name = user.full_name
    
    return response


@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    request: ExperienceUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an experience (only if not approved)"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    if experience.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this experience"
        )
    
    if experience.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update approved experience"
        )
    
    update_data = request.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(experience, field, value)
    
    db.commit()
    db.refresh(experience)
    
    return ExperienceResponse.model_validate(experience)


@router.post("/{experience_id}/bookmark", response_model=dict)
async def bookmark_experience(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark an experience"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    # Check if already bookmarked
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.experience_id == experience_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already bookmarked"
        )
    
    bookmark = Bookmark(
        user_id=current_user.id,
        experience_id=experience_id
    )
    db.add(bookmark)
    db.commit()
    
    return {"message": "Experience bookmarked successfully"}


@router.delete("/{experience_id}/bookmark", response_model=dict)
async def remove_bookmark(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove bookmark from an experience"""
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.experience_id == experience_id
    ).first()
    
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    
    db.delete(bookmark)
    db.commit()
    
    return {"message": "Bookmark removed successfully"}


@router.get("/bookmarks/all", response_model=List[ExperienceResponse])
async def get_bookmarked_experiences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookmarked experiences"""
    bookmarks = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id
    ).all()
    
    experience_ids = [b.experience_id for b in bookmarks]
    experiences = db.query(Experience).filter(
        Experience.id.in_(experience_ids)
    ).all()
    
    results = []
    for exp in experiences:
        response = ExperienceResponse.model_validate(exp, from_attributes=True)
        if not exp.is_anonymous and exp.user_id:
            user = db.query(User).filter(User.id == exp.user_id).first()
            if user:
                response.user_name = user.full_name
        results.append(response)
    
    return results
