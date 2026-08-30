from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Default MongoDB Connection URI provided by the user.
# The user can override this completely by setting the MONGODB_URI environment variable,
# or by specifying MONGODB_URI in their deployment setup.
DEFAULT_URI = "mongodb+srv://missionVardi:Sisko%40123@missionvardi.mqa2rmf.mongodb.net/"

MONGODB_URI = os.getenv("MONGODB_URI", DEFAULT_URI)
DB_NAME = os.getenv("DB_NAME", "missionvardi")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Expose collections
users_collection = db["users"]
quizzes_collection = db["quizzes"]
results_collection = db["results"]
notes_collection = db["notes"]
notifications_collection = db["notifications"]
study_sessions_collection = db["study_sessions"]
user_stats_collection = db["user_stats"]
current_affairs_collection = db["current_affairs"]
config_collection = db["config"]
fitness_logs_collection = db["fitness_logs"]
quotes_collection = db["quotes"]
pyqs_collection = db["pyqs"]

# Mock Test Portal Collections
main_categories_collection = db["main_categories"]
sub_categories_collection = db["sub_categories"]
exams_collection = db["exams"]
categories_collection = db["categories"]
subjects_collection = db["subjects"]
topics_collection = db["topics"]
questions_collection = db["questions"]
tests_collection = db["tests"]
test_series_collection = db["test_series"]
orders_collection = db["orders"]
purchases_collection = db["purchases"]
coupons_collection = db["coupons"]
attempts_collection = db["attempts"]
settings_collection = db["settings"]

