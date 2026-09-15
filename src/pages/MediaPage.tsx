import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Play, Pause, Heart, MessageCircle, Share2, Upload, Tv, Flame, Watch, 
  Send, Users, HelpCircle, AlertCircle, Check, Search, ChevronRight, X, 
  Plus, Radio, Award, Sparkles, User, Database, Globe, Compass, Film, Camera
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  titleAr: string;
  creator: {
    name: string;
    avatar: string;
    badge?: string;
  };
  thumbnail: string;
  videoUrl?: string;
  type: 'reel' | 'video' | 'live';
  views: number;
  likes: number;
  liked?: boolean;
  comments: Array<{
    author: string;
    text: string;
    time: string;
  }>;
  duration?: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
}

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  // REELS
  {
    id: 'reel-1',
    title: 'Cinematic Hyperdrive through the Orion Nebula 🌌',
    titleAr: 'رحلة سينمائية فائقة السرعة عبر سديم الجبار 🌌',
    creator: {
      name: 'AstroVisuals',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Creator Elite'
    },
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 45200,
    likes: 12400,
    comments: [
      { author: 'Lara', text: 'This looks so magical! ✨', time: '1h ago' },
      { author: 'CosmoCoder', text: 'The rendering engine is incredible.', time: '30m ago' }
    ],
    category: 'Astrophotography',
    categoryAr: 'التصوير الفلكي',
    description: 'A breathtaking 60fps CGI simulation navigating the dense gases and newborn stars of the stellar nursery.',
    descriptionAr: 'محاكاة ثلاثية الأبعاد مذهلة بمعدل 60 إطاراً في الثانية تتنقل عبر الغازات الكثيفة والنجوم الوليدة في الحضانة النجمية.'
  },
  {
    id: 'reel-2',
    title: 'Red Giant Star swallowing an Exoplanet simulation ☄️',
    titleAr: 'محاكاة نجم عملاق أحمر يبتلع كوكباً خارجياً ☄️',
    creator: {
      name: 'SpaceChronicles',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 28100,
    likes: 9150,
    comments: [
      { author: 'Samer', text: 'Terrifying and beautiful at the same time.', time: '2h ago' }
    ],
    category: 'Cosmology',
    categoryAr: 'علم الكونيات',
    description: 'An educational breakdown of the fate of solar systems when their stars expand into their final evolutionary stages.',
    descriptionAr: 'تحليل تعليمي لمصير الأنظمة الشمسية عندما تتسع نجومها لتدخل في مراحلها التطورية النهائية.'
  },
  {
    id: 'reel-3',
    title: 'Redefining Gravity: Inside a Spinning Colony 🛸',
    titleAr: 'إعادة تعريف الجاذبية: داخل مستعمرة فضائية دوارة 🛸',
    creator: {
      name: 'ColonyArch',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      badge: 'Architect Node'
    },
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 89000,
    likes: 31200,
    comments: [],
    category: 'Future Tech',
    categoryAr: 'تكنولوجيا المستقبل',
    description: 'Holographic fly-through of an O\'Neill Cylinder showcasing artificial ecosystems and centrifugal gravity wheels.',
    descriptionAr: 'رحلة هولوغرافية داخل أسطوانة أونيل تستعرض الأنظمة البيئية الاصطناعية وعجلات الجاذبية الطاردة المركزية.'
  },

  // LONG VIDEOS
  {
    id: 'video-1',
    title: 'The James Webb Deep Field Analysis: Deciphering the First Light',
    titleAr: 'تحليل الحقل العميق لتلسكوب جيمس ويب: فك رموز الضوء الأول',
    creator: {
      name: 'Dr. Evelyn Carter',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      badge: 'Astrophysicist Pro'
    },
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    views: 120500,
    likes: 45000,
    duration: '14:22',
    comments: [
      { author: 'Amine', text: 'This lecture is worth a university credit!', time: '1d ago' },
      { author: 'Farah', text: 'The clarity of explanation is astonishing.', time: '12h ago' }
    ],
    category: 'Astrophysics',
    categoryAr: 'الفيزياء الفلكية',
    description: 'In this comprehensive analysis, we zoom into deep galaxy clusters dating back 13.5 billion years, explaining gravitational lensing and early stellar chemistry.',
    descriptionAr: 'في هذا التحليل الشامل، نقوم بالتكبير داخل العناقيد المجرية العميقة التي تعود إلى 13.5 مليار سنة، ونشرح عدسات الجاذبية والكيمياء النجمية المبكرة.'
  },
  {
    id: 'video-2',
    title: 'Building Lodavia Station: The Future of Orbital Cloud Nodes',
    titleAr: 'بناء محطة لودافيا: مستقبل عقد السحابة المدارية',
    creator: {
      name: 'Lodavia Aerospace',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      badge: 'Official Team'
    },
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    views: 67300,
    likes: 21000,
    duration: '08:45',
    comments: [],
    category: 'Aerospace Engineering',
    categoryAr: 'هندسة الفضاء',
    description: 'A structural overview of the modular satellite structures hosting decentralized quantum computing nodes in Low Earth Orbit.',
    descriptionAr: 'نظرة عامة هيكلية على هياكل الأقمار الصناعية المعيارية التي تستضيف عقد الحوسبة الكمومية اللامركزية في المدار الأرضي المنخفض.'
  },

  // LIVE STREAMS
  {
    id: 'live-1',
    title: '🔴 LIVE: Interactive Lunar Base Telemetry & QA with AI',
    titleAr: '🔴 مباشر: تتبع قاعدة القمر والأسئلة والأجوبة مع الذكاء الاصطناعي',
    creator: {
      name: 'MoonMissionAlpha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badge: 'Live Node'
    },
    thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
    type: 'live',
    views: 4500, // Live viewers
    likes: 8300,
    comments: [
      { author: 'System_Beacon', text: 'Quantum signal strength is 98%', time: 'Just now' },
      { author: 'Tareq', text: 'Is the lunar core stable?', time: '2m ago' }
    ],
    category: 'Live Operations',
    categoryAr: 'العمليات الحية',
    description: 'Live telemetry reporting from the Shackleton Crater base simulator. Ask our AI astrophysicist anything in real time.',
    descriptionAr: 'بث حي لبيانات تتبع المحاكاة من قاعدة فوهة شاكلتون. اسأل عالم الفيزياء الفلكية المدعم بالذكاء الاصطناعي أي شيء في الوقت الفعلي.'
  }
];

