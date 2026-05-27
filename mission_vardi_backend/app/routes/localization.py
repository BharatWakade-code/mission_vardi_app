import os
import json
import boto3
from fastapi import APIRouter, Query, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from botocore.exceptions import NoCredentialsError, ClientError

router = APIRouter(
    prefix="/localization",
    tags=["Localization"]
)

s3 = boto3.client("s3")
TRANSLATIONS_BUCKET = os.getenv("TRANSLATIONS_BUCKET", "mission-vardi-data")

# Local translations folder fallback inside app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_TRANSLATIONS_DIR = os.path.join(BASE_DIR, "translations")

def ensure_local_dir():
    """Ensure local translations directory exists."""
    os.makedirs(LOCAL_TRANSLATIONS_DIR, exist_ok=True)

@router.post("/upload")
async def upload_localization(
    lang: str = Query(..., description="Language code, e.g. 'en', 'mr'"),
    file: UploadFile = File(..., description="Localization JSON file")
):
    """
    Upload a localization JSON file for a specific language.
    The file is validated for correct JSON structure, then uploaded to S3
    as `translations_{lang}.json` and saved locally as a fallback.
    """
    lang = lang.strip().lower()
    if not lang:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language code parameter 'lang' is required and cannot be empty."
        )

    # Validate file extension
    filename = file.filename or ""
    if not filename.endswith(".json"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JSON files (.json) are allowed."
        )

    # Read and validate JSON content
    try:
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8")
        json_data = json.loads(content_str)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON content: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file: {str(e)}"
        )

    # S3 Key naming convention matching EasyLocalization loader expectation
    s3_key = f"translations_{lang}.json"
    s3_url = f"https://{TRANSLATIONS_BUCKET}.s3.amazonaws.com/{s3_key}"

    s3_upload_success = False
    s3_error_msg = ""

    # Attempt to upload to S3
    try:
        s3.put_object(
            Bucket=TRANSLATIONS_BUCKET,
            Key=s3_key,
            Body=json.dumps(json_data, ensure_ascii=False, indent=2),
            ContentType="application/json"
        )
        s3_upload_success = True
    except NoCredentialsError:
        s3_error_msg = "AWS credentials not found. Uploaded locally only."
    except ClientError as e:
        s3_error_msg = f"S3 Client Error: {str(e)}. Uploaded locally only."
    except Exception as e:
        s3_error_msg = f"Failed to upload to S3: {str(e)}. Uploaded locally only."

    # Save locally as a fallback/cache
    try:
        ensure_local_dir()
        local_path = os.path.join(LOCAL_TRANSLATIONS_DIR, f"{lang}.json")
        with open(local_path, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        # If both S3 and local write fail, raise error
        if not s3_upload_success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed both S3 upload ({s3_error_msg}) and local cache write: {str(e)}"
            )

    return {
        "status": True,
        "message": "Localization file processed successfully",
        "data": {
            "language": lang,
            "s3_uploaded": s3_upload_success,
            "s3_url": s3_url if s3_upload_success else None,
            "s3_warning": s3_error_msg if not s3_upload_success else None,
            "local_cached": True,
            "keys_count": len(json_data)
        }
    }

@router.post("/upload-languages")
async def upload_languages_metadata(
    file: UploadFile = File(..., description="languages.json metadata file")
):
    """
    Upload the overall languages metadata JSON file (`languages.json`).
    This describes the supported languages and their configuration.
    """
    filename = file.filename or ""
    if not filename.endswith(".json"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JSON files (.json) are allowed."
        )

    # Read and validate JSON content
    try:
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8")
        json_data = json.loads(content_str)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON content: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file: {str(e)}"
        )

    s3_key = "languages.json"
    s3_url = f"https://{TRANSLATIONS_BUCKET}.s3.amazonaws.com/{s3_key}"

    s3_upload_success = False
    s3_error_msg = ""

    # Attempt to upload to S3
    try:
        s3.put_object(
            Bucket=TRANSLATIONS_BUCKET,
            Key=s3_key,
            Body=json.dumps(json_data, ensure_ascii=False, indent=2),
            ContentType="application/json"
        )
        s3_upload_success = True
    except NoCredentialsError:
        s3_error_msg = "AWS credentials not found. Uploaded locally only."
    except ClientError as e:
        s3_error_msg = f"S3 Client Error: {str(e)}. Uploaded locally only."
    except Exception as e:
        s3_error_msg = f"Failed to upload to S3: {str(e)}. Uploaded locally only."

    # Save locally as a fallback
    try:
        ensure_local_dir()
        local_path = os.path.join(LOCAL_TRANSLATIONS_DIR, "languages.json")
        with open(local_path, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        if not s3_upload_success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed both S3 upload ({s3_error_msg}) and local cache write: {str(e)}"
            )

    return {
        "status": True,
        "message": "Languages metadata file processed successfully",
        "data": {
            "s3_uploaded": s3_upload_success,
            "s3_url": s3_url if s3_upload_success else None,
            "s3_warning": s3_error_msg if not s3_upload_success else None,
            "local_cached": True
        }
    }

@router.get("")
async def get_localization(
    lang: str = Query(..., description="Language code, e.g. 'en', 'mr'")
):
    """
    Fetch localization JSON keys and values.
    Attempts to read translations_{lang}.json from S3 first.
    If S3 fails or is not found, falls back to the local {lang}.json file.
    """
    lang = lang.strip().lower()
    s3_key = f"translations_{lang}.json"

    # 1. Try S3
    try:
        response = s3.get_object(Bucket=TRANSLATIONS_BUCKET, Key=s3_key)
        content = response["Body"].read().decode("utf-8")
        data = json.loads(content)
        return {
            "status": True,
            "source": "s3",
            "data": data
        }
    except Exception as s3_err:
        # 2. S3 failed/not found, try local fallback
        local_path = os.path.join(LOCAL_TRANSLATIONS_DIR, f"{lang}.json")
        if os.path.exists(local_path):
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                return {
                    "status": True,
                    "source": "local_fallback",
                    "warning": f"S3 fetch failed ({str(s3_err)}). Served from local fallback.",
                    "data": data
                }
            except Exception as local_err:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"S3 fetch failed ({str(s3_err)}) and local fallback is corrupted: {str(local_err)}"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Localization for language '{lang}' not found in S3 or local fallback."
            )

@router.get("/languages")
async def get_languages():
    """
    Fetch all supported languages metadata.
    Attempts to read languages.json from S3 first.
    If S3 fails or is not found, falls back to local languages.json or default configuration.
    """
    s3_key = "languages.json"

    # 1. Try S3
    try:
        response = s3.get_object(Bucket=TRANSLATIONS_BUCKET, Key=s3_key)
        content = response["Body"].read().decode("utf-8")
        data = json.loads(content)
        return {
            "status": True,
            "source": "s3",
            "data": data
        }
    except Exception as s3_err:
        # 2. Try local languages.json
        local_path = os.path.join(LOCAL_TRANSLATIONS_DIR, "languages.json")
        if os.path.exists(local_path):
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                return {
                    "status": True,
                    "source": "local_fallback",
                    "warning": f"S3 fetch failed ({str(s3_err)}). Served from local fallback.",
                    "data": data
                }
            except Exception as local_err:
                pass

        # 3. Default fallback if both fail
        default_languages = [
            {"code": "en", "name": "English", "is_default": True},
            {"code": "mr", "name": "Marathi", "is_default": False}
        ]
        return {
            "status": True,
            "source": "hardcoded_fallback",
            "warning": f"S3 fetch failed ({str(s3_err)}) and local file is missing. Served hardcoded fallback.",
            "data": default_languages
        }
