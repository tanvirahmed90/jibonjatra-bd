import React from 'react';
import { Hospital } from '../types';
import { FacilityStatus } from './FacilityStatus';
import { Phone, MapPin, ExternalLink, Star, ShieldCheck, Clock, Building2, Wind } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface HospitalCardProps {
  hospital: Hospital;
  onViewDetails: (hospital: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onViewDetails }) => {
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Header with image & badge */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 bg-red-600/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{formatDistance(hospital.distanceKm)}</span>
        </div>

        {/* Verified Facility Badge */}
        {hospital.mohfwVerified && (
          <div className="absolute top-3 right-3 bg-emerald-700/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1" title="Verified Emergency Hospital Facility">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>Verified Facility</span>
          </div>
        )}

        {/* Name and Rating overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-red-200 bg-red-950/60 px-2 py-0.5 rounded">
              {hospital.type}
            </span>
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-xs font-semibold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hospital.rating.toFixed(1)}</span>
              <span className="text-slate-300 text-[10px]">({hospital.reviewCount})</span>
            </div>
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg leading-tight line-clamp-1 mt-1 text-white">
            {hospital.name}
          </h3>
          {hospital.banglaName && (
            <p className="text-xs text-slate-200 truncate font-sans opacity-90">{hospital.banglaName}</p>
          )}
        </div>
      </div>

      {/* Body: Location & Facilities Grid */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Address and Registry Code */}
        <div className="flex items-start justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-start gap-1 line-clamp-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="truncate">{hospital.address}</span>
          </div>
          <span className="flex-shrink-0 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-500">
            Reg: #{hospital.code}
          </span>
        </div>

        {/* 4 Essential Facilities Status Badges */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Emergency:</span>
            <FacilityStatus status={hospital.facilities.emergency} size="sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">ICU:</span>
            <FacilityStatus status={hospital.facilities.icu} size="sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">NICU:</span>
            <FacilityStatus status={hospital.facilities.nicu} size="sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Blood Bank:</span>
            <FacilityStatus status={hospital.facilities.bloodBank} size="sm" />
          </div>
        </div>

        {/* Oxygen & Live Bed Stock summary if available */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-cyan-600" />
            <span>Oxygen Plant:</span>
            <span className="font-medium text-slate-700 capitalize">{hospital.facilities.oxygen}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400" title="Data freshness">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Updated: {hospital.lastUpdated}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 mt-auto">
          <a
            href={`tel:${hospital.emergencyHotline}`}
            className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-2 rounded-xl text-xs shadow-sm transition-all text-center"
            title={`Call Emergency Hotline ${hospital.emergencyHotline}`}
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span>CALL</span>
          </a>

          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 px-2 rounded-xl text-xs border border-blue-200 transition-all text-center"
            title="Open Google Maps Directions"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>DIRECTIONS</span>
          </a>

          <button
            onClick={() => onViewDetails(hospital)}
            className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-2 rounded-xl text-xs transition-all text-center"
            title="View complete facility specifications and contact info"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>DETAILS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
