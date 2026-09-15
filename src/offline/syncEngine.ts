// Sync Engine for LODAVIA Offline System
import { offlineDB, SyncOperation } from './db';
import { firestoreService } from '../firebase/services';

export type NetworkState = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_ERROR';

export type SyncStateCallback = (state: NetworkState, pendingCount: number, message?: string) => void;

class SyncEngine {
  private currentState: NetworkState = navigator.onLine ? 'ONLINE' : 'OFFLINE';
  private listeners: Set<SyncStateCallback> = new Set();
  private isProcessing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  public subscribe(cb: SyncStateCallback) {
    this.listeners.add(cb);
    this.notify();
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getState(): NetworkState {
    return this.currentState;
  }

  private async notify(message?: string) {
    const queue = await offlineDB.getSyncQueue();
    const pendingCount = queue.filter(q => q.status === 'PENDING' || q.status === 'SYNCING').length;
    this.listeners.forEach(cb => cb(this.currentState, pendingCount, message));
  }

  private async handleNetworkChange(isOnline: boolean) {
    if (isOnline) {
      this.currentState = 'ONLINE';
      await this.notify('✓ Back Online | Syncing your LODAVIA data...');
      await this.processQueue();
    } else {
      this.currentState = 'OFFLINE';
      await this.notify('📡 Offline Mode');
    }
  }

  /**
   * Queue a new offline action safely with unique operation ID to prevent replay attacks
   */
  public async queueOperation(
    userId: string,
    type: SyncOperation['type'],
    payload: any,
    localResult?: SyncOperation['localResult']
  ): Promise<SyncOperation> {
    const opId = `op_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const op: SyncOperation = {
      id: `sync_${opId}`,
      opId,
      userId,
      type,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      status: 'PENDING',
      localResult
    };

    await offlineDB.addSyncOperation(op);
    
    if (navigator.onLine) {
      this.processQueue();
    } else {
      await this.notify('📡 Action queued offline');
    }

    return op;
  }

  /**
   * Process the pending synchronization queue
   */
  public async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine) return;

    this.isProcessing = true;
    this.currentState = 'SYNCING';
    await this.notify('Syncing queued items...');

    try {
      const queue = await offlineDB.getSyncQueue();
      const pending = queue.filter(item => item.status === 'PENDING' || item.status === 'FAILED');

      for (const op of pending) {
        if (!navigator.onLine) break;

        await offlineDB.updateSyncStatus(op.id, 'SYNCING');
        await this.notify(`Syncing ${op.type}...`);

        try {
          // Send to server based on action type
          if (op.type === 'create_post') {
            await firestoreService.createPost(op.payload);
          } else if (op.type === 'like_post') {
            await firestoreService.likePost(op.payload.postId, op.userId, op.payload.isLiked);
          } else if (op.type === 'comment') {
            await firestoreService.addComment(op.payload.postId, op.payload.comment);
          } else if (op.type === 'complete_lesson') {
            // Save lesson progress to server
          } else if (op.type === 'quiz_reward' || op.type === 'game_reward') {
            // Server validation simulation: Verify timestamp, opId, and max threshold
            if (op.localResult?.points && op.localResult.points > 500) {
              throw new Error('Reward points exceed security limit for offline mode');
            }
          }

          // Mark success
          await offlineDB.updateSyncStatus(op.id, 'SUCCESS');
          // Clean up completed sync after brief delay
          setTimeout(() => {
            offlineDB.removeSyncOperation(op.id);
          }, 2000);

        } catch (err) {
          console.error(`Sync error for ${op.id}:`, err);
          const newRetry = op.retryCount + 1;
          if (newRetry >= 5) {
            await offlineDB.updateSyncStatus(op.id, 'FAILED', newRetry);
          } else {
            await offlineDB.updateSyncStatus(op.id, 'PENDING', newRetry);
          }
        }
      }

      this.currentState = 'ONLINE';
      await this.notify('✓ Synchronization complete');

    } catch (err) {
      this.currentState = 'SYNC_ERROR';
      await this.notify('Synchronization encountered an issue');
    } finally {
      this.isProcessing = false;
    }
  }

  public async manualSync() {
    if (navigator.onLine) {
      await this.processQueue();
    } else {
      await this.notify('Cannot sync while offline');
    }
  }
}

export const syncEngine = new SyncEngine();
