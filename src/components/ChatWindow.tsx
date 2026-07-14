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
  ShieldCheck
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';
import { playSynthSound } from '../utils/synth';

// Helper to check if two times are close (within 2 minutes)
function isTimeClose(m1: ChatMessage, m2: ChatMessage) {
  if (!m1 || !m2) return false;
  // We can simulate or parse simple times or just allow stacking if senderId is the same
  return m1.senderId === m2.senderId;
}

// Helper to format date headers
function getDateHeader(timestamp: string, lang: 'ar' | 'en') {
  // Let's use simple logic or return standard headers
  if (timestamp.includes('AM') || timestamp.includes('PM') || timestamp.includes(':')) {
    return lang === 'ar' ? 'اليوم' : 'Today';
  }
  return timestamp;
}

interface ChatWindowProps {
  conversation: ChatConversation | null;
  currentUser: any;
  lang: 'ar' | 'en';
  onSendMessage: (text: string, type?: 'text' | 'image' | 'video' | 'file' | 'audio', options?: any) => void;
  onUpdateMessages: (chatId: string, messages: ChatMessage[]) => Promise<void>;
  onBack: () => void;
  playSynthSound: any;
  isTyping?: boolean;
}

export function ChatWindow({
  conversation,
  currentUser,
  lang,
  onSendMessage,
  onUpdateMessages,
  onBack,
  playSynthSound,
  isTyping = false
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
      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-8 h-full" id="empty-chat-state">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Sparkles className="w-16 h-16 text-cyan-500/20 mb-4" />
        </motion.div>
        <h3 className="text-sm font-bold text-slate-300 font-sans mb-1">
          {lang === 'ar' ? 'سحابة المحادثة الكونية' : 'Unified Space Stream'}
        </h3>
        <p className="text-[11px] text-slate-500 max-w-xs font-mono">
          {lang === 'ar' 
            ? 'قم بتحديد قناة أو جهة اتصال للبدء في تدوير حوار فائق الحماية والتفاعل.' 
            : 'Select an active secure communication link from your explorer deck to sync details.'}
        </p>
      </div>
    );
  }

  const messages = conversation.messages || [];

  // Simulate pull to refresh (loading older archives)
  const handlePullToRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    playSynthSound(523.25, 'triangle', 0.2);
    setTimeout(() => {
      setRefreshing(false);
      playSynthSound(1046.50, 'sine', 0.1);
      // Simulate injecting some historical chat log
      const oldMessage: ChatMessage = {
        id: `old_${Date.now()}`,
        senderId: 'them',
        text: lang === 'ar' 
          ? 'تنبيه: تم مزامنة الأرشيف التاريخي لمكالماتنا الصوتية المشفرة بنجاح 🔒' 
          : 'Log: Encrypted communication history archived securely 🔒',
        type: 'text',
        timestamp: '09:00 AM',
        status: 'read'
      };
      onUpdateMessages(conversation.id, [oldMessage, ...messages]);
    }, 1500);
  };

  const handleSimulateCall = (type: 'voice' | 'video') => {
    playSynthSound(523.25, 'sine', 0.25);
    alert(
      lang === 'ar' 
        ? `جاري بدء اتصال كوني ${type === 'voice' ? 'صوتي 🎙️' : 'مرئي 📹'} آمن بـ ${conversation.contactName}...` 
        : `Establishing highly secure ${type} uplink with ${conversation.contactName}...`
    );
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
    const updated = messages.map(m => {
      if (m.id === msgId) {
        const reactions = m.reactions || {};
        const reactors = reactions[emoji] || [];
        if (reactors.includes('me')) {
          // Remove my reaction
          const filtered = reactors.filter(r => r !== 'me');
          if (filtered.length === 0) {
            const nextReactions = { ...reactions };
            delete nextReactions[emoji];
            return { ...m, reactions: nextReactions };
          }
          return { ...m, reactions: { ...reactions, [emoji]: filtered } };
        } else {
          // Add my reaction
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
    // Focus the chat input
    const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
    inputEl?.focus();
  };

  // Edit Handling
  const handleEditClick = (msg: ChatMessage) => {
    playSynthSound(587.33, 'triangle', 0.05);
    setMessageEditContext(msg);
    setMessageReplyContext(null);
    setActiveMenuId(null);
    // Put current text into the actual input field
    const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = msg.text;
      inputEl.focus();
    }
  };

  // Delete Handling
  const handleDeleteClick = async (msgId: string) => {
    playSynthSound(150, 'sawtooth', 0.1);
    const updated = messages.map(m => {
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

  // Voice note playback handling
  const toggleAudio = (msgId: string) => {
    const isPlaying = audioPlayback[msgId];
    setAudioPlayback({ ...audioPlayback, [msgId]: !isPlaying });
    if (!isPlaying) {
      playSynthSound(440, 'sine', 0.1);
      // Simulate playback finish after duration
      setTimeout(() => {
        setAudioPlayback(prev => ({ ...prev, [msgId]: false }));
      }, 4000); // Simulated time
    } else {
      playSynthSound(300, 'sine', 0.1);
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

  return (
    <div className="flex flex-col h-full relative" id="chat-window-pane">
      
      {/* Contact Top Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 active:scale-95 transition-all mr-1"
            title="Back to conversation list"
          >
            ←
          </button>
          <div className="relative">
            <img 
              src={conversation.contactAvatar} 
              alt={conversation.contactName} 
              className="w-10 h-10 rounded-full object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            {conversation.isOnline ? (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#07070a] shadow-[0_0_8px_#10b981]" />
            ) : (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-[#07070a]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white font-sans">{conversation.contactName}</span>
              {(conversation.contactName.includes('سارة') || conversation.contactName.includes('يوسف') || conversation.contactName.includes('Sarah')) && (
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" style={{ fillOpacity: 0.15 }} />
              )}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              {isTyping ? (
                <span className="text-cyan-400 font-bold animate-pulse">{lang === 'ar' ? 'يكتب الآن...' : 'Typing...'}</span>
              ) : conversation.isOnline ? (
                <span className="text-emerald-400">{lang === 'ar' ? 'متصل بالشبكة' : 'Secure Uplink Online'}</span>
              ) : (
                <span className="text-slate-500">{lang === 'ar' ? 'غير متصل' : 'Offline'}</span>
              )}
            </span>
          </div>
        </div>

        {/* Media Call simulation Actions */}
        <div className="flex items-center gap-2">
          {networkError ? (
            <button 
              onClick={() => setNetworkError(false)} 
              className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-1.5 text-[10px] font-mono animate-bounce"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة اتصال' : 'Retry Node'}</span>
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleSimulateCall('voice')}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-cyan-400 active:scale-95 transition-all cursor-pointer"
                aria-label="Simulate audio call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleSimulateCall('video')}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-purple-400 active:scale-95 transition-all cursor-pointer"
                aria-label="Simulate video call"
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pull To Refresh / History load */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={handlePullToRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-[9px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-all"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{refreshing ? (lang === 'ar' ? 'جاري مزامنة التاريخ...' : 'Syncing archives...') : (lang === 'ar' ? 'سحب المزامنة' : 'Sync History')}</span>
        </button>
      </div>

      {/* Chat Messages flow scroll zone */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pt-10 flex flex-col gap-4 bg-[#08080c]/30 scrollbar-thin max-h-[calc(100vh-290px)]"
        aria-label="Message stream"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 font-mono py-16" id="empty-messages">
            <Clock className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
            <span className="text-[10px]">{lang === 'ar' ? 'لا توجد رسائل سابقة في هذا المجرى الكوني' : 'Secure chat stream cleared.'}</span>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === 'me';
            const nextMsg = messages[index + 1];
            const prevMsg = messages[index - 1];

            // Clean message grouping:
            const isStacked = prevMsg && prevMsg.senderId === msg.senderId;
            const isHighlight = highlightedMsgId === msg.id;

            return (
              <div 
                key={msg.id} 
                id={`msg-bubble-${msg.id}`}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isStacked ? 'mt-[-8px]' : 'mt-2'} transition-all duration-500`}
              >
                {/* Date separator header */}
                {!isStacked && (
                  <span className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-wider mb-2 self-center block">
                    {getDateHeader(msg.timestamp, lang)}
                  </span>
                )}

                {/* Reply preview contextual line */}
                {msg.replyToText && (
                  <button 
                    onClick={() => msg.replyToId && handleGoToReply(msg.replyToId)}
                    className="text-[9px] text-slate-400 bg-white/5 hover:bg-white/10 transition-all px-2.5 py-1 rounded-t-xl max-w-xs border border-white/5 flex items-center gap-1.5 truncate mb-[-4px] backdrop-blur-md"
                  >
                    <CornerUpLeft className="w-2.5 h-2.5 text-cyan-400" />
                    <span className="opacity-60">{lang === 'ar' ? 'رد على: ' : 'Reply: '}</span>
                    <span className="truncate max-w-[120px] italic">{msg.replyToText}</span>
                  </button>
                )}

                {/* Bubble core structure */}
                <div className="relative group flex items-center gap-2 max-w-[75%]">
                  
                  {/* Left Hover Reaction Popover for ME */}
                  {isMe && !msg.isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 flex items-center gap-1 bg-slate-900/90 border border-white/10 rounded-full px-2 py-1 absolute left-[-150px] z-10 backdrop-blur-md shadow-2xl">
                      {['❤️', '🔥', '👍', '😊'].map(emoji => (
                        <button key={emoji} onClick={() => handleReact(msg.id, emoji)} className="hover:scale-130 transition text-xs p-0.5">{emoji}</button>
                      ))}
                      <button onClick={() => handleReplyClick(msg)} title="Reply" className="p-1 text-slate-400 hover:text-cyan-400"><CornerUpLeft className="w-3 h-3" /></button>
                      <button onClick={() => handleEditClick(msg)} title="Edit inline" className="p-1 text-slate-400 hover:text-cyan-400"><Edit3 className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteClick(msg.id)} title="Delete message" className="p-1 text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                      <button onClick={() => handleCopy(msg)} title="Copy message text" className="p-1 text-slate-400 hover:text-yellow-400"><Copy className="w-3 h-3" /></button>
                    </div>
                  )}

                  {/* Avatar node (only show if not stacked) */}
                  {!isMe && !isStacked && (
                    <img 
                      src={conversation.contactAvatar} 
                      alt="" 
                      className="w-6 h-6 rounded-full object-cover border border-white/10 self-end mr-1 mb-1"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {!isMe && isStacked && <div className="w-7 h-6 shrink-0" />}

                  {/* The Chat Bubble Card */}
                  <div 
                    title={msg.fullDate || `${msg.timestamp} - Secure Node`}
                    className={`p-3 rounded-2xl text-xs flex flex-col gap-1.5 shadow-xl relative backdrop-blur-md transition-all border ${
                      isHighlight 
                        ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/30' 
                        : isMe 
                        ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-blue-500/20 text-white rounded-tr-none' 
                        : 'bg-white/5 border-white/5 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    
                    {/* Inline Image attachment player */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div 
                        onClick={() => {
                          setSelectedMediaUrl(msg.mediaUrl || null);
                          setSelectedMediaType('image');
                        }}
                        className="rounded-xl overflow-hidden border border-white/10 aspect-video w-56 relative cursor-zoom-in group/img"
                      >
                        <img src={msg.mediaUrl} alt="Cosmic link attachment" className="w-full h-full object-cover transition-all group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-[10px] font-mono text-cyan-400 bg-black/80 px-2 py-1 rounded-full">{lang === 'ar' ? 'عرض ملء الشاشة' : 'Click to zoom'}</span>
                        </div>
                      </div>
                    )}

                    {/* Inline Video player overlay */}
                    {msg.type === 'video' && msg.mediaUrl && (
                      <div 
                        onClick={() => {
                          setSelectedMediaUrl(msg.mediaUrl || null);
                          setSelectedMediaType('video');
                        }}
                        className="rounded-xl overflow-hidden border border-white/10 aspect-video w-56 relative cursor-pointer group/vid bg-black/50"
                      >
                        <video src={msg.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/80 group-hover/vid:bg-red-500 flex items-center justify-center transition-all shadow-lg shadow-red-500/20">
                            <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[8px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
                          <span>Uplink Video Clip</span>
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
                        className="flex items-center gap-3 bg-black/30 hover:bg-black/40 p-2.5 rounded-xl border border-white/5 transition-all text-left max-w-xs"
                      >
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <FileText className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <span className="text-[10px] font-bold block text-slate-100 truncate">{msg.fileName || 'lumo_secure_packet.pdf'}</span>
                          <span className="text-[8px] text-slate-400 block font-mono">{msg.fileSize || '14.2 MB'} • Document Pack</span>
                        </div>
                        <Download className="w-3.5 h-3.5 text-slate-400 hover:text-white shrink-0 ml-1" />
                      </a>
                    )}

                    {/* Voice Message wave player component */}
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleAudio(msg.id)}
                          className="w-8 h-8 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center active:scale-90 transition-all cursor-pointer hover:shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                          aria-label={audioPlayback[msg.id] ? 'Pause voice message' : 'Play voice message'}
                        >
                          {audioPlayback[msg.id] ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ps-0.5" />
                          )}
                        </button>

                        <div className="flex flex-col gap-0.5">
                          {/* Animated wave spectrum */}
                          <div className="flex gap-0.5 items-end h-5">
                            {[...Array(16)].map((_, i) => {
                              const randomH = audioPlayback[msg.id] 
                                ? Math.sin((Date.now() / 100) + i) * 12 + 14 
                                : 6;
                              return (
                                <div 
                                  key={i} 
                                  style={{ height: `${randomH}px` }}
                                  className={`w-0.5 rounded-full transition-all duration-300 ${isMe ? 'bg-white' : 'bg-cyan-400'}`} 
                                />
                              );
                            })}
                          </div>
                          
                          {/* Speed control and duration */}
                          <div className="flex justify-between items-center gap-4 text-[8px] font-mono text-slate-400">
                            <span>{msg.duration || '0:08'}</span>
                            <button 
                              onClick={() => toggleAudioSpeed(msg.id)}
                              className="px-1 py-0.2 rounded bg-white/5 hover:bg-white/10 text-cyan-400 font-bold"
                            >
                              {audioSpeeds[msg.id] || 1}x
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Text Message Content */}
                    {msg.type === 'text' && (
                      <p className="leading-relaxed whitespace-pre-line text-[11px] font-sans break-all select-text">
                        {msg.text}
                      </p>
                    )}

                    {/* Edited Badge indicator */}
                    {msg.isEdited && (
                      <span className="text-[7px] text-slate-500 font-mono italic self-end">
                        {lang === 'ar' ? '(معدلة)' : '(edited)'}
                      </span>
                    )}

                    {/* Embedded Reactions indicator below bubble */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          const hasMe = users.includes('me');
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className={`text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md border ${
                                hasMe 
                                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200' 
                                  : 'bg-black/30 border-white/5 text-slate-300'
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
                    <div className="flex justify-between items-center gap-4 mt-0.5">
                      <span className={`text-[8px] font-mono block ${isMe ? 'text-white/40' : 'text-slate-500'}`}>
                        {msg.timestamp}
                      </span>
                      {isMe && (
                        msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-600" />
                        )
                      )}
                    </div>

                  </div>

                  {/* Right Hover Reaction Popover for THEM */}
                  {!isMe && !msg.isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 flex items-center gap-1 bg-slate-900/90 border border-white/10 rounded-full px-2 py-1 absolute right-[-150px] z-10 backdrop-blur-md shadow-2xl">
                      {['❤️', '🔥', '👍', '😊'].map(emoji => (
                        <button key={emoji} onClick={() => handleReact(msg.id, emoji)} className="hover:scale-130 transition text-xs p-0.5">{emoji}</button>
                      ))}
                      <button onClick={() => handleReplyClick(msg)} title="Reply" className="p-1 text-slate-400 hover:text-cyan-400"><CornerUpLeft className="w-3 h-3" /></button>
                      <button onClick={() => handleCopy(msg)} title="Copy message text" className="p-1 text-slate-400 hover:text-yellow-400"><Copy className="w-3 h-3" /></button>
                    </div>
                  )}

                  {/* Micro Copied confirmation label */}
                  {copiedId === msg.id && (
                    <span className="absolute bottom-full mb-1 text-[8px] font-mono text-cyan-400 bg-black/90 border border-cyan-500/20 px-2 py-0.5 rounded-full animate-bounce">
                      {lang === 'ar' ? 'تم النسخ!' : 'Copied!'}
                    </span>
                  )}

                </div>
              </div>
            );
          })
        )}

        {/* Realtime Typing Indicator bouncing dots inside bubble flow */}
        {isTyping && (
          <div className="flex justify-start items-center gap-2" id="typing-indicator-flow">
            <img 
              src={conversation.contactAvatar} 
              alt="" 
              className="w-6 h-6 rounded-full object-cover border border-white/10 self-end mr-1"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 bg-white/5 border border-white/5 text-slate-300 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar indicator preview */}
      {messageReplyContext && (
        <div className="px-4 py-2 bg-purple-950/20 border-t border-purple-500/20 flex justify-between items-center text-xs text-purple-300 animate-slideUp">
          <div className="flex items-center gap-2 truncate">
            <CornerUpLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-bold shrink-0">{lang === 'ar' ? 'الرد على:' : 'Replying to:'}</span>
            <span className="truncate text-[10px] opacity-80">{messageReplyContext.text}</span>
          </div>
          <button 
            onClick={() => setMessageReplyContext(null)} 
            className="p-1 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Edit bar indicator preview */}
      {messageEditContext && (
        <div className="px-4 py-2 bg-cyan-950/20 border-t border-cyan-500/20 flex justify-between items-center text-xs text-cyan-300 animate-slideUp">
          <div className="flex items-center gap-2 truncate">
            <Edit3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-bold shrink-0">{lang === 'ar' ? 'تعديل الرسالة:' : 'Editing Message:'}</span>
            <span className="truncate text-[10px] opacity-80">{messageEditContext.text}</span>
          </div>
          <button 
            onClick={() => {
              setMessageEditContext(null);
              // Clear input field text
              const inputEl = document.querySelector('.glass-input') as HTMLInputElement;
              if (inputEl) inputEl.value = '';
            }} 
            className="p-1 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Lightbox / Media Viewer Zoom Modal Overlay */}
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
              className="absolute top-4 right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
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
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Lodavia Secure Image Receiver</span>
              <a 
                href={selectedMediaUrl} 
                download="lodavia_media" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-mono font-bold hover:bg-cyan-400"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حفظ المورد' : 'Download File'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
