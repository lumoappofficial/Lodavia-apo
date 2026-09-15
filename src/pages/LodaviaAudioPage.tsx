import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useApp } from '../contexts/AppContext';
import { 
  AUDIO_ITEMS, 
  AUDIO_PLAYLISTS, 
  AUDIO_CREATORS, 
  AI_MODE_RECOMMENDATIONS 
} from '../data/audioData';
import { AudioCategory, AudioItem } from '../types/audio';
import { 
  Music, 
  Mic, 
  BookOpen, 
  CloudRain, 
  Radio, 
  Headphones, 
  Moon, 
  Sparkles, 
  Waves, 
  Gamepad2, 
  Briefcase, 
  Play, 
  Pause, 
  Heart, 
  Plus, 
  Share2, 
  Download, 
  ShieldCheck, 
  Clock, 
  Flame, 
  TrendingUp, 
  Sliders, 
  Search, 
  CheckCircle2, 
  UserCheck, 
  Compass, 
  X, 
  Upload, 
  FolderPlus, 
  Award, 
  Sun, 
  Zap, 
  Brain, 
  Bookmark, 
  Check,
  Disc,
  Layers,
  RotateCcw,
  Volume2,
  HardDrive
} from 'lucide-react';
import { themeStyles } from '../styles/theme';
import MyMusicSection from '../components/audio/MyMusicSection';
import PodcastsSection from '../components/audio/PodcastsSection';
import LodaviaStoriesSection from '../components/audio/LodaviaStoriesSection';

type AudioHubTab = 'overview' | 'my_music' | 'podcasts' | 'stories' | 'ambient' | 'playlists';

