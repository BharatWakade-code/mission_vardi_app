"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/services/api";
import { Loader2, Trash2, Upload, Plus, AlertCircle, LogOut, BookOpen, FileText, Trophy, ShieldCheck, Database } from "lucide-react";

export default function AdminMain() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (res.ok && json.status) {
        setIsAuthenticated(true);
      } else {
        alert(json.detail || json.message || "Invalid Admin Credentials!");
      }
    } catch (e) {
      alert("Network Error: Could not connect to API.");
    }
    setIsLoggingIn(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div className="glass-card" style={{ maxWidth: "400px", width: "100%", textAlign: "center", margin: "0 auto" }}>
          <ShieldCheck size={48} color="#f97316" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ marginBottom: "8px" }}>Admin Access</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>Please enter the secure admin credentials to continue.</p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input 
              type="text" 
              placeholder="Admin Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", color: "white" }}
              required
            />
            <input 
              type="password" 
              placeholder="Admin Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", color: "white" }}
              required
            />
            <button type="submit" disabled={isLoggingIn} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
              {isLoggingIn ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"quizzes" | "notes" | "pyqs" | "leaderboard" | "bulk">("quizzes");

  return (
    <div className="container" style={{ marginTop: "40px", paddingBottom: "60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "4px" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage all platform content centrally.</p>
        </div>
        <button onClick={onLogout} className="btn btn-outline" style={{ display: "flex", gap: "8px", alignItems: "center", padding: "8px 16px" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
        <TabButton active={activeTab === "quizzes"} onClick={() => setActiveTab("quizzes")} icon={<AlertCircle size={18}/>} text="Mock Tests (Quizzes)" />
        <TabButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")} icon={<BookOpen size={18}/>} text="Study Materials (Notes)" />
        <TabButton active={activeTab === "pyqs"} onClick={() => setActiveTab("pyqs")} icon={<FileText size={18}/>} text="PYQ Papers" />
        <TabButton active={activeTab === "leaderboard"} onClick={() => setActiveTab("leaderboard")} icon={<Trophy size={18}/>} text="Global Leaderboard" />
        <TabButton active={activeTab === "bulk"} onClick={() => setActiveTab("bulk")} icon={<Database size={18}/>} text="Bulk Import" />
      </div>

      {/* Tab Content */}
      {activeTab === "quizzes" && <QuizManager />}
      {activeTab === "notes" && <NotesManager />}
      {activeTab === "pyqs" && <PYQManager />}
      {activeTab === "leaderboard" && <LeaderboardViewer />}
      {activeTab === "bulk" && <BulkUploadManager />}
    </div>
  );
}

function TabButton({ active, onClick, icon, text }: { active: boolean, onClick: () => void, icon: React.ReactNode, text: string }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "12px 20px", borderRadius: "12px", fontWeight: 600,
        whiteSpace: "nowrap", transition: "0.2s",
        background: active ? "var(--primary-gradient)" : "rgba(15, 23, 42, 0.6)",
        color: active ? "#fff" : "var(--text-muted)",
        border: `1px solid ${active ? "transparent" : "var(--border-color)"}`,
        boxShadow: active ? "0 4px 15px rgba(249, 115, 22, 0.3)" : "none"
      }}
    >
      {icon} {text}
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
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <textarea required placeholder="Desc (Eng)" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)", minHeight:"60px" }} />
          <textarea placeholder="Desc (Mar)" value={descriptionMr} onChange={e=>setDescriptionMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)", minHeight:"60px" }} />
          <div className="grid-2">
            <input required type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Type (test/challenge)" value={type} onChange={e=>setType(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop:"8px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Questions Array (JSON)</span>
            <label style={{ cursor: "pointer", fontSize: "0.75rem", background: "var(--border-color)", padding: "4px 8px", borderRadius: "4px", display:"flex", alignItems:"center", gap:"4px" }}>
              <Upload size={12}/> Upload JSON <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
          <textarea required value={questionsJson} onChange={e=>setQuestionsJson(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", color: "#a78bfa", border:"1px solid var(--border-color)", minHeight:"120px", fontFamily:"monospace", fontSize:"0.8rem" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish Quiz"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "800px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage Quizzes</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map(item => (
            <div key={item.id} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
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
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <textarea required placeholder="Desc (Eng)" value={description} onChange={e=>setDescription(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)", minHeight:"50px" }} />
          <textarea placeholder="Desc (Mar)" value={descriptionMr} onChange={e=>setDescriptionMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)", minHeight:"50px" }} />
          <div className="grid-2">
            <input required type="text" placeholder="Category (e.g. Police)" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Subject (e.g. Math)" value={subject} onChange={e=>setSubject(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <input type="text" placeholder="PDF URL (Optional)" value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          <textarea placeholder="Text Content (Optional)" value={content} onChange={e=>setContent(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)", minHeight:"80px" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish Material"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "700px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage Materials</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map(item => (
            <div key={item.id} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
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
            <input required type="text" placeholder="Title (Eng)" value={title} onChange={e=>setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input type="text" placeholder="Title (Mar)" value={titleMr} onChange={e=>setTitleMr(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <div className="grid-2">
            <input required type="number" placeholder="Year (e.g. 2024)" value={year} onChange={e=>setYear(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
            <input required type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          </div>
          <input required type="url" placeholder="PDF Download URL" value={pdfUrl} onChange={e=>setPdfUrl(e.target.value)} style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", border:"1px solid var(--border-color)" }} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Publish PYQ"}</button>
        </form>
      </div>
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", maxHeight: "600px" }}>
        <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "16px" }}>Manage PYQs</h2>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {isFetching ? <Loader2 className="animate-spin mx-auto" /> : items.map(item => (
            <div key={item.id} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
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
