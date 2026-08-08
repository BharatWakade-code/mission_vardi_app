import sys
import os
sys.path.append(os.path.abspath("a:/Projects/mission_vardi_app/mission_vardi_backend"))

from app.services.mongodb_service import quizzes_collection

def backfill_total_questions():
    quizzes = quizzes_collection.find({})
    count = 0
    for q in quizzes:
        if "questions" in q:
            num = len(q["questions"])
            quizzes_collection.update_one(
                {"_id": q["_id"]},
                {"$set": {"totalQuestions": num}}
            )
            count += 1
            print(f"Updated quiz {q.get('id', 'unknown')} to {num} questions")
    print(f"Total quizzes updated: {count}")

if __name__ == "__main__":
    backfill_total_questions()
