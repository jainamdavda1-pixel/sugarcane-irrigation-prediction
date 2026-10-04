import React from 'react';
import { Layers, Database, Info } from 'lucide-react';
import type { SoilData } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

interface SoilSummaryProps {
  soil: SoilData;
}

export const SoilSummary: React.FC<SoilSummaryProps> = ({ soil }) => {
  const { t } = useLanguage();
  const rawProps = soil.properties || {};
  const isAvailable = soil.available || soil.status === 'available' || soil.status === 'partial';

  // Filter non-null properties
  const validProps = Object.entries(rawProps).filter(([_, item]) => item && item.value !== undefined && item.value !== null);
  const hasProps = isAvailable && validProps.length > 0;

  const formatKeyName = (key: string, item: any): string => {
    if (item.name) return item.name;
    const names: Record<string, string> = {
      soil_ph: 'Soil pH',
      soil_organic_carbon: 'Organic Carbon',
      clay_content: 'Clay Content',
      phh2o: 'Soil pH (H₂O)',
      clay: 'Clay Fraction',
      sand: 'Sand Fraction',
      silt: 'Silt Fraction',
      soc: 'Soil Organic Carbon',
      bdod: 'Bulk Density',
      cec: 'Cation Exchange Capacity',
    };
    return names[key] || key.replace(/_/g, ' ').toUpperCase();
  };

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
              Depth Interval: <strong className="font-mono text-[#26352B]">{soil.depth_interval || '0-30cm (surface)'}</strong> &bull; Source: {soil.source}
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
          {soil.notice || t('soilContextNote')}
        </div>
      </div>

      {/* Properties Grid */}
      {hasProps ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {validProps.map(([key, item]) => (
            <div
              key={key}
              className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8] hover:border-[#C5DAC0] transition-colors"
            >
              <div className="text-[11px] font-bold text-[#536B5C] uppercase tracking-wider truncate" title={formatKeyName(key, item)}>
                {formatKeyName(key, item)}
              </div>
              <div className="text-xl font-extrabold font-mono text-[#245C3A] mt-1">
                {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}{' '}
                <span className="text-xs font-sans font-normal text-[#536B5C]">{item.unit}</span>
              </div>
              <div className="text-[10px] text-[#536B5C] mt-0.5 truncate" title={item.depth || item.depth_label || 'surface'}>
                {item.depth || item.depth_label || item.description || 'surface layer'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#F8F7EF] border border-dashed border-[#D8E4D0] text-center text-xs text-[#536B5C] space-y-1.5">
          <p className="font-bold text-[#26352B]">Supplementary soil raster tiles are not currently loaded.</p>
          <p className="text-[11px] text-[#536B5C] max-w-lg mx-auto leading-relaxed">
            Local GeoTIFF files can be placed in <code>data/openlandmap/</code> (e.g. <code>soil_ph_surface.tif</code>, <code>soil_carbon_surface.tif</code>, <code>soil_clay_surface.tif</code>). The model prediction remains fully operational because soil parameters are supplementary context and not inputs to the current 11-feature model.
          </p>
        </div>
      )}
    </div>
  );
};
