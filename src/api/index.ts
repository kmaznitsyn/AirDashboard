import axios from 'axios';
import { WeatherData, AirQualityData, UVData, CitySuggestion } from '../types';
import { OPENWEATHER_KEY } from '../../config/keys';

const OW_BASE = 'https://api.openweathermap.org';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const { data } = await axios.get(`${OW_BASE}/data/2.5/weather`, {
    params: { lat, lon, appid: OPENWEATHER_KEY, units: 'metric' },
  });
  return {
    city:        data.name,
    country:     data.sys.country,
    temp:        Math.round(data.main.temp),
    feelsLike:   Math.round(data.main.feels_like),
    humidity:    data.main.humidity,
    windSpeed:   Math.round(data.wind.speed * 10) / 10,
    description: data.weather[0].description,
    icon:        data.weather[0].icon,
  };
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const { data } = await axios.get(`${OW_BASE}/data/2.5/air_pollution`, {
    params: { lat, lon, appid: OPENWEATHER_KEY },
  });
  const { main, components } = data.list[0];
  return {
    aqi:   main.aqi,
    pm2_5: Math.round(components.pm2_5 * 10) / 10,
    pm10:  Math.round(components.pm10 * 10) / 10,
    o3:    Math.round(components.o3 * 10) / 10,
  };
}

export async function fetchUV(lat: number, lon: number): Promise<UVData> {
  // Open-Meteo — completely free, no API key required
  const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude:     lat,
      longitude:    lon,
      daily:        'uv_index_max',
      timezone:     'auto',
      forecast_days: 1,
    },
  });
  return { uvMax: data.daily.uv_index_max[0] ?? 0 };
}

export async function geocodeCity(
  city: string,
): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const { data } = await axios.get(`${OW_BASE}/geo/1.0/direct`, {
    params: { q: city, limit: 1, appid: OPENWEATHER_KEY },
  });
  if (!data.length) throw new Error('City not found');
  return {
    lat:     data[0].lat,
    lon:     data[0].lon,
    name:    data[0].name,
    country: data[0].country,
  };
}

// Returns up to 5 matching cities for autocomplete suggestions
export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!query.trim()) return [];
  const { data } = await axios.get(`${OW_BASE}/geo/1.0/direct`, {
    params: { q: query.trim(), limit: 5, appid: OPENWEATHER_KEY },
  });
  return data.map((item: Record<string, unknown>) => ({
    name:    item.name,
    country: item.country,
    state:   item.state,
    lat:     item.lat,
    lon:     item.lon,
  }));
}
