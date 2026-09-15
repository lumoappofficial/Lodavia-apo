import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles, Compass, Globe, RotateCcw, ZoomIn, ZoomOut, Zap, Radio, Maximize2, Minimize2, Users, Layers, Activity } from 'lucide-react';

// Country Details Interfaces matching LodaviaWorld
export interface LiveVoiceRoom {
  id: string;
  name: string;
  nameAr: string;
  host: string;
  listeners: number;
  tags: string[];
}

export interface LiveStream {
  id: string;
  title: string;
  titleAr: string;
  streamer: string;
  viewers: number;
  category: string;
}

export interface CountryEvent {
  id: string;
  title: string;
  titleAr: string;
  type: 'conference' | 'meetup' | 'tournament' | 'educational';
  typeLabel: string;
  typeLabelAr: string;
  date: string;
  time: string;
  joined: boolean;
}

export interface GlobalCreator {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  avatar: string;
}

export interface CountryDetails {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  onlineCount: number;
  activeCommunities: string[];
  activeCommunitiesAr: string[];
  liveVoiceRooms: LiveVoiceRoom[];
  liveStreams: LiveStream[];
  events: CountryEvent[];
  trendingTopics: string[];
  trendingTopicsAr: string[];
  popularCreators: GlobalCreator[];
  aiTrendingInsights: { en: string; ar: string };
  aiFunFacts: { en: string; ar: string };
}

export interface MapHub {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lon: number;
  color: string;
  glowColor: string;
  details: CountryDetails;
}

// Convert lat/lon on sphere into 3D Cartesian coordinates
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

