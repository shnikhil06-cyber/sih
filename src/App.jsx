import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header.jsx';
import { OfflineSyncBar } from './components/common/OfflineSyncBar.jsx';
import { PhoneContainer } from './components/common/PhoneContainer.jsx';
import { AppLoginModal } from './components/common/AppLoginModal.jsx';
import { AudioSpeakerToast } from './components/common/AudioSpeakerToast.jsx';
import { CollectorHome } from './components/collector/CollectorHome.jsx';
import { SellEWasteFlow } from './components/collector/SellEWasteFlow.jsx';
import { PriceDiscovery } from './components/collector/PriceDiscovery.jsx';
import { RecyclerFinder } from './components/collector/RecyclerFinder.jsx';
import { MyLots } from './components/collector/MyLots.jsx';
import { EarningsView } from './components/collector/EarningsView.jsx';
import { SafetyModule } from './components/collector/SafetyModule.jsx';
import { CollectorProfile } from './components/collector/CollectorProfile.jsx';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard.jsx';
import { UnitEconomics } from './components/analytics/UnitEconomics.jsx';
import { SystemArchitectureView } from './components/architecture/SystemArchitectureView.jsx';
import { LocalDatabase } from './services/db.js';
import { syncEngine } from './services/syncEngine.js';

export const App = () => {
  const [activeTab, setActiveTab] = useState('collector');
  const [collectorScreen, setCollectorScreen] = useState('home');
  const [language, setLanguage] = useState('en');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(() => LocalDatabase.isOnline());
  const [pendingCount, setPendingCount] = useState(() => LocalDatabase.getPendingSyncCount());
  const [profile, setProfile] = useState(() => LocalDatabase.getCollectorProfile());

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((onlineStatus, pending, _lots) => {
      setIsOnline(onlineStatus);
      setPendingCount(pending);
      setProfile(LocalDatabase.getCollectorProfile());
    });
    return unsubscribe;
  }, []);

  const handleLotCreated = (_newLot) => {
    setProfile(LocalDatabase.getCollectorProfile());
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Platform Header Navigation (Desktop view) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isOnline={isOnline}
        pendingCount={pendingCount}
      />

      {/* Offline Database Sync Status Bar */}
      <div className="hidden md:block">
        <OfflineSyncBar isOnline={isOnline} pendingCount={pendingCount} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-0 md:py-4 px-0 md:px-4">
        {activeTab === 'collector' && (
          <PhoneContainer
            language={language}
            setLanguage={setLanguage}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            collectorScreen={collectorScreen}
            setCollectorScreen={setCollectorScreen}
          >
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
            {collectorScreen === 'profile' && (
              <CollectorProfile
                profile={profile}
                language={language}
                setLanguage={setLanguage}
                onBack={() => setCollectorScreen('home')}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                isOnline={isOnline}
                pendingCount={pendingCount}
              />
            )}

            {/* In-App Login & Language Selection Modal (Inside Phone Frame) */}
            <AppLoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              language={language}
              setLanguage={setLanguage}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOnline={isOnline}
              pendingCount={pendingCount}
              isInsidePhone={true}
            />
          </PhoneContainer>
        )}

        {activeTab === 'recycler' && (
          <div className="p-2 sm:p-4">
            <RecyclerDashboard />
          </div>
        )}

        {activeTab === 'economics' && (
          <div className="p-2 sm:p-4">
            <UnitEconomics />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="p-2 sm:p-4">
            <SystemArchitectureView />
          </div>
        )}
      </main>

      {/* In-App Login & Language Selection Modal */}
      <AppLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        pendingCount={pendingCount}
      />

      {/* Global Audio Speaker Subtitle & Equalizer Toast */}
      <AudioSpeakerToast />
    </div>
  );
};

export default App;
