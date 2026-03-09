import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, MapPin } from "lucide-react";
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
        <div className="w-12 h-1 bg-primary mb-4" />
        <h1 className="font-heading text-4xl font-black text-foreground mb-4">Manage Itineraries</h1>
        <p className="text-muted-foreground mb-8">View and manage your saved travel itineraries.</p>

        {selected.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="mb-4 bg-destructive text-destructive-foreground px-6 py-2 font-heading font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete Selected ({selected.size})
          </button>
        )}

        {itineraries.length === 0 ? (
          <div className="bg-secondary p-12 rounded-lg text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">No saved itineraries yet. Go to Find Itineraries to create one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {itineraries.map((it, i) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-secondary p-4 rounded-lg border border-border"
              >
                <input
                  type="checkbox"
                  checked={selected.has(it.id)}
                  onChange={() => toggleSelect(it.id)}
                  className="h-4 w-4 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground">
                    {it.startCity} → {it.endCity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {it.distance} km · {VEHICLE_LABELS[it.vehicleType]} · {it.emissions} kg CO₂ · {it.groupSize} person(s) · {it.duration} day(s)
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(it.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(it.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
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
