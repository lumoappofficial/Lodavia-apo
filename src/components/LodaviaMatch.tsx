import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Globe, Calendar, Heart, Smile, Send, Plus, Search, 
  MessageSquare, Sliders, UserPlus, Award, Clock, ArrowLeft, Check, 
  X, Shield, Info, MessageCircle, TrendingUp, BookOpen, Terminal, 
  Code, Gamepad2, Dumbbell, Briefcase, Compass, GraduationCap, Video, 
  Phone, MapPin, User, CheckCircle, AlertCircle, Filter, Lock, Settings
} from 'lucide-react';

export interface BuddyProfile {
  id: string;
  name: string;
  nameAr: string;
  age?: number;
  country: string;
  countryAr: string;
  avatar: string;
  languages: string[];
  languagesAr: string[];
  interests: string[];
  interestsAr: string[];
  category: string;
  level: string;
  levelAr: string;
  badges: string[];
  badgesAr: string[];
  compatibilityScore: number;
  isOnline: boolean;
  gender: 'Male' | 'Female';
  communitiesJoined: string[];
  communitiesJoinedAr: string[];
  learningGoals: string;
  learningGoalsAr: string;
  preferredComm: string;
  preferredCommAr: string;
  bio: string;
  bioAr: string;
  explanation: string;
  explanationAr: string;
  iceBreakers: string[];
  iceBreakersAr: string[];
}

interface LumoMatchProps {
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  lang: 'ar' | 'en';
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  setActiveTab: (tab: any) => void;
}

const matchCategories = [
  { id: 'study', label: 'Study Buddy', labelAr: 'شريك الدراسة', icon: BookOpen, color: 'from-blue-600 to-cyan-500' },
  { id: 'language', label: 'Language Buddy', labelAr: 'شريك لغات', icon: Globe, color: 'from-teal-500 to-emerald-400' },
  { id: 'coding', label: 'Coding Buddy', labelAr: 'شريك البرمجة', icon: Code, color: 'from-purple-600 to-indigo-500' },
  { id: 'gaming', label: 'Gaming Buddy', labelAr: 'شريك الألعاب', icon: Gamepad2, color: 'from-pink-500 to-rose-400' },
  { id: 'gym', label: 'Gym Buddy', labelAr: 'شريك الرياضة', icon: Dumbbell, color: 'from-orange-500 to-amber-400' },
  { id: 'business', label: 'Business Partner', labelAr: 'شريك الأعمال', icon: Briefcase, color: 'from-blue-500 to-indigo-600' },
  { id: 'travel', label: 'Travel Buddy', labelAr: 'شريك السفر', icon: Compass, color: 'from-violet-500 to-purple-400' },
  { id: 'mentor', label: 'Mentor', labelAr: 'موجه أكاديمي', icon: GraduationCap, color: 'from-cyan-500 to-blue-600' },
  { id: 'friend', label: 'Friend', labelAr: 'صديق كوني', icon: Smile, color: 'from-emerald-500 to-teal-400' },
];

