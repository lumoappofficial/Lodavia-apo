import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Check, 
  Zap, 
  Crown, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Brain,
  Rocket
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';
import { upgradeSubscription } from '../services/subscriptionService';

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier?: SubscriptionTier;
  featureTitle?: string;
}

export default function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  requiredTier = 'pro',
  featureTitle
}: SubscriptionUpgradeModalProps) {
  const { currentUser, setCurrentUser, lang, playSynthSound } = useApp();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(requiredTier);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isRtl = lang === 'ar';
  const currentSub = currentUser.subscription || { tier: 'free', dailyRequestsUsed: 0, dailyLimit: 10 };

  const handleUpgradeClick = async (tier: SubscriptionTier) => {
    if (tier === currentSub.tier) return;
    setIsUpgrading(true);
    playSynthSound(880, 'sine', 0.15);

    setTimeout(async () => {
      try {
        // Call backend server simulation
        const response = await fetch('/api/ai/upgrade-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetTier: tier, userId: currentUser.id })
        });
        const data = await response.json();

        // Update local state in AppContext & localStorage
        const updatedUser = upgradeSubscription(currentUser, tier);
        setCurrentUser(updatedUser);

        playSynthSound(1046, 'sine', 0.2);
        setTimeout(() => playSynthSound(1318, 'sine', 0.3), 100);

        setSuccessMsg(
          isRtl 
            ? `تهانينا! تم تفعيل خطة ${SUBSCRIPTION_PLANS[tier].nameAr} بنجاح 🎉` 
            : `Congrats! Activated ${SUBSCRIPTION_PLANS[tier].nameEn} successfully 🎉`
        );

        setTimeout(() => {
          setIsUpgrading(false);
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } catch (err) {
        console.error("Failed to upgrade subscription:", err);
        // Local fallback update
        const updatedUser = upgradeSubscription(currentUser, tier);
        setCurrentUser(updatedUser);
        setIsUpgrading(false);
        onClose();
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(124,58,237,0.3)] my-8 text-slate-100 overflow-hidden"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              playSynthSound(400, 'sine', 0.08);
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isRtl ? 'نظام اشتراكات Lodavia AI الكوني' : 'Lodavia AI Freemium Suite'}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent">
              {featureTitle
                ? (isRtl ? `فتح ميزة "${featureTitle}"` : `Unlock "${featureTitle}"`)
                : (isRtl ? 'ترقية اشتراك Lodavia AI' : 'Upgrade Lodavia AI Tier')}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 mt-2">
              {isRtl 
                ? 'استمتع بقدرات الذكاء الاصطناعي الفائقة لبناء المشاريع، أتمتة الجدول، تطوير المحتوى وتأمين التفاوض.' 
                : 'Unlock maximum AI intelligence for project analysis, task automation, content generation & deal negotiation.'}
            </p>
          </div>

          {/* Success Overlay Banner */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center text-sm font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Plan Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {(['free', 'pro', 'ultra'] as SubscriptionTier[]).map((tierKey) => {
              const plan = SUBSCRIPTION_PLANS[tierKey];
              const isCurrent = currentSub.tier === tierKey;
              const isSelected = selectedTier === tierKey;

              return (
                <div
                  key={tierKey}
                  onClick={() => {
                    setSelectedTier(tierKey);
                    playSynthSound(600, 'sine', 0.05);
                  }}
                  className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-b from-purple-900/40 via-slate-900/90 to-slate-950 border-purple-500/50 shadow-xl shadow-purple-500/10'
                      : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                  } ${isSelected ? 'ring-2 ring-cyan-400 border-transparent' : ''}`}
                >
                  {/* Badge */}
                  {plan.badgeAr && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] shadow-md uppercase tracking-wider">
                      {isRtl ? plan.badgeAr : plan.badgeEn}
                    </div>
                  )}

                  <div>
                    {/* Title & Tagline */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        {tierKey === 'ultra' && <Crown className="w-4 h-4 text-amber-400" />}
                        {tierKey === 'pro' && <Zap className="w-4 h-4 text-cyan-400" />}
                        {tierKey === 'free' && <Brain className="w-4 h-4 text-slate-400" />}
                        <span>{isRtl ? plan.nameAr : plan.nameEn}</span>
                      </h3>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-bold">
                          {isRtl ? 'خطة نَشِطة' : 'Active'}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">
                      {isRtl ? plan.taglineAr : plan.taglineEn}
                    </p>

                    {/* Price Tag */}
                    <div className="mb-5 pb-4 border-b border-white/10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">
                          {plan.monthlyPriceUSD === 0 ? (isRtl ? 'مجاناً' : 'Free') : `$${plan.monthlyPriceUSD}`}
                        </span>
                        {plan.monthlyPriceUSD > 0 && (
                          <span className="text-xs text-slate-400">
                            / {isRtl ? `شهر (${plan.monthlyPriceSAR} ر.س)` : 'month'}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-cyan-400/90 font-semibold mt-1">
                        ⚡ {plan.dailyLimit} {isRtl ? 'طلب يومياً' : 'requests/day'}
                      </p>
                    </div>

                    {/* Feature bullet list */}
                    <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                      {(isRtl ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold border border-white/5 cursor-default select-none"
                      >
                        {isRtl ? 'خطتك الحالية' : 'Current Plan'}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgradeClick(tierKey);
                        }}
                        disabled={isUpgrading}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none ${
                          tierKey === 'ultra'
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950'
                            : tierKey === 'pro'
                            ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                        }`}
                      >
                        {isUpgrading && selectedTier === tierKey ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span>
                              {tierKey === 'free'
                                ? (isRtl ? 'التحويل للمجانية' : 'Switch to Free')
                                : (isRtl ? `تفعيل ${plan.nameAr}` : `Upgrade to ${plan.nameEn}`)}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extensible Payment Guarantee & Security Notice */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isRtl 
                  ? 'بنية اشتراكات موثوقة جاهزة للتكامل مع Stripe ومصادر الدفع الإلكتروني' 
                  : 'Extensible subscription framework architecture ready for Stripe integration'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span>{isRtl ? 'إلغاء التجديد في أي وقت' : 'Cancel anytime'}</span>
              <span>•</span>
              <span>{isRtl ? 'دعم فني 24/7' : '24/7 Priority Support'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
