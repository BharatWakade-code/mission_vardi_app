import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Exam, MockTest, TestSeries, Subject, Category } from '../types';
import {
  GraduationCap,
  Shield,
  FileText,
  Landmark,
  Award,
  Train,
  Compass,
  BookOpen,
  Building2,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Zap,
  FlaskConical,
  Calculator,
  Brain,
  Scroll,
  Globe2,
  Languages,
  Newspaper,
  Layers,
  Trophy,
  LayoutGrid,
} from 'lucide-react';

interface HomeViewProps {
  exams: Exam[];
  categories?: Category[];
  subjects?: Subject[];
  featuredTests: MockTest[];
  testSeries: TestSeries[];
  onSelectExam: (examId: string) => void;
  onSelectSubject?: (subjectId: string, subcategory?: string) => void;
  onOpenTestDetails: (test: MockTest) => void;
  onOpenSeriesDetails: (series: TestSeries) => void;
  onNavigateTests: (params?: any) => void;
  onSelectTab?: (tab: string, extra?: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  exams,
  subjects = [],
  featuredTests,
  testSeries,
  onSelectExam,
  onSelectSubject,
  onOpenTestDetails,
  onOpenSeriesDetails,
  onNavigateTests,
  onSelectTab,
}) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isExamGridView, setIsExamGridView] = useState(false);
  const examScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollExams = (direction: 'left' | 'right') => {
    if (examScrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      examScrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getExamIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'Shield': return Shield;
      case 'FileText': return FileText;
      case 'Landmark': return Landmark;
      case 'Award': return Award;
      case 'Train': return Train;
      case 'Compass': return Compass;
      case 'BookOpen': return BookOpen;
      default: return Building2;
    }
  };

  const getSubjectIcon = (iconName?: string) => {
    switch (iconName) {
      case 'FlaskConical': return FlaskConical;
      case 'Calculator': return Calculator;
      case 'Brain': return Brain;
      case 'Landmark': return Landmark;
      case 'Scroll': return Scroll;
      case 'Globe2': return Globe2;
      case 'TrendingUp': return TrendingUp;
      case 'BookOpen': return BookOpen;
      case 'Languages': return Languages;
      case 'Newspaper': return Newspaper;
      default: return Layers;
    }
  };

  const faqs = [
    {
      q: t('How is the mock test interface similar to actual MPSC / TCS exam software?', 'मॉक टेस्टचा इंटरफेस एमपीएससी आणि टीसीएसच्या प्रत्यक्ष परीक्षेसारखा आहे का?'),
      a: t('Our test engine strictly replicates the exact examination software used in actual TCS, IBPS, and MPSC exams with a real-time countdown timer, bilingual Marathi/English question toggling, question status palette, and instant negative marking calculation.', 'होय, परीक्षा सेतूचा इंटरफेस टीसीएस व एमपीएससीच्या प्रत्यक्ष परीक्षेप्रमाणेच तयार करण्यात आला असून यात अचूक टाइमर, रंगीत प्रश्न पॅलेट आणि मराठी-इंग्रजी भाषा बदलण्याची सुविधा आहे.')
    },
    {
      q: t('Can I take tests on mobile phones and tablets?', 'मी मोबाईलवर टेस्ट देऊ शकतो का?'),
      a: t('Yes! The entire platform and test engine is 100% mobile-responsive with high touch-target controls, sticky timers, and instant autosave.', 'होय, संपूर्ण प्लॅटफॉर्म मोबाईल, टॅबलेट आणि कॉम्प्युटरवर अखंडपणे काम करतो.')
    },
    {
      q: t('Are detailed Marathi explanations provided after submitting the test?', 'टेस्ट सबमिट केल्यानंतर सविस्तर मराठी स्पष्टीकरणे मिळतात का?'),
      a: t('Every question includes exhaustive subject-matter explanations, reference book sources, and shortcut tricks in both Marathi (मराठी) and English.', 'होय, प्रत्येक प्रश्नाचे संदर्भग्रंथांवर आधारित सविस्तर मराठी व इंग्रजी स्पष्टीकरण त्वरित उपलब्ध होते.')
    },
    {
      q: t('How does the state-level rank and percentile calculation work?', 'राज्यस्तरीय रँक आणि पर्सेंटाईल कसे मोजले जातात?'),
      a: t('Your score is dynamically benchmarked against thousands of Maharashtra aspirants who attempted the test to give you a real percentile rank.', 'हजारो विद्यार्थ्यांच्या गुणांची तुलना करून आपल्या परीक्षेचा अचूक राज्यस्तरीय क्रमांक आणि पर्सेंटाईल तात्काळ दाखवला जातो.')
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('Maharashtra & All-India Competitive Mock Exam Portal 2026', 'महाराष्ट्र व केंद्रीय स्पर्धा परीक्षांसाठी विश्वसनीय टेस्ट सिरीज २०२६')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Practice. Improve. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-teal-300">
              Crack Your Exam.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-devanagari">
            {t(
              'High-quality mock tests for MPSC Rajyaseva, Combine Group B & C, Police Bharti, Talathi, Banking & SSC with Marathi + English bilingual explanations and state ranking.',
              'एमपीएससी, पोलीस भरती, तलाठी, सरळसेवा आणि बँकिंग परीक्षांसाठी दर्जेदार सराव चाचण्या, सविस्तर मराठी स्पष्टीकरणे व ऑल महाराष्ट्र रँकिंग.'
            )}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-explore-tests-btn"
              onClick={() => onNavigateTests()}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{t('Explore All Mock Tests', 'सर्व मॉक टेस्ट्स पहा')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-start-free-btn"
              onClick={() => onNavigateTests({ isFree: true })}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{t('Start Free Practice Test', 'मोफत चाचणी सुरू करा')}</span>
            </button>
          </div>

          {/* Highlights Row */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-center">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-amber-300">50,000+</span>
              <span className="text-xs text-slate-400 font-medium">{t('Active Aspirants', 'सक्रिय विद्यार्थी')}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-teal-300">100%</span>
              <span className="text-xs text-slate-400 font-medium">{t('TCS / IBPS Pattern', 'नवीन परीक्षा पॅटर्न')}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-indigo-300">मराठी + EN</span>
              <span className="text-xs text-slate-400 font-medium">{t('Bilingual Tests', 'द्विभाषिक स्पष्टीकरण')}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-rose-300">#1 State Rank</span>
              <span className="text-xs text-slate-400 font-medium">{t('Live Leaderboard', 'राज्यस्तरीय रँकिंग')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Mock Test Practice Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-indigo-200/60 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700 text-white text-[11px] font-extrabold uppercase tracking-wide mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>सर्वसमावेशक मॉक टेस्ट सराव विभाग</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                महाराष्ट्र व राष्ट्रीय स्पर्धा परीक्षा सराव चाचण्या
              </h2>
              <p className="text-xs text-slate-600 font-devanagari mt-0.5">
                संपूर्ण सराव टेस्ट, मागील वर्षांच्या प्रश्नपत्रिका, विषयनिहाय चाचण्या व दैनिक मोफत क्विझ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1: Full Length Mock Tests */}
            <div
              id="feature-card-full-tests"
              onClick={() => onSelectTab && onSelectTab('tests')}
              className="bg-white rounded-2xl p-5 border border-indigo-200/80 shadow-2xs hover:shadow-md hover:border-indigo-400 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  संपूर्ण सराव टेस्ट (Full Mocks)
                </h3>
                <p className="text-xs text-slate-500 font-devanagari mt-1 leading-relaxed">
                  १०० प्रश्न, ९० मिनिटे, टीसीएस/आयबीपीएस व एमपीएससी मूळ परीक्षा पॅटर्न व निगेटिव्ह मार्किंग.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>टेस्ट सोडवा</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 2: PYQ Question Papers */}
            <div
              id="feature-card-pyq"
              onClick={() => onSelectTab && onSelectTab('pyqs')}
              className="bg-white rounded-2xl p-5 border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  मागील प्रश्नपत्रिका (PYQ Tests)
                </h3>
                <p className="text-xs text-slate-500 font-devanagari mt-1 leading-relaxed">
                  २०१८ ते २०२४ पोलीस, SRPF, चालक, तलाठी व MPSC मूळ प्रश्नपत्रिका मॉक स्वरूपात.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>सराव सुरू करा</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 3: Subject-wise Tests */}
            <div
              id="feature-card-subject-tests"
              onClick={() => onNavigateTests && onNavigateTests({ subcategory: 'subject-wise' })}
              className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-400 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  विषय व घटकनिहाय टेस्ट्स
                </h3>
                <p className="text-xs text-slate-500 font-devanagari mt-1 leading-relaxed">
                  मराठी व्याकरण, गणित व बुद्धिमत्ता, सामान्य ज्ञान आणि राज्यघटना विशिष्ट विषयांच्या चाचण्या.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>विषय निवडा</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 4: Free Tests & Daily Quiz */}
            <div
              id="feature-card-free-tests"
              onClick={() => onSelectTab && onSelectTab('free-tests')}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
                  मोफत टेस्ट व दैनिक क्विझ
                </h3>
                <p className="text-xs text-slate-500 font-devanagari mt-1 leading-relaxed">
                  दररोज नवीन २५ गुणांची चालू घडामोडी व सराव टेस्ट सर्व विद्यार्थ्यांसाठी विनामूल्य.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>मोफत सोडवा</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Exam Categories Carousel & Grid with working horizontal scroll buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{t('Target Your Goal', 'आपले ध्येय निवडा')}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t('Exam Categories', 'स्पर्धा परीक्षा विभाग')}
            </h2>
            <p className="text-xs text-slate-500 font-devanagari mt-0.5">
              {t('Scroll horizontally or switch view to explore all target exams', 'डावीकडे-उजवीकडे स्क्रोल करा किंवा आपल्या आवडीची परीक्षा निवडा')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Toggle (Carousel vs Grid) */}
            <button
              onClick={() => setIsExamGridView(!isExamGridView)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-2xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isExamGridView ? t('Carousel View', 'स्क्रोल व्ह्यू') : t('Grid View', 'सर्व ग्रीड व्ह्यू')}</span>
            </button>

            {/* Carousel Left / Right Scroll Buttons (visible in carousel mode) */}
            {!isExamGridView && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  id="exam-scroll-left-btn"
                  onClick={() => scrollExams('left')}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition shadow-2xs"
                  title="Scroll Left"
                  aria-label="Previous categories"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="exam-scroll-right-btn"
                  onClick={() => scrollExams('right')}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition shadow-2xs"
                  title="Scroll Right"
                  aria-label="Next categories"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => onNavigateTests()}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 ml-1"
            >
              {t('View all', 'सर्व पहा')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Content: either Horizontal Scroll Carousel or Expanded Grid */}
        {isExamGridView ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 animate-in fade-in duration-200">
            {exams.map((exam) => {
              const Icon = getExamIcon(exam.icon);
              return (
                <div
                  key={exam.id}
                  id={`exam-card-grid-${exam.id}`}
                  onClick={() => onSelectExam(exam.id)}
                  className="group p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-indigo-600 transition">
                      {exam.name}
                    </h3>
                    {exam.marathiName && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-devanagari">
                        {exam.marathiName}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600">{exam.totalTests} Tests</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative group">
            {/* Scroll Container */}
            <div
              ref={examScrollContainerRef}
              id="exam-categories-scroll-container"
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
              style={{ scrollbarWidth: 'thin' }}
            >
              {exams.map((exam) => {
                const Icon = getExamIcon(exam.icon);
                return (
                  <div
                    key={exam.id}
                    id={`exam-card-carousel-${exam.id}`}
                    onClick={() => onSelectExam(exam.id)}
                    className="shrink-0 w-64 sm:w-72 snap-start group p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {exam.totalTests} चाचण्या
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition">
                        {exam.name}
                      </h3>
                      {exam.marathiName && (
                        <p className="text-xs font-semibold text-slate-600 mt-1 font-devanagari line-clamp-1">
                          {exam.marathiName}
                        </p>
                      )}
                      {exam.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {exam.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                      <span>{t('Explore Tests', 'सराव चाचण्या पहा')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. Subjects & Subcategories Mastery Section (Science, Math, CSAT, Polity, History, etc.) */}
      {subjects && subjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-1.5 border border-amber-200">
                <Layers className="w-3.5 h-3.5" />
                <span>{t('Sectional & Subject-Wise Tests', 'विषयनिहाय व उपविभाग सराव')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t('Master Key Subjects & Subcategories', 'महत्त्वाचे विषय व उपविभागनिहाय सराव')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-devanagari">
                {t(
                  'Strengthen individual subjects like General Science, Quantitative Aptitude & CSAT, Polity, and Geography with targeted drills.',
                  'सामान्य विज्ञान, अंकगणित, बुद्धिमत्ता CSAT, राज्यघटना, इतिहास अशा सर्व विषयांच्या घटकांनुसार सराव करा.'
                )}
              </p>
            </div>
            <button
              onClick={() => onNavigateTests({ examId: 'exam-mpsc' })}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
            >
              {t('Explore subject tests', 'सर्व विषय चाचण्या')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subj) => {
              const SubjIcon = getSubjectIcon(subj.icon);
              return (
                <div
                  key={subj.id}
                  id={`subject-card-${subj.id}`}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center shrink-0">
                        <SubjIcon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {subj.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-devanagari mt-0.5 font-medium">
                      {subj.marathiName}
                    </p>

                    {subj.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {subj.description}
                      </p>
                    )}

                    {/* Subcategory Pills */}
                    {subj.subcategories && subj.subcategories.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                          {t('Key Subcategories / Topics:', 'महत्त्वाचे उपविभाग / घटक:')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subj.subcategories.slice(0, 4).map((subcat, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectSubject) {
                                  onSelectSubject(subj.id, subcat);
                                } else {
                                  onNavigateTests({ subjectId: subj.id, search: subcat });
                                }
                              }}
                              className="px-2 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-600 rounded-lg text-[11px] font-medium border border-slate-200 transition text-left"
                            >
                              • {subcat}
                            </button>
                          ))}
                          {subj.subcategories.length > 4 && (
                            <span className="px-1.5 py-1 text-[10px] text-slate-400 font-semibold">
                              +{subj.subcategories.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {subj.totalTests || 10}+ {t('Mock Tests', 'सराव चाचण्या')}
                    </span>
                    <button
                      onClick={() => {
                        if (onSelectSubject) {
                          onSelectSubject(subj.id);
                        } else {
                          onNavigateTests({ subjectId: subj.id });
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1"
                    >
                      <span>{t('Practice Subject', 'सराव सुरू करा')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Featured Mock Tests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t('Handpicked by Top Faculties', 'तज्ज्ञ मार्गदर्शकांनी तयार केलेले')}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t('Featured Mock Tests', 'वैशिष्ट्यपूर्ण मॉक टेस्ट्स')}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTests()}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            {t('Explore all tests', 'सर्व टेस्ट्स पहा')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTests.slice(0, 6).map((test) => (
            <div
              key={test.id}
              id={`featured-test-${test.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700">
                    {test.examName || 'Competitive Exam'}
                  </span>
                  {test.isFree ? (
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md bg-emerald-100 text-emerald-800">
                      FREE TEST
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                      ₹{test.price}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-indigo-600 transition cursor-pointer" onClick={() => onOpenTestDetails(test)}>
                  {test.title}
                </h3>
                {test.titleMarathi && (
                  <p className="text-xs text-slate-500 mt-1 font-devanagari line-clamp-1">
                    {test.titleMarathi}
                  </p>
                )}

                {/* Meta details */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{test.totalQuestions}</span>
                    <span className="text-[10px] text-slate-400">{t('Questions', 'प्रश्न')}</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{test.durationMinutes}m</span>
                    <span className="text-[10px] text-slate-400">{t('Duration', 'वेळ')}</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg">
                    <span className="block font-bold text-slate-800">{test.totalMarks}</span>
                    <span className="text-[10px] text-slate-400">{t('Marks', 'गुण')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  {test.language === 'marathi' ? 'मराठी माध्यम' : test.language === 'english' ? 'English' : 'मराठी + English'}
                </span>
                <button
                  id={`btn-start-${test.id}`}
                  onClick={() => onOpenTestDetails(test)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                    test.isFree
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {test.isFree ? t('Start Free Test', 'चाचणी सुरू करा') : t('View Details / Buy', 'तपशील / खरेदी')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Test Series Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {t('Comprehensive Test Packages', 'संपूर्ण परीक्षा पॅकेजेस')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
              {t('All-in-One Maharashtra Test Series 2026', 'एमपीएससी व पोलीस भरती महा-टेस्ट सिरीज २०२६')}
            </h2>
            <p className="text-sm text-slate-300 mt-2 font-devanagari">
              {t(
                'Get unlimited access to 50+ Full-Length Tests, Subject Tests, Topic-wise drills, and state-wide rank benchmarking at the most affordable student pricing.',
                '५०+ परिपूर्ण सराव चाचण्या, विषयनिहाय टेस्ट्स, आणि ऑल महाराष्ट्र रँकिंगसह सर्वोत्तम तयारी करा.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 relative z-10">
            {testSeries.map((series) => (
              <div
                key={series.id}
                className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md hover:bg-white/15 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md">
                      {series.examName}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-black text-white">₹{series.price}</span>
                      {series.discountPrice && (
                        <span className="block text-xs text-slate-400 line-through">₹{series.discountPrice}</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3 leading-snug">
                    {series.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-devanagari">
                    {series.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                    {series.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{series.validityMonths} Months Validity</span>
                  <button
                    id={`btn-series-${series.id}`}
                    onClick={() => onOpenSeriesDetails(series)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
                  >
                    {t('View Package & Enroll', 'पॅकेज पहा व प्रवेश घ्या')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose ParikshaSetu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{t('Why Aspirants Trust Us', 'विद्यार्थ्यांचा विश्वास')}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t('Features Built for Real Competitive Success', 'परीक्षेत यश मिळवून देणारी वैशिष्ट्ये')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('Exam-Oriented High Yield Questions', 'परीक्षेभिमुख प्रश्न संच')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('Every mock test is crafted strictly according to the latest MPSC Commission and TCS/IBPS exam blueprints.', 'सर्व प्रश्न मागील वर्षांच्या प्रश्नपत्रिकांचे विश्लेषण करून व संभाव्य काठिण्यपातळी लक्षात घेऊन तयार केलेले आहेत.')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('Detailed Bilingual Solutions', 'परिपूर्ण मराठी स्पष्टीकरणे')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('Get in-depth explanations for all questions with authentic Maharashtra State Board & NCERT textbook citations.', 'केवळ उत्तर नव्हे तर त्यामागचा संपूर्ण संदर्भ व स्पष्टीकरण मराठी व इंग्रजीत उपलब्ध.')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('Deep Performance Analytics', 'सखोल विश्लेषण व रँकिंग')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('Subject-wise accuracy, topic radar charts, time management stats, and percentile calculations.', 'विषयनिहाय अचूकता, वेळ व्यवस्थापन आणि कमजोर घटकांचे विश्लेषण करणारे स्मार्ट रिपोर्ट.')}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{t('Got Questions?', 'काही शंका आहेत का?')}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t('Frequently Asked Questions', 'वारंवार विचारले जाणारे प्रश्न')}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-indigo-600"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-devanagari bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
