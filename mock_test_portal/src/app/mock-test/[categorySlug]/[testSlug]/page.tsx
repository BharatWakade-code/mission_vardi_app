import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateQuizSchema, generateBreadcrumbSchema } from "@/data/mockTests";
import { fetchLiveQuizById, fetchLiveCategories, fetchLiveQuizzes } from "@/services/api";
import TestEngine from "@/components/TestEngine";
import AdSlot from "@/components/AdSlot";
import SchemaScript from "@/components/SchemaScript";
import type { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 60; // Revalidate every 60 seconds for live backend updates

interface TestPageProps {
  params: Promise<{
    categorySlug: string;
    testSlug: string;
  }>;
}

export async function generateStaticParams() {
  const tests = await fetchLiveQuizzes();
  return tests.map((test) => ({
    categorySlug: test.categorySlug,
    testSlug: test.testSlug,
  }));
}

export async function generateMetadata({ params }: TestPageProps): Promise<Metadata> {
  const { testSlug } = await params;
  const test = await fetchLiveQuizById(testSlug);

  if (!test) {
    return { title: "Test Not Found | EduSaaS Web" };
  }

  return {
    title: `${test.title} | Online Free Practice Mock Test`,
    description: `${test.titleEn} - सोडवा मोफत ऑनलाइन Exam (${test.totalQuestions} Questions, ${test.totalMarks} Marks). लगेच निकाल व स्पष्टीकरण मिळवा.`,
    keywords: [
      test.title,
      test.titleEn,
      test.categoryName,
      "free mock test online",
      "maharashtra competitive exam practice test",
      "Competitive Exams Mock Exam"
    ],
    openGraph: {
      title: `${test.title} - Free Practice Test`,
      description: `${test.totalQuestions} Questions | ${test.durationMinutes} Minutes | Free Instant Scorecard with Explanations`,
      type: "article",
    },
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const { categorySlug, testSlug } = await params;
  const test = await fetchLiveQuizById(testSlug);
  const categories = await fetchLiveCategories();
  const category = categories.find((c) => c.slug === categorySlug) || {
    name: test?.categoryName || "Mock Exam",
    slug: categorySlug,
  };

  if (!test || !test.questions || test.questions.length === 0) {
    notFound();
  }

  const quizSchema = generateQuizSchema(test);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "🏠 मुख्य पृष्ठ", url: "https://edusaasweb.in" },
    { name: category.name, url: `https://edusaasweb.in/mock-test/${category.slug}` },
    { name: test.title, url: `https://edusaasweb.in/mock-test/${category.slug}/${test.testSlug}` }
  ]);

  return (
    <div className="animate-fade">
      {/* Inject Structured Data Schemas for Google SEO Rich Snippets */}
      <SchemaScript schema={quizSchema} />
      <SchemaScript schema={breadcrumbSchema} />

      <div className="container">
        {/* Breadcrumb Navigation Bar */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.85rem",
          color: "#94a3b8",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}>
          <Link href="/" style={{ color: "#cbd5e1" }}>🏠 मुख्य पृष्ठ</Link>
          <span>/</span>
          <Link href={`/mock-test/${category.slug}`} style={{ color: "#cbd5e1" }}>{category.name}</Link>
          <span>/</span>
          <span style={{ color: "#fb923c", fontWeight: 600 }}>{test.title}</span>
        </nav>
      </div>

      {/* Interactive Quiz Engine */}
      <TestEngine test={test} />

      {/* Bottom Leaderboard Ad */}
      <div className="container">
        <AdSlot type="leaderboard" title="Google AdSense Post-Exam Monetization Placement" />
      </div>
    </div>
  );
}
