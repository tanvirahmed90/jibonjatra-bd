import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Shield, 
  Truck, 
  Droplet, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Phone,
  MapPin,
  Calendar,
  Hash,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { UserRole, BloodGroup } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUserRole, registerUserAccount } = useApp();
  
  // Tabs: 'register' (Account Creation - default), 'login' (Sign In), 'demo' (1-click testing)
  const [activeTab, setActiveTabState] = useState<'register' | 'login' | 'demo'>('register');
  
  // Selected Role (Strictly 3 active roles now: 'donor', 'ambulance', 'admin')
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  
  // Common Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Specific Blood Donor Fields
  const [age, setAge] = useState<number>(25);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [donorArea, setDonorArea] = useState('Dhanmondi, Dhaka');
  const [lastDonationDate, setLastDonationDate] = useState('2026-04-10');

  // Specific Ambulance Driver Fields
  const [regNumber, setRegNumber] = useState('Dhaka Metro-Cha-11-2024');
  const [standbyLocation, setStandbyLocation] = useState('Panthapath Standby Point, Dhaka');

  // Admin Code
  const [adminCode, setAdminCode] = useState('');

  if (!isOpen) return null;

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle Account Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'donor') {
      registerUserAccount(
        {
          id: `user-${Date.now()}`,
          name: name || 'Voluntary Donor',
          email,
          phone: phone || '+880 1712 000000',
          role: 'donor',
          age: Number(age),
          bloodGroup,
          area: donorArea,
          lastDonationDate,
        },
        {
          donor: {
            age: Number(age),
            bloodGroup,
            phone: phone || '+880 1712 000000',
            area: donorArea,
            lastDonationDate,
          }
        }
      );
    } else if (selectedRole === 'ambulance') {
      registerUserAccount(
        {
          id: `user-${Date.now()}`,
          name: name || 'Ambulance Driver',
          email,
          phone: phone || '+880 1711 000000',
          role: 'ambulance',
          regNumber,
          locationName: standbyLocation,
        },
        {
          ambulance: {
            regNumber,
            phone: phone || '+880 1711 000000',
            locationName: standbyLocation,
          }
        }
      );
    } else {
      registerUserAccount({
        id: `user-${Date.now()}`,
        name: name || 'System Administrator',
        email,
        phone: phone || '+880 2 55165000',
        role: 'admin',
      });
    }

    onClose();
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(selectedRole, true);
    onClose();
  };

  // 1-Click Demo Login
  const handleInstantDemoLogin = (role: UserRole) => {
    switchUserRole(role, true);
    onClose();
  };

  // Auto-fill demo credentials helper
  const handleFillDemoCredentials = (role: UserRole) => {
    setSelectedRole(role);
    const mockUser = INITIAL_USERS.find(u => u.role === role);
    if (mockUser) {
      setEmail(mockUser.email);
      setPassword('password123');
      setName(mockUser.name);
      setPhone(mockUser.phone);
      if (mockUser.age) setAge(mockUser.age);
      if (mockUser.bloodGroup) setBloodGroup(mockUser.bloodGroup);
      if (mockUser.area) setDonorArea(mockUser.area);
      if (mockUser.lastDonationDate) setLastDonationDate(mockUser.lastDonationDate);
      if (mockUser.regNumber) setRegNumber(mockUser.regNumber);
      if (mockUser.locationName) setStandbyLocation(mockUser.locationName);
    }
  };

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-800 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[11px] font-bold border border-rose-400/30 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>3 Dedicated User Portals</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              {activeTab === 'register' && 'নতুন অ্যাকাউন্ট তৈরি করুন'}
              {activeTab === 'login' && 'অ্যাকাউন্টে সাইন-ইন করুন'}
              {activeTab === 'demo' && '১-ক্লিক দ্রুত ডেমো মোড'}
            </h3>
            <p className="text-xs sm:text-sm text-rose-200 mt-0.5">
              রক্তদাতা, অ্যাম্বুলেন্স চালক বা সিস্টেম অ্যাডমিন হিসেবে আপনার পোর্টাল পরিচালনা করুন।
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTabState('register')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'register'
                ? 'border-rose-600 text-rose-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-rose-600" />
            <span>১. অ্যাকাউন্ট তৈরি (Register)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabState('login')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'login'
                ? 'border-rose-600 text-rose-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>২. সাইন-ইন (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabState('demo')}
            className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'demo'
                ? 'border-rose-600 text-rose-600 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>৩. টেস্ট ডেমো (Instant)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-4">

          {/* ======================================================== */}
          {/* TAB 1: REGISTER NEW ACCOUNT (FIRST STEP AS REQUESTED)    */}
          {/* ======================================================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ভূমিকা নির্বাচন করুন (Select Account Role)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  
                  {/* 1. Blood Donor */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('donor')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedRole === 'donor'
                        ? 'border-rose-600 bg-rose-50/70 text-rose-900 shadow-sm ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-xs">Blood Donor</span>
                    </div>
                    <p className="text-[10px] text-slate-500">রক্তদাতা প্রোফাইল ম্যানেজ করুন</p>
                  </button>

                  {/* 2. Ambulance Driver */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ambulance')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedRole === 'ambulance'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-xs">Ambulance Driver</span>
                    </div>
                    <p className="text-[10px] text-slate-500">গাড়ির নম্বর ও লোকেশন আপডেট</p>
                  </button>

                  {/* 3. System Admin */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-xs">System Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500">কেন্দ্রীয় অ্যাডমিন কন্ট্রোল</p>
                  </button>
                </div>
              </div>

              {/* Basic Account Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    আপনার পূর্ণ নাম (Full Name)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ইমেইল (Email Address)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    পাসওয়ার্ড (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোবাইল নম্বর (Phone Number)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712 345678"
                      className="w-full text-sm font-mono pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC ROLE FIELDS: BLOOD DONOR SPECIFIC */}
              {selectedRole === 'donor' && (
                <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase">
                    <Droplet className="w-4 h-4 text-rose-600" />
                    <span>রক্তদাতার নির্দিষ্ট তথ্য (Donor Profile Data)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ১. বয়স (Age)
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        required
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full text-sm font-bold px-3 py-2 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ২. রক্তের গ্রুপ (Blood Group)
                      </label>
                      <select
                        required
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                        className="w-full text-sm font-bold px-3 py-2 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      >
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg} Blood Group
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ৩. এলাকা / লোকেশন (Location)
                      </label>
                      <input
                        type="text"
                        required
                        value={donorArea}
                        onChange={(e) => setDonorArea(e.target.value)}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="w-full text-sm font-semibold px-3 py-2 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ৪. সর্বশেষ রক্তদানের তারিখ (Last Donation)
                      </label>
                      <input
                        type="date"
                        required
                        value={lastDonationDate}
                        onChange={(e) => setLastDonationDate(e.target.value)}
                        className="w-full text-sm px-3 py-2 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ROLE FIELDS: AMBULANCE DRIVER SPECIFIC */}
              {selectedRole === 'ambulance' && (
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>অ্যাম্বুলেন্স চালকের নির্দিষ্ট তথ্য (Driver & Vehicle Data)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ১. গাড়ির রেজিস্ট্রেশন নম্বর (Vehicle Number)
                      </label>
                      <input
                        type="text"
                        required
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        placeholder="e.g. Dhaka Metro-Cha-11-2024"
                        className="w-full text-sm font-mono font-bold px-3 py-2 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ২. বর্তমান লোকেশন / স্ট্যান্ডবাই পয়েন্ট (Location)
                      </label>
                      <input
                        type="text"
                        required
                        value={standbyLocation}
                        onChange={(e) => setStandbyLocation(e.target.value)}
                        placeholder="e.g. Panthapath Standby Point, Dhaka"
                        className="w-full text-sm font-semibold px-3 py-2 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ROLE FIELDS: ADMIN SPECIFIC */}
              {selectedRole === 'admin' && (
                <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 uppercase">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>অ্যাডমিন ভেরিফিকেশন কোড (Admin Authorization)</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="অ্যাডমিন সিক্রেট কোড (e.g. DGHS-2026)"
                      className="w-full text-sm px-3 py-2 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit Register Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>অ্যাকাউন্ট তৈরি করুন ও ড্যাশবোর্ডে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTabState('login')}
                  className="font-bold text-rose-600 hover:underline"
                >
                  লগইন করুন
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SIGN IN TO EXISTING ACCOUNT                       */}
          {/* ======================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ভূমিকা নির্বাচন করুন (Select Role to Login)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemoCredentials('donor')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      selectedRole === 'donor'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Droplet className="w-4 h-4 mx-auto mb-1" />
                    <span>Blood Donor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemoCredentials('ambulance')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      selectedRole === 'ambulance'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 mx-auto mb-1" />
                    <span>Ambulance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemoCredentials('admin')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      selectedRole === 'admin'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Helper auto-fill chip */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px]">টেস্টিংয়ের জন্য ডেমো তথ্য ফিল করতে চান?</span>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials(selectedRole)}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ডেমো ক্রেডেনশিয়াল ফিল করুন</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ইমেইল অ্যাড্রেস (Email Address)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>{selectedRole.toUpperCase()} হিসেবে লগইন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTabState('register')}
                  className="font-bold text-rose-600 hover:underline"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: QUICK 1-CLICK DEMO ACCESS                         */}
          {/* ======================================================== */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                নিচের যেকোনো রোলে ১-ক্লিক করে সরাসরি টেস্ট প্রোফাইলে লগইন করে তার নির্ধারিত ড্যাশবোর্ডে প্রবেশ করতে পারেন:
              </div>

              {/* 1. Blood Donor Card */}
              <div className="border-2 border-rose-200 bg-rose-50/40 hover:border-rose-400 rounded-2xl p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-white shadow-sm border border-rose-200 text-rose-600">
                        <Droplet className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="font-display font-black text-base text-slate-900">
                          Blood Donor (স্বেচ্ছাসেবী রক্তদাতা)
                        </h4>
                        <span className="text-xs text-rose-700 font-semibold">
                          বয়স, রক্তের গ্রুপ, ফোন, এলাকা ও শেষ রক্তদানের তারিখ আপডেট করুন
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-1 pt-1">
                      ডেমো ইউজার: <strong>Tanvir Ahmed</strong> (O+ Donor, Dhanmondi)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('donor')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <span>প্রবেশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Ambulance Driver Card */}
              <div className="border-2 border-amber-200 bg-amber-50/40 hover:border-amber-400 rounded-2xl p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-white shadow-sm border border-amber-200 text-amber-600">
                        <Truck className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="font-display font-black text-base text-slate-900">
                          Ambulance Driver (অ্যাম্বুলেন্স চালক)
                        </h4>
                        <span className="text-xs text-amber-700 font-semibold">
                          গাড়ির নম্বর, চালকের মোবাইল ও বর্তমান লোকেশন আপডেট করুন
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-1 pt-1">
                      ডেমো ইউজার: <strong>Rafiqul Alam</strong> (Red Crescent Ambulance #101)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('ambulance')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <span>প্রবেশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3. System Admin Card */}
              <div className="border-2 border-purple-200 bg-purple-50/40 hover:border-purple-400 rounded-2xl p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-white shadow-sm border border-purple-200 text-purple-600">
                        <Shield className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="font-display font-black text-base text-slate-900">
                          System Admin (সিস্টেম অ্যাডমিন)
                        </h4>
                        <span className="text-xs text-purple-700 font-semibold">
                          রক্তদাতা ও অ্যাম্বুলেন্স ভেরিফিকেশন এবং কেন্দ্রীয় ডিসপ্যাচ মনিটরিং
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-1 pt-1">
                      ডেমো ইউজার: <strong>Central Operations Director (DGHS)</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('admin')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <span>প্রবেশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500 flex-shrink-0">
          JibonJatra BD • Blood Donor, Ambulance Driver & Admin Coordination Platform
        </div>
      </div>
    </div>
  );
};
