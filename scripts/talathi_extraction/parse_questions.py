import re
import json

def parse_questions(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to capture Reference ID, Question, Options A, B, C, D, and Answer
    pattern = re.compile(
        r"Reference ID:\((\d+)\)\s*(.*?)\s*A\.(.*?)\s*B\.(.*?)\s*C\.(.*?)\s*D\.(.*?)\s*Answer:\s*([A-D])\.",
        re.DOTALL
    )

    matches = pattern.finditer(content)
    
    questions = []
    for match in matches:
        ref_id = match.group(1).strip()
        question = match.group(2).strip()
        opt_a = match.group(3).strip()
        opt_b = match.group(4).strip()
        opt_c = match.group(5).strip()
        opt_d = match.group(6).strip()
        ans = match.group(7).strip()
        
        questions.append({
            "referenceId": ref_id,
            "question": question,
            "options": {
                "A": opt_a,
                "B": opt_b,
                "C": opt_c,
                "D": opt_d
            },
            "correctAnswer": ans
        })
        
    return questions

if __name__ == "__main__":
    qs = parse_questions('extracted_questions.txt')
    print(f"Extracted {len(qs)} questions.")
    
    with open('talathi_mock_test.json', 'w', encoding='utf-8') as f:
        json.dump(qs, f, ensure_ascii=False, indent=2)
