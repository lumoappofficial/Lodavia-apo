// Download & Storage Manager for LODAVIA Offline System
import { offlineDB, OfflineSavedItem, SpacePackItem } from './db';

export interface StorageBreakdown {
  courses: number; // bytes
  videos: number;
  spaceExplorer: number;
  games: number;
  savedContent: number;
  cache: number;
  total: number;
}

export type DownloadProgressCallback = (itemId: string, progress: number, status: OfflineSavedItem['downloadStatus']) => void;

class DownloadManager {
  private activeDownloads: Map<string, { paused: boolean; cancelled: boolean }> = new Map();
  private listeners: Set<DownloadProgressCallback> = new Set();

  public subscribe(cb: DownloadProgressCallback) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(itemId: string, progress: number, status: OfflineSavedItem['downloadStatus']) {
    this.listeners.forEach(cb => cb(itemId, progress, status));
  }

  /**
   * Start downloading an item
   */
  public async startDownload(item: OfflineSavedItem): Promise<boolean> {
    const existing = await offlineDB.getSavedItems();
    
    // Check if already downloaded
    const match = existing.find(i => i.id === item.id);
    if (match && match.downloadStatus === 'DOWNLOADED') {
      return true;
    }

    this.activeDownloads.set(item.id, { paused: false, cancelled: false });
    
    item.downloadStatus = 'DOWNLOADING';
    item.downloadProgress = 0;
    await offlineDB.saveItem(item);
    this.notify(item.id, 0, 'DOWNLOADING');

    // Simulate real chunk download
    const steps = [15, 35, 60, 85, 100];
    for (const step of steps) {
      const state = this.activeDownloads.get(item.id);
      if (!state || state.cancelled) {
        item.downloadStatus = 'REMOVED';
        item.downloadProgress = 0;
        await offlineDB.deleteSavedItem(item.id);
        this.notify(item.id, 0, 'REMOVED');
        return false;
      }

      while (state.paused) {
        await new Promise(r => setTimeout(r, 300));
        if (!this.activeDownloads.has(item.id)) return false;
      }

      await new Promise(r => setTimeout(r, 200 + Math.random() * 200));

      item.downloadProgress = step;
      if (step === 100) {
        item.downloadStatus = 'DOWNLOADED';
        item.downloadedAt = Date.now();
      }
      await offlineDB.saveItem(item);
      this.notify(item.id, step, item.downloadStatus);
    }

    this.activeDownloads.delete(item.id);

    // Cache images/assets into Service Worker Cache API if available
    if ('caches' in window && item.cachedContent) {
      try {
        const cache = await caches.open('lodavia-content-v2');
        const jsonBlob = new Blob([JSON.stringify(item.cachedContent)], { type: 'application/json' });
        await cache.put(`/offline-vault/${item.id}.json`, new Response(jsonBlob));
      } catch (err) {
        console.warn('Cache API fallback warning:', err);
      }
    }

    return true;
  }

  public pauseDownload(itemId: string) {
    const state = this.activeDownloads.get(itemId);
    if (state) {
      state.paused = true;
    }
  }

  public resumeDownload(itemId: string) {
    const state = this.activeDownloads.get(itemId);
    if (state) {
      state.paused = false;
    }
  }

  public cancelDownload(itemId: string) {
    const state = this.activeDownloads.get(itemId);
    if (state) {
      state.cancelled = true;
      this.activeDownloads.delete(itemId);
    }
    offlineDB.deleteSavedItem(itemId);
    this.notify(itemId, 0, 'REMOVED');
  }

  public async deleteDownload(itemId: string) {
    this.cancelDownload(itemId);
    await offlineDB.deleteSavedItem(itemId);
    if ('caches' in window) {
      try {
        const cache = await caches.open('lodavia-content-v2');
        await cache.delete(`/offline-vault/${itemId}.json`);
      } catch (e) {}
    }
  }

  public async retryDownload(item: OfflineSavedItem) {
    await this.deleteDownload(item.id);
    return this.startDownload(item);
  }

  /**
   * Calculate storage breakdown for user interface
   */
  public async getStorageBreakdown(): Promise<StorageBreakdown> {
    const items = await offlineDB.getSavedItems();
    const spacePacks = await offlineDB.getSpacePacks();

    let courses = 0;
    let videos = 0;
    let spaceExplorer = 0;
    let games = 0;
    let savedContent = 0;

    items.forEach(item => {
      const size = item.size || 500000;
      if (item.type === 'course' || item.type === 'lesson') courses += size;
      else if (item.type === 'media' || item.type === 'pdf') videos += size;
      else if (item.type === 'game') games += size;
      else savedContent += size;
    });

    spacePacks.forEach(pack => {
      spaceExplorer += pack.size || 2500000;
    });

    // Cache estimation
    let cache = 45 * 1024 * 1024; // ~45MB baseline static app shell cache
    if ('performance' in window && 'navigator' in window && (navigator as any).storage?.estimate) {
      try {
        const estimate = await (navigator as any).storage.estimate();
        if (estimate.usage) {
          cache = Math.max(cache, Math.round(estimate.usage * 0.2));
        }
      } catch (e) {}
    }

    const total = courses + videos + spaceExplorer + games + savedContent + cache;

    return {
      courses,
      videos,
      spaceExplorer,
      games,
      savedContent,
      cache,
      total
    };
  }
}

export const downloadManager = new DownloadManager();
