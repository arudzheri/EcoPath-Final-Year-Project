/**
 * UK regional cities with coordinates.
 * Focused on local/regional trips as recommended.
 */

export interface CityData {
  name: string;
  lat: number;
  lon: number;
  region: string;
}

export const UK_CITIES: CityData[] = [
  // South East
  { name: "London", lat: 51.5074, lon: -0.1278, region: "South East" },
  { name: "Brighton", lat: 50.8225, lon: -0.1372, region: "South East" },
  { name: "Canterbury", lat: 51.2802, lon: 1.0789, region: "South East" },
  { name: "Southampton", lat: 50.9097, lon: -1.4044, region: "South East" },
  { name: "Reading", lat: 51.4543, lon: -0.9781, region: "South East" },
  // South West
  { name: "Bristol", lat: 51.4545, lon: -2.5879, region: "South West" },
  { name: "Bath", lat: 51.3811, lon: -2.3590, region: "South West" },
  { name: "Exeter", lat: 50.7184, lon: -3.5339, region: "South West" },
  { name: "Plymouth", lat: 50.3755, lon: -4.1427, region: "South West" },
  // Midlands
  { name: "Oxford", lat: 51.7520, lon: -1.2577, region: "Midlands" },
  { name: "Cambridge", lat: 52.2053, lon: 0.1218, region: "Midlands" },
  { name: "Birmingham", lat: 52.4862, lon: -1.8904, region: "Midlands" },
  { name: "Nottingham", lat: 52.9548, lon: -1.1581, region: "Midlands" },
  { name: "Leicester", lat: 52.6369, lon: -1.1398, region: "Midlands" },
  { name: "Coventry", lat: 52.4068, lon: -1.5197, region: "Midlands" },
  // North
  { name: "Manchester", lat: 53.4808, lon: -2.2426, region: "North" },
  { name: "Liverpool", lat: 53.4084, lon: -2.9916, region: "North" },
  { name: "Leeds", lat: 53.8008, lon: -1.5491, region: "North" },
  { name: "Sheffield", lat: 53.3811, lon: -1.4701, region: "North" },
  { name: "York", lat: 53.9591, lon: -1.0815, region: "North" },
  { name: "Newcastle", lat: 54.9783, lon: -1.6178, region: "North" },
  // Scotland
  { name: "Edinburgh", lat: 55.9533, lon: -3.1883, region: "Scotland" },
  { name: "Glasgow", lat: 55.8642, lon: -4.2518, region: "Scotland" },
  // Wales
  { name: "Cardiff", lat: 51.4816, lon: -3.1791, region: "Wales" },
  { name: "Swansea", lat: 51.6214, lon: -3.9436, region: "Wales" },
];

export const CITY_NAMES = UK_CITIES.map(c => c.name);

export function getCityData(name: string): CityData {
  const city = UK_CITIES.find(c => c.name === name);
  if (!city) throw new Error(`City "${name}" not found`);
  return city;
}

export function getRegions(): string[] {
  return [...new Set(UK_CITIES.map(c => c.region))];
}

export function getCitiesByRegion(region: string): CityData[] {
  return UK_CITIES.filter(c => c.region === region);
}
