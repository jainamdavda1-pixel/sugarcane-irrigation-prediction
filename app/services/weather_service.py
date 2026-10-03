import logging
import time
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import httpx

from app.core.config import (
    HTTP_MAX_RETRIES,
    HTTP_TIMEOUT_SECONDS,
    OPEN_METEO_ARCHIVE_URL,
    OPEN_METEO_FORECAST_URL,
    OPEN_METEO_GEOCODING_URL,
    WEATHER_CACHE_TTL_SECONDS,
)
from app.schemas.irrigation import WeatherResponse

logger = logging.getLogger(__name__)


class WeatherService:
    def __init__(self):
        self._cache: Dict[Tuple[float, float, str], Tuple[float, WeatherResponse]] = {}
        self._geocode_cache: Dict[str, Tuple[float, List[Dict[str, Any]]]] = {}

    def _get_from_cache(
        self, lat: float, lon: float, date_str: str
    ) -> Optional[WeatherResponse]:
        key = (round(lat, 3), round(lon, 3), date_str)
        if key in self._cache:
            cached_time, result = self._cache[key]
            if time.time() - cached_time < WEATHER_CACHE_TTL_SECONDS:
                return result
            del self._cache[key]
        return None

    def _save_to_cache(
        self, lat: float, lon: float, date_str: str, data: WeatherResponse
    ) -> None:
        key = (round(lat, 3), round(lon, 3), date_str)
        self._cache[key] = (time.time(), data)

    def search_locations(self, query: str, count: int = 5) -> List[Dict[str, Any]]:
        """Search Indian and global locations using Open-Meteo Geocoding API."""
        query_key = query.strip().lower()
        if not query_key:
            return []

        if query_key in self._geocode_cache:
            cached_time, results = self._geocode_cache[query_key]
            if time.time() - cached_time < 86400:
                return results

        params = {
            "name": query,
            "count": count,
            "language": "en",
            "format": "json",
        }

        try:
            with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS) as client:
                response = client.get(OPEN_METEO_GEOCODING_URL, params=params)
                if response.status_code == 200:
                    data = response.json()
                    results = data.get("results", [])
                    self._geocode_cache[query_key] = (time.time(), results)
                    return results
                logger.warning(
                    "Open-Meteo Geocoding API returned status %d for query %s",
                    response.status_code,
                    query,
                )
        except Exception as exc:
            logger.error("Failed to query Open-Meteo Geocoding: %s", exc)

        return []

    def get_daily_weather(
        self, latitude: float, longitude: float, target_date: Optional[date] = None
    ) -> WeatherResponse:
        """Fetch daily weather data from Open-Meteo Forecast or Archive API."""
        if target_date is None:
            target_date = date.today()

        date_str = target_date.isoformat()
        cached = self._get_from_cache(latitude, longitude, date_str)
        if cached:
            return cached

        today = date.today()
        # Open-Meteo forecast provides up to 16 days forecast and past 7-14 days
        forecast_horizon = today + timedelta(days=16)

        if target_date > forecast_horizon:
            raise ValueError(
                f"Weather forecast is only available up to {forecast_horizon.isoformat()} (16 days ahead). "
                f"Requested date {date_str} is beyond the forecast horizon."
            )

        # Decide whether to use forecast or archive API
        # If target_date is more than 5 days in the past, use archive API for reliability
        is_historical = target_date < (today - timedelta(days=5))

        if is_historical:
            weather_data = self._fetch_archive_weather(latitude, longitude, target_date)
        else:
            weather_data = self._fetch_forecast_weather(latitude, longitude, target_date)

        self._save_to_cache(latitude, longitude, date_str, weather_data)
        return weather_data

    def _fetch_forecast_weather(
        self, latitude: float, longitude: float, target_date: date
    ) -> WeatherResponse:
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": [
                "temperature_2m_mean",
                "temperature_2m_max",
                "temperature_2m_min",
                "relative_humidity_2m_mean",
                "precipitation_sum",
                "wind_speed_10m_max",
                "shortwave_radiation_sum",
            ],
            "wind_speed_unit": "ms",
            "timezone": "auto",
            "past_days": 7,
            "forecast_days": 16,
        }

        data = self._make_request(OPEN_METEO_FORECAST_URL, params)
        return self._parse_daily_response(data, target_date, source="Open-Meteo", data_type="forecast")

    def _fetch_archive_weather(
        self, latitude: float, longitude: float, target_date: date
    ) -> WeatherResponse:
        date_str = target_date.isoformat()
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": date_str,
            "end_date": date_str,
            "daily": [
                "temperature_2m_mean",
                "temperature_2m_max",
                "temperature_2m_min",
                "relative_humidity_2m_mean",
                "precipitation_sum",
                "wind_speed_10m_max",
                "shortwave_radiation_sum",
            ],
            "wind_speed_unit": "ms",
            "timezone": "auto",
        }

        data = self._make_request(OPEN_METEO_ARCHIVE_URL, params)
        return self._parse_daily_response(data, target_date, source="Open-Meteo Historical", data_type="archive")

    def _make_request(self, url: str, params: Dict[str, Any]) -> Dict[str, Any]:
        last_error = None
        for attempt in range(HTTP_MAX_RETRIES + 1):
            try:
                with httpx.Client(timeout=HTTP_TIMEOUT_SECONDS) as client:
                    response = client.get(url, params=params)
                    if response.status_code == 200:
                        return response.json()
                    elif response.status_code == 400:
                        detail = response.json().get("reason", response.text)
                        raise ValueError(f"Open-Meteo validation error: {detail}")
                    else:
                        raise RuntimeError(
                            f"Open-Meteo returned HTTP {response.status_code}: {response.text}"
                        )
            except Exception as exc:
                last_error = exc
                logger.warning(
                    "Weather API request attempt %d failed: %s", attempt + 1, exc
                )
                time.sleep(0.01 * (attempt + 1))

        raise RuntimeError(
            f"Failed to connect to weather data service ({url}): {last_error}"
        )

    def _parse_daily_response(
        self, data: Dict[str, Any], target_date: date, source: str, data_type: str
    ) -> WeatherResponse:
        daily = data.get("daily")
        if not daily or "time" not in daily:
            raise ValueError(f"Weather API response does not contain daily data for {target_date.isoformat()}")

        times = daily["time"]
        date_str = target_date.isoformat()

        if date_str not in times:
            raise ValueError(
                f"Requested prediction date {date_str} is not available in weather data. "
                f"Available dates: {times[0]} to {times[-1]}."
            )

        idx = times.index(date_str)

        def get_val(key: str, default: Optional[float] = None) -> Optional[float]:
            arr = daily.get(key)
            if arr is not None and idx < len(arr):
                val = arr[idx]
                if val is not None:
                    return float(val)
            return default

        temp_max = get_val("temperature_2m_max")
        temp_min = get_val("temperature_2m_min")
        temp_mean = get_val("temperature_2m_mean")

        if temp_max is None or temp_min is None:
            raise ValueError(f"Temperature data is missing for {date_str}")

        if temp_mean is None:
            temp_mean = round((temp_max + temp_min) / 2.0, 2)

        rel_humidity = get_val("relative_humidity_2m_mean")
        if rel_humidity is None:
            # If humidity is not directly in daily, estimate or validate
            raise ValueError(f"Relative humidity data is missing for {date_str}")

        precip = get_val("precipitation_sum", 0.0)
        if precip is None:
            precip = 0.0

        wind_speed = get_val("wind_speed_10m_max")
        if wind_speed is None:
            raise ValueError(f"Wind speed data is missing for {date_str}")

        shortwave_radiation_mj = get_val("shortwave_radiation_sum")
        if shortwave_radiation_mj is None:
            raise ValueError(f"Solar radiation data is missing for {date_str}")

        # Unit conversion: Open-Meteo shortwave_radiation_sum is in MJ/m²/day
        # 1 kWh = 3.6 MJ -> kWh/m²/day = MJ/m²/day / 3.6
        solar_radiation_kwh = round(shortwave_radiation_mj / 3.6, 4)

        return WeatherResponse(
            date=date_str,
            temperature_mean_c=round(temp_mean, 2),
            temperature_max_c=round(temp_max, 2),
            temperature_min_c=round(temp_min, 2),
            relative_humidity_percent=round(rel_humidity, 2),
            precipitation_mm_day=round(precip, 2),
            wind_speed_m_s=round(wind_speed, 2),
            solar_radiation_kwh_m2_day=round(solar_radiation_kwh, 4),
            source=source,
            data_type=data_type,
        )


weather_service = WeatherService()
