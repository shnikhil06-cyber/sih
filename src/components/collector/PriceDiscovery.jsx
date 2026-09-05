import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Volume2, MapPin } from 'lucide-react';
import { INITIAL_PRICE_DATASET, INITIAL_MATERIALS } from '../../services/mockData.js';
import { TTSService } from '../../services/ttsService.js';

export const PriceDiscovery = ({ language, onBack }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('PCB');

  const selectedRecord = INITIAL_PRICE_DATASET.find(p => p.material === selectedMaterial) || INITIAL_PRICE_DATASET[0];
  const matInfo = INITIAL_MATERIALS.find(m => m.id === selectedMaterial) || INITIAL_MATERIALS[0];

  const handleSpeakPrice = () => {
    const text = language === 'mr'
      ? `${selectedMaterial} चा सध्याचा दर ₹${selectedRecord.prevailingPrice} प्रति किलो आहे. भाव वाढत आहेत.`
      : language === 'hi'
      ? `${selectedMaterial} का ताज़ा भाव ₹${selectedRecord.prevailingPrice} प्रति किलोग्राम है। कीमत बढ़ रही है।`
      : `${selectedMaterial} current prevailing rate is ₹${selectedRecord.prevailingPrice} per kg. Prices are rising.`;
    TTSService.speak(text, language);
  };

  return (
    <div className="p-4 space-y-4 pb-16 bg-slate-50 min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold py-1 px-2.5 rounded-lg bg-slate-200/70"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-sm font-bold text-emerald-800 flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Price Discovery Engine</span>
        </h2>
      </div>

      {/* Material Selector Chips */}
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {INITIAL_MATERIALS.map(mat => (
          <button
            key={mat.id}
            onClick={() => setSelectedMaterial(mat.id)}
            className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedMaterial === mat.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{mat.icon}</span>
            <span>{mat.id}</span>
          </button>
        ))}
      </div>

      {/* Main Material Price Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl">
              {matInfo.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{selectedMaterial}</h3>
              <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedRecord.location} Region • {selectedRecord.date}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSpeakPrice}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            title="Read out price audio"
          >
            <Volume2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        {/* Current Rate Display */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Prevailing Market Rate
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-3xl font-black text-emerald-700">
                ₹{selectedRecord.prevailingPrice}
              </span>
              <span className="text-xs font-bold text-slate-500">/ kg</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Price Rising</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-1 font-medium">
              Offers: {selectedRecord.recyclerOfferRange}/kg
            </span>
          </div>
        </div>

        {/* 7-Day Trend Visual Sparkline */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">
            Last 7 Days Trend:
          </span>

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            {selectedRecord.history7Days.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">{item.date}</span>
                  <span className={`font-bold ${idx === selectedRecord.history7Days.length - 1 ? 'text-emerald-700 text-sm font-black' : 'text-slate-700'}`}>
                    ₹{item.price}
                  </span>
                </div>
                {idx < selectedRecord.history7Days.length - 1 && (
                  <span className="text-slate-400 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Benchmark Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700">Live Regional Price Benchmark Table</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Material</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5">Unit</th>
                <th className="p-2.5 text-right">Prevailing Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {INITIAL_PRICE_DATASET.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-emerald-700">{row.material}</td>
                  <td className="p-2.5">{row.location}</td>
                  <td className="p-2.5 text-slate-500">{row.unit}</td>
                  <td className="p-2.5 text-right font-black text-slate-900">₹{row.prevailingPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
