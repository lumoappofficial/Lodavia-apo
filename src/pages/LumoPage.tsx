import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { playSynthSound } from '../utils/helpers';
import { playSuccessSound } from '../utils/soundEffects';
import Lumo3DStage, { CharacterState } from '../components/Lumo3DStage';
import RayLockerModal from '../components/RayLockerModal';
import { MascotSkin } from '../components/LodaviaMascot';
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Shirt,
  BookOpen,
  Orbit,
  Gift,
  X,
  Send,
  Volume2,
  VolumeX,
  Trophy,
  Gamepad2,
  Headphones,
  Compass,
  Star,
  Check,
  Flame,
  Award,
  Zap,
  Smile,
  Heart,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

// Quotes cycled by Ray
const RAY_QUOTES = [
  'مرحباً بك في لودافيا! أنا راي وهذا رفيقي الفضائي 💜 جاهزون لاستكشاف الكون معاً؟',
  'هل نظرت إلى سماء الكون اليوم؟ هناك كواكب ومغامرات جديدة بانتظار استكشافك! 🪐',
  'صديقي الفضائي اللطيف يحييك بحرارة! اضغط عليه ليلعب معك ويمرح 🐾',
  'أنا هنا دائماً لمساعدتك في أي سؤال، فكرة، أو مغامرة تخطر ببالك! 🚀',
  'تذكر أن تجمع مكافأتك اليومية من زر المكافآت على الجانب! 💎',
  'ارتدينا بدلات الفضاء الذهبية وجاهزون للانطلاق إلى أبعد المجرات! ✨'
];

