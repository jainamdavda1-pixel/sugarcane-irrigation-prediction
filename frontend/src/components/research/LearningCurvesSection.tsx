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
import { TrendingUp, ImageIcon, AlertCircle } from 'lucide-react';
import { LEARNING_CURVES } from '../../data/experimentsData';

export const LearningCurvesSection: React.FC = () => {
  const [modelFilter, setModelFilter] = useState<'Random Forest' | 'XGBoost'>('Random Forest');
  const [metricView, setMetricView] = useState<'MAE' | 'RMSE'>('MAE');
  const [showPng, setShowPng] = useState<boolean>(true);

  const filteredData = LEARNING_CURVES.filter((d) => d.model === modelFilter).map((d) => ({
    fraction: `${Math.round(d.training_fraction * 100)}%`,
    rows: d.training_rows,
    'Training Error': metricView === 'MAE' ? d.train_mae : d.train_rmse,
    'Validation Error (Held-Out)': metricView === 'MAE' ? d.val_mae : d.val_rmse,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#245C3A]" /> Learning Curves & Bias–Variance Analysis
          </h3>
          <p className="text-xs text-[#536B5C]">
            Model convergence across subsample training sizes (5,660 to 56,606 rows) evaluated against held-out locations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setModelFilter('Random Forest')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                modelFilter === 'Random Forest' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              Random Forest
            </button>
            <button
              type="button"
              onClick={() => setModelFilter('XGBoost')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                modelFilter === 'XGBoost' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              XGBoost
            </button>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMetricView('MAE')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                metricView === 'MAE' ? 'bg-[#3F86B5] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              MAE
            </button>
            <button
              type="button"
              onClick={() => setMetricView('RMSE')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                metricView === 'RMSE' ? 'bg-[#3F86B5] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              RMSE
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B]">
            {modelFilter}: Training vs. Validation {metricView} (mm/day)
          </h4>
          <span className="text-[11px] text-[#536B5C]">
            Data Source: <code className="text-[#245C3A]">learning_curves.csv</code>
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis
                dataKey="fraction"
                tick={{ fill: '#536B5C', fontSize: 12 }}
                label={{ value: 'Training Dataset Size (% of 56,606)', position: 'insideBottom', offset: -10, fill: '#536B5C', fontSize: 11 }}
              />
              <YAxis
                unit=" mm"
                tick={{ fill: '#536B5C', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(4)} mm/day` : val, '']}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Line
                type="monotone"
                dataKey="Training Error"
                stroke="#3E7C45"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3E7C45' }}
              />
              <Line
                type="monotone"
                dataKey="Validation Error (Held-Out)"
                stroke="#C64F45"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 5, fill: '#C64F45' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-Resolution Colab Generated Artifact Plots */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Original Colab Artifact Plots
          </h4>
          <button
            type="button"
            onClick={() => setShowPng(!showPng)}
            className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer"
          >
            {showPng ? 'Hide Artifacts' : 'View Original PNGs'}
          </button>
        </div>

        {showPng && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] space-y-2">
              <span className="text-xs font-bold text-[#26352B] block">Learning Curve MAE (`learning_curve_mae.png`)</span>
              <img
                src="/plots/learning_curve_mae.png"
                alt="Learning Curve MAE"
                className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] space-y-2">
              <span className="text-xs font-bold text-[#26352B] block">Learning Curve RMSE (`learning_curve_rmse.png`)</span>
              <img
                src="/plots/learning_curve_rmse.png"
                alt="Learning Curve RMSE"
                className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Academic Bias-Variance Interpretation & Deep-Dive Conclusions */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6 text-xs text-[#536B5C]">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="font-extrabold text-[#26352B] text-sm uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#245C3A]" /> Bias–Variance Diagnostics & Sample Efficiency Breakdown
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 3 of 10
          </span>
        </div>

        {/* 3-Column Diagnostic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">1. Convergence Rate & Scaling</strong>
            <p className="leading-relaxed">
              At 10% data (5,660 rows), validation error starts at <strong>0.4519 mm/day</strong>. By 50% (28,303 rows), it drops steeply to <strong>0.2928 mm/day</strong>, finally converging to <strong>0.2156 mm/day</strong> at 100%. The smooth downward monotonic curve indicates high sample efficiency with healthy gradient descent.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">2. Bias vs. Variance Diagnostics</strong>
            <p className="leading-relaxed">
              <strong>Low Bias:</strong> Training error stays exceptionally low (~0.105 mm/day), proving neither model suffers from underfitting.
              <br />
              <strong>Low Asymptotic Variance:</strong> The validation curve flattens significantly between 75% and 100% data, indicating diminishing returns from simply collecting more synthetic weather logs without new features.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">3. The Spatial Hold-Out Gap</strong>
            <p className="leading-relaxed">
              The persistent delta between training error (~0.105 mm) and test error (~0.216 mm) is deliberate and healthy. It represents genuine out-of-distribution evaluation across <strong>8 unseen geographical stations</strong> with distinct micro-climates, rather than a trivial randomized in-sample test split.
            </p>
          </div>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 3 Learning Curve Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>Dataset Sufficiency:</strong> 56,606 training samples across 31 locations are more than sufficient to fully saturate the capacity of 200-tree ensembles.</li>
            <li><strong>Generalization Stability:</strong> No catastrophic overfitting occurs; the models reliably stabilize at an operational test MAE of ~0.216 mm/day.</li>
            <li><strong>Future Data Collection Recommendation:</strong> Adding more historical weather records at existing stations offers minimal upside; instead, expanding geographical coverage to under-represented coastal and sub-tropical regions will yield the highest performance gains.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
