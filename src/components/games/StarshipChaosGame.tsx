import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Flame, 
  Zap, 
  Compass, 
  Radio, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Users, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  Bot, 
  HelpCircle,
  Activity,
  Wind,
  Layers,
  Sliders,
  Target,
  Shield,
  Crosshair,
  Maximize2,
  Minimize2,
  Gauge,
  Swords,
  ChevronLeft,
  ChevronRight,
  Radar
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import GameMiniProfileModal from './GameMiniProfileModal';
import { MiniPlayerProfile } from '../../types/games';

// SMOOTH ANIMATED NUMBER COMPONENT (Continuous count-up / count-down interpolation)
function AnimatedNumber({ 
  value, 
  formatter, 
  duration = 380 
}: { 
  value: number; 
  formatter?: (v: number) => string; 
  duration?: number 
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    if (startVal === endVal) return;

    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
      }
    };

    frameRef.current = requestAnimationFrame(update);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const rounded = Math.round(displayValue);
  return <span>{formatter ? formatter(rounded) : rounded.toLocaleString()}</span>;
}

interface StarshipChaosProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

type StationType = 'steering' | 'engines' | 'power' | 'navigation' | 'comms' | 'repairs';
type DifficultyLevel = 'easy' | 'normal' | 'hardcore';

interface CrewMember {
  id: string;
  name: string;
  avatar: string;
  role: StationType;
  level: number;
  xp: number;
  isBot: boolean;
  status: 'ok' | 'busy' | 'panicked';
  titleAr: string;
  titleEn: string;
  x: number; // Screen relative percentage for in-world placement
  y: number;
}

interface ChaosEvent {
  id: string;
  type: 'overheat' | 'zero_gravity' | 'alien' | 'meteor' | 'spin' | 'false_alarm' | 'hull_breach';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  stationTarget: StationType;
  resolved: boolean;
  timeLeft: number; // seconds
}