export default function LodaviaAudioPage() {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    likedTrackIds, 
    toggleLikeTrack,
    downloadedTrackIds,
    toggleDownloadTrack,
    setIsAmbientMixerOpen,
    createdPlaylists,
    createPlaylist,
    continueProgress,
    stories,
    userPodcasts,
    localTracks
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  // Active Main Hub Tab
  const [activeTab, setActiveTab] = useState<AudioHubTab>('overview');

  // Selected Category filter in Overview
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory | 'all'>('all');
  
  // Audio AI Recommendation Mode state
  const [activeAIMode, setActiveAIMode] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Filtered tracks
  const filteredTracks = AUDIO_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleAr.includes(searchQuery) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const mainTabs = [
    { id: 'overview', nameEn: 'Overview', nameAr: 'الرئيسية 🪐', icon: Compass },
    { id: 'my_music', nameEn: 'My Music & Files', nameAr: 'موسيقاي وملفاتي 🎵', icon: HardDrive, badge: localTracks.length > 0 ? localTracks.length : undefined },
    { id: 'podcasts', nameEn: 'Podcasts', nameAr: 'بودكاست الصناع 🎙', icon: Mic, badge: userPodcasts.length },
    { id: 'stories', nameEn: 'Lodavia Stories', nameAr: 'قصص لودافيا 📖', icon: BookOpen, badge: stories.length },
    { id: 'ambient', nameEn: 'Ambient Mixer', nameAr: 'الأصوات المحيطية 🌧', icon: CloudRain },
    { id: 'playlists', nameEn: 'Playlists', nameAr: 'قوائم التشغيل 📂', icon: Layers }
  ];

  const handleApplyAIMode = (modeKey: string) => {
    playSynthSound(700, 'sine', 0.1);
    setActiveAIMode(modeKey);
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      const rec = AI_MODE_RECOMMENDATIONS.find(m => m.modeKey === modeKey);
      if (rec && rec.suggestedTrackIds.length > 0) {
        const firstTrack = AUDIO_ITEMS.find(t => t.id === rec.suggestedTrackIds[0]);
        if (firstTrack) {
          playTrack(firstTrack);
        }
      }
    }, 600);
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    playSynthSound(880, 'sine', 0.1);
    createPlaylist(newPlaylistTitle, newPlaylistDesc);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setShowCreatePlaylistModal(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Find most recently played track with progress
  const progressEntries = Object.entries(continueProgress);
  const recentResumeItem = progressEntries.length > 0 
    ? AUDIO_ITEMS.find(item => item.id === progressEntries[progressEntries.length - 1][0])
    : null;
  const recentResumeProgress = recentResumeItem ? continueProgress[recentResumeItem.id] : null;

  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out] pb-28 text-start">
      
      {/* ---- HERO BRANDING & AUDIO HUB HEADER ---- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101726] via-[#18233C] to-[#0A0F1A] p-6 md:p-8 border border-[#2A3447] shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48B8FF]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#48B8FF]/20 text-[#48B8FF] border border-[#48B8FF]/30 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>LODAVIA AUDIO HUB</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'خصوصية كاملة + محتوى مرخص' : '100% Legal & Private'}</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {lang === 'ar' ? 'فضاء لودافيا الصوتي المتكامل 🎧' : 'LODAVIA AUDIO — Global Sound Hub'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              {lang === 'ar' 
                ? 'موسيقاك الخاصة من جهازك • بودكاست من صناع المحتوى • قصص لودافيا الأصلية الموثقة • أصوات الطبيعة والتركيز'
                : 'Your local music • Community creator podcasts • Original documented stories • Ambient focus soundscapes'}
            </p>
          </div>

          {/* Quick Hub Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                setIsAmbientMixerOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white font-black text-xs transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مولد الأصوات المحيطية 🌧️' : 'Ambient Sound Generator'}</span>
            </button>

            <button
              onClick={() => {
                playSynthSound(600, 'sine', 0.1);
                setActiveTab('my_music');
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'ملفات جهازي' : 'My Local Files'}</span>
            </button>
          </div>
        </div>

        {/* ---- AUDIO AI RECOMMENDATION BAR ---- */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#48B8FF] animate-spin" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {lang === 'ar' ? 'المساعد الصوتي الذكي (AUDIO AI):' : 'AUDIO AI SMART RECOMMENDATIONS:'}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {AI_MODE_RECOMMENDATIONS.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleApplyAIMode(mode.modeKey)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAIMode === mode.modeKey
                    ? 'bg-[#48B8FF] text-white border-[#48B8FF] scale-105 shadow-lg'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-200'
                }`}
              >
                <span>{lang === 'ar' ? mode.titleAr : mode.titleEn}</span>
              </button>
            ))}
          </div>

          {aiGenerating && (
            <div className="mt-3 text-xs text-[#48B8FF] font-bold flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'جارٍ اختيار المحتوى الصوتي الأنسب لمودك الحالي...' : 'Generative Audio AI tailoring your stream...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ---- MAIN PILLAR TABS SELECTOR ---- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E6EAF0] dark:border-[#2A3447]">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playSynthSound(500, 'sine', 0.04);
                setActiveTab(tab.id as AudioHubTab);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#48B8FF] text-white border-[#48B8FF] shadow-md scale-102'
                  : 'bg-[#FAF8F5] dark:bg-[#182232] border-[#E6EAF0] dark:border-[#2A3447] text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF]/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === 'ar' ? tab.nameAr : tab.nameEn}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#48B8FF]/15 text-[#48B8FF]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- TAB CONTENT ROUTING ---- */}

      {/* 1. MY MUSIC (Device Files) */}
      {activeTab === 'my_music' && (
        <MyMusicSection />
      )}

      {/* 2. PODCASTS (Creators) */}
      {activeTab === 'podcasts' && (
        <PodcastsSection />
      )}

      {/* 3. LODAVIA STORIES */}
      {activeTab === 'stories' && (
        <LodaviaStoriesSection />
      )}

      {/* 4. AMBIENT GENERATOR SHORTCUT TAB */}
      {activeTab === 'ambient' && (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#182232] to-cyan-950/30 border border-cyan-500/20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-inner">
              <CloudRain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'مولد الأصوات المحيطية والمؤثرات الطبيعية' : 'Ambient Soundscapes & Nature Generator'}
              </h3>
              <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-md mx-auto">
                {lang === 'ar' 
                  ? 'امزج بين أصوات المطر، أمواج البحر، حطب المدفأة، ومقهى الفضاء لإنشاء جو التركيز المثالي.' 
                  : 'Blend rain, cosmic waves, fireplace, and coffee shop sounds to build your personal focus atmosphere.'}
              </p>
            </div>
            <button
              onClick={() => {
                playSynthSound(700, 'sine', 0.05);
                setIsAmbientMixerOpen(true);
              }}
              className="px-6 py-3 rounded-2xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>{lang === 'ar' ? 'فتح الميكسر المتقدم 🎛️' : 'Open Multi-Channel Mixer'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AUDIO_ITEMS.filter(i => i.category === 'ambient' || i.category === 'nature' || i.category === 'sleep').map(track => (
              <div 
                key={track.id}
                onClick={() => {
                  playSynthSound(600, 'sine', 0.04);
                  playTrack(track);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-cyan-500/50 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                      {lang === 'ar' ? track.titleAr : track.title}
                    </h4>
                    <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">
                      {lang === 'ar' ? track.categoryLabelAr : track.categoryLabelEn}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#202B3D] group-hover:bg-[#48B8FF] group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PLAYLISTS TAB */}
      {activeTab === 'playlists' && (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'قوائم التشغيل الرسمية وقوائمك' : 'All Curated & Custom Playlists'}
              </h3>
            </div>
            <button
              onClick={() => setShowCreatePlaylistModal(true)}
              className="px-4 py-2 rounded-xl bg-[#48B8FF] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إنشاء قائمة' : 'New Playlist'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {createdPlaylists.map(pl => (
              <div 
                key={pl.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center gap-4">
                  <img src={pl.coverUrl} alt={pl.title} className="w-16 h-16 rounded-2xl object-cover border border-white/20 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC] truncate">
                      {lang === 'ar' ? pl.titleAr || pl.title : pl.title}
                    </h4>
                    <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-0.5 line-clamp-1">
                      {lang === 'ar' ? pl.descriptionAr || pl.description : pl.description}
                    </p>
                    <span className="text-[10px] font-bold text-[#48B8FF] mt-1 inline-block">
                      {pl.tracks.length} {lang === 'ar' ? 'مقاطع' : 'tracks'}
                    </span>
                  </div>
                </div>

                {pl.tracks.length > 0 && (
                  <button
                    onClick={() => {
                      playSynthSound(600, 'sine', 0.04);
                      playTrack(pl.tracks[0], pl.tracks);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#48B8FF]/10 hover:bg-[#48B8FF] text-[#48B8FF] hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'ar' ? 'تشغيل القائمة' : 'Play Playlist'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. OVERVIEW TAB (Default Discovery Feed) */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
          
          {/* Continue Listening Banner if available */}
          {recentResumeItem && recentResumeProgress && (
            <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#182232] to-[#121B2B] border border-purple-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img src={recentResumeItem.coverUrl} alt={recentResumeItem.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20" />
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-[#48B8FF] uppercase">
                    {lang === 'ar' ? 'تابع الاستماع من حيث توقفت' : 'Continue Listening'}
                  </span>
                  <h4 className="text-xs md:text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC] truncate">
                    {lang === 'ar' ? recentResumeItem.titleAr : recentResumeItem.title}
                  </h4>
                  <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">
                    {formatTime(recentResumeProgress.seconds)} / {formatTime(recentResumeProgress.duration)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  playSynthSound(600, 'sine', 0.04);
                  playTrack(recentResumeItem);
                }}
                className="px-4 py-2 rounded-xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{lang === 'ar' ? 'استئناف' : 'Resume'}</span>
              </button>
            </div>
          )}

          {/* Quick 3-Pillar Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              onClick={() => {
                playSynthSound(500, 'sine', 0.04);
                setActiveTab('my_music');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <HardDrive className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                  {lang === 'ar' ? 'خاص بجهازك' : 'Local Device'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? 'موسيقاي وملفاتي الصوتية' : 'My Local Music & Files'}
                </h3>
                <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
                  {lang === 'ar' ? 'استورد ملفاتك من جهازك وشغلها بدون خوادم وبأعلى جودة.' : 'Import and play your local audio files directly from your machine.'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">
                {lang === 'ar' ? 'فتح مشغل الملفات ↗' : 'Open Local Player ↗'}
              </span>
            </div>

            <div 
              onClick={() => {
                playSynthSound(500, 'sine', 0.04);
                setActiveTab('podcasts');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400">
                  {userPodcasts.length} {lang === 'ar' ? 'برامج' : 'Shows'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? 'بودكاست الصناع والمجتمع' : 'Creator Podcasts'}
                </h3>
                <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
                  {lang === 'ar' ? 'حوارات معمقة في الفيزياء، الفضاء، والتفكير، مع إمكانية نشر برنامجك.' : 'Deep dialogues in science, physics, and human potential.'}
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 mt-3 flex items-center gap-1">
                {lang === 'ar' ? 'استكشف البودكاست ↗' : 'Explore Podcasts ↗'}
              </span>
            </div>

            <div 
              onClick={() => {
                playSynthSound(500, 'sine', 0.04);
                setActiveTab('stories');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-cyan-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-[#48B8FF] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-cyan-500/10 text-[#48B8FF]">
                  {lang === 'ar' ? 'حقائق موثقة' : 'Verified Facts'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? 'قصص لودافيا الأصلية' : 'Lodavia Original Stories'}
                </h3>
                <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
                  {lang === 'ar' ? 'سرد صوتي سينمائي حقيقي بأصوات ريّ، لايكا، وألبرت مع مراجع تاريخية.' : 'Cinematic audio journeys narrated by Ray, Laika, and Albert.'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#48B8FF] mt-3 flex items-center gap-1">
                {lang === 'ar' ? 'الاستماع للقصص ↗' : 'Listen to Stories ↗'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6E7685] dark:text-[#94A3B8] absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث في مكتبة الصوتيات والموسيقى والقصص...' : 'Search all audio tracks, podcasts, and stories...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ps-10 pe-4 py-3 text-xs ${themeStyles.glassInput}`}
            />
          </div>

          {/* Main Audio Tracks Catalog Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'المكتبة الصوتية الموصى بها' : 'Featured Audio Collection'}
              </h3>
              <span className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                {filteredTracks.length} {lang === 'ar' ? 'تسجيلات' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTracks.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                const isCurrentPlaying = isCurrent && isPlaying;
                const isLiked = likedTrackIds.includes(track.id);

                return (
                  <div
                    key={track.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isCurrent 
                        ? 'border-[#48B8FF] bg-[#48B8FF]/10 shadow-sm' 
                        : 'border-[#E6EAF0] dark:border-[#2A3447] bg-white dark:bg-[#182232] hover:border-[#48B8FF]/40 hover:shadow-md'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 mb-3">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      <button
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.04);
                          if (isCurrent) {
                            togglePlayPause();
                          } else {
                            playTrack(track);
                          }
                        }}
                        className={`absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isCurrentPlaying 
                            ? 'bg-[#48B8FF] text-white opacity-100 scale-100 shadow-xl' 
                            : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:scale-110'
                        }`}
                      >
                        {isCurrentPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                      </button>

                      <div className="absolute top-2 ltr:left-2 rtl:right-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-cyan-300">
                          {lang === 'ar' ? track.categoryLabelAr : track.categoryLabelEn}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] truncate flex-1">
                          {lang === 'ar' ? track.titleAr : track.title}
                        </h4>
                        <button
                          onClick={() => toggleLikeTrack(track.id)}
                          className="text-[#6E7685] dark:text-[#94A3B8] hover:text-rose-500 cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#6E7685] dark:text-[#94A3B8] truncate">
                        {lang === 'ar' ? track.artistAr : track.artist}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-[#6E7685] dark:text-[#94A3B8] pt-1">
                        <span>{formatTime(track.duration)}</span>
                        <span>{track.playsCount} {lang === 'ar' ? 'استماع' : 'plays'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Playlist */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'إنشاء قائمة تشغيل جديدة' : 'Create New Playlist'}
            </h3>
            <form onSubmit={handleCreatePlaylistSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'عنوان القائمة' : 'Playlist Title'}
                </label>
                <input 
                  type="text" 
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: رحلتي الكونية' : 'e.g. Cosmic Journey'}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea 
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'وصف القائمة...' : 'Description...'}
                  rows={2}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePlaylistModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7685] dark:text-[#94A3B8] hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {lang === 'ar' ? 'إنشاء القائمة' : 'Create Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
