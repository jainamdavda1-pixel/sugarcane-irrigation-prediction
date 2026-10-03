import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  CloudSun,
} from 'lucide-react';
import type { WeatherData } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

interface WeatherSummaryProps {
  weather: WeatherData;
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weather }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#E8F0E4]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#EDF4E7] text-[#3F86B5]">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26352B]">
              {t('weatherSummary')}
            </h3>
            <p className="text-xs text-[#536B5C]">
              Retrieved automatically for date <strong className="font-mono text-[#26352B]">{weather.date}</strong>
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0] font-semibold">
          Source: {weather.source} ({weather.data_type})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Mean Temp */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Thermometer className="w-4 h-4 text-[#C64F45]" /> Mean Temp
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.temperature_mean_c != null ? `${weather.temperature_mean_c.toFixed(1)}°C` : 'N/A'}
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">
            Min: {weather.temperature_min_c}° | Max: {weather.temperature_max_c}°
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Droplets className="w-4 h-4 text-[#3F86B5]" /> Humidity
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.relative_humidity_percent != null ? `${weather.relative_humidity_percent.toFixed(0)}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Daily 2m mean RH</div>
        </div>

        {/* Rainfall / Precip */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <CloudRain className="w-4 h-4 text-[#3F86B5]" /> Rainfall
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.precipitation_mm_day != null ? `${weather.precipitation_mm_day.toFixed(1)}` : 'N/A'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">mm/day</span>
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Total precipitation sum</div>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Wind className="w-4 h-4 text-[#78A85B]" /> Wind Speed
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.wind_speed_m_s != null ? `${weather.wind_speed_m_s.toFixed(2)}` : 'N/A'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">m/s</span>
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">10m max velocity</div>
        </div>

        {/* Solar Radiation */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Sun className="w-4 h-4 text-[#D99A2B]" /> Solar Flux
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.solar_radiation_kwh_m2_day != null ? `${weather.solar_radiation_kwh_m2_day.toFixed(2)}` : 'N/A'}
            <span className="text-xs font-sans font-normal text-[#536B5C] ml-1">kWh/m²</span>
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Daily shortwave energy</div>
        </div>

        {/* Max / Min Temp Details */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Thermometer className="w-4 h-4 text-[#D99A2B]" /> Peak High
          </div>
          <div className="text-xl font-extrabold font-mono text-[#26352B]">
            {weather.temperature_max_c != null ? `${weather.temperature_max_c.toFixed(1)}°C` : 'N/A'}
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Daily max recorded</div>
        </div>
      </div>
    </div>
  );
};
