import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Camera, 
  FolderOpen, 
  X, 
  StopCircle,
  Sparkles,
  Ban,
  UserCheck
} from 'lucide-react';
import { playSynthSound } from '../utils/synth';

interface ChatInputProps {
  lang: string;
  onSendMessage: (text: string, type: 'text' | 'image' | 'video' | 'file' | 'audio', options?: any) => void;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
  replyToText?: string;
  onClearReply?: () => void;
  editToText?: string;
  onClearEdit?: () => void;
  isBlocked?: boolean;
  onUnblock?: () => void;
}

export function ChatInput({
  lang,
  onSendMessage,
  isTyping,
  onTypingChange,
  replyToText,
  onClearReply,
  editToText,
  onClearEdit,
  isBlocked = false,
  onUnblock
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showCameraSim, setShowCameraSim] = useState(false);
  const [showGallerySim, setShowGallerySim] = useState(false);
  
  const recordTimerRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Synchronize edit text if provided
  useEffect(() => {
    if (editToText) {
      setText(editToText);
    }
  }, [editToText]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    // Typing state management
    if (!isTyping) {
      onTypingChange(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !isRecording) return;

    if (editToText) {
      onSendMessage(text, 'text', { isEdit: true });
    } else {
      onSendMessage(text, 'text');
    }
    setText('');
    onTypingChange(false);
    if (onClearReply) onClearReply();
    if (onClearEdit) onClearEdit();
  };

  const handleSendAttachment = (type: 'image' | 'video' | 'file', url: string, fileName?: string, fileSize?: string) => {
    playSynthSound(659.25, 'sine', 0.1);
    onSendMessage(fileName || '', type, { mediaUrl: url, fileName, fileSize });
    setShowAttachmentsMenu(false);
  };

  // Recording triggers
  const startRecording = () => {
    playSynthSound(400, 'sawtooth', 0.05);
    setIsRecording(true);
  };

  const stopAndSendVoice = () => {
    if (!isRecording) return;
    playSynthSound(800, 'sine', 0.1);
    setIsRecording(false);
    const durationMin = Math.floor(recordingSeconds / 60);
    const durationSec = recordingSeconds % 60;
    const formattedDuration = `${durationMin}:${durationSec < 10 ? '0' : ''}${durationSec}`;
    
    // Simulated voice recording audio payload
    onSendMessage(
      '', 
      'audio', 
      { 
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // valid public test audio sample
        duration: formattedDuration || '0:05'
      }
    );
  };

  const cancelRecording = () => {
    playSynthSound(200, 'triangle', 0.1);
    setIsRecording(false);
  };

  const [pickerTab, setPickerTab] = useState<'emojis' | 'stickers'>('emojis');

  const emojis = [
    '🌌', '✨', '🚀', '🔮', '👾', '🛡️', '👑', '🔥', '❤️', '👍', 
    '😊', '💡', '🎉', '🌟', '💻', '😂', '😍', '🥳', '💎', '🎯', 
    '⚡', '📱', '🍔', '🍕', '🎵', '🏆', '💯', '🎨', '🐱', '🤖', 
    '🎁', '💬', '🎈', '🌈', '☕', '🦄', '🌎', '💙', '👋', '👏'
  ];

  const stickers = [
    { id: 'lumo_hi', nameAr: 'لوماً مرحباً 👋', nameEn: 'Lumo Greeting 👋', emoji: '🤖', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300' },
    { id: 'nova_star', nameAr: 'نوفا الفلكية ✨', nameEn: 'Nova Cosmic ✨', emoji: '🌟', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300' },
    { id: 'rocket_boost', nameAr: 'انطلاق كوني 🚀', nameEn: 'Rocket Launch 🚀', emoji: '🚀', url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=300' },
    { id: 'heart_sparkle', nameAr: 'حب فلكي ❤️', nameEn: 'Cosmic Love ❤️', emoji: '💖', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300' },
    { id: 'super_like', nameAr: 'إعجاب فائق 🔥', nameEn: 'Super Like 🔥', emoji: '🔥', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300' },
    { id: 'space_cat', nameAr: 'قط الفضاء 🐱', nameEn: 'Space Cat 🐱', emoji: '🐱', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300' },
    { id: 'coffee_astronaut', nameAr: 'قهوة الفضاء ☕', nameEn: 'Astronaut Coffee ☕', emoji: '☕', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300' },
    { id: 'crown_king', nameAr: 'تاج الأسطورة 👑', nameEn: 'Legend Crown 👑', emoji: '👑', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300' }
  ];

  return (
    <div className="p-3 sm:p-4 border-t border-[#E2E8F0] dark:border-white/10 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md relative z-20" id="chat-input-component">
      
      {/* Blocked State Banner */}
      {isBlocked ? (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-start animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
                {lang === 'ar' ? 'تم حظر هذا المستخدم' : 'This user is blocked'}
              </p>
              <p className="text-[11px] text-[#475569] dark:text-slate-400">
                {lang === 'ar' 
                  ? 'لا يمكنك إرسال أو استقبال رسائل جديدة طالما أن الحظر مفعل.' 
                  : 'You cannot send or receive new messages while blocked.'}
              </p>
            </div>
          </div>

          {onUnblock && (
            <button
              type="button"
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                onUnblock();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إلغاء الحظر' : 'Unblock'}</span>
            </button>
          )}
        </div>
      ) : isRecording ? (
        <div className="flex items-center justify-between gap-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 p-3 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <div className="flex gap-1 items-end h-5">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 50}ms` }} 
                  className="w-0.5 bg-rose-500 rounded-full animate-bounce"
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
              {lang === 'ar' ? 'جاري تسجيل موجة الصوت...' : 'Streaming voice track...'} {recordingSeconds}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={cancelRecording}
              className="px-3 py-1.5 text-[10px] font-mono rounded-lg bg-slate-200 dark:bg-white/10 text-[#475569] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white cursor-pointer"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              onClick={stopAndSendVoice}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
              title={lang === 'ar' ? 'إرسال التسجيل' : 'Transmit Audio Signal'}
            >
              <StopCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-slate-100/85 dark:bg-[#121c2d]/85 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            
            {/* Attachment Link Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSynthSound(587.33, 'sine', 0.05);
                  setShowAttachmentsMenu(!showAttachmentsMenu);
                  setShowEmojiPicker(false);
                }}
                className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  showAttachmentsMenu 
                    ? 'bg-sky-100 dark:bg-cyan-500/25 text-sky-700 dark:text-cyan-300' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
                aria-label="Attachments menu"
                title={lang === 'ar' ? 'إرفاق وسائط أو ملفات' : 'Attach media or files'}
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Attachments dropdown panel */}
              {showAttachmentsMenu && (
                <div className="absolute bottom-14 left-0 rtl:left-auto rtl:right-0 z-30 p-2.5 rounded-2xl bg-white dark:bg-[#182232] border border-[#E2E8F0] dark:border-white/10 shadow-2xl w-52 flex flex-col gap-1 backdrop-blur-xl animate-slideUp">
                  
                  {/* Gallery */}
                  <button
                    type="button"
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setShowGallerySim(true);
                      setShowAttachmentsMenu(false);
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left rtl:text-right hover:bg-slate-100 dark:hover:bg-white/10 text-[#111827] dark:text-slate-200 text-xs font-bold transition-all w-full cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                    <span>{lang === 'ar' ? 'معرض الصور الكوني' : 'Deep Space Gallery'}</span>
                  </button>

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setShowCameraSim(true);
                      setShowAttachmentsMenu(false);
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left rtl:text-right hover:bg-slate-100 dark:hover:bg-white/10 text-[#111827] dark:text-slate-200 text-xs font-bold transition-all w-full cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                    <span>{lang === 'ar' ? 'التقاط فوري' : 'Live Aperture Lens'}</span>
                  </button>

                  {/* Document upload simulation */}
                  <button
                    type="button"
                    onClick={() => handleSendAttachment(
                      'file', 
                      'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 
                      'lodavia_protocol_document.pdf',
                      '2.4 MB'
                    )}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left rtl:text-right hover:bg-slate-100 dark:hover:bg-white/10 text-[#111827] dark:text-slate-200 text-xs font-bold transition-all w-full cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{lang === 'ar' ? 'ملف مستند (PDF)' : 'Document File (PDF)'}</span>
                  </button>

                  {/* Video attachment simulation */}
                  <button
                    type="button"
                    onClick={() => handleSendAttachment(
                      'video', 
                      'https://assets.mixkit.co/videos/preview/mixkit-nebula-of-outer-space-background-12347-large.mp4', 
                      'lodavia_video_clip.mp4'
                    )}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left rtl:text-right hover:bg-slate-100 dark:hover:bg-white/10 text-[#111827] dark:text-slate-200 text-xs font-bold transition-all w-full cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>{lang === 'ar' ? 'مقطع مرئي (MP4)' : 'Nebula Video Clip'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Emoji Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSynthSound(587.33, 'sine', 0.05);
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowAttachmentsMenu(false);
                }}
                className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  showEmojiPicker 
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
                aria-label="Emoji picker"
                title={lang === 'ar' ? 'إيموجي وملصقات' : 'Emoji & stickers'}
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Emoji & Sticker dropdown panel */}
              {showEmojiPicker && (
                <div className="absolute bottom-14 left-0 rtl:left-auto rtl:right-0 z-30 p-3 rounded-2xl bg-white dark:bg-[#182232] border border-[#E2E8F0] dark:border-white/10 shadow-2xl w-80 max-w-[90vw] backdrop-blur-xl animate-scaleIn flex flex-col gap-2.5">
                  {/* Tabs Header */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => { playSynthSound(500, 'sine', 0.04); setPickerTab('emojis'); }}
                      className={`flex-1 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                        pickerTab === 'emojis'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-cyan-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      😀 {lang === 'ar' ? 'تعبيرات إيموجي' : 'Emojis'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { playSynthSound(500, 'sine', 0.04); setPickerTab('stickers'); }}
                      className={`flex-1 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                        pickerTab === 'stickers'
                          ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-cyan-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      🎨 {lang === 'ar' ? 'ملصقات كوكبية' : 'Stickers'}
                    </button>
                  </div>

                  {/* Content Panel */}
                  {pickerTab === 'emojis' ? (
                    <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                      {emojis.map(emoji => (
                        <button 
                          key={emoji} 
                          type="button"
                          onClick={() => {
                            playSynthSound(600, 'sine', 0.05);
                            setText(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-xl hover:scale-125 transition-all p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 custom-scrollbar">
                      {stickers.map(stk => (
                        <button
                          key={stk.id}
                          type="button"
                          onClick={() => {
                            playSynthSound(700, 'sine', 0.06);
                            onSendMessage('', 'image', {
                              mediaUrl: stk.url,
                              fileName: stk.nameAr,
                              isSticker: true
                            });
                            setShowEmojiPicker(false);
                          }}
                          className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-cyan-400 bg-slate-50 dark:bg-slate-900/40 hover:bg-sky-50 dark:hover:bg-cyan-500/10 flex items-center gap-2 transition-all cursor-pointer text-left rtl:text-right group"
                        >
                          <img src={stk.url} alt={stk.nameAr} className="w-8 h-8 rounded-lg object-cover group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                            {lang === 'ar' ? stk.nameAr : stk.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type a message...'}
              className="flex-1 py-2 px-2.5 text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-sans"
              aria-label={lang === 'ar' ? 'حقل كتابة الرسالة' : 'Message text field'}
            />

            {/* Dynamic Send / Mic Action Button with smooth transition */}
            <div className="relative shrink-0 flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {text.trim() ? (
                  <motion.button
                    key="send-btn"
                    type="submit"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-md shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    title={lang === 'ar' ? 'إرسال الرسالة' : 'Send message'}
                    aria-label={lang === 'ar' ? 'إرسال' : 'Send'}
                  >
                    <Send className="w-4 h-4 rtl:-scale-x-100" />
                  </motion.button>
                ) : (
                  <motion.button
                    key="mic-btn"
                    type="button"
                    onClick={startRecording}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-md shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    title={lang === 'ar' ? 'تسجيل رسالة صوتية' : 'Record voice message'}
                    aria-label={lang === 'ar' ? 'تسجيل رسالة صوتية' : 'Record voice message'}
                  >
                    <Mic className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

          </div>
        </form>
      )}

      {/* Simulator: Interactive Camera Aperture Mock Overlay */}
      {showCameraSim && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/10 rounded-3xl p-6 relative flex flex-col items-center gap-4 text-center shadow-2xl">
            <button 
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-[#475569] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white cursor-pointer"
              onClick={() => setShowCameraSim(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <Camera className="w-12 h-12 text-sky-600 dark:text-cyan-400 animate-pulse" />
            <div className="font-bold font-sans text-[#111827] dark:text-white text-sm">{lang === 'ar' ? 'محاكاة الكاميرا الفورية' : 'Live Camera Aperture'}</div>
            <p className="text-[11px] text-[#475569] dark:text-slate-400 font-mono">
              {lang === 'ar' ? 'التقاط صورة ذاتية فورية لإرسالها في المحادثة.' : 'Capture live portrait to broadcast.'}
            </p>
            <div className="aspect-video w-full rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-slate-900 relative overflow-hidden">
              {/* Fake preview */}
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" alt="Camera view" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 border-2 border-dashed border-sky-400 dark:border-cyan-400/60 rounded-2xl m-3 pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white bg-black/80 px-1.5 py-0.5 rounded">1080P • RAW • FPS 60</span>
            </div>
            <button
              onClick={() => {
                handleSendAttachment('image', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', 'camera_capture.png');
                setShowCameraSim(false);
              }}
              className="w-full py-2.5 rounded-xl bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-sans font-bold hover:bg-sky-500 dark:hover:bg-cyan-400 transition-all text-xs cursor-pointer shadow-md"
            >
              {lang === 'ar' ? 'التقاط وإرسال 📸' : 'Snap & Transmit 📸'}
            </button>
          </div>
        </div>
      )}

      {/* Simulator: Interactive Cosmic Gallery Mock Overlay */}
      {showGallerySim && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/10 rounded-3xl p-6 relative flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold font-sans text-[#111827] dark:text-white">{lang === 'ar' ? 'معرض الصور والوسائط' : 'Media Vault'}</span>
              <button 
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-[#475569] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                onClick={() => setShowGallerySim(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[10px] text-[#475569] dark:text-slate-400 font-mono">
              {lang === 'ar' ? 'اختر صورة لإرسالها داخل المحادثة.' : 'Select image resource to send.'}
            </p>

            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {[
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
                'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400',
                'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400'
              ].map((imgUrl, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    handleSendAttachment('image', imgUrl, `lodavia_vault_${i + 1}.png`);
                    setShowGallerySim(false);
                  }}
                  className="rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 hover:border-sky-500 dark:hover:border-cyan-400 transition-all aspect-square relative cursor-pointer group bg-slate-100 dark:bg-black/40"
                >
                  <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-sky-500/10 dark:bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
