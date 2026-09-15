import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { syncEngine } from '../../offline/syncEngine';
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Award, 
  Zap,
  Flame,
  Brain
} from 'lucide-react';

interface GameProps {
  onPointsEarned: (pts: number, gameName: string) => void;
}

// ==========================================
// 1. Cosmic Trivia Game (Offline)
// ==========================================
const TRIVIA_QUESTIONS = [
  {
    id: 1,
    questionAr: 'ما هو أقرب كوكب إلى الشمس في مجموعتنا الشمسية؟',
    questionEn: 'Which planet is closest to the Sun in our Solar System?',
    optionsAr: ['عطارد', 'الزهرة', 'المريخ', 'الأرض'],
    optionsEn: ['Mercury', 'Venus', 'Mars', 'Earth'],
    correct: 0,
    explanationAr: 'عطارد هو أقرب كواكب المجموعة الشمسية إلى الشمس ويمتلك أسرع مدة دوران حولها (88 يوماً).',
    explanationEn: 'Mercury is closest to the Sun and completes an orbit every 88 Earth days.'
  },
  {
    id: 2,
    questionAr: 'ما هي التقنية المستخدمة لتخزين البيانات المحلية في التطبيقات غير المتصلة بالإنترنت؟',
    questionEn: 'Which web API is used for structured offline database storage in PWAs?',
    optionsAr: ['IndexedDB', 'Cookie', 'SessionStorage', 'CSS Grid'],
    optionsEn: ['IndexedDB', 'Cookie', 'SessionStorage', 'CSS Grid'],
    correct: 0,
    explanationAr: 'تتيح قاعدة بيانات IndexedDB تخزين كميات كبيرة من البيانات الهيكلية والملفات بجهاز المستخدم.',
    explanationEn: 'IndexedDB enables local storage of large structured datasets and files on client device.'
  },
  {
    id: 3,
    questionAr: 'أي من التلسكوبات الفضائية التالية يعتبر الأحدث وأرسل صوراً عالية الدقة للسدم البعيدة؟',
    questionEn: 'Which is the newest space telescope providing high-res deep space Infrared images?',
    optionsAr: ['تلسكوب جيمس ويب (JWST)', 'تلسكوب هابل', 'تلسكوب كبلر', 'تلسكوب سبيتزر'],
    optionsEn: ['James Webb Telescope (JWST)', 'Hubble Telescope', 'Kepler Telescope', 'Spitzer Telescope'],
    correct: 0,
    explanationAr: 'تلسكوب جيمس ويب تم إطلاقه بإنفجار الأشعة تحت الحمراء المتطورة لاستكشاف بداية الكون.',
    explanationEn: 'James Webb Space Telescope launched to study infrared astronomy and galaxy origins.'
  },
  {
    id: 4,
    questionAr: 'ما هو العنصر الكيميائي الأكثر وفرة في الكون المشاهد؟',
    questionEn: 'What is the most abundant chemical element in the observable universe?',
    optionsAr: ['الهيدروجين', 'الهيليوم', 'الأكسجين', 'النيتروجين'],
    optionsEn: ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen'],
    correct: 0,
    explanationAr: 'يشكل الهيدروجين حوالي 75% من المادة المادية في الكون.',
    explanationEn: 'Hydrogen constitutes roughly 75% of elemental mass in the universe.'
  }
];

