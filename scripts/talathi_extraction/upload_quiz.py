import json
import urllib.request
import urllib.error

def upload_quiz():
    url = "https://mission-vardi-app.onrender.com/quiz"
    print(f"Uploading to {url} ...")
    
    with open('talathi_quiz_payload.json', 'r', encoding='utf-8') as f:
        data = f.read()
        
    req = urllib.request.Request(
        url,
        data=data.encode('utf-8'),
        headers={
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully uploaded! Status code: {response.getcode()}")
            response_body = response.read().decode('utf-8')
            print("Response:", response_body)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    upload_quiz()
