"use client";
import { useEffect, useState } from "react";
import { fireRisk, type FireRisk } from "@/services/ai";
import { Flame, Wind, Droplet, Sun, Layers, HelpCircle, CheckCircle2 } from "lucide-react";

export default function EcoPredictPage() {
  const [temp, setTemp] = useState(38);
  const [humidity, setHumidity] = useState(25);
  const [wind, setWind] = useState(28);
  const [dryDays, setDryDays] = useState(21);
  const [ndviVal, setNdviVal] = useState(0.32);
  const [result, setResult] = useState<FireRisk | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await fireRisk({
        temperature_c: temp,
        humidity_pct: humidity,
        wind_kmh: wind,
        days_since_rain: dryDays,
        ndvi: ndviVal,
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [temp, humidity, wind, dryDays, ndviVal]);

  const applyPreset = (t: number, h: number, w: number, d: number, n: number) => {
    setTemp(t);
    setHumidity(h);
    setWind(w);
    setDryDays(d);
    setNdviVal(n);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
          <Flame className="h-4 w-4" />
          <span>Predictive Ecological Risk & Early Warning</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          EcoPredict AI: Explainable Wildfire & Habitat Risk Engine
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Proactive forecasting model integrating Open-Meteo microclimate variables with satellite biomass moisture
          to predict ecological vulnerability before irreversible damage occurs.
        </p>
      </div>

      {/* Western Ghats Scenario Presets */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-forest uppercase tracking-wider">Historical Scenarios:</span>
        <button
          onClick={() => applyPreset(41, 14, 38, 28, 0.22)}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-100"
        >
          Bandipur Pre-Monsoon Drought (High Risk)
        </button>
        <button
          onClick={() => applyPreset(23, 88, 12, 1, 0.82)}
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800 transition hover:bg-green-100"
        >
          Agumbe Monsoon Active (Low Risk)
        </button>
        <button
          onClick={() => applyPreset(32, 45, 20, 14, 0.55)}
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
        >
          Kudremukh Post-Monsoon Transition
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sliders Console */}
        <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-forest">Microclimate & Vegetation Parameters</h2>
          <p className="mt-1 text-xs text-forest/60">Adjust environmental variables to recalculate the predictive risk score:</p>

          <div className="mt-6 space-y-6">
            {/* Temperature */}
            <div>
              <div className="flex justify-between text-xs font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-orange-500" />
                  Surface Temperature
                </span>
                <span className="text-orange-600 font-mono text-sm">{temp}°C</span>
              </div>
              <input
                type="range"
                min={15}
                max={48}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="mt-2 w-full accent-forest cursor-pointer"
              />
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between text-xs font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  Relative Humidity
                </span>
                <span className="text-blue-600 font-mono text-sm">{humidity}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="mt-2 w-full accent-forest cursor-pointer"
              />
            </div>

            {/* Wind Speed */}
            <div>
              <div className="flex justify-between text-xs font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-teal-500" />
                  Wind Velocity
                </span>
                <span className="text-teal-600 font-mono text-sm">{wind} km/h</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={wind}
                onChange={(e) => setWind(Number(e.target.value))}
                className="mt-2 w-full accent-forest cursor-pointer"
              />
            </div>

            {/* Consecutive Dry Days */}
            <div>
              <div className="flex justify-between text-xs font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-red-500" />
                  Consecutive Dry Days (Rain Deficit)
                </span>
                <span className="text-red-600 font-mono text-sm">{dryDays} days</span>
              </div>
              <input
                type="range"
                min={0}
                max={45}
                value={dryDays}
                onChange={(e) => setDryDays(Number(e.target.value))}
                className="mt-2 w-full accent-forest cursor-pointer"
              />
            </div>

            {/* NDVI Biomass */}
            <div>
              <div className="flex justify-between text-xs font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-emerald" />
                  Canopy Moisture / Biomass (NDVI)
                </span>
                <span className="text-emerald font-mono text-sm">{ndviVal.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.01}
                value={ndviVal}
                onChange={(e) => setNdviVal(Number(e.target.value))}
                className="mt-2 w-full accent-forest cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Prediction Output & Explainable Attribution */}
        {result && (
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-forest">Model Risk Evaluation</h2>
                <p className="text-xs text-forest/60">Engine: {result.model_version}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  result.band === "high"
                    ? "bg-red-100 text-red-700"
                    : result.band === "moderate"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {result.band} Susceptibility
              </span>
            </div>

            {/* Gauge */}
            <div className="my-6 text-center">
              <div className="text-xs uppercase tracking-wider font-semibold text-forest/70">Composite Risk Score</div>
              <div
                className={`mt-2 font-display text-6xl font-extrabold ${
                  result.score > 0.6 ? "text-red-600" : result.score > 0.35 ? "text-amber-600" : "text-emerald"
                }`}
              >
                {(result.score * 100).toFixed(0)}
                <span className="text-2xl text-forest/40">/100</span>
              </div>
            </div>

            {/* Explainable AI: Feature Contributions */}
            <div className="mt-6 rounded-xl border border-forest/10 bg-forest/5 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-forest">
                <span>Explainable AI: Feature Attribution Weights</span>
                <span className="text-[10px] text-forest/60">Normalized Impact</span>
              </div>

              <div className="mt-4 space-y-3">
                {Object.entries(result.contributions).map(([key, val]) => {
                  const pct = Math.min(100, (val / 0.26) * 100);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-forest/80">
                        <span className="capitalize">{key.replace("_", " ")}</span>
                        <span className="font-mono font-bold text-forest">+{val}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-forest/10">
                        <div
                          className="h-full rounded-full bg-forest transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ranger Protocol */}
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-forest/15 bg-beige p-3 text-xs text-forest/80">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
              <div>
                <span className="font-bold text-forest">Preventive Action Protocol: </span>
                {result.band === "high"
                  ? "Activate fire watchtowers in Bandipur and Kudremukh. Clear controlled fuel breaks along high-risk edges."
                  : result.band === "moderate"
                  ? "Issue cautionary patrol advisory to range forest officers. Monitor thermal sensors every 3 hours."
                  : "Normal baseline conditions. Routine telemetry collection active."}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
