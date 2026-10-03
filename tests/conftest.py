import sys
from pathlib import Path
from datetime import date
import pytest
from starlette.testclient import TestClient

# Ensure root directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.services.weather_service import WeatherService
from app.services.soil_service import SoilService


@pytest.fixture
def test_client():
    return TestClient(app)


@pytest.fixture
def mock_open_meteo_forecast_payload():
    return {
        "latitude": 16.5,
        "longitude": 80.6,
        "daily": {
            "time": ["2026-10-02", "2026-10-03"],
            "temperature_2m_mean": [28.5, 29.0],
            "temperature_2m_max": [33.2, 34.1],
            "temperature_2m_min": [24.1, 25.0],
            "relative_humidity_2m_mean": [72.0, 70.0],
            "precipitation_sum": [1.5, 0.0],
            "wind_speed_10m_max": [3.5, 4.0],
            "shortwave_radiation_sum": [21.6, 22.0],  # 21.6 / 3.6 = 6.0 kWh/m2
        },
    }


@pytest.fixture
def mock_open_meteo_archive_payload():
    return {
        "latitude": 16.5,
        "longitude": 80.6,
        "daily": {
            "time": ["2026-05-15"],
            "temperature_2m_mean": [32.0],
            "temperature_2m_max": [38.0],
            "temperature_2m_min": [27.0],
            "relative_humidity_2m_mean": [60.0],
            "precipitation_sum": [0.0],
            "wind_speed_10m_max": [4.2],
            "shortwave_radiation_sum": [25.2],  # 25.2 / 3.6 = 7.0 kWh/m2
        },
    }


@pytest.fixture
def mock_soilgrids_payload():
    return {
        "properties": {
            "layers": [
                {
                    "name": "bdod",
                    "depths": [{"label": "0-30cm", "values": {"mean": 135}}],  # 135 * 0.01 = 1.35 g/cm3
                },
                {
                    "name": "phh2o",
                    "depths": [{"label": "0-30cm", "values": {"mean": 68}}],   # 68 * 0.1 = 6.8 pH
                },
                {
                    "name": "clay",
                    "depths": [{"label": "0-30cm", "values": {"mean": 320}}],  # 320 * 0.1 = 32.0 %
                },
                {
                    "name": "sand",
                    "depths": [{"label": "0-30cm", "values": {"mean": 450}}],  # 450 * 0.1 = 45.0 %
                },
                {
                    "name": "silt",
                    "depths": [{"label": "0-30cm", "values": {"mean": 230}}],  # 230 * 0.1 = 23.0 %
                },
                {
                    "name": "soc",
                    "depths": [{"label": "0-30cm", "values": {"mean": 85}}],   # 85 * 0.1 = 8.5 g/kg
                },
                {
                    "name": "cec",
                    "depths": [{"label": "0-30cm", "values": {"mean": 180}}],  # 180 * 0.1 = 18.0 cmol/kg
                },
            ]
        }
    }
