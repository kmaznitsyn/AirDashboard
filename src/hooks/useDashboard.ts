import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { fetchWeather, fetchAirQuality, fetchUV, geocodeCity, fetchCitySuggestions } from '../api';
import { DashboardData, CitySuggestion } from '../types';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LEN = 2;

export function useDashboard() {
  const [data, setData]         = useState<DashboardData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [suggestions, setSuggestions]           = useState<CitySuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, airQuality, uv] = await Promise.all([
        fetchWeather(lat, lon),
        fetchAirQuality(lat, lon),
        fetchUV(lat, lon),
      ]);
      setData({ weather, airQuality, uv });
      setCurrentCoords({ lat, lon });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(`Failed to load data: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount — request location and fetch data
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Search for a city above.');
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        await load(loc.coords.latitude, loc.coords.longitude);
      } catch {
        setError('Could not get your location. Search for a city above.');
        setLoading(false);
      }
    })();
  }, [load]);

  // Debounced suggestions fetch — called on every keystroke
  const fetchSuggestions = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.length < MIN_QUERY_LEN) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    setSuggestionsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await fetchCitySuggestions(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  // User picks a suggestion — load by coords directly, no second geocode trip
  const selectSuggestion = useCallback(async (suggestion: CitySuggestion) => {
    setSuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    await load(suggestion.lat, suggestion.lon);
  }, [load]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  // Explicit "Go" button search (fallback if no suggestion selected)
  const searchCity = async (city: string) => {
    if (!city.trim()) return;
    clearSuggestions();
    setLoading(true);
    setError(null);
    try {
      const { lat, lon } = await geocodeCity(city.trim());
      await load(lat, lon);
    } catch {
      setError('City not found. Try a different name.');
      setLoading(false);
    }
  };

  // Pull-to-refresh
  const refresh = () => {
    if (currentCoords) load(currentCoords.lat, currentCoords.lon);
  };

  return {
    data,
    loading,
    error,
    searchCity,
    refresh,
    suggestions,
    suggestionsLoading,
    fetchSuggestions,
    selectSuggestion,
    clearSuggestions,
  };
}
