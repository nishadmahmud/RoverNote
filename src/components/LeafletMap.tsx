'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Globe2, MapPin, Heart, Plane, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Journey {
  id: string;
  title: string;
  location: string | null;
  country: string | null;
  image_url: string | null;
  start_date: string | null;
  likes_count: number;
  profiles?: {
    display_name: string | null;
  } | null;
}

interface LeafletMapProps {
  journeys: Journey[];
  onMarkerClick?: (journey: Journey) => void;
}

// City coordinates database
const cityCoordinates: Record<string, [number, number]> = {
  'tokyo': [35.6895, 139.6917],
  'kyoto': [35.0116, 135.7681],
  'osaka': [34.6937, 135.5023],
  'bangkok': [13.7563, 100.5018],
  'singapore': [1.3521, 103.8198],
  'hong kong': [22.3193, 114.1694],
  'seoul': [37.5665, 126.9780],
  'beijing': [39.9042, 116.4074],
  'shanghai': [31.2304, 121.4737],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.7041, 77.1025],
  'dubai': [25.2048, 55.2708],
  'bali': [-8.3405, 115.0920],
  'hanoi': [21.0278, 105.8342],
  'ho chi minh': [10.8231, 106.6297],
  'kuala lumpur': [3.1390, 101.6869],
  'paris': [48.8566, 2.3522],
  'london': [51.5074, -0.1278],
  'rome': [41.9028, 12.4964],
  'barcelona': [41.3851, 2.1734],
  'amsterdam': [52.3676, 4.9041],
  'berlin': [52.5200, 13.4050],
  'vienna': [48.2082, 16.3738],
  'prague': [50.0755, 14.4378],
  'lisbon': [38.7223, -9.1393],
  'madrid': [40.4168, -3.7038],
  'athens': [37.9838, 23.7275],
  'venice': [45.4408, 12.3155],
  'florence': [43.7696, 11.2558],
  'munich': [48.1351, 11.5820],
  'zurich': [47.3769, 8.5417],
  'copenhagen': [55.6761, 12.5683],
  'stockholm': [59.3293, 18.0686],
  'dublin': [53.3498, -6.2603],
  'edinburgh': [55.9533, -3.1883],
  'brussels': [50.8503, 4.3517],
  'budapest': [47.4979, 19.0402],
  'santorini': [36.3932, 25.4615],
  'istanbul': [41.0082, 28.9784],
  'new york': [40.7128, -74.0060],
  'los angeles': [34.0522, -118.2437],
  'san francisco': [37.7749, -122.4194],
  'miami': [25.7617, -80.1918],
  'chicago': [41.8781, -87.6298],
  'las vegas': [36.1699, -115.1398],
  'boston': [42.3601, -71.0589],
  'seattle': [47.6062, -122.3321],
  'vancouver': [49.2827, -123.1207],
  'toronto': [43.6532, -79.3832],
  'mexico city': [19.4326, -99.1332],
  'cancun': [21.1619, -86.8515],
  'rio de janeiro': [-22.9068, -43.1729],
  'buenos aires': [-34.6037, -58.3816],
  'lima': [-12.0464, -77.0428],
  'havana': [23.1136, -82.3666],
  'sydney': [-33.8688, 151.2093],
  'melbourne': [-37.8136, 144.9631],
  'auckland': [-36.8485, 174.7633],
  'queenstown': [-45.0312, 168.6626],
  'cairo': [30.0444, 31.2357],
  'cape town': [-33.9249, 18.4241],
  'marrakech': [31.6295, -7.9811],
  'nairobi': [-1.2921, 36.8219],
  'johannesburg': [-26.2041, 28.0473],
  'jerusalem': [31.7683, 35.2137],
  'tel aviv': [32.0853, 34.7818],
  'doha': [25.2854, 51.5310],
};

