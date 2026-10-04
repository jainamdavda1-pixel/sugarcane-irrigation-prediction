# ML-Based Sugarcane Irrigation Requirement Prediction System for India

An integrated machine learning system for predicting a **simulated daily irrigation-deficit proxy (mm/day)** for sugarcane crops across India. This system eliminates manual weather parameter entry for farmers by automatically pulling real-time, forecast, and historical weather data via **Open-Meteo**, and querying high-resolution 250m surface soil properties via **OpenLandMap**.

---

## 🌾 Farmer Workflow Overview

1. **Location Entry**: Farmers choose a location using GPS, location search (e.g., *Kolhapur, Meerut, Belagavi, Coimbatore*), or latitude/longitude coordinates.
2. **Planting Date**: Farmers provide the sugarcane sowing/planting date to evaluate the crop stage and age.
3. **Prediction Date**: Defaults to today (or any date within the 16-day forecast horizon or past historical records).
4. **Automated Weather & Soil Fetching**:
   - **Open-Meteo API**: Automatically fetches daily mean/min/max temperature, relative humidity, precipitation, wind speed, and shortwave solar radiation (converted from MJ/m² to kWh/m²/day).
   - **OpenLandMap 250m Rasters**: Samples all-India surface soil pH, organic carbon (SOC), and clay fraction from GeoTIFF rasters with zero external network dependency.
5. **Exact Feature Engineering**: Reconstructs the exact 11 training features including cyclical `sin_day_of_year` and `cos_day_of_year`.
6. **Dual-Model Inference**: Evaluates the input using pre-trained **Random Forest Regressor** and **XGBoost Regressor** pipelines (`.joblib` models).
7. **Interactive Dashboard**: Displays predictions, weather breakdown, soil properties, and experimental-estimate disclaimers.

---

## 🧠 Model Specifications & 11 Input Features

The trained models predict a simulated daily irrigation-deficit proxy (mm/day). The 11 input features are strictly ordered as follows:

| # | Feature Name | Unit / Description | Source / Calculation |
|---|---|---|---|
| 1 | `latitude` | Decimal degrees (-90 to 90) | Farmer input / GPS / Geocoding |
| 2 | `longitude` | Decimal degrees (-180 to 180) | Farmer input / GPS / Geocoding |
| 3 | `temperature_mean_c` | °C (Mean temperature) | Open-Meteo (`temperature_2m_mean`) |
| 4 | `temperature_max_c` | °C (Maximum temperature) | Open-Meteo (`temperature_2m_max`) |
| 5 | `temperature_min_c` | °C (Minimum temperature) | Open-Meteo (`temperature_2m_min`) |
| 6 | `relative_humidity_percent` | % (Relative humidity) | Open-Meteo (`relative_humidity_2m_mean`) |
| 7 | `precipitation_mm_day` | mm/day (Precipitation) | Open-Meteo (`precipitation_sum`) |
| 8 | `wind_speed_m_s` | m/s (10m Wind Speed) | Open-Meteo (`wind_speed_10m_max`) |
| 9 | `solar_radiation_kwh_m2_day` | kWh/m²/day (Solar radiation) | Open-Meteo (`shortwave_radiation_sum` / 3.6) |
| 10 | `sin_day_of_year` | Float [-1, 1] | $\sin(2\pi \times \text{day\_of\_year} / 365.25)$ |
| 11 | `cos_day_of_year` | Float [-1, 1] | $\cos(2\pi \times \text{day\_of\_year} / 365.25)$ |

> **Note on Soil Properties & Crop Age**: Soil properties and crop age are displayed for context only. They are not passed to the 11-feature model input to preserve strict compatibility with the pre-trained weights.

---

## 🚀 Installation & Startup

### 1. Activate Environment & Install Dependencies
```bash
cd SugarcaneIrrigationML
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Install & Build the React Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Start the FastAPI Application Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Production React Dashboard**: [http://localhost:8000/](http://localhost:8000/)
- **FastAPI Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Optional: Run Frontend in Vite Hot-Reload Dev Mode
```bash
cd frontend
npm run dev
```
- **Vite Dev Server**: [http://localhost:5173/](http://localhost:5173/) (configured with `VITE_API_BASE_URL=http://localhost:8000`)

---

---

