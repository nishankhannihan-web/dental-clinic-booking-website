import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, RefreshCw, Sparkles, KeyRound, Database, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onBackToWebsite: () => void;
  onOpenSetupHelper: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWebsite, onOpenSetupHelper }) => {
  const { signInAsAdmin, authError, clearAuthError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signInAsAdmin(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      setLocalError(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 sm:left-12">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dental Staff Portal
        </h2>
        <p className="text-xs text-slate-400">
          Authorized clinical staff & practice management login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          
          {/* Supabase status banner if not configured yet */}
          {!configured && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs space-y-2 text-left">
              <div className="flex items-center space-x-2 font-bold">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Supabase Configuration Notice</span>
              </div>
              <p className="text-amber-200/90 text-[11px] leading-relaxed">
                Connect your Supabase project in AI Studio settings with <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white">VITE_SUPABASE_URL</code> and <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white">VITE_SUPABASE_ANON_KEY</code>.
              </p>
              <button
                type="button"
                onClick={onOpenSetupHelper}
                className="text-[11px] font-bold text-amber-300 hover:text-white underline block"
              >
                View SQL Schema & Setup Guide →
              </button>
            </div>
          )}

          {/* Error Alert */}
          {(localError || authError) && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-3 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Authentication Error</span>
                <span className="text-rose-200/90 block">{localError || authError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luminadental.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              {isSubmitting || isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials & RBAC...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Setup Guide Link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onOpenSetupHelper}
              className="text-xs text-slate-400 hover:text-teal-400 inline-flex items-center space-x-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Supabase SQL Setup & Admin Instructions</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
