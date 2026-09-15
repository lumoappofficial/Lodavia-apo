import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  VolumeX, 
  Clock, 
  Lock, 
  Trash2, 
  Download, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  Sliders, 
  Eye, 
  Search, 
  Share2, 
  Bell, 
  Smartphone,
  Type,
  UserX,
  UserCheck,
  Ban,
  AlertTriangle,
  ShieldOff
} from 'lucide-react';
import { ChatConversation } from '../types';

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ChatConversation;
  lang: string;
  wallpaperStyle: 'doodle' | 'grid' | 'nebula' | 'plain';
  setWallpaperStyle: (style: 'doodle' | 'grid' | 'nebula' | 'plain') => void;
  wallpaperOpacity: number;
  setWallpaperOpacity: (opacity: number) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onClearChatHistory: () => void;
  onSearchInChat?: () => void;
  isBlocked?: boolean;
  onToggleBlockUser?: (chatId: string, isBlocked: boolean) => void;
  onSimulateIncomingCall?: (type: 'voice' | 'video') => void;
  playSynthSound: (freq: number, type?: any, dur?: number) => void;
}

export function ChatSettingsModal({
  isOpen,
  onClose,
  conversation,
  lang,
  wallpaperStyle,
  setWallpaperStyle,
  wallpaperOpacity,
  setWallpaperOpacity,
  accentColor,
  setAccentColor,
  fontSize,
  setFontSize,
  onClearChatHistory,
  onSearchInChat,
  isBlocked = false,
  onToggleBlockUser,
  onSimulateIncomingCall,
  playSynthSound
}: ChatSettingsModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [muteDuration, setMuteDuration] = useState<'8h' | '1w' | 'always'>('8h');
  const [disappearingTimer, setDisappearingTimer] = useState<'off' | '24h' | '7d' | '90d'>('off');
  const [isChatLocked, setIsChatLocked] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [hdQuality, setHdQuality] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockReason, setBlockReason] = useState<'spam' | 'inappropriate' | 'harassment' | 'other'>('spam');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const currentlyBlocked = conversation.isBlocked ?? isBlocked;

  const accentOptions = [
    { id: 'cyan', name: isRtl ? 'سديم السماوي (الأصل)' : 'Aurora Cyan', class: 'bg-cyan-500', hex: '#06b6d4' },
    { id: 'violet', name: isRtl ? 'البنفسجي الفائق' : 'Electric Violet', class: 'bg-purple-500', hex: '#8b5cf6' },
    { id: 'emerald', name: isRtl ? 'الزمرد الكوني' : 'Emerald Matrix', class: 'bg-emerald-500', hex: '#10b981' },
    { id: 'amber', name: isRtl ? 'الذهب الشمسي' : 'Solar Amber', class: 'bg-amber-500', hex: '#f59e0b' },
    { id: 'rose', name: isRtl ? 'الوردي الفلكي' : 'Cosmic Rose', class: 'bg-rose-500', hex: '#f43f5e' }
  ];

  const triggerNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleExportChat = () => {
    playSynthSound(600, 'sine', 0.1);
    const content = conversation.messages.map(m => `[${m.timestamp}] ${m.senderId}: ${m.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lodavia_Chat_${conversation.contactName.replace(/\s+/g, '_')}.txt`;
    link.click();
    triggerNotice(isRtl ? 'تم تصدير سجل المحادثة بنجاح 📁' : 'Chat log exported successfully 📁');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#1f2937]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-sky-600 dark:text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#111827] dark:text-white">
                {isRtl ? 'إعدادات المحادثة الكونية ⚙️' : 'Cosmic Chat Settings ⚙️'}
              </h2>
              <p className="text-[11px] text-[#475569] dark:text-slate-400">
                {conversation.contactName} • {isRtl ? 'تخصيص الخلفية والأمان والخلفيات' : 'Custom wallpapers, themes & parameters'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              playSynthSound(400, 'sine', 0.08);
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 text-[#475569] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white hover:bg-slate-300 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin text-start">

          {/* Feedback Notice Toast */}
          {statusNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.2s_ease-out]">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* SECTION 1: Wallpaper & Pattern (نمط خلفية لودافيا مثل واتساب) */}
          <div className="bg-slate-50 dark:bg-[#182232] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span className="text-xs font-black text-[#111827] dark:text-white">
                  {isRtl ? 'خلفية المحادثة (نمط لودافيا)' : 'Chat Wallpaper & Pattern (Lodavia Style)'}
                </span>
              </div>
              <span className="text-[10px] text-sky-600 dark:text-cyan-400 font-mono font-bold">
                {isRtl ? 'نمط واتساب الكوني' : 'WhatsApp Cosmic Pattern'}
              </span>
            </div>

            <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'اختر النمط الفلكي المزخرف ليظهر كخلفية تفاعلية خلف الرسائل:' 
                : 'Choose a subtle cosmic wallpaper doodle layer rendered behind conversation bubbles:'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'doodle', nameAr: 'نقوش لودافيا 🌌', nameEn: 'Lodavia Doodles' },
                { id: 'grid', nameAr: 'شبكة النجوم 🛰️', nameEn: 'Star Grid' },
                { id: 'nebula', nameAr: 'توهج السديم 💫', nameEn: 'Nebula Glow' },
                { id: 'plain', nameAr: 'خلفية سادة 🎨', nameEn: 'Plain Clean' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setWallpaperStyle(p.id as any);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all text-xs font-bold cursor-pointer select-none ${
                    wallpaperStyle === p.id 
                      ? 'bg-sky-50 dark:bg-cyan-500/15 border-sky-600 dark:border-cyan-400 text-sky-700 dark:text-cyan-300 ring-2 ring-sky-500/20 dark:ring-cyan-400/20' 
                      : 'bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {isRtl ? p.nameAr : p.nameEn}
                </button>
              ))}
            </div>

            {/* Opacity slider */}
            {wallpaperStyle !== 'plain' && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-[#475569] dark:text-slate-400">
                  <span>{isRtl ? 'وضوح زخرفة الخلفية' : 'Wallpaper Opacity'}</span>
                  <span className="font-bold text-sky-600 dark:text-cyan-400">{Math.round(wallpaperOpacity * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.02" 
                  max="0.25" 
                  step="0.01" 
                  value={wallpaperOpacity}
                  onChange={(e) => setWallpaperOpacity(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* SECTION 2: Accent Color & Font Size */}
          <div className="bg-slate-50 dark:bg-[#182232] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black text-[#111827] dark:text-white">
                {isRtl ? 'تخصيص فقاعات الرسائل وحجم الخط' : 'Message Accent Theme & Text Size'}
              </span>
            </div>

            {/* Color accent picks */}
            <div>
              <span className="text-[11px] text-[#475569] dark:text-slate-400 block mb-2">
                {isRtl ? 'لون التمييز للرسائل الصادرة:' : 'Outgoing bubble accent theme:'}
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {accentOptions.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      playSynthSound(650, 'sine', 0.05);
                      setAccentColor(acc.hex);
                    }}
                    className={`w-8 h-8 rounded-full ${acc.class} flex items-center justify-center transition-all cursor-pointer ${
                      accentColor === acc.hex ? 'ring-4 ring-offset-2 ring-sky-500 dark:ring-offset-[#111827] scale-110' : 'hover:scale-105 opacity-80'
                    }`}
                    title={acc.name}
                  >
                    {accentColor === acc.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size choice */}
            <div className="pt-2">
              <span className="text-[11px] text-[#475569] dark:text-slate-400 block mb-2">
                {isRtl ? 'حجم الخط في حوار المحادثة:' : 'Chat font scale:'}
              </span>
              <div className="flex gap-2">
                {[
                  { id: 'sm', labelAr: 'صغير (11px)', labelEn: 'Small' },
                  { id: 'md', labelAr: 'متوسط (12px)', labelEn: 'Medium' },
                  { id: 'lg', labelAr: 'كبير (14px)', labelEn: 'Large' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      setFontSize(f.id as any);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      fontSize === f.id
                        ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-400 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300'
                    }`}
                  >
                    {isRtl ? f.labelAr : f.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: Mute & Notifications */}
          <div className="bg-slate-50 dark:bg-[#182232] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-black text-[#111827] dark:text-white">
                  {isRtl ? 'كتم إشعارات المحادثة' : 'Mute Notifications'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isMuted} 
                  onChange={() => {
                    playSynthSound(isMuted ? 600 : 300, 'sine', 0.08);
                    setIsMuted(!isMuted);
                    triggerNotice(!isMuted ? (isRtl ? 'تم كتم إشعارات المحادثة 🔕' : 'Chat muted 🔕') : (isRtl ? 'تم تفعيل التنبيهات 🔔' : 'Notifications unmuted 🔔'));
                  }} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600 dark:peer-checked:bg-amber-500" />
              </label>
            </div>

            {isMuted && (
              <div className="flex gap-2 pt-1 animate-[fadeIn_0.2s_ease-out]">
                {[
                  { id: '8h', label: isRtl ? '8 ساعات' : '8 Hours' },
                  { id: '1w', label: isRtl ? 'أسبوع واحد' : '1 Week' },
                  { id: 'always', label: isRtl ? 'دائماً' : 'Always' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMuteDuration(m.id as any);
                      playSynthSound(500, 'sine', 0.05);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      muteDuration === m.id
                        ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                        : 'bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: Privacy & Disappearing Messages */}
          <div className="bg-slate-50 dark:bg-[#182232] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-black text-[#111827] dark:text-white">
                {isRtl ? 'الرسائل الذاتية الاختفاء (Disappearing Messages)' : 'Disappearing Messages Timer'}
              </span>
            </div>

            <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'سيتم تدمير الرسائل الجديدة تلقائياً بعد انقضاء الوقت المحدد للحفاظ على سرية الحوار:' 
                : 'Automatically dissolve new sent messages after the configured quantum duration:'}
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'off', label: isRtl ? 'إيقاف' : 'Off' },
                { id: '24h', label: isRtl ? '24 ساعة' : '24 Hours' },
                { id: '7d', label: isRtl ? '7 أيام' : '7 Days' },
                { id: '90d', label: isRtl ? '90 يوم' : '90 Days' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setDisappearingTimer(d.id as any);
                    triggerNotice(isRtl ? `تم ضبط مؤقت اختفاء الرسائل: ${d.label}` : `Disappearing timer set: ${d.label}`);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    disappearingTimer === d.id
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Lock Chat Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-white/5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-[#111827] dark:text-white">
                  {isRtl ? 'قفل هذه المحادثة برمز PIN' : 'Lock Chat with PIN / Biometrics'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isChatLocked} 
                  onChange={() => {
                    playSynthSound(isChatLocked ? 300 : 700, 'sine', 0.08);
                    setIsChatLocked(!isChatLocked);
                    triggerNotice(!isChatLocked ? (isRtl ? 'تم قفل المحادثة لحمايتها 🔒' : 'Chat locked 🔒') : (isRtl ? 'تم إلغاء قفل المحادثة 🔓' : 'Chat unlocked 🔓'));
                  }} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-cyan-500" />
              </label>
            </div>
          </div>

          {/* SECTION 5: Safety & Block User (قسم حظر المستخدم والأمان الكوني) */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
            currentlyBlocked 
              ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30' 
              : 'bg-slate-50 dark:bg-[#182232] border-[#E2E8F0] dark:border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentlyBlocked ? (
                  <Ban className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span className="text-xs font-black text-[#111827] dark:text-white">
                  {isRtl ? 'الأمان وحظر المستخدم' : 'Privacy, Safety & Block User'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentlyBlocked
                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
              }`}>
                {currentlyBlocked ? (isRtl ? 'محظور ⛔' : 'Blocked ⛔') : (isRtl ? 'نشط وآمن 🛡️' : 'Active 🛡️')}
              </span>
            </div>

            <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
              {currentlyBlocked 
                ? (isRtl 
                    ? `المستخدم "${conversation.contactName}" محظور حالياً. لن يتمكن من إرسال رسائل أو الاتصال بك صوتياً أو مرئياً.` 
                    : `"${conversation.contactName}" is currently blocked from sending messages and starting audio/video calls.`)
                : (isRtl 
                    ? `عند حظر هذا المستخدم، لن يتمكن من إرسال رسائل أو الاتصال بك أو رؤية حالتك المباشرة على لودافيا.` 
                    : `Blocking will stop this stargazer from messaging you, calling, or viewing your active status.`)}
            </p>

            {/* Block / Unblock Controls */}
            {currentlyBlocked ? (
              <div className="pt-1">
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.1);
                    if (onToggleBlockUser) {
                      onToggleBlockUser(conversation.id, false);
                    }
                    triggerNotice(isRtl ? `تم إلغاء حظر ${conversation.contactName} بنجاح ✨` : `Unblocked ${conversation.contactName} ✨`);
                  }}
                  className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isRtl ? `إلغاء حظر ${conversation.contactName}` : `Unblock ${conversation.contactName}`}</span>
                </button>
              </div>
            ) : !showBlockConfirm ? (
              <div className="pt-1">
                <button
                  onClick={() => setShowBlockConfirm(true)}
                  className="w-full p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <UserX className="w-4 h-4" />
                  <span>{isRtl ? `حظر هذا المستخدم (${conversation.contactName})` : `Block ${conversation.contactName}`}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-100/90 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/40 text-start space-y-3 animate-[slideDown_0.2s_ease-out]">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <p className="text-xs font-black">
                    {isRtl ? `تأكيد حظر ${conversation.contactName}؟` : `Confirm blocking ${conversation.contactName}?`}
                  </p>
                </div>

                <p className="text-[11px] text-rose-900/80 dark:text-rose-200 leading-relaxed">
                  {isRtl 
                    ? 'اختر سبب الحظر (اختياري) لتسجيله في سجل الأمان وميثاق الشرف:' 
                    : 'Select reason for safety registry charter:'}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'spam', labelAr: 'إزعاج / سبام', labelEn: 'Spam & Noise' },
                    { id: 'inappropriate', labelAr: 'محتوى غير لائق', labelEn: 'Inappropriate' },
                    { id: 'harassment', labelAr: 'مضايقة / إساءة', labelEn: 'Harassment' },
                    { id: 'other', labelAr: 'سبب آخر', labelEn: 'Other Reason' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setBlockReason(r.id as any)}
                      className={`p-2 rounded-lg text-[11px] font-bold border text-center transition-all cursor-pointer ${
                        blockReason === r.id
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-white/80 dark:bg-white/5 border-rose-200 dark:border-white/10 text-[#111827] dark:text-slate-200'
                      }`}
                    >
                      {isRtl ? r.labelAr : r.labelEn}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      playSynthSound(200, 'sawtooth', 0.15);
                      if (onToggleBlockUser) {
                        onToggleBlockUser(conversation.id, true);
                      }
                      setShowBlockConfirm(false);
                      triggerNotice(isRtl ? `تم حظر ${conversation.contactName} بنجاح ⛔` : `Blocked ${conversation.contactName} ⛔`);
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    {isRtl ? 'تأكيد الحظر الآن ⛔' : 'Confirm Block ⛔'}
                  </button>
                  <button
                    onClick={() => setShowBlockConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 text-[#111827] dark:text-slate-300 border border-[#E2E8F0] dark:border-white/10 font-bold text-xs transition-all cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: Actions & Clear History */}
          <div className="space-y-2 pt-2">
            
            {/* Search in chat */}
            {onSearchInChat && (
              <button
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  onSearchInChat();
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-[#E2E8F0] dark:border-white/10 text-[#111827] dark:text-slate-200 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>{isRtl ? 'البحث داخل المحادثة 🔍' : 'Search in Conversation 🔍'}</span>
                </div>
                <span className="text-[10px] text-[#475569] dark:text-slate-400 font-mono">⌘F</span>
              </button>
            )}

            {/* Simulate Incoming Call Test */}
            {onSimulateIncomingCall && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onSimulateIncomingCall('voice'), 150);
                }}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isRtl ? 'محاكاة مكالمة واردة وتجربة الرنين 📲' : 'Simulate Incoming Call & Ringtone 📲'}</span>
                </div>
                <span className="text-[10px] bg-emerald-200/70 dark:bg-emerald-500/30 text-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {isRtl ? 'تجربة النغمة' : 'Test Ringtone'}
                </span>
              </button>
            )}

            {/* Export chat */}
            <button
              onClick={handleExportChat}
              className="w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-[#E2E8F0] dark:border-white/10 text-[#111827] dark:text-slate-200 font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isRtl ? 'تصدير سجل المحادثة كملف نصي 📁' : 'Export Chat Log (.TXT) 📁'}</span>
            </button>

            {/* Clear history */}
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isRtl ? 'مسح كافة رسائل المحادثة 🧹' : 'Flush Conversation Messages 🧹'}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-start space-y-3 animate-[slideDown_0.2s_ease-out]">
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  {isRtl 
                    ? 'هل أنت متأكد من مسح جميع الرسائل في هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.' 
                    : 'Are you sure you want to delete all messages in this conversation? This cannot be undone.'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSynthSound(150, 'sawtooth', 0.1);
                      onClearChatHistory();
                      setShowClearConfirm(false);
                      triggerNotice(isRtl ? 'تم مسح الرسائل بنجاح 🧹' : 'Chat history cleared 🧹');
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    {isRtl ? 'نعم، امسح الكُل' : 'Yes, Flush All'}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-[#111827] dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-white/10 bg-slate-50 dark:bg-[#1f2937]/50 flex justify-end">
          <button
            onClick={() => {
              playSynthSound(520, 'sine', 0.08);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            {isRtl ? 'حفظ وإغلاق 🚀' : 'Save & Close 🚀'}
          </button>
        </div>

      </div>
    </div>
  );
}
