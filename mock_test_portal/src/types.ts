// Global TypeScript Types for ParikshaSetu Mock Test Platform

export type Role = 'student' | 'admin';

export type Language = 'english' | 'marathi' | 'bilingual';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'mcq' | 'multiple' | 'true_false' | 'image';

export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export type PaymentStatus = 'successful' | 'failed' | 'pending' | 'refunded';

export type ProductType = 'test' | 'test_series';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  nameMarathi?: string;
  marathiName?: string;
  code?: string;
  slug?: string;
  description: string;
  icon?: string;
  category?: 'state' | 'banking' | 'ssc' | 'railway' | 'teaching';
  badge?: string;
  logoCode?: string;
  logoBg?: string;
  status?: 'active' | 'inactive';
  totalTests: number;
}

export interface MainCategory {
  id: string;
  name: string;
  nameMarathi?: string;
  marathiName?: string;
  slug: string;
  description: string;
  icon?: string;
  badge?: string;
  order?: number;
  status: 'active' | 'inactive';
  subCategoriesCount?: number;
  totalSubcategories?: number;
  totalExams?: number;
  totalTests?: number;
}

export interface SubCategory {
  id: string;
  mainCategoryId: string; // MANDATORY parent main category
  mainCategoryName?: string;
  name: string;
  nameMarathi?: string;
  marathiName?: string;
  slug?: string;
  description: string;
  icon?: string;
  badge?: string;
  status: 'active' | 'inactive';
  totalExams?: number;
  totalTests?: number;
}

export interface Category {
  id: string;
  examId: string;
  name: string;
  nameMarathi?: string;
  marathiName?: string;
  slug?: string;
  testCount?: number;
  description: string;
  subcategories?: string[];
  subjects?: string[];
}

export interface Subject {
  id: string;
  name: string;
  nameMarathi?: string;
  marathiName?: string;
  code?: string;
  icon?: string;
  description?: string;
  subcategories?: string[];
  examIds?: string[];
  totalQuestions?: number;
  totalTests?: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  marathiName: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  textMarathi?: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionTextMarathi?: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | string[]; // Can be array for multiple correct
  explanation: string;
  explanationMarathi?: string;
  subjectId: string;
  subjectName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  topicId?: string;
  topicName?: string;
  difficulty: Difficulty;
  positiveMarks: number;
  negativeMarks: number;
  language: Language;
  type: QuestionType;
}

