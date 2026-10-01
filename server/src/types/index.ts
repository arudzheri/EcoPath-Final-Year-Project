export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export interface TransportMode {
  type: 'car' | 'bus' | 'rail' | 'cycling' | 'walking';
  distance: number; // in km
  emissions: number; // in kg CO2e
}

export interface CarbonCalculationRequest {
  origin: Location;
  destination: Location;
  transportModes?: string[];
}

export interface CarbonCalculationResponse {
  origin: Location;
  destination: Location;
  options: TransportMode[];
  lowestEmission: TransportMode;
  distance: number;
}

export interface ItineraryItem {
  id: string;
  name: string;
  location: Location;
  type: string; // e.g., 'attraction', 'restaurant', 'hotel'
  description?: string;
}

export interface ItineraryRequest {
  startLocation: Location;
  waypoints: Location[];
  preferences?: {
    transportModes?: string[];
    radius?: number;
  };
}

export interface ItineraryResponse {
  id: string;
  startLocation: Location;
  items: ItineraryItem[];
  routes: TransportMode[];
  totalEmissions: number;
  totalDistance: number;
}
