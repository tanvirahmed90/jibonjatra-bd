import { Hospital, BloodDonor, Ambulance, User } from '../types';

export const BANGLADESH_EMERGENCY_HOTLINES = [
  { number: '999', title: 'National Emergency Service', desc: 'Police, Fire Service, Govt Ambulance Dispatch', color: 'bg-red-600', icon: 'AlertTriangle' },
  { number: '16263', title: 'Shastho Batayan (স্বাস্থ্য বাতায়ন)', desc: '24/7 National Health Advice Hotline', color: 'bg-blue-600', icon: 'PhoneCall' },
  { number: '333', title: 'National Help Desk', desc: 'Government Services & Emergency Relief', color: 'bg-emerald-600', icon: 'Shield' },
  { number: '10655', title: 'IEDCR Epidemic Helpline', desc: 'Institute of Epidemiology, Disease Control & Research', color: 'bg-purple-600', icon: 'Activity' },
];

import { COMPREHENSIVE_BANGLADESH_HOSPITALS } from './allHospitalsData';
import { COMPREHENSIVE_BLOOD_DONORS } from './allBloodDonorsData';
import { COMPREHENSIVE_AMBULANCES } from './allAmbulancesData';

export const INITIAL_HOSPITALS: Hospital[] = COMPREHENSIVE_BANGLADESH_HOSPITALS;

export const INITIAL_BLOOD_DONORS: BloodDonor[] = COMPREHENSIVE_BLOOD_DONORS;

export const INITIAL_AMBULANCES: Ambulance[] = COMPREHENSIVE_AMBULANCES;

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
    ambulanceId: 'amb-real-1',
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
