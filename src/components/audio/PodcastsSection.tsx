import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Radio, 
  TrendingUp, 
  Users, 
  Award,
  Crown,
  Upload,
  Calendar,
  Layers,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { AudioItem, PodcastEpisodeItem, UserPodcast } from '../../types/audio';

export default function PodcastsSection() {
  const { 
    userPodcasts, 
    createPodcast, 
    addPodcastEpisode, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    skipSeconds,
    continueProgress
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPodcast, setSelectedPodcast] = useState<UserPodcast | null>(null);
  
  // Modals
  const [showCreatePodcastModal, setShowCreatePodcastModal] = useState(false);
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);

  // New Podcast Form
  const [newPodTitle, setNewPodTitle] = useState('');
  const [newPodDesc, setNewPodDesc] = useState('');
  const [newPodCategory, setNewPodCategory] = useState('Astronomy & Cosmos');
  const [newPodCover, setNewPodCover] = useState('');

  // New Episode Form
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpDesc, setNewEpDesc] = useState('');
  const [newEpDuration, setNewEpDuration] = useState('24:00');
  const [newEpTier, setNewEpTier] = useState<'free' | 'premium'>('free');

  const categories = [
    { id: 'all', nameEn: 'All Podcasts', nameAr: 'جميع البرامج' },
    { id: 'Astronomy & Cosmos', nameEn: 'Cosmos & Space', nameAr: 'الفضاء والكون' },
    { id: 'Deep Science & Physics', nameEn: 'Physics & Science', nameAr: 'الفيزياء والعلوم' },
    { id: 'Creativity & Focus', nameEn: 'Creativity & Focus', nameAr: 'الإبداع والتركيز' },
    { id: 'Philosophy & Human Mind', nameEn: 'Philosophy', nameAr: 'الفلسفة والفكر' }
  ];

  const filteredPodcasts = userPodcasts.filter(pod => {
    if (selectedCategory === 'all') return true;
    return pod.category === selectedCategory;
  });

  const handleCreatePodcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodTitle.trim()) return;
    createPodcast(
      newPodTitle.trim(), 
      newPodDesc.trim(), 
      newPodCategory,
      newPodCover || undefined
    );
    setNewPodTitle('');
    setNewPodDesc('');
    setShowCreatePodcastModal(false);
    playSynthSound(800, 'sine', 0.05);
  };

  const handleAddEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPodcast || !newEpTitle.trim()) return;
    
    // Parse duration roughly
    const parts = newEpDuration.split(':');
    let durSec = 1200;
    if (parts.length === 2) {
      durSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    addPodcastEpisode(selectedPodcast.id, {
      title: newEpTitle.trim(),
      titleAr: newEpTitle.trim(),
      description: newEpDesc.trim(),
      descriptionAr: newEpDesc.trim(),
      duration: isNaN(durSec) ? 1200 : durSec,
      releaseDate: 'Today',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=space-ambient-112199.mp3',
      tier: newEpTier,
      tags: ['Creator', 'Podcast']
    });

    setNewEpTitle('');
    setNewEpDesc('');
    setShowAddEpisodeModal(false);
    playSynthSound(800, 'sine', 0.05);
  };

  const playEpisodeAsTrack = (ep: PodcastEpisodeItem, podcast: UserPodcast) => {
    const audioItem: AudioItem = {
      id: ep.id,
      title: ep.title,
      titleAr: ep.titleAr || ep.title,
      artist: podcast.creatorName,
      artistAr: podcast.creatorName,
      category: 'podcasts',
      categoryLabelAr: 'بودكاست',
      categoryLabelEn: 'Podcast Episode',
      coverUrl: ep.coverUrl || podcast.coverUrl,
      audioUrl: ep.audioUrl,
      duration: ep.duration,
      playsCount: ep.playsCount || 100,
      likesCount: 50,
      isCopyrightClean: true,
      copyrightType: 'Creator-Original',
      podcastEpisodes: podcast.episodes
    };
    playTrack(audioItem);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Creator Banner / Studio Entry */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#182232] to-cyan-900/20 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#48B8FF] text-white flex items-center justify-center shrink-0 shadow-lg">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {lang === 'ar' ? 'منصة صناع البودكاست' : 'Lodavia Creator Podcasts'}
              </span>
              <span className="text-[10px] font-bold text-[#6E7685] dark:text-[#94A3B8]">
                • {userPodcasts.length} {lang === 'ar' ? 'برامج مسجلة' : 'Shows'}
              </span>
            </div>
            <h3 className="text-xl font-black text-[#1A1F2C] dark:text-[#F8FAFC] mt-1">
              {lang === 'ar' ? 'استمع لأقوى حوارات العلوم والفضاء، أو انشر برنامجك الصوتي' : 'Listen to Deep Dialogues or Publish Your Own Podcast'}
            </h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 max-w-xl">
              {lang === 'ar' 
                ? 'فضاء صوتي مفتوح لصناع المحتوى العلمي، الفلسفي، والإنتاجي لمشاركة أفكارهم وبناء جمهور واعي.' 
                : 'A cosmic audio space for science, philosophy, and productivity creators to share knowledge.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSynthSound(650, 'sine', 0.05);
            setShowCreatePodcastModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-[#48B8FF] hover:opacity-90 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إنشاء بودكاست جديد' : 'Launch New Podcast'}</span>
        </button>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              playSynthSound(500, 'sine', 0.04);
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#48B8FF] text-white shadow-md'
                : 'bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC]'
            }`}
          >
            {lang === 'ar' ? cat.nameAr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Podcast Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPodcasts.map(podcast => (
          <div 
            key={podcast.id}
            className="rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/50 transition-all overflow-hidden flex flex-col shadow-sm group"
          >
            {/* Cover & Header */}
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img 
                src={podcast.coverUrl} 
                alt={podcast.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182232] via-transparent to-black/40" />

              <div className="absolute top-3 ltr:left-3 rtl:right-3 flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[#48B8FF] border border-white/10">
                  {lang === 'ar' ? podcast.categoryAr || podcast.category : podcast.category}
                </span>
              </div>

              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#48B8FF] text-white flex items-center justify-center font-black text-xs shadow-md">
                    {podcast.creatorName[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-black truncate max-w-[140px]">
                      {podcast.creatorName}
                    </h4>
                    <span className="text-[10px] text-cyan-300">
                      {podcast.creatorHandle}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                  {podcast.episodes.length} {lang === 'ar' ? 'حلقة' : 'episodes'}
                </span>
              </div>
            </div>

            {/* Show Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? podcast.titleAr || podcast.title : podcast.title}
                </h3>
                <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? podcast.descriptionAr || podcast.description : podcast.description}
                </p>
              </div>

              {/* Episodes List preview (first 2) */}
              <div className="space-y-2 pt-2 border-t border-[#E6EAF0] dark:border-[#2A3447]">
                {podcast.episodes.slice(0, 2).map((ep) => {
                  const isCurrent = currentTrack?.id === ep.id;
                  const isCurrentPlaying = isCurrent && isPlaying;
                  const prog = continueProgress[ep.id];

                  return (
                    <div 
                      key={ep.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'border-[#48B8FF] bg-[#48B8FF]/10' 
                          : 'border-[#E6EAF0] dark:border-[#2A3447] bg-[#FAF8F5]/80 dark:bg-[#202B3D]/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] truncate">
                            {lang === 'ar' ? ep.titleAr || ep.title : ep.title}
                          </h5>
                          {ep.tier === 'premium' && (
                            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#6E7685] dark:text-[#94A3B8] mt-0.5">
                          <span>{Math.floor(ep.duration / 60)} {lang === 'ar' ? 'دقيقة' : 'min'}</span>
                          {prog && (
                            <span className="text-[#48B8FF] font-bold">
                              • {lang === 'ar' ? 'متابعة' : 'Resume'} ({Math.floor(prog.seconds / 60)}m)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.04);
                          if (isCurrent) {
                            togglePlayPause();
                          } else {
                            playEpisodeAsTrack(ep, podcast);
                          }
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isCurrentPlaying 
                            ? 'bg-[#48B8FF] text-white shadow-md' 
                            : 'bg-white dark:bg-[#182232] text-[#1A1F2C] dark:text-[#F8FAFC] hover:bg-[#48B8FF] hover:text-white'
                        }`}
                      >
                        {isCurrentPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: Add Episode or View All Episodes */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedPodcast(podcast);
                    setShowAddEpisodeModal(true);
                  }}
                  className="flex-1 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة حلقة' : 'Add Episode'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Podcast */}
      {showCreatePodcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'إطلاق برنامج بودكاست جديد' : 'Launch New Podcast Show'}
            </h3>
            <form onSubmit={handleCreatePodcastSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'عنوان البودكاست' : 'Podcast Title'}
                </label>
                <input 
                  type="text" 
                  value={newPodTitle}
                  onChange={(e) => setNewPodTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: أسرار الكون الفسيح' : 'e.g. Cosmic Secrets'}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'التصنيف' : 'Category'}
                </label>
                <select 
                  value={newPodCategory}
                  onChange={(e) => setNewPodCategory(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none"
                >
                  <option value="Astronomy & Cosmos">Astronomy & Cosmos / الفضاء والكون</option>
                  <option value="Deep Science & Physics">Deep Science & Physics / الفيزياء والعلوم</option>
                  <option value="Creativity & Focus">Creativity & Focus / الإبداع والتركيز</option>
                  <option value="Philosophy & Human Mind">Philosophy / الفلسفة والفكر</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea 
                  value={newPodDesc}
                  onChange={(e) => setNewPodDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'عن ماذا يتحدث برنامجك الصوتي...' : 'What is your podcast about...'}
                  rows={3}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePodcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7685] dark:text-[#94A3B8] hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#48B8FF] text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {lang === 'ar' ? 'إطلاق البرنامج' : 'Publish Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Episode */}
      {showAddEpisodeModal && selectedPodcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'إضافة حلقة إلى' : 'Add Episode to'} {selectedPodcast.title}
            </h3>
            <form onSubmit={handleAddEpisodeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'عنوان الحلقة' : 'Episode Title'}
                </label>
                <input 
                  type="text" 
                  value={newEpTitle}
                  onChange={(e) => setNewEpTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الحلقة الأولى — البداية' : 'e.g. Episode 1 — The Genesis'}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'ملخص الحلقة' : 'Episode Summary'}
                </label>
                <textarea 
                  value={newEpDesc}
                  onChange={(e) => setNewEpDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'نقاط الحوار الرئيسية في الحلقة...' : 'Key discussion points...'}
                  rows={2}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'نوع المحتوى' : 'Content Tier'}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewEpTier('free')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newEpTier === 'free' 
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'border-[#E6EAF0] dark:border-[#2A3447] text-[#6E7685] dark:text-[#94A3B8]'
                    }`}
                  >
                    {lang === 'ar' ? 'مجاني للجميع' : 'Free for All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEpTier('premium')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newEpTier === 'premium' 
                        ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400' 
                        : 'border-[#E6EAF0] dark:border-[#2A3447] text-[#6E7685] dark:text-[#94A3B8]'
                    }`}
                  >
                    {lang === 'ar' ? 'خاص بالمشتركين 👑' : 'Subscriber Only 👑'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEpisodeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7685] dark:text-[#94A3B8] hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {lang === 'ar' ? 'نشر الحلقة' : 'Publish Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
