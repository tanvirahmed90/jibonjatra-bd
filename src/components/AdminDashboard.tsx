import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FacilityStatusType, HospitalFacilityStatus, EmergencyRequest } from '../types';
import { ShieldCheck, Search, RefreshCw, Save, Phone, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_OPTIONS: { value: FacilityStatusType; label: string }[] = [
  { value: 'unknown', label: '⚪ জানা নেই' },
  { value: 'available', label: '🟢 খালি আছে' },
  { value: 'limited', label: '🟡 সীমিত' },
  { value: 'unavailable', label: '🔴 খালি নেই' },
];

const EDITABLE_FACILITIES: { key: keyof HospitalFacilityStatus; label: string }[] = [
  { key: 'emergency', label: 'Emergency' },
  { key: 'icu', label: 'ICU' },
  { key: 'nicu', label: 'NICU' },
  { key: 'ccu', label: 'CCU' },
  { key: 'bloodBank', label: 'Blood Bank' },
  { key: 'oxygen', label: 'Oxygen' },
  { key: 'ventilator', label: 'Ventilator' },
];

const TYPE_LABEL: Record<EmergencyRequest['type'], string> = {
  ambulance: '🚑 Ambulance',
  blood: '🩸 Blood',
  hospital: '🏥 Hospital',
  icu: '🏨 ICU/NICU',
};

const Metric = ({ label, value, sub }: { label: string; value: number; sub?: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card-soft">
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{label}</span>
    <span className="text-2xl font-black font-display text-slate-900 mt-1 block">{value}</span>
    {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
  </div>
);

/**
 * Admin panel — every number here comes from real data (no mock stats).
 * Access is enforced by the database (RLS): non-admins can't read emergencies or write hospital status.
 */
export const AdminDashboard: React.FC = () => {
  const {
    hospitals,
    donors,
    registeredAmbulances,
    emergencyRequests,
    verifyEntity,
    updateHospitalStatus,
    refreshEmergencyRequests,
    updateEmergencyStatus,
    currentUser,
    showToast,
  } = useApp();

  const [tab, setTab] = useState<'verify' | 'hospital' | 'emergencies'>('verify');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<HospitalFacilityStatus>>({});
  const [draftPhone, setDraftPhone] = useState('');
  const [busy, setBusy] = useState(false);

  const pendingDonors = donors.filter(d => !d.verified);
  const pendingAmbulances = registeredAmbulances.filter(a => !a.verified);
  const openEmergencies = emergencyRequests.filter(e => e.status !== 'resolved');
  const statusUpdatedCount = hospitals.filter(h => h.statusUpdatedAt).length;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return hospitals
      .filter(h => h.name.toLowerCase().includes(q) || (h.banglaName || '').includes(query.trim()) || h.upazila.toLowerCase().includes(q))
      .slice(0, 12);
  }, [hospitals, query]);

  const selected = hospitals.find(h => h.id === selectedId) || null;

  const selectHospital = (id: string) => {
    const h = hospitals.find(x => x.id === id);
    setSelectedId(id);
    setDraft(h ? { ...h.facilities } : {});
    setDraftPhone(h?.emergencyHotline || '');
  };

  const guard = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      showToast(`⚠️ ${(err as Error)?.message || 'ব্যর্থ হয়েছে'}`);
    } finally {
      setBusy(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center text-sm text-slate-600">
        এই পেজটি শুধুমাত্র অ্যাডমিনদের জন্য।
      </div>
    );
  }

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
        tab === id ? 'bg-white text-purple-800 shadow-sm' : 'text-purple-100 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Control Center</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl">স্বাগতম, {currentUser.name}</h2>
        <div className="flex flex-wrap gap-2 bg-white/10 p-1 rounded-2xl w-fit">
          {tabBtn('verify', `যাচাই (${pendingDonors.length + pendingAmbulances.length})`)}
          {tabBtn('hospital', 'হাসপাতাল স্ট্যাটাস')}
          {tabBtn('emergencies', `ইমার্জেন্সি (${openEmergencies.length})`)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Metric label="Hospitals" value={hospitals.length} sub={`${statusUpdatedCount} টির স্ট্যাটাস কনফার্মড`} />
        <Metric label="Donors" value={donors.length} sub={`${donors.filter(d => d.available).length} available`} />
        <Metric label="Registered Ambulances" value={registeredAmbulances.length} sub={`${pendingAmbulances.length} pending`} />
        <Metric label="Open Emergencies" value={openEmergencies.length} />
        <Metric label="Pending Verifications" value={pendingDonors.length + pendingAmbulances.length} />
      </div>

      {/* Verifications */}
      {tab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: '🚑 অ্যাম্বুলেন্স (যাচাই না হলে পাবলিক লিস্টে দেখায় না)', items: registeredAmbulances.map(a => ({ id: a.id, type: 'ambulance' as const, verified: !!a.verified, title: a.providerName || a.driverName, sub: `${a.vehicleType} • ${a.regNumber || 'reg no. নেই'} • ${a.locationName || ''}`, phone: a.phone })) },
            { title: '🩸 রক্তদাতা', items: donors.map(d => ({ id: d.id, type: 'donor' as const, verified: d.verified, title: `${d.name} (${d.bloodGroup})`, sub: d.area || d.district, phone: d.phone })) },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card-soft space-y-3">
              <h3 className="font-display font-bold text-base text-slate-900">{section.title}</h3>
              {section.items.length === 0 && <p className="text-xs text-slate-500">এখনো কেউ রেজিস্টার করেনি।</p>}
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {section.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                      <a href={`tel:${item.phone}`} className="text-xs text-blue-700 font-semibold">{item.phone}</a>
                    </div>
                    <button
                      disabled={busy}
                      onClick={() => guard(() => verifyEntity(item.type, item.id, !item.verified))}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        item.verified ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {item.verified ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {item.verified ? 'যাচাই বাতিল' : 'যাচাই করুন'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital live status */}
      {tab === 'hospital' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card-soft space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">হাসপাতালের ICU / বেড স্ট্যাটাস আপডেট</h3>
            <p className="text-xs text-slate-500">
              শুধু হাসপাতালে ফোন করে নিশ্চিত হওয়ার পর আপডেট করুন। আপডেটের সময়সহ সবার কাছে দেখাবে।
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="হাসপাতালের নাম বা এলাকা লিখুন…"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {matches.length > 0 && (
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {matches.map(h => (
                <button
                  key={h.id}
                  onClick={() => selectHospital(h.id)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-50 ${selectedId === h.id ? 'bg-purple-50 font-bold' : ''}`}
                >
                  {h.name} <span className="text-xs text-slate-500">— {h.upazila}, {h.district}</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="border border-purple-200 bg-purple-50/40 rounded-2xl p-4 space-y-4">
              <div>
                <p className="font-bold text-slate-900">{selected.name}</p>
                <p className="text-xs text-slate-500">
                  {selected.statusUpdatedAt
                    ? `সর্বশেষ কনফার্ম: ${new Date(selected.statusUpdatedAt).toLocaleString()}`
                    : 'এখনো কোনো স্ট্যাটাস কনফার্ম করা হয়নি'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EDITABLE_FACILITIES.map(f => (
                  <label key={f.key} className="text-xs font-bold text-slate-700 space-y-1">
                    <span>{f.label}</span>
                    <select
                      value={(draft[f.key] as FacilityStatusType) || 'unknown'}
                      onChange={e => setDraft(prev => ({ ...prev, [f.key]: e.target.value as FacilityStatusType }))}
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                    >
                      {STATUS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="text-xs font-bold text-slate-700 space-y-1">
                  <span>যাচাইকৃত ইমার্জেন্সি নম্বর</span>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      value={draftPhone}
                      onChange={e => setDraftPhone(e.target.value)}
                      placeholder="যেমন 10678 বা 01XXXXXXXXX"
                      className="w-full pl-8 pr-2 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </label>
              </div>
              <button
                disabled={busy}
                onClick={() => guard(() => updateHospitalStatus(selected.id, draft, draftPhone.trim()))}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{busy ? 'সেভ হচ্ছে…' : 'স্ট্যাটাস সেভ করুন'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emergency requests */}
      {tab === 'emergencies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">ইমার্জেন্সি রিকোয়েস্ট</h3>
            <button
              onClick={() => guard(refreshEmergencyRequests)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
              রিফ্রেশ
            </button>
          </div>
          {emergencyRequests.length === 0 && <p className="text-sm text-slate-500">কোনো রিকোয়েস্ট নেই।</p>}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {emergencyRequests.map(e => (
              <div key={e.id} className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <span className="font-bold text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    {TYPE_LABEL[e.type]} {e.bloodGroup ? `(${e.bloodGroup})` : ''}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{e.patientName || 'নাম দেওয়া হয়নি'}</p>
                  <p className="text-xs text-slate-500">{e.locationName}</p>
                  <p className="text-[11px] text-slate-400">{new Date(e.createdAt).toLocaleString()}</p>
                  {e.phone && (
                    <a href={`tel:${e.phone}`} className="text-xs font-bold text-blue-700">
                      📞 {e.phone}
                    </a>
                  )}
                </div>
                <select
                  value={e.status}
                  disabled={busy}
                  onChange={ev => guard(() => updateEmergencyStatus(e.id, ev.target.value as EmergencyRequest['status']))}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="searching">Open</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
