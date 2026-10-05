import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyButton } from '../components/EmergencyButton';
import { HospitalCard } from '../components/HospitalCard';
import { Map } from '../components/Map';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { BANGLADESH_EMERGENCY_HOTLINES } from '../data/mockData';
import { ArrowRight, Phone, ExternalLink, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { Hospital } from '../types';

export const HomeView: React.FC = () => {
  const {
    hospitals,
    setActiveTab,
    setIsEmergencyModeOpen,
    setSelectedHospital,
    userLocation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    maxDistanceKm: 50,
    emergencyOnly: false,
    icuOnly: false,
    nicuOnly: false,
    bloodBankOnly: false,
    oxygenOnly: false,
    division: 'All Divisions',
    facilityType: 'All',
  });

  const handleResetFilters = () => {
    setFilters({
      maxDistanceKm: 50,
      emergencyOnly: false,
      icuOnly: false,
      nicuOnly: false,
      bloodBankOnly: false,
      oxygenOnly: false,
      division: 'All Divisions',
      facilityType: 'All',
    });
    setSearchQuery('');
  };

  // Filter hospitals
  const filteredHospitals = hospitals.filter((h) => {
    // Search query matching name, address, upazila, district, or code
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.upazila.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.code.includes(q) ||
        (h.banglaName && h.banglaName.includes(q));
      if (!match) return false;
    }

    if (filters.maxDistanceKm < 50 && h.distanceKm > filters.maxDistanceKm) {
      return false;
    }
    if (filters.emergencyOnly && h.facilities.emergency !== 'available') return false;
    if (filters.icuOnly && h.facilities.icu !== 'available') return false;
    if (filters.nicuOnly && h.facilities.nicu !== 'available') return false;
    if (filters.bloodBankOnly && h.facilities.bloodBank !== 'available') return false;
    if (filters.oxygenOnly && h.facilities.oxygen !== 'available') return false;
    if (filters.division !== 'All Divisions' && h.division !== filters.division) return false;
    if (filters.facilityType !== 'All' && h.type !== filters.facilityType) return false;

    return true;
  });

  // Sort by distance
  const sortedHospitals = [...filteredHospitals].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:py-16 px-4 rounded-3xl bg-gradient-to-b from-red-50/70 via-white to-[#F7F9FC] border border-red-100/80 shadow-card-soft text-center">
        {/* Subtle decorative emergency pulse ring in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/90 text-red-700 text-xs font-bold border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>Bangladesh Emergency Lifesaving Network</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
            Emergency Help, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              When You Need It Most.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Find nearby hospitals, blood donors, ambulances and emergency facilities quickly across Bangladesh.
          </p>

          {/* Large Red Emergency Button & Geolocation */}
          <div className="pt-4">
            <EmergencyButton size="large" showLocationPrompt={true} />
          </div>
        </div>
      </section>

      {/* Safety Disclaimer Banner */}
      <SafetyDisclaimer />

      {/* 2. EMERGENCY ACTION SECTION: 4 Large Interactive Cards */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Rapid Emergency Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            One-touch access to life-critical resources closest to your location.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Ambulance */}
          <div
            onClick={() => setActiveTab('ambulance')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-red-500 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-red-600 text-3xl flex items-center justify-center transition-colors mb-4 group-hover:scale-105 shadow-inner">
                🚑
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-red-600 transition-colors">
                Ambulance
              </h3>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Find & Call Nearby Ambulance
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Emergency ICU, AC & non-AC dispatch with live ETA and direct phone contacts.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
              <span>Find Ambulance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Blood Donor */}
          <div
            onClick={() => setActiveTab('blood')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-500 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-rose-50 group-hover:bg-rose-600 text-3xl flex items-center justify-center transition-colors mb-4 group-hover:scale-105 shadow-inner">
                🩸
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-rose-600 transition-colors">
                Blood Donor
              </h3>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Find Blood Donors Near You
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Search verified voluntary donors by blood group (A+, B+, O-, AB-, etc.) and radius.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>Find Donors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Hospital */}
          <div
            onClick={() => setActiveTab('hospitals')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-3xl flex items-center justify-center transition-colors mb-4 group-hover:scale-105 shadow-inner">
                🏥
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                Hospital
              </h3>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Find Nearby Hospitals
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                MOHFW-registered teaching colleges, specialized apex centers & private tertiary hospitals.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Browse Hospitals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: ICU / NICU */}
          <div
            onClick={() => {
              setFilters(prev => ({ ...prev, icuOnly: true }));
              setActiveTab('hospitals');
            }}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-purple-500 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-purple-50 group-hover:bg-purple-600 text-3xl flex items-center justify-center transition-colors mb-4 group-hover:scale-105 shadow-inner">
                🏨
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-purple-600 transition-colors">
                ICU / NICU
              </h3>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Check Emergency Facilities
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Intensive care units, ventilator support, high dependency units, and pediatric critical care.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Check ICU Beds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. NATIONAL EMERGENCY HOTLINE STRIP */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
              National Emergency Hotlines • বাংলাদেশ জরুরি সেবা
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Toll-Free Government Emergency Call Lines
            </h3>
          </div>
          <span className="text-xs text-slate-400">Available 24 Hours / 7 Days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {BANGLADESH_EMERGENCY_HOTLINES.map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number}`}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-2xl transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-2xl font-black font-mono text-white group-hover:text-red-400 transition-colors">
                  {h.number}
                </span>
                <h4 className="font-bold text-xs text-slate-200 mt-0.5">{h.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{h.desc}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <Phone className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE MAP SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Emergency Map Navigator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live geographic visualization of hospitals, ambulances, and available donors.
            </p>
          </div>
          <span className="text-xs text-slate-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-full self-start">
            📍 Centered at: {userLocation.address}
          </span>
        </div>

        <Map />
      </section>

      {/* 5. NEARBY HOSPITALS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Nearby Hospitals & Emergency Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ranked by travel distance from your detected location.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('hospitals')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All ({hospitals.length}) Hospitals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Filter Toggle */}
        <div className="space-y-3">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            placeholder="Search nearby hospital by name, area (e.g. Ramna, Panthapath, Dhanmondi)..."
            onToggleFilters={() => setShowFilters(!showFilters)}
            filterCount={
              (filters.emergencyOnly ? 1 : 0) +
              (filters.icuOnly ? 1 : 0) +
              (filters.nicuOnly ? 1 : 0) +
              (filters.bloodBankOnly ? 1 : 0) +
              (filters.division !== 'All Divisions' ? 1 : 0)
            }
          />

          {showFilters && (
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        {/* Hospital Cards Grid (Show top 6 on Homepage) */}
        {sortedHospitals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
            <span className="text-4xl block">🏥</span>
            <h3 className="font-display font-bold text-lg text-slate-800">No Hospitals Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hospital matched your filter criteria within this radius. Try resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="text-xs bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHospitals.slice(0, 6).map((hosp) => (
              <HospitalCard
                key={hosp.id}
                hospital={hosp}
                onViewDetails={setSelectedHospital}
              />
            ))}
          </div>
        )}

        {sortedHospitals.length > 6 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('hospitals')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all"
            >
              <span>Explore More Hospitals Across Bangladesh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 6. MOHFW DATABASE ATTRIBUTION SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-soft">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Official Data Alignment
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Government of People's Republic of Bangladesh
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Directorate General of Health Services (DGHS) • Ministry of Health & Family Welfare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://hris.mohfw.gov.bd/public/facility-registry/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all text-center"
            >
              <span>DGHS Facility Registry Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
