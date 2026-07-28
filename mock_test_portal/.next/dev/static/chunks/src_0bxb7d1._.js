(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/mockTests.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXAM_CATEGORIES",
    ()=>EXAM_CATEGORIES,
    "MOCK_TESTS",
    ()=>MOCK_TESTS,
    "generateBreadcrumbSchema",
    ()=>generateBreadcrumbSchema,
    "generateFAQSchema",
    ()=>generateFAQSchema,
    "generateQuizSchema",
    ()=>generateQuizSchema,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getTestBySlug",
    ()=>getTestBySlug,
    "getTestsByCategory",
    ()=>getTestsByCategory
]);
const EXAM_CATEGORIES = [
    {
        slug: "police-bharti",
        name: "पोलीस भरती सराव परीक्षा",
        nameEn: "Maharashtra Police Bharti Mock Test",
        description: "पोलीस शिपाई, चालक व SRFP भरतीसाठी नवीन पॅटर्ननुसार मोफत ऑनलाइन सराव परीक्षा (मराठी व्याकरण, सामान्य ज्ञान, गणित व बुद्धिमत्ता).",
        icon: "🛡️",
        totalTests: 0,
        colorTheme: "#1e3a8a"
    },
    {
        slug: "talathi-bharti",
        name: "तलाठी भरती सराव प्रश्नपत्रिका",
        nameEn: "Talathi Bharti Online Practice Test",
        description: "महसूल विभाग तलाठी भरती परीक्षा टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्नवर आधारित मोफत सराव टेस्ट सिरीज.",
        icon: "📜",
        totalTests: 0,
        colorTheme: "#047857"
    },
    {
        slug: "mpsc-rajyaseva",
        name: "एमपीएससी राज्यसेवा / संयुक्त परीक्षा",
        nameEn: "MPSC Rajyaseva & Combine Group B/C",
        description: "MPSC राज्यसेवा पूर्व व मुख्य परीक्षा तसेच संयुक्त गट ब व गट क (PSI, STI, ASO) परीक्षेसाठी दर्जेदार सराव प्रश्न.",
        icon: "🏛️",
        totalTests: 0,
        colorTheme: "#b45309"
    },
    {
        slug: "zilla-parishad",
        name: "जिल्हा परिषद (ZP) भरती",
        nameEn: "Zilla Parishad (ZP) Bharti Mock Test",
        description: "जिल्हा परिषद भरती अंतर्गत ग्रामसेवक, आरोग्य सेवक, वरिष्ठ सहाय्यक व कनिष्ठ अभियंता पदांसाठी मोफत मॉक टेस्ट.",
        icon: "🏢",
        totalTests: 0,
        colorTheme: "#6d28d9"
    },
    {
        slug: "arogya-vibhag",
        name: "आरोग्य विभाग भरती गट क व ड",
        nameEn: "Arogya Vibhag Group C & D Test",
        description: "सार्वजनिक आरोग्य विभाग व वैद्यकीय शिक्षण विभाग भरतीसाठी तांत्रिक व अतांत्रिक प्रश्नांची मोफत टेस्ट सिरीज.",
        icon: "🏥",
        totalTests: 0,
        colorTheme: "#be123c"
    },
    {
        slug: "nagar-parishad",
        name: "नगर परिषद / महानगरपालिका भरती",
        nameEn: "Nagar Parishad & Mahanagarpalika Test",
        description: "नगर परिषद, महानगरपालिका (BMC, PMC, NMMC) लिपिक, कर निर्धारक व अभियंता भरती सराव परीक्षा.",
        icon: "🏙️",
        totalTests: 0,
        colorTheme: "#0369a1"
    }
];
const MOCK_TESTS = [];
function getTestsByCategory(categorySlug) {
    if (categorySlug === "all") return MOCK_TESTS;
    return MOCK_TESTS.filter((test)=>test.categorySlug === categorySlug);
}
function getTestBySlug(testSlug) {
    return MOCK_TESTS.find((test)=>test.testSlug === testSlug);
}
function getCategoryBySlug(slug) {
    return EXAM_CATEGORIES.find((cat)=>cat.slug === slug);
}
function generateQuizSchema(test) {
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
            "sameAs": "https://majhinaukri.in/mock-test/"
        },
        "hasPart": test.questions.map((q, idx)=>({
                "@type": "Question",
                "name": `Question ${idx + 1}: ${q.questionText}`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.options[q.correctOptionIndex]
                },
                "suggestedAnswer": q.options.map((opt)=>({
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
function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index)=>({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
    };
}
function generateFAQSchema() {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "categoryToSlug",
    ()=>categoryToSlug,
    "createFitnessLogApi",
    ()=>createFitnessLogApi,
    "deleteFitnessLogApi",
    ()=>deleteFitnessLogApi,
    "fetchDashboardData",
    ()=>fetchDashboardData,
    "fetchFitnessLogsApi",
    ()=>fetchFitnessLogsApi,
    "fetchGlobalAlerts",
    ()=>fetchGlobalAlerts,
    "fetchGlobalLeaderboard",
    ()=>fetchGlobalLeaderboard,
    "fetchLiveCategories",
    ()=>fetchLiveCategories,
    "fetchLiveQuizById",
    ()=>fetchLiveQuizById,
    "fetchLiveQuizzes",
    ()=>fetchLiveQuizzes,
    "fetchNotes",
    ()=>fetchNotes,
    "fetchPYQs",
    ()=>fetchPYQs,
    "fetchUserProfileApi",
    ()=>fetchUserProfileApi,
    "loginUserApi",
    ()=>loginUserApi,
    "registerUserApi",
    ()=>registerUserApi,
    "submitLiveQuizResult",
    ()=>submitLiveQuizResult,
    "updateUserProfileApi",
    ()=>updateUserProfileApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockTests.ts [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://mission-vardi-app.onrender.com");
function categoryToSlug(category) {
    if (!category) return "general";
    const lower = category.toLowerCase().trim();
    if (lower === "srpf") return "srpf";
    if (lower === "forest guard") return "forest-guard";
    if (lower === "daily challenge") return "daily-challenge";
    if (lower === "police bharti" || lower === "police") return "police-bharti";
    if (lower === "talathi" || lower === "talathi bharti") return "talathi-bharti";
    return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
// Helper to convert backend question format to Frontend Question format
function mapBackendQuestion(q, idx) {
    const options = q.options_mr && q.options_mr.length > 0 ? q.options_mr : q.options || [
        "A",
        "B",
        "C",
        "D"
    ];
    // Find correct option index from correctAnswer string
    let correctIdx = 0;
    if (q.correctAnswer) {
        // Try finding exact text match in options_mr or options
        const mrIndex = q.options_mr ? q.options_mr.indexOf(q.correctAnswer) : -1;
        const enIndex = q.options ? q.options.indexOf(q.correctAnswer) : -1;
        if (mrIndex !== -1) {
            correctIdx = mrIndex;
        } else if (enIndex !== -1) {
            correctIdx = enIndex;
        } else {
            // Try parsing as integer (0-indexed or 1-indexed)
            const num = parseInt(q.correctAnswer, 10);
            if (!isNaN(num)) {
                correctIdx = num > 3 ? 0 : num;
            }
        }
    }
    return {
        id: typeof q.id === "number" ? q.id : idx + 1,
        questionText: q.text_mr || q.text || `प्रश्न क्रमांक ${idx + 1}`,
        questionTextEn: q.text || q.text_mr,
        options: options,
        correctOptionIndex: correctIdx,
        explanation: `बरोबर उत्तर: ${q.correctAnswer}`,
        marks: 2
    };
}
// Convert Backend Quiz to Frontend MockTest format
function mapBackendQuizToMockTest(bq) {
    const slug = categoryToSlug(bq.category);
    const questions = (bq.questions || []).map((q, idx)=>mapBackendQuestion(q, idx));
    // Estimate difficulty based on type/category
    let diff = "Medium";
    if (bq.type === "challenge") diff = "Hard";
    if (bq.category?.toLowerCase().includes("mpsc")) diff = "MPSC Level";
    // Match existing category name if present
    const existingCat = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXAM_CATEGORIES"].find((c)=>c.slug === slug);
    const catName = existingCat ? existingCat.name : bq.category || "सराव परीक्षा";
    const catNameEn = existingCat ? existingCat.nameEn : bq.category || "Practice Test";
    const totalQuestions = questions.length > 0 ? questions.length : 25; // default 25 if listed without questions
    const totalMarks = totalQuestions * 2;
    const durationMinutes = Math.max(15, Math.ceil(totalQuestions * 1.2));
    return {
        id: bq.id,
        title: bq.title,
        titleEn: bq.title,
        categorySlug: slug,
        categoryName: catName,
        categoryNameEn: catNameEn,
        testSlug: bq.id,
        durationMinutes: durationMinutes,
        totalMarks: totalMarks,
        totalQuestions: totalQuestions,
        difficulty: diff,
        badge: bq.type === "challenge" ? "⚡ Daily Challenge" : "🔥 Live API",
        rating: 4.9,
        reviewsCount: Math.floor(Math.random() * 2000) + 500,
        questions: questions
    };
}
async function fetchLiveQuizzes() {
    try {
        const res = await fetch(`${API_BASE_URL}/quiz`, {
            next: {
                revalidate: 60
            }
        });
        if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
        }
        const json = await res.json();
        if (json.status && Array.isArray(json.data)) {
            return json.data.map(mapBackendQuizToMockTest);
        }
    } catch (error) {
        console.warn("Failed to fetch live quizzes from API:", error);
    }
    return [];
}
async function fetchLiveQuizById(idOrSlug) {
    try {
        const res = await fetch(`${API_BASE_URL}/quiz/${idOrSlug}`, {
            cache: "no-store"
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && json.data) {
                return mapBackendQuizToMockTest(json.data);
            }
        }
    } catch (error) {
        console.warn(`Failed to fetch quiz ${idOrSlug} from live API:`, error);
    }
    return undefined;
}
async function fetchLiveCategories() {
    const tests = await fetchLiveQuizzes();
    const dynamicCategories = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXAM_CATEGORIES"]
    ];
    const existingSlugs = new Set(dynamicCategories.map((c)=>c.slug));
    // Count actual tests per category
    const testCounts = {};
    for (const t of tests){
        testCounts[t.categorySlug] = (testCounts[t.categorySlug] || 0) + 1;
    }
    // Update counts for existing categories to match actual live database tests
    for (const cat of dynamicCategories){
        cat.totalTests = testCounts[cat.slug] || 0;
    }
    // Add any new categories from backend API
    for (const test of tests){
        if (!existingSlugs.has(test.categorySlug)) {
            existingSlugs.add(test.categorySlug);
            let icon = "📝";
            let colorTheme = "#0369a1"; // Default sky blue
            if (test.categorySlug === "srpf") {
                icon = "🛡️";
                colorTheme = "#1e3a8a";
            } else if (test.categorySlug === "forest-guard") {
                icon = "🌲";
                colorTheme = "#047857";
            } else if (test.categorySlug === "daily-challenge") {
                icon = "⚡";
                colorTheme = "#b45309";
            }
            dynamicCategories.push({
                slug: test.categorySlug,
                name: test.categoryName,
                nameEn: test.categoryNameEn,
                description: `${test.categoryName} साठी टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्नवर आधारित मोफत ऑनलाइन सराव परीक्षा.`,
                icon: icon,
                totalTests: testCounts[test.categorySlug] || 1,
                colorTheme: colorTheme
            });
        }
    }
    return dynamicCategories;
}
async function submitLiveQuizResult(quizId, score, total, timeSpentSeconds) {
    try {
        const userId = "web_user_" + Math.random().toString(36).substring(2, 10);
        const res = await fetch(`${API_BASE_URL}/quiz/${quizId}/result`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                score: score,
                total: total,
                time_spent_seconds: timeSpentSeconds,
                answers: []
            })
        });
        if (res.ok) {
            const json = await res.json();
            console.log("Result successfully saved to backend MongoDB:", json);
            return true;
        }
    } catch (error) {
        console.error("Error submitting quiz result to backend API:", error);
    }
    return false;
}
async function fetchDashboardData() {
    try {
        const res = await fetch(`${API_BASE_URL}/home/dashboard`, {
            next: {
                revalidate: 60
            }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && json.data) {
                return json.data;
            }
        }
    } catch (error) {
        console.warn("Failed to fetch dashboard data:", error);
    }
    return null;
}
async function fetchGlobalLeaderboard(limit = 10) {
    try {
        const res = await fetch(`${API_BASE_URL}/leaderboard/global?limit=${limit}`, {
            next: {
                revalidate: 30
            }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (error) {
        console.warn("Failed to fetch global leaderboard:", error);
    }
    return [];
}
async function fetchNotes(category, search) {
    try {
        let url = `${API_BASE_URL}/notes`;
        const params = new URLSearchParams();
        if (category && category !== "all") params.append("category", category);
        if (search) params.append("search", search);
        if (params.toString()) url += `?${params.toString()}`;
        const res = await fetch(url, {
            next: {
                revalidate: 60
            }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (error) {
        console.warn("Failed to fetch notes:", error);
    }
    return [];
}
async function fetchPYQs(year, category) {
    try {
        let url = `${API_BASE_URL}/pyqs`;
        const params = new URLSearchParams();
        if (year) params.append("year", year.toString());
        if (category && category !== "all") params.append("category", category);
        if (params.toString()) url += `?${params.toString()}`;
        const res = await fetch(url, {
            next: {
                revalidate: 60
            }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (error) {
        console.warn("Failed to fetch PYQs:", error);
    }
    return [];
}
async function fetchGlobalAlerts() {
    try {
        const res = await fetch(`${API_BASE_URL}/alerts/global`, {
            next: {
                revalidate: 60
            }
        });
        if (res.ok) {
            const json = await res.json();
            if (json.status && Array.isArray(json.data)) {
                return json.data;
            }
        }
    } catch (error) {
        console.warn("Failed to fetch global alerts:", error);
    }
    return [];
}
async function loginUserApi(email, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const json = await res.json();
        if (res.ok && (json.status || json.user || json.data)) {
            return {
                success: true,
                user: json.user || json.data || json
            };
        }
        return {
            success: false,
            message: json.detail || json.message || "लॉगिन अयशस्वी. कृपया ईमेल आणि पासवर्ड तपासा."
        };
    } catch (error) {
        console.error("Login API Error:", error);
        return {
            success: false,
            message: "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट तपासा."
        };
    }
}
async function registerUserApi(name, email, password, mobile, district) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                mobile: mobile || "",
                district: district || ""
            })
        });
        const json = await res.json();
        if (res.ok && (json.status || json.user || json.data || res.status === 200)) {
            return {
                success: true,
                user: json.user || json.data || {
                    name,
                    email,
                    mobile,
                    district
                }
            };
        }
        return {
            success: false,
            message: json.detail || json.message || "रजिस्ट्रेशन अयशस्वी."
        };
    } catch (error) {
        console.error("Register API Error:", error);
        return {
            success: false,
            message: "सर्व्हरशी संपर्क होऊ शकला नाही."
        };
    }
}
async function fetchUserProfileApi(userId) {
    try {
        const res = await fetch(`${API_BASE_URL}/user/getProfile?user_id=${userId}`);
        if (res.ok) {
            const json = await res.json();
            return json.data || json.user || json;
        }
    } catch (error) {
        console.warn("Fetch Profile Error:", error);
    }
    return null;
}
async function updateUserProfileApi(userId, data) {
    try {
        const res = await fetch(`${API_BASE_URL}/user/updateProfile/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (error) {
        console.error("Update Profile Error:", error);
        return false;
    }
}
async function fetchFitnessLogsApi(userId) {
    try {
        const res = await fetch(`${API_BASE_URL}/fitness/${userId}`);
        if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.data || json)) {
                return json.data || json;
            }
        }
    } catch (error) {
        console.warn("Fetch Fitness Logs Error:", error);
    }
    return [];
}
async function createFitnessLogApi(logData) {
    try {
        const res = await fetch(`${API_BASE_URL}/fitness`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logData)
        });
        return res.ok;
    } catch (error) {
        console.error("Create Fitness Log Error:", error);
        return false;
    }
}
async function deleteFitnessLogApi(logId) {
    try {
        const res = await fetch(`${API_BASE_URL}/fitness/${logId}`, {
            method: "DELETE"
        });
        return res.ok;
    } catch (error) {
        console.error("Delete Fitness Log Error:", error);
        return false;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ExamCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExamCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockTests.ts [app-client] (ecmascript)");
"use client";
;
;
;
function ExamCard({ test }) {
    const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategoryBySlug"])(test.categorySlug);
    const icon = category?.icon || "📝";
    const themeColor = category?.colorTheme || "#3b82f6";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-card animate-fade",
        style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            borderTop: `4px solid ${themeColor}`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
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
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ExamCard.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "16px",
                            flexWrap: "wrap",
                            gap: "8px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "badge",
                                style: {
                                    background: "rgba(255, 255, 255, 0.08)",
                                    color: "#e2e8f0",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: test.categoryName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            test.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "badge badge-orange animate-pulse",
                                children: test.badge
                            }, void 0, false, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ExamCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            marginBottom: "8px",
                            lineHeight: "1.4"
                        },
                        children: test.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExamCard.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                            marginBottom: "20px",
                            fontWeight: 500
                        },
                        children: test.titleEn
                    }, void 0, false, {
                        fileName: "[project]/src/components/ExamCard.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "10px",
                            background: "rgba(15, 23, 42, 0.6)",
                            padding: "14px",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            marginBottom: "20px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "1.1rem"
                                        },
                                        children: "❓"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.75rem",
                                                    color: "#64748b"
                                                },
                                                children: "एकूण प्रश्न"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 700,
                                                    color: "#f8fafc"
                                                },
                                                children: [
                                                    test.totalQuestions,
                                                    " प्रश्न"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 97,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "1.1rem"
                                        },
                                        children: "🎯"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.75rem",
                                                    color: "#64748b"
                                                },
                                                children: "एकूण गुण"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 104,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 700,
                                                    color: "#f8fafc"
                                                },
                                                children: [
                                                    test.totalMarks,
                                                    " गुण"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 105,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "1.1rem"
                                        },
                                        children: "⏱️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.75rem",
                                                    color: "#64748b"
                                                },
                                                children: "वेळ (Duration)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 700,
                                                    color: "#f8fafc"
                                                },
                                                children: [
                                                    test.durationMinutes,
                                                    " मिनिटे"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "1.1rem"
                                        },
                                        children: "⭐"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.75rem",
                                                    color: "#64748b"
                                                },
                                                children: "विद्यार्थी रेटिंग"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 700,
                                                    color: "#fbbf24"
                                                },
                                                children: [
                                                    test.rating,
                                                    " (",
                                                    test.reviewsCount,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ExamCard.tsx",
                                                lineNumber: 121,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ExamCard.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ExamCard.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ExamCard.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ExamCard.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "auto"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/mock-test/${test.categorySlug}/${test.testSlug}`,
                    className: "btn btn-primary",
                    style: {
                        flex: 1,
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        textDecoration: "none"
                    },
                    children: "⚡ टेस्ट सोडवा (Start Test Now)"
                }, void 0, false, {
                    fileName: "[project]/src/components/ExamCard.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ExamCard.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ExamCard.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = ExamCard;
var _c;
__turbopack_context__.k.register(_c, "ExamCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AdSlot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdSlot
]);
"use client";
function AdSlot({ type = "leaderboard", slotId = "default-slot", title = "Sponsored Google AdSense Display" }) {
    // Temporarily hiding all ads until a domain is ready and AdSense is officially approved.
    return null;
}
_c = AdSlot;
var _c;
__turbopack_context__.k.register(_c, "AdSlot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SchemaScript.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SchemaScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function SchemaScript({ schema }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(schema)
        }
    }, void 0, false, {
        fileName: "[project]/src/components/SchemaScript.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = SchemaScript;
var _c;
__turbopack_context__.k.register(_c, "SchemaScript");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockTests.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExamCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ExamCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdSlot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AdSlot.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SchemaScript$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SchemaScript.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function HomePage() {
    _s();
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tests, setTests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [appLoading, setAppLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // New features state (Dashboard, Notes, PYQs, Leaderboard, Physical Fitness, Alerts, Profile)
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mock-tests");
    const [dashboardData, setDashboardData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [leaderboard, setLeaderboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pyqs, setPyqs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedNote, setSelectedNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // User Auth & Profile State (Live connected just like mobile app)
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAuthModal, setShowAuthModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authMode, setAuthMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("login");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mobile, setMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [district, setDistrict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authLoading, setAuthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Physical Test Tracker State (/fitness)
    const [fitnessLogs, setFitnessLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [run1600Min, setRun1600Min] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [run1600Sec, setRun1600Sec] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [run100Sec, setRun100Sec] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(11.5);
    const [shotPutMeters, setShotPutMeters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(8.50);
    const [fitnessNotes, setFitnessNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fitnessLoading, setFitnessLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            // Check localStorage for existing logged-in user
            const savedUser = localStorage.getItem("mission_vardi_user");
            if (savedUser) {
                try {
                    const u = JSON.parse(savedUser);
                    setCurrentUser(u);
                    const uid = u.user_id || u.id;
                    if (uid) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFitnessLogsApi"])(uid).then(setFitnessLogs);
                    }
                } catch (e) {
                    console.error("Failed to parse saved user:", e);
                }
            }
            // Fetch all backend APIs in parallel
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLiveQuizzes"])().then({
                    "HomePage.useEffect": (data)=>{
                        if (data) setTests(data);
                    }
                }["HomePage.useEffect"]),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLiveCategories"])().then({
                    "HomePage.useEffect": (cats)=>{
                        if (cats && cats.length > 0) setCategories(cats);
                    }
                }["HomePage.useEffect"]),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDashboardData"])().then(setDashboardData),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchGlobalAlerts"])().then(setAlerts),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchGlobalLeaderboard"])().then(setLeaderboard),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchNotes"])().then(setNotes),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPYQs"])().then(setPyqs)
            ]).finally({
                "HomePage.useEffect": ()=>{
                    setLoading(false);
                    setAppLoading(false);
                }
            }["HomePage.useEffect"]);
        }
    }["HomePage.useEffect"], []);
    // Filter tests by category & search query
    const filteredTests = tests.filter((test)=>{
        const matchesCat = selectedCategory === "all" || test.categorySlug === selectedCategory;
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || test.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || test.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });
    const handleLogin = async (e)=>{
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginUserApi"])(email, password);
        setAuthLoading(false);
        if (res.success && res.user) {
            const u = res.user;
            setCurrentUser(u);
            localStorage.setItem("mission_vardi_user", JSON.stringify(u));
            setShowAuthModal(false);
            const uid = u.user_id || u.id;
            if (uid) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFitnessLogsApi"])(uid).then(setFitnessLogs);
            }
            alert(`🎉 लॉगिन यशस्वी! स्वागत आहे, ${u.name || "विद्यार्थी"}!`);
        } else {
            setAuthError(res.message || "लॉगिन अयशस्वी झाले. कृपया ईमेल आणि पासवर्ड तपासा.");
        }
    };
    const handleRegister = async (e)=>{
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerUserApi"])(name, email, password, mobile, district);
        setAuthLoading(false);
        if (res.success && res.user) {
            const u = res.user;
            setCurrentUser(u);
            localStorage.setItem("mission_vardi_user", JSON.stringify(u));
            setShowAuthModal(false);
            alert(`🎉 रजिस्ट्रेशन यशस्वी! स्वागत आहे, ${u.name}! आता तुम्ही लीडरबोर्ड व फिजिकल चाचणी वापरू शकता.`);
        } else {
            setAuthError(res.message || "रजिस्ट्रेशन अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.");
        }
    };
    const handleUpdateProfile = async (e)=>{
        e.preventDefault();
        if (!currentUser) return;
        setAuthLoading(true);
        const updated = {
            ...currentUser,
            name,
            mobile,
            district
        };
        const uid = currentUser.user_id || currentUser.id || "";
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUserProfileApi"])(uid, updated);
        setAuthLoading(false);
        setCurrentUser(updated);
        localStorage.setItem("mission_vardi_user", JSON.stringify(updated));
        setShowAuthModal(false);
        alert("✓ प्रोफाईल आणि जिल्हा माहिती यशस्वीरित्या अपडेट झाली!");
    };
    const handleLogout = ()=>{
        setCurrentUser(null);
        localStorage.removeItem("mission_vardi_user");
        setFitnessLogs([]);
        setShowAuthModal(false);
    };
    // Physical Marks Calculator Logic (Police Bharti Official Standards)
    const calculatePhysicalScore = ()=>{
        const total1600Sec = run1600Min * 60 + Number(run1600Sec);
        let score1600 = 0;
        if (total1600Sec <= 310) score1600 = 20; // 5 min 10 sec or less
        else if (total1600Sec <= 330) score1600 = 18;
        else if (total1600Sec <= 350) score1600 = 16;
        else if (total1600Sec <= 370) score1600 = 14;
        else if (total1600Sec <= 390) score1600 = 12;
        else score1600 = 10;
        let score100 = 0;
        if (run100Sec <= 11.5) score100 = 15;
        else if (run100Sec <= 12.5) score100 = 12;
        else if (run100Sec <= 13.5) score100 = 10;
        else if (run100Sec <= 14.5) score100 = 8;
        else score100 = 5;
        let scoreShot = 0;
        if (shotPutMeters >= 8.50) scoreShot = 15;
        else if (shotPutMeters >= 7.90) scoreShot = 12;
        else if (shotPutMeters >= 7.30) scoreShot = 10;
        else if (shotPutMeters >= 6.70) scoreShot = 8;
        else scoreShot = 5;
        return {
            score1600,
            score100,
            scoreShot,
            total: score1600 + score100 + scoreShot
        };
    };
    // Helper to compute individual marks from a saved FitnessLog
    const getFitnessLogMarks = (log)=>{
        const total1600Sec = log.run_1600m_seconds || 300;
        let score1600 = 0;
        if (total1600Sec <= 310) score1600 = 20;
        else if (total1600Sec <= 330) score1600 = 18;
        else if (total1600Sec <= 350) score1600 = 16;
        else if (total1600Sec <= 370) score1600 = 14;
        else if (total1600Sec <= 390) score1600 = 12;
        else score1600 = 10;
        const run100Sec = log.run_100m_seconds || 12;
        let score100 = 0;
        if (run100Sec <= 11.5) score100 = 15;
        else if (run100Sec <= 12.5) score100 = 12;
        else if (run100Sec <= 13.5) score100 = 10;
        else if (run100Sec <= 14.5) score100 = 8;
        else score100 = 5;
        const shotPutMeters = log.shot_put_meters || 8;
        let scoreShot = 0;
        if (shotPutMeters >= 8.50) scoreShot = 15;
        else if (shotPutMeters >= 7.90) scoreShot = 12;
        else if (shotPutMeters >= 7.30) scoreShot = 10;
        else if (shotPutMeters >= 6.70) scoreShot = 8;
        else scoreShot = 5;
        return {
            score1600,
            score100,
            scoreShot,
            total: score1600 + score100 + scoreShot
        };
    };
    const handleAddFitnessLog = async (e)=>{
        e.preventDefault();
        if (!currentUser || !currentUser.user_id && !currentUser.id) {
            alert("कृपया शारीरिक चाचणीची नोंद करण्यासाठी प्रथम लॉगिन करा!");
            setAuthMode("login");
            setShowAuthModal(true);
            return;
        }
        setFitnessLoading(true);
        const userId = currentUser.user_id || currentUser.id;
        const newLog = {
            user_id: userId,
            run_1600m_seconds: run1600Min * 60 + Number(run1600Sec),
            run_100m_seconds: Number(run100Sec),
            shot_put_meters: Number(shotPutMeters),
            date: new Date().toISOString().split("T")[0],
            notes: fitnessNotes || "नियमित सराव चाचणी"
        };
        const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFitnessLogApi"])(newLog);
        if (success) {
            const logs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFitnessLogsApi"])(userId);
            setFitnessLogs(logs);
            setFitnessNotes("");
            alert("🎉 आजची शारीरिक चाचणी नोंद यशस्वीरित्या सेव्ह झाली!");
        } else {
            alert("नोंद सेव्ह करताना समस्या आली. कृपया पुन्हा प्रयत्न करा.");
        }
        setFitnessLoading(false);
    };
    const faqSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockTests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateFAQSchema"])();
    if (appLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#020617"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: "relative",
                        width: "72px",
                        height: "72px",
                        marginBottom: "24px"
                    },
                    className: "animate-pulse",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "100%",
                            height: "100%",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.05)",
                            boxShadow: "0 0 30px rgba(249, 115, 22, 0.2)"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.png",
                            alt: "Mission Vardi Loading",
                            style: {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 297,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 287,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "#f8fafc",
                        marginBottom: "6px",
                        letterSpacing: "0.5px"
                    },
                    children: "माहिती लोड होत आहे..."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 302,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "#475569",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: 700
                    },
                    children: "Mission Vardi Portal"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 307,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 284,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-95a5afb5d854b5cc" + " " + "container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SchemaScript$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                schema: faqSchema
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: "16px",
                    gap: "12px",
                    flexWrap: "wrap"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "rgba(30, 41, 59, 0.9)",
                        padding: "8px 18px",
                        borderRadius: "100px",
                        border: "1px solid #f97316",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                    },
                    className: "jsx-95a5afb5d854b5cc",
                    children: [
                        currentUser.avatar_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: currentUser.avatar_url,
                            alt: currentUser.name,
                            style: {
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid #fff"
                            },
                            className: "jsx-95a5afb5d854b5cc"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 332,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: "1.2rem"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: "👤"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 334,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-95a5afb5d854b5cc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "#ffffff",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        display: "block"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: currentUser.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 337,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "#94a3b8",
                                        fontSize: "0.75rem"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: currentUser.district || "महाराष्ट्र"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 338,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 336,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setName(currentUser.name || "");
                                setMobile(currentUser.mobile || "");
                                setDistrict(currentUser.district || "");
                                setAuthMode("profile");
                                setShowAuthModal(true);
                            },
                            style: {
                                padding: "6px 14px",
                                fontSize: "0.85rem",
                                marginLeft: "6px"
                            },
                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                            children: "⚙️ माझे प्रोफाईल"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 340,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 330,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        setAuthMode("login");
                        setAuthError("");
                        setShowAuthModal(true);
                    },
                    style: {
                        padding: "10px 24px",
                        borderRadius: "100px",
                        fontSize: "0.95rem",
                        boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    },
                    className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-95a5afb5d854b5cc",
                        children: "🔑 विद्यार्थी लॉगिन / रजिस्ट्रेशन (Join Leaderboard)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 360,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 355,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "linear-gradient(90deg, #1e3a8a 0%, #7c2d12 100%)",
                    border: "1px solid rgba(249, 115, 22, 0.4)",
                    borderRadius: "16px",
                    padding: "14px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                    flexWrap: "wrap"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: "1.4rem",
                            animation: "bounce 1s infinite"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "🔔"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            minWidth: "250px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: "10px",
                                    fontSize: "0.75rem",
                                    padding: "4px 8px"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange",
                                children: "महत्त्वाचे अपडेट"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "#ffffff",
                                    fontWeight: 600,
                                    fontSize: "0.95rem"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: alerts[0].message_mr
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 382,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "#cbd5e1",
                                    fontSize: "0.85rem",
                                    marginLeft: "10px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    "(",
                                    alerts[0].message_en,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 383,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 367,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].section, {
                initial: {
                    opacity: 0,
                    y: 30
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.6,
                    ease: "easeOut"
                },
                style: {
                    background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "24px",
                    padding: "50px 30px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "30px",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            top: "-100px",
                            right: "-100px",
                            width: "300px",
                            height: "300px",
                            background: "radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)",
                            filter: "blur(40px)",
                            pointerEvents: "none"
                        },
                        className: "jsx-95a5afb5d854b5cc"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 404,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginBottom: "16px",
                            padding: "6px 14px",
                            fontSize: "0.85rem"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange animate-pulse",
                        children: "🚀 महाराष्ट्रातील नंबर १ मोफत मॉक टेस्ट, स्टडी व शारीरिक चाचणी पोर्टल"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#ffffff",
                            marginBottom: "16px",
                            letterSpacing: "-0.5px",
                            lineHeight: "1.3",
                            maxWidth: "900px",
                            margin: "0 auto 16px auto"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "hero-title",
                        children: [
                            "पोलीस भरती, तलाठी व MPSC ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-95a5afb5d854b5cc" + " " + "gradient-text",
                                children: "मोफत ऑनलाइन अभ्यास मंच"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 429,
                                columnNumber: 36
                            }, this),
                            " (Live Exam Portal)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: "1.15rem",
                            color: "#cbd5e1",
                            maxWidth: "750px",
                            margin: "0 auto 30px auto",
                            lineHeight: "1.6",
                            fontWeight: 400
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "नवीन २०२६ पॅटर्नवर आधारित मोफत सराव प्रश्नपत्रिका सोडवा, स्टडी नोट्स वाचा, शारीरिक चाचणी (Physical Test) गुण मोजा आणि ग्लोबल लीडरबोर्डमध्ये तुमची रँक पहा!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this),
                    dashboardData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "20px",
                            maxWidth: "850px",
                            margin: "0 auto 30px auto",
                            textAlign: "left"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            dashboardData.daily_quotes && dashboardData.daily_quotes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "rgba(15, 23, 42, 0.7)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "16px",
                                    padding: "16px 20px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "0.85rem",
                                            color: "#fb923c",
                                            fontWeight: 700,
                                            marginBottom: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "💡 आजचा प्रेरणादायी सुविचार (Daily Quote)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 461,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#ffffff",
                                            fontSize: "0.95rem",
                                            fontStyle: "italic",
                                            marginBottom: "6px",
                                            lineHeight: "1.4"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: dashboardData.daily_quotes[0].mr
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#94a3b8",
                                            fontSize: "0.8rem"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: dashboardData.daily_quotes[0].en
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 465,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 455,
                                columnNumber: 15
                            }, this),
                            dashboardData.countdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "rgba(15, 23, 42, 0.7)",
                                    border: "1px solid rgba(52, 211, 153, 0.3)",
                                    borderRadius: "16px",
                                    padding: "16px 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "0.85rem",
                                            color: "#34d399",
                                            fontWeight: 700,
                                            marginBottom: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            "⏰ ",
                                            dashboardData.countdown.title
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 482,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "12px",
                                            alignItems: "center"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "1.6rem",
                                                            fontWeight: 800,
                                                            color: "#ffffff"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: dashboardData.countdown.daysLeft
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.85rem",
                                                            color: "#94a3b8",
                                                            marginLeft: "4px"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "दिवस (Days)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 484,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "#94a3b8"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "1.4rem",
                                                            fontWeight: 700,
                                                            color: "#cbd5e1"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: dashboardData.countdown.hoursLeft
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.85rem",
                                                            color: "#94a3b8",
                                                            marginLeft: "4px"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "तास"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 483,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 473,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 445,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            maxWidth: "600px",
                            margin: "0 auto 30px auto",
                            position: "relative",
                            display: "flex",
                            alignItems: "center"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    position: "absolute",
                                    left: "18px",
                                    fontSize: "1.3rem",
                                    color: "#94a3b8"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "🔍"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "परीक्षा किंवा नोट्स शोधा (उदा. पोलीस भरती, तलाठी, MPSC)...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                style: {
                                    width: "100%",
                                    padding: "16px 20px 16px 52px",
                                    borderRadius: "14px",
                                    background: "rgba(15, 23, 42, 0.9)",
                                    border: "2px solid rgba(249, 115, 22, 0.4)",
                                    color: "#ffffff",
                                    fontSize: "1.05rem",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
                                },
                                className: "jsx-95a5afb5d854b5cc"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 508,
                                columnNumber: 11
                            }, this),
                            searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSearchQuery(""),
                                style: {
                                    position: "absolute",
                                    right: "16px",
                                    background: "transparent",
                                    color: "#94a3b8",
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                    border: "none"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "center",
                            gap: "30px",
                            flexWrap: "wrap",
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            paddingTop: "24px",
                            maxWidth: "800px",
                            margin: "0 auto"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "1.6rem",
                                            fontWeight: 800,
                                            color: "#34d399"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "५०,०००+"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 546,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "0.85rem",
                                            color: "#94a3b8"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "रोज सराव करणारे विद्यार्थी"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 547,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "1px",
                                    background: "rgba(255, 255, 255, 0.1)"
                                },
                                className: "jsx-95a5afb5d854b5cc"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 549,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "1.6rem",
                                            fontWeight: 800,
                                            color: "#fb923c"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "१००% मोफत"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 551,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "0.85rem",
                                            color: "#94a3b8"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "कोणतीही फी किंवा छुपे शुल्क नाही"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 550,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "1px",
                                    background: "rgba(255, 255, 255, 0.1)"
                                },
                                className: "jsx-95a5afb5d854b5cc"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 554,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "1.6rem",
                                            fontWeight: 800,
                                            color: "#60a5fa"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "Live API"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 556,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "0.85rem",
                                            color: "#94a3b8"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "FastAPI व MongoDB कनेक्टेड"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 555,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 535,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdSlot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                type: "leaderboard",
                title: "Google AdSense Top Leaderboard - Premium Education Banner"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 563,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    margin: "30px 0 30px 0",
                    flexWrap: "wrap",
                    borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                    paddingBottom: "16px"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("mock-tests"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "mock-tests" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "mock-tests" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "mock-tests" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            "📝 सराव परीक्षा (",
                            filteredTests.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 575,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("study-notes"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "study-notes" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "study-notes" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "study-notes" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            "📚 स्टडी मटेरियल व नोट्स (",
                            notes.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("pyqs"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "pyqs" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "pyqs" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "pyqs" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            "📜 मागील प्रश्नपत्रिका (",
                            pyqs.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("leaderboard"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "leaderboard" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "leaderboard" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "leaderboard" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            "🏆 टॉपर लीडरबोर्ड (",
                            leaderboard.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("physical-test"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "physical-test" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "physical-test" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "physical-test" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "🏃 शारीरिक चाचणी (Physical Fitness)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 643,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab("profile"),
                        style: {
                            padding: "12px 20px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: activeTab === "profile" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.8)",
                            color: "#ffffff",
                            border: activeTab === "profile" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: activeTab === "profile" ? "0 4px 20px rgba(249, 115, 22, 0.4)" : "none"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "👤 माझे प्रोफाईल (Profile)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 660,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 566,
                columnNumber: 7
            }, this),
            activeTab === "mock-tests" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "all-tests",
                style: {
                    margin: "20px 0 40px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "10px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontSize: "1.8rem",
                                            color: "#ffffff",
                                            marginBottom: "4px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "📋 उपलब्ध मोफत सराव परीक्षा (Available Free Mock Tests)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 684,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#94a3b8",
                                            fontSize: "0.95rem"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "तुमच्या इच्छित परीक्षेची निवड करा आणि लगेच ऑनलाइन टेस्ट सोडवायला सुरुवात करा."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 687,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 683,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "0.9rem",
                                    color: "#fb923c",
                                    fontWeight: 600
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    "एकूण ",
                                    filteredTests.length,
                                    " टेस्ट उपलब्ध"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 691,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 682,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "10px",
                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",
                            paddingBottom: "12px",
                            marginBottom: "20px",
                            scrollbarWidth: "none",
                            width: "100%",
                            maxWidth: "100%"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory("all"),
                                style: {
                                    flexShrink: 0,
                                    padding: "10px 20px",
                                    borderRadius: "100px",
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "var(--transition)",
                                    background: selectedCategory === "all" ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.7)",
                                    color: "#ffffff",
                                    border: selectedCategory === "all" ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: selectedCategory === "all" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "🔥 सर्व परीक्षा (All Exams)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 708,
                                columnNumber: 13
                            }, this),
                            categories.map((cat)=>{
                                const isSel = selectedCategory === cat.slug;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCategory(cat.slug),
                                    style: {
                                        flexShrink: 0,
                                        padding: "10px 20px",
                                        borderRadius: "100px",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "var(--transition)",
                                        background: isSel ? "var(--primary-gradient)" : "rgba(30, 41, 59, 0.7)",
                                        color: "#ffffff",
                                        border: isSel ? "1px solid #f97316" : "1px solid rgba(255, 255, 255, 0.1)",
                                        boxShadow: isSel ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        cat.icon,
                                        " ",
                                        cat.name,
                                        " (",
                                        cat.totalTests,
                                        ")"
                                    ]
                                }, cat.slug, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 731,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 697,
                        columnNumber: 11
                    }, this),
                    filteredTests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "60px 20px",
                            textAlign: "center",
                            margin: "30px 0"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "3rem",
                                    marginBottom: "12px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "😕"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 758,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: "1.4rem",
                                    color: "#ffffff",
                                    marginBottom: "8px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "कोणतीही परीक्षा सापडली नाही!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 759,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8",
                                    marginBottom: "20px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "सध्या या विभागामध्ये कोणतीही लाईव्ह टेस्ट उपलब्ध नाही किंवा वेगळा शब्द शोधून पहा."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 760,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                children: "🔄 सर्व परीक्षा पहा (View All)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 761,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 757,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-95a5afb5d854b5cc" + " " + "grid-3",
                        children: filteredTests.map((test)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ExamCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                test: test
                            }, test.id, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 768,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 766,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 681,
                columnNumber: 9
            }, this),
            activeTab === "study-notes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "20px 0 40px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "24px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: "1.8rem",
                                    color: "#ffffff",
                                    marginBottom: "6px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "📚 स्टडी मटेरियल, चालू घडामोडी व व्याकरण नोट्स (Live Notes)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 779,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8",
                                    fontSize: "0.95rem"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "परीक्षेसाठी अत्यंत उपयुक्त अशा सविस्तर नोट्स आणि स्टडी मटेरियल मोफत वाचा."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 782,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 778,
                        columnNumber: 11
                    }, this),
                    notes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "60px 20px",
                            textAlign: "center"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "3rem",
                                    marginBottom: "12px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "📭"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 789,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: "1.3rem",
                                    color: "#ffffff"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "सध्या कोणत्याही नोट्स उपलब्ध नाहीत"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 790,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "लवकरच नवीन नोट्स जोडल्या जातील."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 791,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 788,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-95a5afb5d854b5cc" + " " + "grid-3",
                        children: notes.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "12px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.75rem"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-blue",
                                                        children: note.category || "General Study"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 23
                                                    }, this),
                                                    note.createdAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.75rem",
                                                            color: "#64748b"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: note.createdAt.split(" ")[0]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 800,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 798,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: "1.25rem",
                                                    color: "#ffffff",
                                                    marginBottom: "10px",
                                                    lineHeight: "1.4"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: note.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 802,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#cbd5e1",
                                                    fontSize: "0.9rem",
                                                    lineHeight: "1.5",
                                                    marginBottom: "16px",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: note.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 803,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 797,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedNote(note),
                                        style: {
                                            width: "100%",
                                            justifyContent: "center",
                                            marginTop: "10px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                        children: "📖 संपूर्ण नोट्स वाचा (Read Note)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 807,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, note.id, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 796,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 794,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 777,
                columnNumber: 9
            }, this),
            activeTab === "pyqs" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "20px 0 40px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "24px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: "1.8rem",
                                    color: "#ffffff",
                                    marginBottom: "6px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "📜 मागील वर्षांच्या प्रश्नपत्रिका (Previous Year Question Papers - PYQ)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 825,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8",
                                    fontSize: "0.95rem"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "पोलीस भरती व इतर स्पर्धा परीक्षांमध्ये विचारल्या गेलेल्या जुन्या प्रश्नपत्रिका आणि त्यांची उत्तरे."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 828,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 824,
                        columnNumber: 11
                    }, this),
                    pyqs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "60px 20px",
                            textAlign: "center"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "3rem",
                                    marginBottom: "12px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "📂"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 835,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: "1.3rem",
                                    color: "#ffffff"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "सध्या जुन्या प्रश्नपत्रिका लोड होत आहेत"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 836,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "लवकरच सर्व मागील प्रश्नपत्रिका डाउनलोडसाठी उपलब्ध होतील."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 837,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 834,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-95a5afb5d854b5cc" + " " + "grid-3",
                        children: pyqs.map((pyq)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderLeft: "4px solid #f97316"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "12px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.8rem",
                                                            fontWeight: 700
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange",
                                                        children: [
                                                            "वर्ष: ",
                                                            pyq.year
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 845,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "0.75rem"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-blue",
                                                        children: pyq.category || "PYQ Paper"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 846,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 844,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: "1.2rem",
                                                    color: "#ffffff",
                                                    marginBottom: "10px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: pyq.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 848,
                                                columnNumber: 21
                                            }, this),
                                            pyq.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#94a3b8",
                                                    fontSize: "0.85rem",
                                                    marginBottom: "16px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: pyq.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 850,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 843,
                                        columnNumber: 19
                                    }, this),
                                    pyq.pdfUrl && pyq.pdfUrl !== "jsjsjs" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: pyq.pdfUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: {
                                            width: "100%",
                                            justifyContent: "center",
                                            textDecoration: "none"
                                        },
                                        className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                        children: "📥 पेपर डाउनलोड करा (Download PDF)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 854,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>alert("ही प्रश्नपत्रिका लवकरच PDF स्वरूपात उपलब्ध होईल!"),
                                        style: {
                                            width: "100%",
                                            justifyContent: "center"
                                        },
                                        className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                        children: "📄 प्रश्नपत्रिका पहा"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 858,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, pyq.id, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 842,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 840,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 823,
                columnNumber: 9
            }, this),
            activeTab === "leaderboard" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "20px auto 40px auto",
                    maxWidth: "900px"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(124, 45, 18, 0.8) 100%)",
                            border: "2px solid #f97316",
                            borderRadius: "18px",
                            padding: "22px",
                            marginBottom: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "18px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minWidth: "280px",
                                    textAlign: "left"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: "1.25rem",
                                            color: "#ffffff",
                                            marginBottom: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🌟 लीडरबोर्डमध्ये तुमचे नाव पाहायचे आहे का?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 888,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 887,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#cbd5e1",
                                            fontSize: "0.95rem",
                                            lineHeight: "1.6"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: currentUser ? `स्वागत आहे, ${currentUser.name}! तुमचे प्रोफाईल यशस्वीरित्या जोडले गेले आहे. ऑनलाइन सराव परीक्षा सोडवा आणि जास्त गुण मिळवून लीडरबोर्डच्या टॉपवर या!` : "जर तुम्हाला तुमचे नाव या ग्लोबल लीडरबोर्डमध्ये पाहायचे असेल, तर लगेच लॉगिन किंवा मोफत रजिस्ट्रेशन करा आणि तुमचे प्रोफाईल अपडेट करा. सराव परीक्षा सोडवून तुमचे गुण लगेच लीडरबोर्डवर दिसतील!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 890,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 886,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setName(currentUser.name || "");
                                        setMobile(currentUser.mobile || "");
                                        setDistrict(currentUser.district || "");
                                        setAuthMode("profile");
                                        setShowAuthModal(true);
                                    },
                                    style: {
                                        whiteSpace: "nowrap",
                                        padding: "12px 22px",
                                        fontSize: "0.95rem"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                    children: "✏️ प्रोफाईल व जिल्हा संपादित करा"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 898,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setAuthMode("login");
                                        setAuthError("");
                                        setShowAuthModal(true);
                                    },
                                    style: {
                                        whiteSpace: "nowrap",
                                        padding: "12px 26px",
                                        fontSize: "1.05rem",
                                        boxShadow: "0 4px 15px rgba(249, 115, 22, 0.5)"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                    children: "🔑 लॉगिन / रजिस्ट्रेशन करा (Login Now)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 912,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 896,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 873,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            marginBottom: "30px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: "2rem",
                                    color: "#ffffff",
                                    marginBottom: "6px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "🏆 ग्लोबल टॉपर लीडरबोर्ड (Global Top Aspirants)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 924,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8",
                                    fontSize: "0.95rem"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "मिशन वर्दी ॲप व वेब पोर्टलवरील सर्वाधिक गुण मिळवणारे महाराष्ट्रातील टॉप विद्यार्थी!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 927,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 923,
                        columnNumber: 11
                    }, this),
                    leaderboard.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "60px 20px",
                            textAlign: "center"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "3rem",
                                    marginBottom: "12px"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "animate-spin",
                                children: "⏳"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 934,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: "1.3rem",
                                    color: "#ffffff"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "लीडरबोर्ड रँकिंग लोड होत आहे..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 935,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 933,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: "24px",
                            overflowX: "auto"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            style: {
                                width: "100%",
                                borderCollapse: "collapse",
                                textAlign: "left"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        style: {
                                            borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
                                            color: "#fb923c",
                                            fontSize: "0.95rem"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "12px 16px",
                                                    width: "80px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "रँक (Rank)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 942,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "12px 16px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "विद्यार्थ्याचे नाव (Aspirant Name)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 943,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "12px 16px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "जिल्हा (District)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 944,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    padding: "12px 16px",
                                                    textAlign: "right"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "एकूण गुण (Points)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 945,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 941,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 940,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: leaderboard.map((user, idx)=>{
                                        const rank = idx + 1;
                                        let rankBadge = `${rank}`;
                                        let rowStyle = {
                                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                            transition: "background 0.2s"
                                        };
                                        if (rank === 1) {
                                            rankBadge = "🥇 १";
                                            rowStyle = {
                                                ...rowStyle,
                                                background: "rgba(234, 179, 8, 0.15)"
                                            };
                                        } else if (rank === 2) {
                                            rankBadge = "🥈 २";
                                            rowStyle = {
                                                ...rowStyle,
                                                background: "rgba(148, 163, 184, 0.15)"
                                            };
                                        } else if (rank === 3) {
                                            rankBadge = "🥉 ३";
                                            rowStyle = {
                                                ...rowStyle,
                                                background: "rgba(217, 119, 6, 0.15)"
                                            };
                                        }
                                        const isCurrent = currentUser && (currentUser.name === user.name || currentUser.id === user.user_id || currentUser.user_id === user.user_id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: isCurrent ? {
                                                ...rowStyle,
                                                background: "rgba(249, 115, 22, 0.25)",
                                                border: "1px solid #f97316"
                                            } : rowStyle,
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "14px 16px",
                                                        fontWeight: 800,
                                                        fontSize: "1.1rem",
                                                        color: rank <= 3 ? "#fb923c" : "#ffffff"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: rankBadge
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 961,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "14px 16px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "12px"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            user.avatar_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: user.avatar_url,
                                                                alt: user.name,
                                                                style: {
                                                                    width: "36px",
                                                                    height: "36px",
                                                                    borderRadius: "50%",
                                                                    objectFit: "cover",
                                                                    border: "2px solid #fb923c"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 967,
                                                                columnNumber: 31
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: "36px",
                                                                    height: "36px",
                                                                    borderRadius: "50%",
                                                                    background: "var(--primary-gradient)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: 700,
                                                                    color: "#fff"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: user.name ? user.name.charAt(0).toUpperCase() : "U"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 969,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: 700,
                                                                            color: "#ffffff",
                                                                            fontSize: "1rem"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: user.name || "अनामिक विद्यार्थी"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 974,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            marginLeft: "8px",
                                                                            fontSize: "0.7rem",
                                                                            padding: "2px 6px"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange",
                                                                        children: "तुम्ही (You)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 975,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 973,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 964,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "14px 16px",
                                                        color: "#cbd5e1"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: user.district || "महाराष्ट्र"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 979,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        padding: "14px 16px",
                                                        textAlign: "right",
                                                        fontWeight: 800,
                                                        color: "#34d399",
                                                        fontSize: "1.1rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: user.score_str || `${user.points} Points`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 982,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, user.user_id || idx, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 960,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 948,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 939,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 938,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 871,
                columnNumber: 9
            }, this),
            activeTab === "physical-test" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "20px auto 40px auto",
                    maxWidth: "1000px"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            marginBottom: "30px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: "2rem",
                                    color: "#ffffff",
                                    marginBottom: "6px"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "🏃 महाराष्ट्र पोलीस भरती शारीरिक चाचणी ट्रॅकर (Physical Fitness Guide & Logs)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 999,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#94a3b8",
                                    fontSize: "0.95rem"
                                },
                                className: "jsx-95a5afb5d854b5cc",
                                children: "१६०० मीटर धावणे, १०० मीटर धावणे व गोळाफेक चाचणीचे गुण मोजा आणि तुमच्या रोजच्या सराव चाचणीच्या नोंदी ठेवा."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1002,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 998,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            gap: "24px",
                            alignItems: "flex-start"
                        },
                        className: "jsx-95a5afb5d854b5cc" + " " + "grid-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px",
                                    borderLeft: "4px solid #f97316"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: "1.35rem",
                                            color: "#ffffff",
                                            marginBottom: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🎯 शारीरिक चाचणी गुण गणक (Marks Calculator)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1011,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1010,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleAddFitnessLog,
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "16px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "block",
                                                            color: "#cbd5e1",
                                                            fontSize: "0.9rem",
                                                            marginBottom: "6px",
                                                            fontWeight: 600
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "१. १६०० मीटर धावणे (1600m Running - 20 Marks):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1016,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            gap: "10px"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: 1
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: "0.8rem",
                                                                            color: "#94a3b8"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: "मिनिटे (Min):"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1021,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "3",
                                                                        max: "10",
                                                                        value: run1600Min,
                                                                        onChange: (e)=>setRun1600Min(Number(e.target.value)),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            borderRadius: "8px",
                                                                            background: "rgba(15, 23, 42, 0.9)",
                                                                            border: "1px solid #f97316",
                                                                            color: "#fff"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1022,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1020,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: 1
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: "0.8rem",
                                                                            color: "#94a3b8"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: "सेकंद (Sec):"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1025,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "0",
                                                                        max: "59",
                                                                        value: run1600Sec,
                                                                        onChange: (e)=>setRun1600Sec(Number(e.target.value)),
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            borderRadius: "8px",
                                                                            background: "rgba(15, 23, 42, 0.9)",
                                                                            border: "1px solid #f97316",
                                                                            color: "#fff"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1026,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1024,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1019,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1015,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "block",
                                                            color: "#cbd5e1",
                                                            fontSize: "0.9rem",
                                                            marginBottom: "6px",
                                                            fontWeight: 600
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "२. १०० मीटर धावणे (100m Running - 15 Marks):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1032,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "0.8rem",
                                                                    color: "#94a3b8"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: "सेकंद (Sec e.g. 11.5):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1036,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                step: "0.1",
                                                                min: "9",
                                                                max: "25",
                                                                value: run100Sec,
                                                                onChange: (e)=>setRun100Sec(Number(e.target.value)),
                                                                style: {
                                                                    width: "100%",
                                                                    padding: "10px",
                                                                    borderRadius: "8px",
                                                                    background: "rgba(15, 23, 42, 0.9)",
                                                                    border: "1px solid #f97316",
                                                                    color: "#fff"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1037,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1035,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1031,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "block",
                                                            color: "#cbd5e1",
                                                            fontSize: "0.9rem",
                                                            marginBottom: "6px",
                                                            fontWeight: 600
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "३. गोळाफेक (Shot Put - 15 Marks):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1042,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "0.8rem",
                                                                    color: "#94a3b8"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: "अंतर मीटरमध्ये (Meters e.g. 8.50):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1046,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                step: "0.1",
                                                                min: "3",
                                                                max: "15",
                                                                value: shotPutMeters,
                                                                onChange: (e)=>setShotPutMeters(Number(e.target.value)),
                                                                style: {
                                                                    width: "100%",
                                                                    padding: "10px",
                                                                    borderRadius: "8px",
                                                                    background: "rgba(15, 23, 42, 0.9)",
                                                                    border: "1px solid #f97316",
                                                                    color: "#fff"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1047,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1045,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1041,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "block",
                                                            color: "#cbd5e1",
                                                            fontSize: "0.9rem",
                                                            marginBottom: "6px",
                                                            fontWeight: 600
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: "📝 आजच्या सरावाची टीप (Notes/Ground location):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1052,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "उदा. सकाळी ६ वाजता शिवाजी स्टेडियमवर सराव",
                                                        value: fitnessNotes,
                                                        onChange: (e)=>setFitnessNotes(e.target.value),
                                                        style: {
                                                            width: "100%",
                                                            padding: "10px",
                                                            borderRadius: "8px",
                                                            background: "rgba(15, 23, 42, 0.9)",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            color: "#fff"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1055,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1051,
                                                columnNumber: 17
                                            }, this),
                                            (()=>{
                                                const s = calculatePhysicalScore();
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        background: "rgba(30, 41, 59, 0.9)",
                                                        padding: "16px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #34d399",
                                                        marginTop: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                marginBottom: "8px",
                                                                fontSize: "0.85rem",
                                                                color: "#cbd5e1"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: [
                                                                        "१६००मी गुण: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            className: "jsx-95a5afb5d854b5cc",
                                                                            children: [
                                                                                s.score1600,
                                                                                "/20"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1063,
                                                                            columnNumber: 43
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1063,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: [
                                                                        "१००मी गुण: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            className: "jsx-95a5afb5d854b5cc",
                                                                            children: [
                                                                                s.score100,
                                                                                "/15"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1064,
                                                                            columnNumber: 42
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1064,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: [
                                                                        "गोळा गुण: ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            className: "jsx-95a5afb5d854b5cc",
                                                                            children: [
                                                                                s.scoreShot,
                                                                                "/15"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/page.tsx",
                                                                            lineNumber: 1065,
                                                                            columnNumber: 41
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1065,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1062,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                textAlign: "center",
                                                                borderTop: "1px solid rgba(255,255,255,0.1)",
                                                                paddingTop: "10px",
                                                                marginTop: "6px"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "1.05rem",
                                                                        color: "#ffffff",
                                                                        fontWeight: 700
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "तुमचे अंदाजे एकूण शारीरिक गुण: "
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1068,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "1.6rem",
                                                                        color: "#34d399",
                                                                        fontWeight: 800
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: [
                                                                        s.total,
                                                                        " / ५०"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1069,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1067,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1061,
                                                    columnNumber: 21
                                                }, this);
                                            })(),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: fitnessLoading,
                                                style: {
                                                    width: "100%",
                                                    justifyContent: "center",
                                                    padding: "14px",
                                                    fontSize: "1.05rem"
                                                },
                                                className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                                children: fitnessLoading ? "सेव्ह होत आहे..." : currentUser ? "➕ आजची शारीरिक चाचणी नोंद सेव्ह करा (Save Log)" : "🔒 सेव्ह करण्यासाठी प्रथम लॉगिन करा"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1075,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1014,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1009,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "24px"
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "16px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: "1.35rem",
                                                    color: "#ffffff",
                                                    margin: 0
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "📊 तुमची शारीरिक प्रगती व नोंदी (History)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1084,
                                                columnNumber: 17
                                            }, this),
                                            currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "0.8rem"
                                                },
                                                className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-blue",
                                                children: [
                                                    fitnessLogs.length,
                                                    " नोंदी"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1087,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1083,
                                        columnNumber: 15
                                    }, this),
                                    !currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: "center",
                                            padding: "40px 20px",
                                            background: "rgba(15, 23, 42, 0.6)",
                                            borderRadius: "14px",
                                            border: "1px dashed rgba(255,255,255,0.2)"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "3rem",
                                                    marginBottom: "12px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "🔒"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1092,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: "1.2rem",
                                                    color: "#ffffff",
                                                    marginBottom: "8px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "तुमचा सराव इतिहास पाहण्यासाठी लॉगिन करा"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1093,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#94a3b8",
                                                    fontSize: "0.9rem",
                                                    marginBottom: "20px",
                                                    lineHeight: "1.5"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "लॉगिन केल्यानंतर तुम्ही दररोज केलेल्या धावणे व गोळाफेक सरावाच्या सर्व नोंदी येथे सुरक्षित राहतील."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1094,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setAuthMode("login");
                                                    setShowAuthModal(true);
                                                },
                                                style: {
                                                    margin: "0 auto"
                                                },
                                                className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                                children: "🔑 लगेच लॉगिन करा (Login Now)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1091,
                                        columnNumber: 17
                                    }, this) : fitnessLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: "center",
                                            padding: "40px 20px",
                                            background: "rgba(15, 23, 42, 0.6)",
                                            borderRadius: "14px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "3rem",
                                                    marginBottom: "12px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "📝"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1103,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    fontSize: "1.2rem",
                                                    color: "#ffffff",
                                                    marginBottom: "8px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "अद्याप कोणतीही शारीरिक नोंद केलेली नाही"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1104,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#94a3b8",
                                                    fontSize: "0.9rem"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "डावीकडील गणक वापरून तुमची पहिली शारीरिक चाचणी नोंद सेव्ह करा!"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1105,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1102,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px",
                                            maxHeight: "520px",
                                            overflowY: "auto",
                                            paddingRight: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: fitnessLogs.map((log, idx)=>{
                                            const min = Math.floor((log.run_1600m_seconds || 300) / 60);
                                            const sec = (log.run_1600m_seconds || 300) % 60;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: "rgba(15, 23, 42, 0.8)",
                                                    padding: "14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                                    position: "relative"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            marginBottom: "8px",
                                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                                            paddingBottom: "6px"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: "#fb923c",
                                                                    fontWeight: 700,
                                                                    fontSize: "0.9rem"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    "📅 दिनांक: ",
                                                                    log.date || log.created_at?.split("T")[0] || "आज"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1117,
                                                                columnNumber: 27
                                                            }, this),
                                                            log.id || log._id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: async ()=>{
                                                                    if (confirm("ही नोंद डिलीट करायची आहे का?")) {
                                                                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteFitnessLogApi"])(log.id || log._id);
                                                                        const logs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFitnessLogsApi"])(currentUser.user_id || currentUser.id);
                                                                        setFitnessLogs(logs);
                                                                    }
                                                                },
                                                                style: {
                                                                    background: "transparent",
                                                                    color: "#ef4444",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    fontSize: "0.85rem"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: "🗑️ डिलीट"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1119,
                                                                columnNumber: 29
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1116,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr 1fr 1fr",
                                                            gap: "8px",
                                                            fontSize: "0.85rem",
                                                            color: "#cbd5e1"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    "🏃 १६००मी: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            min,
                                                                            " मि ",
                                                                            sec,
                                                                            " से"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1134,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1134,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    "⚡ १००मी: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            log.run_100m_seconds || 12,
                                                                            " से"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1135,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1135,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    "🤾 गोळा: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            log.shot_put_meters || 8,
                                                                            " मी"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1136,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1136,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1133,
                                                        columnNumber: 25
                                                    }, this),
                                                    log.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginTop: "8px",
                                                            fontSize: "0.8rem",
                                                            color: "#94a3b8",
                                                            fontStyle: "italic"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            "💬 ",
                                                            log.notes
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1139,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, log.id || log._id || idx, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1115,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1110,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1082,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1007,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 997,
                columnNumber: 9
            }, this),
            activeTab === "profile" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "20px 0 40px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: !currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "60px 30px",
                        textAlign: "center",
                        maxWidth: "700px",
                        margin: "40px auto",
                        border: "1px solid rgba(249, 115, 22, 0.5)",
                        background: "linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    },
                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card animate-scale-up",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: "4.5rem",
                                marginBottom: "16px"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: "🔒"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1158,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: "2rem",
                                color: "#ffffff",
                                marginBottom: "12px",
                                fontWeight: 800
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: "तुमचे वैयक्तिक स्टडी प्रोफाईल (User Profile Hub)"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1159,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: "#cbd5e1",
                                fontSize: "1.05rem",
                                lineHeight: "1.6",
                                marginBottom: "30px",
                                maxWidth: "550px",
                                margin: "0 auto 30px auto"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: "मोबाईल ॲपप्रमाणेच तुमचे लीडरबोर्ड रँकिंग, सराव परीक्षांचे गुण आणि शारीरिक चाचणीच्या सर्व नोंदी एकाच ठिकाणी पाहण्यासाठी कृपया खात्यात प्रवेश करा किंवा मोफत नोंदणी करा."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1162,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: "16px",
                                justifyContent: "center",
                                flexWrap: "wrap"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setAuthMode("login");
                                        setAuthError("");
                                        setShowAuthModal(true);
                                    },
                                    style: {
                                        padding: "14px 32px",
                                        fontSize: "1.1rem",
                                        fontWeight: 800,
                                        borderRadius: "14px",
                                        boxShadow: "0 6px 20px rgba(249, 115, 22, 0.5)"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                    children: "🔑 खात्यात लॉगिन करा (Login Now)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1166,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setAuthMode("register");
                                        setAuthError("");
                                        setShowAuthModal(true);
                                    },
                                    style: {
                                        padding: "14px 32px",
                                        fontSize: "1.1rem",
                                        fontWeight: 800,
                                        borderRadius: "14px",
                                        borderColor: "#f97316",
                                        color: "#fb923c"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                    children: "📝 मोफत नवीन नोंदणी (Free Register)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1173,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1165,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1157,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-95a5afb5d854b5cc",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "36px",
                                marginBottom: "30px",
                                background: "linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(124, 45, 18, 0.6) 100%)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "24px"
                            },
                            className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "24px",
                                        flexWrap: "wrap"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: "90px",
                                                height: "90px",
                                                borderRadius: "50%",
                                                background: "var(--primary-gradient)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "2.8rem",
                                                fontWeight: 900,
                                                color: "#fff",
                                                boxShadow: "0 0 25px rgba(249, 115, 22, 0.6)",
                                                border: "3px solid rgba(255,255,255,0.3)"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "👮"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1198,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            style: {
                                                                fontSize: "2.2rem",
                                                                color: "#ffffff",
                                                                fontWeight: 900,
                                                                margin: 0
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: currentUser.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1216,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            title: "Verified Aspirant",
                                                            style: {
                                                                fontSize: "1.4rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "👑"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1219,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: "#e2e8f0",
                                                        fontSize: "1rem",
                                                        marginBottom: "8px",
                                                        display: "flex",
                                                        gap: "16px",
                                                        flexWrap: "wrap"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                "📧 ",
                                                                currentUser.email
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 23
                                                        }, this),
                                                        currentUser.mobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                "📱 ",
                                                                currentUser.mobile
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1223,
                                                            columnNumber: 46
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                "📍 जिल्हा: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    style: {
                                                                        color: "#fb923c"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: currentUser.district || "महाराष्ट्र"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1224,
                                                                    columnNumber: 40
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1224,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1221,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: "0.8rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange",
                                                    children: "🎯 महाराष्ट्र पोलीस व तलाठी भरती उमेदवार"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1226,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1214,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1197,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "12px",
                                        flexWrap: "wrap"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setName(currentUser.name || "");
                                                setMobile(currentUser.mobile || "");
                                                setDistrict(currentUser.district || "");
                                                setAuthMode("profile");
                                                setShowAuthModal(true);
                                            },
                                            style: {
                                                padding: "12px 22px",
                                                fontSize: "0.95rem",
                                                fontWeight: 700
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                            children: "✏️ माहिती व जिल्हा संपादित करा"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1233,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleLogout,
                                            style: {
                                                padding: "12px 22px",
                                                fontSize: "0.95rem",
                                                fontWeight: 700,
                                                borderColor: "#ef4444",
                                                color: "#ef4444"
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                            children: "🚪 लॉग आउट करा"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1246,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1232,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1185,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "30px"
                            },
                            className: "jsx-95a5afb5d854b5cc" + " " + "grid-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "26px",
                                        borderLeft: "4px solid #f97316"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "2.5rem",
                                                marginBottom: "8px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🏆"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1259,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                color: "#94a3b8",
                                                fontSize: "0.95rem",
                                                marginBottom: "6px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "लीडरबोर्ड स्थिती (Leaderboard)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1260,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "1.8rem",
                                                color: "#ffffff",
                                                fontWeight: 800,
                                                marginBottom: "4px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: (()=>{
                                                const idx = leaderboard.findIndex((l)=>l.name === currentUser.name || l.user_id === (currentUser.user_id || currentUser.id));
                                                return idx !== -1 ? `#${idx + 1} रँक` : "सहभागी व्हा";
                                            })()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1261,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#cbd5e1",
                                                fontSize: "0.8rem"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: (()=>{
                                                const idx = leaderboard.findIndex((l)=>l.name === currentUser.name || l.user_id === (currentUser.user_id || currentUser.id));
                                                return idx !== -1 ? `टॉप १० मध्ये तुमची रँक #${idx + 1}` : "सराव परीक्षा सोडवून गुण मिळवा";
                                            })()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1258,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "26px",
                                        borderLeft: "4px solid #3b82f6"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "2.5rem",
                                                marginBottom: "8px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🏃"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1276,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                color: "#94a3b8",
                                                fontSize: "0.95rem",
                                                marginBottom: "6px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "शारीरिक चाचणी नोंदी (Fitness Logs)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "1.8rem",
                                                color: "#ffffff",
                                                fontWeight: 800,
                                                marginBottom: "4px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                fitnessLogs.length,
                                                " नोंदी"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1278,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#cbd5e1",
                                                fontSize: "0.8rem"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: fitnessLogs.length > 0 ? `सर्वोच्च गुण: ${Math.max(...fitnessLogs.map((f)=>getFitnessLogMarks(f).total))} / ५०` : "अद्याप कोणतीही नोंद केलेली नाही"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1281,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1275,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "26px",
                                        borderLeft: "4px solid #10b981"
                                    },
                                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "2.5rem",
                                                marginBottom: "8px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "📝"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1289,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                color: "#94a3b8",
                                                fontSize: "0.95rem",
                                                marginBottom: "6px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "सराव परीक्षा (Mock Tests)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1290,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "1.8rem",
                                                color: "#ffffff",
                                                fontWeight: 800,
                                                marginBottom: "4px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                tests.length,
                                                "+ टेस्ट उपलब्ध"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1291,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#cbd5e1",
                                                fontSize: "0.8rem"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "TCS / IBPS पॅटर्ननुसार नियमित सराव"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1294,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1288,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1257,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: "30px"
                            },
                            className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontSize: "1.4rem",
                                                        color: "#ffffff",
                                                        marginBottom: "4px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "📜 माझी शारीरिक चाचणी प्रगती (Fitness Activity History)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1304,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#94a3b8",
                                                        fontSize: "0.9rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "तुमच्या रोजच्या १६०० मीटर, १०० मीटर व गोळाफेक सरावाच्या नोंदी."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1307,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1303,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab("physical-test"),
                                            style: {
                                                padding: "10px 18px",
                                                fontSize: "0.9rem",
                                                fontWeight: 700
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                            children: "➕ नवीन शारीरिक चाचणी नोंद करा ➡"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1311,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1302,
                                    columnNumber: 17
                                }, this),
                                fitnessLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: "center",
                                        padding: "40px 20px",
                                        background: "rgba(0,0,0,0.25)",
                                        borderRadius: "16px",
                                        border: "1px dashed rgba(255,255,255,0.15)"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "2.5rem",
                                                marginBottom: "10px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "📭"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1322,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                color: "#fff",
                                                fontSize: "1.1rem",
                                                marginBottom: "6px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "अद्याप एकही शारीरिक चाचणी नोंद नाही"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1323,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#94a3b8",
                                                fontSize: "0.9rem",
                                                marginBottom: "16px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "तुमची रोजची धावण्याची वेळ आणि गोळाफेक अंतर मोजा आणि येथे सेव्ह करा."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1324,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab("physical-test"),
                                            style: {
                                                padding: "8px 16px",
                                                fontSize: "0.85rem"
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                            children: "🏃 गुण मोजा आणि नोंद सेव्ह करा"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1327,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1321,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        overflowX: "auto"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        style: {
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            color: "#e2e8f0"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        background: "rgba(15, 23, 42, 0.8)",
                                                        textAlign: "left",
                                                        borderBottom: "2px solid #f97316"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "14px",
                                                                fontSize: "0.9rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "तारीख (Date)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1336,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "14px",
                                                                fontSize: "0.9rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "१६०० मीटर (वेळ व गुण)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1337,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "14px",
                                                                fontSize: "0.9rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "१०० मीटर (वेळ व गुण)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1338,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "14px",
                                                                fontSize: "0.9rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "गोळाफेक (अंतर व गुण)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1339,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "14px",
                                                                fontSize: "0.9rem",
                                                                textAlign: "right"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "एकूण गुण (Total)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1340,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1335,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1334,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: fitnessLogs.map((log, idx)=>{
                                                    const min = Math.floor((log.run_1600m_seconds || 300) / 60);
                                                    const sec = (log.run_1600m_seconds || 300) % 60;
                                                    const marks = getFitnessLogMarks(log);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                                                        },
                                                        className: "jsx-95a5afb5d854b5cc",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "14px",
                                                                    fontWeight: 600
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: log.date || log.created_at?.split("T")[0] || "आज"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1350,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "14px"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    min,
                                                                    "मि ",
                                                                    sec,
                                                                    "से ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                        className: "jsx-95a5afb5d854b5cc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1352,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: "#fb923c",
                                                                            fontSize: "0.85rem"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            "(",
                                                                            marks.score1600,
                                                                            " गुण)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1352,
                                                                        columnNumber: 55
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1351,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "14px"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    log.run_100m_seconds || 12,
                                                                    " सेकंद ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                        className: "jsx-95a5afb5d854b5cc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1355,
                                                                        columnNumber: 68
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: "#fb923c",
                                                                            fontSize: "0.85rem"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            "(",
                                                                            marks.score100,
                                                                            " गुण)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1355,
                                                                        columnNumber: 74
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1354,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "14px"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: [
                                                                    log.shot_put_meters || 8,
                                                                    " मीटर ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                        className: "jsx-95a5afb5d854b5cc"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1358,
                                                                        columnNumber: 65
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: "#fb923c",
                                                                            fontSize: "0.85rem"
                                                                        },
                                                                        className: "jsx-95a5afb5d854b5cc",
                                                                        children: [
                                                                            "(",
                                                                            marks.scoreShot,
                                                                            " गुण)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/page.tsx",
                                                                        lineNumber: 1358,
                                                                        columnNumber: 71
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1357,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "14px",
                                                                    textAlign: "right"
                                                                },
                                                                className: "jsx-95a5afb5d854b5cc",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        display: "inline-block",
                                                                        padding: "6px 14px",
                                                                        background: "rgba(249, 115, 22, 0.2)",
                                                                        color: "#fb923c",
                                                                        borderRadius: "100px",
                                                                        fontWeight: 800,
                                                                        fontSize: "1rem",
                                                                        border: "1px solid #f97316"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: [
                                                                        "🎯 ",
                                                                        marks.total,
                                                                        " / ५०"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1361,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.tsx",
                                                                lineNumber: 1360,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, log.id || log._id || idx, true, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 1349,
                                                        columnNumber: 29
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1343,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1333,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1332,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1301,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1183,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1155,
                columnNumber: 9
            }, this),
            selectedNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.85)",
                    backdropFilter: "blur(10px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: "100%",
                        maxWidth: "800px",
                        maxHeight: "85vh",
                        overflowY: "auto",
                        padding: "30px",
                        position: "relative",
                        border: "1px solid rgba(249, 115, 22, 0.5)",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8)"
                    },
                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedNote(null),
                            style: {
                                position: "absolute",
                                top: "20px",
                                right: "20px",
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1404,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                marginBottom: "12px",
                                display: "inline-block"
                            },
                            className: "jsx-95a5afb5d854b5cc" + " " + "badge badge-orange",
                            children: selectedNote.category || "Study Material"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1426,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: "1.8rem",
                                color: "#ffffff",
                                marginBottom: "10px",
                                lineHeight: "1.3"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: selectedNote.title
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1429,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: "#94a3b8",
                                fontSize: "0.95rem",
                                marginBottom: "20px",
                                fontStyle: "italic",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                paddingBottom: "16px"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: selectedNote.description
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1432,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                color: "#e2e8f0",
                                fontSize: "1.05rem",
                                lineHeight: "1.8",
                                whiteSpace: "pre-wrap",
                                background: "rgba(15, 23, 42, 0.6)",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.05)"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: selectedNote.content || "या नोट्सचा सविस्तर मजकूर लवकरच अपडेट केला जाईल."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1436,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: "24px",
                                textAlign: "right"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedNote(null),
                                className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                children: "✓ बंद करा (Close)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1450,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1449,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1394,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1380,
                columnNumber: 9
            }, this),
            showAuthModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.88)",
                    backdropFilter: "blur(16px)",
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    overflowY: "auto"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: "100%",
                        maxWidth: "920px",
                        padding: "0",
                        position: "relative",
                        border: "1px solid rgba(249, 115, 22, 0.4)",
                        boxShadow: "0 0 80px rgba(249, 115, 22, 0.25), 0 30px 60px rgba(0, 0, 0, 0.95)",
                        borderRadius: "28px",
                        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
                        display: "flex",
                        flexWrap: "wrap",
                        overflow: "hidden"
                    },
                    className: "jsx-95a5afb5d854b5cc" + " " + "glass-card animate-scale-up",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: "1 1 350px",
                                background: "linear-gradient(145deg, #1e3a8a 0%, #7c2d12 100%)",
                                padding: "40px 30px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                position: "relative",
                                borderRight: "1px solid rgba(255, 255, 255, 0.1)"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "inline-block",
                                                padding: "8px 16px",
                                                background: "rgba(255, 255, 255, 0.15)",
                                                borderRadius: "100px",
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                                color: "#fff",
                                                marginBottom: "20px",
                                                backdropFilter: "blur(5px)",
                                                border: "1px solid rgba(255, 255, 255, 0.2)"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🇮🇳 महाराष्ट्र पोलीस व तलाठी भरती"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1500,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontSize: "2.2rem",
                                                fontWeight: 900,
                                                color: "#ffffff",
                                                lineHeight: "1.2",
                                                marginBottom: "16px",
                                                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                "मिशन वर्दी ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1504,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: "#fb923c"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "स्टडी पोर्टल"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1504,
                                                    columnNumber: 36
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1503,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#e2e8f0",
                                                fontSize: "1rem",
                                                lineHeight: "1.6",
                                                marginBottom: "30px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "महाराष्ट्रातील लाखो विद्यार्थ्यांसोबत स्पर्धा करा, तुमचे गुण तपासा आणि वर्दीचे स्वप्न साकार करा!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1506,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "16px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "12px",
                                                        background: "rgba(0,0,0,0.25)",
                                                        padding: "12px 16px",
                                                        borderRadius: "14px",
                                                        border: "1px solid rgba(255,255,255,0.1)"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "1.5rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "🏆"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1512,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#fff",
                                                                        fontWeight: 700,
                                                                        fontSize: "0.95rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "ग्लोबल लीडरबोर्ड रँकिंग"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1514,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#cbd5e1",
                                                                        fontSize: "0.8rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "महाराष्ट्रातील टॉप विद्यार्थ्यांमध्ये तुमचे नाव पहा"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1515,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1513,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1511,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "12px",
                                                        background: "rgba(0,0,0,0.25)",
                                                        padding: "12px 16px",
                                                        borderRadius: "14px",
                                                        border: "1px solid rgba(255,255,255,0.1)"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "1.5rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "🏃"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1520,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#fff",
                                                                        fontWeight: 700,
                                                                        fontSize: "0.95rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "फिजिकल चाचणी गुण गणक"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1522,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#cbd5e1",
                                                                        fontSize: "0.8rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "५० पैकी तुमचे शारीरिक चाचणी गुण लगेच मोजा"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1523,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1521,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1519,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "12px",
                                                        background: "rgba(0,0,0,0.25)",
                                                        padding: "12px 16px",
                                                        borderRadius: "14px",
                                                        border: "1px solid rgba(255,255,255,0.1)"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "1.5rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "⚡"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1528,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#fff",
                                                                        fontWeight: 700,
                                                                        fontSize: "0.95rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "१००% मोफत सराव परीक्षा"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1530,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#cbd5e1",
                                                                        fontSize: "0.8rem"
                                                                    },
                                                                    className: "jsx-95a5afb5d854b5cc",
                                                                    children: "TCS / IBPS पॅटर्ननुसार दररोज नवीन टेस्ट"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.tsx",
                                                                    lineNumber: 1531,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1529,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1527,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1510,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1499,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: "30px",
                                        paddingTop: "20px",
                                        borderTop: "1px solid rgba(255,255,255,0.15)",
                                        color: "#cbd5e1",
                                        fontSize: "0.85rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "🔒 सुरक्षित व खात्रीशीर • १ लाख+ विद्यार्थ्यांचा विश्वास"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1538,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1537,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1489,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: "1 1 420px",
                                padding: "40px 36px",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                background: "rgba(15, 23, 42, 0.6)"
                            },
                            className: "jsx-95a5afb5d854b5cc",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAuthModal(false),
                                    style: {
                                        position: "absolute",
                                        top: "20px",
                                        right: "20px",
                                        background: "rgba(255, 255, 255, 0.08)",
                                        color: "#94a3b8",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        fontSize: "1.1rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.2s"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1552,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: "24px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                fontSize: "1.8rem",
                                                fontWeight: 800,
                                                color: "#ffffff",
                                                marginBottom: "6px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                authMode === "login" && "स्वागत आहे! (Welcome Back)",
                                                authMode === "register" && "मोफत नोंदणी (Create Account)",
                                                authMode === "profile" && "माझे प्रोफाईल (Edit Profile)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1576,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#94a3b8",
                                                fontSize: "0.95rem"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                authMode === "login" && "तुमच्या खात्यात लॉगिन करा आणि सराव सुरू करा.",
                                                authMode === "register" && "केवळ १ मिनिटात तुमची नोंदणी पूर्ण करा आणि लीडरबोर्डवर या.",
                                                authMode === "profile" && "तुमचे नाव व जिल्हा लीडरबोर्डसाठी अपडेट ठेवा."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1581,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1575,
                                    columnNumber: 15
                                }, this),
                                authMode !== "profile" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "8px",
                                        marginBottom: "26px",
                                        background: "rgba(0, 0, 0, 0.4)",
                                        padding: "6px",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(255, 255, 255, 0.1)"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setAuthMode("login");
                                                setAuthError("");
                                            },
                                            style: {
                                                flex: 1,
                                                padding: "12px",
                                                borderRadius: "12px",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                cursor: "pointer",
                                                border: "none",
                                                background: authMode === "login" ? "var(--primary-gradient)" : "transparent",
                                                color: "#fff",
                                                transition: "all 0.3s",
                                                boxShadow: authMode === "login" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "🔑 लॉगिन (Login)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1591,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setAuthMode("register");
                                                setAuthError("");
                                            },
                                            style: {
                                                flex: 1,
                                                padding: "12px",
                                                borderRadius: "12px",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                cursor: "pointer",
                                                border: "none",
                                                background: authMode === "register" ? "var(--primary-gradient)" : "transparent",
                                                color: "#fff",
                                                transition: "all 0.3s",
                                                boxShadow: authMode === "register" ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "📝 नवीन नोंदणी (Register)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1598,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1590,
                                    columnNumber: 17
                                }, this),
                                authError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "rgba(239, 68, 68, 0.2)",
                                        border: "1px solid #ef4444",
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        color: "#fecaca",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        marginBottom: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: "⚠️"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1610,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: authError
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1611,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1609,
                                    columnNumber: 17
                                }, this),
                                authMode === "login" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleLogin,
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "📧 ईमेल पत्ता (Email):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1618,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    required: true,
                                                    placeholder: "name@example.com",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "14px 16px",
                                                        borderRadius: "14px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "1rem",
                                                        transition: "border 0.2s"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1619,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1617,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "🔒 पासवर्ड (Password):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1622,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    required: true,
                                                    placeholder: "••••••••",
                                                    value: password,
                                                    onChange: (e)=>setPassword(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "14px 16px",
                                                        borderRadius: "14px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "1rem",
                                                        transition: "border 0.2s"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1623,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1621,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: authLoading,
                                            style: {
                                                width: "100%",
                                                justifyContent: "center",
                                                padding: "16px",
                                                marginTop: "10px",
                                                fontSize: "1.1rem",
                                                fontWeight: 800,
                                                borderRadius: "14px",
                                                boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)"
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                            children: authLoading ? "लॉगिन होत आहे..." : "🔑 खात्यात प्रवेश करा (Login Now)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1625,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: "center",
                                                marginTop: "12px",
                                                fontSize: "0.95rem",
                                                color: "#94a3b8"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                "खाते नाही? ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    onClick: ()=>{
                                                        setAuthMode("register");
                                                        setAuthError("");
                                                    },
                                                    style: {
                                                        color: "#fb923c",
                                                        cursor: "pointer",
                                                        fontWeight: 700,
                                                        textDecoration: "underline"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "मोफत नवीन खाते उघडा ➡"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 32
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1628,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1616,
                                    columnNumber: 17
                                }, this),
                                authMode === "register" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleRegister,
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "👤 पूर्ण नाव (Full Name):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1637,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    required: true,
                                                    placeholder: "उदा. राहुल शर्मा",
                                                    value: name,
                                                    onChange: (e)=>setName(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        borderRadius: "12px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "0.95rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1638,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1636,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "📧 ईमेल पत्ता (Email):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1641,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    required: true,
                                                    placeholder: "name@example.com",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        borderRadius: "12px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "0.95rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1642,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1640,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "🔒 पासवर्ड तयार करा (Password):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1645,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    required: true,
                                                    placeholder: "कमीत कमी ६ अक्षरे",
                                                    value: password,
                                                    onChange: (e)=>setPassword(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        borderRadius: "12px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "0.95rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1646,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1644,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                gap: "10px",
                                                flexWrap: "wrap"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: "1 1 160px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: "block",
                                                                color: "#e2e8f0",
                                                                fontSize: "0.9rem",
                                                                fontWeight: 600,
                                                                marginBottom: "6px"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "📱 मोबाईल नंबर:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1650,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            placeholder: "9876543210",
                                                            value: mobile,
                                                            onChange: (e)=>setMobile(e.target.value),
                                                            style: {
                                                                width: "100%",
                                                                padding: "12px 16px",
                                                                borderRadius: "12px",
                                                                background: "rgba(0, 0, 0, 0.4)",
                                                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                                                color: "#fff",
                                                                fontSize: "0.95rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1651,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1649,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: "1 1 160px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: "block",
                                                                color: "#e2e8f0",
                                                                fontSize: "0.9rem",
                                                                fontWeight: 600,
                                                                marginBottom: "6px"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc",
                                                            children: "📍 जिल्हा (District):"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1654,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "उदा. पुणे",
                                                            value: district,
                                                            onChange: (e)=>setDistrict(e.target.value),
                                                            style: {
                                                                width: "100%",
                                                                padding: "12px 16px",
                                                                borderRadius: "12px",
                                                                background: "rgba(0, 0, 0, 0.4)",
                                                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                                                color: "#fff",
                                                                fontSize: "0.95rem"
                                                            },
                                                            className: "jsx-95a5afb5d854b5cc"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 1655,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1653,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1648,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: authLoading,
                                            style: {
                                                width: "100%",
                                                justifyContent: "center",
                                                padding: "14px",
                                                marginTop: "8px",
                                                fontSize: "1.1rem",
                                                fontWeight: 800,
                                                borderRadius: "14px",
                                                boxShadow: "0 8px 25px rgba(249, 115, 22, 0.4)"
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                            children: authLoading ? "रजिस्ट्रेशन होत आहे..." : "✓ मोफत नोंदणी करा (Register Now)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1658,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: "center",
                                                marginTop: "10px",
                                                fontSize: "0.95rem",
                                                color: "#94a3b8"
                                            },
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                "आधीच खाते आहे? ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    onClick: ()=>{
                                                        setAuthMode("login");
                                                        setAuthError("");
                                                    },
                                                    style: {
                                                        color: "#fb923c",
                                                        cursor: "pointer",
                                                        fontWeight: 700,
                                                        textDecoration: "underline"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "लॉगिन करा ➡"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1662,
                                                    columnNumber: 36
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1661,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1635,
                                    columnNumber: 17
                                }, this),
                                authMode === "profile" && currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleUpdateProfile,
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px"
                                    },
                                    className: "jsx-95a5afb5d854b5cc",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "👤 तुमचे नाव (Name):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1670,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    required: true,
                                                    value: name,
                                                    onChange: (e)=>setName(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "14px 16px",
                                                        borderRadius: "14px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid #f97316",
                                                        color: "#fff",
                                                        fontSize: "1rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1671,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1669,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "📱 मोबाईल नंबर (Mobile):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1674,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "tel",
                                                    value: mobile,
                                                    onChange: (e)=>setMobile(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "14px 16px",
                                                        borderRadius: "14px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                        color: "#fff",
                                                        fontSize: "1rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1675,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1673,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-95a5afb5d854b5cc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: "block",
                                                        color: "#e2e8f0",
                                                        fontSize: "0.9rem",
                                                        fontWeight: 600,
                                                        marginBottom: "6px"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "📍 तुमचा जिल्हा (District for Leaderboard):"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1678,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: district,
                                                    onChange: (e)=>setDistrict(e.target.value),
                                                    style: {
                                                        width: "100%",
                                                        padding: "14px 16px",
                                                        borderRadius: "14px",
                                                        background: "rgba(0, 0, 0, 0.4)",
                                                        border: "1px solid #f97316",
                                                        color: "#fff",
                                                        fontSize: "1rem"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1677,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: authLoading,
                                            style: {
                                                width: "100%",
                                                justifyContent: "center",
                                                padding: "16px",
                                                marginTop: "10px",
                                                fontSize: "1.1rem",
                                                fontWeight: 800,
                                                borderRadius: "14px"
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-primary",
                                            children: authLoading ? "अपडेट होत आहे..." : "✓ बदल सेव्ह करा (Save Profile)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1681,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleLogout,
                                            style: {
                                                width: "100%",
                                                justifyContent: "center",
                                                padding: "14px",
                                                color: "#ef4444",
                                                borderColor: "#ef4444",
                                                fontSize: "1.05rem",
                                                fontWeight: 700
                                            },
                                            className: "jsx-95a5afb5d854b5cc" + " " + "btn btn-outline",
                                            children: "🚪 लॉग आउट करा (Logout)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 1684,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 1668,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 1543,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 1475,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1460,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdSlot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                type: "infeed",
                title: "Google AdSense In-Feed Responsive Banner"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1700,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    margin: "60px 0 40px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: "1.8rem",
                            color: "#ffffff",
                            marginBottom: "24px",
                            textAlign: "center"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "🏆 महाराष्ट्र स्पर्धा परीक्षा तयारी (Exam Categories Overview)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1704,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-95a5afb5d854b5cc" + " " + "grid-2",
                        children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "18px",
                                    borderLeft: `4px solid ${cat.colorTheme}`
                                },
                                className: "jsx-95a5afb5d854b5cc" + " " + "glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: "56px",
                                            height: "56px",
                                            borderRadius: "14px",
                                            background: "rgba(255, 255, 255, 0.05)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "2rem",
                                            flexShrink: 0
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: cat.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1716,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/mock-test/${cat.slug}`,
                                                style: {
                                                    textDecoration: "none"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontSize: "1.25rem",
                                                        color: "#ffffff",
                                                        marginBottom: "6px",
                                                        transition: "var(--transition)"
                                                    },
                                                    className: "jsx-95a5afb5d854b5cc" + " " + "hover-orange",
                                                    children: [
                                                        cat.name,
                                                        " (",
                                                        cat.totalTests,
                                                        "+ सराव पेपर)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1731,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1730,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "0.85rem",
                                                    color: "#94a3b8",
                                                    marginBottom: "8px",
                                                    fontWeight: 500
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: cat.nameEn
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1735,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.95rem",
                                                    color: "#cbd5e1",
                                                    lineHeight: "1.5",
                                                    marginBottom: "14px"
                                                },
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: cat.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1738,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/mock-test/${cat.slug}`,
                                                style: {
                                                    color: "#fb923c",
                                                    fontWeight: 700,
                                                    fontSize: "0.9rem",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-95a5afb5d854b5cc",
                                                    children: "सर्व टेस्ट पहा (Explore Tests) ➡"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 1742,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1741,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1729,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, cat.slug, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1710,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1708,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1703,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "faq-section",
                style: {
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "40px 30px",
                    margin: "60px 0 20px 0"
                },
                className: "jsx-95a5afb5d854b5cc",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: "1.7rem",
                            color: "#ffffff",
                            marginBottom: "16px",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                            paddingBottom: "12px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: "❓ वारंवार विचारले जाणारे प्रश्न (Frequently Asked Questions - FAQ)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1758,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            marginTop: "24px"
                        },
                        className: "jsx-95a5afb5d854b5cc",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: "1.15rem",
                                            color: "#fb923c",
                                            marginBottom: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "१. मिशन वर्दी (Mission Vardi) पोर्टलवर कोणकोणत्या परीक्षेसाठी मोफत मॉक टेस्ट उपलब्ध आहेत?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1764,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#cbd5e1",
                                            fontSize: "0.95rem",
                                            lineHeight: "1.6"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            "मिशन वर्दी मॉक टेस्ट पोर्टलवर ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "महाराष्ट्र पोलीस भरती (Police Bharti 2026), तलाठी भरती (Talathi Bharti), MPSC राज्यसेवा व संयुक्त परीक्षा, जिल्हा परिषद भरती (ZP Bharti), आरोग्य विभाग आणि नगर परिषद"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1768,
                                                columnNumber: 45
                                            }, this),
                                            " परीक्षेसाठी टीसीएस (TCS) व आयबीपीएस (IBPS) पॅटर्ननुसार संपूर्ण मोफत ऑनलाइन सराव परीक्षा उपलब्ध आहेत."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1767,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1763,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: "1.15rem",
                                            color: "#fb923c",
                                            marginBottom: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "२. ऑनलाइन टेस्ट सोडवल्यानंतर निकाल व स्पष्टीकरण लगेच मिळते का?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1773,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#cbd5e1",
                                            fontSize: "0.95rem",
                                            lineHeight: "1.6"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            "होय! प्रत्येक टेस्ट सबमिट केल्याबरोबर तुम्हाला तुमचे एकूण प्राप्त गुण (Score), अचूकता (Accuracy percentage), बरोबर व चुकलेले प्रश्न, तसेच प्रत्येक प्रश्नाचे ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "सविस्तर उत्तर व स्पष्टीकरण (Detailed Explanations)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1777,
                                                columnNumber: 172
                                            }, this),
                                            " स्क्रीनवर लगेच पाहायला मिळते."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1776,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1772,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-95a5afb5d854b5cc",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: "1.15rem",
                                            color: "#fb923c",
                                            marginBottom: "6px"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: "३. Majhi Naukri Mock Test पेक्षा Mission Vardi मॉक टेस्ट पोर्टल कसे वेगळे व उत्तम आहे?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1782,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#cbd5e1",
                                            fontSize: "0.95rem",
                                            lineHeight: "1.6"
                                        },
                                        className: "jsx-95a5afb5d854b5cc",
                                        children: [
                                            "मिशन वर्दी पोर्टल हे आधुनिक वेब तंत्रज्ञानावर (Next.js SSR) आधारित असून येथे ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-95a5afb5d854b5cc",
                                                children: "अतिशय वेगवान स्पीड (Zero Lag), टाइमरसह प्रत्यक्ष परीक्षेचा अनुभव (Exam Engine), स्टडी मटेरियल व नोट्स, मागील वर्षांच्या प्रश्नपत्रिका (PYQ), शारीरिक चाचणी ट्रॅकर (Physical Fitness Guide) आणि ग्लोबल टॉपर लीडरबोर्ड"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 1786,
                                                columnNumber: 92
                                            }, this),
                                            " एकाच मंचावर पूर्णपणे मोफत उपलब्ध आहे."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 1785,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 1781,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 1762,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 1751,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "95a5afb5d854b5cc",
                children: "@media (width<=600px){.hero-title.jsx-95a5afb5d854b5cc{font-size:1.8rem!important}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 316,
        columnNumber: 5
    }, this);
}
_s(HomePage, "WBL4BMGDSfMn6wz14wvX6lPvRCs=");
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0bxb7d1._.js.map