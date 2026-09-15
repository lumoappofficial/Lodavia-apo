import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Type, 
  Moon, 
  Sun, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  Code,
  FileImage,
  Layers,
  Heart
} from 'lucide-react';

export default function BrandingKitPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  // Local state for interactive tabs
  const [activeAsset, setActiveAsset] = useState<'icon' | 'primary' | 'horizontal'>('icon');
  const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>('dark');
  const [scale, setScale] = useState<number>(1);
  const [customText, setCustomText] = useState<string>('LODAVIA');
  
  // Feedback states
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedSVG, setCopiedSVG] = useState<boolean>(false);

  // References for rendering/exporting
  const svgRef = useRef<SVGSVGElement>(null);

  // Color Definitions
  const brandColors = [
    {
      name: lang === 'ar' ? 'الأزرق الكوني العميق' : 'Deep Cosmic Blue',
      hex: '#071A3D',
      desc: lang === 'ar' ? 'الفضاء اللانهائي للهوية والخلفيات الكونية' : 'The primary space backdrop and canvas for the brand',
      tailwind: 'bg-[#071A3D]',
      text: 'text-white'
    },
    {
      name: lang === 'ar' ? 'سماوي الأورورا' : 'Aurora Cyan',
      hex: '#27D3FF',
      desc: lang === 'ar' ? 'شبكة الاتصال اللانهائي والذكاء الاصطناعي والمستقبل' : 'Symbolizes connectivity, neural pathways, and the future',
      tailwind: 'bg-[#27D3FF]',
      text: 'text-slate-950'
    },
    {
      name: lang === 'ar' ? 'برتقال الشروق' : 'Sunrise Orange',
      hex: '#FF9E45',
      desc: lang === 'ar' ? 'شعلة الاستكشاف والتعلم والفرص' : 'Represents active exploration, learning, and discovery',
      tailwind: 'bg-[#FF9E45]',
      text: 'text-slate-950'
    },
    {
      name: lang === 'ar' ? 'الذهب الدافئ' : 'Warm Gold',
      hex: '#FFD76A',
      desc: lang === 'ar' ? 'جوهر المجتمعات والروابط الإنسانية الصادقة' : 'Signifies community center, premium rewards, and connection',
      tailwind: 'bg-[#FFD76A]',
      text: 'text-slate-950'
    }
  ];

  // Copy hex value helper
  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    playSynthSound(700, 'sine', 0.08);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Raw SVG generator string based on state
  const getSVGCode = () => {
    const isDark = activeTheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#071A3D';
    const bgFill = isDark ? '#071A3D' : '#F4F9FF';
    
    // Core constellation forming letter "L" template
    const coreGraphic = `
  <defs>
    <radialGradient id="nebulaGlowKit" cx="50%" cy="55%" r="45%">
      <stop offset="0%" stop-color="#27D3FF" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#7C3AED" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#071A3D" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="constLineKit" x1="180" y1="100" x2="400" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#27D3FF" />
      <stop offset="35%" stop-color="#7C3AED" />
      <stop offset="70%" stop-color="#FFD76A" />
      <stop offset="100%" stop-color="#FF9E45" />
    </linearGradient>
    <filter id="glowKit" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <g transform="translate(0, 0) scale(${scale})">
    <!-- Ambient Nebula -->
    <circle cx="256" cy="256" r="180" fill="url(#nebulaGlowKit)" filter="url(#glowKit)" />

    <!-- Orbits -->
    <circle cx="180" cy="100" r="50" stroke="#27D3FF" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="6 6" />
    <circle cx="180" cy="380" r="60" stroke="#FFD76A" stroke-opacity="0.18" stroke-width="2" stroke-dasharray="8 8" />

    <!-- Constellation Lines -->
    <path d="M 180,100 L 180,240 L 180,380 L 290,380 L 400,340" stroke="url(#constLineKit)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowKit)" />

    <!-- Secondary decorative orbits -->
    <path d="M 400,340 L 440,250" stroke="#FF9E45" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="4 4" />
    <circle cx="440" cy="250" r="5" fill="#FF9E45" />

    <path d="M 180,240 L 110,270" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.25" stroke-dasharray="4 4" />
    <circle cx="110" cy="270" r="4" fill="#FFFFFF" />

    <!-- Core Star Nodes -->
    <!-- Star A: Intel -->
    <path d="M 180 75 Q 180 100 205 100 Q 180 100 180 125 Q 180 100 155 100 Q 180 100 180 75 Z" fill="#27D3FF" />
    <circle cx="180" cy="100" r="8" fill="#FFFFFF" />

    <!-- Star B: Trust -->
    <path d="M 180 225 Q 180 240 195 240 Q 180 240 180 255 Q 180 240 165 240 Q 180 240 180 225 Z" fill="#FFFFFF" opacity="0.9" />

    <!-- Star C: Community -->
    <path d="M 180 345 Q 180 380 215 380 Q 180 380 180 415 Q 180 380 145 380 Q 180 380 180 345 Z" fill="#FFD76A" />
    <circle cx="180" cy="380" r="10" fill="#FFFFFF" />

    <!-- Star D: Connection -->
    <path d="M 290 365 Q 290 380 305 380 Q 290 380 290 395 Q 290 380 275 380 Q 290 380 290 365 Z" fill="#FFFFFF" opacity="0.95" />

    <!-- Star E: Discovery -->
    <path d="M 400 310 Q 400 340 430 340 Q 400 340 400 370 Q 400 340 370 340 Q 400 340 400 310 Z" fill="#FF9E45" />
    <circle cx="400" cy="340" r="8" fill="#FFFFFF" />
  </g>`;

    if (activeAsset === 'icon') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="100%" height="100%" fill="${bgFill}" rx="112" />
  ${coreGraphic}
</svg>`;
    } else if (activeAsset === 'primary') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 640" width="512" height="640">
  <rect width="100%" height="100%" fill="${bgFill}" rx="48" />
  ${coreGraphic}
  <text x="256" y="490" font-family="'Space Grotesk', 'Inter', sans-serif" font-weight="900" font-size="54" letter-spacing="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${customText.toUpperCase()}</text>
  <text x="256" y="535" font-family="'Inter', sans-serif" font-weight="600" font-size="14" letter-spacing="4" fill="#64748B" text-anchor="middle">AI-POWERED LINK</text>
</svg>`;
    } else {
      // Horizontal variant
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <rect width="100%" height="100%" fill="${bgFill}" rx="48" />
  <g transform="translate(-100, -56)">
    ${coreGraphic}
  </g>
  <g transform="translate(420, 200)">
    <text x="0" y="-10" font-family="'Space Grotesk', 'Inter', sans-serif" font-weight="900" font-size="78" letter-spacing="16" fill="${textColor}">${customText.toUpperCase()}</text>
    <text x="5" y="45" font-family="'Inter', sans-serif" font-weight="700" font-size="16" letter-spacing="8" fill="#64748B">CONNECT • LEARN • GROW</text>
  </g>
</svg>`;
    }
  };

  // Copy SVG Code handler
  const handleCopySVG = () => {
    const code = getSVGCode();
    navigator.clipboard.writeText(code);
    setCopiedSVG(true);
    playSynthSound(800, 'sine', 0.1);
    setTimeout(() => setCopiedSVG(false), 2000);
  };

  // Download SVG File handler
  const handleDownloadSVG = () => {
    const code = getSVGCode();
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lodavia_brand_${activeAsset}_${activeTheme}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSynthSound(900, 'sine', 0.12);
  };

  // Download PNG File handler (Scales to 1024x1024)
  const handleDownloadPNG = () => {
    playSynthSound(500, 'sine', 0.15);
    const svgCode = getSVGCode();
    const canvas = document.createElement('canvas');
    
    // Set high-resolution target sizes
    const width = activeAsset === 'horizontal' ? 1024 : 1024;
    const height = activeAsset === 'horizontal' ? 512 : 1024;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svg64 = btoa(unescape(encodeURIComponent(svgCode)));
    img.src = 'data:image/svg+xml;base64,' + svg64;

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `lodavia_brand_${activeAsset}_${activeTheme}_1024x1024.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-16 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Upper Navigation & Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button 
            onClick={() => {
              playSynthSound(440, 'sine', 0.05);
              navigate(-1);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'العودة' : 'Back'}</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black text-white">
              {lang === 'ar' ? 'دليل الهوية البصرية وشعار لودافيا 🪐' : 'Lodavia Brand Hub & Guidelines 🪐'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
            {lang === 'ar' 
              ? 'مجموعة متكاملة ومعتمدة لهوية Lodavia البصرية. قم بمعاينة شعار الكوكب المستقبلي، وتخصيص الألوان والخطوط، وتنزيل أصول متجهة فائقة الدقة بصيغة SVG أو PNG.' 
              : 'Complete official brand toolkit for the Lodavia ecosystem. Render modern planet-core visuals, download pixel-perfect SVG vectors and high-res PNG formats directly in your browser.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-600/30 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'عرض البداية السينمائية' : 'Cinematic Intro & Onboarding'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE CANVAS PREVIEW */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'ar' ? 'المعاينة التفاعلية للأصل البصري' : 'Interactive Asset Preview'}</span>
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {lang === 'ar' ? 'اختر النوع وحجم الشعار والسمة المطلوبة' : 'Adjust scale, typography, and backdrop theme dynamically'}
                </p>
              </div>

              {/* Theme Selector Toggle */}
              <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => {
                    setActiveTheme('dark');
                    playSynthSound(600, 'sine', 0.05);
                  }}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    activeTheme === 'dark' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'مظلم' : 'Dark'}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTheme('light');
                    playSynthSound(600, 'sine', 0.05);
                  }}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    activeTheme === 'light' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'مضيء' : 'Light'}</span>
                </button>
              </div>
            </div>

            {/* ASSET TYPE SWITCHER */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  setActiveAsset('icon');
                  playSynthSound(500, 'sine', 0.05);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeAsset === 'icon' 
                    ? 'border-purple-500 bg-purple-500/10 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="w-5 h-5 rounded bg-purple-500/15 flex items-center justify-center">
                  <span className="text-[10px] font-black text-purple-400">IC</span>
                </div>
                <span className="text-[10px] font-bold block">{lang === 'ar' ? 'أيقونة التطبيق' : 'App Icon'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveAsset('primary');
                  playSynthSound(500, 'sine', 0.05);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeAsset === 'primary' 
                    ? 'border-purple-500 bg-purple-500/10 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="w-5 h-5 rounded bg-purple-500/15 flex items-center justify-center">
                  <span className="text-[10px] font-black text-purple-400">VT</span>
                </div>
                <span className="text-[10px] font-bold block">{lang === 'ar' ? 'الشعار الرئيسي' : 'Primary Vertical'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveAsset('horizontal');
                  playSynthSound(500, 'sine', 0.05);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeAsset === 'horizontal' 
                    ? 'border-purple-500 bg-purple-500/10 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="w-5 h-5 rounded bg-purple-500/15 flex items-center justify-center">
                  <span className="text-[10px] font-black text-purple-400">HZ</span>
                </div>
                <span className="text-[10px] font-bold block">{lang === 'ar' ? 'الشعار الأفقي' : 'Horizontal Logo'}</span>
              </button>
            </div>

            {/* REAL-TIME SVG STAGE */}
            <div className={`w-full aspect-square md:aspect-[4/3] rounded-2xl border ${
              activeTheme === 'dark' 
                ? 'bg-[#0B0B16] border-white/5' 
                : 'bg-slate-100 border-slate-200'
            } flex items-center justify-center p-8 relative overflow-hidden transition-all duration-300`}>
              
              {/* Grid backdrop helper for light theme to show alpha */}
              {activeTheme === 'light' && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px'
                }} />
              )}

              {/* Tweak settings inside Stage */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-4 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-xl text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">{lang === 'ar' ? 'الحجم:' : 'Scale:'}</span>
                  <input 
                    type="range" 
                    min="0.6" 
                    max="1.2" 
                    step="0.05"
                    value={scale} 
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-white font-mono">{Math.round(scale * 100)}%</span>
                </div>

                {activeAsset !== 'icon' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold">{lang === 'ar' ? 'النص:' : 'Text:'}</span>
                    <input 
                      type="text" 
                      value={customText} 
                      onChange={(e) => setCustomText(e.target.value)}
                      maxLength={12}
                      className="bg-black/60 border border-white/10 rounded-md px-2 py-0.5 text-white max-w-[80px] text-[10px] font-black focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic SVG renderer */}
              <div className="max-w-[85%] max-h-[85%] flex items-center justify-center animate-[scaleIn_0.3s_ease-out]">
                <div dangerouslySetInnerHTML={{ __html: getSVGCode() }} className="w-full h-full" />
              </div>
            </div>

            {/* DOWNLOAD CENTER ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <button
                onClick={handleCopySVG}
                className="w-full py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-black text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                {copiedSVG ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'ar' ? 'تم نسخ كود الـ SVG!' : 'SVG Code Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ar' ? 'نسخ كود الشعار المتجه SVG' : 'Copy Raw SVG XML Code'}</span>
                  </>
                )}
              </button>

              <div className="flex gap-2.5 w-full">
                <button
                  onClick={handleDownloadSVG}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تنزيل SVG' : 'Download SVG'}</span>
                </button>

                <button
                  onClick={handleDownloadPNG}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileImage className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تنزيل 1024×1024 PNG' : 'Download PNG'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* SECTION: BRAND GUIDELINES DOS & DON'TS */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>{lang === 'ar' ? 'قواعد توجيه الاستخدام الصحيح' : 'Visual Consistency Guidelines'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2.5">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'ar' ? 'افعل ذلك دائماً' : 'DO'}
                </span>
                <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>{lang === 'ar' ? 'استخدم الأيقونة المجردة كتطبيق على الخلفيات الداكنة.' : 'Maintain a crisp border ratio for the App Store icon.'}</li>
                  <li>{lang === 'ar' ? 'احرص على إبقاء المساحة الفارغة الكافية حول الشعار.' : 'Provide generous breathing negative space on print or UI rails.'}</li>
                  <li>{lang === 'ar' ? 'تأكد من تداخل المدار الفضائي ثلاثي الأبعاد.' : 'Keep the 3D optical illusion of the orbit passing behind intact.'}</li>
                  <li>{lang === 'ar' ? 'أبرز الهالة البنفسجية لتبدو كفضاء متوهج.' : 'Ensure high-contrast backgrounds with luminous cores are clear.'}</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col gap-2.5">
                <span className="text-[11px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {lang === 'ar' ? 'تجنب ذلك تماماً' : 'DON\'T'}
                </span>
                <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>{lang === 'ar' ? 'لا تقم بضغط أو تمديد الشعار من أي زاوية.' : 'Do not squeeze or distort the aspect ratio of the planet.'}</li>
                  <li>{lang === 'ar' ? 'لا تغير تدرج الألوان المعتمد للبنفسجي أو السماوي.' : 'Do not change the official HEX values of Lodavia Purple or Cyan.'}</li>
                  <li>{lang === 'ar' ? 'لا تقم بإضافة شعارات نصية فرعية مدمجة بداخله.' : 'Do not append unapproved marketing slogans under the core logo.'}</li>
                  <li>{lang === 'ar' ? 'تجنب دمج الشعار على صور خلفية معقدة ومشوشة.' : 'Do not render on noisy, pixelated or cluttered background images.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND PALETTE & TYPOGRAPHY */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* COLOR SWATCHES PANEL */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'لوحة الألوان الرسمية المعتمدة' : 'Official Brand Color Palette'}</span>
            </h3>

            <div className="flex flex-col gap-3">
              {brandColors.map((color) => (
                <div 
                  key={color.hex} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0a10] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${color.tailwind} border border-white/10 shrink-0 flex items-center justify-center font-mono text-[9px] ${color.text} shadow-inner font-extrabold`}>
                      HEX
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">{color.name}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{color.desc}</span>
                    </div>
                  </div>

                  <div className="text-end">
                    <button
                      onClick={() => handleCopyColor(color.hex)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-slate-300 transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
                    >
                      {copiedColor === color.hex ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-[10px] text-slate-400">{color.hex}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[8px] text-slate-600 block mt-1 font-mono">{color.tailwind}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TYPOGRAPHY RULES */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3">
              <Type className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ar' ? 'الهندسة الطباعية والخطوط' : 'Official Typography pairing'}</span>
            </h3>

            <div className="flex flex-col gap-4">
              
              {/* Heading display font */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a10] border border-white/5">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
                  <span>Display Font</span>
                  <span className="text-purple-400 font-extrabold">Space Grotesk</span>
                </div>
                <h4 className="text-xl font-black text-white tracking-widest font-sans mt-1">LODAVIA SYSTEM</h4>
                <p className="text-[10px] text-slate-400 mt-1">{lang === 'ar' ? 'يُستخدم للعناوين الجريئة وأبرز نصوص الهوية.' : 'Used for modern display headings, numbers and premium brand impact.'}</p>
              </div>

              {/* Body font */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a10] border border-white/5">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
                  <span>Body Font</span>
                  <span className="text-cyan-400 font-extrabold">Inter UI</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mt-1">Interactive community connections for everyone.</h4>
                <p className="text-[10px] text-slate-400 mt-1">{lang === 'ar' ? 'يُستخدم للمحتوى الأساسي، غرف الصوت، وقراءة المدونات.' : 'Optimized for high legibility, micro-copy, messages, and content streams.'}</p>
              </div>

              {/* Monospace accent font */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a10] border border-white/5">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
                  <span>Monospace Font</span>
                  <span className="text-amber-400 font-extrabold">JetBrains Mono</span>
                </div>
                <h4 className="text-xs font-mono text-cyan-400 mt-1">0x7F3FF2 • AES-256 SECURE</h4>
                <p className="text-[10px] text-slate-400 mt-1">{lang === 'ar' ? 'يُستخدم لقيم العقد، مؤشرات الحالة، وسجلات التشفير.' : 'Adds tech-accents, cryptography metadata, levels, and metric points.'}</p>
              </div>

            </div>
          </div>

          {/* EXPORTS HIGHLIGHT */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/25 via-blue-950/25 to-cyan-950/25 border border-white/10 text-center flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl" />
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-[11px] font-black text-white">
              {lang === 'ar' ? 'الهوية البصرية المثالية جاهزة 🚀' : 'Production-Ready Brand Kit 🚀'}
            </span>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
              {lang === 'ar' 
                ? 'تم فحص جميع أصول الـ SVG والتدرجات لتعمل بنسبة 100% وبأعلى معايير الجودة على غوغل بلاي، متجر أبل، ومواقع الويب.' 
                : 'All vectors are coded cleanly with robust inline gradients. Suitable for seamless deployment, packaging, and high-contrast digital interfaces.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
