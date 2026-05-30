from dotenv import load_dotenv
load_dotenv()  # ← Must be FIRST — loads .env before any module reads os.getenv()

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import logging

from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.upload import router as upload_router
from app.routes.quiz import router as quiz_router
from app.routes.study import router as study_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.notification import router as notification_router
from app.routes.note import router as note_router
from app.routes.current_affairs import router as current_affairs_router
from app.routes.fitness import router as fitness_router

app = FastAPI(
    title="Mission Vardi API",
    version="2.0.0",
    description="Backend for Mission Vardi — Police Bharti Exam Prep App"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth (register first — no auth required)
app.include_router(auth_router)

# Core
app.include_router(user_router)
app.include_router(quiz_router)
app.include_router(study_router)

from app.routes.alert import router as alert_router
from app.routes.localization import router as localization_router

# Supporting
app.include_router(upload_router)
app.include_router(leaderboard_router)
app.include_router(notification_router)
app.include_router(note_router)
app.include_router(alert_router)
app.include_router(current_affairs_router)
app.include_router(localization_router)
app.include_router(fitness_router)


@app.get("/")
async def root():
    return {"message": "Mission Vardi API v2.0 Running"}

# --- Global Exception Handlers ---

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"status": False, "message": "An unexpected error occurred on the server.", "error": str(exc)}
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": False, "message": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_msgs = [f"{err['loc'][-1]}: {err['msg']}" for err in errors if len(err['loc']) > 0]
    return JSONResponse(
        status_code=422,
        content={
            "status": False, 
            "message": "Validation Error", 
            "details": error_msgs
        }
    )


handler = Mangum(app)
