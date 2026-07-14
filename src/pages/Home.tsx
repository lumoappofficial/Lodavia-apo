import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import FeedPostCard from '../components/FeedPost';
import { 
  Sparkles, 
  Brain, 
  Users, 
  Mic, 
  Video, 
  Tv, 
  Calendar, 
  Gamepad2, 
  MessageSquare, 
  Phone, 
  Info,
  Heart,
  Bookmark,
  Share2,
  AlertTriangle,
  Send,
  Image as ImageIcon,
  Flame,
  TrendingUp,
  Compass,
  Plus,
  Play,
  Pause,
  Check,
  Award,
  Vote,
  Loader2,
  Smile,
  X,
  Flag,
  Newspaper
} from 'lucide-react';
import { FeedPostType as FeedPost } from '../types';
import { EmptyState } from '../components/FeedbackStates';

export default function Home() {
  const {
    currentUser,
    setCurrentUser,
    communities,
    setCommunities,
    chats,
    setChats,
    events,
    setEvents,
    lang,
    playSynthSound,
    setActiveChat,
    aiGenerating,
    setAiGenerating,
    aiSuggestionText,
    setAiSuggestionText,
    setActiveCommunity,
    setShowStoreModal
  } = useApp();

  const navigate = useNavigate();

  // Primary navigation tab
  const [homeTab, setHomeTab] = useState<'explore' | 'feed'>('feed');

  // Games states
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState('');

  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<string | null>(null);
  const [coinResultMsg, setCoinResultMsg] = useState('');

  // Feed States
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'suggested' | 'polls' | 'ai'>('all');
  const [newPostText, setNewPostText] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'image' | 'poll'>('text');
  
  // Custom creator helpers
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostPollQuestion, setNewPostPollQuestion] = useState('');
  const [newPostPollOptions, setNewPostPollOptions] = useState<string[]>(['', '']);

  // Feed database state
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'post-1',
      authorName: 'Lodavia AI Guide 🪐',
      authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      authorBadge: 'Cosmic Core AI',
      time: '3m ago',
      content: lang === 'ar' 
        ? 'تم إطلاق المعالج العصبي Lodavia-3.5-Flash! نقوم الآن بمحاكاة واجهات الكوانتوم التفاعلية لجميع المستكشفين. كيف تصف تجربتك اليوم؟ 🚀💡'
        : 'Lodavia-3.5-Flash neural processor is active! We are now synthesizing quantum interface models for all explorers. How would you describe your synergy today? 🚀💡',
      type: 'ai',
      likesCount: 142,
      commentsCount: 38,
      category: 'ai'
    },
    {
      id: 'post-2',
      authorName: 'Sarah Al-Mohandes',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      authorBadge: 'Lead Architect',
      time: '12m ago',
      content: lang === 'ar'
        ? 'بث تجريبي لمشروع محاكي جاذبية الثقوب السوداء ثلاثي الأبعاد المطور بـ React Three Fiber! شاهدوا مسار الفوتونات اللانهائي 🛰️💫'
        : 'Beta test stream of my interactive 3D Black Hole Gravity simulator crafted with React Three Fiber! Behold the infinite photon curvature 🛰️💫',
      type: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-40611-large.mp4',
      videoPlaying: false,
      likesCount: 328,
      commentsCount: 45,
      category: 'trending'
    },
    {
      id: 'post-3',
      authorName: 'Khaled Developer',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      authorBadge: 'Quantum Pilot',
      time: '1h ago',
      content: lang === 'ar'
        ? 'استفتاء المعرفة الكونية: ما هي لغتك المفضلة لكتابة عقود سلاسل الكتل اللامركزية وتطبيقات الفضاء؟ 🦀💻'
        : 'Cosmic pilot survey: What is your preferred paradigm for building high-concurrency space decentralized contracts? 🦀💻',
      type: 'poll',
      poll: {
        question: lang === 'ar' ? 'لغة التطوير المفضلة' : 'Preferred Language',
        options: [
          { id: 'opt-1', text: 'Rust (Robust Safety) 🦀', votes: 154 },
          { id: 'opt-2', text: 'TypeScript (Dynamic Web) ⚡', votes: 112 },
          { id: 'opt-3', text: 'Solidity (EVM Node) 🪙', votes: 84 }
        ],
        totalVotes: 350
      },
      likesCount: 89,
      commentsCount: 92,
      category: 'polls'
    },
    {
      id: 'post-4',
      authorName: 'Astro Lens Art',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorBadge: 'Celestial Artist',
      time: '4h ago',
      content: lang === 'ar'
        ? 'توهج سديم الجبار كما التقطه مرصد هابل الليلة. فخامة الألوان الكونية اللانهائية تلهم صانعي الفن الرقمي 🌌✨'
        : 'The Orion Nebula captured beautifully by Hubble telescope parameters tonight. Infinite spectrums inspiring pure stardust digital creations 🌌✨',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      likesCount: 512,
      commentsCount: 67,
      category: 'suggested'
    }
  ]);

  // Loading state for Infinite Scroll Simulation
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  // Modals for Share / Report
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);

  // References for observer / scroll detection
  const loaderRef = useRef<HTMLDivElement>(null);

  // Quick interactive Game quiz logic
  const handleQuizAnswer = (answer: string) => {
    setQuizAnswered(true);
    if (answer === 'c') {
      setQuizScore(prev => prev + 10);
      setQuizFeedback(lang === 'ar' ? 'صحيح! الإجابة هي تجميع لغوي للضوء والتواصل الذكي 💡' : 'Correct! Lodavia represents light and dynamic connections 💡');
      playSynthSound(900, 'sine', 0.25);
    } else {
      setQuizFeedback(lang === 'ar' ? 'إجابة خاطئة، حاول مرة أخرى لمعرفة فلسفة الاسم.' : 'Wrong answer! Try again to discover the name origin.');
      playSynthSound(200, 'sawtooth', 0.2);
    }
  };

  // Simulate call
  const handleSimulateCall = (type: 'voice' | 'video', contactName: string) => {
    playSynthSound(520, 'sine', 0.25);
    alert(lang === 'ar' 
      ? `جاري فتح خط اتصال ${type === 'voice' ? 'صوتي' : 'مرئي'} فائق الدقة مع ${contactName}...` 
      : `Initiating high-fidelity ${type} link with ${contactName}...`
    );
  };

  // Create Custom Post Handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && newPostType === 'text') return;

    playSynthSound(800, 'sine', 0.15);
    setTimeout(() => playSynthSound(1000, 'sine', 0.1), 80);

    const createdPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBadge: lang === 'ar' ? 'مكتشف كوني' : 'Cosmic Explorer',
      time: 'Just now',
      content: newPostText,
      type: newPostType === 'poll' ? 'poll' : newPostType === 'image' ? 'image' : 'text',
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      category: 'general',
      imageUrl: newPostType === 'image' && newPostImage ? newPostImage : undefined,
      poll: newPostType === 'poll' && newPostPollQuestion ? {
        question: newPostPollQuestion,
        options: newPostPollOptions.filter(o => o.trim() !== '').map((o, idx) => ({
          id: `opt-${idx}-${Date.now()}`,
          text: o,
          votes: 0
        })),
        totalVotes: 0
      } : undefined
    };

    setFeedPosts(prev => [createdPost, ...prev]);
    
    // Reset fields
    setNewPostText('');
    setNewPostImage('');
    setNewPostPollQuestion('');
    setNewPostPollOptions(['', '']);
    setNewPostType('text');
  };

  // Like Toggle
  const handleLikePost = (postId: string) => {
    playSynthSound(650, 'sine', 0.08);
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.isLiked;
        return {
          ...post,
          isLiked: liked,
          likesCount: liked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    }));
  };

  // Save Toggle
  const handleSavePost = (postId: string) => {
    playSynthSound(750, 'sine', 0.1);
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const saved = !post.isSaved;
        return {
          ...post,
          isSaved: saved
        };
      }
      return post;
    }));
  };

  // Vote handler
  const handleVotePoll = (postId: string, optionId: string) => {
    playSynthSound(900, 'sine', 0.1);
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId && post.poll && !post.poll.votedOptionId) {
        return {
          ...post,
          poll: {
            ...post.poll,
            votedOptionId: optionId,
            totalVotes: post.poll.totalVotes + 1,
            options: post.poll.options.map(opt => {
              if (opt.id === optionId) {
                return { ...opt, votes: opt.votes + 1 };
              }
              return opt;
            })
          }
        };
      }
      return post;
    }));
  };

  // Toggle Video Playing State
  const handleToggleVideo = (postId: string) => {
    playSynthSound(500, 'sine', 0.05);
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, videoPlaying: !post.videoPlaying };
      }
      return post;
    }));
  };

  // Share Simulation
  const handleSharePost = (postId: string) => {
    playSynthSound(950, 'sine', 0.1);
    const link = `${window.location.origin}/post/${postId}`;
    setShareLink(link);
    setShowShareSuccess(true);
    navigator.clipboard.writeText(link).catch(() => {});
    setTimeout(() => {
      setShowShareSuccess(false);
    }, 2500);
  };

  // Report submission
  const handleReportSubmit = (reason: string) => {
    if (!reportedPostId) return;
    playSynthSound(200, 'sawtooth', 0.25);
    setFeedPosts(prev => prev.map(post => {
      if (post.id === reportedPostId) {
        return { ...post, isReported: true };
      }
      return post;
    }));
    setShowReportModal(false);
    setReportedPostId(null);
    alert(lang === 'ar' ? 'شكراً لتعاونك. لقد تلقينا بلاغك وسيقوم فريق المشرفين بمراجعته.' : 'Report submitted successfully. Our moderator team will audit this post.');
  };

  // Infinite Scroll Simulation (adds mock content)
  const loadMorePosts = () => {
    if (loadingMore || reachedEnd) return;
    setLoadingMore(true);
    playSynthSound(400, 'sine', 0.12);

    setTimeout(() => {
      const additionalPosts: FeedPost[] = [
        {
          id: `post-scrolled-1-${Date.now()}`,
          authorName: 'Cosmic Explorer Hub',
          authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
          time: '1h ago',
          content: lang === 'ar'
            ? 'بشرفنا أن نعلن عن الفعالية التقنية المفتوحة في المدار الكوني المباشر لمطوري الذكاء الاصطناعي الأسبوع القادم! 🛸🤖'
            : 'Proud to host our open-space orbital Live coding session on AI developer environments next Sunday! 🛸🤖',
          type: 'text',
          likesCount: 45,
          commentsCount: 12,
          category: 'suggested'
        },
        {
          id: `post-scrolled-2-${Date.now()}`,
          authorName: 'Lodavia Space Craft',
          authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
          time: '3h ago',
          content: lang === 'ar'
            ? 'سؤال سريع للمطورين: هل تفضلون واجهات الـ Glassmorphism أم النيون المطلق في مشاريعكم القادمة؟ تفضلوا بالتصويت 📐🔥'
            : 'Folk, check out this: Do you prefer clean glassmorphism gradients or full-neon flat vector interfaces for next-generation apps? Vote!',
          type: 'poll',
          poll: {
            question: lang === 'ar' ? 'نمط التصميم المفضل' : 'UI Style Match',
            options: [
              { id: 'sc-opt-1', text: lang === 'ar' ? 'الزجاجي اللامع (Glassmorphism) ✨' : 'Glassmorphism ✨', votes: 198 },
              { id: 'sc-opt-2', text: lang === 'ar' ? 'النيون المتوهج (Neon Glow) 🚨' : 'Neon Glow 🚨', votes: 142 }
            ],
            totalVotes: 340
          },
          likesCount: 88,
          commentsCount: 44,
          category: 'polls'
        }
      ];

      setFeedPosts(prev => [...prev, ...additionalPosts]);
      setLoadingMore(false);
      setReachedEnd(true); // Stop simulating after first scroll load for a responsive, fast user experience
    }, 1500);
  };

  // Intersection Observer for scroll detection
  useEffect(() => {
    if (homeTab !== 'feed') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    }, { threshold: 0.8 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [homeTab, loadingMore, reachedEnd]);

  // Filter posts
  const filteredPosts = feedPosts.filter(post => {
    if (post.isReported) return false;
    if (feedFilter === 'all') return true;
    return post.category === feedFilter || post.type === feedFilter;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 animate-[fadeIn_0.4s_ease-out]">
      
      {/* 1. WELCOME HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/20 via-[#07070a]/80 to-cyan-950/20 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative z-10">
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-400/20" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full uppercase">
                {lang === 'ar' ? 'رائد فضاء لودافيا 💫' : 'Lodavia Astronaut 💫'}
              </span>
              <span className="text-[9px] bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full font-black">
                {currentUser.points} 💎
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">
              {lang === 'ar' ? `أهلاً بك، ${currentUser.name} 👋` : `Welcome back, ${currentUser.name} 👋`}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
              {lang === 'ar' ? 'مرحباً بك في لودافيا، المساحة الاجتماعية الفائقة للتواصل والتعلم مع الذكاء الاصطناعي وبث الصوت الحي.' : 'Your cosmic expedition starts here. Join real-time audio rooms, explore dynamic feeds, or test your skills.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 relative z-10 w-full md:w-auto shrink-0">
          <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">{lang === 'ar' ? 'المتابعون' : 'Followers'}</span>
            <span className="text-lg font-black text-white mt-0.5 block">{currentUser.followersCount.toLocaleString()}</span>
          </div>
          <div className="flex-1 md:flex-initial p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">{lang === 'ar' ? 'النقاط' : 'Lodavia Points'}</span>
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mt-0.5 block">
              {currentUser.points}
            </span>
          </div>
        </div>
      </div>

      {/* Lodavia AI Reply Assistant Premium Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600/10 via-purple-600/15 to-purple-500/10 border border-cyan-500/30 p-5 md:p-6 shadow-xl relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="relative w-14 h-14 rounded-2xl bg-[#0B0B16] p-1 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/10 shrink-0">
            <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs md:text-sm font-black text-white block">
                {lang === 'ar' ? 'مساعد الرد الذكي من لودافيا 🤖🪄' : 'Lodavia AI Reply Assistant 🤖🪄'}
              </span>
              {currentUser.purchasedItems.includes('lodavia_pro') ? (
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                  {lang === 'ar' ? 'نشط برو ✨' : 'Active Pro ✨'}
                </span>
              ) : (
                <span className="text-[9px] bg-amber-500/15 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
                  {lang === 'ar' ? 'ميزة الاشتراك 👑' : 'Subscription Pro 👑'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 max-w-xl leading-relaxed">
              {lang === 'ar' 
                ? 'استورد تعليقات شبكاتك، حلل نية الجمهور، ووفر ردوداً مذهلة بلهجات محلية وبنبرات مخصصة لعلامتك التجارية بالذكاء الاصطناعي.' 
                : 'Import social comments, analyze audience intent, and auto-generate local Arabic responses in custom brand voices.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0 relative z-10">
          {!currentUser.purchasedItems.includes('lodavia_pro') && (
            <button
              onClick={() => {
                playSynthSound(750, 'sine', 0.1);
                setShowStoreModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-extrabold text-[11px] transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{lang === 'ar' ? 'ترقية الاشتراك 👑' : 'Upgrade Subscription 👑'}</span>
            </button>
          )}
          
          <button
            onClick={() => {
              playSynthSound(800, 'sine', 0.1);
              navigate('/ai-reply-assistant');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-[11px] transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فتح المساعد الذكي 🪄' : 'Open Assistant 🪄'}</span>
          </button>
        </div>
      </div>

      {/* Lodavia AI Daily Flagship Feature Premium Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/30 via-cyan-950/20 to-purple-950/30 border border-cyan-500/20 p-5 md:p-6 shadow-xl relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="relative w-14 h-14 rounded-2xl bg-[#0B0B16] p-1 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/10 shrink-0">
            <Newspaper className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-bounce" />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs md:text-sm font-black text-white block">
                {lang === 'ar' ? 'ملخص لودافيا اليومي الذكي 🌍✨' : 'Lodavia AI Daily Brief 🌍✨'}
              </span>
              <span className="text-[9px] bg-cyan-500/15 text-cyan-400 font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-wider">
                {lang === 'ar' ? 'جديد • FLAGSHIP' : 'NEW • FLAGSHIP'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 max-w-xl leading-relaxed">
              {lang === 'ar' 
                ? 'صباح الخير! نشرة شخصية ذكية لتقرأها وتستمع إليها في دقيقة واحدة. لودافيا تجمع لك الخبر من المصادر الموثوقة وتبسطه كأعز الأصدقاء.' 
                : '"Good morning!" Live trusted daily briefings tailored to your interests in less than a minute. Ask Lodavia questions and listen to voice podcasts.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0 relative z-10">
          <button
            onClick={() => {
              playSynthSound(900, 'sine', 0.1);
              navigate('/ai-daily');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Brain className="w-4 h-4 text-white" />
            <span>{lang === 'ar' ? 'تصفح ملخصك الكوني 🌌' : 'Explore Your Briefing 🌌'}</span>
          </button>
        </div>
      </div>

      {/* 2. TAB TOGGLER (Explore Hub vs Cosmic Feed) */}
      <div className="flex p-1.5 rounded-2xl bg-black/40 border border-white/5 relative z-10 max-w-md w-full">
        <button
          onClick={() => {
            setHomeTab('feed');
            playSynthSound(600, 'sine', 0.08);
          }}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            homeTab === 'feed'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
          <span>{lang === 'ar' ? 'الخلاصة الكونية 📡' : 'Cosmic Feed 📡'}</span>
        </button>
        <button
          onClick={() => {
            setHomeTab('explore');
            playSynthSound(600, 'sine', 0.08);
          }}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            homeTab === 'explore'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'ar' ? 'لوحة الاستكشاف 🪐' : 'Explore Hub 🪐'}</span>
        </button>
      </div>

      {/* ========================================== */}
      {/*              COSMIC FEED TAB               */}
      {/* ========================================== */}
      {homeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 animate-[fadeIn_0.3s_ease-out]">
          
          {/* Main Feed Content Column (2 Span) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            {/* Post Creator Panel */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={lang === 'ar' ? 'ما هي شرارة الإبداع التي تود إطلاقها فلكياً اليوم؟ ✨🚀' : 'What stardust creative idea are you launching today? ✨🚀'}
                    className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 text-xs focus:ring-0 focus:outline-none min-h-[60px] resize-none"
                  />
                  
                  {/* Image input url */}
                  {newPostType === 'image' && (
                    <div className="mt-2 p-3 bg-black/30 border border-white/5 rounded-2xl flex flex-col gap-2">
                      <span className="text-[9px] font-black uppercase text-cyan-400">Attach Cosmic Photo URL</span>
                      <input
                        type="url"
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="glass-input w-full p-2 text-xs"
                      />
                    </div>
                  )}

                  {/* Poll Creation inputs */}
                  {newPostType === 'poll' && (
                    <div className="mt-2 p-3 bg-black/30 border border-white/5 rounded-2xl flex flex-col gap-2">
                      <span className="text-[9px] font-black uppercase text-purple-400">Construct Spatial Poll</span>
                      <input
                        type="text"
                        value={newPostPollQuestion}
                        onChange={(e) => setNewPostPollQuestion(e.target.value)}
                        placeholder={lang === 'ar' ? 'سؤال الاستفتاء الكوني...' : 'Universe survey question...'}
                        className="glass-input w-full p-2 text-xs mb-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newPostPollOptions[0]}
                          onChange={(e) => {
                            const opt = [...newPostPollOptions];
                            opt[0] = e.target.value;
                            setNewPostPollOptions(opt);
                          }}
                          placeholder="Option 1"
                          className="glass-input p-2 text-xs"
                        />
                        <input
                          type="text"
                          value={newPostPollOptions[1]}
                          onChange={(e) => {
                            const opt = [...newPostPollOptions];
                            opt[1] = e.target.value;
                            setNewPostPollOptions(opt);
                          }}
                          placeholder="Option 2"
                          className="glass-input p-2 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator Controls */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setNewPostType(newPostType === 'image' ? 'text' : 'image');
                    }}
                    className={`p-2 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      newPostType === 'image'
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'صورة' : 'Image'}</span>
                  </button>
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setNewPostType(newPostType === 'poll' ? 'text' : 'poll');
                    }}
                    className={`p-2 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      newPostType === 'poll'
                        ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'استفتاء' : 'Poll'}</span>
                  </button>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim() && !newPostPollQuestion}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إطلاق كوني 📡' : 'Cosmic Post 📡'}</span>
                </button>
              </div>
            </div>

            {/* Feed Filtering Row */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', labelAr: '🚀 الكل', labelEn: '🚀 All Streams' },
                { id: 'trending', labelAr: '🔥 الرائج', labelEn: '🔥 Trending' },
                { id: 'suggested', labelAr: '✨ المقترح', labelEn: '✨ Suggested' },
                { id: 'polls', labelAr: '📊 الاستفتاءات', labelEn: '📊 Polls' },
                { id: 'ai', labelAr: '🤖 الذكاء الاصطناعي', labelEn: '🤖 Lodavia AI' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setFeedFilter(f.id as any);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap border transition-all cursor-pointer ${
                    feedFilter === f.id
                      ? 'bg-white/10 border-white/20 text-white font-black'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  {lang === 'ar' ? f.labelAr : f.labelEn}
                </button>
              ))}
            </div>

            {/* Post Lists rendering with complete design matching glassmorphism */}
            <div className="flex flex-col gap-4">
              {filteredPosts.length === 0 ? (
                <EmptyState 
                  title={lang === 'ar' ? 'لا توجد مشاركات كوزمية' : 'No Cosmic Posts'}
                  description={lang === 'ar' ? 'المدار الفلكي المحدد فارغ حالياً. جرب تصفية تيار آخر أو أرسل بثاً جديداً!' : 'The selected stellar stream has no signals. Try another filter or share your own!'}
                />
              ) : (
                filteredPosts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    lang={lang}
                    onLike={handleLikePost}
                    onSave={handleSavePost}
                    onShare={handleSharePost}
                    onReport={(id) => {
                      setReportedPostId(id);
                      setShowReportModal(true);
                    }}
                    onVote={handleVotePoll}
                    onToggleVideo={handleToggleVideo}
                    playSynthSound={playSynthSound}
                  />
                ))
              )}
            </div>

            {/* Infinite Scroll Load Trigger */}
            <div ref={loaderRef} className="py-6 flex justify-center items-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>{lang === 'ar' ? 'جاري شحن منشورات فلكية إضافية...' : 'Channeling additional cosmic posts...'}</span>
                </div>
              )}
              {reachedEnd && (
                <div className="text-[10px] font-black uppercase text-slate-600 tracking-widest text-center py-2">
                  🪐 {lang === 'ar' ? 'وصلت إلى أفق الحدث النهائي للمنشورات' : 'You have reached the final cosmic horizon'}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Widgets Column (1 Span) */}
          <div className="flex flex-col gap-5">
            
            {/* AI Assistant Insight widget */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0c14] via-slate-900/60 to-purple-950/20 border border-purple-500/20 p-5 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 text-slate-950 shadow-md shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin-slow text-white" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{lang === 'ar' ? 'التحليل العصبي للمحيط' : 'Neural Stream Analysis'}</span>
                    <h3 className="text-xs font-black text-slate-200 mt-0.5">{lang === 'ar' ? 'رؤية لومو الذكية اليومية' : 'Stellar Advisory Today'}</h3>
                  </div>
                </div>

                {aiGenerating ? (
                  <div className="flex flex-col gap-1.5 animate-pulse">
                    <div className="h-3 w-full bg-white/10 rounded" />
                    <div className="h-3 w-4/5 bg-white/5 rounded" />
                  </div>
                ) : aiSuggestionText ? (
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5">
                    {lang === 'ar' ? aiSuggestionText.ar : aiSuggestionText.en}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5">
                    {lang === 'ar' 
                      ? 'أنت تتفاعل بشكل ممتاز هذا الصباح! انقر على "توليد اقتراح مخصص" لتوجيه دفة المعالجة العصبية الكوانتوم!' 
                      : 'High orbital coherence detected. Run the AI suggestion tool to generate your cosmic recommend nodes!'}
                  </p>
                )}

                <button
                  onClick={() => {
                    if (aiGenerating) return;
                    playSynthSound(440, 'triangle', 0.1);
                    setAiGenerating(true);
                    
                    const suggestions = [
                      {
                        ar: 'معدل التفاعل على المسرح الصوتي ارتفع 40%. غرد بمنشور جديد كبث إشعاع ترحيبي!',
                        en: 'Voice room engagement rose 40%. Share a stardust post as a warm beacon update!'
                      },
                      {
                        ar: 'مباراة كوانتوم بليتز شطرنج ستبدأ في مجتمع الألعاب قريباً! جهز طاقتك للمنافسة.',
                        en: 'Quantum chess match starts soon inside the Gaming circle! Energize your nodes.'
                      }
                    ];

                    setTimeout(() => {
                      setAiSuggestionText(suggestions[Math.floor(Math.random() * suggestions.length)]);
                      setAiGenerating(false);
                      playSynthSound(1046.5, 'sine', 0.25);
                    }, 1200);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تحديث الرؤية الذكية 🔄' : 'Refining Wisdom 🔄'}</span>
                </button>
              </div>
            </div>

            {/* Trending Tags Widget */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{lang === 'ar' ? 'العناوين الساخنة الرائجة' : 'Hot Cosmic Spheres'}</span>
              </h4>

              <div className="flex flex-col gap-2">
                {[
                  { tag: 'React19Compiler', count: '12.4K beams', category: 'Coding' },
                  { tag: 'QuantumQuantum', count: '9.2K beams', category: 'Physics' },
                  { tag: 'AntigravityDesign', count: '7.8K beams', category: 'Art' },
                  { tag: 'AIPromptsLodavia', count: '6.4K beams', category: 'AI Guide' }
                ].map((t) => (
                  <button
                    key={t.tag}
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.05);
                      setNewPostText(prev => `#${t.tag} ` + prev);
                      alert(lang === 'ar' ? `تم نسخ الوسم #${t.tag} لصندوق الكتابة` : `Appended #${t.tag} to editor`);
                    }}
                    className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 text-start transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-black text-slate-200 block">#{t.tag}</span>
                      <span className="text-[9px] text-slate-500 block">{t.count}</span>
                    </div>
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Workspace notifications summary */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'أصدقاء متصلون بالخدمة' : 'Online Explorers'}</span>
              </h4>
              <div className="flex flex-col gap-2.5">
                {chats.slice(0, 3).map(pilot => (
                  <div key={pilot.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={pilot.contactAvatar} alt={pilot.contactName} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-bold text-white block">{pilot.contactName}</span>
                        <span className="text-[8px] text-emerald-400 flex items-center gap-0.5">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                          <span>Active Stage</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSimulateCall('voice', pilot.contactName)}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/*              EXPLORE HUB TAB               */}
      {/* ========================================== */}
      {homeTab === 'explore' && (
        <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease-out]">
          
          {/* LUI SMART SUGGESTIONS */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'اقتراحات الذكاء الاصطناعي 🤖' : 'Lodavia AI Recommendations 🤖'}
                </h2>
              </div>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Powered by Lodavia Core</span>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0c14] via-slate-900/60 to-purple-950/20 border border-purple-500/20 p-5 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 text-slate-950 shadow-md">
                    <Sparkles className="w-5 h-5 animate-spin-slow text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{lang === 'ar' ? 'تحليل ذكي مخصص' : 'Custom Smart Insight'}</span>
                      <span className="text-[8px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded-full font-black">99.4% Synergy</span>
                    </div>
                    
                    {aiGenerating ? (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-64 bg-white/5 rounded animate-pulse" />
                      </div>
                    ) : aiSuggestionText ? (
                      <div className="mt-1.5">
                        <h3 className="text-sm font-extrabold text-white leading-snug">
                          {lang === 'ar' ? aiSuggestionText.ar : aiSuggestionText.en}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {lang === 'ar' ? 'تم توليد هذه التوصية اللحظية خصيصاً بناءً على اهتماماتك المحدثة بالملف الشخصي.' : 'Generated instantly based on your interest profile parameters.'}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1.5">
                        <h3 className="text-sm font-extrabold text-white leading-snug animate-pulse">
                          {lang === 'ar' ? 'هل أنت مستعد لتلقي اقتراحك الذكي اليوم؟ 🚀' : 'Ready for your cosmic daily recommendation? 🚀'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {lang === 'ar' 
                            ? 'اضغط على الزر أدناه ليقوم الذكاء الاصطناعي بتحليل ميولك واهتماماتك الحالية واقتراح غرف ومجتمعات تناسبك.'
                            : 'Click below to synthesize a tailored recommendation mapping active audio rooms, peers, and courses.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (aiGenerating) return;
                    playSynthSound(440, 'triangle', 0.1);
                    setTimeout(() => playSynthSound(880, 'sine', 0.2), 100);
                    setAiGenerating(true);
                    
                    const suggestions = [
                      {
                        ar: 'ننصحك بزيارة "غرفة لغات المستقبل" ومناقشة Rust والتعلم مع صالح العمري الآن! 🚀',
                        en: 'We suggest entering the "Future Languages Room" to converse with Saleh Omri regarding Rust! 🚀'
                      },
                      {
                        ar: 'وجدنا تفاعلاً كبيراً في مجتمع "الذكاء الاصطناعي". انضم للبث المباشر لصناعة النماذج الآن! 🤖',
                        en: 'High resonance detected in "AI Community". Tune into the live stream creating model nodes! 🤖'
                      },
                      {
                        ar: 'مباراة شطرنج حاسمة في مجتمع الألعاب تبدأ الليلة! لا تفوت فرصة التسجيل 🏆♟️',
                        en: 'Crucial blitz chess match starts tonight! RSVP now inside the Gaming circle 🏆♟️'
                      },
                      {
                        ar: 'سارة المهندس قامت بنشر تحديثات هامة بخصوص React 19 في مجتمع المطورين 💻',
                        en: 'Sarah Al-Mohandes shared game-changing React 19 structural patterns in coding feed 💻'
                      }
                    ];

                    setTimeout(() => {
                      const rand = suggestions[Math.floor(Math.random() * suggestions.length)];
                      setAiSuggestionText(rand);
                      setAiGenerating(false);
                      playSynthSound(1046.5, 'sine', 0.25);
                    }, 1500);
                  }}
                  disabled={aiGenerating}
                  className="w-full md:w-auto px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition-all active:scale-95 shrink-0 shadow-lg shadow-purple-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Brain className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>{lang === 'ar' ? 'توليد اقتراح مخصص 🌟' : 'Generate Recommendation 🌟'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SUGGESTED COMMUNITIES */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'المجتمعات المقترحة 🌍' : 'Suggested Communities 🌍'}
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{communities.length} Communities Available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((comm) => {
                const isJoined = currentUser.joinedCommunities.includes(comm.id);
                return (
                  <div 
                    key={comm.id}
                    className="glass-panel rounded-2xl border border-white/5 hover:border-cyan-500/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg group relative"
                  >
                    <div className="h-16 w-full relative overflow-hidden">
                      <img src={comm.banner} alt={comm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                    </div>

                    <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl shadow-md -mt-5 relative z-10">
                            {comm.icon}
                          </div>
                          <span className="text-[8px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider -mt-3">
                            {comm.category}
                          </span>
                        </div>

                        <h3 className="text-xs font-black text-white mt-2 group-hover:text-cyan-400 transition-colors">
                          {comm.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {comm.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{comm.membersCount.toLocaleString()} {lang === 'ar' ? 'عضو' : 'members'}</span>
                        </span>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              playSynthSound(600, 'sine', 0.08);
                              setActiveCommunity(comm);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                          >
                            {lang === 'ar' ? 'تصفح' : 'Browse'}
                          </button>
                          
                          <button
                            onClick={() => {
                              playSynthSound(900, 'sine', 0.1);
                              setCurrentUser(prev => {
                                const isMember = prev.joinedCommunities.includes(comm.id);
                                const updated = isMember 
                                  ? prev.joinedCommunities.filter(id => id !== comm.id)
                                  : [...prev.joinedCommunities, comm.id];
                                return { ...prev, joinedCommunities: updated };
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                              isJoined 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                            }`}
                          >
                            {isJoined ? (lang === 'ar' ? 'مشترك ✓' : 'Joined ✓') : (lang === 'ar' ? 'انضمام' : 'Join')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE ROOMS */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'الغرف الصوتية والمشاهد الحية النشطة 🎙️' : 'Active Voice Rooms & Streams 🎙️'}
                </h2>
              </div>
              <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Live Now</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  {lang === 'ar' ? 'الصالونات الصوتية المشتركة' : 'Joint Audio Salons'}
                </span>

                {communities.flatMap(c => c.activeVoiceRooms).map((room) => (
                  <div 
                    key={room.id}
                    className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1">
                            <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping" />
                            <span>VOICE LIVE</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white mt-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                          {room.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{room.listenersCount}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <img src={room.hostAvatar} alt={room.hostName} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                        <div>
                          <span className="text-[9px] font-black text-slate-300 block leading-tight">{room.hostName}</span>
                          <span className="text-[8px] text-slate-500 block">{lang === 'ar' ? 'المضيف الرئيسي' : 'Main Room Host'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playSynthSound(800, 'sine', 0.12);
                          alert(lang === 'ar' ? 'جاري تحضير وربط كود الغرفة الصوتية الفائقة...' : 'Connecting to high-fidelity audio channel...');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-500/10"
                      >
                        {lang === 'ar' ? 'استماع ودخول 🎧' : 'Join Audio 🎧'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  {lang === 'ar' ? 'اللقاءات المرئية والبثوث' : 'Video meetings & Broadcasts'}
                </span>

                {communities.flatMap(c => c.activeVideoRooms).slice(0, 1).map((room) => (
                  <div 
                    key={room.id}
                    className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1">
                          <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                          <span>3D CAMERA SPACE</span>
                        </span>
                        <h4 className="text-xs font-black text-white mt-2 line-clamp-1 group-hover:text-blue-300 transition-colors">
                          {room.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span>{room.participantsCount}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <img src={room.hostAvatar} alt={room.hostName} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                        <div>
                          <span className="text-[9px] font-black text-slate-300 block leading-tight">{room.hostName}</span>
                          <span className="text-[8px] text-slate-500 block">Moderator</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playSynthSound(800, 'sine', 0.1);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        {lang === 'ar' ? 'تشغيل الكاميرا 📹' : 'Open Camera 📹'}
                      </button>
                    </div>
                  </div>
                ))}

                {communities.flatMap(c => c.activeStreams).slice(0, 1).map((stream) => (
                  <div 
                    key={stream.id}
                    className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-pink-500/20 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[8px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1">
                          <span className="w-1 h-1 bg-pink-500 rounded-full animate-ping" />
                          <span>LIVE BROADCAST</span>
                        </span>
                        <h4 className="text-xs font-black text-white mt-2 line-clamp-1 group-hover:text-pink-300 transition-colors">
                          {stream.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                          <Tv className="w-3 h-3 text-pink-400" />
                          <span>{stream.viewerCount}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <img src={stream.streamerAvatar} alt={stream.streamerName} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                        <div>
                          <span className="text-[9px] font-black text-slate-300 block leading-tight">{stream.streamerName}</span>
                          <span className="text-[8px] text-slate-500 block">Streamer</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playSynthSound(800, 'sine', 0.1);
                          alert(lang === 'ar' ? 'جاري فتح البث الفائق بدقة FHD...' : 'Syncing FHD stream node...');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/35 border border-pink-500/30 text-pink-400 text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        {lang === 'ar' ? 'مشاهدة البث 📺' : 'Watch Stream 📺'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVE FRIENDS */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'الأصدقاء النشطون 👥' : 'Active Friends 👥'}
                </h2>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{chats.filter(c => c.isOnline).length} Online</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {chats.map((friend) => (
                <div 
                  key={friend.id}
                  className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-emerald-500/15 transition-all flex flex-col justify-between gap-3 relative group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img src={friend.contactAvatar} alt={friend.contactName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      {friend.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0f] animate-pulse" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-600 border-2 border-[#0a0a0f]" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{friend.contactName}</h4>
                      <span className="text-[9px] text-slate-500 block">
                        {friend.isOnline ? (lang === 'ar' ? 'متصل الآن' : 'Online') : (lang === 'ar' ? 'غير متصل' : 'Offline')}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 line-clamp-1 italic bg-black/20 p-2 rounded-lg">
                    "{friend.messages[friend.messages.length - 1]?.text || (lang === 'ar' ? 'لا توجد رسائل' : 'No messages')}"
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        playSynthSound(440, 'sine', 0.08);
                        setActiveChat(friend);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'دردشة' : 'Chat'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleSimulateCall('voice', friend.contactName)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-300 transition-all cursor-pointer"
                      title={lang === 'ar' ? 'اتصال صوتي' : 'Audio Call'}
                    >
                      <Phone className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'الأحداث والفعاليات الكونية القادمة 🏆' : 'Upcoming Events & Tournaments 🏆'}
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{events.length} Live Schedules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div 
                  key={ev.id}
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-cyan-500/25 transition-all flex flex-col justify-between gap-4 shadow-lg group"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {ev.organizer}
                      </span>
                      <span className="text-[9px] text-cyan-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{ev.time} ({ev.date})</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white mt-3 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {ev.title}
                    </h4>
                    <span className="text-[9px] text-slate-500 block mt-1">
                      {lang === 'ar' ? `المجال التقني: ${ev.category}` : `Sphere: ${ev.category}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px]">
                    <span className="text-slate-400 font-bold">
                      {ev.attendeesCount} {lang === 'ar' ? 'مسجلين' : 'RSVPs'}
                    </span>

                    <button
                      onClick={() => {
                        playSynthSound(900, 'sine', 0.1);
                        setEvents(prev => prev.map(item => {
                          if (item.id === ev.id) {
                            return { ...item, attendeesCount: item.attendeesCount + 1 };
                          }
                          return item;
                        }));
                        alert(lang === 'ar' ? 'تمت عملية التسجيل وحجز تذكرة الحضور الكونية بنجاح! 🌌🎟️' : 'Universe Ticket issued successfully! 🌌🎟️');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[9px] font-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {lang === 'ar' ? 'تسجيل حضور 🤝' : 'RSVP 🤝'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GAMES & TRIVIA */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400 animate-bounce" />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  {lang === 'ar' ? 'مركز الألعاب والتحديات التفاعلي 🎮' : 'Games & Interactive Challenges 🎮'}
                </h2>
              </div>
              <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full font-bold">Play & Earn Points</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-[#0c0c14] to-cyan-950/10 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'ar' ? 'تحدي المعرفة لودافيا 🎮' : 'Lodavia Trivia Challenge 🎮'}</span>
                    </h3>
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-black">+100 Pts</span>
                  </div>

                  {!quizAnswered ? (
                    <div className="mt-3">
                      <p className="text-xs text-slate-300 leading-relaxed mb-4 font-bold">
                        {lang === 'ar' 
                          ? 'سؤال المعرفة: ما هو الأصل اللغوي لاسم تطبيقنا "Lodavia"؟' 
                          : 'Question: What is the semantic linguistic origin of Lodavia?'}
                      </p>
                      
                      <div className="flex flex-col gap-2.5">
                        <button 
                          onClick={() => handleQuizAnswer('a')}
                          className="w-full p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 hover:bg-white/10 text-start transition-all cursor-pointer hover:border-white/20"
                        >
                          أ) {lang === 'ar' ? 'مستوحى من رموز برمجية عشوائية' : 'Inspired by arbitrary development blocks'}
                        </button>
                        <button 
                          onClick={() => handleQuizAnswer('b')}
                          className="w-full p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 hover:bg-white/10 text-start transition-all cursor-pointer hover:border-white/20"
                        >
                          ب) {lang === 'ar' ? 'كلمة مدمجة تشير للسرعة والكوانتم' : 'A synthetic quantum physics jargon'}
                        </button>
                        <button 
                          onClick={() => handleQuizAnswer('c')}
                          className="w-full p-3 rounded-2xl bg-white/5 border border-cyan-500/20 text-xs text-slate-300 hover:bg-cyan-500/5 text-start transition-all cursor-pointer hover:border-cyan-400/40"
                        >
                          ج) {lang === 'ar' ? 'يرمز للضوء، التواصل الفائق، والتعلم والذكاء ✨' : 'Reflects light, absolute sync, interactive learning & neural networks ✨'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-xl text-cyan-400 mb-3 animate-bounce">
                        ✨
                      </div>
                      <span className="text-sm text-cyan-400 font-black block mb-2">+{quizScore} Lodavia Points 💎</span>
                      <p className="text-xs text-slate-300 leading-relaxed px-4">{quizFeedback}</p>
                      <button 
                        onClick={() => {
                          setQuizAnswered(false);
                          playSynthSound(600, 'sine', 0.1);
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-purple-400 font-bold transition-all cursor-pointer"
                      >
                        {lang === 'ar' ? 'اختبار سؤال آخر 🔄' : 'Try Another Challenge 🔄'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#0c0c14] to-yellow-950/10 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>{lang === 'ar' ? 'قرعة الكوانتم والحظ لودافيا 🪙' : 'Lodavia Quantum Coin Flip 🪙'}</span>
                    </h3>
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-black">Cost: 20 Pts / Win: 50 Pts</span>
                  </div>

                  <div className="mt-3 flex flex-col items-center justify-center text-center gap-3">
                    <p className="text-xs text-slate-300">
                      {lang === 'ar' 
                        ? 'اختبر حظك! حدد توقعك ثم اقلب العملة الكونية لكسب المزيد من النقاط.'
                        : 'Predict the cosmic spin! Risk 20 points for a chance to win 50 points.'}
                    </p>

                    <div className="my-2 relative">
                      <div 
                        className={`w-16 h-16 rounded-full border-4 border-yellow-500 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 shadow-lg flex items-center justify-center text-2xl font-black text-amber-950 select-none ${
                          coinFlipping ? 'animate-spin' : ''
                        }`}
                      >
                        {coinSide === 'heads' ? '👑' : coinSide === 'tails' ? '🪐' : '💎'}
                      </div>
                    </div>

                    {coinResultMsg && (
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full animate-pulse">
                        {coinResultMsg}
                      </span>
                    )}

                    <div className="flex items-center gap-3 w-full mt-2">
                      <button
                        onClick={() => {
                          if (coinFlipping) return;
                          if (currentUser.points < 20) {
                            playSynthSound(150, 'sawtooth', 0.25);
                            setCoinResultMsg(lang === 'ar' ? 'نقاطك غير كافية لركوب موجة الحظ!' : 'Insufficient points!');
                            return;
                          }

                          playSynthSound(300, 'triangle', 0.1);
                          setCoinFlipping(true);
                          setCoinResultMsg(lang === 'ar' ? 'جاري قلب العملة...' : 'Spinning coin...');
                          
                          let count = 0;
                          const interval = setInterval(() => {
                            playSynthSound(400 + Math.random() * 200, 'sine', 0.02);
                            count++;
                            if (count > 8) clearInterval(interval);
                          }, 100);

                          setTimeout(() => {
                            const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
                            setCoinSide(outcome);
                            setCoinFlipping(false);

                            if (outcome === 'heads') {
                              playSynthSound(880, 'sine', 0.1);
                              setTimeout(() => playSynthSound(1320, 'sine', 0.2), 80);
                              setCurrentUser(prev => ({ ...prev, points: prev.points + 30 }));
                              setCoinResultMsg(lang === 'ar' ? 'ربحت! العملة استقرت على التاج الملكي 👑 (+50 نقطة)' : 'You Won! Landed on Royal Crown 👑 (+50 Pts)');
                            } else {
                              playSynthSound(200, 'sawtooth', 0.3);
                              setCurrentUser(prev => ({ ...prev, points: prev.points - 20 }));
                              setCoinResultMsg(lang === 'ar' ? 'عذراً! خبت القرعة واستقرت العملة على الكوكب 🪐 (-20 نقطة)' : 'No Luck! Landed on Cosmic Planet 🪐 (-20 Pts)');
                            }
                          }, 1500);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-yellow-500/10"
                      >
                        {lang === 'ar' ? 'اقلب العملة (تاج 👑) ✨' : 'Flip Coin (Heads 👑) ✨'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/*                            MODALS & OVERLAYS                              */}
      {/* ========================================================================= */}
      
      {/* Share success popup notification */}
      {showShareSuccess && (
        <div className="fixed bottom-6 start-6 z-50 p-4 rounded-2xl bg-emerald-500 border border-emerald-400 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-[slideUp_0.2s_ease-out]">
          <Check className="w-4 h-4 text-white animate-bounce" />
          <span>{lang === 'ar' ? 'تم نسخ الرابط الكوني للمنشور بنجاح! 🪐🔗' : 'Cosmic post URL copied successfully! 🪐🔗'}</span>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out]">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>{lang === 'ar' ? 'الإبلاغ عن محتوى غير لائق' : 'Flag Post Content'}</span>
              </h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowReportModal(false);
                  setReportedPostId(null);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              {lang === 'ar' 
                ? 'ساعدنا في الحفاظ على بيئة لومو الكونية آمنة للجميع. حدد سبب البلاغ أدناه:' 
                : 'Help us maintain a respectful and productive cosmic network. Specify the issue below:'}
            </p>

            <div className="flex flex-col gap-2">
              {[
                { id: 'spam', labelAr: 'محتوى غير هام أو سبام ✉️', labelEn: 'Spam or irrelevant ✉️' },
                { id: 'harassment', labelAr: 'إساءة أو مضايقة 🛑', labelEn: 'Harassment or abuse 🛑' },
                { id: 'inappropriate', labelAr: 'محتوى غير لائق 🔞', labelEn: 'Inappropriate media 🔞' }
              ].map(reason => (
                <button
                  key={reason.id}
                  onClick={() => handleReportSubmit(reason.id)}
                  className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-start text-xs text-slate-300 font-bold transition-all cursor-pointer"
                >
                  {lang === 'ar' ? reason.labelAr : reason.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
