"use client";

import React, { useEffect, useState } from "react";
import { Dumbbell, PlusCircle, Trash2, Calendar, Award, CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";
import { API_BASE_URL, FitnessLog } from "@/services/api";

export default function PhysicalFitnessPage() {
  const [logs, setLogs] = useState<FitnessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [run1600Min, setRun1600Min] = useState<number | "">(5);
  const [run1600Sec, setRun1600Sec] = useState<number | "">(15);
  const [run100Sec, setRun100Sec] = useState<number | "">(11.8);
  const [shotPutMeters, setShotPutMeters] = useState<number | "">(8.5);
  const [notes, setNotes] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/fitness/${userId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status && Array.isArray(json.data)) {
          setLogs(json.data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch fitness logs:", e);
    }
    setIsLoading(false);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({ type: "error", text: "Please log in to track physical fitness." });
      setIsSubmitting(false);
      return;
    }

    const total1600Sec = (Number(run1600Min) || 0) * 60 + (Number(run1600Sec) || 0);

    const payload: FitnessLog = {
      user_id: userId,
      run_1600m_seconds: total1600Sec > 0 ? total1600Sec : undefined,
      run_100m_seconds: Number(run100Sec) || undefined,
      shot_put_meters: Number(shotPutMeters) || undefined,
      date: logDate,
      notes: notes,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/fitness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.status) {
        setMessage({ type: "success", text: "Fitness log saved successfully!" });
        setNotes("");
        fetchLogs();
      } else {
        setMessage({ type: "error", text: json.message || "Failed to save log." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (logId?: string) => {
    if (!logId) return;
    if (!confirm("Are you sure you want to delete this fitness record?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/fitness/${logId}`, { method: "DELETE" });
      if (res.ok) {
        setLogs((prev) => prev.filter((l) => (l.id || l._id) !== logId));
      }
    } catch (e) {
      console.error("Failed to delete log:", e);
    }
  };

  // Maharashtra Police Bharti Score Calculator Helper
  const calculateMarks = (run1600Sec?: number | null, run100Sec?: number | null, shotPut?: number | null) => {
    let score1600 = 0;
    if (run1600Sec) {
      if (run1600Sec <= 310) score1600 = 20; // <= 5 min 10 sec
      else if (run1600Sec <= 330) score1600 = 18;
      else if (run1600Sec <= 350) score1600 = 16;
      else if (run1600Sec <= 370) score1600 = 14;
      else score1600 = 10;
    }

    let score100 = 0;
    if (run100Sec) {
      if (run100Sec <= 11.5) score100 = 15;
      else if (run100Sec <= 12.5) score100 = 12;
      else if (run100Sec <= 13.5) score100 = 10;
      else score100 = 8;
    }

    let scoreShot = 0;
    if (shotPut) {
      if (shotPut >= 8.5) scoreShot = 15;
      else if (shotPut >= 7.9) scoreShot = 12;
      else if (shotPut >= 7.3) scoreShot = 10;
      else scoreShot = 6;
    }

    return { score1600, score100, scoreShot, total: score1600 + score100 + scoreShot };
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <Loader2 className="animate-spin" size={40} color="#2563eb" />
      </div>
    );
  }

  const latestLog = logs.length > 0 ? logs[0] : null;
  const latestMarks = latestLog
    ? calculateMarks(latestLog.run_1600m_seconds, latestLog.run_100m_seconds, latestLog.shot_put_meters)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Overview Card */}
      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "16px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Dumbbell size={24} color="#2563eb" /> Physical Fitness Tracker (मैदानी चाचणी)
          </h2>
          <span style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>
            Police Bharti Standards
          </span>
        </div>

        {/* Latest Performance Summary Cards */}
        {latestMarks ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(37,99,235,0.15)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1d4ed8" }}>1600m Run</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                {latestLog?.run_1600m_seconds ? `${Math.floor(latestLog.run_1600m_seconds / 60)}m ${latestLog.run_1600m_seconds % 60}s` : "N/A"}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb", marginTop: "4px" }}>
                Score: {latestMarks.score1600} / 20 Marks
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(16,185,129,0.15)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#15803d" }}>100m Sprint</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                {latestLog?.run_100m_seconds ? `${latestLog.run_100m_seconds}s` : "N/A"}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16a34a", marginTop: "4px" }}>
                Score: {latestMarks.score100} / 15 Marks
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(249,115,22,0.15)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#c2410c" }}>Shot Put (गोळा फेकी)</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                {latestLog?.shot_put_meters ? `${latestLog.shot_put_meters}m` : "N/A"}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ea580c", marginTop: "4px" }}>
                Score: {latestMarks.scoreShot} / 15 Marks
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(147,51,234,0.15)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7e22ce" }}>Total Physical Score</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#6b21a8", marginTop: "4px" }}>
                {latestMarks.total} / 50 Marks
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9333ea", marginTop: "4px" }}>
                {latestMarks.total >= 40 ? "🔥 Outstanding" : "💪 Keep Practicing"}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 20px", color: "#64748b", background: "rgba(0,0,0,0.02)", borderRadius: "16px", marginBottom: "24px" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No physical fitness records logged yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "4px", color: "#94a3b8" }}>Log your 1600m, 100m, and Shot Put scores below to track your Police Bharti physical marks!</p>
          </div>
        )}

        {/* Add New Fitness Log Form */}
        <div style={{ background: "rgba(0,0,0,0.02)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <PlusCircle size={18} color="#2563eb" /> Log New Test Run & Practice Score
          </h3>

          {message && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
              background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: message.type === "success" ? "#059669" : "#ef4444", fontWeight: 600, fontSize: "0.9rem"
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleAddLog} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>1600m Min</label>
              <input
                type="number"
                step="1"
                value={run1600Min}
                onChange={(e) => setRun1600Min(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="5"
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>1600m Sec</label>
              <input
                type="number"
                step="1"
                value={run1600Sec}
                onChange={(e) => setRun1600Sec(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="15"
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>100m Sec</label>
              <input
                type="number"
                step="0.1"
                value={run100Sec}
                onChange={(e) => setRun100Sec(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="11.8"
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Shot Put (Meters)</label>
              <input
                type="number"
                step="0.1"
                value={shotPutMeters}
                onChange={(e) => setShotPutMeters(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="8.5"
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Date</label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
              >
                {isSubmitting ? "Saving..." : "Save Physical Fitness Record"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* History Log Table */}
      {logs.length > 0 && (
        <div style={{ background: "#ffffff", borderRadius: "20px", padding: "28px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
            Fitness Logs History
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.06)", color: "#64748b" }}>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>1600m Time</th>
                  <th style={{ padding: "12px" }}>100m Time</th>
                  <th style={{ padding: "12px" }}>Shot Put</th>
                  <th style={{ padding: "12px" }}>Total Marks</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const m = calculateMarks(log.run_1600m_seconds, log.run_100m_seconds, log.shot_put_meters);
                  const logId = log.id || log._id;
                  return (
                    <tr key={logId} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600, color: "#0f172a" }}>{log.date || "N/A"}</td>
                      <td style={{ padding: "12px" }}>
                        {log.run_1600m_seconds ? `${Math.floor(log.run_1600m_seconds / 60)}m ${log.run_1600m_seconds % 60}s` : "-"}
                      </td>
                      <td style={{ padding: "12px" }}>{log.run_100m_seconds ? `${log.run_100m_seconds}s` : "-"}</td>
                      <td style={{ padding: "12px" }}>{log.shot_put_meters ? `${log.shot_put_meters}m` : "-"}</td>
                      <td style={{ padding: "12px", fontWeight: 800, color: "#2563eb" }}>{m.total} / 50</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDelete(logId)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
