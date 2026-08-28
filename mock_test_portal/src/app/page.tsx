"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpen, CheckCircle2, Clock3, Crown, Flame,
  Gift, LayoutDashboard, LineChart, Lock, Medal, Package, Play, Search,
  ShieldCheck, ShoppingBag, Sparkles, Target, Trophy, Users, WalletCards,
  X, Menu, ChevronRight
} from "lucide-react";
import { fetchLiveCategories, fetchLiveQuizzes } from "@/services/api";
import { ExamCategory, MockTest } from "@/data/mockTests";

const blue = "#2563eb";

const demoSeries = [
  { title: "MPSC Prelims Complete Series", tests: 20, questions: "1,000+", price: 499, old: 999, tag: "BEST VALUE" },
  { title: "Maharashtra Police Bharti Series", tests: 15, questions: "750+", price: 399, old: 799, tag: "POPULAR" },
  { title: "Talathi Bharti Practice Series", tests: 12, questions: "600+", price: 299, old: 599, tag: "NEW" },
];

const stats = [
  ["Tests Attempted", "42", "↑ 18% this month", "#2563eb"],
  ["Average Score", "72%", "↑ 6% this month", "#0f766e"],
  ["Accuracy", "78%", "↑ 4% this month", "#7c3aed"],
  ["Study Streak", "12 days", "Keep it going 🔥", "#ea580c"],
];

