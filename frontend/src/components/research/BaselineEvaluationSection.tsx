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
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BASELINE_METRICS } from '../../data/experimentsData';

export const BaselineEvaluationSection: React.FC = () => {
  const [metricView, setMetricView] = useState<'mae' | 'rmse'>('mae');

  const chartData = [
    {
      split: 'Training Split (56,606 rows / 31 locs)',
      'Random Forest': BASELINE_METRICS.find((m) => m.model === 'Random Forest' && m.split === 'train')?.[metricView === 'mae' ? 'mae' : 'rmse'],
      XGBoost: BASELINE_METRICS.find((m) => m.model === 'XGBoost' && m.split === 'train')?.[metricView === 'mae' ? 'mae' : 'rmse'],
    },
    {
      split: 'Held-Out Test Locations (14,608 rows / 8 locs)',
      'Random Forest': BASELINE_METRICS.find((m) => m.model === 'Random Forest' && m.split === 'held_out_locations')?.[metricView === 'mae' ? 'mae' : 'rmse'],
      XGBoost: BASELINE_METRICS.find((m) => m.model === 'XGBoost' && m.split === 'held_out_locations')?.[metricView === 'mae' ? 'mae' : 'rmse'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#245C3A]" /> Baseline Model Evaluation Metrics
          </h3>
          <p className="text-xs text-[#536B5C]">
            Verified metrics from <code className="text-[#245C3A]">new_split_baseline_metrics.csv</code> evaluated on train vs. unseen test locations
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMetricView('mae')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'mae' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            MAE (mm/day)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('rmse')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              metricView === 'rmse' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
            }`}
          >
            RMSE (mm/day)
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Random Forest Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EDF4E7] text-[#245C3A] font-extrabold flex items-center justify-center text-xs">
                RF
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#26352B]">Random Forest Regressor</h4>
                <span className="text-[11px] text-[#536B5C]">200 Trees · bootstrap=True · n_jobs=-1</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#EDF4E7] text-[#245C3A] text-[11px] font-bold border border-[#C5DAC0]">
              Lowest Held-Out MAE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test MAE</span>
              <span className="text-lg font-extrabold text-[#245C3A]">0.2156</span>
              <span className="text-[10px] text-[#536B5C] block">mm/day</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test RMSE</span>
              <span className="text-lg font-extrabold text-[#245C3A]">0.3197</span>
              <span className="text-[10px] text-[#536B5C] block">mm/day</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test R²</span>
              <span className="text-lg font-extrabold text-[#245C3A]">0.9971</span>
              <span className="text-[10px] text-[#536B5C] block">99.71% variance</span>
            </div>
          </div>

          <div className="text-xs text-[#536B5C] bg-[#F8F7EF] p-3 rounded-xl border border-[#E0EBD8] space-y-1">
            <div className="flex justify-between">
              <span>Training Split MAE:</span>
              <strong className="text-[#26352B]">0.1056 mm/day (n=56,606)</strong>
            </div>
            <div className="flex justify-between">
              <span>Training Split R²:</span>
              <strong className="text-[#26352B]">0.9993</strong>
            </div>
          </div>
        </div>

        {/* XGBoost Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E2EFF7] text-[#3F86B5] font-extrabold flex items-center justify-center text-xs">
                XGB
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#26352B]">XGBoost Regressor</h4>
                <span className="text-[11px] text-[#536B5C]">100 Trees · max_depth=6 · lr=0.1</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#E2EFF7] text-[#3F86B5] text-[11px] font-bold border border-[#BFDBE9]">
              Lowest Held-Out RMSE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test MAE</span>
              <span className="text-lg font-extrabold text-[#3F86B5]">0.2250</span>
              <span className="text-[10px] text-[#536B5C] block">mm/day</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test RMSE</span>
              <span className="text-lg font-extrabold text-[#3F86B5]">0.2939</span>
              <span className="text-[10px] text-[#536B5C] block">mm/day</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
              <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Test R²</span>
              <span className="text-lg font-extrabold text-[#3F86B5]">0.9975</span>
              <span className="text-[10px] text-[#536B5C] block">99.75% variance</span>
            </div>
          </div>

          <div className="text-xs text-[#536B5C] bg-[#F8F7EF] p-3 rounded-xl border border-[#E0EBD8] space-y-1">
            <div className="flex justify-between">
              <span>Training Split MAE:</span>
              <strong className="text-[#26352B]">0.1758 mm/day (n=56,606)</strong>
            </div>
            <div className="flex justify-between">
              <span>Training Split R²:</span>
              <strong className="text-[#26352B]">0.9986</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B]">
          Train vs. Held-Out Location Generalization ({metricView.toUpperCase()} in mm/day)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis dataKey="split" tick={{ fill: '#536B5C', fontSize: 12 }} />
              <YAxis
                unit=" mm"
                domain={[0, 0.4]}
                tick={{ fill: '#536B5C', fontSize: 11 }}
              />
              <Tooltip
                formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(4)} mm/day` : val, '']}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Random Forest" fill="#3E7C45" radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost" fill="#3F86B5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Academic Interpretation & Disclaimers */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-3">
        <h4 className="text-xs font-bold text-[#26352B] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3E7C45]" /> Metric Definitions & Academic Interpretation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#536B5C]">
          <div className="p-3 bg-white rounded-xl border border-[#E0EBD8]">
            <strong className="text-[#26352B] block mb-1">Mean Absolute Error (MAE)</strong>
            Average linear error magnitude. Random Forest achieves 0.2156 mm/day on held-out locations, closely estimating average daily crop water demand.
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E0EBD8]">
            <strong className="text-[#26352B] block mb-1">Root Mean Squared Error (RMSE)</strong>
            Penalizes larger outliers quadratically. XGBoost achieves 0.2939 mm/day on test locations, demonstrating fewer extreme residual outliers.
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E0EBD8]">
            <strong className="text-[#26352B] block mb-1">Coefficient of Determination (R²)</strong>
            Proportion of formula target variance explained. Both models explain &gt;99.7% of target variation under held-out location tests.
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-[#C64F45] bg-[#FDF2F0] p-3 rounded-xl border border-[#F5C7C3]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Crucial Academic Clarification:</strong> R² &gt; 0.997 reflects how accurately the models approximate the formula-derived simulated proxy target (ETc - Peff), not real-world sensor-validated crop irrigation.
          </span>
        </div>
      </div>
    </div>
  );
};
