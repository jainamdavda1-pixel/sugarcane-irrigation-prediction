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
import type { FarmerPredictionRequest, GeocodeItem } from '../../types/api';
import { searchLocations } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface FarmLocationFormProps {
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
  { name: 'Muzaffarnagar (UP)', fullName: 'Muzaffarnagar, Uttar Pradesh', lat: 29.4727, lon: 77.7085 },
];

export const FarmLocationForm: React.FC<FarmLocationFormProps> = ({
  onSubmit,
  onFetchWeatherOnly,
  loading,
  weatherLoading,
}) => {
  const { t } = useLanguage();

  const [latitude, setLatitude] = useState<string>('16.7050');
  const [longitude, setLongitude] = useState<string>('74.2433');
  const [locationName, setLocationName] = useState<string>('Kolhapur, Maharashtra');
  const [plantingDate, setPlantingDate] = useState<string>('');
  const [predictionDate, setPredictionDate] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeocodeItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPredictionDate(today);

    // Default planting date ~90 days ago (typical grand growth phase)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    setPlantingDate(ninetyDaysAgo.toISOString().split('T')[0]);
  }, []);

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

  const handleSelectPreset = (preset: (typeof REGION_PRESETS)[0]) => {
    setLatitude(preset.lat.toFixed(4));
    setLongitude(preset.lon.toFixed(4));
    setLocationName(preset.fullName);
    setSearchQuery(preset.fullName);
    setShowDropdown(false);
  };

  const handleSelectSearchResult = (item: GeocodeItem) => {
    setLatitude(item.latitude.toFixed(4));
    setLongitude(item.longitude.toFixed(4));
    const fullName = `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}`;
    setLocationName(fullName);
    setSearchQuery(fullName);
    setShowDropdown(false);
  };

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

    if (predictionDate && predictionDate < plantingDate) {
      alert('Prediction date cannot be earlier than planting date.');
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
    <div className="bg-white border border-[#D8E4D0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8F0E4]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EDF4E7] text-[#245C3A]">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#26352B]">
              {t('farmerInputs')}
            </h2>
            <p className="text-xs text-[#536B5C]">
              Specify your sugarcane farm coordinates & dates
            </p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#EDF4E7] text-[#245C3A] border border-[#C5DAC0] font-bold">
          {t('step1')}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#536B5C] uppercase tracking-wider block">
            {t('quickPresets')}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {REGION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EDF4E7] hover:bg-[#DDECD4] text-[#245C3A] border border-[#C5DAC0] transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location Search Input */}
        <div className="space-y-1.5" ref={searchContainerRef}>
          <label htmlFor="farm-location-search" className="text-xs font-bold text-[#26352B] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#536B5C]" /> {t('searchCity')}
          </label>
          <div className="relative">
            <input
              id="farm-location-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Kolhapur, Meerut, Mandya, Pune, Belagavi..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] placeholder-[#8A9E90] focus:outline-none focus:border-[#245C3A] focus:ring-1 focus:ring-[#245C3A] text-sm font-medium"
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 text-[#3E7C45] animate-spin" />
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#C5DAC0] rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-[#E8F0E4]">
                {searchResults.map((item) => (
                  <div
                    key={`${item.latitude}-${item.longitude}-${item.name}`}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3 hover:bg-[#EDF4E7] cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-bold text-[#26352B]">{item.name}</div>
                    <div className="text-xs text-[#536B5C]">
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
            <label htmlFor="farm-lat-input" className="text-xs font-bold text-[#26352B] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3E7C45]" /> {t('latitude')}
            </label>
            <input
              id="farm-lat-input"
              type="number"
              step="0.0001"
              min="-90"
              max="90"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 16.7050"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] focus:outline-none focus:border-[#245C3A] font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="farm-lon-input" className="text-xs font-bold text-[#26352B] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3F86B5]" /> {t('longitude')}
            </label>
            <input
              id="farm-lon-input"
              type="number"
              step="0.0001"
              min="-180"
              max="180"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 74.2433"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] focus:outline-none focus:border-[#3F86B5] font-mono text-sm"
            />
          </div>
        </div>

        {/* GPS Tool & Current selection info */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EDF4E7] border border-[#C5DAC0] text-xs">
          <button
            type="button"
            onClick={handleUseGPS}
            className="flex items-center gap-1.5 text-[#245C3A] hover:text-[#183E27] font-bold cursor-pointer"
          >
            <Crosshair className="w-4 h-4 text-[#3E7C45]" /> {t('useGps')}
          </button>
          <span className="text-[#536B5C] truncate max-w-[220px] font-semibold" title={locationName}>
            {locationName || 'Coordinates set'}
          </span>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="farm-planting-date-input" className="text-xs font-bold text-[#26352B] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#3E7C45]" /> {t('plantingDate')}
            </label>
            <input
              id="farm-planting-date-input"
              type="date"
              required
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] focus:outline-none focus:border-[#245C3A] text-sm font-medium"
            />
            <span className="text-[11px] text-[#536B5C] block">{t('plantingHint')}</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="farm-prediction-date-input" className="text-xs font-bold text-[#26352B] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#3F86B5]" /> {t('predictionDate')}
            </label>
            <input
              id="farm-prediction-date-input"
              type="date"
              value={predictionDate}
              onChange={(e) => setPredictionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#C5DAC0] text-[#26352B] focus:outline-none focus:border-[#3F86B5] text-sm font-medium"
            />
            <span className="text-[11px] text-[#536B5C] block">{t('predictionHint')}</span>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#245C3A] hover:bg-[#1C492E] text-white shadow-md shadow-[#245C3A]/20 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {t('fetching')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#78A85B]" /> {t('calculateEstimate')}
              </>
            )}
          </button>

          <button
            type="button"
            disabled={weatherLoading}
            onClick={handlePreviewWeather}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-xs bg-[#EDF4E7] hover:bg-[#DDECD4] text-[#245C3A] border border-[#C5DAC0] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {weatherLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudSun className="w-4 h-4 text-[#3F86B5]" />
            )}
            {t('fetchWeather')}
          </button>
        </div>
      </form>
    </div>
  );
};
