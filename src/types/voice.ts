export interface VoiceUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  bioAr: string;
  badges: string[];
  badgesAr: string[];
  isHost: boolean;
  isSpeaker: boolean;
  isMuted: boolean;
  handRaised: boolean;
  isOnline: boolean;
  isSpeaking?: boolean; // dynamic speaking wave indicator
}

export interface ScheduledRoom {
  id: string;
  title: string;
  titleAr: string;
  hostName: string;
  hostAvatar: string;
  time: string;
  timeAr: string;
  date: string;
  category: string;
  categoryAr: string;
  reminded: boolean;
}

export interface VoiceRoomItem {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  coverImage: string;
  hostName: string;
  hostAvatar: string;
  hostBio: string;
  hostBioAr: string;
  listenersCount: number;
  speakersCount: number;
  language: string;
  languageAr: string;
  communityName: string;
  communityNameAr: string;
  participants: VoiceUser[];
  isLocked?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  tagline?: string;
  taglineAr?: string;
  pinnedMessage: {
    text: string;
    textAr: string;
    author: string;
  } | null;
  announcement: {
    text: string;
    textAr: string;
  } | null;
}
