from datetime import datetime
from uuid import uuid4
from typing import Optional
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException

from app.models.auth_model import EmailLogin, EmailRegister, ForgotPasswordRequest, GoogleLoginRequest, AdminLoginRequest
from app.services.auth_service import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_google_token,
    verify_password,
)
from app.services.mongodb_service import users_collection

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _safe_user(user: dict) -> dict:
    """Strip internal / sensitive fields before returning to client."""
    user = dict(user)
    user.pop("_id", None)
    user.pop("hashed_password", None)
    return user


# ─── Email / Password ─────────────────────────────────────────────────────────
@router.post("/register", summary="Register with email & password")
async def register(data: EmailRegister):
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    user_id = str(uuid4())
    user_doc = {
        "id": user_id,
        "name": data.name,
        "first_name": data.first_name or "",
        "last_name": data.last_name or "",
        "email": data.email,
        "hashed_password": hash_password(data.password),
        "mobile": data.mobile or data.phone or "",
        "auth_provider": "email",
        "google_id": None,
        "avatar_url": None,
        "bio": None,
        "target_exam": None,        # e.g. "police_bharti" | "psi" | "sti"
        "study_goal_minutes": 30,
        "is_verified": False,
        "createdAt": str(datetime.now()),
    }

    users_collection.insert_one(user_doc)
    token = create_access_token({"user_id": user_id, "email": data.email})

    return {
        "status": True,
        "message": "Registration successful",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": _safe_user(user_doc),
        },
    }


@router.post("/login", summary="Login with email & password")
async def login(data: EmailLogin):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    hashed = user.get("hashed_password")
    if not hashed or not verify_password(data.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": user["id"], "email": user["email"]})

    return {
        "status": True,
        "message": "Login successful",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": _safe_user(user),
        },
    }

@router.post("/admin-login", summary="Admin Login")
async def admin_login(data: AdminLoginRequest):
    from app.services.mongodb_service import admins_collection
    from app.services.auth_service import verify_password
    
    admin = admins_collection.find_one({"username": data.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
    hashed = admin.get("hashed_password")
    if not hashed or not verify_password(data.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = create_access_token({
        "user_id": admin["id"],
        "username": admin["username"],
        "role": admin.get("role", "admin"),
        "permissions": admin.get("permissions", [])
    })
    
    return {
        "status": True,
        "message": "Admin login successful",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "role": admin.get("role", "admin"),
            "permissions": admin.get("permissions", [])
        }
    }


# ─── Google / Firebase Social Login ──────────────────────────────────────────
@router.post("/google", summary="Login or register via Google (Firebase ID token)")
async def google_login(data: GoogleLoginRequest):
    """
    Flutter sends the Firebase ID token after Google Sign-In.
    Backend verifies it, then creates a new account or returns existing one.
    Same email → accounts are merged automatically.
    """
    decoded = verify_google_token(data.id_token)

    google_id = decoded["uid"]
    email = decoded.get("email", "")
    name = decoded.get("name", "")
    avatar_url = decoded.get("picture")

    # Try matching by google_id first, then fall back to email (merge)
    query = {"$or": [{"google_id": google_id}]}
    if email:
        query["$or"].append({"email": email})

    user = users_collection.find_one(query)

    if user:
        # Patch missing fields on existing user
        patch = {}
        if not user.get("google_id"):
            patch["google_id"] = google_id
        if not user.get("avatar_url") and avatar_url:
            patch["avatar_url"] = avatar_url
        if patch:
            users_collection.update_one({"id": user["id"]}, {"$set": patch})
            user.update(patch)
    else:
        user_id = str(uuid4())
        user = {
            "id": user_id,
            "name": name,
            "email": email,
            "hashed_password": None,
            "mobile": "",
            "auth_provider": "google",
            "google_id": google_id,
            "avatar_url": avatar_url,
            "bio": None,
            "target_exam": None,
            "study_goal_minutes": 30,
            "is_verified": True,
            "createdAt": str(datetime.now()),
        }
        users_collection.insert_one(user)

    token = create_access_token({"user_id": user["id"], "email": email})

    return {
        "status": True,
        "message": "Google login successful",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": _safe_user(user),
        },
    }


# ─── Protected ────────────────────────────────────────────────────────────────
@router.get("/me", summary="Get currently authenticated user")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "status": True,
        "message": "Current user fetched",
        "data": current_user,
    }


# ─── Forgot Password ──────────────────────────────────────────────────────────
@router.post("/forgot-password", summary="Request a password reset email")
async def forgot_password(data: ForgotPasswordRequest):
    """
    Checks if the email exists in the DB.
    In production, send a password-reset email here.
    Returns a generic success message to avoid user enumeration.
    """
    user = users_collection.find_one({"email": data.email})
    if not user:
        # Generic message to avoid revealing whether email is registered
        return {
            "status": True,
            "message": "If that email is registered, a reset link has been sent.",
            "data": None,
        }

    # TODO: integrate an email service (SendGrid, SMTP, etc.) to send a reset link
    # For now we return a success response
    return {
        "status": True,
        "message": "Password reset link sent to your email. Please check your inbox.",
        "data": None,
    }

class UserUpdate(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    district: Optional[str] = None
    target_exam: Optional[str] = None

@router.put("/me", summary="Update current user profile")
async def update_me(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {}
    if data.name is not None: update_data["name"] = data.name
    if data.mobile is not None: update_data["mobile"] = data.mobile
    if data.district is not None: update_data["district"] = data.district
    if data.target_exam is not None: update_data["target_exam"] = data.target_exam

    if update_data:
        users_collection.update_one({"id": current_user["id"]}, {"$set": update_data})
        current_user.update(update_data)

    return {
        "status": True,
        "message": "Profile updated successfully",
        "data": _safe_user(current_user),
    }
