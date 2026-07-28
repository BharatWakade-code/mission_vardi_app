import { MockTest, Question, ExamCategory, EXAM_CATEGORIES, MOCK_TESTS } from "@/data/mockTests";

// Strict Environment Variable for API URL (Standard Practice)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface matching Backend FastAPI Response
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface BackendQuestion {
  id: string | number;
  text: string;
  text_mr?: string;
  options: string[];
  options_mr?: string[];
  correctAnswer: string;
}

interface BackendQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  createdAt?: string;
  questions?: BackendQuestion[];
}

// Convert category string from API to slug
export function categoryToSlug(category: string): string {
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
function mapBackendQuestion(q: BackendQuestion, idx: number): Question {
  const options = q.options_mr && q.options_mr.length > 0 ? q.options_mr : q.options || ["A", "B", "C", "D"];

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
    marks: 2,
  };
}

// Convert Backend Quiz to Frontend MockTest format
function mapBackendQuizToMockTest(bq: BackendQuiz): MockTest {
  const slug = categoryToSlug(bq.category);
  const questions = (bq.questions || []).map((q, idx) => mapBackendQuestion(q, idx));

  // Estimate difficulty based on type/category
  let diff: "Easy" | "Medium" | "Hard" | "MPSC Level" = "Medium";
  if (bq.type === "challenge") diff = "Hard";
  if (bq.category?.toLowerCase().includes("mpsc")) diff = "MPSC Level";

  // Match existing category name if present
  const existingCat = EXAM_CATEGORIES.find((c) => c.slug === slug);
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
    testSlug: bq.id, // Using ID as testSlug for dynamic routes
    durationMinutes: durationMinutes,
    totalMarks: totalMarks,
    totalQuestions: totalQuestions,
    difficulty: diff,
    badge: bq.type === "challenge" ? "⚡ Daily Challenge" : "🔥 Live API",
    rating: 4.9,
    reviewsCount: Math.floor(Math.random() * 2000) + 500,
    questions: questions,
  };
}

/**
 * Fetch all quizzes from live API (with fallback to static MOCK_TESTS)
 */
export async function fetchLiveQuizzes(): Promise<MockTest[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz`, {
      next: { revalidate: 60 }, // Cache and revalidate every 60 seconds for SEO & speed
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json: ApiResponse<BackendQuiz[]> = await res.json();
    if (json.status && Array.isArray(json.data)) {
      return json.data.map(mapBackendQuizToMockTest);
    }
  } catch (error) {
    console.warn("Failed to fetch live quizzes from API:", error);
  }
  return [];
}

/**
 * Fetch a single quiz by ID/slug from live API (with no static fallback)
 */
export async function fetchLiveQuizById(idOrSlug: string): Promise<MockTest | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/${idOrSlug}`, {
      cache: "no-store", // Always fetch fresh questions for live tests/daily challenge
    });

    if (res.ok) {
      const json: ApiResponse<BackendQuiz> = await res.json();
      if (json.status && json.data) {
        return mapBackendQuizToMockTest(json.data);
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch quiz ${idOrSlug} from live API:`, error);
  }

  return undefined;
}

/**
 * Fetch all categories dynamically combining static category metadata and any new categories found in API
 */
export async function fetchLiveCategories(): Promise<ExamCategory[]> {
  const tests = await fetchLiveQuizzes();
  const dynamicCategories = [...EXAM_CATEGORIES];
  const existingSlugs = new Set(dynamicCategories.map((c) => c.slug));

  // Count actual tests per category
  const testCounts: Record<string, number> = {};
  for (const t of tests) {
    testCounts[t.categorySlug] = (testCounts[t.categorySlug] || 0) + 1;
  }

  // Update counts for existing categories to match actual live database tests
  for (const cat of dynamicCategories) {
    cat.totalTests = testCounts[cat.slug] || 0;
  }

  // Add any new categories from backend API
  for (const test of tests) {
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
        colorTheme: colorTheme,
      });
    }
  }

  return dynamicCategories;
}

/**
 * Submit test result to real FastAPI backend (MongoDB)
 */
export async function submitLiveQuizResult(
  quizId: string,
  score: number,
  total: number,
  timeSpentSeconds: number
): Promise<boolean> {
  try {
    const userId = "web_user_" + Math.random().toString(36).substring(2, 10);
    const res = await fetch(`${API_BASE_URL}/quiz/${quizId}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        score: score,
        total: total,
        time_spent_seconds: timeSpentSeconds,
        answers: [],
      }),
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

