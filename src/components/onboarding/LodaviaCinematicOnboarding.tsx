import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Share2, 
  Sparkles, 
  Brain, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';
import LodaviaMascot from '../LodaviaMascot';
import { playSynthSound } from '../../utils/helpers';

export interface OnboardingActions {
  onEnterLodavia: () => void;
  onCreateAccount?: () => void;
  onSignIn?: () => void;
  onContinueGuest: () => void;
  onLanguageToggle?: () => void;
}

interface LodaviaCinematicOnboardingProps {
  actions: OnboardingActions;
  lang?: 'ar' | 'en';
}

export default function LodaviaCinematicOnboarding({
  actions,
  lang = 'en'
}: LodaviaCinematicOnboardingProps) {
  // Snappy 2-screen flow
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const isAr = lang === 'ar';

  const totalSlides = 2;

  const playChime = (freq = 600) => {
    if (!soundEnabled) return;
    try {
      playSynthSound(freq, 'sine', 0.12);
    } catch {
      // Audio fallback
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      playChime(720);
    } else {
      actions.onEnterLodavia();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      playChime(560);
    }
  };

  const handleSkip = () => {
    playChime(800);
    if (currentSlide === 0) {
      setCurrentSlide(1);
    } else {
      actions.onEnterLodavia();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = dragStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swipe Left -> Next (or Prev if RTL)
        if (isAr) handlePrev();
        else handleNext();
      } else {
        // Swipe Right -> Prev (or Next if RTL)
        if (isAr) handleNext();
        else handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isAr) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        if (isAr) handleNext();
        else handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isAr]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-40 flex flex-col justify-between bg-[#040814] text-white select-none overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
      id="lodavia-onboarding-container"
    >
      {/* 1. CALM COSMIC BACKGROUND WITH PARALLAX STARS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Deep Canvas Gradient */}
        <div className="absolute inset-0 bg-[#040814]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(37,99,235,0.10),transparent_60%)]" />

        {/* Faint Stars Grid with gentle parallax shift */}
        <motion.div
          animate={{ x: isAr ? currentSlide * 35 : -currentSlide * 35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-[-10%] w-[120%] h-[120%] opacity-45"
          style={{
            backgroundImage: `radial-gradient(1.2px 1.2px at 30px 40px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 160px 90px, #38BDF8, rgba(0,0,0,0)),
                              radial-gradient(1.2px 1.2px at 280px 240px, #93C5FD, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 460px 150px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 620px 310px, #BAE6FD, rgba(0,0,0,0))`,
            backgroundSize: '420px 420px',
          }}
        />

        {/* Calm Electric Ambient Glow */}
        <motion.div
          animate={{
            x: isAr ? currentSlide * 30 : -currentSlide * 30,
            opacity: [0.35, 0.45, 0.35],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.20) 0%, rgba(30,58,138,0.12) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* 2. TOP NAV BAR (Brand, Lang, Sound, Always-Visible Skip) */}
      <header className="relative z-30 w-full max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(56,189,248,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070C18] rounded-[11px] flex items-center justify-center">
              <span className="text-white font-black text-xs font-mono">L</span>
            </div>
          </div>
          <span className="text-sm font-black tracking-[0.25em] text-white uppercase drop-shadow-sm">
            LODAVIA
          </span>
        </div>

        {/* Right Actions: Lang, Sound, Clear Skip Button */}
        <div className="flex items-center gap-2.5">
          {actions.onLanguageToggle && (
            <button
              onClick={actions.onLanguageToggle}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              title={isAr ? 'تغيير اللغة' : 'Switch Language'}
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold">{isAr ? 'EN' : 'عربي'}</span>
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* SKIP BUTTON: Always present and clear */}
          <button
            id="onboarding-btn-skip"
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-mono tracking-wider transition-all cursor-pointer backdrop-blur-md"
          >
            {isAr ? 'تخطي' : 'SKIP'}
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT STAGE (2 SCREENS) */}
      <main className="relative z-20 flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* SCREEN 1: LOGO SCREEN (Clean, Calm, Cosmic)               */}
          {/* ========================================================= */}
          {currentSlide === 0 && (
            <motion.div
              key="screen-1"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center text-center my-auto"
            >
              {/* Official Lodavia Celestial Logo Stage */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
                {/* Ambient Halo Glow */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(30,58,138,0.12) 50%, transparent 70%)',
                    filter: 'blur(30px)',
                  }}
                />

                {/* SVG 3D Dimensional Celestial Rings & Core */}
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-[0_8px_32px_rgba(14,165,233,0.3)]"
                >
                  <defs>
                    <linearGradient id="onb-cyan" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    <linearGradient id="onb-gold" x1="105" y1="15" x2="15" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E2CA76" />
                      <stop offset="40%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>

                    <linearGradient id="onb-core" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="50%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    <filter id="onb-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Orbital Rings with Slow Rotation */}
                  <g>
                    <ellipse
                      cx="60"
                      cy="60"
                      rx="44"
                      ry="16"
                      transform="rotate(-32 60 60)"
                      stroke="url(#onb-cyan)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeOpacity="0.9"
                      filter="url(#onb-glow)"
                    />
                    <ellipse
                      cx="60"
                      cy="60"
                      rx="44"
                      ry="16"
                      transform="rotate(32 60 60)"
                      stroke="url(#onb-gold)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeOpacity="0.85"
                      filter="url(#onb-glow)"
                    />
                    {/* Energy Nodes */}
                    <circle cx="21" cy="60" r="2.5" fill="#FFFFFF" filter="url(#onb-glow)" />
                    <circle cx="99" cy="60" r="2.2" fill="#38BDF8" />
                    <circle cx="60" cy="21" r="2.5" fill="#FFFFFF" filter="url(#onb-glow)" />
                    <circle cx="60" cy="99" r="2.2" fill="#E2CA76" />
                  </g>

                  {/* Dimensional Core */}
                  <circle
                    cx="60"
                    cy="60"
                    r="21"
                    fill="url(#onb-core)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.2"
                  />

                  {/* Monogram "L" */}
                  <path
                    d="M 54 49 L 54 69 L 67 69 L 67 66.5 L 57.5 66.5 L 57.5 49 Z"
                    fill="#FFFFFF"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                  />
                </svg>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-3 max-w-md">
                <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-white uppercase drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                  LODAVIA
                </h1>

                <p className="text-xs sm:text-sm font-mono tracking-[0.22em] text-sky-400 uppercase font-semibold">
                  {isAr ? 'كونٌ واحد. إمكانياتٌ بلا حدود.' : 'ONE UNIVERSE. ENDLESS POSSIBILITIES.'}
                </p>
              </div>

              {/* Gentle Tap to Proceed Hint */}
              <button
                onClick={handleNext}
                className="mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-mono tracking-wider transition-all cursor-pointer group"
              >
                <span>{isAr ? 'ابدأ الاستكشاف' : 'START EXPLORING'}</span>
                {isAr ? (
                  <ArrowLeft className="w-3.5 h-3.5 text-sky-400 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 2: MERGED SCREEN (Universe Presentation + Pills + CTA) */}
          {/* ========================================================= */}
          {currentSlide === 1 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg my-auto"
            >
              {/* Glass Frame Card */}
              <div className="relative w-full rounded-3xl bg-[#091124]/80 border border-white/[0.1] p-6 sm:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl text-center overflow-hidden">
                
                {/* Subtle Ray Mascot Presence: Small, quiet, floating in top corner without dedicated text */}
                <div 
                  className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-10 pointer-events-none opacity-90`}
                  title="Ray"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    {/* Soft subtle aura */}
                    <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-md pointer-events-none" />
                    <LodaviaMascot
                      size={54}
                      animated={true}
                      skin="default"
                      showAura={true}
                      interactive={false}
                    />
                  </motion.div>
                </div>

                {/* Soft ambient inner glow */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-500/[0.08] rounded-full blur-3xl pointer-events-none -z-10" 
                  aria-hidden="true" 
                />

                {/* Small Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] font-mono mb-4">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>{isAr ? 'عالم LODAVIA الرقمي' : 'LODAVIA DIGITAL UNIVERSE'}</span>
                </div>

                {/* Main Prominent Headline */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-4">
                  {isAr ? 'ادخل كوناً بُني ليُستكشف.' : 'Enter a universe built to explore.'}
                </h2>

                {/* Three Horizontal Concise Tags (Explore / Learn / Connect) */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-7 flex-wrap">
                  {/* Tag 1: Explore */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-sky-400/30 text-xs font-semibold text-slate-200 transition-all">
                    <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{isAr ? 'استكشف' : 'EXPLORE'}</span>
                  </div>

                  {/* Tag 2: Learn */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-emerald-400/30 text-xs font-semibold text-slate-200 transition-all">
                    <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isAr ? 'تعلّم' : 'LEARN'}</span>
                  </div>

                  {/* Tag 3: Connect */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-blue-400/30 text-xs font-semibold text-slate-200 transition-all">
                    <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{isAr ? 'تواصل' : 'CONNECT'}</span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="space-y-3 w-full">
                  {/* Primary CTA: "Enter Lodavia" -> navigates to Login Page */}
                  <motion.button
                    id="onboarding-btn-enter-lodavia"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playChime(880);
                      actions.onEnterLodavia();
                    }}
                    className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] flex items-center justify-center gap-2 cursor-pointer transition-all border border-sky-300/30"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isAr ? 'ادخل لودافيا' : 'ENTER LODAVIA'}</span>
                    {isAr ? (
                      <ArrowLeft className="w-4 h-4 text-slate-950" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    )}
                  </motion.button>

                  {/* Secondary Quiet Option: "Continue as Guest" */}
                  <motion.button
                    id="onboarding-btn-guest"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playChime(600);
                      actions.onContinueGuest();
                    }}
                    className="w-full min-h-[42px] py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium hover:underline"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'المتابعة كضيف' : 'Continue as Guest'}</span>
                  </motion.button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. BOTTOM CONTROLS & 2-PAGE INDICATOR DOTS */}
      <footer className="relative z-30 w-full max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
        {/* Left: Previous Button (Visible only on Slide 1) */}
        <div className="w-20 flex items-center justify-start">
          {currentSlide > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
              title={isAr ? 'السابق' : 'Previous'}
            >
              {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.button>
          )}
        </div>

        {/* Center: EXACT 2 Indicator Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              id={`onboarding-indicator-dot-${idx}`}
              onClick={() => {
                setCurrentSlide(idx);
                playChime(580 + idx * 100);
              }}
              className="py-2 px-1 cursor-pointer group"
              title={`Slide ${idx + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-8 bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                    : 'w-2 bg-white/20 group-hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Right: Next Arrow Button (Visible only on Slide 0) */}
        <div className="w-20 flex items-center justify-end">
          {currentSlide === 0 ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              className="p-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              title={isAr ? 'التالي' : 'Next'}
            >
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </motion.button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </footer>
    </div>
  );
}
