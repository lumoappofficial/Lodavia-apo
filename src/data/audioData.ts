import { 
  AudioItem, 
  AmbientSoundChannel, 
  AudioPlaylist, 
  AudioCreator, 
  AIModeRecommendation,
  LodaviaStory,
  UserPodcast
} from '../types/audio';

// High quality royalty-free public audio samples for realistic playback
const SAMPLE_AUDIO_STREAMS = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-mountains-rivers-10492.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a1e2f7.mp3?filename=ambient-piano-amp-strings-10711.mp3',
  'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4f0be89c1b.mp3?filename=rain-and-thunder-16705.mp3',
  'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f73248.mp3?filename=soft-rain-ambient-111154.mp3'
];

export const AUDIO_ITEMS: AudioItem[] = [
  // --- MUSIC ---
  {
    id: 'track_1',
    title: 'Cosmic Echoes (Acoustic Version)',
    titleAr: 'أصداء الكونية (نسخة صوتية)',
    artist: 'Lodavia Sound Studio',
    artistAr: 'استوديو لودافيا الصوتي',
    category: 'music',
    categoryLabelAr: 'موسيقى',
    categoryLabelEn: 'Music',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[0],
    duration: 215,
    album: 'Parallel Horizons',
    genre: 'Lo-Fi Chill / Chillhop',
    mood: 'Relaxed & Focused',
    releaseYear: '2026',
    playsCount: 142800,
    likesCount: 28400,
    isPopular: true,
    isTrending: true,
    isExclusive: true,
    isCopyrightClean: true,
    copyrightType: 'Official-Partnership',
    lyrics: [
      { time: 0, text: 'Floating through the neon starlight...', textAr: 'أعوم عبر ضوء النجوم النيوني...' },
      { time: 15, text: 'Lost in the digital frequency of time...', textAr: 'تائه في تردد الوقت الرقمي...' },
      { time: 32, text: 'Where silence speaks louder than noise...', textAr: 'حيث يتكلم الصمت بصوت أعلى من الضوضاء...' },
      { time: 55, text: 'Echoes of tomorrow in the cosmic sky...', textAr: 'أصداء الغد في السماء الكونية...' },
      { time: 80, text: 'Serenade of space and deep reflection...', textAr: 'معزوفة الفضاء والتأمل العميق...' },
      { time: 120, text: 'Welcome home to Lodavia Audio...', textAr: 'مرحباً بك في لودافيا للصوتيات...' }
    ]
  },
  {
    id: 'track_2',
    title: 'Riyadh Midnight Drive',
    titleAr: 'قيادة منتصف الليل في الرياض',
    artist: 'Sami Al-Faris',
    artistAr: 'سامي الفارس',
    category: 'music',
    categoryLabelAr: 'موسيقى سينث',
    categoryLabelEn: 'Synthwave / Arabic',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[1],
    duration: 198,
    album: 'Desert Synth Odyssey',
    genre: 'Arabic Synthwave',
    mood: 'Energetic & Driving',
    releaseYear: '2026',
    playsCount: 98400,
    likesCount: 19200,
    isTrending: true,
    isCopyrightClean: true,
    copyrightType: 'Creator-Original'
  },
  {
    id: 'track_3',
    title: 'Oasis Meditation Piano',
    titleAr: 'بيانو التأمل بالواحة',
    artist: 'Nour Ensemble',
    artistAr: 'فرقة نور الموسيقية',
    category: 'music',
    categoryLabelAr: 'موسيقى هادئة',
    categoryLabelEn: 'Neoclassical Piano',
    coverUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[2],
    duration: 260,
    album: 'Oasis Sanctuary',
    genre: 'Neoclassical / Ambient',
    mood: 'Peaceful & Gentle',
    releaseYear: '2025',
    playsCount: 215000,
    likesCount: 45000,
    isPopular: true,
    isCopyrightClean: true,
    copyrightType: 'Licensed'
  },

  // --- PODCASTS ---
  {
    id: 'pod_1',
    title: 'The AI Revolution & Future of Humanity',
    titleAr: 'بودكاست ثورة الذكاء الاصطناعي ومستقبل البشرية',
    artist: 'Tech Horizon Podcast',
    artistAr: 'بودكاست آفاق التقنية',
    category: 'podcasts',
    categoryLabelAr: 'بودكاست تقني',
    categoryLabelEn: 'Tech Podcast',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[0],
    duration: 2400, // 40 mins
    playsCount: 312000,
    likesCount: 68000,
    isPopular: true,
    isTrending: true,
    isExclusive: true,
    isCopyrightClean: true,
    copyrightType: 'Creator-Original',
    podcastEpisodes: [
      {
        id: 'ep_101',
        title: 'Ep 42: Generative Agents & Neural Architecture',
        description: 'How AI agents are reshaping full-stack application development in 2026.',
        publishedDate: '2026-08-01',
        duration: 2400,
        audioUrl: SAMPLE_AUDIO_STREAMS[0],
        episodeNumber: 42,
        seasonNumber: 3
      },
      {
        id: 'ep_102',
        title: 'Ep 41: Quantum Computing Milestones in Saudi Arabia',
        description: 'A deep dive into national AI strategies and quantum breakthroughs.',
        publishedDate: '2026-07-24',
        duration: 2100,
        audioUrl: SAMPLE_AUDIO_STREAMS[1],
        episodeNumber: 41,
        seasonNumber: 3
      }
    ]
  },
  {
    id: 'pod_2',
    title: 'Mindset & Modern Philosophy',
    titleAr: 'بودكاست العقلية والفلسفة المعاصرة',
    artist: 'Dr. Tariq Al-Mansoor',
    artistAr: 'د. طارق المنصور',
    category: 'podcasts',
    categoryLabelAr: 'تطوير الذات',
    categoryLabelEn: 'Personal Growth',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[1],
    duration: 1800,
    playsCount: 185000,
    likesCount: 39000,
    isCopyrightClean: true,
    copyrightType: 'Licensed'
  },

  // --- AUDIOBOOKS ---
  {
    id: 'book_1',
    title: 'Atomic Habits (Arabic Audio Edition)',
    titleAr: 'العادات الذرية (النسخة الصوتية الرسمية)',
    artist: 'Narrated by Maher Al-Harbi',
    artistAr: 'بصوت ماهر الحربي',
    category: 'audiobooks',
    categoryLabelAr: 'كتاب صوتی',
    categoryLabelEn: 'Self Development Audiobook',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[2],
    duration: 18000, // 5 hours
    audiobookAuthor: 'James Clear',
    audiobookNarrator: 'Maher Al-Harbi',
    playsCount: 420000,
    likesCount: 92000,
    isPopular: true,
    isTrending: true,
    isExclusive: true,
    isCopyrightClean: true,
    copyrightType: 'Official-Partnership',
    audiobookChapters: [
      { id: 'chap_1', title: 'المقدمة: قصتي مع العادات', duration: 900, audioUrl: SAMPLE_AUDIO_STREAMS[2] },
      { id: 'chap_2', title: 'الفصل 1: القوة الخفية للتغيرات بنسبة 1%', duration: 1800, audioUrl: SAMPLE_AUDIO_STREAMS[0] },
      { id: 'chap_3', title: 'الفصل 2: كيف تشكل عاداتك هويتك', duration: 2100, audioUrl: SAMPLE_AUDIO_STREAMS[1] },
      { id: 'chap_4', title: 'الفصل 3: القوانين الأربعة لبناء عادة حسنة', duration: 2400, audioUrl: SAMPLE_AUDIO_STREAMS[3] }
    ]
  },
  {
    id: 'book_2',
    title: 'The Psychology of Money',
    titleAr: 'سيكولوجية المال (كتاب صوتی مترجم)',
    artist: 'Morgan Housel',
    artistAr: 'مورغان هاوسل',
    category: 'audiobooks',
    categoryLabelAr: 'إدارة أموال وأعمال',
    categoryLabelEn: 'Business & Finance',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[1],
    duration: 14400,
    audiobookAuthor: 'Morgan Housel',
    audiobookNarrator: 'Fahad Al-Zahrani',
    playsCount: 290000,
    likesCount: 61000,
    isCopyrightClean: true,
    copyrightType: 'Licensed'
  },

  // --- AMBIENT SOUNDS ---
  {
    id: 'ambient_1',
    title: 'Heavy Rain on Glass Window',
    titleAr: 'مطر غزير على زجاج النافذة',
    artist: 'Lodavia Nature Acoustics',
    artistAr: 'أكوستيك الطبيعة لودافيا',
    category: 'ambient',
    categoryLabelAr: 'أصوات طبيعة',
    categoryLabelEn: 'Nature Acoustics',
    coverUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[3],
    duration: 3600, // 1 hour loop
    playsCount: 540000,
    likesCount: 110000,
    isPopular: true,
    isCopyrightClean: true,
    copyrightType: 'Royalty-Free'
  },
  {
    id: 'ambient_2',
    title: 'Cozy Fireplace & Thunderstorm',
    titleAr: 'مدفأة دافئة مع عاصفة رعدية',
    artist: 'Atmospheric Zen Sound',
    artistAr: 'أصوات الغلاف الجوي الهادئة',
    category: 'ambient',
    categoryLabelAr: 'مؤثرات بيئية',
    categoryLabelEn: 'Cozy Atmosphere',
    coverUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[4],
    duration: 3600,
    playsCount: 390000,
    likesCount: 84000,
    isCopyrightClean: true,
    copyrightType: 'Royalty-Free'
  },

  // --- RECORDED VOICE ROOMS ---
  {
    id: 'room_rec_1',
    title: 'Recorded: AI Architecture & Saudi Vision 2030 Salon',
    titleAr: 'تسجيل: صالون الذكاء الاصطناعي ورؤية المملكة 2030',
    artist: 'Hosted by Eng. Faisal & Guest Speakers',
    artistAr: 'تقديم المهندس فيصل والضيوف',
    category: 'recorded_rooms',
    categoryLabelAr: 'صالون صوتي مسجل',
    categoryLabelEn: 'Recorded Salon',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[0],
    duration: 3200,
    recordedRoomHost: 'Eng. Faisal Al-Otaibi',
    recordedRoomDate: '2026-08-04',
    recordedRoomParticipants: 840,
    playsCount: 76000,
    likesCount: 15400,
    isExclusive: true,
    isCopyrightClean: true,
    copyrightType: 'Creator-Original'
  },

  // --- STUDY SOUNDS ---
  {
    id: 'study_1',
    title: 'Alpha Waves 432Hz Deep Focus',
    titleAr: 'موجات ألفا 432 هرتز للتركيز العميق',
    artist: 'Brainwave Lab',
    artistAr: 'مختبر موجات الدماغ',
    category: 'study',
    categoryLabelAr: 'تركيز ودراسة',
    categoryLabelEn: 'Study & Focus',
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[2],
    duration: 3600,
    playsCount: 680000,
    likesCount: 145000,
    isPopular: true,
    isCopyrightClean: true,
    copyrightType: 'Creative-Commons'
  },

  // --- SLEEP SOUNDS ---
  {
    id: 'sleep_1',
    title: 'Deep Delta Waves Sleep Sanctuary',
    titleAr: 'موجات دلتا العميقة للنوم المريح',
    artist: 'Lodavia Sleep Lab',
    artistAr: 'مختبر النوم لودافيا',
    category: 'sleep',
    categoryLabelAr: 'نوم عميق',
    categoryLabelEn: 'Sleep & Rest',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[4],
    duration: 7200, // 2 hours
    playsCount: 890000,
    likesCount: 198000,
    isPopular: true,
    isCopyrightClean: true,
    copyrightType: 'Royalty-Free'
  },

  // --- MEDITATION ---
  {
    id: 'meditation_1',
    title: 'Mindful Breathing & Internal Zen',
    titleAr: 'التنفس الواعي والسلام الداخلي',
    artist: 'Master Amira',
    artistAr: 'الماستر أميرة',
    category: 'meditation',
    categoryLabelAr: 'تأمل واستجمام',
    categoryLabelEn: 'Guided Meditation',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[1],
    duration: 900, // 15 mins
    playsCount: 125000,
    likesCount: 32000,
    isCopyrightClean: true,
    copyrightType: 'Creator-Original'
  }
];

