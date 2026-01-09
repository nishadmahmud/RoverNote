'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { ZoomIn, ZoomOut, Maximize2, MapPin, Globe2, Heart, Plane } from 'lucide-react';

// TopoJSON URL - Natural Earth 110m (lightweight, all countries)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Country name mapping (handles variations)
const normalizeCountryName = (name: string): string => {
  const mappings: Record<string, string[]> = {
    'United States of America': ['usa', 'united states', 'us', 'america'],
    'United Kingdom': ['uk', 'britain', 'england', 'great britain'],
    'United Arab Emirates': ['uae', 'dubai', 'abu dhabi'],
    'South Korea': ['korea', 'republic of korea'],
    'Czech Republic': ['czechia'],
    'Russia': ['russian federation'],
  };

  const lowerName = name.toLowerCase();
  
  for (const [standard, variants] of Object.entries(mappings)) {
    if (variants.some(v => lowerName.includes(v)) || lowerName.includes(standard.toLowerCase())) {
      return standard;
    }
  }
  
  return name;
};

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

interface VercelStyleMapProps {
  journeys: Journey[];
  onCountryClick?: (country: string, journeys: Journey[]) => void;
  onMarkerClick?: (journey: Journey) => void;
}

// City coordinates database
const cityCoordinates: Record<string, [number, number]> = {
  // Asia
  'tokyo': [139.6917, 35.6895],
  'kyoto': [135.7681, 35.0116],
  'osaka': [135.5023, 34.6937],
  'bangkok': [100.5018, 13.7563],
  'singapore': [103.8198, 1.3521],
  'hong kong': [114.1694, 22.3193],
  'seoul': [126.9780, 37.5665],
  'beijing': [116.4074, 39.9042],
  'shanghai': [121.4737, 31.2304],
  'mumbai': [72.8777, 19.0760],
  'delhi': [77.1025, 28.7041],
  'dubai': [55.2708, 25.2048],
  'bali': [115.0920, -8.3405],
  'hanoi': [105.8342, 21.0278],
  'ho chi minh': [106.6297, 10.8231],
  'kuala lumpur': [101.6869, 3.1390],
  
  // Europe
  'paris': [2.3522, 48.8566],
  'london': [0.1278, 51.5074],
  'rome': [12.4964, 41.9028],
  'barcelona': [2.1734, 41.3851],
  'amsterdam': [4.9041, 52.3676],
  'berlin': [13.4050, 52.5200],
  'vienna': [16.3738, 48.2082],
  'prague': [14.4378, 50.0755],
  'lisbon': [-9.1393, 38.7223],
  'madrid': [-3.7038, 40.4168],
  'athens': [23.7275, 37.9838],
  'venice': [12.3155, 45.4408],
  'florence': [11.2558, 43.7696],
  'munich': [11.5820, 48.1351],
  'zurich': [8.5417, 47.3769],
  'copenhagen': [12.5683, 55.6761],
  'stockholm': [18.0686, 59.3293],
  'dublin': [-6.2603, 53.3498],
  'edinburgh': [-3.1883, 55.9533],
  'brussels': [4.3517, 50.8503],
  'budapest': [19.0402, 47.4979],
  'santorini': [25.4615, 36.3932],
  'istanbul': [28.9784, 41.0082],
  
  // Americas
  'new york': [-74.0060, 40.7128],
  'los angeles': [-118.2437, 34.0522],
  'san francisco': [-122.4194, 37.7749],
  'miami': [-80.1918, 25.7617],
  'chicago': [-87.6298, 41.8781],
  'las vegas': [-115.1398, 36.1699],
  'boston': [-71.0589, 42.3601],
  'seattle': [-122.3321, 47.6062],
  'vancouver': [-123.1207, 49.2827],
  'toronto': [-79.3832, 43.6532],
  'mexico city': [-99.1332, 19.4326],
  'cancun': [-86.8515, 21.1619],
  'rio de janeiro': [-43.1729, -22.9068],
  'buenos aires': [-58.3816, -34.6037],
  'lima': [-77.0428, -12.0464],
  'havana': [-82.3666, 23.1136],
  
  // Oceania
  'sydney': [151.2093, -33.8688],
  'melbourne': [144.9631, -37.8136],
  'auckland': [174.7633, -36.8485],
  'queenstown': [168.6626, -45.0312],
  
  // Africa
  'cairo': [31.2357, 30.0444],
  'cape town': [18.4241, -33.9249],
  'marrakech': [-7.9811, 31.6295],
  'nairobi': [36.8219, -1.2921],
  'johannesburg': [28.0473, -26.2041],
  
  // Middle East
  'jerusalem': [35.2137, 31.7683],
  'tel aviv': [34.7818, 32.0853],
  'doha': [51.5310, 25.2854],
};

