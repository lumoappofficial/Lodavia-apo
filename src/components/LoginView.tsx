import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  X,
  RefreshCw,
  Sparkles,
  User,
  ArrowLeft
} from 'lucide-react';
import lumoWelcomeBg from '../assets/images/lumo_welcome_bg_1783872976024.jpg';

interface LoginViewProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  playSynthSound: (freq: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', dur?: number) => void;
  navigate: (path: string) => void;
  introStage: 'intro' | 'main';
  loginTab: 'email' | 'phone';
  setLoginTab: (tab: 'email' | 'phone') => void;
  emailOrPhone: string;
  setEmailOrPhone: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  errorMessage: string;
  setErrorMessage: (val: string) => void;
  successMessage: string;
  setSuccessMessage: (val: string) => void;
  loading: boolean;
  showOTPCodeScreen: boolean;
  setShowOTPCodeScreen: (val: boolean) => void;
  otpCode: string;
  setOtpCode: (val: string) => void;
  otpTimer: number;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleVerifyOTP: (e: React.FormEvent) => void;
  handleResendOTP: () => void;
  handleSocialLogin: (provider: 'google' | 'apple' | 'guest') => void;
  showForgotOverlay: boolean;
  setShowForgotOverlay: (val: boolean) => void;
  forgotEmail: string;
  setForgotEmail: (val: string) => void;
  forgotLoading: boolean;
  forgotSuccess: boolean;
  setForgotSuccess: (val: boolean) => void;
  handleResetPassword: (e: React.FormEvent) => void;
  showVerificationRequired: boolean;
  setShowVerificationRequired: (val: boolean) => void;
  resendingVerification: boolean;
  handleSimulateResendVerification: () => void;
  CinematicSpaceCanvas: React.ComponentType;
  LumiGuide: React.ComponentType<{ lang: 'en' | 'ar' }>;
  CosmicRing: React.ComponentType<{ introStage: 'intro' | 'main'; lang: 'en' | 'ar' }>;
}

