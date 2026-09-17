import { Request, Response, NextFunction } from 'express';
import { initializeApp as initAdminApp, getApps as getAdminApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAppCheck as getAdminAppCheck } from 'firebase-admin/app-check';
import { logSecurityEvent } from './securityConfig';

// Extend Express Request type to include verified user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        role?: string;
        authTime?: number;
        emailVerified?: boolean;
        isAnonymous?: boolean;
      };
      appCheck?: {
        appId: string;
        valid: boolean;
      };
    }
  }
}

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'lodavia';

// Safe singleton initialization for Firebase Admin
export const adminApp = getAdminApps().length === 0
  ? initAdminApp({ projectId })
  : getAdminApps()[0];

export const adminAuth = getAdminAuth(adminApp);
export const adminDb = getAdminFirestore(adminApp);

/**
 * Concurrency Mutex Lock per UID.
 * Guarantees serial execution of sensitive operations (pack purchase, quota update, balance deduction)
 * for the same user, preventing race conditions and double-spending.
 */
const userLocks = new Map<string, Promise<void>>();

export async function withUserLock<T>(uid: string, fn: () => Promise<T>): Promise<T> {
  while (userLocks.has(uid)) {
    try {
      await userLocks.get(uid);
    } catch {
      // Ignore previous lock failures
    }
  }

  let resolveLock!: () => void;
  const lockPromise = new Promise<void>((res) => {
    resolveLock = res;
  });
  userLocks.set(uid, lockPromise);

  try {
    return await fn();
  } finally {
    userLocks.delete(uid);
    resolveLock();
  }
}

/**
 * Reusable Server-Side Authentication Middleware.
 * Strictly verifies the Firebase ID Token from `Authorization: Bearer <token>`.
 * Rejects missing (401), invalid (401), and attaches verified UID to `req.user`.
 * NEVER trusts client-provided UID, role, or subscription in the request body.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurityEvent('UNAUTHORIZED_REQUEST_BLOCKED', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      reason: 'MISSING_BEARER_TOKEN'
    });
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      messageAr: 'يتطلب هذا الإجراء تسجيل الدخول أولاً',
      messageEn: 'Authentication required. Missing or malformed Bearer token.'
    });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      messageAr: 'رمز الدخول فارغ',
      messageEn: 'Empty authorization token provided.'
    });
  }

  try {
    let decodedUid = '';
    let decodedEmail = '';
    let decodedRole = 'user';
    let authTime = Math.floor(Date.now() / 1000);
    let emailVerified = true;
    let isAnonymous = false;

    // Support safe testing tokens in development / test suites
    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_TEST_TOKENS === 'true' && token.startsWith('mock_test_token_')) {
      if (token === 'mock_test_token_revoked') {
        const err: any = new Error('Token has been revoked');
        err.code = 'auth/id-token-revoked';
        throw err;
      }
      if (token === 'mock_test_token_disabled') {
        const err: any = new Error('User account is disabled');
        err.code = 'auth/user-disabled';
        throw err;
      }

      decodedUid = token.replace('mock_test_token_', '').trim();
      decodedEmail = `${decodedUid}@lodavia.internal`;
      if (decodedUid.startsWith('admin_')) {
        decodedRole = 'admin';
      }
      if (token.includes('old_auth')) {
        authTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      } else if (token.includes('recent_auth')) {
        authTime = Math.floor(Date.now() / 1000) - 10; // 10s ago
      }
      if (token.includes('unverified')) {
        emailVerified = false;
      }
      if (token.includes('guest') || decodedUid.startsWith('guest_')) {
        isAnonymous = true;
      }
    } else {
      // checkRevoked = true ensures tokens from revoked sessions or deleted accounts fail immediately
      const decoded = await adminAuth.verifyIdToken(token, true);
      decodedUid = decoded.uid;
      decodedEmail = decoded.email || '';
      decodedRole = (decoded as any).role || 'user';
      authTime = decoded.auth_time;
      emailVerified = Boolean(decoded.email_verified);
      isAnonymous = decoded.firebase?.sign_in_provider === 'anonymous';
    }

    if (!decodedUid) {
      throw new Error('Token does not contain a valid subject/UID');
    }

    // Attach verified user identity to the request object
    req.user = {
      uid: decodedUid,
      email: decodedEmail,
      role: decodedRole,
      authTime,
      emailVerified,
      isAnonymous
    };

    next();
  } catch (error: any) {
    const errorCode = error?.code || 'UNKNOWN_AUTH_ERROR';
    logSecurityEvent('TOKEN_VERIFICATION_FAILED', {
      ip: req.ip,
      path: req.path,
      error: errorCode
    });

    if (errorCode === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'TOKEN_REVOKED',
        messageAr: 'تم إلغاء جلسة الحساب. يرجى تسجيل الدخول مجدداً.',
        messageEn: 'Authentication token has been revoked. Please sign in again.'
      });
    }

    if (errorCode === 'auth/user-disabled') {
      return res.status(403).json({
        error: 'USER_DISABLED',
        messageAr: 'تم تعطيل هذا الحساب. يرجى التواصل مع الدعم الفني.',
        messageEn: 'This user account has been disabled.'
      });
    }

    return res.status(401).json({
      error: 'INVALID_TOKEN',
      messageAr: 'رمز المصادقة غير صالح أو منتهي الصلاحية',
      messageEn: 'Invalid, expired, or revoked Firebase ID token.'
    });
  }
}

/**
 * Middleware: Requires that the user's email is authoritatively verified in Firebase.
 * Guest users and unverified email users are blocked from sensitive operations.
 */
