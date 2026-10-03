import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CloudRain, AlertTriangle, ImageIcon, Thermometer, Droplet } from 'lucide-react';
import { WEATHER_CLUSTER_DATA } from '../../data/experimentsData';

export const WeatherClustersSection: React.FC = () => {
  const [showPlot, setShowPlot] = useState<boolean>(true);

  const chartData = WEATHER_CLUSTER_DATA.map((c) => ({
    name: `C${c.cluster}: ${c.name.split(' ')[0]}`,
    'Random Forest MAE': c.rf_mae,
    'XGBoost MAE': c.xgb_mae,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-[#3F86B5]" /> K-Means Weather-Regime Analysis (k=4)
          </h3>
          <p className="text-xs text-[#536B5C]">
            Exploratory clustering of test set meteorological conditions and resulting model error profiles
          </p>
        </div>
      </div>

      {/* Cluster Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WEATHER_CLUSTER_DATA.map((c) => (
          <div key={c.cluster} className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0]">
                Cluster {c.cluster}
              </span>
              <span className="text-[11px] text-[#536B5C] font-mono">{c.n_test_rows} test days</span>
            </div>
            <h4 className="text-xs font-bold text-[#26352B] leading-tight">{c.name}</h4>
            
            <div className="space-y-1 text-[11px] text-[#536B5C] bg-[#F8F7EF] p-2.5 rounded-xl border border-[#E0EBD8]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-[#E39D36]" /> Mean Temp:</span>
                <strong className="text-[#26352B]">{c.mean_temperature_c.toFixed(1)}°C</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-[#3F86B5]" /> Mean Rain:</span>
                <strong className="text-[#26352B]">{c.mean_precipitation_mm_day.toFixed(2)} mm</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-[#245C3A]" /> Mean RH:</span>
                <strong className="text-[#26352B]">{c.mean_relative_humidity_percent.toFixed(1)}%</strong>
              </div>
            </div>

            <div className="pt-1 border-t border-[#E8F0E4] grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#EDF4E7]/60">
                <span className="text-[10px] text-[#536B5C] block">RF MAE</span>
                <strong className="text-[#245C3A]">{c.rf_mae.toFixed(3)} mm</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#E2EFF7]/60">
                <span className="text-[10px] text-[#536B5C] block">XGB MAE</span>
                <strong className="text-[#3F86B5]">{c.xgb_mae.toFixed(3)} mm</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Model MAE by Weather Regime (mm/day)
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis dataKey="name" tick={{ fill: '#536B5C', fontSize: 11 }} />
              <YAxis unit=" mm" domain={[0, 0.35]} tick={{ fill: '#536B5C', fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(4)} mm/day` : val, '']}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend />
              <Bar dataKey="Random Forest MAE" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost MAE" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Original Artifact Image */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Weather Cluster Plot (`weather_cluster_mae.png`)
          </h4>
          <button
            type="button"
            onClick={() => setShowPlot(!showPlot)}
            className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer"
          >
            {showPlot ? 'Hide Plot' : 'View Plot'}
          </button>
        </div>
        {showPlot && (
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8]">
            <img src="/plots/weather_cluster_mae.png" alt="Weather Cluster MAE" className="w-full max-h-96 rounded-xl border border-[#D8E4D0] bg-white object-contain mx-auto" loading="lazy" />
          </div>
        )}
      </div>

      {/* Scientific Clarification */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2 text-xs text-[#536B5C]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#26352B]">
          <AlertTriangle className="w-4 h-4 text-[#E39D36]" /> Academic Clarification on Clustering
        </div>
        <p className="leading-relaxed">
          These four clusters represent <strong>exploratory meteorological regimes</strong> derived from unsupervised K-Means on daily weather features (temperature, humidity, precipitation). They are <strong>not</strong> validated agronomic growth stages or official climatic classification zones.
        </p>
      </div>
    </div>
  );
};
