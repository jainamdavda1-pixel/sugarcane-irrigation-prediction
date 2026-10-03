import logging
import math
from datetime import date
from typing import Any, Dict, Optional, Tuple

import joblib
import numpy as np
import pandas as pd

from app.core.config import (
    MODEL_FEATURES,
    RF_MODEL_PATH,
    XGB_MODEL_PATH,
)
from app.schemas.irrigation import (
    FarmerPredictionRequest,
    FarmerPredictionResponse,
    PredictionValues,
    WeatherResponse,
)
from app.services.soil_service import soil_service
from app.services.weather_service import weather_service

logger = logging.getLogger(__name__)


class IrrigationService:
    def __init__(self):
        self.rf_model = None
        self.xgb_model = None
        self._load_models()

    def _load_models(self):
        try:
            if RF_MODEL_PATH.exists():
                self.rf_model = joblib.load(RF_MODEL_PATH)
                logger.info("Loaded Random Forest model from %s", RF_MODEL_PATH)
            else:
                logger.error("Random Forest model not found at %s", RF_MODEL_PATH)

            if XGB_MODEL_PATH.exists():
                self.xgb_model = joblib.load(XGB_MODEL_PATH)
                logger.info("Loaded XGBoost model from %s", XGB_MODEL_PATH)
            else:
                logger.error("XGBoost model not found at %s", XGB_MODEL_PATH)
        except Exception as exc:
            logger.error("Error loading machine learning models: %s", exc)

    @staticmethod
    def calculate_day_of_year_features(target_date: date) -> Tuple[float, float]:
        """
        Calculate cyclical day-of-year features:
        sin_day_of_year = sin(2 * pi * day_of_year / 365.25)
        cos_day_of_year = cos(2 * pi * day_of_year / 365.25)
        """
        day_of_year = target_date.timetuple().tm_yday
        angle = 2.0 * math.pi * (day_of_year / 365.25)
        sin_val = math.sin(angle)
        cos_val = math.cos(angle)
        return round(sin_val, 6), round(cos_val, 6)

    def prepare_feature_dict(
        self,
        latitude: float,
        longitude: float,
        weather: WeatherResponse,
        prediction_date: date,
    ) -> Dict[str, float]:
        sin_doy, cos_doy = self.calculate_day_of_year_features(prediction_date)
        return {
            "latitude": float(latitude),
            "longitude": float(longitude),
            "temperature_mean_c": float(weather.temperature_mean_c),
            "temperature_max_c": float(weather.temperature_max_c),
            "temperature_min_c": float(weather.temperature_min_c),
            "relative_humidity_percent": float(weather.relative_humidity_percent),
            "precipitation_mm_day": float(weather.precipitation_mm_day),
            "wind_speed_m_s": float(weather.wind_speed_m_s),
            "solar_radiation_kwh_m2_day": float(weather.solar_radiation_kwh_m2_day),
            "sin_day_of_year": float(sin_doy),
            "cos_day_of_year": float(cos_doy),
        }

    def predict_from_features(self, feature_dict: Dict[str, float]) -> PredictionValues:
        if self.rf_model is None or self.xgb_model is None:
            raise RuntimeError(
                "Trained models are not loaded. Check model paths in config."
            )

        # Ensure exact 11 features in the exact order trained on
        feature_row = [feature_dict[col] for col in MODEL_FEATURES]
        df = pd.DataFrame([feature_row], columns=MODEL_FEATURES)

        rf_raw = float(self.rf_model.predict(df)[0])
        xgb_raw = float(self.xgb_model.predict(df)[0])

        if not (np.isfinite(rf_raw) and np.isfinite(xgb_raw)):
            raise ValueError("Model produced non-finite predictions.")

        return PredictionValues(
            random_forest_prediction_mm_day=round(max(0.0, rf_raw), 4),
            xgboost_prediction_mm_day=round(max(0.0, xgb_raw), 4),
        )

    def predict_for_farmer(
        self, request: FarmerPredictionRequest
    ) -> FarmerPredictionResponse:
        pred_date = request.prediction_date or date.today()
        planting_date = request.planting_date

        if pred_date < planting_date:
            raise ValueError(
                f"Prediction date ({pred_date.isoformat()}) cannot be earlier than "
                f"planting date ({planting_date.isoformat()})."
            )

        crop_age_days = (pred_date - planting_date).days

        # 1. Fetch Weather data
        weather = weather_service.get_daily_weather(
            latitude=request.latitude,
            longitude=request.longitude,
            target_date=pred_date,
        )

        # 2. Fetch Soil data (independent, does not block prediction)
        soil = soil_service.get_soil_properties(
            latitude=request.latitude,
            longitude=request.longitude,
        )

        # 3. Prepare exact 11 model features
        feature_dict = self.prepare_feature_dict(
            latitude=request.latitude,
            longitude=request.longitude,
            weather=weather,
            prediction_date=pred_date,
        )

        # 4. Generate model predictions
        predictions = self.predict_from_features(feature_dict)

        location_info = {
            "latitude": request.latitude,
            "longitude": request.longitude,
        }
        if request.location_name:
            location_info["name"] = request.location_name

        return FarmerPredictionResponse(
            location=location_info,
            planting_date=planting_date.isoformat(),
            prediction_date=pred_date.isoformat(),
            crop_age_days=crop_age_days,
            weather=weather,
            soil=soil,
            features_used=feature_dict,
            predictions=predictions,
            target_definition="Simulated daily irrigation-deficit proxy",
            experimental_only=True,
            warning=(
                "This estimate is based on a formula-generated training target and is "
                "not a validated irrigation recommendation."
            ),
        )


irrigation_service = IrrigationService()
