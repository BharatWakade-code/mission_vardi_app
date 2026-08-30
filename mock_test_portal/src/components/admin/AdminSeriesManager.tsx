import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Search, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import { TestSeries, Exam } from '../../types';

export const AdminSeriesManager: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [seriesList, setSeriesList] = useState<TestSeries[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<TestSeries | null>(null);
  const [title, setTitle] = useState('');
  const [titleMarathi, setTitleMarathi] = useState('');
  const [examId, setExamId] = useState('exam-mpsc');
  const [price, setPrice] = useState(299);
  const [originalPrice, setOriginalPrice] = useState(999);
  const [isPopular, setIsPopular] = useState(false);
  const [totalTests, setTotalTests] = useState(25);
  const [validityDays, setValidityDays] = useState(180);
  const [featuresText, setFeaturesText] = useState('25 Full Mock Tests\nInstant State Ranking\nDetailed Marathi Solutions\nNegative Marking Analytics');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [serRes, exRes] = await Promise.all([
        api.getTestSeries(),
        api.getExams(),
      ]);
      setSeriesList(serRes.testSeries || []);
      setExams(exRes.exams || []);
    } catch (err) {
      console.error('Failed to load test series', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (ser?: TestSeries) => {
    if (ser) {
      setEditingSeries(ser);
      setTitle(ser.title);
      setTitleMarathi(ser.titleMarathi || '');
      setExamId(ser.examId);
      setPrice(ser.price);
      setOriginalPrice(ser.originalPrice || ser.price * 2);
      setIsPopular(!!ser.isPopular);
      setTotalTests(ser.totalTests);
      setValidityDays(ser.validityDays || 180);
      setFeaturesText((ser.features || []).join('\n'));
    } else {
      setEditingSeries(null);
      setTitle('');
      setTitleMarathi('');
      setExamId(exams[0]?.id || 'exam-mpsc');
      setPrice(299);
      setOriginalPrice(999);
      setIsPopular(false);
      setTotalTests(25);
      setValidityDays(180);
      setFeaturesText('25 Full Mock Tests\nInstant State Ranking\nDetailed Marathi Solutions\nNegative Marking Analytics');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      titleMarathi,
      examId,
      price: Number(price),
      originalPrice: Number(originalPrice),
      isPopular,
      totalTests: Number(totalTests),
      validityDays: Number(validityDays),
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editingSeries) {
        await api.updateAdminTestSeries(editingSeries.id, payload);
      } else {
        await api.createAdminTestSeries(payload);
      }
      setIsModalOpen(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save test series', err);
      alert('Failed to save test series package');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete test series "${name}"?`)) return;
    try {
      await api.deleteAdminTestSeries(id);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete series', err);
      alert('Failed to delete series');
    }
  };

  const filtered = seriesList.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.titleMarathi && s.titleMarathi.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Test Series Packages & Subscription Plans</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure premium mock test bundles, Razorpay pricing, features, and validity
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Test Package</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search test series packages..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ser) => {
          const parentExam = exams.find((e) => e.id === ser.examId);
          return (
            <div
              key={ser.id}
              className={`bg-white p-5 rounded-2xl border ${
                ser.isPopular ? 'border-indigo-400 ring-2 ring-indigo-600/10' : 'border-slate-200'
              } shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 uppercase">
                      {parentExam?.name || ser.examId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{ser.title}</h3>
                    {ser.titleMarathi && (
                      <p className="text-xs text-slate-500 font-devanagari">{ser.titleMarathi}</p>
                    )}
                  </div>
                  {ser.isPopular && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase bg-amber-100 text-amber-800">
                      BEST VALUE
                    </span>
                  )}
                </div>

                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{ser.price}</span>
                  {ser.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{ser.originalPrice}</span>
                  )}
                  <span className="text-[11px] font-bold text-emerald-600">
                    ({Math.round((1 - ser.price / (ser.originalPrice || ser.price * 2)) * 100)}% OFF)
                  </span>
                </div>

                <div className="space-y-1.5 py-2 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{ser.totalTests} Full & Sectional Mock Tests</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validity: {ser.validityDays || 180} Days</span>
                  </div>
                  {(ser.features || []).slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-500">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openModal(ser)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(ser.id, ser.title)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">{editingSeries ? 'Edit Test Series Package' : 'Create New Test Series'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Exam *</label>
                  <select
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Popular Flag</label>
                  <select
                    value={isPopular ? 'yes' : 'no'}
                    onChange={(e) => setIsPopular(e.target.value === 'yes')}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="no">Standard Plan</option>
                    <option value="yes">⭐ Featured / Popular Bundle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MPSC Combine 2026 Ultimate Test Series"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={titleMarathi}
                  onChange={(e) => setTitleMarathi(e.target.value)}
                  placeholder="उदा. एमपीएससी संयुक्त पूर्व परीक्षा सराव मालिका"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Included Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="25 Full Mock Tests&#10;Detailed Marathi Solutions&#10;State Rank Benchmark"
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
                  Save Test Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
