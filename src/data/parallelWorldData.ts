import { 
  PlanetRegion, 
  ParallelGate, 
  ParallelAchievement, 
  GlobalEvent, 
  ExplorerUser, 
  PersonalBuilding 
} from '../types/parallelWorld';

export const PARALLEL_PLANETS: PlanetRegion[] = [
  {
    id: 'ideas',
    nameAr: 'كوكب الأفكار',
    nameEn: 'Idea Planet',
    icon: '💡',
    descriptionAr: 'من حاضنة الابتكارات وبذور الأفكار المستقبلية. شارك أفكارك، وقم بزراعة بذرة فكرة كوكبية!',
    descriptionEn: 'The planetary incubation chamber for futuristic ideas and creative seeds.',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    bgGradient: 'from-amber-500/20 via-yellow-950/40 to-slate-950',
    orbitRadius: 180,
    orbitAngle: 0,
    stats: { labelAr: 'بذرة فكرة منشورة', labelEn: 'Idea Seeds Planted', value: '1,420' },
    activitiesCount: 14,
    unlocked: true
  },
  {
    id: 'games',
    nameAr: 'كوكب الألعاب',
    nameEn: 'Game Planet',
    icon: '🎮',
    descriptionAr: 'منطقة ألعاب لودافيا الكونية التنافسية. خض تحديات أركيد سريعة واجمع أوسمة النواة!',
    descriptionEn: 'Cosmic competitive gaming arena with galactic leaderboards and arcade mini-games.',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-600/20 via-indigo-950/40 to-slate-950',
    orbitRadius: 210,
    orbitAngle: 45,
    stats: { labelAr: 'جولة ملحمية مفرغة', labelEn: 'Epic Matches Played', value: '8,850' },
    activitiesCount: 9,
    unlocked: true
  },
  {
    id: 'knowledge',
    nameAr: 'كوكب المعرفة',
    nameEn: 'Knowledge Planet',
    icon: '🧠',
    descriptionAr: 'منارة العلوم المتقدمة والمعرفة الكونية. اختبر معلوماتك وافتح بلورات الحكمة!',
    descriptionEn: 'Sanctuary of futuristic knowledge, interactive quizzes, and wisdom crystals.',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    bgGradient: 'from-cyan-500/20 via-slate-900/60 to-slate-950',
    orbitRadius: 240,
    orbitAngle: 90,
    stats: { labelAr: 'حقيقة علمية موثقة', labelEn: 'Facts Verified', value: '3,100' },
    activitiesCount: 18,
    unlocked: true
  },
  {
    id: 'creator',
    nameAr: 'كوكب المبدعين',
    nameEn: 'Creator Planet',
    icon: '🎨',
    descriptionAr: 'مسرح الفنون الرقمية وتوليد الأصول الكونية. أطلق إبداعاتك البصرية واستعرض معارضك!',
    descriptionEn: 'Digital arts arena and generative cosmic design showcase.',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgGradient: 'from-pink-500/20 via-purple-950/40 to-slate-950',
    orbitRadius: 200,
    orbitAngle: 135,
    stats: { labelAr: 'عمل فني كوني', labelEn: 'Cosmic Artworks', value: '2,650' },
    activitiesCount: 12,
    unlocked: true
  },
  {
    id: 'project',
    nameAr: 'كوكب المشاريع',
    nameEn: 'Project Planet',
    icon: '💼',
    descriptionAr: 'واحة الشركات الرقمية وحاضنات الأعمال الكونية. ابنِ أبراج مشاريعك واستقطب الشركاء!',
    descriptionEn: 'Digital venture hub and venture building towers on Lodavia.',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-500/20 via-teal-950/40 to-slate-950',
    orbitRadius: 230,
    orbitAngle: 180,
    stats: { labelAr: 'مشروع نشط', labelEn: 'Active Ventures', value: '940' },
    activitiesCount: 11,
    unlocked: true
  },
  {
    id: 'community',
    nameAr: 'كوكب المجتمع',
    nameEn: 'Community Planet',
    icon: '🤝',
    descriptionAr: 'ملتقى الكيانات والمجتمعات الفضائية. التَقِ بالأصدقاء، وشارك في الصالونات الصوتية!',
    descriptionEn: 'Gathering hub for space entities and active community connections.',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-600/20 via-sky-950/40 to-slate-950',
    orbitRadius: 190,
    orbitAngle: 225,
    stats: { labelAr: 'مستكشف متصل الآن', labelEn: 'Active Explorers', value: '312' },
    activitiesCount: 22,
    unlocked: true
  },
  {
    id: 'ai_lab',
    nameAr: 'مختبر الذكاء الاصطناعي',
    nameEn: 'AI Lab',
    icon: '🤖',
    descriptionAr: 'مركز العقول الاصطناعية الفائقة لتجربة نماذج Gemini والتحليل الكمومي المتقدم.',
    descriptionEn: 'Quantum AI Research Center hosting Gemini neural tools and smart agents.',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-violet-600/20 via-purple-950/50 to-slate-950',
    orbitRadius: 260,
    orbitAngle: 270,
    stats: { labelAr: 'استعلام ذكي منفذ', labelEn: 'AI Inquiries Handled', value: '15,200' },
    activitiesCount: 16,
    unlocked: true
  },
  {
    id: 'future_gate',
    nameAr: 'بوابة المستقبل',
    nameEn: 'Future Gate',
    icon: '🔮',
    descriptionAr: 'البوابة الكونية لمحاكاة "ماذا لو؟" واكتشاف السيناريوهات المستقبلية لقراراتك.',
    descriptionEn: 'Cosmic oracle portal running "What If?" AI future scenario simulations.',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    bgGradient: 'from-sky-400/25 via-indigo-950/60 to-slate-950',
    orbitRadius: 280,
    orbitAngle: 315,
    stats: { labelAr: 'محاكاة مستقبلية', labelEn: 'Future Simulations', value: '4,590' },
    activitiesCount: 8,
    unlocked: true
  }
];

