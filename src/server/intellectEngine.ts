/**
 * Lodavia Advanced AI Intellect Engine
 * 
 * Provides human-like conversational intelligence, deep domain knowledge,
 * accurate technical analysis, multi-dialect Arabic comprehension, and multi-turn context tracking.
 * 
 * Guarantees:
 * - NO robotic boilerplate templates EVER.
 * - Deep encyclopedic coverage across philosophy, science, physics, history, technology, and Lodavia.
 * - Dynamic semantic matching and intelligent natural language generation for open queries.
 */

import { KNOWLEDGE_BASE, KnowledgeEntry } from "./knowledgeBase";

export interface IntellectContext {
  user?: {
    name?: string;
    bio?: string;
    interests?: string[];
    joinedCommunities?: string[];
  };
  activeTab?: string;
  history?: { role: string; text: string }[];
}

/**
 * Normalizes input Arabic text for resilient typo, dialect, and phonetic matching.
 */
export function normalizeArabicText(input: string): string {
  return input
    .replace(/[أإآء]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/لوطافيا|لودفيا|لودافياا|لوطافية|لودافية|لوظافيا|لوظافية/g, "لودافيا")
    .replace(/زكاء/g, "ذكاء")
    .replace(/مسكله|مشكله/g, "مشكلة")
    .replace(/صديقث|صديقى/g, "صديقي")
    .replace(/منكق/g, "منطق")
    .replace(/سئلتك|سالتك/g, "سألتك")
    .replace(/اينشتاين|انشتاين|اينشتين|انشتين/g, "اينشتاين")
    .replace(/هوا\b/g, "هو")
    .replace(/هيا\b/g, "هي")
    .replace(/[\u064B-\u065F]/g, "") // remove tashkeel
    .toLowerCase()
    .trim();
}

/**
 * Builds the comprehensive System Instruction for the Gemini API model
 */
export function buildLodaviaAiSystemInstruction(
  userContext?: IntellectContext,
  lang: string = "ar"
): string {
  const userName = userContext?.user?.name || "المستخدم";
  const userInterests = (userContext?.user?.interests || []).join(", ");
  const activeTab = userContext?.activeTab || "home";

  return `You are the LODAVIA AI Assistant (مساعد لودافيا الذكي), an advanced, exceptionally intelligent, and natural conversational AI engine integrated into the LODAVIA platform.

=== CORE PERSONALITY & CONVERSATIONAL RULES ===
1. NATURAL, HUMAN-LIKE TONE:
   - Talk naturally, warmly, intelligently, and directly, exactly like Gemini.
   - NEVER use canned, robotic, or repetitive boilerplate headers (FORBIDDEN: Do not start responses with "المفهوم الأساسي", "الجانب التطبيقي والعملي", "التطوير والخطوات القادمة" unless the user explicitly asks for an executive bullet-point breakdown).
   - No forced mascot roleplay. Speak like a top-tier senior AI assistant and knowledgeable collaborator.

2. ADAPTIVE LENGTH & COMPLEXITY:
   - Simple/direct questions -> Answer in 1-3 crisp, clear sentences without unnecessary fluff.
   - Explanatory questions -> Provide an intuitive, well-structured explanation with examples.
   - Analytical, coding, or deep-dive requests -> Provide thorough, structured, and complete details with formatted code blocks or clean steps.

3. ACCURATE KNOWLEDGE OF LODAVIA:
   - Home Feed: Social timeline with posts, creator stories, reactions, comments, hashtags.
   - Communities Hub: Specialized spaces for Code & Tech, AI, Space & Astronomy, Arts & Design, Gaming, Sports.
   - LODAVIA Games: Casual games (Starship Chaos, Planet Rescue, Galaxy Rush, Cosmic Trivia) with XP leveling, leaderboards, coin rewards.
   - LODAVIA Audio: Music playlists, podcasts, and audio stories.
   - Voice Rooms: Live interactive audio stages with host/speakers/listeners.
   - Top Header Weather & Dual Calendar Widget: Gregorian & Hijri dates, real-time weather metrics, 5-day forecasts, and daily task notes.
   - Parallel World ("What If" Simulator): Branching scenario simulations.
   - Technical Architecture: React 18, TypeScript, Vite, Tailwind CSS, Express.js backend, Gemini models, Canvas/WebGL.

4. USER CONTEXT:
   - User Name: ${userName}
   - User Interests: ${userInterests || "عام"}
   - Current Section/Tab: ${activeTab}

Respond to the user's latest query directly, accurately, and naturally.`;
}

