import React from 'react';
import { Database, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';

export const DataQualityAuditSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#245C3A]" /> Dataset Quality & Missingness Audit
          </h3>
          <p className="text-xs text-[#536B5C]">
            Verified missingness and lineage breakdown from <code className="text-[#245C3A]">data_quality.csv</code> across all 71,214 daily records
          </p>
        </div>
      </div>

      {/* Dataset Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs text-center">
          <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Total Daily Records</span>
          <span className="text-2xl font-extrabold text-[#245C3A]">71,214</span>
          <span className="text-[10px] text-[#536B5C] block">NASA POWER Daily</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs text-center">
          <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Total Agro-Locations</span>
          <span className="text-2xl font-extrabold text-[#245C3A]">39</span>
          <span className="text-[10px] text-[#536B5C] block">Across 8 Indian States</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs text-center">
          <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Training Set Split</span>
          <span className="text-2xl font-extrabold text-[#3E7C45]">56,606</span>
          <span className="text-[10px] text-[#536B5C] block">31 Locations (79.5%)</span>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs text-center">
          <span className="text-[10px] text-[#536B5C] uppercase tracking-wider block font-bold">Held-Out Test Split</span>
          <span className="text-2xl font-extrabold text-[#3F86B5]">14,608</span>
          <span className="text-[10px] text-[#536B5C] block">8 Locations (20.5%)</span>
        </div>
      </div>

      {/* Feature Missingness Audit Table */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-[#E8F0E4] bg-[#F8F7EF]/60">
          <h4 className="text-xs font-bold text-[#26352B] uppercase tracking-wider">
            Feature Completeness Audit & Modeling Decisions (<code className="text-[#245C3A]">data_quality.csv</code>)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDF4E7] text-[#245C3A] font-bold border-b border-[#D8E4D0]">
              <tr>
                <th className="py-3 px-4">Feature Category</th>
                <th className="py-3 px-4">Columns Included</th>
                <th className="py-3 px-4">Missingness (%)</th>
                <th className="py-3 px-4">ML Status</th>
                <th className="py-3 px-4">Technical Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0E4] text-[#26352B]">
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-semibold">11 Model Features</td>
                <td className="py-3 px-4 text-[#536B5C]">
                  latitude, longitude, temp_mean/max/min, RH, precip, wind_speed, solar_rad, sin/cos_day_of_year
                </td>
                <td className="py-3 px-4 font-mono text-[#3E7C45] font-bold">0.0% (0 missing)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDF4E7] text-[#245C3A]">
                    <CheckCircle2 className="w-3 h-3" /> Active Inputs
                  </span>
                </td>
                <td className="py-3 px-4 text-[#536B5C]">Complete daily continuous time series from NASA POWER.</td>
              </tr>
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-semibold">Simulated Proxy Target</td>
                <td className="py-3 px-4 text-[#536B5C]">irrigation_requirement_mm</td>
                <td className="py-3 px-4 font-mono text-[#3E7C45] font-bold">0.0% (0 missing)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDF4E7] text-[#245C3A]">
                    <CheckCircle2 className="w-3 h-3" /> Target Tensor
                  </span>
                </td>
                <td className="py-3 px-4 text-[#536B5C]">Calculated via Hargreaves ET0 × 1.20 - Peff.</td>
              </tr>
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-semibold">Soil Physical Properties</td>
                <td className="py-3 px-4 text-[#536B5C]">clay, sand, silt, soil_ph, cec, soil_organic_carbon</td>
                <td className="py-3 px-4 font-mono text-[#E39D36] font-bold">89.74% (63,910 rows)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FDF9F3] text-[#8B6848] border border-[#F0E6D8]">
                    <FileText className="w-3 h-3" /> Context Only
                  </span>
                </td>
                <td className="py-3 px-4 text-[#536B5C]">Excluded from model training due to 89.7% missingness; fetched live via ISRIC SoilGrids for context.</td>
              </tr>
              <tr className="hover:bg-[#F8F7EF]">
                <td className="py-3 px-4 font-semibold">Field / Agronomic Inputs</td>
                <td className="py-3 px-4 text-[#536B5C]">crop_variety, growth_stage, crop_start_date, irrigation_method</td>
                <td className="py-3 px-4 font-mono text-[#C64F45] font-bold">100.0% (71,214 rows)</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FDF2F0] text-[#C64F45]">
                    <XCircle className="w-3 h-3" /> Unmodeled
                  </span>
                </td>
                <td className="py-3 px-4 text-[#536B5C]">Unavailable in synthetic NASA POWER table; displayed on frontend for farmer advisory context only.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Distribution Plot */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8E4D0] shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-[#26352B] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#3E7C45]" /> Target Variable Distribution (`target_distribution.png`)
        </h4>
        <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E0EBD8] text-center">
          <img src="/plots/target_distribution.png" alt="Target Distribution" className="max-h-80 rounded-xl border border-[#D8E4D0] bg-white object-contain mx-auto" loading="lazy" />
          <p className="text-[11px] text-[#536B5C] mt-2">
            Right-skewed daily deficit distribution with a distinct peak at 0 mm/day during heavy rainfall events where effective precipitation satisfies or exceeds crop evapotranspiration.
          </p>
        </div>
      </div>

      {/* Scientific Integrity Note */}
      <div className="p-5 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2 text-xs text-[#536B5C]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#26352B]">
          <AlertTriangle className="w-4 h-4 text-[#3E7C45]" /> Academic Transparency & Model Lineage
        </div>
        <p className="leading-relaxed">
          The ML models were trained strictly on the 11 continuous features with 0% missingness. Variables with heavy missingness (SoilGrids) or complete absence (planting dates, crop variety) were purposefully excluded from the feature matrix to avoid arbitrary imputation artifacts.
        </p>
      </div>
    </div>
  );
};
