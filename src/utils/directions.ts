/**
 * Google Maps directions helpers.
 *
 * Why no `origin` parameter?
 *   Earlier links passed `origin=<userLocation>`. But `userLocation` is often NOT where
 *   the phone really is: it can be a selected area chip (e.g. "Banasree" centre), the
 *   default fallback location, or a stale/coarse network fix. Google Maps then drew the
 *   route from that wrong point. When `origin` is omitted, Google Maps (web + Android app)
 *   uses the device's own live GPS as the starting point — exactly what a patient needs.
 *
 * Why a text destination for registry hospitals?
 *   Coordinates in the static registry are approximate (area-level), so a raw lat,lng pin
 *   can land on a neighbouring street or a different building. Searching by
 *   "Hospital name, Area, District, Bangladesh" lets Google snap to the real hospital
 *   listing. Facilities discovered live from OpenStreetMap ("live-osm-*") carry exact
 *   coordinates, so for those we keep the precise pin.
 */

export interface DirectionsTarget {
  id?: string;
  name?: string;
  lat?: number;
  lng?: number;
  upazila?: string;
  district?: string;
  address?: string;
}

const hasCoords = (t: DirectionsTarget) =>
  typeof t.lat === 'number' &&
  typeof t.lng === 'number' &&
  Number.isFinite(t.lat) &&
  Number.isFinite(t.lng) &&
  !(t.lat === 0 && t.lng === 0);

/** "Farazy Hospital Ltd. (Banasree / Rampura)" -> "Farazy Hospital Ltd." */
const cleanName = (name: string) => name.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

export function buildDestinationQuery(target: DirectionsTarget): string {
  const parts: string[] = [];
  if (target.name) parts.push(cleanName(target.name));

  const area = (target.upazila || '').trim();
  const district = (target.district || '').trim();
  if (area && area.toLowerCase() !== district.toLowerCase()) parts.push(area);
  if (district) parts.push(district);

  // Fall back to the street address if we have no area info at all
  if (parts.length <= 1 && target.address) parts.push(target.address);

  parts.push('Bangladesh');
  return parts.join(', ');
}

export function getDirectionsUrl(target: DirectionsTarget): string {
  const preferExactPin = !!target.id && target.id.startsWith('live-osm-');

  let destination: string;
  if (preferExactPin && hasCoords(target)) {
    destination = `${target.lat},${target.lng}`;
  } else if (target.name) {
    destination = buildDestinationQuery(target);
  } else if (hasCoords(target)) {
    destination = `${target.lat},${target.lng}`;
  } else {
    destination = 'hospital near me';
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}
