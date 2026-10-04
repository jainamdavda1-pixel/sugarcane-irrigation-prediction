import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  CloudSun,
  Calendar,
} from 'lucide-react';
import type { WeatherData } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

interface WeatherSummaryProps {
  weather: WeatherData;
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weather }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8F0E4]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#EDF4E7] text-[#245C3A] shadow-xs">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#26352B]">
              {t('weatherSummary')}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#536B5C] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#78A85B]" />
              <span>Target Date: <strong className="font-mono text-[#26352B]">{weather.date}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0] font-semibold">
            {weather.source} &bull; {weather.data_type === 'forecast' ? 'Live Forecast' : 'Historical Archive'}
          </span>
        </div>
      </div>

      {/* Primary Highlights: 2 Main Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Temperature Hero Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#FDF4EC] border border-[#F5DFD0] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C64F45] uppercase tracking-wider">
              <Thermometer className="w-4 h-4" /> Mean Temperature
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#26352B]">
              {weather.temperature_mean_c != null ? weather.temperature_mean_c.toFixed(1) : '--'}
              <span className="text-base font-sans font-normal text-[#536B5C] ml-1">°C</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#536B5C] pt-1">
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#EAD0BE] font-medium text-[#3F86B5]">
                Min: {weather.temperature_min_c}°C
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#EAD0BE] font-medium text-[#C64F45]">
                Max: {weather.temperature_max_c}°C
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#F5DFD0] flex items-center justify-center text-[#C64F45] shadow-xs shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        {/* Rainfall / Precipitation Hero Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F4F9FD] to-[#EBF4FA] border border-[#CCE2F0] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3F86B5] uppercase tracking-wider">
              <CloudRain className="w-4 h-4" /> Daily Precipitation
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#26352B]">
              {weather.precipitation_mm_day != null ? weather.precipitation_mm_day.toFixed(1) : '0.0'}
              <span className="text-base font-sans font-normal text-[#536B5C] ml-1">mm/day</span>
            </div>
            <div className="text-xs text-[#536B5C] pt-1">
              {weather.precipitation_mm_day > 0 ? (
                <span className="text-[#245C3A] font-semibold">✓ Reduces crop irrigation deficit</span>
              ) : (
                <span className="text-[#8B6848] font-medium">No rainfall &bull; Dry day</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#CCE2F0] flex items-center justify-center text-[#3F86B5] shadow-xs shrink-0">
            <CloudRain className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Clean 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Relative Humidity */}
        <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] hover:border-[#C5DAC0] transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#536B5C] flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#3F86B5]" /> Relative Humidity
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#26352B]">
            {weather.relative_humidity_percent != null ? weather.relative_humidity_percent.toFixed(0) : '--'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">%</span>
          </div>
          <p className="text-[11px] text-[#536B5C]">2m atmospheric moisture</p>
        </div>

        {/* Wind Speed */}
        <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] hover:border-[#C5DAC0] transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#536B5C] flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#78A85B]" /> Wind Velocity
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#26352B]">
            {weather.wind_speed_m_s != null ? weather.wind_speed_m_s.toFixed(2) : '--'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">m/s</span>
          </div>
          <p className="text-[11px] text-[#536B5C]">10m peak wind speed</p>
        </div>

        {/* Solar Radiation */}
        <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] hover:border-[#C5DAC0] transition-colors space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#536B5C] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#D99A2B]" /> Solar Flux
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#26352B]">
            {weather.solar_radiation_kwh_m2_day != null ? weather.solar_radiation_kwh_m2_day.toFixed(2) : '--'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">kWh/m²</span>
          </div>
          <p className="text-[11px] text-[#536B5C]">Daily shortwave insolation</p>
        </div>
      </div>
    </div>
  );
};
