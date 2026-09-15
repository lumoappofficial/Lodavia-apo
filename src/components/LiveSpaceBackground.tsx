import React, { useState, useMemo, useEffect, useRef } from 'react';

interface LiveSpaceBackgroundProps {
  starCount?: number;
  shootingStars?: number;
  className?: string;
  isEntering?: boolean;
}

/**
 * Living space portal background.
 * Multi-layer stars + subtle inward drifting cosmic particles + shooting light trails.
 * Optimized for mobile 60 FPS with lightweight canvas & CSS keyframes.
 */
export default function LiveSpaceBackground({
  starCount = 45,
  shootingStars = 2,
  className = '',
  isEntering = false
}: LiveSpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic theme detection for dark vs light canvas colors
  const [isDark, setIsDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 1. Multi-layered starfield generation with depth speeds
  const starLayers = useMemo(() => {
    // 3 depth layers: 0 (distant/slow), 1 (mid), 2 (near)
    const layers = [[], [], []] as Array<Array<{
      id: number;
      top: number;
      left: number;
      size: number;
      duration: number;
      delay: number;
      opacity: number;
    }>>;

    for (let i = 0; i < starCount; i++) {
      const layerIdx = i % 3;
      layers[layerIdx].push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: layerIdx === 0 ? Math.random() * 1.2 + 0.5 : layerIdx === 1 ? Math.random() * 1.8 + 0.8 : Math.random() * 2.4 + 1.2,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 4,
        opacity: layerIdx === 0 ? 0.35 + Math.random() * 0.3 : layerIdx === 1 ? 0.5 + Math.random() * 0.35 : 0.65 + Math.random() * 0.35,
      });
    }

    return layers;
  }, [starCount]);

  // 2. Rare shooting stars / light trails
  const shooters = useMemo(() => {
    return Array.from({ length: shootingStars }).map((_, i) => ({
      id: i,
      top: Math.random() * 45,
      left: Math.random() * 60 + 10,
      delay: i * 7 + Math.random() * 5,
      duration: 2.2 + Math.random() * 1.2,
    }));
  }, [shootingStars]);

  // 3. Canvas inward particle drift towards gateway
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool: 12 particles max for extreme mobile efficiency
    const particleCount = 12;
    const particles = Array.from({ length: particleCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * Math.min(width, height) * 0.45;
      return {
        angle,
        radius,
        speed: 0.35 + Math.random() * 0.45,
        size: 1 + Math.random() * 1.8,
        hue: Math.random() > 0.4 ? '210, 230, 255' : '180, 240, 255',
        opacity: 0.2 + Math.random() * 0.6
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.45; // Center near gateway emblem
      const currentSpeedMult = isEntering ? 3.8 : 1.0;

      for (let p of particles) {
        p.radius -= p.speed * currentSpeedMult;
        p.angle += 0.0015 * currentSpeedMult;

        // Reset particle when reaching center gateway
        if (p.radius < 25) {
          p.radius = Math.min(width, height) * 0.42 + Math.random() * 60;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        // Fade in as it approaches gateway, fade out near center
        const maxR = Math.min(width, height) * 0.42;
        const distRatio = Math.sin((p.radius / maxR) * Math.PI);
        const alpha = Math.max(0, Math.min(1, distRatio * p.opacity * (isEntering ? 1.4 : 1.0)));

        ctx.fillStyle = `rgba(${p.hue}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for particles
        if (p.size > 1.8) {
          ctx.fillStyle = `rgba(${p.hue}, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEntering]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      id="live-space-background"
    >
      <style>
        {`
          @keyframes lsb-twinkle {
            0%, 100% { opacity: var(--lsb-op-min); transform: scale(0.9); }
            50% { opacity: var(--lsb-op-max); transform: scale(1.1); }
          }
          @keyframes lsb-shoot {
            0% { transform: translate(0, 0) scale(0.3); opacity: 0; }
            10% { opacity: 0.8; }
            22% { transform: translate(-160px, 100px) scale(1); opacity: 0; }
            100% { transform: translate(-160px, 100px) scale(1); opacity: 0; }
          }
          @keyframes lsb-drift-slow {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-8px) translateX(4px); }
          }
          @keyframes lsb-drift-mid {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-14px) translateX(-6px); }
          }
          @keyframes lsb-drift-fast {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(8px); }
          }
        `}
      </style>

      {/* 2D Canvas for inward particle drift toward gateway */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[0]" />

      {/* Layer 0: Distant Stars (Slow) */}
      <div className="absolute inset-0 z-[1]" style={{ animation: 'lsb-drift-slow 28s ease-in-out infinite' }}>
        {starLayers[0].map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${isDark ? 'bg-white' : 'bg-[#48B8FF]'}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: isDark ? '0 0 3px rgba(255,255,255,0.7)' : '0 0 3px rgba(72,184,255,0.4)',
              '--lsb-op-min': isDark ? 0.15 : 0.1,
              '--lsb-op-max': isDark ? s.opacity : s.opacity * 0.45,
              animation: `lsb-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            } as React.CSSProperties & Record<string, string | number>}
          />
        ))}
      </div>

      {/* Layer 1: Mid Stars (Medium) */}
      <div className="absolute inset-0 z-[1]" style={{ animation: 'lsb-drift-mid 20s ease-in-out infinite' }}>
        {starLayers[1].map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${isDark ? 'bg-cyan-100' : 'bg-[#00B8D9]'}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: isDark ? '0 0 5px rgba(180,240,255,0.85)' : '0 0 4px rgba(0,184,217,0.3)',
              '--lsb-op-min': isDark ? 0.25 : 0.15,
              '--lsb-op-max': isDark ? s.opacity : s.opacity * 0.5,
              animation: `lsb-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            } as React.CSSProperties & Record<string, string | number>}
          />
        ))}
      </div>

      {/* Layer 2: Near Stars (Slightly faster drift) */}
      <div className="absolute inset-0 z-[1]" style={{ animation: 'lsb-drift-fast 14s ease-in-out infinite' }}>
        {starLayers[2].map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${isDark ? 'bg-white' : 'bg-[#48B8FF]'}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: isDark ? '0 0 6px rgba(255,255,255,0.9), 0 0 10px rgba(147,197,253,0.6)' : '0 0 6px rgba(72,184,255,0.4)',
              '--lsb-op-min': isDark ? 0.35 : 0.2,
              '--lsb-op-max': isDark ? s.opacity : s.opacity * 0.55,
              animation: `lsb-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            } as React.CSSProperties & Record<string, string | number>}
          />
        ))}
      </div>

      {/* Shooting stars / light trails */}
      {shooters.map((sh) => (
        <span
          key={sh.id}
          className="absolute h-[1.5px] w-24 rounded-full z-[1]"
          style={{
            top: `${sh.top}%`,
            left: `${sh.left}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(147,197,253,0))',
            boxShadow: '0 0 10px 1px rgba(180,230,255,0.7)',
            animation: `lsb-shoot ${sh.duration}s linear ${sh.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

