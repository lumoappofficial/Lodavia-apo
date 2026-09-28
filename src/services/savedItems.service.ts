import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { SavedItem, SavedItemType, SavedItemPreview } from '../types';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export const savedItemsService = {
  /**
   * Save an item (post, reel, video) to the user's savedItems subcollection.
   * Path: users/{uid}/savedItems/{docId}
   */
  saveItem: async (
    uid: string,
    itemType: SavedItemType,
    itemId: string,
    previewData?: SavedItemPreview,
    skipFirestore: boolean = false
  ): Promise<SavedItem> => {
    const docId = `${itemType}_${itemId}`;
    const savedItem: SavedItem = {
      id: docId,
      itemType,
      itemId,
      savedAt: new Date().toISOString(),
      preview: previewData
    };

    if (!skipFirestore && uid !== 'guest' && isFirebaseConfigured && db) {
      const path = `users/${uid}/savedItems/${docId}`;
      try {
        const itemRef = doc(db, 'users', uid, 'savedItems', docId);
        await setDoc(itemRef, savedItem);
      } catch (error) {
        console.warn(`Firestore saveItem error at ${path}:`, error);
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }

    // Always update local fallback storage for instant access & offline durability
    try {
      const storageKey = `lodavia_saved_items_${uid}`;
      const existing = storage.load<SavedItem[]>(storageKey, []);
      const filtered = existing.filter(i => i.id !== docId);
      storage.save(storageKey, [savedItem, ...filtered]);
    } catch (e) {
      console.warn('Local storage saveItem fallback warning:', e);
    }

    return savedItem;
  },

  /**
   * Remove a saved item from the user's savedItems subcollection.
   */
  unsaveItem: async (
    uid: string,
    itemType: SavedItemType,
    itemId: string,
    skipFirestore: boolean = false
  ): Promise<void> => {
    const docId = `${itemType}_${itemId}`;

    if (!skipFirestore && uid !== 'guest' && isFirebaseConfigured && db) {
      const path = `users/${uid}/savedItems/${docId}`;
      try {
        const itemRef = doc(db, 'users', uid, 'savedItems', docId);
        await deleteDoc(itemRef);
      } catch (error) {
        console.warn(`Firestore unsaveItem error at ${path}:`, error);
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }

    // Always update local fallback storage
    try {
      const storageKey = `lodavia_saved_items_${uid}`;
      const existing = storage.load<SavedItem[]>(storageKey, []);
      const updated = existing.filter(i => i.id !== docId);
      storage.save(storageKey, updated);
    } catch (e) {
      console.warn('Local storage unsaveItem fallback warning:', e);
    }
  },

  /**
   * Fetch all saved items for a user, optionally filtered by itemType, sorted by savedAt desc.
   */
  getSavedItems: async (
    uid: string,
    itemType?: SavedItemType,
    skipFirestore: boolean = false
  ): Promise<SavedItem[]> => {
    const storageKey = `lodavia_saved_items_${uid}`;

    if (!skipFirestore && uid !== 'guest' && isFirebaseConfigured && db) {
      const path = `users/${uid}/savedItems`;
      try {
        const colRef = collection(db, 'users', uid, 'savedItems');
        let q = query(colRef, orderBy('savedAt', 'desc'));
        if (itemType) {
          q = query(colRef, where('itemType', '==', itemType), orderBy('savedAt', 'desc'));
        }
        const snap = await getDocs(q);
        const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as SavedItem[];
        
        // Cache to local storage
        if (items.length > 0) {
          storage.save(storageKey, items);
        }
        return items;
      } catch (error) {
        console.warn(`Firestore getSavedItems error at ${path}, falling back to local storage:`, error);
        const cached = storage.load<SavedItem[]>(storageKey, []);
        return itemType ? cached.filter(i => i.itemType === itemType) : cached;
      }
    }

    // Offline / Local mock mode
    const cached = storage.load<SavedItem[]>(storageKey, []);
    return itemType ? cached.filter(i => i.itemType === itemType) : cached;
  }
};
