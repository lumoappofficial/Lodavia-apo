import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Users, 
  Globe, 
  Flame 
} from 'lucide-react';
import { GlobalEvent } from '../../types/parallelWorld';
import { INITIAL_GLOBAL_EVENT } from '../../data/parallelWorldData';

interface GlobalEventsBannerProps {
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
}

export default function GlobalEventsBanner({
  lang,
  playSynthSound,
  onGrantXp
}: GlobalEventsBannerProps) {
  const isAr = lang === 'ar';

  const [event, setEvent] = useState<GlobalEvent>(INITIAL_GLOBAL_EVENT);
  const [contributed, setContributed] = useState(false);

  const percent = Math.min(100, Math.round((event.progress / event.target) * 100));

  const handleContribute = () => {
    if (contributed) return;
    playSynthSound(900, 'sine', 0.25);
    setEvent(prev => ({
      ...prev,
      progress: Math.min(prev.target, prev.progress + 50),
      participantsCount: prev.participantsCount + 1
    }));
    setContributed(true);
    onGrantXp(250, 'المشاركة في المهمة الكونية الجماعية', 'Contributed to global cosmic event');
  };

  return (
    <div className="w-full glass-panel rounded-3xl border border-cyan-500/40 p-5 md:p-6 shadow-2xl relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 mb-6">
      
      {/* Background ambient pulse */}
      <div className="absolute top-0 right-0 w-64 h-full bg-cyan-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-cyan-400/40 text-3xl shrink-0 shadow-lg animate-bounce">
            {event.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/25 text-cyan-200 px-3 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>{isAr ? event.badgeAr : event.badgeEn}</span>
              </span>
              <span className="text-xs font-bold text-slate-300">
                👥 {event.participantsCount} {isAr ? 'مستكشف مشارك' : 'Explorers Contributing'}
              </span>
            </div>

            <h3 className="text-base md:text-xl font-black text-white mt-1">
              {isAr ? event.titleAr : event.titleEn}
            </h3>

            <p className="text-xs md:text-sm font-semibold text-slate-200 mt-0.5 max-w-xl leading-relaxed">
              {isAr ? event.descriptionAr : event.descriptionEn}
            </p>
          </div>
        </div>

        {/* Right Progress Meter & Action */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-2.5 bg-slate-950/80 p-4 rounded-2xl border border-white/15 shadow-xl">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-200">{isAr ? 'طاقة الكوانتم المجمعة' : 'Quantum Energy'}</span>
            <span className="text-cyan-300 font-mono font-black">{event.progress} / {event.target} ({percent}%)</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full border border-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <button
            onClick={handleContribute}
            disabled={contributed}
            className={`w-full py-2.5 rounded-xl font-black text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
              contributed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
            }`}
          >
            {contributed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'شاركت بطاقتك بنجاح! (+250 XP)' : 'Contributed! (+250 XP)'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>{isAr ? 'إرسال طاقة كوانتم والمشاركة (+250 XP) ⚡' : 'Send Quantum Energy (+250 XP) ⚡'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
