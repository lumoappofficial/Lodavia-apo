import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  JOURNEY_TRACKS, 
  getCurrentStage, 
  getNextStage, 
  JourneyTrackConfig 
} from '../data/journeyConfig';
import { ArrowLeft, Compass, Sparkles, Trophy, Star } from 'lucide-react';
import { themeStyles } from '../styles/theme';
import PageGlow from '../components/PageGlow';

export default function LodaviaJourneyPage() {
  const { currentUser, lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const stats = currentUser.journeyStats || {
    learning: 0,
    helping: 0,
    creating: 0,
    gaming: 0,
    community: 0
  };

  return (
    <div className="w-full text-slate-100 min-h-screen pb-16 animate-[fadeIn_0.4s_ease-out]">
      <PageGlow color="aurora" />
      
      {/* Header & Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            playSynthSound(400, 'sine', 0.08);
            navigate(-1);
          }}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
          title={isRtl ? 'العودة' : 'Go Back'}
        >
          <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-aurora-400 via-cyan-400 to-nova-400 bg-clip-text text-transparent flex items-center gap-2">
            <Compass className="w-8 h-8 text-aurora-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span>{isRtl ? 'رحلة لودافيا الكونية' : 'Lodavia Cosmic Journey'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? 'تطور هويتك الرقمية وبناء كوكبك الشخصي عبر التفاعل والتعلّم والإبداع في المجرة.' 
              : 'Evolve your cosmic identity and shape your personal planet through engagement and learning.'}
          </p>
        </div>
      </div>

      {/* Central Planet Cosmic Visualizer */}
      <div className="cosmic-glass-panel p-6 mb-8 relative overflow-hidden flex flex-col items-center justify-center border border-purple-500/40 bg-[#080d1a] shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-purple-400/30 text-[10px] text-purple-200 font-black">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>{isRtl ? 'خريطة الكوكب الكوني' : 'Cosmic Planet Orbit'}</span>
        </div>

        {/* Orbit Area */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
          
          {/* Orbit Line Ring */}
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-dashed border-purple-500/30 animate-[spin_60s_linear_infinite]" />

          {/* Central Planet Sphere */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-aurora-400 via-purple-700 to-slate-950 shadow-[0_0_60px_rgba(168,85,247,0.45)] border-2 border-purple-400/40 flex flex-col items-center justify-center text-center p-3 relative z-10">
            <div className="text-3xl mb-1 animate-bounce">🪐</div>
            <span className="text-xs font-extrabold text-white tracking-wide">
              {isRtl ? 'كوكب لودافيا' : 'Lodavia Planet'}
            </span>
            <span className="text-[10px] font-bold text-cyan-300 mt-0.5">
              {isRtl ? 'المستوى الكوني' : 'Cosmic Level'}
            </span>
          </div>

          {/* 5 Orbiting Stage Icons */}
          {JOURNEY_TRACKS.map((track, i) => {
            const count = stats[track.id] || 0;
            const stage = getCurrentStage(track, count);
            const angleRad = ((i * 72) - 90) * (Math.PI / 180);
            const radius = 41; // radius in percentage
            const topPercent = 50 + radius * Math.sin(angleRad);
            const leftPercent = 50 + radius * Math.cos(angleRad);

            return (
              <div
                key={track.id}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={`${isRtl ? track.titleAr : track.titleEn}: ${isRtl ? stage.labelAr : stage.labelEn}`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950/80 border border-purple-400/40 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-125 transition-transform duration-300 shadow-purple-500/20">
                  {stage.icon}
                </div>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-bold text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {isRtl ? stage.labelAr : stage.labelEn}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center max-w-md mt-2">
          {isRtl 
            ? 'كل رمز حول الكوكب يمثل أعلى إنجاز وصلت إليه في المسارات الخمسة الأساسية.' 
            : 'Each symbol orbiting your planet reflects your highest achievement in the 5 main tracks.'}
        </p>
      </div>

      {/* Track Cards Grid */}
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>{isRtl ? 'مسارات التطور والنمو' : 'Evolution Tracks'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {JOURNEY_TRACKS.map((track) => {
            const userCount = stats[track.id] || 0;
            const currentStage = getCurrentStage(track, userCount);
            const nextStage = getNextStage(track, userCount);

            let percent = 100;
            let remaining = 0;

            if (nextStage) {
              const prevThreshold = currentStage.threshold;
              const nextThreshold = nextStage.threshold;
              remaining = nextThreshold - userCount;
              percent = Math.min(
                100,
                Math.max(0, ((userCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
              );
            }

            return (
              <div
                key={track.id}
                className={`${themeStyles.glassCard} p-5 flex flex-col justify-between gap-4 border-white/10 hover:border-purple-500/30 transition-all`}
              >
                {/* Track Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {currentStage.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">
                        {isRtl ? track.titleAr : track.titleEn}
                      </h3>
                      <p className="text-xs font-bold text-cyan-400 mt-0.5">
                        {isRtl ? currentStage.labelAr : currentStage.labelEn}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-black text-slate-300">
                    {userCount} {isRtl ? 'إجراء' : 'pts'}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl ? track.descriptionAr : track.descriptionEn}
                </p>

                {/* Progress Bar & Next Level Info */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>
                      {isRtl ? `المرحلة الحالية: ${currentStage.labelAr}` : `Current: ${currentStage.labelEn}`}
                    </span>
                    <span>
                      {nextStage 
                        ? (isRtl ? `التالي: ${nextStage.labelAr}` : `Next: ${nextStage.labelEn}`)
                        : (isRtl ? 'المستوى الأقصى 🔥' : 'Max Level 🔥')}
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${track.color} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>
                      {nextStage 
                        ? (isRtl ? `متبقي ${remaining} خطوة للوصول` : `${remaining} steps needed`)
                        : (isRtl ? 'أنجزت جميع مراحل هذا المسار' : 'All stages unlocked')}
                    </span>
                    <span className="font-mono text-purple-300">
                      {Math.round(percent)}%
                    </span>
                  </div>

                  {/* Direct Action Navigation */}
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      const routes: { [key: string]: string } = {
                        learning: '/ai-assistant',
                        helping: '/match',
                        creating: '/world',
                        gaming: '/games',
                        community: '/communities'
                      };
                      navigate(routes[track.id] || '/explore');
                    }}
                    className="mt-2 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black text-cyan-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {track.id === 'learning' && (isRtl ? 'زيادة الرصيد عبر التعلم 🧠' : 'Level Up by Learning 🧠')}
                      {track.id === 'helping' && (isRtl ? 'مساعدة شريك في المطابقة 🤝' : 'Help Buddies in Match 🤝')}
                      {track.id === 'creating' && (isRtl ? 'بناء وتطوير كوكبك 🪐' : 'Build Your World 🪐')}
                      {track.id === 'gaming' && (isRtl ? 'لعب جولة ألعاب كونية 🎮' : 'Play Cosmic Games 🎮')}
                      {track.id === 'community' && (isRtl ? 'المشاركة في المجتمعات 👥' : 'Join Communities 👥')}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
