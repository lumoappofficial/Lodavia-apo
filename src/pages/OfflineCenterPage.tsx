import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { offlineDB, OfflineSavedItem } from '../offline/db';
import { downloadManager } from '../offline/downloadManager';
import { syncEngine, NetworkState } from '../offline/syncEngine';
import OfflineGames from '../components/offline/OfflineGames';
import OfflineSpaceExplorer from '../components/offline/OfflineSpaceExplorer';
import PendingSyncQueue from '../components/offline/PendingSyncQueue';
import StorageManager from '../components/offline/StorageManager';
import OfflinePlusUpgrade from '../components/offline/OfflinePlusUpgrade';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Gamepad2, 
  Globe, 
  RefreshCw, 
  HardDrive, 
  Crown, 
  BookOpen, 
  Trash2, 
  Check, 
  ChevronLeft,
  FileText,
  FileAudio,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function OfflineCenterPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'downloads' | 'games' | 'space' | 'queue' | 'storage' | 'plus'>('downloads');
  const [networkState, setNetworkState] = useState<NetworkState>(syncEngine.getState());
  const [pendingCount, setPendingCount] = useState(0);

  const [downloads, setDownloads] = useState<OfflineSavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDownloads = async () => {
    const items = await offlineDB.getSavedItems();
    setDownloads(items);
  };

  useEffect(() => {
    loadDownloads();
    const unsub = syncEngine.subscribe((state, pCount) => {
      setNetworkState(state);
      setPendingCount(pCount);
    });
    return unsub;
  }, []);

  const handleDeleteSavedItem = async (id: string) => {
    playSynthSound(500, 'sine', 0.08);
    await downloadManager.deleteDownload(id);
    await loadDownloads();
    setToastMessage(isRtl ? 'تم حذف العنصر من التنزيلات 🗑️' : 'Item deleted from downloads 🗑️');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredDownloads = downloads.filter(item => {
    const title = (item.titleAr || item.title || '').toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto w-full pb-20 px-3 sm:px-6 lg:px-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <WifiOff className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent">
                {isRtl ? 'مركز LODAVIA للأوفلاين 📡' : 'LODAVIA Offline Center 📡'}
              </h1>
              {networkState === 'OFFLINE' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                  OFFLINE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  ONLINE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl 
                ? 'إدارة التنزيلات، ألعاب الأوفلاين، حزم الفضاء، وقائمة المزامنة التلقائية' 
                : 'Offline downloads, interactive space explorer, local games & background sync queue'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            navigate('/settings');
          }}
          className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs cursor-pointer select-none"
        >
          {!isRtl && <ChevronLeft className="w-4 h-4" />}
          <span>{isRtl ? 'الإعدادات ⚙️' : 'Settings ⚙️'}</span>
          {isRtl && <ChevronLeft className="w-4 h-4 rotate-180" />}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('downloads');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'downloads'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isRtl ? 'تنزيلاتي 📥' : 'My Downloads 📥'}</span>
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('games');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'games'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{isRtl ? 'ألعاب الأوفلاين 🎮' : 'Offline Games 🎮'}</span>
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('space');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'space'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isRtl ? 'مستكشف الفضاء 🌌' : 'Space Explorer 🌌'}</span>
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('queue');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'queue'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isRtl ? 'المزامنة المعلقة 📝' : 'Sync Queue 📝'}</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[10px] font-mono">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('storage');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'storage'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>{isRtl ? 'إدارة التخزين 💾' : 'Storage 💾'}</span>
        </button>

        <button
          onClick={() => {
            playSynthSound(450, 'sine', 0.08);
            setActiveTab('plus');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'plus'
              ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/5 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>{isRtl ? 'Offline+ المميز ⭐' : 'Offline+ ⭐'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render Active View */}
      {activeTab === 'downloads' && (
        <div className="flex flex-col gap-5 text-start">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'البحث في التنزيلات المحفوظة...' : 'Search downloaded files...'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>

          {filteredDownloads.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredDownloads.map(item => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 transition-all hover:border-white/20"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 text-start">
                      <h3 className="text-xs font-bold text-slate-100 truncate">
                        {isRtl ? (item.titleAr || item.title) : (item.titleEn || item.title)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>{item.sizeFormatted}</span>
                        <span>•</span>
                        <span className="text-emerald-400">✓ Available Offline</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSavedItem(item.id)}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 cursor-pointer transition-all shrink-0"
                    title={isRtl ? 'حذف من الجهاز' : 'Delete file'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-3">
              <Download className="w-10 h-10 text-slate-500 mb-1" />
              <h3 className="text-sm font-bold text-slate-300">
                {isRtl ? 'لا توجد تنزيلات في هذه الفئة' : 'No Downloaded Items'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                {isRtl 
                  ? 'يمكنك حفظ المنشورات والدورات وحزم الفضاء للاستفادة منها بدون إنترنت.'
                  : 'Save posts, educational courses, and space datasets to access them completely offline.'}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'games' && <OfflineGames />}
      {activeTab === 'space' && <OfflineSpaceExplorer />}
      {activeTab === 'queue' && <PendingSyncQueue />}
      {activeTab === 'storage' && <StorageManager onNavigateToDownloads={() => setActiveTab('downloads')} />}
      {activeTab === 'plus' && <OfflinePlusUpgrade />}
    </div>
  );
}
