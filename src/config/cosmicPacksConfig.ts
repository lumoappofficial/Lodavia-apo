import { CosmeticItem, CosmicPack, Rarity, PackCategory } from '../types/cosmicPacks';

// 1. Rarity Visuals & Descriptions
export const RARITY_CONFIG: Record<Rarity, {
  nameAr: string;
  nameEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  glowColor: string;
  gradient: string;
}> = {
  COMMON: {
    nameAr: 'شائع ⚪',
    nameEn: 'Common ⚪',
    color: 'text-slate-300',
    bgColor: 'bg-slate-900/40',
    borderColor: 'border-slate-700/50',
    badgeBg: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    glowColor: 'rgba(148, 163, 184, 0.2)',
    gradient: 'from-slate-800 to-slate-950'
  },
  UNCOMMON: {
    nameAr: 'غير شائع 🟢',
    nameEn: 'Uncommon 🟢',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/30',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    gradient: 'from-emerald-900/40 to-slate-950'
  },
  RARE: {
    nameAr: 'نادر 🔷',
    nameEn: 'Rare 🔷',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30',
    borderColor: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    gradient: 'from-cyan-900/40 via-blue-950 to-slate-950'
  },
  EPIC: {
    nameAr: 'ملحمي 💜',
    nameEn: 'Epic 💜',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/30',
    borderColor: 'border-purple-500/50',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    gradient: 'from-purple-900/40 via-fuchsia-950 to-slate-950'
  },
  LEGENDARY: {
    nameAr: 'أسطوري 👑⭐',
    nameEn: 'Legendary 👑⭐',
    color: 'text-amber-300',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/60',
    badgeBg: 'bg-gradient-to-r from-amber-500/30 to-purple-600/30 text-amber-300 border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    gradient: 'from-amber-950/60 via-purple-950/50 to-slate-950'
  }
};

// 2. Duplicate Policy Configuration (Centralized)
export const DUPLICATE_SHARDS: Record<Rarity, number> = {
  COMMON: 20,
  UNCOMMON: 50,
  RARE: 100,
  EPIC: 300,
  LEGENDARY: 1000
};

// 3. Server Probabilities Matrix Default
export const SERVER_PROBABILITIES: Record<Rarity, number> = {
  COMMON: 0.60,      // 60%
  UNCOMMON: 0.25,    // 25%
  RARE: 0.10,        // 10%
  EPIC: 0.04,        // 4%
  LEGENDARY: 0.01    // 1%
};

