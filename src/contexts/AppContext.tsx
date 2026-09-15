import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  AppUser, 
  CommunityItem, 
  VoiceRoom, 
  VideoRoom, 
  LiveStream, 
  Course, 
  EventItem, 
  ChatConversation, 
  Post, 
  ChatMessage,
  SupportedLanguage,
  LanguageInfo
} from '../types';
import { ActiveCallState } from '../types/call';
import { 
  initialUser, 
  allCommunities, 
  initialChats, 
  todayEvents, 
  initialHomePosts 
} from '../data';
import { authService, firestoreService, storageService } from '../firebase/services';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { creditFirstActivity } from '../utils/referral';
import { playSynthSound } from '../utils/synth';
import {
  translate,
  detectDeviceLanguage,
  formatDate as formatI18nDate,
  formatTime as formatI18nTime,
  formatNumber as formatI18nNumber,
  formatRelativeTime as formatI18nRelativeTime,
  formatCurrency as formatI18nCurrency,
  getLanguageInfo,
  isRtlLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
} from '../locales';

interface AppContextType {
  currentUser: AppUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser>>;
  communities: CommunityItem[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  chats: ChatConversation[];
  setChats: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  homePosts: Post[];
  setHomePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isDataLoading: boolean;
  
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
  supportedLanguages: LanguageInfo[];
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatRelativeTime: (date: Date | string | number) => string;
  formatCurrency: (amount: number, currency?: string) => string;

  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;

  activePostCommentsId: string | null;
  setActivePostCommentsId: (id: string | null) => void;
  commentInputs: { [postId: string]: string };
  setCommentInputs: React.Dispatch<React.SetStateAction<{ [postId: string]: string }>>;
  newPostText: string;
  setNewPostText: (text: string) => void;
  newPostMedia: { type: 'none' | 'image' | 'video'; url: string };
  setNewPostMedia: React.Dispatch<React.SetStateAction<{ type: 'none' | 'image' | 'video'; url: string }>>;
  
  activeCommunity: CommunityItem | null;
  setActiveCommunity: (community: CommunityItem | null) => void;
  activeChat: ChatConversation | null;
  setActiveChat: (chat: ChatConversation | null) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  activeCall: ActiveCallState | { type: 'voice' | 'video'; contactName: string; status: any; [key: string]: any } | null;
  setActiveCall: (call: ActiveCallState | { type: 'voice' | 'video'; contactName: string; status: any; [key: string]: any } | null) => void;

  aiGenerating: boolean;
  setAiGenerating: (gen: boolean) => void;
  aiSuggestionText: { ar: string; en: string } | null;
  setAiSuggestionText: (text: { ar: string; en: string } | null) => void;

  showStoreModal: boolean;
  setShowStoreModal: (show: boolean) => void;
  showAdPlayer: boolean;
  setShowAdPlayer: (show: boolean) => void;
  adCountdown: number;
  setAdCountdown: React.Dispatch<React.SetStateAction<number>>;
  adRewardClaimable: boolean;
  setAdRewardClaimable: (claimable: boolean) => void;
  currentAdCompany: string;
  setCurrentAdCompany: (company: string) => void;
  storeMessage: string;
  setStoreMessage: (msg: string) => void;

  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  handleLikeHomePost: (postId: string) => Promise<void>;
  handleSaveHomePost: (postId: string) => void;
  handleAddHomeComment: (postId: string) => Promise<void>;
  handleCreateHomePost: () => Promise<void>;
  handleCreateSubmit: (e: React.FormEvent, selectedCreateType: string, postContent: string, newRoomTitle: string) => Promise<void>;
  handleSendChat: (chatInput: string, setChatInput: (val: string) => void) => Promise<void>;
  startWatchingAd: () => void;
  claimAdReward: () => void;
  handlePurchaseItem: (item: any) => void;
  handleBuyAndOpenCosmicPack: (packId: string) => Promise<{ success: boolean; rewardItem: any; isDuplicate: boolean; shardsAwarded: number; messageAr?: string }>;
  handleEquipCosmetic: (type: string, item: any) => void;
  handleUnequipCosmetic: (type: string) => void;
  handleToggleFavoriteCosmetic: (itemId: string) => void;
  handleMarkCosmeticSeen: (itemId: string) => void;
  handleClaimDailyCosmicReward: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    try {
      const saved = localStorage.getItem('lodavia_current_user') || localStorage.getItem('lumo_current_user');
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lodavia_current_user', JSON.stringify(currentUser));
    } catch {
      // ignore storage quota errors
    }
  }, [currentUser]);

  // Synchronize Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(prev => ({
          ...prev,
          id: fbUser.uid,
          email: fbUser.email || prev.email,
          emailVerified: fbUser.emailVerified,
          isAnonymous: fbUser.isAnonymous
        }));
      }
    });
    return () => unsubscribe();
  }, []);
  const [communities, setCommunities] = useState<CommunityItem[]>(allCommunities);
  const [chats, setChats] = useState<ChatConversation[]>(initialChats);
  const [events, setEvents] = useState<EventItem[]>(todayEvents);
  const [homePosts, setHomePosts] = useState<Post[]>(initialHomePosts);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const stored = (localStorage.getItem('lodavia_lang') as SupportedLanguage) || (localStorage.getItem('lumo_lang') as SupportedLanguage);
      if (stored && ['ar', 'en', 'fr', 'es', 'de', 'zh', 'ja'].includes(stored)) {
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
          document.documentElement.dir = stored === 'ar' ? 'rtl' : 'ltr';
        }
        return stored;
      }
      const detected = detectDeviceLanguage();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = detected;
        document.documentElement.dir = detected === 'ar' ? 'rtl' : 'ltr';
      }
      return detected;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    try {
      return (localStorage.getItem('lodavia_theme') as 'dark' | 'light' | 'system') || (localStorage.getItem('lumo_theme') as 'dark' | 'light' | 'system') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const isRtl = isRtlLanguage(lang);
  const dir = isRtl ? 'rtl' : 'ltr';

  const t = (key: string, params?: Record<string, string | number>, fallback?: string) => {
    return translate(key, lang, params, fallback);
  };

  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    return formatI18nDate(date, lang, options);
  };

  const formatTime = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    return formatI18nTime(date, lang, options);
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    return formatI18nNumber(num, lang, options);
  };

  const formatRelativeTime = (date: Date | string | number) => {
    return formatI18nRelativeTime(date, lang);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return formatI18nCurrency(amount, lang, currency);
  };

  const [activePostCommentsId, setActivePostCommentsId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [newPostText, setNewPostText] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<{ type: 'none' | 'image' | 'video'; url: string }>({ type: 'none', url: '' });

  const [activeCommunity, setActiveCommunity] = useState<CommunityItem | null>(null);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCallState | { type: 'voice' | 'video'; contactName: string; status: any; [key: string]: any } | null>(null);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestionText, setAiSuggestionText] = useState<{ ar: string; en: string } | null>(null);

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showAdPlayer, setShowAdPlayer] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adRewardClaimable, setAdRewardClaimable] = useState(false);
  const [currentAdCompany, setCurrentAdCompany] = useState('');
  const [storeMessage, setStoreMessage] = useState('');

  const ringtoneIntervalRef = useRef<any>(null);

  // Sync Lang & Theme
  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem('lodavia_lang', newLang);
      localStorage.setItem('lumo_lang', newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      }
      setCurrentUser(prev => ({
        ...prev,
        language: newLang
      }));
    } catch (e) {
      console.warn('Failed to persist language', e);
    }
  };

  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('lodavia_theme', newTheme);
    localStorage.setItem('lumo_theme', newTheme);
  };

  // Apply visual theme to document body
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Triggering the Ringtone for the Simulated Call Screen
  useEffect(() => {
    if (activeCall && activeCall.status === 'ringing') {
      playSynthSound(520, 'sine', 0.4);
      ringtoneIntervalRef.current = setInterval(() => {
        playSynthSound(520, 'sine', 0.4);
      }, 1500);
    } else {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
    }
    return () => {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
      }
    };
  }, [activeCall]);

  // Synchronize Firestore Data on Mount/Sign In (with real-time subscription fallback)
  useEffect(() => {
    if (!currentUser || currentUser.id === 'user_1') return;

    let unsubChats = () => {};
    let unsubRooms = () => {};

    const loadData = async () => {
      try {
        setIsDataLoading(true);
        const posts = await firestoreService.getPosts();
        if (posts && posts.length > 0) {
          setHomePosts(posts);
        }

        const loadedComm = await firestoreService.getCommunities();
        if (loadedComm && loadedComm.length > 0) {
          setCommunities(loadedComm);
        }

        unsubChats = firestoreService.getConversations(currentUser.id, (loadedChats) => {
          if (loadedChats && loadedChats.length > 0) {
            setChats(loadedChats);
          }
        });

        unsubRooms = firestoreService.getVoiceRooms((loadedRooms) => {
          if (loadedRooms && loadedRooms.length > 0) {
            setCommunities(prev => prev.map(c => {
              if (c.id === 'comm_prog') {
                return { ...c, activeVoiceRooms: loadedRooms };
              }
              return c;
            }));
          }
        });
        setIsDataLoading(false);
      } catch (err) {
        console.error("Firestore loading/sync fallback active:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();

    return () => {
      unsubChats();
      unsubRooms();
    };
  }, [currentUser]);

  // Ad Reward Ticker
  useEffect(() => {
    let interval: any;
    if (showAdPlayer && adCountdown > 0) {
      interval = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setAdRewardClaimable(true);
            playSynthSound(987.77, 'sine', 0.25);
            return 0;
          }
          playSynthSound(523.25, 'sine', 0.05);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAdPlayer, adCountdown]);

  // Action: Like Post
  const handleLikeHomePost = async (postId: string) => {
    playSynthSound(600, 'sine', 0.08);
    const postToLike = homePosts.find(p => p.id === postId);
    if (!postToLike) return;
    const isLiked = !!postToLike.likedByMe;
    
    setHomePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likedByMe: !isLiked,
          likes: !isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));

    try {
      await firestoreService.likePost(postId, currentUser.id, isLiked);
    } catch (err) {
      console.error("Firestore error liking post:", err);
    }
  };

  // Action: Save Post
  const handleSaveHomePost = (postId: string) => {
    playSynthSound(700, 'sine', 0.08);
    setHomePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          savedByMe: !post.savedByMe
        };
      }
      return post;
    }));
  };

  // Action: Add Comment
  const handleAddHomeComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    playSynthSound(783.99, 'sine', 0.08);

    const newComment = {
      id: `comm_ins_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: text,
      timestamp: lang === 'ar' ? 'الآن' : 'Just now'
    };

    setHomePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));

    try {
      await firestoreService.addComment(postId, newComment);
    } catch (err) {
      console.error("Firestore error adding comment:", err);
    }
  };

  // Action: Create Post
  const handleCreateHomePost = async () => {
    if (!newPostText.trim()) return;
    playSynthSound(880, 'sine', 0.12);
    setTimeout(() => playSynthSound(1320, 'sine', 0.2), 80);

    const newPost: Post = {
      id: `post_new_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTitle: lang === 'ar' ? 'مستكشف كوني' : 'Cosmic Explorer',
      content: newPostText,
      likes: 0,
      commentsCount: 0,
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      likedByMe: false,
      comments: [],
      image: newPostMedia.type === 'image' ? newPostMedia.url : undefined,
      video: newPostMedia.type === 'video' ? newPostMedia.url : undefined
    };

    setHomePosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, journeyStats: { ...(prev.journeyStats || { learning: 0, helping: 0, creating: 0, gaming: 0, community: 0 }), creating: (prev.journeyStats?.creating || 0) + 1 } }));
    setNewPostText('');
    setNewPostMedia({ type: 'none', url: '' });
    creditFirstActivity(currentUser.id);

    try {
      await firestoreService.createPost(newPost);
    } catch (err) {
      console.error("Firestore error creating post:", err);
    }
  };

  // Action: Create Submit from Dialog
  const handleCreateSubmit = async (e: React.FormEvent, selectedCreateType: string, postContent: string, newRoomTitle: string) => {
    e.preventDefault();
    playSynthSound(783.99, 'sine', 0.15);

    if (selectedCreateType === 'post') {
      if (!postContent.trim()) return;
      const newPost: Post = {
        id: `post_new_${Date.now()}`,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorTitle: lang === 'ar' ? 'مستكشف فضاء' : 'Galaxy Explorer',
        content: postContent,
        likes: 0,
        commentsCount: 0,
        timestamp: lang === 'ar' ? 'الآن' : 'Just now',
        likedByMe: false,
        comments: []
      };

      setCommunities(prev => prev.map(c => {
        if (c.id === 'comm_prog') {
          return {
            ...c,
            posts: [newPost, ...c.posts]
          };
        }
        return c;
      }));

      try {
        await firestoreService.createPost(newPost);
      } catch (err) {
        console.error("Firestore error creating post in community:", err);
      }
    } else if (selectedCreateType === 'voice') {
      if (!newRoomTitle) return;
      const newVoice: VoiceRoom = {
        id: `voice_new_${Date.now()}`,
        title: newRoomTitle,
        hostName: currentUser.name,
        hostAvatar: currentUser.avatar,
        listenersCount: 1,
        speakersCount: 1,
        tags: ['Live', 'Brainstorm']
      };

      setCommunities(prev => prev.map(c => {
        if (c.id === 'comm_prog') {
          return {
            ...c,
            activeVoiceRooms: [newVoice, ...c.activeVoiceRooms]
          };
        }
        return c;
      }));

      try {
        await firestoreService.createVoiceRoom(newVoice);
      } catch (err) {
        console.error("Firestore error creating voice room:", err);
      }
    }
    setShowCreateModal(false);
  };

  // Action: Send Chat Message
  const handleSendChat = async (chatInput: string, setChatInput: (val: string) => void) => {
    if (!chatInput || !activeChat) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: chatInput,
      type: 'text',
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversation: ChatConversation = {
      ...activeChat,
      messages: [...activeChat.messages, newMsg]
    };

    setActiveChat(updatedConversation);
    setChats(prev => prev.map(c => c.id === activeChat.id ? updatedConversation : c));
    setChatInput('');

    try {
      await firestoreService.sendMessage(activeChat.id, newMsg);
    } catch (err) {
      console.error("Firestore error sending message:", err);
    }

    // Auto simulated reply after 2 seconds
    setTimeout(() => {
      playSynthSound(659.25, 'triangle', 0.1);
      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: 'contact',
        text: lang === 'ar' ? 'رائع جداً! سأقوم بدراسة هذا الأمر فوراً والرد عليك بتفاصيل أكثر.' : 'Incredible! I will review this immediately and get back to you with more context.',
        type: 'text',
        timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const replyConversation: ChatConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, replyMsg]
      };

      setActiveChat(replyConversation);
      setChats(prev => prev.map(c => c.id === activeChat.id ? replyConversation : c));

      firestoreService.sendMessage(activeChat.id, replyMsg).catch(err => {
        console.error("Firestore error saving simulated reply:", err);
      });
    }, 2000);
  };

  // Ad Reward Trigger
  const startWatchingAd = () => {
    playSynthSound(440, 'triangle', 0.15);
    const adCompaniesAr = [
      'محرك Lodavia الفائق للذكاء الاصطناعي 🤖',
      'غرف Lodavia الصوتية ثلاثية الأبعاد 🎧',
      'سحابة Lodavia للحوسبة الكمومية 🌌',
      'مسارات Lodavia لتعلم ريأكت وتطوير البرمجيات 📚'
    ];
    const adCompaniesEn = [
      'Lodavia Core AI Neural Engine 🤖',
      'Lodavia 3D Spatial Sound Spaces 🎧',
      'Lodavia Quantum Ledger Database 🌌',
      'Lodavia Professional Full Stack Path 📚'
    ];
    
    const index = Math.floor(Math.random() * adCompaniesAr.length);
    setCurrentAdCompany(lang === 'ar' ? adCompaniesAr[index] : adCompaniesEn[index]);
    
    setStoreMessage('');
    setAdCountdown(5);
    setAdRewardClaimable(false);
    setShowAdPlayer(true);
  };

  const claimAdReward = () => {
    if (!adRewardClaimable) return;
    playSynthSound(880, 'sine', 0.1);
    setTimeout(() => playSynthSound(1046.5, 'sine', 0.1), 80);
    setTimeout(() => playSynthSound(1318.51, 'sine', 0.3), 160);

    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + 50
    }));
    
    setShowAdPlayer(false);
    setStoreMessage(lang === 'ar' ? 'تمت إضافة +50 نقطة إلى محفظتك بنجاح! 🎉' : '+50 Lodavia Points added successfully! 🎉');
  };

  const handlePurchaseItem = (item: any) => {
    if (currentUser.purchasedItems.includes(item.id)) {
      playSynthSound(300, 'triangle', 0.2);
      setStoreMessage(lang === 'ar' ? 'لقد اشتريت هذا العنصر بالفعل!' : 'You already own this item!');
      return;
    }
    if (currentUser.points < item.price) {
      playSynthSound(150, 'sawtooth', 0.3);
      setStoreMessage(lang === 'ar' ? 'عذراً! لا تملك نقاطاً كافية لهذه المشتريات.' : 'Sorry! Insufficient points for this purchase.');
      return;
    }

    playSynthSound(880, 'sine', 0.1);
    setTimeout(() => playSynthSound(1320, 'sine', 0.25), 100);
    
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points - item.price,
      purchasedItems: [...prev.purchasedItems, item.id]
    }));
    setStoreMessage(lang === 'ar' ? `تهانينا! تم شراء "${item.nameAr}" بنجاح 🥳` : `Congrats! Successfully unlocked "${item.nameEn}" 🥳`);
  };

  // Cosmic Packs Implementation Methods
  const handleBuyAndOpenCosmicPack = async (packId: string) => {
    // Check network status
    if (!navigator.onLine) {
      alert(lang === 'ar' ? '📡 شراء وحزم لودافيا يتطلب اتصالاً إنترنت صالحة لضمان أمان العمليات!' : '📡 Purchasing cosmic packs requires an active internet connection for security!');
      return { success: false, rewardItem: null, isDuplicate: false, shardsAwarded: 0 };
    }

    try {
      const res = await fetch('/api/packs/buy-and-open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.messageAr || (lang === 'ar' ? 'فشلت عملية الشراء' : 'Purchase failed'));
        return { success: false, rewardItem: null, isDuplicate: false, shardsAwarded: 0 };
      }

      // Update state authoritatively from server response
      setCurrentUser(prev => ({
        ...prev,
        points: data.newPoints,
        shards: data.newShards,
        inventory: data.newInventory,
        newCosmetics: data.isDuplicate ? (prev.newCosmetics || []) : [...(prev.newCosmetics || []), data.rewardItem.id]
      }));

      return {
        success: true,
        rewardItem: data.rewardItem,
        isDuplicate: data.isDuplicate,
        shardsAwarded: data.shardsAwarded
      };
    } catch (err: any) {
      console.error('Error buying pack:', err);
      alert(lang === 'ar' ? 'حدث خطأ أثناء معالجة الشراء من السيرفر' : 'Server error processing transaction');
      return { success: false, rewardItem: null, isDuplicate: false, shardsAwarded: 0 };
    }
  };

  const handleEquipCosmetic = (type: string, item: any) => {
    setCurrentUser(prev => {
      const currentEquipped = prev.equippedCosmetics || {};
      const updatedEquipped = { ...currentEquipped };

      if (type === 'AVATAR_FRAME') updatedEquipped.frame = item.id;
      else if (type === 'PROFILE_BACKGROUND') updatedEquipped.background = item.id;
      else if (type === 'NAME_EFFECT') updatedEquipped.nameEffect = item.id;
      else if (type === 'TITLE') updatedEquipped.title = item.id;
      else if (type === 'BADGE' || type === 'CREATOR_BADGE') updatedEquipped.badge = item.id;
      else if (type === 'CHARACTER_SKIN') updatedEquipped.characterSkin = item.mascotSkin;

      return {
        ...prev,
        equippedCosmetics: updatedEquipped
      };
    });
  };

  const handleUnequipCosmetic = (type: string) => {
    setCurrentUser(prev => {
      const currentEquipped = { ...(prev.equippedCosmetics || {}) };
      if (type === 'AVATAR_FRAME') delete currentEquipped.frame;
      else if (type === 'PROFILE_BACKGROUND') delete currentEquipped.background;
      else if (type === 'NAME_EFFECT') delete currentEquipped.nameEffect;
      else if (type === 'TITLE') delete currentEquipped.title;
      else if (type === 'BADGE' || type === 'CREATOR_BADGE') delete currentEquipped.badge;
      else if (type === 'CHARACTER_SKIN') delete currentEquipped.characterSkin;

      return {
        ...prev,
        equippedCosmetics: currentEquipped
      };
    });
  };

  const handleToggleFavoriteCosmetic = (itemId: string) => {
    setCurrentUser(prev => {
      const currentFavs = prev.favoriteCosmetics || [];
      const isFav = currentFavs.includes(itemId);
      return {
        ...prev,
        favoriteCosmetics: isFav ? currentFavs.filter(id => id !== itemId) : [...currentFavs, itemId]
      };
    });
  };

  const handleMarkCosmeticSeen = (itemId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      newCosmetics: (prev.newCosmetics || []).filter(id => id !== itemId)
    }));
  };

  const handleClaimDailyCosmicReward = () => {
    const bonusPoints = 200;
    const bonusShards = 50;

    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + bonusPoints,
      shards: (prev.shards || 0) + bonusShards,
      lastDailyRewardClaim: new Date().toISOString()
    }));

    alert(lang === 'ar' 
      ? `🎉 تم مطالبة المكافأة اليومية بنجاح!\n+${bonusPoints} نقطة لودافيا 🪙\n+${bonusShards} شظية كونية 💎` 
      : `🎉 Daily Cosmic Reward claimed!\n+${bonusPoints} Lodavia Points 🪙\n+${bonusShards} Cosmic Shards 💎`);
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      communities, setCommunities,
      chats, setChats,
      events, setEvents,
      homePosts, setHomePosts,
      isDataLoading,
      lang, setLang,
      t,
      isRtl,
      dir,
      supportedLanguages: SUPPORTED_LANGUAGES,
      formatDate,
      formatTime,
      formatNumber,
      formatRelativeTime,
      formatCurrency,
      theme, setTheme,
      activePostCommentsId, setActivePostCommentsId,
      commentInputs, setCommentInputs,
      newPostText, setNewPostText,
      newPostMedia, setNewPostMedia,
      activeCommunity, setActiveCommunity,
      activeChat, setActiveChat,
      showCreateModal, setShowCreateModal,
      activeCall, setActiveCall,
      aiGenerating, setAiGenerating,
      aiSuggestionText, setAiSuggestionText,
      showStoreModal, setShowStoreModal,
      showAdPlayer, setShowAdPlayer,
      adCountdown, setAdCountdown,
      adRewardClaimable, setAdRewardClaimable,
      currentAdCompany, setCurrentAdCompany,
      storeMessage, setStoreMessage,
      playSynthSound,
      handleLikeHomePost,
      handleSaveHomePost,
      handleAddHomeComment,
      handleCreateHomePost,
      handleCreateSubmit,
      handleSendChat,
      startWatchingAd,
      claimAdReward,
      handlePurchaseItem,
      handleBuyAndOpenCosmicPack,
      handleEquipCosmetic,
      handleUnequipCosmetic,
      handleToggleFavoriteCosmetic,
      handleMarkCosmeticSeen,
      handleClaimDailyCosmicReward
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppContextProvider');
  }
  return context;
}
