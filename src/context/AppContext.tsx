import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hospital, BloodDonor, Ambulance, EmergencyRequest, User, UserRole } from '../types';
import { INITIAL_HOSPITALS, INITIAL_BLOOD_DONORS, INITIAL_AMBULANCES, INITIAL_USERS } from '../data/mockData';
import { calculateDistanceKm, getGeolocationWithFallbacks } from '../utils/geo';
import { fetchLiveNearbyHospitals, mergeWithLiveHospitals } from '../utils/liveMapService';


interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  isLive: boolean;
}

interface AppContextType {
  hospitals: Hospital[];
  donors: BloodDonor[];
  ambulances: Ambulance[];
  emergencyRequests: EmergencyRequest[];
  currentUser: User | null;
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
  isDonorModalOpen: boolean;
  setIsDonorModalOpen: (open: boolean) => void;
  activeEmergency: EmergencyRequest | null;
  setActiveEmergency: (req: EmergencyRequest | null) => void;
  requestEmergencyAssistance: (type: 'ambulance' | 'blood' | 'hospital' | 'icu', details?: Partial<EmergencyRequest>) => EmergencyRequest;
  updateHospitalFacility: (id: string, updates: Partial<Hospital>) => void;
  updateAmbulanceStatus: (id: string, status: 'available' | 'busy' | 'offline', etaMinutes?: number) => void;
  updateDonorProfile: (donorId: string, updates: Partial<BloodDonor>) => void;
  updateAmbulanceProfile: (ambulanceId: string, updates: Partial<Ambulance>) => void;
  registerDonor: (donor: Omit<BloodDonor, 'id' | 'distanceKm' | 'verified'>) => void;
  registerUserAccount: (userData: User, profileData?: { donor?: Partial<BloodDonor>; ambulance?: Partial<Ambulance> }) => void;
  switchUserRole: (role: UserRole, autoNavigate?: boolean) => void;
  requestGeolocation: (silent?: boolean) => Promise<boolean>;
  setUserCustomLocation: (lat: number, lng: number, address: string) => void;
  verifyEntity: (type: 'hospital' | 'donor' | 'ambulance', id: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLiveMapSyncing: boolean;
  liveHospitalsCount: number;
  syncLiveNearbyHospitals: (lat?: number, lng?: number) => Promise<void>;
  logout: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_LOCATION: UserLocation = {
  lat: 23.7500, // Central Dhaka (Dhanmondi / Panthapath area)
  lng: 90.3850,
  address: 'Panthapath, Dhaka (Default Location)',
  isLive: false,
};

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
  // Load or initialize state with localStorage backup (v8 includes full DGHS + real map hospitals)
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('jibonjatra_hospitals_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_HOSPITALS.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HOSPITALS;
  });

