import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonorCard } from '../components/DonorCard';
import { BloodGroup, BloodDonor } from '../types';
import { Droplet, Search, MapPin, UserPlus, ShieldCheck, Heart, AlertCircle, Phone, Check } from 'lucide-react';
import { DHAKA_AREAS, BANGLADESH_DIVISIONS } from '../data/mockData';

export const BloodView: React.FC = () => {
  const {
    donors,
    setIsDonorModalOpen,
    userLocation,
    requestGeolocation,
    requestEmergencyAssistance,
  } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [requiredUnits, setRequiredUnits] = useState<number>(1);
  const [activeOnly, setActiveOnly] = useState(true);
  const [requestSentNotice, setRequestSentNotice] = useState<string | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = donors.filter((d) => {
    if (selectedGroup !== 'ALL' && d.bloodGroup !== selectedGroup) return false;
    if (activeOnly && !d.available) return false;
    if (selectedArea !== 'All Areas' && !d.area.toLowerCase().includes(selectedArea.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedDonors = [...filteredDonors].sort((a, b) => a.distanceKm - b.distanceKm);

  const handleRequestBlood = (donor: BloodDonor) => {
    requestEmergencyAssistance('blood', {
      bloodGroup: donor.bloodGroup,
      unitsNeeded: requiredUnits,
      assignedEntityName: donor.name,
      assignedEntityPhone: donor.phone,
    });
    setRequestSentNotice(`${donor.name}-কে SMS অ্যাপ খোলা হচ্ছে। উত্তর না পেলে সরাসরি কল করুন এবং অন্য দাতাদেরও চেষ্টা করুন।`);
    setTimeout(() => setRequestSentNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
            <Droplet className="w-3.5 h-3.5 fill-white" />
            <span>24/7 Voluntary Blood Donor Network</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            🩸 Find Emergency Blood Donors
          </h1>

          <p className="text-sm text-rose-100 leading-relaxed">
            Search registered volunteer donors across Dhaka and all Bangladesh divisions during accidents, surgeries, and critical maternal emergencies.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsDonorModalOpen(true)}
              className="bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as a Blood Donor</span>
            </button>
          </div>
        </div>
      </div>

      {requestSentNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-bold">{requestSentNotice}</span>
        </div>
      )}

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card-soft space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Required Blood Group
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup('ALL')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-black font-display border transition-all ${
                selectedGroup === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ALL
            </button>

            {bloodGroups.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black font-display border transition-all ${
                  selectedGroup === bg
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-rose-50'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Units Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Area / Thana
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {DHAKA_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Units (Bags)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={requiredUnits}
              onChange={(e) => setRequiredUnits(Number(e.target.value))}
              className="w-full text-xs font-bold font-mono py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Donor Availability
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>🟢 Available for Emergency Call</span>
            </label>
          </div>
        </div>

        {/* Location Indicator & Privacy Note */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Search radius calculated from: <strong>{userLocation.address}</strong></span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Donor privacy protected. Non-commercial emergency usage only.</span>
          </div>
        </div>
      </div>

      {/* DONOR RESULTS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            Matching Voluntary Donors ({sortedDonors.length})
          </h2>
          <span className="text-xs text-slate-500">Sorted by proximity</span>
        </div>

        {sortedDonors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <span className="text-4xl block">🩸</span>
            <h3 className="font-display font-bold text-lg text-slate-800">
              {donors.length === 0 ? 'এখনো কোনো রক্তদাতা রেজিস্টার করেননি' : 'মিল পাওয়া কোনো রক্তদাতা নেই'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {donors.length === 0
                ? 'এখানে শুধু নিজে রেজিস্টার করা রক্তদাতারাই দেখান (তাদের অনুমতিসহ)। জরুরি প্রয়োজনে নিকটস্থ হাসপাতালের ব্লাড ব্যাংক বা 16263-এ কল করুন।'
                : 'রক্তের গ্রুপ ফিল্টার ALL করুন অথবা এলাকা পরিবর্তন করুন।'}
            </p>
            {donors.length === 0 && (
              <button
                onClick={() => setIsDonorModalOpen(true)}
                className="text-xs bg-slate-900 text-white font-bold px-4 py-2 rounded-xl shadow mt-2 mr-2"
              >
                রক্তদাতা হিসেবে রেজিস্টার করুন
              </button>
            )}
            <button
              onClick={() => {
                setSelectedGroup('ALL');
                setSelectedArea('All Areas');
              }}
              className="text-xs bg-rose-600 text-white font-bold px-4 py-2 rounded-xl shadow mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDonors.map((donor) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                onRequestBlood={handleRequestBlood}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
