import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/lib/openTripMap";
import type { RouteStop } from "@/lib/routePlanner";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const stopIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ stops }: { stops: RouteStop[] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length >= 2) {
      const bounds = L.latLngBounds(stops.map(s => [s.city.lat, s.city.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (stops.length === 1) {
      map.setView([stops[0].city.lat, stops[0].city.lon], 10);
    }
  }, [stops, map]);
  return null;
}

interface Props {
  center: [number, number];
  stops: RouteStop[];
  places: Place[];
}

const RouteMap = ({ center, stops, places }: Props) => {
  // Build polyline through all stops
  const routeLine: [number, number][] = stops.map(s => [s.city.lat, s.city.lon]);

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater stops={stops} />

      {/* Multi-stop polyline */}
      {routeLine.length >= 2 && (
        <Polyline
          positions={routeLine}
          pathOptions={{ color: "#0d9488", weight: 3, dashArray: "8 6", opacity: 0.8 }}
        />
      )}

      {/* Stop markers */}
      {stops.map((stop, i) => {
        const isFirst = i === 0;
        const isLast = i === stops.length - 1;
        const icon = isFirst ? startIcon : isLast ? endIcon : stopIcon;

        return (
          <Marker key={stop.city.name + i} position={[stop.city.lat, stop.city.lon]} icon={icon}>
            <Popup>
              <strong>Stop {i + 1}: {stop.city.name}</strong>
              <br />
              <span style={{ fontSize: "0.75rem" }}>
                {isFirst ? "Start" : isLast ? "Destination" : `Day ${stop.day}`}
                {stop.distanceFromPrev > 0 && ` · ${stop.distanceFromPrev} km from prev`}
              </span>
            </Popup>
          </Marker>
        );
      })}

      {/* POI markers */}
      {places.map((p) => (
        <Marker key={p.xid} position={[p.point.lat, p.point.lon]}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            <span style={{ fontSize: "0.75rem" }}>{p.kinds.split(",").slice(0, 3).join(", ")}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RouteMap;
