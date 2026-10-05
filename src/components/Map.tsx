import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
      });

      // CartoDB Positron / OSM tiles for crisp, clean healthcare look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup handled gracefully
    };
  }, []);

  // Update map center if hospital is specifically selected
  useEffect(() => {
    if (mapInstanceRef.current && centerOnHospital) {
      mapInstanceRef.current.flyTo([centerOnHospital.lat, centerOnHospital.lng], 15, {
        duration: 1.2,
      });
    }
  }, [centerOnHospital]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. User Location Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="position: absolute; width: 24px; height: 24px; background: rgba(25, 118, 210, 0.3); border-radius: 50%; animation: pulse-ring 2s infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #1976D2; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <div style="font-weight: bold; color: #1976D2; font-size: 13px;">📍 Your Detected Location</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">${userLocation.address}</div>
        </div>
      `);
    layer.addLayer(userMarker);

    // 2. Hospitals Markers (Red Emergency Cross)
    if (showHospitals) {
      hospitals.forEach(hosp => {
        const hospIcon = L.divIcon({
          className: 'custom-hosp-marker',
          html: `
            <div style="background: #D32F2F; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); cursor: pointer;">
              ✚
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const popupContent = `
          <div style="min-width: 210px; font-family: system-ui; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
              <span style="font-size: 10px; background: #FFEBEE; color: #C62828; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${hosp.type}
              </span>
              <span style="font-size: 10px; color: #64748B; font-weight: bold;">${formatDistance(hosp.distanceKm)}</span>
            </div>
            <h4 style="margin: 6px 0 2px; font-size: 14px; font-weight: bold; color: #0F172A;">${hosp.name}</h4>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${hosp.address}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 8px;">
              <div>Emergency: <strong>${hosp.facilities.emergency === 'available' ? '🟢 Available' : '🟡 Limited'}</strong></div>
              <div>ICU: <strong>${hosp.facilities.icu === 'available' ? '🟢 Yes' : hosp.facilities.icu === 'limited' ? '🟡 Limited' : '🔴 Full'}</strong></div>
            </div>
            <div style="display: flex; gap: 6px;">
              <a href="tel:${hosp.emergencyHotline}" style="flex: 1; background: #D32F2F; color: white; text-align: center; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
                📞 Call Hotline
              </a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}" target="_blank" style="flex: 1; background: #E2E8F0; color: #1E293B; text-align: center; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
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
            <div style="background: ${amb.status === 'available' ? '#2E7D32' : '#F57C00'}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;">
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
            <a href="tel:${amb.phone}" style="display: block; margin-top: 6px; background: #D32F2F; color: white; text-align: center; padding: 5px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
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

  const recenterMapToUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-card-soft bg-slate-100">
      {/* Map Header / Layer Controls */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-3 text-xs flex-wrap max-w-[90%]">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Map Layers:</span>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer hover:text-red-700">
          <input
            type="checkbox"
            checked={showHospitals}
            onChange={(e) => setShowHospitals(e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
          />
          <span className="flex items-center gap-1">
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
          <span className="flex items-center gap-1">
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
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Blood Donors ({donors.filter(d => d.available).length})
          </span>
        </label>
      </div>

      {/* Recenter Button */}
      <button
        type="button"
        onClick={recenterMapToUser}
        className="absolute bottom-4 right-4 z-[1000] bg-white text-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold"
        title="Recenter to my detected location"
      >
        <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
        <span className="hidden sm:inline">My Location</span>
      </button>

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className={`w-full ${height} z-0`} />
    </div>
  );
};
