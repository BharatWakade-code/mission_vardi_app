import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Search, X } from 'lucide-react';
import { api } from '../../services/api';
import { Subject } from '../../types';

export const AdminSubjectsManager: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [name, setName] = useState('');
  const [nameMarathi, setNameMarathi] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(250);
  const [icon, setIcon] = useState('BookOpen');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminSubjects();
      setSubjects(res.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (sub?: Subject) => {
    if (sub) {
      setEditingSubject(sub);
      setName(sub.name);
      setNameMarathi(sub.nameMarathi || '');
      setTotalQuestions(sub.totalQuestions || 250);
      setIcon(sub.icon || 'BookOpen');
    } else {
      setEditingSubject(null);
      setName('');
      setNameMarathi('');
      setTotalQuestions(250);
      setIcon('BookOpen');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      nameMarathi,
      totalQuestions: Number(totalQuestions),
      icon,
    };

    try {
      if (editingSubject) {
        await api.updateAdminSubject(editingSubject.id, payload);
      } else {
        await api.createAdminSubject(payload);
      }
      setIsModalOpen(false);
      loadSubjects();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save subject', err);
      alert('Failed to save subject');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete subject "${name}"?`)) return;
    try {
      await api.deleteAdminSubject(id);
      loadSubjects();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete subject', err);
      alert('Failed to delete subject');
    }
  };

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.nameMarathi && s.nameMarathi.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Subject Modules & Syllabus Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize questions and test drills by subjects (Marathi Vyakaran, Maths, CSAT, Polity, Science)
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects in English or Marathi..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                  {sub.name.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
                  {sub.nameMarathi && (
                    <p className="text-xs text-slate-500 font-devanagari">{sub.nameMarathi}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl text-slate-600">
                <span>Total Questions:</span>
                <span className="font-bold text-indigo-600">{sub.totalQuestions || 250}+</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => openModal(sub)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(sub.id, sub.name)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. General Science (सामान्य विज्ञान)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={nameMarathi}
                  onChange={(e) => setNameMarathi(e.target.value)}
                  placeholder="उदा. सामान्य विज्ञान व तंत्रज्ञान"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Question Bank Count</label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
