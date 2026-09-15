import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { downloadManager, StorageBreakdown } from '../../offline/downloadManager';
import { offlineDB } from '../../offline/db';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  HardDrive, 
  BookOpen, 
  Video, 
  Globe, 
  Gamepad2, 
  Bookmark, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function StorageManager({ onNavigateToDownloads }: { onNavigateToDownloads: () => void }) {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [breakdown, setBreakdown] = useState<StorageBreakdown | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadStorage = async () => {
    const data = await downloadManager.getStorageBreakdown();
    setBreakdown(data);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const formatMB = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleClearCacheOnly = async () => {
    playSynthSound(500, 'sine', 0.08);
    await offlineDB.clearCacheOnly();
    await loadStorage();
    setToastMessage(isRtl ? 'تم تفريغ المؤقتات والأصول البرمجية بأمان 🧹' : 'Asset cache safely cleared 🧹');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearAllOfflineData = async () => {
    playSynthSound(150, 'sawtooth', 0.3);
    await offlineDB.clearAllOfflineData();
    await loadStorage();
    setToastMessage(isRtl ? 'تم حذف كافة بيانات ومحتويات الأوفلاين المحلية 🗑️' : 'All offline content deleted 🗑️');
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!breakdown) return null;

  const totalFormatted = (breakdown.total / (1024 * 1024)).toFixed(1) + ' MB';

  return (
    <div className="flex flex-col gap-6 text-start">
      {/* Header Overview Card */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-purple-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
            <HardDrive className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">
              {isRtl ? 'إدارة سعة التخزين والذاكرة 💾' : 'Storage Manager 💾'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'تحليل تفصيلي للمساحة المستهلكة بواسطة الدورات والألعاب وحزم الفضاء' 
                : 'Detailed storage analysis of cached courses, games, space explorer packs'}
            </p>
          </div>
        </div>

        <div className="text-end">
          <span className="text-xs text-slate-400 block">{isRtl ? 'إجمالي المساحة' : 'Total Space'}</span>
          <span className="text-base font-black text-cyan-400 font-mono">{totalFormatted}</span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
          <Check className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Visual Bar Breakdown */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white">
          {isRtl ? 'توزيع مساحة التخزين المحلي:' : 'Storage Distribution Breakdown:'}
        </h3>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden flex">
          <div style={{ width: `${(breakdown.courses / breakdown.total) * 100}%` }} className="bg-purple-500" title="Courses" />
          <div style={{ width: `${(breakdown.spaceExplorer / breakdown.total) * 100}%` }} className="bg-cyan-500" title="Space Packs" />
          <div style={{ width: `${(breakdown.videos / breakdown.total) * 100}%` }} className="bg-amber-500" title="Videos/Media" />
          <div style={{ width: `${(breakdown.games / breakdown.total) * 100}%` }} className="bg-emerald-500" title="Games" />
          <div style={{ width: `${(breakdown.savedContent / breakdown.total) * 100}%` }} className="bg-blue-500" title="Saved Content" />
          <div style={{ width: `${(breakdown.cache / breakdown.total) * 100}%` }} className="bg-slate-500" title="System Cache" />
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'الدورات التعليمية:' : 'Courses:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.courses)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'حزم الفضاء:' : 'Space Packs:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.spaceExplorer)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'وسائط وفيديوهات:' : 'Media/Videos:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.videos)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'الألعاب:' : 'Games:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.games)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'محتوى محفوظ:' : 'Saved Items:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.savedContent)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-slate-500 shrink-0" />
            <span className="text-slate-300">{isRtl ? 'مؤقتات النظام:' : 'App Cache:'}</span>
            <span className="font-mono text-slate-400">{formatMB(breakdown.cache)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={onNavigateToDownloads}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{isRtl ? 'إدارة التنزيلات بالتفصيل' : 'Manage Downloads'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCacheOnly}
            className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRtl ? 'تفريغ المؤقتات فقط' : 'Clear Cache Only'}</span>
          </button>

          <button
            onClick={handleClearAllOfflineData}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isRtl ? 'حذف كافة بيانات الأوفلاين' : 'Delete All Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
