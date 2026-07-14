import { useApp } from '../contexts/AppContext';
import { communityService } from '../services/community.service';
import { CommunityItem } from '../types';

export function useCommunities() {
  const {
    communities,
    setCommunities,
    activeCommunity,
    setActiveCommunity
  } = useApp();

  return {
    communities,
    setCommunities,
    activeCommunity,
    setActiveCommunity,
    joinCommunity: async (communityId: string, userId: string, isJoined: boolean): Promise<void> => {
      await communityService.joinCommunity(communityId, userId, isJoined);
      setCommunities(prev => prev.map(c => {
        if (c.id === communityId) {
          return { ...c, membersCount: c.membersCount + (isJoined ? -1 : 1) };
        }
        return c;
      }));
    },
    fetchCommunities: async (): Promise<CommunityItem[]> => {
      const comms = await communityService.getCommunities();
      setCommunities(comms);
      return comms;
    }
  };
}
