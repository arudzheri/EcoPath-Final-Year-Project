import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { PlannedRoute } from "@/lib/routePlanner";

interface Props {
  route: PlannedRoute;
}

const RouteMap = ({ route }: Props) => {
  const start = route.stops[0].city;
  const end = route.stops[route.stops.length - 1].city;

  const startIcon = L.icon({
    iconUrl: "/start-marker.png",
    iconSize: [32, 32],
  });

  const endIcon = L.icon({
    iconUrl: "/end-marker.png",
    iconSize: [32, 32],
  });

  const polylinePositions: [number, number][] = route.stops.map((stop) => [
    stop.city.lat,
    stop.city.lon,
  ]);

  return (
    <div className="w-full h-[400px] rounded-lg border border-gray-300 shadow overflow-hidden">
      <MapContainer
        center={[start.lat, start.lon]}
        zoom={6}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start marker */}
        <Marker position={[start.lat, start.lon]} icon={startIcon} />

        {/* End marker */}
        <Marker position={[end.lat, end.lon]} icon={endIcon} />

        {/* Route polyline */}
        <Polyline positions={polylinePositions} color="#2563eb" weight={4} />
      </MapContainer>
    </div>
  );
};

export default RouteMap;
