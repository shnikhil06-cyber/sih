import React, { useState, useEffect } from 'react';
import type { Language, CollectorProfile, Lot } from './types';
import { Header } from './components/common/Header';
import { OfflineSyncBar } from './components/common/OfflineSyncBar';
import { PhoneContainer } from './components/common/PhoneContainer';
import { CollectorHome } from './components/collector/CollectorHome';
import { SellEWasteFlow } from './components/collector/SellEWasteFlow';
import { PriceDiscovery } from './components/collector/PriceDiscovery';
import { RecyclerFinder } from './components/collector/RecyclerFinder';
import { MyLots } from './components/collector/MyLots';
import { EarningsView } from './components/collector/EarningsView';
import { SafetyModule } from './components/collector/SafetyModule';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { UnitEconomics } from './components/analytics/UnitEconomics';
import { LocalDatabase } from './services/db';
import { syncEngine } from './services/syncEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collector' | 'recycler' | 'economics'>('collector');
  const [collectorScreen, setCollectorScreen] = useState<'home' | 'sell' | 'price' | 'recyclers' | 'lots' | 'earnings' | 'safety'>('home');
  const [language, setLanguage] = useState<Language>('mr');
  
  const [isOnline, setIsOnline] = useState<boolean>(() => LocalDatabase.isOnline());
  const [pendingCount, setPendingCount] = useState<number>(() => LocalDatabase.getPendingSyncCount());
  const [profile, setProfile] = useState<CollectorProfile>(() => LocalDatabase.getCollectorProfile());

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((onlineStatus, pending, _lots) => {
      setIsOnline(onlineStatus);
      setPendingCount(pending);
      setProfile(LocalDatabase.getCollectorProfile());
    });
    return unsubscribe;
  }, []);

  const handleLotCreated = (_newLot: Lot) => {
    setProfile(LocalDatabase.getCollectorProfile());
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Platform Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isOnline={isOnline}
        pendingCount={pendingCount}
      />

      {/* Offline Database Sync Status Bar */}
      <OfflineSyncBar isOnline={isOnline} pendingCount={pendingCount} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-4 px-2 sm:px-4">
        {activeTab === 'collector' && (
          /* Phone Frame Container for Collector App */
          <PhoneContainer>
            {collectorScreen === 'home' && (
              <CollectorHome
                profile={profile}
                language={language}
                onNavigate={setCollectorScreen}
              />
            )}
            {collectorScreen === 'sell' && (
              <SellEWasteFlow
                language={language}
                onBack={() => setCollectorScreen('home')}
                onLotCreated={handleLotCreated}
                isOnline={isOnline}
              />
            )}
            {collectorScreen === 'price' && (
              <PriceDiscovery
                language={language}
                onBack={() => setCollectorScreen('home')}
              />
            )}
            {collectorScreen === 'recyclers' && (
              <RecyclerFinder
                language={language}
                onBack={() => setCollectorScreen('home')}
              />
            )}
            {collectorScreen === 'lots' && (
              <MyLots
                language={language}
                onBack={() => setCollectorScreen('home')}
              />
            )}
            {collectorScreen === 'earnings' && (
              <EarningsView
                profile={profile}
                language={language}
                onBack={() => setCollectorScreen('home')}
              />
            )}
            {collectorScreen === 'safety' && (
              <SafetyModule
                language={language}
                onBack={() => setCollectorScreen('home')}
              />
            )}
          </PhoneContainer>
        )}

        {activeTab === 'recycler' && (
          <RecyclerDashboard />
        )}

        {activeTab === 'economics' && (
          <UnitEconomics />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-4 text-xs text-slate-500 font-medium">
        PunarJyoti E-Waste Formal Channel Digital Traceability System • Hackathon 2026 Prototype
      </footer>
    </div>
  );
};

export default App;
