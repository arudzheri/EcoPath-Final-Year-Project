import { useState } from "react";
import { motion } from "framer-motion";
import { getCityCoords, getPlacesRadius, type GeoName, type Place } from "@/lib/openTripMap";
import { haversineDistance, compareAllModes, VEHICLE_LABELS } from "@/lib/emissions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, Loader2 } from "lucide-react";
import RouteMap from "@/components/RouteMap";

const CITIES = ["London", "Paris", "Berlin", "Rome", "Madrid", "Amsterdam", "Vienna", "Prague", "Barcelona", "Lisbon", "Dublin", "Brussels", "Warsaw", "Budapest", "Athens"];
const VEHICLE_TYPES = Object.keys(VEHICLE_LABELS);


interface SavedItinerary {
  id: string;
  startCity: string;
  endCity: string;
  distance: number;
  vehicleType: string;
  emissions: number;
  groupSize: number;
  duration: number;
  date: string;
}

const FindItineraries = () => {
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [duration, setDuration] = useState(1);
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [startGeo, setStartGeo] = useState<GeoName | null>(null);
  const [endGeo, setEndGeo] = useState<GeoName | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [emissionsData, setEmissionsData] = useState<ReturnType<typeof compareAllModes> | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);

  const handleFind = async () => {
    if (!startCity || !endCity || !vehicleType) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const sGeo = getCityCoords(startCity);
      const eGeo = getCityCoords(endCity);
      setStartGeo(sGeo);
      setEndGeo(eGeo);

      const dist = haversineDistance(sGeo.lat, sGeo.lon, eGeo.lat, eGeo.lon);
      setDistance(dist);

      const emissions = compareAllModes(dist, groupSize);
      setEmissionsData(emissions);

      // Center map between the two cities
      const cLat = (sGeo.lat + eGeo.lat) / 2;
      const cLon = (sGeo.lon + eGeo.lon) / 2;
      setMapCenter([cLat, cLon]);

      // Fetch POIs near destination
      const pois = await getPlacesRadius(eGeo.lat, eGeo.lon, 10000, 15);
      setPlaces(pois.filter(p => p.name));
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!distance || !emissionsData || !vehicleType) return;
    const selectedEmission = emissionsData.find(e => e.mode === vehicleType);
    const itinerary: SavedItinerary = {
      id: Date.now().toString(),
      startCity,
      endCity,
      distance,
      vehicleType,
      emissions: selectedEmission?.emissions ?? 0,
      groupSize,
      duration,
      date: new Date().toISOString(),
    };
    const saved = JSON.parse(localStorage.getItem("ecopath_itineraries") || "[]");
    saved.push(itinerary);
    localStorage.setItem("ecopath_itineraries", JSON.stringify(saved));
    alert("Itinerary saved!");
  };

  const CHART_COLORS = ["#6b8e23", "#8fbc8f", "#556b2f", "#9acd32", "#228b22", "#32cd32"];

  return (
    <div className="pt-20 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-10">
          {/* Left panel */}
          <div>
            <div className="w-12 h-1 bg-primary mb-4" />
            <h1 className="font-heading text-4xl font-black text-foreground mb-4">Find Itineraries</h1>
            <p className="text-muted-foreground mb-8">
              This is an AI-driven recommendation system to suggest travel destinations with a focus on sustainability. 
              It calculates the carbon footprint of trips from the starting location to the destination and back.
            </p>
          </div>

          {/* Right panel - Form */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-bold text-foreground mb-1">Start location:</label>
                <select
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded font-body text-foreground"
                >
                  <option value="">--Select--</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-bold text-foreground mb-1">End location:</label>
                <select
                  value={endCity}
                  onChange={(e) => setEndCity(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded font-body text-foreground"
                >
                  <option value="">--Select--</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-bold text-foreground mb-1">Group size:</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded font-body text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-bold text-foreground mb-1">Duration (in days):</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded font-body text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading font-bold text-foreground mb-1">Vehicle type:</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded font-body text-foreground"
              >
                <option value="">--Select--</option>
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{VEHICLE_LABELS[v]}</option>)}
              </select>
            </div>

            {error && <p className="text-destructive font-body text-sm">{error}</p>}

            <button
              onClick={handleFind}
              disabled={loading}
              className="bg-primary text-primary-foreground px-10 py-4 font-heading font-bold text-lg tracking-wider hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              FIND
            </button>
          </motion.div>
        </div>

        {/* Results */}
        {distance !== null && emissionsData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-10">
            {/* Distance info */}
            <div className="bg-secondary p-6 rounded-lg">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Route Summary</h2>
              <p className="text-muted-foreground font-body">
                <strong>{startCity}</strong> → <strong>{endCity}</strong> — <strong>{distance} km</strong> (straight-line distance)
              </p>
              <p className="text-muted-foreground font-body mt-1">
                Selected transport: <strong>{VEHICLE_LABELS[vehicleType]}</strong> | 
                Estimated CO₂: <strong className="text-primary">{emissionsData.find(e => e.mode === vehicleType)?.emissions} kg</strong> for {groupSize} person(s)
              </p>
              <button
                onClick={handleSave}
                className="mt-4 bg-primary text-primary-foreground px-6 py-2 font-heading font-bold text-sm hover:brightness-110 transition-all"
              >
                Save Itinerary
              </button>
            </div>

            {/* Emissions chart */}
            <div className="bg-secondary p-6 rounded-lg">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">CO₂ Emissions Comparison (kg)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emissionsData}>
                    <XAxis dataKey="label" tick={{ fontFamily: "Montserrat", fontSize: 12 }} />
                    <YAxis tick={{ fontFamily: "Open Sans", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="emissions" radius={[4, 4, 0, 0]}>
                      {emissionsData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Map */}
            <div className="bg-secondary p-6 rounded-lg">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Map & Points of Interest</h2>
              <div className="h-[450px] rounded-lg overflow-hidden border border-border">
                <RouteMap
                  center={mapCenter}
                  startGeo={startGeo}
                  endGeo={endGeo}
                  startCity={startCity}
                  endCity={endCity}
                  places={places}
                />
              </div>
              {places.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-heading font-bold text-foreground mb-2">Nearby Points of Interest:</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {places.map(p => (
                      <div key={p.xid} className="bg-background p-3 rounded border border-border">
                        <p className="font-heading text-sm font-bold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.kinds.split(",").slice(0, 2).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FindItineraries;
