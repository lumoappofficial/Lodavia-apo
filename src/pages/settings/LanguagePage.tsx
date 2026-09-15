import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Globe, 
  Check,
  CheckCircle2,
  Sparkles,
  Search,
  Compass,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { SupportedLanguage } from '../../types/i18n';
import { detectDeviceLanguage } from '../../locales';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function LanguagePage() {
  const { 
    lang, 
    setLang, 
    supportedLanguages, 
    t, 
    isRtl, 
    formatDate, 
    formatTime, 
    formatCurrency, 
    playSynthSound 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(() => {
    return !localStorage.getItem('lodavia_lang_manual_override');
  });

  const selectLanguage = (selectedLang: SupportedLanguage) => {
    if (selectedLang === lang) return;
    
    // Play dual tones for cosmic sync
    playSynthSound(600, 'sine', 0.08);
    setTimeout(() => playSynthSound(900, 'sine', 0.12), 80);

    // Save manual selection override
    localStorage.setItem('lodavia_lang_manual_override', 'true');
    setAutoDetectEnabled(false);
    setLang(selectedLang);
  };

  const handleToggleAutoDetect = () => {
    const nextState = !autoDetectEnabled;
    setAutoDetectEnabled(nextState);
    playSynthSound(520, 'sine', 0.1);

    if (nextState) {
      localStorage.removeItem('lodavia_lang_manual_override');
      const detected = detectDeviceLanguage();
      setLang(detected);
    } else {
      localStorage.setItem('lodavia_lang_manual_override', 'true');
    }
  };

  const filteredLanguages = supportedLanguages.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.englishName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q)
    );
  });

  const now = new Date();

  return (
    <div className="max-w-3xl mx-auto w-full pb-24 px-3 sm:px-4 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={`${t('settings.language')} 🌐`}
        description={t('settings.languageDesc')}
        icon={Globe}
        iconColorClass="text-cyan-600 dark:text-cyan-400"
        iconBgClass="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20"
      />

      <div className="relative z-10 flex flex-col gap-5 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Auto Detect Card */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                {t('settings.autoDetect')}
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                {t('settings.autoDetectDesc')}
              </p>
            </div>
          </div>

          <button
            id="toggle-autodetect-lang"
            onClick={handleToggleAutoDetect}
            className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
              autoDetectEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                autoDetectEnabled ? (isRtl ? '-translate-x-5.5' : 'translate-x-5.5') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Search Bar for Languages */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            id="input-search-languages"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className={`w-full py-2.5 bg-white dark:bg-[#182232] rounded-xl border border-[#E2E8F0] dark:border-white/10 text-[#111827] dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/50 shadow-sm transition-all ${
              isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />
        </div>

        {/* Languages Grid / List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredLanguages.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                id={`btn-lang-${item.code}`}
                onClick={() => selectLanguage(item.code)}
                className={`flex items-center justify-between p-4 rounded-2xl border text-start transition-all cursor-pointer select-none group relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/70 dark:bg-cyan-500/10 shadow-sm ring-1 ring-cyan-500/30'
                    : 'border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#182232] hover:border-cyan-500/40 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-2xl shrink-0 select-none transform group-hover:scale-110 transition-transform">
                    {item.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#111827] dark:text-white truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 uppercase font-mono">
                        {item.dir.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] dark:text-slate-400 block truncate mt-0.5">
                      {item.englishName} • {item.region}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-500 block truncate mt-1">
                      {item.description}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="p-1.5 rounded-full bg-cyan-500 text-white shrink-0 shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 group-hover:border-cyan-400 transition-colors" />
                )}
              </button>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50/40 dark:from-[#182232] dark:via-[#131B26] dark:to-[#0F1722] rounded-2xl p-5 border border-sky-100 dark:border-white/10 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold text-[#111827] dark:text-white">
                {t('brand.universe')} • {t('settings.currentLanguageBadge')}
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
              {supportedLanguages.find(l => l.code === lang)?.name} ({lang.toUpperCase()})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] text-slate-500 block">{t('calendar.today')}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                {formatDate(now, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] text-slate-500 block">{t('weather.title')}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                {t('weather.conditions.sunny')} • 24°C
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] text-slate-500 block">{t('store.balance')}</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 mt-1 block truncate">
                1,500 {t('common.points')}
              </span>
            </div>
          </div>
        </div>

        {/* Translation disclaimer */}
        <div className="bg-white dark:bg-[#182232] rounded-xl p-4 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {t('settings.instantSyncNotice')}
          </p>
        </div>

      </div>

    </div>
  );
}
