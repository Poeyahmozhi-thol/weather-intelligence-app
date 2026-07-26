import { GeocodingResult, WeatherData } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(cityName: string, count: number = 5): Promise<GeocodingResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding server error (${res.status})`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err: any) {
    console.error('Error in searchCities:', err);
    throw new Error('Unable to connect to city search service. Please check your internet connection.');
  }
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  cityName: string,
  country?: string,
  admin1?: string
): Promise<WeatherData> {
  const url = `${FORECAST_BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,relative_humidity_2m_max&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather service returned HTTP ${res.status}`);
    }
    const data = await res.json();

    if (!data.current_weather || !data.daily) {
      throw new Error('Incomplete weather payload returned by the server.');
    }

    return {
      city: cityName,
      country,
      admin1,
      latitude: lat,
      longitude: lon,
      elevation: data.elevation,
      current_weather: data.current_weather,
      daily: data.daily,
      timezone: data.timezone || 'auto',
    };
  } catch (err: any) {
    console.error('Error fetching weather data:', err);
    throw new Error(err.message || 'Failed to retrieve weather data for the specified location.');
  }
}

export async function fetchWeatherForCity(cityName: string): Promise<WeatherData> {
  const searchResults = await searchCities(cityName, 1);
  if (!searchResults || searchResults.length === 0) {
    throw new Error(`City "${cityName}" not found. Please verify the spelling or try another location.`);
  }

  const topResult = searchResults[0];
  return fetchWeatherByCoords(
    topResult.latitude,
    topResult.longitude,
    topResult.name,
    topResult.country,
    topResult.admin1
  );
}
