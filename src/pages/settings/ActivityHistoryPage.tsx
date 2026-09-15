import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  History, 
  Trash2, 
  MessageSquare, 
  Heart, 
  Volume2, 
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface ActivityItem {
  id: string;
  type: 'post' | 'like' | 'comment' | 'voice' | 'badge';
  descriptionAr: string;
  descriptionEn: string;
  timeAr: string;
  timeEn: string;
}

export default function ActivityHistoryPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const initialActivities: ActivityItem[] = [
    {
      id: 'act_1',
      type: 'post',
      descriptionAr: 'نشرت منشوراً جديداً في مجتمع المطورين: "بناء مستقبلك البرمجي في فضاء لودافيا!"',
      descriptionEn: 'Published a new post in Developers Hub: "Building your coding future in Lodavia!"',
      timeAr: 'منذ ساعتين',
      timeEn: '2 hours ago'
    },
    {
      id: 'act_2',
      type: 'like',
      descriptionAr: 'أعجبت بمنشور Lina: "رصد سديم كوني جديد باستخدام تلسكوب الفناء الخلفي"',
      descriptionEn: "Liked Lina's post: 'Capturing a new nebula using my backyard telescope'",
      timeAr: 'منذ ٤ ساعات',
      timeEn: '4 hours ago'
    },
    {
      id: 'act_3',
      type: 'comment',
      descriptionAr: 'علّقت على موضوع حوار الذكاء الاصطناعي: "تطور الـ LLMs كحلول تكافلية"',
      descriptionEn: "Commented on AI Dialog thread: 'The evolutionary path of LLMs as symbiotic helpers'",
      timeAr: 'منذ يوم واحد',
      timeEn: '1 day ago'
    },
    {
      id: 'act_4',
      type: 'voice',
      descriptionAr: 'انضممت إلى الغرفة الصوتية المباشرة: "آفاق تطوير الجيل التالي من الويب"',
      descriptionEn: 'Joined the live audio room: "Next-gen Web Development Horizons"',
      timeAr: 'منذ يومين',
      timeEn: '2 days ago'
    },
    {
      id: 'act_5',
      type: 'badge',
      descriptionAr: 'حصلت على وسم الشرف الكوني: "المستكشف النشط 🌟"',
      descriptionEn: 'Earned the stellar honor badge: "Active Pathfinder 🌟"',
      timeAr: 'منذ ٣ أيام',
      timeEn: '3 days ago'
    }
  ];

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('lodavia_activity_history');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearHistory = () => {
    playSynthSound(150, 'sawtooth', 0.25);
    setActivities([]);
    localStorage.setItem('lodavia_activity_history', JSON.stringify([]));
    setToastMessage(isRtl ? 'تم مسح سجل النشاط بالكامل 🗑️' : 'Activity history completely erased 🗑️');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'post': return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'like': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'voice': return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'badge': return <Sparkles className="w-4 h-4 text-amber-400" />;
      default: return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityColorClass = (type: ActivityItem['type']) => {
    switch (type) {
      case 'post': return 'bg-cyan-500/10 border-cyan-500/20';
      case 'like': return 'bg-rose-500/10 border-rose-500/20';
      case 'comment': return 'bg-purple-500/10 border-purple-500/20';
      case 'voice': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'badge': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'سجل النشاط الكوني 📜' : 'Cosmic Activity History 📜'}
        description={isRtl ? 'استعراض خطك الزمني للنشاطات، التفاعلات، والمشاركات في لودافيا' : 'Audit your historical timeline of activities, likes, and cosmic replies'}
        icon={History}
        iconColorClass="text-cyan-600 dark:text-cyan-400"
        iconBgClass="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Sync alert banner */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Timeline List */}
        {activities.length > 0 ? (
          <div className="flex flex-col gap-4 relative">
            {/* Thread Line */}
            <div className={`absolute top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-transparent ${isRtl ? 'right-[23px]' : 'left-[23px]'}`} />

            {activities.map((act) => (
              <div 
                key={act.id}
                className="bg-white dark:bg-[#182232] rounded-2xl p-4 border border-[#E2E8F0] dark:border-white/10 flex items-start gap-4 transition-all duration-300 hover:border-sky-300 dark:hover:border-white/20 relative shadow-sm"
              >
                <div className={`p-2 rounded-xl border shrink-0 z-10 ${getActivityColorClass(act.type)}`}>
                  {getActivityIcon(act.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#111827] dark:text-slate-200 leading-relaxed font-semibold">
                    {isRtl ? act.descriptionAr : act.descriptionEn}
                  </p>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-500 mt-1.5 block font-mono">
                    {isRtl ? act.timeAr : act.timeEn}
                  </span>
                </div>
              </div>
            ))}

            {/* Clear Button Section */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-white/5 flex justify-end">
              <button
                onClick={clearHistory}
                className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-xs font-bold text-red-600 dark:text-red-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'مسح السجل بالكامل' : 'Clear All History'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#182232] rounded-2xl p-12 border border-[#E2E8F0] dark:border-white/5 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 mb-4 border border-[#E2E8F0] dark:border-white/10">
              <Info className="w-6 h-6 text-[#64748B] dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-slate-300">
              {isRtl ? 'السجل فارغ حالياً' : 'No Activity History'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-500 mt-1 max-w-sm leading-relaxed">
              {isRtl 
                ? 'لم يتم تسجيل أي تفاعلات أو نشاطات كوكبية بعد. جميع نشاطاتك المستقبلية ستظهر هنا.' 
                : 'Your cosmic log is currently clear. Future posts, comments, and likes will be securely cached here.'}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
