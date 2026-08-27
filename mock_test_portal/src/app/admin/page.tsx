"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/services/api";
import { Loader2, Trash2, Upload, Plus, AlertCircle, LogOut, BookOpen, FileText, Trophy, ShieldCheck, Database } from "lucide-react";

export default function AdminMain() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check if token exists in cookies on initial load
    if (document.cookie.includes('admin_token=')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (res.ok && json.status && json.data?.access_token) {
        // Save real JWT token to cookie
        document.cookie = `admin_token=${json.data.access_token}; max-age=172800; path=/; samesite=strict`;
        localStorage.setItem("admin_permissions", JSON.stringify(json.data.permissions || []));
        setIsAuthenticated(true);
      } else {
        setAuthError(json.detail || json.message || "अवैध लॉगिन क्रेडेन्शियल! (Invalid Credentials)");
      }
    } catch (e) {
      setAuthError("Network Error: Could not connect to API.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    document.cookie = "admin_token=; max-age=0; path=/";
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div className="glass-card animate-scale-up" style={{
          maxWidth: "450px",
          width: "100%",
          padding: "40px",
          textAlign: "center",
          borderRadius: "24px",
          border: "1px solid rgba(37, 99, 235, 0.15)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          background: "#ffffff"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "rgba(37, 99, 235, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <ShieldCheck size={40} color="#2563eb" />
          </div>
          
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Secure Admin Portal
          </h2>
          <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "28px" }}>
            Authentication required to access the dashboard.
          </p>
          
          {authError && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "12px 16px", borderRadius: "12px", color: "#ef4444", fontSize: "0.95rem", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div>
              <label style={{ display: "block", color: "#475569", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>👤 Username</label>
              <input 
                type="text" 
                placeholder="Enter Admin Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.04)", border: "1px solid rgba(0, 0, 0, 0.1)", color: "#0f172a", fontSize: "1rem", transition: "border 0.2s" }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#475569", fontSize: "0.9rem", fontWeight: 600, marginBottom: "6px" }}>🔒 Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(0, 0, 0, 0.04)", border: "1px solid rgba(0, 0, 0, 0.1)", color: "#0f172a", fontSize: "1rem", transition: "border 0.2s" }}
                required
              />
            </div>
            <button type="submit" disabled={isLoggingIn} className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.1rem", fontWeight: 800, borderRadius: "14px", marginTop: "8px", boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)" }}>
              {isLoggingIn ? "Verifying Credentials..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"quizzes" | "notes" | "pyqs" | "categories" | "leaderboard" | "bulk" | "payments">("quizzes");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("admin_permissions") || "[]");
      if (p.length === 0) {
        setPermissions(["manage_quizzes", "manage_notes", "manage_pyqs", "manage_categories", "manage_leaderboard", "manage_bulk", "manage_payments"]);
      } else {
        setPermissions(p);
      }
    } catch(e) {
      setPermissions(["manage_quizzes", "manage_notes", "manage_pyqs", "manage_categories", "manage_leaderboard", "manage_bulk", "manage_payments"]);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* SIDEBAR */}
      <aside style={{ 
        width: "260px", 
        backgroundColor: "#ffffff", 
        borderRight: "1px solid var(--border-color)",
        display: "flex", 
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>
        {/* Brand/Logo Area */}
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
            MH Mock<span style={{ color: "#2563eb" }}>Test</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {permissions.includes("manage_quizzes") && <SidebarItem active={activeTab === "quizzes"} onClick={() => setActiveTab("quizzes")} icon={<AlertCircle size={18}/>} text="Mock Tests" />}
          {permissions.includes("manage_notes") && <SidebarItem active={activeTab === "notes"} onClick={() => setActiveTab("notes")} icon={<BookOpen size={18}/>} text="Study Materials" />}
          {permissions.includes("manage_pyqs") && <SidebarItem active={activeTab === "pyqs"} onClick={() => setActiveTab("pyqs")} icon={<FileText size={18}/>} text="PYQ Papers" />}
          {permissions.includes("manage_categories") && <SidebarItem active={activeTab === "categories"} onClick={() => setActiveTab("categories")} icon={<Database size={18}/>} text="Categories" />}
          {permissions.includes("manage_leaderboard") && <SidebarItem active={activeTab === "leaderboard"} onClick={() => setActiveTab("leaderboard")} icon={<Trophy size={18}/>} text="Leaderboard" />}
          {permissions.includes("manage_bulk") && <SidebarItem active={activeTab === "bulk"} onClick={() => setActiveTab("bulk")} icon={<Database size={18}/>} text="Bulk Import" />}
          {permissions.includes("manage_payments") && <SidebarItem active={activeTab === "payments"} onClick={() => setActiveTab("payments")} icon={<Database size={18}/>} text="Payments" />}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: "20px 12px", borderTop: "1px solid var(--border-color)" }}>
          <button onClick={onLogout} style={{ 
            width: "100%", display: "flex", alignItems: "center", gap: "12px", 
            padding: "10px 16px", borderRadius: "8px", color: "#64748b",
            background: "transparent", border: "none", cursor: "pointer",
            fontWeight: 500, transition: "0.2s"
          }} onMouseOver={e => e.currentTarget.style.color = "#f87171"} onMouseOut={e => e.currentTarget.style.color = "#64748b"}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        
        {/* TOPBAR */}
        <header style={{ 
          height: "70px", backgroundColor: "#ffffff", borderBottom: "1px solid var(--border-color)",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px"
        }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", padding: "8px 16px", borderRadius: "8px", width: "300px" }}>
            <span style={{ color: "#94a3b8", marginRight: "8px" }}>🔍</span>
            <input type="text" placeholder="Search resources..." style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "#334155" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#475569" }}>
              A
            </div>
            <div style={{ fontSize: "0.9rem" }}>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>Admin User</div>
              <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Super Admin</div>
            </div>
          </div>
        </header>

        {/* DASHBOARD VIEWPORT */}
        <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
          {activeTab === "quizzes" && <QuizManager />}
          {activeTab === "notes" && <NotesManager />}
          {activeTab === "pyqs" && <PYQManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "leaderboard" && <LeaderboardViewer />}
          {activeTab === "bulk" && <BulkUploadManager />}
          {activeTab === "payments" && <PaymentsManager />}
        </div>

      </main>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, text }: { active: boolean, onClick: () => void, icon: React.ReactNode, text: string }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 16px", borderRadius: "8px", fontWeight: 500,
        transition: "all 0.2s", cursor: "pointer", border: "none",
        background: active ? "#f1f5f9" : "transparent",
        color: active ? "#0f172a" : "#64748b",
        position: "relative"
      }}
    >
      {icon} {text}
      {active && <div style={{ position: "absolute", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb" }} />}
    </button>
  );
}

// -----------------------------------------------------------------------------
// QUIZ MANAGER
// -----------------------------------------------------------------------------
function QuizManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [titleMr, setTitleMr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionMr, setDescriptionMr] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [questionsJson, setQuestionsJson] = useState("");

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/quiz`);
      const json = await res.json();
      if (json.status) setItems(json.data || []);
    } catch (e) { console.error(e); }
    setIsFetching(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/quiz/${id}`, { method: "DELETE" });
      if (res.ok) { alert("Deleted!"); loadItems(); }
    } catch (e) { console.error(e); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        JSON.parse(content);
        setQuestionsJson(content);
        setMessage({ type: "success", text: "JSON loaded successfully!" });
      } catch (err) {
        setMessage({ type: "error", text: "Invalid JSON format." });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage(null);
    try {
      let questionsList = questionsJson.trim() ? JSON.parse(questionsJson) : [];
      const body = { title, title_mr: titleMr||null, description, description_mr: descriptionMr||null, category, type, questions: questionsList };
      const res = await fetch(`${API_BASE_URL}/quiz`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (res.ok && json.status) {
        setMessage({ type: "success", text: "Quiz created!" });
        setTitle(""); setTitleMr(""); setDescription(""); setDescriptionMr(""); setCategory(""); setType(""); setQuestionsJson("");
        loadItems();
      } else { setMessage({ type: "error", text: json.message || "Failed to create." }); }
    } catch (err) { setMessage({ type: "error", text: "Invalid JSON or Error" }); }
    setIsSubmitting(false);
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}><Plus size={20} style={{ display:"inline", marginRight:"8px", verticalAlign:"middle" }}/> Create Quiz</h2>
        {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom:"16px", background: message.type==="success"?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)", color: message.type==="success"?"#34d399":"#f87171" }}>{message.text}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="grid-2">
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <textarea required placeholder="Desc (Eng)" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"60px" }} />
          <textarea placeholder="Desc (Mar)" value={descriptionMr} onChange={e=>setDescriptionMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"60px" }} />
          <div className="grid-2">
            <input required type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Type (test/challenge)" value={type} onChange={e=>setType(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop:"8px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Questions Array (JSON)</span>
            <label style={{ cursor: "pointer", fontSize: "0.75rem", background: "var(--border-color)", padding: "4px 8px", borderRadius: "4px", display:"flex", alignItems:"center", gap:"4px" }}>
              <Upload size={12}/> Upload JSON <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
          <textarea required value={questionsJson} onChange={e=>setQuestionsJson(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"120px", fontFamily:"monospace", fontSize:"0.8rem" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish Quiz"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "800px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage Quizzes</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map((item, idx) => (
            <div key={item.id || item.title || idx} style={{ padding: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>{item.title}</h4>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop:"4px" }}>{item.category} • {item.totalQuestions || 0} Qs</div>
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "8px", padding:"8px", cursor:"pointer" }}><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// NOTES MANAGER
// -----------------------------------------------------------------------------
function NotesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  // Form
  const [title, setTitle] = useState(""); const [titleMr, setTitleMr] = useState("");
  const [description, setDescription] = useState(""); const [descriptionMr, setDescriptionMr] = useState("");
  const [category, setCategory] = useState(""); const [subject, setSubject] = useState("");
  const [pdfUrl, setPdfUrl] = useState(""); const [content, setContent] = useState("");
  
  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setIsFetching(true);
    try { const res = await fetch(`${API_BASE_URL}/notes`); const json = await res.json(); if (json.status) setItems(json.data || []); } catch (e) {}
    setIsFetching(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try { const res = await fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE" }); if (res.ok) loadItems(); } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setMessage(null);
    try {
      const body = { title, title_mr: titleMr||null, description, description_mr: descriptionMr||null, category, subject, pdfUrl: pdfUrl||null, content: content||null, content_mr: null };
      const res = await fetch(`${API_BASE_URL}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        setMessage({ type: "success", text: "Note created!" });
        setTitle(""); setTitleMr(""); setDescription(""); setDescriptionMr(""); setCategory(""); setSubject(""); setPdfUrl(""); setContent("");
        loadItems();
      } else setMessage({ type: "error", text: "Failed to create." });
    } catch (err) { setMessage({ type: "error", text: "Network Error" }); }
    setIsSubmitting(false);
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}><Plus size={20} style={{ display:"inline", marginRight:"8px", verticalAlign:"middle" }}/> Create Study Material</h2>
        {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom:"16px", background: message.type==="success"?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)", color: message.type==="success"?"#34d399":"#f87171" }}>{message.text}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="grid-2">
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <textarea required placeholder="Desc (Eng)" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"50px" }} />
          <textarea placeholder="Desc (Mar)" value={descriptionMr} onChange={e=>setDescriptionMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"50px" }} />
          <div className="grid-2">
            <input required type="text" placeholder="Category (e.g. Police)" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Subject (e.g. Math)" value={subject} onChange={e=>setSubject(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <input type="text" placeholder="PDF URL (Optional)" value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          <textarea placeholder="Text Content (Optional)" value={content} onChange={e=>setContent(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)", minHeight:"80px" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish Material"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "700px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage Materials</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map((item, idx) => (
            <div key={item.id || item.title || idx} style={{ padding: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>{item.title}</h4>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop:"4px" }}>{item.category} • {item.subject}</div>
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "8px", padding:"8px", cursor:"pointer" }}><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PYQ MANAGER
// -----------------------------------------------------------------------------
function PYQManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  // Form
  const [title, setTitle] = useState(""); const [titleMr, setTitleMr] = useState("");
  const [year, setYear] = useState(""); const [category, setCategory] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  
  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setIsFetching(true);
    try { const res = await fetch(`${API_BASE_URL}/pyqs`); const json = await res.json(); if (json.status) setItems(json.data || []); } catch (e) {}
    setIsFetching(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this PYQ?")) return;
    try { const res = await fetch(`${API_BASE_URL}/pyqs/${id}`, { method: "DELETE" }); if (res.ok) loadItems(); } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setMessage(null);
    try {
      const body = { title, title_mr: titleMr||null, year: parseInt(year)||new Date().getFullYear(), category, pdfUrl };
      const res = await fetch(`${API_BASE_URL}/pyqs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        setMessage({ type: "success", text: "PYQ created!" });
        setTitle(""); setTitleMr(""); setYear(""); setCategory(""); setPdfUrl("");
        loadItems();
      } else setMessage({ type: "error", text: "Failed to create." });
    } catch (err) { setMessage({ type: "error", text: "Network Error" }); }
    setIsSubmitting(false);
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}><Plus size={20} style={{ display:"inline", marginRight:"8px", verticalAlign:"middle" }}/> Create PYQ</h2>
        {message && <div style={{ padding: "12px", borderRadius: "8px", marginBottom:"16px", background: message.type==="success"?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)", color: message.type==="success"?"#34d399":"#f87171" }}>{message.text}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="grid-2">
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <div className="grid-2">
            <input required type="number" placeholder="Year (e.g. 2024)" value={year} onChange={e=>setYear(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          </div>
          <input required type="url" placeholder="PDF Download URL" value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-main)", border:"1px solid var(--border-color)" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish PYQ"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "600px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage PYQs</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map((item, idx) => (
            <div key={item.id || item.title || idx} style={{ padding: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>{item.title}</h4>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop:"4px" }}>{item.year} • {item.category}</div>
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "8px", padding:"8px", cursor:"pointer" }}><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// BULK UPLOAD MANAGER
// -----------------------------------------------------------------------------
function BulkUploadManager() {
  const [entityType, setEntityType] = useState<"quiz" | "notes" | "pyqs">("quiz");
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          setMessage({ type: "error", text: "Invalid JSON format. Expected an array of objects." });
          setFileData(null);
          return;
        }
        setFileData(parsed);
        setMessage({ type: "success", text: `Successfully loaded ${parsed.length} items from JSON.` });
      } catch (err) {
        setMessage({ type: "error", text: "Invalid JSON file. Please check the syntax." });
        setFileData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!fileData || fileData.length === 0) return;
    if (!confirm(`Are you sure you want to upload ${fileData.length} ${entityType}(s)?`)) return;

    setIsUploading(true);
    setMessage(null);
    setProgress({ current: 0, total: fileData.length, success: 0, failed: 0 });

    let successCount = 0;
    let failCount = 0;

    // Upload sequentially to avoid rate limits or overwhelming the backend
    for (let i = 0; i < fileData.length; i++) {
      const item = fileData[i];
      try {
        // Fallback generic body matching
        let body = item; 
        
        // Ensure defaults if not present
        if (entityType === "quiz") {
          body = {
            title: item.title || item.title_mr || `Bulk Quiz ${i}`,
            title_mr: item.title_mr || null,
            description: item.description || "Bulk uploaded quiz",
            description_mr: item.description_mr || null,
            category: item.category || "General",
            type: item.type || "test",
            questions: Array.isArray(item.questions) ? item.questions : []
          };
        } else if (entityType === "notes") {
          body = {
            title: item.title || `Bulk Note ${i}`,
            title_mr: item.title_mr || null,
            description: item.description || "Bulk uploaded note",
            description_mr: item.description_mr || null,
            category: item.category || "General",
            subject: item.subject || "General",
            pdfUrl: item.pdfUrl || null,
            content: item.content || null
          };
        } else if (entityType === "pyqs") {
          body = {
            title: item.title || `Bulk PYQ ${i}`,
            title_mr: item.title_mr || null,
            year: item.year ? parseInt(item.year) : new Date().getFullYear(),
            category: item.category || "General",
            pdfUrl: item.pdfUrl || ""
          };
        }

        const res = await fetch(`${API_BASE_URL}/${entityType}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
      
      setProgress({ current: i + 1, total: fileData.length, success: successCount, failed: failCount });
    }

    setIsUploading(false);
    setMessage({ 
      type: failCount === 0 ? "success" : "error", 
      text: `Bulk upload completed. Success: ${successCount}, Failed: ${failCount}` 
    });
    if (failCount === 0) {
      setFileData(null); // Clear on full success
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "20px" }}>
        <Database size={24} style={{ display: "inline", marginRight: "10px", verticalAlign: "middle", color: "#f97316" }} />
        Bulk Data Importer
      </h2>

      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
        Upload a JSON file containing an array of records to rapidly import hundreds of tests, notes, or PYQs into your live database.
      </p>

      {message && (
        <div style={{
          padding: "16px", borderRadius: "8px", marginBottom: "24px",
          background: message.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: message.type === "success" ? "#34d399" : "#f87171",
          border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>
            1. Select Destination Entity
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            {["quiz", "notes", "pyqs"].map((type) => (
              <button
                key={type}
                onClick={() => setEntityType(type as any)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  background: entityType === type ? "var(--primary-gradient)" : "rgba(0,0,0,0.3)",
                  color: entityType === type ? "white" : "var(--text-muted)",
                  border: `1px solid ${entityType === type ? "transparent" : "var(--border-color)"}`,
                  cursor: "pointer",
                  transition: "0.2s"
                }}
              >
                {type === "quiz" ? "Mock Tests" : type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>
            2. Upload JSON File (Must be a JSON Array `[...]`)
          </label>
          <label style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "40px", borderRadius: "12px", border: "2px dashed var(--border-color)",
            background: "rgba(0,0,0,0.2)", cursor: "pointer", transition: "0.2s"
          }}>
            <Upload size={32} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <span style={{ color: "white", fontWeight: 600 }}>Click to browse or drag JSON file here</span>
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>

        {fileData && (
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ color: "#60a5fa", marginBottom: "8px" }}>Data Preview</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Detected <strong>{fileData.length}</strong> items to import into <strong>{entityType}</strong> database.
            </p>
            <pre style={{ 
              background: "rgba(0,0,0,0.5)", padding: "12px", borderRadius: "6px", marginTop: "12px",
              maxHeight: "150px", overflowY: "auto", fontSize: "0.8rem", color: "#a78bfa"
            }}>
              {JSON.stringify(fileData.slice(0, 2), null, 2)}
              {fileData.length > 2 ? "\n\n... and " + (fileData.length - 2) + " more items" : ""}
            </pre>
          </div>
        )}

        {isUploading && (
          <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#34d399", fontWeight: 600 }}>Uploading... {Math.round((progress.current / progress.total) * 100)}%</span>
              <span style={{ color: "var(--text-muted)" }}>{progress.current} / {progress.total}</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.3)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(progress.current / progress.total) * 100}%`, height: "100%", background: "var(--success-gradient)", transition: "0.3s" }}></div>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "0.85rem" }}>
              <span style={{ color: "#34d399" }}>Success: {progress.success}</span>
              <span style={{ color: "#f87171" }}>Failed: {progress.failed}</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleBulkUpload} 
          disabled={!fileData || isUploading}
          className="btn btn-primary" 
          style={{ padding: "16px", opacity: (!fileData || isUploading) ? 0.5 : 1, cursor: (!fileData || isUploading) ? "not-allowed" : "pointer" }}
        >
          {isUploading ? <><Loader2 className="animate-spin" /> Processing Bulk Upload...</> : `Confirm & Upload ${fileData?.length || 0} Items`}
        </button>
      </div>
    </div>
  );
}
function LeaderboardViewer() {
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setIsFetching(true);
    try { const res = await fetch(`${API_BASE_URL}/leaderboard/global?limit=50`); const json = await res.json(); if (json.status) setItems(json.data || []); } catch (e) {}
    setIsFetching(false);
  };

  return (
    <div className="glass-card">
      <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Global Leaderboard Overview</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize:"0.9rem" }}>Note: The leaderboard is dynamically generated based on user scores. This view is read-only.</p>
      <div style={{ overflowY: "auto", maxHeight: "600px", paddingRight: "8px" }}>
        {isFetching ? <Loader2 className="animate-spin mx-auto" /> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.3)", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)" }}>Rank</th>
                <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)" }}>Student Name</th>
                <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)" }}>District</th>
                <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "12px" }}>#{index + 1}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{item.name}</td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>{item.district || "-"}</td>
                  <td style={{ padding: "12px", color: "#fb923c", fontWeight: "bold" }}>{item.points}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} style={{ textAlign:"center", padding:"20px" }}>No ranking data yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// CATEGORIES MANAGER
