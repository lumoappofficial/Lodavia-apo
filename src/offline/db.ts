// Lodavia Offline IndexedDB Database Manager

export interface OfflineSavedItem {
  id: string;
  type: 'post' | 'article' | 'lesson' | 'pdf' | 'media' | 'space_pack' | 'course' | 'game';
  title: string;
  titleAr?: string;
  titleEn?: string;
  thumbnail?: string;
  cachedContent: any;
  downloadStatus: 'AVAILABLE' | 'DOWNLOADING' | 'DOWNLOADED' | 'FAILED' | 'OUTDATED' | 'REMOVED';
  downloadProgress: number; // 0 to 100
  downloadedAt: number;
  size: number; // in bytes
  sizeFormatted: string;
  version: string;
  syncStatus: 'SYNCED' | 'PENDING';
  isPremium?: boolean;
}

export interface SyncOperation {
  id: string;
  opId: string;
  userId: string;
  type: 'create_post' | 'like_post' | 'comment' | 'complete_lesson' | 'quiz_reward' | 'game_reward';
  payload: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'SUCCESS' | 'FAILED' | 'CONFLICT';
  localResult?: {
    points?: number;
    messageAr?: string;
    messageEn?: string;
  };
}

export interface SpacePackItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  sizeFormatted: string;
  size: number; // bytes
  isPremium: boolean;
  planetData: {
    diameter: string;
    mass: string;
    moons: number;
    temp: string;
    atmosphere: string;
    summaryAr: string;
    summaryEn: string;
    keyFacts: string[];
  };
  cachedImages: string[];
  downloadedAt?: number;
  downloadStatus: 'AVAILABLE' | 'DOWNLOADING' | 'DOWNLOADED' | 'FAILED';
}

const DB_NAME = 'lodavia_offline_db';
const DB_VERSION = 1;

class LodaviaDBManager {
  private db: IDBDatabase | null = null;

  public async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;

        if (!db.objectStoreNames.contains('saved_content')) {
          const store = db.createObjectStore('saved_content', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('downloadStatus', 'downloadStatus', { unique: false });
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          const store = db.createObjectStore('sync_queue', { keyPath: 'id' });
          store.createIndex('opId', 'opId', { unique: true });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('educational_progress')) {
          const store = db.createObjectStore('educational_progress', { keyPath: 'id' });
          store.createIndex('courseId', 'courseId', { unique: false });
        }

        if (!db.objectStoreNames.contains('space_packs')) {
          db.createObjectStore('space_packs', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // --- Saved Content Methods ---
  public async getSavedItems(): Promise<OfflineSavedItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('saved_content', 'readonly');
      const store = tx.objectStore('saved_content');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public async saveItem(item: OfflineSavedItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('saved_content', 'readwrite');
      const store = tx.objectStore('saved_content');
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteSavedItem(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('saved_content', 'readwrite');
      const store = tx.objectStore('saved_content');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- Sync Queue Methods ---
  public async getSyncQueue(): Promise<SyncOperation[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public async addSyncOperation(op: SyncOperation): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const request = store.put(op);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async updateSyncStatus(id: string, status: SyncOperation['status'], retryCount?: number): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const item: SyncOperation = getReq.result;
        if (item) {
          item.status = status;
          if (typeof retryCount === 'number') item.retryCount = retryCount;
          store.put(item);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  public async removeSyncOperation(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- Profile Snapshot ---
  public async cacheUserProfile(userId: string, profile: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_profile', 'readwrite');
      const store = tx.objectStore('user_profile');
      store.put({ id: userId, data: profile, lastSyncedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getCachedUserProfile(userId: string): Promise<{ data: any; lastSyncedAt: number } | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_profile', 'readonly');
      const store = tx.objectStore('user_profile');
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Space Packs ---
  public async getSpacePacks(): Promise<SpacePackItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('space_packs', 'readonly');
      const store = tx.objectStore('space_packs');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public async saveSpacePack(pack: SpacePackItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('space_packs', 'readwrite');
      const store = tx.objectStore('space_packs');
      store.put(pack);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- Storage Clearance ---
  public async clearCacheOnly(): Promise<void> {
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key.includes('lodavia')) {
          await caches.delete(key);
        }
      }
    }
  }

  public async clearAllOfflineData(): Promise<void> {
    const db = await this.getDB();
    const stores = ['saved_content', 'educational_progress', 'space_packs'];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readwrite');
      stores.forEach(name => tx.objectStore(name).clear());
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const offlineDB = new LodaviaDBManager();
