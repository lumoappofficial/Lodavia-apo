import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client lazily and safely
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set!");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_DEV_IF_NONE_PROVIDED",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// 1. General Chat Assistant with Context
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, context, lang } = req.body;
    const client = getGeminiClient();

    const systemInstruction = `You are Lodavia Cosmic AI Assistant (مساعد لودافيا الكوني الذكي), an advanced, highly engaging, and helpful AI companion integrated directly into Lodavia Cosmic Network.
Lodavia is a social, learning, and interactive cosmic-themed platform.
Your persona is inspiring, futuristic, friendly, and highly intelligent. You match Lodavia's celestial, high-tech, and cosmic aesthetic.
You must speak in the language preferred by the user (Arabic or English) - if the language is 'ar', reply in beautiful, professional Arabic.

Current User Context:
- User Name: ${context?.user?.name || "Lodavia Explorer"}
- Bio: ${context?.user?.bio || ""}
- Interests: ${JSON.stringify(context?.user?.interests || [])}
- Active Tab: ${context?.activeTab || "home"}
- Joined Communities: ${JSON.stringify(context?.user?.joinedCommunities || [])}

When asked about Lodavia features, answer helpfully:
- Lodavia includes interactive communities (Programming, AI, Cosmic Space, Art, Sports), spatial 3D voice channels, direct chat rooms, courses, events, and a points reward system.
- You can offer help with: writing posts, translating messages, summarizing discussions, recommending communities, recommending friends, and giving tailored cosmic recommendations.

Answer the user's latest query clearly and engagingly.`;

    const contents = [];
    
    // Add history if present
    if (history && history.length > 0) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    
    // Add current query
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/write-post:", error);
    res.status(500).json({ error: error.message });
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("Error in /api/ai/translate:", error);
    res.status(500).json({ error: error.message });
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/summarize:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4b. AI Multi-modal Image Analyzer
app.post("/api/ai/analyze-image", async (req, res) => {
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
      model: "gemini-3.5-flash",
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
    console.error("Error in /api/ai/analyze-image:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image" });
  }
});

// 4c. AI Image Generation (Using Imagen 3)
app.post("/api/ai/generate-image", async (req, res) => {
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
    console.error("Error in /api/ai/generate-image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// 4d. AI Voice Chat Text-to-Speech (TTS)
app.post("/api/ai/voice-chat", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
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
    console.error("Error in /api/ai/voice-chat:", error);
    res.status(500).json({ error: error.message || "Speech synthesis failed" });
  }
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
      model: "gemini-3.5-flash",
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
    console.error("Error in /api/ai/recommendations:", error);
    res.status(500).json({ error: error.message });
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/creator-assistant:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
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
      model: "gemini-3.5-flash",
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
    console.error("Error in analyze-and-suggest:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI suggestions" });
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
      model: "gemini-3.5-flash",
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
    console.error("Error in reply-all:", error);
    res.status(500).json({ error: error.message || "Failed to generate Reply All with AI" });
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
      model: "gemini-3.5-flash",
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
    console.error("Error in generate-brief:", error);
    res.status(500).json({ error: error.message || "Failed to generate your personalized AI Daily brief" });
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in explain-brief:", error);
    res.status(500).json({ error: error.message || "Failed to explain news with Lodavia" });
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
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in ask-brief:", error);
    res.status(500).json({ error: error.message || "Failed to ask Lodavia" });
  }
});

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
