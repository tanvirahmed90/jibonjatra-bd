import { Hospital, BloodDonor, Ambulance, User } from '../types';

export const BANGLADESH_EMERGENCY_HOTLINES = [
  { number: '999', title: 'National Emergency Service', desc: 'Police, Fire Service, Govt Ambulance Dispatch', color: 'bg-red-600', icon: 'AlertTriangle' },
  { number: '16263', title: 'Shastho Batayan (স্বাস্থ্য বাতায়ন)', desc: '24/7 National Health Advice Hotline', color: 'bg-blue-600', icon: 'PhoneCall' },
  { number: '333', title: 'National Help Desk', desc: 'Government Services & Emergency Relief', color: 'bg-emerald-600', icon: 'Shield' },
  { number: '10655', title: 'IEDCR Epidemic Helpline', desc: 'Institute of Epidemiology, Disease Control & Research', color: 'bg-purple-600', icon: 'Activity' },
];

import { COMPREHENSIVE_BANGLADESH_HOSPITALS } from './allHospitalsData';
import { COMPREHENSIVE_BLOOD_DONORS } from './allBloodDonorsData';

export const INITIAL_HOSPITALS: Hospital[] = COMPREHENSIVE_BANGLADESH_HOSPITALS;

export const INITIAL_BLOOD_DONORS: BloodDonor[] = COMPREHENSIVE_BLOOD_DONORS;


export const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: 'amb-105-rampura',
    providerName: 'Rampura Emergency Fast Dispatch #105',
    driverName: 'Alamgir Hossain',
    phone: '+880 1712 884422',
    vehicleType: 'ICU Ambulance',
    regNumber: 'Dhaka Metro Cha-72-9104',
    lat: 23.7610,
    lng: 90.4205,
    distanceKm: 3.5,
    etaMinutes: 5,
    status: 'available',
    hospitalAffiliation: 'Better Life Hospital Standby',
    fareEstimate: '৳ 2,000 - 3,000 (Full ICU & Paramedic)',
    features: ['Ventilator', 'Cardiac Monitor', 'Portable Oxygen', 'Emergency Stretcher'],
    lastUpdated: 'Just now'
  },
  {
    id: 'amb-101',
    providerName: 'Red Crescent Emergency Dispatch #101',
    driverName: 'Rafiqul Alam',
    phone: '+880 1711 991122',
    vehicleType: 'ICU Ambulance',
    regNumber: 'Dhaka Metro Cha-71-4201',
    lat: 23.7485,
    lng: 90.3840,
    distanceKm: 1.1,
    etaMinutes: 4,
    status: 'available',
    hospitalAffiliation: 'Square Hospital / Red Crescent',
    fareEstimate: '৳ 2,500 - 3,500 (Full ICU Setup)',
    features: ['Ventilator', 'Cardiac Monitor', 'Suction Machine', 'Paramedic on Board', 'Central Oxygen'],
    lastUpdated: '1 min ago'
  },
  {
    id: 'amb-102',
    providerName: 'Alif Ambulance Service #102',
    driverName: 'Mohammad Shafi',
    phone: '+880 1822 883344',
    vehicleType: 'AC Ambulance',
    regNumber: 'Dhaka Metro Cha-53-8821',
    lat: 23.7380,
    lng: 90.3965,
    distanceKm: 1.5,
    etaMinutes: 6,
    status: 'available',
    hospitalAffiliation: 'DMCH Standby',
    fareEstimate: '৳ 1,200 - 1,800',
    features: ['Oxygen Cylinder', 'First Aid Kit', 'Wheelchair Ramp', 'Air Conditioned'],
    lastUpdated: 'Just now'
  },
  {
    id: 'amb-103',
    providerName: 'Lifeline Critical Express #103',
    driverName: 'Shahidul Islam',
    phone: '+880 1933 774455',
    vehicleType: 'ICU Ambulance',
    regNumber: 'Dhaka Metro Cha-62-1109',
    lat: 23.7600,
    lng: 90.3750,
    distanceKm: 2.8,
    etaMinutes: 9,
    status: 'available',
    hospitalAffiliation: 'BSMMU & Suhrawardy Corridor',
    fareEstimate: '৳ 3,000 - 4,000 (Ventilator Support)',
    features: ['Portable Ventilator', 'Defibrillator', 'Infusion Pump', 'Specialist Nurse'],
    lastUpdated: '3 mins ago'
  },
  {
    id: 'amb-104',
    providerName: 'Anjuman Mofidul Islam #104',
    driverName: 'Abdur Rahim',
    phone: '+880 1644 665566',
    vehicleType: 'Freezing Ambulance',
    regNumber: 'Dhaka Metro Cha-44-9090',
    lat: 23.7320,
    lng: 90.4100,
    distanceKm: 3.5,
    etaMinutes: 12,
    status: 'available',
    hospitalAffiliation: 'Central Dhaka',
    fareEstimate: '৳ 2,000 - 3,000',
    features: ['Sub-zero Cooling Chamber', 'Inter-district Transport Safe'],
    lastUpdated: '7 mins ago'
  },
  {
    id: 'amb-105',
    providerName: 'Apex Care Emergency #105',
    driverName: 'Belal Hossain',
    phone: '+880 1755 556677',
    vehicleType: 'Non-AC Ambulance',
    regNumber: 'Dhaka Metro Cha-33-2198',
    lat: 23.7710,
    lng: 90.3680,
    distanceKm: 4.2,
    etaMinutes: 14,
    status: 'busy',
    hospitalAffiliation: 'NICVD Transit',
    fareEstimate: '৳ 800 - 1,200 (Budget Friendly)',
    features: ['Oxygen Support', 'Stretcher Bed'],
    lastUpdated: '10 mins ago'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-donor',
    name: 'Tanvir Ahmed',
    email: 'tanvir.donor@gmail.com',
    phone: '+880 1712 345678',
    role: 'donor',
    donorId: 'donor-1',
    age: 26,
    bloodGroup: 'O+',
    area: 'Dhanmondi, Dhaka',
    lastDonationDate: '2026-04-12',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-ambulance',
    name: 'Rafiqul Alam',
    email: 'rafiqul.amb@redcrescent.org.bd',
    phone: '+880 1711 991122',
    role: 'ambulance',
    ambulanceId: 'amb-101',
    regNumber: 'Dhaka Metro-Cha-11-2024',
    locationName: 'Panthapath Standby Point, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-admin',
    name: 'Central Operations Director (DGHS)',
    email: 'admin@jibonjatra.bd',
    phone: '+880 2 55165000',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];

export const BANGLADESH_DIVISIONS = [
  'All Divisions',
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Sylhet',
  'Barishal',
  'Rangpur',
  'Mymensingh'
];

export const DHAKA_AREAS = [
  'All Areas',
  'Shahbagh / Ramna',
  'Dhanmondi',
  'Panthapath / Green Road',
  'Gulshan / Banani',
  'Mirpur',
  'Uttara',
  'Mohakhali',
  'Old Dhaka / Lalbagh',
  'Sher-e-Bangla Nagar',
  'Bashundhara R/A',
  'Savar'
];
