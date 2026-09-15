import { 
  AppUser, 
  UserSubscription, 
  SubscriptionTier, 
  AIFeatureDefinition, 
  AI_FEATURE_CATALOG, 
  SUBSCRIPTION_PLANS 
} from '../types';

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function normalizeSubscription(user: AppUser): UserSubscription {
  const today = getTodayString();
  const sub = user.subscription || {
    tier: 'free',
    status: 'active',
    startDate: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    dailyRequestsUsed: 0,
    dailyLimit: SUBSCRIPTION_PLANS.free.dailyLimit,
    lastResetDate: today
  };

  // If last reset was on a previous day, auto reset daily counter
  if (sub.lastResetDate !== today) {
    sub.dailyRequestsUsed = 0;
    sub.lastResetDate = today;
  }

  // Ensure dailyLimit matches plan
  const plan = SUBSCRIPTION_PLANS[sub.tier] || SUBSCRIPTION_PLANS.free;
  sub.dailyLimit = plan.dailyLimit;

  return sub;
}

export function getFeatureDefinition(featureId: string): AIFeatureDefinition | undefined {
  return AI_FEATURE_CATALOG.find(f => f.id === featureId);
}

export function checkFeatureAccess(user: AppUser, featureId: string): {
  allowed: boolean;
  reason?: 'tier_required' | 'quota_exceeded';
  requiredTier?: SubscriptionTier;
  feature?: AIFeatureDefinition;
  messageAr: string;
  messageEn: string;
} {
  const sub = normalizeSubscription(user);
  const feature = getFeatureDefinition(featureId);

  // If feature definition not found, default to free chat check
  const minTier: SubscriptionTier = feature ? feature.minTier : 'free';

  // Check tier hierarchy: free < pro < ultra
  const tierLevels: Record<SubscriptionTier, number> = { free: 0, pro: 1, ultra: 2 };
  const userTierLevel = tierLevels[sub.tier] || 0;
  const requiredTierLevel = tierLevels[minTier] || 0;

  if (userTierLevel < requiredTierLevel) {
    return {
      allowed: false,
      reason: 'tier_required',
      requiredTier: minTier,
      feature,
      messageAr: `هذه الميزة المتقدمة تتطلب اشتراك ${SUBSCRIPTION_PLANS[minTier].nameAr}`,
      messageEn: `This advanced capability requires ${SUBSCRIPTION_PLANS[minTier].nameEn}`
    };
  }

  // Check daily quota limit
  if (sub.dailyRequestsUsed >= sub.dailyLimit) {
    return {
      allowed: false,
      reason: 'quota_exceeded',
      requiredTier: sub.tier === 'free' ? 'pro' : 'ultra',
      feature,
      messageAr: `لقد استهلكت رصيد الطلبات اليومية لخطة ${SUBSCRIPTION_PLANS[sub.tier].nameAr} (${sub.dailyLimit} طلبات). ترقية الخطة تمنحك استخداماً أوسع.`,
      messageEn: `You reached your daily limit for ${SUBSCRIPTION_PLANS[sub.tier].nameEn} (${sub.dailyLimit} requests). Upgrade to unlock higher usage limits.`
    };
  }

  return {
    allowed: true,
    feature,
    messageAr: 'مسموح',
    messageEn: 'Allowed'
  };
}

export function recordUsage(user: AppUser): AppUser {
  const sub = normalizeSubscription(user);
  const updatedSub: UserSubscription = {
    ...sub,
    dailyRequestsUsed: sub.dailyRequestsUsed + 1
  };

  return {
    ...user,
    subscription: updatedSub
  };
}

export function upgradeSubscription(user: AppUser, targetTier: SubscriptionTier): AppUser {
  const today = getTodayString();
  const plan = SUBSCRIPTION_PLANS[targetTier];

  const updatedSub: UserSubscription = {
    tier: targetTier,
    status: 'active',
    startDate: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    dailyRequestsUsed: 0,
    dailyLimit: plan.dailyLimit,
    lastResetDate: today
  };

  return {
    ...user,
    subscription: updatedSub
  };
}
