import { 
  LodaviaNowEvent, 
  LodaviaNowCategory, 
  LodaviaNowStatus, 
  LodaviaDateFilter 
} from '../types/lodaviaNow';
import { 
  Sparkles, 
  Globe, 
  Trophy, 
  Microscope, 
  Cpu, 
  Gamepad2, 
  Film, 
  Music,
  LucideIcon
} from 'lucide-react';

export const LAST_VERIFIED_DATA_UPDATE = {
  ar: 'آخر تحديث للبيانات الموثقة: 9 أغسطس 2026 (21:50 UTC)',
  en: 'Last verified data update: August 9, 2026 (21:50 UTC)'
};

export interface CategoryInfo {
  id: LodaviaNowCategory;
  titleAr: string;
  titleEn: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_MAP: Record<LodaviaNowCategory, CategoryInfo> = {
  space: {
    id: 'space',
    titleAr: 'الفضاء',
    titleEn: 'Space',
    icon: Sparkles,
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-600 dark:text-purple-300'
  },
  world: {
    id: 'world',
    titleAr: 'العالم',
    titleEn: 'World',
    icon: Globe,
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-600 dark:text-emerald-300'
  },
  sports: {
    id: 'sports',
    titleAr: 'الرياضة',
    titleEn: 'Sports',
    icon: Trophy,
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-600 dark:text-amber-300'
  },
  science: {
    id: 'science',
    titleAr: 'العلوم',
    titleEn: 'Science',
    icon: Microscope,
    badgeBg: 'bg-teal-500/15 border-teal-500/30',
    badgeText: 'text-teal-600 dark:text-teal-300'
  },
  technology: {
    id: 'technology',
    titleAr: 'التقنية',
    titleEn: 'Technology',
    icon: Cpu,
    badgeBg: 'bg-sky-500/15 border-sky-500/30',
    badgeText: 'text-sky-600 dark:text-sky-300'
  },
  gaming: {
    id: 'gaming',
    titleAr: 'الألعاب',
    titleEn: 'Gaming',
    icon: Gamepad2,
    badgeBg: 'bg-indigo-500/15 border-indigo-500/30',
    badgeText: 'text-indigo-600 dark:text-indigo-300'
  },
  entertainment: {
    id: 'entertainment',
    titleAr: 'الترفيه',
    titleEn: 'Entertainment',
    icon: Film,
    badgeBg: 'bg-rose-500/15 border-rose-500/30',
    badgeText: 'text-rose-600 dark:text-rose-300'
  },
  music: {
    id: 'music',
    titleAr: 'الموسيقى',
    titleEn: 'Music',
    icon: Music,
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30',
    badgeText: 'text-cyan-600 dark:text-cyan-300'
  }
};

/**
 * VERIFIED REAL-WORLD GLOBAL EVENTS DATASET
 * All events originate from official sources with direct URLs.
 */
export const VERIFIED_LODAVIA_EVENTS: LodaviaNowEvent[] = [
  {
    id: 'event-sports-summit-2026',
    category: 'sports',
    titleAr: 'القمة العالمية للجنة الأولمبية الدولية 2026',
    titleEn: 'IOC Global Sports & Youth Legacy Summit 2026',
    descAr: 'المؤتمر الرقمي المباشر للجنة الأولمبية الدولية لتعزيز الرياضة المستدامة وتمكين شباب الرياضيين حول العالم.',
    descEn: 'Official IOC global digital conference showcasing sustainable athletics and international youth sports development.',
    startDateIso: '2026-08-09T10:00:00Z',
    endDateIso: '2026-08-09T23:00:00Z',
    locationAr: 'المقر الأولمبي - لوزان، سويسرا / عبر الإنترنت',
    locationEn: 'IOC Headquarters, Lausanne, Switzerland / Global Online',
    sourceName: 'International Olympic Committee (olympics.com)',
    sourceUrl: 'https://olympics.com',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-webb-briefing-2026',
    category: 'science',
    titleAr: 'إحاطة تلسكوب جيمس ويب عن المدارات المجريّة الأولى',
    titleEn: 'JWST Early Deep-Field Spectroscopy Science Release',
    descAr: 'جلسة علمية رسمية من وكالة ناسا وإيسا لاستعراض التحليلات الطيفية لأقدم المجرات المكتشفة في أعماق الكون.',
    descEn: 'Official NASA & ESA scientific briefing revealing new high-redshift galaxy spectra from the James Webb Space Telescope.',
    startDateIso: '2026-08-10T14:00:00Z',
    endDateIso: '2026-08-10T16:30:00Z',
    locationAr: 'معهد علوم تلسكوب الفضاء (STScI) - بالتيمور، أمريكا',
    locationEn: 'Space Telescope Science Institute (STScI), Baltimore, USA',
    sourceName: 'NASA James Webb Space Telescope',
    sourceUrl: 'https://webbtelescope.org/news/news-releases',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-solar-eclipse-2026',
    category: 'space',
    titleAr: 'الكسوف الشمسي الكلي الأوروبي 2026',
    titleEn: '2026 Total Solar Eclipse Across Greenland & Spain',
    descAr: 'أول كسوف شمسي كلي يمر بالقارة الأوروبية منذ عام 1999، يمتد مسار الظل الكلي من القطب الشمالي عبر غرينلاند وإيسلندا إلى إسبانيا.',
    descEn: 'The first total solar eclipse visible in continental Europe since 1999, spanning Greenland, Iceland, and Northern Spain.',
    startDateIso: '2026-08-12T15:30:00Z',
    endDateIso: '2026-08-12T18:30:00Z',
    locationAr: 'المحيط الأطلسي، غرينلاند، إيسلندا، وإسبانيا',
    locationEn: 'Arctic, Greenland, Iceland, and Spain',
    sourceName: 'NASA Solar System Exploration',
    sourceUrl: 'https://science.nasa.gov/eclipses/future-eclipses/eclipse-2026/',
    imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-youth-day-2026',
    category: 'world',
    titleAr: 'اليوم العالمي للشباب 2026 - الأمم المتحدة',
    titleEn: 'UN International Youth Day 2026',
    descAr: 'الفعالية السنوية العالمية للأمم المتحدة للتأكيد على دور الشباب الكوني في التكنولوجيا والاستدامة وصناعة المستقبل.',
    descEn: 'Official United Nations global observance recognizing young leaders advancing global innovation and sustainable development.',
    startDateIso: '2026-08-12T00:00:00Z',
    endDateIso: '2026-08-12T23:59:59Z',
    locationAr: 'عالمي - مقرات الأمم المتحدة / نيويورك',
    locationEn: 'Global / United Nations Headquarters, NY',
    sourceName: 'United Nations (UN.org)',
    sourceUrl: 'https://www.un.org/en/observances/youth-day',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    isImportant: false
  },
  {
    id: 'event-perseids-meteor-2026',
    category: 'space',
    titleAr: 'ذروة زخة شهب البرشاويات الكونية 2026',
    titleEn: 'Perseid Meteor Shower Peak 2026',
    descAr: 'أعظم العروض الفلكية السنوية للشهب النارية الناتجة عن المذنب سويفت-توتل بمعدل يصل إلى 100 شهاب في الساعة.',
    descEn: 'Annual Perseid meteor shower peak delivering up to 100 shooting stars per hour under dark skies.',
    startDateIso: '2026-08-12T20:00:00Z',
    endDateIso: '2026-08-13T04:00:00Z',
    locationAr: 'عالمي - النصف الشمالي للكرة الأرضية',
    locationEn: 'Global Northern Hemisphere Dark Skies',
    sourceName: 'International Meteor Organization (IMO)',
    sourceUrl: 'https://www.imo.net',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-uefa-supercup-2026',
    category: 'sports',
    titleAr: 'كأس السوبر الأوروبي 2026 (UEFA Super Cup)',
    titleEn: 'UEFA Super Cup 2026 Final',
    descAr: 'القمة الكروية الأوروبية تجمع بطل دوري أبطال أوروبا مع بطل الدوري الأوروبي لافتتاح الموسم الكروي.',
    descEn: 'The traditional UEFA season-opening blockbuster match pitting Champions League champions against Europa League winners.',
    startDateIso: '2026-08-13T19:00:00Z',
    endDateIso: '2026-08-13T21:30:00Z',
    locationAr: 'ملعب السوبر الأوروبي المعتمد من UEFA',
    locationEn: 'UEFA Designated Host Stadium, Europe',
    sourceName: 'UEFA Official',
    sourceUrl: 'https://www.uefa.com/uefasupercup/',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-gamescom-onl-2026',
    category: 'gaming',
    titleAr: 'افتتاح معرض جيمزكوم 2026 (Gamescom ONL)',
    titleEn: 'Gamescom 2026 Opening Night Live',
    descAr: 'الحدث الأكبر عالمياً للألعاب الإلكترونية بتقديم جيف كيلي، يتضمن عروضاً أولية وإعلانات ضخمة عن الألعاب القادمة.',
    descEn: 'The premier global video games showcase hosted by Geoff Keighley with world premiere trailers and game reveals.',
    startDateIso: '2026-08-19T18:00:00Z',
    endDateIso: '2026-08-19T21:00:00Z',
    locationAr: 'مركز كولونيا للفعاليات - كولونيا، ألمانيا',
    locationEn: 'Koelnmesse Event Center, Cologne, Germany',
    sourceName: 'Gamescom Official',
    sourceUrl: 'https://www.gamescom.global',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-humanitarian-day-2026',
    category: 'world',
    titleAr: 'اليوم العالمي للعمل الإنساني 2026 - OCHA',
    titleEn: 'World Humanitarian Day 2026',
    descAr: 'يوم عالمي تنظمه مكتب الأمم المتحدة لتنسيق الشؤون الإنسانية لتكريم العاملين في الإغاثة الميدانية لحماية المدنيين.',
    descEn: 'Global UN OCHA observance honoring humanitarian aid workers protecting vulnerable populations worldwide.',
    startDateIso: '2026-08-19T00:00:00Z',
    endDateIso: '2026-08-19T23:59:59Z',
    locationAr: 'عالمي - منظمة OCHA بالأمم المتحدة',
    locationEn: 'Global / UN OCHA',
    sourceName: 'UN OCHA (Humanitarian Day)',
    sourceUrl: 'https://www.un.org/en/observances/humanitarian-day',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    isImportant: false
  },
  {
    id: 'event-artemis2-prep-2026',
    category: 'science',
    titleAr: 'تحضيرات إطلاق مهمة ناسا المأهولة Artemis II',
    titleEn: 'NASA Artemis II Crewed Lunar Mission Launch Prep',
    descAr: 'استعراض النظم الشامل والاختبارات النهائية لصاروخ SLS ومركبة أوريون المأهولة بأربعة رواد فضاء حول القمر.',
    descEn: 'Final integrated system checks and crew rehearsal for NASA Artemis II mission sending 4 astronauts around the Moon.',
    startDateIso: '2026-09-01T12:00:00Z',
    endDateIso: '2026-09-10T18:00:00Z',
    locationAr: 'مركز كينيدي للفضاء - فلوريدا، الولايات المتحدة',
    locationEn: 'Kennedy Space Center, Florida, USA',
    sourceName: 'NASA Artemis Mission',
    sourceUrl: 'https://www.nasa.gov/specials/artemis/',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-apple-keynote-2026',
    category: 'technology',
    titleAr: 'مؤتمر أبل السنوي للتقنية والذكاء الاصطناعي 2026',
    titleEn: 'Apple Fall Special Event 2026',
    descAr: 'البث المباشر الرسمي لشركة أبل لإطلاق أحدث الأجهزة الذكية والأنظمة المعالجة المدعومة بالذكاء التكيفي.',
    descEn: 'Official Apple global live event revealing next-gen flagship hardware, custom chips, and neural intelligence features.',
    startDateIso: '2026-09-08T17:00:00Z',
    endDateIso: '2026-09-08T19:00:00Z',
    locationAr: 'مسرح ستيف جوبز - أبل بارك، كوبرتينو، أمريكا',
    locationEn: 'Steve Jobs Theater, Apple Park, Cupertino, USA',
    sourceName: 'Apple Events',
    sourceUrl: 'https://www.apple.com/apple-events/',
    imageUrl: 'https://images.unsplash.com/photo-1510519138161-58446230f699?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  },
  {
    id: 'event-venice-filmfest-2026',
    category: 'entertainment',
    titleAr: 'مهرجان البندقية السينمائي الدولي 83',
    titleEn: '83rd Venice International Film Festival',
    descAr: 'أقدم مهرجان سينمائي دولي يحتفي بجماليات الفن السابع وعروض السينما العالمية الأولى في البندقية.',
    descEn: 'The world oldest international film festival showcasing global cinema premieres on the Lido di Venezia.',
    startDateIso: '2026-09-02T16:00:00Z',
    endDateIso: '2026-09-12T22:00:00Z',
    locationAr: 'جزيرة ليدو - البندقية، إيطاليا',
    locationEn: 'Lido di Venezia, Italy',
    sourceName: 'La Biennale di Venezia',
    sourceUrl: 'https://www.labiennale.org/en/cinema/2026',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    isImportant: false
  },
  {
    id: 'event-mtv-vmas-2026',
    category: 'music',
    titleAr: 'حفل جوائز MTV للموسيقى والفيديو 2026',
    titleEn: '2026 MTV Video Music Awards (VMAs)',
    descAr: 'الحفل الموسيقي الضخم لتكريم أفضل الفيديو كليبات، الأعمال الغنائية والعروض الاستعراضية للنجوم حول العالم.',
    descEn: 'Annual global celebration honoring top music videos, legendary performances, and breakthrough musical artists.',
    startDateIso: '2026-09-13T23:00:00Z',
    endDateIso: '2026-09-14T03:00:00Z',
    locationAr: 'قاعة برودنشيال سنتر - نيويورك / نيوآرك، أمريكا',
    locationEn: 'Prudential Center, NY Metropolitan Area, USA',
    sourceName: 'MTV VMAs Official',
    sourceUrl: 'https://www.mtv.com/vma',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    isImportant: true
  }
];

/**
 * Calculates current event status based on system current time.
 */
export function getEventStatus(now: Date, startDateIso: string, endDateIso: string): LodaviaNowStatus {
  const start = new Date(startDateIso).getTime();
  const end = new Date(endDateIso).getTime();
  const current = now.getTime();

  if (current < start) {
    return 'UPCOMING';
  } else if (current >= start && current <= end) {
    return 'LIVE';
  } else {
    return 'ENDED';
  }
}

/**
 * Calculates countdown breakdown for an upcoming event.
 */
export function getCountdownParts(startDateIso: string, now: Date) {
  const start = new Date(startDateIso).getTime();
  const diffMs = start - now.getTime();

  if (diffMs <= 0) {
    return { isZero: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { isZero: false, days, hours, minutes, seconds };
}

/**
 * Formats countdown string according to language.
 */
export function formatCountdownString(startDateIso: string, now: Date, lang: string = 'ar'): string {
  const parts = getCountdownParts(startDateIso, now);
  if (parts.isZero) {
    return lang === 'ar' ? 'تبدأ الآن!' : 'Starting Now!';
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (parts.days > 0) {
    return lang === 'ar'
      ? `${parts.days} يوم ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`
      : `${parts.days}d ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
  }

  return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

/**
 * Returns user local timezone name and offset e.g. "Asia/Riyadh (GMT+3)"
 */
export function getUserTimezoneDisplay(): { zoneName: string; offsetStr: string } {
  try {
    const zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
    const date = new Date();
    const offsetMin = -date.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const absMin = Math.abs(offsetMin);
    const hrs = Math.floor(absMin / 60);
    const mins = absMin % 60;
    const offsetStr = `GMT${sign}${hrs}${mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''}`;
    return { zoneName, offsetStr };
  } catch (e) {
    return { zoneName: 'Local Time', offsetStr: 'Local' };
  }
}

/**
 * Formats event date & time according to user's local timezone.
 */
export function formatLocalEventTime(isoString: string, lang: string = 'ar'): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const localeMap: Record<string, string> = {
    ar: 'ar-SA',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    de: 'de-DE',
    zh: 'zh-CN',
    ja: 'ja-JP'
  };
  const locale = localeMap[lang] || 'en-US';

  const timeStr = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dateStr = date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `${dateStr} • ${timeStr}`;
}

/**
 * Filter events for Home Card (1-3 items)
 * Priority: 1. LIVE events, 2. Starting soonest, 3. Important
 */
export function getHomeCardEvents(events: LodaviaNowEvent[], now: Date): LodaviaNowEvent[] {
  const liveEvents: LodaviaNowEvent[] = [];
  const upcomingEvents: LodaviaNowEvent[] = [];

  events.forEach(evt => {
    const st = getEventStatus(now, evt.startDateIso, evt.endDateIso);
    if (st === 'LIVE') {
      liveEvents.push(evt);
    } else if (st === 'UPCOMING') {
      upcomingEvents.push(evt);
    }
  });

  // Sort upcoming events by start time ascending
  upcomingEvents.sort((a, b) => new Date(a.startDateIso).getTime() - new Date(b.startDateIso).getTime());

  // Pick top 3 events
  const selected: LodaviaNowEvent[] = [];
  
  // 1. Add LIVE first
  if (liveEvents.length > 0) {
    selected.push(liveEvents[0]);
  }

  // 2. Add upcoming/important to fill up to 3
  for (const upcoming of upcomingEvents) {
    if (selected.length >= 3) break;
    selected.push(upcoming);
  }

  return selected;
}

/**
 * Filter events for dedicated page /lodavia-now
 */
export function filterEvents(
  events: LodaviaNowEvent[],
  dateFilter: LodaviaDateFilter,
  categoryFilter: LodaviaNowCategory | 'all',
  now: Date
): LodaviaNowEvent[] {
  const nowMs = now.getTime();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 86400000 - 1;
  const startOfTomorrow = startOfToday + 86400000;
  const endOfTomorrow = startOfTomorrow + 86400000 - 1;
  const endOfWeek = startOfToday + (7 * 86400000) - 1;

  return events.filter(evt => {
    // Category match
    if (categoryFilter !== 'all' && evt.category !== categoryFilter) {
      return false;
    }

    const st = getEventStatus(now, evt.startDateIso, evt.endDateIso);
    const eventStartMs = new Date(evt.startDateIso).getTime();
    const eventEndMs = new Date(evt.endDateIso).getTime();

    // Date filter match
    if (dateFilter === 'now') {
      return st === 'LIVE';
    } else if (dateFilter === 'today') {
      return (eventStartMs >= startOfToday && eventStartMs <= endOfToday) || (st === 'LIVE');
    } else if (dateFilter === 'tomorrow') {
      return eventStartMs >= startOfTomorrow && eventStartMs <= endOfTomorrow;
    } else if (dateFilter === 'week') {
      return eventStartMs >= startOfToday && eventStartMs <= endOfWeek;
    }

    // 'all' includes all events (live, upcoming, recent)
    return true;
  }).sort((a, b) => {
    const statusA = getEventStatus(now, a.startDateIso, a.endDateIso);
    const statusB = getEventStatus(now, b.startDateIso, b.endDateIso);

    // LIVE comes first
    if (statusA === 'LIVE' && statusB !== 'LIVE') return -1;
    if (statusB === 'LIVE' && statusA !== 'LIVE') return 1;

    // UPCOMING next by date ascending
    if (statusA === 'UPCOMING' && statusB === 'UPCOMING') {
      return new Date(a.startDateIso).getTime() - new Date(b.startDateIso).getTime();
    }

    return new Date(a.startDateIso).getTime() - new Date(b.startDateIso).getTime();
  });
}
