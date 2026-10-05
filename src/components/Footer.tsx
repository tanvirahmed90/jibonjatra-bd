import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Heart, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsEmergencyModeOpen, setIsDonorModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                ✚
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Jibon<span className="text-red-500">Jatra</span>
                <span className="text-xs ml-1 bg-red-950 text-red-300 px-1.5 py-0.5 rounded uppercase">BD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              JibonJatra BD (জীবনযাত্রা) — Bangladesh Emergency Healthcare Platform bridging patients to nearby hospitals, ICU/NICU facilities, voluntary blood donors, and 24/7 ambulances.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsEmergencyModeOpen(true)}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>🚨 GET EMERGENCY HELP</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Emergency Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('hospitals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Nearby Hospitals & Trauma Centers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('blood'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Find Emergency Blood Donors
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('ambulance'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  24/7 Ambulance Dispatch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsDonorModalOpen(true)}
                  className="text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Register as Volunteer Blood Donor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Hotlines */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Bangladesh Hotlines
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="tel:999" className="hover:text-red-400 flex items-center gap-1.5 text-slate-200 font-bold">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  <span>999 - National Emergency Service</span>
                </a>
              </li>
              <li>
                <a href="tel:16263" className="hover:text-blue-400 flex items-center gap-1.5 text-slate-200 font-bold">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>16263 - Shastho Batayan (স্বাস্থ্য বাতায়ন)</span>
                </a>
              </li>
              <li>
                <a href="tel:333" className="hover:text-emerald-400 flex items-center gap-1.5 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>333 - National Citizen Helpdesk</span>
                </a>
              </li>
              <li>
                <a href="tel:10655" className="hover:text-purple-400 flex items-center gap-1.5 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>10655 - IEDCR Control Room</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Standards & Safety */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Emergency Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized hospital directory providing 24/7 emergency casualty status, ICU availability, and trauma services across Bangladesh.
            </p>
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block">
                Safety Rule: JibonJatra BD does not falsely claim unverified real-time bed data. Facilities display verified 'Last updated' timestamps.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JibonJatra BD (জীবনযাত্রা). Dedicated to emergency healthcare support.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Emergency Medical Dispatch Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
