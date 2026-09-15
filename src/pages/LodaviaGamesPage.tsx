import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Users, 
  Rocket, 
  Zap, 
  Award, 
  Play, 
  Volume2, 
  VolumeX, 
  Plus, 
  Info, 
  Coins, 
  Flame, 
  User, 
  Gift,
  Compass,
  CheckCircle2,
  Globe,
  Radio,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Check,
  Heart,
  TrendingUp,
  Brain,
  Layers,
  Orbit
} from 'lucide-react';
import LodaviaOrbitsPage from './LodaviaOrbitsPage';
import { useApp } from '../contexts/AppContext';
import { 
  GameCardInfo, 
  Achievement, 
  CoOpRoom, 
  PlayerGameStats, 
  LeaderboardUser, 
  GameId, 
  GameCategory, 
  AlienAvatarCustomization, 
  StarshipCustomization,
  DailyMascotChallenge,
  MiniPlayerProfile
} from '../types/games';
import { 
  GAMES_LIST, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_LEADERBOARD, 
  DAILY_MASCOT_CHALLENGES, 
  INITIAL_MINI_PLAYERS 
} from '../data/gamesData';
import { DEFAULT_AVATAR_CUSTOMIZATION, DEFAULT_STARSHIP_CUSTOMIZATION, INITIAL_UNIVERSE_FRIENDS } from '../data/universeData';

import GalaxyRescueGame from '../components/games/GalaxyRescueGame';
import WhoIsAlienGame from '../components/games/WhoIsAlienGame';
import LodaviaChallengeGame from '../components/games/LodaviaChallengeGame';
import StarshipChaosGame from '../components/games/StarshipChaosGame';
import GalaxyRushGame from '../components/games/GalaxyRushGame';
import PlanetRescueGame from '../components/games/PlanetRescueGame';
import GameDetailsModal from '../components/games/GameDetailsModal';
import CreateRoomModal from '../components/games/CreateRoomModal';
import LeaderboardSection from '../components/games/LeaderboardSection';
import InGameSocialShell from '../components/games/InGameSocialShell';
import GameMiniProfileModal from '../components/games/GameMiniProfileModal';

import LodaviaGalaxyMap from '../components/games/LodaviaGalaxyMap';
import LodaviaCustomizer from '../components/games/LodaviaCustomizer';
import LodaviaProfileView from '../components/games/LodaviaProfileView';
import FriendsUniverseSection from '../components/games/FriendsUniverseSection';
import DailyRewardsModal from '../components/games/DailyRewardsModal';

