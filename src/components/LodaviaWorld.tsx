import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LodaviaGlobe3D from './LodaviaGlobe3D';
import { 
  Globe, Sparkles, MapPin, Users, Mic, Video, Calendar, 
  TrendingUp, Compass, ArrowLeft, Check, Plus, MessageSquare, 
  Search, Sliders, Shield, AlertCircle, Play, X, Volume2, 
  Languages, Star, Zap, Info, ExternalLink, ArrowUpRight, Share2
} from 'lucide-react';

// Country Details Interfaces
interface LiveVoiceRoom {
  id: string;
  name: string;
  nameAr: string;
  host: string;
  listeners: number;
  tags: string[];
}

interface LiveStream {
  id: string;
  title: string;
  titleAr: string;
  streamer: string;
  viewers: number;
  category: string;
}

interface CountryEvent {
  id: string;
  title: string;
  titleAr: string;
  type: 'conference' | 'meetup' | 'tournament' | 'educational';
  typeLabel: string;
  typeLabelAr: string;
  date: string;
  time: string;
  joined: boolean;
}

interface GlobalCreator {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  avatar: string;
}

interface CountryDetails {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  onlineCount: number;
  activeCommunities: string[];
  activeCommunitiesAr: string[];
  liveVoiceRooms: LiveVoiceRoom[];
  liveStreams: LiveStream[];
  events: CountryEvent[];
  trendingTopics: string[];
  trendingTopicsAr: string[];
  popularCreators: GlobalCreator[];
  aiTrendingInsights: { en: string; ar: string };
  aiFunFacts: { en: string; ar: string };
}

// Global Hubs data structure for Map & Globe rendering
interface MapHub {
  id: string;
  name: string;
  nameAr: string;
  lat: number;   // Latitude: -90 to +90
  lon: number;   // Longitude: -180 to +180
  color: string;
  glowColor: string;
  details: CountryDetails;
}

// 3D Point projection structure
interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  visible: boolean;
  hub?: MapHub;
}

