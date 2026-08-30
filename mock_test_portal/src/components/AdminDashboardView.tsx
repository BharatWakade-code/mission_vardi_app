import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Plus,
  Edit2,
  Trash2,
  Tag,
  CreditCard,
  Bell,
  Settings,
  Search,
  Upload,
  Download,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Layers,
  Sparkles,
  GraduationCap,
  FileText,
  ShieldCheck,
  UserCheck,
  FolderTree,
} from 'lucide-react';
import { AdminExamsManager } from './admin/AdminExamsManager';
import { AdminHierarchyManager } from './admin/AdminHierarchyManager';
import { AdminSubjectsManager } from './admin/AdminSubjectsManager';
import { AdminSeriesManager } from './admin/AdminSeriesManager';
import { AdminPYQManager } from './admin/AdminPYQManager';
import { AdminNotesManager } from './admin/AdminNotesManager';
import { AdminAlertsManager } from './admin/AdminAlertsManager';

interface AdminDashboardViewProps {
  onBackToStudentView: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToStudentView }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Bulk CSV Question Import state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [anRes, qRes, tRes, stRes, ordRes, cRes, exRes, subRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminQuestions(),
        api.getAdminTests(),
        api.getAdminStudents(),
        api.getAdminOrders(),
        api.getAdminCoupons(),
        api.getExams(),
        api.getSubjects(),
      ]);

      setAnalytics(anRes.analytics);
      setQuestions(qRes.questions);
      setTests(tRes.tests);
      setStudents(stRes.students);
      setOrders(ordRes.orders);
      setCoupons(cRes.coupons);
      setExams(exRes.exams);
      setSubjects(subRes.subjects);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Question Form State
  const [qSubjectId, setQSubjectId] = useState('sub-mpsc-gs');
  const [qExamId, setQExamId] = useState('exam-mpsc');
  const [qDifficulty, setQDifficulty] = useState('medium');
  const [qTextEn, setQTextEn] = useState('');
  const [qTextMr, setQTextMr] = useState('');
  const [qOptAEn, setQOptAEn] = useState('');
  const [qOptAMr, setQOptAMr] = useState('');
  const [qOptBEn, setQOptBEn] = useState('');
  const [qOptBMr, setQOptBMr] = useState('');
  const [qOptCEn, setQOptCEn] = useState('');
  const [qOptCMr, setQOptCMr] = useState('');
  const [qOptDEn, setQOptDEn] = useState('');
  const [qOptDMr, setQOptDMr] = useState('');
  const [qCorrectOpt, setQCorrectOpt] = useState('opt-1');
  const [qExpEn, setQExpEn] = useState('');
  const [qExpMr, setQExpMr] = useState('');

  const openCreateQuestionModal = () => {
    setEditingQuestion(null);
    setQTextEn('');
    setQTextMr('');
    setQOptAEn('');
    setQOptAMr('');
    setQOptBEn('');
    setQOptBMr('');
    setQOptCEn('');
    setQOptCMr('');
    setQOptDEn('');
    setQOptDMr('');
    setQCorrectOpt('opt-1');
    setQExpEn('');
    setQExpMr('');
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      subjectId: qSubjectId,
      examId: qExamId,
      difficulty: qDifficulty,
      type: 'single_choice',
      text: qTextEn || qTextMr,
      textMarathi: qTextMr,
      marks: 1,
      negativeMarks: 0.25,
      options: [
        { id: 'opt-1', text: qOptAEn || qOptAMr, textMarathi: qOptAMr, isCorrect: qCorrectOpt === 'opt-1' },
        { id: 'opt-2', text: qOptBEn || qOptBMr, textMarathi: qOptBMr, isCorrect: qCorrectOpt === 'opt-2' },
        { id: 'opt-3', text: qOptCEn || qOptCMr, textMarathi: qOptCMr, isCorrect: qCorrectOpt === 'opt-3' },
        { id: 'opt-4', text: qOptDEn || qOptDMr, textMarathi: qOptDMr, isCorrect: qCorrectOpt === 'opt-4' },
      ],
      explanation: qExpEn || qExpMr,
      explanationMarathi: qExpMr,
    };

    try {
      if (editingQuestion) {
        await api.updateAdminQuestion(editingQuestion.id, payload);
      } else {
        await api.createAdminQuestion(payload);
      }
      setIsQuestionModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to save question:', err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteAdminQuestion(id);
      loadAllAdminData();
    } catch (err) {
      console.error('Delete question failed', err);
    }
  };

  // Test Form State
  const [testTitle, setTestTitle] = useState('');
  const [testTitleMr, setTestTitleMr] = useState('');
  const [testExamId, setTestExamId] = useState('exam-mpsc');
  const [testDuration, setTestDuration] = useState(60);
  const [testPositiveMarks, setTestPositiveMarks] = useState(1);
  const [testNegativeMarks, setTestNegativeMarks] = useState(0.25);
  const [testIsFree, setTestIsFree] = useState(true);
  const [testPrice, setTestPrice] = useState(0);
  const [testDiscountPrice, setTestDiscountPrice] = useState(0);
  const [testDescription, setTestDescription] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const openCreateTestModal = () => {
    setEditingTest(null);
    setTestTitle('');
    setTestTitleMr('');
    setTestExamId(exams[0]?.id || 'exam-mpsc');
    setTestDuration(60);
    setTestPositiveMarks(1);
    setTestNegativeMarks(0.25);
    setTestIsFree(true);
    setTestPrice(0);
    setTestDiscountPrice(0);
    setTestDescription('');
    setSelectedQuestionIds(questions.slice(0, 10).map((q) => q.id));
    setIsTestModalOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: testTitle,
      titleMarathi: testTitleMr,
      examId: testExamId,
      categoryId: 'cat-mpsc-rajyaseva',
      durationMinutes: Number(testDuration),
      totalMarks: selectedQuestionIds.length * Number(testPositiveMarks),
      positiveMarks: Number(testPositiveMarks),
      negativeMarks: Number(testNegativeMarks),
      isFree: testIsFree,
      price: testIsFree ? 0 : Number(testPrice),
      discountPrice: Number(testDiscountPrice),
      language: 'bilingual',
      description: testDescription || 'Comprehensive Exam Practice Test',
      questionIds: selectedQuestionIds,
      isActive: true,
      maxAttempts: 5,
      validityDays: 180,
    };

    try {
      if (editingTest) {
        await api.updateAdminTest(editingTest.id, payload);
      } else {
        await api.createAdminTest(payload);
      }
      setIsTestModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to save test:', err);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await api.deleteAdminTest(id);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to delete test', err);
    }
  };

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(20);
  const [couponMinOrder, setCouponMinOrder] = useState(199);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState(100);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminCoupon({
        code: couponCode.toUpperCase().trim(),
        discountType: couponType,
        discountValue: Number(couponValue),
        minOrderAmount: Number(couponMinOrder),
        maxDiscountAmount: Number(couponMaxDiscount),
        validUntil: new Date(Date.now() + 90 * 86400000).toISOString(),
        isActive: true,
      });
      setIsCouponModalOpen(false);
      setCouponCode('');
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to create coupon', err);
      alert('Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;
    try {
      await api.deleteAdminCoupon(id);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to delete coupon', err);
    }
  };

  const handleToggleStudentRole = async (studentId: string, currentRole: string, studentName: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`Change role for ${studentName} to "${newRole.toUpperCase()}"?`)) return;
    try {
      await api.updateAdminStudentRole(studentId, newRole);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to update student role', err);
      alert('Failed to update user role');
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove aspirant "${studentName}"?`)) return;
    try {
      await api.deleteAdminStudent(studentId);
      loadAllAdminData();
    } catch (err) {
      console.error('Failed to delete student', err);
      alert('Failed to delete user');
    }
  };

  // Broadcast Handler
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.broadcastNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        link: 'tests',
      });
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setIsBroadcastModalOpen(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
      }, 2000);
    } catch (err) {
      console.error('Broadcast failed', err);
    }
  };

  // Bulk Import
  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkJsonText);
      const res = await api.bulkImportQuestions(Array.isArray(parsed) ? parsed : [parsed]);
      setBulkStatus(`Successfully imported ${res.count} questions!`);
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setBulkStatus(null);
        setBulkJsonText('');
        loadAllAdminData();
      }, 1500);
    } catch (err: any) {
      setBulkStatus(`Import Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">{t('Loading Admin Portal Data...', 'अॅडमिन डेटा लोड होत आहे...')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded bg-indigo-600 text-white">
            FACULTY & PORTAL ADMIN
          </span>
          <h1 className="text-2xl font-black text-white mt-1">ParikshaSetu Admin Central</h1>
          <p className="text-xs text-slate-400">
            Manage Bilingual Question Banks, Mock Tests, Test Series Packages, Orders & Aspirants
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Update</span>
          </button>
          <button
            onClick={onBackToStudentView}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
          >
            Switch to Student View →
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'hierarchy' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Category & Exam Hierarchy (3 Options)</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Legacy Exam Meta</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'subjects' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects</span>
        </button>

        <button
          onClick={() => setActiveTab('series')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'series' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Test Series Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'tests' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mock Tests ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pyqs')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pyqs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PYQ Papers</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'alerts' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Bharti Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'students' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Aspirants ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'coupons' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons ({coupons.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">Total Platform Revenue</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                ₹{analytics?.totalRevenue?.toLocaleString() || '12,490'}
              </span>
              <span className="text-[11px] text-slate-400">Via Razorpay Gateway</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">Registered Aspirants</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {analytics?.totalStudents || students.length}
              </span>
              <span className="text-[11px] text-slate-400">Active MPSC & Bharti Students</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">Total Test Attempts</span>
              <span className="text-2xl font-black text-indigo-600 mt-1 block">
                {analytics?.totalAttempts || '4,892'}
              </span>
              <span className="text-[11px] text-slate-400">Real completed papers</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">Average Exam Accuracy</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {typeof analytics?.avgAccuracy === 'number' ? analytics.avgAccuracy.toFixed(1) : (analytics?.performance?.averageAccuracy ? Number(analytics.performance.averageAccuracy).toFixed(1) : '64.2')}%
              </span>
              <span className="text-[11px] text-slate-400">State-wide benchmark</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Question Bank Manager */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bilingual Question Repository</h2>
              <p className="text-xs text-slate-500">Add, edit, and organize questions with Marathi & English explanations</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setBulkJsonText(JSON.stringify([
                    {
                      text: "Who was the founder of Satyasodhak Samaj?",
                      textMarathi: "सत्यशोधक समाजाची स्थापना कोणी केली?",
                      subjectId: "sub-mpsc-gs",
                      examId: "exam-mpsc",
                      difficulty: "medium",
                      marks: 1,
                      negativeMarks: 0.25,
                      options: [
                        { id: "opt-1", text: "Mahatma Jyotirao Phule", textMarathi: "महात्मा ज्योतिराव फुले", isCorrect: true },
                        { id: "opt-2", text: "Dr. B. R. Ambedkar", textMarathi: "डॉ. बाबासाहेब आंबेडकर", isCorrect: false },
                        { id: "opt-3", text: "Chhatrapati Shahu Maharaj", textMarathi: "छत्रपती शाहू महाराज", isCorrect: false },
                        { id: "opt-4", text: "Lokmanya Tilak", textMarathi: "लोकमान्य टिळक", isCorrect: false }
                      ],
                      explanationMarathi: "महात्मा ज्योतिराव फुले यांनी २४ सप्टेंबर १८७३ रोजी पुणे येथे सत्यशोधक समाजाची स्थापना केली."
                    }
                  ], null, 2));
                  setIsBulkModalOpen(true);
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk CSV / JSON Import</span>
              </button>
              <button
                id="add-question-btn"
                onClick={openCreateQuestionModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Question</span>
              </button>
            </div>
          </div>

          {/* Question List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Question Text (Marathi / English)</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Difficulty</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-4 max-w-md">
                        <span className="block font-bold text-slate-900 font-devanagari">
                          {q.textMarathi || q.text}
                        </span>
                        {q.textMarathi && q.text && (
                          <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                            {q.text}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                          {q.subjectName || q.subjectId}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.difficulty === 'hard' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mock Tests Manager */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mock Examination Tests</h2>
              <p className="text-xs text-slate-500">Configure duration, marking scheme, pricing, and question sets</p>
            </div>
            <button
              id="create-test-btn"
              onClick={openCreateTestModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mock Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700">
                      {test.examName}
                    </span>
                    {test.isFree ? (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-100 text-emerald-800">FREE</span>
                    ) : (
                      <span className="text-xs font-black text-slate-900">₹{test.price}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{test.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-devanagari line-clamp-1">{test.titleMarathi}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
                    <span>{test.totalQuestions} Questions</span>
                    <span>{test.durationMinutes} Mins</span>
                    <span>{test.totalMarks} Marks</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{test.attemptsCount} attempts</span>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 3-Step Category & Exam Hierarchy Engine */}
      {activeTab === 'hierarchy' && (
        <AdminHierarchyManager onRefreshData={loadAllAdminData} />
      )}

      {/* Tab: Legacy Exams & Categories */}
      {activeTab === 'exams' && (
        <AdminExamsManager onRefreshData={loadAllAdminData} />
      )}

      {/* Tab: Subjects & Modules */}
      {activeTab === 'subjects' && (
        <AdminSubjectsManager onRefresh={loadAllAdminData} />
      )}

      {/* Tab: Test Series Packages */}
      {activeTab === 'series' && (
        <AdminSeriesManager onRefresh={loadAllAdminData} />
      )}

      {/* Tab: PYQs */}
      {activeTab === 'pyqs' && (
        <AdminPYQManager onRefresh={loadAllAdminData} />
      )}

      {/* Tab: Study Notes & PDFs */}
      {activeTab === 'notes' && (
        <AdminNotesManager onRefresh={loadAllAdminData} />
      )}

      {/* Tab: Govt Bharti Alerts */}
      {activeTab === 'alerts' && (
        <AdminAlertsManager onRefresh={loadAllAdminData} />
      )}

      {/* Tab: Students / Aspirants */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Registered Aspirants & Faculty Roles</h3>
              <p className="text-xs text-slate-500">Manage user accounts, assign Administrator privileges or reset access</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl">
              {students.length} Total Users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Target Exam</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">{st.name}</td>
                    <td className="p-4">{st.email}</td>
                    <td className="p-4 font-mono">{st.mobile || '—'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                        {st.targetExam || 'MPSC'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                        st.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {st.role === 'admin' ? '🛡️ Admin / Faculty' : '🎓 Aspirant'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(st.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStudentRole(st.id, st.role || 'student', st.name)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                            st.role === 'admin'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          {st.role === 'admin' ? 'Demote to Student' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(st.id, st.name)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Razorpay Payment Logs</h3>
              <p className="text-xs text-slate-500">Live verified payments for test series bundles and study notes</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
              {orders.length} Completed Transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-mono text-slate-500">{ord.id}</td>
                    <td className="p-4 font-bold text-slate-900">{ord.userId}</td>
                    <td className="p-4 font-extrabold text-slate-900">₹{ord.amount}</td>
                    <td className="p-4 font-mono text-slate-500">{ord.razorpayPaymentId || 'pay_test'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Discount Coupon Codes</h3>
              <p className="text-xs text-slate-500">Create promotional codes for seasonal discounts, student festivals, and referrals</p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Min Order: ₹{c.minOrderAmount || 0} • Max Cap: ₹{c.maxDiscountAmount || 'Unlimited'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Valid: 90 days</span>
                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add / Edit Question (Marathi & English)</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Target Exam</label>
                  <select
                    value={qExamId}
                    onChange={(e) => setQExamId(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="easy">Easy (सोपे)</option>
                    <option value="medium">Medium (मध्यम)</option>
                    <option value="hard">Hard (कठीण)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Question Text (Marathi / मराठी प्रश्न) *</label>
                <textarea
                  rows={2}
                  required
                  value={qTextMr}
                  onChange={(e) => setQTextMr(e.target.value)}
                  placeholder="उदा. सत्यशोधक समाजाची स्थापना कोणी केली?"
                  className="w-full p-2.5 border rounded-xl font-devanagari text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Question Text (English Translation)</label>
                <textarea
                  rows={2}
                  value={qTextEn}
                  onChange={(e) => setQTextEn(e.target.value)}
                  placeholder="e.g. Who founded Satyasodhak Samaj?"
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2 pt-2 border-t">
                <span className="font-bold uppercase tracking-wider text-slate-500 block">4 Options & Correct Answer</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2 border rounded-xl flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={qCorrectOpt === 'opt-1'}
                      onChange={() => setQCorrectOpt('opt-1')}
                    />
                    <input
                      placeholder="Option A (मराठी/EN)"
                      value={qOptAMr}
                      onChange={(e) => setQOptAMr(e.target.value)}
                      required
                      className="w-full text-xs font-devanagari outline-none"
                    />
                  </div>
                  <div className="p-2 border rounded-xl flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={qCorrectOpt === 'opt-2'}
                      onChange={() => setQCorrectOpt('opt-2')}
                    />
                    <input
                      placeholder="Option B (मराठी/EN)"
                      value={qOptBMr}
                      onChange={(e) => setQOptBMr(e.target.value)}
                      required
                      className="w-full text-xs font-devanagari outline-none"
                    />
                  </div>
                  <div className="p-2 border rounded-xl flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={qCorrectOpt === 'opt-3'}
                      onChange={() => setQCorrectOpt('opt-3')}
                    />
                    <input
                      placeholder="Option C (मराठी/EN)"
                      value={qOptCMr}
                      onChange={(e) => setQOptCMr(e.target.value)}
                      required
                      className="w-full text-xs font-devanagari outline-none"
                    />
                  </div>
                  <div className="p-2 border rounded-xl flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={qCorrectOpt === 'opt-4'}
                      onChange={() => setQCorrectOpt('opt-4')}
                    />
                    <input
                      placeholder="Option D (मराठी/EN)"
                      value={qOptDMr}
                      onChange={(e) => setQOptDMr(e.target.value)}
                      required
                      className="w-full text-xs font-devanagari outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Explanation (मराठी स्पष्टीकरण)</label>
                <textarea
                  rows={2}
                  value={qExpMr}
                  onChange={(e) => setQExpMr(e.target.value)}
                  placeholder="सविस्तर संदर्भ व स्पष्टीकरण लिहा..."
                  className="w-full p-2.5 border rounded-xl font-devanagari text-xs"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Create New Mock Test</h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
              <div>
                <label className="block font-semibold mb-1">Test Title (English) *</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. MPSC State Prelims Full Mock 1"
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Test Title (मराठी शीर्षक)</label>
                <input
                  type="text"
                  value={testTitleMr}
                  onChange={(e) => setTestTitleMr(e.target.value)}
                  placeholder="उदा. एमपीएससी राज्यसेवा संपूर्ण सराव पेपर १"
                  className="w-full p-2 border rounded-xl font-devanagari"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Exam</label>
                  <select
                    value={testExamId}
                    onChange={(e) => setTestExamId(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pricing Access</label>
                  <select
                    value={testIsFree ? 'free' : 'paid'}
                    onChange={(e) => setTestIsFree(e.target.value === 'free')}
                    className="w-full p-2 border rounded-xl font-bold"
                  >
                    <option value="free">🎁 100% Free Test</option>
                    <option value="paid">💎 Paid Test (₹)</option>
                  </select>
                </div>
                {!testIsFree && (
                  <div>
                    <label className="block font-semibold mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      value={testPrice}
                      onChange={(e) => setTestPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Publish Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Broadcast Portal Announcement</h3>
            {broadcastSuccess && (
              <p className="text-xs font-bold text-emerald-600">✓ Notification broadcasted to all students!</p>
            )}
            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. MPSC New Pattern Tests Added!"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Write announcement details..."
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Create New Promo Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. MPSC50, MAHA20, DIWALI2026"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e: any) => setCouponType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {couponType === 'percentage' ? 'Percentage Value (%)' : 'Discount (₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Generate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Bulk Import Questions (JSON / CSV)</h3>
            <p className="text-xs text-slate-500">Paste JSON question array with bilingual Marathi fields to batch import into repository.</p>
            {bulkStatus && (
              <p className="text-xs font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg">{bulkStatus}</p>
            )}
            <textarea
              rows={8}
              value={bulkJsonText}
              onChange={(e) => setBulkJsonText(e.target.value)}
              className="w-full p-3 border rounded-xl font-mono text-xs bg-slate-50"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Import Questions Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
