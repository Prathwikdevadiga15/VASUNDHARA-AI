"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import type { Report } from "@/types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Picker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

// Pilot view: Western Ghats, Karnataka. Respect OSM tile usage policy in production (use MapTiler or self-host).
export default function ReportMap({ reports, picked, onPick }: { reports: Report[]; picked: [number, number] | null; onPick: (lat: number, lng: number) => void }) {
  return (
    <MapContainer center={[13.0, 75.2]} zoom={8} className="h-96 w-full rounded-xl">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Picker onPick={onPick} />
      {reports.map((r) => (
        <Marker key={r.id} position={[r.latitude, r.longitude]}><Popup>{r.category}: {r.status}</Popup></Marker>
      ))}
      {picked && <Marker position={picked} />}
    </MapContainer>
  );
}
