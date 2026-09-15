import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Compass, 
  TrendingUp, 
  AlertTriangle, 
  GitBranch, 
  ArrowLeft 
} from 'lucide-react';
import { WhatIfScenario } from '../../types/parallelWorld';

interface WhatIfSimulatorProps {
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  onGrantXp: (amount: number, reasonAr: string, reasonEn: string) => void;
}

export default function WhatIfSimulator({
  lang,
  playSynthSound,
  onGrantXp
}: WhatIfSimulatorProps) {
  const isAr = lang === 'ar';

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<WhatIfScenario | null>(null);
  const [chosenOutcome, setChosenOutcome] = useState<{ id: string; text: string; outcome: string } | null>(null);

  const sampleQuestions = isAr ? [
    'ماذا لو بدأت مشروعي الذكي اليوم على لودافيا؟',
    'ماذا لو تعلمت البرمجة والذكاء الاصطناعي بدوام كامل؟',
    'ماذا لو سافرت وانتقلت للعمل في بيئة ابتسامية عالمية؟',
    'ماذا لو نجحت فكرتي الابتكارية وحصلت على تمويل استثماري؟'
  ] : [
    'What if I launched my AI startup on Lodavia today?',
    'What if I learned full-stack software engineering?',
    'What if I moved abroad to join a global innovation hub?',
    'What if my innovative idea secured seed funding?'
  ];

  const handleRunSimulation = async (selectedQ?: string) => {
    const qToRun = selectedQ || question;
    if (!qToRun.trim()) return;

    setLoading(true);
    setScenario(null);
    setChosenOutcome(null);
    playSynthSound(700, 'sine', 0.2);

    try {
      const response = await fetch('/api/ai/parallel-world/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: qToRun, lang })
      });
      const data = await response.json();
      setScenario(data);
      onGrantXp(200, `محاكاة مستقبلية: ${qToRun.slice(0, 25)}...`, `Future Simulation: ${qToRun.slice(0, 25)}...`);
    } catch (err) {
      console.error(err);
      // Fallback fallback scenario
      setScenario({
        scenarioTitle: isAr ? `محاكاة مستقبلية: ${qToRun}` : `Future Simulation: ${qToRun}`,
        possibleFuture: isAr
          ? `خلال 3 سنوات، تتطور إمكاناتك التقنية بشكل مذهل، وتصبح منصتك علامة فارقة في مجتمعات لودافيا الكونية مع إقبال واسع للعملاء.`
          : `Within 3 years, your tech capabilities expand tremendously, establishing a prominent landmark on Lodavia.`,
        opportunities: isAr
          ? ['استقلالية مالية كاملة', 'شراكات مع رواد التقنية', 'امتلاك أصول رقمية قيمة']
          : ['Full financial independence', 'Strategic tech partnerships', 'Valuable digital assets'],
        risks: isAr
          ? ['إدارة الوقت والموازنة بين الأولويات', 'مواكبة التسارع التقني المستمر']
          : ['Time management & priorities balance', 'Keeping pace with rapid tech shifts'],
        choices: [
          {
            id: 'c1',
            textAr: 'التركيز على حلول الذكاء الاصطناعي والتوسع السريع',
            textEn: 'Focus on AI solutions & scale rapidly',
            outcomeAr: 'تنجح في أتمتة معظم العمليات وتتضاعف أرباحك وتفتح بوابات عالمية جديدة.',
            outcomeEn: 'Successfully automate operations and scale global reach.'
          },
          {
            id: 'c2',
            textAr: 'التوسع التدريجي وبناء مجتمع مخلص ومتين',
            textEn: 'Scale incrementally building a devoted community',
            outcomeAr: 'تبني قاعدة جماهيرية وفية جداً وتتجنب المخاطر المالية.',
            outcomeEn: 'Build a deeply loyal audience while minimizing risk.'
          }
        ]
      });
      onGrantXp(150, 'محاكاة مستقبلية كوكبية', 'Cosmic Future Simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChoice = (choice: any) => {
    playSynthSound(900, 'triangle', 0.25);
    setChosenOutcome({
      id: choice.id,
      text: isAr ? choice.textAr : choice.textEn,
      outcome: isAr ? choice.outcomeAr : choice.outcomeEn
    });
    onGrantXp(100, 'تحديد قرار كوني في المحاكاة', 'Made a Cosmic Decision in Future Simulation');
  };

  return (
    <div className="w-full flex flex-col gap-6 glass-panel bg-slate-950/95 text-slate-100 rounded-3xl border border-cyan-500/30 p-5 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 text-cyan-300">
            <HelpCircle className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? '🔮 بوابة محاكاة المستقبل "ماذا لو؟"' : '🔮 "What If?" Future Simulator Gate'}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr ? 'طرح أي سؤال واستقبل سيناريو المستقبل المحتمل المدعوم بالذكاء الاصطناعي' : 'Ask any "What if?" query and receive AI future path scenarios'}
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black">
          {isAr ? 'مستشعر ذكي كوني 🧠' : 'Cosmic AI Sensor 🧠'}
        </div>
      </div>

      {/* Input Box & Sample Questions */}
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={isAr ? 'اكتب استفسارك الكوني: ماذا لو...' : 'Enter your question: What if...'}
            className="glass-input flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-semibold"
          />
          <button
            onClick={() => handleRunSimulation()}
            disabled={loading || !question.trim()}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAr ? 'تشغيل المحاكاة' : 'Simulate'}</span>
          </button>
        </div>

        {/* Sample questions chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold">{isAr ? 'أسئلة شائعة:' : 'Sample queries:'}</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(sq);
                handleRunSimulation(sq);
              }}
              className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center relative z-10">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-black text-cyan-300 animate-pulse">
            {isAr ? 'جاري تحليل الأبعاد والمحاكاة المستقبلية عبر Gemini AI...' : 'Analyzing dimensional timeline vectors via Gemini AI...'}
          </span>
        </div>
      )}

      {/* Generated Scenario Card */}
      {scenario && !loading && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-col gap-6 relative z-10 animate-[fadeIn_0.3s_ease-out] shadow-2xl">
          
          {/* Scenario Header */}
          <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
            <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">
              {isAr ? 'نتيجة المحاكاة الكونية' : 'Future Simulation Result'}
            </span>
            <h4 className="text-base md:text-lg font-black text-white">
              {scenario.scenarioTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5 mt-1">
              {scenario.possibleFuture}
            </p>
          </div>

          {/* Opportunities vs Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Opportunities */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
              <h5 className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'الفرص والمكاسب المتوقعة' : 'Expected Opportunities'}</span>
              </h5>
              <ul className="flex flex-col gap-1.5 mt-1">
                {scenario.opportunities.map((op, i) => (
                  <li key={i} className="text-xs text-emerald-200/90 flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{op}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
              <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'التحديات والمخاطر المحتملة' : 'Potential Risks'}</span>
              </h5>
              <ul className="flex flex-col gap-1.5 mt-1">
                {scenario.risks.map((rk, i) => (
                  <li key={i} className="text-xs text-amber-200/90 flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{rk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Decision Branching Choices */}
          <div className="flex flex-col gap-3 pt-2">
            <h5 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'اختر مسارك القراري لرؤية النتيجة المباشرة:' : 'Choose your decision branch:'}</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenario.choices.map((c) => {
                const isSelected = chosenOutcome?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectChoice(c)}
                    className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-cyan-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-black">{isAr ? c.textAr : c.textEn}</span>
                    <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1 mt-1">
                      <span>{isAr ? 'اختر هذا القرار (+100 XP)' : 'Select Choice (+100 XP)'}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Display Chosen Decision Outcome */}
            {chosenOutcome && (
              <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-xs font-bold text-cyan-200 animate-[fadeIn_0.3s_ease-out] flex flex-col gap-1">
                <span className="text-[10px] text-cyan-400 uppercase font-black">{isAr ? 'نتيجة هذا الخيار في مستقبلك' : 'Consequence of this choice'}</span>
                <p className="text-xs text-white leading-relaxed">{chosenOutcome.outcome}</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
