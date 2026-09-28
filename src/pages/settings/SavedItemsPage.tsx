import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Bookmark, 
  Trash2,
  Volume2,
  Sparkles,
  Check,
  User,
  Film,
  Tv,
  FileText,
  Compass,
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageSquare
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';
import { savedItemsService } from '../../services/savedItems.service';
import { SavedItem, SavedItemType } from '../../types';

interface MockSavedRoom {
  id: string;
  type: 'room';
  titleAr: string;
  titleEn: string;
  host: string;
  listeners: number;
}

type FilterCategory = 'all' | 'post' | 'reel' | 'video' | 'room';

export default function SavedItemsPage() {
  const { lang, playSynthSound, currentUser } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';
  const isGuest = !currentUser?.id || currentUser.isAnonymous === true || currentUser.id === 'guest';
  const uid = currentUser?.id || 'guest';

  // Real saved items from Firestore / Local Storage
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<FilterCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock saved rooms (preserved for saved audio rooms feature)
  const [savedRooms, setSavedRooms] = useState<MockSavedRoom[]>([
    {
      id: 'room_saved_1',
      type: 'room',
      titleAr: 'سحر البرمجة بالذكاء الاصطناعي 🧙‍♂️',
      titleEn: 'AI Coding Sorcery 🧙‍♂️',
      host: 'Bader Al-Mutairi',
      listeners: 142
    },
    {
      id: 'room_saved_2',
      type: 'room',
      titleAr: 'نقاش مفتوح: سدم وتلسكوبات الهواة 🌌',
      titleEn: 'Open Space: Nebulas & Telescope Chat 🌌',
      host: 'Lina Drake',
      listeners: 89
    }
  ]);

  // Fetch real saved items on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    savedItemsService.getSavedItems(uid, undefined, isGuest)
      .then((items) => {
        if (!isMounted) return;
        setSavedItems(items || []);
      })
      .catch((err) => {
        console.warn('Failed to load saved items:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uid, isGuest]);

  // Unsave a real item (Post, Reel, Video)
  const handleUnsaveItem = async (e: React.MouseEvent, item: SavedItem) => {
    e.stopPropagation();
    playSynthSound(500, 'sine', 0.08);

    // Optimistic UI removal
    setSavedItems(prev => prev.filter(i => i.id !== item.id));
    setToastMessage(isRtl ? 'تمت إزالة العنصر من المحفوظات 🗑️' : 'Item removed from saved archive 🗑️');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    try {
      await savedItemsService.unsaveItem(uid, item.itemType, item.itemId, isGuest);
    } catch (err) {
      console.warn('Error in handleUnsaveItem:', err);
    }
  };

  // Unsave an audio room
  const handleUnsaveRoom = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    playSynthSound(500, 'sine', 0.08);
    setSavedRooms(prev => prev.filter(r => r.id !== roomId));
    setToastMessage(isRtl ? 'تمت إزالة الغرفة من المحفوظات 🗑️' : 'Audio room removed from saved archive 🗑️');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Navigate to original content
  const handleOpenItem = (item: SavedItem) => {
    playSynthSound(700, 'sine', 0.08);
    if (item.itemType === 'post') {
      navigate('/home', { state: { highlightPostId: item.itemId } });
    } else if (item.itemType === 'reel') {
      navigate(`/media?reel=${item.itemId}`);
    } else if (item.itemType === 'video') {
      navigate(`/media?video=${item.itemId}`);
    }
  };

  // Counts for filter badges
  const postsCount = savedItems.filter(i => i.itemType === 'post').length;
  const reelsCount = savedItems.filter(i => i.itemType === 'reel').length;
  const videosCount = savedItems.filter(i => i.itemType === 'video').length;
  const roomsCount = savedRooms.length;
  const totalCount = savedItems.length + roomsCount;

  // Filtered lists
  const filteredSavedItems = activeTab === 'all' 
    ? savedItems 
    : savedItems.filter(i => i.itemType === activeTab);

  const shouldShowRooms = activeTab === 'all' || activeTab === 'room';

  const filterTabs: Array<{ id: FilterCategory; labelAr: string; labelEn: string; icon: any; count: number }> = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Bookmark, count: totalCount },
    { id: 'post', labelAr: 'منشورات', labelEn: 'Posts', icon: FileText, count: postsCount },
    { id: 'reel', labelAr: 'ريلز', labelEn: 'Reels', icon: Film, count: reelsCount },
    { id: 'video', labelAr: 'فيديوهات', labelEn: 'Videos', icon: Tv, count: videosCount },
    { id: 'room', labelAr: 'غرف صوتية', labelEn: 'Audio Rooms', icon: Volume2, count: roomsCount },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'المحفوظات الكونية 🔖' : 'Stellar Bookmark Vault 🔖'}
        description={isRtl ? 'المنشورات والمقاطع ومجالس الصوت التي قمت بحفظها للرجوع إليها لاحقاً' : 'Your central archive for saved publications, media clips, and live audio rooms'}
        icon={Bookmark}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out] shadow-lg">
            <Check className="w-4 h-4 shrink-0 text-purple-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Categories Segmented Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSynthSound(600, 'sine', 0.05);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-[#182232] border-[#E2E8F0] dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-purple-400/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
                <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {isLoading ? (
          /* Cosmic Loading Skeleton */
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-[#182232] rounded-3xl border border-[#E2E8F0] dark:border-white/5">
            <div className="w-12 h-12 rounded-full border-3 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">
              {isRtl ? 'جاري جلب المحفوظات الكونية...' : 'Accessing Stellar Bookmark Vault...'}
            </span>
          </div>
        ) : (filteredSavedItems.length > 0 || (shouldShowRooms && savedRooms.length > 0)) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Real Saved Items (Posts, Reels, Videos) */}
            {filteredSavedItems.map((item) => {
              const preview = item.preview;
              const isPost = item.itemType === 'post';
              const isReel = item.itemType === 'reel';
              const isVideo = item.itemType === 'video';

              return (
                <div 
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className="bg-white dark:bg-[#182232] rounded-3xl p-5 border border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg dark:hover:border-purple-400/40 relative group cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    
                    {/* Header: Author + Item Type Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={preview?.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                          alt={preview?.authorName || 'Author'} 
                          className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] dark:border-white/10"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#111827] dark:text-white block">
                            {preview?.authorName || (isRtl ? 'مستكشف كوني' : 'Cosmic Explorer')}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {preview?.timestamp || (isRtl ? 'محفوظ' : 'Saved')}
                          </span>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        isPost 
                          ? 'bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-sky-400'
                          : isReel
                          ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {isPost && <FileText className="w-3 h-3" />}
                        {isReel && <Film className="w-3 h-3" />}
                        {isVideo && <Tv className="w-3 h-3" />}
                        <span>
                          {isPost ? (isRtl ? 'منشور' : 'Post') : isReel ? (isRtl ? 'ريلز' : 'Reel') : (isRtl ? 'فيديو' : 'Video')}
                        </span>
                      </span>
                    </div>

                    {/* Preview Media Thumbnail + Content snippet */}
                    <div className="flex gap-3 items-start">
                      {preview?.thumbnailUrl && (
                        <div className="w-18 h-18 rounded-2xl overflow-hidden shrink-0 bg-black/10 border border-slate-200 dark:border-white/10 relative">
                          <img 
                            src={preview.thumbnailUrl} 
                            alt="Thumbnail" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {(isReel || isVideo) && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed font-medium">
                          {preview?.contentSnippet || preview?.title || (isRtl ? 'منشور محفوظ في فضاء لودافيا' : 'Saved content')}
                        </p>

                        {preview?.extraMeta && (
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {preview.extraMeta.category && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5">
                                #{preview.extraMeta.category}
                              </span>
                            )}
                            {typeof preview.extraMeta.likesCount === 'number' && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-rose-500" />
                                {preview.extraMeta.likesCount}
                              </span>
                            )}
                            {typeof preview.extraMeta.commentsCount === 'number' && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {preview.extraMeta.commentsCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-white/5 mt-1">
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1">
                      <span>{isRtl ? 'عرض المحتوى الأصلي' : 'View Original'}</span>
                      {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleUnsaveItem(e, item)}
                      className="p-1.5 px-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title={isRtl ? 'إلغاء الحفظ' : 'Unsave Item'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">{isRtl ? 'إلغاء' : 'Unsave'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* 2. Mock saved rooms (displayed when activeTab is 'all' or 'room') */}
            {shouldShowRooms && savedRooms.map((room) => (
              <div 
                key={room.id}
                className="bg-white dark:bg-[#182232] rounded-3xl p-5 border border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg dark:hover:border-purple-400/40 relative group shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                      {isRtl ? 'غرفة صوتية مجدولة' : 'Saved Audio Room'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#111827] dark:text-white line-clamp-2 leading-snug">
                    {isRtl ? room.titleAr : room.titleEn}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-2.5 text-[#475569] dark:text-slate-400 text-[11px]">
                    <User className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" />
                    <span>{isRtl ? `المضيف: ${room.host}` : `Host: ${room.host}`}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-white/5 mt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {room.listeners} {isRtl ? 'مستمع' : 'listeners'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleUnsaveRoom(e, room.id)}
                    className="p-1.5 px-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title={isRtl ? 'إلغاء الحفظ' : 'Unsave Item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{isRtl ? 'إلغاء' : 'Unsave'}</span>
                  </button>
                </div>
              </div>
            ))}

          </div>
        ) : (
          /* Cosmic Empty State */
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-12 border border-[#E2E8F0] dark:border-white/5 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
              <Bookmark className="w-8 h-8" />
            </div>
            
            <h3 className="text-base font-black text-[#111827] dark:text-white">
              {activeTab === 'all' 
                ? (isRtl ? 'المحفوظات الكونية فارغة حالياً 🌌' : 'Your Bookmark Vault is Empty 🌌')
                : (isRtl ? 'لا توجد عناصر في هذا التصنيف' : 'No saved items in this category')}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
              {isRtl 
                ? 'استكشف المنشورات والمقاطع في فضاء لودافيا، واضغط على أيقونة الحفظ في أي منشور ليتم أرشفته هنا فوراً.' 
                : 'Explore publications and media around Lodavia, and tap the bookmark icon on any post to preserve it here.'}
            </p>

            <button
              onClick={() => {
                playSynthSound(700, 'sine', 0.08);
                navigate('/home');
              }}
              className="mt-6 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{isRtl ? 'استكشف المنشورات الآن 🪐' : 'Explore Publications Now 🪐'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
