import React from 'react';
import { ArrowLeft, User, Phone, MapPin, ShieldCheck, Volume2, Globe, Wifi, WifiOff, Smartphone, Building2, CheckCircle2, Award, LogOut } from 'lucide-react';
import { getText } from '../../services/i18n.js';
import { syncEngine } from '../../services/syncEngine.js';
import { LocalDatabase } from '../../services/db.js';

export const CollectorProfile = ({ profile, language, setLanguage, onBack, onOpenLoginModal, isOnline, pendingCount }) => {
  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  ];

  return (
    <div className="p-4 space-y-4 pb-16 bg-slate-50 min-h-full font-sans select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-200/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getText('back', language)}</span>
        </button>

        <h2 className="text-sm font-black text-emerald-900 flex items-center space-x-1.5">
          <User className="w-4 h-4 text-emerald-600" />
          <span>{getText('profileNav', language)}</span>
        </h2>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-xl space-y-4 relative overflow-hidden border border-emerald-600/30">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
            👤
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-black text-white">{profile.name}</h1>
              <ShieldCheck className="w-4 h-4 text-emerald-300" title="Verified Collector" />
            </div>
            <p className="text-xs text-emerald-100 font-semibold font-mono">
              ID: {profile.collector_id}
            </p>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/40 text-[10px] font-bold text-emerald-200">
              <Award className="w-3 h-3 text-amber-300" />
              <span>Verified Informal Collector</span>
            </div>
          </div>
        </div>

        {/* Contact Info Details */}
        <div className="pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-100 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <span className="truncate">{profile.phone}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-100 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <span className="truncate">{profile.operating_area}</span>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
          <span className="text-[10px] uppercase font-black text-slate-400 block">Earnings</span>
          <span className="text-sm font-black text-emerald-700 block mt-0.5">
            ₹{profile.total_earnings?.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
          <span className="text-[10px] uppercase font-black text-slate-400 block">Lots Sold</span>
          <span className="text-sm font-black text-slate-900 block mt-0.5">
            {profile.lots_sold}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
          <span className="text-[10px] uppercase font-black text-slate-400 block">Rating</span>
          <span className="text-sm font-black text-amber-600 block mt-0.5">
            4.9 ★
          </span>
        </div>
      </div>

      {/* 1. Vernacular Language Selection Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>App Language / भाषा चुनें</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-bold transition-all ${
                language === lang.code
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <div className="text-left leading-tight truncate">
                <div className="font-extrabold text-[11px]">{lang.native}</div>
                <div className="text-[9px] text-slate-500 font-normal">{lang.name}</div>
              </div>
              {language === lang.code && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Account & Network Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
          Account & Connection
        </h3>

        {/* Network Sync Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
              <span>Network Status:</span>
              <span className={isOnline ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {isOnline ? 'Direct Cloud Database Sync Active' : `${pendingCount} item(s) pending local sync`}
            </div>
          </div>

          <button
            onClick={() => syncEngine.toggleNetworkMode()}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
              isOnline
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-amber-100 border-amber-300 text-amber-900'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>

        {/* Switch Account Modal Opener */}
        <button
          onClick={onOpenLoginModal}
          className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 border border-slate-200 transition-colors"
        >
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span>Switch Role / Recycler Login</span>
        </button>
      </div>
    </div>
  );
};
