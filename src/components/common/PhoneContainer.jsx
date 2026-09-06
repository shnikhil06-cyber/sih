import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export const PhoneContainer = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-4 flex flex-col items-center justify-center transition-all duration-300">
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
