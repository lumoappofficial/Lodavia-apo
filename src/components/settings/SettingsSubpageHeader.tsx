import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LucideIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SettingsSubpageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  backTo?: string;
}

export default function SettingsSubpageHeader({
  title,
  description,
  icon: Icon,
  iconColorClass = 'text-sky-600 dark:text-cyan-400',
  iconBgClass = 'bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20',
  backTo = '/settings'
}: SettingsSubpageHeaderProps) {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const handleBack = () => {
    playSynthSound(450, 'sine', 0.08);
    navigate(backTo);
  };

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80 dark:border-white/10 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2.5 rounded-2xl ${iconBgClass} ${iconColorClass} shrink-0 shadow-xs flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <button
        id="btn-settings-subpage-back"
        onClick={handleBack}
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold cursor-pointer shrink-0"
        title={isRtl ? 'الرجوع للإعدادات' : 'Back to Settings'}
      >
        {!isRtl && <ChevronLeft className="w-4 h-4" />}
        <span>{isRtl ? 'الإعدادات ⚙️' : 'Settings ⚙️'}</span>
        {isRtl && <ChevronLeft className="w-4 h-4 rotate-180" />}
      </button>
    </div>
  );
}
