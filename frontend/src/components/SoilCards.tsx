import React from 'react';
import { Layers, Database, Info, MapPin, AlertCircle } from 'lucide-react';
import type { SoilData } from '../types/api';

interface SoilCardsProps {
  soil: SoilData;
  onSelectSampleLocation?: (lat: number, lon: number, name: string) => void;
}

const PROPERTY_LABELS: Record<string, { label: string; unit: string; desc: string }> = {
  soil_ph: { label: 'Soil pH (H₂O)', unit: 'pH', desc: 'Acidity / Alkalinity level (0-30cm surface)' },
  phh2o: { label: 'Soil pH (H₂O)', unit: 'pH', desc: 'Acidity / Alkalinity level (0-30cm surface)' },
  soil_organic_carbon: { label: 'Organic Carbon (SOC)', unit: 'g/kg', desc: 'Soil organic carbon content in topsoil' },
  soc: { label: 'Organic Carbon (SOC)', unit: 'g/kg', desc: 'Soil organic carbon content in topsoil' },
  clay_content: { label: 'Clay Content', unit: '%', desc: 'Mineral clay mass fraction' },
  clay: { label: 'Clay Content', unit: '%', desc: 'Mineral clay mass fraction' },
  bdod: { label: 'Bulk Density', unit: 'cg/cm³', desc: 'Fine earth bulk density' },
  sand: { label: 'Sand Content', unit: '%', desc: 'Mineral sand fraction' },
  silt: { label: 'Silt Content', unit: '%', desc: 'Mineral silt fraction' },
  cec: { label: 'Cation Exch. Capacity', unit: 'cmol/kg', desc: 'Nutrient retention capacity' },
};

export const SoilCards: React.FC<SoilCardsProps> = ({ soil, onSelectSampleLocation }) => {
  const isAvailable = soil.available || soil.status === 'available' || soil.status === 'partial';
  const properties = soil.properties || {};

  // Filter properties with actual non-null values
  const activeEntries = Object.entries(properties).filter(
    ([, val]) => val !== null && val !== undefined && (typeof val === 'object' ? val.value !== null : true)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Soil Physical & Chemical Properties
        </h3>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
            isAvailable
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          {soil.source || 'OpenLandMap'}
          <span className="text-[10px] opacity-75 font-mono">
            {isAvailable ? '• 250m Mapped' : '• Outside Sample Tile'}
          </span>
        </span>
      </div>

      {/* Environmental Context Banner */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Environmental Context: </span>
          {soil.notice || soil.message || 'Mapped soil properties provide supplementary agronomic context.'}{' '}
          <span className="text-slate-400">
            Note: Irrigation predictions are generated from the <strong>11 meteorological & geospatial features</strong>{' '}
            (Temperature, RH, Rain, Wind, Radiation, Coordinates, Day-of-Year). Soil attributes are presented for field management guidance.
          </span>
        </div>
      </div>

      {/* Properties Grid */}
      {activeEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {activeEntries.map(([key, item]: [string, any]) => {
            const meta = PROPERTY_LABELS[key] || {
              label: item.name || key.replace(/_/g, ' ').toUpperCase(),
              unit: item.unit || '',
              desc: item.description || 'Surface soil property',
            };
            const valNum = typeof item.value === 'number' ? item.value : item.raw_value ?? 0;
            const displayVal = Number.isInteger(valNum) ? valNum : valNum.toFixed(1);
            const unit = item.unit?.includes('dataset scale') ? meta.unit : item.unit || meta.unit;

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                  {meta.label}
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-1.5">
                  {displayVal}
                  <span className="text-xs font-sans text-slate-400 font-normal">{unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {meta.desc}
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-mono">
                  {item.depth || 'surface band b0'} • {item.resolution_m ? `${item.resolution_m}m res` : '250m'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-medium text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            Location is outside the bundled Maharashtra sample raster tile (72°E–74°E, 18°N–20°N).
          </div>
          <p className="text-[11px] text-slate-400">
            To view high-resolution 250m OpenLandMap soil rasters for this demo, you can test a location within the Western Maharashtra sugarcane belt:
          </p>
          {onSelectSampleLocation && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSelectSampleLocation(18.5204, 73.8567, 'Pune / Haveli')}
                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3" /> Pune (18.52°N, 73.86°E)
              </button>
              <button
                type="button"
                onClick={() => onSelectSampleLocation(18.1517, 73.5786, 'Bhor / Pune Sugarcane Belt')}
                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3" /> Bhor (18.15°N, 73.58°E)
              </button>
              <button
                type="button"
                onClick={() => onSelectSampleLocation(19.0948, 73.9785, 'Junnar Valley')}
                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3" /> Junnar (19.09°N, 73.98°E)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