export const PARALLEL_GATES: ParallelGate[] = [
  {
    id: 'future',
    nameAr: '🔮 بوابة المستقبل (ماذا لو؟)',
    nameEn: '🔮 Future Gate (What If?)',
    icon: '🔮',
    descriptionAr: 'استفسر من العقل الاصطناعي الكوني: "ماذا لو بدأت مشروعي/تعلمت البرمجة/غيرت مساري؟"',
    descriptionEn: 'Ask the Cosmic AI Oracle: "What if I launched my project / learned coding?"',
    badge: 'AI Oracle',
    gradient: 'from-sky-500 via-indigo-600 to-purple-600'
  },
  {
    id: 'unknown',
    nameAr: '🕵️ بوابة المجهول',
    nameEn: '🕵️ Unknown Gate',
    icon: '🕵️',
    descriptionAr: 'ألغاز كونية متغيرة وتحديات استكشافية تحتاج تفكيراً تحليلياً وعصصفاً ذهنياً.',
    descriptionEn: 'Mysterious cosmic riddles and exploration puzzles requiring analytical focus.',
    badge: 'Mystic Trial',
    gradient: 'from-purple-600 via-pink-600 to-amber-500'
  },
  {
    id: 'coop',
    nameAr: '🤝 بوابة التعاون',
    nameEn: '🤝 Cooperation Gate',
    icon: '🤝',
    descriptionAr: 'مهمات جماعية يتشارك فيها مستكشفو لودافيا لشحن نواة السديم واكتشاف مناطق جديدة.',
    descriptionEn: 'Group missions requiring multi-explorer synergy to power the nebula core.',
    badge: 'Co-op Synergy',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-500'
  },
  {
    id: 'idea',
    nameAr: '💡 بوابة الأفكار',
    nameEn: '💡 Idea Gate',
    icon: '💡',
    descriptionAr: 'تحديات الابتكار السريع وحل المشكلات المعقدة وصياغة الرؤى المستقبلية.',
    descriptionEn: 'Rapid innovation challenges and creative solution pitching.',
    badge: 'Innovation Hub',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500'
  },
  {
    id: 'time',
    nameAr: '⏳ بوابة الزمن',
    nameEn: '⏳ Time Gate',
    icon: '⏳',
    descriptionAr: 'شاهد خطك الزمني المحتمل بعد 5 سنوات بناءً على مهاراتك ونشاطك الحالي.',
    descriptionEn: 'Preview your 5-year cosmic evolution timeline based on current trajectory.',
    badge: 'Time Warp',
    gradient: 'from-cyan-400 via-blue-600 to-purple-700'
  }
];

