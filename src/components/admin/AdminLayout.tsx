import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Stethoscope, 
  Clock, 
  CalendarOff, 
  SlidersHorizontal, 
  LogOut, 
  ArrowLeft, 
  Database, 
  ShieldCheck, 
  Menu, 
  X, 
  RefreshCw, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClinic } from '../../context/ClinicContext';

export type AdminTab = 'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToWebsite: () => void;
  onOpenSetupHelper: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToWebsite,
  onOpenSetupHelper,
  children,
}) => {
  const { user, signOut } = useAuth();
  const { clinicSettings, appointments, refreshClinicData, isLoading } = useClinic();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshClinicData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments' as AdminTab, label: 'Appointments', icon: CalendarCheck2, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'services' as AdminTab, label: 'Dental Services', icon: Stethoscope },
    { id: 'hours' as AdminTab, label: 'Business Hours', icon: Clock },
    { id: 'blocked' as AdminTab, label: 'Blocked Dates', icon: CalendarOff },
    { id: 'settings' as AdminTab, label: 'Clinic Settings', icon: SlidersHorizontal },
  ];

  const handleNavClick = (tabId: AdminTab) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold shadow-md shadow-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-white text-sm block truncate">
                {clinicSettings.clinic_name || 'Lumina Dental'}
              </span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
                Practice Management
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Practice Administration
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-teal-800' : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Links */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onOpenSetupHelper}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-slate-800/60 transition-colors"
          >
            <Database className="w-4 h-4 text-teal-500 shrink-0" />
            <span>Database & SQL Guide</span>
          </button>

          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>View Public Website</span>
          </button>

          {/* User Auth Profile card */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-white truncate max-w-[120px]">
                {user?.email || 'Admin Staff'}
              </p>
              <span className="text-[9px] text-teal-400 font-mono block">
                ID: {user?.id ? user.id.slice(0, 8) : 'active'}...
              </span>
            </div>

            <button
              id="admin-logout-btn"
              onClick={() => signOut()}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm truncate max-w-[180px]">
            {clinicSettings.clinic_name}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <button onClick={onBackToWebsite} className="hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <button onClick={() => signOut()} className="text-rose-400 hover:underline flex items-center space-x-1">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top bar on Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-extrabold text-slate-900 capitalize">
              {navItems.find((n) => n.id === currentTab)?.label || 'Dashboard'}
            </h1>
            <span className="text-xs text-slate-400 font-medium">|</span>
            <span className="text-xs text-slate-500 font-medium">
              Live practice operational data
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
            </button>

            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
