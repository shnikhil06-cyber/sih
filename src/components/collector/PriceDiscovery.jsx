import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Volume2, MapPin, Navigation, RefreshCw, Compass } from 'lucide-react';
import { INITIAL_PRICE_DATASET, INITIAL_MATERIALS } from '../../services/mockData.js';
import { TTSService } from '../../services/ttsService.js';
import { GeoService } from '../../services/geoService.js';
import { getText } from '../../services/i18n.js';

export const LOCAL_NEIGHBORHOOD_PRICES = [
  {
    area: 'Hadapsar Industrial, Pune',
    distanceKm: 2.1,
    materialPrices: { PCB: 435, Cable: 540, LCD: 90, Motor: 185, Battery: 145 },
    nearbyDemand: 'HIGH',
    note: 'Highest rate for Copper & PCBs due to direct MPCB smelter proximity.',
  },
  {
    area: 'Chakan MIDC Phase 2, Pune',
    distanceKm: 14.0,
    materialPrices: { PCB: 420, Cable: 550, LCD: 85, Motor: 190, Battery: 150 },
    nearbyDemand: 'HIGH',
    note: 'Heavy industrial buyer hub; premium rates for Motors & Industrial Cable.',
  },
  {
    area: 'Kasba Peth / Old City, Pune',
    distanceKm: 4.8,
    materialPrices: { PCB: 390, Cable: 490, LCD: 78, Motor: 165, Battery: 130 },
    nearbyDemand: 'MEDIUM',
    note: 'Local unverified aggregator quotes; -10% lower realization.',
  },
  {
    area: 'Swargate / Pune South',
    distanceKm: 6.2,
    materialPrices: { PCB: 415, Cable: 515, LCD: 84, Motor: 175, Battery: 138 },
    nearbyDemand: 'MEDIUM',
    note: 'Moderate competitive rates for small appliance scrap.',
  },
  {
    area: 'Taloja, Navi Mumbai',
    distanceKm: 118.0,
    materialPrices: { PCB: 440, Cable: 545, LCD: 95, Motor: 185, Battery: 148 },
    nearbyDemand: 'HIGH',
    note: 'Navi Mumbai export hub; top quotes for LCD Screens & Lithium cells.',
  },
];

export const PriceDiscovery = ({ language, onBack }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('PCB');
  const [selectedArea, setSelectedArea] = useState('Hadapsar Industrial, Pune');
  const [liveGps, setLiveGps] = useState({
    lat: 18.5089,
    lng: 73.9259,
    accuracy: 'Accurate (±5m)',
    address: 'Detecting Live Location...',
    trackingStatus: 'ACTIVE',
  });
  const [isLocating, setIsLocating] = useState(false);

  const activeAreaObj = LOCAL_NEIGHBORHOOD_PRICES.find(l => l.area === selectedArea) || LOCAL_NEIGHBORHOOD_PRICES[0];
  const selectedRecord = INITIAL_PRICE_DATASET.find(p => p.material === selectedMaterial) || INITIAL_PRICE_DATASET[0];
  const matInfo = INITIAL_MATERIALS.find(m => m.id === selectedMaterial) || INITIAL_MATERIALS[0];

  const handleRefreshLocation = () => {
    setIsLocating(true);
    GeoService.getCurrentLocation().then(loc => {
      setLiveGps({
        lat: loc.lat,
        lng: loc.lng,
        accuracy: 'High Precision GPS',
        address: loc.placeName,
        trackingStatus: 'ACTIVE',
      });
      setIsLocating(false);
    });
  };

  React.useEffect(() => {
    handleRefreshLocation();
  }, []);

  const handleSpeakPrice = () => {
    const localRate = activeAreaObj.materialPrices[selectedMaterial] || selectedRecord.prevailingPrice;
    const text = language === 'mr'
      ? `${selectedArea} मध्ये ${selectedMaterial} चा स्थानिक दर ₹${localRate} प्रति किलो आहे.`
      : language === 'hi'
      ? `${selectedArea} में ${selectedMaterial} का स्थानीय भाव ₹${localRate} प्रति किग्रा है।`
      : `${selectedMaterial} local sell price in ${selectedArea} is ₹${localRate} per kg.`;
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
          <span>{getText('back', language)}</span>
        </button>

        <h2 className="text-sm font-bold text-emerald-800 flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Price Discovery & Live Location Engine</span>
        </h2>
      </div>

      {/* Live Location Tracking Card Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Live GPS Location Tracked
            </span>
          </div>

          <button
            onClick={handleRefreshLocation}
            disabled={isLocating}
            className="flex items-center space-x-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/20 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-emerald-300 flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>{liveGps.lat}° N, {liveGps.lng}° E</span>
            </span>
            <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded font-semibold">
              {liveGps.accuracy}
            </span>
          </div>
          <p className="text-slate-200 text-[11px] font-medium">{liveGps.address}</p>
        </div>
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

      {/* Local Neighborhood Selector */}
      <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Select Nearby Locality / Area Rate Index:</span>
        </label>
        <select
          value={selectedArea}
          onChange={e => setSelectedArea(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {LOCAL_NEIGHBORHOOD_PRICES.map(loc => (
            <option key={loc.area} value={loc.area}>
              📍 {loc.area} ({loc.distanceKm} km away)
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500 italic font-medium">{activeAreaObj.note}</p>
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
                <span>{selectedArea}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSpeakPrice}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            title="Read out local price audio"
          >
            <Volume2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        {/* Current Rate Display */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Local Neighborhood Sell Price
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-3xl font-black text-emerald-700">
                ₹{activeAreaObj.materialPrices[selectedMaterial] || selectedRecord.prevailingPrice}
              </span>
              <span className="text-xs font-bold text-slate-500">/ kg</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Demand: {activeAreaObj.nearbyDemand}</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-1 font-medium">
              Distance: {activeAreaObj.distanceKm} km
            </span>
          </div>
        </div>

        {/* 7-Day Trend Visual Sparkline */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">
            7-Day Rate Movement:
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

      {/* Local Neighborhood Price Benchmark Comparison Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700">Nearby Localities Sell Price Comparison ({selectedMaterial})</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Locality / Area</th>
                <th className="p-2.5">Distance</th>
                <th className="p-2.5">Demand</th>
                <th className="p-2.5 text-right">Local Rate ({selectedMaterial})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {LOCAL_NEIGHBORHOOD_PRICES.map(row => (
                <tr
                  key={row.area}
                  onClick={() => setSelectedArea(row.area)}
                  className={`cursor-pointer transition-colors ${selectedArea === row.area ? 'bg-emerald-50 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-2.5 text-slate-900 font-bold">{row.area}</td>
                  <td className="p-2.5 text-slate-500">{row.distanceKm} km</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.nearbyDemand === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                      {row.nearbyDemand}
                    </span>
                  </td>
                  <td className="p-2.5 text-right font-black text-emerald-700">
                    ₹{row.materialPrices[selectedMaterial] || 400}/kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
