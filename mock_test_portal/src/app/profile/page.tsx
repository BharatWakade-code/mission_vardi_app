"use client";

import React, { useEffect, useState } from "react";
import { User, Phone, MapPin, Target, CheckCircle2, AlertCircle, Loader2, Award, Mail, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  district?: string;
  target_exam?: string;
  badges?: any[];
}

export default function PersonalDetailsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [targetExam, setTargetExam] = useState("Police Bharti");
  const [badges, setBadges] = useState<any[]>([]);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch current auth user details
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.status && json.data) {
        const u = json.data;
        setName(u.name || "");
        setEmail(u.email || "");
        setMobile(u.mobile || "");
        setDistrict(u.district || "");
        setTargetExam(u.target_exam || "Police Bharti");

        // 2. Fetch badges if user ID is present
        if (u.id) {
          fetchUserBadges(u.id);
        }
      }
    } catch (e) {
      console.error("Failed to load profile", e);
      setMessage({ type: "error", text: "Failed to load real profile data from server." });
    }
    setIsLoading(false);
  };

  const fetchUserBadges = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/${userId}/badges`);
      if (res.ok) {
        const json = await res.json();
        if (json.status && json.data) {
          setBadges(json.data.earned || []);
        }
      }
    } catch (e) {
      console.warn("Could not load badges:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Please log in to update details." });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          district,
          target_exam: targetExam,
        }),
      });

      const json = await res.json();

      if (res.ok && json.status) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        if (name) localStorage.setItem("user_name", name);
      } else {
        setMessage({ type: "error", text: json.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
    setIsSaving(false);
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
      
      {/* Section Title */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "14px" }}>
        <User size={22} color="#2563eb" /> Personal Details & Goal Settings
      </h2>

      {/* Alert Message */}
      {message && (
        <div style={{
          padding: "14px 18px",
          borderRadius: "12px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: message.type === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
          color: message.type === "success" ? "#059669" : "#ef4444",
          fontWeight: 600,
          fontSize: "0.95rem"
        }}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "650px" }}>
        
        {/* Full Name */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
            Full Name (पूर्ण नाव)
          </label>
          <div style={{ position: "relative" }}>
            <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "1rem", color: "#0f172a" }}
            />
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
            Email Address (ईमेल आयडी)
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="email"
              disabled
              value={email}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.02)", fontSize: "1rem", color: "#64748b" }}
            />
          </div>
        </div>

        {/* Mobile Number & District */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
              Mobile Number (मोबाईल क्रमांक)
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "1rem", color: "#0f172a" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
              District (जिल्हा)
            </label>
            <div style={{ position: "relative" }}>
              <MapPin size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Pune, Chhatrapati Sambhajinagar"
                style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "1rem", color: "#0f172a" }}
              />
            </div>
          </div>
        </div>

        {/* Target Exam */}
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
            Target Exam Goal (नियोजित परीक्षा)
          </label>
          <div style={{ position: "relative" }}>
            <Target size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "1rem", color: "#0f172a", background: "#fff" }}
            >
              <option value="Police Bharti">🛡️ पोलीस भरती (Police Bharti)</option>
              <option value="Talathi Bharti">📜 तलाठी भरती (Talathi Bharti)</option>
              <option value="MPSC Rajyaseva">🏛️ MPSC राज्यसेवा (MPSC Rajyaseva)</option>
              <option value="Zilla Parishad">🏢 जिल्हा परिषद (ZP Bharti)</option>
              <option value="Arogya Vibhag">🏥 आरोग्य विभाग भरती</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: "10px" }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 700,
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)",
              transition: "all 0.2s"
            }}
          >
            {isSaving ? "Saving..." : "Save Profile Details"}
          </button>
        </div>
      </form>

      {/* Earned Badges Section */}
      {badges.length > 0 && (
        <div style={{ marginTop: "40px", paddingTop: "28px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={20} color="#f59e0b" /> Earned Achievement Badges
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            {badges.map((badge, idx) => (
              <div key={idx} style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                padding: "14px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <Sparkles size={20} color="#d97706" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#92400e" }}>{badge.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#b45309" }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
