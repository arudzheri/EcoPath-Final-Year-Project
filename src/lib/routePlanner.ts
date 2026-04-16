/**
 * Multi-stop route planner.
 * Finds intermediate cities between start and end to build a realistic itinerary.
 */

import { UK_CITIES, type CityData } from "./cities";
import { haversineDistance } from "./emissions";
import { AVG_SPEEDS, estimateTravelTime } from "./validation";

export interface RouteStop {
  city: CityData;
  distanceFromPrev: number; // km from previous stop
  cumulativeDistance: number;
  travelTimeFromPrev: number; // hours from previous stop
  day: number; // assigned day (1-based)
}

export interface PlannedRoute {
  stops: RouteStop[];
  totalDistance: number;
  totalTravelTime: number;
  days: DayPlan[];
}

export interface DayPlan {
  day: number;
  stops: RouteStop[];
  totalDistance: number;
  totalTravelTime: number;
}

/**
 * Find intermediate stops between start and end cities.
 * Uses a greedy approach: find cities that are roughly along the route
 * (within a corridor) and order them by distance from start.
 */
export function planRoute(
  startCity: string,
  endCity: string,
  vehicleType: string,
  duration: number,
): PlannedRoute {
  const start = UK_CITIES.find(c => c.name === startCity)!;
  const end = UK_CITIES.find(c => c.name === endCity)!;
  const directDist = haversineDistance(start.lat, start.lon, end.lat, end.lon);

  // Find cities within a corridor between start and end
  const corridorWidth = Math.max(directDist * 0.35, 30); // corridor is 35% of direct distance, min 30km
  const candidates = UK_CITIES.filter(c => {
    if (c.name === startCity || c.name === endCity) return false;
    const distToStart = haversineDistance(start.lat, start.lon, c.lat, c.lon);
    const distToEnd = haversineDistance(end.lat, end.lon, c.lat, c.lon);
    // Must be roughly between start and end (not behind either)
    if (distToStart > directDist * 1.1 || distToEnd > directDist * 1.1) return false;
    // Must be within the corridor (perpendicular distance approximation)
    const semiPerimeter = (distToStart + distToEnd + directDist) / 2;
    const area = Math.sqrt(
      Math.max(0, semiPerimeter * (semiPerimeter - distToStart) * (semiPerimeter - distToEnd) * (semiPerimeter - directDist))
    );
    const perpDist = (2 * area) / directDist;
    return perpDist < corridorWidth;
  });

  // Sort candidates by distance from start
  const sorted = candidates
    .map(c => ({ city: c, distFromStart: haversineDistance(start.lat, start.lon, c.lat, c.lon) }))
    .sort((a, b) => a.distFromStart - b.distFromStart);

  // Select stops: pick cities that are well-spaced
  const speed = AVG_SPEEDS[vehicleType] ?? 50;
  const maxHoursPerDay = vehicleType === "walking" ? 8 : vehicleType === "bicycle" ? 7 : 8;
  const maxDailyDist = speed * maxHoursPerDay;
  // Ideal segment length: distribute evenly across days
  const idealSegment = directDist / Math.max(duration, 1);
  const minSegment = Math.min(idealSegment * 0.4, maxDailyDist * 0.3);

  const selectedStops: CityData[] = [start];
  let lastCity = start;

  for (const cand of sorted) {
    const distFromLast = haversineDistance(lastCity.lat, lastCity.lon, cand.city.lat, cand.city.lon);
    const distToEnd = haversineDistance(cand.city.lat, cand.city.lon, end.lat, end.lon);

    // Skip if too close to last stop
    if (distFromLast < minSegment) continue;
    // Skip if too close to end (we'll add end separately)
    if (distToEnd < minSegment) continue;

    selectedStops.push(cand.city);
    lastCity = cand.city;
  }

  selectedStops.push(end);

  // Build route stops with distances
  let cumulative = 0;
  const routeStops: RouteStop[] = selectedStops.map((city, i) => {
    const prev = i > 0 ? selectedStops[i - 1] : city;
    const dist = i > 0 ? haversineDistance(prev.lat, prev.lon, city.lat, city.lon) : 0;
    cumulative += dist;
    const travelTime = i > 0 ? estimateTravelTime(dist, vehicleType) : 0;
    return { city, distanceFromPrev: Math.round(dist * 10) / 10, cumulativeDistance: Math.round(cumulative * 10) / 10, travelTimeFromPrev: travelTime, day: 1 };
  });

  // Assign stops to days
  const totalDist = cumulative;
  const targetPerDay = totalDist / Math.max(duration, 1);

  let currentDay = 1;
  let dayDist = 0;

  for (let i = 0; i < routeStops.length; i++) {
    routeStops[i].day = currentDay;
    dayDist += routeStops[i].distanceFromPrev;
    // Move to next day if we've exceeded daily target (but not for the last stop)
    if (dayDist >= targetPerDay && currentDay < duration && i < routeStops.length - 1) {
      currentDay++;
      dayDist = 0;
    }
  }

  // Build day plans
  const dayMap = new Map<number, RouteStop[]>();
  for (const stop of routeStops) {
    if (!dayMap.has(stop.day)) dayMap.set(stop.day, []);
    dayMap.get(stop.day)!.push(stop);
  }

  const days: DayPlan[] = [];
  for (let d = 1; d <= duration; d++) {
    const stops = dayMap.get(d) || [];
    days.push({
      day: d,
      stops,
      totalDistance: Math.round(stops.reduce((s, st) => s + st.distanceFromPrev, 0) * 10) / 10,
      totalTravelTime: Math.round(stops.reduce((s, st) => s + st.travelTimeFromPrev, 0) * 10) / 10,
    });
  }

  return {
    stops: routeStops,
    totalDistance: Math.round(cumulative * 10) / 10,
    totalTravelTime: Math.round(routeStops.reduce((s, st) => s + st.travelTimeFromPrev, 0) * 10) / 10,
    days,
  };
}
