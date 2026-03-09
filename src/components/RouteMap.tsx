import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 8);
  }, [center, map]);
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
  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      {startGeo && (
        <Marker position={[startGeo.lat, startGeo.lon]}>
          <Popup><strong>{startCity}</strong> (Start)</Popup>
        </Marker>
      )}
      {endGeo && (
        <Marker position={[endGeo.lat, endGeo.lon]}>
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
