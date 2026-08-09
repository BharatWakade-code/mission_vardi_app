import boto3
import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Configure S3 client
s3 = boto3.client("s3")
DATA_BUCKET = os.getenv("DATA_BUCKET", "mission-vardi-data")

# Configure MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://missionVardi:Sisko%40123@edusaas.mqa2rmf.mongodb.net/")
DB_NAME = os.getenv("DB_NAME", "edusaas")

print(f"Connecting to MongoDB database '{DB_NAME}'...")
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

collections_map = {
    "users": db["users"],
    "quizzes": db["quizzes"],
    "notes": db["notes"],
    "notifications": db["notifications"],
    "results": db["results"]
}

def migrate_collection(s3_prefix, mongo_collection):
    print(f"\n--- Migrating S3 '{s3_prefix}' prefix to MongoDB collection '{mongo_collection.name}' ---")
    try:
        response = s3.list_objects_v2(Bucket=DATA_BUCKET, Prefix=s3_prefix)
        if 'Contents' not in response:
            print(f"No documents found in S3 bucket '{DATA_BUCKET}' under prefix '{s3_prefix}'.")
            return
        
        count = 0
        for obj in response['Contents']:
            key = obj['Key']
            # Only process JSON files
            if not key.endswith('.json'):
                continue
                
            try:
                res = s3.get_object(Bucket=DATA_BUCKET, Key=key)
                doc = json.loads(res["Body"].read())
                
                # Identify identifier field (e.g. 'id')
                doc_id = doc.get("id")
                if not doc_id:
                    # Fallback to key-based parsing
                    doc_id = key.split("/")[-1].replace(".json", "")
                    doc["id"] = doc_id
                
                # For results, S3 path is: results/{quiz_id}/{user_id}.json
                if s3_prefix.startswith("results"):
                    parts = key.split("/")
                    if len(parts) >= 3:
                        quiz_id = parts[1]
                        user_id = parts[2].replace(".json", "")
                        doc["quiz_id"] = quiz_id
                        doc["user_id"] = user_id
                        doc["id"] = f"{quiz_id}_{user_id}"
                        doc_id = doc["id"]
                
                # Upsert into MongoDB (ensures no duplicates on re-runs)
                mongo_collection.update_one(
                    {"id": doc_id},
                    {"$set": doc},
                    upsert=True
                )
                count += 1
            except Exception as e:
                print(f"ERROR: Failed to migrate document '{key}': {e}")
                
        print(f"Successfully migrated {count} documents to collection '{mongo_collection.name}'.")
    except Exception as e:
        print(f"ERROR: Failed during migration of prefix '{s3_prefix}': {e}")

def main():
    print("Starting EduSaaS S3-to-MongoDB data migration...")
    
    # Migrate standard collections
    migrate_collection("users/", collections_map["users"])
    migrate_collection("quizzes/", collections_map["quizzes"])
    migrate_collection("notes/", collections_map["notes"])
    migrate_collection("notifications/", collections_map["notifications"])
    
    # Migrate results
    migrate_collection("results/", collections_map["results"])
    
    print("\nData migration script executed completely!")

if __name__ == "__main__":
    main()
