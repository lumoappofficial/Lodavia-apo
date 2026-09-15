/**
 * Real-time Weather Service for Lodavia
 * Powered by Open-Meteo API (Free, high reliability, no API key required)
 * Includes Geolocation resolution, local storage caching (45 minutes), and WMO code mapping.
 */

export interface LiveWeatherData {
  cityNameAr: string;
  cityNameEn: string;
  countryNameAr: string;
  countryNameEn: string;
  temp: number;
  feelsLike: number;
  conditionAr: string;
  conditionEn: string;
  type: 'sunny' | 'partly' | 'cloudy' | 'rainy' | 'night';
  iconEmoji: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  isLiveLocation: boolean;
  latitude: number;
  longitude: number;
  hourly: { time: string; temp: number; icon: string }[];
  forecast: { dayAr: string; dayEn: string; high: number; low: number; icon: string }[];
  updatedAt: number;
}

const CACHE_KEY = 'lodavia_live_weather_cache';
const CACHE_DURATION_MS = 45 * 60 * 1000; // 45 minutes cache

// Default fallback location (Riyadh, Saudi Arabia)
export const DEFAULT_FALLBACK_LOCATION = {
  lat: 24.7136,
  lon: 46.6753,
  nameAr: 'الرياض',
  nameEn: 'Riyadh',
  countryAr: 'السعودية',
  countryEn: 'Saudi Arabia',
};

/**
 * Maps WMO Weather Interpretation Codes to Lodavia UI weather types, localized labels, and icons
 */
export function mapWmoToWeather(code: number, isDay: boolean = true) {
  // 0: Clear sky
  if (code === 0) {
    return {
      type: isDay ? ('sunny' as const) : ('night' as const),
      conditionAr: isDay ? 'مشمس وصافٍ' : 'صافٍ ليلاً',
      conditionEn: isDay ? 'Sunny & Clear' : 'Clear Night',
      iconEmoji: isDay ? '☀️' : '🌙',
    };
  }
  // 1, 2: Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    return {
      type: 'partly' as const,
      conditionAr: isDay ? 'غائم جزئياً' : 'سحب خفيفة ليلاً',
      conditionEn: isDay ? 'Partly Cloudy' : 'Scattered Clouds',
      iconEmoji: isDay ? '🌤️' : '☁️',
    };
  }
  // 3: Overcast
  if (code === 3) {
    return {
      type: 'cloudy' as const,
      conditionAr: 'غائم بالكامل',
      conditionEn: 'Overcast',
      iconEmoji: '☁️',
    };
  }
  // 45, 48: Fog
  if (code === 45 || code === 48) {
    return {
      type: 'cloudy' as const,
      conditionAr: 'ضبابي',
      conditionEn: 'Foggy',
      iconEmoji: '🌫️',
    };
  }
  // 51, 53, 55, 56, 57: Drizzle
  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      type: 'rainy' as const,
      conditionAr: 'رذاذ خفيف',
      conditionEn: 'Light Drizzle',
      iconEmoji: '🌦️',
    };
  }
  // 61, 63, 65, 66, 67, 80, 81, 82: Rain showers
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      type: 'rainy' as const,
      conditionAr: 'ممطر',
      conditionEn: 'Rainy',
      iconEmoji: '🌧️',
    };
  }
  // 71, 73, 75, 77, 85, 86: Snow
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      type: 'cloudy' as const,
      conditionAr: 'ثلوج',
      conditionEn: 'Snowy',
      iconEmoji: '❄️',
    };
  }
  // 95, 96, 99: Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return {
      type: 'rainy' as const,
      conditionAr: 'عاصفة رعدية',
      conditionEn: 'Thunderstorm',
      iconEmoji: '⛈️',
    };
  }

  return {
    type: isDay ? ('sunny' as const) : ('night' as const),
    conditionAr: isDay ? 'معتدل' : 'صافٍ',
    conditionEn: isDay ? 'Mild & Clear' : 'Clear',
    iconEmoji: isDay ? '☀️' : '🌙',
  };
}

/**
 * Fetch real weather from Open-Meteo for specified latitude and longitude
 */
