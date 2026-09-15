import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove, 
  increment 
} from 'firebase/firestore';
import { CommunityItem, VoiceRoom } from '../types';
import { allCommunities } from '../data';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export const communityService = {
  getCommunities: async (): Promise<CommunityItem[]> => {
    if (isFirebaseConfigured && db) {
      const collPath = 'communities';
      try {
        const snap = await getDocs(collection(db, collPath));
        if (snap.empty) {
          // Initialize DB with seed data
          for (const comm of allCommunities) {
            await setDoc(doc(db, collPath, comm.id), comm);
          }
          return allCommunities;
        }
        return snap.docs.map(d => d.data()) as CommunityItem[];
      } catch (err) {
        console.warn("Firestore error getting communities, loading local fallback:", err);
        return storage.load<CommunityItem[]>('lumo_communities', allCommunities);
      }
    } else {
      return storage.load<CommunityItem[]>('lumo_communities', allCommunities);
    }
  },

  joinCommunity: async (communityId: string, userId: string, isJoined: boolean): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const userPath = `users/${userId}`;
      const communityPath = `communities/${communityId}`;
      try {
        const userRef = doc(db, 'users', userId);
        const communityRef = doc(db, 'communities', communityId);
        
        await updateDoc(userRef, {
          joinedCommunities: isJoined ? arrayRemove(communityId) : arrayUnion(communityId)
        });
        await updateDoc(communityRef, {
          membersCount: increment(isJoined ? -1 : 1)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `${userPath} or ${communityPath}`);
      }
    } else {
      const users = storage.load<Record<string, any>>('lumo_users', {});
      const communities = storage.load<CommunityItem[]>('lumo_communities', allCommunities);
      
      if (users[userId]) {
        if (isJoined) {
          users[userId].joinedCommunities = users[userId].joinedCommunities.filter((id: string) => id !== communityId);
        } else {
          if (!users[userId].joinedCommunities.includes(communityId)) {
            users[userId].joinedCommunities.push(communityId);
          }
        }
        storage.save('lumo_users', users);
      }
      
      const commIdx = communities.findIndex((c: any) => c.id === communityId);
      if (commIdx !== -1) {
        communities[commIdx].membersCount += isJoined ? -1 : 1;
        storage.save('lumo_communities', communities);
      }
    }
  },

  getVoiceRooms: (callback: (rooms: VoiceRoom[]) => void) => {
    if (isFirebaseConfigured && db) {
      const collPath = 'voice_rooms';
      return onSnapshot(
        collection(db, collPath), 
        (snap) => {
          const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() })) as VoiceRoom[];
          callback(rooms);
        },
        (error) => {
          console.warn("Firestore error fetching voice rooms, using local fallback:", error);
          const defaultRooms: VoiceRoom[] = [
            {
              id: 'voice_prog_1',
              title: 'جلسة كود ونقاش حول لغات المستقبل 🛠️',
              hostName: 'صالح العمري',
              hostAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
              listenersCount: 142,
              speakersCount: 5,
              tags: ['React', 'TypeScript', 'Rust']
            }
          ];
          const rooms = storage.load<VoiceRoom[]>('lumo_voice_rooms', defaultRooms);
          callback(rooms);
        }
      );
    } else {
      const rooms = [
        {
          id: 'voice_prog_1',
          title: 'جلسة كود ونقاش حول لغات المستقبل 🛠️',
          hostName: 'صالح العمري',
          hostAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
          listenersCount: 142,
          speakersCount: 5,
          tags: ['React', 'TypeScript', 'Rust']
        }
      ];
      callback(rooms);
      return () => {};
    }
  },

  createVoiceRoom: async (room: VoiceRoom): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `voice_rooms/${room.id}`;
      try {
        await setDoc(doc(db, 'voice_rooms', room.id), room);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      // Dynamic local simulation
      const rooms = storage.load<VoiceRoom[]>('lumo_voice_rooms', []);
      rooms.push(room);
      storage.save('lumo_voice_rooms', rooms);
    }
  }
};
