import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Brain, 
  Sparkles, 
  Clock, 
  Settings, 
  Volume2, 
  Play, 
  Pause, 
  TrendingUp, 
  Newspaper, 
  Bell, 
  Check, 
  Loader2, 
  HelpCircle, 
  Lightbulb, 
  Podcast, 
  VolumeX, 
  ExternalLink, 
  Send,
  X,
  Plus,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { sanitizeExternalUrl } from '../utils/urlSecurity';

interface BriefItem {
  id: string;
  interest: string;
  title: string;
  whatHappened: string;
  whyImportant: string;
  whyShouldICare: string;
  sourceName: string;
  publicationTime: string;
  link: string;
}

interface GenerateBriefResponse {
  greeting: string;
  briefs: BriefItem[];
}

const INTEREST_OPTIONS = [
  { id: 'football', labelEn: 'Football ⚽', labelAr: 'كرة القدم ⚽', category: 'Football' },
  { id: 'technology', labelEn: 'Technology 💻', labelAr: 'التكنولوجيا 💻', category: 'Technology' },
  { id: 'ai', labelEn: 'Artificial Intelligence 🤖', labelAr: 'الذكاء الاصطناعي 🤖', category: 'Artificial Intelligence' },
  { id: 'gaming', labelEn: 'Gaming 🎮', labelAr: 'الألعاب الإلكترونية 🎮', category: 'Gaming' },
  { id: 'movies', labelEn: 'Movies 🎬', labelAr: 'الأفلام 🎬', category: 'Movies' },
  { id: 'tv_shows', labelEn: 'TV Shows 📺', labelAr: 'المسلسلات والتلفزيون 📺', category: 'TV Shows' },
  { id: 'music', labelEn: 'Music 🎵', labelAr: 'الموسيقى 🎵', category: 'Music' },
  { id: 'business', labelEn: 'Business 💼', labelAr: 'الأعمال والاستثمار 💼', category: 'Business' },
  { id: 'finance', labelEn: 'Finance 📈', labelAr: 'المالية والاقتصاد 📈', category: 'Finance' },
  { id: 'cooking', labelEn: 'Cooking 🍳', labelAr: 'الطهي والمأكولات 🍳', category: 'Cooking' },
  { id: 'travel', labelEn: 'Travel ✈️', labelAr: 'السفر والسياحة ✈️', category: 'Travel' },
  { id: 'health', labelEn: 'Health 🏥', labelAr: 'الصحة واللياقة 🏥', category: 'Health' },
  { id: 'science', labelEn: 'Science 🔬', labelAr: 'العلوم الطبيعية 🔬', category: 'Science' },
  { id: 'education', labelEn: 'Education 🎓', labelAr: 'التعليم والتدريب 🎓', category: 'Education' },
  { id: 'creators', labelEn: 'Content Creators 🎙️', labelAr: 'صناع المحتوى 🎙️', category: 'Content Creators' },
  { id: 'fashion', labelEn: 'Fashion 👗', labelAr: 'الموضة والأزياء 👗', category: 'Fashion' },
];

const TRUSTED_SOURCES = [
  'Reuters', 'BBC News', 'Associated Press (AP)', 'NASA SpaceFlight', 'OpenAI Blog', 
  'FIFA Official', 'Google Blog', 'TechCrunch', 'Bloomberg', 'MIT Technology Review'
];

