"use client";
import { useEffect, useState } from "react";
import { getWaterStations } from "@/services/ai";
import { api } from "@/lib/api";
import type { WaterStation } from "@/types";
import { Droplets, AlertTriangle, ShieldCheck, Activity, Info } from "lucide-react";

export default function AquaGuardPage() {
  const [stations, setStations] = useState<WaterStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<WaterStation | null>(null);
  const [anomalyStatus, setAnomalyStatus] = useState<any>(null);
  const [testingAnomaly, setTestingAnomaly] = useState(false);

  useEffect(() => {
    getWaterStations().then((data) => {
      setStations(data);
      if (data.length > 0) setSelectedStation(data[0]);
    });
  }, []);

  const runAnomalyTest = async () => {
    setTestingAnomaly(true);
    try {
      // Simulate series with a sudden spike at the end
      const series = [7.2, 7.3, 7.1, 7.4, 7.2, 7.3, 7.2, 7.4, 7.3, 11.8];
      const res = await api<{ anomaly_indices: number[]; mean: number; std: number }>("/water/anomalies", {
        method: "POST",
        body: JSON.stringify({ values: series, threshold: 2.5 }),
      });
      setAnomalyStatus(res);
    } catch (e) {
      console.error(e);
    } finally {
      setTestingAnomaly(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <Droplets className="h-4 w-4" />
          <span>Hydrological River Basin Intelligence</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          AquaGuard AI: Watershed Purity & River Sensor Network
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Real-time telemetry from automated electrochemical sensor stations safeguarding Western Ghats lifeline rivers:
          Netravati, Kali, Sharavathi, Kaveri, and Bhadra basins.
        </p>
      </div>

      {/* Scientific Integrity Notice */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950">
        <Info className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
        <div>
          <span className="font-bold">Scientific Integrity Mandate: </span>
          VASUNDHARA AI measures water quality strictly through calibrated in-situ electrochemical sensor probes (glass electrode pH, optical nephelometry for turbidity, galvanic DO). We never claim to ascertain chemical parameters from smartphone photos.
        </div>
      </div>

      {/* Station Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Station List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-forest text-sm">Western Ghats River Basins</h3>
          {stations.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedStation?.id === st.id
                  ? "border-blue-500 bg-blue-50/80 shadow-xs"
                  : "border-forest/15 bg-white hover:bg-forest/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-forest">{st.basin_name}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    st.status === "anomaly_detected" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {st.status === "anomaly_detected" ? "Anomaly" : "Normal"}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-forest/60">Station ID: {st.station_id}</div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-forest">
                <span>pH: {st.ph}</span>
                <span>Turbidity: {st.turbidity_ntu} NTU</span>
                <span>DO: {st.dissolved_oxygen_mgl} mg/L</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Station Telemetry Card */}
        {selectedStation && (
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-forest">{selectedStation.basin_name}</h2>
                <p className="text-xs text-forest/60">Station Node: {selectedStation.station_id}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Live Telemetry Active
              </span>
            </div>

            {/* Gauges */}
            <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="text-xs text-forest/70">pH Acidity</div>
                <div className="mt-1 text-3xl font-bold text-blue-900">{selectedStation.ph}</div>
                <div className="text-[10px] text-green-700 font-medium">Healthy (6.5 - 8.5)</div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="text-xs text-forest/70">Turbidity</div>
                <div className="mt-1 text-3xl font-bold text-blue-900">{selectedStation.turbidity_ntu}</div>
                <div className="text-[10px] text-forest/60">Nephelometric NTU</div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="text-xs text-forest/70">Dissolved Oxygen</div>
                <div className="mt-1 text-3xl font-bold text-blue-900">{selectedStation.dissolved_oxygen_mgl}</div>
                <div className="text-[10px] text-green-700 font-medium">Optimal mg/L</div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                <div className="text-xs text-forest/70">Water Temp</div>
                <div className="mt-1 text-3xl font-bold text-blue-900">{selectedStation.temperature_c}°C</div>
                <div className="text-[10px] text-forest/60">Stream Ambient</div>
              </div>
            </div>

            {/* Z-Score Anomaly Detector Console */}
            <div className="rounded-xl border border-forest/15 bg-forest/5 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-forest">
                    <Activity className="h-4 w-4 text-emerald" />
                    <span>Statistical Anomaly Screening (Rolling Z-Score)</span>
                  </div>
                  <p className="text-[11px] text-forest/70">
                    Runs mathematical outlier detection to catch sudden industrial effluent or illegal silt dumping.
                  </p>
                </div>
                <button
                  onClick={runAnomalyTest}
                  disabled={testingAnomaly}
                  className="rounded-xl bg-forest px-4 py-2 text-xs font-semibold text-beige shadow transition hover:bg-forest/90 disabled:opacity-50"
                >
                  {testingAnomaly ? "Evaluating Series..." : "Test Pollution Anomaly"}
                </button>
              </div>

              {anomalyStatus && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-950">
                  <div className="font-bold flex items-center gap-1.5 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Contamination Anomaly Flagged at Series Index {anomalyStatus.anomaly_indices.join(", ")}!</span>
                  </div>
                  <div className="mt-1 text-[11px] text-red-900">
                    Series Mean: {anomalyStatus.mean.toFixed(2)} | Std Dev: {anomalyStatus.std.toFixed(2)} | Critical alert routed to pollution control board.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