export default function LoginView({
  lang,
  setLang,
  playSynthSound,
  navigate,
  introStage,
  loginTab,
  setLoginTab,
  emailOrPhone,
  setEmailOrPhone,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  loading,
  showOTPCodeScreen,
  setShowOTPCodeScreen,
  otpCode,
  setOtpCode,
  otpTimer,
  handleLoginSubmit,
  handleVerifyOTP,
  handleResendOTP,
  handleSocialLogin,
  showForgotOverlay,
  setShowForgotOverlay,
  forgotEmail,
  setForgotEmail,
  forgotLoading,
  forgotSuccess,
  setForgotSuccess,
  handleResetPassword,
  showVerificationRequired,
  setShowVerificationRequired,
  resendingVerification,
  handleSimulateResendVerification,
  CinematicSpaceCanvas,
  LumiGuide,
  CosmicRing
}: LoginViewProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#020208] flex flex-col items-center justify-center font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* 1. Full-Screen Cinematic Portrait Background Image */}
      <img 
        src={lumoWelcomeBg} 
        alt="Lodavia Deep Cosmic background" 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 scale-105 animate-[pulse_10s_infinite_alternate]"
        referrerPolicy="no-referrer"
      />

      {/* 2. Deep Space Ambient Overlays */}
      <div className="absolute inset-0 bg-slate-950/20 z-1 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 z-2 pointer-events-none" />

      {/* MAIN LOGIN CONTAINER */}
      <div className="relative z-30 w-full max-w-[400px] px-6 py-6 mx-auto flex flex-col justify-center items-center min-h-screen" id="lodavia-login-main-container">
        
        {/* Top Navigation & Language Actions */}
        <div className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between">
          <button
            onClick={() => {
              playSynthSound(440, 'sine', 0.08);
              navigate('/');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-slate-950/75 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <ArrowLeft className={`w-3.5 h-3.5 text-cyan-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
          </button>

          <button
            id="lodavia-lang-switcher"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setLang(lang === 'en' ? 'ar' : 'en');
            }}
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-slate-900/40 hover:bg-slate-900/70 text-[10px] font-black tracking-wider text-slate-300 uppercase transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-95"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* The Cosmic Ring */}
        <div className="flex flex-col items-center justify-center mb-4 mt-12 z-20" id="cosmic-ring-holder">
          <CosmicRing introStage="main" lang={lang} />
        </div>

        {/* Sub-header text below ring */}
        <div className="text-center mb-4">
          <p className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-200 to-cyan-300 font-black uppercase tracking-[0.35em]">
            {lang === 'ar' ? 'اكتشف كونك الخاص' : 'DISCOVER YOUR UNIVERSE'}
          </p>
        </div>

        {/* The Glassmorphism login card */}
        <div className="w-full rounded-[28px] p-6 border border-white/10 bg-[#020412]/45 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.07)] flex flex-col gap-4">
              {/* Lumi AI Guide */}
              <LumiGuide lang={lang} />

              {/* Tab switchers: Email / Phone */}
              {!showOTPCodeScreen && (
                <div className="grid grid-cols-2 p-1 rounded-full bg-slate-950/60 border border-white/5 backdrop-blur-xl mb-1 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]">
                  <button
                    id="lodavia-login-tab-email"
                    onClick={() => {
                      setLoginTab('email');
                      playSynthSound(500, 'sine', 0.05);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                      loginTab === 'email' 
                        ? 'bg-gradient-to-r from-cyan-500/85 to-blue-600/85 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </button>
                  <button
                    id="lodavia-login-tab-phone"
                    onClick={() => {
                      setLoginTab('phone');
                      playSynthSound(500, 'sine', 0.05);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className={`py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                      loginTab === 'phone' 
                        ? 'bg-gradient-to-r from-cyan-500/85 to-blue-600/85 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </button>
                </div>
              )}

              {/* Notices container */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div 
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-950/20 border border-red-500/25 text-[11px] text-red-400 mb-1 shadow-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span className="font-semibold leading-relaxed">{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div 
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 text-[11px] text-emerald-400 mb-1 shadow-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-semibold leading-relaxed">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Credentials form */}
              {!showOTPCodeScreen ? (
                <>
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    {/* Email / Phone input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-300 px-1 uppercase tracking-wider">
                        {loginTab === 'email' 
                          ? (lang === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني' : 'Email Address')
                          : (lang === 'ar' ? 'رقم الهاتف المتنقل' : 'Mobile Phone Number')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
                          {loginTab === 'email' ? <User className="w-4 h-4 text-cyan-400/80" /> : <Smartphone className="w-4 h-4 text-cyan-400/80" />}
                        </div>
                        <input
                          type={loginTab === 'email' ? 'email' : 'tel'}
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder={loginTab === 'email' ? 'yourname@domain.com' : '+966 5X XXX XXXX'}
                          className="w-full py-3 ps-11 pe-4 rounded-xl text-xs bg-slate-950/70 text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-300"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>

                    {/* Password input */}
                    {loginTab === 'email' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-300 px-1 uppercase tracking-wider">
                          {lang === 'ar' ? 'كلمة المرور الكونية' : 'Password'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4 text-cyan-400/80" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full py-3 ps-11 pe-11 rounded-xl text-xs bg-slate-950/70 text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-300"
                            disabled={loading}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center text-[11px] text-slate-400 px-1 mt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-white/20 bg-slate-950 text-cyan-500 focus:ring-0 w-3.5 h-3.5 transition-colors cursor-pointer"
                        />
                        <span className="font-semibold text-slate-300">{lang === 'ar' ? 'تذكرني' : 'Remember me'}</span>
                      </label>
                      {loginTab === 'email' && (
                        <button
                          type="button"
                          onClick={() => {
                            playSynthSound(600, 'sine', 0.1);
                            setShowForgotOverlay(true);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
                        >
                          {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                        </button>
                      )}
                    </div>

                    {/* Sign In / Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group w-full py-3.5 mt-2 rounded-xl font-black text-xs tracking-widest text-slate-950 overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-50 animate-pulse"
                      style={{ animationDuration: '4000ms' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-400 group-hover:scale-105 transition-all duration-500" />
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                        ) : (
                          <>
                            <span>
                              {loginTab === 'email' 
                                ? (lang === 'ar' ? 'تسجيل الدخول 🔑' : 'Sign In 🔑')
                                : (lang === 'ar' ? 'إرسال كود التحقق 💬' : 'Send Verification Code 💬')}
                            </span>
                            <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  {/* Separator */}
                  <div className="flex items-center gap-3 my-1 text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] px-1">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span>{lang === 'ar' ? 'أو عبر الحسابات الأخرى' : 'Or enter via'}</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>

                  {/* Social Buttons - 3 Circular Glass Buttons */}
                  <div className="flex justify-center gap-4 py-1">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                      className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-slate-200 transition-all hover:border-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Google Account"
                    >
                      <span className="text-cyan-400 font-black text-sm">G</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('apple')}
                      disabled={loading}
                      className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-slate-200 transition-all hover:border-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Apple ID"
                    >
                      <span className="text-white text-lg leading-none mb-0.5"></span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('guest')}
                      disabled={loading}
                      className="w-11 h-11 rounded-full border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 flex items-center justify-center text-cyan-400 transition-all hover:border-cyan-400/40 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Cosmic Guest"
                    >
                      <span className="text-sm">🪐</span>
                    </button>
                  </div>
                </>
              ) : (
                /* OTP Screen */
                <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">
                  <button 
                    onClick={() => {
                      playSynthSound(440, 'sine', 0.1);
                      setShowOTPCodeScreen(false);
                      setOtpCode('');
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors self-start font-semibold cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'تغيير رقم الهاتف' : 'Change Phone Number'}</span>
                  </button>

                  <div className="text-center py-0.5">
                    <h3 className="text-sm font-black text-white">
                      {lang === 'ar' ? 'أدخل رمز الأمان المرسل 🔒' : 'Verify Secure Code 🔒'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {lang === 'ar' ? `رمز التحقق مرسل إلى ${emailOrPhone}` : `Sent 4-digit code to ${emailOrPhone}`}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-center">
                      <input 
                        type="text" 
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234"
                        className="w-36 text-center text-xl font-bold tracking-[8px] py-2.5 px-4 rounded-xl border border-white/15 bg-slate-950 text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 select-all shadow-inner"
                        disabled={loading}
                        autoFocus
                        required
                      />
                      <span className="text-[9px] text-slate-500 mt-1 text-center leading-relaxed max-w-xs">
                        {lang === 'ar' ? 'تلميح: أدخل الكود المكون من أي 4 أرقام للمتابعة.' : 'Tip: Enter any 4 digits to simulate confirmation.'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group w-full py-3.5 mt-1 rounded-xl font-black text-xs tracking-widest text-slate-950 overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-400 group-hover:scale-105 transition-all duration-500" />
                      <span className="relative flex items-center justify-center gap-1.5">
                        {loading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                        ) : (
                          <>
                            <span>{lang === 'ar' ? 'تأكيد الرمز والدخول 🚀' : 'Verify Code & Launch 🚀'}</span>
                            <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="text-center mt-0.5 text-xs">
                    {otpTimer > 0 ? (
                      <span className="text-slate-500 font-medium text-[11px]">
                        {lang === 'ar' ? `إمكانية إعادة الإرسال خلال ${otpTimer} ثانية` : `Resend code in ${otpTimer}s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold cursor-pointer underline text-[11px]"
                      >
                        {lang === 'ar' ? 'إعادة إرسال الرمز الكوني 🔁' : 'Resend cosmic code 🔁'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Forge Account & Footer text */}
            <div className="text-center mt-6 text-xs flex flex-col gap-4">
              <div>
                <span className="text-slate-400 font-medium">{lang === 'ar' ? 'ليس لديك حساب كوني؟ ' : "New traveler to Lodavia? "}</span>
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.1);
                    navigate('/signup');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-black transition-colors cursor-pointer underline ml-1"
                >
                  {lang === 'ar' ? 'إنشاء حساب جديد 🚀' : 'Forge New Account 🚀'}
                </button>
              </div>

              <div className="flex flex-col items-center gap-1 mt-1 text-slate-500">
                <p className="text-[10px] tracking-wide font-semibold">
                  {lang === 'ar' ? 'كون من الاتصالات والفرص الكونية' : 'A universe of connections and possibilities'}
                </p>
                <div className="text-cyan-400/50 animate-pulse mt-0.5">✦</div>
              </div>
            </div>
          </div>

      {/* OVERLAY 1: FORGOT PASSWORD SCREEN */}
      <AnimatePresence>
        {showForgotOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md p-6 rounded-[24px] border border-white/10 bg-[#020412]/90 shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.05);
                  setShowForgotOverlay(false);
                  setForgotSuccess(false);
                  setForgotEmail('');
                }}
                className="absolute top-5 right-5 p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>

              <div className="text-center mb-5 mt-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-base font-black text-white">
                  {lang === 'ar' ? 'استعادة كلمة المرور الكونية 🛰️' : 'Reset Cosmic Password 🛰️'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  {lang === 'ar' ? 'سنرسل لك رابطًا كونيًا في بريدك لإعادة تعيين كلمة المرور بكل أمان.' : 'We will send a cosmic secure recovery link to your inbox.'}
                </p>
              </div>

              {forgotSuccess ? (
                <div className="text-center p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 text-xs animate-[fadeIn_0.3s_ease-out]">
                  <p className="font-bold mb-1">📬 {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent successfully!'}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {lang === 'ar' ? `رابط استعادة المرور الكوني في الطريق إلى بريدك ${forgotEmail}.` : `Cosmic recovery link is on its way to ${forgotEmail}.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1 uppercase tracking-wider">
                      {lang === 'ar' ? 'بريدك الإلكتروني' : 'Your Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4 text-cyan-400/80" />
                      </div>
                      <input 
                        type="email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full py-3 ps-11 pe-4 rounded-xl text-xs bg-slate-950/70 text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
                        disabled={forgotLoading}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="relative group w-full py-3.5 mt-1 rounded-xl font-black text-xs tracking-widest text-slate-950 overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-400 group-hover:scale-105 transition-all duration-500" />
                    <span className="relative flex items-center justify-center gap-1.5">
                      {forgotLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                      ) : (
                        <span>{lang === 'ar' ? 'إرسال رابط التعيين 🚀' : 'Send Recovery Link 🚀'}</span>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY 2: EMAIL VERIFICATION REQUIRED */}
      <AnimatePresence>
        {showVerificationRequired && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md p-6 rounded-[24px] border border-white/10 bg-[#020412]/90 shadow-2xl relative text-center"
            >
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.05);
                  setShowVerificationRequired(false);
                }}
                className="absolute top-5 right-5 p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>

              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>

              <h3 className="text-base font-black text-white">
                {lang === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني 📨' : 'Verify Email Address 📨'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed px-2">
                {lang === 'ar' 
                  ? `أرسلنا رابط تفعيل كوني إلى بريدك ${emailOrPhone}. يرجى تفعيل حسابك أولاً لتتمكن من الدخول إلى Lodavia.` 
                  : `A cosmic activation link has been sent to ${emailOrPhone}. Please verify your account first to access Lodavia.`}
              </p>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleSimulateResendVerification}
                  disabled={resendingVerification}
                  className="relative group w-full py-3.5 rounded-xl font-black text-xs tracking-widest text-slate-950 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-400 group-hover:scale-105 transition-all duration-500" />
                  <span className="relative flex items-center justify-center gap-1.5">
                    {resendingVerification ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <span>{lang === 'ar' ? 'إعادة إرسال رابط التفعيل 🔁' : 'Resend Activation Link 🔁'}</span>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => {
                    playSynthSound(440, 'sine', 0.05);
                    setShowVerificationRequired(false);
                  }}
                  className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all active:scale-95 cursor-pointer"
                >
                  {lang === 'ar' ? 'الرجوع ومحاولة تسجيل الدخول' : 'Go Back & Try Sign In'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
