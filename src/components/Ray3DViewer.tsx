import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  RotateCw, 
  Sparkles, 
  Eye, 
  Zap, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Sliders,
  Palette,
  Flame,
  Shield,
  Star,
  Smile,
  Rocket
} from 'lucide-react';

export interface Ray3DViewerProps {
  currentSkin?: string;
  equippedCosmetics?: {
    frame?: string;
    background?: string;
    nameEffect?: string;
    title?: string;
    badge?: string;
    characterSkin?: string;
  };
  onInteract?: () => void;
  onOpenLocker?: () => void;
  lang?: string;
  className?: string;
  height?: string | number;
  showControls?: boolean;
  autoRotateDefault?: boolean;
  interactive?: boolean;
  isStageMode?: boolean;
}

// Visual Aura Themes tailored to enhance Ray's cosmic vibes
export const RAY_THEMES: Record<string, {
  nameAr: string;
  nameEn: string;
  lightColor: string;
  pedestalColor: string;
  particleColor: string;
  ambientColor: string;
  accent: string;
}> = {
  default: {
    nameAr: 'الكوني المضيء (الأصلي)',
    nameEn: 'Cosmic Vibrant (Original)',
    lightColor: '#38bdf8',
    pedestalColor: '#0284c7',
    particleColor: '#38bdf8',
    ambientColor: '#1e1b4b',
    accent: '#06b6d4'
  },
  starlight: {
    nameAr: 'سديم النجوم البنفسجي',
    nameEn: 'Starlight Nebula',
    lightColor: '#c084fc',
    pedestalColor: '#7c3aed',
    particleColor: '#e879f9',
    ambientColor: '#2e1065',
    accent: '#a855f7'
  },
  cyber: {
    nameAr: 'السايبر المستقبلي الأخضر',
    nameEn: 'Cyber Matrix',
    lightColor: '#34d399',
    pedestalColor: '#059669',
    particleColor: '#6ee7b7',
    ambientColor: '#022c22',
    accent: '#10b981'
  },
  royal: {
    nameAr: 'الملكي الذهبي',
    nameEn: 'Royal Golden',
    lightColor: '#fbbf24',
    pedestalColor: '#d97706',
    particleColor: '#fde047',
    ambientColor: '#451a03',
    accent: '#f59e0b'
  },
  astronaut: {
    nameAr: 'رائد الفضاء الفضي',
    nameEn: 'Astronaut Silver',
    lightColor: '#e2e8f0',
    pedestalColor: '#64748b',
    particleColor: '#f8fafc',
    ambientColor: '#1e293b',
    accent: '#94a3b8'
  },
  galaxy: {
    nameAr: 'سوبرنوفا المجرة الوردي',
    nameEn: 'Galaxy Supernova',
    lightColor: '#f472b6',
    pedestalColor: '#db2777',
    particleColor: '#f43f5e',
    ambientColor: '#500724',
    accent: '#ec4899'
  },
  neon: {
    nameAr: 'النيون المتوهج الفائق',
    nameEn: 'Hyper Neon Glow',
    lightColor: '#22d3ee',
    pedestalColor: '#0891b2',
    particleColor: '#06b6d4',
    ambientColor: '#083344',
    accent: '#00f2fe'
  },
  explorer: {
    nameAr: 'المستكشف الكوني الكمّي',
    nameEn: 'Quantum Explorer',
    lightColor: '#a3e635',
    pedestalColor: '#65a30d',
    particleColor: '#bef264',
    ambientColor: '#1a2e05',
    accent: '#84cc16'
  }
};

