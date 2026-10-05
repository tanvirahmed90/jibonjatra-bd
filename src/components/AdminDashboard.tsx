import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, Building2, Truck, Droplet, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { FacilityDistributionSection } from './FacilityDistributionSection';

export const AdminDashboard: React.FC = () => {
  const {
    hospitals,
    donors,
    ambulances,
    emergencyRequests,
    verifyEntity,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'emergencies'>('overview');

  // Stats calculation
  const totalHospitals = hospitals.length;
  const verifiedHospitals = hospitals.filter(h => h.mohfwVerified).length;
  const totalDonors = donors.length;
  const activeDonors = donors.filter(d => d.available).length;
  const unverifiedDonors = donors.filter(d => !d.verified);
  const totalAmbulances = ambulances.length;
  const availableAmbulances = ambulances.filter(a => a.status === 'available').length;
  const totalEmergencies = emergencyRequests.length || 7; // mock active
  const activeEmergencies = emergencyRequests.filter(e => e.status !== 'resolved').length || 3;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-start justify-between flex-wrap gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500/20 text-red-300 border border-red-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Emergency Operations Center
            </span>
            <span className="text-xs text-slate-400">National Healthcare Network Oversight</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            JibonJatra BD National Command Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time verification and emergency coordination hub connecting Bangladesh tertiary hospitals, volunteer blood donors, and ambulance fleets.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'verifications' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Verifications</span>
            {unverifiedDonors.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {unverifiedDonors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('emergencies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'emergencies' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Emergency Incidents
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered Hospitals</span>
          <span className="text-2xl font-black font-display text-slate-900 mt-1 block">{totalHospitals}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{verifiedHospitals} Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Donors</span>
          <span className="text-2xl font-black font-display text-rose-600 mt-1 block">{activeDonors}</span>
          <span className="text-[11px] text-slate-500 font-medium">of {totalDonors} registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ambulances</span>
          <span className="text-2xl font-black font-display text-amber-600 mt-1 block">{availableAmbulances}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Available Ready</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Emergencies</span>
          <span className="text-2xl font-black font-display text-red-600 mt-1 block animate-pulse">
            {activeEmergencies}
          </span>
          <span className="text-[11px] text-red-600 font-bold">Code Red Alerts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Verifications</span>
          <span className="text-2xl font-black font-display text-purple-600 mt-1 block">
            {unverifiedDonors.length}
          </span>
          <span className="text-[11px] text-purple-700 font-medium">Awaiting review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">National 999 Link</span>
          <span className="text-2xl font-black font-display text-emerald-600 mt-1 block">99.8%</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Dispatch Uptime</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & VISUAL CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Chart 1: Bed Capacity by Major Division */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-card-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Regional Emergency Bed Capacity & Availability
                  </h3>
                  <p className="text-xs text-slate-500">Comprehensive Regional Emergency Bed Overview</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Division Breakdown
                </span>
              </div>

              {/* Custom Modern Bar Visualization */}
              <div className="space-y-3.5 pt-2">
                {[
                  { div: 'Dhaka Division (DMCH, Square, BSMMU, Suhrawardy)', total: 6800, available: 42, color: 'bg-red-600' },
                  { div: 'Chattogram Division (CMCH)', total: 2200, available: 32, color: 'bg-blue-600' },
                  { div: 'Sylhet Division (MAG Osmani)', total: 1500, available: 26, color: 'bg-emerald-600' },
                  { div: 'Rajshahi Division (RMCH)', total: 1200, available: 20, color: 'bg-amber-600' },
                  { div: 'Khulna Division (KMCH)', total: 1000, available: 18, color: 'bg-purple-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.div}</span>
                      <span>
                        {item.available} ICU beds open • <strong>{item.total.toLocaleString()} total beds</strong>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${Math.min(100, (item.total / 7000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Directory Notice */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Bangladesh Healthcare Facility Database</span>
                </span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                  ● Live Directory
                </span>
              </div>
            </div>

            {/* Blood Supply Distribution by Group */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card-soft space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Registered Donors by Blood Group
              </h3>
              <p className="text-xs text-slate-500">Live emergency donor readiness</p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { grp: 'O+', count: donors.filter(d => d.bloodGroup === 'O+').length, status: 'Adequate' },
                  { grp: 'A+', count: donors.filter(d => d.bloodGroup === 'A+').length, status: 'Adequate' },
                  { grp: 'B+', count: donors.filter(d => d.bloodGroup === 'B+').length, status: 'Adequate' },
                  { grp: 'AB+', count: donors.filter(d => d.bloodGroup === 'AB+').length, status: 'Moderate' },
                  { grp: 'O-', count: donors.filter(d => d.bloodGroup === 'O-').length, status: 'Critical / Rare' },
                  { grp: 'A-', count: donors.filter(d => d.bloodGroup === 'A-').length, status: 'Rare' },
                  { grp: 'B-', count: donors.filter(d => d.bloodGroup === 'B-').length, status: 'Rare' },
                  { grp: 'AB-', count: donors.filter(d => d.bloodGroup === 'AB-').length, status: 'Critical' },
                ].map((b, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold font-display text-sm flex items-center justify-center">
                        {b.grp}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{b.count} Donors</span>
                        <span className={`text-[10px] font-semibold ${b.status.includes('Critical') ? 'text-red-600' : 'text-slate-500'}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* National Facility Distribution (Total: 39,437) */}
          <FacilityDistributionSection />
        </div>
      )}

      {/* TAB 2: PENDING VERIFICATIONS */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Pending Entity Verifications
              </h3>
              <p className="text-xs text-slate-500">Approve volunteer donors, hospitals, and ambulances</p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {unverifiedDonors.length} Pending
            </span>
          </div>

          {unverifiedDonors.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">All registered entities are verified!</p>
              <p className="text-xs text-slate-400 mt-0.5">New donor signups will appear here for admin review.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {unverifiedDonors.map((d) => (
                <div key={d.id} className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold font-display text-base flex items-center justify-center">
                      {d.bloodGroup}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {d.phone} • Area: {d.area} ({d.division})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => verifyEntity('donor', d.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      ✓ Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACTIVE EMERGENCIES LOG */}
      {activeTab === 'emergencies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Live Incident Dispatch Logs
              </h3>
              <p className="text-xs text-slate-500">National emergency requests initiated via JibonJatra BD</p>
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full animate-pulse">
              Live Stream Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {[
              { id: 'EMG-891024', type: '🚑 Ambulance Request', patient: 'Ariful Hassan', location: 'Dhanmondi 27, Dhaka', eta: '4 mins', status: 'En Route' },
              { id: 'EMG-891023', type: '🩸 Blood Emergency (O-)', patient: 'Nusrat Jahan', location: 'DMCH Trauma Ward', eta: '12 mins', status: 'Donor Assigned' },
              { id: 'EMG-891022', type: '🏨 ICU Bed Reservation', patient: 'Kazi Mahfuzur', location: 'Square Hospital', eta: 'Confirmed', status: 'Admitted' },
              { id: 'EMG-891021', type: '🚑 ICU Ambulance', patient: 'Shahidul Islam', location: 'Uttara Sector 11', eta: 'Arrived', status: 'Resolved' },
            ].map((inc) => (
              <div key={inc.id} className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{inc.id}</span>
                    <span className="font-bold text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      {inc.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{inc.patient}</h4>
                  <p className="text-xs text-slate-500">{inc.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 block">
                    {inc.status}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">ETA: {inc.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
