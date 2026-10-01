import { Router, Request, Response, NextFunction } from 'express';
import { ItineraryRequestSchema } from '../utils/validators.js';
import { calculateDistance, calculateEmissionsMultiMode } from '../utils/carbonCalculator.js';
import { ItineraryResponse } from '../types/index.js';

export const itineraryRoutes = Router();

/**
 * POST /api/itinerary/generate
 * Generate an itinerary with multiple waypoints
 */
itineraryRoutes.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ItineraryRequestSchema.parse(req.body);
    const { startLocation, waypoints, preferences } = validated;
    const modes = preferences?.transportModes || ['car', 'bus', 'rail', 'cycling', 'walking'];

    let totalDistance = 0;
    let totalEmissions = 0;
    const routes = [];

    // Calculate routes between consecutive waypoints
    const allLocations = [startLocation, ...waypoints];
    for (let i = 0; i < allLocations.length - 1; i++) {
      const from = allLocations[i];
      const to = allLocations[i + 1];

      const distance = calculateDistance(from.lat, from.lon, to.lat, to.lon);
      totalDistance += distance;

      // Calculate lowest emission option for this leg
      const emissions = calculateEmissionsMultiMode(distance, modes);
      const lowestEmission = emissions.reduce((prev, current) =>
        prev.emissions < current.emissions ? prev : current
      );

      totalEmissions += lowestEmission.emissions;
      routes.push({
        type: lowestEmission.transportMode,
        distance,
        emissions: lowestEmission.emissions,
      } as any);
    }

    const response: ItineraryResponse = {
      id: `itinerary-${Date.now()}`,
      startLocation,
      items: waypoints.map((wp, idx) => ({
        id: `item-${idx}`,
        name: wp.name || `Waypoint ${idx + 1}`,
        location: wp,
        type: 'waypoint',
      })),
      routes,
      totalEmissions,
      totalDistance,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/itinerary/:id
 * Retrieve a saved itinerary (placeholder for future database implementation)
 */
itineraryRoutes.get('/:id', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not yet implemented - database integration required' });
});
