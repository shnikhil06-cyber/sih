import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Volume2, User } from 'lucide-react';

export const PhoneContainer = ({
  children,
  language,
  setLanguage,
  onOpenLoginModal,
  collectorScreen = 'home',
  setCollectorScreen,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);

    const checkMobile = () => {
      const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
      setIsMobileScreen(isNative || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const InAppMobileHeader = (
    <div className="bg-emerald-900 text-white px-3.5 py-2.5 flex items-center justify-between shadow-md text-xs sticky top-0 z-40 border-b border-emerald-800 flex-shrink-0">
      <div
        className="flex items-center space-x-2 font-bold cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setCollectorScreen && setCollectorScreen('home')}
      >
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-500/50"></span>
        <span className="font-black text-sm tracking-tight text-white">Kabadiwala Connect</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Vernacular Language Selector */}
        <div className="flex items-center bg-emerald-950/80 rounded-xl px-2.5 py-1 border border-emerald-700/60 shadow-inner">
          <Volume2 className="w-3.5 h-3.5 text-emerald-300 mr-1 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer"
          >
            <option value="en" className="text-slate-900 font-bold">English</option>
            <option value="hi" className="text-slate-900 font-bold">हिंदी (Hindi)</option>
            <option value="mr" className="text-slate-900 font-bold">मराठी (Marathi)</option>
            <option value="te" className="text-slate-900 font-bold">తెలుగు (Telugu)</option>
            <option value="ta" className="text-slate-900 font-bold">தமிழ் (Tamil)</option>
            <option value="gu" className="text-slate-900 font-bold">ગુજરાતી (Gujarati)</option>
            <option value="bn" className="text-slate-900 font-bold">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Profile / Account Settings Button */}
        <button
          onClick={() => setCollectorScreen && setCollectorScreen('profile')}
          className={`p-1.5 rounded-xl border transition-all flex items-center justify-center shadow-inner active:scale-95 ${
            collectorScreen === 'profile'
              ? 'bg-emerald-700 text-white border-emerald-400'
              : 'bg-emerald-950/80 hover:bg-emerald-800 text-white border border-emerald-700/60'
          }`}
          title="Collector Profile Settings"
        >
          <User className="w-4 h-4 text-emerald-200" />
        </button>
      </div>
    </div>
  );

  const FixedBottomNavbar = (
    <div className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-xs shadow-lg flex-shrink-0">
      <button
        onClick={() => setCollectorScreen && setCollectorScreen('home')}
        className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${
          collectorScreen === 'home'
            ? 'text-emerald-700 font-black bg-emerald-50'
            : 'text-slate-500 font-semibold hover:text-slate-900'
        }`}
      >
        <span className="text-base">🏠</span>
        <span className="text-[11px] leading-tight">Home</span>
      </button>

      <button
        onClick={() => setCollectorScreen && setCollectorScreen('lots')}
        className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${
          collectorScreen === 'lots'
            ? 'text-emerald-700 font-black bg-emerald-50'
            : 'text-slate-500 font-semibold hover:text-slate-900'
        }`}
      >
        <span className="text-base">📦</span>
        <span className="text-[11px] leading-tight">Lots</span>
      </button>

      <button
        onClick={() => setCollectorScreen && setCollectorScreen('earnings')}
        className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${
          collectorScreen === 'earnings'
            ? 'text-emerald-700 font-black bg-emerald-50'
            : 'text-slate-500 font-semibold hover:text-slate-900'
        }`}
      >
        <span className="text-base">₹</span>
        <span className="text-[11px] leading-tight">Earnings</span>
      </button>

      <button
        onClick={() => setCollectorScreen && setCollectorScreen('profile')}
        className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${
          collectorScreen === 'profile'
            ? 'text-emerald-700 font-black bg-emerald-50'
            : 'text-slate-500 font-semibold hover:text-slate-900'
        }`}
      >
        <span className="text-base">👤</span>
        <span className="text-[11px] leading-tight">Profile</span>
      </button>
    </div>
  );

  // Native Mobile Device Viewport
  if (isMobileScreen) {
    return (
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {InAppMobileHeader}
        <div className="flex-1 pb-4 overflow-y-auto">
          {children}
        </div>
        {FixedBottomNavbar}
      </div>
    );
  }

  // Desktop iPhone Frame Layout Viewport (Fluid Responsive iPhone Container)
  return (
    <div className="py-2 px-2 flex flex-col items-center justify-center transition-all duration-300 w-full">
      {/* Authentic iPhone Chassis Frame */}
      <div className="relative w-full max-w-[410px]">
        {/* Left Side iPhone Action Button & Volume Keys */}
        <div className="absolute -left-2 top-20 w-1 h-6 bg-slate-700 rounded-l-xs shadow-xs"></div>
        <div className="absolute -left-2 top-32 w-1 h-12 bg-slate-700 rounded-l-xs shadow-xs"></div>
        <div className="absolute -left-2 top-48 w-1 h-12 bg-slate-700 rounded-l-xs shadow-xs"></div>

        {/* Right Side iPhone Power / Siri Button */}
        <div className="absolute -right-2 top-36 w-1 h-16 bg-slate-700 rounded-r-xs shadow-xs"></div>

        {/* iPhone Outer Titanium Body Frame */}
        <div className="relative w-full bg-slate-950 border-[5px] border-slate-800 ring-1 ring-slate-700/60 rounded-[48px] p-3 shadow-2xl">
          {/* iOS Status Bar with Dynamic Island */}
          <div className="relative bg-slate-950 pt-2 pb-1.5 px-5 rounded-t-[40px] flex items-center justify-between text-white text-[12px] font-bold tracking-tight select-none">
            <span className="font-sans font-semibold">{currentTime || '9:41'}</span>

            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 space-x-1.5 shadow-md border border-slate-800/80">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-200">
              <Signal className="w-3.5 h-3.5 fill-current text-slate-100" />
              <span className="text-[10px] font-extrabold">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-100" />
              {/* Battery Icon */}
              <div className="w-5 h-2.5 border border-slate-300 rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* iPhone Display Viewport Screen (Dynamic Fluid Viewport Height) */}
          <div className="relative bg-slate-50 text-slate-900 rounded-[36px] overflow-hidden h-[calc(82vh-40px)] min-h-[620px] max-h-[760px] flex flex-col border border-slate-800/60 shadow-inner">
            {InAppMobileHeader}
            <div className="flex-1 overflow-y-auto scrollbar-none relative">
              {children}
            </div>
            {FixedBottomNavbar}
          </div>

          {/* iOS Bottom Home Indicator Gesture Bar */}
          <div className="pt-2 pb-0.5 bg-slate-950 rounded-b-[40px] flex justify-center items-center">
            <div className="w-32 h-1 bg-slate-500 rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
