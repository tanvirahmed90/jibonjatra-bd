import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacilityStatusType, Hospital } from '../types';
import { FacilityStatus } from './FacilityStatus';
import { Building2, Save, Clock, ShieldCheck, AlertCircle, Phone, Bed } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { hospitals, updateHospitalFacility, currentUser } = useApp();

  // Find affiliated hospital or fallback to DMCH
  const affiliatedHospital =
    hospitals.find(h => h.id === currentUser.facilityId) || hospitals[0];

  const [emergency, setEmergency] = useState<FacilityStatusType>(affiliatedHospital.facilities.emergency);
  const [icu, setIcu] = useState<FacilityStatusType>(affiliatedHospital.facilities.icu);
  const [nicu, setNicu] = useState<FacilityStatusType>(affiliatedHospital.facilities.nicu);
  const [bloodBank, setBloodBank] = useState<FacilityStatusType>(affiliatedHospital.facilities.bloodBank);
  const [oxygen, setOxygen] = useState<FacilityStatusType>(affiliatedHospital.facilities.oxygen);
  const [ventilator, setVentilator] = useState<FacilityStatusType>(affiliatedHospital.facilities.ventilator);
  
  const [icuAvailable, setIcuAvailable] = useState(affiliatedHospital.bedStock?.icuAvailable ?? 4);
  const [nicuAvailable, setNicuAvailable] = useState(affiliatedHospital.bedStock?.nicuAvailable ?? 2);
  const [emergencyAvailable, setEmergencyAvailable] = useState(affiliatedHospital.bedStock?.emergencyAvailable ?? 12);
  
  const [hotline, setHotline] = useState(affiliatedHospital.emergencyHotline);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalFacility(affiliatedHospital.id, {
      facilities: {
        ...affiliatedHospital.facilities,
        emergency,
        icu,
        nicu,
        bloodBank,
        oxygen,
        ventilator,
      },
      bedStock: {
        icuAvailable,
        icuTotal: affiliatedHospital.bedStock?.icuTotal || 30,
        nicuAvailable,
        nicuTotal: affiliatedHospital.bedStock?.nicuTotal || 15,
        emergencyAvailable,
        generalAvailable: affiliatedHospital.bedStock?.generalAvailable || 40,
      },
      emergencyHotline: hotline,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const statusOptions: { value: FacilityStatusType; label: string }[] = [
    { value: 'available', label: '🟢 Available' },
    { value: 'limited', label: '🟡 Limited' },
    { value: 'unavailable', label: '🔴 Full / Unavailable' },
    { value: 'unknown', label: '⚪ Unknown' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-md flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Staff Portal • MOHFW Registry #{affiliatedHospital.code}
            </span>
            <span className="text-xs text-slate-300">Duty Officer: {currentUser.name}</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            {affiliatedHospital.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            {affiliatedHospital.address}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right">
          <span className="text-xs text-slate-300 block">Status Freshness</span>
          <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 justify-end mt-0.5">
            <Clock className="w-4 h-4" />
            <span>{affiliatedHospital.lastUpdated}</span>
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold">
            Hospital availability updated successfully! Real-time citizen emergency directory synchronized.
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Update Critical Bed & Facility Capacities</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency patients rely on accurate status. Update promptly as admissions or discharges occur.
          </p>
        </div>

        {/* Live Bed Count Inputs */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <Bed className="w-4 h-4 text-emerald-600" />
            <span>Exact Open Bed Count (Live Triage)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Open ICU Beds
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={icuAvailable}
                onChange={(e) => setIcuAvailable(Number(e.target.value))}
                className="w-full text-sm font-bold font-mono px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Open NICU Beds
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={nicuAvailable}
                onChange={(e) => setNicuAvailable(Number(e.target.value))}
                className="w-full text-sm font-bold font-mono px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Triage Beds
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={emergencyAvailable}
                onChange={(e) => setEmergencyAvailable(Number(e.target.value))}
                className="w-full text-sm font-bold font-mono px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 6 Core Facilities Status Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Emergency Service</span>
            <select
              value={emergency}
              onChange={(e) => setEmergency(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">ICU Department</span>
            <select
              value={icu}
              onChange={(e) => setIcu(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">NICU Department</span>
            <select
              value={nicu}
              onChange={(e) => setNicu(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Blood Bank Stock</span>
            <select
              value={bloodBank}
              onChange={(e) => setBloodBank(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Oxygen Plant Pressure</span>
            <select
              value={oxygen}
              onChange={(e) => setOxygen(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Ventilators Functional</span>
            <select
              value={ventilator}
              onChange={(e) => setVentilator(e.target.value as FacilityStatusType)}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Emergency Hotline Contact */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            24/7 Emergency Casualty Phone Hotline
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full text-sm font-mono font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>SAVE & SYNC FACILITY STATUS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
