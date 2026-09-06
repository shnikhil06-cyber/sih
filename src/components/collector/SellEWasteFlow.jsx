import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Sparkles, Check, ChevronRight, AlertTriangle, ShieldCheck, MapPin, Upload, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_MATERIALS } from '../../services/mockData.js';
import { AIEngine } from '../../services/aiEngine.js';
import { RecyclerMatcher } from '../../services/recyclerMatcher.js';
import { LocalDatabase } from '../../services/db.js';
import { syncEngine } from '../../services/syncEngine.js';
import { TTSService } from '../../services/ttsService.js';
import { getText } from '../../services/i18n.js';

import { GeoService } from '../../services/geoService.js';

export const SellEWasteFlow = ({
  language,
  onBack,
  onLotCreated,
  isOnline,
}) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  const [photoUrl, setPhotoUrl] = useState(INITIAL_MATERIALS[0].imageUrl);
  const [aiResult, setAiResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('PCB');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Green Motherboard');
  const [weightKg, setWeightKg] = useState(35);
  const [condition, setCondition] = useState('Mixed');
  const [gpsLocation, setGpsLocation] = useState('Detecting Live GPS...');
  const [valuation, setValuation] = useState(null);
  const [recyclerMatches, setRecyclerMatches] = useState([]);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [createdLot, setCreatedLot] = useState(null);

  React.useEffect(() => {
    GeoService.getCurrentLocation().then(loc => {
      setGpsLocation(loc.fullString);
    });
  }, []);

  const handlePhotoSelected = (sampleImg, categorySeed) => {
    setPhotoUrl(sampleImg);
    const classification = AIEngine.classifyPhoto(categorySeed);
    setAiResult(classification);
    setSelectedCategory(classification.detectedCategory);
    setSelectedSubCategory(classification.detectedSubCategory);

    // Refresh live location
    GeoService.getCurrentLocation().then(loc => {
      setGpsLocation(loc.fullString);
    });

    const spoken = language === 'mr'
      ? `एआय ने ओळखले: ${classification.detectedCategory}. अचूकता: ${classification.confidenceScore} टक्के.`
      : language === 'hi'
      ? `एआई ने पहचाना: ${classification.detectedCategory}। सटीकता: ${classification.confidenceScore} प्रतिशत।`
      : `AI identified material as ${classification.detectedCategory} with ${classification.confidenceScore}% confidence.`;
    TTSService.speak(spoken, language);

    setStep(2);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const url = evt.target?.result;
        handlePhotoSelected(url, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const mat = INITIAL_MATERIALS.find(m => m.id === catId);
    if (mat && mat.subCategories && mat.subCategories.length > 0) {
      setSelectedSubCategory(mat.subCategories[0]);
    }
  };

  const handleProceedToValuation = () => {
    const val = AIEngine.calculateValuation(selectedCategory, weightKg, condition);
    setValuation(val);

    const matches = RecyclerMatcher.findBestRecyclers(selectedCategory, weightKg, 'Pune');
    setRecyclerMatches(matches);
    if (matches.length > 0) {
      setSelectedRecycler(matches[0]);
    }

    setStep(4);
  };

  const handleCreateLot = () => {
    if (!selectedRecycler || !valuation) return;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const lotId = `LOT-2026-PN-${randomNum}`;

    const newLot = {
      lot_id: lotId,
      collector_id: 'COL-00128',
      material: selectedCategory,
      sub_category: selectedSubCategory,
      material_description: `${weightKg}kg ${selectedCategory} - ${selectedSubCategory} (${condition} grade)`,
      photo_url: photoUrl,
      weight_kg: weightKg,
      condition,
      estimated_value_min: valuation.minEstimate,
      estimated_value_max: valuation.maxEstimate,
      quoted_price: selectedRecycler.totalQuotedPrice,
      collection_location: gpsLocation,
      collection_timestamp: new Date().toISOString(),
      recycler_id: selectedRecycler.recycler.recycler_id,
      recycler_name: selectedRecycler.recycler.name,
      payment_status: 'PENDING',
      transaction_status: 'RECYCLER_SELECTED',
      sync_status: isOnline ? 'SYNCED' : 'PENDING_SYNC',
    };

    LocalDatabase.saveLot(newLot);
    syncEngine.notify();
    setCreatedLot(newLot);
    onLotCreated(newLot);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setStep(5);
  };

  const currentMatObj = INITIAL_MATERIALS.find(m => m.id === selectedCategory) || INITIAL_MATERIALS[0];

  return (
    <div className="p-4 space-y-4 pb-16 bg-slate-50 min-h-full">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold py-1 px-2.5 rounded-lg bg-slate-200/70"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? getText('home', language) : getText('back', language)}</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          {getText('step', language)} {step} {getText('of', language)} 5
        </span>
      </div>

      {/* STEP 1: Take Photo / Upload File */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              {getText('step1Title', language)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {getText('step1Subtitle', language)}
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Camera / File Trigger Card */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-dashed border-emerald-400 hover:border-emerald-600 p-6 rounded-2xl text-center space-y-3 cursor-pointer group transition-all shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center justify-center space-x-2">
                <span>{getText('openCamera', language)}</span>
                <Upload className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">Tap to select image from camera or photo library</p>
            </div>
          </div>

          {/* Preset Visual Samples for Quick Demo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>{getText('orSelectSample', language)}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {INITIAL_MATERIALS.map(mat => (
                <div
                  key={mat.id}
                  onClick={() => handlePhotoSelected(mat.imageUrl, mat.id)}
                  className="bg-white border border-slate-200 hover:border-emerald-500 p-2.5 rounded-xl cursor-pointer flex items-center space-x-3 transition-all active:scale-[0.97] shadow-xs"
                >
                  <img src={mat.imageUrl} alt={mat.nameEn} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <div className="overflow-hidden">
                    <span className="text-lg block">{mat.icon}</span>
                    <span className="text-xs font-bold text-slate-900 truncate block">{mat.id}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">₹{mat.avgPricePerKg}/kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AI Classification & Sub-Category Confirmation */}
      {step === 2 && aiResult && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                <span className="text-xs font-black uppercase text-emerald-800">
                  {getText('aiOutput', language)}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                {aiResult.confidenceScore}% {getText('confidence', language)}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-200">
              <img src={photoUrl} alt="Captured" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
              <div>
                <span className="text-xs text-slate-500 block">Detected Material:</span>
                <h3 className="text-lg font-black text-emerald-700">{selectedCategory}</h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  {currentMatObj.nameHi}
                </p>
              </div>
            </div>

            {aiResult.isLowConfidence && (
              <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Confidence low. Please select your material from the picture grid below:</span>
              </div>
            )}
          </div>

          {/* Sub-Category Selector */}
          {currentMatObj.subCategories && (
            <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <label className="text-xs font-bold text-slate-700 block">
                {getText('selectSubCategory', language)}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentMatObj.subCategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                      selectedSubCategory === sub
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pictorial Material Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Confirm or override material category:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {INITIAL_MATERIALS.map(mat => (
                <div
                  key={mat.id}
                  onClick={() => handleCategoryChange(mat.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    selectedCategory === mat.id
                      ? 'bg-emerald-100 border-emerald-500 text-slate-900 ring-2 ring-emerald-500/40 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{mat.icon}</span>
                  <div>
                    <span className="font-bold text-xs block">{mat.id}</span>
                    <span className="text-[10px] text-slate-500 block">{mat.nameHi}</span>
                  </div>
                  {selectedCategory === mat.id && (
                    <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 text-sm"
          >
            <span>Confirm Material & Enter Weight</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: Enter Weight & Location Capture */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              {getText('step3Title', language)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Selected: <strong className="text-emerald-700">{selectedCategory} ({selectedSubCategory})</strong>
            </p>
          </div>

          {/* Weight Keypad */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4 shadow-md">
            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(Math.max(1, Number(e.target.value)))}
                className="w-32 text-center text-4xl font-black bg-slate-50 border-2 border-emerald-500 rounded-xl py-2 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-2xl font-black text-slate-500">kg</span>
            </div>

            {/* Quick Presets */}
            <div className="flex justify-center space-x-2">
              {[5, 15, 35, 50, 100].map(w => (
                <button
                  key={w}
                  onClick={() => setWeightKg(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    weightKg === w
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>

            {/* Condition Selector */}
            <div className="pt-3 border-t border-slate-100 text-left space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">{getText('conditionGrade', language)}</label>
              <div className="grid grid-cols-2 gap-2">
                {['Clean', 'Mixed', 'High Grade', 'Damaged'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      condition === c
                        ? 'bg-teal-100 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Location Display */}
            <div className="pt-3 border-t border-slate-100 text-left text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-600 flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Collection Location (GPS Tagged):</span>
              </span>
              <p className="text-slate-800 font-mono text-[11px] font-bold">{gpsLocation}</p>
            </div>
          </div>

          <button
            onClick={handleProceedToValuation}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 text-base"
          >
            <span>GET ESTIMATED PRICE & MATCH RECYCLERS</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 4: AI Valuation & Recycler Ranking Selection */}
      {step === 4 && valuation && (
        <div className="space-y-4 animate-fadeIn">
          {/* Estimated Value Card */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-sm space-y-2">
            <span className="text-[11px] uppercase font-black text-emerald-800 tracking-wider">
              {getText('estimatedValuation', language)}
            </span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                ₹{valuation.minEstimate.toLocaleString()} – ₹{valuation.maxEstimate.toLocaleString()}
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-md border border-emerald-300">
                ₹{valuation.ratePerKg}/kg
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{valuation.marketTrendNote}</p>
          </div>

          {/* Recycler Ranking List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700">
                {getText('matchedRecyclers', language)} ({recyclerMatches.length})
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold">Ranked by Recycler Score</span>
            </div>

            <div className="space-y-2.5">
              {recyclerMatches.map((res, index) => {
                const isSelected = selectedRecycler?.recycler.recycler_id === res.recycler.recycler_id;
                return (
                  <div
                    key={res.recycler.recycler_id}
                    onClick={() => setSelectedRecycler(res)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 text-sm">{res.recycler.name}</span>
                          {res.recycler.authorization_status === 'Authorized' && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{res.distance} km away • {res.recycler.location}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-700">₹{res.quotedPricePerKg}/kg</span>
                        <span className="text-[11px] text-slate-500 block font-semibold">
                          Total: ₹{res.totalQuotedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold ${res.pickupAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {res.pickupAvailable ? '✅ Pickup Available' : '❌ No Pickup'}
                        </span>
                        <span className="text-slate-500">Score: {res.score}/100</span>
                      </div>

                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] italic text-slate-500 font-medium">{res.recommendationReason}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleCreateLot}
            disabled={!selectedRecycler}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 text-base"
          >
            <span>{getText('createLotBtn', language)}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 5: Lot Created Confirmation */}
      {step === 5 && createdLot && (
        <div className="space-y-5 text-center animate-fadeIn py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-md">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
              {getText('step5Title', language)}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{createdLot.lot_id}</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Recycler <strong className="text-slate-800">{createdLot.recycler_name}</strong> has been assigned for handover.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl text-left text-xs space-y-2 shadow-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Material:</span>
              <span className="font-bold text-slate-900">{createdLot.material} - {createdLot.sub_category} ({createdLot.weight_kg} kg)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Quoted Realization:</span>
              <span className="font-bold text-emerald-700">₹{createdLot.quoted_price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sync Status:</span>
              <span className={`font-bold ${createdLot.sync_status === 'SYNCED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {createdLot.sync_status === 'SYNCED' ? '🟢 Synced to Server' : '🟠 Stored Offline (Pending Sync)'}
              </span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md"
          >
            {getText('returnHome', language)}
          </button>
        </div>
      )}
    </div>
  );
};
