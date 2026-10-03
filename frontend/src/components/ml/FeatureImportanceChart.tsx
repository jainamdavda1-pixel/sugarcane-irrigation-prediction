import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Sparkles, AlertTriangle } from 'lucide-react';

const FEATURE_IMPORTANCES = [
  { feature: 'solar_radiation_kwh_m2_day', importance: 41.8, label: 'Solar Radiation (kWh/m²/day)', group: 'Solar' },
  { feature: 'temperature_max_c', importance: 21.6, label: 'Max Temperature (°C)', group: 'Thermal' },
  { feature: 'temperature_mean_c', importance: 13.9, label: 'Mean Temperature (°C)', group: 'Thermal' },
  { feature: 'cos_day_of_year', importance: 8.2, label: 'Cyclic Cosine DOY', group: 'Seasonality' },
  { feature: 'sin_day_of_year', importance: 5.7, label: 'Cyclic Sine DOY', group: 'Seasonality' },
  { feature: 'relative_humidity_percent', importance: 4.1, label: 'Relative Humidity (%)', group: 'Atmospheric' },
  { feature: 'wind_speed_m_s', importance: 2.7, label: 'Wind Speed (m/s)', group: 'Atmospheric' },
  { feature: 'precipitation_mm_day', importance: 1.5, label: 'Precipitation (mm/day)', group: 'Rainfall' },
  { feature: 'latitude', importance: 0.3, label: 'Latitude (°N)', group: 'Spatial' },
  { feature: 'longitude', importance: 0.2, label: 'Longitude (°E)', group: 'Spatial' },
];

export const FeatureImportanceChart: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D99A2B]" /> Feature Importance & Model Explainability
          </h3>
          <p className="text-xs text-[#536B5C]">
            Gini impurity & split gain contributions across the 200/300 tree ensembles
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Relative Feature Contribution (% Share of Tree Splits)
        </h4>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={FEATURE_IMPORTANCES}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 140, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E4" horizontal={false} />
              <XAxis type="number" stroke="#536B5C" fontSize={11} domain={[0, 45]} unit="%" />
              <YAxis
                type="category"
                dataKey="label"
                stroke="#26352B"
                fontSize={11}
                tickLine={false}
                width={135}
              />
              <Tooltip
                formatter={(value: any) => [`${value}% relative importance`, 'Contribution']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#C5DAC0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="importance" fill="#245C3A" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distinction Between Importance & Causation */}
      <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#F0D58C] text-xs text-[#5C450B] flex items-start gap-2.5 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#8C6200] block mb-0.5">Feature Importance vs Physical Causation:</strong>
          Feature importance measures how often a variable was chosen to split nodes and how much it reduced impurity during tree building. It demonstrates statistical reliance, <strong>not direct biological causation</strong>. Solar radiation and temperature dominate because Hargreaves–Samani ET0 physics is fundamentally driven by radiative and thermal fluxes.
        </div>
      </div>
    </div>
  );
};
