// Geocoding utility using OpenStreetMap Nominatim API (free, no API key required)
// Rate limit: 1 request per second, so we cache results

interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
}

// In-memory cache to avoid repeated API calls
const geocodeCache = new Map<string, [number, number] | null>();

/**
 * Geocode a location string to coordinates using OpenStreetMap Nominatim
 * @param location - City or place name
 * @param country - Country name (optional, improves accuracy)
 * @returns [longitude, latitude] or null if not found
 */
export async function geocodeLocation(
  location: string | null,
  country: string | null
): Promise<[number, number] | null> {
  if (!location && !country) return null;

  // Create cache key
  const cacheKey = `${location || ''}-${country || ''}`.toLowerCase().trim();
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) || null;
  }

  try {
    // Build search query
    const searchQuery = [location, country].filter(Boolean).join(', ');
    
    // Use OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
      {
        headers: {
          // Required by Nominatim API policy
          'User-Agent': 'RoverNote Travel Journal App',
        },
      }
    );

    if (!response.ok) {
      console.warn('Geocoding API error:', response.status);
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const coords: [number, number] = [
        parseFloat(result.lon),
        parseFloat(result.lat),
      ];
      
      // Cache the result
      geocodeCache.set(cacheKey, coords);
      return coords;
    }

    // No results found
    geocodeCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.warn('Geocoding error:', error);
    geocodeCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Batch geocode multiple locations with rate limiting
 * @param locations - Array of {location, country} objects
 * @returns Map of cache keys to coordinates
 */
export async function batchGeocodeLocations(
  locations: Array<{ location: string | null; country: string | null }>
): Promise<Map<string, [number, number] | null>> {
  const results = new Map<string, [number, number] | null>();
  
  // Filter out already cached locations
  const uncachedLocations = locations.filter(({ location, country }) => {
    const cacheKey = `${location || ''}-${country || ''}`.toLowerCase().trim();
    if (geocodeCache.has(cacheKey)) {
      results.set(cacheKey, geocodeCache.get(cacheKey) || null);
      return false;
    }
    return true;
  });

  // Geocode uncached locations with rate limiting (1 per second)
  for (const { location, country } of uncachedLocations) {
    const coords = await geocodeLocation(location, country);
    const cacheKey = `${location || ''}-${country || ''}`.toLowerCase().trim();
    results.set(cacheKey, coords);
    
    // Rate limit: wait 1 second between requests
    if (uncachedLocations.indexOf({ location, country }) < uncachedLocations.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Get coordinates from cache without making API call
 */
export function getCachedCoordinates(
  location: string | null,
  country: string | null
): [number, number] | null | undefined {
  const cacheKey = `${location || ''}-${country || ''}`.toLowerCase().trim();
  return geocodeCache.get(cacheKey);
}

/**
 * Pre-populate cache with known coordinates
 */
export function setCachedCoordinates(
  location: string | null,
  country: string | null,
  coords: [number, number] | null
): void {
  const cacheKey = `${location || ''}-${country || ''}`.toLowerCase().trim();
  geocodeCache.set(cacheKey, coords);
}
