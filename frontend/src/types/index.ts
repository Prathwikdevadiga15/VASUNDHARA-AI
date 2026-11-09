export type Role = "citizen" | "officer" | "researcher" | "ngo" | "super_admin";

export interface User {
  id: string;
  full_name: string;
  email: string;
  roles: Role[];
}

export type ReportCategory = "forest_fire" | "illegal_logging" | "wildlife_distress" | "water_pollution" | "poaching" | "other";

export interface Report {
  id: string;
  category: ReportCategory;
  description: string;
  latitude: number;
  longitude: number;
  status: "submitted" | "verified" | "rejected" | "investigating" | "resolved";
  assigned_to: string | null;
  created_at: string;
}

export interface WildlifeSpecies {
  id: string;
  common_name: string;
  scientific_name: string;
  iucn_status: string;
  taxa: string;
  schedule: string;
  habitat: string;
  conservation_note: string;
  confidence?: number;
  bounding_box?: { ymin: number; xmin: number; ymax: number; xmax: number };
}

export interface WildlifeSighting {
  id: string;
  species_name: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  source: string;
  confidence: number;
  image_url?: string;
  is_coordinates_fuzzed?: boolean;
}

export interface WaterStation {
  id: string;
  station_id: string;
  basin_name: string;
  latitude: number;
  longitude: number;
  ph: number;
  turbidity_ntu: number;
  temperature_c: number;
  dissolved_oxygen_mgl: number;
  measured_at: string;
  status: "normal" | "anomaly_detected";
}

export interface SatelliteSceneResult {
  success: boolean;
  forest_name: string;
  sector: string;
  satellite: string;
  scene_date_before: string;
  scene_date_after: string;
  baseline_mean_ndvi: number;
  post_event_mean_ndvi: number;
  mean_delta_ndvi: number;
  candidate_loss_pixels: number;
  estimated_depleted_area_hectares: number;
  severity: "low" | "high" | "critical";
  verification_status: string;
  ndvi_grid_before: number[][];
  ndvi_grid_after: number[][];
}

export interface FireHotspot {
  id: string;
  source: string;
  latitude: number;
  longitude: number;
  brightness_temperature_k: number;
  fire_radiative_power_mw: number;
  confidence: string;
  acquisition_time: string;
  location_name: string;
  status: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description?: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  verification_status: "unverified" | "verified" | "dismissed";
  created_at: string;
}
