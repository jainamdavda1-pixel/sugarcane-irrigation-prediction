import React from 'react';
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
import { Network, CheckCircle2 } from 'lucide-react';
import { PCA_EXPERIMENT_DATA } from '../../data/experimentsData';

export const PcaExperimentSection: React.FC = () => {
  const chartData = [3, 5, 8].map((k) => {
    const rf = PCA_EXPERIMENT_DATA.find((d) => d.model === 'Random Forest' && d.n_components === k);
    const xgb = PCA_EXPERIMENT_DATA.find((d) => d.model === 'XGBoost' && d.n_components === k);
    return {
      name: `${k} PCs (${(rf ? rf.explained_variance_ratio_sum * 100 : 0).toFixed(1)}% Var)`,
      'Random Forest MAE': rf?.test_mae,
      'XGBoost MAE': xgb?.test_mae,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#245C3A]" /> Principal Component Analysis (PCA) Dimensionality Experiment
          </h3>
          <p className="text-xs text-[#536B5C]">
            Comparing linear orthogonal component projections against the raw 11-feature tabular space
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Held-Out Location Test MAE by Number of Principal Components (mm/day)
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis dataKey="name" tick={{ fill: '#536B5C', fontSize: 11 }} />
              <YAxis unit=" mm" domain={[0, 1.6]} tick={{ fill: '#536B5C', fontSize: 11 }} />
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

      {/* Detailed PCA Table */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E8F0E4] bg-[#F8F7EF]/60">
          <h4 className="text-xs font-bold text-[#26352B] uppercase tracking-wider">
            PCA Experiment Metrics (<code className="text-[#245C3A]">pca_experiment_results.csv</code>)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDF4E7] text-[#245C3A] font-bold border-b border-[#D8E4D0]">
              <tr>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Principal Components</th>
                <th className="py-3 px-4">Cum. Explained Variance</th>
                <th className="py-3 px-4">Test MAE (mm/day)</th>
                <th className="py-3 px-4">Test RMSE (mm/day)</th>
                <th className="py-3 px-4">Test R²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0E4] text-[#26352B]">
              {PCA_EXPERIMENT_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F7EF]">
                  <td className="py-3 px-4 font-semibold">{row.model}</td>
                  <td className="py-3 px-4 font-mono">{row.n_components} components</td>
                  <td className="py-3 px-4 font-mono text-[#245C3A]">{(row.explained_variance_ratio_sum * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 font-mono">{row.test_mae.toFixed(4)} mm</td>
                  <td className="py-3 px-4 font-mono">{row.test_rmse.toFixed(4)} mm</td>
                  <td className="py-3 px-4 font-mono">{row.test_r2.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Conclusion & Pedagogical Deep-Dive */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6 text-xs text-[#536B5C]">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="font-extrabold text-[#26352B] text-sm uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#3E7C45]" /> Why Raw Tabular Features Outperform PCA in Tree-Based Regressors
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 6 of 10
          </span>
        </div>

        {/* 3-Column Theoretical Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">1. The "Threshold Smearing" Effect</strong>
            <p className="leading-relaxed">
              Agricultural physics contains sharp discontinuous step-functions (e.g., if precipitation &gt; 5 mm, irrigation instantly drops to 0). Decision trees easily identify axis-aligned thresholds (Precipitation ≤ 5.0 mm). Linear PCA projects these into continuous dense linear combinations (α·Tmax + β·P + γ·Rad), smearing and destroying crisp decision boundaries.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">2. Explained Variance vs. Prediction Error</strong>
            <p className="leading-relaxed">
              While 3 PCs capture <strong>81.4%</strong> of meteorological variance, test MAE increases by <strong>~600%</strong> (from 0.216 to 1.48 mm/day). Even with 8 PCs capturing <strong>98.6%</strong> of variance, test MAE remains nearly <strong>3× worse</strong> (0.630 mm/day) than using the raw 11 features.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">3. Loss of Interpretability</strong>
            <p className="leading-relaxed">
              In agricultural advisory systems, farmers and agronomists need explainable attributions (e.g., "Irrigation increased because temperature exceeded 38°C"). PCA components (PC1, PC2, etc.) are abstract mathematical eigenvectors with no intuitive physical interpretation.
            </p>
          </div>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 6 PCA Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>PCA Rejected for Production:</strong> Dimensionality reduction is strictly unnecessary and counterproductive on low-dimensional physical feature spaces (11 features).</li>
            <li><strong>Production Architecture:</strong> Active deployed models strictly operate on uncompressed raw meteorological variables to guarantee maximum physical precision and complete SHAP explainability.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
