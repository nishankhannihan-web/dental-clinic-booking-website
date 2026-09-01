import React, { useState } from 'react';
import { X, Copy, Check, Database, Shield, Terminal, BookOpen, AlertTriangle } from 'lucide-react';
import { SQL_SCHEMA_SETUP, isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseSetupHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupHelperModal: React.FC<SupabaseSetupHelperModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-left max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Setup & SQL Schema</h3>
              <p className="text-xs text-slate-400">Database tables, RLS policies, and Admin authorization instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="space-y-6 overflow-y-auto pr-1 text-xs sm:text-sm text-slate-300">
          
          {/* Section 1: Environment Variables */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">1</span>
              <span>Environment Variables</span>
            </h4>
            <p className="text-xs text-slate-400">
              Set these environment variables in your deployment or <code className="text-teal-300">.env</code>:
            </p>
            <pre className="bg-slate-900 p-3 rounded-xl text-teal-300 text-xs font-mono overflow-x-auto border border-slate-800">
              VITE_SUPABASE_URL=https://xyzcompany.supabase.co&#10;VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
            </pre>
            <div className="text-[11px] text-slate-400">
              Current Status:{' '}
              {configured ? (
                <span className="text-emerald-400 font-bold">✓ Connected</span>
              ) : (
                <span className="text-amber-400 font-bold">⚠️ Using safe client fallback mode</span>
              )}
            </div>
          </div>

          {/* Section 2: SQL Schema Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">2</span>
                <span>Run Schema in Supabase SQL Editor</span>
              </h4>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Open your Supabase project dashboard → <strong>SQL Editor</strong> → Paste and click <strong>RUN</strong>. This creates all 6 tables (<code className="text-teal-300">services</code>, <code className="text-teal-300">appointments</code>, <code className="text-teal-300">business_hours</code>, <code className="text-teal-300">blocked_dates</code>, <code className="text-teal-300">clinic_settings</code>, <code className="text-teal-300">admin_users</code>) and sets up RLS security.
            </p>
            <div className="max-h-48 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 select-all">
              <pre>{SQL_SCHEMA_SETUP}</pre>
            </div>
          </div>

          {/* Section 3: Authorize Admin User */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">3</span>
              <span>Authorize an Admin User</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In Supabase Auth → <strong>Users</strong>, create a user with email & password. Then copy their <code className="text-teal-300">User UID</code> and insert into <code className="text-teal-300">admin_users</code>:
            </p>
            <pre className="bg-slate-900 p-3 rounded-xl text-teal-300 text-xs font-mono overflow-x-auto border border-slate-800">
              insert into admin_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
            </pre>
            <p className="text-[11px] text-amber-300 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Admin access is strictly verified by matching auth.user.id with admin_users.user_id.</span>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
