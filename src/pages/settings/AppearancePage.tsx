import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Palette,
  Check
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function AppearancePage() {
  const { lang, theme, setTheme, playSynthSound } = useApp();

  const isRtl = lang === 'ar';

  const selectTheme = (selectedTheme: 'dark' | 'light' | 'system') => {
    if (selectedTheme === theme) return;

    playSynthSound(700, 'sine', 0.08);
    setTheme(selectedTheme);
  };

  const themeOptions = [
    {
      id: 'light' as const,
      icon: Sun,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      titleAr: 'الوضع الفاتح (Light)',
      titleEn: 'Stellar Day (Light)',
      descAr: 'تصميم مشع ناصع مريح للاستخدام النهاري.',
      descEn: 'A high-contrast clean day experience for luminous navigation.'
    },
    {
      id: 'dark' as const,
      icon: Moon,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      titleAr: 'الوضع الداكن (Dark)',
      titleEn: 'Cosmic Night (Dark)',
      descAr: 'تصميم عاتم فاخر مريح جداً للعينين في الفضاءات المظلمة.',
      descEn: 'A dark slate twilight with eye-friendly cosmic glow.'
    },
    {
      id: 'system' as const,
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      titleAr: 'تلقائي حسب الوقت (Auto)',
      titleEn: 'Chronos Sync (Auto)',
      descAr: 'تزامن تلقائي يتبع إعدادات التوقيت المحلي لجهازك.',
      descEn: 'Align your app view dynamically with your browser preferences.'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'المظهر والسمات المرئية 🎨' : 'Appearance & Theme 🎨'}
        description={isRtl ? 'تخصيص مستويات السطوع والسمات المرئية لواجهة Lodavia' : 'Choose your preferred theme and visual style'}
        icon={Palette}
        iconColorClass="text-sky-600 dark:text-sky-400"
        iconBgClass="bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20"
      />

      <div className="relative z-10 flex flex-col gap-5 text-start">
        {/* Options List */}
        <div className="flex flex-col gap-4">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button 
                key={opt.id}
                onClick={() => selectTheme(opt.id)}
                className={`p-5 rounded-2xl border text-start flex items-start justify-between gap-5 transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-white dark:bg-[#182232] border-[#48B8FF] ring-2 ring-[#48B8FF]/20 shadow-[0_8px_30px_rgba(72,184,255,0.12)]' 
                    : 'bg-white dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/40'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${opt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC]">
                      {isRtl ? opt.titleAr : opt.titleEn}
                    </h3>
                    <p className="text-[11px] text-[#6E7685] dark:text-[#94A3B8] mt-1 leading-relaxed">
                      {isRtl ? opt.descAr : opt.descEn}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-[#48B8FF]/20 text-[#48B8FF] border border-[#48B8FF]/30 shrink-0 mt-1">
                    <Check className="w-4 h-4 shrink-0" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
