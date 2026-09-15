import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'system' | 'social' | 'points' | 'alert';
  timestamp: string;
  read: boolean;
  userId?: string;
}

export const notificationService = {
  getNotifications: async (userId: string): Promise<NotificationItem[]> => {
    if (isFirebaseConfigured && db) {
      const collPath = 'notifications';
      try {
        const q = query(
          collection(db, collPath),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() })) as NotificationItem[];
      } catch (err) {
        console.warn("Firestore notification fetch error, falling back:", err);
        return storage.load<NotificationItem[]>('lodavia_notifications', []);
      }
    } else {
      return storage.load<NotificationItem[]>('lodavia_notifications', [
        {
          id: 'notif_1',
          title: 'مرحباً بك في Lodavia! ✨',
          body: 'ابدأ رحلتك الكونية وتفاعل مع المبدعين الآخرين.',
          type: 'system',
          timestamp: new Date().toISOString(),
          read: false
        }
      ]);
    }
  },

  markAsRead: async (notifId: string): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `notifications/${notifId}`;
      try {
        await updateDoc(doc(db, 'notifications', notifId), { read: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const notifs = storage.load<NotificationItem[]>('lumo_notifications', []);
      const index = notifs.findIndex(n => n.id === notifId);
      if (index !== -1) {
        notifs[index].read = true;
        storage.save('lumo_notifications', notifs);
      }
    }
  },

  addNotification: async (notif: NotificationItem): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `notifications/${notif.id}`;
      try {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const notifs = storage.load<NotificationItem[]>('lumo_notifications', []);
      notifs.unshift(notif);
      storage.save('lumo_notifications', notifs);
    }
  }
};
