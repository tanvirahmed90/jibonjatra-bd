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
 * Android & mobile-optimised location retrieval.
 *
 * Problems with the old version on Android Chrome:
 *  - It first accepted ANY cached position up to 5 minutes old with enableHighAccuracy:false.
 *    On Android that is usually a coarse Wi-Fi/cell fix (500 m – 3 km off), so the app
 *    locked onto a wrong area and only replaced it if a later fix was <= 100 m.
 *  - A single getCurrentPosition(highAccuracy) call returns the FIRST fix Android's fused
 *    provider gives, which is often still coarse while the GPS chip is warming up.
 *
 * New strategy: run watchPosition(highAccuracy) for a short window and keep the most
 * accurate fix. Resolve early once accuracy is good (<= 35 m); otherwise resolve with the
 * best fix seen when the window ends. If high accuracy produces nothing at all (indoors,
 * GPS off), fall back to a network position.
 */
export async function getGeolocationWithFallbacks(
  options: { maxWaitMs?: number; goodAccuracyM?: number } = {}
): Promise<GeolocationResult> {
  const maxWaitMs = options.maxWaitMs ?? 10000;
  const goodAccuracyM = options.goodAccuracyM ?? 35;

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('NOT_SUPPORTED');
  }

  // Chrome on Android blocks geolocation completely on insecure origins (http://192.168.x.x)
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      throw new Error('INSECURE_ORIGIN');
    }
  }

  const toResult = (pos: GeolocationPosition, source: GeolocationResult['source']): GeolocationResult => ({
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    source,
  });

  const mapError = (err: GeolocationPositionError | null | undefined): Error => {
    if (err?.code === 1) return new Error('PERMISSION_DENIED');
    if (err?.code === 3) return new Error('TIMEOUT');
    return new Error('POSITION_UNAVAILABLE');
  };

  // Step 1: best high-accuracy fix within the time window
  const bestHighAccuracy = await new Promise<GeolocationResult>((resolve, reject) => {
    let best: GeolocationPosition | null = null;
    let lastError: GeolocationPositionError | null = null;
    let settled = false;
    let watchId: number | null = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      if (best) resolve(toResult(best, best.coords.accuracy <= 100 ? 'gps' : 'network'));
      else reject(lastError ?? { code: 3 });
    };

    const timer = setTimeout(finish, maxWaitMs);

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;
          if (pos.coords.accuracy <= goodAccuracyM) finish();
        },
        (err) => {
          lastError = err;
          // Permission denied will never recover inside this window — stop immediately
          if (err.code === 1) finish();
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: maxWaitMs }
      );
    } catch (e) {
      lastError = e as GeolocationPositionError;
      finish();
    }
  }).catch((err: GeolocationPositionError) => {
    if (err?.code === 1) throw mapError(err);
    return null;
  });

  if (bestHighAccuracy) return bestHighAccuracy;

  // Step 2: network / cell-tower fallback (GPS off or no satellite fix indoors)
  return new Promise<GeolocationResult>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(toResult(pos, 'network')),
      (err) => reject(mapError(err)),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });
}
