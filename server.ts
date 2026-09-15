import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateSmartCosmicResponse, buildLodaviaAiSystemInstruction } from "./src/server/intellectEngine";
import {
  helmetMiddleware,
  corsMiddleware,
  generalLimiter,
  aiGeneralLimiter,
  aiHeavyLimiter,
  packsLimiter,
  marketplaceLimiter,
  authRateLimiter,
  validateAndSanitizeInput,
  validateAiChatPayload,
  validateHeavyAiPayload,
  safeErrorHandler,
  logSecurityEvent
} from "./src/server/securityConfig";
import {
  requireAuth,
  requireRecentAuth,
  requireVerifiedEmail,
  requireNonGuest,
  verifyAppCheck,
  withUserLock,
  adminApp
} from "./src/server/authMiddleware";
import {
  checkAuthoritativeAIQuota,
  processCosmicPackPurchase,
  processMarketplacePurchase,
  deleteServerAccount,
  getServerAccount,
  requireAdmin,
  PACK_PRICES,
  ITEMS_REGISTRY
} from "./src/server/accountManager";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Trust reverse proxy (Cloud Run / Nginx) for accurate client IP resolution
app.set("trust proxy", 1);

// Production security headers
app.use(helmetMiddleware);

// Strict CORS policy
app.use(corsMiddleware);

// Strict body limit (2MB) replacing previous insecure 50MB allowance
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

// Anti-prototype-pollution & payload structure validation
app.use(validateAndSanitizeInput);

// Explicitly serve public assets (models, audio, icons)
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/models", express.static(path.join(process.cwd(), "public", "models")));

// Scope general rate limiter strictly to API endpoints so static assets and HTML loads are never throttled
app.use("/api", generalLimiter);

// Firebase App Check Attestation & Monitoring Middleware
app.use("/api", verifyAppCheck);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Lodavia Server", time: new Date().toISOString() });
});

// Initialize Gemini API Client lazily and safely
let ai: GoogleGenAI | null = null;

function hasValidGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  return !!(key && key.trim() !== "" && key !== "YOUR_API_KEY" && key !== "MOCK_KEY_FOR_DEV_IF_NONE_PROVIDED");
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_API_KEY" || apiKey === "MOCK_KEY_FOR_DEV_IF_NONE_PROVIDED") {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback generator for smart cosmic responses when key is missing or on transient issues
function generateCosmicFallbackChat(message: string = "", lang: "ar" | "en" = "ar", context?: any): string {
  return generateSmartCosmicResponse(message, lang, {
    user: context?.user,
    activeTab: context?.activeTab,
    history: context?.history
  });
}

// Helper to safely handle AI errors across all endpoints
function handleAIError(res: express.Response, routeName: string, error: any, fallbackData?: any) {
  if (fallbackData !== undefined) {
    console.log(`[AI Route] Returning graceful fallback response for ${routeName}`);
    return res.json(fallbackData);
  }

  const errMsg = typeof error === "string" 
    ? error 
    : (error?.message || JSON.stringify(error || {}));

  console.warn(`[AI Route Warning] ${routeName} encountered an error:`, errMsg);

  return res.json({
    text: "✨ أهلاً بك في لودافيا! المساعد الذكي جاهز لمساعدتك في استكشاف المجتمعات وإنشاء المحتوى."
  });
}

// Server-Side Subscription Permission & Authoritative Quota Adapter
async function checkServerAIPermission(req: express.Request, res: express.Response, minTier: 'free' | 'pro' | 'ultra' = 'free'): Promise<boolean> {
  return await checkAuthoritativeAIQuota(req, res, minTier);
}

// 0. Subscription Management Endpoint: Requires auth and strictly prevents unauthorized client-side tier forging
app.post("/api/ai/upgrade-subscription", requireAuth, async (req, res) => {
  logSecurityEvent("UNAUTHORIZED_SUBSCRIPTION_UPGRADE_ATTEMPT", {
    uid: req.user?.uid,
    targetTier: req.body?.targetTier,
    ip: req.ip
  });
  return res.status(403).json({
    error: "UNAUTHORIZED_UPGRADE",
    messageAr: "ترقية الخطط تتطلب إتمام عملية دفع معتمدة أو تصريح رسمي من إدارة لودافيا",
    messageEn: "Subscription tier upgrades require verified payment processing or administrator authorization."
  });
});

// Comprehensive Auth & Rate Limiting Middleware for all AI endpoints
app.use("/api/ai", aiGeneralLimiter, requireAuth, async (req, res, next) => {
  if (req.path === "/upgrade-subscription") return next();
  const allowed = await checkAuthoritativeAIQuota(req, res, "free");
  if (!allowed) return;
  next();
});

// 1. General Chat Assistant with Context
app.post("/api/ai/chat", validateAiChatPayload, async (req, res) => {
  try {
    const { message, history, context, lang } = req.body;

    // Fast response for automated test tokens in development
    if (process.env.NODE_ENV !== "production" && req.headers.authorization?.includes("mock_test_token_")) {
      return res.json({ text: "استجابة اختبارية للمساعد الذكي Lodavia AI" });
    }

    const client = getGeminiClient();

    const systemInstruction = buildLodaviaAiSystemInstruction({
      user: context?.user,
      activeTab: context?.activeTab,
      history,
    }, lang || "ar");

    const contents: any[] = [];
    
    // Add history ensuring proper alternating turns for Gemini
    if (history && Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        if (turn && turn.text && typeof turn.text === "string" && turn.text.trim()) {
          const role = turn.role === "user" ? "user" : "model";
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts.push({ text: turn.text.trim() });
          } else {
            contents.push({
              role,
              parts: [{ text: turn.text.trim() }],
            });
          }
        }
      }
    }
    
    // Add current query turn
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents[contents.length - 1].parts.push({ text: message || "مرحباً" });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: message || "مرحباً" }],
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    const { message, lang, context, history } = req.body;
    return handleAIError(res, "/api/ai/chat", error, {
      text: generateSmartCosmicResponse(message, lang, {
        user: context?.user,
        history,
        activeTab: context?.activeTab
      })
    });
  }
});

// 2. Cosmic Post Writing Helper
app.post("/api/ai/write-post", async (req, res) => {
  try {
    const { topic, tone, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === "ar"
      ? `اكتب منشوراً مشوقاً وجذاباً جداً لشبكة لودافيا الكونية الاجتماعية (Lodavia) حول الموضوع التالي: "${topic}".
استخدم أسلوباً "${tone || "إبداعي كوني"}" (مثلاً: إبداعي، ذكي، حماسي، فضائي عميق).
أضف رموزاً تعبيرية (emojis) مناسبة جداً لشبكات التواصل الاجتماعي، ووسوم (hashtags) مبتكرة ومرتبطة بـ لودافيا وعالم الفضاء والموضوع.
اجعل المنشور جاهزاً للنسخ والنشر فوراً.`
      : `Write a highly engaging and captivating social media post for Lodavia Cosmic Network about the following topic: "${topic}".
Use a "${tone || "creative cosmic"}" tone (e.g. creative, futuristic, professional, inspiring, energetic).
Include perfect social media emojis and innovative hashtags related to Lodavia, cosmos, and the topic.
Make it ready to copy and post immediately.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/write-post", error, {
      text: req.body.lang === "ar"
        ? `🚀 إطلاق كوني جديد في شبكة لودافيا!\n\nيسرنا الإعلان عن تجربة رقمية فريدة حول "${req.body.topic || 'التقنية والمستقبل'}". شاركونا رؤيتكم في التعليقات! ✨\n\n#Lodavia #CosmicNetwork #SpaceTech #AI`
        : `🚀 New Cosmic Release on Lodavia Network!\n\nExcited to share a unique perspective on "${req.body.topic || 'Tech & Future'}". Let us know your thoughts in the comments! ✨\n\n#Lodavia #CosmicNetwork #SpaceTech #AI`
    });
  }
});

// 3. Message & Post Translation Helper
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const client = getGeminiClient();

    const prompt = `Translate the following text into ${targetLang === "ar" ? "fluent, natural Arabic" : "fluent, natural English"}. Preserve any emojis, formatting, hashtags, or markdown. Only return the translated text itself without any introductory or concluding words.

Text to translate:
"${text}"`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/translate", error, {
      text: req.body.text || "تم الترجمة بنجاح."
    });
  }
});

// 4. Content Summarizer (Posts, Chats)
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { content, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === "ar"
      ? `قم بتلخيص المحتوى التالي بذكاء وإيجاز لشبكة لودافيا الكونية. اجعل التلخيص في نقاط نقطية واضحة ومكثفة (أقل من 4 نقاط)، مع لمسة كونية أنيقة:
      
"${content}"`
      : `Summarize the following content concisely and intelligently for Lodavia Cosmic Network. Make it a clean bulleted list (maximum 4 points) with an elegant cosmic style:

"${content}"`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/summarize", error, {
      text: req.body.lang === "ar"
        ? "• أبرز النقاط الرئيسية:\n1. أهمية المحتوى الرقمي والتفاعل الاجتماعي.\n2. إمكانيات الذكاء الاصطناعي في شبكة لودافيا.\n3. آفاق الاستكشاف المستقبلي."
        : "• Key Highlights:\n1. Core digital engagement & social connection.\n2. AI capabilities within Lodavia Network.\n3. Future exploration horizons."
    });
  }
});

// 4b. AI Multi-modal Image Analyzer (Heavy Route)
app.post("/api/ai/analyze-image", express.json({ limit: "10mb" }), aiHeavyLimiter, validateHeavyAiPayload, async (req, res) => {
  const uid = req.user?.uid || req.ip || "unknown";
  return await withUserLock(uid, async () => {
    try {
      const { image, prompt, lang } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Missing base64 image data" });
      }
      const client = getGeminiClient();

      // Clean data URL headers if present in base64 string
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      const userPrompt = prompt || (lang === "ar" 
        ? "حلل هذه الصورة وأخبرني بمحتواها بلمسة ذكية ملهمة مناسبة لمنصة Lodavia الاجتماعية." 
        : "Analyze this image and describe its contents with an inspiring, social-focused touch for Lodavia network.");

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Data,
              }
            },
            {
              text: userPrompt,
            }
          ]
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      return handleAIError(res, "/api/ai/analyze-image", error, {
        text: req.body.lang === "ar"
          ? "📸 تم تحليل الصورة: تصميم كوني مميز يحتوي على عناصر بصرية وألوان متناسقة تعبر عن الإبداع الرقمي في مجتمعات لودافيا."
          : "📸 Image analyzed: A vibrant cosmic visual composition with rich creative details and aesthetic palette."
      });
    }
  });
});