// -----------------------------------------------------------------------------
function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/category`);
      const json = await res.json();
      if (json.status) setCategories(json.data || []);
    } catch (e) { console.error(e); }
    setIsFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      let res;
      if (editId) {
        res = await fetch(`${API_BASE_URL}/category/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, isActive })
        });
      } else {
        res = await fetch(`${API_BASE_URL}/category/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, isActive })
        });
      }
      const json = await res.json();
      if (res.ok && json.status) {
        setMessage({ type: "success", text: editId ? "Category updated!" : "Category created!" });
        setEditId(null);
        setName("");
        setDescription("");
        setIsActive(true);
        loadCategories();
      } else {
        setMessage({ type: "error", text: json.detail || "Failed to save category." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network Error" });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/category/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadCategories();
      }
    } catch (e) { console.error(e); }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsActive(cat.isActive !== false);
  };

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
      <div className="glass-card" style={{ flex: "1 1 400px" }}>
        <h2 style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
          {editId ? "✏️ Edit Category" : "➕ Add New Category"}
        </h2>
        
        {message && (
          <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: message.type === "success" ? "#10b981" : "#ef4444", border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}` }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "0.9rem", fontWeight: 600 }}>Category Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} placeholder="e.g., Police Bharti" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "0.9rem", fontWeight: 600 }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} placeholder="Short description about this category..." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            <label htmlFor="isActive" style={{ color: "var(--text-main)", fontWeight: 600, cursor: "pointer" }}>Show this Category on Website</label>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, padding: "12px" }}>
              {isSubmitting ? "Processing..." : (editId ? "Update Category" : "Create Category")}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setName(""); setDescription(""); setIsActive(true); }} className="btn" style={{ padding: "12px", background: "rgba(0,0,0,0.1)", color: "var(--text-main)" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ flex: "1 1 500px" }}>
        <h2 style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>🗂️ Existing Categories</h2>
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto my-8" /> : (
            categories.length === 0 ? <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No categories found.</p> :
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map(cat => (
                <div key={cat.id || cat.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      {cat.name} 
                      {!cat.isActive && <span style={{ fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "2px 8px", borderRadius: "100px" }}>Hidden</span>}
                    </h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>{cat.description || "No description"}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleEdit(cat)} style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(37,99,235,0.1)", color: "#2563eb", border: "none", cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)} style={{ padding: "8px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", cursor: "pointer" }}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PAYMENTS MANAGER
// -----------------------------------------------------------------------------
function PaymentsManager() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => { loadPayments(); }, []);

  const loadPayments = async () => {
    setIsFetching(true);
    try {
      const token = document.cookie.split('admin_token=')[1]?.split(';')[0];
      const res = await fetch(`${API_BASE_URL}/payment/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.status) setPayments(json.data || []);
    } catch (e) { console.error(e); }
    setIsFetching(false);
  };

  return (
    <div className="glass-card">
      <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>💳 Payment History</h2>
      <div style={{ overflowY: "auto", maxHeight: "600px", paddingRight: "8px" }}>
        {isFetching ? <Loader2 className="animate-spin mx-auto" /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {payments.map((p, idx) => (
              <div key={idx} style={{ padding: "16px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: "bold", fontSize: "1.2rem" }}>
                    ₹
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", marginBottom: "2px" }}>{p.user_name || p.user_id}</h4>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(p.timestamp).toLocaleString()} • {p.plan}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px", fontFamily: "monospace" }}>TXN: {p.payment_id || p.order_id}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#16a34a", marginBottom: "6px" }}>₹{p.amount}</div>
                  <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, background: p.status === "SUCCESS" ? "#dcfce7" : "#fee2e2", color: p.status === "SUCCESS" ? "#16a34a" : "#ef4444" }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
            {payments.length === 0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--text-muted)" }}>No payment records found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
