export interface AchievementItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  points: number;
  xp: number;
  category: 'social' | 'streak' | 'creator' | 'explore' | 'legend';
  target: number;
  unlocked?: boolean;
}

export interface WeeklyMission {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  target: number;
  progress: number;
  rewardPoints: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface SeasonPassTier {
  tier: number;
  requiredXp: number;
  freeReward: { titleAr: string; titleEn: string; points: number; icon: string };
  premiumReward: { titleAr: string; titleEn: string; item: string; icon: string };
}

export interface CollectibleItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'star' | 'planet' | 'galaxy' | 'relic' | 'medal';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  icon: string;
  descAr: string;
  descEn: string;
  unlocked: boolean;
}

export interface StoreBundle {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  pricePoints: number;
  tagAr: string;
  tagEn: string;
  items: string[];
  icon: string;
  gradient: string;
}

export const DAILY_REWARDS_7DAYS = [
  { day: 1, type: 'points', value: 50, titleAr: '50 نقطة', titleEn: '50 Points', icon: '🪙' },
  { day: 2, type: 'points', value: 75, titleAr: '75 نقطة', titleEn: '75 Points', icon: '🪙' },
  { day: 3, type: 'points', value: 100, titleAr: '100 نقطة', titleEn: '100 Points', icon: '💎' },
  { day: 4, type: 'box', value: 'Mystery Box', titleAr: 'صندوق الغموض 🎁', titleEn: 'Mystery Box 🎁', icon: '🎁' },
  { day: 5, type: 'avatar', value: 'Premium Avatar', titleAr: 'رمز آفتار مميز 👤', titleEn: 'Premium Avatar 👤', icon: '👤' },
  { day: 6, type: 'frame', value: 'Rare Frame', titleAr: 'إطار نادِر 🖼️', titleEn: 'Rare Frame 🖼️', icon: '🖼️' },
  { day: 7, type: 'chest', value: 'Cosmic Chest', titleAr: 'صندوق كوني فاخر 🪐', titleEn: 'Cosmic Chest 🪐', icon: '🪐' }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_login',
    titleAr: 'تسجيل الدخول الأول',
    titleEn: 'First Login',
    descAr: 'انضمامك الأسطوري إلى شبكة لودافيا',
    descEn: 'Your legendary entry into the Lodavia network',
    icon: '🚀',
    points: 100,
    xp: 50,
    category: 'explore',
    target: 1,
    unlocked: true
  },
  {
    id: 'first_friend',
    titleAr: 'أول صديق',
    titleEn: 'First Friend',
    descAr: 'إضافة أول رفيق إلى القائمة الكونية',
    descEn: 'Adding your first companion to your cosmic list',
    icon: '🤝',
    points: 150,
    xp: 75,
    category: 'social',
    target: 1,
    unlocked: true
  },
  {
    id: 'first_community',
    titleAr: 'أول مجتمع',
    titleEn: 'First Community',
    descAr: 'الانضمام إلى مجتمع لودافيا المتخصص',
    descEn: 'Joining your first specialized Lodavia community',
    icon: '🌐',
    points: 200,
    xp: 100,
    category: 'social',
    target: 1,
    unlocked: true
  },
  {
    id: '100_posts',
    titleAr: '100 منشور',
    titleEn: '100 Posts',
    descAr: 'مشاركة 100 فكرة أو إبداع في الموجات',
    descEn: 'Share 100 thoughts or creations in the feed',
    icon: '📝',
    points: 500,
    xp: 300,
    category: 'creator',
    target: 100,
    unlocked: false
  },
  {
    id: '1000_likes',
    titleAr: '1000 إعجاب',
    titleEn: '1000 Likes',
    descAr: 'الحصول على 1000 تفاعل من أفراد المجرة',
    descEn: 'Receive 1000 interactions from galaxy members',
    icon: '❤️',
    points: 1000,
    xp: 600,
    category: 'creator',
    target: 1000,
    unlocked: false
  },
  {
    id: '7day_streak',
    titleAr: 'سلسلة 7 أيام',
    titleEn: '7-Day Streak',
    descAr: 'تسجيل دخول متتالي لمدة أسبوع كامل',
    descEn: 'Consecutive login streak for a full week',
    icon: '🔥',
    points: 400,
    xp: 250,
    category: 'streak',
    target: 7,
    unlocked: false
  },
  {
    id: 'offline_explorer',
    titleAr: 'مستكشف الوضع أوفلاين',
    titleEn: 'Offline Explorer',
    descAr: 'استخدام المركز أوفلاين وحفظ المحتوى',
    descEn: 'Use Offline Center and save offline resources',
    icon: '⚡',
    points: 300,
    xp: 150,
    category: 'explore',
    target: 1,
    unlocked: true
  },
  {
    id: 'course_graduate',
    titleAr: 'خريج دورة',
    titleEn: 'Course Graduate',
    descAr: 'إكمال دورة تعليمية تفاعلية بالكامل',
    descEn: 'Complete an interactive learning course fully',
    icon: '🎓',
    points: 500,
    xp: 400,
    category: 'explore',
    target: 1,
    unlocked: false
  },
  {
    id: 'creator_pro',
    titleAr: 'صانع محتوى',
    titleEn: 'Creator',
    descAr: 'نشر محتوى أصل في سوق أو مجتمعات لودافيا',
    descEn: 'Publish original content in marketplace or communities',
    icon: '🎨',
    points: 600,
    xp: 350,
    category: 'creator',
    target: 1,
    unlocked: false
  },
  {
    id: 'legend_lodavia',
    titleAr: 'أسطورة لودافيا',
    titleEn: 'Legend',
    descAr: 'الوصول إلى المستوى 10 وفتح كافة أوسمة الشرف',
    descEn: 'Reach Level 10 and unlock all medals of honor',
    icon: '👑',
    points: 2000,
    xp: 1500,
    category: 'legend',
    target: 10,
    unlocked: false
  }
];

