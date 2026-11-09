"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAlerts, getFireHotspots, getSightings, getWaterStations } from "@/services/ai";
import { listReports } from "@/services/reports";
import type { AlertItem, FireHotspot, Report, WaterStation, WildlifeSighting } from "@/types";
import { ShieldCheck, MapPin, AlertTriangle, Layers } from "lucide-react";

const LiveMap = dynamic(() => import("@/components/maps/LiveEcosystemMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-2xl bg-forest/5">
      <div className="flex items-center gap-3 text-forest">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
        <span className="font-medium">Loading Western Ghats Geospatial Engine...</span>
      </div>
    </div>
  ),
});

export default function EnvironmentalMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [hotspots, setHotspots] = useState<FireHotspot[]>([]);
  const [waterStations, setWaterStations] = useState<WaterStation[]>([]);
  const [sightings, setSightings] = useState<WildlifeSighting[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      listReports(),
      getFireHotspots(),
      getWaterStations(),
      getSightings(),
      getAlerts(),
    ]).then(([repRes, hotRes, watRes, sigRes, altRes]) => {
      if (repRes.status === "fulfilled") setReports(repRes.value);
      if (hotRes.status === "fulfilled") setHotspots(hotRes.value);
      if (watRes.status === "fulfilled") setWaterStations(watRes.value);
      if (sigRes.status === "fulfilled") setSightings(sigRes.value);
      if (altRes.status === "fulfilled") setAlerts(altRes.value);
      setLoading(false);
    });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
            <Layers className="h-4 w-4" />
            <span>Interactive Environmental GIS Intelligence</span>
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
            Western Ghats Live Ecosystem Map
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-forest/75">
            Real-time geospatial fusion layer monitoring protected national parks, NASA FIRMS active fire hotspots,
            hydrological river sensor nodes, camera trap fauna sightings, and verified citizen complaints.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 rounded-xl border border-forest/15 bg-white p-3 shadow-sm">
          <div>
            <div className="text-xl font-bold text-forest">{hotspots.length}</div>
            <div className="text-[11px] text-orange-600 font-medium">Active Hotspots</div>
          </div>
          <div className="h-8 w-px bg-forest/10" />
          <div>
            <div className="text-xl font-bold text-forest">{waterStations.length}</div>
            <div className="text-[11px] text-blue-600 font-medium">River Stations</div>
          </div>
          <div className="h-8 w-px bg-forest/10" />
          <div>
            <div className="text-xl font-bold text-forest">{sightings.length}</div>
            <div className="text-[11px] text-amber-600 font-medium">Fauna Traces</div>
          </div>
        </div>
      </div>

      {/* Live Map Component */}
      <LiveMap
        reports={reports}
        hotspots={hotspots}
        waterStations={waterStations}
        sightings={sightings}
      />

      {/* Environmental Hotspot & Alert Ledger */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Active Fires */}
        <div className="rounded-xl border border-forest/15 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-forest">Active Thermal Hotspots</h3>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">NASA FIRMS</span>
          </div>
          <div className="mt-4 space-y-3">
            {hotspots.map((h) => (
              <div key={h.id} className="rounded-lg border border-orange-100 bg-orange-50/50 p-3">
                <div className="flex justify-between font-medium text-xs text-orange-950">
                  <span>{h.location_name}</span>
                  <span className="font-bold text-orange-700">{h.fire_radiative_power_mw} MW</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-orange-800">
                  <span>Sensor: {h.source}</span>
                  <span>{h.brightness_temperature_k} K</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* River Water Sensors */}
        <div className="rounded-xl border border-forest/15 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-forest">Hydrological Basins</h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">IoT Grid</span>
          </div>
          <div className="mt-4 space-y-3">
            {waterStations.map((w) => (
              <div key={w.id} className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex justify-between font-medium text-xs text-blue-950">
                  <span>{w.basin_name}</span>
                  <span className={`text-[10px] font-bold uppercase ${w.status === "anomaly_detected" ? "text-red-600" : "text-green-700"}`}>
                    {w.status === "anomaly_detected" ? "Anomaly" : "Healthy"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-blue-800">
                  <span>pH: {w.ph}</span>
                  <span>Turbidity: {w.turbidity_ntu} NTU</span>
                  <span>DO: {w.dissolved_oxygen_mgl} mg/L</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Citizen Incidents */}
        <div className="rounded-xl border border-forest/15 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-forest">Verified Incident Dossiers</h3>
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-semibold text-forest">JanRakshak</span>
          </div>
          <div className="mt-4 space-y-3">
            {reports.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-lg border border-forest/10 bg-forest/5 p-3">
                <div className="flex justify-between font-medium text-xs capitalize text-forest">
                  <span>{r.category.replace("_", " ")}</span>
                  <span className="rounded bg-emerald/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald uppercase">{r.status}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] text-forest/75">{r.description}</p>
                <div className="mt-2 text-[10px] text-forest/60">
                  Coords: {r.latitude.toFixed(3)}°N, {r.longitude.toFixed(3)}°E
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
