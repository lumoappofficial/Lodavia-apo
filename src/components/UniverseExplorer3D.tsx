import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { 
  Globe, 
  Sparkles, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft, 
  ArrowRight,
  Info, 
  Compass, 
  Radio, 
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Navigation,
  Flame,
  Zap,
  Rocket,
  Activity,
  Gauge,
  Thermometer,
  Wind,
  MoveUp,
  Play,
  RefreshCw
} from 'lucide-react';
import CelestialBodyDetailPanel from './CelestialBodyDetailPanel';

export interface CelestialBodyInfo {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  diameterKm: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  surfaceGravity: string;
  avgTemp: string;
  moonsCount: string;
  color: string;
  factEn: string;
  factAr: string;
  radius3D: number;
  orbitDist3D: number;
  orbitSpeed: number;

  // Numerical physics parameters
  surfaceGravityVal: number; // m/s²
  radiusKmVal: number; // km
  massKg: number; // kg
  atmosphericPressurePa: number; // Pa
  surfaceTemperatureC: number; // °C
  baseTemperatureC: number; // °C
  solarDistanceKmVal: number; // km
  dayNightTemperatureFactor: number; // °C variation
  escapeVelocityMs: number; // m/s
  rotationPeriodSeconds: number; // s
  orbitalPeriodSeconds: number; // s
  distanceFromStarKm: number; // km
  atmosphereDensityKgM3: number; // kg/m³
  hasAtmosphere: boolean;
  scaleHeightM: number; // m
}

const CELESTIAL_BODIES: CelestialBodyInfo[] = [
  {
    id: 'sun',
    nameEn: 'The Sun',
    nameAr: 'الشمس ☀️',
    typeEn: 'Yellow Dwarf Star (G2V)',
    typeAr: 'نجم قزم أصفر (G2V)',
    diameterKm: '1,392,700 km',
    distanceFromSun: '0 km (Center)',
    orbitalPeriod: 'N/A (Galactic Center: 230M yrs)',
    rotationPeriod: '25-35 Days',
    surfaceGravity: '274 m/s² (28x Earth)',
    avgTemp: '5,500°C (Core: 15 Million°C)',
    moonsCount: '8 Planets & System Bodies',
    color: '#f59e0b',
    factEn: 'The Sun holds 99.86% of the total mass of the entire Solar System.',
    factAr: 'تحتوي الشمس على 99.86% من كتلة المجموعة الشمسية بأكملها.',
    radius3D: 5.2,
    orbitDist3D: 0,
    orbitSpeed: 0,
    surfaceGravityVal: 274.0,
    radiusKmVal: 696340,
    massKg: 1.989e30,
    atmosphericPressurePa: 100000,
    surfaceTemperatureC: 5500,
    baseTemperatureC: 5500,
    solarDistanceKmVal: 0,
    dayNightTemperatureFactor: 0,
    escapeVelocityMs: 617700,
    rotationPeriodSeconds: 2160000,
    orbitalPeriodSeconds: 7.25e15,
    distanceFromStarKm: 0,
    atmosphereDensityKgM3: 0.2,
    hasAtmosphere: true,
    scaleHeightM: 500000
  },
  {
    id: 'mercury',
    nameEn: 'Mercury',
    nameAr: 'عطارد 🪨',
    typeEn: 'Terrestrial Planet',
    typeAr: 'كوكب صخري',
    diameterKm: '4,879 km',
    distanceFromSun: '57.9 Million km',
    orbitalPeriod: '88 Days',
    rotationPeriod: '59 Days',
    surfaceGravity: '3.7 m/s²',
    avgTemp: '-180°C to 430°C',
    moonsCount: '0',
    color: '#a8a29e',
    factEn: 'Mercury has extreme temperature swings, from -180°C at night to 430°C in daytime.',
    factAr: 'يملك عطارد أشد التغيرات الحرارية قسوة، من -180°C ليلاً إلى 430°C نهاراً.',
    radius3D: 0.8,
    orbitDist3D: 11,
    orbitSpeed: 0.025,
    surfaceGravityVal: 3.7,
    radiusKmVal: 2439.7,
    massKg: 3.3011e23,
    atmosphericPressurePa: 1e-9,
    surfaceTemperatureC: 167,
    baseTemperatureC: 167,
    solarDistanceKmVal: 57909050,
    dayNightTemperatureFactor: 300,
    escapeVelocityMs: 4250,
    rotationPeriodSeconds: 5067000,
    orbitalPeriodSeconds: 7600520,
    distanceFromStarKm: 57909050,
    atmosphereDensityKgM3: 1e-11,
    hasAtmosphere: false,
    scaleHeightM: 15000
  },
  {
    id: 'venus',
    nameEn: 'Venus',
    nameAr: 'الزهراء 🟡',
    typeEn: 'Terrestrial Volcanic Planet',
    typeAr: 'كوكب صخري بركاني',
    diameterKm: '12,104 km',
    distanceFromSun: '108.2 Million km',
    orbitalPeriod: '225 Days',
    rotationPeriod: '243 Days (Retrograde)',
    surfaceGravity: '8.87 m/s²',
    avgTemp: '464°C',
    moonsCount: '0',
    color: '#eab308',
    factEn: 'Venus is the hottest planet in our solar system due to a runaway greenhouse effect.',
    factAr: 'الزهراء هو أشد كواكب المجموعة الشمسية حرارة بسبب ظاهرة الاحتباس الحراري الفائق.',
    radius3D: 1.35,
    orbitDist3D: 17,
    orbitSpeed: 0.018,
    surfaceGravityVal: 8.87,
    radiusKmVal: 6051.8,
    massKg: 4.8675e24,
    atmosphericPressurePa: 9200000,
    surfaceTemperatureC: 464,
    baseTemperatureC: 464,
    solarDistanceKmVal: 108208000,
    dayNightTemperatureFactor: 5,
    escapeVelocityMs: 10360,
    rotationPeriodSeconds: 20996800,
    orbitalPeriodSeconds: 19414166,
    distanceFromStarKm: 108208000,
    atmosphereDensityKgM3: 65.0,
    hasAtmosphere: true,
    scaleHeightM: 15900
  },
  {
    id: 'earth',
    nameEn: 'Earth',
    nameAr: 'الأرض 🌍',
    typeEn: 'Terrestrial Ocean Planet (Home)',
    typeAr: 'كوكب صخري محيطي (كوكبنا)',
    diameterKm: '12,742 km',
    distanceFromSun: '149.6 Million km (1 AU)',
    orbitalPeriod: '365.25 Days',
    rotationPeriod: '23h 56m',
    surfaceGravity: '9.81 m/s²',
    avgTemp: '15°C (-88°C to 58°C)',
    moonsCount: '1 (The Moon)',
    color: '#06b6d4',
    factEn: 'Earth is the only known celestial body confirmed to harbor liquid surface oceans and life.',
    factAr: 'الأرض هي الجرم السماوي الوحيد المعروف في الكون المؤكد احتواؤه على محيطات سائلة وحياة.',
    radius3D: 1.5,
    orbitDist3D: 25,
    orbitSpeed: 0.012,
    surfaceGravityVal: 9.80665,
    radiusKmVal: 6371.0,
    massKg: 5.9722e24,
    atmosphericPressurePa: 101325,
    surfaceTemperatureC: 15,
    baseTemperatureC: 15,
    solarDistanceKmVal: 149598023,
    dayNightTemperatureFactor: 15,
    escapeVelocityMs: 11186,
    rotationPeriodSeconds: 86164,
    orbitalPeriodSeconds: 31558150,
    distanceFromStarKm: 149598023,
    atmosphereDensityKgM3: 1.225,
    hasAtmosphere: true,
    scaleHeightM: 8500
  },
  {
    id: 'moon',
    nameEn: 'The Moon',
    nameAr: 'القمر 🌙',
    typeEn: 'Natural Satellite',
    typeAr: 'قمر طبيعي تابع للأرض',
    diameterKm: '3,474 km',
    distanceFromSun: '384,400 km from Earth',
    orbitalPeriod: '27.3 Days around Earth',
    rotationPeriod: '27.3 Days (Tidally Locked)',
    surfaceGravity: '1.62 m/s² (1/6th Earth)',
    avgTemp: '-130°C to 120°C',
    moonsCount: 'N/A',
    color: '#cbd5e1',
    factEn: 'The Moon is tidally locked to Earth, meaning the exact same side always faces us.',
    factAr: 'القمر مقيد مدرياً بالأرض، مما يعني أن نفس الوجه يواجه أرضنا دائماً.',
    radius3D: 0.5,
    orbitDist3D: 25, // Relative to Earth
    orbitSpeed: 0.04,
    surfaceGravityVal: 1.62,
    radiusKmVal: 1737.4,
    massKg: 7.342e22,
    atmosphericPressurePa: 3e-10,
    surfaceTemperatureC: -20,
    baseTemperatureC: -20,
    solarDistanceKmVal: 149598023,
    dayNightTemperatureFactor: 130,
    escapeVelocityMs: 2380,
    rotationPeriodSeconds: 2360591,
    orbitalPeriodSeconds: 2360591,
    distanceFromStarKm: 149598023,
    atmosphereDensityKgM3: 1e-12,
    hasAtmosphere: false,
    scaleHeightM: 60000
  },
  {
    id: 'mars',
    nameEn: 'Mars',
    nameAr: 'المريخ 🔴',
    typeEn: 'Terrestrial Planet (Red Planet)',
    typeAr: 'كوكب صخري (الكوكب الأحمر)',
    diameterKm: '6,779 km',
    distanceFromSun: '227.9 Million km',
    orbitalPeriod: '687 Days',
    rotationPeriod: '24h 37m',
    surfaceGravity: '3.72 m/s²',
    avgTemp: '-63°C (-140°C to 20°C)',
    moonsCount: '2 (Phobos & Deimos)',
    color: '#ef4444',
    factEn: 'Mars hosts Olympus Mons, the largest volcano in the solar system, standing 21.9 km tall.',
    factAr: 'يضم المريخ بركان أوليمبوس، أكبر بركان في المجموعة الشمسية بارتفاع 21.9 كم.',
    radius3D: 0.95,
    orbitDist3D: 34,
    orbitSpeed: 0.009,
    surfaceGravityVal: 3.72,
    radiusKmVal: 3389.5,
    massKg: 6.4171e23,
    atmosphericPressurePa: 610,
    surfaceTemperatureC: -63,
    baseTemperatureC: -63,
    solarDistanceKmVal: 227939200,
    dayNightTemperatureFactor: 50,
    escapeVelocityMs: 5027,
    rotationPeriodSeconds: 88642,
    orbitalPeriodSeconds: 59355072,
    distanceFromStarKm: 227939200,
    atmosphereDensityKgM3: 0.020,
    hasAtmosphere: true,
    scaleHeightM: 11100
  },
  {
    id: 'jupiter',
    nameEn: 'Jupiter',
    nameAr: 'المشتري 🟠',
    typeEn: 'Gas Giant',
    typeAr: 'عملاق غازي',
    diameterKm: '139,820 km',
    distanceFromSun: '778.5 Million km',
    orbitalPeriod: '11.86 Years',
    rotationPeriod: '9h 55m',
    surfaceGravity: '24.79 m/s²',
    avgTemp: '-110°C',
    moonsCount: '95',
    color: '#f97316',
    factEn: 'Jupiter’s Great Red Spot is a legendary storm bigger than Earth that has raged for centuries.',
    factAr: 'البقعة الحمراء العظيمة على المشتري هي عاصفة عملاقة أكبر من حجم الأرض تزمجر منذ قرون.',
    radius3D: 3.1,
    orbitDist3D: 47,
    orbitSpeed: 0.005,
    surfaceGravityVal: 24.79,
    radiusKmVal: 69911,
    massKg: 1.8982e27,
    atmosphericPressurePa: 200000,
    surfaceTemperatureC: -110,
    baseTemperatureC: -110,
    solarDistanceKmVal: 778570000,
    dayNightTemperatureFactor: 10,
    escapeVelocityMs: 59500,
    rotationPeriodSeconds: 35730,
    orbitalPeriodSeconds: 374335776,
    distanceFromStarKm: 778570000,
    atmosphereDensityKgM3: 0.16,
    hasAtmosphere: true,
    scaleHeightM: 27000
  },
  {
    id: 'saturn',
    nameEn: 'Saturn',
    nameAr: 'زحل 🪐',
    typeEn: 'Gas Giant with Rings',
    typeAr: 'عملاق غازي ذو حلقات',
    diameterKm: '116,460 km',
    distanceFromSun: '1.43 Billion km',
    orbitalPeriod: '29.45 Years',
    rotationPeriod: '10h 33m',
    surfaceGravity: '10.44 m/s²',
    avgTemp: '-140°C',
    moonsCount: '146',
    color: '#fde047',
    factEn: 'Saturn’s iconic ring system is made almost entirely of pure water ice and rocky debris.',
    factAr: 'نظام حلقات زحل الأيقوني مكون بالكامل تقريباً من جزيئات جليد الماء النقي والشظايا الصخرية.',
    radius3D: 2.6,
    orbitDist3D: 62,
    orbitSpeed: 0.0035,
    surfaceGravityVal: 10.44,
    radiusKmVal: 58232,
    massKg: 5.6834e26,
    atmosphericPressurePa: 140000,
    surfaceTemperatureC: -140,
    baseTemperatureC: -140,
    solarDistanceKmVal: 1433530000,
    dayNightTemperatureFactor: 8,
    escapeVelocityMs: 35500,
    rotationPeriodSeconds: 37980,
    orbitalPeriodSeconds: 928923000,
    distanceFromStarKm: 1433530000,
    atmosphereDensityKgM3: 0.19,
    hasAtmosphere: true,
    scaleHeightM: 59500
  },
  {
    id: 'uranus',
    nameEn: 'Uranus',
    nameAr: 'أورانوس 🩵',
    typeEn: 'Ice Giant',
    typeAr: 'عملاق جليدي',
    diameterKm: '50,724 km',
    distanceFromSun: '2.87 Billion km',
    orbitalPeriod: '84 Years',
    rotationPeriod: '17h 14m (Retrograde)',
    surfaceGravity: '8.69 m/s²',
    avgTemp: '-195°C',
    moonsCount: '28',
    color: '#22d3ee',
    factEn: 'Uranus rotates virtually on its side with an extreme axial tilt of 97.8 degrees.',
    factAr: 'يدور أورانوس تقريباً على جانبه بميل محوري قاسي يبلغ 97.8 درجة.',
    radius3D: 1.9,
    orbitDist3D: 76,
    orbitSpeed: 0.0022,
    surfaceGravityVal: 8.69,
    radiusKmVal: 25362,
    massKg: 8.6810e25,
    atmosphericPressurePa: 120000,
    surfaceTemperatureC: -195,
    baseTemperatureC: -195,
    solarDistanceKmVal: 2870972200,
    dayNightTemperatureFactor: 5,
    escapeVelocityMs: 21300,
    rotationPeriodSeconds: 62064,
    orbitalPeriodSeconds: 2651486400,
    distanceFromStarKm: 2870972200,
    atmosphereDensityKgM3: 0.42,
    hasAtmosphere: true,
    scaleHeightM: 27700
  },
  {
    id: 'neptune',
    nameEn: 'Neptune',
    nameAr: 'نبتون 🔵',
    typeEn: 'Ice Giant',
    typeAr: 'عملاق جليدي عميق',
    diameterKm: '49,244 km',
    distanceFromSun: '4.50 Billion km',
    orbitalPeriod: '164.8 Years',
    rotationPeriod: '16h 6m',
    surfaceGravity: '11.15 m/s²',
    avgTemp: '-200°C',
    moonsCount: '16',
    color: '#3b82f6',
    factEn: 'Neptune experiences the fastest recorded winds in the solar system, up to 2,100 km/h.',
    factAr: 'يملك نبتون أسرع رياح تم تسجيلها في المجموعة الشمسية، حيث تصل إلى 2,100 كم/ساعة.',
    radius3D: 1.8,
    orbitDist3D: 90,
    orbitSpeed: 0.0015,
    surfaceGravityVal: 11.15,
    radiusKmVal: 24622,
    massKg: 1.02413e26,
    atmosphericPressurePa: 110000,
    surfaceTemperatureC: -200,
    baseTemperatureC: -200,
    solarDistanceKmVal: 4495060000,
    dayNightTemperatureFactor: 4,
    escapeVelocityMs: 23500,
    rotationPeriodSeconds: 57960,
    orbitalPeriodSeconds: 5200000000,
    distanceFromStarKm: 4495060000,
    atmosphereDensityKgM3: 0.45,
    hasAtmosphere: true,
    scaleHeightM: 20000
  }
];

