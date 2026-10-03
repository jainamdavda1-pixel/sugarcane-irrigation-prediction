import React from 'react';
import { Database, MapPin, Layers, FileSpreadsheet, Split, Info } from 'lucide-react';

export const DatasetStatistics: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#D8E4D0]">
        <div>
          <h3 className="text-lg font-bold text-[#26352B]">
            Dataset Overview & Spatial Split
          </h3>
          <p className="text-xs text-[#536B5C]">
            NASA POWER meteorological records structured for location-generalization benchmarking
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Database className="w-4 h-4 text-[#3E7C45]" /> Total Daily Rows
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#245C3A]">
            71,214
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Daily meteorological timesteps</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <MapPin className="w-4 h-4 text-[#3F86B5]" /> Candidate Locations
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#26352B]">
            39
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Sugarcane growing districts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <FileSpreadsheet className="w-4 h-4 text-[#8B6848]" /> Total Columns
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#26352B]">
            48 <span className="text-xs font-normal text-[#536B5C]">(11 trained)</span>
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Weather & computed proxies</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8E4D0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#536B5C] mb-1">
            <Layers className="w-4 h-4 text-[#D99A2B]" /> Primary Source
          </div>
          <div className="text-lg font-extrabold font-sans text-[#26352B] mt-1">
            NASA POWER
          </div>
          <div className="text-[11px] text-[#536B5C] mt-0.5">Global solar & climate data</div>
        </div>
      </div>

      {/* Spatial Location-Based Split Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#C5DAC0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#245C3A] uppercase tracking-wider flex items-center gap-1.5">
              <Split className="w-4 h-4" /> Training Split (Location-Based)
            </span>
            <span className="text-xs font-mono font-bold text-[#245C3A] bg-[#EDF4E7] px-2.5 py-0.5 rounded-full">
              79.5% of records
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#26352B]">
            56,606 <span className="text-xs font-normal text-[#536B5C]">daily rows</span>
          </div>
          <p className="text-xs text-[#536B5C] leading-relaxed">
            Spanning <strong>31 distinct training locations</strong> across major sugarcane agricultural zones in Maharashtra, Uttar Pradesh, Karnataka, Tamil Nadu, Andhra Pradesh, and Gujarat.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#BDD6E7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3F86B5] uppercase tracking-wider flex items-center gap-1.5">
              <Split className="w-4 h-4" /> Held-Out Test Split
            </span>
            <span className="text-xs font-mono font-bold text-[#3F86B5] bg-[#E8F1F7] px-2.5 py-0.5 rounded-full">
              20.5% of records
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#26352B]">
            14,608 <span className="text-xs font-normal text-[#536B5C]">daily rows</span>
          </div>
          <p className="text-xs text-[#536B5C] leading-relaxed">
            Spanning <strong>8 strictly held-out test locations</strong> never seen during model training, designed to evaluate spatial out-of-sample generalization across unseen Indian microclimates.
          </p>
        </div>
      </div>

      {/* Critical Scientific Note */}
      <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#F0D58C] text-xs text-[#5C450B] flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-[#D99A2B] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#8C6200] block mb-0.5">Critical Dataset Context:</strong>
          These 71,214 records represent daily weather observations for candidate agricultural coordinates, <strong>not 71,214 physical agronomic field experiments</strong>. The dataset does not establish that sugarcane was physically planted or harvested at every coordinate on every single recorded day.
        </div>
      </div>
    </div>
  );
};
