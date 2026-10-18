import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LocationBannerProps {
  className?: string;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({ className = '' }) => {
  const { userLocation, requestGeolocation, setIsLocationModalOpen } = useApp();
  const [isLocating, setIsLocating] = useState(false);

  const handleLiveGPS = async () => {
    setIsLocating(true);
    try {
      await requestGeolocation(false);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className={`w-full bg-white rounded-2xl border border-slate-200/90 shadow-card-soft p-3 sm:p-4 transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Location Details */}
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
            userLocation.isLive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900">
                আপনার বর্তমান সেন্টার:
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                userLocation.isLive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${userLocation.isLive ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`}></span>
                {userLocation.isLive ? 'লাইভ GPS সক্রিয়' : 'ডিফল্ট লোকেশন'}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold truncate mt-0.5" title={userLocation.address}>
              {userLocation.address}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Live GPS button */}
          <button
            type="button"
            onClick={handleLiveGPS}
            disabled={isLocating}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 ${
              userLocation.isLive 
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="Detect GPS"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className={`w-3.5 h-3.5 ${userLocation.isLive ? 'text-emerald-600 fill-emerald-600' : ''}`} />
            )}
            <span>{isLocating ? 'GPS খোঁজা হচ্ছে...' : userLocation.isLive ? 'GPS রিফ্রেশ' : 'লাইভ GPS দিন'}</span>
          </button>

          {/* Change Area Modal trigger */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200/80"
          >
            <Compass className="w-3.5 h-3.5 text-slate-600" />
            <span>এলাকা পরিবর্তন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
