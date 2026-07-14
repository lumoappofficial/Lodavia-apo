import React from "react";
import { Sparkles, Terminal, BookOpen, Compass, RotateCcw, TrendingUp, Zap } from "lucide-react";

interface SuggestedPromptsProps {
  lang: "ar" | "en";
  onSelectPrompt: (prompt: string) => void;
  recentPrompts: string[];
  onClearRecent: () => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

export default function SuggestedPrompts({
  lang,
  onSelectPrompt,
  recentPrompts,
  onClearRecent,
  playSynthSound,
}: SuggestedPromptsProps) {

  const handleSelect = (promptText: string) => {
    playSynthSound(700, "sine", 0.08);
    onSelectPrompt(promptText);
  };

  const starters = {
    en: [
      {
        category: "Coding & Tech",
        icon: <Terminal className="w-4 h-4 text-pink-400" />,
        prompts: [
          "Write a starfield animation canvas in HTML5 & React",
          "Explain Javascript closures with three interactive examples",
          "How to safely structure and call a lazily-loaded API client?"
        ]
      },
      {
        category: "Creative Writing",
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        prompts: [
          "Write an immersive sci-fi micro-story about a time-dilating black hole",
          "Draft a poetic LinkedIn post about space-grade software design"
        ]
      },
      {
        category: "Brainstorming & Science",
        icon: <Compass className="w-4 h-4 text-cyan-400" />,
        prompts: [
          "Explain quantum computing simply to a ten-year-old developer",
          "Brainstorm 3 futuristic social events for Lodavia spatial voice rooms"
        ]
      }
    ],
    ar: [
      {
        category: "البرمجة والتقنية",
        icon: <Terminal className="w-4 h-4 text-pink-400" />,
        prompts: [
          "اكتب كود لرسم خلفية النجوم المتحركة بـ HTML5 و React",
          "اشرح مفهوم الإغلاق (Closures) في الجافاسكريبت بأمثلة واضحة",
          "كيف أصمم معماري آمن للاتصال بالخوادم دون تسريب المفاتيح؟"
        ]
      },
      {
        category: "الكتابة الإبداعية",
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        prompts: [
          "اكتب قصة خيال علمي قصيرة حول تمدد الزمن بجانب ثقب أسود عملاق",
          "صغ منشوراً ملهماً لـ لودافيولينكدن حول البرمجيات المستوحاة من حركة النجوم"
        ]
      },
      {
        category: "العصف الذهني والعلوم",
        icon: <Compass className="w-4 h-4 text-cyan-400" />,
        prompts: [
          "اشرح الحوسبة الكمومية بطريقة مبسطة جداً لطفل في العاشرة",
          "ابتكر 3 أفكار لفعاليات تفاعلية في غرف لودافيا الصوتية الفلكية"
        ]
      }
    ]
  };

  const trendingPrompts = lang === "ar"
    ? [
        "صمم مكون React لحساب تداخل موجات الصوت",
        "كيف تتشكل السدم الكونية في الفضاء العميق؟",
        "اكتب موجه ذكاء اصطناعي لكتابة مقالات تكنولوجية ممتازة"
      ]
    : [
        "Design a custom React audio visualizer component",
        "How do planetary nebulae form in deep interstellar space?",
        "Write a perfect prompt for generating high-conversion technical articles"
      ];

  const activeStarters = lang === "ar" ? starters.ar : starters.en;

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* 1. Categorized Prompt Bento Grid */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 font-mono select-none">
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
          <span>{lang === "ar" ? "مقترحات الاستكشاف الكوني" : "Cosmic Exploration Starters"}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeStarters.map((cat, i) => (
            <div
              key={i}
              className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/20 space-y-2.5 hover:border-purple-500/20 transition-all duration-300"
            >
              <h5 className="text-[11px] font-black text-white flex items-center gap-2 select-none">
                {cat.icon}
                <span>{cat.category}</span>
              </h5>
              <div className="space-y-2">
                {cat.prompts.map((p, j) => (
                  <button
                    key={j}
                    onClick={() => handleSelect(p)}
                    className="w-full text-left font-sans text-xs text-slate-300 hover:text-white bg-black/30 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 p-2.5 rounded-xl transition-all duration-200 cursor-pointer block truncate"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Trending Bento Card */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/20 space-y-2.5 hover:border-cyan-500/20 transition-all duration-300">
            <h5 className="text-[11px] font-black text-white flex items-center gap-2 select-none">
              <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{lang === "ar" ? "الوسوم والأسئلة الشائعة" : "Trending Cosmic Queries"}</span>
            </h5>
            <div className="space-y-2">
              {trendingPrompts.map((p, j) => (
                <button
                  key={j}
                  onClick={() => handleSelect(p)}
                  className="w-full text-left font-sans text-xs text-slate-300 hover:text-white bg-black/30 hover:bg-cyan-600/15 border border-white/5 hover:border-cyan-500/30 p-2.5 rounded-xl transition-all duration-200 cursor-pointer block truncate"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recently Used Prompts */}
      {recentPrompts && recentPrompts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 font-mono select-none">
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === "ar" ? "عمليات بحث وموجهات حديثة" : "Recently Used Prompts"}</span>
            </h4>
            <button
              onClick={() => { playSynthSound(150, "sawtooth", 0.08); onClearRecent(); }}
              className="text-[9px] font-bold text-slate-500 hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider font-mono"
            >
              {lang === "ar" ? "مسح السجل" : "Clear History"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(p)}
                className="max-w-xs truncate px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/20 text-slate-300 hover:text-white text-[11px] rounded-lg transition-all cursor-pointer font-sans"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
