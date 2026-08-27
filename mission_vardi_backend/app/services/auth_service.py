import json
import os
from datetime import datetime, timedelta

import bcrypt
import requests
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from jose.exceptions import JWTError as JoseJWTError

from app.services.mongodb_service import users_collection


def _resolve_firebase_project_id() -> str:
    """
    Return the Firebase project ID.
    Priority:
      1. FIREBASE_PROJECT_ID env var (set in .env or server environment)
      2. project_id field inside FIREBASE_CREDENTIALS_PATH (service account JSON)
    Returns an empty string if neither source provides a value.
    """
    project_id = os.getenv("FIREBASE_PROJECT_ID", "").strip()
    if project_id:
        return project_id

    # Fallback: read from the service account JSON file
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase_service_account.json").strip()
    # Resolve relative to the backend root (two levels up from this file)
    if not os.path.isabs(cred_path):
        backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
        cred_path = os.path.join(backend_root, cred_path.lstrip("./"))

    try:
        with open(cred_path, "r") as f:
            sa = json.load(f)
        project_id = sa.get("project_id", "").strip()
        if project_id:
            print(f"[auth_service] FIREBASE_PROJECT_ID resolved from service account JSON: {project_id}")
        return project_id
    except Exception as e:
        print(f"[auth_service] Could not read Firebase project_id from {cred_path}: {e}")
        return ""

# ─── Google public certs URL (Firebase tokens are standard RS256 JWTs) ─────────
_GOOGLE_CERTS_URL = (
    "https://www.googleapis.com/robot/v1/metadata/x509/"
    "securetoken@system.gserviceaccount.com"
)

# ─── Config ───────────────────────────────────────────────────────────────────
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION_USE_STRONG_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "10080"))  # 7 days

# ─── Password hashing (direct bcrypt — compatible with Python 3.13) ───────────
security = HTTPBearer()


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ─── JWT ──────────────────────────────────────────────────────────────────────
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ─── FastAPI Dependency ────────────────────────────────────────────────────────
async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    """Inject as a FastAPI dependency to protect any endpoint."""
    payload = verify_access_token(creds.credentials)
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = users_collection.find_one(
        {"id": user_id}, {"_id": 0, "hashed_password": 0}
    )
    if not user:
        from app.services.mongodb_service import admins_collection
        user = admins_collection.find_one(
            {"id": user_id}, {"_id": 0, "hashed_password": 0}
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    # Inject permissions from payload if available and missing in db
    if "permissions" in payload and "permissions" not in user:
        user["permissions"] = payload["permissions"]
        
    return user


# ─── Firebase / Google ────────────────────────────────────────────────────────
def verify_google_token(id_token: str) -> dict:
    """
    Verify a Firebase ID token WITHOUT firebase-admin or any Google credentials.

    Firebase ID tokens are standard RS256 JWTs signed by Google.
    We verify them by:
      1. Reading the key-id (kid) from the JWT header.
      2. Fetching Google's public X.509 certificates (public endpoint, no auth).
      3. Verifying the RS256 signature + claims with python-jose.

    Returns a dict with at least: uid, email, name, picture.
    """
    project_id = _resolve_firebase_project_id()
    if not project_id:
        raise HTTPException(
            status_code=500,
            detail="Server misconfiguration: FIREBASE_PROJECT_ID is not set and could not be resolved from the service account file.",
        )

    try:
        # Step 1 — peek at the header to get the signing key-id
        header = jwt.get_unverified_header(id_token)
        kid = header.get("kid")
        if not kid:
            raise ValueError("Firebase token has no 'kid' in header")

        # Step 2 — fetch Google's public certs (cached by Google via HTTP headers)
        resp = requests.get(_GOOGLE_CERTS_URL, timeout=10)
        resp.raise_for_status()
        public_certs: dict = resp.json()

        if kid not in public_certs:
            raise ValueError(f"kid '{kid}' not found in Google's public certs")

        # Step 3 — verify signature, audience, issuer, expiry
        decoded = jwt.decode(
            id_token,
            public_certs[kid],          # X.509 PEM certificate as the key
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}",
        )

        # Normalise: firebase-admin returns 'uid'; standard JWT uses 'sub'
        decoded.setdefault("uid", decoded.get("sub", ""))
        return decoded

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[Firebase] Token verification failed: {exc}")
        raise HTTPException(
            status_code=401,
            detail=f"Invalid Google/Firebase token: {exc}",
        )
