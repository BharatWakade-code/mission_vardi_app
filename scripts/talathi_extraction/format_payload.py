import json

def format_talathi_quiz():
    with open('talathi_mock_test.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    output_data = {
        "title": "Talathi Bharti Practice Paper 1 (2019)",
        "title_mr": "Aptitude Tests भरती सराव प्रश्नसंच 1 (2019)",
        "description": "Previous year Talathi Bharti mock test questions with answers.",
        "description_mr": "मागील वर्षीचे Aptitude Tests भरती सराव प्रश्न आणि उत्तरे.",
        "category": "Talathi Bharti",
        "type": "mock_test",
        "questions": []
    }
    
    for i, q in enumerate(questions):
        options = [
            q["options"]["A"],
            q["options"]["B"],
            q["options"]["C"],
            q["options"]["D"]
        ]
        
        # Convert A, B, C, D to a, b, c, d
        correct_answer = q["correctAnswer"].lower()
        
        output_data["questions"].append({
            "id": q["referenceId"],
            "text": q["question"],
            "text_mr": q["question"],
            "options": options,
            "options_mr": options,
            "correctAnswer": correct_answer
        })
        
    with open('talathi_quiz_payload.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Formatted {len(output_data['questions'])} questions for API upload.")

if __name__ == "__main__":
    format_talathi_quiz()
