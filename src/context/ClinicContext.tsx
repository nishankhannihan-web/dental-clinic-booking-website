import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Appointment, BlockedDate, BusinessHours, ClinicSettings, Service } from '../types/database';

interface ClinicContextType {
  clinicSettings: ClinicSettings;
  services: Service[];
  activeServices: Service[];
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  refreshClinicData: () => Promise<void>;
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'service'>) => Promise<{ success: boolean; data?: Appointment; error?: string }>;
  updateClinicSettings: (settings: Partial<ClinicSettings>) => Promise<{ success: boolean; error?: string }>;
  addService: (serviceData: Omit<Service, 'id' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<{ success: boolean; error?: string }>;
  toggleServiceStatus: (id: string, is_active: boolean) => Promise<{ success: boolean; error?: string }>;
  updateBusinessHours: (hoursList: BusinessHours[]) => Promise<{ success: boolean; error?: string }>;
  addBlockedDate: (blocked_date: string, reason: string) => Promise<{ success: boolean; error?: string }>;
  removeBlockedDate: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  id: 'default-settings',
  clinic_name: 'Lumina Dental Studio',
  clinic_email: 'care@luminadental.com',
  clinic_phone: '+1 (555) 234-8900',
  clinic_address: '742 Evergreen Terrace, Suite 300, Medical District',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
  created_at: new Date().toISOString(),
};

