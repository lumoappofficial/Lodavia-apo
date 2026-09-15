export type StoreCategory = 'badge' | 'avatar_frame' | 'name_color' | 'title' | 'chat_theme' | 'feature';

export interface StoreCategoryInfo {
  id: StoreCategory;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface StoreItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  icon: string;
  category: StoreCategory;
}

export const STORE_CATEGORIES: StoreCategoryInfo[] = [
  { id: 'badge', nameAr: 'أوسمة ونياشين', nameEn: 'Badges & Medals', icon: '👑' },
  { id: 'avatar_frame', nameAr: 'إطارات الصور', nameEn: 'Avatar Frames', icon: '✨' },
  { id: 'name_color', nameAr: 'تأثيرات الأسماء', nameEn: 'Name Effects', icon: '🌟' },
  { id: 'title', nameAr: 'ألقاب كوكبية', nameEn: 'Cosmic Titles', icon: '🪐' },
  { id: 'chat_theme', nameAr: 'أشكال المحادثة', nameEn: 'Chat Themes', icon: '🎨' },
  { id: 'feature', nameAr: 'ميزات ووصول', nameEn: 'Features & Access', icon: '🔑' },
];

export const STORE_ITEMS: StoreItem[] = [
  // أوسمة ونياشين
  {
    id: 'badge_crown',
    nameAr: 'وسام التاج الملكي 👑',
    nameEn: 'Royal Crown Badge 👑',
    descriptionAr: 'يعرض تاجاً ملكياً براقاً بجانب اسمك في غرف الدردشة والتعليقات والملف الشخصي.',
    descriptionEn: 'Displays a golden royal crown next to your name in rooms, chats, and profile.',
    price: 100,
    icon: '👑',
    category: 'badge'
  },
  {
    id: 'badge_star_explorer',
    nameAr: 'وسام المستكشف الكوني 🚀',
    nameEn: 'Cosmic Explorer Badge 🚀',
    descriptionAr: 'وسام خاص يثبت ريادتك في استكشاف أرجاء مجرات لودافيا الكونية.',
    descriptionEn: 'A badge proving your leadership in exploring the Lodavia galaxy.',
    price: 120,
    icon: '🚀',
    category: 'badge'
  },
  {
    id: 'badge_phoenix',
    nameAr: 'وسام العنقاء الكونية 🔥',
    nameEn: 'Cosmic Phoenix Badge 🔥',
    descriptionAr: 'رمز الأناقة والتألق الدائم بنجم ملتهب يحيط بمعلوماتك.',
    descriptionEn: 'Symbol of perpetual elegance with a burning cosmic star by your tag.',
    price: 180,
    icon: '🔥',
    category: 'badge'
  },

  // إطارات الصور
  {
    id: 'frame_neon',
    nameAr: 'إطار هالة النيون المشعة ✨',
    nameEn: 'Neon Aura Frame ✨',
    descriptionAr: 'يحيط صورتك الرمزية بإطار متوهج ثلاثي الأبعاد بألوان الطيف الترددي المتغير.',
    descriptionEn: 'Wraps your avatar in a premium colorful spinning neon holographic aura.',
    price: 150,
    icon: '✨',
    category: 'avatar_frame'
  },
  {
    id: 'frame_starlight',
    nameAr: 'إطار المدار النجمي 💫',
    nameEn: 'Starlight Orbit Frame 💫',
    descriptionAr: 'حلقة فلكية تدور حول صورتك الشخصية بوميض فضائي ساحر.',
    descriptionEn: 'An orbital ring revolving around your avatar with celestial sparkles.',
    price: 220,
    icon: '💫',
    category: 'avatar_frame'
  },
  {
    id: 'frame_black_hole',
    nameAr: 'إطار الثقب الأسود الكوني 🌀',
    nameEn: 'Black Hole Vortex Frame 🌀',
    descriptionAr: 'دوامة جذبية داكنة ذات توهج بنفسجي وأزرق تحيط ببروفايلك.',
    descriptionEn: 'A dark gravitational vortex with glowing violet aura framing your profile.',
    price: 350,
    icon: '🌀',
    category: 'avatar_frame'
  },

  // تأثيرات الأسماء
  {
    id: 'color_gold',
    nameAr: 'تأثير الاسم الذهبي المتألق 🌟',
    nameEn: 'Golden Glow Name 🌟',
    descriptionAr: 'يحوّل لون اسمك إلى تدرج لوني ذهبي متوهج مفعم بالحياة يجذب الأنظار.',
    descriptionEn: 'Converts your display name color into a gorgeous golden gradient animation.',
    price: 200,
    icon: '🌟',
    category: 'name_color'
  },
  {
    id: 'color_aurora',
    nameAr: 'تأثير اسم الشفق القطبي 🌌',
    nameEn: 'Aurora Gradient Name 🌌',
    descriptionAr: 'اسم ينبض بألوان الشفق السماوي بين الأزرق الكوني والبنفسجي البراق.',
    descriptionEn: 'Animates your name with shimmering aurora cyan and violet waves.',
    price: 250,
    icon: '🌌',
    category: 'name_color'
  },
  {
    id: 'color_supernova',
    nameAr: 'تأثير النجم المستعر "سوبرنوفا" 💥',
    nameEn: 'Supernova Flame Name 💥',
    descriptionAr: 'بريق ناري ساطع يتحرك بسلاسة عبر حروف اسمك في كل مكان.',
    descriptionEn: 'A vivid, flame-like superheated gradient running across your name.',
    price: 320,
    icon: '💥',
    category: 'name_color'
  },

  // ألقاب كوكبية
  {
    id: 'title_cosmic',
    nameAr: 'اللقب الملكي "المؤثر الكوني" 🪐',
    nameEn: 'Cosmic Influencer Title 🪐',
    descriptionAr: 'يضيف تسمية فريدة تحت اسمك لتبدو كقائد ريادي ملهم للمجتمع.',
    descriptionEn: 'Adds a prestigious title badge below your name across the platform.',
    price: 250,
    icon: '🪐',
    category: 'title'
  },
  {
    id: 'title_galaxy_lord',
    nameAr: 'لقب "سفير المجرة" 👑',
    nameEn: 'Galactic Ambassador Title 👑',
    descriptionAr: 'لقب رفيع الشأن يظهر في أعلى ملفك الشخصي وفي صالونات الصوت.',
    descriptionEn: 'Exalted ambassador rank badge shown on profile and voice stages.',
    price: 380,
    icon: '👑',
    category: 'title'
  },
  {
    id: 'title_time_traveler',
    nameAr: 'لقب "عابر الأبعاد" ⏳',
    nameEn: 'Dimension Voyager Title ⏳',
    descriptionAr: 'شعار تميز يعكس قدرتك على الابتكار وصناعة المستقبل الكوني.',
    descriptionEn: 'A distinction title reflecting dimensional mastery and innovation.',
    price: 280,
    icon: '⏳',
    category: 'title'
  },

  // أشكال المحادثة
  {
    id: 'theme_nebula_chat',
    nameAr: 'ثيم المحادثة "السديم البنفسجي" 🔮',
    nameEn: 'Violet Nebula Chat Theme 🔮',
    descriptionAr: 'يحول خلفية غرف الدردشة والرسائل الخاصة إلى سديم كوني ساحر.',
    descriptionEn: 'Transforms chat rooms and DMs with a deep violet space nebula wallpaper.',
    price: 180,
    icon: '🔮',
    category: 'chat_theme'
  },
  {
    id: 'theme_cyber_space',
    nameAr: 'ثيم "الفضاء السايبراني" 🏙️',
    nameEn: 'Cyber Grid Chat Theme 🏙️',
    descriptionAr: 'خلفية ثلاثية الأبعاد بأسلوب المستقبل الشبكي المضيء للمحادثات.',
    descriptionEn: 'A futuristic cyber grid pattern with glowing blue accents for your chats.',
    price: 220,
    icon: '🏙️',
    category: 'chat_theme'
  },
  {
    id: 'theme_solar_flare',
    nameAr: 'ثيم "التوهج الشمسي" ☀️',
    nameEn: 'Solar Flare Chat Theme ☀️',
    descriptionAr: 'أجواء دافئة ومشرقة بألوان الشمس والذهب لخلفيات الرسائل.',
    descriptionEn: 'Warm amber and gold solar radiation aesthetic for messaging panels.',
    price: 240,
    icon: '☀️',
    category: 'chat_theme'
  },

  // ميزات ووصول
  {
    id: 'feature_vip_rooms',
    nameAr: 'مفتاح الغرف الصوتية الخاصة 🔑',
    nameEn: 'Confidential Rooms Pass 🔑',
    descriptionAr: 'يمنحك الصلاحية لإنشاء والدخول لغرف صوتية مغلقة مشفرة بالكامل.',
    descriptionEn: 'Grants credentials to create & access fully confidential, secure voice rooms.',
    price: 300,
    icon: '🔑',
    category: 'feature'
  },
  {
    id: 'lodavia_pro',
    nameAr: 'اشتراك لودافيا برو الكوني 👑🚀',
    nameEn: 'Lodavia Pro Subscription 👑🚀',
    descriptionAr: 'تحليل ذكي غير محدود للتعليقات، صياغة ردود جماعية ذكية بلهجات عربية متعددة، ونبرات صوت مخصصة للعلامة التجارية.',
    descriptionEn: 'Unlimited AI comments analysis, batch neural reply-all, custom brand voice tone, and local dialects.',
    price: 500,
    icon: '🚀',
    category: 'feature'
  },
  { id: 'feature_social_links', nameAr: 'ربط حسابات التواصل الاجتماعي', nameEn: 'Social Media Links', descriptionAr: 'أضف روابط قنواتك على يوتيوب وإنستغرام وتيك توك وغيرها لتظهر بشكل بارز على ملفك الشخصي وتروّج لها لمتابعيك بلودافيا.', descriptionEn: 'Add your YouTube, Instagram, TikTok and other channel links to display prominently on your profile and cross-promote to your Lodavia followers.', price: 350, icon: '🔗', category: 'feature' },
  {
    id: 'feature_custom_emoji',
    nameAr: 'حزمة إيموجيات لودافيا الكونية 🎭',
    nameEn: 'Custom Cosmic Emoji Pack 🎭',
    descriptionAr: 'تفتح حزمة التعبيرات الكونية المخصصة للردود والتفاعل السريع.',
    descriptionEn: 'Unlocks exclusive space reaction icons and animated reactions.',
    price: 160,
    icon: '🎭',
    category: 'feature'
  },
  {
    id: 'feature_live_broadcast',
    nameAr: 'تصريح البث المباشر الكوني 📡',
    nameEn: 'Cosmic Live Broadcast Pass 📡',
    descriptionAr: 'يمكنك من إطلاق بث حي عالي الجودة إلى جميع مجتمعات لودافيا.',
    descriptionEn: 'Allows hosting ultra high-definition live broadcasts across communities.',
    price: 420,
    icon: '📡',
    category: 'feature'
  }
];
