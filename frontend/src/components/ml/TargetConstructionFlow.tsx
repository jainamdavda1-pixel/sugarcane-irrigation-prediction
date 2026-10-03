import React from 'react';
import { ArrowRight, Calculator, AlertTriangle } from 'lucide-react';

export const TargetConstructionFlow: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B]">
            What is the Model Trained to Predict?
          </h3>
          <p className="text-xs text-[#536B5C]">
            Target derivation pipeline for the continuous variable <code className="text-[#245C3A] font-bold">irrigation_requirement_mm</code>
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs text-center space-y-1.5">
          <span className="text-[10px] font-bold text-[#536B5C] uppercase tracking-wider block">Step 1</span>
          <div className="text-xs font-bold text-[#26352B]">Daily Climate & Solar</div>
          <div className="text-[11px] text-[#536B5C]">Hargreaves–Samani Extraterrestrial Radiation</div>
        </div>

        <div className="hidden sm:flex justify-center text-[#78A85B]">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs text-center space-y-1.5">
          <span className="text-[10px] font-bold text-[#536B5C] uppercase tracking-wider block">Step 2</span>
          <div className="text-xs font-bold text-[#26352B]">Ref. ET (ET0)</div>
          <div className="text-[11px] font-mono text-[#3F86B5]">0.0023 × Ra × (Tmax - Tmin)^0.5 × (Tmean + 17.8)</div>
        </div>

        <div className="hidden sm:flex justify-center text-[#78A85B]">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs text-center space-y-1.5">
          <span className="text-[10px] font-bold text-[#536B5C] uppercase tracking-wider block">Step 3</span>
          <div className="text-xs font-bold text-[#26352B]">Cane ETc Proxy</div>
          <div className="text-[11px] font-mono text-[#245C3A]">ETc = 1.20 × ET0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
        {/* Step 4 */}
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs text-center space-y-1.5">
          <span className="text-[10px] font-bold text-[#536B5C] uppercase tracking-wider block">Step 4</span>
          <div className="text-xs font-bold text-[#26352B]">Effective Rain</div>
          <div className="text-[11px] font-mono text-[#3F86B5]">P_eff = min(0.80 × Precip, ETc)</div>
        </div>

        <div className="hidden sm:flex justify-center text-[#78A85B]">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* Step 5 */}
        <div className="p-4 rounded-2xl bg-[#EDF4E7] border-2 border-[#C5DAC0] shadow-xs text-center space-y-1.5 sm:col-span-3">
          <span className="text-[10px] font-bold text-[#245C3A] uppercase tracking-wider block">Training Target</span>
          <div className="text-sm font-extrabold text-[#245C3A]">
            Daily Irrigation Deficit Proxy = max(ETc - P_eff, 0)
          </div>
          <div className="text-xs text-[#536B5C]">Continuous target value in mm/day used to supervise Random Forest & XGBoost</div>
        </div>
      </div>

      {/* Formulas & Assumptions Card */}
      <div className="p-5 rounded-3xl bg-white border border-[#D8E4D0] space-y-4">
        <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#245C3A]" /> Governing Equations & Modeling Assumptions
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] space-y-1">
            <span className="font-bold text-[#26352B] block">1. Crop Coefficient (Kc = 1.20)</span>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              Assumes a constant proxy coefficient representative of peak mid-season grand growth, rather than a dynamic physiological curve varying from 0.40 to 1.25 across crop age.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] space-y-1">
            <span className="font-bold text-[#26352B] block">2. Empirical Rainfall Efficiency</span>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              Effective rainfall is approximated as 80% of daily precipitation, capped at the daily crop evapotranspiration demand (P_eff ≤ ETc).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] space-y-1">
            <span className="font-bold text-[#26352B] block">3. Formula-Derived Target</span>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              The supervision target was calculated using Hargreaves–Samani ET0 physics rather than measured directly via soil lysimeters, soil moisture sensors, or farm flow meters.
            </p>
          </div>
        </div>

        {/* Scientific Limitation Alert */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9E6] border border-[#F0D58C] text-xs text-[#5C450B] flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
          <span>
            <strong>Key Academic Consideration:</strong> Because the models are trained to learn this empirical physical formula from tabular inputs, the high statistical goodness-of-fit (R² &gt; 0.997) demonstrates the models' capability to approximate the mathematical target function, not field-tested agronomic ground truth.
          </span>
        </div>
      </div>
    </div>
  );
};
