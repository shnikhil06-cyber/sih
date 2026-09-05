import { LocalDatabase } from './db.js';

class SyncEngineManager {
  constructor() {
    this.listeners = new Set();
    this.onlineStatus = LocalDatabase.isOnline();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.onlineStatus, LocalDatabase.getPendingSyncCount(), LocalDatabase.getLots());
    return () => {
      this.listeners.delete(listener);
    };
  }

  toggleNetworkMode() {
    this.onlineStatus = !this.onlineStatus;
    LocalDatabase.setOnlineMode(this.onlineStatus);
    this.notify();

    if (this.onlineStatus) {
      this.triggerSync();
    }
    return this.onlineStatus;
  }

  handleNetworkChange(isOnline) {
    this.onlineStatus = isOnline;
    LocalDatabase.setOnlineMode(isOnline);
    this.notify();
    if (isOnline) {
      this.triggerSync();
    }
  }

  triggerSync() {
    if (!this.onlineStatus) return;
    const syncedLots = LocalDatabase.syncPendingQueue();
    this.notify(syncedLots);
  }

  notify(updatedLots) {
    const lots = updatedLots || LocalDatabase.getLots();
    const pending = LocalDatabase.getPendingSyncCount();
    this.listeners.forEach(l => l(this.onlineStatus, pending, lots));
  }
}

export const syncEngine = new SyncEngineManager();
