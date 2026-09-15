import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Rocket, 
  Flame, 
  Bot, 
  Zap, 
  Trophy, 
  Lock, 
  Play, 
  Info, 
  Compass, 
  Users, 
  ShieldAlert,
  ChevronRight,
  Star
} from 'lucide-react';
import { PlanetLocation, GameId } from '../../types/games';
import { LODAVIA_PLANETS } from '../../data/universeData';
import { useApp } from '../../contexts/AppContext';

interface LodaviaGalaxyMapProps {
  playerLevel: number;
  onSelectPlanetGame: (gameId: GameId) => void;
  onOpenCitadelCustomizer: () => void;
}

export default function LodaviaGalaxyMap({
  playerLevel,
  onSelectPlanetGame,
  onOpenCitadelCustomizer
}: LodaviaGalaxyMapProps) {
  const { lang, playSynthSound } = useApp();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetLocation | null>(LODAVIA_PLANETS[0]);

  const getPlanetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6 text-rose-400" />;
      case 'Rocket': return <Rocket className="w-6 h-6 text-cyan-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-purple-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-pink-400" />;
      default: return <Sparkles className="w-6 h-6 text-yellow-300" />;
    }
  };

  return (
    <div className="relative w-full min-h-[550px] md:min-h-[620px] rounded-3xl bg-[#080512] border border-purple-500/30 overflow-hidden shadow-2xl p-4 md:p-6 flex flex-col justify-between">
      {/* ANIMATED SPACE BACKGROUND WITH STARS & NEBULA GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px]" />

        {/* ORBIT LINES */}
        <svg className="w-full h-full opacity-20 stroke-purple-400" style={{ fill: 'none' }}>
          <ellipse cx="50%" cy="50%" rx="38%" ry="32%" strokeDasharray="6 6" strokeWidth="1.5" />
          <ellipse cx="50%" cy="50%" rx="24%" ry="20%" strokeDasharray="4 4" strokeWidth="1" />
        </svg>

        {/* FLOATING STARS */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-60 animate-ping"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 37) % 90 + 5}%`,
              left: `${(i * 53) % 90 + 5}%`,
              animationDuration: `${(i % 4) + 2}s`
            }}
          />
        ))}
      </div>

      {/* TOP MAP HEADER */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl">
            <Compass className="w-5 h-5 text-purple-300 animate-spin" style={{ animationDuration: '20s' }} />
          </span>
          <div>
            <h2 className="font-black text-sm text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'خريطة مجرة لودافيا التفاعلية 🪐' : 'Lodavia Interactive Galaxy Map 🪐'}</span>
            </h2>
            <p className="text-[10px] text-slate-300">
              {lang === 'ar' ? 'انقر على الكواكب لاستكشاف الألعاب، التحديات، ومقر القلعة' : 'Click planets to explore games, challenges, and Citadel Central'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold rounded-full">
            {lang === 'ar' ? `مستواك الحالي: Lv.${playerLevel}` : `Current Level: Lv.${playerLevel}`}
          </span>
        </div>
      </div>

      {/* INTERACTIVE PLANETS NODES CANVAS */}
      <div className="relative z-10 w-full h-[360px] md:h-[420px] my-4">
        {LODAVIA_PLANETS.map((planet) => {
          const isUnlocked = playerLevel >= planet.levelReq;
          const isSelected = selectedPlanet?.id === planet.id;

          return (
            <div
              key={planet.id}
              style={{
                top: `${planet.yPercent}%`,
                left: `${planet.xPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-20 flex flex-col items-center group cursor-pointer"
              onClick={() => {
                setSelectedPlanet(planet);
                if (playSynthSound) playSynthSound(600, 'sine', 0.08);
              }}
            >
              {/* PLANET NODE ORB */}
              <div
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected ? 'scale-125 ring-4 ring-white shadow-2xl' : 'hover:scale-110'
                } ${isUnlocked ? 'shadow-lg' : 'opacity-60 grayscale'}`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}, #090618)`,
                  boxShadow: isSelected ? `0 0 30px ${planet.color}` : `0 0 15px ${planet.color}80`
                }}
              >
                {/* RING FOR CENTRAL OR SPECIAL PLANETS */}
                {planet.type === 'citadel_hub' && (
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-40" />
                )}

                {getPlanetIcon(planet.icon)}

                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>

              {/* PLANET LABEL */}
              <div
                className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wide border whitespace-nowrap backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white border-white scale-105 shadow-md'
                    : 'bg-slate-950/90 text-slate-200 border-white/10 group-hover:border-purple-400'
                }`}
              >
                {lang === 'ar' ? planet.nameAr : planet.nameEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED PLANET INFO HUD MODAL / BAR */}
      <AnimatePresence mode="wait">
        {selectedPlanet && (
          <motion.div
            key={selectedPlanet.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`relative z-20 bg-gradient-to-r ${selectedPlanet.bgGradient} border border-white/20 p-4 md:p-5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-white/10 text-white text-[10px] font-black rounded-full uppercase border border-white/20">
                  {selectedPlanet.type === 'citadel_hub'
                    ? (lang === 'ar' ? 'القلعة المركزية 🪐' : 'Central Citadel 🪐')
                    : (lang === 'ar' ? 'كوكب الألعاب 🚀' : 'Game Planet 🚀')}
                </span>

                {playerLevel < selectedPlanet.levelReq && (
                  <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{lang === 'ar' ? `يتطلب المستوى ${selectedPlanet.levelReq}` : `Requires Level ${selectedPlanet.levelReq}`}</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-white">
                {lang === 'ar' ? selectedPlanet.nameAr : selectedPlanet.nameEn}
              </h3>

              <p className="text-xs text-slate-300">
                {lang === 'ar' ? selectedPlanet.taglineAr : selectedPlanet.taglineEn}
              </p>
            </div>

            {/* LAUNCH BUTTON */}
            <div className="shrink-0 w-full md:w-auto">
              {selectedPlanet.type === 'citadel_hub' ? (
                <button
                  onClick={onOpenCitadelCustomizer}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{lang === 'ar' ? 'دخول قلعة التخصيص والجوائز' : 'Enter Citadel & Customizer'}</span>
                </button>
              ) : selectedPlanet.gameId && playerLevel >= selectedPlanet.levelReq ? (
                <button
                  onClick={() => onSelectPlanetGame(selectedPlanet.gameId!)}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{lang === 'ar' ? 'هبوط ولعب اللعبة 🚀' : 'Land & Launch Game 🚀'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full md:w-auto px-6 py-3 bg-slate-800 text-slate-500 rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'الكوكب مقفل حالياً' : 'Planet Locked'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
