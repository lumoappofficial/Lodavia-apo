import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Plus, 
  Filter, 
  ArrowLeft, 
  Coins, 
  DollarSign, 
  MessageSquare, 
  Percent, 
  Rocket, 
  Check, 
  Sparkles,
  Layers,
  Calendar,
  User,
  ExternalLink,
  ShieldAlert,
  Download,
  Info
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ProjectListing {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  authorName: string;
  authorAvatar: string;
  price: number; // in Points/Coins
  priceUSD: number; // in USD (for future scalability)
  category: 'AI' | 'Software' | 'Design' | 'Blockchain' | 'Hardware';
  type: 'idea' | 'project'; // idea: فكرة مشروع للبيع, project: مشروع جاهز متكامل
  imageUrl: string;
  likes: number;
  purchases: number;
  date: string;
  technologies: string[];
}

const DEFAULT_PROJECTS: ProjectListing[] = [
  {
    id: 'p-1',
    titleAr: 'محرك النسخ الذكي للغة العربية - فصحى ولهجات',
    titleEn: 'Arabic Smart Transcriber Engine (NLP)',
    descriptionAr: 'محرك متكامل يعتمد على نماذج الذكاء الاصطناعي لتحويل الصوت العربي المسجل أو الحي إلى نصوص بدقة فائقة مع فهم كامل للهجات المحلية ومصطلحات الأعمال. مثالي للشركات الإعلامية والخدمية.',
    descriptionEn: 'Fully production-ready AI engine that converts classical and spoken Arabic dialect audios into high-fidelity structured text. Tailored for media production, webinars, and customer support centers.',
    authorName: 'ريان الكوني',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    price: 350,
    priceUSD: 49.00,
    category: 'AI',
    type: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    likes: 84,
    purchases: 12,
    date: '2026-07-10',
    technologies: ['React', 'Python', 'FastAPI', 'PyTorch']
  },
  {
    id: 'p-2',
    titleAr: 'حزمة أدوات واجهات الفضاء ثلاثية الأبعاد',
    titleEn: 'Holographic Space Orbit UI Toolkit',
    descriptionAr: 'مكتبة مكونات ريأكت مذهلة لتصميم واجهات تفاعلية ثلاثية الأبعاد مستوحاة من سفن الفضاء ونظم الملاحة الفلكية. تحتوي على مؤثرات بصرية وتأثيرات نيون متطورة.',
    descriptionEn: 'A breathtaking React component library designed to render holographic 3D cockpit interfaces, interactive celestial maps, and spinning neon widgets. Fully optimized for high-performance dashboards.',
    authorName: 'سارة أورورا',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    price: 200,
    priceUSD: 29.00,
    category: 'Design',
    type: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    likes: 112,
    purchases: 25,
    date: '2026-07-12',
    technologies: ['Tailwind CSS', 'Three.js', 'Framer Motion']
  },
  {
    id: 'p-3',
    titleAr: 'فكرة نظام ذكي لتتبع وتوجيه الألواح الشمسية فلكياً',
    titleEn: 'Idea: Solar Panel Astro-Tracking Algorithm',
    descriptionAr: 'دراسة جدوى كاملة مع الخوارزمية البرمجية والمخطط الإلكتروني لبناء نظام تتبع شمسي ذكي يعتمد على زوايا السمت الفلكية لزيادة كفاءة توليد الطاقة البديلة بنسبة تصل لـ 40%.',
    descriptionEn: 'Complete documentation and algorithm repository proposing an automated solar panel tracker based on astronomical azimuth coordinates, maximizing hardware green-energy generation by up to 40%.',
    authorName: 'فارس الحكيم',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    price: 150,
    priceUSD: 19.00,
    category: 'Hardware',
    type: 'idea',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    likes: 45,
    purchases: 3,
    date: '2026-07-15',
    technologies: ['C++', 'Arduino', 'Python Astronomy API']
  },
  {
    id: 'p-4',
    titleAr: 'محرك العقود الذكية لتوثيق شهادات الكربون بالبلوكشين',
    titleEn: 'Carbon Credits Tokenization Engine',
    descriptionAr: 'بروتوكول عقود ذكية متكامل لشبكة إيثيريوم لتمكين مزارعي ومشاريع الطاقة الخضراء من صك (Mint) وتداول حصص تعويض الكربون كأصول مشفرة معتمدة لحماية البيئة.',
    descriptionEn: 'A Solidity smart contract framework deploying standard ERC-1155 tokens to model carbon footprint offsets, allowing carbon reduction projects to directly issue auditable tradeable credit units.',
    authorName: 'أمجد بلوك',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    price: 400,
    priceUSD: 59.00,
    category: 'Blockchain',
    type: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    likes: 67,
    purchases: 8,
    date: '2026-07-16',
    technologies: ['Solidity', 'Hardhat', 'Ethers.js']
  }
];