const mockProfiles: BuddyProfile[] = [
  {
    id: 'b-1',
    name: 'Faisal Al-Zahrani',
    nameAr: 'فيصل الزهراني',
    age: 24,
    country: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    languages: ['Arabic', 'English'],
    languagesAr: ['العربية', 'الإنجليزية'],
    interests: ['React', 'Rust', 'AI', 'SaaS', 'Space'],
    interestsAr: ['ريأكت', 'رست', 'ذكاء اصطناعي', 'برمجيات', 'فضاء'],
    category: 'coding',
    level: 'Advanced',
    levelAr: 'متقدم',
    badges: ['👑 Tech Lead', '🚀 Rust Sage'],
    badgesAr: ['👑 قائد تقني', '🚀 خبير رست'],
    compatibilityScore: 98,
    isOnline: true,
    gender: 'Male',
    communitiesJoined: ['Quantum Developers', 'AI Core Synthetics'],
    communitiesJoinedAr: ['مطوري الكوانتوم', 'مجمع الذكاء الفائق'],
    learningGoals: 'Building Rust based compilers for quantum simulations.',
    learningGoalsAr: 'بناء مترجمات برمجية بلغة Rust للمحاكاة الكوانتية.',
    preferredComm: 'Voice calls and live code pair programming.',
    preferredCommAr: 'المكالمات الصوتية والبرمجة الثنائية المباشرة.',
    bio: 'Systems engineer at Lodavia. Constantly thinking in binary and designing low latency sound waves.',
    bioAr: 'مهندس أنظمة في لودافيا. دائم التفكير باللغة الثنائية وتصميم موجات صوتية عالية الدقة.',
    explanation: 'You both build apps using React, share deep interest in AI, and live in Saudi Arabia.',
    explanationAr: 'كلاكما يطور تطبيقات ريأكت، وتتشاركان الشغف بالذكاء الاصطناعي، وتعيشان في السعودية.',
    iceBreakers: [
      "Ask Faisal about his customized WebAssembly compilers and how they save frame rates.",
      "Both of you are studying AI! Discuss how Gemini models speed up local prototype execution.",
    ],
    iceBreakersAr: [
      "اسأل فيصل عن مترجمات WebAssembly المخصصة لديه وكيفية تسريع معالجة الإطارات.",
      "كلاكما مهتم بالذكاء الاصطناعي! ناقشا كيف تسرع نماذج Gemini بناء النماذج الأولية محلياً.",
    ]
  },
  {
    id: 'b-2',
    name: 'Yuki Tanaka',
    nameAr: 'يوكي تاناكا',
    age: 22,
    country: 'Japan',
    countryAr: 'اليابان',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    languages: ['Japanese', 'English', 'Arabic'],
    languagesAr: ['اليابانية', 'الإنجليزية', 'العربية'],
    interests: ['Languages', 'Anime', 'Travel', 'Art'],
    interestsAr: ['لغات', 'أنمي', 'سفر', 'فنون'],
    category: 'language',
    level: 'Intermediate',
    levelAr: 'متوسط',
    badges: ['🌸 Culture Guru', '✨ Translator'],
    badgesAr: ['🌸 سفير الثقافات', '✨ مترجم معتمد'],
    compatibilityScore: 92,
    isOnline: true,
    gender: 'Female',
    communitiesJoined: ['Language Exchange Hub', 'Cosmic Travelers'],
    communitiesJoinedAr: ['مركز تبادل اللغات', 'مسافرو الفضاء والكون'],
    learningGoals: 'Learning Saudi regional dialects and poetry.',
    learningGoalsAr: 'تعلم اللهجات الإقليمية السعودية وقراءة الشعر العربي الأصيل.',
    preferredComm: 'Voice messages and handwritten exchange.',
    preferredCommAr: 'الرسائل الصوتية المتبادلة والرسائل المكتوبة يدوياً.',
    bio: 'Kyoto native exploring Middle Eastern heritage. Let’s swap languages over warm virtual matcha tea.',
    bioAr: 'من سكان كيوتو، أستكشف التراث الشرق أوسطي. دعونا نتبادل اللغات ونحن نحتسي شاي الماتشا الافتراضي الدافئ.',
    explanation: 'Yuki wants to practice Arabic and you both share a passion for travel, astronomy, and culture.',
    explanationAr: 'ترغب يوكي في ممارسة العربية، وتتشاركان الشغف بالسفر وعلوم الفضاء وعمق الثقافات.',
    iceBreakers: [
      "Yuki is learning Arabic! Swap your favorite local idioms and explain their galactic origins.",
      "Ask her about Kyoto’s stargazing spots and how they view the Milky Way during summer.",
    ],
    iceBreakersAr: [
      "يوكي تتعلم العربية! تبادلا الأمثال الشعبية المفضلة واشرحا أصولها العميقة.",
      "اسألها عن أفضل مواقع مراقبة النجوم في كيوتو وكيف يشاهدون مجرة درب التبانة صيفاً.",
    ]
  },
  {
    id: 'b-3',
    name: 'Sarah Jenkins',
    nameAr: 'سارة جينكينز',
    age: 31,
    country: 'United States',
    countryAr: 'الولايات المتحدة',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    languages: ['English'],
    languagesAr: ['الإنجليزية'],
    interests: ['Startups', 'Marketing', 'UI/UX', 'SaaS'],
    interestsAr: ['شركات ناشئة', 'تسويق', 'تصميم واجهات', 'برمجيات كخدمة'],
    category: 'mentor',
    level: 'Expert',
    levelAr: 'خبير',
    badges: ['🚀 Serial Founder', '🎓 Senior Advisor'],
    badgesAr: ['🚀 مؤسس متسلسل', '🎓 مستشار أول'],
    compatibilityScore: 89,
    isOnline: false,
    gender: 'Female',
    communitiesJoined: ['Business & Founders', 'Design Systems League'],
    communitiesJoinedAr: ['رواد الأعمال والمشاريع', 'رابطة لغات التصميم'],
    learningGoals: 'Scaling regional micro-SaaS systems in GCC.',
    learningGoalsAr: 'توسيع نطاق الأنظمة الرقمية المصغرة في دول الخليج.',
    preferredComm: 'Weekly structured video call syncs.',
    preferredCommAr: 'جلسات تواصل مرئية أسبوعية منظمة.',
    bio: 'Ex-Google Product Designer. Founded two automated design SaaS platforms. Love mentoring upcoming builders.',
    bioAr: 'مصممة منتجات سابقة في جوجل. أسست منصتين لتصميم النظم البرمجية. أعشق توجيه المطورين الطموحين.',
    explanation: 'Sarah matches your goal of learning startup scaling, UI metrics, and design workflow optimizations.',
    explanationAr: 'تتطابق سارة مع طموحك في تعلم تطوير المشاريع الناشئة، تحسين الواجهات، وتدفقات التصميم.',
    iceBreakers: [
      "Ask Sarah for an ex-Google designer perspective on your current portfolio layout.",
      "Discuss how to launch a minimum viable SaaS product with zero marketing budget.",
    ],
    iceBreakersAr: [
      "اطلب من سارة رأي مصممي جوجل السابقين في تصميم ملف أعمالك الحالي.",
      "ناقشا كيفية إطلاق نموذج أولي لمنتج برمجيات مصغر بميزانية تسويقية صفرية.",
    ]
  },
  {
    id: 'b-4',
    name: 'Abdulrahman Al-Enazi',
    nameAr: 'عبدالرحمن العنزي',
    age: 20,
    country: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    languages: ['Arabic', 'English'],
    languagesAr: ['العربية', 'الإنجليزية'],
    interests: ['Gaming', 'Hardware', 'FPS', 'Anime'],
    interestsAr: ['ألعاب رقمية', 'عتاد حاسوبي', 'تصويب تنافسي', 'أنمي'],
    category: 'gaming',
    level: 'Advanced',
    levelAr: 'متقدم',
    badges: ['🏆 Esports Champion', '🎮 FPS Pro'],
    badgesAr: ['🏆 بطل الرياضة الرقمية', '🎮 محترف ألعاب تصويب'],
    compatibilityScore: 94,
    isOnline: true,
    gender: 'Male',
    communitiesJoined: ['E-Sports League', 'Lodavia Gamers Hub'],
    communitiesJoinedAr: ['رابطة الألعاب الرقمية', 'مركز لاعبي لودافيا'],
    learningGoals: 'Custom liquid PC builds and professional e-sports analytics.',
    learningGoalsAr: 'بناء حواسب التبريد المائي المخصصة وتحليلات الألعاب الاحترافية.',
    preferredComm: 'Live Discord channel and co-op gaming.',
    preferredCommAr: 'قنوات الصوت المباشرة واللعب التعاوني المشترك.',
    bio: 'Competitive player in GCC Cosmic Cup 2025. Streaming gameplay daily on the Lodavia Hub.',
    bioAr: 'لاعب تنافسي في كأس لودافيا الخليجي لعام 2025. أبث جولات اللعب يومياً على منصة لودافيا.',
    explanation: 'Both of you live in Saudi Arabia, speak English & Arabic, and enjoy competitive gaming.',
    explanationAr: 'كلاكما يعيش في السعودية، ويتحدث الإنجليزية والعربية، ويستمتع بالألعاب الرقمية التنافسية.',
    iceBreakers: [
      "Challenge Abdulrahman to a 1v1 tactical match in CS3 tournament!",
      "Ask him about his water-cooled PC chassis build and how to keep graphics lag-free.",
    ],
    iceBreakersAr: [
      "تحدّ عبدالرحمن في جولة تكتيكية 1 ضد 1 في بطولة CS3 القادمة!",
      "اسأله عن هيكل كمبيوتر التبريد المائي لديه وكيفية التخلص من تقطّع الرسومات.",
    ]
  },
  {
    id: 'b-5',
    name: 'Noura Al-Mutairi',
    nameAr: 'نورة المطيري',
    age: 26,
    country: 'Kuwait',
    countryAr: 'الكويت',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    languages: ['Arabic', 'English'],
    languagesAr: ['العربية', 'الإنجليزية'],
    interests: ['Fitness', 'Nutrition', 'Yoga', 'Travel'],
    interestsAr: ['رياضة ولياقة', 'تغذية صحية', 'يوغا', 'سفر'],
    category: 'gym',
    level: 'Intermediate',
    levelAr: 'متوسط',
    badges: ['💪 Fitness Coach', '🥗 Meal Planner'],
    badgesAr: ['💪 مدرب لياقة', '🥗 أخصائي تغذية'],
    compatibilityScore: 86,
    isOnline: true,
    gender: 'Female',
    communitiesJoined: ['Sports & Vitality', 'Healthy Living Collective'],
    communitiesJoinedAr: ['الرياضة والحيوية الكونية', 'تجمع الحياة الصحية'],
    learningGoals: 'Calisthenics advanced progressions and high intensity training.',
    learningGoalsAr: 'تمارين الكاليسثينكس المتقدمة وتدريبات التحمل عالية الكثافة.',
    preferredComm: 'Exchanging daily habit logs and voice message notes.',
    preferredCommAr: 'تبادل سجلات العادات اليومية والملاحظات الصوتية السريعة.',
    bio: 'Certified functional fitness instructor. Helping GCC builders maintain posture and stamina.',
    bioAr: 'مدربة لياقة بدنية وظيفية معتمدة. أساعد المطورين في الخليج على تحسين قوامهم ورفع مستوى طاقتهم.',
    explanation: 'You both focus on healthy living, habit tracking, and reside in the GCC region.',
    explanationAr: 'كلاكما يركز على نمط الحياة الصحي، وتتبع العادات اليومية، وتعيشان في الخليج العربي.',
    iceBreakers: [
      "Ask Noura for a quick 5-minute stretching routine designed specifically for software engineers sitting all day.",
      "Discuss your favorite protein-packed breakfast recipe for high mental clarity.",
    ],
    iceBreakersAr: [
      "اطلب من نورة روتين إطالة سريع لمدة 5 دقائق مصمم خصيصاً لمطوري البرمجيات الذين يجلسون طويلاً.",
      "ناقشا وجبة الإفطار المفضلة الغنية بالبروتين لزيادة التركيز والصفاء الذهني.",
    ]
  },
  {
    id: 'b-6',
    name: 'Michael Schmitt',
    nameAr: 'مايكل شميت',
    age: 35,
    country: 'Germany',
    countryAr: 'ألمانيا',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    languages: ['German', 'English'],
    languagesAr: ['الألمانية', 'الإنجليزية'],
    interests: ['TypeScript', 'Node.js', 'Docker', 'AWS', 'PostgreSQL'],
    interestsAr: ['تايب سكريبت', 'نود جي إس', 'دوكر', 'سحابة AWS', 'بوستجرس'],
    category: 'coding',
    level: 'Expert',
    levelAr: 'خبير',
    badges: ['⚙️ Cloud Architect', '⚡ DevOps Master'],
    badgesAr: ['⚙️ مهندس سحابي', '⚡ خبير DevOps'],
    compatibilityScore: 81,
    isOnline: false,
    gender: 'Male',
    communitiesJoined: ['Quantum Developers', 'DevOps & Scalability'],
    communitiesJoinedAr: ['مطوري الكوانتوم', 'إدارة السيرفرات والتوسع'],
    learningGoals: 'Edge latency optimizations and decentralized database replication.',
    learningGoalsAr: 'تحسين أداء حوسبة الحافة وتكرار قواعد البيانات اللامركزية.',
    preferredComm: 'GitHub pull request comments and async text logs.',
    preferredCommAr: 'تعليقات مراجعة الكود على GitHub والدردشة النصية غير المتزامنة.',
    bio: 'Backend tech lead at a smart auto system company. Loves robust structures and Docker containers.',
    bioAr: 'قائد تقني للأنظمة الخلفية في شركة أنظمة ذكية للسيارات. عاشق للبنية التحتية الصلبة وحاويات دوكر.',
    explanation: 'Michael fits your goal of mastering scalable backends, Node.js, and server optimizations.',
    explanationAr: 'يتطابق مايكل مع رغبتك في احتراف الأنظمة الخلفية القابلة للتوسع وإعدادات السيرفرات.',
    iceBreakers: [
      "Michael is an expert in DevOps. Ask him for a tip on dockerizing multi-container React architectures.",
      "Discuss standard indexing methodologies for highly queried relational database schemas.",
    ],
    iceBreakersAr: [
      "مايكل خبير في DevOps. اسأله عن أفضل طريقة لتعبئة تطبيقات ريأكت في حاويات Docker متعددة الحواف.",
      "ناقشا طرق الفهرسة القياسية لتسريع استعلامات قواعد البيانات المتكررة.",
    ]
  },
  {
    id: 'b-7',
    name: 'Lina Mansour',
    nameAr: 'لينا منصور',
    age: 25,
    country: 'UAE',
    countryAr: 'الإمارات العربية المتحدة',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    languages: ['Arabic', 'English', 'French'],
    languagesAr: ['العربية', 'الإنجليزية', 'الفرنسية'],
    interests: ['Travel', 'Astronomy', 'Photography', 'Art'],
    interestsAr: ['سفر', 'علم الفلك', 'تصوير فوتوغرافي', 'فنون'],
    category: 'travel',
    level: 'Intermediate',
    levelAr: 'متوسط',
    badges: ['📸 Astro Shot', '✈️ Global Nomad'],
    badgesAr: ['📸 مصورة فلكية', '✈️ رحالة دولي'],
    compatibilityScore: 88,
    isOnline: true,
    gender: 'Female',
    communitiesJoined: ['Cosmic Travelers', 'Photography League'],
    communitiesJoinedAr: ['مسافرو الفضاء والكون', 'رابطة هواة التصوير'],
    learningGoals: 'Deep space photography and long exposure camera configs.',
    learningGoalsAr: 'تصوير أعماق الفضاء الخارجي وإعدادات التعريض الطويل للكاميرا.',
    preferredComm: 'Sharing photos and spatial ideas via visual chat boards.',
    preferredCommAr: 'مشاركة الصور ومقاطع الفضاء عبر لوحات المحادثة المرئية.',
    bio: 'Capturing the core of the Milky Way from quiet desert dunes. Constantly searching for dark skies.',
    bioAr: 'ألتقط صوراً لنواة مجرة درب التبانة من الكثبان الصحراوية الهادئة. في بحث مستمر عن بقع السماء المظلمة.',
    explanation: 'Lina shares your dual interest in astronomy, landscape photography, and speak English & Arabic.',
    explanationAr: 'تتشارك لينا معك نفس الشغف بالفلك والتصوير الليلي، وتتحدث الإنجليزية والعربية.',
    iceBreakers: [
      "Ask Lina what camera settings are best for capturing the details of the Andromeda galaxy.",
      "Discuss the most scenic and dark desert valleys in Saudi Arabia and UAE for stargazing.",
    ],
    iceBreakersAr: [
      "اسأل لينا عن إعدادات الكاميرا الأنسب لالتقاط تفاصيل مجرة أندروميدا البعيدة.",
      "ناقشا أفضل الأودية الصحراوية المظلمة في السعودية والإمارات لمراقبة النجوم المذهلة.",
    ]
  },
  {
    id: 'b-8',
    name: 'Amir Al-Otaibi',
    nameAr: 'أمير العتيبي',
    age: 28,
    country: 'Saudi Arabia',
    countryAr: 'المملكة العربية السعودية',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    languages: ['Arabic', 'English'],
    languagesAr: ['العربية', 'الإنجليزية'],
    interests: ['Startups', 'SaaS', 'AI', 'NoCode', 'Fintech'],
    interestsAr: ['مشاريع ناشئة', 'برمجيات سحابية', 'ذكاء اصطناعي', 'بدون كود', 'تقنيات مالية'],
    category: 'business',
    level: 'Advanced',
    levelAr: 'متقدم',
    badges: ['💼 SaaS Hacker', '🔥 Fintech Lead'],
    badgesAr: ['💼 مطور برمجيات سحابية', '🔥 رائد تقنيات مالية'],
    compatibilityScore: 95,
    isOnline: true,
    gender: 'Male',
    communitiesJoined: ['Business & Founders', 'AI Core Synthetics'],
    communitiesJoinedAr: ['رواد الأعمال والمشاريع', 'مجمع الذكاء الفائق'],
    learningGoals: 'Leveraging Gemini model APIs for fintech regulatory automation.',
    learningGoalsAr: 'استغلال واجهات برمجية نماذج Gemini في أتمتة الأنظمة التنظيمية للتقنيات المالية.',
    preferredComm: 'Dynamic whiteboard collaboration and voice calls.',
    preferredCommAr: 'جلسات تواصل صوتية تفاعلية مع لوحات بيضاء للعصف الذهني.',
    bio: 'Developing micro-SaaS tools for eCommerce automation. Constantly validating regional product ideas.',
    bioAr: 'أطور أدوات برمجية مصغرة لأتمتة التجارة الإلكترونية. في بحث دائم لاختبار الأفكار الريادية في المنطقة.',
    explanation: 'Both of you live in Saudi Arabia, share passion for AI API products, and focus on SaaS startups.',
    explanationAr: 'كلاكما في السعودية، وتتشاركان نفس الشغف ببناء منتجات الذكاء الاصطناعي وتأسيس الشركات التقنية.',
    iceBreakers: [
      "Amir builds micro-SaaS tools. Brainstorm 3 AI SaaS ideas that could serve businesses in Riyadh today!",
      "Discuss how to rapidly prototype and validate eCommerce ideas using standard NoCode layers.",
    ],
    iceBreakersAr: [
      "أمير يبني برمجيات مصغرة. اعصفا ذهنياً لـ 3 أفكار ذكاء اصطناعي لخدمة الشركات في الرياض اليوم!",
      "ناقشا أفضل سبل بناء النماذج الأولية السريعة والتحقق من أفكار التجارة الإلكترونية باستخدام أدوات الـ NoCode.",
    ]
  }
];