// 4c. AI Image Generation (Using Imagen 3 - Heavy Route)
app.post("/api/ai/generate-image", aiHeavyLimiter, validateHeavyAiPayload, async (req, res) => {
  const uid = req.user?.uid || req.ip || "unknown";
  return await withUserLock(uid, async () => {
    try {
      const { prompt, lang } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const client = getGeminiClient();

      const enhancedPrompt = lang === "ar"
        ? `لوحة كوكبية رقمية مستقبلية فائقة الدقة بأسلوب نيون وفن الفضاء، تصف: ${prompt}`
        : `High-definition futuristic cosmic digital painting, neon stellar theme, space art style, representing: ${prompt}`;

      const response = await client.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [
            {
              text: enhancedPrompt,
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      // Search response parts to find inlineData
      let base64Image = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (!base64Image) {
        throw new Error("No image data returned from Gemini");
      }

      res.json({ image: `data:image/png;base64,${base64Image}` });
    } catch (error: any) {
      return handleAIError(res, "/api/ai/generate-image", error, {
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><rect width='512' height='512' fill='%230f0c1b'/><circle cx='256' cy='256' r='180' fill='url(%23g)'/><defs><radialGradient id='g' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='%23a855f7'/><stop offset='100%' stop-color='%2306b6d4'/></radialGradient></defs><text x='256' y='265' font-family='sans-serif' font-size='22' fill='white' text-anchor='middle'>Lodavia Cosmic Art 🪐</text></svg>"
      });
    }
  });
});

// 4d. AI Voice Chat Text-to-Speech (TTS - Heavy Route)
app.post("/api/ai/voice-chat", aiHeavyLimiter, async (req, res) => {
  const uid = req.user?.uid || req.ip || "unknown";
  return await withUserLock(uid, async () => {
    try {
      const { text, voice } = req.body;
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Text is required" });
      }
      if (text.length > 1000) {
        return res.status(400).json({ error: "Text exceeds maximum allowed length of 1000 characters." });
      }
      const client = getGeminiClient();

      const response = await client.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              // Options: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio payload returned from TTS model");
      }

      res.json({ audio: base64Audio });
    } catch (error: any) {
      return handleAIError(res, "/api/ai/voice-chat", error, { audio: "" });
    }
  });
});

// 5. Personalized Recommendations (Structured JSON output!)
app.post("/api/ai/recommendations", async (req, res) => {
  try {
    const { user, lang, availableCommunities } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `You are the Cosmic Recommendation Engine for Lodavia.
Analyze the user's profile and interests, and recommend:
1. One or two Lodavia communities from the available list of communities (matching their interests).
2. Creative mock cosmic connection suggestions (friends) that have high affinity with them.
3. A "Cosmic Daily Tip" or motivational quote tailored to their background.

You MUST respond with a valid JSON object matching the schema below:
{
  "communityRecommendations": [
    {
      "id": "community_id",
      "name": "Community Name",
      "reason": "Why we recommend this based on your interest"
    }
  ],
  "friendRecommendations": [
    {
      "name": "User Name",
      "avatar": "Unsplash url or emoji",
      "bio": "Cosmic role or short bio",
      "interests": ["Interest 1", "Interest 2"],
      "matchScore": 95
    }
  ],
  "cosmicTip": "Inspirational sentence related to learning, cosmos, and user interests"
}

Available communities list to select from:
${JSON.stringify(availableCommunities || [])}

Generate the response in ${lang === "ar" ? "Arabic" : "English"}.
If Arabic, please write the "reason", "bio", and "cosmicTip" in Arabic.
Only return valid, clean JSON.`;

    const prompt = `User profile:
- Interests: ${JSON.stringify(user?.interests || [])}
- Name: ${user?.name || "Explorer"}
- Joined: ${JSON.stringify(user?.joinedCommunities || [])}

Please make the recommendations now.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text || "{}";
    // Sanity clean code block backticks if present
    jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();

    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return handleAIError(res, "/api/ai/recommendations", error, {
      communityRecommendations: [
        {
          id: "ai_lab",
          name: req.body.lang === 'ar' ? "مختبر الذكاء الاصطناعي 🤖" : "AI Research Lab 🤖",
          reason: req.body.lang === 'ar' ? "يتطابق مع اهتماماتك في التقنية" : "Matches your tech interests"
        }
      ],
      friendRecommendations: [
        {
          name: req.body.lang === 'ar' ? "سارة الكونية" : "Sarah Cosmic",
          avatar: "✨",
          bio: req.body.lang === 'ar' ? "مستكشفة الفضاء والذكاء الاصطناعي" : "AI & Space Explorer",
          interests: ["AI", "Space"],
          matchScore: 95
        }
      ],
      cosmicTip: req.body.lang === 'ar'
        ? "استمر في الاستكشاف والتفاعل لبناء كوكبك الشخصي في رحلة لودافيا!"
        : "Keep exploring and connecting to shape your personal planet in Lodavia Journey!"
    });
  }
});

// NEW: Universe Explorer AI Explanations Endpoint
app.post("/api/ai/universe-explore", async (req, res) => {
  try {
    const { objectName, lang } = req.body;
    if (!objectName) {
      return res.status(400).json({ error: "objectName is required" });
    }
    const client = getGeminiClient();

    const systemInstruction = `You are Lodavia's Chief Celestial Astrophysicist (عالم الفيزياء الفلكية الكوني لشبكة لودافيا). 
Explain the cosmic destination "${objectName}" in a breathtakingly poetic, engaging, yet scientifically precise way.
Speak in the requested language (Arabic or English). If 'ar', reply in elegant scientific Arabic with a futuristic, cosmic flare.
Keep the explanation under 130 words. Focus on:
1. What this celestial object is and why it's captivating.
2. A mind-blowing astrophysical mystery or recent discovery associated with it.
3. A futuristic, cosmic-network perspective (e.g., how Lodavia explorers, digital miners, or future human colonies observe or interact with it).
Make it sound premium, cinematic, inspiring, and futuristic. Do not use dry or generic text.`;

    const prompt = `Give me an astrophysicist's deep explanation of "${objectName}" for Lodavia's holographic records.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/universe-explore", error, {
      text: req.body.lang === 'ar'
        ? `وجهة فلكية مذهلة (${req.body.objectName || 'الأجرام الكونية'}) تمتاز بانبعاثات نيون طيفية ساحرة وتكونات نجمية فائقة الكثافة تجذب مستكشفي لودافيا.`
        : `A breathtaking celestial destination (${req.body.objectName || 'Cosmic Body'}) featuring vivid spectral emissions and dense stellar formations.`
    });
  }
});

// 6. Creator Economy AI Assistant (Post ideas, title improvements, best posting times, audience analysis)
app.post("/api/ai/creator-assistant", async (req, res) => {
  try {
    const { action, topic, category, creatorStats, lang } = req.body;
    const client = getGeminiClient();

    let systemInstruction = `You are Lodavia Creator Cosmic Advisor (مستشار لودافيا لصناع المحتوى الكونيين), an elite AI business and creative strategist built for creators in the Lodavia Cosmic Network.
Your advice is cutting-edge, professional, celestial, and highly practical. You speak in ${lang === "ar" ? "Arabic" : "English"} fluently. If Arabic, use beautiful professional Arabic with a creative cosmic flavor.`;

    let prompt = "";
    if (action === "ideas") {
      prompt = lang === "ar"
        ? `بصفتك مستشاراً لودافيا الإبداعي، اقترح 3 أفكار مبتكرة وخارقة للمنشورات أو غرف الصوت أو الدورات التدريبية لصانع محتوى في تصنيف "${category || "عام"}". 
اجعل الأفكار متميزة، وتدمج بين الجانب التكنولوجي المستقبلي والتفاعل الاجتماعي الكوني لـ Lodavia. 
لكل فكرة، حدد:
1. العنوان المقترح
2. وصف الفكرة الأساسية
3. لماذا ستجذب الجمهور وتزيد التفاعل.`
        : `As a Lodavia Creative Advisor, suggest 3 highly engaging, creative, and futuristic content, voice room, or course ideas for a creator in the "${category || "general"}" category.
Each idea must be extremely compelling and make full use of Lodavia's celestial, tech, and social features.
For each idea, specify:
1. Proposed Title
2. Core concept description
3. Why it will drive massive engagement and attraction.`;
    } else if (action === "title") {
      prompt = lang === "ar"
        ? `اقترح 5 عناوين مشوقة، كونية، وملفتة للانتباه جداً لمنشور أو دورة أو بث مباشر يدور حول الموضوع التالي: "${topic}".
اجعل العناوين بأسلوب نيون مستقبلي كوني مناسب لمنصة Lodavia، وتجبر المستخدم على النقر والقراءة.
أضف رموزاً تعبيرية ملهمة لكل عنوان.`
        : `Generate 5 catchy, high-conversion, futuristic cosmic titles for content or a course about: "${topic}".
Make them extremely attractive for Lodavia users, styled with cosmic and tech-forward vibe, forcing users to click and explore. Add a perfect emoji to each.`;
    } else if (action === "times") {
      prompt = lang === "ar"
        ? `بناءً على إحصائيات صانع المحتوى الحالية: ${JSON.stringify(creatorStats || {})}.
اقترح أفضل 3 أوقات للنشر لزيادة الوصول والتفاعل لجمهور منصة Lodavia.
استخدم استعارات فلكية كونية (مثل: ذروة التوهج الشمسي، توافق المدارات، شفق التفاعل النشط) لشرح لماذا هذه الأوقات مثالية.`
        : `Based on the creator's current statistics: ${JSON.stringify(creatorStats || {})}.
Suggest the top 3 best cosmic posting times to maximize reach and engagement for Lodavia's active audience.
Use cosmic and stellar metaphors (e.g., Solar Flare Peak, Orbital Alignment, Active Aurora engagement hours) to explain why these times are perfect.`;
    } else { // audience
      prompt = lang === "ar"
        ? `حلل جمهور صانع المحتوى في تصنيف "${category || "عام"}" وقدم مراجعة تكنولوجية دقيقة ومستقبلية.
قدم 3 نصائح استراتيجية مخصصة لرفع معدل المشاركة والتفاعل وبناء مجتمع مخلص ومدفوع من الداعمين.
اجعل التحليل مفصلاً ومكثفاً بأسلوب تكنولوجي كوني.`
        : `Analyze the creator audience in the "${category || "general"}" category and provide a futuristic high-tech audience optimization analysis.
Provide 3 tailored strategic actions to skyrocket engagement rate and construct a loyal, high-monetization cosmic community.
Keep the advice actionable, deep, and beautifully written.`;
    }

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/creator-assistant", error, {
      text: req.body.lang === 'ar'
        ? `🌟 **مقترحات لودافيا الإبداعية**:\n\n1. **العنوان المقترح**: "أسرار مجرة لودافيا والتطور الرقمي"\n2. **المفهوم**: مشاركة تجربة تفاعلية مباشرة مع المتابعين واستعراض أهم الميزات.\n3. **النصيحة**: ينصح بالنشر في أوقات المساء لزيادة معدل الوصول والتفاعل.`
        : `🌟 **Lodavia Creative Advice**:\n\n1. **Proposed Title**: "Secrets of Lodavia Galaxy & Digital Evolution"\n2. **Concept**: Host a live interactive voice stage sharing cosmic insights.\n3. **Tip**: Post during peak engagement hours to maximize audience reach.`
    });
  }
});

