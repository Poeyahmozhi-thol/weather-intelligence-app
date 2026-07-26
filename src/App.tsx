import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CloudSun } from 'lucide-react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { TemperatureChart } from './components/TemperatureChart';
import { SmartAdviceCard } from './components/SmartAdviceCard';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { WeatherData, TemperatureUnit, SmartRecommendation } from './types';
import { fetchWeatherForCity, fetchWeatherByCoords } from './services/weatherApi';
import { generateSmartRecommendations } from './utils/weatherUtils';

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [currentCityName, setCurrentCityName] = useState<string>('Chennai');

  const loadWeather = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentCityName(city);

    try {
      const data = await fetchWeatherForCity(city);
      setWeatherData(data);
      const recs = generateSmartRecommendations(data.current_weather, data.daily);
      setRecommendations(recs);
      setSelectedDayIndex(0);
    } catch (err: any) {
      console.error('Error loading weather:', err);
      setError(err.message || `City "${city}" not found. Please try another location.`);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWeatherByCoords = useCallback(
    async (lat: number, lon: number, cityName: string, country?: string, admin1?: string) => {
      setIsLoading(true);
      setError(null);
      setCurrentCityName(cityName);

      try {
        const data = await fetchWeatherByCoords(lat, lon, cityName, country, admin1);
        setWeatherData(data);
        const recs = generateSmartRecommendations(data.current_weather, data.daily);
        setRecommendations(recs);
        setSelectedDayIndex(0);
      } catch (err: any) {
        console.error('Error loading weather by coordinates:', err);
        setError(err.message || 'Unable to fetch weather data for selected location.');
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadWeather('Chennai');
  }, [loadWeather]);

  const handleRefresh = () => {
    if (currentCityName) {
      loadWeather(currentCityName);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-[#faf6f2] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Header with search bar embedded */}
      <Header
        unit={unit}
        onToggleUnit={(newUnit) => setUnit(newUnit)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onSelectCity={(city) => loadWeather(city)}
        onSelectCoords={(lat, lon, city, country, admin1) =>
          loadWeatherByCoords(lat, lon, city, country, admin1)
        }
      />

      {/* Main Dashboard - Non-scrollable viewport fit on desktop */}
      <main className="flex-1 min-h-0 p-3 sm:p-4 lg:p-5 overflow-y-auto lg:overflow-hidden">
        {/* Error Banner */}
        {error && (
          <div className="max-w-xl mx-auto mb-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadWeather('Chennai')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shrink-0"
            >
              Reset
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="h-full flex items-center justify-center">
            <WeatherSkeleton />
          </div>
        )}

        {/* Weather Content Grid */}
        {weatherData && (
          <div className="h-full max-w-7xl mx-auto grid grid-cols-12 gap-3 lg:gap-5">
            {/* Left Aside: Current Weather & Smart Advice */}
            <aside className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:gap-4 h-full min-h-0">
              <div className="flex-1 min-h-[220px]">
                <CurrentWeatherCard data={weatherData} unit={unit} />
              </div>
              <div className="shrink-0">
                <SmartAdviceCard
                  recommendations={recommendations}
                  cityName={weatherData.city}
                />
              </div>
            </aside>

            {/* Right Section: Temperature Chart & 7-Day Forecast */}
            <section className="col-span-12 lg:col-span-8 flex flex-col gap-3 lg:gap-4 h-full min-h-0">
              <div className="flex-1 min-h-[220px]">
                <TemperatureChart daily={weatherData.daily} unit={unit} />
              </div>
              <div className="shrink-0">
                <ForecastGrid
                  daily={weatherData.daily}
                  unit={unit}
                  selectedIndex={selectedDayIndex}
                  onSelectDay={(idx) => setSelectedDayIndex(idx)}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

