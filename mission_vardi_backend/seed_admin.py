import os
from uuid import uuid4
from datetime import datetime
from app.services.mongodb_service import admins_collection
from app.services.auth_service import hash_password
from dotenv import load_dotenv

load_dotenv()

def seed_admin():
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "password123")
    
    existing = admins_collection.find_one({"username": admin_username})
    if existing:
        print(f"Admin '{admin_username}' already exists in DB.")
        # Ensure super_admin role and permissions
        admins_collection.update_one(
            {"username": admin_username},
            {"$set": {
                "role": "super_admin",
                "permissions": ["manage_quizzes", "manage_notes", "manage_pyqs", "manage_categories", "manage_users", "manage_bulk", "manage_settings"]
            }}
        )
        print("Updated permissions to super_admin.")
        return

    admin_doc = {
        "id": str(uuid4()),
        "username": admin_username,
        "hashed_password": hash_password(admin_password),
        "role": "super_admin",
        "permissions": ["manage_quizzes", "manage_notes", "manage_pyqs", "manage_categories", "manage_users", "manage_bulk", "manage_settings"],
        "createdAt": str(datetime.now())
    }
    
    admins_collection.insert_one(admin_doc)
    print(f"Created super_admin '{admin_username}' in database!")

if __name__ == "__main__":
    seed_admin()
