import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Briefcase, 
  DollarSign, 
  BarChart2, 
  Target, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  RotateCcw, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Zap, 
  Layers, 
  FileText,
  Compass,
  ArrowRight,
  Info,
  Clock,
  Flame,
  Award
} from 'lucide-react';
import { 
  ProjectJuryInput, 
  ProjectJuryResult, 
  JuryMemberId, 
  JuryMemberEvaluation,
  JuryAnswerResponse 
} from '../types/projectJury';
import { aiService } from '../services/ai.service';
import { storage } from '../utils/storage';

interface ProjectJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  initialProjectData?: Partial<ProjectJuryInput>;
  onTriggerTool?: (toolId: string, context?: any) => void;
}

const JURY_ICONS: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5 text-blue-400" />,
  DollarSign: <DollarSign className="w-5 h-5 text-emerald-400" />,
  BarChart2: <BarChart2 className="w-5 h-5 text-cyan-400" />,
  Target: <Target className="w-5 h-5 text-pink-400" />,
  Users: <Users className="w-5 h-5 text-amber-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-purple-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-rose-400" />
};

export default function ProjectJuryModal({
  isOpen,
  onClose,
  lang = 'ar',
  initialProjectData,
  onTriggerTool
}: ProjectJuryModalProps) {
  const isAr = lang === 'ar';

  // Step state: 'form' | 'evaluating' | 'result'
  const [step, setStep] = useState<'form' | 'evaluating' | 'result'>('form');
  
  // Evaluation Loading Progress
  const [evaluationStage, setEvaluationStage] = useState<number>(0);

  // Form State
  const [formData, setFormData] = useState<ProjectJuryInput>({
    projectName: '',
    projectType: 'تطبيق أو منصة رقمية',
    location: '',
    description: '',
    expectedBudget: '',
    monthlyExpenses: '',
    expectedRevenue: '',
    targetAudience: '',
    competitors: '',
    additionalInfo: ''
  });

  // Result state
  const [juryResult, setJuryResult] = useState<ProjectJuryResult | null>(null);
  const [activeMemberTab, setActiveMemberTab] = useState<JuryMemberId>('business');
  const [copiedReport, setCopiedReport] = useState(false);

  // "Ask the Jury" Q&A State
  const [askTarget, setAskTarget] = useState<JuryMemberId | 'all'>('all');
  const [askQuestion, setAskQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [juryAnswersHistory, setJuryAnswersHistory] = useState<JuryAnswerResponse[]>([]);

  // History & Previous Scores
  const [savedEvaluations, setSavedEvaluations] = useState<ProjectJuryResult[]>([]);

  // Load initial data & saved history
  useEffect(() => {
    const saved = storage.load<ProjectJuryResult[]>('lodavia_project_evaluations', []);
    setSavedEvaluations(saved);

    if (initialProjectData) {
      setFormData(prev => ({
        ...prev,
        ...initialProjectData
      }));
    }
  }, [initialProjectData, isOpen]);

  // Loading animation sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'evaluating') {
      const stages = [
        0, // Forming Jury
        1, // Business Strategy
        2, // Financial Feasibility
        3, // Market Dynamics
        4, // Marketing & Acquisition
        5, // Customer UX
        6, // Growth & Scaling
        7, // Risk Analysis
        8  // Finalizing Verdict
      ];

      let current = 0;
      setEvaluationStage(0);

      timer = setInterval(() => {
        current += 1;
        if (current < stages.length) {
          setEvaluationStage(current);
        } else {
          clearInterval(timer);
        }
      }, 700);
    }
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  const EVALUATION_STAGES = [
    { titleAr: "⚖️ تشكيل لجنة Lodavia...", titleEn: "⚖️ Forming Lodavia AI Jury...", icon: Scale },
    { titleAr: "💼 فحص استراتيجية ونموذج العمل...", titleEn: "💼 Analyzing Business Strategy...", icon: Briefcase },
    { titleAr: "💰 حساب الجدوى وهوامش الربح...", titleEn: "💰 Computing Financial Feasibility...", icon: DollarSign },
    { titleAr: "📊 مسح السوق وحجم المنافسة...", titleEn: "📊 Scanning Market & Competitors...", icon: BarChart2 },
    { titleAr: "📣 تقييم قنوات التسويق والانتشار...", titleEn: "📣 Evaluating Marketing Channels...", icon: Target },
    { titleAr: "👤 محاكاة تجربة وقبول العميل...", titleEn: "👤 Simulating Customer Experience...", icon: Users },
    { titleAr: "🚀 دراسة قابلية التوسع والشراكات...", titleEn: "🚀 Assessing Growth & Scalability...", icon: TrendingUp },
    { titleAr: "⚠️ رصد الثغرات والمخاطر التشغيلية...", titleEn: "⚠️ Identifying Risks & Vulnerabilities...", icon: ShieldAlert },
    { titleAr: "✨ صياغة خلاصة وتوصيات اللجنة...", titleEn: "✨ Finalizing Jury Verdict...", icon: Sparkles }
  ];

  const handleStartEvaluation = async () => {
    if (!formData.projectName.trim() || !formData.description.trim()) {
      return;
    }

    setStep('evaluating');

    // Find previous score for this project if exists
    const existing = savedEvaluations.find(
      e => e.input.projectName.trim().toLowerCase() === formData.projectName.trim().toLowerCase()
    );
    const prevScore = existing ? existing.overallScore : undefined;
    const evalCount = existing ? (existing.evaluationCount || 1) + 1 : 1;

    try {
      const result = await aiService.evaluateProjectJury(formData, prevScore, lang);
      result.evaluationCount = evalCount;
      
      // Delay slightly for smooth theatrical transition
      setTimeout(() => {
        setJuryResult(result);
        setStep('result');
        setActiveMemberTab(result.members?.[0]?.id || 'business');

        // Save to storage
        const updatedList = [
          result,
          ...savedEvaluations.filter(e => e.id !== result.id && e.input.projectName !== result.input.projectName)
        ];
        storage.save('lodavia_project_evaluations', updatedList);
        setSavedEvaluations(updatedList);
      }, 1500);

    } catch (err) {
      console.error(err);
      setStep('form');
    }
  };

  const handleAskJury = async (questionText?: string) => {
    const q = (questionText || askQuestion).trim();
    if (!q || !juryResult || isAsking) return;

    setIsAsking(true);
    setAskQuestion('');

    try {
      const response: JuryAnswerResponse = await aiService.askProjectJury({
        projectData: formData,
        juryResult: juryResult,
        targetMember: askTarget,
        question: q,
        lang: lang
      });

      setJuryAnswersHistory(prev => [response, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyReport = () => {
    if (!juryResult) return;
    const text = isAr
      ? `⚖️ تقرير تقييم مشروع: ${juryResult.input.projectName}
⭐ الدرجة الإجمالية للجنة Lodavia: ${juryResult.overallScore} / 10 (${juryResult.verdictAr})

📊 تفصيل التقييم:
- الجدوى المالية: ${juryResult.breakdown.financial}/10
- قوة السوق: ${juryResult.breakdown.market}/10
- التسويق: ${juryResult.breakdown.marketing}/10
- تجربة العميل: ${juryResult.breakdown.customer}/10
- فرص النمو: ${juryResult.breakdown.growth}/10
- مستوى المخاطر: ${juryResult.breakdown.riskLevel}

🧠 خلاصة اللجنة:
${juryResult.summaryAr}

🎯 الخطوة المقترحة:
${juryResult.nextStepAr}

⚠️ تنبيه: هذا التحليل مولد بالذكاء الاصطناعي من منصة Lodavia لمساعدتك على دراسة فكرتك.`
      : `⚖️ Project Evaluation Report: ${juryResult.input.projectName}
⭐ Overall Lodavia AI Jury Score: ${juryResult.overallScore} / 10 (${juryResult.verdictEn})

📊 Breakdown Scores:
- Financial: ${juryResult.breakdown.financial}/10
- Market: ${juryResult.breakdown.market}/10
- Marketing: ${juryResult.breakdown.marketing}/10
- Customer: ${juryResult.breakdown.customer}/10
- Growth: ${juryResult.breakdown.growth}/10
- Risk Level: ${juryResult.breakdown.riskLevel}

🧠 Jury Summary:
${juryResult.summaryEn}

🎯 Next Action:
${juryResult.nextStepEn}

⚠️ Note: AI-generated analysis by Lodavia for exploratory guidance.`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const QUICK_QUESTIONS = isAr
    ? [
        "كيف أبدأ بأقل تكلفة ممكنة؟",
        "ما هي أفضل قناة تسويقية لهذا المشروع؟",
        "كيف أتعامل مع المنافسين الكبار؟",
        "ما هو أكبر خطر يهدد نجاح المشروع؟"
      ]
    : [
        "How can I launch with minimal budget?",
        "What is the single best marketing channel?",
        "How do I compete with established players?",
        "What is the biggest risk that could break this?"
      ];

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.5) return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300';
    if (score >= 7.0) return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300';
    if (score >= 5.5) return 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300';
    return 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-5xl my-auto bg-slate-900/95 border border-slate-700/60 rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden flex flex-col max-h-[92vh]"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {isAr ? "التقييم الأولي للمشروع" : "Initial Project Rating"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? "⚖️ لجنة Lodavia AI" : "⚖️ Lodavia AI Jury"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? "تقييم ذكي متعدد الزوايا لفكرة مشروعك عبر 7 وجهات نظر تخصصية محاكاة"
                  : "Multi-angle intelligent project evaluation via 7 specialized simulated AI perspectives"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'result' && (
              <button
                onClick={() => setStep('form')}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                {isAr ? "إعادة التقييم والتعديل" : "Edit & Re-evaluate"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* ================= STEP 1: FORM INPUTS ================= */}
          {step === 'form' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Intro Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-blue-900/20 border border-purple-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <p className="font-medium text-purple-200 mb-0.5">
                    {isAr ? "كيف تعمل لجنة Lodavia AI؟" : "How does the Lodavia AI Jury work?"}
                  </p>
                  <p className="text-slate-400">
                    {isAr
                      ? "أدخل تفاصيل فكرة مشروعك، وستقوم اللجنة المكونة من 7 خبراء ذكاء اصطناعي (استراتيجية، مالية، سوق، تسويق، عميل، نمو، ومخاطر) بتحليل شامل وتوليد تقرير استشاري دقيق مع توصيات وروابط للأدوات التنفيذية."
                      : "Enter your project details, and a 7-member AI jury (Strategy, Financial, Market, Marketing, Customer UX, Growth, and Risk) will evaluate your concept, provide breakdown scores, SWOT, scenarios, and direct action tools."}
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "اسم المشروع / الفكرة *" : "Project / Idea Name *"}
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder={isAr ? "مثال: منصة لودافيا لتبادل الأفكار والمشاريع" : "e.g., Lodavia Space Idea Marketplace"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Project Category / Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "نوع وتصنيف المشروع" : "Project Category / Type"}
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm"
                  >
                    <option value="تطبيق أو منصة رقمية">{isAr ? "📱 تطبيق أو منصة رقمية / SaaS" : "📱 App / SaaS Platform"}</option>
                    <option value="متجر إلكتروني">{isAr ? "🛍️ متجر إلكتروني وتجارة رقمية" : "🛍️ E-Commerce & Retail"}</option>
                    <option value="ذكاء اصطناعي وأتمتة">{isAr ? "🤖 ذكاء اصطناعي وأتمتة بيانات" : "🤖 AI & Automation"}</option>
                    <option value="خدمات واستشارات">{isAr ? "💼 خدمات مهنية واستشارات" : "💼 Professional Services"}</option>
                    <option value="محتوى وإعلام رقمي">{isAr ? "🎥 محتوى رقمي ومجتمعات" : "🎥 Content & Communities"}</option>
                    <option value="مشروع محلي وتجاري">{isAr ? "🏢 مشروع محلي / متجر فعلي" : "🏢 Local Business / Physical Shop"}</option>
                    <option value="أخرى">{isAr ? "🔮 تصنيف آخر / ابتكار جديد" : "🔮 Other / Innovation"}</option>
                  </select>
                </div>

                {/* Description (Full Width) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "وصف المشروع والمشكلة التي يحلها *" : "Project Description & Problem It Solves *"}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder={isAr 
                      ? "اشرح الفكرة بإيجاز: ما هو المنتج أو الخدمة؟ ما المشكلة الأساسية التي يعالجها؟ وكيف تقدم القيمة للعميل؟" 
                      : "Describe the concept: What is the core offering? What pain point does it solve? How does it deliver value?"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "الفئة المستهدفة (الجمهور)" : "Target Audience"}
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder={isAr ? "مثال: رواد الأعمال، المستقلون، طلاب الجامعات" : "e.g., Founders, Freelancers, Students"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Target Market / Location */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "السوق المستهدف / النطاق الجغرافي" : "Target Market / Geography"}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder={isAr ? "مثال: الخليج العربي، الوطن العربي، عالمي أونلاين" : "e.g., MENA Region, Global Digital"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Expected Budget */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "الميزانية الأولية المتوقعة (اختياري)" : "Expected Initial Budget (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={formData.expectedBudget}
                    onChange={e => setFormData({ ...formData, expectedBudget: e.target.value })}
                    placeholder={isAr ? "مثال: 5,000 $ أو 1,000 نقطة لودافيا" : "e.g., $5,000 or 1,000 points"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Monthly Expenses */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "المصاريف التشغيلية الشهرية التقديرية" : "Estimated Monthly Expenses"}
                  </label>
                  <input
                    type="text"
                    value={formData.monthlyExpenses}
                    onChange={e => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                    placeholder={isAr ? "مثال: 500 $ شهرياً خوادم وتسويق" : "e.g., $500/month hosting & ads"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Expected Revenue */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "الإيرادات الشهرية المتوقعة بعد الإطلاق" : "Expected Monthly Revenue"}
                  </label>
                  <input
                    type="text"
                    value={formData.expectedRevenue}
                    onChange={e => setFormData({ ...formData, expectedRevenue: e.target.value })}
                    placeholder={isAr ? "مثال: اشتراكات بقيمة 20$ لـ 100 مشترك" : "e.g., $20/month x 100 subscribers"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>

                {/* Competitors */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isAr ? "أبرز المنافسين أو البدائل الحالية" : "Key Competitors or Alternatives"}
                  </label>
                  <input
                    type="text"
                    value={formData.competitors}
                    onChange={e => setFormData({ ...formData, competitors: e.target.value })}
                    placeholder={isAr ? "مثال: منصات مستقلة، جداول إكسل يدوية" : "e.g., Legacy tools, Excel sheets"}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  {isAr 
                    ? "التحليل مولد بالذكاء الاصطناعي لتقديم مشورة استكشافية متقدمة."
                    : "Simulated AI analysis provided for exploratory evaluation."}
                </div>

                <button
                  onClick={handleStartEvaluation}
                  disabled={!formData.projectName.trim() || !formData.description.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Scale className="w-5 h-5" />
                  {isAr ? "بدء تقييم لجنة Lodavia AI" : "Launch Lodavia AI Jury"}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: FUTURISTIC EVALUATION ANIMATION ================= */}
          {step === 'evaluating' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
              {/* Cosmic Hologram Pulse */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-indigo-500/40"
                />
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-600/30 to-cyan-500/30 blur-md"
                />
                <div className="relative w-20 h-20 rounded-2xl bg-slate-900 border border-purple-500/50 flex items-center justify-center shadow-xl shadow-purple-500/20">
                  <Scale className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
              </div>

              {/* Status Indicator */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {isAr ? EVALUATION_STAGES[evaluationStage]?.titleAr : EVALUATION_STAGES[evaluationStage]?.titleEn}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {isAr
                    ? "تقوم 7 نماذج ذكاء اصطناعي متخصصة بدراسة الفكرة ومقارنتها بمعايير السوق الحالية..."
                    : "7 specialized AI perspectives are examining your project parameters and market viability..."}
                </p>
              </div>

              {/* Step Sequence Checklist */}
              <div className="w-full space-y-2 text-start bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                {EVALUATION_STAGES.slice(1, 8).map((stg, idx) => {
                  const isDone = evaluationStage > idx + 1;
                  const isCurrent = evaluationStage === idx + 1;
                  const Icon = stg.icon;

                  return (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                        isDone 
                          ? 'text-emerald-400 bg-emerald-950/20' 
                          : isCurrent 
                          ? 'text-purple-300 bg-purple-900/30 font-medium' 
                          : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-purple-400 animate-spin' : 'text-slate-600'}`} />
                        <span>{isAr ? stg.titleAr.replace('...', '') : stg.titleEn.replace('...', '')}</span>
                      </div>
                      {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: RESULTS PRESENTATION ================= */}
          {step === 'result' && juryResult && (
            <div className="space-y-8 animate-fadeIn">

              {/* 1. HERO VERDICT & SCORE GAUGE */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-900/90 border border-purple-500/30 shadow-xl shadow-purple-950/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: Title and Verdict */}
                  <div className="space-y-3 text-center md:text-start flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300">
                        ⚖️ {isAr ? "حكم لجنة لودافيا" : "Lodavia Jury Verdict"}
                      </span>
                      {juryResult.previousScore && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {isAr 
                            ? `تحسن التقييم: ${(juryResult.overallScore - juryResult.previousScore > 0 ? '+' : '')}${(juryResult.overallScore - juryResult.previousScore).toFixed(1)}`
                            : `Delta: ${(juryResult.overallScore - juryResult.previousScore > 0 ? '+' : '')}${(juryResult.overallScore - juryResult.previousScore).toFixed(1)}`}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400">
                        {isAr ? `تقييم رقم: ${juryResult.evaluationCount || 1}` : `Evaluation #${juryResult.evaluationCount || 1}`}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {juryResult.input.projectName}
                    </h3>

                    <p className="text-base font-semibold text-purple-200">
                      {isAr ? juryResult.verdictAr : juryResult.verdictEn}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {isAr ? juryResult.summaryAr : juryResult.summaryEn}
                    </p>
                  </div>

                  {/* Right: Circular Overall Score Badge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className={`relative w-32 h-32 rounded-3xl p-1 bg-gradient-to-br ${getScoreBadgeColor(juryResult.overallScore)} flex items-center justify-center shadow-2xl`}>
                      <div className="w-full h-full bg-slate-950/90 rounded-[22px] flex flex-col items-center justify-center p-3 text-center border border-white/10">
                        <span className="text-xs font-medium text-slate-400">
                          {isAr ? "الدرجة الإجمالية" : "Overall Score"}
                        </span>
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className="text-4xl font-black text-white tracking-tight">
                            {juryResult.overallScore.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">/10</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => {
                            const filled = juryResult.overallScore >= star * 2;
                            return (
                              <Award 
                                key={star} 
                                className={`w-3 h-3 ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6 Dimension Radar Breakdown Progress Bars */}
                <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { labelAr: "الجدوى المالية", labelEn: "Financial", score: juryResult.breakdown.financial, icon: DollarSign, color: "bg-emerald-400" },
                    { labelAr: "قوة السوق", labelEn: "Market Strength", score: juryResult.breakdown.market, icon: BarChart2, color: "bg-cyan-400" },
                    { labelAr: "التسويق والانتشار", labelEn: "Marketing", score: juryResult.breakdown.marketing, icon: Target, color: "bg-pink-400" },
                    { labelAr: "جاذبية العملاء", labelEn: "Customer Appeal", score: juryResult.breakdown.customer, icon: Users, color: "bg-amber-400" },
                    { labelAr: "فرص النمو", labelEn: "Growth Potential", score: juryResult.breakdown.growth, icon: TrendingUp, color: "bg-purple-400" },
                    { labelAr: "مستوى المخاطر", labelEn: "Risk Level", scoreStr: juryResult.breakdown.riskLevel, icon: ShieldAlert, color: "bg-rose-400" }
                  ].map((dim, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium truncate">{isAr ? dim.labelAr : dim.labelEn}</span>
                        <dim.icon className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-white">
                          {dim.score !== undefined ? `${dim.score.toFixed(1)}` : dim.scoreStr}
                        </span>
                        {dim.score !== undefined && <span className="text-[10px] text-slate-500">/10</span>}
                      </div>
                      {dim.score !== undefined && (
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${dim.color} rounded-full`}
                            style={{ width: `${(dim.score / 10) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. JURY MEMBERS DETAILED PERSPECTIVES (7 SPECIALISTS) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? "تقييم أعضاء لجنة Lodavia (7 خبراء)" : "Lodavia Jury Members (7 Perspectives)"}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {isAr ? "اضغط على أي خبير للاطلاع على تفصيل وجهة نظره" : "Click on any specialist to view their full analysis"}
                  </span>
                </div>

                {/* Member Tabs Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {juryResult.members.map(member => {
                    const isActive = activeMemberTab === member.id;
                    const IconComponent = JURY_ICONS[member.icon] || <Briefcase className="w-4 h-4 text-purple-400" />;

                    return (
                      <button
                        key={member.id}
                        onClick={() => setActiveMemberTab(member.id)}
                        className={`p-3 rounded-2xl border text-start transition flex flex-col justify-between gap-2 ${
                          isActive 
                            ? 'bg-purple-900/30 border-purple-500 text-white shadow-lg shadow-purple-950/40' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-1.5 rounded-xl bg-slate-800/80">
                            {IconComponent}
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-purple-300' : 'text-slate-300'}`}>
                            {member.score.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold line-clamp-1">
                            {isAr ? member.nameAr : member.nameEn}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {isAr ? member.roleAr : member.roleEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Member Detailed Card */}
                {(() => {
                  const currentMember = juryResult.members.find(m => m.id === activeMemberTab) || juryResult.members[0];
                  if (!currentMember) return null;

                  return (
                    <motion.div 
                      key={currentMember.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-purple-900/30 border border-purple-500/30">
                            {JURY_ICONS[currentMember.icon] || <Briefcase className="w-6 h-6 text-purple-400" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-lg font-bold text-white">
                                {isAr ? currentMember.nameAr : currentMember.nameEn}
                              </h5>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {currentMember.score.toFixed(1)} / 10
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {isAr ? currentMember.roleAr : currentMember.roleEn}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setAskTarget(currentMember.id);
                            const askEl = document.getElementById('lodavia-ask-jury-section');
                            if (askEl) askEl.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-4 h-4" />
                          {isAr ? `اسأل ${currentMember.nameAr}` : `Ask ${currentMember.nameEn}`}
                        </button>
                      </div>

                      {/* Strengths & Weaknesses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isAr ? "نقاط القوة من هذا المنظور" : "Identified Strengths"}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {currentMember.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{isAr ? "نقاط الضعف والثغرات" : "Identified Weaknesses & Gaps"}</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {currentMember.weaknesses.map((wk, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{wk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Key Opportunity & Biggest Risk */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                            🌟 {isAr ? "أهم فرصة ذهبية" : "Key Golden Opportunity"}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {currentMember.keyOpportunity}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            ⚠️ {isAr ? "أكبر خطر يجب الانتباه له" : "Biggest Critical Risk"}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {currentMember.biggestRisk}
                          </p>
                        </div>
                      </div>

                      {/* Specialist Final Recommendation */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-purple-300 block mb-1">
                            {isAr ? "توصية الخبير المباشرة:" : "Specialist Recommendation:"}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {currentMember.recommendation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* 3. SWOT ANALYSIS MATRIX */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-bold text-white">
                    {isAr ? "تحليل SWOT الاستراتيجي" : "Strategic SWOT Analysis"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        🟢 {isAr ? "نقاط القوة (Strengths)" : "Strengths (S)"}
                      </span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {juryResult.swot.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between text-rose-400">
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        🔴 {isAr ? "نقاط الضعف (Weaknesses)" : "Weaknesses (W)"}
                      </span>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {juryResult.swot.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between text-cyan-400">
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        🔵 {isAr ? "الفرص السوقية (Opportunities)" : "Opportunities (O)"}
                      </span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {juryResult.swot.opportunities.map((o, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        🟠 {isAr ? "التهديدات والمخاطر (Threats)" : "Threats (T)"}
                      </span>
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {juryResult.swot.threats.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. FINANCIAL ESTIMATES & BREAK-EVEN */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? "التقديرات المالية ونقطة التعادل التقديرية" : "Financial Projections & Break-even"}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    {isAr ? "تقدير بالذكاء الاصطناعي" : "AI Estimate"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isAr ? "الإيرادات المتوقعة" : "Estimated Revenue"}
                    </span>
                    <p className="text-sm font-bold text-emerald-300">
                      {juryResult.financialEstimates.estimatedRevenue}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isAr ? "المصاريف التشغيلية" : "Estimated Costs"}
                    </span>
                    <p className="text-sm font-bold text-rose-300">
                      {juryResult.financialEstimates.estimatedCosts}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isAr ? "هامش الربح المتوقع" : "Expected Profit Margin"}
                    </span>
                    <p className="text-sm font-bold text-cyan-300">
                      {juryResult.financialEstimates.estimatedProfit}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isAr ? "نقطة التعادل التقديرية" : "Break-even Timeline"}
                    </span>
                    <p className="text-sm font-bold text-purple-300">
                      {juryResult.financialEstimates.breakEvenMonths}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * {isAr ? juryResult.financialEstimates.notesAr : juryResult.financialEstimates.notesEn}
                </p>
              </div>

              {/* 5. "WHAT IF?" SCENARIOS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-bold text-white">
                    {isAr ? "ماذا لو؟ (سيناريوهات مستقبلية)" : "What If? (Future Scenarios)"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Optimistic */}
                  <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Flame className="w-4 h-4" />
                      <span>{isAr ? juryResult.whatIf.optimistic.titleAr : juryResult.whatIf.optimistic.titleEn}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr ? juryResult.whatIf.optimistic.projectionAr : juryResult.whatIf.optimistic.projectionEn}
                    </p>
                    <div className="pt-2 text-[10px] text-emerald-400/80 font-medium">
                      🔑 {isAr ? "المحرك الأساسي:" : "Key Driver:"} {isAr ? juryResult.whatIf.optimistic.keyDriverAr : juryResult.whatIf.optimistic.keyDriverEn}
                    </div>
                  </div>

                  {/* Realistic */}
                  <div className="p-5 rounded-2xl bg-blue-950/15 border border-blue-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <TrendingUp className="w-4 h-4" />
                      <span>{isAr ? juryResult.whatIf.realistic.titleAr : juryResult.whatIf.realistic.titleEn}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr ? juryResult.whatIf.realistic.projectionAr : juryResult.whatIf.realistic.projectionEn}
                    </p>
                    <div className="pt-2 text-[10px] text-blue-400/80 font-medium">
                      🔑 {isAr ? "المحرك الأساسي:" : "Key Driver:"} {isAr ? juryResult.whatIf.realistic.keyDriverAr : juryResult.whatIf.realistic.keyDriverEn}
                    </div>
                  </div>

                  {/* Conservative */}
                  <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{isAr ? juryResult.whatIf.conservative.titleAr : juryResult.whatIf.conservative.titleEn}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr ? juryResult.whatIf.conservative.projectionAr : juryResult.whatIf.conservative.projectionEn}
                    </p>
                    <div className="pt-2 text-[10px] text-amber-400/80 font-medium">
                      🔑 {isAr ? "المحرك الأساسي:" : "Key Driver:"} {isAr ? juryResult.whatIf.conservative.keyDriverAr : juryResult.whatIf.conservative.keyDriverEn}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. RECOMMENDED ACTION & SMART TOOL SHORTCUTS */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900 border border-purple-500/30 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? "الخطوة العملية التالية وأدوات التنفيذ المقترحة" : "Immediate Next Steps & Recommended Tools"}
                    </h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-xs text-purple-200 leading-relaxed font-medium">
                    🎯 {isAr ? "الخطوة الأولى الموصى بها فوراً:" : "Recommended First Action:"} {isAr ? juryResult.nextStepAr : juryResult.nextStepEn}
                  </div>
                </div>

                {/* Smart Shortcuts to Existing Tools */}
                {juryResult.recommendedTools && juryResult.recommendedTools.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-300 block">
                      {isAr ? "أدوات لودافيا الموصى بها لمعالجة ثغرات المشروع والبدء فوراً:" : "Lodavia Tools to Execute & Address Gaps:"}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {juryResult.recommendedTools.map(tool => (
                        <button
                          key={tool.toolId}
                          onClick={() => {
                            onClose();
                            if (onTriggerTool) {
                              onTriggerTool(tool.toolId, {
                                projectName: juryResult.input.projectName,
                                description: juryResult.input.description,
                                category: juryResult.input.projectType,
                                targetAudience: juryResult.input.targetAudience
                              });
                            }
                          }}
                          className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-purple-500/50 text-start transition group flex items-start justify-between gap-3 shadow-md"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white group-hover:text-purple-300 transition flex items-center gap-1.5">
                              {isAr ? tool.titleAr : tool.titleEn}
                            </span>
                            <p className="text-[11px] text-slate-400">
                              {isAr ? tool.reasonAr : tool.reasonEn}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0 mt-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 7. ASK THE JURY ("💬 اسأل اللجنة") */}
              <div id="lodavia-ask-jury-section" className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? "اسأل لجنة Lodavia AI" : "Ask the Lodavia AI Jury"}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {isAr ? "احصل على إجابة استشارية من اللجنة كاملة أو من خبير محدد" : "Get panel consensus or specialist direct answer"}
                  </span>
                </div>

                {/* Target Specialist Select */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400">{isAr ? "الموجه إليه:" : "Target:"}</span>
                  <button
                    onClick={() => setAskTarget('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      askTarget === 'all'
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ⚖️ {isAr ? "اللجنة كاملة" : "Full Jury Panel"}
                  </button>
                  {juryResult.members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setAskTarget(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        askTarget === m.id
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isAr ? m.nameAr : m.nameEn}
                    </button>
                  ))}
                </div>

                {/* Quick Questions Pills */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskJury(q)}
                      disabled={isAsking}
                      className="px-3 py-1.5 rounded-full text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>

                {/* Custom Question Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={askQuestion}
                    onChange={e => setAskQuestion(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAskJury();
                    }}
                    placeholder={isAr 
                      ? "اكتب سؤالك للجنة... (مثال: هل السعر المقترح مناسب للمستخدمين؟)" 
                      : "Type your question to the jury... (e.g. Is my pricing realistic?)"}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-slate-500"
                  />
                  <button
                    onClick={() => handleAskJury()}
                    disabled={!askQuestion.trim() || isAsking}
                    className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isAsking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isAr ? "إرسال" : "Send"}</span>
                  </button>
                </div>

                {/* Q&A Answers History */}
                {juryAnswersHistory.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    {juryAnswersHistory.map((ans, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            💬 {ans.question}
                          </span>
                          <span className="text-slate-500 font-normal">
                            {ans.targetMember === 'all' ? (isAr ? "اللجنة كاملة" : "Full Jury") : ans.targetMember}
                          </span>
                        </div>

                        {/* If Multiple Perspectives */}
                        {ans.perspectives && ans.perspectives.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
                            {ans.perspectives.map((p, pIdx) => (
                              <div key={pIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                                <span className="text-[11px] font-bold text-slate-300 block">
                                  {isAr ? p.memberNameAr : p.memberNameEn}
                                </span>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {isAr ? p.answerAr : p.answerEn}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Final Verdict */}
                        {ans.finalVerdictAr && (
                          <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                            {isAr ? ans.finalVerdictAr : ans.finalVerdictEn}
                          </div>
                        )}

                        {/* Single Specialist Answer */}
                        {ans.singleAnswerAr && (
                          <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                            {isAr ? ans.singleAnswerAr : ans.singleAnswerEn}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 8. FOOTER ACTIONS: COPY & RE-EVALUATE */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <button
                  onClick={() => setStep('form')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  {isAr ? "تعديل بيانات المشروع وإعادة التقييم" : "Edit Details & Re-evaluate"}
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleCopyReport}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedReport ? (isAr ? "تم نسخ التقرير بنجاح!" : "Report Copied!") : (isAr ? "نسخ تقرير التقييم" : "Copy Report")}</span>
                  </button>
                </div>
              </div>

              {/* Transparency Notice Disclaimer */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-500 leading-relaxed text-center">
                ⚖️ {isAr 
                  ? "تنبيه الشفافية: هذا التقييم مولد بالذكاء الاصطناعي من منصة Lodavia عبر محاكاة 7 وجهات نظر تحليلية. الهدف منه مساعدة أصحاب المشاريع على تطوير أفكارهم، ولا يضمن أرباحاً مالية أو نجاحاً حتمياً في السوق."
                  : "Transparency Notice: This evaluation is generated by Lodavia AI via 7 simulated analytical perspectives to assist founders in brainstorming. It does not guarantee financial profit or market success."}
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
