import React from 'react';
import { Sprout, Activity, Server } from 'lucide-react';
import type { HealthStatus } from '../types/api';

interface NavbarProps {
  health: HealthStatus | null;
  healthLoading: boolean;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, healthLoading, onRefreshHealth }) => {
  const isHealthy = health && health.random_forest_loaded && health.xgboost_loaded;

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
          <Sprout className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Sugarcane Irrigation Deficit System
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              India
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            ML-driven irrigation deficit estimation with automated Open-Meteo & ISRIC SoilGrids
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        <button
          onClick={onRefreshHealth}
          disabled={healthLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer"
          style={{
            borderColor: isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            color: isHealthy ? '#6ee7b7' : '#fca5a5',
          }}
          title="Click to re-check API status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'
            }`}
          />
          <span className="flex items-center gap-1">
            {healthLoading ? (
              'Checking backend...'
            ) : isHealthy ? (
              <>
                <Server className="w-3.5 h-3.5" /> Models Loaded (RF + XGB)
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5" /> Backend Offline
              </>
            )}
          </span>
        </button>
      </div>
    </header>
  );
};
