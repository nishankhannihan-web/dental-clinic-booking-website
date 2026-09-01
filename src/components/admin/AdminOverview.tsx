import React from 'react';
import { 
  CalendarCheck2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  User, 
  ArrowRight, 
  Plus, 
  CalendarOff,
  Phone,
  Mail
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { AdminTab } from './AdminLayout';
import { format, isToday, parseISO } from 'date-fns';

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { appointments, services, activeServices, updateAppointmentStatus } = useClinic();

  const pendingAppts = appointments.filter((a) => a.status === 'pending');
  const confirmedAppts = appointments.filter((a) => a.status === 'confirmed');
  const completedAppts = appointments.filter((a) => a.status === 'completed');
  const cancelledAppts = appointments.filter((a) => a.status === 'cancelled');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysAppointments = appointments.filter((a) => a.appointment_date === todayStr);

  const recentPending = pendingAppts.slice(0, 5);

  return (
    <div className="space-y-8 text-left">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Pending Card */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Action</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {pendingAppts.length}
            </span>
            <p className="text-xs text-slate-500 mt-1">Awaiting staff review</p>
          </div>
        </div>

        {/* Confirmed Card */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Confirmed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {confirmedAppts.length}
            </span>
            <p className="text-xs text-slate-500 mt-1">Upcoming scheduled visits</p>
          </div>
        </div>

        {/* Completed Card */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {completedAppts.length}
            </span>
            <p className="text-xs text-slate-500 mt-1">Finished clinical visits</p>
          </div>
        </div>

        {/* Active Services Card */}
        <div 
          onClick={() => onNavigateTab('services')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Active Services</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {activeServices.length} <span className="text-xs font-normal text-slate-400">/ {services.length}</span>
            </span>
            <p className="text-xs text-slate-500 mt-1">Treatments visible online</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Schedule & Quick Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pending Requests Requiring Approval */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Appointment Requests</h3>
              <p className="text-xs text-slate-500">Patients waiting for confirmation</p>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentPending.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-slate-700">All caught up!</p>
              <p>No pending appointment requests at this moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{appt.full_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-800">
                      {appt.service?.name || 'General Dental Consultation'}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span>📅 {appt.appointment_date}</span>
                      <span>⏰ {appt.start_time ? appt.start_time.slice(0, 5) : '--:--'} - {appt.end_time ? appt.end_time.slice(0, 5) : '--:--'}</span>
                      <span>📞 {appt.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Schedule & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Clinic Schedule</h3>
                <p className="text-xs text-slate-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800">
                {todaysAppointments.length} Today
              </span>
            </div>

            {todaysAppointments.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <Clock className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p>No appointments booked for today.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {todaysAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{appt.full_name}</span>
                      <span className="text-slate-500 block truncate max-w-[160px]">{appt.service?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800 block">
                        {appt.start_time ? appt.start_time.slice(0, 5) : '--:--'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${
                        appt.status === 'confirmed' ? 'text-emerald-700' :
                        appt.status === 'completed' ? 'text-slate-500' :
                        appt.status === 'cancelled' ? 'text-rose-600' : 'text-amber-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Practice Actions
            </h4>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => onNavigateTab('services')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex flex-col items-start space-y-1 text-left transition-colors"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold">New Service</span>
              </button>

              <button
                onClick={() => onNavigateTab('blocked')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex flex-col items-start space-y-1 text-left transition-colors"
              >
                <CalendarOff className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold">Block Date</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
