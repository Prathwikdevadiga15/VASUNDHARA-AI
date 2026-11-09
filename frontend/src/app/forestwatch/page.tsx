"use client";
import { useEffect, useState } from "react";
import { analyzeSatelliteScene, getFireHotspots } from "@/services/ai";
import type { FireHotspot, SatelliteSceneResult } from "@/types";
import { Trees, Satellite, AlertTriangle, Flame, CheckCircle2, RefreshCw } from "lucide-react";

export default function ForestWatchPage() {
  const [selectedForest, setSelectedForest] = useState("Kudremukh National Park");
  const [selectedSector, setSelectedSector] = useState("Sector 4B - Western Slope");
  const [analysis, setAnalysis] = useState<SatelliteSceneResult | null>(null);
  const [hotspots, setHotspots] = useState<FireHotspot[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeSatelliteScene({ forest_name: selectedForest, sector: selectedSector });
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    getFireHotspots().then(setHotspots).catch(console.error);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero / Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
          <Satellite className="h-4 w-4" />
          <span>Sentinel-2 Multispectral & Thermal Observation</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          ForestWatch AI: Canopy Change & Deforestation Early Warning
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Temporal Normalized Difference Vegetation Index (NDVI) engine cross-referencing European Space Agency (ESA)
          Copernicus Sentinel-2 multispectral surface reflectance with NASA FIRMS active fire hotspots.
        </p>
      </div>

      {/* Control Console */}
      <div className="mb-8 rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70">Target Forest</label>
              <select
                value={selectedForest}
                onChange={(e) => setSelectedForest(e.target.value)}
                className="mt-1 rounded-lg border border-forest/20 bg-forest/5 px-3 py-2 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-emerald"
              >
                <option value="Kudremukh National Park">Kudremukh National Park (Chikkamagaluru)</option>
                <option value="Agumbe Rainforest Reserve">Agumbe Rainforest Reserve (Shimoga)</option>
                <option value="Bandipur Tiger Reserve">Bandipur Tiger Reserve (Chamarajanagar)</option>
                <option value="Kali Tiger Reserve">Kali Tiger Reserve (Uttara Kannada)</option>
                <option value="Bhadra Wildlife Sanctuary">Bhadra Wildlife Sanctuary (Lakkavalli)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70">Corridor Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="mt-1 rounded-lg border border-forest/20 bg-forest/5 px-3 py-2 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-emerald"
              >
                <option value="Sector 4B - Western Slope">Sector 4B - Western Slope (Stream Buffer)</option>
                <option value="Sector 2A - Ridge Escarpment">Sector 2A - Ridge Escarpment</option>
                <option value="Sector 7C - South Elephant Passage">Sector 7C - South Elephant Passage</option>
              </select>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-xs font-semibold text-beige shadow transition hover:bg-forest/90 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-emerald ${analyzing ? "animate-spin" : ""}`} />
            <span>{analyzing ? "Processing Sentinel Bands..." : "Run Scene Analysis"}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Grid */}
      {analysis && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main NDVI Change Card */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-forest">Multispectral Canopy Loss Detection</h3>
                <p className="text-xs text-forest/70">
                  Sentinel-2 MSI (B4 Red 665nm & B8 NIR 842nm) | Window: {analysis.scene_date_before} → {analysis.scene_date_after}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  analysis.severity === "critical"
                    ? "bg-red-100 text-red-700"
                    : analysis.severity === "high"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {analysis.severity} Threat Level
              </span>
            </div>

            {/* Metrics */}
            <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                <div className="text-xs text-forest/70">Baseline NDVI</div>
                <div className="text-xl font-bold text-forest">{analysis.baseline_mean_ndvi}</div>
                <div className="text-[10px] text-emerald font-medium">Dense Canopy</div>
              </div>
              <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                <div className="text-xs text-forest/70">Post-Scene NDVI</div>
                <div className="text-xl font-bold text-forest">{analysis.post_event_mean_ndvi}</div>
                <div className="text-[10px] text-red-600 font-medium">Depleted</div>
              </div>
              <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                <div className="text-xs text-forest/70">Candidate Loss</div>
                <div className="text-xl font-bold text-red-600">{analysis.candidate_loss_pixels} px</div>
                <div className="text-[10px] text-forest/60">ΔNDVI &lt; -0.20</div>
              </div>
              <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                <div className="text-xs text-forest/70">Est. Depleted Area</div>
                <div className="text-xl font-bold text-forest">{analysis.estimated_depleted_area_hectares} ha</div>
                <div className="text-[10px] text-forest/60">10m Ground Res</div>
              </div>
            </div>

            {/* Simulated Satellite Pixel Grid Visualizer */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-forest">
                <span>Satellite Spectral Grid Patch (16x16 Ground Pixels)</span>
                <span className="text-[11px] text-red-600 font-medium">Red cells indicate canopy loss candidate</span>
              </div>
              <div className="grid grid-cols-16 gap-0.5 rounded-xl border border-forest/15 bg-forest/5 p-2 overflow-x-auto">
                {analysis.ndvi_grid_after.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const beforeVal = analysis.ndvi_grid_before[rIdx]?.[cIdx] ?? val;
                    const delta = val - beforeVal;
                    const isLoss = delta < -0.20;
                    return (
                      <div
                        key={`cell-${rIdx}-${cIdx}`}
                        title={`Pixel [${rIdx},${cIdx}]: NDVI ${val} (Delta: ${delta.toFixed(2)})`}
                        className={`h-5 w-5 rounded-xs transition-transform hover:scale-125 cursor-pointer flex items-center justify-center text-[7px] font-bold ${
                          isLoss
                            ? "bg-red-600 text-white animate-pulse"
                            : val > 0.7
                            ? "bg-emerald text-white"
                            : val > 0.4
                            ? "bg-emerald/60 text-forest"
                            : "bg-amber-300 text-amber-900"
                        }`}
                      >
                        {isLoss ? "!" : ""}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Protocol Notice */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald/20 bg-emerald/5 p-4 text-xs text-forest/80">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
              <div>
                <span className="font-semibold text-forest">Standard Operating Procedure: </span>
                Candidate vegetation loss is automatically routed to the Forest Officer Workbench for ground inspection.
                Predictions serve as early indicators to prevent irreversible loss before clearance matures.
              </div>
            </div>
          </div>

          {/* NASA FIRMS Thermal Anomalies Sidebar */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-forest">
                <Flame className="h-5 w-5 text-orange-600" />
                <span>Active NASA FIRMS Fires</span>
              </div>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">VIIRS 375m</span>
            </div>

            <div className="mt-4 space-y-4">
              {hotspots.map((h) => (
                <div key={h.id} className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-orange-950">{h.location_name}</div>
                      <div className="text-[10px] text-orange-800">Coords: {h.latitude}°N, {h.longitude}°E</div>
                    </div>
                    <span className="rounded bg-orange-200 px-1.5 py-0.5 text-[10px] font-bold text-orange-800 uppercase">
                      {h.confidence}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded bg-white/80 p-2">
                      <div className="text-[10px] text-gray-500">Fire Power</div>
                      <div className="font-bold text-orange-700">{h.fire_radiative_power_mw} MW</div>
                    </div>
                    <div className="rounded bg-white/80 p-2">
                      <div className="text-[10px] text-gray-500">Temp</div>
                      <div className="font-bold text-orange-700">{h.brightness_temperature_k} K</div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] font-semibold text-orange-900">
                    Status: {h.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action */}
            <div className="mt-6">
              <a
                href="/dashboard/environmental-map"
                className="block w-full rounded-xl border border-forest/20 py-2.5 text-center text-xs font-semibold text-forest transition hover:bg-forest/5"
              >
                Inspect in Live GIS Map →
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
