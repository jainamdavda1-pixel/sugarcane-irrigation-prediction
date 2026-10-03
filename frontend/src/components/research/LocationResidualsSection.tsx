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
import { MapPin, AlertCircle, ImageIcon } from 'lucide-react';
import { LOCATION_WISE_ERRORS } from '../../data/experimentsData';

export const LocationResidualsSection: React.FC = () => {
  const [metricView, setMetricView] = useState<'mae' | 'rmse' | 'residual'>('mae');
  const [showArtifacts, setShowArtifacts] = useState<boolean>(true);

  const locations = ['GJ02', 'GJ04', 'KA04', 'TN02', 'TN03', 'TS02', 'UP03', 'UP06'];

  const chartData = locations.map((loc) => {
    const rf = LOCATION_WISE_ERRORS.find((d) => d.location === loc && d.model === 'Random Forest');
    const xgb = LOCATION_WISE_ERRORS.find((d) => d.location === loc && d.model === 'XGBoost');
    return {
      location: `${loc} (${rf?.state.slice(0, 2)})`,
      fullName: `${loc} - ${rf?.district}, ${rf?.state}`,
      'Random Forest':
        metricView === 'mae'
          ? rf?.mae
          : metricView === 'rmse'
          ? rf?.rmse
          : rf?.mean_residual,
      XGBoost:
        metricView === 'mae'
          ? xgb?.mae
          : metricView === 'rmse'
          ? xgb?.rmse
          : xgb?.mean_residual,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#245C3A]" /> Location-Wise Error & Residual Analysis
          </h3>
          <p className="text-xs text-[#536B5C]">
            Performance across 8 completely unseen test locations (1,826 daily records per location)
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMetricView('mae')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'mae' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            MAE
          </button>
          <button
            type="button"
            onClick={() => setMetricView('rmse')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'rmse' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            RMSE
          </button>
          <button
            type="button"
            onClick={() => setMetricView('residual')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'residual' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            Mean Residual (y - ŷ)
          </button>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          {metricView === 'mae'
            ? 'Mean Absolute Error by Held-Out Location (mm/day)'
            : metricView === 'rmse'
            ? 'Root Mean Squared Error by Held-Out Location (mm/day)'
            : 'Mean Residual Bias [Actual Proxy - Predicted] (mm/day)'}
        </h4>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis dataKey="location" tick={{ fill: '#536B5C', fontSize: 11 }} />
              <YAxis unit=" mm" tick={{ fill: '#536B5C', fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(4)} mm/day` : val, '']}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend />
              <Bar dataKey="Random Forest" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Error Table */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E8F0E4] bg-[#F8F7EF]/60">
          <h4 className="text-xs font-bold text-[#26352B] uppercase tracking-wider">
            Location-Wise Generalization Summary (<code className="text-[#245C3A]">location_wise_errors_new_split.csv</code>)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDF4E7] text-[#245C3A] font-bold border-b border-[#D8E4D0]">
              <tr>
                <th className="py-3 px-4">Location ID</th>
                <th className="py-3 px-4">State & Agro-Belt</th>
                <th className="py-3 px-4">Test Records</th>
                <th className="py-3 px-4">RF MAE</th>
                <th className="py-3 px-4">RF RMSE</th>
                <th className="py-3 px-4">XGB MAE</th>
                <th className="py-3 px-4">XGB RMSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0E4] text-[#26352B]">
              {locations.map((loc) => {
                const rf = LOCATION_WISE_ERRORS.find((d) => d.location === loc && d.model === 'Random Forest');
                const xgb = LOCATION_WISE_ERRORS.find((d) => d.location === loc && d.model === 'XGBoost');
                return (
                  <tr key={loc} className="hover:bg-[#F8F7EF]">
                    <td className="py-3 px-4 font-mono font-bold text-[#245C3A]">{loc}</td>
                    <td className="py-3 px-4">
                      {rf?.district}, <span className="font-semibold text-[#536B5C]">{rf?.state}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{rf?.n}</td>
                    <td className="py-3 px-4 font-mono text-[#245C3A]">{rf?.mae.toFixed(4)} mm</td>
                    <td className="py-3 px-4 font-mono text-[#536B5C]">{rf?.rmse.toFixed(4)} mm</td>
                    <td className="py-3 px-4 font-mono text-[#3F86B5]">{xgb?.mae.toFixed(4)} mm</td>
                    <td className="py-3 px-4 font-mono text-[#536B5C]">{xgb?.rmse.toFixed(4)} mm</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Residual Distribution Plots (Colab Artifacts) */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Residual Distribution Plots from Colab
          </h4>
          <button
            type="button"
            onClick={() => setShowArtifacts(!showArtifacts)}
            className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer"
          >
            {showArtifacts ? 'Hide Plots' : 'Show Plots'}
          </button>
        </div>

        {showArtifacts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8]">
              <span className="text-xs font-bold text-[#26352B] block mb-2">Random Forest Residual Distribution (`residual_distribution_random_forest.png`)</span>
              <img src="/plots/residual_distribution_random_forest.png" alt="RF Residuals" className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain" loading="lazy" />
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8]">
              <span className="text-xs font-bold text-[#26352B] block mb-2">XGBoost Residual Distribution (`residual_distribution_xgboost.png`)</span>
              <img src="/plots/residual_distribution_xgboost.png" alt="XGB Residuals" className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain" loading="lazy" />
            </div>
          </div>
        )}
      </div>

      {/* Spatial Variation Analysis */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2 text-xs text-[#536B5C]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#26352B]">
          <AlertCircle className="w-4 h-4 text-[#3E7C45]" /> Spatial Generalization Findings
        </div>
        <p className="leading-relaxed">
          Error rates vary geographically: <strong>TS02</strong> (Nizamabad, Telangana) and <strong>KA04</strong> (Belagavi, Karnataka) achieve very low MAEs (&lt;0.15 mm/day), whereas <strong>TN02/TN03</strong> (Tamil Nadu) experience higher MAEs (~0.33 mm/day) due to distinct coastal and tropical rain shadow dynamics not fully represented in the northern/western training clusters.
        </p>
      </div>
    </div>
  );
};
