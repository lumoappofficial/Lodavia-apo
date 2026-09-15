import { CosmeticItem, PlanetLocation, DailyQuest, UniverseFriend, AlienAvatarCustomization, StarshipCustomization } from '../types/games';

// DEFAULT PLAYER CUSTOMIZATION
export const DEFAULT_AVATAR_CUSTOMIZATION: AlienAvatarCustomization = {
  headSpecies: 'classic_alien',
  skinTint: '#10b981', // Emerald green
  outfit: 'space_suit',
  accessory: 'antenna_star',
  titleBadgeAr: 'مستكشف الكواكب 🌌',
  titleBadgeEn: 'Planet Explorer 🌌'
};

export const DEFAULT_STARSHIP_CUSTOMIZATION: StarshipCustomization = {
  modelId: 'phoenix_scout',
  modelNameAr: 'مستكشف الفينكس 🚀',
  modelNameEn: 'Phoenix Scout 🚀',
  colorTheme: '#3b82f6',
  trailEffect: 'quantum_blue'
};

// PLANETS MAP LOCATIONS
export const LODAVIA_PLANETS: PlanetLocation[] = [
  {
    id: 'citadel_central',
    nameAr: 'قلعة لودافيا المركزية 🪐',
    nameEn: 'Lodavia Central Citadel 🪐',
    taglineAr: 'المقر الرئيسي، تخصيص الشخصية والمركبة واستلام المكافآت',
    taglineEn: 'Central Hub, customization & daily rewards',
    levelReq: 1,
    color: '#a855f7',
    bgGradient: 'from-purple-900/90 via-slate-900/90 to-indigo-950/90',
    icon: 'Sparkles',
    xPercent: 50,
    yPercent: 50,
    unlocked: true,
    type: 'citadel_hub'
  },
  {
    id: 'galaxy_chaos_planet',
    gameId: 'starship_chaos',
    nameAr: 'مجرة الفوضى الفضائية 🛸',
    nameEn: 'Starship Chaos Galaxy 🛸',
    taglineAr: 'لعبة فوضى وتنسيق الطاقم من 2 إلى 6 لاعبين!',
    taglineEn: 'Hilarious bridge chaos for 2-6 players!',
    levelReq: 1,
    color: '#f43f5e',
    bgGradient: 'from-rose-900/90 via-slate-900/90 to-amber-950/90',
    icon: 'Flame',
    xPercent: 22,
    yPercent: 30,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'planet_rescue',
    gameId: 'galaxy_rescue',
    nameAr: 'كوكب إنقاذ المجرة 🚀',
    nameEn: 'Galaxy Rescue Planet 🚀',
    taglineAr: 'مهمة إنقاذ رواد الفضاء وتجنب العقبات',
    taglineEn: 'Astronaut rescue mission through space debris',
    levelReq: 1,
    color: '#3b82f6',
    bgGradient: 'from-blue-900/90 via-slate-900/90 to-cyan-950/90',
    icon: 'Rocket',
    xPercent: 78,
    yPercent: 28,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'moon_mystery',
    gameId: 'who_is_alien',
    nameAr: 'قمر الغموض والفضائي الخفي 👽',
    nameEn: 'Moon of Mystery Impostor 👽',
    taglineAr: 'لعبة الاستنتاج وكشف المتسلل الفضائي',
    taglineEn: 'Unmask the hidden alien in social sessions',
    levelReq: 2,
    color: '#8b5cf6',
    bgGradient: 'from-purple-900/90 via-slate-900/90 to-fuchsia-950/90',
    icon: 'Bot',
    xPercent: 25,
    yPercent: 72,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'nebula_brains',
    gameId: 'lodavia_challenge',
    nameAr: 'سديم الذكاء والسرعة 🧠',
    nameEn: 'Speed Quiz Brain Nebula 🧠',
    taglineAr: 'تحدي أسئلة السرعة والمعلومات الكونية',
    taglineEn: 'Speed trivia test for cosmic geniuses',
    levelReq: 3,
    color: '#eab308',
    bgGradient: 'from-amber-900/90 via-slate-900/90 to-yellow-950/90',
    icon: 'Zap',
    xPercent: 75,
    yPercent: 75,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'galaxy_rush_planet',
    gameId: 'galaxy_rush',
    nameAr: 'حلبة سباق المجرات 🏎️',
    nameEn: 'Galaxy Rush Circuit 🏎️',
    taglineAr: 'سباق المركبات الفضائية فائق السرعة عبر الكون!',
    taglineEn: 'Ultra high-speed cosmic starship racing!',
    levelReq: 1,
    color: '#06b6d4',
    bgGradient: 'from-cyan-900/90 via-slate-900/90 to-blue-950/90',
    icon: 'Rocket',
    xPercent: 50,
    yPercent: 82,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'planet_rescue_planet',
    gameId: 'planet_rescue',
    nameAr: 'كوكب الأمل 🌍',
    nameEn: 'Hope Sanctuary Planet 🌍',
    taglineAr: 'عملية إنقاذ تعاونية لحماية الكوكب من الكوارث!',
    taglineEn: 'Co-op rescue mission to protect the planet from disasters!',
    levelReq: 1,
    color: '#10b981',
    bgGradient: 'from-emerald-900/90 via-slate-900/90 to-teal-950/90',
    icon: 'Globe',
    xPercent: 22,
    yPercent: 78,
    unlocked: true,
    type: 'game_planet'
  },
  {
    id: 'arena_titan',
    nameAr: 'ميدان التيتان للأبطال 🏆',
    nameEn: 'Titan Champions Arena 🏆',
    taglineAr: 'ميدان التحديات الكبرى الأسبوعية والبطولات',
    taglineEn: 'Weekly championship grand arena',
    levelReq: 5,
    color: '#ec4899',
    bgGradient: 'from-pink-900/90 via-slate-900/90 to-rose-950/90',
    icon: 'Trophy',
    xPercent: 50,
    yPercent: 18,
    unlocked: false,
    type: 'boss_nebula'
  }
];