  const [donors, setDonors] = useState<BloodDonor[]>(() => {
    const saved = localStorage.getItem('jibonjatra_donors_v10');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_BLOOD_DONORS.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BLOOD_DONORS;
  });

  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => {
    const saved = localStorage.getItem('jibonjatra_ambulances_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_AMBULANCES.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AMBULANCES;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem('jibonjatra_emergency_requests') || localStorage.getItem('medirescue_emergency_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jibonjatra_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.role) {
          return parsed;
        }
      } catch (e) {
        console.error('Error reading stored user:', e);
      }
    }
    return null;
  });

  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('jibonjatra_user_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return parsed;
        }
      } catch (e) {
        console.error('Error reading stored location:', e);
      }
    }
    return DEFAULT_LOCATION;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [hospitalsViewMode, setHospitalsViewMode] = useState<'grid' | 'map'>('grid');
  const [focusedHospital, setFocusedHospital] = useState<Hospital | null>(null);
  const [isEmergencyModeOpen, setIsEmergencyModeOpen] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveMapSyncing, setIsLiveMapSyncing] = useState<boolean>(false);
  const [liveHospitalsCount, setLiveHospitalsCount] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('jibonjatra_hospitals_v8', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_donors_v10', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_ambulances_v8', JSON.stringify(ambulances));
  }, [ambulances]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_emergency_requests', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jibonjatra_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jibonjatra_current_user');
      localStorage.removeItem('medirescue_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_user_location', JSON.stringify(userLocation));
  }, [userLocation]);

  /**
   * Helper to apply new coordinates immediately (so distance calculations update with 0ms delay)
   * while resolving the human-readable address asynchronously.
   */
  const applyLocation = (lat: number, lng: number, isLive: boolean, initialAddress?: string) => {
    setUserLocation(prev => ({
      lat,
      lng,
      address: initialAddress || (isLive ? `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : prev.address),
      isLive,
    }));

    reverseGeocode(lat, lng).then(addr => {
      setUserLocation(prev => {
        if (Math.abs(prev.lat - lat) < 0.0001 && Math.abs(prev.lng - lng) < 0.0001) {
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

    requestGeolocation(true).then((success) => {
      if (typeof navigator !== 'undefined' && navigator.geolocation && success) {
        try {
          watchId = navigator.geolocation.watchPosition(
            (pos) => {
              if (pos.coords.accuracy <= 100) {
                applyLocation(pos.coords.latitude, pos.coords.longitude, true);
              }
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 30000, timeout: 25000 }
          );
        } catch (e) {
          console.warn('WatchPosition initialization error:', e);
        }
      }
    });

    return () => {
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
        setHospitals(prev => mergeWithLiveHospitals(prev, liveNearby));
        setLiveHospitalsCount(liveNearby.length);
      }
    } catch (err) {
      console.warn('Live map sync error:', err);
    } finally {
      setIsLiveMapSyncing(false);
    }
  };

  // Recalculate distances and auto-sync live map hospitals whenever user location changes
  useEffect(() => {
    setHospitals(prev =>
      prev.map(h => ({
        ...h,
        distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, h.lat, h.lng),
      }))
    );

    setDonors(prev =>
      prev.map(d => ({
        ...d,
        distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, d.lat, d.lng),
      }))
    );

    setAmbulances(prev =>
      prev.map(a => {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
        // Estimate approx 2.5 mins per km in Dhaka traffic + 2 mins prep
        const estimatedEta = Math.max(3, Math.round(dist * 2.5 + 2));
        return {
          ...a,
          distanceKm: dist,
          etaMinutes: a.status === 'available' ? estimatedEta : a.etaMinutes,
        };
      })
    );

    // Auto discover real nearby map facilities
    syncLiveNearbyHospitals(userLocation.lat, userLocation.lng);
  }, [userLocation.lat, userLocation.lng]);

  const setUserCustomLocation = (lat: number, lng: number, address: string) => {
    setUserLocation({
      lat,
      lng,
      address,
      isLive: false,
    });
    showToast(`📍 এলাকা সেট করা হয়েছে: ${address}`);
  };

  /**
   * Directly focus a hospital on the interactive map and switch view mode.
   * This solves: "View Full Map & Options click korle map-e hospital-er real location show korbe"
   */
  const navigateToHospitalMap = (hospital: Hospital) => {
    setFocusedHospital(hospital);
    setHospitalsViewMode('map');
    setActiveTab('hospitals');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchUserRole = (role: UserRole, autoNavigate: boolean = true) => {
    const found = INITIAL_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `user-${Date.now()}`,
        name: `${role.toUpperCase()} User`,
        email: `${role}@jibonjatra.bd`,
        phone: '+880 1711 000000',
        role,
      });
    }

    let targetView = 'ড্যাশবোর্ড';
    if (autoNavigate) {
      if (role === 'ambulance') {
        setActiveTab('dashboard');
        targetView = 'অ্যাম্বুলেন্স ড্রাইভার পোর্টাল';
      } else if (role === 'admin') {
        setActiveTab('admin');
        targetView = 'ডিজিএইচএস সিস্টেম অ্যাডমিন কন্ট্রোল সেন্টার';
      } else if (role === 'donor') {
        setActiveTab('dashboard');
        targetView = 'রক্তদাতা প্রোফাইল ড্যাশবোর্ড';
      } else {
        setActiveTab('home');
        targetView = 'হোম পেজ';
      }
    }

    showToast(`সফলভাবে ${targetView}-এ লগইন হয়েছে`);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jibonjatra_current_user');
    localStorage.removeItem('medirescue_current_user');
    setActiveTab('home');
    showToast('👋 সফলভাবে লগআউট করা হয়েছে');
  };

  const updateDonorProfile = (donorId: string, updates: Partial<BloodDonor>) => {
    setDonors(prev =>
      prev.map(d => {
        if (d.id === donorId) {
          return {
            ...d,
            ...updates,
            lastActive: 'Just now',
          };
        }
        return d;
      })
    );

    // Keep currentUser in sync
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        phone: updates.phone || prev.phone,
        bloodGroup: updates.bloodGroup || prev.bloodGroup,
        age: updates.age ?? prev.age,
        area: updates.area || prev.area,
        lastDonationDate: updates.lastDonationDate || prev.lastDonationDate,
      };
    });

    showToast('✅ রক্তদাতার তথ্য (বয়স, গ্রুপ, ফোন, এলাকা ও শেষ রক্তদান) সফলভাবে আপডেট হয়েছে!');
  };

  const updateAmbulanceProfile = (ambulanceId: string, updates: Partial<Ambulance>) => {
    setAmbulances(prev =>
      prev.map(a => {
        if (a.id === ambulanceId) {
          return {
            ...a,
            ...updates,
            lastUpdated: 'Just now',
          };
        }
        return a;
      })
    );

    // Keep currentUser in sync
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        phone: updates.phone || prev.phone,
        regNumber: updates.regNumber || prev.regNumber,
        locationName: updates.locationName || prev.locationName,
      };
    });

    showToast('✅ অ্যাম্বুলেন্সের গাড়ির নম্বর, ফোন নম্বর ও লোকেশন সফলভাবে আপডেট হয়েছে!');
  };

  const registerUserAccount = (
    userData: User,
    profileData?: { donor?: Partial<BloodDonor>; ambulance?: Partial<Ambulance> }
  ) => {
    if (userData.role === 'donor') {
      const newDonorId = `donor-${Date.now()}`;
      const newDonor: BloodDonor = {
        id: newDonorId,
        name: userData.name,
        age: userData.age || 25,
        bloodGroup: userData.bloodGroup || 'O+',
        phone: userData.phone,
        division: 'Dhaka',
        district: 'Dhaka',
        area: userData.area || 'Dhanmondi, Dhaka',
        lat: userLocation.lat,
        lng: userLocation.lng,
        distanceKm: 0,
        available: true,
        emergencyEligible: true,
        lastActive: 'Just now',
        lastDonationDate: userData.lastDonationDate || new Date().toISOString().split('T')[0],
        donationCount: 1,
        verified: true,
        contactPreference: 'both',
        ...profileData?.donor,
      };
      setDonors(prev => [newDonor, ...prev]);
      const finalUser: User = { ...userData, id: `user-${Date.now()}`, donorId: newDonorId };
      setCurrentUser(finalUser);
      setActiveTab('dashboard');
      showToast(`স্বাগতম ${userData.name}! আপনার রক্তদাতা একাউন্ট তৈরি হয়েছে।`);
    } else if (userData.role === 'ambulance') {
      const newAmbId = `amb-${Date.now()}`;
      const newAmb: Ambulance = {
        id: newAmbId,
        providerName: userData.name + ' Emergency Dispatch',
        driverName: userData.name,
        phone: userData.phone,
        vehicleType: 'AC Ambulance',
        regNumber: userData.regNumber || 'Dhaka Metro-Cha-11-2024',
        locationName: userData.locationName || 'Panthapath Standby Point, Dhaka',
        lat: userLocation.lat,
        lng: userLocation.lng,
        distanceKm: 0,
        etaMinutes: 5,
        status: 'available',
        fareEstimate: 'Standard Rate',
        features: ['Oxygen Support', 'First Aid Kit'],
        lastUpdated: 'Just now',
        ...profileData?.ambulance,
      };
      setAmbulances(prev => [newAmb, ...prev]);
      const finalUser: User = { ...userData, id: `user-${Date.now()}`, ambulanceId: newAmbId };
      setCurrentUser(finalUser);
      setActiveTab('dashboard');
      showToast(`স্বাগতম ${userData.name}! আপনার অ্যাম্বুলেন্স চালক একাউন্ট তৈরি হয়েছে।`);
    } else {
      const finalUser: User = { ...userData, id: `user-${Date.now()}`, role: 'admin' };
      setCurrentUser(finalUser);
      setActiveTab('admin');
      showToast(`স্বাগতম! আপনি সিস্টেম অ্যাডমিন হিসেবে যুক্ত হয়েছেন।`);
    }
  };

  const updateHospitalFacility = (id: string, updates: Partial<Hospital>) => {
    setHospitals(prev =>
      prev.map(h => {
        if (h.id === id) {
          return {
            ...h,
            ...updates,
            lastUpdated: 'Just now (Staff updated)',
          };
        }
        return h;
      })
    );
  };

  const updateAmbulanceStatus = (id: string, status: 'available' | 'busy' | 'offline', etaMinutes?: number) => {
    setAmbulances(prev =>
      prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            status,
            etaMinutes: etaMinutes ?? a.etaMinutes,
            lastUpdated: 'Just now',
          };
        }
        return a;
      })
    );
  };

  const registerDonor = (donorData: Omit<BloodDonor, 'id' | 'distanceKm' | 'verified'>) => {
    const newDonor: BloodDonor = {
      ...donorData,
      id: `donor-${Date.now()}`,
      distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, donorData.lat, donorData.lng),
      verified: false, // Requires admin verification
    };
    setDonors(prev => [newDonor, ...prev]);
  };

  const verifyEntity = (type: 'hospital' | 'donor' | 'ambulance', id: string) => {
    if (type === 'hospital') {
      setHospitals(prev => prev.map(h => h.id === id ? { ...h, verified: true, mohfwVerified: true } : h));
    } else if (type === 'donor') {
      setDonors(prev => prev.map(d => d.id === id ? { ...d, verified: true } : d));
    } else if (type === 'ambulance') {
      // mark verified
      alert(`Ambulance service ${id} verified by System Admin!`);
    }
  };

  const requestEmergencyAssistance = (
    type: 'ambulance' | 'blood' | 'hospital' | 'icu',
    details?: Partial<EmergencyRequest>
  ): EmergencyRequest => {
    // Pick nearest relevant resource
    let assignedName = 'Central Dispatch 999';
    let assignedPhone = '999';
    let eta = 5;

    if (type === 'ambulance') {
      const nearestAmb = [...ambulances]
        .filter(a => a.status === 'available')
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
        assignedPhone = nearestHosp.emergencyHotline;
        eta = Math.round(nearestHosp.distanceKm * 3 + 4);
      }
    } else if (type === 'blood') {
      const matchedDonor = donors.find(d => d.available && (!details?.bloodGroup || d.bloodGroup === details.bloodGroup));
      if (matchedDonor) {
        assignedName = `Donor: ${matchedDonor.name} (${matchedDonor.bloodGroup})`;
        assignedPhone = matchedDonor.phone;
        eta = 15;
      }
    }

    const newRequest: EmergencyRequest = {
      id: `EMG-${Date.now().toString().slice(-6)}`,
      type,
      patientName: currentUser?.name || 'Emergency Patient',
      phone: currentUser?.phone || '+880 1711 000000',
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

    setEmergencyRequests(prev => [newRequest, ...prev]);
    setActiveEmergency(newRequest);
    return newRequest;
  };

  return (
    <AppContext.Provider
      value={{
        hospitals,
        donors,
        ambulances,
        emergencyRequests,
        currentUser,
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
        isDonorModalOpen,
        setIsDonorModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        activeEmergency,
        setActiveEmergency,
        requestEmergencyAssistance,
        updateHospitalFacility,
        updateAmbulanceStatus,
        updateDonorProfile,
        updateAmbulanceProfile,
        registerDonor,
        registerUserAccount,
        switchUserRole,
        logout,
        requestGeolocation,
        setUserCustomLocation,
        verifyEntity,
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
