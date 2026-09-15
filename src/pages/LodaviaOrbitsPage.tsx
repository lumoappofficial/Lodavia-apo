import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Orbit, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Radio, 
  ShieldCheck, 
  HelpCircle, 
  Trophy, 
  X,
  Users,
  Compass,
  RotateCcw,
  History,
  CheckCircle2
} from 'lucide-react';
import OrbitsBoard, { ORBITS_TEAMS } from '../components/games/orbits/OrbitsBoard';
import type { PlayerInfo } from '../components/games/orbits/OrbitsPlayerCard';
import OrbitsCardHand from '../components/games/orbits/OrbitsCardHand';
import OrbitsControlBar from '../components/games/orbits/OrbitsControlBar';
import { 
  createInitialGameState, 
  getCurrentTeam, 
  drawCard, 
  applyMove, 
  passTurn, 
  TEAMS_CONFIG 
} from '../games/lodaviaOrbits/engine';
import { GameState, TeamId, MoveAction } from '../games/lodaviaOrbits/types';

interface LodaviaOrbitsPageProps {
  onBack?: () => void;
}

// 48 Subtle Cosmic Particles distributed across the entire screen
const COSMIC_STARS = [
  { top: '3%', left: '12%', size: 2, delay: '0.4s', color: '#38bdf8', opacity: 0.6 },
  { top: '5%', left: '48%', size: 1.5, delay: '1.2s', color: '#ffffff', opacity: 0.4 },
  { top: '4%', left: '82%', size: 2.5, delay: '2.1s', color: '#facc15', opacity: 0.5 },
  { top: '8%', left: '26%', size: 1, delay: '0.8s', color: '#ffffff', opacity: 0.3 },
  { top: '9%', left: '68%', size: 2, delay: '3.0s', color: '#34d399', opacity: 0.5 },
  { top: '12%', left: '5%', size: 2, delay: '1.7s', color: '#38bdf8', opacity: 0.5 },
  { top: '14%', left: '94%', size: 1.5, delay: '0.2s', color: '#ffffff', opacity: 0.4 },
  { top: '18%', left: '42%', size: 1, delay: '2.5s', color: '#ffffff', opacity: 0.3 },
  { top: '22%', left: '18%', size: 2, delay: '3.4s', color: '#facc15', opacity: 0.6 },
  { top: '24%', left: '78%', size: 1.5, delay: '1.1s', color: '#38bdf8', opacity: 0.4 },
  { top: '28%', left: '8%', size: 2.5, delay: '0.6s', color: '#ffffff', opacity: 0.5 },
  { top: '32%', left: '92%', size: 1, delay: '2.8s', color: '#fb7185', opacity: 0.4 },
  { top: '36%', left: '3%', size: 1.5, delay: '1.9s', color: '#38bdf8', opacity: 0.3 },
  { top: '40%', left: '96%', size: 2, delay: '0.5s', color: '#facc15', opacity: 0.5 },
  { top: '45%', left: '14%', size: 1, delay: '3.2s', color: '#ffffff', opacity: 0.3 },
  { top: '48%', left: '86%', size: 2, delay: '1.4s', color: '#34d399', opacity: 0.5 },
  { top: '54%', left: '6%', size: 2.5, delay: '2.0s', color: '#38bdf8', opacity: 0.6 },
  { top: '58%', left: '93%', size: 1.5, delay: '0.9s', color: '#ffffff', opacity: 0.4 },
  { top: '64%', left: '16%', size: 1, delay: '2.7s', color: '#facc15', opacity: 0.3 },
  { top: '67%', left: '84%', size: 2, delay: '1.3s', color: '#38bdf8', opacity: 0.5 },
  { top: '72%', left: '4%', size: 1.5, delay: '3.6s', color: '#ffffff', opacity: 0.4 },
  { top: '75%', left: '95%', size: 2, delay: '0.7s', color: '#fb7185', opacity: 0.5 },
  { top: '79%', left: '24%', size: 1, delay: '2.2s', color: '#38bdf8', opacity: 0.3 },
  { top: '82%', left: '74%', size: 2.5, delay: '1.8s', color: '#facc15', opacity: 0.6 },
  { top: '85%', left: '10%', size: 1.5, delay: '0.3s', color: '#ffffff', opacity: 0.4 },
  { top: '88%', left: '88%', size: 2, delay: '2.9s', color: '#34d399', opacity: 0.5 },
  { top: '91%', left: '38%', size: 1, delay: '1.5s', color: '#ffffff', opacity: 0.3 },
  { top: '93%', left: '62%', size: 2, delay: '3.3s', color: '#38bdf8', opacity: 0.5 },
  { top: '96%', left: '18%', size: 1.5, delay: '0.8s', color: '#facc15', opacity: 0.4 },
  { top: '97%', left: '82%', size: 2, delay: '2.4s', color: '#ffffff', opacity: 0.5 },
];

