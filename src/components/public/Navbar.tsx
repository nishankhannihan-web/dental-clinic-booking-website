import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, MapPin, Menu, X } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onNavigateToBooking: (serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToBooking }) => {
  const { clinicSettings, businessHours } = useClinic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if clinic is currently open today
  const todayWeekday = new Date().getDay();
  const todayHours = businessHours.find((h) => h.weekday === todayWeekday);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100 dark:border-slate-800'
          : 'bg-gradient-to-b from-white/90 dark:from-slate-900/90 via-white/80 dark:via-slate-900/80 to-transparent backdrop-blur-sm py-4'
      }`}
    >
      {/* Top micro-bar for quick contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 hidden md:flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100/80 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="truncate max-w-sm">{clinicSettings.clinic_address}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>
              Today:{' '}
              {todayHours && todayHours.is_open && todayHours.start_time && todayHours.end_time
                ? `${todayHours.start_time.slice(0, 5)} - ${todayHours.end_time.slice(0, 5)}`
                : 'Closed Today'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <a
            href={`tel:${clinicSettings.clinic_phone}`}
            className="flex items-center space-x-1.5 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors font-semibold"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{clinicSettings.clinic_phone}</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
            {/* Minimalist tooth & sparkle icon */}
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1 5.5 2 9 0.7 2.5 1.5 5 4 5s3.3-2.5 4-5c1-3.5 2-6.5 2-9 0-3.5-2.5-6-6-6zm0 2.2c2.4 0 4 1.8 4 4.3 0 2.2-0.9 5.2-1.9 8.5-0.5 1.8-1.2 3.5-2.1 3.5s-1.6-1.7-2.1-3.5C8.9 13.7 8 10.7 8 8.5c0-2.5 1.6-4.3 4-4.3z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
              {clinicSettings.clinic_name || 'Lumina Dental Studio'}
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-teal-700 dark:text-teal-400 block">
              Modern Clinical Dentistry
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#services" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
            Services & Treatments
          </a>
          <a href="#about" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
            Why Lumina
          </a>
          <a href="#booking" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
            Book Online
          </a>
          <a href="#hours" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
            Hours & Location
          </a>
        </nav>

        {/* Desktop Actions: Order is Navigation Links -> Theme Toggle -> Book Appointment */}
        <div className="hidden sm:flex items-center space-x-3">
          <ThemeToggle id="desktop-theme-toggle" />
          <button
            id="nav-book-btn"
            onClick={() => onNavigateToBooking()}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-semibold text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 active:scale-98 transition-all duration-150"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-2 lg:hidden">
          <ThemeToggle id="mobile-topbar-theme-toggle" />
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-800 dark:hover:text-teal-300"
            >
              Services & Treatments
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-800 dark:hover:text-teal-300"
            >
              Why Lumina
            </a>
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-800 dark:hover:text-teal-300"
            >
              Book Online
            </a>
            <a
              href="#hours"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-800 dark:hover:text-teal-300"
            >
              Hours & Location
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Theme</span>
              <ThemeToggle id="mobile-drawer-theme-toggle" showLabels />
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToBooking();
              }}
              className="w-full py-3 rounded-xl bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 text-white font-semibold flex items-center justify-center space-x-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
