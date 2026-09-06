import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2, Palette } from 'lucide-react';

export const PhoneContainer = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [chassisColor, setChassisColor] = useState('slate');

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

  const colorStyles = {
    slate: 'bg-slate-900 border-slate-800 ring-slate-700/50',
    emerald: 'bg-emerald-950 border-emerald-900 ring-emerald-800/50',
    indigo: 'bg-indigo-950 border-indigo-900 ring-indigo-800/50',
    amber: 'bg-stone-900 border-amber-950 ring-amber-900/50',
  };

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
        <div className={`relative w-full transition-all duration-300 ${isExpanded ? 'max-w-[500px]' : 'max-w-[420px]'} ${colorStyles[chassisColor]} rounded-[48px] p-3.5 shadow-2xl border-4 ring-1`}>
          
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
          <div className={`relative bg-slate-50 text-slate-900 rounded-[36px] overflow-hidden ${isExpanded ? 'min-h-[720px] max-h-[820px]' : 'min-h-[640px] max-h-[760px]'} overflow-y-auto scrollbar-none border border-slate-200 shadow-inner`}>
            {children}
          </div>

          {/* Bottom Home Gesture Indicator */}
          <div className="pt-2 pb-1 bg-slate-900 rounded-b-[40px] flex justify-center items-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Control Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-semibold">
        <div className="flex items-center space-x-1.5">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Collector Smartphone Simulator (Entry-Level Android)</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-600 font-bold">Body:</span>
          <button onClick={() => setChassisColor('slate')} className={`w-3.5 h-3.5 rounded-full bg-slate-900 border ${chassisColor === 'slate' ? 'ring-2 ring-emerald-500' : ''}`} title="Obsidian"></button>
          <button onClick={() => setChassisColor('emerald')} className={`w-3.5 h-3.5 rounded-full bg-emerald-800 border ${chassisColor === 'emerald' ? 'ring-2 ring-emerald-500' : ''}`} title="Emerald"></button>
          <button onClick={() => setChassisColor('indigo')} className={`w-3.5 h-3.5 rounded-full bg-indigo-900 border ${chassisColor === 'indigo' ? 'ring-2 ring-emerald-500' : ''}`} title="Midnight Blue"></button>
          <button onClick={() => setChassisColor('amber')} className={`w-3.5 h-3.5 rounded-full bg-stone-800 border ${chassisColor === 'amber' ? 'ring-2 ring-emerald-500' : ''}`} title="Titanium"></button>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
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