const saudiCities = [
  { id: 'Riyadh', label: 'Riyadh', labelAr: 'الرياض' },
  { id: 'Jeddah', label: 'Jeddah', labelAr: 'جدة' },
  { id: 'Dammam', label: 'Dammam', labelAr: 'الدمام' },
  { id: 'Makkah', label: 'Makkah', labelAr: 'مكة المكرمة' },
  { id: 'Medina', label: 'Medina', labelAr: 'المدينة المنورة' }
];

export default function LumoMatch({ 
  currentUser, 
  setCurrentUser, 
  lang, 
  playSynthSound,
  setActiveTab
}: LumoMatchProps) {

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>('study');
  
  // Interactive Scanning States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [radarRotation, setRadarRotation] = useState<number>(0);
  const [scannedProfiles, setScannedProfiles] = useState<BuddyProfile[]>([]);

  // Filter States
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterLanguage, setFilterLanguage] = useState<string>('All');
  const [filterInterest, setFilterInterest] = useState<string>('All');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterOnlineOnly, setFilterOnlineOnly] = useState<boolean>(false);
  const [minCompatibility, setMinCompatibility] = useState<number>(70);

  // Connection/Interactions State
  const [connections, setConnections] = useState<string[]>([]); // profile IDs connected
  const [selectedProfileForIcebreakers, setSelectedProfileForIcebreakers] = useState<BuddyProfile | null>(null);
  const [activeChatProfile, setActiveChatProfile] = useState<BuddyProfile | null>(null);
  const [customMessages, setCustomMessages] = useState<Array<{ sender: 'me' | 'them'; text: string; time: string }>>([]);
  const [messageText, setMessageText] = useState('');
  const [profileDetail, setProfileDetail] = useState<BuddyProfile | null>(null);

  // Active Call States (Voice / Video)
  const [activeCall, setActiveCall] = useState<{ profile: BuddyProfile; type: 'voice' | 'video'; status: 'calling' | 'connected' | 'ended' } | null>(null);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [isCallMuted, setIsCallMuted] = useState<boolean>(false);

  // Custom Safety / Privacy Settings
  const [privacyVisible, setPrivacyVisible] = useState<boolean>(true);
  const [privacySameGender, setPrivacySameGender] = useState<boolean>(false);
  const [privacyHideScore, setPrivacyHideScore] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<BuddyProfile | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState<BuddyProfile | null>(null);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifiedApplied, setVerifiedApplied] = useState<boolean>(false);
  const [userVerified, setUserVerified] = useState<boolean>(false);

  // AI Prompt Goal search
  const [aiPromptGoal, setAiPromptGoal] = useState<string>('');
  const [aiPromptExplanation, setAiPromptExplanation] = useState<{ en: string; ar: string } | null>(null);

  // Initial Scan setup
  useEffect(() => {
    handleTriggerScan();
  }, [activeCategory]);

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
        // Play very quiet ambient clicking sound representing connected node
        if (Math.random() > 0.8) {
          playSynthSound(300, 'sine', 0.01);
        }
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setAiPromptExplanation(null);
    playSynthSound(440, 'sine', 0.15);
    setTimeout(() => playSynthSound(554, 'sine', 0.15), 100);
    setTimeout(() => playSynthSound(659, 'sine', 0.25), 200);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          playSynthSound(880, 'sine', 0.2);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Run filtering on mock profiles
  const getFilteredProfiles = () => {
    return mockProfiles.filter(profile => {
      // Category match
      const categoryMatch = profile.category === activeCategory;
      
      // Blocked match
      if (blockedIds.includes(profile.id)) return false;

      // Online match
      if (filterOnlineOnly && !profile.isOnline) return false;

      // Gender privacy match
      if (privacySameGender && profile.gender !== currentUser.gender) return false;

      // Filter state matches
      if (filterCountry !== 'All' && profile.country !== filterCountry) return false;
      if (filterLanguage !== 'All' && !profile.languages.includes(filterLanguage)) return false;
      if (filterLevel !== 'All' && profile.level !== filterLevel) return false;
      if (filterGender !== 'All' && profile.gender !== filterGender) return false;
      if (filterInterest !== 'All' && !profile.interests.includes(filterInterest)) return false;

      // Compatibility score match
      if (profile.compatibilityScore < minCompatibility) return false;

      return categoryMatch;
    });
  };

  // Simulate prompt-based AI search
  const handleAISearchPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptGoal.trim()) return;

    setIsScanning(true);
    setScanProgress(0);
    playSynthSound(600, 'triangle', 0.1);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          const text = aiPromptGoal.toLowerCase();
          let explanationEn = '';
          let explanationAr = '';

          if (text.includes('rust') || text.includes('رست') || text.includes('coding') || text.includes('برمجة')) {
            setActiveCategory('coding');
            explanationEn = `Lodavia AI identified Faisal Al-Zahrani and Michael Schmitt as quantum node compilers matching "${aiPromptGoal}".`;
            explanationAr = `حدد ذكاء لودافيا كلاً من فيصل الزهراني ومايكل شميت كعقد تطوير برمجية كوانتية متطابقة مع "${aiPromptGoal}".`;
          } else if (text.includes('japan') || text.includes('ياباني') || text.includes('لغة') || text.includes('language')) {
            setActiveCategory('language');
            explanationEn = `Lodavia AI located Yuki Tanaka who speaks Japanese, Arabic and is specialized in cultural language exchanges.`;
            explanationAr = `عثر ذكاء لودافيا على يوكي تاناكا التي تتحدث اليابانية والعربية والمتخصصة في التبادل الثقافي اللغوي.`;
          } else if (text.includes('business') || text.includes('ريادة') || text.includes('saa') || text.includes('شركة')) {
            setActiveCategory('business');
            explanationEn = `Lodavia AI highlighted Amir Al-Otaibi and Sarah Jenkins who are scaling micro-SaaS structures and managing VC funds.`;
            explanationAr = `أظهر ذكاء لودافيا كلاً من أمير العتيبي وسارة جينكينز المتخصصين في بناء المشاريع السحابية وإدارتها.`;
          } else {
            // Pick a random category
            const randomCat = matchCategories[Math.floor(Math.random() * matchCategories.length)];
            setActiveCategory(randomCat.id);
            explanationEn = `Lodavia AI matched your parameters with active members in the "${randomCat.label}" cosmic orbit.`;
            explanationAr = `قام ذكاء لودافيا بمطابقة معاييرك مع الأعضاء النشطين في المدار الفلكي لـ "${randomCat.labelAr}".`;
          }

          setAiPromptExplanation({ en: explanationEn, ar: explanationAr });
          playSynthSound(1046, 'sine', 0.25);
          return 100;
        }
        return prev + 8;
      });
    }, 120);
  };

  const handleConnect = (profile: BuddyProfile) => {
    const isConnected = connections.includes(profile.id);
    if (isConnected) {
      // Disconnect
      setConnections(prev => prev.filter(id => id !== profile.id));
      playSynthSound(400, 'sawtooth', 0.15);
    } else {
      // Connect
      setConnections(prev => [...prev, profile.id]);
      playSynthSound(800, 'sine', 0.15);
      setTimeout(() => playSynthSound(1200, 'sine', 0.25), 100);
      
      // Auto open Ice Breakers panel
      setSelectedProfileForIcebreakers(profile);
    }
  };

  const handleSimulateCall = (profile: BuddyProfile, type: 'voice' | 'video') => {
    playSynthSound(600, 'sine', 0.1);
    setActiveCall({ profile, type, status: 'calling' });

    // Simulate ringtone
    const ringTone = setInterval(() => {
      playSynthSound(440, 'sine', 0.3);
      setTimeout(() => playSynthSound(440, 'sine', 0.3), 400);
    }, 2000);

    // Connected after 3.5 seconds
    setTimeout(() => {
      clearInterval(ringTone);
      setActiveCall(prev => {
        if (prev && prev.status === 'calling') {
          playSynthSound(900, 'sine', 0.2);
          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 3500);
  };

  const handleEndCall = () => {
    playSynthSound(300, 'sawtooth', 0.2);
    setActiveCall(prev => prev ? { ...prev, status: 'ended' } : null);
    setTimeout(() => {
      setActiveCall(null);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChatProfile) return;

    playSynthSound(800, 'sine', 0.05);
    const newMsg = { sender: 'me' as const, text: messageText, time: 'Now' };
    setCustomMessages(prev => [...prev, newMsg]);
    const typedText = messageText;
    setMessageText('');

    // Simulate smart AI buddy typing a custom response back after 2 seconds
    setTimeout(() => {
      playSynthSound(500, 'triangle', 0.05);
      let replyText = '';
      if (lang === 'ar') {
        replyText = `أهلاً بك! لقد سررت برؤية تطابقنا بنسبة عالية. دعنا نتعاون ونتعلم معاً قريباً!`;
      } else {
        replyText = `Hey there! Excited to see our matching compatibility score. Let's sync up and collaborate soon!`;
      }
      setCustomMessages(prev => [...prev, { sender: 'them', text: replyText, time: 'Just now' }]);
    }, 2000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReportModal) return;

    playSynthSound(300, 'sawtooth', 0.2);
    alert(lang === 'ar' ? `تم إرسال بلاغك السري للجنة السلامة الكونية لمراجعة حساب ${showReportModal.nameAr}. شكراً لحماية مجتمعنا.` : `Your confidential report was filed with the safety board. Thank you for protecting Lodavia.`);
    setShowReportModal(null);
  };

  const handleBlockConfirmSubmit = () => {
    if (!showBlockConfirm) return;

    playSynthSound(250, 'sawtooth', 0.25);
    setBlockedIds(prev => [...prev, showBlockConfirm.id]);
    alert(lang === 'ar' ? `تم حظر ${showBlockConfirm.nameAr} بنجاح ولن يظهر في مداراتك الصوتية والبحثية.` : `${showBlockConfirm.name} has been successfully blocked.`);
    setShowBlockConfirm(null);
    if (profileDetail?.id === showBlockConfirm.id) setProfileDetail(null);
  };

  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifiedApplied(true);
    playSynthSound(1000, 'sine', 0.15);
    setTimeout(() => playSynthSound(1300, 'sine', 0.25), 100);

    setTimeout(() => {
      setUserVerified(true);
      setShowVerifyModal(false);
      alert(lang === 'ar' ? 'تهانينا! تمت مراجعة حسابك تلقائياً وحصلت على شارة التوثيق الفضية 🛡️✨' : 'Congratulations! Your profile has been verified with the cosmic shield badge 🛡️✨');
    }, 3000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const displayProfiles = getFilteredProfiles();

  return (
    <div className="w-full text-slate-100 flex flex-col min-h-[75vh] pb-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0a0a14] to-purple-950/40 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        
        <div className="relative z-10 flex items-start gap-4 flex-1">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-lg animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'مطابقة لودافيا الذكية 🪐' : 'Lodavia Match 🪐'}</span>
              {userVerified && (
                <span title="Verified User">
                  <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {lang === 'ar' 
                ? 'استكشف المدارات الكونية وابحث عن شركاء الدراسة، البرمجة، الألعاب واللغات بذكاء فائق يستند للتوافق الشخصي والخلفية العلمية.'
                : 'Discover and connect with your perfect study, language, coding, or gaming match based on cognitive compatibility, interest overlays, and communication styles.'}
            </p>
          </div>
        </div>

        {/* Action button to open verification */}
        <div className="flex gap-2.5 w-full md:w-auto z-10">
          <button
            onClick={() => {
              playSynthSound(700, 'sine', 0.05);
              setShowVerifyModal(true);
            }}
            className="w-full md:w-auto px-4.5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'توثيق الحساب 🛡️' : 'Verify Account 🛡️'}</span>
          </button>
        </div>
      </div>

      {/* AI RADAR SCANNER ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: AI Prompt Bar & Radar Grid (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Prompt Input Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0a0a0f]/80 flex flex-col gap-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'محرك البحث الكوني من Lodavia AI 🤖' : 'Lodavia AI Cosmic Prompt Search 🤖'}</span>
            </h3>
            
            <form onSubmit={handleAISearchPrompt} className="flex gap-2">
              <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input 
                  type="text"
                  value={aiPromptGoal}
                  onChange={(e) => setAiPromptGoal(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: ابحث عن شريك لتعلم لغة رست وممارسة الإنجليزية...' : 'e.g. Find me a mentor for React scaling who speaks Arabic...'}
                  className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 w-full px-2"
                />
              </div>
              <button 
                type="submit"
                className="px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer"
              >
                {lang === 'ar' ? 'طابقني ⚡' : 'Match Me ⚡'}
              </button>
            </form>
            
            {aiPromptExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-cyan-500/5 border border-cyan-400/20 text-[10px] text-cyan-300 flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{lang === 'ar' ? aiPromptExplanation.ar : aiPromptExplanation.en}</p>
              </motion.div>
            )}
          </div>

          {/* Interactive Radar Screen */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden aspect-square">
            
            {/* Spinning sweeps */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-4/5 rounded-full border border-dashed border-white/5" />
              <div className="w-3/5 h-3/5 rounded-full border border-dashed border-white/5" />
              <div className="w-2/5 h-2/5 rounded-full border border-dashed border-cyan-500/10" />
              <div className="w-1/5 h-1/5 rounded-full border border-cyan-500/20 bg-cyan-500/5" />
            </div>

            {/* Radar swept lines */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute w-full h-full border-l border-cyan-500/30 origin-center pointer-events-none bg-gradient-to-r from-cyan-500/10 to-transparent"
                  style={{ borderRadius: '50%' }}
                />
              )}
            </AnimatePresence>

            {/* Orbiting Avatar nodes */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {mockProfiles.slice(0, 5).map((profile, idx) => {
                const angle = (idx * 72 * Math.PI) / 180;
                const distance = 100 + (idx % 2 === 0 ? 30 : -20);
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.div 
                    key={profile.id}
                    className="absolute w-10 h-10 rounded-full border-2 border-cyan-400/40 p-0.5 bg-slate-950 overflow-hidden shadow-lg shadow-cyan-500/10"
                    style={{ x, y }}
                    animate={isScanning ? { scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] } : {}}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.4 }}
                  >
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                  </motion.div>
                );
              })}
            </div>

            {/* Central scanning state display */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 animate-pulse flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>

              {isScanning ? (
                <div>
                  <h4 className="text-xs font-black text-cyan-400 animate-pulse uppercase tracking-wider">
                    {lang === 'ar' ? 'جاري فحص المدارات الكونية...' : 'Scanning Cosmic Nodes...'}
                  </h4>
                  <div className="w-40 bg-white/10 h-1 rounded-full overflow-hidden mt-2 mx-auto">
                    <motion.div 
                      className="bg-cyan-400 h-full" 
                      initial={{ width: '0%' }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'ar' ? 'الرادار الكوني نشط' : 'Cosmic Radar Online'}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                    {lang === 'ar' 
                      ? 'حدد تصنيفاً للبحث عن شركاء، أو استخدم شريط التوافق لتصفية العقد.' 
                      : 'Select a category or prompt to align matching compatibility parameters.'}
                  </p>
                  <button 
                    onClick={handleTriggerScan}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-cyan-400 cursor-pointer"
                  >
                    {lang === 'ar' ? 'إعادة الفحص والمسح 🔄' : 'Re-Scan Channels 🔄'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Safety Quick Controller */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0a0a0f]/80 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'إعدادات الخصوصية والأمان 🛡️' : 'Privacy & Safety Controls 🛡️'}</span>
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-300">{lang === 'ar' ? 'الظهور في رادار المطابقة الكونية' : 'Visible in Match Radar'}</span>
                <input 
                  type="checkbox" 
                  checked={privacyVisible}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacyVisible(e.target.checked);
                  }}
                  className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-300">{lang === 'ar' ? 'مطابقة من نفس الجنس فقط' : 'Same-Gender Matching Only'}</span>
                <input 
                  type="checkbox" 
                  checked={privacySameGender}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacySameGender(e.target.checked);
                  }}
                  className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-slate-300">{lang === 'ar' ? 'إخفاء نسبة التوافق في البطاقات' : 'Hide Compatibility Score'}</span>
                <input 
                  type="checkbox" 
                  checked={privacyHideScore}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacyHideScore(e.target.checked);
                  }}
                  className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Categories tab, filters, matched profiles (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Match categories grids */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {matchCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.04);
                    setActiveCategory(cat.id);
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 text-cyan-300 shadow-md scale-105'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400'
                  }`}
                  title={lang === 'ar' ? cat.labelAr : cat.label}
                >
                  <IconComponent className={`w-5 h-5 ${isSelected ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
                  <span className="text-[9px] font-black tracking-tight text-center line-clamp-1">
                    {lang === 'ar' ? cat.labelAr : cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filtering Tools Row */}
          <div className="glass-panel p-4.5 rounded-3xl border border-white/10 bg-[#0a0a0f]/80 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  playSynthSound(600, 'sine', 0.05);
                  setShowFilters(!showFilters);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'فلاتر المطابقة الفائقة ⚙️' : 'Advanced Match Filters ⚙️'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{lang === 'ar' ? 'الحد الأدنى للتوافق:' : 'Min Compatibility:'}</span>
                <input 
                  type="range" 
                  min="60" 
                  max="95" 
                  value={minCompatibility} 
                  onChange={(e) => {
                    playSynthSound(450, 'sine', 0.02);
                    setMinCompatibility(parseInt(e.target.value));
                  }}
                  className="w-24 accent-cyan-400 h-1 bg-white/20 rounded-lg appearance-none" 
                />
                <span className="text-xs font-black text-cyan-400">{minCompatibility}%</span>
              </div>
            </div>

            {/* Expandable Filters Tray */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-white/5"
                >
                  {/* Filter Country */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الدولة والمنطقة' : 'Country'}</span>
                    <select 
                      value={filterCountry} 
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">{lang === 'ar' ? 'الكل' : 'All Countries'}</option>
                      <option value="Saudi Arabia">{lang === 'ar' ? 'السعودية' : 'Saudi Arabia'}</option>
                      <option value="UAE">{lang === 'ar' ? 'الإمارات' : 'UAE'}</option>
                      <option value="Kuwait">{lang === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                      <option value="Japan">{lang === 'ar' ? 'اليابان' : 'Japan'}</option>
                      <option value="United States">{lang === 'ar' ? 'أمريكا' : 'United States'}</option>
                      <option value="Germany">{lang === 'ar' ? 'ألمانيا' : 'Germany'}</option>
                    </select>
                  </div>

                  {/* Filter Language */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'اللغة المشتركة' : 'Language'}</span>
                    <select 
                      value={filterLanguage} 
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">{lang === 'ar' ? 'الكل' : 'All Languages'}</option>
                      <option value="Arabic">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
                      <option value="English">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
                      <option value="Japanese">{lang === 'ar' ? 'اليابانية' : 'Japanese'}</option>
                      <option value="German">{lang === 'ar' ? 'الألمانية' : 'German'}</option>
                    </select>
                  </div>

                  {/* Filter Skill Level */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'المستوى المعرفي' : 'Skill Level'}</span>
                    <select 
                      value={filterLevel} 
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">{lang === 'ar' ? 'الكل' : 'All Levels'}</option>
                      <option value="Expert">{lang === 'ar' ? 'خبير' : 'Expert'}</option>
                      <option value="Advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
                      <option value="Intermediate">{lang === 'ar' ? 'متوسط' : 'Intermediate'}</option>
                    </select>
                  </div>

                  {/* Filter Interest */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الاهتمام الأساسي' : 'Key Interest'}</span>
                    <select 
                      value={filterInterest} 
                      onChange={(e) => setFilterInterest(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">{lang === 'ar' ? 'الكل' : 'All Interests'}</option>
                      <option value="AI">{lang === 'ar' ? 'الذكاء الاصطناعي' : 'AI'}</option>
                      <option value="React">{lang === 'ar' ? 'ريأكت' : 'React'}</option>
                      <option value="Rust">{lang === 'ar' ? 'لغة رست' : 'Rust'}</option>
                      <option value="Gaming">{lang === 'ar' ? 'الألعاب' : 'Gaming'}</option>
                      <option value="Fitness">{lang === 'ar' ? 'اللياقة البدنية' : 'Fitness'}</option>
                      <option value="Travel">{lang === 'ar' ? 'السفر' : 'Travel'}</option>
                    </select>
                  </div>

                  {/* Filter Online Only Switch */}
                  <div className="flex items-center justify-between sm:col-span-2 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input 
                        type="checkbox"
                        checked={filterOnlineOnly}
                        onChange={(e) => {
                          playSynthSound(500, 'sine', 0.05);
                          setFilterOnlineOnly(e.target.checked);
                        }}
                        className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <span>{lang === 'ar' ? 'إظهار الأعضاء المتصلين بالإنترنت حالياً فقط 🟢' : 'Show online users only 🟢'}</span>
                    </label>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Matched user lists cards */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>
                {lang === 'ar' 
                  ? `العقد المتطابقة المتوفرة (${displayProfiles.length})` 
                  : `Compatible Cosmic Matches Found (${displayProfiles.length})`}
              </span>
            </h3>

            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                <p className="text-xs text-slate-500 animate-pulse">{lang === 'ar' ? 'جاري جلب ملفات التوافق الكوانتي...' : 'Synthesizing compatible cosmic profiles...'}</p>
              </div>
            ) : displayProfiles.length === 0 ? (
              <div className="glass-panel p-12 text-center text-slate-500 rounded-3xl text-xs border border-white/5">
                {lang === 'ar' 
                  ? 'لم يتم العثور على شركاء يطابقون الفلاتر المحددة حالياً. حاول تعديل النطاق أو الفئة.' 
                  : 'No buddies found matching your current filter specs. Try expanding interests or compatibility score.'}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {displayProfiles.map((profile) => {
                  const isConnected = connections.includes(profile.id);
                  return (
                    <motion.div 
                      key={profile.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-5 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0c16] to-black/90 hover:border-cyan-500/25 transition-all flex flex-col md:flex-row gap-5 justify-between relative group"
                    >
                      {/* Left: Avatar, Name, Country, Badges, compatibility */}
                      <div className="flex gap-4">
                        <div className="relative">
                          {/* Pulsing online marker */}
                          {profile.isOnline && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0c16] z-10 animate-pulse" />
                          )}
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-cyan-400/40 transition-colors">
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                              {lang === 'ar' ? profile.nameAr : profile.name}
                            </h4>
                            {profile.age && (
                              <span className="text-[10px] text-slate-400 font-bold">({profile.age})</span>
                            )}
                            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-black tracking-widest uppercase flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{lang === 'ar' ? profile.countryAr : profile.country}</span>
                            </span>
                          </div>

                          {/* Matching summary explanation from Lodavia AI */}
                          <div className="mt-2 p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[10px] text-purple-300 flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium">
                              {lang === 'ar' ? profile.explanationAr : profile.explanation}
                            </p>
                          </div>

                          {/* Key parameters row */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {(lang === 'ar' ? profile.interestsAr : profile.interests).map((interest, i) => (
                              <span key={i} className="text-[9px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-1 rounded-lg">
                                #{interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Compatibility score & quick actions */}
                      <div className="flex flex-col justify-between items-end gap-4 min-w-[140px] border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        
                        {!privacyHideScore && (
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">{lang === 'ar' ? 'التوافق الكوني' : 'Cosmic Match'}</span>
                            <span className="text-lg font-black text-gradient bg-gradient-to-r from-cyan-400 to-purple-400">
                              {profile.compatibilityScore}%
                            </span>
                          </div>
                        )}

                        {/* Action buttons row */}
                        <div className="flex gap-1.5 w-full flex-wrap justify-end">
                          
                          {/* Connect Button */}
                          <button
                            onClick={() => handleConnect(profile)}
                            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              isConnected 
                                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' 
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                            }`}
                          >
                            {isConnected ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                            <span>{isConnected ? (lang === 'ar' ? 'متصل' : 'Connected') : (lang === 'ar' ? 'تواصل' : 'Connect')}</span>
                          </button>

                          {/* Quick Message */}
                          <button
                            onClick={() => {
                              playSynthSound(600, 'sine', 0.05);
                              setActiveChatProfile(profile);
                              setCustomMessages([
                                { sender: 'them', text: lang === 'ar' ? `مرحباً! لقد تطابقنا في ${activeCategory === 'coding' ? 'البرمجة' : 'الدراسة'}. هل أنت متفرغ للتواصل؟` : `Hi! We matched in ${activeCategory}. Are you free to collaborate?`, time: '10 mins ago' }
                              ]);
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                            title={lang === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Video call */}
                          <button
                            onClick={() => handleSimulateCall(profile, 'video')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                            title={lang === 'ar' ? 'اتصال مرئي' : 'Video Call'}
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>

                          {/* Profile detail */}
                          <button
                            onClick={() => {
                              playSynthSound(650, 'sine', 0.05);
                              setProfileDetail(profile);
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                            title={lang === 'ar' ? 'عرض الملف' : 'View Profile'}
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL 1: AI ICEBREAKERS */}
      <AnimatePresence>
        {selectedProfileForIcebreakers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass-panel border border-cyan-500/30 bg-[#09090f]/95 p-6 flex flex-col gap-5 relative shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              <button 
                onClick={() => setSelectedProfileForIcebreakers(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-purple-600">
                  <img src={selectedProfileForIcebreakers.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {lang === 'ar' ? `تم الاتصال مع ${selectedProfileForIcebreakers.nameAr} 🎉` : `Connected with ${selectedProfileForIcebreakers.name} 🎉`}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-bold">{lang === 'ar' ? 'تم تأسيس الاتصال الكمي بنجاح!' : 'Quantum link successfully aligned!'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-black">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'مواضيع بدء النقاش المقترحة من Lodavia AI:' : 'Lodavia AI generated conversation starters:'}</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {(lang === 'ar' ? selectedProfileForIcebreakers.iceBreakersAr : selectedProfileForIcebreakers.iceBreakers).map((starters, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-200 leading-relaxed italic">
                      "{starters}"
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProfileForIcebreakers(null);
                    setActiveChatProfile(selectedProfileForIcebreakers);
                    setCustomMessages([
                      { sender: 'me', text: lang === 'ar' ? 'مرحباً! سعيد بالاتصال بك.' : 'Hey! Glad we connected.', time: 'Now' }
                    ]);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-center"
                >
                  {lang === 'ar' ? 'ابدأ المحادثة الآن 💬' : 'Start Text Chat 💬'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: HIGH FIDELITY CALL OVERLAY */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-panel border border-white/10 bg-[#08080c] p-8 flex flex-col items-center justify-center text-center gap-6 relative shadow-[0_0_60px_rgba(168,85,247,0.15)]"
            >
              <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeCall.type === 'voice' ? 'Audio call' : 'Video call'}
              </div>

              {/* Glowing Call wave circles */}
              <div className="relative flex items-center justify-center w-36 h-36">
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-purple-500/10 animate-ping [animation-delay:0.5s]" />
                <div className="w-24 h-24 rounded-full border-4 border-cyan-400 p-1 overflow-hidden z-10 relative">
                  <img src={activeCall.profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  {lang === 'ar' ? activeCall.profile.nameAr : activeCall.profile.name}
                </h3>
                <span className="text-xs text-slate-400 block mt-1">
                  {activeCall.status === 'calling' && (lang === 'ar' ? 'جاري الاتصال بالعقدة...' : 'Connecting virtual channel...')}
                  {activeCall.status === 'connected' && (lang === 'ar' ? 'الاتصال نشط ومؤمن 🔒' : 'Secure quantum connection active 🔒')}
                  {activeCall.status === 'ended' && (lang === 'ar' ? 'تم إنهاء المكالمة' : 'Call finished')}
                </span>
              </div>

              {/* Timer when connected */}
              {activeCall.status === 'connected' && (
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(callTimer)}</span>
                </div>
              )}

              {/* Interactive bounce equalizer during live calls */}
              {activeCall.status === 'connected' && (
                <div className="flex items-end justify-center gap-1 h-6">
                  {[1, 2, 3, 4, 5, 6, 7].map(val => (
                    <motion.div 
                      key={val}
                      className="w-1 bg-cyan-400 rounded-full"
                      animate={{ height: [4, 24, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6 + val * 0.1, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              )}

              {/* Call Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setIsCallMuted(!isCallMuted);
                  }}
                  className={`p-4 rounded-full transition-all cursor-pointer ${isCallMuted ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}
                >
                  <Phone className="w-5 h-5 rotate-135" />
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PRIVATE TEXT CHAT PANEL */}
      <AnimatePresence>
        {activeChatProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg h-[500px] rounded-3xl glass-panel border border-white/10 bg-[#07070a]/95 flex flex-col justify-between overflow-hidden relative shadow-2xl"
            >
              {/* Header */}
              <div className="p-4.5 border-b border-white/5 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={activeChatProfile.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {lang === 'ar' ? activeChatProfile.nameAr : activeChatProfile.name}
                    </h4>
                    <span className="text-[9px] text-slate-400">
                      {activeChatProfile.isOnline ? (lang === 'ar' ? 'متصل بالإنترنت' : 'Online') : (lang === 'ar' ? 'غير متصل' : 'Offline')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      handleSimulateCall(activeChatProfile, 'voice');
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400"
                    title={lang === 'ar' ? 'اتصال صوتي' : 'Voice Call'}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setActiveChatProfile(null)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
                {customMessages.map((msg, i) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none' 
                          : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="text-[8px] text-slate-500 mt-1 block text-right">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pinned Icebreakers shortcut */}
              <div className="px-4 py-2 bg-purple-500/5 border-t border-b border-white/5 flex justify-between items-center text-[10px] text-purple-300">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{lang === 'ar' ? 'استعن بمواضيع كسر الجليد:' : 'AI Icebreakers: '}</span>
                </span>
                <button
                  onClick={() => {
                    playSynthSound(700, 'sine', 0.05);
                    setSelectedProfileForIcebreakers(activeChatProfile);
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  {lang === 'ar' ? 'عرض المواضيع 🎯' : 'Show Topics 🎯'}
                </button>
              </div>

              {/* Chat Form */}
              <div className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
                <input 
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك الكونية...' : 'Write your cosmic message...'}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-2 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: EXPANDED SUB PROFILE VIEW */}
      <AnimatePresence>
        {profileDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel border border-white/10 bg-[#09090f]/95 p-6 flex flex-col gap-5 relative shadow-2xl h-[550px] overflow-y-auto scrollbar-thin"
            >
              <button 
                onClick={() => setProfileDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Identity section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 p-0.5 bg-slate-950">
                  <img src={profileDetail.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base font-black text-white flex items-center gap-2 justify-center sm:justify-start">
                    <span>{lang === 'ar' ? profileDetail.nameAr : profileDetail.name}</span>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded font-black uppercase">
                      {profileDetail.compatibilityScore}% {lang === 'ar' ? 'توافق' : 'Compatibility'}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 block mt-1">
                    {lang === 'ar' ? profileDetail.countryAr : profileDetail.country} • {profileDetail.levelAr || profileDetail.level}
                  </span>
                  
                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                    {(lang === 'ar' ? profileDetail.badgesAr : profileDetail.badges).map((badge, i) => (
                      <span key={i} className="text-[9px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex flex-col gap-4">
                
                {/* Custom bio snippet */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{lang === 'ar' ? 'النبذة التعريفية' : 'About Me'}</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-black/40 p-3.5 rounded-2xl border border-white/5">
                    "{lang === 'ar' ? profileDetail.bioAr : profileDetail.bio}"
                  </p>
                </div>

                {/* Cognitive parameters detailed overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">{lang === 'ar' ? 'أهداف التعلم الحالية' : 'Learning Goals'}</span>
                    <p className="text-xs text-white leading-relaxed">{lang === 'ar' ? profileDetail.learningGoalsAr : profileDetail.learningGoals}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">{lang === 'ar' ? 'أسلوب التواصل المفضل' : 'Preferred Sync'}</span>
                    <p className="text-xs text-white leading-relaxed">{lang === 'ar' ? profileDetail.preferredCommAr : profileDetail.preferredComm}</p>
                  </div>

                </div>

                {/* Languages and communities list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{lang === 'ar' ? 'اللغات المتقنة' : 'Languages Spoken'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'ar' ? profileDetail.languagesAr : profileDetail.languages).map((lan, idx) => (
                        <span key={idx} className="text-xs text-white bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
                          {lan}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{lang === 'ar' ? 'المجتمعات المشتركة' : 'Joined Communities'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'ar' ? profileDetail.communitiesJoinedAr : profileDetail.communitiesJoined).map((comm, idx) => (
                        <span key={idx} className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/15">
                          {comm}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Safety Quick triggers */}
              <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBlockConfirm(profileDetail)}
                    className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-xs font-bold text-red-400 transition-all cursor-pointer"
                  >
                    {lang === 'ar' ? 'حظر هذا الحساب' : 'Block User'}
                  </button>
                  <button
                    onClick={() => setShowReportModal(profileDetail)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400 transition-all cursor-pointer"
                  >
                    {lang === 'ar' ? 'إبلاغ سري' : 'Confidential Report'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleConnect(profileDetail);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer"
                >
                  {connections.includes(profileDetail.id) ? (lang === 'ar' ? 'إلغاء الاتصال' : 'Disconnect') : (lang === 'ar' ? 'اتصل وتلقى مواضيع المحادثة 🎉' : 'Connect & Get Icebreakers 🎉')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION BLOCK MODAL */}
      <AnimatePresence>
        {showBlockConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90">
            <div className="w-full max-w-sm rounded-3xl glass-panel border border-red-500/20 bg-slate-950 p-6 flex flex-col gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-sm font-black text-white">
                  {lang === 'ar' ? `هل أنت متأكد من حظر ${showBlockConfirm.nameAr}؟` : `Block ${showBlockConfirm.name}?`}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {lang === 'ar' ? 'لن يظهر هذا الحساب في عمليات البحث أو الغرف الصوتية ولن يتمكن من مراسلتك مطلقاً.' : 'This action is immediate. They will no longer see your sessions or message you.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowBlockConfirm(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  onClick={handleBlockConfirmSubmit}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white"
                >
                  {lang === 'ar' ? 'حظر الحساب' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90">
            <motion.form 
              onSubmit={handleReportSubmit}
              className="w-full max-w-md rounded-3xl glass-panel border border-white/10 bg-[#09090f] p-6 flex flex-col gap-4"
            >
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{lang === 'ar' ? `تقديم بلاغ ضد ${showReportModal.nameAr}` : `Report Profile: ${showReportModal.name}`}</span>
              </h3>

              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'سبب البلاغ السري' : 'Select Confidential Reason'}</span>
                
                {['Inappropriate biography text', 'Spam / promotional behavior', 'Harassment or insults', 'Suspicious fake account'].map((reason, i) => (
                  <label key={i} className="flex items-center gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:border-red-500/25">
                    <input type="radio" name="report_reason" required className="accent-red-500" />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowReportModal(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white"
                >
                  {lang === 'ar' ? 'تقديم البلاغ' : 'Submit Report'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* VERIFY ACCOUNT MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.form 
              onSubmit={handleApplyVerification}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass-panel border border-cyan-500/30 bg-[#09090f]/95 p-6 flex flex-col gap-4 relative shadow-[0_0_50px_rgba(6,182,212,0.1)]"
            >
              <button 
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {lang === 'ar' ? 'طلب الحصول على شارة التوثيق الفضية 🛡️' : 'Apply for Cosmic Verification Shield 🛡️'}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar' 
                  ? 'شارة التوثيق تؤكد أنك مستخدم حقيقي في مجتمع لودافيا، مما يرفع نسبة مطابقتك بنسبة 25٪ ويزيد فرصة صعودك للمنصات الصوتية.' 
                  : 'The verification shield confirms you as an active contributor within Lodavia, boosting match visibility by 25% across regional radar channels.'}
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الاسم بالكامل (كما هو في الهوية)' : 'Full Legal Name'}</label>
                  <input type="text" required placeholder="e.g. Faisal bin Saleh" className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'رابط ملف أعمالك أو لينكدإن' : 'LinkedIn or Portfolio URL'}</label>
                  <input type="url" required placeholder="https://linkedin.com/in/username" className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={verifiedApplied}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-1.5"
              >
                {verifiedApplied ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'ar' ? 'جاري التحقق التلقائي...' : 'Processing verification parameters...'}</span>
                  </>
                ) : (
                  <span>{lang === 'ar' ? 'تقديم الطلب والحصول على التوثيق الفوري ✨' : 'Submit Application & Verify Now ✨'}</span>
                )}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
