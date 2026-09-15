import React, { useState } from 'react';
import { CosmicPack, CosmeticItem, PackCategory } from '../../types/cosmicPacks';
import { COSMIC_PACKS_CATALOG, COSMETIC_ITEMS_CATALOG, RARITY_CONFIG } from '../../config/cosmicPacksConfig';
import { CosmeticPreview } from './CosmeticPreview';
import { Sparkles, Gem, Coins, Gift, Eye, Flame, Shield, HelpCircle, X, ChevronRight, Check } from 'lucide-react';

interface CosmicPacksStoreProps {
  userPoints: number;
  userShards: number;
  inventory: string[];
  lastDailyRewardClaim: string | null;
  lang: string;
  onBuyAndOpenPack: (pack: CosmicPack) => void;
  onClaimDailyReward: () => void;
  playSynthSound: (freq: number, type: OscillatorType, duration: number) => void;
}

type PackRarityTier = 'common' | 'rare' | 'epic_legendary';

const getPackRarityTier = (pack: CosmicPack): PackRarityTier => {
  const range = (pack.rarityRangeEn || '').toLowerCase();
  const category = (pack.category || '').toLowerCase();

  if (range.includes('legendary') || range.includes('epic') || category === 'legendary' || category === 'seasonal') {
    return 'epic_legendary';
  }
  if (range.includes('rare') || category === 'cosmic' || category === 'explorer') {
    return 'rare';
  }
  return 'common';
};

