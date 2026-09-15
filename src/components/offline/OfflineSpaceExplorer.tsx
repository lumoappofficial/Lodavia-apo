import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PRESET_SPACE_PACKS } from '../../offline/presetData';
import { SpacePackItem, offlineDB } from '../../offline/db';
import { downloadManager } from '../../offline/downloadManager';
import { 
  Globe, 
  Download, 
  Check, 
  Trash2, 
  Eye, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  Layers, 
  Compass,
  Radio,
  FileText
} from 'lucide-react';

export default function OfflineSpaceExplorer() {
  const { lang, currentUser, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [packs, setPacks] = useState<SpacePackItem[]>(PRESET_SPACE_PACKS);
  const [activePack, setActivePack] = useState<SpacePackItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync saved status from IndexedDB
  useEffect(() => {
    const syncPacks = async () => {
      const storedPacks = await offlineDB.getSpacePacks();
      setPacks(prev => prev.map(p => {
        const found = storedPacks.find(sp => sp.id === p.id);
        if (found) {
          return { ...p, downloadStatus: found.downloadStatus, downloadedAt: found.downloadedAt };
        }
        return p;
      }));
    };
    syncPacks();
  }, []);

  // Subscribe to Download Manager events
  useEffect(() => {
    const unsub = downloadManager.subscribe((id, prog, status) => {
      if (status === 'DOWNLOADING') {
        setDownloadingId(id);
        setProgress(prog);
      } else if (status === 'DOWNLOADED') {
        setDownloadingId(null);
        setProgress(100);
        setPacks(prev => prev.map(p => p.id === id ? { ...p, downloadStatus: 'DOWNLOADED', downloadedAt: Date.now() } : p));
        setToastMessage(isRtl ? 'تم تحميل حزمة الفضاء بنجاح في الجهاز! 🚀' : 'Space pack downloaded successfully! 🚀');
        setTimeout(() => setToastMessage(null), 3000);
      } else if (status === 'REMOVED') {
        setDownloadingId(null);
        setProgress(0);
        setPacks(prev => prev.map(p => p.id === id ? { ...p, downloadStatus: 'AVAILABLE' } : p));
      }
    });
    return unsub;
  }, [isRtl]);

  const handleDownloadPack = async (pack: SpacePackItem) => {
    if (pack.isPremium && !currentUser.isPremium) {
      playSynthSound(300, 'sawtooth', 0.2);
      setToastMessage(isRtl ? 'تتطلب هذه الحزمة اشتراك LODAVIA Offline+ ⭐' : 'This pack requires LODAVIA Offline+ subscription ⭐');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    playSynthSound(600, 'sine', 0.1);

    const savedFormat: any = {
      id: pack.id,
      type: 'space_pack',
      title: isRtl ? pack.nameAr : pack.nameEn,
      titleAr: pack.nameAr,
      titleEn: pack.nameEn,
      thumbnail: pack.cachedImages[0],
      cachedContent: pack,
      downloadStatus: 'DOWNLOADING',
      downloadProgress: 0,
      downloadedAt: Date.now(),
      size: pack.size,
      sizeFormatted: pack.sizeFormatted,
      version: '1.0.0',
      syncStatus: 'SYNCED',
      isPremium: pack.isPremium
    };

    await offlineDB.saveSpacePack(pack);
    await downloadManager.startDownload(savedFormat);
  };

  const handleDeletePack = async (packId: string) => {
    playSynthSound(500, 'sine', 0.08);
    await downloadManager.deleteDownload(packId);
    setPacks(prev => prev.map(p => p.id === packId ? { ...p, downloadStatus: 'AVAILABLE' } : p));
    setToastMessage(isRtl ? 'تم حذف الحزمة من الذاكرة المحلية 🗑️' : 'Space pack removed from offline cache 🗑️');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 text-start">
      {/* Top Header */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 bg-purple-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">
              {isRtl ? 'مستكشف الفضاء بدون إنترنت 🌌' : 'Offline Space Explorer 🌌'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'حزم الكواكب والنجوم المجانية والمميزة المقترنة بالرسوميات التفاعلية' 
                : 'Download high-definition planetary datasets and offline interactive 3D canvases'}
            </p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
          <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid of Space Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packs.map(pack => {
          const isDownloaded = pack.downloadStatus === 'DOWNLOADED';
          const isDownloading = downloadingId === pack.id;

          return (
            <div
              key={pack.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 transition-all hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{pack.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {isRtl ? pack.nameAr : pack.nameEn}
                      </h3>
                      {pack.isPremium && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-black text-amber-300 uppercase">
                          Offline+
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl ? pack.descriptionAr : pack.descriptionEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400">
                  {pack.sizeFormatted}
                </span>

                <div className="flex items-center gap-2">
                  {isDownloaded ? (
                    <>
                      <button
                        onClick={() => setActivePack(pack)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'عرض الكوكب' : 'Inspect'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePack(pack.id)}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs cursor-pointer transition-all"
                        title={isRtl ? 'حذف الحزمة' : 'Delete Pack'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : isDownloading ? (
                    <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl">
                      <div className="w-12 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-400 h-full transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-purple-300 font-mono">{progress}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownloadPack(pack)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      {pack.isPremium && !currentUser.isPremium ? (
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{isRtl ? 'تحميل الحزمة' : 'Download Pack'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Panel for Inspecting Downloaded Planetary Data */}
      {activePack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease-out]">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 max-w-lg w-full flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activePack.icon}</span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isRtl ? activePack.nameAr : activePack.nameEn}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    {isRtl ? 'بيانات الأوفلاين المعالجة محلياً' : 'Offline Verified Dataset'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePack(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Offline Planet Canvas / Image Preview */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 group">
              <img
                src={activePack.cachedImages[0]}
                alt={activePack.nameEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
                <span>{activePack.planetData.diameter}</span>
                <span>{activePack.planetData.temp}</span>
              </div>
            </div>

            {/* Planetary Statistics */}
            <div className="grid grid-cols-2 gap-3 text-start">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 block">{isRtl ? 'الكتلة' : 'Mass'}</span>
                <span className="text-xs font-bold text-slate-200">{activePack.planetData.mass}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 block">{isRtl ? 'الأقمار التابعة' : 'Moons'}</span>
                <span className="text-xs font-bold text-slate-200">{activePack.planetData.moons}</span>
              </div>
            </div>

            <div className="text-start flex flex-col gap-2">
              <h4 className="text-xs font-bold text-cyan-300">
                {isRtl ? 'الملخص العلمي:' : 'Scientific Summary:'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl ? activePack.planetData.summaryAr : activePack.planetData.summaryEn}
              </p>
            </div>

            <div className="text-start flex flex-col gap-2">
              <h4 className="text-xs font-bold text-purple-300">
                {isRtl ? 'أبرز الحقائق الفلكية:' : 'Key Astronomical Facts:'}
              </h4>
              <ul className="flex flex-col gap-1.5">
                {activePack.planetData.keyFacts.map((fact, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 text-sm">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
