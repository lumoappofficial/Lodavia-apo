import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Drop-in replacement for LodaviaGlobe3D.tsx.
// Same prop interface — only the rendering engine changed (real Three.js +
// real NASA/Blue-Marble earth imagery instead of a hand-drawn 2D canvas ball).
// To use it: in LodaviaWorld.tsx change
//   import LodaviaGlobe3D from './LodaviaGlobe3D';
// to
//   import LodaviaGlobe3D from './RealisticEarthGlobe3D';
// (one line — nothing else needs to change).
// ---------------------------------------------------------------------------

// Real, public, stable texture assets (three-globe project on npm/unpkg —
// MIT licensed, NASA Blue Marble derivative imagery). Loaded at runtime,
// nothing to download or bundle manually.
const TEXTURES = {
  day: 'https://unpkg.com/three-globe@2.25.1/example/img/earth-day.jpg',
  night: 'https://unpkg.com/three-globe@2.25.1/example/img/earth-night.jpg',
  bump: 'https://unpkg.com/three-globe@2.25.1/example/img/earth-topology.png',
  specular: 'https://unpkg.com/three-globe@2.25.1/example/img/earth-water.png',
};

const GLOBE_RADIUS = 2;

// Convert latitude/longitude (as already used across the rest of the app)
// into a 3D point on the sphere's surface.
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

interface MapHub {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lon: number;
  color: string;
  glowColor: string;
  details: any;
}

function EarthSphere({ onEarthClick }: { onEarthClick?: () => void }) {
  const [day, night, bump, specular] = useTexture([
    TEXTURES.day,
    TEXTURES.night,
    TEXTURES.bump,
    TEXTURES.specular,
  ]);

  return (
    <mesh onClick={(e) => { e.stopPropagation(); onEarthClick?.(); }}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshPhongMaterial
        map={day}
        bumpMap={bump}
        bumpScale={0.04}
        specularMap={specular}
        specular={new THREE.Color('grey')}
        shininess={12}
        emissiveMap={night}
        emissive={new THREE.Color(0xffffff)}
        emissiveIntensity={0.55}
      />
    </mesh>
  );
}

function Atmosphere() {
  // Soft cosmic-brand-colored glow rim around the planet (Fresnel-style).
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    uniforms: {
      glowColor: { value: new THREE.Color(0x27D3FF) },
    },
    vertexShader: `
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
        intensity = pow(0.65 - dot(vNormal, vNormel), 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float intensity;
      uniform vec3 glowColor;
      void main() {
        gl_FragColor = vec4(glowColor, 1.0) * intensity;
      }
    `,
  }), []);

  return (
    <mesh scale={1.15} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
    </mesh>
  );
}

function HubMarker({
  hub,
  isSelected,
  lang,
  onSelect,
}: {
  hub: MapHub;
  isSelected: boolean;
  lang: 'ar' | 'en';
  onSelect: () => void;
}) {
  const position = useMemo(
    () => latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS * 1.01),
    [hub.lat, hub.lon]
  );

  return (
    <group position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <sphereGeometry args={[isSelected ? 0.045 : 0.028, 12, 12]} />
        <meshBasicMaterial color={hub.glowColor || '#27D3FF'} />
      </mesh>
      <Html distanceFactor={8} occlude style={{ pointerEvents: 'none' }}>
        <div
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap backdrop-blur-md border transition-all ${
            isSelected
              ? 'bg-aurora-500/25 border-aurora-400/50 text-aurora-400 scale-110'
              : 'bg-void-900/60 border-white/10 text-white/70'
          }`}
        >
          {lang === 'ar' ? hub.nameAr : hub.name}
        </div>
      </Html>
    </group>
  );
}

function NetworkArcs({ hubs }: { hubs: MapHub[] }) {
  // Faint great-circle-ish arcs connecting hubs, to echo the
  // "global network" feel from the reference design.
  const lines = useMemo(() => {
    const segments: THREE.Vector3[][] = [];
    for (let i = 0; i < hubs.length; i++) {
      const a = latLonToVector3(hubs[i].lat, hubs[i].lon, GLOBE_RADIUS * 1.01);
      const b = latLonToVector3(
        hubs[(i + 1) % hubs.length].lat,
        hubs[(i + 1) % hubs.length].lon,
        GLOBE_RADIUS * 1.01
      );
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.35);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      segments.push(curve.getPoints(24));
    }
    return segments;
  }, [hubs]);

  return (
    <>
      {lines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0x27D3FF} transparent opacity={0.18} />
        </line>
      ))}
    </>
  );
}

function Scene({
  lang,
  selectedHub,
  setSelectedHub,
  activeHubs,
  playSynthSound,
  autoRotate,
  zoom,
  onEarthClick,
}: {
  lang: 'ar' | 'en';
  selectedHub: MapHub;
  setSelectedHub: (hub: MapHub) => void;
  activeHubs: MapHub[];
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  autoRotate: boolean;
  zoom: number;
  onEarthClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const targetZ = THREE.MathUtils.clamp(6 / Math.max(zoom, 0.5), 3.2, 9);
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 2, 5]} intensity={1.4} />
      <Stars radius={80} depth={40} count={2500} factor={2} saturation={0} fade speed={0.5} />

      <group ref={groupRef}>
        <EarthSphere onEarthClick={onEarthClick} />
        <Atmosphere />
        <NetworkArcs hubs={activeHubs} />
        {activeHubs.map((hub) => (
          <HubMarker
            key={hub.id}
            hub={hub}
            lang={lang}
            isSelected={selectedHub.id === hub.id}
            onSelect={() => {
              playSynthSound(660, 'sine', 0.1);
              setSelectedHub(hub);
            }}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

export default function RealisticEarthGlobe3D({
  lang,
  selectedHub,
  setSelectedHub,
  activeHubs,
  playSynthSound,
  autoRotate,
  zoom,
  onEarthClick,
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
  onEarthClick?: () => void;
}) {
  return (
    <div className="w-full aspect-[16/10] min-h-[440px] rounded-2xl overflow-hidden bg-gradient-void relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <Scene
          lang={lang}
          selectedHub={selectedHub}
          setSelectedHub={setSelectedHub}
          activeHubs={activeHubs}
          playSynthSound={playSynthSound}
          autoRotate={autoRotate}
          zoom={zoom}
          onEarthClick={onEarthClick}
        />
      </Canvas>
    </div>
  );
}
