import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  Gamepad2, 
  Trophy, 
  Flame, 
  Sparkles, 
  ExternalLink, 
  Coins, 
  ShieldCheck, 
  Check, 
  Radio, 
  Activity,
  Heart,
  Zap,
  Swords,
  Gift
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { MiniPlayerProfile } from '../../types/games';

interface GameMiniProfileModalProps {
  player: MiniPlayerProfile | null;
  onClose: () => void;
  onInviteToPlay?: (player: MiniPlayerProfile) => void;
  onViewFullProfile?: (playerId: string) => void;
}

export default function GameMiniProfileModal({
  player,
  onClose,
  onInviteToPlay,
  onViewFullProfile
}: GameMiniProfileModalProps) {
  const { lang, playSynthSound } = useApp();

  const [isFollowing, setIsFollowing] = useState<boolean>(player?.isFollowing ?? false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friend'>(
    player?.isFriend ? 'friend' : 'none'
  );
  const [inviteSent, setInviteSent] = useState<boolean>(false);
  const [energySent, setEnergySent] = useState<boolean>(false);

  if (!player) return null;

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (playSynthSound) playSynthSound(nextState ? 700 : 400, 'sine', 0.08);
  };

  const handleToggleFriend = () => {
    if (friendStatus === 'none') {
      setFriendStatus('pending');
      if (playSynthSound) playSynthSound(880, 'sine', 0.1);
    } else if (friendStatus === 'pending') {
      setFriendStatus('friend');
      if (playSynthSound) playSynthSound(950, 'sine', 0.1);
    } else {
      setFriendStatus('none');
      if (playSynthSound) playSynthSound(350, 'sine', 0.08);
    }
  };

  const handleSendInvite = () => {
    setInviteSent(true);
    if (playSynthSound) {
      playSynthSound(600, 'sine', 0.08);
      setTimeout(() => playSynthSound(800, 'sine', 0.1), 80);
    }
    if (onInviteToPlay) onInviteToPlay(player);
    setTimeout(() => setInviteSent(false), 3500);
  };

  const handleSendEnergy = () => {
    setEnergySent(true);
    if (playSynthSound) {
      playSynthSound(1000, 'triangle', 0.1);
      setTimeout(() => playSynthSound(1300, 'sine', 0.15), 100);
    }
    setTimeout(() => setEnergySent(false), 2500);
  };

  const isAr = lang === 'ar';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-sm bg-[#080D1A]/95 border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden relative text-white backdrop-blur-2xl"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* TOP HOLOGRAPHIC BANNER */}
          <div className="h-24 w-full bg-gradient-to-r from-cyan-950/80 via-blue-900/60 to-purple-950/80 relative overflow-hidden p-4 border-b border-cyan-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.4),transparent_70%)]" />
            <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-[#080D1A] to-transparent pointer-events-none" />

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 rtl:right-auto rtl:left-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer z-10 shadow-md"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* STATUS BADGE */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 shadow-inner">
              <span className={`w-2 h-2 rounded-full ${player.status === 'in_game' ? 'bg-emerald-400 animate-pulse' : player.status === 'online' ? 'bg-sky-400' : 'bg-slate-400'}`} />
              <span>
                {player.status === 'in_game'
                  ? (isAr ? 'في الجولة الآن 🎮' : 'In Match 🎮')
                  : player.status === 'online'
                  ? (isAr ? 'متصل بالمركبة 🟢' : 'Online 🟢')
                  : (isAr ? 'غير متصل' : 'Offline')}
              </span>
            </div>
          </div>

          {/* AVATAR & HEADER CONTENT */}
          <div className="px-5 pb-5 pt-0 -mt-10 relative">
            <div className="flex items-end justify-between gap-3 mb-3">
              {/* AVATAR WITH HOLOGRAPHIC FRAME */}
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-2xl overflow-hidden p-1 shadow-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-500 border-2"
                  style={{
                    borderColor: player.frameBorderColor || '#06B6D4'
                  }}
                >
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-full h-full object-cover rounded-[12px] bg-slate-950"
                  />
                </div>
                {/* LEVEL BADGE */}
                <div className="absolute -bottom-2 -right-1 rtl:-right-auto rtl:-left-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black font-mono text-[10px] shadow-lg border border-amber-300">
                  Lv.{player.level}
                </div>
              </div>

              {/* ACTION QUICK BUTTONS */}
              <div className="flex items-center gap-1.5 pb-1">
                <button
                  onClick={handleSendEnergy}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    energySent
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-white/10 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/10'
                  }`}
                  title={isAr ? 'إرسال دفعة طاقة كوانتية' : 'Send Quantum Energy'}
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{energySent ? (isAr ? 'تم الشحن! ⚡' : 'Boosted! ⚡') : (isAr ? 'طاقة' : 'Boost')}</span>
                </button>

                <button
                  onClick={handleToggleFollow}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isFollowing
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                </button>

                <button
                  onClick={handleToggleFriend}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    friendStatus === 'friend'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : friendStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                  }`}
                >
                  {friendStatus === 'friend' ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isAr ? 'صديق' : 'Friend'}</span>
                    </>
                  ) : friendStatus === 'pending' ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? 'معلّق' : 'Pending'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة' : 'Add'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NAME & TITLE */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{player.name}</h3>
                {player.badgeAr && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-black">
                    {isAr ? player.badgeAr : player.badgeEn}
                  </span>
                )}
              </div>

              <p className="text-xs text-cyan-400 font-semibold font-mono">
                {isAr ? player.titleAr : player.titleEn}
              </p>

              {/* CURRENT ACTIVITY */}
              <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-[11px] text-slate-300 flex items-center gap-2 mt-2 shadow-inner">
                <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">{isAr ? player.currentActivityAr : player.currentActivityEn}</span>
              </div>
            </div>

            {/* STATS MATRIX */}
            <div className="grid grid-cols-4 gap-2 mt-3 p-3 rounded-2xl bg-black/60 border border-white/10 text-center shadow-inner">
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'المباريات' : 'Matches'}</div>
                <div className="text-xs font-black text-white mt-0.5 font-mono">{player.matchesCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'الانتصارات' : 'Wins'}</div>
                <div className="text-xs font-black text-emerald-400 mt-0.5 font-mono">{player.winsCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'نسبة الفوز' : 'Win Rate'}</div>
                <div className="text-xs font-black text-cyan-300 mt-0.5 font-mono">{player.winRate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'النقاط' : 'Coins'}</div>
                <div className="text-xs font-black text-amber-300 mt-0.5 font-mono flex items-center justify-center gap-0.5">
                  <span>{player.points}</span>
                  <Coins className="w-3 h-3 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* ACHIEVEMENTS STRIP */}
            {player.achievements && player.achievements.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                  <span>{isAr ? 'الإنجازات المفتوحة 🏅' : 'Unlocked Badges 🏅'}</span>
                  <span className="text-cyan-400 font-mono font-bold">{player.achievementsCount} {isAr ? 'إنجاز' : 'total'}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {player.achievements.map((ach, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-[10px] text-cyan-200 font-medium font-mono"
                    >
                      {ach}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={handleSendInvite}
                disabled={inviteSent}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                  inviteSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-600/30'
                }`}
              >
                {inviteSent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'تم إرسال إشارة التحدي! ⚔️' : 'Challenge Signal Sent! ⚔️'}</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    <span>{isAr ? 'تحدي سريع 1v1 ⚔️' : 'Challenge 1v1 ⚔️'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onViewFullProfile) onViewFullProfile(player.id);
                }}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                title={isAr ? 'عرض الملف الشخصي الكامل' : 'View Full Profile'}
              >
                <span>{isAr ? 'الملف' : 'Profile'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

