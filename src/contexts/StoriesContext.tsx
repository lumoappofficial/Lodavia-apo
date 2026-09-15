import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoryItem, UserStoryGroup, StoryPrivacyOption, StoryMediaType } from '../types/story';
import { INITIAL_STORY_GROUPS } from '../data/storiesData';
import { storage } from '../utils/storage';
import { useApp } from './AppContext';
import { notificationService } from '../services/notification.service';
import { playNotificationSound } from '../utils/soundEffects';
import { playSynthSound } from '../utils/synth';

interface CreateStoryParams {
  mediaUrl: string;
  mediaType: StoryMediaType;
  textContent?: string;
  textColor?: string;
  bgColor?: string;
  filter?: string;
  stickers?: any[];
  drawingDataUrl?: string;
  musicTrack?: any;
  privacy: StoryPrivacyOption;
}

interface StoriesContextType {
  storyGroups: UserStoryGroup[];
  activeGroupIndex: number | null;
  activeStoryIndex: number | null;
  isCreatorOpen: boolean;
  isViewersModalOpen: boolean;
  
  openCreator: () => void;
  closeCreator: () => void;
  openViewer: (groupIndex: number, storyIndex?: number) => void;
  closeViewer: () => void;
  openViewersModal: () => void;
  closeViewersModal: () => void;
  
  addStory: (params: CreateStoryParams) => void;
  deleteStory: (storyId: string) => void;
  reactToStory: (storyId: string, emoji: string) => void;
  replyToStory: (storyId: string, text: string) => void;
  markStoryAsViewed: (storyId: string) => void;
  updateStoryPrivacy: (storyId: string, privacy: StoryPrivacyOption) => void;
  
  // Viewer Navigation helpers
  nextStory: () => void;
  prevStory: () => void;
  nextUserGroup: () => void;
  prevUserGroup: () => void;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const StoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();

