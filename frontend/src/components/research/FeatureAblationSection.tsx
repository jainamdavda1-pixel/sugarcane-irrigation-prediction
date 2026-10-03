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
import { Layers, AlertCircle, ImageIcon } from 'lucide-react';
import { FEATURE_ABLATION_DATA } from '../../data/experimentsData';

export const FeatureAblationSection: React.FC = () => {
  const [metricView, setMetricView] = useState<'mae' | 'rmse'>('mae');
  const [showArtifacts, setShowArtifacts] = useState<boolean>(true);

  const ablationGroups = [
    'all_11_features',
    'without_location',
    'without_seasonal',
    'weather_only',
    'location_and_seasonal_only',
  ];

  const chartData = ablationGroups.map((group) => {
    const rf = FEATURE_ABLATION_DATA.find((d) => d.model === 'Random Forest' && d.feature_group === group);
    const xgb = FEATURE_ABLATION_DATA.find((d) => d.model === 'XGBoost' && d.feature_group === group);
    return {
      groupName: rf?.feature_group_label || group,
      'Random Forest': metricView === 'mae' ? rf?.test_mae : rf?.test_rmse,
      XGBoost: metricView === 'mae' ? xgb?.test_mae : xgb?.test_rmse,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#245C3A]" /> Feature Ablation Study
          </h3>
          <p className="text-xs text-[#536B5C]">
            Quantifying model degradation when spatial coordinates, calendar harmonics, or meteorological variables are removed
          </p>
        </div>

        <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMetricView('mae')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'mae' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            Test MAE (mm/day)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('rmse')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'rmse' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            Test RMSE (mm/day)
          </button>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Held-Out Location Test {metricView.toUpperCase()} by Feature Subset (mm/day)
        </h4>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis
                dataKey="groupName"
                interval={0}
                angle={-15}
                textAnchor="end"
                tick={{ fill: '#536B5C', fontSize: 11 }}
              />
              <YAxis
                unit=" mm"
                tick={{ fill: '#536B5C', fontSize: 11 }}
              />
              <Tooltip
                formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(4)} mm/day` : val, '']}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
              <Bar dataKey="Random Forest" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ablation Table */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E8F0E4] bg-[#F8F7EF]/60">
          <h4 className="text-xs font-bold text-[#26352B] uppercase tracking-wider">
            Detailed Ablation Metrics (<code className="text-[#245C3A]">feature_ablation_results.csv</code>)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDF4E7] text-[#245C3A] font-bold border-b border-[#D8E4D0]">
              <tr>
                <th className="py-3 px-4">Feature Subset</th>
                <th className="py-3 px-4">Features</th>
                <th className="py-3 px-4">RF Test MAE</th>
                <th className="py-3 px-4">RF Test R²</th>
                <th className="py-3 px-4">XGB Test MAE</th>
                <th className="py-3 px-4">XGB Test R²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0E4] text-[#26352B]">
              {ablationGroups.map((group) => {
                const rf = FEATURE_ABLATION_DATA.find((d) => d.model === 'Random Forest' && d.feature_group === group);
                const xgb = FEATURE_ABLATION_DATA.find((d) => d.model === 'XGBoost' && d.feature_group === group);
                const isBaseline = group === 'all_11_features';
                return (
                  <tr key={group} className={isBaseline ? 'bg-[#EDF4E7]/40 font-semibold' : 'hover:bg-[#F8F7EF]'}>
                    <td className="py-3 px-4">
                      {rf?.feature_group_label}
                      <span className="block text-[10px] text-[#536B5C] font-normal">{rf?.description}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{rf?.n_features}</td>
                    <td className="py-3 px-4 font-mono text-[#245C3A]">{rf?.test_mae.toFixed(4)} mm</td>
                    <td className="py-3 px-4 font-mono">{rf?.test_r2.toFixed(4)}</td>
                    <td className="py-3 px-4 font-mono text-[#3F86B5]">{xgb?.test_mae.toFixed(4)} mm</td>
                    <td className="py-3 px-4 font-mono">{xgb?.test_r2.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Artifact Plots */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Ablation Visualizations from Colab
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
              <span className="text-xs font-bold text-[#26352B] block mb-2">Feature Ablation Test MAE (`feature_ablation_test_mae.png`)</span>
              <img src="/plots/feature_ablation_test_mae.png" alt="Ablation MAE" className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain" loading="lazy" />
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8]">
              <span className="text-xs font-bold text-[#26352B] block mb-2">Feature Ablation Test RMSE (`feature_ablation_test_rmse.png`)</span>
              <img src="/plots/feature_ablation_test_rmse.png" alt="Ablation RMSE" className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain" loading="lazy" />
            </div>
          </div>
        )}
      </div>

      {/* Academic Finding Box */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2 text-xs text-[#536B5C]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#26352B]">
          <AlertCircle className="w-4 h-4 text-[#3E7C45]" /> Key Experimental Finding
        </div>
        <p className="leading-relaxed">
          When relying only on spatial coordinates and calendar harmonics (4 features), test MAE jumps from <strong>0.2156 mm/day</strong> to <strong>2.5722 mm/day</strong> ($R^2$ collapses to 0.622). This experimentally proves that pure location and season cannot replace live meteorological measurements.
        </p>
      </div>
    </div>
  );
};
