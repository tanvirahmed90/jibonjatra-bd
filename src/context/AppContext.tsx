import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hospital, BloodDonor, Ambulance, EmergencyRequest, User, UserRole } from '../types';
import { INITIAL_HOSPITALS, INITIAL_BLOOD_DONORS, INITIAL_AMBULANCES, INITIAL_USERS } from '../data/mockData';
import { calculateDistanceKm } from '../utils/geo';

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
  currentUser: User;
  userLocation: UserLocation;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEmergencyModeOpen: boolean;
  setIsEmergencyModeOpen: (open: boolean) => void;
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDonorModalOpen: boolean;
  setIsDonorModalOpen: (open: boolean) => void;
  activeEmergency: EmergencyRequest | null;
  setActiveEmergency: (req: EmergencyRequest | null) => void;
  requestEmergencyAssistance: (type: 'ambulance' | 'blood' | 'hospital' | 'icu', details?: Partial<EmergencyRequest>) => EmergencyRequest;
  updateHospitalFacility: (id: string, updates: Partial<Hospital>) => void;
  updateAmbulanceStatus: (id: string, status: 'available' | 'busy' | 'offline', etaMinutes?: number) => void;
  registerDonor: (donor: Omit<BloodDonor, 'id' | 'distanceKm' | 'verified'>) => void;
  switchUserRole: (role: UserRole) => void;
  requestGeolocation: () => Promise<void>;
  setUserCustomLocation: (lat: number, lng: number, address: string) => void;
  verifyEntity: (type: 'hospital' | 'donor' | 'ambulance', id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_LOCATION: UserLocation = {
  lat: 23.7500, // Central Dhaka (Dhanmondi / Panthapath area)
  lng: 90.3850,
  address: 'Panthapath, Dhaka (Default Location)',
  isLive: false,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load or initialize state with localStorage backup
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('jibonjatra_hospitals_v3');
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
    const saved = localStorage.getItem('jibonjatra_donors') || localStorage.getItem('medirescue_donors');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_DONORS;
  });

  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => {
    const saved = localStorage.getItem('jibonjatra_ambulances') || localStorage.getItem('medirescue_ambulances');
    return saved ? JSON.parse(saved) : INITIAL_AMBULANCES;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem('jibonjatra_emergency_requests') || localStorage.getItem('medirescue_emergency_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('jibonjatra_current_user') || localStorage.getItem('medirescue_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Ariful Hassan (patient)
  });

  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isEmergencyModeOpen, setIsEmergencyModeOpen] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState<boolean>(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('jibonjatra_hospitals_v3', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_ambulances', JSON.stringify(ambulances));
  }, [ambulances]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_emergency_requests', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  useEffect(() => {
    localStorage.setItem('jibonjatra_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Recalculate distances whenever user location changes
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
  }, [userLocation]);

  const requestGeolocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
            isLive: true,
          });
          resolve();
        },
        (err) => {
          console.warn('Geolocation access denied or failed, staying on current setting.', err);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    });
  };

  const setUserCustomLocation = (lat: number, lng: number, address: string) => {
    setUserLocation({
      lat,
      lng,
      address,
      isLive: false,
    });
  };

  const switchUserRole = (role: UserRole) => {
    const found = INITIAL_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
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
      patientName: currentUser.name || 'Emergency Patient',
      phone: currentUser.phone || '+880 1711 000000',
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDonorModalOpen,
        setIsDonorModalOpen,
        activeEmergency,
        setActiveEmergency,
        requestEmergencyAssistance,
        updateHospitalFacility,
        updateAmbulanceStatus,
        registerDonor,
        switchUserRole,
        requestGeolocation,
        setUserCustomLocation,
        verifyEntity,
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