  const [storyGroups, setStoryGroups] = useState<UserStoryGroup[]>(() => {
    const saved = storage.load<UserStoryGroup[]>('lodavia_stories_data', INITIAL_STORY_GROUPS);
    // Filter out expired stories (>24h)
    const now = new Date().getTime();
    return saved.map(group => {
      const activeStories = group.stories.filter(s => new Date(s.expiresAt).getTime() > now);
      return {
        ...group,
        stories: activeStories
      };
    }).filter(group => group.stories.length > 0 || group.userId === 'me');
  });

  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isViewersModalOpen, setIsViewersModalOpen] = useState(false);

  // Save to storage on update
  useEffect(() => {
    storage.save('lodavia_stories_data', storyGroups);
  }, [storyGroups]);

  const openCreator = () => {
    playSynthSound(600, 'sine', 0.08);
    setIsCreatorOpen(true);
  };

  const closeCreator = () => {
    setIsCreatorOpen(false);
  };

  const openViewer = (groupIndex: number, storyIndex: number = 0) => {
    if (groupIndex < 0 || groupIndex >= storyGroups.length) return;
    playSynthSound(700, 'triangle', 0.06);
    setActiveGroupIndex(groupIndex);
    setActiveStoryIndex(storyIndex);

    // Mark current story as viewed
    const group = storyGroups[groupIndex];
    if (group && group.stories[storyIndex]) {
      markStoryAsViewed(group.stories[storyIndex].id);
    }
  };

  const closeViewer = () => {
    setActiveGroupIndex(null);
    setActiveStoryIndex(null);
    setIsViewersModalOpen(false);
  };

  const openViewersModal = () => setIsViewersModalOpen(true);
  const closeViewersModal = () => setIsViewersModalOpen(false);

  const addStory = (params: CreateStoryParams) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const newStory: StoryItem = {
      id: `story_me_${Date.now()}`,
      ownerId: currentUser?.id || 'me',
      ownerName: currentUser?.name || 'أنت (عضو لودافيا)',
      ownerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      ownerIsVerified: true,
      mediaUrl: params.mediaUrl,
      mediaType: params.mediaType,
      textContent: params.textContent,
      textColor: params.textColor || '#FFFFFF',
      bgColor: params.bgColor,
      filter: params.filter,
      stickers: params.stickers,
      drawingDataUrl: params.drawingDataUrl,
      musicTrack: params.musicTrack,
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      privacy: params.privacy,
      viewers: [],
      reactions: [],
      replies: []
    };

    setStoryGroups(prev => {
      const myGroupIndex = prev.findIndex(g => g.userId === (currentUser?.id || 'me'));
      if (myGroupIndex >= 0) {
        const updatedGroups = [...prev];
        updatedGroups[myGroupIndex] = {
          ...updatedGroups[myGroupIndex],
          stories: [newStory, ...updatedGroups[myGroupIndex].stories]
        };
        return updatedGroups;
      } else {
        const myGroup: UserStoryGroup = {
          userId: currentUser?.id || 'me',
          userName: currentUser?.name || 'أنت (عضو لودافيا)',
          userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          isVerified: true,
          hasUnread: false,
          stories: [newStory]
        };
        return [myGroup, ...prev];
      }
    });

    closeCreator();
    playNotificationSound();
  };

  const deleteStory = (storyId: string) => {
    setStoryGroups(prev => prev.map(group => ({
      ...group,
      stories: group.stories.filter(s => s.id !== storyId)
    })).filter(group => group.stories.length > 0 || group.userId === 'me'));

    closeViewer();
    playSynthSound(250, 'sawtooth', 0.1);
  };

  const markStoryAsViewed = (storyId: string) => {
    const viewerId = currentUser?.id || 'me';
    const viewerName = currentUser?.name || 'أنت (عضو لودافيا)';
    const viewerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

    setStoryGroups(prev => prev.map(group => {
      let groupHasUnread = false;
      const updatedStories = group.stories.map(story => {
        if (story.id === storyId) {
          const alreadyViewed = story.viewers.some(v => v.userId === viewerId);
          if (!alreadyViewed) {
            const newViewer = {
              userId: viewerId,
              userName: viewerName,
              userAvatar: viewerAvatar,
              viewedAt: 'الآن'
            };
            return {
              ...story,
              viewers: [...story.viewers, newViewer]
            };
          }
        }
        
        // Check if story is viewed by 'me'
        if (!story.viewers.some(v => v.userId === viewerId)) {
          groupHasUnread = true;
        }
        return story;
      });

      return {
        ...group,
        stories: updatedStories,
        hasUnread: groupHasUnread
      };
    }));
  };

  const reactToStory = (storyId: string, emoji: string) => {
    const userId = currentUser?.id || 'me';
    const userName = currentUser?.name || 'أنت (عضو لودافيا)';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

    let storyOwnerId = '';
    let storyOwnerName = '';

    setStoryGroups(prev => prev.map(group => {
      const updatedStories = group.stories.map(story => {
        if (story.id === storyId) {
          storyOwnerId = story.ownerId;
          storyOwnerName = story.ownerName;
          const newReaction = {
            id: `react_${Date.now()}`,
            userId,
            userName,
            userAvatar,
            emoji,
            timestamp: 'الآن'
          };
          return {
            ...story,
            reactions: [...story.reactions.filter(r => r.userId !== userId), newReaction]
          };
        }
        return story;
      });
      return { ...group, stories: updatedStories };
    }));

    playSynthSound(880, 'sine', 0.1);

    // Trigger Notification for story owner
    if (storyOwnerId && storyOwnerId !== 'me') {
      notificationService.addNotification({
        id: `notif_story_react_${Date.now()}`,
        title: `${userName} تفاعل مع قصتك ${emoji}`,
        body: `تفاعل مع قصتك اليومية بالتعبير ${emoji}`,
        type: 'social',
        timestamp: new Date().toISOString(),
        read: false,
        userId: storyOwnerId
      });
    }
  };

  const replyToStory = (storyId: string, text: string) => {
    if (!text.trim()) return;

    const userId = currentUser?.id || 'me';
    const userName = currentUser?.name || 'أنت (عضو لودافيا)';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

    let storyOwnerId = '';
    let storyOwnerName = '';

    setStoryGroups(prev => prev.map(group => {
      const updatedStories = group.stories.map(story => {
        if (story.id === storyId) {
          storyOwnerId = story.ownerId;
          storyOwnerName = story.ownerName;
          const newReply = {
            id: `reply_${Date.now()}`,
            userId,
            userName,
            userAvatar,
            text,
            timestamp: 'الآن'
          };
          return {
            ...story,
            replies: [...story.replies, newReply]
          };
        }
        return story;
      });
      return { ...group, stories: updatedStories };
    }));

    playSynthSound(900, 'sine', 0.08);

    // Notification for story owner
    if (storyOwnerId && storyOwnerId !== 'me') {
      notificationService.addNotification({
        id: `notif_story_reply_${Date.now()}`,
        title: `${userName} ردّ على قصتك 💬`,
        body: `"${text}"`,
        type: 'social',
        timestamp: new Date().toISOString(),
        read: false,
        userId: storyOwnerId
      });
    }
  };

  const updateStoryPrivacy = (storyId: string, privacy: StoryPrivacyOption) => {
    setStoryGroups(prev => prev.map(group => ({
      ...group,
      stories: group.stories.map(s => s.id === storyId ? { ...s, privacy } : s)
    })));
  };

  // Viewer navigation
  const nextStory = () => {
    if (activeGroupIndex === null || activeStoryIndex === null) return;
    const currentGroup = storyGroups[activeGroupIndex];

    if (currentGroup && activeStoryIndex < currentGroup.stories.length - 1) {
      const nextIndex = activeStoryIndex + 1;
      setActiveStoryIndex(nextIndex);
      markStoryAsViewed(currentGroup.stories[nextIndex].id);
    } else {
      nextUserGroup();
    }
  };

  const prevStory = () => {
    if (activeGroupIndex === null || activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      const prevIndex = activeStoryIndex - 1;
      setActiveStoryIndex(prevIndex);
      const currentGroup = storyGroups[activeGroupIndex];
      if (currentGroup?.stories[prevIndex]) {
        markStoryAsViewed(currentGroup.stories[prevIndex].id);
      }
    } else {
      prevUserGroup();
    }
  };

  const nextUserGroup = () => {
    if (activeGroupIndex === null) return;
    if (activeGroupIndex < storyGroups.length - 1) {
      const nextG = activeGroupIndex + 1;
      setActiveGroupIndex(nextG);
      setActiveStoryIndex(0);
      const group = storyGroups[nextG];
      if (group?.stories[0]) {
        markStoryAsViewed(group.stories[0].id);
      }
    } else {
      closeViewer();
    }
  };

  const prevUserGroup = () => {
    if (activeGroupIndex === null) return;
    if (activeGroupIndex > 0) {
      const prevG = activeGroupIndex - 1;
      setActiveGroupIndex(prevG);
      setActiveStoryIndex(0);
      const group = storyGroups[prevG];
      if (group?.stories[0]) {
        markStoryAsViewed(group.stories[0].id);
      }
    } else {
      closeViewer();
    }
  };

  return (
    <StoriesContext.Provider value={{
      storyGroups,
      activeGroupIndex,
      activeStoryIndex,
      isCreatorOpen,
      isViewersModalOpen,
      openCreator,
      closeCreator,
      openViewer,
      closeViewer,
      openViewersModal,
      closeViewersModal,
      addStory,
      deleteStory,
      reactToStory,
      replyToStory,
      markStoryAsViewed,
      updateStoryPrivacy,
      nextStory,
      prevStory,
      nextUserGroup,
      prevUserGroup
    }}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};
