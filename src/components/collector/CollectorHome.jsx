import React from 'react';
import { Volume2, ChevronRight, UserCheck, ShieldCheck } from 'lucide-react';
import { TTSService } from '../../services/ttsService.js';

export const CollectorHome = ({ profile, language, onNavigate }) => {
  const getSpokenText = (key) => {
    switch (key) {
      case 'sell':
        return language === 'mr'
          ? 'ई-कचरा विका. फोटो काढा आणि उत्तम दर मिळवा.'
          : language === 'hi'
          ? 'ई-कचरा बेचें। फोटो खींचें और सबसे अच्छी कीमत पाएं।'
          : 'Sell E-Waste. Take photo and get best price.';
      case 'price':
        return language === 'mr'
          ? 'आजचे दर पहा. तांबे, सर्किट बोर्ड आणि बॅटरीचे सध्याचे भाव.'
          : language === 'hi'
          ? 'आज का भाव देखें। तांबा, सर्किट बोर्ड और बैटरी की ताज़ा दरें।'
          : 'Check market prices for metals and e-waste.';
      case 'recyclers':
        return language === 'mr'
          ? 'अधिकृत रीसायकलर्स शोधा. मोफत पिकअप देणारे जवळचे केंद्र.'
          : language === 'hi'
          ? 'अधिकृत रिसाइकिलर खोजें। मुफ्त पिकअप केंद्र।'
          : 'Find verified authorized recyclers near you.';
      case 'lots':
        return language === 'mr'
          ? 'माझे लॉट पहा. तुमचे जमा केलेले साहित्य आणि पोच पावती.'
          : language === 'hi'
          ? 'मेरे लॉट देखें। आपकी डिजिटल रसीद और स्थिति।'
          : 'View your recorded e-waste lots and receipts.';
      case 'earnings':
        return language === 'mr'
          ? 'माझी कमाई पहा. आतापर्यंत मिळालेले सर्व पैसे.'
          : language === 'hi'
          ? 'मेरी कुल कमाई देखें। बैंक और नकद भुगतान।'
          : 'View your total earnings and payment history.';
      case 'safety':
        return language === 'mr'
          ? 'सुरक्षा नियम पहा. तार जाळू नका आणि काच फोडू नका.'
          : language === 'hi'
          ? 'सुरक्षा निर्देश देखें। तार जलाना सख्त मना है।'
          : 'View e-waste handling safety guidelines.';
      default:
        return '';
    }
  };

  const handleSpeak = (e, key) => {
    e.stopPropagation();
    TTSService.speak(getSpokenText(key), language);
  };

  return (
    <div className="p-4 space-y-4 pb-12 bg-slate-50 min-h-full">
      {/* Collector Profile Card */}
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
          <span className="text-[10px] uppercase font-extrabold text-emerald-200 block tracking-wider">Total Realized</span>
          <span className="text-lg font-black text-white">₹{profile.total_earnings.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid of 6 Large Touch Targets for Low Literacy */}
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
                {language === 'mr' ? 'ई-कचरा विका' : language === 'hi' ? 'ई-कचरा बेचें' : 'Sell E-Waste'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {language === 'mr'
                  ? 'फोटो काढा • वजन टाका • भाव मिळवा'
                  : language === 'hi'
                  ? 'फोटो लें • वज़न दर्ज करें • कीमत पाएं'
                  : 'Photo → Weight → instant price quote'}
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
                {language === 'mr' ? 'आजचे दर पहा' : language === 'hi' ? 'आज का भाव देखें' : 'Check Market Price'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'PCB ₹420/kg • कॉपर ₹520/kg' : language === 'hi' ? 'PCB ₹420/किग्रा • तांबा ₹520/किग्रा' : 'Live historical rate dataset'}
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
                {language === 'mr' ? 'अधिकृत रीसायकलर्स' : language === 'hi' ? 'अधिकृत रिसाइकिलर' : 'Authorized Recyclers'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'जवळचे प्रमाणित केंद्र • पिकअप' : language === 'hi' ? 'सरकारी मान्यता प्राप्त • पिकअप' : 'Verified MPCB certified buyers'}
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
                {language === 'mr' ? 'माझे लॉट व पावती' : language === 'hi' ? 'मेरे लॉट और रसीद' : 'My Lots & Receipts'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'डिजिटल रसीद • डिलिव्हरी स्टेटस' : language === 'hi' ? 'डिजिटल रसीद • डिलीवरी स्थिति' : 'Digital traceability records'}
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
                {language === 'mr' ? 'माझी एकूण कमाई' : language === 'hi' ? 'मेरी कुल कमाई' : 'My Earnings'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'नकद आणि UPI द्वारे मिळालेले पैसे' : language === 'hi' ? 'नकद और UPI द्वारा प्राप्त आय' : 'Cash & digital payment records'}
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
                {language === 'mr' ? 'सुरक्षा निर्देश' : language === 'hi' ? 'सुरक्षा नियम' : 'Safety Rules'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'तार न जाळणे • बॅटरीची काळजी' : language === 'hi' ? 'तार मत जलाएं • जहरीले धुएं से बचाव' : 'Pictorial & voice safety cards'}
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
        <span>Authorized Channel Guarantee: Up to +20% higher earnings</span>
      </div>
    </div>
  );
};