export default function MediaPage() {
  const { lang, currentUser, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'reels' | 'videos' | 'live'>('reels');
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reels specific controls
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState<MediaItem | null>(null);

  // Upload/Creator Specific Controls
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTitleAr, setUploadTitleAr] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState<'reel' | 'video' | 'live'>('reel');
  const [uploadThumbnail, setUploadThumbnail] = useState('');

  // Live Stream Specific State
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Hadi', text: 'Incredible speed on these arrays! 🛰️', time: '12:00' },
    { sender: 'Luna_Lover', text: 'Greetings from Amman!', time: '12:01' },
    { sender: 'AstroCore', text: 'Are we observing solar winds?', time: '12:01' }
  ]);
  const [newLiveMessage, setNewLiveMessage] = useState('');

  const reelsContainerRef = useRef<HTMLDivElement>(null);

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

  const activeReels = mediaList.filter(item => item.type === 'reel');

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

  // Add Comment
  const handleAddComment = (itemId: string, isLiveChat: boolean = false) => {
    if (isLiveChat) {
      if (!newLiveMessage.trim()) return;
      playSynthSound(600, 'sine', 0.05);
      setLiveChatMessages(prev => [
        ...prev,
        { sender: currentUser.name, text: newLiveMessage, time: 'Now' }
      ]);
      setNewLiveMessage('');
    } else {
      if (!commentText.trim()) return;
      playSynthSound(600, 'sine', 0.05);
      setMediaList(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            comments: [
              ...item.comments,
              { author: currentUser.name, text: commentText, time: 'Just now' }
            ]
          };
        }
        return item;
      }));
      setCommentText('');
    }
  };

  // Handle scroll snap index for reels
  const handleReelsScroll = (e: React.UIEvent<HTMLDivElement>) => {
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

  // Handle file creation
  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    playSynthSound(880, 'sine', 0.2);
    const newItem: MediaItem = {
      id: `user-${uploadType}-${Date.now()}`,
      title: uploadTitle,
      titleAr: uploadTitleAr || uploadTitle,
      creator: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        badge: 'Explorer Creator'
      },
      thumbnail: uploadThumbnail || 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
      type: uploadType,
      views: 120,
      likes: 5,
      comments: [],
      category: uploadCategory || 'Education',
      categoryAr: uploadCategory || 'تعليمي',
      description: uploadDescription || 'User-uploaded educational media on the Lodavia network.',
      descriptionAr: uploadDescription || 'محتوى تعليمي مرفوع بواسطة رائد فضاء لودافيا.',
      duration: uploadType === 'video' ? '03:40' : undefined
    };

    setMediaList(prev => [newItem, ...prev]);
    setShowUploadModal(false);
    
    // Clear inputs
    setUploadTitle('');
    setUploadTitleAr('');
    setUploadCategory('');
    setUploadDescription('');
    setUploadThumbnail('');

    // Reward points for contribution
    setCurrentUser((prev: any) => ({
      ...prev,
      points: prev.points + 20
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-void border border-slate-200 dark:border-white/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
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

          <button
            onClick={() => {
              playSynthSound(650, 'sine', 0.1);
              setShowUploadModal(true);
            }}
            className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 dark:bg-gradient-nova text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-sky-400/20 dark:border-white/10"
          >
            <Upload className="w-4 h-4" />
            <span>{lang === 'ar' ? 'رفع محتوى 🚀' : 'Upload Media 🚀'}</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-2 rounded-2xl relative z-10 shadow-sm">
        
        {/* Sub Tabs Toggle */}
        <div className="flex gap-1.5 w-full md:w-auto">
          {[
            { id: 'reels', labelAr: '🎬 ريلز قصيرة', labelEn: '🎬 Vertical Reels', icon: Film },
            { id: 'videos', labelAr: '📺 فيديوهات طويلة', labelEn: '📺 Long Videos', icon: Tv },
            { id: 'live', labelAr: '🔴 البث المباشر', labelEn: '🔴 Live Streams', icon: Radio }
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
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-[11px] font-black cursor-pointer flex items-center justify-center gap-2 transition-all ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-cyan-400/50 text-white shadow-md'
                    : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl flex items-center px-3 py-2 shrink-0">
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
      <div className="relative z-10 w-full min-h-[500px]">
        
        {/* REELS: VERTICAL SNAP TIKTOK STYLE */}
        {activeSubTab === 'reels' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Reels Video Feed Column */}
            <div className="md:col-span-8 flex justify-center w-full">
              {activeReels.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/5 text-center w-full shadow-sm">
                  <Film className="w-12 h-12 text-slate-400 dark:text-white/50 mx-auto mb-3 animate-pulse" />
                  <span className="text-xs text-[#111827] dark:text-white/70 font-bold block">{lang === 'ar' ? 'لا توجد مقاطع ريلز' : 'No Reels Available'}</span>
                </div>
              ) : (
                <div className="relative w-full max-w-[420px] aspect-[9/16] h-[640px] rounded-[36px] overflow-hidden border-4 border-white/10 bg-black shadow-2xl group flex flex-col">
                  
                  {/* Vertical Container for scrolling */}
                  <div 
                    ref={reelsContainerRef}
                    onScroll={handleReelsScroll}
                    className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                  >
                    {activeReels.map((reel, idx) => (
                      <div 
                        key={reel.id} 
                        className="w-full h-full snap-start snap-always relative shrink-0 flex flex-col justify-end p-6"
                      >
                        {/* Background Starry Nebula Canvas Simulator / Cover Image */}
                        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${reel.thumbnail})` }}>
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
                        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5">
                          {/* Creator Avatar */}
                          <div className="relative">
                            <img src={reel.creator.avatar} alt={reel.creator.name} className="w-11 h-11 rounded-full object-cover border-2 border-aurora-400 shadow-md shadow-glow-aurora" />
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
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center border backdrop-blur-md transition-all active:scale-90 ${reel.liked ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-black/40 border-white/10 text-white hover:border-red-400'}`}>
                              <Heart className={`w-5 h-5 ${reel.liked ? 'fill-red-500' : ''}`} />
                            </div>
                            <span className="text-[10px] font-mono text-white/70 font-bold">{reel.likes.toLocaleString()}</span>
                          </button>

                          {/* Comments Trigger */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowCommentsModal(reel); }}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:border-aurora-400 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-white/70 font-bold">{reel.comments.length}</span>
                          </button>

                          {/* Share Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playSynthSound(700, 'sine', 0.1);
                              navigator.clipboard.writeText(window.location.href);
                              alert(lang === 'ar' ? 'تم نسخ رابط المقطع الكوني!' : 'Cosmic link copied to clipboard!');
                            }}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:border-nova-400 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
                              <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">{lang === 'ar' ? 'مشاركة' : 'Share'}</span>
                          </button>
                        </div>

                        {/* Bottom Information overlay on top of vertical page */}
                        <div className="relative z-20 max-w-[280px] text-start flex flex-col gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-aurora-500/20 text-aurora-400 text-[8px] font-mono border border-aurora-500/30 uppercase tracking-widest w-fit font-black">
                            {lang === 'ar' ? reel.categoryAr : reel.category}
                          </span>
                          <h3 className="text-sm font-black text-white leading-snug drop-shadow-md">
                            {lang === 'ar' ? reel.titleAr : reel.title}
                          </h3>
                          <p className="text-[11px] text-white/70 line-clamp-2 drop-shadow-sm leading-relaxed">
                            {lang === 'ar' ? reel.descriptionAr : reel.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/60 mt-1 font-semibold">
                            <span className="text-white">@{reel.creator.name}</span>
                            <span>•</span>
                            <span>{reel.views.toLocaleString()} views</span>
                          </div>
                        </div>

                        {/* Infinite sound loop wave indicator */}
                        {isPlaying && (
                          <div className="absolute left-6 bottom-44 z-20 flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.4s_infinite_alternate]" style={{ height: '70%' }} />
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.3s_infinite_alternate]" style={{ height: '100%', animationDelay: '0.1s' }} />
                            <span className="w-0.5 bg-aurora-400 rounded-full animate-[pulse_0.5s_infinite_alternate]" style={{ height: '40%', animationDelay: '0.2s' }} />
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* Top Header metadata */}
                  <div className="absolute top-4 left-6 right-6 z-20 flex justify-between items-center text-[9px] font-mono text-aurora-400 pointer-events-none">
                    <span>SECTOR_REEL_ACTIVE</span>
                    <span>{currentReelIndex + 1} / {activeReels.length}</span>
                  </div>

                </div>
              )}
            </div>

            {/* Side Tips & Navigation Card */}
            <div className="md:col-span-4 flex flex-col gap-4">
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
                          onClick={() => handleLike(item.id)}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-white/70 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                          <span>{item.likes}</span>
                        </button>
                        <button 
                          onClick={() => {
                            playSynthSound(750, 'sine', 0.1);
                            alert(lang === 'ar' ? 'تم نسخ مفتاح التشفير للبث!' : 'Quantum stream decryption key copied!');
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] cursor-pointer transition-all active:scale-95 shadow-md"
                        >
                          {lang === 'ar' ? 'تشفير كمي' : 'Decrypt Link'}
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
                    <div key={i} className="flex gap-2.5 items-start text-xs text-slate-700 dark:text-white/70 leading-snug animate-[fadeIn_0.3s_ease-out]">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">@{msg.sender}:</span>
                      <p className="flex-1 text-slate-800 dark:text-white/80">{msg.text}</p>
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

      {/* ----------------- COMMENTS MODAL (FOR REELS) ----------------- */}
      <AnimatePresence>
        {showCommentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-[500px] justify-between text-start"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-xs font-black text-[#111827] dark:text-white">{lang === 'ar' ? 'التعليقات الكونية' : 'Cosmic Comments'}</h3>
                  <span className="text-[10px] text-[#64748B] dark:text-white/50">{showCommentsModal.comments.length} Comments logged</span>
                </div>
                <button 
                  onClick={() => setShowCommentsModal(null)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Scroller */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
                {showCommentsModal.comments.map((comment, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-aurora-500/10 border border-sky-500/20 dark:border-aurora-400/20 flex items-center justify-center text-[10px] text-sky-600 dark:text-aurora-400 font-bold font-mono">
                      {comment.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#111827] dark:text-white/80">{comment.author}</span>
                        <span className="text-[8px] text-[#64748B] dark:text-white/50 font-mono">{comment.time}</span>
                      </div>
                      <p className="text-xs text-[#475569] dark:text-white/70 mt-1 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {showCommentsModal.comments.length === 0 && (
                  <div className="py-12 text-center text-[#64748B] dark:text-white/50 text-xs font-mono">
                    {lang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يرسل رسالته! ☄️' : 'No comments logged. Be the first to emit stardust input! ☄️'}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <div className="border-t border-slate-100 dark:border-white/5 pt-3 flex gap-2">
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

      {/* ----------------- UPLOAD MODAL ----------------- */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl text-start"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-black text-[#111827] dark:text-white">{lang === 'ar' ? 'إطلاق وبث وسائط فلكية جديدة' : 'Launch New Astrophysics Media'}</h3>
                <button 
                  onClick={() => setShowUploadModal(false)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMedia} className="space-y-4 mt-4">
                
                {/* Title Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">English Title</label>
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Gravity anomaly inside Kepler 186f"
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-white/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">العنوان بالعربية</label>
                    <input
                      type="text"
                      required
                      value={uploadTitleAr}
                      onChange={(e) => setUploadTitleAr(e.target.value)}
                      placeholder="مثال: شذوذ الجاذبية داخل كبلر 186f"
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-white/40"
                    />
                  </div>
                </div>

                {/* Type Selector & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">Format</label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as any)}
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-[#070d1a] border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white"
                    >
                      <option value="reel">{lang === 'ar' ? 'ريلز قصيرة (Vertical Reel)' : 'Vertical Reel'}</option>
                      <option value="video">{lang === 'ar' ? 'فيديو طويل (Curated Video)' : 'Curated Video'}</option>
                      <option value="live">{lang === 'ar' ? 'قناة بث مباشر (Live Stream)' : 'Live Stream'}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">Category</label>
                    <input
                      type="text"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      placeholder="e.g. Astrophysics, Future Tech"
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-white/40"
                    />
                  </div>
                </div>

                {/* Thumbnail Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">Simulation Cover Image URL</label>
                  <input
                    type="url"
                    value={uploadThumbnail}
                    onChange={(e) => setUploadThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-white/40"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black text-[#64748B] dark:text-white/60 uppercase tracking-widest block">Description / Summary</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Write a brief educational description..."
                    rows={3}
                    className="w-full p-2.5 text-xs rounded-xl resize-none bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-white/40"
                  />
                </div>

                {/* Warning message */}
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-aurora-500/10 border border-sky-200 dark:border-aurora-500/20 text-[10px] text-sky-700 dark:text-aurora-400 leading-relaxed flex gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-600 dark:text-aurora-400 shrink-0 mt-0.5 animate-pulse" />
                  <p>
                    {lang === 'ar' 
                      ? 'بموجب قوانين لودافيا للبحث العلمي، يجب ألا يحتوي المقطع على معلومات مضللة فلكياً. ستحصل على 20 نقطة لمساهمتك العلمية.' 
                      : 'By submitting, you certify this content conforms to astrophysics educational standards. You will receive 20 Pts.'}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-[#475569] dark:text-white/70"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-[11px] shadow-sm"
                  >
                    {lang === 'ar' ? 'بث الآن 🚀' : 'Broadcast Now 🚀'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
