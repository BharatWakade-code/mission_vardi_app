"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Target, LogOut, CheckCircle2, AlertTriangle, CreditCard, Loader2, Activity, BarChart2 } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [targetExam, setTargetExam] = useState("");

  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      // Fetch Profile
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.status && json.data) {
        setUser(json.data);
        setName(json.data.name || "");
        setMobile(json.data.mobile || "");
        setDistrict(json.data.district || "");
        setTargetExam(json.data.target_exam || "");
      } else {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      // Fetch Payment History
      const payRes = await fetch(`${API_BASE_URL}/payment/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const payJson = await payRes.json();
      if (payJson.status) {
        setPayments(payJson.data || []);
      }

      // Fetch Activity/Results
      try {
        const actRes = await fetch(`${API_BASE_URL}/quiz/user/my-results`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const actJson = await actRes.json();
        if (actJson.status) {
          setActivities(actJson.data || []);
        }
      } catch (e) {
        console.error("Failed to load activity", e);
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Failed to load profile data." });
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, mobile, district, target_exam: targetExam })
      });
      const json = await res.json();
      
      if (res.ok && json.status) {
        setUser(json.data);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Update local storage user name
        const currentName = localStorage.getItem("user_name");
        if (currentName) localStorage.setItem("user_name", name);
      } else {
        setMessage({ type: "error", text: json.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <Loader2 className="animate-spin" size={48} color="#2563eb" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a" }}>My Profile</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "8px", borderColor: "#ef4444", color: "#ef4444" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: "16px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px",
          background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
          color: message.type === "success" ? "#059669" : "#ef4444" 
        }}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span style={{ fontWeight: 600 }}>{message.text}</span>
        </div>
      )}

      <div className="grid-2">
        {/* PROFILE SETTINGS */}
        <div className="glass-card">
          <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <User size={20} color="#2563eb" /> Personal Details
          </h2>
          
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                  style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)", fontSize: "1rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Mobile Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input 
                  type="tel" 
                  value={mobile} 
                  onChange={e => setMobile(e.target.value)} 
                  placeholder="e.g. 9876543210"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)", fontSize: "1rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>District (जिल्हा)</label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input 
                  type="text" 
                  value={district} 
                  onChange={e => setDistrict(e.target.value)} 
                  placeholder="e.g. Pune"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)", fontSize: "1rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Target Exam</label>
              <div style={{ position: "relative" }}>
                <Target size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input 
                  type="text" 
                  value={targetExam} 
                  onChange={e => setTargetExam(e.target.value)} 
                  placeholder="e.g. Police Bharti 2026"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)", fontSize: "1rem" }}
                />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <CreditCard size={20} color="#059669" /> Payment History
          </h2>
          
          <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}>
            {payments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                <CreditCard size={40} style={{ margin: "0 auto 12px auto", opacity: 0.3 }} />
                <p>No payment history found.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Purchase a premium plan to unlock more tests!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {payments.map((p, idx) => (
                  <div key={idx} style={{ 
                    padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", 
                    background: "rgba(0,0,0,0.01)", display: "flex", flexDirection: "column", gap: "8px" 
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{p.plan}</span>
                      <span style={{ 
                        padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700,
                        background: p.status === "SUCCESS" ? "#dcfce7" : "#fee2e2", 
                        color: p.status === "SUCCESS" ? "#16a34a" : "#ef4444" 
                      }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b" }}>
                      <span>Amount: <b style={{ color: "#0f172a" }}>₹{p.amount}</b></span>
                      <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "monospace" }}>
                      TXN ID: {p.payment_id || p.order_id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ACTIVITY & PERFORMANCE CHART */}
      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <Activity size={20} color="#8b5cf6" /> Performance & Activity
        </h2>
        
        {activities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
            <BarChart2 size={40} style={{ margin: "0 auto 12px auto", opacity: 0.3 }} />
            <p>No activity tracked yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Take some mock tests to see your performance graph here!</p>
          </div>
        ) : (
          <div>
            {/* CSS Bar Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", padding: "20px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", overflowX: "auto" }}>
              {activities.slice(-15).map((act, idx) => {
                const percentage = (act.score / act.total) * 100 || 0;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1", minWidth: "40px" }}>
                    <div style={{ 
                      width: "100%", maxWidth: "40px", height: `${percentage}%`, 
                      background: "linear-gradient(to top, #8b5cf6, #c4b5fd)", 
                      borderRadius: "6px 6px 0 0", position: "relative",
                      transition: "height 1s ease-out"
                    }}>
                      <div style={{ position: "absolute", top: "-20px", width: "100%", textAlign: "center", fontSize: "0.7rem", fontWeight: "bold", color: "#6b7280" }}>
                        {Math.round(percentage)}%
                      </div>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "50px", textAlign: "center" }}>
                      {new Date(act.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Activity List */}
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", paddingRight: "8px" }}>
              {activities.slice().reverse().map((act, idx) => (
                <div key={idx} style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(0,0,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>{act.quiz_title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                      {new Date(act.submittedAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#8b5cf6" }}>{act.score} / {act.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
