import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Sparkles, Compass, Sliders, Globe } from 'lucide-react';

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

// Polygon coordinates of main continents for realistic procedural rendering
const continents = [
  // North America
  [
    { lat: 70, lon: -165 }, { lat: 75, lon: -120 }, { lat: 75, lon: -80 }, { lat: 80, lon: -40 },
    { lat: 60, lon: -45 }, { lat: 50, lon: -50 }, { lat: 25, lon: -80 }, { lat: 15, lon: -80 },
    { lat: 8, lon: -80 }, { lat: 15, lon: -100 }, { lat: 30, lon: -115 }, { lat: 45, lon: -125 },
    { lat: 60, lon: -165 }
  ],
  // South America
  [
    { lat: 12, lon: -72 }, { lat: 5, lon: -50 }, { lat: -5, lon: -35 }, { lat: -20, lon: -40 },
    { lat: -35, lon: -50 }, { lat: -55, lon: -65 }, { lat: -50, lon: -75 }, { lat: -35, lon: -73 },
    { lat: -20, lon: -70 }, { lat: -5, lon: -80 }, { lat: 5, lon: -75 }
  ],
  // Europe, Asia & Africa (connected landmasses)
  [
    { lat: 70, lon: -10 }, { lat: 75, lon: 20 }, { lat: 75, lon: 60 }, { lat: 75, lon: 100 },
    { lat: 70, lon: 160 }, { lat: 55, lon: 160 }, { lat: 40, lon: 145 }, { lat: 35, lon: 140 },
    { lat: 20, lon: 120 }, { lat: 10, lon: 105 }, { lat: 5, lon: 95 }, { lat: 10, lon: 80 },
    { lat: 25, lon: 65 }, { lat: 15, lon: 45 }, { lat: 12, lon: 43 }, { lat: 5, lon: 45 },
    { lat: -15, lon: 40 }, { lat: -35, lon: 20 }, { lat: -30, lon: 15 }, { lat: -10, lon: 12 },
    { lat: 5, lon: 10 }, { lat: 15, lon: -15 }, { lat: 30, lon: -15 }, { lat: 40, lon: -10 },
    { lat: 50, lon: -5 }, { lat: 60, lon: 5 }, { lat: 65, lon: 0 }
  ],
  // Australia
  [
    { lat: -12, lon: 130 }, { lat: -15, lon: 145 }, { lat: -25, lon: 153 }, { lat: -35, lon: 150 },
    { lat: -38, lon: 145 }, { lat: -35, lon: 115 }, { lat: -22, lon: 113 }, { lat: -15, lon: 120 }
  ],
  // Greenland
  [
    { lat: 78, lon: -70 }, { lat: 82, lon: -40 }, { lat: 70, lon: -30 }, { lat: 60, lon: -45 },
    { lat: 65, lon: -55 }, { lat: 75, lon: -60 }
  ]
];

