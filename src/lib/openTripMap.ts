const API_KEY = "5ae2e3f221c38a28845f05b62488ef7244ce4d54ddd11cf89b42ea97";
const BASE = "https://api.opentripmap.com/0.1/en/places";

// Built-in city coordinates as fallback
export const CITY_COORDS: Record<string, { lat: number; lon: number; country: string }> = {
  London: { lat: 51.5074, lon: -0.1278, country: "GB" },
  Paris: { lat: 48.8566, lon: 2.3522, country: "FR" },
  Berlin: { lat: 52.52, lon: 13.405, country: "DE" },
  Rome: { lat: 41.9028, lon: 12.4964, country: "IT" },
  Madrid: { lat: 40.4168, lon: -3.7038, country: "ES" },
  Amsterdam: { lat: 52.3676, lon: 4.9041, country: "NL" },
  Vienna: { lat: 48.2082, lon: 16.3738, country: "AT" },
  Prague: { lat: 50.0755, lon: 14.4378, country: "CZ" },
  Barcelona: { lat: 41.3874, lon: 2.1686, country: "ES" },
  Lisbon: { lat: 38.7223, lon: -9.1393, country: "PT" },
  Dublin: { lat: 53.3498, lon: -6.2603, country: "IE" },
  Brussels: { lat: 50.8503, lon: 4.3517, country: "BE" },
  Warsaw: { lat: 52.2297, lon: 21.0122, country: "PL" },
  Budapest: { lat: 47.4979, lon: 19.0402, country: "HU" },
  Athens: { lat: 37.9838, lon: 23.7275, country: "GR" },
};

export interface GeoName {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface Place {
  xid: string;
  name: string;
  kinds: string;
  point: { lat: number; lon: number };
  rate?: number;
}

export function getCityCoords(city: string): GeoName {
  const coords = CITY_COORDS[city];
  if (!coords) throw new Error(`City "${city}" not found`);
  return { name: city, country: coords.country, lat: coords.lat, lon: coords.lon };
}

export async function getPlacesRadius(lat: number, lon: number, radius: number = 5000, limit: number = 20): Promise<Place[]> {
  try {
    const res = await fetch(
      `${BASE}/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&rate=2&format=json&apikey=${API_KEY}`
    );
    if (!res.ok) {
      console.warn("OpenTripMap API returned", res.status, "- using empty POI list");
      return [];
    }
    return res.json();
  } catch (e) {
    console.warn("OpenTripMap API unavailable:", e);
    return [];
  }
}
