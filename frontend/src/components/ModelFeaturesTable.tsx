import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Binary } from 'lucide-react';
import type { ModelFeaturesDict } from '../types/api';

interface ModelFeaturesTableProps {
  features: ModelFeaturesDict;
}

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  latitude: 'Latitude in decimal degrees (-90 to 90)',
  longitude: 'Longitude in decimal degrees (-180 to 180)',
  temperature_mean_c: 'Daily mean 2m temperature (°C)',
  temperature_max_c: 'Daily maximum 2m temperature (°C)',
  temperature_min_c: 'Daily minimum 2m temperature (°C)',
  relative_humidity_percent: 'Daily mean 2m relative humidity (%)',
  precipitation_mm_day: 'Daily precipitation / rainfall sum (mm/day)',
  wind_speed_m_s: 'Daily maximum 10m wind speed (m/s)',
  solar_radiation_kwh_m2_day: 'Daily shortwave solar radiation (kWh/m²/day)',
  sin_day_of_year: 'Seasonal cyclical sine component sin(2π × DOY / 365.25)',
  cos_day_of_year: 'Seasonal cyclical cosine component cos(2π × DOY / 365.25)',
};

export const ModelFeaturesTable: React.FC<ModelFeaturesTableProps> = ({ features }) => {
  const [isOpen, setIsOpen] = useState(false);

  const entries = Object.entries(features);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Binary className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Model Input Vector (11 Features in Exact Sequence)</h3>
            <p className="text-xs text-slate-400">Inspect the exact tensor fed to Random Forest & XGBoost</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
          <span>{isOpen ? 'Hide Matrix' : 'Inspect Features'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">#</th>
                <th className="py-2.5 px-3 font-semibold">Feature Identifier</th>
                <th className="py-2.5 px-3 font-semibold">Value</th>
                <th className="py-2.5 px-3 font-semibold">Description / Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {entries.map(([key, val], idx) => (
                <tr key={key} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">{key}</td>
                  <td className="py-2.5 px-3 text-white font-bold">{typeof val === 'number' ? val.toFixed(4) : val}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{FEATURE_DESCRIPTIONS[key] || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
