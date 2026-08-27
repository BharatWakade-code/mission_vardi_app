from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import razorpay
import os
import hmac
import hashlib
from datetime import datetime
from app.services.mongodb_service import users_collection

router = APIRouter(
    prefix="/payment",
    tags=["Payment"]
)

razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), 
          os.getenv("RAZORPAY_KEY_SECRET"))
)

class OrderRequest(BaseModel):
    user_id: str
    amount: int  # Amount in INR (will be converted to paise internally)
    plan_name: str = "premium"

class VerifyRequest(BaseModel):
    user_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
async def create_order(request: OrderRequest):
    try:
        # amount in paise (1 INR = 100 paise)
        amount_paise = request.amount * 100 
        
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"receipt_{request.user_id}_{int(datetime.now().timestamp())}",
            "notes": {
                "user_id": request.user_id,
                "plan": request.plan_name
            }
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return {
            "status": True,
            "message": "Order created successfully",
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": os.getenv("RAZORPAY_KEY_ID")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_payment(request: VerifyRequest):
    try:
        # Verify Signature
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        if not key_secret:
            raise Exception("Razorpay secret key is not configured in the environment.")
        
        # Razorpay signature verification logic
        generated_signature = hmac.new(
            key_secret.encode('utf-8'),
            f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == request.razorpay_signature:
            # Payment is successful! Upgrade user to premium.
            # Using user_id, update user record in MongoDB
            users_collection.update_one(
                {"id": request.user_id},
                {"$set": {"is_premium": True, "premium_activated_at": str(datetime.now())}}
            )
            
            return {
                "status": True,
                "message": "Payment verified and Premium activated successfully!"
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
