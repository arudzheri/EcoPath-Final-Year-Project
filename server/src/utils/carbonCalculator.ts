// DEFRA 2024 Emission Factors (kg CO2e per km)
const EMISSION_FACTORS = {
  car: 0.192, // Average car
  bus: 0.089, // Public bus
  rail: 0.041, // Train
  cycling: 0.0, // Zero emissions
  walking: 0.0, // Zero emissions
};

export interface EmissionCalculation {
  transportMode: string;
  distance: number;
  emissions: number;
}

/**
 * Calculate CO2 emissions for a given transport mode and distance
 * @param transportMode - Type of transport (car, bus, rail, cycling, walking)
 * @param distanceKm - Distance in kilometers
 * @returns Emissions in kg CO2e
 */
export const calculateEmissions = (
  transportMode: string,
  distanceKm: number
): number => {
  const factor = EMISSION_FACTORS[transportMode as keyof typeof EMISSION_FACTORS];
  if (!factor && factor !== 0) {
    throw new Error(`Unknown transport mode: ${transportMode}`);
  }
  return distanceKm * factor;
};

/**
 * Calculate emissions for multiple transport modes
 * @param distance - Distance in kilometers
 * @param modes - Array of transport modes to calculate
 * @returns Array of emission calculations
 */
export const calculateEmissionsMultiMode = (
  distance: number,
  modes: string[] = Object.keys(EMISSION_FACTORS)
): EmissionCalculation[] => {
  return modes.map((mode) => ({
    transportMode: mode,
    distance,
    emissions: calculateEmissions(mode, distance),
  }));
};

/**
 * Calculate haversine distance between two coordinates
 * @param lat1 - Starting latitude
 * @param lon1 - Starting longitude
 * @param lat2 - Ending latitude
 * @param lon2 - Ending longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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
  return R * c;
};

export const getEmissionFactors = () => EMISSION_FACTORS;
