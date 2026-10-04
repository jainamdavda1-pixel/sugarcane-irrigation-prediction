# ML-Based Sugarcane Irrigation Requirement Prediction System for India

<<<<<<< HEAD
An integrated machine learning system for predicting a **simulated daily irrigation-deficit proxy (mm/day)** for sugarcane crops across India. This system eliminates manual weather parameter entry for farmers by automatically pulling real-time, forecast, and historical weather data via **Open-Meteo**, and querying high-resolution 250m surface soil properties via **OpenLandMap**.
=======
A full-stack experimental decision-support prototype that combines **Random Forest** and **XGBoost regression**, weather retrieval, optional soil context, and an ML Research Lab to estimate a daily irrigation-deficit proxy for a selected location and date.
>>>>>>> d3fc4ccb213c2e4ba1c51f6125d8a173087e77d3



<<<<<<< HEAD
1. **Location Entry**: Farmers choose a location using GPS, location search (e.g., *Kolhapur, Meerut, Belagavi, Coimbatore*), or latitude/longitude coordinates.
2. **Planting Date**: Farmers provide the sugarcane sowing/planting date to evaluate the crop stage and age.
3. **Prediction Date**: Defaults to today (or any date within the 16-day forecast horizon or past historical records).
4. **Automated Weather & Soil Fetching**:
   - **Open-Meteo API**: Automatically fetches daily mean/min/max temperature, relative humidity, precipitation, wind speed, and shortwave solar radiation (converted from MJ/m² to kWh/m²/day).
   - **OpenLandMap 250m Rasters**: Samples all-India surface soil pH, organic carbon (SOC), and clay fraction from GeoTIFF rasters with zero external network dependency.
5. **Exact Feature Engineering**: Reconstructs the exact 11 training features including cyclical `sin_day_of_year` and `cos_day_of_year`.
6. **Dual-Model Inference**: Evaluates the input using pre-trained **Random Forest Regressor** and **XGBoost Regressor** pipelines (`.joblib` models).
7. **Interactive Dashboard**: Displays predictions, weather breakdown, soil properties, and experimental-estimate disclaimers.
=======
## Contents
>>>>>>> d3fc4ccb213c2e4ba1c51f6125d8a173087e77d3