// Interactive Ambient Channels for the Sound Mixer Generator
export const AMBIENT_CHANNELS: AmbientSoundChannel[] = [
  { id: 'rain', name: 'Rain', nameAr: 'مطر 🌧️', icon: 'CloudRain', volume: 70, isActive: true, soundUrl: SAMPLE_AUDIO_STREAMS[3], color: '#38A8EF' },
  { id: 'thunder', name: 'Thunderstorm', nameAr: 'رعد ⚡', icon: 'Zap', volume: 40, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[4], color: '#9333EA' },
  { id: 'forest', name: 'Forest Birds', nameAr: 'غابة وطيور 🌲', icon: 'Trees', volume: 60, isActive: true, soundUrl: SAMPLE_AUDIO_STREAMS[1], color: '#10B981' },
  { id: 'ocean', name: 'Ocean Waves', nameAr: 'أمواج البحر 🌊', icon: 'Waves', volume: 50, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[2], color: '#0EA5E9' },
  { id: 'fireplace', name: 'Cozy Fireplace', nameAr: 'مدفأة حطب 🔥', icon: 'Flame', volume: 65, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[4], color: '#F97316' },
  { id: 'wind', name: 'Soft Wind', nameAr: 'رياح هادئة 💨', icon: 'Wind', volume: 30, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[1], color: '#64748B' },
  { id: 'night', name: 'Night Crickets', nameAr: 'ليل وصرار الليل 🌙', icon: 'Moon', volume: 50, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[2], color: '#6366F1' },
  { id: 'coffee', name: 'Coffee Shop Chatter', nameAr: 'مقهى دافئ ☕', icon: 'Coffee', volume: 45, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[0], color: '#D97706' },
  { id: 'train', name: 'Night Train Ride', nameAr: 'قطار الليل 🚆', icon: 'Train', volume: 35, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[0], color: '#8B5CF6' },
  { id: 'library', name: 'Quiet Library', nameAr: 'مكتبة هادئة 📚', icon: 'BookOpen', volume: 40, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[2], color: '#14B8A6' },
  { id: 'whitenoise', name: 'White Noise', nameAr: 'ضوضاء بيضاء 📻', icon: 'Radio', volume: 30, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[3], color: '#94A3B8' },
  { id: 'brownnoise', name: 'Brown Noise', nameAr: 'ضوضاء بنية 🎧', icon: 'Headphones', volume: 50, isActive: true, soundUrl: SAMPLE_AUDIO_STREAMS[0], color: '#B45309' },
  { id: 'pinknoise', name: 'Pink Noise', nameAr: 'ضوضاء وردية 🌸', icon: 'Sparkles', volume: 40, isActive: false, soundUrl: SAMPLE_AUDIO_STREAMS[1], color: '#EC4899' }
];

