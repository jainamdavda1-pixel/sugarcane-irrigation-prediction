import React from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Compass,
} from 'lucide-react';
import type { WeatherData, ModelFeaturesDict } from '../types/api';

interface WeatherCardsProps {
  weather: WeatherData;
  features?: ModelFeaturesDict;
}

export const WeatherCards: React.FC<WeatherCardsProps> = ({ weather, features }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-sky-400" /> Automated Weather Conditions
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 font-medium">
            {weather.source} ({weather.data_type})
          </span>
          <span className="text-xs text-slate-400 font-mono">{weather.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {/* Temperature */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Thermometer className="w-4 h-4 text-orange-400" /> Temperature
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {weather.temperature_mean_c.toFixed(1)} <span className="text-xs font-sans text-slate-400">°C</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Min: <span className="text-sky-300">{weather.temperature_min_c}°C</span> | Max:{' '}
            <span className="text-orange-300">{weather.temperature_max_c}°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Droplets className="w-4 h-4 text-blue-400" /> Relative Humidity
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {weather.relative_humidity_percent.toFixed(0)} <span className="text-xs font-sans text-slate-400">%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Daily 2m mean RH</div>
        </div>

        {/* Precipitation */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <CloudRain className="w-4 h-4 text-cyan-400" /> Precipitation
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {weather.precipitation_mm_day.toFixed(1)} <span className="text-xs font-sans text-slate-400">mm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Daily rainfall sum</div>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Wind className="w-4 h-4 text-teal-400" /> Wind Speed
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {weather.wind_speed_m_s.toFixed(2)} <span className="text-xs font-sans text-slate-400">m/s</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">10m max velocity</div>
        </div>

        {/* Solar Radiation */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Sun className="w-4 h-4 text-amber-400" /> Solar Radiation
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {weather.solar_radiation_kwh_m2_day.toFixed(2)}{' '}
            <span className="text-xs font-sans text-slate-400">kWh/m²</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Daily shortwave flux</div>
        </div>

        {/* Day-of-Year Harmonics */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Compass className="w-4 h-4 text-purple-400" /> Seasonality Harmonics
          </div>
          <div className="text-sm font-mono text-white space-y-0.5">
            <div>Sin: <span className="text-purple-300">{features?.sin_day_of_year?.toFixed(3) ?? '--'}</span></div>
            <div>Cos: <span className="text-purple-300">{features?.cos_day_of_year?.toFixed(3) ?? '--'}</span></div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Day-of-year cyclic encoding</div>
        </div>
      </div>
    </div>
  );
};
