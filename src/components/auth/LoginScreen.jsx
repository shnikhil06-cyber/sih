import React, { useState } from 'react';
import { Smartphone, Building2, TrendingUp, Database, ArrowRight, ShieldCheck, Volume2, Lock, Phone } from 'lucide-react';
import { getText } from '../../services/i18n.js';
import { TTSService } from '../../services/ttsService.js';

export const LoginScreen = ({
  language,
  setLanguage,
  onLogin, // (role: 'collector' | 'recycler' | 'economics' | 'architecture') => void
}) => {
  const [selectedRole, setSelectedRole] = useState('collector');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [facilityId, setFacilityId] = useState('MPCB/EW-REG/2024/0981');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('1234');

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const textMap = {
      en: 'Welcome to Kabadiwala Connect. Select your role to continue.',
      hi: 'कबड्डीवाला कनेक्ट में आपका स्वागत है। आगे बढ़ने के लिए अपनी भूमिका चुनें।',
      mr: 'कबाडीवाला कनेक्ट मध्ये आपले स्वागत आहे. सुरू ठेवण्यासाठी आपली भूमिका निवडा.',
      te: 'కబాడీవాలా కనెక్ట్‌కు స్వాగతం. కొనసాగడానికి మీ పాత్రను ఎంచుకోండి.',
      ta: 'கபாடிவாலா கனெக்ட்டிற்கு வரவேற்கிறோம். தொடர உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்.',
      gu: 'કબાડીવાલા કનેક્ટમાં આપનું સ્વાગત છે. આગળ વધવા માટે તમારી ભૂમિકા પસંદ કરો.',
      bn: 'কবাডিওয়ালা কানেক্টে স্বাগতম। এগিয়ে যেতে আপনার ভূমিকা চয়ন করুন।'
    };
    TTSService.speak(textMap[newLang] || textMap['en'], newLang);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-full bg-slate-900 text-white p-5 flex flex-col justify-between space-y-6">
      {/* Top Header & Language Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 pt-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-600/30">
            ♻️
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">Kabadiwala Connect</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">E-Waste Digital Bridge</p>
          </div>
        </div>

        {/* Vernacular Language Selector Dropdown */}
        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 ml-1 mr-1" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
            <option value="mr" className="bg-slate-900">मराठी (Marathi)</option>
            <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
            <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
            <option value="gu" className="bg-slate-900">ગુજરાતી (Gujarati)</option>
            <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>

      {/* Hero Welcome Text */}
      <div className="space-y-1 text-center">
        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Digital Traceability & Fair Price
        </span>
        <h2 className="text-xl font-black tracking-tight text-slate-100 pt-2">
          {language === 'mr' ? 'अ‍ॅप मध्ये लॉगिन करा' : language === 'hi' ? 'ऐप में लॉगिन करें' : 'Sign in to Mobile App'}
        </h2>
        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
          Connect informal scrap collectors directly with MPCB authorized recyclers.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select User Role:
        </label>

        {/* Collector Role */}
        <div
          onClick={() => { setSelectedRole('collector'); setOtpSent(false); }}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
            selectedRole === 'collector'
              ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              selectedRole === 'collector' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">E-Waste Collector</h3>
              <p className="text-[11px] text-slate-400">Informal scrap collector / Kabadiwala</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedRole === 'collector' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
          }`}>
            {selectedRole === 'collector' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* Recycler Role */}
        <div
          onClick={() => { setSelectedRole('recycler'); setOtpSent(false); }}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
            selectedRole === 'recycler'
              ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              selectedRole === 'recycler' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Authorized Recycler</h3>
              <p className="text-[11px] text-slate-400">MPCB certified dismantling facility</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedRole === 'recycler' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
          }`}>
            {selectedRole === 'recycler' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* Additional Option: Analytics / Admin */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onLogin('economics')}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center space-x-2 text-xs font-bold text-slate-300 transition-all"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Unit Economics</span>
          </button>
          <button
            type="button"
            onClick={() => onLogin('architecture')}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center space-x-2 text-xs font-bold text-slate-300 transition-all"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Architecture & Data</span>
          </button>
        </div>
      </div>

      {/* Login Credentials Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3 bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80">
        {selectedRole === 'collector' ? (
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">Mobile Phone Number</label>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 space-x-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-400">+91</span>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                placeholder="Enter 10-digit number"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Demo Profile: Ramesh Pawar (COL-00128)</p>
          </div>
        ) : (
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">MPCB Authorization Number</label>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none w-full"
                placeholder="Enter MPCB reg number"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Facility: ABC Eco-Recycling Pvt Ltd (Pune)</p>
          </div>
        )}

        {otpSent && (
          <div className="animate-fadeIn">
            <label className="text-[11px] font-bold text-slate-300 block mb-1">Enter 4-Digit OTP Code</label>
            <div className="flex items-center bg-slate-900 border border-emerald-500/80 rounded-xl px-3 py-2 space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent text-sm font-bold tracking-widest text-emerald-400 focus:outline-none w-full"
                required
              />
            </div>
            <p className="text-[10px] text-emerald-400 mt-1">✅ Verified Demo OTP Auto-Filled</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
        >
          <span>{otpSent ? 'VERIFY & ENTER APP' : 'GET OTP & LOGIN'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Branding */}
      <div className="text-center pt-1 border-t border-slate-800">
        <p className="text-[10px] text-slate-400 font-medium">
          🔒 MPCB Compliant • Safe Formal Channel E-Waste Traceability
        </p>
      </div>
    </div>
  );
};
