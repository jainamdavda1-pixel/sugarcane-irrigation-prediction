import logging
from datetime import date
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import MODELS_DIR, RF_MODEL_PATH, XGB_MODEL_PATH
from app.schemas.irrigation import (
    FarmerPredictionRequest,
    FarmerPredictionResponse,
    GeocodeResultItem,
    HealthResponse,
    SoilResponse,
    WeatherResponse,
)
from app.services.irrigation_service import irrigation_service
from app.services.soil_service import soil_service
from app.services.weather_service import weather_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("sugarcane_irrigation")

app = FastAPI(
    title="Sugarcane Irrigation Prediction API",
    description=(
        "ML-Based Sugarcane Irrigation Requirement Prediction System with automated "
        "Open-Meteo weather and OpenLandMap mapped soil context integration."
    ),
    version="2.0.0",
)

# CORS middleware for local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
STATIC_DIR = Path(__file__).resolve().parent / "static"
EXPERIMENTS_DIR = Path(__file__).resolve().parent.parent / "sugarcane_ml_experiments_results"
PLOTS_DIR = EXPERIMENTS_DIR / "plots"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")
elif STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if PLOTS_DIR.exists():
    app.mount("/plots", StaticFiles(directory=str(PLOTS_DIR)), name="plots")


@app.get("/experiments/summary", summary="Retrieve ML experiment results and baseline evaluation summary")
def get_experiments_summary():
    summary_file = EXPERIMENTS_DIR / "experiment_summary.json"
    if summary_file.exists():
        import json
        with open(summary_file, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Experiment summary not found.")


@app.get("/", summary="Root status or Dashboard")
def root():
    if FRONTEND_DIST.exists():
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
    if STATIC_DIR.exists():
        index_file = STATIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
    return {
        "message": "ML-Based Sugarcane Irrigation Requirement Prediction System",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "weather": "/weather",
            "soil": "/soil",
            "geocode": "/geocode",
            "docs": "/docs",
        },
    }


@app.get("/health", response_model=HealthResponse, summary="Check service and model health")
def health():
    return HealthResponse(
        status="healthy",
        random_forest_loaded=irrigation_service.rf_model is not None,
        xgboost_loaded=irrigation_service.xgb_model is not None,
        models_path=str(MODELS_DIR),
    )


@app.get("/geocode", response_model=List[GeocodeResultItem], summary="Search Indian and global locations")
def geocode(q: str = Query(..., min_length=2, description="Location search query (e.g. 'Pune', 'Kolhapur')")):
    try:
        results = weather_service.search_locations(q)
        formatted = []
        for r in results:
            formatted.append(
                GeocodeResultItem(
                    id=r.get("id"),
                    name=r.get("name", ""),
                    latitude=float(r.get("latitude", 0.0)),
                    longitude=float(r.get("longitude", 0.0)),
                    country=r.get("country"),
                    admin1=r.get("admin1"),
                    admin2=r.get("admin2"),
                )
            )
        return formatted
    except Exception as exc:
        logger.error("Geocoding failed for query %s: %s", q, exc)
        raise HTTPException(status_code=500, detail=f"Geocoding service error: {str(exc)}")


@app.get("/weather", response_model=WeatherResponse, summary="Fetch daily weather data from Open-Meteo")
def get_weather(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees"),
    prediction_date: Optional[date] = Query(None, description="Target date (YYYY-MM-DD), defaults to today"),
):
    try:
        target_date = prediction_date or date.today()
        return weather_service.get_daily_weather(latitude, longitude, target_date)
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        logger.error("Weather fetch failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"Failed to retrieve weather data: {str(exc)}")


@app.get("/soil", summary="Fetch soil properties from OpenLandMap")
@app.get("/api/soil", summary="Fetch soil properties from OpenLandMap (API prefix)")
def get_soil(
    lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Latitude in decimal degrees"),
    lon: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Longitude in decimal degrees"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Latitude in decimal degrees"),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Longitude in decimal degrees"),
):
    actual_lat = lat if lat is not None else latitude
    actual_lon = lon if lon is not None else longitude
    if actual_lat is None or actual_lon is None:
        raise HTTPException(status_code=400, detail="Missing required 'lat' (or 'latitude') and 'lon' (or 'longitude') parameters.")
    try:
        return soil_service.get_soil_properties(actual_lat, actual_lon)
    except Exception as exc:
        logger.error("Soil fetch failed: %s", exc)
        return {
            "source": "OpenLandMap",
            "status": "unavailable",
            "properties": {
                "soil_ph": None,
                "soil_organic_carbon": None,
                "clay_content": None,
            },
            "model_input": False,
            "notice": f"Error retrieving soil properties: {str(exc)}",
        }


@app.post("/predict", summary="Predict sugarcane irrigation deficit")
async def predict(request: Request):
    """
    Predict sugarcane irrigation requirement (deficit proxy in mm/day).
    Accepts farmer input (latitude, longitude, planting_date, optional prediction_date).
    If legacy raw 11 features are supplied, gracefully handles them for backward compatibility.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body in request.")

    # Check if request has 'planting_date' (Farmer workflow) or legacy direct features
    if "planting_date" in body:
        try:
            farmer_req = FarmerPredictionRequest(**body)
            return irrigation_service.predict_for_farmer(farmer_req)
        except ValueError as val_err:
            raise HTTPException(status_code=400, detail=str(val_err))
        except Exception as exc:
            logger.error("Farmer prediction failed: %s", exc)
            raise HTTPException(status_code=500, detail=f"Prediction pipeline error: {str(exc)}")
    else:
        # Legacy direct feature support
        try:
            from app.schemas.irrigation import LegacyIrrigationRequest
            legacy_req = LegacyIrrigationRequest(**body)
            pred_vals = irrigation_service.predict_from_features(legacy_req.model_dump())
            return {
                "random_forest_prediction_mm_day": pred_vals.random_forest_prediction_mm_day,
                "xgboost_prediction_mm_day": pred_vals.xgboost_prediction_mm_day,
                "target_definition": "Simulated daily irrigation-deficit proxy",
                "experimental_only": True,
                "warning": (
                    "Not a validated irrigation recommendation. "
                    "The models were trained on a formula-generated target."
                ),
            }
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid request format. Expected 'latitude', 'longitude', and 'planting_date'. Detail: {str(exc)}",
            )
