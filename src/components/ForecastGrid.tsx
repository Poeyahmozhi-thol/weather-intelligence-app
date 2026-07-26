import React from 'react';
import { Calendar, CloudRain, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWMOInfo, formatTemperature, formatDate } from '../utils/weatherUtils';

interface ForecastGridProps {
  daily: DailyForecastData;
  unit: TemperatureUnit;
  selectedIndex?: number;
  onSelectDay?: (index: number) => void;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  unit,
  selectedIndex = 0,
  onSelectDay,
}) => {
  const daysCount = daily.time?.length || 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl lg:rounded-[32px] p-4 lg:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            7-Day Weather Forecast
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
          Select day to view
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: daysCount }).map((_, idx) => {
          const dateStr = daily.time[idx];
          const code = daily.weathercode[idx];
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const precip = daily.precipitation_sum[idx] ?? 0;

          const { dayName, shortDate } = formatDate(dateStr);
          const wmoInfo = getWMOInfo(code);
          const isToday = idx === 0;
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay && onSelectDay(idx)}
              className={`relative text-center p-2 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-between min-w-0 ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-orange-300/60'
                  : 'bg-orange-50/30 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
              }`}
            >
              {isToday && (
                <span
                  className={`absolute -top-1.5 px-1 py-0.2 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                    isSelected ? 'bg-orange-400 text-white' : 'bg-orange-500 text-white'
                  }`}
                >
                  Today
                </span>
              )}

              {/* Day & Date */}
              <div className="text-center pt-0.5">
                <p className="text-[10px] sm:text-xs font-bold truncate">
                  {dayName}
                </p>
                <p
                  className={`text-[9px] sm:text-[10px] font-medium ${
                    isSelected ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {shortDate}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="my-1.5">
                <WeatherIcon
                  code={code}
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected ? 'text-white' : ''}`}
                />
              </div>

              {/* High / Low Temps */}
              <div className="w-full pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 space-y-0.5 text-[10px] sm:text-xs">
                <div
                  className={`flex items-center justify-center font-bold ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <ArrowUp className="w-2.5 h-2.5 text-rose-500 mr-0.5 shrink-0" />
                  {formatTemperature(maxTemp, unit)}
                </div>
                <div
                  className={`flex items-center justify-center font-medium ${
                    isSelected ? 'text-teal-100' : 'text-teal-600 dark:text-teal-400'
                  }`}
                >
                  <ArrowDown className="w-2.5 h-2.5 text-teal-400 mr-0.5 shrink-0" />
                  {formatTemperature(minTemp, unit)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

