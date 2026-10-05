import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Shield, Building2, Truck, Droplet } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUserRole } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleRoleQuickSwitch = (role: UserRole) => {
    switchUserRole(role);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      alert(`Password reset instructions sent to ${email || 'your email'}`);
      setMode('login');
      return;
    }
    switchUserRole(selectedRole);
    onClose();
  };

  const roles = [
    { role: 'patient' as UserRole, label: 'Patient / User', icon: UserIcon, desc: 'Find help & emergency request' },
    { role: 'donor' as UserRole, label: 'Blood Donor', icon: Droplet, desc: 'Volunteer & save lives' },
    { role: 'hospital' as UserRole, label: 'Hospital Staff', icon: Building2, desc: 'Manage ICU & casualty status' },
    { role: 'ambulance' as UserRole, label: 'Ambulance Driver', icon: Truck, desc: 'Update trip & vehicle status' },
    { role: 'admin' as UserRole, label: 'System Admin', icon: Shield, desc: 'Verify registry & oversee incidents' },
  ];

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              {mode === 'login' && 'Sign In to JibonJatra BD'}
              {mode === 'register' && 'Create JibonJatra BD Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            <p className="text-xs text-blue-200">Bangladesh Emergency Healthcare Portal</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Switcher Banner */}
        <div className="bg-blue-50/70 p-4 border-b border-blue-100">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-2">
            ⚡ Quick Demo Mode: Switch Role Instantly
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentUser.role === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleQuickSwitch(r.role)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-left border text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-100/50'
                  }`}
                  title={r.desc}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ariful Hassan"
                  className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.slice(0, 4).map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                      selectedRole === r.role
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <r.icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Register Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>

          {/* Toggle login/register/forgot */}
          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Create one
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-blue-600 hover:underline"
              >
                ← Back to Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
