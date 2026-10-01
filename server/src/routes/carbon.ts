import { Router, Request, Response, NextFunction } from 'express';
import {
  calculateEmissions,
  calculateEmissionsMultiMode,
  calculateDistance,
} from '../utils/carbonCalculator.js';
import { CarbonCalculationSchema } from '../utils/validators.js';
import { CarbonCalculationResponse } from '../types/index.js';

export const carbonRoutes = Router();

/**
 * POST /api/carbon/calculate
 * Calculate carbon emissions between two points
 */
carbonRoutes.post('/calculate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = CarbonCalculationSchema.parse(req.body);
    const { origin, destination, transportModes } = validated;

    // Calculate distance using haversine formula
    const distance = calculateDistance(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon
    );

    // Calculate emissions for requested modes
    const modes = transportModes || ['car', 'bus', 'rail', 'cycling', 'walking'];
    const options = calculateEmissionsMultiMode(distance, modes).map((calc) => ({
      type: calc.transportMode as any,
      distance,
      emissions: calc.emissions,
    }));

    // Find lowest emission option
    const lowestEmission = options.reduce((prev, current) =>
      prev.emissions < current.emissions ? prev : current
    );

    const response: CarbonCalculationResponse = {
      origin,
      destination,
      options,
      lowestEmission,
      distance,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/carbon/factors
 * Get DEFRA emission factors
 */
carbonRoutes.get('/factors', (req: Request, res: Response) => {
  const factors = {
    car: 0.192,
    bus: 0.089,
    rail: 0.041,
    cycling: 0.0,
    walking: 0.0,
  };
  res.json({
    factors,
    unit: 'kg CO2e per km',
    source: 'DEFRA 2024 Emission Factors',
  });
});