// Major city lights coordinates
const cityLights = [
  { lat: 24.7136, lon: 46.6753, name: 'Riyadh' },
  { lat: 21.4858, lon: 39.1925, name: 'Jeddah' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  { lat: 52.5200, lon: 13.4050, name: 'Berlin' },
  { lat: 30.0444, lon: 31.2357, name: 'Cairo' },
  { lat: 40.7128, lon: -74.0060, name: 'New York' },
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
  { lat: 51.5074, lon: -0.1278, name: 'London' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris' }
];

// Check if a specific lat/lon is on land using our raycasting polygons
function isLand(lat: number, lon: number): boolean {
  for (const poly of continents) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const pi = poly[i];
      const pj = poly[j];
      const intersect = ((pi.lat > lat) !== (pj.lat > lat))
          && (lon < (pj.lon - pi.lon) * (lat - pi.lat) / (pj.lat - pi.lat) + pi.lon);
      if (intersect) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
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
  setZoom
}: {
  lang: 'ar' | 'en';
  selectedHub: MapHub;
  setSelectedHub: (hub: MapHub) => void;
  activeHubs: MapHub[];
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Local state for 3D sphere angles
  const [rotation, setRotation] = useState<number>(45); // horizontal spin
  const [tilt, setTilt] = useState<number>(18); // vertical tilt

  // Dragging and inertia physics refs
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });
  const spinVelocity = useRef(0);
  const tiltVelocity = useRef(0);

  // Lodavia AI physical location on the globe in 3D
  const lumiPos = useRef({ x: 0, y: 150, z: 0 });

  // Precalculate detailed points cloud representing world landmasses
  const landPoints = useMemo(() => {
    const points: Array<{ lat: number; lon: number }> = [];
    const step = 3.2; // Density of holographic land nodes
    for (let lat = -60; lat <= 75; lat += step) {
      for (let lon = -180; lon <= 180; lon += step) {
        if (isLand(lat, lon)) {
          points.push({ lat, lon });
        }
      }
    }
    return points;
  }, []);

  // Reset coordinates back to Middle East / KSA center
  const handleResetView = () => {
    playSynthSound(600, 'sine', 0.1);
    setZoom(140);
    // Smoothly set rotation and tilt to target Middle East
    spinVelocity.current = 0;
    tiltVelocity.current = 0;
    setRotation(315); // angle facing Arabia/Middle East
    setTilt(20);
  };

  // Convert lat/lon on sphere of radius R into 3D Cartesian coordinates
  const latLonTo3D = (lat: number, lon: number, r: number) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    return {
      x: r * Math.cos(phi) * Math.sin(lambda),
      y: r * Math.sin(phi),
      z: r * Math.cos(phi) * Math.cos(lambda)
    };
  };

  // Rotate a 3D coordinate around Y (horizontal spin) and then X (vertical tilt)
  const project3DToCanvas = (
    x3d: number,
    y3d: number,
    z3d: number,
    rotDeg: number,
    tiltDeg: number,
    width: number,
    height: number
  ) => {
    const theta = (rotDeg * Math.PI) / 180;
    const psi = (tiltDeg * Math.PI) / 180;

    // Rotate around Y-axis (Spin)
    const x1 = x3d * Math.cos(theta) - z3d * Math.sin(theta);
    const y1 = y3d;
    const z1 = x3d * Math.sin(theta) + z3d * Math.cos(theta);

    // Rotate around X-axis (Tilt)
    const x2 = x1;
    const y2 = y1 * Math.cos(psi) - z1 * Math.sin(psi);
    const z2 = y1 * Math.sin(psi) + z1 * Math.cos(psi);

    return {
      x: width / 2 + x2,
      y: height / 2 - y2, // Canvas Y coordinates go down
      z: z2,
      visible: z2 > 0 // point on front hemisphere facing screen
    };
  };

  // Store label hit-test areas to handle clicks/hover directly on the canvas
  interface LabelHitArea {
    hub: MapHub;
    x: number;
    y: number;
    w: number;
    h: number;
  }
  const labelHitAreas = useRef<LabelHitArea[]>([]);

  // Mouse Interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePos.current = { x: e.clientX, y: e.clientY };
    spinVelocity.current = 0;
    tiltVelocity.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging.current) {
      const deltaX = e.clientX - previousMousePos.current.x;
      const deltaY = e.clientY - previousMousePos.current.y;

      // Update rotation & tilt relative to cursor movement
      setRotation(prev => (prev - deltaX * 0.45 + 360) % 360);
      setTilt(prev => Math.max(-45, Math.min(65, prev + deltaY * 0.45)));

      spinVelocity.current = -deltaX * 0.45;
      tiltVelocity.current = deltaY * 0.45;

      previousMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      // Check if hovering any interactive country label bounding box
      let hovering = false;
      for (const area of labelHitAreas.current) {
        if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
          hovering = true;
          break;
        }
      }
      canvas.style.cursor = hovering ? 'pointer' : 'grab';
    }
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check hit boxes of active country labels
    for (const area of labelHitAreas.current) {
      if (mx >= area.x && mx <= area.x + area.w && my >= area.y && my <= area.y + area.h) {
        playSynthSound(523.25, 'sine', 0.1); // C5 node ping
        setSelectedHub(area.hub);
        break;
      }
    }
  };

  // Mobile Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    previousMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    spinVelocity.current = 0;
    tiltVelocity.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePos.current.x;
    const deltaY = e.touches[0].clientY - previousMousePos.current.y;

    setRotation(prev => (prev - deltaX * 0.5 + 360) % 360);
    setTilt(prev => Math.max(-45, Math.min(65, prev + deltaY * 0.5)));

    spinVelocity.current = -deltaX * 0.5;
    tiltVelocity.current = deltaY * 0.5;

    previousMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Main high fidelity render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.016; // increment approximate elapsed time

      const width = canvas.width;
      const height = canvas.height;

      // Base globe radius dynamically derived from zoom/aspect ratio
      const r = Math.min(width, height) * 0.3 * (zoom / 140);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Apply drag momentum/inertia friction
      if (!isDragging.current) {
        if (autoRotate) {
          setRotation(prev => (prev + 0.12) % 360);
        } else {
          // Slow decay inertia spin
          if (Math.abs(spinVelocity.current) > 0.05) {
            setRotation(prev => (prev + spinVelocity.current + 360) % 360);
            spinVelocity.current *= 0.94;
          }
          if (Math.abs(tiltVelocity.current) > 0.05) {
            setTilt(prev => Math.max(-45, Math.min(65, prev + tiltVelocity.current)));
            tiltVelocity.current *= 0.94;
          }
        }
      }

      // Clear out older hit-box structures
      labelHitAreas.current = [];

      // ----------------- DRAWING LAYERS -----------------

      // 1. EARTH ATMOSPHERIC EMISSIVE OUTER GLOW (Back hemisphere)
      const glowGrad = ctx.createRadialGradient(width / 2, height / 2, r * 0.92, width / 2, height / 2, r * 1.15);
      glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.16)'); // Cyan
      glowGrad.addColorStop(0.3, 'rgba(124, 58, 237, 0.08)'); // Purple aura
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. ORBITING CONNECTOR PATHS (Back Hemisphere portion)
      // We render segments of orbits that lie behind the globe (z3d < 0)
      const drawOrbitHalf = (orbitRadius: number, orbitColor: string, isFront: boolean, speedMult: number) => {
        ctx.beginPath();
        let activeLine = false;

        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2;
          
          // Generate 3D point on tilted plane
          const rawX = Math.cos(angle) * orbitRadius;
          const rawY = Math.sin(angle) * 0.25 * orbitRadius; // Tilted elevation
          const rawZ = Math.sin(angle) * orbitRadius;

          // Orbit animation drift
          const spinOffset = time * speedMult;
          const x3d = rawX * Math.cos(spinOffset) - rawZ * Math.sin(spinOffset);
          const y3d = rawY;
          const z3d = rawX * Math.sin(spinOffset) + rawZ * Math.cos(spinOffset);

          const proj = project3DToCanvas(x3d, y3d, z3d, rotation, tilt, width, height);

          // Render only back points if isFront=false, or front points if isFront=true
          const isPointFront = proj.z > 0;
          if (isPointFront === isFront) {
            if (!activeLine) {
              ctx.moveTo(proj.x, proj.y);
              activeLine = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          } else {
            activeLine = false;
          }
        }
        ctx.strokeStyle = orbitColor;
        ctx.lineWidth = isFront ? 1.5 : 0.65;
        ctx.stroke();
      };

      // Draw orbit back rings (behind Earth)
      drawOrbitHalf(r * 1.35, 'rgba(34, 211, 238, 0.08)', false, 0.15);
      drawOrbitHalf(r * 1.5, 'rgba(251, 191, 36, 0.05)', false, -0.1);

      // 3. EARTH DEEP NAVY OCEAN BODY (Clipped to perfect circle)
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.clip();

      const oceanGrad = ctx.createRadialGradient(width / 2 - r * 0.25, height / 2 - r * 0.25, 0, width / 2, height / 2, r);
      oceanGrad.addColorStop(0, '#040d21'); // Shallow neon lit center
      oceanGrad.addColorStop(0.5, '#020612'); // Dark abyssal blue
      oceanGrad.addColorStop(1, '#000104'); // Shadow rim
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(width / 2 - r, height / 2 - r, r * 2, r * 2);

      // Draw cyber latitude & longitude line meshes curved on the sphere
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
      ctx.lineWidth = 1;
      
      // Draw Latitude grid lines
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const coords = latLonTo3D(lat, lon, r);
          const proj = project3DToCanvas(coords.x, coords.y, coords.z, rotation, tilt, width, height);
          if (proj.visible) {
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      }

      // Draw Longitude grid lines
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const coords = latLonTo3D(lat, lon, r);
          const proj = project3DToCanvas(coords.x, coords.y, coords.z, rotation, tilt, width, height);
          if (proj.visible) {
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      }

      // 4. HOLOGRAPHIC LANDMASS CONCRETE CONTINENT CLOUD (Dots matrix)
      landPoints.forEach(pt => {
        const coords = latLonTo3D(pt.lat, pt.lon, r);
        const proj = project3DToCanvas(coords.x, coords.y, coords.z, rotation, tilt, width, height);

        if (proj.visible) {
          // Glow intensity depending on distance to screen center
          const glow = Math.min(1.0, proj.z / r);
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${0.12 + glow * 0.45})`;
          ctx.fill();
        }
      });

      // 5. DEEP SPACE WEATHER CLOUDS / ATMOSPHERE LAYER (Very slow procedural swirling)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < 20; i++) {
        // Create soft atmospheric clouds shifting
        const thetaCloud = rotation * 0.8 + (i * 20);
        const latCloud = 15 + Math.sin(time * 0.05 + i) * 30;
        const lonCloud = Math.sin(time * 0.02 + i) * 180;
        const coords = latLonTo3D(latCloud, lonCloud, r * 1.015);
        const proj = project3DToCanvas(coords.x, coords.y, coords.z, thetaCloud, tilt, width, height);

        if (proj.visible) {
          const cloudRadius = r * (0.15 + Math.sin(time * 0.08 + i) * 0.05);
          const cloudGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, cloudRadius);
          cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
          cloudGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
          cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, cloudRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. CITY NIGHT LIGHTS (Golden warm star nodes)
      cityLights.forEach(light => {
        const coords = latLonTo3D(light.lat, light.lon, r);
        const proj = project3DToCanvas(coords.x, coords.y, coords.z, rotation, tilt, width, height);

        if (proj.visible) {
          const coreGlow = 0.55 + Math.sin(time * 2.5 + light.lat) * 0.25;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${coreGlow})`;
          ctx.fill();

          // Soft light aura
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 4.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 63, 94, ${coreGlow * 0.35})`; // Rose outline glow
          ctx.fill();
        }
      });

      // Restore earth ocean clip
      ctx.restore();

      // 7. ORBITING CONNECTOR PATHS (Front Hemisphere portion)
      drawOrbitHalf(r * 1.35, 'rgba(34, 211, 238, 0.42)', true, 0.15);
      drawOrbitHalf(r * 1.5, 'rgba(251, 191, 36, 0.28)', true, -0.1);

      // 8. INTERACTIVE ACTIVE COUNTRY HUB BEACONS & SHIELD TRAILS
      activeHubs.forEach(hub => {
        const coords = latLonTo3D(hub.lat, hub.lon, r);
        const proj = project3DToCanvas(coords.x, coords.y, coords.z, rotation, tilt, width, height);
        const isSelected = selectedHub.id === hub.id;

        if (proj.visible) {
          const color = hub.glowColor;
          
          // Draw multiple expanding concentric signal rings
          const pulseFactor = (time * 1.2 + hub.lat) % 1.0;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.0 - pulseFactor;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 3 + pulseFactor * 12, 0, Math.PI * 2);
          ctx.stroke();

          // Draw solid core beacon marker
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, isSelected ? 4.5 : 3.0, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#ffffff' : color;
          ctx.fill();

          // Vertical sci-fi coordinate projection wire (ascending beam)
          const normal = { x: coords.x / r, y: coords.y / r, z: coords.z / r };
          const beamHeight = r * 0.12;
          const beamTopCoords = {
            x: coords.x + normal.x * beamHeight,
            y: coords.y + normal.y * beamHeight,
            z: coords.z + normal.z * beamHeight
          };
          const topProj = project3DToCanvas(beamTopCoords.x, beamTopCoords.y, beamTopCoords.z, rotation, tilt, width, height);

          // Draw neon beam line
          const beamGrad = ctx.createLinearGradient(proj.x, proj.y, topProj.x, topProj.y);
          beamGrad.addColorStop(0, color);
          beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = isSelected ? 2.0 : 1.0;
          ctx.beginPath();
          ctx.moveTo(proj.x, proj.y);
          ctx.lineTo(topProj.x, topProj.y);
          ctx.stroke();

          // 9. SCI-FI CONNECTING DATA ARCS BETWEEN COUNTRIES
          // Draw smooth bezier curved bridges linking the current country to the selected country!
          if (isSelected) {
            // Target elevated beam point
            const targetCoords = latLonTo3D(hub.lat, hub.lon, r);
            const targetNormal = { x: targetCoords.x / r, y: targetCoords.y / r, z: targetCoords.z / r };
            const targetBeamTop = {
              x: targetCoords.x + targetNormal.x * (r * 0.12),
              y: targetCoords.y + targetNormal.y * (r * 0.12),
              z: targetCoords.z + targetNormal.z * (r * 0.12)
            };

            // Loop and draw links to all OTHER active hubs
            activeHubs.forEach(otherHub => {
              if (otherHub.id === hub.id) return;

              const otherCoords = latLonTo3D(otherHub.lat, otherHub.lon, r);
              const otherProj = project3DToCanvas(otherCoords.x, otherCoords.y, otherCoords.z, rotation, tilt, width, height);

              // Only render the network link if the other hub is on screen too
              if (otherProj.visible) {
                const otherNormal = { x: otherCoords.x / r, y: otherCoords.y / r, z: otherCoords.z / r };
                const otherBeamTop = {
                  x: otherCoords.x + otherNormal.x * (r * 0.12),
                  y: otherCoords.y + otherNormal.y * (r * 0.12),
                  z: otherCoords.z + otherNormal.z * (r * 0.12)
                };

                // Compute high-elevation midpoint in 3D to curve the bridge above the globe atmosphere
                const mid3D = {
                  x: (targetBeamTop.x + otherBeamTop.x) * 0.65,
                  y: (targetBeamTop.y + otherBeamTop.y) * 0.65,
                  z: (targetBeamTop.z + otherBeamTop.z) * 0.65
                };
                // Push midpoint further outward
                const midLen = Math.sqrt(mid3D.x * mid3D.x + mid3D.y * mid3D.y + mid3D.z * mid3D.z);
                const arcHeight = r * 1.25;
                mid3D.x = (mid3D.x / midLen) * arcHeight;
                mid3D.y = (mid3D.y / midLen) * arcHeight;
                mid3D.z = (mid3D.z / midLen) * arcHeight;

                // Project points to 2D
                const pStart = project3DToCanvas(targetBeamTop.x, targetBeamTop.y, targetBeamTop.z, rotation, tilt, width, height);
                const pMid = project3DToCanvas(mid3D.x, mid3D.y, mid3D.z, rotation, tilt, width, height);
                const pEnd = project3DToCanvas(otherBeamTop.x, otherBeamTop.y, otherBeamTop.z, rotation, tilt, width, height);

                // Draw curve
                ctx.beginPath();
                ctx.moveTo(pStart.x, pStart.y);
                ctx.quadraticCurveTo(pMid.x, pMid.y, pEnd.x, pEnd.y);
                
                // Dash animation traveling down the tube
                ctx.setLineDash([4, 12]);
                ctx.lineDashOffset = -time * 30;
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Reset dashes
                ctx.setLineDash([]);
              }
            });
          }

          // 10. FLOATING SCI-FI GLASS HOLOGRAPHIC LABEL CARD OVERLAY
          // Beautifully rendered on canvas with custom hit tests to guarantee no lag!
          const labelW = 100;
          const labelH = 22;
          const labelX = Math.floor(proj.x - labelW / 2);
          const labelY = Math.floor(proj.y - labelH - 18);

          // Save hit area mapping for clicks & cursor checks
          labelHitAreas.current.push({
            hub,
            x: labelX,
            y: labelY,
            w: labelW,
            h: labelH
          });

          // Draw delicate sci-fi pointer lines
          ctx.beginPath();
          ctx.moveTo(proj.x, proj.y);
          ctx.lineTo(proj.x, proj.y - 12);
          ctx.lineTo(proj.x - 5, proj.y - 18);
          ctx.moveTo(proj.x, proj.y - 12);
          ctx.lineTo(proj.x + 5, proj.y - 18);
          ctx.strokeStyle = isSelected ? '#a855f7' : 'rgba(255,255,255,0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Render Label Box rounded rect
          ctx.beginPath();
          ctx.roundRect(labelX, labelY, labelW, labelH, 6);
          
          // Shimmer glass background
          ctx.fillStyle = isSelected ? 'rgba(40, 10, 60, 0.92)' : 'rgba(7, 10, 24, 0.82)';
          ctx.fill();

          // Highlight neon border
          ctx.strokeStyle = isSelected ? 'rgba(168, 85, 247, 0.85)' : 'rgba(39, 211, 255, 0.18)';
          ctx.lineWidth = isSelected ? 1.5 : 1.0;
          ctx.stroke();

          // Draw Label Content (Flag emoji, name, online dot)
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "Space Grotesk", "Cairo", sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';

          const flag = hub.details.flag || '🌍';
          const nameText = lang === 'ar' ? hub.nameAr : hub.name;
          const nameTruncated = nameText.length > 8 ? nameText.substring(0, 7) + '..' : nameText;

          // Draw Flag
          ctx.fillText(flag, labelX + 6, labelY + labelH / 2);
          
          // Draw Name
          ctx.fillStyle = isSelected ? '#f5f3ff' : '#cbd5e1';
          ctx.fillText(nameTruncated, labelX + 22, labelY + labelH / 2);

          // Draw Active Beacon indicator Dot
          ctx.fillStyle = '#10b981'; // emerald-500
          ctx.beginPath();
          ctx.arc(labelX + labelW - 18, labelY + labelH / 2, 2.0, 0, Math.PI * 2);
          ctx.fill();

          // Draw Active count number
          ctx.fillStyle = '#34d399';
          ctx.font = '8px "Fira Code", monospace';
          ctx.fillText(String(hub.details.onlineCount), labelX + labelW - 13, labelY + labelH / 2);
        }
      });

      // 11. LODAVIA AI FLOATING HELPER ENERGY ORB (Ascending cyan/magenta point orb)
      const selectedCoords = latLonTo3D(selectedHub.lat, selectedHub.lon, r);
      const selectedNormal = { x: selectedCoords.x / r, y: selectedCoords.y / r, z: selectedCoords.z / r };
      
      // Compute targeted floating anchor for Lodavia above selected hub
      const hoverOffset = r * 0.16; // Elevation height above globe
      const targetLumiX = selectedCoords.x + selectedNormal.x * hoverOffset;
      const targetLumiY = selectedCoords.y + selectedNormal.y * hoverOffset;
      const targetLumiZ = selectedCoords.z + selectedNormal.z * hoverOffset;

      // Smoothly fly towards targeted country (3D position interpolation)
      lumiPos.current.x += (targetLumiX - lumiPos.current.x) * 0.08;
      lumiPos.current.y += (targetLumiY - lumiPos.current.y) * 0.08;
      lumiPos.current.z += (targetLumiZ - lumiPos.current.z) * 0.08;

      const lumiProj = project3DToCanvas(lumiPos.current.x, lumiPos.current.y, lumiPos.current.z, rotation, tilt, width, height);

      // Render Lodavia AI if in front, or slightly faded/blended if in back (to retain depth realism)
      const isLumiFront = lumiProj.z > 0;
      
      ctx.save();
      if (!isLumiFront) {
        ctx.globalAlpha = 0.25; // Shaded out behind the planet
      }

      // Draw cute trailing neon particles behind Lodavia AI
      for (let j = 0; j < 5; j++) {
        const trailTime = time - (j * 0.08);
        const trailSine = Math.sin(trailTime * 4) * 4;
        
        // Slightly behind the current position
        const tFactor = 0.94 - (j * 0.02);
        const trailX = lumiPos.current.x * tFactor;
        const trailY = lumiPos.current.y * tFactor + trailSine;
        const trailZ = lumiPos.current.z * tFactor;

        const trailProj = project3DToCanvas(trailX, trailY, trailZ, rotation, tilt, width, height);
        
        ctx.beginPath();
        ctx.arc(trailProj.x, trailProj.y, 1.5 - (j * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 72, 153, ${0.4 - j * 0.07})`; // trailing pink/magenta
        ctx.fill();
      }

      // Draw principal glowing energy core of Lodavia AI with trigonometric breathing pulse
      const breathe = Math.sin(time * 3.5) * 1.5;
      const orbRadius = 5.0 + breathe;

      const lumiGrad = ctx.createRadialGradient(lumiProj.x - 1, lumiProj.y - 1, 0, lumiProj.x, lumiProj.y, orbRadius + 6);
      lumiGrad.addColorStop(0, '#ffffff'); // blinding hot white center
      lumiGrad.addColorStop(0.3, '#ec4899'); // magenta
      lumiGrad.addColorStop(0.7, 'rgba(124, 58, 237, 0.35)'); // purple shroud
      lumiGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lumiGrad;
      ctx.beginPath();
      ctx.arc(lumiProj.x, lumiProj.y, orbRadius + 8, 0, Math.PI * 2);
      ctx.fill();

      // Mini text signifier showing "Lodavia AI ✨"
      ctx.fillStyle = '#fdf2f8';
      ctx.font = 'black 7px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LODAVIA AI ✨', lumiProj.x, lumiProj.y - orbRadius - 6);

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    // Auto-resize canvas rendering buffer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [selectedHub, activeHubs, rotation, tilt, zoom, autoRotate, lang, landPoints]);

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* NATIVE CANVAS GRAPHICS STAGE */}
      <div 
        ref={containerRef}
        className="w-full max-w-xl aspect-square relative z-10 select-none h-[420px] rounded-full overflow-hidden" 
        id="lodavia-canvas-stage"
        onDoubleClick={handleResetView} // Double tap/click to reset to Middle East
      >
        <canvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block bg-transparent"
        />
      </div>

      {/* LUXURY CONTROLS PANEL */}
      <div className="w-full mt-2 p-4 rounded-[24px] bg-slate-950/20 dark:bg-black/30 border border-white/10 dark:border-white/5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-4.5 w-full sm:w-auto">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
            <input 
              type="checkbox" 
              checked={autoRotate}
              onChange={(e) => {
                playSynthSound(500, 'sine', 0.05);
                setAutoRotate(e.target.checked);
              }}
              className="rounded-lg bg-black border-white/10 text-cyan-400 focus:ring-0 cursor-pointer w-4 h-4"
            />
            <span className="text-slate-300 font-extrabold">{lang === 'ar' ? 'تدوير تلقائي كوني' : 'Celestial Rotation'}</span>
          </label>
          
          <button
            onClick={handleResetView}
            className="text-[10px] font-black uppercase tracking-wider text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors bg-transparent border-none"
          >
            [ {lang === 'ar' ? 'إعادة ضبط المحور الكوني' : 'Reset Coordinates'} ]
          </button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5 text-xs w-full">
            <span className="text-slate-400 font-bold">{lang === 'ar' ? 'التكبير الفلكي:' : 'Zoom Index:'}</span>
            <button 
              onClick={() => { playSynthSound(500, 'sine', 0.04); setZoom(prev => Math.max(80, prev - 20)); }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center font-black cursor-pointer text-white transition-all active:scale-95"
            >
              -
            </button>
            <span className="font-mono text-cyan-400 min-w-10 text-center font-extrabold">{zoom}px</span>
            <button 
              onClick={() => { playSynthSound(500, 'sine', 0.04); setZoom(prev => Math.min(220, prev + 20)); }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center font-black cursor-pointer text-white transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
