from datetime import date, timedelta
from unittest.mock import MagicMock, patch
import pytest

from app.schemas.irrigation import WeatherResponse
from app.services.weather_service import WeatherService


def test_weather_service_parse_daily_response(mock_open_meteo_forecast_payload):
    service = WeatherService()
    target_date = date(2026, 10, 2)
    weather = service._parse_daily_response(
        mock_open_meteo_forecast_payload, target_date, source="Open-Meteo", data_type="forecast"
    )

    assert isinstance(weather, WeatherResponse)
    assert weather.date == "2026-10-02"
    assert weather.temperature_mean_c == 28.5
    assert weather.temperature_max_c == 33.2
    assert weather.temperature_min_c == 24.1
    assert weather.relative_humidity_percent == 72.0
    assert weather.precipitation_mm_day == 1.5
    assert weather.wind_speed_m_s == 3.5
    # 21.6 MJ/m² / 3.6 = 6.0 kWh/m²/day
    assert weather.solar_radiation_kwh_m2_day == 6.0
    assert weather.source == "Open-Meteo"
    assert weather.data_type == "forecast"


def test_weather_service_unit_conversions(mock_open_meteo_forecast_payload):
    service = WeatherService()
    # Test second date in payload: 2026-10-03
    target_date = date(2026, 10, 3)
    weather = service._parse_daily_response(
        mock_open_meteo_forecast_payload, target_date, source="Open-Meteo", data_type="forecast"
    )

    assert weather.date == "2026-10-03"
    assert weather.precipitation_mm_day == 0.0
    # 22.0 / 3.6 = 6.1111 kWh/m2
    assert abs(weather.solar_radiation_kwh_m2_day - (22.0 / 3.6)) < 0.001


def test_weather_service_fallback_mean_temperature():
    service = WeatherService()
    payload = {
        "daily": {
            "time": ["2026-10-02"],
            "temperature_2m_mean": [None],  # Missing mean temp
            "temperature_2m_max": [30.0],
            "temperature_2m_min": [20.0],
            "relative_humidity_2m_mean": [75.0],
            "precipitation_sum": [0.0],
            "wind_speed_10m_max": [3.0],
            "shortwave_radiation_sum": [18.0],
        }
    }
    weather = service._parse_daily_response(payload, date(2026, 10, 2), "Open-Meteo", "forecast")
    # Calculated as (30.0 + 20.0) / 2 = 25.0
    assert weather.temperature_mean_c == 25.0


def test_weather_service_date_unavailable():
    service = WeatherService()
    payload = {
        "daily": {
            "time": ["2026-10-01", "2026-10-02"],
            "temperature_2m_mean": [25.0, 26.0],
            "temperature_2m_max": [30.0, 31.0],
            "temperature_2m_min": [20.0, 21.0],
            "relative_humidity_2m_mean": [70.0, 70.0],
            "precipitation_sum": [0.0, 0.0],
            "wind_speed_10m_max": [3.0, 3.0],
            "shortwave_radiation_sum": [18.0, 18.0],
        }
    }
    with pytest.raises(ValueError, match="is not available in weather data"):
        service._parse_daily_response(payload, date(2026, 10, 10), "Open-Meteo", "forecast")


def test_weather_service_future_date_beyond_horizon():
    service = WeatherService()
    far_future = date.today() + timedelta(days=30)
    with pytest.raises(ValueError, match="beyond the forecast horizon"):
        service.get_daily_weather(16.5, 80.6, far_future)


def test_weather_service_caching(mock_open_meteo_forecast_payload):
    service = WeatherService()
    target_date = date.today()
    mock_open_meteo_forecast_payload["daily"]["time"] = [target_date.isoformat()]

    with patch.object(service, "_make_request", return_value=mock_open_meteo_forecast_payload) as mock_req:
        res1 = service.get_daily_weather(16.5, 80.6, target_date)
        res2 = service.get_daily_weather(16.5, 80.6, target_date)
        # Second call should use cache
        assert mock_req.call_count == 1
        assert res1.temperature_mean_c == res2.temperature_mean_c


def test_weather_service_api_failure():
    service = WeatherService()
    with patch("httpx.Client.get", side_effect=Exception("Connection refused")):
        with pytest.raises(RuntimeError, match="Failed to connect to weather data service"):
            service._fetch_forecast_weather(16.5, 80.6, date.today())


def test_geocoding_parsing():
    service = WeatherService()
    mock_geo_resp = MagicMock()
    mock_geo_resp.status_code = 200
    mock_geo_resp.json.return_value = {
        "results": [
            {
                "id": 1259229,
                "name": "Pune",
                "latitude": 18.51957,
                "longitude": 73.85535,
                "country": "India",
                "admin1": "Maharashtra",
            }
        ]
    }

    with patch("httpx.Client.get", return_value=mock_geo_resp):
        results = service.search_locations("Pune")
        assert len(results) == 1
        assert results[0]["name"] == "Pune"
        assert results[0]["admin1"] == "Maharashtra"