export const PARALLEL_ACHIEVEMENTS: ParallelAchievement[] = [
  {
    id: 'explorer_1',
    titleAr: '🌟 مستكشف الكون',
    titleEn: '🌟 Cosmos Explorer',
    descriptionAr: 'قم بزيارة واستكشاف جميع الكواكب الثمانية في العالم الموازي.',
    descriptionEn: 'Visit and explore all 8 planets in the Parallel World.',
    icon: '🌌',
    unlocked: true,
    xpReward: 500
  },
  {
    id: 'idea_creator_1',
    titleAr: '💡 صانع الأفكار',
    titleEn: '💡 Idea Creator',
    descriptionAr: 'انشر 5 بذور أفكار في كوكب الأفكار واحصل على إعجابات المستكشفين.',
    descriptionEn: 'Publish 5 idea seeds on the Idea Planet.',
    icon: '🌱',
    unlocked: true,
    xpReward: 350
  },
  {
    id: 'coop_hero_1',
    titleAr: '🤝 روح التعاون',
    titleEn: '🤝 Spirit of Cooperation',
    descriptionAr: 'شارِك في 3 مهمات جماعية في بوابة التعاون مع أصدقائك.',
    descriptionEn: 'Participate in 3 co-op missions with your friends.',
    icon: '✨',
    unlocked: false,
    xpReward: 400
  },
  {
    id: 'future_pioneer_1',
    titleAr: '🚀 رائد المستقبل',
    titleEn: '🚀 Future Pioneer',
    descriptionAr: 'افتح بوابة المستقبل ونفّذ أول محاكاة "ماذا لو؟" مع الذكاء الاصطناعي.',
    descriptionEn: 'Unlock the Future Gate and complete a "What If?" simulation.',
    icon: '🔮',
    unlocked: true,
    xpReward: 600
  },
  {
    id: 'parallel_master_1',
    titleAr: '🌌 سيد العالم الموازي',
    titleEn: '🌌 Master of Parallel World',
    descriptionAr: 'وصل إلى المستوى 10 وخصص هويتك الموازية بالكامل بأحدث الأغطية والهالات.',
    descriptionEn: 'Reach Level 10 and fully customize your Parallel Identity.',
    icon: '👑',
    unlocked: false,
    xpReward: 1000
  }
];

export const INITIAL_GLOBAL_EVENT: GlobalEvent = {
  id: 'sentra_discovery',
  titleAr: '🪐 اكتشاف كوكب "سينترا الكوانتمي" الجديد',
  titleEn: '🪐 Discovery of New Planet "Quantum Sentra"',
  descriptionAr: 'عندما يتكاتف 10,000 مستكشف في لودافيا ويجمعون طاقة الكوانتم، سيتم فتح الكوكب للجميع بصفة دائمية!',
  descriptionEn: 'When 10,000 Lodavia explorers combine quantum energy, Sentra Planet will unlock globally!',
  icon: '🌠',
  progress: 7420,
  target: 10000,
  participantsCount: 3840,
  badgeAr: 'حدث عالمي مباشر',
  badgeEn: 'Live Global Event',
  rewardXp: 250
};

export const SAMPLE_EXPLORERS: ExplorerUser[] = [
  { id: 'exp_1', name: 'سارة الكونية', avatar: '✨', title: 'مستكشفة السديم', level: 14, status: 'تستكشف كوكب الأفكار', planetId: 'ideas' },
  { id: 'exp_2', name: 'عمر المبتكر', avatar: '🚀', title: 'مهندس الكوانتم', level: 12, status: 'يختبر محاكاة المستقبل', planetId: 'future_gate' },
  { id: 'exp_3', name: 'ليان الفنانة', avatar: '🎨', title: 'صانعة الأصول', level: 15, status: 'تعرض لوحتها البصرية', planetId: 'creator' },
  { id: 'exp_4', name: 'فهد الألعاب', avatar: '🎮', title: 'بطل الأركيد', level: 18, status: 'يتصدر لائحة الألعاب', planetId: 'games' },
  { id: 'exp_5', name: 'نورا الدعم', avatar: '💎', title: 'سفيرة المجتمع', level: 11, status: 'في صالون التعاون الصوتي', planetId: 'community' }
];

