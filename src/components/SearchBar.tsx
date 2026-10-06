import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, SlidersHorizontal, Navigation, Check } from 'lucide-react';
import { getAreaSuggestions, AreaLocation } from '../utils/areaSearch';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
  onToggleFilters?: () => void;
  showFilterBtn?: boolean;
  filterCount?: number;
  showSuggestions?: boolean;
  onSelectArea?: (area: AreaLocation) => void;
}

const POPULAR_DHAKA_CHIPS = [
  { label: '📍 Rampura (রামপুরা)', query: 'Rampura' },
  { label: 'Banasree', query: 'Banasree' },
  { label: 'Dhanmondi', query: 'Dhanmondi' },
  { label: 'Mirpur', query: 'Mirpur' },
  { label: 'Mohammadpur', query: 'Mohammadpur' },
  { label: 'Uttara', query: 'Uttara' },
  { label: 'Gulshan', query: 'Gulshan' },
  { label: 'Badda', query: 'Badda' },
  { label: 'Old Dhaka', query: 'Old Dhaka' },
  { label: 'Jatrabari', query: 'Jatrabari' },
  { label: 'Panthapath', query: 'Panthapath' },
  { label: 'Khilgaon', query: 'Khilgaon' },
  { label: 'Moghbazar', query: 'Moghbazar' },
  { label: 'Agargaon', query: 'Agargaon' },
  { label: 'Savar', query: 'Savar' },
  { label: 'Keraniganj', query: 'Keraniganj' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search by hospital (DMCH, Square, NINS...), or any Dhaka area (Rampura, Mirpur, Uttara)...',
  onToggleFilters,
  showFilterBtn = true,
  filterCount = 0,
  showSuggestions = true,
  onSelectArea,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const areaSuggestions = getAreaSuggestions(query, 7);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectArea = (area: AreaLocation) => {
    onQueryChange(area.name);
    if (onSelectArea) {
      onSelectArea(area);
    }
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="space-y-2 w-full relative">
      <div className="relative flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showFilterBtn && onToggleFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
              filterCount > 0
                ? 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {filterCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {filterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Live Area Autocomplete Dropdown */}
      {isFocused && areaSuggestions.length > 0 && (
        <div className="absolute top-[52px] left-0 right-0 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-2 mt-1 space-y-1 max-h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <span>📍 Dhaka Areas & Thanas</span>
            <span className="text-blue-600 lowercase font-medium">click to filter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
            {areaSuggestions.map((area) => (
              <button
                key={area.id}
                type="button"
                onMouseDown={() => handleSelectArea(area)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-700 text-slate-800 transition-colors flex items-center justify-between group text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-red-600"></span>
                  <span className="font-bold">{area.name}</span>
                  <span className="text-slate-400 group-hover:text-red-500">({area.banglaName})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Dhaka</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Dhaka Area Pills */}
      {showSuggestions && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Dhaka Areas:</span>
          {POPULAR_DHAKA_CHIPS.map((chip) => {
            const isSelected = query.toLowerCase() === chip.query.toLowerCase();
            return (
              <button
                key={chip.query}
                type="button"
                onClick={() => onQueryChange(chip.query)}
                className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 border border-slate-200/60'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
