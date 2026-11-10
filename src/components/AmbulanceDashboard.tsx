import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Phone, CheckCircle2, Clock, MapPin, Radio, ShieldCheck, Save, Hash } from 'lucide-react';
import { Ambulance } from '../types';

export const AmbulanceDashboard: React.FC = () => {
  const { myAmbulance, saveMyAmbulanceProfile, currentUser, userLocation } = useApp();

  const [regNumber, setRegNumber] = useState<string>(myAmbulance?.regNumber || '');
  const [phone, setPhone] = useState<string>(myAmbulance?.phone || currentUser?.phone || '');
  const [locationName, setLocationName] = useState<string>(myAmbulance?.locationName || '');
  const [vehicleType, setVehicleType] = useState<Ambulance['vehicleType']>(myAmbulance?.vehicleType || 'AC Ambulance');
  const [status, setStatus] = useState<Ambulance['status']>(
    myAmbulance && myAmbulance.status !== 'unknown' ? myAmbulance.status : 'available'
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await saveMyAmbulanceProfile({
        regNumber,
        phone,
        locationName,
        vehicleType,
        status,
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError((err as Error)?.message || 'সেভ করা যায়নি');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400/20 text-amber-100 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অ্যাম্বুলেন্স চালক পোর্টাল • Driver Management Portal</span>
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            {currentUser?.name || myAmbulance?.driverName}
          </h2>

          <p className="text-xs sm:text-sm text-amber-100 mt-1 font-mono flex items-center gap-2">
            <span>গাড়ির নম্বর: <strong>{regNumber}</strong></span>
            <span>•</span>
            <span>লোকেশন: <strong>{locationName}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {status === 'available' ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>🟢 ট্রিপের জন্য প্রস্তুত (Available)</span>
            </span>
          ) : (
            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <span>🟡 ট্রিপে ব্যস্ত (Busy)</span>
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">অ্যাম্বুলেন্সের তথ্য সফলভাবে আপডেট করা হয়েছে!</p>
            <p className="text-xs text-emerald-700">গাড়ির নম্বর, যোগাযোগের ফোন এবং বর্তমান স্ট্যান্ডবাই লোকেশন লাইভ ম্যাপে আপডেট হয়েছে।</p>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>গাড়ির তথ্য, ফোন নম্বর ও লোকেশন আপডেট</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            লগইন করার পর আপনি আপনার গাড়ির রেজিস্ট্রেশন নম্বর, চালকের মোবাইল নম্বর এবং বর্তমান লোকেশন আপডেট করতে পারবেন।
          </p>
        </div>

        {/* 3 Status Choices */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            বর্তমান প্রস্তুত অবস্থা (Operational Status)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setStatus('available')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${
                status === 'available'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50/50'
              }`}
            >
              <span className="text-xl sm:text-2xl block mb-1">🟢</span>
              <span className="text-xs sm:text-sm block font-bold">Available</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ট্রিপের জন্য প্রস্তুত</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('busy')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${
                status === 'busy'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-sm ring-2 ring-amber-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50/50'
              }`}
            >
              <span className="text-xl sm:text-2xl block mb-1">🟡</span>
              <span className="text-xs sm:text-sm block font-bold">Busy on Trip</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">রোগী পরিবহনে ব্যস্ত</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('offline')}
              className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${
                status === 'offline'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-sm ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50/50'
              }`}
            >
              <span className="text-xl sm:text-2xl block mb-1">🔴</span>
              <span className="text-xs sm:text-sm block font-bold">Offline</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">অফ-ডিউটি / বন্ধ</span>
            </button>
          </div>
        </div>

        {/* Row 1: Car / Vehicle Number & Driver Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Car / Vehicle Number (গাড়ির নম্বর) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ১. গাড়ির রেজিস্ট্রেশন নম্বর (Vehicle / Car Number)
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="যেমন: Dhaka Metro-Cha-11-2024"
                className="w-full text-sm font-mono font-bold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">গাড়ির প্লেট বা রেজিস্ট্রেশন নম্বর লিখুন।</span>
          </div>

          {/* 2. Driver Phone Number (চালকের ফোন নম্বর) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ২. চালকের মোবাইল নম্বর (Driver Phone Number)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1711 991122"
                className="w-full text-sm font-mono font-bold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">জরুরি রোগী সরাসরি এই নম্বরে কল করবেন।</span>
          </div>
        </div>

        {/* Row 2: Location / Standby Area & ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 3. Location / Standby Location (বর্তমান লোকেশন) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৩. বর্তমান লোকেশন / স্ট্যান্ডবাই এলাকা (Location / Standby Point)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="যেমন: Panthapath Standby Point, Dhaka"
                className="w-full text-sm font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">অ্যাম্বুলেন্সটি বর্তমানে কোন এলাকায় অবস্থান করছে।</span>
          </div>

          {/* 4. Vehicle type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৪. গাড়ির ধরন (Vehicle Type)
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as Ambulance['vehicleType'])}
              className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
            >
              <option value="AC Ambulance">AC Ambulance</option>
              <option value="Non-AC Ambulance">Non-AC Ambulance</option>
              <option value="ICU Ambulance">ICU Ambulance</option>
              <option value="Freezing Ambulance">Freezing Ambulance</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-500">
            {myAmbulance?.verified
              ? 'সেভ করলে পাবলিক অ্যাম্বুলেন্স লিস্টে আপডেট হবে। লোকেশন হিসেবে আপনার বর্তমান GPS ব্যবহার হবে।'
              : 'অ্যাডমিন যাচাই করার পর আপনার অ্যাম্বুলেন্স পাবলিক লিস্টে দেখাবে।'}
            {saveError && <span className="block text-red-700 font-semibold mt-1">{saveError}</span>}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="disabled:opacity-60 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>গাড়ির তথ্য সেভ করুন (Save Updates)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
