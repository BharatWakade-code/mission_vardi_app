import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell, Search, X, ExternalLink, Flame } from 'lucide-react';
import { api } from '../../services/api';
import { GovtAlert } from '../../types';

export const AdminAlertsManager: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => {
  const [alerts, setAlerts] = useState<GovtAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<GovtAlert | null>(null);
  const [title, setTitle] = useState('');
  const [titleMarathi, setTitleMarathi] = useState('');
  const [department, setDepartment] = useState('Maharashtra Police Department');
  const [departmentMarathi, setDepartmentMarathi] = useState('महाराष्ट्र पोलीस दल');
  const [postsCount, setPostsCount] = useState(17471);
  const [eligibility, setEligibility] = useState('12th Pass / Graduate');
  const [salary, setSalary] = useState('₹21,700 - ₹69,100');
  const [lastDate, setLastDate] = useState('2026-04-30');
  const [applyUrl, setApplyUrl] = useState('https://mahapolice.gov.in');
  const [notificationPdfUrl, setNotificationPdfUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'upcoming' | 'closed'>('active');
  const [isHot, setIsHot] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAlerts();
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (alt?: GovtAlert) => {
    if (alt) {
      setEditingAlert(alt);
      setTitle(alt.title);
      setTitleMarathi(alt.titleMarathi || '');
      setDepartment(alt.department);
      setDepartmentMarathi(alt.departmentMarathi || '');
      setPostsCount(alt.postsCount || 100);
      setEligibility(alt.eligibility || 'Graduate');
      setSalary(alt.salary || 'As per norms');
      setLastDate(alt.lastDate || '2026-12-31');
      setApplyUrl(alt.applyUrl || '');
      setNotificationPdfUrl(alt.notificationPdfUrl || '');
      setStatus(alt.status || 'active');
      setIsHot(!!alt.isHot);
    } else {
      setEditingAlert(null);
      setTitle('');
      setTitleMarathi('');
      setDepartment('Maharashtra State Govt');
      setDepartmentMarathi('महाराष्ट्र शासन');
      setPostsCount(500);
      setEligibility('Graduate');
      setSalary('₹25,000 - ₹80,000');
      setLastDate('2026-06-30');
      setApplyUrl('');
      setNotificationPdfUrl('');
      setStatus('active');
      setIsHot(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      titleMarathi,
      department,
      departmentMarathi,
      postsCount: Number(postsCount),
      eligibility,
      salary,
      lastDate,
      applyUrl: applyUrl || undefined,
      notificationPdfUrl: notificationPdfUrl || undefined,
      status,
      isHot,
    };

    try {
      if (editingAlert) {
        await api.updateAdminAlert(editingAlert.id, payload);
      } else {
        await api.createAdminAlert(payload);
      }
      setIsModalOpen(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save alert', err);
      alert('Failed to save recruitment alert');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete alert "${name}"?`)) return;
    try {
      await api.deleteAdminAlert(id);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete alert', err);
      alert('Failed to delete alert');
    }
  };

  const filtered = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.titleMarathi && a.titleMarathi.includes(search)) ||
      a.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Mission Vardi & Maharashtra Govt Recruitment Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Post and update official government bharti notifications, application deadlines, and vacancy counts
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Bharti Alert</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bharti alerts by department or post title..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((alt) => (
          <div
            key={alt.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700">
                  {alt.department}
                </span>
                <div className="flex items-center gap-1">
                  {alt.isHot && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-rose-100 text-rose-700 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-rose-600" /> HOT
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded capitalize ${
                    alt.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                    alt.status === 'upcoming' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {alt.status}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{alt.title}</h3>
              {alt.titleMarathi && (
                <p className="text-xs text-slate-500 font-devanagari mt-0.5">{alt.titleMarathi}</p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl my-3">
                <div>Vacancies: <strong className="text-indigo-600">{alt.postsCount} Posts</strong></div>
                <div>Last Date: <strong className="text-rose-600">{alt.lastDate}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {alt.applyUrl ? (
                <a
                  href={alt.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Apply Link</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Offline / No URL</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(alt)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(alt.id, alt.title)}
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
              <h3 className="font-bold text-sm">{editingAlert ? 'Edit Bharti Alert' : 'Publish New Recruitment Alert'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department (English) *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Maharashtra Police"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department (मराठी विभाग) *</label>
                  <input
                    type="text"
                    required
                    value={departmentMarathi}
                    onChange={(e) => setDepartmentMarathi(e.target.value)}
                    placeholder="उदा. महाराष्ट्र पोलीस भरती कक्ष"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alert Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maharashtra Police Constable 17,471 Vacancies 2026"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alert Title (मराठी शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={titleMarathi}
                  onChange={(e) => setTitleMarathi(e.target.value)}
                  placeholder="उदा. महाराष्ट्र पोलीस शिपाई १७,४७१ पदांची मेगा भरती जाहिरात"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-devanagari"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Posts Count</label>
                  <input
                    type="number"
                    value={postsCount}
                    onChange={(e) => setPostsCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="active">🟢 Active</option>
                    <option value="upcoming">🟡 Upcoming</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hot / Urgent</label>
                  <select
                    value={isHot ? 'yes' : 'no'}
                    onChange={(e) => setIsHot(e.target.value === 'yes')}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="no">Normal</option>
                    <option value="yes">🔥 Hot / Mega Bharti</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Date to Apply *</label>
                  <input
                    type="date"
                    required
                    value={lastDate}
                    onChange={(e) => setLastDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. ₹21,700 - ₹69,100"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Apply Link</label>
                <input
                  type="url"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://mahapolice.gov.in"
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
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
