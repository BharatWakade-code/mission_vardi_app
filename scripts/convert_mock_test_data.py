import json
import argparse
import sys
import urllib.request
import urllib.error

def convert_json(input_data):
    """
    Converts the API JSON response format to the required app JSON format.
    """
    # Extract test details
    test_data = input_data.get("data", {}).get("test", {})
    
    title = test_data.get("title", "Police Bharti Mock Test")
    description = test_data.get("description", "Mock Test Description")
    
    # Check if questions exist in data.questions or data.test.questions
    questions_data = input_data.get("data", {}).get("questions")
    if not questions_data:
        questions_data = test_data.get("questions", [])

    # Prepare the base output structure
    output_data = {
        "title": title,
        "title_mr": title,
        "description": description,
        "description_mr": description,
        "category": "Police Bharti",
        "type": "mock_test",
        "questions": []
    }

    # Iterate and format questions
    for q in questions_data:
        options = [
            q.get("option_a", ""),
            q.get("option_b", ""),
            q.get("option_c", ""),
            q.get("option_d", "")
        ]
        
        question = {
            "id": str(q.get("id", "")),
            "text": q.get("question_text_english", q.get("question_text", "")),
            "text_mr": q.get("question_text", ""),
            "options": options,
            "options_mr": options,
            "correctAnswer": q.get("correct_answer", "")
        }
        output_data["questions"].append(question)

    return output_data

def main():
    parser = argparse.ArgumentParser(description="Convert JSON mock test data format and upload to API.")
    parser.add_argument("-i", "--input", help="Path to input JSON file", default="input.json")
    parser.add_argument("-u", "--url", help="API URL to post data to", default="https://mission-vardi-app.onrender.com/quiz")
    
    args = parser.parse_args()
    
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            input_json = json.load(f)
            
        output_json = convert_json(input_json)
        
        print(f"Uploading data to {args.url} ...")
        req = urllib.request.Request(
            args.url,
            data=json.dumps(output_json).encode('utf-8'),
            headers={
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            print(f"Successfully uploaded data! Status code: {response.getcode()}")
            
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Failed to parse '{args.input}' as JSON.")
        sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"URL Error: {e.reason}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
