import React, { useState } from 'react';
import { 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Users, 
  Lightbulb, 
  Clock, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldAlert 
} from 'lucide-react';
import { ParallelGate } from '../../types/parallelWorld';
import { PARALLEL_GATES } from '../../data/parallelWorldData';

interface ParallelGatesSectionProps {
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onSelectGate: (gateId: string) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
}

export default function ParallelGatesSection({
  lang,
  playSynthSound,
  onSelectGate,
  onGrantXp
}: ParallelGatesSectionProps) {
  const isAr = lang === 'ar';

  const [activeGateModal, setActiveGateModal] = useState<ParallelGate | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleSuccess, setRiddleSuccess] = useState(false);

  const gates = PARALLEL_GATES;

  const handleOpenGate = (gate: ParallelGate) => {
    playSynthSound(750, 'triangle', 0.2);
    if (gate.id === 'future') {
      onSelectGate('what_if');
    } else {
      setActiveGateModal(gate);
    }
  };

  const handleSolveRiddle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riddleAnswer.trim()) return;

    playSynthSound(900, 'sine', 0.25);
    onGrantXp(250, 'حل لغز كوني في بوابة المجهول', 'Solved cosmic riddle in Unknown Gate');
    setRiddleSuccess(true);
    setRiddleAnswer('');
    setTimeout(() => {
      setRiddleSuccess(false);
      setActiveGateModal(null);
    }, 2500);
  };

  return (
    <div className="w-full flex flex-col gap-6 glass-panel bg-slate-950/95 text-slate-100 rounded-3xl border border-purple-500/30 p-5 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 text-purple-300">
            <Layers className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'البوابات الموازية الغامضة 🚪' : 'Mystic Parallel Gates 🚪'}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr ? 'بوابات زمانية ومكانية تفتح آفاقاً جديدة للتحديات وتجارب المستقبل' : 'Temporal & spatial portals unlocking futuristic trials & experiences'}
            </p>
          </div>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {gates.map((gate) => (
          <div 
            key={gate.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 transition duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden shadow-xl"
          >
            {/* Top Badge */}
            <div className="flex justify-between items-center">
              <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition">
                {gate.icon}
              </span>
              <span className="text-[10px] font-black uppercase bg-purple-500/15 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
                {gate.badge}
              </span>
            </div>

            {/* Title & Desc */}
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition">
                {isAr ? gate.nameAr : gate.nameEn}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {isAr ? gate.descriptionAr : gate.descriptionEn}
              </p>
            </div>

            {/* Action */}
            <button
              onClick={() => handleOpenGate(gate)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{isAr ? 'دخول البوابة الآن 🚀' : 'Enter Portal 🚀'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Active Gate Modal */}
      {activeGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/15 shadow-2xl flex flex-col gap-4 animate-scaleIn relative">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeGateModal.icon}</span>
                <h4 className="text-sm font-black text-white">
                  {isAr ? activeGateModal.nameAr : activeGateModal.nameEn}
                </h4>
              </div>
              <button 
                onClick={() => setActiveGateModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content per Gate */}
            {activeGateModal.id === 'unknown' && (
              <form onSubmit={handleSolveRiddle} className="flex flex-col gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                  <span className="font-bold block mb-1">🧩 لغز البوابة الكونية:</span>
                  <span>"ما هو الشيء الذي يحمله جميع مستكشفي لودافيا، يزداد بالتعلم، ولا ينقص بالمشاركة؟"</span>
                </div>

                <input
                  type="text"
                  value={riddleAnswer}
                  onChange={(e) => setRiddleAnswer(e.target.value)}
                  placeholder={isAr ? 'اكتب إجابة اللغز هنا...' : 'Type riddle answer...'}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />

                {riddleSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>إجابة عبقرية! +250 XP 🎉</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs"
                >
                  تأكيد الإجابة وإكمال التحدي
                </button>
              </form>
            )}

            {activeGateModal.id !== 'unknown' && (
              <div className="flex flex-col gap-3 text-center py-4">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isAr 
                    ? `أهلاً بك في ${activeGateModal.nameAr}! تم تفعيل طاقة هذه البوابة لمضاعفة مكافآت XP الخاصة بك في الأنشطة الكونية.` 
                    : `Welcome to ${activeGateModal.nameEn}! Energy activated.`}
                </p>
                <button
                  onClick={() => {
                    onGrantXp(180, `تفعيل طاقة ${activeGateModal.nameAr}`, `Activated gate energy`);
                    setActiveGateModal(null);
                  }}
                  className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40"
                >
                  {isAr ? 'شحن الطاقة الآن (+180 XP)' : 'Charge Energy (+180 XP)'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
