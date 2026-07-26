import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyForecastData, TemperatureUnit } from '../types';
import { convertTemp, formatDate, getWMOInfo } from '../utils/weatherUtils';

interface TemperatureChartProps {
  daily: DailyForecastData;
  unit: TemperatureUnit;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ daily, unit }) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  const chartData = daily.time.map((timeStr, idx) => {
    const { dayName, shortDate } = formatDate(timeStr);
    const maxC = daily.temperature_2m_max[idx];
    const minC = daily.temperature_2m_min[idx];
    const code = daily.weathercode[idx];
    const wmoInfo = getWMOInfo(code);

    return {
      day: dayName,
      date: shortDate,
      fullDate: `${dayName}, ${shortDate}`,
      condition: wmoInfo.label,
      maxTemp: convertTemp(maxC, unit),
      minTemp: convertTemp(minC, unit),
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 z-50">
          <p className="font-bold text-slate-200">{data.fullDate}</p>
          <p className="text-slate-400 font-medium text-[11px]">{data.condition}</p>
          <div className="pt-1 border-t border-slate-800 space-y-1">
            <div className="flex items-center justify-between space-x-3">
              <span className="text-orange-400 font-semibold">Max:</span>
              <span className="font-bold text-white">{data.maxTemp}°{unit}</span>
            </div>
            <div className="flex items-center justify-between space-x-3">
              <span className="text-teal-400 font-semibold">Min:</span>
              <span className="font-bold text-white">{data.minTemp}°{unit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl lg:rounded-[32px] p-5 sm:p-6 shadow-xs overflow-hidden">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            7-Day Temperature Trend (°{unit})
          </h3>
        </div>
      </div>

      {/* Recharts flexible container */}
      <div className="flex-1 min-h-[160px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              unit={`°`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
            />
            <Line
              name={`Max Temp (°${unit})`}
              type="monotone"
              dataKey="maxTemp"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 3, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              name={`Min Temp (°${unit})`}
              type="monotone"
              dataKey="minTemp"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 3, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

