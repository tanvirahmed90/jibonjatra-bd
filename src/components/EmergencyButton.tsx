import React, { useState } from 'react';
import { AlertCircle, Navigation, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EmergencyButtonProps {
  size?: 'normal' | 'large';
  className?: string;
  showLocationPrompt?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  size = 'large',
  className = '',
  showLocationPrompt = true,
}) => {
  const { setIsEmergencyModeOpen, requestGeolocation, userLocation } = useApp();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocating(true);
    await requestGeolocation();
    setIsLocating(false);
  };

  return (
    <div className={`flex flex-col items-center gap-2 sm:gap-2.5 ${className}`}>
      <button
        onClick={() => setIsEmergencyModeOpen(true)}
        className={`w-full max-w-[340px] sm:max-w-md group relative inline-flex items-center justify-center font-display font-black tracking-wide text-white transition-all transform active:scale-95 duration-200 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 shadow-emergency hover:shadow-emergency-lg hover:-translate-y-0.5 border border-red-400/40 ${
          size === 'large'
            ? 'py-3 px-4 sm:py-4 sm:px-8 text-sm sm:text-lg lg:text-xl'
            : 'py-2 px-3.5 sm:py-2.5 sm:px-6 text-xs sm:text-sm'
        }`}
        aria-label="Get Immediate Emergency Help"
      >
        {/* Pulsing glow ring */}
        <span className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-red-600 opacity-25 group-hover:opacity-50 blur-md transition duration-300"></span>

        <span className="relative flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
          <span className="flex h-3 w-3 sm:h-3.5 sm:w-3.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-white"></span>
          </span>
          <span className="text-lg sm:text-2xl filter drop-shadow shrink-0">🚨</span>
          <span className="drop-shadow-sm font-black uppercase tracking-wider">
            GET EMERGENCY HELP
          </span>
        </span>
      </button>

      {showLocationPrompt && (
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-red-700 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200/90 shadow-xs transition-colors max-w-[92vw] sm:max-w-md truncate"
          title="Detect and refresh GPS location"
        >
          {isLocating ? (
            <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-red-600 shrink-0" />
          ) : (
            <Navigation className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${userLocation.isLive ? 'text-emerald-600 fill-emerald-600' : 'text-red-600'}`} />
          )}
          <span className="truncate">
            {userLocation.isLive ? '📍 Location Active: ' : '📍 Use my current location: '}
            <strong className="text-slate-900 font-semibold truncate max-w-[150px] sm:max-w-[220px] inline-block align-bottom">
              {userLocation.address}
            </strong>
          </span>
        </button>
      )}
    </div>
  );
};
