import React, { useState, useEffect } from 'react';
import { syncEngine, NetworkState } from '../../offline/syncEngine';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OfflineIndicator() {
  const { lang } = useApp();
  const isRtl = lang === 'ar';

  const [state, setState] = useState<NetworkState>(syncEngine.getState());
  const [pendingCount, setPendingCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = syncEngine.subscribe((netState, pCount, msg) => {
      setState(netState);
      setPendingCount(pCount);
      if (msg) {
        setToastMsg(msg);
      }
    });
    return unsub;
  }, []);

  if (state === 'ONLINE' && !toastMsg) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out] pointer-events-none">
      <div className="glass-panel px-4 py-2 rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-md shadow-2xl flex items-center gap-2.5 text-xs font-bold text-white">
        {state === 'OFFLINE' && (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-200">
              {isRtl ? 'وضع الأوفلاين 📡' : 'Offline Mode 📡'}
            </span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                ({pendingCount})
              </span>
            )}
          </>
        )}

        {state === 'SYNCING' && (
          <>
            <RefreshCw className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
            <span className="text-purple-200">
              {toastMsg || (isRtl ? 'جاري مزامنة البيانات...' : 'Syncing LODAVIA data...')}
            </span>
          </>
        )}

        {state === 'ONLINE' && toastMsg && (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-200">{toastMsg}</span>
          </>
        )}
      </div>
    </div>
  );
}
