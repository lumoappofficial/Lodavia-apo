import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  Languages, 
  Moon, 
  Smartphone, 
  Bell, 
  Bookmark, 
  Activity, 
  Key, 
  User, 
  ArrowLeft, 
  ArrowRight,
  Globe,
  Tv,
  Brain,
  Gamepad2,
  BookOpen,
  WifiOff,
  Headphones,
  Radio,
  Rocket,
  Camera,
  Compass,
  Scale
} from 'lucide-react';

export default function MorePage() {
  const { lang, currentUser, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const sections = [
    {
      titleAr: '🪐 الأحداث والفلك وسماء لودافيا',
      titleEn: '🪐 Live Global Events & Astronomy',
      items: [
        {
          id: 'lodavia-sky',
          titleAr: 'سماء لودافيا – LODAVIA SKY 🌌',
          titleEn: 'LODAVIA SKY (Real-Time AR Astronomy)',
          descAr: 'كاميرا واقع معزز AR لرصد القمر والشمس والكواكب والنجوم وتتبع الظواهر الفلكية بالـ GPS والبوصلة',
          descEn: 'Real-time AR camera to track planets, Moon phases, stars, and celestial events using GPS and orientation',
          icon: Compass,
          color: 'text-cyan-400',
          path: '/sky'
        },
        {
          id: 'lodavia-now',
          titleAr: 'ماذا يحدث الآن؟ (LODAVIA NOW)',
          titleEn: 'LODAVIA NOW Live Global Radar',
          descAr: 'تغطية حية ومباشرة للأحداث الفلكية والتقنية والرياضية والعالمية الموثقة مع عداد تنازلي حقيقي',
          descEn: 'Real-time verified global events across space, tech, sports & world with real-time countdown',
          icon: Radio,
          color: 'text-rose-500',
          path: '/lodavia-now'
        }
      ]
    },
    {
      titleAr: '🎧 البيئة الصوتية المستقبلية',
      titleEn: '🎧 Future Audio Ecosystem',
      items: [
        {
          id: 'audio',
          titleAr: 'لودافيا للصوتيات (LODAVIA Audio)',
          titleEn: 'LODAVIA Audio Ecosystem',
          descAr: 'موسيقى، بودكاست، كتب صوتية، أصوات طبيعة وميكسر استرخاء بالذكاء الاصطناعي',
          descEn: 'Music, podcasts, audiobooks, ambient sounds & Audio AI recommendations',
          icon: Headphones,
          color: 'text-sky-400',
          path: '/audio'
        }
      ]
    },
    {
      titleAr: '💰 المحفظة والمكافآت',
      titleEn: '💰 Wallet & Rewards',
      items: [
        {
          id: 'store',
          titleAr: 'متجر لودافيا للمكافآت',
          titleEn: 'Lodavia Rewards Store',
          descAr: 'اقتنِ الشارات، الهالات النيونية، والعناوين الكونية',
          descEn: 'Get titles, neon frames, and cosmetic perks',
          icon: Sparkles,
          color: 'text-yellow-400',
          path: '/store'
        },
        {
          id: 'creator',
          titleAr: 'فضاء المبدعين والربح',
          titleEn: 'Creator Economy Hub',
          descAr: 'أدوات تحقيق الدخل ودعم صناع المحتوى',
          descEn: 'Monetization tools & creator metrics',
          icon: Award,
          color: 'text-purple-400',
          path: '/creator-economy'
        }
      ]
    },
    {
      titleAr: '🚀 المشاريع والكاميرا والإبداع',
      titleEn: '🚀 Projects & Camera Studio',
      items: [
        {
          id: 'projects',
          titleAr: 'استوديو المشاريع ولجنة التحكيم 🚀',
          titleEn: 'Projects & AI Jury Studio',
          descAr: 'استكشاف وبناء المشاريع التقنية مع لجنة تحكيم الذكاء الاصطناعي ومساحات العمل',
          descEn: 'Build and validate tech projects with multi-judge AI evaluation and milestone boards',
          icon: Rocket,
          color: 'text-indigo-400',
          path: '/projects'
        },
        {
          id: 'camera',
          titleAr: 'استوديو الكاميرا والتصوير الكوني 📸',
          titleEn: 'Cosmic Camera & AR Studio',
          descAr: 'تصوير احترافي، فلاتر حية، تسجيل فيديو عالي الدقة وتأثيرات فضائية',
          descEn: 'Live AR filters, high-resolution snapshots, video recording and cosmic props',
          icon: Camera,
          color: 'text-cyan-400',
          path: '/camera'
        }
      ]
    },
    {
      titleAr: '🛍️ المنتجات والخدمات التفاعلية',
      titleEn: '🛍️ Interactive Products & Services',
      items: [
        {
          id: 'marketplace',
          titleAr: 'سوق المشاريع والأفكار',
          titleEn: 'Projects Marketplace',
          descAr: 'تصفح واشترِ البرمجيات والأفكار الابتكارية',
          descEn: 'Browse & trade innovative software & ideas',
          icon: ShoppingBag,
          color: 'text-cyan-400',
          path: '/marketplace'
        },
        {
          id: 'games',
          titleAr: 'ألعاب لودافيا الكونية',
          titleEn: 'Lodavia Cosmic Games',
          descAr: 'تحديات ذكاء وسرعة مع أصدقائك',
          descEn: 'Play arcade, quizzes, and brain games',
          icon: Gamepad2,
          color: 'text-emerald-400',
          path: '/lodavia-games'
        },
        {
          id: 'journey',
          titleAr: 'رحلة التعلم والمعرفة',
          titleEn: 'Learning & Knowledge Journey',
          descAr: 'مسارات تعليمية وشهادات إنجاز',
          descEn: 'Skill paths & achievement certificates',
          icon: BookOpen,
          color: 'text-blue-400',
          path: '/journey'
        },
        {
          id: 'offline-center',
          titleAr: 'مركز لودافيا للأوفلاين 📡',
          titleEn: 'Lodavia Offline Center 📡',
          descAr: 'التنزيلات، ألعاب الأوفلاين، حزم الفضاء، وإدارة المزامنة',
          descEn: 'Offline downloads, space explorer, games & sync queue',
          icon: WifiOff,
          color: 'text-amber-400',
          path: '/offline-center'
        },
        {
          id: 'daily',
          titleAr: 'ملخص لودافيا اليومي',
          titleEn: 'Lodavia Daily AI Brief',
          descAr: 'نشرة أخبار تقنية ملخصة بالذكاء الاصطناعي',
          descEn: 'AI synthesized daily tech digests',
          icon: Brain,
          color: 'text-pink-400',
          path: '/ai-daily'
        }
      ]
    },
    {
      titleAr: '⚙️ الإعدادات والتحكم',
      titleEn: '⚙️ Settings & Control',
      items: [
        {
          id: 'settings',
          titleAr: 'الإعدادات العامة',
          titleEn: 'General Settings',
          descAr: 'تخصيص الحساب، الخصوصية، والإشعارات',
          descEn: 'Customize account, privacy & notifications',
          icon: Settings,
          color: 'text-slate-300',
          path: '/settings'
        },
        {
          id: 'privacy',
          titleAr: 'الخصوصية والأمان',
          titleEn: 'Privacy & Security',
          descAr: 'حماية البيانات وكلمات المرور والجلسات',
          descEn: 'Manage passwords, security & sessions',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          path: '/settings/privacy'
        },
        {
          id: 'branding',
          titleAr: 'حول Lodavia والدليل البصري',
          titleEn: 'About Lodavia & Branding',
          descAr: 'رؤية التطبيق، الهوية الكونية، ووسائل التواصل',
          descEn: 'App vision, brand guidelines & social links',
          icon: HelpCircle,
          color: 'text-indigo-400',
          path: '/branding-kit'
        }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full pb-24 animate-[fadeIn_0.4s_ease-out] flex flex-col gap-6">
      
      {/* Profile Header Card */}
      <div 
        onClick={() => {
          playSynthSound(600, 'sine', 0.08);
          navigate('/profile');
        }}
        className="glass-panel p-6 rounded-3xl border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-4 cursor-pointer hover:border-sky-400 transition-all bg-sky-50/50 dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-cyan-950/30 group"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-sky-400 shadow-md group-hover:scale-105 transition-transform" 
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
          </div>

          <div>
            <h2 className="text-base font-black text-[#111827] dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className="text-[10px] bg-sky-500/15 text-sky-700 dark:text-purple-400 px-2 py-0.5 rounded-md font-bold uppercase">Level 12</span>
            </h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5 line-clamp-1">{currentUser.bio || 'مستكشف كوني داخل Lodavia'}</p>
            
            <div className="flex items-center gap-3 mt-2 text-[10px] text-amber-600 dark:text-yellow-400 font-bold">
              <span>💎 {currentUser.points} {isRtl ? 'نقطة' : 'Points'}</span>
              <span>•</span>
              <span className="text-sky-600 dark:text-cyan-400">{currentUser.purchasedItems.length} {isRtl ? 'عنصر ممتلك' : 'Unlocked Perks'}</span>
            </div>
          </div>
        </div>

        <button className="p-2 rounded-2xl bg-white dark:bg-white/5 group-hover:bg-sky-500/10 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-all">
          <ArrowIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Categorized Sections */}
      {sections.map((sec, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-[#64748B] dark:text-slate-400 uppercase tracking-wider px-2">
            {isRtl ? sec.titleAr : sec.titleEn}
          </h3>

          <div className="glass-panel rounded-3xl border border-[#E2E8F0] dark:border-white/5 overflow-hidden flex flex-col divide-y divide-[#E2E8F0] dark:divide-white/5">
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.08);
                    navigate(item.path);
                  }}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-2xl bg-sky-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#111827] dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                        {isRtl ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-[10px] text-[#475569] dark:text-slate-400 mt-0.5">
                        {isRtl ? item.descAr : item.descEn}
                      </p>
                    </div>
                  </div>

                  <ArrowIcon className="w-4 h-4 text-slate-400 group-hover:text-[#111827] dark:group-hover:text-white transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}
