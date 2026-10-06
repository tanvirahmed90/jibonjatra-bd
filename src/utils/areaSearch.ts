import { Hospital } from '../types';
import { calculateDistanceKm } from './geo';

export interface AreaLocation {
  id: string;
  name: string;
  banglaName: string;
  lat: number;
  lng: number;
  district: string;
  division: string;
  aliases: string[];
}

export const POPULAR_BANGLADESH_AREAS: AreaLocation[] = [
  {
    id: 'rampura',
    name: 'Rampura',
    banglaName: 'রামপুরা',
    lat: 23.7610,
    lng: 90.4208,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['rampura', 'ram pura', 'রামপুরা', 'east rampura', 'west rampura', 'dit road'],
  },
  {
    id: 'banasree',
    name: 'Banasree',
    banglaName: 'বনশ্রী',
    lat: 23.7635,
    lng: 90.4308,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['banasree', 'bonosree', 'bonoshree', 'বনশ্রী', 'block e banasree'],
  },
  {
    id: 'khilgaon',
    name: 'Khilgaon',
    banglaName: 'খিলগাঁও',
    lat: 23.7512,
    lng: 90.4225,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['khilgaon', 'khilgao', 'খিলগাঁও', 'taltola khilgaon'],
  },
  {
    id: 'malibagh',
    name: 'Malibagh',
    banglaName: 'মালিবাগ',
    lat: 23.7480,
    lng: 90.4140,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['malibagh', 'malibag', 'মালিবাগ', 'mouchak', 'মৌচাক'],
  },
  {
    id: 'moghbazar',
    name: 'Moghbazar',
    banglaName: 'মগবাজার',
    lat: 23.7490,
    lng: 90.4040,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['moghbazar', 'maghbazar', 'মগবাজার', 'eskaton', 'ইসকাটন'],
  },
  {
    id: 'panthapath',
    name: 'Panthapath',
    banglaName: 'পান্থপথ',
    lat: 23.7525,
    lng: 90.3840,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['panthapath', 'panthopoth', 'পান্থপথ', 'green road', 'গ্রীন রোড'],
  },
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    banglaName: 'ধানমন্ডি',
    lat: 23.7461,
    lng: 90.3742,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['dhanmondi', 'dhanmandi', 'ধানমন্ডি', 'zigatola', 'জিগাতলা'],
  },
  {
    id: 'mirpur',
    name: 'Mirpur',
    banglaName: 'মিরপুর',
    lat: 23.8067,
    lng: 90.3683,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur', 'মিরপুর', 'mirpur 10', 'mirpur 1', 'mirpur 2', 'মিরপুর ১০', 'pallabi'],
  },
  {
    id: 'uttara',
    name: 'Uttara',
    banglaName: 'উত্তরা',
    lat: 23.8728,
    lng: 90.3984,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['uttara', 'উত্তরা', 'uttara sector', 'airport', 'বিমানবন্দর'],
  },
  {
    id: 'gulshan',
    name: 'Gulshan',
    banglaName: 'গুলশান',
    lat: 23.7925,
    lng: 90.4078,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['gulshan', 'গুলশান', 'gulshan 1', 'gulshan 2', 'গুলশান ১', 'গুলশান ২'],
  },
  {
    id: 'banani',
    name: 'Banani',
    banglaName: 'বনানী',
    lat: 23.7937,
    lng: 90.4066,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['banani', 'বনানী', 'kemal ataturk'],
  },
  {
    id: 'badda',
    name: 'Badda',
    banglaName: 'বাড্ডা',
    lat: 23.7805,
    lng: 90.4267,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['badda', 'বাড্ডা', 'middle badda', 'north badda', 'pragati sarani'],
  },
  {
    id: 'mohammadpur',
    name: 'Mohammadpur',
    banglaName: 'মোহাম্মদপুর',
    lat: 23.7658,
    lng: 90.3584,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mohammadpur', 'মোহাম্মদপুর', 'shyamoli', 'শ্যামলী', 'adabor'],
  },
  {
    id: 'shahbagh',
    name: 'Shahbagh',
    banglaName: 'শাহবাগ',
    lat: 23.7388,
    lng: 90.3958,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['shahbagh', 'shahbag', 'শাহবাগ', 'ramna', 'রমনা'],
  },
  {
    id: 'motijheel',
    name: 'Motijheel',
    banglaName: 'মতিঝিল',
    lat: 23.7330,
    lng: 90.4172,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['motijheel', 'মতিঝিল', 'dilkusha', 'paltan', 'পল্টন'],
  },
  {
    id: 'old dhaka',
    name: 'Old Dhaka / Sadarghat',
    banglaName: 'পুরান ঢাকা',
    lat: 23.7145,
    lng: 90.4011,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['old dhaka', 'puran dhaka', 'পুরান ঢাকা', 'sadarghat', 'babubazar', 'lalbagh'],
  },
  {
    id: 'chattogram',
    name: 'Chattogram City',
    banglaName: 'চট্টগ্রাম',
    lat: 22.3569,
    lng: 91.7832,
    district: 'Chattogram',
    division: 'Chattogram',
    aliases: ['chattogram', 'chittagong', 'চট্টগ্রাম', 'ctg'],
  },
  {
    id: 'sylhet',
    name: 'Sylhet City',
    banglaName: 'সিলেট',
    lat: 24.8949,
    lng: 91.8687,
    district: 'Sylhet',
    division: 'Sylhet',
    aliases: ['sylhet', 'সিলেট'],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi City',
    banglaName: 'রাজশাহী',
    lat: 24.3636,
    lng: 88.6241,
    district: 'Rajshahi',
    division: 'Rajshahi',
    aliases: ['rajshahi', 'রাজশাহী'],
  },
  {
    id: 'khulna',
    name: 'Khulna City',
    banglaName: 'খুলনা',
    lat: 22.8456,
    lng: 89.5403,
    district: 'Khulna',
    division: 'Khulna',
    aliases: ['khulna', 'খুলনা'],
  },
];

