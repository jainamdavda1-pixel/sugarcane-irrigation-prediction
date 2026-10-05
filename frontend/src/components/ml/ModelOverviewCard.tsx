import React from 'react';
import { Bot, Cpu } from 'lucide-react';

export const ModelOverviewCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B]">
            Model Architectures & Pipeline Specifications
          </h3>
          <p className="text-xs text-[#536B5C]">
            Both models are trained as continuous numerical regressors on tabular meteorological and location features
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Random Forest Card */}
        <div className="bg-white border-2 border-[#C5DAC0] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#EDF4E7] text-[#245C3A]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#26352B]">
                  Random Forest Regressor
                </h4>
                <span className="text-xs text-[#536B5C]">Scikit-Learn Pipeline</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0]">
              Bagging Ensemble
            </span>
          </div>

          <p className="text-xs text-[#536B5C] leading-relaxed">
            Random Forest is an ensemble learning algorithm that builds multiple independent decision trees using bootstrap aggregation (bagging). Each tree generates a regression estimate, and the final prediction is the average across all trees, effectively mitigating variance and capturing nonlinear relationships.
          </p>

          <div className="space-y-2 pt-2 border-t border-[#E8F0E4] text-xs">
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Number of Estimators (Trees)</span>
              <strong className="font-mono text-[#26352B]">200 trees</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Minimum Samples Leaf</span>
              <strong className="font-mono text-[#26352B]">2</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Missing Value Imputer</span>
              <strong className="font-mono text-[#26352B]">SimpleImputer (median)</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Random State</span>
              <strong className="font-mono text-[#26352B]">42 (Reproducible)</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#536B5C]">Artifact Size</span>
              <strong className="font-mono text-[#26352B]">396.98 MB (random_forest.joblib)</strong>
            </div>
          </div>
        </div>

        {/* XGBoost Card */}
        <div className="bg-white border-2 border-[#BDD6E7] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E8F1F7] text-[#3F86B5]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#26352B]">
                  XGBoost Regressor
                </h4>
                <span className="text-xs text-[#536B5C]">XGBoost Python API</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8F1F7] text-[#3F86B5] border border-[#BDD6E7]">
              Gradient Boosting
            </span>
          </div>

          <p className="text-xs text-[#536B5C] leading-relaxed">
            XGBoost (Extreme Gradient Boosting) is an optimized distributed gradient boosting framework. It builds decision trees sequentially, with each new tree minimizing the pseudo-residuals of the prior ensemble using second-order Taylor expansion and regularized loss functions.
          </p>

          <div className="space-y-2 pt-2 border-t border-[#E8F0E4] text-xs">
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Number of Trees (n_estimators)</span>
              <strong className="font-mono text-[#26352B]">300 trees</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Learning Rate (eta)</span>
              <strong className="font-mono text-[#26352B]">0.05</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Max Tree Depth</span>
              <strong className="font-mono text-[#26352B]">6</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F5EC]">
              <span className="text-[#536B5C]">Subsample / Colsample</span>
              <strong className="font-mono text-[#26352B]">0.80 by tree</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#536B5C]">Artifact Size</span>
              <strong className="font-mono text-[#26352B]">1.41 MB (xgboost.joblib)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Architectural Deep-Dive & Target Formulation */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="text-sm font-extrabold text-[#26352B] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#245C3A]" /> Architectural Comparison, Target Mathematics & Operational Takeaways
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 2 of 10
          </span>
        </div>

        {/* Mathematical Target Formulation Breakdown */}
        <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-3 text-xs text-[#536B5C]">
          <strong className="text-sm font-bold text-[#26352B] block">
            📐 Target Variable Construction: The Daily Deficit Proxy (y)
          </strong>
          <p className="leading-relaxed">
            The target continuous value y = irrigation_requirement_mm is simulated daily according to standard FAO-56 irrigation engineering principles:
          </p>
          <div className="p-3 bg-[#EDF4E7] rounded-xl font-mono text-[#245C3A] text-center text-xs font-bold border border-[#C5DAC0]">
            Irrigation Requirement (mm/day) = max(0, ETc - Peff)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
            <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E8F0E4]">
              <strong className="text-[#26352B] block mb-1">1. Crop Evapotranspiration (ETc = ET0 × Kc)</strong>
              Reference evapotranspiration (ET0) calculated via the temperature-radiation Hargreaves equation, scaled by the sugarcane mid-season crop coefficient (Kc = 1.20).
            </div>
            <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E8F0E4]">
              <strong className="text-[#26352B] block mb-1">2. Effective Precipitation (Peff)</strong>
              USDA Soil Conservation Service (SCS) method accounting for runoff and deep percolation losses (Peff = max(0, P × 0.8 - 5)).
            </div>
          </div>
        </div>

        {/* Engineering Trade-offs: Memory & Latency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-2">
            <strong className="text-sm font-bold text-[#245C3A] block">🌲 Random Forest (396.98 MB)</strong>
            <p className="text-[#536B5C] leading-relaxed">
              <strong>Mechanism:</strong> Fully independent bootstrap tree growth. Because trees are grown to depth until leaves have ≥ 2 samples, the ensemble contains extensive split nodes resulting in a large ~397 MB binary.
            </p>
            <span className="block text-[11px] text-[#26352B] bg-[#EDF4E7] p-2 rounded-lg">
              <strong>Best For:</strong> Highly robust desktop or server environments where memory is plentiful and extreme stability across tranquil days is required.
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] space-y-2">
            <strong className="text-sm font-bold text-[#3F86B5] block">🚀 XGBoost (1.41 MB)</strong>
            <p className="text-[#536B5C] leading-relaxed">
              <strong>Mechanism:</strong> Sequential gradient boosting with tree depth constrained to ≤ 6. Gradient shrinkage (eta = 0.05) creates a lightweight, highly regularized model that is &gt;280× smaller on disk.
            </p>
            <span className="block text-[11px] text-[#26352B] bg-[#E2EFF7] p-2 rounded-lg">
              <strong>Best For:</strong> Edge IoT devices, mobile microservices, and serverless containers where RAM and cold-start speed are critical constraints.
            </span>
          </div>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 2 Architecture Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>Continuous Regressors:</strong> Both pipelines model a continuous physical fluid volume (mm/day water column) rather than discrete binary irrigation triggers.</li>
            <li><strong>Production Strategy:</strong> The system maintains both models simultaneously—providing full explainability transparency and allowing users to verify estimates across both bagging and boosting paradigms.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
