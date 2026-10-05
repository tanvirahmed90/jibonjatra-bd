import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Droplet, ShieldCheck, Heart, AlertCircle, Check } from 'lucide-react';
import { BloodGroup } from '../types';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

interface DonorRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonorRegisterModal: React.FC<DonorRegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerDonor, userLocation } = useApp();

  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('2026-03-01');
  const [emergencyEligible, setEmergencyEligible] = useState(true);
  const [contactPreference, setContactPreference] = useState<'call' | 'sms' | 'both'>('both');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      alert('Please agree to the emergency volunteer terms and privacy notice.');
      return;
    }

    registerDonor({
      name,
      bloodGroup,
      phone,
      division,
      district: division,
      area: area || `${division} Center`,
      lat: userLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: userLocation.lng + (Math.random() - 0.5) * 0.02,
      available: true,
      emergencyEligible,
      lastActive: 'Just now',
      lastDonationDate,
      donationCount: 1,
      contactPreference,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🩸
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Register as Blood Donor
              </h3>
              <p className="text-xs text-red-100">Join the Bangladesh Emergency Lifesaving Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-xl text-slate-900">
              Registration Received!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for volunteering to save lives in Bangladesh. Your profile is queued for JibonJatra emergency verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Blood Group *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                      bloodGroup === bg
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-red-50'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number (Bangladesh) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +880 1712 345678"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your phone will be protected and displayed only for verified emergency requests.
              </p>
            </div>

            {/* Division & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {BANGLADESH_DIVISIONS.filter(d => d !== 'All Divisions').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Thana / Area *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Approximate Last Donation Date
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Contact Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Contact Preference
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['both', 'call', 'sms'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setContactPreference(pref)}
                    className={`py-2 rounded-xl capitalize font-semibold border ${
                      contactPreference === pref
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {pref === 'both' ? 'Phone & SMS' : pref}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Toggle Switch */}
            <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-xs text-red-950">
                  Available for emergency blood requests
                </h5>
                <p className="text-[11px] text-red-800 mt-0.5">
                  Allow critical patients and trauma centers to reach you during code red emergencies.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emergencyEligible}
                onChange={(e) => setEmergencyEligible(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
            </div>

            {/* Privacy & Consent Messaging */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 mt-0.5 cursor-pointer"
              />
              <label htmlFor="consentCheck" className="text-[11px] cursor-pointer">
                <strong>Privacy & Voluntary Consent:</strong> I agree to have my blood group and approximate area visible for emergency lifesaving requests. JibonJatra BD protects donor personal privacy and strictly restricts commercial solicitation.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!consentAgreed}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98"
            >
              REGISTER AS EMERGENCY DONOR
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
