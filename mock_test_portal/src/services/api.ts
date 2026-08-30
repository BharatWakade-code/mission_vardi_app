// Client API Service for ParikshaSetu Mock Test Portal
// Single central HTTP client — all feature API calls go through `request()`.

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('parikshasetu_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    // Backend returns { message: string } for errors
    const error = new Error(data.message || data.error || 'An unexpected error occurred') as any;
    error.code = data.code;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  register: (payload: { name: string; email: string; mobile: string; password: string; role?: string }) =>
    request<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request<{ user: any }>('/auth/me'),
  updateProfile: (payload: any) => request<{ user: any }>('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // ─── Meta / Catalog ────────────────────────────────────────────────────────
  getMainCategories: () => request<{ mainCategories: any[] }>('/main-categories'),
  getSubCategories: (mainCategoryId?: string) =>
    request<{ subCategories: any[] }>(mainCategoryId ? `/sub-categories?mainCategoryId=${encodeURIComponent(mainCategoryId)}` : '/sub-categories'),
  getExams: () => request<{ exams: any[] }>('/exams'),
  getCategories: (examId?: string) => request<{ categories: any[] }>(examId ? `/categories?examId=${examId}` : '/categories'),
  getSubjects: () => request<{ subjects: any[] }>('/subjects'),

  // ─── Tests & Series ────────────────────────────────────────────────────────
  getTests: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
    });
    return request<{ tests: any[] }>(`/tests?${query.toString()}`);
  },
  getTestById: (id: string) => request<{ test: any }>(`/tests/${id}`),
  getTestSeries: () => request<{ testSeries: any[] }>('/test-series'),
  getTestSeriesById: (id: string) => request<{ testSeries: any }>(`/test-series/${id}`),

  // ─── Test Engine & Attempts ────────────────────────────────────────────────
  startAttempt: (testId: string) => request<{ attempt: any }>(`/tests/${testId}/start`, { method: 'POST' }),
  getAttempt: (attemptId: string) => request<{ attempt: any }>(`/attempts/${attemptId}`),
  saveAnswer: (attemptId: string, payload: { questionId: string; selectedOption?: string | string[]; isMarkedForReview?: boolean; timeSpentSeconds?: number }) =>
    request<{ success: boolean; answers: any }>(`/attempts/${attemptId}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  submitAttempt: (attemptId: string) => request<{ result: any }>(`/attempts/${attemptId}/submit`, { method: 'POST' }),

  // ─── Results & Student Dashboard ──────────────────────────────────────────
  getResult: (resultId: string) => request<{ result: any; attempt: any; test: any }>(`/results/${resultId}`),
  getStudentDashboard: () => request<{ stats: any }>('/student/dashboard'),
  getStudentResults: () => request<{ results: any[] }>('/student/results'),
  getStudentPurchases: () => request<{ purchases: any[] }>('/student/purchases'),

  // ─── Payments & Coupons ────────────────────────────────────────────────────
  applyCoupon: (code: string, amount: number) =>
    request<{ coupon: any; discount: number; finalAmount: number }>('/coupons/apply', { method: 'POST', body: JSON.stringify({ code, amount }) }),
  createOrder: (payload: { productId: string; productType: string; couponCode?: string }) =>
    request<{ order: any; razorpayKey: string }>('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload: { orderId: string; razorpayPaymentId: string; razorpaySignature?: string }) =>
    request<{ success: boolean; order: any; purchase: any }>('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // ─── Notifications & Settings ─────────────────────────────────────────────
  getNotifications: () => request<{ notifications: any[] }>('/notifications'),
  markNotificationRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' }),
  getSettings: () => request<{ settings: any }>('/settings'),

  // ─── Fitness Tracker ──────────────────────────────────────────────────────
  getFitnessLogs: (userId?: string) =>
    request<{ status: boolean; data: any[] }>(userId ? `/fitness/${userId}` : '/fitness'),
  createFitnessLog: (payload: { user_id?: string; run_1600m_seconds?: number; run_100m_seconds?: number; shot_put_meters?: number; date?: string; notes?: string }) =>
    request<{ status: boolean; message: string; data: any }>('/fitness', { method: 'POST', body: JSON.stringify(payload) }),
  updateFitnessLog: (id: string, payload: any) =>
    request<{ status: boolean; message: string; data: any }>(`/fitness/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteFitnessLog: (id: string) =>
    request<{ status: boolean; message: string }>(`/fitness/${id}`, { method: 'DELETE' }),

  // ─── PYQ Papers ───────────────────────────────────────────────────────────
  getPYQs: (params: { year?: number; category?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.year) q.append('year', String(params.year));
    if (params.category) q.append('category', params.category);
    if (params.search) q.append('search', params.search);
    return request<{ status: boolean; data: any[] }>(`/pyqs?${q.toString()}`);
  },

  // ─── Study Notes ──────────────────────────────────────────────────────────
  getNotes: (params: { subject?: string; category?: string; isFree?: boolean } = {}) => {
    const q = new URLSearchParams();
    if (params.subject) q.append('subject', params.subject);
    if (params.category) q.append('category', params.category);
    if (params.isFree !== undefined) q.append('isFree', String(params.isFree));
    return request<{ status: boolean; data: any[] }>(`/notes?${q.toString()}`);
  },

  // ─── Govt Alerts ──────────────────────────────────────────────────────────
  getAlerts: (params: { category?: string; status?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.category) q.append('category', params.category);
    if (params.status) q.append('status', params.status);
    return request<{ status: boolean; data: any[] }>(`/alerts?${q.toString()}`);
  },

  // ─── Leaderboard ──────────────────────────────────────────────────────────
  getGlobalLeaderboard: (limit: number = 25, userId?: string) => {
    const q = new URLSearchParams({ limit: String(limit) });
    if (userId) q.append('user_id', userId);
    return request<{ status: boolean; message: string; data: any[]; user_rank?: any }>(`/leaderboard/global?${q.toString()}`);
  },
  getDistrictLeaderboard: (districtName: string, limit: number = 25, userId?: string) => {
    const q = new URLSearchParams({ limit: String(limit) });
    if (userId) q.append('user_id', userId);
    return request<{ status: boolean; message: string; data: any[]; user_rank?: any }>(`/leaderboard/global/district/${encodeURIComponent(districtName)}?${q.toString()}`);
  },

  // ─── Home ─────────────────────────────────────────────────────────────────
  getCurrentAffairs: (params: { date?: string; category?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.date) q.append('date', params.date);
    if (params.category) q.append('category', params.category);
    return request<{ status: boolean; data: any[] }>(`/current-affairs?${q.toString()}`);
  },
  getHomeStats: () => request<{ status: boolean; data: any }>('/home/stats'),
  getQuoteOfTheDay: () => request<{ status: boolean; data: any }>('/home/quote-of-the-day'),

  // ─── Admin ────────────────────────────────────────────────────────────────
  getAdminAnalytics: () => request<{ analytics: any }>('/admin/analytics'),
  getAdminStudents: () => request<{ students: any[] }>('/admin/students'),
  updateAdminStudentRole: (id: string, role: string) => request<{ user: any }>(`/admin/students/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteAdminStudent: (id: string) => request<{ success: boolean }>(`/admin/students/${id}`, { method: 'DELETE' }),
  getAdminOrders: () => request<{ orders: any[] }>('/admin/orders'),

  getAdminCoupons: () => request<{ coupons: any[] }>('/admin/coupons'),
  createAdminCoupon: (payload: any) => request<{ coupon: any }>('/admin/coupons', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminCoupon: (id: string, payload: any) => request<{ coupon: any }>(`/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminCoupon: (id: string) => request<{ success: boolean }>(`/admin/coupons/${id}`, { method: 'DELETE' }),

  getAdminQuestionBanks: () => request<{ questionBanks: any[] }>('/admin/question-banks'),
  getAdminQuestions: (params: any = {}) => request<{ questions: any[] }>(`/admin/questions?${new URLSearchParams(params).toString()}`),
  createAdminQuestion: (payload: any) => request<{ question: any }>('/admin/questions', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminQuestion: (id: string, payload: any) => request<{ question: any }>(`/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminQuestion: (id: string) => request<{ success: boolean }>(`/admin/questions/${id}`, { method: 'DELETE' }),
  bulkImportQuestions: (questions: any[]) => request<{ created: any[]; count: number }>('/admin/questions/bulk', { method: 'POST', body: JSON.stringify({ questions }) }),
  getQuestionAnalytics: () => request<{ analytics: any[] }>('/admin/questions/analytics'),

  getAdminTests: () => request<{ tests: any[] }>('/admin/tests'),
  createAdminTest: (payload: any) => request<{ test: any }>('/admin/tests', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminTest: (id: string, payload: any) => request<{ test: any }>(`/admin/tests/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminTest: (id: string) => request<{ success: boolean }>(`/admin/tests/${id}`, { method: 'DELETE' }),

  createAdminTestSeries: (payload: any) => request<{ series: any }>('/admin/test-series', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminTestSeries: (id: string, payload: any) => request<{ series: any }>(`/admin/test-series/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminTestSeries: (id: string) => request<{ success: boolean }>(`/admin/test-series/${id}`, { method: 'DELETE' }),

  getAdminMainCategories: () => request<{ mainCategories: any[] }>('/admin/main-categories'),
  createAdminMainCategory: (payload: any) => request<{ mainCategory: any }>('/admin/main-categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminMainCategory: (id: string, payload: any) => request<{ mainCategory: any }>(`/admin/main-categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminMainCategory: (id: string) => request<{ success: boolean }>(`/admin/main-categories/${id}`, { method: 'DELETE' }),

  getAdminSubCategories: (mainCategoryId?: string) =>
    request<{ subCategories: any[] }>(mainCategoryId ? `/admin/sub-categories?mainCategoryId=${encodeURIComponent(mainCategoryId)}` : '/admin/sub-categories'),
  createAdminSubCategory: (payload: any) => request<{ subCategory: any }>('/admin/sub-categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminSubCategory: (id: string, payload: any) => request<{ subCategory: any }>(`/admin/sub-categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminSubCategory: (id: string) => request<{ success: boolean }>(`/admin/sub-categories/${id}`, { method: 'DELETE' }),

  getAdminExams: () => request<{ exams: any[] }>('/admin/exams'),
  createAdminExam: (payload: any) => request<{ exam: any }>('/admin/exams', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminExam: (id: string, payload: any) => request<{ exam: any }>(`/admin/exams/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminExam: (id: string) => request<{ success: boolean }>(`/admin/exams/${id}`, { method: 'DELETE' }),

  getAdminCategories: (examId?: string) => request<{ categories: any[] }>(examId ? `/admin/categories?examId=${examId}` : '/admin/categories'),
  createAdminCategory: (payload: any) => request<{ category: any }>('/admin/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminCategory: (id: string, payload: any) => request<{ category: any }>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminCategory: (id: string) => request<{ success: boolean }>(`/admin/categories/${id}`, { method: 'DELETE' }),

  getAdminSubjects: () => request<{ subjects: any[] }>('/admin/subjects'),
  createAdminSubject: (payload: any) => request<{ subject: any }>('/admin/subjects', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminSubject: (id: string, payload: any) => request<{ subject: any }>(`/admin/subjects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminSubject: (id: string) => request<{ success: boolean }>(`/admin/subjects/${id}`, { method: 'DELETE' }),

  getAdminPYQs: () => request<{ pyqs: any[] }>('/admin/pyqs'),
  updateAdminPYQ: (id: string, payload: any) => request<{ pyq: any }>(`/admin/pyqs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  createPYQ: (payload: any) => request<{ status: boolean; message: string; data: any }>('/pyqs', { method: 'POST', body: JSON.stringify(payload) }),
  deleteAdminPYQ: (id: string) => request<{ status: boolean; message: string }>(`/pyqs/${id}`, { method: 'DELETE' }),

  getAdminNotes: () => request<{ notes: any[] }>('/admin/notes'),
  updateAdminNote: (id: string, payload: any) => request<{ note: any }>(`/admin/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminNote: (id: string) => request<{ status: boolean }>(`/notes/${id}`, { method: 'DELETE' }),
  createNote: (payload: any) => request<{ status: boolean; message: string; data: any }>('/notes', { method: 'POST', body: JSON.stringify(payload) }),

  getAdminAlerts: () => request<{ alerts: any[] }>('/admin/alerts'),
  createAdminAlert: (payload: any) => request<{ status: boolean; data: any }>('/alerts', { method: 'POST', body: JSON.stringify(payload) }),
  updateAdminAlert: (id: string, payload: any) => request<{ alert: any }>(`/admin/alerts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAdminAlert: (id: string) => request<{ success: boolean }>(`/admin/alerts/${id}`, { method: 'DELETE' }),

  getAdminSettings: () => request<{ settings: any }>('/admin/settings'),
  updateAdminSettings: (payload: any) => request<{ settings: any }>('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) }),
  broadcastNotification: (payload: { title: string; message: string; link?: string }) =>
    request<{ message: string; count: number }>('/admin/notifications/broadcast', { method: 'POST', body: JSON.stringify(payload) }),
};
