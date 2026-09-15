import React, { useRef, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  FolderPlus, 
  Upload, 
  Trash2, 
  Play, 
  Pause, 
  Music, 
  Plus, 
  HardDrive, 
  Check, 
  ListMusic, 
  Sparkles,
  ShieldCheck,
  Disc,
  Heart,
  PlusCircle,
  FileAudio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioItem } from '../../types/audio';

export default function MyMusicSection() {
  const { 
    localTracks, 
    addLocalFiles, 
    removeLocalTrack, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    createdPlaylists,
    createPlaylist,
    addTrackToPlaylist,
    likedTrackIds,
    toggleLikeTrack
  } = useAudio();

  const { lang, playSynthSound } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<AudioItem | null>(null);
  const [activePlaylistTab, setActivePlaylistTab] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addLocalFiles(e.target.files);
      playSynthSound(600, 'sine', 0.05);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addLocalFiles(e.dataTransfer.files);
      playSynthSound(600, 'sine', 0.05);
    }
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistTitle.trim()) return;
    createPlaylist(playlistTitle.trim(), playlistDesc.trim());
    setPlaylistTitle('');
    setPlaylistDesc('');
    setShowNewPlaylistModal(false);
    playSynthSound(800, 'sine', 0.06);
  };

  // Convert localTrack to AudioItem for player
  const toAudioItem = (track: typeof localTracks[0]): AudioItem => ({
    id: track.id,
    title: track.title,
    titleAr: track.title,
    artist: track.artist,
    artistAr: 'موسيقاي من جهازي',
    category: 'music',
    categoryLabelAr: 'ملف محلي',
    categoryLabelEn: 'Local File',
    coverUrl: track.coverUrl,
    audioUrl: track.audioUrl,
    duration: track.duration,
    playsCount: 1,
    likesCount: 0,
    isCopyrightClean: true,
    copyrightType: 'Creator-Original'
  });

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Privacy & Zero-Upload Cloud Assurance Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'تشغيل صوتي محلي خاص 100%' : '100% Private Local Audio'}
              </h4>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                {lang === 'ar' ? 'بدون خوادم' : 'Device Only'}
              </span>
            </div>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
              {lang === 'ar' 
                ? 'ملفاتك الصوتية تُشغّل مباشرة من ذاكرة جهازك دون رفعها لأي خادم خارجي، مما يحمي خصوصيتك وحقوق النشر بالكامل.'
                : 'Your audio files play directly from your device memory without uploading to external servers, protecting your privacy.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 rounded-xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة ملفات صوتية' : 'Import Audio Files'}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac" 
        multiple 
        className="hidden" 
      />

      {/* Drag & Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
          isDragging 
            ? 'border-[#48B8FF] bg-[#48B8FF]/10 scale-[1.01]' 
            : 'border-[#E6EAF0] dark:border-[#2A3447] bg-[#FAF8F5]/60 dark:bg-[#182232]/50 hover:border-[#48B8FF]/50 hover:bg-[#FAF8F5] dark:hover:bg-[#182232]'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#48B8FF]/15 text-[#48B8FF] flex items-center justify-center border border-[#48B8FF]/30 shadow-inner">
          <FileAudio className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
            {lang === 'ar' ? 'اسحب وأفلت الملفات الصوتية هنا' : 'Drag and drop audio files here'}
          </h3>
          <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
            {lang === 'ar' 
              ? 'يدعم صيغ MP3, WAV, FLAC, M4A, OGG من جهازك مباشرة' 
              : 'Supports MP3, WAV, FLAC, M4A, OGG directly from your machine'}
          </p>
        </div>
        <span className="text-xs font-bold text-[#48B8FF] underline mt-1">
          {lang === 'ar' ? 'أو تصفح الملفات على جهازك 📂' : 'Or browse files on your device 📂'}
        </span>
      </div>

      {/* Local Track List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-[#48B8FF]" />
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'الملفات المتاحة على الجهاز' : 'Local Device Audio Tracks'}
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#48B8FF]/10 text-[#48B8FF] border border-[#48B8FF]/20">
              {localTracks.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewPlaylistModal(true)}
              className="px-3.5 py-1.5 rounded-xl border border-[#E6EAF0] dark:border-[#2A3447] bg-white dark:bg-[#182232] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] hover:border-[#48B8FF] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#48B8FF]" />
              <span>{lang === 'ar' ? 'قائمة تشغيل جديدة' : 'New Playlist'}</span>
            </button>
          </div>
        </div>

        {localTracks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447]">
            <Disc className="w-10 h-10 text-[#6E7685] dark:text-[#94A3B8] mx-auto mb-2 opacity-50 animate-[spin_10s_linear_infinite]" />
            <p className="text-sm font-bold text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'لم تقم بإضافة ملفات من جهازك بعد' : 'No local device files imported yet'}
            </p>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
              {lang === 'ar' ? 'انقر على زر الاستيراد أعلاه لاختيار مقاطع الموسيقى أو التسجيلات الصوتية الخاصة بك' : 'Click the import button above to select your own music or recordings'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {localTracks.map((track) => {
              const audioItem = toAudioItem(track);
              const isCurrent = currentTrack?.id === track.id;
              const isCurrentPlaying = isCurrent && isPlaying;
              const isLiked = likedTrackIds.includes(track.id);

              return (
                <div 
                  key={track.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                    isCurrent 
                      ? 'border-[#48B8FF] bg-[#48B8FF]/10 shadow-sm' 
                      : 'border-[#E6EAF0] dark:border-[#2A3447] bg-white dark:bg-[#182232] hover:border-[#48B8FF]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Play / Pause button */}
                    <button
                      onClick={() => {
                        playSynthSound(600, 'sine', 0.04);
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playTrack(audioItem);
                        }
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isCurrentPlaying 
                          ? 'bg-[#48B8FF] text-white shadow-md' 
                          : 'bg-[#FAF8F5] dark:bg-[#202B3D] text-[#1A1F2C] dark:text-[#F8FAFC] group-hover:bg-[#48B8FF] group-hover:text-white'
                      }`}
                    >
                      {isCurrentPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC] truncate">
                          {track.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 shrink-0">
                          {track.fileSize}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] truncate mt-0.5">
                        {track.fileName}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLikeTrack(track.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isLiked 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                          : 'border-transparent text-[#6E7685] dark:text-[#94A3B8] hover:text-rose-500 hover:bg-rose-500/10'
                      }`}
                      title={lang === 'ar' ? 'إضافة للمفضلة' : 'Favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedTrackForPlaylist(audioItem)}
                      className="p-2 rounded-xl text-[#6E7685] dark:text-[#94A3B8] hover:text-[#48B8FF] hover:bg-[#48B8FF]/10 transition-all cursor-pointer"
                      title={lang === 'ar' ? 'إضافة لقائمة تشغيل' : 'Add to playlist'}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        playSynthSound(300, 'sine', 0.04);
                        removeLocalTrack(track.id);
                      }}
                      className="p-2 rounded-xl text-[#6E7685] dark:text-[#94A3B8] hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title={lang === 'ar' ? 'حذف من القائمة' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Playlists Management */}
      <div className="space-y-4 pt-4 border-t border-[#E6EAF0] dark:border-[#2A3447]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'قوائم التشغيل الخاصة بي' : 'My Custom Playlists'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {createdPlaylists.map((pl) => (
            <div 
              key={pl.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-purple-400/50 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={pl.coverUrl} 
                  alt={pl.title} 
                  className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-[#1A1F2C] dark:text-[#F8FAFC] truncate">
                    {lang === 'ar' ? pl.titleAr || pl.title : pl.title}
                  </h4>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-0.5">
                    {pl.tracks.length} {lang === 'ar' ? 'مقاطع صوتية' : 'tracks'}
                  </p>
                </div>
              </div>

              {pl.tracks.length > 0 && (
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.04);
                    playTrack(pl.tracks[0], pl.tracks);
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-600 dark:text-purple-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'ar' ? 'تشغيل القائمة بالكامل' : 'Play All'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Playlist */}
      {showNewPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'إنشاء قائمة تشغيل جديدة' : 'Create New Playlist'}
            </h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'عنوان القائمة' : 'Playlist Title'}
                </label>
                <input 
                  type="text" 
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: ملفات التركيز والعمل' : 'e.g. Focus & Deep Work'}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#6E7685] dark:text-[#94A3B8]">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea 
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'وصف مختصر لمحتوى القائمة...' : 'Brief description...'}
                  rows={2}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-sm text-[#1A1F2C] dark:text-[#F8FAFC] focus:border-[#48B8FF] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7685] dark:text-[#94A3B8] hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {lang === 'ar' ? 'إنشاء' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Track to Playlist Picker */}
      {selectedTrackForPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
              {lang === 'ar' ? 'إضافة إلى قائمة تشغيل' : 'Add to Playlist'}
            </h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8]">
              {selectedTrackForPlaylist.title}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {createdPlaylists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    addTrackToPlaylist(pl.id, selectedTrackForPlaylist);
                    setSelectedTrackForPlaylist(null);
                    playSynthSound(700, 'sine', 0.05);
                  }}
                  className="w-full p-3 rounded-xl border border-[#E6EAF0] dark:border-[#2A3447] bg-[#FAF8F5] dark:bg-[#202B3D] hover:border-[#48B8FF] text-start flex items-center justify-between text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] transition-all cursor-pointer"
                >
                  <span>{lang === 'ar' ? pl.titleAr || pl.title : pl.title}</span>
                  <Plus className="w-4 h-4 text-[#48B8FF]" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedTrackForPlaylist(null)}
              className="w-full py-2.5 rounded-xl border border-[#E6EAF0] dark:border-[#2A3447] text-xs font-bold text-[#6E7685] dark:text-[#94A3B8] cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
