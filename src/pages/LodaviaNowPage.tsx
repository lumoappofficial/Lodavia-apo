import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Radio, 
  Search, 
  Clock, 
  Calendar, 
  Globe2, 
  Sparkles, 
  ExternalLink, 
  WifiOff, 
  CheckCircle2, 
  Filter, 
  Bell,
  Camera,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  LodaviaNowEvent, 
  LodaviaNowCategory, 
  LodaviaDateFilter 
} from '../types/lodaviaNow';
import { 
  VERIFIED_LODAVIA_EVENTS, 
  CATEGORY_MAP, 
  getEventStatus, 
  filterEvents, 
  formatLocalEventTime, 
  getUserTimezoneDisplay, 
  formatCountdownString, 
  LAST_VERIFIED_DATA_UPDATE 
} from '../data/lodaviaNowData';
import LodaviaNowEventModal from '../components/lodaviaNow/LodaviaNowEventModal';

export default function LodaviaNowPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [now, setNow] = useState<Date>(() => new Date());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<LodaviaDateFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<LodaviaNowCategory | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<LodaviaNowEvent | null>(null);

  // Real-time ticking for countdown (every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const tzInfo = getUserTimezoneDisplay();

  // Filter logic
  let filtered = filterEvents(VERIFIED_LODAVIA_EVENTS, dateFilter, categoryFilter, now);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      evt =>
        evt.titleAr.toLowerCase().includes(q) ||
        evt.titleEn.toLowerCase().includes(q) ||
        evt.descAr.toLowerCase().includes(q) ||
        evt.descEn.toLowerCase().includes(q) ||
        evt.sourceName.toLowerCase().includes(q) ||
        evt.locationAr.toLowerCase().includes(q) ||
        evt.locationEn.toLowerCase().includes(q)
    );
  }

  const dateFiltersList: { id: LodaviaDateFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'now', labelAr: 'الآن 🔴', labelEn: 'Now 🔴' },
    { id: 'today', labelAr: 'اليوم', labelEn: 'Today' },
    { id: 'tomorrow', labelAr: 'غدًا', labelEn: 'Tomorrow' },
    { id: 'week', labelAr: 'هذا الأسبوع', labelEn: 'This Week' }
  ];

  const categoriesList: { id: LodaviaNowCategory | 'all'; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'كل الأقسام', labelEn: 'All Categories' },
    ...Object.values(CATEGORY_MAP).map(c => ({
      id: c.id,
      labelAr: c.titleAr,
      labelEn: c.titleEn
    }))
  ];

  return (
    <div className="max-w-5xl mx-auto w-full pb-16 px-3 sm:px-6 space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-purple-500/10 border border-sky-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                {isRtl ? 'ماذا يحدث الآن؟' : 'LODAVIA NOW'}
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
              {isRtl
                ? 'متابعة حية للأحداث الفلكية والتقنية والرياضية والعالمية الموثقة'
                : 'Real-time verified astronomy, tech, sports & global events'}
            </p>
          </div>
        </div>

        {/* Local Timezone Badge */}
        <div className="px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 shrink-0 self-start sm:self-center shadow-sm">
          <Globe2 className="w-4 h-4 text-sky-500 shrink-0" />
          <span>{tzInfo.zoneName} ({tzInfo.offsetStr})</span>
        </div>
      </div>

      {/* Offline Fallback Banner */}
      {!isOnline && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2.5">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            {isRtl
              ? `أنت حاليًا غير متصل بالإنترنت. يتم عرض الأحداث الموثقة المخزنة (${LAST_VERIFIED_DATA_UPDATE.ar}).`
              : `You are currently offline. Displaying cached verified events (${LAST_VERIFIED_DATA_UPDATE.en}).`}
          </span>
        </div>
      )}

      {/* Featured LODAVIA SKY AR Feature Banner */}
      <div 
        onClick={() => {
          playSynthSound(700, 'sine', 0.1);
          navigate('/sky');
        }}
        className="group relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-cyan-500/40 hover:border-cyan-400 text-white shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
      >
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-purple-600 text-slate-950 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
            🔭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isRtl ? 'ميزة تفاعلية جديدة' : 'New Interactive AR Feature'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                GPS + Camera
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1">
              {isRtl ? 'سماء لودافيا – LODAVIA SKY (رصد الكواكب والنجوم بالـ AR)' : 'LODAVIA SKY (Real-Time Celestial AR Explorer)'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {isRtl
                ? 'وجّه كاميرا هاتفك نحو السماء الآن لمشاهدة مواقع القمر، الشمس، الكواكب والنجوم بالواقع المعزز في بث فلكي دقيق.'
                : 'Point your camera at the sky to track the Moon, Sun, planets, and constellations in real-time AR.'}
            </p>
          </div>
        </div>

        <button className="z-10 px-4 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-400/20 shrink-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          <span>{isRtl ? 'ابدأ رصد السماء 🌌' : 'Launch AR Sky 🌌'}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3.5">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث في الأحداث، المصادر، المكان...' : 'Search events, sources, locations...'}
            className={`w-full py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm transition-all`}
          />
        </div>

        {/* Date Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {dateFiltersList.map(df => {
            const isActive = dateFilter === df.id;
            return (
              <button
                key={df.id}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setDateFilter(df.id);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {isRtl ? df.labelAr : df.labelEn}
              </button>
            );
          })}
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoriesList.map(cat => {
            const isActive = categoryFilter === cat.id;
            const categoryInfo = cat.id !== 'all' ? CATEGORY_MAP[cat.id] : null;
            const CategoryIcon = categoryInfo?.icon || Filter;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setCategoryFilter(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/5 hover:border-slate-300'
                }`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(evt => {
            const categoryInfo = CATEGORY_MAP[evt.category];
            const CategoryIcon = categoryInfo?.icon || Sparkles;
            const status = getEventStatus(now, evt.startDateIso, evt.endDateIso);

            return (
              <div
                key={evt.id}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setSelectedEvent(evt);
                }}
                className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-cyan-500/20 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Optional Top Thumbnail */}
                {evt.imageUrl && (
                  <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                    <img
                      src={evt.imageUrl}
                      alt={isRtl ? evt.titleAr : evt.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 backdrop-blur-md border ${categoryInfo?.badgeBg} ${categoryInfo?.badgeText}`}>
                        <CategoryIcon className="w-3 h-3" />
                        {isRtl ? categoryInfo?.titleAr : categoryInfo?.titleEn}
                      </span>

                      {status === 'LIVE' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center gap-1 shadow-md animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          {isRtl ? 'مباشر' : 'LIVE'}
                        </span>
                      )}

                      {status === 'UPCOMING' && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-cyan-300 text-[10px] font-mono font-bold backdrop-blur-md border border-cyan-500/30">
                          {formatCountdownString(evt.startDateIso, now, lang)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {!evt.imageUrl && (
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border ${categoryInfo?.badgeBg} ${categoryInfo?.badgeText}`}>
                          <CategoryIcon className="w-3 h-3" />
                          {isRtl ? categoryInfo?.titleAr : categoryInfo?.titleEn}
                        </span>

                        {status === 'LIVE' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-black flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {isRtl ? 'مباشر' : 'LIVE'}
                          </span>
                        )}

                        {status === 'UPCOMING' && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold">
                            {formatCountdownString(evt.startDateIso, now, lang)}
                          </span>
                        )}
                      </div>
                    )}

                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {isRtl ? evt.titleAr : evt.titleEn}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 font-normal">
                      {isRtl ? evt.descAr : evt.descEn}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="truncate">
                      {formatLocalEventTime(evt.startDateIso, lang)}
                    </span>

                    <span className="font-bold text-sky-600 dark:text-cyan-400 shrink-0 ms-2">
                      {evt.sourceName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl space-y-3">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto animate-bounce" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isRtl ? 'لم يتم العثور على أحداث تطابق البحث' : 'No events found matching your criteria'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRtl ? 'جرّب اختيار قسم آخر أو تغيير نص البحث.' : 'Try selecting another category or changing search keywords.'}
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      <LodaviaNowEventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        now={now}
        lang={lang}
      />
    </div>
  );
}
