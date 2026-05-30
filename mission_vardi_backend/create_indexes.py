from app.services.mongodb_service import *
import pymongo

def create_indexes():
    print("Creating MongoDB Indexes for Performance Optimization...")
    
    # Users
    users_collection.create_index("id", unique=True)
    users_collection.create_index("email", unique=True)
    users_collection.create_index("district")
    
    # Quizzes
    quizzes_collection.create_index("id", unique=True)
    
    # Results
    results_collection.create_index([("quiz_id", pymongo.ASCENDING), ("score", pymongo.DESCENDING)])
    results_collection.create_index("user_id")
    
    # Notes
    notes_collection.create_index("id", unique=True)
    notes_collection.create_index("user_id")
    
    # User Stats
    user_stats_collection.create_index("user_id", unique=True)
    user_stats_collection.create_index([("total_score", pymongo.DESCENDING)])
    
    # Fitness Logs
    fitness_logs_collection.create_index("id", unique=True)
    fitness_logs_collection.create_index([("user_id", pymongo.ASCENDING), ("date", pymongo.DESCENDING)])

    # Current Affairs
    current_affairs_collection.create_index("id", unique=True)
    current_affairs_collection.create_index([("date", pymongo.DESCENDING)])

    print("Indexes created successfully!")

if __name__ == "__main__":
    create_indexes()
