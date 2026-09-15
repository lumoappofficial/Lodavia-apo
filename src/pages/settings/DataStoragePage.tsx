import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Database, 
  HardDrive, 
  Trash2, 
  Wifi, 
  RefreshCw, 
  Check, 
  ShieldAlert
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function DataStoragePage() {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  // Storage Stats (Interactive Mock data)
  const [cacheSize, setCacheSize] = useState('142.8 MB');
  const [databaseSize, setDatabaseSize] = useState('12.4 MB');
  const [audioDownloadsSize, setAudioDownloadsSize] = useState('85.1 MB');
  const [lowBandwidth, setLowBandwidth] = useState(() => {
    return localStorage.getItem('data_low_bandwidth') === 'true';
  });

  const [clearing, setClearing] = useState(false);
  const [status, setStatus] = useState('');

  const handleToggleLowBandwidth = () => {
    playSynthSound(600, 'sine', 0.05);
    const newValue = !lowBandwidth;
    setLowBandwidth(newValue);
    localStorage.setItem('data_low_bandwidth', String(newValue));
  };

  const handleClearCache = () => {
    if (clearing) return;
    playSynthSound(220, 'sawtooth', 0.2);
    setClearing(true);
    setStatus(isRtl ? 'جاري تصفية مخابئ البيانات الكونية...' : 'Purging local stellar cache...');
    
    setTimeout(() => {
      setCacheSize('0.0 B');
      setClearing(false);
      setStatus(isRtl ? 'تم مسح ذاكرة التخزين المؤقت بنجاح! 🧹' : 'Local cache successfully freed! 🧹');
      setTimeout(() => setStatus(''), 2500);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out] text-start">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'البيانات وسعة التخزين الكوكبية 🗄️' : 'Stellar Data & Storage 🗄️'}
        description={isRtl ? 'راقب استهلاك المساحة وعين قواعد توفير حزم البيانات المتنقلة' : 'Monitor local space allocation and set cellular bandwidth rules'}
        icon={Database}
        iconColorClass="text-indigo-600 dark:text-indigo-400"
        iconBgClass="bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Space Usage Info */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-md flex flex-col gap-5 shadow-sm">
          <h3 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{isRtl ? 'إحصائيات المساحة والذاكرة' : 'Storage Metrics & allocation'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            
            {/* Cache Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-1 text-start">
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 uppercase font-mono">{isRtl ? 'الملفات المؤقتة' : 'CACHED ITEMS'}</span>
              <span className="text-lg font-black text-[#111827] dark:text-white">{cacheSize}</span>
              <span className="text-[9px] text-[#64748B] dark:text-slate-500">{isRtl ? 'الصور والهولوغرامات المحملة' : 'Images & textures'}</span>
            </div>

            {/* DB Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-1 text-start">
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 uppercase font-mono">{isRtl ? 'قاعدة البيانات' : 'LOCAL METADATA'}</span>
              <span className="text-lg font-black text-[#111827] dark:text-white">{databaseSize}</span>
              <span className="text-[9px] text-[#64748B] dark:text-slate-500">{isRtl ? 'الرسائل والمستندات المحفوظة' : 'Chats & indices'}</span>
            </div>

            {/* Downloads Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-1 text-start">
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 uppercase font-mono">{isRtl ? 'التنزيلات الصوتية' : 'AUDIO DOWNLOADS'}</span>
              <span className="text-lg font-black text-[#111827] dark:text-white">{audioDownloadsSize}</span>
              <span className="text-[9px] text-[#64748B] dark:text-slate-500">{isRtl ? 'الأصوات والبثوث المسجلة' : 'Clips & offline feeds'}</span>
            </div>

          </div>

          <div className="h-px bg-[#E2E8F0] dark:bg-white/5" />

          {/* Action to purge cache */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
            <div>
              <span className="text-xs font-bold text-[#111827] dark:text-white block">{isRtl ? 'تنظيف التخزين المؤقت وتحرير المساحة' : 'Purge All Cached Files'}</span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 max-w-sm">
                {isRtl ? 'سيؤدي هذا إلى تصفية كافة الملفات والصور المؤقتة دون حذف رسائلك أو حسابك' : 'Flush assets, planet covers, and client caches safely without destroying history'}
              </span>
            </div>

            <button
              onClick={handleClearCache}
              disabled={clearing}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                clearing
                  ? 'bg-slate-100 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-slate-500 cursor-not-allowed'
                  : 'bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border-rose-200 dark:border-rose-500/25 hover:border-rose-300 dark:hover:border-rose-500/35 text-rose-600 dark:text-rose-400 active:scale-95'
              }`}
            >
              {clearing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>{clearing ? (isRtl ? 'جاري المسح...' : 'Clearing...') : (isRtl ? 'تفريغ الذاكرة المؤقتة' : 'Purge Cache')}</span>
            </button>
          </div>

        </div>

        {/* Bandwidth Optimization Panel */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-md flex flex-col gap-5 shadow-sm">
          <h3 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Wifi className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{isRtl ? 'تحسين شبكة الاتصال الكونية' : 'Bandwidth Optimization'}</span>
          </h3>

          <div className="flex items-center justify-between p-1">
            <div className="flex gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 h-10 w-10 flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111827] dark:text-white block">
                  {isRtl ? 'تفعيل وضع توفير البيانات المتنقلة' : 'Enable Data Saver Mode'}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                  {isRtl ? 'تقليل دقة الأجرام السماوية والهولوغرامات ثلاثية الأبعاد تلقائياً عند استخدام شبكة الجوال' : 'Render simplified celestial structures and lower texture sizes on cellular networks'}
                </span>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={lowBandwidth}
                onChange={handleToggleLowBandwidth}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500" />
            </label>
          </div>

        </div>

        {/* Clear feedback prompt */}
        {status && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 animate-[slideIn_0.3s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{status}</span>
          </div>
        )}

        {/* Warning Badge */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-4.5 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-[#64748B] dark:text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'تفريغ الذاكرة المؤقتة لن يؤثر على اتصالاتك أو مشاريعك المحفوظة بقنوات لودافيا الكونية، بل سيعيد تحميل أصول الهيدروجين والخرائط عند فتحها مجدداً.' 
              : 'Clearing the local storage index is safe and will not delete your workspace projects, chat transcripts, or authentication hashes.'}
          </p>
        </div>

      </div>

    </div>
  );
}
