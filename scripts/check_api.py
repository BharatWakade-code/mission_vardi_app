import urllib.request
import json

try:
    req = urllib.request.Request("https://mission-vardi-app.onrender.com/quiz/369dbeb0-47e8-44fb-b320-f9da06002430")
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(json.dumps(data, indent=2)[:500])
except Exception as e:
    print(e)
