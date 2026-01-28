from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Experience, Admin, AuditLog, User
from app.schemas.experience import ExperienceResponse
from app.schemas.user import UserResponse
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminAuthResponse(BaseModel):
    message: str
    admin_id: int


class ApprovalRequest(BaseModel):
    experience_id: int
    action: str  # "approve" or "reject"
    reason: str = None


def _truncate_to_72_bytes(text: str) -> str:
    """Truncate string to 72 bytes maximum - CRITICAL for bcrypt compatibility"""
    if not isinstance(text, str):
        text = str(text)
    
    # Convert to bytes to check actual byte length (not character length)
    text_bytes = text.encode('utf-8')
    
    # Truncate if longer than 72 bytes
    if len(text_bytes) > 72:
        text_bytes = text_bytes[:72]
    
    # Decode back to string (may lose some characters if cut mid-UTF8, but safe)
    try:
        return text_bytes.decode('utf-8')
    except UnicodeDecodeError:
        # If we cut in middle of multi-byte character, use error handling
        return text_bytes.decode('utf-8', errors='ignore')


@router.post("/login", response_model=AdminAuthResponse)
async def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    """Admin login (simplified - using admin password from config)"""
    try:
        # For simplicity, we'll use a single admin account
        # In production, use proper admin authentication
        
        # Truncate both passwords to 72 bytes before comparison
        request_password = _truncate_to_72_bytes(request.password)
        admin_password = _truncate_to_72_bytes(settings.ADMIN_PASSWORD)
        
        if request_password != admin_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
        
        # Get or create admin user
        admin = db.query(Admin).filter(Admin.email == request.email).first()
        if not admin:
            # Password is already truncated, safe to hash
            admin = Admin(
                email=request.email,
                hashed_password=get_password_hash(request_password),
                role="super_admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
        
        return AdminAuthResponse(message="Admin authenticated", admin_id=admin.id)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_msg = str(e)
        error_trace = traceback.format_exc()
        print("=" * 50)
        print("ADMIN LOGIN ERROR:")
        print("=" * 50)
        print(f"Error: {error_msg}")
        print(f"Traceback:\n{error_trace}")
        print("=" * 50)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {error_msg}"
        )


@router.get("/experiences/pending", response_model=List[ExperienceResponse])
async def get_pending_experiences(db: Session = Depends(get_db)):
    """Get all pending experiences for approval"""
    experiences = db.query(Experience).filter(
        Experience.is_approved == False
    ).order_by(Experience.created_at.desc()).all()
    
    results = []
    for exp in experiences:
        response = ExperienceResponse.model_validate(exp)
        user = db.query(User).filter(User.id == exp.user_id).first()
        if user:
            response.user_name = user.full_name
        results.append(response)
    
    return results


