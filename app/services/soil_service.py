import logging
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import httpx

from app.core.config import (
    HTTP_TIMEOUT_SECONDS,
    SOIL_CACHE_TTL_SECONDS,
    SOIL_DATA_DIR,
    SOILGRIDS_REST_URL,
)
from app.schemas.irrigation import SoilResponse

logger = logging.getLogger(__name__)

# ISRIC SoilGrids property conversion metadata
# SoilGrids v2 REST API and rasters use integer scaling factors:
# bdod: cg/cm³ -> divide by 100 to get g/cm³
# phh2o: pH*10 -> divide by 10 to get standard pH
# clay: g/kg -> divide by 10 to get % (or divide by 1 for g/kg)
# sand: g/kg -> divide by 10 to get %
# silt: g/kg -> divide by 10 to get %
# soc: dg/kg -> divide by 10 to get g/kg, divide by 100 to get %
# cec: mmol(c)/kg -> divide by 10 to get cmol(c)/kg
PROPERTY_METADATA = {
    "bdod": {
        "name": "Bulk Density",
        "raw_unit": "cg/cm³",
        "app_unit": "g/cm³",
        "scale": 0.01,
        "description": "Bulk density of the fine earth fraction",
    },
    "phh2o": {
        "name": "Soil pH",
        "raw_unit": "pH*10",
        "app_unit": "pH",
        "scale": 0.1,
        "description": "Soil pH in H2O solution",
    },
    "clay": {
        "name": "Clay Content",
        "raw_unit": "g/kg",
        "app_unit": "%",
        "scale": 0.1,
        "description": "Proportion of clay particles (<0.002 mm)",
    },
    "sand": {
        "name": "Sand Content",
        "raw_unit": "g/kg",
        "app_unit": "%",
        "scale": 0.1,
        "description": "Proportion of sand particles (0.05-2 mm)",
    },
    "silt": {
        "name": "Silt Content",
        "raw_unit": "g/kg",
        "app_unit": "%",
        "scale": 0.1,
        "description": "Proportion of silt particles (0.002-0.05 mm)",
    },
    "soc": {
        "name": "Soil Organic Carbon",
        "raw_unit": "dg/kg",
        "app_unit": "g/kg",
        "scale": 0.1,
        "description": "Soil organic carbon content in fine earth fraction",
    },
    "cec": {
        "name": "Cation Exchange Capacity",
        "raw_unit": "mmol(c)/kg",
        "app_unit": "cmol(c)/kg",
        "scale": 0.1,
        "description": "Cation exchange capacity at soil pH",
    },
}


