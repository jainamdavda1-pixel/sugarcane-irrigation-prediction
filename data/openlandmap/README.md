# OpenLandMap India Surface Soil Dataset Configuration

This directory contains high-resolution 250m surface soil GeoTIFF rasters from OpenLandMap for the Indian subcontinent.

## Mapped Soil Properties

| Property | File Name | Raw Scale | Resolution | Source |
|---|---|---|---|---|
| **Soil pH (H2O)** | `India_Soil_pH_Surface.tif` | pH index | 250m | OpenLandMap (Surface band b0) |
| **Soil Organic Carbon** | `India_Soil_Organic_Carbon_Surface.tif` | g/kg | 250m | OpenLandMap (Surface band b0) |
| **Clay Content** | `India_Soil_Clay_Content_Surface.tif` | % | 250m | OpenLandMap (Surface band b0) |

## Spatial Coverage

- **Geographic Extent:** All India (Lat 6.75°N – 33.17°N, Lon 68.18°E – 97.17°E)
- **Coordinate Reference System:** EPSG:4326 (WGS 84)
- **Sampling Engine:** `rasterio` with dynamic point reprojection and bilinear sampling.
- **Model Isolation:** Soil attributes provide agronomic field context for farmers and are not inputs to the 11-feature ML model tensor.
