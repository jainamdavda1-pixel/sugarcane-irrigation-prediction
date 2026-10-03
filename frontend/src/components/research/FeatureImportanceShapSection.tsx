import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Sparkles, AlertTriangle, Cpu, ImageIcon } from 'lucide-react';
import { FEATURE_IMPORTANCE_DATA, SHAP_IMPORTANCE_DATA } from '../../data/experimentsData';

export const FeatureImportanceShapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gini' | 'shap'>('shap');
  const [modelFilter, setModelFilter] = useState<'Random Forest' | 'XGBoost'>('Random Forest');

  const rawGini = FEATURE_IMPORTANCE_DATA.filter((d) => d.model === modelFilter);
  const rawShap = SHAP_IMPORTANCE_DATA.filter((d) => d.model === modelFilter);

  const displayData = (activeTab === 'gini' ? rawGini : rawShap).map((d) => ({
    feature: d.feature,
    value: activeTab === 'gini' ? (d as typeof rawGini[0]).importance * 100 : (d as typeof rawShap[0]).mean_absolute_shap_value,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#245C3A]" /> Feature Importance & SHAP Interpretability
          </h3>
          <p className="text-xs text-[#536B5C]">
            Model attribution comparing Tree Gini/Gain importance against Game-Theoretic SHAP values
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Method Toggle */}
          <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('shap')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'shap' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              Mean |SHAP| (mm/day)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gini')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'gini' ? 'bg-[#245C3A] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              Tree Importance (%)
            </button>
          </div>

          {/* Model Toggle */}
          <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setModelFilter('Random Forest')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                modelFilter === 'Random Forest' ? 'bg-[#3F86B5] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              Random Forest
            </button>
            <button
              type="button"
              onClick={() => setModelFilter('XGBoost')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                modelFilter === 'XGBoost' ? 'bg-[#3F86B5] text-white shadow-xs' : 'text-[#536B5C]'
              }`}
            >
              XGBoost
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#3E7C45]" />
            {modelFilter}: {activeTab === 'shap' ? 'Global Mean |SHAP| Impact (mm/day)' : 'Feature Importance Weight (%)'}
          </h4>
          <span className="text-[11px] text-[#536B5C]">
            Data Source: <code className="text-[#245C3A]">{activeTab === 'shap' ? 'shap_global_importance.csv' : 'feature_importance.csv'}</code>
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE0" />
              <XAxis
                type="number"
                unit={activeTab === 'shap' ? ' mm' : '%'}
                tick={{ fill: '#536B5C', fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="feature"
                tick={{ fill: '#26352B', fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip
                formatter={(val: any) => [
                  typeof val === 'number' ? (activeTab === 'shap' ? `${val.toFixed(4)} mm/day` : `${val.toFixed(2)}%`) : val,
                  activeTab === 'shap' ? 'Mean |SHAP|' : 'Importance',
                ]}
                contentStyle={{ backgroundColor: '#F8F7EF', borderColor: '#D8E4D0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar
                dataKey="value"
                fill={modelFilter === 'Random Forest' ? '#3E7C45' : '#3F86B5'}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SHAP Summary Beeswarm Plots (Colab Artifacts) */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#3F86B5]" /> Verified SHAP Summary Plots (Beeswarm Distributions)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] space-y-2">
            <span className="text-xs font-bold text-[#26352B] block">Random Forest SHAP Summary (`shap_summary_random_forest.png`)</span>
            <img
              src="/plots/shap_summary_random_forest.png"
              alt="Random Forest SHAP Summary"
              className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain"
              loading="lazy"
            />
            <p className="text-[11px] text-[#536B5C]">
              High values of maximum temperature (red dots) push predictions positive (increasing water deficit), while high rainfall strongly pushes predictions negative.
            </p>
          </div>
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] space-y-2">
            <span className="text-xs font-bold text-[#26352B] block">XGBoost SHAP Summary (`shap_summary_xgboost.png`)</span>
            <img
              src="/plots/shap_summary_xgboost.png"
              alt="XGBoost SHAP Summary"
              className="w-full rounded-xl border border-[#D8E4D0] bg-white object-contain"
              loading="lazy"
            />
            <p className="text-[11px] text-[#536B5C]">
              XGBoost displays similar directional behavior, with non-linear threshold effects on precipitation and solar radiation.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Attribution Caution */}
      <div className="p-5 rounded-3xl bg-[#FDF2F0] border border-[#F5C7C3] space-y-2 text-xs text-[#C64F45]">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" /> Crucial Scientific Limitation: Attribution vs. Real-World Causality
        </div>
        <p className="leading-relaxed">
          Feature importance and SHAP values describe <strong>mathematical model attribution</strong> in predicting the simulated deficit proxy (ETc - Peff). They do <strong>not</strong> imply real-world causality. For instance, modifying a single feature artificially in a real field setting triggers complex agronomic feedback loops not captured by regression over historical weather series.
        </p>
      </div>
    </div>
  );
};
