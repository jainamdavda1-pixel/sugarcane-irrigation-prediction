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
import { MapPin, ImageIcon } from 'lucide-react';
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

      {/* Academic Spatial Analysis & Comprehensive Generalization Conclusions */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6 text-xs text-[#536B5C]">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="font-extrabold text-[#26352B] text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#245C3A]" /> Spatial Generalization Dynamics & Regional Micro-Climate Breakdown
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 9 of 10
          </span>
        </div>

        {/* 3-Column Regional Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-[#245C3A]">1. High Transferability Zones</strong>
              <span className="px-2 py-0.5 rounded bg-[#EDF4E7] text-[#245C3A] font-mono font-bold text-[10px]">MAE &lt; 0.15 mm</span>
            </div>
            <p className="leading-relaxed">
              <strong>TS02 (Nizamabad, Telangana)</strong> and <strong>KA04 (Belagavi, Karnataka)</strong> achieve stellar MAEs of <strong>0.138 mm</strong> and <strong>0.149 mm/day</strong>. Their weather regimes closely mirror the Deccan plateau agricultural belts present in the training set.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-[#3F86B5]">2. Gangetic & Western Belts</strong>
              <span className="px-2 py-0.5 rounded bg-[#E2EFF7] text-[#3F86B5] font-mono font-bold text-[10px]">MAE ~ 0.18–0.24 mm</span>
            </div>
            <p className="leading-relaxed">
              <strong>UP03/UP06 (Uttar Pradesh)</strong> and <strong>GJ02/GJ04 (Gujarat)</strong> display consistent performance (~0.21 mm MAE). Sub-tropical continental temperature swings are smoothly handled across all seasons.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-[#C64F45]">3. Coastal & Rain Shadow Outliers</strong>
              <span className="px-2 py-0.5 rounded bg-[#FDF2F0] text-[#C64F45] font-mono font-bold text-[10px]">MAE ~ 0.32–0.34 mm</span>
            </div>
            <p className="leading-relaxed">
              <strong>TN02 (Cuddalore)</strong> and <strong>TN03 (Erode, Tamil Nadu)</strong> exhibit higher MAEs (~0.33 mm/day) due to the retreating North-East winter monsoon (Oct–Dec), which brings heavy winter showers that differ from the southwest monsoon training patterns.
            </p>
          </div>
        </div>

        {/* Residual Bias Assessment */}
        <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-2">
          <strong className="text-sm font-bold text-[#26352B] block">
            ⚖️ Residual Bias Inspection (Mean Residual = Actual - Predicted)
          </strong>
          <p className="leading-relaxed">
            Mean residuals across all 8 held-out stations hover between <strong>-0.03 mm/day and +0.02 mm/day</strong> (centered near zero). This confirms that neither model suffers from systematic directional bias (neither chronic under-irrigation nor chronic over-irrigation) across any Indian state.
          </p>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 9 Spatial Generalization Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>Zero-Shot Spatial Generalization:</strong> The model generalizes across 8 held-out states without needing station-specific hyperparameter fine-tuning.</li>
            <li><strong>Targeted Improvement Area:</strong> Ingesting more historical records from coastal Tamil Nadu and Andhra Pradesh during the Northeast monsoon will eliminate the remaining regional error gradient.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