export const CUSTOMIZATION_OPTIONS = {
  outfits: [
    { id: 'quantum_armor', nameAr: 'درع النيون الكوانتمي 🛡️', nameEn: 'Quantum Neon Armor 🛡️' },
    { id: 'nebula_robe', nameAr: 'عباءة السديم الأرجوانية 🌌', nameEn: 'Purple Nebula Robe 🌌' },
    { id: 'voyager_suit', nameAr: 'بدلة المسافر الكوني 🚀', nameEn: 'Cosmic Voyager Suit 🚀' },
    { id: 'aurora_tunic', nameAr: 'قميص الأورورا الذهبي ✨', nameEn: 'Golden Aurora Tunic ✨' }
  ],
  auras: [
    { id: 'cyan_glow', nameAr: 'توهج السيان السماوي 🩵', nameEn: 'Celestial Cyan Glow 🩵', color: '#06b6d4' },
    { id: 'purple_nebula', nameAr: 'سديم البلازما البنفسجي 💜', nameEn: 'Purple Plasma Nebula 💜', color: '#a855f7' },
    { id: 'golden_sun', nameAr: 'هالة الشمس النفاثة ☀️', nameEn: 'Jet Sun Halo ☀️', color: '#f59e0b' },
    { id: 'emerald_spark', nameAr: 'شرارة الزمرد الشافية 💚', nameEn: 'Healing Emerald Spark 💚', color: '#10b981' }
  ],
  vehicles: [
    { id: 'light_speeder', nameAr: 'مركبة الضوء السريعة 🏎️', nameEn: 'Light Speeder 🏎️' },
    { id: 'nebula_phantom', nameAr: 'شبح السديم الكوني 🛸', nameEn: 'Nebula Phantom 🛸' },
    { id: 'hyperion_ship', nameAr: 'سفينة الهيبيريون 🚀', nameEn: 'Hyperion Flagship 🚀' },
    { id: 'quantum_hover', nameAr: 'لوح الحوامة الكوانتمي 🛹', nameEn: 'Quantum Hoverboard 🛹' }
  ],
  accessories: [
    { id: 'galaxy_crown', nameAr: 'تاج المجرات الذهبي 👑', nameEn: 'Golden Galaxy Crown 👑' },
    { id: 'quantum_visor', nameAr: 'نظارات الكوانتم المستقبلية 🕶️', nameEn: 'Future Quantum Visor 🕶️' },
    { id: 'halo_ring', nameAr: 'حلقة الطاقة العلوية ⭕', nameEn: 'Upper Energy Halo ⭕' },
    { id: 'cosmic_wings', nameAr: 'أجنحة الضوء الطيفية 🪽', nameEn: 'Spectral Light Wings 🪽' }
  ]
};

export const INITIAL_PERSONAL_BUILDINGS: PersonalBuilding[] = [
  {
    id: 'b1',
    type: 'idea_seed',
    titleAr: 'شجرة بذور الأفكار الذكية',
    titleEn: 'Smart Idea Seed Tree',
    descriptionAr: 'تنمو بفضل أفكارك واقتراحاتك المنشورة على لودافيا.',
    descriptionEn: 'Grows with ideas & insights published across Lodavia.',
    level: 3,
    icon: '🌱',
    createdDate: '2026-06-15'
  },
  {
    id: 'b2',
    type: 'project_tower',
    titleAr: 'برج المشاريع الرقمية',
    titleEn: 'Digital Venture Tower',
    descriptionAr: 'يرتفع كلما قمت بإضافة مشروع أو منتج في سوق لودافيا.',
    descriptionEn: 'Rises whenever you list or create a venture in Marketplace.',
    level: 2,
    icon: '🏢',
    createdDate: '2026-07-01'
  },
  {
    id: 'b3',
    type: 'knowledge_spire',
    titleAr: 'مسلة المعرفة والتعلم',
    titleEn: 'Wisdom & Learning Spire',
    descriptionAr: 'تتوهج باللون الأزرق مع كل حقيقة علمية أو دورة تدرسها.',
    descriptionEn: 'Glows blue with every course enrolled or fact mastered.',
    level: 4,
    icon: '🔮',
    createdDate: '2026-05-20'
  },
  {
    id: 'b4',
    type: 'helping_star',
    titleAr: 'نجمة التعاون والعطاء',
    titleEn: 'Star of Helpfulness',
    descriptionAr: 'نجمة مضيئة ظهرت في سمائك لمساعدتك للمستخدمين الجدد.',
    descriptionEn: 'Shining star in your sky for helping new members in Voice Rooms.',
    level: 5,
    icon: '⭐',
    createdDate: '2026-07-10'
  }
];
