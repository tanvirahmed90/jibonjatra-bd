import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Navigation, Phone, CheckCircle2, AlertTriangle, Clock, MapPin, Radio } from 'lucide-react';
import { Ambulance } from '../types';

export const AmbulanceDashboard: React.FC = () => {
  const { ambulances, updateAmbulanceStatus, currentUser } = useApp();

  const myAmbulance: Ambulance =
    ambulances.find(a => a.id === currentUser.ambulanceId) || ambulances[0];

  const [status, setStatus] = useState(myAmbulance.status);
  const [eta, setEta] = useState(myAmbulance.etaMinutes);
  const [phone, setPhone] = useState(myAmbulance.phone);
  const [locationName, setLocationName] = useState('Panthapath Standby Point, Dhaka');
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateAmbulanceStatus(myAmbulance.id, status, eta);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white p-6 rounded-3xl shadow-md flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Ambulance Provider Portal
            </span>
            <span className="text-xs text-amber-100">Driver: {myAmbulance.driverName}</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            {myAmbulance.providerName}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 font-mono">
            Vehicle Reg: {myAmbulance.regNumber} • Type: {myAmbulance.vehicleType}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {status === 'available' ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              LIVE ON DISPATCH
            </span>
          ) : (
            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              BUSY / EN ROUTE
            </span>
          )}
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold">Ambulance status updated successfully! GPS and ETA refreshed.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600" />
            <span>Operational Dispatch Controls</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Patients and emergency coordinators see your availability instantly.
          </p>
        </div>

        {/* 3 Status Choices */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Current Operational State
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setStatus('available')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                status === 'available'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50/50'
              }`}
            >
              <span className="text-2xl block mb-1">🟢</span>
              <span className="text-sm block font-bold">Available</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Ready for dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('busy')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                status === 'busy'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50/50'
              }`}
            >
              <span className="text-2xl block mb-1">🟡</span>
              <span className="text-sm block font-bold">Busy on Trip</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Transporting patient</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('offline')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                status === 'offline'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50/50'
              }`}
            >
              <span className="text-2xl block mb-1">🔴</span>
              <span className="text-sm block font-bold">Offline</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Refueling / Off-shift</span>
            </button>
          </div>
        </div>

        {/* Standby Location & Estimated ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Standby Staging Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estimated Quick ETA (Minutes)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="60"
                value={eta}
                onChange={(e) => setEta(Number(e.target.value))}
                className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* Emergency Dispatch Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Driver Emergency Phone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-sm font-mono font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Vehicle Features */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 block mb-2">Equipped Medical Capabilities:</span>
          <div className="flex flex-wrap gap-2">
            {myAmbulance.features.map((f, i) => (
              <span key={i} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full font-medium text-slate-700">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-98 transition-all"
          >
            <span>SAVE STATUS UPDATE</span>
          </button>
        </div>
      </form>
    </div>
  );
};
