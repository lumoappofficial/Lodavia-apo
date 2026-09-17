import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { 
  Globe, 
  Users, 
  Mic, 
  Plus, 
  Compass, 
  MessageSquare, 
  Search, 
  Sparkles, 
  Languages, 
  Bell, 
  X, 
  Info, 
  CheckCircle2, 
  Check, 
  Phone, 
  Camera, 
  Brain,
  Tv,
  Film,
  Settings,
  ShoppingBag,
  Gamepad2,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Award,
  HelpCircle,
  Home,
  SlidersHorizontal,
  FileText,
  Video,
  Radio,
  GraduationCap,
  Globe2,
  Lock,
  WifiOff,
  Gift,
  Flame,
  Trophy,
  Headphones,
  Rocket,
  Scale,
  MoreVertical,
  Moon,
  Sun,
  Shield,
  LogOut
} from 'lucide-react';
import DailyRewardsModal from '../components/games/DailyRewardsModal';
import UnifiedCallModal from '../components/call/UnifiedCallModal';
import CosmicCalendarWeather from '../components/CosmicCalendarWeather';
import { getCachedWeather } from '../services/weather.service';
import { firestoreService } from '../firebase/services';
import { STORE_ITEMS } from '../data/storeCatalog';
import { themeStyles } from '../styles/theme';
import rayAvatarIcon from '../assets/images/ray_avatar_icon_1787258127988.jpg';
import LodaviaMascot from '../components/LodaviaMascot';
import { useGestureNavigation } from '../hooks/useGestureNavigation';
import FullScreenCameraModal from '../components/camera/FullScreenCameraModal';
import CameraEdgeHandle from '../components/camera/CameraEdgeHandle';

// Unified modern page transition variants (fade-in + subtle 8px rise, fast fade-out)
const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

// Subtle brand-colored top progress bar for instantaneous navigation feedback
function PageTopProgressBar({ pathname }: { pathname: string }) {
  const [animating, setAnimating] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!animating) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(14,165,233,0.7)] origin-left"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 0.7, 1], opacity: [1, 1, 0] }}
        transition={{
          duration: 0.32,
          times: [0, 0.55, 1],
          ease: ['easeOut', 'easeIn'],
        }}
      />
    </div>
  );
}