const countryCoordinates: Record<string, [number, number]> = {
  'japan': [36.2048, 138.2529],
  'thailand': [15.8700, 100.9925],
  'singapore': [1.3521, 103.8198],
  'south korea': [35.9078, 127.7669],
  'china': [35.8617, 104.1954],
  'india': [20.5937, 78.9629],
  'vietnam': [14.0583, 108.2772],
  'indonesia': [-0.7893, 113.9213],
  'malaysia': [4.2105, 101.9758],
  'philippines': [12.8797, 121.7740],
  'france': [46.2276, 2.2137],
  'italy': [41.8719, 12.5674],
  'spain': [40.4637, -3.7492],
  'germany': [51.1657, 10.4515],
  'united kingdom': [55.3781, -3.4360],
  'netherlands': [52.1326, 5.2913],
  'greece': [39.0742, 21.8243],
  'portugal': [39.3999, -8.2245],
  'switzerland': [46.8182, 8.2275],
  'austria': [47.5162, 14.5501],
  'turkey': [38.9637, 35.2433],
  'united states': [37.0902, -95.7129],
  'usa': [37.0902, -95.7129],
  'canada': [56.1304, -106.3468],
  'mexico': [23.6345, -102.5528],
  'brazil': [-14.2350, -51.9253],
  'argentina': [-38.4161, -63.6167],
  'australia': [-25.2744, 133.7751],
  'new zealand': [-40.9006, 174.8860],
  'egypt': [26.8206, 30.8025],
  'south africa': [-30.5595, 22.9375],
  'morocco': [31.7917, -7.0926],
  'uae': [23.4241, 53.8478],
  'united arab emirates': [23.4241, 53.8478],
};

function getCoordinates(location: string | null, country: string | null): [number, number] | null {
  if (!location && !country) return null;
  
  if (location) {
    const lowerLocation = location.toLowerCase();
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lowerLocation.includes(city) || city.includes(lowerLocation)) {
        return coords;
      }
    }
  }
  
  if (country) {
    const lowerCountry = country.toLowerCase();
    for (const [countryName, coords] of Object.entries(countryCoordinates)) {
      if (lowerCountry.includes(countryName) || countryName.includes(lowerCountry)) {
        return coords;
      }
    }
  }
  
  return null;
}

