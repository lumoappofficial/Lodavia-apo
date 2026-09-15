export type AudioCategory = 
  | 'music' 
  | 'podcasts' 
  | 'stories'
  | 'audiobooks' 
  | 'ambient' 
  | 'recorded_rooms' 
  | 'study' 
  | 'sleep' 
  | 'meditation' 
  | 'nature' 
  | 'gaming' 
  | 'productivity';

export type AudioQuality = 'standard' | 'high' | 'lossless';

export interface AudiobookChapter {
  id: string;
  title: string;
  titleAr?: string;
  duration: number; // in seconds
  audioUrl?: string;
}

export interface PodcastEpisodeItem {
  id: string;
  podcastId?: string;
  podcastTitle?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  publishedDate?: string;
  releaseDate?: string;
  duration: number;
  audioUrl: string;
  episodeNumber?: number;
  seasonNumber?: number;
  isPremium?: boolean;
  tier?: 'free' | 'premium';
  coverUrl?: string;
  creatorName?: string;
  category?: string;
  progressSeconds?: number;
  playsCount?: number;
  tags?: string[];
}

export interface PodcastEpisode extends PodcastEpisodeItem {}

export interface UserPodcast {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  coverUrl: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorHandle: string;
  category: string;
  categoryAr?: string;
  episodes: PodcastEpisodeItem[];
  isPublished: boolean;
  isVerifiedCreator?: boolean;
  subscribersCount: number;
}

export interface LodaviaStoryChapter {
  id: string;
  title: string;
  titleAr: string;
  time?: number;
  text?: string;
  textAr?: string;
  textSyncEn?: string;
  textSyncAr?: string;
  duration?: number;
  audioUrl?: string;
}

export interface LodaviaStory {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  narrator: 'Ray' | 'Laika' | 'Albert' | 'Lodavia Sound Studio';
  narratorName?: string;
  narratorNameAr?: string;
  narratorAvatar?: string;
  narratorRoleAr: string;
  narratorRoleEn: string;
  narratorIntroEn: string;
  narratorIntroAr: string;
  historicalFact: string;
  historicalFactAr: string;
  sources: { title: string; institution: string; year?: string; link?: string }[];
  historicalCitations?: { sourceName: string; year?: string; details: string; detailsAr?: string }[];
  category: 'Space History' | 'Astronaut Stories' | 'Science & Cosmos' | 'Pioneering Animals' | 'Great Inventions' | 'Mysteries of Physics';
  categoryAr: string;
  duration: number;
  totalDuration?: number;
  coverUrl: string;
  audioUrl: string;
  chapters: LodaviaStoryChapter[];
  isVerifiedTrueStory: boolean;
  playsCount: number;
  totalPlays?: number;
  likesCount: number;
}

export interface LocalUserTrack {
  id: string;
  title: string;
  artist: string;
  fileName: string;
  fileSize?: string;
  audioUrl: string;
  duration: number;
  coverUrl: string;
  addedAt: string;
  isLocal: true;
}

export interface AudioItem {
  id: string;
  title: string;
  titleAr: string;
  artist: string;
  artistAr: string;
  category: AudioCategory;
  categoryLabelAr: string;
  categoryLabelEn: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  album?: string;
  genre?: string;
  mood?: string;
  releaseYear?: string;
  playsCount: number;
  likesCount: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
  isCopyrightClean: boolean; // Licensed / Royalty Free / CC / Official Partnership
  copyrightType: 'Licensed' | 'Royalty-Free' | 'Creative-Commons' | 'Creator-Original' | 'Official-Partnership';
  lyrics?: { time: number; text: string; textAr?: string }[];
  
  // Specific type extras
  podcastEpisodes?: PodcastEpisode[];
  audiobookChapters?: AudiobookChapter[];
  audiobookAuthor?: string;
  audiobookNarrator?: string;
  recordedRoomHost?: string;
  recordedRoomDate?: string;
  recordedRoomParticipants?: number;
  ambientPresetId?: string;
}

export interface AmbientSoundChannel {
  id: string;
  name: string;
  nameAr: string;
  icon: string; // emoji or lucide icon name
  volume: number; // 0 to 100
  isActive: boolean;
  soundUrl: string;
  color: string;
}

export interface AudioPlaylist {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  coverUrl: string;
  creatorName: string;
  creatorAvatar: string;
  isVerifiedCreator?: boolean;
  isCollaborative?: boolean;
  likesCount: number;
  tracks: AudioItem[];
  tags: string[];
}

export interface AudioCreator {
  id: string;
  name: string;
  nameAr: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  bioAr: string;
  isVerified: boolean;
  followersCount: number;
  tracksCount: number;
  type: 'Musician' | 'Podcaster' | 'Author' | 'Sound Artist' | 'Voice Host';
}

export interface AIModeRecommendation {
  id: string;
  modeKey: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  accentColor: string;
  suggestedTrackIds: string[];
}