// --- Additional Backend API Interfaces (Dashboard, Leaderboard, Notes, PYQs, Alerts) ---

export interface DailyQuote {
  en: string;
  mr: string;
}

export interface CountdownConfig {
  title: string;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
}

export interface DashboardData {
  daily_quotes: DailyQuote[];
  countdown?: CountdownConfig;
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  district?: string;
  avatar_url?: string;
  points: number;
  score_str: string;
}

export interface NoteItem {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string | null;
  category?: string;
  content?: string;
  createdAt?: string;
}

export interface PYQItem {
  id: string;
  title: string;
  year: number;
  description?: string | null;
  pdfUrl?: string | null;
  category?: string;
  createdAt?: string;
}

export interface AlertItem {
  id: string;
  message_mr: string;
  message_en: string;
  timestamp: string;
}

// --- Fetch Functions for Web Portal Integration ---

export async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/home/dashboard`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status && json.data) {
        return json.data as DashboardData;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch dashboard data:", error);
  }
  return null;
}

export async function fetchGlobalLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/leaderboard/global?limit=${limit}`, { next: { revalidate: 30 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        return json.data as LeaderboardEntry[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch global leaderboard:", error);
  }
  return [];
}

export async function fetchNotes(category?: string, search?: string): Promise<NoteItem[]> {
  try {
    let url = `${API_BASE_URL}/notes`;
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        return json.data as NoteItem[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch notes:", error);
  }
  return [];
}

export async function fetchPYQs(year?: number, category?: string): Promise<PYQItem[]> {
  try {
    let url = `${API_BASE_URL}/pyqs`;
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (category && category !== "all") params.append("category", category);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        return json.data as PYQItem[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch PYQs:", error);
  }
  return [];
}

export async function fetchGlobalAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/global`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        return json.data as AlertItem[];
      }
    }
  } catch (error) {
    console.warn("Failed to fetch global alerts:", error);
  }
  return [];
}

// --- Auth, Profile & Fitness Interfaces ---

export interface UserProfile {
  id?: string;
  user_id?: string;
  name: string;
  email?: string;
  mobile?: string;
  district?: string;
  avatar_url?: string;
  points?: number;
  target_exam?: string;
}

export interface FitnessLog {
  id?: string;
  _id?: string;
  user_id: string;
  run_1600m_seconds?: number | null;
  run_100m_seconds?: number | null;
  shot_put_meters?: number | null;
  date?: string | null;
  notes?: string | null;
  created_at?: string;
}

// --- Auth & Profile API Functions ---

export async function loginUserApi(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (res.ok && (json.status || json.user || json.data)) {
      return { success: true, user: json.user || json.data || json };
    }
    return { success: false, message: json.detail || json.message || "लॉगिन अयशस्वी. कृपया ईमेल आणि पासवर्ड तपासा." };
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, message: "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट तपासा." };
  }
}

export async function registerUserApi(name: string, email: string, password: string, mobile?: string, district?: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, mobile: mobile || "", district: district || "" }),
    });
    const json = await res.json();
    if (res.ok && (json.status || json.user || json.data || res.status === 200)) {
      return { success: true, user: json.user || json.data || { name, email, mobile, district } };
    }
    return { success: false, message: json.detail || json.message || "रजिस्ट्रेशन अयशस्वी." };
  } catch (error) {
    console.error("Register API Error:", error);
    return { success: false, message: "सर्व्हरशी संपर्क होऊ शकला नाही." };
  }
}

export async function fetchUserProfileApi(userId: string): Promise<UserProfile | null> {
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

export async function updateUserProfileApi(userId: string, data: Partial<UserProfile>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/updateProfile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error("Update Profile Error:", error);
    return false;
  }
}

// --- Fitness Logs API Functions ---

export async function fetchFitnessLogsApi(userId: string): Promise<FitnessLog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/fitness/${userId}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data || json)) {
        return (json.data || json) as FitnessLog[];
      }
    }
  } catch (error) {
    console.warn("Fetch Fitness Logs Error:", error);
  }
  return [];
}

export async function createFitnessLogApi(logData: FitnessLog): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/fitness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    return res.ok;
  } catch (error) {
    console.error("Create Fitness Log Error:", error);
    return false;
  }
}

export async function deleteFitnessLogApi(logId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/fitness/${logId}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Delete Fitness Log Error:", error);
    return false;
  }
}
