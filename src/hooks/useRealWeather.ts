import { useState, useEffect, useCallback } from 'react';
import {
  LiveWeatherData,
  getCachedWeather,
  setCachedWeather,
  fetchLiveWeather,
  getCurrentUserCoordinates,
  reverseGeocode,
  DEFAULT_FALLBACK_LOCATION,
} from '../services/weather.service';

const PROMPT_STORAGE_KEY = 'lodavia_weather_permission_prompted';

export function useRealWeather() {
  const [weather, setWeather] = useState<LiveWeatherData>(() => {
    const cached = getCachedWeather();
    if (cached) return cached;

    // Initial placeholder matching fallback city until loaded
    return {
      cityNameAr: DEFAULT_FALLBACK_LOCATION.nameAr,
      cityNameEn: DEFAULT_FALLBACK_LOCATION.nameEn,
      countryNameAr: DEFAULT_FALLBACK_LOCATION.countryAr,
      countryNameEn: DEFAULT_FALLBACK_LOCATION.countryEn,
      temp: 34,
      feelsLike: 36,
      conditionAr: 'مشمس وصافٍ',
      conditionEn: 'Sunny & Clear',
      type: 'sunny',
      iconEmoji: '☀️',
      humidity: 20,
      windSpeed: 14,
      uvIndex: 8,
      isLiveLocation: false,
      latitude: DEFAULT_FALLBACK_LOCATION.lat,
      longitude: DEFAULT_FALLBACK_LOCATION.lon,
      hourly: [
        { time: '12:00', temp: 34, icon: '☀️' },
        { time: '15:00', temp: 37, icon: '☀️' },
        { time: '18:00', temp: 33, icon: '🌤️' },
        { time: '21:00', temp: 29, icon: '🌙' },
        { time: '00:00', temp: 26, icon: '✨' },
      ],
      forecast: [
        { dayAr: 'اليوم', dayEn: 'Today', high: 38, low: 25, icon: '☀️' },
        { dayAr: 'السبت', dayEn: 'Sat', high: 39, low: 26, icon: '☀️' },
        { dayAr: 'الأحد', dayEn: 'Sun', high: 38, low: 25, icon: '🌤️' },
        { dayAr: 'الإثنين', dayEn: 'Mon', high: 37, low: 24, icon: '🌤️' },
        { dayAr: 'الثلاثاء', dayEn: 'Tue', high: 36, low: 23, icon: '☀️' },
      ],
      updatedAt: 0,
    };
  });

  const [loading, setLoading] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  // Load weather for fallback location
  const loadFallbackWeather = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLiveWeather(
        DEFAULT_FALLBACK_LOCATION.lat,
        DEFAULT_FALLBACK_LOCATION.lon,
        DEFAULT_FALLBACK_LOCATION.nameAr,
        DEFAULT_FALLBACK_LOCATION.nameEn,
        DEFAULT_FALLBACK_LOCATION.countryAr,
        DEFAULT_FALLBACK_LOCATION.countryEn,
        false
      );
      setWeather(data);
      setCachedWeather(data);
    } catch (err) {
      console.warn('Failed to load fallback weather from Open-Meteo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Request location and load live weather
  const requestLocation = useCallback(async () => {
    setShowPermissionBanner(false);
    localStorage.setItem(PROMPT_STORAGE_KEY, 'granted');
    setLoading(true);

    try {
      const coords = await getCurrentUserCoordinates();
      // Try to resolve city name through reverse geocoding
      const geoInfo = await reverseGeocode(coords.lat, coords.lon);

      const data = await fetchLiveWeather(
        coords.lat,
        coords.lon,
        geoInfo.cityAr,
        geoInfo.cityEn,
        geoInfo.countryAr,
        geoInfo.countryEn,
        true
      );

      setWeather(data);
      setCachedWeather(data);
    } catch (err) {
      console.info('Geolocation was denied or unavailable, using fallback location:', err);
      // Seamlessly fallback to default city without breaking UI
      await loadFallbackWeather();
    } finally {
      setLoading(false);
    }
  }, [loadFallbackWeather]);

  // Dismiss permission prompt and use fallback
  const dismissPermissionPrompt = useCallback(() => {
    setShowPermissionBanner(false);
    localStorage.setItem(PROMPT_STORAGE_KEY, 'dismissed');
    loadFallbackWeather();
  }, [loadFallbackWeather]);

  // Initial check on mount
  useEffect(() => {
    const cached = getCachedWeather();
    if (cached) {
      setWeather(cached);
      return;
    }

    const promptedState = localStorage.getItem(PROMPT_STORAGE_KEY);

    // If already previously granted or queried
    if (promptedState === 'granted') {
      requestLocation();
    } else if (promptedState === 'dismissed') {
      loadFallbackWeather();
    } else {
      // First time opening the app:
      // Check if navigator.permissions is supported to see if already granted
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'geolocation' as PermissionName })
          .then((perm) => {
            if (perm.state === 'granted') {
              requestLocation();
            } else if (perm.state === 'denied') {
              loadFallbackWeather();
            } else {
              // Show prompt asking user clearly
              setShowPermissionBanner(true);
            }
          })
          .catch(() => {
            setShowPermissionBanner(true);
          });
      } else {
        setShowPermissionBanner(true);
      }
    }
  }, [loadFallbackWeather, requestLocation]);

  return {
    weather,
    loading,
    showPermissionBanner,
    requestLocation,
    dismissPermissionPrompt,
    refreshWeather: requestLocation,
  };
}
