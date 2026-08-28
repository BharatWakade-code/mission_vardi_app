"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, BarChart2, Loader2, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface QuizResultItem {
  id?: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  total: number;
  submittedAt: string;
  time_spent_seconds?: number;
}

export default function AnalyticsPage() {
  const [activities, setActivities] = useState<QuizResultItem[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<{ day: string; minutes: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealActivities();
  }, []);

  const fetchRealActivities = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch user quiz results
      const actRes = await fetch(`${API_BASE_URL}/quiz/user/my-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const actJson = await actRes.json();
      if (actJson.status && Array.isArray(actJson.data)) {
        setActivities(actJson.data);
      }

      // 2. Fetch weekly study breakdown if userId exists
      if (userId) {
        const profRes = await fetch(`${API_BASE_URL}/user/getProfile?user_id=${userId}`);
        if (profRes.ok) {
          const profJson = await profRes.json();
          if (profJson.status && profJson.data?.stats?.weekly_study_hours) {
            setWeeklyHours(profJson.data.stats.weekly_study_hours);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load real quiz results:", e);
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

  const totalTests = activities.length;
  const avgPercentage = totalTests > 0
    ? Math.round(activities.reduce((acc, curr) => acc + (curr.total > 0 ? (curr.score / curr.total) * 100 : 0), 0) / totalTests)
    : 0;

  return (
    <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
      
      {/* Title */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "14px" }}>
        <Activity size={22} color="#2563eb" /> Performance Analytics & Test History
      </h2>

      {activities.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(37, 99, 235, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <BarChart2 size={32} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
            No Test Results Found
          </h3>
          <p style={{ fontSize: "0.95rem", color: "#64748b", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            You haven't completed any mock tests yet. Take a test now to see your detailed performance breakdown and study graph!
          </p>
          <Link href="/mock-test" style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px",
            borderRadius: "12px", background: "#2563eb", color: "#ffffff", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)"
          }}>
            Explore Free Mock Tests <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        /* Analytics View */
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* Summary Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ background: "rgba(37, 99, 235, 0.04)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2563eb" }}>Tests Attempted</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{totalTests}</div>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.04)", padding: "18px", borderRadius: "16px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#059669" }}>Average Score Accuracy</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{avgPercentage}%</div>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>
              Recent Scores Breakdown
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "220px", padding: "20px 10px 10px 10px", background: "rgba(0,0,0,0.02)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)", overflowX: "auto" }}>
              {activities.slice(-15).map((act, idx) => {
                const percentage = act.total > 0 ? Math.round((act.score / act.total) * 100) : 0;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1", minWidth: "44px" }}>
                    <div style={{
                      width: "100%", maxWidth: "36px", height: `${Math.max(percentage, 8)}%`,
                      background: "linear-gradient(to top, #2563eb, #60a5fa)",
                      borderRadius: "8px 8px 0 0", position: "relative"
                    }}>
                      <div style={{ position: "absolute", top: "-22px", width: "100%", textAlign: "center", fontSize: "0.75rem", fontWeight: 800, color: "#2563eb" }}>
                        {percentage}%
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {new Date(act.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Attempt History Table */}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>
              Recent Test Attempts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activities.slice().reverse().map((act, idx) => {
                const perc = act.total > 0 ? Math.round((act.score / act.total) * 100) : 0;
                return (
                  <div key={idx} style={{
                    padding: "16px 20px", borderRadius: "14px", background: "#f8fafc",
                    border: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>{act.quiz_title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                        Submitted: {new Date(act.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: "1.15rem", color: perc >= 60 ? "#16a34a" : "#dc2626" }}>
                        {act.score} / {act.total} ({perc}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
