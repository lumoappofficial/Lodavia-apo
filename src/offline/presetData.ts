// Offline Preset Data & Downloadable Content
import { SpacePackItem, OfflineSavedItem } from './db';

export const PRESET_SPACE_PACKS: SpacePackItem[] = [
  {
    id: 'pack_earth',
    nameAr: '🌍 حزمة كوكب الأرض',
    nameEn: '🌍 Planet Earth Pack',
    descriptionAr: 'معلومات ومجسمات وبيانات مناخية وغلاف جوي مفصلة لكوكب الأرض',
    descriptionEn: 'Detailed climate, atmospheric, and satellite data for planet Earth',
    icon: '🌍',
    sizeFormatted: '18.4 MB',
    size: 18400000,
    isPremium: false,
    downloadStatus: 'AVAILABLE',
    planetData: {
      diameter: '12,742 km',
      mass: '5.97 × 10^24 kg',
      moons: 1,
      temp: '15°C (Average)',
      atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon',
      summaryAr: 'الأرض هو الكوكب الثالث من الشمس والكوكب الوحيد المعروف في الكون الذي توجد عليه حياة.',
      summaryEn: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
      keyFacts: [
        'المحيطات تغطي أكثر من 70% من سطح الكوكب',
        'يمتلك مجالاً مغناطيسياً قوياً يحمي من الأشعة الشمسية',
        'القمر هو التابع الطبيعي الوحيد للأرض'
      ]
    },
    cachedImages: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'pack_mars',
    nameAr: '🔴 حزمة كوكب المريخ (الكوكب الأحمر)',
    nameEn: '🔴 Red Planet Mars Pack',
    descriptionAr: 'خرائط السطح التضاريسية والوديان ومركبات الروبوت الكاشفة',
    descriptionEn: 'Surface topographical maps, canyons, and rover exploration archives',
    icon: '🔴',
    sizeFormatted: '32.1 MB',
    size: 32100000,
    isPremium: false,
    downloadStatus: 'AVAILABLE',
    planetData: {
      diameter: '6,779 km',
      mass: '6.42 × 10^23 kg',
      moons: 2,
      temp: '-63°C',
      atmosphere: '95% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon',
      summaryAr: 'المريخ هو الكوكب الرابع في المجموعة الشمسية، ويُسمى بالكوكب الأحمر بسبب أكسيد الحديد السائد على سطحه.',
      summaryEn: 'Mars is the fourth planet from the Sun, named the Red Planet due to iron oxide dust on its surface.',
      keyFacts: [
        'يضم بركان أوليمبوس مونس، أعلى بركان في المجموعة الشمسية',
        'يحتوي على قمرين صغيرين: فوبوس وديموس',
        'تجري عليه رحلات استكشاف بواسطة مركبة بيرسيفيرانس'
      ]
    },
    cachedImages: [
      'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'pack_moon',
    nameAr: '🌙 حزمة القمر وتضاريسه',
    nameEn: '🌙 Lunar Topography Pack',
    descriptionAr: 'الفوهات القمرية ومراحل الخسوف والتاريخ الكامل لرحلات أبوللو',
    descriptionEn: 'Lunar craters, eclipse phases, and complete Apollo mission log',
    icon: '🌙',
    sizeFormatted: '12.8 MB',
    size: 12800000,
    isPremium: false,
    downloadStatus: 'AVAILABLE',
    planetData: {
      diameter: '3,474 km',
      mass: '7.35 × 10^22 kg',
      moons: 0,
      temp: '-130°C to 120°C',
      atmosphere: 'Very thin exosphere (Helium, Neon, Hydrogen)',
      summaryAr: 'القمر هو الجرم السماوي الأقرب للأرض ويدور حولها في مدار بيضاوي مستقر.',
      summaryEn: 'The Moon is Earth\'s only natural satellite, stabilizing Earth\'s axial tilt.',
      keyFacts: [
        'الجاذبية على سطح القمر تشكل 1/6 من جاذبية الأرض',
        'يسبب ظاهرة المد والجزر في محيطات الأرض',
        'الجانب البعيد عن الأرض يحتوي على فوهات بركانية كثيفة'
      ]
    },
    cachedImages: [
      'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'pack_solar_system',
    nameAr: '🪐 حزمة المجموعة الشمسية الكاملة (Offline+)',
    nameEn: '🪐 Complete Solar System Pack (Offline+)',
    descriptionAr: 'بيانات ومسارات جميع الكواكب والمدارات وحزام الكويكبات بالكامل',
    descriptionEn: 'Comprehensive planetary orbits, asteroids, and outer gas giants data',
    icon: '🪐',
    sizeFormatted: '85.5 MB',
    size: 85500000,
    isPremium: true,
    downloadStatus: 'AVAILABLE',
    planetData: {
      diameter: '1.39 million km (Sun)',
      mass: '1.989 × 10^30 kg',
      moons: 290,
      temp: 'Varies',
      atmosphere: 'Multilayer planetary atmospheres',
      summaryAr: 'حزمة شاملة تغطي المشتري وزحل وأورانوس ونبتون وجميع الأقمار التابعة.',
      summaryEn: 'Comprehensive high-res dataset covering Jupiter, Saturn, Uranus, Neptune, and Kuiper belt.',
      keyFacts: [
        'تغطي 8 كواكب رئيسية وكواكب قزمة',
        'تضم البيانات التفاعلية ثلاثية الأبعاد بدون إنترنت'
      ]
    },
    cachedImages: [
      'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'pack_deep_space',
    nameAr: '🌌 حزمة السدم والمجرات السحيقة (Offline+)',
    nameEn: '🌌 Deep Space Nebulae & Galaxies (Offline+)',
    descriptionAr: 'صور عالية الدقة من تلسكوب جيمس ويب و هابل لمجرات ومجموعات نجمية',
    descriptionEn: 'Ultra high-resolution James Webb & Hubble space telescope deep field data',
    icon: '🌌',
    sizeFormatted: '142.0 MB',
    size: 142000000,
    isPremium: true,
    downloadStatus: 'AVAILABLE',
    planetData: {
      diameter: '100,000 light years (Milky Way)',
      mass: '1.5 trillion solar masses',
      moons: 0,
      temp: '2.7 Kelvin',
      atmosphere: 'Interstellar Medium',
      summaryAr: 'استكشف أسرار المادة المظلمة والمجرات اللولبية والسدم البرّاقة.',
      summaryEn: 'Explore dark matter mysteries, spiral galaxies, and stellar nurseries.',
      keyFacts: [
        'تتضمن صوراً بجودة فائقة لـ سديم الجبار ومجرة المرأة المسلسلة',
        'بيانات فلكية موثقة من وكالة ناسا و إيسا'
      ]
    },
    cachedImages: [
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const PRESET_COURSES: OfflineSavedItem[] = [
  {
    id: 'course_js_pro',
    type: 'course',
    title: 'مسار البرمجة بلغة JavaScript الفائقة 🚀',
    titleAr: 'مسار البرمجة بلغة JavaScript الفائقة 🚀',
    titleEn: 'Modern Professional JavaScript Mastery Path 🚀',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    downloadStatus: 'AVAILABLE',
    downloadProgress: 0,
    downloadedAt: 0,
    size: 45000000,
    sizeFormatted: '45.0 MB',
    version: '1.2.0',
    syncStatus: 'SYNCED',
    isPremium: false,
    cachedContent: {
      lessons: [
        { id: 'l1', titleAr: 'الدرس الأول: المتغيرات والأنواع الأساسية', titleEn: 'Lesson 1: Variables & Data Types', duration: '12 min', contentAr: 'تعتبر المتغيرات الحاوية التخزينية الأساسية في JavaScript...', contentEn: 'Variables are containers for storing data values...' },
        { id: 'l2', titleAr: 'الدرس الثاني: الدوال السهمية والـ Closures', titleEn: 'Lesson 2: Arrow Functions & Closures', duration: '18 min', contentAr: 'تتيح الدوال السهمية صياغة مختصرة وأنيقة...', contentEn: 'Arrow functions allow a shorter syntax...' },
        { id: 'l3', titleAr: 'الدرس الثالث: الوعود والأوامر غير المتزامنة Async/Await', titleEn: 'Lesson 3: Async/Await & Promises', duration: '25 min', contentAr: 'التعامل مع العمليات غير المتزامنة بدون تعطيل واجهة المستخدم...', contentEn: 'Handling asynchronous calls smoothly...' }
      ],
      quiz: [
        { id: 'q1', questionAr: 'ما هي الكلمة المفتاحية لإنشاء متغير ثابت؟', questionEn: 'Which keyword defines an immutable variable?', options: ['var', 'let', 'const', 'static'], correct: 2 }
      ]
    }
  },
  {
    id: 'course_react_cosmic',
    type: 'course',
    title: 'تطوير واجهات React ثلاثية الأبعاد ⚛️',
    titleAr: 'تطوير واجهات React ثلاثية الأبعاد ⚛️',
    titleEn: 'Building Cosmic 3D UIs with React ⚛️',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    downloadStatus: 'AVAILABLE',
    downloadProgress: 0,
    downloadedAt: 0,
    size: 78000000,
    sizeFormatted: '78.0 MB',
    version: '2.0.1',
    syncStatus: 'SYNCED',
    isPremium: true,
    cachedContent: {
      lessons: [
        { id: 'lr1', titleAr: 'الدرس الأول: مقدمة في React Three Fiber', titleEn: 'Lesson 1: Intro to React Three Fiber', duration: '20 min', contentAr: 'دمج عالم الويب مع الرسوميات ثلاثية الأبعاد...', contentEn: 'Combining web UI with 3D graphics...' }
      ]
    }
  }
];
