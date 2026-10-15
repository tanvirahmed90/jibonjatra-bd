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

/**
 * Common Bangladesh Emergency Areas for instant 1-tap selection and manual overrides.
 */
export const POPULAR_BANGLADESH_AREAS = [
  { name: 'Panthapath / Central Dhaka', lat: 23.7500, lng: 90.3850, division: 'Dhaka' },
  { name: 'Dhanmondi, Dhaka', lat: 23.7465, lng: 90.3760, division: 'Dhaka' },
  { name: 'Mirpur (1-14), Dhaka', lat: 23.8041, lng: 90.3665, division: 'Dhaka' },
  { name: 'Uttara, Dhaka', lat: 23.8759, lng: 90.3795, division: 'Dhaka' },
  { name: 'Gulshan / Banani, Dhaka', lat: 23.7925, lng: 90.4078, division: 'Dhaka' },
  { name: 'Mohammadpur, Dhaka', lat: 23.7662, lng: 90.3588, division: 'Dhaka' },
  { name: 'Badda / Rampura, Dhaka', lat: 23.7684, lng: 90.4255, division: 'Dhaka' },
  { name: 'Motijheel / Paltan, Dhaka', lat: 23.7330, lng: 90.4172, division: 'Dhaka' },
  { name: 'Old Dhaka / Sadarghat', lat: 23.7104, lng: 90.4074, division: 'Dhaka' },
  { name: 'Agrabad / Panchlaish, Chittagong', lat: 22.3569, lng: 91.7832, division: 'Chittagong' },
  { name: 'Zindabazar, Sylhet', lat: 24.8949, lng: 91.8687, division: 'Sylhet' },
  { name: 'Shaheb Bazar, Rajshahi', lat: 24.3636, lng: 88.6241, division: 'Rajshahi' },
  { name: 'Shibbari, Khulna', lat: 22.8456, lng: 89.5403, division: 'Khulna' },
  { name: 'Sadar Road, Barisal', lat: 22.7010, lng: 90.3535, division: 'Barisal' },
  { name: 'Medical Mor, Rangpur', lat: 25.7439, lng: 89.2752, division: 'Rangpur' },
];

/**
 * Android & Mobile-optimized multi-tier location retrieval.
 * On Android mobile devices:
 * 1. Fast network/cell-tower positioning is attempted first (enableHighAccuracy: false).
 *    Google Play Services returns this in <500ms using Wi-Fi / cell triangulation.
 * 2. High accuracy GPS (enableHighAccuracy: true) is attempted next with 10s timeout.
 * 
 * Note: We explicitly DO NOT use IP-based geolocation in Bangladesh, because local ISPs
 * route all cellular and broadband traffic through central Old Dhaka / Tanti Bazar gateways,
 * which falsely assigns users across Bangladesh to Sadarghat/Tanti Bazar.
 */
export async function getGeolocationWithFallbacks(): Promise<GeolocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  // TIER 1: Fast network / cell-tower / Wi-Fi positioning
  // This responds almost instantaneously on Android devices
  const tryNetworkPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000, // accept cached location up to 5 minutes
      });
    });
  };

  // TIER 2: High accuracy satellite GPS
  const tryHighAccuracyPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    });
  };

  try {
    const pos = await tryNetworkPosition();
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      source: 'network',
    };
  } catch (netErr: unknown) {
    const geoErr = netErr as GeolocationPositionError;
    if (geoErr && geoErr.code === 1) {
      throw new Error('PERMISSION_DENIED');
    }

    try {
      const pos = await tryHighAccuracyPosition();
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        source: 'gps',
      };
    } catch (gpsErr: unknown) {
      const gpsGeoErr = gpsErr as GeolocationPositionError;
      if (gpsGeoErr && gpsGeoErr.code === 1) {
        throw new Error('PERMISSION_DENIED');
      }
      throw new Error('POSITION_UNAVAILABLE');
    }
  }
}
