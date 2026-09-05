import React from 'react';
import { ArrowLeft, ShieldAlert, Volume2, Check, X } from 'lucide-react';
import { SAFETY_GUIDELINES } from '../../services/mockData.js';
import { TTSService } from '../../services/ttsService.js';

export const SafetyModule = ({ language, onBack }) => {
  const handleSpeakSafety = (guideline) => {
    const text = language === 'mr'
      ? guideline.audioTextMr
      : language === 'hi'
      ? guideline.audioTextHi
      : guideline.audioTextEn;
    TTSService.speak(text, language);
  };

  return (
    <div className="p-4 space-y-4 pb-16 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold py-1 px-2.5 rounded-lg bg-slate-200/70"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-sm font-bold text-red-700 flex items-center space-x-1">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Pictorial & Voice Safety Cards</span>
        </h2>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Important health and environmental safety rules for e-waste collectors. Tap 🔊 for audio instructions.
      </p>

      {/* Safety Cards */}
      <div className="space-y-4">
        {SAFETY_GUIDELINES.map(item => {
          const title = language === 'mr' ? item.titleMr : language === 'hi' ? item.titleHi : item.titleEn;
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm relative overflow-hidden"
            >
              {/* Warning Level Accent Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.warningLevel === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'
                }`}
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      ⚠️ Hazard Warning: {item.material}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakSafety(item)}
                  className="p-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 border border-red-200 shadow-xs"
                  title="Play audio voice instructions"
                >
                  <Volume2 className="w-5 h-5 animate-pulse text-red-600" />
                </button>
              </div>

              {/* Do & Don't Visual Checklist */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-xs">
                {/* DO */}
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-800 flex items-center space-x-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>क्या करें (Do):</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5 font-medium">
                    {item.doList.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* DONT */}
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 space-y-1">
                  <span className="font-bold text-red-800 flex items-center space-x-1">
                    <X className="w-4 h-4 text-red-600" />
                    <span>क्या न करें (Don't):</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5 font-medium">
                    {item.dontList.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
