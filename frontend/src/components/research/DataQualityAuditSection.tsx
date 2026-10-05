import React from 'react';
import { Database, CheckCircle2, XCircle, FileText } from 'lucide-react';

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
                <td className="py-3 px-4 text-[#536B5C]">Excluded from model training due to 89.7% missingness in historical tabular records; fetched via OpenLandMap 250m surface rasters for context.</td>
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

      {/* Academic Integrity & Deep-Dive Data Audit Conclusions */}
      <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6 text-xs text-[#536B5C]">
        <div className="flex items-center justify-between border-b border-[#E0EBD8] pb-3">
          <h4 className="font-extrabold text-[#26352B] text-sm uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#3E7C45]" /> Data Lineage, Missingness Handling & Pipeline Audit
          </h4>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#245C3A] border border-[#C5DAC0]">
            Experiment 10 of 10
          </span>
        </div>

        {/* 3-Column Engineering Decisions Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#245C3A] block">1. 100% Complete Feature Matrix</strong>
            <p className="leading-relaxed">
              All 11 active features across all <strong>71,214 daily rows</strong> have exactly <strong>0% missing values</strong>. Sourced from NASA POWER daily agrometeorology archives, avoiding noisy statistical imputation or synthetic interpolation artifacts in core inputs.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#E39D36] block">2. Soil Missingness & Runtime Rasters</strong>
            <p className="leading-relaxed">
              Historical CSV soil properties had <strong>89.74% missing values</strong> (63,910 rows). To protect ML training integrity, soil columns were excluded from the regression tensor and instead retrieved at runtime via <strong>OpenLandMap 250m global soil rasters</strong> for advisory context.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E0EBD8] shadow-2xs space-y-2">
            <strong className="text-sm font-bold text-[#3F86B5] block">3. Target Zero-Inflation Physics</strong>
            <p className="leading-relaxed">
              The target deficit distribution contains a sharp peak at <strong>0.00 mm/day</strong> during monsoon seasons where effective rainfall exceeds crop evapotranspiration (Peff ≥ ETc), followed by a smooth right-skewed tail up to 9.2 mm/day during dry summer heatwaves.
            </p>
          </div>
        </div>

        {/* Structured Takeaways / Conclusion */}
        <div className="p-4 bg-[#EDF4E7] rounded-2xl border border-[#C5DAC0] space-y-2 text-xs text-[#26352B]">
          <strong className="text-sm font-bold block text-[#245C3A]">📌 Experiment 10 Data Audit Conclusion:</strong>
          <ul className="list-disc list-inside space-y-1 text-[#26352B]/90">
            <li><strong>Strict Data Lineage:</strong> Training strictly on complete continuous weather logs prevents synthetic artifacts from propagating into farmer advisory recommendations.</li>
            <li><strong>Hybrid Architecture:</strong> Combining ML regression on weather with live raster lookups for soil physics provides the optimal balance of statistical rigor and agronomic completeness.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
