from fastapi import APIRouter
from app.services.s3_service import list_documents, get_document

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)

@router.get("/{quiz_id}")
async def get_leaderboard(quiz_id: str, limit: int = 10):
    # Fetch all results for this quiz
    results = list_documents(f"results/{quiz_id}/")
    
    # Sort results by score in descending order
    sorted_results = sorted(results, key=lambda x: x.get("score", 0), reverse=True)
    
    # Optionally, we could fetch user names here if needed
    leaderboard = []
    for r in sorted_results[:limit]:
        user_id = r.get("user_id")
        user_doc = get_document("users", user_id)
        
        user_name = user_doc.get("name", "Unknown User") if user_doc else "Unknown User"
        
        leaderboard.append({
            "user_id": user_id,
            "name": user_name,
            "score": r.get("score"),
            "total": r.get("total"),
            "submittedAt": r.get("submittedAt")
        })
        
    return {
        "status": True,
        "message": "Data fetched successfully",
        "data": leaderboard
    }
