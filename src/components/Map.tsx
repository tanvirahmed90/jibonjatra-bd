import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import '@maplibre/maplibre-gl-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '../context/AppContext';
import { Hospital, BloodDonor, Ambulance } from '../types';
import { Navigation, Layers, ShieldCheck, Phone, ExternalLink } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface MapProps {
  centerOnHospital?: Hospital | null;
  height?: string;
}

export const Map: React.FC<MapProps> = ({ centerOnHospital, height = 'h-[460px] md:h-[540px]' }) => {
  const { hospitals, donors, ambulances, userLocation, setSelectedHospital } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter toggles
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showDonors, setShowDonors] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Leaflet Map with OpenFreeMap Liberty style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
      });

      // Free map API: OpenFreeMap Liberty style (no API key required)
      try {
        L.maplibreGL({
          style: 'https://tiles.openfreemap.org/styles/liberty',
        }).addTo(map);
      } catch (err) {
        console.warn('MapLibre GL failed, falling back to OSM raster tiles:', err);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
      }

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Smooth flyTo whenever userLocation changes (GPS or selected area)
  useEffect(() => {
    if (mapInstanceRef.current && userLocation.lat && userLocation.lng) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13.5, {
        duration: 1.2,
      });
    }
  }, [userLocation.lat, userLocation.lng]);

  // Update map center if hospital is specifically selected
  useEffect(() => {
    if (mapInstanceRef.current && centerOnHospital) {
      mapInstanceRef.current.flyTo([centerOnHospital.lat, centerOnHospital.lng], 15, {
        duration: 1.2,
      });
    }
  }, [centerOnHospital]);

  // Render Markers & Nearby Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. User Location Marker + 5km Nearby Radius Circle
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; background: rgba(37, 99, 235, 0.25); border-radius: 50%; animation: pulse-ring 2s infinite;"></div>
          <div style="width: 14px; height: 14px; background: #2563EB; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
      .bindPopup(`
        <div style="font-family: system-ui; padding: 6px; min-width: 190px;">
          <div style="font-weight: 800; color: #1D4ED8; font-size: 13px; display: flex; items-center; gap: 4px;">
            <span>📍 Your Location</span>
            ${userLocation.isLive ? '<span style="background: #DCFCE7; color: #15803D; font-size: 9px; padding: 1px 5px; border-radius: 999px; font-weight: 700;">LIVE GPS</span>' : ''}
          </div>
          <div style="font-size: 11px; color: #334155; margin-top: 4px; font-weight: 500;">${userLocation.address}</div>
          <div style="font-size: 10px; color: #64748B; margin-top: 3px;">Showing nearby hospitals within immediate radius.</div>
        </div>
      `);
    layer.addLayer(userMarker);

    // 5 km Nearby emergency zone visual circle
    const nearbyCircle = L.circle([userLocation.lat, userLocation.lng], {
      radius: 5000,
      color: '#2563EB',
      fillColor: '#3B82F6',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '4, 6',
    }).bindTooltip('📍 5 km Emergency Coverage Zone', { direction: 'top', sticky: true });
    layer.addLayer(nearbyCircle);

    // 2. Hospitals Markers (Red Emergency Cross)
    if (showHospitals) {
      hospitals.forEach(hosp => {
        const isNearby = hosp.distanceKm <= 5;
        const hospIcon = L.divIcon({
          className: 'custom-hosp-marker',
          html: `
            <div style="position: relative;">
              <div style="background: ${isNearby ? '#DC2626' : '#EF4444'}; color: white; width: ${isNearby ? '34px' : '30px'}; height: ${isNearby ? '34px' : '30px'}; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: ${isNearby ? '18px' : '16px'}; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); cursor: pointer; transition: transform 0.2s;">
                ✚
              </div>
              ${isNearby ? '<span style="position: absolute; -top: 6px; -right: 6px; background: #16A34A; color: white; font-size: 8px; font-weight: 800; padding: 1px 4px; border-radius: 999px; border: 1.5px solid white;">NEAR</span>' : ''}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17],
        });

        const popupContent = `
          <div style="min-width: 230px; font-family: system-ui; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; background: #FEE2E2; color: #991B1B; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                ${hosp.type}
              </span>
              <span style="font-size: 11px; color: ${isNearby ? '#15803D' : '#475569'}; font-weight: 800;">
                ${isNearby ? '🟢 ' : ''}${formatDistance(hosp.distanceKm)}
              </span>
            </div>
            <h4 style="margin: 4px 0 2px; font-size: 14px; font-weight: 800; color: #0F172A; line-height: 1.2;">${hosp.name}</h4>
            ${hosp.banglaName ? `<div style="font-size: 11px; color: #64748B; margin-bottom: 3px;">${hosp.banglaName}</div>` : ''}
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">📍 ${hosp.address}</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #E2E8F0;">
              <div>Emergency: <strong>${hosp.facilities.emergency === 'available' ? '🟢 24/7' : '🟡 Limited'}</strong></div>
              <div>ICU: <strong>${hosp.facilities.icu === 'available' ? '🟢 Available' : hosp.facilities.icu === 'limited' ? '🟡 Limited' : '🔴 Full'}</strong></div>
            </div>

            <div style="display: flex; gap: 6px;">
              <a href="tel:${hosp.emergencyHotline}" style="flex: 1; background: #DC2626; color: white; text-align: center; padding: 7px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
                📞 Call Hotline
              </a>
              <a href="https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hosp.lat},${hosp.lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #1E293B; color: white; text-align: center; padding: 7px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
                🗺️ Directions
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon })
          .bindPopup(popupContent);
        
        layer.addLayer(marker);
      });
    }

    // 3. Ambulances Markers (Yellow/Orange vehicle beacon)
    if (showAmbulances) {
      ambulances.forEach(amb => {
        const ambIcon = L.divIcon({
          className: 'custom-amb-marker',
          html: `
            <div style="background: ${amb.status === 'available' ? '#16A34A' : '#EA580C'}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;">
              🚑
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const popupContent = `
          <div style="min-width: 190px; font-family: system-ui; padding: 4px;">
            <div style="font-size: 10px; color: ${amb.status === 'available' ? '#15803D' : '#B45309'}; font-weight: bold;">
              ${amb.status === 'available' ? '🟢 Available' : '🟡 Busy'} • ETA: ${amb.etaMinutes}m
            </div>
            <h4 style="margin: 4px 0 2px; font-size: 13px; font-weight: bold;">${amb.providerName}</h4>
            <div style="font-size: 11px; color: #64748B;">${amb.vehicleType} • ${formatDistance(amb.distanceKm)}</div>
            <a href="tel:${amb.phone}" style="display: block; margin-top: 6px; background: #DC2626; color: white; text-align: center; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              📞 Call Ambulance (${amb.phone})
            </a>
          </div>
        `;

        const marker = L.marker([amb.lat, amb.lng], { icon: ambIcon })
          .bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }

    // 4. Blood Donors Markers (Red Droplet)
    if (showDonors) {
      donors.filter(d => d.available).forEach(donor => {
        const donorIcon = L.divIcon({
          className: 'custom-donor-marker',
          html: `
            <div style="background: #E11D48; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.25); cursor: pointer;">
              ${donor.bloodGroup}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13],
        });

        const popupContent = `
          <div style="min-width: 180px; font-family: system-ui; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="background: #FFE4E6; color: #BE123C; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 800;">
                ${donor.bloodGroup}
              </span>
              <span style="font-size: 11px; font-weight: bold; color: #1E293B;">${donor.name}</span>
            </div>
            <div style="font-size: 11px; color: #64748B; margin: 4px 0;">${donor.area} • ${formatDistance(donor.distanceKm)}</div>
            <a href="tel:${donor.phone}" style="display: block; background: #16A34A; color: white; text-align: center; padding: 5px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              📞 Call Donor
            </a>
          </div>
        `;

        const marker = L.marker([donor.lat, donor.lng], { icon: donorIcon })
          .bindPopup(popupContent);
        layer.addLayer(marker);
      });
    }
  }, [hospitals, donors, ambulances, userLocation, showHospitals, showAmbulances, showDonors]);

  const { requestGeolocation, setUserCustomLocation } = useApp();

  const handleMyLocationClick = async () => {
    setIsLocating(true);
    try {
      await requestGeolocation();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1 });
      }
    } finally {
      setIsLocating(false);
    }
  };

  const nearbyHospitalsCount = hospitals.filter(h => h.distanceKm <= 5).length;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-card-soft bg-slate-100">
      {/* Top Map Bar: Layer Controls & Quick Areas */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Toggles */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-3 text-xs flex-wrap max-w-full">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Layers:</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-red-700">
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Hospitals ({hospitals.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
            <input
              type="checkbox"
              checked={showAmbulances}
              onChange={(e) => setShowAmbulances(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Ambulances ({ambulances.filter(a => a.status === 'available').length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-rose-700">
            <input
              type="checkbox"
              checked={showDonors}
              onChange={(e) => setShowDonors(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Donors ({donors.filter(d => d.available).length})
            </span>
          </label>
        </div>

        {/* Nearby hospitals counter indicator badge */}
        <div className="pointer-events-auto bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-700 flex items-center gap-2 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{nearbyHospitalsCount} hospitals within 5 km</span>
        </div>
      </div>

      {/* Bottom Area Switcher & Location Button */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
        {/* Quick Area Location Selector */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 text-xs">
          <span className="text-[11px] font-bold text-slate-500 px-1">Quick Area:</span>
          {[
            { name: 'Rampura', lat: 23.7610, lng: 90.4208, label: 'Rampura (রামপুরা)' },
            { name: 'Banasree', lat: 23.7635, lng: 90.4308, label: 'Banasree' },
            { name: 'Panthapath', lat: 23.7525, lng: 90.3840, label: 'Panthapath' },
            { name: 'Dhanmondi', lat: 23.7461, lng: 90.3742, label: 'Dhanmondi' },
            { name: 'Mirpur', lat: 23.8067, lng: 90.3683, label: 'Mirpur' },
            { name: 'Uttara', lat: 23.8728, lng: 90.3984, label: 'Uttara' },
          ].map((area) => (
            <button
              key={area.name}
              type="button"
              onClick={() => setUserCustomLocation(area.lat, area.lng, `${area.name}, Dhaka`)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold text-[11px] transition-all"
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Live GPS Recenter Button */}
        <button
          type="button"
          onClick={handleMyLocationClick}
          disabled={isLocating}
          className="pointer-events-auto ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 text-xs font-bold"
          title="Detect my current location with GPS"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : 'My Live Location'}</span>
        </button>
      </div>

      {/* Actual Leaflet Container with OpenFreeMap */}
      <div ref={mapContainerRef} className={`w-full ${height} z-0`} />
    </div>
  );
};
