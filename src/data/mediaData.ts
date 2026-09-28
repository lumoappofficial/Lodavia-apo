export interface MediaComment {
  id?: string;
  author: string;
  text: string;
  time: string;
  parentCommentId?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  titleAr: string;
  creatorId?: string;
  creator: {
    name: string;
    avatar: string;
    badge?: string;
  };
  thumbnail: string;
  videoUrl?: string;
  type: 'reel' | 'video' | 'live';
  views: number;
  likes: number;
  liked?: boolean;
  comments: MediaComment[];
  duration?: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
}

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  // REELS
  {
    id: 'reel-1',
    title: 'Cinematic Hyperdrive through the Orion Nebula 🌌',
    titleAr: 'رحلة سينمائية فائقة السرعة عبر سديم الجبار 🌌',
    creator: {
      name: 'AstroVisuals',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Creator Elite'
    },
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 45200,
    likes: 12400,
    comments: [
      { author: 'Lara', text: 'This looks so magical! ✨', time: '1h ago' },
      { author: 'CosmoCoder', text: 'The rendering engine is incredible.', time: '30m ago' }
    ],
    category: 'Astrophotography',
    categoryAr: 'التصوير الفلكي',
    description: 'A breathtaking 60fps CGI simulation navigating the dense gases and newborn stars of the stellar nursery.',
    descriptionAr: 'محاكاة ثلاثية الأبعاد مذهلة بمعدل 60 إطاراً في الثانية تتنقل عبر الغازات الكثيفة والنجوم الوليدة في الحضانة النجمية.'
  },
  {
    id: 'reel-2',
    title: 'Red Giant Star swallowing an Exoplanet simulation ☄️',
    titleAr: 'محاكاة نجم عملاق أحمر يبتلع كوكباً خارجياً ☄️',
    creator: {
      name: 'SpaceChronicles',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 28100,
    likes: 9150,
    comments: [
      { author: 'Samer', text: 'Terrifying and beautiful at the same time.', time: '2h ago' }
    ],
    category: 'Cosmology',
    categoryAr: 'علم الكونيات',
    description: 'An educational breakdown of the fate of solar systems when their stars expand into their final evolutionary stages.',
    descriptionAr: 'تحليل تعليمي لمصير الأنظمة الشمسية عندما تتسع نجومها لتدخل في مراحلها التطورية النهائية.'
  },
  {
    id: 'reel-3',
    title: 'Redefining Gravity: Inside a Spinning Colony 🛸',
    titleAr: 'إعادة تعريف الجاذبية: داخل مستعمرة فضائية دوارة 🛸',
    creator: {
      name: 'ColonyArch',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      badge: 'Architect Node'
    },
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    type: 'reel',
    views: 89000,
    likes: 31200,
    comments: [],
    category: 'Future Tech',
    categoryAr: 'تكنولوجيا المستقبل',
    description: 'Holographic fly-through of an O\'Neill Cylinder showcasing artificial ecosystems and centrifugal gravity wheels.',
    descriptionAr: 'رحلة هولوغرافية داخل أسطوانة أونيل تستعرض الأنظمة البيئية الاصطناعية وعجلات الجاذبية الطاردة المركزية.'
  },
  // LONG VIDEOS
  {
    id: 'video-1',
    title: 'The James Webb Deep Field Analysis: Deciphering the First Light',
    titleAr: 'تحليل الحقل العميق لتلسكوب جيمس ويب: فك رموز الضوء الأول',
    creator: {
      name: 'Dr. Evelyn Carter',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      badge: 'Astrophysicist Pro'
    },
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    views: 120500,
    likes: 45000,
    duration: '14:22',
    comments: [
      { author: 'Amine', text: 'This lecture is worth a university credit!', time: '1d ago' },
      { author: 'Farah', text: 'The clarity of explanation is astonishing.', time: '12h ago' }
    ],
    category: 'Astrophysics',
    categoryAr: 'الفيزياء الفلكية',
    description: 'In this comprehensive analysis, we zoom into deep galaxy clusters dating back 13.5 billion years, explaining gravitational lensing and early stellar chemistry.',
    descriptionAr: 'في هذا التحليل الشامل، نقوم بالتكبير داخل العناقيد المجرية العميقة التي تعود إلى 13.5 مليار سنة، ونشرح عدسات الجاذبية والكيمياء النجمية المبكرة.'
  },
  {
    id: 'video-2',
    title: 'Building Lodavia Station: The Future of Orbital Cloud Nodes',
    titleAr: 'بناء محطة لودافيا: مستقبل عقد السحابة المدارية',
    creator: {
      name: 'Lodavia Aerospace',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      badge: 'Official Team'
    },
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    views: 67300,
    likes: 21000,
    duration: '08:45',
    comments: [],
    category: 'Aerospace Engineering',
    categoryAr: 'هندسة الفضاء',
    description: 'A structural overview of the modular satellite structures hosting decentralized quantum computing nodes in Low Earth Orbit.',
    descriptionAr: 'نظرة عامة هيكلية على هياكل الأقمار الصناعية المعيارية التي تستضيف عقد الحوسبة الكمومية اللامركزية في المدار الأرضي المنخفض.'
  },
  // LIVE STREAMS
  {
    id: 'live-1',
    title: '🔴 LIVE: Interactive Lunar Base Telemetry & QA with AI',
    titleAr: '🔴 مباشر: تتبع قاعدة القمر والأسئلة والأجوبة مع الذكاء الاصطناعي',
    creator: {
      name: 'MoonMissionAlpha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badge: 'Live Node'
    },
    thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
    type: 'live',
    views: 4500, // Live viewers
    likes: 8300,
    comments: [
      { author: 'System_Beacon', text: 'Quantum signal strength is 98%', time: 'Just now' },
      { author: 'Tareq', text: 'Is the lunar core stable?', time: '2m ago' }
    ],
    category: 'Live Operations',
    categoryAr: 'العمليات الحية',
    description: 'Live telemetry reporting from the Shackleton Crater base simulator. Ask our AI astrophysicist anything in real time.',
    descriptionAr: 'بث حي لبيانات تتبع المحاكاة من قاعدة فوهة شاكلتون. اسأل عالم الفيزياء الفلكية المدعم بالذكاء الاصطناعي أي شيء في الوقت الفعلي.'
  }
];
