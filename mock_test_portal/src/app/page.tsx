"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Trophy,
  FileText,
  Award,
  Activity,
  ArrowRight,
  ShieldCheck,
  Landmark,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  UserCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { generateFAQSchema, MockTest, ExamCategory } from "@/data/mockTests";
import {
  fetchLiveQuizzes,
  fetchLiveCategories,
  fetchDashboardData,
  fetchGlobalLeaderboard,
  fetchNotes,
  fetchPYQs,
  fetchGlobalAlerts,
  loginUserApi,
  registerUserApi,
  updateUserProfileApi,
  fetchFitnessLogsApi,
  createFitnessLogApi,
  deleteFitnessLogApi,
  DashboardData,
  LeaderboardEntry,
  NoteItem,
  PYQItem,
  AlertItem,
  UserProfile,
  FitnessLog
} from "@/services/api";
import ExamCard from "@/components/ExamCard";
import AdSlot from "@/components/AdSlot";
import SchemaScript from "@/components/SchemaScript";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tests, setTests] = useState<MockTest[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  // New features state (Dashboard, Notes, PYQs, Leaderboard, Physical Fitness, Alerts, Profile)
  const ENABLE_FITNESS_TRACKER = process.env.NEXT_PUBLIC_ENABLE_FITNESS_TRACKER === 'true';
  const [activeTab, setActiveTab] = useState<"mock-tests" | "study-notes" | "pyqs" | "leaderboard" | "physical-test" | "profile">("mock-tests");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // User Auth & Profile State (Live connected just like mobile app)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "profile">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Physical Test Tracker State (/fitness)
  const [fitnessLogs, setFitnessLogs] = useState<FitnessLog[]>([]);
  const [run1600Min, setRun1600Min] = useState<number>(5);
  const [run1600Sec, setRun1600Sec] = useState<number>(10);
  const [run100Sec, setRun100Sec] = useState<number>(11.5);
  const [shotPutMeters, setShotPutMeters] = useState<number>(8.50);
  const [fitnessNotes, setFitnessNotes] = useState("");
  const [fitnessLoading, setFitnessLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for existing logged-in user
    const savedUser = localStorage.getItem("edusaas_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        const uid = u.user_id || u.id;
        if (uid) {
          fetchFitnessLogsApi(uid).then(setFitnessLogs);
        }
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }

    // Fetch all backend APIs in parallel
    Promise.all([
      fetchLiveQuizzes().then((data) => { if (data) setTests(data); }),
      fetchLiveCategories().then((cats) => { if (cats && cats.length > 0) setCategories(cats); }),
      fetchDashboardData().then(setDashboardData),
      fetchGlobalAlerts().then(setAlerts),
      fetchGlobalLeaderboard().then(setLeaderboard),
      fetchNotes().then(setNotes),
      fetchPYQs().then(setPyqs)
    ]).finally(() => {
      setLoading(false);
      setAppLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["mock-tests", "study-notes", "pyqs", "leaderboard", "physical-test", "profile"].includes(hash)) {
        setActiveTab(hash as any);
      } else if (hash === "all-tests") {
        setActiveTab("mock-tests");
      }
    };

    // Initial check
    handleHashChange();

    // The Next.js router might not fire 'hashchange' on pushState, so we override pushState temporarily
    // or just listen to popstate/hashchange. Popstate fires when URL changes.
    window.addEventListener("hashchange", handleHashChange);

    // Custom event listener if we dispatch it manually from Navbar
    window.addEventListener("tabchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("tabchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (el) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [activeTab]);

  // Filter tests by category & search query
  const filteredTests = tests.filter((test) => {
    const matchesCat = selectedCategory === "all" || test.categorySlug === selectedCategory;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await loginUserApi(email, password);
    setAuthLoading(false);
    if (res.success && res.user) {
      const u = res.user;
      setCurrentUser(u);
      localStorage.setItem("edusaas_user", JSON.stringify(u));
      setShowAuthModal(false);
      const uid = u.user_id || u.id;
      if (uid) {
        fetchFitnessLogsApi(uid).then(setFitnessLogs);
      }
      alert(`🎉 Login successful! Welcome, ${u.name || "Student"}!`);
    } else {
      setAuthError(res.message || "Login failed. Please check your email and password.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await registerUserApi(name, email, password, mobile, district);
    setAuthLoading(false);
    if (res.success && res.user) {
      const u = res.user;
      setCurrentUser(u);
      localStorage.setItem("edusaas_user", JSON.stringify(u));
      setShowAuthModal(false);
      alert(`🎉 Registration successful! Welcome, ${u.name}! You can now use the leaderboard and physical tests.`);
    } else {
      setAuthError(res.message || "Registration failed. Please try again.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setAuthLoading(true);
    const updated = { ...currentUser, name, mobile, district };
    const uid = currentUser.user_id || currentUser.id || "";
    await updateUserProfileApi(uid, updated);
    setAuthLoading(false);
    setCurrentUser(updated);
    localStorage.setItem("edusaas_user", JSON.stringify(updated));
    setShowAuthModal(false);
    alert("✓ Profile and district information updated successfully!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("edusaas_user");
    setFitnessLogs([]);
    setShowAuthModal(false);
  };

  // Physical Marks Calculator Logic (Police Bharti Official Standards)
  const calculatePhysicalScore = () => {
    const total1600Sec = (run1600Min * 60) + Number(run1600Sec);
    let score1600 = 0;
    if (total1600Sec <= 310) score1600 = 20; // 5 min 10 sec or less
    else if (total1600Sec <= 330) score1600 = 18;
    else if (total1600Sec <= 350) score1600 = 16;
    else if (total1600Sec <= 370) score1600 = 14;
    else if (total1600Sec <= 390) score1600 = 12;
    else score1600 = 10;

    let score100 = 0;
    if (run100Sec <= 11.5) score100 = 15;
    else if (run100Sec <= 12.5) score100 = 12;
    else if (run100Sec <= 13.5) score100 = 10;
    else if (run100Sec <= 14.5) score100 = 8;
    else score100 = 5;

    let scoreShot = 0;
    if (shotPutMeters >= 8.50) scoreShot = 15;
    else if (shotPutMeters >= 7.90) scoreShot = 12;
    else if (shotPutMeters >= 7.30) scoreShot = 10;
    else if (shotPutMeters >= 6.70) scoreShot = 8;
    else scoreShot = 5;

    return { score1600, score100, scoreShot, total: score1600 + score100 + scoreShot };
  };

  // Helper to compute individual marks from a saved FitnessLog
  const getFitnessLogMarks = (log: FitnessLog) => {
    const total1600Sec = log.run_1600m_seconds || 300;
    let score1600 = 0;
    if (total1600Sec <= 310) score1600 = 20;
    else if (total1600Sec <= 330) score1600 = 18;
    else if (total1600Sec <= 350) score1600 = 16;
    else if (total1600Sec <= 370) score1600 = 14;
    else if (total1600Sec <= 390) score1600 = 12;
    else score1600 = 10;

    const run100Sec = log.run_100m_seconds || 12;
    let score100 = 0;
    if (run100Sec <= 11.5) score100 = 15;
    else if (run100Sec <= 12.5) score100 = 12;
    else if (run100Sec <= 13.5) score100 = 10;
    else if (run100Sec <= 14.5) score100 = 8;
    else score100 = 5;

    const shotPutMeters = log.shot_put_meters || 8;
    let scoreShot = 0;
    if (shotPutMeters >= 8.50) scoreShot = 15;
    else if (shotPutMeters >= 7.90) scoreShot = 12;
    else if (shotPutMeters >= 7.30) scoreShot = 10;
    else if (shotPutMeters >= 6.70) scoreShot = 8;
    else scoreShot = 5;

    return { score1600, score100, scoreShot, total: score1600 + score100 + scoreShot };
  };

  const handleAddFitnessLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!currentUser.user_id && !currentUser.id)) {
      alert("Please login first to submit your physical test record!");
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    setFitnessLoading(true);
    const userId = currentUser.user_id || currentUser.id!;
    const newLog: FitnessLog = {
      user_id: userId,
      run_1600m_seconds: (run1600Min * 60) + Number(run1600Sec),
      run_100m_seconds: Number(run100Sec),
      shot_put_meters: Number(shotPutMeters),
      date: new Date().toISOString().split("T")[0],
      notes: fitnessNotes || "नियMinत सराव चाचणी",
    };
    const success = await createFitnessLogApi(newLog);
    if (success) {
      const logs = await fetchFitnessLogsApi(userId);
      setFitnessLogs(logs);
      setFitnessNotes("");
      alert("🎉 Today's physical test record saved successfully!");
    } else {
      alert("Problem saving record. Please try again.");
    }
    setFitnessLoading(false);
  };

  const faqSchema = generateFAQSchema();

  if (appLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#020617" }}>

        {/* Premium Logo Pulse */}
        <div style={{ position: "relative", width: "72px", height: "72px", marginBottom: "24px" }} className="animate-pulse">
          <div style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            boxShadow: "0 0 30px rgba(249, 115, 22, 0.2)"
          }}>
            <img src="/logo.png" alt="EduSaaS Web Loading" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Professional Typography */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#f8fafc", marginBottom: "6px", letterSpacing: "0.5px" }}>
          Loading information...
        </h2>

        {/* Subtle Brand Tagline */}
        <p style={{ color: "#475569", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
          EduSaaS Web Portal
        </p>

      </div>
    );
  }

  return (
    <div className="container">
      {/* Inject Schema for SEO Ranking */}
      <SchemaScript schema={faqSchema} />

      {/* Top User Status Bar (Login / Register / Profile) */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: "16px",
        gap: "12px",
        flexWrap: "wrap"
      }}>
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(30, 41, 59, 0.9)", padding: "8px 18px", borderRadius: "100px", border: "1px solid #f97316", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
            {currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid #fff" }} />
            ) : (
              <span style={{ fontSize: "1.2rem" }}>👤</span>
            )}
            <div>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.95rem", display: "block" }}>{currentUser.name}</span>
              <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{currentUser.district || "Global"}</span>
            </div>
            <button
              onClick={() => {
                setName(currentUser.name || "");
                setMobile(currentUser.mobile || "");
                setDistrict(currentUser.district || "");
                setAuthMode("profile");
                setShowAuthModal(true);
              }}
              className="btn btn-outline"
              style={{ padding: "6px 14px", fontSize: "0.85rem", marginLeft: "6px" }}
            >
              ⚙️ My Profile
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setAuthMode("login"); setAuthError(""); setShowAuthModal(true); }}
            className="btn btn-primary"
            style={{ padding: "10px 24px", borderRadius: "100px", fontSize: "0.95rem", boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span>🔑 Student Login / Register (Join Leaderboard)</span>
          </button>
        )}
      </div>

      {/* Live Alerts Ticker Banner (/alerts/global) */}
      {alerts.length > 0 && (
        <div style={{
          background: "linear-gradient(90deg, #1e3a8a 0%, #7c2d12 100%)",
          border: "1px solid rgba(249, 115, 22, 0.4)",
          borderRadius: "16px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          flexWrap: "wrap"
        }}>
          <span style={{ fontSize: "1.4rem", animation: "bounce 1s infinite" }}>🔔</span>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <span className="badge badge-orange" style={{ marginRight: "10px", fontSize: "0.75rem", padding: "4px 8px" }}>Important Update</span>
            <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem" }}>{alerts[0].message_mr}</span>
            <span style={{ color: "#cbd5e1", fontSize: "0.85rem", marginLeft: "10px" }}>({alerts[0].message_en})</span>
          </div>
        </div>
      )}


      {/* Top Ad placement */}
      <AdSlot type="leaderboard" title="Google AdSense Top Leaderboard - Premium Education Banner" />

      {/* Main Hub Navigation Tabs (5 Full-Featured Tabs Just Like Mobile App) */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "30px 0 30px 0",
        flexWrap: "wrap",
        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
        paddingBottom: "16px"
      }}>
        <button
          onClick={() => setActiveTab("mock-tests")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "mock-tests" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "mock-tests" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "mock-tests" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          📝 Mock Exams ({filteredTests.length})
        </button>
        <button
          onClick={() => setActiveTab("study-notes")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "study-notes" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "study-notes" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "study-notes" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          📚 Study Materials & Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab("pyqs")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "pyqs" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "pyqs" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "pyqs" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          📜 Previous Year Papers ({pyqs.length})
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "leaderboard" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "leaderboard" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "leaderboard" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          🏆 Top Leaderboard ({leaderboard.length})
        </button>
        <button
          onClick={() => setActiveTab("physical-test")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "physical-test" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "physical-test" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "physical-test" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          🏃 Physical Fitness
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "profile" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
            color: "#ffffff",
            border: activeTab === "profile" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "profile" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
          }}
        >
          👤 My Profile
        </button>
      </div>

      {/* --- TAB 1: MOCK TESTS (/quiz) --- */}
      {activeTab === "mock-tests" && (
        <section id="all-tests" style={{ margin: "20px 0 40px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "4px" }}>
                📋 Available Free Mock Tests
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                Select your desired exam and start solving the online test instantly.
              </p>
            </div>
            <div style={{ fontSize: "0.9rem", color: "#fb923c", fontWeight: 600 }}>
              Total {filteredTests.length} tests available
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div
            ref={categoryScrollRef}
            onMouseDown={(e) => {
              isDown.current = true;
              startX.current = e.pageX - e.currentTarget.offsetLeft;
              scrollLeftPos.current = e.currentTarget.scrollLeft;
              e.currentTarget.style.cursor = "grabbing";
            }}
            onMouseLeave={(e) => {
              isDown.current = false;
              e.currentTarget.style.cursor = "grab";
            }}
            onMouseUp={(e) => {
              isDown.current = false;
              e.currentTarget.style.cursor = "grab";
            }}
            onMouseMove={(e) => {
              if (!isDown.current) return;
              e.preventDefault();
              const x = e.pageX - e.currentTarget.offsetLeft;
              const walk = (x - startX.current) * 2; // Scroll speed multiplier
              e.currentTarget.scrollLeft = scrollLeftPos.current - walk;
            }}
            style={{
              cursor: "grab",
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "12px",
              marginBottom: "20px",
              scrollbarWidth: "none",
              width: "100%",
              maxWidth: "100%"
            }}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                flexShrink: 0,
                padding: "10px 20px",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "var(--transition)",
                background: selectedCategory === "all" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.7)",
                color: "#ffffff",
                border: selectedCategory === "all" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: selectedCategory === "all" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
              }}
            >
              🔥 All Exams
            </button>

            {categories.map((cat) => {
              const isSel = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  style={{
                    flexShrink: 0,
                    padding: "10px 20px",
                    borderRadius: "100px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "var(--transition)",
                    background: isSel ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.7)",
                    color: "#ffffff",
                    border: isSel ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: isSel ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
                  }}
                >
                  {cat.icon} {cat.name} ({cat.totalTests})
                </button>
              );
            })}
          </div>

          {/* Exam Cards Grid */}
          {filteredTests.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center", margin: "30px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>😕</div>
              <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "8px" }}>No Exam Found!</h3>
              <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Currently no live test available in this section or try searching a different word.</p>
              <button onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }} className="btn btn-primary">
                🔄 View All Exams
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filteredTests.map((test) => (
                <ExamCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* --- TAB 2: STUDY NOTES & MATERIAL (/notes) --- */}
      {activeTab === "study-notes" && (
        <section style={{ margin: "20px 0 40px 0" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "6px" }}>
              📚 Study Materials, Current Affairs & Grammar Notes (Live Notes)
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Read detailed notes and study materials for exams for free.
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff" }}>Currently no notes available</h3>
              <p style={{ color: "#94a3b8" }}>New notes will be added soon.</p>
            </div>
          ) : (
            <div className="grid-3">
              {notes.map((note) => (
                <div key={note.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span className="badge badge-blue" style={{ fontSize: "0.75rem" }}>{note.category || "General Study"}</span>
                      {note.createdAt && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{note.createdAt.split(" ")[0]}</span>}
                    </div>
                    <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "10px", lineHeight: "1.4" }}>{note.title}</h3>
                    <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {note.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}
                  >
                    📖 Read Complete Note
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* --- TAB 3: PYQs (Previous Year Question Papers) (/pyqs) --- */}
      {activeTab === "pyqs" && (
        <section style={{ margin: "20px 0 40px 0" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "6px" }}>
              📜 Previous Year Question Papers (PYQ)
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Old question papers and answers asked in Competitive Exams and other competitive exams.
            </p>
          </div>

          {pyqs.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📂</div>
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff" }}>Currently old question papers are loading</h3>
              <p style={{ color: "#94a3b8" }}>All previous question papers will be available for download soon.</p>
            </div>
          ) : (
            <div className="grid-3">
              {pyqs.map((pyq) => (
                <div key={pyq.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "4px solid #f97316" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span className="badge badge-orange" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Year: {pyq.year}</span>
                      <span className="badge badge-blue" style={{ fontSize: "0.75rem" }}>{pyq.category || "PYQ Paper"}</span>
                    </div>
                    <h3 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "10px" }}>{pyq.title}</h3>
                    {pyq.description && (
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "16px" }}>{pyq.description}</p>
                    )}
                  </div>
                  {pyq.pdfUrl && pyq.pdfUrl !== "jsjsjs" ? (
                    <a href={pyq.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                      📥 Download Paper (PDF)
                    </a>
                  ) : (
                    <button onClick={() => alert("This question paper will be available in PDF format soon!")} className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                      📄 View Question Paper
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* --- TAB 4: LEADERBOARD (/leaderboard/global) WITH USER LOGIN FEATURE --- */}
      {activeTab === "leaderboard" && (
        <section style={{ margin: "20px auto 40px auto", maxWidth: "900px" }}>
          {/* User Requested Notice Banner: Login and access profile to see name in leaderboard */}
          <div style={{
            background: "linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(124, 45, 18, 0.8) 100%)",
            border: "2px solid #f97316",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
          }}>
            <div style={{ flex: 1, minWidth: "280px", textAlign: "left" }}>
              <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🌟 Do you want to see your name in the leaderboard?</span>
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {currentUser ?
                  `Welcome, ${currentUser.name}! Your profile has been successfully added. Take online mock exams, score high, and top the leaderboard!` :
                  "If you want to see your name in this global leaderboard, login or register for free now and update your profile. Take mock exams and your scores will immediately appear on the leaderboard!"}
              </p>
            </div>
            <div>
              {currentUser ? (
                <button
                  onClick={() => {
                    setName(currentUser.name || "");
                    setMobile(currentUser.mobile || "");
                    setDistrict(currentUser.district || "");
                    setAuthMode("profile");
                    setShowAuthModal(true);
                  }}
                  className="btn btn-primary"
                  style={{ whiteSpace: "nowrap", padding: "12px 22px", fontSize: "0.95rem" }}
                >
                  ✏️ Edit Profile & District
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode("login"); setAuthError(""); setShowAuthModal(true); }}
                  className="btn btn-primary"
                  style={{ whiteSpace: "nowrap", padding: "12px 26px", fontSize: "1.05rem", boxShadow: "0 4px 15px rgba(249, 115, 22, 0.5)" }}
                >
                  🔑 Login / Register Now
                </button>
              )}
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: "6px" }}>
              🏆 Global Top Aspirants Leaderboard
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Top students from EduSaaS app and web portal with the highest scores!
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }} className="animate-spin">⏳</div>
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff" }}>Loading leaderboard ranking...</h3>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: "24px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.1)", color: "#fb923c", fontSize: "0.95rem" }}>
                    <th style={{ padding: "12px 16px", width: "80px" }}>Rank</th>
                    <th style={{ padding: "12px 16px" }}>Aspirant Name</th>
                    <th style={{ padding: "12px 16px" }}>District</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, idx) => {
                    const rank = idx + 1;
                    let rankBadge = `${rank}`;
                    let rowStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255, 255, 255, 0.05)", transition: "background 0.2s" };
                    if (rank === 1) { rankBadge = "🥇 1"; rowStyle = { ...rowStyle, background: "rgba(234, 179, 8, 0.15)" }; }
                    else if (rank === 2) { rankBadge = "🥈 2"; rowStyle = { ...rowStyle, background: "rgba(148, 163, 184, 0.15)" }; }
                    else if (rank === 3) { rankBadge = "🥉 3"; rowStyle = { ...rowStyle, background: "rgba(217, 119, 6, 0.15)" }; }

                    const isCurrent = currentUser && (currentUser.name === user.name || currentUser.id === user.user_id || currentUser.user_id === user.user_id);

                    return (
                      <tr key={user.user_id || idx} style={isCurrent ? { ...rowStyle, background: "rgba(249, 115, 22, 0.25)", border: "1px solid #f97316" } : rowStyle}>
                        <td style={{ padding: "14px 16px", fontWeight: 800, fontSize: "1.1rem", color: rank <= 3 ? "#fb923c" : "#ffffff" }}>
                          {rankBadge}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fb923c" }} />
                            ) : (
                              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <div>
                              <span style={{ fontWeight: 700, color: "#ffffff", fontSize: "1rem" }}>{user.name || "Anonymous Student"}</span>
                              {isCurrent && <span className="badge badge-orange" style={{ marginLeft: "8px", fontSize: "0.7rem", padding: "2px 6px" }}>You</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#cbd5e1" }}>
                          {user.district || "Global"}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, color: "#34d399", fontSize: "1.1rem" }}>
                          {user.score_str || `${user.points} Points`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* --- TAB 5: PHYSICAL TEST TRACKER (/fitness) --- */}
      {activeTab === "physical-test" && (
        <section style={{ margin: "20px auto 40px auto", maxWidth: "1000px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: "6px" }}>
              🏃 Global Competitive Exams Physical Test Tracker
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Calculate your scores for 1600m run, 100m run, and shot put and keep a record of your daily practice tests.
            </p>
          </div>

          <div className="grid-2" style={{ gap: "24px", alignItems: "flex-start" }}>
            {/* Left Box: Physical Marks Calculator Chart */}
            <div className="glass-card" style={{ padding: "24px", borderLeft: "4px solid #f97316" }}>
              <h3 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🎯 Physical Test Marks Calculator</span>
              </h3>

              <form onSubmit={handleAddFitnessLog} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "6px", fontWeight: 600 }}>
                    1. 1600m Running (20 Marks):
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Minutes (Min):</span>
                      <input type="number" min="3" max="10" value={run1600Min} onChange={(e) => setRun1600Min(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid #f97316", color: "#fff" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Seconds (Sec):</span>
                      <input type="number" min="0" max="59" value={run1600Sec} onChange={(e) => setRun1600Sec(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid #f97316", color: "#fff" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "6px", fontWeight: 600 }}>
                    2. 100m Running (15 Marks):
                  </label>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Seconds (Sec e.g. 11.5):</span>
                    <input type="number" step="0.1" min="9" max="25" value={run100Sec} onChange={(e) => setRun100Sec(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid #f97316", color: "#fff" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "6px", fontWeight: 600 }}>
                    3. Shot Put (15 Marks):
                  </label>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Distance in Meters (e.g. 8.50):</span>
                    <input type="number" step="0.1" min="3" max="15" value={shotPutMeters} onChange={(e) => setShotPutMeters(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid #f97316", color: "#fff" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "6px", fontWeight: 600 }}>
                    📝 Today's practice note (Notes/Ground location):
                  </label>
                  <input type="text" placeholder="e.g. Practice at Shivaji Stadium at 6 AM" value={fitnessNotes} onChange={(e) => setFitnessNotes(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }} />
                </div>

                {(() => {
                  const s = calculatePhysicalScore();
                  return (
                    <div style={{ background: "rgba(30, 41, 59, 0.9)", padding: "16px", borderRadius: "12px", border: "1px solid #34d399", marginTop: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                        <span>1600m Marks: <strong>{s.score1600}/20</strong></span>
                        <span>100m Marks: <strong>{s.score100}/15</strong></span>
                        <span>Shot Put Marks: <strong>{s.scoreShot}/15</strong></span>
                      </div>
                      <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "10px", marginTop: "6px" }}>
                        <span style={{ fontSize: "1.05rem", color: "#ffffff", fontWeight: 700 }}>Your estimated total physical marks: </span>
                        <span style={{ fontSize: "1.6rem", color: "#34d399", fontWeight: 800 }}>{s.total} / 50</span>
                      </div>
                    </div>
                  );
                })()}

                <button type="submit" disabled={fitnessLoading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1.05rem" }}>
                  {fitnessLoading ? "Saving..." : currentUser ? "➕ Save Today's Physical Test Log" : "🔒 Login first to save"}
                </button>
              </form>
            </div>

            {/* Right Box: Saved Fitness Progress Logs */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.35rem", color: "#ffffff", margin: 0 }}>
                  📊 Your Physical Progress & History
                </h3>
                {currentUser && <span className="badge badge-blue" style={{ fontSize: "0.8rem" }}>{fitnessLogs.length} Logs</span>}
              </div>

              {!currentUser ? (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.2)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔒</div>
                  <h4 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "8px" }}>Login to view your practice history</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.5" }}>
                    लॉगिन केल्यानंतर तुम्ही दररोज केलेल्या धावणे व गोळाफेक सरावाच्या सर्व Logs येथे सुरक्षित राहतील.
                  </p>
                  <button onClick={() => { setAuthMode("login"); setShowAuthModal(true); }} className="btn btn-primary" style={{ margin: "0 auto" }}>
                    🔑 Login Now
                  </button>
                </div>
              ) : fitnessLogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📝</div>
                  <h4 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "8px" }}>No physical logs recorded yet</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    Use the calculator on the left to save your first physical test log!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "520px", overflowY: "auto", paddingRight: "6px" }}>
                  {fitnessLogs.map((log, idx) => {
                    const min = Math.floor((log.run_1600m_seconds || 300) / 60);
                    const sec = (log.run_1600m_seconds || 300) % 60;
                    return (
                      <div key={log.id || log._id || idx} style={{ background: "rgba(15, 23, 42, 0.8)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>
                          <span style={{ color: "#fb923c", fontWeight: 700, fontSize: "0.9rem" }}>📅 Date: {log.date || log.created_at?.split("T")[0] || "Today"}</span>
                          {log.id || log._id ? (
                            <button
                              onClick={async () => {
                                if (confirm("Do you want to delete this log?")) {
                                  await deleteFitnessLogApi(log.id || log._id!);
                                  const logs = await fetchFitnessLogsApi(currentUser.user_id || currentUser.id!);
                                  setFitnessLogs(logs);
                                }
                              }}
                              style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                            >
                              🗑️ Delete
                            </button>
                          ) : null}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                          <div>🏃 1600m: <strong>{min} Min {sec} Sec</strong></div>
                          <div>⚡ 100m: <strong>{log.run_100m_seconds || 12} Sec</strong></div>
                          <div>🤾 Shot Put: <strong>{log.shot_put_meters || 8} m</strong></div>
                        </div>
                        {log.notes && (
                          <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic" }}>
                            💬 {log.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- TAB 6: USER PROFILE HUB (/profile) --- */}
      {activeTab === "profile" && (
        <section style={{ margin: "20px 0 40px 0" }}>
          {!currentUser ? (
            <div className="glass-card animate-scale-up" style={{ padding: "60px 30px", textAlign: "center", maxWidth: "700px", margin: "40px auto", border: "1px solid rgba(249, 115, 22, 0.5)", background: "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)" }}>
              <div style={{ fontSize: "4.5rem", marginBottom: "16px" }}>🔒</div>
              <h2 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: "12px", fontWeight: 800 }}>
                Your Personal Study Profile (User Profile Hub)
              </h2>
              <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "30px", maxWidth: "550px", margin: "0 auto 30px auto" }}>
                मोबाईल ॲपप्रमाणेच तुमचे लीडरबोर्ड Rankिंग, Mock Examंचे Marks आणि शारीरिक चाचणीच्या सर्व Logs एकाच ठिकाणी पाहण्यासाठी कृपया खात्यात प्रवेश करा किंवा मोफत नोंदणी करा.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => { setAuthMode("login"); setAuthError(""); setShowAuthModal(true); }}
                  className="btn btn-primary"
                  style={{ padding: "14px 32px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px", boxShadow: "0 6px 20px rgba(249, 115, 22, 0.5)" }}
                >
                  🔑 Login to Account (Login Now)
                </button>
                <button
                  onClick={() => { setAuthMode("register"); setAuthError(""); setShowAuthModal(true); }}
                  className="btn btn-outline"
                  style={{ padding: "14px 32px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px", borderColor: "#f97316", color: "#fb923c" }}
                >
                  📝 Free Registration (Register)
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Profile Header Banner */}
              <div className="glass-card" style={{
                padding: "36px",
                marginBottom: "30px",
                background: "linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(124, 45, 18, 0.6) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "24px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                  <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "var(--primary-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    color: "#fff",
                    boxShadow: "0 0 25px rgba(249, 115, 22, 0.6)",
                    border: "3px solid rgba(255,255,255,0.3)"
                  }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "👮"}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h2 style={{ fontSize: "2.2rem", color: "#ffffff", fontWeight: 900, margin: 0 }}>
                        {currentUser.name}
                      </h2>
                      <span title="Verified Aspirant" style={{ fontSize: "1.4rem" }}>👑</span>
                    </div>
                    <div style={{ color: "#e2e8f0", fontSize: "1rem", marginBottom: "8px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span>📧 {currentUser.email}</span>
                      {currentUser.mobile && <span>📱 {currentUser.mobile}</span>}
                      <span>📍 District: <strong style={{ color: "#fb923c" }}>{currentUser.district || "Global"}</strong></span>
                    </div>
                    <span className="badge badge-orange" style={{ fontSize: "0.8rem" }}>
                      🎯 Global Police & Aptitude Tests Aspirant
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setName(currentUser.name || "");
                      setMobile(currentUser.mobile || "");
                      setDistrict(currentUser.district || "");
                      setAuthMode("profile");
                      setShowAuthModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ padding: "12px 22px", fontSize: "0.95rem", fontWeight: 700 }}
                  >
                    ✏️ Edit Info & District
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ padding: "12px 22px", fontSize: "0.95rem", fontWeight: 700, borderColor: "#ef4444", color: "#ef4444" }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>

              {/* Stats Summary Grid (All Details Just Like Mobile) */}
              <div className="grid-3" style={{ marginBottom: "30px" }}>
                <div className="glass-card" style={{ textAlign: "center", padding: "26px", borderLeft: "4px solid #f97316" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🏆</div>
                  <h4 style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "6px" }}>Leaderboard Status</h4>
                  <div style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, marginBottom: "4px" }}>
                    {(() => {
                      const idx = leaderboard.findIndex(l => l.name === currentUser.name || l.user_id === (currentUser.user_id || currentUser.id));
                      return idx !== -1 ? `#${idx + 1} Rank` : "Participate";
                    })()}
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                    {(() => {
                      const idx = leaderboard.findIndex(l => l.name === currentUser.name || l.user_id === (currentUser.user_id || currentUser.id));
                      return idx !== -1 ? `टॉप 10 मध्ये तुमची Rank #${idx + 1}` : "Mock Exam सोडवून Marks Minळवा";
                    })()}
                  </p>
                </div>

                <div className="glass-card" style={{ textAlign: "center", padding: "26px", borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🏃</div>
                  <h4 style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "6px" }}>शारीरिक चाचणी Logs (Fitness Logs)</h4>
                  <div style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, marginBottom: "4px" }}>
                    {fitnessLogs.length} Logs
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                    {fitnessLogs.length > 0
                      ? `Highest Score: ${Math.max(...fitnessLogs.map(f => getFitnessLogMarks(f).total))} / 50`
                      : "अद्याप कोणतीही नोंद केलेली नाही"}
                  </p>
                </div>

                <div className="glass-card" style={{ textAlign: "center", padding: "26px", borderLeft: "4px solid #10b981" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📝</div>
                  <h4 style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "6px" }}>Mock Exams (Mock Tests)</h4>
                  <div style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, marginBottom: "4px" }}>
                    {tests.length}+ Tests Available
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                    TCS / IBPS पॅटर्ननुसार नियMinत सराव
                  </p>
                </div>
              </div>

              {/* Physical Fitness Training Activity History in Profile */}
              <div className="glass-card" style={{ padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "4px" }}>
                      📜 My Physical Test Progress (Fitness Activity History)
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      तुमच्या रोजच्या 1600 mटर, 100 mटर व गोळाफेक सरावाच्या Logs.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("physical-test")}
                    className="btn btn-primary"
                    style={{ padding: "10px 18px", fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    ➕ Add New Physical Test Log ➡
                  </button>
                </div>

                {fitnessLogs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(0,0,0,0.25)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.15)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📭</div>
                    <h4 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "6px" }}>No physical test logs yet</h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>
                      तुमची रोजची धावण्याची वेळ आणि गोळाफेक अंतर मोजा आणि येथे Secव्ह करा.
                    </p>
                    <button onClick={() => setActiveTab("physical-test")} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                      🏃 Marks मोजा आणि नोंद Secव्ह करा
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#e2e8f0" }}>
                      <thead>
                        <tr style={{ background: "rgba(15, 23, 42, 0.8)", textAlign: "left", borderBottom: "2px solid #f97316" }}>
                          <th style={{ padding: "14px", fontSize: "0.9rem" }}>Date</th>
                          <th style={{ padding: "14px", fontSize: "0.9rem" }}>1600 mटर (वेळ व Marks)</th>
                          <th style={{ padding: "14px", fontSize: "0.9rem" }}>100 mटर (वेळ व Marks)</th>
                          <th style={{ padding: "14px", fontSize: "0.9rem" }}>Shot Put (Distance & Marks)</th>
                          <th style={{ padding: "14px", fontSize: "0.9rem", textAlign: "right" }}>Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fitnessLogs.map((log, idx) => {
                          const min = Math.floor((log.run_1600m_seconds || 300) / 60);
                          const sec = (log.run_1600m_seconds || 300) % 60;
                          const marks = getFitnessLogMarks(log);
                          return (
                            <tr key={log.id || log._id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                              <td style={{ padding: "14px", fontWeight: 600 }}>{log.date || log.created_at?.split("T")[0] || "Today"}</td>
                              <td style={{ padding: "14px" }}>
                                {min}Min {sec}Sec <br /><span style={{ color: "#fb923c", fontSize: "0.85rem" }}>({marks.score1600} Marks)</span>
                              </td>
                              <td style={{ padding: "14px" }}>
                                {log.run_100m_seconds || 12} Secकंद <br /><span style={{ color: "#fb923c", fontSize: "0.85rem" }}>({marks.score100} Marks)</span>
                              </td>
                              <td style={{ padding: "14px" }}>
                                {log.shot_put_meters || 8} mटर <br /><span style={{ color: "#fb923c", fontSize: "0.85rem" }}>({marks.scoreShot} Marks)</span>
                              </td>
                              <td style={{ padding: "14px", textAlign: "right" }}>
                                <span style={{ display: "inline-block", padding: "6px 14px", background: "rgba(249, 115, 22, 0.2)", color: "#fb923c", borderRadius: "100px", fontWeight: 800, fontSize: "1rem", border: "1px solid #f97316" }}>
                                  🎯 {marks.total} / 50
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* --- NOTE READER MODAL --- */}
      {selectedNote && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(10px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-card" style={{
            width: "100%",
            maxWidth: "800px",
            maxHeight: "85vh",
            overflowY: "auto",
            padding: "30px",
            position: "relative",
            border: "1px solid rgba(249, 115, 22, 0.5)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8)"
          }}>
            <button
              onClick={() => setSelectedNote(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "1.2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>

            <span className="badge badge-orange" style={{ marginBottom: "12px", display: "inline-block" }}>
              {selectedNote.category || "Study Material"}
            </span>
            <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "10px", lineHeight: "1.3" }}>
              {selectedNote.title}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "20px", fontStyle: "italic", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>
              {selectedNote.description}
            </p>

            <div style={{
              color: "#e2e8f0",
              fontSize: "1.05rem",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              background: "rgba(15, 23, 42, 0.6)",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              {selectedNote.content || "The detailed content of these notes will be updated soon."}
            </div>

            <div style={{ marginTop: "24px", textAlign: "right" }}>
              <button onClick={() => setSelectedNote(null)} className="btn btn-primary">
                ✓ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ULTRA-MODERN 2-COLUMN GLASSMORPHIC AUTH MODAL --- */}
      {showAuthModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.88)",
          backdropFilter: "blur(16px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          overflowY: "auto"
        }}>
          <div className="glass-card animate-scale-up" style={{
            width: "100%",
            maxWidth: "920px",
            padding: "0",
            position: "relative",
            border: "1px solid rgba(249, 115, 22, 0.4)",
            boxShadow: "0 0 80px rgba(249, 115, 22, 0.25), 0 30px 60px rgba(0, 0, 0, 0.95)",
            borderRadius: "28px",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
            display: "flex",
            flexWrap: "wrap",
            overflow: "hidden"
          }}>
            {/* Left Sidebar Panel - Branded Hero */}
            <div style={{
              flex: "1 1 350px",
              background: "linear-gradient(145deg, #1e3a8a 0%, #7c2d12 100%)",
              padding: "40px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div>
                <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(255, 255, 255, 0.15)", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: "20px", backdropFilter: "blur(5px)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                  🇮🇳 Global Police & Aptitude Tests Prep
                </div>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffffff", lineHeight: "1.2", marginBottom: "16px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                  EduSaaS <br /><span style={{ color: "#fb923c" }}>Study Portal</span>
                </h2>
                <p style={{ color: "#e2e8f0", fontSize: "1rem", lineHeight: "1.6", marginBottom: "30px" }}>
                  Compete with lakhs of students globally, check your scores, and achieve your dream job!
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🏆</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Global Leaderboard</div>
                      <div style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>See your name among the top students globally</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🏃</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Physical Fitness Calculator</div>
                      <div style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>Instantly calculate your physical test marks out of 50</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.25)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: "1.5rem" }}>⚡</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>100% Free Mock Exams</div>
                      <div style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>New tests daily based on TCS / IBPS pattern</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔒 Secure & Trusted • Trusted by 1 Lakh+ Students</span>
              </div>
            </div>

            {/* Right Form Panel - Sleek Modern UI */}
            <div style={{
              flex: "1 1 420px",
              padding: "40px 36px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "rgba(15, 23, 42, 0.6)"
            }}>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
              >
                ✕
              </button>

              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                  {authMode === "login" && "Welcome Back!"}
                  {authMode === "register" && "Free Registration (Create Account)"}
                  {authMode === "profile" && "My Profile (Edit Profile)"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                  {authMode === "login" && "Login to your account and start practicing."}
                  {authMode === "register" && "Complete your registration in just 1 minute and get on the leaderboard."}
                  {authMode === "profile" && "Keep your name and district updated for the leaderboard."}
                </p>
              </div>

              {/* Modal Tab Switcher (Sleek Modern Pills) */}
              {authMode !== "profile" && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "26px", background: "rgba(0, 0, 0, 0.4)", padding: "6px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("login"); setAuthError(""); }}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", border: "none", background: authMode === "login" ? "var(--primary-gradient)" : "transparent", color: "#fff", transition: "all 0.3s", boxShadow: authMode === "login" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none" }}
                  >
                    🔑 Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("register"); setAuthError(""); }}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", border: "none", background: authMode === "register" ? "var(--primary-gradient)" : "transparent", color: "#fff", transition: "all 0.3s", boxShadow: authMode === "register" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none" }}
                  >
                    📝 Register
                  </button>
                </div>
              )}

              {authError && (
                <div style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", padding: "12px 16px", borderRadius: "12px", color: "#fecaca", fontSize: "0.95rem", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              {authMode === "login" && (
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📧 Email Address:</label>
                    <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "1rem", transition: "border 0.2s" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>🔒 Password:</label>
                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "1rem", transition: "border 0.2s" }} />
                  </div>
                  <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", marginTop: "10px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px", boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)" }}>
                    {authLoading ? "Logging in..." : "🔑 Access Account (Login Now)"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: "12px", fontSize: "0.95rem", color: "#94a3b8" }}>
                    Don't have an account? <span onClick={() => { setAuthMode("register"); setAuthError(""); }} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>Create new free account ➡</span>
                  </div>
                </form>
              )}

              {authMode === "register" && (
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>👤 Full Name:</label>
                    <input type="text" required placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "0.95rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📧 Email Address:</label>
                    <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "0.95rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>🔒 Create Password:</label>
                    <input type="password" required placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "0.95rem" }} />
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 160px" }}>
                      <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📱 Mobile Number (Optional):</label>
                      <input type="tel" placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "0.95rem" }} />
                    </div>
                    <div style={{ flex: "1 1 160px" }}>
                      <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📍 District *:</label>
                      <input type="text" required placeholder="e.g. Pune" value={district} onChange={(e) => setDistrict(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "0.95rem" }} />
                    </div>
                  </div>
                  <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "8px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px", boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)" }}>
                    {authLoading ? "Registering..." : "✓ Register for Free (Register Now)"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: "10px", fontSize: "0.95rem", color: "#94a3b8" }}>
                    Already have an account? <span onClick={() => { setAuthMode("login"); setAuthError(""); }} style={{ color: "#fb923c", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>Login ➡</span>
                  </div>
                </form>
              )}

              {authMode === "profile" && currentUser && (
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>👤 Your Name:</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid #f97316", color: "#fff", fontSize: "1rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📱 Mobile Number (Optional):</label>
                    <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#fff", fontSize: "1rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>📍 Your District (For Leaderboard) *:</label>
                    <input type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid #f97316", color: "#fff", fontSize: "1rem" }} />
                  </div>
                  <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", marginTop: "10px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px" }}>
                    {authLoading ? "Updating..." : "✓ Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center", padding: "14px", color: "#ef4444", borderColor: "#ef4444", fontSize: "1.05rem", fontWeight: 700 }}
                  >
                    🚪 Logout
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mid-page Ad Placement */}
      <AdSlot type="infeed" title="Google AdSense In-Feed Responsive Banner" />

      {/* Exam Categories Overview Section */}
      <section style={{ margin: "60px 0 40px 0" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "24px", textAlign: "center" }}>
          🏆 Global Competitive Exams Prep (Exam Categories Overview)
        </h2>

        <div className="grid-2">
          {categories.map((cat) => (
            <div key={cat.slug} className="glass-card" style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "18px",
              borderLeft: `4px solid ${cat.colorTheme}`
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                flexShrink: 0
              }}>
                {cat.icon}
              </div>
              <div>
                <Link href={`/mock-test/${cat.slug}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "6px", transition: "var(--transition)" }} className="hover-orange">
                    {cat.name} ({cat.totalTests}+ सराव पेपर)
                  </h3>
                </Link>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 500 }}>
                  {cat.nameEn}
                </div>
                <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "14px" }}>
                  {cat.description}
                </p>
                <Link href={`/mock-test/${cat.slug}`} style={{ color: "#fb923c", fontWeight: 700, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Explore All Tests ➡</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Keyword & FAQ Section (Essential for Google #1 Ranking) */}
      <section id="faq-section" style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "40px 30px",
        margin: "60px 0 20px 0"
      }}>
        <h2 style={{ fontSize: "1.7rem", color: "#ffffff", marginBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "12px" }}>
          ❓ Frequently Asked Questions (FAQ)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", color: "#fb923c", marginBottom: "6px" }}>
              1. Which exams have free mock tests available on EduSaaS Web?
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }}>
              EduSaaS Web पोर्टलवर <strong>Global Competitive Exams (Police Bharti 2026), Aptitude Tests भरती (Talathi Bharti), MPSC राज्यSecवा व संयुक्त Exam, जिल्हा परिषद भरती (ZP Bharti), आरोग्य विभाग आणि नगर परिषद</strong> परीक्षेसाठी टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्ननुसार संपूर्ण मोफत ऑनलाइन Mock Exam उपलब्ध आहेत.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.15rem", color: "#fb923c", marginBottom: "6px" }}>
              2. Do I get the result and explanation immediately after solving the test?
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }}>
              होय! प्रत्येक टेस्ट सबMinट केल्याबरोबर तुम्हाला तुमचे एकूण प्राप्त Marks (Score), अचूकता (Accuracy percentage), बरोबर व चुकलेले Questions, तSecच प्रत्येक Questionsाचे <strong>सविस्तर उत्तर व स्पष्टीकरण (Detailed Explanations)</strong> स्क्रीनवर लगेच पाहायला Minळते.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.15rem", color: "#fb923c", marginBottom: "6px" }}>
              3. How is EduSaaS Web better and different from other portals?
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }}>
              EduSaaS Web पोर्टल हे आधुनिक वेब तंत्रज्ञानावर (Next.js SSR) आधारित असून येथे <strong>अतिशय वेगवान स्पीड (Zero Lag), टाइमरसह प्रत्यक्ष परीक्षेचा अनुभव (Exam Engine), स्टडी मटेरियल व नोट्स, मागील वर्षांच्या Questionsपत्रिका (PYQ), शारीरिक चाचणी ट्रॅकर (Physical Fitness Guide) आणि ग्लोबल टॉपर लीडरबोर्ड</strong> एकाच मंचावर पूर्णपणे मोफत उपलब्ध आहे.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 600px) {
          .hero-title {
            font-size: 1.8rem !important;
          }
        }
      `}</style>

      {/* Advanced SEO Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EduSaaS Web Portal",
              "url": "https://edusaasweb.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://edusaasweb.in/mock-test/{search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "EduSaaS Web",
              "url": "https://edusaasweb.in",
              "logo": "https://edusaasweb.in/logo.png",
              "sameAs": [
                "https://www.youtube.com/@edusaas",
                "https://t.me/edusaas"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "EduSaaS Web पोर्टलवर कोणकोणत्या परीक्षेसाठी मोफत Mock Test उपलब्ध आहेत?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "EduSaaS Web पोर्टलवर Global Competitive Exams, Aptitude Tests भरती, MPSC राज्यSecवा व संयुक्त Exam, जिल्हा परिषद भरती (ZP Bharti), आरोग्य विभाग आणि नगर परिषद परीक्षेसाठी टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्ननुसार संपूर्ण मोफत ऑनलाइन Mock Exam उपलब्ध आहेत."
                  }
                },
                {
                  "@type": "Question",
                  "name": "ऑनलाइन टेस्ट सोडवल्यानंतर निकाल व स्पष्टीकरण लगेच Minळते का?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! As soon as you submit the test, you will immediately see your total score, accuracy percentage, correct and incorrect questions, as well as detailed explanations for each question."
                  }
                }
              ]
            }
          ])
        }}
      />
    </div>
  );
}
