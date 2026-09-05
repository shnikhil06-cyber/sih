import React, { useState } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

export const UnitEconomics = () => {
  const [wasteWeightKg, setWasteWeightKg] = useState(100);
  const [informalRate, setInformalRate] = useState(100);
  const [platformRate, setPlatformRate] = useState(120);
  const [recyclerFeePercent] = useState(3.5);

  const informalRevenue = wasteWeightKg * informalRate;
  const platformRevenue = wasteWeightKg * platformRate;
  const collectorNetGain = platformRevenue - informalRevenue;
  const platformFeeEarned = Math.round(platformRevenue * (recyclerFeePercent / 100));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-20 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 rounded-3xl space-y-2 shadow-md">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-emerald-200" />
          <h1 className="text-2xl font-black text-white">Unit Economics & Business Sustainability Model</h1>
        </div>
        <p className="text-xs text-emerald-100 font-medium">
          Financial proof showing how formal digital sorting creates value for collectors without charging upfront fees.
        </p>
      </div>

      {/* Interactive Calculator Controls */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Interactive Simulation Parameters (Batch: {wasteWeightKg} kg)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Batch Weight (kg):</label>
            <input
              type="number"
              value={wasteWeightKg}
              onChange={e => setWasteWeightKg(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Informal Route Avg Realization (₹/kg):</label>
            <input
              type="number"
              value={informalRate}
              onChange={e => setInformalRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-amber-700 font-bold text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Platform Formal Route Realization (₹/kg):</label>
            <input
              type="number"
              value={platformRate}
              onChange={e => setPlatformRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-emerald-700 font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informal Route */}
        <div className="bg-white border border-red-200 p-6 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
          <div className="flex justify-between items-center pt-1">
            <h3 className="font-extrabold text-red-800 text-lg">Existing Informal Route</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
              Unregulated Middleman
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Collection Batch:</span>
              <span className="font-bold text-slate-900">{wasteWeightKg} kg mixed e-waste</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Middleman Buy Rate:</span>
              <span className="font-bold text-amber-700">₹{informalRate}/kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">Collector Total Revenue:</span>
            <span className="text-3xl font-black text-slate-900">₹{informalRevenue.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 space-y-1 font-medium">
            <p>❌ Opaque weighing scales (10-15% under-weighing loss)</p>
            <p>❌ Unsafe open burning & acid bath health hazards</p>
          </div>
        </div>

        {/* Platform Formal Route */}
        <div className="bg-white border border-emerald-300 p-6 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
          <div className="flex justify-between items-center pt-1">
            <h3 className="font-extrabold text-emerald-800 text-lg">Platform Formal Route</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Direct Verified Matching
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>AI Sorted Material Realization:</span>
              <span className="font-bold text-slate-900">{wasteWeightKg} kg @ high-grade rate</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Recycler Competitive Rate:</span>
              <span className="font-bold text-emerald-700">₹{platformRate}/kg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">Collector Total Realization:</span>
            <span className="text-3xl font-black text-emerald-700">₹{platformRevenue.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1 font-medium">
            <p className="font-bold text-emerald-800">
              🎉 Net Benefit to Informal Collector: +₹{collectorNetGain.toLocaleString()} (+20% income)
            </p>
            <p>✓ Zero upfront charge to informal collectors</p>
          </div>
        </div>
      </div>

      {/* Sustainable Revenue Model Breakdown */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-teal-600" />
          <span>Platform Revenue & Business Model Pillars</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Recycler Commission Fee</h4>
            <p className="text-slate-600 text-[11px] font-medium">
              3.5% transaction processing fee charged to authorized recyclers for verified material sourcing (Yields ₹{platformFeeEarned.toLocaleString()} per 100kg batch).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">B2B Extended Producer Responsibility (EPR)</h4>
            <p className="text-slate-600 text-[11px] font-medium">
              EPR compliance audit credits sold to electronics manufacturers (OEMs) for verified digital chain-of-custody lot certificates.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
              3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Institutional Bulk Contracts</h4>
            <p className="text-slate-600 text-[11px] font-medium">
              Logistics fee from corporate e-waste aggregation contracts (IT parks, offices, government tenders).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
