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
    name: "पोलीस भरती सराव परीक्षा",
    nameEn: "Maharashtra Police Bharti Mock Test",
    description: "पोलीस शिपाई, चालक व SRFP भरतीसाठी नवीन पॅटर्ननुसार मोफत ऑनलाइन सराव परीक्षा (मराठी व्याकरण, सामान्य ज्ञान, गणित व बुद्धिमत्ता).",
    icon: "🛡️",
    totalTests: 0,
    colorTheme: "#1e3a8a", // Navy Blue
  },
  {
    slug: "talathi-bharti",
    name: "तलाठी भरती सराव प्रश्नपत्रिका",
    nameEn: "Talathi Bharti Online Practice Test",
    description: "महसूल विभाग तलाठी भरती परीक्षा टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्नवर आधारित मोफत सराव टेस्ट सिरीज.",
    icon: "📜",
    totalTests: 0,
    colorTheme: "#047857", // Emerald Green
  },
  {
    slug: "mpsc-rajyaseva",
    name: "एमपीएससी राज्यसेवा / संयुक्त परीक्षा",
    nameEn: "MPSC Rajyaseva & Combine Group B/C",
    description: "MPSC राज्यसेवा पूर्व व मुख्य परीक्षा तसेच संयुक्त गट ब व गट क (PSI, STI, ASO) परीक्षेसाठी दर्जेदार सराव प्रश्न.",
    icon: "🏛️",
    totalTests: 0,
    colorTheme: "#b45309", // Amber / Saffron
  },
  {
    slug: "zilla-parishad",
    name: "जिल्हा परिषद (ZP) भरती",
    nameEn: "Zilla Parishad (ZP) Bharti Mock Test",
    description: "जिल्हा परिषद भरती अंतर्गत ग्रामसेवक, आरोग्य सेवक, वरिष्ठ सहाय्यक व कनिष्ठ अभियंता पदांसाठी मोफत मॉक टेस्ट.",
    icon: "🏢",
    totalTests: 0,
    colorTheme: "#6d28d9", // Purple
  },
  {
    slug: "arogya-vibhag",
    name: "आरोग्य विभाग भरती गट क व ड",
    nameEn: "Arogya Vibhag Group C & D Test",
    description: "सार्वजनिक आरोग्य विभाग व वैद्यकीय शिक्षण विभाग भरतीसाठी तांत्रिक व अतांत्रिक प्रश्नांची मोफत टेस्ट सिरीज.",
    icon: "🏥",
    totalTests: 0,
    colorTheme: "#be123c", // Rose Red
  },
  {
    slug: "nagar-parishad",
    name: "नगर परिषद / महानगरपालिका भरती",
    nameEn: "Nagar Parishad & Mahanagarpalika Test",
    description: "नगर परिषद, महानगरपालिका (BMC, PMC, NMMC) लिपिक, कर निर्धारक व अभियंता भरती सराव परीक्षा.",
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
      "name": "Mission Vardi Mock Test Portal",
      "sameAs": "https://missionvardiapp.vercel.app"
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
        "name": "पोलीस भरती आणि तलाठी भरतीसाठी मोफत सराव परीक्षा कुठे मिळतील?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "मिशन वर्दी (Mission Vardi) मॉक टेस्ट पोर्टलवर महाराष्ट्र पोलीस भरती, तलाठी भरती, MPSC आणि जिल्हा परिषद परीक्षेसाठी TCS व IBPS पॅटर्ननुसार संपूर्ण मोफत ऑनलाइन सराव परीक्षा उपलब्ध आहेत."
        }
      },
      {
        "@type": "Question",
        "name": "Are these mock tests updated according to the latest 2026 Maharashtra government exam pattern?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All mock tests on Mission Vardi Mock Test Portal are curated by subject matter experts following the latest TCS, IBPS, and MPSC exam patterns for 2026."
        }
      },
      {
        "@type": "Question",
        "name": "ऑनलाइन टेस्ट सोडवल्यानंतर लगेच निकाल व स्पष्टीकरण मिळते का?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "होय! प्रत्येक टेस्ट सबमिट केल्याबरोबर तुम्हाला तुमचे एकूण गुण, अचूकता (Accuracy %), आणि प्रत्येक प्रश्नाचे सविस्तर उत्तर व स्पष्टीकरण (Detailed Explanations) पाहायला मिळते."
        }
      }
    ]
  };
}
