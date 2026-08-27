from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
import cloudinary
import cloudinary.uploader
import os
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/upload", tags=["Upload"])

# Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@router.post("/")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # Optional permission check if needed
    # if "manage_notes" not in current_user.get("permissions", []) and "manage_quizzes" not in current_user.get("permissions", []):
    #    raise HTTPException(status_code=403, detail="Not authorized to upload files")

    try:
        # Determine resource type
        # For PDF files, Cloudinary often requires resource_type="raw" or "auto"
        resource_type = "auto"
        if file.filename.endswith(".pdf"):
            resource_type = "image" # Cloudinary handles PDFs as images sometimes for thumbnails, but 'auto' is safest.

        result = cloudinary.uploader.upload(
            file.file,
            resource_type="auto",
            folder="mission_vardi/uploads"
        )
        
        return {
            "status": True, 
            "message": "File uploaded successfully", 
            "data": {
                "fileUrl": result.get("secure_url"),
                "public_id": result.get("public_id")
            }
        }
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file")
