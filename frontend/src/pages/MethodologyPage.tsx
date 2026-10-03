import React from 'react';
import {
  FileText,
  Workflow,
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Server,
  CloudSun,
  Terminal,
  Layers,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EDF4E7] text-[#245C3A]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
              Dataset, Architecture & Engineering Methodology
            </h1>
            <p className="text-xs sm:text-sm text-[#536B5C]">
              End-to-end software pipeline, data integration, scientific assumptions, and limitations
            </p>
          </div>
        </div>
      </div>

      {/* A. Project Objective */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-[#26352B] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#3E7C45]" /> Academic Project Objective
        </h2>
        <p className="text-xs sm:text-sm text-[#536B5C] leading-relaxed">
          The goal of this research project is to develop an automated machine learning decision-support prototype that predicts a <strong>simulated daily irrigation-deficit proxy (mm/day)</strong> for sugarcane agro-climatic zones across India using location coordinates and automated Open-Meteo meteorological parameters, eliminating the burden of manual weather parameter entry for farmers.
        </p>
      </div>

      {/* B. System Architecture Flow Diagram */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#26352B] flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#245C3A]" /> End-to-End System Architecture
          </h2>
          <p className="text-xs text-[#536B5C]">
            Decoupled microservice architecture ensuring independent weather, soil, and model inference lifecycles
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-6 rounded-3xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Layer 1: Client */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#C5DAC0] text-center space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#EDF4E7] text-[#245C3A] flex items-center justify-center mx-auto">
                <Terminal className="w-4 h-4" />
              </div>
              <strong className="text-xs font-bold text-[#26352B] block">Farmer Client</strong>
              <p className="text-[11px] text-[#536B5C]">React + TypeScript + Vite + Tailwind CSS Dashboard</p>
            </div>

            {/* Layer 2: API Gateway */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#245C3A] text-center space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#245C3A] text-white flex items-center justify-center mx-auto">
                <Server className="w-4 h-4" />
              </div>
              <strong className="text-xs font-bold text-[#26352B] block">FastAPI Backend</strong>
              <p className="text-[11px] text-[#536B5C]">Pydantic validation, CORS, TTL caching, & pipeline routing</p>
            </div>

            {/* Layer 3: Services */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#BDD6E7] text-center space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#E8F1F7] text-[#3F86B5] flex items-center justify-center mx-auto">
                <CloudSun className="w-4 h-4" />
              </div>
              <strong className="text-xs font-bold text-[#26352B] block">External APIs & Data</strong>
              <p className="text-[11px] text-[#536B5C]">Open-Meteo Weather + ISRIC SoilGrids REST / Offline Rasters</p>
            </div>

            {/* Layer 4: ML Engines */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#C5DAC0] text-center space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#EDF4E7] text-[#245C3A] flex items-center justify-center mx-auto">
                <Cpu className="w-4 h-4" />
              </div>
              <strong className="text-xs font-bold text-[#26352B] block">Dual ML Pipelines</strong>
              <p className="text-[11px] text-[#536B5C]">Random Forest (200 trees) & XGBoost (300 trees)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E0EBD8] text-xs text-[#536B5C] leading-relaxed">
            <strong>Supplementary Context Path:</strong> Notice that soil data flows from ISRIC SoilGrids directly into the response payload for farmer advisory context, and is intentionally <strong>not routed through the 11-feature ML tensor</strong> to preserve model weight validity.
          </div>
        </div>
      </div>

      {/* C. Prediction Workflow Steps */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-[#26352B] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3E7C45]" /> Step-by-Step Prediction Workflow
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#245C3A]">
              <span className="w-5 h-5 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-[10px]">1</span>
              User Location & Dates Selection
            </div>
            <p className="text-[#536B5C] text-xs leading-relaxed">
              Farmer enters latitude/longitude, selects an Indian sugarcane belt preset, or uses location search / device GPS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#245C3A]">
              <span className="w-5 h-5 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-[10px]">2</span>
              Automated Climate Retrieval
            </div>
            <p className="text-[#536B5C] text-xs leading-relaxed">
              Backend fetches daily radiation, temp min/mean/max, humidity, precipitation, and wind speed from Open-Meteo Forecast or Archive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#245C3A]">
              <span className="w-5 h-5 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-[10px]">3</span>
              Date Harmonic Feature Engineering
            </div>
            <p className="text-[#536B5C] text-xs leading-relaxed">
              Calculates cyclical harmonic features sin(2π × DOY / 365.25) and cos(2π × DOY / 365.25) from the prediction date.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#245C3A]">
              <span className="w-5 h-5 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-[10px]">4</span>
              Exact Tensor Assembly & Inference
            </div>
            <p className="text-[#536B5C] text-xs leading-relaxed">
              Assembles the exact 11-column DataFrame and passes it through Random Forest and XGBoost Scikit-Learn pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* D. Explicit Scientific Limitations */}
      <div className="bg-white border-2 border-[#F0D58C] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-extrabold text-[#8C6200] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D99A2B]" /> Methodology Limitations & Scientific Scope
        </h2>
        <p className="text-xs text-[#5C450B] leading-relaxed">
          Academic integrity requires full transparency regarding modeling assumptions:
        </p>

        <div className="space-y-2.5 text-xs text-[#5C450B]">
          <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F0D58C]">
            <strong>1. Simulated Supervision Target:</strong> The target is calculated using Hargreaves–Samani ET0 physics rather than direct in-situ lysimeter or moisture sensor readings.
          </div>
          <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F0D58C]">
            <strong>2. Static Crop Coefficient (Kc = 1.20):</strong> Assumes a fixed peak coefficient rather than a full phenological FAO-56 curve transitioning from germination (0.40) to harvest.
          </div>
          <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F0D58C]">
            <strong>3. Empirical Effective Rainfall:</strong> Fixed empirical assumption of 80% rainfall infiltration capped at crop demand (P_eff ≤ ETc).
          </div>
          <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#F0D58C]">
            <strong>4. Exclusion of Soil Hydrology:</strong> Soil texture, infiltration rate, and field water-holding capacity do not yet alter the continuous regression output.
          </div>
        </div>
      </div>

      {/* E. Future Improvements Roadmap */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#26352B] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#78A85B]" /> Planned Future Research Roadmap
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#536B5C]">
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
            <strong className="text-[#245C3A] block mb-1">1. Dynamic Phenological Curves</strong>
            Incorporate sugarcane sowing date and growing degree days (GDD) to calculate dynamic Kc crop coefficients.
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
            <strong className="text-[#245C3A] block mb-1">2. Soil Hydrological Modeling</strong>
            Train future model iterations with SoilGrids available water capacity (AWC) and root-zone depth.
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
            <strong className="text-[#245C3A] block mb-1">3. Field Sensor Calibration</strong>
            Benchmark and calibrate regression predictions against ICAR (Indian Council of Agricultural Research) experimental stations.
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
            <strong className="text-[#245C3A] block mb-1">4. Irrigation Efficiency Modules</strong>
            Convert net mm/day deficits into gross pump hours based on flood, furrow, and precision drip system efficiencies.
          </div>
        </div>
      </div>
    </div>
  );
};
