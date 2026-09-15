import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Plus,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  Navigation
} from 'lucide-react';
import { playSynthSound } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import { useRealWeather } from '../hooks/useRealWeather';

interface CosmicCalendarWeatherProps {
  lang?: string;
}

interface CityWeather {
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  temp: number;
  feelsLike: number;
  conditionAr: string;
  conditionEn: string;
  type: 'sunny' | 'cloudy' | 'rainy' | 'partly' | 'night';
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  hourly: { time: string; temp: number; icon: string }[];
  forecast: { dayAr: string; dayEn: string; high: number; low: number; icon: string }[];
}

const CITIES_DATA: CityWeather[] = [
  {
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    temp: 34,
    feelsLike: 36,
    conditionAr: 'مشمس وصافٍ',
    conditionEn: 'Sunny & Clear',
    type: 'sunny',
    humidity: 18,
    windSpeed: 14,
    uvIndex: 8,
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
    ]
  },
  {
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    temp: 32,
    feelsLike: 35,
    conditionAr: 'دافئ وغائم جزئياً',
    conditionEn: 'Partly Cloudy',
    type: 'partly',
    humidity: 52,
    windSpeed: 18,
    uvIndex: 7,
    hourly: [
      { time: '12:00', temp: 32, icon: '🌤️' },
      { time: '15:00', temp: 34, icon: '🌤️' },
      { time: '18:00', temp: 31, icon: '⛅' },
      { time: '21:00', temp: 29, icon: '🌙' },
      { time: '00:00', temp: 27, icon: '✨' },
    ],
    forecast: [
      { dayAr: 'اليوم', dayEn: 'Today', high: 35, low: 27, icon: '🌤️' },
      { dayAr: 'السبت', dayEn: 'Sat', high: 36, low: 28, icon: '☀️' },
      { dayAr: 'الأحد', dayEn: 'Sun', high: 35, low: 27, icon: '🌤️' },
      { dayAr: 'الإثنين', dayEn: 'Mon', high: 34, low: 26, icon: '⛅' },
      { dayAr: 'الثلاثاء', dayEn: 'Tue', high: 34, low: 26, icon: '🌤️' },
    ]
  },
  {
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    temp: 29,
    feelsLike: 30,
    conditionAr: 'معتدل ولطيف',
    conditionEn: 'Pleasant & Mild',
    type: 'sunny',
    humidity: 40,
    windSpeed: 16,
    uvIndex: 6,
    hourly: [
      { time: '12:00', temp: 29, icon: '☀️' },
      { time: '15:00', temp: 31, icon: '☀️' },
      { time: '18:00', temp: 28, icon: '🌤️' },
      { time: '21:00', temp: 24, icon: '🌙' },
      { time: '00:00', temp: 21, icon: '✨' },
    ],
    forecast: [
      { dayAr: 'اليوم', dayEn: 'Today', high: 32, low: 21, icon: '☀️' },
      { dayAr: 'السبت', dayEn: 'Sat', high: 32, low: 22, icon: '☀️' },
      { dayAr: 'الأحد', dayEn: 'Sun', high: 31, low: 20, icon: '🌤️' },
      { dayAr: 'الإثنين', dayEn: 'Mon', high: 30, low: 20, icon: '🌤️' },
      { dayAr: 'الثلاثاء', dayEn: 'Tue', high: 29, low: 19, icon: '☀️' },
    ]
  },
  {
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    temp: 36,
    feelsLike: 38,
    conditionAr: 'صحو ومشرق',
    conditionEn: 'Clear & Bright',
    type: 'sunny',
    humidity: 25,
    windSpeed: 12,
    uvIndex: 9,
    hourly: [
      { time: '12:00', temp: 36, icon: '☀️' },
      { time: '15:00', temp: 40, icon: '☀️' },
      { time: '18:00', temp: 35, icon: '🌤️' },
      { time: '21:00', temp: 31, icon: '🌙' },
      { time: '00:00', temp: 28, icon: '✨' },
    ],
    forecast: [
      { dayAr: 'اليوم', dayEn: 'Today', high: 41, low: 28, icon: '☀️' },
      { dayAr: 'السبت', dayEn: 'Sat', high: 42, low: 29, icon: '☀️' },
      { dayAr: 'الأحد', dayEn: 'Sun', high: 41, low: 28, icon: '☀️' },
      { dayAr: 'الإثنين', dayEn: 'Mon', high: 40, low: 27, icon: '🌤️' },
      { dayAr: 'الثلاثاء', dayEn: 'Tue', high: 39, low: 26, icon: '☀️' },
    ]
  },
  {
    nameAr: 'لندن',
    nameEn: 'London',
    countryAr: 'بريطانيا',
    countryEn: 'UK',
    temp: 19,
    feelsLike: 18,
    conditionAr: 'غائم جزئياً ورذاذ خفيف',
    conditionEn: 'Light Showers',
    type: 'rainy',
    humidity: 78,
    windSpeed: 22,
    uvIndex: 3,
    hourly: [
      { time: '12:00', temp: 19, icon: '🌦️' },
      { time: '15:00', temp: 21, icon: '🌧️' },
      { time: '18:00', temp: 18, icon: '⛅' },
      { time: '21:00', temp: 16, icon: '☁️' },
      { time: '00:00', temp: 14, icon: '🌙' },
    ],
    forecast: [
      { dayAr: 'اليوم', dayEn: 'Today', high: 21, low: 14, icon: '🌧️' },
      { dayAr: 'السبت', dayEn: 'Sat', high: 22, low: 15, icon: '⛅' },
      { dayAr: 'الأحد', dayEn: 'Sun', high: 20, low: 13, icon: '🌦️' },
      { dayAr: 'الإثنين', dayEn: 'Mon', high: 19, low: 12, icon: '🌧️' },
      { dayAr: 'الثلاثاء', dayEn: 'Tue', high: 21, low: 13, icon: '🌤️' },
    ]
  }
];