// Curated Playlists
export const AUDIO_PLAYLISTS: AudioPlaylist[] = [
  {
    id: 'pl_1',
    title: 'Saudi Lo-Fi & Deep Work',
    titleAr: 'لو-فاي سعودي للتركيز والعمل العميق ☕',
    description: 'Chilled beats blended with oriental instruments for uninterrupted productivity.',
    descriptionAr: 'أنغام هادئة مدموجة بلمسات شرقية أصيلة لتجربة عمل ودراسة مميزة.',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Lodavia Editorial',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    isCollaborative: true,
    likesCount: 34200,
    tracks: [AUDIO_ITEMS[0], AUDIO_ITEMS[1], AUDIO_ITEMS[7]],
    tags: ['Focus', 'Lo-Fi', 'Study', 'Instrumental']
  },
  {
    id: 'pl_2',
    title: 'Bedtime Rainy Sanctuary',
    titleAr: 'ملاذ المطر والاسترخاء قبل النوم 🌧️',
    description: 'Ultimate ambient collection of rain, delta waves, and gentle piano.',
    descriptionAr: 'تجميعة استرخاء متكاملة من المطر وموجات دلتا والبيانو الدافئ.',
    coverUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Acoustics Lab',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    likesCount: 51200,
    tracks: [AUDIO_ITEMS[5], AUDIO_ITEMS[6], AUDIO_ITEMS[8], AUDIO_ITEMS[9]],
    tags: ['Sleep', 'Rain', 'Ambient', 'Relax']
  },
  {
    id: 'pl_3',
    title: 'Future Tech & AI Podcasts',
    titleAr: 'أفضل حلقات التقنية والذكاء الاصطناعي 🎙️',
    description: 'The top insightful podcast episodes selected by Lodavia Editors.',
    descriptionAr: 'أحدث الحلقات الملهمة حول الذكاء الاصطناعي والابتكار الرقمي.',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Lodavia Tech Hub',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    likesCount: 22800,
    tracks: [AUDIO_ITEMS[3], AUDIO_ITEMS[4]],
    tags: ['Podcast', 'Tech', 'AI', 'Future']
  }
];

