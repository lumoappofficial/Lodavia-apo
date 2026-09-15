import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Flame, 
  Zap, 
  Shield, 
  Trophy, 
  Award, 
  Play, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Crown, 
  Globe, 
  Gauge, 
  Sliders, 
  Compass,
  Coins,
  ShieldAlert,
  Pause,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface GalaxyRushProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

// Vehicles
interface StarshipVehicle {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  speedRating: number; // 1-5
  controlRating: number; // 1-5
  shieldRating: number; // 1-5
  color: string;
  glowColor: string;
  unlocked: boolean;
  minLevelReq: number;
  icon: string;
}

// Galaxies / Circuits
interface GalaxyTrack {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  difficultyAr: string;
  difficultyEn: string;
  bgGradient: string;
  themeColor: string;
  starColor: string;
  trackLengthMeters: number; // e.g. 10000
  baseSpeed: number;
  obstacleDensity: number;
  unlocked: boolean;
  minLevelReq: number;
}

// Game Object Spawned on Track
interface TrackObject {
  id: number;
  type: 'crystal' | 'boost' | 'shield' | 'gate' | 'asteroid';
  x: number; // -1.0 (far left) to 1.0 (far right)
  z: number; // 0 (far away) to 100 (player location)
  speed: number;
  size: number;
  collected?: boolean;
}

