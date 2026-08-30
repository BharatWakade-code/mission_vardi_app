import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Search, X, FileText, Download } from 'lucide-react';
import { api } from '../../services/api';
import { StudyNote } from '../../types';

export const AdminNotesManager: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [title, setTitle] = useState('');
  const [titleMarathi, setTitleMarathi] = useState('');
  const [subjectName, setSubjectName] = useState('Polity & Constitution');
  const [examCategory, setExamCategory] = useState('MPSC State Services');
  const [author, setAuthor] = useState('ParikshaSetu Expert Faculty');
  const [pageCount, setPageCount] = useState(45);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminNotes();
      setNotes(res.notes || []);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (note?: StudyNote) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setTitleMarathi(note.titleMarathi || '');
      setSubjectName(note.subjectName);
      setExamCategory(note.examCategory);
      setAuthor(note.author || 'ParikshaSetu Faculty');
      setPageCount(note.pageCount || 30);
      setIsFree(note.isFree);
      setPrice(note.price || 0);
      setPdfUrl(note.pdfUrl || '');
    } else {
      setEditingNote(null);
      setTitle('');
      setTitleMarathi('');
      setSubjectName('Polity & Constitution');
      setExamCategory('MPSC State Services');
      setAuthor('ParikshaSetu Faculty');
      setPageCount(35);
      setIsFree(true);
      setPrice(0);
      setPdfUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      titleMarathi,
      subjectName,
      examCategory,
      author,
      pageCount: Number(pageCount),
      isFree,
      price: isFree ? 0 : Number(price),
      pdfUrl: pdfUrl || undefined,
    };

    try {
      if (editingNote) {
        await api.updateAdminNote(editingNote.id, payload);
      } else {
        await api.createNote(payload);
      }
      setIsModalOpen(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save note', err);
      alert('Failed to save study material note');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete notes "${name}"?`)) return;
    try {
      await api.deleteAdminNote(id);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete note', err);
      alert('Failed to delete note');
    }
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.titleMarathi && n.titleMarathi.includes(search)) ||
      n.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Study Notes & Handcrafted PDF Summaries</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage subject-wise concise revision notes, e-books, and toppers handwritten materials
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Notes</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes by subject or title..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700">
                  {note.subjectName}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${note.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {note.isFree ? 'FREE PDF' : `₹${note.price}`}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{note.title}</h3>
              {note.titleMarathi && (
                <p className="text-xs text-slate-500 font-devanagari mt-0.5">{note.titleMarathi}</p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl my-3">
                <span>Pages: <strong>{note.pageCount || 35}</strong></span>
                <span>By: <strong>{note.author || 'ParikshaSetu'}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {note.pdfUrl ? (
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Preview PDF</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">No URL</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(note)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(note.id, note.title)}
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
              <h3 className="font-bold text-sm">{editingNote ? 'Edit Study Note' : 'Add Study Material'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Module *</label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Marathi Grammar"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Category</label>
                  <input
                    type="text"
                    value={examCategory}
                    onChange={(e) => setExamCategory(e.target.value)}
                    placeholder="e.g. MPSC & Police Bharti"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Maharashtra History Short Notes"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={titleMarathi}
                  onChange={(e) => setTitleMarathi(e.target.value)}
                  placeholder="उदा. महाराष्ट्राचा संपूर्ण इतिहास व समाजसुधारक नोट्स"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
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
                    <option value="free">🎁 Free PDF</option>
                    <option value="paid">💎 Paid (₹)</option>
                  </select>
                </div>

                {!isFree && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PDF File URL</label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://.../notes.pdf"
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
