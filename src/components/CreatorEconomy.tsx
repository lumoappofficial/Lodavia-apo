import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Award, 
  TrendingUp, 
  Coins, 
  Users, 
  Mic, 
  Video, 
  BookOpen, 
  ArrowUpRight, 
  Download, 
  Send, 
  Brain, 
  Gift, 
  Lock, 
  Unlock, 
  Settings, 
  ChevronRight, 
  Calendar, 
  Percent, 
  Shield, 
  Activity, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Info, 
  DollarSign, 
  X,
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AppUser } from '../types';

interface CreatorEconomyProps {
  currentUser: AppUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser>>;
  lang: 'ar' | 'en';
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  setActiveTab: (tab: any) => void;
}

interface CourseItem {
  id: string;
  title: string;
  category: string;
  price: number; // in Diamonds
  lessonsCount: number;
  studentsCount: number;
}

interface PaidChannel {
  id: string;
  name: string;
  category: string;
  price: number; // in Coins
  subscribersCount: number;
}

interface PayoutRequest {
  id: string;
  amount: number;
  currency: 'USD' | 'Coins' | 'Diamonds';
  method: string;
  status: 'Pending' | 'Approved' | 'Completed';
  date: string;
}

// Simulated Gift config
interface GiftOption {
  id: string;
  nameAr: string;
  nameEn: string;
  cost: number;
  type: 'coins' | 'diamonds';
  icon: string;
  color: string;
  effectName: string;
}

