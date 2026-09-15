import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Smile, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface OrbitsControlBarProps {
  onBack?: () => void;
  onOpenRules?: () => void;
}

const COSMIC_EMOJIS = ['🚀', '🔥', '👏', '🪐', '🛸', '⭐', '⚡', '😂'];

export default function OrbitsControlBar({ onBack, onOpenRules }: OrbitsControlBarProps) {
  const [micActive, setMicActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);

  const triggerReaction = (reaction: string) => {
    setFloatingReaction(reaction);
    setTimeout(() => setFloatingReaction(null), 2500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    triggerReaction(`💬 ${chatMessage}`);
    setChatMessage('');
    setShowChat(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-2 select-none z-40">
      {/* Floating Reaction Toast */}
      {floatingReaction && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0D1629]/95 border border-sky-400 text-white text-xs font-bold shadow-2xl shadow-sky-500/20 flex items-center gap-2 animate-bounce z-50">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>{floatingReaction}</span>
        </div>
      )}

      {/* Mini Popover for Chat */}
      {showChat && (
        <div className="absolute bottom-14 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-80 max-w-[92vw] p-2.5 rounded-2xl bg-[#090F1C]/95 backdrop-blur-2xl border border-sky-500/30 shadow-2xl shadow-sky-500/20 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>الدردشة الفضائية السريعة</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleSendChat} className="flex items-center gap-1.5">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="اكتب رسالة للطاقم..."
              autoFocus
              className="flex-1 h-8 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-400 focus:outline-none text-xs text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim()}
              className="h-8 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}

      {/* Mini Popover for Emojis */}
      {showEmojis && (
        <div className="absolute bottom-14 left-4 sm:left-1/2 sm:-translate-x-1/2 p-2 rounded-2xl bg-[#090F1C]/95 backdrop-blur-2xl border border-sky-500/30 shadow-2xl shadow-sky-500/20 z-50 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
          {COSMIC_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                triggerReaction(emoji);
                setShowEmojis(false);
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 active:scale-90 border border-white/10 flex items-center justify-center text-base transition-all cursor-pointer hover:border-sky-400/40"
              title={`إرسال ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowEmojis(false)}
            className="w-7 h-7 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Mini Control Bar Shell */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl bg-[#090F1C]/90 backdrop-blur-xl border border-sky-500/20 shadow-xl">
        
        {/* Left Side: Communication controls (Mic, Chat, Emoji) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* 1. Mic Control (Mute/Unmute) */}
          <button
            onClick={() => {
              setMicActive(!micActive);
              triggerReaction(micActive ? '🔇 تم كتم المايك' : '🎙️ المايك مفعل الآن');
            }}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              micActive
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
            title={micActive ? 'كتم المايك' : 'تفعيل المايك الصوتي'}
          >
            {micActive ? (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">مفعل</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">مكتوم</span>
              </>
            )}
          </button>

          {/* 2. Chat Control */}
          <button
            onClick={() => {
              setShowChat(!showChat);
              setShowEmojis(false);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              showChat
                ? 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title="الدردشة الفضائية"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* 3. Emoji Reactions Control */}
          <button
            onClick={() => {
              setShowEmojis(!showEmojis);
              setShowChat(false);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              showEmojis
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            title="ردود الفعل والتفاعلات"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Quick Live Audio / Turn hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">تردد المدار مشفّر ونشط</span>
        </div>

        {/* Right Side: Sound, Rules, and Exit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              soundEnabled
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Rules Modal Button */}
          {onOpenRules && (
            <button
              onClick={onOpenRules}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="دليل وقواعد اللعبة"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}

          {/* Exit Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="العودة لمركز الألعاب"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مغادرة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
