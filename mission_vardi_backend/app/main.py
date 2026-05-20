from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.routes.user import router as user_router
from app.routes.upload import router as upload_router
from app.routes.quiz import router as quiz_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.notification import router as notification_router
from app.routes.note import router as note_router

app = FastAPI(
    title="Mission Vardi API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(upload_router)
app.include_router(quiz_router)
app.include_router(leaderboard_router)
app.include_router(notification_router)
app.include_router(note_router)

@app.get("/")
async def root():
    return {"message": "Mission Vardi API Running"}

handler = Mangum(app)
