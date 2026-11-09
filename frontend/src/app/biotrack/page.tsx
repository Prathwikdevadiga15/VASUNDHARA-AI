"use client";
import { useEffect, useState } from "react";
import { classifyAudio, getSightings, getSpeciesCatalog, identifyWildlife } from "@/services/ai";
import type { WildlifeSighting, WildlifeSpecies } from "@/types";
import { Camera, Volume2, ShieldAlert, Sparkles, CheckCircle2, AlertOctagon } from "lucide-react";

const SAMPLE_SPECIES = [
  { name: "Bengal Tiger", hint: "panthera_tigris", icon: "🐅", habitat: "Bandipur / Nagarhole" },
  { name: "Asian Elephant", hint: "elephas_maximus", icon: "🐘", habitat: "Mysore Elephant Corridor" },
  { name: "Lion-tailed Macaque", hint: "macaca_silenus", icon: "🐒", habitat: "Agumbe Rainforest Canopy" },
  { name: "Great Indian Hornbill", hint: "buceros_bicornis", icon: "🦤", habitat: "Kudremukh Evergreen Forest" },
  { name: "King Cobra", hint: "ophiophagus_hannah", icon: "🐍", habitat: "Agumbe Research Reserve" },
  { name: "Indian Leopard", hint: "panthera_pardus", icon: "🐆", habitat: "Bhadra Wildlife Sanctuary" },
];

const SAMPLE_AUDIO_THREATS = [
  { label: "Chainsaw Engine (Illegal Felling)", sig: "chainsaw", level: "critical", icon: "🪚" },
  { label: "Impulsive Gunshot (Poaching)", sig: "gunshot", level: "critical", icon: "💥" },
  { label: "Langur Alarm Call (Predator/Intruder)", sig: "alarm_call", level: "medium", icon: "📢" },
  { label: "Elephant Low Rumble", sig: "elephant_rumble", level: "low", icon: "🐘" },
  { label: "Natural Rainforest Ambient", sig: "ambient_forest", level: "none", icon: "🌿" },
];

