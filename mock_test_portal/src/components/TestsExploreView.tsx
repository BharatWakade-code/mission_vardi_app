import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Exam, Category, MockTest, Subject } from '../types';
import {
  Search,
  Filter,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  X,
  Layers,
  FlaskConical,
  Calculator,
  Brain,
  Landmark,
  Scroll,
  Globe2,
  TrendingUp,
  BookOpen,
  Languages,
  Newspaper,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface TestsExploreViewProps {
  tests: MockTest[];
  exams: Exam[];
  categories: Category[];
  subjects?: Subject[];
  initialExamId?: string;
  initialSubjectId?: string;
  initialSubcategory?: string;
  initialIsFree?: boolean;
  onOpenTestDetails: (test: MockTest) => void;
  onStartDirectTest: (test: MockTest) => void;
}

export const TestsExploreView: React.FC<TestsExploreViewProps> = ({
  tests,
  exams,
  categories,
  subjects = [],
  initialExamId,
  initialSubjectId,
  initialSubcategory,
  initialIsFree,
  onOpenTestDetails,
  onStartDirectTest,
}) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || 'all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>(
    initialIsFree ? 'free' : 'all'
  );
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'newest'>('popularity');

  // Sync props if changed
  useEffect(() => {
    if (initialExamId) setSelectedExamId(initialExamId);
  }, [initialExamId]);

  useEffect(() => {
    if (initialSubjectId) setSelectedSubjectId(initialSubjectId);
  }, [initialSubjectId]);

  useEffect(() => {
    if (initialSubcategory) setSelectedSubcategory(initialSubcategory);
  }, [initialSubcategory]);

  // Filtered categories based on selected exam
  const availableCategories = useMemo(() => {
    if (selectedExamId === 'all') return categories;
    return categories.filter((c) => c.examId === selectedExamId);
  }, [categories, selectedExamId]);

  // Scroll references and helper handlers for horizontal rows
  const examFilterRowRef = useRef<HTMLDivElement>(null);
  const subjectFilterRowRef = useRef<HTMLDivElement>(null);
  const subcatFilterRowRef = useRef<HTMLDivElement>(null);

  const scrollRow = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Available subcategories for the selected subject
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId);
  }, [subjects, selectedSubjectId]);

  const availableSubcategories = useMemo(() => {
    if (currentSubject && currentSubject.subcategories) {
      return currentSubject.subcategories;
    }
    // Aggregate subcategories across current available categories or all subjects
    const subcatSet = new Set<string>();
    subjects.forEach((s) => s.subcategories?.forEach((sc) => subcatSet.add(sc)));
    return Array.from(subcatSet);
  }, [currentSubject, subjects]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    let list = [...tests];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.titleMarathi && t.titleMarathi.includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.mainCategoryName && t.mainCategoryName.toLowerCase().includes(q)) ||
          (t.subCategoryName && t.subCategoryName.toLowerCase().includes(q)) ||
          (t.subjectName && t.subjectName.toLowerCase().includes(q)) ||
          (t.subcategoryName && t.subcategoryName.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    if (selectedExamId !== 'all') {
      list = list.filter((t) => 
        t.examId === selectedExamId || 
        t.mainCategoryId === selectedExamId || 
        t.main_category_id === selectedExamId ||
        t.categoryId === selectedExamId
      );
    }

    if (selectedCategoryId !== 'all') {
      list = list.filter((t) => 
        t.categoryId === selectedCategoryId || 
        t.subCategoryId === selectedCategoryId || 
        t.sub_category_id === selectedCategoryId ||
        t.category === selectedCategoryId
      );
    }

    if (selectedSubjectId !== 'all') {
      list = list.filter((t) => t.subjectId === selectedSubjectId || t.mainCategoryId === selectedSubjectId);
    }

    if (selectedSubcategory !== 'all') {
      list = list.filter(
        (t) =>
          t.subcategoryName === selectedSubcategory ||
          t.subCategoryName === selectedSubcategory ||
          t.subCategoryId === selectedSubcategory ||
          t.category === selectedSubcategory ||
          (t.title && t.title.toLowerCase().includes(selectedSubcategory.toLowerCase())) ||
          (t.titleMarathi && t.titleMarathi.includes(selectedSubcategory))
      );
    }

    if (selectedLanguage !== 'all') {
      list = list.filter((t) => t.language?.toLowerCase() === selectedLanguage.toLowerCase() || t.language === 'bilingual' || t.language === 'Bilingual');
    }

    if (selectedPriceFilter === 'free') {
      list = list.filter((t) => t.isFree || t.price === 0);
    } else if (selectedPriceFilter === 'paid') {
      list = list.filter((t) => !t.isFree && (t.price || 0) > 0);
    }

    if (sortBy === 'popularity') {
      list.sort((a, b) => b.attemptsCount - a.attemptsCount);
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [tests, search, selectedExamId, selectedCategoryId, selectedSubjectId, selectedSubcategory, selectedLanguage, selectedPriceFilter, sortBy]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedExamId('all');
    setSelectedCategoryId('all');
    setSelectedSubjectId('all');
    setSelectedSubcategory('all');
    setSelectedLanguage('all');
    setSelectedPriceFilter('all');
    setSortBy('popularity');
  };

  const hasActiveFilters =
    search ||
    selectedExamId !== 'all' ||
    selectedCategoryId !== 'all' ||
    selectedSubjectId !== 'all' ||
    selectedSubcategory !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedPriceFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('Competitive Mock Tests Library', 'मॉक टेस्ट्स व सराव परीक्षा दालन')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-devanagari">
            {t(
              'Practice with full-length online tests & subject-wise drills (Science, Maths, Polity, etc.) simulating exact MPSC & Central exam formats.',
              'एमपीएससी, पोलीस भरती, तलाठी व विषयनिहाय (विज्ञान, गणित, राज्यघटना, इ.) सराव चाचण्या.'
            )}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            id="tests-search-input"
            type="text"
            placeholder={t('Search tests, subjects, science, math...', 'चाचणी, विषय (उदा. विज्ञान, गणित) शोधा...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Exam Filter Tabs with working horizontal scroll buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <span>{t('Exam Categories:', 'परीक्षा विभाग:')}</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(स्क्रोल करा किंवा बाण दाबा)</span>
          </div>
          {/* Scroll navigation arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollRow(examFilterRowRef, 'left')}
              className="p-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollRow(examFilterRowRef, 'right')}
              className="p-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={examFilterRowRef}
          className="flex items-center gap-2 overflow-x-auto pb-1.5 scroll-smooth snap-x focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          <button
            id="filter-exam-all"
            onClick={() => { setSelectedExamId('all'); setSelectedCategoryId('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition ${
              selectedExamId === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('All Exams', 'सर्व परीक्षा')}
          </button>
          {exams.map((ex) => (
            <button
              key={ex.id}
              id={`filter-exam-${ex.id}`}
              onClick={() => { setSelectedExamId(ex.id); setSelectedCategoryId('all'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition ${
                selectedExamId === ex.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subjects Filter Tabs (MPSC Science, Math, Polity, History, etc.) */}
      {subjects && subjects.length > 0 && (
        <div className="space-y-2 bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{t('Subject-Wise Filter (MPSC / Saralseva):', 'विषयनिहाय फिल्टर (एमपीएससी / सरळसेवा):')}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedSubjectId !== 'all' && (
                <button
                  onClick={() => { setSelectedSubjectId('all'); setSelectedSubcategory('all'); }}
                  className="text-[11px] font-semibold text-rose-600 hover:underline mr-1"
                >
                  {t('Reset Subject', 'विषय फिल्टर काढा')}
                </button>
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollRow(subjectFilterRowRef, 'left')}
                  className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollRow(subjectFilterRowRef, 'right')}
                  className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={subjectFilterRowRef}
            className="flex items-center gap-2 overflow-x-auto pb-1.5 scroll-smooth snap-x focus:outline-none"
            style={{ scrollbarWidth: 'thin' }}
          >
            <button
              onClick={() => { setSelectedSubjectId('all'); setSelectedSubcategory('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition ${
                selectedSubjectId === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t('All Subjects', 'सर्व विषय')}
            </button>
            {subjects.map((subj) => (
              <button
                key={subj.id}
                id={`filter-subject-${subj.id}`}
                onClick={() => {
                  setSelectedSubjectId(subj.id);
                  setSelectedSubcategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition flex items-center gap-1.5 ${
                  selectedSubjectId === subj.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <span>{subj.name}</span>
                {subj.marathiName && (
                  <span className={`text-[10px] ${selectedSubjectId === subj.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                    ({subj.marathiName})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Subcategory Pills (for selected subject or general) */}
          {availableSubcategories.length > 0 && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {t('Subcategories / Topics:', 'उपविभाग व घटक:')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollRow(subcatFilterRowRef, 'left')}
                    className="p-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => scrollRow(subcatFilterRowRef, 'right')}
                    className="p-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div
                ref={subcatFilterRowRef}
                className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth snap-x focus:outline-none"
                style={{ scrollbarWidth: 'thin' }}
              >
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap snap-start transition ${
                    selectedSubcategory === 'all'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t('All Topics', 'सर्व घटक')}
                </button>
                {availableSubcategories.map((subcat, idx) => (
                  <button
                    key={idx}
                    id={`filter-subcat-${idx}`}
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap snap-start transition ${
                      selectedSubcategory === subcat
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Price Filter (Free vs Paid) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedPriceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {t('All', 'सर्व')}
            </button>
            <button
              id="filter-price-free"
              onClick={() => setSelectedPriceFilter('free')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedPriceFilter === 'free' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              🎁 {t('Free Tests', 'मोफत')}
            </button>
            <button
              id="filter-price-paid"
              onClick={() => setSelectedPriceFilter('paid')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedPriceFilter === 'paid' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              💎 {t('Premium Paid', 'पेड चाचण्या')}
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-slate-700"
          >
            <option value="all">{t('All Languages', 'सर्व भाषा')}</option>
            <option value="bilingual">मराठी + English (Bilingual)</option>
            <option value="marathi">मराठी माध्यम</option>
            <option value="english">English Medium</option>
          </select>

          {/* Category Dropdown (if exam selected) */}
          {availableCategories.length > 0 && selectedExamId !== 'all' && (
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-slate-700 max-w-[180px] truncate"
            >
              <option value="all">{t('All Exam Stages / Papers', 'सर्व टप्पे / पेपर')}</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline px-2"
            >
              {t('Clear All Filters', 'सर्व फिल्टर काढा')}
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 ml-auto">
          <span>{t('Sort by:', 'क्रमवारी:')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-slate-800"
          >
            <option value="popularity">{t('Most Popular', 'सर्वात लोकप्रिय')}</option>
            <option value="newest">{t('Newest First', 'नवीनतम')}</option>
            <option value="price_asc">{t('Price: Low to High', 'किंमत: कमी ते जास्त')}</option>
            <option value="price_desc">{t('Price: High to Low', 'किंमत: जास्त ते कमी')}</option>
          </select>
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {t('No mock tests found matching your criteria', 'या फिल्टरनुसार कोणतीही टेस्ट आढळली नाही')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('Try searching with different subject keywords or reset your filters.', 'कृपया वेगळे विषय किंवा शब्द निवडून शोधा.')}
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl"
          >
            {t('Reset Filters', 'सर्व फिल्टर रिसेट करा')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              id={`test-card-${test.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700">
                      {test.examName || 'Competitive Exam'}
                    </span>
                    {test.subjectName && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                        {test.subjectName}
                      </span>
                    )}
                    {test.subcategoryName && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700">
                        {test.subcategoryName}
                      </span>
                    )}
                  </div>

                  {test.isFree ? (
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                      FREE TEST
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {test.discountPrice && (
                        <span className="text-xs text-slate-400 line-through">₹{test.discountPrice}</span>
                      )}
                      <span className="text-xs font-black text-slate-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        ₹{test.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => onOpenTestDetails(test)}
                  className="text-base font-bold text-slate-900 leading-snug hover:text-indigo-600 transition cursor-pointer"
                >
                  {test.title}
                </h3>
                {test.titleMarathi && (
                  <p className="text-xs text-slate-500 mt-1 font-devanagari line-clamp-1">
                    {test.titleMarathi}
                  </p>
                )}

                {/* Exam specs */}
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

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Negative: <strong className="text-rose-600">{test.negativeMarks > 0 ? `-${test.negativeMarks}` : 'None'}</strong>
                  </span>
                  <span>{test.attemptsCount}+ {t('Aspirants Attempted', 'विद्यार्थी')}</span>
                </div>
              </div>

              {/* Action CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium truncate max-w-[120px]">
                  {test.language === 'marathi' ? 'मराठी' : test.language === 'english' ? 'English' : 'मराठी + English'}
                </span>
                <button
                  id={`action-test-${test.id}`}
                  onClick={() => onOpenTestDetails(test)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs ${
                    test.isFree
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {test.isFree ? t('Start Test', 'चाचणी सुरू करा') : t('Buy / Start', 'तपशील / खरेदी')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
