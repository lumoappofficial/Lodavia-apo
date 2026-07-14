import React, { useMemo } from 'react';

interface LiveSpaceBackgroundProps {
  starCount?: number;
  shootingStars?: number;
  className?: string;
}

/**
 * A lightweight, dependency-free animated starfield.
 * Renders twinkling stars at random positions + periodic shooting stars,
 * layered on top of (or instead of) a static background image to make
 * any screen feel alive without pulling in three.js.
 */
export default function LiveSpaceBackground({
  starCount = 70,
  shootingStars = 2,
  className = ''
}: LiveSpaceBackgroundProps) {

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.6,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      opacity: 0.4 + Math.random() * 0.6,
    }));
  }, [starCount]);

  const shooters = useMemo(() => {
    return Array.from({ length: shootingStars }).map((_, i) => ({
      id: i,
      top: Math.random() * 40,
      left: Math.random() * 60 + 10,
      delay: i * 4 + Math.random() * 6,
      duration: 1.6 + Math.random() * 1,
    }));
  }, [shootingStars]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      id="live-space-background"
    >
      <style>
        {`
          @keyframes lsb-twinkle {
            0%, 100% { opacity: var(--lsb-op-min); transform: scale(0.85); }
            50% { opacity: var(--lsb-op-max); transform: scale(1.15); }
          }
          @keyframes lsb-shoot {
            0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
            8% { opacity: 1; }
            18% { transform: translate(-140px, 90px) scale(1); opacity: 0; }
            100% { transform: translate(-140px, 90px) scale(1); opacity: 0; }
          }
          @keyframes lsb-drift {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* Twinkling star field */}
      <div
        className="absolute inset-0"
        style={{ animation: 'lsb-drift 14s ease-in-out infinite' }}
      >
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: '0 0 4px rgba(255,255,255,0.9), 0 0 8px rgba(120,180,255,0.5)',
              // @ts-ignore custom props for keyframe
              '--lsb-op-min': 0.15,
              '--lsb-op-max': s.opacity,
              animation: `lsb-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {shooters.map((sh) => (
        <span
          key={sh.id}
          className="absolute h-[1.5px] w-20 rounded-full"
          style={{
            top: `${sh.top}%`,
            left: `${sh.left}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0))',
            boxShadow: '0 0 8px 1px rgba(180,220,255,0.8)',
            animation: `lsb-shoot ${sh.duration}s linear ${sh.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
