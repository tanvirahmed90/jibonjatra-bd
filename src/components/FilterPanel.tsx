import React from 'react';
import { RotateCcw, X, ShieldAlert, Check } from 'lucide-react';
import { BANGLADESH_DIVISIONS, DHAKA_AREAS } from '../data/mockData';

export interface FilterState {
  maxDistanceKm: number;
  emergencyOnly: boolean;
  icuOnly: boolean;
  nicuOnly: boolean;
  bloodBankOnly: boolean;
  oxygenOnly: boolean;
  division: string;
  facilityType: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  onClose,
}) => {
  const updateField = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card-soft space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-base text-slate-900">Hospital & Facility Filters</h3>
          <span className="text-xs text-slate-500 font-medium">Refine Emergency Search</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Distance Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
          <span>Max Radius:</span>
          <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
            {filters.maxDistanceKm >= 50 ? 'All Bangladesh' : `Within ${filters.maxDistanceKm} km`}
          </span>
        </div>
        <input
          type="range"
          min="2"
          max="50"
          step="2"
          value={filters.maxDistanceKm}
          onChange={(e) => updateField('maxDistanceKm', Number(e.target.value))}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>2 km</span>
          <span>10 km</span>
          <span>25 km</span>
          <span>50+ km (All)</span>
        </div>
      </div>

      {/* Critical Facility Availability Checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Critical Availability (Required)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            filters.emergencyOnly ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={filters.emergencyOnly}
              onChange={(e) => updateField('emergencyOnly', e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>🚨 24/7 Emergency</span>
          </label>

          <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            filters.icuOnly ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={filters.icuOnly}
              onChange={(e) => updateField('icuOnly', e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>🏨 ICU Bed Open</span>
          </label>

          <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            filters.nicuOnly ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={filters.nicuOnly}
              onChange={(e) => updateField('nicuOnly', e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>👶 NICU Open</span>
          </label>

          <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            filters.bloodBankOnly ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={filters.bloodBankOnly}
              onChange={(e) => updateField('bloodBankOnly', e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>🩸 Blood Bank</span>
          </label>

          <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            filters.oxygenOnly ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={filters.oxygenOnly}
              onChange={(e) => updateField('oxygenOnly', e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span>💨 Central Oxygen</span>
          </label>
        </div>
      </div>

      {/* Administrative Division and Facility Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Division (MOHFW Registry)
          </label>
          <select
            value={filters.division}
            onChange={(e) => updateField('division', e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            {BANGLADESH_DIVISIONS.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Facility Classification
          </label>
          <select
            value={filters.facilityType}
            onChange={(e) => updateField('facilityType', e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            <option value="All">All Facility Types</option>
            <option value="Govt. Medical College">Govt. Medical College</option>
            <option value="Specialized Institute">Specialized Institute (Apex)</option>
            <option value="Private Tertiary">Private Tertiary Hospital</option>
            <option value="District Hospital">District Hospital</option>
            <option value="Upazila Health Complex">Upazila Health Complex</option>
          </select>
        </div>
      </div>
    </div>
  );
};