export interface MockTest {
  id: string;
  title: string;
  titleMarathi?: string;
  description: string;
  mainCategoryId?: string;
  mainCategoryName?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  main_category_id?: string;
  sub_category_id?: string;
  examId?: string;
  examName?: string;
  categoryId?: string;
  categoryName?: string;
  category?: string;
  subjectId?: string;
  subjectName?: string;
  subjectNameMarathi?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  isSubjectSpecific?: boolean;
  language: Language | string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  negativeMarking?: number;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  access_type?: 'free' | 'paid';
  includeInPackage?: boolean;
  packageId?: string;
  packageName?: string;
  validityDays?: number;
  maxAttempts?: number;
  attemptsAllowed?: number;
  randomQuestions?: boolean;
  randomOptions?: boolean;
  showExplanation?: boolean;
  showAnswers?: boolean;
  rankingEnabled?: boolean;
  allowResume?: boolean;
  difficulty?: Difficulty | string;
  rating?: number;
  reviewsCount?: number;
  thumbnail?: string;
  type?: string;
  status: 'published' | 'draft' | 'archived';
  questionIds: string[];
  totalQuestions: number;
  attemptsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TestSeries {
  id: string;
  title: string;
  titleMarathi?: string;
  description: string;
  examId: string;
  examName?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  validityMonths?: number;
  validityDays?: number;
  isPopular?: boolean;
  testIds: string[];
  totalTests: number;
  thumbnailUrl?: string;
  features: string[];
  createdAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  selectedOption?: string | string[];
  isMarkedForReview: boolean;
  answeredAt?: string;
  timeSpentSeconds: number;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
  status: AttemptStatus;
  timeSpentSeconds: number;
  totalQuestions: number;
  questions: Question[];
  answers: Record<string, AttemptAnswer>; // questionId -> answer
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  totalMarks: number;
  obtainedMarks: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  percentage: number;
}

export interface TestResult {
  id: string;
  attemptId: string;
  userId: string;
  userName?: string;
  testId: string;
  testTitle: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  markedCount: number;
  totalMarksObtained: number;
  maxMarks: number;
  percentage: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  rank?: number;
  totalParticipants?: number;
  percentile?: number;
  subjectBreakdown: SubjectScore[];
  submittedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  productId: string;
  productType: ProductType;
  productTitle: string;
  amount: number;
  discountAmount: number;
  couponCode?: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  productType: ProductType;
  productTitle: string;
  orderId: string;
  amountPaid: number;
  expiresAt: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  timesUsed: number;
  expiresAt: string;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string; // null means broadcast
  title: string;
  message: string;
  type: 'new_test' | 'payment_success' | 'result_ready' | 'announcement';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PlatformSettings {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  defaultTestDuration: number;
  defaultNegativeMarking: number;
  razorpayKeyId: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  rankingEnabled: boolean;
  aiExplanationsEnabled: boolean;
}

export interface QuestionAnalyticsItem {
  questionId: string;
  questionText: string;
  questionTextMarathi?: string;
  subjectName: string;
  totalAttempts: number;
  correctPercentage: number;
  incorrectPercentage: number;
  unansweredPercentage: number;
  avgTimeSeconds: number;
  computedDifficulty: Difficulty;
}

// --- Mission Vardi Backend Specific Domain Types ---

export interface FitnessMarksBreakdown {
  run1600Marks: number; // Max 20 or 30 marks
  run100Marks: number;  // Max 15 marks
  shotPutMarks: number; // Max 15 marks
  totalMarks: number;   // Total 50 marks for Maharashtra Police Bharti
  gender?: 'male' | 'female';
}

export interface FitnessLog {
  id: string;
  user_id: string;
  run_1600m_seconds?: number;
  run_100m_seconds?: number;
  shot_put_meters?: number;
  date: string;
  notes?: string;
  marks?: FitnessMarksBreakdown;
  created_at?: string;
}

export interface PYQPaper {
  id: string;
  title: string;
  titleMarathi?: string;
  examName: string;
  examId?: string;
  category?: string;
  year: number;
  shift?: string;
  description?: string;
  totalQuestions: number;
  durationMinutes: number;
  isFree: boolean;
  downloadCount?: number;
  pdfUrl?: string;
  mockTestId?: string;
  createdAt?: string;
}

export interface PYQItem extends PYQPaper {}

export interface StudyNote {
  id: string;
  title: string;
  titleMarathi?: string;
  description?: string;
  subjectName?: string;
  subjectId?: string;
  subject?: string;
  examCategory?: string;
  category?: string;
  author?: string;
  pageCount?: number;
  fileSize?: string;
  fileUrl?: string;
  readTime?: string;
  language?: Language;
  isFree: boolean;
  price?: number;
  downloadCount?: number;
  pdfUrl?: string;
  tags?: string[];
  createdAt?: string;
}

export interface StudyNoteItem extends StudyNote {}

export interface GovtAlert {
  id: string;
  title: string;
  titleMarathi?: string;
  department: string;
  departmentMarathi?: string;
  category: string;
  postsCount?: number;
  vacancies?: number | string;
  eligibility?: string;
  salary?: string;
  lastDate?: string;
  applyUrl?: string;
  notificationPdfUrl?: string;
  isHot?: boolean;
  status: 'active' | 'upcoming' | 'closed';
  date?: string;
  message?: string;
  createdAt?: string;
}

export interface GovtAlertItem extends GovtAlert {}

export interface LeaderboardItem {
  user_id: string;
  name: string;
  district: string;
  avatar_url?: string;
  points: number;
  score_str: string;
  rank?: number;
  quizzes?: number;
  accuracy?: number;
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  titleMarathi?: string;
  description: string;
  summary?: string;
  summaryMarathi?: string;
  marathiSummary?: string;
  englishSummary?: string;
  keyPoints?: string[];
  date: string;
  category: string;
  importance?: 'high' | 'medium' | 'general';
}

export interface QuoteOfTheDay {
  quote: string;
  quoteMarathi: string;
  author: string;
}

