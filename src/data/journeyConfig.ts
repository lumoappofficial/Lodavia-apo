export type JourneyTrack = 'learning' | 'helping' | 'creating' | 'gaming' | 'community';

export interface JourneyStage {
  threshold: number;
  labelAr: string;
  labelEn: string;
  icon: string;
}

export interface JourneyTrackConfig {
  id: JourneyTrack;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  stages: JourneyStage[];
}

export const JOURNEY_TRACKS: JourneyTrackConfig[] = [
  {
    id: 'learning',
    titleAr: 'التعلّم والجاهزية 🪐',
    titleEn: 'Learning & Mastery 🪐',
    descriptionAr: 'تطور مستواك المعرفي والدورات المنجزة، ينشئ المعالم والمدن الثقافية.',
    descriptionEn: 'Knowledge progression building cultural monuments and knowledge cities.',
    color: 'from-cyan-500 to-blue-600',
    stages: [
      { threshold: 0, labelAr: 'كوكب المعرفة الأول', labelEn: 'Initiate Planet', icon: '🪐' },
      { threshold: 3, labelAr: 'مكتبة السديم الكوني', labelEn: 'Nebula Library', icon: '📚' },
      { threshold: 10, labelAr: 'أكاديمية الفلك الشامخة', labelEn: 'Astrophysics Academy', icon: '🏛️' },
      { threshold: 25, labelAr: 'مدينة العلوم المستقبلية', labelEn: 'Futuristic Science City', icon: '🏙️' }
    ]
  },
  {
    id: 'helping',
    titleAr: 'المساعدة والأثر 🌑',
    titleEn: 'Helping & Impact 🌑',
    descriptionAr: 'مساعدتك للآخرين والإجابة عن الاستفسارات تضيء النجوم والسدم السماوية.',
    descriptionEn: 'Helping others and answering queries lights up stars and cosmic nebulae.',
    color: 'from-amber-400 to-yellow-500',
    stages: [
      { threshold: 0, labelAr: 'قمر الظل الأولي', labelEn: 'Dark Shadow Moon', icon: '🌑' },
      { threshold: 3, labelAr: 'نجم العطاء المشرق', labelEn: 'Bright Giving Star', icon: '⭐' },
      { threshold: 10, labelAr: 'بريق المساعدة الكوني', labelEn: 'Cosmic Sparkle', icon: '✨' },
      { threshold: 25, labelAr: 'مجرة الأثر المضيئة', labelEn: 'Luminous Impact Galaxy', icon: '🌌' }
    ]
  },
  {
    id: 'creating',
    titleAr: 'الإبداع والمحتوى 📡',
    titleEn: 'Creation & Media 📡',
    descriptionAr: 'إنشاء المنشورات والوسائط يبني محطات الإعلام والفضاء السمعي البصري.',
    descriptionEn: 'Publishing posts and media constructs media hubs and broadcasting stations.',
    color: 'from-purple-500 to-indigo-600',
    stages: [
      { threshold: 0, labelAr: 'لاقط الإشارة الكوني', labelEn: 'Cosmic Signal Receiver', icon: '📡' },
      { threshold: 3, labelAr: 'محطة البث الفضائي', labelEn: 'Space Radio Station', icon: '📻' },
      { threshold: 10, labelAr: 'استوديو الإنتاج الرقمي', labelEn: 'Digital Production Studio', icon: '🎬' },
      { threshold: 25, labelAr: 'قمر الإعلام المداري', labelEn: 'Orbital Media Satellite', icon: '🛰️' }
    ]
  },
  {
    id: 'gaming',
    titleAr: 'الألعاب والمغامرة 🗺️',
    titleEn: 'Gaming & Exploration 🗺️',
    descriptionAr: 'المشاركة بالأنشطة والتحديات والألعاب تفتح مناطق وتضاريس جديدة.',
    descriptionEn: 'Participating in gaming and challenges unlocks new regions and terrains.',
    color: 'from-emerald-500 to-teal-600',
    stages: [
      { threshold: 0, labelAr: 'خريطة الاستكشاف الأولى', labelEn: 'Initial Sector Map', icon: '🗺️' },
      { threshold: 3, labelAr: 'قمم الأبعاد المرتفعة', labelEn: 'Dimensional Peaks', icon: '🏔️' },
      { threshold: 10, labelAr: 'بركان الطاقة الكونية', labelEn: 'Cosmic Energy Volcano', icon: '🌋' },
      { threshold: 25, labelAr: 'بوصلة الفضاء الأسطورية', labelEn: 'Mythic Space Compass', icon: '🧭' }
    ]
  },
  {
    id: 'community',
    titleAr: 'المجتمع والقيادة 🎖️',
    titleEn: 'Community & Leadership 🎖️',
    descriptionAr: 'المساهمة والتفاعل مع المجتمعات يمنحك أوسمة ونياشين قيادية فريدة.',
    descriptionEn: 'Community engagement and leadership earns prestigious medals and crowns.',
    color: 'from-rose-500 to-aurora-500',
    stages: [
      { threshold: 0, labelAr: 'شرف الانضمام الأول', labelEn: 'Member Honor Pin', icon: '🎖️' },
      { threshold: 3, labelAr: 'وسام التفاعل المتميز', labelEn: 'Engagement Medal', icon: '🏅' },
      { threshold: 10, labelAr: 'ميدالية القيادة الذهبية', labelEn: 'Golden Leadership Medal', icon: '🥇' },
      { threshold: 25, labelAr: 'تاج العرش الكوني', labelEn: 'Cosmic Sovereign Crown', icon: '👑' }
    ]
  }
];

export function getCurrentStage(track: JourneyTrackConfig, count: number): JourneyStage {
  let current = track.stages[0];
  for (const stage of track.stages) {
    if (count >= stage.threshold) {
      current = stage;
    }
  }
  return current;
}

export function getNextStage(track: JourneyTrackConfig, count: number): JourneyStage | null {
  for (const stage of track.stages) {
    if (count < stage.threshold) {
      return stage;
    }
  }
  return null;
}
