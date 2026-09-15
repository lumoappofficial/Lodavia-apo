import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Check,
  EyeOff,
  Globe,
  Sliders,
  Tag,
  Star,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface InterestTag {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
}

export default function ContentPreferencesPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  // Toggle options states
  const [hideSensitive, setHideSensitive] = useState(true);
  const [localLanguageOnly, setLocalLanguageOnly] = useState(false);

  // Interest tags
  const interestList: InterestTag[] = [
    { id: 'tech', nameAr: 'تقنية وبرمجة', nameEn: 'Tech & Code', emoji: '💻' },
    { id: 'ai', nameAr: 'ذكاء اصطناعي', nameEn: 'Artificial Intelligence', emoji: '🧠' },
    { id: 'sports', nameAr: 'رياضة ولياقة', nameEn: 'Sports & Fitness', emoji: '⚽' },
    { id: 'art', nameAr: 'رسم وفنون وبصريات', nameEn: 'Art & Design', emoji: '🎨' },
    { id: 'travel', nameAr: 'سياحة وسفر', nameEn: 'Travel & Exploration', emoji: '✈️' },
    { id: 'cooking', nameAr: 'طبخ ووصفات عالمية', nameEn: 'Cooking & Culinary', emoji: '🍳' },
    { id: 'music', nameAr: 'موسيقى وصوتيات', nameEn: 'Music & Audio', emoji: '🎵' },
    { id: 'business', nameAr: 'ريادة أعمال واستثمار', nameEn: 'Business & Startups', emoji: '📈' },
    { id: 'space', nameAr: 'فلك وعلوم الكون', nameEn: 'Astronomy & Space', emoji: '🌌' }
  ];

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['tech', 'ai', 'space']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerSaveFeedback = (msgEn: string, msgAr: string, tone = 700) => {
    playSynthSound(tone, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggleInterest = (id: string) => {
    playSynthSound(500, 'sine', 0.05);
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        const updated = prev.filter(item => item !== id);
        triggerSaveFeedback('Interest removed from feed suggestions', 'تم إزالة الاهتمام من قائمة المقترحات الكونية 🪐', 450);
        return updated;
      } else {
        const updated = [...prev, id];
        triggerSaveFeedback('Interest added for tailored feed recommendations', 'تم إضافة الاهتمام لتخصيص جدول خلاصتك ✨', 720);
        return updated;
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'تفضيلات المحتوى المقترح 🎨' : 'Content & Feed Preferences 🎨'}
        description={isRtl ? 'تخصيص الخلاصات وتعديل مستشعرات المحتوى والمنشورات المقترحة' : 'Tailor your stellar suggestions and filter content criteria'}
        icon={Sliders}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* General switches section */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-4 shadow-sm">
          <h2 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5">
            <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{isRtl ? 'عوامل تصفية المحتوى والخصوصية 🛡️' : 'Privacy & Content Filtering 🛡️'}</span>
          </h2>

          {/* Switch 1: Hide sensitive content */}
          <div className="flex items-center justify-between gap-4 py-1.5">
            <div className="flex flex-col gap-1 pr-2">
              <span className="text-xs font-bold text-[#111827] dark:text-white">
                {isRtl ? 'إخفاء المحتوى الحساس تلقائياً' : 'Auto-hide Sensitive Content'}
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 max-w-sm leading-normal">
                {isRtl 
                  ? 'يقوم النظام تلقائياً بتظليل المنشورات والصوتيات التي قد تحتوي على مشاهد أو نقاشات حادة.' 
                  : 'Stellar algorithms will automatically blur comments or threads flagged as intense or graphic.'}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={hideSensitive}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setHideSensitive(e.target.checked);
                  triggerSaveFeedback(
                    `Sensitive filtering ${e.target.checked ? 'activated' : 'deactivated'}`,
                    `تم ${e.target.checked ? 'تفعيل' : 'إلغاء تفعيل'} فلترة المحتوى الحساس 🛡️`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
            </label>
          </div>

          {/* Switch 2: Display my language only */}
          <div className="flex items-center justify-between gap-4 py-1.5 border-t border-[#E2E8F0] dark:border-white/5 pt-3">
            <div className="flex flex-col gap-1 pr-2">
              <span className="text-xs font-bold text-[#111827] dark:text-white">
                {isRtl ? 'عرض محتوى بلغتي فقط بالمقترحات' : 'Limit Recommendations to My Language'}
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 max-w-sm leading-normal">
                {isRtl 
                  ? 'توجيه محرك التوصيات لعرض المنشورات وغرف الصوت التي تنتمي للغتك الأم فقط.' 
                  : 'Optimize the galaxy index to surface posts or audio channels set in your primary tongue.'}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={localLanguageOnly}
                onChange={(e) => {
                  playSynthSound(600, 'sine', 0.05);
                  setLocalLanguageOnly(e.target.checked);
                  triggerSaveFeedback(
                    `Language focus ${e.target.checked ? 'locked' : 'unlocked'}`,
                    `تم ${e.target.checked ? 'تفعيل' : 'إلغاء تفعيل'} حصر الاقتراحات بلغتك الأم 🌍`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
            </label>
          </div>

        </div>

        {/* Interests Multi-Selection section */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-white/5">
            <h2 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isRtl ? 'مدارات الاهتمام والمجالات 🪐' : 'My Orbit Fields of Interest 🪐'}</span>
            </h2>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              {selectedInterests.length} {isRtl ? 'نشط' : 'Selected'}
            </span>
          </div>

          <p className="text-[10px] text-[#475569] dark:text-slate-400 leading-normal mb-1">
            {isRtl 
              ? 'اختر مجالاتك المفضلة لتخصيص جدول منشورات المستكشفين واللقاءات وغرف الحوار الصوتي المتاحة.'
              : 'Select one or more topics to customize the spatial routing of your home explore feeds.'}
          </p>

          <div className="flex flex-wrap gap-2.5 mt-2">
            {interestList.map((tag) => {
              const isSelected = selectedInterests.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => handleToggleInterest(tag.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-100 dark:bg-purple-600/15 border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 shadow-sm' 
                      : 'bg-slate-50 dark:bg-white/[0.02] border-[#E2E8F0] dark:border-white/5 text-[#475569] dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15'
                  } border`}
                >
                  <span className="text-sm shrink-0 leading-none">{tag.emoji}</span>
                  <span>{isRtl ? tag.nameAr : tag.nameEn}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-4 rounded-xl border border-dashed border-[#E2E8F0] dark:border-white/10 text-[10px] text-[#64748B] dark:text-slate-500 flex items-center gap-2 leading-relaxed bg-slate-50 dark:bg-transparent">
          <HelpCircle className="w-4.5 h-4.5 text-[#64748B] dark:text-slate-600 shrink-0" />
          <span>
            {isRtl 
              ? 'يستغرق محرك الذكاء الاصطناعي Lina قرابة ٣٠ دقيقة لتوجيه مدارات منشوراتك بالكامل استناداً لتفضيلاتك الجديدة.'
              : 'Our system requires roughly 30 minutes to propagate your cognitive preferences across parallel peer streaming structures.'}
          </span>
        </div>

      </div>

    </div>
  );
}