// Verified Creators
export const AUDIO_CREATORS: AudioCreator[] = [
  {
    id: 'cr_1',
    name: 'Sami Al-Faris',
    nameAr: 'سامي الفارس',
    handle: '@samisynth',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
    bio: 'Electronic Music Producer combining Arabic heritage with futuristic synthwave.',
    bioAr: 'منتج موسيقي إلكتروني يمزج التراث الأصيل بأنغام السينثوايف المستقبلية.',
    isVerified: true,
    followersCount: 84200,
    tracksCount: 18,
    type: 'Musician'
  },
  {
    id: 'cr_2',
    name: 'Tech Horizon Podcast',
    nameAr: 'بودكاست آفاق التقنية',
    handle: '@techhorizon',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    bio: 'Weekly deep dive into generative AI, robotics, and the frontier of tech.',
    bioAr: 'بودكاست أسبوعي يناقش أحدث تطورات الذكاء الاصطناعي والروبوتات والتقنية.',
    isVerified: true,
    followersCount: 142000,
    tracksCount: 52,
    type: 'Podcaster'
  }
];

// Audio AI Recommendations Modes
export const AI_MODE_RECOMMENDATIONS: AIModeRecommendation[] = [
  {
    id: 'mode_morning',
    modeKey: 'morning',
    titleEn: 'Good Morning ☀️',
    titleAr: 'صباح الخير والنشاط ☀️',
    descriptionEn: 'Upbeat acoustic melodies and inspiring podcasts to start your day.',
    descriptionAr: 'أنغام صباحية دافئة وبودكاست إيجابي ليبدأ يومك بطاقة عالية.',
    icon: 'Sun',
    accentColor: '#F59E0B',
    suggestedTrackIds: ['track_1', 'track_2', 'pod_2']
  },
  {
    id: 'mode_focus',
    modeKey: 'focus',
    titleEn: 'Deep Focus & Study 🧠',
    titleAr: 'وضع التركيز والدراسة 🧠',
    descriptionEn: '432Hz Alpha waves, Lo-Fi beats, and ambient noise without lyrics.',
    descriptionAr: 'موجات ألفا بذبذبة 432 هرتز وإيقاعات لو-فاي خالية من الكلمات المشتتة.',
    icon: 'Brain',
    accentColor: '#38A8EF',
    suggestedTrackIds: ['study_1', 'track_1', 'ambient_1']
  },
  {
    id: 'mode_night',
    modeKey: 'night',
    titleEn: 'Night & Sleep Mode 🌙',
    titleAr: 'وضع الليل والنوم العميق 🌙',
    descriptionEn: 'Soothing rain, fireplace crackles, and delta waves for restful sleep.',
    descriptionAr: 'مطر هادئ، خرير المياه وموجات دلتا لنوم عميق وهادئ.',
    icon: 'Moon',
    accentColor: '#8B5CF6',
    suggestedTrackIds: ['sleep_1', 'ambient_1', 'ambient_2']
  },
  {
    id: 'mode_relax',
    modeKey: 'relax',
    titleEn: 'Relax & Chill 🧘',
    titleAr: 'الاسترخاء والهدوء 🧘',
    descriptionEn: 'Neoclassical piano and guided mindfulness sessions to unwind.',
    descriptionAr: 'معزوفات بيئية وتأملات تنفسيه لطرد التوتر وإعادة التوازن.',
    icon: 'Sparkles',
    accentColor: '#10B981',
    suggestedTrackIds: ['meditation_1', 'track_3', 'ambient_2']
  },
  {
    id: 'mode_workout',
    modeKey: 'workout',
    titleEn: 'Workout & Energy 🏋️‍♂️',
    titleAr: 'التمرين والطاقة 🏋️‍♂️',
    descriptionEn: 'Driving synthwave beats and high BPM soundscapes.',
    descriptionAr: 'إيقاعات حماسية وسينثوايف قوي يضاعف لياقتك أثناء التمرين.',
    icon: 'Zap',
    accentColor: '#EF4444',
    suggestedTrackIds: ['track_2', 'pod_1']
  }
];

