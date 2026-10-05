export interface DivisionDistribution {
  division: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TypeDistribution {
  type: string;
  banglaName?: string;
  count: number;
  percentage: number;
  icon: string;
  color: string;
}

export const TOTAL_FACILITIES_COUNT = 39437;

export const DIVISION_WISE_DISTRIBUTION: DivisionDistribution[] = [
  { division: 'Dhaka', count: 9984, percentage: 25.3, color: 'bg-red-600' },
  { division: 'Chattogram', count: 7483, percentage: 19.0, color: 'bg-blue-600' },
  { division: 'Rajshahi', count: 5225, percentage: 13.3, color: 'bg-emerald-600' },
  { division: 'Khulna', count: 4821, percentage: 12.2, color: 'bg-amber-600' },
  { division: 'Rangpur', count: 4025, percentage: 10.2, color: 'bg-purple-600' },
  { division: 'Barishal', count: 2883, percentage: 7.3, color: 'bg-cyan-600' },
  { division: 'Mymensingh', count: 2791, percentage: 7.1, color: 'bg-indigo-600' },
  { division: 'Sylhet', count: 2225, percentage: 5.6, color: 'bg-rose-600' },
];

export const TYPE_WISE_DISTRIBUTION: TypeDistribution[] = [
  {
    type: 'Community Clinic (CC)',
    banglaName: 'কমিউনিটি ক্লিনিক',
    count: 14392,
    percentage: 36.5,
    icon: '🏥',
    color: 'bg-emerald-600',
  },
  {
    type: 'Consultancy & Diagnostic Center',
    banglaName: 'কনসালটেন্সি ও ডায়াগনস্টিক সেন্টার',
    count: 9492,
    percentage: 24.1,
    icon: '🔬',
    color: 'bg-blue-600',
  },
  {
    type: 'Private Hospital & Clinic',
    banglaName: 'বেসরকারি হাসপাতাল ও ক্লিনিক',
    count: 5926,
    percentage: 15.0,
    icon: '🏨',
    color: 'bg-purple-600',
  },
  {
    type: 'Union Health & Family Welfare Centre (UH&FWC)',
    banglaName: 'ইউনিয়ন স্বাস্থ্য ও পরিবার কল্যাণ কেন্দ্র',
    count: 3845,
    percentage: 9.7,
    icon: '🩺',
    color: 'bg-teal-600',
  },
  {
    type: 'NGO Health Facility',
    banglaName: 'এনজিও স্বাস্থ্য প্রতিষ্ঠান',
    count: 1840,
    percentage: 4.7,
    icon: '🤝',
    color: 'bg-amber-600',
  },
  {
    type: 'Union Sub-Center (USC) / Rural Dispensary (RD)',
    banglaName: 'ইউনিয়ন উপ-স্বাস্থ্য কেন্দ্র ও ডিসপেনসারি',
    count: 1364,
    percentage: 3.5,
    icon: '💊',
    color: 'bg-indigo-600',
  },
  {
    type: 'Upazila Health Complex (UHC)',
    banglaName: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
    count: 492,
    percentage: 1.2,
    icon: '🚑',
    color: 'bg-red-600',
  },
  {
    type: 'Govt. Medical College & Specialized Institute',
    banglaName: 'সরকারি মেডিকেল কলেজ ও বিশেষায়িত ইনস্টিটিউট',
    count: 110,
    percentage: 0.3,
    icon: '🎓',
    color: 'bg-rose-700',
  },
  {
    type: 'District Sadar & General Hospital',
    banglaName: 'জেলা সদর ও জেনারেল হাসপাতাল',
    count: 64,
    percentage: 0.2,
    icon: '🏛️',
    color: 'bg-cyan-700',
  },
  {
    type: 'Other Specialized & Primary Centers',
    banglaName: 'অন্যান্য বিশেষায়িত ও প্রাথমিক স্বাস্থ্য কেন্দ্র',
    count: 1912,
    percentage: 4.8,
    icon: '📍',
    color: 'bg-slate-600',
  },
];