// Country center coordinates for markers when city not found
const countryCoordinates: Record<string, [number, number]> = {
  'japan': [138.2529, 36.2048],
  'thailand': [100.9925, 15.8700],
  'singapore': [103.8198, 1.3521],
  'south korea': [127.7669, 35.9078],
  'china': [104.1954, 35.8617],
  'india': [78.9629, 20.5937],
  'vietnam': [108.2772, 14.0583],
  'indonesia': [113.9213, -0.7893],
  'malaysia': [101.9758, 4.2105],
  'philippines': [121.7740, 12.8797],
  'france': [2.2137, 46.2276],
  'italy': [12.5674, 41.8719],
  'spain': [-3.7492, 40.4637],
  'germany': [10.4515, 51.1657],
  'united kingdom': [-3.4360, 55.3781],
  'netherlands': [5.2913, 52.1326],
  'greece': [21.8243, 39.0742],
  'portugal': [-8.2245, 39.3999],
  'switzerland': [8.2275, 46.8182],
  'austria': [14.5501, 47.5162],
  'turkey': [35.2433, 38.9637],
  'united states': [-95.7129, 37.0902],
  'canada': [-106.3468, 56.1304],
  'mexico': [-102.5528, 23.6345],
  'brazil': [-51.9253, -14.2350],
  'argentina': [-63.6167, -38.4161],
  'australia': [133.7751, -25.2744],
  'new zealand': [174.8860, -40.9006],
  'egypt': [30.8025, 26.8206],
  'south africa': [22.9375, -30.5595],
  'morocco': [-7.0926, 31.7917],
  'uae': [53.8478, 23.4241],
  'united arab emirates': [53.8478, 23.4241],
};

function getCoordinates(location: string | null, country: string | null): [number, number] | null {
  if (!location && !country) return null;
  
  // Try location first
  if (location) {
    const lowerLocation = location.toLowerCase();
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lowerLocation.includes(city) || city.includes(lowerLocation)) {
        return coords;
      }
    }
  }
  
  // Fall back to country
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