export default function DashboardLayout() {
  const {
    currentUser,
    setCurrentUser,
    communities,
    setCommunities,
    setHomePosts,
    setNewPostText,
    lang,
    setLang,
    theme,
    setTheme,
    playSynthSound,
    showCreateModal,
    setShowCreateModal,
    showStoreModal,
    setShowStoreModal,
    showAdPlayer,
    setShowAdPlayer,
    adCountdown,
    setAdCountdown,
    adRewardClaimable,
    setAdRewardClaimable,
    currentAdCompany,
    setCurrentAdCompany,
    storeMessage,
    setStoreMessage,
    activeCall,
    setActiveCall,
    startWatchingAd,
    claimAdReward,
    handlePurchaseItem,
    handleCreateSubmit,
    supportedLanguages,
    t,
    tText
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mobile Quick More Drawer state
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [showDailyRewardsInHeader, setShowDailyRewardsInHeader] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Local state for profile edit modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);

  // Local states for create modal
  const [selectedCreateType, setSelectedCreateType] = useState<'post' | 'voice' | 'video' | 'stream' | 'idea' | 'project' | 'challenge'>('post');
  const [postContent, setPostContent] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');

  const mainRef = useRef<HTMLElement>(null);
  const isRtl = lang === 'ar';

  // Full-Screen Immersive Camera Modal State
  const [isFullScreenCameraOpen, setIsFullScreenCameraOpen] = useState(false);

  // Gesture Navigation Hook: Horizontal swipe between Main sections & Edge swipe for camera
  const {
    isMainSection,
    currentSectionIndex,
    swipeProgress,
    edgeResistance,
    isEdgeSwipingCamera,
    cameraEdgeProgress
  } = useGestureNavigation({
    enabled: true,
    onOpenGlobalCamera: () => {
      playSynthSound(750, 'sine', 0.1);
      setIsFullScreenCameraOpen(true);
    },
    lang
  });

  // Sync edit profile local fields with currentUser
  useEffect(() => {
    setEditName(currentUser.name);
    setEditBio(currentUser.bio);
  }, [currentUser]);

  // Determine active tab based on current URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'home';
    if (path.startsWith('/communities')) return 'communities';
    if (path.startsWith('/lumo') || path.startsWith('/ai-assistant')) return 'lumo';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/explore')) return 'explore';
    if (path.startsWith('/audio')) return 'audio';
    if (path.startsWith('/media')) return 'media';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/parallel-world')) return 'parallel-world';
    if (path.startsWith('/voice-rooms')) return 'voice-rooms';
    if (path.startsWith('/lodavia-games')) return 'lodavia-games';
    if (path.startsWith('/marketplace') || path.startsWith('/store')) return 'store';
    if (path.startsWith('/journey')) return 'journey';
    if (path.startsWith('/more')) return 'more';
    return '';
  };

  const activeTab = getActiveTab();

  const handleEndCall = () => {
    playSynthSound(150, 'sawtooth', 0.25);
    setActiveCall(null);
  };

  const createOptions = [
    { id: 'post', labelAr: 'منشور جديد', labelEn: 'New Post', icon: 'FileText', ready: true },
    { id: 'camera', labelAr: 'كاميرا وتصوير 📸', labelEn: 'Camera Studio', icon: 'Camera', ready: true },
    { id: 'project', labelAr: 'مشروع جديد 🚀', labelEn: 'New Project', icon: 'Rocket', ready: true },
    { id: 'voice', labelAr: 'صالون صوتي', labelEn: 'Audio Room', icon: 'Mic', ready: true },
    { id: 'video', labelAr: 'غرفة مرئية', labelEn: 'Video Room', icon: 'Video', ready: false },
    { id: 'stream', labelAr: 'بث مباشر', labelEn: 'Live Stream', icon: 'Radio', ready: false },
    { id: 'course', labelAr: 'مادة تعليمية', labelEn: 'Academic Course', icon: 'GraduationCap', ready: false },
    { id: 'community', labelAr: 'مجتمع جديد', labelEn: 'New Space', icon: 'Globe2', ready: false }
  ];

  const storeItems = STORE_ITEMS;

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen relative z-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Instant Navigation Top Progress Bar */}
      <PageTopProgressBar pathname={location.pathname} />
      
      {/* ----------------- DESKTOP SIDEBAR NAVIGATION (lg:flex) ----------------- */}
      <aside className={`hidden lg:flex flex-col justify-between sticky top-0 h-screen glass-panel border-e border-slate-200/80 dark:border-sky-500/15 z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20 px-3 py-6' : 'w-64 p-5'
      } bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl`}>
        <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pe-1">
          
          {/* Logo & Collapse Toggle */}
          <div className="flex items-center justify-between">
            <Link 
              to="/home" 
              onClick={() => playSynthSound(800, 'sine', 0.1)}
              className="flex items-center gap-3 overflow-hidden select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-[2px] shrink-0 shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0B1220] rounded-2xl flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200 text-lg">
                  L
                </div>
              </div>

              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-black tracking-widest bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 dark:from-sky-300 dark:via-blue-300 dark:to-cyan-200 bg-clip-text text-transparent">
                    LODAVIA
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Cosmic Ecosystem
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                playSynthSound(600, 'sine', 0.05);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Core Navigation Links - Unified Top 5 Order & Visuals */}
          <nav className="flex flex-col gap-1">
            {[
              { id: 'home', label: tText('الرئيسية', 'Home'), icon: Home, path: '/home' },
              { id: 'communities', label: tText('المجتمعات', 'Communities'), icon: Users, path: '/communities' },
              { id: 'profile', label: tText('الملف الشخصي', 'My Profile'), icon: User, path: '/profile' },
              { id: 'lumo', label: tText('راي والرفيق لومو 🚀', 'Ray & Lumo 🚀'), icon: Sparkles, path: '/lumo', lumoGlow: true },
              { id: 'messages', label: tText('الرسائل', 'Messages'), icon: MessageSquare, path: '/messages', badge: '2' },
              { id: 'notifications', label: tText('الإشعارات', 'Notifications'), icon: Bell, path: '/notifications' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    navigate(item.path);
                  }}
                  title={item.label}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    item.lumoGlow
                      ? (isActive
                          ? 'bg-gradient-to-r from-sky-500/25 via-blue-600/25 to-cyan-500/20 border border-sky-400 text-sky-600 dark:text-sky-300 shadow-md shadow-sky-500/20'
                          : 'bg-sky-500/10 border border-sky-400/30 text-sky-600 dark:text-sky-300 hover:border-sky-400 hover:bg-sky-500/20')
                      : (isActive 
                          ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-300/60 dark:border-sky-500/40 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent')
                  }`}
                >
                  <div className="relative shrink-0">
                    {item.lumoGlow ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-sky-400 shrink-0">
                        <img src={rayAvatarIcon} alt="Lumo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    )}
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Create Button on Sidebar */}
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.1);
              setShowCreateModal(true);
            }}
            className={`w-full py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-black text-xs shadow-md shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-sky-400/30 ${
              sidebarCollapsed ? 'p-2.5' : 'px-4'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {!sidebarCollapsed && <span>{tText('إنشاء محتوى 🚀', 'Create 🚀')}</span>}
          </button>

          {/* Media & Content Hub */}
          {!sidebarCollapsed && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-slate-200/60 dark:border-sky-500/15">
              <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider px-3 mb-1">
                {tText('المحتوى والإعلام', 'Media & Creation')}
              </span>

              {[
                { path: '/explore', label: tText('استكشاف الكون 🧭', 'Explore Universe 🧭'), icon: Compass },
                { path: '/voice-rooms', label: tText('الغرف الصوتية 🎙️', 'Voice Rooms 🎙️'), icon: Mic },
                { path: '/audio', label: tText('صوتيات لودافيا 🎵', 'Lodavia Audio 🎵'), icon: Headphones },
                { path: '/media', label: tText('المرئيات 🎬', 'Media Feed 🎬'), icon: Tv },
                { path: '/projects', label: tText('المشاريع 🚀', 'Projects Hub 🚀'), icon: Rocket },
                { path: '/camera', label: tText('الكاميرا 📸', 'Camera Studio 📸'), icon: Camera },
                { path: '/lodavia-now', label: tText('ماذا يحدث الآن 🔴', 'Lodavia Now 🔴'), icon: Radio },
              ].map((sub, i) => {
                const SubIcon = sub.icon;
                const isSubActive = location.pathname === sub.path;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      navigate(sub.path);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-start cursor-pointer ${
                      isSubActive 
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Learning & Economy Section */}
          {!sidebarCollapsed && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-slate-200/60 dark:border-sky-500/15">
              <span className="text-[10px] font-black uppercase text-[#D9B968] tracking-wider px-3 mb-1">
                {tText('التعلم والمكافآت', 'Knowledge & Store')}
              </span>

              {[
                { path: '/journey', label: tText('التعلم والمعرفة 🧠', 'Learning & Knowledge 🧠'), icon: BookOpen },
                { path: '/lodavia-games', label: tText('الألعاب والتحديات 🎮', 'Games Hub 🎮'), icon: Gamepad2 },
                { path: '/store', label: tText('متجر لودافيا 💎', 'Cosmic Store 💎'), icon: ShoppingBag },
                { path: '/parallel-world', label: tText('العالم الموازي 🪐', 'Parallel World 🪐'), icon: Globe },
                { path: '/offline-center', label: tText('مركز الأوفلاين 📡', 'Offline Center 📡'), icon: WifiOff },
                { path: '/more', label: tText('كل الأقسام ☰', 'All Hubs ☰'), icon: Menu },
              ].map((sub, i) => {
                const SubIcon = sub.icon;
                const isSubActive = location.pathname === sub.path;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      navigate(sub.path);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-start cursor-pointer ${
                      isSubActive 
                        ? 'bg-[#D9B968]/15 text-[#C9A24B] dark:text-[#D9B968] font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* User Profile Footer Card */}
        <div 
          onClick={() => {
            playSynthSound(600, 'sine', 0.05);
            navigate('/profile');
          }}
          className="pt-3 border-t border-slate-200/60 dark:border-sky-500/15 flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-all"
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-full object-cover border-2 border-sky-500/50 group-hover:scale-105 transition-transform shrink-0" 
          />
          {!sidebarCollapsed && (
            <div className="overflow-hidden min-w-0 flex-1">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-500 transition-colors">
                {currentUser.name}
              </h4>
              <span className="text-[10px] text-[#D9B968] font-bold block truncate">
                💎 {currentUser.points} {tText('نقطة', 'Pts')}
              </span>
            </div>
          )}
        </div>

      </aside>

      {/* ----------------- MAIN WRAPPER ----------------- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-sky-500/15 py-2 px-2.5 sm:px-6 lg:px-8 shadow-xs text-[#0F172A] dark:text-slate-100 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 py-0.5">
            
            {/* Left: Brand Logo (for Mobile & Tablet) / Desktop Weather & Language */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link 
                to="/home" 
                onClick={() => playSynthSound(800, 'sine', 0.1)}
                className="lg:hidden flex items-center gap-2 select-none shrink-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-400 p-[1.5px] shrink-0 shadow-xs shadow-sky-500/30">
                  <div className="w-full h-full bg-[#0B1220] rounded-xl flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200 text-xs sm:text-sm">
                    L
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-sky-500 to-blue-700 dark:from-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  LODAVIA
                </span>
              </Link>

              {/* Desktop/Tablet (md: and up): Multi-Language Dropdown Switcher */}
              <div className="relative shrink-0 hidden md:block" ref={langMenuRef}>
                <button 
                  id="btn-header-lang-switcher"
                  onClick={() => {
                    setShowLangMenu(!showLangMenu);
                    playSynthSound(600, 'sine', 0.05);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-sky-500/20 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-sky-400/50 transition-all cursor-pointer select-none shrink-0"
                  title={t('settings.language')}
                >
                  <span className="text-sm">{supportedLanguages.find(l => l.code === lang)?.flag || '🌐'}</span>
                  <span className="hidden lg:inline">{supportedLanguages.find(l => l.code === lang)?.name || 'Language'}</span>
                  <Languages className="w-3 h-3 text-sky-500 opacity-80" />
                </button>

                {/* Dropdown Menu */}
                {showLangMenu && (
                  <div className={`absolute top-full mt-2 w-56 bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-sky-500/20 p-2 z-50 animate-[fadeIn_0.2s_ease-out] ${isRtl ? 'left-0' : 'right-0 sm:left-0'}`}>
                    <div className="px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-white/5 mb-1">
                      <span>{t('settings.language')}</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400">{lang.toUpperCase()}</span>
                    </div>

                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                      {supportedLanguages.map((item) => {
                        const isSelected = item.code === lang;
                        return (
                          <button
                            key={item.code}
                            id={`dropdown-lang-${item.code}`}
                            onClick={() => {
                              playSynthSound(650, 'sine', 0.08);
                              setLang(item.code);
                              setShowLangMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-start ${
                              isSelected
                                ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base shrink-0">{item.flag}</span>
                              <div className="min-w-0">
                                <span className="block truncate">{item.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate">{item.englishName}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-100 dark:border-white/5">
                      <button
                        onClick={() => {
                          setShowLangMenu(false);
                          navigate('/settings/language');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg text-[11px] text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 font-bold transition-all text-center cursor-pointer"
                      >
                        ⚙️ {t('settings.languageDesc')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop/Tablet (md: and up): Cosmic Calendar & Weather Widget */}
              <div className="shrink-0 hidden md:block">
                <CosmicCalendarWeather lang={lang} />
              </div>
            </div>

            {/* Right: Essential Header Elements (Search, Notifications, Points, Profile, More) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* 1. Search button */}
              <button 
                id="btn-header-search"
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  navigate('/search');
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-sky-500/20 hover:border-sky-400/40 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shrink-0"
                title={tText('البحث', 'Search')}
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </button>

              {/* 2. Notifications Button */}
              <button 
                id="btn-header-notifications"
                onClick={() => {
                  playSynthSound(500, 'sine', 0.08);
                  navigate('/notifications');
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-sky-500/20 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 relative transition-all cursor-pointer shrink-0"
                title={tText('التنبيهات', 'Notifications')}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              </button>

              {/* 3. Points Pill */}
              <button 
                id="btn-header-points"
                onClick={() => {
                  playSynthSound(750, 'sine', 0.1);
                  setStoreMessage('');
                  setShowStoreModal(true);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-400/15 dark:bg-amber-400/20 border border-amber-400/40 text-xs font-black text-amber-700 dark:text-amber-300 hover:from-amber-400/30 transition-all cursor-pointer shrink-0"
                title={tText('رصيد النقاط', 'Points Balance')}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9B968]" />
                <span>{currentUser.points} 💎</span>
              </button>

              {/* 4. Direct Profile Avatar Button (1-Click entry to Profile) */}
              <button 
                id="btn-header-profile"
                onClick={() => {
                  playSynthSound(600, 'sine', 0.08);
                  navigate('/profile');
                }}
                className={`p-0.5 sm:p-1 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  activeTab === 'profile'
                    ? 'ring-2 ring-sky-400 border-2 border-sky-400 shadow-md shadow-sky-500/20 bg-sky-500/10'
                    : 'border border-slate-200 dark:border-sky-500/30 hover:border-sky-400 hover:ring-2 hover:ring-sky-400/25 bg-slate-100 dark:bg-white/5'
                }`}
                title={tText(`الملف الشخصي (${currentUser.name})`, `My Profile (${currentUser.name})`)}
                aria-label="My Profile"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-6 h-6 rounded-full object-cover"
                />
              </button>

              {/* 5. Three Dots "More" Dropdown Menu (•••) */}
              <div className="relative shrink-0" ref={settingsMenuRef}>
                <button 
                  id="btn-header-more-settings-dots"
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setShowSettingsMenu(!showSettingsMenu);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border shrink-0 ${
                    showSettingsMenu 
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20' 
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-sky-500/20 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                  }`}
                  title={tText('المزيد والخيارات (•••)', 'More & Options (•••)')}
                  aria-label="Settings and options menu"
                >
                  <MoreVertical className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>

                {/* Dropdown Menu (Contains Secondary Tools, Rewards, Weather & Language) */}
                {showSettingsMenu && (
                  <div className={`absolute top-full mt-2 w-72 max-w-[calc(100vw-24px)] bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-sky-500/25 p-2.5 z-50 animate-[fadeIn_0.2s_ease-out] ${isRtl ? 'left-0' : 'right-0'}`}>
                    {/* Header info - Clickable directly to Profile */}
                    <div 
                      id="menu-header-user-profile"
                      onClick={() => {
                        playSynthSound(600, 'sine', 0.08);
                        setShowSettingsMenu(false);
                        navigate('/profile');
                      }}
                      className="px-3 py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between mb-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all group"
                      title={tText('عرض وتعديل الملف الشخصي', 'View & Edit Profile')}
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.name} 
                          className="w-8 h-8 rounded-full object-cover border border-sky-400 group-hover:scale-105 transition-transform"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[130px] group-hover:text-sky-500 transition-colors">
                            {currentUser.name}
                          </p>
                          <p className="text-[10px] text-sky-600 dark:text-cyan-400 font-semibold">
                            {tText('عرض الملف الشخصي ←', 'View Profile →')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-cyan-400 px-2 py-0.5 rounded-full font-black">
                        Lodavia
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs">
                      {/* 1. Daily Streak Reward (Gift) Trigger */}
                      <button
                        id="btn-menu-daily-rewards"
                        onClick={() => {
                          playSynthSound(700, 'sine', 0.1);
                          setShowSettingsMenu(false);
                          setShowDailyRewardsInHeader(true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-bold transition-all cursor-pointer text-start"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-500 animate-bounce shrink-0" />
                          <div>
                            <span className="block text-xs leading-tight">{tText('المكافآت والهدية اليومية 🎁', 'Daily Rewards & Gift 🎁')}</span>
                            <span className="text-[10px] font-normal text-amber-600/80 dark:text-amber-400/80">
                              {tText('سجل حضورك واكسب النقاط', 'Claim daily streak points')}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-black shrink-0">
                          {tText('استلام', 'Claim')}
                        </span>
                      </button>

                      {/* 2. Secondary Tools Hub (Camera, Projects, Offline) */}
                      <div className="grid grid-cols-3 gap-1 pt-0.5">
                        <button
                          id="btn-menu-camera"
                          onClick={() => {
                            playSynthSound(650, 'sine', 0.08);
                            setShowSettingsMenu(false);
                            setIsFullScreenCameraOpen(true);
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 transition-all text-center cursor-pointer border border-transparent hover:border-sky-400/30"
                          title={tText('استوديو الكاميرا', 'Camera Studio')}
                        >
                          <Camera className="w-4 h-4 text-sky-500" />
                          <span className="text-[10px] font-bold truncate w-full">{tText('الكاميرا', 'Camera')}</span>
                        </button>
                        <button
                          id="btn-menu-projects"
                          onClick={() => {
                            playSynthSound(700, 'sine', 0.08);
                            setShowSettingsMenu(false);
                            navigate('/projects');
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300 transition-all text-center cursor-pointer border border-transparent hover:border-cyan-400/30"
                          title={tText('استوديو المشاريع', 'Projects Hub')}
                        >
                          <Rocket className="w-4 h-4 text-cyan-500" />
                          <span className="text-[10px] font-bold truncate w-full">{tText('المشاريع', 'Projects')}</span>
                        </button>
                        <button
                          id="btn-menu-offline"
                          onClick={() => {
                            playSynthSound(600, 'sine', 0.08);
                            setShowSettingsMenu(false);
                            navigate('/offline-center');
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 transition-all text-center cursor-pointer border border-transparent hover:border-amber-400/30"
                          title={tText('مركز الأوفلاين', 'Offline Center')}
                        >
                          <WifiOff className="w-4 h-4 text-amber-500" />
                          <span className="text-[10px] font-bold truncate w-full">{tText('الأوفلاين', 'Offline')}</span>
                        </button>
                      </div>

                      {/* 3. Compact Weather & Date Row */}
                      {(() => {
                        const cached = getCachedWeather();
                        return (
                          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                              {cached?.iconEmoji ? (
                                <span className="text-base shrink-0">{cached.iconEmoji}</span>
                              ) : (
                                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                              )}
                              <div className="text-start">
                                <span className="block text-[11px] font-bold leading-tight">{tText('الطقس والتقويم', 'Weather & Date')}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-amber-500">
                              {cached ? `${cached.temp}°C ${cached.iconEmoji}` : '34°C ☀️'}
                            </span>
                          </div>
                        );
                      })()}

                      {/* 4. Quick Language Switcher */}
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            <Languages className="w-3.5 h-3.5 text-sky-500" />
                            <span>{t('settings.language')}</span>
                          </div>
                          <button
                            onClick={() => {
                              setShowSettingsMenu(false);
                              navigate('/settings/language');
                            }}
                            className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            {tText('المزيد ←', 'More →')}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {supportedLanguages.slice(0, 4).map((l) => (
                            <button
                              key={l.code}
                              onClick={() => {
                                playSynthSound(600, 'sine', 0.08);
                                setLang(l.code);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                lang === l.code
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                              }`}
                            >
                              <span>{l.flag}</span>
                              <span className="truncate">{l.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-white/5 my-0.5" />

                      {/* 5. General Settings */}
                      <button
                        id="btn-menu-general-settings"
                        onClick={() => {
                          playSynthSound(650, 'sine', 0.08);
                          setShowSettingsMenu(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-700 dark:text-cyan-300 hover:bg-sky-500/20 font-bold transition-all cursor-pointer text-start"
                      >
                        <Settings className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="block leading-tight">{tText('الإعدادات العامة ⚙️', 'General Settings ⚙️')}</span>
                          <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block leading-tight">
                            {tText('تخصيص الحساب والمظهر والأمان', 'Account, display & security')}
                          </span>
                        </div>
                      </button>

                      {/* 6. Appearance & Dark Mode Toggle */}
                      <button
                        id="btn-menu-theme-toggle"
                        onClick={() => {
                          playSynthSound(700, 'sine', 0.08);
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-start font-medium"
                      >
                        <div className="flex items-center gap-2.5">
                          {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Moon className="w-4 h-4 text-sky-500 shrink-0" />
                          )}
                          <span>{theme === 'dark' ? tText('الوضع النهاري', 'Light Mode') : tText('الوضع الليلي', 'Dark Mode')}</span>
                        </div>
                        <span className="text-[10px] bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">
                          {theme === 'dark' ? 'Dark' : 'Light'}
                        </span>
                      </button>

                      {/* 7. Privacy & Security */}
                      <button
                        id="btn-menu-privacy"
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.08);
                          setShowSettingsMenu(false);
                          navigate('/settings/privacy');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-start font-medium"
                      >
                        <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{tText('الخصوصية والأمان', 'Privacy & Security')}</span>
                      </button>

                      {/* 8. All Hubs & Explore (More) */}
                      <button
                        id="btn-menu-more-hubs"
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.08);
                          setShowSettingsMenu(false);
                          navigate('/more');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-start font-medium"
                      >
                        <Menu className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>{tText('جميع الأقسام والاستكشاف', 'All Hubs & Sections')}</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </header>

        {/* CORE CONTENT ROUTE OUTLET WITH SMOOTH PAGE TRANSITIONS */}
        <main ref={mainRef} className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto pb-24 lg:pb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* ----------------- MOBILE & TABLET BOTTOM NAVIGATION BAR (lg:hidden) ----------------- */}
      <nav className="lg:hidden fixed bottom-3 inset-x-2.5 z-40 glass-panel border border-sky-500/20 dark:border-sky-500/20 rounded-3xl p-1.5 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-[#0B1220]/95 text-slate-800 dark:text-slate-200">
        <div className="flex justify-between items-center relative px-0.5">
          
          {/* Tab 1: Home (الرئيسية) */}
          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/home');
            }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all ${
              activeTab === 'home' 
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/15 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[8.5px] font-bold tracking-tight">{tText('الرئيسية', 'Home')}</span>
          </button>

          {/* Tab 2: Media (المرئيات) */}
          <button 
            id="tab-bottom-media"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/media');
            }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all ${
              activeTab === 'media' 
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/15 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Film className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[8.5px] font-bold tracking-tight">{tText('المرئيات', 'Media')}</span>
          </button>

          {/* Central Lumo Button (3D Ray Face Avatar) */}
          <div className="relative -mt-6 px-1 shrink-0 flex flex-col items-center justify-center">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-500/40 via-blue-600/30 to-cyan-500/40 blur-md animate-pulse pointer-events-none" />
            <button 
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                navigate('/lumo');
              }}
              className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer shadow-xl relative group active:scale-95 shrink-0 bg-slate-900 dark:bg-[#0B1220] flex items-center justify-center ${
                activeTab === 'lumo'
                  ? 'border-sky-400 ring-4 ring-sky-500/30 scale-105'
                  : 'border-sky-500/60 hover:border-sky-400 hover:scale-105'
              }`}
              title="Lumo - راي ورفيق الفضاء"
            >
              <LodaviaMascot
                size={42}
                animated={true}
                interactive={false}
                showAura={false}
                state="idle"
                className="pointer-events-none group-hover:scale-110 transition-transform duration-300"
              />
            </button>
            <span className={`text-[8.5px] font-black tracking-tight mt-0.5 ${
              activeTab === 'lumo' ? 'text-sky-500 dark:text-sky-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              Lumo
            </span>
          </div>

          {/* Tab 4: Messages / Chat (الدردشة / الرسائل) */}
          <button 
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/messages');
            }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all ${
              activeTab === 'messages' 
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/15 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-sky-600 text-white text-[8px] font-black flex items-center justify-center">
                2
              </span>
            </div>
            <span className="text-[8.5px] font-bold tracking-tight">{tText('الرسائل', 'Messages')}</span>
          </button>

          {/* Tab 5: Profile (الملف الشخصي) */}
          <button 
            id="tab-bottom-profile"
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              navigate('/profile');
            }}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-all ${
              activeTab === 'profile' 
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/15 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name || 'Profile'} 
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border transition-all ${
                    activeTab === 'profile' 
                      ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-xs' 
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <span className="text-[8.5px] font-bold tracking-tight whitespace-nowrap">
              {tText('الملف الشخصي', 'Profile')}
            </span>
          </button>

        </div>
      </nav>

      {/* ----------------- GLOBAL CREATIVE MODAL (➕) ----------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 max-w-md w-full border border-[#E2E8F0] dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto text-[#111827] dark:text-slate-100">
            
            <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-[#111827] dark:text-slate-100">{tText('ماذا ترغب في إنشائه اليوم؟', 'What to create today?')}</h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowCreateModal(false);
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {createOptions.map((opt) => {
                const ICONS: Record<string, any> = { FileText, Mic, Video, Radio, GraduationCap, Globe2, Camera, Rocket };
                const Icon = ICONS[opt.icon] || FileText;
                const isActive = selectedCreateType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      if (opt.id === 'camera') {
                        setShowCreateModal(false);
                        setIsFullScreenCameraOpen(true);
                        return;
                      }
                      if (opt.id === 'project') {
                        setShowCreateModal(false);
                        navigate('/projects');
                        return;
                      }
                      setSelectedCreateType(opt.id as any);
                    }}
                    className={`relative p-2.5 rounded-2xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-cyan-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {!opt.ready && (
                      <span className="absolute -top-1.5 -end-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-black">
                        <Lock className="w-2 h-2" />
                        {tText('قريبًا', 'Soon')}
                      </span>
                    )}
                    <Icon className="w-4 h-4" />
                    <span className="text-[9.5px] font-bold leading-tight">
                      {tText(opt.labelAr, opt.labelEn)}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={(e) => {
              handleCreateSubmit(e, selectedCreateType, postContent, newRoomTitle);
              setPostContent('');
              setNewRoomTitle('');
            }} className="flex flex-col gap-4 mt-2">
              
              {selectedCreateType === 'post' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{tText('محتوى المنشور', 'Post Content')}</label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={tText('اكتب أفكارك وخبراتك هنا ليراها المجتمع...', 'Write your experiences here...')}
                    className={`w-full py-2.5 px-3 text-xs h-24 resize-none ${themeStyles.glassInput}`}
                  />
                </div>
              )}

              {selectedCreateType === 'voice' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{tText('عنوان الغرفة الصوتية', 'Voice Room Title')}</label>
                  <input
                    type="text"
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    placeholder={tText('مثال: مناقشة كود ريأكت وتطوير الهوية', 'Example: Design system debate')}
                    className={`w-full py-2.5 px-3 text-xs ${themeStyles.glassInput}`}
                  />
                </div>
              )}

              {!createOptions.find((o) => o.id === selectedCreateType)?.ready && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {tText(
                      'هذا النوع قيد التطوير حاليًا وسيتوفر قريبًا — جرّب "منشور جديد" أو "صالون صوتي" الآن.',
                      'This creation type is still in development — try "New Post" or "Audio Room" for now.'
                    )}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!createOptions.find((o) => o.id === selectedCreateType)?.ready}
                className={`w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed ${themeStyles.buttonPrimary}`}
              >
                {tText('تأكيد ونشر الآن 🚀', 'Confirm & Publish 🚀')}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- PROFILE EDIT MODAL ----------------- */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] text-slate-900 dark:text-slate-100">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{tText('تعديل بيانات الملف الشخصي', 'Edit Profile Settings')}</h3>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowEditProfile(false);
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tText('الاسم', 'Name')}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tText('النبذة التعريفية', 'Bio')}</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="glass-input w-full py-2.5 px-3 rounded-xl text-xs h-20 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  playSynthSound(880, 'sine', 0.2);
                  firestoreService.updateProfile(currentUser.id, { name: editName, bio: editBio });
                  setCurrentUser(prev => ({
                    ...prev,
                    name: editName,
                    bio: editBio
                  }));
                  setShowEditProfile(false);
                }}
                className={`w-full py-3 ${themeStyles.buttonPrimary}`}
              >
                {tText('حفظ التعديلات ✨', 'Save Changes ✨')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- LODAVIA REWARDS & COSMETIC STORE MODAL ----------------- */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {tText('متجر مكافآت لودافيا 🪐', 'Lodavia Rewards Store 🪐')}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-medium">
                    {tText('أكمل المهام أو شاهد الإعلانات واقتنِ أروع الميزات!', 'Watch ads to earn points & unlock custom cosmetic upgrades!')}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  playSynthSound(440, 'sine', 0.1);
                  setShowStoreModal(false);
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Points Balance Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold tracking-widest">{tText('الرصيد الحالي', 'Current Balance')}</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    {currentUser.points} {tText('نقطة 💎', 'Lodavia Pts 💎')}
                  </span>
                </div>
              </div>
              
              <button
                onClick={startWatchingAd}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Tv className="w-4 h-4 shrink-0" />
                <span>{tText('شاهد إعلانًا (+50 نقطة) 📺', 'Watch Ad (+50 Pts) 📺')}</span>
              </button>
            </div>

            {storeMessage && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{storeMessage}</span>
              </div>
            )}

            {/* Store items list */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {tText('قائمة المشتريات المتاحة 💎', 'Available Cosmetic Enhancements 💎')}
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {storeItems.map((item) => {
                  const isOwned = currentUser.purchasedItems.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isOwned 
                          ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-cyan-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xl flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{tText(item.nameAr, item.nameEn)}</span>
                            {isOwned && (
                              <span className="text-[9px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                {tText('ممتلك', 'Owned')}
                              </span>
                            )}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {tText(item.descriptionAr, item.descriptionEn)}
                          </p>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        {!isOwned ? (
                          <button
                            onClick={() => handlePurchaseItem(item)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[11px] font-black text-slate-950 transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <span>{item.price}</span>
                            <span className="text-amber-300">💎</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{tText('مفعّل', 'Active')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchases History & Browse Full Store Button */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 items-center text-center">
              <button
                onClick={() => {
                  playSynthSound(600, 'sine', 0.08);
                  setShowStoreModal(false);
                  navigate('/store');
                }}
                className={`w-full py-2.5 ${themeStyles.buttonPrimary}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{tText('تصفح المتجر كاملاً 🛒', 'Browse Full Store 🛒')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- FULLSCREEN IMMERSIVE AD ADVERTISEMENT PLAYER ----------------- */}
      {showAdPlayer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-slate-900/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] text-center">
          
          <div className="flex justify-between items-center w-full max-w-xl mx-auto mt-4">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full animate-pulse">
              {tText('إعلان كوني ممول', 'Sponsored Cosmic Ad')}
            </span>
            <div className="text-xs font-bold text-slate-300">
              {adCountdown > 0 ? (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {tText(`المكافأة تظهر بعد: ${adCountdown} ثوانٍ`, `Reward in: ${adCountdown}s`)}
                </span>
              ) : (
                <span className="text-emerald-300 font-black animate-bounce flex items-center gap-1 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {tText('المكافأة جاهزة للمطالبة!', 'Reward ready to claim!')}
                </span>
              )}
            </div>
          </div>

          <div className="my-auto max-w-xl mx-auto w-full glass-panel border border-sky-400/40 rounded-3xl overflow-hidden aspect-video relative bg-slate-900/90 shadow-2xl flex flex-col justify-between p-6">
            <div className="relative z-10 flex justify-between items-start w-full">
              <span className="text-[10px] font-extrabold tracking-widest text-slate-200">LODAVIA SPONSOR</span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            </div>

            <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg mb-4">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-cyan-300 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-lg font-black text-white tracking-wide line-clamp-1">
                {currentAdCompany}
              </h3>
              <p className="text-xs text-slate-200 mt-2 max-w-sm leading-relaxed">
                {tText(
                  'اكتشف التقنيات الفائقة وعش الابتكار الرقمي في مجتمعاتنا الكونية المتصلة بذكاء.',
                  'Experience modern engineering and infinite scaling inside our unified neural hubs.'
                )}
              </p>
            </div>
          </div>

          <div className="mb-12 max-w-xl mx-auto w-full flex justify-center gap-4">
            {adCountdown > 0 ? (
              <button 
                disabled
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{tText(`يرجى المشاهدة للحصول على 50 نقطة (${adCountdown})`, `Please watch to receive 50 Pts (${adCountdown})`)}</span>
              </button>
            ) : (
              <button 
                onClick={claimAdReward}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer animate-bounce"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{tText('المطالبة بـ 50 نقطة الآن! 🎉', 'Claim 50 Points Now! 🎉')}</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ----------------- HIGH-FIDELITY UNIFIED CALL MODAL ----------------- */}
      {activeCall && (
        <UnifiedCallModal
          activeCall={activeCall}
          currentUser={currentUser}
          lang={lang}
          onEndCall={handleEndCall}
          onAcceptCall={() => {
            if (activeCall) {
              setActiveCall({ ...activeCall, status: 'connected' });
            }
          }}
          onRejectCall={handleEndCall}
          onSendMessageInCall={(msg) => {
            playSynthSound(600, 'sine', 0.05);
          }}
          playSynthSound={playSynthSound}
        />
      )}

      {/* Header Daily Rewards Modal */}
      {showDailyRewardsInHeader && (
        <DailyRewardsModal
          onClose={() => setShowDailyRewardsInHeader(false)}
          onClaimCoinsAndXp={(coins, xp) => {
            setCurrentUser(prev => ({ ...prev, points: prev.points + coins }));
          }}
        />
      )}

      {/* ----------------- MOBILE EDGE SWIPE CAMERA HANDLE ----------------- */}
      {isMainSection && !isFullScreenCameraOpen && (
        <CameraEdgeHandle
          onOpen={() => {
            playSynthSound(700, 'sine', 0.08);
            setIsFullScreenCameraOpen(true);
          }}
          isEdgeSwiping={isEdgeSwipingCamera}
          edgeProgress={cameraEdgeProgress}
          lang={lang}
        />
      )}

      {/* ----------------- BOUNDARY RESISTANCE VISUAL FEEDBACK ----------------- */}
      {edgeResistance && (
        <div 
          className={`fixed top-0 bottom-0 z-50 pointer-events-none transition-all duration-200 ${
            edgeResistance === 'start' 
              ? (isRtl ? 'right-0 border-r-4 border-sky-400/80 shadow-[0_0_25px_rgba(56,189,248,0.6)]' : 'left-0 border-l-4 border-sky-400/80 shadow-[0_0_25px_rgba(56,189,248,0.6)]') 
              : (isRtl ? 'left-0 border-l-4 border-sky-400/80 shadow-[0_0_25px_rgba(56,189,248,0.6)]' : 'right-0 border-r-4 border-sky-400/80 shadow-[0_0_25px_rgba(56,189,248,0.6)]')
          }`}
          style={{ width: '8px' }}
        />
      )}

      {/* ----------------- FULL-SCREEN IMMERSIVE LODAVIA CAMERA ----------------- */}
      <FullScreenCameraModal
        isOpen={isFullScreenCameraOpen}
        onClose={() => setIsFullScreenCameraOpen(false)}
      />

    </div>
  );
}