export default function LumoPage() {
  const { currentUser, setCurrentUser, lang } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  // Character Mood / State
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Floating Hearts on Interaction
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<'chat' | 'customize' | 'stories' | 'rewards' | 'help' | null>(null);

  // Customization
  const [currentSkin, setCurrentSkin] = useState<MascotSkin>('default');
  const [dogSuitColor, setDogSuitColor] = useState<'gold' | 'silver' | 'pink'>('gold');

  // AI Chat Messages in Modal
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ray'; text: string; time: string }>>([
    {
      sender: 'ray',
      text: 'أهلاً بك يا بطل! أنا راي، رفيقك الذكي ثلاثي الأبعاد في لودافيا. كيف يمكنني مساعدتك في رحلتك الكونية اليوم؟ 🚀✨',
      time: 'الآن'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Daily Rewards Claim State
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);

  // Stories
  const STORIES = [
    {
      id: 1,
      title: 'سر الكوكب البنفسجي المفقود',
      desc: 'انطلق راي ورفيقه في رحلة استكشافية وراء حزام الكويكبات ليكتشفوا كوكباً ينبض بالأضواء الساحرة...',
      duration: '3 دقائق',
      icon: '🪐'
    },
    {
      id: 2,
      title: 'مغامرة صائد النجوم والمذنبات',
      desc: 'كيف استطاع الكلب الفضائي إنقاذ سفينة الاستكشاف أثناء مرور عاصفة نيازك مضيئة في مدار زحل...',
      duration: '4 دقائق',
      icon: '☄️'
    },
    {
      id: 3,
      title: 'لغز كريستالة لودافيا الذهبية',
      desc: 'حكاية الكريستالة الكونية القديمة التي تمنح الطاقة لجميع رواد فضاء منصة لودافيا...',
      duration: '5 دقائق',
      icon: '✨'
    }
  ];

  // Cycling quote changes character to talking state briefly
  const handleNextQuote = () => {
    playSynthSound(700, 'sine', 0.08);
    setCharacterState('talking');
    setQuoteIndex((prev) => (prev + 1) % RAY_QUOTES.length);
    setTimeout(() => {
      setCharacterState('idle');
    }, 2400);
  };

  // Ray Click Trigger
  const handleRayClick = (pos: { x: number; y: number }) => {
    setCharacterState('happy');
    const newId = Date.now() + Math.random();
    setFloatingParticles((prev) => [
      ...prev,
      { id: newId, x: pos.x, y: pos.y - 40, emoji: '💜' },
      { id: newId + 1, x: pos.x + 25, y: pos.y - 65, emoji: '✨' },
      { id: newId + 2, x: pos.x - 25, y: pos.y - 65, emoji: '🚀' }
    ]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newId && p.id !== newId + 1 && p.id !== newId + 2));
      setCharacterState('idle');
    }, 2000);
  };

  // Space Dog Click Trigger
  const handleDogClick = (pos: { x: number; y: number }) => {
    setCharacterState('happy');
    const newId = Date.now() + Math.random();
    setFloatingParticles((prev) => [
      ...prev,
      { id: newId, x: pos.x, y: pos.y - 40, emoji: '🐾' },
      { id: newId + 1, x: pos.x + 20, y: pos.y - 60, emoji: '⭐' },
      { id: newId + 2, x: pos.x - 20, y: pos.y - 60, emoji: '🐶' }
    ]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newId && p.id !== newId + 1 && p.id !== newId + 2));
      setCharacterState('idle');
    }, 2000);
  };

  // Send message in Chat Modal
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    playSynthSound(600, 'sine', 0.08);

    const userText = inputMessage;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: 'الآن' }]);
    setInputMessage('');
    setIsAiThinking(true);
    setCharacterState('thinking');

    setTimeout(() => {
      setIsAiThinking(false);
      setCharacterState('talking');
      let reply = 'أنا ورفيقي الفضائي معك دائماً! ما رأيك أن نستكشف أحد الألعاب أو نلتقي بالأصدقاء في الغرف الصوتية؟ 🚀🪐';
      if (userText.includes('كلب') || userText.includes('رفيق') || userText.includes('حيوان')) {
        reply = 'إنه رفيقي الفضائي الوفي! يرتدي خوذة زجاجية وطوقاً ذهبياً ويحب ألعاب المطاردة بين النيازك 🐾✨';
      } else if (userText.includes('مكافأة') || userText.includes('نقاط')) {
        reply = 'يمكنك جمع مكافأتك اليومية والحصول على 100 نقطة من زر المكافآت لتخصيص دروعنا! 💎';
      } else if (userText.includes('قصة') || userText.includes('احكي')) {
        reply = 'في مجرة لودافيا توجد كواكب مليئة بالأسرار والبلورات المضيئة.. افتح زر "قصص لودافيا" لتستمع إليها! 📖';
      }

      setChatMessages((prev) => [...prev, { sender: 'ray', text: reply, time: 'الآن' }]);

      setTimeout(() => {
        setCharacterState('idle');
      }, 3000);
    }, 1200);
  };

  // Claim Daily Rewards
  const handleClaimDailyReward = () => {
    if (hasClaimedDaily) return;
    playSuccessSound();
    setHasClaimedDaily(true);
    if (currentUser && setCurrentUser) {
      setCurrentUser({
        ...currentUser,
        points: (currentUser.points || 0) + 100
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[640px] flex flex-col overflow-hidden bg-gradient-to-b from-[#020617] via-[#04132b] to-[#020914] text-white select-none">
      
      {/* 🌟 1. FULL 3D INTERACTIVE STAGE (RAY GLB + 3D SPACE DOG + CUTE PLANETS & ROCKET) */}
      <div className="absolute inset-0 z-0">
        <Lumo3DStage
          characterState={characterState}
          onRayClick={handleRayClick}
          onDogClick={handleDogClick}
          suitColor="gold"
          dogSuitColor={dogSuitColor}
          isSoundActive={soundEnabled}
        />
      </div>

      {/* Floating Particle Hearts / Emojis on Click */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -90, scale: 1.4 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{ left: p.x, top: p.y }}
            className="absolute text-2xl drop-shadow-[0_0_12px_rgba(0,242,254,0.9)]"
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* 🌟 2. TOP FLOATING HEADER BAR */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-4 shrink-0">
        {/* Back / Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.08);
              navigate(-1);
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 hover:bg-cyan-950/50 border border-cyan-400/20 backdrop-blur-xl text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            title={isRtl ? 'رجوع' : 'Back'}
          >
            {isRtl ? <ChevronRight className="w-5 h-5 text-cyan-200" /> : <ChevronLeft className="w-5 h-5 text-cyan-200" />}
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/40 border border-cyan-400/30 backdrop-blur-xl shadow-lg shadow-cyan-950/40">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs sm:text-sm font-black text-cyan-100 tracking-wide">
              Lumo & Ray 3D
            </span>
          </div>
        </div>

        {/* Right Info Badges */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 hover:bg-cyan-950/50 border border-cyan-400/20 backdrop-blur-xl text-white transition-all cursor-pointer shadow-lg"
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Points Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 backdrop-blur-xl text-amber-300 text-xs font-black shadow-lg">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{currentUser?.points || 1250}</span>
          </div>

          {/* Help Button */}
          <button
            onClick={() => {
              playSynthSound(750, 'sine', 0.08);
              setActiveModal('help');
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 hover:bg-cyan-950/50 border border-cyan-400/20 backdrop-blur-xl text-white transition-all cursor-pointer shadow-lg"
            title={isRtl ? 'المساعدة' : 'Help'}
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* 🌟 3. SPEECH BUBBLE OVER 3D SCENE (FLOATING GLASSMORPHIC) */}
      <div className="relative z-20 mx-auto mt-2 max-w-md w-[92%] sm:w-full px-2 pointer-events-auto">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative p-3 sm:p-4 rounded-3xl bg-slate-950/45 border border-cyan-400/30 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,242,254,0.15)] flex items-center justify-between gap-3 text-right"
        >
          <div className="flex items-start gap-2.5 flex-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs shadow-md shrink-0 mt-0.5 text-white font-bold">
              ✨
            </div>
            <p className="text-xs sm:text-sm font-bold text-cyan-100 leading-relaxed">
              {RAY_QUOTES[quoteIndex]}
            </p>
          </div>

          <button
            onClick={handleNextQuote}
            className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 transition-all cursor-pointer shrink-0"
            title={isRtl ? 'عبارة أخرى' : 'Next Quote'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speech Bubble Arrow pointing to Ray */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-950/80" />
        </motion.div>
      </div>

      {/* 🌟 4. FLOATING GLASS ACTION MENU (القلب / الدردشة / الملابس / القصص / الاستكشاف / الهدية) */}
      <div className={`absolute top-28 ${isRtl ? 'right-3 sm:right-6' : 'left-3 sm:left-6'} z-20 flex flex-col gap-2 p-1.5 rounded-3xl bg-slate-950/30 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_8px_32px_rgba(0,18,40,0.5)]`}>
        {[
          {
            id: 'heart',
            labelAr: 'تفاعل وحب',
            labelEn: 'Send Love',
            icon: Heart,
            color: 'from-rose-500 to-pink-600',
            action: () => {
              playSynthSound(750, 'sine', 0.08);
              handleRayClick({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 });
            }
          },
          {
            id: 'chat',
            labelAr: 'تحدث مع راي',
            labelEn: 'Chat with Ray',
            icon: MessageSquare,
            color: 'from-cyan-500 to-blue-600',
            action: () => {
              playSynthSound(650, 'sine', 0.08);
              setActiveModal('chat');
              setCharacterState('thinking');
            }
          },
          {
            id: 'customize',
            labelAr: 'خزانة الملابس',
            labelEn: 'Outfits',
            icon: Shirt,
            color: 'from-sky-500 to-indigo-600',
            action: () => {
              playSynthSound(750, 'sine', 0.08);
              setActiveModal('customize');
            }
          },
          {
            id: 'stories',
            labelAr: 'قصص لودافيا',
            labelEn: 'Stories',
            icon: BookOpen,
            color: 'from-amber-500 to-orange-600',
            action: () => {
              playSynthSound(800, 'sine', 0.08);
              setActiveModal('stories');
            }
          },
          {
            id: 'explore',
            labelAr: 'استكشف الفضاء',
            labelEn: 'Explore',
            icon: Orbit,
            color: 'from-emerald-500 to-teal-600',
            action: () => {
              playSynthSound(850, 'sine', 0.08);
              navigate('/explore-space');
            }
          },
          {
            id: 'rewards',
            labelAr: 'هدية ومكافآت',
            labelEn: 'Rewards',
            icon: Gift,
            color: 'from-fuchsia-500 to-pink-600',
            badge: hasClaimedDaily ? undefined : '!',
            action: () => {
              playSynthSound(900, 'sine', 0.08);
              setActiveModal('rewards');
            }
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.08, x: isRtl ? -4 : 4 }}
              whileTap={{ scale: 0.94 }}
              onClick={item.action}
              className="group relative flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="hidden md:inline text-xs font-black text-slate-200 group-hover:text-cyan-200 pr-1">
                {isRtl ? item.labelAr : item.labelEn}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow-md">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 🌟 5. CHARACTER MOOD STATE CONTROLS (FLOATING GLASS PANEL "عادي/سعيد/مفكر/يتحدث") */}
      <div className={`absolute top-28 ${isRtl ? 'left-3 sm:left-6' : 'right-3 sm:right-6'} z-20 flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-950/30 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_8px_32px_rgba(0,18,40,0.5)]`}>
        <div className="flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[10px] font-black text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{isRtl ? 'حالة راي' : 'Mood'}</span>
        </div>
        {[
          { id: 'idle', label: isRtl ? 'عادي 🧘' : 'Normal 🧘', icon: Smile },
          { id: 'happy', label: isRtl ? 'سعيد 🥳' : 'Happy 🥳', icon: Heart },
          { id: 'thinking', label: isRtl ? 'مفكر 🧐' : 'Thinking 🧐', icon: Sparkles },
          { id: 'talking', label: isRtl ? 'يتحدث 🗣️' : 'Talking 🗣️', icon: MessageSquare }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setCharacterState(m.id as CharacterState);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border backdrop-blur-md flex items-center justify-center ${
              characterState === m.id
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-cyan-500/10 hover:text-cyan-200 hover:border-cyan-500/30'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Spacer to keep 3D center unobstructed */}
      <div className="flex-1" />

      {/* 🌟 6. BOTTOM 4 FEATURE CARDS OVER THE 3D STAGE (GLASSMORPHIC) */}
      <div className="relative z-20 px-3 sm:px-6 pb-4 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
          {[
            {
              id: 'explore-card',
              titleAr: 'استكشف الكون',
              titleEn: 'Explore Space',
              descAr: 'عوالم 3D ومجرات',
              descEn: '3D Galaxies',
              icon: Compass,
              path: '/explore-space',
              color: 'from-cyan-950/60 to-blue-950/60 border-cyan-500/30 hover:border-cyan-400'
            },
            {
              id: 'games-card',
              titleAr: 'الألعاب والتحديات',
              titleEn: 'Games & Fun',
              descAr: 'ألعاب لودافيا',
              descEn: 'Lodavia Games',
              icon: Gamepad2,
              path: '/lodavia-games',
              color: 'from-sky-950/60 to-indigo-950/60 border-sky-500/30 hover:border-sky-400'
            },
            {
              id: 'voice-card',
              titleAr: 'غرف صوتية',
              titleEn: 'Voice Rooms',
              descAr: 'تحدث مع الأصدقاء',
              descEn: 'Live Voice Chat',
              icon: Headphones,
              path: '/voice-rooms',
              color: 'from-teal-950/60 to-cyan-950/60 border-teal-500/30 hover:border-teal-400'
            },
            {
              id: 'journey-card',
              titleAr: 'المسار والتحديات',
              titleEn: 'Cosmic Journey',
              descAr: 'مستويات وجوائز',
              descEn: 'Levels & Rewards',
              icon: Trophy,
              path: '/journey',
              color: 'from-slate-950/60 to-blue-950/60 border-blue-500/30 hover:border-blue-400'
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playSynthSound(700, 'sine', 0.08);
                  navigate(card.path);
                }}
                className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} border backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,18,40,0.4)] flex items-center gap-3 text-right cursor-pointer group transition-all`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-200 shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-black text-white truncate group-hover:text-cyan-200 transition-colors">
                    {isRtl ? card.titleAr : card.titleEn}
                  </h4>
                  <p className="text-[10px] text-cyan-200/70 truncate">
                    {isRtl ? card.descAr : card.descEn}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Stage Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </div>

      {/* 🌟 7. MODALS */}

      {/* A. AI CHAT WITH RAY MODAL */}
      <AnimatePresence>
        {activeModal === 'chat' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900/95 border border-purple-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col max-h-[85vh] text-white"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-lg shadow-md">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">تحدث مع راي ورفيق الفضاء</h3>
                    <p className="text-[10px] text-purple-300">مساعدك الذكي الكوني في لودافيا</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setCharacterState('idle');
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-[220px] max-h-[360px] no-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-800 flex items-center justify-center text-xs shrink-0">
                      {msg.sender === 'user' ? '👤' : '💜'}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-purple-950/70 border border-purple-500/30 text-purple-100 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-purple-300 text-xs py-1">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>راي يفكر في إجابة ذكية...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك لراي..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 text-white text-xs outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black transition-all cursor-pointer shadow-md shadow-purple-500/30"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. RAY LOCKER & CUSTOMIZATION MODAL */}
      <RayLockerModal
        isOpen={activeModal === 'customize'}
        onClose={() => setActiveModal(null)}
        currentSkin={currentSkin}
        onSelectSkin={(skin) => {
          setCurrentSkin(skin);
          playSynthSound(850, 'sine', 0.1);
        }}
        userPoints={currentUser?.points || 1250}
        lang={lang}
        playSynthSound={playSynthSound}
      />

      {/* C. STORIES MODAL */}
      <AnimatePresence>
        {activeModal === 'stories' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900/95 border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[85vh] text-white"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-lg shadow-md">
                    📖
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">قصص لودافيا الكونية</h3>
                    <p className="text-[10px] text-amber-300">مغامرات راي ورفيقه الفضائي</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 overflow-y-auto">
                {STORIES.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-start gap-3 cursor-pointer group"
                    onClick={() => playSynthSound(800, 'sine', 0.08)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                      {st.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white">{st.title}</h4>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {st.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. DAILY REWARDS MODAL */}
      <AnimatePresence>
        {activeModal === 'rewards' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900/95 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex flex-col text-center text-white"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-600 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-pink-500/30">
                🎁
              </div>

              <h3 className="text-base font-black text-white mt-4">المكافأة الكونية اليومية</h3>
              <p className="text-xs text-pink-200 mt-1">
                سجّل حضورك اليومي مع راي ورفيق الفضاء واحصل على 100 نقطة مجانية!
              </p>

              <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 border border-pink-400/40 flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-spin-slow" />
                <span className="text-2xl font-black text-amber-300">+100 نقطة</span>
              </div>

              <button
                onClick={handleClaimDailyReward}
                disabled={hasClaimedDaily}
                className={`py-3 px-6 rounded-2xl font-black text-xs transition-all shadow-lg cursor-pointer ${
                  hasClaimedDaily
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-pink-500/30'
                }`}
              >
                {hasClaimedDaily ? '✅ تم استلام مكافأة اليوم بنجاح!' : 'استلم المكافأة الآن 🚀'}
              </button>

              <button
                onClick={() => setActiveModal(null)}
                className="mt-3 text-xs text-slate-400 hover:text-white py-1 cursor-pointer"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. HELP MODAL */}
      <AnimatePresence>
        {activeModal === 'help' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900/95 border border-purple-500/40 rounded-3xl p-5 shadow-2xl text-white"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span>دليل مسرح Lumo & Ray 3D</span>
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-2.5 text-xs text-purple-200">
                <p>🪐 <strong>المسرح ثلاثي الأبعاد:</strong> شخصية Ray مجسم 3D أصلي (GLB) يتفاعل مع لمس الشاشة وحركة الماوس.</p>
                <p>🐾 <strong>الكلب الفضائي:</strong> رفيق Ray ثلاثي الأبعاد، اضغط عليه ليلعب ويتحمس ويصدر أصواتاً فضائية.</p>
                <p>🎨 <strong>تخصيص المظهر:</strong> اضغط على زر "تخصيص" لاختيار الهالات الكونية والألوان المفضلة لديك.</p>
                <p>💬 <strong>المحادثة الذكية:</strong> اضغط على "تحدث مع راي" لطرح أي سؤال أو الدردشة مع الذكاء الاصطناعي.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
