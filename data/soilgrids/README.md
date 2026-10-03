# SoilGrids Offline Dataset Configuration

This directory is used by the application's `OfflineRasterSoilProvider` to extract soil properties when the ISRIC live REST API is unreachable.

## Supported Soil Properties & Standard File Naming

The offline provider searches this folder for GeoTIFF (`.tif` or `.tiff`) raster files corresponding to ISRIC SoilGrids 2.0 layers (standard depth: 0-30cm or 0-5cm mean):

| Property | File Name Pattern | Raw Unit | Converted App Unit | Scaling Factor |
|---|---|---|---|---|
| **Bulk Density** | `*bdod*.tif` | cg/cm³ | g/cm³ | 0.01 |
| **Soil pH (H2O)** | `*phh2o*.tif` | pH*10 | pH | 0.1 |
| **Clay Content** | `*clay*.tif` | g/kg | % | 0.1 |
| **Sand Content** | `*sand*.tif` | g/kg | % | 0.1 |
| **Silt Content** | `*silt*.tif` | g/kg | % | 0.1 |
| **Soil Organic Carbon** | `*soc*.tif` | dg/kg | g/kg | 0.1 |
| **Cation Exchange Capacity** | `*cec*.tif` | mmol(c)/kg | cmol(c)/kg | 0.1 |

## How to Download ISRIC SoilGrids Rasters for India

1. Visit the ISRIC SoilGrids WebDAV / VRT repository or download portal:
   - WebDAV: `https://files.isric.org/soilgrids/latest/data/`
   - ISRIC Data Portal: `https://data.isric.org/`
2. Download the GeoTIFF files for the target region or global coverage at 250m resolution.
3. Place the downloaded `.tif` files into this directory: `SugarcaneIrrigationML/data/soilgrids/`.
4. Install `rasterio` if using GeoTIFF extraction:
   ```bash
   pip install rasterio
   ```
5. If no raster files are present and the live ISRIC API is down, the system gracefully marks soil data as unavailable (`available: false`) without failing the irrigation prediction.
