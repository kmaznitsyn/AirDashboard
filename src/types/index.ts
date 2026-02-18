export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface AirQualityData {
  aqi: number; // 1–5 (OpenWeatherMap scale)
  pm2_5: number;
  pm10: number;
  o3: number;
}

export interface UVData {
  uvMax: number;
}

export interface DashboardData {
  weather: WeatherData;
  airQuality: AirQualityData;
  uv: UVData;
}

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