export default function Ray3DViewer({
  currentSkin = 'default',
  equippedCosmetics,
  onInteract,
  onOpenLocker,
  lang = 'ar',
  className = '',
  height = '100%',
  showControls = true,
  autoRotateDefault = true,
  interactive = true,
  isStageMode = true
}: Ray3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeThemeKey, setActiveThemeKey] = useState<string>(currentSkin || 'default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPose, setCurrentPose] = useState<'idle' | 'happy' | 'wave' | 'fly'>('idle');

  // Synchronize external skin prop
  useEffect(() => {
    if (currentSkin && RAY_THEMES[currentSkin]) {
      setActiveThemeKey(currentSkin);
    }
  }, [currentSkin]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const pedestalRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  
  // Animation & Interaction states
  const animationFrameId = useRef<number | null>(null);
  const mouseState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotationY: 0,
    targetRotationX: 0,
    currentRotationY: 0,
    currentRotationX: 0,
    bounceProgress: 0,
    waveProgress: 0,
    spinProgress: 0,
    lookAtX: 0,
    lookAtY: 0
  });

  const playInteractionSound = useCallback((freq = 580) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore audio context restrictions
    }
  }, [soundEnabled]);

  // Main Three.js setup and model loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - Perfectly calibrated for character stage without head/feet clipping
    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || (typeof height === 'number' ? height : 500);
    const aspect = width / heightPx;
    
    // Dynamically adjust camera distance based on aspect ratio to guarantee no clipping
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    const cameraDistance = aspect < 1 ? 3.4 / Math.max(0.65, aspect) : 3.2;
    camera.position.set(0, 0.1, Math.min(4.8, cameraDistance));
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Root model container group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Lighting setup for high-fidelity 3D character presentation
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0xffffff, 2.2);
    mainDirectional.position.set(2, 4, 3);
    mainDirectional.castShadow = true;
    mainDirectional.shadow.mapSize.width = 1024;
    mainDirectional.shadow.mapSize.height = 1024;
    scene.add(mainDirectional);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const pointLight = new THREE.PointLight(0x06b6d4, 3.0, 7);
    pointLight.position.set(0, 1.6, 1.6);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    const spotLight = new THREE.SpotLight(0xffffff, 3.2, 12, Math.PI / 4, 0.4);
    spotLight.position.set(0, 4.5, 2);
    spotLight.target = modelGroup;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Holographic Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.95, 1.1, 0.08, 36);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x070d1e,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.98;
    pedestal.receiveShadow = true;
    scene.add(pedestal);
    pedestalRef.current = pedestal;

    // Glowing Neon Ring around pedestal
    const ringGeo = new THREE.TorusGeometry(1.02, 0.025, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.95;
    scene.add(ring);
    ringRef.current = ring;

    // Deep Space Starfield Background inside Scene
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 2] = -4 - Math.random() * 8;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xffffff,
      transparent: true,
      opacity: 0.75
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // Cosmic floating particles around Ray
    const particleCount = 64;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 0.8 + Math.random() * 1.0;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = -0.85 + Math.random() * 2.0;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Canvas texture for circular glowing particles
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pctx = particleCanvas.getContext('2d');
    if (pctx) {
      const gradient = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      pctx.fillStyle = gradient;
      pctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Load authentic Ray 3D model (textured.glb)
    const loader = new GLTFLoader();
    const modelUrls = ['/models/textured.glb', '/textured.glb'];

    const loadModel = (urlIndex: number) => {
      if (urlIndex >= modelUrls.length) {
        if (isMounted) {
          setIsLoading(false);
          setLoadError('Failed to load Ray 3D model.');
        }
        return;
      }

      const url = modelUrls[urlIndex];
      loader.load(
        url,
        (gltf) => {
          if (!isMounted) return;

          const model = gltf.scene;

          // Enable shadows and enhance materials
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach(m => {
                    m.needsUpdate = true;
                    if ('roughness' in m) (m as THREE.MeshStandardMaterial).roughness = 0.32;
                    if ('metalness' in m) (m as THREE.MeshStandardMaterial).metalness = 0.12;
                  });
                } else {
                  mesh.material.needsUpdate = true;
                  if ('roughness' in mesh.material) (mesh.material as THREE.MeshStandardMaterial).roughness = 0.32;
                  if ('metalness' in mesh.material) (mesh.material as THREE.MeshStandardMaterial).metalness = 0.12;
                }
              }
            }
          });

          // Calculate bounding box and center model precisely
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Scale model proportionally to fill the character stage cleanly (~1.4 unit)
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale = 1.4 / (maxDim || 1);
          model.scale.setScalar(targetScale);

          // Center the pivot
          model.position.x = -center.x * targetScale;
          model.position.y = -center.y * targetScale;
          model.position.z = -center.z * targetScale;

          // Clear any prior model and add to group
          while (modelGroup.children.length > 0) {
            modelGroup.remove(modelGroup.children[0]);
          }
          modelGroup.add(model);

          setIsLoading(false);
          setLoadError(null);
        },
        undefined,
        (err) => {
          console.warn(`Could not load GLB from ${url}, trying next url...`, err);
          loadModel(urlIndex + 1);
        }
      );
    };

    loadModel(0);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // 1. Procedural Idle Hover, Breathe & Dynamic Reactions
      if (modelGroupRef.current) {
        // Natural floating bounce
        const hoverY = Math.sin(elapsedTime * 2.2) * 0.05;
        
        // Wobble/hop reaction when tapped
        let reactionY = 0;
        let reactionTilt = 0;
        let spinDelta = 0;

        if (mouseState.current.bounceProgress > 0) {
          mouseState.current.bounceProgress -= delta * 3.2;
          if (mouseState.current.bounceProgress < 0) mouseState.current.bounceProgress = 0;
          const p = mouseState.current.bounceProgress;
          reactionY = Math.sin(p * Math.PI) * 0.28;
          reactionTilt = Math.sin(p * Math.PI * 2) * 0.14;
        }

        if (mouseState.current.waveProgress > 0) {
          mouseState.current.waveProgress -= delta * 2.0;
          if (mouseState.current.waveProgress < 0) mouseState.current.waveProgress = 0;
          reactionTilt += Math.sin(elapsedTime * 8) * 0.12 * mouseState.current.waveProgress;
        }

        if (mouseState.current.spinProgress > 0) {
          mouseState.current.spinProgress -= delta * 1.5;
          if (mouseState.current.spinProgress < 0) mouseState.current.spinProgress = 0;
          spinDelta = delta * 12 * mouseState.current.spinProgress;
          mouseState.current.targetRotationY += spinDelta;
        }

        modelGroupRef.current.position.y = hoverY + reactionY;
        modelGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.4) * 0.03 + reactionTilt;

        // Auto-rotation or mouse dragging
        if (autoRotate && !mouseState.current.isDragging) {
          mouseState.current.targetRotationY += 0.012;
        }

        // Smooth damping towards target rotations (Gaze & Interaction)
        mouseState.current.currentRotationY += (mouseState.current.targetRotationY - mouseState.current.currentRotationY) * 0.09;
        mouseState.current.currentRotationX += (mouseState.current.targetRotationX - mouseState.current.currentRotationX) * 0.09;

        modelGroupRef.current.rotation.y = mouseState.current.currentRotationY;
        modelGroupRef.current.rotation.x = mouseState.current.currentRotationX;
      }

      // 2. Animate cosmic particles & ring
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.16;
      }

      if (starsRef.current) {
        starsRef.current.rotation.y = elapsedTime * 0.02;
      }

      if (ringRef.current) {
        ringRef.current.rotation.z = elapsedTime * 0.4;
        const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = 0.7 + Math.sin(elapsedTime * 3) * 0.25;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle Window / Container Resize with Aspect ratio protection
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          const newAspect = newW / newH;
          cameraRef.current.aspect = newAspect;
          
          // Re-calibrate camera position dynamically so Ray is never cropped
          const newDist = newAspect < 1 ? 3.4 / Math.max(0.65, newAspect) : 3.2;
          cameraRef.current.position.z = Math.min(4.8, newDist);
          
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [height]);

  // Update theme colors when activeThemeKey changes
  useEffect(() => {
    const theme = RAY_THEMES[activeThemeKey] || RAY_THEMES.default;

    if (pointLightRef.current) {
      pointLightRef.current.color.set(theme.lightColor);
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(theme.lightColor);
    }
    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshBasicMaterial).color.set(theme.accent);
    }
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).color.set(theme.particleColor);
    }
  }, [activeThemeKey]);

  // Mouse & Touch interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    setIsInteracting(true);
    mouseState.current.isDragging = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    if (mouseState.current.isDragging) {
      const deltaX = e.clientX - mouseState.current.prevX;
      const deltaY = e.clientY - mouseState.current.prevY;
      
      mouseState.current.targetRotationY += deltaX * 0.01;
      mouseState.current.targetRotationX = Math.max(-0.45, Math.min(0.45, mouseState.current.targetRotationX + deltaY * 0.008));
      
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;
    } else {
      // Subtle gaze tracking towards cursor
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        mouseState.current.targetRotationX = ny * 0.25;
        if (!autoRotate) {
          mouseState.current.targetRotationY = nx * 0.55;
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
    mouseState.current.isDragging = false;
  };

  const handleRayClick = () => {
    if (!interactive) return;
    // Trigger playful hop & celebration
    mouseState.current.bounceProgress = 1.0;
    setCurrentPose('happy');
    playInteractionSound(650);

    if (onInteract) {
      onInteract();
    }

    setTimeout(() => {
      setCurrentPose('idle');
    }, 1200);
  };

  const triggerPose = (pose: 'happy' | 'wave' | 'fly') => {
    setCurrentPose(pose);
    if (pose === 'happy') {
      mouseState.current.bounceProgress = 1.0;
      playInteractionSound(700);
    } else if (pose === 'wave') {
      mouseState.current.waveProgress = 1.0;
      playInteractionSound(620);
    } else if (pose === 'fly') {
      mouseState.current.spinProgress = 1.0;
      playInteractionSound(850);
    }

    setTimeout(() => {
      setCurrentPose('idle');
    }, 1500);
  };

  const handleResetRotation = () => {
    mouseState.current.targetRotationX = 0;
    mouseState.current.targetRotationY = 0;
    mouseState.current.bounceProgress = 1.0;
    playInteractionSound(500);
  };

  return (
    <div 
      className={`relative w-full h-full min-h-[420px] md:min-h-[540px] flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0f24] to-slate-950 border border-sky-500/20 shadow-[0_15px_50px_rgba(0,0,0,0.6)] ${className}`}
      dir="ltr"
    >
      {/* Cinematic Space Stage Lighting & Nebula Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(56,189,248,0.18),transparent_65%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main 3D Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleRayClick}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none select-none relative z-10 flex items-center justify-center"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md gap-3">
          <div className="w-14 h-14 rounded-2xl border-4 border-sky-400/20 border-t-sky-400 animate-spin flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
          </div>
          <span className="text-sm font-black text-sky-300 tracking-wider">
            {isRtl ? 'جاري تجهيز مسرح Ray 3D الكوني...' : 'Setting up Ray 3D Cosmic Stage...'}
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center gap-3">
          <Shield className="w-9 h-9 text-amber-400" />
          <p className="text-xs text-slate-300 max-w-xs">{loadError}</p>
        </div>
      )}

      {/* Top HUD Header: Status Badge, Current Skin & Quick Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/80 border border-sky-400/30 backdrop-blur-xl flex items-center gap-2.5 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-white tracking-wide flex items-center gap-1">
                <span>Ray 3D</span>
                <span className="text-[10px] text-sky-400 font-bold">• {isRtl ? 'المساعد الكوني' : 'Celestial Mascot'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        {showControls && (
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white transition-all shadow-xl cursor-pointer"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setAutoRotate(!autoRotate);
              }}
              className={`p-2.5 rounded-2xl border transition-all shadow-xl cursor-pointer ${
                autoRotate 
                  ? 'bg-sky-500/25 border-sky-400/60 text-sky-300' 
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/15 text-slate-300 hover:text-white'
              }`}
              title={autoRotate ? 'إيقاف الدوران' : 'تشغيل الدوران'}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '7s' }} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetRotation();
              }}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white transition-all shadow-xl cursor-pointer"
              title="إعادة ضبط زاوية الرؤية"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stage Bottom Floating Action Bar with "تخصيص" (Customize) and Reactions */}
      {showControls && (
        <div className="absolute bottom-5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-3">
          {/* Quick Reaction Pills */}
          <div className="flex items-center gap-1.5 pointer-events-auto overflow-x-auto pb-0.5 no-scrollbar">
            <button
              onClick={(e) => { e.stopPropagation(); triggerPose('happy'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition-all backdrop-blur-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'ترحيب' : 'Hello'}</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); triggerPose('fly'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition-all backdrop-blur-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Rocket className="w-3.5 h-3.5 text-sky-400" />
              <span>{isRtl ? 'طيران' : 'Fly'}</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); triggerPose('wave'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition-all backdrop-blur-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{isRtl ? 'حركات' : 'Poses'}</span>
            </button>
          </div>

          {/* Prominent "تخصيص" (Customize Locker) Button */}
          {onOpenLocker && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playInteractionSound(750);
                onOpenLocker();
              }}
              className="pointer-events-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:brightness-115 text-white font-black text-xs md:text-sm tracking-wide shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 border border-sky-300/40"
            >
              <Palette className="w-4 h-4" />
              <span>{isRtl ? 'تخصيص المظهر 🎨' : 'Customize Locker 🎨'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