// Mini journey card for hover preview - Scrapbook style
const MiniJourneyCard = memo(({ journey }: { journey: Journey }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const imageUrl = journey.image_url || null;
  const fallbackImage = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop`;

  return (
    <div className="flex gap-3 bg-white/80 rounded-xl p-2 hover:bg-white transition-colors shadow-sm border border-[var(--color-accent)]/30">
      <div className="relative">
        <img 
          src={imageUrl || fallbackImage} 
          alt={journey.location || ''} 
          className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        {/* Polaroid corner effect */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-accent)] rounded-full shadow-sm"></div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[var(--color-text)] text-sm font-semibold truncate" style={{ fontFamily: 'Kalam, cursive' }}>
          {journey.location || journey.title}
        </p>
        <p className="text-gray-500 text-xs truncate">
          {formatDate(journey.start_date)}
        </p>
        {journey.profiles?.display_name && (
          <p className="text-[var(--color-secondary)] text-xs truncate" style={{ fontFamily: 'Caveat, cursive' }}>
            by {journey.profiles.display_name}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs flex-shrink-0">
        <Heart size={12} fill="currentColor" />
        <span>{journey.likes_count || 0}</span>
      </div>
    </div>
  );
});

MiniJourneyCard.displayName = 'MiniJourneyCard';

// Memoized Geography component for performance
const MemoizedGeography = memo(({ 
  geo, 
  isVisited, 
  journeyCount, 
  onHover, 
  onClick 
}: { 
  geo: any; 
  isVisited: boolean; 
  journeyCount: number;
  onHover: (name: string | null, count: number) => void;
  onClick: (name: string) => void;
}) => {
  const countryName = geo.properties.name;
  
  return (
    <Geography
      geography={geo}
      onMouseEnter={() => onHover(countryName, journeyCount)}
      onMouseLeave={() => onHover(null, 0)}
      onClick={() => onClick(countryName)}
      style={{
        default: {
          fill: isVisited 
            ? '#4ECDC4' // Teal for visited
            : '#E8DFD5', // Warm beige for unvisited
          stroke: isVisited ? '#3DBDB5' : '#D4C8BC',
          strokeWidth: 0.8,
          outline: 'none',
          transition: 'all 0.3s ease',
        },
        hover: {
          fill: isVisited ? '#FF6B6B' : '#F5EDE5',
          stroke: isVisited ? '#E55A5A' : '#C9BDB1',
          strokeWidth: 1.2,
          outline: 'none',
          cursor: 'pointer',
        },
        pressed: {
          fill: '#FFE66D',
          stroke: '#E5CF5A',
          strokeWidth: 1.2,
          outline: 'none',
        },
      }}
    />
  );
});

MemoizedGeography.displayName = 'MemoizedGeography';

export function VercelStyleMap({ journeys, onCountryClick, onMarkerClick }: VercelStyleMapProps) {
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  });
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; count: number; journeys: Journey[] } | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<Journey | null>(null);

  // Calculate visited countries and journey counts
  const { visitedCountries, countryJourneyMap } = useMemo(() => {
    const countryMap = new Map<string, Journey[]>();
    
    journeys.forEach(journey => {
      if (journey.country) {
        const normalized = normalizeCountryName(journey.country);
        const existing = countryMap.get(normalized) || [];
        countryMap.set(normalized, [...existing, journey]);
      }
    });
    
    return {
      visitedCountries: new Set(countryMap.keys()),
      countryJourneyMap: countryMap,
    };
  }, [journeys]);

  // Get markers with coordinates
  const markers = useMemo(() => {
    return journeys
      .map(journey => {
        const coords = getCoordinates(journey.location, journey.country);
        return coords ? { ...journey, coordinates: coords } : null;
      })
      .filter((m): m is Journey & { coordinates: [number, number] } => m !== null);
  }, [journeys]);

  const handleZoomIn = useCallback(() => {
    setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 1) }));
  }, []);

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }, []);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  const handleCountryHover = useCallback((name: string | null, count: number) => {
    if (!name) {
      setHoveredCountry(null);
      return;
    }
    const normalized = normalizeCountryName(name);
    const countryJourneys = countryJourneyMap.get(normalized) || [];
    setHoveredCountry({ name, count, journeys: countryJourneys.slice(0, 3) });
  }, [countryJourneyMap]);

  const handleCountryClick = useCallback((countryName: string) => {
    const normalizedName = normalizeCountryName(countryName);
    const countryJourneys = countryJourneyMap.get(normalizedName) || [];
    onCountryClick?.(countryName, countryJourneys);
  }, [countryJourneyMap, onCountryClick]);

  const isCountryVisited = useCallback((geoName: string) => {
    const normalized = normalizeCountryName(geoName);
    return visitedCountries.has(normalized);
  }, [visitedCountries]);

  const getJourneyCount = useCallback((geoName: string) => {
    const normalized = normalizeCountryName(geoName);
    return countryJourneyMap.get(normalized)?.length || 0;
  }, [countryJourneyMap]);

  return (
    <div className="relative bg-[var(--color-paper)] rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--color-accent)]">
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      ></div>

      {/* Decorative corner stamps */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[var(--color-secondary)] shadow-lg flex items-center gap-2">
          <Globe2 className="text-[var(--color-secondary)]" size={18} />
          <span className="text-[var(--color-text)] font-semibold text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            {visitedCountries.size} countries
          </span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[var(--color-primary)] shadow-lg flex items-center gap-2">
          <MapPin className="text-[var(--color-primary)]" size={18} />
          <span className="text-[var(--color-text)] font-semibold text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            {markers.length} places
          </span>
        </div>
      </div>

      {/* Zoom Controls - Scrapbook style */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full border-2 border-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] transition-all shadow-lg"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full border-2 border-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] transition-all shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleReset}
          className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full border-2 border-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] transition-all shadow-lg"
          title="Reset View"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Country Hover Tooltip - Scrapbook style */}
      {hoveredCountry && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200">
          {/* Washi tape decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]/70 opacity-80 transform -rotate-2"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,.2) 5px, rgba(255,255,255,.2) 10px)'
            }}
          ></div>
          
          <div className="bg-[var(--color-paper)] rounded-2xl border-3 border-[var(--color-secondary)]/50 shadow-xl overflow-hidden min-w-[280px] max-w-[320px]">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 border-b-2 border-dashed border-[var(--color-accent)]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <p className="text-[var(--color-text)] font-bold" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                    {hoveredCountry.name}
                  </p>
                </div>
                {hoveredCountry.count > 0 && (
                  <span className="bg-[var(--color-secondary)] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {hoveredCountry.count} {hoveredCountry.count === 1 ? 'story' : 'stories'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Journey Cards */}
            {hoveredCountry.journeys.length > 0 ? (
              <div className="p-3 space-y-2">
                {hoveredCountry.journeys.map((journey) => (
                  <MiniJourneyCard key={journey.id} journey={journey} />
                ))}
                {hoveredCountry.count > 3 && (
                  <p className="text-center text-gray-500 text-xs pt-1" style={{ fontFamily: 'Caveat, cursive' }}>
                    +{hoveredCountry.count - 3} more adventures ✨
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <Plane className="mx-auto text-gray-300 mb-2" size={24} />
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'Caveat, cursive' }}>
                  No stories yet — be the first explorer!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Marker Tooltip */}
      {hoveredMarker && !hoveredCountry && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-2xl border-3 border-[var(--color-primary)]/50 shadow-xl max-w-xs">
          <div className="flex gap-3">
            {hoveredMarker.image_url && (
              <img 
                src={hoveredMarker.image_url} 
                alt={hoveredMarker.location || ''} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
              />
            )}
            <div>
              <p className="text-[var(--color-text)] font-bold" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {hoveredMarker.location || hoveredMarker.title}
              </p>
              <p className="text-gray-500 text-sm">{hoveredMarker.country}</p>
              {hoveredMarker.profiles?.display_name && (
                <p className="text-[var(--color-secondary)] text-xs mt-1" style={{ fontFamily: 'Caveat, cursive' }}>
                  by {hoveredMarker.profiles.display_name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [0, 30],
        }}
        style={{ width: '100%', height: '550px', background: 'linear-gradient(180deg, #E8F4F8 0%, #FFF9F0 100%)' }}
      >
        <defs>
          {/* Visited country pattern */}
          <pattern id="visitedPattern" patternUnits="userSpaceOnUse" width="10" height="10">
            <circle cx="2" cy="2" r="1" fill="#3DBDB5" opacity="0.3" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Drop shadow for markers */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>

        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          {/* Countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const visited = isCountryVisited(countryName);
                const count = getJourneyCount(countryName);
                
                return (
                  <MemoizedGeography
                    key={geo.rsmKey}
                    geo={geo}
                    isVisited={visited}
                    journeyCount={count}
                    onHover={handleCountryHover}
                    onClick={handleCountryClick}
                  />
                );
              })
            }
          </Geographies>

          {/* Markers - Pin with city label */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinates={marker.coordinates}
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => onMarkerClick?.(marker)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pin shadow */}
              <ellipse cx="0" cy="6" rx="2" ry="1" fill="#000" opacity="0.2" />
              
              {/* Small pin */}
              <g>
                <path
                  d="M 0 -8 C -4 -8 -6 -5 -6 -2 C -6 2 0 6 0 6 C 0 6 6 2 6 -2 C 6 -5 4 -8 0 -8 Z"
                  fill="#FF6B6B"
                  stroke="#fff"
                  strokeWidth="1"
                />
                <circle cx="0" cy="-3" r="2" fill="#fff" />
              </g>
              
              {/* City label - shows when zoomed (zoom > 2) */}
              {position.zoom > 2 && (
                <g>
                  {/* Label background */}
                  <rect
                    x="-30"
                    y="-24"
                    width="60"
                    height="14"
                    rx="4"
                    fill="white"
                    stroke="#FF6B6B"
                    strokeWidth="0.5"
                    opacity="0.95"
                  />
                  {/* City name */}
                  <text
                    x="0"
                    y="-14"
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="Kalam, cursive"
                    fill="#2C3E50"
                    fontWeight="600"
                  >
                    {(marker.location || marker.title || '').slice(0, 12)}
                    {(marker.location || marker.title || '').length > 12 ? '...' : ''}
                  </text>
                </g>
              )}
              
              {/* Subtle pulse animation */}
              <circle r={8} fill="#FF6B6B" opacity={0}>
                <animate
                  attributeName="r"
                  values="4;10;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend - Scrapbook style */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-[var(--color-accent)]/50">
        <p className="text-[var(--color-text)] text-sm mb-3 font-bold" style={{ fontFamily: 'Permanent Marker, cursive' }}>
          🗺️ Map Legend
        </p>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 rounded bg-[var(--color-secondary)] border border-[var(--color-secondary)]"></div>
            <span className="text-[var(--color-text)]">Visited ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 rounded bg-[#E8DFD5] border border-[#D4C8BC]"></div>
            <span className="text-[var(--color-text)]">Not visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full border border-white shadow-sm"></div>
            <span className="text-[var(--color-text)]">Story location</span>
          </div>
        </div>
      </div>

      {/* Instructions - Scrapbook style */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border-2 border-[var(--color-secondary)]/50">
        <p className="text-gray-600 text-xs" style={{ fontFamily: 'Kalam, cursive' }}>
          ✨ Drag to explore • Scroll to zoom • Click pins for stories
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-16 right-20 z-10 opacity-20 pointer-events-none">
        <Plane className="text-[var(--color-primary)] transform rotate-45" size={40} />
      </div>
      <div className="absolute bottom-20 left-20 z-10 opacity-15 pointer-events-none">
        <Globe2 className="text-[var(--color-secondary)]" size={60} />
      </div>
    </div>
  );
}
