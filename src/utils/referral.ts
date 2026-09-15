// ============================================================================
// Lodavia Referral System — "ادعُ صديقًا واكسب"
// ============================================================================

const REGISTRY_KEY = 'lodavia_referral_registry';
const STATS_KEY_PREFIX = 'lodavia_referral_stats_';
const ORIGIN_KEY_PREFIX = 'lodavia_referred_by_';

const SIGNUP_BONUS_REFERRER = 100;
const SIGNUP_BONUS_FRIEND = 100;
const ACTIVITY_BONUS_REFERRER = 200;
const MAX_DAILY_CREDITS = 5;
const MAX_WEEKLY_CREDITS = 20;

interface ReferrerStats {
  invitedCount: number;
  pointsEarned: number;
  dailyCreditCount: number;
  dailyDate: string;
  weeklyCreditCount: number;
  weekStart: string;
}

interface ReferralOrigin {
  referrerId: string;
  activityBonusGranted: boolean;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekStartKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

function readRegistry(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '{}'); } catch { return {}; }
}

function writeRegistry(registry: Record<string, string>) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

function getStats(userId: string): ReferrerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY_PREFIX + userId);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { invitedCount: 0, pointsEarned: 0, dailyCreditCount: 0, dailyDate: todayKey(), weeklyCreditCount: 0, weekStart: weekStartKey() };
}

function saveStats(userId: string, stats: ReferrerStats) {
  localStorage.setItem(STATS_KEY_PREFIX + userId, JSON.stringify(stats));
}

function canCreditNow(stats: ReferrerStats): { ok: boolean; stats: ReferrerStats } {
  const today = todayKey();
  const week = weekStartKey();
  if (stats.dailyDate !== today) { stats.dailyDate = today; stats.dailyCreditCount = 0; }
  if (stats.weekStart !== week) { stats.weekStart = week; stats.weeklyCreditCount = 0; }
  const ok = stats.dailyCreditCount < MAX_DAILY_CREDITS && stats.weeklyCreditCount < MAX_WEEKLY_CREDITS;
  return { ok, stats };
}

export function getOrCreateReferralCode(userId: string, userName: string): string {
  const existing = Object.entries(readRegistry()).find(([, id]) => id === userId);
  if (existing) return existing[0];

  const base = (userName || 'LODA').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'LODA';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const code = `${base}-${suffix}`;

  const registry = readRegistry();
  registry[code] = userId;
  writeRegistry(registry);
  return code;
}

export function getReferralStats(userId: string) {
  const stats = getStats(userId);
  return { invitedCount: stats.invitedCount, pointsEarned: stats.pointsEarned };
}

export function creditSignup(code: string, newUserId: string): number {
  const referrerId = readRegistry()[code.toUpperCase()];
  if (!referrerId || referrerId === newUserId) return 0;

  let stats = getStats(referrerId);
  const check = canCreditNow(stats);
  stats = check.stats;

  if (check.ok) {
    stats.invitedCount += 1;
    stats.pointsEarned += SIGNUP_BONUS_REFERRER;
    stats.dailyCreditCount += 1;
    stats.weeklyCreditCount += 1;
    saveStats(referrerId, stats);
  } else {
    saveStats(referrerId, stats);
  }

  const origin: ReferralOrigin = { referrerId, activityBonusGranted: false };
  localStorage.setItem(ORIGIN_KEY_PREFIX + newUserId, JSON.stringify(origin));

  return SIGNUP_BONUS_FRIEND;
}

export function creditFirstActivity(userId: string): boolean {
  let origin: ReferralOrigin | null = null;
  try {
    const raw = localStorage.getItem(ORIGIN_KEY_PREFIX + userId);
    if (raw) origin = JSON.parse(raw);
  } catch {}

  if (!origin || origin.activityBonusGranted) return false;

  let stats = getStats(origin.referrerId);
  const check = canCreditNow(stats);
  stats = check.stats;

  if (!check.ok) {
    saveStats(origin.referrerId, stats);
    return false;
  }

  stats.pointsEarned += ACTIVITY_BONUS_REFERRER;
  stats.dailyCreditCount += 1;
  stats.weeklyCreditCount += 1;
  saveStats(origin.referrerId, stats);

  origin.activityBonusGranted = true;
  localStorage.setItem(ORIGIN_KEY_PREFIX + userId, JSON.stringify(origin));
  return true;
}
