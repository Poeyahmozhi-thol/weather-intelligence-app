import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  CloudRain,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWMOInfo, formatTemperature } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const current = data.current_weather;
  const wmoInfo = getWMOInfo(current.weathercode, current.is_day);

  const todayMax = data.daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = data.daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = data.daily.precipitation_sum[0] ?? 0;
  const todayHumidity = data.daily.relative_humidity_2m_max[0] ?? 60;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl lg:rounded-[32px] p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* City & Date header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>{data.admin1 ? `${data.admin1}, ` : ''}{data.country || 'Global'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {data.city}
          </h2>
        </div>

        <div className="px-3 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-orange-800 dark:text-orange-200 border border-orange-200/50 dark:border-slate-700 text-xs font-medium flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3 text-orange-400" />
          {dateFormatted}
        </div>
      </div>

      {/* Temperature & Main condition */}
      <div className="my-auto py-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-5xl sm:text-6xl lg:text-7xl font-extralight text-slate-900 dark:text-white tracking-tighter leading-none">
            {formatTemperature(current.temperature, unit)}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs font-bold">
            <span className="flex items-center text-rose-500">
              <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
              {formatTemperature(todayMax, unit)}
            </span>
            <span className="flex items-center text-teal-600 dark:text-teal-400">
              <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
              {formatTemperature(todayMin, unit)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-orange-100 dark:border-slate-700/60 mb-1.5">
            <WeatherIcon code={current.weathercode} isDay={current.is_day} className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {wmoInfo.label}
          </span>
        </div>
      </div>

      {/* Weather Stats Row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-2xl bg-orange-50/50 dark:bg-slate-800/60 text-center">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-orange-500" /> Wind
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
            {Math.round(current.windspeed)} <span className="text-[10px] font-normal text-slate-500">km/h</span>
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 text-center">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Droplets className="w-3 h-3 text-teal-600" /> Humidity
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
            {todayHumidity}<span className="text-[10px] font-normal text-slate-500">%</span>
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 text-center">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <CloudRain className="w-3 h-3 text-amber-600" /> Rain
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
            {todayPrecip.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mm</span>
          </p>
        </div>
      </div>
    </div>
  );
};

