import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Eye, 
  CheckCircle2, 
  X, 
  Skull, 
  RotateCcw, 
  Award, 
  MessageSquare, 
  HelpCircle,
  AlertTriangle,
  UserCheck,
  Zap,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ALIEN_SECRET_TOPICS } from '../../data/gamesData';

interface WhoIsAlienGameProps {
  onBack: () => void;
  onFinishGame: (xpEarned: number, pointsEarned: number, won: boolean) => void;
}

interface PlayerSession {
  id: string;
  nameAr: string;
  nameEn: string;
  avatar: string;
  isAlien: boolean;
  hintAr: string;
  hintEn: string;
  votedForId?: string;
  isEjected?: boolean;
}

export default function WhoIsAlienGame({ onBack, onFinishGame }: WhoIsAlienGameProps) {
  const { currentUser, lang, playSynthSound } = useApp();

  const triggerSound = (freq: number, type: 'sine' | 'sawtooth' = 'sine', duration = 0.1) => {
    playSynthSound(freq, type, duration);
  };

  // Game Phases: 'lobby' | 'secret_reveal' | 'hint_phase' | 'discussion' | 'voting' | 'ejection' | 'result'
  const [phase, setPhase] = useState<'lobby' | 'secret_reveal' | 'hint_phase' | 'discussion' | 'voting' | 'ejection' | 'result'>('lobby');

  const [secretTopic, setSecretTopic] = useState(ALIEN_SECRET_TOPICS[0]);
  const [players, setPlayers] = useState<PlayerSession[]>([]);
  const [userHint, setUserHint] = useState('');
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [ejectedPlayer, setEjectedPlayer] = useState<PlayerSession | null>(null);
  const [userWon, setUserWon] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);

  // Setup Initial Round
  const startNewGame = () => {
    // Pick random topic
    const topic = ALIEN_SECRET_TOPICS[Math.floor(Math.random() * ALIEN_SECRET_TOPICS.length)];
    setSecretTopic(topic);

    // Create 5 Players (User + 4 Bots)
    const alienIndex = Math.floor(Math.random() * 5); // 0 = User or 1..4 = Bot

    const botTemplates = [
      { nameAr: 'خالد المطيري 🚀', nameEn: 'Khaled 🚀', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { nameAr: 'منى القحطاني 🛸', nameEn: 'Mona 🛸', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
      { nameAr: 'فهد العتيبي 👾', nameEn: 'Fahad 👾', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { nameAr: 'سارة الكونية 🌟', nameEn: 'Sara 🌟', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
    ];

    const initialPlayers: PlayerSession[] = [
      {
        id: 'user_me',
        nameAr: currentUser.name,
        nameEn: currentUser.name,
        avatar: currentUser.avatar,
        isAlien: alienIndex === 0,
        hintAr: '',
        hintEn: ''
      },
      ...botTemplates.map((b, idx) => {
        const isThisBotAlien = alienIndex === (idx + 1);
        return {
          id: `bot_${idx + 1}`,
          nameAr: b.nameAr,
          nameEn: b.nameEn,
          avatar: b.avatar,
          isAlien: isThisBotAlien,
          hintAr: isThisBotAlien ? 'شيء طائر غريب ومثير' : `لذيذ ومعروف لدى الجميع في الكوكب`,
          hintEn: isThisBotAlien ? 'A mysterious flying cosmic thing' : 'Delicious and famous across the galaxy'
        };
      })
    ];

    setPlayers(initialPlayers);
    setUserHint('');
    setSelectedVoteId(null);
    setEjectedPlayer(null);
    setPhase('secret_reveal');
    triggerSound(600, 'sine', 0.1);
  };

  // Submit User Hint
  const handleUserHintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userHint.trim()) return;

    triggerSound(800, 'sine', 0.1);

    setPlayers(prev => prev.map(p => p.id === 'user_me' ? { ...p, hintAr: userHint, hintEn: userHint } : p));
    
    setPhase('discussion');

    // Simulate bot discussions
    const myPlayer = players.find(p => p.id === 'user_me');
    setChatMessages([
      { sender: 'سارة الكونية 🌟', text: lang === 'ar' ? `تلميح ${myPlayer?.nameAr} يبدو دقيقاً ومطمئناً!` : `${myPlayer?.nameEn}'s hint sounds clear!` },
      { sender: 'فهد العتيبي 👾', text: lang === 'ar' ? 'خالد يتوتر بسرعة عندما تسأله، هاه من يظن نفسه؟' : 'Khaled is sweating under pressure!' },
      { sender: 'منى القحطاني 🛸', text: lang === 'ar' ? 'حسناً يا رفاق، حان وقت التصويت الحاسم وطرد الفضائي!' : 'Alright crew, vote time to find the alien!' }
    ]);
  };

  // Process Voting
  const handleVote = (targetId: string) => {
    setSelectedVoteId(targetId);
    triggerSound(900, 'sine', 0.1);

    // Simulate Votes
    const updated = players.map(p => {
      if (p.id === 'user_me') return { ...p, votedForId: targetId };
      // Bots vote randomly or target suspect
      const alienPlayer = players.find(x => x.isAlien);
      const target = Math.random() > 0.3 ? alienPlayer?.id || 'bot_1' : 'user_me';
      return { ...p, votedForId: target };
    });

    setPlayers(updated);

    // Find most voted player
    const voteCounts: Record<string, number> = {};
    updated.forEach(p => {
      if (p.votedForId) {
        voteCounts[p.votedForId] = (voteCounts[p.votedForId] || 0) + 1;
      }
    });

    let maxVotes = 0;
    let winnerId = targetId;
    Object.entries(voteCounts).forEach(([pid, cnt]) => {
      if (cnt > maxVotes) {
        maxVotes = cnt;
        winnerId = pid;
      }
    });

    const ejected = updated.find(p => p.id === winnerId) || updated[0];
    setEjectedPlayer(ejected);
    setPhase('ejection');

    // Reveal Result after ejection animation (3s)
    setTimeout(() => {
      setPhase('result');
      const isUserAlien = updated.find(p => p.id === 'user_me')?.isAlien;
      
      let won = false;
      if (!isUserAlien && ejected.isAlien) {
        won = true; // Humans successfully caught alien!
      } else if (isUserAlien && !ejected.isAlien) {
        won = true; // Alien tricked the humans!
      }

      setUserWon(won);
      if (won) {
        triggerSound(1046, 'sine', 0.2);
        onFinishGame(140, 50, true);
      } else {
        triggerSound(200, 'sawtooth', 0.2);
        onFinishGame(40, 10, false);
      }
    }, 3000);
  };

  const isUserAlien = players.find(p => p.id === 'user_me')?.isAlien;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-950/90 border border-emerald-500/30 rounded-3xl shadow-2xl text-white">
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
          <Users className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
            {lang === 'ar' ? 'من هو الفضائي؟ 👽' : 'Who is the Alien? 👽'}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-xl">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Party Session</span>
        </div>
      </div>

      {/* LOBBY / INTRO */}
      {phase === 'lobby' && (
        <div className="py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl">
              👽
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-2">
            {lang === 'ar' ? 'لعبة الخداع والاكتشاف الاجتماعي 🕵️‍♂️' : 'Social Deduction Space Party 🕵️‍♂️'}
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            {lang === 'ar'
              ? 'يحصل الجميع على نفس الكلمة السرية، عدا لاعب واحد وهو الفضائي المتخفي! قدم تلميحاتك الذكية واكشف من يبث الشائعات!'
              : 'Everyone receives the exact same secret word, except one secret Alien! Give smart hints and vote out the impostor.'}
          </p>

          <button
            onClick={startNewGame}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
          >
            {lang === 'ar' ? 'انضم للجلسة وابدأ الجولة الآن 🚀' : 'Start Party Round Now 🚀'}
          </button>
        </div>
      )}

      {/* PHASE 1: SECRET REVEAL */}
      {phase === 'secret_reveal' && (
        <div className="py-8 text-center space-y-6">
          <div className="p-6 bg-slate-900/80 border border-emerald-500/30 rounded-3xl max-w-md mx-auto shadow-xl">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'دورك الكوني في هذه الجولة' : 'Your Secret Assignment'}
            </div>

            {isUserAlien ? (
              <div className="space-y-3">
                <div className="text-4xl">👽</div>
                <div className="text-lg font-black text-rose-400">
                  {lang === 'ar' ? 'أنت الفضائي المتخفي!' : 'You are the Hidden Alien!'}
                </div>
                <p className="text-xs text-slate-300">
                  {lang === 'ar' 
                    ? 'أنت لا تعرف الكلمة السرية! استمع لتلميحات الآخرين وقدم تلميحاً غامضاً ومخادعاً دون أن ينكشف أمرك!' 
                    : 'You do NOT know the secret word! Bluff your way through and mimic human clues!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-4xl">🛰️</div>
                <div className="text-xs text-slate-400">{lang === 'ar' ? 'الكلمة السرية للجميع:' : 'The Secret Topic Word:'}</div>
                <div className="text-2xl font-black text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 py-3 rounded-2xl">
                  {lang === 'ar' ? secretTopic.topicAr : secretTopic.topicEn}
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'اكتب تلميحاً ذكياً لا يوضح الكلمة تماماً للفضائي!' : 'Provide a clever hint without revealing it completely to the alien.'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setPhase('hint_phase')}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black shadow-lg"
          >
            {lang === 'ar' ? 'انتقل لجولة تقديم التلميحات 📝' : 'Proceed to Hint Phase 📝'}
          </button>
        </div>
      )}

      {/* PHASE 2: HINT INPUT */}
      {phase === 'hint_phase' && (
        <div className="py-6 space-y-6 max-w-lg mx-auto">
          <div className="p-5 bg-slate-900/80 border border-white/10 rounded-2xl text-center">
            <h3 className="text-sm font-black text-white mb-2">
              {lang === 'ar' ? 'قدم تلميحك الفضائي/البشري ✍️' : 'Submit Your Witty Hint ✍️'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUserAlien
                ? (lang === 'ar' ? 'اكتب شيئاً عاماً يوحي بأنك تعرف موضوع الحديث!' : 'Write something general to pretend you know!')
                : (lang === 'ar' ? 'اكتب تلميحاً يفهِمه البشر فقط!' : 'Write a clue that only fellow humans understand!')}
            </p>
          </div>

          <form onSubmit={handleUserHintSubmit} className="space-y-4">
            <input
              type="text"
              value={userHint}
              onChange={(e) => setUserHint(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب تلميحك هنا...' : 'Type your hint here...'}
              className="w-full bg-black/60 border border-emerald-500/40 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
            />

            <button
              type="submit"
              disabled={!userHint.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {lang === 'ar' ? 'إرسال التلميح والانتقال للنقاش' : 'Send Hint & Open Discussion'}
            </button>
          </form>
        </div>
      )}

      {/* PHASE 3 & 4: DISCUSSION & VOTING */}
      {(phase === 'discussion' || phase === 'voting') && (
        <div className="space-y-6">
          {/* PLAYERS & HINTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all ${
                  selectedVoteId === p.id 
                    ? 'bg-rose-950/50 border-rose-500 text-white shadow-lg' 
                    : 'bg-slate-900/60 border-white/10 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.nameEn} className="w-10 h-10 rounded-full object-cover border border-emerald-500/30" />
                    <div>
                      <div className="font-bold text-xs">{lang === 'ar' ? p.nameAr : p.nameEn}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.id === 'user_me' ? (lang === 'ar' ? 'أنت' : 'You') : (lang === 'ar' ? 'عضو طاقم' : 'Crewmate')}
                      </div>
                    </div>
                  </div>

                  {phase === 'discussion' && (
                    <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                      {lang === 'ar' ? 'تلميح جاهز' : 'Hint Ready'}
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-black/40 rounded-xl text-xs text-slate-300 font-mono italic">
                  "{lang === 'ar' ? p.hintAr || 'تلميح ممتع وقصير' : p.hintEn || 'Short witty clue'}"
                </div>

                {phase === 'voting' && (
                  <button
                    onClick={() => handleVote(p.id)}
                    className="w-full mt-3 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    {lang === 'ar' ? `صوت لطرد ${p.nameAr}` : `Vote to Eject ${p.nameEn}`}
                  </button>
                )}
              </div>
            ))}
          </div>

          {phase === 'discussion' && (
            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl text-center space-y-4">
              <div className="text-xs text-slate-400">
                {lang === 'ar' ? 'استعرض تلميحات الجميع وناقش من قد يكون الفضائي!' : 'Review clues and discuss who seems suspicious!'}
              </div>

              <div className="p-3 bg-black/60 rounded-xl text-xs font-mono space-y-1 text-slate-300 text-start max-h-32 overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i}>
                    <span className="text-emerald-400 font-bold">{m.sender}:</span> {m.text}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase('voting')}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl text-xs font-black shadow-lg"
              >
                {lang === 'ar' ? 'بدء التصويت لطرد المشتبه به 🗳️' : 'Start Air-Lock Ejection Vote 🗳️'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE: EJECTION CUTSCENE */}
      {phase === 'ejection' && ejectedPlayer && (
        <div className="py-12 text-center space-y-6">
          <motion.div
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1.2, rotate: 0 }}
            transition={{ duration: 1 }}
            className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-rose-500 shadow-2xl"
          >
            <img src={ejectedPlayer.avatar} alt="Ejected" className="w-full h-full object-cover" />
          </motion.div>

          <h3 className="text-xl font-black text-rose-400 animate-pulse">
            {lang === 'ar' ? `تم طرد ${ejectedPlayer.nameAr} خارج المركبة!` : `Ejected ${ejectedPlayer.nameEn} into deep space!`}
          </h3>

          <p className="text-xs text-slate-400">
            {lang === 'ar' ? 'جاري التحقق من الهوية المجرّية...' : 'Verifying biological identity scan...'}
          </p>
        </div>
      )}

      {/* RESULT PHASE */}
      {phase === 'result' && ejectedPlayer && (
        <div className="py-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-2xl">
            {ejectedPlayer.isAlien ? '👽' : '👨‍🚀'}
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              {ejectedPlayer.isAlien
                ? (lang === 'ar' ? '🎉 نجح البشر! كان الفضائي بالفعل!' : '🎉 Humans Win! Alien Unmasked!')
                : (lang === 'ar' ? '😱 خيبة أمل! تم طرد راكب بشري بريء!' : '😱 Human Ejected! Alien Escaped!')}
            </h3>

            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              {lang === 'ar' 
                ? `الكلمة السرية الحقيقية كانت: "${secretTopic.topicAr}"` 
                : `The secret topic word was: "${secretTopic.topicEn}"`}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 font-mono text-xs">
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center">
              <div className="text-slate-400 text-[10px]">{lang === 'ar' ? 'نقاط الخبرة' : 'XP Gained'}</div>
              <div className="text-emerald-300 font-bold text-sm">+{userWon ? 140 : 40} XP</div>
            </div>
            <div className="p-3 bg-yellow-950/50 border border-yellow-500/30 rounded-xl text-center">
              <div className="text-slate-400 text-[10px]">{lang === 'ar' ? 'مكافأة لودافيا' : 'Points Earned'}</div>
              <div className="text-yellow-400 font-bold text-sm">+{userWon ? 50 : 10} 💎</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-2xl text-xs font-black flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'ar' ? 'لعب جولة أخرى' : 'Play Another Party Round'}
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
