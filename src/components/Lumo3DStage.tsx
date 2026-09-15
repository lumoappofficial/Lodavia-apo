import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sparkles, RefreshCw, Volume2, VolumeX, Eye, Flame } from 'lucide-react';

export type CharacterState = 'idle' | 'happy' | 'thinking' | 'talking' | 'interaction';

export interface Lumo3DStageProps {
  characterState: CharacterState;
  onRayClick?: (eventPos: { x: number; y: number }) => void;
  onDogClick?: (eventPos: { x: number; y: number }) => void;
  activeTheme?: string;
  suitColor?: string;
  eyeGlowColor?: string;
  dogSuitColor?: string;
  isSoundActive?: boolean;
}

// Helper to generate charming stylized cute-faced planet textures dynamically
function createCutePlanetTexture(
  faceType: 'happy' | 'smiling' | 'winking',
  baseColor: string,
  glowColor: string,
  accentColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Soft spherical gradient base
  const grad = ctx.createRadialGradient(220, 210, 30, 256, 256, 250);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(0.55, baseColor);
  grad.addColorStop(0.92, accentColor);
  grad.addColorStop(1, '#021329');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Cosmic atmosphere waves & bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.ellipse(256, 170, 240, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.ellipse(256, 340, 230, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle planetary crater details
  ctx.fillStyle = 'rgba(2, 38, 70, 0.22)';
  ctx.beginPath(); ctx.arc(110, 140, 20, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(410, 175, 26, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(385, 365, 18, 0, Math.PI * 2); ctx.fill();

  // 3. Cute Kawaii Features (Big Sparkly Eyes, Cheerful Expression & Rosy Blushing Cheeks)
  if (faceType === 'happy') {
    // Big sparkly eyes with dual catchlights
    ctx.fillStyle = '#061a35';
    ctx.beginPath(); ctx.ellipse(195, 235, 24, 34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(317, 235, 24, 34, 0, 0, Math.PI * 2); ctx.fill();

    // Catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(186, 222, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(203, 248, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(308, 222, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(325, 248, 5, 0, Math.PI * 2); ctx.fill();

    // Joyful open smile with cute pink tongue
    ctx.fillStyle = '#061a35';
    ctx.beginPath();
    ctx.arc(256, 274, 26, 0.1 * Math.PI, 0.9 * Math.PI, false);
    ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(256, 290, 14, 0, Math.PI, false);
    ctx.fill();

    // Sweet blushing cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.beginPath(); ctx.ellipse(150, 272, 20, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(362, 272, 20, 12, 0, 0, Math.PI * 2); ctx.fill();
  } else if (faceType === 'winking') {
    // Left open eye
    ctx.fillStyle = '#061a35';
    ctx.beginPath(); ctx.ellipse(195, 235, 24, 34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(186, 222, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(203, 248, 5, 0, Math.PI * 2); ctx.fill();

    // Right winking eye (^_~)
    ctx.strokeStyle = '#061a35';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(317, 244, 20, 1.18 * Math.PI, 1.82 * Math.PI, false);
    ctx.stroke();

    // Playful curved smile
    ctx.strokeStyle = '#061a35';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(256, 274, 22, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();

    // Electric cyan blush
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.beginPath(); ctx.ellipse(152, 270, 18, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(360, 270, 18, 11, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    // Happy curved anime eyes (^_^)
    ctx.strokeStyle = '#061a35';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(195, 238, 22, 1.18 * Math.PI, 1.82 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(317, 238, 22, 1.18 * Math.PI, 1.82 * Math.PI, false);
    ctx.stroke();

    // Sweet kitten smile :3
    ctx.strokeStyle = '#061a35';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(246, 268, 12, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(266, 268, 12, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();

    // Warm rosy blush
    ctx.fillStyle = 'rgba(251, 113, 133, 0.5)';
    ctx.beginPath(); ctx.ellipse(150, 260, 18, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(362, 260, 18, 11, 0, 0, Math.PI * 2); ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural circular particle texture with smooth radial gradient falloff.
 * Replaces square GPU point sprites with soft glowing circular dots.
 */
function createCircleParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function Lumo3DStage({
  characterState = 'idle',
  onRayClick,
  onDogClick,
  activeTheme = 'cosmic',
  suitColor = 'gold',
  eyeGlowColor = 'yellow',
  dogSuitColor = 'gold',
  isSoundActive = true
}: Lumo3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasAnimations, setHasAnimations] = useState(false);

  // References to keep Three.js state across renders
  const stateRef = useRef(characterState);
  useEffect(() => {
    stateRef.current = characterState;
  }, [characterState]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rayGroupRef = useRef<THREE.Group | null>(null);
  const dogGroupRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interaction triggers
  const interactionState = useRef({
    rayBounce: 0,
    raySpin: 0,
    dogBounce: 0,
    targetRotationY: 0,
    currentRotationY: 0,
    targetRotationX: 0,
    currentRotationX: 0,
    pointerX: 0,
    pointerY: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
  });

  // Sound synthesis on interaction
  const playBeep = useCallback((freq: number, type: OscillatorType = 'sine', dur = 0.15) => {
    if (!isSoundActive || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + dur);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {
      // Audio context restricted or unavailable
    }
  }, [isSoundActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cosmic background depth fog in deep sapphire/cyan space
    scene.fog = new THREE.FogExp2(0x020817, 0.042);

    // 2. CAMERA
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.45, 3.6);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. LIGHTING SETUP (Lodavia Electric Cyan & Deep Cosmic Space Palette)
    const ambientLight = new THREE.AmbientLight(0xbae6fd, 1.35);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainKeyLight.position.set(3.5, 5.2, 4.2);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    // Electric Cyan Fill Light
    const cyanFillLight = new THREE.DirectionalLight(0x00f2fe, 2.2);
    cyanFillLight.position.set(-4.2, 2.2, 2.2);
    scene.add(cyanFillLight);

    // Deep Celestial Azure Rim Light
    const azureRimLight = new THREE.DirectionalLight(0x0ea5e9, 2.6);
    azureRimLight.position.set(0, 3.2, -4.2);
    scene.add(azureRimLight);

    // Bioluminescent Cyan Ground Glow Light
    const stagePointLight = new THREE.PointLight(0x06b6d4, 3.2, 9);
    stagePointLight.position.set(0, 0.4, 1.2);
    scene.add(stagePointLight);

    // 5. 3D COSMIC ENVIRONMENT (PLANETS WITH CUTE FACES, STARS & MINI ROCKET)
    // 5a. Deep Multi-Colored Twinkling Starfield
    const starCount = 420;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 26;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPositions[i * 3 + 2] = -3 - Math.random() * 12;

      // Color variation (pure white, electric cyan, celestial blue, soft warm gold)
      const colorType = Math.random();
      if (colorType < 0.45) {
        starColors[i * 3] = 1; starColors[i * 3 + 1] = 1; starColors[i * 3 + 2] = 1;
      } else if (colorType < 0.75) {
        starColors[i * 3] = 0.2; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1;
      } else if (colorType < 0.9) {
        starColors[i * 3] = 0.4; starColors[i * 3 + 1] = 0.6; starColors[i * 3 + 2] = 1;
      } else {
        starColors[i * 3] = 1; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.4;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starParticleTexture = createCircleParticleTexture();

    const starMat = new THREE.PointsMaterial({
      size: 0.14,
      map: starParticleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 5b. DISTANT FRIENDLY PLANETS WITH CUTE FACES (Kawaii Celestial Neighbors)
    // Planet 1: Large Sky-Blue Friendly Planet with Cute Smile & Saturn-like Rings (Right)
    const planetGroup = new THREE.Group();
    planetGroup.position.set(2.9, 1.5, -4.5);

    const planetGeo = new THREE.SphereGeometry(0.92, 32, 32);
    const planetTexture = createCutePlanetTexture('happy', '#0284c7', '#38bdf8', '#034170');
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x03284f,
      emissiveIntensity: 0.4
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Celestial Planet Rings (Electric cyan glow)
    const ringGeo = new THREE.RingGeometry(1.15, 1.75, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const planetRing = new THREE.Mesh(ringGeo, ringMat);
    planetRing.rotation.x = Math.PI / 2.3;
    planetRing.rotation.y = Math.PI / 9;
    planetGroup.add(planetRing);
    scene.add(planetGroup);

    // Planet 2: Cute Smiling Turquoise Companion Moon (Left)
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-2.8, 1.5, -4.0);

    const moonGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const moonTexture = createCutePlanetTexture('smiling', '#06b6d4', '#67e8f9', '#083344');
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.4,
      metalness: 0.1,
      emissive: 0x083344,
      emissiveIntensity: 0.5
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);
    scene.add(moonGroup);

    // Planet 3: Distant Winking Deep-Space Planet (Top Center)
    const distantPlanetGroup = new THREE.Group();
    distantPlanetGroup.position.set(0.6, 2.5, -5.5);

    const distantPlanetGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const distantPlanetTexture = createCutePlanetTexture('winking', '#1e40af', '#60a5fa', '#0f172a');
    const distantPlanetMat = new THREE.MeshStandardMaterial({
      map: distantPlanetTexture,
      roughness: 0.4,
      emissive: 0x0f172a,
      emissiveIntensity: 0.45
    });
    const distantPlanetMesh = new THREE.Mesh(distantPlanetGeo, distantPlanetMat);
    distantPlanetGroup.add(distantPlanetMesh);
    scene.add(distantPlanetGroup);

    // 5c. ANIMATED MINI SPACE ROCKET IN DISTANT BACKGROUND
    const rocketGroup = new THREE.Group();
    rocketGroup.position.set(-3.5, 2.0, -4.8);
    rocketGroup.scale.setScalar(0.36);

    // Streamlined Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.85, 16);
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.4
    });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    rocketGroup.add(fuselage);

    // Nose Cone (Electric Cyan)
    const rocketNoseGeo = new THREE.ConeGeometry(0.22, 0.45, 16);
    const rocketNoseMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      roughness: 0.2,
      metalness: 0.5
    });
    const rocketNose = new THREE.Mesh(rocketNoseGeo, rocketNoseMat);
    rocketNose.position.y = 0.65;
    rocketGroup.add(rocketNose);

    // Porthole Window (Glowing cyan)
    const windowGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const cabinWindow = new THREE.Mesh(windowGeo, windowMat);
    cabinWindow.rotation.x = Math.PI / 2;
    cabinWindow.position.set(0, 0.15, 0.2);
    rocketGroup.add(cabinWindow);

    // 3 Aerodynamic Stabilizer Fins
    const finGeo = new THREE.BoxGeometry(0.04, 0.35, 0.25);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const fin1 = new THREE.Mesh(finGeo, finMat); fin1.position.set(0.24, -0.32, 0); rocketGroup.add(fin1);
    const fin2 = new THREE.Mesh(finGeo, finMat); fin2.position.set(-0.24, -0.32, 0); rocketGroup.add(fin2);
    const fin3 = new THREE.Mesh(finGeo, finMat); fin3.rotation.y = Math.PI / 2; fin3.position.set(0, -0.32, -0.24); rocketGroup.add(fin3);

    // Engine Glowing Exhaust Flame (Cyan flame cone with additive glow)
    const flameGeo = new THREE.ConeGeometry(0.16, 0.6, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = -0.7;
    flameMesh.rotation.x = Math.PI;
    rocketGroup.add(flameMesh);

    scene.add(rocketGroup);

    // 6. ROCKY PLANET SURFACE & FOREGROUND TERRAIN (LODAVIA COSMIC GROUND)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -1.05, 0);

    // Planetary Cosmic Terrain Surface
    const terrainGeo = new THREE.CylinderGeometry(2.3, 2.7, 0.32, 48);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x09182d,
      roughness: 0.82,
      metalness: 0.18
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.y = -0.1;
    terrainMesh.receiveShadow = true;
    stageGroup.add(terrainMesh);

    // Sculpted Rocky Boulders around the foreground
    const rockGeo = new THREE.DodecahedronGeometry(1, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f2746,
      roughness: 0.85,
      metalness: 0.15
    });

    const rockConfigs = [
      { pos: [-1.7, 0.05, 0.8], scale: [0.28, 0.22, 0.32], rot: [0.4, 0.8, 0.2] },
      { pos: [1.8, 0.02, 0.7], scale: [0.34, 0.25, 0.3], rot: [0.2, 1.2, 0.5] },
      { pos: [-1.95, -0.05, -0.3], scale: [0.38, 0.3, 0.35], rot: [0.9, 0.3, 0.7] },
      { pos: [1.9, -0.04, -0.4], scale: [0.35, 0.28, 0.32], rot: [0.5, 0.6, 0.3] },
      { pos: [-0.9, -0.02, 1.4], scale: [0.22, 0.16, 0.2], rot: [0.7, 0.4, 0.9] },
      { pos: [1.1, -0.02, 1.35], scale: [0.24, 0.18, 0.22], rot: [0.3, 0.9, 0.4] },
    ];

    rockConfigs.forEach((cfg) => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      rock.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
      rock.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      rock.castShadow = true;
      rock.receiveShadow = true;
      stageGroup.add(rock);
    });

    // Bioluminescent Glowing Cyan Energy Crystals
    const crystalGeo = new THREE.ConeGeometry(0.08, 0.35, 5);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.8
    });

    const crystalPositions = [
      [-1.45, 0.18, 0.65],
      [-1.38, 0.12, 0.75],
      [1.55, 0.16, 0.6],
      [1.65, 0.14, 0.7],
      [-0.75, 0.1, 1.3],
      [0.95, 0.1, 1.25]
    ];

    crystalPositions.forEach((pos, idx) => {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(pos[0], pos[1], pos[2]);
      crystal.rotation.set(idx % 2 === 0 ? 0.2 : -0.2, idx * 0.8, idx % 3 === 0 ? 0.15 : -0.15);
      crystal.scale.setScalar(0.8 + (idx % 3) * 0.3);
      stageGroup.add(crystal);
    });

    // Futuristic Central Landing Pad atop the rock
    const padGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.08, 48);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x051329,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.95
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.08;
    padMesh.receiveShadow = true;
    stageGroup.add(padMesh);

    // Glowing Concentric Electric-Cyan Neon Rings
    const neonRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.025, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.95 })
    );
    neonRing1.rotation.x = Math.PI / 2;
    neonRing1.position.y = 0.13;
    stageGroup.add(neonRing1);

    const neonRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.018, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    neonRing2.rotation.x = Math.PI / 2;
    neonRing2.position.y = 0.135;
    stageGroup.add(neonRing2);

    scene.add(stageGroup);

    // 7. FLOATING COSMIC PARTICLES (ORBITING RAY)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.9 + Math.random() * 1.1;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = -0.6 + Math.random() * 2.2;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleTexture = createCircleParticleTexture();

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. 3D SPACE DOG COMPANION (RIGHT OF RAY)
    const dogGroup = new THREE.Group();
    dogGroup.position.set(0.85, -0.65, 0.25);
    dogGroup.scale.setScalar(0.48);
    dogGroupRef.current = dogGroup;

    // Dog Body
    const dogBodyGeo = new THREE.CapsuleGeometry(0.38, 0.45, 16, 16);
    const dogSuitMat = new THREE.MeshStandardMaterial({
      color: dogSuitColor === 'gold' ? 0xfef08a : (dogSuitColor === 'silver' ? 0xe2e8f0 : 0xf472b6),
      roughness: 0.3,
      metalness: 0.25
    });
    const dogBody = new THREE.Mesh(dogBodyGeo, dogSuitMat);
    dogBody.castShadow = true;
    dogBody.position.y = 0.45;
    dogGroup.add(dogBody);

    // Dog Head
    const dogHeadGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const dogHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const dogHead = new THREE.Mesh(dogHeadGeo, dogHeadMat);
    dogHead.position.set(0, 0.95, 0.1);
    dogHead.castShadow = true;
    dogGroup.add(dogHead);

    // Dog Helmet Glass Visor
    const dogVisorGeo = new THREE.SphereGeometry(0.42, 24, 24);
    const dogVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.4
    });
    const dogVisor = new THREE.Mesh(dogVisorGeo, dogVisorMat);
    dogVisor.position.set(0, 0.95, 0.1);
    dogGroup.add(dogVisor);

    // Golden Collar
    const collarGeo = new THREE.TorusGeometry(0.32, 0.05, 12, 24);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.72, 0.05);
    dogGroup.add(collar);

    // Glowing Paw Tag
    const tagGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const tagMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.position.set(0, 0.64, 0.38);
    dogGroup.add(tag);

    // Dog Eyes
    const dogEyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const dogEyeMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
    const leftEye = new THREE.Mesh(dogEyeGeo, dogEyeMat);
    leftEye.position.set(-0.12, 0.98, 0.42);
    const rightEye = new THREE.Mesh(dogEyeGeo, dogEyeMat);
    rightEye.position.set(0.12, 0.98, 0.42);
    dogGroup.add(leftEye, rightEye);

    // Dog Snout & Nose
    const snoutGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const snout = new THREE.Mesh(snoutGeo, snoutMat);
    snout.position.set(0, 0.88, 0.42);
    const noseGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const noseMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.92, 0.52);
    dogGroup.add(snout, nose);

    // Dog Ears
    const earGeo = new THREE.ConeGeometry(0.12, 0.32, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.28, 1.25, 0.05);
    leftEar.rotation.z = 0.35;
    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.28, 1.25, 0.05);
    rightEar.rotation.z = -0.35;
    dogGroup.add(leftEar, rightEar);

    // Dog Animated Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.35, -0.32);
    const tailGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.35, 12);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    tailMesh.position.set(0, 0.15, -0.08);
    tailMesh.rotation.x = -0.6;
    tailGroup.add(tailMesh);
    dogGroup.add(tailGroup);

    // 4 Paws
    const pawGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const pawMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 });
    const pawFL = new THREE.Mesh(pawGeo, pawMat); pawFL.position.set(-0.2, 0.05, 0.2);
    const pawFR = new THREE.Mesh(pawGeo, pawMat); pawFR.position.set(0.2, 0.05, 0.2);
    const pawBL = new THREE.Mesh(pawGeo, pawMat); pawBL.position.set(-0.2, 0.05, -0.2);
    const pawBR = new THREE.Mesh(pawGeo, pawMat); pawBR.position.set(0.2, 0.05, -0.2);
    dogGroup.add(pawFL, pawFR, pawBL, pawBR);

    scene.add(dogGroup);

    // 9. LOAD AUTHENTIC RAY 3D GLB MODEL
    const rayGroup = new THREE.Group();
    rayGroup.position.set(-0.15, -0.2, 0);
    rayGroupRef.current = rayGroup;
    scene.add(rayGroup);

    const loader = new GLTFLoader();
    const modelUrls = ['/models/textured.glb', '/textured.glb'];

    const tryLoad = (urlIndex: number) => {
      if (urlIndex >= modelUrls.length) {
        if (isMounted) {
          setIsLoading(false);
          setLoadError('تعذر تحميل مجسم Ray 3D');
        }
        return;
      }

      loader.load(
        modelUrls[urlIndex],
        (gltf) => {
          if (!isMounted) return;

          const model = gltf.scene;

          // Check for built-in GLB animation clips
          if (gltf.animations && gltf.animations.length > 0) {
            setHasAnimations(true);
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            mixerRef.current = mixer;
          } else {
            setHasAnimations(false);
          }

          // Enhance mesh materials & shadows
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const applyMatProps = (m: THREE.Material) => {
                  m.needsUpdate = true;
                  if ('roughness' in m) (m as THREE.MeshStandardMaterial).roughness = 0.3;
                  if ('metalness' in m) (m as THREE.MeshStandardMaterial).metalness = 0.18;
                };

                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach(applyMatProps);
                } else {
                  applyMatProps(mesh.material);
                }
              }
            }
          });

          // Calculate bounding box and scale Ray to be large and prominent
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Scale model prominently (~1.65 units height)
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale = 1.65 / (maxDim || 1);
          model.scale.setScalar(targetScale);

          // Center the pivot
          model.position.x = -center.x * targetScale;
          model.position.y = -center.y * targetScale;
          model.position.z = -center.z * targetScale;

          while (rayGroup.children.length > 0) {
            rayGroup.remove(rayGroup.children[0]);
          }
          rayGroup.add(model);

          setIsLoading(false);
          setLoadError(null);
        },
        undefined,
        (err) => {
          console.warn(`Failed loading model at ${modelUrls[urlIndex]}:`, err);
          tryLoad(urlIndex + 1);
        }
      );
    };

    tryLoad(0);

    // 10. ANIMATION & RENDER LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update AnimationMixer if clips exist
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Rotate friendly cute planets with subtle gentle wobbles
      planetGroup.rotation.y = time * 0.05;
      moonGroup.position.y = 1.5 + Math.sin(time * 1.4) * 0.08;
      moonGroup.rotation.y = -time * 0.04;
      distantPlanetGroup.position.y = 2.5 + Math.cos(time * 1.1) * 0.06;
      distantPlanetGroup.rotation.y = time * 0.03;

      // Animate Mini Space Rocket soaring across the background
      const rocketAngle = time * 0.38;
      const rocketRadX = 4.2;
      const rocketRadZ = 1.6;
      rocketGroup.position.x = Math.sin(rocketAngle) * rocketRadX;
      rocketGroup.position.z = -4.6 + Math.cos(rocketAngle) * rocketRadZ;
      rocketGroup.position.y = 1.9 + Math.sin(time * 0.8) * 0.35;
      rocketGroup.rotation.y = -rocketAngle + Math.PI / 2;
      rocketGroup.rotation.z = -Math.PI / 3.8 + Math.cos(time * 1.2) * 0.08;
      flameMesh.scale.y = 0.85 + Math.sin(time * 24) * 0.25;

      // Rotate starfield smoothly
      stars.rotation.y = time * 0.012;

      // Handle Smooth Interaction Rotations
      const state = interactionState.current;
      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.08;
      state.currentRotationX += (state.targetRotationX - state.currentRotationX) * 0.08;

      // Update Dog Tail Wagging & Head
      if (tailGroup) {
        const wagSpeed = stateRef.current === 'happy' ? 24 : 12;
        const wagAmp = stateRef.current === 'happy' ? 0.6 : 0.35;
        tailGroup.rotation.y = Math.sin(time * wagSpeed) * wagAmp;
      }

      // Space Dog Bounce & Breath
      if (dogGroupRef.current) {
        let dogY = -0.65 + Math.sin(time * 2.8 + 0.5) * 0.03;
        if (state.dogBounce > 0) {
          dogY += Math.sin(state.dogBounce * Math.PI) * 0.25;
          state.dogBounce = Math.max(0, state.dogBounce - delta * 2.5);
        }
        dogGroupRef.current.position.y = dogY;
        dogGroupRef.current.rotation.y = 0.2 + Math.sin(time * 1.5) * 0.08 + (state.pointerX * 0.2);
      }

      // Procedural Animation for Ray
      if (rayGroupRef.current) {
        const currentState = stateRef.current;

        // 1. Base Floating / Levitation (Breathing)
        let floatY = -0.2 + Math.sin(time * 2.2) * 0.05;
        let floatRotZ = Math.sin(time * 1.2) * 0.025;
        let floatRotX = state.currentRotationX + (state.pointerY * 0.15);
        let floatRotY = state.currentRotationY + (state.pointerX * 0.25);

        // 2. Character Mood State Modifiers
        if (currentState === 'happy') {
          floatY += Math.abs(Math.sin(time * 5.5)) * 0.12;
          floatRotZ += Math.sin(time * 5.5) * 0.06;
        } else if (currentState === 'thinking') {
          floatRotX -= 0.12;
          floatRotY += 0.22;
          floatY += Math.sin(time * 1.4) * 0.03;
        } else if (currentState === 'talking') {
          floatY += Math.sin(time * 8.0) * 0.03;
          floatRotX += Math.sin(time * 8.0) * 0.03;
        }

        // 3. User Click Bounce / Spin Reactions
        if (state.rayBounce > 0) {
          floatY += Math.sin(state.rayBounce * Math.PI) * 0.35;
          state.rayBounce = Math.max(0, state.rayBounce - delta * 2.2);
        }

        if (state.raySpin > 0) {
          floatRotY += (1 - state.raySpin) * Math.PI * 2;
          state.raySpin = Math.max(0, state.raySpin - delta * 1.8);
        }

        rayGroupRef.current.position.y = floatY;
        rayGroupRef.current.rotation.x = floatRotX;
        rayGroupRef.current.rotation.y = floatRotY;
        rayGroupRef.current.rotation.z = floatRotZ;
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 11. EVENT LISTENERS FOR INTERACTION & RESIZE
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      
      // Keep Ray nicely framed on both desktop and mobile screens
      if (w < 640) {
        cameraRef.current.position.z = 4.2;
      } else {
        cameraRef.current.position.z = 3.6;
      }
      
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse / Touch Move for Look-At and Orbit
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      interactionState.current.pointerX = x;
      interactionState.current.pointerY = y;

      if (interactionState.current.isDragging) {
        const deltaX = e.clientX - interactionState.current.prevMouseX;
        const deltaY = e.clientY - interactionState.current.prevMouseY;

        interactionState.current.targetRotationY += deltaX * 0.008;
        interactionState.current.targetRotationX = Math.max(
          -0.3,
          Math.min(0.3, interactionState.current.targetRotationX + deltaY * 0.005)
        );

        interactionState.current.prevMouseX = e.clientX;
        interactionState.current.prevMouseY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      interactionState.current.isDragging = true;
      interactionState.current.prevMouseX = e.clientX;
      interactionState.current.prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      interactionState.current.isDragging = false;
    };

    // Click Detection with Raycasting
    const handleCanvasClick = (e: MouseEvent) => {
      if (!container || !cameraRef.current || !sceneRef.current) return;

      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Check Dog Click
      if (dogGroupRef.current) {
        const dogHits = raycaster.intersectObjects(dogGroupRef.current.children, true);
        if (dogHits.length > 0) {
          interactionState.current.dogBounce = 1.0;
          playBeep(900, 'triangle', 0.12);
          if (onDogClick) {
            onDogClick({ x: e.clientX, y: e.clientY });
          }
          return;
        }
      }

      // Check Ray Click
      if (rayGroupRef.current) {
        const rayHits = raycaster.intersectObjects(rayGroupRef.current.children, true);
        if (rayHits.length > 0 || (mouse.x > -0.6 && mouse.x < 0.4 && mouse.y > -0.7 && mouse.y < 0.8)) {
          // Trigger joyful jump and spin
          interactionState.current.rayBounce = 1.0;
          if (Math.random() > 0.5) {
            interactionState.current.raySpin = 1.0;
          }
          playBeep(640, 'sine', 0.18);
          if (onRayClick) {
            onRayClick({ x: e.clientX, y: e.clientY });
          }
          return;
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('click', handleCanvasClick);

    // CLEANUP
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('click', handleCanvasClick);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      if (rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, [playBeep, onRayClick, onDogClick, dogSuitColor]);

  return (
    <div className="relative w-full h-full min-h-[520px] select-none overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-20">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <p className="mt-4 text-xs font-black text-cyan-200 tracking-wider">
            جاري تحضير مسرح Ray ورفيقه الفضائي 3D...
          </p>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold z-20">
          {loadError}
        </div>
      )}

      {/* Model Spec Badge Indicator */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-cyan-500/30 text-[10px] text-cyan-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Ray 3D GLB ({hasAnimations ? 'Rigged Clips' : 'Procedural Physics'})</span>
      </div>
    </div>
  );
}
