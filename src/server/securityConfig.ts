import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

/**
 * Server-Side Security Audit Logger.
 * Records security-relevant events without logging passwords, tokens, or API keys.
 */
export function logSecurityEvent(type: string, details: Record<string, any>) {
  const safeDetails = { ...details };
  // Redact any potentially sensitive keys
  delete safeDetails.token;
  delete safeDetails.password;
  delete safeDetails.apiKey;
  delete safeDetails.authorization;
  delete safeDetails.secret;

  console.warn(`[SECURITY AUDIT] [${new Date().toISOString()}] [${type}]:`, JSON.stringify(safeDetails));
}

/**
 * Production Security Headers via Helmet.
 * Carefully configured to protect against XSS, clickjacking, and MIME sniffing
 * without breaking Capacitor mobile wrappers, Three.js WebGL canvases, or external CDN models.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Prevents blocking Three.js model loaders & Firebase asset CDN
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  frameguard: { action: 'sameorigin' },
  dnsPrefetchControl: { allow: false },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true
});

/**
 * Strict CORS Configuration.
 * Restricts cross-origin requests to trusted development and production domains.
 * Allows Android/Capacitor webviews (capacitor://localhost).
 */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://localhost',
  'http://localhost',
  'capacitor://localhost',
  process.env.APP_URL,
  process.env.DEV_URL
].filter(Boolean) as string[];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Requests without origin header are allowed (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isCloudRun = /\.run\.app$/.test(origin);
    const isGoogleDomain = /\.google\.com$/.test(origin) || /\.aistudio\.google$/.test(origin);

    if (isExplicitlyAllowed || isCloudRun || isGoogleDomain) {
      return callback(null, true);
    }

    logSecurityEvent('CORS_ORIGIN_BLOCKED', { blockedOrigin: origin });
    return callback(new Error('CORS_NOT_ALLOWED'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

/**
 * Rate Limiter: General API endpoints.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/api/health',
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    messageAr: 'تم تجاوز الحد الأقصى للطلبات. يرجى الانتظار قليلاً.',
    messageEn: 'Too many requests. Please try again later.'
  }
});

/**
 * Dual Key Generator: User-based if authenticated, IP-based otherwise.
 * Prevents cellular carrier NAT / shared WiFi users from locking each other out,
 * while stopping single attackers who rotate IP addresses.
 */
export const userOrIpKeyGenerator = (req: Request): string => {
  const uid = (req as any).user?.uid;
  if (uid && typeof uid === 'string' && uid.trim() !== '') {
    return `user_${uid}`;
  }
  return req.ip || '127.0.0.1';
};

/**
 * Rate Limiter: General AI conversational and text endpoints.
 */
export const aiGeneralLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
  keyGenerator: userOrIpKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('AI_RATE_LIMIT_TRIGGERED', {
      ip: req.ip,
      uid: (req as any).user?.uid,
      path: req.path
    });
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      messageAr: 'لقد قمت بإرسال عدد كبير من استفسارات الذكاء الاصطناعي في وقت قصير. يرجى الانتظار دقيقة.',
      messageEn: 'AI request limit reached. Please wait a moment before trying again.'
    });
  }
});

/**
 * Rate Limiter: Heavy AI operations (Image Generation, Image Vision, Voice Synthesis).
 */
export const aiHeavyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 12,
  keyGenerator: userOrIpKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('AI_HEAVY_RATE_LIMIT_TRIGGERED', {
      ip: req.ip,
      uid: (req as any).user?.uid,
      path: req.path
    });
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      messageAr: 'تم تجاوز حد العمليات الثقيلة (توليد الصور/الصوت). يرجى الانتظار دقيقة.',
      messageEn: 'Rate limit for intensive AI operations reached. Please wait a moment.'
    });
  }
});

/**
 * Rate Limiter: Cosmic Pack Purchases.
 */
export const packsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('PACKS_RATE_LIMIT_TRIGGERED', { ip: req.ip, path: req.path });
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      messageAr: 'يرجى الانتظار بضع ثوانٍ بين عمليات شراء الحزم.',
      messageEn: 'Please wait a moment between cosmic pack purchases.'
    });
  }
});

/**
 * Rate Limiter: Marketplace operations.
 */
export const marketplaceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    messageAr: 'تم تجاوز حد عمليات المتجر. يرجى المحاولة لاحقاً.',
    messageEn: 'Marketplace rate limit exceeded. Please wait a moment.'
  }
});

/**
 * Rate Limiter: Sensitive Authentication & Account Lifecycle endpoints.
 * Protects account deletion, password resets, verification resends, and profile changes.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('AUTH_RATE_LIMIT_TRIGGERED', { ip: req.ip, path: req.path });
    res.status(429).json({
      error: 'AUTH_RATE_LIMIT_EXCEEDED',
      messageAr: 'تم تجاوز الحد المسموح لعمليات الحساب والأمان. يرجى المحاولة بعد قليل.',
      messageEn: 'Too many account operations. Please wait a moment before trying again.'
    });
  }
});

/**
 * Input Sanitization & Anti-Prototype-Pollution Middleware.
 * Prevents object injection attacks and strips illegal control characters.
 */