// COSMETIC ITEMS CATALOG
export const COSMETIC_ITEMS: CosmeticItem[] = [
  // HEADS / ALIEN SPECIES
  {
    id: 'classic_alien',
    nameAr: 'فضائي زورجون 👽',
    nameEn: 'Classic Zorgon 👽',
    type: 'head',
    icon: '👽',
    priceCoins: 0,
    minLevelReq: 1,
    rarity: 'common',
    unlocked: true,
    value: '#10b981'
  },
  {
    id: 'cyber_cyclops',
    nameAr: 'سايبورغ عين المجرّة 👁️',
    nameEn: 'Cyber Cyclops 👁️',
    type: 'head',
    icon: '👁️',
    priceCoins: 150,
    minLevelReq: 2,
    rarity: 'rare',
    unlocked: false,
    value: '#06b6d4'
  },
  {
    id: 'astro_cat',
    nameAr: 'قط المجرّة الفضائي 🐱',
    nameEn: 'Astro Cat 🐱',
    type: 'head',
    icon: '🐱',
    priceCoins: 250,
    minLevelReq: 3,
    rarity: 'epic',
    unlocked: false,
    value: '#f59e0b'
  },
  {
    id: 'nebula_elemental',
    nameAr: 'عنصر سديم الكوانتم 👾',
    nameEn: 'Nebula Elemental 👾',
    type: 'head',
    icon: '👾',
    priceCoins: 400,
    minLevelReq: 4,
    rarity: 'legendary',
    unlocked: false,
    value: '#a855f7'
  },

  // SKIN TINTS
  {
    id: 'emerald_green',
    nameAr: 'زمردي مجرّي 🟢',
    nameEn: 'Galactic Emerald 🟢',
    type: 'skin',
    icon: '🟢',
    priceCoins: 0,
    minLevelReq: 1,
    rarity: 'common',
    unlocked: true,
    value: '#10b981'
  },
  {
    id: 'cosmic_purple',
    nameAr: 'بنفسجي كوني 💜',
    nameEn: 'Cosmic Violet 💜',
    type: 'skin',
    icon: '💜',
    priceCoins: 100,
    minLevelReq: 2,
    rarity: 'rare',
    unlocked: false,
    value: '#a855f7'
  },
  {
    id: 'supernova_orange',
    nameAr: 'برتقالي المستعر 🧡',
    nameEn: 'Supernova Orange 🧡',
    type: 'skin',
    icon: '🧡',
    priceCoins: 150,
    minLevelReq: 3,
    rarity: 'rare',
    unlocked: false,
    value: '#f97316'
  },
  {
    id: 'quantum_cyan',
    nameAr: 'سماوي الكوانتم 💙',
    nameEn: 'Quantum Cyan 💙',
    type: 'skin',
    icon: '💙',
    priceCoins: 200,
    minLevelReq: 3,
    rarity: 'epic',
    unlocked: false,
    value: '#06b6d4'
  },

  // OUTFITS
  {
    id: 'space_suit',
    nameAr: 'بدلة الطيران الأساسية 👨‍🚀',
    nameEn: 'Basic Flight Suit 👨‍🚀',
    type: 'outfit',
    icon: '👨‍🚀',
    priceCoins: 0,
    minLevelReq: 1,
    rarity: 'common',
    unlocked: true,
    value: 'suit_white'
  },
  {
    id: 'cyber_armor',
    nameAr: 'درع السايبورغ النيون 🛡️',
    nameEn: 'Cyber Neon Armor 🛡️',
    type: 'outfit',
    icon: '🛡️',
    priceCoins: 200,
    minLevelReq: 2,
    rarity: 'rare',
    unlocked: false,
    value: 'armor_cyan'
  },
  {
    id: 'admiral_cloak',
    nameAr: 'عباءة الأدميرال الكوني 🧥',
    nameEn: 'Galactic Admiral Cloak 🧥',
    type: 'outfit',
    icon: '🧥',
    priceCoins: 350,
    minLevelReq: 4,
    rarity: 'epic',
    unlocked: false,
    value: 'cloak_gold'
  },

  // ACCESSORIES
  {
    id: 'antenna_star',
    nameAr: 'قرن استشعار النجوم 📡',
    nameEn: 'Star Antenna 📡',
    type: 'accessory',
    icon: '📡',
    priceCoins: 0,
    minLevelReq: 1,
    rarity: 'common',
    unlocked: true,
    value: 'antenna'
  },
  {
    id: 'neon_visor',
    nameAr: 'نظارة نيون مستقبلية 👓',
    nameEn: 'Neon Visor 👓',
    type: 'accessory',
    icon: '👓',
    priceCoins: 120,
    minLevelReq: 2,
    rarity: 'rare',
    unlocked: false,
    value: 'visor'
  },
  {
    id: 'crown_star',
    nameAr: 'تاج المجرّة الذهبي 👑',
    nameEn: 'Celestial Crown 👑',
    type: 'accessory',
    icon: '👑',
    priceCoins: 300,
    minLevelReq: 5,
    rarity: 'legendary',
    unlocked: false,
    value: 'crown'
  },

  // SHIP MODELS
  {
    id: 'phoenix_scout',
    nameAr: 'مستكشف الفينكس 🚀',
    nameEn: 'Phoenix Scout 🚀',
    type: 'ship_model',
    icon: '🚀',
    priceCoins: 0,
    minLevelReq: 1,
    rarity: 'common',
    unlocked: true,
    value: 'phoenix'
  },
  {
    id: 'cosmic_cruiser',
    nameAr: 'طرّاد الكواكب الكوني 🛸',
    nameEn: 'Cosmic Cruiser 🛸',
    type: 'ship_model',
    icon: '🛸',
    priceCoins: 250,
    minLevelReq: 3,
    rarity: 'rare',
    unlocked: false,
    value: 'cruiser'
  },
  {
    id: 'nebula_interceptor',
    nameAr: 'اعتراض السديم الفائق 🌌',
    nameEn: 'Nebula Interceptor 🌌',
    type: 'ship_model',
    icon: '🌌',
    priceCoins: 450,
    minLevelReq: 5,
    rarity: 'epic',
    unlocked: false,
    value: 'interceptor'
  },
  {
    id: 'lodavia_dreadnought',
    nameAr: 'مدمرة لودافيا العظمى 🪐',
    nameEn: 'Lodavia Dreadnought 🪐',
    type: 'ship_model',
    icon: '🪐',
    priceCoins: 700,
    minLevelReq: 7,
    rarity: 'legendary',
    unlocked: false,
    value: 'dreadnought'
  }
];

