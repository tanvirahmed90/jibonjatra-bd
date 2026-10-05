import React, { useState } from 'react';
import { BloodDonor } from '../types';
import { Phone, Droplet, ShieldCheck, MapPin, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { useApp } from '../context/AppContext';

interface DonorCardProps {
  donor: BloodDonor;
  onRequestBlood: (donor: BloodDonor) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({ donor, onRequestBlood }) => {
  const [showFullPhone, setShowFullPhone] = useState(false);

  // Mask phone number for privacy until caller clicks to reveal or call
  const maskedPhone = donor.phone.slice(0, 9) + ' ••••';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card-soft hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Blood Group Badge */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-display font-black text-xl flex items-center justify-center shadow-md shadow-red-200 flex-shrink-0">
            <span>{donor.bloodGroup}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-slate-900 text-base">{donor.name}</h4>
              {donor.verified && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200" title="Verified Volunteer Blood Donor">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {donor.area}
              </span>
              <span>•</span>
              <span className="font-semibold text-red-600">{formatDistance(donor.distanceKm)}</span>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div>
          {donor.available ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Stats & Last Active */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Active: <strong>{donor.lastActive}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplet className="w-3.5 h-3.5 text-red-500" />
          <span>Donations: <strong>{donor.donationCount} times</strong></span>
        </div>
      </div>

      {/* Emergency readiness note */}
      {donor.emergencyEligible && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded-lg">
          <span className="text-xs">⚡</span>
          <span>Consented for immediate emergency call response</span>
        </div>
      )}

      {/* Phone Mask Notice */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between">
        <span>Phone: <span className="font-mono font-medium text-slate-700">{showFullPhone ? donor.phone : maskedPhone}</span></span>
        {!showFullPhone && (
          <button
            type="button"
            onClick={() => setShowFullPhone(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold underline text-[10px]"
          >
            Show full
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        <a
          href={`tel:${donor.phone}`}
          onClick={() => setShowFullPhone(true)}
          className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>CALL</span>
        </a>

        <button
          type="button"
          onClick={() => onRequestBlood(donor)}
          className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-800 font-semibold py-2.5 px-3 rounded-xl text-xs border border-rose-200 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
          <span>REQUEST BLOOD</span>
        </button>
      </div>
    </div>
  );
};
