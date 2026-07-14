import { useApp } from '../contexts/AppContext';
import { communityService } from '../services/community.service';
import { VoiceRoom } from '../types';

export function useVoiceRooms() {
  const { playSynthSound } = useApp();

  return {
    playSynthSound,
    createVoiceRoom: async (room: VoiceRoom): Promise<void> => {
      await communityService.createVoiceRoom(room);
    },
    subscribeVoiceRooms: (callback: (rooms: VoiceRoom[]) => void) => {
      return communityService.getVoiceRooms(callback);
    }
  };
}
