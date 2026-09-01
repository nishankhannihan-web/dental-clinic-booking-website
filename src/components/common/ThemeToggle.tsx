import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  id?: string;
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'theme-toggle-btn',
  className = '',
  showLabels = false,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onClick={toggleTheme}
      className={`group relative inline-flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 select-none ${
        isDark
          ? 'bg-slate-800 border border-slate-700/80 hover:border-teal-500/70 shadow-inner'
          : 'bg-slate-100 border border-slate-200/90 hover:border-teal-400/80 shadow-xs'
      } ${showLabels ? 'w-auto px-2.5 h-9 space-x-2' : 'w-14 h-8'} ${className}`}
    >
      {/* Background Icons Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-slate-500 opacity-60' : 'text-amber-500 opacity-100'
          }`}
        />
        <Moon
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-teal-300 opacity-100' : 'text-slate-400 opacity-60'
          }`}
        />
      </div>

      {/* Sliding Active Pill Thumb */}
      <div
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-sm transition-all duration-300 transform ${
          isDark
            ? 'translate-x-6 bg-gradient-to-tr from-teal-600 to-teal-500 text-white shadow-teal-900/30 ring-1 ring-teal-400/30'
            : 'translate-x-0 bg-white text-amber-500 shadow-slate-300/50 ring-1 ring-slate-200/60'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 stroke-[2.2] animate-in fade-in zoom-in-75 duration-200" />
        ) : (
          <Sun className="w-3.5 h-3.5 stroke-[2.2] animate-in fade-in zoom-in-75 duration-200" />
        )}
      </div>

      {showLabels && (
        <span className="text-xs font-semibold pl-1 text-slate-700 dark:text-slate-200">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
