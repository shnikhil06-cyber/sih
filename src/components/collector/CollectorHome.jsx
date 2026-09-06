import React from 'react';
import { Volume2, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { TTSService } from '../../services/ttsService.js';
import { getText } from '../../services/i18n.js';
import { GeoService } from '../../services/geoService.js';
import { LocalDatabase } from '../../services/db.js';

export const CollectorHome = ({ profile, language, onNavigate }) => {
  const [liveLocationName, setLiveLocationName] = React.useState(profile.operating_area || 'Detecting Location...');
  const [recentLots, setRecentLots] = React.useState([]);

  React.useEffect(() => {
    GeoService.getCurrentLocation().then((loc) => {
      if (loc && loc.placeName) {
        setLiveLocationName(loc.placeName);
      }
    });

    // Load recent lots from local database
    const lots = LocalDatabase.getLots();
    setRecentLots(lots);
  }, []);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'mr' ? 'शुभ प्रभात' : language === 'hi' ? 'सुप्रभात' : 'Good morning';
    }
    if (hour < 17) {
      return language === 'mr' ? 'शुभ दुपार' : language === 'hi' ? 'नमस्कार' : 'Good afternoon';
    }
    return language === 'mr' ? 'शुभ संध्या' : language === 'hi' ? 'शुभ संध्या' : 'Good evening';
  };

  // Get collector name or default to Ramesh
  const collectorName = profile.name ? profile.name.split(' ')[0] : 'Ramesh';

  const getSpokenText = (key) => {
    const translations = {
      sell: {
        mr: 'ई-कचरा विका. फोटो काढा आणि सर्वोत्तम दर कोटेशन मिळवा.',
        hi: 'ई-कचरा बेचें। फोटो खींचें और सबसे अच्छी कीमत पाएं।',
        en: 'Sell E-Waste. Get price quote.',
      },
      lots: {
        mr: 'माझे ॲक्टिव्ह लॉट. कलेक्शन ट्रॅक करा.',
        hi: 'मेरा सक्रिय लॉट। कलेक्शन ट्रैक करें।',
        en: 'My Active Lot. Track collection.',
      },
      price: {
        mr: 'मार्केट प्राइस. आजचे दर तपासा.',
        hi: 'मार्केट प्राइस। दरें जांचें।',
        en: 'Market Price. Check rates.',
      },
      recyclers: {
        mr: 'रीसायकलर्स. अधिकृत केंद्र शोधा.',
        hi: 'रिसाइकिलर। अधिकृत खोजें।',
        en: 'Recyclers. Find authorized facilities.',
      },
      earnings: {
        mr: 'माझी एकूण कमाई पहा.',
        hi: 'मेरी कुल कमाई देखें।',
        en: 'View total earnings.',
      },
      safety: {
        mr: 'सुरक्षा नियम पहा.',
        hi: 'सुरक्षा निर्देश देखें।',
        en: 'View safety instructions.',
      },
    };
    return translations[key]?.[language] || translations[key]?.['en'] || '';
  };

  const handleSpeak = (e, key) => {
    e.stopPropagation();
    TTSService.speak(getSpokenText(key), language);
  };

  const totalEarningsDisplay = profile.total_earnings
    ? profile.total_earnings.toLocaleString('en-IN')
    : '42,500';

  return (
    <div className="p-4 space-y-4 pb-6 bg-slate-50 min-h-full font-sans select-none">
      {/* 1. Greeting Section */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center space-x-1.5 tracking-tight">
            <span>{getGreetingTime()}, {collectorName}</span>
            <span className="text-xl inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {getText('greetingSubtitle', language)}
          </p>
        </div>

        {/* Location Badge */}
        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300/60 shadow-2xs">
          <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
          <span className="truncate max-w-[110px]">{liveLocationName}</span>
        </div>
      </div>

      {/* 2. Total Earnings Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-xl space-y-3 relative overflow-hidden border border-emerald-600/30">
        {/* Decorative Background Blur Accent */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-lg">💰</span>
            <span className="text-[11px] uppercase font-black tracking-wider text-emerald-200">
              {getText('totalEarningsLabel', language)}
            </span>
          </div>

          <button
            onClick={(e) => handleSpeak(e, 'earnings')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
            title="Listen total earnings"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-3xl font-black tracking-tight text-white">
          ₹{totalEarningsDisplay}
        </div>

        {/* Growth & Action Sub-row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/20 text-xs">
          <span className="font-extrabold text-emerald-200 flex items-center space-x-1">
            <span>{getText('thisMonthGrowth', language)}</span>
          </span>

          <button
            onClick={() => onNavigate('earnings')}
            className="flex items-center space-x-1 font-bold text-white hover:text-emerald-100 transition-all bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl text-xs backdrop-blur-xs border border-white/25 shadow-2xs active:scale-95"
          >
            <span>{getText('viewEarningsBtn', language)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. QUICK ACTIONS Section */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {getText('quickActionsHeader', language)}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Sell E-Waste */}
          <div
            onClick={() => onNavigate('sell')}
            className="bg-white border border-slate-200 hover:border-emerald-500 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.97] group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                📷
              </div>
              <button
                onClick={(e) => handleSpeak(e, 'sell')}
                className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                title="Voice instruction"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                {getText('sellEWaste', language)}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {getText('sellEWasteSub', language)}
              </p>
            </div>
          </div>

          {/* Action 2: My Active Lot */}
          <div
            onClick={() => onNavigate('lots')}
            className="bg-white border border-slate-200 hover:border-emerald-500 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.97] group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-100/80 border border-cyan-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                📍
              </div>
              <button
                onClick={(e) => handleSpeak(e, 'lots')}
                className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                title="Voice instruction"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                {getText('myActiveLot', language)}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {getText('trackCollection', language)}
              </p>
            </div>
          </div>

          {/* Action 3: Market Price */}
          <div
            onClick={() => onNavigate('price')}
            className="bg-white border border-slate-200 hover:border-emerald-500 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.97] group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                💰
              </div>
              <button
                onClick={(e) => handleSpeak(e, 'price')}
                className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                title="Voice instruction"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                {getText('marketPrice', language)}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {getText('checkRates', language)}
              </p>
            </div>
          </div>

          {/* Action 4: Recyclers */}
          <div
            onClick={() => onNavigate('recyclers')}
            className="bg-white border border-slate-200 hover:border-emerald-500 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.97] group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-100/80 border border-teal-200 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                ♻️
              </div>
              <button
                onClick={(e) => handleSpeak(e, 'recyclers')}
                className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                title="Voice instruction"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                {getText('recyclersNav', language)}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {getText('findAuthorized', language)}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Safety Rules Banner */}
        <div
          onClick={() => onNavigate('safety')}
          className="bg-gradient-to-r from-red-50 via-red-50/70 to-amber-50 border border-red-200/80 hover:border-red-400 p-3 rounded-2xl shadow-2xs flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-lg flex-shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="font-extrabold text-red-800 text-xs">
                {getText('safetyRules', language)}
              </h4>
              <p className="text-[10px] text-slate-600 font-medium">
                {getText('safetyRulesDesc', language)}
              </p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0" />
        </div>
      </div>

      {/* 4. RECENT ACTIVITY Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            {getText('recentActivityHeader', language)}
          </h2>

          <button
            onClick={() => onNavigate('lots')}
            className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
          >
            View all
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
          {/* Card Item 1: Lot #EW-1024 */}
          <div
            onClick={() => onNavigate('lots')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 text-xs font-mono">
                  Lot #EW-1024
                </span>
              </div>
              <div className="font-black text-emerald-700 text-sm">
                ₹2,450
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span>📦</span>
                <span>{getText('collectedStatus', language)}</span>
              </span>
              <div className="text-[10px] text-slate-500 font-medium">
                {getText('todayText', language)}
              </div>
            </div>
          </div>

          {/* Card Item 2: Lot #EW-1021 */}
          <div
            onClick={() => onNavigate('lots')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 text-xs font-mono">
                  Lot #EW-1021
                </span>
              </div>
              <div className="font-black text-emerald-700 text-sm">
                ₹1,800
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                <span>♻️</span>
                <span>{getText('atRecyclerStatus', language)}</span>
              </span>
              <div className="text-[10px] text-slate-500 font-medium">
                {getText('yesterdayText', language)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
