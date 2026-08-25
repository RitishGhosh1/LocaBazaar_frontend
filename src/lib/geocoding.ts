export interface LocationSuggestion {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export const POPULAR_LOCATIONS: LocationSuggestion[] = [
  // Bangalore Major Areas
  { name: "Koramangala", description: "Koramangala, Bengaluru, Karnataka", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar", description: "Indiranagar, Bengaluru, Karnataka", lat: 12.9784, lng: 77.6408 },
  { name: "Bangalore Central (MG Road)", description: "MG Road / Brigade Road, Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "HSR Layout", description: "HSR Layout, Bengaluru, Karnataka", lat: 12.9121, lng: 77.6446 },
  { name: "Whitefield", description: "Whitefield, Bengaluru, Karnataka", lat: 12.9698, lng: 77.7500 },
  { name: "Malleshwaram", description: "Malleshwaram, Bengaluru, Karnataka", lat: 13.0031, lng: 77.5643 },
  { name: "Jayanagar", description: "Jayanagar, Bengaluru, Karnataka", lat: 12.9308, lng: 77.5838 },
  { name: "BTM Layout", description: "BTM Layout, Bengaluru, Karnataka", lat: 12.9166, lng: 77.6101 },
  { name: "Electronic City", description: "Electronic City, Bengaluru, Karnataka", lat: 12.8399, lng: 77.6770 },
  { name: "Marathahalli", description: "Marathahalli, Bengaluru, Karnataka", lat: 12.9591, lng: 77.6974 },
  { name: "Bellandur", description: "Bellandur, Bengaluru, Karnataka", lat: 12.9304, lng: 77.6784 },
  { name: "JP Nagar", description: "JP Nagar, Bengaluru, Karnataka", lat: 12.9063, lng: 77.5857 },
  { name: "Hebbal", description: "Hebbal, Bengaluru, Karnataka", lat: 13.0358, lng: 77.5970 },
  { name: "Rajajinagar", description: "Rajajinagar, Bengaluru, Karnataka", lat: 12.9982, lng: 77.5530 },
  { name: "Banashankari", description: "Banashankari, Bengaluru, Karnataka", lat: 12.9255, lng: 77.5468 },
  { name: "Yelahanka", description: "Yelahanka, Bengaluru, Karnataka", lat: 13.1007, lng: 77.5963 },

  // Major Metro Cities
  { name: "Bengaluru", description: "Bengaluru, Karnataka, India", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", description: "Mumbai, Maharashtra, India", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi / NCR", description: "New Delhi, Delhi, India", lat: 28.6139, lng: 77.2090 },
  { name: "Hyderabad", description: "Hyderabad, Telangana, India", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", description: "Chennai, Tamil Nadu, India", lat: 13.0827, lng: 80.2707 },
  { name: "Pune", description: "Pune, Maharashtra, India", lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", description: "Kolkata, West Bengal, India", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", description: "Ahmedabad, Gujarat, India", lat: 23.0225, lng: 72.5714 },
  { name: "Gurgaon", description: "Gurugram, Haryana, India", lat: 28.4595, lng: 77.0266 },
  { name: "Noida", description: "Noida, Uttar Pradesh, India", lat: 28.5355, lng: 77.3910 },
];

/**
 * Searches locations matching query string.
 * First searches instant local dictionary, and falls back to Nominatim API if needed.
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // 1. Instant local match
  const localMatches = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(trimmed) ||
      loc.description.toLowerCase().includes(trimmed)
  );

  if (localMatches.length >= 3) {
    return localMatches.slice(0, 5);
  }

  // 2. Fetch from OpenStreetMap Nominatim for arbitrary areas/cities
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as Array<{
        display_name: string;
        name?: string;
        lat: string;
        lon: string;
      }>;

      const remoteMatches: LocationSuggestion[] = data.map((item) => {
        const parts = item.display_name.split(",");
        const primaryName = item.name || parts[0]?.trim() || query;
        return {
          name: primaryName,
          description: item.display_name,
          lat: Number(parseFloat(item.lat).toFixed(6)),
          lng: Number(parseFloat(item.lon).toFixed(6)),
        };
      });

      const combined = [...localMatches];
      for (const item of remoteMatches) {
        if (!combined.some((c) => Math.abs(c.lat - item.lat) < 0.01 && Math.abs(c.lng - item.lng) < 0.01)) {
          combined.push(item);
        }
      }
      return combined.slice(0, 6);
    }
  } catch {
    // Graceful fallback to local matches
  }

  return localMatches.slice(0, 5);
}

/**
 * Attempts to get user location using WiFi/IP (enableHighAccuracy: false),
 * avoiding GPS hardware lock timeouts on desktop browsers.
 */
export function getBrowserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Calculates straight line distance in km between two coordinate points.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

