export interface LocationInfo {
  latitude: number;
  longitude: number;
  name?: string | null;
}

export interface FarmerPredictionRequest {
  latitude: number;
  longitude: number;
  planting_date: string; // YYYY-MM-DD
  prediction_date?: string | null; // YYYY-MM-DD
  location_name?: string | null;
}

export interface WeatherData {
  date: string;
  temperature_mean_c: number;
  temperature_max_c: number;
  temperature_min_c: number;
  relative_humidity_percent: number;
  precipitation_mm_day: number;
  wind_speed_m_s: number;
  solar_radiation_kwh_m2_day: number;
  source: string;
  data_type: 'forecast' | 'archive';
}

export interface SoilPropertyDetail {
  name: string;
  value: number;
  raw_value?: number;
  unit: string;
  description: string;
  depth: string;
}

export interface SoilProperty {
  value: number;
  raw_value: number;
  unit: string;
  depth: string;
  source: string;
  resolution_m: number;
}

export interface SoilContext {
  source: string;
  status: 'available' | 'partial' | 'unavailable';
  properties: {
    soil_ph: SoilProperty | null;
    soil_organic_carbon: SoilProperty | null;
    clay_content: SoilProperty | null;
  };
  model_input: false;
  notice: string;
}

export interface SoilData {
  available?: boolean;
  status?: 'available' | 'partial' | 'unavailable';
  source: string;
  depth_interval?: string;
  properties: Record<string, any>;
  message?: string;
  model_input?: boolean;
  notice?: string;
}

export interface ModelPredictions {
  random_forest_prediction_mm_day: number;
  xgboost_prediction_mm_day: number;
}

export interface ModelFeaturesDict {
  latitude: number;
  longitude: number;
  temperature_mean_c: number;
  temperature_max_c: number;
  temperature_min_c: number;
  relative_humidity_percent: number;
  precipitation_mm_day: number;
  wind_speed_m_s: number;
  solar_radiation_kwh_m2_day: number;
  sin_day_of_year: number;
  cos_day_of_year: number;
}

export interface PredictionResponse {
  location: LocationInfo;
  planting_date: string;
  prediction_date: string;
  crop_age_days?: number;
  weather: WeatherData;
  soil: SoilData;
  features_used: ModelFeaturesDict;
  predictions: ModelPredictions;
  target_definition: string;
  experimental_only: boolean;
  warning: string;
}

export interface GeocodeItem {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State / Region
  admin2?: string; // District
}

export interface HealthStatus {
  status: string;
  random_forest_loaded: boolean;
  xgboost_loaded: boolean;
  models_path: string;
}

export interface StoredPredictionRecord {
  id: string;
  timestamp: number;
  location: LocationInfo;
  plantingDate: string;
  predictionDate: string;
  cropAgeDays?: number;
  weather: WeatherData;
  soil: SoilData;
  predictions: ModelPredictions;
}

export interface LocationMetricEvaluation {
  location: string;
  state: string;
  latitude: number;
  longitude: number;
  rfMae: number;
  rfRmse: number;
  xgbMae: number;
  xgbRmse: number;
}
