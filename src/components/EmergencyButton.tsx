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
    <div className={`flex flex-col items-center gap-2.5 ${className}`}>
      <button
        onClick={() => setIsEmergencyModeOpen(true)}
        className={`w-full max-w-md group relative inline-flex items-center justify-center font-display font-extrabold tracking-wide text-white transition-all transform active:scale-95 duration-200 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 shadow-emergency hover:shadow-emergency-lg hover:-translate-y-0.5 border-2 border-red-400/40 ${
          size === 'large' ? 'py-4 px-8 text-xl sm:text-2xl' : 'py-3 px-6 text-base sm:text-lg'
        }`}
        aria-label="Get Immediate Emergency Help"
      >
        {/* Pulsing glow ring */}
        <span className="absolute -inset-1 rounded-2xl bg-red-600 opacity-30 group-hover:opacity-60 blur-lg transition duration-300"></span>

        <span className="relative flex items-center gap-3">
          <span className="flex h-4 w-4 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
          <span className="text-2xl filter drop-shadow">🚨</span>
          <span className="drop-shadow-sm font-black">GET EMERGENCY HELP</span>
        </span>
      </button>

      {showLocationPrompt && (
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-700 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-colors"
          title="Detect and refresh GPS location"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          ) : (
            <Navigation className={`w-3.5 h-3.5 ${userLocation.isLive ? 'text-emerald-600 fill-emerald-600' : 'text-red-600'}`} />
          )}
          <span>
            {userLocation.isLive ? '📍 Location Active: ' : '📍 Use my current location: '}
            <strong className="text-slate-900 font-medium truncate max-w-[200px] inline-block align-bottom">
              {userLocation.address}
            </strong>
          </span>
        </button>
      )}
    </div>
  );
};
