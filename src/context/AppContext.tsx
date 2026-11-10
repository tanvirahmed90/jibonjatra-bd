import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { Hospital, BloodDonor, Ambulance, EmergencyRequest, User, BloodGroup, HospitalFacilityStatus } from '../types';
import { calculateDistanceKm, getGeolocationWithFallbacks, UNKNOWN_DISTANCE_KM } from '../utils/geo';
import { fetchLiveNearbyHospitals, mergeWithLiveHospitals } from '../utils/liveMapService';
import {
  auth,
  db,
  isBackendConfigured,
  DonorRow,
  AmbulanceRow,
  EmergencyRow,
  HospitalStatusRow,
  ProfileRow,
  SelfRegisterRole,
} from '../lib/backend';

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  isLive: boolean;
}

export interface SignUpInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: SelfRegisterRole;
}

interface AppContextType {
  hospitals: Hospital[];
  donors: BloodDonor[];
  ambulances: Ambulance[];
  /** All driver-registered ambulances incl. unverified (admins see all via RLS) */
  registeredAmbulances: Ambulance[];
  emergencyRequests: EmergencyRequest[];
  isDataLoading: boolean;
  currentUser: User | null;
  myDonor: BloodDonor | null;
  myAmbulance: Ambulance | null;
  backendConfigured: boolean;
  authReady: boolean;
  userLocation: UserLocation;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEmergencyModeOpen: boolean;
  setIsEmergencyModeOpen: (open: boolean) => void;
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  hospitalsViewMode: 'grid' | 'map';
  setHospitalsViewMode: (mode: 'grid' | 'map') => void;
  focusedHospital: Hospital | null;
  setFocusedHospital: (hospital: Hospital | null) => void;
  navigateToHospitalMap: (hospital: Hospital) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register', role?: SelfRegisterRole) => void;
  authModalRole: SelfRegisterRole;
  isDonorModalOpen: boolean;
  setIsDonorModalOpen: (open: boolean) => void;
  activeEmergency: EmergencyRequest | null;
  setActiveEmergency: (req: EmergencyRequest | null) => void;
  requestEmergencyAssistance: (type: 'ambulance' | 'blood' | 'hospital' | 'icu', details?: Partial<EmergencyRequest>) => EmergencyRequest;
  // Auth
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<'signed_in' | 'confirm_email'>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  // Profiles (persisted to the backend)
  saveMyDonorProfile: (updates: Partial<BloodDonor>) => Promise<void>;
  saveMyAmbulanceProfile: (updates: Partial<Ambulance>) => Promise<void>;
  // Admin
  updateHospitalStatus: (hospitalId: string, facilities: Partial<HospitalFacilityStatus>, phone?: string) => Promise<void>;
  verifyEntity: (type: 'donor' | 'ambulance', id: string, verified?: boolean) => Promise<void>;
  refreshEmergencyRequests: () => Promise<void>;
  updateEmergencyStatus: (id: string, status: EmergencyRequest['status']) => Promise<void>;
  // Location
  requestGeolocation: (silent?: boolean) => Promise<boolean>;
  setUserCustomLocation: (lat: number, lng: number, address: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLiveMapSyncing: boolean;
  liveHospitalsCount: number;
  syncLiveNearbyHospitals: (lat?: number, lng?: number) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_LOCATION: UserLocation = {
  lat: 23.75, // Central Dhaka (Panthapath area)
  lng: 90.385,
  address: 'Panthapath, Dhaka (Default Location)',
  isLive: false,
};

const UNKNOWN_FACILITIES: HospitalFacilityStatus = {
  emergency: 'unknown',
  icu: 'unknown',
  nicu: 'unknown',
  ccu: 'unknown',
  hdu: 'unknown',
  ot: 'unknown',
  bloodBank: 'unknown',
  oxygen: 'unknown',
  ventilator: 'unknown',
  pharmacy: 'unknown',
};

// Old versions cached ~1.5 MB of (partly invented) data in localStorage — clear it.
const OBSOLETE_STORAGE_KEYS = [
  'jibonjatra_hospitals_v8',
  'jibonjatra_donors_v10',
  'jibonjatra_ambulances_v8',
  'jibonjatra_current_user',
  'jibonjatra_emergency_requests',
  'medirescue_current_user',
  'medirescue_emergency_requests',
];

const dataUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`;

// ---------------------------------------------------------------------------
// Row → app model mappers
// ---------------------------------------------------------------------------
const donorFromRow = (r: DonorRow): BloodDonor => ({
  id: r.id,
  name: r.name,
  age: r.age ?? undefined,
  bloodGroup: r.blood_group as BloodGroup,
  phone: r.phone,
  division: r.division || '',
  district: r.district || '',
  area: r.area || '',
  lat: r.lat ?? DEFAULT_LOCATION.lat,
  lng: r.lng ?? DEFAULT_LOCATION.lng,
  distanceKm: 0,
  available: r.available,
  emergencyEligible: r.available,
  lastActive: r.updated_at,
  lastDonationDate: r.last_donation_date || '',
  donationCount: 0,
  verified: r.verified,
  contactPreference: 'call',
});

const ambulanceFromRow = (r: AmbulanceRow): Ambulance => ({
  id: r.id,
  providerName: r.provider_name || r.driver_name,
  driverName: r.driver_name,
  phone: r.phone,
  vehicleType: (r.vehicle_type as Ambulance['vehicleType']) || 'AC Ambulance',
  regNumber: r.reg_number,
  locationName: r.location_name || '',
  lat: r.lat ?? DEFAULT_LOCATION.lat,
  lng: r.lng ?? DEFAULT_LOCATION.lng,
  distanceKm: 0,
  etaMinutes: 0,
  status: r.status,
  fareEstimate: '',
  features: [],
  lastUpdated: r.updated_at,
  registered: true,
  verified: r.verified,
});

const emergencyFromRow = (r: EmergencyRow): EmergencyRequest => ({
  id: r.id,
  type: r.type as EmergencyRequest['type'],
  patientName: r.patient_name || '',
  phone: r.phone || '',
  locationName: r.location_name || '',
  lat: r.lat ?? 0,
  lng: r.lng ?? 0,
  urgency: 'critical',
  bloodGroup: (r.blood_group as BloodGroup) || undefined,
  unitsNeeded: r.units_needed ?? undefined,
  status: (r.status === 'open' ? 'searching' : r.status === 'contacted' ? 'contacted' : 'resolved') as EmergencyRequest['status'],
  createdAt: r.created_at,
});

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const area = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.road;
      const city = addr.city || addr.town || addr.district || addr.county || 'Dhaka';
      if (area && city) {
        return `${area}, ${city}`;
      } else if (area || city) {
        return (area || city) as string;
      } else if (data.display_name) {
        return data.display_name.split(',').slice(0, 2).join(', ');
      }
    }
  } catch {
    // fallback
  }
  return `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ---------------- Data ----------------
  const [baseHospitals, setBaseHospitals] = useState<Hospital[]>([]);
  const [liveHospitals, setLiveHospitals] = useState<Hospital[]>([]);
  const [hospitalStatus, setHospitalStatus] = useState<Record<string, HospitalStatusRow>>({});
  const [listedAmbulances, setListedAmbulances] = useState<Ambulance[]>([]);
  const [registeredAmbulances, setRegisteredAmbulances] = useState<Ambulance[]>([]);
  const [donorRows, setDonorRows] = useState<BloodDonor[]>([]);
  const [listedDonors, setListedDonors] = useState<BloodDonor[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ---------------- Auth ----------------
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [myDonor, setMyDonor] = useState<BloodDonor | null>(null);
  const [myAmbulance, setMyAmbulance] = useState<Ambulance | null>(null);
  const [authReady, setAuthReady] = useState(!isBackendConfigured);

  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem('jibonjatra_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LOCATION;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [hospitalsViewMode, setHospitalsViewMode] = useState<'grid' | 'map'>('grid');
  const [focusedHospital, setFocusedHospital] = useState<Hospital | null>(null);
  const [isEmergencyModeOpen, setIsEmergencyModeOpen] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<SelfRegisterRole>('donor');
  const [isDonorModalOpen, setIsDonorModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveMapSyncing, setIsLiveMapSyncing] = useState<boolean>(false);
  const [liveHospitalsCount, setLiveHospitalsCount] = useState<number>(0);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login', role: SelfRegisterRole = 'donor') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  // ---------------- Initial data load ----------------
  useEffect(() => {
    OBSOLETE_STORAGE_KEYS.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });

    let cancelled = false;
    const loadJson = async <T,>(file: string): Promise<T[]> => {
      try {
        const res = await fetch(dataUrl(file));
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as T[];
      } catch (err) {
        console.warn(`Could not load ${file}:`, err);
        return [];
      }
    };

    Promise.all([
      loadJson<Hospital>('hospitals.json'),
      loadJson<Ambulance>('ambulances.json'),
      loadJson<Partial<BloodDonor>>('donors.json'),
    ]).then(([h, a, d]) => {
      if (cancelled) return;
      setListedDonors(
        d.map(x => ({
          ...(x as BloodDonor),
          distanceKm: 0,
          emergencyEligible: true,
          lastActive: '',
          donationCount: 0,
          verified: false,
          contactPreference: 'call',
          listed: true,
        }))
      );
      setBaseHospitals(h);
      setListedAmbulances(a.map(x => ({ ...x, registered: false, verified: false })));
      setIsDataLoading(false);
    });

    if (isBackendConfigured) {
      db.listHospitalStatus()
        .then(rows => !cancelled && setHospitalStatus(Object.fromEntries(rows.map(r => [r.hospital_id, r]))))
        .catch(err => console.warn('hospital_status load failed:', err));
      db.listDonors()
        .then(rows => !cancelled && setDonorRows(rows.map(donorFromRow)))
        .catch(err => console.warn('donors load failed:', err));
      db.listAmbulances()
        .then(rows => !cancelled && setRegisteredAmbulances(rows.map(ambulanceFromRow)))
        .catch(err => console.warn('ambulances load failed:', err));
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------- Auth session ----------------
  const loadAccount = useCallback(async (userId: string) => {
    const p = await db.getMyProfile(userId);
    setProfile(p);
    const [donorList, ambList] = await Promise.all([
      db.listDonors().catch(() => [] as DonorRow[]),
      db.listAmbulances().catch(() => [] as AmbulanceRow[]),
    ]);
    setDonorRows(donorList.map(donorFromRow));
    setRegisteredAmbulances(ambList.map(ambulanceFromRow));
    const d = donorList.find(r => r.user_id === userId);
    const a = ambList.find(r => r.user_id === userId);
    setMyDonor(d ? donorFromRow(d) : null);
    setMyAmbulance(a ? ambulanceFromRow(a) : null);
  }, []);

  useEffect(() => {
    if (!isBackendConfigured) return;
    auth
      .getSession()
      .then(async s => {
        if (s) await loadAccount(s.user.id);
      })
      .catch(err => console.warn('Session restore failed:', err))
      .finally(() => setAuthReady(true));
  }, [loadAccount]);

  const signIn = async (email: string, password: string) => {
    const s = await auth.signIn(email, password);
    await loadAccount(s.user.id);
    showToast('✅ সফলভাবে লগইন হয়েছে');
  };

  const signUp = async (input: SignUpInput): Promise<'signed_in' | 'confirm_email'> => {
    const s = await auth.signUp(input);
    if (!s) return 'confirm_email';
    await loadAccount(s.user.id);
    showToast(`স্বাগতম ${input.name}! আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
    return 'signed_in';
  };

  const resetPassword = (email: string) => auth.resetPassword(email);

  const logout = () => {
    auth.signOut();
    setProfile(null);
    setMyDonor(null);
    setMyAmbulance(null);
    setEmergencyRequests([]);
    setActiveTab('home');
    showToast('👋 সফলভাবে লগআউট করা হয়েছে');
  };

  const currentUser: User | null = useMemo(() => {
    if (!profile) return null;
    return {
      id: profile.id,
      name: profile.name || profile.email.split('@')[0],
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      donorId: myDonor?.id,
      ambulanceId: myAmbulance?.id,
      age: myDonor?.age,
      bloodGroup: myDonor?.bloodGroup,
      area: myDonor?.area,
      lastDonationDate: myDonor?.lastDonationDate,
      regNumber: myAmbulance?.regNumber,
      locationName: myAmbulance?.locationName,
    };
  }, [profile, myDonor, myAmbulance]);

  // ---------------- Profile saving ----------------
  const saveMyDonorProfile = async (updates: Partial<BloodDonor>) => {
    if (!profile) throw new Error('আগে লগইন করুন।');
    const row = await db.upsertMyDonor({
      user_id: profile.id,
      name: updates.name ?? myDonor?.name ?? profile.name,
      phone: updates.phone ?? myDonor?.phone ?? profile.phone,
      blood_group: updates.bloodGroup ?? myDonor?.bloodGroup ?? 'O+',
      age: updates.age ?? myDonor?.age ?? null,
      division: updates.division ?? myDonor?.division ?? null,
      district: updates.district ?? myDonor?.district ?? null,
      area: updates.area ?? myDonor?.area ?? null,
      lat: updates.lat ?? myDonor?.lat ?? userLocation.lat,
      lng: updates.lng ?? myDonor?.lng ?? userLocation.lng,
      available: updates.available ?? myDonor?.available ?? true,
      last_donation_date: (updates.lastDonationDate ?? myDonor?.lastDonationDate) || null,
    });
    const d = donorFromRow(row);
    setMyDonor(d);
    setDonorRows(prev => [d, ...prev.filter(x => x.id !== d.id)]);
    showToast('✅ রক্তদাতার প্রোফাইল সেভ হয়েছে');
  };

  const saveMyAmbulanceProfile = async (updates: Partial<Ambulance>) => {
    if (!profile) throw new Error('আগে লগইন করুন।');
    const row = await db.upsertMyAmbulance({
      user_id: profile.id,
      provider_name: updates.providerName ?? myAmbulance?.providerName ?? profile.name,
      driver_name: updates.driverName ?? myAmbulance?.driverName ?? profile.name,
      phone: updates.phone ?? myAmbulance?.phone ?? profile.phone,
      vehicle_type: updates.vehicleType ?? myAmbulance?.vehicleType ?? 'AC Ambulance',
      reg_number: updates.regNumber ?? myAmbulance?.regNumber ?? '',
      location_name: updates.locationName ?? myAmbulance?.locationName ?? null,
      lat: updates.lat ?? myAmbulance?.lat ?? userLocation.lat,
      lng: updates.lng ?? myAmbulance?.lng ?? userLocation.lng,
      status: (updates.status && updates.status !== 'unknown' ? updates.status : myAmbulance?.status !== 'unknown' ? myAmbulance?.status : undefined) || 'available',
    });
    const a = ambulanceFromRow(row);
    setMyAmbulance(a);
    setRegisteredAmbulances(prev => [a, ...prev.filter(x => x.id !== a.id)]);
    showToast(a.verified ? '✅ অ্যাম্বুলেন্সের তথ্য আপডেট হয়েছে' : '✅ সেভ হয়েছে — অ্যাডমিন যাচাই করার পর পাবলিক তালিকায় দেখাবে');
  };

  // ---------------- Admin ----------------
  const updateHospitalStatus = async (hospitalId: string, facilities: Partial<HospitalFacilityStatus>, phone?: string) => {
    const merged = { ...(hospitalStatus[hospitalId]?.facilities || {}), ...facilities } as Record<string, string>;
    await db.upsertHospitalStatus({
      hospital_id: hospitalId,
      facilities: merged,
      phone: phone !== undefined ? phone || null : hospitalStatus[hospitalId]?.phone ?? null,
    });
    setHospitalStatus(prev => ({
      ...prev,
      [hospitalId]: {
        hospital_id: hospitalId,
        facilities: merged,
        bed_stock: null,
        phone: phone !== undefined ? phone || null : prev[hospitalId]?.phone ?? null,
        updated_at: new Date().toISOString(),
      },
    }));
    showToast('✅ হাসপাতালের স্ট্যাটাস আপডেট হয়েছে');
  };

  const verifyEntity = async (type: 'donor' | 'ambulance', id: string, verified: boolean = true) => {
    await db.setVerified(type === 'donor' ? 'donors' : 'ambulances', id, verified);
    if (type === 'donor') setDonorRows(prev => prev.map(d => (d.id === id ? { ...d, verified } : d)));
    else setRegisteredAmbulances(prev => prev.map(a => (a.id === id ? { ...a, verified } : a)));
    showToast(verified ? '✅ যাচাই করা হয়েছে' : 'যাচাই বাতিল করা হয়েছে');
  };

  const refreshEmergencyRequests = useCallback(async () => {
    if (!isBackendConfigured || !profile) return;
    const rows = await db.listEmergencies();
    setEmergencyRequests(rows.map(emergencyFromRow));
  }, [profile]);

  useEffect(() => {
    if (profile?.role === 'admin') refreshEmergencyRequests().catch(err => console.warn(err));
  }, [profile, refreshEmergencyRequests]);

  const updateEmergencyStatus = async (id: string, status: EmergencyRequest['status']) => {
    const dbStatus = status === 'searching' ? 'open' : status === 'contacted' ? 'contacted' : 'resolved';
    await db.updateEmergencyStatus(id, dbStatus);
    setEmergencyRequests(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  };

  useEffect(() => {
    try {
      localStorage.setItem('jibonjatra_user_location', JSON.stringify(userLocation));
    } catch {
      // ignore
    }
  }, [userLocation]);

  // GPS bookkeeping refs (no re-render needed)
  const manualAreaRef = useRef<boolean>(false); // user picked an area → don't let GPS ticks override it
  const lastFixRef = useRef<{ lat: number; lng: number; accuracy: number } | null>(null);
  const lastGeocodedRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastSyncRef = useRef<{ lat: number; lng: number } | null>(null);

  /**
   * Helper to apply new coordinates immediately (so distance calculations update with 0ms delay)
   * while resolving the human-readable address asynchronously.
   */
  const applyLocation = (lat: number, lng: number, isLive: boolean, initialAddress?: string) => {
    // Reverse geocoding hits Nominatim (rate-limited) — only redo it after moving ~150 m
    const lastGeo = lastGeocodedRef.current;
    const needsGeocode = !initialAddress && (!lastGeo || calculateDistanceKm(lastGeo.lat, lastGeo.lng, lat, lng) >= 0.15);

    setUserLocation(prev => ({
      lat,
      lng,
      address:
        initialAddress ||
        (needsGeocode && isLive ? `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : prev.address),
      isLive,
    }));

    if (!needsGeocode) return;
    lastGeocodedRef.current = { lat, lng };

    reverseGeocode(lat, lng).then(addr => {
      setUserLocation(prev => {
        if (calculateDistanceKm(prev.lat, prev.lng, lat, lng) < 0.15) {
          return { ...prev, address: addr };
        }
        return prev;
      });
    });
  };

  /**
   * Robust multi-tier geolocation request that succeeds on both Android and iOS devices.
   */
  const requestGeolocation = async (silent: boolean = false): Promise<boolean> => {
    try {
      const result = await getGeolocationWithFallbacks();
      manualAreaRef.current = false; // user asked for live GPS → resume live tracking
      lastGeocodedRef.current = null;
      lastFixRef.current = { lat: result.lat, lng: result.lng, accuracy: result.accuracy ?? 9999 };
      applyLocation(result.lat, result.lng, true);

      if (!silent) {
        showToast('📍 লাইভ GPS লোকেশন সফলভাবে আপডেট হয়েছে');
      }
      return true;
    } catch (err: unknown) {
      console.warn('Geolocation request failed:', err);
      const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
      const errMsg = (err as Error)?.message;

      if (!silent) {
        if (errMsg === 'INSECURE_ORIGIN') {
          showToast('⚠️ মোবাইল ব্রাউজারে GPS কাজ করতে HTTPS আবশ্যক। অনুগ্রহ করে আপনার এলাকা নির্বাচন করুন।');
          setIsLocationModalOpen(true);
        } else if (errMsg === 'PERMISSION_DENIED') {
          showToast(
            isAndroid
              ? '⚠️ ক্রোম ব্রাউজারে লোকেশন পারমিশন ব্লক করা। সাইট সেটিংসে Location Allow করুন অথবা এলাকা বেছে নিন।'
              : '⚠️ লোকেশন পারমিশন বন্ধ আছে। ব্রাউজার সেটিংসে Location চালু করুন।'
          );
        } else if (errMsg === 'POSITION_UNAVAILABLE') {
          showToast('⚠️ ফোনের GPS বন্ধ আছে। নোটিফিকেশন বার নামিয়ে Location চালু করুন অথবা এলাকা সিলেক্ট করুন।');
        } else if (errMsg === 'TIMEOUT') {
          showToast('⚠️ দুর্বল জিপিএস সিগন্যাল। অনুগ্রহ করে তালিকা থেকে আপনার এলাকা বেছে নিন।');
          setIsLocationModalOpen(true);
        } else {
          showToast('⚠️ লাইভ GPS পাওয়া যায়নি। ফোনের GPS চালু করুন অথবা নিচে এলাকা নির্বাচন করুন।');
        }
      }
      return false;
    }
  };

  // Automatically detect user GPS location on startup with passive refinement
  useEffect(() => {
    let watchId: number | null = null;

    let cancelled = false;

    requestGeolocation(true).then(() => {
      // Keep refining even if the first attempt timed out (Android GPS often needs 10-30 s
      // for a satellite fix). Only skip when the browser can't do geolocation at all.
      if (cancelled || typeof navigator === 'undefined' || !navigator.geolocation) return;
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            if (manualAreaRef.current) return; // respect a manually selected area

            const { latitude, longitude, accuracy } = pos.coords;
            const last = lastFixRef.current;
            if (accuracy > 250 && last && last.accuracy <= 250) return; // ignore coarse jumps

            const movedKm = last ? calculateDistanceKm(last.lat, last.lng, latitude, longitude) : Infinity;
            const muchMoreAccurate = !last || accuracy < last.accuracy * 0.7;

            // Only update state when the user actually moved (>25 m) or the fix got clearly better.
            // Prevents re-rendering 1,300+ items and re-drawing the map on every GPS tick.
            if (movedKm >= 0.025 || muchMoreAccurate) {
              lastFixRef.current = { lat: latitude, lng: longitude, accuracy };
              applyLocation(latitude, longitude, true);
            }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 }
        );
      } catch (e) {
        console.warn('WatchPosition initialization error:', e);
      }
    });

