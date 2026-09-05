import React from 'react';
import { Wifi, Signal, Battery, Smartphone } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  return (
    <div className="py-4 flex flex-col items-center justify-center">
      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-[420px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
        
        {/* Speaker & Dynamic Notch */}
        <div className="relative bg-slate-900 pt-2 pb-1.5 px-6 rounded-t-[40px] flex items-center justify-between text-white text-[11px] font-bold tracking-tight select-none">
          <span>09:41</span>
          
          {/* Camera Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 space-x-1 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Signal className="w-3 h-3 fill-current" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 fill-current text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="bg-slate-50 text-slate-900 rounded-[36px] overflow-hidden min-h-[640px] max-h-[760px] overflow-y-auto scrollbar-none border border-slate-200">
          {children}
        </div>

        {/* Bottom Home Gesture Indicator */}
        <div className="pt-2 pb-1 bg-slate-900 rounded-b-[40px] flex justify-center">
          <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
        <Smartphone className="w-4 h-4 text-emerald-600" />
        <span>Collector Smartphone Simulator (Entry-Level Android View)</span>
      </div>
    </div>
  );
};
