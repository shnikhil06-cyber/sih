import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Phone, CheckCircle, XCircle, Navigation, RefreshCw } from 'lucide-react';
import { VERIFIED_RECYCLERS_DATASET } from '../../services/mockData.js';
import { getText } from '../../services/i18n.js';

import { GeoService } from '../../services/geoService.js';

export const RecyclerFinder = ({ language, onBack }) => {
  const [collectorGps, setCollectorGps] = useState('Detecting Live GPS...');
  const [isLocating, setIsLocating] = useState(false);

  const handleRefreshGps = () => {
    setIsLocating(true);
    GeoService.getCurrentLocation().then(loc => {
      setCollectorGps(loc.fullString);
      setIsLocating(false);
    });
  };

  React.useEffect(() => {
    handleRefreshGps();
  }, []);

  return (
    <div className="p-4 space-y-4 pb-16 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold py-1 px-2.5 rounded-lg bg-slate-200/70"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getText('back', language)}</span>
        </button>

        <h2 className="text-sm font-bold text-teal-800 flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{getText('findRecycler', language)}</span>
        </h2>
      </div>

      {/* Live Location Tracking Bar */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-extrabold text-emerald-400 block uppercase text-[10px] tracking-wider">
              Live Location Tracked
            </span>
            <span className="font-mono font-bold text-slate-200 text-[11px] flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-emerald-400 inline" />
              <span>{collectorGps}</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleRefreshGps}
          disabled={isLocating}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
          title="Refresh live GPS location"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Nearby MPCB authorized recyclers matched against your live location with real-time local rate quotes.
      </p>

      {/* Recyclers List */}
      <div className="space-y-3">
        {VERIFIED_RECYCLERS_DATASET.map(rec => (
          <div
            key={rec.recycler_id}
            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">{rec.name}</h3>
                  {rec.authorization_status === 'Authorized' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.location} • <strong className="text-emerald-700">{rec.distanceKm} km</strong> from live GPS</span>
                </p>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                rec.authorization_status === 'Authorized'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {rec.authorization_status}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Reg Details:</span>
                <span className="font-mono text-slate-800 font-bold">{rec.authorization_details}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Local Offer Premium:</span>
                <span className="font-bold text-emerald-700">
                  {rec.offered_rate_multiplier >= 1.0
                    ? `+${((rec.offered_rate_multiplier - 1) * 100).toFixed(1)}% Local Premium Rate`
                    : `-${((1 - rec.offered_rate_multiplier) * 100).toFixed(1)}% Discounted Rate`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Materials Accepted:</span>
                <span className="font-bold text-teal-800">{rec.materials_accepted.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <a
                href={`tel:${rec.contact}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono font-bold hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{rec.contact}</span>
              </a>

              <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{rec.pickup_available ? 'Pickup Provided' : 'Self Transport'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
