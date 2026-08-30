import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Search, X, Download, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { PYQPaper } from '../../types';

export const AdminPYQManager: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [pyqs, setPyqs] = useState<PYQPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPyq, setEditingPyq] = useState<PYQPaper | null>(null);
  const [title, setTitle] = useState('');
  const [titleMarathi, setTitleMarathi] = useState('');
  const [examName, setExamName] = useState('MPSC Rajyaseva Prelims');
  const [year, setYear] = useState(2024);
  const [category, setCategory] = useState('MPSC State Services');
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isFree, setIsFree] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminPYQs();
      setPyqs(res.pyqs || []);
    } catch (err) {
      console.error('Failed to load PYQs', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (pyq?: PYQPaper) => {
    if (pyq) {
      setEditingPyq(pyq);
      setTitle(pyq.title);
      setTitleMarathi(pyq.titleMarathi || '');
      setExamName(pyq.examName);
      setYear(pyq.year);
      setCategory(pyq.category);
      setTotalQuestions(pyq.totalQuestions);
      setDurationMinutes(pyq.durationMinutes);
      setPdfUrl(pyq.pdfUrl || '');
      setIsFree(pyq.isFree !== false);
    } else {
      setEditingPyq(null);
      setTitle('');
      setTitleMarathi('');
      setExamName('MPSC Combine Prelims');
      setYear(2024);
      setCategory('MPSC State Services');
      setTotalQuestions(100);
      setDurationMinutes(60);
      setPdfUrl('');
      setIsFree(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      titleMarathi,
      examName,
      year: Number(year),
      category,
      totalQuestions: Number(totalQuestions),
      durationMinutes: Number(durationMinutes),
      pdfUrl: pdfUrl || undefined,
      isFree,
    };

    try {
      if (editingPyq) {
        await api.updateAdminPYQ(editingPyq.id, payload);
      } else {
        await api.createPYQ(payload);
      }
      setIsModalOpen(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save PYQ', err);
      alert('Failed to save PYQ paper');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete PYQ paper "${name}"?`)) return;
    try {
      await api.deleteAdminPYQ(id);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete PYQ', err);
      alert('Failed to delete PYQ paper');
    }
  };

  const filtered = pyqs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.titleMarathi && p.titleMarathi.includes(search)) ||
      p.examName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Previous Year Question Papers (PYQ) Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload & manage solved previous question papers with download links and CBT mock links
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add PYQ Paper</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search PYQs by exam name or year..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((paper) => (
          <div
            key={paper.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700">
                  {paper.examName} ({paper.year})
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${paper.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {paper.isFree ? 'FREE' : 'PRO'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{paper.title}</h3>
              {paper.titleMarathi && (
                <p className="text-xs text-slate-500 font-devanagari mt-0.5">{paper.titleMarathi}</p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl my-3">
                <div>Questions: <strong className="text-slate-800">{paper.totalQuestions}</strong></div>
                <div>Time: <strong className="text-slate-800">{paper.durationMinutes} mins</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {paper.pdfUrl ? (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Link</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">No PDF Attached</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(paper)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(paper.id, paper.title)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">{editingPyq ? 'Edit PYQ Paper' : 'Add PYQ Paper'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Name *</label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. MPSC Combine Group B"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Year *</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paper Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MPSC Combine Group B Prelims 2024 Official Paper"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paper Title (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={titleMarathi}
                  onChange={(e) => setTitleMarathi(e.target.value)}
                  placeholder="उदा. संयुक्त पूर्व परीक्षा २०२४ प्रश्नपत्रिका व उत्तरतालिका"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access</label>
                  <select
                    value={isFree ? 'free' : 'paid'}
                    onChange={(e) => setIsFree(e.target.value === 'free')}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="free">🎁 Free Download</option>
                    <option value="paid">💎 Paid Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PDF Download URL (Optional)</label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://.../mpsc_2024.pdf"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save PYQ Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
