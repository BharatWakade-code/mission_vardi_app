export interface Question {
  id: number;
  questionText: string;
  questionTextEn?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  marks: number;
}

export interface MockTest {
  id: string;
  title: string;
  titleEn: string;
  categorySlug: string;
  categoryName: string;
  categoryNameEn: string;
  testSlug: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard" | "MPSC Level";
  badge?: string;
  rating: number;
  reviewsCount: number;
  questions: Question[];
}

export interface ExamCategory {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  totalTests: number;
  colorTheme: string;
}

export const EXAM_CATEGORIES: ExamCategory[] = [
  {
    slug: "police-bharti",
    name: "Police Bharti Exams",
    nameEn: "Maharashtra Police Bharti",
    description: "Free online mock exams based on new pattern for Police recruitment (Grammar, GK, Math & Reasoning).",
    icon: "🛡️",
    totalTests: 0,
    colorTheme: "#1e3a8a", // Navy Blue
  },
  {
    slug: "talathi-bharti",
    name: "Talathi Bharti Practice Tests",
    nameEn: "Talathi Bharti Online Practice Test",
    description: "Free mock test series based on TCS and IBPS pattern for Talathi Bharti.",
    icon: "📜",
    totalTests: 0,
    colorTheme: "#047857", // Emerald Green
  },
  {
    slug: "mpsc-rajyaseva",
    name: "MPSC Rajyaseva / Combined Exams",
    nameEn: "MPSC Rajyaseva & Combine Group B/C",
    description: "High quality practice questions for MPSC State Services Prelims & Mains and Combined Group B & C exams.",
    icon: "🏛️",
    totalTests: 0,
    colorTheme: "#b45309", // Amber / Saffron
  },
  {
    slug: "zilla-parishad",
    name: "Zilla Parishad (ZP) Exams",
    nameEn: "Zilla Parishad (ZP) Bharti",
    description: "Free Mock Tests for Gram Sevak, Health Worker, Senior Assistant and Junior Engineer posts.",
    icon: "🏢",
    totalTests: 0,
    colorTheme: "#6d28d9", // Purple
  },
  {
    slug: "arogya-vibhag",
    name: "Arogya Vibhag Group C & D",
    nameEn: "Arogya Vibhag Group C & D Test",
    description: "Free test series of technical and non-technical questions for Public Health Department.",
    icon: "🏥",
    totalTests: 0,
    colorTheme: "#be123c", // Rose Red
  },
  {
    slug: "nagar-parishad",
    name: "Nagar Parishad / Mahanagarpalika",
    nameEn: "Nagar Parishad & Mahanagarpalika Test",
    description: "Municipal Council, Municipal Corporation (BMC, PMC, NMMC) Clerk, Tax Assessor and Engineer recruitment practice exams.",
    icon: "🏙️",
    totalTests: 0,
    colorTheme: "#0369a1", // Sky Blue
  }
];

// No static dummy tests — only actual live tests fetched from backend API (MongoDB)
export const MOCK_TESTS: MockTest[] = [];

// Helper functions for filtering and querying
export function getTestsByCategory(categorySlug: string): MockTest[] {
  if (categorySlug === "all") return MOCK_TESTS;
  return MOCK_TESTS.filter(test => test.categorySlug === categorySlug);
}

export function getTestBySlug(testSlug: string): MockTest | undefined {
  return MOCK_TESTS.find(test => test.testSlug === testSlug);
}

export function getCategoryBySlug(slug: string): ExamCategory | undefined {
  return EXAM_CATEGORIES.find(cat => cat.slug === slug);
}

// SEO Schema Generators
export function generateQuizSchema(test: MockTest) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": test.title,
    "description": `${test.titleEn} - Free online practice test for Maharashtra competitive exams with instant scorecard and detailed solutions.`,
    "educationalAlignment": [
      {
        "@type": "AlignmentObject",
        "alignmentType": "educationalSubject",
        "targetName": test.categoryNameEn
      }
    ],
    "about": {
      "@type": "Thing",
      "name": test.categoryName
    },
    "provider": {
      "@type": "Organization",
      "name": "EduSaaS Web Portal",
      "sameAs": "https://edusaasweb.in"
    },
    "hasPart": test.questions.map((q, idx) => ({
      "@type": "Question",
      "name": `Question ${idx + 1}: ${q.questionText}`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.options[q.correctOptionIndex]
      },
      "suggestedAnswer": q.options.map(opt => ({
        "@type": "Answer",
        "text": opt
      }))
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": test.rating,
      "reviewCount": test.reviewsCount
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Competitive Exams आणि Aptitude Tests भरतीसाठी मोफत Mock Exam कुठे मिळतील?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduSaaS Web पोर्टलवर Global Competitive Exams, Aptitude Tests भरती, MPSC आणि जिल्हा परिषद परीक्षेसाठी TCS व IBPS पॅटर्ननुसार संपूर्ण मोफत ऑनलाइन Mock Exam उपलब्ध आहेत."
        }
      },
      {
        "@type": "Question",
        "name": "Are these mock tests updated according to the latest 2026 Maharashtra government exam pattern?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All mock tests on EduSaaS Web Portal are curated by subject matter experts following the latest TCS, IBPS, and MPSC exam patterns for 2026."
        }
      },
      {
        "@type": "Question",
        "name": "ऑनलाइन टेस्ट सोडवल्यानंतर लगेच निकाल व स्पष्टीकरण मिळते का?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "होय! प्रत्येक टेस्ट सबमिट केल्याबरोबर तुम्हाला तुमचे Total Marks, Accuracy (%), आणि प्रत्येक Questionsाचे सविस्तर उत्तर व स्पष्टीकरण (Detailed Explanations) पाहायला मिळते."
        }
      }
    ]
  };
}
