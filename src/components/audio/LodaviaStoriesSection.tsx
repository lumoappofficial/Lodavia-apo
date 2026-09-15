import React, { useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  BookOpen, 
  Play, 
  Pause, 
  ShieldCheck, 
  Sparkles, 
  Bookmark, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Compass,
  FileText,
  X,
  Volume2
} from 'lucide-react';
import { AudioItem, LodaviaStory } from '../../types/audio';

export default function LodaviaStoriesSection() {
  const { 
    stories, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlayPause 
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  const [activeStoryModal, setActiveStoryModal] = useState<LodaviaStory | null>(null);
  const [sourcesStoryModal, setSourcesStoryModal] = useState<LodaviaStory | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const playStoryAsTrack = (story: LodaviaStory, chapterIdx = 0) => {
    const chapter = story.chapters[chapterIdx] || story.chapters[0];
    const narratorName = story.narratorName || story.narrator;
    const narratorNameAr = story.narratorNameAr || story.narratorRoleAr || story.narrator;
    const audioUrl = chapter.audioUrl || story.audioUrl;
    const dur = chapter.duration || Math.floor(story.duration / Math.max(1, story.chapters.length));

    const audioItem: AudioItem = {
      id: `${story.id}_ch${chapterIdx}`,
      title: `${story.title} — ${chapter.title}`,
      titleAr: `${story.titleAr} — ${chapter.titleAr}`,
      artist: `Narrator: ${narratorName}`,
      artistAr: `الراوي: ${narratorNameAr}`,
      category: 'stories',
      categoryLabelAr: 'قصص لودافيا الأصلية',
      categoryLabelEn: 'Lodavia Original Story',
      coverUrl: story.coverUrl,
      audioUrl: audioUrl,
      duration: dur,
      playsCount: story.playsCount || 500,
      likesCount: story.likesCount || 120,
      isCopyrightClean: true,
      copyrightType: 'Creator-Original',
      audiobookChapters: story.chapters.map(c => ({
        id: c.id,
        title: c.title,
        titleAr: c.titleAr,
        duration: c.duration || 120,
        audioUrl: c.audioUrl || story.audioUrl
      }))
    };
    playTrack(audioItem);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Hero Stories Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#182232] to-purple-950/30 border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-[#48B8FF] border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#48B8FF]" />
                <span>{lang === 'ar' ? 'سرد قصصي أصلي موثق' : 'Original Documented Audio Stories'}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{lang === 'ar' ? 'حقائق تاريخية موثقة' : 'Verified Real Facts'}</span>
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-[#1A1F2C] dark:text-[#F8FAFC] leading-snug">
              {lang === 'ar' ? 'قصص لودافيا — رحلات صوتية في أعماق العلم والكون' : 'Lodavia Stories — Immersive Cosmic Journeys'}
            </h3>
            <p className="text-xs md:text-sm text-[#6E7685] dark:text-[#94A3B8] mt-2 leading-relaxed">
              {lang === 'ar'
                ? 'قصص وسيناريوهات صوتية سينمائية تستند إلى مراجع علمية وتاريخية حقيقية، تُروى بأصوات شخصيات لودافيا المحبوبة (ريّ، لايكا، ألبرت) مع نصوص متزامنة.'
                : 'Cinematic audio stories grounded in historical and scientific archives, narrated by Lodavia universe characters with synchronized reading texts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-start">
              <div className="text-xs font-black text-[#48B8FF]">
                {stories.length} {lang === 'ar' ? 'قصص متاحة' : 'Stories'}
              </div>
              <div className="text-[10px] text-[#6E7685] dark:text-[#94A3B8]">
                {lang === 'ar' ? 'سرد صوتي + قراءة' : 'Audio + Read along'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => {
          const isStoryPlaying = currentTrack?.id.startsWith(story.id) && isPlaying;

          return (
            <div 
              key={story.id}
              className="rounded-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/50 transition-all overflow-hidden flex flex-col shadow-sm group"
            >
              {/* Cover Art */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img 
                  src={story.coverUrl} 
                  alt={story.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182232] via-black/30 to-black/20" />

                {/* Character Narrator Badge */}
                <div className="absolute top-3 ltr:left-3 rtl:right-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-white">
                    <span className="text-xs">
                      {story.narrator === 'Ray' ? '🚀' : story.narrator === 'Laika' ? '🐕' : story.narrator === 'Albert' ? '🧠' : '🎧'}
                    </span>
                    <span className="text-[10px] font-black">
                      {lang === 'ar' ? story.narratorNameAr || story.narratorRoleAr : story.narratorName || story.narrator}
                    </span>
                  </div>
                </div>

                {/* Documented Truth Badge */}
                <div className="absolute top-3 ltr:right-3 rtl:left-3">
                  <button
                    onClick={() => setSourcesStoryModal(story)}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md hover:bg-emerald-600 transition-all cursor-pointer"
                    title={lang === 'ar' ? 'عرض المصادر التاريخية الموثقة' : 'View Verified Historical Sources'}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'موثق' : 'Verified'}</span>
                  </button>
                </div>

                {/* Duration & Chapters Tag */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                  <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {story.chapters.length} {lang === 'ar' ? 'فصول صوتية' : 'Chapters'}
                  </span>

                  <span className="text-[10px] font-bold opacity-80">
                    {Math.floor((story.totalDuration || story.duration) / 60)} {lang === 'ar' ? 'دقيقة' : 'min'}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                    {lang === 'ar' ? story.titleAr : story.title}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1.5 line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? story.summaryAr : story.summary}
                  </p>
                </div>

                {/* Verified Sources Link & Reading View Launcher */}
                <div className="space-y-2 pt-2 border-t border-[#E6EAF0] dark:border-[#2A3447]">
                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => setSourcesStoryModal(story)}
                      className="text-cyan-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'المراجع والمصادر' : 'Historical Citations'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveStoryModal(story);
                        setActiveChapterIndex(0);
                      }}
                      className="text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'قراءة النص' : 'Read Text'}</span>
                    </button>
                  </div>

                  {/* Play Main Button */}
                  <button
                    onClick={() => {
                      playSynthSound(650, 'sine', 0.05);
                      if (isStoryPlaying) {
                        togglePlayPause();
                      } else {
                        playStoryAsTrack(story, 0);
                      }
                    }}
                    className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isStoryPlaying 
                        ? 'bg-[#48B8FF] text-white shadow-lg shadow-cyan-500/25' 
                        : 'bg-gradient-to-r from-cyan-600 to-[#48B8FF] hover:opacity-95 text-white shadow-md'
                    }`}
                  >
                    {isStoryPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>
                      {isStoryPlaying 
                        ? (lang === 'ar' ? 'إيقاف مؤقت للقصة' : 'Pause Story') 
                        : (lang === 'ar' ? 'الاستماع للقصة كاملة' : 'Listen to Full Story')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Read Along & Chapter Text Viewer */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-3xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0] dark:border-[#2A3447]">
              <div>
                <span className="text-[10px] font-black text-[#48B8FF] uppercase">
                  {lang === 'ar' ? 'قارئ قصص لودافيا' : 'Lodavia Story Reader'}
                </span>
                <h3 className="text-xl font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {lang === 'ar' ? activeStoryModal.titleAr : activeStoryModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveStoryModal(null)}
                className="p-2 rounded-full hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapters Tab Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {activeStoryModal.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeChapterIndex === idx 
                      ? 'bg-[#48B8FF] text-white shadow-sm' 
                      : 'bg-[#FAF8F5] dark:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8]'
                  }`}
                >
                  {lang === 'ar' ? ch.titleAr : ch.title}
                </button>
              ))}
            </div>

            {/* Chapter Text Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 rounded-2xl bg-[#FAF8F5]/60 dark:bg-[#121B2B]/60 border border-[#E6EAF0] dark:border-[#2A3447] text-start">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-black text-[#48B8FF]">
                  {lang === 'ar' 
                    ? activeStoryModal.chapters[activeChapterIndex].titleAr 
                    : activeStoryModal.chapters[activeChapterIndex].title}
                </h4>

                <button
                  onClick={() => playStoryAsTrack(activeStoryModal, activeChapterIndex)}
                  className="px-3 py-1.5 rounded-xl bg-[#48B8FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#38A8EF] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'ar' ? 'تشغيل هذا الفصل' : 'Play Chapter'}</span>
                </button>
              </div>

              <div className="text-sm md:text-base leading-loose text-[#1A1F2C] dark:text-[#E2E8F0] whitespace-pre-line font-medium">
                {lang === 'ar' 
                  ? activeStoryModal.chapters[activeChapterIndex].textSyncAr || activeStoryModal.summaryAr 
                  : activeStoryModal.chapters[activeChapterIndex].textSyncEn || activeStoryModal.summary}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSourcesStoryModal(activeStoryModal)}
                className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'المراجع والمصادر التاريخية لهذه القصة' : 'Verified Citations'}</span>
              </button>

              <button
                onClick={() => setActiveStoryModal(null)}
                className="px-5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#202B3D] text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Verified Citations & Historical Sources */}
      {sourcesStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-white dark:bg-[#182232] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                    {lang === 'ar' ? 'المصادر والوثائق التاريخية' : 'Verified Sources & Citations'}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8]">
                    {lang === 'ar' ? sourcesStoryModal.titleAr : sourcesStoryModal.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSourcesStoryModal(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Citations List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {(sourcesStoryModal.historicalCitations || sourcesStoryModal.sources?.map(s => ({
                sourceName: s.title,
                year: s.year,
                details: s.institution,
                detailsAr: s.institution
              })))?.map((cite, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202B3D] border border-[#E6EAF0] dark:border-[#2A3447] text-start space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                      {cite.sourceName}
                    </h5>
                    {cite.year && (
                      <span className="text-[10px] font-bold text-[#48B8FF] bg-[#48B8FF]/10 px-2 py-0.5 rounded-full">
                        {cite.year}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] leading-relaxed">
                    {lang === 'ar' ? cite.detailsAr : cite.details}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#6E7685] dark:text-[#94A3B8] bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl leading-relaxed text-start">
              {lang === 'ar'
                ? 'ملاحظة: تعتمد قصص لودافيا على وقائع تاريخية وعلمية مثبتة. حين تكون بعض التفاصيل غير مؤكدة تاريخياً، نوضح ذلك في السرد كافتراض مبني على شواهد.'
                : 'Note: Lodavia Stories are grounded in documented historical and scientific archives. Uncertain nuances are explicitly presented as plausible interpretations.'}
            </p>

            <button
              onClick={() => setSourcesStoryModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'فهمت ذلك' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
