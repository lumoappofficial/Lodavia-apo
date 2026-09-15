import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Radio, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Globe2 
} from 'lucide-react';
import { LodaviaNowEvent } from '../../types/lodaviaNow';
import { 
  VERIFIED_LODAVIA_EVENTS, 
  CATEGORY_MAP, 
  getEventStatus, 
  getHomeCardEvents, 
  formatLocalEventTime, 
  formatCountdownString 
} from '../../data/lodaviaNowData';
import LodaviaNowEventModal from './LodaviaNowEventModal';

interface LodaviaNowCardProps {
  variant?: 'card' | 'ticker';
}

export default function LodaviaNowCard({ variant = 'ticker' }: LodaviaNowCardProps) {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  // Real-time ticking state (updates every 1s for the countdown)
  const [now, setNow] = useState<Date>(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<LodaviaNowEvent | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const homeEvents = getHomeCardEvents(VERIFIED_LODAVIA_EVENTS, now);

  if (!homeEvents || homeEvents.length === 0) return null;

  // COMPACT SINGLE-LINE TICKER VARIANT
  if (variant === 'ticker') {
    const topEvent = homeEvents[0];
    const categoryInfo = CATEGORY_MAP[topEvent.category];
    const status = getEventStatus(now, topEvent.startDateIso, topEvent.endDateIso);

    return (
      <>
        <div 
          onClick={() => {
            playSynthSound(550, 'sine', 0.05);
            setSelectedEvent(topEvent);
          }}
          className="w-full h-9 rounded-2xl bg-white/90 dark:bg-[#0D1224]/90 border border-slate-200/80 dark:border-cyan-500/25 px-3 py-1 flex items-center justify-between gap-2 shadow-xs cursor-pointer hover:border-cyan-400/50 transition-all group backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isRtl ? 'الآن' : 'NOW'}
              </span>
            </div>

            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-500 transition-colors">
              {isRtl ? topEvent.titleAr : topEvent.titleEn}
            </span>

            {status === 'LIVE' ? (
              <span className="text-[9px] font-black text-rose-500 uppercase px-1.5 py-0.2 rounded-md bg-rose-500/10 shrink-0 hidden sm:inline">
                {isRtl ? 'مباشر' : 'LIVE'}
              </span>
            ) : status === 'UPCOMING' ? (
              <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 px-1.5 py-0.2 rounded-md bg-cyan-500/10 shrink-0 hidden sm:inline">
                {formatCountdownString(topEvent.startDateIso, now, lang)}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-sky-600 dark:text-cyan-400 group-hover:underline">
            <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </div>

        <LodaviaNowEventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          now={now}
          lang={lang}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-cyan-500/20 rounded-3xl p-4 sm:p-5 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.08)] backdrop-blur-md transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5 gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wide">
                  {isRtl ? 'ماذا يحدث الآن؟' : 'LODAVIA NOW'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isRtl ? 'الأحداث العالمية الموثقة والمهمة' : 'Real-time verified global events'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.08);
              navigate('/lodavia-now');
            }}
            className="flex items-center gap-1 text-xs font-black text-sky-600 dark:text-cyan-400 hover:text-sky-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Events List (1-3 items) */}
        <div className="space-y-2.5">
          {homeEvents.map((evt) => {
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
                className="group relative p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Category Badge Icon */}
                  <div className={`p-2 rounded-xl shrink-0 border ${categoryInfo?.badgeBg} ${categoryInfo?.badgeText}`}>
                    <CategoryIcon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        {isRtl ? categoryInfo?.titleAr : categoryInfo?.titleEn}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">•</span>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                        {evt.sourceName}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                      {isRtl ? evt.titleAr : evt.titleEn}
                    </h4>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatLocalEventTime(evt.startDateIso, lang)}
                    </div>
                  </div>
                </div>

                {/* Status / Countdown */}
                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                  {status === 'LIVE' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-black flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {isRtl ? 'مباشر' : 'LIVE'}
                    </span>
                  )}

                  {status === 'UPCOMING' && (
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[11px] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatCountdownString(evt.startDateIso, now, lang)}
                    </span>
                  )}

                  {status === 'ENDED' && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-semibold">
                      {isRtl ? 'منتهي' : 'Ended'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Launch AR Sky Observer */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => {
              playSynthSound(650, 'sine', 0.08);
              navigate('/sky');
            }}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/15 to-indigo-500/10 hover:from-sky-500/20 hover:via-cyan-500/25 hover:to-indigo-500/20 border border-cyan-500/30 text-sky-700 dark:text-cyan-300 font-bold text-xs flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🌌</span>
              <span>{isRtl ? 'سماء لودافيا: استكشف كواكب ونجوم الليلة بكاميرا AR' : 'LODAVIA SKY: Explore live celestial bodies in AR Camera'}</span>
            </div>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <LodaviaNowEventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        now={now}
        lang={lang}
      />
    </>
  );
}
