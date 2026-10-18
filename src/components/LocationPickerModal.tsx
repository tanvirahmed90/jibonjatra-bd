import React, { useState } from 'react';
import { X, Navigation, MapPin, Search, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POPULAR_BANGLADESH_AREAS } from '../utils/geo';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose }) => {
  const { userLocation, requestGeolocation, setUserCustomLocation, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLiveGPSClick = async () => {
    setIsLocating(true);
    setErrorMessage(null);
    try {
      const success = await requestGeolocation(false);
      if (success) {
        onClose();
      } else {
        // Detect environment reason
        if (typeof window !== 'undefined' && window.isSecureContext === false) {
          const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (!isLocal) {
            setErrorMessage('INSECURE_HTTP');
            return;
          }
        }
        setErrorMessage('GPS_UNAVAILABLE');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectArea = (area: typeof POPULAR_BANGLADESH_AREAS[0]) => {
    setUserCustomLocation(area.lat, area.lng, `${area.name}`);
    showToast(`📍 এলাকা সেট করা হয়েছে: ${area.nameBn || area.name}`);
    onClose();
  };

  const filteredAreas = POPULAR_BANGLADESH_AREAS.filter(area => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      area.name.toLowerCase().includes(q) ||
      (area.nameBn && area.nameBn.includes(q)) ||
      area.division.toLowerCase().includes(q)
    );
  });

  const dhakaAreas = filteredAreas.filter(a => a.division === 'Dhaka');
  const otherDivisions = filteredAreas.filter(a => a.division !== 'Dhaka');

  return (
    <div className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                আপনার লোকেশন নির্বাচন করুন
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                আশেপাশের নিকটবর্তী হাসপাতাল ও জরুরি সেবা খুঁজতে এলাকা বেছে নিন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Location Badge & 1-Tap Auto GPS */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">বর্তমান অবস্থান:</span>
            <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
              userLocation.isLive 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${userLocation.isLive ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`}></span>
              {userLocation.isLive ? 'লাইভ GPS সক্রিয়' : 'ডিফল্ট লোকেশন'}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-800 truncate bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{userLocation.address}</span>
          </div>

          {/* Live GPS Button */}
          <button
            type="button"
            onClick={handleLiveGPSClick}
            disabled={isLocating}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'মোবাইল GPS খোঁজা হচ্ছে...' : '🎯 আমার ফোনের লাইভ GPS দিয়ে অটো ডিটেক্ট করুন'}</span>
          </button>

          {/* Android Help Guide if GPS fails */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {errorMessage === 'INSECURE_HTTP' 
                    ? 'মোবাইল ব্রাউজার সিকিউরিটি সীমাবদ্ধতা (HTTP)' 
                    : 'লাইভ GPS সিগন্যাল পাওয়া যায়নি'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90">
                {errorMessage === 'INSECURE_HTTP' ? (
                  <>
                    Android Chrome সিকিউরিটি পলিসি অনুযায়ী <strong>HTTP</strong> লিংকে লাইভ জিপিএস স্বয়ংক্রিয়ভাবে বন্ধ থাকে (শুধুমাত্র HTTPS লিংকে কাজ করে)। নিচের তালিকা থেকে ১-ট্যাপে আপনার এলাকা নির্বাচন করুন।
                  </>
                ) : (
                  <>
                    ১. ফোনের নোটিফিকেশন বার নামিয়ে <strong>Location (GPS)</strong> চালু আছে কিনা দেখুন।<br />
                    ২. ক্রোম ব্রাউজারের সাইট সেটিংসে গিয়ে <strong>Location Allow</strong> করুন। অথবা নিচের তালিকা থেকে আপনার এলাকা বেছে নিন।
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="এলাকা বা জেলার নাম খুঁজুন (যেমন: Dhanmondi, Chittagong, Mirpur)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Area List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Dhaka Metro Section */}
          {dhakaAreas.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>ঢাকা মহানগরী ও পার্শ্ববর্তী এলাকা</span>
                <span>({dhakaAreas.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dhakaAreas.map((area) => {
                  const isCurrent = Math.abs(userLocation.lat - area.lat) < 0.005 && Math.abs(userLocation.lng - area.lng) < 0.005;
                  return (
                    <button
                      key={area.name}
                      type="button"
                      onClick={() => handleSelectArea(area)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isCurrent 
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs font-bold'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold truncate group-hover:text-red-600 transition-colors">
                          {area.nameBn || area.name.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {area.name.split('/')[0]}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Divisions Section */}
          {otherDivisions.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>অন্যান্য বিভাগ ও প্রধান শহর</span>
                <span>({otherDivisions.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {otherDivisions.map((area) => {
                  const isCurrent = Math.abs(userLocation.lat - area.lat) < 0.005 && Math.abs(userLocation.lng - area.lng) < 0.005;
                  return (
                    <button
                      key={area.name}
                      type="button"
                      onClick={() => handleSelectArea(area)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isCurrent 
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs font-bold'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold truncate group-hover:text-red-600 transition-colors">
                          {area.nameBn || area.name.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {area.division} Division
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAreas.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              কোনো এলাকা পাওয়া যায়নি। ভিন্ন বানান দিয়ে সার্চ করুন।
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>৫০০+ সরকারি ও বিশেষায়িত হাসপাতালের দূরত্ব সাথে সাথে আপডেট হবে</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
