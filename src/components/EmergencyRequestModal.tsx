import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, Navigation, AlertTriangle, CheckCircle2, Clock, MapPin, Loader2, ArrowRight, Map as MapIcon, ExternalLink } from 'lucide-react';
import { BloodGroup, Hospital, Ambulance, BloodDonor } from '../types';
import { formatDistance, POPULAR_BANGLADESH_AREAS } from '../utils/geo';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmergencyCategory = 'ambulance' | 'blood' | 'hospital' | 'icu';

interface AssignedInfo {
  name: string;
  phone: string;
  distance: string;
  eta: number;
  type: string;
  address?: string;
  lat: number;
  lng: number;
  hospital?: Hospital;
  ambulance?: Ambulance;
  donor?: BloodDonor;
}

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({ isOpen, onClose }) => {
  const {
    userLocation,
    requestGeolocation,
    setUserCustomLocation,
    requestEmergencyAssistance,
    hospitals,
    ambulances,
    donors,
    setSelectedHospital,
    setActiveTab,
    navigateToHospitalMap,
  } = useApp();

  const [step, setStep] = useState<'select' | 'details' | 'dispatching' | 'connected'>('select');
  const [selectedType, setSelectedType] = useState<EmergencyCategory | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [isLocating, setIsLocating] = useState(false);
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Emergency Request Created');
  const [assignedInfo, setAssignedInfo] = useState<AssignedInfo | null>(null);

  // Automatically request location when emergency mode is entered
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedType(null);
      setShowAreaPicker(false);
      if (!userLocation.isLive) {
        setIsLocating(true);
        requestGeolocation(true).finally(() => setIsLocating(false));
      }
    }
  }, [isOpen]);

  // Re-sync assigned resource if location changes while in 'connected' view
  useEffect(() => {
    if (step === 'connected' && selectedType) {
      if (selectedType === 'hospital' || selectedType === 'icu') {
        const sorted = [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0];
        if (best) {
          setAssignedInfo(prev => prev ? {
            ...prev,
            name: best.name,
            phone: best.emergencyHotline,
            distance: formatDistance(best.distanceKm),
            eta: Math.round(best.distanceKm * 2.8 + 3),
            type: `${best.type} • Bed Available`,
            address: best.address,
            lat: best.lat,
            lng: best.lng,
            hospital: best,
          } : null);
        }
      } else if (selectedType === 'ambulance') {
        const sorted = [...ambulances].filter(a => a.status === 'available').sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0] || ambulances[0];
        if (best) {
          const dist = formatDistance(best.distanceKm);
          setAssignedInfo(prev => prev ? {
            ...prev,
            name: best.providerName,
            phone: best.phone,
            distance: dist,
            eta: best.etaMinutes,
            type: best.vehicleType,
            address: `Active in Sector (${dist})`,
            lat: best.lat,
            lng: best.lng,
            ambulance: best,
          } : null);
        }
      } else if (selectedType === 'blood') {
        const group = selectedBloodGroup;
        const matched = donors.find(d => d.available && d.bloodGroup === group) || donors[0];
        if (matched) {
          setAssignedInfo(prev => prev ? {
            ...prev,
            name: `${matched.name} (${matched.bloodGroup})`,
            phone: matched.phone,
            distance: formatDistance(matched.distanceKm),
            type: `Verified Donor (${matched.area})`,
            address: `${matched.area}, Bangladesh`,
            lat: matched.lat,
            lng: matched.lng,
            donor: matched,
          } : null);
        }
      }
    }
  }, [userLocation.lat, userLocation.lng, hospitals, ambulances, donors, step, selectedType, selectedBloodGroup]);

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
      let matchedAddress = 'Central Dispatch, Dhaka';
      let targetLat = userLocation.lat;
      let targetLng = userLocation.lng;
      let matchedHospital: Hospital | undefined;
      let matchedAmbulance: Ambulance | undefined;
      let matchedDonor: BloodDonor | undefined;

      if (cat === 'ambulance') {
        const sorted = [...ambulances].filter(a => a.status === 'available').sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0] || ambulances[0];
        matchedName = best.providerName;
        matchedPhone = best.phone;
        dist = formatDistance(best.distanceKm);
        eta = best.etaMinutes;
        typeLabel = best.vehicleType;
        targetLat = best.lat;
        targetLng = best.lng;
        matchedAddress = `Active in Dhaka Sector (${dist})`;
        matchedAmbulance = best;
      } else if (cat === 'blood') {
        const group = bloodGrp || selectedBloodGroup;
        const matched = donors.find(d => d.available && d.bloodGroup === group) || donors[0];
        matchedName = `${matched.name} (${matched.bloodGroup})`;
        matchedPhone = matched.phone;
        dist = formatDistance(matched.distanceKm);
        eta = 15;
        typeLabel = `Verified Donor (${matched.area})`;
        targetLat = matched.lat;
        targetLng = matched.lng;
        matchedAddress = `${matched.area}, Bangladesh`;
        matchedDonor = matched;
      } else if (cat === 'hospital' || cat === 'icu') {
        const sorted = [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm);
        const best = sorted[0];
        matchedName = best.name;
        matchedPhone = best.emergencyHotline;
        dist = formatDistance(best.distanceKm);
        eta = Math.round(best.distanceKm * 2.8 + 3);
        typeLabel = `${best.type} • Bed Available`;
        targetLat = best.lat;
        targetLng = best.lng;
        matchedAddress = best.address;
        matchedHospital = best;
      }

      setAssignedInfo({
        name: matchedName,
        phone: matchedPhone,
        distance: dist,
        eta,
        type: typeLabel,
        address: matchedAddress,
        lat: targetLat,
        lng: targetLng,
        hospital: matchedHospital,
        ambulance: matchedAmbulance,
        donor: matchedDonor,
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
        <div className="bg-red-50/90 px-3.5 sm:px-5 py-2.5 border-b border-red-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 truncate min-w-0 max-w-[200px] sm:max-w-xs">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">
              Location: <strong>{userLocation.address}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAreaPicker(prev => !prev)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-bold text-[10px] sm:text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="Select your neighborhood if GPS is off or approximate"
            >
              <span>{showAreaPicker ? '✕ Close' : '✏️ Change Area'}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setIsLocating(true);
                try {
                  await requestGeolocation(false);
                } finally {
                  setIsLocating(false);
                }
              }}
              disabled={isLocating}
              className="text-red-700 hover:text-red-900 font-bold underline flex items-center gap-1 cursor-pointer disabled:opacity-60 text-[10px] sm:text-[11px]"
              title="Detect and refresh GPS location"
            >
              {isLocating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isLocating ? 'Detecting...' : '🔄 Refresh GPS'}</span>
            </button>
          </div>
        </div>

        {/* Quick Area Picker Dropdown / Drawer */}
        {showAreaPicker && (
          <div className="bg-amber-50/95 border-b border-amber-200 p-3 sm:p-4 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <span>📍</span> আপনার এলাকা নির্বাচন করুন (1-Tap Dispatch Update):
              </span>
              <span className="text-[10px] text-amber-800">কাছের হাসপাতাল ও অ্যাম্বুলেন্স দ্রুত আপডেট হবে</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {POPULAR_BANGLADESH_AREAS.map((area) => (
                <button
                  key={area.name}
                  type="button"
                  onClick={() => {
                    setUserCustomLocation(area.lat, area.lng, area.name);
                    setShowAreaPicker(false);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-red-50 hover:border-red-400 border border-amber-200 rounded-lg text-slate-800 text-[11px] font-medium text-left truncate transition-colors cursor-pointer active:scale-95"
                  title={area.name}
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
            {/* Success Status Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">{statusMessage}</h4>
                <p className="text-[11px] sm:text-xs text-emerald-700">Immediate direct line established with the responder</p>
              </div>
            </div>

            {/* Assigned Provider Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {assignedInfo.type}
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-1">
                    {assignedInfo.name}
                  </h3>
                  {assignedInfo.address && (
                    <p className="text-[11px] sm:text-xs text-slate-700 flex items-start gap-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{assignedInfo.address}</span>
                    </p>
                  )}
                  <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{assignedInfo.distance} from your incident point</span>
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-center flex-shrink-0 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-200 block">Est. Time</span>
                  <span className="text-lg sm:text-xl font-black font-display">{assignedInfo.eta} mins</span>
                </div>
              </div>

              {/* Progress Tracker Steps */}
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 text-[11px] sm:text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Emergency Request Created (Logged in JibonJatra BD)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Resource Located & Alerted</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span>Estimated Arrival / Transit: {assignedInfo.eta} minutes</span>
                </div>
              </div>

              {/* Real Location Navigation Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <a
                  href={assignedInfo?.lat && assignedInfo?.lng
                    ? `https://www.google.com/maps/dir/?api=1&destination=${assignedInfo.lat},${assignedInfo.lng}&travelmode=driving`
                    : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 sm:py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs text-center"
                  title="Open live Google Maps turn-by-turn directions from your phone's GPS"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Maps GPS Navigation</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (assignedInfo.hospital) {
                      navigateToHospitalMap(assignedInfo.hospital);
                    } else if (selectedType === 'blood') {
                      setActiveTab('blood');
                    } else if (selectedType === 'ambulance') {
                      setActiveTab('ambulance');
                    } else {
                      setActiveTab('hospitals');
                    }
                  }}
                  className="py-2 sm:py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs text-center"
                >
                  <MapIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>View Hospital Pin on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Compact & Proportional Call Responder Button */}
            <a
              href={`tel:${assignedInfo.phone}`}
              className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl sm:rounded-2xl shadow-emergency flex items-center justify-center gap-3 transition-all active:scale-98 text-center group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-bounce" />
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                  CALL RESPONDER NOW:
                </span>
                <span className="text-xs sm:text-sm font-black font-mono tracking-wider bg-black/20 px-2 py-0.5 rounded-lg">
                  {assignedInfo.phone}
                </span>
              </div>
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
                  if (assignedInfo.hospital) {
                    navigateToHospitalMap(assignedInfo.hospital);
                  } else if (selectedType === 'hospital' || selectedType === 'icu') {
                    setActiveTab('hospitals');
                  } else if (selectedType === 'blood') {
                    setActiveTab('blood');
                  } else if (selectedType === 'ambulance') {
                    setActiveTab('ambulance');
                  }
                }}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
              >
                <span>View Full Map & Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
