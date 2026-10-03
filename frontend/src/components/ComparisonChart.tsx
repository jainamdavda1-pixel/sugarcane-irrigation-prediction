import React from 'react';
import { BarChart3, Layers } from 'lucide-react';
import type { ModelPredictions } from '../types/api';

interface ComparisonChartProps {
  predictions: ModelPredictions;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ predictions }) => {
  const rf = predictions.random_forest_prediction_mm_day;
  const xgb = predictions.xgboost_prediction_mm_day;
  const avg = (rf + xgb) / 2;

  // Max scale calculation for bars (minimum max of 16 mm/day)
  const maxVal = Math.max(16, rf * 1.2, xgb * 1.2);

  const rfPercent = Math.min(100, Math.max(5, (rf / maxVal) * 100));
  const xgbPercent = Math.min(100, Math.max(5, (xgb / maxVal) * 100));
  const avgPercent = Math.min(100, Math.max(5, (avg / maxVal) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" /> Model Estimate Comparison & Reference Scale
        </h3>
        <span className="text-xs text-slate-400 font-mono">Max Scale: {maxVal.toFixed(0)} mm/day</span>
      </div>

      {/* Visual Bars Container */}
      <div className="space-y-4 pt-2">
        {/* Random Forest Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Random Forest
            </span>
            <span className="font-mono text-white">{rf.toFixed(2)} mm/day</span>
          </div>
          <div className="w-full h-7 bg-slate-950 rounded-lg overflow-hidden p-1 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
              style={{ width: `${rfPercent}%` }}
            >
              {rfPercent > 20 && (
                <span className="text-[10px] font-bold text-slate-950 font-mono">
                  {rf.toFixed(1)} mm
                </span>
              )}
            </div>
          </div>
        </div>

        {/* XGBoost Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-sky-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" /> XGBoost Regressor
            </span>
            <span className="font-mono text-white">{xgb.toFixed(2)} mm/day</span>
          </div>
          <div className="w-full h-7 bg-slate-950 rounded-lg overflow-hidden p-1 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
              style={{ width: `${xgbPercent}%` }}
            >
              {xgbPercent > 20 && (
                <span className="text-[10px] font-bold text-slate-950 font-mono">
                  {xgb.toFixed(1)} mm
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Average Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" /> Ensemble Average
            </span>
            <span className="font-mono text-white">{avg.toFixed(2)} mm/day</span>
          </div>
          <div className="w-full h-5 bg-slate-950 rounded-lg overflow-hidden p-0.5 border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded transition-all duration-700 ease-out"
              style={{ width: `${avgPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contextual Reference Scale */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-xs">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" /> Agronomic Deficit Guidelines for Sugarcane (Simulated Context)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="block font-bold text-emerald-400">&lt; 4.0 mm/day</span>
            <span className="text-[11px]">Low deficit (Rainfall / humid seasons / early crop)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="block font-bold text-amber-400">4.0 - 10.0 mm/day</span>
            <span className="text-[11px]">Normal deficit (Standard vegetative tillering)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="block font-bold text-red-400">&gt; 10.0 mm/day</span>
            <span className="text-[11px]">Intense deficit (Summer peak grand growth & high solar radiation)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
