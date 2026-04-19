// Malawi major cities coordinates (approximate)
const MALAWI_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "Lilongwe": { lat: -13.9899, lng: 33.7703 },
  "Blantyre": { lat: -15.7850, lng: 35.0085 },
  "Mzuzu": { lat: -11.4603, lng: 34.0208 },
  "Zomba": { lat: -15.8333, lng: 35.3000 },
  "Kasungu": { lat: -13.0333, lng: 33.4833 },
  "Area 47, Lilongwe": { lat: -13.9899, lng: 33.7703 },
  "City Centre, Lilongwe": { lat: -13.9899, lng: 33.7703 },
  "Area 25, Lilongwe": { lat: -13.9899, lng: 33.7703 },
  "Area 12, Lilongwe": { lat: -13.9899, lng: 33.7703 },
  "Nyambadwe, Blantyre": { lat: -15.7850, lng: 35.0085 },
  "Blantyre City, Blantyre": { lat: -15.7850, lng: 35.0085 },
  "Mzuzu City, Mzuzu": { lat: -11.4603, lng: 34.0208 },
};

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1  
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get coordinates for a Malawian location
 * @param location Location name
 * @returns Coordinates object or null if location not found
 */
export function getLocationCoordinates(location: string): { lat: number; lng: number } | null {
  // Try exact match first
  if (MALAWI_LOCATIONS[location]) {
    return MALAWI_LOCATIONS[location];
  }
  
  // Try to find partial match (e.g., "Lilongwe" in "Area 47, Lilongwe")
  for (const [key, coords] of Object.entries(MALAWI_LOCATIONS)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

/**
 * Calculate distance between two Malawian locations
 * @param location1 First location name
 * @param location2 Second location name
 * @returns Distance in kilometers, or null if locations not found
 */
export function calculateDistanceBetweenLocations(
  location1: string, 
  location2: string
): number | null {
  const coords1 = getLocationCoordinates(location1);
  const coords2 = getLocationCoordinates(location2);
  
  if (!coords1 || !coords2) {
    return null;
  }
  
  return calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
}

/**
 * Check if a location is within a specified distance from another location
 * @param fromLocation Starting location
 * @param toLocation Target location  
 * @param maxDistanceKm Maximum distance in kilometers
 * @returns True if within distance, false otherwise
 */
export function isLocationWithinDistance(
  fromLocation: string,
  toLocation: string,
  maxDistanceKm: number
): boolean {
  const distance = calculateDistanceBetweenLocations(fromLocation, toLocation);
  
  if (distance === null) {
    // If we can't calculate distance, assume it's within range
    return true;
  }
  
  return distance <= maxDistanceKm;
}

/**
 * Get a human-readable distance string
 * @param distanceInKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  } else if (distanceInKm < 10) {
    return `${distanceInKm.toFixed(1)}km`;
  } else {
    return `${Math.round(distanceInKm)}km`;
  }
}
