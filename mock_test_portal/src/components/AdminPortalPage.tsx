import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdminDashboardView } from './AdminDashboardView';
import {
  Shield,
  Lock,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  LogOut,
  User,
  GraduationCap,
} from 'lucide-react';

interface AdminPortalPageProps {
  onBackToStudentView: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onBackToStudentView }) => {
  const { user, login, logout, isLoading } = useAuth();
  const { t } = useLanguage();

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('admin@parikshasetu.in');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      await login(adminEmail, adminPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoAdminLogin = async () => {
    setLoginError(null);
    setIsSubmitting(true);
    try {
      await login('admin@parikshasetu.in', 'Admin@123');
    } catch (err: any) {
      setLoginError(err.message || 'Demo admin sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is authenticated as an admin, render the full admin dashboard
  if (user && user.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Dedicated Admin Header Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Branding & Route Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base tracking-tight">
                    Pariksha<span className="text-indigo-400">Setu</span> Admin
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-indigo-900/80 text-indigo-300 border border-indigo-700/50">
                    /admin
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Database Live</span>
                  </span>
                  <span>•</span>
                  <span>Faculty & Exam Controller Workspace</span>
                </div>
              </div>
            </div>

            {/* Right: Actions & User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-200 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="block text-[9px] font-bold text-indigo-400 uppercase">
                    Admin Superuser
                  </span>
                </div>
              </div>

              {/* Exit to student portal */}
              <button
                id="admin-exit-to-student-btn"
                onClick={onBackToStudentView}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Go to Student Examination Portal"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit to Student Portal (/)</span>
                <span className="sm:hidden">Exit</span>
              </button>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Viewport */}
        <main className="flex-1 bg-slate-100 text-slate-900">
          <AdminDashboardView onBackToStudentView={onBackToStudentView} />
        </main>
      </div>
    );
  }

  // If user is not admin (or not logged in), render dedicated Admin Authentication Gate
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-indigo-600 selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white mb-2">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pariksha<span className="text-indigo-400">Setu</span> Admin
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-slate-800 text-indigo-300 rounded-md border border-slate-700">
              URL: /admin
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30">
              Restricted Area
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Faculty, Question Bank Creator & System Administrator Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {user && user.role !== 'admin' && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Logged in as Student: {user.name}</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  Your current account does not have faculty/admin privileges. Please sign in with administrator credentials below.
                </p>
              </div>
            </div>
          )}

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Admin Credentials Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                id="admin-email-input"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@parikshasetu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate as Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemoAdminLogin}
              disabled={isSubmitting}
              className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>1-Click Demo Admin Access (admin@parikshasetu.in)</span>
            </button>
          </div>
        </div>

        {/* Back Link to Main Student Portal */}
        <div className="text-center">
          <button
            id="admin-return-home-btn"
            onClick={onBackToStudentView}
            className="text-xs font-bold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Student Examination Portal (/)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
