import React from 'react';
import { Layers, Database, Info } from 'lucide-react';
import type { SoilData } from '../types/api';

interface SoilCardsProps {
  soil: SoilData;
}

export const SoilCards: React.FC<SoilCardsProps> = ({ soil }) => {
  const props = soil.properties || {};
  const hasProps = Object.keys(props).length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" /> Soil Physical & Chemical Properties
        </h3>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
            soil.available
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          {soil.source} ({soil.depth_interval})
        </span>
      </div>

      {/* Information Banner */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Environmental Context: </span>
          {soil.message} Soil attributes provide agronomic context and are <strong>not passed into the 11-feature model</strong> to preserve model weight compatibility.
        </div>
      </div>

      {/* Properties Grid */}
      {hasProps ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {Object.entries(props).map(([key, item]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate" title={item.name}>
                {item.name}
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {item.value} <span className="text-xs font-sans text-slate-400">{item.unit}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate" title={item.description}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-300">Live ISRIC SoilGrids data was unreachable for these exact coordinates.</p>
          <p className="text-[11px] text-slate-500">
            Offline GeoTIFF rasters can be placed in <code className="text-sky-300">data/soilgrids/</code>. Irrigation prediction continues normally using meteorological features.
          </p>
        </div>
      )}
    </div>
  );
};