## 🔬 ML Research Lab & Experiment Analytics

The application features a dedicated **ML Research Lab** (`/model-lab`) that visualizes the verified experimental suite from `sugarcane_ml_experiments_results/`:

1. **Baseline Evaluation (`new_split_baseline_metrics.csv`)**: Evaluated on 56,606 train records (31 locations) and 14,608 held-out test records (8 unseen locations: `GJ02, GJ04, KA04, TN02, TN03, TS02, UP03, UP06`).
   - **Random Forest**: Train MAE = 0.1056 mm/day, Test MAE = **0.2156 mm/day**, $R^2 = 0.9971$.
   - **XGBoost**: Train MAE = 0.1758 mm/day, Test MAE = **0.2250 mm/day**, Test RMSE = **0.2939 mm/day**, $R^2 = 0.9975$.
2. **Learning Curves (`learning_curves.csv`)**: Model convergence across training set sample sizes (5,660 to 56,606 rows).
3. **Feature Importance & SHAP (`feature_importance.csv`, `shap_global_importance.csv`)**: Gini/Gain tree splits and game-theoretic SHAP beeswarm distributions.
4. **Feature Ablation (`feature_ablation_results.csv`)**: Performance degradation across 5 feature subsets (All 11 features, Without Location, Without Seasonal, Weather Only, Location & Seasonal Only).
5. **PCA Dimensionality Reduction (`pca_experiment_results.csv`)**: Compares 3, 5, and 8 principal components against raw tabular features.
6. **K-Means Weather Clustering (`weather_cluster_error_summary.csv`)**: Error breakdowns across 4 exploratory meteorological regimes (Monsoon, Cool Winter, Moderate Humid, Hot/Semi-Arid).
7. **1D Prediction Sensitivity (`prediction_sensitivity.csv`)**: Interactive single-variable sweeps across min-max ranges holding other variables at median reference values.
8. **Location-Wise Generalization (`location_wise_errors_new_split.csv`)**: District-level generalization errors and residual distributions ($y - \hat{y}$).
9. **Data Quality & Lineage Audit (`data_quality.csv`)**: Feature completeness confirming 100% missingness for unmodeled field inputs and 0% missingness for the 11 model inputs.

---

## 📡 API Endpoints

### 1. Health Check: `GET /health`
```json
{
  "status": "healthy",
  "random_forest_loaded": true,
  "xgboost_loaded": true,
  "models_path": "/path/to/Models"
}
```

### 2. Experiment Summary: `GET /experiments/summary`
Returns master dataset metadata, split details, and baseline metrics from `experiment_summary.json`.

### 3. Location Geocoding: `GET /geocode?q=Kolhapur`
```json
[
  {
    "id": 1266205,
    "name": "Kolhapur",
    "latitude": 16.7050,
    "longitude": 74.2433,
    "country": "India",
    "admin1": "Maharashtra",
    "admin2": "Kolhapur"
  }
]
```

### 4. Weather Data: `GET /weather?latitude=16.7050&longitude=74.2433&prediction_date=2026-10-02`
```json
{
  "date": "2026-10-02",
  "temperature_mean_c": 27.2,
  "temperature_max_c": 32.3,
  "temperature_min_c": 23.0,
  "relative_humidity_percent": 59.0,
  "precipitation_mm_day": 0.2,
  "wind_speed_m_s": 4.12,
  "solar_radiation_kwh_m2_day": 6.3667,
  "source": "Open-Meteo",
  "data_type": "forecast"
}
```

### 5. Soil Properties: `GET /api/soil?lat=16.7050&lon=74.2433`
```json
{
  "source": "OpenLandMap",
  "status": "available",
  "properties": {
    "soil_ph": { "value": 68.0, "raw_value": 68.0, "unit": "dataset scale; verify before display", "depth": "surface band b0", "source": "OpenLandMap", "resolution_m": 250 },
    "soil_organic_carbon": { "value": 2.0, "raw_value": 2.0, "unit": "dataset scale; verify before display", "depth": "surface band b0", "source": "OpenLandMap", "resolution_m": 250 },
    "clay_content": { "value": 44.0, "raw_value": 44.0, "unit": "dataset scale; verify before display", "depth": "surface band b0", "source": "OpenLandMap", "resolution_m": 250 }
  },
  "model_input": false,
  "notice": "Mapped soil context only. These properties are not inputs to the current irrigation prediction models."
}
```

