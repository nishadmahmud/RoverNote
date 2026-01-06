import { useState, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, Maximize2, TrendingUp, Navigation2 } from 'lucide-react';
import { getCoordinates } from '../utils/mapData';

interface TravelEntry {
  id: string;
  location: string;
  country: string;
  date: string;
  image: string;
  author: string;
  likes?: number;
}

interface InteractiveWorldMapProps {
  entries: TravelEntry[];
  onMarkerClick?: (entry: TravelEntry) => void;
  showRoutes?: boolean;
  showHeatmap?: boolean;
  personalMode?: boolean;
}

export function InteractiveWorldMap({ 
  entries, 
  onMarkerClick, 
  showRoutes = false, 
  showHeatmap = false, 
  personalMode = false 
}: InteractiveWorldMapProps) {
  const [selectedEntry, setSelectedEntry] = useState<TravelEntry | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<TravelEntry | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
  
  // Countries that have been visited (for coloring)
  const visitedCountries = [...new Set(entries.map(e => e.country.toLowerCase()))];

  const handleMarkerClick = (entry: TravelEntry) => {
    setSelectedEntry(entry);
    if (onMarkerClick) {
      onMarkerClick(entry);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert lat/lng to SVG coordinates (Mercator-ish projection)
  const projectToSVG = (lat: number, lng: number) => {
    const x = (lng + 180) * (1000 / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 500 - (mercN * (500 / Math.PI));
    return { x, y };
  };

  // Simplified world map paths (continents)
  const worldPaths = [
    // North America
    { 
      d: "M 150 150 Q 180 120 220 130 L 250 140 L 270 160 L 280 200 L 270 250 L 250 280 L 220 300 L 200 290 L 180 270 L 160 240 L 145 200 Z",
      name: "North America",
      countries: ['usa', 'united states', 'canada', 'mexico']
    },
    // South America
    {
      d: "M 260 320 L 280 340 L 285 380 L 280 420 L 270 460 L 250 480 L 230 470 L 220 450 L 215 410 L 220 370 L 240 340 Z",
      name: "South America",
      countries: ['brazil', 'argentina', 'chile', 'peru', 'colombia']
    },
    // Europe
    {
      d: "M 480 120 L 520 110 L 550 120 L 560 140 L 555 160 L 540 175 L 510 180 L 485 170 L 475 150 Z",
      name: "Europe",
      countries: ['france', 'spain', 'italy', 'germany', 'uk', 'united kingdom', 'greece', 'netherlands', 'austria', 'czech republic']
    },
    // Africa
    {
      d: "M 490 200 L 520 195 L 550 210 L 565 240 L 570 280 L 565 320 L 550 360 L 530 380 L 500 385 L 480 370 L 470 340 L 468 300 L 475 260 L 485 220 Z",
      name: "Africa",
      countries: ['egypt', 'south africa', 'morocco', 'kenya', 'tanzania']
    },
    // Asia
    {
      d: "M 580 130 L 650 120 L 720 125 L 780 140 L 820 160 L 840 190 L 835 220 L 820 245 L 790 260 L 750 265 L 710 255 L 680 240 L 650 220 L 620 200 L 595 180 L 580 155 Z",
      name: "Asia",
      countries: ['japan', 'china', 'thailand', 'singapore', 'india', 'uae', 'turkey', 'south korea', 'indonesia']
    },
    // Australia/Oceania
    {
      d: "M 780 350 L 820 345 L 860 355 L 880 375 L 875 400 L 850 415 L 815 420 L 785 410 L 770 390 L 775 365 Z",
      name: "Australia",
      countries: ['australia', 'new zealand']
    }
  ];

  // Check if continent has been visited
  const isContinentVisited = (continentCountries: string[]) => {
    return continentCountries.some(country => visitedCountries.includes(country));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-4 border-[var(--color-accent)] overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Navigation2 className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-white text-2xl" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {personalMode ? '🗺️ My Travel Map' : '🌍 World Explorer'}
              </h3>
              <p className="text-white/90 text-sm">
                {entriesWithCoords.length} destinations • {countriesVisited.length} countries
              </p>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleZoomIn}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-all"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-all"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleResetView}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-all"
              title="Reset View"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex gap-2 mt-3">
          {showRoutes && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Routes Active
            </div>
          )}
          {showHeatmap && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm flex items-center gap-1">
              <TrendingUp size={12} />
              Heatmap On
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div 
        className={`relative bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ height: '700px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG World Map */}
        <svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Ocean background */}
          <defs>
            <pattern id="waves" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q10 15 20 20 T40 20" stroke="#0891b2" strokeWidth="0.5" fill="none" opacity="0.3"/>
            </pattern>
            
            {/* Glow effect for visited countries */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="500" fill="url(#waves)" />

          {/* Continents */}
          {worldPaths.map((continent, index) => {
            const isVisited = isContinentVisited(continent.countries);
            return (
              <g key={index}>
                {/* Continent shadow */}
                <path
                  d={continent.d}
                  fill="#000"
                  opacity="0.1"
                  transform="translate(3, 3)"
                />
                {/* Continent */}
                <path
                  d={continent.d}
                  fill={isVisited ? '#86efac' : '#cbd5e1'}
                  stroke={isVisited ? '#22c55e' : '#64748b'}
                  strokeWidth="2"
                  className="transition-all duration-500"
                  style={{
                    filter: isVisited ? 'url(#glow)' : 'none',
                  }}
                >
                  <title>{continent.name}{isVisited ? ' ✓ Visited' : ''}</title>
                </path>
                {/* Continent name label */}
                <text
                  x={parseInt(continent.d.split(' ')[1])}
                  y={parseInt(continent.d.split(' ')[2]) - 10}
                  fontSize="10"
                  fill={isVisited ? '#15803d' : '#475569'}
                  fontFamily="Permanent Marker, cursive"
                  opacity="0.6"
                  pointerEvents="none"
                >
                  {continent.name}
                </text>
              </g>
            );
          })}

          {/* Route lines */}
          {showRoutes && entriesWithCoords.length > 1 && entriesWithCoords.map((entry, index) => {
            if (index === entriesWithCoords.length - 1) return null;
            const nextEntry = entriesWithCoords[index + 1];
            if (!entry.coords || !nextEntry.coords) return null;

            const start = projectToSVG(entry.coords.lat, entry.coords.lng);
            const end = projectToSVG(nextEntry.coords.lat, nextEntry.coords.lng);

            // Create curved path
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 30; // Arc upward

            return (
              <g key={`route-${entry.id}-${nextEntry.id}`}>
                {/* Shadow */}
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  stroke="#000"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.2"
                  transform="translate(2, 2)"
                />
                {/* Animated route */}
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  stroke="#ff6b6b"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="8 4"
                  opacity="0.8"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="12"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
                {/* Plane icon along route */}
                <g transform={`translate(${midX}, ${midY - 10})`}>
                  <path d="M -4 0 L 4 0 L 0 -6 Z" fill="#ff6b6b">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            );
          })}

          {/* Heatmap circles */}
          {showHeatmap && Object.entries(locationCounts).map(([location, count]) => {
            const coords = getCoordinates(location);
            if (!coords) return null;
            const { x, y } = projectToSVG(coords.lat, coords.lng);
            
            const radius = Math.min(40, 15 + count * 4);
            
            return (
              <g key={`heat-${location}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill="#ef4444"
                  opacity="0.2"
                >
                  <animate
                    attributeName="r"
                    values={`${radius};${radius + 5};${radius}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={radius * 0.6}
                  fill="#ef4444"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values={`${radius * 0.6};${radius * 0.7};${radius * 0.6}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Location markers */}
          {entriesWithCoords.map((entry, index) => {
            if (!entry.coords) return null;
            const { x, y } = projectToSVG(entry.coords.lat, entry.coords.lng);
            const isSelected = selectedEntry?.id === entry.id;
            const isHovered = hoveredEntry?.id === entry.id;
            const visitCount = locationCounts[entry.location] || 1;
            const scale = isSelected || isHovered ? 1.5 : 1;
            
            return (
              <g
                key={entry.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-all"
                onClick={() => handleMarkerClick(entry)}
                onMouseEnter={() => setHoveredEntry(entry)}
                onMouseLeave={() => setHoveredEntry(null)}
              >
                {/* Pin shadow */}
                <ellipse
                  cx="2"
                  cy="32"
                  rx="6"
                  ry="3"
                  fill="#000"
                  opacity="0.3"
                />
                
                {/* Pin */}
                <g transform={`scale(${scale})`}>
                  {/* Pin body */}
                  <path
                    d="M 0 -24 C -8 -24 -14 -18 -14 -10 C -14 -2 0 8 0 8 C 0 8 14 -2 14 -10 C 14 -18 8 -24 0 -24 Z"
                    fill={isSelected ? '#facc15' : isHovered ? '#fbbf24' : '#f43f5e'}
                    stroke="#fff"
                    strokeWidth="2"
                    filter={isSelected ? 'url(#glow)' : 'none'}
                  />
                  {/* Pin dot */}
                  <circle
                    cx="0"
                    cy="-12"
                    r="5"
                    fill="#fff"
                  />
                  
                  {/* Visit count badge */}
                  {visitCount > 1 && (
                    <g transform="translate(12, -24)">
                      <circle cx="0" cy="0" r="8" fill="#dc2626" stroke="#fff" strokeWidth="1.5"/>
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fill="#fff"
                        fontWeight="bold"
                      >
                        {visitCount}
                      </text>
                    </g>
                  )}
                </g>

                {/* Bounce animation for selected */}
                {isSelected && (
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values={`${x} ${y}; ${x} ${y - 10}; ${x} ${y}`}
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip overlay */}
        {(hoveredEntry || selectedEntry) && (
          <div 
            className="absolute pointer-events-none z-50"
            style={{
              left: '50%',
              top: '20px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-[var(--color-accent)] max-w-sm">
              <div className="flex gap-4">
                <img 
                  src={(hoveredEntry || selectedEntry)!.image} 
                  alt={(hoveredEntry || selectedEntry)!.location}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                />
                <div>
                  <p className="font-bold text-[var(--color-primary)] text-lg" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                    {(hoveredEntry || selectedEntry)!.location}
                  </p>
                  <p className="text-sm text-gray-600">{(hoveredEntry || selectedEntry)!.country}</p>
                  <p className="text-xs text-gray-500 mt-1">{(hoveredEntry || selectedEntry)!.date}</p>
                  {!personalMode && (
                    <p className="text-xs text-[var(--color-secondary)] mt-1">by {(hoveredEntry || selectedEntry)!.author}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-gray-200">
          <p className="text-xs font-semibold mb-2" style={{ fontFamily: 'Permanent Marker, cursive' }}>
            🗺️ How to Navigate
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>🖱️ <strong>Drag</strong> to pan around</p>
            <p>🔍 <strong>Zoom</strong> with buttons</p>
            <p>📍 <strong>Click pins</strong> for details</p>
            <p>🌍 <strong>Green areas</strong> = visited!</p>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-gray-200">
          <p className="font-semibold text-sm mb-3" style={{ fontFamily: 'Permanent Marker, cursive' }}>Legend</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-6 bg-rose-500 rounded-t-full border-2 border-white"></div>
              <span>Your destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
              <span>Visited regions</span>
            </div>
            {showRoutes && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-rose-500"></div>
                <span>Travel routes</span>
              </div>
            )}
            {showHeatmap && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400/40"></div>
                <span>Popular spots</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Footer Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-4 border-[var(--color-accent)]">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {entriesWithCoords.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-secondary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {countriesVisited.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-accent)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {entries.reduce((sum, e) => sum + (e.likes || 0), 0)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Likes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-500" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              {zoom.toFixed(1)}x
            </div>
            <div className="text-xs text-gray-600 mt-1">Zoom Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