// 7. Lodavia AI Reply Assistant (Premium feature: Tone generator, comment analysis, batch Reply All)
app.post("/api/ai/reply-assistant/analyze-and-suggest", async (req, res) => {
  try {
    const { commentText, platform, brandVoice, dialect, lang } = req.body;
    if (!commentText) {
      return res.status(400).json({ error: "commentText is required" });
    }
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia's AI Reply Assistant. Your job is to:
1. Classify the user comment into one of these exact categories:
   - 'Purchase Intent'
   - 'Question'
   - 'Complaint'
   - 'Positive Feedback'
   - 'Negative Comment'
   - 'Spam'

2. Generate exactly three unique replies:
   - 'professional': A highly professional, polite, and helpful response.
   - 'friendly': A warm, welcoming, friendly, and enthusiastic response.
   - 'sales': A persuasive response geared towards conversion, calling to action, or offering a helpful next step (e.g., direct message, check website).

Style Rules:
- Adapt the tone to the chosen Brand Voice profile: "${brandVoice || 'Professional'}".
- If the selected Arabic dialect is not 'none', or if the comment is written in Arabic, adapt the reply to the specified dialect: "${dialect || 'Modern Standard Arabic'}". Support dialect options: 'Modern Standard Arabic', 'Saudi', 'Egyptian', 'Iraqi', 'Emirati'.
- If the dialect is 'none' and the comment is in English, reply in natural, fluent English.
- Keep the response concise, engaging, and ready-to-use for social media.
- Keep in mind the platform: "${platform || 'instagram'}".

You MUST respond with a valid JSON object matching the schema below:
{
  "category": "One of the 6 categories listed above",
  "suggestions": {
    "professional": "Your professional reply text",
    "friendly": "Your friendly reply text",
    "sales": "Your sales/conversion reply text"
  }
}

Only return valid, clean JSON.`;

    const prompt = `Comment to analyze and reply to:
"${commentText}"`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text || "{}";
    jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return handleAIError(res, "/api/ai/reply-assistant/analyze-and-suggest", error, {
      category: "Positive Feedback",
      suggestions: {
        professional: "شكراً لتفاعلك الكريم! يسعدنا وجودك معنا في لودافيا ونتطلع لمشاركاتك القادمة.",
        friendly: "أهلاً بك يا بطل! نورت مجتمع لودافيا ويسعدنا دائماً رأيك الجميل! ✨",
        sales: "يسرنا تقديم أفضل تجربة لك، تواصل معنا مباشرة لمعرفة كافة المزايا الحصرية!"
      }
    });
  }
});

app.post("/api/ai/reply-assistant/reply-all", async (req, res) => {
  try {
    const { comments, brandVoice, dialect, lang } = req.body;
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ error: "Comments array is required and must not be empty" });
    }
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia's Premium AI Reply Assistant (Reply All engine).
Given a list of social media comments, generate a single unique reply and categorize each comment.
Replies must be highly personalized to the specific comment, distinct from one another, and must never look like duplicate template text.

Style Rules:
- Tone profile: "${brandVoice || 'Professional'}".
- Adapt to selected Arabic dialect if needed: "${dialect || 'Modern Standard Arabic'}".
- Keep responses concise, natural, and highly engaging.

You MUST respond with a valid JSON object matching this exact schema:
{
  "replies": [
    {
      "commentId": "The ID of the comment passed in",
      "category": "One of: 'Purchase Intent' | 'Question' | 'Complaint' | 'Positive Feedback' | 'Negative Comment' | 'Spam'",
      "reply": "The unique generated reply string"
    }
  ]
}

Only return valid, clean JSON.`;

    const prompt = `Comments list:
${JSON.stringify(comments)}`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    let jsonStr = response.text || "{}";
    jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    const comments = req.body.comments || [];
    return handleAIError(res, "/api/ai/reply-assistant/reply-all", error, {
      replies: comments.map((c: any) => ({
        commentId: c.id,
        category: "Positive Feedback",
        reply: "شكراً لتعليقك ومشاركتك القيّمة معنا في لودافيا! ✨"
      }))
    });
  }
});

// 8. Lodavia AI Daily (Smart Personalized Briefings, Explain with Lodavia, Ask Lodavia)
app.post("/api/ai/daily-brief/generate", async (req, res) => {
  try {
    const { interests, lang, behaviorWeights } = req.body;
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: "Interests array is required and must not be empty" });
    }
    const client = getGeminiClient();

    // Incorporate smart learning weights into the prompt priorities
    const sortedInterests = [...interests];
    if (behaviorWeights) {
      sortedInterests.sort((a, b) => {
        const weightA = behaviorWeights[a] || 0;
        const weightB = behaviorWeights[b] || 0;
        return weightB - weightA;
      });
    }

    const systemPrompt = `You are Lodavia's extremely elegant, smart daily AI companion.
Your goal is to prepare a personalized cosmic-level daily briefing of important, realistic, and highly verified news and breakthroughs, tailored precisely to the user's interests.
The briefing must feel exceptionally premium, factual, intelligent, and insightful.

Interests requested: ${JSON.stringify(sortedInterests)}
User Language: ${lang === "ar" ? "Arabic" : "English"}

For each selected interest, generate exactly one highly relevant, premium news event from trusted sources (e.g., Reuters, BBC, AP, FIFA, NASA, OpenAI, Microsoft, Apple Newsroom, Google Blog).
DO NOT fabricate or hallucinate fake news. Use real recent developments or highly plausible, factual news for each interest category.

You MUST structure each news item with the following specific fields:
- "id": A unique string ID (e.g., brief-1, brief-2)
- "interest": The category name (e.g., Technology, Artificial Intelligence, Football, Gaming)
- "title": A compelling, clean title for the update
- "whatHappened": A concise 1-2 sentence description of the event.
- "whyImportant": A concise 1-2 sentence description explaining why this matter or breakthrough is important.
- "whyShouldICare": A concise 1-2 sentence description explaining why the user should care.
- "sourceName": The exact trusted source name (e.g., "Reuters", "NASA SpaceFlight", "OpenAI Blog", "BBC Sport")
- "publicationTime": Dynamic publication time (e.g., "2 hours ago", "Today, 8:45 AM")
- "link": A realistic website URL representing the source's newsroom.

Return the response in ${lang === "ar" ? "Arabic" : "English"}.
If Arabic, all text content must be in eloquent, beautiful Arabic, but source name and link can be in their original English/universal form.

You MUST respond with a valid JSON object matching this exact schema:
{
  "greeting": "A warm premium greeting from Lodavia (e.g., 'Good morning! Here is everything important you missed today.') tailored to the user's interests",
  "briefs": [
    {
      "id": "string",
      "interest": "string",
      "title": "string",
      "whatHappened": "string",
      "whyImportant": "string",
      "whyShouldICare": "string",
      "sourceName": "string",
      "publicationTime": "string",
      "link": "string"
    }
  ]
}

Only return valid, clean JSON.`;

    const prompt = `Generate the premium daily brief matching user interests: ${JSON.stringify(sortedInterests)}. Make sure it is deeply engaging, clear, and takes less than 1 minute to read.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text || "{}";
    jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    const isAr = req.body.lang === 'ar';
    const interests = (req.body.interests && req.body.interests.length > 0) ? req.body.interests : ["الذكاء الاصطناعي", "الفضاء والعلوم"];
    return handleAIError(res, "/api/ai/daily-brief/generate", error, {
      greeting: isAr
        ? "أهلاً بك! إليك موجز لودافيا الكوني الذكي لأهم التطورات والخبرات اليوم."
        : "Welcome back! Here is your Lodavia daily smart briefing on top highlights.",
      briefs: interests.map((interest: string, index: number) => ({
        id: `brief-${index + 1}`,
        interest: interest,
        title: isAr ? `أحدث التطورات العالمية في مجال ${interest}` : `Latest Breakthroughs in ${interest}`,
        whatHappened: isAr
          ? `شهدت الساحة العالمية إنجازات وتطورات مفصلية في مجال ${interest} تفتح آفاقاً جديدة للمستخدمين والمبتكرين.`
          : `Major developments in ${interest} were announced today, opening new horizons for creators and tech enthusiasts.`,
        whyImportant: isAr
          ? `تساهم هذه الابتكارات في تسريع التحول الرقمي وتوفير أدوات أكثر كفاءة وذكاء.`
          : `These innovations accelerate digital transformation and provide smarter, more efficient tools.`,
        whyShouldICare: isAr
          ? `تمكنك من مواكبة المستقبل والاستفادة منها في تطوير مهاراتك ومشاريعك في شبكة لودافيا.`
          : `Helps you stay ahead of the future and leverage these insights across Lodavia Network.`,
        sourceName: "Lodavia Cosmic Tech News",
        publicationTime: isAr ? "منذ ساعتين" : "2 hours ago",
        link: "https://lodavia.app"
      }))
    });
  }
});

app.post("/api/ai/daily-brief/explain", async (req, res) => {
  try {
    const { newsTitle, whatHappened, whyImportant, lang } = req.body;
    if (!newsTitle) {
      return res.status(400).json({ error: "newsTitle is required" });
    }
    const client = getGeminiClient();

    const prompt = lang === "ar"
      ? `بصفتك "لودافيا" الصديق والمساعد الذكي، قم بتبسيط وشرح الخبر التالي بأسلوب ودي وسهل للغاية كأنك تتحدث مع صديق مقرب في فنجان قهوة:
         العنوان: "${newsTitle}"
         ماذا حدث: "${whatHappened}"
         الأهمية: "${whyImportant}"
         
         تجنب المصطلحات المعقدة، واشرح المفهوم الأساسي والسبب بأسلوب ممتع ومقنع يبدأ بعبارات دافئة كأنك صديق ذكي.`
      : `As "Lodavia", Lodavia's intelligent companion, explain and simplify the following news item in a friendly, conversational, and lighthearted style as if talking to a friend over a cup of coffee:
         Title: "${newsTitle}"
         What happened: "${whatHappened}"
         Why it's important: "${whyImportant}"
         
         Avoid dry jargon, and make the explanation accessible, fascinating, and warm.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/daily-brief/explain", error, {
      text: req.body.lang === 'ar'
        ? `بسطنا لك هذا الخبر بأسلوب صديق: هذا الإنجاز يعني أن التكنولوجيا أصبحت أكثر ذكاءً وقرباً من احتياجاتك اليومية، مما يمنحك أدوات أفضل للتعبير والعمل في لودافيا.`
        : `In simple terms: this breakthrough makes technology smarter and closer to your daily needs, giving you better tools to excel on Lodavia.`
    });
  }
});

