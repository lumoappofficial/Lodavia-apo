import React, { useState } from 'react';
import { 
  Home, 
  Sparkles, 
  Plus, 
  Share2, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Building, 
  Zap, 
  Star, 
  Eye, 
  Send 
} from 'lucide-react';
import { PersonalBuilding } from '../../types/parallelWorld';
import { INITIAL_PERSONAL_BUILDINGS } from '../../data/parallelWorldData';
import { AppUser } from '../../types';

interface PersonalSanctumProps {
  currentUser: AppUser;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
}

export default function PersonalSanctum({
  currentUser,
  lang,
  playSynthSound,
  onGrantXp
}: PersonalSanctumProps) {
  const isAr = lang === 'ar';

  const [buildings, setBuildings] = useState<PersonalBuilding[]>(INITIAL_PERSONAL_BUILDINGS);
  const [copied, setCopied] = useState(false);
  const [visitedFriend, setVisitedFriend] = useState<string | null>(null);

  const handleUpgradeBuilding = (id: string) => {
    playSynthSound(850, 'sine', 0.2);
    setBuildings(prev => prev.map(b => b.id === id ? { ...b, level: b.level + 1 } : b));
    onGrantXp(150, 'ترقية مبنى في عالمك الشخصي', 'Upgraded personal world structure');
  };

  const handleShareWorld = () => {
    playSynthSound(600, 'sine', 0.1);
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const friendsList = [
    { name: 'عالم سارة الكوني 🌌', avatar: '✨' },
    { name: 'مملكة عمر المبتكر 🚀', avatar: '🏰' },
    { name: 'معرض ليان الإبداعي 🎨', avatar: '🌸' }
  ];

  return (
    <div className="w-full flex flex-col gap-6 glass-panel bg-slate-950/95 text-slate-100 rounded-3xl border border-amber-500/30 p-5 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-400/30 text-amber-300">
            <Home className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? `عالَم ${currentUser.name} الشخصي الكوني 🏰` : `${currentUser.name}'s Personal World Sanctum 🏰`}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr ? 'مساحتك الخاصة التي تعكس رحلتك وتطور أفكارك ومشاريعك داخل منصة Lodavia' : 'Your personal territory reflecting your evolution, projects & ideas'}
            </p>
          </div>
        </div>

        {/* Share & Invite Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWorld}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? (isAr ? 'تم نسخ رابط عالمك! 🔗' : 'Link Copied! 🔗') : (isAr ? 'دعوة أصدقاء لزيارة عالمك ✉️' : 'Invite Friends ✉️')}</span>
          </button>
        </div>
      </div>

      {/* Visual Island Stage Representation */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a0f26] to-slate-950 border border-white/10 relative z-10 flex flex-col items-center justify-center text-center gap-6 min-h-[300px]">
        
        {/* Sky background element */}
        <div className="flex items-center justify-between w-full text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'مؤشر التناغم الكوني: 94%' : 'Cosmic Harmony Index: 94%'}</span>
          </span>
          <span className="text-amber-400 font-mono">
            {isAr ? `مباني العالم: ${buildings.length}` : `World Buildings: ${buildings.length}`}
          </span>
        </div>

        {/* Island Plot Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-2">
          {buildings.map((b) => (
            <div 
              key={b.id} 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition flex flex-col justify-between items-center text-center gap-3 relative group"
            >
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-3xl shadow-lg group-hover:scale-110 transition">
                {b.icon}
              </div>

              <div>
                <h5 className="text-xs font-black text-white">{isAr ? b.titleAr : b.titleEn}</h5>
                <span className="text-[10px] text-amber-400 font-bold block mt-0.5">Level {b.level}</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{isAr ? b.descriptionAr : b.descriptionEn}</p>
              </div>

              <button
                onClick={() => handleUpgradeBuilding(b.id)}
                className="w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/30 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>{isAr ? 'ترقية المبنى (+150 XP)' : 'Upgrade (+150 XP)'}</span>
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Friends' Worlds Section */}
      <div className="flex flex-col gap-3 relative z-10 pt-2 border-t border-white/10">
        <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'زيارة عوالم الأصدقاء المجاورة:' : "Visit Friends' Neighboring Worlds:"}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {friendsList.map((f, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1.5 bg-slate-900 rounded-xl border border-white/10">{f.avatar}</span>
                <span className="text-xs font-bold text-white">{f.name}</span>
              </div>

              <button
                onClick={() => {
                  playSynthSound(700, 'sine', 0.1);
                  setVisitedFriend(f.name);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] transition cursor-pointer shrink-0"
              >
                {isAr ? 'زيارة 🚀' : 'Visit 🚀'}
              </button>
            </div>
          ))}
        </div>

        {visitedFriend && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-between animate-fadeIn mt-1">
            <span>{isAr ? `أنت تسجل الآن زيارة استكشافية لـ: ${visitedFriend}` : `Visiting: ${visitedFriend}`}</span>
            <button
              onClick={() => setVisitedFriend(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
