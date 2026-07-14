import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../firebase/services';
import { 
  ArrowRight, 
  ArrowLeft, 
  Languages, 
  Sparkles, 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  AlertCircle, 
  CheckCircle, 
  X, 
  User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import lumoWelcomeBg from '../assets/images/lumo_welcome_bg_1783872976024.jpg';

export default function Login() {
  const { lang, setLang, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();

  // Notification States
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form States
  const [loginTab, setLoginTab] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone Verification OTP States
  const [showOTPCodeScreen, setShowOTPCodeScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);

  // Forgot Password Overlay States
  const [showForgotOverlay, setShowForgotOverlay] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Email Verification simulation
  const [showVerificationRequired, setShowVerificationRequired] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOTPCodeScreen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTPCodeScreen, otpTimer]);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailOrPhone) {
      playSynthSound(150, 'sawtooth', 0.2);
      setErrorMessage(lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني أو رقم الهاتف' : 'Please enter your email or phone number');
      return;
    }

    if (loginTab === 'email') {
      if (!password) {
        playSynthSound(150, 'sawtooth', 0.2);
        setErrorMessage(lang === 'ar' ? 'الرجاء إدخال كلمة المرور' : 'Please enter your password');
        return;
      }

      setLoading(true);
      playSynthSound(523.25, 'sine', 0.1);
      try {
        const user = await authService.login(emailOrPhone, password);
        
        // Simulating email verification check requirement
        if (emailOrPhone.includes('verify')) {
          playSynthSound(300, 'sine', 0.15);
          setShowVerificationRequired(true);
          setLoading(false);
          return;
        }

        setCurrentUser(user);
        playSynthSound(880, 'sine', 0.25);
        navigate('/home');
      } catch (error: any) {
        playSynthSound(150, 'sawtooth', 0.2);
        setErrorMessage(error.message || (lang === 'ar' ? 'حدث خطأ في المصادقة' : 'Authentication error'));
      } finally {
        setLoading(false);
      }
    } else {
      // Phone verification code trigger
      setLoading(true);
      playSynthSound(600, 'sine', 0.1);
      setTimeout(() => {
        setLoading(false);
        setShowOTPCodeScreen(true);
        setOtpTimer(59);
        playSynthSound(800, 'sine', 0.15);
        setSuccessMessage(lang === 'ar' ? 'تم إرسال كود التحقق المكون من 4 أرقام 📱' : 'A 4-digit verification code has been sent 📱');
      }, 1200);
    }
  };

  // OTP Verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (otpCode.length < 4) {
      playSynthSound(150, 'sawtooth', 0.2);
      setErrorMessage(lang === 'ar' ? 'الرجاء إدخال كود التحقق كاملاً' : 'Please enter the complete verification code');
      return;
    }

    setLoading(true);
    playSynthSound(523.25, 'sine', 0.1);
    try {
      const user = await authService.signInWithPhone(emailOrPhone);
      setCurrentUser(user);
      playSynthSound(880, 'sine', 0.25);
      navigate('/home');
    } catch (err: any) {
      playSynthSound(150, 'sawtooth', 0.2);
      setErrorMessage(lang === 'ar' ? 'كود التحقق غير صالح أو منتهي الصلاحية' : 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (otpTimer > 0) return;
    playSynthSound(700, 'sine', 0.1);
    setOtpTimer(59);
    setSuccessMessage(lang === 'ar' ? 'تمت إعادة إرسال الكود الكوني!' : 'Cosmic code resent successfully!');
  };

  // Social Login handler
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    playSynthSound(523.25, 'sine', 0.1);
    try {
      const user = provider === 'google' 
        ? await authService.signInWithGoogle() 
        : await authService.signInWithApple();
      setCurrentUser(user);
      playSynthSound(880, 'sine', 0.2);
      navigate('/home');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      playSynthSound(150, 'sawtooth', 0.2);
      return;
    }
    setForgotLoading(true);
    playSynthSound(600, 'sine', 0.1);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
      playSynthSound(880, 'sine', 0.2);
    }, 1500);
  };

  const handleSimulateResendVerification = () => {
    setResendingVerification(true);
    playSynthSound(600, 'sine', 0.1);
    setTimeout(() => {
      setResendingVerification(false);
      playSynthSound(900, 'sine', 0.15);
      setSuccessMessage(lang === 'ar' ? 'تم إرسال رابط تفعيل جديد لبريدك بنجاح! ✉️' : 'New activation link sent to your email! ✉️');
    }, 1500);
  };

  return (
    <div className="flex-1 min-h-screen relative flex flex-col justify-between items-center text-center overflow-x-hidden overflow-y-auto px-6 py-8">
      {/* 1. Full-Screen Background Image */}
      <img 
        src={lumoWelcomeBg} 
        alt="Lodavia Deep Cosmic background" 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 scale-105 animate-[pulse_10s_infinite_alternate]"
        referrerPolicy="no-referrer"
      />

      {/* 2. Deep Space Ambient Overlays */}
      <div className="absolute inset-0 bg-slate-950/20 z-1 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 z-2 pointer-events-none" />

      {/* 3. Global Language & Navigation Header */}
      <div className="w-full max-w-md flex justify-between items-center z-10 relative mt-2">
        <button 
          onClick={() => {
            playSynthSound(440, 'sine', 0.08);
            navigate('/welcome');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-slate-950/75 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <ArrowLeft className={`w-3.5 h-3.5 text-cyan-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          <span>{lang === 'ar' ? 'الرئيسية' : 'Main'}</span>
        </button>

        <motion.button 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => {
            setLang(lang === 'ar' ? 'en' : 'ar');
            playSynthSound(600, 'sine', 0.05);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-slate-950/75 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </motion.button>
      </div>

      {/* 4. Elegant Centered Header */}
      <div className="my-auto py-4 flex flex-col items-center justify-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-36 h-36 flex items-center justify-center mb-2"
        >
          {/* Main Ring Outer Glow */}
          <div className="absolute inset-0 rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
          <div className="absolute inset-[-4px] rounded-full border border-cyan-500/10 blur-[1.5px]" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-cyan-400/80 border-r-cyan-200/80 rotate-45 blur-[0.75px]" />
          <div className="absolute inset-[1px] rounded-full border border-transparent border-t-white/90 border-r-cyan-300/60 rotate-45" />

          {/* Soft inner radial gradient matching the screen */}
          <div className="absolute inset-1 rounded-full bg-slate-950/20 backdrop-blur-[1px]" />

          {/* Title */}
          <div className="flex flex-col items-center justify-center select-none z-10 mt-1">
            <span 
              className="text-2xl font-extralight text-white tracking-[0.35em] pl-[0.35em] font-sans"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(34,211,238,0.4)' }}
            >
              LODAVIA
            </span>
          </div>
        </motion.div>
      </div>

      {/* 5. Login Box Glass Block */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 relative mt-auto mb-2" id="action-panel-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-start"
        >
          <div className="w-full rounded-[28px] p-6 border border-white/10 bg-[#090b16]/75 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
            {/* Title */}
            <div className="text-center py-1">
              <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">
                {lang === 'ar' ? 'الولوج إلى حسابك الكوني' : 'LOGIN TO YOUR COSMOS'}
              </p>
            </div>

            {/* Tab switchers: Email / Phone */}
            {!showOTPCodeScreen && (
              <div className="grid grid-cols-2 p-1 rounded-full bg-slate-950/60 border border-white/5 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('email');
                    playSynthSound(500, 'sine', 0.05);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                    loginTab === 'email' 
                      ? 'bg-gradient-to-r from-blue-600 to-[#512da8] text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('phone');
                    playSynthSound(500, 'sine', 0.05);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                    loginTab === 'phone' 
                      ? 'bg-gradient-to-r from-blue-600 to-[#512da8] text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </button>
              </div>
            )}

            {/* Notification banners */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/20 border border-red-500/25 text-[11px] text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-[11px] text-emerald-400">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-semibold leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Forms */}
            {!showOTPCodeScreen ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-300 px-1 uppercase tracking-wider">
                    {loginTab === 'email' 
                      ? (lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address')
                      : (lang === 'ar' ? 'رقم الهاتف' : 'Mobile Phone Number')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                      {loginTab === 'email' ? <User className="w-4 h-4 text-cyan-400/80" /> : <Smartphone className="w-4 h-4 text-cyan-400/80" />}
                    </div>
                    <input
                      type={loginTab === 'email' ? 'email' : 'tel'}
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder={loginTab === 'email' ? 'yourname@domain.com' : '+966 5X XXX XXXX'}
                      className="w-full py-3 ps-11 pr-4 rounded-xl text-xs bg-slate-950/70 text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {loginTab === 'email' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1 uppercase tracking-wider">
                      {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-cyan-400/80" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full py-3 ps-11 pr-11 rounded-xl text-xs bg-slate-950/70 text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {loginTab === 'email' && (
                  <div className="flex justify-end text-[10px] px-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotOverlay(true)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold cursor-pointer"
                    >
                      {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2c4ed3] to-[#512da8] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>
                        {loginTab === 'email' 
                          ? (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                          : (lang === 'ar' ? 'إرسال الرمز' : 'Send Code')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // OTP Form
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 text-center">
                <p className="text-xs text-slate-300">
                  {lang === 'ar' ? `رمز التحقق مرسل إلى ${emailOrPhone}` : `Enter verification code sent to ${emailOrPhone}`}
                </p>
                <input 
                  type="text" 
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-36 mx-auto text-center text-xl font-bold tracking-[8px] py-2.5 px-4 rounded-xl border border-white/15 bg-slate-950 text-cyan-400 focus:outline-none"
                  disabled={loading}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2c4ed3] to-[#512da8] hover:brightness-110 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'تأكيد ودخول 🚀' : 'Confirm & Launch 🚀')}
                </button>
                <div className="text-center text-xs mt-1">
                  {otpTimer > 0 ? (
                    <span className="text-slate-500">{lang === 'ar' ? `إعادة الإرسال بعد ${otpTimer} ثانية` : `Resend in ${otpTimer}s`}</span>
                  ) : (
                    <button type="button" onClick={handleResendOTP} className="text-cyan-400 underline font-bold cursor-pointer">
                      {lang === 'ar' ? 'إعادة إرسال الرمز الكوني' : 'Resend Code'}
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Separator */}
            <div className="flex items-center gap-3 my-1 text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] px-1">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span>{lang === 'ar' ? 'أو الدخول عبر' : 'Or login with'}</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Social Logins */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-slate-200 transition-all cursor-pointer"
              >
                <span className="text-cyan-400 font-black text-sm">G</span>
              </button>
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-slate-200 transition-all cursor-pointer"
              >
                <span className="text-white text-lg leading-none mb-0.5"></span>
              </button>
            </div>

            {/* Link to Signup */}
            <div className="text-center mt-2 text-[11px]">
              <span className="text-slate-400">{lang === 'ar' ? 'ليس لديك حساب؟ ' : 'New to Lodavia? '}</span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-cyan-400 font-extrabold hover:underline cursor-pointer"
              >
                {lang === 'ar' ? 'سجل الآن 🔐' : 'Sign Up 🔐'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Overlay */}
      <AnimatePresence>
        {showForgotOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[28px] p-6 border border-white/10 bg-[#090b16]/90 backdrop-blur-xl shadow-2xl text-start flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-white">{lang === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</h3>
                <button onClick={() => { playSynthSound(440, 'sine', 0.05); setShowForgotOverlay(false); setForgotSuccess(false); }} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotSuccess ? (
                <div className="flex flex-col items-center gap-3 text-center py-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
                  <p className="text-xs text-slate-200">
                    {lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح! 🌌' : 'Password reset link sent successfully! 🌌'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة مرورك الكونية.' : 'Enter your email address and we will send you a link to reset your password.'}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 px-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={(e) => setForgotEmail(e.target.value)} 
                      placeholder="name@domain.com" 
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 text-white border border-white/10 focus:outline-none"
                      required 
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 font-bold text-xs text-slate-950 uppercase flex items-center justify-center cursor-pointer">
                    {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'ar' ? 'إرسال رابط التعيين 🚀' : 'Send Link 🚀')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Verification Banner */}
      <AnimatePresence>
        {showVerificationRequired && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[28px] p-6 border border-white/10 bg-[#090b16]/90 text-center flex flex-col items-center gap-4"
            >
              <h3 className="text-sm font-black text-white">{lang === 'ar' ? 'تأكيد البريد الإلكتروني 📨' : 'Verify Email Address 📨'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar' ? `لقد أرسلنا رابط تفعيل كوني إلى بريدك ${emailOrPhone}. يرجى تأكيد حسابك لتتمكن من الدخول.` : `A activation link has been sent to ${emailOrPhone}. Please verify your account to proceed.`}
              </p>
              <button onClick={handleSimulateResendVerification} disabled={resendingVerification} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 font-bold text-xs text-slate-950 cursor-pointer">
                {resendingVerification ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'إعادة إرسال رابط التفعيل' : 'Resend Link')}
              </button>
              <button onClick={() => setShowVerificationRequired(false)} className="text-slate-400 hover:text-white underline text-xs cursor-pointer">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
