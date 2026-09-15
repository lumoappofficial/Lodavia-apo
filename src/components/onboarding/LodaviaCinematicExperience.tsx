import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LodaviaCinematicIntro from './LodaviaCinematicIntro';
import LodaviaCinematicOnboarding from './LodaviaCinematicOnboarding';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../firebase/services';
import { AppUser } from '../../types';
import { X, Sparkles, AlertCircle, Loader2, Mail, Lock, User } from 'lucide-react';

interface LodaviaCinematicExperienceProps {
  forceShowIntro?: boolean;
  onFinishedExperience?: () => void;
}

export default function LodaviaCinematicExperience({
  onFinishedExperience,
}: LodaviaCinematicExperienceProps) {
  const { lang, setLang, setCurrentUser, playSynthSound } = useApp();
  const navigate = useNavigate();

  // Phase state: 'intro' | 'onboarding'
  const [phase, setPhase] = useState<'intro' | 'onboarding'>('intro');
  // Auth modal overlay state: null | 'login' | 'register'
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  // Form states for in-onboarding auth modal
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const isAr = lang === 'ar';
  const effectiveLang: 'ar' | 'en' = lang === 'ar' ? 'ar' : 'en';

  const handleGuestEntry = async () => {
    try {
      if (playSynthSound) playSynthSound(750, 'sine', 0.15);
      const user = await authService.signInAsGuest();
      setCurrentUser(user);
      if (onFinishedExperience) {
        onFinishedExperience();
      } else {
        navigate('/home');
      }
    } catch {
      // Fallback guest user creation
      const fallbackUser: AppUser = {
        id: `guest_${Date.now()}`,
        name: isAr ? 'مستكشف كوني' : 'Cosmic Explorer',
        email: 'explorer@lodavia.universe',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        bio: 'Entering the Lodavia Universe',
        country: isAr ? 'المملكة العربية السعودية' : 'Earth / Orbital Orbit',
        language: isAr ? 'العربية' : 'English',
        interests: ['Universe', 'AI', 'Communities'],
        achievements: [{ id: 'ach_guest', title: 'Cosmic Traveler', description: 'Entered Lodavia', icon: '🪐' }],
        joinedCommunities: ['comm_prog'],
        enrolledCourses: [],
        followersCount: 0,
        followingCount: 0,
        points: 100,
        purchasedItems: [],
      };
      setCurrentUser(fallbackUser);
      if (onFinishedExperience) {
        onFinishedExperience();
      } else {
        navigate('/home');
      }
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authModal === 'login') {
        const user = await authService.login(email.trim(), password);
        setCurrentUser(user);
      } else {
        const user = await authService.signup(
          email.trim(),
          name.trim() || 'Cosmic Traveler',
          '+966500000000',
          password,
          isAr ? 'المملكة العربية السعودية' : 'United States',
          isAr ? 'العربية' : 'English',
          ['AI', 'Design', 'Cosmos']
        );
        setCurrentUser(user);
      }

      if (playSynthSound) playSynthSound(880, 'sine', 0.2);
      setAuthModal(null);
      if (onFinishedExperience) {
        onFinishedExperience();
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      if (playSynthSound) playSynthSound(180, 'sawtooth', 0.2);
      setAuthError(err?.message || (isAr ? 'حدث خطأ أثناء المصادقة' : 'Authentication failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      setCurrentUser(user);
      if (playSynthSound) playSynthSound(880, 'sine', 0.2);
      setAuthModal(null);
      if (onFinishedExperience) {
        onFinishedExperience();
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setAuthError(err?.message || (isAr ? 'فشل تسجيل الدخول بواسطة Google' : 'Google sign-in failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const onboardingActions = {
    onEnterLodavia: () => {
      if (playSynthSound) playSynthSound(880, 'sine', 0.15);
      navigate('/login');
    },
    onCreateAccount: () => {
      if (playSynthSound) playSynthSound(700, 'sine', 0.1);
      navigate('/signup');
    },
    onSignIn: () => {
      if (playSynthSound) playSynthSound(700, 'sine', 0.1);
      navigate('/login');
    },
    onContinueGuest: handleGuestEntry,
    onLanguageToggle: () => setLang(isAr ? 'en' : 'ar'),
  };

  return (
    <div className="relative min-h-screen w-full bg-[#010206] select-none">
      {/* 1. INTRO SPLASH / ONBOARDING VIEWPORT */}
      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <motion.div
            key="cinematic-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50"
          >
            <LodaviaCinematicIntro
              onComplete={() => setPhase('onboarding')}
              lang={effectiveLang}
            />
          </motion.div>
        ) : (
          <motion.div
            key="cinematic-onboarding"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40"
          >
            <LodaviaCinematicOnboarding
              actions={onboardingActions}
              lang={effectiveLang}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PREMIUM CINEMATIC GLASS AUTH MODAL OVERLAY */}
      <AnimatePresence>
        {authModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-3xl bg-[#090d1e]/90 border border-white/20 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.25)] text-white"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setAuthModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer rtl:left-5 rtl:right-auto"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'بوابة العبور' : 'UNIVERSE GATEWAY'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white uppercase">
                  {authModal === 'login'
                    ? isAr ? 'تسجيل الدخول' : 'Sign In'
                    : isAr ? 'إنشاء حساب جديد' : 'Create Account'}
                </h3>
              </div>

              {/* Error Message Banner */}
              {authError && (
                <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authModal === 'register' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      {isAr ? 'الاسم' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute top-3 left-3.5 w-4 h-4 text-cyan-400 rtl:right-3.5 rtl:left-auto" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isAr ? 'اسمك الكريم' : 'Commander Alex'}
                        className="w-full py-2.5 px-10 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3.5 w-4 h-4 text-cyan-400 rtl:right-3.5 rtl:left-auto" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@lodavia.universe"
                      className="w-full py-2.5 px-10 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3.5 w-4 h-4 text-cyan-400 rtl:right-3.5 rtl:left-auto" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-2.5 px-10 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>
                      {authModal === 'login'
                        ? isAr ? 'تسجيل الدخول' : 'Sign In'
                        : isAr ? 'تأكيد الحساب' : 'Create Account'}
                    </span>
                  )}
                </button>
              </form>

              {/* Social Quick Login */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                  >
                    {authModal === 'login'
                      ? isAr ? 'ليس لديك حساب؟ سجّل الآن' : "Don't have an account? Sign up"
                      : isAr ? 'لديك حساب بالفعل؟ سجّل دخولك' : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