interface FloatingParticle {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface SpaceCollectible {
  id: number;
  type: 'plasma' | 'repair' | 'speed';
  x: number; // 0 to 100
  y: number; // 0 to 100
  speed: number;
  size: number;
}

interface FlightLogItem {
  id: string;
  text: string;
  time: string;
  type: 'alert' | 'success' | 'info';
}

export default function StarshipChaosGame({ onBack, onFinishGame }: StarshipChaosProps) {
  const { currentUser, lang, playSynthSound } = useApp();
  const isAr = lang === 'ar';

  // Sound Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game Phases: 'setup' | 'countdown' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'setup' | 'countdown' | 'playing' | 'gameover'>('setup');
  const [countdownNum, setCountdownNum] = useState<number | string>(3);

  // Setup Options
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [crewCount, setCrewCount] = useState<number>(4);
  const [playerStation, setPlayerStation] = useState<StationType>('steering');
  const [roomCode, setRoomCode] = useState<string>('LODA-' + Math.floor(1000 + Math.random() * 9000));
  const [copiedCode, setCopiedCode] = useState(false);

  // Flight Telemetry
  const [distanceRemaining, setDistanceRemaining] = useState<number>(10000); // km
  const [timeRemaining, setTimeRemaining] = useState<number>(240); // seconds
  const [totalTime, setTotalTime] = useState<number>(240);
  const [hullIntegrity, setHullIntegrity] = useState<number>(100);
  const [shipSpeed, setShipSpeed] = useState<number>(45); // km/s base
  const [score, setScore] = useState<number>(0);

  // Station States & Mini-game metrics
  const [targetCourse, setTargetCourse] = useState<number>(180);
  const [currentCourse, setCurrentCourse] = useState<number>(180);
  const [engineHeat, setEngineHeat] = useState<number>(25);
  const [engineThrottle, setEngineThrottle] = useState<number>(80);
  const [powerShields, setPowerShields] = useState<number>(40);
  const [laserCooldown, setLaserCooldown] = useState<number>(0);

  // Active Events & Status
  const [activeEvents, setActiveEvents] = useState<ChaosEvent[]>([]);
  const [zeroGravityActive, setZeroGravityActive] = useState<boolean>(false);
  const [alienInCabin, setAlienInCabin] = useState<{ x: number; y: number; health: number } | null>(null);
  const [spinOutActive, setSpinOutActive] = useState<boolean>(false);
  const [hullBreaches, setHullBreaches] = useState<{ id: number; x: number; y: number }[]>([]);
  const [collectibles, setCollectibles] = useState<SpaceCollectible[]>([]);
  const [floatingFeedbacks, setFloatingFeedbacks] = useState<FloatingParticle[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [panelShake, setPanelShake] = useState(false);
  const [targetLockCelebration, setTargetLockCelebration] = useState(false);
  const [flightLogs, setFlightLogs] = useState<FlightLogItem[]>([
    { id: '1', text: '🚀 محركات الدفع الكوانتي تعمل بكفاءة', time: '00:00', type: 'info' }
  ]);

  // Crew Teammates & Selected Mini Profile
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [selectedMiniPlayer, setSelectedMiniPlayer] = useState<MiniPlayerProfile | null>(null);
  const [activeTabControl, setActiveTabControl] = useState<'helm' | 'engines' | 'defense' | 'repairs'>('helm');

  // Victory / Loss State
  const [gameResult, setGameResult] = useState<{
    won: boolean;
    reasonAr: string;
    reasonEn: string;
    eventsResolvedCount: number;
    xpEarned: number;
    pointsEarned: number;
  } | null>(null);

  // Canvas Refs & Game Loops
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Push new flight log with sliding entry
  const addFlightLog = (text: string, type: FlightLogItem['type'] = 'info') => {
    const min = Math.floor((totalTime - timeRemaining) / 60);
    const sec = (totalTime - timeRemaining) % 60;
    const timeStr = `${min}:${sec.toString().padStart(2, '0')}`;
    const newLog: FlightLogItem = {
      id: Math.random().toString(),
      text,
      time: timeStr,
      type
    };
    setFlightLogs(prev => [newLog, ...prev.slice(0, 4)]);
  };

  // Sound play helper
  const triggerSound = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration: number = 0.1) => {
    if (soundEnabled && playSynthSound) {
      playSynthSound(freq, type, duration);
    }
  };

  // Spawn visual floating particle feedback (+50 XP, Boosted, etc.)
  const spawnFeedback = (text: string, x: number, y: number, color: string = '#38bdf8') => {
    const newFb: FloatingParticle = {
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color
    };
    setFloatingFeedbacks(prev => [...prev.slice(-6), newFb]);
    setTimeout(() => {
      setFloatingFeedbacks(prev => prev.filter(fb => fb.id !== newFb.id));
    }, 1800);
  };

  // Shake screen effect upon impact
  const triggerScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  // Subtle tactile shake for the control panel (2-3px)
  const triggerPanelShake = () => {
    setPanelShake(true);
    setTimeout(() => setPanelShake(false), 160);
  };

  // Steer with smooth rotation, tactile feedback, and target proximity checks
  const handleSteer = (delta: number) => {
    triggerPanelShake();
    triggerSound(520 + (delta > 0 ? 50 : -50), 'sine', 0.07);

    setCurrentCourse(prev => {
      const next = (prev + delta + 360) % 360;
      const diff = Math.abs(next - targetCourse);
      const normalizedDiff = Math.min(diff, 360 - diff);

      // Near Target (< 5°)
      if (normalizedDiff <= 5 && normalizedDiff > 0) {
        triggerSound(720, 'sine', 0.08);
      }

      // Exact Target Lock (0°)
      if (normalizedDiff === 0) {
        setTargetLockCelebration(true);
        triggerSound(880, 'triangle', 0.2);
        setTimeout(() => triggerSound(1100, 'sine', 0.25), 100);
        spawnFeedback(isAr ? '🎯 تم قفل المسار بنجاح 100%!' : '🎯 BEARING 100% LOCKED!', window.innerWidth / 2, window.innerHeight * 0.65, '#10b981');
        setTimeout(() => setTargetLockCelebration(false), 1200);
        addFlightLog(isAr ? `🎯 تم محاذاة الدفة بدقة مع ${targetCourse}°` : `🎯 Bearing aligned to ${targetCourse}°`, 'success');
      }

      return next;
    });
  };

  // Initialize Crew Members
  const initializeCrew = () => {
    const roles: StationType[] = ['steering', 'engines', 'power', 'navigation', 'comms', 'repairs'];
    const botProfiles = [
      { name: 'كابتن سارة 🚀', nameEn: 'Capt. Sarah 🚀', role: 'steering' as StationType, level: 18, xp: 2450, titleAr: 'قائدة أسراب المجرة', titleEn: 'Galaxy Squadron Leader', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      { name: 'مهندس فهد ⚡', nameEn: 'Eng. Fahad ⚡', role: 'engines' as StationType, level: 15, xp: 1890, titleAr: 'خبير محركات البلازما', titleEn: 'Plasma Core Specialist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
      { name: 'منى الفضائية 🧭', nameEn: 'Mona Space 🧭', role: 'navigation' as StationType, level: 12, xp: 1420, titleAr: 'مستكشفة مسارات الثقوب', titleEn: 'Wormhole Navigator', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
      { name: 'ألبرت الذكي 🤖', nameEn: 'Albert AI 🤖', role: 'repairs' as StationType, level: 20, xp: 3200, titleAr: 'روبوت الصيانة الفائقة', titleEn: 'Nanotech Repair Drone', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' }
    ];

    const updatedCrew: CrewMember[] = [];
    
    // Player is member 0 (Main Character)
    updatedCrew.push({
      id: 'player_1',
      name: currentUser?.name || (isAr ? 'القائد ري' : 'Captain Ray'),
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      role: playerStation,
      level: 14,
      xp: 1850,
      isBot: false,
      status: 'ok',
      titleAr: 'قائد المركبة الفضائية',
      titleEn: 'Starship Commander',
      x: 50,
      y: 68
    });

    // Positions on the command deck
    const deckPositions = [
      { x: 22, y: 72 },
      { x: 78, y: 72 },
      { x: 32, y: 48 },
      { x: 68, y: 48 }
    ];

    let botIdx = 0;
    while (updatedCrew.length < crewCount && botIdx < botProfiles.length) {
      const p = botProfiles[botIdx];
      const pos = deckPositions[botIdx % deckPositions.length];
      updatedCrew.push({
        id: `bot_${botIdx}`,
        name: isAr ? p.name : p.nameEn,
        avatar: p.avatar,
        role: p.role,
        level: p.level,
        xp: p.xp,
        isBot: true,
        status: 'ok',
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        x: pos.x,
        y: pos.y
      });
      botIdx++;
    }

    setCrew(updatedCrew);
  };

  // Launch countdown then start real gameplay
  const startLaunchSequence = () => {
    initializeCrew();

    let duration = 240;
    let initialDist = 10000;
    if (difficulty === 'easy') {
      duration = 300;
      initialDist = 8000;
    } else if (difficulty === 'hardcore') {
      duration = 180;
      initialDist = 12000;
    }

    setTotalTime(duration);
    setTimeRemaining(duration);
    setDistanceRemaining(initialDist);
    setHullIntegrity(100);
    setActiveEvents([]);
    setZeroGravityActive(false);
    setAlienInCabin(null);
    setSpinOutActive(false);
    setHullBreaches([]);
    setCollectibles([]);
    setScore(0);

    setGameState('countdown');
    setCountdownNum(3);
    triggerSound(440, 'sine', 0.15);

    setTimeout(() => {
      setCountdownNum(2);
      triggerSound(554, 'sine', 0.15);
    }, 900);

    setTimeout(() => {
      setCountdownNum(1);
      triggerSound(659, 'sine', 0.15);
    }, 1800);

    setTimeout(() => {
      setCountdownNum(isAr ? 'انطلاق! 🚀' : 'WARP LAUNCH! 🚀');
      triggerSound(880, 'sawtooth', 0.35);
      setTimeout(() => {
        setGameState('playing');
        spawnFeedback('🚀 WARP DRIVE ONLINE!', window.innerWidth / 2, window.innerHeight * 0.4, '#38bdf8');
      }, 700);
    }, 2700);
  };

  // Main Canvas Render Loop (Deep Space, Moving Asteroids, Planet Lodavia Horizon, Starship, Beams)
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

    // Deep Parallax Stars generation (3 Distinct Depth Layers)
    // Layer 1: Distant dim stars (slow, low alpha)
    const distantStars: { x: number; y: number; size: number; speed: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 140; i++) {
      distantStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.5,
        speed: Math.random() * 0.4 + 0.2,
        alpha: Math.random() * 0.35 + 0.25,
        color: ['#38bdf8', '#818cf8', '#e0e7ff', '#c084fc'][Math.floor(Math.random() * 4)]
      });
    }

    // Layer 2: Mid-range stars (medium speed, brighter)
    const midStars: { x: number; y: number; size: number; speed: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 60; i++) {
      midStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 1.2,
        speed: Math.random() * 0.8 + 0.6,
        alpha: Math.random() * 0.4 + 0.55,
        color: ['#67e8f9', '#a5b4fc', '#fdf4ff', '#fbbf24'][Math.floor(Math.random() * 4)]
      });
    }

    // Layer 3: Foreground warp particles & high-speed streaks
    const foregroundParticles: { x: number; y: number; size: number; speed: number; color: string }[] = [];
    for (let i = 0; i < 28; i++) {
      foregroundParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.0 + 2.0,
        speed: Math.random() * 1.5 + 1.8,
        color: ['#38bdf8', '#ffffff', '#f43f5e', '#34d399'][Math.floor(Math.random() * 4)]
      });
    }

    // In-world Asteroids (Foreground Parallax)
    const asteroids: { x: number; y: number; radius: number; speedX: number; speedY: number; rotation: number; rotSpeed: number; points: { x: number; y: number }[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const radius = 18 + Math.random() * 28;
      const pointCount = 8;
      const pts = [];
      for (let p = 0; p < pointCount; p++) {
        const ang = (p / pointCount) * Math.PI * 2;
        const radVar = radius * (0.8 + Math.random() * 0.4);
        pts.push({ x: Math.cos(ang) * radVar, y: Math.sin(ang) * radVar });
      }
      asteroids.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        radius,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() * 0.8 + 0.3) * (engineThrottle / 50),
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        points: pts
      });
    }

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Parallax steering offset
      const steeringParallax = (currentCourse - 180) * 0.4;
      const speedFactor = engineThrottle / 40;

      // 1. Deep Space Cosmic Nebula Background
      const bgGrad = ctx.createRadialGradient(width / 2 - steeringParallax * 0.2, height * 0.4, 50, width / 2, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#0d1527');
      bgGrad.addColorStop(0.4, '#090d1a');
      bgGrad.addColorStop(1, '#03050c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Mid-Depth Nebula Clouds (Layer 2 Parallax)
      ctx.save();
      ctx.globalAlpha = 0.18;
      const nebula1 = ctx.createRadialGradient(width * 0.25 - steeringParallax * 0.5, height * 0.3 + Math.sin(frame * 0.01) * 15, 10, width * 0.25, height * 0.3, width * 0.42);
      nebula1.addColorStop(0, '#ec4899');
      nebula1.addColorStop(0.7, '#8b5cf6');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.75 - steeringParallax * 0.5, height * 0.25 + Math.cos(frame * 0.012) * 15, 10, width * 0.75, height * 0.25, width * 0.45);
      nebula2.addColorStop(0, '#38bdf8');
      nebula2.addColorStop(0.6, '#06b6d4');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // PARALLAX LAYER 1: Distant Slow Star Field
      ctx.save();
      distantStars.forEach(star => {
        star.y += star.speed * speedFactor * 0.35;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        const renderX = (star.x - steeringParallax * 0.15 + width) % width;
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(renderX, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 2. Approaching Planet Lodavia Prime (Grows larger as distance decreases!)
      const progressFrac = Math.max(0, 1 - distanceRemaining / 10000);
      const planetRadius = Math.min(width * 0.35, 60 + progressFrac * 120);
      const planetX = width / 2 - steeringParallax * 0.3;
      const planetY = height * 0.28 - progressFrac * 30;

      // Planet Aura Glow
      const planetGlow = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.8, planetX, planetY, planetRadius * 1.5);
      planetGlow.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
      planetGlow.addColorStop(0.6, 'rgba(99, 102, 241, 0.15)');
      planetGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = planetGlow;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet Sphere
      const pGrad = ctx.createRadialGradient(planetX - planetRadius * 0.3, planetY - planetRadius * 0.3, 10, planetX, planetY, planetRadius);
      pGrad.addColorStop(0, '#38bdf8');
      pGrad.addColorStop(0.5, '#1e40af');
      pGrad.addColorStop(0.8, '#0f172a');
      pGrad.addColorStop(1, '#020617');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // Planet Rings
      ctx.save();
      ctx.translate(planetX, planetY);
      ctx.rotate(0.35);
      ctx.scale(1, 0.28);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, planetRadius * 1.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, planetRadius * 1.9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // PARALLAX LAYER 2: Mid-Range Stars
      ctx.save();
      midStars.forEach(star => {
        star.y += star.speed * speedFactor * 0.85;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        const renderX = (star.x - steeringParallax * 0.45 + width) % width;
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(renderX, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // PARALLAX LAYER 3: Foreground Warp Speed Streaks & Micro Particles
      ctx.save();
      foregroundParticles.forEach(p => {
        p.y += p.speed * speedFactor * 1.7;
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        const renderX = (p.x - steeringParallax * 0.9 + width) % width;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (engineThrottle > 65) {
          // Speed streak
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.9;
          ctx.beginPath();
          ctx.moveTo(renderX, p.y);
          ctx.lineTo(renderX, p.y + p.speed * 4.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(renderX, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // 4. Render Drifting 3D Asteroids
      asteroids.forEach(ast => {
        ast.x += ast.speedX;
        ast.y += ast.speedY * speedFactor;
        ast.rotation += ast.rotSpeed;

        if (ast.y > height + 60) {
          ast.y = -60;
          ast.x = Math.random() * width;
        }

        const renderX = (ast.x - steeringParallax * 0.8 + width) % width;

        ctx.save();
        ctx.translate(renderX, ast.y);
        ctx.rotate(ast.rotation);

        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ast.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Highlight crater with shading
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(ast.radius * 0.2, ast.radius * 0.2, ast.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 5. Starship Dynamic Thrust & Shield Dome at bottom-center
      const shipCenterX = width / 2;
      const shipCenterY = height * 0.72;
      const courseOffset = (currentCourse - 180) * 0.8; // subtle ship tilt

      ctx.save();
      ctx.translate(shipCenterX + courseOffset, shipCenterY);
      if (spinOutActive) {
        ctx.rotate(frame * 0.15);
      } else {
        ctx.rotate((courseOffset * Math.PI) / 180 * 0.15);
      }

      // Thruster Plume Particles
      const thrusterLength = 30 + (engineThrottle / 100) * 60 + Math.sin(frame * 0.5) * 8;
      const thrusterGrad = ctx.createLinearGradient(0, 40, 0, 40 + thrusterLength);
      thrusterGrad.addColorStop(0, '#ffffff');
      thrusterGrad.addColorStop(0.3, '#38bdf8');
      thrusterGrad.addColorStop(0.7, '#6366f1');
      thrusterGrad.addColorStop(1, 'transparent');

      // Dual Engine Flames
      [-28, 28].forEach(engX => {
        ctx.fillStyle = thrusterGrad;
        ctx.beginPath();
        ctx.moveTo(engX - 10, 35);
        ctx.lineTo(engX + 10, 35);
        ctx.lineTo(engX, 35 + thrusterLength);
        ctx.closePath();
        ctx.fill();
      });

      // Shield Dome Aura
      if (powerShields > 10 && hullIntegrity > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.8, powerShields / 70)})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(0, 0, 95, 75, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      frame++;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [engineThrottle, currentCourse, distanceRemaining, powerShields, hullIntegrity, spinOutActive]);

  // MAIN GAME TICK (1 second interval)
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // 1. Time decrement
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endGame(false, 'نفد الوقت قبل الوصول إلى كوكب لودافيا! ⌛', 'Time expired before reaching Planet Lodavia! ⌛');
          return 0;
        }
        return prev - 1;
      });

      // 2. Distance Progress
      setDistanceRemaining(prevDist => {
        let effectiveSpeed = (engineThrottle / 100) * 45;
        
        // Course alignment check
        const courseDiff = Math.abs(currentCourse - targetCourse);
        if (courseDiff > 18) {
          effectiveSpeed *= 0.6;
        }

        // Crisis slow down
        if (activeEvents.length > 0) {
          effectiveSpeed *= 0.75;
        }

        const newDist = Math.max(0, prevDist - Math.round(effectiveSpeed));
        setScore(s => s + Math.round(effectiveSpeed * 0.5));
        
        // WIN CONDITION: Target Reached!
        if (newDist <= 0) {
          endGame(true, '🎉 نجاح مبهر! هبطت المركبة الفضائية بسلام على كوكب لودافيا!', '🎉 Stellar Victory! Starship landed safely on Planet Lodavia!');
        }
        return newDist;
      });

      // 3. Engine Heat Management
      setEngineHeat(prevHeat => {
        let newHeat = prevHeat + (engineThrottle > 85 ? 4 : engineThrottle > 60 ? 1 : -2);
        if (newHeat > 95) {
          setHullIntegrity(h => Math.max(0, h - 4));
          triggerSound(220, 'sawtooth', 0.15);
          triggerScreenShake();
        }
        return Math.min(100, Math.max(10, newHeat));
      });

      // 4. Hull Damage from unsealed breaches
      setHullBreaches(breaches => {
        if (breaches.length > 0) {
          setHullIntegrity(h => {
            const nextH = Math.max(0, h - breaches.length * 1.5);
            if (nextH <= 0) {
              endGame(false, '💥 تحطمت المركبة بسبب انخفاض ضغط الهيكل وكثرة الثقوب!', '💥 Ship hull collapsed from unsealed breaches!');
            }
            return nextH;
          });
        }
        return breaches;
      });

      // 5. Course Jitter / Space Currents
      if (Math.random() < 0.3) {
        setCurrentCourse(prev => {
          const shift = (Math.random() - 0.5) * 14;
          return Math.min(360, Math.max(0, Math.round(prev + shift)));
        });
      }

      // 6. Spawn Random Cosmic Collectible (Energy Crystal / Nano Kit)
      if (Math.random() < 0.45 && collectibles.length < 4) {
        const types: SpaceCollectible['type'][] = ['plasma', 'repair', 'speed'];
        const newCol: SpaceCollectible = {
          id: Date.now() + Math.random(),
          type: types[Math.floor(Math.random() * types.length)],
          x: Math.floor(15 + Math.random() * 70),
          y: Math.floor(20 + Math.random() * 40),
          speed: 1.5,
          size: 32
        };
        setCollectibles(prev => [...prev.slice(-3), newCol]);
      }

      // 7. Random Chaos Events Generator
      const eventChance = difficulty === 'easy' ? 0.14 : difficulty === 'normal' ? 0.22 : 0.35;
      if (Math.random() < eventChance && activeEvents.length < 2) {
        triggerRandomChaosEvent();
      }

      // 8. Event timeouts
      setActiveEvents(prevEvents => {
        const updated = prevEvents.map(ev => ({ ...ev, timeLeft: ev.timeLeft - 1 }));
        updated.forEach(ev => {
          if (ev.timeLeft <= 0 && !ev.resolved) {
            setHullIntegrity(h => {
              const nextH = Math.max(0, h - 8);
              if (nextH <= 0) {
                endGame(false, `💥 دمر حادث (${ev.titleAr}) هيكل المركبة الفضائية!`, `💥 Critical event (${ev.titleEn}) destroyed ship!`);
              }
              return nextH;
            });
            triggerSound(180, 'square', 0.25);
            triggerScreenShake();
          }
        });
        return updated.filter(ev => ev.timeLeft > 0 && !ev.resolved);
      });

      // 9. Bots Assistance
      crew.forEach(member => {
        if (member.isBot) {
          if (member.role === 'engines' && engineHeat > 80 && Math.random() < 0.5) {
            setEngineHeat(h => Math.max(30, h - 20));
            spawnFeedback(`🔧 ${member.name} ${isAr ? 'برّد المحرك' : 'Cooled Core'}`, window.innerWidth * 0.7, window.innerHeight * 0.6, '#38bdf8');
          }
          if (member.role === 'repairs' && hullBreaches.length > 0 && Math.random() < 0.45) {
            setHullBreaches(b => b.slice(1));
            spawnFeedback(`🛠️ ${member.name} ${isAr ? 'رقع الثقب' : 'Sealed Breach'}`, window.innerWidth * 0.3, window.innerHeight * 0.6, '#10b981');
          }
        }
      });

    }, 1000);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, engineThrottle, currentCourse, targetCourse, activeEvents, difficulty, hullBreaches, crew, collectibles]);

  // TRIGGER RANDOM CHAOS EVENT
  const triggerRandomChaosEvent = () => {
    const eventTypes: ChaosEvent['type'][] = [
      'overheat',
      'zero_gravity',
      'alien',
      'meteor',
      'spin',
      'hull_breach'
    ];

    const chosenType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    if (chosenType === 'alien' && alienInCabin) return;

    let eventTitleAr = '';
    let eventTitleEn = '';
    let eventDescAr = '';
    let eventDescEn = '';
    let targetStation: StationType = 'repairs';

    switch (chosenType) {
      case 'overheat':
        eventTitleAr = '🔥 حرارة فائقة بالمحرك!';
        eventTitleEn = '🔥 Engine Thermal Overheat!';
        eventDescAr = 'اضغط زر التبريد السريع فوراً لتفادي الانفجار!';
        eventDescEn = 'Flush heat vents now to avoid critical meltdown!';
        targetStation = 'engines';
        setEngineHeat(92);
        break;

      case 'zero_gravity':
        eventTitleAr = '🌀 انقطاع الجاذبية الاصطناعية!';
        eventTitleEn = '🌀 Zero-G Inversion!';
        eventDescAr = 'انعدمت الجاذبية مؤقتاً! تمسك بالمركبة!';
        eventDescEn = 'Artificial gravity offline temporarily!';
        targetStation = 'power';
        setZeroGravityActive(true);
        setTimeout(() => setZeroGravityActive(false), 8000);
        break;

      case 'alien':
        eventTitleAr = '👽 كائن فضائي داخل المقصورة!';
        eventTitleEn = '👽 Alien Cabin Intruder!';
        eventDescAr = 'انقر على الفضائي لطرده خارج بوابة الهواء!';
        eventDescEn = 'Click alien 4 times to safely eject it!';
        targetStation = 'comms';
        setAlienInCabin({
          x: Math.floor(25 + Math.random() * 50),
          y: Math.floor(35 + Math.random() * 30),
          health: 4
        });
        break;

      case 'meteor':
        eventTitleAr = '☄️ وابل نيازك يقترب!';
        eventTitleEn = '☄️ Meteor Swarm Alert!';
        eventDescAr = 'اضبط زاوية القيادة نحو الزاوية المطلوبة للتفادي!';
        eventDescEn = 'Adjust steering course angle immediately!';
        targetStation = 'steering';
        setTargetCourse(Math.floor(Math.random() * 300) + 30);
        break;

      case 'spin':
        eventTitleAr = '🔄 دوران كوانتي مفاجئ!';
        eventTitleEn = '🔄 Quantum Ship Spin!';
        eventDescAr = 'اضرب درع الصدمة لإيقاف الدوران!';
        eventDescEn = 'Engage shield pulse to stabilize rotation!';
        targetStation = 'navigation';
        setSpinOutActive(true);
        setTimeout(() => setSpinOutActive(false), 6000);
        break;

      case 'hull_breach':
        eventTitleAr = '🕳️ ثقب نيزكي في الهيكل!';
        eventTitleEn = '🕳️ Meteor Hull Breach!';
        eventDescAr = 'انقر على الثقب المشتعل على الهيكل لرقع التسريب!';
        eventDescEn = 'Click glowing breach hole on the hull to patch!';
        targetStation = 'repairs';
        setHullBreaches(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.floor(30 + Math.random() * 40),
            y: Math.floor(45 + Math.random() * 25)
          }
        ]);
        break;
    }

    triggerSound(880, 'triangle', 0.2);
    triggerScreenShake();

    const newEvent: ChaosEvent = {
      id: Math.random().toString(),
      type: chosenType,
      titleAr: eventTitleAr,
      titleEn: eventTitleEn,
      descAr: eventDescAr,
      descEn: eventDescEn,
      stationTarget: targetStation,
      resolved: false,
      timeLeft: 12
    };
    setActiveEvents(prev => [newEvent, ...prev]);
  };

  // Resolve crisis
  const resolveEvent = (eventId: string) => {
    setActiveEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, resolved: true } : ev));
    triggerSound(659, 'sine', 0.15);
    spawnFeedback(isAr ? '✅ تم احتواء الحادث!' : '✅ Crisis Contained!', window.innerWidth / 2, window.innerHeight * 0.35, '#10b981');
  };

  // Alien click in-world
  const handleAlienClick = () => {
    if (!alienInCabin) return;
    triggerSound(750, 'square', 0.08);

    if (alienInCabin.health <= 1) {
      setAlienInCabin(null);
      triggerSound(1100, 'sine', 0.2);
      spawnFeedback('👽 EJECTED! +100 PTS', window.innerWidth / 2, window.innerHeight * 0.45, '#ec4899');
      setScore(s => s + 100);
    } else {
      setAlienInCabin({
        ...alienInCabin,
        health: alienInCabin.health - 1
      });
      spawnFeedback(`💥 ZAP! (${alienInCabin.health - 1})`, window.innerWidth / 2, window.innerHeight * 0.45, '#fbbf24');
    }
  };

  // Patch hull breach in-world
  const handlePatchBreach = (id: number, x: number, y: number) => {
    setHullBreaches(prev => prev.filter(b => b.id !== id));
    triggerSound(580, 'sine', 0.1);
    spawnFeedback('🛠️ PATCHED! +60 PTS', (x / 100) * window.innerWidth, (y / 100) * window.innerHeight, '#10b981');
    setHullIntegrity(h => Math.min(100, h + 8));
    setScore(s => s + 60);
  };

  // Collect in-world collectible
  const handleCollectItem = (item: SpaceCollectible) => {
    setCollectibles(prev => prev.filter(c => c.id !== item.id));
    triggerSound(950, 'sine', 0.1);
    if (item.type === 'plasma') {
      setScore(s => s + 80);
      spawnFeedback('+80 🪙 PLASMA ENERGY', (item.x / 100) * window.innerWidth, (item.y / 100) * window.innerHeight, '#38bdf8');
    } else if (item.type === 'repair') {
      setHullIntegrity(h => Math.min(100, h + 15));
      spawnFeedback('+15% 🛡️ REPAIRED', (item.x / 100) * window.innerWidth, (item.y / 100) * window.innerHeight, '#10b981');
    } else {
      setEngineHeat(h => Math.max(10, h - 30));
      spawnFeedback('⚡ HYPER BOOST!', (item.x / 100) * window.innerWidth, (item.y / 100) * window.innerHeight, '#fbbf24');
    }
  };

  // Fire Deflector Laser / Shield Pulse
  const handleFireLaserPulse = () => {
    if (laserCooldown > 0) return;
    setLaserCooldown(3);
    triggerSound(980, 'sawtooth', 0.25);
    triggerScreenShake();
    spawnFeedback('⚡ DEFLECTOR PULSE FIRED!', window.innerWidth / 2, window.innerHeight * 0.6, '#38bdf8');

    // Blast any nearby hull breaches or alien
    if (alienInCabin) {
      handleAlienClick();
    }
    if (hullBreaches.length > 0) {
      handlePatchBreach(hullBreaches[0].id, hullBreaches[0].x, hullBreaches[0].y);
    }
    if (spinOutActive) {
      setSpinOutActive(false);
    }

    const timer = setInterval(() => {
      setLaserCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End Game
  const endGame = (won: boolean, reasonAr: string, reasonEn: string) => {
    setGameState('gameover');
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    const xp = won ? (difficulty === 'hardcore' ? 320 : 220) : 60;
    const pts = won ? (difficulty === 'hardcore' ? 140 : 90) : 20;

    setGameResult({
      won,
      reasonAr,
      reasonEn,
      eventsResolvedCount: Math.floor(Math.random() * 5) + 3,
      xpEarned: xp,
      pointsEarned: pts
    });

    onFinishGame(xp, pts, won);

    if (won) {
      triggerSound(523, 'sine', 0.1);
      setTimeout(() => triggerSound(659, 'sine', 0.1), 100);
      setTimeout(() => triggerSound(783, 'sine', 0.3), 200);
    } else {
      triggerSound(180, 'sawtooth', 0.4);
    }
  };

  return (
    <div className={`relative w-full h-[calc(100vh-60px)] min-h-[600px] overflow-hidden select-none bg-[#030611] text-white ${screenShake ? 'animate-bounce' : ''}`}>
      {/* 1. REAL-TIME COSMIC CANVAS GAME WORLD (Occupies 100% of background & world) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* CRITICAL HULL WARNING VIGNETTE (Accelerating Emergency Pulse) */}
      {hullIntegrity < 20 && hullIntegrity > 0 && gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 0.95, 0.35] }}
          transition={{ 
            duration: Math.max(0.35, (hullIntegrity / 20) * 1.2), 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="fixed inset-0 pointer-events-none z-35 shadow-[inset_0_0_120px_rgba(239,68,68,0.75)] border-4 border-rose-500/60"
        >
          <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-rose-600/95 text-white rounded-full font-mono text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-2xl border border-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 animate-spin" />
            <span>{isAr ? '⚠️ تحذير حرج: انهيار الهيكل وشيك!' : '⚠️ CRITICAL: HULL COLLAPSE IMMINENT!'}</span>
          </div>
        </motion.div>
      )}

      {/* 2. IN-WORLD FLOATING PARTICLES & REWARDS FEEDBACK */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {floatingFeedbacks.map(fb => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, y: fb.y, x: fb.x, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: fb.y - 70, scale: [0.7, 1.2, 1, 0.9] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-full bg-black/80 border border-white/20 shadow-2xl backdrop-blur-md"
            style={{ color: fb.color, borderColor: `${fb.color}80` }}
          >
            {fb.text}
          </motion.div>
        ))}
      </div>

      {/* 3. LOBBY & PRE-GAME SETUP (Clean Stylized Hero View) */}
      {gameState === 'setup' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#080D1A]/95 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(244,63,94,0.25)] backdrop-blur-2xl space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-rose-600/30">
              🛸
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? 'فوضى المركبة الفضائية 🚀' : 'Starship Chaos Arena 🚀'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {isAr 
                  ? 'قُد المركبة الكونية مع طاقمك، واجه الكويكبات والحرارة الزائدة، واصل بأمان إلى كوكب لودافيا!' 
                  : 'Pilot the cosmic starship with your crew, survive anomalies and meteors, and reach Planet Lodavia!'}
              </p>
            </div>

            {/* DIFFICULTY SELECTION */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'easy', labelAr: 'سهل 🟢', labelEn: 'Easy 🟢', dist: '8,000 km' },
                { id: 'normal', labelAr: 'متوسط 🟡', labelEn: 'Normal 🟡', dist: '10,000 km' },
                { id: 'hardcore', labelAr: 'مستحيل 🔴', labelEn: 'Hardcore 🔴', dist: '12,000 km' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as DifficultyLevel)}
                  className={`p-3 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                    difficulty === d.id
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>{isAr ? d.labelAr : d.labelEn}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">{d.dist}</div>
                </button>
              ))}
            </div>

            {/* LAUNCH BUTTON */}
            <button
              onClick={startLaunchSequence}
              className="w-full py-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-2xl text-base font-black shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isAr ? 'بدء مغامرة الطيران الفضائي! 🚀' : 'Start Space Adventure! 🚀'}</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* 4. CINEMATIC 3-2-1-WARP COUNTDOWN SEQUENCE */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <motion.div
            key={String(countdownNum)}
            initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="text-6xl sm:text-8xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 filter drop-shadow-[0_0_40px_rgba(6,182,212,0.8)]">
              {countdownNum}
            </div>
            <p className="text-sm font-mono text-cyan-300 uppercase tracking-widest mt-4">
              CALIBRATING QUANTUM THRUSTERS...
            </p>
          </motion.div>
        </div>
      )}

      {/* 5. ACTIVE GAME WORLD HUD & INTERACTION LAYER */}
      {gameState === 'playing' && (
        <>
          {/* TOP MINIMAL HUD (10-15% SCREEN SPACE) WITH SMOOTH ANIMATED COUNTERS */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-start justify-between gap-2 pointer-events-none">
            {/* TOP-LEFT: PLAYER CHIP & SHIP INTEGRITY */}
            <div className="pointer-events-auto bg-[#070B16]/85 border border-cyan-500/30 rounded-2xl p-2 sm:p-2.5 backdrop-blur-xl shadow-xl flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt="Player"
                  className="w-9 h-9 rounded-xl object-cover border border-cyan-400 bg-slate-950"
                />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-amber-500 text-slate-950 px-1 rounded">
                  Lv.14
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{currentUser?.name || (isAr ? 'القائد ري' : 'Capt. Ray')}</span>
                  <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 font-mono rounded">
                    HELM
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-20 sm:w-24 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full transition-all duration-300 ${hullIntegrity < 20 ? 'bg-rose-500 animate-pulse' : hullIntegrity < 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.max(0, Math.min(100, hullIntegrity))}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-mono font-black ${hullIntegrity < 20 ? 'text-rose-400' : hullIntegrity < 50 ? 'text-amber-300' : 'text-emerald-300'}`}>
                    <AnimatedNumber value={Math.round(hullIntegrity)} />% 🛡️
                  </span>
                </div>
              </div>
            </div>

            {/* TOP-CENTER: MISSION OBJECTIVE TARGET CHIP */}
            <div className="pointer-events-auto bg-[#070B16]/85 border border-cyan-500/30 rounded-2xl px-3 sm:px-4 py-2 backdrop-blur-xl shadow-xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan-300">
                <Target className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="font-bold">{isAr ? 'الهدف: كوكب لودافيا' : 'Target: Lodavia Prime'}</span>
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-white mt-0.5">
                <AnimatedNumber value={distanceRemaining} formatter={v => v.toLocaleString()} /> <span className="text-[10px] text-slate-400">KM</span>
              </div>
            </div>

            {/* TOP-RIGHT: CHRONO & VELOCITY METRICS */}
            <div className="pointer-events-auto bg-[#070B16]/85 border border-cyan-500/30 rounded-2xl p-2 sm:p-2.5 backdrop-blur-xl shadow-xl flex items-center gap-2 sm:gap-3 text-right">
              <div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-amber-300 font-mono font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="text-xs font-mono font-black text-cyan-300 mt-0.5">
                  ⚡ <AnimatedNumber value={Math.round(engineThrottle * 15)} /> <span className="text-[8px] text-slate-400">km/s</span>
                </div>
              </div>

              <div className="border-l border-white/10 pl-2">
                <div className="text-[9px] text-slate-400 font-bold">{isAr ? 'النقاط' : 'Score'}</div>
                <div className="text-xs font-mono font-black text-yellow-400">
                  +<AnimatedNumber value={score} />
                </div>
              </div>
            </div>
          </div>

          {/* FLIGHT EVENT LOGS (Smooth slide-in + flash animation) */}
          <div className="absolute top-16 right-3 z-30 max-w-xs space-y-1.5 pointer-events-none hidden sm:block">
            <AnimatePresence>
              {flightLogs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 18, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`px-3 py-1.5 rounded-xl border backdrop-blur-xl text-[10px] font-mono shadow-xl flex items-center gap-2 ${
                    log.type === 'alert'
                      ? 'bg-rose-950/80 border-rose-500/60 text-rose-200 shadow-rose-900/30'
                      : log.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-emerald-900/30'
                      : 'bg-slate-950/80 border-cyan-500/40 text-cyan-200 shadow-cyan-900/20'
                  }`}
                >
                  <span className="text-slate-400 text-[8px] font-bold">{log.time}</span>
                  <span className="truncate">{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 6. IN-WORLD INTERACTIVE OBJECTS (Collectibles, Breaches, Aliens) */}
          {/* A. COLLECTIBLES FLOATING IN SPACE */}
          {collectibles.map(item => (
            <motion.button
              key={item.id}
              onClick={() => handleCollectItem(item)}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1], y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute z-20 cursor-pointer p-2 rounded-2xl bg-black/60 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] backdrop-blur-sm active:scale-90"
              style={{ top: `${item.y}%`, left: `${item.x}%` }}
              title={isAr ? 'انقر لجمع الطاقة الكونية!' : 'Click to collect!'}
            >
              <span className="text-xl">
                {item.type === 'plasma' ? '💎' : item.type === 'repair' ? '🧰' : '⚡'}
              </span>
            </motion.button>
          ))}

          {/* B. HULL BREACHES (Directly on ship hull) */}
          {hullBreaches.map(b => (
            <motion.button
              key={b.id}
              onClick={() => handlePatchBreach(b.id, b.x, b.y)}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute z-25 cursor-pointer flex flex-col items-center group active:scale-90"
              style={{ top: `${b.y}%`, left: `${b.x}%` }}
            >
              <span className="text-2xl animate-pulse">🕳️</span>
              <span className="text-[8px] font-mono font-black bg-rose-600 text-white px-1.5 py-0.5 rounded-full border border-rose-300 shadow-md">
                {isAr ? 'انقر للرقع!' : 'PATCH!'}
              </span>
            </motion.button>
          ))}

          {/* C. ALIEN INTRUDER */}
          {alienInCabin && (
            <motion.button
              onClick={handleAlienClick}
              animate={{ scale: [1, 1.15, 1], rotate: [-8, 8, -8] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute z-30 cursor-pointer flex flex-col items-center active:scale-90"
              style={{ top: `${alienInCabin.y}%`, left: `${alienInCabin.x}%` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-900/90 border-2 border-pink-400 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(236,72,153,0.8)]">
                👽
              </div>
              <div className="w-10 h-1 bg-black/80 rounded-full mt-1 overflow-hidden border border-pink-400">
                <div className="h-full bg-pink-400" style={{ width: `${(alienInCabin.health / 4) * 100}%` }} />
              </div>
              <span className="text-[8px] font-mono font-black text-pink-300 bg-black/80 px-1 rounded mt-0.5">
                HP: {alienInCabin.health}
              </span>
            </motion.button>
          )}

          {/* 7. SQUAD CREW IN GAME WORLD WITH OVERHEAD NAME TAGS */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {crew.map(member => (
              <div
                key={member.id}
                className="absolute pointer-events-auto flex flex-col items-center transition-all duration-500"
                style={{ top: `${member.y}%`, left: `${member.x}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/80 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 shadow-md mb-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{member.name.split(' ')[0]}</span>
                  <span className="text-amber-300">Lv.{member.level}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedMiniPlayer({
                      id: member.id,
                      name: member.name,
                      avatar: member.avatar,
                      level: member.level,
                      xp: member.xp,
                      titleAr: member.titleAr,
                      titleEn: member.titleEn,
                      matchesCount: 26,
                      winsCount: 18,
                      winRate: 69,
                      points: 850,
                      status: 'in_game',
                      currentActivityAr: `يقود محطة: ${member.role}`,
                      currentActivityEn: `Operating: ${member.role}`,
                      achievementsCount: 5,
                      achievements: ['🚀 طيار لودافيا', '⚡ سريع البديهة'],
                      badgeAr: member.isBot ? 'AI Drone' : 'Host ★',
                      badgeEn: member.isBot ? 'AI Drone' : 'Host ★',
                      frameBorderColor: '#06B6D4'
                    });
                    triggerSound(700, 'sine', 0.08);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-600 border-2 border-cyan-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-[13px] bg-slate-950" />
                </button>
              </div>
            ))}
          </div>

          {/* 8. ACTIVE CRISIS BANNER OVERLAY */}
          <AnimatePresence>
            {activeEvents.map(ev => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-20 left-4 right-4 max-w-lg mx-auto z-40 p-3 rounded-2xl bg-rose-950/90 border-2 border-rose-500/60 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-pulse"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-white">{isAr ? ev.titleAr : ev.titleEn}</div>
                    <div className="text-[10px] text-slate-300">{isAr ? ev.descAr : ev.descEn}</div>
                  </div>
                </div>

                <button
                  onClick={() => resolveEvent(ev.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {isAr ? 'حل الحادث ⚡' : 'Resolve ⚡'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 9. BOTTOM HOLOGRAPHIC COCKPIT & HIGH-FEEL STEERING CONSOLE */}
          {(() => {
            const courseDiff = Math.abs(currentCourse - targetCourse);
            const normalizedDiff = Math.min(courseDiff, 360 - courseDiff);
            const isNearTarget = normalizedDiff <= 5;
            const isExactTarget = normalizedDiff === 0;

            return (
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-30">
                <motion.div 
                  animate={panelShake ? { x: [-2.5, 2.5, -1.5, 1.5, 0], y: [-1, 1, 0] } : { x: 0, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="max-w-3xl mx-auto bg-[#070B16]/92 border border-cyan-500/30 rounded-3xl p-2.5 sm:p-3.5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-2.5"
                >
                  {/* STEERING DIAL & TACTILE CONTROLS (Requirements 1 & 2) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2 rounded-2xl bg-black/50 border border-white/10">
                    
                    {/* LEFT & RIGHT 5° STEERING BUTTONS */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSteer(-5)}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md active:bg-cyan-500/30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{isAr ? 'يسار 5° ↶' : 'Left 5° ↶'}</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSteer(5)}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md active:bg-cyan-500/30"
                      >
                        <span>{isAr ? '↷ يمين 5°' : '↷ Right 5°'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* INTERACTIVE COMPASS DIAL WITH PROXIMITY GLOW & TARGET LOCK */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 font-bold">{isAr ? 'الزاوية المستهدفة' : 'Target Bearing'}</div>
                        <div className="text-xs font-mono font-black text-amber-300">
                          <AnimatedNumber value={targetCourse} />°
                        </div>
                      </div>

                      {/* ROTATING COMPASS DIAL WITH SMOOTH 300-400ms EASE-OUT & CELEBRATION POP */}
                      <motion.div
                        animate={{
                          scale: targetLockCelebration ? [1, 1.18, 1] : 1,
                          rotate: targetLockCelebration ? [0, 4, -4, 0] : 0
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isExactTarget
                            ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.9)] scale-105'
                            : isNearTarget
                            ? 'bg-emerald-900/30 border-emerald-400/90 shadow-[0_0_25px_rgba(16,185,129,0.6)] animate-pulse'
                            : 'bg-[#0B1528] border-cyan-400/40 shadow-inner'
                        }`}
                      >
                        {/* Smooth Needle Rotation (Requirement 1: 300-400ms ease-out) */}
                        <motion.div
                          animate={{ rotate: currentCourse }}
                          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className={`w-0.5 h-7 rounded-full shadow-lg ${isNearTarget ? 'bg-emerald-400 shadow-emerald-400' : 'bg-cyan-400 shadow-cyan-400'}`} />
                          <div className="absolute top-1 w-2 h-2 rounded-full bg-rose-500" />
                        </motion.div>

                        <Compass className={`w-5 h-5 z-10 ${isNearTarget ? 'text-emerald-300' : 'text-cyan-300'}`} />
                      </motion.div>

                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-slate-400 font-bold">{isAr ? 'الاتجاه الحالي' : 'Current'}</span>
                          {isNearTarget && (
                            <span className="text-[8px] font-mono font-black text-emerald-400 bg-emerald-950/80 px-1 rounded border border-emerald-500/40 animate-pulse">
                              {isExactTarget ? (isAr ? 'مقفل 🎯' : 'LOCKED 🎯') : (isAr ? 'قريب 🟢' : 'NEAR 🟢')}
                            </span>
                          )}
                        </div>
                        <div className={`text-xs font-mono font-black ${isNearTarget ? 'text-emerald-400' : 'text-cyan-300'}`}>
                          <AnimatedNumber value={currentCourse} />°
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TACTILE COCKPIT ACTION GRID */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* 1. QUICK ALIGN COURSE */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        handleSteer(targetCourse - currentCourse);
                        spawnFeedback(`🧭 ALIGNED ${targetCourse}°`, window.innerWidth / 2, window.innerHeight * 0.7, '#10b981');
                      }}
                      className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-md active:bg-cyan-500/30"
                    >
                      <Radar className="w-5 h-5 text-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-black text-white">{isAr ? 'محاذاة كاملة' : 'Quick Align'}</span>
                      <span className="text-[9px] font-mono text-cyan-300">{targetCourse}°</span>
                    </motion.button>

                    {/* 2. ENGINE THROTTLE / FLUSH HEAT */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        triggerPanelShake();
                        setEngineHeat(h => Math.max(15, h - 25));
                        triggerSound(400, 'sawtooth', 0.1);
                        spawnFeedback('❄️ HEAT FLUSHED!', window.innerWidth / 2, window.innerHeight * 0.7, '#38bdf8');
                        addFlightLog(isAr ? '❄️ تم تفريغ الحرارة وتبريد قلب المحرك' : '❄️ Core heat vents flushed', 'info');
                      }}
                      className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all shadow-md ${
                        engineHeat > 75
                          ? 'bg-rose-500/25 border-rose-400 animate-pulse'
                          : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/40'
                      }`}
                    >
                      <Flame className={`w-5 h-5 ${engineHeat > 75 ? 'text-rose-400' : 'text-amber-400'}`} />
                      <span className="text-[10px] font-black text-white">{isAr ? 'تبريد المحرك' : 'Flush Core'}</span>
                      <span className={`text-[9px] font-mono ${engineHeat > 75 ? 'text-rose-300 font-bold' : 'text-amber-300'}`}>
                        <AnimatedNumber value={Math.round(engineHeat)} />°C
                      </span>
                    </motion.button>

                    {/* 3. DEFLECTOR LASER PULSE */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleFireLaserPulse}
                      disabled={laserCooldown > 0}
                      className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all shadow-md ${
                        laserCooldown > 0
                          ? 'bg-slate-800/40 border-white/5 text-slate-500'
                          : 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-400/40 text-purple-300'
                      }`}
                    >
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-[10px] font-black text-white">{isAr ? 'نبضة الليزر' : 'Laser Pulse'}</span>
                      <span className="text-[9px] font-mono">
                        {laserCooldown > 0 ? `${laserCooldown}s` : 'READY ⚡'}
                      </span>
                    </motion.button>

                    {/* 4. REPAIR DRONES ACTIVATION */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        triggerPanelShake();
                        if (hullBreaches.length > 0) {
                          handlePatchBreach(hullBreaches[0].id, hullBreaches[0].x, hullBreaches[0].y);
                        } else {
                          setHullIntegrity(h => Math.min(100, h + 10));
                          spawnFeedback('🛡️ NANITE REPAIR +10%', window.innerWidth / 2, window.innerHeight * 0.7, '#10b981');
                          addFlightLog(isAr ? '🛡️ نشر روبوتات النانو لإصلاح الهيكل' : '🛡️ Nanite repair drones dispatched', 'success');
                        }
                      }}
                      className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-md"
                    >
                      <Wrench className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-black text-white">{isAr ? 'إصلاح النانو' : 'Nano Repair'}</span>
                      <span className="text-[9px] font-mono text-emerald-300">AUTO 🧰</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </>
      )}

      {/* 10. GAME OVER / VICTORY CINEMATIC OVERLAY */}
      {gameState === 'gameover' && gameResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center space-y-6 border-2 shadow-2xl backdrop-blur-2xl ${
              gameResult.won
                ? 'bg-[#0A1628]/95 border-cyan-400/60 shadow-[0_0_60px_rgba(6,182,212,0.35)]'
                : 'bg-[#180A0E]/95 border-rose-500/60 shadow-[0_0_60px_rgba(244,63,94,0.35)]'
            }`}
          >
            <div className="text-6xl animate-bounce">
              {gameResult.won ? '🏆' : '💥'}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {gameResult.won 
                  ? (isAr ? 'انتصار كوني مبهر! 🎉' : 'Cosmic Victory! 🎉') 
                  : (isAr ? 'تحطمت المركبة في الفضاء! 💥' : 'Starship Destroyed! 💥')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {isAr ? gameResult.reasonAr : gameResult.reasonEn}
              </p>
            </div>

            {/* REWARDS SUMMARY CHIPS */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-black/60 border border-white/10">
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'النقاط' : 'Score'}</div>
                <div className="text-base font-black font-mono text-yellow-400">+{score}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'الخبرة' : 'XP'}</div>
                <div className="text-base font-black font-mono text-cyan-300">+{gameResult.xpEarned}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'العملات' : 'Coins'}</div>
                <div className="text-base font-black font-mono text-emerald-400">+{gameResult.pointsEarned} 🪙</div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={startLaunchSequence}
                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? 'إعادة الإطلاق 🚀' : 'Launch Again 🚀'}</span>
              </button>

              <button
                onClick={onBack}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs sm:text-sm font-bold border border-white/10 cursor-pointer transition-all"
              >
                <span>{isAr ? 'القائمة' : 'Menu'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 11. IN-GAME MINI PLAYER PROFILE OVERLAY */}
      {selectedMiniPlayer && (
        <GameMiniProfileModal
          player={selectedMiniPlayer}
          onClose={() => setSelectedMiniPlayer(null)}
          onInviteToPlay={() => {
            spawnFeedback('🛸 CHALLENGE SENT!', window.innerWidth / 2, window.innerHeight * 0.4, '#38bdf8');
          }}
        />
      )}
    </div>
  );
}
