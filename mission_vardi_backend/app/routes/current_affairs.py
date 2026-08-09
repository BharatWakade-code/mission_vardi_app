from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from typing import Optional, List
from uuid import uuid4
from datetime import datetime
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import json
import re

from app.models.current_affairs_model import CurrentAffairsCreate
from app.services.mongodb_service import current_affairs_collection

router = APIRouter(
    prefix="/current_affairs",
    tags=["Current Affairs"]
)

# Helper function to dynamically translate text from English to Marathi
def translate_text(text: str) -> str:
    try:
        # Clean text for URL encoding
        cleaned_text = re.sub(r'[^\w\s\d.,!?-]', '', text).strip()
        if not cleaned_text:
            return text
            
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(cleaned_text)}&langpair=en|mr"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            translated = res_data.get("responseData", {}).get("translatedText", "")
            if translated and "MYMEMORY WARNING" not in translated:
                return translated
    except Exception as e:
        print(f"Translation failed for '{text}': {e}")
    return text

# Helper to categorize articles based on keywords
def detect_category(title: str, description: str) -> str:
    combined = (title + " " + description).lower()
    if any(k in combined for k in ["maharashtra", "mumbai", "pune", "nagpur", "nashik", "thane"]):
        return "Maharashtra"
    elif any(k in combined for k in ["defense", "army", "navy", "air force", "drdo", "ins ", "missile", "military", "warship"]):
        return "Defense"
    elif any(k in combined for k in ["sports", "cricket", "olympics", "gold medal", "athletics", "championship", "cup", "tennis"]):
        return "Sports"
    elif any(k in combined for k in ["award", "prize", "phalke", "bharat ratna", "nobel", "padma"]):
        return "Awards"
    return "National"

@router.post("")
async def create_current_affair(item: CurrentAffairsCreate):
    """
    Allows manual creation of a news article card from the dashboard/admin panel.
    """
    item_id = str(uuid4())
    published_date = item.publishedDate or datetime.now().strftime("%B %d, %Y")
    
    data = {
        "id": item_id,
        "title_en": item.title_en,
        "title_mr": item.title_mr,
        "description_en": item.description_en,
        "description_mr": item.description_mr,
        "content_en": item.content_en,
        "content_mr": item.content_mr,
        "category": item.category,
        "imageUrl": item.imageUrl or "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop",
        "pdfUrl": item.pdfUrl,
        "publishedDate": published_date,
        "isTrending": item.isTrending,
        "createdAt": str(datetime.now())
    }
    
    current_affairs_collection.insert_one(data)
    data.pop("_id", None)
    return {
        "status": True,
        "message": "Current affairs article created successfully",
        "data": data
    }

@router.get("")
async def list_current_affairs(
    background_tasks: BackgroundTasks,
    category: Optional[str] = None, 
    search: Optional[str] = None,
    trending: Optional[bool] = None
):
    query = {}
    if category and category.lower() != "all":
        query["category"] = category
    if trending is not None:
        query["isTrending"] = trending
    if search:
        query["$or"] = [
            {"title_en": {"$regex": search, "$options": "i"}},
            {"title_mr": {"$regex": search, "$options": "i"}},
            {"description_en": {"$regex": search, "$options": "i"}},
            {"description_mr": {"$regex": search, "$options": "i"}}
        ]
        
    items = list(
        current_affairs_collection.find(query, {"_id": 0})
        .sort("createdAt", -1)
    )
    
    # 🔄 Smart Auto-Sync: Automatically sync in the background if the newest article is older than 6 hours
    should_sync = False
    if not items and not search and not category:
        should_sync = True
    else:
        newest = current_affairs_collection.find_one({}, sort=[("createdAt", -1)])
        if newest:
            try:
                created_str = newest.get("createdAt", "")
                created_dt = datetime.strptime(created_str.split(".")[0], "%Y-%m-%d %H:%M:%S")
                diff_hours = (datetime.now() - created_dt).total_seconds() / 3600.0
                if diff_hours > 6.0:  # Freshness threshold: 6 hours
                    should_sync = True
            except:
                should_sync = True
        else:
            should_sync = True
            
    if should_sync and not search:
        background_tasks.add_task(sync_live_current_affairs)
        
    return {
        "status": True,
        "message": "Current affairs fetched successfully",
        "data": items
    }

