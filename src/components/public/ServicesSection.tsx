import React from 'react';
import { Clock, Check, Stethoscope, ArrowRight } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { getServiceImage } from '../../lib/images';
import type { Service } from '../../types/database';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const { activeServices, isLoading } = useClinic();

  return (
    <section id="services" className="py-20 bg-white dark:bg-slate-950 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wider uppercase border border-teal-200/50 dark:border-teal-800/50">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Treatments & Care</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive dental care tailored for your smile.
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            From routine preventive checkups and gentle hygiene to modern cosmetic smile enhancements, all performed with high-precision digital equipment.
          </p>
        </div>

        {/* Dynamic Service Grid */}
        {isLoading && activeServices.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 h-80 animate-pulse border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activeServices.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 font-medium">No active dental services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service: Service) => {
              const serviceImg = getServiceImage(service.name);

              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left hover:-translate-y-1"
                >
                  {/* Service Visual Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={serviceImg}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{service.duration_minutes} mins</span>
                    </div>

                    {/* Price Pill */}
                    <div className="absolute bottom-3 right-3 bg-teal-700 dark:bg-teal-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs">
                      ${Number(service.price).toFixed(2)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {service.description || 'Comprehensive clinical care provided with advanced dental equipment.'}
                      </p>
                    </div>

                    {/* Footer Booking Action */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Instant slot booking</span>
                      </div>

                      <button
                        onClick={() => onSelectServiceForBooking(service.id)}
                        className="inline-flex items-center space-x-1.5 text-sm font-bold text-teal-700 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors hover:underline"
                      >
                        <span>Select Service</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
