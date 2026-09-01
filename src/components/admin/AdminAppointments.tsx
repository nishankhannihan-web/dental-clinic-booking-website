import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck2, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Check, 
  ChevronDown, 
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { Appointment } from '../../types/database';

export const AdminAppointments: React.FC = () => {
  const { appointments, updateAppointmentStatus, isLoading } = useClinic();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [selectedAppointmentForNotes, setSelectedAppointmentForNotes] = useState<Appointment | null>(null);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Status filter
      if (statusFilter !== 'all' && appt.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = appt.full_name.toLowerCase().includes(query);
        const matchesEmail = appt.email.toLowerCase().includes(query);
        const matchesPhone = appt.phone.toLowerCase().includes(query);
        const matchesService = appt.service?.name?.toLowerCase().includes(query);
        const matchesDate = appt.appointment_date.includes(query);
        return matchesName || matchesEmail || matchesPhone || matchesService || matchesDate;
      }

      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    await updateAppointmentStatus(id, newStatus);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">Pending</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">Confirmed</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, email, phone, service, or date..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => {
            const count = st === 'all' 
              ? appointments.length 
              : appointments.filter((a) => a.status === st).length;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-teal-900 text-teal-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Appointments Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs space-y-2">
            <CalendarCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No appointments found.</p>
            <p className="text-slate-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or status filter.' 
                : 'Patient bookings will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Patient Name</th>
                  <th className="py-3.5 px-4">Treatment / Service</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Patient */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 text-sm">{appt.full_name}</div>
                      {appt.notes && (
                        <button
                          onClick={() => setSelectedAppointmentForNotes(appt)}
                          className="mt-1 inline-flex items-center space-x-1 text-[11px] text-teal-700 hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Patient Note</span>
                        </button>
                      )}
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">
                        {appt.service?.name || 'General Dental Consultation'}
                      </div>
                      {appt.service?.duration_minutes && (
                        <div className="text-[11px] text-slate-400">
                          {appt.service.duration_minutes} mins · ${Number(appt.service.price || 0).toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{appt.appointment_date}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {appt.start_time ? appt.start_time.slice(0, 5) : '--:--'} - {appt.end_time ? appt.end_time.slice(0, 5) : '--:--'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <a href={`tel:${appt.phone}`} className="flex items-center space-x-1.5 text-slate-700 hover:text-teal-700 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{appt.phone}</span>
                        </a>
                        <a href={`mailto:${appt.email}`} className="flex items-center space-x-1.5 text-slate-500 hover:text-teal-700 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{appt.email}</span>
                        </a>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(appt.status)}
                    </td>

                    {/* Actions dropdown/buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center space-x-1.5">
                        {appt.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'confirmed')}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] transition-colors"
                            title="Confirm appointment"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'completed')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            className="px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-800 font-semibold text-[11px] transition-colors"
                            title="Cancel appointment"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Notes Modal */}
      {selectedAppointmentForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Patient Notes for {selectedAppointmentForNotes.full_name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedAppointmentForNotes(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200/80">
              {selectedAppointmentForNotes.notes || 'No notes provided by patient.'}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAppointmentForNotes(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