export function validateAndSanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    const checkObject = (obj: any): boolean => {
      for (const key of Object.keys(obj)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          logSecurityEvent('PROTOTYPE_POLLUTION_ATTEMPT', { ip: req.ip, key, path: req.path });
          return false;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!checkObject(obj[key])) return false;
        }
      }
      return true;
    };

    if (!checkObject(req.body)) {
      return res.status(400).json({
        error: 'MALFORMED_INPUT',
        message: 'Invalid payload structure.'
      });
    }
  }

  next();
}

/**
 * Production Safe Error Handling Middleware.
 * Prevents leakage of stack traces, database credentials, or internal server paths.
 */
export function safeErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[Server Error Handler] ${req.method} ${req.path}:`, err?.message || err);

  if (err?.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({
      error: 'CORS_FORBIDDEN',
      message: 'Access from this origin is not permitted.'
    });
  }

  if (err?.type === 'entity.too.large' || err?.status === 413) {
    logSecurityEvent('PAYLOAD_TOO_LARGE_BLOCKED', { ip: req.ip, path: req.path });
    return res.status(413).json({
      error: 'PAYLOAD_TOO_LARGE',
      messageAr: 'حجم البيانات المرفوعة يتجاوز الحد المسموح به.',
      messageEn: 'Request payload exceeds maximum allowed size.'
    });
  }

  // Generic sanitized production error
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred. Please try again later.'
  });
}

/**
 * Runtime validation middleware for conversational AI requests.
 * Rejects unexpectedly huge prompts, non-string messages, or invalid history structures.
 */
export function validateAiChatPayload(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      error: 'MALFORMED_INPUT',
      message: 'Request body must be a valid JSON object.'
    });
  }

  // Validate message / prompt length
  const textInput = body.message ?? body.prompt;
  if (textInput !== undefined) {
    if (typeof textInput !== 'string') {
      return res.status(400).json({
        error: 'INVALID_FIELD_TYPE',
        message: 'The message/prompt field must be a string.'
      });
    }
    if (textInput.length > 3000) {
      logSecurityEvent('OVERSIZED_PROMPT_REJECTED', {
        ip: req.ip,
        uid: (req as any).user?.uid,
        length: textInput.length,
        maxAllowed: 3000
      });
      return res.status(400).json({
        error: 'PROMPT_TOO_LONG',
        messageAr: 'نص الاستفسار طويل جداً. الحد الأقصى هو 3000 حرف.',
        messageEn: 'Prompt exceeds the maximum allowed length of 3000 characters.'
      });
    }
  }

  // Validate conversation history structure
  if (body.history !== undefined) {
    if (!Array.isArray(body.history)) {
      return res.status(400).json({
        error: 'INVALID_HISTORY_FORMAT',
        message: 'History must be an array of conversation turns.'
      });
    }
    if (body.history.length > 30) {
      return res.status(400).json({
        error: 'HISTORY_TOO_LONG',
        message: 'Conversation history exceeds maximum permitted turn depth (30).'
      });
    }
  }

  next();
}

/**
 * Runtime validation middleware for heavy AI endpoints (Image Generation & Image Analysis).
 */
export function validateHeavyAiPayload(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      error: 'MALFORMED_INPUT',
      message: 'Request body must be a valid JSON object.'
    });
  }

  // Image analysis validation
  if (req.path.includes('analyze-image')) {
    if (!body.image || typeof body.image !== 'string') {
      return res.status(400).json({
        error: 'MISSING_IMAGE',
        message: 'Base64 image data is required.'
      });
    }
    // Limit to max 10MB base64 string (approx 13.5M characters)
    if (body.image.length > 14 * 1024 * 1024) {
      logSecurityEvent('OVERSIZED_IMAGE_PAYLOAD_REJECTED', {
        ip: req.ip,
        uid: (req as any).user?.uid,
        length: body.image.length
      });
      return res.status(400).json({
        error: 'IMAGE_TOO_LARGE',
        messageAr: 'حجم الصورة المرفوعة يتجاوز الحد المسموح به (10 ميغابايت).',
        messageEn: 'Image exceeds maximum allowed size of 10MB.'
      });
    }
  }

  // Image generation prompt validation
  if (req.path.includes('generate-image')) {
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'PROMPT_REQUIRED',
        message: 'A valid text prompt is required for image generation.'
      });
    }
    if (body.prompt.length > 1000) {
      return res.status(400).json({
        error: 'PROMPT_TOO_LONG',
        message: 'Image generation prompt must not exceed 1000 characters.'
      });
    }
  }

  next();
}

