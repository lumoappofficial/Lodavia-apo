import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import LodaviaCosmicLogo from '../components/LodaviaCosmicLogo';
import { 
  Settings, 
  Languages, 
  Moon, 
  Sun, 
  Shield, 
  Bell, 
  EyeOff, 
  UserX, 
  Lock, 
  Check, 
  LogOut,
  Sparkles,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { 
    lang, 
    setLang, 
    theme, 
    setTheme, 
    playSynthSound,
    setCurrentUser
  } = useApp();

  const navigate = useNavigate();

  // Notification toggles state
  const [notifyMessage, setNotifyMessage] = useState(true);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyFriendJoined, setNotifyFriendJoined] = useState(false);

  // Privacy states
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  // Simulated blocked users
  const [blockedUsers, setBlockedUsers] = useState<string[]>([
    'SpammerBot99',
    'TrollKing'
  ]);

  const handleLogout = () => {
    playSynthSound(150, 'sawtooth', 0.4);
    // Return to login
    localStorage.removeItem('lumo_user');
    localStorage.removeItem('lodavia_user');
    navigate('/welcome');
  };

  const handleUnblock = (username: string) => {
    playSynthSound(600, 'sine', 0.1);
    setBlockedUsers(prev => prev.filter(u => u !== username));
  };

  return (
    <div className="max-w-lg mx-auto w-full pb-12 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-cyan-400" />
        <h1 className="text-lg font-black text-white">
          {lang === 'ar' ? 'الإعدادات والخصوصية الكونية ⚙️' : 'Universe Settings & Privacy ⚙️'}
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* BRAND HUB BANNER */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600/10 via-blue-600/15 to-cyan-500/10 border border-purple-500/35 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cosmic-blue to-black/80 p-1 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
              <LodaviaCosmicLogo size={48} glow={true} animated={true} />
            </div>
            <div className="text-start">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 block">
                {lang === 'ar' ? 'مركز الهوية البصرية وشعارات لودافيا 🪐' : 'Lodavia Brand Hub & Guidelines 🪐'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 max-w-xs leading-normal">
                {lang === 'ar' ? 'الأصول الرسمية، رموز الألوان، الخطوط، وتنزيل شعارات المتجه والـ PNG فائقة الدقة.' : 'Official brand assets, typography, hex colors, and high-res SVG & PNG exports.'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.1);
              navigate('/branding-kit');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-[11px] transition-all active:scale-95 shadow-md shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'استعراض الهوية 🚀' : 'Explore Assets 🚀'}
          </button>
        </div>

        {/* AI REPLY ASSISTANT BANNER */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-600/10 via-purple-600/15 to-purple-500/10 border border-cyan-500/30 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full bg-[#0B0B16] p-1 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-start">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white block">
                  {lang === 'ar' ? 'مساعد الرد الذكي من لودافيا 🚀' : 'Lodavia AI Reply Assistant 🚀'}
                </span>
                <span className="text-[8px] bg-amber-500/15 text-amber-400 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-500/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 max-w-xs leading-normal">
                {lang === 'ar' ? 'قم بإدارة تعليقات قنواتك وتوليد ردود شخصية مذهلة بالذكاء الاصطناعي وبمختلف اللهجات المحلية.' : 'Import social comments, categorize intent, and auto-generate custom local Arabic responses.'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              playSynthSound(750, 'sine', 0.1);
              navigate('/ai-reply-assistant');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-[11px] transition-all active:scale-95 shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فتح المساعد الذكي 🪄' : 'Open Assistant 🪄'}</span>
          </button>
        </div>
        
        {/* 1. LANGUAGE & APP PREFERENCES */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <Languages className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'تفضيلات التطبيق واللغة' : 'Application & Localization'}</span>
          </h2>

          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-white font-bold block">{lang === 'ar' ? 'لغة الواجهة' : 'Display Language'}</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">{lang === 'ar' ? 'اختر اللغة المناسبة لرحلتك الكونية' : 'Select language for Lodavia universe'}</span>
            </div>

            <div className="flex p-1 rounded-xl bg-black/40 border border-white/5">
              <button
                onClick={() => {
                  setLang('ar');
                  playSynthSound(500, 'sine', 0.05);
                }}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                  lang === 'ar' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => {
                  setLang('en');
                  playSynthSound(500, 'sine', 0.05);
                }}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs mt-2">
            <div>
              <span className="text-white font-bold block">{lang === 'ar' ? 'السمة والمظهر' : 'Visual Theme'}</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">{lang === 'ar' ? 'غير ألوان الكوكب وعالم لوِمو الخارجي' : 'Choose cosmic slate rendering mode'}</span>
            </div>

            <div className="flex p-1 rounded-xl bg-black/40 border border-white/5">
              <button
                onClick={() => {
                  setTheme('dark');
                  playSynthSound(600, 'sine', 0.05);
                }}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>{lang === 'ar' ? 'مظلم' : 'Dark'}</span>
              </button>
              <button
                onClick={() => {
                  setTheme('light');
                  playSynthSound(600, 'sine', 0.05);
                }}
                className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  theme === 'light' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>{lang === 'ar' ? 'مضيء' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. SECURITY & PRIVACY */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'الأمان والخصوصية الفائقة' : 'Quantum Privacy & Security'}</span>
          </h2>

          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-white font-bold block">{lang === 'ar' ? 'حساب خاص ومحمي' : 'Private Cosmic Orbit'}</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">{lang === 'ar' ? 'إخفاء مشاركاتك وأنشطتك عن الزوار والبحث العام' : 'Only approved followers can see your activities'}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profilePrivate}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setProfilePrivate(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex justify-between items-center text-xs mt-2">
            <div>
              <span className="text-white font-bold block">{lang === 'ar' ? 'مؤشرات القراءة والاتصال' : 'Read Receipts & Status'}</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">{lang === 'ar' ? 'مشاركة حالتك النشطة وتأكيد قراءة الرسائل الكونية' : 'Allow others to see when you are online'}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readReceipts}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setReadReceipts(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>
        </div>

        {/* 3. PUSH NOTIFICATIONS */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'قنوات الإشعارات الفورية' : 'Push Notification Channels'}</span>
          </h2>

          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-bold">{lang === 'ar' ? 'الرسائل والمحادثات المباشرة 💬' : 'Direct Messages 💬'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyMessage}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setNotifyMessage(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-white font-bold">{lang === 'ar' ? 'الإعجابات والتفاعلات ❤️' : 'Likes & Reactions ❤️'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyLikes}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setNotifyLikes(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-white font-bold">{lang === 'ar' ? 'التعليقات والمناقشات ✍️' : 'Comments & Discussion ✍️'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyComments}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setNotifyComments(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>
        </div>

        {/* 4. BLOCKED USERS */}
        <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/5">
            <UserX className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'قائمة الحظر' : 'Blocked Dimensions'}</span>
          </h2>

          {blockedUsers.length === 0 ? (
            <span className="text-xs text-slate-500 italic block py-2">{lang === 'ar' ? 'فضاءك آمن ولا توجد حسابات محظورة.' : 'No blocked accounts in your orbit.'}</span>
          ) : (
            <div className="flex flex-col gap-2.5">
              {blockedUsers.map((user) => (
                <div key={user} className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-white">{user}</span>
                  <button
                    onClick={() => handleUnblock(user)}
                    className="text-[10px] text-red-400 hover:underline font-bold cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء الحظر ✓' : 'Unblock ✓'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-dashed border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-black text-red-400 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تسجيل الخروج من لودافيا' : 'Log out from Lodavia orbit'}</span>
        </button>

      </div>
    </div>
  );
}
