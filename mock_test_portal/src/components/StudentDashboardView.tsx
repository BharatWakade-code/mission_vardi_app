import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BookOpen,
  Award,
  Layers,
  Clock,
  TrendingUp,
  CreditCard,
  User as UserIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Download,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface StudentDashboardViewProps {
  initialTab?: string;
  onStartTest: (testId: string) => void;
  onResumeAttempt: (attemptId: string) => void;
  onViewResult: (resultId: string) => void;
  onExploreTests: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  initialTab = 'my-tests',
  onStartTest,
  onResumeAttempt,
  onViewResult,
  onExploreTests,
}) => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '');
  const [targetExam, setTargetExam] = useState((user as any)?.targetExam || 'MPSC Rajyaseva');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDashboard();
      setDashboardData(res.stats);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);
    try {
      const res = await api.updateProfile({
        name: profileName,
        mobile: profileMobile,
        targetExam,
      });
      updateUser(res.user);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update failed', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">{t('Loading your student dashboard...', 'डॅशबोर्ड लोड होत आहे...')}</p>
      </div>
    );
  }

  const { activeAttempts = [], recentResults = [], purchases = [], availableTests = [] } = dashboardData || {};

  // Quick stats
  const totalCompleted = recentResults.length;
  const avgAccuracy =
    recentResults.length > 0
      ? (
          recentResults.reduce((acc: number, r: any) => acc + (r.accuracy ?? r.accuracyPercentage ?? 0), 0) /
          recentResults.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              {t('Aspirant Learning Hub', 'विद्यार्थी डॅशबोर्ड')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('Namaskar', 'नमस्कार')}, {user?.name || 'Aspirant'}! 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-devanagari">
              {t('Target Exam:', 'लक्ष्य परीक्षा:')} <strong className="text-amber-300">{(user as any)?.targetExam || 'MPSC / Maharashtra Bharti'}</strong>
            </p>
          </div>

          <button
            onClick={onExploreTests}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('Browse Mock Tests', 'नवीन टेस्ट्स शोधा')}</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-amber-300">{availableTests.length}</span>
            <span className="text-[11px] text-slate-300">{t('Enrolled Tests', 'उपलब्ध चाचण्या')}</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-teal-300">{totalCompleted}</span>
            <span className="text-[11px] text-slate-300">{t('Tests Completed', 'पूर्ण चाचण्या')}</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-indigo-300">{avgAccuracy}%</span>
            <span className="text-[11px] text-slate-300">{t('Average Accuracy', 'सरासरी अचूकता')}</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-rose-300">{purchases.length}</span>
            <span className="text-[11px] text-slate-300">{t('Purchased Packs', 'खरेदी केलेले पॅक्स')}</span>
          </div>
        </div>
      </div>

      {/* 1. Resume Ongoing Test Notification (if in progress) */}
      {activeAttempts.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                {t('Test in Progress', 'चाचणी अपूर्ण आहे')}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {activeAttempts[0].test?.title || 'Mock Examination'}
              </h3>
              <p className="text-xs text-slate-600">
                {t('You have an active timer running on this exam.', 'आपला टाइमर चालू आहे. त्वरित पूर्ण करा.')}
              </p>
            </div>
          </div>

          <button
            id="resume-ongoing-test-btn"
            onClick={() => onResumeAttempt(activeAttempts[0].id)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t('Resume Test Now', 'चाचणी पुढे सुरू करा')}</span>
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('my-tests')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'my-tests'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('My Available Tests', 'माझ्या चाचण्या')} ({availableTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('Results & Solutions', 'निकाल व स्पष्टीकरणे')} ({recentResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'purchases'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t('Orders & Invoices', 'खरेदी पावती')} ({purchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t('Profile Settings', 'प्रोफाइल संपादन')}</span>
        </button>
      </div>

      {/* Tab 1: My Tests */}
      {activeTab === 'my-tests' && (
        <div className="space-y-4">
          {availableTests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">{t('No Tests Enrolled Yet', 'अद्याप कोणतीही टेस्ट जोडलेली नाही')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('Explore our free practice tests and comprehensive test series to start your preparation.', 'सराव सुरू करण्यासाठी मोफत चाचण्या पहा.')}
              </p>
              <button
                onClick={onExploreTests}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-xs"
              >
                {t('Explore Mock Tests', 'मॉक टेस्ट्स पहा')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableTests.map((test: any) => (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 uppercase">
                        {test.examName}
                      </span>
                      {test.isFree ? (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-100 text-emerald-800">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          ✓ UNLOCKED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{test.title}</h3>
                    {test.titleMarathi && (
                      <p className="text-xs text-slate-500 mt-1 font-devanagari line-clamp-1">
                        {test.titleMarathi}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                      <div className="p-1 bg-slate-50 rounded">
                        <span className="block font-bold">{test.totalQuestions}</span>
                        <span className="text-[10px] text-slate-400">Qs</span>
                      </div>
                      <div className="p-1 bg-slate-50 rounded">
                        <span className="block font-bold">{test.durationMinutes}m</span>
                        <span className="text-[10px] text-slate-400">Time</span>
                      </div>
                      <div className="p-1 bg-slate-50 rounded">
                        <span className="block font-bold">{test.totalMarks}</span>
                        <span className="text-[10px] text-slate-400">Marks</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      id={`start-enrolled-test-${test.id}`}
                      onClick={() => onStartTest(test.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t('Start Test Paper', 'चाचणी सोडवा')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Results & Solutions History */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {recentResults.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">{t('No Completed Tests Yet', 'अद्याप एकही चाचणी पूर्ण केलेली नाही')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('Attempt a mock test to view detailed ranking, marks, and Marathi solutions.', 'चाचणी दिल्यानंतर निकाल व स्पष्टीकरणे येथे दिसतील.')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">{t('Test Name', 'चाचणीचे नाव')}</th>
                      <th className="p-4">{t('Marks Obtained', 'मिळालेले गुण')}</th>
                      <th className="p-4">{t('Accuracy', 'अचूकता')}</th>
                      <th className="p-4">{t('State Rank', 'रँक')}</th>
                      <th className="p-4">{t('Date', 'दिनांक')}</th>
                      <th className="p-4 text-right">{t('Action', 'कृती')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentResults.map((r: any) => {
                      const marksObt = r.marksObtained ?? r.totalMarksObtained ?? 0;
                      const maxM = r.totalMarks ?? r.maxMarks ?? 100;
                      const accRate = r.accuracy ?? r.accuracyPercentage ?? 0;
                      const rankVal = r.rank ?? 1;

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-4 font-bold text-slate-900">
                            {r.test?.title || r.testTitle || 'Mock Examination'}
                          </td>
                          <td className="p-4 font-extrabold text-indigo-700">
                            {Number(marksObt).toFixed(1)} / {maxM}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {Number(accRate).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4 font-black text-amber-600">
                            #{rankVal}
                          </td>
                          <td className="p-4 text-slate-500">
                            {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`view-result-btn-${r.id}`}
                              onClick={() => onViewResult(r.id)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition"
                            >
                              {t('View Solutions', 'स्पष्टीकरण पहा')} →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Purchases & Invoices */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">{t('No Purchases Recorded', 'कोणतीही खरेदी नाही')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('When you purchase test series or mock packs via Razorpay, receipts will be listed here.', 'खरेदी केलेल्या टेस्ट सिरीजच्या पावत्या येथे दिसतील.')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">{t('Product Title', 'उत्पादन')}</th>
                      <th className="p-4">{t('Amount Paid', 'रक्कम')}</th>
                      <th className="p-4">{t('Payment ID', 'पेमेंट आयडी')}</th>
                      <th className="p-4">{t('Purchase Date', 'खरेदी दिनांक')}</th>
                      <th className="p-4">{t('Status', 'स्थिती')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchases.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-900">
                          {p.product?.title || p.productId}
                        </td>
                        <td className="p-4 font-black text-slate-900">
                          ₹{p.amount}
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">
                          {p.razorpayPaymentId || 'pay_verified'}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3" /> ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs max-w-xl">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{t('Edit Aspirant Profile', 'विद्यार्थी प्रोफाइल संपादन')}</h3>
          <p className="text-xs text-slate-500 mb-6">{t('Keep your contact info and exam targets updated.', 'आपली माहिती अद्ययावत ठेवा.')}</p>

          {profileSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('Profile updated successfully!', 'प्रोफाइल यशस्वीपणे सेव्ह झाले!')}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Full Name', 'पूर्ण नाव')}</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Mobile Number', 'मोबाईल नंबर')}</label>
              <input
                type="tel"
                value={profileMobile}
                onChange={(e) => setProfileMobile(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Primary Target Exam', 'मुख्य लक्ष्य परीक्षा')}</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 font-semibold text-slate-800"
              >
                <option value="MPSC Rajyaseva">MPSC Rajyaseva (राज्यसेवा)</option>
                <option value="MPSC Combine Group B & C">MPSC Combine Group B & C (संयुक्त पूर्व)</option>
                <option value="Maharashtra Police Bharti">Maharashtra Police Bharti (पोलीस भरती)</option>
                <option value="Talathi Bharti">Talathi Bharti (तलाठी भरती)</option>
                <option value="Banking & SSC">Banking IBPS & SSC CGL</option>
                <option value="UPSC Civil Services">UPSC Civil Services</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSavingProfile ? 'Saving...' : t('Save Profile Changes', 'बदल सेव्ह करा')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
