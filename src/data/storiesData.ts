import { UserStoryGroup, StoryItem } from '../types/story';
import { AUDIO_ITEMS } from './audioData';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
const expiresHoursInFuture = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();

export const INITIAL_STORY_GROUPS: UserStoryGroup[] = [
  {
    userId: 'user_sarah',
    userName: 'سارة خالد',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: true,
    stories: [
      {
        id: 'story_sarah_1',
        ownerId: 'user_sarah',
        ownerName: 'سارة خالد',
        ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        ownerIsVerified: true,
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        textContent: 'صباح الخير من شاطئ البحر الأحمر 🌊✨',
        textColor: '#FFFFFF',
        musicTrack: {
          id: AUDIO_ITEMS[0].id,
          title: AUDIO_ITEMS[0].titleAr,
          artist: AUDIO_ITEMS[0].artistAr,
          audioUrl: AUDIO_ITEMS[0].audioUrl,
          coverUrl: AUDIO_ITEMS[0].coverUrl
        },
        createdAt: hoursAgo(2),
        expiresAt: expiresHoursInFuture(22),
        privacy: 'everyone',
        stickers: [
          { id: 'st_1', emojiOrIcon: '🌊', x: 20, y: 30, scale: 1.2 },
          { id: 'st_2', emojiOrIcon: '✨', x: 80, y: 25, scale: 1.1 }
        ],
        viewers: [
          { userId: 'user_youssef', userName: 'يوسف العتيبي', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', viewedAt: 'منذ ساعة' },
          { userId: 'user_layla', userName: 'ليلى الأحمد', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', viewedAt: 'منذ ٣٠ دقيقة' },
          { userId: 'me', userName: 'أنت (عضو لودافيا)', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80', viewedAt: 'الآن' }
        ],
        reactions: [
          { id: 'react_1', userId: 'user_youssef', userName: 'يوسف العتيبي', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', emoji: '❤️', timestamp: 'منذ ساعة' },
          { id: 'react_2', userId: 'user_layla', userName: 'ليلى الأحمد', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', emoji: '🔥', timestamp: 'منذ ٣٠ دقيقة' }
        ],
        replies: [
          { id: 'reply_1', userId: 'user_layla', userName: 'ليلى الأحمد', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', text: 'أجواء ساحرة جداً! 😍', timestamp: 'منذ ٢٠ دقيقة' }
        ]
      },
      {
        id: 'story_sarah_2',
        ownerId: 'user_sarah',
        ownerName: 'سارة خالد',
        ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        ownerIsVerified: true,
        mediaUrl: '',
        mediaType: 'text',
        textContent: 'جلسة برمجة وتطوير لمشروع لودافيا الكوني 🚀💻 ما رأيكم في الميزات الجديدة؟',
        bgColor: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #7e22ce 100%)',
        textColor: '#FFFFFF',
        createdAt: hoursAgo(1),
        expiresAt: expiresHoursInFuture(23),
        privacy: 'everyone',
        viewers: [
          { userId: 'user_youssef', userName: 'يوسف العتيبي', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', viewedAt: 'منذ ٤٥ دقيقة' }
        ],
        reactions: [
          { id: 'react_3', userId: 'user_youssef', userName: 'يوسف العتيبي', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', emoji: '👏', timestamp: 'منذ ٤٠ دقيقة' }
        ],
        replies: []
      }
    ]
  },
  {
    userId: 'user_youssef',
    userName: 'يوسف العتيبي',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: true,
    stories: [
      {
        id: 'story_youssef_1',
        ownerId: 'user_youssef',
        ownerName: 'يوسف العتيبي',
        ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        ownerIsVerified: true,
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        textContent: 'استكشاف الترددات الكمومية والمجرات الفضائية 🌌⚡',
        textColor: '#E0F2FE',
        musicTrack: {
          id: AUDIO_ITEMS[1].id,
          title: AUDIO_ITEMS[1].titleAr,
          artist: AUDIO_ITEMS[1].artistAr,
          audioUrl: AUDIO_ITEMS[1].audioUrl,
          coverUrl: AUDIO_ITEMS[1].coverUrl
        },
        createdAt: hoursAgo(4),
        expiresAt: expiresHoursInFuture(20),
        privacy: 'everyone',
        stickers: [
          { id: 'st_y1', emojiOrIcon: '🚀', x: 50, y: 70, scale: 1.3 }
        ],
        viewers: [
          { userId: 'user_sarah', userName: 'سارة خالد', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', viewedAt: 'منذ ساعتين' }
        ],
        reactions: [],
        replies: []
      }
    ]
  },
  {
    userId: 'user_layla',
    userName: 'ليلى الأحمد',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    isVerified: false,
    hasUnread: true,
    stories: [
      {
        id: 'story_layla_1',
        ownerId: 'user_layla',
        ownerName: 'ليلى الأحمد',
        ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        ownerIsVerified: false,
        mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        textContent: 'الاستماع لأحدث معزوفات لودافيا الموسيقية 🎵🎧',
        textColor: '#FFFFFF',
        musicTrack: {
          id: AUDIO_ITEMS[2].id,
          title: AUDIO_ITEMS[2].titleAr,
          artist: AUDIO_ITEMS[2].artistAr,
          audioUrl: AUDIO_ITEMS[2].audioUrl,
          coverUrl: AUDIO_ITEMS[2].coverUrl
        },
        createdAt: hoursAgo(5),
        expiresAt: expiresHoursInFuture(19),
        privacy: 'friends',
        viewers: [],
        reactions: [],
        replies: []
      }
    ]
  },
  {
    userId: 'user_khalid',
    userName: 'خالد النمر',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    hasUnread: false,
    stories: [
      {
        id: 'story_khalid_1',
        ownerId: 'user_khalid',
        ownerName: 'خالد النمر',
        ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        ownerIsVerified: true,
        mediaUrl: '',
        mediaType: 'text',
        textContent: 'تحدي البرمجة اليومي بدأ في مجتمع لودافيا! من مستعد للتحليق معنا؟ 🏆🔥',
        bgColor: 'linear-gradient(135deg, #18181b 0%, #b45309 100%)',
        textColor: '#FFFFFF',
        createdAt: hoursAgo(12),
        expiresAt: expiresHoursInFuture(12),
        privacy: 'everyone',
        viewers: [
          { userId: 'me', userName: 'أنت (عضو لودافيا)', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80', viewedAt: 'منذ ساعتين' }
        ],
        reactions: [
          { id: 'react_k1', userId: 'me', userName: 'أنت (عضو لودافيا)', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80', emoji: '🔥', timestamp: 'منذ ساعتين' }
        ],
        replies: []
      }
    ]
  }
];
