import React, { useState } from 'react';
import { CalendarOff, Plus, Trash2, Calendar, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { format, parseISO } from 'date-fns';

export const AdminBlockedDates: React.FC = () => {
  const { blockedDates, addBlockedDate, removeBlockedDate } = useClinic();
  
  const [dateVal, setDateVal] = useState('');
  const [reasonVal, setReasonVal] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateVal) {
      setError('Please choose a date to block.');
      return;
    }

    setIsAdding(true);
    setError(null);

    const result = await addBlockedDate(dateVal, reasonVal.trim() || 'Clinic Holiday / Closed');
    setIsAdding(false);

    if (result.success) {
      setDateVal('');
      setReasonVal('');
    } else {
      setError(result.error || 'Failed to add blocked date.');
    }
  };

  const handleRemove = async (id: string) => {
    await removeBlockedDate(id);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Blocked Dates & Practice Closures</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dates specified here are completely blocked off from patient booking regardless of regular weekday hours.
        </p>
      </div>

      {/* Add Blocked Date Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
          <CalendarOff className="w-4 h-4 text-teal-600" />
          <span>Add Date Closure / Holiday</span>
        </h3>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddBlockedDate} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="block-date-input"
              type="date"
              required
              value={dateVal}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setDateVal(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Reason / Closure Label
            </label>
            <input
              id="block-reason-input"
              type="text"
              value={reasonVal}
              onChange={(e) => setReasonVal(e.target.value)}
              placeholder="e.g. National Dental Congress / Holiday"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              id="submit-block-date-btn"
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 active:scale-98 transition-all"
            >
              {isAdding ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Block Date</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700">
          Currently Blocked Calendar Dates ({blockedDates.length})
        </div>

        {blockedDates.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-1">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No dates are currently blocked.</p>
            <p>The clinic is accepting patient appointments on all standard open weekdays.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {blockedDates.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <CalendarOff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {item.blocked_date}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {item.reason || 'Clinic Holiday'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
