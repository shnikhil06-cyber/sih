import { INITIAL_DEMO_LOTS, INITIAL_COLLECTOR, INITIAL_PRICE_DATASET, VERIFIED_RECYCLERS_DATASET } from './mockData.js';

const LOTS_KEY = 'punarjyoti_lots_v1';
const PROFILE_KEY = 'punarjyoti_collector_v1';
const ONLINE_KEY = 'punarjyoti_online_mode';

export class LocalDatabase {
  static getLots() {
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

  static saveLot(lot) {
    const lots = this.getLots();
    const index = lots.findIndex(l => l.lot_id === lot.lot_id);
    if (index >= 0) {
      lots[index] = lot;
    } else {
      lots.unshift(lot);
    }
    localStorage.setItem(LOTS_KEY, JSON.stringify(lots));

    // Update profile earnings if transaction is completed
    if (lot.transaction_status === 'RECYCLED' && lot.final_price) {
      const profile = this.getCollectorProfile();
      const completedCount = lots.filter(l => l.transaction_status === 'RECYCLED').length;
      const totalSum = lots
        .filter(l => l.transaction_status === 'RECYCLED')
        .reduce((sum, l) => sum + (l.final_price || l.quoted_price || 0), 0);

      const updatedProfile = {
        ...profile,
        lots_sold: Math.max(profile.lots_sold, completedCount + 26),
        total_earnings: Math.max(profile.total_earnings, totalSum + 17050),
      };
      this.updateProfile(updatedProfile);
    }

    return lots;
  }

  static getCollectorProfile() {
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

  static updateProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  static isOnline() {
    const val = localStorage.getItem(ONLINE_KEY);
    return val === null ? true : val === 'true';
  }

  static setOnlineMode(isOnline) {
    localStorage.setItem(ONLINE_KEY, String(isOnline));
  }

  static getPendingSyncCount() {
    const lots = this.getLots();
    return lots.filter(l => l.sync_status === 'PENDING_SYNC').length;
  }

  static syncPendingQueue() {
    const lots = this.getLots();
    let updated = false;
    const newLots = lots.map(lot => {
      if (lot.sync_status === 'PENDING_SYNC') {
        updated = true;
        return { ...lot, sync_status: 'SYNCED' };
      }
      return lot;
    });
    if (updated) {
      localStorage.setItem(LOTS_KEY, JSON.stringify(newLots));
    }
    return newLots;
  }

  static getPrices() {
    return INITIAL_PRICE_DATASET;
  }

  static getRecyclers() {
    return VERIFIED_RECYCLERS_DATASET;
  }
}
