import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Video, 
  CornerUpLeft, 
  Trash2, 
  Edit3, 
  Check, 
  CheckCheck, 
  FileText, 
  Play, 
  Pause, 
  X, 
  Copy, 
  Sparkles,
  RefreshCw,
  Clock,
  Mic,
  Camera,
  Download,
  Flame,
  ThumbsUp,
  Heart,
  Smile,
  AlertCircle,
  ShieldCheck,
  Sliders,
  Search,
  Settings,
  Lock,
  ChevronLeft,
  Ban,
  UserX,
  UserCheck,
  ShieldAlert,
  MoreVertical
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';
import { CallStatus } from '../types/call';
import { LodaviaChatPattern } from './LodaviaChatPattern';
import { ChatSettingsModal } from './ChatSettingsModal';
import UnifiedCallModal from './call/UnifiedCallModal';

// Helper to format date headers
function getDateHeader(timestamp: string, lang: string = 'ar') {
  if (timestamp.includes('AM') || timestamp.includes('PM') || timestamp.includes(':')) {
    return lang === 'ar' ? 'اليوم' : 'Today';
  }
  return timestamp;
}

interface ChatWindowProps {
  conversation: ChatConversation | null;
  currentUser: any;
  lang: string;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'video' | 'file' | 'audio', options?: any) => void;
  onUpdateMessages: (chatId: string, messages: ChatMessage[]) => Promise<void>;
  onBack: () => void;
  playSynthSound: any;
  isTyping?: boolean;
  onToggleBlockUser?: (chatId: string, isBlocked: boolean) => void;
}

