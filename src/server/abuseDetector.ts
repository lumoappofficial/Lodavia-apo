import { logSecurityEvent } from './securityConfig';

export type SuspiciousEventType =
  | 'AUTH_FAILURE'
  | 'FORBIDDEN_ATTEMPT'
  | 'AI_QUOTA_BURST'
  | 'HEAVY_AI_BURST'
  | 'INSUFFICIENT_FUNDS_PROBE'
  | 'OVERSIZED_PAYLOAD'
  | 'PROTOTYPE_POLLUTION_PROBE'
  | 'APP_CHECK_ANOMALY';

interface ActivityRecord {
  timestamps: number[];
  score: number;
  restrictedUntil: number;
}

const WINDOW_MS = 5 * 60 * 1000; // 5 minute rolling window
const RESTRICTION_DURATION_MS = 3 * 60 * 1000; // 3 minute temporary cooldown (never permanent ban)
const THRESHOLD_SCORE = 25; // Score threshold triggering cooldown

// Event weights based on severity
const EVENT_WEIGHTS: Record<SuspiciousEventType, number> = {
  AUTH_FAILURE: 3,
  FORBIDDEN_ATTEMPT: 5,
  AI_QUOTA_BURST: 4,
  HEAVY_AI_BURST: 6,
  INSUFFICIENT_FUNDS_PROBE: 5,
  OVERSIZED_PAYLOAD: 8,
  PROTOTYPE_POLLUTION_PROBE: 12,
  APP_CHECK_ANOMALY: 4
};

// In-memory ledger for IP and UID tracking
const ipLedger = new Map<string, ActivityRecord>();
const userLedger = new Map<string, ActivityRecord>();

function getOrCreateRecord(map: Map<string, ActivityRecord>, key: string): ActivityRecord {
  let record = map.get(key);
  if (!record) {
    record = {
      timestamps: [],
      score: 0,
      restrictedUntil: 0
    };
    map.set(key, record);
  }
  return record;
}

function pruneRecord(record: ActivityRecord, now: number) {
  record.timestamps = record.timestamps.filter(ts => now - ts < WINDOW_MS);
  if (record.timestamps.length === 0 && now > record.restrictedUntil) {
    record.score = 0;
  }
}

/**
 * Authoritatively records a security incident and evaluates anti-abuse thresholds.
 * Strictly adheres to data minimization: no passwords, tokens, or private contents stored.
 */
export function recordSuspiciousActivity(
  ip: string = '127.0.0.1',
  uid?: string,
  type: SuspiciousEventType = 'AUTH_FAILURE',
  details?: Record<string, any>
) {
  const now = Date.now();
  const weight = EVENT_WEIGHTS[type] || 3;

  // Sanitize details to guarantee zero leakage of secrets
  const sanitizedDetails = { ...details };
  delete sanitizedDetails.password;
  delete sanitizedDetails.token;
  delete sanitizedDetails.apiKey;
  delete sanitizedDetails.authorization;
  delete sanitizedDetails.secret;
  delete sanitizedDetails.otp;
  delete sanitizedDetails.message; // Do not log private message content

  // 1. Evaluate IP record
  const ipRecord = getOrCreateRecord(ipLedger, ip);
  pruneRecord(ipRecord, now);
  ipRecord.timestamps.push(now);
  ipRecord.score += weight;

  if (ipRecord.score >= THRESHOLD_SCORE && now > ipRecord.restrictedUntil) {
    ipRecord.restrictedUntil = now + RESTRICTION_DURATION_MS;
    logSecurityEvent('IP_TEMPORARY_RESTRICTION_TRIGGERED', {
      ip,
      score: ipRecord.score,
      restrictedMinutes: RESTRICTION_DURATION_MS / 60000,
      triggerType: type,
      riskLevel: 'HIGH'
    });
  }

  // 2. Evaluate UID record if authenticated
  if (uid && uid.trim() !== '') {
    const userRecord = getOrCreateRecord(userLedger, uid);
    pruneRecord(userRecord, now);
    userRecord.timestamps.push(now);
    userRecord.score += weight;

    if (userRecord.score >= THRESHOLD_SCORE && now > userRecord.restrictedUntil) {
      userRecord.restrictedUntil = now + RESTRICTION_DURATION_MS;
      logSecurityEvent('USER_TEMPORARY_RESTRICTION_TRIGGERED', {
        uid,
        score: userRecord.score,
        restrictedMinutes: RESTRICTION_DURATION_MS / 60000,
        triggerType: type,
        riskLevel: 'HIGH'
      });
    }
  }

  // General audit log
  logSecurityEvent(`SUSPICIOUS_${type}`, {
    ip,
    uid: uid || 'anonymous',
    type,
    riskLevel: weight >= 8 ? 'HIGH' : (weight >= 5 ? 'MEDIUM' : 'LOW'),
    ...sanitizedDetails
  });
}

/**
 * Checks if an IP or UID is currently under temporary cooldown restriction.
 */
export function isTemporarilyRestricted(ip: string, uid?: string): { restricted: boolean; remainingSeconds: number } {
  const now = Date.now();

  const ipRecord = ipLedger.get(ip);
  if (ipRecord && ipRecord.restrictedUntil > now) {
    return {
      restricted: true,
      remainingSeconds: Math.ceil((ipRecord.restrictedUntil - now) / 1000)
    };
  }

  if (uid) {
    const userRecord = userLedger.get(uid);
    if (userRecord && userRecord.restrictedUntil > now) {
      return {
        restricted: true,
        remainingSeconds: Math.ceil((userRecord.restrictedUntil - now) / 1000)
      };
    }
  }

  return { restricted: false, remainingSeconds: 0 };
}

/**
 * Periodic clean-up routine to prevent memory growth.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of ipLedger.entries()) {
    pruneRecord(rec, now);
    if (rec.timestamps.length === 0 && now > rec.restrictedUntil) {
      ipLedger.delete(key);
    }
  }
  for (const [key, rec] of userLedger.entries()) {
    pruneRecord(rec, now);
    if (rec.timestamps.length === 0 && now > rec.restrictedUntil) {
      userLedger.delete(key);
    }
  }
}, 5 * 60 * 1000);
