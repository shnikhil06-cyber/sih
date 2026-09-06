import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, Clock, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal.jsx';
import { LocalDatabase } from '../../services/db.js';
import { getText } from '../../services/i18n.js';

export const MyLots = ({ language, onBack }) => {
  const [lots] = useState(() => LocalDatabase.getLots());
  const [selectedLotForReceipt, setSelectedLotForReceipt] = useState(null);
  const [expandedLotId, setExpandedLotId] = useState(null);

  const toggleTimeline = (lotId) => {
    setExpandedLotId(expandedLotId === lotId ? null : lotId);
  };

  const getTimelineSteps = (lot) => {
    const isCompleted = lot.transaction_status === 'RECYCLED';
    const isAccepted = lot.transaction_status === 'ACCEPTED_BY_RECYCLER' || isCompleted;

    return [
      { id: '1', title: getText('timeline.lotCreated', language), date: lot.collection_timestamp, done: true },
      { id: '2', title: getText('timeline.priceQuoted', language), date: lot.collection_timestamp, done: true },
      { id: '3', title: getText('timeline.recyclerSelected', language), date: lot.collection_timestamp, done: true },
      { id: '4', title: getText('timeline.pickupScheduled', language), date: lot.collection_timestamp, done: true },
      { id: '5', title: getText('timeline.handoverDone', language), date: lot.handover_timestamp || lot.collection_timestamp, done: isAccepted },
      { id: '6', title: getText('timeline.recyclerConfirmed', language), date: lot.handover_timestamp, done: isCompleted },
      { id: '7', title: getText('timeline.paymentCompleted', language), date: lot.handover_timestamp, done: isCompleted },
      { id: '8', title: getText('timeline.recycledFinished', language), date: lot.handover_timestamp, done: isCompleted },
    ];
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
          <span>{getText('back', language)}</span>
        </button>

        <h2 className="text-sm font-bold text-teal-800 flex items-center space-x-1">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>{getText('myLots', language)}</span>
        </h2>
      </div>

      <div className="space-y-3">
        {lots.map(lot => {
          const isExpanded = expandedLotId === lot.lot_id;
          const timelineSteps = getTimelineSteps(lot);

          return (
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
                    {lot.material} {lot.sub_category ? `(${lot.sub_category})` : ''} — {lot.weight_kg} kg
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
                    {lot.sync_status === 'SYNCED' ? '🟢 Synced to Server' : '🟠 Stored Offline (Pending Sync)'}
                  </span>
                </div>
              </div>

              {/* Traceability Timeline Accordion Toggle */}
              <button
                onClick={() => toggleTimeline(lot.lot_id)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isExpanded ? 'Hide Traceability Timeline' : 'View Digital Traceability Timeline'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Expanded Traceability Timeline Vertical Stepper */}
              {isExpanded && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Digital Traceability Certificate Chain
                  </h4>
                  <div className="relative border-l-2 border-slate-300 ml-2 pl-4 space-y-3 text-xs">
                    {timelineSteps.map(step => (
                      <div key={step.id} className="relative flex items-start space-x-2">
                        {/* Dot */}
                        <div className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                          step.done
                            ? 'bg-emerald-600 border-white ring-2 ring-emerald-400'
                            : 'bg-slate-200 border-slate-400'
                        }`} />
                        <div>
                          <span className={`font-bold ${step.done ? 'text-emerald-800' : 'text-slate-400'}`}>
                            {step.title}
                          </span>
                          {step.done && (
                            <span className="text-[10px] text-slate-500 block font-mono">
                              {new Date(step.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
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
          );
        })}
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        lot={selectedLotForReceipt}
        onClose={() => setSelectedLotForReceipt(null)}
      />
    </div>
  );
};
