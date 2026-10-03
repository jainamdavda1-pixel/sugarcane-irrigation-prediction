import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  Menu,
  X,
  RefreshCw,
  Droplets,
  CloudSun,
  BrainCircuit,
  FileText,
  History,
  Info,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { HealthStatus } from '../../types/api';

interface AppHeaderProps {
  health: HealthStatus | null;
  healthLoading: boolean;
  onRefreshHealth: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  health,
  healthLoading,
  onRefreshHealth,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHealthy = Boolean(health && health.random_forest_loaded && health.xgboost_loaded);

  const navLinks = [
    { to: '/', label: t('navHome'), icon: Droplets },
    { to: '/farm-weather', label: t('navFarmWeather'), icon: CloudSun },
    { to: '/model-lab', label: t('navModelLab'), icon: BrainCircuit },
    { to: '/methodology', label: t('navMethodology'), icon: FileText },
    { to: '/history', label: t('navHistory'), icon: History },
    { to: '/about', label: t('navAbout'), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7EF]/90 backdrop-blur-md border-b border-[#D8E4D0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group no-underline shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#245C3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1E4D30] transition-colors">
              <Sprout className="w-5 h-5 text-[#88C67B]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#26352B] tracking-tight group-hover:text-[#245C3A] transition-colors">
                Sugarcane<span className="text-[#3E7C45]">ML</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0]">
                India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean & Uncluttered) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#245C3A] text-white shadow-xs'
                      : 'text-[#4A5D50] hover:text-[#245C3A] hover:bg-[#EDF4E7]/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utilities: Language Selector + Subtle Health Badge + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Minimal Language Toggle */}
            <div className="flex items-center bg-[#EDF4E7] border border-[#C5DAC0] rounded-lg p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#245C3A] text-white shadow-2xs'
                    : 'text-[#536B5C] hover:text-[#26352B]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#245C3A] text-white shadow-2xs'
                    : 'text-[#536B5C] hover:text-[#26352B]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Compact Status Indicator */}
            <button
              type="button"
              onClick={onRefreshHealth}
              disabled={healthLoading}
              title={
                isHealthy
                  ? 'ML Backend & Models Loaded (Random Forest + XGBoost). Click to refresh.'
                  : 'Backend offline or models not loaded. Click to retry.'
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#EDF4E7] border border-[#C5DAC0] hover:bg-[#E2ECD9] transition-all cursor-pointer text-[#26352B]"
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  healthLoading
                    ? 'bg-[#E39D36] animate-pulse'
                    : isHealthy
                    ? 'bg-[#3E7C45] ring-2 ring-[#3E7C45]/20'
                    : 'bg-[#C64F45]'
                }`}
              />
              <span className="hidden sm:inline-block text-[11px] font-medium text-[#4A5D50]">
                {healthLoading ? 'Checking' : isHealthy ? 'ML Online' : 'Offline'}
              </span>
              <RefreshCw
                className={`w-3 h-3 text-[#536B5C] opacity-60 ${
                  healthLoading ? 'animate-spin opacity-100 text-[#3E7C45]' : ''
                }`}
              />
            </button>

            {/* Mobile menu hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-[#EDF4E7] border border-[#C5DAC0] text-[#26352B] hover:bg-[#E2ECD9] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#D8E4D0]/80 space-y-1 bg-[#F8F7EF]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#245C3A] text-white shadow-xs'
                      : 'text-[#26352B] hover:bg-[#EDF4E7]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#88C67B]' : 'text-[#536B5C]'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
