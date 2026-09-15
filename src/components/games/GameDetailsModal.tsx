import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Users, 
  Clock, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Rocket, 
  Flame 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { GameCardInfo } from '../../types/games';

interface GameDetailsModalProps {
  game: GameCardInfo | null;
  onClose: () => void;
  onPlayNow: (game: GameCardInfo) => void;
  onCreateRoom: (game: GameCardInfo) => void;
}

export default function GameDetailsModal({ game, onClose, onPlayNow, onCreateRoom }: GameDetailsModalProps) {
  const { lang } = useApp();

  if (!game) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl bg-slate-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 md:left-auto md:right-5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER BADGE & TITLE */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                {lang === 'ar' ? game.badgeAr : game.badgeEn}
              </span>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full font-bold">
                +{game.xpReward} XP • +{game.pointsReward} 💎
              </span>
            </div>

            <h2 className="text-2xl font-black text-white">
              {lang === 'ar' ? game.titleAr : game.titleEn}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar' ? game.fullDescAr : game.fullDescEn}
            </p>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/60 border border-white/10 rounded-2xl mb-6 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'عدد اللاعبين' : 'Players'}</div>
              <div className="font-black text-cyan-300 mt-1 flex items-center justify-center gap-1">
                <Users className="w-4 h-4" />
                <span>{game.minPlayers === game.maxPlayers ? game.minPlayers : `${game.minPlayers} - ${game.maxPlayers}`}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'مدة الجولة' : 'Duration'}</div>
              <div className="font-black text-purple-300 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                <span>~{game.avgDurationMinutes} {lang === 'ar' ? 'دقائق' : 'mins'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'مستوى الصعوبة' : 'Difficulty'}</div>
              <div className="font-black text-yellow-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{lang === 'ar' ? 'متوازن / ممتع' : 'Balanced'}</span>
              </div>
            </div>
          </div>

          {/* RULES SECTION */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'قواعد وتعليمات اللعبة:' : 'Game Rules & Steps:'}</span>
            </h3>

            <div className="space-y-2 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
              {(lang === 'ar' ? game.rulesAr : game.rulesEn).map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onPlayNow(game);
              }}
              className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-black shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'ar' ? 'العب الآن فوراً 🚀' : 'Play Now Instantly 🚀'}</span>
            </button>

            {game.maxPlayers > 1 && (
              <button
                onClick={() => {
                  onClose();
                  onCreateRoom(game);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إنشاء غرفة ودعوة أصدقائك' : 'Create Custom Room'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
