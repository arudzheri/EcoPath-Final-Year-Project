# EcoPath Backend API

Node.js + Express backend for the EcoPath sustainability itinerary planner.

## Features

- 🌱 Carbon emission calculations using DEFRA 2024 factors
- 📍 Distance calculations between coordinates (Haversine formula)
- 🗺️ Multi-waypoint itinerary generation
- 🔄 Multiple transport mode comparison
- ✅ Input validation with Zod

## Getting Started

### Installation

```bash
cd server
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### Development

```bash
npm run dev
```

The API will start on `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```http
GET /health
```

### Carbon Calculations

#### Calculate emissions between two points

```http
POST /api/carbon/calculate
Content-Type: application/json

{
  "origin": {
    "lat": 51.5074,
    "lon": -0.1278,
    "name": "London"
  },
  "destination": {
    "lat": 48.8566,
    "lon": 2.3522,
    "name": "Paris"
  },
  "transportModes": ["car", "bus", "rail"]
}
```

**Response:**

```json
{
  "origin": { "lat": 51.5074, "lon": -0.1278, "name": "London" },
  "destination": { "lat": 48.8566, "lon": 2.3522, "name": "Paris" },
  "distance": 343.5,
  "options": [
    { "type": "car", "distance": 343.5, "emissions": 65.95 },
    { "type": "bus", "distance": 343.5, "emissions": 30.57 },
    { "type": "rail", "distance": 343.5, "emissions": 14.08 }
  ],
  "lowestEmission": { "type": "rail", "distance": 343.5, "emissions": 14.08 }
}
```

#### Get DEFRA emission factors

```http
GET /api/carbon/factors
```

**Response:**

```json
{
  "factors": {
    "car": 0.192,
    "bus": 0.089,
    "rail": 0.041,
    "cycling": 0.0,
    "walking": 0.0
  },
  "unit": "kg CO2e per km",
  "source": "DEFRA 2024 Emission Factors"
}
```

### Itinerary

#### Generate itinerary with multiple waypoints

```http
POST /api/itinerary/generate
Content-Type: application/json

{
  "startLocation": {
    "lat": 51.5074,
    "lon": -0.1278,
    "name": "London"
  },
  "waypoints": [
    {
      "lat": 51.7520,
      "lon": -0.0855,
      "name": "Tower Bridge"
    },
    {
      "lat": 51.4969,
      "lon": -0.1144,
      "name": "Greenwich"
    }
  ],
  "preferences": {
    "transportModes": ["bus", "rail"]
  }
}
```

**Response:**

```json
{
  "id": "itinerary-1697123456789",
  "startLocation": { "lat": 51.5074, "lon": -0.1278, "name": "London" },
  "items": [
    { "id": "item-0", "name": "Tower Bridge", "location": { "lat": 51.7520, "lon": -0.0855, "name": "Tower Bridge" }, "type": "waypoint" },
    { "id": "item-1", "name": "Greenwich", "location": { "lat": 51.4969, "lon": -0.1144, "name": "Greenwich" }, "type": "waypoint" }
  ],
  "routes": [
    { "type": "rail", "distance": 29.2, "emissions": 1.20 },
    { "type": "rail", "distance": 10.5, "emissions": 0.43 }
  ],
  "totalEmissions": 1.63,
  "totalDistance": 39.7
}
```

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── middleware/
│   │   └── errorHandler.ts   # Global error handling
│   ├── routes/
│   │   ├── carbon.ts         # Carbon calculation endpoints
│   │   └── itinerary.ts      # Itinerary endpoints
│   ├── utils/
│   │   ├── carbonCalculator.ts  # Emission calculations
│   │   └── validators.ts     # Input validation schemas
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **axios**: HTTP client (for future API integrations)
- **zod**: Schema validation

## DEFRA Emission Factors

The backend uses DEFRA 2024 emission factors:

- **Car**: 0.192 kg CO2e/km
- **Bus**: 0.089 kg CO2e/km
- **Rail**: 0.041 kg CO2e/km
- **Cycling**: 0.0 kg CO2e/km
- **Walking**: 0.0 kg CO2e/km

**Note:** These are average values and do not account for real-time variables like traffic, vehicle efficiency, or energy mix.

## Future Enhancements

- [ ] Database integration for saving itineraries
- [ ] OpenTripMap API integration for real route planning
- [ ] User authentication and profile management
- [ ] Caching for frequently calculated routes
- [ ] Real-time traffic and congestion data
- [ ] GraphQL API option
- [ ] Unit and integration tests

## License

Academic use - University of Westminster Final Year Project