export async function fetchLiveWeather(
  lat: number,
  lon: number,
  cityHintAr?: string,
  cityHintEn?: string,
  countryHintAr?: string,
  countryHintEn?: string,
  isLiveLocation: boolean = false
): Promise<LiveWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const json = await response.json();
  const current = json.current || {};
  const isDay = current.is_day === 1;
  const weatherMapping = mapWmoToWeather(current.weather_code ?? 0, isDay);

  // Parse Hourly Forecast (next 5 key intervals)
  const hourlyTimes: string[] = json.hourly?.time || [];
  const hourlyTemps: number[] = json.hourly?.temperature_2m || [];
  const hourlyCodes: number[] = json.hourly?.weather_code || [];

  const nowIso = new Date().toISOString();
  let nextStartIndex = hourlyTimes.findIndex((t) => t >= nowIso.slice(0, 13));
  if (nextStartIndex === -1) nextStartIndex = 0;

  const hourly: { time: string; temp: number; icon: string }[] = [];
  for (let i = 0; i < 5; i++) {
    const idx = nextStartIndex + i * 3;
    if (idx < hourlyTimes.length) {
      const timeStr = hourlyTimes[idx];
      const hour = new Date(timeStr).getHours();
      const formattedTime = `${hour.toString().padStart(2, '0')}:00`;
      const temp = Math.round(hourlyTemps[idx] ?? current.temperature_2m ?? 25);
      const isDayHour = hour >= 6 && hour < 19;
      const hourMapping = mapWmoToWeather(hourlyCodes[idx] ?? 0, isDayHour);
      hourly.push({
        time: formattedTime,
        temp,
        icon: hourMapping.iconEmoji,
      });
    }
  }

  // Parse 5-day forecast
  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyTimes: string[] = json.daily?.time || [];
  const dailyMax: number[] = json.daily?.temperature_2m_max || [];
  const dailyMin: number[] = json.daily?.temperature_2m_min || [];
  const dailyCodes: number[] = json.daily?.weather_code || [];

  const forecast: { dayAr: string; dayEn: string; high: number; low: number; icon: string }[] = [];
  for (let i = 0; i < Math.min(5, dailyTimes.length); i++) {
    const date = new Date(dailyTimes[i]);
    const dayOfWeek = date.getDay();
    const isToday = i === 0;
    const dayMapping = mapWmoToWeather(dailyCodes[i] ?? 0, true);
    forecast.push({
      dayAr: isToday ? 'اليوم' : dayNamesAr[dayOfWeek],
      dayEn: isToday ? 'Today' : dayNamesEn[dayOfWeek],
      high: Math.round(dailyMax[i] ?? 30),
      low: Math.round(dailyMin[i] ?? 20),
      icon: dayMapping.iconEmoji,
    });
  }

  // Derive city name from timezone if hints not provided
  let cityNameAr = cityHintAr || (isLiveLocation ? 'موقعي الحالي' : DEFAULT_FALLBACK_LOCATION.nameAr);
  let cityNameEn = cityHintEn || (isLiveLocation ? 'My Location' : DEFAULT_FALLBACK_LOCATION.nameEn);
  let countryNameAr = countryHintAr || DEFAULT_FALLBACK_LOCATION.countryAr;
  let countryNameEn = countryHintEn || DEFAULT_FALLBACK_LOCATION.countryEn;

  if (isLiveLocation && json.timezone && !cityHintEn) {
    const tzParts = json.timezone.split('/');
    if (tzParts.length > 1) {
      const tzCity = tzParts[1].replace(/_/g, ' ');
      cityNameEn = tzCity;
      cityNameAr = tzCity;
    }
  }

  const result: LiveWeatherData = {
    cityNameAr,
    cityNameEn,
    countryNameAr,
    countryNameEn,
    temp: Math.round(current.temperature_2m ?? 28),
    feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 28),
    conditionAr: weatherMapping.conditionAr,
    conditionEn: weatherMapping.conditionEn,
    type: weatherMapping.type,
    iconEmoji: weatherMapping.iconEmoji,
    humidity: Math.round(current.relative_humidity_2m ?? 35),
    windSpeed: Math.round(current.wind_speed_10m ?? 12),
    uvIndex: Math.min(10, Math.max(1, Math.round((current.temperature_2m || 30) / 4))),
    isLiveLocation,
    latitude: lat,
    longitude: lon,
    hourly,
    forecast,
    updatedAt: Date.now(),
  };

  return result;
}

/**
 * Get cached weather if still fresh (under 45 minutes)
 */
export function getCachedWeather(): LiveWeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: LiveWeatherData = JSON.parse(raw);
    const age = Date.now() - (parsed.updatedAt || 0);
    if (age < CACHE_DURATION_MS) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse cached weather:', err);
  }
  return null;
}

/**
 * Cache weather data to localStorage
 */
export function setCachedWeather(data: LiveWeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to cache weather data:', err);
  }
}

/**
 * Request Geolocation safely with clear error handling & fallback
 */
export async function getCurrentUserCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 8000,
        maximumAge: 600000, // 10 minutes maximum age for position
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Reverse geocode coordinates to friendly Arabic and English place names
 */
export async function reverseGeocode(lat: number, lon: number): Promise<{
  cityAr?: string;
  cityEn?: string;
  countryAr?: string;
  countryEn?: string;
}> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&accept-language=ar`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!res.ok) return {};
    const data = await res.json();
    const addr = data?.address || {};
    const city = addr.city || addr.town || addr.municipality || addr.state_district || addr.state;
    const country = addr.country;

    return {
      cityAr: city,
      cityEn: addr.city || addr.town || addr.state,
      countryAr: country,
      countryEn: country,
    };
  } catch (err) {
    return {};
  }
}
