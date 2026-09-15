import React, { useState } from 'react';
import { CosmeticItem, CosmeticType, EquippedCosmetics, Rarity } from '../../types/cosmicPacks';
import { COSMETIC_ITEMS_CATALOG, RARITY_CONFIG } from '../../config/cosmicPacksConfig';
import { CosmeticPreview } from './CosmeticPreview';
import { Sparkles, Check, Star, Filter, Search, Shield, Bot, UserCheck, X } from 'lucide-react';

interface MyLockerProps {
  inventory: string[];
  equippedCosmetics: EquippedCosmetics;
  favoriteCosmetics: string[];
  newCosmetics: string[];
  lang: string;
  onEquip: (type: CosmeticType, item: CosmeticItem) => void;
  onUnequip: (type: CosmeticType) => void;
  onToggleFavorite: (itemId: string) => void;
  onMarkSeen: (itemId: string) => void;
  playSynthSound: (freq: number, type: OscillatorType, duration: number) => void;
}

export const MyLocker: React.FC<MyLockerProps> = ({
  inventory,
  equippedCosmetics,
  favoriteCosmetics,
  newCosmetics,
  lang,
  onEquip,
  onUnequip,
  onToggleFavorite,
  onMarkSeen,
  playSynthSound
}) => {
  const [selectedType, setSelectedType] = useState<CosmeticType | 'ALL'>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemModal, setActiveItemModal] = useState<CosmeticItem | null>(null);

  // Filter items owned in inventory
  const ownedItems = COSMETIC_ITEMS_CATALOG.filter(item => inventory.includes(item.id));

  const filteredItems = ownedItems.filter(item => {
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    if (selectedRarity !== 'ALL' && item.rarity !== selectedRarity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchAr = item.nameAr.toLowerCase().includes(q);
      const matchEn = item.nameEn.toLowerCase().includes(q);
      if (!matchAr && !matchEn) return false;
    }
    return true;
  });

  const isEquipped = (item: CosmeticItem): boolean => {
    if (item.type === 'AVATAR_FRAME') return equippedCosmetics.frame === item.id;
    if (item.type === 'PROFILE_BACKGROUND') return equippedCosmetics.background === item.id;
    if (item.type === 'NAME_EFFECT') return equippedCosmetics.nameEffect === item.id;
    if (item.type === 'TITLE') return equippedCosmetics.title === item.id;
    if (item.type === 'BADGE' || item.type === 'CREATOR_BADGE') return equippedCosmetics.badge === item.id;
    if (item.type === 'CHARACTER_SKIN') return equippedCosmetics.characterSkin === item.mascotSkin;
    return false;
  };

  const handleItemClick = (item: CosmeticItem) => {
    playSynthSound(500, 'sine', 0.1);
    if (newCosmetics.includes(item.id)) {
      onMarkSeen(item.id);
    }
    setActiveItemModal(item);
  };

  const categories: { id: CosmeticType | 'ALL'; nameAr: string; nameEn: string; icon: string }[] = [
    { id: 'ALL', nameAr: 'الكل 📦', nameEn: 'All 📦', icon: '📦' },
    { id: 'AVATAR_FRAME', nameAr: 'الإطارات 💫', nameEn: 'Frames 💫', icon: '💫' },
    { id: 'PROFILE_BACKGROUND', nameAr: 'الخلفيات 🌌', nameEn: 'Backgrounds 🌌', icon: '🌌' },
    { id: 'NAME_EFFECT', nameAr: 'تأثير الاسم ✨', nameEn: 'Name Effects ✨', icon: '✨' },
    { id: 'TITLE', nameAr: 'الألقاب 👑', nameEn: 'Titles 👑', icon: '👑' },
    { id: 'BADGE', nameAr: 'الأوسمة 🔰', nameEn: 'Badges 🔰', icon: '🔰' },
    { id: 'CHARACTER_SKIN', nameAr: 'مظاهر الذكاء 🤖', nameEn: 'AI Skins 🤖', icon: '🤖' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      {/* 1. Header & Stats */}
      <div className="p-6 rounded-3xl bg-white dark:bg-void-900/80 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
            <span>{lang === 'ar' ? 'خزاناتي الكونية' : 'My Cosmic Locker'}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/20 dark:bg-aurora-500/20 text-sky-700 dark:text-aurora-300 border border-sky-500/40 dark:border-aurora-500/40 font-bold">
              {ownedItems.length} {lang === 'ar' ? 'عنصر مملوك' : 'Items Owned'}
            </span>
          </h2>
          <p className="text-xs text-[#475569] dark:text-white/60 mt-1 font-medium">
            {lang === 'ar' ? 'استعرض وادارة وتجهيز عناصرك الكونية وتخصيص مظاهرك في شبكة لودافيا.' : 'Manage, view and equip your cosmetic items and customize your presence.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث عن عنصر...' : 'Search item...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-void-950/80 border border-slate-200 dark:border-white/15 text-[#111827] dark:text-white text-xs placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-sky-500 dark:focus:border-aurora-400"
          />
        </div>
      </div>

      {/* 2. Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { playSynthSound(400, 'sine', 0.08); setSelectedType(cat.id); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedType === cat.id
                ? 'bg-sky-600 dark:bg-aurora-500 text-white dark:text-void-950 font-black shadow-md'
                : 'bg-white dark:bg-void-900/60 hover:bg-slate-100 dark:hover:bg-void-800 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/10'
            }`}
          >
            <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* 3. Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-void-900/40 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="text-4xl">📦</div>
          <p className="text-sm font-bold text-[#111827] dark:text-white/70">
            {lang === 'ar' ? 'لا توجد عناصر مطابقة في خزانتك الحالية' : 'No matching cosmetic items found in your locker'}
          </p>
          <p className="text-xs text-[#475569] dark:text-white/50 max-w-sm">
            {lang === 'ar' ? 'قم بفتح الحزم الكونية من المتجر للحصول على إطارات وخلفيات وأوسمة مميزة.' : 'Open Cosmic Packs from the Store to unlock exclusive cosmetics.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => {
            const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.COMMON;
            const equipped = isEquipped(item);
            const isFav = favoriteCosmetics.includes(item.id);
            const isNew = newCosmetics.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`relative p-4 rounded-2xl ${rarity.bgColor} border ${equipped ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-md' : rarity.borderColor} hover:border-sky-400 dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-between gap-3 group`}
              >
                {/* Badges: Equipped & Favorite & New */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                  {equipped ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      {lang === 'ar' ? 'مجهز' : 'Equipped'}
                    </span>
                  ) : isNew ? (
                    <span className="bg-sky-500 dark:bg-aurora-500 text-white dark:text-void-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                      NEW!
                    </span>
                  ) : <div />}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                      playSynthSound(700, 'sine', 0.1);
                    }}
                    className={`p-1 rounded-full transition-colors ${isFav ? 'text-amber-500 bg-amber-500/20' : 'text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/80'}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Visual Preview */}
                <div className="mt-4 my-2">
                  <CosmeticPreview item={item} size="md" showLabel={false} />
                </div>

                {/* Name & Rarity */}
                <div className="text-center w-full">
                  <h4 className="text-xs font-bold text-[#111827] dark:text-white truncate max-w-full">
                    {lang === 'ar' ? item.nameAr : item.nameEn}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rarity.badgeBg} font-semibold inline-block mt-1`}>
                    {rarity.nameAr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ITEM DETAIL MODAL */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-void-900 border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col items-center text-center gap-5 relative">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <CosmeticPreview item={activeItemModal} size="lg" showLabel={true} />

            <div>
              <h3 className="text-lg font-black text-[#111827] dark:text-white">{lang === 'ar' ? activeItemModal.nameAr : activeItemModal.nameEn}</h3>
              <p className="text-xs text-[#475569] dark:text-white/60 mt-1 max-w-xs">{lang === 'ar' ? activeItemModal.descriptionAr : activeItemModal.descriptionEn}</p>
            </div>

            <div className="flex items-center gap-3 w-full">
              {isEquipped(activeItemModal) ? (
                <button
                  onClick={() => {
                    onUnequip(activeItemModal.type);
                    setActiveItemModal(null);
                    playSynthSound(300, 'sine', 0.15);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء التجهيز ❌' : 'Unequip ❌'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onEquip(activeItemModal.type, activeItemModal);
                    setActiveItemModal(null);
                    playSynthSound(1000, 'sine', 0.2);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-aurora-500 dark:hover:bg-aurora-400 text-white dark:text-void-950 text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'تجهيز العنصر ⚡' : 'Equip Item ⚡'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
