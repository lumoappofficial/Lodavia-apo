import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import LodaviaSkyAR from '../components/sky/LodaviaSkyAR';
import { 
  Sparkles, 
  Compass, 
  Layers, 
  Calendar, 
  Clock, 
  Info, 
  Radio, 
  ChevronRight, 
  ChevronLeft,
  Moon,
  Sun,
  Flame,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { AstronomyService } from '../services/astronomy.service';

export default function LodaviaSkyPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  const ArrowBackIcon = isAr ? ArrowRight : ArrowLeft;

  const skyEvents = AstronomyService.getSkyEvents();

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 px-3 sm:px-6 space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* 1. Minimal Breadcrumb & Quick Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSynthSound(450, 'sine', 0.05);
              navigate(-1);
            }}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1 font-semibold"
            title={isAr ? 'رجوع' : 'Back'}
          >
            <ArrowBackIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'رجوع' : 'Back'}</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            {isAr ? 'سماء لودافيا الفلكية 🌌' : 'Lodavia Sky AR 🌌'}
          </span>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/lodavia-now');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-cyan-500/10 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer shadow-xs"
          >
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>{isAr ? 'ماذا يحدث الآن؟' : 'Lodavia Now'}</span>
          </button>

          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/explore-space');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-cyan-500/10 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer shadow-xs"
          >
            <Compass className="w-3 h-3 text-cyan-500" />
            <span>{isAr ? 'المستكشف 3D' : '3D Orbit Explorer'}</span>
          </button>
        </div>
      </div>

      {/* 2. Full AR Camera & Celestial Dome Component */}
      <LodaviaSkyAR
        lang={lang}
        playSynthSound={playSynthSound}
      />

      {/* 3. Astronomical Highlights of Today ("ماذا سيحدث في سماء اليوم") */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-cyan-500/20 rounded-3xl p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {isAr ? 'أبرز الظواهر الفلكية المرئية اليوم 🔭' : 'Featured Celestial Sky Events Today 🔭'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'بيانات فلكية موثقة ودقيقة محسوبة بناءً على موقعك الجغرافي وتوقيتك المحلي' : 'Calculated based on ephemeris, observer GPS and local sidereal time'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skyEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/5 space-y-2.5 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{event.icon}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  {event.peakTime}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                {isAr ? event.titleAr : event.titleEn}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr ? event.descriptionAr : event.descriptionEn}
              </p>

              <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {isAr ? event.visibilityAr : event.visibilityEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
