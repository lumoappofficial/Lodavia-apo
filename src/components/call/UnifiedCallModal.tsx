import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  SwitchCamera, 
  Volume2, 
  VolumeX, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  MoreHorizontal, 
  X, 
  Disc, 
  Radio, 
  Wand2, 
  Send, 
  Heart, 
  Flame, 
  Minimize2, 
  Maximize2, 
  Wifi, 
  WifiOff, 
  Sliders, 
  Image as ImageIcon,
  Check,
  CheckCircle2,
  RefreshCw,
  Globe2,
  Lock,
  Zap,
  Users,
  ChevronDown,
  AlertTriangle,
  RadioTower,
  Smartphone,
  Headphones
} from 'lucide-react';
import { ActiveCallState, CallStatus, CallType, InCallChatMessage } from '../../types/call';
import { AppUser } from '../../types';
import { playIncomingCallRingtone, playOutgoingCallTone } from '../../utils/soundEffects';

interface UnifiedCallModalProps {
  activeCall: ActiveCallState | { type: 'voice' | 'video'; contactName: string; status: any; [key: string]: any } | null;
  currentUser?: AppUser;
  lang?: string;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onRejectCall?: () => void;
  onSendMessageInCall?: (text: string) => void;
  playSynthSound?: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

const COSMIC_FILTERS = [
  { id: 'none', nameAr: 'طبيعي', nameEn: 'Natural', filterClass: 'filter-none', icon: '✨', previewBg: 'from-slate-800 to-slate-900' },
  { id: 'neon', nameAr: 'نيون كوني', nameEn: 'Cosmic Neon', filterClass: 'contrast-125 saturate-150 hue-rotate-15', icon: '🌌', previewBg: 'from-cyan-900 to-purple-950' },
  { id: 'aurora', nameAr: 'أورورا قطبية', nameEn: 'Aurora Glow', filterClass: 'brightness-110 saturate-125 hue-rotate-90', icon: '🌠', previewBg: 'from-emerald-900 to-teal-950' },
  { id: 'cyber', nameAr: 'سايبر كوانتم', nameEn: 'Cyber Quantum', filterClass: 'contrast-150 brightness-95 hue-rotate-180', icon: '🔮', previewBg: 'from-fuchsia-900 to-indigo-950' },
  { id: 'golden', nameAr: 'شمس فضائية', nameEn: 'Solar Gold', filterClass: 'sepia-50 saturate-150 brightness-105', icon: '☀️', previewBg: 'from-amber-900 to-orange-950' },
  { id: 'noir', nameAr: 'فضاء عميق B&W', nameEn: 'Deep Mono', filterClass: 'grayscale contrast-125', icon: '🌑', previewBg: 'from-zinc-900 to-black' },
];

const VIRTUAL_BACKGROUNDS = [
  { id: 'none', nameAr: 'افتراضي', nameEn: 'Default Studio', preview: '' },
  { id: 'nebula', nameAr: 'سديم لودافيا', nameEn: 'Lodavia Nebula', preview: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80' },
  { id: 'station', nameAr: 'محطة مدارية', nameEn: 'Orbital Station', preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80' },
  { id: 'cyberpunk', nameAr: 'مدينة المستقبل', nameEn: 'Neo City', preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  { id: 'studio', nameAr: 'استوديو نيون', nameEn: 'Neon Studio', preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80' },
];

const QUICK_RESPONSES = {
  ar: [
    'سأعاود الاتصال بك بعد قليل 🚀',
    'في اجتماع صوتي حالياً 🎙️',
    'أرسل لي رسالة نصية هنا 💬',
    'سأكون متفرغاً بعد 10 دقائق ⏰',
    'أقود السيارة حالياً 🚗'
  ],
  en: [
    "I'll call you back shortly 🚀",
    "In a voice meeting right now 🎙️",
    "Please send me a text message 💬",
    "I'll be available in 10 mins ⏰",
    "Driving right now 🚗"
  ]
};

export default function UnifiedCallModal({
  activeCall,
  currentUser,
  lang = 'ar',
  onEndCall,
  onAcceptCall,
  onRejectCall,
  onSendMessageInCall,
  playSynthSound = () => {}
}: UnifiedCallModalProps) {
  if (!activeCall) return null;

  const isAr = lang === 'ar';
  const isIncoming = activeCall.isIncoming || activeCall.status === 'incoming';
  
  // Call internal states
  const [callType, setCallType] = useState<CallType>(activeCall.type || 'video');
  const [callStatus, setCallStatus] = useState<CallStatus>(activeCall.status || 'calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isNoiseSuppression, setIsNoiseSuppression] = useState(true);
  const [isPipMinimized, setIsPipMinimized] = useState(false);
  
  // Modals & Panels inside call
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showFiltersTab, setShowFiltersTab] = useState(false);
  const [showBackgroundsTab, setShowBackgroundsTab] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  // Active Filter & Background
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedBackground, setSelectedBackground] = useState('none');
  
  // In-call Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  
  // In-call Chat Messages
  const [chatMessages, setChatMessages] = useState<InCallChatMessage[]>([
    {
      id: 'm1',
      senderId: 'contact',
      senderName: activeCall.contactName,
      text: isAr ? 'مرحباً! البث المشفر متصل بجودة فائقة 🪐' : 'Hello! Encrypted stream connected in HD 🪐',
      timestamp: '12:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Audio Equalizer simulation
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 30, 50, 75, 45, 25, 12]);

  // Sync external status
  useEffect(() => {
    if (activeCall.status) {
      setCallStatus(activeCall.status);
    }
    if (activeCall.type) {
      setCallType(activeCall.type);
    }
  }, [activeCall.status, activeCall.type]);

  // Auto-connect after 2.5 seconds if status is calling or ringing
  useEffect(() => {
    let timeout: any;
    if (callStatus === 'calling' || callStatus === 'ringing') {
      timeout = setTimeout(() => {
        setCallStatus('connected');
        playSynthSound(600, 'sine', 0.15);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [callStatus, playSynthSound]);

  // Audio ringtone & outgoing calling tone management
  useEffect(() => {
    let incomingTone: { start: () => void; stop: () => void } | null = null;
    let outgoingTone: { start: () => void; stop: () => void } | null = null;

    if (callStatus === 'incoming' || (isIncoming && callStatus !== 'connected' && callStatus !== 'ended')) {
      incomingTone = playIncomingCallRingtone();
      incomingTone.start();
    } else if (callStatus === 'calling' || callStatus === 'ringing') {
      outgoingTone = playOutgoingCallTone();
      outgoingTone.start();
    }

    return () => {
      if (incomingTone) {
        incomingTone.stop();
      }
      if (outgoingTone) {
        outgoingTone.stop();
      }
    };
  }, [callStatus, isIncoming]);

  // Call timer ticker
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Equalizer animation interval
  useEffect(() => {
    if (callStatus !== 'connected' || isMuted) return;
    const interval = setInterval(() => {
      setAudioLevels([
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 65 + 15),
        Math.floor(Math.random() * 85 + 20),
        Math.floor(Math.random() * 95 + 25),
        Math.floor(Math.random() * 75 + 15),
        Math.floor(Math.random() * 55 + 10),
        Math.floor(Math.random() * 30 + 5),
      ]);
    }, 110);
    return () => clearInterval(interval);
  }, [callStatus, isMuted]);

  // Format Duration (MM:SS or HH:MM:SS)
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trigger floating reaction
  const triggerReaction = (emoji: string) => {
    playSynthSound(750, 'sine', 0.05);
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60 + 20); // 20% to 80% width
    setFloatingReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2200);
  };

  // Send In-Call Chat message
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    playSynthSound(600, 'sine', 0.05);
    const newMsg: InCallChatMessage = {
      id: `chat_${Date.now()}`,
      senderId: 'me',
      senderName: currentUser?.name || (isAr ? 'أنت' : 'You'),
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    if (onSendMessageInCall) {
      onSendMessageInCall(chatInput.trim());
    }
    setChatInput('');
  };

  // Send Quick Reply & Reject
  const handleSendQuickReply = (text: string) => {
    playSynthSound(440, 'triangle', 0.1);
    if (onSendMessageInCall) {
      onSendMessageInCall(text);
    }
    setShowQuickReplies(false);
    if (onRejectCall) {
      onRejectCall();
    } else {
      onEndCall();
    }
  };

  // Switch Call Type between Voice & Video
  const handleToggleCallType = () => {
    playSynthSound(550, 'sine', 0.08);
    setCallType(prev => prev === 'video' ? 'voice' : 'video');
  };

  // Handle Accept
  const handleAccept = () => {
    playSynthSound(650, 'sine', 0.15);
    setCallStatus('connected');
    if (onAcceptCall) {
      onAcceptCall();
    }
  };

  // Handle Reject / End
  const handleEnd = () => {
    playSynthSound(220, 'sawtooth', 0.25);
    setCallStatus('ended');
    setTimeout(() => {
      onEndCall();
    }, 500);
  };

  const contactAvatar = activeCall.contactAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const activeBgObj = VIRTUAL_BACKGROUNDS.find(b => b.id === selectedBackground);
  const activeFilterObj = COSMIC_FILTERS.find(f => f.id === selectedFilter);

  // Status Badge Label Generator
  const getStatusLabel = () => {
    switch (callStatus) {
      case 'calling':
        return isAr ? 'جاري الاتصال بالعقدة...' : 'Connecting virtual channel...';
      case 'ringing':
        return isAr ? 'يرن الآن...' : 'Ringing...';
      case 'connecting':
        return isAr ? 'جاري تهيئة التشفير الكوانتم...' : 'Establishing quantum link...';
      case 'connected':
        return formatTime(duration);
      case 'reconnecting':
        return isAr ? 'جاري إعادة الاتصال ⚠️' : 'Reconnecting ⚠️';
      case 'poor_connection':
        return isAr ? 'اتصال ضعيف (جاري التبديل إلى SD)' : 'Poor connection (fallback to SD)';
      case 'ended':
        return isAr ? 'تم إنهاء المكالمة' : 'Call ended';
      case 'missed':
        return isAr ? 'مكالمة فائتة' : 'Missed call';
      default:
        return formatTime(duration);
    }
  };

  // =========================================================================
  // 1. INCOMING VIDEO / VOICE CALL SCREEN
  // =========================================================================
  if (isIncoming && callStatus === 'incoming') {
    return (
      <div 
        id="lodavia-incoming-call-screen"
        className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 sm:p-10 bg-[#02040A] text-white overflow-hidden select-none font-sans"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Ambient Cosmic Orbs & Space Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

        {/* Ambient Stars Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Top Header Capsule */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 flex flex-col items-center gap-2 relative z-10"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {callType === 'video' 
                ? (isAr ? 'مكالمة فيديو واردة 📹' : 'Incoming Video Call 📹')
                : (isAr ? 'مكالمة صوتية واردة 🎙️' : 'Incoming Voice Call 🎙️')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'تشفير كوانتم كامل E2EE' : 'End-to-End Encrypted E2EE'}</span>
          </div>
        </motion.div>

        {/* Center Calling Avatar with LODAVIA Multi-layered Cosmic Ring */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18 }}
          className="flex flex-col items-center justify-center my-auto relative z-10 gap-5"
        >
          {/* Animated Pulsating Glowing Rings */}
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-500/20 to-pink-500/25"
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute -inset-4 rounded-full bg-gradient-to-br from-purple-600/20 via-cyan-500/20 to-pink-600/20"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: 'easeInOut' }}
            />
            
            {/* Outer Cosmic Gradient Border */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-sky-500 to-purple-600 shadow-[0_0_50px_rgba(6,182,212,0.45)] relative z-10">
              <img 
                src={contactAvatar} 
                alt={activeCall.contactName}
                className="w-full h-full rounded-full object-cover border-2 border-black/80 shadow-inner" 
              />
            </div>

            {/* Type Indicator Badge */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 p-2.5 rounded-full bg-slate-950 border border-cyan-400/60 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              {callType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            </div>
          </div>

          {/* Contact Details */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {activeCall.contactName}
            </h2>
            
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[11px] font-bold">
                {activeCall.contactBadge || (isAr ? '🪐 رائد كوني • مستوى 42' : '🪐 Cosmic Voyager • Lv.42')}
              </span>
              <span className="text-xs text-cyan-300 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {isAr ? 'يرن الآن...' : 'Ringing...'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Actions Bar (Accept / Decline / Quick Reply) */}
        <div className="w-full max-w-md flex flex-col items-center gap-5 relative z-10 mb-4 sm:mb-6">
          {/* Quick Message Reply Button */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setShowQuickReplies(!showQuickReplies);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 cursor-pointer shadow-lg"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'الرد برسالة سريعة 💬' : 'Reply with quick message 💬'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickReplies ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Reply Drawer Sheet */}
          <AnimatePresence>
            {showQuickReplies && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full rounded-2xl bg-[#080b18]/95 border border-white/15 p-3.5 flex flex-col gap-2 backdrop-blur-2xl shadow-2xl"
              >
                <div className="text-[11px] font-bold text-slate-400 px-2 pb-1 border-b border-white/10">
                  {isAr ? 'اختر رسالة لإرسالها مع إنهاء المكالمة:' : 'Select a message to send and decline:'}
                </div>
                {(isAr ? QUICK_RESPONSES.ar : QUICK_RESPONSES.en).map((resp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuickReply(resp)}
                    className="text-start px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-xs text-white border border-transparent hover:border-cyan-400/30 transition-all active:scale-98 cursor-pointer"
                  >
                    {resp}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Large Accept & Decline Touch Targets */}
          <div className="flex items-center justify-around w-full px-6">
            {/* Decline Button (Red) */}
            <div className="flex flex-col items-center gap-2">
              <button
                id="btn-decline-call"
                onClick={handleEnd}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(225,29,72,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-400/40"
                title={isAr ? 'رفض المكالمة' : 'Decline Call'}
              >
                <Phone className="w-8 h-8 rotate-[135deg]" />
              </button>
              <span className="text-xs font-bold text-slate-300">
                {isAr ? 'رفض' : 'Decline'}
              </span>
            </div>

            {/* Accept Button (Cyan / Emerald with pulse) */}
            <div className="flex flex-col items-center gap-2">
              <button
                id="btn-accept-call"
                onClick={handleAccept}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-300/60 animate-pulse"
                title={isAr ? 'قبول المكالمة' : 'Accept Call'}
              >
                {callType === 'video' ? <Video className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
              </button>
              <span className="text-xs font-bold text-cyan-300">
                {isAr ? 'قبول' : 'Accept'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. & 3. ACTIVE VIDEO / VOICE CALL SCREEN
  // =========================================================================
  return (
    <div 
      id="lodavia-active-call-modal"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#02040A] text-white overflow-hidden select-none font-sans"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ----------------- BACKGROUND / VIDEO / VOICE STAGE ----------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        {callType === 'video' && !isVideoOff ? (
          <div className="relative w-full h-full">
            {/* Main Remote Video Stream Simulation */}
            <img 
              src={activeBgObj && activeBgObj.preview ? activeBgObj.preview : contactAvatar} 
              alt={activeCall.contactName}
              className={`w-full h-full object-cover ${activeFilterObj?.filterClass || ''} transition-all duration-500 filter brightness-95`}
            />
            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-[#02040A]/85 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,4,10,0.6)_100%)] pointer-events-none" />
          </div>
        ) : (
          /* Voice Call Stage: Serene Cosmic Backdrop with Orbiting Equalizer Rings */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#060b1e] via-[#040714] to-[#02040A]">
            {/* Cosmic Ambient Blur Glows */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

            {/* Central Animated Voice Avatar */}
            <div className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 my-auto">
              {/* Dynamic Sound Wave Rings */}
              {!isMuted && (
                <>
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-cyan-500/20 border border-cyan-400/40"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.75, 0, 0.75] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                  <motion.div 
                    className="absolute -inset-6 rounded-full bg-purple-500/20 border border-purple-400/40"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.65, 0, 0.65] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeInOut' }}
                  />
                </>
              )}

              {/* Central Glowing Avatar */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-sky-500 to-purple-600 shadow-[0_0_50px_rgba(6,182,212,0.35)] relative z-10">
                <img 
                  src={contactAvatar} 
                  alt={activeCall.contactName}
                  className="w-full h-full rounded-full object-cover border-2 border-black/80" 
                />
              </div>
            </div>

            {/* Contact Name & Voice Call Status in Center */}
            <div className="text-center z-10 mb-4 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeCall.contactName}</h2>
              <p className="text-xs text-purple-300 font-bold">
                {activeCall.contactBadge || (isAr ? '🪐 رائد كوني • مستوى 42' : '🪐 Cosmic Voyager • Lv.42')}
              </p>
            </div>

            {/* Live Audio Visualizer Equalizer Waves */}
            <div className="flex items-end justify-center gap-1.5 h-12 mb-6 z-10">
              {audioLevels.map((lvl, idx) => (
                <motion.div
                  key={idx}
                  className={`w-1.5 rounded-full ${isMuted ? 'bg-slate-600 h-2' : 'bg-gradient-to-t from-cyan-500 via-sky-400 to-purple-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                  animate={{ height: isMuted ? 4 : `${lvl}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------- TOP FLOATING CAPSULE BAR ----------------- */}
      <div className="relative z-20 w-full p-4 sm:p-6 flex items-center justify-between">
        {/* Contact Info & Duration Pill */}
        <div className="flex items-center gap-3 bg-[#060814]/85 border border-white/15 px-3.5 sm:px-4 py-2 rounded-2xl backdrop-blur-2xl shadow-xl">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-400/40">
            <img src={contactAvatar} alt="" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white">{activeCall.contactName}</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-400/30">
                {callType === 'video' ? '4K HDR' : 'HD VOICE'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {getStatusLabel()}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>{isAr ? 'مشفر' : 'E2EE'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right / Utility Badges & Chat Toggle */}
        <div className="flex items-center gap-2">
          {/* Recording active badge */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono animate-pulse backdrop-blur-md">
              <Disc className="w-3.5 h-3.5 text-rose-500 animate-spin" />
              <span>REC {formatTime(duration)}</span>
            </div>
          )}

          {/* Network Signal Bar */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#060814]/85 border border-white/10 text-[11px] font-mono text-cyan-300 backdrop-blur-2xl">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>60 FPS • 18ms</span>
          </div>

          {/* In-Call Chat Drawer Toggle */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setShowChatDrawer(!showChatDrawer);
            }}
            className={`p-2.5 rounded-xl border backdrop-blur-2xl transition-all cursor-pointer ${
              showChatDrawer 
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                : 'bg-[#060814]/85 text-white border-white/15 hover:bg-white/10'
            }`}
            title={isAr ? 'محادثة أثناء المكالمة' : 'In-call Chat'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ----------------- FLOATING SELF PREVIEW (PiP) ----------------- */}
      {callType === 'video' && !isVideoOff && (
        <motion.div
          drag
          dragConstraints={{ left: -120, right: 120, top: -150, bottom: 150 }}
          className={`absolute top-20 ${isAr ? 'left-4' : 'right-4'} z-30 ${
            isPipMinimized ? 'w-20 h-28' : 'w-32 h-44 sm:w-40 sm:h-52'
          } rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-950 shadow-[0_0_30px_rgba(0,0,0,0.85)] cursor-grab active:cursor-grabbing backdrop-blur-xl transition-all duration-300`}
        >
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'} 
            alt="My Camera"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-mono font-bold text-cyan-300 border border-white/15">
            {isAr ? 'أنت' : 'You'}
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <button
              onClick={() => {
                playSynthSound(600, 'sine', 0.05);
                setIsFrontCamera(!isFrontCamera);
              }}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
              title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
            >
              <SwitchCamera className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ----------------- IN-CALL FLOATING REACTIONS CANVAS ----------------- */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingReactions.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, y: '80vh', x: `${r.x}vw`, scale: 0.8 }}
            animate={{ opacity: 0, y: '15vh', scale: 1.8 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          >
            {r.emoji}
          </motion.div>
        ))}
      </div>

      {/* ----------------- IN-CALL CHAT DRAWER ----------------- */}
      <AnimatePresence>
        {showChatDrawer && (
          <motion.div
            initial={{ opacity: 0, x: isAr ? -300 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? -300 : 300 }}
            className={`absolute top-20 ${isAr ? 'left-4' : 'right-4'} bottom-28 z-40 w-72 sm:w-80 rounded-3xl bg-[#060814]/95 border border-cyan-400/30 backdrop-blur-3xl shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                {isAr ? 'محادثة أثناء الاتصال' : 'In-Call Chat'}
              </span>
              <button 
                onClick={() => setShowChatDrawer(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {chatMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5">{msg.senderName}</span>
                  <div className={`px-3 py-1.5 rounded-2xl text-xs max-w-[85%] ${
                    msg.senderId === 'me' 
                      ? 'bg-cyan-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-2 border-t border-white/10 bg-slate-900/60 flex items-center gap-1.5">
              <input 
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button 
                type="submit"
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- BOTTOM FLOATING GLASSMORPHIC CONTROL BAR ----------------- */}
      <div className="relative z-30 w-full p-4 sm:p-6 flex flex-col items-center gap-3">
        {/* Floating Quick Reaction Emojis Ribbon */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#060814]/85 border border-white/10 backdrop-blur-2xl shadow-xl">
          {['💖', '🪐', '🚀', '🔥', '👏', '✨'].map(emoji => (
            <button
              key={emoji}
              onClick={() => triggerReaction(emoji)}
              className="text-lg hover:scale-130 active:scale-90 transition-transform cursor-pointer"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Main Floating Action Pill */}
        <div className="flex items-center gap-3 sm:gap-5 px-5 sm:px-8 py-3.5 rounded-3xl bg-[#060814]/90 border border-white/15 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {/* Mute Mic Button */}
          <button
            id="btn-call-mute"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setIsMuted(!isMuted);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
              isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isMuted ? (isAr ? 'إلغاء كتم الميكروفون' : 'Unmute Mic') : (isAr ? 'كتم الميكروفون' : 'Mute Mic')}
          >
            {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Toggle Video/Camera Button */}
          <button
            id="btn-call-video"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setIsVideoOff(!isVideoOff);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
              isVideoOff 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isVideoOff ? (isAr ? 'تشغيل الكاميرا' : 'Turn Camera On') : (isAr ? 'إيقاف الكاميرا' : 'Turn Camera Off')}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Switch Video / Voice Call Type */}
          <button
            onClick={handleToggleCallType}
            className="hidden sm:flex p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/10 transition-all cursor-pointer"
            title={callType === 'video' ? (isAr ? 'التحويل لمكالمة صوتية' : 'Switch to Voice') : (isAr ? 'التحويل لمكالمة فيديو' : 'Switch to Video')}
          >
            {callType === 'video' ? <Phone className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Speaker / Headphone toggle for voice mode */}
          {callType === 'voice' && (
            <button
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setIsSpeakerOn(!isSpeakerOn);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
                isSpeakerOn 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                  : 'bg-white/10 text-slate-300 border border-white/10'
              }`}
              title={isSpeakerOn ? (isAr ? 'مكبر الصوت الخارجي' : 'Speakerphone') : (isAr ? 'سماعة الهاتف' : 'Earpiece')}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          )}

          {/* Flip Camera */}
          {callType === 'video' && !isVideoOff && (
            <button
              onClick={() => {
                playSynthSound(550, 'sine', 0.05);
                setIsFrontCamera(!isFrontCamera);
              }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
              title={isAr ? 'قلب الكاميرا (أمامية/خلفية)' : 'Flip Camera'}
            >
              <SwitchCamera className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            </button>
          )}

          {/* More Options Sheet Trigger (...) */}
          <button
            id="btn-call-more"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setShowMoreSheet(true);
            }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
            title={isAr ? 'المزيد من الخيارات' : 'More Options'}
          >
            <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* RED END CALL BUTTON */}
          <button
            id="btn-call-end"
            onClick={handleEnd}
            className="p-3.5 sm:p-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black flex items-center gap-2 shadow-[0_0_30px_rgba(225,29,72,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-400/40"
            title={isAr ? 'إنهاء المكالمة' : 'End Call'}
          >
            <Phone className="w-5 h-5 sm:w-6 sm:h-6 rotate-[135deg]" />
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              {isAr ? 'إنهاء' : 'End'}
            </span>
          </button>
        </div>
      </div>

      {/* ----------------- 4. MORE OPTIONS BOTTOM SHEET ----------------- */}
      <AnimatePresence>
        {showMoreSheet && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#060814]/95 border border-white/15 p-6 backdrop-blur-3xl shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 shadow-md">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {isAr ? 'خيارات واستوديو المكالمة' : 'Call Studio & Options'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'مؤثرات، فلاتر AR، عزل الضوضاء، ومشاركة الشاشة' : 'AR filters, screen share & AI audio'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowMoreSheet(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Features with Large Touch Targets */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Screen Share */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setIsScreenSharing(!isScreenSharing);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                    isScreenSharing 
                      ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Share2 className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold">{isAr ? 'مشاركة الشاشة' : 'Share Screen'}</span>
                  <span className="text-[10px] text-slate-400">{isScreenSharing ? (isAr ? 'جاري البث' : 'Broadcasting') : (isAr ? 'غير مفعل' : 'Disabled')}</span>
                </button>

                {/* 2. Call Recording */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setIsRecording(!isRecording);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-500/20 border-rose-400/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Disc className="w-6 h-6 text-rose-400" />
                  <span className="text-xs font-bold">{isAr ? 'تسجيل المكالمة' : 'Record Call'}</span>
                  <span className="text-[10px] text-slate-400">{isRecording ? (isAr ? 'جاري التسجيل...' : 'Recording...') : (isAr ? 'حفظ سحابي' : 'Cloud Archive')}</span>
                </button>

                {/* 3. AR Filters Sheet Trigger */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowFiltersTab(!showFiltersTab);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                    showFiltersTab 
                      ? 'bg-purple-500/20 border-purple-400/60 text-purple-300' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Wand2 className="w-6 h-6 text-purple-400" />
                  <span className="text-xs font-bold">{isAr ? 'فلاتر كوزميك AR' : 'Cosmic AR Filters'}</span>
                  <span className="text-[10px] text-slate-400">{activeFilterObj?.nameAr || 'طبيعي'}</span>
                </button>

                {/* 4. Virtual Backgrounds Trigger */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowBackgroundsTab(!showBackgroundsTab);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all cursor-pointer ${
                    showBackgroundsTab 
                      ? 'bg-pink-500/20 border-pink-400/60 text-pink-300' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <ImageIcon className="w-6 h-6 text-pink-400" />
                  <span className="text-xs font-bold">{isAr ? 'الخلفيات الافتراضية' : 'Virtual Backdrops'}</span>
                  <span className="text-[10px] text-slate-400">{activeBgObj?.nameAr || 'افتراضي'}</span>
                </button>
              </div>

              {/* AR Filters Selector Sub-Panel */}
              {showFiltersTab && (
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-purple-300">
                    {isAr ? 'اختر فلتر الوجه التفاعلي:' : 'Select AR Face Filter:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {COSMIC_FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          playSynthSound(500, 'sine', 0.04);
                          setSelectedFilter(f.id);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                          selectedFilter === f.id 
                            ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-base">{f.icon}</span>
                        <span className="text-[11px]">{isAr ? f.nameAr : f.nameEn}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Virtual Backgrounds Selector Sub-Panel */}
              {showBackgroundsTab && (
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-pink-500/30 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-pink-300">
                    {isAr ? 'اختر خلفية كوانتم ثلاثية الأبعاد:' : 'Select Virtual Background:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {VIRTUAL_BACKGROUNDS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          playSynthSound(500, 'sine', 0.04);
                          setSelectedBackground(b.id);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                          selectedBackground === b.id 
                            ? 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.4)]' 
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {b.preview ? (
                          <img src={b.preview} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-sm">🌌</div>
                        )}
                        <span className="truncate">{isAr ? b.nameAr : b.nameEn}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Neural Noise Suppression Switch */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isAr ? 'عزل الضوضاء بالذكاء الاصطناعي' : 'AI Noise Cancellation'}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {isAr ? 'تصفية الأصوات المحيطة والرياح' : 'Deep Neural Background Filter'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setIsNoiseSuppression(!isNoiseSuppression);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isNoiseSuppression ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isNoiseSuppression ? (isAr ? '-translate-x-7' : 'translate-x-7') : (isAr ? '-translate-x-1' : 'translate-x-1')
                  }`} />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowMoreSheet(false)}
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer active:scale-98"
              >
                {isAr ? 'تم والعودة للمكالمة' : 'Done & Return'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
