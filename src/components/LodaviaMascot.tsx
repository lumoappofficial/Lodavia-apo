import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type MascotGender = 'male' | 'female';

export type MascotSkin = 
  | 'default'
  | 'starlight'
  | 'cyber'
  | 'royal'
  | 'astronaut'
  | 'galaxy'
  | 'neon'
  | 'explorer';

export interface MascotConfig {
  gender: MascotGender;
  skin: MascotSkin;
  isConfigured: boolean;
}

interface LodaviaMascotProps {
  gender?: MascotGender;
  skin?: MascotSkin;
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  showAura?: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  state?: 'idle' | 'thinking' | 'speaking';
}

export const SKIN_DEFINITIONS: Record<MascotSkin, {
  nameAr: string;
  nameEn: string;
  price: number;
  gradientFrom: string;
  gradientTo: string;
  visorGlow: string;
  accentColor: string;
  headGradient: [string, string, string];
  visorGradient: [string, string];
  chestGradient: [string, string];
  eyeColor: string;
}> = {
  default: {
    nameAr: 'الكوني المضيء (الافتراضي)',
    nameEn: 'Cosmic Neon (Default)',
    price: 0,
    gradientFrom: '#8b5cf6',
    gradientTo: '#06b6d4',
    visorGlow: 'rgba(6,182,212,0.6)',
    accentColor: '#38bdf8',
    headGradient: ['#1e1b4b', '#312e81', '#4338ca'],
    visorGradient: ['#0284c7', '#38bdf8'],
    chestGradient: ['#6366f1', '#a855f7'],
    eyeColor: '#e0f2fe'
  },
  starlight: {
    nameAr: 'ضوء النجوم',
    nameEn: 'Starlight Nebula',
    price: 0,
    gradientFrom: '#3b82f6',
    gradientTo: '#8b5cf6',
    visorGlow: 'rgba(139,92,246,0.6)',
    accentColor: '#c084fc',
    headGradient: ['#0f172a', '#1e1b4b', '#2e1065'],
    visorGradient: ['#7c3aed', '#c084fc'],
    chestGradient: ['#3b82f6', '#8b5cf6'],
    eyeColor: '#f5d0fe'
  },
  cyber: {
    nameAr: 'السايبر المستقبلي',
    nameEn: 'Cyber Matrix',
    price: 50,
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
    visorGlow: 'rgba(16,185,129,0.7)',
    accentColor: '#34d399',
    headGradient: ['#022c22', '#064e3b', '#047857'],
    visorGradient: ['#059669', '#34d399'],
    chestGradient: ['#10b981', '#06b6d4'],
    eyeColor: '#ecfdf5'
  },
  royal: {
    nameAr: 'الملكي الذهبي',
    nameEn: 'Royal Celestial',
    price: 100,
    gradientFrom: '#f59e0b',
    gradientTo: '#7c3aed',
    visorGlow: 'rgba(245,158,11,0.7)',
    accentColor: '#fbbf24',
    headGradient: ['#451a03', '#78350f', '#b45309'],
    visorGradient: ['#d97706', '#fbbf24'],
    chestGradient: ['#7c3aed', '#f59e0b'],
    eyeColor: '#fffbeb'
  },
  astronaut: {
    nameAr: 'رائد الفضاء',
    nameEn: 'Astronaut Pioneer',
    price: 150,
    gradientFrom: '#e2e8f0',
    gradientTo: '#38bdf8',
    visorGlow: 'rgba(226,232,240,0.8)',
    accentColor: '#f8fafc',
    headGradient: ['#334155', '#475569', '#64748b'],
    visorGradient: ['#0284c7', '#f8fafc'],
    chestGradient: ['#38bdf8', '#e2e8f0'],
    eyeColor: '#ffffff'
  },
  galaxy: {
    nameAr: 'المجرة الوردي',
    nameEn: 'Galaxy Supernova',
    price: 200,
    gradientFrom: '#ec4899',
    gradientTo: '#8b5cf6',
    visorGlow: 'rgba(236,72,153,0.7)',
    accentColor: '#f472b6',
    headGradient: ['#500724', '#831843', '#be185d'],
    visorGradient: ['#db2777', '#f472b6'],
    chestGradient: ['#ec4899', '#a855f7'],
    eyeColor: '#fce7f3'
  },
  neon: {
    nameAr: 'النيون الفائق',
    nameEn: 'Hyper Neon',
    price: 250,
    gradientFrom: '#f43f5e',
    gradientTo: '#06b6d4',
    visorGlow: 'rgba(244,63,94,0.7)',
    accentColor: '#fb7185',
    headGradient: ['#4c0519', '#881337', '#be123c'],
    visorGradient: ['#e11d48', '#38bdf8'],
    chestGradient: ['#f43f5e', '#06b6d4'],
    eyeColor: '#ffe4e6'
  },
  explorer: {
    nameAr: 'المستكشف المجرّي',
    nameEn: 'Quantum Explorer',
    price: 300,
    gradientFrom: '#84cc16',
    gradientTo: '#06b6d4',
    visorGlow: 'rgba(132,204,22,0.7)',
    accentColor: '#a3e635',
    headGradient: ['#1a2e05', '#365314', '#4d7c0f'],
    visorGradient: ['#65a30d', '#a3e635'],
    chestGradient: ['#84cc16', '#06b6d4'],
    eyeColor: '#f7fee7'
  }
};

