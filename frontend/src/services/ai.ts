import { api } from "@/lib/api";
import type {
  AlertItem,
  FireHotspot,
  SatelliteSceneResult,
  WaterStation,
  WildlifeSighting,
  WildlifeSpecies,
} from "@/types";

export interface FireRisk {
  score: number;
  band: string;
  contributions: Record<string, number>;
  model_version: string;
  is_trained_model: boolean;
  disclaimer: string;
}

export const fireRisk = (b: {
  temperature_c: number;
  humidity_pct: number;
  wind_kmh: number;
  days_since_rain: number;
  ndvi: number;
}) => api<FireRisk>("/predictions/fire-risk", { method: "POST", body: JSON.stringify(b) });

export const askAssistant = (question: string) =>
  api<{
    answer: string;
    citations: { title: string; url: string | null; publisher?: string }[];
    engine?: string;
  }>("/chat", { method: "POST", body: JSON.stringify({ question }) });

export const askAgent = (query: string, region: string = "Western Ghats") =>
  api<{
    query: string;
    region: string;
    tools_executed: string[];
    evidence: Record<string, any>;
    summary: string;
  }>("/chat/agent", { method: "POST", body: JSON.stringify({ query, region }) });

export const identifyWildlife = (data: { filename?: string; hint_tag?: string }) =>
  api<WildlifeSpecies>("/wildlife/identify", { method: "POST", body: JSON.stringify(data) });

export const classifyAudio = (data: { simulated_signature?: string; filename?: string }) =>
  api<{
    success: boolean;
    classification: string;
    threat_title: string;
    threat_level: string;
    peak_frequency_hz: number;
    confidence: number;
    description: string;
    action_required: string;
    spectrogram_energy_db: number;
  }>("/wildlife/audio-classify", { method: "POST", body: JSON.stringify(data) });

export const getSightings = () => api<WildlifeSighting[]>("/wildlife/sightings");

export const getSpeciesCatalog = () => api<WildlifeSpecies[]>("/wildlife/species");

export const analyzeSatelliteScene = (params: { forest_name?: string; sector?: string }) =>
  api<SatelliteSceneResult>("/forest/analyze", { method: "POST", body: JSON.stringify(params) });

export const getFireHotspots = () => api<FireHotspot[]>("/forest/hotspots");

export const getForestList = () =>
  api<{ id: string; name: string; protected_status: string; area_sq_km: number; state: string }[]>(
    "/forest/forests"
  );

export const getWaterStations = () => api<WaterStation[]>("/water/stations");

export const getAlerts = () => api<AlertItem[]>("/alerts");
