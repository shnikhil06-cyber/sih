import React from 'react';
import { Smartphone, Building2, Volume2, Wifi, WifiOff, X, CheckCircle2 } from 'lucide-react';
import { syncEngine } from '../../services/syncEngine.js';
import { getText } from '../../services/i18n.js';

export const AppLoginModal = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  isOnline,
  pendingCount,
  isInsidePhone = false,
}) => {
  if (!isOpen) return null;

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
    <div className={`${
      isInsidePhone
        ? 'absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-xs animate-fadeIn rounded-[36px] overflow-hidden'
        : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn'
    }`}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-4 space-y-3 shadow-2xl border border-slate-200 relative max-h-[92%] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-600/30">
            ♻️
          </div>
          <h2 className="text-xl font-black text-slate-900">Kabadiwala Connect</h2>
          <p className="text-xs text-slate-500 font-medium">Digital Traceability & Vernacular App</p>
        </div>

        {/* 1. Language Selection Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-extrabold text-slate-700 flex items-center space-x-1.5">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Select App Language / भाषा चुनें:</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  language === lang.code
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <div className="text-left leading-tight truncate">
                  <div className="font-extrabold">{lang.native}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{lang.name}</div>
                </div>
                {language === lang.code && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Login Role Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-extrabold text-slate-700 block">
            Switch Account / Login Role:
          </label>

          {/* Collector Login Button */}
          <button
            onClick={() => {
              setActiveTab('collector');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
              activeTab === 'collector'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
              activeTab === 'collector' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">Collector App (रमेश पवार)</div>
              <div className={`text-xs ${activeTab === 'collector' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Informal E-Waste Collector Interface
              </div>
            </div>
          </button>

          {/* Recycler Login Button */}
          <button
            onClick={() => {
              setActiveTab('recycler');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
              activeTab === 'recycler'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/30'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
              activeTab === 'recycler' ? 'bg-white/20' : 'bg-teal-100 text-teal-700'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">Recycler Portal (ABC Eco)</div>
              <div className={`text-xs ${activeTab === 'recycler' ? 'text-emerald-100' : 'text-slate-500'}`}>
                MPCB Facility Verification Portal
              </div>
            </div>
          </button>
        </div>

        {/* 3. Offline / Online Simulation Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-600">
            Network Mode: <span className={isOnline ? 'text-emerald-600' : 'text-amber-600'}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          <button
            onClick={() => syncEngine.toggleNetworkMode()}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isOnline
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Simulate Offline' : 'Simulate Online'}</span>
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all mt-2"
        >
          {getText('confirm', language)}
        </button>
      </div>
    </div>
  );
};