export const INITIAL_WEEKLY_MISSIONS: WeeklyMission[] = [
  {
    id: 'wm_login_5',
    titleAr: 'تسجيل الدخول 5 أيام',
    titleEn: 'Login 5 Days',
    descAr: 'افتح تطبيق لودافيا 5 أيام خلال هذا الأسبوع',
    descEn: 'Open the Lodavia app 5 days this week',
    target: 5,
    progress: 3,
    rewardPoints: 200,
    rewardXp: 150,
    completed: false,
    claimed: false,
    icon: '🗓️'
  },
  {
    id: 'wm_voice_3',
    titleAr: 'الانضمام إلى 3 غرف صوتية',
    titleEn: 'Join 3 Voice Rooms',
    descAr: 'تفاعل وشارك الحوار في 3 مساحات صوتية',
    descEn: 'Engage and participate in 3 audio spaces',
    target: 3,
    progress: 2,
    rewardPoints: 250,
    rewardXp: 200,
    completed: false,
    claimed: false,
    icon: '🎙️'
  },
  {
    id: 'wm_complete_course',
    titleAr: 'إكمال دورة واحدة',
    titleEn: 'Complete One Course',
    descAr: 'شاهد دروس دورة تعليمية وحقق شارتها',
    descEn: 'Watch learning lessons and achieve its badge',
    target: 1,
    progress: 0,
    rewardPoints: 300,
    rewardXp: 250,
    completed: false,
    claimed: false,
    icon: '📚'
  },
  {
    id: 'wm_help_5',
    titleAr: 'مساعدة 5 أعضاء',
    titleEn: 'Help 5 Users',
    descAr: 'الرد وإبداء الإعجاب بـ 5 مشاركات مجتمعية',
    descEn: 'Reply and like 5 community posts',
    target: 5,
    progress: 4,
    rewardPoints: 200,
    rewardXp: 150,
    completed: false,
    claimed: false,
    icon: '🤝'
  },
  {
    id: 'wm_create_comm',
    titleAr: 'إنشاء مجتمع واحد',
    titleEn: 'Create One Community',
    descAr: 'أو الانضمام لمجتمع كوني جديد',
    descEn: 'Or join a brand new cosmic community',
    target: 1,
    progress: 1,
    rewardPoints: 350,
    rewardXp: 300,
    completed: true,
    claimed: false,
    icon: '🌐'
  }
];

export const SEASON_PASS_TIERS: SeasonPassTier[] = Array.from({ length: 15 }, (_, index) => {
  const tier = index + 1;
  return {
    tier,
    requiredXp: tier * 150,
    freeReward: {
      titleAr: `${tier * 50} نقطة`,
      titleEn: `${tier * 50} Pts`,
      points: tier * 50,
      icon: '🪙'
    },
    premiumReward: {
      titleAr: tier % 3 === 0 ? `إطار كوني المستوى ${tier}` : `رمز نادِر ${tier}`,
      titleEn: tier % 3 === 0 ? `Cosmic Frame Level ${tier}` : `Rare Emblem ${tier}`,
      item: `cosmetic_pass_tier_${tier}`,
      icon: tier % 3 === 0 ? '🖼️' : '✨'
    }
  };
});

export const COLLECTIBLES_CATALOG: CollectibleItem[] = [
  {
    id: 'star_alpha',
    nameAr: 'نجم الفا الشعراء',
    nameEn: 'Alpha Sirius Star',
    category: 'star',
    rarity: 'Common',
    icon: '⭐',
    descAr: 'أول جوهرة استكشاف ناصعة في سماء لودافيا',
    descEn: 'First bright exploration gem in Lodavia sky',
    unlocked: true
  },
  {
    id: 'planet_cyan',
    nameAr: 'كوكب السديم السماوي',
    nameEn: 'Cyan Nebula Planet',
    category: 'planet',
    rarity: 'Rare',
    icon: '🪐',
    descAr: 'كوكب مليء ببلورات الطاقة والذكاء الاصطناعي',
    descEn: 'Planet rich with energy crystals and AI',
    unlocked: true
  },
  {
    id: 'galaxy_aurora',
    nameAr: 'مجرة الأورورا المتلألئة',
    nameEn: 'Glowing Aurora Galaxy',
    category: 'galaxy',
    rarity: 'Epic',
    icon: '🌌',
    descAr: 'مجرة متقدمة تضم أكثر من مليون عقله رقمية',
    descEn: 'Advanced galaxy holding over a million digital minds',
    unlocked: false
  },
  {
    id: 'relic_quantum',
    nameAr: 'أثر الكم الكوني',
    nameEn: 'Quantum Relic',
    category: 'relic',
    rarity: 'Legendary',
    icon: '🔮',
    descAr: 'أثر كوني قديم يزيد سرعة اكتساب الخبرة',
    descEn: 'Ancient relic boosting XP gain speed',
    unlocked: false
  },
  {
    id: 'medal_pioneer',
    nameAr: 'وسام الرواد الأوائل',
    nameEn: 'Pioneer Explorer Medal',
    category: 'medal',
    rarity: 'Legendary',
    icon: '🏅',
    descAr: 'شرف يناله كبار مستكشفي مجرة لودافيا',
    descEn: 'Honor granted to master Lodavia pioneers',
    unlocked: true
  }
];

