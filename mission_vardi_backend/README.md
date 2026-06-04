# Mission Vardi Backend

FastAPI + MongoDB + Firebase Auth backend.

## Run Locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger Docs: http://127.0.0.1:8000/docs

## Environment Variables

Create a `.env` file in this directory:

```env
MONGODB_URI=
DB_NAME=

JWT_SECRET_KEY=
JWT_ALGORITHM=
JWT_EXPIRE_MINUTES=

FIREBASE_CREDENTIALS_PATH=
FIREBASE_PROJECT_ID=
```
