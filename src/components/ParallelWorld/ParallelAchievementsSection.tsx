import React from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { ParallelAchievement } from '../../types/parallelWorld';
import { PARALLEL_ACHIEVEMENTS } from '../../data/parallelWorldData';

interface ParallelAchievementsSectionProps {
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
}

export default function ParallelAchievementsSection({
  lang,
  playSynthSound,
  onGrantXp
}: ParallelAchievementsSectionProps) {
  const isAr = lang === 'ar';

  const achievements = PARALLEL_ACHIEVEMENTS;

  return (
    <div className="w-full flex flex-col gap-6 glass-panel bg-slate-950/95 text-slate-100 rounded-3xl border border-amber-500/30 p-5 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-400/30 text-amber-300">
            <Shield className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'أوسمة وإنجازات العالم الموازي 🏆' : 'Parallel World Achievements 🏆'}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr ? 'افتح الأوسمة واكسب النقاط الكونية عند استكشاف المناطق وتأدية المهمات' : 'Unlock cosmic badges & earn XP by exploring zones & completing quests'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`p-5 rounded-3xl border transition duration-300 flex flex-col justify-between gap-3 relative ${
              ach.unlocked
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-amber-500/40 shadow-lg'
                : 'bg-white/5 border-white/10 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl p-3 rounded-2xl bg-slate-900 border border-white/10 shadow-md">
                {ach.icon}
              </span>

              {ach.unlocked ? (
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'مفتوح' : 'Unlocked'}</span>
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مغلق' : 'Locked'}</span>
                </span>
              )}
            </div>

            <div>
              <h4 className="text-sm font-black text-white">
                {isAr ? ach.titleAr : ach.titleEn}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isAr ? ach.descriptionAr : ach.descriptionEn}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-black text-amber-400">
              <span>{isAr ? 'المكافأة:' : 'Reward:'}</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>+{ach.xpReward} XP</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
