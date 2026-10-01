import { z } from 'zod';

export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  name: z.string().optional(),
});

export const CarbonCalculationSchema = z.object({
  origin: LocationSchema,
  destination: LocationSchema,
  transportModes: z.array(z.string()).optional(),
});

export const ItineraryRequestSchema = z.object({
  startLocation: LocationSchema,
  waypoints: z.array(LocationSchema),
  preferences: z.object({
    transportModes: z.array(z.string()).optional(),
    radius: z.number().optional(),
  }).optional(),
});

export type LocationInput = z.infer<typeof LocationSchema>;
export type CarbonCalculationInput = z.infer<typeof CarbonCalculationSchema>;
export type ItineraryRequestInput = z.infer<typeof ItineraryRequestSchema>;
