from functools import lru_cache
from pathlib import Path
from typing import Optional

import rasterio
from rasterio.warp import transform


DATA_DIR = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "openlandmap"
)

# Keep these as 1.0 until you verify the exported pixel scales.
# Change only after checking the official layer metadata.
PROPERTY_CONFIG = {
    "soil_ph": {
        "file": "India_Soil_pH_Surface.tif",
        "fallback_file": "soil_ph_surface.tif",
        "scale_factor": 1.0,
        "unit": "dataset scale; verify before display",
    },
    "soil_organic_carbon": {
        "file": "India_Soil_Organic_Carbon_Surface.tif",
        "fallback_file": "soil_carbon_surface.tif",
        "scale_factor": 1.0,
        "unit": "dataset scale; verify before display",
    },
    "clay_content": {
        "file": "India_Soil_Clay_Content_Surface.tif",
        "fallback_file": "soil_clay_surface.tif",
        "scale_factor": 1.0,
        "unit": "dataset scale; verify before display",
    },
}


@lru_cache(maxsize=3)
def _open_raster(file_path: str):
    """Reuse open raster datasets between requests."""
    return rasterio.open(file_path)


def _sample_property(
    property_name: str,
    latitude: float,
    longitude: float,
) -> Optional[dict]:
    config = PROPERTY_CONFIG[property_name]
    path = DATA_DIR / config["file"]
    if not path.exists() and "fallback_file" in config:
        path = DATA_DIR / config["fallback_file"]

    if not path.exists():
        return None

    dataset = _open_raster(str(path))

    # Raster coordinates may not be longitude/latitude.
    xs, ys = transform(
        "EPSG:4326",
        dataset.crs,
        [longitude],
        [latitude],
    )
    x, y = xs[0], ys[0]

    # Check whether the point is within the raster's coverage.
    if not (
        dataset.bounds.left <= x <= dataset.bounds.right
        and dataset.bounds.bottom <= y <= dataset.bounds.top
    ):
        return None

    sample = next(
        dataset.sample([(x, y)], masked=True)
    )[0]

    if sample is None or bool(
        getattr(sample, "mask", False)
    ):
        return None

    raw_value = float(sample)
    scale_factor = config["scale_factor"]

    return {
        "value": raw_value * scale_factor,
        "raw_value": raw_value,
        "unit": config["unit"],
        "depth": "surface band b0",
        "source": "OpenLandMap",
        "resolution_m": 250,
    }


def get_soil_context(
    latitude: float,
    longitude: float,
) -> dict:
    """Get supplementary mapped soil properties for a location."""
    properties = {}

    for property_name in PROPERTY_CONFIG:
        try:
            properties[property_name] = _sample_property(
                property_name,
                latitude,
                longitude,
            )
        except Exception:
            # A failed property should not crash the entire dashboard.
            properties[property_name] = None

    available_count = sum(
        value is not None
        for value in properties.values()
    )

    return {
        "source": "OpenLandMap",
        "status": (
            "available"
            if available_count == len(PROPERTY_CONFIG)
            else "partial"
            if available_count > 0
            else "unavailable"
        ),
        "properties": properties,
        "model_input": False,
        "notice": (
            "Mapped soil context only. These properties are not "
            "inputs to the current irrigation prediction models."
        ),
    }


# Compatibility wrapper for existing service architecture
class SoilService:
    @staticmethod
    def get_soil_properties(latitude: float, longitude: float) -> dict:
        return get_soil_context(latitude, longitude)


soil_service = SoilService()
