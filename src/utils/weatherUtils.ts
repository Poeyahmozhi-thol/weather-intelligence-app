import { TemperatureUnit, SmartRecommendation, DailyForecastData, CurrentWeather } from '../types';

export interface WeatherCodeInfo {
  label: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning' | 'Wind';
  bgTheme: string;
}

export const getWMOInfo = (code: number, isDay: number = 1): WeatherCodeInfo => {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: 'Sun',
        bgTheme: isDay ? 'from-amber-500/10 via-sky-500/5 to-blue-500/10' : 'from-indigo-900/20 via-slate-900/10 to-purple-900/20',
      };
    case 1:
      return { label: 'Mainly Clear', iconName: 'CloudSun', bgTheme: 'from-sky-400/10 to-blue-500/10' };
    case 2:
      return { label: 'Partly Cloudy', iconName: 'CloudSun', bgTheme: 'from-sky-500/10 via-slate-400/10 to-blue-500/10' };
    case 3:
      return { label: 'Overcast', iconName: 'Cloud', bgTheme: 'from-slate-500/15 to-slate-700/10' };
    case 45:
    case 48:
      return { label: 'Foggy', iconName: 'CloudFog', bgTheme: 'from-gray-400/15 to-slate-500/10' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', iconName: 'CloudDrizzle', bgTheme: 'from-blue-400/15 to-cyan-500/10' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', iconName: 'CloudDrizzle', bgTheme: 'from-cyan-400/15 to-blue-600/10' };
    case 61:
      return { label: 'Slight Rain', iconName: 'CloudRain', bgTheme: 'from-blue-500/15 to-indigo-500/10' };
    case 63:
      return { label: 'Moderate Rain', iconName: 'CloudRain', bgTheme: 'from-blue-600/20 to-slate-700/15' };
    case 65:
      return { label: 'Heavy Rain', iconName: 'CloudRain', bgTheme: 'from-blue-700/25 to-indigo-900/20' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', iconName: 'CloudRain', bgTheme: 'from-cyan-500/20 to-blue-800/15' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: 'Snowfall', iconName: 'CloudSnow', bgTheme: 'from-indigo-300/15 to-sky-200/15' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', iconName: 'CloudRain', bgTheme: 'from-blue-500/20 to-cyan-600/15' };
    case 85:
    case 86:
      return { label: 'Snow Showers', iconName: 'CloudSnow', bgTheme: 'from-sky-300/20 to-blue-400/15' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', iconName: 'CloudLightning', bgTheme: 'from-purple-900/25 via-slate-800/20 to-amber-600/15' };
    default:
      return { label: 'Unknown Weather', iconName: 'CloudSun', bgTheme: 'from-slate-400/10 to-sky-400/10' };
  }
};

export const convertTemp = (celsius: number, unit: TemperatureUnit): number => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const formatTemperature = (celsius: number, unit: TemperatureUnit): string => {
  return `${convertTemp(celsius, unit)}°${unit}`;
};