// Presets for Unsplash pictures to select during listing creation
const IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', // galaxy tech
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', // fluid art
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', // coding matrix
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80', // abstract network
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', // solar energy
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // green wire tech
];

export default function MarketplacePage() {
  const { lang, currentUser, setCurrentUser, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  // State Management
  const [projects, setProjects] = useState<ProjectListing[]>(() => {
    const saved = localStorage.getItem('lodavia_marketplace_listings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROJECTS;
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [activeView, setActiveView] = useState<'browse' | 'details' | 'create'>('browse');
  const [selectedProject, setSelectedProject] = useState<ProjectListing | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'AI' | 'Software' | 'Design' | 'Blockchain' | 'Hardware'>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'idea' | 'project'>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'popular'>('recent');

  // Form State
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formPrice, setFormPrice] = useState(100);
  const [formCategory, setFormCategory] = useState<'AI' | 'Software' | 'Design' | 'Blockchain' | 'Hardware'>('AI');
  const [formType, setFormType] = useState<'idea' | 'project'>('project');
  const [formImage, setFormImage] = useState(IMAGE_PRESETS[0]);
  const [formTechnologies, setFormTechnologies] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Scalability Mode Details (Stripe/Platform Fees Simulator)
  const [showScalabilityDetails, setShowScalabilityDetails] = useState(false);
  const platformFeePct = 10; // Platform takes 10% fee

  // Purchase States
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState('');

  // Persist project listings
  useEffect(() => {
    localStorage.setItem('lodavia_marketplace_listings', JSON.stringify(projects));
  }, [projects]);

  // Handle adding new project listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitleAr || !formTitleEn || !formDescAr || !formDescEn) {
      setFormError(isRtl ? 'يرجى تعبئة جميع الحقول النصية الأساسية باللغتين.' : 'Please fill in all core text fields in both languages.');
      playSynthSound(300, 'square', 0.2);
      return;
    }

    const techArray = formTechnologies
      ? formTechnologies.split(',').map(t => t.trim()).filter(Boolean)
      : [formCategory, formType === 'project' ? 'Ready System' : 'Draft Idea'];

    // Future-ready pricing calculator showing local platform share
    const netPayout = formPrice - (formPrice * (platformFeePct / 100));

    const newListing: ProjectListing = {
      id: `p-${Date.now()}`,
      titleAr: formTitleAr,
      titleEn: formTitleEn,
      descriptionAr: formDescAr,
      descriptionEn: formDescEn,
      authorName: currentUser.name || 'عضو لودافيا',
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      price: Number(formPrice),
      priceUSD: Math.round(Number(formPrice) * 0.15 * 100) / 100, // Simulated scale conversion
      category: formCategory,
      type: formType,
      imageUrl: formImage,
      likes: 0,
      purchases: 0,
      date: new Date().toISOString().split('T')[0],
      technologies: techArray
    };

    setProjects([newListing, ...projects]);
    setFormSuccess(true);
    playSynthSound(900, 'sine', 0.15);

    setTimeout(() => {
      // Reset form states
      setFormTitleAr('');
      setFormTitleEn('');
      setFormDescAr('');
      setFormDescEn('');
      setFormPrice(100);
      setFormCategory('AI');
      setFormType('project');
      setFormTechnologies('');
      setFormSuccess(false);
      setActiveView('browse');
    }, 1200);
  };

  // Simulated Buy flow
  const handlePurchaseProject = (project: ProjectListing) => {
    if (currentUser.points < project.price) {
      playSynthSound(220, 'sawtooth', 0.4);
      alert(isRtl 
        ? `عذراً! لا تمتلك نقاط كافية لعملية الشراء الكونية هذه. تحتاج إلى ${project.price} نقطة، رصيدك الحالي هو ${currentUser.points} نقطة.` 
        : `Insufficient funds! This celestial acquisition requires ${project.price} Points. Your current balance is ${currentUser.points} Points.`
      );
      return;
    }

    // Deduct user points and mock licensing
    const updatedPoints = currentUser.points - project.price;
    setCurrentUser({
      ...currentUser,
      points: updatedPoints
    });

    // Increment purchases
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === project.id ? { ...p, purchases: p.purchases + 1 } : p)
    );

    // Generate simulated license key
    const uniqueLicense = `LODAVIA-${project.category.toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setGeneratedLicense(uniqueLicense);
    setPurchaseSuccess(true);
    playSynthSound(1000, 'sine', 0.3);

    // Save purchased item under user details or storage so it simulates ownership
    const currentOwned = JSON.parse(localStorage.getItem('lodavia_owned_marketplace') || '[]');
    localStorage.setItem('lodavia_owned_marketplace', JSON.stringify([...currentOwned, project.id]));
  };

  // Like system
  const handleLikeProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        playSynthSound(800, 'sine', 0.08);
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  // Filter & Search logic
  const filteredProjects = projects.filter(p => {
    const titleMatch = (isRtl ? p.titleAr : p.titleEn).toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const typeMatch = selectedType === 'All' || p.type === selectedType;

    return titleMatch && categoryMatch && typeMatch;
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  return (
    <div className="w-full text-slate-100 min-h-screen pb-16">
      
      {/* Upper Navigation and Header */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-cyan-400" />
              <span>{isRtl ? 'سوق الأفكار والمشاريع الكونية' : 'Cosmic Ideas & Projects Market'}</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {isRtl 
                ? 'الفضاء الاستثماري لبيع وشراء كود البرمجيات، النماذج الذكية والأفكار الريادية المشفرة.' 
                : 'The supreme gateway to trade software components, AI models, and structured tech concepts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeView === 'browse' ? (
              <button
                onClick={() => {
                  playSynthSound(600, 'sine', 0.1);
                  setActiveView('create');
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'اعرض مشروعك للبيع 🚀' : 'Sell Your Code/Idea 🚀'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playSynthSound(400, 'sine', 0.08);
                  setActiveView('browse');
                  setSelectedProject(null);
                  setPurchaseSuccess(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{isRtl ? 'العودة للتصفح' : 'Back to Market'}</span>
              </button>
            )
            }
          </div>
        </div>

        {/* Scalability Future Payment Indicator Banner */}
        <div className="mt-3 py-2 px-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-400 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isRtl 
                ? 'جاهز للتكامل البرمجي مع أنظمة الدفع الحقيقية (Stripe/PayPal). نسبة المنصة الافتراضية محددة بـ 10%.' 
                : 'Architecture prepared for payment gateway (Stripe/PayPal) with a simulated 10% platform commission.'}
            </span>
          </div>
          <button 
            onClick={() => {
              playSynthSound(700, 'sine', 0.05);
              setShowScalabilityDetails(!showScalabilityDetails);
            }} 
            className="underline text-[10px] hover:text-cyan-300 font-bold tracking-wider uppercase shrink-0"
          >
            {showScalabilityDetails ? (isRtl ? 'إخفاء التفاصيل' : 'Hide Setup') : (isRtl ? 'عرض التفاصيل والعمولات' : 'View Commission Math')}
          </button>
        </div>

        {/* Payment Scalability Expansion Panel */}
        {showScalabilityDetails && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 flex flex-col gap-3 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center gap-2 text-cyan-300 font-black">
              <Rocket className="w-4 h-4" />
              <span>{isRtl ? 'بنية الدفع والاستثمار القابلة للتوسع (Stripe / Stripe Connect)' : 'Scalable Stripe Connect Payment Architecture'}</span>
            </div>
            <p className="leading-relaxed opacity-90">
              {isRtl 
                ? 'تم بناء هذا النظام ليدعم التوزيع المالي الفوري للمبالغ. عندما يشتري مستخدم مشروعاً، تذهب القيمة مباشرة إلى حساب البائع عبر Stripe Connect مع حجز عمولة المنصة المبرمجة بـ 10% تلقائياً، وتخزين المعاملات في قاعدة بيانات آمنة.' 
                : 'Engineered with split-payout triggers. When an acquisition completes, the webhook instantly processes the transfer via Stripe API to the seller\'s linked bank account, retaining the 10% platform commission and logging the crypto/fiat ledger.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">{isRtl ? 'عمولة الوساطة للمنصة' : 'Platform Fee Retained'}</span>
                <span className="text-base font-extrabold text-amber-400">10% {isRtl ? 'من إجمالي المبيعات' : 'of gross sales'}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">{isRtl ? 'طريقة التحويل للبائع' : 'Seller Distribution Method'}</span>
                <span className="text-base font-extrabold text-cyan-400">Stripe Connect Instant</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">{isRtl ? 'حماية مشتري الكود' : 'Source Code Escrow Guard'}</span>
                <span className="text-base font-extrabold text-pink-400">7-Day Escrow Holds</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RENDER BROWSE SECTION */}
      {activeView === 'browse' && (
        <div className="flex flex-col gap-6">
          
          {/* Filters Bar */}
          <div className="glass-panel rounded-2xl border border-white/10 p-4 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-3">
              
              {/* Search input */}
              <div className="flex-1 flex items-center bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'ابحث باسم المشروع، الفكرة، أو الكلمات المفتاحية...' : 'Search listings by title, description or tag...'}
                  className="bg-transparent border-none outline-none text-slate-200 px-3 py-0.5 w-full"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-slate-400 font-bold hidden xl:inline uppercase tracking-wider">{isRtl ? 'التصنيف:' : 'Category:'}</span>
                {['All', 'AI', 'Software', 'Design', 'Blockchain', 'Hardware'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      setSelectedCategory(cat as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' 
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isRtl ? (
                      cat === 'All' ? 'الكل' :
                      cat === 'Software' ? 'برمجيات' :
                      cat === 'Design' ? 'تصميم' :
                      cat === 'Blockchain' ? 'بلوكشين' :
                      cat === 'Hardware' ? 'عتاد وأجهزة' : cat
                    ) : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-filters (Type and Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{isRtl ? 'النوع:' : 'Type:'}</span>
                <button
                  onClick={() => setSelectedType('All')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${selectedType === 'All' ? 'bg-purple-500/20 text-purple-300' : 'hover:text-slate-200'}`}
                >
                  {isRtl ? 'الجميع' : 'All'}
                </button>
                <button
                  onClick={() => setSelectedType('project')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${selectedType === 'project' ? 'bg-purple-500/20 text-purple-300' : 'hover:text-slate-200'}`}
                >
                  {isRtl ? 'مشاريع للبيع 📦' : 'Ready Projects 📦'}
                </button>
                <button
                  onClick={() => setSelectedType('idea')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${selectedType === 'idea' ? 'bg-purple-500/20 text-purple-300' : 'hover:text-slate-200'}`}
                >
                  {isRtl ? 'أفكار مشاريع للبيع 💡' : 'Project Ideas 💡'}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="font-bold shrink-0">{isRtl ? 'ترتيب حسب:' : 'Sort By:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#050814] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400 w-full sm:w-auto"
                >
                  <option value="recent">{isRtl ? 'الأحدث نُشراً' : 'Newest Listed'}</option>
                  <option value="price-asc">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                  <option value="price-desc">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                  <option value="popular">{isRtl ? 'الأكثر إعجاباً وتفاعلاً' : 'Most Liked'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.08);
                    setSelectedProject(project);
                    setActiveView('details');
                  }}
                  className="glass-panel rounded-2xl border border-white/10 hover:border-cyan-500/30 overflow-hidden group hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)] cursor-pointer transition-all duration-300 flex flex-col h-full"
                >
                  {/* Visual Header Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={project.imageUrl}
                      alt={isRtl ? project.titleAr : project.titleEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Badge type info */}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      project.type === 'project' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {project.type === 'project' ? (isRtl ? 'مشروع جاهز 📦' : 'Ready Code') : (isRtl ? 'فكرة كود 💡' : 'Concept Idea')}
                    </span>

                    {/* Category Label */}
                    <span className="absolute bottom-3 left-3 bg-black/70 border border-white/10 text-cyan-400 font-bold px-2.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {isRtl ? project.titleAr : project.titleEn}
                        </h3>
                      </div>
                      
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {isRtl ? project.descriptionAr : project.descriptionEn}
                      </p>

                      {/* Technologies Pill Container */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 font-bold">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 font-bold">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Seller + Price Bottom Bar */}
                    <div className="flex justify-between items-center pt-3.5 border-t border-white/5 shrink-0 mt-2">
                      
                      {/* Author Details */}
                      <div className="flex items-center gap-2">
                        <img
                          src={project.authorAvatar}
                          alt={project.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold">{project.authorName}</span>
                      </div>

                      {/* Price Details */}
                      <div className="flex items-center gap-3">
                        {/* Like button */}
                        <button 
                          onClick={(e) => handleLikeProject(project.id, e)}
                          className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-pink-500/30 text-slate-400 hover:text-pink-400 transition-all text-[10px] font-bold"
                          title={isRtl ? 'إعجاب' : 'Like'}
                        >
                          <span>❤️</span>
                          <span>{project.likes}</span>
                        </button>

                        <div className="flex flex-col items-end">
                          <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider">{isRtl ? 'السعر المطلوب' : 'Listing Price'}</span>
                          <span className="text-xs font-black text-yellow-400 flex items-center gap-0.5">
                            <Coins className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                            <span>{project.price} {isRtl ? 'نقطة' : 'Pts'}</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/5 p-12 text-center flex flex-col items-center justify-center gap-4">
              <ShoppingBag className="w-12 h-12 text-slate-600 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-slate-300">{isRtl ? 'لم يتم العثور على مشاريع مطابقة' : 'No Cosmic Projects Found'}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'حاول تغيير معايير التصفية أو البحث لإظهار النتائج.' : 'Try adjusting your search queries or selecting other categories.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER DETAILS VIEW */}
      {activeView === 'details' && selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.25s_ease-out]">
          
          {/* Main Details and Showcase */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Project Showcase Panel */}
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col">
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={selectedProject.imageUrl}
                  alt={isRtl ? selectedProject.titleAr : selectedProject.titleEn}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  selectedProject.type === 'project' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {selectedProject.type === 'project' ? (isRtl ? 'مشروع متكامل جاهز 📦' : 'Full Production Ready') : (isRtl ? 'فكرة ريادية ملهمة 💡' : 'Premium Tech Concept')}
                </span>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider uppercase">
                      {selectedProject.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedProject.date}</span>
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {isRtl ? selectedProject.titleAr : selectedProject.titleEn}
                  </h2>
                </div>

                {/* Seller & Popularity Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProject.authorAvatar}
                      alt={selectedProject.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isRtl ? 'البائع والمطور الكوني' : 'Celestial Developer'}</span>
                      <span className="text-xs font-extrabold text-white">{selectedProject.authorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isRtl ? 'الإعجابات' : 'Likes'}</span>
                      <span className="text-sm font-extrabold text-pink-400">❤️ {selectedProject.likes}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isRtl ? 'التحميلات والمبيعات' : 'Acquisitions'}</span>
                      <span className="text-sm font-extrabold text-cyan-400">📥 {selectedProject.purchases}</span>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{isRtl ? 'تفاصيل العرض التقني' : 'Technical Specifications'}</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line opacity-90">
                    {isRtl ? selectedProject.descriptionAr : selectedProject.descriptionEn}
                  </p>
                </div>

                {/* Technologies used */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{isRtl ? 'المكدس التقني / اللغات' : 'Tech Stack & Frameworks'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Buyer Guarantees & Platform Escrow Details */}
            <div className="glass-panel rounded-2xl border border-white/5 p-5 flex items-start gap-4">
              <ShieldAlert className="w-8 h-8 text-cyan-400 shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{isRtl ? 'ضمان الأمان والتدقيق البرمجي لودافيا' : 'Lodavia Verification Guarantee'}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isRtl 
                    ? 'جميع المشاريع على منصتنا يتم فحص شفرتها البرمجية لضمان خلوها من الأكواد الخبيثة وصلاحيتها الفنية تماماً للتشغيل قبل تسليم مفتاح الترخيص الكوني للمشتري.'
                    : 'To ensure developer safety, all listings undergo strict automated sanity checking before publishing, certifying that source bundles correspond to specifications.'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Checkout & Purchase Interface */}
          <div className="flex flex-col gap-6">
            
            <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-5">
              <h3 className="text-sm font-black text-white pb-3 border-b border-white/5 uppercase tracking-wider">
                {isRtl ? 'لوحة تملك رخصة المشروع' : 'Aquire Project License'}
              </h3>

              {/* Price Tag with conversion */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center flex flex-col gap-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-xl group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'سعر الرخصة الحالي' : 'License Cost'}</span>
                <span className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-1">
                  <Coins className="w-7 h-7 text-yellow-400 animate-pulse" />
                  <span>{selectedProject.price} {isRtl ? 'نقطة كود' : 'Pts'}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">
                  {isRtl ? `ما يعادل تقريباً ${selectedProject.priceUSD}$ عند الربط الحقيقي` : `Equivalent to ~$${selectedProject.priceUSD} under live API gateway`}
                </span>
              </div>

              {/* Purchase success details screen */}
              {purchaseSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex flex-col gap-3 animate-[scaleIn_0.2s_ease-out]">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-black">{isRtl ? 'اكتساب كوني ناجح! 🎉' : 'Celestial License Acquired! 🎉'}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {isRtl 
                      ? 'تم خصم النقاط بنجاح وتوليد رخصة التملّك وجدول الملفات المصدرية للمشروع. تم إرسال رابط كود المشروع لملفك الشخصي.' 
                      : 'Points successfully debited. Lodavia generated your verified licensing token. Source download links have been appended to your private vault.'}
                  </p>
                  
                  {/* Generated license display */}
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-center flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-500 uppercase font-black">{isRtl ? 'رقم ترخيص الكود' : 'Source License Key'}</span>
                    <span className="font-mono text-[10px] text-yellow-400 select-all tracking-wider font-extrabold">{generatedLicense}</span>
                  </div>

                  <button
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.1);
                      alert(isRtl ? 'جاري بدء تنزيل كود المشروع والملفات المرفقة...' : 'Initiating cosmic source zip download...');
                    }}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحميل الملفات المصدرية' : 'Download Source ZIP'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  
                  {/* Real Points comparison */}
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold px-1">
                    <span>{isRtl ? 'رصيد نقاطك الحالي:' : 'Your Points Balance:'}</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentUser.points} Pts</span>
                    </span>
                  </div>

                  {/* Future Stripe Setup Indicator */}
                  <button
                    onClick={() => handlePurchaseProject(selectedProject)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-slate-950 hover:opacity-90 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
                  >
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{isRtl ? 'شراء رخصة الكود بالنقاط 🔑' : 'Unlock Code License 🔑'}</span>
                  </button>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isRtl ? 'توزيع نسبة المبيعات المستقبلية' : 'Platform Cut Split'}</span>
                    </span>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{isRtl ? 'حصة البائع الكوني (90%):' : 'Developer Share (90%):'}</span>
                      <span className="font-extrabold text-emerald-400">+{selectedProject.price * 0.9} Pts</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{isRtl ? 'عمولة المنصة لودافيا (10%):' : 'Platform Fee (10%):'}</span>
                      <span className="font-extrabold text-amber-500">+{selectedProject.price * 0.1} Pts</span>
                    </div>
                  </div>

                  {/* Contact Seller */}
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.08);
                      alert(isRtl 
                        ? `جاري فتح محادثة كود كوزموس مع المطور ${selectedProject.authorName}... يمكنك مناقشة التعديلات والخصومات.` 
                        : `Opening cosmic code debate channel with ${selectedProject.authorName}... You can discuss customized changes.`
                      );
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isRtl ? 'مراسلة البائع للاستفسار' : 'Contact Developer'}</span>
                  </button>

                </div>
              )}

              {/* Developer stats details */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-[10px] text-slate-400 flex flex-col gap-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'تفاصيل المطور والمشروع' : 'Developer & Escrow details'}</span>
                <div className="flex justify-between">
                  <span>{isRtl ? 'مستوى المطور الكوني:' : 'Developer Rank:'}</span>
                  <span className="font-bold text-cyan-400">Elite Creator</span>
                </div>
                <div className="flex justify-between">
                  <span>{isRtl ? 'فترة حماية المشتري:' : 'Escrow Hold Guard:'}</span>
                  <span className="font-bold text-pink-400">7 Days active</span>
                </div>
                <div className="flex justify-between">
                  <span>{isRtl ? 'توثيق كود المصدر:' : 'Source Verified:'}</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Clean Source</span>
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* RENDER LISTING CREATION FORM */}
      {activeView === 'create' && (
        <div className="max-w-2xl mx-auto glass-panel rounded-3xl border border-white/10 overflow-hidden animate-[scaleIn_0.25s_ease-out]">
          
          <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-purple-950/20 to-cyan-950/20">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Plus className="w-6 h-6 text-cyan-400" />
              <span>{isRtl ? 'اعرض مشروعك أو فكرتك للبيع' : 'List New Code or Idea for Sale'}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isRtl 
                ? 'أنشئ عرض تداول كوني لشفرتك البرمجية أو فكرتك المميزة واكسب النقاط من الآخرين.' 
                : 'Offer your code library or stellar concept to the community and grow your balance.'}
            </p>
          </div>

          <form onSubmit={handleCreateListing} className="p-6 md:p-8 flex flex-col gap-5">
            
            {/* Error & Success Messages */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{isRtl ? 'تم إدراج مشروعك بنجاح في السوق الكوني! 🚀' : 'Listing published successfully to the Cosmic Vault! 🚀'}</span>
              </div>
            )}

            {/* Type selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'نوع الإدراج' : 'Listing Type'}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setFormType('project');
                  }}
                  className={`p-3.5 rounded-xl border text-xs text-center font-black transition-all ${
                    formType === 'project' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-md' 
                      : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'مشروع متكامل / كود برمجي جاهز 📦' : 'Full Project / Code Library 📦'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setFormType('idea');
                  }}
                  className={`p-3.5 rounded-xl border text-xs text-center font-black transition-all ${
                    formType === 'idea' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-md' 
                      : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'فكرة كود كوني / دراسة جدوى تقنية 💡' : 'Stellar Idea / Tech Specification 💡'}
                </button>
              </div>
            </div>

            {/* Title AR / EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'العنوان بالعربية' : 'Arabic Title'}</label>
                <input
                  type="text"
                  value={formTitleAr}
                  onChange={(e) => setFormTitleAr(e.target.value)}
                  placeholder="مثال: نظام ذكي للتشفير السديمي"
                  className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'العنوان بالإنجليزية' : 'English Title'}</label>
                <input
                  type="text"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  placeholder="Example: Nebula Encryption Protocol"
                  className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Category / Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'تصنيف المشروع' : 'Project Category'}</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs bg-[#050814] border border-white/10"
                >
                  <option value="AI">{isRtl ? 'الذكاء الاصطناعي (AI)' : 'AI'}</option>
                  <option value="Software">{isRtl ? 'برمجة وتطوير (Software)' : 'Software'}</option>
                  <option value="Design">{isRtl ? 'تصاميم وهويات (Design)' : 'Design'}</option>
                  <option value="Blockchain">{isRtl ? 'بلوكشين وعقود (Blockchain)' : 'Blockchain'}</option>
                  <option value="Hardware">{isRtl ? 'أجهزة وإنترنت الأشياء (Hardware)' : 'Hardware'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'السعر المطلوب بالنقاط' : 'Price (Points)'}</label>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                    <Percent className="w-3 h-3 text-cyan-400" />
                    <span>{isRtl ? `تقتطع 10% عمولة` : '10% platform share'}</span>
                  </span>
                </div>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-yellow-400"
                />
              </div>
            </div>

            {/* Description AR */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'الوصف بالعربية تفصيلاً' : 'Arabic Description'}</label>
              <textarea
                value={formDescAr}
                onChange={(e) => setFormDescAr(e.target.value)}
                placeholder="اشرح ميزات الكود، المكونات، كيفية تشغيله، القيمة التي يقدمها للمستثمر..."
                className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs h-24 resize-none"
              />
            </div>

            {/* Description EN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'الوصف بالإنجليزية تفصيلاً' : 'English Description'}</label>
              <textarea
                value={formDescEn}
                onChange={(e) => setFormDescEn(e.target.value)}
                placeholder="Detail technical integrations, features, setup requirements, core logic, etc..."
                className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs h-24 resize-none"
              />
            </div>

            {/* Technologies */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'المكدس التقني / اللغات (مفصولة بفاصلة)' : 'Tech Stack (comma-separated)'}</label>
              <input
                type="text"
                value={formTechnologies}
                onChange={(e) => setFormTechnologies(e.target.value)}
                placeholder="Example: React, Tailwind, Solidity, Hardhat"
                className="glass-input w-full py-2.5 px-3.5 rounded-xl text-xs"
              />
            </div>

            {/* Image Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{isRtl ? 'اختر صورة غلاف للمشروع' : 'Choose Cover Image'}</label>
              <div className="grid grid-cols-6 gap-2">
                {IMAGE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.05);
                      setFormImage(p);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      formImage === p ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-400/20' : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="preset preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-4"
            >
              {isRtl ? 'انشر العرض في سوق لودافيا الكوني 🚀' : 'Publish Listing to Cosmic Vault 🚀'}
            </button>

          </form>

        </div>
      )}

    </div>
  );
}
