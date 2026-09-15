import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ChevronLeft, 
  Zap, 
  Crown, 
  Check, 
  X, 
  Brain, 
  Rocket, 
  ShieldCheck, 
  Activity,
  Layers,
  HelpCircle,
  Briefcase,
  ShoppingBag,
  Video,
  Gamepad2,
  Calendar,
  Compass
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SUBSCRIPTION_PLANS, SubscriptionTier, AI_FEATURE_CATALOG } from '../types/subscription';
import SubscriptionUpgradeModal from '../components/SubscriptionUpgradeModal';

export default function AISubscriptionPage() {
  const { currentUser, lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetModalTier, setTargetModalTier] = useState<SubscriptionTier>('pro');

  const isRtl = lang === 'ar';
  const sub = currentUser.subscription || {
    tier: 'free',
    dailyRequestsUsed: 0,
    dailyLimit: 10,
    status: 'active'
  };

  const currentPlan = SUBSCRIPTION_PLANS[sub.tier] || SUBSCRIPTION_PLANS.free;
  const usagePercentage = Math.min(100, Math.round((sub.dailyRequestsUsed / currentPlan.dailyLimit) * 100));

  const handleOpenUpgrade = (tier: SubscriptionTier) => {
    playSynthSound(650, 'sine', 0.1);
    setTargetModalTier(tier);
    setIsUpgradeModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 px-3 md:px-6 animate-[fadeIn_0.5s_ease-out]" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent">
              {isRtl ? 'اشتراكات Lodavia AI الكونية' : 'Lodavia AI Subscription Hub'}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {isRtl 
                ? 'إدارة خطتك الحالية، متابعة الرصيد اليومي، وفتح أحدث الميزات المتقدمة' 
                : 'Manage your plan, track daily usage, and unlock advanced AI suites'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            navigate('/settings');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-bold cursor-pointer select-none"
        >
          {!isRtl && <ChevronLeft className="w-4 h-4" />}
          <span>{isRtl ? 'الإعدادات ⚙️' : 'Settings ⚙️'}</span>
          {isRtl && <ChevronLeft className="w-4 h-4 rotate-180" />}
        </button>
      </div>

      {/* Active User Usage Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/50 via-slate-900/80 to-slate-950 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentPlan.highlightColor} text-white shadow-lg shrink-0`}>
              {sub.tier === 'ultra' ? <Crown className="w-8 h-8 text-amber-300" /> : sub.tier === 'pro' ? <Zap className="w-8 h-8 text-cyan-300" /> : <Brain className="w-8 h-8 text-slate-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">{isRtl ? 'الخطة النشطة:' : 'Active Plan:'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                  {isRtl ? currentPlan.nameAr : currentPlan.nameEn}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {isRtl ? currentPlan.taglineAr : currentPlan.taglineEn}
              </h2>
            </div>
          </div>

          {/* Usage Meter */}
          <div className="w-full lg:w-72 p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isRtl ? 'الاستخدام اليومي:' : 'Daily Quota:'}</span>
              </span>
              <span className="font-bold text-white">
                {sub.dailyRequestsUsed} / {currentPlan.dailyLimit} {isRtl ? 'طلب' : 'reqs'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-500 ${
                  usagePercentage > 85 ? 'bg-rose-500' : usagePercentage > 60 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-end">
              {isRtl ? 'يتجدد الرصيد تلقائياً كل 24 ساعة' : 'Resets automatically every 24 hours'}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Cards comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {(['free', 'pro', 'ultra'] as SubscriptionTier[]).map((tierKey) => {
          const plan = SUBSCRIPTION_PLANS[tierKey];
          const isCurrent = sub.tier === tierKey;

          return (
            <div
              key={tierKey}
              className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? 'border-purple-500/50 bg-gradient-to-b from-purple-900/30 via-slate-900/90 to-slate-950 shadow-2xl shadow-purple-500/10'
                  : 'border-white/10 bg-slate-900/60'
              }`}
            >
              {plan.badgeAr && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md">
                  {isRtl ? plan.badgeAr : plan.badgeEn}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {tierKey === 'ultra' && <Crown className="w-5 h-5 text-amber-400" />}
                    {tierKey === 'pro' && <Zap className="w-5 h-5 text-cyan-400" />}
                    {tierKey === 'free' && <Brain className="w-5 h-5 text-slate-400" />}
                    <span>{isRtl ? plan.nameAr : plan.nameEn}</span>
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">
                  {isRtl ? plan.taglineAr : plan.taglineEn}
                </p>

                <div className="mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.monthlyPriceUSD === 0 ? (isRtl ? 'مجاناً' : 'Free') : `$${plan.monthlyPriceUSD}`}
                    </span>
                    {plan.monthlyPriceUSD > 0 && (
                      <span className="text-xs text-slate-400">
                        / {isRtl ? `شهرياً (${plan.monthlyPriceSAR} ر.س)` : 'mo'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cyan-400 font-bold mt-1">
                    ⚡ {plan.dailyLimit} {isRtl ? 'طلب/يومياً' : 'requests/day'}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 text-xs text-slate-300">
                  {(isRtl ? plan.featuresAr : plan.featuresEn).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 text-xs font-bold cursor-default select-none border border-white/5"
                  >
                    {isRtl ? 'الخطة المفعّلة حالياً' : 'Current Active Plan'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenUpgrade(tierKey)}
                    className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none ${
                      tierKey === 'ultra'
                        ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950'
                        : tierKey === 'pro'
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                    }`}
                  >
                    <Rocket className="w-4 h-4" />
                    <span>
                      {tierKey === 'free' 
                        ? (isRtl ? 'التحويل للمجانية' : 'Switch to Free') 
                        : (isRtl ? `الترقية إلى ${plan.nameAr}` : `Upgrade to ${plan.nameEn}`)}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Catalog Matrix */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/60 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg md:text-xl font-bold text-white">
            {isRtl ? 'دليل ميزات الذكاء الاصطناعي الشامل' : 'Comprehensive AI Feature Matrix'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_FEATURE_CATALOG.map((feat) => {
            const isAvailableForUser = 
              sub.tier === 'ultra' || 
              (sub.tier === 'pro' && feat.minTier !== 'ultra') || 
              (sub.tier === 'free' && feat.minTier === 'free');

            return (
              <div 
                key={feat.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  isAvailableForUser 
                    ? 'bg-white/[0.02] border-white/10 hover:border-cyan-500/30' 
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  feat.minTier === 'ultra' ? 'bg-amber-500/20 text-amber-300' : feat.minTier === 'pro' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {feat.minTier === 'ultra' ? <Crown className="w-4 h-4" /> : feat.minTier === 'pro' ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">
                      {isRtl ? feat.titleAr : feat.titleEn}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      feat.minTier === 'ultra' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : feat.minTier === 'pro'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {feat.minTier.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {isRtl ? feat.descriptionAr : feat.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Modal Component */}
      <SubscriptionUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredTier={targetModalTier}
      />

    </div>
  );
}
