# EduSaaS Platform - Setup Guide

Welcome to the **EduSaaS Platform**! This complete package contains everything you need to launch your own educational quiz and Mock Test business, including a cross-platform mobile app, a web portal, and a powerful backend API.

## 📦 What's Included
1. **`lib/`**: Flutter Mobile App (iOS & Android).
2. **`mock_test_portal/`**: Next.js Web Portal & Admin Dashboard.
3. **`mission_vardi_backend/`**: FastAPI Backend (Python) with MongoDB.

---

## Step 1: Backend Deployment (FastAPI)

We recommend deploying your backend to **Render**, **Heroku**, or **DigitalOcean**.

1. Navigate into the `mission_vardi_backend` directory.
2. Create a MongoDB database (e.g., using MongoDB Atlas for free).
3. Set up the following Environment Variables in your hosting provider:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `DB_NAME`: Your database name (e.g., `edusaas`).
   - `JWT_SECRET_KEY`: A random 64-character string for securing user logins.
   - `ADMIN_USERNAME`: The username for accessing your Admin Portal.
   - `ADMIN_PASSWORD`: The secure password for your Admin Portal.
4. Deploy the application. The backend will run automatically via the `uvicorn app.main:app` command.

---

## Step 2: Web Portal & Admin Dashboard (Next.js)

The web portal provides a beautiful frontend for users and a secure Admin Panel for you. We recommend deploying to **Vercel** or **Netlify**.

1. Navigate into the `mock_test_portal` directory.
2. Open the `.env` file and set the following variables:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed FastAPI backend from Step 1.
   - `NEXT_PUBLIC_ENABLE_FITNESS_TRACKER`: Set to `false` unless your platform is strictly for physical training academies (like Military/Police).
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: Your Google AdSense Publisher ID (Optional).
3. Deploy to Vercel. Your website is now live!
4. **Access the Admin Panel** by navigating to `https://your-domain.com/admin` and logging in with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in Step 1.

---

## Step 3: Mobile App Setup (Flutter)

1. Open the Flutter project folder in Visual Studio Code or Android Studio.
2. Run `flutter pub get` to install all dependencies.
3. Open the `.env` file in the root directory (create one if it doesn't exist) and add:
   - `API_BASE_URL`: Your deployed FastAPI backend URL.
   - `ENABLE_FITNESS_TRACKER`: `false`.
4. Run the app on your emulator or physical device using `flutter run`.

### Optional Integrations
* **Firebase (Google Login)**: Download your `google-services.json` from Firebase and place it in `android/app/`. Download `GoogleService-Info.plist` and place it in `ios/Runner/`.
* **Razorpay (Payments)**: Update your API keys in the Payment Services module if you plan to charge for tests directly in the app.

---

**🎉 Congratulations!** Your platform is now fully configured and ready for users.
