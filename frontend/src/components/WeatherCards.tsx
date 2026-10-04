import React from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Compass,
  Calendar,
} from 'lucide-react';
import type { WeatherData, ModelFeaturesDict } from '../types/api';

interface WeatherCardsProps {
  weather: WeatherData;
  features?: ModelFeaturesDict;
}

export const WeatherCards: React.FC<WeatherCardsProps> = ({ weather, features }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Automated Weather Conditions
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Observation Date: <strong className="font-mono text-slate-200">{weather.date}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 font-medium">
            {weather.source} &bull; {weather.data_type === 'forecast' ? 'Live Forecast' : 'Historical Archive'}
          </span>
        </div>
      </div>

      {/* Primary Highlights: 2 Main Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Temperature Hero Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-orange-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Thermometer className="w-4 h-4" /> Mean Temperature
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {weather.temperature_mean_c.toFixed(1)}
              <span className="text-base font-sans font-normal text-slate-400 ml-1">°C</span>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-sky-300">
                Min {weather.temperature_min_c}°C
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-orange-300">
                Max {weather.temperature_max_c}°C
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        {/* Precipitation Hero Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <CloudRain className="w-4 h-4" /> Daily Precipitation
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {weather.precipitation_mm_day.toFixed(1)}
              <span className="text-base font-sans font-normal text-slate-400 ml-1">mm/day</span>
            </div>
            <div className="text-xs text-slate-400 pt-1">
              {weather.precipitation_mm_day > 0 ? (
                <span className="text-emerald-400 font-medium">✓ Offsets daily irrigation deficit</span>
              ) : (
                <span className="text-slate-400">0 mm recorded &bull; Rain deficit</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <CloudRain className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Clean 4-Column / 2-Column Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Humidity */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {weather.relative_humidity_percent.toFixed(0)}
            <span className="text-xs font-sans text-slate-400 ml-1">%</span>
          </div>
          <div className="text-[10px] text-slate-500">2m Mean RH</div>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind Velocity
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {weather.wind_speed_m_s.toFixed(2)}
            <span className="text-xs font-sans text-slate-400 ml-1">m/s</span>
          </div>
          <div className="text-[10px] text-slate-500">10m Max Speed</div>
        </div>

        {/* Solar Radiation */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Flux
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {weather.solar_radiation_kwh_m2_day.toFixed(2)}
            <span className="text-xs font-sans text-slate-400 ml-1">kWh/m²</span>
          </div>
          <div className="text-[10px] text-slate-500">Shortwave flux</div>
        </div>

        {/* Seasonality Harmonics */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-purple-400" /> Seasonality
          </div>
          <div className="text-xs font-mono text-purple-300 font-bold flex gap-2">
            <span>sin: {features?.sin_day_of_year?.toFixed(2) ?? '--'}</span>
            <span>cos: {features?.cos_day_of_year?.toFixed(2) ?? '--'}</span>
          </div>
          <div className="text-[10px] text-slate-500">Cyclic DOY</div>
        </div>
      </div>
    </div>
  );
};
