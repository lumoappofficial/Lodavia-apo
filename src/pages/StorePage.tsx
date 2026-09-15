import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { STORE_CATEGORIES, STORE_ITEMS, StoreCategory, StoreItem } from '../data/storeCatalog';
import { STORE_BUNDLES } from '../data/retentionData';
import { CosmicPacksStore } from '../components/packs/CosmicPacksStore';
import { MyLocker } from '../components/packs/MyLocker';
import { PackOpeningModal } from '../components/packs/PackOpeningModal';
import { CosmicPack, CosmeticItem } from '../types/cosmicPacks';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Coins, 
  Tv, 
  Check, 
  Sparkles, 
  Info, 
  X, 
  CheckCircle2, 
  Tag,
  Gift,
  Package
} from 'lucide-react';
import { themeStyles } from '../styles/theme';
import PageGlow from '../components/PageGlow';

export default function StorePage() {
  const {
    currentUser,
    lang,
    playSynthSound,
    handleBuyAndOpenCosmicPack,
    handleEquipCosmetic,
    handleUnequipCosmetic,
    handleToggleFavoriteCosmetic,
    handleMarkCosmeticSeen,
    handleClaimDailyCosmicReward
  } = useApp();

  const navigate = useNavigate();
  const { 
    points, 
    purchasedItems, 
    startWatchingAd, 
    handlePurchaseItem, 
    storeMessage, 
    setStoreMessage 
  } = useWallet();

  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'packs' | 'bundles' | 'locker' | 'standard'>('packs');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('all');
  const [activeFilterId, setActiveFilterId] = useState<string>('all');

  // Unified horizontal store filter pills definition
  const storePillFilters = [
    { id: 'all', nameAr: 'الكل 🌌', nameEn: 'All 🌌', icon: '🌌' },
    { id: 'packs', nameAr: 'الحزم الكونية 🎁', nameEn: 'Cosmic Packs 🎁', icon: '🎁' },
    { id: 'bundles', nameAr: 'حزم العروض 💎', nameEn: 'Special Bundles 💎', icon: '💎' },
    { id: 'avatar_frame', nameAr: 'إطارات الصور ✨', nameEn: 'Avatar Frames ✨', icon: '✨' },
    { id: 'badge', nameAr: 'أوسمة ونياشين 👑', nameEn: 'Badges 👑', icon: '👑' },
    { id: 'name_color', nameAr: 'تأثيرات الأسماء 🌟', nameEn: 'Name Effects 🌟', icon: '🌟' },
    { id: 'title', nameAr: 'ألقاب كوكبية 🪐', nameEn: 'Cosmic Titles 🪐', icon: '🪐' },
    { id: 'chat_theme', nameAr: 'أشكال المحادثة 🎨', nameEn: 'Chat Themes 🎨', icon: '🎨' },
    { id: 'feature', nameAr: 'ميزات ووصول 🔑', nameEn: 'Features 🔑', icon: '🔑' },
    { id: 'locker', nameAr: 'خزانة المظاهر 📦', nameEn: 'My Locker 📦', icon: '📦' }
  ];

  const handleSelectFilter = (filterId: string) => {
    playSynthSound(500, 'sine', 0.08);
    setActiveFilterId(filterId);

    if (filterId === 'all' || filterId === 'packs') {
      setActiveTab('packs');
    } else if (filterId === 'bundles') {
      setActiveTab('bundles');
    } else if (filterId === 'locker') {
      setActiveTab('locker');
    } else {
      setActiveTab('standard');
      setSelectedCategory(filterId as StoreCategory);
    }
  };

  // Pack opening modal state
  const [openingModalOpen, setOpeningModalOpen] = useState(false);
  const [activeOpeningPack, setActiveOpeningPack] = useState<CosmicPack | null>(null);
  const [openedRewardItem, setOpenedRewardItem] = useState<CosmeticItem | null>(null);
  const [isRewardDuplicate, setIsRewardDuplicate] = useState(false);
  const [rewardShardsAwarded, setRewardShardsAwarded] = useState(0);
  const [isPurchasingPack, setIsPurchasingPack] = useState(false);
  const activePurchaseSessionRef = useRef<string | null>(null);

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === selectedCategory);

  const handleBuyAndOpenPack = async (pack: CosmicPack) => {
    if (isPurchasingPack) return;
    setIsPurchasingPack(true);

    try {
      const result = await handleBuyAndOpenCosmicPack(pack.id);

      // Strict requirement: Only display if confirmed actual success
      if (result.success && result.rewardItem) {
        const sessionId = `${pack.id}_${Date.now()}`;
        if (activePurchaseSessionRef.current === sessionId) return;
        activePurchaseSessionRef.current = sessionId;

        setActiveOpeningPack(pack);
        setOpenedRewardItem(result.rewardItem);
        setIsRewardDuplicate(!!result.isDuplicate);
        setRewardShardsAwarded(result.shardsAwarded || 0);
        setOpeningModalOpen(true);
      } else if (!result.success) {
        // Purchase unsuccessful (e.g. insufficient balance) - modal NEVER triggers
        playSynthSound(220, 'sawtooth', 0.2);
      }
    } finally {
      setIsPurchasingPack(false);
    }
  };

  const handleCloseUnboxingModal = () => {
    setOpeningModalOpen(false);
    setActiveOpeningPack(null);
    setOpenedRewardItem(null);
    setIsRewardDuplicate(false);
    setRewardShardsAwarded(0);
    activePurchaseSessionRef.current = null;
  };

  return (
    <div className="w-full text-[#111827] dark:text-slate-100 min-h-screen pb-16 animate-[fadeIn_0.4s_ease-out]">
      <PageGlow color="ember" />
      
      {/* Upper Navigation & Page Title */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSynthSound(400, 'sine', 0.08);
                navigate(-1);
              }}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              title={isRtl ? 'العودة' : 'Go Back'}
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-300 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <span>{isRtl ? 'متجر لودافيا الكوني للحزم والمكافآت' : 'Lodavia Cosmic Store & Rewards'}</span>
              </h1>
              <p className="text-[#475569] dark:text-slate-400 text-xs mt-1 font-medium">
                {isRtl 
                  ? 'افتح الحزم الكونية، جمع أندر الإطارات والألقاب والأسماء، وخصص مظاهرك في جميع أركان الشبكة.' 
                  : 'Open Cosmic Packs, unlock rare frames, titles & names, and customize your identity.'}
              </p>
            </div>
          </div>

          {/* User Wallet Balance & Watch Ad Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-black/40 border border-amber-500/30 shadow-md shadow-amber-500/10">
              <Coins className="w-5 h-5 text-amber-500 dark:text-yellow-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#64748B] dark:text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'رصيد نقاطك' : 'Your Points'}</span>
                <span className="text-sm font-black text-amber-600 dark:text-yellow-400">{currentUser.points} {isRtl ? 'نقطة' : 'Pts'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                startWatchingAd();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'مشاهدة إعلان (+50)' : 'Watch Ad (+50)'}</span>
            </button>
          </div>
        </div>

        {/* Global Store Status Message Banner */}
        {storeMessage && (
          <div className="mt-2 p-3.5 rounded-2xl bg-sky-50 dark:bg-purple-900/40 border border-sky-200 dark:border-purple-500/30 text-sky-900 dark:text-purple-200 text-xs font-bold flex justify-between items-center animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-purple-300 animate-spin" />
              <span>{storeMessage}</span>
            </div>
            <button
              onClick={() => setStoreMessage('')}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Top Horizontal Scrollable Category Pill Buttons Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-8 border-b border-slate-200/80 dark:border-white/10">
        {storePillFilters.map((pill) => {
          const isActive = activeFilterId === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => handleSelectFilter(pill.id)}
              className={`px-4 py-2 rounded-full text-xs font-black shrink-0 transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-600 dark:bg-gradient-to-r dark:from-sky-500 dark:to-cyan-400 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-400/40'
                  : 'bg-white dark:bg-void-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{pill.icon}</span>
              <span>{isRtl ? pill.nameAr : pill.nameEn}</span>
              {pill.id === 'locker' && currentUser.newCosmetics && currentUser.newCosmetics.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: COSMIC PACKS STORE */}
      {activeTab === 'packs' && (
        <CosmicPacksStore
          userPoints={currentUser.points}
          userShards={currentUser.shards || 0}
          inventory={currentUser.inventory || []}
          lastDailyRewardClaim={currentUser.lastDailyRewardClaim || null}
          lang={lang}
          onBuyAndOpenPack={handleBuyAndOpenPack}
          onClaimDailyReward={handleClaimDailyCosmicReward}
          playSynthSound={playSynthSound}
        />
      )}

      {/* TAB CONTENT: BUNDLES */}
      {activeTab === 'bundles' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_10px_35px_rgba(15,23,42,0.08)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-3 py-1 bg-[#55C8FF]/15 border border-[#55C8FF]/30 text-[#0F172A] text-[11px] font-extrabold rounded-full inline-block mb-2">
                {isRtl ? 'حزم حصرية لفترة محدودة 🔥' : 'Limited Time Special Bundles 🔥'}
              </span>
              <h2 className="text-xl font-extrabold text-[#0F172A]">
                {isRtl ? 'حزم العروض والمكافآت الشاملة' : 'Special Reward & Cosmetic Bundles'}
              </h2>
              <p className="text-xs text-[#475569] font-medium mt-1">
                {isRtl ? 'احصل على آلاف النقاط مع أندر الإطارات والألقاب بخصومات استثنائية' : 'Get thousands of points with rare frames & titles at exclusive rates'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {STORE_BUNDLES.map((bundle) => (
              <div 
                key={bundle.id}
                className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 flex flex-col justify-between shadow-[0_10px_35px_rgba(15,23,42,0.08)] hover:border-[#55C8FF] transition-all relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-700 text-[10px] font-extrabold rounded-full">
                      {isRtl ? bundle.tagAr : bundle.tagEn}
                    </span>
                    <div className="text-3xl">{bundle.icon}</div>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A]">
                      {isRtl ? bundle.titleAr : bundle.titleEn}
                    </h3>
                    <p className="text-xs text-[#475569] font-medium mt-1 leading-relaxed">
                      {isRtl ? bundle.descAr : bundle.descEn}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-2xl space-y-1.5">
                    <div className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wider">
                      {isRtl ? 'محتويات الحزمة:' : 'Bundle Contents:'}
                    </div>
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="text-xs font-bold text-[#475569] flex items-center gap-1.5">
                        <span className="text-[#55C8FF]">✦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
                  <div className="text-sm font-black text-[#0F172A]">
                    {bundle.pricePoints} <span className="text-xs font-bold text-amber-600">{isRtl ? 'نقطة' : 'Pts'}</span>
                  </div>

                  <button
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.15);
                      setStoreMessage(isRtl ? `تم الحصول على ${bundle.titleAr} بنجاح! 🎉` : `Successfully unlocked ${bundle.titleEn}! 🎉`);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] font-extrabold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isRtl ? 'افتح الحزمة 🎁' : 'Unlock Bundle 🎁'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MY LOCKER */}
      {activeTab === 'locker' && (
        <MyLocker
          inventory={currentUser.inventory || []}
          equippedCosmetics={currentUser.equippedCosmetics || {}}
          favoriteCosmetics={currentUser.favoriteCosmetics || []}
          newCosmetics={currentUser.newCosmetics || []}
          lang={lang}
          onEquip={handleEquipCosmetic}
          onUnequip={handleUnequipCosmetic}
          onToggleFavorite={handleToggleFavoriteCosmetic}
          onMarkSeen={handleMarkCosmeticSeen}
          playSynthSound={playSynthSound}
        />
      )}

      {/* TAB CONTENT 3: STANDARD CATALOG */}
      {activeTab === 'standard' && (
        <>
          {/* Horizontal Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-200 dark:border-white/5">
            <button
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setSelectedCategory('all');
                setActiveFilterId('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 text-white shadow-md border border-sky-400/30 ring-2 ring-sky-400/40 font-black'
                  : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>✨</span>
              <span>{isRtl ? 'جميع المعروضات' : 'All Items'}</span>
              <span className="ml-1 text-[10px] opacity-75 bg-slate-100 dark:bg-black/40 text-slate-800 dark:text-white px-2 py-0.5 rounded-full border border-slate-200 dark:border-transparent">
                {STORE_ITEMS.length}
              </span>
            </button>

            {STORE_CATEGORIES.map((cat) => {
              const count = STORE_ITEMS.filter(item => item.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setSelectedCategory(cat.id);
                    setActiveFilterId(cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-600 dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 text-white shadow-md border border-sky-400/30 ring-2 ring-sky-400/40 font-black'
                      : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isRtl ? cat.nameAr : cat.nameEn}</span>
                  <span className="ml-1 text-[10px] opacity-75 bg-slate-100 dark:bg-black/40 text-slate-800 dark:text-white px-2 py-0.5 rounded-full border border-slate-200 dark:border-transparent">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Item Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isOwned = purchasedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900/70 p-5 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between gap-4 hover:border-sky-400 dark:hover:border-purple-500/40 transition-all duration-300 shadow-sm relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-purple-500/10 border border-sky-500/20 dark:border-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {item.icon}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-xl">
                      <Coins className="w-3.5 h-3.5 text-amber-500 dark:text-yellow-400" />
                      <span className="text-xs font-black text-amber-600 dark:text-yellow-400">{item.price}</span>
                      <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-semibold">{isRtl ? 'نقطة' : 'Pts'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="text-sm font-extrabold text-[#111827] dark:text-white group-hover:text-sky-600 dark:group-hover:text-purple-300 transition-colors">
                      {isRtl ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed line-clamp-3">
                      {isRtl ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                    {isOwned ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-90"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{isRtl ? 'تم الشراء والملك' : 'Owned'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handlePurchaseItem(item);
                        }}
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Coins className="w-4 h-4 text-amber-300" />
                        <span>{isRtl ? `شراء بـ ${item.price} نقطة` : `Unlock for ${item.price} Pts`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PACK OPENING CINEMATIC MODAL */}
      {openingModalOpen && activeOpeningPack && openedRewardItem && (
        <PackOpeningModal
          isOpen={openingModalOpen}
          pack={activeOpeningPack}
          rewardItem={openedRewardItem}
          isDuplicate={isRewardDuplicate}
          shardsAwarded={rewardShardsAwarded}
          lang={lang}
          onClose={handleCloseUnboxingModal}
          onEquipNow={(item) => {
            handleEquipCosmetic(item.type, item);
          }}
          playSynthSound={playSynthSound}
        />
      )}

    </div>
  );
}

