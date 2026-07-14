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
  ChatMessage 
} from '../types';
import { 
  initialUser, 
  allCommunities, 
  initialChats, 
  todayEvents, 
  initialHomePosts 
} from '../data';
import { authService, firestoreService, storageService } from '../firebase/services';
import { playSynthSound } from '../utils/synth';

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
  
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
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
  activeCall: { type: 'voice' | 'video'; contactName: string; status: 'ringing' | 'connected' } | null;
  setActiveCall: (call: { type: 'voice' | 'video'; contactName: string; status: 'ringing' | 'connected' } | null) => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    const saved = localStorage.getItem('lodavia_current_user') || localStorage.getItem('lumo_current_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  // Sync currentUser to localStorage
  useEffect(() => {
    localStorage.setItem('lodavia_current_user', JSON.stringify(currentUser));
  }, [currentUser]);
  const [communities, setCommunities] = useState<CommunityItem[]>(allCommunities);
  const [chats, setChats] = useState<ChatConversation[]>(initialChats);
  const [events, setEvents] = useState<EventItem[]>(todayEvents);
  const [homePosts, setHomePosts] = useState<Post[]>(initialHomePosts);

  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('lodavia_lang') as 'ar' | 'en') || (localStorage.getItem('lumo_lang') as 'ar' | 'en') || 'ar';
  });
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('lodavia_theme') as 'dark' | 'light' | 'system') || (localStorage.getItem('lumo_theme') as 'dark' | 'light' | 'system') || 'dark';
  });

  const [activePostCommentsId, setActivePostCommentsId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [newPostText, setNewPostText] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<{ type: 'none' | 'image' | 'video'; url: string }>({ type: 'none', url: '' });

  const [activeCommunity, setActiveCommunity] = useState<CommunityItem | null>(null);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video'; contactName: string; status: 'ringing' | 'connected' } | null>(null);

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
  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    localStorage.setItem('lodavia_lang', newLang);
    localStorage.setItem('lumo_lang', newLang);
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
      } catch (err) {
        console.error("Firestore loading/sync fallback active:", err);
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
    setNewPostText('');
    setNewPostMedia({ type: 'none', url: '' });

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

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      communities, setCommunities,
      chats, setChats,
      events, setEvents,
      homePosts, setHomePosts,
      lang, setLang,
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
      handlePurchaseItem
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