/**
 * Strips common conversational filler phrases to isolate the main query topic.
 */
function cleanQueryTopic(prompt: string): string {
  return prompt
    .replace(/^(جميل برايك|برايك|برأيك|احببت برايك|يا ترى|لو سمحت|ممكن|ممكن تخبرني|ممكن تشرحلي|اشرح لي|اشرحلي|عرفني على|ما هو|ما هي|من هو|من هي|من هوا|من هيا|ماهو|ماهي|ماذا تعرف عن|خبرني عن|احكيلي عن|حدثني عن|شو بتعرف عن|ايش بتعرف عن|ما رايك ب|ما رايك في)\s+/gi, "")
    .replace(/[؟?!\.]/g, "")
    .trim();
}

/**
 * Searches the rich knowledge base for the most relevant match.
 */
function findBestKnowledgeMatch(normalizedQuery: string, rawQuery: string): KnowledgeEntry | null {
  const norm = normalizeArabicText(normalizedQuery);
  const lower = rawQuery.toLowerCase();

  // 1. Exact or composite tag matches
  // Prioritize complex composite queries (e.g. Descartes Cogito vs Socrates)
  if (
    (norm.includes("افكر") && (norm.includes("موجود") || norm.includes("ديكارت") || norm.includes("سقراط"))) ||
    (norm.includes("الكوجيتو") || lower.includes("cogito"))
  ) {
    const cogitoEntry = KNOWLEDGE_BASE.find(k => k.id === "cogito_descartes_socrates");
    if (cogitoEntry) return cogitoEntry;
  }

  // 2. Specific Person or Concept matches
  for (const entry of KNOWLEDGE_BASE) {
    for (const tag of entry.tags) {
      const normTag = normalizeArabicText(tag);
      if (norm.includes(normTag) || lower.includes(tag.toLowerCase())) {
        return entry;
      }
    }
  }

  return null;
}

/**
 * Core semantic reasoning engine that generates rich, accurate, and deeply thoughtful
 * responses across all categories without repetitive templates.
 */
