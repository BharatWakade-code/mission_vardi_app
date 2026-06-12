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

def send_push_notification(title: str, body: str, topic: str = None, token: str = None, data: dict = None):
    """
    Sends a push notification to a specific FCM topic or device token.
    """
    # If firebase isn't initialized, skip sending to avoid crash
    if not firebase_admin._apps:
        print("Firebase Admin not initialized, cannot send notification.")
        return False
        
    if not topic and not token:
        print("Must provide either a topic or a token.")
        return False

    try:
        # Define the message payload
        kwargs = {
            "notification": messaging.Notification(
                title=title,
                body=body,
            ),
            "data": data if data else {},
        }
        
        if token:
            kwargs["token"] = token
        elif topic:
            kwargs["topic"] = topic

        message = messaging.Message(**kwargs)
        
        # Send the message
        response = messaging.send(message)
        print(f"Successfully sent message to topic '{topic}':", response)
        return response
    except Exception as e:
        print(f"Error sending message via FCM: {e}")
        return None

def send_multicast_notification(title: str, body: str, tokens: list[str], data: dict = None):
    """
    Sends a push notification to multiple device tokens.
    """
    if not firebase_admin._apps:
        print("Firebase Admin not initialized, cannot send multicast notification.")
        return False
        
    if not tokens:
        print("Must provide at least one token.")
        return False

    try:
        # Define the message payload
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data if data else {},
            tokens=tokens,
        )
        
        # Send the message
        response = messaging.send_each_for_multicast(message)
        print(f"Successfully sent multicast message to {response.success_count} devices. Failed: {response.failure_count}")
        return {"success_count": response.success_count, "failure_count": response.failure_count}
    except Exception as e:
        print(f"Error sending multicast message via FCM: {e}")
        return None
