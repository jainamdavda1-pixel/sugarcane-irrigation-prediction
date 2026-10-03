import React from 'react';
import { Bot, Cpu, Clock, Sprout, TrendingUp } from 'lucide-react';
import type { ModelPredictions } from '../types/api';

interface PredictionCardsProps {
  predictions: ModelPredictions;
  cropAgeDays?: number;
  plantingDate?: string;
  predictionDate?: string;
}

function getSugarcaneStage(days?: number): { stage: string; desc: string } {
  if (days === undefined) return { stage: 'Unknown', desc: 'Planting date not set' };
  if (days < 0) return { stage: 'Future Sowing', desc: 'Planting date is ahead of prediction date' };
  if (days <= 35) return { stage: 'Germination Stage (0-35 d)', desc: 'Sprouting & initial root establishment' };
  if (days <= 100) return { stage: 'Tillering Stage (36-100 d)', desc: 'Shoot formation & vegetative growth' };
  if (days <= 270) return { stage: 'Grand Growth Stage (101-270 d)', desc: 'Peak water requirement & cane elongation' };
  if (days <= 365) return { stage: 'Ripening / Maturity (271-365 d)', desc: 'Sucrose accumulation; reduced water need' };
  return { stage: 'Ratoon / Harvest Ready (>365 d)', desc: 'Harvesting or subsequent ratoon cycle' };
}

function getDeficitLevel(mm: number): { label: string; bg: string; text: string } {
  if (mm <= 3.0) return { label: 'Low Deficit', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' };
  if (mm <= 8.0) return { label: 'Moderate Deficit', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' };
  if (mm <= 15.0) return { label: 'Substantial Deficit', bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-400' };
  return { label: 'High Deficit Demand', bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' };
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({
  predictions,
  cropAgeDays,
}) => {
  const rf = predictions.random_forest_prediction_mm_day;
  const xgb = predictions.xgboost_prediction_mm_day;
  const avg = (rf + xgb) / 2;
  const diff = Math.abs(rf - xgb);
  const stageInfo = getSugarcaneStage(cropAgeDays);

  const rfLevel = getDeficitLevel(rf);
  const xgbLevel = getDeficitLevel(xgb);

  return (
    <div className="space-y-4">
      {/* Top Banner: Crop Stage & Age */}
      {cropAgeDays !== undefined && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Crop Age: <strong className="text-white font-mono text-sm">{cropAgeDays} days</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-sky-300">{stageInfo.stage}</span>
            <span className="text-slate-500 hidden sm:inline">({stageInfo.desc})</span>
          </div>
        </div>
      )}

      {/* Dual Prediction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Random Forest Card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Random Forest Regressor</h3>
                <span className="text-[11px] text-slate-400">Ensemble of 200 Decision Trees</span>
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rfLevel.bg} ${rfLevel.text}`}>
              {rfLevel.label}
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
              {rf.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 font-sans">mm/day</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulated daily irrigation-deficit proxy estimate
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Pipeline: SimpleImputer (median)</span>
            <span className="text-emerald-400 font-mono font-medium">Scikit-Learn</span>
          </div>
        </div>

        {/* XGBoost Card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-2xl p-5 shadow-xl hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">XGBoost Regressor</h3>
                <span className="text-[11px] text-slate-400">Gradient Boosted Trees (300 est)</span>
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${xgbLevel.bg} ${xgbLevel.text}`}>
              {xgbLevel.label}
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
              {xgb.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 font-sans">mm/day</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulated daily irrigation-deficit proxy estimate
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Parameters: lr=0.05, max_depth=6</span>
            <span className="text-sky-400 font-mono font-medium">XGBoost API</span>
          </div>
        </div>
      </div>

      {/* Model Agreement Summary */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Model Consensus Mean: <strong className="text-white font-mono">{avg.toFixed(2)} mm/day</strong></span>
        </div>
        <div className="text-slate-400">
          Delta (|RF - XGB|): <span className="font-mono text-slate-200">{diff.toFixed(2)} mm/day</span>
        </div>
      </div>
    </div>
  );
};
