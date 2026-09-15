import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Rocket, 
  Scale, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase, 
  Layers, 
  ExternalLink, 
  Github, 
  Star, 
  Share2, 
  MessageSquare, 
  FileText, 
  Check, 
  X, 
  ArrowRight, 
  ChevronRight, 
  BarChart2, 
  Target, 
  ShieldAlert, 
  Award,
  Flame,
  Globe,
  Code,
  Smartphone,
  Cpu,
  Zap,
  Tag
} from 'lucide-react';
import ProjectJuryModal from '../components/ProjectJuryModal';
import { ProjectJuryResult, ProjectJuryInput } from '../types/projectJury';
import { storage } from '../utils/storage';
import { sanitizeExternalUrl } from '../utils/urlSecurity';

export interface ProjectItem {
  id: string;
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  category: 'ai' | 'web' | 'mobile' | 'edtech' | 'fintech' | 'saas' | 'hardware' | 'creative';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  stage: 'idea' | 'prototype' | 'mvp' | 'launched' | 'scaling';
  juryScore?: number; // e.g. 8.8
  juryVerdict?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  fundingRaised?: number;
  fundingGoal?: number;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  createdAt: string;
  bannerImage?: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Lodavia AI Neural Canvas',
    titleAr: 'لوحة لودافيا العصبية الذكية',
    tagline: 'Collaborative spatial infinite whiteboard with embedded Gemini agent capabilities.',
    taglineAr: 'مساحة عمل لا نهائية تفاعلية مدعومة بالذكاء الاصطناعي لتوليد المخططات والأفكار.',
    description: 'A revolutionary spatial computing workspace where designers and developers collaborate in real-time with an AI agent that converts sketches into production React code and database schemas.',
    descriptionAr: 'منصة مساحة عمل ثورية تتيح للمصممين والمبرمجين التعاون المباشر مع وكيل ذكاء اصطناعي يقوم بتحويل الرسوم التخطيطية مباشرة إلى كود ريأكت وقواعد بيانات.',
    category: 'ai',
    author: {
      name: 'Rami Al-Khatib',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Lead Architect'
    },
    stage: 'mvp',
    juryScore: 9.2,
    juryVerdict: 'مشروع استثنائي عالي الجاهزية والابتكار',
    upvotes: 342,
    fundingRaised: 45000,
    fundingGoal: 80000,
    techStack: ['React', 'TypeScript', 'WebSockets', 'Gemini API', 'TailwindCSS', 'Node.js'],
    demoUrl: 'https://lodavia.app/demo/canvas',
    githubUrl: 'https://github.com/lodavia/neural-canvas',
    tasks: [
      { id: 't-1', title: 'دعم تصدير SVG ومخططات Figma', completed: true, priority: 'high' },
      { id: 't-2', title: 'تحسين سرعة الاستجابة اللحظية في التزامن', completed: true, priority: 'high' },
      { id: 't-3', title: 'إضافة التعرف الصوتي على الأوامر', completed: false, priority: 'medium' }
    ],
    createdAt: '2026-08-10',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'proj-2',
    title: 'PulsePay Global Stellar Wallet',
    titleAr: 'محفظة بولس باي للمدفوعات السريعة',
    tagline: 'Instant micro-payments and creator tipping with zero gas fees.',
    taglineAr: 'منظومة دفع وتحويل فوري فائقة السرعة للمبدعين والمتاجر بدون عمولات.',
    description: 'Empowering digital creators and small businesses to monetize their content and receive direct peer-to-peer micro-tips in local and global currencies seamlessly.',
    descriptionAr: 'تمكين صناع المحتوى والمشاريع الناشئة من استلام الدعم والمدفوعات اللحظية بدون وسطاء بنكيين معقدين وبأمان عالي.',
    category: 'fintech',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'FinTech Founder'
    },
    stage: 'scaling',
    juryScore: 8.7,
    juryVerdict: 'نموذج مالي متماسك مع قابلية توسع عالية',
    upvotes: 215,
    fundingRaised: 120000,
    fundingGoal: 150000,
    techStack: ['TypeScript', 'Stripe API', 'Cloud SQL', 'Next.js', 'Redis'],
    demoUrl: 'https://pulsepay.io',
    tasks: [
      { id: 't-4', title: 'الحصول على تراخيص بوابات الدفع الإقليمية', completed: true, priority: 'high' },
      { id: 't-5', title: 'تكامل المحافظ الإلكترونية عبر Apple Pay', completed: true, priority: 'high' },
      { id: 't-6', title: 'إطلاق برنامج الإحالة للمتاجر', completed: false, priority: 'low' }
    ],
    createdAt: '2026-08-01',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'proj-3',
    title: 'AstroKids Interactive Space Academy',
    titleAr: 'أكاديمية أستروكيدز لعلوم الفضاء',
    tagline: 'Gamified interactive STEM astrophysics simulator for future astronauts.',
    taglineAr: 'منصة ألعاب تفاعلية لتعليم علوم الفضاء والفيزياء الفلكية بأسلوب مشوق.',
    description: 'Transforming complex astrophysics and celestial mechanics into 3D interactive quests and simulations for learners of all ages.',
    descriptionAr: 'تحويل المفاهيم الفلكية المعقدة إلى مغامرات ثلاثية الأبعاد تفاعلية تحفز الابتكار والتفكير العلمي.',
    category: 'edtech',
    author: {
      name: 'Tariq Mansoor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Educator & Astrophysicist'
    },
    stage: 'prototype',
    juryScore: 8.4,
    juryVerdict: 'فكرة ملهمة وسوق تعليمي واعد',
    upvotes: 189,
    fundingRaised: 15000,
    fundingGoal: 40000,
    techStack: ['Three.js', 'React', 'TailwindCSS', 'Web Audio API'],
    demoUrl: 'https://astrokids.space',
    tasks: [
      { id: 't-7', title: 'بناء محاكي مدارات الكواكب والمذنبات 3D', completed: true, priority: 'high' },
      { id: 't-8', title: 'إضافة التعليق الصوتي التعليمي باللغة العربية', completed: false, priority: 'medium' }
    ],
    createdAt: '2026-08-08',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function ProjectsPage() {
  const { lang, currentUser, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'explore' | 'jury' | 'workspace' | 'create'>('explore');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Stored projects
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = storage.load<ProjectItem[]>('lodavia_user_projects', []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return [...saved, ...INITIAL_PROJECTS];
    }
    return INITIAL_PROJECTS;
  });

  // Selected Project for details or jury review
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // AI Jury Modal state
  const [isJuryModalOpen, setIsJuryModalOpen] = useState<boolean>(false);
  const [juryInitialData, setJuryInitialData] = useState<Partial<ProjectJuryInput> | undefined>(undefined);

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    titleAr: '',
    taglineAr: '',
    descriptionAr: '',
    category: 'ai' as ProjectItem['category'],
    stage: 'idea' as ProjectItem['stage'],
    fundingGoal: 25000,
    expectedBudget: '15000 USD',
    monthlyExpenses: '1200 USD',
    targetAudience: 'المطورون، رواد الأعمال، وصناع المحتوى',
    competitors: 'المنصات التقليدية',
    techStack: 'React, TypeScript, TailwindCSS, Gemini AI',
    demoUrl: '',
    githubUrl: '',
    bannerImage: ''
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle Upvote
  const handleUpvote = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSynthSound(700, 'sine', 0.1);
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextUpvoted = !p.hasUpvoted;
        return {
          ...p,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  };

  // Trigger AI Jury for a project
  const handleEvaluateWithJury = (proj?: ProjectItem) => {
    playSynthSound(850, 'sine', 0.12);
    if (proj) {
      setJuryInitialData({
        projectName: isAr ? proj.titleAr : proj.title,
        projectType: proj.category,
        description: isAr ? proj.descriptionAr : proj.description,
        targetAudience: 'مستخدمو الإنترنت ورواد الأعمال والتقنيون',
        expectedBudget: `$${proj.fundingGoal || 30000}`,
        monthlyExpenses: '$2500'
      });
    } else {
      setJuryInitialData(undefined);
    }
    setIsJuryModalOpen(true);
  };

  // Submit New Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.titleAr.trim() && !newProject.title.trim()) return;

    playSynthSound(900, 'sine', 0.2);
    const techArray = newProject.techStack.split(',').map(s => s.trim()).filter(Boolean);

    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title || newProject.titleAr,
      titleAr: newProject.titleAr || newProject.title,
      tagline: newProject.taglineAr || 'New innovation on Lodavia network',
      taglineAr: newProject.taglineAr || 'مشروع ابتكاري جديد على شبكة لودافيا',
      description: newProject.descriptionAr || 'Full-stack application launched on Lodavia workspace.',
      descriptionAr: newProject.descriptionAr || 'مشروع ومنتج رقمي مبتكر تم إطلاقه في مساحة لودافيا.',
      category: newProject.category,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: isAr ? 'مؤسس المشروع' : 'Project Creator'
      },
      stage: newProject.stage,
      upvotes: 1,
      hasUpvoted: true,
      fundingRaised: 0,
      fundingGoal: Number(newProject.fundingGoal) || 20000,
      techStack: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'TailwindCSS'],
      demoUrl: newProject.demoUrl || undefined,
      githubUrl: newProject.githubUrl || undefined,
      tasks: [
        { id: `t-${Date.now()}-1`, title: isAr ? 'إعداد مسودة المشروع ونموذج العمل' : 'Draft business model & MVP architecture', completed: true, priority: 'high' },
        { id: `t-${Date.now()}-2`, title: isAr ? 'طلب تحكيم المشروع عبر لجنة الذكاء الاصطناعي' : 'Run AI Project Jury Evaluation', completed: false, priority: 'high' },
        { id: `t-${Date.now()}-3`, title: isAr ? 'إطلاق النسخة التجريبية الأولى للمجتمع' : 'Launch community MVP demo', completed: false, priority: 'medium' }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      bannerImage: newProject.bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
    };

    const nextProjects = [created, ...projects];
    setProjects(nextProjects);
    storage.save('lodavia_user_projects', nextProjects.filter(p => p.id.startsWith('proj-')));

    setToastMessage(isAr ? 'تم نشر مشروعك بنجاح في منصة المشاريع! 🚀' : 'Project submitted successfully to Lodavia Hub! 🚀');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);

    // Reset and go to explore
    setActiveTab('explore');
    setSelectedProject(created);
  };

  // Toggle task completion
  const handleToggleTask = (projectId: string, taskId: string) => {
    playSynthSound(600, 'sine', 0.05);
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return p;
    }));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      } : null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStage = selectedStage === 'all' || p.stage === selectedStage;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      p.title.toLowerCase().includes(query) || 
      p.titleAr.toLowerCase().includes(query) || 
      p.taglineAr.toLowerCase().includes(query) ||
      p.techStack.some(t => t.toLowerCase().includes(query));
    return matchesCategory && matchesStage && matchesQuery;
  });

  const categories = [
    { id: 'all', labelAr: 'الكل 🪐', labelEn: 'All 🪐' },
    { id: 'ai', labelAr: 'ذكاء اصطناعي 🤖', labelEn: 'AI & ML 🤖' },
    { id: 'web', labelAr: 'تطبيقات ويب 🌐', labelEn: 'Web Apps 🌐' },
    { id: 'mobile', labelAr: 'تطبيقات هاتف 📱', labelEn: 'Mobile 📱' },
    { id: 'fintech', labelAr: 'مالية ومدفوعات 💳', labelEn: 'FinTech 💳' },
    { id: 'edtech', labelAr: 'تعليم ومعرفة 🎓', labelEn: 'EdTech 🎓' },
    { id: 'saas', labelAr: 'برمجيات سحابية ☁️', labelEn: 'SaaS ☁️' },
    { id: 'creative', labelAr: 'تصميم وميديا 🎨', labelEn: 'Design & Media 🎨' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16 animate-[fadeIn_0.35s_ease-out]">
      
      {/* ----------------- TOP BANNER HEADER ----------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-sky-500/10 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25">
            <Rocket className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                {isAr ? 'منصة ومختبر المشاريع والابتكار' : 'Projects & Innovation Studio'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-cyan-400 text-[10px] font-black border border-sky-500/20 uppercase tracking-wider">
                V3.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed font-medium">
              {isAr 
                ? 'استكشف، ابنِ، واختبر مشاريعك التقنية بمساعدة لجنة تحكيم الذكاء الاصطناعي الشاملة وإدارة مساحات العمل والتمويل.' 
                : 'Explore, launch, and validate projects with multi-agent AI Jury evaluations and full milestone workspaces.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={() => handleEvaluateWithJury()}
            className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-amber-400/30"
          >
            <Scale className="w-4 h-4" />
            <span>{isAr ? 'لجنة تحكيم AI ⚖️' : 'AI Project Jury ⚖️'}</span>
          </button>

          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.08);
              setActiveTab('create');
            }}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-black shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-sky-300/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'أضف مشروعك 🚀' : 'New Project 🚀'}</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB NAVIGATION TABS ----------------- */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-2">
          {[
            { id: 'explore', labelAr: 'استكشاف المشاريع 🪐', labelEn: 'Explore Projects 🪐', icon: Globe },
            { id: 'workspace', labelAr: 'مساحة العمل والمهام 📋', labelEn: 'Workspace & Tasks 📋', icon: Layers },
            { id: 'create', labelAr: 'تسجيل مشروع جديد ➕', labelEn: 'Submit Project ➕', icon: Plus }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Total Count Badge */}
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {isAr ? `${filteredProjects.length} مشروع متاح` : `${filteredProjects.length} projects active`}
        </span>
      </div>

      {/* ----------------- EXPLORE TAB ----------------- */}
      {activeTab === 'explore' && (
        <div className="flex flex-col gap-6">
          
          {/* Filters and Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center px-3.5 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن مشاريع، تقنيات، مبرمجين...' : 'Search projects, tech stack, creators...'}
                className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none px-2.5"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSynthSound(450, 'sine', 0.04);
                    setCategoryFilter(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-sky-500/15 text-sky-600 dark:text-cyan-400 border border-sky-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
              <Rocket className="w-12 h-12 text-slate-400 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isAr ? 'لم يتم العثور على مشاريع مطابقة للبحث' : 'No matching projects found'}
              </h3>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-sky-500 font-bold hover:underline"
              >
                {isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setSelectedProject(project);
                  }}
                  className="group relative rounded-3xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800/80 hover:border-sky-400/80 dark:hover:border-sky-500/60 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col overflow-hidden"
                >
                  {/* Card Banner Image */}
                  <div className="relative w-full h-40 overflow-hidden bg-slate-900">
                    <img 
                      src={project.bannerImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category & Stage Badge */}
                    <div className="absolute top-3 inset-x-3 flex justify-between items-center">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-cyan-300 border border-white/10 uppercase tracking-wider">
                        {project.category}
                      </span>

                      {project.juryScore && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>{project.juryScore.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Author info over banner */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center gap-2">
                      <img 
                        src={project.author.avatar} 
                        alt={project.author.name}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white/80" 
                      />
                      <span className="text-xs font-bold text-white drop-shadow-md truncate">
                        {project.author.name}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {isAr ? project.titleAr : project.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed font-normal">
                        {isAr ? project.taglineAr : project.tagline}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      {/* Upvote Button */}
                      <button
                        onClick={(e) => handleUpvote(project.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          project.hasUpvoted
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${project.hasUpvoted ? 'fill-white text-white' : 'text-amber-500'}`} />
                        <span>{project.upvotes}</span>
                      </button>

                      {/* Evaluate / Details Button */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEvaluateWithJury(project);
                          }}
                          className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
                          title={isAr ? 'تقييم لجنة الذكاء الاصطناعي' : 'Evaluate with AI Jury'}
                        >
                          <Scale className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline"
                        >
                          <span>{isAr ? 'التفاصيل' : 'Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ----------------- WORKSPACE / TASKS TAB ----------------- */}
      {activeTab === 'workspace' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-500" />
                <span>{isAr ? 'مساحة العمل ومراحل التنفيذ' : 'Active Projects Workspace'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? 'إدارة مهام التطوير، المراحل، ونسب الإنجاز لجميع المشاريع النشطة.' : 'Manage implementation roadmap, milestones, and task boards.'}
              </p>
            </div>

            <button
              onClick={() => handleEvaluateWithJury()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>{isAr ? 'تحكيم فكرة مشروع جديد ⚖️' : 'Test Project Idea ⚖️'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => {
              const completedCount = project.tasks.filter(t => t.completed).length;
              const totalCount = project.tasks.length || 1;
              const progressPct = Math.round((completedCount / totalCount) * 100);

              return (
                <div 
                  key={project.id}
                  className="rounded-3xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {isAr ? project.titleAr : project.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-cyan-400 text-[10px] font-bold uppercase">
                        {project.stage}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>{isAr ? 'نسبة الإنجاز' : 'Progress'}</span>
                        <span className="text-sky-600 font-mono">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks Checklist */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        {isAr ? 'المهام الحالية' : 'Milestones & Tasks'}
                      </span>
                      {project.tasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => handleToggleTask(project.id, task.id)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-sky-50/50 border border-slate-100 dark:border-slate-800/80 cursor-pointer text-xs"
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                            task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`flex-1 truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEvaluateWithJury(project)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/15 hover:text-amber-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isAr ? 'مراجعة مع لجنة التحكيم ⚖️' : 'Review with AI Jury ⚖️'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- CREATE / SUBMIT PROJECT TAB ----------------- */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto w-full rounded-3xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-cyan-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isAr ? 'تسجيل ونشر مشروع جديد 🚀' : 'Submit & Register New Project 🚀'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr ? 'أدخل تفاصيل مشروعك أو فكرتك لتقييمها والحصول على دعم المجتمع والمستثمرين.' : 'Enter your project details to get community feedback and AI jury validation.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateProject} className="flex flex-col gap-4 mt-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم المشروع باللغة العربية *' : 'Project Arabic Name *'}
                </label>
                <input 
                  type="text"
                  required
                  value={newProject.titleAr}
                  onChange={(e) => setNewProject({ ...newProject, titleAr: e.target.value })}
                  placeholder="مثال: تطبيق لودافيا للتعلم الذكي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم المشروع بالإنجليزية (اختياري)' : 'English Project Title'}
                </label>
                <input 
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Lodavia Neural Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'تصنيف المشروع' : 'Category'}
                </label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                >
                  <option value="ai">{isAr ? 'ذكاء اصطناعي (AI & ML)' : 'AI & ML'}</option>
                  <option value="web">{isAr ? 'تطبيق ويب (Web App)' : 'Web App'}</option>
                  <option value="mobile">{isAr ? 'تطبيق هاتف (Mobile App)' : 'Mobile App'}</option>
                  <option value="fintech">{isAr ? 'تقنية مالية (FinTech)' : 'FinTech'}</option>
                  <option value="edtech">{isAr ? 'تعليم ومعرفة (EdTech)' : 'EdTech'}</option>
                  <option value="saas">{isAr ? 'برمجيات سحابية (SaaS)' : 'SaaS'}</option>
                  <option value="creative">{isAr ? 'ميديا وتصميم (Creative)' : 'Creative'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'مرحلة المشروع الحالية' : 'Project Stage'}
                </label>
                <select
                  value={newProject.stage}
                  onChange={(e) => setNewProject({ ...newProject, stage: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                >
                  <option value="idea">{isAr ? 'فكرة وتخطيط (Idea)' : 'Idea'}</option>
                  <option value="prototype">{isAr ? 'نموذج أولي (Prototype)' : 'Prototype'}</option>
                  <option value="mvp">{isAr ? 'منتج جاهز للاختبار (MVP)' : 'MVP'}</option>
                  <option value="launched">{isAr ? 'تم الإطلاق (Launched)' : 'Launched'}</option>
                  <option value="scaling">{isAr ? 'توسع ونمو (Scaling)' : 'Scaling'}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'الشعار السريع (Tagline) *' : 'Elevator Pitch / Tagline *'}
              </label>
              <input 
                type="text"
                required
                value={newProject.taglineAr}
                onChange={(e) => setNewProject({ ...newProject, taglineAr: e.target.value })}
                placeholder="مثال: منصة أتمتة المبيعات بالذكاء الاصطناعي في ثوانٍ معدودة."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'شرح ووصف المشروع بالتفصيل *' : 'Detailed Description *'}
              </label>
              <textarea 
                required
                rows={3}
                value={newProject.descriptionAr}
                onChange={(e) => setNewProject({ ...newProject, descriptionAr: e.target.value })}
                placeholder="اشرح المشكلة التي يحلها المشروع، الشريحة المستهدفة، وكيف يعمل النموذج الربحي..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Tech Stack (comma separated)'}
              </label>
              <input 
                type="text"
                value={newProject.techStack}
                onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                placeholder="React, TypeScript, TailwindCSS, Node.js, Gemini API"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رابط المعاينة المباشرة (Demo URL)' : 'Live Demo Link'}
                </label>
                <input 
                  type="url"
                  value={newProject.demoUrl}
                  onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'رابط GitHub أو الكود المصدري' : 'GitHub / Repository URL'}
                </label>
                <input 
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>{isAr ? 'نشر المشروع وتفعيله الآن 🚀' : 'Publish & Launch Project 🚀'}</span>
            </button>

          </form>
        </div>
      )}

      {/* ----------------- PROJECT DETAILS MODAL ----------------- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#182232] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col text-slate-900 dark:text-white animate-[scaleIn_0.25s_ease-out]">
            
            {/* Modal Banner */}
            <div className="relative h-48 w-full bg-slate-900">
              <img 
                src={selectedProject.bannerImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'} 
                alt={selectedProject.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 inset-x-6 flex justify-between items-end">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-white mt-1 drop-shadow-md">
                    {isAr ? selectedProject.titleAr : selectedProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleUpvote(selectedProject.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-white/30 transition-all"
                  >
                    <Flame className={`w-4 h-4 ${selectedProject.hasUpvoted ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                    <span>{selectedProject.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              
              {/* Creator bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedProject.author.avatar} 
                    alt={selectedProject.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-sky-400" 
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                      {selectedProject.author.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {selectedProject.author.role} • {selectedProject.createdAt}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleEvaluateWithJury(selectedProject);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تقييم لجنة AI ⚖️' : 'AI Jury Review ⚖️'}</span>
                </button>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {isAr ? 'نبذة عن المشروع' : 'Project Overview'}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {isAr ? selectedProject.descriptionAr : selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {isAr ? 'التقنيات المستخدمة' : 'Tech Stack'}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedProject.techStack.map((t, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones / Tasks */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {isAr ? 'قائمة المهام ومراحل التنفيذ' : 'Milestones & Tasks'}
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedProject.tasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => handleToggleTask(selectedProject.id, task.id)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-bold'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {selectedProject.demoUrl && (
                  <a 
                    href={sanitizeExternalUrl(selectedProject.demoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isAr ? 'فتح المعاينة الحية' : 'Live Demo'}</span>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a 
                    href={sanitizeExternalUrl(selectedProject.githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>{isAr ? 'الكود على GitHub' : 'GitHub Repo'}</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- PROJECT JURY MODAL (AI-POWERED) ----------------- */}
      <ProjectJuryModal
        isOpen={isJuryModalOpen}
        onClose={() => setIsJuryModalOpen(false)}
        lang={isAr ? 'ar' : 'en'}
        initialProjectData={juryInitialData}
        onTriggerTool={(toolId) => {
          setIsJuryModalOpen(false);
          if (toolId === 'workspace') setActiveTab('workspace');
          if (toolId === 'create') setActiveTab('create');
        }}
      />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 end-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-2xl flex items-center gap-2 animate-[scaleIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
