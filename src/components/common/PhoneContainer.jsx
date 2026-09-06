import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Volume2, User } from 'lucide-react';

export const PhoneContainer = ({
  children,
  language,
  setLanguage,
  onOpenLoginModal,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
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
    <div className="bg-emerald-800 text-white px-3.5 py-2 flex items-center justify-between shadow-md text-xs sticky top-0 z-40 border-b border-emerald-700">
      <div
        className="flex items-center space-x-2 font-bold cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onOpenLoginModal}
      >
        <span className="text-base">♻️</span>
        <span className="font-extrabold text-sm tracking-tight text-white">Kabadiwala Connect</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* In-App Vernacular Language Switcher */}
        <div className="flex items-center bg-emerald-950/60 rounded-lg px-2 py-1 border border-emerald-600/70 shadow-inner">
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

        {/* In-App Login / Profile Settings Button */}
        <button
          onClick={onOpenLoginModal}
          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-700 text-white border border-emerald-600/70 transition-all flex items-center justify-center shadow-inner"
          title="Login / Role Switcher"
        >
          <User className="w-4 h-4 text-emerald-200" />
        </button>
      </div>
    </div>
  );

  // Native Mobile APK / Small Viewport Screen (Full Screen Native Layout)
  if (isMobileScreen) {
    return (
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {InAppMobileHeader}
        <div className="flex-1 pb-8">
          {children}
        </div>
      </div>
    );
  }

  // Desktop Viewport (Interactive Smartphone Frame Simulator)
  return (
    <div className="py-2 flex flex-col items-center justify-center transition-all duration-300">
      {/* Smartphone Chassis with Side Physical Buttons */}
      <div className="relative">
        {/* Left Side Volume Buttons */}
        <div className="absolute -left-2.5 top-24 w-1.5 h-10 bg-slate-700 rounded-l-md shadow-md"></div>
        <div className="absolute -left-2.5 top-38 w-1.5 h-10 bg-slate-700 rounded-l-md shadow-md"></div>
        {/* Right Side Power Button */}
        <div className="absolute -right-2.5 top-28 w-1.5 h-14 bg-slate-700 rounded-r-md shadow-md"></div>

        {/* Outer Phone Shell */}
        <div className="relative w-full max-w-[420px] bg-slate-900 border-slate-800 ring-slate-700/50 rounded-[48px] p-3.5 shadow-2xl border-4 ring-1">
          {/* Speaker & Dynamic Notch */}
          <div className="relative bg-slate-900 pt-2 pb-1.5 px-6 rounded-t-[40px] flex items-center justify-between text-white text-[11px] font-bold tracking-tight select-none">
            <span>{currentTime || '09:41'}</span>

            {/* Camera Notch / Camera Bar */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 space-x-1 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3 h-3 fill-current text-slate-200" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <Battery className="w-3.5 h-3.5 fill-current text-emerald-400" />
            </div>
          </div>

          {/* Smartphone Screen Viewport */}
          <div className="relative bg-slate-50 text-slate-900 rounded-[36px] overflow-hidden min-h-[640px] max-h-[760px] overflow-y-auto scrollbar-none border border-slate-200 shadow-inner">
            {InAppMobileHeader}
            {children}
          </div>

          {/* Bottom Home Gesture Indicator */}
          <div className="pt-2 pb-1 bg-slate-900 rounded-b-[40px] flex justify-center items-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
