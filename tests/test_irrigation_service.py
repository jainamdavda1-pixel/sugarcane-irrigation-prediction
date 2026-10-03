import math
from datetime import date
import pytest

from app.core.config import MODEL_FEATURES
from app.schemas.irrigation import FarmerPredictionRequest, WeatherResponse
from app.services.irrigation_service import irrigation_service


def test_model_feature_order_and_count():
    assert len(MODEL_FEATURES) == 11
    expected_order = [
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
    assert MODEL_FEATURES == expected_order


def test_day_of_year_cyclic_features():
    # Test Jan 1st (DOY = 1)
    d1 = date(2026, 1, 1)
    sin1, cos1 = irrigation_service.calculate_day_of_year_features(d1)
    expected_angle = 2.0 * math.pi * (1 / 365.25)
    assert abs(sin1 - math.sin(expected_angle)) < 1e-4
    assert abs(cos1 - math.cos(expected_angle)) < 1e-4

    # Test July 2nd (around mid-year DOY ~ 183)
    d2 = date(2026, 7, 2)
    sin2, cos2 = irrigation_service.calculate_day_of_year_features(d2)
    # sin should be close to 0, cos should be close to -1
    assert abs(cos2 - (-1.0)) < 0.05


def test_prepare_feature_dict():
    weather = WeatherResponse(
        date="2026-10-02",
        temperature_mean_c=28.5,
        temperature_max_c=33.2,
        temperature_min_c=24.1,
        relative_humidity_percent=72.0,
        precipitation_mm_day=1.5,
        wind_speed_m_s=3.5,
        solar_radiation_kwh_m2_day=6.0,
        source="Open-Meteo",
        data_type="forecast",
    )
    features = irrigation_service.prepare_feature_dict(
        latitude=16.7050,
        longitude=74.2433,
        weather=weather,
        prediction_date=date(2026, 10, 2),
    )

    assert list(features.keys()) == MODEL_FEATURES
    assert features["latitude"] == 16.7050
    assert features["longitude"] == 74.2433
    assert features["temperature_mean_c"] == 28.5
    assert features["precipitation_mm_day"] == 1.5


def test_model_predictions_with_saved_models():
    sample_features = {
        "latitude": 16.7050,
        "longitude": 74.2433,
        "temperature_mean_c": 28.0,
        "temperature_max_c": 34.0,
        "temperature_min_c": 23.0,
        "relative_humidity_percent": 75.0,
        "precipitation_mm_day": 0.0,
        "wind_speed_m_s": 3.2,
        "solar_radiation_kwh_m2_day": 5.8,
        "sin_day_of_year": 0.5,
        "cos_day_of_year": 0.866,
    }
    preds = irrigation_service.predict_from_features(sample_features)

    assert preds.random_forest_prediction_mm_day >= 0.0
    assert preds.xgboost_prediction_mm_day >= 0.0
    assert isinstance(preds.random_forest_prediction_mm_day, float)
    assert isinstance(preds.xgboost_prediction_mm_day, float)


def test_prediction_date_before_planting_date_validation():
    req = FarmerPredictionRequest(
        latitude=16.5,
        longitude=80.6,
        planting_date=date(2026, 10, 10),
        prediction_date=date(2026, 10, 2),  # Earlier than planting date!
    )
    with pytest.raises(ValueError, match="cannot be earlier than planting date"):
        irrigation_service.predict_for_farmer(req)