- [Project overview](#project-overview)
- [Current capabilities](#current-capabilities)
- [System architecture](#system-architecture)
- [Dataset and target construction](#dataset-and-target-construction)
- [Machine-learning features](#machine-learning-features)
- [Model evaluation results](#model-evaluation-results)
- [Research experiments](#research-experiments)
- [Data sources and integrations](#data-sources-and-integrations)
- [Repository structure](#repository-structure)
- [Setup and running locally](#setup-and-running-locally)
- [API endpoints](#api-endpoints)
- [Testing](#testing)
- [Model files and Git LFS](#model-files-and-git-lfs)
- [Known limitations and next steps](#known-limitations-and-next-steps)

## Project overview

The application is designed to demonstrate how a farmer-facing interface could collect a location and prediction date, retrieve weather data, prepare the feature vector expected by the trained models, and display estimates from two regressors. Planting date is collected to calculate crop age for display, but **planting date and crop age are not model inputs** in the current model version.

The project has two primary user experiences:

1. **Farmer Dashboard** — location/date input, weather information, optional soil context, and predictions from both models.
2. **ML Research Lab** — evaluation metrics and exploratory analyses such as feature importance, SHAP summaries, feature ablation, learning curves, PCA, sensitivity analysis, residuals, location-wise errors, and weather clustering.

## Current capabilities

- FastAPI backend with prediction, health, geocoding, weather, soil, and experiment-summary endpoints.
- React + TypeScript + Vite frontend.
- Random Forest and XGBoost model inference using a fixed 11-feature schema.
- Open-Meteo weather/geocoding integration.
- SoilGrids integration attempt with optional local-raster fallback; soil properties are supplementary context only.
- Cached weather, geocoding, and soil responses.
- Experiment summary tables and plot assets in the repository.
- Automated pytest tests for API and service behavior.

## System architecture

The system is organized into four layers: **presentation**, **API and orchestration**, **data integrations**, and **ML inference / research assets**. The Farmer Dashboard and ML Research Lab are separate user experiences that share the same frontend and backend, but they serve different purposes.

### High-level system architecture

The diagram below separates the **user experience**, **API orchestration**, **external data services**, **model inference**, and **research artifacts**. Solid arrows represent the main application flow; dashed arrows represent supplementary context or research data.

```mermaid
flowchart TB
    USER([Farmer / Researcher])

    subgraph PRESENTATION["01 · PRESENTATION — React + TypeScript + Vite"]
        direction LR
        DASH["🌱 Farmer Dashboard<br/>Location · Date · Weather · Estimates"]
        LAB["📊 ML Research Lab<br/>Metrics · Experiments · Plots"]
        METHOD["📘 Methodology<br/>Data sources · Limitations"]
    end

    subgraph APPLICATION["02 · APPLICATION API — FastAPI"]
        direction LR
        API["REST Endpoints<br/>Predict · Weather · Soil · Geocode"]
        VALIDATE["Request Validation<br/>Schemas · Units · Error Handling"]
        ORCH["Prediction Orchestrator"]
        CACHE[("Response Cache")]
        API --> VALIDATE --> ORCH
        API <--> CACHE
    end

    subgraph DATA["03 · DATA INTEGRATIONS"]
        direction LR
        WEATHER["Open-Meteo<br/>Weather + Geocoding"]
        SOIL["Soil Context<br/>SoilGrids / Local Rasters"]
    end

    subgraph INFERENCE["04 · ML INFERENCE — Saved Models"]
        direction LR
        FEATURES["Feature Engineering<br/>Fixed 11-feature schema"]
        RF["Random Forest<br/>Regressor"]
        XGB["XGBoost<br/>Regressor"]
        OUTPUT["Two Independent Estimates<br/>mm/day + Experimental Warning"]
        FEATURES --> RF
        FEATURES --> XGB
        RF --> OUTPUT
        XGB --> OUTPUT
    end

    subgraph RESEARCH["05 · RESEARCH ARTIFACTS"]
        direction LR
        RESULTS["Metrics + CSV Tables"]
        PLOTS["Plots + Analysis Outputs"]
        FRONTDATA["Frontend Experiment Data"]
    end

    USER --> DASH
    USER --> LAB
    DASH <-->|"HTTP / JSON"| API
    LAB --> FRONTDATA
    METHOD -.-> FRONTDATA
    ORCH <--> CACHE
    CACHE <--> WEATHER
    CACHE <--> SOIL
    ORCH --> FEATURES
    OUTPUT --> API
    RESULTS -.-> FRONTDATA
    PLOTS -.-> LAB

    classDef user fill:#172554,stroke:#60A5FA,color:#FFFFFF,stroke-width:2px;
    classDef presentation fill:#EFF6FF,stroke:#60A5FA,color:#172554,stroke-width:1.5px;
    classDef api fill:#ECFDF5,stroke:#34D399,color:#064E3B,stroke-width:1.5px;
    classDef data fill:#FFF7ED,stroke:#FB923C,color:#7C2D12,stroke-width:1.5px;
    classDef model fill:#F5F3FF,stroke:#A78BFA,color:#4C1D95,stroke-width:1.5px;
    classDef research fill:#FDF2F8,stroke:#F472B6,color:#831843,stroke-width:1.5px;

    class USER user;
    class DASH,LAB,METHOD presentation;
    class API,VALIDATE,ORCH,CACHE api;
    class WEATHER,SOIL data;
    class FEATURES,RF,XGB,OUTPUT model;
    class RESULTS,PLOTS,FRONTDATA research;
```


### Layer responsibilities

| Layer / component | Responsibility | Important boundary |
|---|---|---|
| Farmer Dashboard | Collects location, planting date, and prediction date; presents weather and both estimates | Planting date is contextual in the current model version; it does not affect inference |
| ML Research Lab | Presents model metrics, experiment summaries, plots, and error analyses | Some displayed experiment values are maintained in a typed frontend data module rather than loaded dynamically from every CSV |
| FastAPI routes and schemas | Validates requests, exposes REST endpoints, and returns structured responses | API success does not by itself prove model artifacts loaded or that outputs are agronomically valid |
| Weather service | Retrieves daily weather and geocoding data from Open-Meteo, with caching | Must not silently replace missing required weather values with arbitrary defaults |
| Soil context service | Attempts to retrieve soil data and optionally read local rasters | Soil properties are supplementary only; current models do not use them |
| Feature engineering | Converts weather/location/date into the exact 11 model inputs in the documented order | Feature names, units, preprocessing, and order must match training |
| Random Forest and XGBoost | Produce two independent estimates of the simulated target | Predictions should not be averaged or treated as calibrated uncertainty without additional evaluation |
| Experiment assets | Store metrics, split metadata, tables, and plot files used by research views | Research results must be traceable to the relevant split and experiment procedure |

### Prediction boundary and interpretation

The inference path is:

1. The user chooses a location and prediction date; the app retrieves weather for that location/date.
2. The backend validates required weather fields and derives the seasonal features `sin_day_of_year` and `cos_day_of_year`.
3. The backend constructs the fixed, ordered 11-feature vector and sends it to both saved models.
4. The API returns the two independent model estimates, relevant weather/context information, and the experimental-use warning.
5. The frontend labels the output as a **simulated daily irrigation-deficit proxy (mm/day)**, not as measured water demand or a validated irrigation schedule.

Soil data and planting date may be displayed as context, but neither is included in the current model feature vector. The research dashboard is an analytical view of saved experiment results; it is not a separate inference model.

## Dataset and target construction

The experiment metadata describes a dataset with **71,214 daily records**, **39 candidate Indian locations**, and **47 columns**. These are location-weather records; they should not be interpreted as 71,214 independent farm trials or as evidence that sugarcane was planted at every location on every recorded day.

The target column is `irrigation_requirement_mm`. It is a **simulated daily net irrigation-deficit proxy in mm/day**, generated from weather/date/location-derived calculations rather than measured irrigation events.

The documented target-construction approach is:

1. Calculate reference evapotranspiration (`ET0`) using the Hargreaves–Samani method, based on temperature range, mean temperature, latitude, and date-derived extraterrestrial radiation.
2. Calculate a crop evapotranspiration proxy: `ETc_proxy = 1.20 × ET0`, using a fixed assumed crop coefficient.
3. Calculate effective rainfall proxy: `effective_rainfall_proxy = min(0.80 × precipitation, ETc_proxy)`.
4. Calculate the target: `irrigation_requirement_mm = max(ETc_proxy − effective_rainfall_proxy, 0)`.

The fixed crop coefficient and effective-rainfall fraction are assumptions, not field-calibrated parameters. This target construction does not account for measured soil-water storage, crop stage, irrigation method, irrigation efficiency, field management, or observed irrigation events.

### Dataset quality context

The bundled `data_quality.csv` reports:

- All 11 model input features have 0% missing values in the summarized dataset.
- Soil properties have approximately **89.744% missingness** in that dataset.
- Field ID, crop variety, planting/harvest dates, growth stage, irrigation method, water source, and previous irrigation are 100% missing in that dataset summary.
- The model therefore does not currently use soil properties or crop-stage variables.

The raw training dataset is not included in this repository snapshot; the experiment summaries, tables, and plots are included.

## Machine-learning features

Both models expect these **11 features in this exact order**:

| # | Feature | Unit / meaning | Source |
|---:|---|---|---|
| 1 | `latitude` | Decimal degrees | Selected coordinates / geocoding |
| 2 | `longitude` | Decimal degrees | Selected coordinates / geocoding |
| 3 | `temperature_mean_c` | °C | Open-Meteo daily mean temperature |
| 4 | `temperature_max_c` | °C | Open-Meteo daily maximum temperature |
| 5 | `temperature_min_c` | °C | Open-Meteo daily minimum temperature |
| 6 | `relative_humidity_percent` | % | Open-Meteo daily mean relative humidity |
| 7 | `precipitation_mm_day` | mm/day | Open-Meteo daily precipitation sum |
| 8 | `wind_speed_m_s` | m/s | Open-Meteo daily maximum 10 m wind speed |
| 9 | `solar_radiation_kwh_m2_day` | kWh/m²/day | Open-Meteo shortwave radiation sum converted from MJ/m²/day by dividing by 3.6 |
| 10 | `sin_day_of_year` | -1 to 1 | Seasonal encoding: `sin(2π × day_of_year / 365.25)` |
| 11 | `cos_day_of_year` | -1 to 1 | Seasonal encoding: `cos(2π × day_of_year / 365.25)` |

**Not model inputs:** planting date, crop age, soil pH, texture, bulk density, soil organic carbon, CEC, crop variety, and growth stage. The current app may display some of these as context, but they do not influence the predictions.

## Model evaluation results

The bundled `experiment_summary.json` and `tables/new_split_baseline_metrics.csv` report the following metrics. The reported split contains **56,606 training records across 31 locations** and **14,608 evaluation records across 8 listed held-out locations**.

| Model | Split | Records | MAE (mm/day) | RMSE (mm/day) | R² |
|---|---|---:|---:|---:|---:|
| Random Forest | Train | 56,606 | 0.1056 | 0.1626 | 0.9993 |
| Random Forest | Reported held-out locations | 14,608 | **0.2156** | 0.3197 | 0.9971 |
| XGBoost | Train | 56,606 | 0.1758 | 0.2295 | 0.9986 |
| XGBoost | Reported held-out locations | 14,608 | 0.2250 | **0.2939** | **0.9975** |

### How to interpret these metrics

- **MAE** is the average absolute prediction error, expressed here in mm/day.
- **RMSE** penalizes larger errors more strongly than MAE and is also expressed in mm/day.
- **R²** measures fit relative to the variance of the target in the evaluation data; it is not a measure of real-world irrigation usefulness.
- In the reported evaluation, Random Forest has a slightly lower MAE, while XGBoost has a lower RMSE and slightly higher R². These metrics do not establish a universally superior model.
- The target itself is formula-derived. Strong metrics primarily show that the model can reproduce that constructed proxy; they do **not** demonstrate accuracy against actual farm irrigation requirements.
- Before making a strong claim of geographic generalization, verify the training notebook/model provenance and confirm that the saved models were not trained on any of the evaluation records or locations. The repository contains split metadata but does not include the original training notebook or raw training dataset needed to independently reproduce that separation.

## Research experiments

The `sugarcane_ml_experiments_results/` directory contains experiment summaries, CSV tables, and plots used by the ML Research Lab.

| Experiment | Purpose | Important caveat |
|---|---|---|
| Baseline evaluation | MAE, RMSE, and R² comparison | Measures performance against the simulated target |
| Learning curves | Observe error as training data size increases | Depends on split and training procedure |
| Feature importance | Compare tree-model importance | Importance is not causality |
| SHAP summaries | Explain feature contributions to model output | Explanations are for this model and target, not agronomic causal effects |
| Feature ablation | Compare selected feature groups | Results depend on experimental setup and retraining/evaluation methodology |
| PCA | Explore lower-dimensional representations | Dimensionality reduction may reduce interpretability and model performance |
| Sensitivity analysis | Sweep one feature while holding others at reference values | Synthetic sweeps can create unrealistic combinations of inputs |
| Location-wise errors/residuals | Inspect variation across locations | Small location counts and proxy target limit generalization claims |
| K-Means weather clusters | Explore weather-pattern groupings and errors | Clusters are exploratory, not validated agricultural climate classes |
| Data quality audit | Show missingness and available feature coverage | It summarizes the dataset used for experiments, not every future API response |

The frontend contains a typed experiment-data module (`frontend/src/data/experimentsData.ts`) with values corresponding to the experiment tables. If the experiment tables change, verify and update the frontend data module as well; it should not be assumed to load all CSV tables dynamically at runtime.

## Data sources and integrations

### Open-Meteo

Used for location search and daily weather retrieval. The service selects forecast or historical data according to the requested date and rejects dates outside the supported forecast horizon. The app should display the source/date type and should not silently substitute arbitrary weather defaults when required values are unavailable.

- Weather documentation: https://open-meteo.com/en/docs
- Historical weather documentation: https://open-meteo.com/en/docs/historical-weather-api
- Geocoding documentation: https://open-meteo.com/en/docs/geocoding-api

Check the provider's current terms, availability, and usage limits before public or commercial deployment.

### ISRIC SoilGrids

The app attempts to retrieve soil properties and can optionally read local GeoTIFF rasters when available. SoilGrids REST availability should not be assumed. This repository contains a placeholder under `data/soilgrids/`, not a complete set of raster data. If soil data is unavailable, the app is intended to report that fact rather than invent values.

- SoilGrids information: https://www.isric.org/explore/soilgrids/
- SoilGrids documentation: https://docs.isric.org/globaldata/soilgrids/

**Important implementation note:** review the SoilGrids parser's depth selection before relying on displayed depth labels. The current parser selects the first non-null depth value without explicitly matching the requested `0–30 cm` interval, so a value from a shallower interval could be labelled as `0–30 cm`.

## Repository structure

```text
.
├── app/
│   ├── core/config.py                 # Paths, API URLs, model feature order
│   ├── main.py                        # FastAPI routes and static serving
│   ├── schemas/irrigation.py          # Request/response schemas
│   └── services/
│       ├── irrigation_service.py      # Model loading, feature engineering, inference
│       ├── weather_service.py         # Open-Meteo integration and caching
│       └── soil_service.py            # SoilGrids / local raster provider
├── Models/
│   ├── random_forest.joblib           # Git LFS model artifact
│   └── xgboost.joblib                 # Git LFS model artifact
├── frontend/
│   ├── src/pages/                     # Dashboard, model lab, methodology, history
│   ├── src/components/                # UI components and charts
│   ├── src/data/experimentsData.ts    # Experiment values used by research views
│   └── public/plots/                  # Static plot images
├── sugarcane_ml_experiments_results/
│   ├── experiment_summary.json
│   ├── experiment_split_info.json
│   ├── tables/                        # Evaluation CSV files
│   └── plots/                         # Generated figures
├── tests/                             # Pytest suite
├── data/soilgrids/                    # Optional local soil rasters (not bundled)
├── .env.example
├── .gitattributes
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup and running locally

### Prerequisites

- Python with versions compatible with the serialized scikit-learn/XGBoost model artifacts.
- Node.js and npm.
- Git and Git LFS.
- Network access for Open-Meteo requests; SoilGrids may be unavailable.

### 1. Clone the repository and retrieve model artifacts

Use Git rather than downloading the repository as a ZIP when you need the actual model files:

```bash
git lfs install
git clone https://github.com/jainamdavda1-pixel/sugarcane-irrigation-prediction.git
cd sugarcane-irrigation-prediction
git lfs pull
```

GitHub source ZIP downloads may contain small Git LFS pointer files instead of the actual `.joblib` binaries. Verify the files before starting the API (see [Model files and Git LFS](#model-files-and-git-lfs)).

### 2. Set up the backend

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Start the backend from the repository root:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs
- Health endpoint: http://127.0.0.1:8000/health

The current backend configuration reads supported values from environment variables. Do not assume every variable shown in `.env.example` is consumed by the current config module; verify `app/core/config.py` before relying on a setting. For local defaults, a backend `.env` file is not required.

### 3. Set up the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
```

Create `frontend/.env` if needed, using the existing `frontend/.env.example` as a template:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run the frontend in development mode:

```bash
npm run dev
```

Open the URL printed by Vite, typically http://localhost:5173.

To build the production frontend:

```bash
npm run build
```

After a production build, the backend serves `frontend/dist` when present.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Serves the built frontend when available; otherwise returns API status/endpoints |
| `GET` | `/health` | Reports whether model objects loaded and the configured model path |
| `GET` | `/docs` | Interactive API documentation |
| `GET` | `/geocode?q=Kolhapur` | Searches locations using Open-Meteo geocoding |
| `GET` | `/weather?latitude=16.705&longitude=74.243&prediction_date=2026-10-02` | Retrieves daily weather for a location/date |
| `GET` | `/soil?latitude=16.705&longitude=74.243` | Retrieves supplementary soil context when available |
| `GET` | `/experiments/summary` | Returns the experiment summary JSON |
| `POST` | `/predict` | Predicts using location/date workflow or legacy direct features |

### Farmer prediction request

```json
{
<<<<<<< HEAD
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
=======
  "latitude": 16.705,
>>>>>>> d3fc4ccb213c2e4ba1c51f6125d8a173087e77d3
  "longitude": 74.2433,
  "planting_date": "2026-06-15",
  "prediction_date": "2026-10-02",
  "location_name": "Kolhapur, Maharashtra"
}
```

<<<<<<< HEAD
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
=======
The response includes weather, optional soil context, the exact feature dictionary passed to the models, predictions from both models, crop age for display, and an experimental-use warning. The planting date is not passed into the model.
>>>>>>> d3fc4ccb213c2e4ba1c51f6125d8a173087e77d3

### Legacy direct-feature request

The API also supports supplying all 11 model features directly. This mode is intended mainly for testing and backward compatibility. Ensure the feature names and units match the table above.

## Testing

Run the backend test suite from the repository root:

```bash
pytest -v
```

The test suite contains 26 tests. Model-loading and inference tests require actual model binaries, not Git LFS pointer text. A successful health response alone should not be taken as proof that both models loaded; inspect the `random_forest_loaded` and `xgboost_loaded` fields.

Frontend checks:

```bash
cd frontend
npm ci
npm run build
npm run lint
```

## Model files and Git LFS

The repository tracks model artifacts through Git LFS:

- `Models/random_forest.joblib` — approximately 416 MB (LFS pointer metadata reports 416,259,514 bytes).
- `Models/xgboost.joblib` — approximately 1.48 MB (LFS pointer metadata reports 1,479,226 bytes).

Check whether the model files were downloaded as real binaries or remain LFS pointers:

```bash
git lfs ls-files
head -n 3 Models/random_forest.joblib
```

If `head` shows `version https://git-lfs.github.com/spec/v1`, the file is still a pointer. Retrieve the real objects with:

```bash
git lfs pull
```

Do not commit API keys, local `.env` files, virtual environments, `node_modules`, or temporary build outputs.


