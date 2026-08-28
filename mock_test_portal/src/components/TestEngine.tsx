"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, CheckCircle2, XCircle, AlertCircle, Bookmark, ChevronLeft, ChevronRight, 
  RotateCcw, Home, Award, Sparkles, HelpCircle, FileText, Check, X, Send
} from "lucide-react";
import { MockTest, Question } from "@/data/mockTests";
import { submitLiveQuizResult } from "@/services/api";
import AdSlot from "@/components/AdSlot";

interface TestEngineProps {
  test: MockTest;
}

type QuestionStatus = "unvisited" | "unanswered" | "answered" | "marked";

export default function TestEngine({ test }: TestEngineProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>((test.durationMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const currentQuestion = test.questions?.[currentIdx] || test.questions?.[0];

  // Initialize status on mount
  useEffect(() => {
    if (!test.questions) return;
    const initialStatus: Record<number, QuestionStatus> = {};
    test.questions.forEach((q) => {
      initialStatus[q.id] = "unvisited";
    });
    if (test.questions[0]) {
      initialStatus[test.questions[0].id] = "unanswered";
    }
    setQuestionStatuses(initialStatus);
  }, [test]);

  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) {
      if (timeRemaining <= 0 && !isSubmitted) {
        handleSubmitTest();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Format Timer MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (qId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [qId]: optionIdx }));
    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: prev[qId] === "marked" ? "marked" : "answered",
    }));
  };

  const handleNavigateQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= test.questions.length) return;
    const targetQId = test.questions[targetIdx].id;

    setQuestionStatuses((prev) => {
      const copy = { ...prev };
      if (copy[currentQuestion.id] === "unvisited") {
        copy[currentQuestion.id] = selectedOptions[currentQuestion.id] !== undefined ? "answered" : "unanswered";
      }
      if (copy[targetQId] === "unvisited") {
        copy[targetQId] = "unanswered";
      }
      return copy;
    });

    setCurrentIdx(targetIdx);
  };

  const handleMarkForReview = () => {
    setQuestionStatuses((prev) => ({ ...prev, [currentQuestion.id]: "marked" }));
    if (currentIdx < test.questions.length - 1) {
      handleNavigateQuestion(currentIdx + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (selectedOptions[currentQuestion.id] !== undefined) {
      setQuestionStatuses((prev) => ({ ...prev, [currentQuestion.id]: "answered" }));
    } else {
      setQuestionStatuses((prev) => ({ ...prev, [currentQuestion.id]: "unanswered" }));
    }
    if (currentIdx < test.questions.length - 1) {
      handleNavigateQuestion(currentIdx + 1);
    }
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const res = calculateResults();
    const duration = test.durationMinutes || 15;
    const timeSpent = duration * 60 - timeRemaining;
    submitLiveQuizResult(test.id, res.score, test.totalMarks || (test.questions.length * 2), timeSpent > 0 ? timeSpent : 0);
  };

  const calculateResults = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let score = 0;
    const totalMarks = test.totalMarks || (test.questions.length * 2);

    test.questions.forEach((q) => {
      const userAns = selectedOptions[q.id];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.correctOptionIndex) {
        correctCount++;
        score += q.marks || 2;
      } else {
        incorrectCount++;
      }
    });

    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    return { correctCount, incorrectCount, unattemptedCount, score, totalMarks, accuracy, percentage };
  };

  // Counting Question Statuses
  const answeredCount = Object.values(questionStatuses).filter(s => s === "answered").length;
  const unansweredCount = Object.values(questionStatuses).filter(s => s === "unanswered").length;
  const markedCount = Object.values(questionStatuses).filter(s => s === "marked").length;
  const unvisitedCount = test.questions.length - (answeredCount + unansweredCount + markedCount);

  // --- POST-TEST RESULT SCORECARD & SOLUTION REVIEW ---
  if (isSubmitted) {
    const res = calculateResults();
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 80px 20px" }}>
        
        {/* Scorecard Hero Card */}
        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px 32px",
          textAlign: "center",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 20px 50px -10px rgba(0,0,0,0.06)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "350px", height: "180px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <Award size={36} color="#059669" />
          </div>

          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
            परीक्षा निकाल व अचूक स्पष्टीकरण (Test Result & Scorecard)
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "32px" }}>
            {test.title} • {test.categoryName || "Daily Challenge"}
          </p>

          {/* Metrics Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            maxWidth: "900px",
            margin: "0 auto 32px auto"
          }}>
            <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#059669", marginBottom: "4px" }}>एकूण प्राप्त गुण (Score)</div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a" }}>
                {res.score} <span style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: 600 }}>/ {res.totalMarks}</span>
              </div>
            </div>

            <div style={{ background: "rgba(37, 99, 235, 0.05)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2563eb", marginBottom: "4px" }}>अचूकता (Accuracy %)</div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#2563eb" }}>
                {res.accuracy}%
              </div>
            </div>

            <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a", marginBottom: "4px" }}>बरोबर उत्तरे (Correct)</div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#16a34a" }}>
                {res.correctCount}
              </div>
            </div>

            <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "20px", borderRadius: "18px", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "4px" }}>चुकलेली उत्तरे (Incorrect)</div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#ef4444" }}>
                {res.incorrectCount}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setSelectedOptions({});
                setIsSubmitted(false);
                setTimeRemaining((test.durationMinutes || 15) * 60);
                setCurrentIdx(0);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px",
                borderRadius: "12px", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)"
              }}
            >
              <RotateCcw size={18} /> पुन्हा टेस्ट सोडवा (Re-attempt Test)
            </button>
            <Link
              href="/profile"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px",
                borderRadius: "12px", background: "#f1f5f9", color: "#334155", fontWeight: 700,
                textDecoration: "none", border: "1px solid rgba(0,0,0,0.06)"
              }}
            >
              <Home size={18} /> माझ्या प्रोफाइलवर जा (View My Analytics)
            </Link>
          </div>
        </div>

        {/* Ad Placement */}
        <AdSlot type="leaderboard" title="Google AdSense Banner - High RPM Education Placement" />

        {/* Detailed Solutions Review */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Sparkles size={22} color="#2563eb" /> सर्व प्रश्नांची अचूक उत्तरे व सविस्तर स्पष्टीकरण (Detailed Solutions)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {test.questions.map((q, idx) => {
            const userAns = selectedOptions[q.id];
            const isCorrect = userAns === q.correctOptionIndex;
            const isUnattempted = userAns === undefined;

            return (
              <div key={q.id} style={{
                background: "#ffffff", borderRadius: "18px", padding: "28px",
                border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
                borderLeft: `5px solid ${isCorrect ? "#10b981" : isUnattempted ? "#94a3b8" : "#ef4444"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ fontWeight: 800, color: "#2563eb", background: "rgba(37,99,235,0.08)", padding: "4px 12px", borderRadius: "8px", fontSize: "0.85rem" }}>
                    प्रश्न {idx + 1}
                  </span>
                  <div>
                    {isCorrect && <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>✓ बरोबर उत्तर (Correct) +{q.marks || 2} गुण</span>}
                    {isUnattempted && <span style={{ background: "#f1f5f9", color: "#64748b", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>⚠ सोडवला नाही (Unattempted)</span>}
                    {!isCorrect && !isUnattempted && <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>✕ चुकलेले उत्तर (Incorrect)</span>}
                  </div>
                </div>

                <h3 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "6px", lineHeight: "1.5", fontWeight: 700 }}>
                  {q.questionText}
                </h3>
                {q.questionTextEn && (
                  <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "18px" }}>{q.questionTextEn}</p>
                )}

                {/* Options List */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                  {q.options.map((opt, oIdx) => {
                    const isTheCorrectAns = oIdx === q.correctOptionIndex;
                    const isUserAns = oIdx === userAns;

                    let bgStyle = "#f8fafc";
                    let borderStyle = "1px solid rgba(0,0,0,0.05)";
                    let textCol = "#475569";

                    if (isTheCorrectAns) {
                      bgStyle = "#dcfce7";
                      borderStyle = "1px solid #86efac";
                      textCol = "#15803d";
                    } else if (isUserAns && !isTheCorrectAns) {
                      bgStyle = "#fee2e2";
                      borderStyle = "1px solid #fca5a5";
                      textCol = "#b91c1c";
                    }

                    return (
                      <div key={oIdx} style={{
                        padding: "12px 16px", borderRadius: "12px", background: bgStyle,
                        border: borderStyle, color: textCol, fontWeight: isTheCorrectAns || isUserAns ? 700 : 500,
                        display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem"
                      }}>
                        <span style={{ width: "26px", height: "26px", borderRadius: "6px", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800 }}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isTheCorrectAns && <Check size={18} color="#15803d" />}
                        {isUserAns && !isTheCorrectAns && <X size={18} color="#b91c1c" />}
                      </div>
                    );
                  })}
                </div>

                {/* Solution Explanation Box */}
                {q.explanation && (
                  <div style={{ background: "rgba(37, 99, 235, 0.04)", border: "1px solid rgba(37, 99, 235, 0.15)", borderRadius: "14px", padding: "16px", color: "#334155", fontSize: "0.95rem", lineHeight: "1.6" }}>
                    <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>💡 सविस्तर स्पष्टीकरण (Solution):</span>
                    </div>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ TEST TAKING MODE ---
  const isTimeLow = timeRemaining <= 300;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      
      {/* Top Test Header Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "20px 28px",
        marginBottom: "24px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>
            {test.categoryName || "Daily Challenge"} • TCS Pattern Test
          </span>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "6px 0 0 0" }}>
            {test.title}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Live Countdown Timer Pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: isTimeLow ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
            border: `1px solid ${isTimeLow ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
            padding: "8px 18px", borderRadius: "12px",
            color: isTimeLow ? "#ef4444" : "#059669", fontWeight: 800, fontSize: "1.1rem"
          }}>
            <Clock size={18} className={isTimeLow ? "animate-pulse" : ""} />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            style={{
              padding: "10px 22px", borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.3)", fontSize: "0.95rem",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            <Send size={16} /> सबमिट करा (Submit)
          </button>
        </div>
      </div>

      {/* Main 2-Column Quiz Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }} className="quiz-grid">
        
        {/* Left Column: Active Question Card */}
        <div style={{
          background: "#ffffff", borderRadius: "20px", padding: "32px",
          border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
          minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            {/* Question Top Specs Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: "#2563eb", color: "#ffffff", fontWeight: 800, fontSize: "0.9rem", padding: "4px 12px", borderRadius: "8px" }}>
                  प्रश्न {currentIdx + 1} / {test.questions.length}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                  +{currentQuestion.marks || 2} गुण (Marks)
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                🎯 नकारात्क गुण नाही (No Negative Marks)
              </span>
            </div>

            {/* Question Text */}
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px", lineHeight: "1.5" }}>
              {currentQuestion.questionText}
            </h2>
            {currentQuestion.questionTextEn && (
              <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "24px" }}>
                {currentQuestion.questionTextEn}
              </p>
            )}

            {/* Option Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOptions[currentQuestion.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionSelect(currentQuestion.id, oIdx)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "14px",
                      background: isSelected ? "rgba(37, 99, 235, 0.08)" : "#ffffff",
                      border: isSelected ? "2px solid #2563eb" : "1px solid rgba(0,0,0,0.08)",
                      color: isSelected ? "#0f172a" : "#475569",
                      fontSize: "1rem",
                      fontWeight: isSelected ? 700 : 500,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      transition: "all 0.2s"
                    }}
                  >
                    <span style={{
                      width: "32px", height: "32px", borderRadius: "10px",
                      background: isSelected ? "#2563eb" : "rgba(0,0,0,0.04)",
                      color: isSelected ? "#ffffff" : "#64748b",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.9rem", fontWeight: 800
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isSelected && <CheckCircle2 size={20} color="#2563eb" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Buttons Bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: "36px", paddingTop: "20px", borderTop: "1px solid rgba(0,0,0,0.06)", flexWrap: "wrap", gap: "12px"
          }}>
            <button
              onClick={() => handleNavigateQuestion(currentIdx - 1)}
              disabled={currentIdx === 0}
              style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "12px 18px",
                borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff",
                color: currentIdx === 0 ? "#cbd5e1" : "#475569", fontWeight: 600, fontSize: "0.9rem",
                cursor: currentIdx === 0 ? "not-allowed" : "pointer"
              }}
            >
              <ChevronLeft size={18} /> मागील प्रश्न
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleMarkForReview}
                style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "12px 18px",
                  borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "#b45309",
                  border: "1px solid rgba(245, 158, 11, 0.3)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer"
                }}
              >
                <Bookmark size={18} /> रिव्ह्यूसाठी ठेवा
              </button>

              <button
                onClick={handleSaveAndNext}
                style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "12px 22px",
                  borderRadius: "12px", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff", fontWeight: 700, border: "none", fontSize: "0.9rem", cursor: "pointer",
                  boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.3)"
                }}
              >
                पुढील प्रश्न <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Question Palette Grid */}
        <div style={{
          background: "#ffffff", borderRadius: "20px", padding: "24px",
          border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
          position: "sticky", top: "100px"
        }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>📊 प्रश्न पॅलेट</span>
            <span style={{ fontSize: "0.8rem", color: "#2563eb", background: "rgba(37,99,235,0.08)", padding: "2px 8px", borderRadius: "100px" }}>{test.questions.length} Questions</span>
          </h3>

          {/* Palette Color Legend */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem", marginBottom: "18px", background: "#f8fafc", padding: "10px", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", fontWeight: 600 }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#10b981" }} />
              <span>{answeredCount} सोडवले</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ef4444", fontWeight: 600 }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#ef4444" }} />
              <span>{unansweredCount} सोडवले नाही</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#d97706", fontWeight: 600 }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#f59e0b" }} />
              <span>{markedCount} रिव्ह्यू</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontWeight: 600 }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#cbd5e1" }} />
              <span>{unvisitedCount} पाहिले नाही</span>
            </div>
          </div>

          {/* Question Number Pills Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
            {test.questions.map((q, idx) => {
              const status = questionStatuses[q.id] || "unvisited";
              const isCurrent = idx === currentIdx;

              let bgCol = "#f1f5f9";
              let textCol = "#64748b";

              if (status === "answered") {
                bgCol = "#10b981";
                textCol = "#ffffff";
              } else if (status === "unanswered") {
                bgCol = "#ef4444";
                textCol = "#ffffff";
              } else if (status === "marked") {
                bgCol = "#f59e0b";
                textCol = "#ffffff";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigateQuestion(idx)}
                  style={{
                    height: "38px", borderRadius: "10px", background: bgCol, color: textCol,
                    fontWeight: 800, fontSize: "0.9rem", border: isCurrent ? "2px solid #0f172a" : "none",
                    cursor: "pointer", transform: isCurrent ? "scale(1.08)" : "scale(1)", transition: "all 0.15s"
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            style={{
              width: "100%", marginTop: "20px", padding: "12px", borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#ffffff",
              fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer",
              boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.3)"
            }}
          >
            ✓ सबमिट करा (Submit Test)
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{
            maxWidth: "440px", width: "100%", background: "#ffffff", borderRadius: "24px",
            padding: "32px", textAlign: "center", boxShadow: "0 25px 60px -15px rgba(0,0,0,0.15)"
          }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
              <AlertCircle size={28} color="#d97706" />
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
              तुम्हाला नक्की टेस्ट सबमिट करायची आहे का?
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "24px" }}>
              सबमिट केल्यानंतर गुण व अचूक स्पष्टीकरण लगेच दिसेल.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff", color: "#475569", fontWeight: 600, cursor: "pointer" }}
              >
                रद्द करा (Cancel)
              </button>
              <button
                onClick={handleSubmitTest}
                style={{ padding: "12px", borderRadius: "12px", border: "none", background: "#10b981", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
              >
                सबमिट करा (Submit)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Grid */}
      <style jsx>{`
        @media (max-width: 900px) {
          .quiz-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
