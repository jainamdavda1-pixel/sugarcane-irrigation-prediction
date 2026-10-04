from unittest.mock import MagicMock, patch
from pathlib import Path
from app.services.soil_service import (
    get_soil_context,
    _sample_property,
    PROPERTY_CONFIG,
    SoilService,
    soil_service,
)


def test_property_config_keys():
    assert "soil_ph" in PROPERTY_CONFIG
    assert "soil_organic_carbon" in PROPERTY_CONFIG
    assert "clay_content" in PROPERTY_CONFIG


def test_get_soil_context_structure():
    result = get_soil_context(16.7050, 74.2433)
    assert isinstance(result, dict)
    assert result["source"] == "OpenLandMap"
    assert result["model_input"] is False
    assert "status" in result
    assert result["status"] in ["available", "partial", "unavailable"]
    assert "properties" in result
    assert "soil_ph" in result["properties"]
    assert "soil_organic_carbon" in result["properties"]
    assert "clay_content" in result["properties"]
    assert "notice" in result


def test_sample_property_missing_file():
    # When file doesn't exist, it should return None without error
    val = _sample_property("soil_ph", 16.7050, 74.2433)
    # If the tif isn't on disk, it returns None
    assert val is None or isinstance(val, dict)


def test_sample_property_with_mock_raster():
    mock_dataset = MagicMock()
    mock_dataset.crs = "EPSG:4326"
    mock_dataset.bounds.left = 70.0
    mock_dataset.bounds.right = 85.0
    mock_dataset.bounds.bottom = 10.0
    mock_dataset.bounds.top = 25.0
    mock_dataset.sample.return_value = iter([[6.8]])

    with patch("app.services.soil_service.Path.exists", return_value=True):
        with patch("app.services.soil_service._open_raster", return_value=mock_dataset):
            sampled = _sample_property("soil_ph", 16.7050, 74.2433)
            assert sampled is not None
            assert sampled["value"] == 6.8
            assert sampled["raw_value"] == 6.8
            assert sampled["source"] == "OpenLandMap"
            assert sampled["depth"] == "surface band b0"
            assert sampled["resolution_m"] == 250


def test_get_soil_context_all_available():
    mock_sample = {
        "value": 7.2,
        "raw_value": 7.2,
        "unit": "dataset scale; verify before display",
        "depth": "surface band b0",
        "source": "OpenLandMap",
        "resolution_m": 250,
    }
    with patch("app.services.soil_service._sample_property", return_value=mock_sample):
        context = get_soil_context(16.7050, 74.2433)
        assert context["status"] == "available"
        assert context["properties"]["soil_ph"]["value"] == 7.2
        assert context["properties"]["soil_organic_carbon"]["value"] == 7.2
        assert context["properties"]["clay_content"]["value"] == 7.2


def test_soil_service_compatibility_wrapper():
    mock_context = {
        "source": "OpenLandMap",
        "status": "available",
        "properties": {"soil_ph": None, "soil_organic_carbon": None, "clay_content": None},
        "model_input": False,
        "notice": "Mapped soil context only.",
    }
    with patch("app.services.soil_service.get_soil_context", return_value=mock_context):
        resp = soil_service.get_soil_properties(16.7050, 74.2433)
        assert resp["status"] == "available"
        assert resp["source"] == "OpenLandMap"
