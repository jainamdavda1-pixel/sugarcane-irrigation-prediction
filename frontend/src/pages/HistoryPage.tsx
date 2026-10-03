import React from 'react';
import { History, Trash2, MapPin, Calendar, ArrowUpRight, Info } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { history, clearHistory, removeRecord } = useHistory();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8F0E4]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#EDF4E7] text-[#8B6848]">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
                Recent Prediction History (Browser Local)
              </h1>
              <p className="text-xs sm:text-sm text-[#536B5C]">
                Saved locally in your web browser session &bull; {history.length} records stored
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#C64F45] bg-[#FDF2F1] hover:bg-[#FBE4E2] border border-[#F5C2BE] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear All History
            </button>
          )}
        </div>

        {/* Local Storage Clarification */}
        <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#D8E4D0] text-xs text-[#536B5C] flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-[#78A85B] shrink-0 mt-0.5" />
          <span>
            <strong>Storage Transparency:</strong> This prediction log is kept in your device's browser memory (localStorage) for quick reference. It is not synced to an external cloud database or server.
          </span>
        </div>
      </div>

      {/* History Records List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#D8E4D0] rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#C5DAC0] transition-colors space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8F0E4]">
                <div className="flex items-center gap-2 text-xs text-[#26352B] font-bold">
                  <MapPin className="w-4 h-4 text-[#3E7C45]" />
                  <span>{item.location.name || `${item.location.latitude}°N, ${item.location.longitude}°E`}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#536B5C]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.predictionDate}
                  </span>
                  <span className="text-[11px] font-mono text-[#8B6848]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRecord(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove this record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
                  <span className="text-[11px] font-bold text-[#536B5C] block">Random Forest</span>
                  <strong className="text-lg font-mono text-[#245C3A] block mt-0.5">
                    {item.predictions.random_forest_prediction_mm_day.toFixed(2)} mm/day
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
                  <span className="text-[11px] font-bold text-[#536B5C] block">XGBoost</span>
                  <strong className="text-lg font-mono text-[#3F86B5] block mt-0.5">
                    {item.predictions.xgboost_prediction_mm_day.toFixed(2)} mm/day
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
                  <span className="text-[11px] font-bold text-[#536B5C] block">Weather Snapshot</span>
                  <span className="text-xs font-semibold text-[#26352B] block mt-0.5">
                    {item.weather.temperature_mean_c}°C &bull; {item.weather.relative_humidity_percent}% RH
                  </span>
                  <span className="text-[10px] text-[#536B5C]">{item.weather.precipitation_mm_day} mm rain</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0EBD8]">
                  <span className="text-[11px] font-bold text-[#536B5C] block">Soil Status</span>
                  <span className="text-xs font-semibold text-[#26352B] block mt-0.5">
                    {item.soil.available ? 'Soil Context Available' : 'Soil Unavailable'}
                  </span>
                  <span className="text-[10px] text-[#536B5C]">{item.soil.depth_interval}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#C5DAC0] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF4E7] text-[#8B6848] flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-[#26352B]">No History Saved Yet</h3>
            <p className="text-xs text-[#536B5C] leading-relaxed">
              When you generate irrigation predictions on the Home Assistant page, your recent estimates and weather snapshots will appear here in your browser.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C3A] text-white text-xs font-bold hover:bg-[#1C492E] transition-colors"
              >
                Go to Assistant <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