export function CosmicTriviaGame({ onPointsEarned }: GameProps) {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentIndex];

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === currentQ.correct) {
      playSynthSound(880, 'sine', 0.1);
      setTimeout(() => playSynthSound(1174, 'sine', 0.2), 100);
      setScore(prev => prev + 1);
    } else {
      playSynthSound(200, 'sawtooth', 0.25);
    }
  };

  const handleNext = () => {
    playSynthSound(550, 'sine', 0.08);
    if (currentIndex < TRIVIA_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      const pointsEarned = score * 15;
      if (pointsEarned > 0) {
        onPointsEarned(pointsEarned, isRtl ? 'اختبار LODAVIA الكوني' : 'LODAVIA Cosmic Trivia');
      }
    }
  };

  const handleReset = () => {
    playSynthSound(400, 'sine', 0.1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const totalPts = score * 15;
    return (
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 text-center flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'اكتمل الاختبار الكوني! 🏆' : 'Trivia Completed! 🏆'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {isRtl 
              ? `أجبت على ${score} من أصل ${TRIVIA_QUESTIONS.length} أسئلة بشكل صحيح.`
              : `You correctly answered ${score} out of ${TRIVIA_QUESTIONS.length} questions.`}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {isRtl 
              ? `تم تسجيل +${totalPts} نقطة معلقة بانتظار مزامنة السيرفر` 
              : `+${totalPts} pending points queued for server sync`}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isRtl ? 'إعادة اللعب' : 'Play Again'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4 text-start">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {isRtl ? `السؤال ${currentIndex + 1} من ${TRIVIA_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${TRIVIA_QUESTIONS.length}`}
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
          {isRtl ? `النقاط: ${score * 15}` : `Points: ${score * 15}`}
        </div>
      </div>

      <h3 className="text-sm font-bold text-white leading-relaxed">
        {isRtl ? currentQ.questionAr : currentQ.questionEn}
      </h3>

      <div className="flex flex-col gap-2.5 mt-2">
        {(isRtl ? currentQ.optionsAr : currentQ.optionsEn).map((opt, idx) => {
          let btnStyle = "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10";
          if (selectedAnswer !== null) {
            if (idx === currentQ.correct) {
              btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
            } else if (idx === selectedAnswer) {
              btnStyle = "bg-red-500/20 border-red-500/50 text-red-300 font-bold";
            } else {
              btnStyle = "bg-white/5 border-white/5 text-slate-500 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full p-3 rounded-xl border text-start text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedAnswer !== null && idx === currentQ.correct && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQ.correct && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="mt-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
          <p className="text-[11px] leading-relaxed">
            💡 {isRtl ? currentQ.explanationAr : currentQ.explanationEn}
          </p>

          <button
            onClick={handleNext}
            className="self-end px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {currentIndex < TRIVIA_QUESTIONS.length - 1 
              ? (isRtl ? 'السؤال التالي ➔' : 'Next Question ➔')
              : (isRtl ? 'عرض النتيجة 🏆' : 'View Results 🏆')}
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Space Reflex Runner Game (Canvas Arcade)
// ==========================================
export function SpaceReflexRunnerGame({ onPointsEarned }: GameProps) {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gameState = useRef({
    shipX: 150,
    obstacles: [] as { x: number; y: number; speed: number; radius: number }[],
    orbs: [] as { x: number; y: number; speed: number; radius: number }[],
    score: 0,
    animId: 0
  });

  const startGame = () => {
    playSynthSound(600, 'sine', 0.15);
    setGameOver(false);
    setIsPlaying(true);
    setScore(0);
    gameState.current = {
      shipX: 150,
      obstacles: [],
      orbs: [],
      score: 0,
      animId: 0
    };
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background space grid lines
      ctx.strokeStyle = 'rgba(123, 63, 242, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Spawn obstacles (asteroids)
      if (frameCount % 40 === 0) {
        gameState.current.obstacles.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -20,
          speed: 2 + Math.random() * 2,
          radius: 12 + Math.random() * 8
        });
      }

      // Spawn orbs (points)
      if (frameCount % 70 === 0) {
        gameState.current.orbs.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -20,
          speed: 1.5 + Math.random() * 1.5,
          radius: 8
        });
      }

      // Update & Render Obstacles
      for (let i = gameState.current.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.current.obstacles[i];
        obs.y += obs.speed;

        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision check with ship
        const shipY = canvas.height - 30;
        const dist = Math.hypot(obs.x - gameState.current.shipX, obs.y - shipY);
        if (dist < obs.radius + 14) {
          playSynthSound(120, 'sawtooth', 0.4);
          setGameOver(true);
          setIsPlaying(false);
          onPointsEarned(gameState.current.score * 5, isRtl ? 'لعبة تفادي النيازك الكونية' : 'Cosmic Reflex Runner');
          return;
        }

        if (obs.y > canvas.height + 20) {
          gameState.current.obstacles.splice(i, 1);
        }
      }

      // Update & Render Orbs
      for (let i = gameState.current.orbs.length - 1; i >= 0; i--) {
        const orb = gameState.current.orbs[i];
        orb.y += orb.speed;

        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collect check
        const shipY = canvas.height - 30;
        const dist = Math.hypot(orb.x - gameState.current.shipX, orb.y - shipY);
        if (dist < orb.radius + 14) {
          playSynthSound(900, 'sine', 0.08);
          gameState.current.score += 1;
          setScore(gameState.current.score);
          gameState.current.orbs.splice(i, 1);
          continue;
        }

        if (orb.y > canvas.height + 20) {
          gameState.current.orbs.splice(i, 1);
        }
      }

      // Render Spaceship
      const shipX = gameState.current.shipX;
      const shipY = canvas.height - 30;

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(shipX, shipY - 15);
      ctx.lineTo(shipX - 14, shipY + 12);
      ctx.lineTo(shipX + 14, shipY + 12);
      ctx.closePath();
      ctx.fill();

      // Thruster flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(shipX - 6, shipY + 13);
      ctx.lineTo(shipX, shipY + 22 + Math.random() * 4);
      ctx.lineTo(shipX + 6, shipY + 13);
      ctx.closePath();
      ctx.fill();

      gameState.current.animId = requestAnimationFrame(loop);
    };

    gameState.current.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameState.current.animId);
    };
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    gameState.current.shipX = Math.max(15, Math.min(canvasRef.current.width - 15, mouseX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !e.touches[0]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    gameState.current.shipX = Math.max(15, Math.min(canvasRef.current.width - 15, touchX));
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col items-center gap-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs font-bold text-white">
            {isRtl ? 'لعبة تفادي النيازك السريعة 🚀' : 'Cosmic Reflex Runner 🚀'}
          </h3>
        </div>
        <div className="text-xs font-bold text-cyan-400 font-mono">
          {isRtl ? `النتيجة: ${score}` : `Score: ${score}`}
        </div>
      </div>

      <div className="relative w-full max-w-xs h-64 rounded-xl overflow-hidden border border-white/10 bg-[#070712] flex items-center justify-center">
        {!isPlaying && !gameOver && (
          <div className="flex flex-col items-center gap-3 p-4 text-center">
            <Gamepad2 className="w-10 h-10 text-cyan-400 animate-pulse" />
            <p className="text-xs text-slate-300">
              {isRtl ? 'حرّك المركبة بالماوس أو اللمس لتجميع البلورات وتفادي النيازك!' : 'Move ship left/right to collect Lodavia Orbs & dodge red asteroids!'}
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRtl ? 'ابدأ اللعب الآن' : 'Start Game'}</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 animate-[fadeIn_0.2s_ease-out]">
            <Flame className="w-10 h-10 text-red-400 mb-2" />
            <h4 className="text-sm font-black text-white">
              {isRtl ? 'اصطدام بالشريط الكويكبي! 💥' : 'Asteroid Impact! 💥'}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {isRtl ? `جمعت ${score} بلورات (+${score * 5} نقطة معلقة)` : `Collected ${score} Orbs (+${score * 5} pending pts)`}
            </p>
            <button
              onClick={startGame}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
            >
              {isRtl ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={300}
          height={256}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
}

// Main Tab Container for Offline Games
export default function OfflineGames() {
  const { lang, currentUser, setCurrentUser, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'trivia' | 'runner'>('trivia');
  const [earnedNotice, setEarnedNotice] = useState<string | null>(null);

  const handlePointsEarned = async (pts: number, gameName: string) => {
    playSynthSound(1046, 'sine', 0.2);

    // Update optimistic local points (pending server validation badge)
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + pts
    }));

    // Queue operation safely to sync engine with idempotent operation ID
    await syncEngine.queueOperation(
      currentUser.id,
      'game_reward',
      { gameName, pts, timestamp: Date.now() },
      { points: pts, messageAr: `مكافأة ${gameName}`, messageEn: `Reward for ${gameName}` }
    );

    setEarnedNotice(isRtl ? `تهانينا! كسبت +${pts} نقطة معلقة في ${gameName} 🌟` : `Congrats! Earned +${pts} pending pts in ${gameName} 🌟`);
    setTimeout(() => setEarnedNotice(null), 4000);
  };

  return (
    <div className="flex flex-col gap-5 text-start">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <Gamepad2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">
              {isRtl ? 'العاب LODAVIA للأوفلاين 🎮' : 'LODAVIA Offline Games Vault 🎮'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl ? 'العب بدون إنترنت واجمع نقاط LODAVIA الآمنة التي تُزامن تلقائياً عند عودة الاتصال' : 'Play offline without connection. Earn verified points synced upon reconnecting.'}
            </p>
          </div>
        </div>
      </div>

      {earnedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{earnedNotice}</span>
        </div>
      )}

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveSubTab('trivia');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'trivia'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>{isRtl ? 'اختبار المعرفة الكونية' : 'Cosmic Trivia'}</span>
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveSubTab('runner');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'runner'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isRtl ? 'لعبة تفادي النيازك' : 'Reflex Runner'}</span>
        </button>
      </div>

      {/* Render Selected Game */}
      {activeSubTab === 'trivia' ? (
        <CosmicTriviaGame onPointsEarned={handlePointsEarned} />
      ) : (
        <SpaceReflexRunnerGame onPointsEarned={handlePointsEarned} />
      )}
    </div>
  );
}
