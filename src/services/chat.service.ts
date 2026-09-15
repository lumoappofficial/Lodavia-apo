import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc,
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

const getLocalChats = (): ChatConversation[] => {
  const lodavia = storage.load<ChatConversation[]>('lodavia_chats', []);
  if (lodavia && Array.isArray(lodavia) && lodavia.length > 0) return lodavia;
  const lumo = storage.load<ChatConversation[]>('lumo_chats', []);
  if (lumo && Array.isArray(lumo) && lumo.length > 0) return lumo;
  // Save initialChats to local storage so they are persisted
  storage.save('lodavia_chats', initialChats);
  storage.save('lumo_chats', initialChats);
  return initialChats;
};

export const chatService = {
  getConversations: (userId: string, callback: (chats: ChatConversation[]) => void) => {
    const fallback = getLocalChats();

    if (isFirebaseConfigured && db) {
      const collPath = 'chats';
      const q = query(collection(db, collPath), where('userId', '==', userId));
      
      return onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const chats = snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as ChatConversation[];
            storage.save('lodavia_chats', chats);
            storage.save('lumo_chats', chats);
            callback(chats);
          } else {
            callback(fallback);
          }
        },
        (error) => {
          console.warn("Firestore error fetching chats, using local fallback:", error);
          callback(fallback);
        }
      );
    } else {
      callback(fallback);
      return () => {};
    }
  },

  sendMessage: async (chatId: string, message: ChatMessage): Promise<void> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    if (chatIdx !== -1) {
      chats[chatIdx].messages.push(message);
      chats[chatIdx].unreadCount += 1;
    } else {
      chats.push({
        id: chatId,
        contactName: 'محادثة جديدة',
        contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        isOnline: true,
        unreadCount: 1,
        messages: [message]
      });
    }
    storage.save('lodavia_chats', chats);
    storage.save('lumo_chats', chats);

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, {
          id: chatId,
          messages: arrayUnion(message),
          unreadCount: increment(1)
        }, { merge: true });
      } catch (error) {
        console.warn("Firestore sendMessage fallback active:", error);
      }
    }
  },

  updateChatMessages: async (chatId: string, messages: ChatMessage[]): Promise<void> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    if (chatIdx !== -1) {
      chats[chatIdx].messages = messages;
    } else {
      chats.push({
        id: chatId,
        contactName: 'محادثة جديدة',
        contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        isOnline: true,
        unreadCount: 0,
        messages: messages
      });
    }
    storage.save('lodavia_chats', chats);
    storage.save('lumo_chats', chats);

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { id: chatId, messages }, { merge: true });
      } catch (error) {
        console.warn("Firestore updateChatMessages fallback active:", error);
      }
    }
  },

  setTypingState: async (chatId: string, isTyping: boolean): Promise<void> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    if (chatIdx !== -1) {
      chats[chatIdx].isTyping = isTyping;
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
    }

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { isTyping }, { merge: true });
      } catch (error) {
        console.warn("Firestore setTypingState fallback active:", error);
      }
    }
  },

  setUnreadCount: async (chatId: string, count: number): Promise<void> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    if (chatIdx !== -1) {
      chats[chatIdx].unreadCount = count;
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
    }

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { unreadCount: count }, { merge: true });
      } catch (error) {
        console.warn("Firestore setUnreadCount fallback active:", error);
      }
    }
  },

  togglePinChat: async (chatId: string): Promise<boolean> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    let newPinState = false;
    if (chatIdx !== -1) {
      newPinState = !chats[chatIdx].isPinned;
      chats[chatIdx].isPinned = newPinState;
      chats[chatIdx].pinned = newPinState;
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
    }

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { isPinned: newPinState, pinned: newPinState }, { merge: true });
      } catch (error) {
        console.warn("Firestore togglePinChat fallback active:", error);
      }
    }
    return newPinState;
  },

  toggleBlockChat: async (chatId: string): Promise<boolean> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    let newBlockState = false;
    if (chatIdx !== -1) {
      newBlockState = !chats[chatIdx].isBlocked;
      chats[chatIdx].isBlocked = newBlockState;
      if (newBlockState) {
        chats[chatIdx].blockedAt = new Date().toISOString();
      } else {
        delete chats[chatIdx].blockedAt;
      }
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
    }

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { 
          isBlocked: newBlockState, 
          blockedAt: newBlockState ? new Date().toISOString() : null 
        }, { merge: true });
      } catch (error) {
        console.warn("Firestore toggleBlockChat fallback active:", error);
      }
    }
    return newBlockState;
  },

  setChatBlocked: async (chatId: string, isBlocked: boolean): Promise<void> => {
    const chats = getLocalChats();
    const chatIdx = chats.findIndex((c: any) => c.id === chatId);
    if (chatIdx !== -1) {
      chats[chatIdx].isBlocked = isBlocked;
      if (isBlocked) {
        chats[chatIdx].blockedAt = new Date().toISOString();
      } else {
        delete chats[chatIdx].blockedAt;
      }
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
    }

    if (isFirebaseConfigured && db) {
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { 
          isBlocked, 
          blockedAt: isBlocked ? new Date().toISOString() : null 
        }, { merge: true });
      } catch (error) {
        console.warn("Firestore setChatBlocked fallback active:", error);
      }
    }
  },

  createConversation: async (newConv: ChatConversation): Promise<void> => {
    const chats = getLocalChats();
    const existing = chats.find(c => c.id === newConv.id);
    if (!existing) {
      chats.unshift(newConv);
      storage.save('lodavia_chats', chats);
      storage.save('lumo_chats', chats);
      if (isFirebaseConfigured && db) {
        try {
          const chatRef = doc(db, 'chats', newConv.id);
          await setDoc(chatRef, newConv, { merge: true });
        } catch (error) {
          console.warn("Firestore createConversation fallback active:", error);
        }
      }
    }
  }
};
