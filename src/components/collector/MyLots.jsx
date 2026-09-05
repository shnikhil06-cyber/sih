import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, Clock } from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal.jsx';
import { LocalDatabase } from '../../services/db.js';

export const MyLots = ({ onBack }) => {
  const [lots] = useState(() => LocalDatabase.getLots());
  const [selectedLotForReceipt, setSelectedLotForReceipt] = useState(null);

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
          <FileText className="w-4 h-4 text-teal-600" />
          <span>My Lots & Digital Receipts</span>
        </h2>
      </div>

      <div className="space-y-3">
        {lots.map(lot => (
          <div
            key={lot.lot_id}
            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 block">
                  {lot.lot_id}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                  {lot.material} ({lot.weight_kg} kg)
                </h3>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                lot.transaction_status === 'RECYCLED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {lot.transaction_status}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Quoted Realization:</span>
                <span className="font-bold text-slate-900">₹{lot.quoted_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Recycler Assigned:</span>
                <span className="text-teal-800 font-bold">{lot.recycler_name || 'Pending'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sync Queue Status:</span>
                <span className={`font-bold ${lot.sync_status === 'SYNCED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {lot.sync_status === 'SYNCED' ? '🟢 Synced' : '🟠 Pending Sync'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                {lot.transaction_status === 'RECYCLED' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{new Date(lot.collection_timestamp).toLocaleDateString('en-IN')}</span>
              </div>

              <button
                onClick={() => setSelectedLotForReceipt(lot)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        lot={selectedLotForReceipt}
        onClose={() => setSelectedLotForReceipt(null)}
      />
    </div>
  );
};
