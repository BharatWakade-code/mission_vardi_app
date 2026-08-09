from pydantic import BaseModel, EmailStr
from typing import Optional


class EmailRegister(BaseModel):
    name: str
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile: Optional[str] = None
    phone: Optional[str] = None   # alias for mobile from Flutter


class EmailLogin(BaseModel):
    email: str
    password: str

class AdminLoginRequest(BaseModel):
    username: str
    password: str


class GoogleLoginRequest(BaseModel):
    """Firebase ID token obtained from flutter firebase_auth Google Sign-In."""
    id_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ForgotPasswordRequest(BaseModel):
    email: str