@router.post("/sync")
async def sync_live_current_affairs():
    """
    Dynamically sync live, highly accurate Current Affairs articles from the official NewsAPI.org
    using the everything search query for 'India current affairs', translates them in real-time to Marathi,
    and structures key educational bullet cards for final dashboard listings.
    """
    try:
        # Fetching dynamic top national news from official NewsAPI as requested
        api_url = "https://newsapi.org/v2/everything?q=India+current+affairs&sortBy=publishedAt&apiKey=ccf41b9f88534729937a8186b0d7ce1e"
        
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            
        if res_data.get("status") != "ok":
            raise Exception(f"NewsAPI returned status={res_data.get('status')}")
            
        articles = res_data.get("articles", [])
        
        synced_articles = []
        
        # Sync a rich list of up to 25 fresh, high-quality news cards
        for item in articles[:25]:
            title_en = (item.get("title") or "").strip()
            description_en = (item.get("description") or "").strip() or (item.get("content") or "").strip()
            imageUrl = (item.get("urlToImage") or "").strip()
            link = (item.get("url") or "").strip()
            pub_date_raw = (item.get("publishedAt") or "").strip()
            
            if not title_en or not description_en:
                continue
                
            if "[Removed]" in title_en or "[Removed]" in description_en:
                continue
                
            # Clean headline suffix if present (e.g. " - NDTV", " - Times of India")
            if " - " in title_en:
                title_en = title_en.rsplit(" - ", 1)[0].strip()
                
            # Formatting Date
            if pub_date_raw:
                try:
                    # e.g., "2026-05-26T17:30:00Z"
                    dt = datetime.strptime(pub_date_raw[:19], "%Y-%m-%dT%H:%M:%S")
                    published_date = dt.strftime("%B %d, %Y")
                except:
                    published_date = datetime.now().strftime("%B %d, %Y")
            else:
                published_date = datetime.now().strftime("%B %d, %Y")
                
            # Prevent duplicates by English title
            existing = current_affairs_collection.find_one({"title_en": title_en})
            if existing:
                continue
                
            # Detect category based on the headline & content
            category = detect_category(title_en, description_en)
            
            # If no custom image was returned, use a beautiful fallback category illustration
            if not imageUrl:
                imageUrl = "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop"
                
            # Real-time high accuracy Marathi translations
            title_mr = translate_text(title_en)
            description_mr = translate_text(description_en)
            
            # Format the content using high-fidelity markdown cards for the frontend
            content_en = (
                f"### {title_en}\n\n"
                f"{description_en}\n\n"
                f"#### Core Exam Points:\n"
                f"- **Topic Category**: Curated under {category} national developments.\n"
                f"- **Published Date**: Reported on {published_date}.\n"
                f"- **Reference Sources**: Authorized news channels and official publishers.\n"
                f"- **Revision Advice**: This article serves as high-importance preparation content for General Knowledge sections of Vardi exams."
            )
            
            content_mr = (
                f"### {title_mr}\n\n"
                f"{description_mr}\n\n"
                f"#### मुख्य Exam Examभिमुख मुद्दे:\n"
                f"- **विषय श्रेणी**: {category} राष्ट्रीय घडामोडी अंतर्गत वर्गीकृत.\n"
                f"- **प्रसिद्धी तारीख**: {published_date} रोजी प्रसिद्ध.\n"
                f"- **संदर्भ स्रोत**: अधिकृत वृत्तवाहिन्या आणि सरकारी प्रकाशने.\n"
                f"- **महत्त्वाची टीप**: सामान्य ज्ञान (GK) तयारीसाठी या माहितीचे आवर्जून वाचन आणि सराव करा."
            )
            
            article_data = {
                "id": str(uuid4()),
                "title_en": title_en,
                "title_mr": title_mr,
                "description_en": description_en,
                "description_mr": description_mr,
                "content_en": content_en,
                "content_mr": content_mr,
                "category": category,
                "imageUrl": imageUrl,
                "pdfUrl": link,
                "publishedDate": published_date,
                "isTrending": True,
                "createdAt": str(datetime.now())
            }
            
            current_affairs_collection.insert_one(article_data)
            article_data.pop("_id", None)
            synced_articles.append(article_data)
            
        return {
            "status": True,
            "message": f"Successfully synced {len(synced_articles)} live open-source articles using NewsAPI.org.",
            "data": synced_articles
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live NewsAPI sync failed: {str(e)}")

@router.post("/seed")
async def seed_current_affairs():
    """
    Clears the collection and seeds it directly with real, live news from NewsAPI.org!
    """
    try:
        current_affairs_collection.delete_many({})
        res = await sync_live_current_affairs()
        return {
            "status": True,
            "message": "Successfully seeded database with live NewsAPI.org articles!",
            "data": res.get("data", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live NewsAPI seeding failed: {str(e)}")
