import React, { useState } from 'react';
import { Ambulance } from '../types';
import { Phone, Navigation, Share2, Clock, CheckCircle2, AlertTriangle, Shield, Check } from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { useApp } from '../context/AppContext';

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onBookDispatch?: (ambulance: Ambulance) => void;
}

export const AmbulanceCard: React.FC<AmbulanceCardProps> = ({ ambulance, onBookDispatch }) => {
  const { userLocation } = useApp();
  const [copiedLocation, setCopiedLocation] = useState(false);

  const handleShareLocation = () => {
    const text = `🚨 EMERGENCY LOCATION ALERT (JibonJatra BD):
Please dispatch ambulance to: ${userLocation.address}
GPS Coordinates: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}
Requested at: ${new Date().toLocaleTimeString()}`;

    if (navigator.share) {
      navigator.share({
        title: 'Emergency Ambulance Location',
        text: text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        setCopiedLocation(true);
        setTimeout(() => setCopiedLocation(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2500);
    }
  };

  const getVehicleBadgeColor = (type: string) => {
    switch (type) {
      case 'ICU Ambulance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'AC Ambulance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Freezing Ambulance':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between gap-4">
      {/* Top Details */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getVehicleBadgeColor(ambulance.vehicleType)}`}>
                🚑 {ambulance.vehicleType}
              </span>
              {ambulance.status === 'available' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  🟢 Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  🟡 Busy on Call
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
              {ambulance.providerName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Driver: {ambulance.driverName} • Reg: {ambulance.regNumber}
            </p>
          </div>

          {/* ETA Box */}
          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-red-700 block">Est. Arrival</span>
            <span className="text-xl font-black font-display text-red-600">
              {ambulance.status === 'available' ? `${ambulance.etaMinutes}m` : 'Busy'}
            </span>
          </div>
        </div>

        {/* Distance and Hospital Affiliation */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
            <Navigation className="w-3.5 h-3.5 text-red-600" />
            {formatDistance(ambulance.distanceKm)}
          </span>
          <span>•</span>
          <span className="text-slate-500 truncate max-w-[200px]">
            {ambulance.hospitalAffiliation || 'Standby in Dhaka Sector'}
          </span>
          <span>•</span>
          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            {ambulance.fareEstimate}
          </span>
        </div>

        {/* Features Chips */}
        {ambulance.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {ambulance.features.map((feat, idx) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                ✓ {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <a
          href={`tel:${ambulance.phone}`}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-98 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md transition-all text-center tracking-wide"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span>📞 CALL NOW ({ambulance.phone})</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShareLocation}
            className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 font-semibold py-2 px-3 rounded-xl text-xs border border-blue-200 transition-all"
            title="Copy or share exact GPS coordinates to the ambulance driver"
          >
            {copiedLocation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Location Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share My Location</span>
              </>
            )}
          </button>

          {onBookDispatch && (
            <button
              type="button"
              onClick={() => onBookDispatch(ambulance)}
              className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-xl text-xs transition-all"
            >
              <span>Instant Dispatch ⚡</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
