import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  UserCog, 
  EyeOff, 
  Lock, 
  Bell, 
  History, 
  Bookmark, 
  Languages, 
  Palette, 
  LogOut,
  ChevronLeft,
  Settings,
  Sparkles,
  Search,
  HardDrive,
  Download,
  Laptop,
  Link2,
  Sliders,
  Shield,
  Layers
} from 'lucide-react';

export default function SettingsPageNew() {
  const { 
    lang, 
    playSynthSound,
    currentUser
  } = useApp();

  const navigate = useNavigate();

  const settingsCategories = [
    {
      id: 'ai_subscription',
      titleAr: 'اشتراكات Lodavia AI الكونية 🚀',
      titleEn: 'Lodavia AI Subscriptions 🚀',
      icon: Sparkles,
      color: 'from-amber-400 via-purple-600 to-cyan-500',
      glow: 'shadow-purple-500/30'
    },
    {
      id: 'ai_preferences',
      titleAr: 'تفضيلات الذكاء الاصطناعي 🤖',
      titleEn: 'AI Intelligence & Engine 🤖',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'account_center',
      titleAr: 'مركز الحساب',
      titleEn: 'Account Center',
      icon: User,
      color: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/20'
    },
    {
      id: 'profile_management',
      titleAr: 'إدارة الملف الشخصي',
      titleEn: 'Profile Management',
      icon: UserCog,
      color: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'privacy',
      titleAr: 'الخصوصية',
      titleEn: 'Privacy',
      icon: EyeOff,
      color: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20'
    },
    {
      id: 'security',
      titleAr: 'الأمان وحماية الحساب',
      titleEn: 'Security & 2FA',
      icon: Lock,
      color: 'from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/20'
    },
    {
      id: 'devices_sessions',
      titleAr: 'الأجهزة والجلسات النشطة',
      titleEn: 'Devices & Active Sessions',
      icon: Laptop,
      color: 'from-sky-500 to-cyan-600',
      glow: 'shadow-sky-500/20'
    },
    {
      id: 'connected_accounts',
      titleAr: 'الحسابات المرتبطة',
      titleEn: 'Linked Accounts',
      icon: Link2,
      color: 'from-purple-500 to-pink-600',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'permissions',
      titleAr: 'صلاحيات وأذونات النظام',
      titleEn: 'System Permissions',
      icon: Sliders,
      color: 'from-teal-500 to-emerald-600',
      glow: 'shadow-teal-500/20'
    },
    {
      id: 'notifications',
      titleAr: 'الإشعارات والتنبيهات',
      titleArCorrect: 'الإشعارات والتنبيهات',
      titleEn: 'Notifications',
      icon: Bell,
      color: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/20'
    },
    {
      id: 'search_preferences',
      titleAr: 'تفضيلات البحث والفلاتر',
      titleEn: 'Search & Filtering',
      icon: Search,
      color: 'from-blue-600 to-indigo-600',
      glow: 'shadow-blue-500/20'
    },
    {
      id: 'content_preferences',
      titleAr: 'تفضيلات المحتوى والخلاصات',
      titleEn: 'Content & Feed Criteria',
      icon: Layers,
      color: 'from-fuchsia-500 to-purple-600',
      glow: 'shadow-fuchsia-500/20'
    },
    {
      id: 'data_storage',
      titleAr: 'البيانات وسعة التخزين',
      titleEn: 'Data & Cloud Storage',
      icon: HardDrive,
      color: 'from-cyan-600 to-blue-700',
      glow: 'shadow-cyan-500/20'
    },
    {
      id: 'downloads',
      titleAr: 'التنزيلات والذاكرة غير المتصلة',
      titleEn: 'Offline Downloads Vault',
      icon: Download,
      color: 'from-purple-600 to-indigo-700',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'community_safety',
      titleAr: 'أمان المجتمع وقائمة الحظر',
      titleEn: 'Community Safety & Blocklist',
      icon: Shield,
      color: 'from-rose-500 to-red-600',
      glow: 'shadow-rose-500/20'
    },
    {
      id: 'activity_history',
      titleAr: 'سجل النشاط',
      titleEn: 'Activity History',
      icon: History,
      color: 'from-rose-500 to-pink-600',
      glow: 'shadow-rose-500/20'
    },
    {
      id: 'saved_items',
      titleAr: 'المحفوظات',
      titleEn: 'Saved Items',
      icon: Bookmark,
      color: 'from-yellow-500 to-amber-600',
      glow: 'shadow-yellow-500/20'
    },
    {
      id: 'language',
      titleAr: 'اللغة والاتجاه',
      titleEn: 'Language & Locale',
      icon: Languages,
      color: 'from-violet-500 to-fuchsia-600',
      glow: 'shadow-violet-500/20'
    },
    {
      id: 'appearance',
      titleAr: 'المظهر والسمات',
      titleEn: 'Appearance & Themes',
      icon: Palette,
      color: 'from-teal-500 to-cyan-600',
      glow: 'shadow-teal-500/20'
    },
    {
      id: 'logout',
      titleAr: 'تسجيل الخروج',
      titleEn: 'Logout',
      icon: LogOut,
      color: 'from-red-500 to-rose-600',
      glow: 'shadow-red-500/20',
      isDanger: true
    }
  ];

  const handleCategoryClick = (category: typeof settingsCategories[0]) => {
    // Play audio effect
    if (category.isDanger) {
      playSynthSound(150, 'sawtooth', 0.3);
    } else {
      playSynthSound(600, 'sine', 0.08);
    }

    // Log to console as requested
    console.log(`Clicked Category: ${category.titleEn} (${category.titleAr})`);

    // Navigate to respective new settings pages
    if (category.id === 'ai_subscription') {
      navigate('/settings/ai-subscription');
    } else if (category.id === 'ai_preferences') {
      navigate('/settings/ai-preferences');
    } else if (category.id === 'account_center') {
      navigate('/settings/account-center');
    } else if (category.id === 'profile_management') {
      navigate('/settings/profile');
    } else if (category.id === 'privacy') {
      navigate('/settings/privacy');
    } else if (category.id === 'security') {
      navigate('/settings/security');
    } else if (category.id === 'devices_sessions') {
      navigate('/settings/devices');
    } else if (category.id === 'connected_accounts') {
      navigate('/settings/connected-accounts');
    } else if (category.id === 'permissions') {
      navigate('/settings/permissions');
    } else if (category.id === 'notifications') {
      navigate('/settings/notifications');
    } else if (category.id === 'search_preferences') {
      navigate('/settings/search-preferences');
    } else if (category.id === 'content_preferences') {
      navigate('/settings/content-preferences');
    } else if (category.id === 'data_storage') {
      navigate('/settings/data-storage');
    } else if (category.id === 'downloads') {
      navigate('/settings/downloads');
    } else if (category.id === 'community_safety') {
      navigate('/settings/community-safety');
    } else if (category.id === 'activity_history') {
      navigate('/settings/activity');
    } else if (category.id === 'saved_items') {
      navigate('/settings/saved');
    } else if (category.id === 'language') {
      navigate('/settings/language');
    } else if (category.id === 'appearance') {
      navigate('/settings/appearance');
    } else if (category.id === 'logout') {
      playSynthSound(150, 'sawtooth', 0.25);
      // Let's implement logout simulation or dispatch real if needed
      localStorage.removeItem('lodavia_current_user');
      window.location.reload();
    }
  };

  const isRtl = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6EAF0] dark:border-[#2A3447]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#48B8FF]/10 border border-[#48B8FF]/20 text-[#48B8FF]">
            <Settings className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {isRtl ? 'الإعدادات والمجرة الكونية ⚙️' : 'Universe & Advanced Settings ⚙️'}
            </h1>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
              {isRtl 
                ? 'تحكم في مدارك الكوني، مستوى الأمان، والخصوصية الفائقة' 
                : 'Configure your stellar presence, secure orbit, and personal preferences'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            navigate('/home');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF]/50 transition-all text-xs cursor-pointer select-none"
        >
          {!isRtl && <ChevronLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للمنزل 🏠' : 'Home 🏠'}</span>
          {isRtl && <ChevronLeft className="w-4 h-4 rotate-180" />}
        </button>
      </div>

      {/* Grid container with glowing ambient background effects */}
      <div className="relative">
        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {settingsCategories.map((cat, index) => {
            const IconComponent = cat.icon;
            const cardTitle = isRtl ? (cat.id === 'notifications' ? cat.titleArCorrect : cat.titleAr) : cat.titleEn;
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                onClick={() => handleCategoryClick(cat)}
                className={`group bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E6EAF0] dark:border-[#2A3447] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#48B8FF]/60 hover:shadow-[0_12px_36px_rgba(72,184,255,0.12)] flex items-center gap-4 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                  cat.isDanger 
                    ? 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/20' 
                    : ''
                }`}
              >
                {/* Left/Right Icon container with gradient background */}
                <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-md ${cat.glow} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Title and Action hint */}
                <div className="flex-1 text-start">
                  <h3 className={`text-sm font-bold ${cat.isDanger ? 'text-red-500 dark:text-red-400' : 'text-[#1A1F2C] dark:text-[#F8FAFC]'} transition-colors duration-300 group-hover:text-[#48B8FF]`}>
                    {cardTitle}
                  </h3>
                  <p className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] mt-0.5 font-medium uppercase tracking-wider">
                    {cat.id.replace('_', ' ')}
                  </p>
                </div>

                {/* Subtle indicator bullet */}
                <div className={`w-1.5 h-1.5 rounded-full ${cat.isDanger ? 'bg-red-500' : 'bg-[#48B8FF]'} opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100`} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] select-none">
          {isRtl 
            ? 'نظام إعدادات لودافيا الفاخر • الإصدار 2.5 • فضاء آمن ومحمي بالكامل' 
            : 'Lodavia Premium Settings Suite • Version 2.5 • End-to-End Cosmic Encryption'}
        </p>
      </div>

    </div>
  );
}