// Authentic Verified Lodavia Stories with Narrator Intros & Real Citations
export const LODAVIA_STORIES: LodaviaStory[] = [
  {
    id: 'story_apollo11',
    title: 'The Eagle Has Landed: 60 Seconds of Fuel',
    titleAr: 'النسر قد هبط: 60 ثانية من الوقود',
    summary: 'The thrilling true account of July 20, 1969, when the lunar module computer overloaded and Neil Armstrong took manual control with seconds of fuel remaining.',
    summaryAr: 'القصة الحقيقية الموثقة لـ 20 يوليو 1969 عندما تعطل حاسوب الهبوط وتولى نيل أرمسترونغ القيادة اليدوية بوقود لم يتبق منه سوى ثوانٍ معدودة.',
    narrator: 'Ray',
    narratorRoleEn: 'Cosmic Navigator & Narrator',
    narratorRoleAr: 'المستكشف الكوني والراوي',
    narratorIntroEn: 'Ray: "Welcome explorers. Today we turn back the cosmic clocks to July 1969 — humanity was about to touch another world, but a flashing 1202 computer alarm almost aborted everything."',
    narratorIntroAr: 'راي: "مرحباً بكم يا رواد المعرفة. نعود اليوم في سجلات الفضاء إلى يوليو 1969 — البشرية كانت على وشك لمس سطح عالم آخر، لكن إنذاراً رقمياً كاد ينهي الرحلة."',
    historicalFact: 'Neil Armstrong landed the lunar module Eagle with only approximately 25 seconds of propellant left before the mandatory abort threshold.',
    historicalFactAr: 'هبط نيل أرمسترونغ بمركبة النسر بوقود متبقٍ قدره 25 ثانية فقط قبل أن يُجبر على الإلغاء الفوري للرحلة.',
    sources: [
      { title: 'Apollo 11 Mission Report (MSC-01255)', institution: 'NASA Manned Spacecraft Center', year: '1969' },
      { title: 'The First Lunar Landing', institution: 'Smithsonian National Air and Space Museum', year: '2019' }
    ],
    category: 'Space History',
    categoryAr: 'تاريخ الفضاء',
    duration: 320,
    coverUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[0],
    isVerifiedTrueStory: true,
    playsCount: 84200,
    likesCount: 19400,
    chapters: [
      {
        id: 'ch_1',
        title: 'Chapter 1: The Descent from Orbit',
        titleAr: 'الفصل 1: الانحدار من المدار القمري',
        time: 0,
        text: 'At 102 hours into the mission, Eagle separated from Columbia. The descent engine fired smoothly as Armstrong and Aldrin faced the grey craters of the Sea of Tranquility.',
        textAr: 'عند الساعة 102 من عمر المهمة، انفصلت مركبة النسر عن كولومبيا. اشتعل محرك الهبوط بثبات وأرمسترونغ وألدرين يحدقان في فوهات بحر الهدوء الرمادية.'
      },
      {
        id: 'ch_2',
        title: 'Chapter 2: The 1202 Program Alarm',
        titleAr: 'الفصل 2: إنذار البرنامج 1202',
        time: 95,
        text: 'Suddenly, a 1202 computer overload alarm flashed. Back in Houston, 26-year-old Steve Bales recognized it as an executive overflow and called the GO.',
        textAr: 'فجأة، ومض إنذار التحميل الزائد 1202 على شاشة التوجيه. في هيوستن، أدرك المهندس الشاب ستيف بيلز سبب الإنذار وأعطى الإذن بالاستمرار فوراً.'
      },
      {
        id: 'ch_3',
        title: 'Chapter 3: Boulder Field and Manual Touchdown',
        titleAr: 'الفصل 3: حقل الصخور والهبوط اليدوي',
        time: 190,
        text: 'Seeing the automated target was a boulder field, Armstrong took manual attitude control, flying low until the contact light glowed blue: Houston, Tranquility Base here.',
        textAr: 'لاحظ أرمسترونغ أن موقع الهبوط التلقائي مليء بالصخور الضخمة، فتحول للتحكم اليدوي محلقاً حتى أضاء ضوء التلامس: هيوستن، قاعدة الهدوء هنا.. النسر قد هبط.'
      }
    ]
  },
  {
    id: 'story_laika',
    title: 'Laika: The Celestial Voyage of Sputnik 2',
    titleAr: 'لايكا: الرحلة الفلكية لسبوتنيك 2',
    summary: 'The poignant and courageous historical mission of November 3, 1957, that proved living organisms could survive orbital launch and weightlessness.',
    summaryAr: 'القصة التاريخية المؤثرة لمهمة 3 نوفمبر 1957، التي أثبتت لأول مرة علمياً قدرة الكائنات الحية على تحمل انعدام الجاذبية في الفضاء الخارجي.',
    narrator: 'Laika',
    narratorRoleEn: 'Pioneer Canine & Emotional Guide',
    narratorRoleAr: 'الرائدة الوفية والمرشدة العاطفية',
    narratorIntroEn: 'Laika (with Ray): "Woof! Long before human astronauts orbited Earth, I journeyed among the stars. Here is the verified truth of Sputnik 2."',
    narratorIntroAr: 'لايكا (مع راي): "قبل عقود من سفر البشر لمدارات الفضاء، انطلقت في رحلتي بين النجوم. إليكم السجل الحقيقي والموثق لمهمة سبوتنيك 2."',
    historicalFact: 'Sputnik 2 carried telemetry sensors monitoring heart rate and respiratory response, providing humanity with its first vital biological data in orbital space.',
    historicalFactAr: 'حملت سبوتنيك 2 أجهزة قياس بيولوجية حساسة نقلت نبضات القلب والتنفس، مقدمةً للبشرية أول بيانات بيولوجية في تاريخ المدارات الفضائية.',
    sources: [
      { title: 'Sputnik 2 Mission Records', institution: 'Russian Academy of Sciences History Archives', year: '1957' },
      { title: 'Animals in Space: From Research Rockets to the Space Shuttle', institution: 'NASA History Series', year: '2007' }
    ],
    category: 'Pioneering Animals',
    categoryAr: 'رواد الحيوانات',
    duration: 290,
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[1],
    isVerifiedTrueStory: true,
    playsCount: 96300,
    likesCount: 24100,
    chapters: [
      {
        id: 'ch_l1',
        title: 'Chapter 1: The Streets of Moscow to Baikonur',
        titleAr: 'الفصل 1: من شوارع موسكو إلى بايكونور',
        time: 0,
        text: 'Laika was chosen for her gentle temperament and calm resilience under testing conditions, becoming humanity’s first orbital voyager.',
        textAr: 'اختيرت لايكا لطباعها الهادئة وقدرتها الفائقة على التكيف مع التمارين الفسيولوجية، لتصبح أول كائن حي يرتاد المدار الكوني.'
      },
      {
        id: 'ch_l2',
        title: 'Chapter 2: The Roar of Liftoff',
        titleAr: 'الفصل 2: هدير الإطلاق المداري',
        time: 110,
        text: 'Telemetry confirmed that as the rocket reached orbit, Laika’s pulse stabilized, demonstrating for the first time in science that weightlessness was survivable.',
        textAr: 'أكدت الإشارات اللاسلكية أن نبض لايكا استقر بعد الوصول للمدار، ما مثل أول دليل علمي في التاريخ على إمكانية الحياة في انعدام الوزن.'
      }
    ]
  },
  {
    id: 'story_albert',
    title: 'Albert II: Suborbital Boundary Breaker (1949)',
    titleAr: 'ألبرت الثاني: كاسر الحدود الفضائية 1949',
    summary: 'The landmark June 4, 1949 suborbital flight reaching 134 km altitude, establishing the baseline for biomedical spaceflight engineering.',
    summaryAr: 'الرحلة التاريخية في 4 يونيو 1949 التي بلغت ارتفاع 134 كيلومتراً فوق الأرض، واضعةً الأساس الهندسي للطب الفضائي الحديث.',
    narrator: 'Albert',
    narratorRoleEn: 'Scientific Inquirer & Space Analyst',
    narratorRoleAr: 'المحلل العلمي والمستكشف الفضائي',
    narratorIntroEn: 'Albert: "Greetings scientists! In 1949 at White Sands, a modified V-2 rocket crossed the 100km Karman Line for biological discovery. Let us analyze the physics."',
    narratorIntroAr: 'ألبرت: "تحياتي يا علماء المستقبل! في عام 1949 في وايت ساندز، عبر صاروخ V-2 خط كارمان بارتفاع 134 كم لجمع البيانات البيولوجية. لنحلل تفاصيل هذه الرحلة."',
    historicalFact: 'Albert II reached an altitude of 83 miles (134 kilometers), officially entering space past the internationally recognized Karman line (100 km).',
    historicalFactAr: 'بلغ ألبرت الثاني ارتفاع 83 ميلاً (134 كم)، عابراً خط كارمان الدولي الفاصل بين الغلاف الجوي والفضاء الخارجي.',
    sources: [
      { title: 'Aeromedical Research at White Sands Proving Ground', institution: 'USAF Aeromedical Laboratory', year: '1950' },
      { title: 'Suborbital Biological Flights Before Apollo', institution: 'NASA History Division', year: '1998' }
    ],
    category: 'Science & Cosmos',
    categoryAr: 'العلوم والكون',
    duration: 275,
    coverUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[2],
    isVerifiedTrueStory: true,
    playsCount: 52100,
    likesCount: 11800,
    chapters: [
      {
        id: 'ch_a1',
        title: 'Chapter 1: The White Sands Launchpad',
        titleAr: 'الفصل 1: منصة وايت ساندز',
        time: 0,
        text: 'Equipped with telemetry measuring ECG and respiratory pressures, the rocket accelerated past Mach 3 toward the upper ionosphere.',
        textAr: 'مزوداً بأجهزة قياس تخطيط القلب وضغط التنفس، انطلق الصاروخ بسرعة تجاوزت ماخ 3 نحو الغلاف الأيوني العلوي للأرض.'
      },
      {
        id: 'ch_a2',
        title: 'Chapter 2: Crossing the Karman Boundary',
        titleAr: 'الفصل 2: عبور خط كارمان الفضائي',
        time: 120,
        text: 'Reaching 134 kilometers, the sensors proved that physiological cardiovascular systems continue to function beyond Earth’s atmosphere.',
        textAr: 'عند ارتفاع 134 كيلومتراً، برهنت المستشعرات أن الدورة الدموية والأجهزة الحيوية تعمل بشكل طبيعي خارج الغلاف الجوي.'
      }
    ]
  },
  {
    id: 'story_jwst',
    title: 'James Webb: Unfolding the 13.5 Billion Year Time Machine',
    titleAr: 'جيمس ويب: فك طيات آلة الزمن التي ترى قبل 13.5 مليار عام',
    summary: 'How an origami sunshield the size of a tennis court and 18 gold-coated beryllium hexagons opened perfectly at Lagrange Point 2.',
    summaryAr: 'كيف تم نشر الدرع الشمسي بحجم ملعب التنس و18 مرآة سداسية مطلية بالذهب بدقة ميكرونية عند نقطة لاغرانج L2.',
    narrator: 'Ray',
    narratorRoleEn: 'Deep Space Guide',
    narratorRoleAr: 'مرشد الفضاء العميق',
    narratorIntroEn: 'Ray: "Imagine an observatory so sensitive it could detect the thermal signature of a bumblebee on the Moon. That is the James Webb Space Telescope."',
    narratorIntroAr: 'راي: "تخيل مرصداً فائق الحساسية يمكنه رصد البصمة الحرارية لنحلة على سطح القمر من الأرض! هذا هو تلسكوب جيمس ويب الفضائي."',
    historicalFact: 'JWST operations occur at 1.5 million kilometers from Earth at Lagrange Point L2, kept at -233°C to detect infrared light from the first galaxies.',
    historicalFactAr: 'يعمل مرصد جيمس ويب على مسافة 1.5 مليون كم عند نقطة لاغرانج L2 في درجة برودة تصل إلى -233 مئوية لرصد الأشعة تحت الحمراء من أولى المجرات.',
    sources: [
      { title: 'JWST Mission Architecture & Science Instruments', institution: 'NASA / ESA / CSA', year: '2022' },
      { title: 'Early Cosmic Evolution Observations', institution: 'Nature Astronomy', year: '2023' }
    ],
    category: 'Great Inventions',
    categoryAr: 'أعظم الابتكارات',
    duration: 310,
    coverUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    audioUrl: SAMPLE_AUDIO_STREAMS[0],
    isVerifiedTrueStory: true,
    playsCount: 112000,
    likesCount: 31500,
    chapters: [
      {
        id: 'ch_jw1',
        title: 'Chapter 1: 344 Single Points of Failure',
        titleAr: 'الفصل 1: 344 نقطة عطل محتملة بلا بديل',
        time: 0,
        text: 'Engineers designed 344 individual mechanical steps that had to execute flawlessly in deep space without human astronauts able to reach and repair it.',
        textAr: 'صمم المهندسون 344 خطوة ميكانيكية دقيقة كان يتعين أن تنجح جميعها دون خطأ واحد، حيث يستحيل إرسال رواد فضاء لإصلاحه في موقعه البعيد.'
      },
      {
        id: 'ch_jw2',
        title: 'Chapter 2: First Light from the Cosmic Dawn',
        titleAr: 'الفصل 2: أول ضوء من فجر الكون',
        time: 140,
        text: 'The infrared sensors pierced cosmic dust clouds, revealing galaxies formed just 300 million years after the Big Bang.',
        textAr: 'اخترقت مستشعرات الأشعة تحت الحمراء سحب الغبار الكوني، كاشفة عن مجرات تشكلت بعد 300 مليون سنة فقط من الانفجار العظيم.'
      }
    ]
  }
];

