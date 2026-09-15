import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { getOrCreateReferralCode, getReferralStats } from '../utils/referral';
import { ArrowLeft, ArrowRight, Copy, Check, Share2, Users, Star, Rocket, Sparkles } from 'lucide-react';
import { themeStyles } from '../styles/theme';

export default function ReferralPage() {
  const { currentUser, lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const code = getOrCreateReferralCode(currentUser.id, currentUser.name);
  const stats = getReferralStats(currentUser.id);
  const referralLink = `${window.location.origin}/signup?ref=${code}`;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    playSynthSound(600, 'sine', 0.08);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    playSynthSound(650, 'sine', 0.1);
    const shareText = lang === 'ar'
      ? `انضم لي بلودافيا واكتشف الكون معي! استخدم كود دعوتي ${code} واحنا الاثنين نربح نقاط 🚀 ${referralLink}`
      : `Join me on Lodavia and discover the universe together! Use my invite code ${code} — we both earn points 🚀 ${referralLink}`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText, url: referralLink }); } catch {}
    } else {
      navigator.clipboard.writeText(referralLink);
      playSynthSound(600, 'sine', 0.08);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-16 relative animate-[fadeIn_0.3s_ease-out]">
      {/* Ambient Cosmic Glow behind hero */}
      <div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/10 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Subpage Header Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <button
          id="btn-referral-back"
          onClick={() => { playSynthSound(400, 'sine', 0.08); navigate(-1); }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-[#0D1527] hover:bg-slate-100 dark:hover:bg-[#1A2B4C] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 transition-all text-xs font-semibold cursor-pointer shadow-xs active:scale-95"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span className="text-xs font-bold">{isRtl ? 'رجوع' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-cyan-400">
            <Rocket className="w-4 h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {isRtl ? 'ادعُ صديقًا واكسب' : 'Invite & Earn'}
          </h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center max-w-lg">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-2xl sm:text-3xl mb-3 shadow-[0_0_25px_rgba(14,165,233,0.2)]">
            🚀
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {isRtl ? 'كبّر عالم لودافيا' : 'Grow the Lodavia Universe'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isRtl ? 'ادعُ أصدقاءك واكتشفوا الكون معًا 🌌' : 'Invite your friends and explore the cosmos together 🌌'}
          </p>
        </div>

        {/* Invite Code Box (Using glassInput style) */}
        <div className="w-full max-w-lg text-start flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-sky-500 dark:text-cyan-400" />
              {isRtl ? 'كود دعوتك المخصص' : 'Your Invite Code'}
            </span>
            {copied && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-[fadeIn_0.2s_ease-out] flex items-center gap-1">
                <Check className="w-3 h-3" />
                {isRtl ? 'تم النسخ بنجاح' : 'Copied to clipboard'}
              </span>
            )}
          </div>

          <div className={`p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 ${themeStyles.glassInput}`}>
            <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-sky-600 dark:text-cyan-400 select-all">
              {code}
            </span>
            <button 
              id="btn-referral-copy-icon"
              onClick={handleCopyCode} 
              className="p-2 sm:p-2.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
              title={isRtl ? 'نسخ الكود' : 'Copy code'}
              aria-label="Copy Code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Unified Primary & Secondary Buttons */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-3 sm:gap-4">
          <button 
            id="btn-referral-copy-text"
            onClick={handleCopyCode} 
            className={`py-3 sm:py-3.5 px-4 text-xs sm:text-sm ${themeStyles.buttonSecondary}`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الكود' : 'Copy Code')}</span>
          </button>
          
          <button 
            id="btn-referral-share"
            onClick={handleShare} 
            className={`py-3 sm:py-3.5 px-4 text-xs sm:text-sm ${themeStyles.buttonPrimary}`}
          >
            <Share2 className="w-4 h-4" />
            <span>{isRtl ? 'دعوة صديق' : 'Invite a Friend'}</span>
          </button>
        </div>

        {/* Unified Stats Cards (Using glassCard style) */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-3 sm:gap-4">
          <div className={`${themeStyles.glassCard} flex flex-col items-center justify-center text-center gap-2 group hover:border-sky-500/30 transition-all`}>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.invitedCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              {isRtl ? 'أصدقاؤك المدعوون' : 'Friends Invited'}
            </span>
          </div>

          <div className={`${themeStyles.glassCard} flex flex-col items-center justify-center text-center gap-2 group hover:border-amber-500/30 transition-all`}>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.pointsEarned.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
              {isRtl ? 'النقاط المكتسبة' : 'Points Earned'}
            </span>
          </div>
        </div>

        {/* Unified "How it works" Card (Using glassCard style) */}
        <div className={`${themeStyles.glassCard} w-full max-w-lg text-start`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-cyan-400">
              <Rocket className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isRtl ? 'كيف تعمل؟' : 'How it works'}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base">1️⃣</span>
              <p>{isRtl ? 'صديقك يسجّل عبر رابطك ← تربحان 100 نقطة لكل واحد.' : 'Your friend signs up via your link → you both earn 100 points.'}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-base">2️⃣</span>
              <p>{isRtl ? 'صديقك يكمل أول نشاط حقيقي بالتطبيق ← تربح 200 نقطة إضافية.' : 'Your friend completes their first real activity → you earn 200 bonus points.'}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs leading-normal">
              {isRtl ? '⚠️ يوجد حد أقصى يومي وأسبوعي للمكافآت لحماية النظام من إساءة الاستخدام.' : '⚠️ Daily and weekly reward caps apply to prevent abuse.'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

