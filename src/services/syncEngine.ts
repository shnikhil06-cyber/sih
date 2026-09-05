import { LocalDatabase } from './db';
import { Lot } from '../types';

type SyncListener = (isOnline: boolean, pendingCount: number, lots: Lot[]) => void;

class SyncEngineManager {
  private listeners: Set<SyncListener> = new Set();
  private onlineStatus: boolean = LocalDatabase.isOnline();

  constructor() {
    window.addEventListener('online', () => this.handleNetworkChange(true));
    window.addEventListener('offline', () => this.handleNetworkChange(false));
  }

  public subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    // Initial emit
    listener(this.onlineStatus, LocalDatabase.getPendingSyncCount(), LocalDatabase.getLots());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public toggleNetworkMode(): boolean {
    this.onlineStatus = !this.onlineStatus;
    LocalDatabase.setOnlineMode(this.onlineStatus);
    this.notify();

    if (this.onlineStatus) {
      this.triggerSync();
    }
    return this.onlineStatus;
  }

  public handleNetworkChange(isOnline: boolean) {
    this.onlineStatus = isOnline;
    LocalDatabase.setOnlineMode(isOnline);
    this.notify();
    if (isOnline) {
      this.triggerSync();
    }
  }

  public triggerSync() {
    if (!this.onlineStatus) return;
    const syncedLots = LocalDatabase.syncPendingQueue();
    this.notify(syncedLots);
  }

  public notify(updatedLots?: Lot[]) {
    const lots = updatedLots || LocalDatabase.getLots();
    const pending = LocalDatabase.getPendingSyncCount();
    this.listeners.forEach(l => l(this.onlineStatus, pending, lots));
  }
}

export const syncEngine = new SyncEngineManager();
