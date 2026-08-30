import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { MockTest } from '../types';
import {
  X,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Languages,
  RotateCcw,
} from 'lucide-react';

interface TestDetailsModalProps {
  test: MockTest | null;
  isOpen: boolean;
  hasAccess: boolean;
  onClose: () => void;
  onStartTest: (testId: string) => void;
  onBuyTest: (test: MockTest) => void;
}

export const TestDetailsModal: React.FC<TestDetailsModalProps> = ({
  test,
  isOpen,
  hasAccess,
  onClose,
  onStartTest,
  onBuyTest,
}) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  if (!isOpen || !test) return null;

  const handleAction = () => {
    if (!user && !test.isFree) {
      onClose();
      openAuthModal('login');
      return;
    }

    if (test.isFree || hasAccess) {
      onClose();
      onStartTest(test.id);
    } else {
      onClose();
      onBuyTest(test);
    }
  };

  return (
    <div id="test-details-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white relative">
          <button
            id="close-test-details-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-indigo-300 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {test.examName || 'Competitive Exam'}
            </span>
            {test.isFree ? (
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                FREE TEST
              </span>
            ) : hasAccess ? (
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                ✓ UNLOCKED / ACCESS ACTIVE
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ₹{test.price} ONLY
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {test.title}
          </h2>
          {test.titleMarathi && (
            <p className="text-xs text-slate-300 mt-1 font-devanagari">
              {test.titleMarathi}
            </p>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('Total Questions', 'एकूण प्रश्न')}</span>
              <span className="text-lg font-black text-slate-900">{test.totalQuestions}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('Duration', 'वेळ मर्यादा')}</span>
              <span className="text-lg font-black text-slate-900">{test.durationMinutes} mins</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('Total Marks', 'एकूण गुण')}</span>
              <span className="text-lg font-black text-indigo-700">{test.totalMarks}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold block">{t('Negative Marking', 'नकारात्मक गुण')}</span>
              <span className="text-lg font-black text-rose-600">
                {test.negativeMarks > 0 ? `-${test.negativeMarks}` : '0.00'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('Test Description & Syllabus', 'चाचणी माहिती व अभ्यासक्रम')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-devanagari">
              {test.description}
            </p>
          </div>

          {/* Exam Rules & Instructions */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              {t('Examination Instructions & Rules', 'परीक्षेचे नियम व सूचना')}
            </h4>
            <ul className="text-xs text-amber-950/90 space-y-1.5 list-disc pl-4 font-devanagari leading-relaxed">
              <li>{t('Each correct question awards +' + test.positiveMarks + ' marks.', 'प्रत्येक बरोबर उत्तरासाठी +' + test.positiveMarks + ' गुण दिले जातील.')}</li>
              {test.negativeMarks > 0 && (
                <li>{t('Each incorrect response deducts -' + test.negativeMarks + ' marks (negative marking).', 'प्रत्येक चुकीच्या उत्तरासाठी -' + test.negativeMarks + ' गुण वजा केले जातील.')}</li>
              )}
              <li>{t('You can switch between English & Marathi on individual questions inside the exam interface.', 'परीक्षेदरम्यान प्रत्येक प्रश्नाची भाषा इंग्रजी किंवा मराठीमध्ये बदलण्याची सुविधा उपलब्ध आहे.')}</li>
              <li>{t('Answers are automatically saved securely. You can navigate, clear response, or mark questions for review.', 'प्रत्येक निवडलेले उत्तर तात्काळ सेव्ह होते. प्रश्न नंतर तपासण्यासाठी (Review) मार्क करता येतात.')}</li>
              <li>{t('The countdown timer runs automatically and will submit your paper when time expires.', 'वेळ संपल्यावर चाचणी आपोआप सबमिट होईल.')}</li>
            </ul>
          </div>

          {/* Additional parameters */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <span className="flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              {test.language === 'marathi' ? 'मराठी माध्यम' : test.language === 'english' ? 'English Medium' : 'Bilingual (मराठी + English)'}
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              {t(`Max Attempts: ${test.maxAttempts || 'Unlimited'}`, `कमाल संधी: ${test.maxAttempts || 'अमर्यादित'}`)}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {t(`Validity: ${test.validityDays} Days`, `वैधता: ${test.validityDays} दिवस`)}
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-4">
          <div>
            {test.isFree ? (
              <span className="text-base font-black text-emerald-700">{t('100% Free Practice', 'पूर्णतः मोफत सराव')}</span>
            ) : hasAccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t('Active in your account', 'आपल्या खात्यावर उपलब्ध')}
              </span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">₹{test.price}</span>
                {test.discountPrice && (
                  <span className="text-xs text-slate-400 line-through">₹{test.discountPrice}</span>
                )}
              </div>
            )}
          </div>

          <button
            id="modal-start-test-action"
            onClick={handleAction}
            className={`px-6 py-3 text-sm font-bold rounded-2xl transition shadow-md flex items-center gap-2 ${
              test.isFree || hasAccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            {test.isFree || hasAccess ? (
              <>
                <span>{t('Start Test Now', 'चाचणी सुरू करा')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{t(`Buy Now (₹${test.price})`, `आत्ता खरेदी करा (₹${test.price})`)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
