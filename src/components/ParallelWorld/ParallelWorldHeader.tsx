import React from 'react';
import { 
  Compass, 
  User, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Layers, 
  HelpCircle, 
  Globe, 
  Shield 
} from 'lucide-react';
import { AppUser } from '../../types';
import { ParallelIdentity } from '../../types/parallelWorld';

interface ParallelWorldHeaderProps {
  currentUser: AppUser;
  identity: ParallelIdentity;
  activeView: 'map' | 'sanctum' | 'what_if' | 'gates' | 'achievements';
  setActiveView: (view: 'map' | 'sanctum' | 'what_if' | 'gates' | 'achievements') => void;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onOpenCustomizer: () => void;
  onBackToHome: () => void;
}

export default function ParallelWorldHeader({
  currentUser,
  identity,
  activeView,
  setActiveView,
  lang,
  playSynthSound,
  onOpenCustomizer,
  onBackToHome
}: ParallelWorldHeaderProps) {
  const isAr = lang === 'ar';

  const xpPercent = Math.min(100, Math.round((identity.xp / identity.nextLevelXp) * 100));

  return (
    <div className="w-full flex flex-col gap-3 glass-panel bg-slate-950/95 p-4 md:p-5 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden mb-6 text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      {/* Top Bar: Identity & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        
        {/* User Identity Info */}
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => {
              playSynthSound(400, 'sine', 0.08);
              onBackToHome();
            }}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 transition-all cursor-pointer shrink-0"
            title={isAr ? 'العودة للرئيسية' : 'Back to Home'}
          >
            <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
          </button>

          {/* Avatar with Parallel Aura */}
          <div 
            className="relative cursor-pointer group"
            onClick={() => {
              playSynthSound(700, 'sine', 0.1);
              onOpenCustomizer();
            }}
          >
            <div 
              className="absolute -inset-1 rounded-full blur-sm transition-all group-hover:scale-110" 
              style={{ backgroundColor: identity.auraColor || '#06b6d4', opacity: 0.7 }}
            />
            <div className="relative p-0.5 rounded-full bg-slate-950 border border-white/30">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-full object-cover" 
              />
              <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full px-1.5 py-0.5 border border-white/20 font-black text-cyan-400">
                L{identity.level}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-white flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className="text-xs text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {identity.title}
                </span>
              </h2>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 md:w-44 h-2 bg-slate-900/80 rounded-full border border-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {identity.xp} / {identity.nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Badges & Customize Identity Action */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.1);
              onOpenCustomizer();
            }}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-blue-600/30 border border-cyan-400/30 hover:border-cyan-400 text-xs font-black text-cyan-300 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAr ? 'تخصيص الهوية الموازية 👤' : 'Customize Parallel Identity 👤'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{currentUser.points} {isAr ? 'نقطة 💎' : 'Pts 💎'}</span>
          </div>

        </div>

      </div>

      {/* Sub Navigation Views Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5 relative z-10">
        {[
          { id: 'map', labelAr: 'الخريطة الكونية 🌌', labelEn: 'Cosmic Map 🌌', icon: Compass },
          { id: 'sanctum', labelAr: 'عالَمي الشخصي 🏰', labelEn: 'My Personal World 🏰', icon: MapPin },
          { id: 'what_if', labelAr: 'محاكي ماذا لو؟ 🔮', labelEn: 'What If Simulator 🔮', icon: HelpCircle },
          { id: 'gates', labelAr: 'البوابات الكونية 🚪', labelEn: 'Parallel Gates 🚪', icon: Layers },
          { id: 'achievements', labelAr: 'الإنجازات والأوسمة 🏆', labelEn: 'Achievements & Badges 🏆', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setActiveView(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
