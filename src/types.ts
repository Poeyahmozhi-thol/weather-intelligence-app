export type TemperatureUnit = 'C' | 'F';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string; // State / Region
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number; // °C
  windspeed: number;   // km/h
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  relative_humidity_2m_max: number[];
  windspeed_10m_max?: number[];
  uv_index_max?: number[];
}

export interface WeatherData {
  city: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  current_weather: CurrentWeather;
  daily: DailyForecastData;
  timezone: string;
}

export interface SmartRecommendation {
  id: string;
  category: 'activity' | 'clothing' | 'safety' | 'commute';
  title: string;
  description: string;
  iconName: string;
  level: 'positive' | 'warning' | 'alert' | 'info';
}

export interface FormattedDailyForecast {
  date: string;
  dayName: string;
  fullDate: string;
  weathercode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  humidity: number;
}
