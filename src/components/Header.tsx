import React from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onSelectCity: (cityName: string) => void;
  onSelectCoords?: (lat: number, lon: number, cityName: string, country?: string, admin1?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isLoading,
  onSelectCity,
  onSelectCoords,
}) => {
  return (
    <header className="h-16 shrink-0 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 z-30 shadow-xs">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 bg-gradient-to-tr from-orange-400 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-xs">
          <CloudSun className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white hidden sm:block">
          Weather<span className="text-teal-600 dark:text-teal-400">Intel</span>
        </h1>
      </div>

      {/* Inline Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <SearchBar
          onSelectCity={onSelectCity}
          onSelectCoords={onSelectCoords}
          isLoading={isLoading}
        />
      </div>

      {/* Right controls: Refresh & Unit Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh weather data"
          className="p-2 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50"
          id="refresh-weather-btn"
        >
          <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
        </button>

        {/* C / F Toggle Pill */}
        <div className="flex items-center bg-orange-50/80 dark:bg-slate-800 p-1 rounded-full border border-orange-200/60 dark:border-slate-700">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              unit === 'C'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
            id="unit-toggle-celsius"
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              unit === 'F'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
            id="unit-toggle-fahrenheit"
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};

