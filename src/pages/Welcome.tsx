import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../firebase/services';
import { ArrowRight, Languages, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import lumoWelcomeBg from '../assets/images/lumo_welcome_bg_1783872976024.jpg';
import lodaviaLogoImage from '../assets/images/lodavia_logo_new.png';
import LiveSpaceBackground from '../components/LiveSpaceBackground';
import { themeStyles } from '../styles/theme';

export default function Welcome() {
  const { lang, setLang, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuestExplore = async () => {
    if (guestLoading) return;
    setGuestLoading(true);
    playSynthSound(523.25, 'sine', 0.1);
    try {
      const user = await authService.signInAsGuest();
      setCurrentUser(user);
      playSynthSound(880, 'sine', 0.2);
      navigate('/home');
    } catch (err: any) {
      console.error("Guest login failed:", err);
      playSynthSound(150, 'sawtooth', 0.2);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div
      className="flex-1 min-h-screen relative flex flex-col justify-between items-center text-center overflow-hidden px-6 py-10"
      id="welcome-root-container"
    >
      {/* 1. Full-Screen Cinematic Portrait Background Image */}
      <img
        src={lumoWelcomeBg}
        alt={lang === 'ar' ? 'الخلفية الكونية العميقة للودافيا' : 'Lodavia Deep Cosmic Background'}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 scale-105 animate-[pulse_10s_infinite_alternate]"
        referrerPolicy="no-referrer"
      />

      {/* 2. Deep Space Ambient Overlays — lighter than before so the vivid
             background image and accent glows actually breathe instead of
             getting crushed under near-opaque black */}
      <div className="absolute inset-0 bg-void-950/15 z-1 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/30 via-transparent to-void-950/80 z-2 pointer-events-none" />

      {/* 2b. Living, twinkling starfield + shooting stars layer */}
      <LiveSpaceBackground starCount={80} shootingStars={2} className="z-[3]" />

      {/* 3. Global Language Switcher Header */}
      <div className="w-full max-w-md flex justify-end items-center z-10 relative mt-4">
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => {
            setLang(lang === 'ar' ? 'en' : 'ar');
            playSynthSound(600, 'sine', 0.05);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-void-900/50 border border-white/15 text-[10px] font-bold text-white/80 hover:bg-void-900/80 hover:text-white hover:border-aurora-400/40 transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <Languages className="w-3.5 h-3.5 text-aurora-400" />
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </motion.button>
      </div>

      {/* 4. The real uploaded Lodavia logo artwork, shown exactly as provided */}
      <div className="my-auto flex flex-col items-center justify-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 1.5, ease: [0.25, 1, 0.5, 1] },
            scale: { duration: 1.5, ease: [0.25, 1, 0.5, 1] },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
          }}
          className="relative w-72 md:w-80 flex items-center justify-center"
        >
          {/* Soft ambient glow behind the artwork — using brand tokens (nova + aurora + ember)
              instead of the old cyan/purple/amber arbitrary mix, and boosted opacity so it
              actually glows instead of barely showing */}
          <motion.div
            className="absolute -inset-8 bg-gradient-to-tr from-aurora-500/30 via-nova-500/20 to-ember-500/30 rounded-full blur-2xl"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <img
            src={lodaviaLogoImage}
            alt={lang === 'ar' ? 'شعار لودافيا الترحيبي — اكتشف كونك' : 'Lodavia Welcome Logo — Discover Your Universe'}
            className="relative w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_35px_rgba(147,80,255,0.35)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* 5. Clean Action Panel & Buttons — now using the shared button hierarchy
             from themeStyles so every screen in the app uses the same visual
             language instead of one-off colors per screen */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 relative mt-auto mb-2">

        {/* Primary action: Create Account — brand gradient (nova -> aurora), not
            the old unrelated blue/indigo mix */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => {
            playSynthSound(587.33, 'sine', 0.1);
            navigate('/signup');
          }}
          className={`w-full py-4 px-6 text-xs tracking-wider uppercase flex items-center justify-center relative ${themeStyles.buttonPrimary}`}
        >
          <span>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</span>
          <ArrowRight className={`absolute right-6 w-4 h-4 ${lang === 'ar' ? 'rotate-180 left-6 right-auto' : ''}`} />
        </motion.button>

        {/* Secondary action: Sign In — visible outline instead of a murky
            near-invisible dark fill */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={() => {
            playSynthSound(523.25, 'sine', 0.1);
            navigate('/login');
          }}
          className={`w-full py-4 px-6 text-xs tracking-wider uppercase flex items-center justify-center relative mt-3.5 ${themeStyles.buttonSecondary}`}
        >
          <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
          <ArrowRight className={`absolute right-6 w-4 h-4 ${lang === 'ar' ? 'rotate-180 left-6 right-auto' : ''}`} />
        </motion.button>

        {/* Tertiary action: Explore as Guest — brighter text, no longer
            washed out at 80% opacity */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          onClick={handleGuestExplore}
          disabled={guestLoading}
          className={`text-[10px] md:text-xs tracking-wide mt-4.5 disabled:opacity-50 flex items-center gap-1.5 ${themeStyles.buttonGhost}`}
        >
          {guestLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-aurora-400" />}
          <span>{lang === 'ar' ? 'استكشف كزائر مباشر' : 'Explore as Guest'}</span>
        </motion.button>

        {/* Divider — raised from 5%/50% (basically invisible) to a visible hairline */}
        <div className="w-1/2 border-t border-white/15 my-5.5" />

        {/* Footer tagline */}
        <p className="text-[9px] md:text-[10px] text-white/60 font-medium tracking-wide leading-relaxed">
          {lang === 'ar' ? 'كون من العلاقات والفرص اللانهائية' : 'A universe of connections and possibilities'}
        </p>

        {/* Pulsing Single 4-Pointed Star Accent */}
        <div className="mt-4 text-aurora-400 relative">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
              filter: ["drop-shadow(0 0 1px rgba(39,211,255,0.5))", "drop-shadow(0 0 8px rgba(39,211,255,1))", "drop-shadow(0 0 1px rgba(39,211,255,0.5))"]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
