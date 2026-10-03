import React from 'react';
import { Layers, Database, Info } from 'lucide-react';
import type { SoilData } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

interface SoilSummaryProps {
  soil: SoilData;
}

export const SoilSummary: React.FC<SoilSummaryProps> = ({ soil }) => {
  const { t } = useLanguage();
  const props = soil.properties || {};
  const hasProps = soil.available && Object.keys(props).length > 0;

  return (
    <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#E8F0E4]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EDF4E7] text-[#245C3A]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26352B]">
              {t('soilTitle')}
            </h3>
            <p className="text-xs text-[#536B5C]">
              Depth Interval: <strong className="font-mono text-[#26352B]">{soil.depth_interval}</strong> &bull; Source: {soil.source}
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
            hasProps
              ? 'bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0]'
              : 'bg-[#F8F7EF] text-[#8B6848] border border-[#D8E4D0]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          {hasProps ? 'Data Available' : 'Supplementary Context'}
        </span>
      </div>

      {/* Information Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] text-xs text-[#536B5C] flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-[#3E7C45] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#26352B]">Agronomic Context Note: </span>
          {t('soilContextNote')}
        </div>
      </div>

      {/* Properties Grid */}
      {hasProps ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {Object.entries(props).map(([key, item]) => (
            <div
              key={key}
              className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] hover:border-[#C5DAC0] transition-colors"
            >
              <div className="text-[11px] font-bold text-[#536B5C] uppercase tracking-wider truncate" title={item.name}>
                {item.name}
              </div>
              <div className="text-xl font-extrabold font-mono text-[#245C3A] mt-1">
                {item.value} <span className="text-xs font-sans font-normal text-[#536B5C]">{item.unit}</span>
              </div>
              <div className="text-[10px] text-[#536B5C] mt-0.5 truncate" title={item.description}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#F8F7EF] border border-dashed border-[#D8E4D0] text-center text-xs text-[#536B5C] space-y-1.5">
          <p className="font-bold text-[#26352B]">Detailed soil information is currently unavailable for this location.</p>
          <p className="text-[11px] text-[#536B5C] max-w-lg mx-auto leading-relaxed">
            ISRIC SoilGrids REST servers were unreachable or offline raster tiles are not loaded in <code>data/soilgrids/</code>. The model prediction remains fully operational because soil parameters are not features in the current 11-feature model.
          </p>
        </div>
      )}
    </div>
  );
};
