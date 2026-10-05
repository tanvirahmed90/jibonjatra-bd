import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Building2, Droplet, Truck, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsEmergencyModeOpen,
    setIsAuthModalOpen,
  } = useApp();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1050] bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl px-2 py-1 pb-safe">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          type="button"
          onClick={() => handleTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Hospitals */}
        <button
          type="button"
          onClick={() => handleTab('hospitals')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'hospitals' ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Hospitals</span>
        </button>

        {/* Elevated Center EMERGENCY Button */}
        <div className="-mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsEmergencyModeOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-emergency flex items-center justify-center text-2xl border-4 border-white active:scale-90 transition-transform animate-pulse-fast"
            aria-label="Immediate Emergency Help"
          >
            🚨
          </button>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-tight mt-0.5">
            Emergency
          </span>
        </div>

        {/* Blood */}
        <button
          type="button"
          onClick={() => handleTab('blood')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'blood' ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-5 h-5 text-rose-500" />
          <span className="text-[10px] mt-0.5">Blood</span>
        </button>

        {/* Ambulance */}
        <button
          type="button"
          onClick={() => handleTab('ambulance')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'ambulance' ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Ambulance</span>
        </button>
      </div>
    </nav>
  );
};