export default function BioTrackPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "audio" | "sightings">("vision");
  const [selectedHint, setSelectedHint] = useState("panthera_tigris");
  const [visionResult, setVisionResult] = useState<any>(null);
  const [visionLoading, setVisionLoading] = useState(false);

  const [selectedAudioSig, setSelectedAudioSig] = useState("chainsaw");
  const [audioResult, setAudioResult] = useState<any>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const [sightings, setSightings] = useState<WildlifeSighting[]>([]);

  const runVisionInference = async (hint: string) => {
    setSelectedHint(hint);
    setVisionLoading(true);
    try {
      const res = await identifyWildlife({ hint_tag: hint });
      setVisionResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVisionLoading(false);
    }
  };

  const runAudioInference = async (sig: string) => {
    setSelectedAudioSig(sig);
    setAudioLoading(true);
    try {
      const res = await classifyAudio({ simulated_signature: sig });
      setAudioResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    runVisionInference("panthera_tigris");
    runAudioInference("chainsaw");
    getSightings().then(setSightings).catch(console.error);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
          <Camera className="h-4 w-4" />
          <span>Multimodal Fauna Intelligence</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          BioTrack AI: Wildlife Recognition & Threat Bioacoustics
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Dual-engine computer vision and passive acoustic telemetry suite safeguarding Western Ghats endangered fauna,
          combining YOLOv8 species identification with spectral bioacoustic threat detection.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="mb-8 flex border-b border-forest/15">
        <button
          onClick={() => setActiveTab("vision")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "vision"
              ? "border-forest text-forest"
              : "border-transparent text-forest/60 hover:text-forest"
          }`}
        >
          <Camera className="h-4 w-4 text-emerald" />
          <span>Computer Vision Camera Trap Lab</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "audio"
              ? "border-forest text-forest"
              : "border-transparent text-forest/60 hover:text-forest"
          }`}
        >
          <Volume2 className="h-4 w-4 text-gold" />
          <span>Forest Bioacoustics & Threat Audio</span>
        </button>

        <button
          onClick={() => setActiveTab("sightings")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "sightings"
              ? "border-forest text-forest"
              : "border-transparent text-forest/60 hover:text-forest"
          }`}
        >
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>Live Wildlife Sightings ({sightings.length})</span>
        </button>
      </div>

      {/* TAB 1: VISION */}
      {activeTab === "vision" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Controls */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-forest">Select Camera Trap Image</h3>
            <p className="mt-1 text-xs text-forest/60">Choose a Western Ghats fauna telemetry frame to run YOLO inference:</p>

            <div className="mt-4 space-y-2">
              {SAMPLE_SPECIES.map((s) => (
                <button
                  key={s.hint}
                  onClick={() => runVisionInference(s.hint)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition ${
                    selectedHint === s.hint
                      ? "border-emerald bg-emerald/10 text-forest shadow-xs"
                      : "border-forest/15 bg-forest/5 text-forest/80 hover:bg-forest/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-forest/60">{s.habitat}</div>
                    </div>
                  </div>
                  {selectedHint === s.hint && <CheckCircle2 className="h-4 w-4 text-emerald" />}
                </button>
              ))}
            </div>

            {/* Simulated Bounding Box Details */}
            <div className="mt-6 rounded-xl border border-forest/10 bg-forest/5 p-4 text-xs">
              <div className="font-bold text-forest">Model Architecture</div>
              <div className="mt-1 text-[11px] text-forest/70">
                PyTorch / YOLOv8 Custom Checkpoint trained on 42,000 camera trap frames across Bandipur, Nagarhole, and Kudremukh.
              </div>
            </div>
          </div>

          {/* Model Output Result */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm lg:col-span-2">
            {visionLoading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="flex items-center gap-3 text-forest">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                  <span className="font-medium text-sm">Running YOLOv8 Neural Inference...</span>
                </div>
              </div>
            ) : visionResult ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-2xl font-bold text-forest">{visionResult.species}</h2>
                      <span className="text-sm italic text-forest/60">({visionResult.scientific_name})</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                        IUCN: {visionResult.iucn_status}
                      </span>
                      <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
                        {visionResult.schedule}
                      </span>
                      <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-bold text-emerald">
                        {(visionResult.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Camera Trap Frame with Bounding Box Overlay */}
                <div className="relative my-6 flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-forest/20 bg-forest/10">
                  <div className="text-center">
                    <div className="text-6xl">
                      {SAMPLE_SPECIES.find((s) => s.hint === selectedHint)?.icon || "🐾"}
                    </div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-wider text-forest/70">
                      Camera Trap Telemetry: Western Slope Sector 4B
                    </div>
                  </div>

                  {/* Bounding Box Render */}
                  {visionResult.bounding_box && (
                    <div
                      className="absolute rounded-lg border-2 border-emerald bg-emerald/15 p-2 shadow-sm"
                      style={{
                        top: `${visionResult.bounding_box.ymin * 100}%`,
                        left: `${visionResult.bounding_box.xmin * 100}%`,
                        width: `${(visionResult.bounding_box.xmax - visionResult.bounding_box.xmin) * 100}%`,
                        height: `${(visionResult.bounding_box.ymax - visionResult.bounding_box.ymin) * 100}%`,
                      }}
                    >
                      <span className="rounded bg-emerald px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {visionResult.species} {(visionResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Ecological Profile */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-forest/10 bg-forest/5 p-4">
                    <div className="text-xs font-bold text-forest">Primary Habitat</div>
                    <div className="mt-1 text-xs text-forest/80">{visionResult.habitat}</div>
                  </div>

                  <div className="rounded-xl border border-forest/10 bg-forest/5 p-4">
                    <div className="text-xs font-bold text-forest">Conservation Alert Note</div>
                    <div className="mt-1 text-xs text-forest/80">{visionResult.conservation_note}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIO */}
      {activeTab === "audio" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Controls */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-forest">Select Audio Signature</h3>
            <p className="mt-1 text-xs text-forest/60">Simulate perimeter acoustic microphone capture:</p>

            <div className="mt-4 space-y-2">
              {SAMPLE_AUDIO_THREATS.map((a) => (
                <button
                  key={a.sig}
                  onClick={() => runAudioInference(a.sig)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition ${
                    selectedAudioSig === a.sig
                      ? "border-forest bg-forest text-beige shadow-xs"
                      : "border-forest/15 bg-forest/5 text-forest/80 hover:bg-forest/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{a.icon}</span>
                    <span>{a.label}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      a.level === "critical"
                        ? "bg-red-500 text-white"
                        : a.level === "medium"
                        ? "bg-amber-400 text-amber-950"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {a.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Output Result */}
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm lg:col-span-2">
            {audioLoading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="flex items-center gap-3 text-forest">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                  <span className="font-medium text-sm">Processing Audio Spectrogram...</span>
                </div>
              </div>
            ) : audioResult ? (
              <div>
                <div className="flex items-center justify-between border-b border-forest/10 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-forest">{audioResult.threat_title}</h2>
                    <p className="text-xs text-forest/60">Model: {audioResult.model_version}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      audioResult.threat_level === "critical"
                        ? "bg-red-100 text-red-700"
                        : audioResult.threat_level === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {audioResult.threat_level} Priority
                  </span>
                </div>

                {/* Spectrogram Simulator */}
                <div className="my-6 rounded-xl border border-forest/15 bg-black p-4 text-emerald font-mono">
                  <div className="flex justify-between text-xs text-emerald/70 border-b border-emerald/20 pb-2">
                    <span>SPECTRAL FREQUENCY ENVELOPE</span>
                    <span>PEAK: {audioResult.peak_frequency_hz} Hz | ENERGY: {audioResult.spectrogram_energy_db} dB</span>
                  </div>
                  <div className="my-4 flex items-end gap-1 h-24">
                    {Array.from({ length: 48 }).map((_, idx) => {
                      const h = Math.min(
                        95,
                        Math.max(10, Math.sin((idx + audioResult.peak_frequency_hz) * 0.3) * 40 + 50)
                      );
                      return (
                        <div
                          key={`bar-${idx}`}
                          className={`w-full rounded-t transition-all duration-500 ${
                            audioResult.threat_level === "critical" ? "bg-red-500" : "bg-emerald"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Tactical Dispatch Recommendation */}
                <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
                  <div className="flex items-center gap-2 font-bold text-xs text-red-900">
                    <AlertOctagon className="h-4 w-4 text-red-600" />
                    <span>MANDATED RANGER ACTION PROTOCOL</span>
                  </div>
                  <p className="mt-1 text-xs text-red-950 font-medium">{audioResult.action_required}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: SIGHTINGS */}
      {activeTab === "sightings" && (
        <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-forest">Western Ghats Verified Camera Trap Log</h3>
            <span className="rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
              Anti-Poaching Obfuscation Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-forest/10 bg-forest/5 text-forest/70 uppercase">
                <tr>
                  <th className="p-3">Species</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Observed Date</th>
                  <th className="p-3">Source Sensor</th>
                  <th className="p-3">Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {sightings.map((s) => (
                  <tr key={s.id} className="hover:bg-forest/5">
                    <td className="p-3 font-bold text-forest">{s.species_name}</td>
                    <td className="p-3">
                      <span className="rounded bg-emerald/15 px-2 py-0.5 font-semibold text-emerald">
                        {(s.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3 text-forest/70">
                      {s.observed_at ? new Date(s.observed_at).toLocaleString() : "Recent"}
                    </td>
                    <td className="p-3 text-forest/70">{s.source}</td>
                    <td className="p-3 text-forest/70 font-mono">
                      {s.latitude.toFixed(2)}°N, {s.longitude.toFixed(2)}°E
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