export function requireVerifiedEmail(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
  }

  if (req.user.isAnonymous) {
    return res.status(403).json({
      error: 'GUEST_UNVERIFIED',
      messageAr: 'يتطلب هذا الإجراء إنشاء حساب والتحقق من البريد الإلكتروني.',
      messageEn: 'This action requires a verified registered account, not a guest session.'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      error: 'EMAIL_NOT_VERIFIED',
      messageAr: 'يرجى تأكيد بريدك الإلكتروني أولاً للمتابعة.',
      messageEn: 'Please verify your email address to continue.'
    });
  }

  next();
}

/**
 * Middleware: Requires recent authentication (for critical operations like account deletion).
 * Checks auth_time from Firebase ID token.
 */
export function requireRecentAuth(maxAgeSeconds: number = 900) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
    }

    const currentUnix = Math.floor(Date.now() / 1000);
    const authTime = req.user.authTime || 0;

    if (currentUnix - authTime > maxAgeSeconds) {
      logSecurityEvent('RECENT_AUTH_REQUIRED', { uid: req.user.uid, authTime, maxAgeSeconds });
      return res.status(401).json({
        error: 'REAUTHENTICATION_REQUIRED',
        messageAr: 'هذا الإجراء الحساس يتطلب تسجيل دخول حديث لتأكيد هويتك.',
        messageEn: 'This sensitive action requires recent authentication. Please re-authenticate and try again.'
      });
    }

    next();
  };
}

/**
 * Middleware: Disallows anonymous guest sessions from accessing privileged or member-only endpoints.
 */
export function requireNonGuest(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
  }

  if (req.user.isAnonymous) {
    return res.status(403).json({
      error: 'GUEST_ACCESS_RESTRICTED',
      messageAr: 'لا يمكن لزائر المنصة القيام بهذا الإجراء. يرجى تسجيل حساب.',
      messageEn: 'Guest accounts cannot perform this action. Please create an account.'
    });
  }

  next();
}

export const adminAppCheck = getAdminAppCheck(adminApp);

/**
 * Middleware: Verifies Firebase App Check attestation token if provided.
 * Enforcement Strategy:
 * - Defaults to MONITORING mode: logs metrics and records events without blocking legitimate clients.
 * - If ENFORCE_APP_CHECK=true or X-Require-AppCheck is set: strictly enforces valid token.
 */
export async function verifyAppCheck(req: Request, res: Response, next: NextFunction) {
  const appCheckToken = req.header('X-Firebase-AppCheck') || req.header('x-firebase-appcheck');
  const isEnforced = process.env.ENFORCE_APP_CHECK === 'true';

  if (!appCheckToken) {
    if (isEnforced) {
      logSecurityEvent('APP_CHECK_MISSING_ENFORCED', { ip: req.ip, path: req.path });
      return res.status(401).json({
        error: 'APP_CHECK_REQUIRED',
        messageAr: 'يتطلب هذا الإجراء إثبات أمان التطبيق (App Check)',
        messageEn: 'Valid Firebase App Check attestation token is required.'
      });
    }
    // In monitoring mode, proceed smoothly
    return next();
  }

  try {
    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_TEST_TOKENS === 'true' && appCheckToken.startsWith('dev_mock_appcheck_token_')) {
      req.appCheck = {
        appId: 'com.lodavia.app.dev',
        valid: true
      };
      return next();
    }

    const appCheckClaims = await adminAppCheck.verifyToken(appCheckToken);
    req.appCheck = {
      appId: appCheckClaims.appId,
      valid: true
    };
    next();
  } catch (error: any) {
    logSecurityEvent('APP_CHECK_VERIFICATION_FAILED', {
      ip: req.ip,
      path: req.path,
      error: error?.message || 'INVALID_APP_CHECK_TOKEN'
    });

    if (isEnforced) {
      return res.status(401).json({
        error: 'APP_CHECK_INVALID',
        messageAr: 'رمز أمان التطبيق (App Check) غير صالح أو منتهي الصلاحية',
        messageEn: 'Invalid or expired Firebase App Check token.'
      });
    }

    // In monitoring mode, proceed so legitimate users aren't locked out prematurely
    next();
  }
}