// DAILY QUESTS
export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest_1',
    gameId: 'starship_chaos',
    titleAr: 'العب مباراة واحدة في فوضى المركبة الفضائية 🛸',
    titleEn: 'Play 1 match of Starship Chaos 🛸',
    rewardCoins: 80,
    rewardXp: 120,
    currentProgress: 0,
    maxProgress: 1,
    completed: false
  },
  {
    id: 'quest_2',
    gameId: 'galaxy_rescue',
    titleAr: 'أنقذ 3 رواد فضاء في مهمة المجرة 🚀',
    titleEn: 'Rescue 3 astronauts in Galaxy Rescue 🚀',
    rewardCoins: 60,
    rewardXp: 100,
    currentProgress: 1,
    maxProgress: 3,
    completed: false
  },
  {
    id: 'quest_3',
    gameId: 'lodavia_challenge',
    titleAr: 'حقق 500 نقطة في تحدي لودافيا 🧠',
    titleEn: 'Score 500 points in Lodavia Challenge 🧠',
    rewardCoins: 90,
    rewardXp: 150,
    currentProgress: 0,
    maxProgress: 1,
    completed: false
  }
];

// FRIENDS LIST
export const INITIAL_UNIVERSE_FRIENDS: UniverseFriend[] = [
  {
    id: 'friend_1',
    name: 'الكابتن زاد 👽',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    level: 7,
    xp: 1420,
    cosmicCoins: 850,
    activeShip: 'مدمرة لودافيا 🪐',
    currentPlanetAr: 'مجرة الفوضى الفضائية',
    currentPlanetEn: 'Starship Chaos Galaxy',
    isOnline: true,
    rank: 1
  },
  {
    id: 'friend_2',
    name: 'سارة الكونية 🚀',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    level: 5,
    xp: 980,
    cosmicCoins: 520,
    activeShip: 'طرّاد الكواكب 🛸',
    currentPlanetAr: 'قلعة لودافيا المركزية',
    currentPlanetEn: 'Lodavia Citadel',
    isOnline: true,
    rank: 2
  },
  {
    id: 'friend_3',
    name: 'طارق السايبورغ ⚡',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    level: 4,
    xp: 680,
    cosmicCoins: 340,
    activeShip: 'مستكشف الفينكس 🚀',
    currentPlanetAr: 'قمر الغموض',
    currentPlanetEn: 'Moon of Mystery',
    isOnline: false,
    rank: 3
  },
  {
    id: 'friend_4',
    name: 'منى نجمة المجرّة 🌟',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    level: 4,
    xp: 610,
    cosmicCoins: 290,
    activeShip: 'مستكشف الفينكس 🚀',
    currentPlanetAr: 'سديم الذكاء',
    currentPlanetEn: 'Brain Nebula',
    isOnline: true,
    rank: 4
  }
];
