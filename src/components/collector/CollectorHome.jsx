import React from 'react';
import { Volume2, ChevronRight, UserCheck, ShieldCheck } from 'lucide-react';
import { TTSService } from '../../services/ttsService.js';
import { getText } from '../../services/i18n.js';

export const CollectorHome = ({ profile, language, onNavigate }) => {
  const getSpokenText = (key) => {
    const translations = {
      sell: {
        mr: 'ई-कचरा विका. फोटो काढा आणि उत्तम दर मिळवा.',
        hi: 'ई-कचरा बेचें। फोटो खींचें और सबसे अच्छी कीमत पाएं।',
        en: 'Sell E-Waste. Take photo and get best price quote.'
      },
      price: {
        mr: 'आजचे दर पहा. तांबे, सर्किट बोर्ड आणि बॅटरीचे सध्याचे भाव.',
        hi: 'आज का भाव देखें। तांबा, सर्किट बोर्ड और बैटरी की ताज़ा दरें।',
        en: 'Check market prices for metals and e-waste.'
      },
      recyclers: {
        mr: 'अधिकृत रीसायकलर्स शोधा. मोफत पिकअप देणारे जवळचे केंद्र.',
        hi: 'अधिकृत रिसाइकिलर खोजें। मुफ्त पिकअप केंद्र।',
        en: 'Find verified authorized recyclers near you.'
      },
      lots: {
        mr: 'माझे लॉट पहा. तुमचे जमा केलेले साहित्य आणि पोच पावती.',
        hi: 'मेरे लॉट देखें। आपकी डिजिटल रसीद और स्थिति।',
        en: 'View your recorded e-waste lots and traceability receipts.'
      },
      earnings: {
        mr: 'माझी कमाई पहा. आतापर्यंत मिळालेले सर्व पैसे.',
        hi: 'मेरी कुल कमाई देखें। बैंक और नकद भुगतान बही।',
        en: 'View your total earnings and payment history.'
      },
      safety: {
        mr: 'सुरक्षा नियम पहा. तार जाळू नका आणि ॲसिड वापरू नका.',
        hi: 'सुरक्षा निर्देश देखें। तार जलाना और तेज़ाब इस्तेमाल करना मना है।',
        en: 'View e-waste handling safety guidelines.'
      }
    };
    return translations[key]?.[language] || translations[key]?.['en'] || '';
  };

  const handleSpeak = (e, key) => {
    e.stopPropagation();
    TTSService.speak(getSpokenText(key), language);
  };

  return (
    <div className="p-4 space-y-4 pb-12 bg-slate-50 min-h-full">
      {/* Collector Profile Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-inner">
            👤
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="font-bold text-white text-base">{profile.name}</h2>
              <UserCheck className="w-4 h-4 text-emerald-200" />
            </div>
            <p className="text-xs text-emerald-100 font-medium">ID: {profile.collector_id} • {profile.operating_area}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-extrabold text-emerald-200 block tracking-wider">
            {language === 'mr' ? 'एकूण कमाई' : language === 'hi' ? 'कुल आय' : 'Total Realized'}
          </span>
          <span className="text-lg font-black text-white">₹{profile.total_earnings.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid of 6 Main Touch Targets for Low Literacy */}
      <div className="grid grid-cols-1 gap-3">
        {/* 1. Sell E-Waste */}
        <div
          onClick={() => onNavigate('sell')}
          className="group relative bg-emerald-600 hover:bg-emerald-700 text-white p-4.5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-sm">
              📷
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide">
                {getText('sellEWaste', language)}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {getText('sellEWasteDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'sell')}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
              title="Voice instruction"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>
            <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Check Price */}
        <div
          onClick={() => onNavigate('price')}
          className="group bg-white border border-slate-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {getText('checkPrice', language)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {getText('checkPriceDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'price')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. Find Recycler */}
        <div
          onClick={() => onNavigate('recyclers')}
          className="group bg-white border border-slate-200 hover:border-teal-400 p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-2xl">
              ♻️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {getText('findRecycler', language)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {getText('findRecyclerDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'recyclers')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. My Lots */}
        <div
          onClick={() => onNavigate('lots')}
          className="group bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {getText('myLots', language)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {getText('myLotsDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'lots')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 5. My Earnings */}
        <div
          onClick={() => onNavigate('earnings')}
          className="group bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl">
              💵
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {getText('myEarnings', language)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {getText('myEarningsDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'earnings')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 6. Safety */}
        <div
          onClick={() => onNavigate('safety')}
          className="group bg-white border border-red-200 hover:border-red-400 p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="text-base font-bold text-red-700">
                {getText('safetyRules', language)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {getText('safetyRulesDesc', language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => handleSpeak(e, 'safety')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Trust Banner Footer */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center space-x-2 text-xs text-slate-600 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>
          {language === 'mr'
            ? 'अधिकृत रीसायकलर्सचे गॅरंटीड दर: +२०% पर्यंत जास्त कमाई'
            : language === 'hi'
            ? 'सरकारी मान्यता प्राप्त रिसाइकिलर: +२०% तक अधिक आय'
            : 'Authorized Channel Guarantee: Up to +20% higher earnings'}
        </span>
      </div>
    </div>
  );
};
