import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CosmicPack, CosmeticItem, Rarity } from '../../types/cosmicPacks';
import { RARITY_CONFIG } from '../../config/cosmicPacksConfig';
import { CosmeticPreview } from './CosmeticPreview';
import { Sparkles, Check, FastForward, Gem, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { playSuccessSound, playUnboxingBurstSound } from '../../utils/soundEffects';

interface PackOpeningModalProps {
  isOpen: boolean;
  pack: CosmicPack;
  rewardItem: CosmeticItem | null;
  isDuplicate: boolean;
  shardsAwarded: number;
  lang: string;
  onClose: () => void;
  onEquipNow?: (item: CosmeticItem) => void;
  playSynthSound: (freq: number, type: OscillatorType, duration: number) => void;
}

export type UnboxingPhase = 'anticipation' | 'burst' | 'revealed';

export function getItemTier(rarity?: Rarity): 'common' | 'rare' | 'epic_legendary' {
  if (!rarity) return 'common';
  if (rarity === 'LEGENDARY' || rarity === 'EPIC') return 'epic_legendary';
  if (rarity === 'RARE') return 'rare';
  return 'common';
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  isOpen,
  pack,
  rewardItem,
  isDuplicate,
  shardsAwarded,
  lang,
  onClose,
  onEquipNow,
  playSynthSound
}) => {
  const [phase, setPhase] = useState<UnboxingPhase>('anticipation');
  const [isEquipped, setIsEquipped] = useState(false);
  const soundPlayedRef = useRef(false);

  const tier = getItemTier(rewardItem?.rarity);
  const rarity = rewardItem ? (RARITY_CONFIG[rewardItem.rarity] || RARITY_CONFIG.COMMON) : RARITY_CONFIG.COMMON;
  const isRtl = lang === 'ar';

  // 1. Stage Sequencing: Anticipation (1.8s) -> Burst (0.7s) -> Revealed
  useEffect(() => {
    if (isOpen && rewardItem) {
      setPhase('anticipation');
      setIsEquipped(false);
      soundPlayedRef.current = false;

      // Stage A Sound: Escalating cosmic anticipation hum
      playSynthSound(tier === 'epic_legendary' ? 260 : tier === 'rare' ? 330 : 400, 'sine', 0.4);
      const humTimer = setTimeout(() => {
        playSynthSound(tier === 'epic_legendary' ? 440 : tier === 'rare' ? 520 : 580, 'triangle', 0.3);
      }, 900);

      // Transition to Stage B: Burst at 1800ms
      const tBurst = setTimeout(() => {
        setPhase('burst');
        playUnboxingBurstSound(tier);
      }, 1800);

      // Transition to Stage C: Revealed at 2500ms (1800ms + 700ms)
      const tReveal = setTimeout(() => {
        setPhase('revealed');
        if (!soundPlayedRef.current) {
          soundPlayedRef.current = true;
          playSuccessSound(tier);
        }
      }, 2500);

      return () => {
        clearTimeout(humTimer);
        clearTimeout(tBurst);
        clearTimeout(tReveal);
      };
    }
  }, [isOpen, rewardItem?.id, tier]);

  // Generate burst particles dynamically scaled to the item's rarity tier
  const particles = useMemo(() => {
    const count = tier === 'epic_legendary' ? 44 : tier === 'rare' ? 24 : 12;
    const colors = tier === 'epic_legendary' 
      ? ['#F59E0B', '#FBBF24', '#FCD34D', '#A855F7', '#EC4899', '#FFFFFF']
      : tier === 'rare'
      ? ['#06B6D4', '#0EA5E9', '#38BDF8', '#7DD3FC', '#FFFFFF']
      : ['#94A3B8', '#CBD5E1', '#E2E8F0', '#FFFFFF'];

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 2 * Math.PI + (Math.sin(i) * 0.2);
      const distance = 90 + (i % 5) * (tier === 'epic_legendary' ? 35 : tier === 'rare' ? 25 : 15);
      const size = 4 + (i % 4) * 2;
      const color = colors[i % colors.length];
      const duration = 0.55 + (i % 3) * 0.1;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size,
        color,
        duration,
      };
    });
  }, [tier, rewardItem?.id]);

  if (!isOpen || !rewardItem) return null;

  const handleSkip = () => {
    setPhase('revealed');
    if (!soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playSuccessSound(tier);
    }
  };

  const handleEquip = () => {
    if (onEquipNow && rewardItem) {
      onEquipNow(rewardItem);
      setIsEquipped(true);
      playSynthSound(1200, 'triangle', 0.2);
    }
  };

  // Visual styling mapped directly to the rarity tier
  const tierVisuals = {
    common: {
      capsuleBorder: 'border-slate-400/90 dark:border-slate-500',
      capsuleGlow: 'shadow-[0_0_30px_rgba(148,163,184,0.35)]',
      capsuleBg: 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950',
      tagTextAr: 'حزمة كبسولة عادية ⚪',
      tagTextEn: 'Standard Capsule ⚪',
      tagColor: 'text-slate-300 bg-slate-800/80 border-slate-600/50',
      shockwaveColor: 'rgba(148, 163, 184, 0.4)',
      burstFlash: 'bg-white/40',
    },
    rare: {
      capsuleBorder: 'border-sky-400 dark:border-cyan-400',
      capsuleGlow: 'shadow-[0_0_45px_rgba(6,182,212,0.55)] pack-glow-rare',
      capsuleBg: 'bg-gradient-to-b from-cyan-950 via-slate-900 to-void-950',
      tagTextAr: 'كبسولة نادرة استثنائية 🔷',
      tagTextEn: 'Rare Cosmic Capsule 🔷',
      tagColor: 'text-cyan-200 bg-cyan-950/80 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
      shockwaveColor: 'rgba(6, 182, 212, 0.65)',
      burstFlash: 'bg-cyan-300/60',
    },
    epic_legendary: {
      capsuleBorder: 'border-amber-400 dark:border-amber-400',
      capsuleGlow: 'shadow-[0_0_60px_rgba(245,158,11,0.7)] pack-glow-legendary',
      capsuleBg: 'bg-gradient-to-b from-amber-950/90 via-purple-950/80 to-void-950',
      tagTextAr: 'كبسولة أسطورية ملكية 👑✨',
      tagTextEn: 'Imperial Legendary Relic 👑✨',
      tagColor: 'text-amber-200 bg-amber-950/90 border-amber-400/80 shadow-[0_0_16px_rgba(245,158,11,0.6)]',
      shockwaveColor: 'rgba(245, 158, 11, 0.8)',
      burstFlash: 'bg-amber-200/80',
    }
  }[tier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/95 backdrop-blur-2xl animate-[fadeIn_0.25s_ease-out] select-none">
      
      {/* Top Controls: Skip & Quick Exit */}
      <div className="absolute top-4 right-4 left-4 flex justify-between items-center z-30">
        {phase !== 'revealed' ? (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer border border-white/20 shadow-sm"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تخطي العرض ⚡' : 'Skip Animation ⚡'}</span>
          </button>
        ) : <div />}

        <button
          onClick={onClose}
          aria-label="Close unboxing"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer border border-white/15 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-full max-w-lg flex flex-col items-center justify-center text-center">

        {/* ======================================================== */}
        {/* STAGE A: ANTICIPATION (الترقب: كبسولة تهتز وتتوهج بتصاعد) */}
        {/* ======================================================== */}
        {phase === 'anticipation' && (
          <div className="flex flex-col items-center justify-center gap-8 py-8 w-full">
            
            {/* Ambient Background Aura */}
            <div
              className="absolute w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-30 animate-pulse"
              style={{ background: tierVisuals.shockwaveColor }}
            />

            {/* Glowing & Vibrating Capsule */}
            <div className={`relative w-52 h-72 rounded-3xl border-3 ${tierVisuals.capsuleBorder} ${tierVisuals.capsuleGlow} ${tierVisuals.capsuleBg} flex flex-col items-center justify-between p-5 overflow-hidden animate-unboxing-shake transition-all duration-300`}>
              
              {/* Diagonal Shine for Epic/Legendary */}
              {tier === 'epic_legendary' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  <div className="absolute w-[60%] h-[350%] -top-[120%] left-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pack-shine-sweep" />
                </div>
              )}

              {/* Artwork / Pack Texture Behind Capsule */}
              <img
                src={pack.bannerImage}
                alt={pack.nameAr}
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
              />

              {/* Top Tier Tag */}
              <div className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md ${tierVisuals.tagColor}`}>
                {isRtl ? tierVisuals.tagTextAr : tierVisuals.tagTextEn}
              </div>

              {/* Central Glowing Icon */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] filter">
                  {pack.icon}
                </span>
                <span className="text-xs font-black text-white/90 drop-shadow">
                  {isRtl ? pack.nameAr : pack.nameEn}
                </span>
              </div>

              {/* Charging Energy Progress Bar */}
              <div className="relative z-10 w-full flex flex-col items-center gap-1.5">
                <div className="w-full h-2 rounded-full bg-black/60 border border-white/20 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full animate-pulse transition-all duration-300"
                    style={{
                      width: '100%',
                      background: tier === 'epic_legendary'
                        ? 'linear-gradient(90deg, #F59E0B, #FBBF24, #FFFFFF)'
                        : tier === 'rare'
                        ? 'linear-gradient(90deg, #0284C7, #06B6D4, #FFFFFF)'
                        : 'linear-gradient(90deg, #64748B, #94A3B8, #FFFFFF)'
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/70">
                  {isRtl ? 'طاقة كبسولة الحزمة تتصاعد...' : 'Cosmic energy surging...'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                {isRtl ? 'المرحلة 1: جاري فك شيفرة الحزمة وفتحها...' : 'Phase 1: Unsealing & Decrypting Pack...'}
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE B: BURST (الانفجار: ومضة ضوء وجسيمات متطايرة)      */}
        {/* ======================================================== */}
        {phase === 'burst' && (
          <div className="relative w-full h-80 flex items-center justify-center overflow-visible">
            
            {/* Rotating Golden Sunburst Rays for Legendary/Epic */}
            {tier === 'epic_legendary' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[500px] h-[500px] rounded-full animate-sunburst opacity-40 bg-[radial-gradient(circle,_#F59E0B_0%,_transparent_70%)]" />
                <div className="absolute w-[600px] h-[600px] animate-sunburst opacity-30">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-[300px] -translate-x-1/2 -translate-y-full origin-bottom bg-gradient-to-t from-amber-400 to-transparent"
                      style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Expanding Shockwave Ring */}
            <div
              className="absolute w-40 h-40 rounded-full animate-unboxing-burst pointer-events-none z-10 border-4"
              style={{ borderColor: tierVisuals.shockwaveColor }}
            />

            {/* Radiant Screen Center Flash */}
            <div
              className={`absolute w-56 h-56 rounded-full blur-2xl animate-unboxing-burst pointer-events-none z-15 ${tierVisuals.burstFlash}`}
            />

            {/* Dispersing Flying Particles */}
            <div className="relative w-0 h-0 z-20 pointer-events-none">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full shadow-lg"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}`,
                    transform: `translate(${p.x}px, ${p.y}px)`,
                    transition: `all ${p.duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}
                />
              ))}
            </div>

            {/* Central Energy Spark */}
            <div className="relative z-30 flex flex-col items-center gap-2">
              <span className="text-7xl animate-ping opacity-90">{pack.icon}</span>
              <span className="text-sm font-black text-white drop-shadow-lg">
                {isRtl ? '💥 انبثاق المكافأة!' : '💥 Reward Burst!'}
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE C: REVEAL (الكشف: العنصر الفعلي وشارة ندرته وزر الإغلاق) */}
        {/* ======================================================== */}
        {phase === 'revealed' && (
          <div className="w-full flex flex-col items-center gap-5 p-6 rounded-3xl bg-void-900/95 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.85)] animate-scale-reveal relative overflow-hidden">
            
            {/* Ambient Rarity Glow In Card Background */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${rarity.glowColor}, transparent 70%)` }}
            />

            {/* Rotating Sunbeams for Legendary/Epic */}
            {tier === 'epic_legendary' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[450px] h-[450px] animate-sunburst bg-[conic-gradient(from_0deg,_transparent_0deg,_#F59E0B_20deg,_transparent_40deg,_#F59E0B_60deg,_transparent_80deg)]" />
              </div>
            )}

            {/* Header Title with Unlocked Celebration */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-xs font-black tracking-widest text-amber-400 uppercase mb-1">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>{isRtl ? '✨ تم فتح المكافأة الكونية بنجاح ✨' : '✨ COSMIC REWARD UNLOCKED ✨'}</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${rarity.color} drop-shadow-md`}>
                {isRtl ? rewardItem.nameAr : rewardItem.nameEn}
              </h2>
            </div>

            {/* Central Reward Visual Box with Scale-In Motion */}
            <div className={`relative p-8 rounded-2xl ${rarity.bgColor} border-2 ${rarity.borderColor} shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center min-w-[260px] z-10`}>
              <CosmeticPreview item={rewardItem} size="lg" showLabel={false} />
            </div>

            {/* Item Description */}
            <p className="text-xs text-white/80 max-w-sm leading-relaxed z-10 font-medium">
              {isRtl ? rewardItem.descriptionAr : rewardItem.descriptionEn}
            </p>

            {/* Duplicate Item Converted to Shards Notice */}
            {isDuplicate && (
              <div className="w-full p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-between gap-3 shadow-inner z-10">
                <div className="flex items-center gap-2 text-right">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {isRtl 
                      ? 'عنصر مملوك مسبقاً! تم تحويل التكرار تلقائياً إلى شظايا كونية:' 
                      : 'Duplicate item! Converted automatically into Cosmic Shards:'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/30 px-3 py-1 rounded-full border border-amber-400/40 text-amber-200 shrink-0 font-black">
                  <Gem className="w-3.5 h-3.5 text-cyan-300" />
                  <span>+{shardsAwarded}</span>
                </div>
              </div>
            )}

            {/* Rarity Tier Badge Clearly Positioned */}
            <div className="flex items-center gap-2 z-10">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${rarity.badgeBg} shadow-md`}>
                {rarity.nameAr}
              </span>
              <span className="text-xs font-bold text-white/60">
                ({isRtl ? pack.nameAr : pack.nameEn})
              </span>
            </div>

            {/* Actions: "رائع! متابعة 🎉" Button + "تجهيز فوراً ⚡" */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-3 z-10">
              
              {!isDuplicate && onEquipNow && (
                <button
                  onClick={handleEquip}
                  disabled={isEquipped}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                    isEquipped
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-sky-500/25'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isRtl ? 'تم التجهيز في المظهر ✨' : 'Equipped to Profile ✨'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isRtl ? 'تجهيز فوراً ⚡' : 'Equip Now ⚡'}</span>
                    </>
                  )}
                </button>
              )}

              {/* The Requested Primary "رائع! متابعة 🎉" Button */}
              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'رائع! متابعة 🎉' : 'Awesome! Continue 🎉'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