export function ChatWindow({
  conversation,
  currentUser,
  lang,
  onSendMessage,
  onUpdateMessages,
  onBack,
  playSynthSound,
  isTyping = false,
  onToggleBlockUser
}: ChatWindowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const [audioSpeeds, setAudioSpeeds] = useState<{ [msgId: string]: number }>({});
  const [audioPlayback, setAudioPlayback] = useState<{ [msgId: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [messageReplyContext, setMessageReplyContext] = useState<ChatMessage | null>(null);
  const [messageEditContext, setMessageEditContext] = useState<ChatMessage | null>(null);
  const [blockedCallNotice, setBlockedCallNotice] = useState<string | null>(null);

  // Chat Settings Modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [wallpaperStyle, setWallpaperStyle] = useState<'doodle' | 'grid' | 'nebula' | 'plain'>('doodle');
  const [wallpaperOpacity, setWallpaperOpacity] = useState(0.09);
  const [accentColor, setAccentColor] = useState('#06b6d4');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // In-chat Search State
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on loaded conversations
  useEffect(() => {
    scrollToBottom('smooth');
  }, [conversation?.id, conversation?.messages?.length, isTyping]);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 100);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 h-full bg-[#f8fafc] dark:bg-[#090d16]" id="empty-chat-state">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Sparkles className="w-16 h-16 text-sky-600/30 dark:text-cyan-400/30 mb-4" />
        </motion.div>
        <h3 className="text-sm font-bold text-[#111827] dark:text-slate-200 mb-1">
          {lang === 'ar' ? 'سحابة المحادثة الكونية لودافيا' : 'Unified Lodavia Space Stream'}
        </h3>
        <p className="text-[11px] text-[#475569] dark:text-slate-400 max-w-xs leading-relaxed">
          {lang === 'ar' 
            ? 'حدد محادثة من القائمة للبدء في تدوير حوار فائق الحماية والتفاعل مع الخلفيات والإعدادات.' 
            : 'Select an active secure communication link from your explorer deck to sync details.'}
        </p>
      </div>
    );
  }

  const rawMessages = conversation.messages || [];

  // Filter messages if search active
  const messages = searchQuery.trim()
    ? rawMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : rawMessages;

  // Simulate pull to refresh (loading older archives)
  const handlePullToRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    playSynthSound(523.25, 'triangle', 0.2);
    setTimeout(() => {
      setRefreshing(false);
      playSynthSound(1046.50, 'sine', 0.1);
      const oldMessage: ChatMessage = {
        id: `old_${Date.now()}`,
        senderId: 'them',
        text: lang === 'ar' 
          ? 'تنبيه: تم مزامنة الأرشيف التاريخي لمكالماتنا المشفرة بنجاح 🔒' 
          : 'Log: Encrypted communication history archived securely 🔒',
        type: 'text',
        timestamp: '09:00 AM',
        status: 'read'
      };
      onUpdateMessages(conversation.id, [oldMessage, ...rawMessages]);
    }, 1500);
  };

  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    status: CallStatus;
    isIncoming?: boolean;
  } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [audioProgress, setAudioProgress] = useState<{ [msgId: string]: number }>({});

  // Active call duration ticker
  useEffect(() => {
    let timer: any;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const handleStartCall = (type: 'voice' | 'video') => {
    if (conversation?.isBlocked) {
      playSynthSound(200, 'sawtooth', 0.2);
      setBlockedCallNotice(
        lang === 'ar'
          ? `لا يمكن بدء المكالمة لأن المستخدم "${conversation.contactName}" محظور حالياً ⛔`
          : `Cannot start call because "${conversation.contactName}" is blocked ⛔`
      );
      setTimeout(() => setBlockedCallNotice(null), 4000);
      return;
    }
    setActiveCall({
      type,
      status: 'calling',
      isIncoming: false
    });
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleSimulateIncomingCall = (type: 'voice' | 'video' = 'voice') => {
    setActiveCall({
      type,
      status: 'incoming',
      isIncoming: true
    });
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleAcceptCall = () => {
    playSynthSound(650, 'sine', 0.12);
    setActiveCall(prev => prev ? { ...prev, status: 'connected', isIncoming: false } : null);
  };

  const handleRejectCall = () => {
    handleEndCall();
  };

  const handleEndCall = () => {
    playSynthSound(220, 'sawtooth', 0.25);
    if (conversation && activeCall) {
      const minutes = Math.floor(callDuration / 60);
      const seconds = callDuration % 60;
      const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      const callMsg: ChatMessage = {
        id: `call_${Date.now()}`,
        senderId: activeCall.isIncoming ? 'them' : 'me',
        text: lang === 'ar' 
          ? `مكالمة ${activeCall.type === 'video' ? 'فيديو 📹' : 'صوتية 🎙️'} ${activeCall.isIncoming ? 'واردة ' : ''}انتهت (${timeStr})` 
          : `${activeCall.isIncoming ? 'Incoming ' : ''}${activeCall.type === 'video' ? 'Video' : 'Voice'} Call ended (${timeStr})`,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      onUpdateMessages(conversation.id, [...rawMessages, callMsg]);
    }
    setActiveCall(null);
  };

  // Copy to clipboard
  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    playSynthSound(880, 'sine', 0.05);
    setTimeout(() => setCopiedId(null), 2000);
    setActiveMenuId(null);
  };

  // Emoji Reactions Handling
  const handleReact = async (msgId: string, emoji: string) => {
    playSynthSound(659.25, 'sine', 0.04);
    const updated = rawMessages.map(m => {
      if (m.id === msgId) {
        const reactions = m.reactions || {};
        const reactors = reactions[emoji] || [];
        if (reactors.includes('me')) {
          const filtered = reactors.filter(r => r !== 'me');
          if (filtered.length === 0) {
            const nextReactions = { ...reactions };
            delete nextReactions[emoji];
            return { ...m, reactions: nextReactions };
          }
          return { ...m, reactions: { ...reactions, [emoji]: filtered } };
        } else {
          return { ...m, reactions: { ...reactions, [emoji]: [...reactors, 'me'] } };
        }
      }
      return m;
    });
    onUpdateMessages(conversation.id, updated);
    setActiveMenuId(null);
  };

  // Reply Handling
  const handleReplyClick = (msg: ChatMessage) => {
    playSynthSound(587.33, 'triangle', 0.05);
    setMessageReplyContext(msg);
    setMessageEditContext(null);
    setActiveMenuId(null);
    const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
    inputEl?.focus();
  };

  // Edit Handling
  const handleEditClick = (msg: ChatMessage) => {
    playSynthSound(587.33, 'triangle', 0.05);
    setMessageEditContext(msg);
    setMessageReplyContext(null);
    setActiveMenuId(null);
    const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = msg.text;
      inputEl.focus();
    }
  };

  // Delete Handling
  const handleDeleteClick = async (msgId: string) => {
    playSynthSound(150, 'sawtooth', 0.1);
    const updated = rawMessages.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          text: lang === 'ar' ? 'تم حذف هذه الرسالة 🗑️' : 'This message was deleted 🗑️',
          isDeleted: true,
          type: 'text' as const
        };
      }
      return m;
    });
    await onUpdateMessages(conversation.id, updated);
    setActiveMenuId(null);
  };

  // Clear Chat History
  const handleClearHistory = async () => {
    await onUpdateMessages(conversation.id, []);
  };

  // Scroll to referenced message
  const handleGoToReply = (replyId: string) => {
    const el = document.getElementById(`msg-bubble-${replyId}`);
    if (el) {
      setHighlightedMsgId(replyId);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playSynthSound(800, 'sine', 0.08);
      setTimeout(() => setHighlightedMsgId(null), 2000);
    }
  };

  // Voice note playback handling with real time audio synthesis interval
  const audioIntervals = useRef<{ [msgId: string]: any }>({});

  const toggleAudio = (msgId: string) => {
    const isPlaying = audioPlayback[msgId];
    if (isPlaying) {
      // Pause
      clearInterval(audioIntervals.current[msgId]);
      setAudioPlayback({ ...audioPlayback, [msgId]: false });
      playSynthSound(300, 'sine', 0.08);
    } else {
      // Play
      setAudioPlayback({ ...audioPlayback, [msgId]: true });
      playSynthSound(523.25, 'sine', 0.15);
      
      let step = audioProgress[msgId] || 0;
      audioIntervals.current[msgId] = setInterval(() => {
        step += 5;
        if (step % 20 === 0) {
          playSynthSound(600 + Math.sin(step) * 100, 'triangle', 0.1);
        }
        if (step >= 100) {
          clearInterval(audioIntervals.current[msgId]);
          setAudioPlayback(prev => ({ ...prev, [msgId]: false }));
          setAudioProgress(prev => ({ ...prev, [msgId]: 0 }));
        } else {
          setAudioProgress(prev => ({ ...prev, [msgId]: step }));
        }
      }, 200);
    }
  };

  const toggleAudioSpeed = (msgId: string) => {
    const currentSpeed = audioSpeeds[msgId] || 1;
    let nextSpeed = 1;
    if (currentSpeed === 1) nextSpeed = 1.5;
    else if (currentSpeed === 1.5) nextSpeed = 2;
    setAudioSpeeds({ ...audioSpeeds, [msgId]: nextSpeed });
    playSynthSound(600, 'sine', 0.05);
  };

  // Font class mapping
  const fontSizeClass = fontSize === 'sm' ? 'text-[11px]' : fontSize === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-col h-full relative bg-[#f1f5f9] dark:bg-[#0b1322] text-start transition-colors duration-200" id="chat-window-pane">
      
      {/* Contact Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] dark:border-white/10 flex justify-between items-center bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-[#475569] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all mr-1 cursor-pointer"
            title="Back to conversation list"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div className="relative">
            <img 
              src={conversation.contactAvatar} 
              alt={conversation.contactName} 
              className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] dark:border-white/10 shadow-sm"
              referrerPolicy="no-referrer"
            />
            {conversation.isOnline ? (
              <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#111827] shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-3 h-3 rounded-full bg-slate-400 dark:bg-white/20 border-2 border-white dark:border-[#111827]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-[#111827] dark:text-white font-sans">{conversation.contactName}</span>
              {(conversation.contactName.includes('سارة') || conversation.contactName.includes('يوسف') || conversation.contactName.includes('Sarah')) && (
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" fill="currentColor" style={{ fillOpacity: 0.15 }} />
              )}
              {conversation.isBlocked && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                  <Ban className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'محظور' : 'Blocked'}</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-slate-400 flex items-center gap-1.5 font-mono">
              {conversation.isBlocked ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">{lang === 'ar' ? 'تم حظر المستخدم' : 'Blocked contact'}</span>
              ) : isTyping ? (
                <span className="text-sky-600 dark:text-cyan-400 font-bold animate-pulse">{lang === 'ar' ? 'يكتب الآن...' : 'Typing...'}</span>
              ) : conversation.isOnline ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{lang === 'ar' ? 'متصل بالشبكة' : 'Secure Uplink Online'}</span>
              ) : (
                <span className="text-[#64748B] dark:text-slate-500">{lang === 'ar' ? 'غير متصل' : 'Offline'}</span>
              )}
            </span>
          </div>
        </div>

        {/* Media Call & Chat Settings Header Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Block / Unblock Action Button */}
          {onToggleBlockUser && (
            <button
              onClick={() => {
                const nextState = !conversation.isBlocked;
                playSynthSound(nextState ? 200 : 600, 'sine', 0.1);
                onToggleBlockUser(conversation.id, nextState);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                conversation.isBlocked
                  ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                  : 'bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
              }`}
              title={conversation.isBlocked 
                ? (lang === 'ar' ? 'إلغاء حظر المستخدم' : 'Unblock Contact') 
                : (lang === 'ar' ? 'حظر هذا المستخدم' : 'Block Contact')}
            >
              {conversation.isBlocked ? (
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <UserX className="w-4 h-4" />
              )}
            </button>
          )}

          {/* In-Chat Search Toggle Button */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setShowInChatSearch(!showInChatSearch);
            }}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              showInChatSearch
                ? 'bg-sky-50 dark:bg-cyan-500/20 border-sky-400 dark:border-cyan-400/40 text-sky-700 dark:text-cyan-300'
                : 'bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
            title={lang === 'ar' ? 'بحث في المحادثة' : 'Search in chat'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Voice Call */}
          <button 
            onClick={() => handleStartCall('voice')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              conversation.isBlocked 
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-slate-400' 
                : 'bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-sky-600 dark:text-cyan-400 active:scale-95'
            }`}
            aria-label="Start audio call"
            title={conversation.isBlocked ? (lang === 'ar' ? 'المستخدم محظور (المكالمات معطلة)' : 'Contact is blocked') : (lang === 'ar' ? 'اتصال صوتي' : 'Audio Call')}
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Video Call */}
          <button 
            onClick={() => handleStartCall('video')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              conversation.isBlocked 
                ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-slate-400' 
                : 'bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-sky-600 dark:text-cyan-400 active:scale-95'
            }`}
            aria-label="Start video call"
            title={conversation.isBlocked ? (lang === 'ar' ? 'المستخدم محظور (المكالمات معطلة)' : 'Contact is blocked') : (lang === 'ar' ? 'اتصال فيديو' : 'Video Call')}
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Chat Settings & Options Trigger (Three Dots / More) */}
          <button 
            id="btn-chat-options-dots"
            onClick={() => {
              playSynthSound(600, 'sine', 0.08);
              setShowSettingsModal(true);
            }}
            className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-sky-600 dark:text-cyan-400 active:scale-95 transition-all cursor-pointer"
            title={lang === 'ar' ? 'خيارات وإعدادات المحادثة (•••)' : 'Chat Settings & Options (•••)'}
            aria-label="Chat Settings and Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Blocked call attempt notice */}
      {blockedCallNotice && (
        <div className="p-3 px-4 bg-rose-600 text-white text-xs font-bold flex items-center justify-between animate-slideDown z-30 shadow-md">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0" />
            <span>{blockedCallNotice}</span>
          </div>
          <button 
            onClick={() => setBlockedCallNotice(null)}
            className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* In-chat search bar overlay */}
      {showInChatSearch && (
        <div className="p-2.5 px-4 bg-slate-100 dark:bg-[#131d2e] border-b border-[#E2E8F0] dark:border-white/10 flex items-center gap-2 animate-[slideDown_0.2s_ease-out] z-10">
          <Search className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث عن كلمة في الرسائل...' : 'Filter chat text...'}
            className="flex-1 bg-transparent border-none text-xs text-[#111827] dark:text-white focus:outline-none font-sans"
            autoFocus
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-[#475569] dark:text-slate-400 font-mono hover:text-red-500"
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>
          )}
          <button 
            onClick={() => {
              setShowInChatSearch(false);
              setSearchQuery('');
            }}
            className="p-1 text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pull To Refresh / History load */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 mt-2">
        <button
          onClick={handlePullToRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#111827]/90 border border-[#E2E8F0] dark:border-white/10 text-[10px] font-mono text-[#475569] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-sky-600 dark:text-cyan-400' : ''}`} />
          <span>{refreshing ? (lang === 'ar' ? 'جاري مزامنة التاريخ...' : 'Syncing archives...') : (lang === 'ar' ? 'سحب المزامنة' : 'Sync History')}</span>
        </button>
      </div>

      {/* WhatsApp-Style Lodavia Cosmic Doodle Wallpaper Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <LodaviaChatPattern patternStyle={wallpaperStyle} opacity={wallpaperOpacity} />
      </div>

      {/* Chat Messages Flow Zone */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-5 pt-12 flex flex-col gap-3.5 scrollbar-thin max-h-[calc(100vh-270px)] z-10"
        aria-label="Message stream"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#64748B] dark:text-slate-400 font-mono py-16" id="empty-messages">
            <Clock className="w-8 h-8 text-sky-600/40 dark:text-cyan-400/40 mb-2 animate-pulse" />
            <span className="text-xs font-sans text-center">
              {searchQuery 
                ? (lang === 'ar' ? 'لم يتم العثور على نتائج للبحث' : 'No matching messages found') 
                : (lang === 'ar' ? 'لا توجد رسائل سابقة في هذا الحوار الكوني' : 'Secure chat stream clear.')}
            </span>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === 'me' || msg.senderId === currentUser.id;
            const prevMsg = messages[index - 1];

            const isStacked = prevMsg && (prevMsg.senderId === msg.senderId);
            const isHighlight = highlightedMsgId === msg.id;

            return (
              <div 
                key={msg.id} 
                id={`msg-bubble-${msg.id}`}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isStacked ? 'mt-[-4px]' : 'mt-1'} transition-all duration-300`}
              >
                {/* Date separator header */}
                {!isStacked && (
                  <span className="text-[9px] font-mono font-bold uppercase text-[#475569] dark:text-slate-400 bg-white/70 dark:bg-[#111827]/70 px-3 py-0.5 rounded-full border border-[#E2E8F0] dark:border-white/5 my-2 self-center shadow-2xs backdrop-blur-sm">
                    {getDateHeader(msg.timestamp, lang)}
                  </span>
                )}

                {/* Reply preview contextual line */}
                {msg.replyToText && (
                  <button 
                    onClick={() => msg.replyToId && handleGoToReply(msg.replyToId)}
                    className="text-[10px] text-[#475569] dark:text-slate-300 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all px-3 py-1 rounded-t-xl max-w-xs border border-[#E2E8F0] dark:border-white/10 flex items-center gap-1.5 truncate mb-[-4px] backdrop-blur-md cursor-pointer"
                  >
                    <CornerUpLeft className="w-3 h-3 text-sky-600 dark:text-cyan-400 shrink-0" />
                    <span className="opacity-70 font-semibold">{lang === 'ar' ? 'رد على: ' : 'Reply: '}</span>
                    <span className="truncate italic">{msg.replyToText}</span>
                  </button>
                )}

                {/* Bubble core structure */}
                <div className="relative group flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                  
                  {/* Left Reaction Popover for ME */}
                  {isMe && !msg.isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-[#E2E8F0] dark:border-white/10 rounded-full px-2 py-1 absolute left-[-150px] bottom-1 z-20 shadow-xl backdrop-blur-md">
                      {['❤️', '🔥', '👍', '😊'].map(emoji => (
                        <button key={emoji} onClick={() => handleReact(msg.id, emoji)} className="hover:scale-125 transition text-xs p-0.5 cursor-pointer">{emoji}</button>
                      ))}
                      <button onClick={() => handleReplyClick(msg)} title="Reply" className="p-1 text-[#475569] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-400 cursor-pointer"><CornerUpLeft className="w-3 h-3" /></button>
                      <button onClick={() => handleEditClick(msg)} title="Edit inline" className="p-1 text-[#475569] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-400 cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteClick(msg.id)} title="Delete message" className="p-1 text-[#475569] dark:text-slate-300 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                      <button onClick={() => handleCopy(msg)} title="Copy message text" className="p-1 text-[#475569] dark:text-slate-300 hover:text-amber-500 cursor-pointer"><Copy className="w-3 h-3" /></button>
                    </div>
                  )}

                  {/* Avatar node for incoming messages */}
                  {!isMe && !isStacked && (
                    <img 
                      src={conversation.contactAvatar} 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover border border-[#E2E8F0] dark:border-white/10 self-end mr-1 mb-0.5 shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {!isMe && isStacked && <div className="w-7 h-7 shrink-0" />}

                  {/* The Chat Bubble Card */}
                  <div 
                    title={msg.fullDate || `${msg.timestamp} - Secure Node`}
                    className={`p-3 sm:p-3.5 ${fontSizeClass} flex flex-col gap-1.5 shadow-sm relative transition-all border backdrop-blur-md ${
                      isHighlight 
                        ? 'ring-4 ring-amber-400 border-amber-500' 
                        : isMe 
                        ? 'bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-white border-sky-400/30 shadow-md shadow-sky-500/15 rounded-2xl rounded-ee-xs' 
                        : 'bg-white/90 dark:bg-[#162032]/90 border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 shadow-xs rounded-2xl rounded-es-xs'
                    }`}
                  >
                    
                    {/* Inline Image attachment */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div 
                        onClick={() => {
                          setSelectedMediaUrl(msg.mediaUrl || null);
                          setSelectedMediaType('image');
                        }}
                        className="rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 aspect-video w-56 relative cursor-zoom-in group/img"
                      >
                        <img src={msg.mediaUrl} alt="Attachment" className="w-full h-full object-cover transition-all group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-[10px] font-mono text-white bg-black/80 px-2 py-1 rounded-full">{lang === 'ar' ? 'عرض ملء الشاشة' : 'Click to zoom'}</span>
                        </div>
                      </div>
                    )}

                    {/* Inline Video player */}
                    {msg.type === 'video' && msg.mediaUrl && (
                      <div 
                        onClick={() => {
                          setSelectedMediaUrl(msg.mediaUrl || null);
                          setSelectedMediaType('video');
                        }}
                        className="rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 aspect-video w-56 relative cursor-pointer group/vid bg-black/50"
                      >
                        <video src={msg.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/80 group-hover/vid:bg-red-500 flex items-center justify-center transition-all shadow-lg shadow-red-500/20">
                            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[8px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
                          <span>Video Clip</span>
                          <span>{msg.duration || '0:14'}</span>
                        </div>
                      </div>
                    )}

                    {/* Document attachment card */}
                    {msg.type === 'file' && (
                      <a 
                        href={msg.mediaUrl} 
                        download={msg.fileName || 'Document'}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left max-w-xs ${
                          isMe ? 'bg-black/20 border-white/10 hover:bg-black/30' : 'bg-slate-100 dark:bg-black/30 border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-black/40'
                        }`}
                      >
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <FileText className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <span className={`text-[10px] font-bold block truncate ${isMe ? 'text-white' : 'text-[#111827] dark:text-white'}`}>{msg.fileName || 'document.pdf'}</span>
                          <span className={`text-[8px] block font-mono ${isMe ? 'text-white/80' : 'text-[#64748B] dark:text-slate-400'}`}>{msg.fileSize || '14.2 MB'} • Document</span>
                        </div>
                        <Download className={`w-3.5 h-3.5 shrink-0 ml-1 ${isMe ? 'text-white' : 'text-[#475569] dark:text-slate-300'}`} />
                      </a>
                    )}

                    {/* Voice Message wave player */}
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-3 py-1">
                        <button 
                          onClick={() => toggleAudio(msg.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md ${
                            isMe ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-sky-600 dark:bg-cyan-400 text-white dark:text-slate-950 hover:bg-sky-500'
                          }`}
                          aria-label={audioPlayback[msg.id] ? 'Pause voice' : 'Play voice'}
                        >
                          {audioPlayback[msg.id] ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ms-0.5" />
                          )}
                        </button>

                        <div className="flex flex-col gap-1 min-w-[140px]">
                          <div className="flex gap-1 items-center h-6">
                            {[...Array(18)].map((_, i) => {
                              const progPct = (i / 18) * 100;
                              const isPlayed = (audioProgress[msg.id] || 0) >= progPct;
                              const barHeight = audioPlayback[msg.id]
                                ? Math.sin((i * 1.5) + (audioProgress[msg.id] || 0)) * 8 + 14
                                : (i % 3 === 0 ? 14 : i % 2 === 0 ? 8 : 12);
                              return (
                                <div 
                                  key={i} 
                                  style={{ height: `${barHeight}px` }}
                                  className={`w-1 rounded-full transition-all duration-200 ${
                                    isPlayed 
                                      ? (isMe ? 'bg-white' : 'bg-sky-600 dark:bg-cyan-400')
                                      : (isMe ? 'bg-white/30' : 'bg-slate-300 dark:bg-white/20')
                                  }`} 
                                />
                              );
                            })}
                          </div>
                          
                          <div className={`flex justify-between items-center gap-4 text-[9px] font-mono ${isMe ? 'text-white/80' : 'text-[#64748B] dark:text-slate-400'}`}>
                            <span>
                              {audioPlayback[msg.id] 
                                ? `0:0${Math.floor(((audioProgress[msg.id] || 0) / 100) * 8)}` 
                                : (msg.duration || '0:08')}
                            </span>
                            <button 
                              onClick={() => toggleAudioSpeed(msg.id)}
                              className={`px-1.5 py-0.5 rounded-md font-bold text-[8px] cursor-pointer ${isMe ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-sky-700 dark:text-cyan-300'}`}
                            >
                              {audioSpeeds[msg.id] || 1}x
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Text Message Content */}
                    {msg.type === 'text' && (
                      <p className="leading-relaxed whitespace-pre-line font-sans break-words select-text">
                        {msg.text}
                      </p>
                    )}

                    {/* Edited Badge indicator */}
                    {msg.isEdited && (
                      <span className={`text-[8px] font-mono italic self-end ${isMe ? 'text-white/70' : 'text-[#64748B] dark:text-slate-400'}`}>
                        {lang === 'ar' ? '(معدلة)' : '(edited)'}
                      </span>
                    )}

                    {/* Embedded Reactions indicator */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          const hasMe = users.includes('me');
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className={`text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 border shadow-2xs ${
                                hasMe 
                                  ? 'bg-sky-50 dark:bg-cyan-500/30 border-sky-400 dark:border-cyan-400 text-sky-700 dark:text-cyan-300 font-bold' 
                                  : 'bg-slate-100 dark:bg-black/30 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-mono font-bold">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions and Read receipts inside bubble footer */}
                    <div className="flex justify-between items-center gap-3 mt-1 pt-0.5 select-none">
                      <span className={`text-[9px] font-mono tracking-tight ${isMe ? 'text-white/75' : 'text-slate-400 dark:text-slate-500'}`}>
                        {msg.timestamp}
                      </span>
                      {isMe && (
                        <div className="flex items-center gap-1">
                          {msg.status === 'read' ? (
                            <span title={lang === 'ar' ? 'تمت القراءة' : 'Read'}>
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-200 drop-shadow-[0_0_4px_rgba(6,182,212,0.85)] font-bold" />
                            </span>
                          ) : msg.status === 'delivered' ? (
                            <span title={lang === 'ar' ? 'تم التسليم' : 'Delivered'}>
                              <CheckCheck className="w-3.5 h-3.5 text-white/60" />
                            </span>
                          ) : (
                            <span title={lang === 'ar' ? 'تم الإرسال' : 'Sent'}>
                              <Check className="w-3.5 h-3.5 text-white/50" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Reaction Popover for THEM */}
                  {!isMe && !msg.isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-[#E2E8F0] dark:border-white/10 rounded-full px-2 py-1 absolute right-[-150px] bottom-1 z-20 shadow-xl backdrop-blur-md">
                      {['❤️', '🔥', '👍', '😊'].map(emoji => (
                        <button key={emoji} onClick={() => handleReact(msg.id, emoji)} className="hover:scale-125 transition text-xs p-0.5 cursor-pointer">{emoji}</button>
                      ))}
                      <button onClick={() => handleReplyClick(msg)} title="Reply" className="p-1 text-[#475569] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-400 cursor-pointer"><CornerUpLeft className="w-3 h-3" /></button>
                      <button onClick={() => handleCopy(msg)} title="Copy message text" className="p-1 text-[#475569] dark:text-slate-300 hover:text-amber-500 cursor-pointer"><Copy className="w-3 h-3" /></button>
                    </div>
                  )}

                  {/* Micro Copied confirmation label */}
                  {copiedId === msg.id && (
                    <span className="absolute bottom-full mb-1 text-[8px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full animate-bounce">
                      {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}
                    </span>
                  )}

                </div>
              </div>
            );
          })
        )}

        {/* Realtime Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-center gap-2 mb-2 animate-[fadeIn_0.2s_ease-out]" id="typing-indicator-flow">
            <img 
              src={conversation.contactAvatar} 
              alt="" 
              className="w-7 h-7 rounded-full object-cover border border-[#E2E8F0] dark:border-white/10 self-end mr-1 rtl:mr-0 rtl:ml-1 shadow-2xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="px-3.5 py-2.5 bg-white/90 dark:bg-[#162032]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-2xl rounded-es-xs text-xs flex gap-1.5 items-center shadow-xs">
              <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 rtl:mr-1 rtl:ml-0 ltr:ml-1 font-sans">
                {lang === 'ar' ? 'يكتب الآن...' : 'typing...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar indicator preview */}
      {messageReplyContext && (
        <div className="px-4 py-2 bg-sky-50 dark:bg-cyan-500/10 border-t border-sky-200 dark:border-cyan-500/20 flex justify-between items-center text-xs text-sky-800 dark:text-cyan-300 animate-slideUp z-10">
          <div className="flex items-center gap-2 truncate">
            <CornerUpLeft className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 shrink-0" />
            <span className="font-bold shrink-0">{lang === 'ar' ? 'الرد على:' : 'Replying to:'}</span>
            <span className="truncate text-[11px] opacity-80">{messageReplyContext.text}</span>
          </div>
          <button 
            onClick={() => setMessageReplyContext(null)} 
            className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-[#475569] dark:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Edit bar indicator preview */}
      {messageEditContext && (
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-500/10 border-t border-purple-200 dark:border-purple-500/20 flex justify-between items-center text-xs text-purple-800 dark:text-purple-300 animate-slideUp z-10">
          <div className="flex items-center gap-2 truncate">
            <Edit3 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-bold shrink-0">{lang === 'ar' ? 'تعديل الرسالة:' : 'Editing Message:'}</span>
            <span className="truncate text-[11px] opacity-80">{messageEditContext.text}</span>
          </div>
          <button 
            onClick={() => {
              setMessageEditContext(null);
              const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
              if (inputEl) inputEl.value = '';
            }} 
            className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-[#475569] dark:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Media Viewer Lightbox */}
      <AnimatePresence>
        {selectedMediaUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedMediaUrl(null)}
          >
            <button 
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
              onClick={() => setSelectedMediaUrl(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {selectedMediaType === 'image' ? (
              <img 
                src={selectedMediaUrl} 
                alt="Full size projection" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <video 
                src={selectedMediaUrl} 
                controls 
                autoPlay 
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10" 
              />
            )}

            <div className="mt-4 text-center">
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">Lodavia Media Viewer</span>
              <a 
                href={selectedMediaUrl} 
                download="lodavia_media" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-mono font-bold hover:bg-cyan-400 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حفظ المورد' : 'Download File'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified High-Fidelity Call Modal */}
      {activeCall && (
        <UnifiedCallModal
          activeCall={{
            type: activeCall.type,
            contactName: conversation.contactName,
            contactAvatar: conversation.contactAvatar,
            status: activeCall.status,
            isIncoming: activeCall.isIncoming,
            quality: 'excellent'
          }}
          currentUser={currentUser}
          lang={lang}
          onEndCall={handleEndCall}
          onAcceptCall={handleAcceptCall}
          onRejectCall={handleRejectCall}
          onSendMessageInCall={(text) => {
            const callMsg: ChatMessage = {
              id: `msg_${Date.now()}`,
              senderId: 'me',
              text: text,
              type: 'text',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            };
            onUpdateMessages(conversation.id, [...rawMessages, callMsg]);
          }}
          playSynthSound={playSynthSound}
        />
      )}

      {/* Chat Settings Modal */}
      <ChatSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        conversation={conversation}
        lang={lang}
        wallpaperStyle={wallpaperStyle}
        setWallpaperStyle={setWallpaperStyle}
        wallpaperOpacity={wallpaperOpacity}
        setWallpaperOpacity={setWallpaperOpacity}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onClearChatHistory={handleClearHistory}
        onSearchInChat={() => setShowInChatSearch(true)}
        isBlocked={conversation.isBlocked}
        onToggleBlockUser={onToggleBlockUser}
        onSimulateIncomingCall={handleSimulateIncomingCall}
        playSynthSound={playSynthSound}
      />

    </div>
  );
}
