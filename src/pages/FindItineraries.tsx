import { useState } from "react";
import { motion } from "framer-motion";
import { getCityData, CITY_NAMES, getRegions, getCitiesByRegion } from "@/lib/cities";
import { haversineDistance, compareAllModes, VEHICLE_LABELS, getSustainabilityGrade, EMISSION_FACTORS } from "@/lib/emissions";
import { validateItinerary, getFeasibleModes } from "@/lib/validation";
import { planRoute, type PlannedRoute } from "@/lib/routePlanner";
import { getPlacesRadius, type Place } from "@/lib/openTripMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, Loader2, Save, Leaf, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RouteMap from "@/components/RouteMap";
import ItineraryTimeline from "@/components/ItineraryTimeline";

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
  grade: string;
  stops: string[];
}

const FindItineraries = () => {
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [duration, setDuration] = useState(1);
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [emissionsData, setEmissionsData] = useState<ReturnType<typeof compareAllModes> | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([52.5, -1.5]);

  // Compute direct distance for validation hints
  const directDistance = startCity && endCity && startCity !== endCity
    ? haversineDistance(
        getCityData(startCity).lat, getCityData(startCity).lon,
        getCityData(endCity).lat, getCityData(endCity).lon
      )
    : 0;

  const feasibleModes = directDistance > 0 ? getFeasibleModes(directDistance) : VEHICLE_TYPES;

  const handleFind = async () => {
    setErrors([]);
    setWarnings([]);

    if (!startCity || !endCity || !vehicleType) {
      setErrors(["Please fill in all fields."]);
      return;
    }
    if (startCity === endCity) {
      setErrors(["Start and end cities must be different."]);
      return;
    }

    // Validate feasibility
    const validation = validateItinerary(directDistance, vehicleType, duration, groupSize);
    if (!validation.valid) {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      return;
    }
    setWarnings(validation.warnings);

    setLoading(true);
    try {
      // Plan multi-stop route
      const planned = planRoute(startCity, endCity, vehicleType, duration);
      setRoute(planned);

      // Emissions based on TOTAL route distance (stop-to-stop sum)
      setEmissionsData(compareAllModes(planned.totalDistance, groupSize));

      // Map center
      const allLats = planned.stops.map(s => s.city.lat);
      const allLons = planned.stops.map(s => s.city.lon);
      setMapCenter([
        (Math.min(...allLats) + Math.max(...allLats)) / 2,
        (Math.min(...allLons) + Math.max(...allLons)) / 2,
      ]);

      // POIs at destination
      const dest = getCityData(endCity);
      const pois = await getPlacesRadius(dest.lat, dest.lon, 10000, 15);
      setPlaces(pois.filter(p => p.name));
    } catch (e: any) {
      setErrors([e.message || "Something went wrong"]);
    } finally {
      setLoading(false);
    }
  };

  const selectedEmission = emissionsData?.find(e => e.mode === vehicleType);
  const perPersonEmission = selectedEmission ? selectedEmission.emissions / Math.max(groupSize, 1) : 0;
  const gradeInfo = getSustainabilityGrade(perPersonEmission);

  const handleSave = () => {
    if (!route || !emissionsData || !vehicleType) return;
    const itinerary: SavedItinerary = {
      id: Date.now().toString(),
      startCity,
      endCity,
      distance: route.totalDistance,
      vehicleType,
      emissions: selectedEmission?.emissions ?? 0,
      groupSize,
      duration,
      date: new Date().toISOString(),
      grade: gradeInfo.grade,
      stops: route.stops.map(s => s.city.name),
    };
    const saved = JSON.parse(localStorage.getItem("ecopath_itineraries") || "[]");
    saved.push(itinerary);
    localStorage.setItem("ecopath_itineraries", JSON.stringify(saved));
    alert("Itinerary saved!");
  };

  const CHART_COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1"];

  // Group cities by region for the select dropdown
  const regions = getRegions();

  return (
    <div className="pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Leaf className="h-4 w-4" /> Trip Planner
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Find Itineraries</h1>
          <p className="text-muted-foreground max-w-2xl">
            Plan a regional UK trip with intermediate stops. We'll validate feasibility, calculate stop-to-stop emissions, and build a day-by-day itinerary.
          </p>
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 md:p-8 mb-10">
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-body">Start Location</label>
              <select value={startCity} onChange={(e) => setStartCity(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition">
                <option value="">Select a city…</option>
                {regions.map(region => (
                  <optgroup key={region} label={region}>
                    {getCitiesByRegion(region).map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-body">End Location</label>
              <select value={endCity} onChange={(e) => setEndCity(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition">
                <option value="">Select a city…</option>
                {regions.map(region => (
                  <optgroup key={region} label={region}>
                    {getCitiesByRegion(region).map(c => (
                      <option key={c.name} value={c.name} disabled={c.name === startCity}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Distance hint */}
          {directDistance > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-body">
              <Info className="h-3.5 w-3.5" />
              Direct distance: {directDistance} km. Feasible modes: {feasibleModes.map(m => VEHICLE_LABELS[m]).join(", ")}.
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-body">Group Size</label>
              <input type="number" min={1} max={50} value={groupSize} onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-body">Duration (days)</label>
              <input type="number" min={1} max={30} value={duration} onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-body">Transport Mode</label>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition">
                <option value="">Select mode…</option>
                {VEHICLE_TYPES.map(v => (
                  <option key={v} value={v} disabled={directDistance > 0 && !feasibleModes.includes(v)}>
                    {VEHICLE_LABELS[v]} {directDistance > 0 && !feasibleModes.includes(v) ? "(not feasible)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {warnings.length > 0 && errors.length === 0 && (
            <Alert className="mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <ul className="list-disc pl-4 space-y-1">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <button onClick={handleFind} disabled={loading} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-heading font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Plan Route
          </button>
        </motion.div>

        {/* Results */}
        {route && emissionsData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Summary + Grade */}
            <div className="grid md:grid-cols-[1fr_auto] gap-6 bg-card border border-border rounded-xl p-6 md:p-8">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-3">Route Summary</h2>
                <div className="space-y-1.5 text-sm font-body text-muted-foreground">
                  <p>
                    <span className="text-foreground font-medium">{startCity}</span>
                    {route.stops.length > 2 && (
                      <> → {route.stops.slice(1, -1).map(s => s.city.name).join(" → ")} </>
                    )}
                    → <span className="text-foreground font-medium">{endCity}</span>
                  </p>
                  <p>Total Distance: <span className="text-foreground font-medium">{route.totalDistance} km</span> (stop-to-stop)</p>
                  <p>Stops: <span className="text-foreground font-medium">{route.stops.length}</span></p>
                  <p>Transport: <span className="text-foreground font-medium">{VEHICLE_LABELS[vehicleType]}</span></p>
                  <p>Total CO₂: <span className="text-primary font-semibold">{selectedEmission?.emissions} kg</span> for {groupSize} person(s)</p>
                  <p>Per person: <span className="text-foreground font-medium">{perPersonEmission.toFixed(1)} kg</span></p>
                  <p>Duration: <span className="text-foreground font-medium">{duration} day(s)</span></p>
                  <p>Travel Time: <span className="text-foreground font-medium">{route.totalTravelTime} hrs</span></p>
                </div>
                <button onClick={handleSave} className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-body font-medium text-sm hover:brightness-110 transition-all">
                  <Save className="h-4 w-4" /> Save Itinerary
                </button>
              </div>
              {/* Sustainability Grade */}
              <div className="flex flex-col items-center justify-center text-center min-w-[140px]">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Eco Rating</p>
                <div className={`grade-badge ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </div>
                <p className="text-xs text-muted-foreground mt-2 max-w-[140px]">{gradeInfo.label}</p>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Day-by-Day Itinerary</h2>
              <ItineraryTimeline route={route} vehicleType={vehicleType} />
            </div>

            {/* Emissions Chart */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">CO₂ Emissions Comparison (kg)</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emissionsData}>
                    <XAxis dataKey="label" tick={{ fontFamily: "Space Grotesk", fontSize: 11 }} />
                    <YAxis tick={{ fontFamily: "DM Sans", fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", fontFamily: "DM Sans", fontSize: "0.8rem" }} />
                    <Bar dataKey="emissions" radius={[6, 6, 0, 0]}>
                      {emissionsData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.mode === vehicleType ? "#0d9488" : CHART_COLORS[i % CHART_COLORS.length]}
                          opacity={entry.mode === vehicleType ? 1 : 0.5}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Map */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Route Map & Points of Interest</h2>
              <div className="h-[420px] rounded-lg overflow-hidden border border-border">
                <RouteMap route={route} />
              </div>
              {places.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Nearby Attractions at {endCity}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {places.map(p => (
                      <div key={p.xid} className="bg-background p-3 rounded-lg border border-border">
                        <p className="font-heading text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.kinds.split(",").slice(0, 2).join(", ")}</p>
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
