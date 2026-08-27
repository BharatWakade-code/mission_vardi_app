import requests
res = requests.get('http://localhost:8000/category/')
data = res.json().get('data', [])
for i, c in enumerate(data):
    print(f"{i}: id={c.get('id')}, name='{c.get('name')}', isActive={c.get('isActive')}")
