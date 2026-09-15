import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Search, 
  Check, 
  Trash2, 
  Sparkles, 
  History, 
  Compass,
  AlertCircle
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function SearchPreferencesPage() {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  // State with localStorage persistence
  const [saveHistory, setSaveHistory] = useState(() => {
    return localStorage.getItem('search_save_history') !== 'false';
  });
  const [showTrending, setShowTrending] = useState(() => {
    return localStorage.getItem('search_show_trending') !== 'false';
  });
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('search_save_history', String(saveHistory));
  }, [saveHistory]);

  useEffect(() => {
    localStorage.setItem('search_show_trending', String(showTrending));
  }, [showTrending]);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    playSynthSound(600, 'sine', 0.05);
    setter(!current);
  };

  const handleClearHistory = () => {
    playSynthSound(200, 'sawtooth', 0.2);
    // Erase mock search histories in local storage if any
    localStorage.removeItem('lodavia_recent_searches');
    
    setStatusMessage(isRtl ? 'تم مسح سجل البحث بالكامل بنجاح! 🧹' : 'Search index successfully flushed! 🧹');
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out] text-start">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'تفضيلات البحث الكوني 🔍' : 'Cosmic Search Preferences 🔍'}
        description={isRtl ? 'إدارة وحذف وحفظ فهرس الكلمات البحثية في الفضاء الرقمي' : 'Manage indices, history, and trending search layouts'}
        icon={Search}
        iconColorClass="text-sky-600 dark:text-cyan-400"
        iconBgClass="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Preferences Panel */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-5 shadow-sm">
          
          {/* Switch 1: Save history */}
          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-cyan-500/10 text-sky-600 dark:text-cyan-400 h-10 w-10 flex items-center justify-center shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'حفظ سجل البحث' : 'Save Search History'}
                </span>
                <span className="text-[10px] text-[#475569] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'تخزين الكلمات والوسوم التي تبحث عنها لتسهيل الوصول إليها مستقبلاً' : 'Store tags, channels and usernames you search for to accelerate future queries'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={saveHistory}
                onChange={() => handleToggle(setSaveHistory, saveHistory)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Switch 2: Show trending */}
          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'إظهار اقتراحات بحث شائعة' : 'Show Trending Suggestions'}
                </span>
                <span className="text-[10px] text-[#475569] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'عرض المواضيع والوسوم الأكثر تداولاً تحت حقل البحث مباشرة' : 'Display globally trending cosmic tags directly under the primary search inputs'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={showTrending}
                onChange={() => handleToggle(setShowTrending, showTrending)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Action 3: Clear History Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-1 gap-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'مسح سجل البحث الحالي' : 'Flush Current Search Index'}
                </span>
                <span className="text-[10px] text-[#475569] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'سيؤدي هذا الإجراء لحذف كافة المحفوظات ومقترحات البحث السابقة نهائياً' : 'Flushes all previously recorded search coordinates and caches instantly'}
                </span>
              </div>
            </div>

            <button
              onClick={handleClearHistory}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 hover:border-rose-300 dark:hover:border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all cursor-pointer active:scale-95 text-center shrink-0"
            >
              {isRtl ? 'مسح سجل البحث 🧹' : 'Clear History 🧹'}
            </button>
          </div>

        </div>

        {/* Clear feedback prompt */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 animate-[slideIn_0.3s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* AI Disclaimer */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-4.5 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-4 h-4 text-[#64748B] dark:text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'تتم حماية تفاعلات وسجلات البحث بأعلى معايير التشفير ولا يتم مشاركتها أبداً مع أطراف ثالثة أو تلسكوبات تابعة لشبكات خارجية.' 
              : 'Search histories are stored in isolated local client spaces and are never distributed outside the Lodavia stellar ledger.'}
          </p>
        </div>

      </div>

    </div>
  );
}
