import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoName, Place } from "@/lib/openTripMap";

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

function MapUpdater({ center, bounds }: { center: [number, number]; bounds?: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 6);
    }
  }, [center, bounds, map]);
  return null;
}

interface Props {
  center: [number, number];
  startGeo: GeoName | null;
  endGeo: GeoName | null;
  startCity: string;
  endCity: string;
  places: Place[];
}

const RouteMap = ({ center, startGeo, endGeo, startCity, endCity, places }: Props) => {
  const routeLine: [number, number][] = startGeo && endGeo
    ? [[startGeo.lat, startGeo.lon], [endGeo.lat, endGeo.lon]]
    : [];

  const bounds: L.LatLngBoundsExpression | undefined = startGeo && endGeo
    ? [[startGeo.lat, startGeo.lon], [endGeo.lat, endGeo.lon]]
    : undefined;

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} bounds={bounds} />

      {routeLine.length === 2 && (
        <Polyline
          positions={routeLine}
          pathOptions={{ color: "#0d9488", weight: 3, dashArray: "8 6", opacity: 0.8 }}
        />
      )}

      {startGeo && (
        <Marker position={[startGeo.lat, startGeo.lon]} icon={startIcon}>
          <Popup><strong>{startCity}</strong> (Start)</Popup>
        </Marker>
      )}
      {endGeo && (
        <Marker position={[endGeo.lat, endGeo.lon]} icon={endIcon}>
          <Popup><strong>{endCity}</strong> (Destination)</Popup>
        </Marker>
      )}
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
