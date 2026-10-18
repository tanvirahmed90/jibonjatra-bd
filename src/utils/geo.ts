/**
 * Haversine formula to compute distance in km between two coordinate points
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracy?: number;
  source: 'gps' | 'network' | 'cached';
  errorMessage?: string;
  isFallback?: boolean;
}

export interface BangladeshArea {
  name: string;
  nameBn?: string;
  lat: number;
  lng: number;
  division: string;
  isPopular?: boolean;
}

/**
 * Common Bangladesh Emergency Areas for instant 1-tap selection and manual overrides.
 */
export const POPULAR_BANGLADESH_AREAS: BangladeshArea[] = [
  // Dhaka Metro
  { name: 'Panthapath / Central Dhaka', nameBn: 'পান্থপথ / সেন্ট্রাল ঢাকা', lat: 23.7500, lng: 90.3850, division: 'Dhaka', isPopular: true },
  { name: 'Dhanmondi, Dhaka', nameBn: 'ধানমন্ডি', lat: 23.7465, lng: 90.3760, division: 'Dhaka', isPopular: true },
  { name: 'Mirpur (1-14), Dhaka', nameBn: 'মিরপুর (১-১৪)', lat: 23.8041, lng: 90.3665, division: 'Dhaka', isPopular: true },
  { name: 'Uttara, Dhaka', nameBn: 'উত্তরা', lat: 23.8759, lng: 90.3795, division: 'Dhaka', isPopular: true },
  { name: 'Gulshan / Banani, Dhaka', nameBn: 'গুলশান / বনানী', lat: 23.7925, lng: 90.4078, division: 'Dhaka', isPopular: true },
  { name: 'Mohammadpur, Dhaka', nameBn: 'মোহাম্মদপুর', lat: 23.7662, lng: 90.3588, division: 'Dhaka', isPopular: true },
  { name: 'Badda / Rampura, Dhaka', nameBn: 'বাড্ডা / রামপুরা', lat: 23.7684, lng: 90.4255, division: 'Dhaka', isPopular: true },
  { name: 'Motijheel / Paltan, Dhaka', nameBn: 'মতিঝিল / পল্টন', lat: 23.7330, lng: 90.4172, division: 'Dhaka', isPopular: true },
  { name: 'Old Dhaka / Sadarghat', nameBn: 'পুরান ঢাকা / সদরঘাট', lat: 23.7104, lng: 90.4074, division: 'Dhaka', isPopular: true },
  { name: 'Jatrabari / Sayedabad', nameBn: 'যাত্রাবাড়ী / সায়েদাবাদ', lat: 23.7104, lng: 90.4348, division: 'Dhaka', isPopular: true },
  { name: 'Gazipur Chowrasta', nameBn: 'গাজীপুর চৌরাস্তা', lat: 23.9999, lng: 90.4203, division: 'Dhaka', isPopular: true },
  { name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর', lat: 23.6238, lng: 90.5000, division: 'Dhaka', isPopular: true },
  { name: 'Savar / Ashulia', nameBn: 'সাভার / আশুলিয়া', lat: 23.8583, lng: 90.2667, division: 'Dhaka' },

  // Divisions & Major Cities
  { name: 'Agrabad / Panchlaish, Chittagong', nameBn: 'চট্টগ্রাম (আগ্রাবাদ/পাঁচলাইশ)', lat: 22.3569, lng: 91.7832, division: 'Chittagong', isPopular: true },
  { name: 'Zindabazar / Ambarkhana, Sylhet', nameBn: 'সিলেট (জিন্দাবাজার)', lat: 24.8949, lng: 91.8687, division: 'Sylhet', isPopular: true },
  { name: 'Shaheb Bazar, Rajshahi', nameBn: 'রাজশাহী (সাহেব বাজার)', lat: 24.3636, lng: 88.6241, division: 'Rajshahi', isPopular: true },
  { name: 'Shibbari / Boyra, Khulna', nameBn: 'খুলনা (শিববাড়ি)', lat: 22.8456, lng: 89.5403, division: 'Khulna', isPopular: true },
  { name: 'Sadar Road, Barisal', nameBn: 'বরিশাল (সদর রোড)', lat: 22.7010, lng: 90.3535, division: 'Barisal', isPopular: true },
  { name: 'Medical Mor, Rangpur', nameBn: 'রংপুর (মেডিকেল মোড়)', lat: 25.7439, lng: 89.2752, division: 'Rangpur', isPopular: true },
  { name: 'Town Hall, Mymensingh', nameBn: 'ময়মনসিংহ (টাউন হল)', lat: 24.7471, lng: 90.4203, division: 'Mymensingh', isPopular: true },
  { name: 'Kandirpar, Cumilla', nameBn: 'কুমিল্লা (কান্দিরপাড়)', lat: 23.4607, lng: 91.1809, division: 'Chittagong', isPopular: true },
  { name: 'Satmatha, Bogura', nameBn: 'বগুড়া (সাতমাথা)', lat: 24.8465, lng: 89.3730, division: 'Rajshahi', isPopular: true },
  { name: 'Kolatoli, Cox\'s Bazar', nameBn: 'কক্সবাজার (কলাতলী)', lat: 21.4272, lng: 91.9701, division: 'Chittagong' },
];

/**
 * Android & Mobile-optimized multi-tier location retrieval.
 * 1. Checks window.isSecureContext (prevents silent failure on HTTP mobile testing).
 * 2. Checks cached position first (responds in <100ms if Android Google Play Services already has a location).
 * 3. Tries high accuracy GPS with sufficient 12s timeout for mobile satellite fix.
 * 4. Falls back to low-accuracy network/cell positioning if GPS satellite fix is unavailable indoors.
 */
export async function getGeolocationWithFallbacks(): Promise<GeolocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('NOT_SUPPORTED');
  }

  // Check Secure Context: Chrome on Android blocks navigator.geolocation completely on insecure origins (HTTP IP address)
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      throw new Error('INSECURE_ORIGIN');
    }
  }

  // TIER 1: Check fast cached position (up to 5 mins old)
  const getCachedPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 2500,
        maximumAge: 300000,
      });
    });
  };

  // TIER 2: High accuracy GPS (Fused Location Provider on Android)
  const getHighAccuracyPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      });
    });
  };

  // TIER 3: Low-power Network/Cell Tower Fallback
  const getLowAccuracyPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: Infinity,
      });
    });
  };

  // Try cached first for instantaneous load
  try {
    const cached = await getCachedPosition();
    return {
      lat: cached.coords.latitude,
      lng: cached.coords.longitude,
      accuracy: cached.coords.accuracy,
      source: 'cached',
    };
  } catch {
    // No recent cache, proceed to live satellite/fused positioning
  }

  // Try high accuracy live GPS
  try {
    const pos = await getHighAccuracyPosition();
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      source: 'gps',
    };
  } catch (err: unknown) {
    const geoErr = err as GeolocationPositionError;
    // If user explicitly denied, don't bother trying network
    if (geoErr && geoErr.code === 1) {
      throw new Error('PERMISSION_DENIED');
    }

    // High accuracy timed out or unavailable indoors; try network fallback
    try {
      const lowPos = await getLowAccuracyPosition();
      return {
        lat: lowPos.coords.latitude,
        lng: lowPos.coords.longitude,
        accuracy: lowPos.coords.accuracy,
        source: 'network',
      };
    } catch (lowErr: unknown) {
      const finalErr = lowErr as GeolocationPositionError;
      if (finalErr && finalErr.code === 1) {
        throw new Error('PERMISSION_DENIED');
      }
      if (finalErr && finalErr.code === 2) {
        throw new Error('POSITION_UNAVAILABLE');
      }
      if (finalErr && finalErr.code === 3) {
        throw new Error('TIMEOUT');
      }
      throw new Error('POSITION_UNAVAILABLE');
    }
  }
}
