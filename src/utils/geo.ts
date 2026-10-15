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
  source: 'gps' | 'network' | 'ip' | 'cached';
  errorMessage?: string;
  isFallback?: boolean;
}

/**
 * IP-based location fallback for situations where browser geolocation fails,
 * permissions are denied, or when running over insecure HTTP on Android Chrome.
 */
export async function fetchIpLocation(): Promise<GeolocationResult | null> {
  // Service 1: ipwho.is (fast, no key required, good BD coverage)
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return {
          lat: data.latitude,
          lng: data.longitude,
          source: 'ip',
          isFallback: true,
        };
      }
    }
  } catch {
    // try secondary IP service
  }

  // Service 2: freeipapi.com
  try {
    const res = await fetch('https://freeipapi.com/api/json', {
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return {
          lat: data.latitude,
          lng: data.longitude,
          source: 'ip',
          isFallback: true,
        };
      }
    }
  } catch {
    // silent failure
  }

  return null;
}

/**
 * Android-optimized multi-tier location retrieval.
 * On Android, enableHighAccuracy: true often fails or times out indoors because
 * satellite acquisition takes >15s. This function tries high-accuracy first with
 * reasonable timeout, and immediately falls back to network/Wi-Fi positioning (enableHighAccuracy: false)
 * which succeeds in <1s on Android Google Play Services.
 */
export async function getGeolocationWithFallbacks(): Promise<GeolocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    const ipRes = await fetchIpLocation();
    if (ipRes) return ipRes;
    throw new Error('Geolocation is not supported by your browser.');
  }

  // Check for insecure context on mobile browsers (Android Chrome strictly blocks GPS on HTTP)
  const isSecure = typeof window !== 'undefined'
    ? (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    : true;

  if (!isSecure) {
    console.warn('Insecure origin detected on mobile. Browser GPS will be blocked. Falling back to IP location.');
    const ipRes = await fetchIpLocation();
    if (ipRes) {
      ipRes.errorMessage = 'Android Chrome requires HTTPS for live device GPS. IP-based location is used.';
      return ipRes;
    }
  }

  // TIER 1: High accuracy GPS attempt (with cache acceptance up to 3 minutes)
  const tryHighAccuracy = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 180000,
      });
    });
  };

  // TIER 2: Fast network/Wi-Fi positioning (enableHighAccuracy: false, cache up to 10 minutes)
  // This is the key fix for Android devices where GPS satellite lock is slow or unavailable indoors.
  const tryNetworkAccuracy = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      });
    });
  };

  try {
    const pos = await tryHighAccuracy();
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      source: 'gps',
    };
  } catch (err: unknown) {
    const geoError = err as GeolocationPositionError;
    console.warn('High accuracy GPS failed or timed out, trying network positioning fallback...', geoError);

    // If permission was denied by user, high accuracy or low accuracy both fail
    if (geoError && geoError.code === 1) {
      const ipRes = await fetchIpLocation();
      if (ipRes) {
        ipRes.errorMessage = 'Location permission is denied in browser settings. IP location used.';
        return ipRes;
      }
      throw new Error('PERMISSION_DENIED');
    }

    // Try Tier 2: Network / Wi-Fi based location
    try {
      const pos2 = await tryNetworkAccuracy();
      return {
        lat: pos2.coords.latitude,
        lng: pos2.coords.longitude,
        accuracy: pos2.coords.accuracy,
        source: 'network',
      };
    } catch (err2: unknown) {
      console.warn('Network location also failed, attempting IP location fallback...', err2);
      const ipRes = await fetchIpLocation();
      if (ipRes) {
        ipRes.errorMessage = 'Device GPS unavailable. Approximate network IP location used.';
        return ipRes;
      }
      throw err2;
    }
  }
}