export default function LodaviaMascot({
  gender = 'male',
  skin = 'default',
  size = 64,
  animated = true,
  interactive = true,
  onClick,
  className = '',
  showAura = true,
  isThinking = false,
  isSpeaking = false,
  state
}: LodaviaMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const skinDef = SKIN_DEFINITIONS[skin] || SKIN_DEFINITIONS.default;

  const isCurrentlyThinking = isThinking || state === 'thinking';
  const isCurrentlySpeaking = isSpeaking || state === 'speaking';

  // Periodic subtle blinking effect
  useEffect(() => {
    if (!animated || isCurrentlyThinking) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3800 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, [animated, isCurrentlyThinking]);

  const currentAriaLabel = `Lodavia AI Companion ${
    isCurrentlyThinking ? 'Processing' : isCurrentlySpeaking ? 'Speaking' : 'Idle'
  }`;

  return (
    <motion.div
      onClick={onClick}
      whileHover={interactive ? { scale: 1.08, y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.92, rotate: -4 } : undefined}
      className={`relative flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Glow Aura */}
      {showAura && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{ 
            background: isCurrentlyThinking 
              ? 'rgba(168,85,247,0.75)' 
              : isCurrentlySpeaking 
              ? 'rgba(6,182,212,0.85)' 
              : skinDef.visorGlow 
          }}
          animate={
            isCurrentlyThinking
              ? { scale: [1, 1.3, 1], opacity: [0.6, 0.95, 0.6] }
              : isCurrentlySpeaking
              ? { scale: [0.95, 1.2, 0.95], opacity: [0.7, 1, 0.7] }
              : animated
              ? { scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.8, 0.5] }
              : undefined
          }
          transition={{ 
            duration: isCurrentlySpeaking ? 0.6 : isCurrentlyThinking ? 1.2 : 3.2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      )}

      {/* Mascot Animated Body Container */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={currentAriaLabel}
        className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        animate={
          isCurrentlyThinking
            ? { y: [0, -4, 0], scale: [1, 1.03, 1] }
            : isCurrentlySpeaking
            ? { y: [-1, -3, -1] }
            : animated
            ? { y: [0, -3, 0] }
            : undefined
        }
        transition={{ 
          duration: isCurrentlySpeaking ? 0.8 : isCurrentlyThinking ? 1.5 : 3.5, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      >
        <defs>
          {/* Head & Body Gradients */}
          <linearGradient id={`headGrad-${skin}-${gender}`} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skinDef.headGradient[0]} />
            <stop offset="50%" stopColor={skinDef.headGradient[1]} />
            <stop offset="100%" stopColor={skinDef.headGradient[2]} />
          </linearGradient>

          <linearGradient id={`visorGrad-${skin}-${gender}`} x1="20" y1="30" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skinDef.visorGradient[0]} />
            <stop offset="100%" stopColor={skinDef.visorGradient[1]} />
          </linearGradient>

          <linearGradient id={`chestGrad-${skin}-${gender}`} x1="30" y1="65" x2="70" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skinDef.chestGradient[0]} />
            <stop offset="100%" stopColor={skinDef.chestGradient[1]} />
          </linearGradient>

          {/* Glowing Filters */}
          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- THINKING ORBITAL RING --- */}
        {isCurrentlyThinking && (
          <motion.g
            style={{ transformOrigin: "50px 42px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            <ellipse cx="50" cy="42" rx="42" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.8" />
            <circle cx="92" cy="42" r="3" fill="#a855f7" filter="url(#glowCyan)" />
            <circle cx="8" cy="42" r="3" fill="#38bdf8" filter="url(#glowCyan)" />
          </motion.g>
        )}

        {/* --- BACK/EAR ANTENNAE & DETAILS --- */}
        {gender === 'male' ? (
          /* Lumo (Male) Side Pod Antennae */
          <>
            <circle cx="16" cy="40" r="7" fill={`url(#chestGrad-${skin}-${gender})`} stroke={skinDef.accentColor} strokeWidth="1.5" />
            <circle cx="84" cy="40" r="7" fill={`url(#chestGrad-${skin}-${gender})`} stroke={skinDef.accentColor} strokeWidth="1.5" />
            <path d="M50 12 L50 2" stroke={skinDef.accentColor} strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Top Node Light */}
            <motion.circle 
              cx="50" 
              cy="2" 
              r="3.5" 
              fill={isCurrentlyThinking ? "#a855f7" : isCurrentlySpeaking ? "#38bdf8" : skinDef.accentColor}
              animate={isCurrentlyThinking || isCurrentlySpeaking ? { scale: [1, 1.4, 1] } : undefined}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </>
        ) : (
          /* Nova (Female) Side Wings & Star Crown */
          <>
            {/* Cute side wing visors / ears */}
            <path d="M12 36 Q4 28 16 22 Z" fill={skinDef.accentColor} opacity="0.9" />
            <path d="M88 36 Q96 28 84 22 Z" fill={skinDef.accentColor} opacity="0.9" />
            <circle cx="16" cy="38" r="6" fill={`url(#chestGrad-${skin}-${gender})`} stroke="#fff" strokeWidth="1" />
            <circle cx="84" cy="38" r="6" fill={`url(#chestGrad-${skin}-${gender})`} stroke="#fff" strokeWidth="1" />
            {/* Star Crown Antenna */}
            <path d="M50 14 L50 4" stroke={skinDef.accentColor} strokeWidth="2" strokeLinecap="round" />
            <polygon points="50,1 52,5 56,5 53,8 54,12 50,9 46,12 47,8 44,5 48,5" fill={isCurrentlyThinking ? "#c084fc" : "#fef08a"} />
          </>
        )}

        {/* --- MAIN HELMET / HEAD --- */}
        <rect
          x="18"
          y="16"
          width="64"
          height="54"
          rx="27"
          fill={`url(#headGrad-${skin}-${gender})`}
          stroke={isCurrentlyThinking ? "#a855f7" : isCurrentlySpeaking ? "#38bdf8" : skinDef.accentColor}
          strokeWidth="2"
        />

        {/* Helmet Top Shimmer Highlight */}
        <path d="M26 22 Q50 17 74 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* --- VISOR SCREEN --- */}
        <rect
          x="24"
          y="26"
          width="52"
          height="32"
          rx="16"
          fill="#030712"
          stroke={isCurrentlyThinking ? "#c084fc" : isCurrentlySpeaking ? "#38bdf8" : skinDef.accentColor}
          strokeWidth="1.5"
        />

        {/* Inner Visor Glow Layer */}
        <rect
          x="26"
          y="28"
          width="48"
          height="28"
          rx="14"
          fill={`url(#visorGrad-${skin}-${gender})`}
          opacity={isCurrentlyThinking ? 0.6 : isCurrentlySpeaking ? 0.5 : 0.35}
        />

        {/* --- EYES & EXPRESSION & SPEAKING MOUTH WAVE --- */}
        {isCurrentlyThinking ? (
          /* Thinking Visor Animation: Futuristic Pulsing Quantum Wave & Concentric Light Lines */
          <>
            <motion.path
              d="M32 42 Q50 36 68 42"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 1, 0.3], d: ["M32 42 Q50 36 68 42", "M32 42 Q50 48 68 42", "M32 42 Q50 36 68 42"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle cx="38" cy="42" r="2.5" fill="#a855f7" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            <motion.circle cx="50" cy="42" r="2.5" fill="#38bdf8" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }} />
            <motion.circle cx="62" cy="42" r="2.5" fill="#c084fc" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }} />
          </>
        ) : isBlinking ? (
          /* Blinking Eye Lines */
          <>
            <line x1="36" y1="40" x2="44" y2="40" stroke={skinDef.eyeColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="56" y1="40" x2="64" y2="40" stroke={skinDef.eyeColor} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : gender === 'male' ? (
          /* Lumo (Male) Eyes - Friendly Rounded Cosmic Eyes */
          <>
            <circle cx="40" cy="40" r="5" fill={skinDef.eyeColor} />
            <circle cx="41.5" cy="38.5" r="2" fill="#030712" />
            <circle cx="60" cy="40" r="5" fill={skinDef.eyeColor} />
            <circle cx="61.5" cy="38.5" r="2" fill="#030712" />
            
            {/* Cute Happy Smile / Speaking Equalizer Mouth Pulse */}
            {isCurrentlySpeaking ? (
              <g id="speaking-mouth-pulse">
                {/* Equalizer light wave pulse inside visor */}
                <motion.line x1="42" y1="49" x2="42" y2="52" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" animate={{ y1: [49, 46, 49], y2: [52, 53, 52] }} transition={{ duration: 0.3, repeat: Infinity }} />
                <motion.line x1="47" y1="48" x2="47" y2="53" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" animate={{ y1: [48, 45, 48], y2: [53, 54, 53] }} transition={{ duration: 0.25, delay: 0.05, repeat: Infinity }} />
                <motion.line x1="52" y1="48" x2="52" y2="53" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" animate={{ y1: [48, 44, 48], y2: [53, 54, 53] }} transition={{ duration: 0.25, delay: 0.1, repeat: Infinity }} />
                <motion.line x1="57" y1="49" x2="57" y2="52" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" animate={{ y1: [49, 46, 49], y2: [52, 53, 52] }} transition={{ duration: 0.3, delay: 0.15, repeat: Infinity }} />
              </g>
            ) : (
              <path d="M46 47 Q50 51 54 47" stroke={skinDef.eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
          </>
        ) : (
          /* Nova (Female) Eyes - Cute Sparkle Eyes */
          <>
            <ellipse cx="40" cy="40" rx="4.5" ry="5.5" fill={skinDef.eyeColor} />
            <circle cx="41.5" cy="38" r="1.8" fill="#030712" />
            <path d="M35 36 Q38 33 44 35" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            
            <ellipse cx="60" cy="40" rx="4.5" ry="5.5" fill={skinDef.eyeColor} />
            <circle cx="61.5" cy="38" r="1.8" fill="#030712" />
            <path d="M56 35 Q62 33 65 36" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Speaking / Smile Mouth */}
            {isCurrentlySpeaking ? (
              <g id="nova-speaking-mouth">
                <motion.line x1="44" y1="49" x2="44" y2="52" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" animate={{ y1: [49, 46, 49] }} transition={{ duration: 0.25, repeat: Infinity }} />
                <motion.line x1="49" y1="48" x2="49" y2="53" stroke="#fff" strokeWidth="2" strokeLinecap="round" animate={{ y1: [48, 44, 48] }} transition={{ duration: 0.22, delay: 0.05, repeat: Infinity }} />
                <motion.line x1="54" y1="48" x2="54" y2="53" stroke="#fff" strokeWidth="2" strokeLinecap="round" animate={{ y1: [48, 44, 48] }} transition={{ duration: 0.22, delay: 0.1, repeat: Infinity }} />
                <motion.line x1="59" y1="49" x2="59" y2="52" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" animate={{ y1: [49, 46, 49] }} transition={{ duration: 0.25, delay: 0.15, repeat: Infinity }} />
              </g>
            ) : (
              <path d="M47 47 Q50 50 53 47" stroke={skinDef.eyeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            )}
            {/* Blush cheeks */}
            <circle cx="32" cy="44" r="2" fill="#f472b6" opacity="0.6" />
            <circle cx="68" cy="44" r="2" fill="#f472b6" opacity="0.6" />
          </>
        )}

        {/* --- LOWER BODY / CHEST SUIT --- */}
        <path
          d="M32 68 Q50 64 68 68 L74 86 Q50 92 26 86 Z"
          fill={`url(#chestGrad-${skin}-${gender})`}
          stroke={isCurrentlyThinking ? "#a855f7" : isCurrentlySpeaking ? "#38bdf8" : skinDef.accentColor}
          strokeWidth="1.5"
        />

        {/* Lodavia Star Chest Emblem */}
        <motion.g 
          transform="translate(50, 77) scale(0.65)"
          animate={isCurrentlySpeaking || isCurrentlyThinking ? { scale: [0.65, 0.8, 0.65] } : undefined}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill={isCurrentlyThinking ? "#c084fc" : isCurrentlySpeaking ? "#38bdf8" : "#ffffff"} />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
