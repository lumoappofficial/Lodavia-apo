import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Zap, 
  Radio, 
  Flame, 
  Users, 
  Sparkles,
  Heart,
  Coins,
  Award,
  Play
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface GalaxyRescueGameProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

type Role = 'captain' | 'engineer' | 'shield' | 'humorist';

interface CrewMember {
  nameAr: string;
  nameEn: string;
  avatar: string;
  roleAr: string;
  roleEn: string;
  quoteAr: string;
  quoteEn: string;
}

interface Crisis {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  targetHintAr: string;
  targetHintEn: string;
  controlType: 'slider' | 'toggle' | 'button' | 'multi_switch';
  targetSliderValue?: number;
  targetToggleKey?: 'A' | 'B';
  targetToggleValue?: boolean;
}

const CREW_MEMBERS: CrewMember[] = [
  {
    nameAr: 'الكابتن حمص 👨‍يار',
    nameEn: 'Capt. Hummus 👨‍يار',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    roleAr: 'قائد القيادة',
    roleEn: 'Fleet Captain',
    quoteAr: 'ربط الأحزمة يا شباب! محرك الشاورما يضخ بلازما كوانتية متقطعة!',
    quoteEn: 'Fasten seatbelts crew! Shawarma drive is sparking quantum plasma!'
  },
  {
    nameAr: 'الآلي ساخر-9000 🤖',
    nameEn: 'Sarcastic AI-9000 🤖',
    avatar: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=100',
    roleAr: 'الذكاء الاصطناعي',
    roleEn: 'Mainframe AI',
    quoteAr: 'ماعز الفضاء تسللت مجدداً لمخزن البطاطس المجرية. أمر جميل للغاية.',
    quoteEn: 'Space goats infiltrated the cosmic potato vault again. Truly delightful.'
  },
  {
    nameAr: 'المهندسة منى 👩‍🔧',
    nameEn: 'Engineer Mona 👩‍🔧',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    roleAr: 'خبيرة المحركات',
    roleEn: 'Warp Specialist',
    quoteAr: 'الضغط الصوتي مرتفع! اضبط الصمام فوراً قبل تحول المركبة لإسبريسو!',
    quoteEn: 'Acoustic pressure peaking! Adjust the valve before we turn into espresso!'
  }
];

const CRISES_POOL: Crisis[] = [
  {
    id: 'cr_1',
    titleAr: 'انفجار آلة القهوة المجرّية! ☕',
    titleEn: 'Galactic Coffee Meltdown! ☕',
    descAr: 'ماكينة الإسبريسو تسرب طاقة فائقة في سيرفرات النيون!',
    descEn: 'Espresso machine leaking high energy into neon server racks!',
    targetHintAr: 'ارفع مؤشر ضغط الصمام الكوانتي إلى أعلى من 75%',
    targetHintEn: 'Increase valve slider to above 75%',
    controlType: 'slider',
    targetSliderValue: 75
  },
  {
    id: 'cr_2',
    titleAr: 'تسرب إشعاع الشاورما الكوانتية! 🌯',
    titleEn: 'Shawarma Radiation Surge! 🌯',
    descAr: 'بهارات الكركم تخترق عوازل درع النيوترونات!',
    descEn: 'Spicy mustard leaking into core neutron shields!',
    targetHintAr: 'قم بتشغيل المفتاح الثنائي أ (Toggle A)',
    targetHintEn: 'Turn ON Toggle Switch A',
    controlType: 'toggle',
    targetToggleKey: 'A',
    targetToggleValue: true
  },
  {
    id: 'cr_3',
    titleAr: 'هجوم ماعز الفضاء الجائعة! 🐐',
    titleEn: 'Space Goats Solar Mastication! 🐐',
    descAr: 'قطيع من ماعز المجرة يقضم الألواح الشمسية التيتانيوم!',
    descEn: 'A herd of cosmic goats is eating our titanium solar panels!',
    targetHintAr: 'اضغط على زر النبض الأحمر الساخن بسرعة!',
    targetHintEn: 'Press the hot Red Impulse Button!',
    controlType: 'button'
  },
  {
    id: 'cr_4',
    titleAr: 'الآلي يبث موسيقى طرب مجري صاخب! 🎶',
    titleEn: 'AI Mainframe Blasting Techno Beats! 🎶',
    descAr: 'النظام محتجز في حلقة صوتية صاخبة! عطل المفتاح ب إجبارياً!',
    descEn: 'Mainframe is stuck in a loud audio loop! Turn OFF Toggle B!',
    targetHintAr: 'قم بإيقاف تشغيل المفتاح الثنائي ب (Toggle B)',
    targetHintEn: 'Turn OFF Toggle Switch B',
    controlType: 'toggle',
    targetToggleKey: 'B',
    targetToggleValue: false
  }
];

