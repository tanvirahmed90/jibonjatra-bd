import React from 'react';
import { Search, X, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
  onToggleFilters?: () => void;
  showFilterBtn?: boolean;
  filterCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search hospitals (DMCH, Square...), areas (Dhanmondi, Mirpur...), blood group (O+, B-)...',
  onToggleFilters,
  showFilterBtn = true,
  filterCount = 0,
}) => {
  return (
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
  );
};
