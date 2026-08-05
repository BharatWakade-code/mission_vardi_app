import json
import uuid
import math
import os

# Configuration
INPUT_FILE = "raw_questions.json"
OUTPUT_FILE = "formatted_quizzes.json"
QUESTIONS_PER_QUIZ = 100
CATEGORY_NAME = "Police Bharti"  # You can change this

def get_letter_answer(index):
    """Convert 0,1,2,3 to a,b,c,d"""
    mapping = {0: "a", 1: "b", 2: "c", 3: "d"}
    return mapping.get(index, "a")

def process_questions():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: Please save your data in a file named '{INPUT_FILE}' in this folder.")
        return

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    print(f"✅ Loaded {len(raw_data)} raw questions.")

    quizzes = []
    total_quizzes = math.ceil(len(raw_data) / QUESTIONS_PER_QUIZ)

    for i in range(total_quizzes):
        chunk = raw_data[i * QUESTIONS_PER_QUIZ : (i + 1) * QUESTIONS_PER_QUIZ]
        
        quiz_questions = []
        for q in chunk:
            # Handle possible missing fields gracefully
            q_en = q.get("question", {}).get("en", "")
            q_mr = q.get("question", {}).get("mr", "")
            
            opt_en = q.get("options", {}).get("en", [])
            opt_mr = q.get("options", {}).get("mr", [])
            
            exp_en = q.get("explanation", {}).get("en", "")
            exp_mr = q.get("explanation", {}).get("mr", "")
            
            # Map answer index to a,b,c,d
            ans_index = q.get("answer", 0)
            correct_letter = get_letter_answer(ans_index)
            
            # Prefer Marathi options, fallback to English
            final_options = opt_mr if opt_mr and any(opt_mr) else opt_en
            
            formatted_q = {
                "id": str(q.get("id", uuid.uuid4())),
                "text": q_en if q_en else q_mr,
                "text_mr": q_mr,
                "options": final_options,
                "correct_answer": correct_letter,
                "explanation": exp_mr if exp_mr else exp_en
            }
            quiz_questions.append(formatted_q)

        quiz = {
            "title": f"{CATEGORY_NAME} Advanced Mock Test - {i+1:02d}",
            "description": f"Advanced level mock test {i+1} for {CATEGORY_NAME}.",
            "category": CATEGORY_NAME,
            "type": "mock_test",
            "questions": quiz_questions
        }
        quizzes.append(quiz)

    # Save to output file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(quizzes, f, ensure_ascii=False, indent=2)

    print(f"🎉 Successfully created {len(quizzes)} quizzes (with up to {QUESTIONS_PER_QUIZ} questions each)!")
    print(f"📂 Saved formatted quizzes to '{OUTPUT_FILE}'")

if __name__ == "__main__":
    process_questions()
