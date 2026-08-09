import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateBreadcrumbSchema } from "@/data/mockTests";
import { fetchLiveCategories, fetchLiveQuizzes } from "@/services/api";
import ExamCard from "@/components/ExamCard";
import AdSlot from "@/components/AdSlot";
import SchemaScript from "@/components/SchemaScript";
import type { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 60; // Revalidate every 60 seconds for live backend updates

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await fetchLiveCategories();
  return categories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categories = await fetchLiveCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return { title: "Category Not Found | EduSaaS Web" };
  }

  return {
    title: `${category.name} | Free Online Mock Test Series 2026`,
    description: `${category.nameEn} - ${category.description} सोडवा मोफत सराव प्रश्नपत्रिका व मिळवा लगेच निकाल.`,
    keywords: [
      category.name,
      category.nameEn,
      "free mock test online",
      "tcs pattern question paper",
      "maharashtra competitive exam"
    ],
    openGraph: {
      title: `${category.name} - Free Online Practice Tests`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const categories = await fetchLiveCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const allTests = await fetchLiveQuizzes();
  const tests = allTests.filter((t) => t.categorySlug === categorySlug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "🏠 मुख्य पृष्ठ (Home)", url: "https://edusaasweb.in" },
    { name: category.name, url: `https://edusaasweb.in/mock-test/${category.slug}` }
  ]);

  return (
    <div className="container animate-fade">
      <SchemaScript schema={breadcrumbSchema} />

      {/* Breadcrumb Navigation UI */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.9rem",
        color: "#94a3b8",
        marginBottom: "24px"
      }}>
        <Link href="/" style={{ color: "#cbd5e1" }}>🏠 मुख्य पृष्ठ</Link>
        <span>/</span>
        <span style={{ color: "#fb923c", fontWeight: 600 }}>{category.name}</span>
      </nav>

      {/* Category Hero Header */}
      <div className="glass-card" style={{
        padding: "40px",
        marginBottom: "30px",
        borderTop: `4px solid ${category.colorTheme}`,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: category.colorTheme,
          opacity: 0.15,
          filter: "blur(40px)",
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <span style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem"
          }}>
            {category.icon}
          </span>
          <div>
            <h1 style={{ fontSize: "2.2rem", color: "#ffffff", marginBottom: "4px" }}>
              {category.name}
            </h1>
            <div style={{ fontSize: "1.1rem", color: "#94a3b8", fontWeight: 500 }}>
              {category.nameEn} • TCS / IBPS Pattern 2026
            </div>
          </div>
        </div>

        <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: "800px", lineHeight: "1.6", marginBottom: "20px" }}>
          {category.description}
        </p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <span className="badge badge-orange">🔥 एकूण {tests.length} सराव Exam</span>
          <span className="badge badge-green">⚡ १००% मोफत व त्वरित निकाल</span>
          <span className="badge badge-blue">🎯 TCS व IBPS पॅटर्ननुसार</span>
        </div>
      </div>

      {/* Ad Placement */}
      <AdSlot type="leaderboard" title="Google AdSense Category Header Placement" />

      {/* Tests Grid */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.6rem", color: "#ffffff", marginBottom: "20px" }}>
          📝 उपलब्ध सराव प्रश्नपत्रिका (Practice Tests)
        </h2>
      </div>

      {tests.length === 0 ? (
        <div className="glass-card" style={{ padding: "50px", textAlign: "center" }}>
          <h3 style={{ color: "#ffffff", marginBottom: "10px" }}>लवकरच नवीन टेस्ट जोडल्या जातील!</h3>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>आमची टीम या परीक्षेसाठी नवीन २०२६ पॅटर्ननुसार प्रश्नपत्रिका तयार करत आहे.</p>
          <Link href="/" className="btn btn-primary">🏠 इतर Exam पहा</Link>
        </div>
      ) : (
        <div className="grid-3">
          {tests.map((test) => (
            <ExamCard key={test.id} test={test} />
          ))}
        </div>
      )}

      {/* Bottom Ad placement */}
      <AdSlot type="infeed" title="Google AdSense In-Feed Responsive Banner" />
    </div>
  );
}
