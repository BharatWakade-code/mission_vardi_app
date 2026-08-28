"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Shield, Zap, Award } from "lucide-react";

// Define pricing plans based on test series
const PRICING_PLANS = [
  {
    id: "plan_police_bharti",
    name: "Police Bharti Master Series",
    price: 199,
    originalPrice: 499,
    description: "Complete preparation for Maharashtra Police Bharti.",
    features: [
      "100+ Full-Length Mock Tests",
      "Detailed Solutions & Explanations",
      "Sectional Practice Tests",
      "Previous Year Question Papers (PDFs)",
      "Current Affairs Monthly Magazine"
    ],
    popular: true,
  },
  {
    id: "plan_talathi_bharti",
    name: "Talathi Bharti Special",
    price: 149,
    originalPrice: 399,
    description: "Targeted practice for Talathi examinations.",
    features: [
      "50+ Full-Length TCS Pattern Tests",
      "Detailed Solutions & Analytics",
      "English & Marathi Grammar Special",
      "Previous Year Papers"
    ],
    popular: false,
  },
  {
    id: "plan_all_access",
    name: "All-Access Pass (1 Year)",
    price: 499,
    originalPrice: 1999,
    description: "Ultimate bundle for all Maharashtra state exams.",
    features: [
      "Access to ALL Test Series (Police, Talathi, ZP, MPSC)",
      "Premium Study Material & PDFs",
      "Ad-Free Experience",
      "Priority Support",
      "New Tests Added Weekly"
    ],
    popular: false,
  }
];

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (plan: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to purchase a premium plan.");
      return;
    }
    
    setIsProcessing(plan.id);
    
    try {
      const res = await loadRazorpayScript();
      if (!res) { alert("Razorpay SDK failed to load. Are you online?"); setIsProcessing(null); return; }

      // 1. Create order on backend
      const orderRes = await fetch("http://localhost:8000/payment/create-order", { 
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: plan.price,
          plan_name: plan.name
        })
      });
      const orderData = await orderRes.json();
      
      if (!orderData.status) {
        alert("Failed to create order: " + (orderData.detail || orderData.message));
        setIsProcessing(null);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MH Mock Test Portal",
        description: plan.name,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // 3. Verify Payment on backend
          try {
            const verifyRes = await fetch("http://localhost:8000/payment/verify", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: plan.price,
                plan_name: plan.name
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.status) {
              alert("Payment Successful! Premium features unlocked.");
            } else {
              alert("Payment verification failed!");
            }
          } catch (e) {
            alert("Error verifying payment.");
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: { color: "#2563eb" }
      };
      
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (e) {
      alert("Error initiating checkout.");
      console.error(e);
    }

    setIsProcessing(null);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <main className="container" style={{ padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", padding: "6px 16px", borderRadius: "100px", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", display: "inline-block" }}>
            Premium Test Series
          </span>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", letterSpacing: "-1px" }}>
            Invest in Your <span style={{ color: "#2563eb" }}>Success</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Get access to high-quality mock tests, premium PDFs, and detailed analytics. Trusted by thousands of students across Maharashtra.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", alignItems: "start" }}>
          
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id}
              style={{
                background: plan.popular ? "#0f172a" : "#ffffff",
                border: `1px solid ${plan.popular ? "#0f172a" : "var(--border-color)"}`,
                borderRadius: "24px",
                padding: "40px 30px",
                position: "relative",
                boxShadow: plan.popular ? "0 20px 40px -10px rgba(15, 23, 42, 0.3)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
                transform: plan.popular ? "translateY(-10px)" : "none",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "white", padding: "6px 16px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 4px 10px rgba(37,99,235,0.3)" }}>
                  Most Popular
                </div>
              )}

              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: plan.popular ? "white" : "#0f172a", marginBottom: "8px" }}>
                {plan.name}
              </h3>
              
              <p style={{ color: plan.popular ? "#94a3b8" : "#64748b", fontSize: "0.95rem", marginBottom: "24px", minHeight: "45px" }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: "32px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 800, color: plan.popular ? "white" : "#0f172a", lineHeight: "1" }}>
                  ₹{plan.price}
                </span>
                <span style={{ fontSize: "1.1rem", color: plan.popular ? "#64748b" : "#94a3b8", textDecoration: "line-through", fontWeight: 500 }}>
                  ₹{plan.originalPrice}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: plan.popular ? "#cbd5e1" : "#475569", fontSize: "0.95rem" }}>
                      <Check size={20} color={plan.popular ? "#3b82f6" : "#2563eb"} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuy(plan)}
                disabled={isProcessing === plan.id}
                style={{
                  marginTop: "40px",
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: isProcessing === plan.id ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  background: plan.popular ? "white" : "var(--primary-gradient)",
                  color: plan.popular ? "#0f172a" : "white",
                  border: "none",
                  boxShadow: plan.popular ? "none" : "0 10px 20px -5px rgba(37,99,235,0.3)"
                }}
              >
                {isProcessing === plan.id ? (
                  "Processing..."
                ) : (
                  <>
                    <Zap size={20} />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          ))}

        </div>

        {/* Trust Badges */}
        <div style={{ marginTop: "80px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b" }}>
            <Shield size={24} color="#10b981" />
            <span style={{ fontWeight: 600 }}>100% Secure Payments</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b" }}>
            <Award size={24} color="#f59e0b" />
            <span style={{ fontWeight: 600 }}>High Quality Content</span>
          </div>
        </div>

      </main>
    </div>
  );
}
