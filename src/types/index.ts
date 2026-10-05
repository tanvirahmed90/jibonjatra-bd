export type FacilityStatusType = 'available' | 'limited' | 'unavailable' | 'unknown';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'patient' | 'donor' | 'hospital' | 'ambulance' | 'admin';

export interface HospitalFacilityStatus {
  emergency: FacilityStatusType;
  icu: FacilityStatusType;
  nicu: FacilityStatusType;
  ccu: FacilityStatusType;
  hdu: FacilityStatusType;
  ot: FacilityStatusType; // Operation Theatre
  bloodBank: FacilityStatusType;
  oxygen: FacilityStatusType;
  ventilator: FacilityStatusType;
  pharmacy: FacilityStatusType; // 24/7 Pharmacy
}

export interface Hospital {
  id: string;
  name: string;
  banglaName?: string;
  code: string; // MOHFW Registry Code, e.g. 10001024
  type: 'Govt. Medical College' | 'Specialized Institute' | 'District Hospital' | 'Private Tertiary' | 'Upazila Health Complex';
  division: string;
  district: string;
  upazila: string;
  address: string;
  phone: string;
  emergencyHotline: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  image: string;
  bedCount: number;
  facilities: HospitalFacilityStatus;
  bedStock?: {
    icuAvailable: number;
    icuTotal: number;
    nicuAvailable: number;
    nicuTotal: number;
    emergencyAvailable: number;
    generalAvailable: number;
  };
  lastUpdated: string; // e.g. "5 mins ago"
  verified: boolean;
  mohfwVerified: boolean;
  notes?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  division: string;
  district: string;
  area: string;
  lat: number;
  lng: number;
  distanceKm: number;
  available: boolean;
  emergencyEligible: boolean;
  lastActive: string;
  lastDonationDate: string;
  donationCount: number;
  verified: boolean;
  contactPreference: 'call' | 'sms' | 'both';
}

export interface Ambulance {
  id: string;
  providerName: string;
  driverName: string;
  phone: string;
  vehicleType: 'ICU Ambulance' | 'AC Ambulance' | 'Non-AC Ambulance' | 'Freezing Ambulance';
  regNumber: string;
  lat: number;
  lng: number;
  distanceKm: number;
  etaMinutes: number;
  status: 'available' | 'busy' | 'offline';
  hospitalAffiliation?: string;
  fareEstimate: string;
  features: string[];
  lastUpdated: string;
}

export interface EmergencyRequest {
  id: string;
  type: 'ambulance' | 'blood' | 'hospital' | 'icu';
  patientName: string;
  phone: string;
  locationName: string;
  lat: number;
  lng: number;
  urgency: 'critical' | 'high' | 'moderate';
  bloodGroup?: BloodGroup;
  unitsNeeded?: number;
  status: 'searching' | 'contacted' | 'dispatched' | 'arrived' | 'resolved';
  assignedEntityName?: string;
  assignedEntityPhone?: string;
  etaMinutes?: number;
  createdAt: string;
  hospitalTargetId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  facilityId?: string;
  ambulanceId?: string;
  donorId?: string;
}
