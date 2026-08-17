import React, { useEffect, useRef } from 'react';
import { FoodBusiness, FoodDonation, UserRole } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StatusBadge } from './StatusBadge';
import { MapPin, Navigation, ExternalLink, Utensils } from 'lucide-react';

interface ShegaonMapProps {
  businesses: FoodBusiness[];
  donations: FoodDonation[];
  onSelectBusiness?: (biz: FoodBusiness) => void;
  onSelectDonation?: (don: FoodDonation) => void;
  height?: string;
}

export const ShegaonMap: React.FC<ShegaonMapProps> = ({
  businesses,
  donations,
  onSelectBusiness,
  onSelectDonation,
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Shegaon central coordinates
  const SHEGAON_CENTER: [number, number] = [20.7850, 76.6880];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: SHEGAON_CENTER,
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | FoodSaver Shegaon'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon Generator function
    const createCustomIcon = (color: string, symbol: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
        ">${symbol}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    };

    // Add Business Markers
    businesses.forEach((biz) => {
      let color = '#64748b'; // Gray for identified
      let symbol = '🍴';

      if (biz.participationStatus === 'ACTIVE_DONOR') {
        color = '#059669'; // Emerald
        symbol = '🍱';
      } else if (biz.participationStatus === 'VERIFIED') {
        color = '#0d9488'; // Teal
        symbol = '✅';
      } else if (biz.participationStatus === 'INTERESTED') {
        color = '#d97706'; // Amber
        symbol = '⭐';
      } else if (biz.participationStatus === 'CONTACTED') {
        color = '#eab308'; // Yellow
        symbol = '📞';
      }

      const marker = L.marker([biz.latitude, biz.longitude], {
        icon: createCustomIcon(color, symbol)
      }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-slate-800';
      popupContent.innerHTML = `
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #065f46;">
          ${biz.name}
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
          📍 ${biz.area}, Shegaon | ${biz.type}
        </div>
        <div style="font-size: 11px; font-weight: 600; margin-bottom: 6px;">
          Status: <span style="color: ${color};">${biz.participationStatus}</span>
        </div>
        <div style="font-size: 11px; color: #334155;">
          <strong>Potential Surplus:</strong> ${biz.potentialSurplus}
        </div>
      `;

      if (onSelectBusiness) {
        const btn = document.createElement('button');
        btn.className = 'mt-2 w-full px-2 py-1 bg-emerald-700 text-white text-xs font-semibold rounded shadow hover:bg-emerald-800 transition';
        btn.innerText = 'View Business Details';
        btn.onclick = () => onSelectBusiness(biz);
        popupContent.appendChild(btn);
      }

      marker.bindPopup(popupContent);
    });

    // Add Available Food Offer Markers (Orange Highlights)
    donations.filter(d => d.status === 'Available').forEach((don) => {
      const marker = L.marker([don.latitude + 0.0005, don.longitude + 0.0005], {
        icon: createCustomIcon('#ea580c', '🍛')
      }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-slate-800';
      popupContent.innerHTML = `
        <div style="font-weight: 700; font-size: 14px; color: #c2410c;">
          🍱 ${don.foodName}
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
          Donor: ${don.donorName} (${don.donorArea})
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #059669; margin-bottom: 4px;">
          Quantity: ${don.quantity} ${don.unit}
        </div>
        <div style="font-size: 10px; color: #64748b;">
          Expires: ${new Date(don.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      `;

      if (onSelectDonation) {
        const btn = document.createElement('button');
        btn.className = 'mt-2 w-full px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded shadow hover:bg-orange-700 transition';
        btn.innerText = 'Request Surplus Food';
        btn.onclick = () => onSelectDonation(don);
        popupContent.appendChild(btn);
      }

      marker.bindPopup(popupContent);
    });

    // Invalidate size to fit container correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [businesses, donations]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900">
      
      {/* Map Header Legend Bar */}
      <div className="bg-slate-800/90 text-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-700">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <Navigation className="w-4 h-4" />
          <span>Shegaon Food Redistribution GIS Map</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white inline-block"></span>
            Active Donors ({businesses.filter(b => b.participationStatus === 'ACTIVE_DONOR').length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-600 border border-white inline-block"></span>
            Surplus Food ({donations.filter(d => d.status === 'Available').length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600 border border-white inline-block"></span>
            Verified Partners
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-500 border border-white inline-block"></span>
            Identified
          </span>
        </div>
      </div>

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

      {/* Shegaon Geographical Watermark Badge */}
      <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 bg-slate-900/90 backdrop-blur text-white rounded-lg text-xs font-semibold border border-slate-700 shadow flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span>Shegaon, Maharashtra (20.7850° N, 76.6880° E)</span>
      </div>
    </div>
  );
};
