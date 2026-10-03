import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="h-5 w-48 bg-slate-800 rounded-md" />
        <div className="h-5 w-24 bg-slate-800 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-36 bg-slate-950 rounded-2xl border border-slate-800/80 p-4 space-y-3">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-8 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-40 bg-slate-800 rounded" />
        </div>
        <div className="h-36 bg-slate-950 rounded-2xl border border-slate-800/80 p-4 space-y-3">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-8 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-40 bg-slate-800 rounded" />
        </div>
      </div>

      <div className="h-40 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-center gap-3 text-slate-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Contacting Open-Meteo & SoilGrids & generating inference...</span>
      </div>
    </div>
  );
};
