export type LodaviaNowCategory =
  | 'space'
  | 'world'
  | 'sports'
  | 'science'
  | 'technology'
  | 'gaming'
  | 'entertainment'
  | 'music';

export type LodaviaNowStatus = 'UPCOMING' | 'LIVE' | 'ENDED';

export interface LodaviaNowEvent {
  id: string;
  category: LodaviaNowCategory;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  startDateIso: string; // ISO 8601 string in UTC e.g. "2026-08-12T15:30:00Z"
  endDateIso: string;   // ISO 8601 string in UTC e.g. "2026-08-12T18:30:00Z"
  locationAr: string;
  locationEn: string;
  sourceName: string;   // Official/public source name
  sourceUrl: string;    // Official source link
  imageUrl?: string;
  isImportant?: boolean;
}

export type LodaviaDateFilter = 'all' | 'now' | 'today' | 'tomorrow' | 'week';

export interface EventReminderSetting {
  eventId: string;
  minutesBefore: number; // e.g. 5, 15, 30, 60, 1440
  createdAt: string;
}
