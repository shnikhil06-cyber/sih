import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

export const PhoneContainer = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Smartphone Chassis */}
      <div className={`relative w-full transition-all duration-300 ${isExpanded ? 'max-w-[500px]' : 'max-w-[420px]'} bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50`}>
        
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
        <div className={`bg-slate-50 text-slate-900 rounded-[36px] overflow-hidden ${isExpanded ? 'min-h-[720px] max-h-[820px]' : 'min-h-[640px] max-h-[760px]'} overflow-y-auto scrollbar-none border border-slate-200 shadow-inner`}>
          {children}
        </div>

        {/* Bottom Home Gesture Indicator */}
        <div className="pt-2 pb-1 bg-slate-900 rounded-b-[40px] flex justify-center items-center">
          <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>

      {/* Control Footer */}
      <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500 font-semibold">
        <div className="flex items-center space-x-1.5">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Collector Phone Simulator (Entry-Level Android View)</span>
        </div>
        <span className="text-slate-300">•</span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors"
        >
          {isExpanded ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Compact Frame</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand Frame</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

