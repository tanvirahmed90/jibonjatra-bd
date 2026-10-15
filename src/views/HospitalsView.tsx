import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HospitalCard } from '../components/HospitalCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { Map } from '../components/Map';
import { Building2, MapPin, SlidersHorizontal, Map as MapIcon, Grid, ExternalLink, Layers, ArrowRight, Navigation } from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { TOTAL_FACILITIES_COUNT, DIVISION_WISE_DISTRIBUTION } from '../data/facilityStats';
import { filterAndRankHospitals } from '../utils/areaSearch';
import { formatDistance } from '../utils/geo';

export const HospitalsView: React.FC = () => {
  const {
    hospitals,
    setSelectedHospital,
    userLocation,
    setUserCustomLocation,
    hospitalsViewMode,
    setHospitalsViewMode,
    focusedHospital,
    setFocusedHospital,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);

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

  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination when search or filters change
  React.useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, filters]);

  // When a hospital is focused from emergency dispatch, smoothly scroll down to the map
  React.useEffect(() => {
    if (focusedHospital && hospitalsViewMode === 'map') {
      setTimeout(() => {
        const el = document.getElementById('hospital-map-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [focusedHospital, hospitalsViewMode]);

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

  // Intelligent Area & Keyword Search (Rampura, Banasree, Mirpur, Uttara, etc.)
  const searchResult = useMemo(() => {
    return filterAndRankHospitals(hospitals, searchQuery, userLocation.lat, userLocation.lng);
  }, [hospitals, searchQuery, userLocation.lat, userLocation.lng]);

  const filteredHospitals = searchResult.hospitals.filter((h) => {
    if (!searchQuery.trim() && filters.maxDistanceKm < 50 && h.distanceKm > filters.maxDistanceKm) {
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

  const sortedHospitals = searchQuery.trim()
    ? filteredHospitals
    : [...filteredHospitals].sort((a, b) => a.distanceKm - b.distanceKm);

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
            onClick={() => setHospitalsViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hospitalsViewMode === 'grid' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards ({sortedHospitals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setHospitalsViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hospitalsViewMode === 'map' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* 39,437 National Facilities Division Quick Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-card-soft space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Layers className="w-4 h-4 text-red-600" />
            <span>Division-Wise Facility Distribution (Total: {TOTAL_FACILITIES_COUNT.toLocaleString()})</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Click any division to filter facilities</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, division: 'All Divisions' }))}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filters.division === 'All Divisions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({TOTAL_FACILITIES_COUNT.toLocaleString()})
          </button>

          {DIVISION_WISE_DISTRIBUTION.map((item) => (
            <button
              key={item.division}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, division: item.division }))}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filters.division === item.division
                  ? 'bg-red-600 text-white font-bold shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-red-50'
              }`}
            >
              <span>{item.division}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filters.division === item.division ? 'bg-white text-red-600' : 'bg-slate-200 text-slate-700'
              }`}>
                {item.count.toLocaleString()}
              </span>
            </button>
          ))}
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

        {/* Area Detection Smart Banner */}
        {searchResult.detectedArea && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                📍
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span>{searchResult.detectedArea.name} ({searchResult.detectedArea.banglaName}) Area Matched</span>
                  <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    {sortedHospitals.length} Hospitals Found
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5">
                  Showing emergency medical colleges, private tertiary hospitals, and trauma facilities in and nearest to {searchResult.detectedArea.name}, Dhaka.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  setUserCustomLocation(
                    searchResult.detectedArea!.lat,
                    searchResult.detectedArea!.lng,
                    `${searchResult.detectedArea!.name}, Dhaka`
                  );
                  setHospitalsViewMode('map');
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <span>View on Map ({searchResult.detectedArea.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Content: Grid vs Map */}
      {hospitalsViewMode === 'map' ? (
        <div id="hospital-map-container" className="space-y-4 scroll-mt-6">
          {focusedHospital && (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 border border-red-500">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  🏥
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black tracking-wider bg-white text-red-700 px-2 py-0.5 rounded shadow-xs">
                      Real Hospital Location
                    </span>
                    <span className="text-xs text-rose-100 font-bold">
                      📍 {formatDistance(focusedHospital.distanceKm)} away
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                    {focusedHospital.name}
                  </h3>
                  <p className="text-xs text-rose-100 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-200 shrink-0" />
                    <span>{focusedHospital.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${focusedHospital.lat},${focusedHospital.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-rose-50 active:scale-95 text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  title="Open in native Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-600" />
                  <span>Google Maps GPS Route</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedHospital(focusedHospital)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
                >
                  Facility Specs
                </button>
                <button
                  type="button"
                  onClick={() => setFocusedHospital(null)}
                  className="px-3 py-2.5 rounded-xl bg-black/20 hover:bg-black/40 text-white text-xs font-bold transition-all"
                  title="Show all hospitals on map"
                >
                  Show All Map
                </button>
              </div>
            </div>
          )}
          <Map height="h-[600px]" centerOnHospital={focusedHospital} />
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
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>
                  Showing <strong className="text-slate-900">{Math.min(visibleCount, sortedHospitals.length)}</strong> of <strong className="text-slate-900">{sortedHospitals.length}</strong> facilities
                </span>
                {visibleCount < sortedHospitals.length && (
                  <span className="text-red-600">
                    +{sortedHospitals.length - visibleCount} more available
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHospitals.slice(0, visibleCount).map((hosp) => (
                  <HospitalCard
                    key={hosp.id}
                    hospital={hosp}
                    onViewDetails={setSelectedHospital}
                  />
                ))}
              </div>

              {visibleCount < sortedHospitals.length && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Load More Hospitals (+24)</span>
                    <span className="bg-red-700/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {sortedHospitals.length - visibleCount} Left
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibleCount(sortedHospitals.length)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all"
                  >
                    Show All ({sortedHospitals.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