export default function GalaxyRushGame({ onBack, onFinishGame }: GalaxyRushProps) {
  const { lang, playSynthSound } = useApp();

  // Sound Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Screen Phase: 'menu' | 'racing' | 'paused' | 'results'
  const [gamePhase, setGamePhase] = useState<'menu' | 'racing' | 'paused' | 'results'>('menu');

  // Modal Views from Menu: null | 'vehicles' | 'galaxies' | 'leaderboard' | 'achievements' | 'howToPlay'
  const [activeModal, setActiveModal] = useState<null | 'vehicles' | 'galaxies' | 'leaderboard' | 'achievements' | 'howToPlay'>(null);

  // Stats stored in LocalStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('lodavia_galaxy_rush_stats');
    return saved ? JSON.parse(saved) : {
      racesPlayed: 0,
      racesWon: 0,
      bestTimeSeconds: 0,
      totalCrystals: 0,
      highScore: 0
    };
  });

  // Selected Vehicle & Track
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('balanced_scout');
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<string>('blue_galaxy');

  // Vehicles Catalog
  const vehiclesList: StarshipVehicle[] = [
    {
      id: 'balanced_scout',
      nameAr: 'المستكشف المتوازن 🚀',
      nameEn: 'Balanced Scout 🚀',
      descAr: 'مركبة متوازنة ومثالية لجميع المستويات بشرعة ومناورة متكافئة.',
      descEn: 'Well-rounded starship with balanced speed, controls, and shield.',
      speedRating: 3,
      controlRating: 3,
      shieldRating: 3,
      color: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.8)',
      unlocked: true,
      minLevelReq: 1,
      icon: '🚀'
    },
    {
      id: 'speed_interceptor',
      nameAr: 'الصاروخ السريع ⚡',
      nameEn: 'Speed Interceptor ⚡',
      descAr: 'مركبة فائقة السرعة للمحترفين مع درع منخفض للاستجابة الخاطفة.',
      descEn: 'High-velocity ship built for max speed with lightweight shielding.',
      speedRating: 5,
      controlRating: 3,
      shieldRating: 2,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.8)',
      unlocked: true,
      minLevelReq: 1,
      icon: '⚡'
    },
    {
      id: 'agile_voyager',
      nameAr: 'المناور الرشيق 🌀',
      nameEn: 'Agile Voyager 🌀',
      descAr: 'تحكم واستجابة فائقة للانعطاف السريع بين الكويكبات الضخمة.',
      descEn: 'Ultra-agile steering for quick dodging around dense asteroid fields.',
      speedRating: 3,
      controlRating: 5,
      shieldRating: 3,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.8)',
      unlocked: true,
      minLevelReq: 1,
      icon: '🌀'
    },
    {
      id: 'legendary_phoenix',
      nameAr: 'الفينكس الأسطوري 👑',
      nameEn: 'Legendary Phoenix 👑',
      descAr: 'مركبة أسطورية تجمع بين السرعة الفائقة والدرع القوي والمناورة الكاملة.',
      descEn: 'Supreme legendary starship combining max speed, top control and heavy shields.',
      speedRating: 5,
      controlRating: 4,
      shieldRating: 5,
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.9)',
      unlocked: true,
      minLevelReq: 1,
      icon: '👑'
    }
  ];

  // Galaxies Catalog
  const galaxiesList: GalaxyTrack[] = [
    {
      id: 'blue_galaxy',
      nameAr: 'المجرة الزرقاء 🌌',
      nameEn: 'Blue Galaxy 🌌',
      descAr: 'مسار مستقر وممتع مع نيازك متفرقة وجمال كوني خلاب.',
      descEn: 'Smooth cosmic circuit with light asteroid clusters and serene views.',
      difficultyAr: 'سهل 🟢',
      difficultyEn: 'Easy 🟢',
      bgGradient: 'from-blue-950 via-slate-950 to-indigo-950',
      themeColor: '#38bdf8',
      starColor: '#7dd3fc',
      trackLengthMeters: 8000,
      baseSpeed: 40,
      obstacleDensity: 1.0,
      unlocked: true,
      minLevelReq: 1
    },
    {
      id: 'purple_nebula',
      nameAr: 'سديم بنفسجي 🟣',
      nameEn: 'Purple Nebula 🟣',
      descAr: 'مسار متوسط مع بوابات طاقة كوانتية وتدفقات كريستالية مكثفة.',
      descEn: 'Medium circuit with glowing quantum gates and dense crystal formations.',
      difficultyAr: 'متوسط 🟡',
      difficultyEn: 'Medium 🟡',
      bgGradient: 'from-purple-950 via-slate-950 to-fuchsia-950',
      themeColor: '#c084fc',
      starColor: '#e879f9',
      trackLengthMeters: 10000,
      baseSpeed: 50,
      obstacleDensity: 1.3,
      unlocked: true,
      minLevelReq: 1
    },
    {
      id: 'fire_galaxy',
      nameAr: 'المجرة النارية 🔴',
      nameEn: 'Fire Galaxy 🔴',
      descAr: 'مسار ناري مليء بالكويكبات المتحركة والعواصف النجمية الساخنة.',
      descEn: 'Challenging fiery circuit with volatile asteroids and stellar flares.',
      difficultyAr: 'صعب 🔴',
      difficultyEn: 'Hard 🔴',
      bgGradient: 'from-rose-950 via-slate-950 to-amber-950',
      themeColor: '#f43f5e',
      starColor: '#fb7185',
      trackLengthMeters: 12000,
      baseSpeed: 60,
      obstacleDensity: 1.7,
      unlocked: true,
      minLevelReq: 1
    },
    {
      id: 'heart_cosmos',
      nameAr: 'قلب الكون 🌟',
      nameEn: 'Heart of Cosmos 🌟',
      descAr: 'المستوى الأساسي الفائق للمحترفين بسرعات قياسية وثقوب سوداء!',
      descEn: 'Expert championship track with hyper-warp speeds and gravitational hazards.',
      difficultyAr: 'أسطوري 🏆',
      difficultyEn: 'Expert 🏆',
      bgGradient: 'from-amber-950 via-purple-950 to-cyan-950',
      themeColor: '#fbbf24',
      starColor: '#fef08a',
      trackLengthMeters: 15000,
      baseSpeed: 70,
      obstacleDensity: 2.1,
      unlocked: true,
      minLevelReq: 1
    }
  ];

  // Active Race State
  const activeVehicle = vehiclesList.find(v => v.id === selectedVehicleId) || vehiclesList[0];
  const activeGalaxy = galaxiesList.find(g => g.id === selectedGalaxyId) || galaxiesList[0];

  // Gameplay Live Dynamic Variables
  const [shipX, setShipX] = useState<number>(0); // -1.0 to +1.0
  const [distanceCovered, setDistanceCovered] = useState<number>(0); // 0 to trackLengthMeters
  const [currentSpeed, setCurrentSpeed] = useState<number>(0); // km/h
  const [score, setScore] = useState<number>(0);
  const [crystalsCollected, setCrystalsCollected] = useState<number>(0);
  const [nitroAmount, setNitroAmount] = useState<number>(50); // 0 to 100
  const [nitroActive, setNitroActive] = useState<boolean>(false);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [shieldCount, setShieldCount] = useState<number>(1);
  const [raceTime, setRaceTime] = useState<number>(0); // seconds
  const [countdown, setCountdown] = useState<number | null>(3);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [checkpointsPassed, setCheckpointsPassed] = useState<number>(0);

  // Result State
  const [finalResults, setFinalResults] = useState<{
    timeSeconds: number;
    score: number;
    crystals: number;
    xpEarned: number;
    coinsEarned: number;
    isNewBest: boolean;
    rank: string;
  } | null>(null);

  // Refs for Animation Loop & Controls
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const shipPosRef = useRef<number>(0);
  const objectsRef = useRef<TrackObject[]>([]);
  const nitroActiveRef = useRef<boolean>(false);
  const shieldActiveRef = useRef<boolean>(false);
  const distanceRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const crystalsRef = useRef<number>(0);
  const nitroAmountRef = useRef<number>(50);
  const raceTimeRef = useRef<number>(0);
  const keysPressed = useRef<{ left: boolean; right: boolean; nitro: boolean; shield: boolean }>({
    left: false,
    right: false,
    nitro: false,
    shield: false
  });

  // Sound Synth Trigger
  const triggerAudio = (freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration: number = 0.1) => {
    if (soundEnabled && playSynthSound) {
      playSynthSound(freq, type, duration);
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'racing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        activateNitro();
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'Shift') {
        e.preventDefault();
        activateShield();
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setGamePhase('paused');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gamePhase]);

  // Activate Nitro
  const activateNitro = () => {
    if (nitroAmountRef.current >= 20 && !nitroActiveRef.current) {
      nitroActiveRef.current = true;
      setNitroActive(true);
      triggerAudio(800, 'sawtooth', 0.3);
      setTimeout(() => triggerAudio(1200, 'sawtooth', 0.3), 100);

      // Consume Nitro over time
      const nitroInterval = setInterval(() => {
        nitroAmountRef.current = Math.max(0, nitroAmountRef.current - 10);
        setNitroAmount(nitroAmountRef.current);
        if (nitroAmountRef.current <= 0) {
          nitroActiveRef.current = false;
          setNitroActive(false);
          clearInterval(nitroInterval);
        }
      }, 250);
    }
  };

  // Activate Shield
  const activateShield = () => {
    if (shieldCount > 0 && !shieldActiveRef.current) {
      shieldActiveRef.current = true;
      setShieldActive(true);
      setShieldCount(prev => prev - 1);
      triggerAudio(523, 'sine', 0.2);
      setTimeout(() => triggerAudio(659, 'sine', 0.2), 100);
    }
  };

  // Start Race Countdown & Engine
  const startRace = () => {
    setGamePhase('racing');
    setCountdown(3);
    setDistanceCovered(0);
    distanceRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setCrystalsCollected(0);
    crystalsRef.current = 0;
    setNitroAmount(60);
    nitroAmountRef.current = 60;
    setNitroActive(false);
    nitroActiveRef.current = false;
    setShieldActive(false);
    shieldActiveRef.current = false;
    setShieldCount(activeVehicle.shieldRating >= 4 ? 2 : 1);
    setShipX(0);
    shipPosRef.current = 0;
    setRaceTime(0);
    raceTimeRef.current = 0;
    setCheckpointsPassed(0);
    objectsRef.current = [];

    triggerAudio(400, 'sine', 0.15);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        triggerAudio(400 + (3 - count) * 150, 'sine', 0.15);
      } else if (count === 0) {
        setCountdown(0); // GO!
        triggerAudio(880, 'sine', 0.3);
      } else {
        setCountdown(null);
        clearInterval(timer);
      }
    }, 800);
  };

  // MAIN GAME ENGINE LOOP (RAF)
  useEffect(() => {
    if (gamePhase !== 'racing' || countdown !== null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nextObjectId = 1;

    // Spawn Track Object Helper
    const spawnTrackObject = () => {
      const types: ('crystal' | 'boost' | 'shield' | 'gate' | 'asteroid')[] = [
        'crystal', 'crystal', 'crystal', 'asteroid', 'asteroid', 'gate', 'boost', 'shield'
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const randomX = (Math.random() * 1.6) - 0.8; // -0.8 to +0.8

      objectsRef.current.push({
        id: nextObjectId++,
        type: selectedType,
        x: randomX,
        z: 0, // start far away
        speed: activeGalaxy.baseSpeed * (selectedType === 'asteroid' ? 0.9 : 1.0),
        size: selectedType === 'asteroid' ? 24 : selectedType === 'gate' ? 40 : 18
      });
    };

    let spawnTimer = 0;

    const updateAndRender = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      raceTimeRef.current += deltaTime;
      setRaceTime(Math.floor(raceTimeRef.current));

      // Calculate Speed
      const isBoosting = nitroActiveRef.current;
      const speedMultiplier = isBoosting ? 2.2 : 1.0;
      const effectiveSpeed = (activeGalaxy.baseSpeed + activeVehicle.speedRating * 4) * speedMultiplier;
      setCurrentSpeed(Math.floor(effectiveSpeed * 7.5));

      // Advance Distance
      distanceRef.current += effectiveSpeed * deltaTime * 12;
      setDistanceCovered(Math.min(activeGalaxy.trackLengthMeters, Math.floor(distanceRef.current)));

      // Checkpoints
      const progressRatio = distanceRef.current / activeGalaxy.trackLengthMeters;
      if (progressRatio >= 0.25 && checkpointsPassed === 0) setCheckpointsPassed(1);
      if (progressRatio >= 0.50 && checkpointsPassed === 1) setCheckpointsPassed(2);
      if (progressRatio >= 0.75 && checkpointsPassed === 2) setCheckpointsPassed(3);

      // Check Race Finish
      if (distanceRef.current >= activeGalaxy.trackLengthMeters) {
        finishRace(true);
        return;
      }

      // Handle Ship Movement Input
      const steerSpeed = (0.8 + activeVehicle.controlRating * 0.2) * deltaTime * 3.0;
      if (keysPressed.current.left) {
        shipPosRef.current = Math.max(-0.9, shipPosRef.current - steerSpeed);
      }
      if (keysPressed.current.right) {
        shipPosRef.current = Math.min(0.9, shipPosRef.current + steerSpeed);
      }
      setShipX(shipPosRef.current);

      // Spawn Objects
      spawnTimer += deltaTime;
      const spawnInterval = 0.9 / activeGalaxy.obstacleDensity;
      if (spawnTimer >= spawnInterval) {
        spawnTrackObject();
        spawnTimer = 0;
      }

      // Advance & Process Objects (0 = far away, 100 = at player)
      const playerZ = 85;
      const updatedObjects: TrackObject[] = [];

      objectsRef.current.forEach(obj => {
        obj.z += (effectiveSpeed * deltaTime * 1.5);

        // Collision Check when object arrives near player Z
        if (!obj.collected && Math.abs(obj.z - playerZ) < 6) {
          const distanceX = Math.abs(obj.x - shipPosRef.current);
          if (distanceX < 0.28) {
            obj.collected = true;

            // HANDLE OBJECT HIT
            if (obj.type === 'crystal') {
              scoreRef.current += 100;
              setScore(scoreRef.current);
              crystalsRef.current += 1;
              setCrystalsCollected(crystalsRef.current);
              nitroAmountRef.current = Math.min(100, nitroAmountRef.current + 8);
              setNitroAmount(nitroAmountRef.current);
              triggerAudio(900, 'sine', 0.08);
            } else if (obj.type === 'boost') {
              scoreRef.current += 150;
              setScore(scoreRef.current);
              nitroAmountRef.current = Math.min(100, nitroAmountRef.current + 35);
              setNitroAmount(nitroAmountRef.current);
              triggerAudio(1100, 'sawtooth', 0.15);
            } else if (obj.type === 'shield') {
              setShieldCount(prev => Math.min(3, prev + 1));
              triggerAudio(700, 'triangle', 0.15);
            } else if (obj.type === 'gate') {
              scoreRef.current += 300;
              setScore(scoreRef.current);
              nitroAmountRef.current = Math.min(100, nitroAmountRef.current + 20);
              setNitroAmount(nitroAmountRef.current);
              triggerAudio(1200, 'sine', 0.2);
            } else if (obj.type === 'asteroid') {
              if (shieldActiveRef.current) {
                // Shield absorbs collision
                shieldActiveRef.current = false;
                setShieldActive(false);
                triggerAudio(300, 'triangle', 0.2);
              } else {
                // Impact crash
                scoreRef.current = Math.max(0, scoreRef.current - 150);
                setScore(scoreRef.current);
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 300);
                triggerAudio(150, 'sawtooth', 0.3);
              }
            }
          }
        }

        // Keep objects until they pass behind player
        if (obj.z < 110) {
          updatedObjects.push(obj);
        }
      });

      objectsRef.current = updatedObjects;

      // DRAW CANVAS SPACE TRACK
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // 1. SKY & NEBULA BACKDROP
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#04020a');
      skyGrad.addColorStop(0.5, activeGalaxy.themeColor + '20');
      skyGrad.addColorStop(1, '#020106');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. PERSPECTIVE TRACK / ROAD
      const horizonY = height * 0.35;
      const trackTopWidth = width * 0.15;
      const trackBottomWidth = width * 0.85;

      ctx.beginPath();
      ctx.moveTo((width - trackTopWidth) / 2, horizonY);
      ctx.lineTo((width + trackTopWidth) / 2, horizonY);
      ctx.lineTo((width + trackBottomWidth) / 2, height);
      ctx.lineTo((width - trackBottomWidth) / 2, height);
      ctx.closePath();

      const trackGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      trackGrad.addColorStop(0, activeGalaxy.themeColor + '10');
      trackGrad.addColorStop(1, activeGalaxy.themeColor + '30');
      ctx.fillStyle = trackGrad;
      ctx.fill();

      // Track Border Lines
      ctx.strokeStyle = activeGalaxy.themeColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Lane Grid Lines
      ctx.strokeStyle = activeGalaxy.themeColor + '40';
      ctx.lineWidth = 1.5;
      for (let lane = -1; lane <= 1; lane += 1) {
        const topX = (width / 2) + (lane * trackTopWidth * 0.35);
        const botX = (width / 2) + (lane * trackBottomWidth * 0.35);
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(botX, height);
        ctx.stroke();
      }

      // Moving Speed Lines (Grid perspective movement)
      const gridOffset = (distanceRef.current % 100) / 100;
      for (let i = 0; i < 12; i++) {
        const lineZ = (i + gridOffset) / 12;
        const lineY = horizonY + (height - horizonY) * Math.pow(lineZ, 2);
        const lineW = trackTopWidth + (trackBottomWidth - trackTopWidth) * lineZ;

        ctx.strokeStyle = activeGalaxy.themeColor + '35';
        ctx.lineWidth = 1 + lineZ * 2;
        ctx.beginPath();
        ctx.moveTo((width - lineW) / 2, lineY);
        ctx.lineTo((width + lineW) / 2, lineY);
        ctx.stroke();
      }

      // 3. DRAW TRACK OBJECTS (Sorted by Z far to near)
      const sortedObjects = [...objectsRef.current].sort((a, b) => a.z - b.z);

      sortedObjects.forEach(obj => {
        if (obj.collected) return;

        const objZNorm = obj.z / 100; // 0 to 1
        if (objZNorm < 0 || objZNorm > 1.05) return;

        // Calculate 3D perspective projection
        const scale = 0.1 + Math.pow(objZNorm, 2.2) * 0.9;
        const currentTrackWidth = trackTopWidth + (trackBottomWidth - trackTopWidth) * objZNorm;
        const objY = horizonY + (height - horizonY) * Math.pow(objZNorm, 2.2);
        const objX = (width / 2) + (obj.x * currentTrackWidth * 0.45);

        ctx.save();
        ctx.translate(objX, objY);

        if (obj.type === 'crystal') {
          // Glowing Diamond Crystal
          ctx.rotate(timestamp * 0.003);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15 * scale;
          ctx.beginPath();
          ctx.moveTo(0, -15 * scale);
          ctx.lineTo(10 * scale, 0);
          ctx.lineTo(0, 15 * scale);
          ctx.lineTo(-10 * scale, 0);
          ctx.closePath();
          ctx.fill();
        } else if (obj.type === 'boost') {
          // Yellow Lightning Bolt
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20 * scale;
          ctx.font = `${Math.floor(28 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 0);
        } else if (obj.type === 'shield') {
          // Shield Bubble Ring
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3 * scale;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, 18 * scale, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = `${Math.floor(18 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡️', 0, 0);
        } else if (obj.type === 'gate') {
          // Cosmic Arch Gate
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 6 * scale;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 25 * scale;
          ctx.beginPath();
          ctx.arc(0, 0, 35 * scale, Math.PI, 0);
          ctx.stroke();
        } else if (obj.type === 'asteroid') {
          // Jagged Asteroid Rock
          ctx.fillStyle = '#64748b';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2 * scale;
          ctx.shadowColor = '#000';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 20 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.font = `${Math.floor(18 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('☄️', 0, 0);
        }

        ctx.restore();
      });

      // 4. DRAW PLAYER STARSHIP (Bottom centered at shipX)
      const shipScreenX = (width / 2) + (shipPosRef.current * trackBottomWidth * 0.45);
      const shipScreenY = height - 70;

      ctx.save();
      ctx.translate(shipScreenX, shipScreenY);

      // Nitro Exhaust Flames
      if (isBoosting) {
        ctx.fillStyle = '#ff4500';
        ctx.shadowColor = '#ff8c00';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(-12, 15);
        ctx.lineTo(0, 45 + Math.random() * 20);
        ctx.lineTo(12, 15);
        ctx.closePath();
        ctx.fill();
      }

      // Shield Aura Ring
      if (shieldActiveRef.current) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, -10, 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ship Body Graphics
      ctx.fillStyle = activeVehicle.color;
      ctx.shadowColor = activeVehicle.glowColor;
      ctx.shadowBlur = 20;

      // Delta Wing Wings
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(28, 20);
      ctx.lineTo(0, 10);
      ctx.lineTo(-28, 20);
      ctx.closePath();
      ctx.fill();

      // Cockpit Dome
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -12, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(updateAndRender);
    };

    animFrameRef.current = requestAnimationFrame(updateAndRender);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gamePhase, countdown, activeGalaxy, activeVehicle]);

  // Finish Race Function
  const finishRace = (won: boolean) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const timeInSeconds = Math.max(1, Math.floor(raceTimeRef.current));
    const finalScore = scoreRef.current + Math.max(0, 3000 - timeInSeconds * 10);
    const xp = Math.floor(finalScore / 10) + (won ? 150 : 50);
    const coins = Math.floor(crystalsRef.current * 3) + (won ? 80 : 20);

    const isNewBest = !stats.bestTimeSeconds || timeInSeconds < stats.bestTimeSeconds;

    // Update Local Stats
    const updatedStats = {
      racesPlayed: stats.racesPlayed + 1,
      racesWon: won ? stats.racesWon + 1 : stats.racesWon,
      bestTimeSeconds: isNewBest ? timeInSeconds : stats.bestTimeSeconds,
      totalCrystals: stats.totalCrystals + crystalsRef.current,
      highScore: Math.max(stats.highScore, finalScore)
    };
    setStats(updatedStats);
    localStorage.setItem('lodavia_galaxy_rush_stats', JSON.stringify(updatedStats));

    setFinalResults({
      timeSeconds: timeInSeconds,
      score: finalScore,
      crystals: crystalsRef.current,
      xpEarned: xp,
      coinsEarned: coins,
      isNewBest,
      rank: finalScore > 4000 ? 'S+ 🌟' : finalScore > 2500 ? 'A 🥇' : 'B 🥈'
    });

    setGamePhase('results');
    onFinishGame(xp, coins, won);

    triggerAudio(523, 'sine', 0.15);
    setTimeout(() => triggerAudio(659, 'sine', 0.15), 150);
    setTimeout(() => triggerAudio(783, 'sine', 0.3), 300);
  };

  return (
    <div className={`relative w-full min-h-[620px] rounded-3xl bg-[#030208] text-white border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col justify-between select-none ${screenShake ? 'animate-bounce' : ''}`}>
      
      {/* ======================================================== */}
      {/* 1. START MENU SCREEN (شاشة بداية اللعبة) */}
      {/* ======================================================== */}
      {gamePhase === 'menu' && (
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between min-h-[600px] bg-gradient-to-b from-purple-950/40 via-slate-950/80 to-black">
          
          {/* HEADER BAR */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'العودة إلى ألعاب لودافيا' : 'Back to Games'}</span>
            </button>

            {/* SOUND & USER HUD */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-black/60 border border-purple-500/30 rounded-2xl text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? `السباقات: ${stats.racesPlayed}` : `Races: ${stats.racesPlayed}`}</span>
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-slate-900 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* GAME HERO TITLE & LOGO */}
          <div className="my-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-xs font-mono font-black text-cyan-300 shadow-lg"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>GALAXY RUSH • LODAVIA COSMIC RACING</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
              🚀 سباق المجرات
            </h1>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {lang === 'ar' 
                ? 'قد مركبتك المستقبلية عبر المجرات المليئة بالنجوم والكواكب، اجمع البلورات واستخدم النيترو للوصول لخط النهاية!' 
                : 'Pilot futuristic starships through starry skies and nebulae, collect energy crystals, and hit top warp speeds!'}
            </p>

            {/* CURRENT SELECTIONS BADGES */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <span className="px-3 py-1 bg-slate-900/90 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300">
                {activeVehicle.icon} {lang === 'ar' ? activeVehicle.nameAr : activeVehicle.nameEn}
              </span>

              <span className="px-3 py-1 bg-slate-900/90 border border-purple-500/30 rounded-xl text-xs font-bold text-purple-300">
                🌌 {lang === 'ar' ? activeGalaxy.nameAr : activeGalaxy.nameEn}
              </span>
            </div>
          </div>

          {/* MAIN ACTIONS & EXTRA BUTTONS */}
          <div className="max-w-2xl mx-auto w-full space-y-4">
            {/* BIG START BUTTON */}
            <button
              onClick={startRace}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-rose-500 hover:from-cyan-400 hover:to-rose-400 text-white font-black text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>{lang === 'ar' ? 'ابدأ السباق الآن 🚀' : 'Start Race Now 🚀'}</span>
            </button>

            {/* SECONDARY MENU BUTTONS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              <button
                onClick={() => setActiveModal('vehicles')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Rocket className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'اختيار المركبة' : 'Vehicles'}</span>
              </button>

              <button
                onClick={() => setActiveModal('galaxies')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-purple-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-5 h-5 text-purple-400" />
                <span>{lang === 'ar' ? 'اختيار المجرة' : 'Galaxies'}</span>
              </button>

              <button
                onClick={() => setActiveModal('leaderboard')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{lang === 'ar' ? 'المتصدرون' : 'Leaderboard'}</span>
              </button>

              <button
                onClick={() => setActiveModal('achievements')}
                className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-rose-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-5 h-5 text-rose-400" />
                <span>{lang === 'ar' ? 'الإنجازات' : 'Achievements'}</span>
              </button>

              <button
                onClick={() => setActiveModal('howToPlay')}
                className="col-span-2 md:col-span-1 p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-emerald-400/50 rounded-2xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'ar' ? 'كيفية اللعب' : 'How To Play'}</span>
              </button>
            </div>
          </div>

          {/* BOTTOM PLAYER STATS RIBBON */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-around text-center text-xs text-slate-300">
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'أفضل زمن' : 'Best Time'}</p>
              <p className="font-mono font-bold text-cyan-300">{stats.bestTimeSeconds ? `${stats.bestTimeSeconds}s` : '--'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'أعلى نقاط' : 'High Score'}</p>
              <p className="font-mono font-bold text-amber-300">{stats.highScore || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'البلورات الكونية' : 'Total Crystals'}</p>
              <p className="font-mono font-bold text-purple-300">💎 {stats.totalCrystals || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LIVE GAMEPLAY CANVAS & HUD OVERLAY (طريقة اللعب) */}
      {/* ======================================================== */}
      {(gamePhase === 'racing' || gamePhase === 'paused') && (
        <div className="relative w-full h-[620px] bg-black overflow-hidden flex flex-col justify-between">
          
          {/* CANVAS STAGE */}
          <canvas
            ref={canvasRef}
            width={800}
            height={620}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* TOP HUD BAR */}
          <div className="relative z-20 p-4 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between gap-2">
            
            {/* MINI MAP & PROGRESS TRACK */}
            <div className="flex-1 max-w-xs bg-slate-900/80 border border-white/20 p-2 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1 font-mono font-bold">
                <span>🏁 {lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                <span>{Math.floor((distanceCovered / activeGalaxy.trackLengthMeters) * 100)}%</span>
              </div>
              <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(100, (distanceCovered / activeGalaxy.trackLengthMeters) * 100)}%` }}
                />
              </div>
            </div>

            {/* SCORE & CRYSTALS */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono font-black text-xs rounded-xl flex items-center gap-1.5">
                <span>💎 {crystalsCollected}</span>
              </div>

              <div className="px-3 py-1.5 bg-slate-900/90 border border-amber-500/30 text-amber-300 font-mono font-black text-xs rounded-xl">
                <span>{score} PTS</span>
              </div>

              <button
                onClick={() => setGamePhase('paused')}
                className="p-2 bg-slate-800 border border-white/20 rounded-xl text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COUNTDOWN OVERLAY */}
          <AnimatePresence>
            {countdown !== null && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300 font-mono"
                >
                  {countdown === 0 ? (lang === 'ar' ? 'انطلق! 🚀' : 'GO! 🚀') : countdown}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* BOTTOM CONTROLS & GAUGES */}
          <div className="relative z-20 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between gap-4">
            
            {/* SPEEDOMETER & NITRO GAUGE */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>{currentSpeed} KM/H</span>
              </div>

              {/* NITRO BAR */}
              <div className="w-36 bg-slate-900 border border-rose-500/30 p-1.5 rounded-2xl space-y-1">
                <div className="flex justify-between text-[10px] text-rose-300 font-bold">
                  <span>🔥 NITRO</span>
                  <span>{nitroAmount}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${nitroActive ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`}
                    style={{ width: `${nitroAmount}%` }}
                  />
                </div>
              </div>
            </div>

            {/* TOUCH CONTROLS (FOR MOBILE & EASY CLICKING) */}
            <div className="flex items-center gap-2">
              <button
                onMouseDown={() => { keysPressed.current.left = true; }}
                onMouseUp={() => { keysPressed.current.left = false; }}
                onTouchStart={() => { keysPressed.current.left = true; }}
                onTouchEnd={() => { keysPressed.current.left = false; }}
                className="w-14 h-14 bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/50 rounded-2xl text-2xl font-black text-cyan-300 flex items-center justify-center active:scale-95 shadow-lg"
              >
                ←
              </button>

              <button
                onClick={activateNitro}
                className={`w-14 h-14 rounded-2xl text-xs font-black flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-lg ${
                  nitroAmount >= 20 ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white animate-pulse' : 'bg-slate-900 text-slate-500 border border-white/10'
                }`}
              >
                <Flame className="w-5 h-5" />
                <span>NITRO</span>
              </button>

              <button
                onClick={activateShield}
                className={`w-14 h-14 rounded-2xl text-xs font-black flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-lg ${
                  shieldCount > 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white' : 'bg-slate-900 text-slate-500 border border-white/10'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>{shieldCount}</span>
              </button>

              <button
                onMouseDown={() => { keysPressed.current.right = true; }}
                onMouseUp={() => { keysPressed.current.right = false; }}
                onTouchStart={() => { keysPressed.current.right = true; }}
                onTouchEnd={() => { keysPressed.current.right = false; }}
                className="w-14 h-14 bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/50 rounded-2xl text-2xl font-black text-cyan-300 flex items-center justify-center active:scale-95 shadow-lg"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAUSED MODAL */}
      <AnimatePresence>
        {gamePhase === 'paused' && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-purple-500/30 p-6 rounded-3xl text-center space-y-6">
              <h2 className="text-2xl font-black text-white">⏸️ {lang === 'ar' ? 'السباق متوقف مؤقتاً' : 'Race Paused'}</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setGamePhase('racing')}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer"
                >
                  {lang === 'ar' ? 'استئناف السباق ▶️' : 'Resume Race ▶️'}
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
      {/* 3. RACE RESULTS SCREEN (شاشة النتائج) */}
      {/* ======================================================== */}
      {gamePhase === 'results' && finalResults && (
        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between min-h-[600px] bg-gradient-to-b from-purple-950/80 via-slate-950 to-black text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="inline-block p-4 bg-purple-600/20 border border-purple-400/30 rounded-full text-amber-400 shadow-2xl">
              <Trophy className="w-12 h-12 animate-bounce" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white">
              🏁 {lang === 'ar' ? 'انتهى السباق بنجاح!' : 'Race Completed!'}
            </h2>

            <p className="text-xs text-slate-300">
              {lang === 'ar' ? 'وصلت خط النهاية واستكشفت أعماق المجرة بنجاح!' : 'You crossed the finish line in record time!'}
            </p>

            {finalResults.isNewBest && (
              <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black rounded-full">
                🎉 {lang === 'ar' ? 'أفضل زمن قياسي جديد!' : 'New Personal Best Record!'}
              </span>
            )}
          </motion.div>

          {/* RESULTS METRICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto w-full">
            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'الترتيب' : 'Rank'}</p>
              <p className="text-xl font-black text-amber-300">{finalResults.rank}</p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'الزمن' : 'Time'}</p>
              <p className="text-xl font-mono font-black text-cyan-300">{finalResults.timeSeconds}s</p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'إجمالي النقاط' : 'Score'}</p>
              <p className="text-xl font-mono font-black text-purple-300">{finalResults.score}</p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'البلورات المجمعة' : 'Crystals'}</p>
              <p className="text-xl font-mono font-black text-emerald-300">💎 {finalResults.crystals}</p>
            </div>
          </div>

          {/* XP & COINS REWARDS */}
          <div className="p-4 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30 rounded-2xl max-w-md mx-auto w-full flex items-center justify-around font-mono font-bold text-xs">
            <span className="text-purple-300">+{finalResults.xpEarned} XP</span>
            <span className="text-yellow-300">+{finalResults.coinsEarned} 🪙</span>
          </div>

          {/* RESULTS ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
            <button
              onClick={startRace}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'ar' ? 'السباق مرة أخرى' : 'Race Again'}</span>
            </button>

            <button
              onClick={() => setGamePhase('menu')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'ar' ? 'العودة إلى الألعاب' : 'Return to Games'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODALS (VEHICLES, GALAXIES, LEADERBOARD, ACHIEVEMENTS, HOW TO PLAY) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full bg-slate-900 border border-purple-500/40 p-6 rounded-3xl max-h-[85vh] overflow-y-auto space-y-6 text-slate-100"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {activeModal === 'vehicles' && (lang === 'ar' ? '🚀 اختيار المركبة الفضائية' : '🚀 Select Starship')}
                  {activeModal === 'galaxies' && (lang === 'ar' ? '🌌 اختيار المجرة والمسار' : '🌌 Select Galaxy Track')}
                  {activeModal === 'leaderboard' && (lang === 'ar' ? '🏆 المتصدرون في سباق المجرات' : '🏆 Leaderboards')}
                  {activeModal === 'achievements' && (lang === 'ar' ? '🏅 إنجازات اللعبة' : '🏅 Achievements')}
                  {activeModal === 'howToPlay' && (lang === 'ar' ? '📜 كيفية اللعب والتحكم' : '📜 How to Play')}
                </h3>

                <button
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300"
                >
                  ✕
                </button>
              </div>

              {/* MODAL 1: VEHICLES SELECTION */}
              {activeModal === 'vehicles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehiclesList.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicleId(v.id);
                        setActiveModal(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedVehicleId === v.id
                          ? 'bg-purple-900/50 border-cyan-400 shadow-xl scale-[1.02]'
                          : 'bg-slate-950/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{v.icon}</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-300">
                          {selectedVehicleId === v.id ? (lang === 'ar' ? 'المحددة حالياً ✅' : 'Selected ✅') : ''}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-white text-sm">{lang === 'ar' ? v.nameAr : v.nameEn}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{lang === 'ar' ? v.descAr : v.descEn}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-400">SPEED</span>
                          <p className="text-cyan-300 font-bold">{"★".repeat(v.speedRating)}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">CONTROL</span>
                          <p className="text-purple-300 font-bold">{"★".repeat(v.controlRating)}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">SHIELD</span>
                          <p className="text-amber-300 font-bold">{"★".repeat(v.shieldRating)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL 2: GALAXIES SELECTION */}
              {activeModal === 'galaxies' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galaxiesList.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        setSelectedGalaxyId(g.id);
                        setActiveModal(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-gradient-to-br ${g.bgGradient} ${
                        selectedGalaxyId === g.id
                          ? 'border-cyan-400 shadow-xl scale-[1.02]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-300">{lang === 'ar' ? g.difficultyAr : g.difficultyEn}</span>
                        <span className="text-[10px] font-mono text-cyan-300">{g.trackLengthMeters}m</span>
                      </div>

                      <div>
                        <h4 className="font-black text-white text-sm">{lang === 'ar' ? g.nameAr : g.nameEn}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{lang === 'ar' ? g.descAr : g.descEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL 3: LEADERBOARD */}
              {activeModal === 'leaderboard' && (
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'سارة الكونية 🌟', score: 8450, time: '1m 12s' },
                    { rank: 2, name: 'الكابتن طارق 🚀', score: 7920, time: '1m 18s' },
                    { rank: 3, name: 'فهد المطيري 👾', score: 7100, time: '1m 25s' }
                  ].map(user => (
                    <div key={user.rank} className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold">{user.rank}</span>
                        <span className="font-bold text-white">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono font-bold">
                        <span className="text-cyan-300">{user.time}</span>
                        <span className="text-amber-300">{user.score} PTS</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL 4: ACHIEVEMENTS */}
              {activeModal === 'achievements' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center gap-3">
                    <span className="text-2xl">🏎️</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{lang === 'ar' ? 'طيار الضوء الكوني' : 'Light Speed Racer'}</h4>
                      <p className="text-[10px] text-slate-300">{lang === 'ar' ? 'أكمل سباق المجرات بنجاح برقم قياسي' : 'Cross the finish line in Galaxy Rush'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 5: HOW TO PLAY */}
              {activeModal === 'howToPlay' && (
                <div className="space-y-4 text-xs text-slate-200 leading-relaxed">
                  <div className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl space-y-2">
                    <p className="font-bold text-cyan-300">🎮 {lang === 'ar' ? 'التحكم بالكمبيوتر:' : 'Desktop Controls:'}</p>
                    <p>• {lang === 'ar' ? 'الأسهم اليسار/اليمين أو مفاتيح A / D للتحريك جانباً.' : 'Left / Right Arrow or A / D keys to steer.'}</p>
                    <p>• {lang === 'ar' ? 'السهم الأعلى / المسافة / W لتفعيل النيترو 🔥.' : 'Up Arrow / Space / W to trigger Nitro 🔥.'}</p>
                    <p>• {lang === 'ar' ? 'السهم الأسفل / S / Shift لتشغيل الدرع 🛡️.' : 'Down Arrow / S / Shift to activate Shield 🛡️.'}</p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl space-y-2">
                    <p className="font-bold text-amber-300">📱 {lang === 'ar' ? 'التحكم بالهاتف:' : 'Mobile Controls:'}</p>
                    <p>• {lang === 'ar' ? 'استخدم أزرار اللمس الواضحة في أسفل الشاشة.' : 'Use responsive on-screen touch buttons.'}</p>
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
