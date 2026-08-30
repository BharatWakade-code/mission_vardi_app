from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict, Any
import os
import logging
from datetime import datetime, timedelta
import secrets
from dotenv import load_dotenv

load_dotenv()

import uuid
from app.services.auth_service import get_current_user
from app.services.mongodb_service import (
    coupons_collection,
    orders_collection,
    purchases_collection,
    tests_collection,
    test_series_collection,
    notifications_collection,
)

router = APIRouter(tags=["Payments & Coupons"])


@router.post("/coupons/apply")
async def apply_coupon(payload: dict):
    code = (payload.get("code") or "").strip().upper()
    amount = float(payload.get("amount", 0))

    coupon = coupons_collection.find_one({"code": code, "isActive": True}, {"_id": 0})
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid coupon code.")

    expires_at = coupon.get("expiresAt")
    if expires_at and datetime.fromisoformat(expires_at.replace("Z", "")) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Coupon has expired.")

    if coupon.get("timesUsed", 0) >= coupon.get("usageLimit", 999999):
        raise HTTPException(status_code=400, detail="Coupon usage limit reached.")

    min_val = coupon.get("minOrderValue", 0)
    if amount < min_val:
        raise HTTPException(status_code=400, detail=f"Minimum order value of ₹{min_val} required for this coupon.")

    discount = 0.0
    d_type = coupon.get("discountType", "percentage")
    d_val = coupon.get("discountValue", 0)

    if d_type == "percentage":
        discount = round((amount * d_val) / 100, 2)
        max_d = coupon.get("maxDiscount")
        if max_d and discount > max_d:
            discount = float(max_d)
    else:
        discount = float(d_val)

    final_amount = max(0.0, amount - discount)

    return {
        "status": True,
        "coupon": coupon,
        "discount": discount,
        "finalAmount": final_amount,
        "data": {
            "coupon": coupon,
            "discount": discount,
            "finalAmount": final_amount
        }
    }


@router.post("/payments/create-order")
async def create_order(payload: dict, current_user: Optional[dict] = Depends(get_current_user)):
    product_id = payload.get("productId")
    product_type = payload.get("productType", "test")
    coupon_code = payload.get("couponCode")

    user_id = current_user["id"] if current_user else "user-student-1"
    user_name = current_user.get("name", "Student Aspirant") if current_user else "Bharat Wakade"
    user_email = current_user.get("email", "bharatwakade012@gmail.com") if current_user else "bharatwakade012@gmail.com"
    user_mobile = current_user.get("mobile", "9823012345") if current_user else "9823012345"

    product_title = ""
    base_price = 0.0

    if product_type == "test":
        test = tests_collection.find_one({"id": product_id}, {"_id": 0})
        if not test:
            raise HTTPException(status_code=404, detail="Test not found.")
        if test.get("isFree"):
            raise HTTPException(status_code=400, detail="Free test does not require payment.")
        product_title = test.get("title", "")
        base_price = float(test.get("price", 0))
    else:
        series = test_series_collection.find_one({"id": product_id}, {"_id": 0})
        if not series:
            raise HTTPException(status_code=404, detail="Test Series not found.")
        product_title = series.get("title", "")
        base_price = float(series.get("price", 0))

    discount = 0.0
    if coupon_code:
        c_res = await apply_coupon({"code": coupon_code, "amount": base_price})
        discount = c_res["discount"]

    payable = max(0.0, base_price - discount)
    order_id = str(uuid.uuid4())
    rzp_order_id = f"order_{secrets.token_hex(8)}"

    order = {
        "id": order_id,
        "userId": user_id,
        "userName": user_name,
        "userEmail": user_email,
        "userMobile": user_mobile,
        "productId": product_id,
        "productType": product_type,
        "productTitle": product_title,
        "amount": payable,
        "discountAmount": discount,
        "couponCode": coupon_code or None,
        "status": "pending",
        "razorpayOrderId": rzp_order_id,
        "createdAt": datetime.utcnow().isoformat()
    }

    orders_collection.insert_one(order)
    order.pop("_id", None)

    rzp_key = os.getenv("RAZORPAY_KEY_ID", "")
    if not rzp_key:
        logging.warning("RAZORPAY_KEY_ID is not set in environment variables.")
    return {
        "status": True,
        "order": order,
        "razorpayKey": rzp_key,
        "data": {
            "order": order,
            "razorpayKey": rzp_key
        }
    }


@router.post("/payments/verify")
async def verify_payment(payload: dict):
    order_id = payload.get("orderId")
    payment_id = payload.get("razorpayPaymentId") or f"pay_{secrets.token_hex(8)}"

    order = orders_collection.find_one({"$or": [{"id": order_id}, {"razorpayOrderId": order_id}]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.get("status") == "successful":
        existing_p = purchases_collection.find_one({"orderId": order["id"]}, {"_id": 0})
        order.pop("_id", None)
        return {"status": True, "success": True, "order": order, "purchase": existing_p}

    # Mark Order Successful
    orders_collection.update_one({"id": order["id"]}, {"$set": {"status": "successful", "razorpayPaymentId": payment_id}})
    order["status"] = "successful"
    order["razorpayPaymentId"] = payment_id
    order.pop("_id", None)

    validity_days = 180
    if order["productType"] == "test":
        t = tests_collection.find_one({"id": order["productId"]})
        if t:
            validity_days = t.get("validityDays", 180)
    else:
        s = test_series_collection.find_one({"id": order["productId"]})
        if s:
            validity_days = (s.get("validityMonths", 6)) * 30

    expires_at = (datetime.utcnow() + timedelta(days=validity_days)).isoformat()
    purchase = {
        "id": str(uuid.uuid4()),
        "userId": order["userId"],
        "productId": order["productId"],
        "productType": order["productType"],
        "productTitle": order["productTitle"],
        "orderId": order["id"],
        "amountPaid": order["amount"],
        "expiresAt": expires_at,
        "createdAt": datetime.utcnow().isoformat()
    }

    purchases_collection.insert_one(purchase)
    purchase.pop("_id", None)

    if order.get("couponCode"):
        coupons_collection.update_one({"code": order["couponCode"]}, {"$inc": {"timesUsed": 1}})

    # Send Notification
    notif = {
        "id": str(uuid.uuid4()),
        "userId": order["userId"],
        "title": "Payment Successful! 🎉",
        "message": f"Your payment of ₹{order['amount']} for \"{order['productTitle']}\" was successful.",
        "type": "payment_success",
        "isRead": False,
        "link": "/dashboard",
        "createdAt": datetime.utcnow().isoformat()
    }
    notifications_collection.insert_one(notif)

    return {
        "status": True,
        "success": True,
        "order": order,
        "purchase": purchase,
        "data": {
            "success": True,
            "order": order,
            "purchase": purchase
        }
    }
