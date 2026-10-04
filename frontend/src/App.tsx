import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { HistoryProvider } from './context/HistoryContext';
import { AppHeader } from './components/layout/AppHeader';
import { MobileNav } from './components/layout/MobileNav';

import { HomePage } from './pages/HomePage';
import { FarmWeatherPage } from './pages/FarmWeatherPage';
import { ModelLabPage } from './pages/ModelLabPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';

import { checkHealth } from './services/api';
import type { HealthStatus } from './types/api';

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  const loadHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      console.warn('Backend health check error:', err);
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <LanguageProvider>
      <HistoryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#F8F7EF] text-[#26352B] flex flex-col font-sans selection:bg-[#3E7C45] selection:text-white">
            {/* Header */}
            <AppHeader
              health={health}
              healthLoading={healthLoading}
              onRefreshHealth={loadHealth}
            />

            {/* Main Page Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/farm-weather" element={<FarmWeatherPage />} />
                <Route path="/model-lab" element={<ModelLabPage />} />
                <Route path="/methodology" element={<MethodologyPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Desktop / Global Footer */}
            <footer className="hidden lg:block border-t border-[#D8E4D0] py-6 text-center text-xs text-[#536B5C] bg-[#F8F7EF]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>
                  Sugarcane Irrigation Requirement Prediction System &bull; ML Decision Support for India
                </span>
                <span className="text-[11px] text-[#8B6848]">
                  Open-Meteo & OpenLandMap Integration &bull; FastAPI + React + Vite + Tailwind CSS
                </span>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </HistoryProvider>
    </LanguageProvider>
  );
}

export default App;
