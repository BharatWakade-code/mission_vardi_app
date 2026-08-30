import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, switchDemoRole } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name, email, mobile, password, role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: 'student' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoRole(demoRole);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-6 text-white text-center">
          <button
            id="auth-close-btn"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-7 h-7 text-indigo-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? t('Welcome Back to ParikshaSetu', 'परीक्षा सेतू मध्ये आपले स्वागत आहे') : t('Create Student Account', 'नवीन खाते तयार करा')}
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {t('Prepare for MPSC, Police Bharti, Talathi & Central Govt Exams', 'महाराष्ट्र व केंद्र शासनाच्या सर्व स्पर्धा परीक्षांची तयारी')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
          <button
            id="tab-login-btn"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === 'login' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('Sign In', 'लॉगिन करा')}
          </button>
          <button
            id="tab-register-btn"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === 'register' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('Register', 'नोंदणी करा')}
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Login Chips */}
          <div className="mb-5 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <p className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              {t('1-Click Demo Logins for Instant Testing:', 'जलद चाचणीसाठी डेमो खाती:')}
            </p>
            <div className="flex gap-2">
              <button
                id="quick-student-demo-btn"
                type="button"
                onClick={() => handleQuickDemo('student')}
                disabled={loading}
                className="flex-1 px-2.5 py-1.5 text-xs font-medium bg-white text-indigo-800 border border-indigo-200 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-2xs"
              >
                👤 {t('Student Aspirant', 'विद्यार्थी डेमो')}
              </button>
              <button
                id="quick-admin-demo-btn"
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="flex-1 px-2.5 py-1.5 text-xs font-medium bg-white text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white transition shadow-2xs"
              >
                ⚙️ {t('Admin Portal', 'अॅडमिन डेमो')}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Full Name', 'पूर्ण नाव')} *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Email Address', 'ईमेल पत्ता')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Mobile Number (10 Digits)', 'मोबाईल क्रमांक')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-mobile-input"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Password', 'पासवर्ड')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('Account Role', 'खात्याचा प्रकार')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition ${
                      role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🎓 {t('Student Aspirant', 'विद्यार्थी')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border text-center transition ${
                      role === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ⚙️ {t('Exam Admin / Faculty', 'अॅडमिन')}
                  </button>
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                t('Sign In to Account', 'खात्यामध्ये प्रवेश करा')
              ) : (
                t('Complete Registration', 'नोंदणी पूर्ण करा')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
