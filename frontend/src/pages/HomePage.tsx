import React, { useState } from 'react';
import { FarmLocationForm } from '../components/farmer/FarmLocationForm';
import { WeatherSummary } from '../components/farmer/WeatherSummary';
import { IrrigationDeficitCard } from '../components/farmer/IrrigationDeficitCard';
import { SoilSummary } from '../components/farmer/SoilSummary';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import { useLanguage } from '../context/LanguageContext';
import { useHistory } from '../context/HistoryContext';
import { predictIrrigation, fetchWeather, fetchSoil } from '../services/api';
import type {
  FarmerPredictionRequest,
  PredictionResponse,
  WeatherData,
  SoilData,
} from '../types/api';
import { Droplets, Sprout, ArrowDown } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { addRecord } = useHistory();

  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [standaloneWeather, setStandaloneWeather] = useState<WeatherData | null>(null);
  const [standaloneSoil, setStandaloneSoil] = useState<SoilData | null>(null);

  const handlePredict = async (request: FarmerPredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictIrrigation(request);
      setPredictionData(result);
      addRecord(result);
      setStandaloneWeather(null);
      setStandaloneSoil(null);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate sugarcane irrigation estimate.');
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
      setError(err.message || 'Failed to retrieve weather parameters.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const displayWeather = predictionData?.weather || standaloneWeather;
  const displaySoil = predictionData?.soil || standaloneSoil;

  const scrollToForm = () => {
    const el = document.getElementById('prediction-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#245C3A] via-[#3E7C45] to-[#245C3A] text-white p-8 sm:p-12 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold backdrop-blur-xs">
            <Sprout className="w-3.5 h-3.5 text-[#A9DE83]" />
            <span>AI & Agricultural Meteorological Decision Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl font-normal">
            {t('heroSubtitle')}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F8F7EF] text-[#245C3A] font-extrabold text-sm shadow-md hover:bg-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Droplets className="w-4 h-4 text-[#3E7C45]" />
              {t('ctaEstimate')}
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </section>



      {/* Error Alert */}
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* Main Form & Results Grid */}
      <div id="prediction-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Farmer Input Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <FarmLocationForm
            onSubmit={handlePredict}
            onFetchWeatherOnly={handleFetchWeatherOnly}
            loading={loading}
            weatherLoading={weatherLoading}
          />
        </div>

        {/* Right Column: Prediction Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : predictionData ? (
            <>
              {/* 1. Main Dual Prediction Estimate Result Card */}
              <IrrigationDeficitCard
                predictions={predictionData.predictions}
                cropAgeDays={predictionData.crop_age_days}
                plantingDate={predictionData.planting_date}
                predictionDate={predictionData.prediction_date}
              />

              {/* 2. Automated Weather Summary */}
              <WeatherSummary weather={predictionData.weather} />

              {/* 3. Soil Context Summary */}
              <SoilSummary soil={predictionData.soil} />
            </>
          ) : displayWeather ? (
            <>
              <div className="p-4 rounded-2xl bg-[#EDF4E7] border border-[#C5DAC0] text-xs text-[#245C3A] font-bold">
                ✓ Weather parameters retrieved. Click <strong>"{t('calculateEstimate')}"</strong> to generate ML irrigation predictions.
              </div>
              <WeatherSummary weather={displayWeather} />
              {displaySoil && <SoilSummary soil={displaySoil} />}
            </>
          ) : (
            /* Welcoming Empty State */
            <div className="bg-white border border-dashed border-[#C5DAC0] rounded-3xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#EDF4E7] border border-[#C5DAC0] text-[#245C3A] flex items-center justify-center mx-auto shadow-xs">
                <Sprout className="w-8 h-8 text-[#3E7C45]" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#26352B]">
                  {t('readyForPrediction')}
                </h3>
                <p className="text-xs text-[#536B5C] leading-relaxed">
                  {t('readyPrompt')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
