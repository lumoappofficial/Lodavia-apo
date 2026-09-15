import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Globe, 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Loader2, 
  HelpCircle, 
  ChevronDown,
  Info,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import type { CelestialBodyInfo } from './UniverseExplorer3D';

interface CelestialBodyDetailPanelProps {
  body: CelestialBodyInfo;
  isOpen: boolean;
  onClose: () => void;
  onReopen?: () => void;
  isAr: boolean;
  playSynthSound?: (freq: number, type?: any, duration?: number) => void;
}

export default function CelestialBodyDetailPanel({
  body,
  isOpen,
  onClose,
  onReopen,
  isAr,
  playSynthSound
}: CelestialBodyDetailPanelProps) {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear or reset local AI state when selected celestial body changes
  useEffect(() => {
    setQuestion('');
    setAiResponse(null);
    setAiError(null);
    setLastAskedQuestion(null);
  }, [body.id]);

  // Determine appropriate celestial icon
  const renderBodyIcon = () => {
    if (body.id === 'sun') {
      return <Sun className="w-5 h-5 text-amber-400 animate-pulse" />;
    }
    if (body.id === 'moon') {
      return <Moon className="w-5 h-5 text-slate-300" />;
    }
    return <Globe className="w-5 h-5 text-cyan-400" />;
  };

  // Quick prompt questions to inspire users
  const quickQuestions = isAr ? [
    `ما هي أبرز أسرار ${body.nameAr}؟`,
    `هل يمكن للبشر العيش على ${body.nameAr} مستقبلاً؟`,
    `كيف يبدو الطقس والغلاف الجوي هناك؟`
  ] : [
    `Key secrets of ${body.nameEn}?`,
    `Could humans colonize ${body.nameEn}?`,
    `What is the weather and atmosphere like?`
  ];

  // Send question to existing Lodavia AI endpoint (/api/ai/chat)
  const handleAskAI = async (customPrompt?: string) => {
    const queryText = (customPrompt || question).trim();
    if (!queryText || isLoadingAi) return;

    if (playSynthSound) playSynthSound(600, 'sine', 0.06);

    setIsLoadingAi(true);
    setAiError(null);
    setLastAskedQuestion(queryText);
    setAiResponse(null);

    // Build context-aware prompt passing selected body metadata
    const contextualMessage = `[مستكشف الفضاء - استفسار عن ${body.nameAr} / ${body.nameEn}]
الجرم السماوي المختار: ${body.nameAr} (${body.nameEn})
النوع: ${body.typeAr} (${body.typeEn})
القطر: ${body.diameterKm}
المسافة: ${body.distanceFromSun}
الدوران ومدة اليوم: ${body.rotationPeriod}
الأقمار: ${body.moonsCount}

سؤال المستخدم:
${queryText}

الرجاء الإجابة بأسلوب علمي شائق، ملهم وموجز (بحدود فقرتين مركزتين) باللغة ${isAr ? 'العربية' : 'الإنجليزية'}.`;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextualMessage,
          lang: isAr ? 'ar' : 'en',
          context: {
            activeTab: 'universe_explorer',
            celestialBody: body.nameEn,
            bodyType: body.typeEn
          }
        })
      });

      if (!response.ok) {
        throw new Error(isAr ? 'تعذر الاتصال بمرصد الذكاء الاصطناعي' : 'Failed to reach AI Observatory');
      }

      const data = await response.json();
      if (data && data.reply) {
        setAiResponse(data.reply);
        if (playSynthSound) playSynthSound(750, 'triangle', 0.08);
      } else {
        throw new Error(isAr ? 'لم تصل إجابة صالحة من النظام' : 'No valid response received');
      }
    } catch (err: any) {
      console.error('[UniverseExplorer3D] AI query failed:', err);
      // Fallback response with reliable astronomical data if network fails
      const fallback = isAr 
        ? `${body.nameAr} هو ${body.typeAr} مذهل في مجموعتنا الشمسية! يبلغ قطره ${body.diameterKm} ويبعد ${body.distanceFromSun}. حقيقة مميزة: ${body.factAr}`
        : `${body.nameEn} is a fascinating ${body.typeEn}! Diameter: ${body.diameterKm}, distance: ${body.distanceFromSun}. Notable fact: ${body.factEn}`;
      setAiResponse(fallback);
    } finally {
      setIsLoadingAi(false);
      setQuestion('');
    }
  };

  return (
    <>
      {/* Minimized floating button when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => {
            if (playSynthSound) playSynthSound(500, 'sine', 0.05);
            if (onReopen) onReopen();
          }}
          className="absolute z-30 top-18 sm:top-20 end-3 sm:end-5 px-3 py-1.5 rounded-full bg-[#030712]/85 backdrop-blur-md border border-cyan-500/40 text-cyan-200 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:text-white transition-all cursor-pointer flex items-center gap-2 group"
          title={isAr ? 'عرض بطاقة معلومات الجرم' : 'Show celestial body card'}
        >
          <span 
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse" 
            style={{ backgroundColor: body.color, color: body.color }} 
          />
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>{isAr ? `معلومات ${body.nameAr}` : `${body.nameEn} Info`}</span>
          </span>
        </button>
      )}

      {/* Main GlassCard Panel */}
      <div 
        className={`absolute z-30 transition-all duration-300 ease-out flex flex-col pointer-events-auto
          ${isOpen ? 'opacity-100 translate-y-0 md:translate-x-0' : 'opacity-0 pointer-events-none translate-y-8 md:translate-x-12'}
          /* Mobile: slides up from bottom */
          inset-x-2 bottom-2 max-h-[72vh] rounded-3xl
          /* Desktop: slides in from side */
          md:inset-auto md:top-20 md:end-4 md:w-96 md:max-h-[calc(100%-6.5rem)]
          bg-[#030712]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)] shadow-cyan-950/40
          overflow-hidden
        `}
      >
        {/* Top Header Bar with Accent Glow */}
        <div className="relative px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-[#030712]/60 to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              style={{ backgroundColor: `${body.color}20` }}
            >
              {renderBodyIcon()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  {isAr ? body.typeAr : body.typeEn}
                </span>
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: body.color }} 
                />
              </div>
              <h3 className="text-base font-black text-white leading-tight">
                {isAr ? body.nameAr : body.nameEn}
              </h3>
            </div>
          </div>

          {/* Close button that returns user to clean cosmic view without reloading */}
          <button
            onClick={() => {
              if (playSynthSound) playSynthSound(400, 'sine', 0.04);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
            title={isAr ? 'إغلاق اللوحة والعودة للمشهد العام' : 'Close panel and view scene'}
            aria-label={isAr ? 'إغلاق اللوحة' : 'Close panel'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-3.5 space-y-3 overflow-y-auto custom-scrollbar text-slate-200 text-xs">
          
          {/* Quick Facts Grid (المسافة، القطر، عدد الأقمار، مدة اليوم) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isAr ? 'حقائق سريعة' : 'Quick Facts'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Distance */}
              <div className="bg-[#0b1329]/70 p-2.5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <span className="text-[9px] font-medium text-slate-400 block mb-0.5">
                  {isAr ? 'المسافة من الشمس' : 'Distance from Sun'}
                </span>
                <span className="font-mono font-black text-amber-300 text-xs tracking-tight block">
                  {body.distanceFromSun}
                </span>
              </div>

              {/* 2. Diameter */}
              <div className="bg-[#0b1329]/70 p-2.5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <span className="text-[9px] font-medium text-slate-400 block mb-0.5">
                  {isAr ? 'القطر' : 'Diameter'}
                </span>
                <span className="font-mono font-black text-amber-300 text-xs tracking-tight block">
                  {body.diameterKm}
                </span>
              </div>

              {/* 3. Moons Count */}
              <div className="bg-[#0b1329]/70 p-2.5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <span className="text-[9px] font-medium text-slate-400 block mb-0.5">
                  {isAr ? 'عدد الأقمار' : 'Moons'}
                </span>
                <span className="font-mono font-black text-cyan-300 text-xs tracking-tight block">
                  {body.moonsCount}
                </span>
              </div>

              {/* 4. Rotation / Day Length */}
              <div className="bg-[#0b1329]/70 p-2.5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <span className="text-[9px] font-medium text-slate-400 block mb-0.5">
                  {isAr ? 'مدة اليوم (الدوران)' : 'Day Length (Rotation)'}
                </span>
                <span className="font-mono font-black text-amber-300 text-xs tracking-tight block">
                  {body.rotationPeriod}
                </span>
              </div>
            </div>
          </div>

          {/* Astronomical Fact Card */}
          <div className="p-2.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] leading-relaxed text-slate-300">
            <span className="font-bold text-cyan-300 flex items-center gap-1 mb-0.5">
              <span>💡</span>
              <span>{isAr ? 'معلومة فلكية:' : 'Did you know?'}</span>
            </span>
            <span>{isAr ? body.factAr : body.factEn}</span>
          </div>

          {/* AI Planet Q&A Section ("اسأل عن [اسم الكوكب]") */}
          <div className="pt-2 border-t border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? `اسأل عن ${body.nameAr}` : `Ask about ${body.nameEn}`}</span>
              </label>
              <span className="text-[9px] font-bold text-slate-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Gemini AI
              </span>
            </div>

            {/* Input and Send button */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAI();
              }}
              className="relative flex items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={isAr ? `اسأل عن ${body.nameAr}...` : `Ask about ${body.nameEn}...`}
                disabled={isLoadingAi}
                className="w-full px-3 py-2 pe-10 rounded-xl bg-black/60 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-400/80 transition-all disabled:opacity-60 shadow-inner"
              />
              <button
                type="submit"
                disabled={!question.trim() || isLoadingAi}
                className="absolute end-1.5 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all cursor-pointer flex items-center justify-center shadow-md shadow-cyan-950/50"
                title={isAr ? 'إرسال السؤال' : 'Send question'}
              >
                {isLoadingAi ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                )}
              </button>
            </form>

            {/* Quick Inspiration Question Chips */}
            {!aiResponse && !isLoadingAi && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAI(q)}
                    className="text-[10px] text-slate-300 bg-white/5 hover:bg-cyan-500/15 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/30 px-2 py-1 rounded-full transition-all text-start cursor-pointer flex items-center gap-1"
                  >
                    <span>{q}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* AI Loading State */}
            {isLoadingAi && (
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2.5 animate-pulse">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                <span className="text-[11px] text-cyan-200 font-medium">
                  {isAr ? `جاري استشارة مرصد لودافيا الذكي حول ${body.nameAr}...` : `Consulting Lodavia AI observatory about ${body.nameEn}...`}
                </span>
              </div>
            )}

            {/* AI Response Box */}
            {aiResponse && !isLoadingAi && (
              <div className="p-3 rounded-2xl bg-[#071126]/90 border border-cyan-400/40 shadow-lg space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
                {lastAskedQuestion && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium pb-1 border-b border-white/5">
                    <span className="text-cyan-400">❓</span>
                    <span className="truncate">{lastAskedQuestion}</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-100 leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAiResponse(null);
                      setLastAskedQuestion(null);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="text-[10px] text-cyan-300 hover:text-cyan-100 transition-colors font-bold cursor-pointer"
                  >
                    {isAr ? 'اسأل سؤالاً آخر ↩' : 'Ask another question ↩'}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {aiError && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[10px] text-rose-300">
                {aiError}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
