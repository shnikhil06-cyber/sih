import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, MapPin, AlertTriangle, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LocalDatabase } from '../../services/db.js';
import { syncEngine } from '../../services/syncEngine.js';
import { AIEngine } from '../../services/aiEngine.js';
import { ReceiptModal } from '../common/ReceiptModal.jsx';

export const RecyclerDashboard = () => {
  const [lots, setLots] = useState(() => LocalDatabase.getLots());
  const [selectedLot, setSelectedLot] = useState(null);

  const [verifiedWeight, setVerifiedWeight] = useState(35);
  const [finalPriceInput, setFinalPriceInput] = useState(15050);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [anomalyResult, setAnomalyResult] = useState(null);
  const [receiptLot, setReceiptLot] = useState(null);

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((_online, _pending, updatedLots) => {
      setLots(updatedLots);
    });
    return unsubscribe;
  }, []);

  const handlePriceChange = (newPrice, category, weight) => {
    setFinalPriceInput(newPrice);
    if (newPrice > 0) {
      const result = AIEngine.detectAbnormalTransaction(category, weight, newPrice);
      setAnomalyResult(result);
    } else {
      setAnomalyResult(null);
    }
  };

  const handleAcceptLot = (lot) => {
    const updated = {
      ...lot,
      transaction_status: 'ACCEPTED_BY_RECYCLER',
      handover_timestamp: new Date().toISOString(),
    };
    LocalDatabase.saveLot(updated);
    syncEngine.notify();
    setSelectedLot(updated);
    setVerifiedWeight(lot.weight_kg);

    const val = AIEngine.calculateValuation(lot.material, lot.weight_kg);
    handlePriceChange(val.suggestedQuotedPrice, lot.material, lot.weight_kg);
  };

  const handleCompleteHandover = () => {
    if (!selectedLot) return;

    const anomaly = AIEngine.detectAbnormalTransaction(selectedLot.material, verifiedWeight, finalPriceInput);

    const completedLot = {
      ...selectedLot,
      verified_weight_kg: verifiedWeight,
      final_price: finalPriceInput,
      payment_method: paymentMethod,
      payment_status: 'COMPLETED',
      transaction_status: 'RECYCLED',
      handover_timestamp: new Date().toISOString(),
      anomaly_flag: anomaly.isAnomaly
        ? {
            is_anomaly: true,
            expected_price: anomaly.expectedPrice,
            actual_price: finalPriceInput,
            deviation_percent: anomaly.deviationPercent,
            reason: anomaly.warningMessage,
          }
        : undefined,
    };

    LocalDatabase.saveLot(completedLot);
    syncEngine.notify();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setReceiptLot(completedLot);
    setSelectedLot(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 pb-20 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 text-2xl font-bold">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">ABC Eco-Recycling Pvt Ltd</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized MPCB Facility</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Facility Location: Hadapsar Industrial Estate, Pune • Reg: MPCB/EW-REG/2024/0981
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 font-medium">
          <span>Active Service Zone:</span>
          <span className="font-bold text-teal-800">Pune East & Central</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Today's Requests</span>
          <span className="text-3xl font-black text-slate-900">12</span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Pending Pickups</span>
          <span className="text-3xl font-black text-amber-600">
            {lots.filter(l => l.transaction_status !== 'RECYCLED').length}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Completed Lots</span>
          <span className="text-3xl font-black text-emerald-700">
            {lots.filter(l => l.transaction_status === 'RECYCLED').length}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Material Recycled</span>
          <span className="text-3xl font-black text-teal-700">640 kg</span>
        </div>
      </div>

      {/* Main Grid: Incoming Lots Queue vs Handover Processing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incoming Lots Queue */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Incoming E-Waste Collection Lots</span>
            <span className="text-xs text-slate-500 font-normal">Real-time Sync</span>
          </h2>

          <div className="space-y-3">
            {lots.map(lot => (
              <div
                key={lot.lot_id}
                className={`bg-white border rounded-2xl p-4 space-y-3 transition-all ${
                  selectedLot?.lot_id === lot.lot_id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 block">{lot.lot_id}</span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                      {lot.material} — {lot.weight_kg} kg
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

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-700 flex items-center space-x-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Collector Location: Hadapsar, Pune (4.2 km away)</span>
                  </p>
                  <p className="text-slate-600">
                    Estimated Value: <strong className="text-emerald-700">₹{lot.estimated_value_min.toLocaleString()}–₹{lot.estimated_value_max.toLocaleString()}</strong>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-1">
                  {lot.transaction_status !== 'RECYCLED' ? (
                    <button
                      onClick={() => handleAcceptLot(lot)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                    >
                      Accept & Verify Handover
                    </button>
                  ) : (
                    <button
                      onClick={() => setReceiptLot(lot)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center justify-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Handover Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Handover Verification & Anomaly Detector Portal */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Verifiable Handover & Payment Verification
          </h2>

          {selectedLot ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold">{selectedLot.lot_id}</span>
                  <h3 className="font-black text-slate-900 text-lg">{selectedLot.material} Collection</h3>
                </div>
                <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-semibold">
                  Collector ID: {selectedLot.collector_id}
                </span>
              </div>

              {/* Weight Verification Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Step 1: Recycler Verified Weight (kg)
                </label>
                <input
                  type="number"
                  value={verifiedWeight}
                  onChange={e => {
                    const w = Number(e.target.value);
                    setVerifiedWeight(w);
                    handlePriceChange(finalPriceInput, selectedLot.material, w);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Final Price Input with Anomaly Trigger */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    Step 2: Enter Agreed Total Realization (₹)
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Standard: ₹{(selectedLot.quoted_price || 14700).toLocaleString()}
                  </span>
                </div>

                <input
                  type="number"
                  value={finalPriceInput}
                  onChange={e => handlePriceChange(Number(e.target.value), selectedLot.material, verifiedWeight)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-emerald-700 font-black text-lg focus:outline-none focus:border-emerald-500"
                />

                {/* Abnormal Transaction Warning Alert */}
                {anomalyResult?.isAnomaly && (
                  <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-900 text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center space-x-2 font-black text-red-700">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce text-red-600" />
                      <span>⚠️ Abnormal Transaction Alert Flagged by System</span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                      {anomalyResult.warningMessage}
                    </p>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1 border-t border-red-200">
                      <div>Expected: ₹{anomalyResult.expectedPrice.toLocaleString()}</div>
                      <div>Actual: ₹{anomalyResult.actualPrice.toLocaleString()}</div>
                      <div className="font-bold text-red-700">Deviation: {anomalyResult.deviationPercent}%</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Step 3: Select Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['CASH', 'UPI', 'BANK_TRANSFER'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === mode
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Confirm Handover */}
              <button
                onClick={handleCompleteHandover}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 text-base"
              >
                <Check className="w-5 h-5" />
                <span>CONFIRM HANDOVER & RECORD PAYMENT</span>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
                📋
              </div>
              <p className="text-sm font-semibold text-slate-500">
                Select an incoming lot from the queue to verify weight, process pricing, and confirm digital handover.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        lot={receiptLot}
        onClose={() => setReceiptLot(null)}
      />
    </div>
  );
};
