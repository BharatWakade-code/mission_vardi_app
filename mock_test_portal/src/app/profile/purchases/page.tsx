"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface PaymentItem {
  order_id?: string;
  payment_id?: string;
  plan?: string;
  amount: number;
  status: string;
  timestamp: string;
}

export default function PurchasesPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealPayments();
  }, []);

  const fetchRealPayments = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const payRes = await fetch(`${API_BASE_URL}/payment/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payJson = await payRes.json();
      if (payJson.status && Array.isArray(payJson.data)) {
        setPayments(payJson.data);
      }
    } catch (e) {
      console.error("Failed to load payments", e);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <Loader2 className="animate-spin" size={40} color="#2563eb" />
      </div>
    );
  }

  return (
    <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
      
      {/* Header */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "14px" }}>
        <CreditCard size={22} color="#059669" /> Purchase History & Active Subscriptions
      </h2>

      {payments.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(5, 150, 105, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <ShoppingBag size={32} color="#059669" />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
            No Orders or Purchases Found
          </h3>
          <p style={{ fontSize: "0.95rem", color: "#64748b", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            You haven't purchased any premium test series or subscriptions yet. Explore our packages for full access!
          </p>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px",
            borderRadius: "12px", background: "#059669", color: "#ffffff", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 10px 20px -5px rgba(5, 150, 105, 0.3)"
          }}>
            Explore Test Series & Plans <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        /* Real Orders List */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {payments.map((p, idx) => (
            <div key={idx} style={{
              padding: "20px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.06)",
              background: "#f8fafc", display: "flex", flexDirection: "column", gap: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "1.1rem" }}>
                  {p.plan || "Premium Test Series Plan"}
                </span>
                <span style={{
                  padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700,
                  background: p.status === "SUCCESS" ? "#dcfce7" : "#fee2e2",
                  color: p.status === "SUCCESS" ? "#16a34a" : "#ef4444"
                }}>
                  {p.status}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#64748b" }}>
                <span>Amount Paid: <b style={{ color: "#0f172a" }}>₹{p.amount}</b></span>
                <span>Date: {new Date(p.timestamp).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace", background: "rgba(0,0,0,0.03)", padding: "8px 12px", borderRadius: "8px" }}>
                Transaction ID: {p.payment_id || p.order_id || `TXN_${idx}`}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
