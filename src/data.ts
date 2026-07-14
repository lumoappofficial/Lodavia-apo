import { 
  CommunityItem, 
  VoiceRoom, 
  VideoRoom, 
  LiveStream, 
  Course, 
  EventItem, 
  ChatConversation,
  AppUser,
  Post
} from './types';

// Default User Profile (Mock)
export const initialUser: AppUser = {
  id: 'user_1',
  name: 'محمد العتيبي',
  email: 'mohamed@lodavia.com',
  phone: '+966 50 123 4567',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  bio: 'مطور واجهات ومحب للذكاء الاصطناعي وبناء المجتمعات الرقمية. أؤمن بأن المعرفة تنمو بالمشاركة والتعلم المستمر 🚀✨',
  country: 'المملكة العربية السعودية',
  language: 'العربية',
  interests: ['برمجة', 'ذكاء اصطناعي', 'ألعاب'],
  achievements: [
    { id: 'ach_1', title: 'عضو مؤسس', description: 'انضم إلى Lodavia في ساعاتها الأولى', icon: '👑' },
    { id: 'ach_2', title: 'مستكشف المعرفة', description: 'أكمل أول دورة تعليمية بنجاح', icon: '🎓' },
    { id: 'ach_3', title: 'صانع الأثر', description: 'تفاعل مع 10 مجتمعات مختلفة', icon: '🌟' }
  ],
  joinedCommunities: ['comm_prog', 'comm_ai'],
  enrolledCourses: ['course_react', 'course_prompt'],
  followersCount: 1420,
  followingCount: 382,
  points: 150,
  purchasedItems: []
};

