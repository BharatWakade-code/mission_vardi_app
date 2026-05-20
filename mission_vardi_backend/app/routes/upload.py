from fastapi import APIRouter
import boto3
from uuid import uuid4

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

s3 = boto3.client("s3")

MEDIA_BUCKET = "mission-vardi-media"

@router.get("/url")
async def get_upload_url():

    file_name = f"profile/{uuid4()}.jpg"

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": MEDIA_BUCKET,
            "Key": file_name,
            "ContentType": "image/jpeg"
        },
        ExpiresIn=300
    )

    file_url = (
        f"https://{MEDIA_BUCKET}.s3.amazonaws.com/"
        f"{file_name}"
    )

    return {
        "status": True,
        "message": "URL generated successfully",
        "data": {
            "uploadUrl": upload_url,
            "fileUrl": file_url
        }
    }