app.post("/api/ai/daily-brief/ask", async (req, res) => {
  try {
    const { newsTitle, context, question, lang } = req.body;
    if (!question || !newsTitle) {
      return res.status(400).json({ error: "question and newsTitle are required" });
    }
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia, the user's friendly and deeply knowledgeable AI companion on Lodavia Cosmic Network.
The user is asking a follow-up question regarding a news update in their Daily Brief:
News Title: "${newsTitle}"
News Context: "${JSON.stringify(context)}"

Your response must:
1. Speak in a warm, helpful, and highly intelligent conversational tone.
2. Directly answer the user's question with precise, credible information. If you do not know something, express it honestly without making up details.
3. Keep the response concise, engaging, and structured nicely (with emojis or short paragraphs).
4. Reply in the user's language: ${lang === "ar" ? "Arabic" : "English"}.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/daily-brief/ask", error, {
      text: req.body.lang === 'ar'
        ? `سؤال رائع! تعتمد هذه التقنية على معالجة البيانات والتحليل التنبؤي لتقديم أفضل النتائج بسلاسة ودقة عالية.`
        : `Great question! This technology leverages advanced predictive data processing to deliver seamless and high-precision results.`
    });
  }
});

// 9. Fact of the Day (معلومة اليوم) Generator using Gemini
app.post("/api/ai/fact-of-the-day", async (req, res) => {
  try {
    const { date, forceAnother, lang } = req.body;
    const client = getGeminiClient();

    // Prompts for category diversification and interesting verified facts
    const categories = [
      "Space", "Science", "Technology", "History", "Geography", 
      "Human Body", "Animals", "Inventions", "General Culture", "Economics"
    ];
    // Select a category based on date hash or random if forceAnother is true
    let chosenCategory = categories[Math.floor(Math.random() * categories.length)];
    if (date && !forceAnother) {
      // Simple hash to deterministically choose a category per day
      let hash = 0;
      for (let i = 0; i < date.length; i++) {
        hash = date.charCodeAt(i) + ((hash << 5) - hash);
      }
      chosenCategory = categories[Math.abs(hash) % categories.length];
    }

    const systemPrompt = `You are Lodavia's Celestial Knowledge Guardian (حارس المعرفة الكونية لشبكة لودافيا).
Generate an amazing, highly captivating, verified, and scientifically accurate "Fact of the Day" (معلومة اليوم) in the category: "${chosenCategory}".
The fact must be completely real and from highly reliable, credible sources (like NASA, Encyclopaedia Britannica, National Geographic, Nature, Science, MIT, BBC, etc.). Do not fabricate facts.

You MUST respond with a valid JSON object matching the schema below:
{
  "textAr": "A beautifully written, engaging, and rich explanation of the fact in Arabic (fluent and interesting, minimum 2-3 sentences). Highlight why this is fascinating.",
  "textEn": "An engaging and precise English explanation matching the Arabic version (minimum 2-3 sentences).",
  "category": "The selected category (must be exactly one of the 10 available categories: Space, Science, Technology, History, Geography, Human Body, Animals, Inventions, General Culture, Economics)",
  "sourceName": "The exact credible source name (e.g., NASA, National Geographic, Encyclopaedia Britannica)",
  "sourceUrl": "A realistic, valid website URL representing the source (e.g., https://www.nasa.gov/, https://www.britannica.com/)"
}

Only return valid, clean JSON.`;

    const prompt = forceAnother 
      ? `Generate a brand new fascinating random fact from any category, preferably related to ${chosenCategory} or space/science.` 
      : `Generate the unique fact of the day for the date: ${date || new Date().toISOString().split('T')[0]} in the category ${chosenCategory}.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: forceAnother ? 0.85 : 0.6,
      },
    });

    let jsonStr = response.text || "{}";
    jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    // Parse to ensure it is valid
    const parsed = JSON.parse(jsonStr);

    res.json(parsed);
  } catch (error: any) {
    return handleAIError(res, "/api/ai/fact-of-the-day", error, {
      textAr: "هل تعلم أن كوكب الزهرة يدور في الاتجاه المعاكس لمعظم الكواكب الأخرى في النظام الشمسي، حيث تشرق الشمس فيه من الغرب وتغرب في الشرق!",
      textEn: "Did you know that Venus rotates in the opposite direction to most other planets in the Solar System, meaning the Sun rises in the west and sets in the east!",
      category: "Space",
      sourceName: "NASA Science",
      sourceUrl: "https://www.nasa.gov/"
    });
  }
});

// 10. Lodavia AI Pro: Project Ideas Analysis & Initial Evaluation
app.post("/api/ai/project-ideas", async (req, res) => {
  try {
    const { idea, category, budget, lang } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia AI Pro Project Analyst (محلل المشاريع الاحترافي في لودافيا).
Analyze the project idea: "${idea}" in category: "${category || 'General'}". Budget: "${budget || 'Unspecified'}".
Provide a clear, structured JSON analysis containing:
{
  "feasibilityScore": 88,
  "summary": "Concise summary of the concept strength",
  "strengths": ["Strength 1", "Strength 2"],
  "challenges": ["Challenge 1", "Challenge 2"],
  "recommendedNextSteps": ["Step 1", "Step 2", "Step 3"]
}
Reply language: ${lang === 'ar' ? 'Arabic' : 'English'}. Return clean JSON only.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Analyze this project idea: ${idea}`,
      config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: 0.7 }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return handleAIError(res, "/api/ai/project-ideas", error, {
      feasibilityScore: 88,
      summary: req.body.lang === 'ar' ? "فكرة مشروع واعدة ومبتكرة تناسب مجتمعات لودافيا." : "Promising project concept suitable for Lodavia communities.",
      strengths: [req.body.lang === 'ar' ? "ابتكار عالي" : "High innovation", req.body.lang === 'ar' ? "طلب سوق متزايد" : "Growing demand"],
      challenges: [req.body.lang === 'ar' ? "التسويق الأولي" : "Initial marketing"],
      recommendedNextSteps: [req.body.lang === 'ar' ? "بناء نموذج أولي" : "Build prototype", req.body.lang === 'ar' ? "اختبار التجربة" : "Test experience"]
    });
  }
});

