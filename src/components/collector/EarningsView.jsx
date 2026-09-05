import React from 'react';
import { ArrowLeft, Wallet, CheckCircle2 } from 'lucide-react';

export const EarningsView = ({ profile, onBack }) => {
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

        <h2 className="text-sm font-bold text-emerald-800 flex items-center space-x-1">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Earnings & Income History</span>
        </h2>
      </div>

      {/* Main Total Earnings Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-black text-emerald-100 tracking-wider">
            Total Formal Realization
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/30">
            {profile.lots_sold} Lots Sold
          </span>
        </div>

        <h1 className="text-4xl font-black text-white">
          ₹{profile.total_earnings.toLocaleString()}
        </h1>

        <div className="pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-emerald-100 block">Pending Handover:</span>
            <span className="font-bold text-amber-200">₹{profile.pending_earnings.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-emerald-100 block">Payment Methods:</span>
            <span className="font-bold text-white">CASH / UPI / Bank</span>
          </div>
        </div>
      </div>

      {/* Earnings Benefit Alert */}
      <div className="p-3.5 bg-white border border-emerald-200 rounded-xl flex items-center space-x-3 text-xs shadow-xs">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
          📈
        </div>
        <div>
          <h4 className="font-bold text-emerald-800">Platform Value Realization: +₹7,800 Extra</h4>
          <p className="text-slate-500 text-[11px] font-medium">
            By avoiding middleman informal routes, you gained 20% higher earnings on your last 28 lots.
          </p>
        </div>
      </div>

      {/* Payment Ledger History */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700">Recent Payment Ledger</h3>
        <div className="space-y-2 text-xs">
          {[
            { id: 'LOT-182', mat: 'PCB (35 kg)', amount: 15050, mode: 'CASH', date: '05-09-2026', status: 'Completed' },
            { id: 'LOT-180', mat: 'Motor (15 kg)', amount: 2700, mode: 'CASH', date: '03-09-2026', status: 'Completed' },
            { id: 'LOT-179', mat: 'Cable (20 kg)', amount: 10400, mode: 'UPI', date: '02-09-2026', status: 'Completed' },
          ].map(tx => (
            <div
              key={tx.id}
              className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">{tx.mat}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{tx.id} • {tx.mode} • {tx.date}</span>
                </div>
              </div>

              <span className="font-black text-emerald-700 text-sm">
                +₹{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
