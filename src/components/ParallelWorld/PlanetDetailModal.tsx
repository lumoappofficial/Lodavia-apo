import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Send, 
  CheckCircle2, 
  Users, 
  Award, 
  Lightbulb, 
  Brain, 
  Gamepad2, 
  Palette, 
  Briefcase, 
  MessageSquare, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react';
import { PlanetRegion, ExplorerUser } from '../../types/parallelWorld';

interface PlanetDetailModalProps {
  planet: PlanetRegion | null;
  onClose: () => void;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
  activeExplorers: ExplorerUser[];
}

export default function PlanetDetailModal({
  planet,
  onClose,
  lang,
  playSynthSound,
  onGrantXp,
  activeExplorers
}: PlanetDetailModalProps) {
  if (!planet) return null;

  const isAr = lang === 'ar';

  const [inputIdea, setInputIdea] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'activities' | 'explorers' | 'stats'>('activities');

  // Filter explorers in this planet
  const planetExplorers = activeExplorers.filter(e => e.planetId === planet.id || Math.random() > 0.4);

  const handlePerformAction = (activityTitleAr: string, activityTitleEn: string, xpReward: number) => {
    playSynthSound(800, 'sine', 0.2);
    onGrantXp(xpReward, activityTitleAr, activityTitleEn);
    setActionSuccess(isAr ? `تم تنفيذ النشاط بنجاح! حصلت على +${xpReward} XP 🚀` : `Activity completed! +${xpReward} XP earned 🚀`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSendIdeaSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIdea.trim()) return;

    playSynthSound(900, 'triangle', 0.25);
    onGrantXp(120, `زراعة بذرة فكرة: ${inputIdea.slice(0, 20)}...`, `Planted Idea Seed: ${inputIdea.slice(0, 20)}...`);
    setActionSuccess(isAr ? 'تمت زراعة بذرة فكرتك الكونية بنجاح في كوكب الأفكار! 💡 (+120 XP)' : 'Idea seed planted successfully on Idea Planet! 💡 (+120 XP)');
    setInputIdea('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="glass-panel bg-slate-950 rounded-3xl p-6 max-w-xl w-full border border-cyan-500/30 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto relative text-slate-100">
        
        {/* Top Header Background Glow */}
        <div 
          className="absolute -top-12 -inset-x-0 h-32 rounded-t-3xl opacity-30 blur-2xl pointer-events-none"
          style={{ backgroundColor: planet.color }}
        />

        {/* Modal Close Button */}
        <div className="flex justify-between items-start relative z-10 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl p-1 flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0"
              style={{ background: `radial-gradient(circle, ${planet.color}, #090d21)` }}
            >
              <span className="animate-pulse">{planet.icon}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {isAr ? planet.nameAr : planet.nameEn}
                </h3>
                <span className="text-[10px] uppercase font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded-full border border-white/10">
                  {planet.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isAr ? planet.descriptionAr : planet.descriptionEn}
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              playSynthSound(440, 'sine', 0.1);
              onClose();
            }}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce relative z-10">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Planet Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-2 relative z-10">
          {[
            { id: 'activities', labelAr: 'الأنشطة والمهام 🎯', labelEn: 'Activities & Quests 🎯' },
            { id: 'explorers', labelAr: 'المستكشفون المباشرون 👥', labelEn: 'Live Explorers 👥' },
            { id: 'stats', labelAr: 'إحصائيات الكوكب 📊', labelEn: 'Planet Stats 📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Tab 1: Activities & Quests */}
        {activeTab === 'activities' && (
          <div className="flex flex-col gap-3 relative z-10">
            
            {/* Custom Interactive Module for Idea Planet */}
            {planet.id === 'ideas' && (
              <form onSubmit={handleSendIdeaSeed} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2.5">
                <label className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'زراعة بذرة فكرة كوكبية جديدة' : 'Plant a New Cosmic Idea Seed'}</span>
                </label>
                <input
                  type="text"
                  value={inputIdea}
                  onChange={(e) => setInputIdea(e.target.value)}
                  placeholder={isAr ? 'اكتب فكرتك الابتكارية هنا وازرعها في الكوكب...' : 'Write your innovative concept here...'}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-orange-400 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'زراعة الفكرة وإرسالها (+120 XP)' : 'Plant Seed (+120 XP)'}</span>
                </button>
              </form>
            )}

            {/* List of contextual planet quests */}
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { 
                  titleAr: `استكشاف أسرار ${planet.nameAr}`, 
                  titleEn: `Explore ${planet.nameEn} Mysteries`, 
                  descAr: 'قم بزيارة المعالم وتصفح إسهامات الأعضاء', 
                  descEn: 'Inspect community milestones and entries', 
                  xp: 80 
                },
                { 
                  titleAr: 'تحدي الحكمة السريع', 
                  titleEn: 'Quick Wisdom Trial', 
                  descAr: 'أجب على سؤال ابتكاري سريع لتحصيل طاقة النواة', 
                  descEn: 'Answer an interactive challenge for core energy', 
                  xp: 150 
                },
                { 
                  titleAr: 'مشاركة المعرفة مع مستكشف جديد', 
                  titleEn: 'Share Knowledge with Explorer', 
                  descAr: 'أرسل شرارة طاقة لأحد المستكشفين في هذا الكوكب', 
                  descEn: 'Send a spark to an active explorer in this zone', 
                  xp: 100 
                }
              ].map((act, i) => (
                <div 
                  key={i} 
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs font-black text-white">{isAr ? act.titleAr : act.titleEn}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? act.descAr : act.descEn}</p>
                  </div>
                  <button
                    onClick={() => handlePerformAction(act.titleAr, act.titleEn, act.xp)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] shrink-0 transition active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>+{act.xp} XP</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Live Explorers */}
        {activeTab === 'explorers' && (
          <div className="flex flex-col gap-2.5 relative z-10">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">
              {isAr ? 'المستكشفون الموجودون حالياً في هذا الكوكب:' : 'Explorers currently in this planet:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {planetExplorers.map((exp) => (
                <div key={exp.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-2 bg-slate-900 rounded-xl border border-white/10">{exp.avatar}</span>
                    <div>
                      <h5 className="text-xs font-black text-white flex items-center gap-1">
                        <span>{exp.name}</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">L{exp.level}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">{exp.title}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSynthSound(800, 'sine', 0.1);
                      setActionSuccess(isAr ? `أرسلت التحية والشرارة الكونية لـ ${exp.name}! 👋` : `Sent cosmic wave to ${exp.name}! 👋`);
                      setTimeout(() => setActionSuccess(null), 2500);
                    }}
                    className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition active:scale-95 cursor-pointer"
                    title={isAr ? 'إرسال لوحة تحية' : 'Wave'}
                  >
                    👋
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Planet Stats */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? planet.stats.labelAr : planet.stats.labelEn}</span>
              <span className="text-2xl font-black text-cyan-400 mt-2">{planet.stats.value}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'عدد الأنشطة الفعالة' : 'Active Quests'}</span>
              <span className="text-2xl font-black text-amber-400 mt-2">{planet.activitiesCount}</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-white/10 flex justify-end gap-2 relative z-10">
          <button
            onClick={() => {
              playSynthSound(440, 'sine', 0.1);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
          >
            {isAr ? 'إغلاق الكوكب' : 'Close Planet'}
          </button>
        </div>

      </div>
    </div>
  );
}
