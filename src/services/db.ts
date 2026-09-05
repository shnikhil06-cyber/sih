import { Lot, CollectorProfile, PriceRecord, Recycler } from '../types';
import { INITIAL_DEMO_LOTS, INITIAL_COLLECTOR, INITIAL_PRICE_DATASET, VERIFIED_RECYCLERS_DATASET } from './mockData';

const LOTS_KEY = 'punarjyoti_lots_v1';
const PROFILE_KEY = 'punarjyoti_collector_v1';
const ONLINE_KEY = 'punarjyoti_online_mode';

export class LocalDatabase {
  static getLots(): Lot[] {
    const raw = localStorage.getItem(LOTS_KEY);
    if (!raw) {
      localStorage.setItem(LOTS_KEY, JSON.stringify(INITIAL_DEMO_LOTS));
      return INITIAL_DEMO_LOTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_LOTS;
    }
  }

  static saveLot(lot: Lot): Lot[] {
    const lots = this.getLots();
    const index = lots.findIndex(l => l.lot_id === lot.lot_id);
    if (index >= 0) {
      lots[index] = lot;
    } else {
      lots.unshift(lot);
    }
    localStorage.setItem(LOTS_KEY, JSON.stringify(lots));
    return lots;
  }

  static getCollectorProfile(): CollectorProfile {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_COLLECTOR));
      return INITIAL_COLLECTOR;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COLLECTOR;
    }
  }

  static updateProfile(profile: CollectorProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  static isOnline(): boolean {
    const val = localStorage.getItem(ONLINE_KEY);
    return val === null ? true : val === 'true';
  }

  static setOnlineMode(isOnline: boolean): void {
    localStorage.setItem(ONLINE_KEY, String(isOnline));
  }

  static getPendingSyncCount(): number {
    const lots = this.getLots();
    return lots.filter(l => l.sync_status === 'PENDING_SYNC').length;
  }

  static syncPendingQueue(): Lot[] {
    const lots = this.getLots();
    let updated = false;
    const newLots = lots.map(lot => {
      if (lot.sync_status === 'PENDING_SYNC') {
        updated = true;
        return { ...lot, sync_status: 'SYNCED' as const };
      }
      return lot;
    });
    if (updated) {
      localStorage.setItem(LOTS_KEY, JSON.stringify(newLots));
    }
    return newLots;
  }

  static getPrices(): PriceRecord[] {
    return INITIAL_PRICE_DATASET;
  }

  static getRecyclers(): Recycler[] {
    return VERIFIED_RECYCLERS_DATASET;
  }
}
