import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Shield, 
  Zap, 
  Flame, 
  Thermometer, 
  TreePine, 
  Bot, 
  Users, 
  Play, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  Trophy, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Crosshair, 
  Wrench, 
  Radio, 
  Clock, 
  Smile, 
  Crown, 
  Pause, 
  Smartphone, 
  Compass, 
  Share2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PlanetRescueProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

// Player Specialty Roles
interface PlayerRole {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
  abilityAr: string;
  abilityEn: string;
}

// AI Teammates
interface AiBot {
  id: string;
  name: string;
  roleAr: string;
  roleEn: string;
  avatar: string;
  personalityAr: string;
  personalityEn: string;
  status: 'active' | 'repairing' | 'busy';
  currentTaskAr: string;
  quoteAr: string;
}

// Cosmic Emergencies
interface EmergencyEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  type: 'meteor' | 'volcano' | 'alien' | 'ice' | 'heat' | 'blackhole' | 'circuit';
  miniGameType: 'circuit' | 'blaster' | 'sequence' | 'matrix';
  severity: 'low' | 'medium' | 'high';
  timeLimitSeconds: number;
}

// Funny Random Popups
const FUNNY_SPORTS_LOGS_AR = [
  "🐔 كائن فضائي غريب هبط على القارة الشمالية ويطلب شاحن هاتف!",
  "🛸 مركبة فضائية ضاعت وسألت عن طريق المجرّة الزرقاء.",
  "👽 الفضائيون يحاولون التقاط Wi-Fi من محطة الطاقة الكونية!",
  "🐙 وحش فضائي عملاق يطلب بيتزا كوانتية بالجبن!",
  "🚨 تحذير! شخص ما ترك باب المركبة مفتوحاً وانتشرت البرودة!",
  "📡 شخص ما ضغط الزر الأحمر بالخطأ ثم قال: أسف بالخطأ!"
];

const FUNNY_SPORTS_LOGS_EN = [
  "🐔 A quirky alien landed in the north pole asking for a phone charger!",
  "🛸 A lost UFO pulled over to ask for directions to the Blue Galaxy.",
  "👽 Aliens are trying to borrow the planet's cosmic Wi-Fi connection!",
  "🐙 A friendly giant space kraken ordered a quantum cheese pizza!",
  "🚨 Warning! Someone left the starship airlock slightly open!",
  "📡 Someone pressed the emergency red button by accident!"
];

