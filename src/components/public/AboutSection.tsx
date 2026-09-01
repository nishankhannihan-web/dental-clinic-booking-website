import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles, Award } from 'lucide-react';
import { DENTAL_IMAGES } from '../../lib/images';
import { useClinic } from '../../context/ClinicContext';

export const AboutSection: React.FC = () => {
  const { clinicSettings } = useClinic();

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Grid of Clinic Interior & Care */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md h-64 bg-slate-200 dark:bg-slate-800">
                  <img
                    src={DENTAL_IMAGES.about.clinicInterior}
                    alt="Architectural modern dental clinic reception with calming natural lighting"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-44 bg-slate-200 dark:bg-slate-800">
                  <img
                    src={DENTAL_IMAGES.about.technology}
                    alt="Advanced digital diagnostic scanner and sterilized equipment"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-md h-44 bg-slate-200 dark:bg-slate-800">
                  <img
                    src={DENTAL_IMAGES.hero.consultation}
                    alt="Gentle dentist patient consultation"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-64 bg-slate-200 dark:bg-slate-800">
                  <img
                    src={DENTAL_IMAGES.about.dentistTeam}
                    alt="Lead dental clinician with professional care standards"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-800 dark:bg-teal-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 text-center">
              <span className="block text-2xl font-extrabold">15+</span>
              <span className="block text-[11px] font-medium text-teal-100 uppercase tracking-wider">Years of Precision</span>
            </div>
          </div>

          {/* Right Column: Narrative & Clinical Principles */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 text-xs font-bold tracking-wider uppercase">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>The Patient-First Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Designed to change the way you experience dental visits.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                We believe exceptional oral healthcare begins with genuine comfort. From our noise-dampened treatment rooms to our warm clinical team, {clinicSettings.clinic_name || 'Lumina Dental Studio'} is crafted to eliminate dental anxiety and deliver enduring oral health.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hospital-Grade Sterilization Protocols</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Class-B autoclave steam sterilization and multi-stage air filtration ensure sterile, pristine treatment conditions for every single patient.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Low-Dose 3D Digital Diagnostics</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Our digital sensors emit up to 80% less radiation than traditional radiographs while rendering crystal-clear microscopic tooth geometry.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Biocompatible & Aesthetic Materials</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    100% mercury-free, BPA-free resin composites and custom layered porcelain engineered to mimic natural enamel elasticity and light translucency.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
