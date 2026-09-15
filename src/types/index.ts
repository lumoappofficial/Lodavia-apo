import { UserSubscription } from './subscription';
import { EquippedCosmetics } from './cosmicPacks';

export * from './i18n';
export * from './subscription';
export * from './projectJury';
export * from './call';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  coverImage: string;
  bio: string;
  country: string;
  language: string;
  interests: string[];
  hobbies?: string[];
  achievements: Array<{ id: string; title: string; description: string; icon: string }>;
  joinedCommunities: string[]; // Community IDs
  enrolledCourses: string[]; // Course IDs
  followersCount: number;
  followingCount: number;
  points: number; // For watching ads & in-app purchases
  shards?: number; // Cosmic Shards currency
  inventory?: string[]; // Owned cosmetic item IDs
  equippedCosmetics?: EquippedCosmetics; // Equipped frame, bg, title, etc.
  favoriteCosmetics?: string[]; // Favorite item IDs
  newCosmetics?: string[]; // Unseen new item IDs
  lastDailyRewardClaim?: string | null; // Last daily reward timestamp
  purchasedItems: string[]; // IDs of items purchased
  isPremium?: boolean;
  socialLinks?: { platform: string; label: string; url: string }[];
  subscription?: UserSubscription;
  journeyStats?: { learning: number; helping: number; creating: number; gaming: number; community: number };
  emailVerified?: boolean;
  isAnonymous?: boolean;
  role?: 'user' | 'moderator' | 'admin';
}

export interface VoiceRoom {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  listenersCount: number;
  speakersCount: number;
  tags: string[];
}

export interface VideoRoom {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  participantsCount: number;
  tags: string[];
}

export interface LiveStream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  viewerCount: number;
  category: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTitle?: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  likedByMe?: boolean;
  sharesCount?: number;
  sharedByMe?: boolean;
  savedByMe?: boolean;
  comments?: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
  }>;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  coverImage: string;
  studentsCount: number;
}

export interface EventItem {
  id: string;
  title: string;
  time: string;
  date: string;
  organizer: string;
  regularPrice?: number;
  attendeesCount: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio';
  mediaUrl?: string;
  duration?: string; // For audio messages
  fileName?: string; // For files
  fileSize?: string;
  timestamp: string;
  fullDate?: string; // Full hoverable datetime
  replyToId?: string;
  replyToText?: string;
  replyToSenderId?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> senderIds
  isEdited?: boolean;
  isDeleted?: boolean;
  status?: 'sending' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  contactName: string;
  contactAvatar: string;
  isOnline: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  isVerified?: boolean;
  isTyping?: boolean;
  lastSeen?: string;
  isPinned?: boolean;
  pinned?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
  blockedAt?: string;
  category?: 'direct' | 'group' | 'channel' | 'archived';
  badge?: string;
}

export interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Emoji or Lucide name
  banner: string;
  category: string; // e.g. Programming, AI, Swimming, etc.
  membersCount: number;
  posts: Post[];
  activeVoiceRooms: VoiceRoom[];
  activeVideoRooms: VideoRoom[];
  activeStreams: LiveStream[];
  courses: Course[];
  admins: Array<{ name: string; avatar: string }>;
}

export interface FeedPostType {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  time: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'ai';
  imageUrl?: string;
  videoUrl?: string;
  videoPlaying?: boolean;
  poll?: {
    question: string;
    options: Array<{ id: string; text: string; votes: number }>;
    votedOptionId?: string;
    totalVotes: number;
  };
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isReported?: boolean;
  category: 'general' | 'trending' | 'suggested' | 'ai' | 'polls';
}

export interface FactComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Fact {
  id: string;
  date: string;
  textAr: string;
  textEn: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  likesCount: number;
  commentsCount: number;
  usefulCount: number;
  notUsefulCount: number;
  likesBy?: string[];
  savedBy?: string[];
  usefulBy?: string[];
  notUsefulBy?: string[];
  comments?: FactComment[];
}

export * from './lodaviaNow';
