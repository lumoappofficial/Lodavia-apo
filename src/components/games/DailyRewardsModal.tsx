import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Sparkles, 
  Coins, 
  Check, 
  X, 
  Flame, 
  CheckCircle2, 
  Award,
  Crown,
  Box,
  UserCheck,
  Shield,
  HelpCircle
} from 'lucide-react';
import { DAILY_REWARDS_7DAYS } from '../../data/retentionData';
import { useApp } from '../../contexts/AppContext';
import { playPresetSound } from '../../utils/synth';

interface DailyRewardsModalProps {
  onClose: () => void;
  onClaimCoinsAndXp: (coins: number, xp: number) => void;
}

export default function DailyRewardsModal({ onClose, onClaimCoinsAndXp }: DailyRewardsModalProps) {
  const { lang, currentUser } = useApp();
  const isRtl = lang === 'ar';

  // Streak claimed status stored in local storage
  const [claimedStreakDay, setClaimedStreakDay] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_streak_claimed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_current_streak');
    return saved ? parseInt(saved, 10) : 3; // Default 3 days for demo
  });

  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_best_streak');
    return saved ? parseInt(saved, 10) : 7;
  });

  const [claimedRewardMessage, setClaimedRewardMessage] = useState<string | null>(null);

  const claimStreak = (dayNumber: number, reward: typeof DAILY_REWARDS_7DAYS[0]) => {
    if (dayNumber !== claimedStreakDay + 1) return;

    setClaimedStreakDay(dayNumber);
    localStorage.setItem('lodavia_streak_claimed', dayNumber.toString());

    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    localStorage.setItem('lodavia_current_streak', newStreak.toString());

    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      localStorage.setItem('lodavia_best_streak', newStreak.toString());
    }

    const earnedCoins = typeof reward.value === 'number' ? reward.value : 100;
    const earnedXp = dayNumber * 25;
    onClaimCoinsAndXp(earnedCoins, earnedXp);

    playPresetSound('reward');

    setClaimedRewardMessage(
      isRtl 
        ? `تم استلام مكافأة اليوم ${dayNumber}: ${reward.titleAr}! (+${earnedXp} XP)`
        : `Claimed Day ${dayNumber} Reward: ${reward.titleEn}! (+${earnedXp} XP)`
    );

    setTimeout(() => {
      setClaimedRewardMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-[0_10px_35px_rgba(15,23,42,0.12)] relative text-[#0F172A]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] rounded-2xl shadow-sm">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">
                {isRtl ? 'المكافآت والمهام اليومية 🎁' : 'Daily Rewards & Streaks 🎁'}
              </h2>
              <p className="text-xs text-[#475569] font-medium">
                {isRtl ? 'سجل دخولك يومياً لرفع السلسلة واكتساب النقاط الحصرية' : 'Log in daily to boost your streak and earn exclusive rewards'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPresetSound('click');
              onClose();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STREAK OVERVIEW BANNER */}
        <div className="p-4 bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 border border-sky-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 text-amber-600 rounded-xl">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#475569] uppercase tracking-wider">
                {isRtl ? 'سلسلة الدخول الحالية' : 'Current Login Streak'}
              </div>
              <div className="text-xl font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <span>{currentStreak} {isRtl ? 'أيام متتالية' : 'Days'}</span>
                <span className="text-amber-500 text-sm">🔥</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-[#64748B]">
              {isRtl ? 'أفضل سلسلة' : 'Best Streak'}
            </div>
            <div className="text-sm font-extrabold text-[#0F172A]">
              {bestStreak} {isRtl ? 'يوم' : 'Days'} 🏆
            </div>
          </div>
        </div>

        {claimedRewardMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{claimedRewardMessage}</span>
          </motion.div>
        )}

        {/* 7-DAY STREAK CALENDAR */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#0F172A] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#55C8FF]" />
              <span>{isRtl ? 'جدول المكافآت الأسبوعي (7 أيام):' : '7-Day Reward Schedule:'}</span>
            </span>
            <span className="text-[11px] text-[#64748B]">
              {isRtl ? `مكافأة اليوم: ${claimedStreakDay + 1}` : `Today's Reward: Day ${claimedStreakDay + 1}`}
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {DAILY_REWARDS_7DAYS.map((item) => {
              const isClaimed = item.day <= claimedStreakDay;
              const isCurrent = item.day === claimedStreakDay + 1;

              return (
                <button
                  key={item.day}
                  disabled={!isCurrent}
                  onClick={() => claimStreak(item.day, item)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] space-y-1.5 relative ${
                    isClaimed
                      ? 'bg-slate-50 border-slate-200 text-[#94A3B8] opacity-75'
                      : isCurrent
                      ? 'bg-gradient-to-b from-[#55C8FF]/10 to-[#26D6FF]/20 border-[#55C8FF] text-[#0F172A] shadow-md cursor-pointer scale-105 font-bold'
                      : 'bg-white border-[#E5E7EB] text-[#64748B] opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                    {isRtl ? `اليوم ${item.day}` : `Day ${item.day}`}
                  </div>
                  
                  <div className="text-2xl my-1">{item.icon}</div>

                  <div className="text-[10px] font-bold text-[#0F172A]">
                    {isRtl ? item.titleAr : item.titleEn}
                  </div>

                  {isClaimed && (
                    <div className="p-1 bg-emerald-500 text-white rounded-full absolute top-1.5 right-1.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {isCurrent && (
                    <span className="text-[9px] bg-[#55C8FF] text-[#0F172A] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                      {isRtl ? 'جاهز' : 'Ready'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK XP ACTIVITY GUIDE */}
        <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
          <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? 'طرق كسب النقاط والخبرة (XP) يومياً:' : 'Ways to Earn XP & Points Daily:'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold text-[#475569]">
            <div className="p-2 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <span>{isRtl ? 'مشاركة منشور' : 'Publish Post'}</span>
              <span className="text-[#55C8FF] font-bold">+25 XP</span>
            </div>
            <div className="p-2 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <span>{isRtl ? 'غرفة صوتية' : 'Voice Room'}</span>
              <span className="text-[#55C8FF] font-bold">+30 XP</span>
            </div>
            <div className="p-2 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <span>{isRtl ? 'إكمال درس' : 'Complete Lesson'}</span>
              <span className="text-[#55C8FF] font-bold">+100 XP</span>
            </div>
            <div className="p-2 bg-slate-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <span>{isRtl ? 'الشراء بالمتجر' : 'Store Order'}</span>
              <span className="text-[#55C8FF] font-bold">+40 XP</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
