// Emission factors in kg CO2 per km per person
export const EMISSION_FACTORS: Record<string, number> = {
  car: 0.21,
  bus: 0.089,
  train: 0.041,
  plane: 0.255,
  bicycle: 0,
  walking: 0,
};

export const VEHICLE_LABELS: Record<string, string> = {
  car: "Car",
  bus: "Bus",
  train: "Train",
  plane: "Plane",
  bicycle: "Bicycle",
  walking: "Walking",
};

export function calculateEmissions(distanceKm: number, vehicleType: string, groupSize: number = 1): number {
  const factor = EMISSION_FACTORS[vehicleType] ?? 0;
  return Math.round(distanceKm * factor * groupSize * 100) / 100;
}

export function compareAllModes(distanceKm: number, groupSize: number = 1) {
  return Object.entries(EMISSION_FACTORS).map(([mode, factor]) => ({
    mode,
    label: VEHICLE_LABELS[mode],
    emissions: Math.round(distanceKm * factor * groupSize * 100) / 100,
  }));
}

/**
 * Sustainability grade A–F based on per-person emissions for the trip.
 * A = zero/near-zero, F = heavy emitter.
 */
export function getSustainabilityGrade(emissionsPerPerson: number): { grade: string; label: string; color: string } {
  if (emissionsPerPerson <= 0) return { grade: "A", label: "Excellent — Zero Emissions", color: "grade-A" };
  if (emissionsPerPerson <= 15) return { grade: "A", label: "Excellent — Very Low Impact", color: "grade-A" };
  if (emissionsPerPerson <= 40) return { grade: "B", label: "Good — Low Impact", color: "grade-B" };
  if (emissionsPerPerson <= 80) return { grade: "C", label: "Moderate Impact", color: "grade-C" };
  if (emissionsPerPerson <= 150) return { grade: "D", label: "High Impact", color: "grade-D" };
  if (emissionsPerPerson <= 250) return { grade: "E", label: "Very High Impact", color: "grade-E" };
  return { grade: "F", label: "Severe Impact", color: "grade-F" };
}

// Haversine distance between two lat/lon points in km
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}
