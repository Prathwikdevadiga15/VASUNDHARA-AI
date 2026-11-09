"use client";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { FireHotspot, Report, WaterStation, WildlifeSighting } from "@/types";

// Leaflet marker default icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  reports?: Report[];
  hotspots?: FireHotspot[];
  waterStations?: WaterStation[];
  sightings?: WildlifeSighting[];
}

const PROTECTED_FORESTS = [
  { name: "Kudremukh National Park", lat: 13.2185, lng: 75.2575, status: "UNESCO Core Reserve", area: "600 sq km" },
  { name: "Bandipur Tiger Reserve", lat: 11.6664, lng: 76.6291, status: "Critical Tiger Corridor", area: "874 sq km" },
  { name: "Nagarhole Tiger Reserve", lat: 12.0314, lng: 76.1207, status: "Elephant-Tiger Buffer", area: "643 sq km" },
  { name: "Kali Tiger Reserve", lat: 15.0210, lng: 74.3512, status: "Moist Deciduous Core", area: "1300 sq km" },
  { name: "Agumbe Rainforest Reserve", lat: 13.5074, lng: 75.0931, status: "Rainforest Research Base", area: "120 sq km" },
  { name: "Bhadra Wildlife Sanctuary", lat: 13.6934, lng: 75.6358, status: "Shola Catchment Zone", area: "492 sq km" },
];

export default function LiveEcosystemMap({
  reports = [],
  hotspots = [],
  waterStations = [],
  sightings = [],
}: Props) {
  const [showForests, setShowForests] = useState(true);
  const [showFires, setShowFires] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showWildlife, setShowWildlife] = useState(true);
  const [showReports, setShowReports] = useState(true);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-forest/15 shadow-xl">
      {/* Layer Control Bar */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-wrap gap-2 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setShowForests(!showForests)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            showForests ? "bg-emerald text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          🌲 Forests ({PROTECTED_FORESTS.length})
        </button>
        <button
          onClick={() => setShowFires(!showFires)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            showFires ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          🔥 FIRMS Fires ({hotspots.length})
        </button>
        <button
          onClick={() => setShowWater(!showWater)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            showWater ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          💧 Rivers ({waterStations.length})
        </button>
        <button
          onClick={() => setShowWildlife(!showWildlife)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            showWildlife ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          🐾 Wildlife ({sightings.length})
        </button>
        <button
          onClick={() => setShowReports(!showReports)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            showReports ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          ⚠️ Incidents ({reports.length})
        </button>
      </div>

      <MapContainer
        center={[13.2, 75.4]}
        zoom={8}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Protected Forest Reserves */}
        {showForests &&
          PROTECTED_FORESTS.map((f, i) => (
            <Circle
              key={`forest-${i}`}
              center={[f.lat, f.lng]}
              radius={18000}
              pathOptions={{ color: "#10a56b", fillColor: "#10a56b", fillOpacity: 0.18, weight: 2 }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-semibold text-forest">{f.name}</div>
                  <div className="text-xs text-gray-600">{f.status}</div>
                  <div className="text-xs text-emerald font-medium">Area: {f.area}</div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* NASA FIRMS Hotspots */}
        {showFires &&
          hotspots.map((h, i) => (
            <CircleMarker
              key={`fire-${i}`}
              center={[h.latitude, h.longitude]}
              radius={9}
              pathOptions={{ color: "#ea580c", fillColor: "#f97316", fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-orange-700">🔥 Thermal Hotspot: {h.location_name}</div>
                  <div className="text-xs">Brightness Temp: {h.brightness_temperature_k} K</div>
                  <div className="text-xs">Radiative Power: {h.fire_radiative_power_mw} MW</div>
                  <div className="text-xs font-semibold text-red-600">Status: {h.status}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* River Water Monitoring Stations */}
        {showWater &&
          waterStations.map((w, i) => (
            <CircleMarker
              key={`water-${i}`}
              center={[w.latitude, w.longitude]}
              radius={8}
              pathOptions={{
                color: w.status === "anomaly_detected" ? "#dc2626" : "#2563eb",
                fillColor: w.status === "anomaly_detected" ? "#ef4444" : "#60a5fa",
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-blue-800">💧 {w.basin_name}</div>
                  <div className="text-xs">Station: {w.station_id}</div>
                  <div className="text-xs">pH: {w.ph} | Turbidity: {w.turbidity_ntu} NTU</div>
                  <div className="text-xs">DO: {w.dissolved_oxygen_mgl} mg/L | Temp: {w.temperature_c}°C</div>
                  <div className={`text-xs font-bold ${w.status === "anomaly_detected" ? "text-red-600" : "text-green-600"}`}>
                    Status: {w.status === "anomaly_detected" ? "⚠️ Anomaly Spiked" : "✓ Normal Water Quality"}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Wildlife Sightings */}
        {showWildlife &&
          sightings.map((s, i) => (
            <CircleMarker
              key={`sighting-${i}`}
              center={[s.latitude, s.longitude]}
              radius={7}
              pathOptions={{ color: "#d97706", fillColor: "#f59e0b", fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-amber-800">🐾 {s.species_name}</div>
                  <div className="text-xs">Confidence: {(s.confidence * 100).toFixed(0)}%</div>
                  <div className="text-xs">Source: {s.source}</div>
                  {s.is_coordinates_fuzzed && (
                    <div className="text-[10px] text-gray-500 italic">Coordinates generalized for anti-poaching safety</div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Citizen Reports */}
        {showReports &&
          reports.map((r) => (
            <Marker key={`rep-${r.id}`} position={[r.latitude, r.longitude]}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold capitalize text-forest">⚠️ {r.category.replace("_", " ")}</div>
                  <div className="text-xs text-gray-700">{r.description}</div>
                  <div className="mt-1 text-xs font-semibold uppercase text-emerald">Status: {r.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