// Separate map content component
function MapContent({ 
  markers, 
  onMarkerClick 
}: { 
  markers: (Journey & { coordinates: [number, number] })[];
  onMarkerClick?: (journey: Journey) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    
    // Check if this container already has a map
    const container = mapContainerRef.current;
    if ((container as any)._leaflet_id) {
      // Container already has a map, don't initialize again
      return;
    }

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !container) return;
      
      // Double check container doesn't have a map
      if ((container as any)._leaflet_id) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      try {
        const map = L.map(container, {
          center: [30, 0],
          zoom: 2,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a>',
          maxZoom: 19,
        }).addTo(map);

        // Create markers layer group
        const markersLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
        
        // Store map reference globally for controls
        (window as any).__leafletMapInstance = map;
        
        setMapReady(true);
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        (window as any).__leafletMapInstance = null;
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapReady || !markersLayerRef.current) return;

    import('leaflet').then((L) => {
      const markersLayer = markersLayerRef.current;
      if (!markersLayer) return;

      // Clear existing markers
      markersLayer.clearLayers();

      // Custom icon
      const customIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `<div style="
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #FF6B6B, #E55A5A);
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "><div style="
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 18],
        popupAnchor: [0, -18],
      });

      // Add markers
      markers.forEach((marker) => {
        const formatDate = (dateStr: string | null) => {
          if (!dateStr) return '';
          return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };

        const imageUrl = marker.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200';
        
        const popupContent = `
          <div style="min-width: 170px; max-width: 200px;">
            <img src="${imageUrl}" alt="" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:6px;" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'"/>
            <div style="font-weight:600;font-size:13px;color:#2C3E50;margin-bottom:2px;">${marker.location || marker.title}</div>
            <div style="font-size:11px;color:#666;margin-bottom:2px;">${marker.country || ''}</div>
            <div style="font-size:10px;color:#999;margin-bottom:6px;">${formatDate(marker.start_date)}</div>
            <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:6px;">
              <span style="color:#4ECDC4;">by ${marker.profiles?.display_name || 'Anonymous'}</span>
              <span style="color:#FF6B6B;">❤️ ${marker.likes_count || 0}</span>
            </div>
            <button onclick="window.__onViewJourney&&window.__onViewJourney('${marker.id}')" style="width:100%;padding:6px;background:linear-gradient(135deg,#FF6B6B,#4ECDC4);color:white;border:none;border-radius:16px;font-size:11px;cursor:pointer;">View Story →</button>
          </div>
        `;

        L.marker(marker.coordinates, { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 220, className: 'scrapbook-popup' })
          .addTo(markersLayer);
      });
    });
  }, [mapReady, markers]);

  // Handle view journey callback
  useEffect(() => {
    (window as any).__onViewJourney = (id: string) => {
      const journey = markers.find(m => m.id === id);
      if (journey && onMarkerClick) onMarkerClick(journey);
    };
    return () => { delete (window as any).__onViewJourney; };
  }, [markers, onMarkerClick]);

  return (
    <div 
      ref={mapContainerRef}
      style={{ height: '550px', width: '100%', background: '#E8F4F8' }}
    />
  );
}

export function LeafletMap({ journeys, onMarkerClick }: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const markers = useMemo(() => {
    return journeys
      .map(journey => {
        const coords = getCoordinates(journey.location, journey.country);
        return coords ? { ...journey, coordinates: coords } : null;
      })
      .filter((m): m is Journey & { coordinates: [number, number] } => m !== null);
  }, [journeys]);

  const uniqueCountries = [...new Set(journeys.map(j => j.country).filter(Boolean))];

  const handleZoomIn = useCallback(() => {
    (window as any).__leafletMapInstance?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    (window as any).__leafletMapInstance?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    (window as any).__leafletMapInstance?.setView([30, 0], 2);
  }, []);

  if (!mounted) {
    return (
      <div className="relative bg-[var(--color-paper)] rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--color-accent)] h-[550px] flex items-center justify-center">
        <div className="text-center">
          <Globe2 className="w-12 h-12 text-[var(--color-secondary)] mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600" style={{ fontFamily: 'Kalam, cursive' }}>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[var(--color-paper)] rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--color-accent)]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <style jsx global>{`
        .scrapbook-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 2px solid #FFE66D;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .scrapbook-popup .leaflet-popup-content { margin: 10px; }
        .scrapbook-popup .leaflet-popup-tip { border: 2px solid #FFE66D; }
        .leaflet-custom-marker { background: transparent !important; border: none !important; }
        .leaflet-control-attribution { font-size: 9px; background: rgba(255,255,255,0.7) !important; }
      `}</style>

      {/* Stats */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[var(--color-secondary)] shadow-lg flex items-center gap-2">
          <Globe2 className="text-[var(--color-secondary)]" size={18} />
          <span className="text-[var(--color-text)] font-semibold text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            {uniqueCountries.length} countries
          </span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[var(--color-primary)] shadow-lg flex items-center gap-2">
          <MapPin className="text-[var(--color-primary)]" size={18} />
          <span className="text-[var(--color-text)] font-semibold text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            {markers.length} places
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button onClick={handleZoomIn} className="bg-white/90 p-2.5 rounded-full border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)] transition-all shadow-lg">
          <ZoomIn size={18} />
        </button>
        <button onClick={handleZoomOut} className="bg-white/90 p-2.5 rounded-full border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)] transition-all shadow-lg">
          <ZoomOut size={18} />
        </button>
        <button onClick={handleReset} className="bg-white/90 p-2.5 rounded-full border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)] transition-all shadow-lg">
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Map */}
      <MapContent markers={markers} onMarkerClick={onMarkerClick} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-[var(--color-accent)]/50">
        <p className="text-[var(--color-text)] text-sm mb-3 font-bold" style={{ fontFamily: 'Permanent Marker, cursive' }}>
          🗺️ Legend
        </p>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full border-2 border-white shadow-sm"></div>
            <span>Story location</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane size={14} className="text-[var(--color-secondary)]" />
            <span>Zoom for detail</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 px-4 py-3 rounded-2xl shadow-lg border-2 border-[var(--color-secondary)]/50">
        <p className="text-gray-600 text-xs" style={{ fontFamily: 'Kalam, cursive' }}>
          ✨ Click markers • Zoom for cities
        </p>
      </div>
    </div>
  );
}
