import React from 'react';
import { Smartphone, Building2, TrendingUp, Database, Wifi, WifiOff, Volume2 } from 'lucide-react';
import { syncEngine } from '../../services/syncEngine.js';

export const Header = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isOnline,
  pendingCount,
}) => {
  const handleNetworkToggle = () => {
    syncEngine.toggleNetworkMode();
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('collector')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/30">
              ♻️
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                Kabadiwala Connect
              </h1>
              <p className="text-xs text-slate-500 font-medium">Formal E-Waste Digital Traceability Bridge</p>
            </div>
          </div>

          {/* Role Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('collector')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'collector'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Collector App</span>
            </button>
            <button
              onClick={() => setActiveTab('recycler')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'recycler'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recycler Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('economics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'economics'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Unit Economics</span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>System & Datasets</span>
            </button>
          </nav>

          {/* Controls: Vernacular Language Selector & Network Toggle */}
          <div className="flex items-center space-x-2">
            {/* Vernacular Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Network Online/Offline Toggle */}
            <button
              onClick={handleNetworkToggle}
              title="Click to toggle Network simulation (Online vs Offline)"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>OFFLINE ({pendingCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
