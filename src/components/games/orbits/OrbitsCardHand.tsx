import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Rocket, ArrowRight, AlertCircle } from 'lucide-react';
import { OrbitsCard, TeamId, TurnPhase } from '../../../games/lodaviaOrbits/types';
import { ORBITS_TEAMS } from './OrbitsBoard';

export interface SimpleHandCard {
  id: string;
  value: number;
  canExitBase: boolean;
  themeColor: string;
}

// 5 Standard default cards (1, 2, 4, 7, 12)
export const DEFAULT_HAND_CARDS: SimpleHandCard[] = [
  { id: 'card-1', value: 1, canExitBase: true, themeColor: '#38bdf8' },
  { id: 'card-2', value: 2, canExitBase: false, themeColor: '#34d399' },
  { id: 'card-4', value: 4, canExitBase: false, themeColor: '#fb7185' },
  { id: 'card-7', value: 7, canExitBase: false, themeColor: '#a78bfa' },
  { id: 'card-12', value: 12, canExitBase: true, themeColor: '#facc15' },
];

export interface OrbitsCardHandProps {
  currentCard?: OrbitsCard | null;
  phase?: TurnPhase;
  currentTeam?: TeamId;
  validMovesCount?: number;
  deckCount?: number;
  onDrawCard?: () => void;
  onPassTurn?: () => void;
  onApplySingleMove?: () => void;
  hasSingleMove?: boolean;
}

export default function OrbitsCardHand({
  currentCard,
  phase = 'need_draw',
  currentTeam = 'blue',
  validMovesCount = 0,
  deckCount = 48,
  onDrawCard,
  onPassTurn,
  onApplySingleMove,
  hasSingleMove = false,
}: OrbitsCardHandProps) {
  const teamConfig = ORBITS_TEAMS[currentTeam] || ORBITS_TEAMS.blue;

  // Compute the 5 visible cards in the hand
  const displayCards = useMemo(() => {
    if (!currentCard) {
      return DEFAULT_HAND_CARDS.map((card) => ({
        ...card,
        isDrawn: false,
      }));
    }

    const activeVal = currentCard.value;
    const canExit = activeVal === 1 || activeVal === 12;
    const color = currentCard.themeColor || (activeVal === 1 ? '#38bdf8' : activeVal === 12 ? '#facc15' : '#34d399');

    const formattedActiveCard: SimpleHandCard & { isDrawn: boolean } = {
      id: currentCard.id || `card-${activeVal}`,
      value: activeVal,
      canExitBase: canExit,
      themeColor: color,
      isDrawn: true,
    };

    // If matches one of the default cards, replace it; otherwise replace the middle card
    const matchIndex = DEFAULT_HAND_CARDS.findIndex((c) => c.value === activeVal);

    if (matchIndex !== -1) {
      return DEFAULT_HAND_CARDS.map((c, idx) =>
        idx === matchIndex ? formattedActiveCard : { ...c, isDrawn: false }
      );
    }

    const cards = [...DEFAULT_HAND_CARDS.map((c) => ({ ...c, isDrawn: false }))];
    cards[2] = formattedActiveCard;
    return cards;
  }, [currentCard]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-1.5 select-none px-2">
      
      {/* ─── COMPACT NOTIFICATION & ACTION STRIP ─── */}
      <div className="w-full max-w-xl px-3 py-1 rounded-xl bg-[#090F1C]/90 backdrop-blur-xl border border-sky-500/20 shadow-md flex items-center justify-between gap-2 min-h-[38px]">
        
        {/* CASE 1: Need to draw card */}
        {phase === 'need_draw' && (
          <>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: teamConfig.colorHex }}
              />
              <span>
                دور <strong style={{ color: teamConfig.colorHex }}>{teamConfig.nameAr}</strong> — اسحب بطاقة لبدء الدور
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                {deckCount} 🎴
              </span>
              <button
                onClick={onDrawCard}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-sky-500/25 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>سحب بطاقة</span>
              </button>
            </div>
          </>
        )}

        {/* CASE 2: Card drawn, but NO moves possible */}
        {phase === 'need_move' && validMovesCount === 0 && (
          <>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>لا يمكنك تحريك أي مركبة بهذه البطاقة</span>
            </div>

            <button
              onClick={onPassTurn}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-sky-500/25 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>تمرير الدور للاعب التالي</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* CASE 3: Card drawn, with valid moves available */}
        {phase === 'need_move' && validMovesCount > 0 && (
          <>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Rocket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                اختر مركبة للتحرك <strong className="text-emerald-400">({validMovesCount} متاح)</strong>
              </span>
            </div>

            {hasSingleMove && onApplySingleMove && (
              <button
                onClick={onApplySingleMove}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-sky-500/25 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>تحريك المركبة</span>
              </button>
            )}
          </>
        )}

        {/* Fallback for other phases */}
        {phase !== 'need_draw' && phase !== 'need_move' && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>اكتملت الجولة الحالية</span>
          </div>
        )}
      </div>

      {/* ─── MINIMALIST ELEGANT CARDS STRIP ─── */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 py-1 overflow-x-auto max-w-full scrollbar-none">
        {displayCards.map((card) => {
          const isDrawn = card.isDrawn;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                y: isDrawn ? -6 : 0,
                scale: isDrawn ? 1.05 : 1,
                opacity: currentCard ? (isDrawn ? 1 : 0.5) : 0.9,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => {
                if (phase === 'need_draw' && onDrawCard) {
                  onDrawCard();
                } else if (isDrawn && hasSingleMove && onApplySingleMove) {
                  onApplySingleMove();
                }
              }}
              className={`relative w-14 sm:w-16 h-20 sm:h-24 rounded-xl p-2 flex flex-col justify-between backdrop-blur-xl transition-all select-none shrink-0 cursor-pointer ${
                isDrawn
                  ? 'border-2 border-sky-400 bg-[#0C162D]/95 shadow-[0_0_20px_rgba(56,189,248,0.45)] ring-2 ring-sky-400/40'
                  : 'border border-white/10 bg-[#090F1C]/85 hover:border-white/20 hover:opacity-100'
              }`}
            >
              {/* Corner 1: Small Number in top corner */}
              <div className="flex items-center justify-between w-full">
                <span
                  className="text-[11px] sm:text-xs font-mono font-black tracking-tight"
                  style={{ color: card.themeColor }}
                >
                  {card.value}
                </span>

                {isDrawn && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                )}
              </div>

              {/* Center: Big and clear number */}
              <div className="flex items-center justify-center my-auto">
                <span
                  className="text-2xl sm:text-3xl font-mono font-black tracking-tight select-none"
                  style={{
                    color: card.themeColor,
                    textShadow: `0 0 16px ${card.themeColor}50`,
                  }}
                >
                  {card.value}
                </span>
              </div>

              {/* Bottom: Single tiny icon representing the game rule */}
              <div 
                className="flex items-center justify-center pt-0.5 border-t border-white/5"
                title={card.canExitBase ? "إطلاق من المحطة" : `${card.value} خطوات للأمام`}
              >
                {card.canExitBase ? (
                  <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
                ) : (
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 rotate-180" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
