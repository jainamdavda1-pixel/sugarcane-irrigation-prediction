from pathlib import Path
from typing import List
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Model paths
MODELS_DIR = BASE_DIR / "Models"
if not MODELS_DIR.exists():
    MODELS_DIR = BASE_DIR / "models"

RF_MODEL_PATH = MODELS_DIR / "random_forest.joblib"
XGB_MODEL_PATH = MODELS_DIR / "xgboost.joblib"

# Data directories
DATA_DIR = BASE_DIR / "data"
OPENLANDMAP_DIR = DATA_DIR / "openlandmap"
SOIL_DATA_DIR = OPENLANDMAP_DIR

# API Endpoints
OPEN_METEO_FORECAST_URL = os.getenv("OPEN_METEO_FORECAST_URL", "https://api.open-meteo.com/v1/forecast")
OPEN_METEO_ARCHIVE_URL = os.getenv("OPEN_METEO_ARCHIVE_URL", "https://archive-api.open-meteo.com/v1/archive")
OPEN_METEO_GEOCODING_URL = os.getenv("OPEN_METEO_GEOCODING_URL", "https://geocoding-api.open-meteo.com/v1/search")

# HTTP settings
HTTP_TIMEOUT_SECONDS = float(os.getenv("HTTP_TIMEOUT_SECONDS", "8.0"))
HTTP_MAX_RETRIES = int(os.getenv("HTTP_MAX_RETRIES", "2"))

# Cache settings
WEATHER_CACHE_TTL_SECONDS = int(os.getenv("WEATHER_CACHE_TTL_SECONDS", "3600"))  # 1 hour
SOIL_CACHE_TTL_SECONDS = int(os.getenv("SOIL_CACHE_TTL_SECONDS", "86400"))  # 24 hours
GEOCODE_CACHE_TTL_SECONDS = int(os.getenv("GEOCODE_CACHE_TTL_SECONDS", "86400"))

# Exact 11 features expected by the trained models in order
MODEL_FEATURES: List[str] = [
    "latitude",
    "longitude",
    "temperature_mean_c",
    "temperature_max_c",
    "temperature_min_c",
    "relative_humidity_percent",
    "precipitation_mm_day",
    "wind_speed_m_s",
    "solar_radiation_kwh_m2_day",
    "sin_day_of_year",
    "cos_day_of_year",
]
