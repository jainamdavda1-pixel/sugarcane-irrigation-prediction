# ML-Based Sugarcane Irrigation Requirement Prediction System for India

A full-stack **experimental machine-learning prototype** that combines
weather data, two regression models, a Farmer Dashboard, and an ML
Research Lab to estimate a **simulated daily irrigation-deficit proxy**
for a selected location and date.



------------------------------------------------------------------------

## Contents

1.  [Project at a glance](#project-at-a-glance)
2.  [What the application does](#what-the-application-does)
3.  [System architecture](#system-architecture)
4.  [Dataset and target construction](#dataset-and-target-construction)
5.  [Why field area is not a model
    input](#why-field-area-is-not-a-model-input)
6.  [Model features](#model-features)
7.  [Models and evaluation](#models-and-evaluation)
8.  [ML Research Lab: concepts, results, and
    interpretation](#ml-research-lab-concepts-results-and-interpretation)
9.  [Data sources and soil context](#data-sources-and-soil-context)
10. [Repository structure](#repository-structure)
11. [Run locally](#run-locally)
12. [API endpoints](#api-endpoints)
13. [Testing and verification](#testing-and-verification)
14. [Limitations and responsible use](#limitations-and-responsible-use)
15. [Future work](#future-work)
16. [References](#references)

------------------------------------------------------------------------

## Project at a glance

  -----------------------------------------------------------------------
  Item                                Description
  ----------------------------------- -----------------------------------
  Project title                       ML-Based Sugarcane Irrigation
                                      Requirement Prediction System for
                                      India

  Application type                    Full-stack research / educational
                                      prototype

  Dataset summary                     71,214 daily location records, 39
                                      candidate Indian locations, 47
                                      columns

  Target                              Formula-generated daily net
                                      irrigation-deficit proxy, in mm/day

  Model type                          Supervised regression

  Models                              Random Forest Regressor and XGBoost
                                      Regressor

  Model inputs                        11 weather, location, and seasonal
                                      features

  Frontend                            React, TypeScript, Vite

  Backend                             FastAPI

  Weather and geocoding               Open-Meteo

  Training weather source described   NASA POWER
  in project materials                

  Supplementary context               Optional mapped soil information,
                                      if data is available and verified

  Research interface                  Ten ML experiments and data-quality
                                      analysis
  -----------------------------------------------------------------------

### The problem in simple words

Weather changes every day. Temperature, rainfall, humidity, wind and
solar radiation provide information about atmospheric water demand and
rainfall. This project explores whether machine-learning models can
learn the relationship between those inputs and a simplified daily
water-deficit target.

The project demonstrates an end-to-end workflow: prepare data, create a
target, train regression models, evaluate them, examine model behaviour,
expose predictions through an API, and present the results in a web
dashboard.

It is **not yet a validated farm-irrigation advisory system**.

------------------------------------------------------------------------

## What the application does

The application has two main user experiences.

### 1. Farmer Dashboard

The intended workflow is:

1.  The user selects a location and prediction date.
2.  The backend retrieves daily weather information for that location
    and date.
3.  The backend validates the required fields and prepares the model's
    11 inputs in the correct order.
4.  Random Forest and XGBoost produce two separate estimates of the
    simulated target.
5.  The interface displays the estimates with weather information and an
    experimental-use warning.
6.  Supplementary soil context may be shown if the relevant data is
    available and its values, units, depth and scale have been verified.

A planting date or crop age may be displayed for context, but **neither
is an input to the current models**. Soil properties are also not model
inputs.

The two model estimates are not a calibrated confidence interval. A
difference between the two predictions should not be interpreted as a
probability of error.

### 2. ML Research Lab

The Research Lab presents experiment results and visualizations to help
investigate model performance, feature contributions, sensitivity,
geographic differences and data quality.

It is an analytical view of saved experiment results. **Opening a
Research Lab tab does not necessarily retrain the models live.** Check
the implementation and data source for each chart before claiming that
it is dynamically recalculated.

### High-level architecture

``` mermaid
flowchart TD
    U[User] --> UI[React + TypeScript + Vite]
    UI --> FD[Farmer Dashboard]
    UI --> RL[ML Research Lab]
    FD --> API[FastAPI Backend]
    API --> W[Open-Meteo Weather / Geocoding]
    API --> FE[Feature Validation and Engineering]
    FE --> RF[Random Forest Regressor]
    FE --> XGB[XGBoost Regressor]
    RF --> OUT[Two Independent Proxy Estimates]
    XGB --> OUT
    OUT --> API
    API --> FD
    SOIL[Optional mapped soil context] -. supplementary only .-> FD
    EXP[Saved experiment tables and plots] --> RL
```

**Model boundary:** current prediction inputs are location, daily
weather and seasonal features only. Soil properties, field area,
planting date, crop age, crop variety, growth stage, irrigation method,
and prior irrigation are not current model inputs.

------------------------------------------------------------------------

## Dataset and target construction

### What one row represents

The dataset summary describes **71,214 daily location rows** across **39
candidate Indian locations** and 47 columns.

A row represents weather and derived values for a location on a
particular day. It is not a separate farm experiment. The data does not
establish that sugarcane was cultivated at every candidate location on
every recorded date.

### What is the target?

The target column is `irrigation_requirement_mm`. In the current
project, this name refers to a **simulated daily net irrigation-deficit
proxy in mm/day**, not measured irrigation events or validated
crop-water demand.

### Target-generation approach

The project uses the following simplified sequence:

1.  **Reference evapotranspiration (`ET0`)** is estimated using the
    Hargreaves--Samani method, which uses temperature-related
    information and location/date-based solar geometry.

2.  **Crop evapotranspiration proxy (`ETc_proxy`)** is calculated as
    `1.20 × ET0`.

3.  **Effective rainfall proxy** is calculated as
    `min(0.80 × precipitation, ETc_proxy)`.

4.  The target is calculated as:

    `irrigation_requirement_mm = max(ETc_proxy − effective_rainfall_proxy, 0)`

The factor `1.20` is an assumed crop coefficient. The `0.80` rainfall
factor is also a project assumption. These are not measured values
calibrated for every field, cultivar, crop stage or location.

### Why the target is only a proxy

The target calculation does not fully model or measure:

-   soil-water storage and current soil moisture;
-   crop age, crop stage, cultivar or root depth;
-   field area or farm-specific management;
-   irrigation method and application efficiency;
-   runoff, drainage, groundwater contribution or irrigation events;
-   measured water applied by farmers.

The models learn to approximate the target created by this formula. A
high evaluation score therefore demonstrates agreement with the
constructed target, not proof of actual irrigation accuracy.

------------------------------------------------------------------------

## Why field area is not a model input

The model predicts a **water depth** in millimetres per day. A depth
does not depend on the size of the field. Field area is needed to
convert the depth into a total volume.

For water depth in millimetres and field area in hectares:

`Theoretical volume (m³) = depth (mm) × area (ha) × 10`

Example:

-   Proxy depth: 5 mm/day
-   Field area: 2 hectares
-   Theoretical volume: `5 × 2 × 10 = 100 m³/day`

This is an arithmetic conversion, not an irrigation recommendation. It
does not account for application efficiency, soil-water availability,
crop stage, rainfall forecasts, or local management. Since the current
target is a simulated proxy, converting it into volume does not make it
a validated farm-water requirement.

------------------------------------------------------------------------

## Model features

Both models expect the following **11 features in this exact order**.

    \# Feature                        Meaning / unit
  ---- ------------------------------ ---------------------------------------
     1 `latitude`                     Location latitude in decimal degrees
     2 `longitude`                    Location longitude in decimal degrees
     3 `temperature_mean_c`           Daily mean temperature, °C
     4 `temperature_max_c`            Daily maximum temperature, °C
     5 `temperature_min_c`            Daily minimum temperature, °C
     6 `relative_humidity_percent`    Daily relative humidity, %
     7 `precipitation_mm_day`         Daily precipitation, mm/day
     8 `wind_speed_m_s`               Daily wind speed, m/s
     9 `solar_radiation_kwh_m2_day`   Daily solar radiation, kWh/m²/day
    10 `sin_day_of_year`              Sine encoding of the day of year
    11 `cos_day_of_year`              Cosine encoding of the day of year

Sine and cosine encode the annual calendar as a cycle. This avoids
treating the end of December and beginning of January as far apart in
the seasonal representation.

### Important feature boundary

The following are **not inputs to the current trained models**:

-   soil pH, texture, clay, organic carbon or other soil properties;
-   field area;
-   planting date and crop age;
-   crop variety and growth stage;
-   irrigation method, soil moisture and previous irrigation.

Do not describe the current model as soil-aware or crop-stage-aware.

### Training/live weather consistency

Project materials describe NASA POWER as the training weather source and
Open-Meteo as the live weather integration. Before real-world use,
verify that variable definitions, units, time aggregation, timezone/day
boundaries and missing-data handling are compatible. For example, a
daily maximum wind speed and a daily mean wind speed are not
interchangeable.

The backend should reject unavailable required weather values rather
than silently replacing them with arbitrary defaults.

------------------------------------------------------------------------

## Models and evaluation

### What is regression?

Regression is a machine-learning task where the output is a continuous
number. This project is a regression task because it predicts a numeric
depth in mm/day rather than a category such as "high" or "low."

### Random Forest Regressor

Random Forest trains multiple decision trees and combines their
predictions. It can learn nonlinear relationships in structured data and
often provides a stable baseline.

### XGBoost Regressor

XGBoost builds trees sequentially. Each new tree attempts to reduce
remaining prediction errors. It can model complex patterns in tabular
data but still requires careful evaluation and tuning.

### Evaluation split described in project results

The documented evaluation uses:

-   **56,606 training rows** from 31 locations;
-   **14,608 evaluation rows** from 8 held-out locations.

Holding out complete locations is more informative about geographic
transfer than randomly splitting daily rows from the same locations.
However, the original training notebook and raw training dataset were
not present in the reviewed repository snapshot. The exact split and
model-training provenance should be independently reproduced before
making strong geographic-generalization claims.

### Reported metrics

  ------------------------------------------------------------------------
  Model       Split           MAE (mm/day)   RMSE (mm/day)              R²
  ----------- ------------ --------------- --------------- ---------------
  Random      Training              0.1056          0.1626          0.9993
  Forest                                                   

  Random      Held-out        **0.215553**        0.319741        0.997057
  Forest      evaluation                                   
              locations                                    

  XGBoost     Training              0.1758          0.2295          0.9986

  XGBoost     Held-out            0.224959    **0.293889**    **0.997514**
              evaluation                                   
              locations                                    
  ------------------------------------------------------------------------

### How to interpret the metrics

-   **MAE (Mean Absolute Error):** the average absolute difference
    between prediction and target. Lower is better.
-   **RMSE (Root Mean Squared Error):** an error measure that penalizes
    larger errors more strongly than MAE. Lower is better.
-   **R² (R-squared):** measures how well predictions fit the target
    relative to a mean-based baseline. It is not a percentage-accuracy
    score.

On the reported held-out evaluation:

-   Random Forest has slightly lower MAE.
-   XGBoost has lower RMSE and slightly higher R².
-   The comparison is mixed; neither model wins on every metric.

Most importantly, these scores describe fit to a **formula-generated
target**, not agreement with measured farm irrigation.

------------------------------------------------------------------------

## ML Research Lab: concepts, results, and interpretation

The Research Lab contains ten analysis areas. The descriptions below
explain the concept, the reported project result, and the limits of
interpretation.

### 1. Baseline Metrics

**Theory:** Metrics summarize how close model predictions are to the
target.

**Reported result:** Random Forest has MAE 0.215553, RMSE 0.319741 and
R² 0.997057 on the held-out evaluation. XGBoost has MAE 0.224959, RMSE
0.293889 and R² 0.997514.

**Interpretation:** Random Forest has the lower average absolute error,
while XGBoost has lower RMSE and slightly higher R². The result is
mixed. These metrics describe fit to the simulated target only.

### 2. Architectures & Target

**Theory:** A target is the value the model learns to estimate. An
architecture is the learning approach used to map inputs to the target.

**Project context:** Both models use the same 11 features and the same
formula-derived target. Random Forest averages trees; XGBoost adds trees
sequentially to reduce remaining errors.

**Interpretation:** Using the same inputs and target makes the
comparison more meaningful. It does not prove either model predicts
actual irrigation better than a validated agricultural method.

### 3. Learning Curves

**Theory:** Learning curves show how training and evaluation error
changes as the amount of training data grows. A gap between training and
evaluation error can help investigate overfitting and generalization.

**Reported validation MAE:**

  Training-data fraction     Random Forest MAE   XGBoost MAE
  ------------------------ ------------------- -------------
  10%                                   0.4519        0.3064
  100%                                  0.2159        0.2219

**Interpretation:** Validation MAE decreases as more training data is
used in the reported experiment. This suggests additional examples
helped the models reproduce the target. More rows alone do not guarantee
better coverage of farms, climates or management conditions.

### 4. Feature Importance & SHAP

**Theory:** Feature importance summarizes how much a model relies on
each input overall. SHAP (SHapley Additive exPlanations) estimates how
individual features contribute to model predictions.

**Reported feature importance:**

  Feature                 Random Forest   XGBoost
  --------------------- --------------- ---------
  Maximum temperature            63.63%    42.79%
  Precipitation                  32.01%    33.01%
  Solar radiation                 1.39%     9.09%

**Interpretation:** Both models rely heavily on maximum temperature and
precipitation. This is consistent with the formula used to construct the
target: temperature-related information contributes to estimated
evapotranspiration, and rainfall affects the rainfall subtraction.
Importance and SHAP explain model behaviour; they do not prove causation
or explain the full physical process in a sugarcane field.

### 5. Feature Ablation

**Theory:** Feature ablation removes one feature or a group of features
and measures how performance changes.

**Reported MAE comparisons:**

  Feature group                     Random Forest MAE   XGBoost MAE
  ------------------------------- ------------------- -------------
  All 11 features                              0.2156        0.2250
  Without location                             0.2672        0.3260
  Without seasonal features                    0.3104        0.4154
  Weather only                                 0.3745        0.4800
  Location and seasonality only                2.5722        2.7432

**Interpretation:** The full feature set performs best among these
tested groups. Removing location or seasonal information increases
error, while location and seasonality alone are not enough to reproduce
the target. This indicates complementary information in the feature
groups for the current proxy task.

### 6. PCA Experiments

**Theory:** PCA (Principal Component Analysis) transforms related inputs
into fewer combined components that preserve as much overall variation
in the original inputs as possible. Preserving input variance does not
guarantee preserving the information most useful for prediction.

**Reported results:**

  -----------------------------------------------------------------------
  PCA components     Input variance  Random Forest MAE        XGBoost MAE
                          preserved                    
  -------------- ------------------ ------------------ ------------------
  3                          71.98%              1.292              1.399

  5                          87.70%              0.992              1.178

  8                          98.61%              0.630              0.688

  Original 11                   ---             0.2156             0.2250
  features                                             
  -----------------------------------------------------------------------

**Interpretation:** The original 11 features outperform the tested PCA
configurations. PCA did not improve prediction performance in these
experiments. PCA visual groupings should not automatically be
interpreted as official climate zones, crop stages or soil categories.

### 7. Weather Regimes / Clustering

**Theory:** Clustering is an unsupervised learning method that groups
records with similar input patterns without predefined labels. Cluster
numbers have no inherent meaning; they need to be interpreted using the
weather summaries.

**Reported four-cluster summaries:**

  -------------------------------------------------------------------------
  Cluster                 Mean  Mean rainfall         RF MAE    XGBoost MAE
  description      temperature                               
  ------------- -------------- -------------- -------------- --------------
  Very wet /            26.1°C   20.47 mm/day          0.122          0.192
  humid                                                      

  Cooler /              17.8°C    0.31 mm/day          0.160          0.193
  drier                                                      

  Moderately            25.5°C    2.93 mm/day          0.256          0.250
  warm / humid                                               

  Hotter /              30.4°C    0.53 mm/day          0.203          0.209
  drier                                                      
  -------------------------------------------------------------------------

**Interpretation:** Error differs between the weather groups. The
moderately warm/humid group has the highest MAE for both models among
the four reported groups. These are exploratory mathematical groups, not
official climate regions or crop stages. Errors still refer to the
simulated target.

### 8. One-Dimensional Sensitivity

**Theory:** Sensitivity analysis changes one input across a range while
holding other inputs fixed, then observes how the model prediction
changes.

**Reported result:** Across the tested maximum-temperature range of
approximately 22.13°C to 41.42°C, Random Forest predictions rise from
about 8.57 to 19.86 mm/day, and XGBoost predictions rise from about 7.42
to 19.17 mm/day.

**Interpretation:** Both models predict higher proxy values at the
hotter end of the tested range. This is consistent with the temperature
sensitivity built into the target formula. It is a model-response
experiment, not a real-world field experiment; fixed-input sweeps can
create weather combinations that do not occur naturally.

### 9. Location Errors / Residuals

**Theory:** A residual is `target − prediction`. Location-wise error
analysis checks whether model errors vary across held-out locations
instead of relying only on one overall score.

**Reported location MAE extremes:**

-   Random Forest: from 0.1218 at TS02 to 0.3439 at TN03.
-   XGBoost: from 0.1976 at GJ02 to 0.3014 at TN03.

**Interpretation:** Errors are not uniform across the listed locations.
TN03 has the highest reported MAE for both models among these extremes.
This can motivate further checks of weather distribution, location
coverage, input consistency and target behaviour. The error alone does
not identify the cause, and eight held-out locations do not establish
nationwide farm accuracy.

### 10. Data Quality Audit

**Theory:** A data-quality audit checks missing values, units,
duplicates, date/location alignment, feature order, target meaning,
geographic coverage and saved model artifacts.

**Reported dataset summary:**

-   71,214 daily location rows across 39 locations.
-   The audited core weather, date, location and target fields have no
    missing values in the summarized dataset.
-   Soil properties have approximately **89.7% missingness**.
-   Field ID, crop variety, growth stage, irrigation method, and
    previous irrigation are 100% missing in the summarized fields.
-   Independent field-measured irrigation validation is absent.

**Interpretation:** The dataset supports the current weather-based proxy
experiment, but it does not contain the farm-level observations needed
to validate actual irrigation recommendations. Soil information is too
sparse to be treated as a complete input without additional work.

**Implementation caution:** verify that actual model binaries are
present and load correctly. Git LFS pointer files are not model
binaries. The training notebook, original dataset, split provenance,
exact hyperparameters and dependency versions should be preserved to
make the experiment reproducible.

### Bonus concept: residual analysis

A residual is the target minus the prediction. If the target is 5.0
mm/day and the model predicts 4.7 mm/day, the residual is +0.3 mm/day.
Residual plots help reveal unusually large errors, systematic over- or
under-prediction, or changes in error size across the target range.

Residuals near zero indicate agreement with the formula-generated
target, not necessarily with measured irrigation.

------------------------------------------------------------------------

## Data sources and soil context

### NASA POWER

Project materials identify NASA POWER as the primary source for the
training weather records.

-   Website: https://power.larc.nasa.gov/

### Open-Meteo

Open-Meteo is used for location search and daily weather retrieval in
the application. Verify variable definitions, units, date boundaries and
forecast/historical behaviour before relying on live values.

-   Weather documentation: https://open-meteo.com/en/docs
-   Historical weather API:
    https://open-meteo.com/en/docs/historical-weather-api
-   Geocoding API: https://open-meteo.com/en/docs/geocoding-api

### Soil data

Soil data is supplementary context and is not used by the current
trained models. SoilGrids REST availability should not be assumed. The
project explored a local-raster approach using mapped soil products such
as OpenLandMap, but exports must be completed and verified before any
local soil lookup can be relied upon.

-   ISRIC SoilGrids: https://www.isric.org/explore/soilgrids/
-   SoilGrids documentation:
    https://docs.isric.org/globaldata/soilgrids/
-   OpenLandMap documentation: https://docs.openlandmap.org/
-   OpenLandMap STAC catalogue: https://stac.openlandmap.org/

Before displaying soil values, verify the product, band, depth interval,
scale factor, physical unit, NoData handling, coordinate reference
system and coverage. Mapped soil values are not direct measurements from
the selected farm.

------------------------------------------------------------------------

## Repository structure

The exact structure may vary by branch or deployment. The reviewed
project layout includes:

``` text
.
├── app/
│   ├── core/config.py
│   ├── main.py
│   ├── schemas/
│   │   └── irrigation.py
│   └── services/
│       ├── irrigation_service.py
│       ├── weather_service.py
│       └── soil_service.py
├── Models/
│   ├── random_forest.joblib
│   └── xgboost.joblib
├── frontend/
│   ├── src/pages/
│   ├── src/components/
│   ├── src/data/experimentsData.ts
│   └── public/plots/
├── sugarcane_ml_experiments_results/
│   ├── experiment_summary.json
│   ├── experiment_split_info.json
│   ├── tables/
│   └── plots/
├── tests/
├── data/
│   └── soilgrids/
├── .gitattributes
├── .gitignore
├── requirements.txt
└── README.md
```

------------------------------------------------------------------------

## Run locally

### Prerequisites

-   Python version compatible with the project's dependencies and
    serialized model artifacts.
-   Node.js and npm.
-   Git and Git LFS.
-   Network access for Open-Meteo requests.

### 1. Clone the repository and retrieve model artifacts

Use Git rather than a source ZIP if the models are stored with Git LFS:

``` bash
git lfs install
git clone https://github.com/jainamdavda1-pixel/sugarcane-irrigation-prediction.git
cd sugarcane-irrigation-prediction
git lfs pull
```

A GitHub source ZIP may contain LFS pointer text rather than the actual
`.joblib` binaries. Verify the files before starting inference.

### 2. Set up the backend

From the repository root:

``` bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Common local URLs:

-   API root: http://127.0.0.1:8000
-   Interactive API documentation: http://127.0.0.1:8000/docs
-   Health endpoint: http://127.0.0.1:8000/health

### 3. Set up the frontend

Open a second terminal:

``` bash
cd frontend
npm ci
```

If required, create `frontend/.env` using the existing example as a
guide:

``` env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

``` bash
npm run dev
```

Open the local URL printed by Vite, typically http://localhost:5173.

Build the frontend:

``` bash
npm run build
```

### 4. Verify model files before a demo

``` bash
git lfs ls-files
head -n 3 Models/random_forest.joblib
```

If the file begins with `version https://git-lfs.github.com/spec/v1`, it
is an LFS pointer, not the real model. Retrieve the actual object with
`git lfs pull`.

Do not claim successful live prediction until both actual model objects
load and a complete location/date prediction has been tested.

------------------------------------------------------------------------

## API endpoints

The reviewed backend exposes these routes; confirm the current
implementation in `/docs` before relying on a route or request shape.

  ------------------------------------------------------------------------------------------------------------------------
  Method                  Endpoint                                                                 Purpose
  ----------------------- ------------------------------------------------------------------------ -----------------------
  `GET`                   `/`                                                                      Root status or built
                                                                                                   frontend

  `GET`                   `/health`                                                                Reports
                                                                                                   API/model-loading
                                                                                                   status

  `GET`                   `/docs`                                                                  Interactive API
                                                                                                   documentation

  `GET`                   `/geocode?q=Kolhapur`                                                    Location search

  `GET`                   `/weather?latitude=16.705&longitude=74.243&prediction_date=2026-10-02`   Daily weather retrieval

  `GET`                   `/soil?latitude=16.705&longitude=74.243`                                 Optional supplementary
                                                                                                   soil context

  `GET`                   `/experiments/summary`                                                   Experiment summary

  `POST`                  `/predict`                                                               Location/date
                                                                                                   prediction workflow or
                                                                                                   supported
                                                                                                   direct-feature mode
  ------------------------------------------------------------------------------------------------------------------------

Example location/date prediction request:

``` json
{
  "latitude": 16.705,
  "longitude": 74.2433,
  "planting_date": "2026-06-15",
  "prediction_date": "2026-10-02",
  "location_name": "Kolhapur, Maharashtra"
}
```

Planting date is included for display context in the current workflow
and does not enter the model feature vector. The response should be
checked for weather availability, feature values, both model estimates
and the experimental-use warning.

------------------------------------------------------------------------

## Testing and verification

### Backend

Run from the repository root:

``` bash
pytest -v
```

Model-loading and inference tests require actual model binaries, not Git
LFS pointer text. A general health response does not by itself prove
both models loaded. Inspect the explicit model-loaded fields and run a
real prediction test.

### Frontend

``` bash
cd frontend
npm ci
npm run build
npm run lint
```

### Recommended demo checklist

-   Confirm the backend and frontend start successfully.
-   Confirm actual Random Forest and XGBoost binaries load.
-   Test a location/date with all required weather fields available.
-   Confirm exactly 11 features are passed in the documented order.
-   Confirm units, dates and weather source labels.
-   Show History only if a record has actually been saved.
-   Show soil context only after verifying the raster/API source, units,
    scale factors, depth and NoData handling.
-   Explain Research Lab results as saved experiments unless the page
    demonstrably recomputes them.
-   Do not present proxy estimates as validated irrigation advice.

------------------------------------------------------------------------

## Limitations and responsible use

1.  **Simulated target:** the target is formula-derived, not measured
    irrigation.
2.  **No independent farm validation:** no measured irrigation events
    are available to verify real-world accuracy.
3.  **Limited agronomic variables:** soil moisture, field area, crop
    stage, variety, root depth, irrigation efficiency and management
    data are not current model inputs.
4.  **Sparse soil data:** mapped soil context is incomplete and must be
    verified before display.
5.  **Training/live weather mismatch risk:** NASA POWER training data
    and Open-Meteo live data need careful harmonization.
6.  **Reproducibility:** the original training notebook and raw training
    dataset were not present in the reviewed project snapshot; preserve
    them with split metadata, hyperparameters, seeds and dependency
    versions.
7.  **Geographic coverage:** eight held-out locations are not sufficient
    to establish accuracy across all Indian sugarcane farms.
8.  **Model artifacts:** Git LFS pointers must not be mistaken for model
    binaries.
9.  **Metrics interpretation:** a high R² does not mean the same
    percentage of real-world irrigation accuracy.
10. **Operational use:** the application is a research prototype, not a
    validated irrigation schedule or substitute for local agronomic
    guidance.

------------------------------------------------------------------------

## Future work

Recommended next steps:

1.  Preserve and document the raw dataset, target-generation code,
    training notebook, feature schema, model versions and exact
    train/evaluation location split.
2.  Validate predictions against measured field irrigation or a
    defensible, independently validated agronomic reference.
3.  Harmonize NASA POWER training variables with Open-Meteo live
    variables and daily aggregation.
4.  Collect farm-level information such as field area, crop stage,
    root-zone depth, irrigation method, soil moisture and previous
    irrigation where appropriate.
5.  Add soil features only through a separate experiment with verified
    values, a scientifically appropriate target and location-held-out
    evaluation.
6.  Evaluate performance across more independent locations, seasons and
    crop stages.
7.  Consider converting depth to volume only when field area is known,
    and account for irrigation efficiency only with a justified
    assumption or measured data.
8.  Involve agricultural domain experts before making practical
    irrigation recommendations.

------------------------------------------------------------------------

## References

-   Hargreaves, G. H., & Samani, Z. A. (1985). Reference crop
    evapotranspiration from temperature. *Applied Engineering in
    Agriculture*. https://doi.org/10.13031/2013.26773
-   NASA POWER: https://power.larc.nasa.gov/
-   Open-Meteo weather API: https://open-meteo.com/en/docs
-   Open-Meteo historical weather API:
    https://open-meteo.com/en/docs/historical-weather-api
-   Open-Meteo geocoding API:
    https://open-meteo.com/en/docs/geocoding-api
-   ISRIC SoilGrids: https://www.isric.org/explore/soilgrids/
-   SoilGrids documentation:
    https://docs.isric.org/globaldata/soilgrids/
-   OpenLandMap documentation: https://docs.openlandmap.org/
-   OpenLandMap STAC catalogue: https://stac.openlandmap.org/

------------------------------------------------------------------------

## Final project summary

This project demonstrates a full-stack experimental ML workflow:
weather-based target construction, Random Forest and XGBoost regression,
location-held-out evaluation, model interpretation experiments, a Farmer
Dashboard, and an ML Research Lab.

The reported models reproduce the simulated target closely under the
documented evaluation setup. The scientifically appropriate conclusion
is that the project is a useful **prototype for studying weather-based
proxy estimation and ML analysis**. It is not yet evidence of accurate
real-world irrigation prediction. Independent agricultural validation is
the essential next step.


