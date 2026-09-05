import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { syncEngine } from '../../services/syncEngine';

interface OfflineSyncBarProps {
  isOnline: boolean;
  pendingCount: number;
}

export const OfflineSyncBar: React.FC<OfflineSyncBarProps> = ({ isOnline, pendingCount }) => {
  const handleForceSync = () => {
    if (!isOnline) {
      syncEngine.toggleNetworkMode();
    } else {
      syncEngine.triggerSync();
    }
  };

  return (
    <div
      className={`w-full px-4 py-2 text-xs font-bold flex items-center justify-between transition-colors shadow-sm ${
        isOnline
          ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
          : 'bg-amber-50 text-amber-900 border-b border-amber-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span>🟢 Cloud API Sync Connected</span>
          </>
        ) : (
          <>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>
              🟠 Offline Mode — {pendingCount} {pendingCount === 1 ? 'lot' : 'lots'} stored in Local Phone SQLite DB
            </span>
          </>
        )}
      </div>

      <button
        onClick={handleForceSync}
        className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all text-xs font-bold shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
        <span>{isOnline ? 'Sync Queue Now' : 'Connect & Sync'}</span>
      </button>
    </div>
  );
};
