// Geocoding data for major cities/locations
export const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  // Europe
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Rome': { lat: 41.9028, lng: 12.4964 },
  'Barcelona': { lat: 41.3851, lng: 2.1734 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Vienna': { lat: 48.2082, lng: 16.3738 },
  'Prague': { lat: 50.0755, lng: 14.4378 },
  'Santorini': { lat: 36.3932, lng: 25.4615 },
  'Athens': { lat: 37.9838, lng: 23.7275 },
  
  // Asia
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Bali': { lat: -8.3405, lng: 115.0920 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Seoul': { lat: 37.5665, lng: 126.9780 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Beijing': { lat: 39.9042, lng: 116.4074 },
  
  // Americas
  'New York City': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Las Vegas': { lat: 36.1699, lng: -115.1398 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Vancouver': { lat: 49.2827, lng: -123.1207 },
  'Mexico City': { lat: 19.4326, lng: -99.1332 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
  
  // Africa & Middle East
  'Cairo': { lat: 30.0444, lng: 31.2357 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Marrakech': { lat: 31.6295, lng: -7.9811 },
  'Istanbul': { lat: 41.0082, lng: 28.9784 },
  
  // Oceania
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Auckland': { lat: -36.8485, lng: 174.7633 },
};

// Country name to ISO code mapping for coloring countries
export const countryISOCodes: Record<string, string> = {
  'France': 'FR',
  'United Kingdom': 'GB',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Germany': 'DE',
  'Austria': 'AT',
  'Czech Republic': 'CZ',
  'Greece': 'GR',
  'Japan': 'JP',
  'Indonesia': 'ID',
  'Thailand': 'TH',
  'Singapore': 'SG',
  'UAE': 'AE',
  'South Korea': 'KR',
  'China': 'CN',
  'India': 'IN',
  'USA': 'US',
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Morocco': 'MA',
  'Turkey': 'TR',
  'Australia': 'AU',
  'New Zealand': 'NZ',
};

// Get coordinates for a location (with fallback)
export function getCoordinates(location: string): { lat: number; lng: number } | null {
  return locationCoordinates[location] || null;
}

// Calculate route between two points (simplified for now)
export function calculateRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  return [
    [from.lat, from.lng],
    [to.lat, to.lng]
  ];
}

// Generate color based on visit count
export function getHeatmapColor(visits: number): string {
  if (visits >= 10) return '#991b1b'; // dark red
  if (visits >= 7) return '#dc2626'; // red
  if (visits >= 5) return '#f97316'; // orange
  if (visits >= 3) return '#facc15'; // yellow
  if (visits >= 1) return '#86efac'; // light green
  return '#94a3b8'; // gray (not visited)
}

// Get country ISO code
export function getCountryISO(country: string): string | null {
  return countryISOCodes[country] || null;
}
