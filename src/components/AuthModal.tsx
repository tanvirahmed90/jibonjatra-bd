import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Truck, Droplet, Phone, Loader2, UserPlus, LogIn, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SelfRegisterRole } from '../lib/backend';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

/**
 * Real login / registration (Supabase Auth).
 * - Passwords are checked by the server; no demo logins.
 * - Only "donor" and "ambulance" accounts can be self-registered. Admins are promoted in the
 *   database (see supabase/schema.sql) — nobody can make themselves admin from the website.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, resetPassword, backendConfigured, authModalMode, authModalRole, setActiveTab } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<SelfRegisterRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(authModalMode);
      setRole(authModalRole);
      setError(null);
      setInfo(null);
      setPassword('');
    }
  }, [isOpen, authModalMode, authModalRole]);

  if (!isOpen) return null;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      await fn();
    } catch (err) {
      setError((err as Error)?.message || 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await signIn(email, password);
      onClose();
      setActiveTab('dashboard');
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (name.trim().length < 2) return setError('পূর্ণ নাম লিখুন।');
    if (!BD_PHONE.test(cleanPhone)) return setError('সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।');
    if (password.length < 8) return setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
    run(async () => {
      const result = await signUp({ name, email, phone: cleanPhone, password, role });
      if (result === 'confirm_email') {
        setInfo('অ্যাকাউন্ট তৈরি হয়েছে! আপনার ইমেইলে একটি কনফার্মেশন লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে তারপর লগইন করুন।');
        setMode('login');
      } else {
        onClose();
        setActiveTab('dashboard');
      }
    });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await resetPassword(email);
      setInfo('পাসওয়ার্ড রিসেট করার লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
      setMode('login');
    });
  };

  const inputCls =
    'w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-800 to-slate-900 text-white p-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h3 className="font-display font-black text-xl text-white">
              {mode === 'login' && 'লগইন করুন'}
              {mode === 'register' && 'নতুন অ্যাকাউন্ট তৈরি করুন'}
              {mode === 'forgot' && 'পাসওয়ার্ড রিসেট'}
            </h3>
            <p className="text-xs text-rose-200 mt-0.5">রক্তদাতা ও অ্যাম্বুলেন্স সেবাদাতাদের জন্য</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {!backendConfigured ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>অ্যাকাউন্ট সিস্টেম এখনো চালু হয়নি</span>
              </div>
              <p className="text-xs leading-relaxed">
                সাইটের অ্যাডমিনকে Supabase সেটআপ সম্পন্ন করতে হবে (README দেখুন)। ততক্ষণ হাসপাতাল ও অ্যাম্বুলেন্স খোঁজা
                সহ বাকি সব ফিচার লগইন ছাড়াই ব্যবহার করা যাবে।
              </p>
            </div>
          ) : (
            <>
              {mode !== 'forgot' && (
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['login', 'register'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setError(null);
                      }}
                      className={`py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                        mode === m ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {m === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{m === 'login' ? 'লগইন' : 'রেজিস্টার'}</span>
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl p-3">{error}</div>
              )}
              {info && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl p-3 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{info}</span>
                </div>
              )}

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { r: 'donor', label: 'রক্তদাতা', icon: Droplet },
                      { r: 'ambulance', label: 'অ্যাম্বুলেন্স সেবা', icon: Truck },
                    ] as const
                  ).map(({ r, label, icon: Icon }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        role === r ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot}
                className="space-y-3"
              >
                {mode === 'register' && (
                  <>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input className={inputCls} placeholder="পূর্ণ নাম" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        className={inputCls}
                        placeholder="মোবাইল নম্বর (017XXXXXXXX)"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="ইমেইল"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      className={inputCls}
                      type="password"
                      placeholder={mode === 'register' ? 'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)' : 'পাসওয়ার্ড'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={mode === 'register' ? 8 : undefined}
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    />
                  </div>
                )}

                {mode === 'register' && role === 'donor' && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    রেজিস্টার করলে আপনার নাম, রক্তের গ্রুপ, এলাকা ও ফোন নম্বর রক্তপ্রার্থীদের দেখানো হবে যাতে তারা আপনার সাথে
                    যোগাযোগ করতে পারে। যেকোনো সময় প্রোফাইল থেকে "Available" বন্ধ করতে পারবেন।
                  </p>
                )}
                {mode === 'register' && role === 'ambulance' && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    অ্যাডমিন আপনার তথ্য যাচাই করার পর আপনার অ্যাম্বুলেন্স পাবলিক তালিকায় দেখাবে।
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {mode === 'login' && 'লগইন'}
                    {mode === 'register' && 'অ্যাকাউন্ট তৈরি করুন'}
                    {mode === 'forgot' && 'রিসেট লিংক পাঠান'}
                  </span>
                </button>
              </form>

              <div className="text-center">
                {mode === 'login' ? (
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs text-slate-500 hover:text-rose-700 font-semibold">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                ) : mode === 'forgot' ? (
                  <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-500 hover:text-rose-700 font-semibold">
                    ← লগইনে ফিরে যান
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