export default function HomePage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "free" | "paid">("all");

  useEffect(() => {
    fetchLiveQuizzes().then((data) => setTests(data || []));
    fetchLiveCategories().then((data) => setCategories(data || []));
  }, []);

  const filteredTests = useMemo(() => tests.filter((t) => {
    const match = `${t.title} ${t.titleEn} ${t.categoryName}`.toLowerCase().includes(query.toLowerCase());
    // Existing MockTest does not expose pricing, so live tests remain compatible with the current API.
    return match && tab !== "paid";
  }), [tests, query, tab]);

  return (
    <div className="portal-shell">
      <main>
        <section className="hero-section">
          <div className="portal-container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14}/> Smart preparation starts here</div>
              <h1>Prepare smarter.<br/><span>Score higher.</span></h1>
              <p>Practice Maharashtra competitive exams with free mock tests, premium test series, detailed analytics and personalized progress tracking.</p>
              <div className="hero-actions"><a className="primary-btn" href="#tests"><Play size={17} fill="currentColor"/> Start Free Test</a><a className="secondary-btn" href="#series">Explore Test Series <ArrowRight size={17}/></a></div>
              <div className="trust-row"><span><CheckCircle2 size={16}/> Instant results</span><span><CheckCircle2 size={16}/> Detailed solutions</span><span><CheckCircle2 size={16}/> Performance analytics</span></div>
            </div>
            <div className="dashboard-preview">
              <div className="preview-top"><div><small>YOUR PERFORMANCE</small><strong>72% Average Score</strong></div><div className="score-ring">72%</div></div>
              <div className="mini-chart"><div className="chart-line"><i style={{height:"36%"}}/><i style={{height:"52%"}}/><i style={{height:"44%"}}/><i style={{height:"68%"}}/><i style={{height:"61%"}}/><i style={{height:"78%"}}/><i style={{height:"91%"}}/></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
              <div className="preview-stats"><div><Target size={17}/><b>78%</b><small>Accuracy</small></div><div><Clock3 size={17}/><b>42m</b><small>Avg. time</small></div><div><Trophy size={17}/><b>#124</b><small>Rank</small></div></div>
              <div className="preview-progress"><span><b>Current streak</b><b>12 days 🔥</b></span><div><i style={{width:"72%"}}/></div></div>
            </div>
          </div>
        </section>

        <section className="stats-strip"><div className="portal-container stats-grid">{stats.map(([label, value, hint, color]) => <div className="stat-card" key={label}><span className="stat-icon" style={{color, background:`${color}12`}}>{label === "Tests Attempted" ? <LayoutDashboard/> : label === "Average Score" ? <BarChart3/> : label === "Accuracy" ? <Target/> : <Flame/>}</span><div><small>{label}</small><strong>{value}</strong><em style={{color}}>{hint}</em></div></div>)}</div></section>

        <section id="tests" className="content-section"><div className="portal-container">
          <div className="section-heading"><div><span className="section-kicker">PRACTICE</span><h2>Mock Tests</h2><p>Start with free tests or unlock premium tests individually.</p></div><Link href="/mock-test" className="text-link">View all <ChevronRight size={17}/></Link></div>
          <div className="toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tests, exams or subjects..."/></div><div className="segmented"><button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All</button><button className={tab === "free" ? "active" : ""} onClick={() => setTab("free")}>Free</button><button className={tab === "paid" ? "active" : ""} onClick={() => setTab("paid")}>Paid</button></div></div>
          <div className="test-grid">
            {(filteredTests.length ? filteredTests.slice(0, 6) : categories.slice(0, 6).map((c, i) => ({id:String(i), title:`${c.name} Practice Test`, titleEn:c.nameEn, categorySlug:c.slug, categoryName:c.name, categoryNameEn:c.nameEn, testSlug:"", durationMinutes:60, totalMarks:100, totalQuestions:50, difficulty:"Medium" as const, rating:4.7, reviewsCount:20, questions:[]}))).map(test => <article className="test-card" key={test.id}><div className="test-top"><span className="category-pill"><ShieldCheck size={14}/>{test.categoryName}</span><span className="free-pill">FREE</span></div><h3>{test.title}</h3><p>{test.titleEn}</p><div className="test-meta"><span><BookOpen size={15}/>{test.totalQuestions} Questions</span><span><Clock3 size={15}/>{test.durationMinutes} Min</span><span><Target size={15}/>{test.totalMarks} Marks</span></div><Link className="test-btn" href={test.testSlug ? `/mock-test/${test.categorySlug}/${test.testSlug}` : `/mock-test/${test.categorySlug}`}>Start Test <ArrowRight size={16}/></Link></article>)}
          </div>
        </div></section>

        <section id="series" className="content-section soft-section"><div className="portal-container"><div className="section-heading"><div><span className="section-kicker">PREMIUM</span><h2>Test Series</h2><p>Structured practice designed for serious preparation.</p></div><Link href="/pricing" className="text-link">Explore all <ChevronRight size={17}/></Link></div><div className="series-grid">{demoSeries.map((s, i) => <article className="series-card" key={s.title}><div className="series-badge">{s.tag}</div><div className="series-icon"><Trophy size={21}/></div><h3>{s.title}</h3><div className="series-info"><span><BookOpen size={15}/>{s.tests} Tests</span><span><Target size={15}/>{s.questions} Questions</span></div><div className="price-row"><div><del>₹{s.old}</del><strong>₹{s.price}</strong></div><span>Save {Math.round((1-s.price/s.old)*100)}%</span></div><Link href="/pricing" className="outline-btn">View Series <ArrowRight size={16}/></Link></article>)}</div></div></section>

        <section id="features" className="content-section"><div className="portal-container"><div className="section-heading centered"><div><span className="section-kicker">STUDENT EXPERIENCE</span><h2>Everything you need to improve</h2><p>One dashboard for practice, progress and purchases.</p></div></div><div className="feature-grid">{[[LineChart,"Performance Analytics","Track score, accuracy, time and subject-wise performance."],[ShoppingBag,"My Library","All purchased tests, series and packages in one place."],[Trophy,"Rank & Leaderboard","See your exam rank and compare your progress."],[WalletCards,"Purchase History","Track orders, payment status and access validity."],[Flame,"Study Streaks","Build consistency with daily goals and streak tracking."],[Gift,"Smart Recommendations","Find tests based on your weak subjects and recent performance."]].map(([Icon,title,desc]) => {const I=Icon as React.ElementType; return <div className="feature-card" key={String(title)}><span><I size={21}/></span><h3>{String(title)}</h3><p>{String(desc)}</p></div>})}</div></div></section>
      </main>
    </div>
  );
}
