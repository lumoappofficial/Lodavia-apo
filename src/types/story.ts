export type StoryMediaType = 'image' | 'video' | 'text';

export type StoryPrivacyOption = 'everyone' | 'friends' | 'close_friends' | 'selected';

export interface StorySticker {
  id: string;
  emojiOrIcon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale?: number;
  rotation?: number;
}

export interface StoryMusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
}

export interface StoryViewerInfo {
  userId: string;
  userName: string;
  userAvatar: string;
  viewedAt: string; // ISO date string or formatted time
}

export interface StoryReactionInfo {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  emoji: string;
  timestamp: string;
}

export interface StoryReplyInfo {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface StoryItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerIsVerified?: boolean;
  mediaUrl: string;
  mediaType: StoryMediaType;
  textContent?: string;
  textColor?: string;
  bgColor?: string; // background gradient or hex for text stories
  filter?: string; // CSS filter string e.g. 'contrast(1.1) brightness(1.1)'
  stickers?: StorySticker[];
  drawingDataUrl?: string; // base64 canvas drawing overlay
  musicTrack?: StoryMusicTrack;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (24 hours after creation)
  privacy: StoryPrivacyOption;
  viewers: StoryViewerInfo[];
  reactions: StoryReactionInfo[];
  replies: StoryReplyInfo[];
}

export interface UserStoryGroup {
  userId: string;
  userName: string;
  userAvatar: string;
  isVerified?: boolean;
  hasUnread: boolean;
  stories: StoryItem[];
}
