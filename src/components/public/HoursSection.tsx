import React from 'react';
import { Clock, MapPin, Phone, Mail, ShieldAlert } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const HoursSection: React.FC = () => {
  const { clinicSettings, businessHours } = useClinic();
  const todayWeekday = new Date().getDay();

  return (
    <section id="hours" className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Business Hours Card */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wider uppercase border border-teal-200/50 dark:border-teal-800/50">
                <Clock className="w-3.5 h-3.5" />
                <span>Hours of Operation</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Convenient morning & evening appointments.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                We respect your busy schedule with punctual start times and flexible appointment options throughout the week.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200/80 dark:divide-slate-800 shadow-xs">
              {businessHours.map((bh) => {
                const isToday = bh.weekday === todayWeekday;
                const dayName = WEEKDAYS[bh.weekday] || `Day ${bh.weekday}`;

                return (
                  <div
                    key={bh.weekday}
                    className={`py-3 flex items-center justify-between text-sm ${
                      isToday ? 'font-bold text-teal-900 dark:text-teal-200 bg-teal-100/50 dark:bg-teal-950/60 -mx-3 px-3 rounded-lg' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{dayName}</span>
                      {isToday && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-teal-700 dark:bg-teal-600 text-white">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs">
                      {bh.is_open && bh.start_time && bh.end_time ? (
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">
                          {bh.start_time.slice(0, 5)} – {bh.end_time.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase">Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Location, Contact & Urgent Care */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wider uppercase border border-teal-200/50 dark:border-teal-800/50">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location & Contact</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Visit our modern studio.
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Centrally located in the medical arts quarter with dedicated patient parking and wheelchair accessibility.
              </p>
            </div>

            <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-7 space-y-6 shadow-xl relative overflow-hidden border border-transparent dark:border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Address</span>
                    <p className="text-sm text-slate-100 font-medium mt-0.5">
                      {clinicSettings.clinic_address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start space-x-3.5">
                    <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Direct Phone</span>
                      <a href={`tel:${clinicSettings.clinic_phone}`} className="text-sm text-slate-100 hover:text-teal-300 font-medium mt-0.5 block">
                        {clinicSettings.clinic_phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Inquiries</span>
                      <a href={`mailto:${clinicSettings.clinic_email}`} className="text-sm text-slate-100 hover:text-teal-300 font-medium mt-0.5 block truncate max-w-[180px]">
                        {clinicSettings.clinic_email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start space-x-3 text-xs text-slate-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Emergency Dental Care:</strong> If you are experiencing acute pain or trauma after hours, call our emergency line or visit your nearest hospital emergency facility.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
