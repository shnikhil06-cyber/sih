import React from 'react';
import { X, CheckCircle, Printer, Download } from 'lucide-react';

export const ReceiptModal = ({ lot, onClose }) => {
  if (!lot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
            ♻️
          </div>
          <h2 className="text-xl font-black tracking-wide text-emerald-800">
            E-WASTE HANDOVER RECEIPT
          </h2>
          <p className="text-xs text-slate-500 font-medium">Official Formal Channel Traceability Certificate</p>
        </div>

        {/* Receipt Content Card */}
        <div className="my-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200 font-mono text-sm space-y-3 shadow-inner">
          <div className="flex justify-between items-center text-slate-500 text-xs pb-2 border-b border-slate-200">
            <span>Lot ID:</span>
            <span className="font-bold text-emerald-700">{lot.lot_id}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Collector:</span>
              <span className="font-bold text-slate-800">{lot.collector_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Material:</span>
              <span className="font-bold text-amber-700">{lot.material}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Weight:</span>
              <span className="font-bold text-slate-900">{lot.verified_weight_kg || lot.weight_kg} kg</span>
            </div>
            <div>
              <span className="text-slate-500 block">Condition:</span>
              <span className="font-semibold text-slate-700">{lot.condition}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Quoted Estimated:</span>
              <span>₹{lot.quoted_price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-emerald-700">
              <span>Final Verified Realization:</span>
              <span>₹{(lot.final_price || lot.quoted_price)?.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Recycler Facility:</span>
              <span className="font-bold text-teal-700 truncate block">
                {lot.recycler_name || 'Authorized Recycler'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Handover Date:</span>
              <span className="text-slate-700">
                {new Date(lot.handover_timestamp || lot.collection_timestamp).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Method:</span>
              <span className="font-bold text-emerald-700">{lot.payment_method || 'CASH'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Traceability Status:</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {lot.transaction_status}
              </span>
            </div>
          </div>

          {/* Digital Verification QR Code */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            <div className="space-y-0.5 font-sans">
              <span className="text-[11px] font-black text-slate-800 uppercase block">Traceability Certificate QR</span>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Scan for government MPCB compliance audit verification</p>
            </div>

            {/* Simulated QR Code Graphic */}
            <div className="w-14 h-14 bg-slate-900 p-1 rounded-lg flex flex-col justify-between flex-shrink-0">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-2 border-white rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white"></div>
                </div>
                <div className="w-4 h-4 border-2 border-white rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-4 h-4 border-2 border-white rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white"></div>
                </div>
                <div className="w-3 h-3 bg-emerald-400 rounded-xs"></div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-center space-x-2 text-emerald-800 font-sans font-extrabold text-xs bg-emerald-100/60 py-2 rounded-xl border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>✓ Digital Handover Verified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Close & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
