import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addDays, 
  isSameDay, 
  startOfToday
} from 'date-fns';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CalendarPlus, 
  RefreshCw 
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { generateAvailableTimeSlots, formatDateForDb } from '../../lib/availability';
import type { Service, TimeSlot, Appointment } from '../../types/database';

interface BookingSectionProps {
  preselectedServiceId?: string | null;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ preselectedServiceId }) => {
  const { 
    activeServices, 
    clinicSettings, 
    businessHours, 
    blockedDates, 
    appointments, 
    createAppointment 
  } = useClinic();

  // Booking Flow Steps: 1 = Service, 2 = Date & Slot, 3 = Patient Info, 4 = Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Patient Info Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Auto-select preselected service if passed
  useEffect(() => {
    if (preselectedServiceId) {
      const match = activeServices.find((s) => s.id === preselectedServiceId);
      if (match) {
        setSelectedServiceId(match.id);
        setStep(2);
      }
    } else if (activeServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(activeServices[0].id);
    }
  }, [preselectedServiceId, activeServices, selectedServiceId]);

  const selectedService: Service | undefined = useMemo(() => {
    return activeServices.find((s) => s.id === selectedServiceId);
  }, [activeServices, selectedServiceId]);

  // Generate 21 selectable upcoming days
  const upcomingDays = useMemo(() => {
    const today = startOfToday();
    const days: Date[] = [];
    for (let i = 0; i < 21; i++) {
      days.push(addDays(today, i));
    }
    return days;
  }, []);

  // Compute available time slots for the chosen date and service
  const availableSlots = useMemo(() => {
    if (!selectedService) return [];

    return generateAvailableTimeSlots({
      targetDate: selectedDate,
      service: selectedService,
      clinicSettings,
      businessHoursList: businessHours,
      blockedDatesList: blockedDates,
      existingAppointments: appointments,
      now: new Date(),
    });
  }, [selectedDate, selectedService, clinicSettings, businessHours, blockedDates, appointments]);

  // Reset selected slot when date or service changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate, selectedServiceId]);

  // Check if a day is blocked or closed
  const isDateUnavailable = (date: Date): { blocked: boolean; closed: boolean } => {
    const dateStr = formatDateForDb(date);
    const isBlocked = blockedDates.some((bd) => bd.blocked_date === dateStr);
    const daySchedule = businessHours.find((bh) => bh.weekday === date.getDay());
    const isClosed = !daySchedule || !daySchedule.is_open;
    return { blocked: isBlocked, closed: isClosed };
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setStep(2);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToDetails = () => {
    if (!selectedSlot) return;
    setStep(3);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) {
      setSubmitError('Please choose a valid service and time slot.');
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please fill in your full name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const apptData = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service_id: selectedService.id,
      appointment_date: formatDateForDb(selectedDate),
      start_time: selectedSlot.startTimeStr,
      end_time: selectedSlot.endTimeStr,
      status: 'pending' as const,
      notes: notes.trim() ? notes.trim() : null,
    };

    const res = await createAppointment(apptData);

    setIsSubmitting(false);

    if (res.success && res.data) {
      setConfirmedAppointment(res.data);
      setStep(4);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#14b8a6', '#0284c7', '#38bdf8'],
        });
      } catch (err) {
        // ignore confetti errors
      }
    } else {
      setSubmitError(res.error || 'Failed to submit appointment request. Please try again.');
    }
  };

  const handleResetBooking = () => {
    setStep(1);
    setSelectedSlot(null);
    setConfirmedAppointment(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    if (!confirmedAppointment || !selectedService) return '#';
    const dateStr = (confirmedAppointment.appointment_date || '').replace(/-/g, '');
    const startStr = (confirmedAppointment.start_time || '090000').replace(/:/g, '');
    const endStr = (confirmedAppointment.end_time || '094500').replace(/:/g, '');
    const text = encodeURIComponent(`Dental Appointment: ${selectedService.name}`);
    const details = encodeURIComponent(
      `Appointment with ${clinicSettings.clinic_name}\nAddress: ${clinicSettings.clinic_address}\nPhone: ${clinicSettings.clinic_phone}`
    );
    const location = encodeURIComponent(clinicSettings.clinic_address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dateStr}T${startStr}Z/${dateStr}T${endStr}Z&details=${details}&location=${location}`;
  };

  return (
    <section
      id="booking"
      className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wider uppercase border border-teal-200/50 dark:border-teal-800/50">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Online Patient Scheduling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Schedule your appointment in minutes.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            Real-time availability directly synchronized with our clinic calendar.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button
              onClick={() => step > 1 && step < 4 && setStep(1)}
              className={`pb-2 border-b-2 transition-all flex flex-col items-center space-y-1 ${
                step === 1
                  ? 'border-teal-700 dark:border-teal-400 text-teal-900 dark:text-teal-300 font-bold'
                  : step > 1
                  ? 'border-teal-500 dark:border-teal-600 text-teal-700 dark:text-teal-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Select Service</span>
            </button>

            <button
              onClick={() => step > 2 && step < 4 && setStep(2)}
              className={`pb-2 border-b-2 transition-all flex flex-col items-center space-y-1 ${
                step === 2
                  ? 'border-teal-700 dark:border-teal-400 text-teal-900 dark:text-teal-300 font-bold'
                  : step > 2
                  ? 'border-teal-500 dark:border-teal-600 text-teal-700 dark:text-teal-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Date & Time</span>
            </button>

            <button
              onClick={() => step > 3 && step < 4 && setStep(3)}
              className={`pb-2 border-b-2 transition-all flex flex-col items-center space-y-1 ${
                step === 3
                  ? 'border-teal-700 dark:border-teal-400 text-teal-900 dark:text-teal-300 font-bold'
                  : step > 3
                  ? 'border-teal-500 dark:border-teal-600 text-teal-700 dark:text-teal-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Your Details</span>
            </button>

            <div
              className={`pb-2 border-b-2 transition-all flex flex-col items-center space-y-1 ${
                step === 4
                  ? 'border-teal-700 dark:border-teal-400 text-teal-900 dark:text-teal-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-[10px] font-bold">4</span>
              <span>Confirmed</span>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors duration-200">
          
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 1: Choose Your Dental Service</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select the type of care you need for your upcoming visit.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeServices.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleServiceSelect(srv.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left ${
                        isSelected
                          ? 'border-teal-600 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{srv.name}</h4>
                          <span className="text-sm font-bold text-teal-800 dark:text-teal-300 shrink-0 ml-2">
                            ${Number(srv.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {srv.description || 'Professional dental care and clinical assessment.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>{srv.duration_minutes} minutes</span>
                        </div>
                        <span className={`font-bold ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'}`}>
                          {isSelected ? '✓ Selected' : 'Choose →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={!selectedServiceId}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center space-x-2 transition-all"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE & TIME */}
          {step === 2 && selectedService && (
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 2: Select Date & Time</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Scheduling for: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedService.name}</span> ({selectedService.duration_minutes} mins)
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Service</span>
                </button>
              </div>

              {/* Horizontal Date Picker Strip */}
              <div className="space-y-3 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                  Select an Available Day
                </label>
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                  {upcomingDays.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const { blocked, closed } = isDateUnavailable(day);
                    const isDisabled = blocked || closed;

                    return (
                      <button
                        key={day.toISOString()}
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center justify-center p-3 min-w-[76px] rounded-2xl border transition-all text-center shrink-0 ${
                          isSelected
                            ? 'border-teal-700 dark:border-teal-400 bg-teal-700 dark:bg-teal-600 text-white shadow-md'
                            : isDisabled
                            ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/40 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-teal-100' : 'text-slate-400 dark:text-slate-400'}`}>
                          {format(day, 'EEE')}
                        </span>
                        <span className="text-lg font-extrabold my-0.5">
                          {format(day, 'd')}
                        </span>
                        <span className={`text-[10px] font-medium ${isSelected ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {isDisabled ? (blocked ? 'Blocked' : 'Closed') : format(day, 'MMM')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Slots Grid */}
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                    Available Time Slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {availableSlots.length} available {availableSlots.length === 1 ? 'slot' : 'slots'}
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-2">
                    <AlertCircle className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto" />
                    <p className="font-semibold text-sm">No available time slots for this date.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      The clinic may be fully booked, closed, or the slot buffer limit has been reached. Please pick another date above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.label === slot.label;
                      return (
                        <button
                          key={slot.label}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                            isSelected
                              ? 'border-teal-700 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 ring-2 ring-teal-600 dark:ring-teal-500 ring-offset-1 dark:ring-offset-slate-900 font-bold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-400'}`} />
                          <span>{slot.label.split(' – ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  disabled={!selectedSlot}
                  onClick={handleProceedToDetails}
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center space-x-2 transition-all"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT INFORMATION & SUMMARY */}
          {step === 3 && selectedService && selectedSlot && (
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 3: Patient Information</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please enter your contact information for appointment confirmation.</p>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="patient-name-input"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="patient-email-input"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="patient-phone-input"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 000-0000"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Dental Health Notes / Symptoms (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <textarea
                          id="patient-notes-input"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Tell us about tooth sensitivity, insurance details, or specific concerns..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        id="submit-booking-button"
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center space-x-2 transition-all active:scale-98"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Confirming Visit...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm & Request Appointment</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Appointment Summary Card */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-left">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
                    Appointment Summary
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Service</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedService.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Date</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {format(selectedDate, 'EEE, MMM d, yyyy')}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Time</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedSlot.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Duration</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedService.duration_minutes} mins</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Estimated Fee</span>
                        <span className="font-bold text-teal-800 dark:text-teal-300">${Number(selectedService.price).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Clinic Location</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {clinicSettings.clinic_address}
                      </p>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold mt-1">
                        Tel: {clinicSettings.clinic_phone}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 leading-relaxed">
                    ✨ No payment is charged today. Fees are settled upon completion of your clinical visit.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Thank you, <span className="font-bold text-slate-800 dark:text-white">{fullName}</span>. We have scheduled your visit at {clinicSettings.clinic_name}. A confirmation email has been logged.
                </p>
              </div>

              {/* Receipt / Confirmation Card */}
              <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    Confirmed / Received
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Service:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Date:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Time:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedSlot?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Patient:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Phone:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Clinic:</span> {clinicSettings.clinic_name} — {clinicSettings.clinic_address}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center space-x-2 transition-all shadow-xs"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  onClick={handleResetBooking}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  Book Another Visit
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
