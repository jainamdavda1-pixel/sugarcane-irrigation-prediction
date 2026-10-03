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

      <div className="p-4 rounded-2xl bg-[#EDF4E7] border border-[#C5DAC0] text-xs text-[#26352B] leading-relaxed">
        <strong>Academic Regressor Classification:</strong> Both models are trained as continuous numerical regressors because the project's target variable is a simulated continuous daily deficit proxy (mm/day), rather than an attack class, crop category, or discrete classification label. Neither model is universally superior; each exhibits specific metric trade-offs on the held-out test split.
      </div>
    </div>
  );
};
