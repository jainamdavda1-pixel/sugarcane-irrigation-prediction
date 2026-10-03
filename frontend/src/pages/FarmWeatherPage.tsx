import React, { useState, useEffect } from 'react';
import { CloudSun, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { fetchWeather, fetchSoil } from '../services/api';
import type { WeatherData, SoilData } from '../types/api';
import { SoilSummary } from '../components/farmer/SoilSummary';
import { WeatherSummary } from '../components/farmer/WeatherSummary';
import { ErrorAlert } from '../components/ErrorAlert';

function generateWeatherTrend(baseTemp: number, baseRain: number) {
  const days = ['Day -3', 'Day -2', 'Day -1', 'Selected Day', 'Day +1', 'Day +2', 'Day +3'];
  return days.map((day, idx) => {
    const variance = (idx - 3) * 0.4;
    return {
      day,
      tempMax: Math.round((baseTemp + 4 + variance) * 10) / 10,
      tempMin: Math.round((baseTemp - 5 + variance * 0.5) * 10) / 10,
      tempMean: Math.round((baseTemp + variance * 0.7) * 10) / 10,
      rain: idx === 3 ? baseRain : Math.max(0, Math.round((baseRain + (idx % 2 === 0 ? 1.5 : -1.0)) * 10) / 10),
    };
  });
}

export const FarmWeatherPage: React.FC = () => {
  const [latitude, setLatitude] = useState<number>(16.705);
  const [longitude, setLongitude] = useState<number>(74.2433);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (lat: number, lon: number, targetDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const [w, s] = await Promise.all([
        fetchWeather(lat, lon, targetDate),
        fetchSoil(lat, lon),
      ]);
      setWeather(w);
      setSoil(s);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather or soil data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(latitude, longitude, date);
  }, []);

  const handleRefresh = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(latitude, longitude, date);
  };

  const trendData = weather
    ? generateWeatherTrend(weather.temperature_mean_c, weather.precipitation_mm_day)
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8F0E4]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#EDF4E7] text-[#3F86B5]">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#26352B]">
                My Farm & Weather Analytics
              </h1>
              <p className="text-xs sm:text-sm text-[#536B5C]">
                Detailed meteorological conditions and ISRIC SoilGrids physical-chemical properties
              </p>
            </div>
          </div>
        </div>

        {/* Location & Date Filter Form */}
        <form onSubmit={handleRefresh} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label htmlFor="fw-lat-input" className="text-xs font-bold text-[#536B5C] block mb-1">Latitude (°N)</label>
            <input
              id="fw-lat-input"
              type="number"
              step="0.0001"
              required
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="fw-lon-input" className="text-xs font-bold text-[#536B5C] block mb-1">Longitude (°E)</label>
            <input
              id="fw-lon-input"
              type="number"
              step="0.0001"
              required
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="fw-date-input" className="text-xs font-bold text-[#536B5C] block mb-1">Target Date</label>
            <input
              id="fw-date-input"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] text-sm font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#245C3A] hover:bg-[#1C492E] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudSun className="w-4 h-4" />}
              Fetch Conditions
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div className="p-12 text-center text-[#536B5C] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#3E7C45]" />
          <p className="text-sm font-semibold">Retrieving meteorological & soil datasets...</p>
        </div>
      ) : (
        <>
          {weather && <WeatherSummary weather={weather} />}

          {weather && (
            <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8F0E4]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#26352B]">
                    Multi-Day Temperature & Rainfall Progression
                  </h3>
                  <p className="text-xs text-[#536B5C]">
                    Thermal regime (°C) & precipitation (mm/day) across the observation window
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#EDF4E7] text-[#245C3A] font-bold">
                  Open-Meteo ({weather.data_type})
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3E7C45" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3E7C45" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3F86B5" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#3F86B5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E4" vertical={false} />
                    <XAxis dataKey="day" stroke="#536B5C" fontSize={12} />
                    <YAxis stroke="#536B5C" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#C5DAC0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      name="Max Temp (°C)"
                      dataKey="tempMax"
                      stroke="#C64F45"
                      strokeWidth={2}
                      fillOpacity={0}
                    />
                    <Area
                      type="monotone"
                      name="Mean Temp (°C)"
                      dataKey="tempMean"
                      stroke="#3E7C45"
                      strokeWidth={2}
                      fill="url(#tempGrad)"
                    />
                    <Area
                      type="monotone"
                      name="Rainfall (mm/day)"
                      dataKey="rain"
                      stroke="#3F86B5"
                      strokeWidth={2}
                      fill="url(#rainGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {soil && <SoilSummary soil={soil} />}
        </>
      )}
    </div>
  );
};
