import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Hourglass, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Save,
  ShieldCheck
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const AdminClinicSettings: React.FC = () => {
  const { clinicSettings, updateClinicSettings } = useClinic();

  const [clinicName, setClinicName] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState<number>(30);
  const [bookingNoticeHours, setBookingNoticeHours] = useState<number>(2);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinicSettings) {
      setClinicName(clinicSettings.clinic_name || 'Lumina Dental Studio');
      setClinicEmail(clinicSettings.clinic_email || 'care@luminadental.com');
      setClinicPhone(clinicSettings.clinic_phone || '+1 (555) 234-8900');
      setClinicAddress(clinicSettings.clinic_address || '742 Evergreen Terrace, Suite 300, Medical District');
      setSlotIntervalMinutes(clinicSettings.slot_interval_minutes || 30);
      setBookingNoticeHours(clinicSettings.booking_notice_hours || 2);
    }
  }, [clinicSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim()) {
      setError('Please provide a clinic name.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const payload = {
      clinic_name: clinicName.trim(),
      clinic_email: clinicEmail.trim(),
      clinic_phone: clinicPhone.trim(),
      clinic_address: clinicAddress.trim(),
      slot_interval_minutes: Number(slotIntervalMinutes) || 30,
      booking_notice_hours: Number(bookingNoticeHours) || 2,
    };

    const result = await updateClinicSettings(payload);
    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to update clinic settings.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Clinic Profile & Booking Engine Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Updates made here immediately propagate to the public website, booking engine calculations, and patient confirmation communications.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Clinic settings saved successfully and live on the website.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Practice Identity Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Practice Business Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Clinic Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-clinic-name-input"
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Lumina Dental Studio"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Practice Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-clinic-email-input"
                  type="email"
                  required
                  value={clinicEmail}
                  onChange={(e) => setClinicEmail(e.target.value)}
                  placeholder="care@luminadental.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Practice Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-clinic-phone-input"
                  type="text"
                  required
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  placeholder="+1 (555) 234-8900"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Physical Clinic Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-clinic-address-input"
                  type="text"
                  required
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace, Suite 300, Medical District"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling Engine Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Scheduling Engine Rules & Slot Calculation</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Slot Interval Step (Minutes)
              </label>
              <p className="text-[11px] text-slate-500">
                Frequency at which candidate start times are generated (e.g. every 15, 30, or 45 minutes).
              </p>
              <div className="relative pt-1">
                <Hourglass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="settings-interval-select"
                  value={slotIntervalMinutes}
                  onChange={(e) => setSlotIntervalMinutes(parseInt(e.target.value, 10))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Minimum Advance Booking Notice (Hours)
              </label>
              <p className="text-[11px] text-slate-500">
                Prevents patients from booking slots that start sooner than this buffer window.
              </p>
              <div className="relative pt-1">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="settings-notice-select"
                  value={bookingNoticeHours}
                  onChange={(e) => setBookingNoticeHours(parseInt(e.target.value, 10))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value={0}>0 Hours (Immediate same-day)</option>
                  <option value={1}>1 Hour in advance</option>
                  <option value={2}>2 Hours in advance (Recommended)</option>
                  <option value={4}>4 Hours in advance</option>
                  <option value={12}>12 Hours in advance</option>
                  <option value={24}>24 Hours in advance (Next-day only)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            id="save-clinic-settings-btn"
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center space-x-2 active:scale-98 transition-all"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Practice Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Practice Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
