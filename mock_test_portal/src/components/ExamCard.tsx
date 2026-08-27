"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MockTest, getCategoryBySlug } from "@/data/mockTests";

interface ExamCardProps {
  test: MockTest;
}

export default function ExamCard({ test }: ExamCardProps) {
  const category = getCategoryBySlug(test.categorySlug);
  const icon = category?.icon || "📝";
  const themeColor = category?.colorTheme || "#2563eb";
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartTest = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push(`/mock-test/${test.categorySlug}/${test.testSlug}`);
  };

  return (
    <div className="glass-card animate-fade" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      borderTop: `4px solid ${themeColor}`
    }}>
      {/* Subtle Background Glow */}
      <div style={{
        position: "absolute",
        top: "-50px",
        right: "-50px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: themeColor,
        opacity: 0.12,
        filter: "blur(30px)",
        pointerEvents: "none"
      }} />

      <div>
        {/* Top Badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <span className="badge" style={{
            background: "rgba(0, 0, 0, 0.04)",
            color: "#475569",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>{icon}</span>
            <span>{test.categoryName}</span>
          </span>

          {test.badge && (
            <span className="badge badge-orange animate-pulse">
              {test.badge}
            </span>
          )}
        </div>

        {/* Test Title (Marathi & English) */}
        <h3 style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "8px",
          lineHeight: "1.4"
        }}>
          {test.title}
        </h3>
        <div style={{
          fontSize: "0.85rem",
          color: "#94a3b8",
          marginBottom: "20px",
          fontWeight: 500
        }}>
          {test.titleEn}
        </div>

        {/* Test Specs Grid (Questions, Marks, Time, Rating) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          background: "#ffffff",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid rgba(0, 0, 0, 0.02)",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>❓</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>एकूण प्रश्न</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>{test.totalQuestions} प्रश्न</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>🎯</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>एकूण गुण</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>{test.totalMarks} गुण</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>⏱️</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>वेळ (Duration)</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>{test.durationMinutes} मिनिटे</div>
            </div>
          </div>

          {/* 
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>⭐</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>विद्यार्थी रेटिंग</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fbbf24" }}>{test.rating} ({test.reviewsCount})</div>
            </div>
          </div>
          */}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
        <button
          onClick={handleStartTest}
          disabled={isNavigating}
          className="btn btn-primary"
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "0.95rem",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            opacity: isNavigating ? 0.7 : 1,
            cursor: isNavigating ? "wait" : "pointer"
          }}
        >
          {isNavigating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              लोड होत आहे...
            </>
          ) : (
            "⚡ टेस्ट सोडवा (Start Test Now)"
          )}
        </button>
      </div>
    </div>
  );
}
