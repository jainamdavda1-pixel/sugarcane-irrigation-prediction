import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { FarmerInputForm } from '../components/FarmerInputForm';
import { PredictionCards } from '../components/PredictionCards';
import { ComparisonChart } from '../components/ComparisonChart';
import { WeatherCards } from '../components/WeatherCards';
import { SoilCards } from '../components/SoilCards';
import { ModelFeaturesTable } from '../components/ModelFeaturesTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

import type {
  FarmerPredictionRequest,
  HealthStatus,
  PredictionResponse,
  SoilData,
  WeatherData,
} from '../types/api';
import { checkHealth, fetchSoil, fetchWeather, predictIrrigation } from '../services/api';
import { Sprout } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [standaloneWeather, setStandaloneWeather] = useState<WeatherData | null>(null);
  const [standaloneSoil, setStandaloneSoil] = useState<SoilData | null>(null);

  const loadHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err: any) {
      console.warn('Backend health check error:', err);
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const handlePredict = async (request: FarmerPredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictIrrigation(request);
      setPredictionData(result);
      setStandaloneWeather(null);
      setStandaloneSoil(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate sugarcane irrigation prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchWeatherOnly = async (
    lat: number,
    lon: number,
    predDate?: string
  ) => {
    setWeatherLoading(true);
    setError(null);
    try {
      const [w, s] = await Promise.all([
        fetchWeather(lat, lon, predDate),
        fetchSoil(lat, lon),
      ]);
      setStandaloneWeather(w);
      setStandaloneSoil(s);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather or soil parameters.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const displayWeather = predictionData?.weather || standaloneWeather;
  const displaySoil = predictionData?.soil || standaloneSoil;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <Navbar
          health={health}
          healthLoading={healthLoading}
          onRefreshHealth={loadHealth}
        />



        {/* Error Alert */}
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Farmer Inputs (40% width on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <FarmerInputForm
              onSubmit={handlePredict}
              onFetchWeatherOnly={handleFetchWeatherOnly}
              loading={loading}
              weatherLoading={weatherLoading}
            />
          </div>

          {/* Right Column: Prediction Results & Analysis (60% width on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <LoadingSkeleton />
            ) : predictionData ? (
              <>
                {/* 1. Dual Prediction Summary Cards */}
                <PredictionCards
                  predictions={predictionData.predictions}
                  cropAgeDays={predictionData.crop_age_days}
                  plantingDate={predictionData.planting_date}
                  predictionDate={predictionData.prediction_date}
                />

                {/* 2. Visual Comparison Chart */}
                <ComparisonChart predictions={predictionData.predictions} />

                {/* 3. Live Weather Metrics */}
                <WeatherCards
                  weather={predictionData.weather}
                  features={predictionData.features_used}
                />

                {/* 4. Soil Properties Card */}
                <SoilCards soil={predictionData.soil} />

                {/* 5. 11 Features Inspection Table */}
                <ModelFeaturesTable features={predictionData.features_used} />
              </>
            ) : displayWeather && displaySoil ? (
              <>
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs flex items-center justify-between">
                  <span>Weather & Soil retrieved. Click <strong>"Predict Irrigation Deficit"</strong> to run ML inference.</span>
                </div>
                <WeatherCards weather={displayWeather} />
                <SoilCards soil={displaySoil} />
              </>
            ) : (
              /* Empty state guide */
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <Sprout className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-base font-bold text-white">Ready for Prediction</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select a sugarcane region or search a district on the left, then click{' '}
                    <span className="text-emerald-400 font-semibold">"Predict Irrigation Deficit"</span>.
                    The backend will automatically pull live Open-Meteo weather parameters, OpenLandMap mapped soil context, and run the Random Forest and XGBoost regression models.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-900">
          Sugarcane Irrigation Requirement Prediction System &bull; Open-Meteo Forecast & Archive APIs &bull; OpenLandMap &bull; FastAPI + React + Vite + Tailwind CSS
        </footer>
      </div>
    </div>
  );
};
