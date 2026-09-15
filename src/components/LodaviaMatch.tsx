import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Globe, Calendar, Heart, Smile, Send, Plus, Search, 
  MessageSquare, Sliders, UserPlus, Award, Clock, ArrowLeft, Check, 
  X, Shield, Info, MessageCircle, TrendingUp, BookOpen, Terminal, 
  Code, Gamepad2, Dumbbell, Briefcase, Compass, GraduationCap, Video, 
  Phone, MapPin, User, CheckCircle, AlertCircle, Filter, Lock, Settings,
  Tag
} from 'lucide-react';
import UnifiedCallModal from './call/UnifiedCallModal';

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
  lang: string;
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
  
  // User Interests State for Matching & Shared Overlap Calculation
  const [userInterests, setUserInterests] = useState<string[]>(() => {
    if (currentUser?.interests && Array.isArray(currentUser.interests) && currentUser.interests.length > 0) {
      return currentUser.interests;
    }
    return ['React', 'AI', 'Gaming', 'Travel', 'Photography'];
  });
  const [newInterestInput, setNewInterestInput] = useState<string>('');

  const popularInterestPresets = [
    { en: 'Travel', ar: 'سفر', icon: '✈️' },
    { en: 'Photography', ar: 'تصوير', icon: '📷' },
    { en: 'React', ar: 'ريأكت', icon: '⚛️' },
    { en: 'Rust', ar: 'رست', icon: '🦀' },
    { en: 'AI', ar: 'ذكاء اصطناعي', icon: '🤖' },
    { en: 'Gaming', ar: 'ألعاب', icon: '🎮' },
    { en: 'Fitness', ar: 'رياضة', icon: '💪' },
    { en: 'Languages', ar: 'لغات', icon: '🌍' },
    { en: 'Startups', ar: 'مشاريع ناشئة', icon: '🚀' },
    { en: 'Astronomy', ar: 'علم الفلك', icon: '🪐' }
  ];

  const handleAddInterest = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (userInterests.some(i => i.toLowerCase() === trimmed.toLowerCase())) return;
    playSynthSound(650, 'sine', 0.05);
    const updated = [...userInterests, trimmed];
    setUserInterests(updated);
    if (setCurrentUser) {
      setCurrentUser((prev: any) => ({ ...prev, interests: updated }));
    }
    setNewInterestInput('');
  };

  const handleRemoveInterest = (tag: string) => {
    playSynthSound(400, 'sine', 0.05);
    const updated = userInterests.filter(i => i.toLowerCase() !== tag.toLowerCase());
    setUserInterests(updated);
    if (setCurrentUser) {
      setCurrentUser((prev: any) => ({ ...prev, interests: updated }));
    }
  };

  // Helper to extract top 2-3 shared interests between current user and profile
  const getTopSharedInterests = (profile: BuddyProfile) => {
    const userNorm = userInterests.map(u => u.trim().toLowerCase());
    const matched: { en: string; ar: string; isDirectMatch: boolean }[] = [];

    // First collect direct or partial matches
    profile.interests.forEach((interestEn, idx) => {
      const interestAr = profile.interestsAr?.[idx] || interestEn;
      const isMatch = userNorm.some(u => 
        u === interestEn.toLowerCase() || 
        u === interestAr.toLowerCase() ||
        interestEn.toLowerCase().includes(u) ||
        u.includes(interestEn.toLowerCase())
      );
      if (isMatch) {
        matched.push({ en: interestEn, ar: interestAr, isDirectMatch: true });
      }
    });

    if (matched.length >= 2) {
      return matched.slice(0, 3);
    }

    // Supplement with profile's key interests so 2-3 are always present
    const result = [...matched];
    profile.interests.forEach((interestEn, idx) => {
      const interestAr = profile.interestsAr?.[idx] || interestEn;
      if (!result.some(r => r.en === interestEn) && result.length < 3) {
        result.push({ en: interestEn, ar: interestAr, isDirectMatch: false });
      }
    });

    return result.slice(0, 3);
  };

  // Dynamic compatibility adjustment based on user interests
  const getCalculatedScore = (profile: BuddyProfile) => {
    const userNorm = userInterests.map(u => u.trim().toLowerCase());
    let overlapCount = 0;
    profile.interests.forEach((interestEn, idx) => {
      const interestAr = profile.interestsAr?.[idx] || interestEn;
      if (userNorm.some(u => u === interestEn.toLowerCase() || u === interestAr.toLowerCase() || interestEn.toLowerCase().includes(u) || u.includes(interestEn.toLowerCase()))) {
        overlapCount++;
      }
    });
    // Boost base score by overlap, kept between 75% and 99%
    const boost = overlapCount > 0 ? (overlapCount - 1) * 3 : -3;
    return Math.min(99, Math.max(72, profile.compatibilityScore + boost));
  };

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
        return prev + 4;
      });
    }, 130);
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
      const effectiveScore = getCalculatedScore(profile);
      if (effectiveScore < minCompatibility) return false;

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
        return prev + 4;
      });
    }, 130);
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/40 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        
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
            <p className="text-xs md:text-sm font-semibold text-slate-200 mt-2 leading-relaxed max-w-2xl">
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
            className="w-full md:w-auto px-4.5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 text-xs font-black text-cyan-300 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'توثيق الحساب 🛡️' : 'Verify Account 🛡️'}</span>
          </button>
        </div>
      </div>

      {/* MATCH SETTINGS, INTEREST TAGS & AI SEARCH CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        
        {/* Left: AI Search + Interest Tags Management (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* AI Prompt Input Bar */}
          <div className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/40 bg-[#090d18] flex flex-col gap-3 shadow-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{lang === 'ar' ? 'محرك البحث الكوني من Lodavia AI 🤖' : 'Lodavia AI Cosmic Prompt Search 🤖'}</span>
            </h3>
            
            <form onSubmit={handleAISearchPrompt} className="flex gap-2">
              <div className="flex-1 flex items-center bg-[#050812] border border-cyan-500/50 rounded-2xl px-3.5 py-2.5">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input 
                  type="text"
                  value={aiPromptGoal}
                  onChange={(e) => setAiPromptGoal(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: ابحث عن شريك لتعلم لغة رست وممارسة الإنجليزية...' : 'e.g. Find me a mentor for React scaling who speaks Arabic...'}
                  className="bg-transparent border-none text-xs text-white placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-0 w-full px-2"
                />
              </div>
              <button 
                type="submit"
                className="px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/30 shrink-0"
              >
                {lang === 'ar' ? 'طابقني ⚡' : 'Match Me ⚡'}
              </button>
            </form>
            
            {/* Quick Preset Prompts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-slate-300">{lang === 'ar' ? 'مقترحات سريعة:' : 'Quick Prompts:'}</span>
              {[
                { ar: 'شريك برمجيات Rust 🦀', en: 'Rust Coding Buddy 🦀' },
                { ar: 'تبادل لغات مع اليابان 🇯🇵', en: 'Japan Language Exchange 🇯🇵' },
                { ar: 'موجه مشاريع SaaS 🚀', en: 'SaaS Startup Mentor 🚀' },
                { ar: 'شريك ألعاب تنافسية 🎮', en: 'Competitive Gaming 🎮' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.04);
                    const promptText = lang === 'ar' ? preset.ar : preset.en;
                    setAiPromptGoal(promptText);
                  }}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-[10px] font-extrabold text-cyan-200 transition-all cursor-pointer shadow-sm"
                >
                  {lang === 'ar' ? preset.ar : preset.en}
                </button>
              ))}
            </div>

            {aiPromptExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-[11px] text-cyan-200 flex items-start gap-2"
              >
                <Info className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{lang === 'ar' ? aiPromptExplanation.ar : aiPromptExplanation.en}</p>
              </motion.div>
            )}
          </div>

          {/* User Interests Manager Card (Added per user request) */}
          <div className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/40 bg-[#090d18] flex flex-col gap-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'اهتماماتي للتطابق الكوني ⭐' : 'My Match Interests ⭐'}</span>
              </h3>
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                {userInterests.length} {lang === 'ar' ? 'اهتمامات نشطة' : 'Active Interests'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              {lang === 'ar' 
                ? 'أدخل اهتماماتك أو اختر من الوسوم المقترحة، تُستخدم كأساس فوري لحساب التوافق واستخراج الاهتمامات المشتركة مع الشركاء:' 
                : 'Add custom interest tags or pick from presets to calculate live compatibility and highlight shared interests:'}
            </p>

            {/* Interest Input form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddInterest(newInterestInput);
              }}
              className="flex gap-2"
            >
              <div className="flex-1 flex items-center bg-[#050812] border border-cyan-500/50 rounded-2xl px-3.5 py-2">
                <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
                <input 
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'أضف اهتماماً (مثال: سفر، تصوير، برمجة، رياضة)...' : 'Add interest (e.g. Travel, Photography, Coding)...'}
                  className="bg-transparent border-none text-xs text-white placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-0 w-full px-2"
                />
              </div>
              <button 
                type="submit"
                className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-md shrink-0 flex items-center gap-1"
              >
                <span>{lang === 'ar' ? '+ إضافة' : '+ Add'}</span>
              </button>
            </form>

            {/* Active User Interest Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {userInterests.map((interest, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-xs font-black text-cyan-200 flex items-center gap-1.5 shadow-sm group"
                >
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>#{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="w-4 h-4 rounded-full bg-cyan-400/20 hover:bg-red-500/80 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer text-cyan-300 ml-1"
                    title={lang === 'ar' ? 'حذف الاهتمام' : 'Remove interest'}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Popular Presets */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-cyan-500/15">
              <span className="text-[10px] font-bold text-slate-400">{lang === 'ar' ? 'وسوم مقترحة للإضافة السريعة:' : 'Quick Presets:'}</span>
              <div className="flex flex-wrap gap-1.5">
                {popularInterestPresets.map((preset, idx) => {
                  const label = lang === 'ar' ? preset.ar : preset.en;
                  const isAdded = userInterests.some(i => i.toLowerCase() === preset.en.toLowerCase() || i.toLowerCase() === preset.ar.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddInterest(preset.en)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                        isAdded 
                          ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed' 
                          : 'bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{label}</span>
                      {!isAdded && <span className="text-[9px] text-cyan-400 font-bold">+</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Privacy & Safety Controls + Categories (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Privacy & Safety Quick Controller (Preserved in full) */}
          <div className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/40 bg-[#090d18] flex flex-col gap-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-cyan-500/20">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'إعدادات الخصوصية والأمان 🛡️' : 'Privacy & Safety Controls 🛡️'}</span>
              </h3>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-center justify-between text-xs font-black cursor-pointer text-slate-100 hover:text-cyan-300 transition-colors">
                <span>{lang === 'ar' ? 'الظهور في رادار المطابقة الكونية' : 'Visible in Match Radar'}</span>
                <input 
                  type="checkbox" 
                  checked={privacyVisible}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacyVisible(e.target.checked);
                  }}
                  className="rounded bg-slate-950 border-cyan-400 text-cyan-400 focus:ring-0 focus:ring-offset-0 w-4.5 h-4.5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-black cursor-pointer text-slate-100 hover:text-cyan-300 transition-colors">
                <span>{lang === 'ar' ? 'مطابقة من نفس الجنس فقط' : 'Same-Gender Matching Only'}</span>
                <input 
                  type="checkbox" 
                  checked={privacySameGender}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacySameGender(e.target.checked);
                  }}
                  className="rounded bg-slate-950 border-cyan-400 text-cyan-400 focus:ring-0 focus:ring-offset-0 w-4.5 h-4.5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-black cursor-pointer text-slate-100 hover:text-cyan-300 transition-colors">
                <span>{lang === 'ar' ? 'إخفاء نسبة التوافق في البطاقات' : 'Hide Compatibility Score'}</span>
                <input 
                  type="checkbox" 
                  checked={privacyHideScore}
                  onChange={(e) => {
                    playSynthSound(400, 'sine', 0.05);
                    setPrivacyHideScore(e.target.checked);
                  }}
                  className="rounded bg-slate-950 border-cyan-400 text-cyan-400 focus:ring-0 focus:ring-offset-0 w-4.5 h-4.5 accent-cyan-400"
                />
              </label>
            </div>
          </div>

          {/* Cosmic Categories Selection */}
          <div className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/40 bg-[#090d18] flex flex-col gap-3 shadow-2xl">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'فئات المطابقة الكونية:' : 'Cosmic Matching Categories:'}</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {matchCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeCategory === cat.id;
                const matchCount = mockProfiles.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.04);
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-2 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 border-cyan-300 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-102'
                        : 'border-white/10 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-extrabold hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                      <span className="text-xs truncate">
                        {lang === 'ar' ? cat.labelAr : cat.label}
                      </span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* DYNAMIC WORKSPACE: TEMPORARY RADAR SCAN TRANSITION (3-4 SECONDS) OR PROFILE CARDS GRID */}
      <AnimatePresence mode="wait">
        {isScanning ? (
          /* RADAR TRANSITION SCREEN (3-4 Seconds Scan State) */
          <motion.div
            key="radar-transition"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center justify-center py-6"
          >
            <div className="w-full max-w-2xl cosmic-glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/50 bg-[#060914]/95 flex flex-col items-center text-center shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden">
              
              {/* Scan State Header */}
              <div className="mb-6 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{lang === 'ar' ? 'رادار المطابقة الكونية قيد المسح' : 'Active Cosmic Radar Sweep'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center justify-center gap-2">
                  <span>{lang === 'ar' ? 'جاري البحث عن تطابقات في مدارك... 📡⚡' : 'Searching for cosmic matches in your orbit... 📡⚡'}</span>
                </h2>
                <p className="text-xs text-cyan-200/90 font-medium max-w-md mt-1.5">
                  {lang === 'ar' 
                    ? 'يتم فحص الترددات الكونية ومطابقة الاهتمامات المشتركة وتحليل نسب التوافق الفلكي...' 
                    : 'Scanning orbital frequencies, analyzing shared interests & cosmic compatibility scores...'}
                </p>
              </div>

              {/* High-Tech Flat Radar Screen (Aspect Square) */}
              <div 
                className="w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-3xl border border-cyan-500/40 relative overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.2)]"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.16) 0%, rgba(10, 24, 52, 0.6) 35%, rgba(3, 7, 18, 0.94) 70%, #020408 100%)'
                }}
              >
                {/* Top Radar Bar */}
                <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1.5 bg-slate-950/90 px-3 py-1 rounded-full border border-cyan-400/40 shadow-md">
                    <Compass className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>{lang === 'ar' ? 'مسح الرادار الكوني 📡' : 'Radar Sweep Mode 📡'}</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-400/40 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{lang === 'ar' ? 'العقد المكتشفة: 5' : 'Nodes Active: 5'}</span>
                  </span>
                </div>

                {/* Concentric Radar Range Rings & Azimuth Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Outer Boundary Ring (88%) */}
                  <div className="w-[88%] h-[88%] rounded-full border border-cyan-400/25 relative flex items-center justify-center">
                    <span className="absolute -top-3 text-[7px] font-mono tracking-widest text-cyan-400/60 uppercase">000° N • OUTER MESH</span>
                    <span className="absolute -bottom-3 text-[7px] font-mono tracking-widest text-cyan-400/60 uppercase">180° S</span>
                    <span className="absolute -left-4 text-[7px] font-mono tracking-widest text-cyan-400/60 uppercase">270° W</span>
                    <span className="absolute -right-4 text-[7px] font-mono tracking-widest text-cyan-400/60 uppercase">090° E</span>
                  </div>
                  {/* 66% Ring */}
                  <div className="w-[66%] h-[66%] rounded-full border border-dashed border-cyan-400/20 absolute flex items-center justify-center">
                    <span className="absolute top-1 text-[6.5px] font-mono text-cyan-500/40">ZONE B • 75%</span>
                  </div>
                  {/* 44% Ring */}
                  <div className="w-[44%] h-[44%] rounded-full border border-cyan-400/25 absolute flex items-center justify-center">
                    <span className="absolute top-1 text-[6.5px] font-mono text-cyan-400/50">ZONE A • 50%</span>
                  </div>
                  {/* 22% Inner Ring */}
                  <div className="w-[22%] h-[22%] rounded-full border border-dashed border-cyan-400/35 bg-cyan-500/5 absolute flex items-center justify-center">
                    <span className="absolute top-0.5 text-[6px] font-mono text-cyan-300/60">CORE 25%</span>
                  </div>
                  {/* Azimuth Hairline Crosshairs */}
                  <div className="absolute w-[88%] h-[0.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                  <div className="absolute h-[88%] w-[0.5px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
                </div>

                {/* Tactical Corner Brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

                {/* Rotating Radar Sweep Line & Luminous Trailing Beam */}
                <motion.div 
                  className="absolute w-[88%] h-[88%] rounded-full pointer-events-none z-10 origin-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.38) 0deg, rgba(6, 182, 212, 0.15) 25deg, rgba(6, 182, 212, 0.02) 75deg, transparent 90deg, transparent 360deg)',
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-cyan-300 via-sky-200 to-white -translate-x-1/2"
                    style={{
                      boxShadow: '0 0 14px 2px rgba(6, 182, 212, 0.9), 0 0 4px #ffffff',
                    }}
                  />
                </motion.div>

                {/* Sonar Pulse Rings */}
                <motion.div
                  className="absolute rounded-full border border-cyan-400/60 pointer-events-none z-10"
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{ width: ['0%', '88%'], height: ['0%', '88%'], opacity: [0.8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    boxShadow: '0 0 16px rgba(6, 182, 212, 0.4), inset 0 0 12px rgba(6, 182, 212, 0.2)',
                  }}
                />
                <motion.div
                  className="absolute rounded-full border border-cyan-400/50 pointer-events-none z-10"
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{ width: ['0%', '88%'], height: ['0%', '88%'], opacity: [0.8, 0] }}
                  transition={{ duration: 2.2, delay: 1.1, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
                  }}
                />

                {/* Animated Data Vectors & Nodes */}
                <svg viewBox="-160 -160 320 320" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <filter id="matchPulseGlowTransition" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {mockProfiles.slice(0, 5).map((profile, idx) => {
                    const angle = (idx * 72 * Math.PI) / 180;
                    const distance = 100 + (idx % 2 === 0 ? 25 : -20);
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const isTop = profile.compatibilityScore >= 95;
                    const strokeColor = isTop ? '#D9B968' : '#06b6d4';

                    return (
                      <g key={`transition-vector-${profile.id}`}>
                        <line 
                          x1="0" y1="0" x2={x} y2={y} 
                          stroke={strokeColor} 
                          strokeOpacity={isTop ? 0.35 : 0.2} 
                          strokeWidth="1.2" 
                          strokeDasharray="4 4"
                        />
                        <motion.line 
                          x1="0" y1="0" x2={x} y2={y} 
                          stroke={strokeColor} 
                          strokeOpacity={isTop ? 0.8 : 0.6} 
                          strokeWidth="1.5" 
                          strokeDasharray="10 24"
                          animate={{ strokeDashoffset: [0, -34] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.circle 
                          r={isTop ? "3.5" : "2.8"} 
                          fill={isTop ? "#FDE68A" : "#ffffff"} 
                          filter="url(#matchPulseGlowTransition)"
                          animate={{ cx: [0, x], cy: [0, y] }}
                          transition={{ 
                            duration: 2.8, 
                            repeat: Infinity, 
                            ease: "easeInOut", 
                            delay: idx * 0.5 
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Orbiting Avatar nodes */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  {mockProfiles.slice(0, 5).map((profile, idx) => {
                    const angle = (idx * 72 * Math.PI) / 180;
                    const distance = 100 + (idx % 2 === 0 ? 25 : -20);
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const isTopMatch = profile.compatibilityScore >= 95;
                    const scoreWeight = (profile.compatibilityScore - 80) / 20;
                    const nodeSize = isTopMatch ? 52 : Math.round(42 + scoreWeight * 8);

                    return (
                      <motion.div 
                        key={`orbit-${profile.id}`}
                        className={`absolute rounded-full border-2 p-0.5 bg-slate-950 overflow-visible z-20 flex items-center justify-center ${
                          isTopMatch ? 'border-[#D9B968]' : 'border-cyan-400'
                        }`}
                        style={{ 
                          x, 
                          y,
                          width: `${nodeSize}px`,
                          height: `${nodeSize}px`,
                          boxShadow: isTopMatch 
                            ? '0 0 24px 3px rgba(217, 185, 104, 0.85), 0 0 8px #ffffff' 
                            : `0 0 ${12 + scoreWeight * 12}px 2px rgba(6, 182, 212, ${0.45 + scoreWeight * 0.4}), 0 0 4px #ffffff`
                        }}
                        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: idx * 0.3 }}
                      >
                        <div className={`absolute -inset-1.5 rounded-full animate-ping opacity-40 pointer-events-none ${
                          isTopMatch ? 'border border-[#D9B968]' : 'border border-cyan-400'
                        }`} />

                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          className="w-full h-full rounded-full object-cover relative z-10" 
                        />

                        <div className={`absolute -bottom-2 z-20 px-1.5 py-0.5 rounded-full text-[8px] font-black border shadow-md flex items-center gap-0.5 whitespace-nowrap ${
                          isTopMatch 
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold' 
                            : 'bg-slate-950/90 text-cyan-300 border-cyan-400/50'
                        }`}>
                          {isTopMatch && <span>👑</span>}
                          <span>{profile.compatibilityScore}%</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Central dynamic scanner icon */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div 
                    className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-blue-600"
                    animate={{ 
                      scale: [1, 1.15, 1], 
                      boxShadow: ['0 0 20px rgba(6,182,212,0.45)', '0 0 45px rgba(6,182,212,0.9)', '0 0 20px rgba(6,182,212,0.45)'] 
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-full h-full rounded-full bg-[#050812] flex items-center justify-center relative overflow-hidden">
                      <Globe className="w-7 h-7 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                  </motion.div>
                </div>

              </div>

              {/* Real-time Progress Bar */}
              <div className="w-full max-w-md mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center justify-between w-full text-xs font-black">
                  <span className="text-cyan-300 animate-pulse">
                    {lang === 'ar' ? 'جاري فحص المدارات والإشارات الكونية...' : 'Scanning Cosmic Nodes...'}
                  </span>
                  <span className="text-cyan-400 font-mono">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 h-full rounded-full" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* RESULTS & PROFILE CARDS GRID (Displayed cleanly after scanning ends) */
          <motion.div
            key="profile-cards-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Action Bar: Count, Re-Scan Button & Filter Controls */}
            <div className="cosmic-glass-panel p-4.5 rounded-3xl border border-cyan-500/30 bg-[#090d18] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>
                      {lang === 'ar' 
                        ? `العقد المتطابقة المتوفرة (${displayProfiles.length}) 🪐` 
                        : `Compatible Matches Found (${displayProfiles.length}) 🪐`}
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lang === 'ar' 
                      ? 'تم تحليل التوافق والاهتمامات المشتركة بدقة مع مدارك الكوني' 
                      : 'Harmonically calibrated based on active interests and orbit'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
                {/* Re-Scan Radar Button */}
                <button 
                  onClick={handleTriggerScan}
                  className="px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black cursor-pointer shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center gap-2 shrink-0"
                >
                  <Compass className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'مسح الرادار مجدداً 🔄' : 'Re-Scan Radar 🔄'}</span>
                </button>

                {/* Filter toggle */}
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowFilters(!showFilters);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-slate-100 font-extrabold transition-all cursor-pointer border border-white/10 shrink-0"
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'فلاتر متقدمة ⚙️' : 'Filters ⚙️'}</span>
                </button>

                {/* Compatibility Threshold Slider */}
                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] text-slate-300 font-bold">{lang === 'ar' ? 'الحد الأدنى:' : 'Min:'}</span>
                  <input 
                    type="range" 
                    min="60" 
                    max="95" 
                    value={minCompatibility} 
                    onChange={(e) => {
                      playSynthSound(450, 'sine', 0.02);
                      setMinCompatibility(parseInt(e.target.value));
                    }}
                    className="w-20 accent-cyan-400 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer" 
                  />
                  <span className="text-xs font-black text-cyan-300">{minCompatibility}%</span>
                </div>
              </div>
            </div>

            {/* Expandable Filters Tray */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="cosmic-glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-[#090d18] shadow-xl overflow-hidden grid grid-cols-1 sm:grid-cols-4 gap-4"
                >
                  {/* Filter Country */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-300 font-bold uppercase">{lang === 'ar' ? 'الدولة والمنطقة' : 'Country'}</span>
                    <select 
                      value={filterCountry} 
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="bg-slate-950 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                    <span className="text-[10px] text-slate-300 font-bold uppercase">{lang === 'ar' ? 'اللغة المشتركة' : 'Language'}</span>
                    <select 
                      value={filterLanguage} 
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="bg-slate-950 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
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
                    <span className="text-[10px] text-slate-300 font-bold uppercase">{lang === 'ar' ? 'المستوى المعرفي' : 'Skill Level'}</span>
                    <select 
                      value={filterLevel} 
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-slate-950 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="All">{lang === 'ar' ? 'الكل' : 'All Levels'}</option>
                      <option value="Expert">{lang === 'ar' ? 'خبير' : 'Expert'}</option>
                      <option value="Advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
                      <option value="Intermediate">{lang === 'ar' ? 'متوسط' : 'Intermediate'}</option>
                    </select>
                  </div>

                  {/* Filter Online Only */}
                  <div className="flex items-center justify-start pt-4 sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-100 font-bold">
                      <input 
                        type="checkbox"
                        checked={filterOnlineOnly}
                        onChange={(e) => {
                          playSynthSound(500, 'sine', 0.05);
                          setFilterOnlineOnly(e.target.checked);
                        }}
                        className="rounded bg-slate-950 border-cyan-400 text-cyan-400 focus:ring-0 w-4 h-4 accent-cyan-400"
                      />
                      <span>{lang === 'ar' ? 'المتصلين فقط 🟢' : 'Online only 🟢'}</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Cards Grid View (Responsive grid replacing abstract radar nodes) */}
            {displayProfiles.length === 0 ? (
              <div className="cosmic-glass-panel p-12 text-center text-slate-200 font-bold rounded-3xl text-sm border border-cyan-500/40 bg-[#090d18] flex flex-col items-center gap-3">
                <AlertCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
                <p>
                  {lang === 'ar' 
                    ? 'لم يتم العثور على شركاء يطابقون الفلاتر المحددة حالياً. حاول تعديل النطاق أو إضافة المزيد من الاهتمامات.' 
                    : 'No cosmic buddies found matching current filters. Try adjusting criteria or adding more interests.'}
                </p>
                <button
                  onClick={handleTriggerScan}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer"
                >
                  {lang === 'ar' ? 'مسح الرادار مجدداً 🔄' : 'Re-Scan Radar 🔄'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayProfiles.map((profile) => {
                  const isConnected = connections.includes(profile.id);
                  const effectiveScore = getCalculatedScore(profile);
                  const topShared = getTopSharedInterests(profile);

                  return (
                    <motion.div 
                      key={profile.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cosmic-glass-panel p-5.5 rounded-3xl border border-cyan-500/30 hover:border-cyan-400/70 bg-gradient-to-b from-[#090d1a] to-[#040710] hover:shadow-[0_0_35px_rgba(6,182,212,0.22)] transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top Row: Avatar, Identity, Compatibility Score */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            {/* Prominent Avatar */}
                            <div className="relative shrink-0">
                              {profile.isOnline && (
                                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#090d1a] z-10 animate-pulse shadow-[0_0_8px_#34d399]" />
                              )}
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors shadow-md">
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                              </div>
                            </div>

                            {/* Name & Region */}
                            <div>
                              <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 flex-wrap">
                                <span>{lang === 'ar' ? profile.nameAr : profile.name}</span>
                                {profile.age && (
                                  <span className="text-[10px] text-slate-400 font-bold">({profile.age})</span>
                                )}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className="text-[9px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full font-black tracking-widest uppercase flex items-center gap-1 border border-cyan-400/20">
                                  <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                                  <span>{lang === 'ar' ? profile.countryAr : profile.country}</span>
                                </span>
                                {profile.level && (
                                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                                    {lang === 'ar' ? profile.levelAr || profile.level : profile.level}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Compatibility Score (hidden if privacyHideScore is set) */}
                          {!privacyHideScore ? (
                            <div className="text-right shrink-0">
                              <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">
                                {lang === 'ar' ? 'التوافق الكوني' : 'Match'}
                              </span>
                              <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                                {effectiveScore}%
                              </span>
                            </div>
                          ) : (
                            <div className="text-right shrink-0">
                              <span className="text-[9px] text-cyan-400 font-black bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-400/20">
                                {lang === 'ar' ? 'متوافق ⭐' : 'Matched ⭐'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Top 2-3 Shared Interests Highlight */}
                        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 mb-3 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-black text-cyan-300 uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>{lang === 'ar' ? 'أهم الاهتمامات المشتركة ⭐' : 'Top Shared Interests ⭐'}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {topShared.map((item, i) => (
                              <span 
                                key={i}
                                className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
                                  item.isDirectMatch 
                                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 text-cyan-200 shadow-sm' 
                                    : 'bg-white/5 border border-white/10 text-slate-300'
                                }`}
                              >
                                <span>#{lang === 'ar' ? item.ar : item.en}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* AI Match Explanation */}
                        <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[10px] text-purple-200 flex items-start gap-1.5 mb-4">
                          <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed font-medium line-clamp-2">
                            {lang === 'ar' ? profile.explanationAr : profile.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Area: Prominent "بدء محادثة" Button + Secondary Actions */}
                      <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                        
                        {/* PRIMARY ACTION: "بدء محادثة" (Start Conversation) */}
                        <button
                          onClick={() => {
                            playSynthSound(600, 'sine', 0.05);
                            setActiveChatProfile(profile);
                            setCustomMessages([
                              { 
                                sender: 'them', 
                                text: lang === 'ar' 
                                  ? `مرحباً! لاحظت أننا نتشارك اهتمامات في ${topShared.map(t => t.ar).join(' و ')}. يسعدني التواصل معك!` 
                                  : `Hello! I noticed we share interests in ${topShared.map(t => t.en).join(', ')}. Excited to connect!`, 
                                time: 'Just now' 
                              }
                            ]);
                          }}
                          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'بدء محادثة 💬' : 'Start Conversation 💬'}</span>
                        </button>

                        {/* Secondary Action Row: Connect, Video, Voice, Profile */}
                        <div className="flex items-center gap-1.5 justify-between">
                          {/* Connect Toggle */}
                          <button
                            onClick={() => handleConnect(profile)}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                              isConnected 
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                                : 'bg-slate-900 border-white/10 hover:border-cyan-400/40 text-slate-200'
                            }`}
                          >
                            {isConnected ? <Check className="w-3 h-3 text-cyan-400" /> : <UserPlus className="w-3 h-3 text-slate-300" />}
                            <span>{isConnected ? (lang === 'ar' ? 'متصل' : 'Connected') : (lang === 'ar' ? 'تواصل' : 'Connect')}</span>
                          </button>

                          {/* Video Call */}
                          <button
                            onClick={() => handleSimulateCall(profile, 'video')}
                            className="p-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
                            title={lang === 'ar' ? 'اتصال مرئي' : 'Video Call'}
                          >
                            <Video className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          {/* Voice Call */}
                          <button
                            onClick={() => handleSimulateCall(profile, 'voice')}
                            className="p-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
                            title={lang === 'ar' ? 'اتصال صوتي' : 'Voice Call'}
                          >
                            <Phone className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          {/* View Profile */}
                          <button
                            onClick={() => {
                              playSynthSound(650, 'sine', 0.05);
                              setProfileDetail(profile);
                            }}
                            className="p-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-colors"
                            title={lang === 'ar' ? 'عرض الملف' : 'View Profile'}
                          >
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* MODAL 2: HIGH FIDELITY UNIFIED CALL OVERLAY */}
      {activeCall && (
        <UnifiedCallModal
          activeCall={{
            type: activeCall.type,
            contactName: lang === 'ar' ? activeCall.profile.nameAr : activeCall.profile.name,
            contactAvatar: activeCall.profile.avatar,
            contactBadge: lang === 'ar' ? activeCall.profile.badgesAr?.[0] : activeCall.profile.badges?.[0],
            status: activeCall.status === 'ended' ? 'ended' : activeCall.status === 'calling' ? 'calling' : 'connected',
            quality: 'excellent'
          }}
          lang={lang}
          onEndCall={handleEndCall}
          playSynthSound={playSynthSound}
        />
      )}

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