// High Quality Procedural Canvas Texture Generators with Astronomical Detail & Bump Maps

function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#fffbeb');
  grad.addColorStop(0.15, '#f59e0b');
  grad.addColorStop(0.4, '#d97706');
  grad.addColorStop(0.75, '#b45309');
  grad.addColorStop(1, '#78350f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Solar flares & convective granulations
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = Math.random() * 10 + 2;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 252, 220, 0.45)' : 'rgba(190, 45, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark sunspots with penumbra
  for (let i = 0; i < 20; i++) {
    const sx = Math.random() * 2048;
    const sy = 200 + Math.random() * 624;
    ctx.fillStyle = 'rgba(100, 25, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 22 + Math.random() * 25, 12 + Math.random() * 15, Math.random(), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(30, 5, 0, 0.9)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 10 + Math.random() * 10, 5 + Math.random() * 8, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createEarthTexture(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture; spec: THREE.CanvasTexture } {
  const width = 2048;
  const height = 1024;

  // 1. COLOR MAP (Albedo)
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext('2d')!;

  // Deep realistic ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0c2238');
  oceanGrad.addColorStop(0.3, '#0d3861');
  oceanGrad.addColorStop(0.5, '#0f487e');
  oceanGrad.addColorStop(0.7, '#0d3861');
  oceanGrad.addColorStop(1, '#08192b');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Shallow ocean shelves around coastlines
  const drawShelf = (cx: number, cy: number, rx: number, ry: number) => {
    ctx.fillStyle = 'rgba(14, 116, 144, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 1.12, ry * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // 2. BUMP MAP (Topography)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#000000'; // Black oceans = 0 height
  bCtx.fillRect(0, 0, width, height);

  // 3. SPECULAR MAP (Water reflectivity)
  const specCanvas = document.createElement('canvas');
  specCanvas.width = width;
  specCanvas.height = height;
  const sCtx = specCanvas.getContext('2d')!;
  sCtx.fillStyle = '#ffffff'; // White oceans = 100% mirror shiny water
  sCtx.fillRect(0, 0, width, height);

  // Draw Realistic Detailed Continents
  const drawLand = (cx: number, cy: number, rx: number, ry: number, cCenter: string, cEdge: string, isDesert: boolean = false) => {
    drawShelf(cx, cy, rx, ry);

    // Color
    const grad = ctx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, rx);
    grad.addColorStop(0, cCenter);
    grad.addColorStop(0.7, cEdge);
    grad.addColorStop(1, '#1b432a');
    ctx.fillStyle = grad;

    // Bump
    const bGrad = bCtx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, rx);
    bGrad.addColorStop(0, '#ffffff');
    bGrad.addColorStop(0.8, '#888888');
    bGrad.addColorStop(1, '#000000');
    bCtx.fillStyle = bGrad;

    // Specular (Land is matte = black)
    sCtx.fillStyle = '#000000';

    ctx.beginPath();
    bCtx.beginPath();
    sCtx.beginPath();

    for (let a = 0; a < Math.PI * 2; a += 0.08) {
      const noise = 0.72 + Math.sin(a * 7) * 0.15 + Math.cos(a * 4) * 0.12 + Math.sin(a * 12) * 0.06;
      const x = cx + Math.cos(a) * rx * noise;
      const y = cy + Math.sin(a) * ry * noise;

      if (a === 0) {
        ctx.moveTo(x, y);
        bCtx.moveTo(x, y);
        sCtx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        bCtx.lineTo(x, y);
        sCtx.lineTo(x, y);
      }
    }

    ctx.closePath(); ctx.fill();
    bCtx.closePath(); bCtx.fill();
    sCtx.closePath(); sCtx.fill();

    // Mountain Ridges
    if (!isDesert) {
      ctx.fillStyle = '#525252';
      bCtx.fillStyle = '#ffffff';
      for (let m = 0; m < 5; m++) {
        const mx = cx + (Math.random() - 0.5) * rx * 0.8;
        const my = cy + (Math.random() - 0.5) * ry * 0.8;
        ctx.beginPath(); ctx.arc(mx, my, rx * 0.12, 0, Math.PI * 2); ctx.fill();
        bCtx.beginPath(); bCtx.arc(mx, my, rx * 0.12, 0, Math.PI * 2); bCtx.fill();
      }
    }
  };

  // Eurasia & Europe
  drawLand(1240, 360, 360, 220, '#3f7042', '#2d5231');
  // Africa & Sahara
  drawLand(1120, 540, 180, 240, '#d4a359', '#3f7042', true);
  // North America
  drawLand(600, 400, 240, 260, '#3f7042', '#d4a359');
  // South America Amazon
  drawLand(720, 720, 170, 220, '#1c5e2d', '#2d5231');
  // Australia & Oceania
  drawLand(1680, 720, 130, 90, '#c78438', '#3f7042', true);

  // Polar Ice Caps
  ctx.fillStyle = '#f8fafc';
  bCtx.fillStyle = '#ffffff';
  sCtx.fillStyle = '#333333';

  ctx.fillRect(0, 0, width, 64);
  ctx.fillRect(0, height - 84, width, 84);
  bCtx.fillRect(0, 0, width, 64);
  bCtx.fillRect(0, height - 84, width, 84);
  sCtx.fillRect(0, 0, width, 64);
  sCtx.fillRect(0, height - 84, width, 84);

  const colorTex = new THREE.CanvasTexture(colorCanvas); colorTex.wrapS = THREE.RepeatWrapping;
  const bumpTex = new THREE.CanvasTexture(bumpCanvas); bumpTex.wrapS = THREE.RepeatWrapping;
  const specTex = new THREE.CanvasTexture(specCanvas); specTex.wrapS = THREE.RepeatWrapping;

  return { color: colorTex, bump: bumpTex, spec: specTex };
}

function createEarthNightTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const drawCityCluster = (cx: number, cy: number, radius: number, density: number) => {
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      const alpha = 0.6 + Math.random() * 0.4;
      ctx.fillStyle = Math.random() > 0.15 ? `rgba(251, 191, 36, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
      ctx.fillRect(x, y, 2, 2);
    }
  };

  // Major Cities
  drawCityCluster(600, 360, 100, 350);  // US East/West
  drawCityCluster(1080, 320, 90, 450);  // Europe
  drawCityCluster(1120, 480, 50, 200);  // Nile Delta & Gulf
  drawCityCluster(1400, 440, 80, 400);  // India
  drawCityCluster(1560, 380, 110, 550); // East China & Japan
  drawCityCluster(720, 760, 60, 180);   // South America
  drawCityCluster(1700, 740, 50, 140);   // Australia

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createEarthCloudTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

  for (let i = 0; i < 280; i++) {
    const x = Math.random() * width;
    const y = 80 + Math.random() * (height - 160);
    const rx = 80 + Math.random() * 220;
    const ry = 20 + Math.random() * 50;
    const rot = (Math.random() - 0.5) * 0.4;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Highland gray base
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 256);

  // Dark Lunar Maria (Basaltic Plains)
  ctx.fillStyle = '#475569';
  const drawMaria = (cx: number, cy: number, rx: number, ry: number) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMaria(180, 100, 50, 35); // Sea of Tranquility
  drawMaria(240, 90, 45, 40);  // Sea of Serenity
  drawMaria(140, 130, 60, 45); // Oceanus Procellarum
  drawMaria(320, 150, 30, 25);

  // Impact Craters with bright rims & ejecta rays
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 7 + 1.5;

    // Dark crater basin
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Bright crater rim
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rusty red gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#9a3412');
  grad.addColorStop(0.5, '#c2410c');
  grad.addColorStop(1, '#7c2d12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Dark volcanic plains & impact basins
  ctx.fillStyle = '#451a03';
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = 20 + Math.random() * 70;
    const ry = 10 + Math.random() * 35;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Valles Marineris Grand Canyon Rift
  ctx.strokeStyle = '#290600';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(350, 260);
  ctx.bezierCurveTo(450, 275, 550, 250, 650, 265);
  ctx.stroke();

  // Olympus Mons Super Volcano Cone
  ctx.fillStyle = '#782a0b';
  ctx.beginPath();
  ctx.arc(260, 220, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c0700';
  ctx.beginPath();
  ctx.arc(260, 220, 10, 0, Math.PI * 2); // Caldera
  ctx.fill();

  // Polar Ice Caps (CO2 + Water Ice)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(380, 0, 260, 28);
  ctx.fillRect(400, 480, 220, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c28b5e';
  ctx.fillRect(0, 0, 1024, 512);

  // Turbulent Jovian atmospheric bands
  const bandColors = ['#f5e6d3', '#a16207', '#d97706', '#78350f', '#fef3c7', '#854d0e'];
  for (let y = 0; y < 512; y += 16) {
    ctx.fillStyle = bandColors[(y / 16) % bandColors.length];
    const h = 10 + Math.sin(y * 0.08) * 5;
    ctx.fillRect(0, y, 1024, h);

    // Wavy turbulence noise
    ctx.beginPath();
    for (let x = 0; x < 1024; x += 30) {
      const offset = Math.sin(x * 0.04 + y) * 4;
      ctx.fillRect(x, y + offset, 20, h * 0.8);
    }
  }

  // Great Red Spot Storm Oval with swirl detail
  const grsX = 680;
  const grsY = 320;
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, 55);
  grsGrad.addColorStop(0, '#991b1b');
  grsGrad.addColorStop(0.6, '#dc2626');
  grsGrad.addColorStop(1, '#f97316');

  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 65, 38, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // White storm oval spots
  ctx.fillStyle = '#fef3c7';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.ellipse(200 + i * 90, 410, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 0, 512, 256);

  const colors = ['#fef08a', '#ca8a04', '#a16207', '#fde047', '#eab308'];
  for (let y = 0; y < 256; y += 10) {
    ctx.fillStyle = colors[(y / 10) % colors.length];
    ctx.fillRect(0, y, 512, 7);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 64);

  for (let x = 0; x < 1024; x++) {
    const norm = x / 1024;
    let alpha = 0.9;
    if (norm < 0.08 || norm > 0.96) alpha = 0;
    else if (norm > 0.58 && norm < 0.65) alpha = 0.05; // Cassini division
    else if (norm > 0.30 && norm < 0.33) alpha = 0.3;  // Encke gap

    const brightness = Math.floor(190 + Math.sin(x * 0.15) * 40);
    ctx.fillStyle = `rgba(${brightness}, ${brightness - 20}, ${brightness - 55}, ${alpha})`;
    ctx.fillRect(x, 0, 1, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createGasPlanetTexture(baseHex: string, bandHex: string, darkSpot: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = bandHex;
  for (let y = 0; y < 256; y += 18) {
    ctx.fillRect(0, y, 512, 8 + Math.sin(y * 0.15) * 3);
  }

  if (darkSpot) {
    // Neptune Great Dark Spot
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(320, 150, 35, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// Procedural harmonic zonal band bump generator for gas giants (differential wind shear & cloud relief)
function createGasGiantBandsBumpTexture(type: 'jupiter' | 'saturn' | 'ice'): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Neutral mid-grey base (128)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  const numBands = type === 'jupiter' ? 36 : (type === 'saturn' ? 24 : 16);
  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI;
    // Harmonic latitudinal waves representing zonal jet stream relief
    let val = 128 + Math.sin(lat * numBands) * 36 + Math.sin(lat * numBands * 2.2) * 16;
    if (type === 'jupiter') {
      val += Math.cos(lat * 8) * 12;
    }
    val = Math.max(20, Math.min(235, Math.round(val)));
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(0, y, width, 1);
  }

  if (type === 'jupiter') {
    // Great Red Spot eddy vortex depression (~22° South)
    const spotX = Math.round(width * 0.66);
    const spotY = Math.round(height * 0.62);
    const radX = 55;
    const radY = 32;
    const grad = ctx.createRadialGradient(spotX, spotY, 4, spotX, spotY, radX);
    grad.addColorStop(0, 'rgba(215, 215, 215, 0.85)');
    grad.addColorStop(0.5, 'rgba(155, 155, 155, 0.4)');
    grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, radX, radY, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Map of high-resolution 4K textures for Distance-Based LOD streaming
const HD_TEXTURE_MAP: Record<string, { local: string; remote: string }> = {
  earth: {
    local: '/textures/planets/earth-4k.jpg',
    remote: 'https://unpkg.com/three-globe@2.25.1/example/img/earth-blue-marble.jpg'
  },
  mars: {
    local: '/textures/planets/mars-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Solarsystemscope_texture_8k_mars.jpg/3840px-Solarsystemscope_texture_8k_mars.jpg'
  },
  jupiter: {
    local: '/textures/planets/jupiter-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Solarsystemscope_texture_8k_jupiter.jpg/3840px-Solarsystemscope_texture_8k_jupiter.jpg'
  },
  saturn: {
    local: '/textures/planets/saturn-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Solarsystemscope_texture_8k_saturn.jpg/3840px-Solarsystemscope_texture_8k_saturn.jpg'
  },
  mercury: {
    local: '/textures/planets/mercury-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Solarsystemscope_texture_8k_mercury.jpg/3840px-Solarsystemscope_texture_8k_mercury.jpg'
  },
  venus: {
    local: '/textures/planets/venus-4k.jpg',
    remote: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Solarsystemscope_texture_4k_venus_atmosphere.jpg'
  },
  moon: {
    local: '/textures/planets/moon-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Solarsystemscope_texture_8k_moon.jpg/3840px-Solarsystemscope_texture_8k_moon.jpg'
  },
  sun: {
    local: '/textures/planets/sun-4k.jpg',
    remote: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Solarsystemscope_texture_8k_sun.jpg/3840px-Solarsystemscope_texture_8k_sun.jpg'
  }
};

interface UniverseExplorer3DProps {
  lang: string;
  onBackToEarth?: () => void;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
}

export default function UniverseExplorer3D({
  lang,
  onBackToEarth,
  playSynthSound
}: UniverseExplorer3DProps) {
  const isAr = lang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const [selectedBodyId, setSelectedBodyId] = useState<string>('earth');
  const selectedBodyIdRef = useRef<string>('earth');
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(true);

  useEffect(() => {
    selectedBodyIdRef.current = selectedBodyId;
    if (selectedBodyId) {
      setIsDetailsPanelOpen(true);
    }
  }, [selectedBodyId]);

  const [isExploreMode, setIsExploreMode] = useState<boolean>(false);
  const isExploreModeRef = useRef<boolean>(false);
  useEffect(() => {
    isExploreModeRef.current = isExploreMode;
  }, [isExploreMode]);

  const [isSurfaceView, setIsSurfaceView] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(true);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const trackingBodyIdRef = useRef<string | null>('earth');

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);
  const [activeHudTab, setActiveHudTab] = useState<'info' | 'physics'>('info');

  // Probe Physics State Ref (for high performance 60fps loop)
  const probePhysicsRef = useRef({
    altitude: 0, // meters above planet surface
    verticalVelocity: 0, // m/s
    horizontalVelocity: 0, // m/s
    netAcc: 0 // m/s²
  });

  const simSpeedRef = useRef<number>(1);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  const lastTelemetryTimeRef = useRef<number>(0);

  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    verticalVelocity: 0,
    horizontalVelocity: 0,
    gravity: 9.80665,
    gravityG: 1.0,
    netAcc: -9.80665,
    pressurePa: 101325,
    densityKgM3: 1.225,
    temperatureC: 15,
    escapeVelocityMs: 11186,
    trajectoryState: 'BOUND TRAJECTORY' as 'BOUND TRAJECTORY' | 'ESCAPE TRAJECTORY',
    isLanded: true
  });

  const probeMeshRef = useRef<THREE.Group | null>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);

  // References to THREE objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Mesh maps & references
  const meshMapRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const orbitAnglesRef = useRef<{ [key: string]: number }>({});
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const earthCloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const earthNightMeshRef = useRef<THREE.Mesh | null>(null);

  // Smooth camera animation state
  const isLerpingCameraRef = useRef<boolean>(false);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 20, 48));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Cinematic initial entry transition (pulling away from Earth into solar system)
  const hasPlayedIntroRef = useRef<boolean>(false);
  const isCinematicIntroRef = useRef<boolean>(false);
  const introTimersRef = useRef<number[]>([]);
  const [introStage, setIntroStage] = useState<'none' | 'leaving_earth' | 'entering_solar_system'>('none');

  // Dynamic Distance-Based LOD (4K texture streaming on close zoom)
  const lodStateRef = useRef<Record<string, 'none' | 'loading' | 'loaded'>>({});
  const activeLodTransitionsRef = useRef<Array<{
    bodyId: string;
    mesh: THREE.Mesh;
    overlayMesh: THREE.Mesh;
    tex4k: THREE.Texture;
    progress: number;
  }>>([]);
  const [lodStatus, setLodStatus] = useState<{
    planetName: string;
    status: 'loading' | 'active';
  } | null>(null);

  const selectedBodyInfo = CELESTIAL_BODIES.find(b => b.id === selectedBodyId) || CELESTIAL_BODIES[3];

  // Initialize Three.js WebGL Engine
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setIsLoading(true);

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 550;

    // Fast device power check for mobile optimization
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                           (typeof window !== 'undefined' && window.innerWidth < 768);

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010309, 0.0014);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1500);
    camera.position.set(0, 22, 50);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileDevice,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileDevice ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3.5 POST-PROCESSING EFFECT COMPOSER WITH UNREAL BLOOM
    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.setPixelRatio(renderer.getPixelRatio());

    // Main render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Cinematic Unreal Bloom Pass (Glowing Sun, corona radiation, planet rims and specular highlights)
    // On mobile, reduced resolution guarantees smooth 60fps while preserving atmospheric glow
    const bloomResolution = new THREE.Vector2(
      Math.floor(width * (isMobileDevice ? 0.6 : 1.0)),
      Math.floor(height * (isMobileDevice ? 0.6 : 1.0))
    );
    const bloomPass = new UnrealBloomPass(
      bloomResolution,
      isMobileDevice ? 0.85 : 1.15, // strength
      0.55,                         // radius
      0.68                          // threshold: limits bloom to bright corona, star core and rims
    );
    composer.addPass(bloomPass);
    bloomPassRef.current = bloomPass;

    // Output Pass (ACES Filmic tone mapping & SRGB conversion)
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 4. ORBIT CONTROLS (With ultra-close zoom support)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.2;
    controls.maxDistance = 450;
    controls.maxPolarAngle = Math.PI - 0.05;
    controlsRef.current = controls;

    // 5. DRAMATIC SPACE LIGHTING SYSTEM
    // Faint ambient light (0.20) replicating real deep space darkness & sharp day/night terminator
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.20);
    scene.add(ambientLight);

    // Subtle galactic cosmic bounce fill
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 0.10);
    scene.add(hemiLight);

    // Primary Sun Light radiating outwards from solar center (0,0,0)
    const sunPointLight = new THREE.PointLight(0xfff7ed, 5.5, 650, 0.35);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Directional sunlight for realistic specular highlights
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(0, 0, 0);
    scene.add(dirLight);

    // 6. DEEP COSMIC MULTI-LAYER STARFIELD (High visual depth, zero performance overhead)
    // Layer 1: Distant Faint Background Stars (3,200 stars)
    const faintStarCount = 3200;
    const faintStarGeo = new THREE.BufferGeometry();
    const faintPositions = new Float32Array(faintStarCount * 3);
    const faintColors = new Float32Array(faintStarCount * 3);

    for (let i = 0; i < faintStarCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 300 + Math.random() * 380;

      faintPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      faintPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      faintPositions[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      const rand = Math.random();
      if (rand > 0.82) color.setHex(0x7dd3fc); // Faint electric blue
      else if (rand > 0.92) color.setHex(0xfef08a); // Pale stellar yellow
      else color.setHex(0xe2e8f0); // Cold white

      faintColors[i * 3] = color.r;
      faintColors[i * 3 + 1] = color.g;
      faintColors[i * 3 + 2] = color.b;
    }

    faintStarGeo.setAttribute('position', new THREE.BufferAttribute(faintPositions, 3));
    faintStarGeo.setAttribute('color', new THREE.BufferAttribute(faintColors, 3));

    const faintStarMat = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    const faintStarField = new THREE.Points(faintStarGeo, faintStarMat);
    scene.add(faintStarField);

    // Layer 2: Brilliant Luminary & Giant Stars (900 stars, varied brightness)
    const brightStarCount = 900;
    const brightStarGeo = new THREE.BufferGeometry();
    const brightPositions = new Float32Array(brightStarCount * 3);
    const brightColors = new Float32Array(brightStarCount * 3);

    for (let i = 0; i < brightStarCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 260 + Math.random() * 340;

      brightPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      brightPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      brightPositions[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      const rand = Math.random();
      if (rand > 0.70) color.setHex(0x38bdf8); // Vivid electric cyan
      else if (rand > 0.85) color.setHex(0xfbbf24); // Warm radiant gold
      else if (rand > 0.93) color.setHex(0x60a5fa); // Deep sapphire star
      else color.setHex(0xffffff); // Pure brilliant white

      brightColors[i * 3] = color.r;
      brightColors[i * 3 + 1] = color.g;
      brightColors[i * 3 + 2] = color.b;
    }

    brightStarGeo.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
    brightStarGeo.setAttribute('color', new THREE.BufferAttribute(brightColors, 3));

    const brightStarMat = new THREE.PointsMaterial({
      size: 2.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    const brightStarField = new THREE.Points(brightStarGeo, brightStarMat);
    scene.add(brightStarField);

    // Layer 3: Navigational Supergiants (60 prominent radiant beacons)
    const superStarCount = 60;
    const superStarGeo = new THREE.BufferGeometry();
    const superPositions = new Float32Array(superStarCount * 3);
    const superColors = new Float32Array(superStarCount * 3);

    for (let i = 0; i < superStarCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 280 + Math.random() * 300;

      superPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      superPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      superPositions[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      const rand = Math.random();
      if (rand > 0.5) color.setHex(0xbae6fd); // Ice blue pulsar
      else color.setHex(0xfef08a); // Supergiant amber

      superColors[i * 3] = color.r;
      superColors[i * 3 + 1] = color.g;
      superColors[i * 3 + 2] = color.b;
    }

    superStarGeo.setAttribute('position', new THREE.BufferAttribute(superPositions, 3));
    superStarGeo.setAttribute('color', new THREE.BufferAttribute(superColors, 3));

    const superStarMat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 1.0
    });

    const superStarField = new THREE.Points(superStarGeo, superStarMat);
    scene.add(superStarField);

    // 6.5 LANDER / PROBE MESH FOR REAL-TIME PHYSICS SIMULATION
    const probeGroup = new THREE.Group();

    // Metallic Capsule Body
    const probeGeo = new THREE.ConeGeometry(0.18, 0.45, 8);
    const probeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    const probeCapsule = new THREE.Mesh(probeGeo, probeMat);
    probeGroup.add(probeCapsule);

    // Thruster Flame Light
    const flameGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.9 });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = -0.3;
    flameMesh.rotation.x = Math.PI;
    probeGroup.add(flameMesh);

    scene.add(probeGroup);
    probeMeshRef.current = probeGroup;
    flameMeshRef.current = flameMesh;

    // 7. LOAD REAL HIGH-RESOLUTION 2K PLANET TEXTURES (100% Guaranteed CORS-safe & Instant)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    textureLoader.setCrossOrigin('anonymous');

    const configurePlanetTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = maxAnisotropy;
      tex.needsUpdate = true;
    };

    const loadTextureWithHandler = (localPath: string, remoteFallbackUrl: string, name: string): THREE.Texture => {
      return textureLoader.load(
        localPath,
        (tex) => {
          configurePlanetTexture(tex);
        },
        undefined,
        () => {
          // Fallback to remote CDN if local is unreachable
          textureLoader.load(
            remoteFallbackUrl,
            (fbTex) => {
              configurePlanetTexture(fbTex);
            },
            undefined,
            (error) => {
              console.error(`Texture failed to load: [${name}]`, remoteFallbackUrl, error);
            }
          );
        }
      );
    };

    const earthTextures = {
      color: loadTextureWithHandler('/textures/planets/earth-day.jpg', 'https://unpkg.com/three-globe@2.25.1/example/img/earth-day.jpg', 'earth-day'),
      bump: loadTextureWithHandler('/textures/planets/earth-topology.png', 'https://unpkg.com/three-globe@2.25.1/example/img/earth-topology.png', 'earth-topology'),
      spec: loadTextureWithHandler('/textures/planets/earth-water.png', 'https://unpkg.com/three-globe@2.25.1/example/img/earth-water.png', 'earth-water')
    };

    const bumpTextures = {
      mars: loadTextureWithHandler('/textures/planets/mars-bump.jpg', 'https://raw.githubusercontent.com/KyleGough/solar-system/master/static/textures/mars-bump.jpg', 'mars-bump'),
      moon: loadTextureWithHandler('/textures/planets/moon-bump.jpg', 'https://raw.githubusercontent.com/KyleGough/solar-system/master/static/textures/moon-bump.jpg', 'moon-bump'),
      venus: loadTextureWithHandler('/textures/planets/venus-bump.jpg', 'https://raw.githubusercontent.com/KyleGough/solar-system/master/static/textures/venus-bump.jpg', 'venus-bump'),
      mercuryNormal: loadTextureWithHandler('/textures/planets/mercury-normal.png', 'https://raw.githubusercontent.com/KyleGough/solar-system/master/static/textures/mercury-normal.png', 'mercury-normal'),
      jupiterBands: createGasGiantBandsBumpTexture('jupiter'),
      saturnBands: createGasGiantBandsBumpTexture('saturn'),
      uranusBands: createGasGiantBandsBumpTexture('ice'),
      neptuneBands: createGasGiantBandsBumpTexture('ice')
    };

    // Smooth LOD Cross-Fade Transition (prevents jarring pops when swapping textures)
    const startLodTransition = (bodyId: string, mesh: THREE.Mesh, tex4k: THREE.Texture) => {
      if (!mesh || !mesh.material) return;

      const origMat = mesh.material as (THREE.MeshStandardMaterial | THREE.MeshBasicMaterial);
      const overlayMat = origMat.clone();
      overlayMat.map = tex4k;
      overlayMat.transparent = true;
      overlayMat.opacity = 0.0;
      overlayMat.depthWrite = false;
      overlayMat.needsUpdate = true;

      const overlayMesh = new THREE.Mesh(mesh.geometry, overlayMat);
      overlayMesh.scale.set(1.0006, 1.0006, 1.0006);
      mesh.add(overlayMesh);

      activeLodTransitionsRef.current.push({
        bodyId,
        mesh,
        overlayMesh,
        tex4k,
        progress: 0
      });
    };

    // Dynamic On-Demand 4K Texture Loader for Close-Up Zoom
    const load4kPlanetTexture = (bodyId: string) => {
      if (lodStateRef.current[bodyId]) return;
      lodStateRef.current[bodyId] = 'loading';

      const config = HD_TEXTURE_MAP[bodyId];
      if (!config) {
        lodStateRef.current[bodyId] = 'loaded';
        return;
      }

      const body = CELESTIAL_BODIES.find(b => b.id === bodyId);
      const planetName = isAr ? (body?.nameAr || bodyId) : (body?.nameEn || bodyId);
      setLodStatus({ planetName, status: 'loading' });

      const onTexLoaded = (tex4k: THREE.Texture) => {
        configurePlanetTexture(tex4k);
        lodStateRef.current[bodyId] = 'loaded';

        const mesh = meshMapRef.current[bodyId] as THREE.Mesh;
        if (mesh) {
          startLodTransition(bodyId, mesh, tex4k);
        }

        setLodStatus({ planetName, status: 'active' });
        setTimeout(() => {
          setLodStatus((prev) => (prev?.planetName === planetName ? null : prev));
        }, 2500);
      };

      textureLoader.load(
        config.local,
        onTexLoaded,
        undefined,
        () => {
          // Fallback to remote CDN if local asset is unreachable
          textureLoader.load(
            config.remote,
            onTexLoaded,
            undefined,
            (err) => {
              console.warn(`LOD 4K texture failed to load for ${bodyId}:`, err);
              lodStateRef.current[bodyId] = 'loaded';
              setLodStatus(null);
            }
          );
        }
      );
    };

    const textures = {
      sun: loadTextureWithHandler('/textures/planets/2k_sun.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_sun.jpg', 'sun'),
      earthNight: loadTextureWithHandler('/textures/planets/earth-night.jpg', 'https://unpkg.com/three-globe@2.25.1/example/img/earth-night.jpg', 'earth-night'),
      earthCloud: createEarthCloudTexture(),
      moon: loadTextureWithHandler('/textures/planets/2k_moon.jpg', 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg', 'moon'),
      mars: loadTextureWithHandler('/textures/planets/2k_mars.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_mars.jpg', 'mars'),
      jupiter: loadTextureWithHandler('/textures/planets/2k_jupiter.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_jupiter.jpg', 'jupiter'),
      saturn: loadTextureWithHandler('/textures/planets/2k_saturn.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_saturn.jpg', 'saturn'),
      saturnRing: loadTextureWithHandler('/textures/planets/2k_saturn_ring_alpha.png', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_saturn_ring_alpha.png', 'saturn-ring'),
      venus: loadTextureWithHandler('/textures/planets/2k_venus_atmosphere.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_venus_atmosphere.jpg', 'venus'),
      mercury: loadTextureWithHandler('/textures/planets/2k_mercury.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_mercury.jpg', 'mercury'),
      uranus: loadTextureWithHandler('/textures/planets/2k_uranus.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_uranus.jpg', 'uranus'),
      neptune: loadTextureWithHandler('/textures/planets/2k_neptune.jpg', 'https://raw.githubusercontent.com/qtremors/cosmos/main/cosmos-app/public/textures/2k_neptune.jpg', 'neptune')
    };

    // Build all Celestial Spheres
    CELESTIAL_BODIES.forEach((body) => {
      orbitAnglesRef.current[body.id] = Math.random() * Math.PI * 2;

      if (body.id === 'moon') return; // Handled specially inside Earth group

      if (body.id === 'sun') {
        // THE SUN (Incandescent Stellar Core + Multi-tier Radiant Corona)
        const sunGeo = new THREE.SphereGeometry(body.radius3D, 72, 72);
        const sunMat = new THREE.MeshBasicMaterial({
          map: textures.sun,
          color: 0xfffbeb // Brilliant hot stellar photosphere
        });
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);

        // Sun Corona Atmosphere Flare (High luminance to trigger bloom)
        const coronaGeo = new THREE.SphereGeometry(body.radius3D * 1.15, 64, 64);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.42,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
        sunMesh.add(coronaMesh);

        // Secondary Soft Solar Atmospheric Halo
        const outerCoronaGeo = new THREE.SphereGeometry(body.radius3D * 1.32, 64, 64);
        const outerCoronaMat = new THREE.MeshBasicMaterial({
          color: 0xd97706,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const outerCoronaMesh = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
        sunMesh.add(outerCoronaMesh);

        scene.add(sunMesh);
        meshMapRef.current['sun'] = sunMesh;
      } else {
        // PLANET ORBIT TRACE RING
        const ringGeo = new THREE.RingGeometry(body.orbitDist3D - 0.08, body.orbitDist3D + 0.08, 128);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(body.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.16
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        scene.add(ringMesh);

        // PLANET MESH (Minimum 64x64/72x72 segments for pristine close-up curves)
        const planetGeo = new THREE.SphereGeometry(body.radius3D, 72, 72);
        let planetMat: THREE.Material;

        if (body.id === 'earth') {
          planetMat = new THREE.MeshStandardMaterial({
            map: earthTextures.color,
            bumpMap: earthTextures.bump,
            bumpScale: 0.05,
            roughnessMap: earthTextures.spec,
            roughness: 0.45,
            metalness: 0.05,
            color: 0xffffff
          });
        } else if (body.id === 'mars') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.mars,
            bumpMap: bumpTextures.mars,
            bumpScale: 0.055,
            roughness: 0.72,
            metalness: 0.04,
            color: 0xffffff
          });
        } else if (body.id === 'venus') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.venus,
            bumpMap: bumpTextures.venus,
            bumpScale: 0.035,
            roughness: 0.65,
            metalness: 0.02,
            color: 0xffffff
          });
        } else if (body.id === 'mercury') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.mercury,
            normalMap: bumpTextures.mercuryNormal,
            normalScale: new THREE.Vector2(0.85, 0.85),
            roughness: 0.82,
            metalness: 0.08,
            color: 0xffffff
          });
        } else if (body.id === 'jupiter') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.jupiter,
            bumpMap: bumpTextures.jupiterBands,
            bumpScale: 0.022,
            roughness: 0.68,
            metalness: 0.02,
            color: 0xffffff
          });
        } else if (body.id === 'saturn') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.saturn,
            bumpMap: bumpTextures.saturnBands,
            bumpScale: 0.018,
            roughness: 0.68,
            metalness: 0.02,
            color: 0xffffff
          });
        } else if (body.id === 'uranus') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.uranus,
            bumpMap: bumpTextures.uranusBands,
            bumpScale: 0.015,
            roughness: 0.60,
            metalness: 0.02,
            color: 0xffffff
          });
        } else if (body.id === 'neptune') {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures.neptune,
            bumpMap: bumpTextures.neptuneBands,
            bumpScale: 0.018,
            roughness: 0.60,
            metalness: 0.02,
            color: 0xffffff
          });
        } else if (textures[body.id as keyof typeof textures]) {
          planetMat = new THREE.MeshStandardMaterial({
            map: textures[body.id as keyof typeof textures],
            roughness: 0.7,
            metalness: 0.05,
            color: 0xffffff
          });
        } else {
          planetMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(body.color),
            roughness: 0.6
          });
        }

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        planetMesh.name = body.id;

        // Orbit initial position
        const angle = orbitAnglesRef.current[body.id];
        planetMesh.position.x = Math.cos(angle) * body.orbitDist3D;
        planetMesh.position.z = Math.sin(angle) * body.orbitDist3D;

        // SPECIAL MULTI-LAYER EARTH (Surface + Night Lights Shader + Clouds + Atmosphere Glow)
        if (body.id === 'earth') {
          // Layer 2: Night Lights (Appears ONLY on night side facing away from Sun at origin)
          const nightGeo = new THREE.SphereGeometry(body.radius3D * 1.002, 72, 72);
          const nightMat = new THREE.ShaderMaterial({
            uniforms: {
              tNight: { value: textures.earthNight },
              sunDirection: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: `
              varying vec3 vNormal;
              varying vec2 vUv;
              varying vec3 vWorldPosition;
              void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPos.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPos;
              }
            `,
            fragmentShader: `
              uniform sampler2D tNight;
              uniform vec3 sunDirection;
              varying vec3 vNormal;
              varying vec2 vUv;
              varying vec3 vWorldPosition;
              void main() {
                vec3 dirToSun = normalize(sunDirection - vWorldPosition);
                float sunDot = dot(vNormal, dirToSun);
                float nightFactor = smoothstep(0.1, -0.25, sunDot);
                vec4 nightTex = texture2D(tNight, vUv);
                gl_FragColor = vec4(nightTex.rgb * 1.5, nightTex.a * nightFactor * 0.9);
              }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
          });
          const nightMesh = new THREE.Mesh(nightGeo, nightMat);
          planetMesh.add(nightMesh);
          earthNightMeshRef.current = nightMesh;

          // Layer 3: Rotating Clouds Layer
          const cloudGeo = new THREE.SphereGeometry(body.radius3D * 1.018, 72, 72);
          const cloudMat = new THREE.MeshStandardMaterial({
            map: textures.earthCloud,
            transparent: true,
            opacity: 0.65,
            roughness: 0.9
          });
          const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
          planetMesh.add(cloudMesh);
          earthCloudsMeshRef.current = cloudMesh;

          // Layer 4: Rayleigh Atmospheric Blue Glow Rim
          const atmosGeo = new THREE.SphereGeometry(body.radius3D * 1.06, 64, 64);
          const atmosMat = new THREE.ShaderMaterial({
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              varying vec3 vNormal;
              void main() {
                float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
                gl_FragColor = vec4(0.22, 0.74, 0.98, intensity * 0.75);
              }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
          });
          const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
          planetMesh.add(atmosMesh);

          // Dedicated Moon Satellite Orbiting Earth
          const moonGroup = new THREE.Group();
          planetMesh.add(moonGroup);
          moonGroupRef.current = moonGroup;

          const moonBody = CELESTIAL_BODIES.find(b => b.id === 'moon')!;
          const moonGeo = new THREE.SphereGeometry(moonBody.radius3D, 64, 64);
          const moonMat = new THREE.MeshStandardMaterial({
            map: textures.moon,
            bumpMap: bumpTextures.moon,
            bumpScale: 0.045,
            roughness: 0.8,
            color: 0xffffff
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.name = 'moon';
          moonMesh.position.x = 3.8; // distance from Earth
          moonGroup.add(moonMesh);
          meshMapRef.current['moon'] = moonMesh;
        }

        // SPECIAL SATURN RINGS INCLINATION & CASSINI DIVISION
        if (body.id === 'saturn') {
          const saturnRingGeo = new THREE.RingGeometry(body.radius3D * 1.35, body.radius3D * 2.5, 96);
          const saturnRingMat = new THREE.MeshBasicMaterial({
            map: textures.saturnRing,
            side: THREE.DoubleSide,
            transparent: true
          });
          const saturnRingMesh = new THREE.Mesh(saturnRingGeo, saturnRingMat);
          saturnRingMesh.rotation.x = Math.PI / 2.3;
          planetMesh.add(saturnRingMesh);
        }

        scene.add(planetMesh);
        meshMapRef.current[body.id] = planetMesh;
      }
    });

    setIsLoading(false);

    // Initial cinematic entry: start close to Earth's surface and smoothly pull away into space
    const earthMesh = meshMapRef.current['earth'];
    if (earthMesh && !hasPlayedIntroRef.current) {
      hasPlayedIntroRef.current = true;
      const earthPos = new THREE.Vector3();
      earthMesh.getWorldPosition(earthPos);

      // Start camera positioned closely looking at Earth
      camera.position.set(earthPos.x + 1.6, earthPos.y + 0.45, earthPos.z + 1.6);
      controls.target.copy(earthPos);
      controls.update();

      // Smoothly pull back to the full solar system overview (0, 22, 52 looking at origin)
      targetLookAtRef.current.set(0, 0, 0);
      targetCamPosRef.current.set(0, 22, 52);
      isCinematicIntroRef.current = true;
      isLerpingCameraRef.current = true;

      setIntroStage('leaving_earth');
      const t1 = window.setTimeout(() => {
        setIntroStage('entering_solar_system');
      }, 900);
      const t2 = window.setTimeout(() => {
        setIntroStage('none');
      }, 1900);
      introTimersRef.current.push(t1, t2);
    }

    // 8. INTERACTIVE CLICK & TOUCH SELECTION RAYCASTER
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveObjects = Object.values(meshMapRef.current);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topObj: THREE.Object3D | null = intersects[0].object;
        while (topObj && !topObj.name && topObj.parent) {
          topObj = topObj.parent;
        }
        if (topObj && topObj.name) {
          playSynthSound(700, 'sine', 0.08);
          focusOnBody(topObj.name, true);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. ANIMATION LOOP WITH REAL-TIME SIMPLIFIED PHYSICS ENGINE
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Rotate planets on axes & orbit around Sun connected to numerical periods
      CELESTIAL_BODIES.forEach((body) => {
        const mesh = meshMapRef.current[body.id];
        if (!mesh) return;

        // Axial spin scaled by real rotation period (Earth 86164s = 1.0)
        const spinSpeedScale = 86164 / (body.rotationPeriodSeconds || 86164);
        mesh.rotation.y += 0.35 * spinSpeedScale * delta;

        // Orbit progression: only rotate when autoRotate is active and not frozen in explore mode
        const isSelectedAndExplored = isExploreModeRef.current && trackingBodyIdRef.current === body.id;
        const shouldRevolve = autoRotateRef.current && !isSelectedAndExplored && body.id !== 'sun' && body.id !== 'moon';

        if (shouldRevolve) {
          const orbitSpeedScale = Math.sqrt(31558150 / (body.orbitalPeriodSeconds || 31558150));
          orbitAnglesRef.current[body.id] += body.orbitSpeed * orbitSpeedScale * 0.3 * delta * 60;
          const angle = orbitAnglesRef.current[body.id];
          mesh.position.x = Math.cos(angle) * body.orbitDist3D;
          mesh.position.z = Math.sin(angle) * body.orbitDist3D;
        }
      });

      // Earth Cloud & Night Lights Rotations
      if (earthCloudsMeshRef.current) {
        earthCloudsMeshRef.current.rotation.y += 0.14 * delta;
      }
      if (moonGroupRef.current && autoRotateRef.current && !isExploreModeRef.current) {
        moonGroupRef.current.rotation.y += 0.6 * delta;
      }

      // REAL-TIME PHYSICS CALCULATIONS (Probe Integration, Gravity, Drag)
      const currentBody = CELESTIAL_BODIES.find(b => b.id === selectedBodyIdRef.current) || CELESTIAL_BODIES[3];
      const planetMesh = meshMapRef.current[currentBody.id];

      // Update Probe 3D World Position & Altitude Offset
      if (planetMesh && probeMeshRef.current) {
        const planetWorldPos = new THREE.Vector3();
        planetMesh.getWorldPosition(planetWorldPos);

        const visualAltitudeOffset = (probePhysicsRef.current.altitude / 1000) * 0.12;
        const totalDist = currentBody.radius3D + visualAltitudeOffset;

        probeMeshRef.current.position.set(
          planetWorldPos.x,
          planetWorldPos.y + totalDist,
          planetWorldPos.z
        );

        if (flameMeshRef.current) {
          flameMeshRef.current.visible = probePhysicsRef.current.verticalVelocity > 0;
        }
      }

      // Physics Integration Loop
      const G_CONST = 6.67430e-11;
      const PROBE_MASS = 1500; // kg
      const DRAG_CD = 0.8;
      const PROBE_AREA = 4.0; // m²

      const simDt = Math.min(delta, 0.08) * simSpeedRef.current;
      const radiusMeters = currentBody.radiusKmVal * 1000;
      const currentR = radiusMeters + probePhysicsRef.current.altitude;

      // Gravity g(h) = G * M / (r + h)²
      const curGravity = (G_CONST * currentBody.massKg) / (currentR * currentR);

      // Atmospheric Model: Pressure & Density decay exponentially with scale height H
      let curDensity = 0;
      let curPressure = 0;
      if (currentBody.hasAtmosphere) {
        const scaleRatio = Math.exp(-probePhysicsRef.current.altitude / currentBody.scaleHeightM);
        curDensity = currentBody.atmosphereDensityKgM3 * scaleRatio;
        curPressure = currentBody.atmosphericPressurePa * scaleRatio;
      }

      // Drag Force: F_drag = 0.5 * rho * Cd * A * v_y |v_y|
      const vy = probePhysicsRef.current.verticalVelocity;
      const dragForceY = 0.5 * curDensity * DRAG_CD * PROBE_AREA * vy * Math.abs(vy);
      const aDragY = dragForceY / PROBE_MASS;

      // Net Acceleration
      const netAccY = -curGravity - aDragY;
      probePhysicsRef.current.netAcc = netAccY;

      // Euler Integration for altitude and velocity
      if (probePhysicsRef.current.altitude > 0 || vy > 0) {
        probePhysicsRef.current.verticalVelocity += netAccY * simDt;
        probePhysicsRef.current.altitude += probePhysicsRef.current.verticalVelocity * simDt;

        if (probePhysicsRef.current.altitude <= 0) {
          probePhysicsRef.current.altitude = 0;
          probePhysicsRef.current.verticalVelocity = 0;
        }
      }

      // Dynamic Temperature Model
      const dayNightAngle = orbitAnglesRef.current[currentBody.id] || 0;
      const dayNightShift = currentBody.dayNightTemperatureFactor * Math.cos(dayNightAngle);
      const lapseRateCorrection = currentBody.hasAtmosphere ? -0.0065 * Math.min(1000, probePhysicsRef.current.altitude / 100) : 0;
      const curTemp = currentBody.baseTemperatureC + dayNightShift + lapseRateCorrection;

      // Escape Velocity
      const vEscape = Math.sqrt((2 * G_CONST * currentBody.massKg) / currentR);
      const isEscape = Math.abs(probePhysicsRef.current.verticalVelocity) >= vEscape;

      // Throttle Telemetry React State Updates (~15 fps)
      lastTelemetryTimeRef.current += delta;
      if (lastTelemetryTimeRef.current > 0.065) {
        lastTelemetryTimeRef.current = 0;
        setTelemetry({
          altitude: probePhysicsRef.current.altitude,
          verticalVelocity: probePhysicsRef.current.verticalVelocity,
          horizontalVelocity: probePhysicsRef.current.horizontalVelocity,
          gravity: curGravity,
          gravityG: curGravity / 9.80665,
          netAcc: netAccY,
          pressurePa: curPressure,
          densityKgM3: curDensity,
          temperatureC: curTemp,
          escapeVelocityMs: vEscape,
          trajectoryState: isEscape ? 'ESCAPE TRAJECTORY' : 'BOUND TRAJECTORY',
          isLanded: probePhysicsRef.current.altitude <= 0
        });
      }

      // REAL-TIME CONTINUOUS CAMERA TRACKING (Planet Lock)
      if (trackingBodyIdRef.current) {
        const trackedMesh = meshMapRef.current[trackingBodyIdRef.current];
        if (trackedMesh) {
          const worldPos = new THREE.Vector3();
          trackedMesh.getWorldPosition(worldPos);

          if (isLerpingCameraRef.current) {
            targetLookAtRef.current.copy(worldPos);
          } else {
            // Keep controls target securely anchored to the moving planet
            const deltaPos = worldPos.clone().sub(controls.target);
            controls.target.copy(worldPos);
            camera.position.add(deltaPos);
          }
        }
      }

      // 8. DYNAMIC LEVEL-OF-DETAIL (LOD) CROSS-FADE & DISTANCE PROXIMITY STREAMING
      // Advance active LOD cross-fade transitions (~450ms smooth dissolve)
      for (let i = activeLodTransitionsRef.current.length - 1; i >= 0; i--) {
        const trans = activeLodTransitionsRef.current[i];
        trans.progress += delta * 2.2;

        if (trans.progress >= 1.0) {
          const mainMat = trans.mesh.material as (THREE.MeshStandardMaterial | THREE.MeshBasicMaterial);
          mainMat.map = trans.tex4k;
          mainMat.needsUpdate = true;

          trans.mesh.remove(trans.overlayMesh);
          (trans.overlayMesh.material as THREE.Material).dispose();
          activeLodTransitionsRef.current.splice(i, 1);
        } else {
          (trans.overlayMesh.material as THREE.Material).opacity = Math.min(1.0, trans.progress);
        }
      }

      // Check distance from camera to celestial bodies to stream 4K textures on-demand
      if (camera) {
        const camPos = camera.position;
        const tempPos = new THREE.Vector3();

        CELESTIAL_BODIES.forEach((b) => {
          if (lodStateRef.current[b.id]) return; // Already streaming or loaded

          const m = meshMapRef.current[b.id];
          if (!m) return;

          m.getWorldPosition(tempPos);
          const dist = camPos.distanceTo(tempPos);

          // Threshold: Camera within 2.8x radius or currently selected & focused in explore mode
          const threshold = Math.max(b.radius3D * 2.8, 3.8);
          const isFocused = trackingBodyIdRef.current === b.id && isExploreModeRef.current;

          if (dist < threshold || isFocused) {
            load4kPlanetTexture(b.id);
          }
        });
      }

      // Smooth Camera Interpolation (Lerping)
      if (isLerpingCameraRef.current) {
        const lerpFactor = isCinematicIntroRef.current ? 0.042 : 0.08;
        camera.position.lerp(targetCamPosRef.current, lerpFactor);
        controls.target.lerp(targetLookAtRef.current, lerpFactor);

        if (
          camera.position.distanceTo(targetCamPosRef.current) < 0.15 &&
          controls.target.distanceTo(targetLookAtRef.current) < 0.15
        ) {
          isLerpingCameraRef.current = false;
          isCinematicIntroRef.current = false;
        }
      }

      controls.update();

      // Render via Post-Processing EffectComposer (UnrealBloom) or fallback to direct renderer
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Handle Window Resizing
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 550;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);

      if (composerRef.current) {
        composerRef.current.setSize(w, h);
        if (bloomPassRef.current) {
          bloomPassRef.current.resolution.set(
            Math.floor(w * (isMobileDevice ? 0.6 : 1.0)),
            Math.floor(h * (isMobileDevice ? 0.6 : 1.0))
          );
        }
      }
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    // Clean up WebGL & Post-Processing resources
    return () => {
      introTimersRef.current.forEach((id) => clearTimeout(id));
      introTimersRef.current = [];
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener('pointerdown', handlePointerDown);
      }
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);

      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }

      activeLodTransitionsRef.current = [];

      scene.clear();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Smooth Focus function on selected planet with close-up zoom unlocking
  const focusOnBody = (bodyId: string, enterExploreMode: boolean = true) => {
    setSelectedBodyId(bodyId);
    trackingBodyIdRef.current = bodyId;

    if (enterExploreMode) {
      setIsExploreMode(true);
    }

    const body = CELESTIAL_BODIES.find(b => b.id === bodyId);
    if (!body || !cameraRef.current || !controlsRef.current) return;

    const mesh = meshMapRef.current[bodyId];
    if (!mesh) return;

    // Get exact world position of celestial body
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);

    targetLookAtRef.current.copy(worldPos);

    // Set camera offset distance and dynamic minDistance for close-up inspection
    const minDist = Math.max(body.radius3D * 1.02, 0.4);
    controlsRef.current.minDistance = minDist;
    controlsRef.current.maxDistance = 500;

    let distOffset = Math.max(body.radius3D * 2.2, 2.5);
    if (enterExploreMode) {
      distOffset = Math.max(body.radius3D * 1.9, 1.8);
    }

    if (bodyId === 'sun') {
      targetCamPosRef.current.set(worldPos.x, worldPos.y + 4, worldPos.z + 14);
    } else if (bodyId === 'moon') {
      targetCamPosRef.current.set(worldPos.x + 1.2, worldPos.y + 0.5, worldPos.z + 1.5);
    } else {
      targetCamPosRef.current.set(worldPos.x + distOffset, worldPos.y + distOffset * 0.3, worldPos.z + distOffset);
    }

    isLerpingCameraRef.current = true;
  };

  // Exit dedicated Planet Exploration Mode back to Solar System Overview
  const handleExitExploreMode = () => {
    playSynthSound(450, 'sine', 0.08);
    setIsExploreMode(false);
    setIsSurfaceView(false);
    trackingBodyIdRef.current = null;

    if (controlsRef.current) {
      controlsRef.current.minDistance = 1.2;
      controlsRef.current.maxDistance = 450;
    }

    targetLookAtRef.current.set(0, 0, 0);
    targetCamPosRef.current.set(0, 22, 52);
    isLerpingCameraRef.current = true;
  };

  const handleResetCamera = () => {
    playSynthSound(450, 'sine', 0.05);
    focusOnBody(selectedBodyId, true);
  };

  const handleZoomIn = () => {
    playSynthSound(600, 'sine', 0.04);
    if (cameraRef.current && controlsRef.current) {
      const target = controlsRef.current.target;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const minDist = controlsRef.current.minDistance;
      const newDist = Math.max(currentDist * 0.7, minDist + 0.05);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    playSynthSound(500, 'sine', 0.04);
    if (cameraRef.current && controlsRef.current) {
      const target = controlsRef.current.target;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const maxDist = controlsRef.current.maxDistance;
      const newDist = Math.min(currentDist * 1.35, maxDist - 5);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
      controlsRef.current.update();
    }
  };

  const handleToggleSurfaceView = () => {
    playSynthSound(750, 'sine', 0.08);
    const body = selectedBodyInfo;
    const mesh = meshMapRef.current[selectedBodyId];
    if (!mesh || !body || !controlsRef.current) return;

    const newSurface = !isSurfaceView;
    setIsSurfaceView(newSurface);

    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);

    targetLookAtRef.current.copy(worldPos);
    if (newSurface) {
      // Ultra-close surface inspection view right above planet topography
      controlsRef.current.minDistance = Math.max(body.radius3D * 1.01, 0.35);
      const surfDist = Math.max(body.radius3D * 1.15, 0.6);
      targetCamPosRef.current.set(worldPos.x + surfDist, worldPos.y + surfDist * 0.08, worldPos.z + surfDist * 0.12);
    } else {
      controlsRef.current.minDistance = Math.max(body.radius3D * 1.02, 0.45);
      const dist = body.radius3D * 1.9;
      targetCamPosRef.current.set(worldPos.x + dist, worldPos.y + dist * 0.3, worldPos.z + dist);
    }
    isLerpingCameraRef.current = true;
  };

  // Launch test handlers
  const handleLaunchProbe = (initialVel: number) => {
    playSynthSound(900, 'sine', 0.15);
    probePhysicsRef.current.verticalVelocity = initialVel;
    probePhysicsRef.current.altitude = Math.max(probePhysicsRef.current.altitude, 0.5);
  };

  const handleResetSimulation = () => {
    playSynthSound(400, 'sine', 0.08);
    probePhysicsRef.current.altitude = 0;
    probePhysicsRef.current.verticalVelocity = 0;
    probePhysicsRef.current.horizontalVelocity = 0;
    probePhysicsRef.current.netAcc = 0;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-[#02030a] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col justify-between select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen bg-[#02030a]' : 'min-h-[500px] h-[75vh] md:h-[82vh] max-h-[860px]'
      }`}
    >
      
      {/* 3D WebGL Canvas Mounting Element */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* Sleek Loading Overlay while Procedural Textures Initialize */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-[#02030a]/90 backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <Globe className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-sm font-bold text-slate-200">
            {isAr ? 'جاري تحميل الكواكب والأنسجة عالية الدقة...' : 'Loading planets & high-res textures...'}
          </p>
        </div>
      )}

      {/* Subtle Visual LOD 4K Loading / Active Indicator */}
      {lodStatus && (
        <div className="absolute top-18 sm:top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 ease-out">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#030712]/90 backdrop-blur-md border border-cyan-500/30 text-xs shadow-lg shadow-cyan-950/50">
            {lodStatus.status === 'loading' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-200 font-medium">
                  {isAr ? `جاري بث تفاصيل 4K الفائقة (${lodStatus.planetName})...` : `Streaming 4K surface details (${lodStatus.planetName})...`}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-emerald-300 font-medium">
                  {isAr ? `نسيج 4K فائق الدقة نشط (${lodStatus.planetName})` : `Ultra 4K Surface Active (${lodStatus.planetName})`}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cinematic Entry Phase Indicator ("الابتعاد عن الأرض..." ثم "دخول النظام الشمسي...") */}
      {introStage !== 'none' && (
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-500 ease-out animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#030712]/95 backdrop-blur-xl border border-cyan-400/50 text-xs shadow-[0_0_25px_rgba(6,182,212,0.45)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#22d3ee]" />
            <span className="text-cyan-100 font-black tracking-wide text-xs sm:text-sm">
              {introStage === 'leaving_earth'
                ? (isAr ? 'الابتعاد عن الأرض... 🚀🌍' : 'Leaving Earth... 🚀🌍')
                : (isAr ? 'دخول النظام الشمسي... 🪐✨' : 'Entering Solar System... 🪐✨')}
            </span>
          </div>
        </div>
      )}

      {/* Floating Header & Navigation Bar */}
      <div className="relative z-10 p-3 sm:p-4 md:p-5 flex flex-wrap justify-between items-center gap-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-2.5">
          {isExploreMode ? (
            <button
              onClick={handleExitExploreMode}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5 border border-cyan-400/40 font-bold text-xs"
              title={isAr ? 'العودة للنظام الشمسي' : 'Back to Solar System'}
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'العودة للنظام الشمسي 🪐' : 'Exit to Solar System 🪐'}</span>
            </button>
          ) : (
            onBackToEarth && (
              <button
                onClick={() => {
                  playSynthSound(400, 'sine', 0.08);
                  onBackToEarth();
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center justify-center border border-white/10"
                title={isAr ? 'العودة' : 'Back'}
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              </button>
            )
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-cyan-400 tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3 animate-spin" />
                {isExploreMode 
                  ? (isAr ? 'نموذج السطح 3D' : 'Surface View 3D') 
                  : (isAr ? 'مشهد فضائي 3D WebGL' : '3D WebGL Cosmos')}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5 leading-tight">
              {isExploreMode 
                ? (isAr ? `استكشاف ${selectedBodyInfo.nameAr}` : `Exploring ${selectedBodyInfo.nameEn}`)
                : (isAr ? 'المجموعة الشمسية واستكشاف الفضاء 🪐' : 'Explore Space & Solar System 🪐')}
            </h2>
          </div>
        </div>

        {/* View Controls & Fullscreen Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playSynthSound(550, 'sine', 0.05);
              setAutoRotate(!autoRotate);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            }`}
            title={isAr ? (autoRotate ? 'إيقاف دوران المدار' : 'تفعيل دوران المدار') : (autoRotate ? 'Pause Orbit' : 'Resume Orbit')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAr 
                ? (autoRotate ? 'مدار نشط 🔄' : 'مدار ثابت ❄️') 
                : (autoRotate ? 'Orbiting 🔄' : 'Frozen ❄️')}
            </span>
          </button>

          {isExploreMode && (
            <button
              onClick={handleToggleSurfaceView}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                isSurfaceView
                  ? 'bg-purple-500/25 text-purple-300 border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? (isSurfaceView ? 'رؤية مدارية 🛰️' : 'فحص السطح 👁️') : (isSurfaceView ? 'Orbital View 🛰️' : 'Surface View 👁️')}</span>
            </button>
          )}

          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
            title={isAr ? 'إعادة تمركز الكاميرا' : 'Reset Camera'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
            title={isAr ? 'تكبير' : 'Zoom In'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
            title={isAr ? 'تصغير' : 'Zoom Out'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              setIsFullscreen(!isFullscreen);
            }}
            className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            title={isAr ? 'ملء الشاشة' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Planet Selector Chips */}
      <div className="relative z-10 px-3 sm:px-5 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
        {CELESTIAL_BODIES.map((body) => {
          const isSelected = selectedBodyId === body.id;
          return (
            <button
              key={body.id}
              onClick={() => {
                playSynthSound(650, 'sine', 0.06);
                focusOnBody(body.id, true);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600/40 to-cyan-500/40 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                  : 'bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: body.color }} />
              <span>{isAr ? body.nameAr : body.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Side/Bottom Celestial Body Details GlassCard with AI Q&A */}
      {selectedBodyInfo && (
        <CelestialBodyDetailPanel
          body={selectedBodyInfo}
          isOpen={isDetailsPanelOpen}
          onClose={() => {
            playSynthSound(400, 'sine', 0.04);
            setIsDetailsPanelOpen(false);
          }}
          onReopen={() => {
            playSynthSound(500, 'sine', 0.05);
            setIsDetailsPanelOpen(true);
          }}
          isAr={isAr}
          playSynthSound={playSynthSound}
        />
      )}

      {/* Bottom Interactive Planet Information & Compact Physics HUD Panel */}
      {selectedBodyInfo && (
        <div className="relative z-10 mx-2 mb-2 sm:mx-4 sm:mb-4 p-2.5 sm:p-3.5 rounded-2xl md:rounded-3xl glass-panel border border-cyan-500/30 bg-black/80 backdrop-blur-md shadow-2xl transition-all animate-[fadeIn_0.3s_ease-out] pointer-events-auto max-w-5xl self-center w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]">
          {/* TOP BAR: Selected Planet Identifier + Primary Physics Gauges + Expand Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* Planet Badge & Explore Button */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: selectedBodyInfo.color, color: selectedBodyInfo.color }} />
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider block leading-none">
                  {isAr ? selectedBodyInfo.typeAr : selectedBodyInfo.typeEn}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white mt-0.5 leading-tight flex items-center gap-1.5">
                  <span>{isAr ? selectedBodyInfo.nameAr : selectedBodyInfo.nameEn}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedBodyInfo.surfaceGravity}
                  </span>
                </h3>
              </div>

              {!isExploreMode && (
                <button
                  onClick={() => {
                    playSynthSound(800, 'sine', 0.1);
                    focusOnBody(selectedBodyId, true);
                  }}
                  className="hidden xs:flex px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[11px] font-black shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer items-center gap-1 ml-1"
                >
                  <Compass className="w-3 h-3 animate-spin" />
                  <span>{isAr ? 'استكشف الكوكب 🚀' : 'Explore 🚀'}</span>
                </button>
              )}
            </div>

            {/* 5 Core Physics Gauges (Always Visible & High Contrast) */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs my-1 sm:my-0">
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 flex flex-col shadow-md">
                <span className="text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" />
                  {isAr ? 'الجاذبية' : 'Gravity'}
                </span>
                <span className="font-mono font-black text-emerald-100 text-xs sm:text-sm mt-0.5">
                  {telemetry.gravity.toFixed(2)} m/s²
                </span>
              </div>

              <div className="bg-cyan-950/80 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 flex flex-col shadow-md">
                <span className="text-cyan-300 font-extrabold text-[10px] flex items-center gap-1">
                  <MoveUp className="w-3 h-3 text-cyan-400" />
                  {isAr ? 'الارتفاع' : 'Altitude'}
                </span>
                <span className="font-mono font-black text-cyan-100 text-xs sm:text-sm mt-0.5">
                  {telemetry.altitude < 1000 
                    ? `${telemetry.altitude.toFixed(1)} m` 
                    : `${(telemetry.altitude / 1000).toFixed(1)} km`}
                </span>
              </div>

              <div className="bg-purple-950/80 px-2.5 py-1.5 rounded-xl border border-purple-500/40 flex flex-col shadow-md">
                <span className="text-purple-300 font-extrabold text-[10px] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  {isAr ? 'السرعة' : 'Speed'}
                </span>
                <span className="font-mono font-black text-purple-100 text-xs sm:text-sm mt-0.5">
                  {telemetry.verticalVelocity >= 0 ? '+' : ''}{telemetry.verticalVelocity.toFixed(1)} m/s
                </span>
              </div>

              <div className="bg-amber-950/80 px-2.5 py-1.5 rounded-xl border border-amber-500/40 flex flex-col shadow-md">
                <span className="text-amber-300 font-extrabold text-[10px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-amber-400" />
                  {isAr ? 'الضغط' : 'Pressure'}
                </span>
                <span className="font-mono font-black text-amber-100 text-xs sm:text-sm mt-0.5">
                  {telemetry.pressurePa < 1000 
                    ? `${telemetry.pressurePa.toFixed(0)} Pa` 
                    : telemetry.pressurePa < 100000 
                      ? `${(telemetry.pressurePa / 1000).toFixed(1)} kPa` 
                      : `${(telemetry.pressurePa / 100000).toFixed(1)} bar`}
                </span>
              </div>

              <div className="bg-rose-950/80 px-2.5 py-1.5 rounded-xl border border-rose-500/40 flex flex-col col-span-2 sm:col-span-1 shadow-md">
                <span className="text-rose-300 font-extrabold text-[10px] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-400" />
                  {isAr ? 'الحرارة' : 'Temp'}
                </span>
                <span className="font-mono font-black text-rose-100 text-xs sm:text-sm mt-0.5">
                  {telemetry.temperatureC.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Compact Launch Controls + Collapsible Toggle */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => handleLaunchProbe(25)}
                className="px-2 py-1 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 border border-cyan-400/30"
                title={isAr ? 'إطلاق قفز (25 m/s)' : 'Jump Launch (25 m/s)'}
              >
                <Rocket className="w-3 h-3" />
                <span className="hidden sm:inline">{isAr ? 'قفز' : 'Jump'}</span>
              </button>

              <button
                onClick={() => handleLaunchProbe(150)}
                className="px-2 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 border border-amber-400/30"
                title={isAr ? 'إطلاق صاروخ (150 m/s)' : 'Rocket Launch (150 m/s)'}
              >
                <Flame className="w-3 h-3" />
                <span className="hidden sm:inline">{isAr ? 'صاروخ' : 'Rocket'}</span>
              </button>

              <button
                onClick={() => handleLaunchProbe(telemetry.escapeVelocityMs * 1.05)}
                className="px-2 py-1 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 border border-purple-400/30"
                title={isAr ? 'دفعة الهروب من الجاذبية' : 'Escape Impulse'}
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">{isAr ? 'هروب' : 'Escape'}</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10"
                title={isAr ? 'إعادة ضبط المركبة' : 'Reset Probe'}
              >
                <RefreshCw className="w-3 h-3" />
              </button>

              {/* Expand/Collapse Advanced Telemetry & Facts */}
              <button
                onClick={() => {
                  playSynthSound(450, 'sine', 0.04);
                  setIsPanelExpanded(!isPanelExpanded);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isPanelExpanded
                    ? 'bg-cyan-500 text-black border-cyan-400'
                    : 'bg-white/10 hover:bg-white/20 text-cyan-300 border-cyan-500/30'
                }`}
              >
                <span>{isAr ? (isPanelExpanded ? 'طي التفاصيل 🔼' : 'المزيد 🔽') : (isPanelExpanded ? 'Collapse 🔼' : 'More 🔽')}</span>
              </button>
            </div>
          </div>

          {/* COLLAPSIBLE ADVANCED TELEMETRY & ASTRONOMICAL FACTS SECTION */}
          {isPanelExpanded && (
            <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar animate-[fadeIn_0.2s_ease-out]">
              
              {/* Secondary Telemetry: Density, Escape Velocity, Trajectory */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                <div className="bg-blue-950/40 p-2 rounded-lg border border-blue-500/30">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'كثافة الغلاف (ρ)' : 'Density (ρ)'}</span>
                  <span className="font-mono font-bold text-blue-300">{telemetry.densityKgM3.toFixed(4)} kg/m³</span>
                </div>

                <div className="bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/30">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'سرعة الهروب (v_esc)' : 'Escape Velocity'}</span>
                  <span className="font-mono font-bold text-indigo-300">{(telemetry.escapeVelocityMs / 1000).toFixed(2)} km/s</span>
                </div>

                <div className={`p-2 rounded-lg border ${
                  telemetry.trajectoryState === 'ESCAPE TRAJECTORY'
                    ? 'bg-rose-900/60 border-rose-400 text-rose-200 animate-pulse'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300'
                }`}>
                  <span className="text-[8px] block font-bold opacity-75">{isAr ? 'حالة المسار' : 'Trajectory'}</span>
                  <span className="font-bold text-[10px]">
                    {telemetry.trajectoryState === 'ESCAPE TRAJECTORY' 
                      ? (isAr ? 'مسار الهروب 🚀' : 'ESCAPE 🚀')
                      : (isAr ? 'مقيد بالجاذبية 🪐' : 'BOUND 🪐')}
                  </span>
                </div>

                <div className="bg-black/60 p-2 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400 text-[8px]">{isAr ? 'سرعة المحاكاة:' : 'Speed:'}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          playSynthSound(600, 'sine', 0.04);
                          setSimSpeed(spd);
                          simSpeedRef.current = spd;
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all cursor-pointer ${
                          simSpeed === spd
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Astronomical Fact & Stats */}
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs text-slate-200 leading-relaxed">
                💡 <span className="font-bold text-cyan-300">{isAr ? 'حقيقة علمية:' : 'Fact:'}</span> {isAr ? selectedBodyInfo.factAr : selectedBodyInfo.factEn}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'القطر' : 'Diameter'}</span>
                  <span className="font-bold text-cyan-300">{selectedBodyInfo.diameterKm}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'البعد عن الشمس' : 'Distance'}</span>
                  <span className="font-bold text-cyan-300">{selectedBodyInfo.distanceFromSun}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'الدوران' : 'Rotation'}</span>
                  <span className="font-bold text-white">{selectedBodyInfo.rotationPeriod}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[8px] block">{isAr ? 'الأقمار' : 'Moons'}</span>
                  <span className="font-bold text-purple-300">{selectedBodyInfo.moonsCount}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
