import React from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import { VERIFIED_RECYCLERS_DATASET } from '../../services/mockData.js';

export const RecyclerFinder = ({ onBack }) => {
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

        <h2 className="text-sm font-bold text-teal-800 flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Verified Recycler Database</span>
        </h2>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Authorized MPCB registered recyclers operating in Pune & Maharashtra regions.
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
                  <span>{rec.location} • {rec.distanceKm} km</span>
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
                <span>Materials Accepted:</span>
                <span className="font-bold text-teal-800">{rec.materials_accepted.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-700 font-mono font-bold">{rec.contact}</span>
              </div>
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