// Procedural fallback texture generator
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Realistic ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0c2340');
  oceanGrad.addColorStop(0.5, '#194273');
  oceanGrad.addColorStop(1, '#0c2340');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continental landmasses
  ctx.fillStyle = '#2d6a4f';
  // Africa / Europe
  ctx.beginPath();
  ctx.ellipse(540, 240, 75, 115, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Middle East / Arabia
  ctx.fillStyle = '#b08968';
  ctx.beginPath();
  ctx.ellipse(590, 220, 35, 25, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Asia
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(730, 180, 130, 75, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // North America
  ctx.beginPath();
  ctx.ellipse(250, 175, 80, 75, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(320, 340, 55, 95, 0.25, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(820, 360, 48, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createProceduralCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const r = 25 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

interface LodaviaGlobe3DProps {
  lang: string;
  selectedHub: MapHub;
  setSelectedHub: (hub: MapHub) => void;
  activeHubs: MapHub[];
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onEarthClick?: () => void;
}

export default function LodaviaGlobe3D({
  lang,
  selectedHub,
  setSelectedHub,
  activeHubs,
  playSynthSound,
  autoRotate,
  setAutoRotate,
  zoom,
  setZoom,
  onEarthClick
}: LodaviaGlobe3DProps) {
  const isAr = lang === 'ar';
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredHub, setHoveredHub] = useState<MapHub | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hubCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Real telemetry statistics calculated directly from activeHubs data
  const totalActiveUsers = useMemo(
    () => activeHubs.reduce((sum, h) => sum + (h.details?.onlineCount || 0), 0),
    [activeHubs]
  );

  const totalActiveCommunities = useMemo(
    () => activeHubs.reduce((sum, h) => sum + (h.details?.activeCommunities?.length || 0), 0),
    [activeHubs]
  );

  // Active cosmic beacon transmitters & orbital telemetry nodes
  const totalCosmicNodes = useMemo(
    () => activeHubs.length * 4 + 18,
    [activeHubs]
  );

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const nightMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconsGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Synchronized state refs for 60fps loop without re-render closures
  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const selectedHubRef = useRef(selectedHub);
  useEffect(() => {
    selectedHubRef.current = selectedHub;
    updateSelectedHubVisuals();
  }, [selectedHub]);

  const activeHubsRef = useRef(activeHubs);
  useEffect(() => {
    activeHubsRef.current = activeHubs;
    rebuildBeaconsAndArcs();
  }, [activeHubs]);

  const isLerpingCamera = useRef(false);
  const targetCameraPos = useRef(new THREE.Vector3(0, 1.2, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const GLOBE_RADIUS = 2.0;

  // Initialize Three.js 3D WebGL Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100);
    // Position camera facing Middle East / Arabian Peninsula initially
    const initMiddleEastPos = latLonToVector3(24, 45, GLOBE_RADIUS * 2.5);
    camera.position.copy(initMiddleEastPos);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = GLOBE_RADIUS * 1.04; // Extreme close-up zoom for continent inspection
    controls.maxDistance = GLOBE_RADIUS * 5.0; // Zoom out
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controlsRef.current = controls;

    // 5. LIGHTING (High definition crisp illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
    sunLight.position.set(15, 8, 15);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.9);
    rimLight.position.set(-15, -6, -15);
    scene.add(rimLight);

    // 6. REALISTIC ULTRA-SHARP 4K EARTH TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const proceduralTex = createProceduralEarthTexture();
    proceduralTex.colorSpace = THREE.SRGBColorSpace;
    proceduralTex.anisotropy = maxAnisotropy;

    // Primary Earth Day Material with High Poly Sphere (128x128)
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: proceduralTex,
      roughness: 0.45,
      metalness: 0.05,
      bumpScale: 0.06
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.name = 'earth';
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Texture config helper
    const configureTexture = (tex: THREE.Texture, isSRGB = true) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = maxAnisotropy;
      if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    };

    // Load High-Res Textures Asynchronously
    textureLoader.load(
      '/textures/planets/earth-day.jpg',
      (tex) => {
        configureTexture(tex, true);
        earthMat.map = tex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback 4K CDN
        textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (fallbackTex) => {
          configureTexture(fallbackTex, true);
          earthMat.map = fallbackTex;
          earthMat.needsUpdate = true;
        });
      }
    );

    textureLoader.load(
      '/textures/planets/earth-topology.png',
      (bump) => {
        configureTexture(bump, false);
        earthMat.bumpMap = bump;
        earthMat.bumpScale = 0.07;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    textureLoader.load(
      '/textures/planets/earth-water.png',
      (spec) => {
        configureTexture(spec, false);
        earthMat.roughnessMap = spec;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // Subtle Night Lights Layer (Dark side illumination)
    const nightGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.001, 96, 96);
    const nightMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const nightMesh = new THREE.Mesh(nightGeo, nightMat);
    earthMesh.add(nightMesh);
    nightMeshRef.current = nightMesh;

    textureLoader.load(
      '/textures/planets/earth-night.jpg',
      (nightTex) => {
        configureTexture(nightTex, true);
        nightMat.map = nightTex;
        nightMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // Atmospheric Glow Halo Shader
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 64, 64);
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
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.2, 0.7, 1.0, intensity * 0.6);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);
    atmosphereMeshRef.current = atmosMesh;

    // Groups for 3D Beacons and Arcs
    const beaconsGroup = new THREE.Group();
    earthMesh.add(beaconsGroup);
    beaconsGroupRef.current = beaconsGroup;

    const arcsGroup = new THREE.Group();
    earthMesh.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    // Initial build of beacons
    rebuildBeaconsAndArcs();

    // 7. INTERACTIVE RAYCASTING FOR HUBS & EARTH CLICK
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      if (beaconsGroupRef.current) {
        const beaconIntersects = raycaster.intersectObjects(beaconsGroupRef.current.children, true);
        if (beaconIntersects.length > 0) {
          let topObj: THREE.Object3D | null = beaconIntersects[0].object;
          while (topObj && !topObj.userData?.hub && topObj.parent) {
            topObj = topObj.parent;
          }
          if (topObj && topObj.userData?.hub) {
            const clickedHub: MapHub = topObj.userData.hub;
            playSynthSound(750, 'sine', 0.1);
            setSelectedHub(clickedHub);
            focusOnHub(clickedHub);
            return;
          }
        }
      }

      // Check if clicked general Earth surface to trigger onEarthClick (Universe exploration)
      if (onEarthClick) {
        const earthIntersects = raycaster.intersectObject(earthMesh, false);
        if (earthIntersects.length > 0) {
          // Double click or explicit trigger handled in UI
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (beaconsGroupRef.current) {
        const beaconIntersects = raycaster.intersectObjects(beaconsGroupRef.current.children, true);
        if (beaconIntersects.length > 0) {
          let topObj: THREE.Object3D | null = beaconIntersects[0].object;
          while (topObj && !topObj.userData?.hub && topObj.parent) {
            topObj = topObj.parent;
          }
          if (topObj && topObj.userData?.hub) {
            setHoveredHub(topObj.userData.hub);
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
        }
      }
      setHoveredHub(null);
      setTooltipPos(null);
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 8. 60FPS CONTINUOUS ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Earth Axial Rotation (Only when autoRotate is active)
      if (autoRotateRef.current && earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.08 * delta;
      }

      // Clouds rotation slightly faster for atmospheric depth
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.12 * delta;
      }

      // Animate Beacon Signal Pulse Rings
      if (beaconsGroupRef.current) {
        beaconsGroupRef.current.children.forEach((beaconObj) => {
          const ringMesh = beaconObj.getObjectByName('pulseRing') as THREE.Mesh;
          if (ringMesh) {
            const scale = 1.0 + ((elapsedTime * 1.5 + beaconObj.position.x) % 1.0) * 1.8;
            ringMesh.scale.set(scale, scale, scale);
            const mat = ringMesh.material as THREE.MeshBasicMaterial;
            if (mat) {
              mat.opacity = Math.max(0, 1.0 - (scale - 1.0) / 1.8);
            }
          }
        });
      }

      // Animate Bezier Arcs Traveling Pulses (Photons) & Subtle Network Breathing
      if (arcsGroupRef.current) {
        arcsGroupRef.current.children.forEach((child) => {
          if (child.name === 'arcPulse' && child.userData?.curve) {
            const { curve, speed, offset } = child.userData;
            const t = (elapsedTime * speed + offset) % 1.0;
            const pos = curve.getPoint(t);
            child.position.copy(pos);
          } else if (child.userData?.isArcLine) {
            const line = child as THREE.Line;
            const mat = line.material as THREE.LineBasicMaterial;
            if (mat && !child.userData.isConnectedToSelected) {
              mat.opacity = 0.35 + Math.sin(elapsedTime * 2.2 + (child.id % 5)) * 0.15;
            }
          }
        });
      }

      // Project 3D Active Hubs to 2D HTML Floating Cards on Screen
      if (earthMeshRef.current && cameraRef.current && containerRef.current) {
        const camera = cameraRef.current;
        const earthMatrix = earthMeshRef.current.matrixWorld;
        const camPos = camera.position;
        const stageWidth = containerRef.current.clientWidth || 500;
        const stageHeight = containerRef.current.clientHeight || 500;

        activeHubsRef.current.forEach((hub) => {
          const cardEl = hubCardRefs.current[hub.id];
          if (!cardEl) return;

          const localPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
          const worldPos = localPos.clone().applyMatrix4(earthMatrix);

          // Check if on hemisphere facing the camera
          const normal = worldPos.clone().normalize();
          const toCam = camPos.clone().sub(worldPos).normalize();
          const dot = normal.dot(toCam);

          if (dot > 0.12) {
            const projected = worldPos.clone().project(camera);
            const x = ((projected.x + 1) / 2) * stageWidth;
            const y = ((-projected.y + 1) / 2) * stageHeight;

            // Constrain within visible viewport padding
            if (x >= 40 && x <= stageWidth - 40 && y >= 35 && y <= stageHeight - 35) {
              cardEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -120%)`;
              cardEl.style.opacity = '1';
              cardEl.style.pointerEvents = 'auto';
            } else {
              cardEl.style.opacity = '0';
              cardEl.style.pointerEvents = 'none';
            }
          } else {
            cardEl.style.opacity = '0';
            cardEl.style.pointerEvents = 'none';
          }
        });
      }

      // Smooth Camera Lerping to selected hub
      if (isLerpingCamera.current) {
        camera.position.lerp(targetCameraPos.current, 0.08);
        controls.target.lerp(targetLookAt.current, 0.08);

        if (
          camera.position.distanceTo(targetCameraPos.current) < 0.08 &&
          controls.target.distanceTo(targetLookAt.current) < 0.08
        ) {
          isLerpingCamera.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle container resizing
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 500;
      const h = mountRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (mountRef.current) resizeObserver.observe(mountRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener('pointerdown', handlePointerDown);
        rendererRef.current.domElement.removeEventListener('pointermove', handlePointerMove);
      }
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      scene.clear();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Rebuild 3D Hub Beacons and Connecting Bezier Arcs
  const rebuildBeaconsAndArcs = () => {
    if (!beaconsGroupRef.current || !arcsGroupRef.current) return;

    // Clear existing
    while (beaconsGroupRef.current.children.length > 0) {
      beaconsGroupRef.current.remove(beaconsGroupRef.current.children[0]);
    }
    while (arcsGroupRef.current.children.length > 0) {
      arcsGroupRef.current.remove(arcsGroupRef.current.children[0]);
    }

    const currentSelected = selectedHubRef.current;
    const hubs = activeHubsRef.current;

    // Create 3D Beacons for each country hub
    hubs.forEach((hub) => {
      const isSelected = currentSelected && currentSelected.id === hub.id;
      const surfacePos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);

      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(surfacePos);
      beaconGroup.userData = { hub };

      // Orient beacon outward from sphere center
      beaconGroup.lookAt(surfacePos.clone().multiplyScalar(2));

      // Core Marker Sphere (Electric Cyan)
      const markerGeo = new THREE.SphereGeometry(isSelected ? 0.045 : 0.03, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : 0x00f0ff,
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      beaconGroup.add(markerMesh);

      // Vertical Laser Beam projecting into space
      const beamHeight = isSelected ? 0.38 : 0.24;
      const beamGeo = new THREE.CylinderGeometry(0.007, 0.007, beamHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x38bdf8 : 0x06b6d4,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.65,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.z = beamHeight / 2;
      beamMesh.rotation.x = Math.PI / 2;
      beaconGroup.add(beamMesh);

      // Pulse Signal Ring
      const ringGeo = new THREE.RingGeometry(0.04, 0.065, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x00f0ff : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'pulseRing';
      beaconGroup.add(ringMesh);

      beaconsGroupRef.current.add(beaconGroup);
    });

    // Create Glowing Bezier Connecting Arcs between active hubs (Electric Cyan / Sky Blue)
    if (hubs.length > 1) {
      const connectedPairs = new Set<string>();

      const addArc = (hubA: MapHub, hubB: MapHub, isPrimary: boolean = false) => {
        const pairKey = [hubA.id, hubB.id].sort().join('-');
        if (connectedPairs.has(pairKey)) return;
        connectedPairs.add(pairKey);

        const pA = latLonToVector3(hubA.lat, hubA.lon, GLOBE_RADIUS);
        const pB = latLonToVector3(hubB.lat, hubB.lon, GLOBE_RADIUS);
        const dist = pA.distanceTo(pB);

        // Arc height proportional to distance across globe
        const midPoint = pA.clone().add(pB).multiplyScalar(0.5);
        const arcAltitude = GLOBE_RADIUS + Math.min(dist * 0.42, 1.15);
        midPoint.setLength(arcAltitude);

        const curve = new THREE.QuadraticBezierCurve3(pA, midPoint, pB);
        const points = curve.getPoints(42);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

        const isConnectedToSelected = currentSelected && (currentSelected.id === hubA.id || currentSelected.id === hubB.id);

        const curveMat = new THREE.LineBasicMaterial({
          color: isConnectedToSelected ? 0x00f0ff : (isPrimary ? 0x38bdf8 : 0x0284c7),
          transparent: true,
          opacity: isConnectedToSelected ? 0.85 : 0.45,
          linewidth: isConnectedToSelected ? 2 : 1
        });

        const arcLine = new THREE.Line(curveGeo, curveMat);
        arcLine.userData = { isArcLine: true, isConnectedToSelected };
        arcsGroupRef.current!.add(arcLine);

        // Continuous Traveling Light Pulse (Photon) along the arc
        const pulseGeo = new THREE.SphereGeometry(isConnectedToSelected ? 0.03 : 0.02, 10, 10);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: isConnectedToSelected ? 0xffffff : 0x22d3ee,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        pulseMesh.name = 'arcPulse';
        pulseMesh.userData = {
          curve,
          speed: 0.25 + (connectedPairs.size % 4) * 0.08,
          offset: (connectedPairs.size * 0.33) % 1.0
        };
        arcsGroupRef.current!.add(pulseMesh);
      };

      // 1. Connect selected hub to other hubs (Primary highlighted connections)
      if (currentSelected) {
        hubs.forEach((hub) => {
          if (hub.id !== currentSelected.id) {
            addArc(currentSelected, hub, true);
          }
        });
      }

      // 2. Inter-hub mesh network connecting active hubs across continents
      for (let i = 0; i < hubs.length; i++) {
        const nextHub = hubs[(i + 1) % hubs.length];
        addArc(hubs[i], nextHub, false);

        if (hubs.length > 3) {
          const crossHub = hubs[(i + 2) % hubs.length];
          addArc(hubs[i], crossHub, false);
        }
      }
    }
  };

  // Update Visuals when selected hub changes
  const updateSelectedHubVisuals = () => {
    rebuildBeaconsAndArcs();
  };

  // Focus Camera onto selected hub
  const focusOnHub = (hub: MapHub) => {
    if (!cameraRef.current || !controlsRef.current || !earthMeshRef.current) return;

    // Compute surface coordinates
    const targetSurface = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
    
    // Position camera at comfortable inspection distance in front of country
    const camOffset = targetSurface.clone().setLength(GLOBE_RADIUS * 2.2);
    targetCameraPos.current.copy(camOffset);
    targetLookAt.current.set(0, 0, 0);

    isLerpingCamera.current = true;
  };

  // Reset view to Middle East (KSA/Arabia)
  const handleResetView = () => {
    playSynthSound(600, 'sine', 0.1);
    setZoom(140);
    const ksaPos = latLonToVector3(24.7, 46.7, GLOBE_RADIUS * 2.3);
    targetCameraPos.current.copy(ksaPos);
    targetLookAt.current.set(0, 0, 0);
    isLerpingCamera.current = true;
  };

  // Zoom controls
  const handleZoomIn = () => {
    playSynthSound(550, 'sine', 0.04);
    if (cameraRef.current && controlsRef.current) {
      const target = controlsRef.current.target;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const minDist = controlsRef.current.minDistance;
      const newDist = Math.max(currentDist * 0.78, minDist + 0.05);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
      controlsRef.current.update();
      setZoom(prev => Math.min(220, prev + 20));
    }
  };

  const handleZoomOut = () => {
    playSynthSound(450, 'sine', 0.04);
    if (cameraRef.current && controlsRef.current) {
      const target = controlsRef.current.target;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const maxDist = controlsRef.current.maxDistance;
      const newDist = Math.min(currentDist * 1.25, maxDist - 0.2);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
      controlsRef.current.update();
      setZoom(prev => Math.max(80, prev - 20));
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* 3D WebGL Photorealistic Earth Stage */}
      <div 
        ref={containerRef}
        className={`w-full max-w-2xl aspect-square relative z-10 select-none rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-[#02030a] ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen max-w-none' : 'h-[440px] sm:h-[480px] md:h-[520px]'
        }`}
        id="lodavia-earth-stage"
        onDoubleClick={handleResetView}
      >
        {/* Mounting Canvas for Three.js */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Tooltip for Hovered Country Pin */}
        {hoveredHub && tooltipPos && (
          <div 
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-xl bg-black/90 border border-cyan-400 text-white backdrop-blur-md shadow-xl flex items-center gap-2 animate-[fadeIn_0.15s_ease-out]"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <span className="text-base">{hoveredHub.details.flag}</span>
            <div>
              <p className="text-xs font-black text-white leading-none">
                {isAr ? hoveredHub.nameAr : hoveredHub.name}
              </p>
              <span className="text-[9px] font-bold text-emerald-400 font-mono">
                ● {hoveredHub.details.onlineCount.toLocaleString()} {isAr ? 'متصل' : 'online'}
              </span>
            </div>
          </div>
        )}

        {/* Floating Glass Cards Beside Each Active Hub */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {activeHubs.map((hub) => {
            const isSelected = selectedHub && selectedHub.id === hub.id;
            return (
              <div
                key={hub.id}
                ref={(el) => {
                  hubCardRefs.current[hub.id] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playSynthSound(750, 'sine', 0.1);
                  setSelectedHub(hub);
                  focusOnHub(hub);
                }}
                className="absolute top-0 left-0 transition-opacity duration-150 cursor-pointer select-none"
                style={{ opacity: 0, transform: 'translate3d(-9999px, -9999px, 0)' }}
              >
                <div
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 sm:gap-2 shadow-xl transition-all ${
                    isSelected
                      ? 'bg-cyan-950/90 border-2 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400/30'
                      : 'bg-black/80 border border-cyan-500/40 text-slate-200 hover:border-cyan-400 hover:text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  }`}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0">
                    <span>{hub.details.flag}</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-black text-[10px] sm:text-[11px] truncate max-w-[80px] sm:max-w-[110px]">
                      {isAr ? hub.nameAr : hub.name}
                    </span>
                    <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="font-bold">{hub.details.onlineCount.toLocaleString()}</span>
                      <span className="text-slate-400 text-[7px] sm:text-[8px]">{isAr ? 'نشط' : 'live'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Badges & Quick Action Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/75 border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>{isAr ? 'مجسم الأرض الواقعي 3D' : 'Realistic 3D Earth'}</span>
            </span>

            {onEarthClick && (
              <button
                onClick={onEarthClick}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/90 via-sky-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black tracking-wider transition-all border border-cyan-400/50 shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1"
                title={isAr ? 'الانتقال إلى المجموعة الشمسية' : 'Explore Solar System'}
              >
                <Sparkles className="w-3 h-3 text-cyan-200" />
                <span>{isAr ? 'المجموعة الشمسية 🪐' : 'Solar System 🪐'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setAutoRotate(!autoRotate);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all border cursor-pointer flex items-center gap-1 backdrop-blur-md shadow-md ${
                autoRotate
                  ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/50'
                  : 'bg-black/60 text-slate-400 border-white/10'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{isAr ? (autoRotate ? 'دوران نشط' : 'متوقف') : (autoRotate ? 'Rotating' : 'Paused')}</span>
            </button>

            <button
              onClick={() => {
                playSynthSound(600, 'sine', 0.05);
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all"
              title={isAr ? 'ملء الشاشة' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Floating Corner Control Dock */}
        <div className="absolute top-14 right-3 z-20 pointer-events-auto flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-black/80 border border-cyan-500/40 backdrop-blur-md shadow-2xl">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/5 hover:border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            title={isAr ? 'تكبير (+)' : 'Zoom In (+)'}
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
          </button>

          <button
            onClick={handleZoomOut}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/5 hover:border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            title={isAr ? 'تصغير (-)' : 'Zoom Out (-)'}
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
          </button>

          <button
            onClick={handleResetView}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/5 hover:border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            title={isAr ? 'إعادة ضبط الزاوية (الشرق الأوسط)' : 'Reset Angle (Middle East)'}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
          </button>

          <button
            onClick={() => {
              playSynthSound(700, 'sine', 0.08);
              if (selectedHub) {
                focusOnHub(selectedHub);
              }
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm border ${
              selectedHub
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
            }`}
            title={isAr ? 'تتبع المحور النشط' : 'Track Active Hub'}
          >
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-cyan-400" />
          </button>
        </div>

        {/* Selected Hub Floating Card on Bottom Left */}
        {selectedHub && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-auto max-w-[240px] sm:max-w-xs p-2.5 rounded-2xl bg-black/85 border border-cyan-500/40 text-white backdrop-blur-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedHub.details.flag}</span>
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider block">
                  {isAr ? 'الدولة المحددة 🛰️' : 'Selected Hub 🛰️'}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                  {isAr ? selectedHub.nameAr : selectedHub.name}
                </h4>
              </div>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">{isAr ? 'المستخدمين الآن:' : 'Live Online:'}</span>
              <span className="text-emerald-400 font-bold">● {selectedHub.details.onlineCount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* HORIZONTAL TELEMETRY STATS BAR (4 Balanced Cards directly below globe) */}
      <div className="w-full max-w-2xl mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 z-10 select-none">
        {/* Card 1: Active Users */}
        <div className="p-3 rounded-2xl bg-[#030712]/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all backdrop-blur-xl shadow-lg shadow-cyan-950/20 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'المستخدمين النشطين' : 'Active Users'}
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {isAr ? 'حي' : 'Live'}
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
              {totalActiveUsers.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              {isAr ? 'متصل' : 'online'}
            </span>
          </div>
        </div>

        {/* Card 2: Active Communities */}
        <div className="p-3 rounded-2xl bg-[#030712]/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all backdrop-blur-xl shadow-lg shadow-cyan-950/20 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'المجتمعات النشطة' : 'Communities'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[9px] font-mono text-cyan-300 font-bold">
              {isAr ? 'متزامنة' : 'Synced'}
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
              {totalActiveCommunities.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              {isAr ? 'مجتمع' : 'groups'}
            </span>
          </div>
        </div>

        {/* Card 3: Cosmic Nodes / Stars */}
        <div className="p-3 rounded-2xl bg-[#030712]/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all backdrop-blur-xl shadow-lg shadow-cyan-950/20 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'النقاط المضيئة' : 'Cosmic Nodes'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-[9px] font-mono text-sky-300 font-bold">
              {isAr ? 'نبض' : 'Pulse'}
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
              {totalCosmicNodes.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              {isAr ? 'إشارة' : 'nodes'}
            </span>
          </div>
        </div>

        {/* Card 4: Connected Countries */}
        <div className="p-3 rounded-2xl bg-[#030712]/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all backdrop-blur-xl shadow-lg shadow-cyan-950/20 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'الدول المتصلة' : 'Connected Hubs'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-mono text-cyan-400 font-bold">
              {isAr ? 'عالمي' : 'Global'}
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
              {activeHubs.length}
            </span>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              {isAr ? 'دولة' : 'hubs'}
            </span>
          </div>
        </div>
      </div>

      {/* LUXURY CONTROL & NAVIGATION BAR */}
      <div className="w-full mt-2.5 p-3.5 rounded-2xl md:rounded-3xl bg-[#0a0d18] border border-cyan-500/30 text-white backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10 shadow-2xl">
        
        {/* Hub Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
          {activeHubs.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => {
                  playSynthSound(650, 'sine', 0.05);
                  setSelectedHub(hub);
                  focusOnHub(hub);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{hub.details.flag}</span>
                <span>{isAr ? hub.nameAr : hub.name}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleResetView}
            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isAr ? 'الشرق الأوسط 🇸🇦' : 'Center KSA 🇸🇦'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button 
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-white transition-all active:scale-95"
              title={isAr ? 'تكبير' : 'Zoom In'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-white transition-all active:scale-95"
              title={isAr ? 'تصغير' : 'Zoom Out'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
