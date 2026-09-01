/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { BookingSection } from './components/public/BookingSection';
import { HoursSection } from './components/public/HoursSection';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, type AdminTab } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminServices } from './components/admin/AdminServices';
import { AdminBusinessHours } from './components/admin/AdminBusinessHours';
import { AdminBlockedDates } from './components/admin/AdminBlockedDates';
import { AdminClinicSettings } from './components/admin/AdminClinicSettings';
import { SupabaseSetupHelperModal } from './components/admin/SupabaseSetupHelperModal';

const checkIsAdminPath = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.startsWith('/admin') ||
    hash.startsWith('#/admin') ||
    hash.startsWith('#admin') ||
    search.includes('view=admin')
  );
};

const DentalStudioContent: React.FC = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  
  // View states: 'public' | 'admin' - initialized from URL path / hash
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(() =>
    checkIsAdminPath() ? 'admin' : 'public'
  );
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  
  // Setup Guide modal
  const [setupHelperOpen, setSetupHelperOpen] = useState(false);

  // Preselected service when clicking "Book This Service" from services grid
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<string | null>(null);

  // Sync with browser URL changes (e.g. forward/back navigation or hash changes)
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminPath()) {
        setViewMode('admin');
      } else {
        setViewMode('public');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigateToBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceIdForBooking(serviceId);
    }
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToWebsite = () => {
    setViewMode('public');
    if (checkIsAdminPath()) {
      window.history.pushState(null, '', '/');
    }
  };

  // If user requests admin view (/admin/login or /admin)
  if (viewMode === 'admin') {
    // If not authenticated as admin, show Admin Login
    if (!user || !isAdmin) {
      return (
        <>
          <AdminLogin
            onBackToWebsite={handleBackToWebsite}
            onOpenSetupHelper={() => setSetupHelperOpen(true)}
          />
          <SupabaseSetupHelperModal
            isOpen={setupHelperOpen}
            onClose={() => setSetupHelperOpen(false)}
          />
        </>
      );
    }

    // Authenticated Admin Dashboard
    return (
      <>
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          onBackToWebsite={handleBackToWebsite}
          onOpenSetupHelper={() => setSetupHelperOpen(true)}
        >
          {adminTab === 'overview' && <AdminOverview onNavigateTab={setAdminTab} />}
          {adminTab === 'appointments' && <AdminAppointments />}
          {adminTab === 'services' && <AdminServices />}
          {adminTab === 'hours' && <AdminBusinessHours />}
          {adminTab === 'blocked' && <AdminBlockedDates />}
          {adminTab === 'settings' && <AdminClinicSettings />}
        </AdminLayout>

        <SupabaseSetupHelperModal
          isOpen={setupHelperOpen}
          onClose={() => setSetupHelperOpen(false)}
        />
      </>
    );
  }

  // Public Dental Clinic Website
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar onNavigateToBooking={handleNavigateToBooking} />

      <main className="flex-1">
        <Hero onBookClick={() => handleNavigateToBooking()} />
        <ServicesSection onSelectServiceForBooking={handleNavigateToBooking} />
        <AboutSection />
        <BookingSection preselectedServiceId={selectedServiceIdForBooking} />
        <HoursSection />
      </main>

      <Footer />

      <SupabaseSetupHelperModal
        isOpen={setupHelperOpen}
        onClose={() => setSetupHelperOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClinicProvider>
          <DentalStudioContent />
        </ClinicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
