import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useApp } from './contexts/AppContext';
import LiveSpaceBackground from './components/LiveSpaceBackground';

// Import Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CommunitiesPage from './pages/CommunitiesPage';
import VoiceRoomsPage from './pages/VoiceRoomsPage';
import LodaviaMatchPage from './pages/LodaviaMatchPage';
import LodaviaWorldPage from './pages/LodaviaWorldPage';
import ProfilePage from './pages/ProfilePage';
import CreatorEconomyPage from './pages/CreatorEconomyPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';
import MessagesPage from './pages/MessagesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import BrandingKitPage from './pages/BrandingKitPage';
import AIReplyAssistantPage from './pages/AIReplyAssistantPage';
import AIDailyBriefPage from './pages/AIDailyBriefPage';

// Import Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import Lodavia Cosmic Redesigned Logo
import LodaviaCosmicLogo from './components/LodaviaCosmicLogo';

// Import Feedback States
import { Cosmic404Page, OfflineBanner } from './components/FeedbackStates';

function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useApp();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });

  // Mouse move handler for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Array<{ x: number; y: number; size: number; color: string; baseOpacity: number; twinkleSpeed: number; phase: number }> = [];
    let dust: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; color: string; opacity: number; phase: number }> = [];
    
    // Shooting Star Interface
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      life: number;
      maxLife: number;
    }
    let shootingStar: ShootingStar | null = null;

    // Background Planets (Distant and beautiful)
    const planets = [
      { xPct: 0.15, yPct: 0.25, radius: 18, color1: '#ff9e45', color2: '#3d1c02', ring: true, speed: 0.002 },
      { xPct: 0.82, yPct: 0.15, radius: 12, color1: '#27d3ff', color2: '#032036', ring: false, speed: 0.001 },
      { xPct: 0.75, yPct: 0.8, radius: 15, color1: '#a78bfa', color2: '#210d3d', ring: false, speed: 0.0015 }
    ];

    // Nebula cloud layers
    const nebulae = [
      { xPct: 0.2, yPct: 0.3, radiusPct: 0.45, color: 'rgba(39, 211, 255, 0.035)', driftX: 0, driftY: 0, speed: 0.0003, phase: 0 },
      { xPct: 0.8, yPct: 0.6, radiusPct: 0.55, color: 'rgba(124, 58, 237, 0.025)', driftX: 0, driftY: 0, speed: 0.0002, phase: Math.PI / 3 },
      { xPct: 0.5, yPct: 0.4, radiusPct: 0.35, color: 'rgba(255, 158, 69, 0.02)', driftX: 0, driftY: 0, speed: 0.0001, phase: Math.PI }
    ];

    const isLightMode = theme === 'light' || (theme === 'system' && (() => {
      const hour = new Date().getHours();
      return hour >= 6 && hour < 18;
    })());

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      initSpaceObjects();
    };

    const initSpaceObjects = () => {
      stars = [];
      dust = [];
      
      const starColors = isLightMode 
        ? ['rgba(39, 211, 255, 0.15)', 'rgba(255, 158, 69, 0.15)', 'rgba(255, 215, 106, 0.2)']
        : ['#ffffff', '#27d3ff', '#ffd76a', '#ffffff', '#e9d5ff'];

      // Populate stars
      const starCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (isLightMode ? 1.5 : 1.2) + 0.3,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          baseOpacity: Math.random() * 0.5 + (isLightMode ? 0.1 : 0.3),
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2
        });
      }

      // Populate cosmic dust
      const dustColors = isLightMode
        ? ['rgba(39, 211, 255, 0.08)', 'rgba(255, 158, 69, 0.08)', 'rgba(124, 58, 237, 0.05)']
        : ['rgba(39, 211, 255, 0.35)', 'rgba(255, 158, 69, 0.25)', 'rgba(255, 215, 106, 0.25)', 'rgba(168, 85, 247, 0.3)'];

      const dustCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 45000));
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.1,
          speedY: (Math.random() - 0.5) * 0.1,
          color: dustColors[Math.floor(Math.random() * dustColors.length)],
          opacity: Math.random() * 0.4 + 0.1,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const triggerShootingStar = () => {
      if (isLightMode) return;
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // around 30-45 degrees diagonal downward
      shootingStar = {
        x: Math.random() * canvas.width * 0.7,
        y: 0,
        length: 80 + Math.random() * 120,
        speed: 15 + Math.random() * 15,
        angle: angle,
        opacity: 0.8,
        active: true,
        life: 0,
        maxLife: 40 + Math.random() * 40
      };
    };

    let lastTime = 0;
    const animate = (time: number) => {
      // Smooth lerp for parallax mouse positions
      setMousePos(prev => {
        const dx = mouseTarget.current.x - prev.x;
        const dy = mouseTarget.current.y - prev.y;
        return {
          x: prev.x + dx * 0.05,
          y: prev.y + dy * 0.05
        };
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. REALISTIC DEEP SPACE BACKDROP
      if (!isLightMode) {
        // Deep space cosmic base gradient
        const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
        bgGrad.addColorStop(0, '#040717'); // Rich midnight navy
        bgGrad.addColorStop(0.5, '#02030d'); // Extremely dark indigo
        bgGrad.addColorStop(1, '#010103'); // Void black
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Light mode gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#f2f8fc');
        bgGrad.addColorStop(0.6, '#e2effa');
        bgGrad.addColorStop(1, '#cfe5f7');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Local variables for interpolated parallax offsets
      const pxX = mousePos.x;
      const pxY = mousePos.y;

      // 2. SOFT DRIFTING NEBULAE (screen composite blend mode)
      if (!isLightMode) {
        ctx.globalCompositeOperation = 'screen';
        nebulae.forEach(neb => {
          neb.phase += neb.speed;
          // Apply circular drifting
          neb.driftX = Math.sin(neb.phase) * 15;
          neb.driftY = Math.cos(neb.phase) * 15;

          const nX = (neb.xPct * canvas.width) + neb.driftX + (pxX * 18);
          const nY = (neb.yPct * canvas.height) + neb.driftY + (pxY * 18);
          const nR = neb.radiusPct * Math.max(canvas.width, canvas.height);

          const nebGrad = ctx.createRadialGradient(nX, nY, 0, nX, nY, nR);
          nebGrad.addColorStop(0, neb.color);
          nebGrad.addColorStop(0.5, neb.color.replace(/[\d.]+\)$/, '0.005)'));
          nebGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(nX, nY, nR, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
      } else {
        // Light mode warm sunshine glow
        const sunX = (0.85 * canvas.width) + (pxX * 10);
        const sunY = (pxY * 10);
        const sunR = Math.max(250, canvas.width * 0.45);
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
        sunGrad.addColorStop(0, 'rgba(255, 215, 106, 0.15)');
        sunGrad.addColorStop(0.5, 'rgba(255, 158, 69, 0.05)');
        sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. TINY TWINKLING STARS LAYER (with subtle parallax)
      stars.forEach(s => {
        s.phase += s.twinkleSpeed;
        const opacity = s.baseOpacity + Math.sin(s.phase) * 0.3;
        
        // Parallax offset (smaller stars are further, move slower)
        const depthFactor = s.size * 5; // 1.5 to 7.5
        const starX = s.x + (pxX * depthFactor);
        const starY = s.y + (pxY * depthFactor);

        ctx.beginPath();
        ctx.arc(starX, starY, s.size, 0, Math.PI * 2);
        if (isLightMode) {
          ctx.fillStyle = s.color;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, opacity))})`;
          // Star core glow
          if (s.size > 0.8 && opacity > 0.6) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 4;
          }
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 4. DISTANT CORNER PLANETS
      if (!isLightMode) {
        planets.forEach(p => {
          const pDepth = p.radius * 0.6; // deeper parallax
          const pX = (p.xPct * canvas.width) + (pxX * pDepth);
          const pY = (p.yPct * canvas.height) + (pxY * pDepth);

          // Draw ring if applicable
          if (p.ring) {
            ctx.save();
            ctx.translate(pX, pY);
            ctx.rotate(-Math.PI / 10);
            ctx.scale(1.8, 0.3);
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 215, 106, 0.15)';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
          }

          // Shaded planet body sphere
          const planetGrad = ctx.createRadialGradient(pX - p.radius * 0.3, pY - p.radius * 0.3, 0, pX, pY, p.radius);
          planetGrad.addColorStop(0, p.color1); // Lit crescent color
          planetGrad.addColorStop(0.3, p.color1.replace(/[\d.]+\)$/, '0.3)'));
          planetGrad.addColorStop(0.8, p.color2); // Dark terminator side
          planetGrad.addColorStop(1, '#000000');

          ctx.beginPath();
          ctx.arc(pX, pY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = planetGrad;
          ctx.fill();

          // Delicate atmospheric outline
          ctx.beginPath();
          ctx.arc(pX, pY, p.radius + 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.color1}15`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // 5. LIGHT COSMIC DUST DRIFTING
      dust.forEach(d => {
        d.phase += 0.005;
        const opacity = d.opacity + Math.sin(d.phase) * 0.05;
        
        // Deep space drift motion
        d.x += d.speedX;
        d.y += d.speedY;

        // Reset off boundaries
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        const dustParallaxX = d.x + (pxX * 12);
        const dustParallaxY = d.y + (pxY * 12);

        ctx.beginPath();
        ctx.arc(dustParallaxX, dustParallaxY, d.size, 0, Math.PI * 2);
        if (isLightMode) {
          ctx.fillStyle = d.color;
        } else {
          // Soft cyan/orange dust core glow
          ctx.fillStyle = d.color.replace(/[\d.]+\)$/, `${Math.max(0.05, Math.min(1, opacity))}`);
          ctx.shadowColor = d.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 6. OCCASIONAL SHOOTING STARS
      if (shootingStar && shootingStar.active) {
        shootingStar.life++;
        // Advance position
        const angleRad = shootingStar.angle;
        shootingStar.x += Math.cos(angleRad) * shootingStar.speed;
        shootingStar.y += Math.sin(angleRad) * shootingStar.speed;
        
        // Fade in and then out
        const pctLife = shootingStar.life / shootingStar.maxLife;
        if (pctLife < 0.25) {
          shootingStar.opacity = pctLife * 4;
        } else {
          shootingStar.opacity = 1 - (pctLife - 0.25) / 0.75;
        }

        if (shootingStar.life >= shootingStar.maxLife) {
          shootingStar.active = false;
        }

        // Draw shooting star tapering streak path
        const tailX = shootingStar.x - Math.cos(angleRad) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(angleRad) * shootingStar.length;

        const starGrad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        starGrad.addColorStop(0.1, `rgba(39, 211, 255, ${shootingStar.opacity * 0.8})`);
        starGrad.addColorStop(0.5, `rgba(168, 85, 247, ${shootingStar.opacity * 0.3})`);
        starGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      } else {
        // Trigger a shooting star randomly (on average once every 15-20 seconds)
        if (Math.random() < 0.001) {
          triggerShootingStar();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme, mousePos.x, mousePos.y]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" 
    />
  );
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { theme, lang } = useApp();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-20 w-full h-full min-h-screen bg-[#050814] overflow-hidden">
      {/* Living, twinkling starfield so the very first screen feels alive */}
      <LiveSpaceBackground starCount={90} shootingStars={2} className="z-0" />

      <div className="flex flex-col items-center animate-[fadeIn_1s_ease-out] relative z-10">

        {/* Dynamic Lodavia redesigned premium luxury app logo — using the real uploaded logo artwork */}
        <motion.div
          className="relative mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Ethereal aura backing */}
          <motion.div
            className="absolute -inset-12 bg-gradient-to-r from-cyan-400 via-amber-300 to-orange-400 rounded-full blur-[45px]"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative w-56 flex items-center justify-center">
            <LodaviaCosmicLogo size={90} variant="logo" glow={true} animated={true} className="w-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MainAppContent() {
  const [isSplashing, setIsSplashing] = useState(true);
  const { currentUser } = useApp();

  if (isSplashing) {
    return <SplashScreen onComplete={() => setIsSplashing(false)} />;
  }

  // A very clean route-based check for user authenticated pages
  // If the user name is Guest, they can enter too!
  const isLoggedIn = !!currentUser && currentUser.id !== '';

  return (
    <Routes>
      {/* Public / Authentication Routes */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/welcome"} replace />} />
      <Route path="/welcome" element={!isLoggedIn ? <Welcome /> : <Navigate to="/home" replace />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/home" replace />} />

      {/* Private Dashboard Shell and Pages */}
      <Route element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/welcome" replace />}>
        <Route path="/home" element={<Home />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/voice-rooms" element={<VoiceRoomsPage />} />
        <Route path="/lodavia-match" element={<LodaviaMatchPage />} />
        <Route path="/lodavia-world" element={<LodaviaWorldPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/creator-economy" element={<CreatorEconomyPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/branding-kit" element={<BrandingKitPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/ai-reply-assistant" element={<AIReplyAssistantPage />} />
        <Route path="/ai-daily" element={<AIDailyBriefPage />} />
      </Route>

      {/* Default 404 Page Fallback */}
      <Route path="*" element={<Cosmic404Page />} />
    </Routes>
  );
}

export default function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <div className="relative min-h-screen cosmic-app-container text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden flex flex-col selection:bg-cyan-500/30 selection:text-white transition-colors duration-500">
          {/* Immersive Space Atmosphere Canvas */}
          <StarfieldBackground />

          {isOffline && <OfflineBanner />}

          <MainAppContent />
        </div>
      </AppContextProvider>
    </BrowserRouter>
  );
}
