import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { syncEngine } from '../../services/syncEngine.js';

export const OfflineSyncBar = ({ isOnline, pendingCount }) => {
  if (isOnline) return null;

  const handleForceSync = () => {
    syncEngine.toggleNetworkMode();
  };

  return (
    <div className="w-full px-4 py-2 text-xs font-bold flex items-center justify-between transition-colors shadow-sm bg-amber-50 text-amber-900 border-b border-amber-200">
      <div className="flex items-center space-x-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>
          🟠 Offline Mode — {pendingCount} {pendingCount === 1 ? 'lot' : 'lots'} stored in Local Phone Storage (Pending Sync)
        </span>
      </div>

      <button
        onClick={handleForceSync}
        className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all text-xs font-bold shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
        <span>Connect & Sync</span>
      </button>
    </div>
  );
};
