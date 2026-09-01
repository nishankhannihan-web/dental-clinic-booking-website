import React from 'react';
import { Calendar, ShieldCheck, Star, Award, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { DENTAL_IMAGES } from '../../lib/images';
import { useClinic } from '../../context/ClinicContext';

interface HeroProps {
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick }) => {
  const { clinicSettings, activeServices } = useClinic();

  return (
    <section
      id="hero-section"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-900 transition-colors duration-200"
    >
      {/* Subtle background ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-sky-200/25 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Clinical Value & Trust */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Medical Quality Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/70 text-teal-800 dark:text-teal-300 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600 dark:bg-teal-400"></span>
              </span>
              <span>Accepting New Patients & Emergency Consultations</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Gentle, precision dental care for your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 dark:from-teal-400 dark:via-teal-300 dark:to-cyan-400">
                  healthiest smile
                </span>.
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                At {clinicSettings.clinic_name || 'Lumina Dental Studio'}, we combine low-radiation 3D imaging, gentle hygiene protocols, and a calm boutique environment to make every appointment comfortable and stress-free.
              </p>
            </div>

            {/* Key Clinical Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center space-x-2.5 text-sm text-slate-700 dark:text-slate-200 font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Zero-Anxiety Gentle Tech</span>
              </div>
              <div className="flex items-center space-x-2.5 text-sm text-slate-700 dark:text-slate-200 font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>On-Time Guarantee</span>
              </div>
              <div className="flex items-center space-x-2.5 text-sm text-slate-700 dark:text-slate-200 font-medium bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Biocompatible Materials</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                id="hero-book-cta"
                onClick={onBookClick}
                className="px-7 py-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-700/25 hover:shadow-teal-700/35 transition-all flex items-center justify-center space-x-3 group active:scale-98"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Your Visit Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="px-6 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center"
              >
                <span>Explore Treatments ({activeServices.length})</span>
              </a>
            </div>

            {/* Social Trust & Rating */}
            <div className="flex items-center space-x-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="font-medium text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">4.9 / 5.0</span> patient satisfaction rating based on 450+ verified patient reviews
              </div>
            </div>

          </div>

          {/* Right Column: Layered Dental Clinic Visual */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Primary Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <img
                src={DENTAL_IMAGES.hero.primary}
                alt="Modern, pristine dental clinic consultation room with advanced medical equipment"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />

              {/* Inset bottom pill on image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Comprehensive First-Visit Exam</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Includes full-mouth 3D scan & oral cancer screening</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                    From $140
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Top Floating Card */}
            <div className="absolute -top-6 -left-6 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center space-x-3 hidden sm:flex animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Certified Specialists</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Board-certified dental team</p>
              </div>
            </div>

            {/* Floating Bottom Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hidden sm:flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Instant Online Booking</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time schedule confirmation</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