export default function AIDailyBrief() {
  const { lang, currentUser, playSynthSound } = useApp();

  // 1. Core States
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumo_daily_interests');
    return saved ? JSON.parse(saved) : ['Artificial Intelligence', 'Technology', 'Science', 'Gaming'];
  });

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lumo_daily_notifications') === 'true';
  });

  const [behaviorWeights, setBehaviorWeights] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('lumo_daily_weights');
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>('');
  const [briefs, setBriefs] = useState<BriefItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Custom UI & Modals states
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  
  // Interactive Explanation States (Lumi Friends Mode)
  const [explainingBriefId, setExplainingBriefId] = useState<string | null>(null);
  const [lumiExplanation, setLumiExplanation] = useState<{ [briefId: string]: string }>({});
  const [explainingLoading, setExplainingLoading] = useState<boolean>(false);

  // "Ask Lumi" Chat States per brief card
  const [activeChatBriefId, setActiveChatBriefId] = useState<string | null>(null);
  const [chatInputs, setChatInputs] = useState<{ [briefId: string]: string }>({});
  const [chatHistories, setChatHistories] = useState<{ [briefId: string]: { role: 'user' | 'model'; text: string }[] }>({});
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Voice Briefing Mode (Simulated Audio Podcast Player)
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState<number>(0);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smart Live Notifications simulator state
  const [liveNotification, setLiveNotification] = useState<{ title: string; body: string } | null>(null);

  // 2. Fetch Daily Briefings from Gemini
  const fetchBriefings = async (forcedInterests?: string[]) => {
    const interestsToUse = forcedInterests || selectedInterests;
    if (interestsToUse.length === 0) {
      setError(lang === 'ar' ? 'يرجى اختيار اهتمام واحد على الأقل.' : 'Please select at least one interest.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/daily-brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: interestsToUse,
          lang,
          behaviorWeights
        })
      });

      if (!response.ok) {
        throw new Error(lang === 'ar' ? 'فشل الاتصال بخوادم لودافيا الكونية.' : 'Failed to reach Lodavia cosmic networks.');
      }

      const data: GenerateBriefResponse = await response.json();
      setGreeting(data.greeting || (lang === 'ar' ? "أهلاً بك! إليك ملخصك الذكي لهذا اليوم." : "Welcome back! Here is your smart personalized briefing for today."));
      setBriefs(data.briefs || []);
      
      // Initialize states
      setLumiExplanation({});
      setChatHistories({});
      setChatInputs({});
      setIsPlayingVoice(false);
      setVoiceProgress(0);
      setCurrentVoiceIndex(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating briefs.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading briefing on mount
  useEffect(() => {
    fetchBriefings();
  }, [lang]);

  // Save selected interests helper
  const handleToggleInterest = (category: string) => {
    playSynthSound(500, 'sine', 0.05);
    let updated;
    if (selectedInterests.includes(category)) {
      updated = selectedInterests.filter(i => i !== category);
    } else {
      updated = [...selectedInterests, category];
    }
    setSelectedInterests(updated);
    localStorage.setItem('lumo_daily_interests', JSON.stringify(updated));
  };

  // Smart Learning behavior logger
  const logUserInteraction = (category: string, actionType: 'explain' | 'ask' | 'source') => {
    const currentWeights = { ...behaviorWeights };
    const points = actionType === 'explain' ? 3 : actionType === 'ask' ? 5 : 2;
    currentWeights[category] = (currentWeights[category] || 0) + points;
    setBehaviorWeights(currentWeights);
    localStorage.setItem('lumo_daily_weights', JSON.stringify(currentWeights));
  };

  // 3. Explain news with Lumi (Friend voice)
  const handleExplainWithLumi = async (brief: BriefItem) => {
    if (explainingLoading) return;
    playSynthSound(600, 'sine', 0.08);
    logUserInteraction(brief.interest, 'explain');

    // If already explained, toggle it
    if (lumiExplanation[brief.id]) {
      setExplainingBriefId(explainingBriefId === brief.id ? null : brief.id);
      return;
    }

    setExplainingBriefId(brief.id);
    setExplainingLoading(true);

    try {
      const res = await fetch('/api/ai/daily-brief/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsTitle: brief.title,
          whatHappened: brief.whatHappened,
          whyImportant: brief.whyImportant,
          lang
        })
      });

      if (!res.ok) throw new Error('Failed explanation fetch');
      const data = await res.json();
      setLumiExplanation(prev => ({ ...prev, [brief.id]: data.text }));
    } catch (err) {
      setLumiExplanation(prev => ({
        ...prev, 
        [brief.id]: lang === 'ar' 
          ? 'عذراً يا صديقي، حدث ارتباك مؤقت في معالجة لودافيا الكونية. حاول مجدداً!' 
          : 'Sorry friend, a temporary glitch in Lodavia neural processing. Try again!'
      }));
    } finally {
      setExplainingLoading(false);
    }
  };

  // 4. "Ask Lumi" Custom Question Handling
  const handleAskLumiQuestion = async (brief: BriefItem, customQuestion?: string) => {
    const questionText = customQuestion || chatInputs[brief.id] || '';
    if (!questionText.trim() || chatLoading) return;

    playSynthSound(650, 'sine', 0.08);
    logUserInteraction(brief.interest, 'ask');

    // Add user message to history
    const userMessage = { role: 'user' as const, text: questionText };
    const currentHistory = chatHistories[brief.id] || [];
    const updatedHistory = [...currentHistory, userMessage];
    
    setChatHistories(prev => ({ ...prev, [brief.id]: updatedHistory }));
    setChatInputs(prev => ({ ...prev, [brief.id]: '' }));
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/daily-brief/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsTitle: brief.title,
          context: brief,
          question: questionText,
          lang
        })
      });

      if (!res.ok) throw new Error('Failed to ask');
      const data = await res.json();
      
      setChatHistories(prev => ({
        ...prev,
        [brief.id]: [...updatedHistory, { role: 'model', text: data.text }]
      }));
    } catch (err) {
      setChatHistories(prev => ({
        ...prev,
        [brief.id]: [...updatedHistory, { 
          role: 'model', 
          text: lang === 'ar' 
            ? 'توقف التردد اللاسلكي مؤقتاً، يرجى إعادة المحاولة من فضلك!' 
            : 'Frequencies interrupted, please re-transmit!' 
        }]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  // Smart Interest Notification Simulator
  useEffect(() => {
    if (!notificationEnabled) {
      setLiveNotification(null);
      return;
    }

    const interval = setInterval(() => {
      // Pick a random selected interest to generate breaking alert
      if (selectedInterests.length === 0) return;
      const randomInterest = selectedInterests[Math.floor(Math.random() * selectedInterests.length)];
      
      const alerts: { [key: string]: { title: string; body: string; titleAr: string; bodyAr: string } } = {
        'football': {
          title: "🚨 BREAKING FOOTBALL NEWS",
          body: "The final whistle blew! A stunning comeback in extra time secures the continental championship.",
          titleAr: "🚨 عاجل: كرة القدم الكونية",
          bodyAr: "صافرة النهاية! عودة تاريخية مذهلة في الوقت الإضافي تحسم البطولة القارية الكبرى."
        },
        'technology': {
          title: "💻 BREAKING TECH UPDATE",
          body: "A major tech pioneer announces custom silicon processors boasting 40% higher efficiency.",
          titleAr: "💻 عاجل: اختراق تكنولوجي",
          bodyAr: "إعلان رسمي عن معالجات سيليكون مبتكرة تمنح كفاءة تشغيل خارقة تزيد بنسبة 40%."
        },
        'artificial intelligence': {
          title: "🤖 AI NEURAL BREAKTHROUGH",
          body: "OpenAI launches a highly capable multi-modal model supporting reasoning chains instantly.",
          titleAr: "🤖 عاجل: طفرة الذكاء الاصطناعي",
          bodyAr: "إطلاق نموذج مذهل فائق الذكاء يدعم استدلال المنطق وسلاسل الأفكار في كسر من الثانية."
        },
        'gaming': {
          title: "🎮 BREAKING GAMING EVENT",
          body: "The world's biggest esports tournament sets a record-breaking concurrent viewership peak.",
          titleAr: "🎮 عاجل: الألعاب الإلكترونية",
          bodyAr: "البطولة الكونية للألعاب تحطم الأرقام القياسية وتسجل أعلى مشاهدة متزامنة في التاريخ."
        },
        'science': {
          title: "🔬 BREAKING SCIENCE REPORT",
          body: "NASA spacecraft successfully captures hyper-detailed spectrograph data of habitable exoplanets.",
          titleAr: "🔬 عاجل: العلوم الكونية",
          bodyAr: "مسبار الفضاء ينجح في التقاط أطياف تفصيلية مذهلة للغلاف الجوي لكواكب قابلة للحياة."
        },
        'finance': {
          title: "📈 FINANCE & MARKET SHIFT",
          body: "Major digital currencies rally to record-high levels following strategic sovereign reserve statements.",
          titleAr: "📈 عاجل: الأسواق والمالية",
          bodyAr: "العملات الرقمية الكبرى تسجل مستويات تاريخية جديدة إثر إعلانات احتياطي سيادي مشجعة."
        },
        'health': {
          title: "🏥 HEALTH & LONGEVITY",
          body: "Clinical trials confirm a new mRNA vaccine candidate successfully targets compound cellular aging.",
          titleAr: "🏥 عاجل: طفرة صحية",
          bodyAr: "تجارب سريرية تؤكد فاعلية لقاح mRNA ثوري يستهدف مقاومة الشيخوخة الخلوية للمرة الأولى."
        }
      };

      const matchedAlert = alerts[randomInterest.toLowerCase()];
      if (matchedAlert) {
        setLiveNotification({
          title: lang === 'ar' ? matchedAlert.titleAr : matchedAlert.title,
          body: lang === 'ar' ? matchedAlert.bodyAr : matchedAlert.body
        });
        playSynthSound(900, 'triangle', 0.15);

        // Hide after 7 seconds
        setTimeout(() => {
          setLiveNotification(null);
        }, 7000);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [notificationEnabled, selectedInterests, lang]);

  // Voice player simulated looping
  useEffect(() => {
    if (isPlayingVoice && briefs.length > 0) {
      voiceTimerRef.current = setInterval(() => {
        setVoiceProgress(prev => {
          if (prev >= 100) {
            // Next brief audio
            if (currentVoiceIndex < briefs.length - 1) {
              setCurrentVoiceIndex(prevIdx => prevIdx + 1);
              playSynthSound(450, 'sawtooth', 0.1);
              return 0;
            } else {
              // Loop finished
              setIsPlayingVoice(false);
              playSynthSound(800, 'sine', 0.2);
              return 0;
            }
          }
          return prev + 2.5; // increments
        });
      }, 500);
    } else {
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }

    return () => {
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    };
  }, [isPlayingVoice, currentVoiceIndex, briefs]);

  const handleToggleVoicePlay = () => {
    if (briefs.length === 0) return;
    playSynthSound(700, 'sine', 0.1);
    setIsPlayingVoice(!isPlayingVoice);
  };

  return (
    <div id="lodavia-ai-daily-feature" className="space-y-6 max-w-5xl mx-auto px-1">
      
      {/* Dynamic Smart Breaking Notification banner if triggered */}
      {liveNotification && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[380px] z-50 rounded-3xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/15 border-2 border-amber-500/60 p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <h4 className="text-xs font-black text-amber-300 tracking-wide">{liveNotification.title}</h4>
            </div>
            <button onClick={() => setLiveNotification(null)} className="text-slate-400 hover:text-white shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-100 font-medium mt-1.5 leading-relaxed">{liveNotification.body}</p>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-indigo-950/40 via-[#0a0a14]/60 to-purple-950/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-xl flex items-center justify-center relative">
            <div className="w-full h-full bg-[#07070F] rounded-[14px] flex items-center justify-center">
              <Brain className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950">
              ✨
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-xl font-black text-white">
                {lang === 'ar' ? 'ملخص لودافيا اليومي الذكي' : 'Lodavia AI Daily Brief'}
              </h2>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                {lang === 'ar' ? 'فائق الذكاء • PRO' : 'Neural • PRO'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-lg leading-relaxed">
              {lang === 'ar' 
                ? 'مساعدك الذكي الموثوق الذي يجمع خلاصة العالم، يلخص الأحداث ويفسرها بذكاء فائق يناسب اهتماماتك الكونية.' 
                : 'Your intelligent trusted daily companion that gathers verified world breakthroughs, summarizes events, and answers questions.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.08);
              setShowPreferences(true);
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'تخصيص الاهتمامات' : 'Setup Interests'}</span>
          </button>
          
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.1);
              fetchBriefings();
            }}
            disabled={loading}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{lang === 'ar' ? 'تحديث الملخص ⚡' : 'Refresh AI Daily ⚡'}</span>
          </button>
        </div>
      </div>

      {/* 2. Future-Ready: Live Simulated Podcasts & Audio Player Block */}
      {briefs.length > 0 && !loading && (
        <div className="glass-panel p-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-black/40 to-purple-950/20 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-full bg-cyan-400/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-[#070710] border border-cyan-500/20 flex items-center justify-center shadow-lg text-cyan-400 shrink-0">
                <Podcast className={`w-6 h-6 ${isPlayingVoice ? 'animate-bounce text-purple-400' : ''}`} />
              </div>
              <div className="text-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400">
                    {lang === 'ar' ? 'بث لودافيا الصوتي الذكي' : 'Lodavia AI Voice Briefing'}
                  </span>
                  <span className="text-[8px] bg-purple-500/10 text-purple-400 font-extrabold px-1.5 py-0.5 rounded-full border border-purple-500/20">
                    BETA
                  </span>
                </div>
                <h3 className="text-xs font-black text-white mt-0.5">
                  {isPlayingVoice 
                    ? (lang === 'ar' ? `يتم الآن قراءة: ${briefs[currentVoiceIndex]?.title}` : `Now Reading: ${briefs[currentVoiceIndex]?.title}`)
                    : (lang === 'ar' ? 'استمع إلى نشرتك الشخصية بصوت لودافيا الاصطناعي الكوني' : 'Listen to your customized briefings read by Lodavia companion')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end shrink-0">
              {/* Fake Equalizer Animation */}
              {isPlayingVoice && (
                <div className="flex items-end gap-1 h-5 shrink-0 select-none">
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_1s_infinite_100ms]" style={{ height: '70%' }} />
                  <span className="w-0.5 bg-purple-400 animate-[bounce_1.2s_infinite_200ms]" style={{ height: '40%' }} />
                  <span className="w-0.5 bg-cyan-400 animate-[bounce_0.8s_infinite_300ms]" style={{ height: '90%' }} />
                  <span className="w-0.5 bg-purple-400 animate-[bounce_1.4s_infinite_150ms]" style={{ height: '50%' }} />
                </div>
              )}

              <button
                onClick={handleToggleVoicePlay}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-black text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white/5"
              >
                {isPlayingVoice ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                    <span>{lang === 'ar' ? 'إيقاف مؤقت' : 'Pause Briefing'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                    <span>{lang === 'ar' ? 'استماع للنشرة 🎙️' : 'Play Voice Briefing 🎙️'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Voice Progress Line */}
          {isPlayingVoice && (
            <div className="w-full h-1 bg-black/40 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                style={{ width: `${voiceProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Main Loading & Error States */}
      {loading && (
        <div className="glass-panel p-16 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center gap-4 bg-black/20">
          <div className="relative w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center animate-spin border-t-2 border-r-2 border-cyan-400">
            <Brain className="w-8 h-8 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {lang === 'ar' ? 'جاري نسج ملخصك الذكي من لودافيا... 🌌' : 'Synthesizing your smart neural brief... 🌌'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1.5 max-w-sm">
              {lang === 'ar' 
                ? 'تقوم لودافيا الآن بتحليل اهتماماتك الكونية وقراءة المصادر الرسمية الموثوقة لصياغة نشرة مخصصة للغاية.' 
                : 'Lodavia is filtering official verified sources and compiling concise takeaways matching your interests.'}
            </p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="glass-panel p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">{lang === 'ar' ? 'فشل إعداد النشرة' : 'Failed to compile briefing'}</h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-sm">{error}</p>
          </div>
          <button
            onClick={() => fetchBriefings()}
            className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-[10px] border border-white/10 transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'إعادة المحاولة 🔄' : 'Retry Connection 🔄'}
          </button>
        </div>
      )}

      {/* 4. Greeting Card & Summarized News Cards */}
      {!loading && !error && briefs.length > 0 && (
        <div className="space-y-6">
          
          {/* Greeting Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600/10 via-[#0B0B16] to-purple-600/10 border border-white/5 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-lg animate-pulse">
              👋
            </div>
            <div>
              <p className="text-xs font-black text-white">{greeting}</p>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {lang === 'ar' ? 'صُنعت هذه النشرة خصيصاً لك لتقرأها في أقل من دقيقة واحدة.' : 'This brief is custom tailored and takes less than 1 minute to read.'}
              </span>
            </div>
          </div>

          {/* Category Quick Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border ${
                activeCategoryFilter === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-cyan-400/50 shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'جميع الأخبار ✨' : 'All Briefs ✨'}
            </button>
            {INTEREST_OPTIONS.map(opt => {
              const count = briefs.filter(b => b.interest === opt.category).length;
              if (count === 0 && !selectedInterests.includes(opt.category)) return null;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveCategoryFilter(opt.category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                    activeCategoryFilter === opt.category
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-cyan-400/50 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{lang === 'ar' ? opt.labelAr : opt.labelEn}</span>
                  {count > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 font-extrabold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid of customized news cards */}
          <div className="grid grid-cols-1 gap-6">
            {briefs
              .filter(b => activeCategoryFilter === 'all' || b.interest === activeCategoryFilter)
              .map((brief, idx) => {
              const isExplainingActive = explainingBriefId === brief.id;
              const isChatActive = activeChatBriefId === brief.id;
              const briefChatHistory = chatHistories[brief.id] || [];
              const categoryMatch = INTEREST_OPTIONS.find(o => o.category === brief.interest);
              const interestLabel = categoryMatch 
                ? (lang === 'ar' ? categoryMatch.labelAr : categoryMatch.labelEn) 
                : brief.interest;

              return (
                <div 
                  key={brief.id || idx}
                  className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0B0B16] via-[#101021] to-[#0D0D19] relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
                >
                  {/* Subtle ambient light per card */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
                  
                  {/* Header of news item */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                        {interestLabel}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-extrabold">{brief.sourceName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[9px] font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{brief.publicationTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-black text-white mt-4 tracking-tight leading-relaxed">
                    {brief.title}
                  </h3>

                  {/* 3 Core Pillars: What Happened? Why Important? Why Should I Care? */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-black/20 p-4 rounded-2xl border border-white/5 relative z-10">
                    
                    {/* What Happened */}
                    <div className="space-y-1 text-start">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {lang === 'ar' ? 'ماذا حدث؟' : 'What Happened?'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        {brief.whatHappened}
                      </p>
                    </div>

                    {/* Why is it important */}
                    <div className="space-y-1 text-start">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {lang === 'ar' ? 'لماذا هذا مهم؟' : 'Why is it important?'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        {brief.whyImportant}
                      </p>
                    </div>

                    {/* Why should I care */}
                    <div className="space-y-1 text-start">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {lang === 'ar' ? 'لماذا يجب أن أهتم؟' : 'Why should I care?'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        {brief.whyShouldICare}
                      </p>
                    </div>

                  </div>

                  {/* Trusted source verification seal */}
                  <div className="flex items-center justify-between flex-wrap gap-2.5 mt-3 px-1">
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-extrabold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ar' ? 'تحقق ذكي: مصدر موثوق ورسمي مائة بالمائة' : '100% Verified Trusted Source'}</span>
                    </div>
                    
                    <a 
                      href={sanitizeExternalUrl(brief.link)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => logUserInteraction(brief.interest, 'source')}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300 font-black flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{lang === 'ar' ? `قراءة المقال الأصلي على ${brief.sourceName}` : `Read original on ${brief.sourceName}`}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-3.5 border-t border-white/5 relative z-10">
                    <button
                      onClick={() => handleExplainWithLumi(brief)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isExplainingActive 
                          ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40' 
                          : 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 border border-purple-500/10'
                      }`}
                    >
                      {explainingLoading && explainingBriefId === brief.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                          <span>{lang === 'ar' ? 'تتحاور مع لودافيا الكوني...' : 'Translating neural layers...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>{lang === 'ar' ? 'تبسيط مع لودافيا ✨' : 'Explain with Lodavia ✨'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        playSynthSound(500, 'sine', 0.05);
                        setActiveChatBriefId(isChatActive ? null : brief.id);
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isChatActive 
                          ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'ar' ? 'اسأل لودافيا 💬' : 'Ask Lodavia 💬'}</span>
                    </button>
                  </div>

                  {/* 1. Expandable: Friend-like Explanation box */}
                  {isExplainingActive && lumiExplanation[brief.id] && (
                    <div className="mt-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-start animate-fadeIn relative">
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Smile className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">
                          {lang === 'ar' ? 'شرح لودافيا الصديق 💫' : 'Lodavia Friendly Explanation 💫'}
                        </span>
                      </div>
                      <div className="text-slate-200 text-xs leading-relaxed">
                        <MarkdownRenderer text={lumiExplanation[brief.id]} fontSizeClass="text-xs" />
                      </div>
                    </div>
                  )}

                  {/* 2. Expandable: Interactive Follow-up Chat Window */}
                  {isChatActive && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 text-start animate-fadeIn space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-cyan-400" />
                          {lang === 'ar' ? 'حوار ذكي حول الخبر' : 'Interactive Discussion'}
                        </span>
                        <button 
                          onClick={() => setActiveChatBriefId(null)} 
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Chat messages list */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {/* Default Lodavia Welcome prompt inside card chat */}
                        <div className="flex gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] text-cyan-400 shrink-0">
                            🤖
                          </div>
                          <div className="p-2.5 rounded-2xl bg-white/5 text-[11px] text-slate-300 leading-normal max-w-[85%]">
                            {lang === 'ar' 
                              ? `مرحباً بك! أنا لودافيا الكوني. هل تريد الاستفسار عن هذا الخبر؟ يمكنك الضغط على أحد الأسئلة المقترحة أدناه أو كتابة سؤالك.` 
                              : `Hello! I am Lodavia. Do you want to dive deeper into this event? Ask me anything or select a preset below.`}
                          </div>
                        </div>

                        {briefChatHistory.map((msg, mIdx) => (
                          <div key={mIdx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role !== 'user' && (
                              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] text-cyan-400 shrink-0">
                                🤖
                              </div>
                            )}
                            <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                              msg.role === 'user' 
                                ? 'bg-cyan-600/20 text-cyan-100 rounded-tr-none' 
                                : 'bg-white/5 text-slate-200 rounded-tl-none'
                            }`}>
                              {msg.role === 'user' ? (
                                msg.text
                              ) : (
                                <MarkdownRenderer text={msg.text} fontSizeClass="text-xs" />
                              )}
                            </div>
                          </div>
                        ))}

                        {chatLoading && (
                          <div className="flex gap-2.5 items-center text-[10px] text-slate-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                            <span>{lang === 'ar' ? 'تنسج لودافيا إجابة...' : 'Lodavia is crafting an answer...'}</span>
                          </div>
                        )}
                      </div>

                      {/* Custom suggestion questions */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          lang === 'ar' ? 'لماذا حدث هذا؟' : 'Why did this happen?',
                          lang === 'ar' ? 'ماذا يعني هذا للمستقبل؟' : 'What does this mean for the future?',
                          lang === 'ar' ? 'لخص الخبر في سطر واحد' : 'Summarize in one sentence',
                          lang === 'ar' ? 'اشرح كأني مبتدئ' : "Explain like I'm a beginner"
                        ].map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleAskLumiQuestion(brief, suggestion)}
                            disabled={chatLoading}
                            className="text-[9px] bg-white/5 hover:bg-white/10 text-cyan-300 font-extrabold px-2.5 py-1 rounded-full border border-white/5 cursor-pointer disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>

                      {/* Input Box */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInputs[brief.id] || ''}
                          onChange={(e) => setChatInputs(prev => ({ ...prev, [brief.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAskLumiQuestion(brief);
                          }}
                          placeholder={lang === 'ar' ? 'اسأل لودافيا عن الخبر...' : 'Ask Lodavia anything...'}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        />
                        <button
                          onClick={() => handleAskLumiQuestion(brief)}
                          disabled={chatLoading || !(chatInputs[brief.id] || '').trim()}
                          className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 cursor-pointer transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Preferences & Interests Setup Overlay Drawer Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 bg-[#0B0B14] overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <Brain className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {lang === 'ar' ? 'تخصيص اهتمامات ملخصك الذكي' : 'Customize Smart Brief Interests'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  playSynthSound(400, 'sine', 0.05);
                  setShowPreferences(false);
                }}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
              
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wide block">
                  {lang === 'ar' ? 'اختر اهتماماتك المفضلة ⚡' : 'Select Your Core Interests ⚡'}
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {lang === 'ar'
                    ? 'تقوم لودافيا بنسج ملخصاتها بناءً على اهتماماتك المحددة أدناه. يمكنك تفعيل أو إلغاء تفعيل أي اهتمام في أي وقت.'
                    : 'Lodavia weaves custom briefs matching only your selected areas below. Switch anytime.'}
                </p>
              </div>

              {/* Interests Grid Selection */}
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.category);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleToggleInterest(opt.category)}
                      className={`p-3 rounded-2xl text-xs font-bold text-start flex items-center justify-between border transition-all active:scale-95 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 text-white border-cyan-500/40 shadow-md shadow-cyan-500/5' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                      }`}
                    >
                      <span>{lang === 'ar' ? opt.labelAr : opt.labelEn}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Smart Learning Insight Info block */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-start">
                <span className="text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">
                  {lang === 'ar' ? 'محرك التعلم الذكي من لودافيا 🧠' : 'Lodavia Smart Learning Engine 🧠'}
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'تتعلم لودافيا من سلوكك الحقيقي! نقراتك على "شرح" أو "اسأل" تمنح هذه التصنيفات أولوية أعلى في النشرات القادمة تلقائياً.'
                    : 'Lodavia learns from your behavior! Expanding details or asking questions automatically boosts category priority next time.'}
                </p>
              </div>

              {/* Notification Toggle Block */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/20 via-black/40 to-cyan-950/20 border border-cyan-500/10 flex items-center justify-between gap-4">
                <div className="text-start">
                  <span className="text-[10px] text-white font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'ar' ? 'تنبيهات الاهتمام العاجلة' : 'Interest-Based Alerts'}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                    {lang === 'ar' ? 'تلقي إشعارات عاجلة ومحاكاة حية للأخبار المهمة فقط.' : 'Simulate breaking notifications related purely to your selected interests.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.08);
                    const updated = !notificationEnabled;
                    setNotificationEnabled(updated);
                    localStorage.setItem('lumo_daily_notifications', String(updated));
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                    notificationEnabled 
                      ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-400'
                  }`}
                >
                  {notificationEnabled ? (lang === 'ar' ? 'مفعلة' : 'Enabled') : (lang === 'ar' ? 'معطلة' : 'Disabled')}
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-900/40 flex justify-end gap-2">
              <button
                onClick={() => {
                  playSynthSound(400, 'sine', 0.05);
                  setShowPreferences(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
              
              <button
                onClick={() => {
                  playSynthSound(700, 'sine', 0.1);
                  setShowPreferences(false);
                  fetchBriefings();
                }}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-transform"
              >
                {lang === 'ar' ? 'حفظ وتحديث ⚡' : 'Apply & Regenerate ⚡'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