// 4. Cosmetic Items Catalog
export const COSMETIC_ITEMS_CATALOG: CosmeticItem[] = [
  // --- STARTER PACK ITEMS ---
  {
    id: 'frame_starter_neon',
    nameAr: 'إطار النيون الابتدائي 💫',
    nameEn: 'Starter Neon Frame 💫',
    descriptionAr: 'إطار متوهج بخطوط نيون متناسقة يزين صورتك الشخصية.',
    descriptionEn: 'A balanced glowing neon frame to enhance your avatar.',
    type: 'AVATAR_FRAME',
    rarity: 'COMMON',
    icon: '💫',
    previewCss: 'border-2 border-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    packId: 'pack_starter',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'bg_starter_void',
    nameAr: 'خلفية الفراغ الأزرق 🌌',
    nameEn: 'Blue Void Background 🌌',
    descriptionAr: 'خلفية داكنة بدرجات الأزرق الفلكي لملفك الشخصي.',
    descriptionEn: 'Deep blue space background for your personal profile.',
    type: 'PROFILE_BACKGROUND',
    rarity: 'COMMON',
    icon: '🌌',
    previewCss: 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950',
    packId: 'pack_starter',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'badge_starter_cadet',
    nameAr: 'وسام المستكشف المستجد 🔰',
    nameEn: 'Star Cadet Badge 🔰',
    descriptionAr: 'وسام البداية الكونية لجميع المنضمين لشبكة لودافيا.',
    descriptionEn: 'A starter badge awarded to new Lodavia space cadets.',
    type: 'BADGE',
    rarity: 'COMMON',
    icon: '🔰',
    packId: 'pack_starter',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'name_starter_cyan',
    nameAr: 'اسم التردد النيون 🩵',
    nameEn: 'Cyan Pulse Name 🩵',
    descriptionAr: 'تأثير اسم بدرجة الأزرق السماوي المشع.',
    descriptionEn: 'Bright cyan pulse effect for your display name.',
    type: 'NAME_EFFECT',
    rarity: 'COMMON',
    icon: '🩵',
    previewCss: 'bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-300 bg-clip-text text-transparent font-bold',
    packId: 'pack_starter',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- COSMIC PACK ITEMS ---
  {
    id: 'frame_galaxy_vortex',
    nameAr: 'إطار دوامة المجرة ✨',
    nameEn: 'Galaxy Vortex Frame ✨',
    descriptionAr: 'دوامة مجرية ثلاثية الأبعاد تدور بنعومة حول صورتك.',
    descriptionEn: 'An animated galactic vortex spinning softly around your picture.',
    type: 'AVATAR_FRAME',
    rarity: 'RARE',
    icon: '✨',
    previewCss: 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.7)] animate-pulse',
    packId: 'pack_cosmic',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'bg_cosmic_nebula',
    nameAr: 'خلفية سديم الشفق 🔮',
    nameEn: 'Aurora Nebula Wallpaper 🔮',
    descriptionAr: 'خلفية سديم وردي وبنفسجي مفعمة بالأناقة الفضائية.',
    descriptionEn: 'Vibrant pink and violet nebula background with celestial clouds.',
    type: 'PROFILE_BACKGROUND',
    rarity: 'RARE',
    icon: '🔮',
    previewCss: 'bg-gradient-to-r from-purple-900 via-fuchsia-950 to-slate-950',
    packId: 'pack_cosmic',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'name_supernova_flame',
    nameAr: 'اسم توهج السوبرنوفا 🔥',
    nameEn: 'Supernova Fire Name 🔥',
    descriptionAr: 'تدرج ناري مذهل يتدفق عبر حروف اسمك في جميع الغرف والصفحات.',
    descriptionEn: 'A blazing fiery supernova gradient for your display name.',
    type: 'NAME_EFFECT',
    rarity: 'RARE',
    icon: '🔥',
    previewCss: 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent font-black',
    packId: 'pack_cosmic',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'title_cosmic_architect',
    nameAr: 'لقب "مهندس الأبعاد" 📐',
    nameEn: 'Dimensional Architect 📐',
    descriptionAr: 'لقب كوني مرموق يظهر تحت اسمك في الملف الشخصي.',
    descriptionEn: 'A prestigious cosmic title badge shown below your username.',
    type: 'TITLE',
    rarity: 'UNCOMMON',
    icon: '📐',
    packId: 'pack_cosmic',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'effect_starlight_dust',
    nameAr: 'تأثير غبار النجوم 💫',
    nameEn: 'Starlight Dust Aura 💫',
    descriptionAr: 'هالة من غبار النجوم المتساقط حول بروفايلك.',
    descriptionEn: 'Sparkling cosmic dust particles radiating over your profile card.',
    type: 'PROFILE_EFFECT',
    rarity: 'RARE',
    icon: '💫',
    previewCss: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]',
    packId: 'pack_cosmic',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- EXPLORER PACK ITEMS ---
  {
    id: 'frame_orbit_ring',
    nameAr: 'إطار المدار الفلكي 🪐',
    nameEn: 'Planetary Orbit Frame 🪐',
    descriptionAr: 'حلقة كوكبية شبيهة بحلقات زحل تدور حول رمزيتك.',
    descriptionEn: 'Saturn-like planetary ring circling your profile avatar.',
    type: 'AVATAR_FRAME',
    rarity: 'UNCOMMON',
    icon: '🪐',
    previewCss: 'border-2 border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    packId: 'pack_explorer',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'bg_mars_surface',
    nameAr: 'خلفية سطح المريخ الأحمري ☄️',
    nameEn: 'Red Martian Plains ☄️',
    descriptionAr: 'مشهد صحراوي كوني أحمر من سطح كوكب المريخ.',
    descriptionEn: 'Deep crimson Martian landscapes under atmospheric light.',
    type: 'PROFILE_BACKGROUND',
    rarity: 'UNCOMMON',
    icon: '☄️',
    previewCss: 'bg-gradient-to-r from-red-950 via-orange-950 to-slate-950',
    packId: 'pack_explorer',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'badge_astronomer',
    nameAr: 'وسام رائد الاستكشاف 🚀',
    nameEn: 'Deep Space Pioneer 🚀',
    descriptionAr: 'وسام يمنح لمستكشفي الفضاء ومتابعي الأحداث الكونية.',
    descriptionEn: 'Awarded to dedicated explorers of deep space datasets.',
    type: 'BADGE',
    rarity: 'UNCOMMON',
    icon: '🚀',
    packId: 'pack_explorer',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- LEGENDARY PACK ITEMS ---
  {
    id: 'frame_legendary_crown',
    nameAr: 'إطار العرش الكوني الأسطوري 👑⭐',
    nameEn: 'Imperial Crown Frame 👑⭐',
    descriptionAr: 'إطار ملكي مزخرف بذهب النجوم مع توهج ملكي يحيط بالصورة.',
    descriptionEn: 'An exalted golden crown frame with shimmering starlight particles.',
    type: 'AVATAR_FRAME',
    rarity: 'LEGENDARY',
    icon: '👑',
    previewCss: 'border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.9)] animate-pulse',
    packId: 'pack_legendary',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'bg_legendary_singularity',
    nameAr: 'خلفية المتفرد الكوني الأسطورية 💥🌌',
    nameEn: 'Cosmic Singularity Wallpaper 💥🌌',
    descriptionAr: 'خلفية ملكية ساحرة تجذب الأنظار بانبعاثات الطاقة الشديدة.',
    descriptionEn: 'An ultra-rare background depicting a cosmic singularity creation event.',
    type: 'PROFILE_BACKGROUND',
    rarity: 'LEGENDARY',
    icon: '💥',
    previewCss: 'bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/40',
    packId: 'pack_legendary',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'name_legendary_gold',
    nameAr: 'اسم الشفق الذهبي الأسطوري 🌟💎',
    nameEn: 'Golden Aurora Name 🌟💎',
    descriptionAr: 'اسم يتحرك بتموجات الذهبي المشع والبنفسجي الأسطوري.',
    descriptionEn: 'Animated shimmering golden waves with imperial violet tones.',
    type: 'NAME_EFFECT',
    rarity: 'LEGENDARY',
    icon: '🌟',
    previewCss: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-400 bg-clip-text text-transparent font-black tracking-wide',
    packId: 'pack_legendary',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'title_galactic_emperor',
    nameAr: 'لقب "سفير المجرة الأسمى" 👑🪐',
    nameEn: 'Galactic High Sovereign 👑🪐',
    descriptionAr: 'أرفع الألقاب الكونية في شبكة لودافيا على الإطلاق.',
    descriptionEn: 'The highest sovereign rank title in the entire Lodavia platform.',
    type: 'TITLE',
    rarity: 'LEGENDARY',
    icon: '👑',
    packId: 'pack_legendary',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- AI PACK ITEMS (Mascot Skins & Accessories) ---
  {
    id: 'skin_starlight',
    nameAr: 'مظهر الذكاء "سديم النجوم" 💫',
    nameEn: 'AI Skin "Starlight Nebula" 💫',
    descriptionAr: 'يغير مظهر المساعد الذكي Lumo/Nova إلى ثيم النجوم البنفسجي الساحر.',
    descriptionEn: 'Changes AI Assistant Lumo/Nova appearance to Starlight violet skin.',
    type: 'CHARACTER_SKIN',
    rarity: 'RARE',
    icon: '💫',
    mascotSkin: 'starlight',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'skin_cyber',
    nameAr: 'مظهر الذكاء "السايبر المستقبلي" 🟩',
    nameEn: 'AI Skin "Cyber Matrix" 🟩',
    descriptionAr: 'يغلف المساعد الكوني بدرع نيون سايبراني زمرّدي متطور.',
    descriptionEn: 'Coats the AI Assistant in emerald matrix grid energy.',
    type: 'CHARACTER_SKIN',
    rarity: 'RARE',
    icon: '🟩',
    mascotSkin: 'cyber',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'skin_royal',
    nameAr: 'مظهر الذكاء "الملكي الذهبي" 👑',
    nameEn: 'AI Skin "Royal Sovereign" 👑',
    descriptionAr: 'مظهر ذهبي فاخر للمساعد الذكي بطابع الأمراء الكونيين.',
    descriptionEn: 'Empowers AI Companion with a opulent royal gold finish.',
    type: 'CHARACTER_SKIN',
    rarity: 'EPIC',
    icon: '👑',
    mascotSkin: 'royal',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'skin_galaxy',
    nameAr: 'مظهر الذكاء "المجرة العميقة" 🌌',
    nameEn: 'AI Skin "Deep Galaxy" 🌌',
    descriptionAr: 'ثيم الثقب الأسود والمجرة السحيقة للمساعد الكوني.',
    descriptionEn: 'Transforms AI Assistant with deep space cosmic void aesthetics.',
    type: 'CHARACTER_SKIN',
    rarity: 'EPIC',
    icon: '🌌',
    mascotSkin: 'galaxy',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'acc_headset_neon',
    nameAr: 'سماعات النيون الفضائية 🎧',
    nameEn: 'Cosmic Holographic Headset 🎧',
    descriptionAr: 'سماعة نيون عالية الدقة للمساعد الذكي في الواجهة.',
    descriptionEn: 'Adds a sleek holographic headset to the AI assistant mascot.',
    type: 'CHARACTER_ACCESSORY',
    rarity: 'UNCOMMON',
    icon: '🎧',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'badge_ai_core',
    nameAr: 'وسام العقل الاصطناعي 🤖',
    nameEn: 'AI Neural Core Badge 🤖',
    descriptionAr: 'وسام يبرز اهتمامك وشراكتك مع قدرات الذكاء الفائق.',
    descriptionEn: 'Badge marking your synergy with Lodavia Neural AI engine.',
    type: 'BADGE',
    rarity: 'UNCOMMON',
    icon: '🤖',
    packId: 'pack_ai',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- CREATOR PACK ITEMS ---
  {
    id: 'badge_creator_verified',
    nameAr: 'وسام صانع المحتوى المعتمد 🎨💎',
    nameEn: 'Verified Creator Badge 🎨💎',
    descriptionAr: 'شارة توثيق رسمية بجانب اسمك كصانع محتوى في الشبكة.',
    descriptionEn: 'Official creator verification checkmark next to your display name.',
    type: 'CREATOR_BADGE',
    rarity: 'EPIC',
    icon: '💎',
    packId: 'pack_creator',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'frame_creator_prism',
    nameAr: 'إطار المنشور الإبداعي 🌈',
    nameEn: 'Creative Prism Frame 🌈',
    descriptionAr: 'إطار بلوري متعدد الألوان يتلألأ حول صورة الصانع.',
    descriptionEn: 'A rainbow prismatic crystal frame framing your profile.',
    type: 'AVATAR_FRAME',
    rarity: 'EPIC',
    icon: '🌈',
    previewCss: 'border-2 border-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.7)]',
    packId: 'pack_creator',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'title_master_creator',
    nameAr: 'لقب "سفير الابتكار" 🚀🎨',
    nameEn: 'Ambassador of Innovation 🚀🎨',
    descriptionAr: 'لقب خاص للمبدعين وصناع المحتوى والمدربين.',
    descriptionEn: 'Special title badge reserved for top content creators.',
    type: 'TITLE',
    rarity: 'RARE',
    icon: '🚀',
    packId: 'pack_creator',
    createdAt: '2026-08-01',
    isActive: true
  },

  // --- SEASONAL PACK ITEMS (Cosmic Week Event) ---
  {
    id: 'frame_summer_solstice',
    nameAr: 'إطار التوهج الشمسي الصيفي ☀️🔥',
    nameEn: 'Summer Solar Solstice Frame ☀️🔥',
    descriptionAr: 'إطار ناري شمسي محدود الإصدار لحدث الصيف الكوني.',
    descriptionEn: 'Limited time solar flare frame for the Cosmic Summer Event.',
    type: 'AVATAR_FRAME',
    rarity: 'EPIC',
    seasonId: 'season_summer_2026',
    icon: '☀️',
    previewCss: 'border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]',
    packId: 'pack_seasonal',
    createdAt: '2026-08-01',
    isActive: true
  },
  {
    id: 'bg_cosmic_week_event',
    nameAr: 'خلفية أسبوع لودافيا الكوني 🌌🚀',
    nameEn: 'Lodavia Cosmic Week Arena 🌌🚀',
    descriptionAr: 'خلفية حصرية من فعاليات أسبوع الاستكشاف الفضائي.',
    descriptionEn: 'Event-exclusive wallpaper commemorating Cosmic Week.',
    type: 'PROFILE_BACKGROUND',
    rarity: 'EPIC',
    seasonId: 'season_summer_2026',
    icon: '🌌',
    previewCss: 'bg-gradient-to-r from-amber-950 via-cyan-950 to-purple-950 border border-cyan-500/30',
    packId: 'pack_seasonal',
    createdAt: '2026-08-01',
    isActive: true
  }
];

// 5. Cosmic Packs Catalog Definition
export const COSMIC_PACKS_CATALOG: CosmicPack[] = [
  {
    id: 'pack_starter',
    nameAr: 'حزمة البداية الكونية 🎁',
    nameEn: 'Starter Cosmic Pack 🎁',
    descriptionAr: 'مثالية للمستخدمين الجدد! تحتوي على إطارات وأوسمة أساسية لبدء رحلتك.',
    descriptionEn: 'Perfect for new explorers! Unlocks foundational avatar frames & badges.',
    category: 'starter',
    icon: '🎁',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    price: 300,
    currency: 'points',
    rarityRangeAr: 'شائع إلى غير شائع',
    rarityRangeEn: 'Common to Uncommon',
    possibleRewardIds: ['frame_starter_neon', 'bg_starter_void', 'badge_starter_cadet', 'name_starter_cyan'],
    availability: 'always',
    isFreeDailyEligible: true
  },
  {
    id: 'pack_cosmic',
    nameAr: 'حزمة المجرة والشفوق 🌌',
    nameEn: 'Cosmic Nebula Pack 🌌',
    descriptionAr: 'إطارات دوامة وتأثيرات أسماء متوهجة بألوان الشفق السماوي.',
    descriptionEn: 'Vortex frames, aurora titles, and shimmering gradient name effects.',
    category: 'cosmic',
    icon: '🌌',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    price: 800,
    currency: 'points',
    rarityRangeAr: 'غير شائع إلى نادر',
    rarityRangeEn: 'Uncommon to Rare',
    possibleRewardIds: ['frame_galaxy_vortex', 'bg_cosmic_nebula', 'name_supernova_flame', 'title_cosmic_architect', 'effect_starlight_dust'],
    availability: 'always',
    marketingBadge: 'best_seller'
  },
  {
    id: 'pack_explorer',
    nameAr: 'حزمة رواد الفضاء 🚀',
    nameEn: 'Explorer Pioneer Pack 🚀',
    descriptionAr: 'مستوحاة من رحلات الاستكشاف الفضائي وسطح كوكب المريخ والمدارات.',
    descriptionEn: 'Inspired by space exploration missions, Martian plains, and orbital rings.',
    category: 'explorer',
    icon: '🚀',
    bannerImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
    price: 1000,
    currency: 'points',
    rarityRangeAr: 'غير شائع إلى نادر',
    rarityRangeEn: 'Uncommon to Rare',
    possibleRewardIds: ['frame_orbit_ring', 'bg_mars_surface', 'badge_astronomer', 'name_starter_cyan'],
    availability: 'always'
  },
  {
    id: 'pack_ai',
    nameAr: 'حزمة الذكاء الاصطناعي 🤖',
    nameEn: 'AI Companion Pack 🤖',
    descriptionAr: 'مظاهر نادرة جداً للمساعد الذكي Lumo/Nova وسماعات النيون وأوسمة النواة.',
    descriptionEn: 'Exclusive skins for AI Assistant Lumo/Nova, holographic headsets & neural badges.',
    category: 'ai',
    icon: '🤖',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    price: 1200,
    currency: 'points',
    rarityRangeAr: 'نادر إلى ملحمي',
    rarityRangeEn: 'Rare to Epic',
    possibleRewardIds: ['skin_starlight', 'skin_cyber', 'skin_royal', 'skin_galaxy', 'acc_headset_neon', 'badge_ai_core'],
    availability: 'always',
    marketingBadge: 'new'
  },
  {
    id: 'pack_creator',
    nameAr: 'حزمة صناع المحتوى 🎨',
    nameEn: 'Creator Identity Pack 🎨',
    descriptionAr: 'مصممة خصيصاً للمبدعين! شارات التوثيق، إطارات المنشور، وألقاب سفراء الابتكار.',
    descriptionEn: 'Crafted for creators! Verification checkmarks, prism frames, and master titles.',
    category: 'creator',
    icon: '🎨',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    price: 1500,
    currency: 'points',
    rarityRangeAr: 'نادر إلى ملحمي',
    rarityRangeEn: 'Rare to Epic',
    possibleRewardIds: ['badge_creator_verified', 'frame_creator_prism', 'title_master_creator'],
    availability: 'always'
  },
  {
    id: 'pack_legendary',
    nameAr: 'حزمة العرش الأسطوري 👑',
    nameEn: 'Imperial Legendary Pack 👑',
    descriptionAr: 'تحتوي على أندر العناصر في لودافيا! إطارات الذهب، ألقاب السفير الأعلى، والأسماء البرّاقة.',
    descriptionEn: 'Contains the rarest items on Lodavia! Sovereign crowns, supreme titles, and imperial names.',
    category: 'legendary',
    icon: '👑',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    price: 2500,
    currency: 'points',
    rarityRangeAr: 'ملحمي إلى أسطوري',
    rarityRangeEn: 'Epic to Legendary',
    possibleRewardIds: ['frame_legendary_crown', 'bg_legendary_singularity', 'name_legendary_gold', 'title_galactic_emperor', 'skin_royal'],
    availability: 'always',
    marketingBadge: 'best_seller'
  },
  {
    id: 'pack_seasonal',
    nameAr: 'حزمة أسبوع لودافيا الكوني (موسمية) 🔥',
    nameEn: 'Cosmic Week Seasonal Pack 🔥',
    descriptionAr: 'حزمة حصرية محدودة الوقت لحدث الصيف الكوني! احصل على عناصر لن تتكرر.',
    descriptionEn: 'Limited time seasonal pack for Cosmic Week Event! Exclusive time-limited items.',
    category: 'seasonal',
    icon: '🔥',
    bannerImage: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=600&q=80',
    price: 350,
    currency: 'shards',
    rarityRangeAr: 'ملحمي حائل',
    rarityRangeEn: 'Epic Event Exclusive',
    possibleRewardIds: ['frame_summer_solstice', 'bg_cosmic_week_event'],
    availability: 'seasonal',
    marketingBadge: 'limited_time'
  }
];