export default function CreatorEconomy({
  currentUser,
  setCurrentUser,
  lang,
  playSynthSound,
  setActiveTab
}: CreatorEconomyProps) {
  // Creator Registration State
  const [isCreator, setIsCreator] = useState<boolean>(() => {
    // Check if user is already a creator in localStorage or default to false
    const saved = localStorage.getItem('lumo_is_creator');
    return saved === 'true';
  });

  // Creator Dashboard Core States
  const [creatorLevel, setCreatorLevel] = useState<'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'>('Silver');
  const [followers, setFollowers] = useState(12850);
  const [likes, setLikes] = useState(64200);
  const [posts, setPosts] = useState(87);
  const [voiceRooms, setVoiceRooms] = useState(18);
  const [liveStreams, setLiveStreams] = useState(6);
  const [coursesCount, setCoursesCount] = useState(2);

  // Financial States
  const [balances, setBalances] = useState({
    availableCash: 1840.50,
    pendingCash: 240.00,
    coins: 4800,
    diamonds: 290
  });

  // Active sub-section in dashboard
  const [creatorTab, setCreatorTab] = useState<'overview' | 'monetize' | 'analytics' | 'assistant' | 'withdraw'>('overview');

  // Interactive Lists
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: 'c1', title: lang === 'ar' ? 'رحلة في العوالم الافتراضية والذكاء الاصطناعي' : 'Voyage into Virtual Worlds & AI', category: 'AI', price: 120, lessonsCount: 8, studentsCount: 42 },
    { id: 'c2', title: lang === 'ar' ? 'أساسيات الحوسبة الكمية للمبتدئين' : 'Quantum Computing Basics', category: 'Tech', price: 95, lessonsCount: 6, studentsCount: 19 }
  ]);

  const [paidChannels, setPaidChannels] = useState<PaidChannel[]>([
    { id: 'ch1', name: lang === 'ar' ? 'مستقبل الذكاء الاصطناعي - الغرفة المغلقة' : 'Future of AI - Elite Circle', category: 'AI', price: 50, subscribersCount: 156 }
  ]);

  const [payouts, setPayouts] = useState<PayoutRequest[]>([
    { id: 'tx-001', amount: 500, currency: 'USD', method: 'PayPal', status: 'Completed', date: '2026-06-15' },
    { id: 'tx-002', amount: 150, currency: 'USD', method: 'Bank Transfer', status: 'Completed', date: '2026-06-30' }
  ]);

  // Virtual Gift Options
  const gifts: GiftOption[] = [
    { id: 'g1', nameAr: 'نجم الشهاب السريع ☄️', nameEn: 'Comet Swift ☄️', cost: 100, type: 'coins', icon: '☄️', color: 'from-blue-500 to-cyan-400', effectName: 'comet' },
    { id: 'g2', nameAr: 'بلورة السديم النجمي 🔮', nameEn: 'Nebula Crystal 🔮', cost: 300, type: 'coins', icon: '🔮', color: 'from-purple-500 to-pink-500', effectName: 'nebula' },
    { id: 'g3', nameAr: 'انفجار السوبرنوفا 💥', nameEn: 'Supernova Burst 💥', cost: 800, type: 'diamonds', icon: '💥', color: 'from-orange-500 to-yellow-400', effectName: 'supernova' },
    { id: 'g4', nameAr: 'بوابة الثقب الدودي 🌌', nameEn: 'Wormhole Portal 🌌', cost: 2500, type: 'diamonds', icon: '🌌', color: 'from-indigo-600 to-purple-800', effectName: 'wormhole' }
  ];

  // Gift Animation State
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{ id: string; name: string; icon: string; count: number } | null>(null);

  // Forms states
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('AI');
  const [newCoursePrice, setNewCoursePrice] = useState('50');
  const [newCourseLessons, setNewCourseLessons] = useState('5');
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelCategory, setNewChannelCategory] = useState('Tech');
  const [newChannelPrice, setNewChannelPrice] = useState('25');
  const [showChannelForm, setShowChannelForm] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('PayPal');
  const [withdrawStatus, setWithdrawStatus] = useState<{ success?: boolean; error?: string; loading?: boolean } | null>(null);

  // AI Creator Assistant State
  const [aiAction, setAiAction] = useState<'ideas' | 'title' | 'times' | 'audience'>('ideas');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('AI');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize values
  const handleOnboarding = () => {
    playSynthSound(523.25, 'triangle', 0.2); // C5
    setTimeout(() => playSynthSound(659.25, 'triangle', 0.2), 150); // E5
    setTimeout(() => playSynthSound(783.99, 'triangle', 0.3), 300); // G5
    setIsCreator(true);
    localStorage.setItem('lumo_is_creator', 'true');
  };

  // Gift simulation
  const simulateGiftReceive = (gift: GiftOption) => {
    playSynthSound(600, 'sine', 0.15);
    setTimeout(() => playSynthSound(800, 'sine', 0.1), 100);
    setTimeout(() => playSynthSound(1000, 'sine', 0.25), 200);

    // Increment Balance according to gift type
    setBalances(prev => {
      if (gift.type === 'coins') {
        return {
          ...prev,
          coins: prev.coins + gift.cost,
          availableCash: prev.availableCash + (gift.cost * 0.01) // 1 coin = $0.01
        };
      } else {
        return {
          ...prev,
          diamonds: prev.diamonds + gift.cost,
          availableCash: prev.availableCash + (gift.cost * 0.1) // 1 diamond = $0.1
        };
      }
    });

    setLikes(prev => prev + Math.floor(Math.random() * 50) + 10);

    // Show animation
    setActiveGiftAnimation({
      id: Math.random().toString(),
      name: lang === 'ar' ? gift.nameAr : gift.nameEn,
      icon: gift.icon,
      count: Math.floor(Math.random() * 3) + 1
    });

    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 4000);
  };

  // Handle Course Creation
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    playSynthSound(587.33, 'triangle', 0.15); // D5
    const newCourse: CourseItem = {
      id: 'c-' + Date.now(),
      title: newCourseTitle,
      category: newCourseCategory,
      price: parseInt(newCoursePrice) || 50,
      lessonsCount: parseInt(newCourseLessons) || 5,
      studentsCount: 0
    };

    setCourses(prev => [newCourse, ...prev]);
    setCoursesCount(prev => prev + 1);
    setNewCourseTitle('');
    setShowCourseForm(false);
  };

  // Handle Channel Creation
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    playSynthSound(587.33, 'triangle', 0.15); // D5
    const newChannel: PaidChannel = {
      id: 'ch-' + Date.now(),
      name: newChannelName,
      category: newChannelCategory,
      price: parseInt(newChannelPrice) || 10,
      subscribersCount: 0
    };

    setPaidChannels(prev => [newChannel, ...prev]);
    setNewChannelName('');
    setShowChannelForm(false);
  };

  // Request withdrawal
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawStatus({ error: lang === 'ar' ? 'الرجاء إدخال مبلغ صحيح وموجب' : 'Please enter a valid positive amount' });
      return;
    }

    if (amountNum > balances.availableCash) {
      setWithdrawStatus({ error: lang === 'ar' ? 'رصيدك المتاح غير كافٍ لإجراء هذه المعاملة' : 'Your available balance is insufficient' });
      return;
    }

    playSynthSound(330, 'sawtooth', 0.1);
    setWithdrawStatus({ loading: true });

    setTimeout(() => {
      playSynthSound(880, 'sine', 0.35); // Success chime
      setBalances(prev => ({
        ...prev,
        availableCash: prev.availableCash - amountNum
      }));

      const newTx: PayoutRequest = {
        id: 'tx-' + Math.floor(1000 + Math.random() * 9000),
        amount: amountNum,
        currency: 'USD',
        method: withdrawMethod,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };

      setPayouts(prev => [newTx, ...prev]);
      setWithdrawAmount('');
      setWithdrawStatus({ success: true });
    }, 2000);
  };

  // Call AI Creator Assistant backend
  const handleCallAIAssistant = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiResponse('');
    playSynthSound(440, 'triangle', 0.15);

    try {
      const response = await fetch('/api/ai/creator-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: aiAction,
          topic: aiTopic,
          category: aiCategory,
          creatorStats: {
            level: creatorLevel,
            followers,
            likes,
            posts,
            voiceRooms,
            liveStreams,
            coursesCount
          },
          lang
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with error');
      }

      const data = await response.json();
      setAiResponse(data.text || (lang === 'ar' ? 'حدث خطأ في جلب النصيحة.' : 'Failed to fetch advisory details.'));
      playSynthSound(880, 'sine', 0.15);
    } catch (error) {
      console.error(error);
      setAiResponse(lang === 'ar' ? 'عذراً، تعذر الاتصال بمستشار الذكاء الاصطناعي حالياً. يرجى المحاولة لاحقاً.' : 'Sorry, the Cosmic AI Advisor is temporarily offline. Please try again later.');
      playSynthSound(220, 'sawtooth', 0.3);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div id="creator-economy-root" className="min-h-screen text-slate-100 pb-20">
      
      {/* Floating simulated Gift alert notification */}
      {activeGiftAnimation && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel border-cyan-400/30 px-6 py-4 rounded-2xl flex items-center gap-4 animate-bounce shadow-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80">
          <span className="text-4xl animate-spin">{activeGiftAnimation.icon}</span>
          <div>
            <div className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">{lang === 'ar' ? 'هدية مستلمة جديدة! ⚡' : 'NEW GIFT RECEIVED! ⚡'}</div>
            <div className="text-sm font-black text-white">{activeGiftAnimation.name}</div>
          </div>
          <div className="text-lg font-black text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-xl border border-yellow-400/20">
            x{activeGiftAnimation.count}
          </div>
        </div>
      )}

      {/* ------------------ ONBOARDING SCREEN ------------------ */}
      {!isCreator ? (
        <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center gap-8 min-h-[80vh] animate-[fadeIn_0.5s_ease-out]">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="relative p-6 bg-gradient-to-br from-purple-900/40 via-indigo-950/40 to-cyan-900/40 rounded-3xl border border-white/10 shadow-2xl">
              <Sparkles className="w-16 h-16 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {lang === 'ar' ? 'فضاء صناع المحتوى الكوني 🚀' : 'Cosmic Creator Space 🚀'}
            </h1>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
              {lang === 'ar' 
                ? 'مرحباً بك في البعد المالي لمنصة لودافيا! هنا يمكنك تحويل معرفتك، غرفك الصوتية، بثوثك، ومجتمعاتك إلى عوائد مالية مجزية عبر الهدايا، الاشتراكات المدفوعة، والدورات المميزة.' 
                : 'Welcome to Lodavia’s financial engine! Host paid spatial rooms, build premium community channels, publish cosmic courses, and receive high-value virtual gifts from your listeners.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-2">
            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <Gift className="w-6 h-6 text-pink-400" />
              <h3 className="text-xs font-bold text-white">{lang === 'ar' ? 'هدايا كتلية' : 'Virtual Gifts'}</h3>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'استلم بلورات ونجوم من داعميك مباشرة' : 'Receive comets & diamonds from followers'}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-xs font-bold text-white">{lang === 'ar' ? 'مجتمعات باشتراك' : 'Paid Channels'}</h3>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'أنشئ غرف مخصصة للنخبة والمشتركين' : 'Build elite private circles for subscribers'}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xs font-bold text-white">{lang === 'ar' ? 'دورات لومو الكونية' : 'Cosmic Courses'}</h3>
              <p className="text-[10px] text-slate-400">{lang === 'ar' ? 'بع مسارات تعلم مدفوعة ومقيمة بالماس' : 'Sell curated learning pathways'}</p>
            </div>
          </div>

          <button 
            onClick={handleOnboarding}
            className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 hover:scale-105 active:scale-95 transition-all text-sm font-black text-white shadow-xl shadow-cyan-500/10 cursor-pointer flex items-center gap-2 border border-cyan-400/30"
          >
            <span>{lang === 'ar' ? 'تفعيل حساب صانع المحتوى 🌌' : 'Activate Creator Account 🌌'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      ) : (
        
        // ------------------ MAIN CREATOR DASHBOARD ------------------
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 animate-[fadeIn_0.5s_ease-out] flex flex-col gap-6">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/20 tracking-widest">{lang === 'ar' ? 'ميزة النخبة' : 'PREMIUM FEATURE'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                {lang === 'ar' ? 'ملاذ صناع المحتوى الكوني 🌌' : 'Lodavia Cosmic Creator Hub 🌌'}
              </h1>
            </div>

            {/* Quick Balance / Stats bar */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">{lang === 'ar' ? 'مستوى الحساب:' : 'Account Rank:'}</span>
              <span className={`px-2.5 py-1 rounded-md font-extrabold ${
                creatorLevel === 'Silver' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {creatorLevel === 'Silver' ? (lang === 'ar' ? 'فضي 🥈' : 'Silver 🥈') : creatorLevel}
              </span>
            </div>
          </div>

          {/* Sub Navigation menu */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
            <button 
              onClick={() => { playSynthSound(450, 'sine', 0.05); setCreatorTab('overview'); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                creatorTab === 'overview' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md shadow-cyan-500/5' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'نظرة عامة والملف' : 'Overview & Profile'}
            </button>
            <button 
              onClick={() => { playSynthSound(480, 'sine', 0.05); setCreatorTab('monetize'); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                creatorTab === 'monetize' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md shadow-cyan-500/5' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'أدوات تحقيق الدخل 🪙' : 'Monetization Studio 🪙'}
            </button>
            <button 
              onClick={() => { playSynthSound(510, 'sine', 0.05); setCreatorTab('analytics'); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                creatorTab === 'analytics' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md shadow-cyan-500/5' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'التحليلات والمؤشرات 📊' : 'Analytics & Charts 📊'}
            </button>
            <button 
              onClick={() => { playSynthSound(540, 'sine', 0.05); setCreatorTab('assistant'); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                creatorTab === 'assistant' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المستشار الذكي 🤖' : 'Cosmic AI Advisor 🤖'}</span>
            </button>
            <button 
              onClick={() => { playSynthSound(570, 'sine', 0.05); setCreatorTab('withdraw'); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                creatorTab === 'withdraw' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-md shadow-cyan-500/5' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'سحب الرصيد 💳' : 'Withdraw Earnings 💳'}
            </button>
          </div>

          {/* ------------------ TAB 1: OVERVIEW & PROFILE ------------------ */}
          {creatorTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card Summary */}
              <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-6 relative overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
                
                {/* Profile header inside creator space */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={currentUser.avatar} alt="Me" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/30" />
                    <span className="absolute bottom-0 right-0 p-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black leading-none border-2 border-[#07070a]" title="Verified Cosmic Creator">
                      ✓
                    </span>
                  </div>
                  <div>
                    <h2 className="text-md font-bold text-white flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <Award className="w-4 h-4 text-yellow-400" />
                    </h2>
                    <p className="text-xs text-slate-400">{lang === 'ar' ? 'صانع محتوى فضاء لودافيا 🌌' : 'Lodavia Space Creator 🌌'}</p>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full text-cyan-400 font-extrabold uppercase">
                        {lang === 'ar' ? 'رتبة الفضة' : 'Silver Rank'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Level Up progress */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{lang === 'ar' ? 'الترقية التالية:' : 'Next Level:'}</span>
                    <strong className="text-yellow-400">{lang === 'ar' ? 'الذهبي ✨' : 'Gold Rank ✨'}</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" style={{ width: '64%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>6,420 / 10,000 EXP</span>
                    <span>64% {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
                  </div>
                </div>

                {/* Account Achievements counters */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'المتابعون' : 'Followers'}</span>
                    <strong className="text-sm font-black text-white">{followers.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'إجمالي الإعجابات' : 'Total Likes'}</span>
                    <strong className="text-sm font-black text-white">{likes.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'المنشورات' : 'Posts Published'}</span>
                    <strong className="text-sm font-black text-white">{posts}</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'غرف صوتية مستضافة' : 'Voice Hosted'}</span>
                    <strong className="text-sm font-black text-white">{voiceRooms}</strong>
                  </div>
                </div>

                {/* Additional stats */}
                <div className="flex flex-col gap-2 pt-2 text-xs border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-rose-400" />
                      <span>{lang === 'ar' ? 'البث المباشر' : 'Live Streams'}</span>
                    </span>
                    <span className="text-white font-bold">{liveStreams}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{lang === 'ar' ? 'الدورات التدريبية' : 'Courses Created'}</span>
                    </span>
                    <span className="text-white font-bold">{coursesCount}</span>
                  </div>
                </div>

              </div>

              {/* Earnings & Coin/Diamond Dashboard */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Financial Status Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Dollar Earnings Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/10 via-[#0c0c14] to-[#07070a] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400">
                      <DollarSign className="w-16 h-16" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <DollarSign className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'ar' ? 'المحفظة النقدية للداعمين' : 'Cash Creator Wallet'}</span>
                    </div>

                    <div className="mt-4 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase">{lang === 'ar' ? 'الرصيد المتاح للسحب' : 'Available Balance'}</span>
                      <span className="text-3xl font-black text-white">${balances.availableCash.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
                      <div>
                        <span className="text-[9px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'معلق / قيد التجهيز' : 'Pending Clearance'}</span>
                        <strong className="text-sm font-bold text-slate-300">${balances.pendingCash.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-bold uppercase">{lang === 'ar' ? 'أرباح هذا الشهر' : 'Monthly Earnings'}</span>
                        <strong className="text-sm font-bold text-emerald-400">${(balances.availableCash * 0.25).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Gems and Coins Card */}
                  <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/10 via-[#0c0c14] to-[#07070a] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400">
                      <Coins className="w-16 h-16" />
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <Coins className="w-4 h-4 text-purple-400" />
                      <span>{lang === 'ar' ? 'رصيد لودافيا من العملات والألماس' : 'Lodavia Coins & Diamonds'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                        <span className="text-[9px] text-amber-400 flex items-center gap-1 font-bold uppercase">
                          <span>🪙</span> {lang === 'ar' ? 'عملة لودافيا' : 'Lodavia Coins'}
                        </span>
                        <span className="text-2xl font-black text-white">{balances.coins}</span>
                        <span className="text-[9px] text-slate-500">≈ ${(balances.coins * 0.01).toFixed(2)}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-400 flex items-center gap-1 font-bold uppercase">
                          <span>💎</span> {lang === 'ar' ? 'الماس كوني' : 'Diamonds'}
                        </span>
                        <span className="text-2xl font-black text-white">{balances.diamonds}</span>
                        <span className="text-[9px] text-slate-500">≈ ${(balances.diamonds * 0.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Level Tiering Perks */}
                <div className="glass-panel p-5 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{lang === 'ar' ? 'نظام مراتب صناع المحتوى لودافيا 🏆' : 'Lodavia Creator Levels System 🏆'}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'bronze', nameAr: 'برونزي 🥉', nameEn: 'Bronze 🥉', exp: '0+', feeAr: '15% رسوم', feeEn: '15% Fees', current: false },
                      { id: 'silver', nameAr: 'فضي 🥈', nameEn: 'Silver 🥈', exp: '5K+', feeAr: '10% رسوم', feeEn: '10% Fees', current: true },
                      { id: 'gold', nameAr: 'ذهبي 🥇', nameEn: 'Gold 🥇', exp: '10K+', feeAr: '8% رسوم', feeEn: '8% Fees', current: false },
                      { id: 'platinum', nameAr: 'بلاتيني 💎', nameEn: 'Platinum 💎', exp: '25K+', feeAr: '5% رسوم', feeEn: '5% Fees', current: false },
                      { id: 'diamond', nameAr: 'الألماس الكوني 🪐', nameEn: 'Cosmic Diamond 🪐', exp: '50K+', feeAr: '2% رسوم', feeEn: '2% Fees', current: false }
                    ].map((tier) => (
                      <div key={tier.id} className={`p-3 rounded-2xl border text-center transition-all flex flex-col gap-1.5 ${
                        tier.current 
                          ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/5' 
                          : 'bg-white/5 border-white/5 text-slate-400'
                      }`}>
                        <div className={`text-xs font-black ${tier.current ? 'text-cyan-400' : 'text-slate-300'}`}>
                          {lang === 'ar' ? tier.nameAr : tier.nameEn}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase">{tier.exp} EXP</div>
                        <div className="text-[10px] font-bold text-emerald-400">{lang === 'ar' ? tier.feeAr : tier.feeEn}</div>
                        {tier.current && (
                          <span className="text-[8px] bg-cyan-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase mt-1 self-center">
                            {lang === 'ar' ? 'رتبتك' : 'Current'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Level up perks list */}
                  <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-200 mb-2">{lang === 'ar' ? 'المزايا النشطة لرتبتك الفضية 🥈:' : 'Active benefits for your Silver Rank 🥈:'}</h4>
                    <ul className="text-[11px] text-slate-400 flex flex-col gap-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{lang === 'ar' ? 'رسوم سحب مخفضة من 15% إلى 10%' : 'Reduced withdrawal fees from 15% to 10%'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{lang === 'ar' ? 'شارة صانع المحتوى الفضية على ملفك الشخصي' : 'Premium Silver Creator Badge visible on your profile'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{lang === 'ar' ? 'القدرة على إنشاء وبيع دورات لودافيا الكونية' : 'Publish and monetize premium Lodavia Cosmic Courses'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ------------------ TAB 2: MONETIZATION STUDIO ------------------ */}
          {creatorTab === 'monetize' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Virtual Gift Simulation */}
              <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/5 rounded-full blur-2xl" />
                
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Gift className="w-4 h-4 text-pink-400 animate-bounce" />
                    <span>{lang === 'ar' ? 'محاكي الهدايا الافتراضية للبث' : 'Live Gifts Simulator'}</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {lang === 'ar' 
                      ? 'قم بمحاكاة استلام الهدايا من متابعيك في غرف الصوت أو البثوث المباشرة واشهد الإيرادات والإنيميشن في الوقت الفعلي!' 
                      : 'Simulate receiving virtual gifts from your followers to test the real-time financial rewards and neon effects!'}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  {gifts.map((gift) => (
                    <button
                      key={gift.id}
                      onClick={() => simulateGiftReceive(gift)}
                      className={`p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 hover:bg-white/10 text-left transition-all flex items-center justify-between cursor-pointer active:scale-95`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{gift.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{lang === 'ar' ? gift.nameAr : gift.nameEn}</div>
                          <div className="text-[9px] text-slate-500">
                            {lang === 'ar' ? 'يزيد الرصيد المالي المتاح فورا' : 'Credits available cash instantly'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-2 py-1 rounded-lg">
                          {gift.cost} {gift.type === 'coins' ? (lang === 'ar' ? 'عملة 🪙' : 'Coins 🪙') : (lang === 'ar' ? 'ماسة 💎' : 'Diamonds 💎')}
                        </span>
                        <div className="text-[8px] text-emerald-400 mt-1 font-bold">+{gift.type === 'coins' ? `$${(gift.cost * 0.01).toFixed(2)}` : `$${(gift.cost * 0.1).toFixed(2)}`}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center mt-2 p-3 bg-pink-500/5 rounded-2xl border border-pink-500/10 text-[10px] text-pink-400">
                  {lang === 'ar' ? '💡 اضغط على أي هدية لتجربة استلامها وسماع المؤثر الصوتي!' : '💡 Click any gift to simulate receiving it and hear the retro synth tone!'}
                </div>
              </div>

              {/* Paid Channels & Courses Managers */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Paid Communities Channel */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>{lang === 'ar' ? 'المجتمعات والقنوات المدفوعة 🔒' : 'Premium Subscriber Channels 🔒'}</span>
                    </h3>
                    <button 
                      onClick={() => { playSynthSound(600, 'sine', 0.05); setShowChannelForm(!showChannelForm); }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'أنشئ قناة مدفوعة' : 'New Paid Channel'}</span>
                    </button>
                  </div>

                  {showChannelForm && (
                    <form onSubmit={handleCreateChannel} className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'اسم القناة' : 'Channel Name'}</label>
                          <input 
                            type="text" 
                            required
                            placeholder={lang === 'ar' ? 'مثال: محترفي الذكاء الاصطناعي الكوني' : 'e.g. Quantum Engineers Lounge'}
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'التصنيف كوني' : 'Celestial Category'}</label>
                          <select 
                            value={newChannelCategory}
                            onChange={(e) => setNewChannelCategory(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          >
                            <option value="AI">{lang === 'ar' ? 'الذكاء الاصطناعي 🤖' : 'AI & Neural 🤖'}</option>
                            <option value="Tech">{lang === 'ar' ? 'التكنولوجيا والويب 💻' : 'Tech & Web 💻'}</option>
                            <option value="Cosmic">{lang === 'ar' ? 'الفضاء والعلوم 🪐' : 'Space & Science 🪐'}</option>
                            <option value="Design">{lang === 'ar' ? 'التصميم والفن 🎨' : 'Art & Vision 🎨'}</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الاشتراك الشهري (عملات)' : 'Monthly Coins Fee'}</label>
                          <input 
                            type="number" 
                            min="5" 
                            required
                            placeholder="30"
                            value={newChannelPrice}
                            onChange={(e) => setNewChannelPrice(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowChannelForm(false)}
                          className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-[10px] font-bold"
                        >
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px]"
                        >
                          {lang === 'ar' ? 'حفظ وإطلاق القناة 🚀' : 'Launch Channel 🚀'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paidChannels.map((ch) => (
                      <div key={ch.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 rounded-full text-purple-400 font-extrabold uppercase">{ch.category}</span>
                            <h4 className="text-xs font-bold text-white mt-1.5">{ch.name}</h4>
                          </div>
                          <span className="text-xs font-black text-amber-400 flex items-center gap-1 bg-amber-400/5 border border-amber-400/10 px-2 py-1 rounded-xl">
                            <span>🪙</span> {ch.price} / {lang === 'ar' ? 'شهر' : 'mo'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1 font-bold">
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            <strong>{ch.subscribersCount}</strong> {lang === 'ar' ? 'مشترك نشط' : 'Active Subscribers'}
                          </span>
                          <span className="text-emerald-400 font-black">
                            {lang === 'ar' ? 'إجمالي الدخل:' : 'Monthly Income:'} ${(ch.subscribersCount * ch.price * 0.01).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paid Courses Manager */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                      <span>{lang === 'ar' ? 'الدورات الكونية المدفوعة 🎓' : 'Lodavia Celestial Courses 🎓'}</span>
                    </h3>
                    <button 
                      onClick={() => { playSynthSound(600, 'sine', 0.05); setShowCourseForm(!showCourseForm); }}
                      className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'أنشئ دورة جديدة' : 'New Premium Course'}</span>
                    </button>
                  </div>

                  {showCourseForm && (
                    <form onSubmit={handleCreateCourse} className="p-4 rounded-2xl bg-black/40 border border-yellow-500/20 flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out]">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'عنوان الدورة الكونية' : 'Course Title'}</label>
                          <input 
                            type="text" 
                            required
                            placeholder={lang === 'ar' ? 'مثال: مسار الذكاء الاصطناعي الكمي الفائق' : 'e.g. Masterclass in Quantum AI Prompting'}
                            value={newCourseTitle}
                            onChange={(e) => setNewCourseTitle(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'سعر الدورة (ألماس)' : 'Price in Diamonds'}</label>
                          <input 
                            type="number" 
                            min="10" 
                            required
                            placeholder="80"
                            value={newCoursePrice}
                            onChange={(e) => setNewCoursePrice(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'عدد الدروس' : 'Lessons Count'}</label>
                          <input 
                            type="number" 
                            min="1" 
                            required
                            placeholder="8"
                            value={newCourseLessons}
                            onChange={(e) => setNewCourseLessons(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowCourseForm(false)}
                          className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-[10px] font-bold"
                        >
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-[10px]"
                        >
                          {lang === 'ar' ? 'إطلاق الدورة ونشرها 🚀' : 'Launch Course 🚀'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full text-yellow-500 font-extrabold uppercase">{c.category}</span>
                            <h4 className="text-xs font-bold text-white mt-1.5 leading-snug">{c.title}</h4>
                          </div>
                          <span className="text-xs font-black text-cyan-400 flex items-center gap-1 bg-cyan-400/5 border border-cyan-400/10 px-2.5 py-1 rounded-xl shrink-0">
                            <span>💎</span> {c.price}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
                          <span className="flex items-center gap-3">
                            <span className="font-bold">📚 {c.lessonsCount} {lang === 'ar' ? 'دروس' : 'Lessons'}</span>
                            <span className="font-bold">👥 {c.studentsCount} {lang === 'ar' ? 'طالب' : 'Students'}</span>
                          </span>
                          <span className="text-emerald-400 font-black">
                            {lang === 'ar' ? 'العائد:' : 'Earned:'} ${(c.studentsCount * c.price * 0.1).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ------------------ TAB 3: HIGH-TECH ANALYTICS & CHARTS ------------------ */}
          {creatorTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              
              {/* Quick stats panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { titleAr: 'مشاهدات الملف الكلية', titleEn: 'Total Profile Views', value: '48.2K', change: '+12.4%', up: true, icon: Activity, color: 'text-cyan-400 bg-cyan-500/10' },
                  { titleAr: 'معدل التفاعل النشط', titleEn: 'Engagement Rate', value: '14.8%', change: '+3.2%', up: true, icon: TrendingUp, color: 'text-purple-400 bg-purple-500/10' },
                  { titleAr: 'متابعون جدد (شهري)', titleEn: 'New Monthly Followers', value: '1,420', change: '+24.5%', up: true, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
                  { titleAr: 'نقاط الهدايا الكونية', titleEn: 'Gift Score Metric', value: '24,500', change: '+8.1%', up: true, icon: Gift, color: 'text-pink-400 bg-pink-500/10' }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{lang === 'ar' ? stat.titleAr : stat.titleEn}</span>
                      <strong className="text-xl font-black text-white block mt-1.5">{stat.value}</strong>
                      <span className="text-[9px] font-extrabold text-emerald-400 mt-1 block">{stat.change} {lang === 'ar' ? 'هذا الأسبوع ↗' : 'this week ↗'}</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Advanced Interactive SVG-based charts to avoid Recharts bugs on React 19 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Custom SVG Line Chart for Views trend */}
                <div className="glass-panel p-6 rounded-3xl border border-cyan-500/10 bg-gradient-to-b from-[#0c0c14] to-[#07070a] flex flex-col gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{lang === 'ar' ? 'مسار المشاهدات والتفاعل الشهري 📈' : 'Monthly Views & Engagement Orbit 📈'}</h3>
                    <p className="text-[9px] text-slate-500 mt-1">{lang === 'ar' ? 'التحليل التفاعلي لنبضات المحتوى الكوني لومو' : 'Real-time timeline tracking celestial audience views'}</p>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative h-48 w-full mt-2 bg-black/30 rounded-2xl p-2 border border-white/5">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="viewsGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      <line x1="10" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                      <line x1="10" y1="60" x2="490" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                      <line x1="10" y1="100" x2="490" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                      
                      {/* Chart area glow */}
                      <path d="M 10 130 Q 90 90, 170 100 T 330 40 T 490 10 L 490 130 L 10 130 Z" fill="url(#viewsGlow)" />
                      
                      {/* Chart curve */}
                      <path d="M 10 130 Q 90 90, 170 100 T 330 40 T 490 10" fill="none" stroke="#06b6d4" strokeWidth="3" className="drop-shadow-[0_0_8px_#06b6d4]" />
                      
                      {/* Dots and highlights */}
                      <circle cx="170" cy="100" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="330" cy="40" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="490" cy="10" r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                      
                      {/* Labels */}
                      <text x="10" y="145" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">Week 1</text>
                      <text x="160" y="145" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">Week 2</text>
                      <text x="320" y="145" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">Week 3</text>
                      <text x="460" y="145" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold">Week 4</text>
                    </svg>
                  </div>
                </div>

                {/* Custom SVG Bar Chart for Audience Demographics */}
                <div className="glass-panel p-6 rounded-3xl border border-purple-500/10 bg-gradient-to-b from-[#0c0c14] to-[#07070a] flex flex-col gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{lang === 'ar' ? 'التحليل الجغرافي والعمري للجمهور 📊' : 'Audience Demographics & Age 📊'}</h3>
                    <p className="text-[9px] text-slate-500 mt-1">{lang === 'ar' ? 'توزع داعميك حسب اهتمامات لومو الكونية' : 'Stellar distribution of cosmic supporters'}</p>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="relative h-48 w-full mt-2 bg-black/30 rounded-2xl p-4 border border-white/5 flex items-end justify-between gap-2">
                    {[
                      { labelAr: 'الرياض 🇸🇦', labelEn: 'Riyadh 🇸🇦', value: 45, color: 'bg-cyan-500 shadow-cyan-500/25' },
                      { labelAr: 'جدة 🇸🇦', labelEn: 'Jeddah 🇸🇦', value: 30, color: 'bg-purple-500 shadow-purple-500/25' },
                      { labelAr: 'دبي 🇦🇪', labelEn: 'Dubai 🇦🇪', value: 15, color: 'bg-blue-500 shadow-blue-500/25' },
                      { labelAr: 'القاهرة 🇪🇬', labelEn: 'Cairo 🇪🇬', value: 10, color: 'bg-pink-500 shadow-pink-500/25' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-white">{bar.value}%</span>
                        <div className="w-full bg-white/5 rounded-t-lg overflow-hidden relative" style={{ height: `${bar.value * 2.2}px` }}>
                          <div className={`absolute bottom-0 left-0 w-full rounded-t-lg ${bar.color}`} style={{ height: '100%' }} />
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap text-center mt-1">{lang === 'ar' ? bar.labelAr : bar.labelEn}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Top gravity posts lists */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{lang === 'ar' ? 'المنشورات الأعلى جاذبية (جاذبية النجم الكونية) ⭐' : 'High-Gravity Cosmic Posts ⭐'}</h3>
                
                <div className="flex flex-col gap-3">
                  {[
                    { title: lang === 'ar' ? 'إطلاق خادم لودافيا الكمي للاتصال الصوتي فائق الأمان' : 'Lodavia Quantum Voice Nodes launched successfully', engagement: '1,420 Likes • 430 comments', reach: '12,500 Reach', multiplier: '9.8x Engagement' },
                    { title: lang === 'ar' ? 'درسي الجديد: البرمجة الذكية للمصفوفات العصبية الاصطناعية' : 'New course lesson: Programming Artificial Neural Matrices', engagement: '890 Likes • 182 comments', reach: '8,400 Reach', multiplier: '7.2x Engagement' }
                  ].map((post, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-relaxed">{post.title}</h4>
                        <div className="text-[10px] text-slate-400 mt-1">{post.engagement} • <span className="text-cyan-400 font-bold">{post.reach}</span></div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full shrink-0">
                        {post.multiplier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ------------------ TAB 4: COSMIC AI CREATOR ASSISTANT ------------------ */}
          {creatorTab === 'assistant' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Request Configuration Panel */}
              <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
                
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>{lang === 'ar' ? 'مساعد لومو الإبداعي الذكي' : 'Cosmic AI Advisor'}</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {lang === 'ar' 
                      ? 'اختر الاستراتيجية التي تريد تحسينها وسيقوم مستشارك الذكي المدعوم بـ Gemini بتحليل بياناتك وتوليد الحل الإبداعي فورا.' 
                      : 'Select an advisory dimension, specify your topic, and let our Gemini-powered engine generate top-tier strategies instantly.'}
                  </p>
                </div>

                {/* Advisory dimensions buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">{lang === 'ar' ? 'بعد الاستشارة الذكية' : 'Select Strategy Dimension'}</span>
                  {[
                    { id: 'ideas', labelAr: '💡 أفكار منشورات ومواضيع', labelEn: '💡 Content & Post Ideas' },
                    { id: 'title', labelAr: '📝 تحسين صياغة العناوين', labelEn: '📝 Scroll-Stopping Titles' },
                    { id: 'times', labelAr: '⏰ أفضل أوقات النشر الفلكية', labelEn: '⏰ Stellar Posting Times' },
                    { id: 'audience', labelAr: '📊 تحسين الوصول والتفاعل', labelEn: '📊 Audience Growth Hacks' }
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => { playSynthSound(480, 'sine', 0.05); setAiAction(act.id as any); }}
                      className={`p-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer flex justify-between items-center ${
                        aiAction === act.id 
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{lang === 'ar' ? act.labelAr : act.labelEn}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="flex flex-col gap-3 mt-2">
                  
                  {/* Topic Input */}
                  {(aiAction === 'ideas' || aiAction === 'title') && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'موضوع المنشور أو المجال الأساسي' : 'Core Topic or Field'}</label>
                      <input 
                        type="text" 
                        placeholder={lang === 'ar' ? 'مثال: الذكاء الاصطناعي التوليدي ومستقبل العملات المشفرة' : 'e.g. Artificial Intelligence & Web3 Cryptos'}
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'تصنيف جمهورك' : 'Content Category'}</label>
                    <select 
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="AI">{lang === 'ar' ? 'الذكاء الاصطناعي 🤖' : 'AI & Deep Learning 🤖'}</option>
                      <option value="Tech">{lang === 'ar' ? 'برمجة وتكنولوجيا 💻' : 'Coding & Tech 💻'}</option>
                      <option value="Cosmic">{lang === 'ar' ? 'علوم وفلك 🪐' : 'Astronomy & Physics 🪐'}</option>
                      <option value="Gaming">{lang === 'ar' ? 'ألعاب وترفيه 🎮' : 'Gaming & E-Sports 🎮'}</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleCallAIAssistant}
                    disabled={aiLoading || ((aiAction === 'ideas' || aiAction === 'title') && !aiTopic.trim())}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs shadow-lg shadow-purple-500/15 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Brain className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ar' ? 'استشارة المستشار الكوني الذكي 🪐' : 'Query Cosmic AI Strategist 🪐'}</span>
                  </button>

                </div>
              </div>

              {/* Advisory Response Panel */}
              <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/5 p-6 flex flex-col gap-4 relative min-h-[400px] bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">{lang === 'ar' ? 'مخطط الاستشارة الكونية المبرهنة 🌌' : 'Generated Celestial Strategy Draft 🌌'}</h3>
                  </div>
                  {aiResponse && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        playSynthSound(900, 'sine', 0.1);
                        alert(lang === 'ar' ? 'تم نسخ التقرير الاستشاري للمحفظة!' : 'Cosmic strategy draft copied!');
                      }}
                      className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl font-bold transition-all text-slate-300"
                    >
                      {lang === 'ar' ? 'نسخ الاستشارة 📋' : 'Copy Strategy 📋'}
                    </button>
                  )}
                </div>

                {/* AI Output details */}
                <div className="flex-1 flex flex-col justify-center">
                  
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
                        <Brain className="w-5 h-5 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-slate-300 animate-pulse">{lang === 'ar' ? 'يقوم Gemini حالياً بتحليل المؤشرات ومطابقة الخرائط الفلكية للجمهور...' : 'Gemini is running alignment algorithms and matching stellar indices...'}</p>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'ar' ? 'يرجى الانتظار ثانية واحدة...' : 'Please wait a cosmic second...'}</span>
                      </div>
                    </div>
                  ) : aiResponse ? (
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line overflow-y-auto max-h-[450px] p-2">
                      {aiResponse}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-center py-16 opacity-40">
                      <Brain className="w-12 h-12 text-slate-500 animate-bounce" />
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'بانتظار الاستشارة' : 'Awaiting Request'}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-xs">{lang === 'ar' ? 'حدد الجانب الاستشاري الذي تريده واضغط استشارة لتوليد خطة التفاعل الكوني' : 'Select an advisory dimension and execute query to generate celestial recommendations.'}</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* ------------------ TAB 5: INSTANT WITHDRAW SECTION ------------------ */}
          {creatorTab === 'withdraw' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Withdrawal Request Form */}
              <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
                
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Download className="w-5 h-5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'طلب سحب الأرباح الفوري' : 'Instant Cash Withdrawal'}</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {lang === 'ar' 
                      ? 'قم بسحب أرباحك مباشرة إلى حسابك البنكي أو PayPal. ستتم مراجعة الطلبات ومعالجتها فوراً.' 
                      : 'Request instant payout of your earned disponible cash. Approved funds settle securely via selected payment routes.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-1 text-center">
                  <span className="text-[9px] text-cyan-400 uppercase font-extrabold">{lang === 'ar' ? 'الرصيد الكلي المتاح حالياً' : 'Current Available Cash'}</span>
                  <strong className="text-2xl font-black text-white">${balances.availableCash.toFixed(2)}</strong>
                </div>

                <form onSubmit={handleWithdraw} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'طريقة الدفع وقناة التحويل' : 'Payout Pathway'}</label>
                    <select 
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">{lang === 'ar' ? 'حوالة بنكية مباشرة' : 'Direct Bank Wire'}</option>
                      <option value="Quantum Crypto">{lang === 'ar' ? 'عملات رقمية كمية (USDT)' : 'Quantum Crypto Wallet (USDT)'}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'المبلغ المراد سحبه ($)' : 'Withdrawal Amount ($)'}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                      <input 
                        type="number" 
                        required
                        min="10"
                        step="0.01"
                        placeholder="500.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 w-full"
                      />
                    </div>
                  </div>

                  {withdrawStatus?.error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-bold leading-relaxed">
                      ❌ {withdrawStatus.error}
                    </div>
                  )}

                  {withdrawStatus?.success && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold leading-relaxed animate-pulse">
                      ✓ {lang === 'ar' ? 'تم تقديم طلب السحب بنجاح! الرصيد قيد المراجعة الفورية.' : 'Withdrawal requested successfully! Processing clearance.'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={withdrawStatus?.loading || !withdrawAmount}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/15 cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    {withdrawStatus?.loading ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin" />
                        <span>{lang === 'ar' ? 'جاري التحقق والتوقيع الكمي...' : 'Verifying quantum keys...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 shrink-0" />
                        <span>{lang === 'ar' ? 'تنفيذ عملية سحب آمنة 🔒' : 'Secure Withdraw 🔒'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Payout History Ledger */}
              <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/5 p-6 flex flex-col gap-4 relative bg-gradient-to-b from-[#0c0c14] to-[#07070a]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">{lang === 'ar' ? 'سجل المعاملات والتسويات المالية كليات لومو' : 'Financial Ledger & Settled Payouts'}</h3>
                
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 font-bold">
                        <th className="pb-3 text-[10px] uppercase">{lang === 'ar' ? 'معرف المعاملة' : 'Transaction ID'}</th>
                        <th className="pb-3 text-[10px] uppercase">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                        <th className="pb-3 text-[10px] uppercase">{lang === 'ar' ? 'طريقة السحب' : 'Method'}</th>
                        <th className="pb-3 text-[10px] uppercase">{lang === 'ar' ? 'القيمة المالية' : 'Amount'}</th>
                        <th className="pb-3 text-[10px] uppercase">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="py-3.5 font-mono text-cyan-400">{tx.id}</td>
                          <td className="py-3.5 text-slate-400">{tx.date}</td>
                          <td className="py-3.5 text-slate-300 font-medium">{tx.method}</td>
                          <td className="py-3.5 font-black text-white">${tx.amount.toFixed(2)}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${
                              tx.status === 'Completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                            }`}>
                              {lang === 'ar' 
                                ? (tx.status === 'Completed' ? 'مكتملة ✓' : 'قيد المراجعة ⏳') 
                                : tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex gap-3 items-center mt-4">
                  <Info className="w-5 h-5 text-cyan-400 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {lang === 'ar' 
                      ? '💡 يتم خصم الرسوم استناداً لرتبتك الحالية (رتبتك الفضية 🥈 تمنحك رسوم مخفضة 10% فقط). المعالجة والتحقق تتم عبر بروتوكول TLS-Quantum المشفر بالكامل.' 
                      : '💡 Fees are automatically adjusted based on your Silver Rank (10%). Settled transactions are securely validated through fully compliant SSL ledger pathways.'}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
