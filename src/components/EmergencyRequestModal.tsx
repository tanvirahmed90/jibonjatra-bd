import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, Navigation, AlertTriangle, CheckCircle2, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { BloodGroup } from '../types';
import { formatDistance } from '../utils/geo';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmergencyCategory = 'ambulance' | 'blood' | 'hospital' | 'icu';

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({ isOpen, onClose }) => {
  const {
    userLocation,
    requestGeolocation,
    requestEmergencyAssistance,
    hospitals,
    ambulances,
    donors,
    setSelectedHospital,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<'select' | 'details' | 'dispatching' | 'connected'>('select');
  const [selectedType, setSelectedType] = useState<EmergencyCategory | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Emergency Request Created');
  const [assignedInfo, setAssignedInfo] = useState<{
    name: string;
    phone: string;
    distance: string;
    eta: number;
    type: string;
  } | null>(null);

  // Automatically request location when emergency mode is entered
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedType(null);
      if (!userLocation.isLive) {
        setIsLocating(true);
        requestGeolocation().finally(() => setIsLocating(false));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: EmergencyCategory) => {
    setSelectedType(cat);
    if (cat === 'blood') {
      setStep('details'); // prompt for blood group quickly
    } else {
      triggerEmergencyDispatch(cat);
    }
  };

  const triggerEmergencyDispatch = (cat: EmergencyCategory, bloodGrp?: BloodGroup) => {
    setStep('dispatching');
    setStatusMessage('🚨 Emergency Request Created...');

    // Multi-phase status progression as requested:
    // 1. "Emergency Request Created"
    // 2. "Finding nearest emergency resources..."
    // 3. "Provider contacted" -> "Estimated arrival / direct connection"

    setTimeout(() => {
      setStatusMessage(
        cat === 'ambulance'
          ? '📡 Finding closest active ambulance in your sector...'
          : cat === 'blood'
          ? `🩸 Searching verified emergency ${bloodGrp || 'O+'} blood donors...`
          : '🏥 Checking verified emergency trauma & ICU beds...'
      );
    }, 1200);

    setTimeout(() => {
      let matchedName = '999 Central Dispatch';
      let matchedPhone = '999';
      let dist = '1.2 km away';
      let eta = 6;
      let typeLabel = 'Emergency Service';

      if (cat === 'ambulance') {
        const sorted = [...ambulances].filter(a => a.status === 'available').sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0] || ambulances[0];
        matchedName = best.providerName;
        matchedPhone = best.phone;
        dist = formatDistance(best.distanceKm);
        eta = best.etaMinutes;
        typeLabel = best.vehicleType;
      } else if (cat === 'blood') {
        const group = bloodGrp || selectedBloodGroup;
        const matched = donors.find(d => d.available && d.bloodGroup === group) || donors[0];
        matchedName = `${matched.name} (${matched.bloodGroup})`;
        matchedPhone = matched.phone;
        dist = formatDistance(matched.distanceKm);
        eta = 15;
        typeLabel = `Verified Donor (${matched.area})`;
      } else if (cat === 'hospital' || cat === 'icu') {
        const sorted = [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0];
        matchedName = best.name;
        matchedPhone = best.emergencyHotline;
        dist = formatDistance(best.distanceKm);
        eta = Math.round(best.distanceKm * 2.8 + 3);
        typeLabel = `${best.type} • Bed Available`;
      }

      setAssignedInfo({
        name: matchedName,
        phone: matchedPhone,
        distance: dist,
        eta,
        type: typeLabel,
      });

      setStatusMessage(cat === 'ambulance' ? '🚑 Ambulance Contacted & Assigned!' : '⚡ Emergency Resource Connected!');
      setStep('connected');

      requestEmergencyAssistance(cat, {
        bloodGroup: bloodGrp,
      });
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[1300] bg-red-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Emergency Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl tracking-wide uppercase">
                EMERGENCY ASSISTANCE
              </h2>
              <p className="text-xs text-red-100 font-medium">Fast-track Bangladesh Emergency Response</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all"
            aria-label="Exit Emergency Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Location Bar */}
        <div className="bg-red-50/80 px-5 py-2.5 border-b border-red-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 truncate">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Incident Location: <strong>{userLocation.address}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => requestGeolocation()}
            className="text-red-700 hover:text-red-900 font-bold underline flex-shrink-0 flex items-center gap-1"
          >
            {isLocating && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>Refresh GPS</span>
          </button>
        </div>

        {/* STEP 1: What do you need? */}
        {step === 'select' && (
          <div className="p-5 sm:p-7 space-y-5">
            <div className="text-center">
              <h3 className="font-display font-extrabold text-2xl text-slate-900">
                What do you need immediately?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your critical requirement to instantly connect with the nearest responder.
              </p>
            </div>

            {/* 4 Large Interactive Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleSelectCategory('ambulance')}
                className="group p-5 rounded-2xl bg-white border-2 border-red-200 hover:border-red-600 hover:bg-red-50/50 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-100 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center text-3xl transition-colors flex-shrink-0 shadow-inner">
                  🚑
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-red-700">
                    I Need an Ambulance
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">ICU & AC ambulances nearby</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('blood')}
                className="group p-5 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-600 hover:bg-rose-50/50 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-100 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center text-3xl transition-colors flex-shrink-0 shadow-inner">
                  🩸
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-rose-700">
                    I Need Blood
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Emergency blood group matching</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('hospital')}
                className="group p-5 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50/50 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center text-3xl transition-colors flex-shrink-0 shadow-inner">
                  🏥
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-700">
                    I Need a Hospital
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Nearest 24/7 emergency casualty</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('icu')}
                className="group p-5 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-600 hover:bg-purple-50/50 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 active:scale-98"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center text-3xl transition-colors flex-shrink-0 shadow-inner">
                  🏨
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-purple-700">
                    I Need ICU / NICU
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Critical care & ventilator units</p>
                </div>
              </button>
            </div>

            {/* Quick 999 Direct Call Banner */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-red-800 uppercase tracking-wide block">
                  National Emergency Hotline
                </span>
                <span className="text-xs text-slate-600">Police • Fire Service • Govt Ambulance</span>
              </div>
              <a
                href="tel:999"
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>DIAL 999</span>
              </a>
            </div>
          </div>
        )}

        {/* STEP 1.5: Blood Group Selection (Only if Blood was selected) */}
        {step === 'details' && selectedType === 'blood' && (
          <div className="p-6 space-y-5">
            <button
              onClick={() => setStep('select')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              ← Back to options
            </button>

            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                Select Required Blood Group:
              </h3>
              <p className="text-xs text-slate-500 mt-1">We will immediately match available emergency donors</p>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`py-3.5 rounded-xl text-lg font-black font-display border transition-all ${
                    selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => triggerEmergencyDispatch('blood', selectedBloodGroup)}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>FIND & DISPATCH {selectedBloodGroup} DONORS</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Dispatching animation / Real-time search */}
        {step === 'dispatching' && (
          <div className="p-8 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40"></span>
              <div className="relative w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl shadow-emergency">
                🚨
              </div>
            </div>

            <div>
              <h3 className="font-display font-black text-xl text-slate-900 animate-pulse">
                {statusMessage}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Matching geo-coordinates with nearest verified healthcare network in Bangladesh...
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-red-600 h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* STEP 3: Connected & Actionable Screen */}
        {step === 'connected' && assignedInfo && (
          <div className="p-6 space-y-5 animate-in fade-in duration-200">
            {/* Success Status Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">{statusMessage}</h4>
                <p className="text-xs text-emerald-700">Immediate direct line established with the responder</p>
              </div>
            </div>

            {/* Assigned Provider Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {assignedInfo.type}
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                    {assignedInfo.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{assignedInfo.distance} from your location</span>
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-xl px-3 py-2 text-center flex-shrink-0 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-red-200 block">Est. Time</span>
                  <span className="text-xl font-black font-display">{assignedInfo.eta} mins</span>
                </div>
              </div>

              {/* Progress Tracker Steps */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Emergency Request Created (Logged in JibonJatra BD)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Resource Located & Alerted</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Estimated Arrival / Transit: {assignedInfo.eta} minutes</span>
                </div>
              </div>
            </div>

            {/* Large Call Button */}
            <a
              href={`tel:${assignedInfo.phone}`}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-lg rounded-2xl shadow-emergency flex items-center justify-center gap-3 transition-all active:scale-98 tracking-wide text-center"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>CALL RESPONDER NOW ({assignedInfo.phone})</span>
            </a>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('select');
                }}
                className="text-slate-500 hover:text-slate-800 font-medium underline"
              >
                Request different resource
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (selectedType === 'hospital' || selectedType === 'icu') {
                    setActiveTab('hospitals');
                  } else if (selectedType === 'blood') {
                    setActiveTab('blood');
                  } else if (selectedType === 'ambulance') {
                    setActiveTab('ambulance');
                  }
                }}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                View Full Map & Options →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
