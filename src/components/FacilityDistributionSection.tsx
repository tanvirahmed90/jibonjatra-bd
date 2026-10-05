import React, { useState } from 'react';
import {
  TOTAL_FACILITIES_COUNT,
  DIVISION_WISE_DISTRIBUTION,
  TYPE_WISE_DISTRIBUTION,
} from '../data/facilityStats';
import { Building2, MapPin, PieChart, BarChart3, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FacilityDistributionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'division' | 'type'>('type');
  const { setActiveTab: setAppActiveTab } = useApp();

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card-soft space-y-6">
      {/* Header with Title & Total Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>National Healthcare Database Statistics</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Healthcare Facility Distribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comprehensive nationwide mapping of registered primary, secondary, and tertiary health institutions across Bangladesh.
          </p>
        </div>

        {/* Total Metric Badge */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center gap-4 shadow-md self-start sm:self-auto flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-red-600/90 text-white flex items-center justify-center text-2xl font-black shadow-inner">
            🏥
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Facilities
            </span>
            <span className="text-2xl sm:text-3xl font-black font-display text-white">
              {TOTAL_FACILITIES_COUNT.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto self-start">
        <button
          type="button"
          onClick={() => setActiveTab('type')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'type'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-4 h-4 text-purple-600" />
          <span>Type-Wise Facility Distribution ({TOTAL_FACILITIES_COUNT.toLocaleString()})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('division')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'division'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-red-600" />
          <span>Division-Wise Facility Distribution ({TOTAL_FACILITIES_COUNT.toLocaleString()})</span>
        </button>
      </div>

      {/* TAB 1: TYPE-WISE FACILITY DISTRIBUTION */}
      {activeTab === 'type' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TYPE_WISE_DISTRIBUTION.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-slate-200/60">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-700 transition-colors">
                        {item.type}
                      </h4>
                      {item.banglaName && (
                        <p className="text-xs text-slate-500 font-sans">{item.banglaName}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-display font-black text-lg sm:text-xl text-slate-900 block">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, (item.count / 14392) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIVISION-WISE FACILITY DISTRIBUTION */}
      {activeTab === 'division' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DIVISION_WISE_DISTRIBUTION.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white hover:shadow-card-hover p-4 rounded-2xl border border-slate-200/80 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-base text-slate-900">
                    {item.division}
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {item.percentage}%
                  </span>
                </div>

                <div>
                  <span className="text-2xl font-black font-display text-slate-900 block">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500">Registered Facilities</span>
                </div>

                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.count / 9984) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Division Summary Banner */}
          <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Looking for Emergency Hospitals in a Specific Division?
              </h4>
              <p className="text-xs text-red-100 mt-0.5">
                Dhaka leads with 9,984 facilities, followed by Chattogram with 7,483 facilities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAppActiveTab('hospitals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto flex-shrink-0"
            >
              <span>Filter by Division</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
