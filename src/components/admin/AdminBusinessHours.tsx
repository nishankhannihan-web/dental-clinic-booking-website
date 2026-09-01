import React, { useState, useEffect } from 'react';
import { Clock, Check, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import type { BusinessHours } from '../../types/database';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const AdminBusinessHours: React.FC = () => {
  const { businessHours, updateBusinessHours } = useClinic();
  const [localHours, setLocalHours] = useState<BusinessHours[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Fill all 7 days if missing
    const fullWeek: BusinessHours[] = [];
    for (let day = 0; day < 7; day++) {
      const found = businessHours.find((bh) => bh.weekday === day);
      if (found) {
        fullWeek.push({ ...found });
      } else {
        fullWeek.push({
          id: `bh-${day}`,
          weekday: day,
          is_open: day !== 0,
          start_time: '08:30:00',
          end_time: '17:30:00',
        });
      }
    }
    setLocalHours(fullWeek.sort((a, b) => a.weekday - b.weekday));
  }, [businessHours]);

  const handleToggleDay = (weekday: number) => {
    setLocalHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, is_open: !h.is_open } : h))
    );
  };

  const handleTimeChange = (
    weekday: number,
    field: 'start_time' | 'end_time',
    value: string
  ) => {
    // Format to HH:MM:00 if needed
    const formatted = value.length === 5 ? `${value}:00` : value;
    setLocalHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, [field]: formatted } : h))
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const result = await updateBusinessHours(localHours);
    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error || 'Failed to update business hours.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Practice Business Hours</h2>
          <p className="text-xs text-slate-500">
            Define daily operating windows. The patient booking system automatically generates time slots within these boundaries.
          </p>
        </div>

        <button
          id="save-hours-btn"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all shrink-0 active:scale-98"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Hours...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business hours updated successfully and applied to live availability.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Weekday List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {localHours.map((bh) => {
          const dayName = WEEKDAYS[bh.weekday] || `Day ${bh.weekday}`;
          const startTimeVal = (bh.start_time || '08:30:00').slice(0, 5);
          const endTimeVal = (bh.end_time || '17:30:00').slice(0, 5);

          return (
            <div
              key={bh.weekday}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                bh.is_open ? 'bg-white' : 'bg-slate-50/70'
              }`}
            >
              {/* Day & Open Toggle */}
              <div className="flex items-center space-x-4 min-w-[160px]">
                <button
                  type="button"
                  onClick={() => handleToggleDay(bh.weekday)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                    bh.is_open ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      bh.is_open ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>

                <div>
                  <span className={`text-sm font-bold block ${bh.is_open ? 'text-slate-900' : 'text-slate-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-[11px] font-semibold ${bh.is_open ? 'text-teal-700' : 'text-slate-400'}`}>
                    {bh.is_open ? 'Open for Bookings' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Time Pickers */}
              {bh.is_open ? (
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">From:</span>
                    <input
                      type="time"
                      value={startTimeVal}
                      onChange={(e) => handleTimeChange(bh.weekday, 'start_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <span className="text-slate-400">to</span>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Until:</span>
                    <input
                      type="time"
                      value={endTimeVal}
                      onChange={(e) => handleTimeChange(bh.weekday, 'end_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-semibold italic">
                  No slots will be offered on {dayName}s
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
