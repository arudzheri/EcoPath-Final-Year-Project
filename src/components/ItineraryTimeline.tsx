import { MapPin, Clock, Route, Calendar } from "lucide-react";
import { VEHICLE_LABELS } from "@/lib/emissions";
import type { PlannedRoute } from "@/lib/routePlanner";

interface Props {
  route: PlannedRoute;
  vehicleType: string;
}

const ItineraryTimeline = ({ route, vehicleType }: Props) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap gap-4 text-sm font-body">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Route className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">{route.totalDistance} km</span> total
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">{route.totalTravelTime} hrs</span> travel
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">{route.stops.length}</span> stops
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">{route.days.length}</span> day(s)
        </div>
      </div>

      {/* Day-by-day */}
      {route.days.map((day) => (
        <div key={day.day} className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-bold text-foreground text-sm">
              Day {day.day}
            </h4>
            <span className="text-xs text-muted-foreground font-body">
              {day.totalDistance} km · {day.totalTravelTime} hrs by {VEHICLE_LABELS[vehicleType]}
            </span>
          </div>

          <div className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />

            {day.stops.map((stop, i) => {
              const isFirst = stop.cumulativeDistance === 0;
              const isLast = i === day.stops.length - 1 && day.day === route.days.length;

              return (
                <div key={stop.city.name + i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 ${
                      isFirst
                        ? "bg-primary border-primary text-primary-foreground"
                        : isLast
                        ? "bg-destructive border-destructive text-white"
                        : "bg-card border-primary text-primary"
                    }`}
                  >
                    {route.stops.indexOf(stop) + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm">
                      {stop.city.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {stop.city.region}
                      </span>
                    </p>
                    {stop.distanceFromPrev > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ← {stop.distanceFromPrev} km · ~{stop.travelTimeFromPrev} hrs from previous stop
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;
