"use client";

import React, { useState } from "react";
import { Settings, Bell, Shield, Lock, Smartphone, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);

  const [savedMsg, setSavedMsg] = useState(false);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, val: boolean) => {
    setter(val);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
      
      {/* Header */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "14px" }}>
        <Settings size={22} color="#475569" /> Account Settings & Notifications
      </h2>

      {savedMsg && (
        <div style={{
          padding: "10px 16px", borderRadius: "10px", marginBottom: "20px",
          background: "rgba(16, 185, 129, 0.1)", color: "#059669", fontWeight: 600, fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <CheckCircle2 size={18} /> Preferences updated!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "600px" }}>
        
        {/* Notifications Group */}
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Bell size={18} color="#2563eb" /> Notification Preferences
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>Email Notifications</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Receive test reports, performance analytics & recommendations</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => handleToggle(setEmailNotifs, e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "#2563eb", cursor: "pointer" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>WhatsApp Exam Alerts</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Get instant alerts for new Maharashtra Bharti hall tickets & dates</div>
              </div>
              <input
                type="checkbox"
                checked={whatsappNotifs}
                onChange={(e) => handleToggle(setWhatsappNotifs, e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "#2563eb", cursor: "pointer" }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>Daily Practice Challenge Reminders</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Maintain your daily study streak timer</div>
              </div>
              <input
                type="checkbox"
                checked={examAlerts}
                onChange={(e) => handleToggle(setExamAlerts, e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "#2563eb", cursor: "pointer" }}
              />
            </label>
          </div>
        </div>

        {/* Security & Password Group */}
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Shield size={18} color="#2563eb" /> Security & Account Protection
          </h3>

          <div style={{ padding: "20px", borderRadius: "14px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>Password & Authentication</div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Your account is secured with standard encryption. If you need to reset or change your password, click below.
            </p>
            <div>
              <button
                onClick={() => alert("Password reset link has been sent to your registered email address.")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px",
                  borderRadius: "10px", border: "1px solid rgba(37,99,235,0.3)", background: "#ffffff",
                  color: "#2563eb", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer"
                }}
              >
                <Lock size={16} /> Request Password Reset Link
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
