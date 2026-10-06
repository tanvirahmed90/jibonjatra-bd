import React from 'react';
import { Search, X, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
  onToggleFilters?: () => void;
  showFilterBtn?: boolean;
  filterCount?: number;
  showSuggestions?: boolean;
}

const QUICK_SEARCH_CHIPS = [
  { label: '📍 Rampura (রামপুরা)', query: 'Rampura' },
  { label: 'Banasree', query: 'Banasree' },
  { label: 'Dhanmondi', query: 'Dhanmondi' },
  { label: 'Mirpur', query: 'Mirpur' },
  { label: 'Uttara', query: 'Uttara' },
  { label: 'Panthapath', query: 'Panthapath' },
  { label: 'Square Hosp.', query: 'Square' },
  { label: 'Better Life (Rampura)', query: 'Better Life' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search hospitals (DMCH, Square...), areas (Rampura, Banasree, Dhanmondi)...',
  onToggleFilters,
  showFilterBtn = true,
  filterCount = 0,
  showSuggestions = true,
}) => {
  return (
    <div className="space-y-2 w-full">
      <div className="relative flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
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

      {showSuggestions && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Area:</span>
          {QUICK_SEARCH_CHIPS.map((chip) => {
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