// Pre-seeded Community & Creator Podcasts
export const INITIAL_USER_PODCASTS: UserPodcast[] = [
  {
    id: 'pod_tech_frontier',
    title: 'Frontier of Neural Tech & Cosmos',
    titleAr: 'آفاق التقنية العصبية والفضاء',
    description: 'Weekly deep analysis into AI architectures, quantum leaps, and aerospace engineering innovations.',
    descriptionAr: 'تحليل أسبوعي عميق لنماذج الذكاء الاصطناعي، الحوسبة الكمومية، وابتكارات هندسة الفضاء.',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Dr. Tariq Al-Mansoor',
    creatorHandle: '@tariq_tech',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'Technology',
    categoryAr: 'تقنية',
    isPublished: true,
    isVerifiedCreator: true,
    subscribersCount: 48200,
    episodes: [
      {
        id: 'ep_tech_1',
        title: 'Autonomous Agents & The Future of Full-Stack Apps',
        description: 'How specialized generative systems build responsive digital ecosystems with high craft.',
        publishedDate: '2026-08-20',
        duration: 1840,
        audioUrl: SAMPLE_AUDIO_STREAMS[0],
        episodeNumber: 1,
        isPremium: false,
        coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
        creatorName: 'Dr. Tariq Al-Mansoor',
        category: 'Technology'
      },
      {
        id: 'ep_tech_2',
        title: 'Quantum Sensor Arrays in Space Exploration',
        description: 'Navigating deep space without GPS using cosmic microwave background quantum triangulation.',
        publishedDate: '2026-08-12',
        duration: 2150,
        audioUrl: SAMPLE_AUDIO_STREAMS[1],
        episodeNumber: 2,
        isPremium: true,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        creatorName: 'Dr. Tariq Al-Mansoor',
        category: 'Technology'
      }
    ]
  },
  {
    id: 'pod_science_odyssey',
    title: 'The Great Scientific Inquiries',
    titleAr: 'رحلة الاستكشاف العلمي الكبرى',
    description: 'Deconstructing physics, astronomy breakthroughs, and the mathematical marvels of our universe.',
    descriptionAr: 'تفكيك ألغاز الفيزياء، الاكتشافات الفلكية، والمعجزات الرياضية في كوننا الواسع.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Amina Al-Husseini',
    creatorHandle: '@amina_science',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'Science',
    categoryAr: 'علوم',
    isPublished: true,
    isVerifiedCreator: true,
    subscribersCount: 31400,
    episodes: [
      {
        id: 'ep_sci_1',
        title: 'Gravitational Waves: Listening to Colliding Black Holes',
        description: 'How LIGO interferometers measured spacetime ripples smaller than the width of a proton.',
        publishedDate: '2026-08-18',
        duration: 1620,
        audioUrl: SAMPLE_AUDIO_STREAMS[2],
        episodeNumber: 1,
        isPremium: false,
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        creatorName: 'Amina Al-Husseini',
        category: 'Science'
      },
      {
        id: 'ep_sci_2',
        title: 'Dark Matter Candidates: Axions vs WIMPs',
        description: 'The search for the elusive 85% of cosmic matter that holds galaxies together.',
        publishedDate: '2026-08-05',
        duration: 1950,
        audioUrl: SAMPLE_AUDIO_STREAMS[3],
        episodeNumber: 2,
        isPremium: false,
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        creatorName: 'Amina Al-Husseini',
        category: 'Science'
      }
    ]
  }
];