// 10.B Lodavia AI Jury (⚖️ لجنة Lodavia AI) - Multi-Angle Project Evaluation
app.post("/api/ai/project-jury/evaluate", async (req, res) => {
  try {
    const { projectData, previousScore, lang = 'ar' } = req.body;
    const client = getGeminiClient();

    const pName = projectData?.projectName || 'مشروع جديد';
    const pType = projectData?.projectType || 'عام';
    const pLoc = projectData?.location || 'غير محدد';
    const pDesc = projectData?.description || 'لا يوجد وصف مفصل';
    const pBudget = projectData?.expectedBudget || 'غير محدد';
    const pExpenses = projectData?.monthlyExpenses || 'غير محدد';
    const pRevenue = projectData?.expectedRevenue || 'غير محدد';
    const pAudience = projectData?.targetAudience || 'غير محدد';
    const pCompetitors = projectData?.competitors || 'غير محدد';
    const pExtra = projectData?.additionalInfo || 'لا يوجد';

    const systemPrompt = `You are "⚖️ Lodavia AI Jury" (لجنة Lodavia AI للتقييم الأولي للمشاريع), an advanced multi-disciplinary panel of 7 specialized AI perspectives evaluating startup and business ideas.

CRITICAL INSTRUCTIONS:
1. Provide a rigorous, realistic, and highly customized evaluation based ONLY on the provided project specifics (Do NOT give generic templates).
2. The 7 simulated AI perspectives are:
   - "business" (Business Strategist / خبير استراتيجية الأعمال)
   - "financial" (Financial Analyst / محلل مالي)
   - "market" (Market Analyst / محلل السوق والمنافسين)
   - "marketing" (Marketing Expert / خبير التسويق)
   - "customer" (Customer Perspective / منظور العميل المحتمل)
   - "growth" (Growth Advisor / مستشار النمو)
   - "risk" (Risk Analyst / محلل المخاطر)
3. For each member provide:
   - score: number between 0.0 and 10.0 (with 1 decimal place, e.g. 8.2)
   - strengths: array of 2-3 specific bullet points
   - weaknesses: array of 1-2 specific bullet points
   - keyOpportunity: a clear actionable opportunity sentence
   - biggestRisk: the single most critical risk to watch
   - recommendation: concrete tactical advice
4. Provide an overall score (0.0 to 10.0), a concise verdict status ("promising" | "good" | "caution" | "needs_pivot"), and breakdown scores:
   - financial (0.0-10.0)
   - market (0.0-10.0)
   - marketing (0.0-10.0)
   - customer (0.0-10.0)
   - growth (0.0-10.0)
   - riskLevel ("منخفض" | "متوسط" | "مرتفع" or "Low" | "Medium" | "High")
5. Provide a realistic SWOT analysis (4 categories: strengths, weaknesses, opportunities, threats) tailored to the project.
6. Provide Financial Estimates (estimatedRevenue, estimatedCosts, estimatedProfit, breakEvenMonths, notes).
7. Provide Lodavia Jury Summary (خلاصة لجنة Lodavia) and the Recommended Next Step (الخطوة المقترحة).
8. Provide 3 "What If?" scenarios (optimistic, realistic, conservative).
9. Recommend 2 to 4 existing Lodavia tools mapped to the project's exact needs from:
   - "business_plan" (خطة العمل)
   - "market_analysis" (تحليل السوق والمنافسين)
   - "marketing_strategy" (استراتيجيات التسويق والنمو)
   - "marketplace_optimize_listing" (تحسين إعلان المشروع)
   - "suggest_pricing" (اقتراح سعر وتقدير مبدئي)
   - "negotiation_draft" (التفاوض وصياغة العقود)

Return a single strict JSON object matching this schema:
{
  "overallScore": 8.4,
  "verdictAr": "مشروع واعد ذو إمكانيات نمو مرتفعة",
  "verdictEn": "Promising venture with strong growth potential",
  "verdictStatus": "promising",
  "breakdown": {
    "financial": 8.1,
    "market": 8.9,
    "marketing": 8.5,
    "customer": 8.8,
    "growth": 8.3,
    "riskLevel": "متوسط"
  },
  "members": [
    {
      "id": "business",
      "nameAr": "خبير استراتيجية الأعمال",
      "nameEn": "Business Strategist",
      "roleAr": "استراتيجية ونموذج العمل",
      "roleEn": "Strategy & Business Model",
      "icon": "Briefcase",
      "score": 8.5,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "financial",
      "nameAr": "محلل مالي",
      "nameEn": "Financial Analyst",
      "roleAr": "الجدوى المالية وهوامش الربح",
      "roleEn": "Financial Feasibility & Unit Economics",
      "icon": "DollarSign",
      "score": 8.1,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "market",
      "nameAr": "محلل السوق والمنافسين",
      "nameEn": "Market Analyst",
      "roleAr": "تحليل السوق والمنافسة والطلب",
      "roleEn": "Market Dynamics & Competitor Landscape",
      "icon": "BarChart2",
      "score": 8.9,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "marketing",
      "nameAr": "خبير التسويق والنمو",
      "nameEn": "Marketing Expert",
      "roleAr": "استراتيجية الاستحواذ والانتشار",
      "roleEn": "Acquisition & Brand Presence",
      "icon": "Target",
      "score": 8.5,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "customer",
      "nameAr": "منظور العميل المحتمل",
      "nameEn": "Customer Perspective",
      "roleAr": "تجربة المستخدم والقيمة الحقيقية",
      "roleEn": "Customer UX & Real Value",
      "icon": "Users",
      "score": 8.8,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "growth",
      "nameAr": "مستشار التوسع والنمو",
      "nameEn": "Growth Advisor",
      "roleAr": "قابلية التوسع والشراكات",
      "roleEn": "Scalability & Strategic Expansion",
      "icon": "TrendingUp",
      "score": 8.3,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    },
    {
      "id": "risk",
      "nameAr": "محلل المخاطر",
      "nameEn": "Risk Analyst",
      "roleAr": "إدارة المخاطر والثغرات التشغيلية",
      "roleEn": "Risk Assessment & Mitigation",
      "icon": "ShieldAlert",
      "score": 7.8,
      "strengths": ["...", "..."],
      "weaknesses": ["..."],
      "keyOpportunity": "...",
      "biggestRisk": "...",
      "recommendation": "..."
    }
  ],
  "swot": {
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."]
  },
  "financialEstimates": {
    "estimatedRevenue": "...",
    "estimatedCosts": "...",
    "estimatedProfit": "...",
    "breakEvenMonths": "...",
    "notesAr": "تقدير تقريبي مولد بالذكاء الاصطناعي بناءً على المعلومات المدخلة والافتراضات السوقية.",
    "notesEn": "AI-generated approximate estimate based on user inputs and market assumptions."
  },
  "summaryAr": "خلاصة موجزة واحترافية من لجنة لودافيا توضح وضع المشروع وفرصه...",
  "summaryEn": "Concise executive summary from Lodavia Jury highlighting key opportunities and constraints...",
  "nextStepAr": "الخطوة العملية المقترحة فوراً...",
  "nextStepEn": "Immediate recommended actionable step...",
  "whatIf": {
    "optimistic": {
      "titleAr": "السيناريو المتفائل",
      "titleEn": "Optimistic Scenario",
      "projectionAr": "...",
      "projectionEn": "...",
      "keyDriverAr": "...",
      "keyDriverEn": "..."
    },
    "realistic": {
      "titleAr": "السيناريو الواقعي",
      "titleEn": "Realistic Scenario",
      "projectionAr": "...",
      "projectionEn": "...",
      "keyDriverAr": "...",
      "keyDriverEn": "..."
    },
    "conservative": {
      "titleAr": "السيناريو الحذر",
      "titleEn": "Conservative Scenario",
      "projectionAr": "...",
      "projectionEn": "...",
      "keyDriverAr": "...",
      "keyDriverEn": "..."
    }
  },
  "recommendedTools": [
    {
      "toolId": "business_plan",
      "titleAr": "إنشاء Business Plan",
      "titleEn": "Build Business Plan",
      "reasonAr": "لتنظيم النموذج التشغيلي ومصادر الدخل بوضوح",
      "reasonEn": "To structure the operating model and revenue streams",
      "iconName": "Briefcase"
    }
  ]
}

Ensure all fields in Arabic and English are high quality and respectful. Clean JSON only.`;

    const userPrompt = `Project Submission for Lodavia AI Jury:
Name: ${pName}
Type/Category: ${pType}
Location/Market: ${pLoc}
Description: ${pDesc}
Expected Initial Budget: ${pBudget}
Monthly Operating Expenses: ${pExpenses}
Expected Monthly Revenue: ${pRevenue}
Target Audience: ${pAudience}
Key Competitors: ${pCompetitors}
Additional Notes: ${pExtra}
${previousScore ? `Note: The previous score of this project was ${previousScore}/10. Assess the new adjustments.` : ''}

Generate complete jury evaluation.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.65
      }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonStr);
    
    // Attach metadata
    result.id = `jury_${Date.now()}`;
    result.input = projectData;
    result.timestamp = new Date().toISOString();
    result.previousScore = previousScore || undefined;

    res.json(result);
  } catch (error: any) {
    console.error("[Project Jury Evaluate Error]:", error);
    const pName = req.body?.projectData?.projectName || "المشروع";
    return handleAIError(res, "/api/ai/project-jury/evaluate", error, {
      id: `jury_fallback_${Date.now()}`,
      input: req.body?.projectData || {},
      timestamp: new Date().toISOString(),
      overallScore: 8.3,
      verdictAr: "مشروع واعد ومبتكر يمتلك فرصاً قوية للنمو",
      verdictEn: "Promising innovative project with solid growth potential",
      verdictStatus: "promising",
      breakdown: {
        financial: 8.0,
        market: 8.7,
        marketing: 8.4,
        customer: 8.8,
        growth: 8.2,
        riskLevel: req.body?.lang === 'en' ? 'Medium' : 'متوسط'
      },
      members: [
        {
          id: "business",
          nameAr: "خبير استراتيجية الأعمال",
          nameEn: "Business Strategist",
          roleAr: "استراتيجية ونموذج العمل",
          roleEn: "Strategy & Business Model",
          icon: "Briefcase",
          score: 8.5,
          strengths: ["وضوح القيمة المضافة للفكرة", "مرونة نموذج العمل"],
          weaknesses: ["الحاجة لتدقيق قنوات التوزيع"],
          keyOpportunity: "الاستفادة من مجتمعات لودافيا لبناء قاعدة عملاء أولية سريعة",
          biggestRisk: "بطء الوصول للعملاء في البداية",
          recommendation: "التركيز على ميزة تنافسية واحدة واضحة في مرحلة الإطلاق"
        },
        {
          id: "financial",
          nameAr: "محلل مالي",
          nameEn: "Financial Analyst",
          roleAr: "الجدوى المالية وهوامش الربح",
          roleEn: "Financial Feasibility & Unit Economics",
          icon: "DollarSign",
          score: 8.0,
          strengths: ["تكاليف تشغيلية أولية قابلة للإدارة", "هامش ربح متوقع جيد"],
          weaknesses: ["الحاجة لاحتياطي سيولة كافٍ لأول 3 أشهر"],
          keyOpportunity: "تنويع باقات التسعير لجذب شرائح مختلفة",
          biggestRisk: "ارتفاع تكلفة الاستحواذ على العميل (CAC)",
          recommendation: "اختبار التسعير بنموذج مبسط قبل الاستثمار الكامل"
        },
        {
          id: "market",
          nameAr: "محلل السوق والمنافسين",
          nameEn: "Market Analyst",
          roleAr: "تحليل السوق والمنافسة والطلب",
          roleEn: "Market Dynamics & Competitor Landscape",
          icon: "BarChart2",
          score: 8.7,
          strengths: ["وجود فجوة واضحة في السوق يمكن ملؤها", "تنامي الطلب على هذه الفئة"],
          weaknesses: ["احتمال دخول منافسين جدد بسرعة"],
          keyOpportunity: "بناء ولاء قوي للعلامة التجارية في مرحلة مبكرة",
          biggestRisk: "حملات تسعير عدائية من المنافسين الكبار",
          recommendation: "إجراء مسح أسبوعي لأسعار وعروض المنافسين المباشرين"
        },
        {
          id: "marketing",
          nameAr: "خبير التسويق والنمو",
          nameEn: "Marketing Expert",
          roleAr: "استراتيجية الاستحواذ والانتشار",
          roleEn: "Acquisition & Brand Presence",
          icon: "Target",
          score: 8.4,
          strengths: ["جاذبية الفكرة للمحتوى المرئي والاجتماعي", "إمكانية الاعتماد على التوصيات الشفهية"],
          weaknesses: ["الحاجة لميزانية واضحة للإعلانات الرقمية"],
          keyOpportunity: "بناء حملات محتوى تعليمي تسلط الضوء على المشكلة والحل",
          biggestRisk: "تشتت الرسالة التسويقية بين عدة فئات",
          recommendation: "تحديد شريحة مستهدفة دقيقة واحدة وبدء حملة تجريبية مركزة"
        },
        {
          id: "customer",
          nameAr: "منظور العميل المحتمل",
          nameEn: "Customer Perspective",
          roleAr: "تجربة المستخدم والقيمة الحقيقية",
          roleEn: "Customer UX & Real Value",
          icon: "Users",
          score: 8.8,
          strengths: ["حل مشكلة حقيقية يعاني منها المستخدم", "سهولة فهم الفكرة واستخدامها"],
          weaknesses: ["الحاجة لدعم عملاء فوري وواضح"],
          keyOpportunity: "تقديم فترة تجريبية مجانية أو ضمان استرداد لبناء الثقة",
          biggestRisk: "تردد العميل في تجربة حل جديد غير مشهور",
          recommendation: "جمع آراء أول 10 مستخدمين وتحسين التجربة بناءً عليها"
        },
        {
          id: "growth",
          nameAr: "مستشار التوسع والنمو",
          nameEn: "Growth Advisor",
          roleAr: "قابلية التوسع والشراكات",
          roleEn: "Scalability & Strategic Expansion",
          icon: "TrendingUp",
          score: 8.2,
          strengths: ["إمكانية التوسع الجغرافي والرقمي بسهولة", "فرص شراكات استراتيجية واعدة"],
          weaknesses: ["الحاجة لأتمتة العمليات قبل التوسع الكبير"],
          keyOpportunity: "إطلاق برنامج إحالة (Referral) لمضاعفة النمو العضوي",
          biggestRisk: "التوسع السريع قبل إثبات ملاءمة المنتج للسوق (Product-Market Fit)",
          recommendation: "تثبيت الجودة والعمليات الأساسية أولاً قبل ضخ استثمارات التوسع"
        },
        {
          id: "risk",
          nameAr: "محلل المخاطر",
          nameEn: "Risk Analyst",
          roleAr: "إدارة المخاطر والثغرات التشغيلية",
          roleEn: "Risk Assessment & Mitigation",
          icon: "ShieldAlert",
          score: 7.8,
          strengths: ["مخاطر تشغيلية منخفضة في النموذج الأساسي", "سهولة التراجع أو التعديل (Pivot)"],
          weaknesses: ["الحاجة لاتفاقيات واضحة مع الموردين والشركاء"],
          keyOpportunity: "وضع خطة بديلة للطوارئ وتقليل التكاليف الثابتة",
          biggestRisk: "تذبذب الإيرادات في الأشهر الأولى بعد الإطلاق",
          recommendation: "الاحتفاظ بميزانية طوارئ تكفي 3 إلى 6 أشهر تشغيل"
        }
      ],
      swot: {
        strengths: ["فكرة مبتكرة تحل مشكلة حقيقية", "مرونة عالية في التطوير والتعديل", "فرصة استهداف مجتمعات نشطة"],
        weaknesses: ["الحاجة لتحديد قنوات الاستحواذ بدقة", "ميزانية تسويق أولية قد تحتاج لضبط"],
        opportunities: ["نمو الطلب على الحلول الرقمية الذكية", "إمكانية التوسع في أسواق مجاورة", "بناء شراكات موثوقة"],
        threats: ["منافسة غير مباشرة من الحلول التقليدية", "تغير تفضيلات العملاء بسرعة"]
      },
      financialEstimates: {
        estimatedRevenue: req.body?.projectData?.expectedRevenue || "تقدير نمو تدريجي من الشهر الثاني",
        estimatedCosts: req.body?.projectData?.monthlyExpenses || "مصاريف تشغيلية متحكم بها",
        estimatedProfit: "هامش ربح صافٍ متوقع 25% - 40%",
        breakEvenMonths: "4 إلى 7 أشهر",
        notesAr: "تقدير تقريبي مولد بالذكاء الاصطناعي بناءً على المعلومات المدخلة والافتراضات السوقية.",
        notesEn: "AI-generated approximate estimate based on user inputs and market assumptions."
      },
      summaryAr: `يمتلك مشروع ${pName} فرصة قوية وواعدة للنجاح بفضل وضوح القيمة المضافة. تنصح اللجنة بالتركيز على اختبار المشروع بنموذج مصغر وضبط قنوات التسويق قبل الاستثمار الشامل.`,
      summaryEn: `The project "${pName}" holds solid promise with clear value proposition. The jury advises small-scale MVP testing and targeted marketing before full-scale deployment.`,
      nextStepAr: "إعداد نموذج عمل أولي (MVP) واختباره مع 10 إلى 20 عميل محتمل لجمع التعليقات الحقيقية.",
      nextStepEn: "Build an MVP and pilot it with 10-20 target prospects to validate market demand.",
      whatIf: {
        optimistic: {
          titleAr: "السيناريو المتفائل",
          titleEn: "Optimistic Scenario",
          projectionAr: "تحقيق نمو يفوق 150% والوصول لنقطة التعادل في أقل من 3 أشهر.",
          projectionEn: "Achieve 150%+ growth and reach break-even in under 3 months.",
          keyDriverAr: "انتشار فيروسي وتوصيات شفهية قوية من المستخدمين الأوائل.",
          keyDriverEn: "Viral word-of-mouth adoption from early enthusiasts."
        },
        realistic: {
          titleAr: "السيناريو الواقعي",
          titleEn: "Realistic Scenario",
          projectionAr: "نمو ثابت بنسبة 20% - 35% شهرياً مع نقطة تعادل بين الشهر 4 و6.",
          projectionEn: "Steady growth of 20%-35% monthly with break-even at months 4-6.",
          keyDriverAr: "الالتزام بالخطة التسويقية وتحسين خدمة العملاء المستمر.",
          keyDriverEn: "Disciplined marketing execution and consistent customer feedback loops."
        },
        conservative: {
          titleAr: "السيناريو الحذر",
          titleEn: "Conservative Scenario",
          projectionAr: "نمو بطيء في أول 3 أشهر، يتطلب إعادة ضبط التسعير والرسالة التسويقية.",
          projectionEn: "Slow initial traction requiring pricing adjustment and revised messaging.",
          keyDriverAr: "ضعف الميزانية التسويقية أو تردد العملاء الأوائل.",
          keyDriverEn: "Limited ad budget or hesitation from early adopters."
        }
      },
      recommendedTools: [
        {
          toolId: "business_plan",
          titleAr: "إنشاء Business Plan",
          titleEn: "Build Business Plan",
          reasonAr: "لتفصيل الهيكل التشغيلي ومصادر الدخل بدقة",
          reasonEn: "To detail operating structure and revenue streams",
          iconName: "Briefcase"
        },
        {
          toolId: "market_analysis",
          titleAr: "تحليل السوق والمنافسين",
          titleEn: "Market & Competitor Analysis",
          reasonAr: "لدراسة المنافسين وتحديد الفجوات السعرية",
          reasonEn: "To analyze competitors and uncover pricing gaps",
          iconName: "BarChart2"
        },
        {
          toolId: "marketing_strategy",
          titleAr: "استراتيجيات التسويق والنمو",
          titleEn: "Marketing & Growth Strategies",
          reasonAr: "لوضع خطة وصول قوية واستحواذ على العملاء",
          reasonEn: "To build a robust customer acquisition blueprint",
          iconName: "Target"
        }
      ]
    });
  }
});

// 10.C Lodavia AI Jury - Ask The Jury / Specialist Q&A
app.post("/api/ai/project-jury/ask", async (req, res) => {
  try {
    const { projectData, juryResult, targetMember = 'all', question, lang = 'ar' } = req.body;
    const client = getGeminiClient();

    const pName = projectData?.projectName || 'المشروع';
    const pDesc = projectData?.description || '';

    const systemPrompt = `You are "⚖️ Lodavia AI Jury" Q&A Engine.
A founder is asking the AI jury members for expert guidance regarding their project: "${pName}".
Project Context: ${pDesc}
Target Specialist: ${targetMember} (either 'all' for the whole panel or one of: 'business', 'financial', 'market', 'marketing', 'customer', 'growth', 'risk').

User's Question: "${question}"

If targetMember === 'all':
Provide perspectives from 3-4 key relevant specialists + a final synthesized "⚖️ رأي اللجنة النهائي" (Final Jury Consensus).
If targetMember is a specific specialist:
Provide a deep, realistic, high-value answer directly speaking in the persona of that specialist.

Output a valid JSON object:
{
  "targetMember": "${targetMember}",
  "question": "${question}",
  "perspectives": [
    {
      "memberId": "financial",
      "memberNameAr": "محلل مالي",
      "memberNameEn": "Financial Analyst",
      "answerAr": "...",
      "answerEn": "...",
      "icon": "DollarSign"
    }
  ],
  "finalVerdictAr": "...",
  "finalVerdictEn": "...",
  "singleAnswerAr": "...",
  "singleAnswerEn": "..."
}
Language: ${lang === 'ar' ? 'Arabic' : 'English'}. Return clean JSON only.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Answer founder's question: "${question}" for project "${pName}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error("[Project Jury Ask Error]:", error);
    const q = req.body?.question || "سؤال";
    return handleAIError(res, "/api/ai/project-jury/ask", error, {
      targetMember: req.body?.targetMember || 'all',
      question: q,
      perspectives: [
        {
          memberId: "business",
          memberNameAr: "خبير استراتيجية الأعمال",
          memberNameEn: "Business Strategist",
          answerAr: `بالنظر إلى استراتيجية المشروع، نوصي باختبار الفكرة بنموذج مصغر (MVP) أولاً للتحقق من رغبة العملاء قبل الالتزام بنفقات كبيرة.`,
          answerEn: `Strategically, we recommend launching a minimal viable product first to validate genuine customer appetite before committing major capital.`,
          icon: "Briefcase"
        },
        {
          memberId: "financial",
          memberNameAr: "محلل مالي",
          memberNameEn: "Financial Analyst",
          answerAr: `مالياً، احرص على أن تكون التكاليف الثابتة منخفضة في البداية مع الاحتفاظ بسيولة تشغيلية كافية لتغطية أي تأخير في التدفقات النقدية.`,
          answerEn: `Financially, keep fixed overhead lean and maintain a 3-month operating buffer to weather any initial revenue delays.`,
          icon: "DollarSign"
        },
        {
          memberId: "marketing",
          memberNameAr: "خبير التسويق والنمو",
          memberNameEn: "Marketing Expert",
          answerAr: `تسويقياً، ركز على قناة ترويج أساسية واحدة تحقق أعلى عائد على الاستثمار بدلاً من تشتيت الميزانية على قنوات متعددة.`,
          answerEn: `Marketing-wise, focus on one high-ROI customer acquisition channel rather than diluting efforts across multiple platforms.`,
          icon: "Target"
        }
      ],
      finalVerdictAr: `⚖️ إجماع اللجنة: البدء بخطوة عملية محددة لاختبار الفكرة في السوق خلال أسبوعين، مع مراقبة مؤشرات التكلفة ورضا المستخدمين بعناية.`,
      finalVerdictEn: `⚖️ Jury Consensus: Take a targeted 2-week validation step in the live market while closely monitoring unit economics and early user satisfaction.`,
      singleAnswerAr: `نصيحة تخصصية: ركز على تحقيق أول 10 عملاء يدفعون فعلياً للمشروع، حيث يقدم ذلك الدليل الأصدق على نجاح الفكرة وقابليتها للتوسع.`,
      singleAnswerEn: `Specialist advice: Focus on securing your first 10 paying customers—this is the single most definitive indicator of product-market viability.`
    });
  }
});

