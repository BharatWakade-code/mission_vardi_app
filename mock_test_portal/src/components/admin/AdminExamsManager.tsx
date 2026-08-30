import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Layers, GraduationCap, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { Exam, Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AdminExamsManagerProps {
  onRefreshData?: () => void;
}

export const AdminExamsManager: React.FC<AdminExamsManagerProps> = ({ onRefreshData }) => {
  const { t } = useLanguage();
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'categories'>('exams');

  // Exam Modal State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examName, setExamName] = useState('');
  const [examNameMr, setExamNameMr] = useState('');
  const [examCategory, setExamCategory] = useState<'state' | 'banking' | 'ssc' | 'railway' | 'teaching'>('state');
  const [examBadge, setExamBadge] = useState('');
  const [examLogoCode, setExamLogoCode] = useState('');
  const [examLogoBg, setExamLogoBg] = useState('bg-indigo-700 text-white');
  const [examTotalTests, setExamTotalTests] = useState(15);
  const [examDescription, setExamDescription] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catExamId, setCatExamId] = useState('');
  const [catName, setCatName] = useState('');
  const [catNameMr, setCatNameMr] = useState('');
  const [catTestCount, setCatTestCount] = useState(10);
  const [catDescription, setCatDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exRes, catRes] = await Promise.all([
        api.getAdminExams(),
        api.getAdminCategories(),
      ]);
      setExams(exRes.exams || []);
      setCategories(catRes.categories || []);
      if (exRes.exams?.length && !catExamId) {
        setCatExamId(exRes.exams[0].id);
      }
    } catch (err) {
      console.error('Failed to load exams & categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const openExamModal = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      setExamName(exam.name);
      setExamNameMr(exam.nameMarathi || '');
      setExamCategory(exam.category || 'state');
      setExamBadge(exam.badge || '');
      setExamLogoCode(exam.logoCode || '');
      setExamLogoBg(exam.logoBg || 'bg-indigo-700 text-white');
      setExamTotalTests(exam.totalTests || 15);
      setExamDescription(exam.description || '');
    } else {
      setEditingExam(null);
      setExamName('');
      setExamNameMr('');
      setExamCategory('state');
      setExamBadge('');
      setExamLogoCode('');
      setExamLogoBg('bg-indigo-700 text-white');
      setExamTotalTests(15);
      setExamDescription('');
    }
    setIsExamModalOpen(true);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: examName,
      nameMarathi: examNameMr,
      category: examCategory,
      badge: examBadge || undefined,
      logoCode: examLogoCode || examName.substring(0, 4).toUpperCase(),
      logoBg: examLogoBg,
      totalTests: Number(examTotalTests),
      description: examDescription,
    };

    try {
      if (editingExam) {
        await api.updateAdminExam(editingExam.id, payload);
      } else {
        await api.createAdminExam(payload);
      }
      setIsExamModalOpen(false);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Save exam error:', err);
      alert('Failed to save exam');
    }
  };

  const handleDeleteExam = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete exam "${name}"? This may affect linked mock tests.`)) return;
    try {
      await api.deleteAdminExam(id);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Delete exam error:', err);
      alert('Failed to delete exam');
    }
  };

  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatExamId(cat.examId);
      setCatName(cat.name);
      setCatNameMr(cat.nameMarathi || '');
      setCatTestCount(cat.testCount || 10);
      setCatDescription(cat.description || '');
    } else {
      setEditingCategory(null);
      setCatExamId(exams[0]?.id || 'exam-mpsc');
      setCatName('');
      setCatNameMr('');
      setCatTestCount(10);
      setCatDescription('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      examId: catExamId,
      name: catName,
      nameMarathi: catNameMr,
      testCount: Number(catTestCount),
      description: catDescription,
    };

    try {
      if (editingCategory) {
        await api.updateAdminCategory(editingCategory.id, payload);
      } else {
        await api.createAdminCategory(payload);
      }
      setIsCategoryModalOpen(false);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Save category error:', err);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.deleteAdminCategory(id);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Delete category error:', err);
      alert('Failed to delete category');
    }
  };

  const filteredExams = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.nameMarathi && e.nameMarathi.includes(search))
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nameMarathi && c.nameMarathi.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Exams & Categories Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure state recruitment exams (MPSC, Police, Talathi) and test sub-categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('exams')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubTab === 'exams' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exams ({exams.length})
            </button>
            <button
              onClick={() => setActiveSubTab('categories')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubTab === 'categories' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sub-Categories ({categories.length})
            </button>
          </div>

          <button
            onClick={() => (activeSubTab === 'exams' ? openExamModal() : openCategoryModal())}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{activeSubTab === 'exams' ? 'Add Exam' : 'Add Category'}</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeSubTab === 'exams' ? 'exams' : 'categories'} by English or Marathi title...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      {/* Exams Sub-Tab Content */}
      {activeSubTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${exam.logoBg || 'bg-indigo-700 text-white'}`}>
                      {exam.logoCode || exam.name.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{exam.name}</h3>
                      {exam.nameMarathi && (
                        <p className="text-xs text-slate-500 font-devanagari">{exam.nameMarathi}</p>
                      )}
                    </div>
                  </div>
                  {exam.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase bg-amber-100 text-amber-800">
                      {exam.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {exam.description || 'Comprehensive exam preparation & mock tests'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                  <span>Category: <strong className="text-slate-700 capitalize">{exam.category || 'State'}</strong></span>
                  <span>Tests: <strong className="text-indigo-600">{exam.totalTests || 15}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openExamModal(exam)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id, exam.name)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Sub-Tab Content */}
      {activeSubTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Category Name</th>
                  <th className="p-3.5">मराठी नाव</th>
                  <th className="p-3.5">Parent Exam</th>
                  <th className="p-3.5">Tests Count</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const parentExam = exams.find((e) => e.id === cat.examId);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-3.5 font-devanagari text-slate-700">{cat.nameMarathi || '-'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700">
                          {parentExam?.name || cat.examId}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-700">{cat.testCount || 10}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openCategoryModal(cat)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingExam ? 'Edit Exam Portal Details' : 'Create New Exam'}
              </h3>
              <button onClick={() => setIsExamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. MPSC State Services"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Name (मराठी नाव) *</label>
                  <input
                    type="text"
                    required
                    value={examNameMr}
                    onChange={(e) => setExamNameMr(e.target.value)}
                    placeholder="उदा. एमपीएससी राज्यसेवा"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Group Category</label>
                  <select
                    value={examCategory}
                    onChange={(e: any) => setExamCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="state">Maharashtra State (MPSC / Police / ZP)</option>
                    <option value="banking">Banking & Insurance (IBPS / SBI)</option>
                    <option value="ssc">Staff Selection (SSC CGL / GD / CHSL)</option>
                    <option value="railway">Railways (RRB NTPC / Group D)</option>
                    <option value="teaching">Teaching (MAHA-TET / TAIT / CTET)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Flag</label>
                  <input
                    type="text"
                    value={examBadge}
                    onChange={(e) => setExamBadge(e.target.value)}
                    placeholder="e.g. POPULAR, HOT, NEW"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logo Text/Code</label>
                  <input
                    type="text"
                    value={examLogoCode}
                    onChange={(e) => setExamLogoCode(e.target.value)}
                    placeholder="MPSC"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 uppercase font-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logo Color Theme</label>
                  <select
                    value={examLogoBg}
                    onChange={(e) => setExamLogoBg(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 text-xs"
                  >
                    <option value="bg-indigo-700 text-white">Indigo (MPSC)</option>
                    <option value="bg-rose-700 text-white">Rose Red (Police)</option>
                    <option value="bg-emerald-700 text-white">Emerald Green (Talathi)</option>
                    <option value="bg-blue-700 text-white">Blue (Combine)</option>
                    <option value="bg-purple-900 text-white">Purple (Banking)</option>
                    <option value="bg-orange-700 text-white">Orange (Railway)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Tests</label>
                  <input
                    type="number"
                    value={examTotalTests}
                    onChange={(e) => setExamTotalTests(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  placeholder="Details regarding syllabus, pattern & eligibility..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingCategory ? 'Edit Sub-Category' : 'Create Sub-Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Exam *</label>
                <select
                  required
                  value={catExamId}
                  onChange={(e) => setCatExamId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. MPSC Combine Group B (PSI / STI / ASO)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={catNameMr}
                  onChange={(e) => setCatNameMr(e.target.value)}
                  placeholder="उदा. संयुक्त गट ब पूर्व व मुख्य परीक्षा"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Mock Tests Count</label>
                <input
                  type="number"
                  value={catTestCount}
                  onChange={(e) => setCatTestCount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
