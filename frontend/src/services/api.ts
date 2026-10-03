import type {
  FarmerPredictionRequest,
  GeocodeItem,
  HealthStatus,
  PredictionResponse,
  SoilData,
  WeatherData,
} from '../types/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

/**
 * Helper to build endpoint URLs with proper base handling
 */
function getUrl(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(getUrl('/health'));
  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}`);
  }
  return response.json();
}

export async function searchLocations(query: string): Promise<GeocodeItem[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }
  const response = await fetch(getUrl(`/geocode?q=${encodeURIComponent(query.trim())}`));
  if (!response.ok) {
    throw new Error(`Geocoding failed with HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  predictionDate?: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  if (predictionDate) {
    params.append('prediction_date', predictionDate);
  }
  const response = await fetch(getUrl(`/weather?${params.toString()}`));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Weather retrieval failed (HTTP ${response.status})`);
  }
  return response.json();
}

export async function fetchSoil(latitude: number, longitude: number): Promise<SoilData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  const response = await fetch(getUrl(`/soil?${params.toString()}`));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Soil retrieval failed (HTTP ${response.status})`);
  }
  return response.json();
}

export async function predictIrrigation(
  request: FarmerPredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch(getUrl('/predict'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Prediction failed (HTTP ${response.status})`);
  }

  return response.json();
}
