from unittest.mock import MagicMock, patch
from app.schemas.irrigation import SoilResponse
from app.services.soil_service import SoilGridsAPIProvider, SoilService


def test_soil_api_provider_parsing(mock_soilgrids_payload):
    provider = SoilGridsAPIProvider()
    parsed = provider._parse_api_response(mock_soilgrids_payload)

    assert parsed is not None
    assert "bdod" in parsed
    # 135 * 0.01 = 1.35 g/cm³
    assert parsed["bdod"]["value"] == 1.35
    assert parsed["bdod"]["unit"] == "g/cm³"

    # 68 * 0.1 = 6.8 pH
    assert parsed["phh2o"]["value"] == 6.8
    assert parsed["phh2o"]["unit"] == "pH"

    # 320 * 0.1 = 32.0 %
    assert parsed["clay"]["value"] == 32.0
    assert parsed["clay"]["unit"] == "%"

    # 450 * 0.1 = 45.0 %
    assert parsed["sand"]["value"] == 45.0

    # 230 * 0.1 = 23.0 %
    assert parsed["silt"]["value"] == 23.0

    # 85 * 0.1 = 8.5 g/kg
    assert parsed["soc"]["value"] == 8.5

    # 180 * 0.1 = 18.0 cmol/kg
    assert parsed["cec"]["value"] == 18.0


def test_soil_service_live_api_success(mock_soilgrids_payload):
    service = SoilService()
    with patch.object(service.api_provider, "fetch_soil_data", return_value=service.api_provider._parse_api_response(mock_soilgrids_payload)):
        resp = service.get_soil_properties(16.5, 80.6)
        assert isinstance(resp, SoilResponse)
        assert resp.available is True
        assert resp.source == "SoilGrids (ISRIC REST v2.0)"
        assert "phh2o" in resp.properties
        assert resp.properties["phh2o"]["value"] == 6.8


def test_soil_service_unavailable_fallback():
    service = SoilService()
    # Simulate both API and offline raster returning None
    with patch.object(service.api_provider, "fetch_soil_data", return_value=None):
        with patch.object(service.offline_provider, "fetch_soil_data", return_value=None):
            resp = service.get_soil_properties(16.5, 80.6)
            assert isinstance(resp, SoilResponse)
            assert resp.available is False
            assert resp.properties == {}
            assert "unavailable" in resp.message.lower()


def test_soil_service_caching(mock_soilgrids_payload):
    service = SoilService()
    parsed = service.api_provider._parse_api_response(mock_soilgrids_payload)

    with patch.object(service.api_provider, "fetch_soil_data", return_value=parsed) as mock_fetch:
        resp1 = service.get_soil_properties(16.5, 80.6)
        resp2 = service.get_soil_properties(16.5, 80.6)
        assert mock_fetch.call_count == 1
        assert resp1.available == resp2.available
