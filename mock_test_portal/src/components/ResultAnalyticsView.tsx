import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Trophy,
  Award,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ResultAnalyticsViewProps {
  resultId: string;
  onRetakeTest: (testId: string) => void;
  onBackToDashboard: () => void;
}

export const ResultAnalyticsView: React.FC<ResultAnalyticsViewProps> = ({
  resultId,
  onRetakeTest,
  onBackToDashboard,
}) => {
  const { t } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review filters & solution language
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [solutionLang, setSolutionLang] = useState<'mr' | 'en'>('mr');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.getResult(resultId);
        setData(res);

        // Confetti on good score
        if (res.result && res.result.percentage >= 50) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load test result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">{t('Calculating your Rank & Percentile...', 'गुण व रँकिंगचे विश्लेषण सुरू आहे...')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center max-w-md space-y-4 shadow-lg">
          <p className="text-rose-600 font-bold text-sm">{error || 'Result not found'}</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            {t('Back to Dashboard', 'डॅशबोर्डवर परत जा')}
          </button>
        </div>
      </div>
    );
  }

  const { result, test, attempt } = data;
  const questions = result.detailedQuestions || [];

  // Filtered review questions
  const filteredQuestions = questions.filter((q: any) => {
    if (reviewFilter === 'correct') return q.isCorrect === true;
    if (reviewFilter === 'incorrect') return q.isCorrect === false;
    if (reviewFilter === 'unanswered') return q.isAttempted === false;
    return true;
  });

  const formatTime = (secs?: number) => {
    if (!secs && secs !== 0) return '0m 0s';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const marksObtainedVal = result.marksObtained ?? result.totalMarksObtained ?? 0;
  const totalMarksVal = result.totalMarks ?? result.maxMarks ?? (test?.totalMarks || 100);
  const percentageVal = result.percentage ?? (totalMarksVal > 0 ? (marksObtainedVal / totalMarksVal) * 100 : 0);
  const accuracyVal = result.accuracy ?? result.accuracyPercentage ?? 0;
  const percentileVal = result.percentile ?? 95.0;
  const rankVal = result.rank ?? 1;

  // Subject Chart Data
  const subjectList = result.subjectWiseAnalysis || result.subjectBreakdown || [];
  const subjectChartData = subjectList.map((s: any) => ({
    name: (s.subjectName || 'General').split(' ')[0],
    fullName: s.subjectName || 'General Studies',
    accuracy: s.accuracy ?? 0,
    marks: s.marksObtained ?? s.obtainedMarks ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to My Dashboard', 'डॅशबोर्डवर जा')}</span>
        </button>

        <button
          onClick={() => onRetakeTest(test?.id || result.testId)}
          className="text-xs font-bold text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('Re-attempt Test', 'पुन्हा परीक्षा द्या')}</span>
        </button>
      </div>

      {/* 1. Score & Rank Trophy Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Main Score */}
          <div className="space-y-2">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {test?.examName || 'Mock Examination'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {test?.title || result.testTitle || 'Exam Analysis'}
            </h1>
            <p className="text-xs text-slate-300 font-devanagari">
              {t('Exam completed on', 'परीक्षा दिनांक:')} {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'Today'}
            </p>
          </div>

          {/* Big Score Number */}
          <div className="flex items-center justify-center lg:justify-center gap-6 py-4 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/10">
            <div className="text-center">
              <span className="text-4xl sm:text-5xl font-black text-amber-300">
                {Number(marksObtainedVal).toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400 block">
                / {totalMarksVal} {t('Marks', 'गुण')}
              </span>
            </div>
            <div className="text-left space-y-1">
              <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {Number(percentageVal).toFixed(1)}% {t('Percentage', 'टक्केवारी')}
              </span>
              <p className="text-xs text-slate-300">
                {percentageVal >= 60 ? '🌟 Outstanding Performance!' : '👍 Good Effort. Keep Practicing!'}
              </p>
            </div>
          </div>

          {/* Rank & Percentile Badges */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md">
              <Trophy className="w-5 h-5 text-amber-300 mx-auto mb-1" />
              <span className="text-xl font-black text-white block">#{rankVal}</span>
              <span className="text-[11px] text-slate-300">{t('State Rank', 'राज्य रँक')}</span>
            </div>
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md">
              <Target className="w-5 h-5 text-teal-300 mx-auto mb-1" />
              <span className="text-xl font-black text-white block">{Number(percentileVal).toFixed(1)}%</span>
              <span className="text-[11px] text-slate-300">{t('Percentile', 'पर्सेंटाईल')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
          <span className="text-2xl font-black text-slate-900 block">{result.correctCount ?? 0}</span>
          <span className="text-xs text-slate-500 font-semibold">{t('Correct Answers', 'बरोबर उत्तरे')}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <XCircle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
          <span className="text-2xl font-black text-slate-900 block">{result.incorrectCount ?? 0}</span>
          <span className="text-xs text-slate-500 font-semibold">{t('Incorrect Answers', 'चुकीची उत्तरे')}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <Target className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
          <span className="text-2xl font-black text-slate-900 block">{Number(accuracyVal).toFixed(1)}%</span>
          <span className="text-xs text-slate-500 font-semibold">{t('Accuracy Rate', 'अचूकता')}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center">
          <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
          <span className="text-2xl font-black text-slate-900 block">{formatTime(result.timeTakenSeconds)}</span>
          <span className="text-xs text-slate-500 font-semibold">{t('Total Time Taken', 'घेतलेला वेळ')}</span>
        </div>
      </div>

      {/* 3. Subject-wise Performance Chart */}
      {subjectChartData.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            {t('Subject-wise Accuracy & Marks Breakdown', 'विषयनिहाय अचूकता व गुण विश्लेषण')}
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}% Accuracy`, 'Accuracy']}
                  labelFormatter={(label, items: any) => items[0]?.payload?.fullName || label}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {subjectChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.accuracy >= 70 ? '#10b981' : entry.accuracy >= 40 ? '#6366f1' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. Question-by-Question Solution Review */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              {t('Detailed Solutions & Explanations', 'सविस्तर उत्तरे व मराठी स्पष्टीकरणे')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('Review your mistakes, correct options, and detailed reference notes.', 'चुकांचे विश्लेषण, अचूक पर्याय व संदर्भ टीपा.')}
            </p>
          </div>

          {/* Controls: Filter + Bilingual Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t('All', 'सर्व')} ({questions.length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ✓ {t('Correct', 'बरोबर')} ({result.correctCount})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  reviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                ✕ {t('Wrong', 'चूक')} ({result.incorrectCount})
              </button>
            </div>

            {/* Language toggle for solution */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSolutionLang('mr')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  solutionLang === 'mr' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setSolutionLang('en')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  solutionLang === 'en' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filteredQuestions.map((q: any, index: number) => {
            const isCorrect = q.isCorrect === true;
            const isWrong = q.isCorrect === false;
            const isUnattempted = !q.isAttempted;

            const qText = solutionLang === 'mr' && q.textMarathi ? q.textMarathi : q.text;
            const expText =
              solutionLang === 'mr' && q.explanationMarathi ? q.explanationMarathi : q.explanation;

            return (
              <div
                key={q.questionId || index}
                className={`p-5 rounded-2xl border-2 transition ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isWrong
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-slate-50/30'
                }`}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {q.questionNumber || index + 1}
                    </span>
                    {isCorrect && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +{q.marksObtained} {t('Marks', 'गुण')}
                      </span>
                    )}
                    {isWrong && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-100 text-rose-800 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> -{test.negativeMarks} {t('Negative', 'वजा')}
                      </span>
                    )}
                    {isUnattempted && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-200 text-slate-700">
                        {t('Skipped', 'सोडवला नाही')} (0 Marks)
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    {t('Time Spent:', 'वेळ:')} <strong>{q.timeSpentSeconds}s</strong>
                  </span>
                </div>

                {/* Question Text */}
                <div className="text-sm font-semibold text-slate-900 mb-4 font-devanagari">
                  {qText}
                </div>

                {/* Options List with Color Highlights */}
                <div className="space-y-2 mb-4">
                  {q.options?.map((opt: any, optIdx: number) => {
                    const optText = solutionLang === 'mr' && opt.textMarathi ? opt.textMarathi : opt.text;
                    const isSelectedByStudent = opt.id === q.selectedOption;
                    const isCorrectAnswer = opt.id === q.correctOptionId || opt.isCorrect;
                    const label = ['A', 'B', 'C', 'D'][optIdx] || String(optIdx + 1);

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-bold';
                    } else if (isSelectedByStudent && !isCorrectAnswer) {
                      optStyle = 'border-rose-500 bg-rose-100/70 text-rose-950 line-through';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-devanagari ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                            {label}
                          </span>
                          <span>{optText}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded">
                            {t('Correct Answer', 'अचूक उत्तर')}
                          </span>
                        )}
                        {isSelectedByStudent && !isCorrectAnswer && (
                          <span className="text-[11px] font-bold uppercase text-rose-700 bg-rose-200 px-2 py-0.5 rounded">
                            {t('Your Choice (Wrong)', 'तुमचा पर्याय (चूक)')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Marathi & English Detailed Explanation Box */}
                {expText && (
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                      {t('Detailed Explanation (स्पष्टीकरण):', 'सविस्तर संदर्भ व स्पष्टीकरण:')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari pt-1">
                      {expText}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
