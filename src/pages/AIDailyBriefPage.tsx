import React from 'react';
import { useApp } from '../contexts/AppContext';
import AIDailyBrief from '../components/AIDailyBrief';
import { Brain, Star } from 'lucide-react';

export default function AIDailyBriefPage() {
  const { lang } = useApp();

  return (
    <div className="min-h-screen py-6 md:py-10 px-4 md:px-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Dynamic Title / Breadcrumb Area */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <span>Lodavia</span>
          <span>/</span>
          <span className="text-cyan-400">AI Daily Brief</span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
          <Star className="w-3 h-3 fill-amber-400 animate-pulse" />
          <span>{lang === 'ar' ? 'ميزة الاشتراك برو ✨' : 'PRO SUBSCRIBER BENEFIT ✨'}</span>
        </div>
      </div>

      {/* Main feature content */}
      <AIDailyBrief />

    </div>
  );
}