// All Available Communities
export const allCommunities: CommunityItem[] = [
  {
    id: 'comm_prog',
    name: 'برمجة • Programming',
    slug: 'programming',
    description: 'ملتقى المطورين والمبرمجين لمناقشة لغات البرمجة وتطوير الويب والأجهزة المحمولة والتقنيات الحديثة.',
    icon: '💻',
    banner: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
    category: 'برمجة',
    membersCount: 8430,
    admins: [
      { name: 'سارة المهندس', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { name: 'خالد المطيري', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
    ],
    posts: [
      {
        id: 'post_prog_1',
        authorName: 'أحمد الحربي',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        authorTitle: 'مطور ويب أول',
        content: 'تحديثات React 19 الجديدة تحمل الكثير من الميزات الرائعة! خاصة مع الدعم الكامل لـ Server Components والتكامل الأسهل مع النماذج. ما هي الميزة الأكثر حماساً بالنسبة لكم؟ 🤔💻',
        likes: 124,
        commentsCount: 18,
        timestamp: 'قبل ساعتين'
      },
      {
        id: 'post_prog_2',
        authorName: 'منى القحطاني',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        content: 'قمت اليوم بإنشاء مستودع جديد على GitHub يحتوي على مجموعة من النصائح المتقدمة في هندسة البرمجيات وتطبيق مبادئ Clean Code. شاركوني آراءكم ومساهماتكم! الرابط في الرد الأول.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        likes: 98,
        commentsCount: 12,
        timestamp: 'قبل ٤ ساعات'
      }
    ],
    activeVoiceRooms: [
      {
        id: 'voice_prog_1',
        title: 'جلسة كود ونقاش حول لغات المستقبل 🛠️',
        hostName: 'صالح العمري',
        hostAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        listenersCount: 142,
        speakersCount: 5,
        tags: ['React', 'TypeScript', 'Rust']
      }
    ],
    activeVideoRooms: [
      {
        id: 'video_prog_1',
        title: 'مراجعة جماعية لمشاريع التخرج والمواقع 🖥️',
        hostName: 'رائد السبيعي',
        hostAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
        participantsCount: 28,
        tags: ['UI/UX', 'Portfolio', 'Web']
      }
    ],
    activeStreams: [
      {
        id: 'stream_prog_1',
        title: 'برمجة تطبيق توصيل متكامل من الصفر 📱',
        streamerName: 'فيصل الغامدي',
        streamerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        viewerCount: 310,
        category: 'Flutter Development'
      }
    ],
    courses: [
      {
        id: 'course_react',
        title: 'المرجع الشامل لتطوير الويب الحديث باستخدام React 19',
        instructor: 'المهندسة ريم الشهري',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        duration: '١٨ ساعة تدريبية',
        lessonsCount: 45,
        rating: 4.9,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        studentsCount: 1250
      }
    ]
  },
  {
    id: 'comm_ai',
    name: 'الذكاء الاصطناعي • Artificial Intelligence',
    slug: 'ai',
    description: 'المنصة المثالية لمناقشة أحدث تقنيات الذكاء الاصطناعي التوليدي، نماذج اللغة الكبيرة، وتطبيقات التعلم الآلي والشبكات العصبية.',
    icon: '🤖',
    banner: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    category: 'ذكاء اصطناعي',
    membersCount: 12050,
    admins: [
      { name: 'د. يوسف الرشيد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
    ],
    posts: [
      {
        id: 'post_ai_1',
        authorName: 'د. يوسف الرشيد',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        content: 'قامت Google اليوم بإطلاق تحديث جديد للـ SDK الخاص بنماذج Gemini 2.5 مع قدرات معالجة لحظية للصوت والفيديو بأزمنة استجابة قياسية! التطور مذهل والفرص المتاحة للمطورين لا حصر لها.',
        likes: 235,
        commentsCount: 34,
        timestamp: 'قبل ساعة'
      }
    ],
    activeVoiceRooms: [
      {
        id: 'voice_ai_1',
        title: 'ندوة نقاشية: كيف سيؤثر الذكاء الاصطناعي على مستقبل الوظائف؟ 🔮',
        hostName: 'د. يوسف الرشيد',
        hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        listenersCount: 520,
        speakersCount: 6,
        tags: ['Future', 'AI Ethics', 'Models']
      }
    ],
    activeVideoRooms: [],
    activeStreams: [],
    courses: [
      {
        id: 'course_prompt',
        title: 'احترف هندسة الأوامر وصناعة المساعدين الأذكياء',
        instructor: 'أنس المالكي',
        instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        duration: '٨ ساعات',
        lessonsCount: 16,
        rating: 4.8,
        coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
        studentsCount: 3400
      }
    ]
  },
  {
    id: 'comm_foot',
    name: 'كرة القدم • Football',
    slug: 'football',
    description: 'مكان لالتقاء عشاق اللعبة الجميلة ومناقشة المباريات، الصفقات، والبطولات المحلية والعالمية.',
    icon: '⚽',
    banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    category: 'كرة القدم',
    membersCount: 15400,
    admins: [{ name: 'أبو فهد', avatar: 'https://images.unsplash.com/photo-1527983359383-4758693f760c?w=100&auto=format&fit=crop&q=80' }],
    posts: [
      {
        id: 'post_foot_1',
        authorName: 'أبو فهد',
        authorAvatar: 'https://images.unsplash.com/photo-1527983359383-4758693f760c?w=100&auto=format&fit=crop&q=80',
        content: 'توقعاتكم لمباراة ديربي الليلة؟ هل تتوقعون عودة هجومية قوية أم مباراة تكتيكية مغلقة وصعبة على الطرفين؟ ⚽🔥',
        likes: 310,
        commentsCount: 92,
        timestamp: 'قبل ٣٠ دقيقة'
      }
    ],
    activeVoiceRooms: [
      {
        id: 'voice_foot_1',
        title: 'تحليل تكتيكي لأبرز مباريات الأسبوع والصفقات الجديدة 🎤',
        hostName: 'كابتن ماجد عبد الله',
        hostAvatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&auto=format&fit=crop&q=80',
        listenersCount: 610,
        speakersCount: 4,
        tags: ['Tactics', 'League', 'Analysis']
      }
    ],
    activeVideoRooms: [],
    activeStreams: [],
    courses: []
  },
  {
    id: 'comm_swim',
    name: 'سباحة • Swimming',
    slug: 'swimming',
    description: 'لمحبي السباحة والرياضات المائية، نتعلم هنا أفضل التقنيات، طرق التنفس، وتجهيز اللياقة البدنية.',
    icon: '🏊',
    banner: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80',
    category: 'سباحة',
    membersCount: 3120,
    admins: [],
    posts: [
      {
        id: 'post_swim_1',
        authorName: 'الكابتن عبد الرحمن',
        authorAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=80',
        content: 'نصيحة اليوم للسباحين: حافظوا على استقامة الجسد في الماء وركزوا على مرونة الكاحل لزيادة قوة الدفع بنسبة تصل إلى ٣٠٪! 🏊‍♂️🌊',
        likes: 67,
        commentsCount: 9,
        timestamp: 'قبل يوم'
      }
    ],
    activeVoiceRooms: [],
    activeVideoRooms: [],
    activeStreams: [],
    courses: []
  },
  {
    id: 'comm_game',
    name: 'ألعاب • Gaming',
    slug: 'gaming',
    description: 'منصة تجميع اللاعبين، تنظيم البطولات، ومناقشة أحدث العناوين وأجهزة الكونسول والـ PC.',
    icon: '🎮',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    category: 'ألعاب',
    membersCount: 9400,
    admins: [],
    posts: [
      {
        id: 'post_game_1',
        authorName: 'سلطان قيمر',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        content: 'رسمياً الإعلان عن اللعبة المنتظرة للعام القادم والرسومات والفيزيائية تبدو سابقة لجيلها بمسافات! ما هو تقييمكم للعرض الدعائي الأول؟ 🎮🔥',
        likes: 184,
        commentsCount: 35,
        timestamp: 'قبل ٨ ساعات'
      }
    ],
    activeVoiceRooms: [],
    activeVideoRooms: [
      {
        id: 'video_game_1',
        title: 'بطولة Lodavia الودية للعبة الـ FC الليلة 🎮',
        hostName: 'ياسر العتيبي',
        hostAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        participantsCount: 48,
        tags: ['FC 26', 'Tournament', 'Live']
      }
    ],
    activeStreams: [
      {
        id: 'stream_game_1',
        title: 'بث مغامرات وتحديات رعب على الـ PC 🎙️👻',
        streamerName: 'عز اليماني',
        streamerAvatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=100&auto=format&fit=crop&q=80',
        viewerCount: 450,
        category: 'Scary Games'
      }
    ],
    courses: []
  },
  {
    id: 'comm_photo',
    name: 'تصوير • Photography',
    slug: 'photography',
    description: 'شارك لقطاتك المذهلة، وتعلم كيفية تعديل الصور وتوزيع الإضاءة واستخدام العدسات والمعدات المختلفة.',
    icon: '📷',
    banner: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&auto=format&fit=crop&q=80',
    category: 'تصوير',
    membersCount: 2450,
    admins: [],
    posts: [
      {
        id: 'post_photo_1',
        authorName: 'ابتسام الشريف',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
        content: 'قمت بالتقاط هذه الصورة الرائعة عند غروب الشمس اليوم في واجهة الرياض. استخدمت عدسة 50mm بفتحة عدسة f/1.8 وموازنة يدوية للإضاءة. رأيكم؟ 🌅📸',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        likes: 112,
        commentsCount: 16,
        timestamp: 'قبل يومين'
      }
    ],
    activeVoiceRooms: [],
    activeVideoRooms: [],
    activeStreams: [],
    courses: []
  },
  {
    id: 'comm_music',
    name: 'موسيقى • Music',
    slug: 'music',
    description: 'مكان للتواصل الفني، عزف الآلات، مناقشة المقامات الموسيقية ومشاركة المقطوعات والأغاني الملهمة.',
    icon: '🎵',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    category: 'موسيقى',
    membersCount: 4100,
    admins: [],
    posts: [
      {
        id: 'post_music_1',
        authorName: 'طارق الملحن',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        content: 'اليوم نقوم بتحليل مقام الحجاز وأثره النفسي العاطفي الممزوج بين الشجن والدفء. سأقوم بفتح بث صوتي مباشر للعزف وتطبيق المقامات بعد قليل! 🎶🎻',
        likes: 145,
        commentsCount: 22,
        timestamp: 'قبل ٣ ساعات'
      }
    ],
    activeVoiceRooms: [
      {
        id: 'voice_music_1',
        title: 'صالون الموسيقى: عزف وتدريب حي على العود والبيانو 🎵🎻',
        hostName: 'طارق الملحن',
        hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        listenersCount: 195,
        speakersCount: 3,
        tags: ['Oud', 'Piano', 'Live Jam']
      }
    ],
    activeVideoRooms: [],
    activeStreams: [],
    courses: []
  },
  {
    id: 'comm_travel',
    name: 'سفر • Travel',
    slug: 'travel',
    description: 'اكتشف وجهتك السياحية القادمة، واقرأ تجارب ونصائح المسافرين من جميع أنحاء العالم لتوفير النفقات والحصول على رحلة ممتعة.',
    icon: '🌍',
    banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    category: 'سفر',
    membersCount: 5670,
    admins: [],
    posts: [
      {
        id: 'post_travel_1',
        authorName: 'خالد الرحال',
        authorAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
        content: 'تقريري السريع لزيارة جزيرة بالي بميزانية اقتصادية لا تتجاوز ١٠٠٠ دولار لمدة ١٠ أيام متكاملة تشمل السكن الفاخر والمزارات الرائعة! تفاعلوا للإرسال المباشر للتقرير 🌍✈️',
        likes: 278,
        commentsCount: 45,
        timestamp: 'قبل يوم'
      }
    ],
    activeVoiceRooms: [],
    activeVideoRooms: [],
    activeStreams: [],
    courses: []
  }
];

// Seeded active conversations for modern chat section
export const initialChats: ChatConversation[] = [
  {
    id: 'chat_1',
    contactName: 'سارة المهندس',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'sarah', text: 'مرحباً محمد! هل شاهدت ميزات React 19 الجديدة؟', type: 'text', timestamp: '10:15 AM' },
      { id: 'm2', senderId: 'sarah', text: 'أنصحك بمشاهدة الكود البرمجي الذي أضفته، فيه حلول ممتازة جداً لمشاكل الـ State', type: 'text', timestamp: '10:16 AM' }
    ]
  },
  {
    id: 'chat_2',
    contactName: 'د. يوسف الرشيد',
    contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 0,
    messages: [
      { id: 'm3', senderId: 'me', text: 'السلام عليكم دكتور، هل هناك ندوة جديدة هذا الأسبوع بخصوص الذكاء الاصطناعي؟', type: 'text', timestamp: 'أمس' },
      { id: 'm4', senderId: 'yousef', text: 'وعليكم السلام يا محمد. نعم، سنقوم بفتح صالون صوتي الليلة لمناقشة أحدث التحديثات بإذن الله، يسعدنا حضورك.', type: 'text', timestamp: 'أمس' }
    ]
  },
  {
    id: 'chat_3',
    contactName: 'فيصل الغامدي',
    contactAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    isOnline: false,
    unreadCount: 0,
    messages: [
      { id: 'm5', senderId: 'faisal', text: 'لقد أرسلت لك ملف المشروع كاملاً هنا للاطلاع والتجربة.', type: 'file', fileName: 'lumo_app_v1.zip', timestamp: 'قبل يومين' },
      { id: 'm6', senderId: 'me', text: 'رائع جداً فيصل، سأقوم بتحميله وتجربته فور العودة للمنزل، شكراً لجهودك ومشاركتك.', type: 'text', timestamp: 'قبل يومين' }
    ]
  },
  {
    id: 'chat_4',
    contactName: 'طارق الملحن',
    contactAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 0,
    messages: [
      { id: 'm7', senderId: 'tareq', text: 'اسمع هذا العزف البسيط على مقام الصبا وأعطني رأيك يا صديقي دقيقة صوتية واحدة 🎵', type: 'audio', duration: '0:45', timestamp: 'الجمعة' }
    ]
  }
];

// Seeded daily events for the dashboard
export const todayEvents: EventItem[] = [
  {
    id: 'ev_1',
    title: 'بطولة Lodavia السنوية للشطرنج الخاطف 🏆♟️',
    time: '08:00 PM',
    date: 'اليوم',
    organizer: 'مجتمع الألعاب',
    attendeesCount: 240,
    category: 'Gaming'
  },
  {
    id: 'ev_2',
    title: 'هاكاثون البرمجة اللحظية المفتوح (٢٤ ساعة) 💻🚀',
    time: '10:00 PM',
    date: 'اليوم',
    organizer: 'مجتمع برمجة',
    attendeesCount: 680,
    category: 'Programming'
  },
  {
    id: 'ev_3',
    title: 'جلسة الحوار والتعارف الكوني التفاعلي 🌍🤝',
    time: '11:30 PM',
    date: 'الليلة',
    organizer: 'إدارة Lodavia',
    attendeesCount: 1540,
    category: 'Community'
  }
];

export const initialHomePosts: Post[] = [
  {
    id: 'home_post_1',
    authorName: 'سارة المهندس',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    authorTitle: 'مؤسسة مجتمع برمجة لوِمو 👑',
    content: 'أهلاً بعائلة لوِمو الكونية! 🌌 اليوم قمت بإضافة تحديثات بصرية خارقة للغرف الصوتية والمشاهد ثلاثية الأبعاد. هدفنا هو بناء الفضاء الرقمي الأجمل للتعلم التفاعلي والتبادل المعرفي اللحظي. شاركوني اقتراحاتكم للميزات القادمة! 👇💻',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    likes: 384,
    commentsCount: 2,
    sharesCount: 45,
    timestamp: 'قبل ١٠ دقائق',
    likedByMe: false,
    sharedByMe: false,
    savedByMe: false,
    comments: [
      {
        id: 'c_1',
        authorName: 'أحمد الحربي',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        content: 'التصميم البصري الجديد للغرف الصوتية مذهل جداً يا سارة! المؤثرات الصوتية والسينثسيزر يعطي شعوراً حياً وتفاعلياً فريداً من نوعه 🎧🔥',
        timestamp: 'قبل ٥ دقائق'
      },
      {
        id: 'c_2',
        authorName: 'منى القحطاني',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        content: 'أحببت فكرة المتجر الكوني واستبدال نقاط التفاعل بإطارات للصور الشخصية وألوان متوهجة، حركة مبتكرة لتشجيع التعلم المستمر! 😍🎨',
        timestamp: 'قبل ٣ دقائق'
      }
    ]
  },
  {
    id: 'home_post_2',
    authorName: 'فيصل الغامدي',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    authorTitle: 'مطور Flutter ومنشئ بثوث',
    content: 'مقتطف سريع من بث اليوم المباشر! 🔴 قمنا بتطوير وبرمجة الواجهات الحركية لتطبيق التوصيل الذكي باستخدام محرك انيميشن فائق السلاسة. شكراً لـ 300+ متابع حضروا البث اليوم وساندونا بالأسئلة والنقاش المميز. ترقبوا بث الغد لمرحلة ربط البيانات والموقع الجغرافي! 🚀📲',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-computer-screen-with-fast-running-code-42253-large.mp4',
    likes: 215,
    commentsCount: 1,
    sharesCount: 19,
    timestamp: 'قبل ساعة',
    likedByMe: false,
    sharedByMe: false,
    savedByMe: false,
    comments: [
      {
        id: 'c_3',
        authorName: 'صالح العمري',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        content: 'البث كان أسطورياً فيصل! الاستفادة كانت مذهلة والتقنيات المستخدمة حديثة ومثالية. بانتظار بث الغد بكل شغف 💻👌',
        timestamp: 'قبل ٤٠ دقيقة'
      }
    ]
  },
  {
    id: 'home_post_3',
    authorName: 'د. يوسف الرشيد',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    authorTitle: 'أستاذ الذكاء الاصطناعي والشبكات العصبية',
    content: 'الأصدقاء المبدعون، الذكاء الاصطناعي التوليدي لا يقتصر على توليد النصوص فقط، بل يمتد لصناعة تجارب رقمية حية متكاملة تتوائم ذاتياً مع ميول وسلوك المستخدمين لحظة بلحظة. في لوِمو، نسعى لدمج هذا التوجيه الذكي لمساعدة المبرمجين والمهتمين على كسب المهارات المناسبة بأقصر السبل. كيف تستخدمون تقنيات الذكاء الاصطناعي في روتينكم اليومي؟ 🤖🔮',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    likes: 429,
    commentsCount: 1,
    sharesCount: 82,
    timestamp: 'قبل ٣ ساعات',
    likedByMe: false,
    sharedByMe: false,
    savedByMe: false,
    comments: [
      {
        id: 'c_4',
        authorName: 'خالد المطيري',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        content: 'مقال وموضوع ذو قيمة عالية دكتور. بالنسبة لي، استخدام المساعدات الذكية في مراجعة الكود البرمجي وكتابة الاختبارات التلقائية ضاعف من إنتاجيتي مرتين على الأقل 🚀',
        timestamp: 'قبل ساعتين'
      }
    ]
  }
];
