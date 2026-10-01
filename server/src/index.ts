import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { carbonRoutes } from './routes/carbon.js';
import { itineraryRoutes } from './routes/itinerary.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EcoPath API is running' });
});

// API Routes
app.use('/api/carbon', carbonRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🌱 EcoPath API running on http://localhost:${PORT}`);
  console.log(`📡 Frontend configured: ${FRONTEND_URL}`);
});

export default app;
