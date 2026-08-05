import urllib.request
import json
import random
import sys
import urllib.error

BASE_URL = "https://mission-vardi-app.onrender.com/quiz"

def update_quiz(quiz_id):
    print(f"Fetching {quiz_id}...")
    req = urllib.request.Request(f"{BASE_URL}/{quiz_id}")
    try:
        with urllib.request.urlopen(req) as res:
            response_json = json.loads(res.read().decode('utf-8'))
            data = response_json.get('data', {})
    except Exception as e:
        print(f"Failed to fetch: {e}")
        return

    questions = data.get('questions', [])
    if not questions:
        print(f"No questions found for {quiz_id}")
        return

    # Shuffle the questions list
    random.shuffle(questions)
    data['questions'] = questions

    # Remove fields that might cause issues on update
    data.pop('_id', None)
    data.pop('createdAt', None)
    data.pop('updatedAt', None)

    print(f"Updating {quiz_id} with {len(questions)} shuffled questions...")
    try:
        req_put = urllib.request.Request(
            f"{BASE_URL}/{quiz_id}",
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'accept': 'application/json'},
            method='PATCH'
        )
        with urllib.request.urlopen(req_put) as res_put:
            print(f"Success! Status: {res_put.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error during update: {e}")

if __name__ == "__main__":
    update_quiz("cac9c145-c5a1-4494-b758-f6140b1857a9")
