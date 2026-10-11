import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, BloodDonor } from '../types';
import { 
  Droplet, 
  Calendar, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  ShieldCheck,
  Heart
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { donors, updateDonorProfile, currentUser } = useApp();

  // Find logged-in donor profile
  const myDonor: BloodDonor =
    donors.find(d => d.id === currentUser.donorId || d.phone === currentUser.phone) ||
    donors[0];

  // Specific state fields requested by user:
  // 1. Age (বয়স)
  // 2. Blood Group (রক্তের গ্রুপ)
  // 3. Phone Number (ফোন নম্বর)
  // 4. Location / Area (লোকেশন)
  // 5. Last Donation Date (সর্বশেষ রক্তদানের তারিখ)
  const [age, setAge] = useState<number>(myDonor.age || currentUser.age || 26);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(myDonor.bloodGroup || (currentUser.bloodGroup as BloodGroup) || 'O+');
  const [phone, setPhone] = useState<string>(myDonor.phone || currentUser.phone || '+880 1712 345678');
  const [area, setArea] = useState<string>(myDonor.area || currentUser.area || 'Dhanmondi, Dhaka');
  const [lastDonationDate, setLastDonationDate] = useState<string>(
    myDonor.lastDonationDate || currentUser.lastDonationDate || '2026-04-12'
  );
  const [available, setAvailable] = useState<boolean>(myDonor.available ?? true);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Calculate next eligible donation date (90 days after last donation)
  const getNextEligibleDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'যেকোনো সময়';
      date.setDate(date.getDate() + 90);
      return date.toISOString().split('T')[0];
    } catch {
      return 'যেকোনো সময়';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateDonorProfile(myDonor.id, {
      age: Number(age),
      bloodGroup,
      phone,
      area,
      lastDonationDate,
      available,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-red-800 to-rose-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/30 text-rose-100 border border-rose-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-200" />
              <span>রক্তদাতা ড্যাশবোর্ড • Voluntary Blood Donor Portal</span>
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
            <span>{currentUser.name || myDonor.name}</span>
            <span className="text-sm bg-white text-rose-700 font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
              {bloodGroup}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>বর্তমান এলাকা: {area}</span>
          </p>
        </div>

        {/* Live Availability Status Badge */}
        <div className="flex items-center gap-2">
          {available ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>রক্ত দিতে প্রস্তুত (Available)</span>
            </span>
          ) : (
            <span className="bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full">
              বর্তমানে অনুপলব্ধ (Unavailable)
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">রক্তদাতার তথ্য সফলভাবে আপডেট করা হয়েছে!</p>
            <p className="text-xs text-emerald-700">জরুরি রোগীরা এখন আপনার এই নতুন তথ্য ও লোকেশন দেখতে পাবেন।</p>
          </div>
        </div>
      )}

      {/* Main Profile Update Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>রক্তদাতার ব্যক্তিগত তথ্য পরিবর্তন করুন</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            লগইন করার পর আপনি শুধুমাত্র আপনার বয়স, রক্তের গ্রুপ, ফোন নম্বর, এলাকা ও সর্বশেষ রক্তদানের তারিখ আপডেট করতে পারবেন।
          </p>
        </div>

        {/* Row 1: Age & Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Age (বয়স) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ১. আপনার বয়স (Age in Years)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                required
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="যেমন: 26"
                className="w-full text-sm font-bold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">রক্তদানের জন্য বয়স ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।</span>
          </div>

          {/* 2. Blood Group (রক্তের গ্রুপ) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ২. রক্তের গ্রুপ (Blood Group)
            </label>
            <div className="relative">
              <Droplet className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full text-sm font-bold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none appearance-none cursor-pointer"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} Blood Group
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">সঠিক রক্তের গ্রুপ নির্বাচন করুন।</span>
          </div>
        </div>

        {/* Row 2: Phone Number & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 3. Phone Number (ফোন নম্বর) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৩. জরুরি যোগাযোগের ফোন নম্বর (Phone Number)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1712 345678"
                className="w-full text-sm font-mono font-bold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">জরুরি প্রয়োজনে রোগীরা এই নম্বরে কল করবেন।</span>
          </div>

          {/* 4. Location / Area (বর্তমান এলাকা / লোকেশন) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৪. বর্তমান এলাকা / লোকেশন (Location / Area)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="যেমন: Dhanmondi, Dhaka"
                className="w-full text-sm font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">আপনার বর্তমান এলাকা বা থানা লিখুন।</span>
          </div>
        </div>

        {/* Row 3: Last Blood Donation Date & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 5. Last Blood Donation Date (সর্বশেষ রক্তদানের তারিখ) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৫. সর্বশেষ কবে রক্ত দিয়েছেন (Last Donation Date)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full text-sm font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              পরবর্তী রক্তদানের উপযুক্ত তারিখ: <strong className="text-slate-700">{getNextEligibleDate(lastDonationDate)}</strong>
            </span>
          </div>

          {/* 6. Availability Toggle (রক্তদানে প্রস্তুত কি না) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ৬. জরুরি রক্তদানের প্রাপ্যতা (Availability)
            </label>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                available
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <span>{available ? '🟢 প্রস্তুত (Ready to donate)' : '🔴 আপাতত ব্যস্ত / প্রস্তুত নন'}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${available ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'}`}>
                {available ? 'ACTIVE' : 'OFF'}
              </span>
            </button>
            <span className="text-[11px] text-slate-400 block mt-1">
              ক্লিক করে আপনার জরুরি প্রাপ্যতা অন অথবা অফ রাখুন।
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            <span>সংরক্ষণ করার পর রোগীর খোঁজে আপনার হালনাগাদ তথ্য দেখানো হবে।</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>তথ্য সেভ করুন (Save Updates)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
