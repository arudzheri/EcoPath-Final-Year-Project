/**
 * Input validation and feasibility checks for travel itineraries.
 */

import { haversineDistance } from "./emissions";

// Realistic max distances per transport mode (in km, one-way)
const MAX_DISTANCE: Record<string, number> = {
  walking: 30,
  bicycle: 120,
  bus: 600,
  car: 1000,
  train: 1500,
  plane: 15000,
};

// Average speeds in km/h (including rest stops, real-world pacing)
export const AVG_SPEEDS: Record<string, number> = {
  walking: 5,
  bicycle: 18,
  bus: 55,
  car: 70,
  train: 120,
  plane: 700,
};

// Max reasonable travel hours per day per mode
const MAX_HOURS_PER_DAY: Record<string, number> = {
  walking: 8,
  bicycle: 7,
  bus: 10,
  car: 8,
  train: 10,
  plane: 12,
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateItinerary(
  distanceKm: number,
  vehicleType: string,
  duration: number,
  groupSize: number,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check max distance for mode
  const maxDist = MAX_DISTANCE[vehicleType];
  if (maxDist && distanceKm > maxDist) {
    errors.push(
      `${distanceKm.toFixed(0)} km is too far for ${vehicleType}. Maximum recommended distance: ${maxDist} km.`
    );
  }

  // Check if duration is feasible
  const speed = AVG_SPEEDS[vehicleType] ?? 50;
  const hoursPerDay = MAX_HOURS_PER_DAY[vehicleType] ?? 8;
  const maxDailyDistance = speed * hoursPerDay;
  const minDaysNeeded = Math.ceil(distanceKm / maxDailyDistance);

  if (duration < minDaysNeeded) {
    errors.push(
      `${duration} day(s) is not enough for ${distanceKm.toFixed(0)} km by ${vehicleType}. You need at least ${minDaysNeeded} day(s) of travel.`
    );
  }

  // Warn for very short flights
  if (vehicleType === "plane" && distanceKm < 200) {
    warnings.push("Flying such a short distance is unusual — consider train or bus instead.");
  }

  // Warn if group size is large for walking/bicycle
  if ((vehicleType === "walking" || vehicleType === "bicycle") && groupSize > 10) {
    warnings.push(`A group of ${groupSize} ${vehicleType === "walking" ? "walking" : "cycling"} may be impractical.`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Get the available transport modes for a given distance.
 */
export function getFeasibleModes(distanceKm: number): string[] {
  return Object.entries(MAX_DISTANCE)
    .filter(([_, max]) => distanceKm <= max)
    .map(([mode]) => mode);
}

/**
 * Estimate travel time in hours for a segment.
 */
export function estimateTravelTime(distanceKm: number, vehicleType: string): number {
  const speed = AVG_SPEEDS[vehicleType] ?? 50;
  return Math.round((distanceKm / speed) * 10) / 10;
}
