import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Trophy, 
  Rocket, 
  Flame, 
  Sparkles, 
  Coins, 
  Gamepad2, 
  Award, 
  ShieldCheck, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { PlayerGameStats, Achievement, AlienAvatarCustomization, StarshipCustomization } from '../../types/games';
import { useApp } from '../../contexts/AppContext';

interface LodaviaProfileViewProps {
  playerLevel: number;
  playerXp: number;
  playerCoins: number;
  stats: PlayerGameStats;
  achievements: Achievement[];
  avatarCustomization: AlienAvatarCustomization;
  starshipCustomization: StarshipCustomization;
}

export default function LodaviaProfileView({
  playerLevel,
  playerXp,
  playerCoins,
  stats,
  achievements,
  avatarCustomization,
  starshipCustomization
}: LodaviaProfileViewProps) {
  const { currentUser, lang } = useApp();

  const xpNextLevel = playerLevel * 200;
  const xpPercent = Math.min(100, Math.round((playerXp / xpNextLevel) * 100));
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER CARD WITH ALIEN AVATAR & STARSHIP */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-900/95 to-indigo-950/90 border border-purple-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            {/* AVATAR BADGE */}
            <div
              className="w-24 h-24 rounded-3xl border-2 border-purple-400 flex items-center justify-center shadow-2xl relative"
              style={{ backgroundColor: `${avatarCustomization.skinTint}30`, borderColor: avatarCustomization.skinTint }}
            >
              <div className="text-5xl animate-bounce">
                {avatarCustomization.headSpecies === 'cyber_cyclops' ? '👁️' :
                 avatarCustomization.headSpecies === 'astro_cat' ? '🐱' :
                 avatarCustomization.headSpecies === 'nebula_elemental' ? '👾' : '👽'}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-white/20">
                Lv.{playerLevel}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black rounded-full">
                  {lang === 'ar' ? avatarCustomization.titleBadgeAr : avatarCustomization.titleBadgeEn}
                </span>
              </div>

              {/* LEVEL & XP PROGRESS BAR */}
              <div className="space-y-1.5 w-64">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-purple-300 font-bold">{playerXp} / {xpNextLevel} XP</span>
                  <span className="text-slate-400">{xpPercent}%</span>
                </div>

                <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BALANCE & STARSHIP CARD */}
          <div className="p-4 bg-black/50 border border-white/10 rounded-2xl flex items-center gap-6 shrink-0 shadow-lg">
            <div className="space-y-1 text-center sm:text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'المركبة النشطة' : 'Active Starship'}</div>
              <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? starshipCustomization.modelNameAr : starshipCustomization.modelNameEn}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="space-y-1 text-center sm:text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'العملة المجرية' : 'Cosmic Coins'}</div>
              <div className="text-xs font-black text-yellow-300 font-mono flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span>{playerCoins} 🪙</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-white/10 p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span>{lang === 'ar' ? 'إجمالي المباريات' : 'Total Games'}</span>
          </div>
          <div className="text-2xl font-mono font-black text-white">{stats.totalGamesPlayed}</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>{lang === 'ar' ? 'إجمالي الانتصارات' : 'Total Wins'}</span>
          </div>
          <div className="text-2xl font-mono font-black text-yellow-300">{stats.totalWins}</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{lang === 'ar' ? 'انتصارات الفوضى' : 'Chaos Wins'}</span>
          </div>
          <div className="text-2xl font-mono font-black text-rose-300">{stats.starshipChaosWins || 0}</div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'الإنجازات المفتوحة' : 'Unlocked Badges'}</span>
          </div>
          <div className="text-2xl font-mono font-black text-emerald-300">{unlockedAchievements} / {achievements.length}</div>
        </div>
      </div>

      {/* ACHIEVEMENTS LIST */}
      <div className="bg-slate-900/90 border border-white/10 p-6 rounded-3xl space-y-4">
        <h3 className="font-black text-sm text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          <span>{lang === 'ar' ? 'إنجازات وشارات المجرّة 🏆' : 'Galactic Achievements & Badges 🏆'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-purple-950/40 border-purple-500/40 shadow-md'
                  : 'bg-black/40 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{ach.icon}</div>
                <div>
                  <div className="font-bold text-xs text-white">
                    {lang === 'ar' ? ach.titleAr : ach.titleEn}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === 'ar' ? ach.descriptionAr : ach.descriptionEn}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full shrink-0">
                +{ach.xpValue} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
