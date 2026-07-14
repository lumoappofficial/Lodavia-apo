import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  arrayUnion, 
  increment 
} from 'firebase/firestore';
import { ChatConversation, ChatMessage } from '../types';
import { initialChats } from '../data';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export const chatService = {
  getConversations: (userId: string, callback: (chats: ChatConversation[]) => void) => {
    if (isFirebaseConfigured && db) {
      const collPath = 'chats';
      const q = query(collection(db, collPath), where('userId', '==', userId));
      
      return onSnapshot(
        q,
        (snap) => {
          const chats = snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as ChatConversation[];
          callback(chats);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, collPath);
        }
      );
    } else {
      const chats = storage.load<ChatConversation[]>('lumo_chats', initialChats);
      callback(chats);
      return () => {};
    }
  },

  sendMessage: async (chatId: string, message: ChatMessage): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `chats/${chatId}`;
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          messages: arrayUnion(message),
          unreadCount: increment(1)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const chats = storage.load<ChatConversation[]>('lumo_chats', initialChats);
      const chatIdx = chats.findIndex((c: any) => c.id === chatId);
      if (chatIdx !== -1) {
        chats[chatIdx].messages.push(message);
        chats[chatIdx].unreadCount += 1;
        storage.save('lumo_chats', chats);
      }
    }
  },

  updateChatMessages: async (chatId: string, messages: ChatMessage[]): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `chats/${chatId}`;
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, { messages });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const chats = storage.load<ChatConversation[]>('lumo_chats', initialChats);
      const chatIdx = chats.findIndex((c: any) => c.id === chatId);
      if (chatIdx !== -1) {
        chats[chatIdx].messages = messages;
        storage.save('lumo_chats', chats);
      }
    }
  },

  setTypingState: async (chatId: string, isTyping: boolean): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `chats/${chatId}`;
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, { isTyping });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const chats = storage.load<ChatConversation[]>('lumo_chats', initialChats);
      const chatIdx = chats.findIndex((c: any) => c.id === chatId);
      if (chatIdx !== -1) {
        chats[chatIdx].isTyping = isTyping;
        storage.save('lumo_chats', chats);
      }
    }
  },

  setUnreadCount: async (chatId: string, count: number): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `chats/${chatId}`;
      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, { unreadCount: count });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const chats = storage.load<ChatConversation[]>('lumo_chats', initialChats);
      const chatIdx = chats.findIndex((c: any) => c.id === chatId);
      if (chatIdx !== -1) {
        chats[chatIdx].unreadCount = count;
        storage.save('lumo_chats', chats);
      }
    }
  }
};
