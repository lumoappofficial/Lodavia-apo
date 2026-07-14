import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../firebase/services';
import { 
  ArrowRight, 
  ArrowLeft, 
  Languages, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import lumoWelcomeBg from '../assets/images/lumo_welcome_bg_1783872976024.jpg';

export default function Signup() {
  const { lang, setLang, playSynthSound, setCurrentUser } = useApp();
  const navigate = useNavigate();

  // Notification States
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form States
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState('المملكة العربية السعودية');
  const [regLang, setRegLang] = useState('العربية');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestCategories = [
    { nameAr: 'كرة القدم', nameEn: 'Football', icon: '⚽' },
    { nameAr: 'برمجة', nameEn: 'Programming', icon: '💻' },
    { nameAr: 'سباحة', nameEn: 'Swimming', icon: '🏊' },
    { nameAr: 'ذكاء اصطناعي', nameEn: 'AI', icon: '🤖' },
    { nameAr: 'لغات', nameEn: 'Languages', icon: '📚' },
    { nameAr: 'موسيقى', nameEn: 'Music', icon: '🎵' },
    { nameAr: 'ألعاب', nameEn: 'Gaming', icon: '🎮' },
    { nameAr: 'تصوير', nameEn: 'Photography', icon: '📷' },
    { nameAr: 'سفر', nameEn: 'Travel', icon: '🌍' }
  ];

  const toggleInterest = (interest: string) => {
    playSynthSound(600, 'sine', 0.05);
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Signup submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regStep === 1) {
      if (!regName || !regEmail || !regPassword) {
        playSynthSound(150, 'sawtooth', 0.2);
        setErrorMessage(lang === 'ar' ? 'الرجاء ملء الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
      setErrorMessage('');
      playSynthSound(587.33, 'sine', 0.1);
      setRegStep(2);
    } else {
      setLoading(true);
      playSynthSound(523.25, 'sine', 0.15);
      try {
        const user = await authService.signup(regEmail, regName, regPhone, regPassword, regCountry, regLang, selectedInterests);
        setCurrentUser(user);
        playSynthSound(880, 'sine', 0.3);
        navigate('/home');
      } catch (error: any) {
        playSynthSound(150, 'sawtooth', 0.2);
        setErrorMessage(error.message || (lang === 'ar' ? 'خطأ أثناء إنشاء الحساب' : 'Error creating account'));
      } finally {
        setLoading(false);
      }
    }
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

      {/* 2. Deep Space Overlays */}
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

      {/* 4. Elegant Centered Cosmic Ring with LODAVIA */}
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

      {/* 5. Signup Form Glass Block */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 relative mt-auto mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-start"
        >
          <div className="w-full rounded-[28px] p-6 border border-white/10 bg-[#090b16]/75 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
            <div className="text-center py-1">
              <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">
                {lang === 'ar' ? `إنشاء الحساب الكوني (خطوة ${regStep} من 2)` : `CREATE YOUR COSMOS (Step ${regStep} of 2)`}
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/20 border border-red-500/25 text-[11px] text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3.5">
              {regStep === 1 ? (
                <>
                  {/* Name input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      value={regName}
                      required
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={lang === 'ar' ? 'محمد العتيبي' : 'Mohamed Otaibi'}
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 text-white border border-white/10 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  {/* Email input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                    <input
                      type="email"
                      value={regEmail}
                      required
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="username@domain.com"
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 text-white border border-white/10 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  {/* Phone input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      value={regPhone}
                      required
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 text-white border border-white/10 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  {/* Password input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                    <input
                      type="password"
                      value={regPassword}
                      required
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 text-white border border-white/10 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Country & Language */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'الدولة' : 'Country'}</label>
                      <select 
                        value={regCountry} 
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-all"
                      >
                        <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                        <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                        <option value="مصر">مصر</option>
                        <option value="الأردن">الأردن</option>
                        <option value="الكويت">الكويت</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-300 px-1">{lang === 'ar' ? 'اللغة' : 'Language'}</label>
                      <select 
                        value={regLang} 
                        onChange={(e) => setRegLang(e.target.value)}
                        className="w-full py-2.5 px-3.5 rounded-xl text-xs bg-slate-950/70 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-all"
                      >
                        <option value="العربية">العربية</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-[10px] font-bold text-slate-300 px-1">
                      {lang === 'ar' ? 'اختر اهتماماتك المفضلة 🤖' : 'Select your cosmic interests 🤖'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-[140px] overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-white/5">
                      {interestCategories.map((cat) => {
                        const isSelected = selectedInterests.includes(cat.nameAr);
                        return (
                          <button
                            key={cat.nameAr}
                            type="button"
                            onClick={() => toggleInterest(cat.nameAr)}
                            className={`p-2 rounded-lg border text-[10px] flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-gradient-to-tr from-blue-600/20 to-purple-600/30 border-cyan-400/50 text-white' 
                                : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="text-sm">{cat.icon}</span>
                            <span className="font-bold text-[9px] truncate max-w-full">{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-2">
                {regStep === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      playSynthSound(440, 'sine', 0.1);
                      setRegStep(1);
                    }}
                    className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2c4ed3] to-[#512da8] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs uppercase flex items-center justify-center cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{regStep === 1 ? (lang === 'ar' ? 'التالي ✨' : 'Next ✨') : (lang === 'ar' ? 'تأكيد التسجيل' : 'Confirm')}</span>
                  )}
                </button>
              </div>
            </form>

            {/* Transition to Login */}
            <div className="text-center mt-2 text-[11px]">
              <span className="text-slate-400">{lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already registered? '}</span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-cyan-400 font-extrabold hover:underline cursor-pointer"
              >
                {lang === 'ar' ? 'تسجيل الدخول 🔐' : 'Sign In 🔐'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
