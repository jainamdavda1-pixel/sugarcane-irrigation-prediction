import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Search,
  Crosshair,
  Sparkles,
  CloudSun,
  Loader2,
  Navigation,
} from 'lucide-react';
import type { FarmerPredictionRequest, GeocodeItem } from '../types/api';
import { searchLocations } from '../services/api';

interface FarmerInputFormProps {
  onSubmit: (request: FarmerPredictionRequest) => void;
  onFetchWeatherOnly: (latitude: number, longitude: number, predictionDate?: string) => void;
  loading: boolean;
  weatherLoading: boolean;
}

const REGION_PRESETS = [
  { name: 'Kolhapur (MH)', fullName: 'Kolhapur, Maharashtra', lat: 16.705, lon: 74.2433 },
  { name: 'Meerut (UP)', fullName: 'Meerut, Uttar Pradesh', lat: 28.9845, lon: 77.7064 },
  { name: 'Belagavi (KA)', fullName: 'Belagavi, Karnataka', lat: 15.8497, lon: 74.4977 },
  { name: 'Coimbatore (TN)', fullName: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558 },
  { name: 'Vijayawada (AP)', fullName: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lon: 80.648 },
  { name: 'Surat (GJ)', fullName: 'Surat, Gujarat', lat: 21.1702, lon: 72.8311 },
];

export const FarmerInputForm: React.FC<FarmerInputFormProps> = ({
  onSubmit,
  onFetchWeatherOnly,
  loading,
  weatherLoading,
}) => {
  // Form State
  const [latitude, setLatitude] = useState<string>('16.7050');
  const [longitude, setLongitude] = useState<string>('74.2433');
  const [locationName, setLocationName] = useState<string>('Kolhapur, Maharashtra');
  const [plantingDate, setPlantingDate] = useState<string>('');
  const [predictionDate, setPredictionDate] = useState<string>('');

  // Location search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeocodeItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Set default dates on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPredictionDate(today);

    // Default planting date ~90 days ago (typical grand growth phase)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    setPlantingDate(ninetyDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Handle Search input debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchLocations(searchQuery);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          console.error('Location search error:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply preset
  const handleSelectPreset = (preset: (typeof REGION_PRESETS)[0]) => {
    setLatitude(preset.lat.toFixed(4));
    setLongitude(preset.lon.toFixed(4));
    setLocationName(preset.fullName);
    setSearchQuery(preset.fullName);
    setShowDropdown(false);
  };

  // Apply search selection
  const handleSelectSearchResult = (item: GeocodeItem) => {
    setLatitude(item.latitude.toFixed(4));
    setLongitude(item.longitude.toFixed(4));
    const fullName = `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}`;
    setLocationName(fullName);
    setSearchQuery(fullName);
    setShowDropdown(false);
  };

  // Device GPS
  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          setLocationName('GPS Device Location');
        },
        () => {
          alert('Could not retrieve device location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      alert('Please enter valid numerical latitude and longitude coordinates.');
      return;
    }

    if (!plantingDate) {
      alert('Please select the sugarcane planting date.');
      return;
    }

    onSubmit({
      latitude: lat,
      longitude: lon,
      planting_date: plantingDate,
      prediction_date: predictionDate || undefined,
      location_name: locationName || undefined,
    });
  };

  const handlePreviewWeather = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      onFetchWeatherOnly(lat, lon, predictionDate || undefined);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400" /> Farmer Inputs
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
          Step 1
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Quick Sugarcane Belts (India)
          </label>
          <div className="flex flex-wrap gap-2">
            {REGION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 border border-slate-700 hover:border-sky-400 transition-all duration-150 cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location Search Input */}
        <div className="space-y-2" ref={searchContainerRef}>
          <label htmlFor="location-search" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" /> Search City or District
          </label>
          <div className="relative">
            <input
              id="location-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Kolhapur, Meerut, Mandya, Pune..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-800">
                {searchResults.map((item) => (
                  <div
                    key={`${item.latitude}-${item.longitude}-${item.name}`}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-slate-400">
                      {item.admin2 ? item.admin2 + ', ' : ''}
                      {item.admin1 ? item.admin1 + ' ' : ''}
                      ({item.country || 'India'}) • {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coordinates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="latitude-input" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Latitude (°N)
            </label>
            <input
              id="latitude-input"
              type="number"
              step="0.0001"
              min="-90"
              max="90"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 16.7050"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="longitude-input" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Longitude (°E)
            </label>
            <input
              id="longitude-input"
              type="number"
              step="0.0001"
              min="-180"
              max="180"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 74.2433"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* GPS Tool & Location pill */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
          <button
            type="button"
            onClick={handleUseGPS}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" /> Use Device GPS
          </button>
          <span className="text-slate-400 truncate max-w-[200px]" title={locationName}>
            {locationName || 'Coordinates set'}
          </span>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="planting-date-input" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Planting Date
            </label>
            <input
              id="planting-date-input"
              type="date"
              required
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
            />
            <span className="text-[11px] text-slate-500">When crop was sown/planted</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prediction-date-input" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> Prediction Date
            </label>
            <input
              id="prediction-date-input"
              type="date"
              value={predictionDate}
              onChange={(e) => setPredictionDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 text-sm"
            />
            <span className="text-[11px] text-slate-500">Defaults to today</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-900/30 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching & Inferring...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Predict Irrigation Deficit
              </>
            )}
          </button>

          <button
            type="button"
            disabled={weatherLoading}
            onClick={handlePreviewWeather}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {weatherLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudSun className="w-4 h-4 text-sky-400" />
            )}
            Fetch Weather
          </button>
        </div>
      </form>
    </div>
  );
};