class BaseSoilProvider(ABC):
    @abstractmethod
    def fetch_soil_data(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        """Fetch raw or mapped soil properties for the coordinates."""
        pass


class SoilGridsAPIProvider(BaseSoilProvider):
    """Live REST API client for SoilGrids (ISRIC)."""

    def __init__(self, api_url: str = SOILGRIDS_REST_URL, timeout: float = HTTP_TIMEOUT_SECONDS):
        self.api_url = api_url
        self.timeout = min(timeout, 5.0)  # fast failover if ISRIC REST is down

    def fetch_soil_data(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        properties = list(PROPERTY_METADATA.keys())
        params = {
            "lat": latitude,
            "lon": longitude,
            "property": properties,
            "depth": ["0-5cm", "0-30cm", "5-15cm", "15-30cm"],
            "value": ["mean"],
        }
        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.get(self.api_url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    return self._parse_api_response(data)
                else:
                    logger.debug("SoilGrids API returned status %d", resp.status_code)
        except Exception as exc:
            logger.debug("SoilGrids REST API request failed: %s", exc)
        return None

    def _parse_api_response(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parses ISRIC SoilGrids REST v2.0 JSON structure."""
        props = data.get("properties", {})
        layers = props.get("layers", [])
        if not layers:
            return None

        extracted = {}
        for layer in layers:
            name = layer.get("name")
            if name not in PROPERTY_METADATA:
                continue

            depths = layer.get("depths", [])
            # Prefer 0-30cm or 0-5cm depth
            val = None
            for d in depths:
                values = d.get("values", {})
                mean_val = values.get("mean")
                if mean_val is not None:
                    val = float(mean_val)
                    break

            if val is not None:
                meta = PROPERTY_METADATA[name]
                scale = meta["scale"]
                extracted[name] = {
                    "name": meta["name"],
                    "value": round(val * scale, 2),
                    "raw_value": val,
                    "unit": meta["app_unit"],
                    "description": meta["description"],
                    "depth": "0-30cm",
                }

        return extracted if extracted else None


class OfflineRasterSoilProvider(BaseSoilProvider):
    """
    Offline provider extracting soil properties from local raster files
    (e.g., ISRIC GeoTIFF downloads or NetCDF in data/soilgrids/).
    """

    def __init__(self, data_dir: Path = SOIL_DATA_DIR):
        self.data_dir = data_dir

    def fetch_soil_data(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        if not self.data_dir.exists():
            return None

        # Check for GeoTIFF raster files (e.g., phh2o_0-30cm_mean.tif)
        tif_files = list(self.data_dir.glob("*.tif")) + list(self.data_dir.glob("*.tiff"))
        if not tif_files:
            return None

        extracted = {}
        for prop_key, meta in PROPERTY_METADATA.items():
            matching = [f for f in tif_files if prop_key in f.name.lower()]
            if not matching:
                continue
            val = self._extract_raster_pixel(matching[0], latitude, longitude)
            if val is not None:
                scale = meta["scale"]
                extracted[prop_key] = {
                    "name": meta["name"],
                    "value": round(val * scale, 2),
                    "raw_value": val,
                    "unit": meta["app_unit"],
                    "description": meta["description"],
                    "depth": "0-30cm",
                }

        return extracted if extracted else None

    def _extract_raster_pixel(
        self, file_path: Path, latitude: float, longitude: float
    ) -> Optional[float]:
        try:
            import rasterio
            with rasterio.open(file_path) as dataset:
                row, col = dataset.index(longitude, latitude)
                if 0 <= row < dataset.height and 0 <= col < dataset.width:
                    val = dataset.read(1)[row, col]
                    if val != dataset.nodata and not (val < 0):
                        return float(val)
        except ImportError:
            logger.debug("rasterio not installed for GeoTIFF extraction.")
        except Exception as exc:
            logger.debug("Failed reading raster %s: %s", file_path, exc)
        return None


class SoilService:
    def __init__(self):
        self.api_provider = SoilGridsAPIProvider()
        self.offline_provider = OfflineRasterSoilProvider()
        self._cache: Dict[Tuple[float, float], Tuple[float, SoilResponse]] = {}

    def get_soil_properties(self, latitude: float, longitude: float) -> SoilResponse:
        key = (round(latitude, 3), round(longitude, 3))
        if key in self._cache:
            cached_time, cached_resp = self._cache[key]
            if time.time() - cached_time < SOIL_CACHE_TTL_SECONDS:
                return cached_resp
            del self._cache[key]

        # 1. Try Live API provider
        api_data = self.api_provider.fetch_soil_data(latitude, longitude)
        if api_data:
            resp = SoilResponse(
                available=True,
                source="SoilGrids (ISRIC REST v2.0)",
                depth_interval="0-30cm",
                properties=api_data,
                message="Soil properties retrieved successfully from ISRIC SoilGrids REST API.",
            )
            self._cache[key] = (time.time(), resp)
            return resp

        # 2. Try Offline Local Raster Provider
        offline_data = self.offline_provider.fetch_soil_data(latitude, longitude)
        if offline_data:
            resp = SoilResponse(
                available=True,
                source="SoilGrids (Local Offline Raster)",
                depth_interval="0-30cm",
                properties=offline_data,
                message="Soil properties extracted from local SoilGrids raster dataset.",
            )
            self._cache[key] = (time.time(), resp)
            return resp

        # 3. Graceful fallback when soil data is unavailable
        resp = SoilResponse(
            available=False,
            source="SoilGrids",
            depth_interval="0-30cm",
            properties={},
            message=(
                "Soil data unavailable for this location (ISRIC live endpoint unreachable and "
                "offline SoilGrids rasters not downloaded)."
            ),
        )
        self._cache[key] = (time.time(), resp)
        return resp


soil_service = SoilService()
