import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Volume2, 
  VolumeX, 
  Users, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Flame,
  Radio,
  Gamepad2,
  Coins,
  Bot,
  Zap,
  Maximize2,
  Minimize2,
  Tv,
  Activity,
  Smile,
  Send,
  Sliders,
  Shield,
  Clock,
  Gauge
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { GameCardInfo, MiniPlayerProfile } from '../../types/games';
import { INITIAL_MINI_PLAYERS } from '../../data/gamesData';
import GameMiniProfileModal from './GameMiniProfileModal';

interface InGameSocialShellProps {
  game: GameCardInfo;
  onExitGame: () => void;
  playerLevel: number;
  playerCoins: number;
  children: React.ReactNode;
}

interface FloatingEmote {
  id: number;
  emoji: string;
  senderName: string;
  x: number;
}

export default function InGameSocialShell({
  game,
  onExitGame,
  playerLevel,
  playerCoins,
  children
}: InGameSocialShellProps) {
  const { currentUser, lang, playSynthSound } = useApp();
  const isAr = lang === 'ar';

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMiniPlayer, setSelectedMiniPlayer] = useState<MiniPlayerProfile | null>(null);
  const [warpTransition, setWarpTransition] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [crtEffect, setCrtEffect] = useState(false);
  const [graphicsQuality, setGraphicsQuality] = useState<'ultra' | 'lite'>('ultra');
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const [floatingEmotes, setFloatingEmotes] = useState<FloatingEmote[]>([]);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(22);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Warp entry effect
  useEffect(() => {
    if (playSynthSound) {
      playSynthSound(150, 'sawtooth', 0.4);
      setTimeout(() => playSynthSound(440, 'sine', 0.2), 300);
      setTimeout(() => playSynthSound(880, 'sine', 0.3), 600);
    }
    const timer = setTimeout(() => {
      setWarpTransition(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Ping jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(18 + Math.random() * 12));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Background Cosmic Stars Canvas (Optimized for high/low end devices)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const starCount = graphicsQuality === 'ultra' ? 120 : 35;
    const stars: { x: number; y: number; z: number; size: number; color: string; speed: number }[] = [];
    const colors = [game.accentColor || '#38bdf8', '#818cf8', '#c084fc', '#ffffff', '#38bdf8'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: (Math.random() * 0.4 + 0.1) * (graphicsQuality === 'ultra' ? 1 : 0.6)
      });
    }

    let angle = 0;
    const render = () => {
      ctx.fillStyle = '#050711';
      ctx.fillRect(0, 0, width, height);

      // Subtle Nebula glow gradient in the center
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.6);
      grad.addColorStop(0, `${game.accentColor || '#38bdf8'}18`);
      grad.addColorStop(0.5, '#4f46e50c');
      grad.addColorStop(1, '#05071100');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw and move stars
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = graphicsQuality === 'ultra' ? 8 : 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      angle += 0.01;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [graphicsQuality, game.accentColor]);

  // In-Game Live Players (CurrentUser + Teammates/Bots for social immersion)
  const currentInGamePlayers: MiniPlayerProfile[] = [
    {
      id: currentUser?.id || 'me',
      name: currentUser?.name || (isAr ? 'أنت (البطل)' : 'You (Host)'),
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      level: playerLevel,
      xp: 450,
      titleAr: 'قائد الأسطول الكوني',
      titleEn: 'Cosmic Fleet Leader',
      matchesCount: 28,
      winsCount: 19,
      winRate: 68,
      points: playerCoins,
      status: 'in_game' as const,
      currentActivityAr: `يلعب الآن: ${game.titleAr}`,
      currentActivityEn: `Playing: ${game.titleEn}`,
      achievementsCount: 7,
      achievements: ['🚀 طيار لودافيا', '⚡ سريع البديهة', '👑 سيد المجرة'],
      badgeAr: 'Host ★',
      badgeEn: 'Host ★',
      frameBorderColor: '#0EA5E9'
    },
    INITIAL_MINI_PLAYERS['lead_1'] || {
      id: 'lead_1',
      name: 'كابتن سارة 🚀',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      level: 5,
      xp: 820,
      titleAr: 'مكتشفة المجرات',
      titleEn: 'Galaxy Explorer',
      matchesCount: 31,
      winsCount: 22,
      winRate: 71,
      points: 750,
      status: 'in_game',
      currentActivityAr: 'جاهزة للإطلاق',
      currentActivityEn: 'Ready for Launch',
      achievementsCount: 5,
      achievements: ['🌟 نجم لودافيا'],
      badgeAr: 'Ace',
      badgeEn: 'Ace',
      frameBorderColor: '#ec4899'
    },
    INITIAL_MINI_PLAYERS['lead_2'] || {
      id: 'lead_2',
      name: 'فهد المطيري ⚡',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      level: 6,
      xp: 1100,
      titleAr: 'مهندس النبضات',
      titleEn: 'Pulse Engineer',
      matchesCount: 42,
      winsCount: 29,
      winRate: 69,
      points: 920,
      status: 'in_game',
      currentActivityAr: 'يضبط الدروع',
      currentActivityEn: 'Calibrating Shields',
      achievementsCount: 8,
      achievements: ['🛡️ الدرع الفولاذي'],
      badgeAr: 'Pro',
      badgeEn: 'Pro',
      frameBorderColor: '#eab308'
    },
    INITIAL_MINI_PLAYERS['lead_4'] || {
      id: 'lead_4',
      name: 'منى الفضائية 👽',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      level: 4,
      xp: 640,
      titleAr: 'مترجمة الكائنات',
      titleEn: 'Alien Linguist',
      matchesCount: 19,
      winsCount: 13,
      winRate: 68,
      points: 590,
      status: 'in_game',
      currentActivityAr: 'تراقب الرادار',
      currentActivityEn: 'Monitoring Radar',
      achievementsCount: 4,
      achievements: ['👽 صديق الفضائيين'],
      badgeAr: 'Navigator',
      badgeEn: 'Navigator',
      frameBorderColor: '#8b5cf6'
    }
  ].slice(0, game.maxPlayers > 1 ? Math.min(game.maxPlayers, 4) : 1);

  const handlePlayerClick = (player: MiniPlayerProfile) => {
    setSelectedMiniPlayer(player);
    if (playSynthSound) playSynthSound(750, 'sine', 0.08);
  };

  const handleSendEmote = (emoji: string) => {
    const newEmote: FloatingEmote = {
      id: Date.now() + Math.random(),
      emoji,
      senderName: currentUser?.name || (isAr ? 'أنت' : 'You'),
      x: Math.floor(20 + Math.random() * 60)
    };

    setFloatingEmotes((prev) => [...prev.slice(-6), newEmote]);
    setShowEmotePicker(false);

    if (playSynthSound) {
      playSynthSound(900, 'sine', 0.08);
      setTimeout(() => playSynthSound(1200, 'triangle', 0.1), 60);
    }

    // Auto cleanup floating emotes
    setTimeout(() => {
      setFloatingEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
    }, 2800);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 flex flex-col relative overflow-hidden select-none font-sans">
      {/* 1. DYNAMIC COSMIC BACKGROUND CANVAS */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. CRT SCANLINE RETRO GAMING OVERLAY (OPTIONAL TOGGLE) */}
      {crtEffect && (
        <div className="fixed inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
      )}

      {/* 3. CINEMATIC HYPERSPACE WARP TRANSITION */}
      <AnimatePresence>
        {warpTransition && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              animate={{ 
                scale: [1, 2.5, 0.8, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-28 h-28 rounded-full border-4 border-dashed border-cyan-400 flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.8)]"
            >
              <span className="text-4xl">🚀</span>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 text-center space-y-1.5"
            >
              <div className="text-sm font-mono font-black text-cyan-300 tracking-widest uppercase">
                WARPING TO GAME WORLD...
              </div>
              <h2 className="text-2xl font-black text-white">
                {isAr ? game.titleAr : game.titleEn}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TOP SCI-FI COCKPIT HUD BAR */}
      <header className="sticky top-0 z-40 bg-[#070B16]/90 backdrop-blur-2xl border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* LEFT: EXIT WARP GATE & CURRENT GAME STATUS */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                if (playSynthSound) playSynthSound(350, 'sawtooth', 0.1);
                onExitGame();
              }}
              className="px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-rose-950 hover:to-rose-900 text-slate-200 hover:text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border border-white/10 hover:border-rose-500/50 cursor-pointer shadow-lg active:scale-95 group"
              title={isAr ? 'الخروج من عالم اللعبة' : 'Exit Game World'}
            >
              {isAr ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-rose-400" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-rose-400" />}
              <span className="hidden sm:inline font-mono uppercase tracking-wider">{isAr ? 'مغادرة العالم' : 'Exit World'}</span>
            </button>

            {/* GAME BADGE & TELEMETRY */}
            <div className="flex items-center gap-2 border-l rtl:border-r rtl:border-l-0 border-white/10 pl-2.5 rtl:pl-0 rtl:pr-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-md font-bold shrink-0 border"
                style={{ 
                  backgroundColor: `${game.accentColor}25`, 
                  borderColor: `${game.accentColor}80` 
                }}
              >
                🎮
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-black text-white tracking-tight">
                    {isAr ? game.titleAr : game.titleEn}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-mono font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="text-cyan-400 font-bold">⚡ {ping}ms</span>
                  <span className="hidden md:inline">• +{game.xpReward} XP</span>
                  <span className="hidden md:inline">• +{game.pointsReward} 🪙</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: INTERACTIVE IN-GAME SQUAD HUD (CLICKABLE PROFILES) */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-cyan-500/20 px-2.5 sm:px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-inner">
            <div className="text-[10px] font-black text-slate-300 hidden xl:flex items-center gap-1 mr-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'الطاقم النشط:' : 'Squad in Arena:'}</span>
            </div>

            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {currentInGamePlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="relative group cursor-pointer transition-transform hover:scale-115 hover:z-30 active:scale-95"
                  title={`${player.name} (Lv.${player.level}) - ${isAr ? 'انقر لفتح بطاقة اللاعب' : 'Click for Mini Profile'}`}
                >
                  <div 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden p-0.5 shadow-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 border"
                    style={{ borderColor: player.frameBorderColor || '#0EA5E9' }}
                  >
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-full h-full object-cover rounded-[9px] bg-slate-950"
                    />
                  </div>

                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
                  
                  <span className="absolute -top-1.5 -left-1 text-[8px] bg-black/90 text-amber-300 font-mono font-black px-1 rounded border border-amber-400/40 shadow-sm">
                    {player.level}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-400 font-mono ml-1.5 hidden sm:inline">
              {currentInGamePlayers.length}/{game.maxPlayers}
            </span>
          </div>

          {/* RIGHT: IN-GAME QUICK ACTIONS (EMOTES, COINS, HUD SETTINGS) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* QUICK EMOTE LAUNCHER */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowEmotePicker(!showEmotePicker);
                  if (playSynthSound) playSynthSound(500, 'sine', 0.05);
                }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md ${
                  showEmotePicker
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                }`}
                title={isAr ? 'إرسال تعبيرات وتفاعلات حية' : 'Live Emote Reactions'}
              >
                <Smile className="w-4 h-4 text-amber-400" />
              </button>

              {/* EMOTE POPUP MENU */}
              <AnimatePresence>
                {showEmotePicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute right-0 rtl:right-auto rtl:left-0 top-12 z-50 bg-[#0B1222] border border-cyan-500/30 p-2.5 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 w-52 backdrop-blur-xl"
                  >
                    {['🚀', '⚡', '🛡️', '👽', '🔥', '🏆', '😂', '💥'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleSendEmote(emoji)}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-transparent flex items-center justify-center text-xl transition-all cursor-pointer active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PLAYER COINS INDICATOR */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-black shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{playerCoins}</span>
            </div>

            {/* SOUND MUTE/UNMUTE */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shadow-md"
              title={soundEnabled ? (isAr ? 'كتم الصوت' : 'Mute Sound') : (isAr ? 'تشغيل الصوت' : 'Unmute Sound')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            {/* QUICK SETTINGS TOGGLE */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shadow-md"
              title={isAr ? 'إعدادات بيئة اللعبة' : 'Game World Settings'}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </header>

      {/* 5. IN-GAME FLOATING LIVE EMOTES ANIMATION LAYER */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingEmotes.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: window.innerHeight * 0.8, x: `${item.x}vw`, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: window.innerHeight * 0.2, scale: [0.5, 1.4, 1.2, 0.8] }}
            transition={{ duration: 2.6, ease: 'easeOut' }}
            className="absolute flex flex-col items-center gap-1"
          >
            <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
              {item.emoji}
            </div>
            <span className="text-[10px] font-black font-mono bg-black/80 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
              {item.senderName}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 6. GAME WORLD SETTINGS DRAWER */}
      <AnimatePresence>
        {showSettingsDrawer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 right-4 rtl:right-auto rtl:left-4 z-50 w-72 bg-[#0A101D] border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl space-y-3.5 text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-black text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'إعدادات عالم اللعبة' : 'Game World FX'}</span>
              </span>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* GRAPHICS PERFORMANCE (OPTIMIZED FOR LOW-END MOBILE) */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 font-bold">
                {isAr ? 'جودة المؤثرات (دعم الأجهزة الضعيفة):' : 'Graphics & Performance:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGraphicsQuality('ultra')}
                  className={`p-2 rounded-xl font-black transition-all cursor-pointer text-center border ${
                    graphicsQuality === 'ultra'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  ✨ Ultra (60 FPS)
                </button>
                <button
                  onClick={() => setGraphicsQuality('lite')}
                  className={`p-2 rounded-xl font-black transition-all cursor-pointer text-center border ${
                    graphicsQuality === 'lite'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  ⚡ Lite (Mobile)
                </button>
              </div>
            </div>

            {/* CRT RETRO SCANLINES */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAr ? 'تأثير CRT ريترو' : 'Retro CRT Scanlines'}</span>
              </span>
              <button
                onClick={() => setCrtEffect(!crtEffect)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  crtEffect ? 'bg-cyan-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    crtEffect ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* FULLSCREEN TOGGLE */}
            <button
              onClick={toggleFullscreen}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-200 hover:text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? (isAr ? 'الخروج من ملء الشاشة' : 'Exit Fullscreen') : (isAr ? 'وضع ملء الشاشة' : 'Enter Fullscreen')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. MAIN GAMEPLAY WORLD CONTAINER */}
      <main className="flex-1 relative z-10 flex flex-col justify-start">
        {children}
      </main>

      {/* 8. IN-GAME MINI PROFILE CARD OVERLAY (ONE-CLICK WITHOUT LEAVING GAME) */}
      {selectedMiniPlayer && (
        <GameMiniProfileModal
          player={selectedMiniPlayer}
          onClose={() => setSelectedMiniPlayer(null)}
          onInviteToPlay={(player) => {
            handleSendEmote('🚀');
          }}
        />
      )}
    </div>
  );
}