export const generateSmartRecommendations = (
  current: CurrentWeather,
  daily: DailyForecastData
): SmartRecommendation[] => {
  const recommendations: SmartRecommendation[] = [];
  const todayMax = daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = daily.precipitation_sum[0] ?? 0;
  const todayHumidity = daily.relative_humidity_2m_max[0] ?? 50;
  const windSpeed = current.windspeed;
  const code = current.weathercode;

  // Rain / Umbrella
  if (todayPrecip > 5 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    recommendations.push({
      id: 'rain-alert',
      category: 'clothing',
      title: 'Rain Protection Required',
      description: `High chance of rainfall (${todayPrecip.toFixed(1)} mm expected today). Carry an umbrella and wear waterproof outerwear.`,
      iconName: 'Umbrella',
      level: todayPrecip > 15 ? 'alert' : 'warning',
    });
  } else if (todayPrecip > 0 && todayPrecip <= 5) {
    recommendations.push({
      id: 'rain-light',
      category: 'clothing',
      title: 'Light Drizzle Possible',
      description: 'Slight chance of rain. A light jacket or compact umbrella is recommended for outdoor errands.',
      iconName: 'CloudDrizzle',
      level: 'info',
    });
  } else {
    recommendations.push({
      id: 'clear-skies',
      category: 'activity',
      title: 'Optimal Outdoor Conditions',
      description: 'Dry weather predicted. Perfect day for outdoor sports, walking, cycling, or drying laundry outdoors.',
      iconName: 'Sun',
      level: 'positive',
    });
  }

  // Temperature & Clothing Advice
  if (todayMax >= 35) {
    recommendations.push({
      id: 'extreme-heat',
      category: 'safety',
      title: 'Extreme Heat Warning',
      description: `Maximum temp reaching ${Math.round(todayMax)}°C. Stay hydrated, avoid prolonged sun exposure during peak hours (11am - 4pm), and wear breathable cotton clothing.`,
      iconName: 'ThermometerSun',
      level: 'alert',
    });
  } else if (todayMax >= 28) {
    recommendations.push({
      id: 'warm-weather',
      category: 'clothing',
      title: 'Warm & Sunny Attire',
      description: `Warm daytime highs around ${Math.round(todayMax)}°C. Wear lightweight summer clothes and apply SPF 30+ sunscreen if stepping out.`,
      iconName: 'SunMedium',
      level: 'info',
    });
  } else if (todayMax <= 10) {
    recommendations.push({
      id: 'cold-weather',
      category: 'clothing',
      title: 'Cold Weather Gear',
      description: `Chilly temperatures dropping to ${Math.round(todayMin)}°C. Layer up with thermal wear, a warm sweater, and a heavy jacket.`,
      iconName: 'ThermometerSnowflake',
      level: 'warning',
    });
  }

  // Wind Advisory
  if (windSpeed >= 35) {
    recommendations.push({
      id: 'high-wind',
      category: 'safety',
      title: 'High Wind Caution',
      description: `Breezy conditions with wind speeds up to ${Math.round(windSpeed)} km/h. Secure loose outdoor furniture and exercise extra caution while driving tall vehicles.`,
      iconName: 'Wind',
      level: 'warning',
    });
  } else if (windSpeed >= 20) {
    recommendations.push({
      id: 'moderate-wind',
      category: 'commute',
      title: 'Breezy Atmosphere',
      description: `Moderate winds around ${Math.round(windSpeed)} km/h. Great for wind sports, but keep loose items secure.`,
      iconName: 'Wind',
      level: 'info',
    });
  }

  // Humidity & Comfort
  if (todayHumidity >= 80 && todayMax >= 27) {
    recommendations.push({
      id: 'high-humidity',
      category: 'safety',
      title: 'High Muggy Humidity',
      description: `Relative humidity hitting ${todayHumidity}%. It will feel warmer than actual temperature. Drink plenty of electrolytes.`,
      iconName: 'Droplets',
      level: 'info',
    });
  }

  // Commute / Travel summary
  if ([95, 96, 99].includes(code)) {
    recommendations.push({
      id: 'thunderstorm-commute',
      category: 'commute',
      title: 'Thunderstorm Travel Caution',
      description: 'Thunderstorms expected. Plan extra time for commute, watch out for reduced visibility, and avoid parking under large trees or power poles.',
      iconName: 'CloudLightning',
      level: 'alert',
    });
  } else {
    recommendations.push({
      id: 'smooth-commute',
      category: 'commute',
      title: 'Favorable Travel Windows',
      description: 'Road and weather visibility are generally clear. Standard commute schedules expected without major weather delays.',
      iconName: 'Car',
      level: 'positive',
    });
  }

  return recommendations;
};

export const formatDate = (dateStr: string): { dayName: string; shortDate: string; fullDate: string } => {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return { dayName, shortDate, fullDate };
};