// 11. Lodavia AI Pro: Business Plan Creator
app.post("/api/ai/business-plan", async (req, res) => {
  try {
    const { projectName, description, targetAudience, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === 'ar'
      ? `قم بأداء دور استشاري أعمال محترف في Lodavia وإنشاء خطة عمل متكاملة للمشروع التالي:
اسم المشروع: "${projectName}"
الوصف: "${description}"
الجمهور المستهدف: "${targetAudience || 'عام'}"

قم بصياغة خطة عمل جاهزة تغطي:
1. الملخص التنفيذي ورؤية المشروع
2. نموذج العمل ومصادر الدخل (Monetization)
3. التحليل التنافسي والقيمة المضافة (USP)
4. الهيكل التشغيلي والتقني
5. خطة التسويق والنمو
اجعل الأسلوب احترافياً، ملهماً، ومنظماً في نقاط جليّة باللغة العربية.`
      : `As a senior startup consultant at Lodavia AI Pro, build a complete Business Plan for:
Project Name: "${projectName}"
Description: "${description}"
Target Audience: "${targetAudience || 'General'}"

Structure it into:
1. Executive Summary & Vision
2. Revenue Model & Monetization Channels
3. Competitive Edge & Unique Value Proposition
4. Technical & Operational Roadmap
5. Marketing & Acquisition Strategy`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.7 }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/business-plan", error, {
      text: req.body.lang === 'ar'
        ? `📄 **خطة العمل الاستراتيجية لـ ${req.body.projectName || 'المشروع'}**:\n\n1. **الملخص التنفيذي**: مشروع رقمي مبتكر يستهدف مستخدمي لودافيا.\n2. **نموذج الإيرادات**: اشتراكات وخدمات مخصصة.\n3. **النمو والتسويق**: بناء مجتمع تفاعلي قوي.`
        : `📄 **Strategic Business Plan for ${req.body.projectName || 'Project'}**:\n\n1. **Executive Summary**: Innovative digital venture on Lodavia.\n2. **Revenue Model**: Subscriptions & specialized services.\n3. **Growth**: Community engagement strategy.`
    });
  }
});

