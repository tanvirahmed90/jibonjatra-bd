import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { EmergencyRequestModal } from './components/EmergencyRequestModal';
import { HospitalDetailsModal } from './components/HospitalDetailsModal';
import { DonorRegisterModal } from './components/DonorRegisterModal';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { HospitalsView } from './views/HospitalsView';
import { BloodView } from './views/BloodView';
import { AmbulanceView } from './views/AmbulanceView';
import { AmbulanceDashboard } from './components/AmbulanceDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DonorDashboard } from './components/DonorDashboard';

const MainContent: React.FC = () => {
  const {
    activeTab,
    currentUser,
    isEmergencyModeOpen,
    setIsEmergencyModeOpen,
    selectedHospital,
    setSelectedHospital,
    isDonorModalOpen,
    setIsDonorModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    toastMessage,
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'hospitals':
        return <HospitalsView />;
      case 'blood':
        return <BloodView />;
      case 'ambulance':
        return <AmbulanceView />;
      case 'dashboard':
        if (currentUser.role === 'ambulance') {
          return <AmbulanceDashboard />;
        }
        if (currentUser.role === 'admin') {
          return <AdminDashboard />;
        }
        return <DonorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-800 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Floating Role Switch / Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1400] max-w-lg w-[92%] sm:w-auto bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-100">{toastMessage}</p>
        </div>
      )}

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-12">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals */}
      <EmergencyRequestModal
        isOpen={isEmergencyModeOpen}
        onClose={() => setIsEmergencyModeOpen(false)}
      />

      <HospitalDetailsModal
        hospital={selectedHospital}
        onClose={() => setSelectedHospital(null)}
      />

      <DonorRegisterModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