export default function CosmicCalendarWeather({ lang: propLang }: CosmicCalendarWeatherProps) {
  const { lang: contextLang, isRtl, t, formatDate, formatTime } = useApp();
  const currentLanguage = (propLang || contextLang) as any;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'weather'>('calendar');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Weather Integration (Open-Meteo + Geolocation)
  const {
    weather: liveWeather,
    loading: weatherLoading,
    showPermissionBanner,
    requestLocation,
    dismissPermissionPrompt,
    refreshWeather,
  } = useRealWeather();

  // Dynamic Cities List with real-time location as #1
  const allCities: CityWeather[] = useMemo(() => {
    const liveCity: CityWeather = {
      nameAr: liveWeather.cityNameAr || (isRtl ? 'موقعي الحالي' : 'My Location'),
      nameEn: liveWeather.cityNameEn || 'My Location',
      countryAr: liveWeather.countryNameAr || (isRtl ? 'موقع مباشر' : 'Live Location'),
      countryEn: liveWeather.countryNameEn || 'Live Location',
      temp: liveWeather.temp,
      feelsLike: liveWeather.feelsLike,
      conditionAr: liveWeather.conditionAr,
      conditionEn: liveWeather.conditionEn,
      type: liveWeather.type,
      humidity: liveWeather.humidity,
      windSpeed: liveWeather.windSpeed,
      uvIndex: liveWeather.uvIndex,
      hourly: liveWeather.hourly,
      forecast: liveWeather.forecast,
    };

    // Filter out Riyadh from secondary list if live location is already Riyadh fallback
    const secondaryCities = CITIES_DATA.filter(
      (c) => c.nameEn.toLowerCase() !== liveCity.nameEn.toLowerCase()
    );

    return [liveCity, ...secondaryCities];
  }, [liveWeather, isRtl]);

  // Interactive calendar month state
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  // Custom Daily Notes state
  const [notes, setNotes] = useState<Record<string, string[]>>({
    [`${calDate.getFullYear()}-${calDate.getMonth() + 1}-${new Date().getDate()}`]: [
      '🚀 ' + t('brand.tagline', undefined, 'Exploration & Social connection in Lodavia'),
      '💎 ' + t('home.claimReward', undefined, 'Claim daily points and rewards')
    ]
  });
  const [newNoteInput, setNewNoteInput] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentCity = allCities[selectedCityIndex] || allCities[0];
  const displayTemp = (celsius: number) => {
    if (useFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  // Date Formatting using Intl
  const currentDayName = formatDate(currentTime, { weekday: 'short' });
  const currentMonthName = formatDate(currentTime, { month: 'short' });
  const currentDayNum = currentTime.getDate();

  // Approximate Hijri Calculation (Offset standard)
  const hijriMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  const hijriDay = ((currentDayNum + 8) % 30) + 1;
  const hijriMonth = hijriMonthsAr[(currentTime.getMonth() + 1) % 12];

  // Calendar Grid builder
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const daysInCurrentMonth = getDaysInMonth(calYear, calMonth);
  const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    playSynthSound(600, 'sine', 0.05);
    setCalDate(new Date(calYear, calMonth - 1, 1));
  };
  const nextMonth = () => {
    playSynthSound(600, 'sine', 0.05);
    setCalDate(new Date(calYear, calMonth + 1, 1));
  };

  const selectedDateKey = `${calYear}-${calMonth + 1}-${selectedDay}`;
  const currentDayNotes = notes[selectedDateKey] || [];

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    playSynthSound(750, 'sine', 0.08);
    setNotes((prev) => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newNoteInput.trim()]
    }));
    setNewNoteInput('');
  };

  // Weather Condition Icon
  const getWeatherIcon = (type: CityWeather['type'], className = 'w-4 h-4') => {
    switch (type) {
      case 'sunny':
        return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
      case 'partly':
        return <CloudSun className={`${className} text-sky-400`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rainy':
        return <CloudRain className={`${className} text-cyan-400 animate-pulse`} />;
      case 'night':
        return <Moon className={`${className} text-purple-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* 🌟 1. SLEEK HEADER PILL BUTTON (CALENDAR + WEATHER) */}
      <button
        onClick={() => {
          playSynthSound(isOpen ? 500 : 700, 'sine', 0.08);
          setIsOpen(!isOpen);
        }}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-xl transition-all cursor-pointer shadow-sm select-none shrink-0 ${
          isOpen
            ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-purple-500/20 border-cyan-400/80 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-400/30'
            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-50/50 dark:hover:bg-slate-800/80'
        }`}
        title={isRtl ? 'التقويم والطقس المباشر' : 'Live Calendar & Weather'}
      >
        {/* Date Section */}
        <div className="flex items-center gap-1.5 text-xs font-black">
          <CalendarIcon className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform" />
          <span>{currentDayName}</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{currentDayNum}</span>
          <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {currentMonthName}
          </span>
        </div>

        {/* Subtle Divider */}
        <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-700" />

        {/* Temperature & Weather Section */}
        <div className="flex items-center gap-1.5 text-xs font-black">
          {weatherLoading ? (
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          ) : (
            getWeatherIcon(currentCity.type, 'w-3.5 h-3.5')
          )}
          <span className="text-amber-600 dark:text-amber-400 tracking-tight">
            {displayTemp(currentCity.temp)}
          </span>
          <span className="hidden md:inline text-[10px] text-slate-500 dark:text-slate-400 font-normal">
            ({isRtl ? currentCity.nameAr : currentCity.nameEn})
          </span>
        </div>
      </button>

      {/* 📍 GEOLOCATION PERMISSION BANNER (EXPLICIT REASONING ON FIRST LOAD) */}
      <AnimatePresence>
        {showPermissionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            className={`absolute top-full mt-2.5 ${
              isRtl ? 'left-0 sm:left-auto sm:right-0' : 'right-0 sm:right-auto sm:left-0'
            } z-50 w-72 sm:w-80 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/95 border border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl text-slate-800 dark:text-slate-100 text-start`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 text-base">
                🌤️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">
                    {isRtl ? 'الطقس الحي والموقع' : 'Live Weather & Location'}
                  </h5>
                  <button
                    onClick={dismissPermissionPrompt}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  {isRtl
                    ? 'لعرض الطقس المحلي بدقة، اسمح لـ Lodavia بالوصول لموقعك الجغرافي 🌤️'
                    : 'To accurately display your local weather, allow Lodavia to access your location 🌤️'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.08);
                      requestLocation();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-[11px] font-bold shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{isRtl ? 'السماح بالموقع 📍' : 'Allow Location 📍'}</span>
                  </button>
                  <button
                    onClick={() => {
                      playSynthSound(500, 'sine', 0.05);
                      dismissPermissionPrompt();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    {isRtl ? 'استخدام الافتراضي' : 'Use Default'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 2. WORLD-CLASS DROPDOWN POPOVER MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute top-full mt-2.5 ${isRtl ? 'left-0 sm:left-auto sm:right-0' : 'right-0 sm:right-auto sm:left-0'} z-50 w-[94vw] max-w-[420px] bg-white/95 dark:bg-[#0F172A]/95 border border-cyan-500/30 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-slate-800 dark:text-slate-100 select-none`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header Tabs & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              {/* Segmented Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setActiveTab('calendar');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'calendar'
                      ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'التقويم' : 'Calendar'}</span>
                </button>

                <button
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setActiveTab('weather');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'weather'
                      ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'الطقس والحرارة' : 'Weather'}</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB CONTENT: CALENDAR */}
            {activeTab === 'calendar' && (
              <div className="pt-3 space-y-3.5">
                {/* Today Cosmic Overview Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-purple-500/10 border border-cyan-400/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                      {isRtl ? 'تاريخ اليوم' : 'Today'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      {currentDayName}، {currentDayNum} {currentMonthName} {currentTime.getFullYear()}
                    </h3>
                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-300 mt-0.5">
                      {hijriDay} {hijriMonth} 1448 هـ
                    </p>
                  </div>

                  {/* Live Clock Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-cyan-400/40 text-cyan-600 dark:text-cyan-400 text-xs font-black shadow-sm">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>
                      {currentTime.toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Calendar Controls & Month Header */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white capitalize">
                    {formatDate(calDate, { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={isRtl ? nextMonth : prevMonth}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={isRtl ? prevMonth : nextMonth}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 dark:text-slate-500">
                  {(isRtl ? ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']).map(
                    (d, idx) => (
                      <div key={idx} className="py-1">
                        {d}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}

                  {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday =
                      dayNum === currentTime.getDate() &&
                      calMonth === currentTime.getMonth() &&
                      calYear === currentTime.getFullYear();
                    const isSelected = dayNum === selectedDay;
                    const hasNote = Boolean(notes[`${calYear}-${calMonth + 1}-${dayNum}`]?.length);

                    return (
                      <button
                        key={dayNum}
                        onClick={() => {
                          playSynthSound(650, 'sine', 0.05);
                          setSelectedDay(dayNum);
                        }}
                        className={`relative h-8 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 scale-105'
                            : isToday
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/50'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {hasNote && (
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-cyan-500'
                            } -mt-0.5`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Agenda & Quick Notes */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                      {isRtl ? `مهام وأحداث يوم ${selectedDay}` : `Events for Day ${selectedDay}`}
                    </span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
                      {currentDayNotes.length} {isRtl ? 'مهام' : 'tasks'}
                    </span>
                  </div>

                  {currentDayNotes.length > 0 ? (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
                      {currentDayNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span className="truncate">{note}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 text-center py-1">
                      {isRtl ? 'لا توجد مهام مسجلة لهذا اليوم' : 'No tasks for this day yet'}
                    </p>
                  )}

                  {/* Add Quick Task Input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      placeholder={isRtl ? 'أضف تذكيراً سريعاً...' : 'Add a quick reminder...'}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleAddNote}
                      className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: WEATHER */}
            {activeTab === 'weather' && (
              <div className="pt-3 space-y-3.5">
                {/* City Selector Pills & Unit Toggle */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
                  <div className="flex items-center gap-1">
                    {allCities.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.05);
                          setSelectedCityIndex(idx);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          selectedCityIndex === idx
                            ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {idx === 0 && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        <span>{isRtl ? city.nameAr : city.nameEn}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Refresh Weather Button */}
                    <button
                      onClick={() => {
                        playSynthSound(600, 'sine', 0.05);
                        refreshWeather();
                      }}
                      disabled={weatherLoading}
                      title={isRtl ? 'تحديث الطقس المباشر' : 'Refresh live weather'}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 hover:border-cyan-400 cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* °C / °F Switch */}
                    <button
                      onClick={() => setUseFahrenheit(!useFahrenheit)}
                      className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-cyan-600 dark:text-cyan-400 hover:border-cyan-400 cursor-pointer shrink-0"
                    >
                      {useFahrenheit ? '°F' : '°C'}
                    </button>
                  </div>
                </div>

                {/* Optional Quick GPS Link if not on GPS location */}
                {!liveWeather.isLiveLocation && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[11px] font-bold text-cyan-700 dark:text-cyan-300">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                      {isRtl ? 'الطقس الحالي لمدينة افتراضية' : 'Showing default city weather'}
                    </span>
                    <button
                      onClick={() => {
                        playSynthSound(700, 'sine', 0.08);
                        requestLocation();
                      }}
                      className="text-[10px] font-black underline hover:text-cyan-500 cursor-pointer"
                    >
                      {isRtl ? 'تحديد موقعي بدقة 📍' : 'Detect My GPS 📍'}
                    </button>
                  </div>
                )}

                {/* Primary Weather Hero Card */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
                  {/* Subtle Background Rings */}
                  <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-100">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isRtl ? `${currentCity.nameAr}، ${currentCity.countryAr}` : `${currentCity.nameEn}, ${currentCity.countryEn}`}</span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                        {displayTemp(currentCity.temp)}
                      </div>
                      <p className="text-xs font-bold text-cyan-100 mt-0.5">
                        {isRtl ? currentCity.conditionAr : currentCity.conditionEn}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
                        {getWeatherIcon(currentCity.type, 'w-7 h-7')}
                      </div>
                      <span className="text-[11px] text-cyan-100 font-medium mt-1">
                        {isRtl ? `المحسوسة: ${displayTemp(currentCity.feelsLike)}` : `Feels: ${displayTemp(currentCity.feelsLike)}`}
                      </span>
                    </div>
                  </div>

                  {/* Weather Vital Stats */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-100 font-bold">
                        <Droplets className="w-3 h-3" />
                        <span>{isRtl ? 'الرطوبة' : 'Humidity'}</span>
                      </div>
                      <span className="text-xs font-black mt-0.5">{currentCity.humidity}%</span>
                    </div>

                    <div className="flex flex-col items-center border-x border-white/20">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-100 font-bold">
                        <Wind className="w-3 h-3" />
                        <span>{isRtl ? 'الرياح' : 'Wind'}</span>
                      </div>
                      <span className="text-xs font-black mt-0.5">{currentCity.windSpeed} كم/س</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-100 font-bold">
                        <Sun className="w-3 h-3" />
                        <span>{isRtl ? 'مؤشر UV' : 'UV Index'}</span>
                      </div>
                      <span className="text-xs font-black mt-0.5">{currentCity.uvIndex}/10</span>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Forecast Pills */}
                <div>
                  <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-300 mb-2">
                    {isRtl ? 'توقعات الساعات القادمة' : 'Hourly Forecast'}
                  </h5>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {currentCity.hourly.map((h, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[58px] shrink-0 text-center"
                      >
                        <span className="text-[10px] text-slate-500">{h.time}</span>
                        <span className="text-sm">{h.icon}</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {displayTemp(h.temp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Day Forecast List */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                    {isRtl ? 'توقعات الـ 5 أيام القادمة' : '5-Day Forecast'}
                  </h5>
                  <div className="space-y-1.5">
                    {currentCity.forecast.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-slate-800 last:border-0"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 w-16">
                          {isRtl ? f.dayAr : f.dayEn}
                        </span>
                        <span className="text-base">{f.icon}</span>
                        <div className="flex items-center gap-2 font-black">
                          <span className="text-amber-600 dark:text-amber-400">{displayTemp(f.high)}</span>
                          <span className="text-slate-400 text-[10px]">{displayTemp(f.low)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