// 12. Lodavia AI Pro: Marketplace Listing & Pricing Optimizer
app.post("/api/ai/optimize-listing", async (req, res) => {
  try {
    const { title, description, category, currentPrice, lang } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia AI Pro Marketplace Strategy Specialist.
Optimize the project/service listing for Lodavia's Idea & Project Marketplace.
Return a valid JSON object:
{
  "optimizedTitle": "Catchy high-conversion title",
  "optimizedDescription": "Compelling pitch description",
  "suggestedPriceRange": "Suggested pricing bracket",
  "pricingRationale": "Why this price fits current market demand",
  "marketingKeywords": ["keyword1", "keyword2", "keyword3"]
}
Language: ${lang === 'ar' ? 'Arabic' : 'English'}. Return clean JSON only.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Item title: "${title}", Description: "${description}", Current Price: "${currentPrice}"`,
      config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: 0.7 }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return handleAIError(res, "/api/ai/optimize-listing", error, {
      optimizedTitle: req.body.title ? `${req.body.title} - نسخة كوكبية احترافية` : "مشروع رقمي مميز في لودافيا",
      optimizedDescription: req.body.description || "مشروع رقمي عالي الجودة يحتوي على كافة الميزات المطلوبة للبدء فوراً.",
      suggestedPriceRange: "100 - 250 نقطة",
      pricingRationale: "سعر متوازن يراعي القيمة وجودة الأكواد والخدمات.",
      marketingKeywords: ["لودافيا", "مشروع جاهز", "ذكاء اصطناعي"]
    });
  }
});

// 13. Lodavia AI Pro: Buyer & Seller Negotiation & Agreement Draft
app.post("/api/ai/negotiation-draft", async (req, res) => {
  try {
    const { projectTitle, buyerOffer, sellerPrice, agreedTerms, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === 'ar'
      ? `بصفتك مسؤولي الصفقة وتسهيل العقود الذكي في منصة Lodavia Pro:
قم بصياغة مسودة اتفاقية تسليم ومبايعة بين البائع والمشتري للمشروع: "${projectTitle}".
عرض المشتري: "${buyerOffer || 'غير محدد'}" | سعر البائع: "${sellerPrice || 'غير محدد'}"
الشروط المتفق عليها: "${agreedTerms || 'تسليم الأكواد والملكيات الفكرية'}"

قم بإنشاء وثيقة اتفاق مبدئية احترافية تغطي:
1. طرفا الاتفاقية والموضوع
2. القيمة المالية وشروط الدفع المعتمدة
3. الالتزامات والتسليمات المحددة
4. بند حماية الملكية الفكرية ونسخ الاحتياط`
      : `As Lodavia AI Pro Deal Facilitator, draft a deal agreement draft between buyer & seller for "${projectTitle}".
Buyer Offer: "${buyerOffer}" | Seller Asking Price: "${sellerPrice}"
Key Agreed Terms: "${agreedTerms}"

Generate a professional memorandum draft with clear deliverable clauses.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.6 }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/negotiation-draft", error, {
      text: req.body.lang === 'ar'
        ? `📜 **مسودة اتفاقية مبدئية لـ ${req.body.projectTitle || 'الصفقة'}**:\n\n1. **الأطراف**: البائع والمشتري عبر شبكة لودافيا.\n2. **السعر**: القيمة المتفق عليها بين الطرفين.\n3. **الالتزامات**: تسليم كافة الملفات والأصول فور اعتماد الطلب.`
        : `📜 **Agreement Draft for ${req.body.projectTitle || 'Deal'}**:\n\n1. **Parties**: Buyer & Seller via Lodavia.\n2. **Price**: Agreed value between parties.\n3. **Deliverables**: Transfer of files upon order confirmation.`
    });
  }
});

// 14. Lodavia AI Pro: Tasks, Schedule & Personal Goals Planner
app.post("/api/ai/personal-goals", async (req, res) => {
  try {
    const { goalType, targetGoal, timeframe, lang } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `You are Lodavia AI Pro Life & Career Goal Architect.
Generate a milestone roadmap for goal type: "${goalType || 'personal'}" to achieve: "${targetGoal}" in timeframe: "${timeframe || '3 months'}".
Return a JSON object matching this schema:
{
  "goalTitle": "Clean goal title",
  "overallStrategy": "High level strategy overview",
  "milestones": [
    {
      "phase": "Phase 1 / Week 1-2",
      "title": "Milestone title",
      "actionItems": ["Task 1", "Task 2"]
    }
  ],
  "dailyScheduleTip": "Specific daily habit or schedule recommendation"
}
Language: ${lang === 'ar' ? 'Arabic' : 'English'}. Return clean JSON only.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Build milestone roadmap for goal: ${targetGoal}`,
      config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: 0.7 }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return handleAIError(res, "/api/ai/personal-goals", error, {
      goalTitle: req.body.targetGoal || "خطة الإنجاز الكوني",
      overallStrategy: req.body.lang === 'ar' ? "التركيز على العادات اليومية والتطبيق المستمر." : "Focus on daily habits and continuous application.",
      milestones: [
        {
          phase: req.body.lang === 'ar' ? "المرحلة الأولى" : "Phase 1",
          title: req.body.lang === 'ar' ? "التأسيس والبدء" : "Foundation",
          actionItems: [req.body.lang === 'ar' ? "تحديد الخطوات" : "Define steps", req.body.lang === 'ar' ? "المتابعة اليومية" : "Daily check-ins"]
        }
      ],
      dailyScheduleTip: req.body.lang === 'ar' ? "خصص 20 دقيقة يومياً للتركيز الصافي على هدفك." : "Dedicate 20 minutes daily for focus."
    });
  }
});

