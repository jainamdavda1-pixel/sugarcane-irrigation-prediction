import React from 'react';
import { MapPin, CloudSun, Calendar, XCircle } from 'lucide-react';

export const FeatureGroup: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B]">
            Input Feature Engineering (11 Trained Features)
          </h3>
          <p className="text-xs text-[#536B5C]">
            Exact feature tensor and representation fed into the Random Forest and XGBoost pipelines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category 1: Location */}
        <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#245C3A] uppercase tracking-wider pb-2 border-b border-[#E8F0E4]">
            <MapPin className="w-4 h-4" /> 1. Spatial Coordinates (2)
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#245C3A] block">latitude</code>
              <span className="text-[#536B5C] text-[11px]">Decimal degrees (-90 to 90), determines extraterrestrial solar geometry</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#245C3A] block">longitude</code>
              <span className="text-[#536B5C] text-[11px]">Decimal degrees (-180 to 180), geographic location positioning</span>
            </div>
          </div>
        </div>

        {/* Category 2: Weather */}
        <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3F86B5] uppercase tracking-wider pb-2 border-b border-[#E8F0E4]">
            <CloudSun className="w-4 h-4" /> 2. Meteorological Variables (7)
          </div>
          <div className="space-y-1.5 text-xs max-h-72 overflow-y-auto pr-1">
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">temperature_mean_c</code>
              <span className="text-[#536B5C] text-[10px]">Daily mean 2m air temperature (°C)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">temperature_max_c</code>
              <span className="text-[#536B5C] text-[10px]">Daily maximum temperature (°C)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">temperature_min_c</code>
              <span className="text-[#536B5C] text-[10px]">Daily minimum temperature (°C)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">relative_humidity_percent</code>
              <span className="text-[#536B5C] text-[10px]">Mean relative humidity (0–100%)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">precipitation_mm_day</code>
              <span className="text-[#536B5C] text-[10px]">Daily rainfall total (mm/day)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">wind_speed_m_s</code>
              <span className="text-[#536B5C] text-[10px]">Max 10m wind velocity (m/s)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#3F86B5] block">solar_radiation_kwh_m2_day</code>
              <span className="text-[#536B5C] text-[10px]">Daily shortwave solar flux (kWh/m²/day)</span>
            </div>
          </div>
        </div>

        {/* Category 3: Cyclical Date */}
        <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B6848] uppercase tracking-wider pb-2 border-b border-[#E8F0E4]">
            <Calendar className="w-4 h-4" /> 3. Cyclical Date Harmonics (2)
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#8B6848] block">sin_day_of_year</code>
              <span className="text-[#536B5C] text-[11px]">sin(2π × DayOfYear / 365.25)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <code className="font-bold text-[#8B6848] block">cos_day_of_year</code>
              <span className="text-[#536B5C] text-[11px]">cos(2π × DayOfYear / 365.25)</span>
            </div>
            <p className="text-[11px] text-[#536B5C] leading-relaxed pt-1">
              Cyclical harmonic encoding preserves continuity between December 31st (Day 365) and January 1st (Day 1), preventing artificial boundary artifacts during decision tree splitting.
            </p>
          </div>
        </div>
      </div>

      {/* Excluded Variables Warning */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8F0E4] space-y-3">
        <h4 className="text-xs font-bold text-[#C64F45] uppercase tracking-wider flex items-center gap-1.5">
          <XCircle className="w-4 h-4 text-[#C64F45]" /> Variables NOT Present in the Current Model Input Tensor
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#536B5C]">
          <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E8F0E4] line-through">
            Planting Date / Crop Age
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E8F0E4] line-through">
            Soil Texture / pH / Carbon
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E8F0E4] line-through">
            Irrigation System (Drip/Flood)
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E8F0E4] line-through">
            Field Soil Moisture Sensors
          </div>
        </div>
        <p className="text-[11px] text-[#536B5C] leading-relaxed">
          While planting date and soil properties are collected or retrieved in the application for farmer visualization, they are strictly kept out of the model inference vector to match the 11 features established during Colab model training.
        </p>
      </div>
    </div>
  );
};
