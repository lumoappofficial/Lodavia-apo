import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Zap, Layers, Shield } from 'lucide-react';
import { ORBITS_TEAMS } from './OrbitsBoard';

export interface PlayerInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  avatar: string;
  team: 'blue' | 'gold' | 'emerald' | 'coral';
  score: number;
  coins: number;
  isCurrentTurn: boolean;
  cardsCount: number;
  isYou?: boolean;
}

interface OrbitsPlayerCardProps {
  player: PlayerInfo;
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function OrbitsPlayerCard({ player, corner }: OrbitsPlayerCardProps) {
  const team = ORBITS_TEAMS[player.team];

  return (
    <div
      className={`relative z-20 transition-all duration-300 ${
        player.isCurrentTurn
          ? 'scale-[1.02]'
          : 'opacity-90 hover:opacity-100'
      }`}
    >
      {/* Turn Glow Indicator */}
      {player.isCurrentTurn && (
        <div
          className="absolute -inset-1 rounded-2xl blur-sm opacity-60 animate-pulse pointer-events-none"
          style={{ backgroundColor: team.colorHex }}
        />
      )}

      {/* Glass Card Container */}
      <div
        className={`relative flex items-center gap-3 p-2.5 sm:p-3.5 rounded-2xl backdrop-blur-xl border transition-all ${
          player.isCurrentTurn
            ? 'bg-[#0D1629]/95 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-[#0A101D]/80 border-white/10 hover:border-white/20'
        }`}
      >
        {/* Circular Avatar with Team Ring */}
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 flex items-center justify-center text-lg sm:text-xl font-bold bg-[#131F37] shadow-md"
            style={{ borderColor: team.colorHex }}
          >
            {player.avatar.startsWith('http') ? (
              <img src={player.avatar} alt={player.nameAr} className="w-full h-full object-cover" />
            ) : (
              <span>{player.avatar}</span>
            )}
          </div>

          {/* Active Turn Dot */}
          {player.isCurrentTurn && (
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0B1220] animate-ping"
              style={{ backgroundColor: team.colorHex }}
            />
          )}

          {/* Mini Cards Count Pill */}
          <div className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-md bg-black/80 border border-white/20 text-[9px] font-mono font-bold text-slate-200 flex items-center gap-0.5">
            <Layers className="w-2.5 h-2.5 text-sky-400" />
            <span>{player.cardsCount}</span>
          </div>
        </div>

        {/* Player Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[110px] sm:max-w-[130px]">
              {player.nameAr}
            </h4>
            {player.isYou && (
              <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[9px] font-bold">
                أنت
              </span>
            )}
          </div>

          {/* Team station info */}
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: team.colorHex }}
            />
            <span className="text-[10px] font-medium text-slate-300 truncate">
              {team.nameAr}
            </span>
          </div>

          {/* Score & Points */}
          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Trophy className="w-3 h-3" />
              <span>{player.score.toLocaleString()} XP</span>
            </span>
            <span>•</span>
            <span className="text-sky-300 font-bold">
              {player.coins} 🪙
            </span>
          </div>
        </div>

        {/* Current Turn Badge */}
        {player.isCurrentTurn && (
          <div className="hidden sm:flex flex-col items-center justify-center pl-1 shrink-0">
            <span
              className="px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider text-black animate-pulse shadow-sm"
              style={{ backgroundColor: team.colorHex }}
            >
              الدور ⚡
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
