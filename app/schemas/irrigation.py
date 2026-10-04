from datetime import date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class LocationCoordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    name: Optional[str] = Field(None, description="Optional location name or district")


class FarmerPredictionRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    planting_date: date = Field(..., description="Sugarcane planting date (YYYY-MM-DD)")
    prediction_date: Optional[date] = Field(
        None, description="Prediction date (YYYY-MM-DD), defaults to today"
    )
    location_name: Optional[str] = Field(None, description="Optional location or farm name")

    @field_validator("prediction_date", mode="before")
    @classmethod
    def set_default_prediction_date(cls, v):
        if v is None or v == "":
            return date.today()
        return v


class LegacyIrrigationRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    temperature_mean_c: float
    temperature_max_c: float
    temperature_min_c: float
    relative_humidity_percent: float = Field(..., ge=0.0, le=100.0)
    precipitation_mm_day: float = Field(..., ge=0.0)
    wind_speed_m_s: float = Field(..., ge=0.0)
    solar_radiation_kwh_m2_day: float = Field(..., ge=0.0)
    sin_day_of_year: float = Field(..., ge=-1.0, le=1.0)
    cos_day_of_year: float = Field(..., ge=-1.0, le=1.0)


class WeatherResponse(BaseModel):
    date: str
    temperature_mean_c: float
    temperature_max_c: float
    temperature_min_c: float
    relative_humidity_percent: float
    precipitation_mm_day: float
    wind_speed_m_s: float
    solar_radiation_kwh_m2_day: float
    source: str = "Open-Meteo"
    data_type: str = "forecast"  # "forecast" or "archive"


class SoilProperty(BaseModel):
    value: Optional[float] = None
    raw_value: Optional[float] = None
    unit: str
    depth: str = "surface band b0"
    source: str = "OpenLandMap"
    resolution_m: int = 250


class SoilContext(BaseModel):
    source: str = "OpenLandMap"
    status: str = "unavailable"  # "available" | "partial" | "unavailable"
    properties: Dict[str, Optional[SoilProperty]] = Field(default_factory=dict)
    model_input: bool = False
    notice: str = ""


# Backward compatibility alias
SoilResponse = SoilContext


class PredictionValues(BaseModel):
    random_forest_prediction_mm_day: float
    xgboost_prediction_mm_day: float


class FarmerPredictionResponse(BaseModel):
    location: Dict[str, Any]
    planting_date: str
    prediction_date: str
    crop_age_days: Optional[int] = None
    weather: WeatherResponse
    soil: Dict[str, Any]
    features_used: Dict[str, float]
    predictions: PredictionValues
    target_definition: str = "Simulated daily irrigation-deficit proxy"
    experimental_only: bool = True
    warning: str = (
        "This estimate is based on a formula-generated training target and is not a validated irrigation recommendation."
    )


class GeocodeResultItem(BaseModel):
    id: Optional[int] = None
    name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    admin1: Optional[str] = None  # State / Province
    admin2: Optional[str] = None  # District


class HealthResponse(BaseModel):
    status: str
    random_forest_loaded: bool
    xgboost_loaded: bool
    models_path: str
