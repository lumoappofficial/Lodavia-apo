import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LodaviaCinematicIntroProps {
  onComplete: () => void;
  lang?: 'ar' | 'en';
}

export default function LodaviaCinematicIntro({ onComplete, lang = 'en' }: LodaviaCinematicIntroProps) {
  // Snappy 4-step sequence (Total duration: ~1650ms)
  // Step 1: 0ms   -> Clean dark canvas & calm starfield
  // Step 2: 250ms -> Logo fades in cleanly with subtle scale (Linear/Stripe style)
  // Step 3: 650ms -> "LODAVIA" wordmark fades in with crisp letter-spacing
  // Step 4: 900ms -> Tagline fades in
  // Step 5: 1650ms -> Complete transition to onboarding
  const [step, setStep] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  const handleFinish = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    // Single subtle, elegant ambient ping (< 0.7s) - calm and non-intrusive
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm harmonic tone (528 Hz - Solfeggio clarity frequency)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);

        // Soft attack, swift graceful decay under 0.65s
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch {
      // Audio context silently skipped if browser blocks autoplay
    }

    // Snappy, disciplined timing sequence totaling 1650ms
    const t2 = setTimeout(() => setStep(2), 250);
    const t3 = setTimeout(() => setStep(3), 650);
    const t4 = setTimeout(() => setStep(4), 900);
    const tEnd = setTimeout(() => {
      setStep(5);
      handleFinish();
    }, 1650);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, []);

  // Calm, minimal Starfield Canvas (reduced density, slow steady glow, no rapid flickering)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Reduced density: max 55 stars, pure whites and subtle sky blues only (no purples)
    const starCount = Math.min(55, Math.floor((width * height) / 18000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.0 + 0.4,
      baseAlpha: Math.random() * 0.4 + 0.15,
      twinkleSpeed: Math.random() * 0.006 + 0.002, // very slow, calm breathing
      phase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#e0f2fe', '#bae6fd'][Math.floor(Math.random() * 3)],
    }));

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space neutral vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        30,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#070c18');
      bgGrad.addColorStop(0.6, '#03060f');
      bgGrad.addColorStop(1, '#010206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      frame++;
      stars.forEach((star) => {
        // Calm breathing shimmer (low delta amplitude)
        const alpha = star.baseAlpha + Math.sin(frame * star.twinkleSpeed + star.phase) * 0.12;
        ctx.globalAlpha = Math.max(0.08, Math.min(0.7, alpha));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010206] text-white select-none overflow-hidden cursor-pointer"
      id="lodavia-cinematic-intro"
    >
      {/* 1. Calm Deep Space Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* 2. Single, subtle stationary ambient glow behind the logo (no aggressive pulses or sweeping beams) */}
      <div
        className="absolute z-10 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(29,78,216,0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: step >= 2 ? 1 : 0,
        }}
      />

      {/* 3. Center Logo & Wordmark Container */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        {/* The Official LODAVIA Symbol - Clean single entrance (fade-in + subtle scale) */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-5">
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* SVG 3D Depth Emblem with Pure Sky Blue & Electric Blue + Subtle Warm Gold Accent */}
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-[0_8px_28px_rgba(14,165,233,0.22)]"
                >
                  <defs>
                    {/* Cyan to Electric Blue Spectrum */}
                    <linearGradient id="intro-grad-cyan" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    {/* Subtle Warm Gold to Sky Blue Spectrum */}
                    <linearGradient id="intro-grad-amber" x1="105" y1="15" x2="15" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#D9B968" />
                      <stop offset="40%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>

                    {/* Deep Core Blue */}
                    <linearGradient id="intro-grad-core" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="50%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    <filter id="intro-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Orbital Rings */}
                  <g>
                    {/* Ring 1 - Primary Sky/Electric Blue */}
                    <ellipse
                      cx="60"
                      cy="60"
                      rx="44"
                      ry="16"
                      transform="rotate(-32 60 60)"
                      stroke="url(#intro-grad-cyan)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeOpacity="0.9"
                      filter="url(#intro-glow)"
                    />

                    {/* Ring 2 - Warm Gold / Deep Sky Accent */}
                    <ellipse
                      cx="60"
                      cy="60"
                      rx="44"
                      ry="16"
                      transform="rotate(32 60 60)"
                      stroke="url(#intro-grad-amber)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeOpacity="0.85"
                      filter="url(#intro-glow)"
                    />

                    {/* Faint Center Latitude Ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke="#0EA5E9"
                      strokeOpacity="0.15"
                      strokeWidth="0.8"
                      strokeDasharray="3 7"
                    />

                    {/* Precision Energy Nodes */}
                    <circle cx="21" cy="60" r="2.5" fill="#FFFFFF" filter="url(#intro-glow)" />
                    <circle cx="99" cy="60" r="2.2" fill="#38BDF8" />
                    <circle cx="60" cy="21" r="2.5" fill="#FFFFFF" filter="url(#intro-glow)" />
                    <circle cx="60" cy="99" r="2.2" fill="#D9B968" />
                  </g>

                  {/* Central Dimensional Core Orb */}
                  <circle
                    cx="60"
                    cy="60"
                    r="21"
                    fill="url(#intro-grad-core)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.2"
                  />

                  {/* Monogram "L" in Pure Crisp White */}
                  <path
                    d="M 54 49 L 54 69 L 67 69 L 67 66.5 L 57.5 66.5 L 57.5 49 Z"
                    fill="#FFFFFF"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Name: "LODAVIA" (Clean typography entrance) */}
        <div className="h-8 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {step >= 3 && (
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.35em] drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
              >
                LODAVIA
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Subtitle: "ENTER THE UNIVERSE" */}
        <div className="h-5 flex items-center justify-center mt-1.5 overflow-hidden">
          <AnimatePresence>
            {step >= 4 && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-[10px] font-mono font-semibold tracking-[0.28em] text-sky-400/90 uppercase"
              >
                {lang === 'ar' ? 'ادخل إلى الكون' : 'ENTER THE UNIVERSE'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle Skip Hint at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute bottom-6 z-20 text-[9px] font-mono text-slate-500 tracking-wider uppercase pointer-events-none"
      >
        {lang === 'ar' ? 'انقر للتخطي' : 'Tap to skip'}
      </motion.div>
    </div>
  );
}