export default function LodaviaOrbitsPage({ onBack }: LodaviaOrbitsPageProps) {
  // Pure Game Engine State Connection
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Current active team from engine
  const currentTeam = getCurrentTeam(gameState);

  // Valid moves for current state and drawn card
  const validMoves = gameState.validMoves;

  // Turn Action Handlers
  const handleDrawCard = () => {
    const nextState = drawCard(gameState);
    setGameState(nextState);
    if (nextState.validMoves.length === 1) {
      setSelectedTokenId(nextState.validMoves[0].tokenId);
    } else {
      setSelectedTokenId(null);
    }
  };

  const handleApplyMove = (move: MoveAction) => {
    const nextState = applyMove(gameState, move);
    setGameState(nextState);
    setSelectedTokenId(null);
  };

  const handlePassTurn = () => {
    const nextState = passTurn(gameState);
    setGameState(nextState);
    setSelectedTokenId(null);
  };

  const handleRestartGame = () => {
    setGameState(createInitialGameState());
    setSelectedTokenId(null);
  };

  // Helper to count finished tokens per team
  const getFinishedCount = (team: TeamId) => {
    return Object.values(gameState.tokens).filter(
      (t) => t.team === team && t.location === 'finished'
    ).length;
  };

  // Convert game state into UI PlayerInfo cards
  const playersByTeam: Record<TeamId, PlayerInfo> = {
    blue: {
      id: 'p-blue',
      nameAr: TEAMS_CONFIG.blue.nameAr,
      nameEn: 'Andromeda',
      avatar: '🚀',
      team: 'blue',
      score: gameState.scores.blue + getFinishedCount('blue') * 500,
      coins: 680,
      isCurrentTurn: currentTeam === 'blue',
      cardsCount: getFinishedCount('blue'),
      isYou: true,
    },
    gold: {
      id: 'p-gold',
      nameAr: TEAMS_CONFIG.gold.nameAr,
      nameEn: 'Helios',
      avatar: '☀️',
      team: 'gold',
      score: gameState.scores.gold + getFinishedCount('gold') * 500,
      coins: 920,
      isCurrentTurn: currentTeam === 'gold',
      cardsCount: getFinishedCount('gold'),
    },
    emerald: {
      id: 'p-emerald',
      nameAr: TEAMS_CONFIG.emerald.nameAr,
      nameEn: 'Aurora',
      avatar: '❇️',
      team: 'emerald',
      score: gameState.scores.emerald + getFinishedCount('emerald') * 500,
      coins: 430,
      isCurrentTurn: currentTeam === 'emerald',
      cardsCount: getFinishedCount('emerald'),
    },
    coral: {
      id: 'p-coral',
      nameAr: TEAMS_CONFIG.coral.nameAr,
      nameEn: 'Mars',
      avatar: '☄️',
      team: 'coral',
      score: gameState.scores.coral + getFinishedCount('coral') * 500,
      coins: 810,
      isCurrentTurn: currentTeam === 'coral',
      cardsCount: getFinishedCount('coral'),
    },
  };

  // Latest event from logs for live status ticker
  const latestLog = gameState.logs[0];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden flex flex-col justify-between select-none">
      
      {/* ─── Animated Deep Cosmic Ambient Background & Slow-Moving Particles ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Cosmic Aurora Gradients */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-sky-500/10 via-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Global Particle Grid Texture */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* Twinkling Starlight Particles */}
        {COSMIC_STARS.map((star, idx) => (
          <div
            key={idx}
            className="absolute rounded-full pointer-events-none animate-[pulse_4s_ease-in-out_infinite]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              animationDelay: star.delay,
              boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
            }}
          />
        ))}
      </div>

      {/* ─── TOP HEADER BAR ─── */}
      <header className="relative z-30 px-3 sm:px-6 py-3 border-b border-sky-500/20 bg-[#090F1C]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back & Game Title */}
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="العودة لمركز الألعاب"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">مركز الألعاب</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
                <Orbit className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                    مدارات لودافيا 🪐
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[10px] font-mono font-bold text-sky-300">
                    Lodavia Orbits
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  محرك اللعب المحلي المباشر (Hot-Seat Engine)
                </p>
              </div>
            </div>
          </div>

          {/* Turn status, History, Restart & Rules */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Turn / Event Banner */}
            {latestLog && (
              <div 
                onClick={() => setShowHistoryModal(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 cursor-pointer hover:border-sky-400/40 transition-all max-w-sm truncate"
                title="اضغط لعرض سجل الأحداث"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{latestLog.messageAr}</span>
              </div>
            )}

            {/* Turn Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              <span>جولة {gameState.turnNumber}</span>
            </div>

            {/* Restart Button */}
            <button
              onClick={handleRestartGame}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="إعادة بدء اللعبة"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">إعادة</span>
            </button>

            {/* History log trigger */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="سجل التحركات"
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">السجل</span>
            </button>

            {/* Rules Button */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">القواعد</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN GAME ARENA (CIRCULAR SPACE BOARD) ─── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-1 sm:p-2 flex flex-col items-center justify-center my-auto min-h-0">
        <div className="w-full flex items-center justify-center my-auto">
          <OrbitsBoard 
            tokens={gameState.tokens}
            validMoves={validMoves}
            selectedTokenId={selectedTokenId}
            onSelectToken={(tId) => setSelectedTokenId(tId)}
            onApplyMove={handleApplyMove}
            currentTeam={currentTeam}
          />
        </div>
      </main>

      {/* ─── BOTTOM PLAYING AREA: CONTROLS & DYNAMIC CARDS HAND ─── */}
      <footer className="relative z-30 pb-3 pt-1 space-y-2 bg-gradient-to-t from-[#050811] via-[#080E1C]/95 to-transparent">
        {/* Mini Control Bar (Directly above the cards) */}
        <OrbitsControlBar 
          onBack={onBack} 
          onOpenRules={() => setShowRulesModal(true)} 
        />

        {/* Dynamic Card Hand & Action Zone */}
        <OrbitsCardHand 
          currentCard={gameState.currentCard}
          phase={gameState.phase}
          currentTeam={currentTeam}
          validMovesCount={validMoves.length}
          deckCount={gameState.deck.length}
          onDrawCard={handleDrawCard}
          onPassTurn={handlePassTurn}
          onApplySingleMove={() => {
            if (selectedTokenId) {
              const m = validMoves.find((move) => move.tokenId === selectedTokenId);
              if (m) handleApplyMove(m);
            } else if (validMoves.length > 0) {
              handleApplyMove(validMoves[0]);
            }
          }}
          hasSingleMove={validMoves.length > 0}
        />
      </footer>

      {/* ─── WINNER MODAL CELEBRATION ─── */}
      <AnimatePresence>
        {gameState.winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#0A1121] border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(250,204,21,0.3)] relative overflow-hidden"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner mb-4 animate-bounce">
                👑
              </div>

              <h2 className="text-2xl font-black text-white">
                فاز فريق {ORBITS_TEAMS[gameState.winner]?.nameAr}!
              </h2>
              <p className="text-xs text-amber-300 font-bold mt-1">
                وصلت جميع مركبات الفريق الـ4 إلى النواة الكونية بنجاح! 🪐✨
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={handleRestartGame}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  بدء جولة جديدة 🚀
                </button>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    العودة لمركز الألعاب
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── GAME HISTORY LOG MODAL ─── */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D1527] border border-sky-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-black text-white">
                    سجل أحداث الجولة الكونية
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 py-4 text-xs text-slate-300 leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
                {gameState.logs.slice(0, 30).map((hist, idx) => {
                  const teamCfg = ORBITS_TEAMS[hist.team];
                  return (
                    <div
                      key={hist.id || idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: teamCfg.colorHex }}
                        />
                        <span className="font-bold text-white">{teamCfg.nameAr}:</span>
                        <span>{hist.messageAr}</span>
                      </div>
                      {hist.cardValue && (
                        <span className="px-2 py-0.5 rounded-md bg-black/50 text-[10px] font-mono text-sky-300">
                          بطاقة [{hist.cardValue}]
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full py-2.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق السجل
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RULES & INFO MODAL ─── */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D1527] border border-sky-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Orbit className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-black text-white">
                    قواعد مدارات لودافيا (Lodavia Orbits)
                  </h3>
                </div>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 py-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-200">
                  <p className="font-bold mb-1">🪐 فكرة اللعبة الأساسية:</p>
                  <p>
                    نسخة فضائية استراتيجية حديثة مستوحاة من ألعاب المدارات التقليدية (جاكارو/Aggravation). يتنافس 4 لاعبين في مدار دائري لإيصال 4 مركبات لكل فريق من المحطة الفضائية إلى النواة الكونية عبر الثقوب الدودية الآمنة.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white text-sm">قواعد المحرك التكتيكي:</h4>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong className="text-sky-300">إطلاق المركبة:</strong> تتطلب بطاقة 1 أو 12 لإخراج مركبة جديدة من المحطة إلى نقطة الانطلاق في المدار.</li>
                    <li><strong className="text-emerald-300">أسر مركبة الخصم:</strong> إذا استقرت مركبتك على نفس نقطة مدار الخصم، يتم أسرها وإعادتها فوراً إلى محطته الأصلية.</li>
                    <li><strong className="text-amber-300">ممر الأمان:</strong> بعد إكمال دورة المدار، تدخل مركبتك الثقب الدودي الآمن ولا يمكن لأي خصم دخول ممرك.</li>
                    <li><strong className="text-rose-300">الوصول الدقيق للنواة:</strong> يتطلب دخول النواة الكونية عدداً دقيقاً من الخطوات المتبقية دون تجاوز.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-bold text-white">الفرق الأربعة:</p>
                  <p className="text-slate-400">
                    محطة أندروميدا (أزرق سماوي)، محطة هليوس (ذهبي شمسي)، محطة أورورا (زمردي)، ومحطة المريخ (مرجان ناري).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-sky-500/25"
              >
                فهمت، جاهز للمدار 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
