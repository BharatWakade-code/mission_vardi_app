import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Send,
  Languages,
  Grid,
  Menu,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface TestEngineViewProps {
  attemptId: string;
  onFinishTest: (resultId: string) => void;
  onExitToDashboard: () => void;
}

export const TestEngineView: React.FC<TestEngineViewProps> = ({
  attemptId,
  onFinishTest,
  onExitToDashboard,
}) => {
  const { t } = useLanguage();
  const [attempt, setAttempt] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Question navigation & state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOption?: string | string[]; isMarkedForReview?: boolean; timeSpentSeconds?: number }>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [questionLang, setQuestionLang] = useState<'mr' | 'en'>('mr'); // Default to Marathi for Maharashtra exams or fallback
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // 1. Fetch initial attempt data
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const res = await api.getAttempt(attemptId);
        setAttempt(res.attempt);
        setAnswers(res.attempt.answers || {});
        setRemainingSeconds(Math.max(0, res.attempt.remainingSeconds || 0));

        // Mark first question visited
        if (res.attempt.questions && res.attempt.questions.length > 0) {
          setVisitedQuestions(new Set([res.attempt.questions[0].id]));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load test attempt');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (remainingSeconds <= 0 && attempt && !loading) {
      if (attempt.status === 'in_progress') {
        handleSubmitTest();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingSeconds, attempt, loading]);

  const questions = attempt?.questions || [];
  const currentQuestion = questions[currentIndex];

  // Track time spent per question
  const recordQuestionTime = () => {
    if (!currentQuestion) return;
    const now = Date.now();
    const elapsedSec = Math.floor((now - questionStartTimeRef.current) / 1000);
    questionStartTimeRef.current = now;

    if (elapsedSec > 0) {
      const existing = answers[currentQuestion.id] || {};
      const newTotal = (existing.timeSpentSeconds || 0) + elapsedSec;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...existing,
          timeSpentSeconds: newTotal,
        },
      }));
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (!currentQuestion) return;
    recordQuestionTime();

    const existing = answers[currentQuestion.id] || {};
    const updated = {
      ...existing,
      selectedOption: optionId,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updated,
    }));

    // Auto-save to backend
    try {
      await api.saveAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOption: optionId,
        isMarkedForReview: existing.isMarkedForReview || false,
        timeSpentSeconds: updated.timeSpentSeconds,
      });
    } catch (err) {
      console.warn('Failed to auto-save answer:', err);
    }
  };

  const handleClearResponse = async () => {
    if (!currentQuestion) return;
    recordQuestionTime();

    const existing = answers[currentQuestion.id] || {};
    const updated = {
      ...existing,
      selectedOption: undefined,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updated,
    }));

    try {
      await api.saveAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOption: undefined,
        isMarkedForReview: existing.isMarkedForReview || false,
      });
    } catch (err) {
      console.warn('Failed to clear answer:', err);
    }
  };

  const handleToggleMarkForReview = async () => {
    if (!currentQuestion) return;
    recordQuestionTime();

    const existing = answers[currentQuestion.id] || {};
    const isMarked = !existing.isMarkedForReview;
    const updated = {
      ...existing,
      isMarkedForReview: isMarked,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updated,
    }));

    try {
      await api.saveAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOption: existing.selectedOption,
        isMarkedForReview: isMarked,
      });
    } catch (err) {
      console.warn('Failed to mark answer for review:', err);
    }
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    recordQuestionTime();
    setCurrentIndex(index);
    const targetQ = questions[index];
    setVisitedQuestions((prev) => new Set([...prev, targetQ.id]));
    setIsMobilePaletteOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    recordQuestionTime();
    setIsSubmitting(true);
    try {
      const res = await api.submitAttempt(attemptId);
      onFinishTest(res.result.id);
    } catch (err: any) {
      setError(err.message || 'Failed to submit test');
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  // Format countdown string
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Palette Status helper
  const getQuestionStatus = (qId: string, idx: number) => {
    const ans = answers[qId];
    const isVisited = visitedQuestions.has(qId);
    const hasAnswer = ans && ans.selectedOption !== undefined && ans.selectedOption !== '';
    const isMarked = ans && ans.isMarkedForReview;

    if (hasAnswer && isMarked) return 'answered_marked'; // Purple with check
    if (isMarked) return 'marked'; // Purple
    if (hasAnswer) return 'answered'; // Green
    if (isVisited) return 'not_answered'; // Red
    return 'not_visited'; // Gray
  };

  // Palette counts
  const paletteStats = questions.reduce(
    (acc: any, q: any) => {
      const status = getQuestionStatus(q.id, 0);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { answered: 0, not_answered: 0, marked: 0, answered_marked: 0, not_visited: 0 }
  );

  const isLowTime = remainingSeconds < 300; // Under 5 mins

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">
          {t('Loading Test Engine & Questions...', 'चाचणी व प्रश्न लोड होत आहेत...')}
        </p>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-center max-w-md space-y-4 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">{t('Unable to Load Exam', 'परीक्षा लोड होऊ शकली नाही')}</h3>
          <p className="text-xs text-slate-600">{error || 'Invalid test session or expired attempt.'}</p>
          <button
            onClick={onExitToDashboard}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            {t('Return to Dashboard', 'डॅशबोर्डवर परत जा')}
          </button>
        </div>
      </div>
    );
  }

  // Active question bilingual text
  const questionText =
    questionLang === 'mr' && currentQuestion.textMarathi
      ? currentQuestion.textMarathi
      : currentQuestion.text;

  const currentAnswer = answers[currentQuestion.id] || {};

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none text-slate-900">
      {/* 1. Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Test Name */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-indigo-600 text-white shrink-0">
              EXAM
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
              {attempt.test?.title || 'Mock Examination'}
            </h2>
          </div>

          {/* Center Timer */}
          <div
            id="exam-timer-display"
            className={`flex items-center gap-2 px-3 py-1 rounded-xl font-mono font-bold text-sm sm:text-base border shadow-xs ${
              isLowTime
                ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-slate-800 text-emerald-300 border-slate-700'
            }`}
          >
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          {/* Actions: Mobile Palette Toggle & Submit button */}
          <div className="flex items-center gap-2">
            <button
              id="mobile-palette-toggle-btn"
              onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Question Palette"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              id="header-submit-test-btn"
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Submit Test', 'पेपर सबमिट करा')}</span>
              <span className="sm:hidden">{t('Submit', 'सबमिट')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Exam Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left: Question Presentation Area (3 columns) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
          {/* Question Sub-Header with Marks, Lang Toggle & Number */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t('Question', 'प्रश्न')} {currentIndex + 1} / {questions.length}
              </span>
              {currentQuestion.subjectName && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded-md">
                  {currentQuestion.subjectName}
                </span>
              )}
            </div>

            {/* Marks & Language Toggle */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                  +{attempt.test?.positiveMarks || 1}
                </span>
                {attempt.test?.negativeMarks > 0 && (
                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-bold">
                    -{attempt.test?.negativeMarks}
                  </span>
                )}
              </div>

              {/* Language Switcher for Current Question */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  id="btn-lang-mr"
                  onClick={() => setQuestionLang('mr')}
                  className={`px-2 py-1 rounded font-bold transition ${
                    questionLang === 'mr' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मराठी
                </button>
                <button
                  id="btn-lang-en"
                  onClick={() => setQuestionLang('en')}
                  className={`px-2 py-1 rounded font-bold transition ${
                    questionLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 sm:p-6 flex-1 space-y-6">
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed font-devanagari">
              {questionText}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options?.map((opt: any, optIdx: number) => {
                const optText =
                  questionLang === 'mr' && opt.textMarathi ? opt.textMarathi : opt.text;
                const isSelected = currentAnswer.selectedOption === opt.id;
                const optionLabel = ['A', 'B', 'C', 'D', 'E'][optIdx] || String(optIdx + 1);

                return (
                  <label
                    key={opt.id}
                    id={`option-${opt.id}`}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-2xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {optionLabel}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed font-devanagari pt-0.5">
                      {optText}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer (Navigation, Mark for Review, Clear) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="btn-mark-review"
                onClick={handleToggleMarkForReview}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  currentAnswer.isMarkedForReview
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {currentAnswer.isMarkedForReview
                    ? t('Marked for Review', 'रिव्ह्यूसाठी मार्क केले')
                    : t('Mark for Review', 'रिव्ह्यू करा')}
                </span>
              </button>

              {currentAnswer.selectedOption && (
                <button
                  id="btn-clear-response"
                  onClick={handleClearResponse}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('Clear Response', 'उत्तर रद्द करा')}</span>
                </button>
              )}
            </div>

            {/* Next / Previous Navigation */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                id="btn-prev-question"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('Previous', 'मागील')}</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  id="btn-next-question"
                  onClick={handleNext}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs transition flex items-center gap-1"
                >
                  <span>{t('Next & Save', 'पुढील प्रश्न')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-final-submit"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('Finish & Submit', 'पेपर सबमिट करा')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette (Desktop Column + Mobile Modal) */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 p-4 transform transition-transform lg:static lg:transform-none lg:w-auto lg:p-0 lg:border-none lg:z-auto ${
            isMobilePaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
            {/* Header with Close on Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-indigo-600" />
                {t('Question Palette', 'प्रश्न तालिका')}
              </h3>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
              <div className="flex items-center gap-2 p-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {paletteStats.answered}
                </span>
                <span className="truncate">{t('Answered', 'सोडवले')}</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-rose-50 rounded-lg border border-rose-100">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {paletteStats.not_answered}
                </span>
                <span className="truncate">{t('Not Answered', 'अनुत्तरित')}</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-purple-50 rounded-lg border border-purple-100">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {paletteStats.marked}
                </span>
                <span className="truncate">{t('Review', 'रिव्ह्यू')}</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-md bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                  {paletteStats.not_visited}
                </span>
                <span className="truncate">{t('Not Visited', 'पाहिले नाही')}</span>
              </div>
            </div>

            {/* Palette Grid Numbers */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t('Jump to Question', 'प्रश्नावर जा')}
              </span>
              <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {questions.map((q: any, idx: number) => {
                  const status = getQuestionStatus(q.id, idx);
                  const isCurrent = idx === currentIndex;

                  let btnBg = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (status === 'answered') btnBg = 'bg-emerald-600 text-white border-emerald-700';
                  else if (status === 'not_answered') btnBg = 'bg-rose-500 text-white border-rose-600';
                  else if (status === 'marked') btnBg = 'bg-purple-600 text-white border-purple-700';
                  else if (status === 'answered_marked') btnBg = 'bg-purple-600 text-white border-emerald-400 border-2';

                  return (
                    <button
                      key={q.id}
                      id={`palette-btn-${idx + 1}`}
                      onClick={() => goToQuestion(idx)}
                      className={`h-9 rounded-xl font-bold text-xs transition border flex items-center justify-center relative ${btnBg} ${
                        isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 z-10' : 'hover:opacity-90'
                      }`}
                    >
                      {idx + 1}
                      {status === 'answered_marked' && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-300 ring-1 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructions box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                {t('Autosave Active', 'स्वयं-सेव्हिंग सुरू आहे')}
              </p>
              <p>{t('Responses are backed up to the cloud instantly.', 'तुमची उत्तरे तात्काळ क्लाउडवर सेव्ह होत आहेत.')}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. Submit Confirmation Modal */}
      {showSubmitModal && (
        <div id="submit-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold">{t('Submit Examination Paper?', 'चाचणी सबमिट करावी का?')}</h3>
              <p className="text-xs text-slate-300 mt-1 font-devanagari">
                {t('Once submitted, you will immediately see your detailed result, rank, and solutions.', 'सबमिट केल्यानंतर आपला निकाल, रँक व सविस्तर उत्तरे तात्काळ मिळतील.')}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Stats Summary Table */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-xl font-black text-emerald-700 block">{paletteStats.answered + paletteStats.answered_marked}</span>
                  <span className="text-slate-600 font-semibold">{t('Questions Answered', 'सोडवलेले प्रश्न')}</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <span className="text-xl font-black text-rose-700 block">{paletteStats.not_answered + paletteStats.not_visited}</span>
                  <span className="text-slate-600 font-semibold">{t('Unanswered Questions', 'अनुत्तरित प्रश्न')}</span>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                  <span className="text-xl font-black text-purple-700 block">{paletteStats.marked + paletteStats.answered_marked}</span>
                  <span className="text-slate-600 font-semibold">{t('Marked for Review', 'रिव्ह्यू केलेले')}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xl font-black text-slate-900 block">{questions.length}</span>
                  <span className="text-slate-600 font-semibold">{t('Total Questions', 'एकूण प्रश्न')}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="cancel-submit-btn"
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  {t('Resume Test', 'चाचणी सुरू ठेवा')}
                </button>
                <button
                  id="confirm-submit-btn"
                  type="button"
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('Yes, Submit Now', 'होय, सबमिट करा')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
