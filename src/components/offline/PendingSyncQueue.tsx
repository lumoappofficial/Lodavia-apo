import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { syncEngine, NetworkState } from '../../offline/syncEngine';
import { offlineDB, SyncOperation } from '../../offline/db';
import { 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Trash2, 
  Wifi, 
  WifiOff, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function PendingSyncQueue() {
  const { lang, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const [queue, setQueue] = useState<SyncOperation[]>([]);
  const [networkState, setNetworkState] = useState<NetworkState>(syncEngine.getState());
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadQueue = async () => {
    const items = await offlineDB.getSyncQueue();
    setQueue(items.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadQueue();
    const unsub = syncEngine.subscribe((state) => {
      setNetworkState(state);
      setIsSyncing(state === 'SYNCING');
      loadQueue();
    });
    return unsub;
  }, []);

  const handleManualSync = async () => {
    playSynthSound(600, 'sine', 0.1);
    if (!navigator.onLine) {
      setToastMessage(isRtl ? 'لا يوجد اتصال بالإنترنت لبدء المزامنة' : 'No internet connection available for sync');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    await syncEngine.manualSync();
    await loadQueue();
  };

  const handleClearOperation = async (id: string) => {
    playSynthSound(500, 'sine', 0.08);
    await offlineDB.removeSyncOperation(id);
    await loadQueue();
  };

  return (
    <div className="flex flex-col gap-6 text-start">
      {/* Top Header Card */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">
              {isRtl ? 'قائمة المزامنة المعلقة 📝' : 'Pending Sync Queue 📝'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'العمليات والتفاعلات المنفذة أثناء قطع الاتصال مع معرفات عملية فريدة آمِنة' 
                : 'Offline user actions queued with idempotent unique Operation IDs'}
            </p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isRtl ? 'مزامنة الآن' : 'Sync Now'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Queue Items */}
      {queue.length > 0 ? (
        <div className="flex flex-col gap-3">
          {queue.map(op => {
            const dateStr = new Date(op.createdAt).toLocaleTimeString();
            let statusBadge = (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>PENDING</span>
              </span>
            );

            if (op.status === 'SYNCING') {
              statusBadge = (
                <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>SYNCING</span>
                </span>
              );
            } else if (op.status === 'SUCCESS') {
              statusBadge = (
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SUCCESS</span>
                </span>
              );
            } else if (op.status === 'FAILED') {
              statusBadge = (
                <span className="px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>FAILED (Retry {op.retryCount})</span>
                </span>
              );
            }

            return (
              <div
                key={op.id}
                className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 transition-all hover:border-white/20"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      {op.type.replace('_', ' ')}
                    </span>
                    {statusBadge}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>ID: {op.opId}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>

                  {op.localResult?.messageAr && (
                    <span className="text-xs text-cyan-300 mt-0.5">
                      {isRtl ? op.localResult.messageAr : op.localResult.messageEn}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleClearOperation(op.id)}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 cursor-pointer transition-all shrink-0"
                  title={isRtl ? 'حذف من القائمة' : 'Remove item'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-3">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mb-1" />
          <h3 className="text-sm font-bold text-slate-200">
            {isRtl ? 'جميع البيانات مُزامنة بالكامل 👍' : 'All Data Fully Synced 👍'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs">
            {isRtl 
              ? 'لا توجد أي عمليات أوفلاين معلقة. سيتم تسجيل أي منشور أو تفاعل هنا تلقائياً عند قطع الاتصال.'
              : 'No pending offline queue operations. Any post or interaction created offline will queue here.'}
          </p>
        </div>
      )}
    </div>
  );
}