export const CosmicPacksStore: React.FC<CosmicPacksStoreProps> = ({
  userPoints,
  userShards,
  inventory,
  lastDailyRewardClaim,
  lang,
  onBuyAndOpenPack,
  onClaimDailyReward,
  playSynthSound
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PackCategory | 'all'>('all');
  const [previewPack, setPreviewPack] = useState<CosmicPack | null>(null);

  // Check if daily reward can be claimed (24 hours check)
  const canClaimDaily = !lastDailyRewardClaim || (Date.now() - new Date(lastDailyRewardClaim).getTime()) > 86400000;

  const filteredPacks = COSMIC_PACKS_CATALOG.filter(pack => {
    if (selectedCategory !== 'all' && pack.category !== selectedCategory) return false;
    return true;
  });

  const categories: { id: PackCategory | 'all'; nameAr: string; nameEn: string; icon: string }[] = [
    { id: 'all', nameAr: 'جميع الحزم 🌌', nameEn: 'All Packs 🌌', icon: '🌌' },
    { id: 'starter', nameAr: 'المبتدئين 🎁', nameEn: 'Starter 🎁', icon: '🎁' },
    { id: 'cosmic', nameAr: 'المجرة 🌌', nameEn: 'Cosmic 🌌', icon: '🌌' },
    { id: 'explorer', nameAr: 'الرواد 🚀', nameEn: 'Explorer 🚀', icon: '🚀' },
    { id: 'legendary', nameAr: 'الأسطورية 👑', nameEn: 'Legendary 👑', icon: '👑' },
    { id: 'ai', nameAr: 'الذكاء الاصطناعي 🤖', nameEn: 'AI Companion 🤖', icon: '🤖' },
    { id: 'creator', nameAr: 'صناع المحتوى 🎨', nameEn: 'Creators 🎨', icon: '🎨' },
    { id: 'seasonal', nameAr: 'الموسمية 🔥', nameEn: 'Seasonal 🔥', icon: '🔥' }
  ];

  const legendaryPack = COSMIC_PACKS_CATALOG.find(p => p.id === 'pack_legendary');

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease-out]">

      {/* 1. Wallet & Currency Balance Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-void-900 dark:via-purple-950/40 dark:to-void-900 border border-slate-200 dark:border-aurora-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-aurora-500/10 border border-sky-500/30 dark:border-aurora-500/30 flex items-center justify-center text-3xl shadow-inner">
            🎁
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] dark:text-white">
              {lang === 'ar' ? 'متجر الحزم الكونية ومكافآت لودافيا' : 'Cosmic Packs & Reward Store'}
            </h2>
            <p className="text-xs text-[#475569] dark:text-white/60 mt-0.5 font-medium">
              {lang === 'ar' ? 'افتح الحزم الكونية، اجمع العناصر الأسطورية، وحوّل التكرارات إلى شظايا!' : 'Open Cosmic Packs, unlock legendary items, and convert duplicates to Shards!'}
            </p>
          </div>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          {/* Points */}
          <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">{lang === 'ar' ? 'نقاط لودافيا' : 'Lodavia Points'}</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400">{userPoints.toLocaleString()}</div>
            </div>
          </div>

          {/* Cosmic Shards */}
          <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5">
            <Gem className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-bold">{lang === 'ar' ? 'الشظايا الكونية' : 'Cosmic Shards'}</div>
              <div className="text-base font-black text-cyan-600 dark:text-cyan-400">{userShards.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Daily Cosmic Reward Box & Event Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Daily Cosmic Reward */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-amber-950/40 dark:via-purple-950/30 dark:to-void-950 border border-amber-500/30 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 text-2xl">
                🎁
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  {lang === 'ar' ? 'مكافأة يومية مجانية' : 'FREE DAILY REWARD'}
                </span>
                <h3 className="text-base font-bold text-[#111827] dark:text-white">
                  {lang === 'ar' ? 'هدية الكوزموس اليومية' : 'Daily Cosmic Gift'}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#475569] dark:text-white/70 leading-relaxed font-medium">
            {lang === 'ar' 
              ? 'سجل دخولك يومياً واطلب هدية مجانية تحتوي على نقاط، شظايا، أو حزمة كويكبات مجانية!' 
              : 'Claim your daily free reward of points, shards, or a bonus cosmic pack!'}
          </p>

          <button
            onClick={() => {
              if (canClaimDaily) {
                onClaimDailyReward();
                playSynthSound(900, 'sine', 0.2);
              }
            }}
            disabled={!canClaimDaily}
            className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              canClaimDaily
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40 cursor-not-allowed border border-slate-200 dark:border-white/10'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>
              {canClaimDaily 
                ? (lang === 'ar' ? 'طالب بالمكافأة اليومية 🎁' : 'Claim Daily Reward 🎁')
                : (lang === 'ar' ? 'تم الطلب! عُد بعد 24 ساعة ⏳' : 'Claimed! Check back tomorrow ⏳')}
            </span>
          </button>
        </div>

        {/* Cosmic Week Event Banner */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-sky-50 dark:bg-gradient-to-r dark:from-purple-950 dark:via-cyan-950 dark:to-void-950 border border-sky-200 dark:border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-md">
          <div className="flex items-center gap-4 z-10">
            <div className="p-3.5 rounded-2xl bg-sky-500/20 dark:bg-cyan-500/20 text-sky-600 dark:text-cyan-300 border border-sky-500/40 dark:border-cyan-500/40 text-3xl shrink-0">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider">
                  {lang === 'ar' ? 'حدث محدود الوقت' : 'LIMITED TIME EVENT'}
                </span>
                <span className="text-[10px] text-sky-700 dark:text-cyan-300 font-bold">🌌 COSMIC WEEK 2026</span>
              </div>
              <h3 className="text-lg font-black text-[#111827] dark:text-white mt-1">
                {lang === 'ar' ? 'حدث أسبوع لودافيا الكوني 🚀' : 'Lodavia Cosmic Week Arena 🚀'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-white/70 mt-1 max-w-md font-medium">
                {lang === 'ar' 
                  ? 'افتح الحزم الموسيمة باستخدام الشظايا الكونية واحصل على إطارات وخلفيات حصرية لن تعود مرة أخرى!'
                  : 'Unlock seasonal packs using Cosmic Shards for exclusive event-limited frames & wallpapers!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('seasonal')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shrink-0 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{lang === 'ar' ? 'استكشف الحزم الحصرية ⚡' : 'Explore Event Packs ⚡'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2.5. Featured Promotional Legendary Spotlight Card */}
      {legendaryPack && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-purple-950/20 dark:from-amber-950/40 dark:via-purple-950/30 dark:to-void-950 border-2 border-amber-400 dark:border-amber-400 pack-glow-legendary p-5 sm:p-6 shadow-xl transition-all">
          {/* Diagonal Shine Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-3xl">
            <div className="absolute w-[60%] h-[350%] -top-[120%] left-0 bg-gradient-to-r from-transparent via-white/30 dark:via-amber-200/35 to-transparent pack-shine-sweep pointer-events-none" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg group">
                <img
                  src={legendaryPack.bannerImage}
                  alt={legendaryPack.nameAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute top-1 right-1 text-base">👑</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black border border-amber-300 flex items-center gap-1 shadow-xs">
                    <span>👑</span>
                    <span>{lang === 'ar' ? 'عرض ترويجي أسطوري' : 'Legendary Spotlight'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/60 text-amber-200 text-[10px] font-bold">
                    {lang === 'ar' ? legendaryPack.rarityRangeAr : legendaryPack.rarityRangeEn}
                  </span>
                  <span className="text-[11px] font-black text-amber-500 dark:text-amber-400">
                    {legendaryPack.price.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'Pts'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {lang === 'ar' ? legendaryPack.nameAr : legendaryPack.nameEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-white/70 max-w-xl font-medium mt-1 leading-relaxed">
                  {lang === 'ar' ? legendaryPack.descriptionAr : legendaryPack.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-white/50">{lang === 'ar' ? 'أبرز الجوائز:' : 'Key Drops:'}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                    ✦ {lang === 'ar' ? 'تاج العرش الذهبي' : 'Golden Crown'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-purple-600 dark:text-purple-300">
                    ✦ {lang === 'ar' ? 'التفرد الكوني' : 'Singularity Void'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-cyan-600 dark:text-cyan-300">
                    ✦ {lang === 'ar' ? 'الاسم البراق' : 'Golden Name'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSynthSound(850, 'triangle', 0.15);
                setSelectedCategory('all');
                setTimeout(() => {
                  const targetEl = document.getElementById('pack-card-pack_legendary');
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('ring-4', 'ring-amber-400', 'scale-[1.02]');
                    setTimeout(() => {
                      targetEl.classList.remove('ring-4', 'ring-amber-400', 'scale-[1.02]');
                    }, 2200);
                  }
                }, 120);
              }}
              className="w-full lg:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Eye className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ar' ? 'عرض الحزمة في القائمة 🔍' : 'View Pack in Catalog 🔍'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Category Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { playSynthSound(400, 'sine', 0.08); setSelectedCategory(cat.id); }}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-sky-600 dark:bg-gradient-to-r dark:from-sky-500 dark:to-cyan-400 text-white font-black shadow-md shadow-sky-500/25 ring-2 ring-sky-400/40'
                : 'bg-white dark:bg-void-900/60 hover:bg-slate-100 dark:hover:bg-void-800 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* 4. Cosmic Pack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacks.map((pack) => {
          const isShards = pack.currency === 'shards';
          const canAfford = isShards ? userShards >= pack.price : userPoints >= pack.price;
          const tier = getPackRarityTier(pack);

          // Card styles strictly matching requested rarity tiers:
          // 1. عادي/غير شائع: إطار رمادي فاتح هادئ، بدون تأثيرات إضافية
          // 2. نادر: إطار بلون العلامة التجارية (الأزرق السماوي)، مع توهج خفيف جداً وثابت حول البطاقة
          // 3. أسطوري/ملحمي: إطار ذهبي واضح مع توهج نابض (pulsing glow) مستمر وخفيف + تأثير لمعان (shine sweep) قطري كل 4-5 ثوانٍ
          const tierCardStyles = {
            common: 'border-slate-300 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600',
            rare: 'border-sky-400 dark:border-cyan-400 pack-glow-rare hover:border-sky-300 dark:hover:border-cyan-300',
            epic_legendary: 'border-amber-400 dark:border-amber-400 pack-glow-legendary hover:border-amber-300'
          }[tier];

          const tierBadgeStyles = {
            common: 'bg-black/70 border-white/20 text-white',
            rare: 'bg-cyan-950/80 border-cyan-400/60 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.4)]',
            epic_legendary: 'bg-amber-950/85 border-amber-400/70 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
          }[tier];

          // Marketing badges
          const marketingBadge = pack.marketingBadge || (pack.availability === 'seasonal' || pack.availability === 'limited' ? 'limited_time' : null);
          const marketingBadgeInfo = marketingBadge ? {
            best_seller: {
              textAr: 'الأكثر مبيعاً 🔥',
              textEn: 'Best Seller 🔥',
              style: 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-500/30'
            },
            new: {
              textAr: 'جديد ✨',
              textEn: 'New ✨',
              style: 'bg-emerald-500 text-white border-emerald-300 font-black shadow-md shadow-emerald-500/30'
            },
            limited_time: {
              textAr: 'لفترة محدودة ⏳',
              textEn: 'Limited Time ⏳',
              style: 'bg-rose-500 text-white border-rose-300 font-black shadow-md shadow-rose-500/30 animate-pulse'
            }
          }[marketingBadge] : null;

          return (
            <div
              key={pack.id}
              id={`pack-card-${pack.id}`}
              className={`group relative rounded-3xl bg-white dark:bg-void-900/90 border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between ${tierCardStyles}`}
            >
              {/* Diagonal Shine Sweep for Legendary / Epic Packs */}
              {tier === 'epic_legendary' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 rounded-3xl">
                  <div className="absolute w-[60%] h-[350%] -top-[120%] left-0 bg-gradient-to-r from-transparent via-white/30 dark:via-amber-200/35 to-transparent pack-shine-sweep pointer-events-none" />
                </div>
              )}

              {/* Artwork Header */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={pack.bannerImage}
                  alt={pack.nameAr}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Marketing Badge (Top-Left) */}
                {marketingBadgeInfo && (
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[10px] flex items-center gap-1 shadow-md z-20 ${marketingBadgeInfo.style}`}>
                    <span>{lang === 'ar' ? marketingBadgeInfo.textAr : marketingBadgeInfo.textEn}</span>
                  </div>
                )}

                {/* Availability / Rarity Badge (Top-Right) */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur border text-[10px] font-bold flex items-center gap-1.5 shadow z-10 ${tierBadgeStyles}`}>
                  <span>{pack.icon}</span>
                  <span>{lang === 'ar' ? pack.rarityRangeAr : pack.rarityRangeEn}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                  <h3 className="text-lg font-black text-white drop-shadow-md">
                    {lang === 'ar' ? pack.nameAr : pack.nameEn}
                  </h3>
                </div>
              </div>

              {/* Description & Rewards Info */}
              <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                <p className="text-xs text-[#475569] dark:text-white/70 leading-relaxed font-medium">
                  {lang === 'ar' ? pack.descriptionAr : pack.descriptionEn}
                </p>

                {/* Price Tag */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-void-950/80 border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-[#64748B] dark:text-white/60 font-medium">{lang === 'ar' ? 'سعر الحزمة:' : 'Pack Price:'}</span>
                  <div className="flex items-center gap-1.5 font-black text-sm">
                    {isShards ? (
                      <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                        <Gem className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                        {pack.price} {lang === 'ar' ? 'شظية' : 'Shards'}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        {pack.price} {lang === 'ar' ? 'نقطة' : 'Points'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Preview & Buy */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.1);
                      setPreviewPack(pack);
                    }}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/15 transition-all active:scale-95 cursor-pointer"
                    title={lang === 'ar' ? 'معاينة العناصر المحتملة' : 'Preview items'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (canAfford) {
                        onBuyAndOpenPack(pack);
                        playSynthSound(900, 'sine', 0.2);
                      }
                    }}
                    disabled={!canAfford}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-sky-600 hover:bg-sky-500 dark:bg-gradient-to-r dark:from-aurora-500 dark:to-cyan-500 text-white dark:text-void-950 shadow-md active:scale-95'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 border border-slate-200 dark:border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {canAfford 
                        ? (lang === 'ar' ? 'شراء وفتح الحزمة ⚡' : 'Buy & Open Pack ⚡')
                        : (lang === 'ar' ? 'رصيد غير كافٍ 🔒' : 'Insufficient Balance 🔒')}
                    </span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* PACK PREVIEW MODAL */}
      {previewPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-void-900 border border-white/15 shadow-2xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewPack(null)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <span className="text-4xl">{previewPack.icon}</span>
              <div>
                <h3 className="text-xl font-extrabold text-white">{lang === 'ar' ? previewPack.nameAr : previewPack.nameEn}</h3>
                <span className="text-xs text-aurora-400 font-bold">{lang === 'ar' ? previewPack.rarityRangeAr : previewPack.rarityRangeEn}</span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {lang === 'ar' ? previewPack.descriptionAr : previewPack.descriptionEn}
            </p>

            {/* Possible Rewards List */}
            <div>
              <h4 className="text-xs font-black uppercase text-white/60 tracking-wider mb-3">
                {lang === 'ar' ? 'العناصر المحتملة داخل هذه الحزمة:' : 'Possible items inside this pack:'}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewPack.possibleRewardIds.map(itemId => {
                  const item = COSMETIC_ITEMS_CATALOG.find(i => i.id === itemId);
                  if (!item) return null;
                  const rarity = RARITY_CONFIG[item.rarity];

                  return (
                    <div key={item.id} className={`p-3 rounded-2xl ${rarity.bgColor} border ${rarity.borderColor} flex flex-col items-center text-center gap-2`}>
                      <CosmeticPreview item={item} size="sm" showLabel={false} />
                      <span className="text-[11px] font-bold text-white truncate max-w-full">{lang === 'ar' ? item.nameAr : item.nameEn}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border ${rarity.badgeBg}`}>{rarity.nameAr}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase Confirmation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-white/70">
                <span>{lang === 'ar' ? 'سعر الحزمة: ' : 'Cost: '}</span>
                <span className="font-bold text-amber-400">{previewPack.price} {previewPack.currency}</span>
              </div>

              <button
                onClick={() => {
                  const packToBuy = previewPack;
                  setPreviewPack(null);
                  onBuyAndOpenPack(packToBuy);
                }}
                className="py-2.5 px-5 rounded-xl bg-aurora-500 hover:bg-aurora-400 text-void-950 font-black text-xs cursor-pointer shadow-lg shadow-aurora-500/20"
              >
                {lang === 'ar' ? 'تأكيد الشراء والفتح ⚡' : 'Confirm & Open Pack ⚡'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