export default function LodaviaGamesPage() {
  const { currentUser, setCurrentUser, lang, playSynthSound } = useApp();
  const isAr = lang === 'ar';

  // Sound Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Main Tab: 'games' | 'map' | 'customizer' | 'profile' | 'crew' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<'games' | 'map' | 'customizer' | 'profile' | 'crew' | 'leaderboard'>('games');

  // Category filter for games hub
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameCardInfo | null>(null);
  const [selectedGameForRoom, setSelectedGameForRoom] = useState<GameCardInfo | null>(null);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [selectedMiniPlayer, setSelectedMiniPlayer] = useState<MiniPlayerProfile | null>(null);

  // Currently Playing Game ID
  const [currentlyPlayingGameId, setCurrentlyPlayingGameId] = useState<GameId | null>(null);
  const [showOrbitsGame, setShowOrbitsGame] = useState(false);

  // Player Progression & Coins State
  const [playerXp, setPlayerXp] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_player_xp');
    return saved ? parseInt(saved, 10) : 450;
  });

  const [playerLevel, setPlayerLevel] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_player_level');
    return saved ? parseInt(saved, 10) : 4;
  });

  const [playerCoins, setPlayerCoins] = useState<number>(() => {
    const saved = localStorage.getItem('lodavia_cosmic_coins');
    return saved ? parseInt(saved, 10) : (currentUser?.points || 520);
  });

  // Daily Mascot Challenges state
  const [dailyChallenges, setDailyChallenges] = useState<DailyMascotChallenge[]>(() => {
    const saved = localStorage.getItem('lodavia_daily_mascot_challenges');
    return saved ? JSON.parse(saved) : DAILY_MASCOT_CHALLENGES;
  });

  // Avatar & Starship Customization
  const [avatarCustomization, setAvatarCustomization] = useState<AlienAvatarCustomization>(() => {
    const saved = localStorage.getItem('lodavia_avatar_customization');
    return saved ? JSON.parse(saved) : DEFAULT_AVATAR_CUSTOMIZATION;
  });

  const [starshipCustomization, setStarshipCustomization] = useState<StarshipCustomization>(() => {
    const saved = localStorage.getItem('lodavia_starship_customization');
    return saved ? JSON.parse(saved) : DEFAULT_STARSHIP_CUSTOMIZATION;
  });

  // Stats
  const [stats, setStats] = useState<PlayerGameStats>(() => {
    const saved = localStorage.getItem('lodavia_game_stats');
    return saved ? JSON.parse(saved) : {
      totalGamesPlayed: 16,
      totalWins: 11,
      galaxyRescueWins: 4,
      whoIsAlienWins: 3,
      starshipChaosWins: 4,
      galaxyRushWins: 3,
      planetRescueWins: 2,
      challengeHighScore: 920,
      totalPointsEarned: 680
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Toast Notification
  const [toast, setToast] = useState<{ titleAr: string; titleEn: string; type: 'level' | 'achievement' | 'reward' | 'invite' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lodavia_player_xp', playerXp.toString());
    localStorage.setItem('lodavia_player_level', playerLevel.toString());
    localStorage.setItem('lodavia_cosmic_coins', playerCoins.toString());
    localStorage.setItem('lodavia_daily_mascot_challenges', JSON.stringify(dailyChallenges));
    localStorage.setItem('lodavia_avatar_customization', JSON.stringify(avatarCustomization));
    localStorage.setItem('lodavia_starship_customization', JSON.stringify(starshipCustomization));
    localStorage.setItem('lodavia_game_stats', JSON.stringify(stats));
  }, [playerXp, playerLevel, playerCoins, dailyChallenges, avatarCustomization, starshipCustomization, stats]);

  // Handle Game Finish & Rewards
  const handleGameFinish = (xpEarned: number, pointsEarned: number, won: boolean) => {
    // Add XP & Check Level Up
    let newXp = playerXp + xpEarned;
    let newLevel = playerLevel;
    let xpThreshold = newLevel * 200;

    let leveledUp = false;
    while (newXp >= xpThreshold) {
      newXp -= xpThreshold;
      newLevel += 1;
      xpThreshold = newLevel * 200;
      leveledUp = true;
    }

    setPlayerXp(newXp);
    setPlayerLevel(newLevel);

    // Award Coins
    const coinsEarned = pointsEarned > 0 ? pointsEarned : (won ? 80 : 30);
    const newTotalCoins = playerCoins + coinsEarned;
    setPlayerCoins(newTotalCoins);

    // Sync with currentUser if available
    if (currentUser && setCurrentUser) {
      setCurrentUser({
        ...currentUser,
        points: (currentUser.points || 0) + coinsEarned
      });
    }

    // Update Stats
    setStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalWins: won ? prev.totalWins + 1 : prev.totalWins,
      starshipChaosWins: currentlyPlayingGameId === 'starship_chaos' && won ? (prev.starshipChaosWins || 0) + 1 : prev.starshipChaosWins,
      galaxyRushWins: currentlyPlayingGameId === 'galaxy_rush' && won ? (prev.galaxyRushWins || 0) + 1 : prev.galaxyRushWins,
      planetRescueWins: currentlyPlayingGameId === 'planet_rescue' && won ? (prev.planetRescueWins || 0) + 1 : prev.planetRescueWins,
      totalPointsEarned: prev.totalPointsEarned + coinsEarned
    }));

    if (leveledUp) {
      if (soundEnabled && playSynthSound) {
        playSynthSound(523, 'sine', 0.1);
        setTimeout(() => playSynthSound(659, 'sine', 0.1), 100);
        setTimeout(() => playSynthSound(783, 'sine', 0.2), 200);
      }
      setToast({
        titleAr: `🎉 مبروك! ارتفع مستواك الفضائي للمستوى ${newLevel}!`,
        titleEn: `🎉 Level Up! You reached Cosmic Level ${newLevel}!`,
        type: 'level'
      });
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast({
        titleAr: `🏆 أحسنت! حصلت على +${xpEarned} XP و +${coinsEarned} 🪙!`,
        titleEn: `🏆 Great job! Earned +${xpEarned} XP & +${coinsEarned} 🪙!`,
        type: 'reward'
      });
      setTimeout(() => setToast(null), 3500);
    }
  };

  // Claim Daily Mascot Challenge
  const handleClaimChallenge = (challengeId: string) => {
    const ch = dailyChallenges.find(c => c.id === challengeId);
    if (!ch || !ch.completed || ch.claimed) return;

    // Award Rewards
    setPlayerXp(prev => prev + ch.rewardXp);
    setPlayerCoins(prev => prev + ch.rewardCoins);

    // Sync state
    setDailyChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, claimed: true } : c));

    if (soundEnabled && playSynthSound) {
      playSynthSound(587, 'sine', 0.1);
      setTimeout(() => playSynthSound(880, 'sine', 0.15), 100);
    }

    setToast({
      titleAr: `🎁 تم استلام مكافأة ${ch.mascotNameAr}! (+${ch.rewardXp} XP • +${ch.rewardCoins} 🪙)`,
      titleEn: `🎁 Claimed ${ch.mascotNameEn} Reward! (+${ch.rewardXp} XP • +${ch.rewardCoins} 🪙)`,
      type: 'reward'
    });
    setTimeout(() => setToast(null), 4000);
  };

  // Render Lodavia Orbits Game View
  if (showOrbitsGame) {
    return <LodaviaOrbitsPage onBack={() => setShowOrbitsGame(false)} />;
  }

  // Active game object if playing
  const activeGameObj = GAMES_LIST.find(g => g.id === currentlyPlayingGameId);

  // Render Playing Game within InGameSocialShell
  if (currentlyPlayingGameId && activeGameObj) {
    return (
      <InGameSocialShell
        game={activeGameObj}
        onExitGame={() => setCurrentlyPlayingGameId(null)}
        playerLevel={playerLevel}
        playerCoins={playerCoins}
      >
        {currentlyPlayingGameId === 'starship_chaos' && (
          <StarshipChaosGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}

        {currentlyPlayingGameId === 'planet_rescue' && (
          <PlanetRescueGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}

        {currentlyPlayingGameId === 'galaxy_rush' && (
          <GalaxyRushGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}

        {currentlyPlayingGameId === 'who_is_alien' && (
          <WhoIsAlienGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}

        {currentlyPlayingGameId === 'galaxy_rescue' && (
          <GalaxyRescueGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}

        {currentlyPlayingGameId === 'lodavia_challenge' && (
          <LodaviaChallengeGame
            onFinishGame={handleGameFinish}
            onBack={() => setCurrentlyPlayingGameId(null)}
          />
        )}
      </InGameSocialShell>
    );
  }

  // Filtered games
  const filteredGames = GAMES_LIST.filter(game => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = game.titleAr.toLowerCase().includes(q) || game.titleEn.toLowerCase().includes(q);
      const matchDesc = game.shortDescAr.toLowerCase().includes(q) || game.shortDescEn.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    if (activeCategory === 'all') return true;
    if (activeCategory === 'most_played') return game.isMostPlayed;
    if (activeCategory === 'new') return game.isNew;
    if (activeCategory === 'featured') return game.featured;
    return game.category === activeCategory;
  });

  const featuredGames = GAMES_LIST.filter(g => g.featured);

  return (
    <div className="min-h-screen bg-[#070B14] text-white pb-24 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* BACKGROUND COSMIC AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-sky-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* ━━━━━━━━━━━━━━━━━━━━ 1. HEADER & HUD ━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-[#0B1220]/90 border border-sky-500/20 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="p-3.5 bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 rounded-2xl shadow-lg shadow-sky-500/20 text-slate-950 shrink-0">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {isAr ? 'ألعاب لودافيا' : 'Lodavia Games'}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                  Social Gaming 🎮
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isAr 
                  ? 'عالم الألعاب الاجتماعية، التحديات الفضائية والمنافسات المباشرة مع مجتمع لودافيا' 
                  : 'Social gaming hub, cosmic multiplayer challenges, and live player community'}
              </p>
            </div>
          </div>

          {/* USER PROGRESSION HUD (XP, LEVEL, COINS, DAILY REWARDS) */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center lg:justify-end w-full lg:w-auto">
            {/* DAILY REWARDS */}
            <button
              onClick={() => {
                setShowDailyRewards(true);
                if (playSynthSound) playSynthSound(650, 'sine', 0.1);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4 animate-bounce" />
              <span>{isAr ? 'المكافأة اليومية 🎁' : 'Daily Gift 🎁'}</span>
            </button>

            {/* COSMIC COINS */}
            <div className="px-3.5 py-2 bg-black/50 border border-yellow-500/30 text-yellow-300 font-mono font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-inner">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{playerCoins} 🪙</span>
            </div>

            {/* LEVEL & XP PROGRESSION */}
            <div className="px-3.5 py-2 bg-sky-500/15 border border-sky-500/30 text-sky-200 font-mono text-xs rounded-2xl flex items-center gap-2">
              <div className="flex items-center gap-1 font-black text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Lv.{playerLevel}</span>
              </div>
              <span className="text-[10px] text-slate-400">({playerXp}/{playerLevel * 200} XP)</span>
            </div>

            {/* SOUND TOGGLE */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border border-white/10 transition-all cursor-pointer"
              title={soundEnabled ? (isAr ? 'كتم الصوت' : 'Mute') : (isAr ? 'تشغيل الصوت' : 'Unmute')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
          </div>
        </div>

        {/* TOAST ALERTS */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-[#0B1220] text-white p-3.5 rounded-2xl border border-sky-400/50 shadow-2xl font-black text-center text-xs flex items-center justify-center gap-2"
            >
              <span>{isAr ? toast.titleAr : toast.titleEn}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ━━━━━━━━━━━━━━━━━━━━ 2. MAIN NAV TABS ━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center">
          {[
            { id: 'games', icon: Gamepad2, labelAr: '🎮 مركز الألعاب', labelEn: '🎮 Games Hub' },
            { id: 'map', icon: Compass, labelAr: '🪐 خريطة المجرّة', labelEn: '🪐 Galaxy Map' },
            { id: 'customizer', icon: Rocket, labelAr: '🛸 القلعة والمركبة', labelEn: '🛸 Customizer' },
            { id: 'profile', icon: User, labelAr: '👽 بروفايل الألعاب', labelEn: '👽 Game Profile' },
            { id: 'crew', icon: Users, labelAr: '👥 الأصدقاء والطاقم', labelEn: '👥 Friends & Crew' },
            { id: 'leaderboard', icon: Trophy, labelAr: '🏆 المتصدرون', labelEn: '🏆 Leaderboards' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (playSynthSound) playSynthSound(600, 'sine', 0.08);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                    : 'bg-[#0B1220]/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 1: GAMES HUB CONTENT ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'games' && (
          <div className="space-y-8">

            {/* 🪐 LODAVIA ORBITS - PREMIER NAVIGATION HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950/80 via-[#0B1528]/95 to-[#070B14] border border-sky-400/40 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 shrink-0">
                    <Orbit className="w-8 h-8 animate-[spin_12s_linear_infinite]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[10px] font-bold text-sky-300">
                        {isAr ? 'لعبة جديدة كلياً 🪐' : 'Brand New Cosmic Game 🪐'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-amber-300">
                        {isAr ? 'تحدي المدارات والجاكارو' : 'Space Jackaroo Orbits'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {isAr ? 'مدارات لودافيا (Lodavia Orbits)' : 'Lodavia Orbits Space Game'}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      {isAr 
                        ? 'انضم للسباق المداري التكتيكي بين 4 محطات فضائية كبرى للوصول إلى النواة الكونية ببطاقات الطاقة السريعة.'
                        : 'Enter the tactical 4-player orbital race connecting 4 space stations to the celestial singularity.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (playSynthSound) playSynthSound(800, 'sine', 0.1);
                    setShowOrbitsGame(true);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black shadow-xl shadow-sky-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 border border-sky-300/40"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isAr ? 'دخول اللعبة والمدار 🚀' : 'Enter Orbits Game 🚀'}</span>
                </button>
              </div>
            </div>

            {/* ─── SECTION A: FEATURED SHOWCASE CAROUSEL ─── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <h2 className="text-lg font-black text-white">
                    {isAr ? 'ألعاب مميزة ومختارة لك 🔥' : 'Featured Spotlight Games 🔥'}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {isAr ? 'التجارب الأكثر إثارة الآن' : 'Top trending cosmic games'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featuredGames.map((game) => (
                  <div
                    key={game.id}
                    className="group relative overflow-hidden rounded-3xl bg-[#0B1220]/90 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between"
                  >
                    {/* ARTWORK BACKGROUND WITH OVERLAY */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={game.artwork}
                        alt={game.titleEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />

                      {/* TOP BADGES */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                          {isAr ? game.badgeAr : game.badgeEn}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{game.activePlayersCount.toLocaleString()} {isAr ? 'لاعب' : 'online'}</span>
                        </span>
                      </div>

                      {/* ACTIVITY BADGE */}
                      <div className="absolute bottom-2 right-3">
                        <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          {isAr ? game.activityLevelAr : game.activityLevelEn}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT BODY */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                          {isAr ? game.titleAr : game.titleEn}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {isAr ? game.shortDescAr : game.shortDescEn}
                        </p>
                      </div>

                      {/* METRICS & ACTION */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-sky-400" />
                            <span>{game.minPlayers === game.maxPlayers ? `${game.minPlayers} ${isAr ? 'لاعب' : 'player'}` : `${game.minPlayers}-${game.maxPlayers} ${isAr ? 'لاعبين' : 'players'}`}</span>
                          </span>
                          <span className="text-amber-300 font-bold">
                            +{game.xpReward} XP • +{game.pointsReward} 🪙
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedGameForModal(game)}
                            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-700"
                            title={isAr ? 'التفاصيل والقواعد' : 'Details'}
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setCurrentlyPlayingGameId(game.id)}
                            className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>{isAr ? 'العب الآن' : 'Play Now'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── SECTION B: FRIENDS PLAYING NOW (LIVE SOCIAL FEED) ─── */}
            <div className="bg-[#0B1220]/90 border border-sky-500/20 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">
                      {isAr ? 'أصدقاء يلعبون الآن 👥' : 'Friends Playing Live 👥'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'انضم إلى أصدقائك أو ادعهم لمباراة فورية' : 'Join active friends or invite them to a match'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('crew')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>{isAr ? 'عرض جميع الأصدقاء' : 'View all crew'}</span>
                  {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* FRIENDS HORIZONTAL STRIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {Object.values(INITIAL_MINI_PLAYERS).map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-slate-800/80 hover:border-sky-500/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => setSelectedMiniPlayer(friend)}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-11 h-11 rounded-xl object-cover border border-sky-400/50 group-hover:border-sky-400 transition-colors"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${friend.status === 'in_game' ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-white truncate group-hover:text-sky-300 transition-colors">
                            {friend.name}
                          </span>
                          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold rounded">
                            Lv.{friend.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {isAr ? friend.currentActivityAr : friend.currentActivityEn}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                      onClick={() => setSelectedMiniPlayer(friend)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border border-slate-700"
                    >
                      {isAr ? 'البروفايل' : 'Profile'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── SECTION C: DAILY MASCOT CHALLENGES (RAY, LAIKA, ALBERT) ─── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">
                    {isAr ? 'تحديات لودافيا اليومية مع شخصياتنا 🚀🐕🧠' : 'Lodavia Daily Mascot Challenges 🚀🐕🧠'}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {isAr ? 'تتجدد يومياً مع مكافآت XP ونقاط حقيقية' : 'Refreshed daily for XP & coins'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {dailyChallenges.map((challenge) => {
                  const targetGame = GAMES_LIST.find(g => g.id === challenge.targetGameId);

                  return (
                    <div
                      key={challenge.id}
                      className="p-5 rounded-3xl bg-[#0B1220]/90 border border-slate-800 hover:border-amber-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                    >
                      {/* MASCOT HEADER */}
                      <div className="flex items-start gap-3">
                        <img
                          src={challenge.mascotAvatar}
                          alt={challenge.mascotNameEn}
                          className="w-12 h-12 rounded-2xl object-cover border border-amber-400/50 shadow-md shrink-0 bg-slate-900"
                        />

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white truncate">
                              {isAr ? challenge.mascotNameAr : challenge.mascotNameEn}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-300 font-semibold truncate">
                            {isAr ? challenge.mascotRoleAr : challenge.mascotRoleEn}
                          </p>
                        </div>
                      </div>

                      {/* CHALLENGE DETAILS */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-black text-white">
                          {isAr ? challenge.titleAr : challenge.titleEn}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isAr ? challenge.descAr : challenge.descEn}
                        </p>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>{isAr ? 'التقدم' : 'Progress'}</span>
                          <span className="text-sky-300 font-mono">{challenge.currentProgress} / {challenge.maxProgress}</span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (challenge.currentProgress / challenge.maxProgress) * 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300 pt-1">
                          <span>+{challenge.rewardXp} XP</span>
                          <span>+{challenge.rewardCoins} 🪙</span>
                        </div>
                      </div>

                      {/* ACTION BUTTON */}
                      <div className="pt-1">
                        {challenge.claimed ? (
                          <div className="py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isAr ? 'تم استلام المكافأة' : 'Reward Claimed'}</span>
                          </div>
                        ) : challenge.completed ? (
                          <button
                            onClick={() => handleClaimChallenge(challenge.id)}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Gift className="w-4 h-4" />
                            <span>{isAr ? 'استلام المكافأة الآن! 🎁' : 'Claim Reward! 🎁'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentlyPlayingGameId(challenge.targetGameId)}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-black border border-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-sky-300" />
                            <span>{isAr ? 'انتقل للتحدي واللعب' : 'Go to Challenge'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── SECTION D: ALL GAMES LIBRARY & CATEGORIES ─── */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-sky-400" />
                    <span>{isAr ? 'مكتبة ألعاب لودافيا 🌌' : 'Lodavia Games Library 🌌'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'اختر لعبتك المفضلة، تفاعل مع الأصدقاء وحقق أعلى النتائج' : 'Choose your game, play with friends, and conquer high scores'}
                  </p>
                </div>

                {/* SEARCH BAR */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث عن لعبة فضائية...' : 'Search cosmic games...'}
                    className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* CATEGORY FILTERS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', labelAr: 'الكل 🌌', labelEn: 'All Games 🌌' },
                  { id: 'most_played', labelAr: 'الأكثر لعباً 🔥', labelEn: 'Most Active 🔥' },
                  { id: 'new', labelAr: 'ألعاب جديدة ✨', labelEn: 'New ✨' },
                  { id: 'coop', labelAr: 'جماعي وتعاوني 🛸', labelEn: 'Multiplayer & Co-op 🛸' },
                  { id: 'social', labelAr: 'ألعاب اجتماعية 👽', labelEn: 'Party & Social 👽' },
                  { id: 'challenge', labelAr: 'تحديات وسرعة ⚡', labelEn: 'Speed & Trivia ⚡' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id as any);
                      if (playSynthSound) playSynthSound(700, 'sine', 0.05);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-sky-500 text-white font-black shadow-md'
                        : 'bg-[#0B1220] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>

              {/* GAMES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="group relative overflow-hidden rounded-3xl bg-[#0B1220]/90 border border-slate-800 hover:border-sky-500/40 p-5 shadow-2xl flex flex-col justify-between space-y-4 transition-all duration-300"
                  >
                    {/* TOP ARTWORK & BADGE */}
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-1">
                      <img
                        src={game.artwork}
                        alt={game.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/10">
                          {isAr ? game.badgeAr : game.badgeEn}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{game.activePlayersCount.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                          {isAr ? game.titleAr : game.titleEn}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {isAr ? game.shortDescAr : game.shortDescEn}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-400" />
                          <span>{game.minPlayers === game.maxPlayers ? game.minPlayers : `${game.minPlayers}-${game.maxPlayers}`} {isAr ? 'لاعبين' : 'players'}</span>
                        </span>
                        <span>•</span>
                        <span className="text-amber-300 font-bold">
                          +{game.xpReward} XP • +{game.pointsReward} 🪙
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGameForModal(game)}
                        className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
                      >
                        {isAr ? 'التفاصيل' : 'Details'}
                      </button>

                      <button
                        onClick={() => setCurrentlyPlayingGameId(game.id)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{isAr ? 'العب الآن' : 'Play Now'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 2: GALAXY MAP ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LodaviaGalaxyMap
              playerLevel={playerLevel}
              onSelectPlanetGame={(gameId) => setCurrentlyPlayingGameId(gameId)}
              onOpenCitadelCustomizer={() => setActiveTab('customizer')}
            />
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 3: CUSTOMIZER ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'customizer' && (
          <motion.div
            key="customizer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LodaviaCustomizer
              playerLevel={playerLevel}
              playerCoins={playerCoins}
              avatarCustomization={avatarCustomization}
              starshipCustomization={starshipCustomization}
              onUpdateAvatar={setAvatarCustomization}
              onUpdateStarship={setStarshipCustomization}
              onDeductCoins={(amount) => setPlayerCoins(prev => Math.max(0, prev - amount))}
            />
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 4: PROFILE ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LodaviaProfileView
              playerLevel={playerLevel}
              playerXp={playerXp}
              playerCoins={playerCoins}
              stats={stats}
              achievements={achievements}
              avatarCustomization={avatarCustomization}
              starshipCustomization={starshipCustomization}
            />
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 5: FRIENDS & CREW ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'crew' && (
          <motion.div
            key="crew"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FriendsUniverseSection
              onInviteFriendToRoom={(friendName) => {
                setToast({
                  titleAr: `🛸 تم إرسال دعوة انضمام للعبة إلى ${friendName}!`,
                  titleEn: `🛸 Game invite sent to ${friendName}!`,
                  type: 'invite'
                });
                setTimeout(() => setToast(null), 3500);
              }}
            />
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ TAB 6: LEADERBOARD ━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LeaderboardSection
              leaderboard={leaderboard}
              achievements={achievements}
              stats={stats}
              playerLevel={playerLevel}
              playerXp={playerXp}
            />
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━ MODALS ━━━━━━━━━━━━━━━━━━━━ */}
        {selectedGameForModal && (
          <GameDetailsModal
            game={selectedGameForModal}
            onClose={() => setSelectedGameForModal(null)}
            onPlayNow={(game) => {
              setSelectedGameForModal(null);
              setCurrentlyPlayingGameId(game.id);
            }}
            onCreateRoom={(game) => {
              setSelectedGameForModal(null);
              setSelectedGameForRoom(game);
            }}
          />
        )}

        {selectedGameForRoom && (
          <CreateRoomModal
            game={selectedGameForRoom}
            onClose={() => setSelectedGameForRoom(null)}
            onCreateSuccess={(room) => {
              setSelectedGameForRoom(null);
              setCurrentlyPlayingGameId(room.gameId);
            }}
          />
        )}

        {showDailyRewards && (
          <DailyRewardsModal
            onClose={() => setShowDailyRewards(false)}
            onClaimCoinsAndXp={(coins, xp) => {
              setPlayerCoins(prev => prev + coins);
              setPlayerXp(prev => prev + xp);
            }}
          />
        )}

        {selectedMiniPlayer && (
          <GameMiniProfileModal
            player={selectedMiniPlayer}
            onClose={() => setSelectedMiniPlayer(null)}
            onInviteToPlay={(player) => {
              setToast({
                titleAr: `🛸 تم إرسال دعوة للعب إلى ${player.name}!`,
                titleEn: `🛸 Game invitation sent to ${player.name}!`,
                type: 'invite'
              });
              setTimeout(() => setToast(null), 3500);
            }}
          />
        )}

      </div>
    </div>
  );
}