export const STORE_BUNDLES: StoreBundle[] = [
  {
    id: 'bundle_starter',
    titleAr: 'حزمة البداية الكونية 🚀',
    titleEn: 'Cosmic Starter Pack 🚀',
    descAr: '500 نقطة + إطار المبتدئين + رمز الشرف الأسطوري',
    descEn: '500 Points + Starter Frame + Legendary Emblem',
    pricePoints: 200,
    tagAr: 'الأكثر شعبية 🔥',
    tagEn: 'Most Popular 🔥',
    items: ['500 Points', 'Neon Blue Frame', 'Pioneer Badge'],
    icon: '🎁',
    gradient: 'from-sky-500 to-cyan-500'
  },
  {
    id: 'bundle_explorer',
    titleAr: 'حزمة المستكشف الفائق 🌌',
    titleEn: 'Super Explorer Pack 🌌',
    descAr: '1200 نقطة + خلفية الكوكب السماوي + لقب السفير الكوني',
    descEn: '1200 Points + Cyan Planet Theme + Ambassador Title',
    pricePoints: 450,
    tagAr: 'قيمة ممتازة ✨',
    tagEn: 'Best Value ✨',
    items: ['1200 Points', 'Galaxy Background', 'Ambassador Title'],
    icon: '🪐',
    gradient: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'bundle_creator',
    titleAr: 'حزمة صانع المحتوى المبدع 🎨',
    titleEn: 'Creative Creator Pack 🎨',
    descAr: '2000 نقطة + لون الاسم الذهبي المضيء + إشارة الموثق',
    descEn: '2000 Points + Glowing Gold Name + Creator Badge',
    pricePoints: 750,
    tagAr: 'للمبدعين 🎨',
    tagEn: 'For Creators 🎨',
    items: ['2000 Points', 'Golden Glow Name', 'Creator Badge'],
    icon: '👑',
    gradient: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'bundle_galaxy',
    titleAr: 'حزمة المجرة الملكية 💎',
    titleEn: 'Royal Galaxy Pack 💎',
    descAr: '5000 نقطة + هالة بصرية مضيئة + 3 صناديق لوت نادرة',
    descEn: '5000 Points + Aura Visual Effect + 3 Rare Loot Boxes',
    pricePoints: 1500,
    tagAr: 'فاخرة جداً 💎',
    tagEn: 'Luxury Pack 💎',
    items: ['5000 Points', 'Aura Visual Effect', '3 Loot Boxes'],
    icon: '🔮',
    gradient: 'from-sky-400 via-cyan-400 to-amber-400'
  },
  {
    id: 'bundle_legend',
    titleAr: 'حزمة الأسطورة الخالدة 👑',
    titleEn: 'Eternal Legend Pack 👑',
    descAr: '10000 نقطة + جميع الألقاب المتاحة + اشتراك بريميوم 30 يوماً',
    descEn: '10000 Points + All Titles + 30 Days Premium Pass',
    pricePoints: 2500,
    tagAr: 'الأسطورية 🏆',
    tagEn: 'Legendary 🏆',
    items: ['10000 Points', 'All Exclusive Titles', '30 Days Premium'],
    icon: '🏆',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500'
  }
];

export const LEADERBOARD_USERS = [
  { rank: 1, name: 'Sami Cosmic 🌌', points: 18450, xp: 9200, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', badge: '🥇 Explorer King' },
  { rank: 2, name: 'Lina Stars ✨', points: 14200, xp: 7100, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', badge: '🥈 Galaxy Master' },
  { rank: 3, name: 'Omar Quantum ⚡', points: 11900, xp: 5950, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', badge: '🥉 Pioneer' },
  { rank: 4, name: 'Nour Sky 🚀', points: 9800, xp: 4900, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', badge: 'Top Creator' },
  { rank: 5, name: 'Zaid Nebula 🪐', points: 8400, xp: 4200, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', badge: 'Helper Pro' },
  { rank: 6, name: 'Yasmin Orbit 💫', points: 7200, xp: 3600, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', badge: 'Top Scholar' },
  { rank: 7, name: 'Faris Nova 🌟', points: 6100, xp: 3050, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', badge: 'Voice Host' }
];
