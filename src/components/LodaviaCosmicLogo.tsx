import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  animated?: boolean;
  themeMode?: 'dark' | 'light' | 'system';
  variant?: 'icon' | 'logo' | 'aura' | 'vector';
}

export default function LodaviaCosmicLogo({
  className = '',
  size = 64,
  glow = true,
  animated = true,
  themeMode = 'dark',
  variant = 'icon'
}: LogoProps) {
  
  // Custom elegant 4-pointed compass star path generator
  const starPath = (cx: number, cy: number, r: number) => {
    return `M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Z`;
  };

  // If the user wants the horizontal wordmark logo directly
  if (variant === 'logo') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: size * 2.8, height: size }}
        id="lodavia-logo-wordmark"
      >
        {glow && (
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-purple-500/15 to-orange-400/20 rounded-full blur-xl animate-pulse pointer-events-none" />
        )}
        <span className="text-xl font-black tracking-[0.3em] bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
          LODAVIA
        </span>
      </div>
    );
  }

  // If the user wants the Aura logo directly
  if (variant === 'aura') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: size * 2.5, height: size }}
        id="lodavia-logo-aura"
      >
        {glow && (
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />
        )}
        <span className="text-xl font-black tracking-[0.3em] bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
          AURA
        </span>
      </div>
    );
  }

  // Default: App Icon inside Cosmic Orbit Ring
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id="lodavia-logo-container"
    >
      {/* 1. Ambient Background Aura (Luxury Cosmic Glow) */}
      {glow && (
        <div 
          className="absolute inset-[-15%] bg-gradient-to-tr from-cyan-500/25 via-purple-500/10 to-amber-400/20 rounded-full blur-lg animate-pulse" 
          style={{ animationDuration: '6s' }}
        />
      )}

      {/* SVG Orbits Overlay */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      >
        <defs>
          {/* Brand Premium Gradients */}
          <linearGradient id="lodavia-grad-cyan" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#27D3FF" />
            <stop offset="50%" stopColor="#00F2FE" />
            <stop offset="100%" stopColor="#0072FF" />
          </linearGradient>

          <linearGradient id="lodavia-grad-gold" x1="20" y1="100" x2="100" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="40%" stopColor="#FF9E45" />
            <stop offset="100%" stopColor="#FFD76A" />
          </linearGradient>

          <linearGradient id="lodavia-grad-white" x1="40" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#27D3FF" />
          </linearGradient>

          {/* Glowing Filters */}
          <filter id="lodavia-glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="lodavia-glow-subtle" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <style>
            {`
              @keyframes lodavia-spin-clockwise {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes lodavia-spin-counter {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
              }
              @keyframes lodavia-sparkle {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }

              .lodavia-orbit-group-1 {
                transform-origin: 60px 60px;
                animation: ${animated ? 'lodavia-spin-clockwise 32s linear infinite' : 'none'};
              }
              .lodavia-orbit-group-2 {
                transform-origin: 60px 60px;
                animation: ${animated ? 'lodavia-spin-counter 26s linear infinite' : 'none'};
              }
              .lodavia-sparkle-1 {
                transform-origin: 25px 35px;
                animation: ${animated ? 'lodavia-sparkle 3s infinite ease-in-out' : 'none'};
              }
              .lodavia-sparkle-2 {
                transform-origin: 95px 85px;
                animation: ${animated ? 'lodavia-sparkle 2.5s infinite ease-in-out' : 'none'};
              }
              .lodavia-sparkle-3 {
                transform-origin: 90px 30px;
                animation: ${animated ? 'lodavia-sparkle 3.5s infinite ease-in-out' : 'none'};
              }
            `}
          </style>
        </defs>

        {/* Outer Fine Stellar Tracker / Coordinates */}
        <circle 
          cx="60" 
          cy="60" 
          r="48" 
          stroke="url(#lodavia-grad-cyan)" 
          strokeOpacity="0.15" 
          strokeWidth="0.75" 
          strokeDasharray="4 8" 
          className="lodavia-orbit-group-1"
        />

        {/* Cosmic Gyroscopic Intersecting Orbits (The Core Loop Structure) */}
        {/* Loop A (Tilted Cyan-Blue Orbit) */}
        <g className="lodavia-orbit-group-1">
          <ellipse 
            cx="60" 
            cy="60" 
            rx="41" 
            ry="15" 
            transform="rotate(-30 60 60)" 
            stroke="url(#lodavia-grad-cyan)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeOpacity="0.85"
            filter={glow ? "url(#lodavia-glow-subtle)" : undefined}
          />
          <circle cx="20" cy="60" r="3.5" fill="#FFFFFF" filter="url(#lodavia-glow-subtle)" />
          <circle cx="100" cy="60" r="2.5" fill="#27D3FF" />
        </g>

        {/* Loop B (Tilted Orange-Gold Orbit) */}
        <g className="lodavia-orbit-group-2">
          <ellipse 
            cx="60" 
            cy="60" 
            rx="41" 
            ry="15" 
            transform="rotate(30 60 60)" 
            stroke="url(#lodavia-grad-gold)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeOpacity="0.85"
            filter={glow ? "url(#lodavia-glow-subtle)" : undefined}
          />
          <circle cx="60" cy="20" r="3.5" fill="#FFFFFF" filter="url(#lodavia-glow-subtle)" />
          <circle cx="60" cy="100" r="2.5" fill="#FF9E45" />
        </g>

        {/* Loop C (Vertical-ish Connection Loop representing AI & Human Fusion) */}
        <g className="lodavia-orbit-group-1">
          <ellipse 
            cx="60" 
            cy="60" 
            rx="41" 
            ry="15" 
            transform="rotate(90 60 60)" 
            stroke="url(#lodavia-grad-white)" 
            strokeWidth="1.8" 
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
        </g>

        {/* Fine Connection Coordinates / Constellation Constrain lines */}
        <line x1="25" y1="35" x2="60" y2="60" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="2 2" />
        <line x1="95" y1="85" x2="60" y2="60" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="2 2" />
        <line x1="90" y1="30" x2="60" y2="60" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="2 2" />

        {/* Micro Sparkles in background */}
        <g>
          <path d={starPath(25, 35, 4.5)} fill="#FFD76A" className="lodavia-sparkle-1" />
          <path d={starPath(95, 85, 4)} fill="#27D3FF" className="lodavia-sparkle-2" />
          <path d={starPath(90, 30, 3.5)} fill="#FFFFFF" className="lodavia-sparkle-3" />
        </g>
      </svg>

      {/* 2. Central Core Emblem */}
      <div 
        className="absolute w-[44%] h-[44%] rounded-full overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] z-0 flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-indigo-600"
        style={{
          top: '28%',
          left: '28%'
        }}
      >
        <span className="text-white font-black text-lg select-none">
          L
        </span>
      </div>
    </div>
  );
}
