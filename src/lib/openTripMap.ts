const API_KEY = "5ae2e3f221c38a28845f05b62488ef7244ce4d54ddd11cf89b42ea97";
const BASE = "https://api.opentripmap.com/0.1/en/places";

export interface GeoName {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population: number;
}

export interface Place {
  xid: string;
  name: string;
  kinds: string;
  point: { lat: number; lon: number };
  rate?: number;
}

export interface PlaceDetail {
  xid: string;
  name: string;
  kinds: string;
  wikipedia_extracts?: { text: string };
  preview?: { source: string };
  point: { lat: number; lon: number };
  address?: { city?: string; country?: string };
}

export async function geoname(city: string): Promise<GeoName> {
  const res = await fetch(`${BASE}/geoname?name=${encodeURIComponent(city)}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function getPlacesRadius(lat: number, lon: number, radius: number = 5000, limit: number = 20): Promise<Place[]> {
  const res = await fetch(
    `${BASE}/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&rate=2&format=json&apikey=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
}

export async function getPlaceDetail(xid: string): Promise<PlaceDetail> {
  const res = await fetch(`${BASE}/xid/${xid}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch place details");
  return res.json();
}
