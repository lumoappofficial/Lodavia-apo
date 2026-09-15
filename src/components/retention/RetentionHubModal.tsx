import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Award, 
  Calendar, 
  Sparkles, 
  X, 
  Crown, 
  Zap, 
  CheckCircle2, 
  Box, 
  Star, 
  Globe, 
  Flame, 
  ChevronRight, 
  BarChart3, 
  Gift, 
  PackageCheck,
  Shield,
  Layers,
  Search
} from 'lucide-react';
import { 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_WEEKLY_MISSIONS, 
  SEASON_PASS_TIERS, 
  COLLECTIBLES_CATALOG, 
  LEADERBOARD_USERS, 
  AchievementItem, 
  WeeklyMission, 
  CollectibleItem 
} from '../../data/retentionData';
import { useApp } from '../../contexts/AppContext';
import { playPresetSound } from '../../utils/synth';

interface RetentionHubModalProps {
  onClose: () => void;
  initialTab?: 'pass' | 'missions' | 'achievements' | 'collectibles' | 'leaderboard' | 'boxes';
}

export default function RetentionHubModal({ onClose, initialTab = 'pass' }: RetentionHubModalProps) {
  const { lang, currentUser } = useApp();
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'pass' | 'missions' | 'achievements' | 'collectibles' | 'leaderboard' | 'boxes'>(initialTab);

  // Retention States
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [missions, setMissions] = useState<WeeklyMission[]>(INITIAL_WEEKLY_MISSIONS);
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(COLLECTIBLES_CATALOG);
  const [userXp, setUserXp] = useState<number>(() => {
    return (currentUser.points || 250) + 300;
  });

  // Loot Box Animation State
  const [openingBox, setOpeningBox] = useState<'common' | 'rare' | 'epic' | 'legendary' | null>(null);
  const [boxReward, setBoxReward] = useState<{ titleAr: string; titleEn: string; icon: string; points: number } | null>(null);
  const [leaderboardTime, setLeaderboardTime] = useState<'weekly' | 'monthly'>('weekly');

  const userLevel = Math.floor(userXp / 200) + 1;
  const currentLevelXp = userXp % 200;

  // Claim Achievement
  const handleClaimAchievement = (id: string, pts: number, xp: number) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
    setUserXp(prev => prev + xp);
    playPresetSound('achievement');
  };

  // Claim Mission
  const handleClaimMission = (id: string, pts: number, xp: number) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: true, claimed: true } : m));
    setUserXp(prev => prev + xp);
    playPresetSound('reward');
  };

  // Open Cosmic Box
  const handleOpenLootBox = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    setOpeningBox(rarity);
    playPresetSound('store');

    setTimeout(() => {
      let reward = { titleAr: '150 نقطة كوكبية', titleEn: '150 Cosmic Points', icon: '🪙', points: 150 };
      if (rarity === 'rare') reward = { titleAr: '350 نقطة + إطار نادِر', titleEn: '350 Pts + Rare Frame', icon: '🖼️', points: 350 };
      if (rarity === 'epic') reward = { titleAr: '750 نقطة + خلفية كوكبية', titleEn: '750 Pts + Planet Theme', icon: '🪐', points: 750 };
      if (rarity === 'legendary') reward = { titleAr: '2000 نقطة + لقب أسطوري', titleEn: '2000 Pts + Legend Title', icon: '👑', points: 2000 };

      setBoxReward(reward);
      setUserXp(prev => prev + reward.points / 2);
      playPresetSound('achievement');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-[#E5E7EB] rounded-[24px] max-w-4xl w-full h-[88vh] flex flex-col shadow-[0_10px_35px_rgba(15,23,42,0.12)] overflow-hidden text-[#0F172A]"
      >
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] flex items-center justify-center font-black text-xl shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {isRtl ? 'مركز التقدم والجوائز الأسطورية' : 'Progress & Mastery Hub'}
                </h2>
                <span className="px-2.5 py-0.5 bg-[#55C8FF]/15 border border-[#55C8FF]/30 text-[#0F172A] text-[10px] font-extrabold rounded-full">
                  {isRtl ? `المستوى ${userLevel}` : `Level ${userLevel}`}
                </span>
              </div>
              <p className="text-xs text-[#475569] font-medium mt-0.5">
                {isRtl ? 'تتبع إنجازاتك، تذاكر المواسم، والمهام الكونية اليومية' : 'Track achievements, season passes & cosmic daily rewards'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#0F172A]">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userXp} XP</span>
            </div>

            <button
              onClick={() => {
                playPresetSound('click');
                onClose();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION BAR */}
        <div className="px-5 pt-3 pb-2 border-b border-[#E5E7EB] bg-white flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'pass', labelAr: 'تذكرة الموسم 🎫', labelEn: 'Season Pass 🎫' },
            { id: 'missions', labelAr: 'المهام الأسبوعية 🎯', labelEn: 'Weekly Missions 🎯' },
            { id: 'achievements', labelAr: 'الإنجازات 🏆', labelEn: 'Achievements 🏆' },
            { id: 'collectibles', labelAr: 'المجموعات 🌌', labelEn: 'Collectibles 🌌' },
            { id: 'leaderboard', labelAr: 'الصدارة 🥇', labelEn: 'Leaderboard 🥇' },
            { id: 'boxes', labelAr: 'صناديق اللوت 🎁', labelEn: 'Loot Boxes 🎁' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playPresetSound('nav');
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] shadow-sm'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200'
              }`}
            >
              {isRtl ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: SEASON PASS */}
          {activeTab === 'pass' && (
            <div className="space-y-6">
              {/* PASS HEADER BANNER */}
              <div className="p-5 bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 border border-sky-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-700 rounded-full text-[11px] font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'الموسم الأول: نداء المجرّة (متبقي 42 يوماً)' : 'Season 1: Galactic Call (42 Days Left)'}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    {isRtl ? 'تذكرة الموسم الكونية (60 يوماً)' : 'Cosmic Season Pass (60 Days)'}
                  </h3>
                  <p className="text-xs text-[#475569] font-medium mt-1">
                    {isRtl ? 'اكتسب الخبرة عبر التفاعل اليومي وافتح مكافآت المسارين المجاني والمميز' : 'Earn XP through daily engagement to unlock Free & Premium tiers'}
                  </p>
                </div>

                <div className="w-full md:w-64 bg-white p-3 border border-[#E5E7EB] rounded-xl">
                  <div className="flex justify-between text-xs font-bold mb-1 text-[#0F172A]">
                    <span>{isRtl ? 'تقدم المستوى' : 'Level Progress'}</span>
                    <span className="text-[#55C8FF]">{currentLevelXp} / 200 XP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(currentLevelXp / 200) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SEASON PASS TIERS TRACK */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                  {isRtl ? 'مسارات المكافآت والتصنيفات:' : 'Pass Rewards & Tiers Track:'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SEASON_PASS_TIERS.map(tier => {
                    const isUnlocked = userXp >= tier.requiredXp;

                    return (
                      <div 
                        key={tier.tier}
                        className={`p-4 border rounded-2xl transition-all flex items-center justify-between gap-4 ${
                          isUnlocked 
                            ? 'bg-white border-[#55C8FF]/50 shadow-[0_4px_16px_rgba(38,214,255,0.08)]' 
                            : 'bg-slate-50 border-[#E5E7EB] opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                            isUnlocked ? 'bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A]' : 'bg-slate-200 text-[#64748B]'
                          }`}>
                            T{tier.tier}
                          </div>

                          <div>
                            <div className="text-xs font-extrabold text-[#0F172A]">
                              {isRtl ? `المستوى ${tier.tier}` : `Tier ${tier.tier}`} ({tier.requiredXp} XP)
                            </div>
                            <div className="text-[11px] text-[#475569] flex items-center gap-2 mt-0.5 font-semibold">
                              <span>مجاني: {tier.freeReward.icon} {isRtl ? tier.freeReward.titleAr : tier.freeReward.titleEn}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                playPresetSound('reward');
                                setUserXp(prev => prev + 50);
                              }}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] font-extrabold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                            >
                              {isRtl ? 'استلام المكافأة' : 'Claim Reward'}
                            </button>
                          ) : (
                            <span className="text-[10px] bg-slate-200 text-[#64748B] px-2.5 py-1 rounded-full font-bold">
                              {isRtl ? 'مغلق' : 'Locked'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEEKLY MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#0F172A]">
                  {isRtl ? 'مهام الأسبوع النشطة 🎯' : 'Active Weekly Missions 🎯'}
                </h3>
                <span className="text-xs text-[#64748B] font-bold">
                  {isRtl ? 'تتجدد المهام كل يوم إثنين' : 'Resets every Monday'}
                </span>
              </div>

              <div className="space-y-3">
                {missions.map(mission => (
                  <div 
                    key={mission.id}
                    className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 text-2xl rounded-xl">
                        {mission.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#0F172A]">
                          {isRtl ? mission.titleAr : mission.titleEn}
                        </h4>
                        <p className="text-xs text-[#475569] font-medium mt-0.5">
                          {isRtl ? mission.descAr : mission.descEn}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] font-bold">
                          <span className="text-amber-600">+{mission.rewardPoints} Pts</span>
                          <span className="text-sky-600">+{mission.rewardXp} XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-xs font-bold text-[#64748B]">
                        {mission.progress} / {mission.target}
                      </div>

                      {mission.claimed ? (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{isRtl ? 'تم الاستلام' : 'Claimed'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimMission(mission.id, mission.rewardPoints, mission.rewardXp)}
                          className="px-4 py-2 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] font-extrabold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                        >
                          {isRtl ? 'استلام الجائزة 🪙' : 'Claim Reward 🪙'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#0F172A]">
                  {isRtl ? 'قائمة الإنجازات والجوائز 🏆' : 'Achievements & Trophies 🏆'}
                </h3>
                <span className="text-xs text-[#64748B] font-bold">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length} {isRtl ? 'مفتوح' : 'Unlocked'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div 
                    key={ach.id}
                    className={`p-4 border rounded-2xl transition-all flex items-center justify-between gap-3 ${
                      ach.unlocked 
                        ? 'bg-white border-amber-200 shadow-sm' 
                        : 'bg-slate-50 border-[#E5E7EB] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 bg-slate-100 rounded-xl">
                        {ach.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#0F172A]">
                          {isRtl ? ach.titleAr : ach.titleEn}
                        </h4>
                        <p className="text-[11px] text-[#475569] font-medium leading-relaxed mt-0.5">
                          {isRtl ? ach.descAr : ach.descEn}
                        </p>
                        <div className="text-[10px] font-bold text-amber-600 mt-1">
                          +{ach.points} Pts • +{ach.xp} XP
                        </div>
                      </div>
                    </div>

                    <div>
                      {ach.unlocked ? (
                        <span className="p-1.5 bg-amber-100 text-amber-700 rounded-full block">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimAchievement(ach.id, ach.points, ach.xp)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-[#0F172A] font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                        >
                          {isRtl ? 'فتح' : 'Unlock'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COLLECTIBLES */}
          {activeTab === 'collectibles' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                {isRtl ? 'خزانة المقتنيات والآثار الكونية 🌌' : 'Cosmic Collectibles & Relics Vault 🌌'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {collectibles.map(item => (
                  <div 
                    key={item.id}
                    className={`p-4 border rounded-2xl text-center space-y-2 transition-all ${
                      item.unlocked 
                        ? 'bg-white border-[#E5E7EB] shadow-sm' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-4xl my-2 animate-pulse">{item.icon}</div>
                    <div className="text-xs font-extrabold text-[#0F172A]">
                      {isRtl ? item.nameAr : item.nameEn}
                    </div>
                    <span className="inline-block text-[9px] px-2 py-0.5 bg-sky-100 text-sky-800 font-extrabold rounded-full">
                      {item.rarity}
                    </span>
                    <p className="text-[10px] text-[#475569] font-medium leading-relaxed">
                      {isRtl ? item.descAr : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-[#E5E7EB]">
                <span className="text-xs font-extrabold text-[#0F172A] px-2">
                  {isRtl ? 'لائحة متصدري شبكة لودافيا 🏆' : 'Lodavia Network Leaderboard 🏆'}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setLeaderboardTime('weekly')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leaderboardTime === 'weekly' ? 'bg-[#55C8FF] text-[#0F172A]' : 'text-[#64748B]'
                    }`}
                  >
                    {isRtl ? 'أسبوعي' : 'Weekly'}
                  </button>
                  <button
                    onClick={() => setLeaderboardTime('monthly')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leaderboardTime === 'monthly' ? 'bg-[#55C8FF] text-[#0F172A]' : 'text-[#64748B]'
                    }`}
                  >
                    {isRtl ? 'شهري' : 'Monthly'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {LEADERBOARD_USERS.map(user => (
                  <div 
                    key={user.rank}
                    className="p-3 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-[#55C8FF]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1 ? 'bg-amber-400 text-slate-950' : user.rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                      }`}>
                        #{user.rank}
                      </div>

                      <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt="" />

                      <div>
                        <div className="text-xs font-extrabold text-[#0F172A]">{user.name}</div>
                        <div className="text-[10px] text-[#475569] font-bold">{user.badge}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[#0F172A]">{user.points} Pts</div>
                      <div className="text-[10px] text-[#55C8FF] font-bold">{user.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COSMIC LOOT BOXES */}
          {activeTab === 'boxes' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {isRtl ? 'فتح صناديق اللوت والجوائز المباشرة 🎁' : 'Cosmic Loot Box Opening 🎁'}
                </h3>
                <p className="text-xs text-[#475569] font-medium mt-1">
                  {isRtl ? 'اختر الصندوق واكتشف أندر الألقاب والنقاط والإطارات البصرية' : 'Choose a loot box and discover rare titles, points & frames'}
                </p>
              </div>

              {openingBox && boxReward ? (
                <div className="p-8 bg-slate-50 border border-[#E5E7EB] rounded-3xl text-center space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div className="text-6xl animate-bounce">{boxReward.icon}</div>
                  <h4 className="text-xl font-black text-[#0F172A]">
                    {isRtl ? boxReward.titleAr : boxReward.titleEn}
                  </h4>
                  <p className="text-xs text-emerald-600 font-extrabold">
                    {isRtl ? 'تم إضافة الجائزة إلى حسابك بنجاح! ✨' : 'Reward added successfully to your account! ✨'}
                  </p>
                  <button
                    onClick={() => {
                      setOpeningBox(null);
                      setBoxReward(null);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    {isRtl ? 'متابعة الفتح' : 'Continue'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'common', nameAr: 'صندوق اعتيادي 📦', nameEn: 'Common Box 📦', cost: 100, icon: '📦' },
                    { id: 'rare', nameAr: 'صندوق نادِر 🎁', nameEn: 'Rare Box 🎁', cost: 250, icon: '🎁' },
                    { id: 'epic', nameAr: 'صندوق ملحمي 🔮', nameEn: 'Epic Box 🔮', cost: 500, icon: '🔮' },
                    { id: 'legendary', nameAr: 'صندوق أسطوري 👑', nameEn: 'Legendary Box 👑', cost: 1000, icon: '👑' }
                  ].map(box => (
                    <div 
                      key={box.id}
                      className="p-5 bg-white border border-[#E5E7EB] rounded-2xl text-center space-y-3 shadow-sm hover:border-[#55C8FF] transition-all"
                    >
                      <div className="text-4xl my-2">{box.icon}</div>
                      <div className="text-xs font-extrabold text-[#0F172A]">
                        {isRtl ? box.nameAr : box.nameEn}
                      </div>
                      <div className="text-xs font-bold text-amber-600">
                        {box.cost} Pts
                      </div>
                      <button
                        onClick={() => handleOpenLootBox(box.id as any)}
                        className="w-full py-2 bg-gradient-to-r from-[#55C8FF] to-[#26D6FF] text-[#0F172A] font-extrabold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {isRtl ? 'فتح الصندوق 🎁' : 'Open Box 🎁'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
