import { authService } from '../services/auth.service';
import { postService } from '../services/post.service';
import { chatService } from '../services/chat.service';
import { communityService } from '../services/community.service';
import { notificationService } from '../services/notification.service';
import { aiService } from '../services/ai.service';
import { storageService } from '../services/storage.service';
import { factService } from '../services/fact.service';
import { db, isFirebaseConfigured } from './config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { storage as storageUtil } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';
import { AppUser } from '../types';

export { authService, storageService, factService };

// Group the firestore-related actions under the original firestoreService namespace for backward-compatibility.
export const firestoreService = {
  // Update Profile Info
  updateProfile: async (userId: string, data: Partial<AppUser>): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `users/${userId}`;
      try {
        await updateDoc(doc(db, 'users', userId), data);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const users = storageUtil.load<Record<string, AppUser>>('lumo_users', {});
      if (users[userId]) {
        users[userId] = { ...users[userId], ...data };
        storageUtil.save('lumo_users', users);
      }
    }
  },

  // Wallet points handling
  addPoints: async (userId: string, points: number): Promise<number> => {
    if (isFirebaseConfigured && db) {
      const path = `users/${userId}`;
      try {
        const userRef = doc(db, 'users', userId);
        const currentUserDoc = await getDoc(userRef);
        const currentPoints = currentUserDoc.data()?.points || 0;
        const newPoints = currentPoints + points;
        await updateDoc(userRef, { points: newPoints });
        return newPoints;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const users = storageUtil.load<Record<string, AppUser>>('lumo_users', {});
      if (users[userId]) {
        users[userId].points += points;
        storageUtil.save('lumo_users', users);
        return users[userId].points;
      }
      return 0;
    }
  },

  // Posts Feed Management
  getPosts: postService.getPosts,
  createPost: postService.createPost,
  likePost: postService.likePost,
  addComment: postService.addComment,

  // Communities Management
  getCommunities: communityService.getCommunities,
  joinCommunity: communityService.joinCommunity,

  // Real-time Live Chats
  getConversations: chatService.getConversations,
  sendMessage: chatService.sendMessage,

  // Real-time Voice Rooms & Participants
  getVoiceRooms: communityService.getVoiceRooms,
  createVoiceRoom: communityService.createVoiceRoom,

  // AI Assistant History logging
  logAIQuery: aiService.logAIQuery
};
