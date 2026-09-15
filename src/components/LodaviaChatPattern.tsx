import React from 'react';

interface LodaviaChatPatternProps {
  patternStyle?: 'doodle' | 'grid' | 'nebula' | 'plain';
  opacity?: number;
}

export function LodaviaChatPattern({ 
  patternStyle = 'doodle', 
  opacity = 0.08 
}: LodaviaChatPatternProps) {
  if (patternStyle === 'plain') return null;

  if (patternStyle === 'grid') {
    return (
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300" 
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: opacity * 2.5
        }} 
      />
    );
  }

  if (patternStyle === 'nebula') {
    return (
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px]" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-[90px]" />
      </div>
    );
  }

  // Default: Lodavia Cosmic Doodle Pattern (WhatsApp style with Lodavia cosmic elements)
  return (
    <div 
      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <svg className="w-full h-full text-slate-700 dark:text-cyan-200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="lodavia-cosmic-doodles" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
            {/* Star 1 */}
            <path d="M20 10 L22 16 L28 18 L22 20 L20 26 L18 20 L12 18 L18 16 Z" fill="currentColor" opacity="0.8" />
            {/* Planet with Ring */}
            <circle cx="85" cy="25" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <ellipse cx="85" cy="25" rx="13" ry="4" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-15 85 25)" />
            {/* Rocket */}
            <path d="M35 70 L39 62 Q45 55 52 50 L50 65 L42 73 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <circle cx="43" cy="63" r="1.5" fill="currentColor" />
            {/* Sparkle */}
            <path d="M110 80 L111 84 L115 85 L111 86 L110 90 L109 86 L105 85 L109 84 Z" fill="currentColor" />
            {/* Chat Bubble Doodle */}
            <path d="M15 105 C15 100 20 95 28 95 C36 95 41 100 41 105 C41 108 39 111 35 113 L36 117 L31 114 C29 114.5 28 115 28 115 C20 115 15 110 15 105 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            {/* Satellite / Node */}
            <rect x="85" y="105" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="81" y1="108" x2="85" y2="108" stroke="currentColor" strokeWidth="1" />
            <line x1="93" y1="108" x2="97" y2="108" stroke="currentColor" strokeWidth="1" />
            {/* Moon Crescent */}
            <path d="M120 20 A6 6 0 1 0 126 26 A5 5 0 0 1 120 20 Z" fill="currentColor" />
            {/* Shield */}
            <path d="M60 15 L68 18 V25 C68 30 63 34 60 36 C57 34 52 30 52 25 V18 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            {/* Constellation Dots & Lines */}
            <circle cx="10" cy="50" r="1.5" fill="currentColor" />
            <circle cx="22" cy="45" r="1.5" fill="currentColor" />
            <line x1="10" y1="50" x2="22" y2="45" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1" />
            {/* Little Quantum Loop */}
            <ellipse cx="65" cy="85" rx="8" ry="3" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(30 65 85)" />
            <ellipse cx="65" cy="85" rx="8" ry="3" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-30 65 85)" />
            <circle cx="65" cy="85" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lodavia-cosmic-doodles)" />
      </svg>
    </div>
  );
}
