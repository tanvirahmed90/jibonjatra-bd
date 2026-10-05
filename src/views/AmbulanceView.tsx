import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AmbulanceCard } from '../components/AmbulanceCard';
import { Truck, Phone, Navigation, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react';
import { Ambulance } from '../types';

export const AmbulanceView: React.FC = () => {
  const {
    ambulances,
    requestEmergencyAssistance,
    userLocation,
    requestGeolocation,
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const vehicleTypes = [
    { id: 'ALL', label: 'All Ambulances' },
    { id: 'ICU Ambulance', label: 'ICU Ventilator' },
    { id: 'AC Ambulance', label: 'AC Patient Transit' },
    { id: 'Non-AC Ambulance', label: 'Basic Economy' },
    { id: 'Freezing Ambulance', label: 'Freezing Carrier' },
  ];

  const filteredAmbulances = ambulances.filter((a) => {
    if (selectedType !== 'ALL' && a.vehicleType !== selectedType) return false;
    if (availableOnly && a.status !== 'available') return false;
    return true;
  });

  const sortedAmbulances = [...filteredAmbulances].sort((a, b) => a.distanceKm - b.distanceKm);

  const handleInstantDispatch = (amb: Ambulance) => {
    requestEmergencyAssistance('ambulance', {
      assignedEntityName: amb.providerName,
      assignedEntityPhone: amb.phone,
      etaMinutes: amb.etaMinutes,
    });
    setDispatchAlert(`Emergency alert dispatched to ${amb.providerName}! Driver ${amb.driverName} has been notified with your GPS coordinates.`);
    setTimeout(() => setDispatchAlert(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>24/7 National Ambulance Dispatch</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            🚑 Find Nearby Emergency Ambulance
          </h1>

          <p className="text-sm text-red-100 leading-relaxed">
            Real-time ambulance availability with live estimated arrival times (ETA), ventilator and paramedic capabilities, and direct driver contact.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="tel:999"
              className="bg-white text-red-700 hover:bg-red-50 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Call 999 Govt Dispatch</span>
            </a>
          </div>
        </div>
      </div>

      {dispatchAlert && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-bold">{dispatchAlert}</span>
        </div>
      )}

      {/* Filter and Standby Staging Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card-soft space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Ambulance Category
          </label>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  selectedType === t.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Availability Check */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Navigation className="w-4 h-4 text-red-600" />
            <span>Search centered around: <strong>{userLocation.address}</strong></span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>Show Only 🟢 Ready Ambulances</span>
          </label>
        </div>
      </div>

      {/* Ambulances List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            Nearby Ambulances on Standby ({sortedAmbulances.length})
          </h2>
          <span className="text-xs text-slate-500">Sorted by quickest ETA</span>
        </div>

        {sortedAmbulances.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <span className="text-4xl block">🚑</span>
            <h3 className="font-display font-bold text-lg text-slate-800">
              No matching ambulances found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching to "All Ambulances" or call 999 directly for central government dispatch.
            </p>
            <button
              onClick={() => {
                setSelectedType('ALL');
                setAvailableOnly(false);
              }}
              className="text-xs bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sortedAmbulances.map((amb) => (
              <AmbulanceCard
                key={amb.id}
                ambulance={amb}
                onBookDispatch={handleInstantDispatch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
