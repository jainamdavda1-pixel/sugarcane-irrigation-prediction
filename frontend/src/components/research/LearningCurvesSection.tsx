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

      {/* Academic Bias-Variance Interpretation */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-3 text-xs text-[#536B5C]">
        <h4 className="font-bold text-[#26352B] text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#245C3A]" /> Theoretical Interpretation & Generalization Bounds
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-xl border border-[#E0EBD8]">
            <strong className="text-[#26352B] block mb-1">Convergence Dynamics</strong>
            At 10% data (5,660 samples), Random Forest validation MAE is 0.452 mm/day. As training scales to 100% (56,606 samples), validation MAE steadily falls to 0.216 mm/day, showing low asymptotic variance and strong sample efficiency.
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E0EBD8]">
            <strong className="text-[#26352B] block mb-1">Generalization Gap Analysis</strong>
            The persistent gap between train error (~0.105 mm/day) and held-out test error (~0.216 mm/day) is attributable to spatial location hold-out: testing on completely unseen geographical micro-climates rather than simple in-distribution random splits.
          </div>
        </div>
      </div>
    </div>
  );
};
