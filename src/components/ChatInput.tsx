import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { playSynthSound } from '../utils/synth';

interface ChatInputProps {
  lang: 'ar' | 'en';
  onSendMessage: (text: string, type: 'text' | 'image' | 'video' | 'file' | 'audio', options?: any) => void;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
  replyToText?: string;
  onClearReply?: () => void;
  editToText?: string;
  onClearEdit?: () => void;
}

export function ChatInput({
  lang,
  onSendMessage,
  isTyping,
  onTypingChange,
  replyToText,
  onClearReply,
  editToText,
  onClearEdit
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

  const emojis = ['🌌', '✨', '🚀', '🔮', '👾', '🛡️', '👑', '🔥', '❤️', '👍', '😊', '💡', '🎉', '🌟', '💻'];

  return (
    <div className="p-4 border-t border-white/5 bg-slate-950/40 relative" id="chat-input-component">
      
      {/* Recording Overlay Mode */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-4 bg-red-950/20 border border-red-500/20 p-3 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <div className="flex gap-1 items-end h-5">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 50}ms` }} 
                  className="w-0.5 bg-red-400 rounded-full animate-bounce"
                />
              ))}
            </div>
            <span className="text-xs font-mono text-red-300">
              {lang === 'ar' ? 'جاري تسجيل موجة الصوت...' : 'Streaming voice track...'} {recordingSeconds}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={cancelRecording}
              className="px-3 py-1.5 text-[10px] font-mono rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              onClick={stopAndSendVoice}
              className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center transition-all"
              title={lang === 'ar' ? 'إرسال التسجيل' : 'Transmit Audio Signal'}
            >
              <StopCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          <div className="flex items-center gap-2">
            
            {/* Attachment Link Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playSynthSound(587.33, 'sine', 0.05);
                  setShowAttachmentsMenu(!showAttachmentsMenu);
                  setShowEmojiPicker(false);
                }}
                className={`p-2.5 rounded-xl transition-all border shrink-0 flex items-center justify-center ${
                  showAttachmentsMenu 
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Attachments menu"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Attachments dropdown panel */}
              {showAttachmentsMenu && (
                <div className="absolute bottom-14 left-0 z-30 p-2.5 rounded-2xl bg-[#09090e]/95 border border-white/10 shadow-2xl w-48 flex flex-col gap-1 backdrop-blur-xl animate-slideUp">
                  
                  {/* Gallery */}
                  <button
                    type="button"
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setShowGallerySim(true);
                      setShowAttachmentsMenu(false);
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-cyan-400 text-xs transition-all w-full"
                  >
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
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
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-cyan-400 text-xs transition-all w-full"
                  >
                    <Camera className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ar' ? 'التقاط فوري' : 'Live Aperture Lens'}</span>
                  </button>

                  {/* Document upload simulation */}
                  <button
                    type="button"
                    onClick={() => handleSendAttachment(
                      'file', 
                      'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 
                      'lumo_stellar_protocol.pdf',
                      '2.4 MB'
                    )}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-cyan-400 text-xs transition-all w-full"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'ملف كوني (PDF)' : 'Stellar Document (PDF)'}</span>
                  </button>

                  {/* Video attachment simulation */}
                  <button
                    type="button"
                    onClick={() => handleSendAttachment(
                      'video', 
                      'https://assets.mixkit.co/videos/preview/mixkit-nebula-of-outer-space-background-12347-large.mp4', 
                      'galactic_wave.mp4'
                    )}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 text-slate-300 hover:text-cyan-400 text-xs transition-all w-full"
                  >
                    <Video className="w-4 h-4 text-red-400" />
                    <span>{lang === 'ar' ? 'ملف مرئي (MP4)' : 'Nebula Video Clip'}</span>
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
                className={`p-2.5 rounded-xl transition-all border shrink-0 flex items-center justify-center ${
                  showEmojiPicker 
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-yellow-400' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Emoji picker"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Emoji dropdown panel */}
              {showEmojiPicker && (
                <div className="absolute bottom-14 left-0 z-30 p-3 rounded-2xl bg-[#09090e]/95 border border-white/10 shadow-2xl max-w-[220px] backdrop-blur-xl animate-scaleIn">
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map(emoji => (
                      <button 
                        key={emoji} 
                        type="button"
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.05);
                          setText(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:scale-130 transition-all p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder={lang === 'ar' ? 'بث رسالة آمنة مشفرة...' : 'Broadcast secure signal...'}
              className="glass-input flex-1 py-2.5 px-4 rounded-xl text-xs bg-white/5 border border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-sans"
              aria-label={lang === 'ar' ? 'حقل كتابة الرسالة' : 'Message text field'}
            />

            {/* Recording Trigger Micro Button */}
            <button
              type="button"
              onClick={startRecording}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 flex items-center justify-center"
              title="Record voice stream"
            >
              <Mic className="w-4 h-4 text-purple-400" />
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-3 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>
        </form>
      )}

      {/* Simulator: Interactive Camera Aperture Mock Overlay */}
      {showCameraSim && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 relative flex flex-col items-center gap-4 text-center">
            <button 
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
              onClick={() => setShowCameraSim(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <Camera className="w-12 h-12 text-cyan-400 animate-pulse" />
            <div className="font-bold font-sans text-white text-sm">{lang === 'ar' ? 'محاكاة الكاميرا عالية الدقة' : 'High Fidelity Camera Aperture'}</div>
            <p className="text-[11px] text-slate-400 font-mono">
              {lang === 'ar' ? 'التقاط صورة ذاتية فورية باستخدام مستشعرات البكسل المحسنة.' : 'Capture live telemetry portrait with dynamic quantum exposure.'}
            </p>
            <div className="aspect-video w-full rounded-2xl border border-white/10 bg-black/60 relative overflow-hidden">
              {/* Fake preview */}
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" alt="Camera view" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 border-2 border-dashed border-cyan-400/40 rounded-2xl m-3 pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[8px] font-mono text-cyan-400 bg-black/80 px-1.5 py-0.5 rounded">1080P • RAW • FPS 60</span>
            </div>
            <button
              onClick={() => {
                handleSendAttachment('image', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', 'camera_capture.png');
                setShowCameraSim(false);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-sans font-bold hover:bg-cyan-400 transition-all text-xs"
            >
              {lang === 'ar' ? 'التقاط وإرسال 📸' : 'Snap & Transmit 📸'}
            </button>
          </div>
        </div>
      )}

      {/* Simulator: Interactive Cosmic Gallery Mock Overlay */}
      {showGallerySim && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 relative flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold font-sans text-white">{lang === 'ar' ? 'معرض وسائط لودافيا' : 'Lodavia Deep Space Vault'}</span>
              <button 
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                onClick={() => setShowGallerySim(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-mono">
              {lang === 'ar' ? 'اختر صورة من الخزينة المشفرة لإرسالها كحزمة فائقة السرعة.' : 'Select image resource token from private memory grid to broadcast.'}
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
                    handleSendAttachment('image', imgUrl, `lumo_vault_${i + 1}.png`);
                    setShowGallerySim(false);
                  }}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition-all aspect-square relative cursor-pointer group bg-black/40"
                >
                  <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