    return () => {
      cancelled = true;
      if (watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const syncLiveNearbyHospitals = async (lat?: number, lng?: number) => {
    const targetLat = lat ?? userLocation.lat;
    const targetLng = lng ?? userLocation.lng;
    setIsLiveMapSyncing(true);
    try {
      const liveNearby = await fetchLiveNearbyHospitals(targetLat, targetLng);
      if (liveNearby && liveNearby.length > 0) {
        setLiveHospitals(liveNearby);
        setLiveHospitalsCount(liveNearby.length);
      }
    } catch (err) {
      console.warn('Live map sync error:', err);
    } finally {
      setIsLiveMapSyncing(false);
    }
  };

  // Auto discover real nearby map facilities — only after moving ~1 km (network call)
  useEffect(() => {
    const lastSync = lastSyncRef.current;
    if (!lastSync || calculateDistanceKm(lastSync.lat, lastSync.lng, userLocation.lat, userLocation.lng) >= 1) {
      lastSyncRef.current = { lat: userLocation.lat, lng: userLocation.lng };
      syncLiveNearbyHospitals(userLocation.lat, userLocation.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.lat, userLocation.lng]);

  const setUserCustomLocation = (lat: number, lng: number, address: string) => {
    manualAreaRef.current = true;
    lastGeocodedRef.current = { lat, lng };
    setUserLocation({ lat, lng, address, isLive: false });
    showToast(`📍 এলাকা সেট করা হয়েছে: ${address}`);
  };

  // ---------------- Derived lists (distance is computed, not stored) ----------------
  const hospitals = useMemo(() => {
    const merged = liveHospitals.length ? mergeWithLiveHospitals(baseHospitals, liveHospitals) : baseHospitals;
    return merged.map(h => {
      const st = hospitalStatus[h.id];
      return {
        ...h,
        facilities: st ? { ...UNKNOWN_FACILITIES, ...(st.facilities as Partial<HospitalFacilityStatus>) } : h.facilities || UNKNOWN_FACILITIES,
        emergencyHotline: st?.phone || h.emergencyHotline,
        statusUpdatedAt: st?.updated_at,
        distanceKm:
          h.locationPrecision === 'city' || h.locationPrecision === 'district'
            ? UNKNOWN_DISTANCE_KM
            : calculateDistanceKm(userLocation.lat, userLocation.lng, h.lat, h.lng),
      };
    });
  }, [baseHospitals, liveHospitals, hospitalStatus, userLocation.lat, userLocation.lng]);

  const donors = useMemo(
    () =>
      // Registered donors (own accounts) first, then the imported public donor list
      [...donorRows, ...listedDonors].map(d => ({
        ...d,
        distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, d.lat, d.lng),
      })),
    [donorRows, listedDonors, userLocation.lat, userLocation.lng]
  );

  const ambulances = useMemo(() => {
    // Registered + verified services first (they have live status), then public listings
    const visibleRegistered = registeredAmbulances.filter(a => a.verified);
    return [...visibleRegistered, ...listedAmbulances].map(a => {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      // Rough Dhaka traffic estimate: ~2.5 min per km + 2 min preparation
      return { ...a, distanceKm: dist, etaMinutes: Math.max(3, Math.round(dist * 2.5 + 2)) };
    });
  }, [registeredAmbulances, listedAmbulances, userLocation.lat, userLocation.lng]);

  /**
   * Directly focus a hospital on the interactive map and switch view mode.
   */
  const navigateToHospitalMap = (hospital: Hospital) => {
    setFocusedHospital(hospital);
    setHospitalsViewMode('map');
    setActiveTab('hospitals');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Emergency help: suggests the nearest relevant resource for the user to CALL.
   * Nothing is "dispatched" automatically — the request is logged so admins can follow up.
   */
  const requestEmergencyAssistance = (
    type: 'ambulance' | 'blood' | 'hospital' | 'icu',
    details?: Partial<EmergencyRequest>
  ): EmergencyRequest => {
    let assignedName = 'National Emergency Service';
    let assignedPhone = '999';
    let eta: number | undefined;

    if (type === 'ambulance') {
      const nearestAmb = [...ambulances]
        .filter(a => a.status === 'available' || a.status === 'unknown')
        .sort((a, b) => a.distanceKm - b.distanceKm)[0];
      if (nearestAmb) {
        assignedName = nearestAmb.providerName;
        assignedPhone = nearestAmb.phone;
        eta = nearestAmb.etaMinutes;
      }
    } else if (type === 'hospital' || type === 'icu') {
      const nearestHosp = [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm)[0];
      if (nearestHosp) {
        assignedName = nearestHosp.name;
        assignedPhone = nearestHosp.emergencyHotline || '999';
        eta = Math.round(nearestHosp.distanceKm * 3 + 4);
      }
    } else if (type === 'blood') {
      const matchedDonor = [...donors]
        .filter(d => d.available && (!details?.bloodGroup || d.bloodGroup === details.bloodGroup))
        .sort((a, b) => a.distanceKm - b.distanceKm)[0];
      if (matchedDonor) {
        assignedName = `Donor: ${matchedDonor.name} (${matchedDonor.bloodGroup})`;
        assignedPhone = matchedDonor.phone;
      }
    }

    const newRequest: EmergencyRequest = {
      id: `EMG-${Date.now().toString().slice(-6)}`,
      type,
      patientName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      locationName: userLocation.address,
      lat: userLocation.lat,
      lng: userLocation.lng,
      urgency: 'critical',
      bloodGroup: details?.bloodGroup,
      unitsNeeded: details?.unitsNeeded || 1,
      status: 'searching',
      assignedEntityName: assignedName,
      assignedEntityPhone: assignedPhone,
      etaMinutes: eta,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...details,
    };

    // Log to the backend so admins can follow up (fire-and-forget; never blocks the user)
    if (isBackendConfigured) {
      db.createEmergency({
        type,
        patient_name: newRequest.patientName || null,
        phone: newRequest.phone || null,
        blood_group: newRequest.bloodGroup || null,
        units_needed: newRequest.unitsNeeded ?? null,
        location_name: newRequest.locationName,
        lat: newRequest.lat,
        lng: newRequest.lng,
      }).catch(err => console.warn('Emergency log failed:', err));
    }

    setActiveEmergency(newRequest);
    return newRequest;
  };

  return (
    <AppContext.Provider
      value={{
        hospitals,
        donors,
        ambulances,
        registeredAmbulances,
        emergencyRequests,
        isDataLoading,
        currentUser,
        myDonor,
        myAmbulance,
        backendConfigured: isBackendConfigured,
        authReady,
        userLocation,
        activeTab,
        setActiveTab,
        isEmergencyModeOpen,
        setIsEmergencyModeOpen,
        selectedHospital,
        setSelectedHospital,
        hospitalsViewMode,
        setHospitalsViewMode,
        focusedHospital,
        setFocusedHospital,
        navigateToHospitalMap,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        authModalRole,
        openAuthModal,
        isDonorModalOpen,
        setIsDonorModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        activeEmergency,
        setActiveEmergency,
        requestEmergencyAssistance,
        signIn,
        signUp,
        resetPassword,
        logout,
        saveMyDonorProfile,
        saveMyAmbulanceProfile,
        updateHospitalStatus,
        verifyEntity,
        refreshEmergencyRequests,
        updateEmergencyStatus,
        requestGeolocation,
        setUserCustomLocation,
        isLiveMapSyncing,
        liveHospitalsCount,
        syncLiveNearbyHospitals,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