export default function PlanetRescueGame({ onBack, onFinishGame }: PlanetRescueProps) {
  const { lang, playSynthSound } = useApp();

  // Audio Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Screen State: 'menu' | 'role_select' | 'playing' | 'paused' | 'results'
  const [gamePhase, setGamePhase] = useState<'menu' | 'role_select' | 'playing' | 'paused' | 'results'>('menu');

  // Modal Overlay from Menu: null | 'leaderboard' | 'achievements' | 'howToPlay' | 'lobby'
  const [activeModal, setActiveModal] = useState<null | 'leaderboard' | 'achievements' | 'howToPlay' | 'lobby'>(null);

  // Selected Player Role
  const [selectedRole, setSelectedRole] = useState<string>('guard');

  // Active Interactive Mini-Game Overlay
  const [activeMiniGame, setActiveMiniGame] = useState<null | EmergencyEvent>(null);

  // Active Funny Popup Message
  const [funnyPopup, setFunnyPopup] = useState<string | null>(null);

  // Game Stats stored locally
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('lodavia_planet_rescue_stats');
    return saved ? JSON.parse(saved) : {
      missionsPlayed: 0,
      planetsSaved: 0,
      totalXpEarned: 0,
      highRescuePercent: 0
    };
  });

  // GAME DYNAMIC STATE
  const [planetHealth, setPlanetHealth] = useState<number>(100); // 0-100%
  const [planetTemp, setPlanetTemp] = useState<number>(25); // Celsius
  const [planetEnergy, setPlanetEnergy] = useState<number>(100); // 0-100%
  const [planetEnvironment, setPlanetEnvironment] = useState<number>(100); // 0-100%
  const [planetShield, setPlanetShield] = useState<number>(100); // 0-100%
  const [rescueProgress, setRescueProgress] = useState<number>(20); // 0-100%
  const [timeRemaining, setTimeRemaining] = useState<number>(240); // 4 minutes
  const [teamScore, setTeamScore] = useState<number>(0);
  const [activeEvents, setActiveEvents] = useState<EmergencyEvent[]>([]);

  // AI Bots Status
  const [aiBots, setAiBots] = useState<AiBot[]>([
    {
      id: 'bot_nova',
      name: '🤖 Nova',
      roleAr: 'مهندس الطاقة الأัจدل',
      roleEn: 'Quantum Energy Specialist',
      avatar: '🤖',
      personalityAr: 'سريع وذكي جداً في إصلاح الدوائر',
      personalityEn: 'Fast and hyper-intelligent at wiring',
      status: 'active',
      currentTaskAr: 'يصين شبكة الطاقة العامة',
      quoteAr: 'الشبكة جاهزة بإنتاجية 100%!'
    },
    {
      id: 'bot_pixel',
      name: '🤖 Pixel',
      roleAr: 'حامي الغلاف الجوي الكوميدي',
      roleEn: 'Comedic Shield Defender',
      avatar: '👾',
      personalityAr: 'مرح ويصطاد النيازك بسرعة',
      personalityEn: 'Witty and blasts meteors effortlessly',
      status: 'active',
      currentTaskAr: 'يتصدى للنيزك القادم',
      quoteAr: 'لا تقلق! النيزك أصبح غباراً كوانتياً!'
    },
    {
      id: 'bot_orbit',
      name: '🤖 Orbit',
      roleAr: 'خبير المناخ والحرارة',
      roleEn: 'Climate & Thermal Master',
      avatar: '🛰️',
      personalityAr: 'هادئ ومحترف في تبريد الكوكب',
      personalityEn: 'Calm engineer balancing temperature',
      status: 'active',
      currentTaskAr: 'يضبط المبردات الجوية',
      quoteAr: 'درجة حرارة الكوكب تحت السيطرة تماماً.'
    }
  ]);

  // MINI-GAME INTERACTIVE STATES
  // 1. Circuit Wiring: target wire pairs
  const [wireConnections, setWireConnections] = useState<{ red: boolean; blue: boolean; green: boolean }>({
    red: false,
    blue: false,
    green: false
  });

  // 2. Asteroid Blaster: targets list
  const [asteroidsToTarget, setAsteroidsToTarget] = useState<{ id: number; x: number; y: number }[]>([]);

  // 3. Sequence Tapper
  const [sequencePattern, setSequencePattern] = useState<number[]>([]);
  const [playerInputSequence, setPlayerInputSequence] = useState<number[]>([]);

  // Canvas Ref for Spinning 3D Planet
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const planetRotationRef = useRef<number>(0);

  // Audio trigger
  const triggerAudio = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration: number = 0.1) => {
    if (soundEnabled && playSynthSound) {
      playSynthSound(freq, type, duration);
    }
  };

  // Roles List
  const rolesList: PlayerRole[] = [
    {
      id: 'guard',
      nameAr: '🛡️ الحارس الكوني',
      nameEn: '🛡️ Cosmic Guard',
      descAr: 'مسؤول عن تصدي النيازك وتوفير الدرع الكوني للكوكب.',
      descEn: 'Protects the planet with heavy plasma energy shields.',
      icon: 'Shield',
      color: '#06b6d4',
      abilityAr: 'تجديد كامل الدرع كل 45 ثانية',
      abilityEn: 'Full shield regenerate every 45 seconds'
    },
    {
      id: 'engineer',
      nameAr: '⚡ مهندس الطاقة',
      nameEn: '⚡ Energy Engineer',
      descAr: 'متخصص في إصلاح المولدات وتوصيل شبكات الكوانتم السريعة.',
      descEn: 'Specialized in generators and rapid circuit wiring.',
      icon: 'Zap',
      color: '#f59e0b',
      abilityAr: 'مضاعفة إنتاجية الطاقة بنسبة 50%',
      abilityEn: 'Boosts total energy yield by 50%'
    },
    {
      id: 'explorer',
      nameAr: '🚀 المستكشف الكوني',
      nameEn: '🚀 Cosmic Explorer',
      descAr: 'يجلب البلورات النادرة والموارد من الفضاء لحماية البيئة.',
      descEn: 'Gathers rare crystals and environmental resources.',
      icon: 'Globe',
      color: '#10b981',
      abilityAr: 'زيادة سرعة تقدم الإنقاذ بشكل ملحوظ',
      abilityEn: 'Accelerates rescue progress rate'
    },
    {
      id: 'fixer',
      nameAr: '🔧 المصلح الميكانيكي',
      nameEn: '🔧 Mechanical Fixer',
      descAr: 'يصلح الأضرار الهيكلية والحرارية في حالات الطوارئ القصوى.',
      descEn: 'Instantly repairs structural and atmospheric breaches.',
      icon: 'Wrench',
      color: '#a855f7',
      abilityAr: 'ترميم صحة الكوكب فوراً بمقدار +25%',
      abilityEn: 'Instantly restores +25% Planet Health'
    }
  ];

  // Available Emergency Templates
  const emergencyTemplates: EmergencyEvent[] = [
    {
      id: 'ev_meteor',
      titleAr: '☄️ عاصفة نيازك متجهة للكوكب!',
      titleEn: '☄️ Meteor Swarm Heading to Planet!',
      descAr: 'اقترب سرب نيازك ضخم. قم بالتصويب السريع لتدمير النيازك قبل الاصطدام!',
      descEn: 'A cluster of asteroids is falling. Tap to blast them out of orbit!',
      icon: 'Crosshair',
      type: 'meteor',
      miniGameType: 'blaster',
      severity: 'high',
      timeLimitSeconds: 12
    },
    {
      id: 'ev_volcano',
      titleAr: '🌋 ثوران بركاني وارتفاع الحرارة!',
      titleEn: '🌋 Volcanic Surge & Overheating!',
      descAr: 'ارتفعت درجة حرارة الكوكب إلى 75°C! قم بتوصيل أسلاك مبردات الكوانتم!',
      descEn: 'Planet temperature spiked to 75°C! Connect the cooling circuits!',
      icon: 'Thermometer',
      type: 'volcano',
      miniGameType: 'circuit',
      severity: 'medium',
      timeLimitSeconds: 15
    },
    {
      id: 'ev_alien',
      titleAr: '👽 غزو أطباق طائرة فضائية!',
      titleEn: '👽 Alien Saucer Incursion!',
      descAr: 'أطباق طائرة تستنزف طاقة الدرع! أدخل تسلسل رموز الدفاع البيولوجي!',
      descEn: 'Alien ships draining shields! Enter the defense sequence code!',
      icon: 'Radio',
      type: 'alien',
      miniGameType: 'sequence',
      severity: 'high',
      timeLimitSeconds: 10
    },
    {
      id: 'ev_blackhole',
      titleAr: '🌀 ثقب أسود يبث اضطرابات جاذبية!',
      titleEn: '🌀 Gravitational Black Hole Breach!',
      descAr: 'اضبط مصفوفة الطاقة والموازنة لمنع انكماش الغلاف الجوي!',
      descEn: 'Balance the quantum matrix nodes to stabilize planetary gravity!',
      icon: 'Sparkles',
      type: 'blackhole',
      miniGameType: 'matrix',
      severity: 'high',
      timeLimitSeconds: 14
    }
  ];

  // Start Rescue Mission
  const startMission = () => {
    setGamePhase('playing');
    setPlanetHealth(100);
    setPlanetTemp(25);
    setPlanetEnergy(100);
    setPlanetEnvironment(100);
    setPlanetShield(100);
    setRescueProgress(20);
    setTimeRemaining(210); // 3 min 30 sec
    setTeamScore(0);
    setActiveEvents([]);
    setActiveMiniGame(null);

    triggerAudio(523, 'sine', 0.2);
  };

  // Main Game Loop Timer (1 sec tick)
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameInterval = setInterval(() => {
      // 1. Advance Time
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(gameInterval);
          finishMission(false);
          return 0;
        }
        return prev - 1;
      });

      // 2. Dynamic Progress
      setRescueProgress(prev => {
        const next = prev + 0.35;
        if (next >= 100) {
          clearInterval(gameInterval);
          finishMission(true);
          return 100;
        }
        return next;
      });

      // 3. AI Teammates Autonomous Work & Humor
      if (Math.random() < 0.25) {
        const botIndex = Math.floor(Math.random() * aiBots.length);
        const bot = aiBots[botIndex];
        setTeamScore(s => s + 50);

        // Random Funny Quote
        if (Math.random() < 0.3) {
          const funnyList = lang === 'ar' ? FUNNY_SPORTS_LOGS_AR : FUNNY_SPORTS_LOGS_EN;
          const randomText = funnyList[Math.floor(Math.random() * funnyList.length)];
          setFunnyPopup(randomText);
          setTimeout(() => setFunnyPopup(null), 4000);
        }
      }

      // 4. Random Emergency Spawn (Every 18 seconds)
      if (Math.random() < 0.12 && activeEvents.length === 0) {
        const template = emergencyTemplates[Math.floor(Math.random() * emergencyTemplates.length)];
        setActiveEvents([template]);
        triggerAudio(300, 'sawtooth', 0.25);
      }

      // 5. Degrade Stats if untreated events exist
      if (activeEvents.length > 0) {
        setPlanetHealth(h => Math.max(0, h - 1.5));
        setPlanetShield(s => Math.max(0, s - 2.0));
        setPlanetTemp(t => Math.min(90, t + 1));
      } else {
        // Slow natural healing
        setPlanetHealth(h => Math.min(100, h + 0.2));
        setPlanetTemp(t => Math.max(22, t - 0.5));
      }
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [gamePhase, activeEvents, lang]);

  // Finish Mission
  const finishMission = (victory: boolean) => {
    setGamePhase('results');
    const finalScore = teamScore + Math.floor(rescueProgress * 50) + (victory ? 1000 : 200);
    const xp = Math.floor(finalScore / 10) + (victory ? 200 : 50);
    const coins = Math.floor(finalScore / 20) + (victory ? 100 : 30);

    const updated = {
      missionsPlayed: stats.missionsPlayed + 1,
      planetsSaved: victory ? stats.planetsSaved + 1 : stats.planetsSaved,
      totalXpEarned: stats.totalXpEarned + xp,
      highRescuePercent: Math.max(stats.highRescuePercent, Math.floor(rescueProgress))
    };
    setStats(updated);
    localStorage.setItem('lodavia_planet_rescue_stats', JSON.stringify(updated));

    onFinishGame(xp, coins, victory);

    triggerAudio(600, 'sine', 0.2);
    setTimeout(() => triggerAudio(800, 'sine', 0.3), 200);
  };

  // Launch Interactive Mini-Game
  const launchMiniGame = (event: EmergencyEvent) => {
    setActiveMiniGame(event);
    if (event.miniGameType === 'circuit') {
      setWireConnections({ red: false, blue: false, green: false });
    } else if (event.miniGameType === 'blaster') {
      // Spawn 4 random targets
      setAsteroidsToTarget([
        { id: 1, x: 20 + Math.random() * 60, y: 20 + Math.random() * 50 },
        { id: 2, x: 20 + Math.random() * 60, y: 20 + Math.random() * 50 },
        { id: 3, x: 20 + Math.random() * 60, y: 20 + Math.random() * 50 }
      ]);
    } else if (event.miniGameType === 'sequence') {
      setSequencePattern([1, 3, 2, 4]);
      setPlayerInputSequence([]);
    }
  };

  // Handle Mini-Game Success
  const handleMiniGameSolve = () => {
    setActiveMiniGame(null);
    setActiveEvents([]);
    setPlanetHealth(h => Math.min(100, h + 20));
    setPlanetShield(s => Math.min(100, s + 30));
    setPlanetTemp(25);
    setTeamScore(s => s + 500);

    triggerAudio(1000, 'sine', 0.25);
    setFunnyPopup(lang === 'ar' ? '🎉 تم إطفاء الكارثة بنجاح واستقرار الكوكب!' : '🎉 Cosmic emergency resolved! Planet stabilized!');
    setTimeout(() => setFunnyPopup(null), 3000);
  };

  // 3D PLANET RENDERING (Canvas Animation Loop)
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderPlanet = () => {
      planetRotationRef.current += 0.005;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 110;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmosphere Glow Ring
      const atmosGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.3);
      atmosGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      atmosGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.2)');
      atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Planet Sphere Base
      const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 10, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#0284c7');
      sphereGrad.addColorStop(0.5, '#0f766e');
      sphereGrad.addColorStop(1, '#030712');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Continents / Landmasses (Rotating)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
      const rot = planetRotationRef.current;

      for (let i = -1; i <= 2; i++) {
        const lx = centerX + Math.sin(rot + i * 1.8) * radius * 0.8;
        const ly = centerY + Math.cos(rot * 0.7 + i) * radius * 0.5;
        ctx.beginPath();
        ctx.arc(lx, ly, 35, 0, Math.PI * 2);
        ctx.fill();
      }

      // City Lights
      ctx.fillStyle = '#fde047';
      for (let j = 0; j < 8; j++) {
        const cx = centerX + Math.sin(rot * 1.5 + j) * radius * 0.7;
        const cy = centerY + Math.cos(rot + j * 0.9) * radius * 0.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 4. Planet Shield Barrier (if active)
      if (planetShield > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${planetShield / 100})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Orbiting Satellites
      const satX = centerX + Math.cos(rot * 2) * (radius + 25);
      const satY = centerY + Math.sin(rot * 2) * (radius + 25);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(renderPlanet);
    };

    renderPlanet();

    return () => cancelAnimationFrame(animId);
  }, [gamePhase, planetShield]);

  return (
    <div className="relative w-full min-h-[620px] rounded-3xl bg-[#030208] text-white border border-teal-500/30 overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      
      {/* ======================================================== */}
      {/* 1. START MENU SCREEN (شاشة بداية إنقاذ الكوكب) */}
      {/* ======================================================== */}
      {gamePhase === 'menu' && (
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between min-h-[600px] bg-gradient-to-b from-teal-950/40 via-slate-950/80 to-black">
          
          {/* HEADER BAR */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'العودة إلى ألعاب لودافيا' : 'Back to Games'}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-black/60 border border-teal-500/30 rounded-2xl text-xs font-mono font-bold text-teal-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? `الكواكب المنقذة: ${stats.planetsSaved}` : `Saved: ${stats.planetsSaved}`}</span>
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-slate-900 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* CINEMATIC TITLE & STORY DESCR */}
          <div className="my-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/20 border border-teal-400/40 rounded-full text-xs font-mono font-black text-teal-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>PLANET RESCUE • CO-OP SPACE OPERATION</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              🌍🚀 إنقاذ الكوكب
            </h1>

            <div className="p-4 bg-slate-900/60 border border-teal-500/20 rounded-2xl max-w-lg mx-auto backdrop-blur-md">
              <p className="text-xs md:text-sm text-emerald-200 font-bold leading-relaxed">
                {lang === 'ar' 
                  ? 'الكوكب في خطر... والوقت ينفد! هل تستطيع أنت وفريقك من المساعدين الأذكياء إنقاذه من الكوارث الكونية؟' 
                  : 'The planet is in grave danger and time is ticking! Can you and your AI squad save it before time runs out?'}
              </p>
            </div>
          </div>

          {/* MAIN START ACTIONS & MODALS */}
          <div className="max-w-2xl mx-auto w-full space-y-4">
            {/* BIG MISSION START BUTTON */}
            <button
              onClick={() => setGamePhase('role_select')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>{lang === 'ar' ? 'ابدأ المهمة الآن 🚀' : 'Start Mission Now 🚀'}</span>
            </button>

            {/* BUTTONS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <button
                onClick={() => setGamePhase('role_select')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-teal-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bot className="w-5 h-5 text-teal-400" />
                <span>{lang === 'ar' ? 'مع الذكاء الاصطناعي' : 'Play with AI'}</span>
              </button>

              <button
                onClick={() => setActiveModal('lobby')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Users className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'مع الأصدقاء' : 'Co-op Squad'}</span>
              </button>

              <button
                onClick={() => setActiveModal('leaderboard')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{lang === 'ar' ? 'المتصدرون' : 'Leaderboard'}</span>
              </button>

              <button
                onClick={() => setActiveModal('howToPlay')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-emerald-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'ar' ? 'كيفية اللعب' : 'How to Play'}</span>
              </button>
            </div>
          </div>

          {/* BOTTOM PLAYER STATS RIBBON */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-around text-center text-xs text-slate-300">
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'المهمات المكتملة' : 'Missions'}</p>
              <p className="font-mono font-bold text-teal-300">{stats.missionsPlayed}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'نسبة الإنقاذ القياسية' : 'Best Rescue %'}</p>
              <p className="font-mono font-bold text-emerald-300">{stats.highRescuePercent}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'نقاط الخبرة' : 'Total XP'}</p>
              <p className="font-mono font-bold text-cyan-300">+{stats.totalXpEarned}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ROLE SELECTION SCREEN (اختيار الدور القيادي) */}
      {/* ======================================================== */}
      {gamePhase === 'role_select' && (
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between min-h-[600px] bg-gradient-to-b from-slate-950 via-teal-950/60 to-black">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              🛠️ {lang === 'ar' ? 'اختر دورك الكوني في الفريق' : 'Select Your Specialist Role'}
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'ar' ? 'لكل دور قدرات خاصة تساعد الفريق في إخماد الطوارئ بسرعة' : 'Each role brings unique abilities to save the planet'}
            </p>
          </div>

          {/* ROLES SELECTION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6 max-w-2xl mx-auto w-full">
            {rolesList.map(role => {
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-teal-900/60 border-teal-400 ring-2 ring-teal-400/50 shadow-xl' 
                      : 'bg-slate-900/80 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="p-3 bg-slate-800 rounded-xl text-2xl">
                    {role.id === 'guard' ? '🛡️' : role.id === 'engineer' ? '⚡' : role.id === 'explorer' ? '🚀' : '🔧'}
                  </div>
                  <div className="space-y-1 text-right rtl:text-right ltr:text-left flex-1">
                    <h3 className="text-sm font-black text-white">{lang === 'ar' ? role.nameAr : role.nameEn}</h3>
                    <p className="text-xs text-slate-300">{lang === 'ar' ? role.descAr : role.descEn}</p>
                    <span className="inline-block px-2.5 py-0.5 bg-black/40 border border-teal-400/30 rounded-lg text-[10px] font-mono text-teal-300">
                      ✨ {lang === 'ar' ? role.abilityAr : role.abilityEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TEAMMATES SQUAD PREVIEW */}
          <div className="p-4 bg-slate-900/90 border border-white/10 rounded-2xl max-w-2xl mx-auto w-full text-center space-y-2">
            <p className="text-xs font-bold text-slate-300">{lang === 'ar' ? 'فريق الذكاء الاصطناعي المساعد:' : 'Your AI Squad:'}</p>
            <div className="flex items-center justify-around gap-2 text-xs font-mono">
              {aiBots.map(bot => (
                <span key={bot.id} className="px-3 py-1 bg-black/50 border border-teal-500/30 rounded-xl text-teal-300">
                  {bot.avatar} {bot.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setGamePhase('menu')}
              className="px-6 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={startMission}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-400 cursor-pointer"
            >
              {lang === 'ar' ? 'تأكيد ودخول المهمة 🚀' : 'Confirm & Launch 🚀'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LIVE RESCUE GAMEPLAY STAGE (طريقة اللعب) */}
      {/* ======================================================== */}
      {(gamePhase === 'playing' || gamePhase === 'paused') && (
        <div className="relative w-full min-h-[620px] bg-slate-950 overflow-hidden flex flex-col justify-between p-4">
          
          {/* TOP HUD STATUS RIBBON */}
          <div className="relative z-20 flex items-center justify-between gap-2 bg-slate-900/90 border border-teal-500/30 p-3 rounded-2xl backdrop-blur-md">
            
            {/* TIMER & SCORE */}
            <div className="flex items-center gap-3 font-mono font-bold text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-teal-400/40 rounded-xl text-teal-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-amber-400/40 rounded-xl text-amber-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{teamScore} PTS</span>
              </div>
            </div>

            {/* RESCUE PROGRESS BAR */}
            <div className="flex-1 max-w-xs mx-2">
              <div className="flex justify-between text-[10px] text-emerald-300 font-mono font-bold mb-1">
                <span>🌍 {lang === 'ar' ? 'إنقاذ الكوكب' : 'Rescue Progress'}</span>
                <span>{Math.floor(rescueProgress)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, rescueProgress)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setGamePhase('paused')}
              className="p-2 bg-slate-800 border border-white/20 rounded-xl text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* CENTER STAGE: 3D PLANET & METERS */}
          <div className="relative z-10 my-4 flex flex-col md:flex-row items-center justify-around gap-6">
            
            {/* LEFT METERS PANEL */}
            <div className="w-full md:w-48 space-y-2.5 bg-slate-900/80 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-rose-300 font-bold">
                  <span>❤️ {lang === 'ar' ? 'صحة الكوكب' : 'Health'}</span>
                  <span>{Math.floor(planetHealth)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${planetHealth}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-amber-300 font-bold">
                  <span>🌡️ {lang === 'ar' ? 'درجة الحرارة' : 'Temp'}</span>
                  <span>{Math.floor(planetTemp)}°C</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, planetTemp * 1.2)}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-cyan-300 font-bold">
                  <span>🛡️ {lang === 'ar' ? 'الدرع الدفاعي' : 'Shield'}</span>
                  <span>{Math.floor(planetShield)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${planetShield}%` }} />
                </div>
              </div>
            </div>

            {/* CENTER CANVAS SPINNING PLANET */}
            <div className="relative flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="w-[280px] h-[280px] object-contain"
              />

              {/* ACTIVE EMERGENCY WARNING BADGE ON PLANET */}
              {activeEvents.length > 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <button
                    onClick={() => launchMiniGame(activeEvents[0])}
                    className="p-4 bg-rose-600/90 hover:bg-rose-500 text-white font-black text-xs rounded-2xl shadow-2xl border border-rose-300 animate-bounce cursor-pointer flex flex-col items-center gap-1"
                  >
                    <AlertTriangle className="w-6 h-6 text-amber-300 animate-pulse" />
                    <span>{lang === 'ar' ? activeEvents[0].titleAr : activeEvents[0].titleEn}</span>
                    <span className="text-[10px] text-amber-200 underline">{lang === 'ar' ? 'اضغط لإبطال الكارثة فوراً!' : 'Tap to Resolve Emergency!'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT AI SQUAD LOGS */}
            <div className="w-full md:w-56 space-y-2 bg-slate-900/80 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
              <p className="text-[11px] font-bold text-teal-300 border-b border-white/10 pb-1">🤖 {lang === 'ar' ? 'نشاط المساعدين:' : 'AI Squad Activity:'}</p>
              <div className="space-y-1.5 text-[10px]">
                {aiBots.map(bot => (
                  <div key={bot.id} className="p-1.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="font-bold text-teal-200">{bot.name}</span>
                    <span className="text-slate-400">{bot.quoteAr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FUNNY RANDOM POPUP TICKER */}
          <AnimatePresence>
            {funnyPopup && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="relative z-30 p-3 bg-gradient-to-r from-purple-900/90 to-teal-900/90 border border-purple-400/40 rounded-2xl text-center text-xs font-bold text-purple-200 shadow-xl max-w-lg mx-auto w-full"
              >
                <span>{funnyPopup}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. INTERACTIVE MINI-GAME OVERLAY (الألعاب المصغرة) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeMiniGame && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-slate-900 border border-teal-500/40 p-6 rounded-3xl text-center space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-black text-amber-300">
                  {lang === 'ar' ? activeMiniGame.titleAr : activeMiniGame.titleEn}
                </h3>
                <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-mono rounded-lg">
                  🚨 طوارئ
                </span>
              </div>

              {/* MINI-GAME 1: CIRCUIT WIRING */}
              {activeMiniGame.miniGameType === 'circuit' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    {lang === 'ar' ? 'اضغط على الأسلاك لتطابق التوصيل وتبريد الكوكب:' : 'Tap matching buttons to re-connect wires:'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setWireConnections(w => ({ ...w, red: true }))}
                      className={`p-4 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                        wireConnections.red ? 'bg-emerald-600 text-white' : 'bg-rose-900/60 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      🔴 {wireConnections.red ? 'متصل' : 'سلك أحمر'}
                    </button>

                    <button
                      onClick={() => setWireConnections(w => ({ ...w, blue: true }))}
                      className={`p-4 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                        wireConnections.blue ? 'bg-emerald-600 text-white' : 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      🔵 {wireConnections.blue ? 'متصل' : 'سلك أزرق'}
                    </button>

                    <button
                      onClick={() => setWireConnections(w => ({ ...w, green: true }))}
                      className={`p-4 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                        wireConnections.green ? 'bg-emerald-600 text-white' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      🟢 {wireConnections.green ? 'متصل' : 'سلك أخضر'}
                    </button>
                  </div>

                  {wireConnections.red && wireConnections.blue && wireConnections.green && (
                    <button
                      onClick={handleMiniGameSolve}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl cursor-pointer"
                    >
                      {lang === 'ar' ? 'تأكيد الإصلاح ▶️' : 'Confirm Repair ▶️'}
                    </button>
                  )}
                </div>
              )}

              {/* MINI-GAME 2: ASTEROID BLASTER */}
              {activeMiniGame.miniGameType === 'blaster' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    {lang === 'ar' ? 'اضغط على النيازك لتفجيرها قبل أن تصطدم بالسطح!' : 'Tap all meteors to blast them before impact!'}
                  </p>
                  <div className="relative w-full h-48 bg-black/60 border border-white/10 rounded-2xl overflow-hidden">
                    {asteroidsToTarget.map(ast => (
                      <button
                        key={ast.id}
                        onClick={() => {
                          setAsteroidsToTarget(list => list.filter(a => a.id !== ast.id));
                          triggerAudio(800, 'sine', 0.1);
                        }}
                        style={{ left: `${ast.x}%`, top: `${ast.y}%` }}
                        className="absolute w-10 h-10 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center text-lg animate-ping cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      >
                        ☄️
                      </button>
                    ))}
                    {asteroidsToTarget.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handleMiniGameSolve}
                          className="px-6 py-3 bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer"
                        >
                          {lang === 'ar' ? 'تم تدمير النيازك! ▶️' : 'Meteors Blasted! ▶️'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MINI-GAME 3: SEQUENCE ALIGNMENT */}
              {activeMiniGame.miniGameType === 'sequence' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    {lang === 'ar' ? 'أدخل الرموز بالترتيب [1 - 3 - 2 - 4]:' : 'Enter symbols in order [1 - 3 - 2 - 4]:'}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          const next = [...playerInputSequence, num];
                          setPlayerInputSequence(next);
                          if (next.join('') === '1324') {
                            handleMiniGameSolve();
                          } else if (next.length >= 4) {
                            setPlayerInputSequence([]);
                          }
                        }}
                        className="p-4 bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-lg rounded-2xl cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-teal-300 font-mono">
                    {lang === 'ar' ? `الترتيب الحالي: ${playerInputSequence.join(' - ')}` : `Current: ${playerInputSequence.join(' - ')}`}
                  </p>
                </div>
              )}

              <button
                onClick={() => setActiveMiniGame(null)}
                className="text-xs text-slate-400 underline hover:text-white cursor-pointer"
              >
                {lang === 'ar' ? 'تخطي والطوارئ مستمرة' : 'Cancel'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAUSED MODAL */}
      <AnimatePresence>
        {gamePhase === 'paused' && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-teal-500/30 p-6 rounded-3xl text-center space-y-6">
              <h2 className="text-2xl font-black text-white">⏸️ {lang === 'ar' ? 'المهمة متوقفة مؤقتاً' : 'Mission Paused'}</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setGamePhase('playing')}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl cursor-pointer"
                >
                  {lang === 'ar' ? 'استئناف المهمة ▶️' : 'Resume Mission ▶️'}
                </button>
                <button
                  onClick={() => setGamePhase('menu')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
                >
                  {lang === 'ar' ? 'العودة للقائمة الرئيسية 🏠' : 'Return to Menu 🏠'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 5. RESULTS SCREEN (شاشة نتائج المهمة) */}
      {/* ======================================================== */}
      {gamePhase === 'results' && (
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between min-h-[600px] bg-gradient-to-b from-teal-950/80 via-slate-950 to-black text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="inline-block p-4 bg-teal-600/20 border border-teal-400/30 rounded-full text-emerald-400 shadow-2xl">
              <Globe className="w-12 h-12 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white">
              🎉 {rescueProgress >= 80 ? (lang === 'ar' ? 'تم إنقاذ الكوكب بنجاح!' : 'Planet Saved!') : (lang === 'ar' ? 'انتهت المهمة!' : 'Mission Concluded!')}
            </h2>

            <p className="text-xs text-slate-300">
              {lang === 'ar' ? 'تعاون فريقك بنجاح للتصدي للكوارث والوقوف في وجه المخاطر الكونية!' : 'Your squad worked together to save the realm!'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md mx-auto w-full">
            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'نسبة الإنقاذ' : 'Rescue Rate'}</p>
              <p className="text-xl font-mono font-black text-emerald-300">{Math.floor(rescueProgress)}%</p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'نقاط الفريق' : 'Team Score'}</p>
              <p className="text-xl font-mono font-black text-amber-300">{teamScore}</p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl col-span-2 md:col-span-1">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'المكافآت' : 'Rewards'}</p>
              <p className="text-xl font-mono font-black text-cyan-300">+{Math.floor(teamScore / 10)} XP</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
            <button
              onClick={() => setGamePhase('role_select')}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إعادة المهمة' : 'Replay Mission'}</span>
            </button>

            <button
              onClick={() => setGamePhase('menu')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'ar' ? 'العودة للألعاب' : 'Return to Games'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. EXTRA MODALS (HOW TO PLAY, LOBBY, LEADERBOARD) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-slate-900 border border-teal-500/30 p-6 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-black text-white">
                  {activeModal === 'howToPlay' 
                    ? (lang === 'ar' ? '❓ كيفية لعب إنقاذ الكوكب' : '❓ How to Play')
                    : activeModal === 'lobby' 
                    ? (lang === 'ar' ? '👥 وضع الفريق المباشر' : '👥 Co-op Squad Room')
                    : (lang === 'ar' ? '🏆 المتصدرون' : '🏆 Leaderboard')}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {activeModal === 'howToPlay' && (
                <div className="space-y-3 text-xs text-slate-300 rtl:text-right ltr:text-left leading-relaxed">
                  <p>1. 🛡️ اختر دورك القيادي الحاسم (حارس، مهندس، مستكشف، أو مصلح).</p>
                  <p>2. 🌍 راقب مؤشرات الكوكب (الصحة، الحرارة، الطاقة، البيئة، الدرع).</p>
                  <p>3. 🚨 عند ظهور طوارئ كوارثية مثل عواصف النيازك، اضغط فوراً لإنجاز الميني جيم.</p>
                  <p>4. 🤖 يرافقك ذكاء اصطناعي مساعد (Nova, Pixel, Orbit) يقدم دعماً مستمراً.</p>
                  <p>5. 🎉 احصل على أعلى نسبة إنقاذ قبل انتهاء الوقت لتسجيل أرقام قياسية!</p>
                </div>
              )}

              {activeModal === 'lobby' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-300">
                    {lang === 'ar' ? 'رمز غرفة الفريق الخاصة بك:' : 'Your Private Squad Code:'}
                  </p>
                  <div className="p-4 bg-black/60 border border-teal-400/40 rounded-2xl font-mono text-xl font-bold text-teal-300 tracking-widest">
                    RESCUE-7782
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'شارك الرمز مع أصدقائك أو ابدأ المهمة مباشرة مع البوتات الأذكياء' : 'Share code with friends or launch directly with AI bots'}
                  </p>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setGamePhase('role_select');
                    }}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl cursor-pointer"
                  >
                    {lang === 'ar' ? 'بدء اللعب مع الذكاء الاصطناعي الآن ▶️' : 'Play with AI Now ▶️'}
                  </button>
                </div>
              )}

              {activeModal === 'leaderboard' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between font-mono">
                    <span>🥇 Captain Nova</span>
                    <span className="text-amber-300">100% Rescue</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between font-mono">
                    <span>🥈 Star Commander</span>
                    <span className="text-cyan-300">96% Rescue</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between font-mono">
                    <span>🥉 You (Lodavia Hero)</span>
                    <span className="text-emerald-300">{stats.highRescuePercent}% Rescue</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
