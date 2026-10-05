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

      {/* Academic Attribution & In-Depth Interpretability Conclusions */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6 text-xs text-[#536B5C]">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="font-extrabold text-[#26352B] text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#245C3A]" /> Feature Importance vs. Game-Theoretic SHAP Interpretability
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 4 of 10
          </span>
        </div>

        {/* Method Comparison: Gini vs SHAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-2">
            <strong className="text-sm font-bold text-[#26352B] block">🌳 Gini Impurity / Gain Weight (Tree-Based)</strong>
            <p className="leading-relaxed">
              Tree feature importances sum split improvements across trees. While fast, Gini importance suffers from known biases toward continuous, high-cardinality features and does not reveal the <em>direction</em> (positive vs. negative) of a feature's effect on irrigation needs.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-2">
            <strong className="text-sm font-bold text-[#245C3A] block">⚡ Game-Theoretic TreeSHAP (Additive Margins)</strong>
            <p className="leading-relaxed">
              SHAP assigns each feature its exact marginal contribution to the prediction compared to the dataset baseline (in absolute mm/day units). It satisfies formal mathematical properties of efficiency, symmetry, and additivity.
            </p>
          </div>
        </div>

        {/* Directional Biophysical Mechanics */}
        <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-3">
          <strong className="text-sm font-bold text-[#26352B] block">
            🔬 Physical Mechanics of Top Features (Validated by SHAP Beeswarm)
          </strong>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E8F0E4] space-y-1">
              <strong className="text-[#245C3A] block font-bold">1. Maximum Temperature (+1.84 mm/day)</strong>
              <p>Primary thermodynamic driver of vapor pressure deficit (VPD). Higher maximum temperatures exponentially accelerate sugarcane stomatal transpiration.</p>
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E8F0E4] space-y-1">
              <strong className="text-[#245C3A] block font-bold">2. Solar Radiation (+1.38 mm/day)</strong>
              <p>Provides net radiative energy for latent heat flux and water phase change from liquid to vapor at the sugarcane canopy.</p>
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E8F0E4] space-y-1">
              <strong className="text-[#C64F45] block font-bold">3. Precipitation (-0.92 mm/day)</strong>
              <p>Acts as an immediate negative sink: daily rainfall &gt; 5 mm offsets evapotranspiration and drives required irrigation directly toward 0 mm/day.</p>
            </div>
          </div>
        </div>

        {/* Crucial Scientific Limitation Box */}
        <div className="p-4 rounded-2xl bg-[#FDF2F0] border border-[#F5C7C3] space-y-1 text-[#C64F45]">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" /> Crucial Scientific Limitation: Attribution vs. Real-World Causality
          </div>
          <p className="leading-relaxed">
            Feature importance and SHAP values describe <strong>mathematical model attribution</strong> in predicting the simulated deficit proxy (ETc - Peff). They do <strong>not</strong> imply direct agronomic causality in real fields where root-zone moisture holding capacity, soil compaction, and irrigation system efficiency modulate actual water uptake.
          </p>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 4 SHAP Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>Thermodynamic Alignment:</strong> Top features across both models are Tmax, Solar Radiation, and Precipitation, perfectly matching FAO-56 biophysical principles.</li>
            <li><strong>Model Consistency:</strong> Both Random Forest and XGBoost exhibit near-identical feature rankings, confirming that the learned physical representations are robust across different ensemble algorithms.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
