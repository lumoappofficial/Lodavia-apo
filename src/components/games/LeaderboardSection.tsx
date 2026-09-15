import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  Award, 
  Zap, 
  Sparkles, 
  Flame, 
  User, 
  CheckCircle2, 
  Lock, 
  Coins, 
  Star 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Achievement, LeaderboardUser, PlayerGameStats } from '../../types/games';

interface LeaderboardSectionProps {
  leaderboard: LeaderboardUser[];
  achievements: Achievement[];
  stats: PlayerGameStats;
  playerLevel: number;
  playerXp: number;
}

export default function LeaderboardSection({
  leaderboard,
  achievements,
  stats,
  playerLevel,
  playerXp
}: LeaderboardSectionProps) {
  const { currentUser, lang } = useApp();
  const [tab, setTab] = useState<'leaderboard' | 'achievements' | 'stats'>('leaderboard');

  const xpForNextLevel = playerLevel * 200;
  const xpProgressPercent = Math.min(100, Math.round((playerXp / xpForNextLevel) * 100));

  return (
    <div className="space-y-6">
      {/* PLAYER STATS HEADER STRIP */}
      <div className="p-5 bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900 border border-purple-500/30 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-slate-950">
                Lv.{playerLevel}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  {lang === 'ar' ? 'مغامر مجرّي' : 'Cosmic Explorer'}
                </span>
              </h3>

              {/* XP PROGRESS BAR */}
              <div className="w-48 sm:w-64 mt-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>XP Level Progress</span>
                  <span>{playerXp} / {xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase">{lang === 'ar' ? 'إجمالي المباريات' : 'Games Played'}</div>
              <div className="text-cyan-300 font-black text-sm mt-0.5">{stats.totalGamesPlayed}</div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase">{lang === 'ar' ? 'الانتصارات' : 'Total Wins'}</div>
              <div className="text-emerald-400 font-black text-sm mt-0.5">{stats.totalWins}</div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase">{lang === 'ar' ? 'نقاط لودافيا' : 'Lodavia Pts'}</div>
              <div className="text-yellow-400 font-black text-sm mt-0.5">{currentUser.points || 0} 💎</div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            tab === 'leaderboard'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>{lang === 'ar' ? 'لوحة متصدري المجرة 🏆' : 'Cosmic Leaderboard 🏆'}</span>
        </button>

        <button
          onClick={() => setTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            tab === 'achievements'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'الإنجازات والأوسمة 🎖️' : 'Achievements 🎖️'}</span>
        </button>
      </div>

      {/* LEADERBOARD TAB */}
      {tab === 'leaderboard' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-900 border-b border-white/10 text-xs text-slate-400 font-bold flex justify-between">
            <span>{lang === 'ar' ? 'الترتيب واللاعب' : 'Rank & Player'}</span>
            <span>{lang === 'ar' ? 'المستوى والنقاط' : 'Level & Points'}</span>
          </div>

          <div className="divide-y divide-white/5">
            {leaderboard.map((u, idx) => {
              const isTop3 = idx < 3;
              let rankBadge = `${idx + 1}`;
              if (idx === 0) rankBadge = '🥇';
              if (idx === 1) rankBadge = '🥈';
              if (idx === 2) rankBadge = '🥉';

              return (
                <div
                  key={u.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    u.isCurrentUser ? 'bg-purple-950/40 border-l-4 border-purple-400' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center text-sm font-black text-slate-300">{rankBadge}</span>

                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-2xl object-cover border border-white/10" />

                    <div>
                      <div className="font-extrabold text-xs text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.isCurrentUser && (
                          <span className="text-[9px] bg-purple-500/30 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-mono">
                            {lang === 'ar' ? 'أنت' : 'YOU'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-purple-300 mt-0.5">
                        {lang === 'ar' ? u.badgeAr : u.badgeEn}
                      </div>
                    </div>
                  </div>

                  <div className="text-end font-mono text-xs">
                    <div className="text-cyan-300 font-black">Level {u.level}</div>
                    <div className="text-yellow-400 text-[11px] font-bold mt-0.5">{u.points} 💎</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {tab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/40 shadow-lg'
                  : 'bg-slate-900/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="text-3xl p-2 bg-slate-950 rounded-2xl border border-white/10 shrink-0">
                {ach.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-black text-xs ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {lang === 'ar' ? ach.titleAr : ach.titleEn}
                  </h4>

                  {ach.unlocked ? (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                      {lang === 'ar' ? 'مكتمل' : 'Unlocked'}
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? ach.descriptionAr : ach.descriptionEn}
                </p>

                <div className="text-[10px] font-mono text-purple-300 pt-1">
                  +{ach.xpValue} XP Reward
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
