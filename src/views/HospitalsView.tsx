import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HospitalCard } from '../components/HospitalCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { Map } from '../components/Map';
import { Building2, MapPin, SlidersHorizontal, Map as MapIcon, Grid, ExternalLink } from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const HospitalsView: React.FC = () => {
  const { hospitals, setSelectedHospital, userLocation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

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

  const filteredHospitals = hospitals.filter((h) => {
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

  const sortedHospitals = [...filteredHospitals].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
              Verified Healthcare Facilities
            </span>
            <span className="text-xs text-slate-500">24/7 Verified Healthcare Network</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900">
            Emergency Hospitals & Trauma Centers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find nearby government medical colleges, specialized institutes & private tertiary care.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-2xl shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards ({sortedHospitals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <SafetyDisclaimer />

      {/* Search Bar & Active Filters */}
      <div className="space-y-3">
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholder="Search by hospital name (DMCH, Square, BSMMU...), area, or hospital code..."
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

      {/* View Content: Grid vs Map */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <Map height="h-[600px]" />
        </div>
      ) : (
        <div>
          {sortedHospitals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <span className="text-4xl block">🏥</span>
              <h3 className="font-display font-bold text-lg text-slate-800">
                No matching hospitals found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hospital satisfies all selected filter requirements in this radius.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-xs bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  onViewDetails={setSelectedHospital}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
