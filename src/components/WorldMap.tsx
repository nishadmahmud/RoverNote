import { useEffect, useRef, useState } from 'react';
import { MapPin, TrendingUp, Globe } from 'lucide-react';
import { getCoordinates, calculateRoute } from '../utils/mapData';

interface TravelEntry {
  id: string;
  location: string;
  country: string;
  date: string;
  image: string;
  author: string;
  likes?: number;
}

interface WorldMapProps {
  entries: TravelEntry[];
  onMarkerClick?: (entry: TravelEntry) => void;
  showRoutes?: boolean;
  showHeatmap?: boolean;
  personalMode?: boolean;
}

export function WorldMap({ entries, onMarkerClick, showRoutes = false, showHeatmap = false, personalMode = false }: WorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<TravelEntry | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<TravelEntry | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Process entries to get coordinates
  const entriesWithCoords = entries
    .map(entry => ({
      ...entry,
      coords: getCoordinates(entry.location)
    }))
    .filter(entry => entry.coords !== null);

  // Calculate location visit counts for heatmap
  const locationCounts = entriesWithCoords.reduce((acc, entry) => {
    const key = entry.location;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique countries visited
  const countriesVisited = [...new Set(entries.map(e => e.country))];

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleMarkerClick = (entry: TravelEntry) => {
    setSelectedEntry(entry);
    if (onMarkerClick) {
      onMarkerClick(entry);
    }
  };

  // Calculate bounding box for entries
  const bounds = entriesWithCoords.reduce(
    (acc, entry) => {
      if (entry.coords) {
        acc.minLat = Math.min(acc.minLat, entry.coords.lat);
        acc.maxLat = Math.max(acc.maxLat, entry.coords.lat);
        acc.minLng = Math.min(acc.minLng, entry.coords.lng);
        acc.maxLng = Math.max(acc.maxLng, entry.coords.lng);
      }
      return acc;
    },
    { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
  );

  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;

  // Calculate size and positioning for pins
  const latRange = bounds.maxLat - bounds.minLat || 180;
  const lngRange = bounds.maxLng - bounds.minLng || 360;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / lngRange) * 100;
    const y = ((bounds.maxLat - lat) / latRange) * 100;
    return { x, y };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-4 border-[var(--color-accent)] overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-white" size={32} />
            <div>
              <h3 className="text-white" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {personalMode ? 'My Travel Map' : 'World Explorer'}
              </h3>
              <p className="text-white/80 text-sm">
                {entriesWithCoords.length} destinations • {countriesVisited.length} countries
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {showHeatmap && (
              <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                <TrendingUp size={16} className="text-white" />
                <span className="text-white text-sm">Heatmap</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="relative bg-gradient-to-b from-blue-100 to-blue-50 overflow-hidden"
        style={{ height: '600px' }}
      >
        {/* World map SVG background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            {/* Simplified world map paths */}
            <path d="M 100 150 L 150 120 L 200 130 L 250 110 L 300 140 L 320 150 L 300 180 L 280 200 L 250 190 L 200 210 L 150 200 L 120 180 Z" 
              fill="#94a3b8" opacity="0.5" />
            <path d="M 400 100 L 500 90 L 550 110 L 580 140 L 600 130 L 620 150 L 590 180 L 550 200 L 500 190 L 450 170 L 420 140 Z" 
              fill="#94a3b8" opacity="0.5" />
            <path d="M 700 180 L 750 160 L 800 170 L 820 200 L 800 240 L 750 260 L 720 250 L 700 220 Z" 
              fill="#94a3b8" opacity="0.5" />
            <ellipse cx="500" cy="250" rx="400" ry="200" fill="#94a3b8" opacity="0.3" />
          </svg>
        </div>

        {/* Route lines */}
        {showRoutes && entriesWithCoords.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {entriesWithCoords.slice(0, -1).map((entry, index) => {
              const nextEntry = entriesWithCoords[index + 1];
              if (!entry.coords || !nextEntry.coords) return null;

              const start = projectCoords(entry.coords.lat, entry.coords.lng);
              const end = projectCoords(nextEntry.coords.lat, nextEntry.coords.lng);

              return (
                <g key={`route-${entry.id}-${nextEntry.id}`}>
                  {/* Shadow line */}
                  <line
                    x1={`${start.x}%`}
                    y1={`${start.y}%`}
                    x2={`${end.x}%`}
                    y2={`${end.y}%`}
                    stroke="#000"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    opacity="0.2"
                  />
                  {/* Main line */}
                  <line
                    x1={`${start.x}%`}
                    y1={`${start.y}%`}
                    x2={`${end.x}%`}
                    y2={`${end.y}%`}
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="12"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                </g>
              );
            })}
          </svg>
        )}

        {/* Heatmap circles */}
        {showHeatmap && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {Object.entries(locationCounts).map(([location, count]) => {
              const coords = getCoordinates(location);
              if (!coords) return null;
              const { x, y } = projectCoords(coords.lat, coords.lng);
              
              const radius = Math.min(50, 20 + count * 5);
              const opacity = Math.min(0.6, 0.2 + count * 0.1);
              
              return (
                <div
                  key={location}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${radius}px`,
                    height: `${radius}px`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(239, 68, 68, ${opacity}) 0%, rgba(239, 68, 68, 0) 70%)`,
                    pointerEvents: 'none'
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Location markers */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          {entriesWithCoords.map((entry, index) => {
            if (!entry.coords) return null;
            const { x, y } = projectCoords(entry.coords.lat, entry.coords.lng);
            const isSelected = selectedEntry?.id === entry.id;
            const isHovered = hoveredEntry?.id === entry.id;
            const visitCount = locationCounts[entry.location] || 1;
            
            return (
              <div
                key={entry.id}
                className="absolute cursor-pointer transition-all duration-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -100%) scale(${isSelected || isHovered ? 1.3 : 1})`,
                  zIndex: isSelected || isHovered ? 100 : 10 + index
                }}
                onClick={() => handleMarkerClick(entry)}
                onMouseEnter={() => setHoveredEntry(entry)}
                onMouseLeave={() => setHoveredEntry(null)}
              >
                {/* Pin shadow */}
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-black/20 rounded-full transform -translate-x-1/2 translate-y-1 blur-sm" />
                
                {/* Pin */}
                <div className={`relative transition-all ${isSelected ? 'animate-bounce' : ''}`}>
                  <MapPin
                    size={isSelected || isHovered ? 36 : 32}
                    className={`${
                      isSelected ? 'text-yellow-500' : 
                      isHovered ? 'text-[var(--color-accent)]' :
                      'text-[var(--color-primary)]'
                    } drop-shadow-lg`}
                    fill="currentColor"
                  />
                  {visitCount > 1 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {visitCount}
                    </div>
                  )}
                </div>

                {/* Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-[var(--color-accent)]">
                      <p className="font-semibold text-[var(--color-primary)]">{entry.location}</p>
                      <p className="text-sm text-gray-600">{entry.country}</p>
                      {!personalMode && (
                        <p className="text-xs text-gray-500 mt-1">by {entry.author}</p>
                      )}
                      {entry.likes && (
                        <p className="text-xs text-[var(--color-secondary)] mt-1">❤️ {entry.likes} likes</p>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-[var(--color-accent)] transform rotate-45 mx-auto -mt-1.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 p-4 rounded-xl shadow-lg border-2 border-gray-200" style={{ zIndex: 20 }}>
          <p className="font-semibold text-sm mb-2" style={{ fontFamily: 'Permanent Marker, cursive' }}>Legend</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[var(--color-primary)]" fill="currentColor" />
              <span>Destination</span>
            </div>
            {showRoutes && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-[var(--color-primary)]" />
                <span>Travel route</span>
              </div>
            )}
            {showHeatmap && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400/40" />
                <span>Popular spots</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats card */}
        {selectedEntry && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-xl border-4 border-[var(--color-accent)] max-w-xs" style={{ zIndex: 20 }}>
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ×
            </button>
            <img 
              src={selectedEntry.image} 
              alt={selectedEntry.location}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 className="font-semibold text-[var(--color-primary)] mb-1" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {selectedEntry.location}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{selectedEntry.country}</p>
            <p className="text-xs text-gray-500">{selectedEntry.date}</p>
            {!personalMode && (
              <p className="text-xs text-gray-600 mt-2">by {selectedEntry.author}</p>
            )}
          </div>
        )}
      </div>

      {/* Map Footer Stats */}
      <div className="bg-gray-50 p-4 border-t-4 border-[var(--color-accent)]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {entriesWithCoords.length}
            </div>
            <div className="text-xs text-gray-600">Destinations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--color-secondary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {countriesVisited.length}
            </div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--color-accent)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {entries.reduce((sum, e) => sum + (e.likes || 0), 0)}
            </div>
            <div className="text-xs text-gray-600">Total Likes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
