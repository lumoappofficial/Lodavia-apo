import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  Globe2, 
  MapPin, 
  ExternalLink, 
  Bell, 
  Check, 
  Radio, 
  RadioTower, 
  Sparkles 
} from 'lucide-react';
import { LodaviaNowEvent, EventReminderSetting } from '../../types/lodaviaNow';
import { 
  CATEGORY_MAP, 
  getEventStatus, 
  formatLocalEventTime, 
  getUserTimezoneDisplay, 
  formatCountdownString 
} from '../../data/lodaviaNowData';
import { playSynthSound } from '../../utils/synth';
import { sanitizeExternalUrl } from '../../utils/urlSecurity';

interface LodaviaNowEventModalProps {
  event: LodaviaNowEvent | null;
  isOpen: boolean;
  onClose: () => void;
  now: Date;
  lang: string;
}

const REMINDER_OPTIONS = [
  { minutes: 5, labelAr: '5 دقائق قبل الموعد', labelEn: '5 minutes before' },
  { minutes: 15, labelAr: '15 دقيقة قبل الموعد', labelEn: '15 minutes before' },
  { minutes: 30, labelAr: '30 دقيقة قبل الموعد', labelEn: '30 minutes before' },
  { minutes: 60, labelAr: 'ساعة واحدة قبل الموعد', labelEn: '1 hour before' },
  { minutes: 1440, labelAr: 'يوم واحد قبل الموعد', labelEn: '1 day before' }
];

export default function LodaviaNowEventModal({
  event,
  isOpen,
  onClose,
  now,
  lang
}: LodaviaNowEventModalProps) {
  const isRtl = lang === 'ar';
  const categoryInfo = event ? CATEGORY_MAP[event.category] : null;
  const CategoryIcon = categoryInfo?.icon || Sparkles;
  const status = event ? getEventStatus(now, event.startDateIso, event.endDateIso) : 'ENDED';
  const tzInfo = getUserTimezoneDisplay();

  const [selectedReminder, setSelectedReminder] = useState<number | null>(null);
  const [reminderSaved, setReminderSaved] = useState(false);

  // Prevent page scrolling while modal is open & add Escape key support
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load existing reminder for this event
  useEffect(() => {
    if (!event) return;
    try {
      const existing = localStorage.getItem(`lodavia_reminder_${event.id}`);
      if (existing) {
        const parsed: EventReminderSetting = JSON.parse(existing);
        setSelectedReminder(parsed.minutesBefore);
        setReminderSaved(true);
      } else {
        setSelectedReminder(null);
        setReminderSaved(false);
      }
    } catch (e) {
      // ignore
    }
  }, [event?.id]);

  const handleSaveReminder = (minutes: number) => {
    if (!event) return;
    playSynthSound(600, 'sine', 0.12);
    setSelectedReminder(minutes);
    setReminderSaved(true);

    const setting: EventReminderSetting = {
      eventId: event.id,
      minutesBefore: minutes,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`lodavia_reminder_${event.id}`, JSON.stringify(setting));
    } catch (e) {
      // ignore
    }
  };

  const handleRemoveReminder = () => {
    if (!event) return;
    playSynthSound(200, 'triangle', 0.1);
    setSelectedReminder(null);
    setReminderSaved(false);
    try {
      localStorage.removeItem(`lodavia_reminder_${event.id}`);
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen || !event) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            playSynthSound(400, 'sine', 0.05);
            onClose();
          }
        }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden my-auto max-h-[90vh] flex flex-col z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner / Image */}
          {event.imageUrl ? (
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <img
                src={event.imageUrl}
                alt={isRtl ? event.titleAr : event.titleEn}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-black/30" />
              
              {/* Top Bar overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 backdrop-blur-md border ${categoryInfo?.badgeBg} ${categoryInfo?.badgeText}`}>
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {isRtl ? categoryInfo?.titleAr : categoryInfo?.titleEn}
                </span>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                  aria-label={isRtl ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${categoryInfo?.badgeBg} ${categoryInfo?.badgeText}`}>
                <CategoryIcon className="w-3.5 h-3.5" />
                {isRtl ? categoryInfo?.titleAr : categoryInfo?.titleEn}
              </span>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                aria-label={isRtl ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5 text-slate-900 dark:text-slate-100">
            {/* Status Badge & Countdown Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {status === 'LIVE' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-black text-xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{isRtl ? 'مباشر الآن 🔴' : 'LIVE NOW 🔴'}</span>
                </div>
              )}

              {status === 'UPCOMING' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'ينطلق بعد:' : 'Starts in:'}</span>
                  <span className="font-mono font-black">{formatCountdownString(event.startDateIso, now, lang)}</span>
                </div>
              )}

              {status === 'ENDED' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-500 dark:text-slate-400 font-semibold text-xs">
                  <span>{isRtl ? 'انتهت الفعالية' : 'Event Ended'}</span>
                </div>
              )}

              {/* Source Tag */}
              <a
                href={sanitizeExternalUrl(event.sourceUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline ms-auto cursor-pointer"
              >
                <span>{event.sourceName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Event Title */}
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white">
              {isRtl ? event.titleAr : event.titleEn}
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isRtl ? event.descAr : event.descEn}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'الموعد المحلي' : 'Local Date & Time'}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{formatLocalEventTime(event.startDateIso, lang)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'المنطقة الزمنية' : 'Timezone'}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{tzInfo.zoneName} ({tzInfo.offsetStr})</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-1 sm:col-span-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'الموقع / البث' : 'Location / Stream'}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{isRtl ? event.locationAr : event.locationEn}</div>
                </div>
              </div>
            </div>

            {/* Reminder Setting Options */}
            {status === 'UPCOMING' && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>{isRtl ? 'تنبيهك قبل الفعالية' : 'Set Event Reminder'}</span>
                  </div>

                  {reminderSaved && (
                    <button
                      onClick={handleRemoveReminder}
                      className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer"
                    >
                      {isRtl ? 'إلغاء التذكير' : 'Cancel Reminder'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REMINDER_OPTIONS.map((opt) => {
                    const isSelected = selectedReminder === opt.minutes;
                    return (
                      <button
                        key={opt.minutes}
                        onClick={() => handleSaveReminder(opt.minutes)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-400/50'
                        }`}
                      >
                        {isRtl ? opt.labelAr : opt.labelEn}
                      </button>
                    );
                  })}
                </div>

                {reminderSaved && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>
                      {isRtl
                        ? `تم حفظ التذكير قبل الفعالية! ستتلقى تنبيهاً كوانتياً.`
                        : `Reminder scheduled successfully! You will be notified.`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
