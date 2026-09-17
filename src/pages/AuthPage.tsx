import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../services/auth.service';
import { 
  Loader2, 
  Languages, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Compass,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Globe2,
  Zap,
  Sparkles
} from 'lucide-react';
import { themeStyles } from '../styles/theme';

export interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

/* -------------------------------------------------------------------------- */
/* Ambient Cosmic Starfield (Calm, Faint, Lightweight SVG)                     */
/* -------------------------------------------------------------------------- */
function CosmicStarfield() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Deep Canvas Gradient */}
      <div className="absolute inset-0 bg-[#070B14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_80%,rgba(37,99,235,0.08),transparent_60%)]" />

      {/* Faint Stars Grid */}
      <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Carefully scattered peaceful stars */}
        <circle cx="12%" cy="18%" r="1" fill="#F8FAFC" className="animate-pulse" style={{ animationDuration: '4s' }} />
        <circle cx="28%" cy="12%" r="1.5" fill="#38BDF8" opacity="0.6" />
        <circle cx="45%" cy="25%" r="1" fill="#F8FAFC" opacity="0.4" />
        <circle cx="68%" cy="15%" r="1.5" fill="#38BDF8" className="animate-pulse" style={{ animationDuration: '5s' }} />
        <circle cx="85%" cy="22%" r="1" fill="#F8FAFC" opacity="0.5" />
        <circle cx="92%" cy="40%" r="1" fill="#38BDF8" opacity="0.3" />
        <circle cx="8%" cy="55%" r="1.2" fill="#F8FAFC" opacity="0.4" />
        <circle cx="22%" cy="70%" r="1" fill="#38BDF8" className="animate-pulse" style={{ animationDuration: '6s' }} />
        <circle cx="38%" cy="85%" r="1.5" fill="#F8FAFC" opacity="0.5" />
        <circle cx="62%" cy="75%" r="1" fill="#38BDF8" opacity="0.4" />
        <circle cx="78%" cy="65%" r="1.2" fill="#F8FAFC" className="animate-pulse" style={{ animationDuration: '4.5s' }} />
        <circle cx="88%" cy="88%" r="1" fill="#38BDF8" opacity="0.6" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop Cosmic Brand Hero (Visual Scene Side)                              */
