import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  Clock, 
  Sliders, 
  ListMusic, 
  FileText, 
  Download, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Bookmark, 
  Radio, 
  Headphones, 
  CheckCircle2, 
  RotateCcw,
  RotateCw,
  Gauge, 
  Music2 
} from 'lucide-react';

export default function FullAudioPlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    isRepeat,
    isShuffle,
    queue,
    sleepTimerMinutes,
    sleepTimerRemaining,
    likedTrackIds,
    downloadedTrackIds,
    isFullPlayerOpen,
    audioQuality,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    skipSeconds,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    toggleRepeat,
    toggleShuffle,
    setSleepTimerMinutes,
    toggleLikeTrack,
    toggleDownloadTrack,
    setIsFullPlayerOpen,
    setAudioQuality,
    setIsAmbientMixerOpen,
    playTrack
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue' | 'chapters'>('player');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  if (!isFullPlayerOpen || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const isDownloaded = downloadedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleShare = () => {
    playSynthSound(600, 'sine', 0.05);
    if (navigator.share) {
      navigator.share({
        title: currentTrack.title,
        text: `Listen to "${currentTrack.title}" on Lodavia Audio Ecosystem`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-2xl animate-[fadeIn_0.3s_ease-out] overflow-y-auto">
      
      {/* Dynamic Animated Color Gradient Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#48B8FF] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-[pulse_4s_infinite_1s]" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-[#121826]/95 border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 md:p-5 border-b border-[#E6EAF0] dark:border-[#2A3447] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#48B8FF]/10 text-[#48B8FF]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? 'مشغل لودافيا الصوتي الفاخر 🎧' : 'Lodavia Audio Premium Player 🎧'}
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentTrack.copyrightType}</span>
                </span>
              </div>
              <p className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">
                {lang === 'ar' ? 'محتوى مرخص رسمياً وبيئة صوتية عالية النقاء' : 'Officially licensed content & ultra fidelity acoustics'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#182232] p-1 rounded-2xl border border-[#E6EAF0] dark:border-[#2A3447]">
            <button
              onClick={() => { playSynthSound(500, 'sine', 0.05); setActiveTab('player'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'player' ? 'bg-[#48B8FF] text-white shadow-xs' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
              }`}
            >
              {lang === 'ar' ? 'المشغل' : 'Player'}
            </button>
            
            {currentTrack.lyrics && (
              <button
                onClick={() => { playSynthSound(500, 'sine', 0.05); setActiveTab('lyrics'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'lyrics' ? 'bg-[#48B8FF] text-white shadow-xs' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الكلمات' : 'Lyrics'}</span>
              </button>
            )}

            {(currentTrack.audiobookChapters || currentTrack.podcastEpisodes) && (
              <button
                onClick={() => { playSynthSound(500, 'sine', 0.05); setActiveTab('chapters'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'chapters' ? 'bg-[#48B8FF] text-white shadow-xs' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الفصول / الحلقات' : 'Chapters'}</span>
              </button>
            )}

            <button
              onClick={() => { playSynthSound(500, 'sine', 0.05); setActiveTab('queue'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'queue' ? 'bg-[#48B8FF] text-white shadow-xs' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'قائمة الانتظار' : 'Queue'} ({queue.length})</span>
            </button>
          </div>

          <button
            onClick={() => { playSynthSound(300, 'sine', 0.05); setIsFullPlayerOpen(false); }}
            className="p-2 rounded-full hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'player' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Album Art Section */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group">
                  <img 
                    src={currentTrack.coverUrl} 
                    alt={currentTrack.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Dynamic Equalizer visualizer overlay when playing */}
                  {isPlaying && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center gap-1">
                      {[...Array(16)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 bg-[#48B8FF] rounded-full animate-pulse"
                          style={{
                            height: `${Math.floor(Math.random() * 32) + 8}px`,
                            animationDuration: `${(i % 5) * 0.2 + 0.4}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Controls Section */}
              <div className="flex flex-col gap-5 text-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-[#48B8FF] bg-[#48B8FF]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {lang === 'ar' ? currentTrack.categoryLabelAr : currentTrack.categoryLabelEn}
                    </span>
                    {currentTrack.album && (
                      <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] font-bold">
                        • {currentTrack.album}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#1A1F2C] dark:text-[#F8FAFC] leading-snug">
                    {lang === 'ar' ? currentTrack.titleAr || currentTrack.title : currentTrack.title}
                  </h2>
                  <p className="text-sm font-bold text-[#6E7685] dark:text-[#94A3B8] mt-1">
                    {lang === 'ar' ? currentTrack.artistAr || currentTrack.artist : currentTrack.artist}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newPercent = clickX / rect.width;
                      seekTo(newPercent * duration);
                    }}
                    className="relative w-full h-3 bg-[#E6EAF0] dark:bg-[#202B3D] rounded-full overflow-hidden cursor-pointer group"
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-[#48B8FF] to-cyan-400 rounded-full transition-all duration-150 relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-mono font-bold text-[#6E7685] dark:text-[#94A3B8]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Center Control Panel */}
                <div className="flex items-center justify-between gap-2 my-2">
                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); toggleShuffle(); }}
                    className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                      isShuffle ? 'bg-[#48B8FF]/20 text-[#48B8FF]' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
                    }`}
                    title={lang === 'ar' ? 'تشغيل عشوائي' : 'Shuffle'}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); skipSeconds(-15); }}
                    className="p-2.5 rounded-2xl hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] hover:text-[#48B8FF] transition-all cursor-pointer flex flex-col items-center"
                    title={lang === 'ar' ? 'تراجع 15 ثانية' : 'Skip 15s back'}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">15s</span>
                  </button>

                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); prevTrack(); }}
                    className="p-2.5 rounded-2xl hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC] transition-all cursor-pointer active:scale-95"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => {
                      playSynthSound(isPlaying ? 300 : 800, 'sine', 0.05);
                      togglePlayPause();
                    }}
                    className="p-4 sm:p-5 rounded-full bg-gradient-to-tr from-[#48B8FF] to-purple-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
                  </button>

                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); nextTrack(); }}
                    className="p-2.5 rounded-2xl hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC] transition-all cursor-pointer active:scale-95"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); skipSeconds(15); }}
                    className="p-2.5 rounded-2xl hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] hover:text-[#48B8FF] transition-all cursor-pointer flex flex-col items-center"
                    title={lang === 'ar' ? 'تقدم 15 ثانية' : 'Skip 15s forward'}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">15s</span>
                  </button>

                  <button
                    onClick={() => { playSynthSound(500, 'sine', 0.05); toggleRepeat(); }}
                    className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                      isRepeat ? 'bg-[#48B8FF]/20 text-[#48B8FF]' : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C]'
                    }`}
                    title={lang === 'ar' ? 'تكرار' : 'Repeat'}
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>

                {/* Secondary Feature Bar (Volume, Speed, Sleep Timer, Favorites, Share, Quality) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-[#E6EAF0] dark:border-[#2A3447]">
                  
                  {/* Speed Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] flex items-center justify-center gap-1.5 hover:border-[#48B8FF] transition-all cursor-pointer"
                    >
                      <Gauge className="w-3.5 h-3.5 text-[#48B8FF]" />
                      <span>{playbackSpeed}x</span>
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute bottom-12 left-0 right-0 bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-xl shadow-xl p-1 z-50 animate-[fadeIn_0.15s_ease-out]">
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setPlaybackSpeed(s);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full text-start px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              playbackSpeed === s ? 'bg-[#48B8FF] text-white' : 'hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC]'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sleep Timer */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSleepMenu(!showSleepMenu)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        sleepTimerMinutes 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                          : 'bg-[#FAF8F5] dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{sleepTimerMinutes ? `${sleepTimerMinutes}m` : (lang === 'ar' ? 'مؤقت النوم' : 'Sleep Timer')}</span>
                    </button>
                    {showSleepMenu && (
                      <div className="absolute bottom-12 left-0 right-0 bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-xl shadow-xl p-1 z-50 animate-[fadeIn_0.15s_ease-out]">
                        {[
                          { label: lang === 'ar' ? 'إيقاف' : 'Off', val: null },
                          { label: '15 Min', val: 15 },
                          { label: '30 Min', val: 30 },
                          { label: '45 Min', val: 45 },
                          { label: '60 Min', val: 60 }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSleepTimerMinutes(item.val);
                              setShowSleepMenu(false);
                            }}
                            className={`w-full text-start px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              sleepTimerMinutes === item.val ? 'bg-amber-500 text-white' : 'hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audio Quality */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] flex items-center justify-center gap-1.5 hover:border-[#48B8FF] transition-all cursor-pointer uppercase"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{audioQuality}</span>
                    </button>
                    {showQualityMenu && (
                      <div className="absolute bottom-12 left-0 right-0 bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-xl shadow-xl p-1 z-50 animate-[fadeIn_0.15s_ease-out]">
                        {[
                          { id: 'standard', label: 'Standard (128 kbps)' },
                          { id: 'high', label: 'High (320 kbps)' },
                          { id: 'lossless', label: 'Lossless HD (24-bit)' }
                        ].map((q) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setAudioQuality(q.id as any);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-start px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              audioQuality === q.id ? 'bg-purple-600 text-white' : 'hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC]'
                            }`}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Download Toggle */}
                  <button
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.05);
                      toggleDownloadTrack(currentTrack.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDownloaded 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-[#FAF8F5] dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF]'
                    }`}
                  >
                    {isDownloaded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5 text-[#48B8FF]" />}
                    <span>{isDownloaded ? (lang === 'ar' ? 'محمّل ⬇️' : 'Downloaded') : (lang === 'ar' ? 'تحميل' : 'Download')}</span>
                  </button>
                </div>

                {/* Favorite & Share buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.05);
                      toggleLikeTrack(currentTrack.id);
                    }}
                    className={`flex-1 p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isLiked 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                        : 'bg-[#FAF8F5] dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{isLiked ? (lang === 'ar' ? 'في المفضلة ❤️' : 'In Favorites ❤️') : (lang === 'ar' ? 'إضافة للمفضلة' : 'Favorite')}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF] flex items-center justify-center gap-2 transition-all cursor-pointer relative"
                  >
                    <Share2 className="w-4 h-4 text-[#48B8FF]" />
                    <span>{lang === 'ar' ? 'مشاركة الصوت' : 'Share Audio'}</span>
                    {showShareToast && (
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2.5 py-1 rounded-md animate-[fadeIn_0.2s_ease-out]">
                        {lang === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!'}
                      </span>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Lyrics Tab */}
          {activeTab === 'lyrics' && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center max-w-xl mx-auto py-6">
              <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC] mb-6">
                {lang === 'ar' ? 'كلمات الأغنية / النص 📜' : 'Song Lyrics & Transcript 📜'}
              </h3>
              <div className="flex flex-col gap-4 w-full">
                {currentTrack.lyrics?.map((line, idx) => {
                  const isCurrentLine = currentTime >= line.time && (idx === currentTrack.lyrics!.length - 1 || currentTime < currentTrack.lyrics![idx + 1].time);
                  return (
                    <div 
                      key={idx}
                      onClick={() => seekTo(line.time)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer ${
                        isCurrentLine 
                          ? 'bg-[#48B8FF]/20 text-[#48B8FF] text-base font-black scale-105 border border-[#48B8FF]/40 shadow-md' 
                          : 'text-[#6E7685] dark:text-[#94A3B8] text-sm font-bold hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      <p>{lang === 'ar' && line.textAr ? line.textAr : line.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'قائمة التشغيل القادمة' : 'Up Next in Queue'}
              </h3>
              <div className="flex flex-col gap-2">
                {queue.map((item) => {
                  const isCurrent = item.id === currentTrack.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => playTrack(item)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#48B8FF]/10 border-[#48B8FF]/40 text-[#48B8FF]' 
                          : 'bg-[#FAF8F5] dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.coverUrl} alt={item.title} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="text-start">
                          <h4 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                            {lang === 'ar' ? item.titleAr || item.title : item.title}
                          </h4>
                          <p className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">
                            {lang === 'ar' ? item.artistAr || item.artist : item.artist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrent && <span className="text-[10px] font-bold text-[#48B8FF] animate-pulse">Now Playing</span>}
                        <span className="text-xs font-mono font-bold text-[#6E7685] dark:text-[#94A3B8]">{formatTime(item.duration)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chapters / Episodes Tab */}
          {activeTab === 'chapters' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'فصول الكتاب / حلقات البودكاست' : 'Chapters & Episodes'}
              </h3>
              
              {currentTrack.audiobookChapters && (
                <div className="flex flex-col gap-2">
                  {currentTrack.audiobookChapters.map((chap, idx) => (
                    <div 
                      key={chap.id}
                      onClick={() => seekTo(chap.duration)}
                      className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF] flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#48B8FF]/10 text-[#48B8FF] font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC]">{chap.title}</span>
                      </div>
                      <span className="text-xs font-mono text-[#6E7685] dark:text-[#94A3B8]">{formatTime(chap.duration)}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentTrack.podcastEpisodes && (
                <div className="flex flex-col gap-2">
                  {currentTrack.podcastEpisodes.map((ep) => (
                    <div 
                      key={ep.id}
                      onClick={() => playTrack({ ...currentTrack, title: ep.title, duration: ep.duration, audioUrl: ep.audioUrl })}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF] flex flex-col gap-1 cursor-pointer transition-all text-start"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">{ep.title}</span>
                        <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] font-mono">{formatTime(ep.duration)}</span>
                      </div>
                      <p className="text-[11px] text-[#6E7685] dark:text-[#94A3B8] line-clamp-2">{ep.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