/**
 * Matches a query string to a known geographic area
 */
export function findMatchingArea(rawQuery: string): AreaLocation | null {
  const q = rawQuery.trim().toLowerCase();
  if (!q || q.length < 2) return null;

  for (const area of POPULAR_BANGLADESH_AREAS) {
    if (area.name.toLowerCase() === q || area.banglaName === q) {
      return area;
    }
    for (const alias of area.aliases) {
      if (q.includes(alias.toLowerCase()) || alias.toLowerCase().includes(q)) {
        return area;
      }
    }
  }
  return null;
}

export interface SearchResult {
  hospitals: Hospital[];
  detectedArea: AreaLocation | null;
  matchType: 'direct' | 'area_proximity' | 'all';
}

/**
 * Comprehensive intelligent hospital search:
 * 1. Matches hospital name, bangla name, address, upazila, district, code, notes, area tags.
 * 2. If the user searches an area (e.g. Rampura, Banasree, Mirpur):
 *    - Finds hospitals located in that area
 *    - Also includes nearest surrounding hospitals ranked by distance to that area
 * 3. Gracefully handles bilingual English & Bangla queries
 */
export function filterAndRankHospitals(
  hospitals: Hospital[],
  query: string,
  userLat?: number,
  userLng?: number
): SearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      hospitals: [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm),
      detectedArea: null,
      matchType: 'all',
    };
  }

  const q = trimmed.toLowerCase();
  const detectedArea = findMatchingArea(q);

  // 1. Direct text matches
  const directMatches = hospitals.filter((h) => {
    const nameMatch = h.name.toLowerCase().includes(q);
    const banglaMatch = Boolean(h.banglaName && h.banglaName.includes(trimmed));
    const addressMatch = h.address.toLowerCase().includes(q);
    const upazilaMatch = h.upazila.toLowerCase().includes(q);
    const districtMatch = h.district.toLowerCase().includes(q);
    const codeMatch = h.code.includes(q);
    const notesMatch = Boolean(h.notes && h.notes.toLowerCase().includes(q));
    const tagsMatch = Boolean(
      h.areaTags &&
        h.areaTags.some(
          (t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())
        )
    );

    return (
      nameMatch ||
      banglaMatch ||
      addressMatch ||
      upazilaMatch ||
      districtMatch ||
      codeMatch ||
      notesMatch ||
      tagsMatch
    );
  });

  // 2. If a specific area was recognized (e.g. Rampura)
  if (detectedArea) {
    // If we have direct matches inside this area, prioritize them
    const areaDirectIds = new Set(directMatches.map((h) => h.id));

    // Find nearby hospitals within 7km of the detected area center
    const nearbyToArea = hospitals
      .map((h) => ({
        hospital: h,
        distanceToArea: calculateDistanceKm(
          detectedArea.lat,
          detectedArea.lng,
          h.lat,
          h.lng
        ),
      }))
      .filter(
        ({ hospital, distanceToArea }) =>
          areaDirectIds.has(hospital.id) || distanceToArea <= 7.5
      )
      .sort((a, b) => {
        // Direct matches first, then sorted by distance to the searched area
        const aIsDirect = areaDirectIds.has(a.hospital.id);
        const bIsDirect = areaDirectIds.has(b.hospital.id);
        if (aIsDirect && !bIsDirect) return -1;
        if (!aIsDirect && bIsDirect) return 1;
        return a.distanceToArea - b.distanceToArea;
      })
      .map(({ hospital }) => hospital);

    if (nearbyToArea.length > 0) {
      return {
        hospitals: nearbyToArea,
        detectedArea,
        matchType: 'area_proximity',
      };
    }
  }

  // 3. Fallback to direct matches sorted by distance
  const sortedDirect = [...directMatches].sort(
    (a, b) => a.distanceKm - b.distanceKm
  );

  return {
    hospitals: sortedDirect,
    detectedArea: null,
    matchType: 'direct',
  };
}
