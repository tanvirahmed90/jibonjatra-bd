import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Menu, X, User as UserIcon, Shield, Building2, Truck, Droplet, HeartPulse, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsEmergencyModeOpen,
    setIsAuthModalOpen,
    currentUser,
    switchUserRole,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'hospitals', label: 'Find Hospital' },
    { id: 'blood', label: 'Blood Donor' },
    { id: 'ambulance', label: 'Ambulance' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'hospital':
        return { label: 'Hospital Staff', color: 'bg-emerald-100 text-emerald-800' };
      case 'ambulance':
        return { label: 'Ambulance Dispatch', color: 'bg-amber-100 text-amber-800' };
      case 'donor':
        return { label: 'Blood Donor', color: 'bg-rose-100 text-rose-800' };
      case 'admin':
        return { label: 'DGHS Admin', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Citizen', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const currentRoleConfig = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-[1100] bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Icon */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
              <span className="text-xl sm:text-2xl font-black">✚</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                  Jibon<span className="text-red-600">Jatra</span>
                </span>
                <span className="bg-red-100 text-red-700 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                  BD
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                জীবনযাত্রা • 24/7 Emergency Healthcare Network
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === link.id
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Dashboards shortcut if applicable */}
            {currentUser.role !== 'patient' && (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'dashboard' || activeTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                ⚙️ {currentUser.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}
              </button>
            )}

            {/* Glowing Emergency Button in Center/Desktop */}
            <button
              onClick={() => setIsEmergencyModeOpen(true)}
              className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-emergency hover:shadow-emergency-lg active:scale-95 transition-all flex items-center gap-1.5 border border-red-400/30 animate-pulse-fast"
            >
              <span className="text-base">🚨</span>
              <span>EMERGENCY</span>
            </button>
          </nav>

          {/* Right: User Role Switcher / Profile / Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role indicator dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                title="Switch View Mode / Role"
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentRoleConfig.color}`}>
                  {currentRoleConfig.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-[1200] animate-in fade-in duration-150">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                    Switch Test Profile:
                  </div>
                  {(['patient', 'hospital', 'ambulance', 'donor', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchUserRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        currentUser.role === r
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="capitalize">{r === 'patient' ? 'Citizen (Patient)' : r}</span>
                      {currentUser.role === r && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar / Auth Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-red-500"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Active Profile:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentRoleConfig.color}`}>
              {currentRoleConfig.label}
            </span>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === link.id
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              {activeTab === link.id && <span className="text-red-600">●</span>}
            </button>
          ))}

          {currentUser.role !== 'patient' && (
            <button
              onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 flex items-center justify-between"
            >
              <span>⚙️ {currentUser.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}</span>
              <span>→</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEmergencyModeOpen(true);
              }}
              className="w-full py-3.5 bg-red-600 text-white font-extrabold text-sm rounded-xl shadow-emergency flex items-center justify-center gap-2"
            >
              <span>🚨 IMMEDIATE EMERGENCY HELP</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
