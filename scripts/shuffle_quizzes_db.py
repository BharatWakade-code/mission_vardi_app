import pymongo
import random
import os

# MongoDB Connection String
MONGODB_URI = "mongodb+srv://missionVardi:FlashSisko@edusaas.mqa2rmf.mongodb.net/"
DB_NAME = "edusaas"

def shuffle_all_quizzes():
    try:
        # Connect to MongoDB
        print("Connecting to MongoDB...")
        client = pymongo.MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        quizzes_collection = db["quizzes"]
        
        # Get all quizzes
        quizzes = list(quizzes_collection.find({}))
        
        if not quizzes:
            print("No quizzes found in the database.")
            return

        report_lines = ["# Quiz Shuffle Report\n"]
        updated_count = 0
        print(f"Found {len(quizzes)} quizzes. Shuffling questions...")
        
        for quiz in quizzes:
            questions = quiz.get("questions", [])
            quiz_title = quiz.get('title', 'Unknown')
            quiz_id = quiz.get('id')
            
            if questions:
                # Record before state
                before_ids = [q.get('id', 'N/A') for q in questions]
                
                # Shuffle the questions array
                random.shuffle(questions)
                
                # Record after state
                after_ids = [q.get('id', 'N/A') for q in questions]
                
                # Update the database
                quizzes_collection.update_one(
                    {"_id": quiz["_id"]},
                    {"$set": {"questions": questions}}
                )
                print(f"Shuffled {len(questions)} questions for quiz: {quiz_title} ({quiz_id})")
                
                # Add to report
                report_lines.append(f"## {quiz_title}")
                report_lines.append(f"- **Quiz ID**: {quiz_id}")
                report_lines.append(f"- **Questions**: {len(questions)}")
                report_lines.append("\n### First 5 Questions Order (Before -> After)")
                report_lines.append("| Before ID | After ID |")
                report_lines.append("| :--- | :--- |")
                for b_id, a_id in zip(before_ids[:5], after_ids[:5]):
                    report_lines.append(f"| {b_id} | {a_id} |")
                report_lines.append("\n")
                
                updated_count += 1
            else:
                print(f"Warning: No questions to shuffle for quiz: {quiz_title} ({quiz_id})")
                report_lines.append(f"## {quiz_title}")
                report_lines.append("*No questions found in this quiz.*\n")
                
        print(f"\nSuccessfully shuffled questions for {updated_count} out of {len(quizzes)} quizzes in the database!")
        
        # Save Report
        with open("shuffle_report.md", "w", encoding="utf-8") as f:
            f.write("\n".join(report_lines))
        print("Generated 'shuffle_report.md' with the details of the shuffle.")
        
    except Exception as e:
        print(f"Error connecting to database or updating quizzes: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    shuffle_all_quizzes()