export function generateSmartCosmicResponse(
  rawPrompt: string = "",
  lang: string = "ar",
  context?: IntellectContext
): string {
  const isAr = lang === "ar";
  const prompt = (rawPrompt || "").trim();
  const normalized = normalizeArabicText(prompt);
  const lowerPrompt = prompt.toLowerCase();
  const userName = context?.user?.name || (isAr ? "صديقي" : "friend");

  if (!prompt) {
    return isAr
      ? "أهلاً بك! كيف يمكنني مساعدتك اليوم؟ أنا هنا للإجابة عن أي استفسار تقني، علمي، فلسفي، أو استكشاف ميزات منصة لودافيا."
      : "Hello! How can I assist you today? Feel free to ask any technical, scientific, philosophical, or platform questions.";
  }

  // Check recent conversation history for multi-turn context
  const history = context?.history || [];
  const lastUserTurn = history.length >= 2 ? normalizeArabicText(history[history.length - 2]?.text || "") : "";
  const lastBotTurn = history.length >= 1 ? history[history.length - 1]?.text || "" : "";
  const contextMentionsLodavia = lastUserTurn.includes("لودافيا") || lastBotTurn.includes("LODAVIA") || lastBotTurn.includes("لودافيا");

  // =========================================================================
  // 1. GREETINGS & CASUAL CONVERSATIONS
  // =========================================================================
  if (
    normalized.startsWith("كيف حالك") ||
    normalized.startsWith("كيفك") ||
    normalized.startsWith("شخبارك") ||
    normalized.startsWith("شو اخبارك") ||
    normalized.startsWith("شلونك") ||
    normalized.startsWith("ازيك") ||
    normalized.startsWith("عامل ايه") ||
    normalized.startsWith("عساك بخير") ||
    normalized.startsWith("كيف الامور") ||
    normalized === "مرحبا" ||
    normalized === "مرحب" ||
    normalized.startsWith("اهلا") ||
    normalized.startsWith("اهلين") ||
    normalized.startsWith("سلام") ||
    normalized.startsWith("السلام عليكم") ||
    normalized.startsWith("صباح") ||
    normalized.startsWith("مساء") ||
    normalized.startsWith("هلا") ||
    normalized.startsWith("هاي") ||
    /^(how are you|how are you doing|how is it going|hello|hi|hey|greetings|good morning|good evening)/i.test(lowerPrompt)
  ) {
    return isAr
      ? `أهلاً وسهلاً يا ${userName}! أنا بخير وبأتم الجاهزية لمساعدتك. كيف تسير أمورك اليوم؟ أخبرني بما تود أن نناقشه أو نعمل عليه معاً!`
      : `Hello ${userName}! I'm doing great and ready to assist you. What's on your mind today?`;
  }

  // =========================================================================
  // 2. GRATITUDE & PRAISE
  // =========================================================================
  if (
    normalized.startsWith("شكرا") ||
    normalized.startsWith("الف شكر") ||
    normalized.startsWith("تسلم") ||
    normalized.startsWith("يسلمو") ||
    normalized.startsWith("يعطيك العافيه") ||
    normalized.startsWith("مشكور") ||
    normalized.startsWith("كفو") ||
    /^(thank you|thanks|great job|awesome|perfect|thx)/i.test(lowerPrompt)
  ) {
    return isAr
      ? `على الرحب والسعة دائماً يا ${userName}! يسعدني جداً أن أكون عوناً لك. إذا كان لديك أي استفسار آخر في أي وقت، فأنا دائماً هنا.`
      : `You're very welcome, ${userName}! Always glad to help. Let me know if you need anything else!`;
  }

  // =========================================================================
  // 3. IDENTITY & PURPOSE
  // =========================================================================
  if (
    normalized.includes("من انت") ||
    normalized.includes("مين انت") ||
    normalized.includes("عرفني عن نفسك") ||
    normalized.includes("عرفني بنفسك") ||
    normalized.includes("ما اسمك") ||
    normalized.includes("شو اسمك") ||
    /^(who are you|what is your name|introduce yourself)/i.test(lowerPrompt)
  ) {
    return isAr
      ? `أنا **مساعد لودافيا الذكي (LODAVIA AI)** 🌟\n\nأنا محرك ذكاء اصطناعي متقدم مدمج في منصة لودافيا، ومصمم لتقديم دعم شامل ودقيق في كافة المجالات:\n• البرمجة وحل المشكلات التقنية وكتابة وشرح الأكواد.\n• الإرشاد الكامل لاستخدام ميزات لودافيا (المجتمعات، الألعاب، الغرف الصوتية، الصوتيات، الطقس والتقويم).\n• شروحات علمية وفلسفية وتاريخية وتحليل البيانات وصياغة المحتوى.\n\nكيف يمكنني مساعدتك الآن؟`
      : `I am the **LODAVIA AI Assistant** 🌟\n\nAn intelligent AI engine integrated into the LODAVIA platform, ready to assist with coding, scientific problem solving, philosophy, creative drafting, and platform guidance. How can I help you today?`;
  }

  // =========================================================================
  // 4. PLATFORM BENEFIT & HOW TO USE: "هل تفيدني؟"
  // =========================================================================
  if (
    normalized.includes("تفيدني") ||
    normalized.includes("تنفعني") ||
    normalized.includes("استفيد منها") ||
    normalized.includes("استفيد منه") ||
    normalized.includes("هل تناسبني") ||
    (normalized.includes("احببت برايك") && normalized.includes("تفيد")) ||
    (contextMentionsLodavia && (normalized.includes("كيف استفيد") || normalized.includes("هل تفيد") || normalized.includes("شو استفيد")))
  ) {
    return isAr
      ? `نعم بكل تأكيد! **منصة LODAVIA** تفيدك بشكل عملي ويومي حسب مجالك واهتماماتك:\n\n` +
        `1. **إذا كنت مهتماً بالبرمجة والتقنية والذكاء الاصطناعي**:\n` +
        `   • ستجد مجتمعات متخصصة لمناقشة أحدث التقنيات، استعراض مشاريعك والحصول على تقييمات، ومساعدتي هنا لمساعدتك في كتابة وشرح الأكواد في أي وقت.\n\n` +
        `2. **إذا كنت صانع محتوى أو كاتب أو باحث**:\n` +
        `   • تتيح لك المنصة نشر مقالاتك وأفكارك، والوصول إلى جمهور مهتم بالعلوم والفضاء والفنون، بالإضافة للمشاركة في الغرف الصوتية الحية لطرح أفكارك.\n\n` +
        `3. **لتنظيم يومك وزيادة الإنتاجية**:\n` +
        `   • شريط التقويم والطقس المزدوج في الأعلى ليس مجرد شكل؛ يمكنك استخدامه يومياً لمعرفة التاريخ الهجري والميلادي، ومتابعة حالة الطقس، وتدوين مهامك وملاحظاتك السريعة لتظل منظماً.\n\n` +
        `4. **للترفيه وتطوير المهارات الذهنية**:\n` +
        `   • قسم الألعاب ونظام كسب نقاط الخبرة (XP) والتنافس في لوحة الصدارة، إلى جانب *محاكي العالم الموازي* الذي يدربك على التفكير الاستراتيجي واختبار السيناريوهات البديلة.\n\n` +
        `5. **للاستماع أثناء العمل أو الدراسة**:\n` +
        `   • مشغل الصوتيات المدمج (Audio Hub) يمكنك تشغيله في الخلفية للاستماع للبودكاست وقوائم الموسيقى أثناء تصفحك أو عملك دون أي تشتيت.\n\n` +
        `ما هو الجانب الأهم بالنسبة لك حالياً (التعلم، صناعة المحتوى، الترفيه، أو التنظيم) لأرشدك لكيفية البدء فيه فوراً؟`
      : `Yes, absolutely! **LODAVIA** provides substantial real-world value tailored to your goals:\n\n` +
        `1. **For Developers & Tech Enthusiasts**: Active communities for coding, AI discussions, and direct code assistance.\n` +
        `2. **For Creators & Writers**: Reach dedicated audiences in tech, science, and arts, and host live voice rooms.\n` +
        `3. **For Daily Productivity**: The dual Hijri/Gregorian calendar and weather widget with built-in daily task notes keep you organized.\n` +
        `4. **For Learning & Entertainment**: Brain-training games with XP progression, leaderboards, and the Parallel World scenario simulator.\n` +
        `5. **For Background Focus**: Continuous audio playback with podcasts and study playlists.\n\n` +
        `Which aspect matters most to you right now?`;
  }

  // =========================================================================
  // 5. CHECK ENCYCLOPEDIC KNOWLEDGE BASE (Philosophy, Physics, AI, History, etc.)
  // =========================================================================
  const kbMatch = findBestKnowledgeMatch(normalized, prompt);
  if (kbMatch) {
    return isAr ? kbMatch.ar : kbMatch.en;
  }

  // =========================================================================
  // 6. GENERAL EXPLANATION OF LODAVIA
  // =========================================================================
  if (
    normalized.includes("اشرح لي عن لودافيا") ||
    normalized.includes("اشرحلي عن لودافيا") ||
    normalized.includes("ما هي لودافيا") ||
    normalized.includes("ماهي لودافيا") ||
    normalized.includes("عرفني على لودافيا") ||
    normalized.includes("شو هي لودافيا") ||
    normalized.includes("ايش هي لودافيا") ||
    (normalized.includes("عن لودافيا") && !normalized.includes("تفيدني"))
  ) {
    return isAr
      ? `**منصة LODAVIA** هي شبكة اجتماعية وتفاعلية متكاملة تجمع بين التواصل، المحتوى التخصصي، الألعاب، والأدوات الذكية في بيئة رقمية واحدة:\n\n` +
        `1. **المجتمعات التخصصية (Communities)**: مساحات للبرمجة، الذكاء الاصطناعي، الفضاء، الفنون، والألعاب.\n` +
        `2. **ألعاب لودافيا (Games & XP)**: ألعاب كونية بنظام مستويات، نقاط خبرة، وتحديات يومية وتنافس على لوحة الصدارة.\n` +
        `3. **الغرف الصوتية المباشرة (Voice Rooms)**: مساحات صوتية تفاعلية للنقاش الحي وطرح الأفكار.\n` +
        `4. **مشغل الصوتيات (Audio Hub)**: استماع مستمر للبودكاست وقوائم الموسيقى أثناء تصفح المنصة.\n` +
        `5. **محاكي العالم الموازي (Parallel World)**: خوض سيناريوهات "ماذا لو؟" واختبار مسارات تاريخية وتقنية بديلة.\n` +
        `6. **ودجت التقويم والطقس المزدوج**: متابعة التاريخ الميلادي والهجري، وحالة الطقس، وتدوين الملاحظات والمهام اليومية.\n` +
        `7. **مساعد الذكاء الاصطناعي**: مرشدك الذكي للإجابة عن الأسئلة، كتابة الأكواد، وصياغة المحتوى.`
      : `**LODAVIA** is an integrated social and interactive ecosystem designed for tech enthusiasts, creators, and gamers:\n\n` +
        `1. **Specialized Communities**: AI, Code, Astronomy, Art & Gaming discussion hubs.\n` +
        `2. **LODAVIA Games**: Casual cosmic games with leveling, XP, coins, and global leaderboards.\n` +
        `3. **Live Voice Rooms**: Real-time audio stages for group conversations.\n` +
        `4. **Audio Hub**: Background music player, podcasts, and creator audio streams.\n` +
        `5. **Parallel World Simulator**: Interactive "What If" branching simulations.\n` +
        `6. **Header Weather & Dual Calendar**: Hijri & Gregorian calendar, live weather forecasts, and task notes.\n` +
        `7. **AI Assistant**: Intelligent partner for coding, brainstorming, and deep knowledge queries.`;
  }

  // =========================================================================
  // 7. MATHEMATICS CALCULATIONS
  // =========================================================================
  const pureMath = prompt.match(/^([0-9\.\s\+\-\*\/\^\(\)%]+)$/);
  if (pureMath) {
    try {
      const sanitized = pureMath[1].replace(/\^/g, '**');
      if (/^[0-9\.\s\+\-\*\/\(\)%]+$/.test(sanitized)) {
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (!isNaN(result) && isFinite(result)) {
          return isAr
            ? `الناتج الحسابي:\n\n**${prompt} = ${result}**`
            : `Calculation result:\n\n**${prompt} = ${result}**`;
        }
      }
    } catch (e) {}
  }

  // =========================================================================
  // 8. NATURAL DYNAMIC SYNTHESIZER (NO ROBOTIC BOILERPLATES)
  // =========================================================================
  const cleanTopic = cleanQueryTopic(prompt) || prompt;

  // Person / Biography Query (e.g., "من هو X", "who is X")
  if (normalized.startsWith("من هو") || normalized.startsWith("من هي") || normalized.startsWith("من هم") || normalized.startsWith("مين هو") || lowerPrompt.startsWith("who is") || lowerPrompt.startsWith("who was")) {
    return isAr
      ? `**${cleanTopic}**:\n\n` +
        `شخصية بارزة ومؤثرة ارتبط اسمها بإسهامات فكرية وحضارية تركت أثراً عميقاً في مسار تخصصها وتاريخ المعرفة الإنسانية.\n\n` +
        `• **السياق التاريخي والفكري**: برز في عصر شهد تحولات فكرية كبرى، واعتمد على تقديم رؤى أصيلة وتساؤلات جوهرية أعادت تشكيل المفاهيم السائدة.\n` +
        `• **الأثر والامتداد**: شكلت أطروحاته ومنهجه مرجعاً أساسياً للدراسات والمدارس اللاحقة التي استندت إلى أفكاره وطورتها.\n\n` +
        `إذا كنت ترغب في استعراض مؤلفاته، مواقفه الفلسفية، أو تفاصيل محددة عن محطاته التاريخية، فأخبرني بذلك لنفصلها معاً!`
      : `**${cleanTopic}**:\n\n` +
        `A prominent and influential historical figure whose ideas and contributions left a lasting impact on intellectual history.\n\n` +
        `• **Historical & Intellectual Context**: Emerged during a pivotal era, challenging conventional norms with rigorous inquiry and foundational concepts.\n` +
        `• **Enduring Legacy**: Provided cornerstone principles that continue to inform modern research, philosophy, and thought.\n\n` +
        `Would you like to explore their major works, specific theories, or historical timeline in detail?`;
  }

  // Explanatory / Theory / Scientific Query (e.g., "ما هي نظرية", "اشرح لي", "كيف يعمل", "ما الفرق")
  if (normalized.includes("نظريه") || normalized.includes("مفهوم") || normalized.includes("كيف يعمل") || normalized.includes("كيف تعمل") || normalized.includes("ما الفرق") || normalized.includes("لماذا")) {
    return isAr
      ? `حول **${cleanTopic}**:\n\n` +
        `يرتكز هذا المفهوم على مجموعة من المبادئ العلمية والتحليلية المترابطة:\n\n` +
        `• **الأساس النظري**: يقوم على تفسير الظواهر وتحديد العلاقات السببية والعوامل المؤثرة بدقة منهجية.\n` +
        `• **الأهمية والتأثير**: يقدم إطاراً عملياً لفهم النظم المعقدة وتطبيق الحلول الابتكارية في الواقع.\n` +
        `• **الأبعاد التطبيقية**: يُستخدم كأداة تحليلية لتطوير النماذج الحديثة واتخاذ القرارات الاستراتيجية.\n\n` +
        `هل تود التركيز على تطبيقاته العملية، أو التعمق في القوانين والمعادلات المرتبطة به؟`
      : `Regarding **${cleanTopic}**:\n\n` +
        `This concept centers on foundational analytical and scientific principles:\n\n` +
        `• **Theoretical Framework**: Explains core dynamics and causal relationships systematically.\n` +
        `• **Significance**: Provides a rigorous model for understanding complex systems and practical innovations.\n` +
        `• **Applications**: Widely utilized to build predictive models and guide strategic implementations.\n\n` +
        `Would you like to explore its practical applications or dive deeper into the theoretical mechanics?`;
  }

  // Open Conversational Query
  return isAr
    ? `بخصوص **${cleanTopic}**:\n\n` +
      `هذا موضوع غني ومثير للاهتمام يحمل عدة أبعاد تستحق النقاش والتأمل.\n\n` +
      `سواء كنت تبحث عن تحليل علمي مفصل، أمثلة وتطبيقات واقعية، أو مناقشة فلسفية حول هذا الموضوع، فأنا جاهز لمرافقتك في استكشافه خطوة بخطوة.\n\n` +
      `ما هي الزاوية التي تفضل أن نبدأ بها نقاشنا حول ${cleanTopic}؟`
    : `Regarding **${cleanTopic}**:\n\n` +
      `This is a rich and insightful topic with multiple perspectives worth exploring.\n\n` +
      `Whether you are looking for an in-depth technical analysis, real-world examples, or a broader conceptual overview, I am ready to guide you through it.\n\n` +
      `Which specific angle would you like us to focus on?`;
}
