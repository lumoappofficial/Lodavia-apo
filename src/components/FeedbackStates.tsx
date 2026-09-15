import React from 'react';
import { motion } from 'motion/react';
import { 
  WifiOff, 
  Compass, 
  RotateCw, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle,
  Home
} from 'lucide-react';
import { playSynthSound } from '../utils/synth';

// ==========================================
// 1. Premium Loading State (Orbital Nebula)
// ==========================================
export function LoadingState({ message = 'Loading quantum state...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] text-center relative overflow-hidden">
      <div className="relative w-24 h-24 mb-6">
        {/* Orbital rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/40"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 rounded-full border border-cyan-400/30"
        />
        {/* Main glowing particle */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-6 bg-gradient-to-tr from-sky-500 to-cyan-400 rounded-full blur-sm shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>
      </div>
      <p className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 uppercase">
        {message}
      </p>
    </div>
  );
}

// ==========================================
// 2. Premium Empty State (Constellation)
// ==========================================
export function EmptyState({ 
  title = 'No Cosmic Signals', 
  description = 'This orbit is currently quiet. Check back later or start a new broadcast!',
  actionText,
  onAction
}: { 
  title?: string; 
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center text-center max-w-md mx-auto my-6 gap-4 shadow-sm"
    >
      <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-sky-400/10 rounded-full blur-lg" />
        <Compass className="w-8 h-8 text-sky-500 animate-pulse" />
      </div>
      
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={() => {
            playSynthSound(600, 'sine', 0.08);
            onAction();
          }}
          className="mt-2 text-xs font-black uppercase bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-2.5 px-6 rounded-full shadow-md shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}

// ==========================================
// 3. Premium Error State (Solar Flare Warning)
// ==========================================
export function ErrorState({ 
  message = 'A quantum anomaly occurred in the feed alignment.',
  onRetry
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-950/10 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-6 gap-3 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
      
      <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">Quantum Anomaly</h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={() => {
            playSynthSound(800, 'sine', 0.1);
            onRetry();
          }}
          className="mt-2 text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 px-4 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCw className="w-3 h-3" />
          <span>Realight Orbit</span>
        </button>
      )}
    </motion.div>
  );
}

// ==========================================
// 4. Premium Offline banner (Astronaut Gravity)
// ==========================================
export function OfflineBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-xs glass-panel px-4 py-2.5 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 flex items-center gap-3 shadow-2xl"
    >
      <div className="w-8 h-8 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
      <div>
        <h5 className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">Orbit Disconnected</h5>
        <p className="text-[9px] text-slate-300">Using deep-space cache offline</p>
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. Immersive 404 Cosmic Void Page
// ==========================================
export function Cosmic404Page() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative min-h-screen z-10 w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#0b0714] to-[#07070a] -z-10" />
      
      {/* Absolute background nebula */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md flex flex-col items-center gap-6">
        <div className="relative">
          <motion.h1 
            animate={{ 
              textShadow: [
                '0 0 10px rgba(168,85,247,0.4)', 
                '0 0 25px rgba(6,182,212,0.6)', 
                '0 0 10px rgba(168,85,247,0.4)'
              ],
              y: [0, -6, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 tracking-tighter"
          >
            404
          </motion.h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0d0d15] border border-cyan-400/30 text-cyan-400 text-[9px] font-mono uppercase px-3 py-1 rounded-full font-black tracking-widest whitespace-nowrap">
            Gravity Field Collapsed
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Lost in Deep Space</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The orbit coordinate you are trying to intercept has drifted into a supermassive black hole. Retract safely back to stellar base coordinates.
          </p>
        </div>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/home"
          onClick={() => playSynthSound(880, 'sine', 0.15)}
          className="flex items-center gap-2 text-xs font-black uppercase bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white py-3 px-8 rounded-full shadow-2xl cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Stellar Base</span>
        </motion.a>
      </div>
    </div>
  );
}

// ==========================================
// 6. Supernova Server Error Screen (500)
// ==========================================
export function Supernova500Page() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative min-h-screen z-10 w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505] via-[#0d0d15] to-[#0a0505] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center"
          >
            <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
          </motion.div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0a0505] border border-red-500/30 text-red-500 text-[9px] font-mono uppercase px-3 py-1 rounded-full font-black tracking-widest whitespace-nowrap">
            Supernova Server Deficit
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Supernova Collapse (500)</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The core fusion reactor powering our data transmission has collapsed into a supernova. Lodavia operators are deploying fusion shields immediately.
          </p>
        </div>

        <button
          onClick={() => {
            playSynthSound(500, 'sawtooth', 0.2);
            window.location.reload();
          }}
          className="flex items-center gap-2 text-xs font-black uppercase bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white py-3 px-8 rounded-full shadow-2xl cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Reboot Fusion Core</span>
        </button>
      </div>
    </div>
  );
}
