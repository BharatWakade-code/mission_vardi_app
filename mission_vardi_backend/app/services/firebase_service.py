import os
import firebase_admin
from firebase_admin import credentials, messaging

# Initialize Firebase Admin only once
if not firebase_admin._apps:
    # Look for the service account file in the root of the backend directory
    cred_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../firebase_service_account.json"))
    
    if not os.path.exists(cred_path):
        # Fallback if running from the root directory
        cred_path = "firebase_service_account.json"
        
    try:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully.")
        else:
            print(f"Warning: Firebase credentials file not found at {cred_path}")
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")

def send_push_notification(title: str, body: str, topic: str = "all_users", data: dict = None):
    """
    Sends a push notification to a specific FCM topic.
    """
    # If firebase isn't initialized, skip sending to avoid crash
    if not firebase_admin._apps:
        print("Firebase Admin not initialized, cannot send notification.")
        return False
        
    try:
        # Define the message payload
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data if data else {},
            topic=topic,  # Ensure your mobile app subscribes to this topic
        )
        
        # Send the message
        response = messaging.send(message)
        print(f"Successfully sent message to topic '{topic}':", response)
        return response
    except Exception as e:
        print(f"Error sending message via FCM: {e}")
        return None