@router.post("/experiences/approve", response_model=dict)
async def approve_experience(
    request: ApprovalRequest,
    admin_id: int = 1,  # Simplified - in production, get from auth
    db: Session = Depends(get_db)
):
    """Approve or reject an experience"""
    experience = db.query(Experience).filter(Experience.id == request.experience_id).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    if request.action == "approve":
        experience.is_approved = True
        experience.is_published = True
    elif request.action == "reject":
        experience.is_approved = False
        experience.is_published = False
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Use 'approve' or 'reject'"
        )
    
    # Create audit log
    audit_log = AuditLog(
        admin_id=admin_id,
        action=request.action,
        entity_type="experience",
        entity_id=experience.id,
        details={"reason": request.reason}
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": f"Experience {request.action}d successfully"}


@router.get("/experiences/all", response_model=List[ExperienceResponse])
async def get_all_experiences(
    approved_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all experiences (admin view)"""
    query = db.query(Experience)
    
    if approved_only:
        query = query.filter(Experience.is_approved == True)
    
    experiences = query.order_by(Experience.created_at.desc()).all()
    
    results = []
    for exp in experiences:
        response = ExperienceResponse.model_validate(exp)
        user = db.query(User).filter(User.id == exp.user_id).first()
        if user:
            response.user_name = user.full_name
        results.append(response)
    
    return results


@router.get("/audit-logs", response_model=List[dict])
async def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get audit logs"""
    logs = db.query(AuditLog).order_by(
        AuditLog.created_at.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "admin_id": log.admin_id,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "details": log.details,
            "created_at": log.created_at.isoformat()
        }
        for log in logs
    ]


def calculate_profile_eligibility(user: User, db: Session) -> dict:
    """Calculate profile eligibility score and validation"""
    score = 0
    max_score = 100
    issues = []
    strengths = []
    
    # Basic information (30 points)
    if user.full_name and len(user.full_name.strip()) > 0:
        score += 10
        strengths.append("Full name provided")
    else:
        issues.append("Full name is missing")
    
    if user.email:
        score += 10
        strengths.append("Email verified")
    else:
        issues.append("Email not verified")
    
    if user.college_name and len(user.college_name.strip()) > 0:
        score += 10
        strengths.append("College information provided")
    else:
        issues.append("College name missing")
    
    if user.branch and len(user.branch.strip()) > 0:
        score += 5
        strengths.append("Branch information provided")
    else:
        issues.append("Branch information missing")
    
    # Professional profiles (30 points)
    if user.linkedin_id and len(user.linkedin_id.strip()) > 0:
        score += 15
        strengths.append("LinkedIn profile linked")
    else:
        issues.append("LinkedIn profile not linked")
    
    if user.github_id and len(user.github_id.strip()) > 0:
        score += 15
        strengths.append("GitHub profile linked")
    else:
        issues.append("GitHub profile not linked")
    
    # Experience quality (40 points)
    experiences = db.query(Experience).filter(Experience.user_id == user.id).all()
    experience_count = len(experiences)
    
    if experience_count > 0:
        score += min(20, experience_count * 5)  # Up to 20 points for experiences
        strengths.append(f"{experience_count} experience(s) shared")
    else:
        issues.append("No experiences shared yet")
    
    approved_experiences = [e for e in experiences if e.is_approved]
    if len(approved_experiences) > 0:
        score += 10
        strengths.append(f"{len(approved_experiences)} approved experience(s)")
    
    if user.profile_completion_percentage >= 100:
        score += 10
        strengths.append("Profile 100% complete")
    else:
        issues.append(f"Profile only {user.profile_completion_percentage}% complete")
    
    # Calculate percentage
    eligibility_percentage = min(100, int((score / max_score) * 100))
    
    # Determine eligibility status
    if eligibility_percentage >= 80:
        status = "Highly Eligible"
        recommendation = "approve"
    elif eligibility_percentage >= 60:
        status = "Eligible"
        recommendation = "approve"
    elif eligibility_percentage >= 40:
        status = "Needs Improvement"
        recommendation = "review"
    else:
        status = "Not Eligible"
        recommendation = "reject"
    
    return {
        "eligibility_percentage": eligibility_percentage,
        "score": score,
        "max_score": max_score,
        "status": status,
        "recommendation": recommendation,
        "issues": issues,
        "strengths": strengths,
        "experience_count": experience_count,
        "approved_experience_count": len(approved_experiences)
    }


class UserProfileResponse(BaseModel):
    user: UserResponse
    eligibility: dict
    experience_count: int
    
    class Config:
        from_attributes = True


@router.get("/users", response_model=List[UserProfileResponse])
async def get_all_users(
    db: Session = Depends(get_db)
):
    """Get all users with their profiles and eligibility scores"""
    users = db.query(User).filter(User.is_active == True).order_by(User.created_at.desc()).all()
    
    results = []
    for user in users:
        eligibility = calculate_profile_eligibility(user, db)
        experience_count = db.query(Experience).filter(Experience.user_id == user.id).count()
        
        results.append({
            "user": user,
            "eligibility": eligibility,
            "experience_count": experience_count
        })
    
    return results


@router.get("/users/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific user's profile with eligibility score"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    eligibility = calculate_profile_eligibility(user, db)
    experience_count = db.query(Experience).filter(Experience.user_id == user.id).count()
    
    return {
        "user": user,
        "eligibility": eligibility,
        "experience_count": experience_count
    }


class ProfileApprovalRequest(BaseModel):
    user_id: int
    action: str  # "approve" or "reject"
    reason: Optional[str] = None


@router.post("/users/approve", response_model=dict)
async def approve_user_profile(
    request: ProfileApprovalRequest,
    admin_id: int = 1,  # Simplified - in production, get from auth
    db: Session = Depends(get_db)
):
    """Approve or reject a user profile"""
    user = db.query(User).filter(User.id == request.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if request.action == "approve":
        user.is_verified = True
        user.is_active = True
        message = "User profile approved"
    elif request.action == "reject":
        user.is_verified = False
        user.is_active = False
        message = "User profile rejected"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Use 'approve' or 'reject'"
        )
    
    # Create audit log
    audit_log = AuditLog(
        admin_id=admin_id,
        action=request.action,
        entity_type="user",
        entity_id=user.id,
        details={"reason": request.reason, "eligibility": calculate_profile_eligibility(user, db)}
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": message}
