import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, MapPin, Folder } from "lucide-react";
import { VEHICLE_LABELS } from "@/lib/emissions";

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
  grade?: string;
}

const ManageItineraries = () => {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ecopath_itineraries") || "[]");
    setItineraries(saved);
  }, []);

  const handleDelete = (id: string) => {
    const updated = itineraries.filter((it) => it.id !== id);
    setItineraries(updated);
    localStorage.setItem("ecopath_itineraries", JSON.stringify(updated));
    selected.delete(id);
    setSelected(new Set(selected));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleDeleteSelected = () => {
    const updated = itineraries.filter((it) => !selected.has(it.id));
    setItineraries(updated);
    localStorage.setItem("ecopath_itineraries", JSON.stringify(updated));
    setSelected(new Set());
  };

  return (
    <div className="pt-20 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
          <Folder className="h-4 w-4" /> Saved Trips
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Manage Itineraries</h1>
        <p className="text-muted-foreground mb-8">View, compare, and manage your saved travel plans.</p>

        {selected.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="mb-4 bg-destructive text-destructive-foreground px-5 py-2 rounded-lg font-body font-medium text-sm hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete Selected ({selected.size})
          </button>
        )}

        {itineraries.length === 0 ? (
          <div className="bg-card border border-border p-16 rounded-xl text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body">No saved itineraries yet.</p>
            <p className="text-muted-foreground font-body text-sm mt-1">Go to Find Itineraries to create one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {itineraries.map((it, i) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 bg-card p-5 rounded-xl border border-border hover:shadow-sm transition-shadow"
              >
                <input
                  type="checkbox"
                  checked={selected.has(it.id)}
                  onChange={() => toggleSelect(it.id)}
                  className="h-4 w-4 accent-primary rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-foreground">
                    {it.startCity} → {it.endCity}
                    {it.grade && (
                      <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full grade-${it.grade}`}>
                        {it.grade}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {it.distance} km · {VEHICLE_LABELS[it.vehicleType]} · {it.emissions} kg CO₂ · {it.groupSize} person(s) · {it.duration} day(s)
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(it.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(it.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageItineraries;
