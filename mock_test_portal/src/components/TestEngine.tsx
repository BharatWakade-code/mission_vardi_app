"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  const [timeRemaining, setTimeRemaining] = useState<number>(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const currentQuestion = test.questions[currentIdx];

  // Initialize status on mount
  useEffect(() => {
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
      // If we are leaving current question without answering, set as unanswered
      if (copy[currentQuestion.id] === "unvisited") {
        copy[currentQuestion.id] = selectedOptions[currentQuestion.id] !== undefined ? "answered" : "unanswered";
      }
      // If target question is unvisited, mark it as unanswered now
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

    // Calculate scorecard and submit asynchronously to real FastAPI / MongoDB backend
    const res = calculateResults();
    const timeSpent = test.durationMinutes * 60 - timeRemaining;
    submitLiveQuizResult(test.id, res.score, test.totalMarks, timeSpent > 0 ? timeSpent : 0);
  };

  // Calculate stats for scorecard
  const calculateResults = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    test.questions.forEach((q) => {
      const userAns = selectedOptions[q.id];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.correctOptionIndex) {
        correctCount++;
        score += q.marks;
      } else {
        incorrectCount++;
      }
    });

    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const percentage = Math.round((score / test.totalMarks) * 100);

    return { correctCount, incorrectCount, unattemptedCount, score, accuracy, percentage };
  };

  // Render Post-Test Result Scorecard & Solution Review Mode
  if (isSubmitted) {
    const res = calculateResults();
    return (
      <div className="container animate-fade" style={{ paddingBottom: "60px" }}>
        {/* Scorecard Header */}
        <div className="glass-card" style={{
          padding: "32px",
          textAlign: "center",
          marginBottom: "30px",
          borderTop: "4px solid #10b981",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "150px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🏆</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "8px", color: "#ffffff" }}>
            Congratulations! Test Scorecard
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginBottom: "28px" }}>
            {test.title} • {test.titleEn}
          </p>

          {/* Metrics Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto 30px auto"
          }}>
            <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>एकूण प्राप्त Marks (Score)</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399" }}>
                {res.score} <span style={{ fontSize: "1rem", color: "#64748b" }}>/ {test.totalMarks}</span>
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>Accuracy (%)</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#60a5fa" }}>
                {res.accuracy}%
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>Correct Answers</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>
                {res.correctCount}
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>Incorrect Answers</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f43f5e" }}>
                {res.incorrectCount}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setSelectedOptions({});
                setIsSubmitted(false);
                setTimeRemaining(test.durationMinutes * 60);
                setCurrentIdx(0);
                
                const initialStatus: Record<number, QuestionStatus> = {};
                test.questions.forEach((q) => {
                  initialStatus[q.id] = "unvisited";
                });
                if (test.questions[0]) {
                  initialStatus[test.questions[0].id] = "unanswered";
                }
                setQuestionStatuses(initialStatus);

                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-primary"
            >
              🔄 Re-attempt Test
            </button>
            <Link href="/" className="btn btn-outline">
              📋 All Mock Tests
            </Link>
          </div>
        </div>

        {/* Ad Placement */}
        <AdSlot type="leaderboard" title="Google AdSense Banner - High RPM Education Placement" />

        {/* Solution & Pedagogical Explanation Review Mode */}
        <h2 style={{ fontSize: "1.6rem", marginBottom: "20px", color: "#ffffff", borderLeft: "4px solid #f97316", paddingLeft: "12px" }}>
          📖 सर्व Questionsांची अचूक उत्तरे व सविस्तर स्पष्टीकरण (Detailed Solutions)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {test.questions.map((q, idx) => {
            const userAns = selectedOptions[q.id];
            const isCorrect = userAns === q.correctOptionIndex;
            const isUnattempted = userAns === undefined;

            return (
              <div key={q.id} className="glass-card" style={{
                padding: "24px",
                borderLeft: `4px solid ${isCorrect ? "#10b981" : isUnattempted ? "#94a3b8" : "#f43f5e"}`
              }}>
                {/* Question Top Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <span className="badge" style={{ background: "rgba(255, 255, 255, 0.08)", color: "#e2e8f0", fontSize: "0.9rem" }}>
                    Question No {idx + 1}
                  </span>
                  <div>
                    {isCorrect && <span className="badge badge-green">✓ Correct +{q.marks} Marks</span>}
                    {isUnattempted && <span className="badge" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" }}>⚠ Unattempted 0 Marks</span>}
                    {!isCorrect && !isUnattempted && <span className="badge" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>✕ Incorrect 0 Marks</span>}
                  </div>
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "6px", lineHeight: "1.5" }}>
                  {q.questionText}
                </h3>
                {q.questionTextEn && (
                  <div style={{ fontSize: "0.95rem", color: "#94a3b8", marginBottom: "18px" }}>
                    {q.questionTextEn}
                  </div>
                )}

                {/* Options List */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                  {q.options.map((opt, oIdx) => {
                    const isTheCorrectAns = oIdx === q.correctOptionIndex;
                    const isUserAns = oIdx === userAns;

                    let bgStyle = "rgba(15, 23, 42, 0.6)";
                    let borderStyle = "1px solid rgba(255, 255, 255, 0.08)";
                    let textCol = "#cbd5e1";

                    if (isTheCorrectAns) {
                      bgStyle = "rgba(16, 185, 129, 0.15)";
                      borderStyle = "1px solid rgba(16, 185, 129, 0.6)";
                      textCol = "#34d399";
                    } else if (isUserAns && !isTheCorrectAns) {
                      bgStyle = "rgba(244, 63, 94, 0.15)";
                      borderStyle = "1px solid rgba(244, 63, 94, 0.6)";
                      textCol = "#fb7185";
                    }

                    return (
                      <div key={oIdx} style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: bgStyle,
                        border: borderStyle,
                        color: textCol,
                        fontWeight: isTheCorrectAns || isUserAns ? 600 : 400,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}>
                        <span style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: 700
                        }}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isTheCorrectAns && <span>✓</span>}
                        {isUserAns && !isTheCorrectAns && <span>✕</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div style={{
                  background: "rgba(30, 58, 138, 0.25)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "10px",
                  padding: "16px",
                  color: "#e2e8f0",
                  fontSize: "0.95rem",
                  lineHeight: "1.6"
                }}>
                  <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>💡 Solution Explanation:</span>
                  </div>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link href="/" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem" }}>
            🏠 Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Active Quiz Mode Engine
  const isTimeLow = timeRemaining <= 300; // Less than 5 mins

  return (
    <div className="container animate-fade" style={{ paddingBottom: "60px" }}>
      {/* Top Test Header Bar */}
      <div className="glass-card" style={{
        padding: "16px 24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        background: "rgba(15, 23, 42, 0.9)"
      }}>
        <div>
          <span className="badge badge-blue" style={{ marginBottom: "4px" }}>
            {test.categoryName} • TCS Pattern
          </span>
          <h1 style={{ fontSize: "1.25rem", color: "#ffffff", margin: 0 }}>
            {test.title}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Live Countdown Timer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isTimeLow ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
            border: `1px solid ${isTimeLow ? "rgba(244, 63, 94, 0.5)" : "rgba(16, 185, 129, 0.5)"}`,
            padding: "8px 16px",
            borderRadius: "10px",
            color: isTimeLow ? "#f43f5e" : "#34d399",
            fontWeight: 700,
            fontSize: "1.1rem"
          }}>
            <span className={isTimeLow ? "animate-pulse" : ""}>⏱️ Time Remaining:</span>
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-success"
            style={{ padding: "10px 20px" }}
          >
            ✓ Submit Test
          </button>
        </div>
      </div>

      {/* Main 2-Column Quiz Interface */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "24px",
        alignItems: "start"
      }} className="quiz-grid">
        {/* Left Column: Question Card */}
        <div className="glass-card" style={{ padding: "30px", minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Question Top Specs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  background: "var(--primary-gradient)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  padding: "6px 12px",
                  borderRadius: "8px"
                }}>
                  Questions {currentIdx + 1} / {test.questions.length}
                </span>
                <span className="badge" style={{ background: "rgba(255, 255, 255, 0.05)", color: "#cbd5e1" }}>
                  +{currentQuestion.marks} Marks (Marks)
                </span>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                🎯 नकारात्मक Marks (Negative Marking): नाही (No)
              </span>
            </div>

            {/* Question Text */}
            <h2 style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "8px", lineHeight: "1.5", fontWeight: 600 }}>
              {currentQuestion.questionText}
            </h2>
            {currentQuestion.questionTextEn && (
              <div style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "24px" }}>
                {currentQuestion.questionTextEn}
              </div>
            )}

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "24px" }}>
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOptions[currentQuestion.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionSelect(currentQuestion.id, oIdx)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: isSelected ? "rgba(249, 115, 22, 0.2)" : "rgba(15, 23, 42, 0.6)",
                      border: isSelected ? "2px solid #f97316" : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isSelected ? "#ffffff" : "#cbd5e1",
                      fontSize: "1.05rem",
                      fontWeight: isSelected ? 600 : 400,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      transition: "var(--transition)",
                      boxShadow: isSelected ? "0 0 15px rgba(249, 115, 22, 0.2)" : "none"
                    }}
                  >
                    <span style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: isSelected ? "#f97316" : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#fff" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      fontWeight: 700
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isSelected && <span style={{ color: "#f97316", fontSize: "1.2rem" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "36px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <button
              onClick={() => handleNavigateQuestion(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="btn btn-outline"
              style={{ opacity: currentIdx === 0 ? 0.5 : 1, cursor: currentIdx === 0 ? "not-allowed" : "pointer" }}
            >
              ⬅ मागील Questions (Previous)
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleMarkForReview}
                className="btn"
                style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.4)" }}
              >
                🔖 Mark for Review
              </button>

              <button
                onClick={handleSaveAndNext}
                className="btn btn-primary"
              >
                पुढील Questions (Next) ➡
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Navigation Grid */}
        <div className="glass-card" style={{ padding: "20px", position: "sticky", top: "165px" }}>
          <h3 style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>📊 Questions पॅलेट (Question Grid)</span>
            <span className="badge badge-orange">{test.questions.length} Questions</span>
          </h3>

          {/* Palette Color Legend */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            fontSize: "0.75rem",
            marginBottom: "18px",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "10px",
            borderRadius: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#10b981" }} />
              <span>सोडवले (Answered)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#f43f5e" }} />
              <span>सोडवले नाही (Not Ans)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#fbbf24" }} />
              <span>रिव्ह्यू (Marked)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#475569" }} />
              <span>पाहिले नाही (Unvisited)</span>
            </div>
          </div>

          {/* Question Number Buttons Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px",
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "4px"
          }}>
            {test.questions.map((q, idx) => {
              const status = questionStatuses[q.id] || "unvisited";
              const isCurrent = idx === currentIdx;

              let bgCol = "#475569"; // default unvisited slate
              let textCol = "#ffffff";
              let borderCol = "transparent";

              if (status === "answered") {
                bgCol = "#10b981"; // emerald
              } else if (status === "unanswered") {
                bgCol = "#f43f5e"; // rose/red
              } else if (status === "marked") {
                bgCol = "#fbbf24"; // amber
                textCol = "#000000";
              }

              if (isCurrent) {
                borderCol = "#ffffff";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigateQuestion(idx)}
                  style={{
                    height: "40px",
                    borderRadius: "8px",
                    background: bgCol,
                    color: textCol,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: `2px solid ${borderCol}`,
                    cursor: "pointer",
                    transition: "var(--transition)",
                    boxShadow: isCurrent ? "0 0 10px rgba(255, 255, 255, 0.5)" : "none",
                    transform: isCurrent ? "scale(1.08)" : "scale(1)"
                  }}
                  title={`Questions ${idx + 1} (${status})`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-success"
            style={{ width: "100%", marginTop: "20px", padding: "12px", fontSize: "1rem" }}
          >
            ✓ टेस्ट सबमिट करा (Submit Test)
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div className="glass-card animate-fade" style={{
            maxWidth: "480px",
            width: "100%",
            padding: "30px",
            textAlign: "center",
            borderTop: "4px solid #f97316"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "10px" }}>
              तुम्हाला नक्की टेस्ट सबमिट करायची आहे का?
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "24px" }}>
              एकदा टेस्ट सबमिट केल्यानंतर तुम्ही उत्तरे बदलू शकणार नाही. लगेच तुमचे Marks व स्पष्टीकरण (Scorecard) स्क्रीनवर दिसेल.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                ✕ रद्द करा (Cancel)
              </button>
              <button
                onClick={handleSubmitTest}
                className="btn btn-success"
                style={{ flex: 1 }}
              >
                ✓ सबमिट करा (Yes, Submit)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Responsive Grid */}
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
