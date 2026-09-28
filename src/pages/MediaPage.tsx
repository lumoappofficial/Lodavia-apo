import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Play, Pause, Heart, MessageCircle, Share2, Upload, Tv, Flame, Watch, 
  Send, Users, HelpCircle, AlertCircle, Check, Search, ChevronRight, ChevronDown, X, 
  Plus, Radio, Award, Sparkles, User, Database, Globe, Compass, Film, Camera, Copy, Link as LinkIcon,
  Bookmark, MoreHorizontal, ThumbsUp, EyeOff, Flag, CornerDownLeft
} from 'lucide-react';
import { MediaItem } from '../data/mediaData';
import { UploadMediaModal } from '../components/UploadMediaModal';
import { copyToClipboard } from '../utils/helpers';
import { savedItemsService } from '../services/savedItems.service';
import { chatService } from '../services/chat.service';
import { SavedItemType, ChatMessage } from '../types';

export default function MediaPage() {
  const { lang, currentUser, playSynthSound, setCurrentUser, mediaList, setMediaList, chats } = useApp();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'reels' | 'videos' | 'live'>('reels');
  const [reelsFilterTab, setReelsFilterTab] = useState<'all' | 'friends'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast & Copy States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCommentIndex, setCopiedCommentIndex] = useState<number | null>(null);
  const [copiedMsgIndex, setCopiedMsgIndex] = useState<number | null>(null);

  // Saved Media IDs tracking (Optimistic UI & Firestore/Local sync)
  const [savedMediaIds, setSavedMediaIds] = useState<Set<string>>(new Set());

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };
  
  // Reels specific controls
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState<MediaItem | null>(null);
  const [showShareModal, setShowShareModal] = useState<MediaItem | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState<MediaItem | null>(null);
  const [isReportConfirmOpen, setIsReportConfirmOpen] = useState(false);

  // Nested Replies States
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const toggleExpandedReplies = (commentId: string) => {
    playSynthSound(700, 'sine', 0.05);
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleCloseOptionsModal = () => {
    setShowOptionsModal(null);
    setIsReportConfirmOpen(false);
  };

  // Upload/Creator Specific Controls
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Live Stream Specific State
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Hadi', text: 'Incredible speed on these arrays! 🛰️', time: '12:00' },
    { sender: 'Luna_Lover', text: 'Greetings from Amman!', time: '12:01' },
    { sender: 'AstroCore', text: 'Are we observing solar winds?', time: '12:01' }
  ]);
  const [newLiveMessage, setNewLiveMessage] = useState('');

  const reelsContainerRef = useRef<HTMLDivElement>(null);

  // Mobile Reels Controls Overlay State (auto-hide & swipe-down / tap to show)
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset auto-hide timer (3 seconds of inactivity)
  const resetHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowMobileOverlay(false);
    }, 3000);
  };

  const triggerMobileOverlay = () => {
    setShowMobileOverlay(true);
    resetHideTimer();
  };

  // Safe gesture swipe-down detection for top zone on mobile to show overlay
  const handleReelsTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartYRef.current = touch.clientY;
    }
  };

  const handleReelsTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaY = touch.clientY - touchStartYRef.current;
    // If swiping downwards by more than 35px in top portion of screen, reveal overlay
    if (deltaY > 35 && touchStartYRef.current < 250) {
      triggerMobileOverlay();
      touchStartYRef.current = null;
    }
  };

  const handleReelsTouchEnd = () => {
    touchStartYRef.current = null;
  };

  // Notify DashboardLayout to hide/show global top header on mobile when reels tab is active
  useEffect(() => {
    const isReels = activeSubTab === 'reels';
    window.dispatchEvent(new CustomEvent('lodavia_mobile_reels_active', {
      detail: { active: isReels }
    }));
    return () => {
      window.dispatchEvent(new CustomEvent('lodavia_mobile_reels_active', {
        detail: { active: false }
      }));
    };
  }, [activeSubTab]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // Load saved status for reels & videos from savedItemsService
  useEffect(() => {
    const isGuest = !currentUser?.id || currentUser.isAnonymous === true || currentUser.id === 'guest';
    const uid = currentUser?.id || 'guest';
    let isMounted = true;

    // Fetch saved reels and videos for current user
    savedItemsService.getSavedItems(uid, undefined, isGuest).then(items => {
      if (!isMounted || !items) return;
      const ids = new Set(
        items.filter(i => i.itemType === 'reel' || i.itemType === 'video').map(i => i.itemId)
      );
      setSavedMediaIds(ids);
    }).catch(err => {
      console.warn('Error fetching saved media items in MediaPage:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.isAnonymous, activeSubTab]);

  // Handle URL query parameters (?reel=... or ?video=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reelParam = params.get('reel');
    const videoParam = params.get('video');

    if (reelParam) {
      setActiveSubTab('reels');
      const idx = mediaList.filter(item => item.type === 'reel').findIndex(r => r.id === reelParam);
      if (idx !== -1) {
        setCurrentReelIndex(idx);
      }
    } else if (videoParam) {
      setActiveSubTab('videos');
      setTimeout(() => {
        const el = document.getElementById(`video-${videoParam}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'dark:ring-offset-slate-900', 'transition-all');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'dark:ring-offset-slate-900');
          }, 3000);
        }
      }, 350);
    }
  }, [mediaList.length]);

  // Filter items based on sub tab and search query
  const filteredItems = mediaList.filter(item => {
    if (item.type !== activeSubTab) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleVal = (lang === 'ar' ? item.titleAr : item.title).toLowerCase();
    const descVal = (lang === 'ar' ? item.descriptionAr : item.description).toLowerCase();
    const creatorVal = item.creator.name.toLowerCase();
    return titleVal.includes(query) || descVal.includes(query) || creatorVal.includes(query);
  });

  // Set of contact IDs from user's chats for friends filter
  const friendContactIds = React.useMemo(() => {
    const ids = new Set<string>();
    chats?.forEach(chat => {
      if (chat.id) ids.add(String(chat.id));
      if (chat.contactId) ids.add(String(chat.contactId));
    });
    return ids;
  }, [chats]);

  // Active reels filtered by reelsFilterTab ('all' or 'friends')
  const activeReels = mediaList.filter(item => {
    if (item.type !== 'reel') return false;
    if (reelsFilterTab === 'friends') {
      return Boolean(item.creatorId && friendContactIds.has(String(item.creatorId)));
    }
    return true;
  });

  // Handle like toggle
  const handleLike = (id: string) => {
    playSynthSound(780, 'sine', 0.1);
    setMediaList(prev => prev.map(item => {
      if (item.id === id) {
        const liked = !item.liked;
        return {
          ...item,
          liked,
          likes: liked ? item.likes + 1 : item.likes - 1
        };
      }
      return item;
    }));

    // Grant some reward points for activity
    setCurrentUser((prev: any) => ({
      ...prev,
      points: prev.points + 2
    }));
  };

  // Handle save toggle for Reel or Long Video
  const handleToggleSaveMedia = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    playSynthSound(750, 'sine', 0.1);

    const isCurrentlySaved = savedMediaIds.has(item.id);
    const willBeSaved = !isCurrentlySaved;

    // 1. Optimistic UI update
    setSavedMediaIds(prev => {
      const next = new Set(prev);
      if (willBeSaved) {
        next.add(item.id);
      } else {
        next.delete(item.id);
      }
      return next;
    });

    showToast(
      willBeSaved
        ? (lang === 'ar' ? 'تم حفظ المقطع في خزينة المحفوظات 🔖' : 'Saved to your bookmark vault 🔖')
        : (lang === 'ar' ? 'تمت إزالة المقطع من المحفوظات' : 'Removed from saved items')
    );

    // 2. Identify guest vs real account
    const isGuest = !currentUser?.id || currentUser.isAnonymous === true || currentUser.id === 'guest';
    const uid = currentUser?.id || 'guest';

    // 3. Persistent sync via savedItemsService
    const itemType: SavedItemType = item.type === 'reel' ? 'reel' : 'video';

    if (willBeSaved) {
      savedItemsService.saveItem(
        uid,
        itemType,
        item.id,
        {
          title: lang === 'ar' ? (item.titleAr || item.title) : item.title,
          contentSnippet: lang === 'ar' ? (item.descriptionAr || item.description) : item.description,
          thumbnailUrl: item.thumbnail,
          authorName: item.creator.name,
          authorAvatar: item.creator.avatar,
          timestamp: item.duration || (lang === 'ar' ? (itemType === 'reel' ? 'ريلز' : 'فيديو') : itemType),
          extraMeta: {
            category: lang === 'ar' ? item.categoryAr : item.category,
            type: item.type,
            likesCount: item.likes,
            commentsCount: item.comments?.length || 0,
            viewsCount: item.views
          }
        },
        isGuest // skipFirestore for guest
      ).catch(err => {
        console.warn('Background saveItem error in MediaPage:', err);
      });
    } else {
      savedItemsService.unsaveItem(
        uid,
        itemType,
        item.id,
        isGuest // skipFirestore for guest
      ).catch(err => {
        console.warn('Background unsaveItem error in MediaPage:', err);
      });
    }
  };

  // Add Comment or Reply
  const handleAddComment = (
    itemId: string, 
    isLiveChat: boolean = false, 
    parentCommentId?: string, 
    customText?: string
  ) => {
    if (isLiveChat) {
      if (!newLiveMessage.trim()) return;
      playSynthSound(600, 'sine', 0.05);
      setLiveChatMessages(prev => [
        ...prev,
        { sender: currentUser.name, text: newLiveMessage, time: 'Now' }
      ]);
      setNewLiveMessage('');
    } else {
      const textToUse = customText !== undefined ? customText : commentText;
      if (!textToUse.trim()) return;
      playSynthSound(600, 'sine', 0.05);
      const newComment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        author: currentUser.name,
        text: textToUse.trim(),
        time: lang === 'ar' ? 'الآن' : 'Just now',
        parentCommentId: parentCommentId
      };
      setMediaList(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            comments: [...item.comments, newComment]
          };
        }
        return item;
      }));
      setShowCommentsModal(prev => {
        if (prev && prev.id === itemId) {
          return {
            ...prev,
            comments: [...prev.comments, newComment]
          };
        }
        return prev;
      });
      if (parentCommentId) {
        setExpandedReplies(prev => new Set(prev).add(parentCommentId));
        setReplyText('');
        setReplyingCommentId(null);
      } else {
        setCommentText('');
      }
    }
  };

  // Handle scroll snap index for reels
  const handleReelsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // If controls overlay was visible, dismiss it on reel scroll interaction
    if (showMobileOverlay) {
      setShowMobileOverlay(false);
    }
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const reelHeight = container.clientHeight;
    const index = Math.round(scrollPosition / reelHeight);
    if (index !== currentReelIndex && index >= 0 && index < activeReels.length) {
      setCurrentReelIndex(index);
      setIsPlaying(true);
      playSynthSound(500 + index * 50, 'sine', 0.05);
    }
  };

  // Simulated live message ticker
  useEffect(() => {
    if (activeSubTab !== 'live') return;
    const interval = setInterval(() => {
      const liveComments = [
        'Woah, look at those energy spikes! ⚡',
        'Can you zoom into the Shackleton base dome?',
        'What is the delay on this quantum telemetry link?',
        'Hello from the desert of Lodavia! 🌌',
        'Is the AI autopilot online yet?',
        'Absolute 10/10 quality. ❤️'
      ];
      const senders = ['Samer', 'QuantumAstro', 'Leen', 'Zaid', 'Noor_F'];
      const randomText = liveComments[Math.floor(Math.random() * liveComments.length)];
      const randomSender = senders[Math.floor(Math.random() * senders.length)];
      setLiveChatMessages(prev => [
        ...prev,
        { sender: randomSender, text: randomText, time: 'Now' }
      ].slice(-8)); // keep last 8 comments
    }, 4500);

    return () => clearInterval(interval);
  }, [activeSubTab]);

  return (
    <div className={`flex flex-col ${activeSubTab === 'reels' ? 'gap-0 md:gap-6' : 'gap-3 md:gap-6'} max-w-5xl mx-auto w-full ${
      activeSubTab === 'reels' ? 'h-[calc(100dvh-68px)] md:h-auto flex-1 min-h-0 pb-0 md:pb-12' : 'pb-12'
    }`}>
      
      {/* HEADER SECTION - Hidden on mobile only when activeSubTab is reels */}
      <div className={`${
        activeSubTab === 'reels' ? 'hidden md:flex' : 'flex'
      } relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-void border border-slate-200 dark:border-white/10 p-6 md:p-8 flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl`}>
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-sky-500/10 dark:bg-nova-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-sky-600/10 dark:bg-aurora-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-sky-500 dark:bg-gradient-nova text-white shadow-md">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#111827] dark:text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'فضاء الوسائط الكونية' : 'Cosmic Media Center'}</span>
              <span className="text-[10px] bg-sky-500/15 text-sky-700 dark:text-aurora-400 px-2 py-0.5 rounded-full border border-sky-500/25 dark:border-aurora-500/25 uppercase tracking-widest font-mono font-bold">60 FPS Ultra</span>
            </h1>
            <p className="text-xs text-[#475569] dark:text-white/60 mt-1 max-w-md leading-relaxed font-medium">
              {lang === 'ar' 
                ? 'استكشف الفيديوهات القصيرة، النشرات الطويلة، والبث الحي لبيانات الفضاء البعيد والفيزياء الفلكية بأسلوب إنستغرام وتيك توك.' 
                : 'Immerse in educational vertical reels, deep astrophysics reviews, and live space telemetry streams.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.08);
              navigate('/camera');
            }}
            className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-sky-300/30"
          >
            <Camera className="w-4 h-4" />
            <span>{lang === 'ar' ? 'استوديو الكاميرا 📸' : 'Camera Studio 📸'}</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH - Hidden on mobile when reels is active, visible on desktop and all other subtabs */}
      <div className={`${
        activeSubTab === 'reels' ? 'hidden md:flex' : 'flex'
      } ${activeSubTab === 'reels' ? 'flex-row' : 'flex-col md:flex-row'} md:flex-row gap-2 md:gap-4 justify-between items-center bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-1.5 md:p-2 rounded-2xl relative z-10 shadow-sm shrink-0`}>
        
        {/* Sub Tabs Toggle */}
        <div className={`flex items-center gap-1.5 ${activeSubTab === 'reels' ? 'shrink-0' : 'w-full md:w-auto'}`}>
          {[
            { id: 'reels', labelAr: '🎬 ريلز قصيرة', labelEn: '🎬 Vertical Reels', shortAr: 'ريلز', shortEn: 'Reels', icon: Film },
            { id: 'videos', labelAr: '📺 فيديوهات طويلة', labelEn: '📺 Long Videos', shortAr: 'فيديو', shortEn: 'Videos', icon: Tv },
            { id: 'live', labelAr: '🔴 البث المباشر', labelEn: '🔴 Live Streams', shortAr: 'مباشر', shortEn: 'Live', icon: Radio }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.08);
                  setActiveSubTab(tab.id as any);
                }}
                title={lang === 'ar' ? tab.labelAr : tab.labelEn}
                className={`transition-all cursor-pointer ${
                  activeSubTab === 'reels'
                    ? `w-9 h-9 md:w-auto md:h-auto rounded-full md:rounded-xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-2 border p-0 md:px-4 md:py-2.5 text-[11px] font-black ${
                        isCurrent
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-cyan-400/50 text-white shadow-md'
                          : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                      }`
                    : `flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-[11px] font-black flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-cyan-400/50 text-white shadow-md'
                          : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                      }`
                }`}
              >
                <Icon className={`${activeSubTab === 'reels' ? 'w-4 h-4 md:w-3.5 md:h-3.5' : 'w-3.5 h-3.5'}`} />
                <span className={`${activeSubTab === 'reels' ? 'hidden md:inline' : 'inline'}`}>
                  {lang === 'ar' ? tab.labelAr : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className={`relative ${activeSubTab === 'reels' ? 'flex-1 md:w-80' : 'w-full md:w-80'} bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl flex items-center px-3 py-2 shrink-0`}>
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-white/50 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'البحث عن فيديوهات، قنوات...' : 'Search stellar videos, creators...'}
            className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-xs focus:ring-0 focus:outline-none px-2"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/50">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className={`relative z-10 w-full ${activeSubTab === 'reels' ? 'flex-1 min-h-0 h-full flex flex-col' : 'min-h-[500px]'}`}>
        
        {/* REELS: VERTICAL SNAP TIKTOK STYLE */}
        {activeSubTab === 'reels' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 h-full w-full">
            
            {/* Reels Video Feed Column */}
            <div className="md:col-span-8 flex flex-col items-center justify-center w-full flex-1 min-h-0 h-full">
              
              {/* Reels Tab Switcher: "الكل" و "الأصدقاء" */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl mb-3 z-20 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.08);
                    setReelsFilterTab('all');
                    setCurrentReelIndex(0);
                    if (reelsContainerRef.current) {
                      reelsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 rounded-xl border text-[11px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    reelsFilterTab === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-cyan-400/50 text-white shadow-md'
                      : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'الكل' : 'All'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.08);
                    setReelsFilterTab('friends');
                    setCurrentReelIndex(0);
                    if (reelsContainerRef.current) {
                      reelsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 rounded-xl border text-[11px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    reelsFilterTab === 'friends'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-cyan-400/50 text-white shadow-md'
                      : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'الأصدقاء' : 'Friends'}</span>
                </button>

                {/* زر إضافة ريل جديد (+) */}
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowUploadModal(true);
                  }}
                  title={lang === 'ar' ? 'إضافة ريل جديد' : 'Upload new reel'}
                  className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white shadow-md transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0 border border-cyan-400/40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeReels.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/5 text-center w-full max-w-[420px] shadow-sm my-auto">
                  {reelsFilterTab === 'friends' ? (
                    <Users className="w-12 h-12 text-slate-400 dark:text-white/50 mx-auto mb-3 animate-pulse" />
                  ) : (
                    <Film className="w-12 h-12 text-slate-400 dark:text-white/50 mx-auto mb-3 animate-pulse" />
                  )}
                  <span className="text-xs text-[#111827] dark:text-white/70 font-bold block">
                    {reelsFilterTab === 'friends' 
                      ? (lang === 'ar' ? 'لا يوجد ريلز من أصدقائك حالياً' : 'No reels from your friends right now')
                      : (lang === 'ar' ? 'لا توجد مقاطع ريلز' : 'No Reels Available')}
                  </span>
                  {reelsFilterTab === 'friends' && (
                    <button
                      type="button"
                      onClick={() => {
                        playSynthSound(500, 'sine', 0.08);
                        setReelsFilterTab('all');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95 transition-all"
                    >
                      {lang === 'ar' ? 'عرض جميع الريلز' : 'View all reels'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative w-full md:max-w-[420px] md:aspect-[9/16] h-[calc(100dvh-125px)] md:h-[640px] flex-1 min-h-0 rounded-none md:rounded-[36px] overflow-hidden border-0 md:border-4 border-white/10 bg-black shadow-2xl group flex flex-col">
                  
                  {/* Vertical Container for scrolling */}
                  <div 
                    ref={reelsContainerRef}
                    onScroll={handleReelsScroll}
                    onTouchStart={handleReelsTouchStart}
                    onTouchMove={handleReelsTouchMove}
                    onTouchEnd={handleReelsTouchEnd}
                    className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                  >
                    {activeReels.map((reel, idx) => (
                      <div 
                        key={reel.id} 
                        className="w-full h-[calc(100dvh-125px)] md:h-full snap-start snap-always relative shrink-0 flex flex-col justify-end p-4 pb-4 md:p-6"
                      >
                        {/* Background Cover Image filling entire container with object-cover */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                          <img 
                            src={reel.thumbnail} 
                            alt={reel.title} 
                            className="w-full h-full object-cover object-center pointer-events-none select-none" 
                          />
                          {/* Darken overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
                          
                          {/* Animated particle flow in background for cinematic 60fps look */}
                          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none mix-blend-color-dodge">
                            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-aurora-400/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-nova-500/10 rounded-full blur-3xl animate-pulse" />
                          </div>
                        </div>

                        {/* Interactive Play/Pause Trigger Zone (Middle) */}
                        <div 
                          onClick={() => {
                            playSynthSound(400, 'sine', 0.05);
                            setIsPlaying(!isPlaying);
                          }}
                          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                        >
                          {!isPlaying && (
                            <motion.div 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-md"
                            >
                              <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </motion.div>
                          )}
                        </div>

                        {/* Right Action floating panel */}
                        <div className="absolute right-3 md:right-4 bottom-20 md:bottom-24 z-20 flex flex-col items-center gap-3.5 md:gap-5">
                          {/* Creator Avatar */}
                          <div className="relative">
                            <img src={reel.creator.avatar} alt={reel.creator.name} className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-aurora-400 shadow-md shadow-glow-aurora" />
                            {reel.creator.badge && (
                              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-ember-500 to-ember-600 text-[6px] font-black p-0.5 rounded-full border border-black text-void-950">
                                ⭐
                              </div>
                            )}
                          </div>

                          {/* Like button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleLike(reel.id); }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border backdrop-blur-md transition-all active:scale-90 ${reel.liked ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-black/40 border-white/10 text-white hover:border-red-400'}`}>
                              <Heart className={`w-5 h-5 ${reel.liked ? 'fill-red-500' : ''}`} />
                            </div>
                            <span className="text-[10px] font-mono text-white/70 font-bold">{reel.likes.toLocaleString()}</span>
                          </button>

                          {/* Comments Trigger */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowCommentsModal(reel); }}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                          >
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 border border-white/10 hover:border-aurora-400 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-white/70 font-bold">{reel.comments.length}</span>
                          </button>

                          {/* Save / Bookmark Button */}
                          <button 
                            onClick={(e) => handleToggleSaveMedia(e, reel)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                            title={savedMediaIds.has(reel.id) ? (lang === 'ar' ? 'إلغاء الحفظ' : 'Unsave') : (lang === 'ar' ? 'حفظ المقطع' : 'Save')}
                          >
                            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border backdrop-blur-md transition-all active:scale-90 ${
                              savedMediaIds.has(reel.id)
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' 
                                : 'bg-black/40 border-white/10 text-white hover:border-amber-400'
                            }`}>
                              <Bookmark className={`w-5 h-5 ${savedMediaIds.has(reel.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${savedMediaIds.has(reel.id) ? 'text-amber-400' : 'text-white/60'}`}>
                              {savedMediaIds.has(reel.id) ? (lang === 'ar' ? 'محفوظ' : 'Saved') : (lang === 'ar' ? 'حفظ' : 'Save')}
                            </span>
                          </button>

                          {/* Share Button (Opens Share Modal) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playSynthSound(650, 'sine', 0.08);
                              setShowShareModal(reel);
                            }}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                            title={lang === 'ar' ? 'مشاركة' : 'Share'}
                          >
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 border border-white/10 hover:border-nova-400 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
                              <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">{lang === 'ar' ? 'مشاركة' : 'Share'}</span>
                          </button>

                          {/* More Options (...) Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playSynthSound(500, 'sine', 0.05);
                              setIsReportConfirmOpen(false);
                              setShowOptionsModal(reel);
                            }}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                            title={lang === 'ar' ? 'المزيد من الخيارات' : 'More options'}
                          >
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 border border-white/10 hover:border-sky-400 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
                              <MoreHorizontal className="w-5 h-5" />
                            </div>
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">{lang === 'ar' ? 'المزيد' : 'More'}</span>
                          </button>
                        </div>

                        {/* Bottom Information overlay on top of vertical page */}
                        <div className="relative z-20 max-w-[calc(100%-60px)] md:max-w-[280px] text-start flex flex-col gap-1.5 md:gap-2 pb-1 md:pb-0">
                          <span className="px-2.5 py-0.5 rounded-full bg-aurora-500/20 text-aurora-400 text-[8px] font-mono border border-aurora-500/30 uppercase tracking-widest w-fit font-black">
                            {lang === 'ar' ? reel.categoryAr : reel.category}
                          </span>
                          <h3 className="text-sm font-black text-white leading-snug drop-shadow-md line-clamp-2">
                            {lang === 'ar' ? reel.titleAr : reel.title}
                          </h3>
                          <p className="text-[11px] text-white/70 line-clamp-2 drop-shadow-sm leading-relaxed">
                            {lang === 'ar' ? reel.descriptionAr : reel.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/60 mt-0.5 font-semibold">
                            <span className="text-white">@{reel.creator.name}</span>
                            <span>•</span>
                            <span>{reel.views.toLocaleString()} views</span>
                          </div>
                        </div>

                        {/* Infinite sound loop wave indicator */}
                        {isPlaying && (
                          <div className="absolute left-4 md:left-6 bottom-40 md:bottom-44 z-20 flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.4s_infinite_alternate]" style={{ height: '70%' }} />
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.3s_infinite_alternate]" style={{ height: '100%', animationDelay: '0.1s' }} />
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.5s_infinite_alternate]" style={{ height: '40%', animationDelay: '0.2s' }} />
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* Mobile Top Safe Tap Zone to reveal overlay (Top 15%) */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerMobileOverlay();
                    }}
                    className="md:hidden absolute top-0 inset-x-0 h-16 z-20 cursor-pointer pointer-events-auto"
                    title="Tap to reveal navigation and search"
                  />

                  {/* Mobile Reels Top Controls Overlay */}
                  <AnimatePresence>
                    {showMobileOverlay && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="md:hidden absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-black/90 via-black/70 to-transparent pt-3 pb-8 px-3 flex flex-col gap-2.5 backdrop-blur-xs"
                      >
                        {/* Top bar with logo, profile, points, and close */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              onClick={() => navigate('/profile')}
                              className="w-7 h-7 rounded-full object-cover border border-sky-400 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-white truncate max-w-[100px]">{currentUser.name}</span>
                              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.5 rounded-full font-mono">
                                💎 {currentUser.points}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black tracking-widest text-sky-400">LODAVIA</span>
                            <button
                              onClick={() => setShowMobileOverlay(false)}
                              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Search and Sub Tabs overlay row */}
                        <div className="flex items-center gap-1.5">
                          {/* Subtabs selector */}
                          <div className="flex items-center gap-1 shrink-0 bg-white/10 p-1 rounded-xl border border-white/10">
                            {[
                              { id: 'reels', label: '🎬', name: lang === 'ar' ? 'ريلز' : 'Reels' },
                              { id: 'videos', label: '📺', name: lang === 'ar' ? 'فيديو' : 'Videos' },
                              { id: 'live', label: '🔴', name: lang === 'ar' ? 'مباشر' : 'Live' }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  playSynthSound(500, 'sine', 0.08);
                                  setActiveSubTab(tab.id as any);
                                  if (tab.id !== 'reels') {
                                    setShowMobileOverlay(false);
                                  }
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                  activeSubTab === tab.id
                                    ? 'bg-sky-500 text-white shadow-sm'
                                    : 'text-white/70 hover:text-white'
                                }`}
                              >
                                <span>{tab.label}</span>
                                <span>{tab.name}</span>
                              </button>
                            ))}
                          </div>

                          {/* Quick Search Input */}
                          <div className="flex-1 relative flex items-center bg-white/10 border border-white/15 rounded-xl px-2.5 py-1">
                            <Search className="w-3 h-3 text-white/60 shrink-0" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
                              className="w-full bg-transparent border-0 text-white placeholder-white/40 text-[11px] focus:outline-none px-1.5 py-0.5"
                            />
                            {searchQuery && (
                              <button onClick={() => setSearchQuery('')} className="p-0.5 text-white/60">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* زر إضافة ريل جديد (+) */}
                          <button
                            type="button"
                            onClick={() => {
                              playSynthSound(600, 'sine', 0.05);
                              setShowUploadModal(true);
                              setShowMobileOverlay(false);
                            }}
                            title={lang === 'ar' ? 'إضافة ريل جديد' : 'Upload new reel'}
                            className="p-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md cursor-pointer shrink-0 hover:opacity-90 active:scale-95 transition-all border border-cyan-400/40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}
            </div>

            {/* Side Tips & Navigation Card - Hidden on mobile, shown on desktop (md+) */}
            <div className="hidden md:flex md:col-span-4 flex-col gap-4">
              <div className="bg-white dark:bg-slate-900/70 p-5 rounded-3xl border border-slate-200 dark:border-white/10 text-start space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'تعليمات الملاحة الفلكية' : 'Cosmic Reel Guide'}</h3>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-white/60 leading-relaxed">
                  {lang === 'ar' 
                    ? 'استخدم عجلة الفأرة أو اسحب للأعلى وللأسفل للتنقل بين المقاطع التعليمية الفائقة بشكل سلس.' 
                    : 'Scroll or drag vertically inside the interactive phone interface to cycle through next-gen astrophysics clips.'}
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-cyan-600 dark:text-aurora-400 font-extrabold block">HOTKEY STATS</span>
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-white/50 font-semibold">
                    <span>Snap Target:</span>
                    <span className="text-slate-900 dark:text-white/70">Enabled</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-white/50 font-semibold">
                    <span>Frame Rate:</span>
                    <span className="text-slate-900 dark:text-white/70">60 FPS</span>
                  </div>
                </div>
              </div>

              {/* Creator Spotlight */}
              <div className="bg-white dark:bg-slate-900/70 p-5 rounded-3xl border border-slate-200 dark:border-white/10 text-start space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'نجم المبدعين اليوم' : 'Creator Spotlight'}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="spot" className="w-10 h-10 rounded-full object-cover border border-cyan-400" />
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">AstroVisuals</span>
                    <span className="text-[9px] text-slate-500 dark:text-white/50">124K Cosmic followers</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* LONG VIDEOS: CURATED CLASSIC FEED */}
        {activeSubTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                id={`video-${item.id}`}
                className="bg-white dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:border-cyan-500/50 transition-all duration-300 flex flex-col text-start group"
              >
                {/* Thumbnail container */}
                <div className="h-44 w-full relative overflow-hidden bg-black shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  
                  {/* Duration pill */}
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white font-mono">
                      {item.duration}
                    </div>
                  )}

                  {/* Floating Play Button overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info and detail panel */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-full font-mono border border-cyan-500/20 uppercase tracking-widest font-black inline-block">
                      {lang === 'ar' ? item.categoryAr : item.category}
                    </span>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug">
                      {lang === 'ar' ? item.titleAr : item.title}
                    </h3>
                    <p className="text-[10px] text-slate-600 dark:text-white/60 line-clamp-2 leading-relaxed">
                      {lang === 'ar' ? item.descriptionAr : item.description}
                    </p>
                  </div>

                  {/* Creator and views footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <div className="flex items-center gap-2">
                      <img src={item.creator.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                      <div>
                        <span className="text-[10px] font-black text-slate-800 dark:text-white/70 block">{item.creator.name}</span>
                        <span className="text-[8px] text-slate-500 dark:text-white/50 block">{item.views.toLocaleString()} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Save Video Button */}
                      <button 
                        onClick={(e) => handleToggleSaveMedia(e, item)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          savedMediaIds.has(item.id)
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400 font-extrabold shadow-sm'
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60 hover:text-amber-500 hover:border-amber-500/30'
                        }`}
                        title={savedMediaIds.has(item.id) ? (lang === 'ar' ? 'إلغاء الحفظ' : 'Unsave') : (lang === 'ar' ? 'حفظ الفيديو' : 'Save Video')}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedMediaIds.has(item.id) ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
                        <span>{savedMediaIds.has(item.id) ? (lang === 'ar' ? 'محفوظ' : 'Saved') : (lang === 'ar' ? 'حفظ' : 'Save')}</span>
                      </button>

                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          playSynthSound(700, 'sine', 0.1);
                          const link = `${window.location.origin}/media?video=${item.id}`;
                          await copyToClipboard(link);
                          showToast(lang === 'ar' ? 'تم نسخ رابط الفيديو بنجاح! 🔗' : 'Video link copied to clipboard! 🔗');
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-sky-500 hover:border-sky-500/30 transition-all cursor-pointer"
                        title={lang === 'ar' ? 'نسخ الرابط' : 'Copy link'}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'نسخ الرابط' : 'Share'}</span>
                      </button>

                      <button 
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${item.liked ? 'bg-red-500/10 border-red-500/20 text-red-500 font-extrabold' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.liked ? 'fill-red-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                <Tv className="w-12 h-12 text-slate-400 dark:text-white/40 mx-auto mb-3" />
                <span className="text-xs text-[#111827] dark:text-white/60 font-bold block">{lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No long-form video signals matched your query'}</span>
              </div>
            )}
          </div>
        )}

        {/* LIVE STREAMS: INTERACTIVE HUD SIMULATION */}
        {activeSubTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Live stream player container */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {filteredItems.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
                  <Radio className="w-12 h-12 text-slate-400 dark:text-white/40 mx-auto mb-3" />
                  <span className="text-xs text-[#111827] dark:text-white/60 font-bold block">{lang === 'ar' ? 'لا توجد بثوث نشطة حالياً' : 'No Active Live Beacons Detected'}</span>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div key={item.id} className="flex flex-col gap-4">
                    {/* Immersive player with live indicator overlay */}
                    <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 relative bg-black shadow-2xl">
                      {/* Thumbnail as live background loop simulator */}
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80" />
                      
                      {/* Absolute overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      
                      {/* Top bar status */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <div className="flex gap-2 items-center">
                          <span className="bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse flex items-center gap-1">
                            <Radio className="w-3 h-3 text-white" />
                            <span>{lang === 'ar' ? 'مباشر' : 'LIVE'}</span>
                          </span>
                          <span className="bg-black/60 text-white/70 font-mono text-[9px] px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1">
                            <Users className="w-3 h-3 text-aurora-400" />
                            <span>{item.views} viewers</span>
                          </span>
                        </div>

                        <span className="bg-black/60 text-emerald-400 font-mono text-[9px] px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md uppercase tracking-wider font-bold">
                          FPS: 60.0 • LATENCY: 2.4s
                        </span>
                      </div>

                      {/* Simulation radar sweeps on the video screen itself to enhance Lodavia aesthetic */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        {/* Radar grid sweep effect */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-aurora-400/15 animate-[scan_6s_infinite_linear]" />
                      </div>

                      {/* Content overlay inside screen bottom */}
                      <div className="absolute bottom-4 left-4 right-4 text-start z-10 max-w-lg">
                        <h2 className="text-sm md:text-base font-black text-white leading-snug drop-shadow-md">
                          {lang === 'ar' ? item.titleAr : item.title}
                        </h2>
                        <p className="text-xs text-white/70 line-clamp-1 mt-1 font-semibold leading-relaxed">
                          {lang === 'ar' ? item.descriptionAr : item.description}
                        </p>
                      </div>

                    </div>

                    {/* Streamer Panel details */}
                    <div className="bg-white dark:bg-slate-900/70 p-5 rounded-3xl border border-slate-200 dark:border-white/10 text-start flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.creator.avatar} alt="host" className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400" />
                        <div>
                          <span className="text-xs font-black text-slate-900 dark:text-white block">{item.creator.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-white/50">{lang === 'ar' ? 'مستضيف البث الكوني' : 'Deep Space Telemetry Anchor'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            playSynthSound(700, 'sine', 0.1);
                            const link = `${window.location.origin}/media?live=${item.id}`;
                            await copyToClipboard(link);
                            showToast(lang === 'ar' ? 'تم نسخ رابط البث المباشر! 🔗' : 'Live stream link copied! 🔗');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-white/70 flex items-center gap-1.5 cursor-pointer"
                          title={lang === 'ar' ? 'نسخ رابط البث' : 'Copy live stream link'}
                        >
                          <Share2 className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}</span>
                        </button>

                        <button 
                          onClick={() => handleLike(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-white/70 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                          <span>{item.likes}</span>
                        </button>
                        <button 
                          onClick={async () => {
                            playSynthSound(750, 'sine', 0.1);
                            await copyToClipboard('lodavia-stream-99x-live');
                            showToast(lang === 'ar' ? 'تم نسخ مفتاح التشفير للبث! 🔑' : 'Quantum stream decryption key copied! 🔑');
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'تشفير كمي' : 'Decrypt Link'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Simulated Live Chat (Instagram/Twitch style) */}
            <div className="lg:col-span-4 flex flex-col gap-4 w-full">
              <div className="bg-white dark:bg-slate-900/70 p-5 rounded-3xl border border-slate-200 dark:border-white/10 text-start flex flex-col h-[400px] justify-between relative overflow-hidden shadow-sm">
                
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-white/5 pb-3 shrink-0 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'الدردشة الحية 💬' : 'Live Quantum Chat 💬'}</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>

                {/* Messages scroll list */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 no-scrollbar flex flex-col justify-end">
                  {liveChatMessages.map((msg, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs text-slate-700 dark:text-white/70 leading-snug animate-[fadeIn_0.3s_ease-out] group/chat">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">@{msg.sender}:</span>
                      <p className="flex-1 text-slate-800 dark:text-white/80">{msg.text}</p>
                      <button
                        onClick={async () => {
                          playSynthSound(800, 'sine', 0.08);
                          await copyToClipboard(msg.text);
                          setCopiedMsgIndex(i);
                          showToast(lang === 'ar' ? 'تم نسخ الرد بنجاح! 📋' : 'Reply copied! 📋');
                          setTimeout(() => setCopiedMsgIndex(null), 2000);
                        }}
                        className="opacity-0 group-hover/chat:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-cyan-500 transition-opacity cursor-pointer shrink-0"
                        title={lang === 'ar' ? 'نسخ الرد' : 'Copy reply'}
                      >
                        {copiedMsgIndex === i ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input block */}
                <div className="border-t border-slate-100 dark:border-white/5 pt-3 shrink-0 flex gap-2">
                  <input
                    type="text"
                    value={newLiveMessage}
                    onChange={(e) => setNewLiveMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment('', true); }}
                    placeholder={lang === 'ar' ? 'أرسل رسالة كمية للبث...' : 'Transmit quantum message...'}
                    className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400 placeholder-slate-400 dark:placeholder-white/40"
                  />
                  <button 
                    onClick={() => handleAddComment('', true)}
                    className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all active:scale-90"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* ----------------- COMMENTS MODAL / BOTTOM SHEET (FOR REELS) ----------------- */}
      <AnimatePresence>
        {showCommentsModal && (
          <div 
            onClick={() => setShowCommentsModal(null)}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl p-5 md:p-6 max-w-md w-full border-t md:border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-[70vh] md:h-[500px] justify-between text-start pb-6 md:pb-6"
            >
              {/* Drag Handle for Mobile Bottom Sheet */}
              <div className="md:hidden flex justify-center -mt-1 mb-3 shrink-0">
                <div className="w-10 h-1 bg-slate-300 dark:bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
                <div>
                  <h3 className="text-xs font-black text-[#111827] dark:text-white">{lang === 'ar' ? 'التعليقات الكونية' : 'Cosmic Comments'}</h3>
                  <span className="text-[10px] text-[#64748B] dark:text-white/50">{showCommentsModal.comments.length} {lang === 'ar' ? 'ردود مسجلة' : 'Comments logged'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      playSynthSound(700, 'sine', 0.1);
                      const link = `${window.location.origin}/media?reel=${showCommentsModal.id}`;
                      await copyToClipboard(link);
                      showToast(lang === 'ar' ? 'تم نسخ رابط المقطع! 🔗' : 'Reel link copied! 🔗');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 text-[10px] font-bold transition-all border border-slate-200 dark:border-white/5 cursor-pointer"
                    title={lang === 'ar' ? 'نسخ الرابط' : 'Copy link'}
                  >
                    <Share2 className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'نسخ الرابط' : 'Copy link'}</span>
                  </button>

                  <button 
                    onClick={() => setShowCommentsModal(null)} 
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments Scroller */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5 min-h-0">
                {(() => {
                  const allComments = showCommentsModal.comments;
                  const rootComments = allComments.filter(c => !c.parentCommentId);

                  if (rootComments.length === 0) {
                    return (
                      <div className="py-12 text-center text-[#64748B] dark:text-white/50 text-xs font-mono">
                        {lang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يرسل رسالته! ☄️' : 'No comments logged. Be the first to emit stardust input! ☄️'}
                      </div>
                    );
                  }

                  return rootComments.map((comment, i) => {
                    const commentId = comment.id || `c_root_${i}`;
                    const replies = allComments.filter(c => c.parentCommentId === commentId);
                    const isReplying = replyingCommentId === commentId;
                    const isExpanded = expandedReplies.has(commentId);

                    return (
                      <div key={commentId} className="space-y-2">
                        {/* Main Root Comment Card */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 flex gap-3 items-start justify-between group/comment">
                          <div className="flex gap-3 items-start flex-1 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-aurora-500/10 border border-sky-500/20 dark:border-aurora-400/20 flex items-center justify-center text-[10px] text-sky-600 dark:text-aurora-400 font-bold font-mono shrink-0">
                              {comment.author[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-[#111827] dark:text-white/80">{comment.author}</span>
                                <span className="text-[8px] text-[#64748B] dark:text-white/50 font-mono">{comment.time}</span>
                              </div>
                              <p className="text-xs text-[#475569] dark:text-white/70 mt-1 leading-relaxed break-words">{comment.text}</p>

                              {/* Action Row: Reply & Toggle Replies */}
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playSynthSound(650, 'sine', 0.05);
                                    if (isReplying) {
                                      setReplyingCommentId(null);
                                      setReplyText('');
                                    } else {
                                      setReplyingCommentId(commentId);
                                      setReplyText('');
                                    }
                                  }}
                                  className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <CornerDownLeft className="w-3 h-3" />
                                  <span>{lang === 'ar' ? 'رد' : 'Reply'}</span>
                                </button>

                                {replies.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandedReplies(commentId)}
                                    className="text-[10px] font-bold text-slate-500 dark:text-white/50 hover:text-sky-500 cursor-pointer transition-colors flex items-center gap-1"
                                  >
                                    <span>
                                      {isExpanded
                                        ? (lang === 'ar' ? 'إخفاء الردود ▴' : 'Hide replies ▴')
                                        : (lang === 'ar' 
                                            ? (replies.length === 1 ? 'عرض رد واحد ▾' : `عرض ${replies.length} ردود ▾`) 
                                            : (replies.length === 1 ? 'View 1 reply ▾' : `View ${replies.length} replies ▾`))}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={async () => {
                              playSynthSound(800, 'sine', 0.08);
                              await copyToClipboard(comment.text);
                              setCopiedCommentIndex(i);
                              showToast(lang === 'ar' ? 'تم نسخ الرد بنجاح! 📋' : 'Reply copied to clipboard! 📋');
                              setTimeout(() => setCopiedCommentIndex(null), 2000);
                            }}
                            className="p-1.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-400 hover:text-sky-500 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                            title={lang === 'ar' ? 'نسخ الرد' : 'Copy reply'}
                          >
                            {copiedCommentIndex === i ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[9px] text-emerald-500 font-bold hidden sm:inline">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold text-slate-400 hover:text-sky-500 hidden sm:inline">{lang === 'ar' ? 'نسخ الرد' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Inline sub-input for reply */}
                        {isReplying && (
                          <div className="ps-6 sm:ps-8 flex items-center gap-2 animate-[fadeIn_0.15s_ease-out]">
                            <input
                              type="text"
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(showCommentsModal.id, false, commentId, replyText);
                                }
                              }}
                              placeholder={lang === 'ar' ? `اكتب رداً على ${comment.author}...` : `Reply to ${comment.author}...`}
                              className="flex-1 bg-slate-100 dark:bg-black/50 border border-sky-400/40 dark:border-sky-500/40 rounded-xl px-3 py-1.5 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-sky-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(showCommentsModal.id, false, commentId, replyText)}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 shrink-0"
                            >
                              {lang === 'ar' ? 'إرسال' : 'Post'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingCommentId(null);
                                setReplyText('');
                              }}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-400 text-xs cursor-pointer shrink-0"
                              title={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Nested Replies with Indentation */}
                        {replies.length > 0 && isExpanded && (
                          <div className="ps-6 sm:ps-8 border-s-2 border-sky-500/30 dark:border-sky-400/20 space-y-2 mt-1">
                            {replies.map((reply, rIdx) => (
                              <div 
                                key={reply.id || `rep_${rIdx}`} 
                                className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex gap-2.5 items-start justify-between"
                              >
                                <div className="flex gap-2 items-start flex-1 min-w-0">
                                  <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {reply.author[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-black text-[#111827] dark:text-white/80">{reply.author}</span>
                                      <span className="text-[8px] text-[#64748B] dark:text-white/50 font-mono">{reply.time}</span>
                                    </div>
                                    <p className="text-xs text-[#475569] dark:text-white/70 mt-0.5 leading-relaxed break-words">{reply.text}</p>
                                  </div>
                                </div>

                                <button
                                  onClick={async () => {
                                    playSynthSound(800, 'sine', 0.08);
                                    await copyToClipboard(reply.text);
                                    showToast(lang === 'ar' ? 'تم نسخ الرد بنجاح! 📋' : 'Reply copied! 📋');
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-sky-500 transition-colors shrink-0 cursor-pointer"
                                  title={lang === 'ar' ? 'نسخ' : 'Copy'}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Quick Emojis Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 dark:border-white/5 shrink-0 scrollbar-none">
                {['😂', '😮', '😍', '😢', '👏', '🔥', '🙌', '❤️'].map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSynthSound(600 + idx * 30, 'sine', 0.04);
                      setCommentText(prev => prev + emoji);
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-base sm:text-lg transition-all active:scale-90 cursor-pointer shrink-0"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Sticky Input Form at bottom */}
              <div className="border-t border-slate-100 dark:border-white/5 pt-2.5 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(showCommentsModal.id); }}
                  placeholder={lang === 'ar' ? 'اكتب تعليقاً فلكياً...' : 'Share cosmic thought...'}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-sky-500"
                />
                <button 
                  onClick={() => handleAddComment(showCommentsModal.id)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-sm"
                >
                  {lang === 'ar' ? 'إرسال' : 'Post'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- MORE OPTIONS BOTTOM SHEET (FOR REELS) ----------------- */}
      <AnimatePresence>
        {showOptionsModal && (
          <div 
            onClick={handleCloseOptionsModal}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full md:max-w-md bg-white dark:bg-[#0c1424] border-t md:border border-slate-200 dark:border-white/10 rounded-t-3xl md:rounded-3xl p-4 sm:p-5 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drag Handle for Mobile Bottom Sheet */}
              <div className="md:hidden flex justify-center -mt-1 mb-3 shrink-0">
                <div className="w-10 h-1 bg-slate-300 dark:bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#111827] dark:text-white">
                      {lang === 'ar' ? 'خيارات إضافية' : 'More Options'}
                    </h3>
                    <p className="text-[10px] text-[#64748B] dark:text-white/50 line-clamp-1 max-w-[240px]">
                      {lang === 'ar' ? showOptionsModal.titleAr : showOptionsModal.title}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseOptionsModal} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-900 dark:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content: Either Report Confirmation or Options List */}
              {isReportConfirmOpen ? (
                <div className="py-4 space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {lang === 'ar' ? 'هل أنت متأكد من الإبلاغ عن هذا المحتوى؟' : 'Are you sure you want to report this content?'}
                      </h4>
                      <p className="text-[10px] text-rose-600/80 dark:text-rose-300/70 mt-1 leading-relaxed">
                        {lang === 'ar' 
                          ? 'سيتم مراجعة المقطع من قبل فريق الأمان للتأكد من موافقته لمعايير المجتمع.'
                          : 'Our safety team will review this reel against community standards.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setIsReportConfirmOpen(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-white/80 transition-all cursor-pointer"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => {
                        playSynthSound(500, 'sine', 0.1);
                        setIsReportConfirmOpen(false);
                        setShowOptionsModal(null);
                        showToast(lang === 'ar' ? 'تم إرسال بلاغك، شكراً لمساهمتك في أمان المجتمع' : 'Report sent. Thank you for contributing to community safety');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                    >
                      {lang === 'ar' ? 'نعم' : 'Yes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2.5 space-y-1">
                  {/* 1. Bookmark / Save */}
                  <button
                    onClick={(e) => {
                      handleToggleSaveMedia(e, showOptionsModal);
                      setShowOptionsModal(null);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-start cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      savedMediaIds.has(showOptionsModal.id)
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 group-hover:text-amber-500'
                    }`}>
                      <Bookmark className={`w-4 h-4 ${savedMediaIds.has(showOptionsModal.id) ? 'fill-amber-500' : ''}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {savedMediaIds.has(showOptionsModal.id)
                          ? (lang === 'ar' ? 'إلغاء الحفظ' : 'Unsave')
                          : (lang === 'ar' ? 'حفظ' : 'Save')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-white/40 block">
                        {savedMediaIds.has(showOptionsModal.id)
                          ? (lang === 'ar' ? 'إزالة هذا المقطع من قائمة محفوظاتك' : 'Remove this reel from your saved vault')
                          : (lang === 'ar' ? 'حفظ هذا المقطع للرجوع إليه لاحقاً' : 'Save this reel to your private bookmarks')}
                      </span>
                    </div>
                  </button>

                  {/* 2. Interested */}
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.1);
                      setShowOptionsModal(null);
                      showToast(lang === 'ar' ? 'شكراً لملاحظتك' : 'Thanks for your feedback');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-start cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all">
                      <ThumbsUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lang === 'ar' ? 'مهتم' : 'Interested'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-white/40 block">
                        {lang === 'ar' ? 'سنعرض لك المزيد من هذا المحتوى' : 'Show more content like this'}
                      </span>
                    </div>
                  </button>

                  {/* 3. Not Interested */}
                  <button
                    onClick={() => {
                      playSynthSound(400, 'sine', 0.1);
                      setShowOptionsModal(null);
                      showToast(lang === 'ar' ? 'سنعرض لك محتوى أقل من هذا النوع' : "We'll show less content like this");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-start cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 group-hover:text-amber-500 group-hover:bg-amber-500/10 flex items-center justify-center transition-all">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lang === 'ar' ? 'غير مهتم' : 'Not interested'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-white/40 block">
                        {lang === 'ar' ? 'تقليل ظهور مقاطع مشابهة' : 'Show fewer reels like this'}
                      </span>
                    </div>
                  </button>

                  {/* 4. Report (Red) */}
                  <button
                    onClick={() => {
                      playSynthSound(300, 'sawtooth', 0.1);
                      setIsReportConfirmOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-500/10 transition-all text-start cursor-pointer group text-rose-500"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-all">
                      <Flag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                        {lang === 'ar' ? 'إبلاغ' : 'Report'}
                      </span>
                      <span className="text-[10px] text-rose-500/70 block">
                        {lang === 'ar' ? 'الإبلاغ عن محتوى غير لائق أو مخالف' : 'Report inappropriate or violating content'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- SHARE BOTTOM SHEET (FOR REELS) ----------------- */}
      <AnimatePresence>
        {showShareModal && (
          <div 
            onClick={() => setShowShareModal(null)}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full md:max-w-md bg-white dark:bg-[#0c1424] border-t md:border border-slate-200 dark:border-white/10 rounded-t-3xl md:rounded-3xl p-4 sm:p-5 flex flex-col shadow-2xl overflow-hidden max-h-[85vh]"
            >
              {/* Drag Handle for Mobile Bottom Sheet */}
              <div className="md:hidden flex justify-center -mt-1 mb-3 shrink-0">
                <div className="w-10 h-1 bg-slate-300 dark:bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#111827] dark:text-white">
                      {lang === 'ar' ? 'مشاركة الريل' : 'Share Reel'}
                    </h3>
                    <p className="text-[10px] text-[#64748B] dark:text-white/50 line-clamp-1 max-w-[240px]">
                      {lang === 'ar' ? showShareModal.titleAr : showShareModal.title}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowShareModal(null)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-900 dark:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 space-y-4 overflow-y-auto min-h-0 flex-1">
                {/* 1. Quick Copy Link Option */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 truncate block max-w-[200px] sm:max-w-[240px]">
                        {`${window.location.origin}/media?reel=${showShareModal.id}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      playSynthSound(700, 'sine', 0.1);
                      const link = `${window.location.origin}/media?reel=${showShareModal.id}`;
                      await copyToClipboard(link);
                      showToast(lang === 'ar' ? 'تم نسخ رابط المقطع بنجاح! 🔗' : 'Reel link copied to clipboard! 🔗');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                  </button>
                </div>

                {/* 2. Direct Send to Friends List */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 px-0.5">
                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                      {lang === 'ar' ? 'إرسال مباشر إلى الأصدقاء' : 'Send directly to friends'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {chats?.length || 0} {lang === 'ar' ? 'صديق متاح' : 'available'}
                    </span>
                  </div>

                  {chats && chats.length > 0 ? (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {chats.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent hover:border-slate-200 dark:hover:border-white/5 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={friend.contactAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.contactName)}&background=0284c7&color=fff`}
                                alt={friend.contactName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                              />
                              {friend.isOnline && (
                                <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1424]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                {friend.contactName}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-white/40 block">
                                {friend.isOnline 
                                  ? (lang === 'ar' ? 'متصل الآن' : 'Online') 
                                  : (lang === 'ar' ? 'غير متصل' : 'Offline')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={async () => {
                              playSynthSound(800, 'sine', 0.1);
                              const reelLink = `${window.location.origin}/media?reel=${showShareModal.id}`;
                              const message: ChatMessage = {
                                id: `msg_reel_${Date.now()}`,
                                senderId: currentUser?.id || 'me',
                                text: `${lang === 'ar' ? '🎬 شارك معك مقطع ريل:' : '🎬 Shared a reel with you:'} "${lang === 'ar' ? showShareModal.titleAr : showShareModal.title}"\n${reelLink}`,
                                type: 'video',
                                mediaUrl: showShareModal.videoUrl || showShareModal.thumbnail,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: 'read'
                              };

                              await chatService.sendMessage(friend.id, message);
                              showToast(
                                lang === 'ar' 
                                  ? `تم إرسال الريل إلى ${friend.contactName} 🚀` 
                                  : `Reel sent to ${friend.contactName} 🚀`
                              );
                              setShowShareModal(null);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white text-xs font-bold transition-all cursor-pointer border border-sky-500/20 hover:border-sky-500 active:scale-95 flex items-center gap-1.5 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      {lang === 'ar' ? 'لا توجد محادثات نشطة حالياً' : 'No active chats found'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- UPLOAD MODAL ----------------- */}
      <UploadMediaModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />

      {/* ----------------- FLOATING TOAST NOTIFICATION ----------------- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-bold shadow-2xl border border-sky-500/30 backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
