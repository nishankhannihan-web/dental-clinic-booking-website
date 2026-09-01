import React from 'react';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Footer: React.FC = () => {
  const { clinicSettings } = useClinic();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-400 text-sm border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1 5.5 2 9 0.7 2.5 1.5 5 4 5s3.3-2.5 4-5c1-3.5 2-6.5 2-9 0-3.5-2.5-6-6-6zm0 2.2c2.4 0 4 1.8 4 4.3 0 2.2-0.9 5.2-1.9 8.5-0.5 1.8-1.2 3.5-2.1 3.5s-1.6-1.7-2.1-3.5C8.9 13.7 8 10.7 8 8.5c0-2.5 1.6-4.3 4-4.3z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {clinicSettings.clinic_name || 'Lumina Dental Studio'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated to clinical precision, gentle patient comfort, and enduring oral wellness. Providing comprehensive preventive, restorative, and cosmetic dentistry.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Treatments
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Comprehensive Dental Exams</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Gentle Ultrasonic Cleanings</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Laser Teeth Whitening</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Composite Restorations</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Emergency Dental Care</a></li>
            </ul>
          </div>

          {/* Col 3: Clinic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Clinic Contact
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{clinicSettings.clinic_address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href={`tel:${clinicSettings.clinic_phone}`} className="hover:text-teal-400 transition-colors">
                  {clinicSettings.clinic_phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href={`mailto:${clinicSettings.clinic_email}`} className="hover:text-teal-400 transition-colors truncate max-w-[200px]">
                  {clinicSettings.clinic_email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Appointments & Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Patient Care & Hours
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Same-day appointments and emergency slots available during standard operating hours.
            </p>
            <a
              href="#booking"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment Online</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {clinicSettings.clinic_name || 'Lumina Dental Studio'}. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>HIPAA Compliant Data Standards</span>
            <span>•</span>
            <span>Hospital-Grade Sterilization</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
