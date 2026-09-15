import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Compass, 
  Sparkles, 
  Search, 
  Navigation, 
  Layers, 
  Info, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff, 
  Crosshair, 
  Download, 
  Share2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  Radio, 
  HelpCircle, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Orbit,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Globe2,
  Flame
} from 'lucide-react';
import { CelestialBody, MoonPhaseInfo, SkyEventAlert } from '../../types/sky';
import { AstronomyService } from '../../services/astronomy.service';
import LodaviaMascot from '../LodaviaMascot';

interface LodaviaSkyARProps {
  lang?: string;
  playSynthSound?: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  onClose?: () => void;
}

export default function LodaviaSkyAR({
  lang = 'ar',
  playSynthSound = () => {},
  onClose
}: LodaviaSkyARProps) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  // -------------------------------------------------------------
  // REFS & HARDWARE SENSORS STATE
  // -------------------------------------------------------------
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasCaptureRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera stream state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Observer Location State (Default: Riyadh / Cairo 24.7°N, 46.7°E)
  const [coords, setCoords] = useState<{ lat: number; lon: number; cityName: string }>({
    lat: 24.7136,
    lon: 46.6753,
    cityName: isAr ? 'الرياض (تحديد تلقائي)' : 'Riyadh (Auto Geo)'
  });
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'fallback'>('loading');

  // Device Orientation / Compass State (Heading 0-360, Pitch -90 to +90, Roll)
  const [heading, setHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(20); // 20 degrees above horizon
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [hasOrientationSensor, setHasOrientationSensor] = useState<boolean>(false);

  // Astronomical Data State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
  const [moonPhase, setMoonPhase] = useState<MoonPhaseInfo | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [skyEvents, setSkyEvents] = useState<SkyEventAlert[]>([]);

  // UI Interactive States
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [targetBody, setTargetBody] = useState<CelestialBody | null>(null); // "ابحث في السماء" Target Finder
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'planet' | 'star' | 'moon' | 'dso'>('all');
  
  // AR Layer Filter Toggles
  const [showConstellationLines, setShowConstellationLines] = useState<boolean>(true);
  const [showPlanetOrbits, setShowPlanetOrbits] = useState<boolean>(true);
  const [showDeepSky, setShowDeepSky] = useState<boolean>(true);
  const [showAzimuthGrid, setShowAzimuthGrid] = useState<boolean>(false);

  // Ray Mascot Assistant Dialogue
  const [showRayDialogue, setShowRayDialogue] = useState<boolean>(true);
  const [rayMessage, setRayMessage] = useState<{ ar: string; en: string }>({
    ar: 'أهلاً بك في سماء لودافيا! وجه هاتفك نحو السماء لاستكشاف الكواكب والنجوم بالواقع المعزز 🌌',
    en: 'Welcome to LODAVIA SKY! Point your phone towards the sky to explore live planets and stars in AR 🌌'
  });

  // Captured snapshot preview
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // -------------------------------------------------------------
  // 1. INITIALIZE GEOLOCATION (GPS)
  // -------------------------------------------------------------
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            cityName: `${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`
          });
          setLocationStatus('granted');
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using cosmic fallback:', err);
          setLocationStatus('fallback');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationStatus('fallback');
    }

    setSkyEvents(AstronomyService.getSkyEvents());
  }, []);

  // -------------------------------------------------------------
  // 2. INITIALIZE CAMERA STREAM
  // -------------------------------------------------------------
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        } else {
          setCameraError(isAr ? 'الكاميرا غير مدعومة في هذا المتصفح' : 'Camera not supported in browser');
        }
      } catch (err: any) {
        console.warn('Camera permission issue:', err);
        setCameraError(
          isAr 
            ? 'يرجى السماح بالوصول للكاميرا لتجربة الواقع المعزز AR، أو استمتع بوضع القبة السماوية التفاعلي.'
            : 'Please grant camera access for AR sky tracking, or use the interactive planetarium mode.'
        );
        setCameraActive(false);
      }
    }

    startCamera();

    // Cleanup: ALWAYS STOP CAMERA ON UNMOUNT
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // -------------------------------------------------------------
  // 3. INITIALIZE DEVICE ORIENTATION & GYROSCOPE
  // -------------------------------------------------------------
  useEffect(() => {
    let lastHeading = 0;
    let lastPitch = 20;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isManualMode) return;

      if (e.alpha !== null && e.beta !== null) {
        setHasOrientationSensor(true);

        // Alpha = compass heading (0 = North)
        // iOS provides webkitCompassHeading
        let currentHeading = 0;
        if ((e as any).webkitCompassHeading !== undefined) {
          currentHeading = (e as any).webkitCompassHeading;
        } else if (e.alpha !== null) {
          currentHeading = (360 - e.alpha) % 360;
        }

        // Beta = pitch (-90 looking down, 0 level, 90 looking up to sky)
        let currentPitch = e.beta || 0;

        // Smooth low-pass filter
        const smoothHeading = lastHeading * 0.7 + currentHeading * 0.3;
        const smoothPitch = lastPitch * 0.7 + currentPitch * 0.3;

        lastHeading = smoothHeading;
        lastPitch = smoothPitch;

        setHeading(Math.round(smoothHeading * 10) / 10);
        setPitch(Math.round(smoothPitch * 10) / 10);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isManualMode]);

  // -------------------------------------------------------------
  // 4. REAL-TIME CELESTIAL COMPUTATION LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    const updateSky = () => {
      const now = new Date();
      setCurrentTime(now);

      const skyResult = AstronomyService.calculateSkyState(
        coords.lat,
        coords.lon,
        now,
        heading,
        pitch,
        65, // 65 deg horizontal FOV
        75  // 75 deg vertical FOV
      );

      setCelestialBodies(skyResult.bodies);
      setMoonPhase(skyResult.moonPhase);
      setVisibleCount(skyResult.visibleCount);
    };

    updateSky();
    const interval = setInterval(updateSky, 120); // 8 FPS for ultra-smooth AR tracking

    return () => clearInterval(interval);
  }, [coords, heading, pitch]);

  // -------------------------------------------------------------
  // 5. TOUCH / DRAG MANUAL NAVIGATION FOR PHONES & DESKTOPS
  // -------------------------------------------------------------
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isManualMode) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    touchStartRef.current = { x: clientX, y: clientY };

    // Pan Heading (azimuth)
    setHeading((prev) => (prev - deltaX * 0.2 + 360) % 360);
    // Pan Pitch (altitude)
    setPitch((prev) => Math.max(-85, Math.min(85, prev + deltaY * 0.2)));
  };

  // -------------------------------------------------------------
  // 6. SNAPSHOT / AR PHOTO CAPTURE & EXPORT
  // -------------------------------------------------------------
  const handleCaptureSnapshot = () => {
    setIsCapturing(true);
    playSynthSound(800, 'sine', 0.15);

    setTimeout(() => {
      const canvas = canvasCaptureRef.current;
      const video = videoRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video?.videoWidth || 1280;
      canvas.height = video?.videoHeight || 720;

      // Draw camera video or gradient backdrop
      if (video && cameraActive) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#030712');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw AR Overlay Bodies
      celestialBodies.forEach((b) => {
        if (!b.inView || b.screenX === undefined || b.screenY === undefined) return;
        const x = (b.screenX / 100) * canvas.width;
        const y = (b.screenY / 100) * canvas.height;

        // Glowing circle
        ctx.beginPath();
        ctx.arc(x, y, b.type === 'sun' || b.type === 'moon' ? 24 : 12, 0, 2 * Math.PI);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 15;
        ctx.fill();

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(isAr ? b.nameAr : b.nameEn, x + 16, y + 6);
      });

      // LODAVIA SKY Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('LODAVIA SKY AR 🌌', 30, canvas.height - 40);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`${coords.cityName} • ${currentTime.toLocaleDateString()}`, 30, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setIsCapturing(false);
    }, 400);
  };

  // Download snapshot
  const handleDownloadSnapshot = () => {
    if (!capturedImage) return;
    playSynthSound(600, 'sine', 0.1);
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `lodavia-sky-${Date.now()}.png`;
    a.click();
  };

  // Select target from search list
  const handleSelectTarget = (body: CelestialBody) => {
    playSynthSound(650, 'sine', 0.1);
    setTargetBody(body);
    setSelectedBody(body);
    setShowSearchModal(false);

    setRayMessage({
      ar: `تم تفعيل بوصلة التوجيه نحو ${body.nameAr}! اتبع السهم الذهبي للوصول إليه 🎯`,
      en: `Guidance target set to ${body.nameEn}! Follow the golden arrow to locate it 🎯`
    });
  };

  // Calculate target arrow direction
  const getTargetGuidance = () => {
    if (!targetBody || targetBody.azimuth === undefined || targetBody.altitude === undefined) return null;

    let deltaAz = targetBody.azimuth - heading;
    deltaAz = ((((deltaAz + 180) % 360) + 360) % 360) - 180;
    const deltaAlt = targetBody.altitude - pitch;

    const isAligned = Math.abs(deltaAz) < 10 && Math.abs(deltaAlt) < 10;
    const angleRad = Math.atan2(deltaAlt, deltaAz);
    const angleDeg = (angleRad * 180) / Math.PI;

    return {
      deltaAz,
      deltaAlt,
      isAligned,
      angleDeg
    };
  };

  const guidance = getTargetGuidance();

  return (
    <div 
      id="lodavia-sky-ar-container"
      className="relative w-full h-[90vh] md:h-[88vh] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-cyan-500/30 shadow-2xl flex flex-col justify-between select-none font-sans"
      dir={isAr ? 'rtl' : 'ltr'}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
    >
      {/* ----------------- HIDDEN CAPTURE CANVAS ----------------- */}
      <canvas ref={canvasCaptureRef} className="hidden" />

      {/* ----------------- CAMERA VIDEO STREAM OR COSMIC DOME ----------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Fallback Cosmic Starlight Dome (when camera is off/denied) */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-[#080d21] to-[#040714] flex items-center justify-center">
            {/* Ambient Star particles */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-40 animate-pulse" />
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Glassmorphic Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
      </div>

      {/* ----------------- AR RETICLE / CENTER CROSSHAIR ----------------- */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="relative flex items-center justify-center w-28 h-28 border border-white/20 rounded-full backdrop-blur-[1px]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          
          {/* Compass Cross Ticks */}
          <div className="absolute -top-3 w-0.5 h-2.5 bg-cyan-400" />
          <div className="absolute -bottom-3 w-0.5 h-2.5 bg-cyan-400" />
          <div className="absolute -left-3 w-2.5 h-0.5 bg-cyan-400" />
          <div className="absolute -right-3 w-2.5 h-0.5 bg-cyan-400" />
        </div>
      </div>

      {/* ----------------- AR CELESTIAL BODIES LAYER ----------------- */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {celestialBodies.map((body) => {
          if (!body.inView || body.screenX === undefined || body.screenY === undefined) return null;

          const isSelected = selectedBody?.id === body.id;
          const isTarget = targetBody?.id === body.id;

          return (
            <motion.div
              key={body.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                left: `${body.screenX}%`,
                top: `${body.screenY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center gap-1.5 transition-transform hover:scale-125"
              onClick={() => {
                playSynthSound(700, 'sine', 0.08);
                setSelectedBody(body);
                setRayMessage({
                  ar: `${body.nameAr}: ${body.descriptionAr}`,
                  en: `${body.nameEn}: ${body.descriptionEn}`
                });
              }}
            >
              {/* Target Locked Pulse Halo */}
              {isTarget && (
                <div className="absolute -inset-3 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
              )}

              {/* Celestial Orb / Icon Glow */}
              <div 
                className={`relative flex items-center justify-center rounded-full p-2 transition-all ${
                  isSelected 
                    ? 'ring-4 ring-cyan-400 scale-125 bg-slate-900/90 shadow-[0_0_30px_rgba(6,182,212,0.8)]' 
                    : 'bg-slate-900/70 border border-white/30 backdrop-blur-md shadow-lg'
                }`}
                style={{ borderColor: body.color }}
              >
                <span className="text-xl sm:text-2xl drop-shadow-md">{body.icon}</span>
              </div>

              {/* Holographic Name Tag */}
              <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/20 text-[10px] sm:text-xs font-bold text-white shadow-xl backdrop-blur-md whitespace-nowrap flex items-center gap-1">
                <span style={{ color: body.color }}>●</span>
                <span>{isAr ? body.nameAr : body.nameEn}</span>
                {body.altitude !== undefined && (
                  <span className="text-[9px] text-cyan-300 font-mono">
                    {body.altitude > 0 ? `+${Math.round(body.altitude)}°` : `${Math.round(body.altitude)}°`}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ----------------- TOP HEADER & COMPASS BAR ----------------- */}
      <div className="relative z-30 p-4 sm:p-5 flex items-center justify-between gap-2 backdrop-blur-md bg-slate-950/60 border-b border-white/10 text-white">
        {/* Left: App Identity & Live Coordinates */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Orbit className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {isAr ? 'سماء لودافيا AR' : 'LODAVIA SKY AR'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300">
                LIVE
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-300 font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>{Math.round(heading)}° {heading > 315 || heading <= 45 ? 'N' : heading <= 135 ? 'E' : heading <= 225 ? 'S' : 'W'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[120px]">{coords.cityName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Target Search Button ("ابحث في السماء") */}
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setShowSearchModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'ابحث في السماء' : 'Find Object'}</span>
          </button>

          {/* Gyro / Manual Toggle Button */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setIsManualMode(!isManualMode);
            }}
            className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
              isManualMode
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-white/10 border-white/15 hover:bg-white/20 text-white'
            }`}
            title={isManualMode ? (isAr ? 'التحكم اليدوي مفعل (اسحب للتدوير)' : 'Manual Drag Mode') : (isAr ? 'التتبع بمستشعرات الهاتف' : 'Sensor Gyro Active')}
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Camera Flip / Toggle */}
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md transition-all cursor-pointer"
            title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
          >
            <Camera className="w-4 h-4 text-cyan-300" />
          </button>

          {/* Close Sky View if modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/30 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ----------------- AR TARGET GUIDANCE POINTER ----------------- */}
      {guidance && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          {guidance.isAligned ? (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-2xl bg-emerald-500/90 border border-emerald-300 text-white text-xs font-black shadow-[0_0_30px_rgba(16,185,129,0.8)] backdrop-blur-md flex items-center gap-2 animate-bounce"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? `🎯 تم العثور على ${targetBody?.nameAr} في الكاميرا!` : `🎯 ${targetBody?.nameEn} Locked in view!`}</span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-400/60 text-amber-300 text-xs font-black shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold"
                  style={{ transform: `rotate(${guidance.angleDeg}deg)` }}
                >
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                </div>
                <span>
                  {isAr 
                    ? `توجّه نحو: ${targetBody?.nameAr} (${Math.abs(Math.round(guidance.deltaAz))}° ${guidance.deltaAz > 0 ? 'يمين' : 'يسار'})`
                    : `Turn toward ${targetBody?.nameEn} (${Math.abs(Math.round(guidance.deltaAz))}° ${guidance.deltaAz > 0 ? 'Right' : 'Left'})`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- RAY MASCOT MINI COMPANION DIALOGUE ----------------- */}
      <AnimatePresence>
        {showRayDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 p-3.5 rounded-3xl bg-slate-950/85 border border-cyan-400/40 backdrop-blur-2xl shadow-2xl flex items-start gap-3 text-white"
          >
            {/* Mini Ray Mascot Avatar */}
            <div className="shrink-0">
              <LodaviaMascot size={48} animated interactive state="speaking" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Ray • {isAr ? 'المساعد الفلكي' : 'Cosmic Assistant'}
                </span>
                <button
                  onClick={() => setShowRayDialogue(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {isAr ? rayMessage.ar : rayMessage.en}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- BOTTOM INTERACTIVE CONTROL BAR ----------------- */}
      <div className="relative z-30 p-4 sm:p-5 flex items-center justify-between gap-3 backdrop-blur-xl bg-slate-950/75 border-t border-white/10 text-white">
        {/* Left: Quick Celestial Stats Summary */}
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? `${visibleCount} جرم مرئي الآن` : `${visibleCount} Bodies Above Horizon`}</span>
          </div>

          {moonPhase && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>{moonPhase.illuminationPercent}% {isAr ? moonPhase.phaseNameAr : moonPhase.phaseNameEn}</span>
            </div>
          )}
        </div>

        {/* Center: AR SNAPSHOT BUTTON */}
        <div className="flex items-center gap-3">
          <button
            id="btn-sky-snapshot"
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/80"
            title={isAr ? 'التقاط صورة مع طبقة AR' : 'Capture AR Snapshot'}
          >
            <Camera className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right: Quick Guide & Events Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setShowRayDialogue(true);
              setRayMessage({
                ar: `أبرز الأحداث الفلكية: ذروة شهب البرشاويات وظهور المشتري وزحل بوضوح الليلة! ☄️🪐`,
                en: `Highlights: Perseids meteor peak & bright Jupiter-Saturn conjunction tonight! ☄️🪐`
              });
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-300 transition-all cursor-pointer"
            title={isAr ? 'أحداث السماء الليلة' : 'Tonight Sky Events'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ----------------- MODAL 1: CELESTIAL OBJECT DETAIL GLASS CARD ----------------- */}
      <AnimatePresence>
        {selectedBody && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-white/15 p-6 backdrop-blur-2xl shadow-2xl text-white flex flex-col gap-5 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-lg"
                    style={{ borderColor: selectedBody.color, backgroundColor: `${selectedBody.color}15` }}
                  >
                    {selectedBody.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">
                        {isAr ? selectedBody.nameAr : selectedBody.nameEn}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-cyan-300">
                        {selectedBody.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedBody.constellationAr ? (isAr ? `كوكبة ${selectedBody.constellationAr}` : selectedBody.constellationEn) : selectedBody.distanceAuOrKm || 'Deep Space'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBody(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'الارتفاع (Altitude)' : 'Altitude'}</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">
                    {selectedBody.altitude !== undefined ? `${selectedBody.altitude.toFixed(1)}°` : '--'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'السمت (Azimuth)' : 'Azimuth'}</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">
                    {selectedBody.azimuth !== undefined ? `${selectedBody.azimuth.toFixed(1)}°` : '--'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'اللمعان (Mag)' : 'Magnitude'}</span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {selectedBody.magnitude}
                  </span>
                </div>
              </div>

              {/* Description & Facts */}
              <div className="space-y-2">
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isAr ? selectedBody.descriptionAr : selectedBody.descriptionEn}
                </p>

                {selectedBody.factsAr && selectedBody.factsAr.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 space-y-1.5">
                    <span className="font-bold flex items-center gap-1 text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAr ? 'حقائق علمية وفلكية:' : 'Astronomical Facts:'}
                    </span>
                    {(isAr ? selectedBody.factsAr : selectedBody.factsEn).map((f, i) => (
                      <p key={i} className="text-[11px] text-slate-300 leading-normal">• {f}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Lock Action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectTarget(selectedBody)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>{isAr ? 'تتبع هذا الجرم بالبوصلة 🎯' : 'Track with AR Pointer 🎯'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL 2: SEARCH IN THE SKY MODAL ----------------- */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-950/95 border border-white/15 p-6 backdrop-blur-2xl shadow-2xl text-white flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {isAr ? 'ابحث في قبة السماء' : 'Search the Celestial Dome'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'اختر أي كوكب أو نجم لتوجيه الكاميرا نحوه' : 'Select a planet or star to track with AR'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Query Input */}
              <div className="relative">
                <Search className="absolute top-3 left-3 rtl:right-3 rtl:left-auto w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن القمر، المشتري، الشعرى، الجبار...' : 'Search Moon, Jupiter, Sirius, Orion...'}
                  className="w-full pl-9 rtl:pr-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'planet', labelAr: 'الكواكب 🪐', labelEn: 'Planets 🪐' },
                  { id: 'star', labelAr: 'النجوم ⭐', labelEn: 'Stars ⭐' },
                  { id: 'moon', labelAr: 'القمر 🌙', labelEn: 'Moon 🌙' },
                  { id: 'dso', labelAr: 'السدم والمجرات 🌌', labelEn: 'Deep Sky 🌌' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>

              {/* Filtered Celestial List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {celestialBodies
                  .filter(b => {
                    const matchesCategory = selectedCategoryFilter === 'all' || b.type === selectedCategoryFilter;
                    const matchesQuery = !searchQuery.trim() || 
                      b.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (b.constellationAr && b.constellationAr.toLowerCase().includes(searchQuery.toLowerCase()));
                    return matchesCategory && matchesQuery;
                  })
                  .map(body => (
                    <div
                      key={body.id}
                      onClick={() => handleSelectTarget(body)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-400/40 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{body.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-white">{isAr ? body.nameAr : body.nameEn}</h4>
                          <span className="text-[10px] text-slate-400">
                            {body.altitude !== undefined 
                              ? (body.altitude > 0 ? (isAr ? `فوق الأفق (${Math.round(body.altitude)}°)` : `Above Horizon (${Math.round(body.altitude)}°)`) : (isAr ? 'تحت الأفق حالياً' : 'Below Horizon')) 
                              : body.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300">
                          {isAr ? 'تتبع 🎯' : 'Track 🎯'}
                        </span>
                        <ArrowIcon className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL 3: SNAPSHOT PREVIEW & SHARE ----------------- */}
      <AnimatePresence>
        {capturedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-950 border border-cyan-400/40 p-5 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between text-white">
                <span className="text-sm font-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {isAr ? 'صورة سماء لودافيا الملتقطة 🌌' : 'Captured LODAVIA SKY Photo 🌌'}
                </span>
                <button 
                  onClick={() => setCapturedImage(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg aspect-video bg-black">
                <img src={capturedImage} alt="AR Snapshot" className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadSnapshot}
                  className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? 'حفظ الصورة في الجهاز' : 'Save Image'}</span>
                </button>

                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    setCapturedImage(null);
                  }}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
