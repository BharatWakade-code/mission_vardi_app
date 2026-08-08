import os
import re
import json
import urllib.request
import urllib.error
import PyPDF2

# List of papers to process
PAPERS = [
    {"title": "Talathi Bharti Practice Paper 1", "id": "1LCbtKP0AHdBz9DzWMKG3ONM75ts2D025"},
    {"title": "Talathi Bharti Practice Paper 2", "id": "1N9ejKxBxgLILh7Kr3bjEg29EAAnu2tyE"},
    {"title": "Talathi Bharti Practice Paper 3", "id": "1tQyGU5kaYuajuvZoQZhyAo3PJx58NBp3"},
    {"title": "Talathi Bharti Practice Paper 4", "id": "16-nbpQynSeDmZUqgnJs5p0zAD_OZWZEf"},
    {"title": "Talathi Bharti Practice Paper 5", "id": "16olcKKrdGiwEbL-FUjBSs_3xiQNGbIQ6"},
    {"title": "Talathi Bharti Practice Paper 6", "id": "1ooT63TjmUN53yJoGwvrfNiocJmFqkEuU"},
    {"title": "Talathi Bharti Practice Paper 7", "id": "1Pmu94vTBclTASsT9Ihq7RA6KFaDlswoJ"},
    {"title": "Talathi Bharti Practice Paper 8", "id": "1-mYb6OlrfPkZbXD7nm5YG9TyBUaQXuSY"},
    {"title": "Talathi Bharti Practice Paper 9", "id": "1g6V5BwB2NGhltDq0i-v3LXoixvTq59nY"},
    {"title": "Talathi Bharti Practice Paper 10", "id": "1B0S3XV_zq92Sz5ZZ9vezsyEMZSOtJYBb"},
    {"title": "Talathi Bharti Practice Paper 11", "id": "1k2NxRdlCVuNq1Sm-CUuYbL0SpQUuPDuv"},
    {"title": "Talathi Bharti Practice Paper 12", "id": "146yeYIiGHV2CNR_Q6ScyP0llE58w-wPw"},
    {"title": "Talathi Bharti Practice Paper 13", "id": "1d5IkiVkmFXT6mhIswt7xadyZX8svWKdU"},
    {"title": "Talathi Bharti Practice Paper 14", "id": "1kbm93ErVksjcA3Emmkf8ilaX66T6mByK"},
    {"title": "Talathi Bharti Practice Paper 15", "id": "1F_Lfg91csUjLxm9rAKvf4sRy-raojjZQ"},
    {"title": "Talathi Bharti Practice Paper 16", "id": "1wrFJLDoQjyuvCRbE1DC6C5nTtLDrHcet"},
    {"title": "Talathi Bharti Practice Paper 17", "id": "1mnwMWQsqcZoT4-rRqumweN1RaIKiZtBC"},
    {"title": "Talathi Bharti Practice Paper 18", "id": "1rBr56cMEk9dX6FClbYcfs9ckHcScpkqm"},
    {"title": "Talathi Bharti Practice Paper 19", "id": "1CyTCatfTwJU7gsv1TSJBTuHR7TWxOk07"},
    {"title": "Talathi Bharti Practice Paper 20", "id": "1EqQgtcNvgKnQTtrM_VwjqQEoHu9waOAi"},
    {"title": "Talathi Bharti Practice Paper 21", "id": "1qlLsZYwbULt8D7fYnIxKVo3UUCzAcBJC"},
    {"title": "Talathi Bharti Practice Paper 22", "id": "1RQoi8Tjrtfsf8Qcn27o_RXDuEqkPcDPc"}
]

API_URL = "https://mission-vardi-app.onrender.com/quiz"

def download_file(file_id, output_path):
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    print(f"Downloading {url} to {output_path}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response, open(output_path, 'wb') as out_file:
        out_file.write(response.read())

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text()
        return text
    except Exception as e:
        print(f"Failed to read PDF {pdf_path}: {e}")
        return ""

def parse_questions(text):
    pattern = re.compile(
        r"Reference ID:\((\d+)\)\s*(.*?)\s*A\.(.*?)\s*B\.(.*?)\s*C\.(.*?)\s*D\.(.*?)\s*Answer:\s*([A-D])\.",
        re.DOTALL
    )
    matches = pattern.finditer(text)
    
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

def format_payload(title, questions):
    output_data = {
        "title": title,
        "title_mr": title,
        "description": f"Previous year {title} questions with answers.",
        "description_mr": f"मागील वर्षीचे {title} सराव प्रश्न आणि उत्तरे.",
        "category": "Talathi Bharti",
        "type": "mock_test",
        "questions": []
    }
    
    for q in questions:
        options = [
            q["options"]["A"],
            q["options"]["B"],
            q["options"]["C"],
            q["options"]["D"]
        ]
        
        correct_answer = q["correctAnswer"].lower()
        
        output_data["questions"].append({
            "id": q["referenceId"],
            "text": q["question"],
            "text_mr": q["question"],
            "options": options,
            "options_mr": options,
            "correctAnswer": correct_answer
        })
    return output_data

def upload_quiz(payload):
    print(f"Uploading {payload['title']} with {len(payload['questions'])} questions...")
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully uploaded! Status code: {response.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    os.makedirs('temp_pdfs', exist_ok=True)
    
    for paper in PAPERS:
        pdf_path = f"temp_pdfs/{paper['id']}.pdf"
        
        if not os.path.exists(pdf_path):
            try:
                download_file(paper["id"], pdf_path)
            except Exception as e:
                print(f"Failed to download {paper['title']}: {e}")
                continue
            
        print(f"Extracting text from {pdf_path}...")
        text = extract_text_from_pdf(pdf_path)
        
        print(f"Parsing questions for {paper['title']}...")
        questions = parse_questions(text)
        print(f"Extracted {len(questions)} questions.")
        
        if len(questions) > 0:
            payload = format_payload(paper["title"], questions)
            upload_quiz(payload)
        else:
            print(f"Skipping {paper['title']} due to 0 extracted questions.")
        print("-" * 40)

if __name__ == "__main__":
    main()
