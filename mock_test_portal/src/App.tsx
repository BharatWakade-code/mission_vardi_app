import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { HomeView } from './components/HomeView';
import { TestsExploreView } from './components/TestsExploreView';
import { TestSeriesView } from './components/TestSeriesView';
import { TestDetailsModal } from './components/TestDetailsModal';
import { TestEngineView } from './components/TestEngineView';
import { ResultAnalyticsView } from './components/ResultAnalyticsView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { AdminPortalPage } from './components/AdminPortalPage';
import { PYQView } from './components/PYQView';
import { StudyNotesView } from './components/StudyNotesView';
import { LeaderboardView } from './components/LeaderboardView';
import { api } from './services/api';
import { Exam, Category, MockTest, TestSeries, NotificationItem, Subject } from './types';

function MainApp() {
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();

  // URL Path-Based Routing State
  const [pathname, setPathname] = useState<string>(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));

  // Sync pathname with browser history events (back/forward, popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setPathname(window.location.pathname);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const navigateUrl = (url: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url);
        setPathname(url);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string | undefined>(undefined);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | undefined>(undefined);
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string | undefined>(undefined);
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | undefined>(undefined);
  const [dashboardSubTab, setDashboardSubTab] = useState<string>('my-tests');

  // Active attempt / result view states
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  // Global Data
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [purchasedTestIds, setPurchasedTestIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal States
  const [selectedTestForDetails, setSelectedTestForDetails] = useState<MockTest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [paymentProduct, setPaymentProduct] = useState<any | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadPlatformData();
  }, [user]);

  const loadPlatformData = async () => {
    try {
      setIsLoading(true);
      const [exRes, catRes, subjRes, tRes, sRes, nRes] = await Promise.all([
        api.getExams(),
        api.getCategories(),
        api.getSubjects(),
        api.getTests(),
        api.getTestSeries(),
        api.getNotifications(),
      ]);

      setExams(exRes.exams || []);
      setCategories(catRes.categories || []);
      setSubjects(subjRes.subjects || []);
      setTests(tRes.tests || []);
      setTestSeries(sRes.testSeries || []);
      setNotifications(nRes.notifications || []);

      if (user) {
        try {
          const purchasesRes = await api.getStudentPurchases();
          const purchasedIds = new Set<string>();
          purchasesRes.purchases?.forEach((p: any) => {
            if (p.productType === 'test') {
              purchasedIds.add(p.productId);
            } else if (p.productType === 'test_series') {
              const series = sRes.testSeries.find((s: any) => s.id === p.productId);
              series?.testIds?.forEach((tid: string) => purchasedIds.add(tid));
            }
          });
          setPurchasedTestIds(purchasedIds);
        } catch (pErr) {
          console.warn('Could not fetch user purchases:', pErr);
        }
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tab switcher
  const handleSelectTab = (tab: string, extra?: any) => {
    // Reset test engine / result view if navigating away
    if (tab !== 'test-engine' && tab !== 'results') {
      setActiveAttemptId(null);
      setActiveResultId(null);
    }

    if (tab === 'admin') {
      navigateUrl('/admin');
      return;
    }

    if (tab === 'free-tests') {
      setSelectedExamFilter(undefined);
      setSelectedSubjectFilter(undefined);
      setSelectedSubcategoryFilter(undefined);
      setIsFreeFilter(true);
      setCurrentTab('tests');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'tests') {
      setSelectedExamFilter(extra?.examId);
      setSelectedSubjectFilter(extra?.subjectId);
      setSelectedSubcategoryFilter(extra?.subcategory);
      setIsFreeFilter(extra?.isFree);
    }

    if (tab === 'dashboard' && extra?.tab) {
      setDashboardSubTab(extra.tab);
    }

    setCurrentTab(tab);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Test Actions
  const handleOpenTestDetails = (test: MockTest) => {
    setSelectedTestForDetails(test);
    setIsDetailsOpen(true);
  };

  const handleStartTest = async (testId: string) => {
    try {
      setIsLoading(true);
      const res = await api.startAttempt(testId);
      setActiveAttemptId(res.attempt.id);
      setCurrentTab('test-engine');
    } catch (err: any) {
      if (err.code === 'PAYMENT_REQUIRED') {
        const targetTest = tests.find((t) => t.id === testId);
        if (targetTest) {
          handleBuyProduct({
            id: targetTest.id,
            type: 'test',
            title: targetTest.title,
            price: targetTest.price,
            discountPrice: targetTest.discountPrice,
            validityDays: targetTest.validityDays,
          });
        }
      } else {
        alert(err.message || 'Unable to start test session.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyProduct = (product: any) => {
    setPaymentProduct(product);
    setIsPaymentOpen(true);
  };

  const handleFinishTest = (resultId: string) => {
    setActiveResultId(resultId);
    setActiveAttemptId(null);
    setCurrentTab('results');
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // If route is /admin, render dedicated Admin Portal (isolated from student site layout)
  if (pathname.startsWith('/admin')) {
    return (
      <AdminPortalPage
        onBackToStudentView={() => {
          navigateUrl('/');
          setCurrentTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans text-[#111827]">
      {/* 1. Global Navbar (Hidden during active test engine to maintain distraction-free exam environment) */}
      {currentTab !== 'test-engine' && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          unreadNotifsCount={unreadNotifsCount}
          onOpenNotifs={() => setIsNotifsOpen(true)}
        />
      )}

      {/* 2. Main Viewport */}
      <main className="flex-1">
        {currentTab === 'test-engine' && activeAttemptId ? (
          <TestEngineView
            attemptId={activeAttemptId}
            onFinishTest={handleFinishTest}
            onExitToDashboard={() => handleSelectTab('dashboard')}
          />
        ) : currentTab === 'results' && activeResultId ? (
          <ResultAnalyticsView
            resultId={activeResultId}
            onRetakeTest={(testId) => handleStartTest(testId)}
            onBackToDashboard={() => handleSelectTab('dashboard')}
          />
        ) : currentTab === 'dashboard' ? (
          <StudentDashboardView
            initialTab={dashboardSubTab}
            onStartTest={(testId) => handleStartTest(testId)}
            onResumeAttempt={(attemptId) => {
              setActiveAttemptId(attemptId);
              setCurrentTab('test-engine');
            }}
            onViewResult={(resId) => {
              setActiveResultId(resId);
              setCurrentTab('results');
            }}
            onExploreTests={() => handleSelectTab('tests')}
          />
        ) : currentTab === 'tests' ? (
          <TestsExploreView
            tests={tests}
            exams={exams}
            categories={categories}
            subjects={subjects}
            initialExamId={selectedExamFilter}
            initialSubjectId={selectedSubjectFilter}
            initialSubcategory={selectedSubcategoryFilter}
            initialIsFree={isFreeFilter}
            onOpenTestDetails={handleOpenTestDetails}
            onStartDirectTest={(test) => handleStartTest(test.id)}
          />
        ) : currentTab === 'pyqs' ? (
          <PYQView onStartTestByExam={(examCategory) => handleSelectTab('tests', { subcategory: examCategory })} />
        ) : currentTab === 'notes' ? (
          <StudyNotesView />
        ) : currentTab === 'leaderboard' ? (
          <LeaderboardView />
        ) : currentTab === 'series' ? (
          <TestSeriesView
            seriesList={testSeries}
            allTests={tests}
            onOpenSeriesDetails={(series) =>
              handleBuyProduct({
                id: series.id,
                type: 'test_series',
                title: series.title,
                price: series.price,
                discountPrice: series.discountPrice,
                validityMonths: series.validityMonths,
              })
            }
            onBuySeries={(series) =>
              handleBuyProduct({
                id: series.id,
                type: 'test_series',
                title: series.title,
                price: series.price,
                discountPrice: series.discountPrice,
                validityMonths: series.validityMonths,
              })
            }
          />
        ) : (
          /* Home View */
          <HomeView
            exams={exams}
            categories={categories}
            subjects={subjects}
            featuredTests={tests}
            testSeries={testSeries}
            onSelectExam={(examId) => handleSelectTab('tests', { examId })}
            onSelectSubject={(subjectId, subcategory) =>
              handleSelectTab('tests', { subjectId, subcategory })
            }
            onOpenTestDetails={handleOpenTestDetails}
            onOpenSeriesDetails={(series) =>
              handleBuyProduct({
                id: series.id,
                type: 'test_series',
                title: series.title,
                price: series.price,
                discountPrice: series.discountPrice,
                validityMonths: series.validityMonths,
              })
            }
            onNavigateTests={(params) => handleSelectTab('tests', params)}
            onSelectTab={(tab, extra) => handleSelectTab(tab, extra)}
          />
        )}
      </main>

      {/* 3. Global Footer (Hidden in test engine) */}
      {currentTab !== 'test-engine' && (
        <Footer
          onSelectCategory={(examId) => handleSelectTab('tests', { examId })}
          onNavigateAdmin={() => navigateUrl('/admin')}
        />
      )}

      {/* 4. Global Modals */}
      <AuthModal />

      {selectedTestForDetails && (
        <TestDetailsModal
          test={selectedTestForDetails}
          isOpen={isDetailsOpen}
          hasAccess={
            selectedTestForDetails.isFree ||
            purchasedTestIds.has(selectedTestForDetails.id)
          }
          onClose={() => setIsDetailsOpen(false)}
          onStartTest={(testId) => handleStartTest(testId)}
          onBuyTest={(test) =>
            handleBuyProduct({
              id: test.id,
              type: 'test',
              title: test.title,
              price: test.price,
              discountPrice: test.discountPrice,
              validityDays: test.validityDays,
            })
          }
        />
      )}

      {paymentProduct && (
        <PaymentModal
          product={paymentProduct}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={() => {
            loadPlatformData();
            if (paymentProduct.type === 'test') {
              handleStartTest(paymentProduct.id);
            } else {
              handleSelectTab('dashboard');
            }
          }}
        />
      )}

      <NotificationDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onNavigate={(link) => handleSelectTab(link)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