/* -------------------------------------------------------------------------- */
function CosmicBrandHero({ isAr }: { isAr: boolean }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden border-e border-white/[0.06]">
      {/* Soft Ambient Radial Backlight */}
      <div 
        className="absolute top-1/3 start-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Top Lodavia Brand Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#0D1527] border border-sky-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.25)]">
          <div className="w-5 h-5 rounded-full border-2 border-sky-400 border-dashed animate-[spin_16s_linear_infinite] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-widest text-white">LODAVIA</span>
            {/* Subtle warm gold micro-touch */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9B968]/10 text-[#D9B968] border border-[#D9B968]/20 tracking-wider">
              {isAr ? 'الأكوان الموازية' : 'PARALLEL WORLDS'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'الشبكة الاجتماعية الكونية المتكاملة' : 'Integrated Cosmic Social Network'}
          </p>
        </div>
      </div>

      {/* Hero Visual Composition & Orbit Graphic */}
      <div className="my-auto py-8 relative flex flex-col items-start text-start max-w-lg">
        {/* Orbital Geometry Decorative Graphic */}
        <div className="relative w-full h-44 mb-6 flex items-center justify-center">
          <svg className="w-64 h-44 text-sky-500/20" viewBox="0 0 260 170" fill="none">
            {/* Main Outer Orbit */}
            <ellipse cx="130" cy="85" rx="115" ry="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            {/* Inner Concentric Orbit */}
            <ellipse cx="130" cy="85" rx="75" ry="32" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
            {/* Core Energy Center */}
            <circle cx="130" cy="85" r="14" fill="#0D1527" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="130" cy="85" r="6" fill="#38BDF8" />
            {/* Planet Node 1 */}
            <circle cx="210" cy="65" r="4" fill="#38BDF8" className="animate-pulse" />
            {/* Planet Node 2 */}
            <circle cx="55" cy="105" r="3" fill="#94A3B8" />
          </svg>
        </div>

        <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight tracking-tight mb-3">
          {isAr ? (
            <>
              بوابتك نحو مجرات رقمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">بلا حدود</span>
            </>
          ) : (
            <>
              Your Gateway to Infinite <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Cosmic Realms</span>
            </>
          )}
        </h2>

        <p className="text-xs xl:text-sm text-slate-300 leading-relaxed font-normal mb-8 max-w-md">
          {isAr 
            ? 'تواصل في غرف صوتية فضائية، طوّر مشاريعك الرقمية، واستكشف مجتمعات الأكوان الموازية في منصة موحدة مصممة للمستقبل.' 
            : 'Connect across space audio rooms, build digital projects, and discover parallel universe communities in a unified platform designed for the future.'}
        </p>

        {/* 3 Core Value Pillars */}
        <div className="w-full grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
              <Globe2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'عوالم موازية' : 'Parallel Worlds'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'مجتمعات حيوية متخصصة' : 'Active vibrant spaces'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'حماية مشفرة' : 'Encrypted'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'أمان الجلسة والبيانات' : 'Secure user sessions'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'وصول فوري' : 'Instant Sync'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'مزامنة سحابية سلسة' : 'Seamless cloud link'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Status Beacon */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            SYSTEM ONLINE • LODAVIA KERNEL v2.4
          </span>
        </div>
        <span className="text-[10px] text-slate-500">256-Bit TLS</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reset Password Modal Component                                             */
/* -------------------------------------------------------------------------- */
function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail,
  isAr
}: {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  isAr: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(initialEmail);
    setSuccess('');
    setError('');
  }, [initialEmail, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !validateEmail(email.trim())) {
      setError(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email.trim());
      setSuccess(
        isAr 
          ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح ✨' 
          : 'Password reset link has been dispatched to your email ✨'
      );
    } catch (err: any) {
      setError(err?.message || (isAr ? 'تعذر إرسال تعليمات الاستعادة. يرجى التأكد من البريد.' : 'Could not send reset instructions. Verify your email.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="w-full max-w-sm rounded-2xl bg-[#0D1527] border border-white/[0.12] p-6 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative text-start"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm pb-2 border-b border-white/[0.08]">
          <KeyRound className="w-4 h-4" />
          <span>{isAr ? 'استعادة كلمة المرور' : 'Reset Password'}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {isAr 
            ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مباشراً لتعيين كلمة مرور جديدة:' 
            : 'Enter your registered email and we will send you a link to reset your password:'}
        </p>

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <Mail className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'اسمك@مثال.com' : 'name@example.com'}
              className={`w-full py-2.5 ${isAr ? 'pe-4 ps-10' : 'ps-10 pe-4'} rounded-xl text-xs ${themeStyles.glassInput}`}
              required
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-all"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 text-xs ${themeStyles.buttonPrimary}`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{isAr ? 'إرسال الرابط' : 'Send Link'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Social & Guest Authentication Buttons Component                             */
/* Strictly ONLY: Google, Apple, and Guest. Reusing auth.service.ts methods.   */
/* -------------------------------------------------------------------------- */
function SocialAndGuestActions({
  loading,
  setLoading,
  setError,
  isAr
}: {
  loading: boolean;
  setLoading: (val: boolean) => void;
  setError: (err: string) => void;
  isAr: boolean;
}) {
  const { playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const checkRedirect = async () => {
      try {
        const user = await authService.completeRedirectSignIn();
        if (user && isMounted) {
          setCurrentUser(user);
          if (playSynthSound) playSynthSound(880, 'sine', 0.2);
          navigate('/home');
        }
      } catch (err: any) {
        if (isMounted) {
          if (playSynthSound) playSynthSound(150, 'sawtooth', 0.2);
          setError(err?.message || (isAr ? 'فشل إكمال تسجيل الدخول' : 'Sign-in failed'));
        }
      }
    };
    checkRedirect();
    return () => {
      isMounted = false;
    };
  }, [isAr, navigate, playSynthSound, setCurrentUser, setError]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    if (playSynthSound) playSynthSound(600, 'sine', 0.08);
    try {
      const user = await authService.signInWithGoogle();
      if (user) {
        setCurrentUser(user);
        if (playSynthSound) playSynthSound(880, 'sine', 0.2);
        navigate('/home');
      }
    } catch (err: any) {
      if (playSynthSound) playSynthSound(150, 'sawtooth', 0.2);
      setError(err?.message || (isAr ? 'فشل تسجيل الدخول بواسطة Google' : 'Google sign-in failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    if (playSynthSound) playSynthSound(600, 'sine', 0.08);
    try {
      const user = await authService.signInWithApple();
      if (user) {
        setCurrentUser(user);
        if (playSynthSound) playSynthSound(880, 'sine', 0.2);
        navigate('/home');
      }
    } catch (err: any) {
      if (playSynthSound) playSynthSound(150, 'sawtooth', 0.2);
      setError(err?.message || (isAr ? 'فشل تسجيل الدخول بواسطة Apple' : 'Apple sign-in failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    if (playSynthSound) playSynthSound(500, 'sine', 0.08);
    try {
      const user = await authService.signInAsGuest();
      setCurrentUser(user);
      if (playSynthSound) playSynthSound(880, 'sine', 0.2);
      navigate('/home');
    } catch (err: any) {
      if (playSynthSound) playSynthSound(150, 'sawtooth', 0.2);
      setError(err?.message || (isAr ? 'فشل الدخول السريع كضيف' : 'Guest sign-in failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* "Or" Divider */}
      <div className="w-full flex items-center gap-3 my-4">
        <div className="flex-1 h-[1px] bg-white/[0.08]" />
        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          {isAr ? 'أو' : 'or'}
        </span>
        <div className="flex-1 h-[1px] bg-white/[0.08]" />
      </div>

      {/* Two Social Buttons Side-by-Side: Google & Apple ONLY */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          id="btn-auth-google"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#070B14] hover:bg-[#131F37] border border-white/[0.08] hover:border-white/[0.16] text-slate-200 text-xs font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="truncate">{isAr ? 'المتابعة عبر Google' : 'Continue with Google'}</span>
        </button>

        <button
          id="btn-auth-apple"
          type="button"
          onClick={handleAppleLogin}
          disabled={loading}
          className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#070B14] hover:bg-[#131F37] border border-white/[0.08] hover:border-white/[0.16] text-slate-200 text-xs font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.08-3.21-2.62-7.07-7.24-11.58-13.85-6.3-9.15-11.33-19.57-15.09-31.28-3.76-11.71-5.64-22.75-5.64-33.12 0-14.52 3.65-26.23 10.96-35.13 7.31-8.9 16.52-13.43 27.63-13.58 5.25 0 10.87 1.25 16.86 3.75 5.99 2.5 9.97 3.75 11.95 3.75 1.62 0 5.72-1.32 12.31-3.96 6.59-2.64 12.06-3.83 16.42-3.57 12.24.93 21.73 5.46 28.47 13.58-10.95 6.64-16.3 15.77-16.05 27.38.25 9.1 3.74 16.8 10.47 23.1 6.73 6.3 14.88 10 24.45 11.1-2.22 6.5-5.06 13.25-8.52 20.25zm-28.53-108.57c0 6.61-2.38 12.87-7.14 17.78-4.76 4.91-10.85 7.82-18.27 8.73-.25-.9-.38-1.87-.38-2.92 0-6.61 2.55-13.06 7.65-18.35 5.1-5.29 11.41-8.31 18.93-9.06.13 1.25.21 2.52.21 3.82z"/>
          </svg>
          <span className="truncate">{isAr ? 'المتابعة عبر Apple' : 'Continue with Apple'}</span>
        </button>
      </div>

      {/* Clear Distinct Guest Option */}
      <button
        id="btn-auth-guest"
        type="button"
        onClick={handleGuestLogin}
        disabled={loading}
        className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-transparent hover:bg-white/[0.04] border border-white/[0.06] hover:border-sky-500/30 text-slate-300 hover:text-sky-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-50"
      >
        <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
        <span>{isAr ? 'المتابعة كضيف' : 'Continue as Guest'}</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Login View Component                                                       */
/* -------------------------------------------------------------------------- */
export function LoginView({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { lang, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const isAr = lang === 'ar';

  const validateEmail = (emailStr: string) => /\S+@\S+\.\S+/.test(emailStr);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter both email and password.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format.');
      return;
    }

    setLoading(true);
    if (playSynthSound) playSynthSound(520, 'sine', 0.1);

    try {
      const user = await authService.login(email.trim(), password);
      setCurrentUser(user);
      if (playSynthSound) playSynthSound(880, 'sine', 0.2);
      navigate('/home');
    } catch (err: any) {
      if (playSynthSound) playSynthSound(150, 'sawtooth', 0.25);
      const errMsg = err?.message || '';
      if (errMsg.includes('user-not-found') || errMsg.includes('wrong-password') || errMsg.includes('invalid-credential')) {
        setError(isAr ? 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.' : 'Invalid credentials. Please verify your email and password.');
      } else if (errMsg.includes('network')) {
        setError(isAr ? 'تعذّر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.' : 'Network connection error. Please try again.');
      } else {
        setError(errMsg || (isAr ? 'فشل تسجيل الدخول. يرجى المحاولة لاحقاً.' : 'Login failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center text-start animate-[fadeIn_0.25s_ease-out]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Title & Subtitle */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isAr ? 'مرحباً بعودتك' : 'Welcome back'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          {isAr ? 'أدخل بيانات حسابك للمتابعة إلى Lodavia' : 'Enter your credentials to continue to Lodavia'}
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{error}</span>
        </div>
      )}

      {/* Primary Form */}
      <form onSubmit={handleLogin} className="w-full space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <div className="relative">
            <Mail className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'name@example.com' : 'you@example.com'}
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-4 ps-11' : 'ps-11 pe-4'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <button
              id="btn-login-forgot-password"
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer transition-colors"
            >
              {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </button>
          </div>
          <div className="relative">
            <Lock className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-11 ps-11' : 'ps-11 pe-11'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-3.5 ${isAr ? 'left-3.5' : 'right-3.5'} text-slate-400 hover:text-slate-200 cursor-pointer transition-colors`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary Continue Button */}
        <button
          id="btn-login-submit"
          type="submit"
          disabled={loading}
          className={`w-full min-h-[48px] py-3.5 px-4 text-xs sm:text-sm mt-2 ${themeStyles.buttonPrimary}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
            </>
          ) : (
            <span>{isAr ? 'متابعة' : 'Continue'}</span>
          )}
        </button>
      </form>

      {/* Social & Guest Buttons */}
      <SocialAndGuestActions
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        isAr={isAr}
      />

      {/* Switch to Register */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] text-center w-full">
        <p className="text-xs text-slate-400">
          {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}
          {' '}
          <button
            id="btn-switch-to-register"
            type="button"
            onClick={onSwitchToRegister}
            className="text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer transition-colors"
          >
            {isAr ? 'أنشئ واحداً' : 'Create one'}
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        initialEmail={email}
        isAr={isAr}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Register View Component                                                    */
/* -------------------------------------------------------------------------- */
export function RegisterView({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { lang, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAr = lang === 'ar';

  const validateEmail = (emailStr: string) => /\S+@\S+\.\S+/.test(emailStr);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError(isAr ? 'الرجاء ملء كافة الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError(isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format.');
      return;
    }

    if (password.length < 6) {
      setError(isAr ? 'كلمة المرور يجب أن لا تقل عن 6 خانات' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    if (playSynthSound) playSynthSound(523, 'sine', 0.1);

    try {
      const user = await authService.signup(
        email.trim(),
        name.trim(),
        phone.trim(),
        password,
        isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia',
        isAr ? 'العربية' : 'English',
        ['برمجة', 'ذكاء اصطناعي']
      );
      setCurrentUser(user);
      if (playSynthSound) playSynthSound(880, 'sine', 0.2);
      navigate('/home');
    } catch (err: any) {
      if (playSynthSound) playSynthSound(150, 'sawtooth', 0.2);
      setError(err?.message || (isAr ? 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center text-start animate-[fadeIn_0.25s_ease-out]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Title & Subtitle */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isAr ? 'إنشاء حساب جديد' : 'Create an account'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          {isAr ? 'انضم فوراً لشبكة Lodavia الكونية واستكشف الأكوان الموازية' : 'Join the Lodavia cosmos and explore parallel realms'}
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="font-medium flex-1 leading-normal">{error}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleRegister} className="w-full space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            {isAr ? 'الاسم الكامل' : 'Full Name'}
          </label>
          <div className="relative">
            <User className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'مثال: فيصل العتيبي' : 'e.g. Alex Vance'}
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-4 ps-11' : 'ps-11 pe-4'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <div className="relative">
            <Mail className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'name@example.com' : 'you@example.com'}
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-4 ps-11' : 'ps-11 pe-4'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
              required
            />
          </div>
        </div>

        {/* Phone Number (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            {isAr ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'}
          </label>
          <div className="relative">
            <Phone className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-register-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 5x xxx xxxx"
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-4 ps-11' : 'ps-11 pe-4'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            {isAr ? 'كلمة المرور' : 'Password'}
          </label>
          <div className="relative">
            <Lock className={`absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              id="input-register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full min-h-[46px] py-3 ${isAr ? 'pe-11 ps-11' : 'ps-11 pe-11'} rounded-xl text-xs sm:text-sm ${themeStyles.glassInput}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-3.5 ${isAr ? 'left-3.5' : 'right-3.5'} text-slate-400 hover:text-slate-200 cursor-pointer transition-colors`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary Continue Button */}
        <button
          id="btn-register-submit"
          type="submit"
          disabled={loading}
          className={`w-full min-h-[48px] py-3.5 px-4 text-xs sm:text-sm mt-3 ${themeStyles.buttonPrimary}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isAr ? 'جاري إنشاء الحساب...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>{isAr ? 'متابعة' : 'Continue'}</span>
          )}
        </button>
      </form>

      {/* Social & Guest Buttons */}
      <SocialAndGuestActions
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        isAr={isAr}
      />

      {/* Switch to Login */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] text-center w-full">
        <p className="text-xs text-slate-400">
          {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
          {' '}
          <button
            id="btn-switch-to-login"
            type="button"
            onClick={onSwitchToLogin}
            className="text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer transition-colors"
          >
            {isAr ? 'سجّل الدخول' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main AuthPage Orchestrator Component                                       */
/* -------------------------------------------------------------------------- */
export default function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const { lang, setLang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  const isAr = lang === 'ar';

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const toggleLanguage = () => {
    if (playSynthSound) playSynthSound(500, 'sine', 0.05);
    setLang(isAr ? 'en' : 'ar');
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-between text-slate-100 selection:bg-sky-500 selection:text-white"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. Calm Deep Cosmic Canvas Background */}
      <CosmicStarfield />

      {/* 2. Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center z-20">
        {/* Lodavia Brand Mark */}
        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0D1527]/70 hover:bg-[#131F37] border border-white/[0.08] transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-5 h-5 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-black text-sm tracking-wider text-white">LODAVIA</span>
        </button>

        {/* Top Controls: Cinematic Intro & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-auth-intro"
            onClick={() => {
              if (playSynthSound) playSynthSound(600, 'sine', 0.1);
              navigate('/welcome');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1527]/70 hover:bg-[#131F37] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5 text-sky-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />}
            <span className="font-semibold text-[11px] sm:text-xs">
              {isAr ? 'البداية' : 'Intro'}
            </span>
          </button>

          <button
            id="btn-auth-lang-toggle"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1527]/70 hover:bg-[#131F37] border border-white/[0.08] text-xs text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold text-[11px] sm:text-xs">{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* 3. Main Center Stage */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8 my-auto flex items-center justify-center z-10">
        <div className="w-full rounded-3xl bg-[#0D1527]/70 border border-white/[0.08] shadow-[0_12px_48px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-2xl flex flex-col lg:flex-row overflow-hidden max-w-5xl">
          
          {/* Side A: Cosmic Brand Visual Hero (Desktop) */}
          <CosmicBrandHero isAr={isAr} />

          {/* Side B: Auth Card Form Area (Desktop & Mobile) */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center relative">
            
            {/* Soft subtle electric glow behind card */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/[0.06] rounded-full blur-[80px] pointer-events-none -z-10" 
              aria-hidden="true" 
            />

            {/* Tab Pill Switcher (Login / Register) */}
            <div className="w-full bg-[#070B14] p-1 rounded-xl border border-white/[0.06] flex gap-1 mb-6">
              <button
                id="tab-btn-login"
                type="button"
                onClick={() => {
                  if (playSynthSound) playSynthSound(500, 'sine', 0.05);
                  setActiveTab('login');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-[#131F37] text-white shadow-xs border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                id="tab-btn-register"
                type="button"
                onClick={() => {
                  if (playSynthSound) playSynthSound(500, 'sine', 0.05);
                  setActiveTab('register');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-[#131F37] text-white shadow-xs border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'إنشاء حساب' : 'Register'}
              </button>
            </div>

            {/* Active Sub-View */}
            {activeTab === 'login' ? (
              <LoginView onSwitchToRegister={() => setActiveTab('register')} />
            ) : (
              <RegisterView onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>

        </div>
      </main>

      {/* 4. Bottom Footer Security Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span>Lodavia Parallel Worlds Network</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            {isAr ? 'جلسة مشفرة 256-Bit' : '256-Bit Encrypted Session'}
          </span>
          <span>•</span>
          <span>{isAr ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</span>
        </div>
      </footer>
    </div>
  );
}