export default function GalaxyRescueGame({ onBack, onFinishGame }: GalaxyRescueGameProps) {
  const { lang, playSynthSound } = useApp();

  // Role Selection State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Game Loop States
  const [gameState, setGameState] = useState<'role_select' | 'playing' | 'win' | 'fail'>('role_select');
  const [currentCrisis, setCurrentCrisis] = useState<Crisis | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hullHealth, setHullHealth] = useState(100);
  const [crisesResolved, setCrisesResolved] = useState(0);
  const totalCrisesNeeded = 5;
  const [logs, setLogs] = useState<string[]>([]);

  // Console Interactive Controls
  const [sliderVal, setSliderVal] = useState(30);
  const [toggleA, setToggleA] = useState(false);
  const [toggleB, setToggleB] = useState(true);

  // Sound Helper
  const triggerSound = (freq: number, type: 'sine' | 'sawtooth' | 'square' = 'sine', duration = 0.1) => {
    playSynthSound(freq, type, duration);
  };

  const startRescueSession = (role: Role) => {
    setSelectedRole(role);
    setGameState('playing');
    setHullHealth(100);
    setCrisesResolved(0);
    setLogs([
      lang === 'ar' ? '🚀 تم ربط طاقم السفينة وتفعيل لوحات التشفير الكوانتية!' : '🚀 Quantum crew link established! System console online.',
      lang === 'ar' ? '🚨 تنبيه: أجهزة الإنذار الفضائية تعمل بكامل طاقتها!' : '🚨 ALERT: Ship alarms activated!'
    ]);
    triggerNewCrisis();
  };

  const triggerNewCrisis = () => {
    const nextCrisis = CRISES_POOL[Math.floor(Math.random() * CRISES_POOL.length)];
    setCurrentCrisis(nextCrisis);
    setTimeLeft(12);
    triggerSound(440, 'sawtooth', 0.15);
  };

  // Timer Interval Effect
  useEffect(() => {
    if (gameState !== 'playing' || !currentCrisis) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Crisis Fail
          triggerSound(120, 'sawtooth', 0.3);
          setHullHealth(h => {
            const nextHull = Math.max(0, h - 25);
            setLogs(prevLogs => [
              ...prevLogs,
              lang === 'ar'
                ? `💥 تفجرت الأزمة! انخفضت سلامة الهيكل لـ ${nextHull}%`
                : `💥 Crisis went unresolved! Hull damage sustained (${nextHull}% left)`
            ]);
            if (nextHull <= 0) {
              setGameState('fail');
              triggerSound(150, 'sawtooth', 0.5);
              onFinishGame(30, 5, false);
            } else {
              triggerNewCrisis();
            }
            return nextHull;
          });
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentCrisis, lang]);

  // Action Logic
  const handleAction = (type: 'slider' | 'toggleA' | 'toggleB' | 'button', val?: any) => {
    if (!currentCrisis || gameState !== 'playing') return;

    let isSuccess = false;

    if (type === 'slider' && currentCrisis.controlType === 'slider') {
      if (val >= (currentCrisis.targetSliderValue || 75)) isSuccess = true;
    } else if (type === 'toggleA' && currentCrisis.controlType === 'toggle' && currentCrisis.targetToggleKey === 'A') {
      if (val === currentCrisis.targetToggleValue) isSuccess = true;
    } else if (type === 'toggleB' && currentCrisis.controlType === 'toggle' && currentCrisis.targetToggleKey === 'B') {
      if (val === currentCrisis.targetToggleValue) isSuccess = true;
    } else if (type === 'button' && currentCrisis.controlType === 'button') {
      isSuccess = true;
    }

    if (isSuccess) {
      triggerSound(880, 'sine', 0.1);
      setTimeout(() => triggerSound(1100, 'sine', 0.1), 100);

      const resolved = crisesResolved + 1;
      setCrisesResolved(resolved);

      setLogs(prev => [
        ...prev,
        lang === 'ar' 
          ? `✅ تم التعامل مع أزمة "${currentCrisis.titleAr}" بنجاح!` 
          : `✅ Resolved crisis "${currentCrisis.titleEn}" successfully!`
      ]);

      if (resolved >= totalCrisesNeeded) {
        setGameState('win');
        triggerSound(523, 'sine', 0.1);
        setTimeout(() => triggerSound(659, 'sine', 0.1), 80);
        setTimeout(() => triggerSound(783, 'sine', 0.2), 160);
        onFinishGame(150, 60, true);
      } else {
        triggerNewCrisis();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-950/90 border border-purple-500/30 rounded-3xl shadow-2xl text-white">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'ar' ? 'العودة لمركز الألعاب' : 'Back to Games Hub'}
        </button>

        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-purple-400 animate-pulse" />
          <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
            {lang === 'ar' ? 'مهمة إنقاذ المجرة 🚀' : 'Galaxy Rescue Mission 🚀'}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-purple-950/50 border border-purple-500/30 px-3 py-1 rounded-xl">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Co-Op Active</span>
        </div>
      </div>

      {/* ROLE SELECTION SCREEN */}
      {gameState === 'role_select' && (
        <div className="py-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h3 className="text-xl font-black text-white mb-2">
            {lang === 'ar' ? 'اختر دورك في طاقم السفينة الكونية 👨‍' : 'Select Your Bridge Role 👨‍'}
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-8">
            {lang === 'ar'
              ? 'سيعمل معك الطاقم الفضائي الآلي لحل الأزمات الفجائية! اختر وظيفتك التخصصية لقيادة الكونسول.'
              : 'Collaborate with your automated bridge crew to fix space emergencies! Pick your console specialty.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { id: 'captain', titleAr: 'قائد الطاقم 👨‍يار', titleEn: 'Fleet Captain', descAr: 'إدارة وتوجيه الأوامر وتثبيت معنويات المركبة', descEn: 'Directing orders and stabilizing ship morale' },
              { id: 'engineer', titleAr: 'المهندس الكوانتي 👩‍🔧', titleEn: 'Quantum Engineer', descAr: 'التحكم بالصمامات وموازنة الضغط الحراري', descEn: 'Handling pressure valves and thermal loops' },
              { id: 'shield', titleAr: 'خبير الدروع 🛡️', titleEn: 'Shield Specialist', descAr: 'صد إشعاعات الشاورما والدروع النيوترونية', descEn: 'Blocking shawarma radiation & neutron fields' },
              { id: 'humorist', titleAr: 'آلي السخرية الكونية 🤖', titleEn: 'AI Humorist', descAr: 'إطلاق هالات الصدمات الصوتية الساخرة', descEn: 'Firing audio shockwaves and sarcastic banter' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => startRescueSession(r.id as Role)}
                className="p-4 bg-slate-900/80 hover:bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/60 rounded-2xl text-start transition-all group cursor-pointer"
              >
                <div className="font-extrabold text-sm text-purple-300 group-hover:text-cyan-300 transition-colors">
                  {lang === 'ar' ? r.titleAr : r.titleEn}
                </div>
                <div className="text-xs text-slate-400 mt-1">{lang === 'ar' ? r.descAr : r.descEn}</div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded-2xl max-w-2xl mx-auto text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
              <span>{lang === 'ar' ? 'طاقم المساعدة جاهز لمساندتك فور بدء المهمة!' : 'AI bridge mates are linked and standing by!'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING SCREEN */}
      {gameState === 'playing' && currentCrisis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN DASHBOARD & CONSOLE */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATUS HUD */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/60 border border-white/10 rounded-2xl">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'ar' ? 'سلامة الدروع' : 'Hull Integrity'}</div>
                <div className="text-base font-black text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Shield className="w-4 h-4" />
                  <span>{hullHealth}%</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'ar' ? 'الأزمات المعالجة' : 'Crises Solved'}</div>
                <div className="text-base font-black text-cyan-400 mt-1">
                  {crisesResolved} / {totalCrisesNeeded}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'ar' ? 'الوقت المتبقي' : 'Time Left'}</div>
                <div className={`text-base font-black font-mono mt-1 ${timeLeft <= 4 ? 'text-rose-500 animate-ping' : 'text-yellow-400'}`}>
                  {timeLeft}s
                </div>
              </div>
            </div>

            {/* CRISIS ALERT BOX */}
            <motion.div
              key={currentCrisis.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900/80 border-2 border-rose-500/40 rounded-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
                <h3 className="text-base font-black text-rose-300">
                  {lang === 'ar' ? currentCrisis.titleAr : currentCrisis.titleEn}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {lang === 'ar' ? currentCrisis.descAr : currentCrisis.descEn}
              </p>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-yellow-300 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{lang === 'ar' ? currentCrisis.targetHintAr : currentCrisis.targetHintEn}</span>
              </div>
            </motion.div>

            {/* INTERACTIVE CONTROLS CONSOLE */}
            <div className="p-5 bg-slate-900/80 border border-white/10 rounded-2xl space-y-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                {lang === 'ar' ? 'لوحة تحكم الطوارئ الكوانتية' : 'Emergency Control Console'}
              </h4>

              {/* SLIDER CONTROL */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">{lang === 'ar' ? 'صمام الضغط الكوانتي' : 'Quantum Valve Pressure'}</span>
                  <span className="text-cyan-400 font-mono">{sliderVal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setSliderVal(v);
                    handleAction('slider', v);
                  }}
                  className="w-full accent-cyan-400 bg-black/50 h-3 rounded-lg cursor-pointer"
                />
              </div>

              {/* TOGGLES & RED BUTTON */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* TOGGLE A */}
                <button
                  onClick={() => {
                    const next = !toggleA;
                    setToggleA(next);
                    handleAction('toggleA', next);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    toggleA 
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                      : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                >
                  <Radio className="w-5 h-5" />
                  <span>Toggle A: {toggleA ? 'ON' : 'OFF'}</span>
                </button>

                {/* TOGGLE B */}
                <button
                  onClick={() => {
                    const next = !toggleB;
                    setToggleB(next);
                    handleAction('toggleB', next);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    toggleB 
                      ? 'bg-purple-950/60 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/10' 
                      : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                >
                  <Radio className="w-5 h-5" />
                  <span>Toggle B: {toggleB ? 'ON' : 'OFF'}</span>
                </button>

                {/* HOT RED BUTTON */}
                <button
                  onClick={() => handleAction('button')}
                  className="p-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-rose-600/30"
                >
                  <Flame className="w-5 h-5 animate-pulse" />
                  <span>{lang === 'ar' ? 'الزر الأحمر الساخن!' : 'PULSE BUTTON!'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR: LIVE CREW & LOGS */}
          <div className="space-y-6">
            {/* CREW CHAT & QUOTES */}
            <div className="p-4 bg-slate-900/60 border border-white/10 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {lang === 'ar' ? 'طاقم الجسر النشط 👥' : 'Bridge Crew Mates 👥'}
              </h4>

              <div className="space-y-3">
                {CREW_MEMBERS.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-black/30 border border-white/5 rounded-xl text-xs">
                    <img src={c.avatar} alt={c.nameEn} className="w-9 h-9 rounded-full object-cover border border-purple-500/30" />
                    <div>
                      <div className="font-bold text-purple-300">{lang === 'ar' ? c.nameAr : c.nameEn}</div>
                      <div className="text-[10px] text-slate-400">{lang === 'ar' ? c.quoteAr : c.quoteEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE LOGS */}
            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl h-48 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-thin">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-white/5 pb-1 mb-2">
                {lang === 'ar' ? 'سجل أحداث الجسر الحقيقي' : 'Bridge Event Stream'}
              </div>
              {logs.map((log, idx) => (
                <div key={idx} className="text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER WIN/FAIL SCREENS */}
      {(gameState === 'win' || gameState === 'fail') && (
        <div className="py-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-1 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              {gameState === 'win' ? (
                <Award className="w-10 h-10 text-yellow-400 animate-bounce" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-rose-500 animate-pulse" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {gameState === 'win'
                ? (lang === 'ar' ? '🎉 انتصار مجري ساحق!' : '🎉 Cosmic Victory Achieved!')
                : (lang === 'ar' ? '💥 تعرضت المركبة للدمار!' : '💥 Ship System Collapsed!')}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              {gameState === 'win'
                ? (lang === 'ar' ? 'أنقذت أنت وطاقمك المجرة من الانهيار! تمت إضافة المكافآت لرصيدك.' : 'You and your crew saved the galaxy! Rewards added to your profile.')
                : (lang === 'ar' ? 'المحركات احتاجت للمزيد من السرعة. حاول مجدداً بنسق أفضل!' : 'The engines needed faster coordination. Try again with a better strategy!')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 font-mono text-xs">
            <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-xl text-center">
              <div className="text-slate-400 text-[10px]">{lang === 'ar' ? 'نقاط الخبرة' : 'XP Gained'}</div>
              <div className="text-purple-300 font-bold text-sm">+{gameState === 'win' ? 150 : 30} XP</div>
            </div>
            <div className="p-3 bg-yellow-950/50 border border-yellow-500/30 rounded-xl text-center">
              <div className="text-slate-400 text-[10px]">{lang === 'ar' ? 'مكافأة لودافيا' : 'Points Earned'}</div>
              <div className="text-yellow-400 font-bold text-sm">+{gameState === 'win' ? 60 : 5} 💎</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => startRescueSession(selectedRole || 'captain')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'ar' ? 'إعادة المهمة الآن' : 'Retry Mission Now'}
            </button>

            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-200 rounded-2xl text-xs font-black"
            >
              {lang === 'ar' ? 'العودة للمركز' : 'Return to Games Hub'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
