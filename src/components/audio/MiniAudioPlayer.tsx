import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Play, 
  Pause, 
  X,
  Music,
  Maximize2
} from 'lucide-react';

export default function MiniAudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    setIsFullPlayerOpen,
    stopAudio
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-20 ltr:right-4 rtl:left-4 md:bottom-8 ltr:md:right-8 rtl:md:left-8 z-50 select-none">
      <AnimatePresence>
        <motion.div
          key="floating-audio-disc"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="relative group"
        >
          {/* Floating Glass Tooltip Banner (Appears on Hover) */}
          <div className="absolute bottom-full mb-3 ltr:right-0 rtl:left-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
            <div className="bg-[#121B2B]/95 text-white text-xs px-3.5 py-2 rounded-2xl border border-cyan-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.35)] backdrop-blur-xl flex items-center gap-2.5 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-[#48B8FF] animate-ping" />
              <div className="flex flex-col text-start">
                <span className="font-extrabold text-white text-xs truncate max-w-[160px]">
                  {lang === 'ar' ? currentTrack.titleAr || currentTrack.title : currentTrack.title}
                </span>
                <span className="text-[10px] text-cyan-300/80 truncate max-w-[140px]">
                  {lang === 'ar' ? currentTrack.artistAr || currentTrack.artist : currentTrack.artist}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#48B8FF] bg-[#48B8FF]/15 px-2 py-0.5 rounded-full border border-[#48B8FF]/30 ltr:ml-1 rtl:mr-1">
                {lang === 'ar' ? 'انقر للفتح ↗' : 'Click to Open ↗'}
              </span>
            </div>
          </div>

          {/* Glowing Aura Ring when playing */}
          {isPlaying && (
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 via-[#48B8FF] to-cyan-400 opacity-75 blur-lg animate-pulse" />
          )}

          {/* Main Small Floating Disc Button (الزر العائم الصغير) */}
          <div
            onClick={() => {
              playSynthSound(650, 'sine', 0.05);
              setIsFullPlayerOpen(true);
            }}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#121B2B] border-2 border-[#48B8FF] shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl cursor-pointer group hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden"
            title={lang === 'ar' ? 'فتح مشغل الصوتيات' : 'Open Audio Player'}
          >
            {/* Spinning Vinyl Album Cover */}
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
            />

            {/* Vinyl Center Hole Decor */}
            <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-slate-950/90 border border-white/40 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#48B8FF]" />
            </div>

            {/* Animated Equalizer Wave Overlay when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center gap-0.5">
                <div className="w-0.5 bg-[#48B8FF] rounded-full animate-[bounce_0.8s_infinite_100ms] h-3.5" />
                <div className="w-0.5 bg-purple-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-4.5" />
                <div className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_0.8s_infinite_200ms] h-3" />
              </div>
            )}

            {/* Hover Icon Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
            </div>

            {/* Quick Play/Pause Badge Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSynthSound(isPlaying ? 300 : 800, 'sine', 0.05);
                togglePlayPause();
              }}
              className="absolute bottom-0 ltr:right-0 rtl:left-0 w-6 h-6 rounded-full bg-[#48B8FF] hover:bg-[#38A8EF] text-white flex items-center justify-center shadow-md border-2 border-slate-900 active:scale-90 transition-all cursor-pointer z-10"
              title={isPlaying ? (lang === 'ar' ? 'إيقاف' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Play')}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white translate-x-0.5" />}
            </button>

            {/* Quick Stop/Close Button (Appears on Hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSynthSound(300, 'sine', 0.05);
                stopAudio();
              }}
              className="absolute top-0 ltr:left-0 rtl:right-0 w-5 h-5 rounded-full bg-slate-900/95 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
              title={lang === 'ar' ? 'إغلاق وإيقاف المشغل' : 'Close Player'}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
