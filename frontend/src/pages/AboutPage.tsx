import React from 'react';
import { Info, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8F0E4]">
          <div className="p-3 rounded-2xl bg-[#EDF4E7] text-[#245C3A]">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
              About the Sugarcane Irrigation Project
            </h1>
            <p className="text-xs sm:text-sm text-[#536B5C]">
              College Project: ML-Based Sugarcane Irrigation Requirement Prediction System for India
            </p>
          </div>
        </div>

        <div className="prose text-xs sm:text-sm text-[#536B5C] leading-relaxed space-y-3">
          <p>
            Sugarcane (<em>Saccharum officinarum</em>) is one of India's most water-intensive commercial cash crops, requiring between 1,500 mm to 2,500 mm of water throughout its 10 to 14 month cultivation cycle. In key cane-producing states such as Maharashtra, Uttar Pradesh, Karnataka, Tamil Nadu, Andhra Pradesh, and Gujarat, efficient water management is vital for sustainable groundwater utilization and farm profitability.
          </p>
          <p>
            This software system demonstrates a modern machine learning pipeline where complex atmospheric evapotranspiration physics and tabular regression algorithms (Random Forest and XGBoost) are combined with live Open-Meteo weather APIs and ISRIC SoilGrids datasets, delivering instant decision-support to farmers without manual data entry.
          </p>
        </div>
      </div>

      {/* Citations & Data Sources */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#26352B] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#3F86B5]" /> Data Sources & Academic Citations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2">
            <strong className="text-[#26352B] block text-sm">Open-Meteo Weather APIs</strong>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              Open-source weather API providing global high-resolution forecasts, historical reanalysis (ERA5), and geocoding services.
            </p>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#245C3A] font-bold text-[11px] hover:underline"
            >
              open-meteo.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2">
            <strong className="text-[#26352B] block text-sm">ISRIC SoilGrids 2.0</strong>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              Global system for digital soil mapping using automated machine learning to map soil properties at 250m resolution.
            </p>
            <a
              href="https://www.isric.org/explore/soilgrids"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#245C3A] font-bold text-[11px] hover:underline"
            >
              isric.org/soilgrids <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] space-y-2">
            <strong className="text-[#26352B] block text-sm">NASA POWER Agroclimatology</strong>
            <p className="text-[#536B5C] text-[11px] leading-relaxed">
              Prediction of Worldwide Energy Resources providing solar and meteorological datasets for agricultural modeling.
            </p>
            <a
              href="https://power.larc.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#245C3A] font-bold text-[11px] hover:underline"
            >
              power.larc.nasa.gov <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Academic Prototype Disclaimer */}
      <div className="bg-[#FFF9E6] border border-[#F0D58C] rounded-3xl p-6 text-xs text-[#5C450B] space-y-2">
        <strong className="text-[#8C6200] block text-sm font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D99A2B]" /> Educational & Academic Disclaimer
        </strong>
        <p className="leading-relaxed text-[12px]">
          This software is developed strictly as an academic research and engineering demonstration prototype. The simulated daily deficit estimates have not been subjected to controlled field trials across all Indian soil sub-types. Farmers and agricultural consultants should always cross-reference predictions with on-field soil moisture measurements and regional university agricultural extension advisories.
        </p>
      </div>
    </div>
  );
};