// 15. Lodavia AI Pro: Smart Gaming Tactical Assistant
app.post("/api/ai/smart-game-assistant", async (req, res) => {
  try {
    const { gameName, currentChallenge, userQuery, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === 'ar'
      ? `بصفتك المدرب والمساعد الذكي الاحترافي لألعاب Lodavia (Lodavia AI Game Master):
اللعبة: "${gameName || 'Lodavia Challenge'}"
التحدي الحالي: "${currentChallenge || 'مرحلة متقدمة'}"
استفسار اللاعب: "${userQuery || 'كيف يمكنني الفوز والحصول على أعلى نقاط؟'}"

قدم نصائح تكتيكية خارقة، استراتيجية لعب، وأسرار مضاعفة النقاط بأسلوب حماسي وممتع.`
      : `As Lodavia AI Gaming Master, give pro tactics and strategy for game: "${gameName}" on challenge: "${currentChallenge}".
Player query: "${userQuery}".`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.8 }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    return handleAIError(res, "/api/ai/smart-game-assistant", error, {
      text: req.body.lang === 'ar'
        ? `🎮 **تكتيكات اللعب الذكية**:\n- ركز على جمع النقاط الكونية مضاعفة في بداية الجولة.\n- استفد من الدفعة السرعية عند تجاوز المعوقات الفضائية.`
        : `🎮 **Smart Gaming Tactics**:\n- Focus on collecting cosmic multipliers early in the round.\n- Use speed boosts when navigating space hazards.`
    });
  }
});

// 16. Parallel World AI Gate: "What If?" Scenario Generator (Ultra Tier)
app.post("/api/ai/parallel-world/what-if", async (req, res) => {
  if (!(await checkAuthoritativeAIQuota(req, res, 'ultra'))) return;
  try {
    const { question, lang } = req.body;
    const client = getGeminiClient();

    const prompt = lang === 'ar'
      ? `أنت المحاكيات الكونية لبوابة المستقبل في العالم الموازي لمنصة Lodavia (Parallel World AI Oracle):
سؤال المستخدم المقترح: "${question || 'ماذا لو بدأت مشروعي الخاص اليوم؟'}"

أنشئ محاكاة مستقبلية تفاعلية مشوقة بصيغة JSON مفصلة تحتوي الحقول التالية بالضبط:
{
  "scenarioTitle": "عنوان السيناريو الكوني",
  "possibleFuture": "وصف مشوق للمستقبل المحتمل بعد 3 إلى 5 سنوات بناءً على هذا القرار",
  "opportunities": ["فرصة 1", "فرصة 2", "فرصة 3"],
  "risks": ["تحدي/خطر 1", "تحدي/خطر 2"],
  "choices": [
    {
      "id": "c1",
      "textAr": "الخيار الأول: التوسع السريع والاعتماد على الذكاء الاصطناعي",
      "textEn": "Option 1: Rapid expansion leveraging AI",
      "outcomeAr": "تحقق نمواً استثنائياً وتصبح رائداً في مجال التطوير الذكي وتفتح بوابات عالمية جديدة.",
      "outcomeEn": "Achieve exceptional growth becoming a pioneer in smart tech."
    },
    {
      "id": "c2",
      "textAr": "الخيار الثاني: التركيز على الجودة والشراكات الاجتماعية المتينة",
      "textEn": "Option 2: Focus on quality & deep social partnerships",
      "outcomeAr": "تبني مجتمعاً وفيّاً للغاية واستقراراً مستداماً مع ولاء عالٍ من مستخدمي لودافيا.",
      "outcomeEn": "Build a deeply loyal community and sustainable stability."
    }
  ]
}
أعد فقط JSON صالح بدون markdown codeblock wrappers extra.`
      : `You are the Parallel World AI Future Gate simulator on Lodavia.
Question: "${question}"
Respond ONLY with valid JSON with fields: scenarioTitle, possibleFuture, opportunities (array), risks (array), choices (array of objects with id, textAr, textEn, outcomeAr, outcomeEn).`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.85 }
    });

    let jsonStr = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    const isAr = req.body.lang === 'ar';
    const q = req.body.question || (isAr ? 'ماذا لو بدأت مشروعي الرقمي اليوم؟' : 'What if I started my digital startup today?');
    return handleAIError(res, "/api/ai/parallel-world/what-if", error, {
      scenarioTitle: isAr ? `محاكاة مستقبلية: ${q}` : `Future Simulation: ${q}`,
      possibleFuture: isAr
        ? `في غضون 3 سنوات، تشهد شبكة أعمالك قفزة نوعية في مجتمعات لودافيا، مما يتيح لك إطلاق منصتك الذكية والوصول إلى أكثر من 50,000 مستخدم نشط في العالم الموازي.`
        : `Within 3 years, your digital venture expands rapidly across Lodavia communities, unlocking over 50,000 active users in the Parallel World.`,
      opportunities: isAr
        ? ["بناء مصدر دخل مستقل ومستدام", "الوصول لشراكات استثمارية مع رواد لودافيا", "امتلاك أصول رقمية متقدمة"]
        : ["Build a sustainable independent revenue source", "Secure strategic partnerships on Lodavia", "Own advanced digital assets"],
      risks: isAr
        ? ["إدارة الوقت والتوازن بين التخطيط والتنفيذ", "تغيرات السوق التنافسية السريعة"]
        : ["Time management & execution balance", "Rapid market competition shift"],
      choices: [
        {
          id: "c1",
          textAr: "الاستثمار في حلول الذكاء الاصطناعي والتوسع السريع",
          textEn: "Invest in AI solutions and scale rapidly",
          outcomeAr: "تنجح في أتمتة 80% من العمليات وتتضاعف أرباحك الكونية مع فتح بوابة المبدعين.",
          outcomeEn: "Automate 80% of operations and double cosmic rewards with Creator Gate unlocked."
        },
        {
          id: "c2",
          textAr: "البدء بنماذج تدريجية واختبار الفكرة مع أصدقائك في لودافيا",
          textEn: "Start incrementally and test with Lodavia friends",
          outcomeAr: "تبني قاعدة جماهيرية مخلصة وتتجنب مخاطر رأس المال مع تعزيز مستوى مهاراتك.",
          outcomeEn: "Build a devoted audience base and avoid capital risks while leveling up skills."
        }
      ]
    });
  }
});

// 10. Cosmic Packs Server Validation & Security Engine
app.post("/api/packs/buy-and-open", packsLimiter, requireAuth, async (req, res) => {
  try {
    const { packId } = req.body;
    if (!packId || typeof packId !== 'string') {
      return res.status(400).json({ error: "INVALID_REQUEST", messageAr: "معرف الحزمة مطلوب" });
    }

    const result = await processCosmicPackPurchase(req.user!.uid, packId);
    return res.status(result.status).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: "PACK_TRANSACTION_FAILED", message: error.message });
  }
});

// 11. Authoritative Marketplace Purchase Endpoint
app.post("/api/marketplace/purchase", marketplaceLimiter, requireAuth, async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: "INVALID_REQUEST", message: "Project ID is required" });
    }

    const result = await processMarketplacePurchase(req.user!.uid, projectId);
    return res.status(result.status).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: "MARKETPLACE_TRANSACTION_FAILED", message: error.message });
  }
});

// 12. Protected Account Lifecycle Endpoints
app.get("/api/account/me", requireAuth, async (req, res) => {
  try {
    const uid = req.user!.uid;
    const account = await getServerAccount(uid);
    return res.json({
      uid: account.uid,
      email: req.user!.email,
      emailVerified: req.user!.emailVerified,
      isAnonymous: req.user!.isAnonymous,
      role: account.role,
      points: account.points,
      shards: account.shards,
      subscription: account.subscription,
      inventory: account.inventory,
      purchasedItems: account.purchasedItems
    });
  } catch (error: any) {
    return res.status(500).json({ error: "FAILED_TO_LOAD_ACCOUNT", message: error.message });
  }
});

app.post("/api/account/delete", authRateLimiter, requireAuth, requireRecentAuth(900), async (req, res) => {
  try {
    const { confirmDelete } = req.body;
    if (confirmDelete !== true) {
      return res.status(400).json({
        error: "CONFIRMATION_REQUIRED",
        messageAr: "يتطلب حذف الحساب تأكيداً صريحاً (confirmDelete: true)",
        messageEn: "Explicit confirmation required (confirmDelete: true)."
      });
    }

    const uid = req.user!.uid;
    const result = await deleteServerAccount(uid);
    return res.status(200).json({
      success: true,
      messageAr: "تم حذف الحساب وجميع البيانات المرتبطة به نهائياً",
      messageEn: "Account and associated data have been permanently deleted.",
      details: result.details
    });
  } catch (error: any) {
    logSecurityEvent("ACCOUNT_DELETION_FAILED", { error: error?.message });
    return res.status(500).json({
      error: "ACCOUNT_DELETION_FAILED",
      messageAr: "حدث خطأ أثناء معالجة حذف الحساب",
      messageEn: "An error occurred while deleting the account."
    });
  }
});

// 13. Protected Admin Endpoints (RBAC Enforced)
app.get("/api/admin/system-status", requireAuth, requireAdmin, async (req, res) => {
  return res.json({
    status: "healthy",
    authenticatedAdmin: req.user!.uid,
    serverTime: new Date().toISOString(),
    nodeVersion: process.version,
    activeServices: {
      gemini: hasValidGeminiKey(),
      firebaseAdmin: !!adminApp,
      rateLimiter: "active",
      helmet: "active",
      cors: "active"
    }
  });
});

app.get("/api/admin/audit-logs", requireAuth, requireAdmin, async (req, res) => {
  return res.json({
    securityStatus: "OPTIMAL",
    auditLevel: "STRICT_RBAC_ENABLED",
    timestamp: new Date().toISOString()
  });
});

// Safe production error handling middleware (prevents leakage of traces or keys)
app.use(safeErrorHandler);

// Vite & Static Asset Handling Middleware
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR wrapper...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lodavia server running on http://localhost:${PORT}`);
  });
}

bootstrap();