const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  { id: '1', weekday: 0, is_open: false, start_time: '10:00:00', end_time: '15:00:00' }, // Sun
  { id: '2', weekday: 1, is_open: true, start_time: '08:30:00', end_time: '18:00:00' },  // Mon
  { id: '3', weekday: 2, is_open: true, start_time: '08:30:00', end_time: '18:00:00' },  // Tue
  { id: '4', weekday: 3, is_open: true, start_time: '08:30:00', end_time: '18:00:00' },  // Wed
  { id: '5', weekday: 4, is_open: true, start_time: '08:30:00', end_time: '18:00:00' },  // Thu
  { id: '6', weekday: 5, is_open: true, start_time: '08:30:00', end_time: '17:00:00' },  // Fri
  { id: '7', weekday: 6, is_open: true, start_time: '09:00:00', end_time: '15:00:00' },  // Sat
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Comprehensive Dental Exam & Digital X-Rays',
    description: 'In-depth clinical assessment with high-definition digital panoramic radiographs and periodontal health screening.',
    duration_minutes: 45,
    price: 140.00,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's2',
    name: 'Gentle Ultrasonic Hygiene & Polishing',
    description: 'Deep gentle prophylaxis removing plaque, calculus, and surface discoloration with air-flow polishing.',
    duration_minutes: 45,
    price: 120.00,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's3',
    name: 'Advanced In-Office Laser Teeth Whitening',
    description: 'Medical-grade cold laser light technology lifting stubborn stains up to 8 shades in a single comfortable session.',
    duration_minutes: 60,
    price: 290.00,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's4',
    name: 'Biocompatible Composite Tooth Restoration',
    description: 'Seamless, tooth-colored aesthetic resin filling restoring structural integrity with undetectable natural finish.',
    duration_minutes: 45,
    price: 175.00,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's5',
    name: 'Urgent Dental Consultation & Pain Relief',
    description: 'Priority same-day diagnostic evaluation and targeted palliative relief for acute discomfort or chipped teeth.',
    duration_minutes: 30,
    price: 95.00,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 's6',
    name: 'Cosmetic Smile Design & Porcelain Veneers Consultation',
    description: 'Personalized digital smile simulation and comprehensive cosmetic restoration planning.',
    duration_minutes: 45,
    price: 150.00,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(DEFAULT_CLINIC_SETTINGS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(DEFAULT_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClinicData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch Clinic Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('clinic_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!settingsError && settingsData) {
        setClinicSettings(settingsData);
      }

      // 2. Fetch Services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!servicesError && servicesData && servicesData.length > 0) {
        setServices(servicesData);
      }

      // 3. Fetch Business Hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('business_hours')
        .select('*')
        .order('weekday', { ascending: true });

      if (!hoursError && hoursData && hoursData.length > 0) {
        const sanitizedHours = hoursData.map((h) => ({
          ...h,
          start_time: h.start_time || '08:30:00',
          end_time: h.end_time || '17:30:00',
        }));
        setBusinessHours(sanitizedHours);
      }

      // 4. Fetch Blocked Dates
      const { data: blockedData, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (!blockedError && blockedData) {
        setBlockedDates(blockedData);
      }

      // 5. Fetch Appointments with joined service
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:service_id (
            id,
            name,
            duration_minutes,
            price
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: true });

      if (!apptError && appointmentsData) {
        const sanitizedAppts = appointmentsData.map((a) => ({
          ...a,
          start_time: a.start_time || '09:00:00',
          end_time: a.end_time || '09:45:00',
        }));
        setAppointments(sanitizedAppts);
      }
    } catch (err: unknown) {
      console.error('Error loading clinic database records:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinicData();
  }, [fetchClinicData]);

  // Create Appointment
  const createAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'created_at' | 'service'>
  ): Promise<{ success: boolean; data?: Appointment; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Local fallback simulation if Supabase is still connecting
      const newAppt: Appointment = {
        ...appointmentData,
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        service: services.find((s) => s.id === appointmentData.service_id) || null,
      };
      setAppointments((prev) => [newAppt, ...prev]);
      return { success: true, data: newAppt };
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          service:service_id (
            id,
            name,
            duration_minutes,
            price
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setAppointments((prev) => [data, ...prev]);
        return { success: true, data };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to book appointment';
      return { success: false, error: msg };
    }
  };

  // Update Clinic Settings
  const updateClinicSettings = async (
    settings: Partial<ClinicSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      setClinicSettings((prev) => ({ ...prev, ...settings }));
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .update(settings)
        .eq('id', clinicSettings.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setClinicSettings(data);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update clinic settings';
      return { success: false, error: msg };
    }
  };

  // Add Service
  const addService = async (
    serviceData: Omit<Service, 'id' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      const newService: Service = {
        ...serviceData,
        id: 'srv-' + Date.now(),
        created_at: new Date().toISOString(),
      };
      setServices((prev) => [...prev, newService]);
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setServices((prev) => [...prev, data]);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add service';
      return { success: false, error: msg };
    }
  };

  // Update Service
  const updateService = async (
    id: string,
    serviceData: Partial<Service>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s))
      );
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setServices((prev) => prev.map((s) => (s.id === id ? data : s)));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update service';
      return { success: false, error: msg };
    }
  };

  // Toggle Service Status (Active / Deactivated)
  const toggleServiceStatus = async (
    id: string,
    is_active: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    return updateService(id, { is_active });
  };

  // Update Business Hours
  const updateBusinessHours = async (
    hoursList: BusinessHours[]
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      setBusinessHours(hoursList);
      return { success: true };
    }

    try {
      const updates = hoursList.map((h) => ({
        id: h.id,
        weekday: h.weekday,
        is_open: h.is_open,
        start_time: h.start_time,
        end_time: h.end_time,
      }));

      const { data, error } = await supabase
        .from('business_hours')
        .upsert(updates, { onConflict: 'weekday' })
        .select();

      if (error) throw error;
      if (data) {
        setBusinessHours(data.sort((a, b) => a.weekday - b.weekday));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update business hours';
      return { success: false, error: msg };
    }
  };

  // Add Blocked Date
  const addBlockedDate = async (
    blocked_date: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      const newBlocked: BlockedDate = {
        id: 'blk-' + Date.now(),
        blocked_date,
        reason,
        created_at: new Date().toISOString(),
      };
      setBlockedDates((prev) => [...prev, newBlocked].sort((a, b) => a.blocked_date.localeCompare(b.blocked_date)));
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert([{ blocked_date, reason }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBlockedDates((prev) => [...prev, data].sort((a, b) => a.blocked_date.localeCompare(b.blocked_date)));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to block date';
      return { success: false, error: msg };
    }
  };

  // Remove Blocked Date
  const removeBlockedDate = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove blocked date';
      return { success: false, error: msg };
    }
  };

  // Update Appointment Status
  const updateAppointmentStatus = async (
    id: string,
    status: Appointment['status']
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          service:service_id (
            id,
            name,
            duration_minutes,
            price
          )
        `)
        .single();

      if (error) throw error;
      if (data) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update appointment status';
      return { success: false, error: msg };
    }
  };

  const activeServices = services.filter((s) => s.is_active);

  return (
    <ClinicContext.Provider
      value={{
        clinicSettings,
        services,
        activeServices,
        businessHours,
        blockedDates,
        appointments,
        isLoading,
        error,
        refreshClinicData: fetchClinicData,
        createAppointment,
        updateClinicSettings,
        addService,
        updateService,
        toggleServiceStatus,
        updateBusinessHours,
        addBlockedDate,
        removeBlockedDate,
        updateAppointmentStatus,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