### 6. Prediction: `POST /predict`
#### Request Payload:
```json
{
  "latitude": 16.7050,
  "longitude": 74.2433,
  "planting_date": "2026-06-15",
  "prediction_date": "2026-10-02",
  "location_name": "Kolhapur, Maharashtra"
}
```

#### Response Payload:
```json
{
  "location": {
    "latitude": 16.705,
    "longitude": 74.2433,
    "name": "Kolhapur, Maharashtra"
  },
  "planting_date": "2026-06-15",
  "prediction_date": "2026-10-02",
  "crop_age_days": 109,
  "weather": {
    "date": "2026-10-02",
    "temperature_mean_c": 27.2,
    "temperature_max_c": 32.3,
    "temperature_min_c": 23.0,
    "relative_humidity_percent": 59.0,
    "precipitation_mm_day": 0.2,
    "wind_speed_m_s": 4.12,
    "solar_radiation_kwh_m2_day": 6.3667,
    "source": "Open-Meteo",
    "data_type": "forecast"
  },
  "soil": {
    "source": "OpenLandMap",
    "status": "available",
    "properties": {
      "soil_ph": { "value": 68.0, "raw_value": 68.0, "unit": "pH" },
      "soil_organic_carbon": { "value": 2.0, "raw_value": 2.0, "unit": "g/kg" },
      "clay_content": { "value": 44.0, "raw_value": 44.0, "unit": "%" }
    },
    "model_input": false
  },
  "features_used": {
    "latitude": 16.705,
    "longitude": 74.2433,
    "temperature_mean_c": 27.2,
    "temperature_max_c": 32.3,
    "temperature_min_c": 23.0,
    "relative_humidity_percent": 59.0,
    "precipitation_mm_day": 0.2,
    "wind_speed_m_s": 4.12,
    "solar_radiation_kwh_m2_day": 6.3667,
    "sin_day_of_year": -0.999833,
    "cos_day_of_year": 0.018277
  },
  "predictions": {
    "random_forest_prediction_mm_day": 13.3708,
    "xgboost_prediction_mm_day": 12.6373
  },
  "target_definition": "Simulated daily irrigation-deficit proxy",
  "experimental_only": true,
  "warning": "This estimate is based on a formula-generated training target and is not a validated irrigation recommendation."
}
```

---

## 🧪 Running Automated Tests

Run the full pytest suite (26 tests covering weather parsing, unit conversions, soil providers, model inference, cyclic date harmonic calculations, and API endpoints):

```bash
pytest -v
```

---

## 📦 Repository Hygiene & Local Artifacts

### 1. Intentionally Ignored Files (`.gitignore`)
- **Virtual Environments**: `.venv/`, `venv/`, `env/`
- **Node Dependencies & Build Caches**: `node_modules/`, `dist/`, `.vite/`
- **Environment & Secrets**: `.env`, `.env.*` (use `.env.example` as a template)
- **Caches & Bytecode**: `__pycache__/`, `*.pyc`, `.pytest_cache/`, `.DS_Store`
- **Temporary Notebook Checkpoints**: `.ipynb_checkpoints/`

### 2. Required Local Artifacts
To run the prediction system locally, the following files must be present:
1. **Production ML Models** (`Models/`):
   - `Models/random_forest.joblib` (~397 MB): Pre-trained 200-tree Random Forest Regressor.
   - `Models/xgboost.joblib` (~1.4 MB): Pre-trained 100-tree XGBoost Regressor.
   > *Note regarding Git LFS*: GitHub has a 100 MB file limit. If committing to GitHub, track `Models/random_forest.joblib` via [Git LFS](https://git-lfs.com) (`git lfs track "*.joblib"`) or host it on an external release repository.
2. **ML Experiment Suite** (`sugarcane_ml_experiments_results/`):
   - `experiment_summary.json` & `experiment_split_info.json`
   - `tables/` (12 CSV tables)
   - `plots/` (24 PNG visualization plots)
3. **Environment Setup**:
   - Copy `.env.example` to `.env` (backend) and `frontend/.env.example` to `frontend/.env`.


