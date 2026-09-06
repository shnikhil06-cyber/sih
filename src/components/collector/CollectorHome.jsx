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
        te: 'ఈ-వేస్ట్ అమ్మండి. ఫోటో తీసి ఉత్తమ ధర పొందండి.',
        kn: 'ಇ-ತ್ಯಾಜ್ಯ ಮಾರಿ. ಫೋಟೋ ತೆಗೆದು ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ.',
        ta: 'மின் கழிவுகளை விற்கவும். படம் எடுத்து சிறந்த விலை பெறவும்.',
        gu: 'ઇ-કચરો વેચો. ફોટો પાડીને શ્રેષ્ઠ કિંમત મેળવો.',
        bn: 'ই-বর্জ্য বিক্রি করুন। ছবি তুলুন এবং সেরা দাম পান।',
        en: 'Sell E-Waste. Take photo and get best price.'
      },
      price: {
        mr: 'आजचे दर पहा. तांबे, सर्किट बोर्ड आणि बॅटरीचे सध्याचे भाव.',
        hi: 'आज का भाव देखें। तांबा, सर्किट बोर्ड और बैटरी की ताज़ा दरें।',
        te: 'ఈరోజు ధరలు చూడండి. రాగి, సర్క్యూట్ బోర్డ్ తాజా రేట్లు.',
        kn: 'ಇಂದಿನ ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ತಾಮ್ರ, ಸರ್ಕ್ಯೂಟ್ ಬೋರ್ಡ್ ಬೆಲೆಗಳು.',
        ta: 'இன்றைய விலையை சரிபார்க்கவும். தாமிரம் மற்றும் சர்க்யூட் போர்டு.',
        gu: 'આજના ભાવ જુઓ. તાંબુ અને સર્કિટ બોર્ડના નવા દરો.',
        bn: 'আজকের দাম দেখুন। তামা, সার্কিট বোর্ড এবং ব্যাটারির দর।',
        en: 'Check market prices for metals and e-waste.'
      },
      recyclers: {
        mr: 'अधिकृत रीसायकलर्स शोधा. मोफत पिकअप देणारे जवळचे केंद्र.',
        hi: 'अधिकृत रिसाइकिलर खोजें। मुफ्त पिकअप केंद्र।',
        te: 'అధికారిక రీసైక్లర్లను కనుగొనండి. ఉచిత పికప్.',
        kn: 'ಅಧಿಕೃತ ರಿಸೈಕ್ಲರ್‌ಗಳನ್ನು ಹುಡುಕಿ. ಉಚಿತ ಪಿಕ್ಅಪ್.',
        ta: 'அங்கீகரிக்கப்பட்ட மறுசுழற்சியாளர்களைக் கண்டறியவும்.',
        gu: 'અધિકૃત રિસાયકલર્સ શોધો. મફત પીકઅપ.',
        bn: 'অনুমোদিত রিসাইক্লার খুঁজুন। বিনামূল্যে পিকআপ।',
        en: 'Find verified authorized recyclers near you.'
      },
      lots: {
        mr: 'माझे लॉट पहा. तुमचे जमा केलेले साहित्य आणि पोच पावती.',
        hi: 'मेरे लॉट देखें। आपकी डिजिटल रसीद और स्थिति।',
        te: 'నా లాట్‌లు చూడండి. డిజిటల్ రసీదు మరియు స్థితి.',
        kn: 'ನನ್ನ ಲಾಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ. ಡಿಜಿಟಲ್ ರಶೀದಿ.',
        ta: 'என் லாக்டுகளைப் பார்க்கவும். டிஜிட்டல் ரசீது.',
        gu: 'મારા લોટ જુઓ. ડિજિટલ રસીદ અને સ્થિતિ.',
        bn: 'আমার লট দেখুন। ডিজিটাল রসিদ ও অবস্থা।',
        en: 'View your recorded e-waste lots and receipts.'
      },
      earnings: {
        mr: 'माझी कमाई पहा. आतापर्यंत मिळालेले सर्व पैसे.',
        hi: 'मेरी कुल कमाई देखें। बैंक और नकद भुगतान।',
        te: 'నా సంపాదన చూడండి. మొత్తం నగదు సేకరించబడింది.',
        kn: 'ನನ್ನ ಗಳಿಕೆಯನ್ನು ವೀಕ್ಷಿಸಿ. ಒಟ್ಟು ಆದಾಯ.',
        ta: 'என் வருமானத்தைப் பார்க்கவும். மொத்த தொகை.',
        gu: 'મારી કમાણી જુઓ. રોકડ અને યુપીઆઈ કમાણી.',
        bn: 'আমার মোট আয় দেখুন। নগদ ও ইউপিআই টাকা।',
        en: 'View your total earnings and payment history.'
      },
      safety: {
        mr: 'सुरक्षा नियम पहा. तार जाळू नका आणि काच फोडू नका.',
        hi: 'सुरक्षा निर्देश देखें। तार जलाना सख्त मना है।',
        te: 'రక్షణ మార్గదర్శకాలు చూడండి. వైర్లు కాల్చవద్దు.',
        kn: 'ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು. ವೈರ್‌ಗಳನ್ನು ಸುಡಬೇಡಿ.',
        ta: 'பாதுகாப்பு விதிகளைப் பார்க்கவும். கம்பிகளை எரிக்க வேண்டாம்.',
        gu: 'સુરક્ષા માર્ગદર્શિકા જુઓ. વાયર સળગાવશો નહીં.',
        bn: 'সুরক্ষা নির্দেশাবলী দেখুন। তার পোড়াবেন না।',
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
        <span>Authorized Channel Guarantee: Up to +20% higher earnings</span>
      </div>
    </div>
  );
};
