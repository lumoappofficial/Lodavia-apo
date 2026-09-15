import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Flame, 
  Clock, 
  HelpCircle,
  Zap,
  Check,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { CHALLENGE_QUESTIONS } from '../../data/gamesData';

interface LodaviaChallengeGameProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

export default function LodaviaChallengeGame({ onBack, onFinishGame }: LodaviaChallengeGameProps) {
  const { lang, playSynthSound } = useApp();

  const triggerSound = (freq: number, type: 'sine' | 'sawtooth' = 'sine', duration = 0.1) => {
    playSynthSound(freq, type, duration);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');

  const currentQ = CHALLENGE_QUESTIONS[currentIndex];

  // Timer Effect
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isAnswered, currentIndex]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setStreak(0);
    triggerSound(180, 'sawtooth', 0.25);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      triggerSound(880, 'sine', 0.1);
      setTimeout(() => triggerSound(1100, 'sine', 0.12), 90);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Speed Multiplier + Combo Multiplier
      const speedBonus = timeLeft * 10;
      const comboMultiplier = 1 + (newStreak * 0.2);
      const pointsEarned = Math.round((100 + speedBonus) * comboMultiplier);

      setScore(prev => prev + pointsEarned);
    } else {
      triggerSound(200, 'sawtooth', 0.2);
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < CHALLENGE_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setGameState('completed');
      triggerSound(523, 'sine', 0.1);
      setTimeout(() => triggerSound(783, 'sine', 0.2), 100);

      // Final rewards based on score
      const finalXp = Math.min(200, 50 + score / 10);
      const finalPts = Math.min(80, 20 + score / 25);
      onFinishGame(Math.round(finalXp), Math.round(finalPts), score >= 500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-slate-950/90 border border-amber-500/30 rounded-3xl shadow-2xl text-white">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'ar' ? 'العودة لمركز الألعاب' : 'Back to Games Hub'}
        </button>

        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
            {lang === 'ar' ? 'تحدي لودافيا للذكاء والسرعة 🧠' : 'Lodavia Speed Trivia 🧠'}
          </h2>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-300">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Combo x{(1 + streak * 0.2).toFixed(1)}</span>
        </div>
      </div>

      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* QUESTION HEADER HUD */}
          <div className="flex items-center justify-between text-xs font-mono bg-slate-900/60 p-3 rounded-2xl border border-white/5">
            <span className="text-slate-400">
              {lang === 'ar' ? `السؤال ${currentIndex + 1} من ${CHALLENGE_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${CHALLENGE_QUESTIONS.length}`}
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{score} pts</span>
              </div>

              <div className={`flex items-center gap-1 font-bold ${timeLeft <= 4 ? 'text-rose-500 animate-bounce' : 'text-cyan-400'}`}>
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="p-6 bg-slate-900/80 border border-amber-500/20 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base md:text-lg font-black text-white leading-relaxed">
              {lang === 'ar' ? currentQ.questionAr : currentQ.questionEn}
            </h3>

            {/* OPTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {(lang === 'ar' ? currentQ.optionsAr : currentQ.optionsEn).map((opt, idx) => {
                let btnStyle = 'bg-slate-900 border-white/10 text-slate-200 hover:border-amber-400/60 hover:bg-amber-950/20';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-start transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION FOOTER */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-black/50 border border-white/10 rounded-2xl space-y-3 pt-4"
              >
                <div className="text-xs text-amber-300 font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ar' ? 'معلومة لودافيا الشيقة:' : 'Fun Lodavia Fact:'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ar' ? currentQ.explanationAr : currentQ.explanationEn}
                </p>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-lg"
                >
                  {currentIndex + 1 < CHALLENGE_QUESTIONS.length
                    ? (lang === 'ar' ? 'السؤال التالي ➡️' : 'Next Question ➡️')
                    : (lang === 'ar' ? 'عرض النتيجة والشهادة 🏆' : 'View Scorecard 🏆')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}
      {gameState === 'completed' && (
        <div className="py-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {lang === 'ar' ? '🎉 اكتمل تحدي لودافيا للذكاء بنجاح!' : '🎉 Speed Challenge Completed!'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              {lang === 'ar' ? 'أداء عقلي واستجابة كونية رائعة! تم حفظ مجموع نقاطك.' : 'Great cosmic reaction time! Your points have been added.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
            <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl">
              <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'مجموع النقاط' : 'Final Score'}</div>
              <div className="text-amber-400 font-black text-lg mt-1">{score}</div>
            </div>

            <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl">
              <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'أعلى السلسلة' : 'Max Streak'}</div>
              <div className="text-orange-400 font-black text-lg mt-1">{maxStreak}🔥</div>
            </div>

            <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl col-span-2 md:col-span-1">
              <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'مكافأة لودافيا' : 'Points Earned'}</div>
              <div className="text-cyan-300 font-black text-lg mt-1">+{Math.min(80, Math.round(20 + score / 25))} 💎</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setScore(0);
                setStreak(0);
                setTimeLeft(15);
                setGameState('playing');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-black flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'ar' ? 'إعادة التحدي الآن' : 'Replay Speed Challenge'}
            </button>

            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 text-slate-200 rounded-2xl text-xs font-black"
            >
              {lang === 'ar' ? 'العودة للمركز' : 'Return to Games Hub'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