const mapHubs: MapHub[] = [
  {
    id: 'saudi',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    lat: 23.8859,
    lon: 45.0792,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    glowColor: '#10b981',
    details: {
      id: 'saudi',
      name: 'Saudi Arabia',
      nameAr: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      onlineCount: 2420,
      activeCommunities: ['AI Core Synthetics', 'Quantum Developers', 'Arabic Calligraphy Digitalists', 'SaaS Founders Hub'],
      activeCommunitiesAr: ['مجمع الذكاء الفائق', 'مطوري الكوانتوم', 'رقمنة الخط العربي', 'ملتقى ريادة الأعمال'],
      liveVoiceRooms: [
        { id: 'vr-sa-1', name: 'Riyadh AI Cafe ☕', nameAr: 'مقهى الذكاء الاصطناعي بالرياض ☕', host: 'Faisal Al-Zahrani', listeners: 142, tags: ['AI', 'Gemini', 'SaaS'] },
        { id: 'vr-sa-2', name: 'Jeddah Sunset Coding 🌅', nameAr: 'برمجة غروب جدة 🌅', host: 'Sara Al-Ghamdi', listeners: 89, tags: ['React', 'Tailwind'] }
      ],
      liveStreams: [
        { id: 'ls-sa-1', title: 'Live: Building High Latency Audio Pipelines in Rust', titleAr: 'مباشر: بناء خطوط معالجة الصوت بـ Rust', streamer: 'Amir Al-Otaibi', viewers: 420, category: 'Coding' },
        { id: 'ls-sa-2', title: 'Co-op FPS Tournament Finals live from Riyadh Arena', titleAr: 'بث نهائيات بطولة التصويب التنافسية بموسم الرياض', streamer: 'LumoGamersSA', viewers: 1850, category: 'Gaming' }
      ],
      events: [
        { id: 'ev-sa-1', title: 'DeepSpace Astrophotography Desert Meetup 🌌', titleAr: 'ملتقى تصوير أعماق الفضاء في الكثبان الرملية 🌌', type: 'meetup', typeLabel: 'Meetup', typeLabelAr: 'تجمع ميداني', date: 'Jul 15, 2026', time: '20:00', joined: false },
        { id: 'ev-sa-2', title: 'Riyadh Quantum Computing & AI Summit 🏆', titleAr: 'قمة الرياض للحوسبة الكمومية والذكاء الفائق 🏆', type: 'conference', typeLabel: 'Conference', typeLabelAr: 'مؤتمر تقني', date: 'Aug 02, 2026', time: '09:00', joined: false }
      ],
      trendingTopics: ['#RiyadhVision2030', '#AIAgents', '#ArabicLLM', '#NeomQuantum', '#RustLanguage'],
      trendingTopicsAr: ['#رؤية_الرياض_٢٠٣٠', '#عملاء_الذكاء_الاصطناعي', '#النماذج_اللغوية_العربية', '#كوانتوم_نيوم', '#لغة_رست'],
      popularCreators: [
        { name: 'Faisal Al-Zahrani', nameAr: 'فيصل الزهراني', role: 'Quantum Compiler Developer', roleAr: 'مطور مترجمات كمومية', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        { name: 'Amir Al-Otaibi', nameAr: 'أمير العتيبي', role: 'SaaS Architecture Guru', roleAr: 'خبير معماريات البرمجيات السحابية', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Deep Tech scaling and LLM optimizations are dominating Riyadh's tech spheres. There is an explosive 42% rise in active Rust compiler development projects within our communities.",
        ar: "تقنيات التوسع والذكاء الاصطناعي التوليدي تهيمن على المشهد التقني بالرياض. تم تسجيل قفزة هائلة بنسبة 42٪ في تطوير مشاريع Rust ضمن مجتمعات لودافيا."
      },
      aiFunFacts: {
        en: "Saudi Arabia hosts the highest density of astrophotographers on Lodavia! Members regularly camp in dark desert valleys to photograph the galactic core of the Milky Way.",
        ar: "تحتضن المملكة العربية السعودية أعلى كثافة لمصوري الفلك والنجوم في عالم لودافيا! يعسكر الأعضاء في الأودية الصحراوية المظلمة لالتقاط صور خلابة لقلب مجرة درب التبانة."
      }
    }
  },
  {
    id: 'usa',
    name: 'United States',
    nameAr: 'الولايات المتحدة الأمريكية',
    lat: 37.0902,
    lon: -95.7129,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    glowColor: '#06b6d4',
    details: {
      id: 'usa',
      name: 'United States',
      nameAr: 'الولايات المتحدة الأمريكية',
      flag: '🇺🇸',
      onlineCount: 4120,
      activeCommunities: ['Silicon Valley Startups', 'Design Systems League', 'Next.js Hackers', 'Cognitive Science Collective'],
      activeCommunitiesAr: ['مشاريع وادي السيليكون', 'رابطة نظم التصميم', 'مخترقو نيكست جي إس', 'رابطة العلوم الإدراكية'],
      liveVoiceRooms: [
        { id: 'vr-us-1', name: 'SF VC & Angel Pitch Circle 🦄', nameAr: 'حلقة نقاش وطرح الأفكار للمستثمرين في سان فرانسيسكو 🦄', host: 'Sarah Jenkins', listeners: 320, tags: ['Funding', 'SaaS', 'Pitch'] },
        { id: 'vr-us-2', name: 'Ambient Focus Beats & Code 🎧', nameAr: 'موسيقى كوزمية هادئة وجلسة برمجة مشتركة 🎧', host: 'Alex Rivera', listeners: 185, tags: ['Lofi', 'Focus', 'Silent'] }
      ],
      liveStreams: [
        { id: 'ls-us-1', title: 'Streaming live: Rewriting our core UI engine with React 19', titleAr: 'بث مباشر: إعادة كتابة محرك الواجهات بالاعتماد على ريأكت 19', streamer: 'VercelWizard', viewers: 1200, category: 'Coding' }
      ],
      events: [
        { id: 'ev-us-1', title: 'Silicon Valley AI Founders Summit 🚀', titleAr: 'قمة مؤسسي الذكاء الاصطناعي بوادي السيليكون 🚀', type: 'conference', typeLabel: 'Conference', typeLabelAr: 'مؤتمر ريادي', date: 'Jul 28, 2026', time: '10:00', joined: false }
      ],
      trendingTopics: ['#React19', '#VCFunding', '#AIAgentSecurity', '#NextJSHackathon'],
      trendingTopicsAr: ['#ريأكت_١٩', '#تمويل_المشاريع_الناشئة', '#أمن_الذكاء_الاصطناعي', '#هاكاثون_نيكست'],
      popularCreators: [
        { name: 'Sarah Jenkins', nameAr: 'سارة جينكينز', role: 'Ex-Google UX Lead & Advisor', roleAr: 'قائدة تصميم سابقة بجوجل ومستشارة', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
        { name: 'Alex Rivera', nameAr: 'أليكس ريفيرا', role: 'Creative Technologist', roleAr: 'تقني إبداعي وموسيقي فلكي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Generative workflow agent automation is taking center stage. Startup capital is flowing into local micro-LLM infrastructures designed for embedded edge hardware.",
        ar: "تأخذ أتمتة تدفقات عمل عملاء الذكاء الاصطناعي مركز الصدارة. تتدفق رؤوس الأموال الاستثمارية نحو قواعد البنية التحتية المصغرة للنماذج اللغوية على الحافة."
      },
      aiFunFacts: {
        en: "San Francisco developers represent our most night-active coding timezone, peak activity is recorded between 2 AM and 4 AM EST!",
        ar: "يمثل مطورو سان فرانسيسكو المنطقة الزمنية الأكثر نشاطاً في الليل على منصتنا، حيث يتم تسجيل ذروة النشاط بين الساعة 2 و 4 صباحاً!"
      }
    }
  },
  {
    id: 'japan',
    name: 'Japan',
    nameAr: 'اليابان',
    lat: 36.2048,
    lon: 138.2529,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    glowColor: '#f472b6',
    details: {
      id: 'japan',
      name: 'Japan',
      nameAr: 'اليابان',
      flag: '🇯🇵',
      onlineCount: 1890,
      activeCommunities: ['Tokyo Game Designers', 'Language Exchange Hub', 'Anime Vector Artistry', 'Zen UI Minimalists'],
      activeCommunitiesAr: ['مصممي ألعاب طوكيو', 'مجمع تبادل اللغات', 'فنون الرسوم التوجيهية والأنمي', 'تصميم واجهات الزين المبسطة'],
      liveVoiceRooms: [
        { id: 'vr-jp-1', name: 'Kyoto Cultural & Language Exchange 🌸', nameAr: 'التبادل الثقافي واللغوي في كيوتو 🌸', host: 'Yuki Tanaka', listeners: 110, tags: ['Japanese', 'Arabic', 'Culture'] },
        { id: 'vr-jp-2', name: 'Tokyo Synthwave Coding Lab 🎹', nameAr: 'مختبر برمجة السينث-ويف بطوكيو 🎹', host: 'Kenji Sato', listeners: 67, tags: ['Art', 'Minimalism', 'WebAudio'] }
      ],
      liveStreams: [
        { id: 'ls-jp-1', title: 'Live drawing: 4k Anime landscapes inside browser canvas', titleAr: 'رسم مباشر: مناظر طبيعية للأنمي بدقة 4K عبر كانفاس المتصفح', streamer: 'YukiVector', viewers: 680, category: 'Art' }
      ],
      events: [
        { id: 'ev-jp-1', title: 'Tokyo Indie Games Show & Co-op Arena 🎮', titleAr: 'معرض ألعاب طوكيو المستقلة واللعب التشاركي 🎮', type: 'tournament', typeLabel: 'Gaming Tournament', typeLabelAr: 'بطولة ألعاب', date: 'Aug 10, 2026', time: '14:00', joined: false }
      ],
      trendingTopics: ['#ZenDesign', '#TokyoGameDev', '#LanguageSwap', '#AnimeCanvas', '#WebAudioSynth'],
      trendingTopicsAr: ['#تصميم_الزين', '#ألعاب_طوكيو', '#تبادل_لغات', '#لوحات_الأنمي', '#موجات_الويب'],
      popularCreators: [
        { name: 'Yuki Tanaka', nameAr: 'يوكي تاناكا', role: 'Culture Ambassador & Linguist', roleAr: 'سفيرة الثقافات واللغويات', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
        { name: 'Kenji Sato', nameAr: 'كنجي ساتو', role: 'Zen UI & Vector Artist', roleAr: 'فنان الرسوم والواجهات البسيطة', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Zen-style digital minimalism and WebAudio spatial synthesizers are trending among Kyoto creators. UI layouts with generous space and circular motifs have the highest praise.",
        ar: "تصاميم المينيماليزم الرقمي المستوحاة من فلسفة الزين ومولّدات الصوت ثلاثية الأبعاد تتصدر اهتمامات المبدعين في كيوتو."
      },
      aiFunFacts: {
        en: "Tokyo users have created over 350 customized ambient wave audio rooms! They utilize browser sound frequencies to aid meditation while coding.",
        ar: "أنشأ مستخدمو طوكيو أكثر من 350 غرفة صوتية كوزمية هادئة! يستعينون بترددات الصوت المخصصة للمساعدة في الاسترخاء والتركيز أثناء البرمجة."
      }
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    nameAr: 'ألمانيا',
    lat: 51.1657,
    lon: 10.4515,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    glowColor: '#c084fc',
    details: {
      id: 'germany',
      name: 'Germany',
      nameAr: 'ألمانيا',
      flag: '🇩🇪',
      onlineCount: 1530,
      activeCommunities: ['DevOps & Scalability League', 'Berlin Synthesizer Engineers', 'E-Sports League Europe', 'Clean Code Advocates'],
      activeCommunitiesAr: ['مهندسي السيرفرات وإدارة التوسع', 'مهندسي السينث في برلين', 'رابطة الرياضة الإلكترونية في أوروبا', 'أنصار الكود النظيف والمثالي'],
      liveVoiceRooms: [
        { id: 'vr-ger-1', name: 'Berlin Techno Sync & Deep Chats 🎧', nameAr: 'إيقاع تكنو برلين ونقاشات برمجية عميقة 🎧', host: 'Michael Schmitt', listeners: 198, tags: ['DevOps', 'Docker', 'Synthesizers'] },
        { id: 'vr-ger-2', name: 'Munich Clean Architecture Roundtable ⚙️', nameAr: 'طاولة حوار معماريات البرمجيات النظيفة بميونيخ ⚙️', host: 'Hannah Weber', listeners: 74, tags: ['Java', 'TypeScript', 'CleanCode'] }
      ],
      liveStreams: [
        { id: 'ls-ger-1', title: 'Live coding: Custom Linux system modules on Raspberry Pi', titleAr: 'برمجة مباشرة: بناء موديولات نظام لينكس مخصصة لـ Raspberry Pi', streamer: 'MichaelDevOps', viewers: 340, category: 'Coding' }
      ],
      events: [
        { id: 'ev-ger-1', title: 'Berlin Digital Synth & WebAudio Workshop 🎹', titleAr: 'ورشة عمل مولدات الصوت الرقمية والويب ببرلين 🎹', type: 'educational', typeLabel: 'Educational Session', typeLabelAr: 'جلسة تعليمية', date: 'Jul 21, 2026', time: '17:00', joined: false }
      ],
      trendingTopics: ['#CleanArchitecture', '#DockerSecrets', '#WebAudioSynths', '#DevOpsScalability'],
      trendingTopicsAr: ['#المعمارية_النظيفة', '#أسرار_دوكر', '#سينث_الويب', '#توسيع_السيرفرات'],
      popularCreators: [
        { name: 'Michael Schmitt', nameAr: 'مايكل شميت', role: 'DevOps Master & Infrastructure Lead', roleAr: 'خبير DevOps وقائد البنية التحتية', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
        { name: 'Hannah Weber', nameAr: 'هانا ويبر', role: 'Clean Architect & Tech Blogger', roleAr: 'مهندسة برمجيات وكاتبة مقالات تقنية', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Strict clean-code compliance, automated CI/CD pipelines, and physical web synthesizer integrations are trending across Frankfurt and Berlin.",
        ar: "تتصدر برلين وفرانكفورت توجهات الالتزام الصارم بقواعد الكود النظيف، وبناء مسارات الأتمتة الكاملة، وتكامل مولّدات الصوت الفيزيائية."
      },
      aiFunFacts: {
        en: "Berlin developers are our biggest champions of custom hotkeys! They share custom keyboard layout mapping files regularly in our DevOps workspace.",
        ar: "يمثل مطورو برلين الأبطال الأكبر لمخططات لوحة المفاتيح المخصصة! يشاركون مخططات اختصاراتهم بانتظام في مساحة عمل DevOps لدينا."
      }
    }
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    lat: 23.4241,
    lon: 53.8478,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    glowColor: '#fbbf24',
    details: {
      id: 'uae',
      name: 'United Arab Emirates',
      nameAr: 'الإمارات العربية المتحدة',
      flag: '🇦🇪',
      onlineCount: 1640,
      activeCommunities: ['Dubai Tech Nomads', 'Fintech Innovations', 'Cosmic Travelers', 'Astro-Photography League'],
      activeCommunitiesAr: ['رحالة دبي الرقميين', 'ابتكارات التقنية المالية', 'مسافرو الكون والفضاء', 'رابطة التصوير الفلكي والنجوم'],
      liveVoiceRooms: [
        { id: 'vr-uae-1', name: 'Dubai Future Cities & Web3 Roundtable 🏙️', nameAr: 'طاولة حوار مدن المستقبل وتقنيات الويب ٣ بدبي 🏙️', host: 'Zayed Al-Nahyan', listeners: 165, tags: ['Web3', 'Blockchain', 'SaaS'] },
        { id: 'vr-uae-2', name: 'Desert Sky Photography & Deep Space 🌌', nameAr: 'جلسة حوار تصوير الصحراء وأعماق الفضاء 🌌', host: 'Lina Mansour', listeners: 112, tags: ['Astro', 'Physics', 'Lenses'] }
      ],
      liveStreams: [
        { id: 'ls-uae-1', title: 'Live stream: Capturing desert starry sky with custom cameras', titleAr: 'بث مباشر: رصد مجرة درب التبانة بكاميرات مطورة في صحراء دبي', streamer: 'AstroLina', viewers: 430, category: 'Art' }
      ],
      events: [
        { id: 'ev-uae-1', title: 'Dubai Web3 Future Tech Hackathon 🏆', titleAr: 'هاكاثون دبي لتقنيات المستقبل والويب ٣ 🏆', type: 'tournament', typeLabel: 'Tech Competition', typeLabelAr: 'منافسة تقنية', date: 'Jul 26, 2026', time: '09:00', joined: false }
      ],
      trendingTopics: ['#DubaiWeb3', '#FintechDubai', '#GalaxyPhotography', '#DesertStargazing'],
      trendingTopicsAr: ['#ويب٣_دبي', '#تقنيات_مالية', '#تصوير_المجرات', '#رصد_نجوم_الصحراء'],
      popularCreators: [
        { name: 'Lina Mansour', nameAr: 'لينا منصور', role: 'Astro-Photographer & Nomad', roleAr: 'رحالة ومصورة فلكية متميزة', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
        { name: 'Zayed Al-Nahyan', nameAr: 'زايد آل نهيان', role: 'Fintech Product Lead', roleAr: 'مدير منتجات التقنية المالية والويب ٣', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Dubai and Abu Dhabi show immense focus on Web3 scaling, decentralized app logic, and deep desert astronomy gatherings. Digital nomad meetups are growing rapidly.",
        ar: "تظهر دبي وأبوظبي اهتماماً عميقاً بتطوير تطبيقات الويب ٣، الأنظمة اللامركزية، وتجمعات رصد الفضاء في الصحراء الكونية. تجمعات الرحالة الرقميين تنمو بسرعة مذهلة."
      },
      aiFunFacts: {
        en: "Dubai tech nomads have logged active coworking sessions from over 45 high-rise cafes in downtown Dubai on Lodavia this month!",
        ar: "سجل رحالة دبي الرقميون جلسات عمل مشتركة مدهشة من أكثر من 45 مقهى شاهق الارتفاع بوسط دبي على لودافيا هذا الشهر!"
      }
    }
  },
  {
    id: 'egypt',
    name: 'Egypt',
    nameAr: 'مصر',
    lat: 26.8206,
    lon: 30.8025,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    glowColor: '#a78bfa',
    details: {
      id: 'egypt',
      name: 'Egypt',
      nameAr: 'مصر',
      flag: '🇪🇬',
      onlineCount: 1350,
      activeCommunities: ['Cairo Tech Innovators', 'Ancient History Digitalists', 'Node.js Developers Egypt', 'UI/UX Guild Cairo'],
      activeCommunitiesAr: ['مبتكري القاهرة التقنيين', 'رقمنة التاريخ القديم', 'مطوري نود بمصر', 'رابطة واجهات المستخدم بالقاهرة'],
      liveVoiceRooms: [
        { id: 'vr-eg-1', name: 'Cairo Node.js Core Chat 💻', nameAr: 'جلسة نقاش مطوري نود الأساسيين بالقاهرة 💻', host: 'Omar Farouk', listeners: 135, tags: ['Node', 'Backend', 'Scaling'] },
        { id: 'vr-eg-2', name: 'Digitizing Ancient Arts & Symbols 🎨', nameAr: 'رقمنة الرموز والفنون المصرية القديمة 🎨', host: 'Yasmin Sabry', listeners: 82, tags: ['Art', 'SVG', 'History'] }
      ],
      liveStreams: [
        { id: 'ls-eg-1', title: 'Live coding: Developing custom SVG map layout nodes', titleAr: 'برمجة مباشرة: بناء عقد خرائط تفاعلية بـ SVG', streamer: 'OmarBackend', viewers: 180, category: 'Coding' }
      ],
      events: [
        { id: 'ev-eg-1', title: 'Cairo Ancient Heritage Digital Art Exhibition 🎨', titleAr: 'معرض القاهرة للفنون الرقمية والتراث القديم 🎨', type: 'meetup', typeLabel: 'Art Show', typeLabelAr: 'معرض فني', date: 'Jul 29, 2026', time: '18:00', joined: false }
      ],
      trendingTopics: ['#CairoTech', '#AncientArtOnline', '#NodeEgypt', '#UIUXCairo'],
      trendingTopicsAr: ['#تقنية_القاهرة', '#رقمنة_التراث', '#نود_مصر', '#واجهات_القاهرة'],
      popularCreators: [
        { name: 'Omar Farouk', nameAr: 'عمر فاروق', role: 'Backend Core Engineer', roleAr: 'مهندس أنظمة خلفية متمرس', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
        { name: 'Yasmin Sabry', nameAr: 'ياسمين صبري', role: 'Historical UI & SVG Designer', roleAr: 'مصممة واجهات ورسوم تراثية تفاعلية', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
      ],
      aiTrendingInsights: {
        en: "Combining historic typography with modern digital layout rules is Cairo's top artistic trend, paired with a surge in backend Node.js performance testing.",
        ar: "دمج فنون الكتابة والتاريخ مع واجهات المستخدم الحديثة هي الصرعة الفنية الأبرز في القاهرة، إلى جانب فحص واختبار أداء السيرفرات بـ Node.js."
      },
      aiFunFacts: {
        en: "Our Egyptian developers have cataloged over 2,000 vector representations of historic symbols using HTML5 canvas directly on our platform!",
        ar: "صمم المطورون في مصر أكثر من 2,000 رسم توجيهي مذهل للرموز التاريخية باستخدام الـ Canvas مباشرة على منصتنا!"
      }
    }
  }
];

// Procedural Scattered Dots for Continental Outlines to create 3D globe wireframe/holo landmass
const continentDots: Array<{ lat: number; lon: number }> = [
  // North America
  { lat: 45, lon: -100 }, { lat: 40, lon: -110 }, { lat: 35, lon: -120 }, { lat: 50, lon: -90 },
  { lat: 55, lon: -80 }, { lat: 45, lon: -75 }, { lat: 35, lon: -80 }, { lat: 30, lon: -100 },
  { lat: 60, lon: -120 }, { lat: 65, lon: -100 }, { lat: 25, lon: -100 }, { lat: 40, lon: -90 },
  // South America
  { lat: -10, lon: -60 }, { lat: -20, lon: -50 }, { lat: -30, lon: -60 }, { lat: -5, lon: -50 },
  { lat: -15, lon: -45 }, { lat: -35, lon: -65 }, { lat: -45, lon: -70 }, { lat: 0, lon: -60 },
  { lat: -25, lon: -55 }, { lat: -12, lon: -70 },
  // Africa
  { lat: 10, lon: 20 }, { lat: 20, lon: 15 }, { lat: 15, lon: 30 }, { lat: 5, lon: 10 },
  { lat: 0, lon: 25 }, { lat: -15, lon: 20 }, { lat: -25, lon: 25 }, { lat: -30, lon: 20 },
  { lat: 5, lon: 38 }, { lat: 25, lon: 30 }, { lat: 28, lon: 25 }, { lat: -5, lon: 15 },
  // Europe & Middle East & Asia
  { lat: 55, lon: 15 }, { lat: 50, lon: 10 }, { lat: 48, lon: 5 }, { lat: 60, lon: 30 },
  { lat: 50, lon: 35 }, { lat: 40, lon: 30 }, { lat: 35, lon: 45 }, { lat: 25, lon: 45 },
  { lat: 30, lon: 35 }, { lat: 24, lon: 55 }, { lat: 15, lon: 45 }, { lat: 12, lon: 50 },
  { lat: 45, lon: 70 }, { lat: 50, lon: 90 }, { lat: 40, lon: 85 }, { lat: 55, lon: 110 },
  { lat: 60, lon: 120 }, { lat: 35, lon: 115 }, { lat: 30, lon: 105 }, { lat: 35, lon: 135 },
  { lat: 40, lon: 140 }, { lat: 45, lon: 142 }, { lat: 20, lon: 110 }, { lat: 10, lon: 105 },
  { lat: 15, lon: 75 }, { lat: 20, lon: 80 }, { lat: 5, lon: 80 }, { lat: 15, lon: 120 },
  // Australia
  { lat: -25, lon: 135 }, { lat: -30, lon: 140 }, { lat: -20, lon: 130 }, { lat: -33, lon: 150 },
  { lat: -18, lon: 142 }, { lat: -28, lon: 115 }, { lat: -32, lon: 120 }
];

// Static data for animated space stars backdrop and flowing atmosphere particles
const cosmicStars = [
  { cx: 45, cy: 55, r: 1.5, delay: '0s' },
  { cx: 75, cy: 325, r: 1, delay: '0.6s' },
  { cx: 335, cy: 75, r: 2, delay: '1.4s' },
  { cx: 355, cy: 295, r: 1.2, delay: '0.8s' },
  { cx: 85, cy: 145, r: 1, delay: '2.2s' },
  { cx: 315, cy: 225, r: 1.5, delay: '1.6s' },
  { cx: 125, cy: 35, r: 2.2, delay: '0.4s' },
  { cx: 285, cy: 355, r: 1.2, delay: '2.8s' },
  { cx: 35, cy: 235, r: 1, delay: '1.9s' },
  { cx: 365, cy: 135, r: 1.8, delay: '1.0s' },
];

const floatingParticles = [
  { cx: 145, cy: 245, r: 2, xDrift: '40px', yDrift: '-55px', duration: '7s', delay: '0s' },
  { cx: 225, cy: 175, r: 1.5, xDrift: '-35px', yDrift: '-45px', duration: '9s', delay: '2s' },
  { cx: 175, cy: 115, r: 2.5, xDrift: '55px', yDrift: '-35px', duration: '8s', delay: '1s' },
  { cx: 255, cy: 275, r: 1.8, xDrift: '-45px', yDrift: '-65px', duration: '10s', delay: '3s' },
];

interface LumoWorldProps {
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  lang: 'ar' | 'en';
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  setActiveTab: (tab: any) => void;
}

export default function LumoWorld({ 
  currentUser, 
  setCurrentUser, 
  lang, 
  playSynthSound,
  setActiveTab
}: LumoWorldProps) {

  // Selection & Mode State
  const [selectedHub, setSelectedHub] = useState<MapHub>(mapHubs[0]);
  const [mapMode, setMapMode] = useState<'globe' | 'flat'>('globe');

  // 3D Globe States
  const [rotation, setRotation] = useState<number>(0);
  const [tilt, setTilt] = useState<number>(15); // latitude tilt in degrees
  const [zoom, setZoom] = useState<number>(140); // Globe Radius in px
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; r: number; t: number }>({ x: 0, y: 0, r: 0, t: 0 });

  // High-fidelity inertia physics tracking refs
  const lastTimeRef = useRef<number>(0);
  const lastRotationRef = useRef<number>(0);
  const spinVelocityRef = useRef<number>(0.5); // Initial velocity matching slow auto rotate
  const lastClientXRef = useRef<number>(0);

  // Map Filter Options
  const [filterType, setFilterType] = useState<'all' | 'rooms' | 'streams' | 'events'>('all');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string>('All');

  // Interactive Panel States
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<LiveVoiceRoom | null>(null);
  const [joinedVoiceRoomId, setJoinedVoiceRoomId] = useState<string | null>(null);
  const [simulatedStreamId, setSimulatedStreamId] = useState<string | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [discoveryProfiles, setDiscoveryProfiles] = useState<any[]>([]);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  // Telemetry animation
  const [telemetryTime, setTelemetryTime] = useState<string>('');
  const [telemetrySignalStrength, setTelemetrySignalStrength] = useState<number>(98);

  // Generate Simulated live coordinates feeds for the background grid
  const [livePings, setLivePings] = useState<Array<{ x: number; y: number; opacity: number; label: string }>>([]);

  // Inertia and Auto Rotation physics loop for 3D Globe
  useEffect(() => {
    let animationId: any;
    if (mapMode === 'globe') {
      const tick = () => {
        if (!isDragging) {
          // If we have spin momentum from dragging, apply friction
          if (Math.abs(spinVelocityRef.current) > 0.5) {
            spinVelocityRef.current *= 0.96; // very high quality inertia decay
            setRotation(prev => (prev + spinVelocityRef.current + 360) % 360);
          } else if (autoRotate) {
            // Fades back to the slow, steady autoRotate speed (0.5)
            const targetAutoSpeed = spinVelocityRef.current >= 0 ? 0.5 : -0.5;
            spinVelocityRef.current = spinVelocityRef.current * 0.9 + targetAutoSpeed * 0.1;
            setRotation(prev => (prev + spinVelocityRef.current + 360) % 360);
          } else {
            // No autoRotate, decay all the way to 0
            if (Math.abs(spinVelocityRef.current) > 0.01) {
              spinVelocityRef.current *= 0.95;
              setRotation(prev => (prev + spinVelocityRef.current + 360) % 360);
            }
          }
        }
        animationId = requestAnimationFrame(tick);
      };
      animationId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate, isDragging, mapMode]);

  // Live telemetry timer & pings simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTelemetryTime(now.toISOString().replace('T', ' ').substring(0, 19));
      setTelemetrySignalStrength(prev => {
        const offset = Math.floor(Math.random() * 5) - 2;
        return Math.min(100, Math.max(85, prev + offset));
      });

      // Spawn random simulated activity pings across flat map screen
      if (Math.random() > 0.4) {
        const rx = Math.random() * 100;
        const ry = Math.random() * 100;
        const labels = ['VOICE_NODE_OPEN', 'STREAM_UP', 'PACKET_TRANS', 'USER_JOIN', 'COMPILER_COMPILE'];
        const pingLabel = labels[Math.floor(Math.random() * labels.length)];
        
        setLivePings(prev => [
          { x: rx, y: ry, opacity: 1, label: pingLabel },
          ...prev.slice(0, 5)
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update friend discovery roster based on selected country
  useEffect(() => {
    generateDiscoveryProfiles();
  }, [selectedHub]);

  const generateDiscoveryProfiles = () => {
    // Generate simulated dynamic tech builders matching selected country properties
    const names = {
      saudi: [
        { name: 'Khaled Al-Najjar', nameAr: 'خالد النجار', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', interests: ['Next.js', 'Rust', 'SaaS'], languages: ['Arabic', 'English'] },
        { name: 'Reem Al-Qahtani', nameAr: 'ريم القحطاني', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', interests: ['UI/UX', 'Figma', 'Framer'], languages: ['Arabic', 'English'] },
        { name: 'Hassan Al-Harbi', nameAr: 'حسن الحربي', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', interests: ['AI', 'Python', 'Machine Learning'], languages: ['Arabic'] }
      ],
      usa: [
        { name: 'Tyler Durden', nameAr: 'تايلر ديردن', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', interests: ['TypeScript', 'Docker', 'Go'], languages: ['English'] },
        { name: 'Clara Oswald', nameAr: 'كلارا أوزوالد', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', interests: ['Product Management', 'SaaS'], languages: ['English', 'German'] }
      ],
      japan: [
        { name: 'Hiroshi Tanaka', nameAr: 'هيروشي تاناكا', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', interests: ['Unity', 'C#', 'Gaming'], languages: ['Japanese'] },
        { name: 'Asuka Soryu', nameAr: 'أسوكا سوريو', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', interests: ['Minimalist CSS', 'Svelte'], languages: ['Japanese', 'English'] }
      ],
      germany: [
        { name: 'Lukas Meier', nameAr: 'لوكاس ماير', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', interests: ['Kubernetes', 'Go', 'DevOps'], languages: ['German', 'English'] },
        { name: 'Mia Schmidt', nameAr: 'ميا شميت', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', interests: ['Next.js', 'Tailwind', 'Three.js'], languages: ['German', 'English'] }
      ],
      uae: [
        { name: 'Fatima Al-Suwaidi', nameAr: 'فاطمة السويدي', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', interests: ['Web3', 'Ethereum', 'Solidity'], languages: ['Arabic', 'English'] },
        { name: 'Zain Al-Mansoori', nameAr: 'زين المنصوري', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', interests: ['Startup Operations', 'Venture Capital'], languages: ['Arabic', 'English'] }
      ],
      egypt: [
        { name: 'Mostafa Kamel', nameAr: 'مصطفى كامل', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', interests: ['MERN Stack', 'Redux', 'APIs'], languages: ['Arabic', 'English'] },
        { name: 'Salma El-Sayed', nameAr: 'سلمى السيد', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', interests: ['UI/UX', 'Digital Art', 'Figma'], languages: ['Arabic', 'French'] }
      ]
    };

    const rosters = names[selectedHub.id as keyof typeof names] || names.saudi;
    setDiscoveryProfiles(rosters);
  };

  // Convert 3D spherical point to 2D screen coordinate
  const project3DTo2D = (lat: number, lon: number, r: number, rotDeg: number, tiltDeg: number, centerCX = 200, centerCY = 200): ProjectedPoint => {
    // 1. Convert lat/lon to Radians
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    const theta = (rotDeg * Math.PI) / 180;
    const psi = (tiltDeg * Math.PI) / 180;

    // 2. Base Cartesian spherical coordinates
    // We assume standard coordinate alignment
    const x0 = Math.cos(phi) * Math.sin(lambda);
    const y0 = Math.sin(phi);
    const z0 = Math.cos(phi) * Math.cos(lambda);

    // 3. Rotate around X-axis (Tilt) by angle psi
    const x1 = x0;
    const y1 = y0 * Math.cos(psi) - z0 * Math.sin(psi);
    const z1 = y0 * Math.sin(psi) + z0 * Math.cos(psi);

    // 4. Rotate around Y-axis (Rotation/Spin) by angle theta
    const x2 = x1 * Math.cos(theta) + z1 * Math.sin(theta);
    const y2 = y1;
    const z2 = -x1 * Math.sin(theta) + z1 * Math.cos(theta);

    // 5. Check if on front hemisphere (z2 > 0)
    // Scale on screen using Globe Radius
    const screenX = centerCX + r * x2;
    const screenY = centerCY - r * y2;

    return {
      x: screenX,
      y: screenY,
      z: z2,
      visible: z2 > 0
    };
  };

  // Drag handles for Globe Manual rotation with momentum calculations
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setAutoRotate(false);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      r: rotation,
      t: tilt
    };
    lastTimeRef.current = performance.now();
    lastRotationRef.current = rotation;
    lastClientXRef.current = e.clientX;
    spinVelocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Adjust rotation (horizontal drag mapped to Y rotation) and tilt (vertical drag to X tilt)
    const newRotation = (dragStart.current.r + dx * 0.4 + 360) % 360;
    setRotation(newRotation);
    setTilt(Math.max(-45, Math.min(45, dragStart.current.t - dy * 0.4)));

    // Measure instant dragging velocity for inertia momentum
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 10) {
      let diff = newRotation - lastRotationRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const instantVelocity = (diff / dt) * 16.666; // Scale to degrees per typical frame duration
      // Apply momentum filter
      spinVelocityRef.current = spinVelocityRef.current * 0.35 + instantVelocity * 0.65;

      lastTimeRef.current = now;
      lastRotationRef.current = newRotation;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for mobile dragging with momentum calculations
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    setAutoRotate(false);
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      r: rotation,
      t: tilt
    };
    lastTimeRef.current = performance.now();
    lastRotationRef.current = rotation;
    lastClientXRef.current = e.touches[0].clientX;
    spinVelocityRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;

    const newRotation = (dragStart.current.r + dx * 0.4 + 360) % 360;
    setRotation(newRotation);
    setTilt(Math.max(-45, Math.min(45, dragStart.current.t - dy * 0.4)));

    // Measure touch dragging velocity
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 10) {
      let diff = newRotation - lastRotationRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const instantVelocity = (diff / dt) * 16.666;
      spinVelocityRef.current = spinVelocityRef.current * 0.35 + instantVelocity * 0.65;

      lastTimeRef.current = now;
      lastRotationRef.current = newRotation;
    }
  };

  // Join Voice Room Instant Action
  const handleJoinVoiceRoom = (room: LiveVoiceRoom) => {
    playSynthSound(587.33, 'sine', 0.15); // D5
    setTimeout(() => playSynthSound(880, 'sine', 0.25), 100); // A5
    setJoinedVoiceRoomId(room.id);
    setActiveVoiceRoom(room);
  };

  const handleLeaveVoiceRoom = () => {
    playSynthSound(440, 'sine', 0.15);
    setJoinedVoiceRoomId(null);
    setActiveVoiceRoom(null);
  };

  // Register / Join Event Directly
  const handleJoinEvent = (event: CountryEvent) => {
    playSynthSound(659.25, 'triangle', 0.15); // E5
    setTimeout(() => playSynthSound(1046.50, 'sine', 0.2), 100); // C6
    
    if (joinedEvents.includes(event.id)) {
      setJoinedEvents(prev => prev.filter(id => id !== event.id));
    } else {
      setJoinedEvents(prev => [...prev, event.id]);
    }
  };

  // Toggle Connections on Discovery Profiles
  const handleToggleConnect = (profileId: string) => {
    playSynthSound(880, 'sine', 0.08);
    if (connectedIds.includes(profileId)) {
      setConnectedIds(prev => prev.filter(id => id !== profileId));
    } else {
      setConnectedIds(prev => [...prev, profileId]);
    }
  };

  // Map Filter computation for locations
  const getFilteredMapHubs = () => {
    return mapHubs.filter(hub => {
      // Filter by language overlay
      if (selectedLanguageFilter !== 'All') {
        const matchingLanguages = hub.details.popularCreators.some(creator => 
          creator.nameAr.includes(selectedLanguageFilter) || creator.name.includes(selectedLanguageFilter)
        );
        // Fallback checks
        if (selectedLanguageFilter === 'Arabic' && hub.id !== 'saudi' && hub.id !== 'uae' && hub.id !== 'egypt' && hub.id !== 'japan') return false;
        if (selectedLanguageFilter === 'German' && hub.id !== 'germany' && hub.id !== 'usa') return false;
        if (selectedLanguageFilter === 'Japanese' && hub.id !== 'japan') return false;
      }

      // Filter by dynamic activities inside country details
      if (filterType === 'rooms' && hub.details.liveVoiceRooms.length === 0) return false;
      if (filterType === 'streams' && hub.details.liveStreams.length === 0) return false;
      if (filterType === 'events' && hub.details.events.length === 0) return false;

      return true;
    });
  };

  const activeHubs = getFilteredMapHubs();

  return (
    <div className="w-full text-slate-100 flex flex-col min-h-screen pb-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* HEADER CONTROLS SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/35 dark:bg-[#090812]/45 backdrop-blur-xl border border-white/10 dark:border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_15px_45px_rgba(0,0,0,0.35)] shadow-purple-950/10 mb-8 transition-all duration-300 hover:shadow-[0_20px_55px_rgba(124,58,237,0.1)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex items-start gap-4 flex-1">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 border border-white/20">
            <Globe className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'مستكشف عالم لودافيا الكوني 🪐' : 'Lodavia Cosmic World Explorer 🪐'}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {lang === 'ar' 
                ? 'استكشف خارطة الأنشطة الرقمية والتواصل الفوري حول العالم. تفاعل مع غرف المحادثة المباشرة، البثوث التقنية الحية، والمطابقات الودية بناء على التوزيع الجغرافي الذكي.'
                : 'Immerse yourself in a holographic, real-time activity landscape across major digital hubs. Hop into live voice rooms, spectate ongoing dev streams, and discover developers globally.'}
            </p>
          </div>
        </div>

        {/* View mode selectors: 3D Hologlobe or High-Tech Flat Radar Map */}
        <div className="flex bg-slate-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-1 z-10 shrink-0 w-full md:w-auto">
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setMapMode('globe');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mapMode === 'globe' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-white/10' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الكرة الكونية ثلاثية الأبعاد' : '3D Hologlobe'}</span>
          </button>
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setMapMode('flat');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mapMode === 'flat' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-lg border border-white/10' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الرادار المسطح ثنائي الأبعاد' : 'High-Tech Flat Radar'}</span>
          </button>
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setActiveTab('lodavia-match');
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-slate-400 hover:text-white"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{lang === 'ar' ? 'المطابقة الذكية' : 'Smart Match'}</span>
          </button>
        </div>
      </div>

      {/* DETAILED ACTIVE FILTER BAR */}
      <div className="glass-panel p-4.5 rounded-3xl border border-white/10 bg-slate-900/30 dark:bg-black/30 backdrop-blur-xl flex flex-wrap gap-4 items-center justify-between mb-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_0_rgba(39,211,255,0.08)] transition-all duration-300">
        
        {/* Filters and Search buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'التصفية الفلكية:' : 'Cosmic Filters:'}</span>
          </span>

          <div className="flex bg-slate-950/40 border border-white/10 rounded-xl p-0.5">
            {(['all', 'rooms', 'streams', 'events'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  playSynthSound(450, 'sine', 0.03);
                  setFilterType(t);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  filterType === t 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : ''}
                {t === 'rooms' ? (lang === 'ar' ? 'الغرف الصوتية' : 'Voice Rooms') : ''}
                {t === 'streams' ? (lang === 'ar' ? 'البث المباشر' : 'Live Streams') : ''}
                {t === 'events' ? (lang === 'ar' ? 'الفعاليات' : 'Events') : ''}
              </button>
            ))}
          </div>

          {/* Language and interest overlays */}
          <select
            value={selectedLanguageFilter}
            onChange={(e) => {
              playSynthSound(400, 'sine', 0.04);
              setSelectedLanguageFilter(e.target.value);
            }}
            className="bg-slate-950/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">{lang === 'ar' ? 'جميع اللغات' : 'All Languages'}</option>
            <option value="Arabic">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
            <option value="English">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
            <option value="Japanese">{lang === 'ar' ? 'اليابانية' : 'Japanese'}</option>
            <option value="German">{lang === 'ar' ? 'الألمانية' : 'German'}</option>
          </select>
        </div>

        {/* Live system telemetry line */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400">{lang === 'ar' ? 'الإشارة الكونية:' : 'SIGNAL:'} {telemetrySignalStrength}%</span>
          </div>
          <div className="hidden sm:block">
            <span>{lang === 'ar' ? 'الزمن الفلكي:' : 'UTC_COSMOS:'} {telemetryTime}</span>
          </div>
        </div>
      </div>

      {/* CORE DISPLAY: MAP & DATA SPLIT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Map Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/20 dark:bg-black/40 backdrop-blur-2xl relative overflow-hidden flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_60px_rgba(39,211,255,0.1)] transition-all duration-500">
            
            {/* PREMIUM COSMIC DEEP-SPACE BACKDROP */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
              <style>{`
                @keyframes cosmicSlowDrift {
                  0% { transform: translate(0, 0) scale(1); opacity: 0; }
                  15% { opacity: 0.35; }
                  85% { opacity: 0.35; }
                  100% { transform: translate(40px, -40px) scale(1.1); opacity: 0; }
                }
                @keyframes starTwinkleBack {
                  0%, 100% { opacity: 0.25; }
                  50% { opacity: 0.85; }
                }
                @keyframes nebulaPulse {
                  0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.12; }
                  50% { transform: scale(1.08) translate(10px, -5px); opacity: 0.18; }
                }
                .animate-nebula-1 {
                  animation: nebulaPulse 12s ease-in-out infinite alternate;
                }
                .animate-nebula-2 {
                  animation: nebulaPulse 16s ease-in-out infinite alternate-reverse;
                }
                .animate-bg-star {
                  animation: starTwinkleBack 4s ease-in-out infinite alternate;
                }
                .animate-cosmic-drift {
                  animation: cosmicSlowDrift infinite linear;
                }
              `}</style>

              {/* 1. Deep space ambient glow / nebula gradients */}
              <div className="absolute -top-12 -left-12 w-[380px] h-[380px] rounded-full bg-cyan-500/10 blur-[90px] mix-blend-screen animate-nebula-1" />
              <div className="absolute -bottom-16 -right-16 w-[420px] h-[420px] rounded-full bg-purple-600/10 blur-[100px] mix-blend-screen animate-nebula-2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-violet-500/5 blur-[80px] mix-blend-screen animate-nebula-1" style={{ animationDelay: '2s' }} />

              {/* 2. Tiny twinkling stars / galaxy dust */}
              <svg className="absolute inset-0 w-full h-full opacity-70">
                {Array.from({ length: 40 }).map((_, i) => {
                  const x = (i * 19) % 100;
                  const y = (i * 29) % 100;
                  const r = 0.5 + ((i * 7) % 6) * 0.15; // 0.5px to 1.4px
                  const delay = ((i * 13) % 25) * 0.15;
                  const duration = 2.5 + ((i * 11) % 4);
                  return (
                    <circle
                      key={`bg-star-${i}`}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={r}
                      fill="#ffffff"
                      opacity={0.25 + ((i * 3) % 5) * 0.12}
                      className="animate-bg-star"
                      style={{
                        animationDelay: `${delay}s`,
                        animationDuration: `${duration}s`
                      }}
                    />
                  );
                })}
              </svg>

              {/* 3. Calm atmosphere subtle glow vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,5,0.85)_95%)]" />

              {/* 4. Soft moving cosmic dust / particles */}
              {Array.from({ length: 10 }).map((_, i) => {
                const startX = (i * 21) % 95;
                const startY = 30 + ((i * 17) % 65);
                const size = 1.5 + ((i * 3) % 3); // 1.5px to 3.5px
                const duration = 14 + ((i * 7) % 12);
                const delay = ((i * 9) % 12);
                return (
                  <div
                    key={`bg-dust-${i}`}
                    className="absolute rounded-full bg-cyan-400/20 blur-[0.5px] animate-cosmic-drift"
                    style={{
                      left: `${startX}%`,
                      top: `${startY}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`
                    }}
                  />
                );
              })}
            </div>

            {/* Top action layout info */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>{lang === 'ar' ? 'محور التحكم التفاعلي' : 'COSMIC CORDS ENABLED'}</span>
              </div>
              
              {mapMode === 'globe' && (
                <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-purple-400 flex items-center gap-1.5">
                  <span>{lang === 'ar' ? 'تعديل التدوير يدوي متاح' : 'DRAG TO ROTATE GLOBE'}</span>
                </div>
              )}
            </div>

            {/* BACKGROUND TELEMETRY LABELS AND DECORATIONS */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border-t border-l border-white/30 text-[8px] font-mono p-1">
                  {i % 4 === 0 && `0X${i.toString(16).toUpperCase()}`}
                </div>
              ))}
            </div>

            {/* Interactive Canvas/ThreeJS Stage */}
            <div className="w-full relative flex justify-center items-center py-2 select-none min-h-[440px]">
              
              {mapMode === 'globe' ? (
                // 1. 3D REALISTIC INTERACTIVE EARTH VIEW
                <LodaviaGlobe3D
                  lang={lang}
                  selectedHub={selectedHub}
                  setSelectedHub={setSelectedHub}
                  activeHubs={activeHubs}
                  playSynthSound={playSynthSound}
                  autoRotate={autoRotate}
                  setAutoRotate={setAutoRotate}
                  zoom={zoom}
                  setZoom={setZoom}
                />
              ) : (
                // 2. FLAT GRID RADAR VIEW
                <div className="w-full aspect-[16/10] bg-[#030206] border border-white/5 rounded-2xl relative flex items-center justify-center overflow-hidden p-2">
                  
                  {/* Holographic scanning vertical swipe bar */}
                  <motion.div 
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-500/30 shadow-lg shadow-cyan-500/50 pointer-events-none z-10"
                    animate={{
                      left: ['0%', '100%', '0%']
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />

                  {/* Grid squares */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-[0.03] pointer-events-none">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="border border-white" />
                    ))}
                  </div>

                  {/* Random scattered coordinates pings */}
                  {livePings.map((ping, i) => (
                    <motion.div
                      key={i}
                      className="absolute px-2 py-0.5 rounded-md border border-cyan-500/20 bg-cyan-500/5 text-[6.5px] font-mono text-cyan-400 pointer-events-none"
                      style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
                      initial={{ opacity: 1, scale: 0.8 }}
                      animate={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                      {ping.label}
                    </motion.div>
                  ))}

                  {/* Stylized vector path outlines representation of regions */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.25]">
                    <svg viewBox="0 0 800 400" className="w-full h-full fill-none stroke-cyan-500/20 stroke-1">
                      {/* Stylized geometric shapes simulating world continents */}
                      {/* Americas */}
                      <path d="M 120 80 L 220 80 L 190 200 L 120 200 Z" />
                      <path d="M 190 200 L 250 250 L 200 380 L 170 380 Z" />
                      {/* Africa */}
                      <path d="M 380 200 L 450 180 L 480 240 L 450 320 L 410 320 Z" />
                      {/* Europe */}
                      <path d="M 360 80 L 440 70 L 460 140 L 370 150 Z" />
                      {/* Asia */}
                      <path d="M 460 100 L 680 70 L 720 220 L 520 240 Z" />
                      {/* Oceania */}
                      <path d="M 640 280 L 720 280 L 750 350 L 670 360 Z" />
                    </svg>
                  </div>

                  {/* Connecting high-tech glowing vectors */}
                  <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    {/* Draw real-time connections from active hubs on flat coordinates */}
                    {activeHubs.map((hub, idx) => {
                      if (idx === activeHubs.length - 1) return null;
                      const next = activeHubs[idx + 1];
                      // Normalize lat/lon coordinates to flat percentage coordinates
                      // Lat: +90 (top) to -90 (bottom), Lon: -180 (left) to +180 (right)
                      const x1 = ((hub.lon + 180) / 360) * 800;
                      const y1 = ((90 - hub.lat) / 180) * 400;
                      const x2 = ((next.lon + 180) / 360) * 800;
                      const y2 = ((90 - next.lat) / 180) * 400;

                      return (
                        <g key={idx}>
                          <line 
                            x1={x1} y1={y1} x2={x2} y2={y2} 
                            stroke={hub.glowColor} 
                            strokeOpacity="0.25" 
                            strokeWidth="1.5"
                            strokeDasharray="6 4"
                          />
                          <motion.circle 
                            r="3" 
                            fill="#ffffff" 
                            animate={{
                              cx: [x1, x2],
                              cy: [y1, y2]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: idx * 0.7
                            }}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* ACTIVE HUBS LABELS ON FLAT COORDINATES */}
                  {activeHubs.map((hub) => {
                    const fx = ((hub.lon + 180) / 360) * 100;
                    const fy = ((90 - hub.lat) / 180) * 100;
                    const isSelected = selectedHub.id === hub.id;

                    return (
                      <div
                        key={hub.id}
                        className="absolute cursor-pointer transition-all z-20"
                        style={{ left: `${fx}%`, top: `${fy}%`, transform: 'translate(-50%, -50%)' }}
                        onClick={() => {
                          playSynthSound(587.33, 'sine', 0.1);
                          setSelectedHub(hub);
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          {/* Pulse */}
                          <div className={`absolute w-8 h-8 rounded-full border opacity-50 animate-ping ${
                            isSelected ? 'border-purple-400' : 'border-cyan-400'
                          }`} />
                          
                          {/* Dot */}
                          <div className={`w-3.5 h-3.5 rounded-full border-2 border-[#050508] shadow-lg ${
                            isSelected ? 'bg-purple-400 scale-125' : 'bg-cyan-400'
                          }`} />

                          {/* Float Label */}
                          <div className={`absolute bottom-5 px-2 py-1 rounded-lg text-[8px] font-black border backdrop-blur-md flex items-center gap-1 shrink-0 ${
                            isSelected 
                              ? 'bg-purple-950/90 border-purple-400 text-white shadow-purple-500/25 shadow-md' 
                              : 'bg-black/80 border-white/10 text-slate-200'
                          }`} style={{ whiteSpace: 'nowrap' }}>
                            <span>{hub.details.flag}</span>
                            <span>{lang === 'ar' ? hub.nameAr.substring(0, 10) : hub.name}</span>
                            <span className="text-emerald-400">● {hub.details.onlineCount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* ACTIVE LIVE VIDEO STREAM POPUP (IF OPENED) */}
          <AnimatePresence>
            {simulatedStreamId && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-5 rounded-3xl border border-white/10 bg-slate-950/40 dark:bg-[#07060c]/50 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_30px_70px_rgba(168,85,247,0.15)]"
              >
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-rose-500">{lang === 'ar' ? 'مشاهدة البث التقني المباشر' : 'SPECTATING LIVE DEV STREAM'}</span>
                  </div>
                  <button 
                    onClick={() => { playSynthSound(300, 'sine', 0.1); setSimulatedStreamId(null); }}
                    className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Streaming Simulated Screen Code Terminal */}
                  <div className="md:col-span-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 relative overflow-hidden min-h-[180px] flex flex-col justify-between">
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-500 text-white font-sans text-[8px] font-bold">
                      LIVE
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <p className="text-slate-500">// Lodavia Compiler Stream output initialized...</p>
                      <p className="text-cyan-400"># cargo build --release --target=wasm32-unknown-unknown</p>
                      <p className="text-slate-300">   Compiling lodavia-spatial-core v0.4.1 (https://github.com/lodavia/core)</p>
                      <p className="text-slate-300">   Compiling lodavia-audio-synths v1.2.0 (device target: WebAudio API)</p>
                      <motion.p 
                        className="text-emerald-400"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        [✓] WebAssembly compilation successful. Output chunks size: 342.1 Kb
                      </motion.p>
                      <p className="text-purple-400">Incoming spatial audio wave frequencies calculated on node: 432Hz</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-slate-500">
                      <span>FPS: 60.00</span>
                      <span>LATENCY: 12ms</span>
                    </div>
                  </div>

                  {/* Chat / Info sidebar of Stream */}
                  <div className="md:col-span-4 flex flex-col justify-between p-1">
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {lang === 'ar' ? 'غرفة محادثة البث' : 'Stream Live Chat'}
                      </h4>
                      <div className="space-y-2 mt-2 max-h-[110px] overflow-y-auto text-[9px] text-slate-400">
                        <p><span className="text-cyan-400 font-bold">@coder_99:</span> absolute masterclass in rust compilers!</p>
                        <p><span className="text-purple-400 font-bold">@space_lover:</span> can we deploy this to edge containers?</p>
                        <p><span className="text-emerald-400 font-bold">@lumo_fan:</span> nice work, looks super clean.</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 mt-3 flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder={lang === 'ar' ? 'اكتب في الدردشة...' : 'Type in chat...'}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[9px] focus:outline-none focus:border-cyan-500 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            playSynthSound(700, 'sine', 0.05);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={() => playSynthSound(880, 'sine', 0.05)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[9px] cursor-pointer"
                      >
                        {lang === 'ar' ? 'إرسال' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Active Country Information Drawer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Space Command Centre */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/30 dark:bg-[#0a0a12]/75 backdrop-blur-2xl flex flex-col gap-5 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(124,58,237,0.1)] transition-all duration-500">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-md">{selectedHub.details.flag}</span>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-400/20">{lang === 'ar' ? 'الموقع الفلكي المحدد' : 'SELECTED HUB LOCATION'}</span>
                  <h2 className="text-lg md:text-xl font-black text-white mt-1">
                    {lang === 'ar' ? selectedHub.details.nameAr : selectedHub.details.name}
                  </h2>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedHub.details.onlineCount} {lang === 'ar' ? 'متصل' : 'ONLINE'}</span>
              </div>
            </div>

            {/* AI EXPLORER INSIGHTS BLOCK */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900/40 to-blue-950/30 border border-purple-500/30 dark:border-purple-500/20 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.1)] transition-all duration-300">
              <div className="absolute top-2 right-2 text-purple-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                <span>🤖 {lang === 'ar' ? 'تقرير مستكشف الذكاء من Lodavia AI' : 'Lodavia AI Hub Assessment'}</span>
              </h3>
              
              <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-300">
                <p>
                  {lang === 'ar' ? selectedHub.details.aiTrendingInsights.ar : selectedHub.details.aiTrendingInsights.en}
                </p>
                
                <div className="p-2.5 rounded-xl bg-slate-950/40 dark:bg-black/40 border border-white/5 text-[10px] text-cyan-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>{lang === 'ar' ? selectedHub.details.aiFunFacts.ar : selectedHub.details.aiFunFacts.en}</p>
                </div>
              </div>
            </div>

            {/* ACTIVE MULTI-CHANNEL TABS FOR SELECTIONS (Voice, Streams, Events) */}
            <div className="space-y-4">
              
              {/* LIVE VOICE ROOMS */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'الغرف الصوتية المباشرة' : 'Live Voice Rooms'}</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{selectedHub.details.liveVoiceRooms.length} active</span>
                </h3>

                <div className="space-y-2">
                  {selectedHub.details.liveVoiceRooms.map((room) => {
                    const isJoined = joinedVoiceRoomId === room.id;
                    return (
                      <div 
                        key={room.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                          isJoined 
                            ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_20px_rgba(39,211,255,0.15)] backdrop-blur-md' 
                            : 'bg-white/5 dark:bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/10 dark:hover:bg-black/30 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {lang === 'ar' ? room.nameAr : room.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/10">
                              🎙️ {room.host}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              👥 {room.listeners} listening
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => isJoined ? handleLeaveVoiceRoom() : handleJoinVoiceRoom(room)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                            isJoined 
                              ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400'
                          }`}
                        >
                          {isJoined ? (lang === 'ar' ? 'مغادرة ❌' : 'Leave ❌') : (lang === 'ar' ? 'انضمام 🎙️' : 'Join 🎙️')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIVE DEVELOPER STREAMS */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ar' ? 'البث التقني المباشر' : 'Live Dev Streams'}</span>
                  </span>
                </h3>

                <div className="space-y-2">
                  {selectedHub.details.liveStreams.map((stream) => {
                    const isSpectating = simulatedStreamId === stream.id;
                    return (
                      <div 
                        key={stream.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                          isSpectating 
                            ? 'bg-purple-500/10 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md' 
                            : 'bg-white/5 dark:bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/10 dark:hover:bg-black/30 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md font-black">LIVE</span>
                          <h4 className="text-xs font-bold text-white truncate mt-1">
                            {lang === 'ar' ? stream.titleAr : stream.title}
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-1">
                            {stream.streamer} • <span className="text-purple-300 font-mono">{stream.viewers} spectating</span>
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            playSynthSound(680, 'sine', 0.1);
                            setSimulatedStreamId(isSpectating ? null : stream.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-[10px] bg-purple-600 hover:bg-purple-500 text-white font-black cursor-pointer transition-all active:scale-95 shadow-md shadow-purple-500/10"
                        >
                          {isSpectating ? (lang === 'ar' ? 'إغلاق ⏹' : 'Close ⏹') : (lang === 'ar' ? 'مشاهدة 📺' : 'Spectate 📺')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONFERENCES & EVENTS */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'الفعاليات والبطولات' : 'Events & Tournaments'}</span>
                  </span>
                </h3>

                <div className="space-y-2">
                  {selectedHub.details.events.map((event) => {
                    const hasJoined = joinedEvents.includes(event.id);
                    return (
                      <div 
                        key={event.id}
                        className="p-4 rounded-2xl border bg-white/5 dark:bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/10 dark:hover:bg-black/30 transition-all duration-300 hover:shadow-lg flex flex-col gap-2.5"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded-md border border-amber-400/20 bg-amber-400/5 text-amber-400 uppercase font-black">
                            {lang === 'ar' ? event.typeLabelAr : event.typeLabel}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">{event.date} @ {event.time}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white leading-relaxed">
                          {lang === 'ar' ? event.typeLabelAr : event.title}
                        </h4>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleJoinEvent(event)}
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black transition-all cursor-pointer ${
                              hasJoined 
                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/10' 
                                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200'
                            }`}
                          >
                            {hasJoined ? (lang === 'ar' ? 'مسجل ✓' : 'Registered ✓') : (lang === 'ar' ? 'تسجيل حضور' : 'Register / Join')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FRIEND DISCOVERY & NETWORKING */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'اكتشاف المبدعين والشركاء' : 'Local Builders Discovery'}</span>
                  </span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {discoveryProfiles.map((p, idx) => {
                    const isConnected = connectedIds.includes(p.name);
                    return (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl border bg-white/5 dark:bg-[#050508]/40 border-white/5 hover:border-white/15 hover:bg-white/10 dark:hover:bg-black/30 transition-all duration-300 hover:shadow-lg flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050508] animate-pulse" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-1">
                              <span>{lang === 'ar' ? p.nameAr : p.name}</span>
                            </h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.interests.slice(0, 2).map((interest: string, i: number) => (
                                <span key={i} className="text-[8px] font-mono text-slate-400 bg-white/5 px-1 rounded">
                                  #{interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleConnect(p.name)}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all cursor-pointer ${
                            isConnected 
                              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400'
                          }`}
                        >
                          {isConnected ? (lang === 'ar' ? 'متصل ✓' : 'Connected ✓') : (lang === 'ar' ? 'اتصال' : 'Connect')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER AD BANNER DECORATION */}
      <div className="mt-8 rounded-3xl p-6 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-slate-900/20 to-purple-950/20 text-cyan-200 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_35px_rgba(39,211,255,0.05)] backdrop-blur-md">
        <p className="leading-relaxed">
          🪐 <strong>{lang === 'ar' ? 'خارطة النشاط الموحدة:' : 'Unified Cosmic Ledger:'}</strong> {lang === 'ar' ? 'تتحرك النجوم في مدارات مثالية بناء على التعلم والمطابقة. كل مشروع ومساحة صوتية تنشئها تضيف جاذبية فلكية لحسابك الشخصي.' : 'Lodavia World maps real-time user connections globally. Host active spaces, voice sessions or public compiler feeds to gain cosmic gravitation index.'}
        </p>
        <button 
          onClick={() => {
            playSynthSound(900, 'sine', 0.1);
            alert(lang === 'ar' ? 'تم نسخ رابط مستكشف العالم الكوني لمشاركته مع المجتمعات الخارجية!' : 'Lodavia Cosmic Explorer invitation link copied to clipboard!');
          }}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shrink-0 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مشاركة الإحداثيات الكونية' : 'Share Cosmic Cords'}</span>
        </button>
      </div>

    </div>
  );
}
