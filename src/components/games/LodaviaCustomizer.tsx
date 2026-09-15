import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Rocket, 
  User, 
  Coins, 
  Check, 
  Lock, 
  Shirt, 
  Glasses, 
  Palette, 
  ShieldCheck, 
  X,
  Zap,
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';
import { AlienAvatarCustomization, StarshipCustomization, CosmeticItem } from '../../types/games';
import { COSMETIC_ITEMS, DEFAULT_AVATAR_CUSTOMIZATION, DEFAULT_STARSHIP_CUSTOMIZATION } from '../../data/universeData';
import { useApp } from '../../contexts/AppContext';

interface LodaviaCustomizerProps {
  playerLevel: number;
  playerCoins: number;
  avatarCustomization: AlienAvatarCustomization;
  starshipCustomization: StarshipCustomization;
  onUpdateAvatar: (updated: AlienAvatarCustomization) => void;
  onUpdateStarship: (updated: StarshipCustomization) => void;
  onDeductCoins: (amount: number) => void;
  onClose?: () => void;
}

export default function LodaviaCustomizer({
  playerLevel,
  playerCoins,
  avatarCustomization,
  starshipCustomization,
  onUpdateAvatar,
  onUpdateStarship,
  onDeductCoins,
  onClose
}: LodaviaCustomizerProps) {
  const { lang, playSynthSound } = useApp();

  // Active Customization Tab
  const [activeSubTab, setActiveSubTab] = useState<'alien' | 'starship'>('alien');

  // Category Filter for Alien: 'head' | 'skin' | 'outfit' | 'accessory'
  const [alienCategory, setAlienCategory] = useState<'head' | 'skin' | 'outfit' | 'accessory'>('head');

  // Unlocked item IDs state
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lodavia_unlocked_cosmetics');
    return saved ? JSON.parse(saved) : ['classic_alien', 'emerald_green', 'space_suit', 'antenna_star', 'phoenix_scout'];
  });

  // Buy Item Action
  const handleBuyItem = (item: CosmeticItem) => {
    if (playerCoins < item.priceCoins) return;
    if (playerLevel < item.minLevelReq) return;

    // Deduct coins
    onDeductCoins(item.priceCoins);

    // Add to unlocked items
    const newUnlocked = [...unlockedItemIds, item.id];
    setUnlockedItemIds(newUnlocked);
    localStorage.setItem('lodavia_unlocked_cosmetics', JSON.stringify(newUnlocked));

    if (playSynthSound) {
      playSynthSound(523, 'sine', 0.1);
      setTimeout(() => playSynthSound(659, 'sine', 0.15), 100);
    }
  };

  // Filter items
  const activeItems = COSMETIC_ITEMS.filter(item => {
    if (activeSubTab === 'alien') {
      return item.type === alienCategory;
    } else {
      return item.type === 'ship_model' || item.type === 'ship_trail';
    }
  });

  return (
    <div className="bg-slate-900/95 border border-purple-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 max-w-5xl mx-auto relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-2xl">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-black text-white">
              {lang === 'ar' ? 'قلعة تخصيص الشخصية والمركبة الفضائية 🛸' : 'Lodavia Customizer Citadel 🛸'}
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'ar' ? 'خصص كائنك الفضائي ومركبتك الخاصة بقطع تجميلية مجرّية' : 'Customize your cosmic alien character & starship models'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* PLAYER COINS BALANCE */}
          <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-300 font-mono font-black text-xs flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{playerCoins} 🪙</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* TAB SWITCHER: ALIEN CHARACTER vs STARSHIP */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('alien')}
          className={`py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'alien'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{lang === 'ar' ? '👽 شخصية الفضائي' : '👽 Alien Character'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('starship')}
          className={`py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'starship'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>{lang === 'ar' ? '🚀 المركبة الفضائية' : '🚀 Starship Hangar'}</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: PREVIEW CARD (LEFT) + ITEM SELECTION (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PREVIEW CARD DISPLAY */}
        <div className="md:col-span-1 bg-black/50 border border-purple-500/30 p-6 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-inner">
          <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
            {lang === 'ar' ? 'معاينة فورية' : 'Live Preview'}
          </span>

          {activeSubTab === 'alien' ? (
            /* ALIEN CHARACTER PREVIEW CARD */
            <div className="space-y-4 w-full">
              <div
                className="w-32 h-32 rounded-3xl mx-auto border-2 border-purple-400 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-300"
                style={{ backgroundColor: `${avatarCustomization.skinTint}30`, borderColor: avatarCustomization.skinTint }}
              >
                {/* ALIEN SPECIES ICON */}
                <div className="text-6xl animate-bounce">
                  {avatarCustomization.headSpecies === 'cyber_cyclops' ? '👁️' :
                   avatarCustomization.headSpecies === 'astro_cat' ? '🐱' :
                   avatarCustomization.headSpecies === 'nebula_elemental' ? '👾' : '👽'}
                </div>

                {/* ACCESSORY BADGE */}
                <div className="absolute top-2 right-2 text-xl">
                  {avatarCustomization.accessory === 'crown_star' ? '👑' :
                   avatarCustomization.accessory === 'neon_visor' ? '👓' : '📡'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-black text-sm text-white">
                  {lang === 'ar' ? avatarCustomization.titleBadgeAr : avatarCustomization.titleBadgeEn}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Level {playerLevel} • Cosmic Explorer
                </div>
              </div>
            </div>
          ) : (
            /* STARSHIP PREVIEW CARD */
            <div className="space-y-4 w-full">
              <div className="w-32 h-32 rounded-3xl mx-auto border-2 border-cyan-400 bg-cyan-950/40 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="text-6xl animate-pulse">
                  {starshipCustomization.modelId === 'cosmic_cruiser' ? '🛸' :
                   starshipCustomization.modelId === 'nebula_interceptor' ? '🌌' :
                   starshipCustomization.modelId === 'lodavia_dreadnought' ? '🪐' : '🚀'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-black text-sm text-white">
                  {lang === 'ar' ? starshipCustomization.modelNameAr : starshipCustomization.modelNameEn}
                </div>
                <div className="text-[11px] text-cyan-300 font-mono">
                  Trail: {starshipCustomization.trailEffect}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ITEMS SELECTION GRID */}
        <div className="md:col-span-2 space-y-4">
          {/* CATEGORY SELECTOR FOR ALIEN */}
          {activeSubTab === 'alien' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'head', labelAr: 'الرأس والشكل 👽', labelEn: 'Head & Species 👽' },
                { id: 'skin', labelAr: 'لون البشرة 🟢', labelEn: 'Skin Tint 🟢' },
                { id: 'outfit', labelAr: 'البدلة والملابس 👨‍🚀', labelEn: 'Outfit 👨‍🚀' },
                { id: 'accessory', labelAr: 'الإكسسوارات 👓', labelEn: 'Accessories 👓' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAlienCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    alienCategory === cat.id
                      ? 'bg-purple-600 text-white font-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          )}

          {/* ITEM CARDS GRID */}
          <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {activeItems.map(item => {
              const isUnlocked = unlockedItemIds.includes(item.id) || item.priceCoins === 0;
              const isSelected = activeSubTab === 'alien'
                ? (item.type === 'head' && avatarCustomization.headSpecies === item.id) ||
                  (item.type === 'skin' && avatarCustomization.skinTint === item.value) ||
                  (item.type === 'accessory' && avatarCustomization.accessory === item.id)
                : (item.type === 'ship_model' && starshipCustomization.modelId === item.id);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-400 shadow-lg'
                      : 'bg-slate-900/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                      item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {item.rarity}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-white">
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </div>
                  </div>

                  {/* ACTION BUTTON: SELECT OR BUY */}
                  <div className="pt-2 border-t border-white/10">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          if (activeSubTab === 'alien') {
                            if (item.type === 'head') onUpdateAvatar({ ...avatarCustomization, headSpecies: item.id });
                            if (item.type === 'skin') onUpdateAvatar({ ...avatarCustomization, skinTint: item.value });
                            if (item.type === 'accessory') onUpdateAvatar({ ...avatarCustomization, accessory: item.id });
                          } else {
                            if (item.type === 'ship_model') onUpdateStarship({
                              ...starshipCustomization,
                              modelId: item.id,
                              modelNameAr: item.nameAr,
                              modelNameEn: item.nameEn
                            });
                          }
                          if (playSynthSound) playSynthSound(700, 'sine', 0.08);
                        }}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isSelected ? (lang === 'ar' ? 'مستعمل الآن' : 'Equipped') : (lang === 'ar' ? 'استعمال' : 'Equip')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={playerCoins < item.priceCoins || playerLevel < item.minLevelReq}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                          playerCoins >= item.priceCoins && playerLevel >= item.minLevelReq
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 cursor-pointer shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.priceCoins} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
