"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, Activity, CreditCard, Settings, LogOut, Trophy, Dumbbell, 
  Flame, CheckCircle2, ShieldCheck, Mail, Lock, Phone, MapPin, Target, AlertCircle, Sparkles
} from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  district?: string;
  target_exam?: string;
  is_premium?: boolean;
  avatar_url?: string;
  stats?: {
    total_quizzes?: number;
    average_score_percent?: number;
    current_streak_days?: number;
    badges?: any[];
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Modal/Form State for Unauthenticated Users
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [targetExam, setTargetExam] = useState("Police Bharti");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const json = await res.json();
      if (res.ok && json.status && json.data) {
        setUser(json.data);
        // Also fetch detailed stats
        fetchStats(json.data.id, authToken);
      } else {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error("Error fetching user profile:", e);
    }
    setLoading(false);
  };

  const fetchStats = async (userId: string, authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/getProfile?user_id=${userId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status && json.data) {
          setUser((prev) => prev ? { ...prev, stats: json.data.stats } : prev);
        }
      }
    } catch (e) {
      console.warn("Could not load stats:", e);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const endpoint = authMode === "login" ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
    const payload = authMode === "login" 
      ? { email, password }
      : { name, email, password, mobile, district, target_exam: targetExam };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.status && json.data) {
        const accessToken = json.data.access_token;
        const userInfo = json.data.user;

        localStorage.setItem("token", accessToken);
        if (userInfo.id) localStorage.setItem("user_id", userInfo.id);
        if (userInfo.name) localStorage.setItem("user_name", userInfo.name);

        setToken(accessToken);
        setUser(userInfo);
        fetchStats(userInfo.id, accessToken);
      } else {
        setAuthError(json.detail || json.message || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setAuthError("Could not connect to server. Please ensure backend server is running.");
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const navItems = [
    { name: "Personal Details", href: "/profile", icon: <User size={18} /> },
    { name: "Physical Fitness", href: "/profile/fitness", icon: <Dumbbell size={18} /> },
    { name: "Analytics & Results", href: "/profile/analytics", icon: <Activity size={18} /> },
    { name: "Purchase History", href: "/profile/purchases", icon: <CreditCard size={18} /> },
    { name: "Settings", href: "/profile/settings", icon: <Settings size={18} /> },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(37,99,235,0.1)", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
      </div>
    );
  }

  // --- UNAUTHENTICATED VIEW: MODERN LOGIN / REGISTER ---
  if (!token || !user) {
    return (
      <div style={{ maxWidth: "480px", margin: "60px auto", padding: "0 20px" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.06)"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)"
            }}>
              <User size={28} color="#fff" />
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
              {authMode === "login" ? "Sign in to access your student dashboard & results" : "Join thousands of students practicing on MH Mock Test"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "rgba(0, 0, 0, 0.03)",
            padding: "4px",
            borderRadius: "14px",
            marginBottom: "24px"
          }}>
            <button
              onClick={() => { setAuthMode("login"); setAuthError(null); }}
              style={{
                padding: "10px",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: authMode === "login" ? "#ffffff" : "transparent",
                color: authMode === "login" ? "#2563eb" : "#64748b",
                boxShadow: authMode === "login" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s"
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode("register"); setAuthError(null); }}
              style={{
                padding: "10px",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: authMode === "register" ? "#ffffff" : "transparent",
                color: authMode === "register" ? "#2563eb" : "#64748b",
                boxShadow: authMode === "register" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s"
              }}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div style={{
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px"
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {authMode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Full Name (संपूर्ण नाव)</label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            {authMode === "register" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>District (जिल्हा)</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Pune"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Target Exam</label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem", background: "#fff" }}
                  >
                    <option value="Police Bharti">पोलीस भरती (Police Bharti)</option>
                    <option value="Talathi Bharti">तलाठी भरती (Talathi Bharti)</option>
                    <option value="MPSC Rajyaseva">MPSC राज्यसेवा (MPSC)</option>
                    <option value="Zilla Parishad">जिल्हा परिषद (ZP Bharti)</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 700,
                border: "none",
                cursor: authLoading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)",
                transition: "all 0.2s"
              }}
            >
              {authLoading ? "Processing..." : authMode === "login" ? "Sign In to Dashboard" : "Create My Student Profile"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED VIEW: MODERN STUDENT DASHBOARD ---
  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "ST";
  const userStats = user.stats || {};

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      
      {/* Modern Profile Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "24px",
        padding: "36px 32px",
        color: "#ffffff",
        marginBottom: "32px",
        boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow decoration */}
        <div style={{
          position: "absolute", right: "-40px", top: "-40px", width: "220px", height: "220px",
          background: "rgba(37, 99, 235, 0.25)", filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}>
          {/* User Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "20px",
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", fontWeight: 800, color: "#fff",
              border: "3px solid rgba(255,255,255,0.15)", boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
            }}>
              {initials}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
                  {user.name}
                </h1>
                {user.is_premium && (
                  <span style={{ background: "rgba(234, 179, 8, 0.2)", color: "#facc15", border: "1px solid rgba(234, 179, 8, 0.4)", padding: "3px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                    PRO PASS
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.9rem", color: "#94a3b8" }}>
                <span>📧 {user.email}</span>
                {user.mobile && <span>📱 {user.mobile}</span>}
                {user.district && <span>📍 {user.district}</span>}
              </div>
            </div>
          </div>

          {/* Quick Target Exam Pill */}
          <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "12px 20px", borderRadius: "16px", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
              Target Goal
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
              <Target size={18} />
              {user.target_exam || "Police Bharti 2026"}
            </div>
          </div>
        </div>

        {/* Live Quick Stats Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "14px" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Tests Completed</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#60a5fa", marginTop: "2px" }}>
              {userStats.total_quizzes ?? 0}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "14px" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Average Score</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34d399", marginTop: "2px" }}>
              {Math.round(userStats.average_score_percent ?? 0)}%
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "14px" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Study Streak</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fb923c", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Flame size={18} color="#fb923c" /> {userStats.current_streak_days ?? 0} Days
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "14px" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Badges Earned</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#c084fc", marginTop: "2px" }}>
              {userStats.badges ? userStats.badges.length : 0}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Layout Grid */}
      <div style={{ display: "flex", gap: "30px", flexDirection: "row", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Sidebar Nav */}
        <div style={{
          width: "280px",
          flexShrink: 0,
          background: "#ffffff",
          borderRadius: "20px",
          padding: "16px",
          boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  color: isActive ? "#2563eb" : "#475569",
                  background: isActive ? "rgba(37, 99, 235, 0.08)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ color: isActive ? "#2563eb" : "#94a3b8" }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}

          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 18px",
                borderRadius: "12px",
                color: "#ef4444",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                width: "100%",
                textAlign: "left",
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
