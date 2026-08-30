import json
import os
from app.services.mongodb_service import (
    users_collection,
    main_categories_collection,
    sub_categories_collection,
    exams_collection,
    categories_collection,
    subjects_collection,
    topics_collection,
    questions_collection,
    tests_collection,
    test_series_collection,
    orders_collection,
    purchases_collection,
    coupons_collection,
    attempts_collection,
    results_collection,
    notifications_collection,
    settings_collection,
    fitness_logs_collection,
    pyqs_collection,
    notes_collection,
    quotes_collection,
    current_affairs_collection,
    db
)

def seed_database():
    db_file = os.path.join(os.path.dirname(__file__), "..", "mock_test_portal", "data", "database.json")
    if not os.path.exists(db_file):
        print(f"Database file not found at: {db_file}")
        return

    with open(db_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Seed users preserving hashes from database.json without static plain-text fallbacks
    users_list = data.get("users", [])
    for u in users_list:
        email = u.get("email")
        if email:
            existing = users_collection.find_one({"email": email})
            if not existing:
                u.pop("_id", None)
                if "passwordHash" in u and "hashed_password" not in u:
                    u["hashed_password"] = u["passwordHash"]
                users_collection.insert_one(u)
                print(f"Seeded user: {email}")
            else:
                print(f"User {email} already exists in DB.")

    mapping = [
        ("mainCategories", main_categories_collection, data.get("mainCategories", [])),
        ("subCategories", sub_categories_collection, data.get("subCategories", [])),
        ("exams", exams_collection, data.get("exams", [])),
        ("categories", categories_collection, data.get("categories", [])),
        ("subjects", subjects_collection, data.get("subjects", [])),
        ("topics", topics_collection, data.get("topics", [])),
        ("questions", questions_collection, data.get("questions", [])),
        ("tests", tests_collection, data.get("tests", [])),
        ("testSeries", test_series_collection, data.get("testSeries", [])),
        ("orders", orders_collection, data.get("orders", [])),
        ("purchases", purchases_collection, data.get("purchases", [])),
        ("coupons", coupons_collection, data.get("coupons", [])),
        ("attempts", attempts_collection, data.get("attempts", [])),
        ("results", results_collection, data.get("results", [])),
        ("notifications", notifications_collection, data.get("notifications", [])),
        ("fitnessLogs", fitness_logs_collection, data.get("fitnessLogs", [])),
        ("pyqs", pyqs_collection, data.get("pyqs", [])),
        ("notes", notes_collection, data.get("notes", [])),
        ("currentAffairs", current_affairs_collection, data.get("currentAffairs", [])),
    ]

    for name, collection, items in mapping:
        if not items:
            continue
        upsert_count = 0
        for item in items:
            item_id = item.get("id")
            if item_id:
                doc = dict(item)
                doc.pop("_id", None)
                collection.update_one({"id": item_id}, {"$set": doc}, upsert=True)
                upsert_count += 1
        print(f"Updated/Upserted {upsert_count} items in MongoDB collection: {name}")

    if data.get("settings"):
        settings_collection.update_one({}, {"$set": data["settings"]}, upsert=True)
        print("Seeded platform settings into MongoDB.")

    if data.get("quoteOfTheDay"):
        quotes_collection.update_one({}, {"$set": data["quoteOfTheDay"]}, upsert=True)
        print("Seeded quote of the day into MongoDB.")

    print("\nMongoDB Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
