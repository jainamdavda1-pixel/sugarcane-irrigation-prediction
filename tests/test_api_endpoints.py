from datetime import date
from unittest.mock import MagicMock, patch
from app.schemas.irrigation import WeatherResponse


def test_health_endpoint(test_client):
    response = test_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["random_forest_loaded"] is True
    assert data["xgboost_loaded"] is True


def test_experiments_summary_endpoint(test_client):
    response = test_client.get("/experiments/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["dataset_rows"] == 71214
    assert len(data["feature_order"]) == 11
    assert "new_split_metrics" in data


def test_geocode_endpoint(test_client):
    mock_results = [
        {
            "id": 1259229,
            "name": "Pune",
            "latitude": 18.51957,
            "longitude": 73.85535,
            "country": "India",
            "admin1": "Maharashtra",
            "admin2": "Pune",
        }
    ]
    with patch("app.services.weather_service.weather_service.search_locations", return_value=mock_results):
        response = test_client.get("/geocode?q=Pune")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Pune"
        assert data[0]["admin1"] == "Maharashtra"


def test_weather_endpoint_success(test_client):
    mock_weather = WeatherResponse(
        date="2026-10-02",
        temperature_mean_c=29.1,
        temperature_max_c=33.4,
        temperature_min_c=26.4,
        relative_humidity_percent=78.0,
        precipitation_mm_day=0.6,
        wind_speed_m_s=3.05,
        solar_radiation_kwh_m2_day=5.8444,
        source="Open-Meteo",
        data_type="forecast",
    )
    with patch("app.services.weather_service.weather_service.get_daily_weather", return_value=mock_weather):
        response = test_client.get("/weather?latitude=16.5&longitude=80.6&prediction_date=2026-10-02")
        assert response.status_code == 200
        data = response.json()
        assert data["temperature_mean_c"] == 29.1
        assert data["source"] == "Open-Meteo"


def test_soil_endpoint_openlandmap(test_client):
    mock_soil = {
        "source": "OpenLandMap",
        "status": "available",
        "properties": {
            "soil_ph": {
                "value": 7.1,
                "raw_value": 7.1,
                "unit": "pH",
                "depth": "surface band b0",
                "source": "OpenLandMap",
                "resolution_m": 250,
            },
            "soil_organic_carbon": None,
            "clay_content": None,
        },
        "model_input": False,
        "notice": "Mapped soil context only.",
    }
    with patch("app.services.soil_service.get_soil_context", return_value=mock_soil):
        # Test /api/soil with lat & lon
        response1 = test_client.get("/api/soil?lat=16.705&lon=74.2433")
        assert response1.status_code == 200
        data1 = response1.json()
        assert data1["source"] == "OpenLandMap"
        assert data1["status"] == "available"
        assert data1["properties"]["soil_ph"]["value"] == 7.1

        # Test /soil with latitude & longitude
        response2 = test_client.get("/soil?latitude=16.705&longitude=74.2433")
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["source"] == "OpenLandMap"


def test_predict_farmer_workflow_full_pipeline(test_client):
    mock_weather = WeatherResponse(
        date="2026-10-02",
        temperature_mean_c=28.0,
        temperature_max_c=34.0,
        temperature_min_c=23.0,
        relative_humidity_percent=75.0,
        precipitation_mm_day=2.0,
        wind_speed_m_s=3.2,
        solar_radiation_kwh_m2_day=5.5,
        source="Open-Meteo",
        data_type="forecast",
    )
    mock_soil = {
        "source": "OpenLandMap",
        "status": "available",
        "properties": {
            "soil_ph": {"value": 6.8, "raw_value": 6.8, "unit": "pH", "depth": "surface band b0", "source": "OpenLandMap", "resolution_m": 250},
            "soil_organic_carbon": None,
            "clay_content": None,
        },
        "model_input": False,
        "notice": "Mapped soil context only.",
    }

    with patch("app.services.weather_service.weather_service.get_daily_weather", return_value=mock_weather):
        with patch("app.services.soil_service.get_soil_context", return_value=mock_soil):
            payload = {
                "latitude": 16.7050,
                "longitude": 74.2433,
                "planting_date": "2026-06-15",
                "prediction_date": "2026-10-02",
                "location_name": "Kolhapur Farm",
            }
            response = test_client.post("/predict", json=payload)
            assert response.status_code == 200
            data = response.json()

            assert data["location"]["latitude"] == 16.7050
            assert data["location"]["longitude"] == 74.2433
            assert data["location"]["name"] == "Kolhapur Farm"
            assert data["planting_date"] == "2026-06-15"
            assert data["prediction_date"] == "2026-10-02"
            assert data["crop_age_days"] == 109  # days between 2026-06-15 and 2026-10-02

            # Weather
            assert data["weather"]["temperature_mean_c"] == 28.0
            assert data["weather"]["precipitation_mm_day"] == 2.0

            # Soil
            assert data["soil"]["source"] == "OpenLandMap"

            # Predictions
            assert "random_forest_prediction_mm_day" in data["predictions"]
            assert "xgboost_prediction_mm_day" in data["predictions"]
            assert data["predictions"]["random_forest_prediction_mm_day"] >= 0.0
            assert data["predictions"]["xgboost_prediction_mm_day"] >= 0.0

            # Features used
            assert len(data["features_used"]) == 11
            assert "sin_day_of_year" in data["features_used"]
            assert "cos_day_of_year" in data["features_used"]

            # Disclaimer
            assert data["experimental_only"] is True
            assert "warning" in data


def test_predict_when_soil_unavailable(test_client):
    mock_weather = WeatherResponse(
        date="2026-10-02",
        temperature_mean_c=28.0,
        temperature_max_c=34.0,
        temperature_min_c=23.0,
        relative_humidity_percent=75.0,
        precipitation_mm_day=0.0,
        wind_speed_m_s=2.5,
        solar_radiation_kwh_m2_day=5.0,
        source="Open-Meteo",
        data_type="forecast",
    )
    mock_soil = {
        "source": "OpenLandMap",
        "status": "unavailable",
        "properties": {
            "soil_ph": None,
            "soil_organic_carbon": None,
            "clay_content": None,
        },
        "model_input": False,
        "notice": "Mapped soil context only.",
    }

    with patch("app.services.weather_service.weather_service.get_daily_weather", return_value=mock_weather):
        with patch("app.services.soil_service.get_soil_context", return_value=mock_soil):
            payload = {
                "latitude": 16.5,
                "longitude": 80.6,
                "planting_date": "2026-06-15",
                "prediction_date": "2026-10-02",
            }
            response = test_client.post("/predict", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["soil"]["status"] == "unavailable"
            # Prediction still succeeds because model does not require soil
            assert data["predictions"]["random_forest_prediction_mm_day"] >= 0.0
            assert data["predictions"]["xgboost_prediction_mm_day"] >= 0.0


def test_predict_validation_errors(test_client):
    # Invalid coordinates
    bad_payload = {
        "latitude": 95.0,  # Invalid > 90
        "longitude": 80.6,
        "planting_date": "2026-06-15",
    }
    response = test_client.post("/predict", json=bad_payload)
    assert response.status_code == 400

    # Prediction date before planting date
    date_order_payload = {
        "latitude": 16.5,
        "longitude": 80.6,
        "planting_date": "2026-10-15",
        "prediction_date": "2026-10-02",
    }
    response = test_client.post("/predict", json=date_order_payload)
    assert response.status_code == 400


def test_predict_legacy_direct_features(test_client):
    legacy_payload = {
        "latitude": 16.5,
        "longitude": 80.6,
        "temperature_mean_c": 28.0,
        "temperature_max_c": 34.0,
        "temperature_min_c": 23.0,
        "relative_humidity_percent": 75.0,
        "precipitation_mm_day": 2.5,
        "wind_speed_m_s": 3.2,
        "solar_radiation_kwh_m2_day": 5.5,
        "sin_day_of_year": 0.5,
        "cos_day_of_year": 0.866,
    }
    response = test_client.post("/predict", json=legacy_payload)
    assert response.status_code == 200
    data = response.json()
    assert "random_forest_prediction_mm_day" in data
    assert "xgboost_prediction_mm_day" in data
