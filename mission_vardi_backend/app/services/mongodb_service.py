from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Default MongoDB Connection URI provided by the user.
# The user can override this completely by setting the MONGODB_URI environment variable,
# or by specifying MONGODB_URI in their deployment setup.
DEFAULT_URI = "mongodb+srv://missionVardi:FlashSisko@missionvardi.mqa2rmf.mongodb.net/"

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
