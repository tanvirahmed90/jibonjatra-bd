import React from 'react';
import { Hospital } from '../types';
import { FacilityStatus } from './FacilityStatus';
import { X, Phone, MapPin, ExternalLink, Star, ShieldCheck, Clock, Building2, AlertTriangle, Bed, HeartPulse } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  onClose: () => void;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({ hospital, onClose }) => {
  if (!hospital) return null;

  const facilitiesList = [
    { key: 'emergency', label: 'Emergency Department (24/7)', desc: 'Level-1 Casualty & Trauma Resuscitation' },
    { key: 'icu', label: 'Intensive Care Unit (ICU)', desc: 'Critical life support & hemodynamic monitoring' },
    { key: 'nicu', label: 'Neonatal ICU (NICU)', desc: 'Preterm & critically ill newborn nursery' },
    { key: 'ccu', label: 'Coronary Care Unit (CCU)', desc: 'Acute coronary syndrome & cardiac monitoring' },
    { key: 'hdu', label: 'High Dependency Unit (HDU)', desc: 'Step-down progressive intensive care' },
    { key: 'ot', label: 'Emergency Operation Theatre (OT)', desc: '24/7 emergency trauma surgery ready' },
    { key: 'bloodBank', label: 'Blood Transfusion Center', desc: 'Screened whole blood & PRBC/FFP storage' },
    { key: 'oxygen', label: 'Central High-Flow Oxygen Plant', desc: 'Central liquid medical oxygen piping' },
    { key: 'ventilator', label: 'Mechanical Ventilators', desc: 'Invasive and non-invasive ventilators' },
    { key: 'pharmacy', label: '24/7 Emergency Pharmacy', desc: 'In-house emergency medications & antidotes' },
  ] as const;

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Modal Header Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Distance */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
              📍 {formatDistance(hospital.distanceKm)}
            </span>
            {hospital.mohfwVerified && (
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                DGHS / MOHFW Code #{hospital.code}
              </span>
            )}
          </div>

          {/* Title info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded font-semibold text-slate-100">
                {hospital.type}
              </span>
              <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{hospital.rating.toFixed(1)}</span>
                <span className="text-slate-300">({hospital.reviewCount} verified reviews)</span>
              </div>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white">
              {hospital.name}
            </h2>
            {hospital.banglaName && (
              <p className="text-sm text-slate-300 font-sans">{hospital.banglaName}</p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Disclaimer Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Emergency Verification Reminder:</p>
              <p className="mt-0.5 text-amber-800">
                Bed and ventilator availabilities change continuously. Please call the emergency hotline directly to confirm immediate admission before patient transfer. Last synced: <strong>{hospital.lastUpdated}</strong>.
              </p>
            </div>
          </div>

          {/* Key Quick Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-700 block uppercase">24/7 Emergency Hotline</span>
                <span className="text-lg font-mono font-bold text-red-900">{hospital.emergencyHotline}</span>
              </div>
              <a
                href={`tel:${hospital.emergencyHotline}`}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition-all active:scale-95"
                title="Call Emergency Hotline"
              >
                <Phone className="w-5 h-5 animate-pulse" />
              </a>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase">Main Reception / PABX</span>
                <span className="text-base font-mono font-semibold text-slate-800">{hospital.phone}</span>
              </div>
              <a
                href={`tel:${hospital.phone}`}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl transition-all"
                title="Call General Line"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Address & Navigation Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Hospital Location & Address:</span>
              </div>
              <p className="text-sm text-slate-800 font-medium pl-5">{hospital.address}</p>
              <p className="text-xs text-slate-500 pl-5">
                Upazila: <strong>{hospital.upazila}</strong> • District: <strong>{hospital.district}</strong> • Division: <strong>{hospital.division}</strong>
              </p>
            </div>

            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Live Bed Stock if Available */}
          {hospital.bedStock && (
            <div className="bg-slate-900 text-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-display font-bold text-sm text-white">Reported Bed Inventory</h4>
                </div>
                <span className="text-[11px] text-slate-400">Total Capacity: {hospital.bedCount} Beds</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">ICU Available</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-display">
                    {hospital.bedStock.icuAvailable} <span className="text-xs text-slate-400 font-normal">/ {hospital.bedStock.icuTotal}</span>
                  </span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">NICU Available</span>
                  <span className="text-xl font-extrabold text-blue-400 font-display">
                    {hospital.bedStock.nicuAvailable} <span className="text-xs text-slate-400 font-normal">/ {hospital.bedStock.nicuTotal}</span>
                  </span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Emergency Beds</span>
                  <span className="text-xl font-extrabold text-amber-400 font-display">
                    {hospital.bedStock.emergencyAvailable}
                  </span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">General Ward</span>
                  <span className="text-xl font-extrabold text-slate-200 font-display">
                    {hospital.bedStock.generalAvailable}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Complete 10 Emergency Facilities Breakdown */}
          <div>
            <h4 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-600" />
              <span>Full Emergency Facilities & Specialized Units</span>
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {facilitiesList.map((fac) => {
                const status = hospital.facilities[fac.key as keyof typeof hospital.facilities];
                return (
                  <div key={fac.key} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <h5 className="font-bold text-sm text-slate-800">{fac.label}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{fac.desc}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <FacilityStatus status={status} size="md" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hospital Notes / Trauma Level */}
          {hospital.notes && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-slate-700">
              <span className="font-bold text-blue-900 block mb-1">MOHFW Registry Institutional Notes:</span>
              <p>{hospital.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Call Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>🗺️ Get Directions</span>
          </a>

          <a
            href={`tel:${hospital.emergencyHotline}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>📞 Call Hospital Hotline</span>
          </a>
        </div>
      </div>
    </div>
  );
};
