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
        <div className="flex items-center gap-1.5 text-gray-500">
          <Route className="h-4 w-4 text-primary" />
          <span className="text-gray-900 font-medium">{route.totalDistance} km</span> total
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-gray-900 font-medium">{route.totalTravelTime} hrs</span> travel
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-gray-900 font-medium">{route.stops.length}</span> stops
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-gray-900 font-medium">{route.days.length}</span> day(s)
        </div>
      </div>

      {/* Day-by-day */}
      {route.days.map((day) => (
        <div key={day.day} className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-bold text-gray-900 text-sm">Day {day.day}</h4>
            <span className="text-xs text-gray-500 font-body">
              {day.totalDistance} km · {day.totalTravelTime} hrs by {VEHICLE_LABELS[vehicleType]}
            </span>
          </div>

          <div className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-300" />

            {day.stops.map((stop, i) => {
              const isFirst = stop.cumulativeDistance === 0;
              const isLast = i === day.stops.length - 1 && day.day === route.days.length;

              return (
                <div key={stop.city.name + i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 ${
                      isFirst
                        ? "bg-primary border-primary text-white"
                        : isLast
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-gray-100 border-primary text-primary"
                    }`}
                  >
                    {route.stops.indexOf(stop) + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-gray-900 text-sm">
                      {stop.city.name}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        {stop.cumulativeDistance} km
                      </span>
                    </p>
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
