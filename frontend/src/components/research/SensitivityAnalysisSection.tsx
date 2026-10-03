import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Sliders, ImageIcon, Info } from 'lucide-react';
import { SENSITIVITY_SAMPLES } from '../../data/experimentsData';

const FEATURE_OPTIONS = [
  { key: 'temperature_max_c', label: 'Max Temperature (°C)', unit: '°C', png: 'sensitivity_temperature_max_c.png' },
  { key: 'precipitation_mm_day', label: 'Precipitation (mm/day)', unit: 'mm/day', png: 'sensitivity_precipitation_mm_day.png' },
  { key: 'solar_radiation_kwh_m2_day', label: 'Solar Radiation (kWh/m²/day)', unit: 'kWh/m²', png: 'sensitivity_solar_radiation_kwh_m2_day.png' },
  { key: 'relative_humidity_percent', label: 'Relative Humidity (%)', unit: '%', png: 'sensitivity_relative_humidity_percent.png' },
  { key: 'wind_speed_m_s', label: 'Wind Speed (m/s)', unit: 'm/s', png: 'sensitivity_wind_speed_m_s.png' },
  { key: 'temperature_mean_c', label: 'Mean Temperature (°C)', unit: '°C', png: 'sensitivity_temperature_mean_c.png' },
  { key: 'temperature_min_c', label: 'Min Temperature (°C)', unit: '°C', png: 'sensitivity_temperature_min_c.png' },
  { key: 'latitude', label: 'Latitude (°N)', unit: '°N', png: 'sensitivity_latitude.png' },
  { key: 'longitude', label: 'Longitude (°E)', unit: '°E', png: 'sensitivity_longitude.png' },
  { key: 'sin_day_of_year', label: 'Sine Day of Year', unit: '', png: 'sensitivity_sin_day_of_year.png' },
  { key: 'cos_day_of_year', label: 'Cosine Day of Year', unit: '', png: 'sensitivity_cos_day_of_year.png' },
];

export const SensitivityAnalysisSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('temperature_max_c');
  const [showPng, setShowPng] = useState<boolean>(true);

  const selectedOption = FEATURE_OPTIONS.find((f) => f.key === selectedFeature) || FEATURE_OPTIONS[0];
  const chartData = SENSITIVITY_SAMPLES[selectedFeature] || [];

  return (
    <div className="space-y-6">
      {/* Header & Feature Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#245C3A]" /> 1D Prediction Sensitivity Analysis
          </h3>
          <p className="text-xs text-[#536B5C]">
            Isolating single-variable model responses while holding remaining 10 features fixed at median reference values
          </p>
        </div>

        {/* Feature Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sensitivity-feature-select" className="text-xs font-bold text-[#26352B]">
            Feature:
          </label>
          <select
            id="sensitivity-feature-select"
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#C5DAC0] text-[#26352B] focus:outline-none focus:ring-2 focus:ring-[#3E7C45]"
          >
            {FEATURE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Line Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B]">
            Simulated Irrigation Deficit Response to {selectedOption.label} (mm/day)
          </h4>
          <span className="text-[11px] text-[#536B5C]">
            Source: <code className="text-[#245C3A]">prediction_sensitivity.csv</code>
          </span>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
                <XAxis
                  dataKey="feature_value"
                  tick={{ fill: '#536B5C', fontSize: 11 }}
                  unit={selectedOption.unit ? ` ${selectedOption.unit}` : ''}
                />
                <YAxis
                  unit=" mm"
                  tick={{ fill: '#536B5C', fontSize: 11 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(2)} mm/day` : val, 'Deficit']}
                  labelFormatter={(lbl) => `${selectedOption.label}: ${lbl} ${selectedOption.unit}`}
                  contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="rf_pred"
                  name="Random Forest Estimate"
                  stroke="#3E7C45"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3E7C45' }}
                />
                <Line
                  type="monotone"
                  dataKey="xgb_pred"
                  name="XGBoost Estimate"
                  stroke="#3F86B5"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#3F86B5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#536B5C]">
            Detailed interactive plot below for {selectedOption.label}.
          </div>
        )}
      </div>

      {/* Artifact PNG Viewer */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Original High-Resolution Sensitivity Curve
          </h4>
          <button
            type="button"
            onClick={() => setShowPng(!showPng)}
            className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer"
          >
            {showPng ? 'Hide Artifact' : 'Show Artifact'}
          </button>
        </div>

        {showPng && (
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] text-center">
            <span className="text-xs font-bold text-[#26352B] block mb-2">
              Plot: <code className="text-[#245C3A]">{selectedOption.png}</code>
            </span>
            <img
              src={`/plots/${selectedOption.png}`}
              alt={`Sensitivity ${selectedOption.label}`}
              className="max-h-96 rounded-xl border border-[#D8E4D0] bg-white object-contain mx-auto shadow-2xs"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Scientific Limitation */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2 text-xs text-[#536B5C]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#26352B]">
          <Info className="w-4 h-4 text-[#3E7C45]" /> Sensitivity vs. Joint Weather Feasibility
        </div>
        <p className="leading-relaxed">
          1D sensitivity curves illustrate <em>ceteris paribus</em> responses: how the model behaves when varying one variable while freezing others at dataset medians. In real meteorology, variables are strongly co-dependent (e.g., peak solar radiation rarely coincides with 95% humidity and heavy rainfall). These curves demonstrate model smoothness rather than observable weather trajectories.
        </p>
      </div>
    </div>
  );
};
