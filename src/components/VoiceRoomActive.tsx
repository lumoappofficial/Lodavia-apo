import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Users, 
  Sparkles, 
  Globe, 
  Share2, 
  Heart, 
  Smile, 
  Send, 
  Gift, 
  UserPlus, 
  Hand, 
  Clock, 
  ArrowLeft, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Settings, 
  FileText, 
  Brain, 
  Shield, 
  Info, 
  VolumeX,
  Volume2
} from 'lucide-react';
import { VoiceRoomItem, VoiceUser } from '../types/voice';

interface VoiceRoomActiveProps {
  lang: 'ar' | 'en';
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  activeRoom: VoiceRoomItem;
  handleLeaveRoom: () => void;
  setSelectedUser: (user: VoiceUser | null) => void;
  setShowGiftModal: (show: boolean) => void;
  setShowInviteModal: (show: boolean) => void;
  currentUser: any;
  setRooms: React.Dispatch<React.SetStateAction<VoiceRoomItem[]>>;
  triggerRoomNotification: (msg: string) => void;
  roomNotification: string | null;
}

export function VoiceRoomActive({
  lang,
  playSynthSound,
  activeRoom,
  handleLeaveRoom,
  setSelectedUser,
  setShowGiftModal,
  setShowInviteModal,
  currentUser,
  setRooms,
  triggerRoomNotification,
  roomNotification
}: VoiceRoomActiveProps) {

  // Elapsed Room Timer State
  const [roomElapsed, setRoomElapsed] = useState('00:00');

  // Speaking Simulation State
  const [simulationActive, setSimulationActive] = useState(true);

  // User hand raised state (local reference synced to room participant)
  const myParticipant = activeRoom.participants.find(p => p.id === 'user-me');
  const myHandRaised = myParticipant?.handRaised || false;
  const myIsSpeaker = myParticipant?.isSpeaker || false;
  const myIsMuted = myParticipant?.isMuted || false;
  const myIsHost = myParticipant?.isHost || false;

  // Poll state (dynamic voting representation)
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState({ opt1: 42, opt2: 18, opt3: 25 });

  // Floating Reactions state
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; char: string; left: number }>>([]);
  const reactionIdCounter = useRef(0);

  // Transcript state (AI live speech-to-text simulation)
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; textAr: string }>>([
    { 
      speaker: activeRoom.hostName, 
      text: "Welcome to our live orbit stage! Today we're exploring deep technological architecture.",
      textAr: "أهلاً بكم في مسرح البث الحي اليوم! نتناول بنيات الأنظمة وتكاملات الذكاء الفائقة."
    },
    { 
      speaker: activeRoom.participants[1]?.name || 'Sara', 
      text: "Yes, utilizing localized compilation really enhances cold startup speed.",
      textAr: "بالتأكيد، إن استخدام التصنيف المحلي يعزز سرعة إقلاع البرمجيات بشكل ملحوظ."
    }
  ]);
  const [langTranslation, setLangTranslation] = useState<'original' | 'arabic'>('original');

  // AI Summary Points state
  const [aiSummary, setAiSummary] = useState<string[]>([
    "Explored compilation paradigms vs dynamic execution.",
    "Discussed UI bottlenecks in canvas frameworks."
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiAnswers, setAiAnswers] = useState<string[]>([]);

  // Soundwave and Speech simulation interval
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Pick a random participant (except me) and toggle their speaking state
      setRooms(prev => prev.map(r => {
        if (r.id === activeRoom.id) {
          // Shuffle speaking status among other participants
          return {
            ...r,
            participants: r.participants.map(p => {
              if (p.id === 'user-me') return p;
              // 30% chance of speaking if they are a speaker
              const speakChange = p.isSpeaker && !p.isMuted ? Math.random() > 0.65 : false;
              return { ...p, isSpeaking: speakChange };
            })
          };
        }
        return r;
      }));

      // Simulate a random new sentence in transcripts sometimes
      if (Math.random() > 0.75) {
        const otherSpeakers = activeRoom.participants.filter(p => p.isSpeaker && p.id !== 'user-me');
        if (otherSpeakers.length > 0) {
          const randomSpeaker = otherSpeakers[Math.floor(Math.random() * otherSpeakers.length)];
          const randomQuotes = [
            { text: "Integrating real-time speech telemetry elevates user collaboration.", textAr: "تكامل القياس الصوتي الآني يحسن التعاون بين الأعضاء بشكل فائق." },
            { text: "Futuristic glassmorphism design looks stunning with clean light refraction.", textAr: "التصميم البلوري المستقبلي مذهل للغاية مع انكسارات الضوء الأنيقة." },
            { text: "Durable persistence ensures that room histories are retained for audits.", textAr: "الحفظ المستمر للبيانات يضمن بقاء سجلات القاعات دقيقة وقابلة للمراجعة." },
            { text: "Let's promote more listeners to the stage to hear their feedback.", textAr: "دعونا نرفع المزيد من المستمعين إلى المسرح لنستمع إلى آرائهم وتجاربهم." }
          ];
          const quote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
          setTranscript(prev => [...prev.slice(-6), { speaker: randomSpeaker.name, text: quote.text, textAr: quote.textAr }]);
          
          // Generate an AI Summary point sometimes too
          if (Math.random() > 0.5) {
            setAiSummary(prev => [...prev.slice(-3), `Discussed: "${quote.text.substring(0, 35)}..."`]);
          }
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [simulationActive, activeRoom.participants.length, activeRoom.id]);

  // Real-time Room Timer loop
  useEffect(() => {
    // Generate a randomized past start timestamp so the room already looks active
    const startTime = Date.now() - (activeRoom.listenersCount * 14000);

    const timerInterval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      const formatted = [
        hrs > 0 ? String(hrs).padStart(2, '0') : null,
        String(mins).padStart(2, '0'),
        String(secs).padStart(2, '0')
      ].filter(Boolean).join(':');

      setRoomElapsed(formatted);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [activeRoom.id]);

  // Handle Mute Self trigger
  const handleToggleMuteSelf = () => {
    playSynthSound(myIsMuted ? 880 : 350, 'sine', 0.08);
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          participants: r.participants.map(p => {
            if (p.id === 'user-me') return { ...p, isMuted: !p.isMuted, isSpeaking: false };
            return p;
          })
        };
      }
      return r;
    }));
    triggerRoomNotification(myIsMuted 
      ? (lang === 'ar' ? 'تم فتح الميكروفون للحديث.' : 'Microphone unmuted. You are live.')
      : (lang === 'ar' ? 'تم كتم الصوت.' : 'Microphone muted.')
    );
  };

  // Handle Raise Hand trigger
  const handleToggleRaiseHand = () => {
    playSynthSound(900, 'sine', 0.1);
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          participants: r.participants.map(p => {
            if (p.id === 'user-me') return { ...p, handRaised: !p.handRaised };
            return p;
          })
        };
      }
      return r;
    }));
    triggerRoomNotification(!myHandRaised 
      ? (lang === 'ar' ? 'قمت برفع يدك لطلب الكلمة ✋' : 'Raised hand. Host will see request ✋')
      : (lang === 'ar' ? 'تم تنزيل يدك.' : 'Lowered your hand.')
    );
  };

  // Toggle Room Lock (Only available if user is Host/Moderator)
  const handleToggleRoomLock = () => {
    playSynthSound(activeRoom.isLocked ? 1046 : 220, 'sine', 0.15);
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return { ...r, isLocked: !r.isLocked };
      }
      return r;
    }));
    triggerRoomNotification(!activeRoom.isLocked 
      ? (lang === 'ar' ? 'تم إقفال الغرفة الآن 🔒' : 'Stage locked by Host. No more listeners can join 🔒')
      : (lang === 'ar' ? 'تم فتح الغرفة للجميع 🌐' : 'Stage unlocked by Host. Open to the galaxy 🌐')
    );
  };

  // Self promotion helper for testing
  const handleToggleSelfRole = () => {
    playSynthSound(880, 'sine', 0.15);
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        const updateSpeakers = myIsSpeaker ? r.speakersCount - 1 : r.speakersCount + 1;
        return {
          ...r,
          speakersCount: Math.max(1, updateSpeakers),
          participants: r.participants.map(p => {
            if (p.id === 'user-me') {
              return { ...p, isSpeaker: !p.isSpeaker, handRaised: false };
            }
            return p;
          })
        };
      }
      return r;
    }));
    triggerRoomNotification(!myIsSpeaker 
      ? (lang === 'ar' ? 'تم ترفيعك لمتحدث على المسرح! 🎙️' : 'Promoted yourself to Stage Speaker! 🎙️')
      : (lang === 'ar' ? 'نزلت للمستمعين.' : 'Returned to the listening pool.')
    );
  };

  // Simulate becoming the Host/Moderator
  const handleToggleHostRole = () => {
    playSynthSound(1046, 'sine', 0.2);
    setRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          hostName: myIsHost ? 'صالح العمري' : currentUser.name,
          hostAvatar: myIsHost ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' : currentUser.avatar,
          participants: r.participants.map(p => {
            if (p.id === 'user-me') return { ...p, isHost: !p.isHost, isSpeaker: true };
            // Demote old host
            if (p.name === 'صالح العمري') return { ...p, isHost: false };
            return p;
          })
        };
      }
      return r;
    }));
    triggerRoomNotification(!myIsHost 
      ? (lang === 'ar' ? 'لقد تم تعيينك مديراً ومستضيفاً للمسرح! 👑' : 'Host & Stage Moderator authority enabled! 👑')
      : (lang === 'ar' ? 'تم إلغاء صلاحية المستضيف.' : 'Host authority released.')
    );
  };

  // Reaction spawner trigger
  const handleSpawnReaction = (emoji: string) => {
    playSynthSound(600 + Math.random() * 400, 'sine', 0.05);
    const id = reactionIdCounter.current++;
    setFloatingEmojis(prev => [...prev, { id, char: emoji, left: 10 + Math.random() * 80 }]);
    
    // Auto clear after animation completes
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2500);
  };

  // Submit Poll vote
  const handleVotePoll = (optionId: string) => {
    if (pollVoted) return;
    playSynthSound(900, 'sine', 0.08);
    setPollVoted(optionId);
    setPollVotes(prev => {
      if (optionId === 'opt1') return { ...prev, opt1: prev.opt1 + 1 };
      if (optionId === 'opt2') return { ...prev, opt2: prev.opt2 + 1 };
      return { ...prev, opt3: prev.opt3 + 1 };
    });
    triggerRoomNotification(lang === 'ar' ? 'تم تسجيل صوتك في الاستطلاع الكوني!' : 'Dynamic vote cast successfully!');
  };

  // Submit Question to AI Live Companion
  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    playSynthSound(800, 'triangle', 0.1);
    const question = aiInput;
    setAiInput('');

    // Simulate AI looking up ongoing telemetry
    triggerRoomNotification(lang === 'ar' ? 'يقوم المساعد بتحليل الصالون الآن...' : 'AI Comet compiling response...');
    
    setTimeout(() => {
      const answers = [
        `Based on Sara's points, dynamic compilation provides faster cold starts, while static bundlers reduce overall payload weights.`,
        `The current sentiment is heavily focused on frontend latency reductions and serverless scaling metrics.`,
        `Yasin suggested exploring Rust-based compilers (e.g. SWC, Esbuild) for standard pipeline optimization.`
      ];
      const answer = answers[Math.floor(Math.random() * answers.length)];
      setAiAnswers(prev => [...prev, `Q: "${question}"\nAI: ${answer}`]);
      playSynthSound(1046, 'sine', 0.15);
    }, 1500);
  };

  // Split participants list by stage roles
  const hostParticipants = activeRoom.participants.filter(p => p.isHost);
  const speakerParticipants = activeRoom.participants.filter(p => p.isSpeaker && !p.isHost);
  const listenerParticipants = activeRoom.participants.filter(p => !p.isSpeaker && !p.isHost);

  // Soundwave bouncing bars graphic helper
  const SoundWaveBars = () => (
    <div className="flex items-end gap-[2px] h-3 px-1.5 shrink-0">
      <div className="w-[1.5px] bg-cyan-400 rounded-full animate-sw-1" style={{ height: '3px' }} />
      <div className="w-[1.5px] bg-cyan-400 rounded-full animate-sw-2" style={{ height: '6px' }} />
      <div className="w-[1.5px] bg-cyan-400 rounded-full animate-sw-3" style={{ height: '2px' }} />
      <div className="w-[1.5px] bg-cyan-400 rounded-full animate-sw-4" style={{ height: '4px' }} />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative" id="active-voice-room-grid">
      
      {/* Dynamic Floating Emojis Canvas overlay */}
      <div className="fixed bottom-24 left-12 w-48 h-96 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map(emoji => (
            <motion.span
              key={emoji.id}
              initial={{ opacity: 1, y: 350, scale: 0.8 }}
              animate={{ opacity: 0, y: 0, scale: 1.5, rotate: (emoji.left - 50) * 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute text-2xl select-none"
              style={{ left: `${emoji.left}%` }}
            >
              {emoji.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* LEFT & CENTER PANEL (Take 2 columns) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Active Stage Header Panel */}
        <div className="glass-panel rounded-3xl p-6 bg-slate-950/45 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-start gap-4 flex-wrap relative z-10">
            
            {/* Back to Hub Button */}
            <button
              onClick={handleLeaveRoom}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Hub'}</span>
            </button>

            {/* Room Timer widget */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-mono text-[11px] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{lang === 'ar' ? 'نشط:' : 'Elapsed:'}</span>
              <span>{roomElapsed}</span>
            </div>
          </div>

          {/* Room Title */}
          <div className="mt-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                {lang === 'ar' ? activeRoom.categoryAr : activeRoom.category}
              </span>
              <span className="text-slate-500 text-xs font-bold">•</span>
              <span className="text-slate-400 text-xs font-semibold">{lang === 'ar' ? activeRoom.communityNameAr : activeRoom.communityName}</span>
            </div>

            <h1 className="text-base md:text-lg font-black text-white leading-relaxed mt-2 flex items-center gap-2 flex-wrap">
              <span>{lang === 'ar' ? activeRoom.titleAr : activeRoom.title}</span>
              {activeRoom.isLocked ? (
                <span className="text-[9px] bg-red-950/60 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>LOCKED</span>
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>PUBLIC STAGE</span>
                </span>
              )}
            </h1>
          </div>

          {/* Core Controls Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-5 pt-5 border-t border-white/5 relative z-10">
            
            {/* Mute Self Control */}
            <button
              onClick={handleToggleMuteSelf}
              className={`py-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                myIsMuted 
                  ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              }`}
            >
              {myIsMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 animate-pulse" />}
              <span>{myIsMuted ? (lang === 'ar' ? 'تشغيل المايك' : 'Unmute') : (lang === 'ar' ? 'كتم الصوت' : 'Speaking')}</span>
            </button>

            {/* Raise Hand Control */}
            <button
              onClick={handleToggleRaiseHand}
              className={`py-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                myHandRaised 
                  ? 'bg-purple-600/30 border-purple-400 text-purple-300' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Hand className={`w-4 h-4 ${myHandRaised ? 'animate-bounce' : ''}`} />
              <span>{myHandRaised ? (lang === 'ar' ? 'تنزيل اليد ✋' : 'Raised ✋') : (lang === 'ar' ? 'طلب الحديث' : 'Request stage')}</span>
            </button>

            {/* Lock Room Toggle (Moderators) */}
            <button
              onClick={handleToggleRoomLock}
              className={`py-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                myIsHost 
                  ? 'bg-slate-900 border-white/20 text-slate-300 hover:bg-slate-850' 
                  : 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed opacity-50'
              }`}
              title={myIsHost ? 'Lock Stage' : 'Host Authorization Required'}
            >
              {activeRoom.isLocked ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-cyan-400" />}
              <span>{activeRoom.isLocked ? (lang === 'ar' ? 'فتح القفل' : 'Locked') : (lang === 'ar' ? 'قفل الغرفة' : 'Unlocked')}</span>
            </button>

            {/* Invite Speakers */}
            <button
              onClick={() => {
                playSynthSound(440, 'sine', 0.1);
                setShowInviteModal(true);
              }}
              className="py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'دعوة أصدقاء' : 'Invite'}</span>
            </button>

            {/* Gifts */}
            <button
              onClick={() => {
                playSynthSound(500, 'sine', 0.1);
                setShowGiftModal(true);
              }}
              className="py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <Gift className="w-4 h-4 text-yellow-400" />
              <span>{lang === 'ar' ? 'إرسال هدية' : 'Send Gift'}</span>
            </button>

            {/* Leave button */}
            <button
              onClick={handleLeaveRoom}
              className="py-3 rounded-2xl bg-red-600/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مغادرة ✕' : 'Disconnect ✕'}</span>
            </button>
          </div>

          {/* Dev/Simulator controls block */}
          <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500">
            <span className="font-bold flex items-center gap-1 text-cyan-400">
              <Info className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'لوحة تحكم المحاكاة لمدير الحوار:' : 'Demo Sandbox Controls:'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleToggleHostRole}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                  myIsHost 
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                👑 {myIsHost ? (lang === 'ar' ? 'صلاحيات المدير نشطة' : 'Host Override: ON') : (lang === 'ar' ? 'محاكاة دور المنسق' : 'Grant Host Powers')}
              </button>

              <button
                onClick={handleToggleSelfRole}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-bold"
              >
                🎙️ {myIsSpeaker ? (lang === 'ar' ? 'النزول للمستمعين' : 'Go to Listeners') : (lang === 'ar' ? 'الصعود للمسرح' : 'Promote Self to Stage')}
              </button>

              <button
                onClick={() => {
                  playSynthSound(440, 'sine', 0.05);
                  setSimulationActive(!simulationActive);
                }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                  simulationActive 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                    : 'bg-white/5 border-white/5 text-slate-500'
                }`}
              >
                📡 {simulationActive ? (lang === 'ar' ? 'إيقاف محاكاة الحديث' : 'Speech Simulation: ON') : (lang === 'ar' ? 'تشغيل محاكاة الحديث' : 'Speech Simulation: OFF')}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications floating band inside room */}
        {roomNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold text-center shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{roomNotification}</span>
          </motion.div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PARTICIPANT STAGE GRIDS (STAGE HOUSES & SPEAKERS & LISTENERS) */}
        {/* ---------------------------------------------------- */}
        
        {/* TIER 1: HOST SECTION */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span>{lang === 'ar' ? 'مستضيفي الحوار والمنسقين 👑' : 'Stage Hosts & Moderators 👑'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-yellow-500/10 text-yellow-500 font-bold font-mono">
              {hostParticipants.length}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hostParticipants.map((p) => (
              <div 
                key={p.id}
                onClick={() => setSelectedUser(p)}
                className={`p-4 rounded-3xl border transition-all duration-300 flex items-center gap-3 cursor-pointer group relative overflow-hidden ${
                  p.isSpeaking && !p.isMuted
                    ? 'bg-gradient-to-br from-[#1c1810]/75 to-slate-950/75 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-[1.02]' 
                    : 'bg-slate-950/40 border-white/5 hover:border-yellow-500/20'
                }`}
              >
                {/* Speaking ripple ring behind avatar */}
                {p.isSpeaking && !p.isMuted && (
                  <div className="absolute inset-0 bg-yellow-500/[0.02] animate-pulse" />
                )}

                <div className="relative shrink-0">
                  {p.isSpeaking && !p.isMuted && (
                    <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-ring opacity-60 scale-115" />
                  )}
                  <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/50 relative z-10" />
                  
                  {/* Host badge over avatar */}
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 w-4.5 h-4.5 rounded-full border border-slate-950 text-[9px] flex items-center justify-center font-black z-20 shadow-md">
                    👑
                  </span>
                </div>

                <div className="flex-1 overflow-hidden relative z-10">
                  <div className="flex items-center gap-1 justify-between">
                    <span className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors block truncate">{p.name}</span>
                    {p.isSpeaking && !p.isMuted && <SoundWaveBars />}
                  </div>
                  
                  {/* Stats or subtitle */}
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <span className="text-[9px] text-slate-400 block truncate">
                      {lang === 'ar' ? p.bioAr : p.bio}
                    </span>
                    {p.isMuted && (
                      <span className="bg-red-500/20 text-red-400 p-0.5 rounded-full">
                        <MicOff className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 2: SPEAKER SECTION */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{lang === 'ar' ? 'المتحدثون على المسرح 🎙️' : 'Speakers on Stage 🎙️'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/10 text-cyan-400 font-bold font-mono">
              {speakerParticipants.length}
            </span>
          </h2>

          {speakerParticipants.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-white/2 rounded-2xl text-[10px] border border-white/5">
              {lang === 'ar' ? 'المسرح فارغ الآن. ارتقِ بمستمعين أو اطلب الحديث.' : 'No active speakers. Promote someone or unmute!'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {speakerParticipants.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedUser(p)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center justify-center gap-2 cursor-pointer group relative overflow-hidden ${
                    p.isSpeaking && !p.isMuted
                      ? 'bg-gradient-to-b from-cyan-950/20 to-slate-950/80 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.03]' 
                      : 'bg-slate-950/40 border-white/5 hover:border-cyan-500/20'
                  }`}
                >
                  <div className="relative shrink-0">
                    {p.isSpeaking && !p.isMuted && (
                      <div className="absolute inset-0 rounded-full bg-cyan-400 animate-pulse-ring opacity-60 scale-120" />
                    )}
                    <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-full object-cover border border-white/20 relative z-10" />
                    
                    <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 w-4.5 h-4.5 rounded-full border border-slate-950 text-[8px] flex items-center justify-center font-bold z-20">
                      🎙️
                    </span>
                  </div>

                  <div className="w-full relative z-10 overflow-hidden mt-1">
                    <div className="flex items-center justify-center gap-1 px-1">
                      <span className="text-[11px] font-black text-white group-hover:text-cyan-400 transition-colors block truncate">{p.name}</span>
                      {p.isSpeaking && !p.isMuted && <SoundWaveBars />}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="text-[8px] bg-white/5 text-slate-400 px-1.5 py-0.2 rounded">Speaker</span>
                      {p.isMuted && (
                        <span className="bg-red-500/20 text-red-400 p-0.5 rounded-full">
                          <MicOff className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TIER 3: AUDIENCE SECTION */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>{lang === 'ar' ? 'المستمعون في مدار المسرح 🎧' : 'Audience in Orbit 🎧'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-bold font-mono">
              {listenerParticipants.length}
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {/* Sort: Hand raisers first */}
            {[...listenerParticipants].sort((a, b) => (b.handRaised ? 1 : 0) - (a.handRaised ? 1 : 0)).map((p) => {
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedUser(p)}
                  className={`p-2.5 rounded-2xl border bg-slate-950/30 border-white/5 hover:border-slate-400/20 transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group ${
                    p.handRaised ? 'border-purple-500/30 bg-purple-950/10 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : ''
                  }`}
                >
                  <div className="relative">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    
                    {p.handRaised && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white w-4 h-4 rounded-full border border-slate-950 text-[9px] flex items-center justify-center font-bold animate-bounce shadow-md">
                        ✋
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-300 block truncate w-full px-1 group-hover:text-white transition-colors">{p.name}</span>
                  
                  {/* Promoted listener shortcuts for Host to click */}
                  {myIsHost && p.handRaised && (
                    <span className="text-[7px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-1 py-0.2 rounded-full font-black animate-pulse mt-0.5">
                      TAP TO PROMOTE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE COMPONENT: REACTIONS & POLLS ROW */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
          
          {/* Reaction Spawner Panel */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-[#0a0a14]/60 flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
              {lang === 'ar' ? 'انشر تفاعلات حية للمسرح 🎉' : 'Live Audience Emoji Reactions 🎉'}
            </span>
            <div className="grid grid-cols-6 gap-2 mt-1">
              {['❤️', '🔥', '🎉', '🚀', '😂', '⚡'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSpawnReaction(emoji)}
                  className="py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:scale-110 active:scale-95 text-xl cursor-pointer transition-all flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Audience Poll Card */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-[#0a0a14]/60 flex flex-col gap-2 justify-between">
            <div>
              <span className="text-[9px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                POLL OF THE ORBIT
              </span>
              <h4 className="text-[11px] font-black text-white mt-1.5 leading-snug">
                {lang === 'ar' ? 'هل تعتقد أن بنية الـ Static Bundlers ستختفي؟' : 'Should full stack apps bypass standard Node ESM checks?'}
              </h4>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {[
                { id: 'opt1', text: lang === 'ar' ? 'نعم، كليا' : 'Absolutely, CJS bundles are faster', count: pollVotes.opt1 },
                { id: 'opt2', text: lang === 'ar' ? 'لا، كلاهما مهم' : 'No, native ESM is strict but standard', count: pollVotes.opt2 },
                { id: 'opt3', text: lang === 'ar' ? 'متردد/أحتاج تجربة' : 'Undecided / Need telemetry data', count: pollVotes.opt3 }
              ].map((opt) => {
                const total = pollVotes.opt1 + pollVotes.opt2 + pollVotes.opt3;
                const percentage = Math.round((opt.count / total) * 100);
                const isSelected = pollVoted === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={!!pollVoted}
                    onClick={() => handleVotePoll(opt.id)}
                    className={`w-full p-2.5 rounded-xl border text-start relative overflow-hidden transition-all text-xs flex justify-between items-center ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-950/20 text-cyan-200 font-extrabold' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {/* Visual Vote Progress Bar */}
                    <div 
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                        isSelected ? 'bg-cyan-500/10' : 'bg-white/5'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <span className="relative z-10 truncate max-w-[80%]">{opt.text}</span>
                    <span className="relative z-10 text-[10px] font-mono font-bold text-slate-500">
                      {pollVoted ? `${percentage}%` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT PANEL: LODAVIA AI COMET SIDEBAR (AI TELEMETRY COMPANION) */}
      {/* ---------------------------------------------------- */}
      <div className="lg:col-span-1 flex flex-col gap-6" id="active-room-ai-sidebar">
        
        <div className="glass-panel rounded-3xl p-5 border border-purple-500/20 bg-gradient-to-b from-[#0a0614]/80 to-[#030307]/90 flex flex-col gap-4 shadow-2xl relative">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {lang === 'ar' ? 'المساعد الصوتي الذكي Lodavia AI 🪐' : 'Lodavia AI Stage Companion 🪐'}
              </h3>
            </div>
            
            <span className="text-[8px] bg-purple-500/15 border border-purple-500/40 text-purple-300 px-1.5 py-0.2 rounded font-black font-mono animate-pulse">
              TELEMETRY: ON
            </span>
          </div>

          {/* AI Transcriptions sub-card */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-black">
              <span>🎙️ Live Transcription feed</span>
              <button
                onClick={() => setLangTranslation(prev => prev === 'original' ? 'arabic' : 'original')}
                className="px-2 py-0.5 rounded bg-purple-950/40 hover:bg-purple-900 border border-purple-500/30 text-[9px] text-purple-300 font-bold transition-all cursor-pointer"
              >
                {langTranslation === 'original' ? 'TRANSLATE AR' : 'SHOW ORIGINAL'}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 h-64 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
              {transcript.map((line, i) => (
                <div key={i} className="flex flex-col gap-0.5 text-xs">
                  <span className="text-[10px] font-black text-cyan-400">{line.speaker}</span>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {langTranslation === 'arabic' ? line.textAr : line.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Live Key Takeaways bullet points */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Real-time Decisions & Summaries</span>
            </span>

            <ul className="flex flex-col gap-1.5 p-3 rounded-2xl bg-purple-950/10 border border-purple-500/10 text-[11px] text-slate-300 list-disc list-inside leading-relaxed font-semibold">
              {aiSummary.map((bullet, i) => (
                <li key={i} className="text-slate-300">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Q&A Text Form widget */}
          <form onSubmit={handleAskAI} className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {lang === 'ar' ? 'اسأل الذكاء الاصطناعي عن الجلسة الحالية' : 'Ask AI anything about ongoing debate'}
            </span>

            <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-3 py-2">
              <input 
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: ما رأي سارة بالـ Cold starts؟' : 'Ask Comet AI: e.g. What is the consensus?'}
                className="bg-transparent border-none text-[11px] text-white focus:outline-none focus:ring-0 w-full px-2 placeholder:text-slate-500"
              />
              <button 
                type="submit"
                className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {aiAnswers.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 bg-black/20 p-2.5 rounded-xl max-h-32 overflow-y-auto border border-white/5 text-[10px]">
                {aiAnswers.map((ans, i) => (
                  <div key={i} className="text-slate-400 whitespace-pre-line border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0">
                    {ans}
                  </div>
                ))}
              </div>
            )}
          </form>

        </div>

      </div>

    </div>
  );
}
export default VoiceRoomActive;
