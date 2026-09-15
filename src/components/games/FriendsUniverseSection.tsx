import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Rocket, 
  Sparkles, 
  Shield, 
  Play, 
  UserPlus, 
  Globe, 
  Trophy, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { UniverseFriend } from '../../types/games';
import { INITIAL_UNIVERSE_FRIENDS } from '../../data/universeData';
import { useApp } from '../../contexts/AppContext';

interface FriendsUniverseSectionProps {
  onInviteFriendToRoom?: (friendName: string) => void;
}

export default function FriendsUniverseSection({ onInviteFriendToRoom }: FriendsUniverseSectionProps) {
  const { lang, playSynthSound } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900/90 border border-purple-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-2xl">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-lg font-black text-white">
                {lang === 'ar' ? 'طاقم أصدقاء المجرّة 👥' : 'Galactic Crew Friends 👥'}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ar' ? 'تابع تقدم أصدقائك، مركباتهم، وكواكبهم الحالية في عالم لودافيا' : 'Track your friends, starships, and active planets in Lodavia Universe'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              alert(lang === 'ar' ? 'تم نسخ رابط دعوة صديق لعالم لودافيا!' : 'Friend invite link copied to clipboard!');
              if (playSynthSound) playSynthSound(800, 'sine', 0.1);
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة صديق جديد 🚀' : 'Add New Friend 🚀'}</span>
          </button>
        </div>

        {/* FRIENDS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_UNIVERSE_FRIENDS.map((friend) => (
            <div
              key={friend.id}
              className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between gap-4 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-xl object-cover border border-purple-400"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      friend.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white">{friend.name}</span>
                    <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[9px] font-black rounded-full border border-purple-500/30">
                      Lv.{friend.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
                    <span className="text-cyan-300">{friend.activeShip}</span>
                    <span>•</span>
                    <span className="text-slate-400">{lang === 'ar' ? friend.currentPlanetAr : friend.currentPlanetEn}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => {
                  if (onInviteFriendToRoom) onInviteFriendToRoom(friend.name);
                  if (playSynthSound) playSynthSound(700, 'sine', 0.1);
                }}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'دعوة للعب 🛸' : 'Invite 🛸'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
