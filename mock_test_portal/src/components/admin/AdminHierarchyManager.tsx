import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FolderPlus,
  FolderTree,
  FilePlus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Layers,
  ArrowRight,
  Sparkles,
  Tag,
  IndianRupee,
  Package,
  Clock,
  Award,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Database,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { MainCategory, SubCategory, MockTest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { enableHorizontalScroll } from '../../utils/scrollUtils';

interface AdminHierarchyManagerProps {
  onRefreshData?: () => void;
}

export const AdminHierarchyManager: React.FC<AdminHierarchyManagerProps> = ({ onRefreshData }) => {
  const { t } = useLanguage();
  
  // 3-Option System Subtabs
  const [activeTab, setActiveTab] = useState<'option1_main' | 'option2_sub' | 'option3_exam'>('option1_main');

  // Data States
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [exams, setExams] = useState<MockTest[]>([]);
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMainCat, setFilterMainCat] = useState<string>('all');
  const [filterSubCat, setFilterSubCat] = useState<string>('all');

  // Scroll Container Refs
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const mainFilterScrollRef = useRef<HTMLDivElement>(null);

  // Setup horizontal scroll listeners
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    if (tabsScrollRef.current) cleanups.push(enableHorizontalScroll(tabsScrollRef.current));
    if (mainFilterScrollRef.current) cleanups.push(enableHorizontalScroll(mainFilterScrollRef.current));
    return () => cleanups.forEach(c => c());
  }, [loading]);

  // Notifications / Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- MODAL 1: Main Category State (Option 1) ---
  const [isMainCatModalOpen, setIsMainCatModalOpen] = useState(false);
  const [editingMainCat, setEditingMainCat] = useState<MainCategory | null>(null);
  const [mainName, setMainName] = useState('');
  const [mainNameMr, setMainNameMr] = useState('');
  const [mainDescription, setMainDescription] = useState('');
  const [mainIcon, setMainIcon] = useState('Shield');
  const [mainBadge, setMainBadge] = useState('');
  const [mainOrder, setMainOrder] = useState(1);
  const [mainStatus, setMainStatus] = useState<'active' | 'inactive'>('active');

  // --- MODAL 2: Subcategory State (Option 2 - Mandatory parent Main Category) ---
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [editingSubCat, setEditingSubCat] = useState<SubCategory | null>(null);
  const [subParentMainId, setSubParentMainId] = useState('');
  const [subName, setSubName] = useState('');
  const [subNameMr, setSubNameMr] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subIcon, setSubIcon] = useState('FileText');
  const [subBadge, setSubBadge] = useState('');
  const [subStatus, setSubStatus] = useState<'active' | 'inactive'>('active');

  // --- MODAL 3: Exam / Mock Test State (Option 3 - Cascading dropdowns, Question Banks & Pricing) ---
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<MockTest | null>(null);
  const [examMainCatId, setExamMainCatId] = useState('');
  const [examSubCatId, setExamSubCatId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examTitleMr, setExamTitleMr] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [examPriceType, setExamPriceType] = useState<'free' | 'paid'>('free');
  const [examPrice, setExamPrice] = useState<number>(0);
  const [examDiscountPrice, setExamDiscountPrice] = useState<number>(99);
  const [examIncludeInPackage, setExamIncludeInPackage] = useState<boolean>(true);
  const [examPackageName, setExamPackageName] = useState<string>('');
  
  // Question Bank Association State
  const [selectedBankId, setSelectedBankId] = useState<string>('bank-all');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionBankSearch, setQuestionBankSearch] = useState<string>('');
  const [questionBankFilter, setQuestionBankFilter] = useState<'all' | 'unused' | 'used' | 'selected'>('all');

  // Exam Timing & Marking Rules
  const [examDuration, setExamDuration] = useState<number>(60);
  const [examPositiveMarks, setExamPositiveMarks] = useState<number>(2);
  const [examHasNegativeMarking, setExamHasNegativeMarking] = useState<boolean>(true);
  const [examNegativeMarks, setExamNegativeMarks] = useState<number>(0.5);
  const [examTotalMarks, setExamTotalMarks] = useState<number>(100);
  const [examPassingMarks, setExamPassingMarks] = useState<number>(40);
  const [examDifficulty, setExamDifficulty] = useState<string>('Medium');
  const [examLanguage, setExamLanguage] = useState<string>('Marathi');
  const [examStatus, setExamStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [examTotalQuestions, setExamTotalQuestions] = useState<number>(50);

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [mainRes, subRes, testRes, banksRes, qRes] = await Promise.all([
        api.getAdminMainCategories(),
        api.getAdminSubCategories(),
        api.getAdminTests(),
        api.getAdminQuestionBanks().catch(() => ({ questionBanks: [] })),
        api.getAdminQuestions().catch(() => ({ questions: [] })),
      ]);
      setMainCategories(mainRes.mainCategories || []);
      setSubCategories(subRes.subCategories || []);
      setExams(testRes.tests || []);
      setQuestionBanks(banksRes.questionBanks || []);
      setAllQuestions(qRes.questions || []);
    } catch (err: any) {
      console.error('Failed to load hierarchy data:', err);
      showToast('error', err.message || 'Failed to load categories and exams.');
    } finally {
      setLoading(false);
    }
  };

  // --- Option 1: Main Category Handlers ---
  const openMainCatModal = (cat?: MainCategory) => {
    if (cat) {
      setEditingMainCat(cat);
      setMainName(cat.name);
      setMainNameMr(cat.nameMarathi || cat.marathiName || cat.name);
      setMainDescription(cat.description || '');
      setMainIcon(cat.icon || 'Shield');
      setMainBadge(cat.badge || '');
      setMainOrder(cat.order || 1);
      setMainStatus(cat.status || 'active');
    } else {
      setEditingMainCat(null);
      setMainName('');
      setMainNameMr('');
      setMainDescription('');
      setMainIcon('Shield');
      setMainBadge('');
      setMainOrder(mainCategories.length + 1);
      setMainStatus('active');
    }
    setIsMainCatModalOpen(true);
  };

  const handleSaveMainCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainName.trim()) {
      showToast('error', 'Main Category Name is required.');
      return;
    }

    const payload = {
      name: mainName.trim(),
      nameMarathi: mainNameMr.trim() || mainName.trim(),
      marathiName: mainNameMr.trim() || mainName.trim(),
      description: mainDescription,
      icon: mainIcon,
      badge: mainBadge,
      order: Number(mainOrder),
      status: mainStatus,
    };

    try {
      if (editingMainCat) {
        await api.updateAdminMainCategory(editingMainCat.id, payload);
        showToast('success', `Main Category "${mainName}" updated successfully!`);
      } else {
        await api.createAdminMainCategory(payload);
        showToast('success', `Main Category "${mainName}" created successfully!`);
      }
      setIsMainCatModalOpen(false);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save Main Category.');
    }
  };

  const handleDeleteMainCat = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete Main Category "${name}"? This will also remove all child subcategories!`)) {
      return;
    }
    try {
      await api.deleteAdminMainCategory(id);
      showToast('success', `Main Category "${name}" deleted.`);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete Main Category.');
    }
  };

  // --- Option 2: Subcategory Handlers ---
  const openSubCatModal = (sub?: SubCategory) => {
    if (sub) {
      setEditingSubCat(sub);
      setSubParentMainId(sub.mainCategoryId);
      setSubName(sub.name);
      setSubNameMr(sub.nameMarathi || sub.marathiName || sub.name);
      setSubDescription(sub.description || '');
      setSubIcon(sub.icon || 'FileText');
      setSubBadge(sub.badge || '');
      setSubStatus(sub.status || 'active');
    } else {
      setEditingSubCat(null);
      setSubParentMainId(mainCategories[0]?.id || '');
      setSubName('');
      setSubNameMr('');
      setSubDescription('');
      setSubIcon('FileText');
      setSubBadge('');
      setSubStatus('active');
    }
    setIsSubCatModalOpen(true);
  };

  const handleSaveSubCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subParentMainId) {
      showToast('error', 'Mandatory: Please select a parent Main Category.');
      return;
    }
    if (!subName.trim()) {
      showToast('error', 'Subcategory Name is required.');
      return;
    }

    const payload = {
      mainCategoryId: subParentMainId,
      name: subName.trim(),
      nameMarathi: subNameMr.trim() || subName.trim(),
      marathiName: subNameMr.trim() || subName.trim(),
      description: subDescription,
      icon: subIcon,
      badge: subBadge,
      status: subStatus,
    };

    try {
      if (editingSubCat) {
        await api.updateAdminSubCategory(editingSubCat.id, payload);
        showToast('success', `Subcategory "${subName}" updated successfully!`);
      } else {
        await api.createAdminSubCategory(payload);
        showToast('success', `Subcategory "${subName}" created successfully under Main Category!`);
      }
      setIsSubCatModalOpen(false);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save Subcategory.');
    }
  };

  const handleDeleteSubCat = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete Subcategory "${name}"?`)) {
      return;
    }
    try {
      await api.deleteAdminSubCategory(id);
      showToast('success', `Subcategory "${name}" deleted.`);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete Subcategory.');
    }
  };

  // --- Option 3: Exam Creation Handlers (Two Cascading Dropdowns + Question Bank + Pricing) ---
  const openExamModal = (test?: MockTest) => {
    if (test) {
      setEditingExam(test);
      const mId = test.mainCategoryId || test.main_category_id || (mainCategories[0]?.id || '');
      setExamMainCatId(mId);
      
      const childSubs = subCategories.filter(s => s.mainCategoryId === mId);
      const sId = test.subCategoryId || test.sub_category_id || (childSubs[0]?.id || '');
      setExamSubCatId(sId);

      setExamTitle(test.title || '');
      setExamTitleMr(test.titleMarathi || test.title || '');
      setExamDescription(test.description || '');
      const isFree = test.isFree ?? (test.price === 0);
      setExamPriceType(isFree ? 'free' : 'paid');
      setExamPrice(test.price || 0);
      setExamDiscountPrice(test.discountPrice || 99);
      setExamIncludeInPackage(test.includeInPackage ?? true);
      setExamPackageName(test.packageName || '');
      setExamDuration(test.durationMinutes || 60);
      
      const posMarks = test.positiveMarks || 2;
      setExamPositiveMarks(posMarks);
      
      const negVal = test.negativeMarking ?? test.negativeMarks ?? 0;
      setExamHasNegativeMarking(negVal > 0);
      setExamNegativeMarks(negVal > 0 ? negVal : 0.5);

      setExamTotalMarks(test.totalMarks || 100);
      setExamPassingMarks(test.passingMarks || 40);
      setExamDifficulty(test.difficulty || 'Medium');
      setExamLanguage(test.language || 'Marathi');
      setExamStatus(test.status || 'published');
      
      const qIds = test.questionIds || [];
      setSelectedQuestionIds(qIds);
      setExamTotalQuestions(qIds.length > 0 ? qIds.length : (test.totalQuestions || 50));
      setSelectedBankId('bank-all');
      setQuestionBankSearch('');
      setQuestionBankFilter('all');
    } else {
      setEditingExam(null);
      const mId = mainCategories[0]?.id || '';
      setExamMainCatId(mId);

      const childSubs = subCategories.filter(s => s.mainCategoryId === mId);
      setExamSubCatId(childSubs[0]?.id || '');

      setExamTitle('');
      setExamTitleMr('');
      setExamDescription('');
      setExamPriceType('free');
      setExamPrice(0);
      setExamDiscountPrice(99);
      setExamIncludeInPackage(true);
      setExamPackageName('');
      setExamDuration(60);
      setExamPositiveMarks(2);
      setExamHasNegativeMarking(true);
      setExamNegativeMarks(0.5);
      setExamTotalMarks(100);
      setExamPassingMarks(40);
      setExamDifficulty('Medium');
      setExamLanguage('Marathi');
      setExamStatus('published');
      setSelectedQuestionIds([]);
      setExamTotalQuestions(50);
      setSelectedBankId('bank-all');
      setQuestionBankSearch('');
      setQuestionBankFilter('all');
    }
    setIsExamModalOpen(true);
  };

  const handleMainCatChangeInExam = (mId: string) => {
    setExamMainCatId(mId);
    // filter subcategories under newly selected main category
    const validSubs = subCategories.filter(s => s.mainCategoryId === mId);
    if (validSubs.length > 0) {
      setExamSubCatId(validSubs[0].id);
    } else {
      setExamSubCatId('');
    }
  };

  // Filtered Question List for Question Bank Selector in Exam Modal
  const activeBankQuestions = useMemo(() => {
    let list = [...allQuestions];
    
    // Filter by selected bank
    if (selectedBankId && selectedBankId !== 'bank-all') {
      const selectedBank = questionBanks.find(b => b.id === selectedBankId);
      if (selectedBank && selectedBank.subjectId) {
        list = list.filter(q => q.subjectId === selectedBank.subjectId || q.subject_id === selectedBank.subjectId);
      }
    }

    // Filter by Usage / Selection Status
    if (questionBankFilter === 'unused') {
      list = list.filter(q => !q.isUsed || (editingExam && q.usedInTestIds?.length === 1 && q.usedInTestIds[0] === editingExam.id));
    } else if (questionBankFilter === 'used') {
      list = list.filter(q => q.isUsed && (!editingExam || !q.usedInTestIds?.includes(editingExam.id)));
    } else if (questionBankFilter === 'selected') {
      list = list.filter(q => selectedQuestionIds.includes(q.id));
    }

    // Filter by text search
    if (questionBankSearch.trim()) {
      const qLower = questionBankSearch.toLowerCase();
      list = list.filter(q =>
        (q.text && q.text.toLowerCase().includes(qLower)) ||
        (q.textMarathi && q.textMarathi.toLowerCase().includes(qLower)) ||
        (q.topic && q.topic.toLowerCase().includes(qLower))
      );
    }

    return list;
  }, [allQuestions, selectedBankId, questionBanks, questionBankFilter, questionBankSearch, selectedQuestionIds, editingExam]);

  // Toggle single question selection
  const handleToggleQuestion = (qId: string) => {
    setSelectedQuestionIds(prev => {
      const exists = prev.includes(qId);
      const next = exists ? prev.filter(id => id !== qId) : [...prev, qId];
      // Auto-update total questions and total marks
      setExamTotalQuestions(next.length);
      setExamTotalMarks(next.length * examPositiveMarks);
      setExamPassingMarks(Math.round(next.length * examPositiveMarks * 0.4));
      return next;
    });
  };

  // Quick Action: Select All from active filtered bank
  const handleSelectAllFromBank = () => {
    const idsToAdd = activeBankQuestions.map(q => q.id);
    const merged = Array.from(new Set([...selectedQuestionIds, ...idsToAdd]));
    setSelectedQuestionIds(merged);
    setExamTotalQuestions(merged.length);
    setExamTotalMarks(merged.length * examPositiveMarks);
    setExamPassingMarks(Math.round(merged.length * examPositiveMarks * 0.4));
    showToast('success', `Selected ${merged.length} total questions.`);
  };

  // Quick Action: Select Only Fresh / Unused from active bank
  const handleSelectUnusedFromBank = () => {
    const unusedIds = activeBankQuestions
      .filter(q => !q.isUsed || (editingExam && q.usedInTestIds?.includes(editingExam.id)))
      .map(q => q.id);
    const merged = Array.from(new Set([...selectedQuestionIds, ...unusedIds]));
    setSelectedQuestionIds(merged);
    setExamTotalQuestions(merged.length);
    setExamTotalMarks(merged.length * examPositiveMarks);
    setExamPassingMarks(Math.round(merged.length * examPositiveMarks * 0.4));
    showToast('success', `Selected ${unusedIds.length} fresh unused questions.`);
  };

  // Quick Action: Clear all selected questions
  const handleClearSelectedQuestions = () => {
    setSelectedQuestionIds([]);
    setExamTotalQuestions(0);
    setExamTotalMarks(0);
    setExamPassingMarks(0);
  };

  // Recalculate marks when positive mark rate changes
  const handlePositiveMarksChange = (val: number) => {
    setExamPositiveMarks(val);
    const qCount = selectedQuestionIds.length > 0 ? selectedQuestionIds.length : examTotalQuestions;
    setExamTotalMarks(qCount * val);
    setExamPassingMarks(Math.round(qCount * val * 0.4));
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examMainCatId) {
      showToast('error', 'Mandatory: Please select a Main Category.');
      return;
    }
    if (!examSubCatId) {
      showToast('error', 'Mandatory: Please select a Subcategory.');
      return;
    }
    if (!examTitle.trim()) {
      showToast('error', 'Exam Title is required.');
      return;
    }

    const price = examPriceType === 'free' ? 0 : Number(examPrice);
    const isFree = price === 0;
    const finalNegativeMarks = examHasNegativeMarking ? Number(examNegativeMarks) : 0;
    const finalQuestions = selectedQuestionIds.length > 0 ? selectedQuestionIds : (editingExam?.questionIds || ['q-1', 'q-2', 'q-3', 'q-4', 'q-5']);

    const payload = {
      title: examTitle.trim(),
      titleMarathi: examTitleMr.trim() || examTitle.trim(),
      description: examDescription,
      mainCategoryId: examMainCatId,
      subCategoryId: examSubCatId,
      main_category_id: examMainCatId,
      sub_category_id: examSubCatId,
      isFree,
      price,
      discountPrice: !isFree ? Number(examDiscountPrice) : undefined,
      includeInPackage: examIncludeInPackage,
      packageName: examIncludeInPackage ? (examPackageName || 'Standard Package') : undefined,
      durationMinutes: Number(examDuration),
      totalMarks: Number(examTotalMarks),
      positiveMarks: Number(examPositiveMarks),
      negativeMarks: finalNegativeMarks,
      negativeMarking: finalNegativeMarks,
      passingMarks: Number(examPassingMarks),
      difficulty: examDifficulty,
      language: examLanguage,
      status: examStatus,
      totalQuestions: finalQuestions.length || Number(examTotalQuestions),
      questionIds: finalQuestions,
    };

    try {
      if (editingExam) {
        await api.updateAdminTest(editingExam.id, payload);
        showToast('success', `Exam "${examTitle}" updated successfully with ${finalQuestions.length} questions!`);
      } else {
        await api.createAdminTest(payload);
        showToast('success', `Exam "${examTitle}" created successfully with ${finalQuestions.length} questions!`);
      }
      setIsExamModalOpen(false);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save Exam.');
    }
  };

  const handleDeleteExam = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete Exam "${title}"?`)) {
      return;
    }
    try {
      await api.deleteAdminTest(id);
      showToast('success', `Exam "${title}" deleted.`);
      await loadAllData();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete Exam.');
    }
  };

  // Subcategories available for exam modal cascading dropdown
  const subCategoriesForExamModal = subCategories.filter(s => s.mainCategoryId === examMainCatId);

  // Filtered views
  const filteredMainCategories = mainCategories.filter(mc => {
    if (!search) return true;
    const q = search.toLowerCase();
    return mc.name.toLowerCase().includes(q) || (mc.nameMarathi && mc.nameMarathi.includes(q)) || (mc.description && mc.description.toLowerCase().includes(q));
  });

  const filteredSubCategories = subCategories.filter(sc => {
    if (filterMainCat !== 'all' && sc.mainCategoryId !== filterMainCat) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return sc.name.toLowerCase().includes(q) || (sc.nameMarathi && sc.nameMarathi.includes(q)) || (sc.mainCategoryName && sc.mainCategoryName.toLowerCase().includes(q));
  });

  const filteredExams = exams.filter(ex => {
    if (filterMainCat !== 'all' && (ex.mainCategoryId || ex.main_category_id) !== filterMainCat) return false;
    if (filterSubCat !== 'all' && (ex.subCategoryId || ex.sub_category_id) !== filterSubCat) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      ex.title.toLowerCase().includes(q) ||
      (ex.titleMarathi && ex.titleMarathi.includes(q)) ||
      (ex.mainCategoryName && ex.mainCategoryName.toLowerCase().includes(q)) ||
      (ex.subCategoryName && ex.subCategoryName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6" id="admin-hierarchy-manager">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-sm font-medium ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
                3-Step Hierarchy Engine
              </span>
              <span className="text-xs text-gray-500 font-medium">Main Category → Subcategory → Exam</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-1">Category & Exam Management System</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Manage Main Categories, link Subcategories with mandatory parent dropdowns, and create Exams with individual pricing or package inclusion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'option1_main' && (
              <button
                id="btn-add-main-category"
                onClick={() => openMainCatModal()}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add Main Category</span>
              </button>
            )}
            {activeTab === 'option2_sub' && (
              <button
                id="btn-add-subcategory"
                onClick={() => openSubCatModal()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <FolderTree className="w-4 h-4" />
                <span>Create Subcategory</span>
              </button>
            )}
            {activeTab === 'option3_exam' && (
              <button
                id="btn-create-exam"
                onClick={() => openExamModal()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span>Create Exam</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Step Navigation Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            id="tab-option-1"
            onClick={() => {
              setActiveTab('option1_main');
              setSearch('');
            }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeTab === 'option1_main'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400 ring-opacity-30'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Option 1</span>
              <span className="text-xs px-2 py-0.5 bg-white border border-amber-200 rounded-full font-bold text-amber-900">
                {mainCategories.length} Main Categories
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-600" />
              <span>Main Categories</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Maharashtra State Exams, Bank, SSC, Railways, Teaching, etc.</p>
          </button>

          <button
            id="tab-option-2"
            onClick={() => {
              setActiveTab('option2_sub');
              setSearch('');
            }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeTab === 'option2_sub'
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400 ring-opacity-30'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Option 2</span>
              <span className="text-xs px-2 py-0.5 bg-white border border-indigo-200 rounded-full font-bold text-indigo-900">
                {subCategories.length} Subcategories
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              <span>Subcategories</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Mandatory Main Category dropdown (MPSC, Police, Talathi, Subjects)</p>
          </button>

          <button
            id="tab-option-3"
            onClick={() => {
              setActiveTab('option3_exam');
              setSearch('');
            }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeTab === 'option3_exam'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 ring-opacity-30'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Option 3</span>
              <span className="text-xs px-2 py-0.5 bg-white border border-emerald-200 rounded-full font-bold text-emerald-900">
                {exams.length} Exams & Tests
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FilePlus className="w-4 h-4 text-emerald-600" />
              <span>Create & Manage Exams</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">2 Dropdowns (Main + Sub Cat), Title, Individual Price, Package Inclusion</p>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-hierarchy-search"
            type="text"
            placeholder={
              activeTab === 'option1_main'
                ? 'Search main categories...'
                : activeTab === 'option2_sub'
                ? 'Search subcategories...'
                : 'Search exams by title, main or sub category...'
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {activeTab !== 'option1_main' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Main Cat:</span>
              <select
                id="select-filter-main-cat"
                value={filterMainCat}
                onChange={e => {
                  setFilterMainCat(e.target.value);
                  setFilterSubCat('all');
                }}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Main Categories</option>
                {mainCategories.map(mc => (
                  <option key={mc.id} value={mc.id}>
                    {mc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'option3_exam' && filterMainCat !== 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Sub Cat:</span>
              <select
                id="select-filter-sub-cat"
                value={filterSubCat}
                onChange={e => setFilterSubCat(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Subcategories</option>
                {subCategories
                  .filter(sc => sc.mainCategoryId === filterMainCat)
                  .map(sc => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            onClick={loadAllData}
            className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MAIN CATEGORIES (OPTION 1) */}
      {/* ========================================================================= */}
      {activeTab === 'option1_main' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50/50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-900">Main Categories (Tier 1)</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredMainCategories.length} of {mainCategories.length} categories
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredMainCategories.map((mc, idx) => (
              <div key={mc.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center flex-shrink-0 text-sm">
                    #{mc.order || idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-gray-900">{mc.name}</h4>
                      {mc.nameMarathi && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold">
                          {mc.nameMarathi}
                        </span>
                      )}
                      {mc.badge && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          {mc.badge}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                          mc.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {mc.status || 'active'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{mc.description || 'No description provided.'}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-gray-600">
                      <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        <FolderTree className="w-3.5 h-3.5" />
                        {mc.subCategoriesCount || subCategories.filter(s => s.mainCategoryId === mc.id).length} Subcategories
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <FilePlus className="w-3.5 h-3.5" />
                        {mc.totalTests || exams.filter(t => t.mainCategoryId === mc.id || t.main_category_id === mc.id).length} Exams
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    id={`btn-view-subs-${mc.id}`}
                    onClick={() => {
                      setFilterMainCat(mc.id);
                      setActiveTab('option2_sub');
                    }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <span>View Subcategories</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-edit-main-${mc.id}`}
                    onClick={() => openMainCatModal(mc)}
                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit Main Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-delete-main-${mc.id}`}
                    onClick={() => handleDeleteMainCat(mc.id, mc.name)}
                    className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Main Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredMainCategories.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FolderPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-700">No Main Categories Found</p>
                <p className="text-xs text-gray-500 mt-1">Click "Add Main Category" to create your first category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SUBCATEGORIES (OPTION 2 - Mandatory Parent Main Category) */}
      {/* ========================================================================= */}
      {activeTab === 'option2_sub' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-indigo-50/50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Subcategories (Tier 2 - Mandatory Parent Main Category)</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredSubCategories.length} of {subCategories.length} subcategories
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredSubCategories.map(sc => {
              const parent = mainCategories.find(mc => mc.id === sc.mainCategoryId);
              const testCount = exams.filter(t => t.subCategoryId === sc.id || t.sub_category_id === sc.id).length;

              return (
                <div key={sc.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-bold">
                          Parent: {parent?.name || sc.mainCategoryName || 'Unassigned'}
                        </span>
                        <h4 className="text-base font-bold text-gray-900">{sc.name}</h4>
                        {sc.nameMarathi && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-semibold">
                            {sc.nameMarathi}
                          </span>
                        )}
                        {sc.badge && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold">
                            {sc.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{sc.description || 'No description provided.'}</p>

                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <FilePlus className="w-3.5 h-3.5" />
                          {testCount} Exam Mock Tests
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      id={`btn-create-exam-under-${sc.id}`}
                      onClick={() => {
                        setExamMainCatId(sc.mainCategoryId);
                        setExamSubCatId(sc.id);
                        openExamModal();
                      }}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>+ Create Exam</span>
                    </button>
                    <button
                      id={`btn-edit-sub-${sc.id}`}
                      onClick={() => openSubCatModal(sc)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Subcategory"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-delete-sub-${sc.id}`}
                      onClick={() => handleDeleteSubCat(sc.id, sc.name)}
                      className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Subcategory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredSubCategories.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-700">No Subcategories Found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Create Subcategory" and select a parent Main Category from the mandatory dropdown.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CREATE & MANAGE EXAMS (OPTION 3) */}
      {/* ========================================================================= */}
      {activeTab === 'option3_exam' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50/50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Exams & Mock Tests (Tier 3)</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredExams.length} of {exams.length} exams
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredExams.map(ex => {
              const mainCat = mainCategories.find(mc => mc.id === (ex.mainCategoryId || ex.main_category_id));
              const subCat = subCategories.find(sc => sc.id === (ex.subCategoryId || ex.sub_category_id));
              const isFree = ex.isFree ?? (ex.price === 0);

              return (
                <div key={ex.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${
                        isFree ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                    >
                      {isFree ? 'FREE' : `₹${ex.price}`}
                    </div>
                    <div>
                      {/* Cascading Hierarchy Breadcrumbs */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          {mainCat?.name || ex.mainCategoryName || 'Maharashtra State Exams'}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                          {subCat?.name || ex.subCategoryName || ex.category || 'General'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-gray-900">{ex.title}</h4>
                        {ex.titleMarathi && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-semibold">
                            {ex.titleMarathi}
                          </span>
                        )}
                        {ex.includeInPackage && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Included in Package
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ex.description || 'No description provided.'}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {ex.durationMinutes || 60} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                          {ex.totalQuestions || ex.questionIds?.length || 50} Qs
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-gray-400" />
                          {ex.totalMarks || 100} Marks
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          Diff: {ex.difficulty || 'Medium'}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          Lang: {ex.language || 'Marathi'}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          Attempts: {ex.attemptsCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      id={`btn-edit-exam-${ex.id}`}
                      onClick={() => openExamModal(ex)}
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Exam"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-delete-exam-${ex.id}`}
                      onClick={() => handleDeleteExam(ex.id, ex.title)}
                      className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredExams.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FilePlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-gray-700">No Exams Found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Create Exam" to create an exam with cascading Main & Sub category dropdowns and pricing settings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT MAIN CATEGORY (Option 1) */}
      {/* ========================================================================= */}
      {isMainCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {editingMainCat ? 'Edit Main Category' : 'Option 1: Add New Main Category'}
                </h3>
              </div>
              <button onClick={() => setIsMainCatModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMainCat} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Category Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra State Exams, Bank & Insurance"
                  value={mainName}
                  onChange={e => setMainName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Category Name in Marathi (मराठी नाव)
                </label>
                <input
                  type="text"
                  placeholder="उदा. महाराष्ट्र राज्यस्तरीय स्पर्धा परीक्षा"
                  value={mainNameMr}
                  onChange={e => setMainNameMr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge / Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, TCS/IBPS"
                    value={mainBadge}
                    onChange={e => setMainBadge(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={mainOrder}
                    onChange={e => setMainOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of exams covered in this main category..."
                  value={mainDescription}
                  onChange={e => setMainDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={mainStatus}
                  onChange={e => setMainStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="active">Active (Visible to Students)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMainCatModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-sm"
                >
                  {editingMainCat ? 'Update Main Category' : 'Create Main Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT SUBCATEGORY (Option 2 - Mandatory parent Main Category) */}
      {/* ========================================================================= */}
      {isSubCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {editingSubCat ? 'Edit Subcategory' : 'Option 2: Create Subcategory'}
                </h3>
              </div>
              <button onClick={() => setIsSubCatModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubCat} className="space-y-4 mt-4">
              {/* Mandatory Parent Main Category Dropdown */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                  Parent Main Category (Mandatory Dropdown) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-mandatory-main-cat"
                  required
                  value={subParentMainId}
                  onChange={e => setSubParentMainId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="" disabled>
                    -- Select Parent Main Category --
                  </option>
                  {mainCategories.map(mc => (
                    <option key={mc.id} value={mc.id}>
                      {mc.name} ({mc.nameMarathi || mc.name})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-amber-800 mt-1">
                  Subcategory will be linked under this selected Main Category.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subcategory Name (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MPSC State Services, Maharashtra Police Bharti, Talathi"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subcategory Name in Marathi (मराठी नाव)
                </label>
                <input
                  type="text"
                  placeholder="उदा. महाराष्ट्र पोलीस शिपाई व चालक भरती"
                  value={subNameMr}
                  onChange={e => setSubNameMr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge / Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mission Vardi, TCS Pattern, 100% High Yield"
                  value={subBadge}
                  onChange={e => setSubBadge(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief details of syllabus and topics covered..."
                  value={subDescription}
                  onChange={e => setSubDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubCatModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm"
                >
                  {editingSubCat ? 'Update Subcategory' : 'Save Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE EXAM / MOCK TEST (Option 3 - Two Dropdowns & Pricing) */}
      {/* ========================================================================= */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {editingExam ? 'Edit Exam / Mock Test' : 'Option 3: Create Exam / Mock Test'}
                </h3>
              </div>
              <button onClick={() => setIsExamModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4 mt-4">
              {/* TWO MANDATORY CASCADING DROPDOWNS */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>Mandatory Categorization (Two Dropdowns)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      1. Main Category Dropdown <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="select-exam-main-cat"
                      required
                      value={examMainCatId}
                      onChange={e => handleMainCatChangeInExam(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-emerald-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="" disabled>
                        -- Select Main Category --
                      </option>
                      {mainCategories.map(mc => (
                        <option key={mc.id} value={mc.id}>
                          {mc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      2. Subcategory Dropdown <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="select-exam-sub-cat"
                      required
                      value={examSubCatId}
                      onChange={e => setExamSubCatId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-emerald-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="" disabled>
                        {subCategoriesForExamModal.length === 0
                          ? '-- No subcategories under selected Main Category --'
                          : '-- Select Subcategory --'}
                      </option>
                      {subCategoriesForExamModal.map(sc => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Title & Marathi Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Exam Title (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra Police Bharti 2026 Full Length Mock #1"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Exam Title in Marathi (मराठी शीर्षक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. महाराष्ट्र पोलीस भरती २०२६ संपूर्ण सराव पेपर क्र. १"
                  value={examTitleMr}
                  onChange={e => setExamTitleMr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Exam overview, syllabus covered, pattern guidelines..."
                  value={examDescription}
                  onChange={e => setExamDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* PRICING & PACKAGE INCLUSION (Option 3 Requirements) */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-amber-700" />
                  <span>Pricing & Package Settings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Access Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setExamPriceType('free');
                          setExamPrice(0);
                        }}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          examPriceType === 'free'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Free (₹0)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExamPriceType('paid');
                          if (examPrice === 0) setExamPrice(49);
                        }}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          examPriceType === 'paid'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Paid (Individual)
                      </button>
                    </div>
                  </div>

                  {examPriceType === 'paid' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={examPrice}
                          onChange={e => setExamPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">MRP (₹)</label>
                        <input
                          type="number"
                          min="1"
                          value={examDiscountPrice}
                          onChange={e => setExamDiscountPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Package Inclusion Checkbox */}
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={examIncludeInPackage}
                        onChange={e => setExamIncludeInPackage(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span>Include in Test Series Package / Bundle</span>
                    </label>
                    <p className="text-xs text-gray-500 ml-6">
                      If checked, students with an active Test Series pass can also unlock this test.
                    </p>
                  </div>

                  {examIncludeInPackage && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full">
                      Bundle Enabled
                    </span>
                  )}
                </div>
              </div>

              {/* ================================================================= */}
              {/* QUESTION BANK SELECTION & USAGE MANAGEMENT (User Requirement) */}
              {/* ================================================================= */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-indigo-700" />
                      <span>Associate Question Bank & Manage Questions</span>
                    </h4>
                    <p className="text-xs text-indigo-800 mt-0.5">
                      Select which Question Bank to associate with this exam and verify used vs unused questions.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="px-2.5 py-1 bg-indigo-600 text-white font-black text-xs rounded-lg shadow-xs">
                      {selectedQuestionIds.length} Questions Selected
                    </span>
                  </div>
                </div>

                {/* 1. Question Bank Selection Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">
                      Select Question Bank <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="select-question-bank-dropdown"
                      value={selectedBankId}
                      onChange={e => setSelectedBankId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-indigo-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="bank-all">
                        📚 All Master Questions Bank ({allQuestions.length} Questions)
                      </option>
                      {questionBanks.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.marathiName || b.name}) - [{b.totalQuestions || 0} Qs, {b.unusedQuestions || 0} Fresh]
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Bank Quick Stats */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold">Bank Status</span>
                      <span className="font-bold text-indigo-900">
                        {selectedBankId === 'bank-all' ? 'Master Repository' : questionBanks.find(b => b.id === selectedBankId)?.name || 'Subject Bank'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]" title="Fresh questions never used in any test">
                        🟢 {allQuestions.filter(q => !q.isUsed).length} Fresh
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px]" title="Used in other exams">
                        🟡 {allQuestions.filter(q => q.isUsed).length} Used
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Selection Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSelectAllFromBank}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Select All in Bank ({activeBankQuestions.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectUnusedFromBank}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Select Only Fresh / Unused</span>
                    </button>
                    {selectedQuestionIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearSelectedQuestions}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear ({selectedQuestionIds.length})</span>
                      </button>
                    )}
                  </div>

                  {/* Search within questions */}
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter questions..."
                      value={questionBankSearch}
                      onChange={e => setQuestionBankSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Usage Filter Pills */}
                <div className="flex items-center gap-1.5 border-b border-indigo-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setQuestionBankFilter('all')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      questionBankFilter === 'all'
                        ? 'bg-indigo-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-indigo-50 border border-indigo-200'
                    }`}
                  >
                    All Questions ({activeBankQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionBankFilter('unused')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      questionBankFilter === 'unused'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
                    }`}
                  >
                    🟢 Fresh / Unused
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionBankFilter('used')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      questionBankFilter === 'used'
                        ? 'bg-amber-700 text-white'
                        : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-300'
                    }`}
                  >
                    🟡 Already Used
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionBankFilter('selected')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      questionBankFilter === 'selected'
                        ? 'bg-indigo-900 text-white'
                        : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-300'
                    }`}
                  >
                    Selected ({selectedQuestionIds.length})
                  </button>
                </div>

                {/* 4. Question Item List with Checkboxes & Usage Status */}
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {activeBankQuestions.length === 0 ? (
                    <div className="p-6 text-center bg-white rounded-xl border border-gray-200 text-xs text-gray-500">
                      No questions match the current filter or search criteria.
                    </div>
                  ) : (
                    activeBankQuestions.map((q, idx) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      const isUsedInOther = q.isUsed && (!editingExam || !q.usedInTestIds?.includes(editingExam.id));

                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuestion(q.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-indigo-100/90 border-indigo-500 shadow-2xs'
                              : 'bg-white border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="pt-0.5">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-700" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                                  Q{idx + 1}
                                </span>
                                {q.topic && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {q.topic}
                                  </span>
                                )}
                              </div>

                              {/* Usage Indicator Badge */}
                              <div>
                                {isUsedInOther ? (
                                  <span
                                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 flex items-center gap-1"
                                    title={`Already used in: ${q.usedInTests?.join(', ') || 'Another Exam'}`}
                                  >
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Used in: {q.usedInTests?.[0] || '1 Exam'}</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>Fresh / Unused</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-gray-900 line-clamp-2">
                              {q.textMarathi || q.text}
                            </p>
                            {q.text && q.textMarathi && q.text !== q.textMarathi && (
                              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                {q.text}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ================================================================= */}
              {/* EXAM TIMING, MARKS & NEGATIVE MARKING CONTROLS (User Requirement) */}
              {/* ================================================================= */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-slate-700" />
                  <span>Duration, Marks & Negative Marking Configuration</span>
                </h4>

                {/* Row 1: Duration & Positive Marks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Duration (Minutes) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      required
                      value={examDuration}
                      onChange={e => setExamDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[30, 45, 60, 90, 120].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setExamDuration(m)}
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                            examDuration === m
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Positive Marks / Question <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      required
                      value={examPositiveMarks}
                      onChange={e => handlePositiveMarksChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map(pm => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => handlePositiveMarksChange(pm)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            examPositiveMarks === pm
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          +{pm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Total Exam Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={examTotalMarks}
                      onChange={e => setExamTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-black text-indigo-900"
                    />
                    <span className="text-[10px] text-gray-500 block mt-1">
                      Calculated: {selectedQuestionIds.length || examTotalQuestions} Qs × {examPositiveMarks} Marks
                    </span>
                  </div>
                </div>

                {/* Row 2: Negative Marking Management Switch & Passing Marks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-900">Negative Marking?</label>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setExamHasNegativeMarking(false)}
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            !examHasNegativeMarking
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          No (0)
                        </button>
                        <button
                          type="button"
                          onClick={() => setExamHasNegativeMarking(true)}
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            examHasNegativeMarking
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Yes (Deduct)
                        </button>
                      </div>
                    </div>

                    {examHasNegativeMarking ? (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Negative Penalty Marks per Wrong Answer
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={examNegativeMarks}
                            onChange={e => setExamNegativeMarks(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-bold text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="0.25">-0.25 (1/4th of 1 mark)</option>
                            <option value="0.33">-0.33 (1/3rd of 1 mark)</option>
                            <option value="0.50">-0.50 (1/4th of 2 marks / Standard MPSC)</option>
                            <option value="0.66">-0.66 (1/3rd of 2 marks)</option>
                            <option value="1.00">-1.00 (Full 1 Mark Penalty)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No marks will be deducted for incorrect answers.</p>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                      Passing Marks Threshold
                    </label>
                    <input
                      type="number"
                      value={examPassingMarks}
                      onChange={e => setExamPassingMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
                      <span>Qualifying Cut-off</span>
                      <span className="font-bold text-emerald-700">
                        {Math.round((examPassingMarks / (examTotalMarks || 100)) * 100)}% Passing Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty, Language & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={examDifficulty}
                    onChange={e => setExamDifficulty(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                  >
                    <option value="Easy">Easy (सोपा)</option>
                    <option value="Medium">Medium (मध्यम - TCS/IBPS)</option>
                    <option value="Hard">Hard (कठीण)</option>
                    <option value="MPSC Level">MPSC Level (अति-कठीण)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Language</label>
                  <select
                    value={examLanguage}
                    onChange={e => setExamLanguage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                  >
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="English">English</option>
                    <option value="Bilingual">Bilingual (द्विभाषिक)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={examStatus}
                    onChange={e => setExamStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
                  >
                    <option value="published">Published (Live to Students)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm"
                >
                  {editingExam ? 'Update Exam' : 'Create & Publish Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
