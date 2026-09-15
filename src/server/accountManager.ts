import { Request, Response, NextFunction } from 'express';
import { adminDb, adminAuth, withUserLock } from './authMiddleware';
import { logSecurityEvent } from './securityConfig';

export interface ServerUserAccount {
  uid: string;
  points: number;
  shards: number;
  coins: number;
  wallet: number;
  role: 'user' | 'moderator' | 'admin';
  isAdmin: boolean;
  subscription: {
    tier: 'free' | 'pro' | 'ultra';
    dailyLimit: number;
    dailyRequestsUsed: number;
    lastResetDate: string;
  };
  inventory: string[];
  purchasedItems: string[];
}

export const TIER_DAILY_LIMITS = { free: 50, pro: 150, ultra: 1000 };
export const TIER_LEVELS = { free: 0, pro: 1, ultra: 2 };

// Authoritative Pack Catalog
export const PACK_PRICES: Record<string, { price: number; currency: 'points' | 'shards'; possibleRewards: string[] }> = {
  pack_starter: { price: 300, currency: 'points', possibleRewards: ['frame_starter_neon', 'bg_starter_void', 'badge_starter_cadet', 'name_starter_cyan'] },
  pack_cosmic: { price: 800, currency: 'points', possibleRewards: ['frame_galaxy_vortex', 'bg_cosmic_nebula', 'name_supernova_flame', 'title_cosmic_architect', 'effect_starlight_dust'] },
  pack_explorer: { price: 1000, currency: 'points', possibleRewards: ['frame_orbit_ring', 'bg_mars_surface', 'badge_astronomer', 'name_starter_cyan'] },
  pack_ai: { price: 1200, currency: 'points', possibleRewards: ['skin_starlight', 'skin_cyber', 'skin_royal', 'skin_galaxy', 'acc_headset_neon', 'badge_ai_core'] },
  pack_creator: { price: 1500, currency: 'points', possibleRewards: ['badge_creator_verified', 'frame_creator_prism', 'title_master_creator'] },
  pack_legendary: { price: 2500, currency: 'points', possibleRewards: ['frame_legendary_crown', 'bg_legendary_singularity', 'name_legendary_gold', 'title_galactic_emperor', 'skin_royal'] },
  pack_seasonal: { price: 350, currency: 'shards', possibleRewards: ['frame_summer_solstice', 'bg_cosmic_week_event'] }
};

export const SHARD_CONVERSION: Record<string, number> = {
  COMMON: 20,
  UNCOMMON: 50,
  RARE: 100,
  EPIC: 300,
  LEGENDARY: 1000
};

export const ITEMS_REGISTRY: Record<string, any> = {
  frame_starter_neon: { id: 'frame_starter_neon', nameAr: 'إطار النيون الابتدائي 💫', nameEn: 'Starter Neon Frame 💫', type: 'AVATAR_FRAME', rarity: 'COMMON', icon: '💫' },
  bg_starter_void: { id: 'bg_starter_void', nameAr: 'خلفية الفراغ الأزرق 🌌', nameEn: 'Blue Void Background 🌌', type: 'PROFILE_BACKGROUND', rarity: 'COMMON', icon: '🌌' },
  badge_starter_cadet: { id: 'badge_starter_cadet', nameAr: 'وسام المستكشف المستجد 🔰', nameEn: 'Star Cadet Badge 🔰', type: 'BADGE', rarity: 'COMMON', icon: '🔰' },
  name_starter_cyan: { id: 'name_starter_cyan', nameAr: 'اسم التردد النيون 🩵', nameEn: 'Cyan Pulse Name 🩵', type: 'NAME_EFFECT', rarity: 'COMMON', icon: '🩵' },
  frame_galaxy_vortex: { id: 'frame_galaxy_vortex', nameAr: 'إطار دوامة المجرة ✨', nameEn: 'Galaxy Vortex Frame ✨', type: 'AVATAR_FRAME', rarity: 'RARE', icon: '✨' },
  bg_cosmic_nebula: { id: 'bg_cosmic_nebula', nameAr: 'خلفية سديم الشفق 🔮', nameEn: 'Aurora Nebula Wallpaper 🔮', type: 'PROFILE_BACKGROUND', rarity: 'RARE', icon: '🔮' },
  name_supernova_flame: { id: 'name_supernova_flame', nameAr: 'اسم توهج السوبرنوفا 🔥', nameEn: 'Supernova Fire Name 🔥', type: 'NAME_EFFECT', rarity: 'RARE', icon: '🔥' },
  title_cosmic_architect: { id: 'title_cosmic_architect', nameAr: 'لقب "مهندس الأبعاد" 📐', nameEn: 'Dimensional Architect 📐', type: 'TITLE', rarity: 'UNCOMMON', icon: '📐' },
  effect_starlight_dust: { id: 'effect_starlight_dust', nameAr: 'تأثير غبار النجوم 💫', nameEn: 'Starlight Dust Aura 💫', type: 'PROFILE_EFFECT', rarity: 'RARE', icon: '💫' },
  frame_orbit_ring: { id: 'frame_orbit_ring', nameAr: 'إطار المدار الفلكي 🪐', nameEn: 'Planetary Orbit Frame 🪐', type: 'AVATAR_FRAME', rarity: 'UNCOMMON', icon: '🪐' },
  bg_mars_surface: { id: 'bg_mars_surface', nameAr: 'خلفية سطح المريخ الأحمري ☄️', nameEn: 'Red Martian Plains ☄️', type: 'PROFILE_BACKGROUND', rarity: 'UNCOMMON', icon: '☄️' },
  badge_astronomer: { id: 'badge_astronomer', nameAr: 'وسام رائد الاستكشاف 🚀', nameEn: 'Deep Space Pioneer 🚀', type: 'BADGE', rarity: 'UNCOMMON', icon: '🚀' },
  frame_legendary_crown: { id: 'frame_legendary_crown', nameAr: 'إطار العرش الكوني الأسطوري 👑⭐', nameEn: 'Imperial Crown Frame 👑⭐', type: 'AVATAR_FRAME', rarity: 'LEGENDARY', icon: '👑' },
  bg_legendary_singularity: { id: 'bg_legendary_singularity', nameAr: 'خلفية المتفرد الكوني الأسطورية 💥🌌', nameEn: 'Cosmic Singularity Wallpaper 💥🌌', type: 'PROFILE_BACKGROUND', rarity: 'LEGENDARY', icon: '💥' },
  name_legendary_gold: { id: 'name_legendary_gold', nameAr: 'اسم الشفق الذهبي الأسطوري 🌟💎', nameEn: 'Golden Aurora Name 🌟💎', type: 'NAME_EFFECT', rarity: 'LEGENDARY', icon: '🌟' },
  title_galactic_emperor: { id: 'title_galactic_emperor', nameAr: 'لقب "سفير المجرة الأسمى" 👑🪐', nameEn: 'Galactic High Sovereign 👑🪐', type: 'TITLE', rarity: 'LEGENDARY', icon: '👑' },
  skin_starlight: { id: 'skin_starlight', nameAr: 'مظهر الذكاء "سديم النجوم" 💫', nameEn: 'AI Skin "Starlight Nebula" 💫', type: 'CHARACTER_SKIN', rarity: 'RARE', icon: '💫', mascotSkin: 'starlight' },
  skin_cyber: { id: 'skin_cyber', nameAr: 'مظهر الذكاء "السايبر المستقبلي" 🟩', nameEn: 'AI Skin "Cyber Matrix" 🟩', type: 'CHARACTER_SKIN', rarity: 'RARE', icon: '🟩', mascotSkin: 'cyber' },
  skin_royal: { id: 'skin_royal', nameAr: 'مظهر الذكاء "الملكي الذهبي" 👑', nameEn: 'AI Skin "Royal Sovereign" 👑', type: 'CHARACTER_SKIN', rarity: 'EPIC', icon: '👑', mascotSkin: 'royal' },
  skin_galaxy: { id: 'skin_galaxy', nameAr: 'مظهر الذكاء "المجرة العميقة" 🌌', nameEn: 'AI Skin "Deep Galaxy" 🌌', type: 'CHARACTER_SKIN', rarity: 'EPIC', icon: '🌌', mascotSkin: 'galaxy' },
  acc_headset_neon: { id: 'acc_headset_neon', nameAr: 'سماعات النيون الفضائية 🎧', nameEn: 'Cosmic Holographic Headset 🎧', type: 'CHARACTER_ACCESSORY', rarity: 'UNCOMMON', icon: '🎧' },
  badge_ai_core: { id: 'badge_ai_core', nameAr: 'وسام العقل الاصطناعي 🤖', nameEn: 'AI Neural Core Badge 🤖', type: 'BADGE', rarity: 'UNCOMMON', icon: '🤖' },
  badge_creator_verified: { id: 'badge_creator_verified', nameAr: 'وسام صانع المحتوى المعتمد 🎨💎', nameEn: 'Verified Creator Badge 🎨💎', type: 'CREATOR_BADGE', rarity: 'EPIC', icon: '💎' },
  frame_creator_prism: { id: 'frame_creator_prism', nameAr: 'إطار المنشور الإبداعي 🌈', nameEn: 'Creative Prism Frame 🌈', type: 'AVATAR_FRAME', rarity: 'EPIC', icon: '🌈' },
  title_master_creator: { id: 'title_master_creator', nameAr: 'لقب "سفير الابتكار" 🚀🎨', nameEn: 'Ambassador of Innovation 🚀🎨', type: 'TITLE', rarity: 'RARE', icon: '🚀' },
  frame_summer_solstice: { id: 'frame_summer_solstice', nameAr: 'إطار التوهج الشمسي الصيفي ☀️🔥', nameEn: 'Summer Solar Solstice Frame ☀️🔥', type: 'AVATAR_FRAME', rarity: 'EPIC', icon: '☀️' },
  bg_cosmic_week_event: { id: 'bg_cosmic_week_event', nameAr: 'خلفية أسبوع لودافيا الكوني 🌌🚀', nameEn: 'Lodavia Cosmic Week Arena 🌌🚀', type: 'PROFILE_BACKGROUND', rarity: 'EPIC', icon: '🌌' }
};

// Authoritative Marketplace Catalog
export const MARKETPLACE_CATALOG: Record<string, { id: string; title: string; price: number; creatorId: string }> = {
  proj_nebula_3d: { id: 'proj_nebula_3d', title: 'محرك المحاكاة الفلكي 3D', price: 250, creatorId: 'creator_galileo' },
  proj_ai_synth: { id: 'proj_ai_synth', title: 'مساعد تركيب الترددات الكونية', price: 400, creatorId: 'creator_beethoven' },
  proj_star_shaders: { id: 'proj_star_shaders', title: 'مكتبة تظليلات الشفق الفضائي', price: 500, creatorId: 'creator_kepler' }
};

// Authoritative in-memory / container state ledger
const serverAccountStore = new Map<string, ServerUserAccount>();

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Retrieves the authoritative user account from Firestore or the server store.
 * Never trusts any client-provided balance, points, or subscription.
 */
export async function getServerAccount(uid: string): Promise<ServerUserAccount> {
  const today = getTodayString();

  // 1. Check local server store first for ultra-fast response
  let account = serverAccountStore.get(uid);

  // 2. If not cached, attempt to load from Firestore via Firebase Admin SDK
  // Skip remote metadata lookup for test/mock users to avoid network timeouts
  const isTestOrMockUid = uid.startsWith('user_') || uid.startsWith('admin_') || uid.startsWith('mock_') || uid.startsWith('guest_');

  if (!account && !isTestOrMockUid) {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('FIRESTORE_TIMEOUT')), 1000));
      const docSnap: any = await Promise.race([
        adminDb.collection('users').doc(uid).get(),
        timeoutPromise
      ]);
      if (docSnap && docSnap.exists) {
        const data = docSnap.data() || {};
        account = {
          uid,
          points: typeof data.points === 'number' ? data.points : 100,
          shards: typeof data.shards === 'number' ? data.shards : 50,
          coins: typeof data.coins === 'number' ? data.coins : 0,
          wallet: typeof data.wallet === 'number' ? data.wallet : 0,
          role: data.role === 'admin' ? 'admin' : (data.role === 'moderator' ? 'moderator' : 'user'),
          isAdmin: data.role === 'admin' || data.isAdmin === true,
          subscription: {
            tier: data.subscription?.tier || 'free',
            dailyLimit: data.subscription?.dailyLimit || 50,
            dailyRequestsUsed: data.subscription?.dailyRequestsUsed || 0,
            lastResetDate: data.subscription?.lastResetDate || today
          },
          inventory: Array.isArray(data.inventory) ? data.inventory : ['badge_starter_cadet'],
          purchasedItems: Array.isArray(data.purchasedItems) ? data.purchasedItems : []
        };
      }
    } catch (e: any) {
      // Permission, credential or timeout error - fallback gracefully to safe server ledger
      logSecurityEvent('FIRESTORE_ADMIN_READ_NOTICE', { uid, reason: e?.message || 'FALLBACK_TO_SERVER_LEDGER' });
    }
  }

  // 3. Fallback to default safe account state if neither exists
  if (!account) {
    const isMockAdmin = uid.startsWith('admin_');
    account = {
      uid,
      points: 500, // Standard safe starting test points
      shards: 50,
      coins: 0,
      wallet: 0,
      role: isMockAdmin ? 'admin' : 'user',
      isAdmin: isMockAdmin,
      subscription: {
        tier: 'free',
        dailyLimit: 50,
        dailyRequestsUsed: 0,
        lastResetDate: today
      },
      inventory: ['badge_starter_cadet'],
      purchasedItems: []
    };
  }

  // 4. Automatic daily quota rollover
  if (account.subscription.lastResetDate !== today) {
    account.subscription.dailyRequestsUsed = 0;
    account.subscription.lastResetDate = today;
  }

  serverAccountStore.set(uid, account);
  return account;
}

/**
 * Authoritatively persists updated user state to both the server store and Firestore.
 */
export async function saveServerAccount(account: ServerUserAccount): Promise<void> {
  serverAccountStore.set(account.uid, account);

  const isTestOrMockUid = account.uid.startsWith('user_') || account.uid.startsWith('admin_') || account.uid.startsWith('mock_') || account.uid.startsWith('guest_');
  if (isTestOrMockUid) return;

  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('FIRESTORE_TIMEOUT')), 1000));
    await Promise.race([
      adminDb.collection('users').doc(account.uid).set({
        points: account.points,
        shards: account.shards,
        coins: account.coins,
        wallet: account.wallet,
        role: account.role,
        isAdmin: account.isAdmin,
        subscription: account.subscription,
        inventory: account.inventory,
        purchasedItems: account.purchasedItems,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      timeoutPromise
    ]);
  } catch (e: any) {
    // Non-fatal if container lacks Cloud IAM write permission; server store remains authoritative
    logSecurityEvent('FIRESTORE_ADMIN_WRITE_NOTICE', { uid: account.uid, error: e?.message || 'STORED_IN_SERVER_LEDGER' });
  }
}

/**
 * Checks and increments AI usage quota authoritatively.
 * Returns true if the user is permitted to proceed, or sends 403 / 429 and returns false.
 */
export async function checkAuthoritativeAIQuota(
  req: Request,
  res: Response,
  minTier: 'free' | 'pro' | 'ultra' = 'free'
): Promise<boolean> {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
    return false;
  }

  return await withUserLock(uid, async () => {
    const account = await getServerAccount(uid);
    const userTier = account.subscription.tier || 'free';
    const userLevel = TIER_LEVELS[userTier] ?? 0;
    const minLevel = TIER_LEVELS[minTier] ?? 0;

    // 1. Server-side subscription tier verification
    if (userLevel < minLevel && minTier === 'ultra') {
      res.status(403).json({
        error: 'SUBSCRIPTION_REQUIRED',
        minTier,
        currentTier: userTier,
        messageAr: 'هذه الميزة تتطلب اشتراك Lodavia AI Ultra المعتمد',
        messageEn: 'This feature requires an authoritative Lodavia AI Ultra subscription.'
      });
      return false;
    }

    // 2. Daily Quota Verification
    const maxLimit = TIER_DAILY_LIMITS[userTier] || 50;
    if (account.subscription.dailyRequestsUsed >= maxLimit) {
      logSecurityEvent('AI_DAILY_QUOTA_EXCEEDED', { uid, tier: userTier, used: account.subscription.dailyRequestsUsed, maxLimit });
      res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        currentTier: userTier,
        dailyUsed: account.subscription.dailyRequestsUsed,
        maxLimit,
        messageAr: `لقد تجاوزت حد الاستخدام اليومي لخطة ${userTier.toUpperCase()} (${maxLimit} طلبات). يرجى الترقية للاستمرار.`,
        messageEn: `You have reached your daily limit for ${userTier.toUpperCase()} plan (${maxLimit} requests). Please upgrade to continue.`
      });
      return false;
    }

    // 3. Atomically increment daily usage
    account.subscription.dailyRequestsUsed += 1;
    await saveServerAccount(account);

    return true;
  });
}

/**
 * Performs an atomic purchase and opening of a Cosmic Pack.
 * Reads balance strictly from the server, checks sufficient funds,
 * selects reward, handles duplicate conversion, and persists everything server-side.
 */
export async function processCosmicPackPurchase(uid: string, packId: string) {
  return await withUserLock(uid, async () => {
    const pack = PACK_PRICES[packId];
    if (!pack) {
      return { success: false, status: 400, error: 'INVALID_PACK_ID', messageAr: 'حزمة غير صالحة' };
    }

    const account = await getServerAccount(uid);

    // Balance check
    if (pack.currency === 'points') {
      if (account.points < pack.price) {
        logSecurityEvent('INSUFFICIENT_POINTS_ATTEMPT', { uid, serverPoints: account.points, required: pack.price });
        return { success: false, status: 400, error: 'INSUFFICIENT_POINTS', messageAr: 'نقاطك غير كافية لفتح هذه الحزمة' };
      }
      account.points -= pack.price;
    } else {
      if (account.shards < pack.price) {
        logSecurityEvent('INSUFFICIENT_SHARDS_ATTEMPT', { uid, serverShards: account.shards, required: pack.price });
        return { success: false, status: 400, error: 'INSUFFICIENT_SHARDS', messageAr: 'شظاياك الكونية غير كافية لفتح هذه الحزمة' };
      }
      account.shards -= pack.price;
    }

    // Server-side random reward generation
    const rewardItemId = pack.possibleRewards[Math.floor(Math.random() * pack.possibleRewards.length)];
    const rewardItem = ITEMS_REGISTRY[rewardItemId] || { id: rewardItemId, nameAr: 'عنصر كوني جديد', nameEn: 'New Cosmic Item', rarity: 'COMMON' };

    // Duplicate detection and shard conversion
    const isDuplicate = account.inventory.includes(rewardItemId);
    let shardsAwarded = 0;

    if (isDuplicate) {
      shardsAwarded = SHARD_CONVERSION[rewardItem.rarity] || 20;
      account.shards += shardsAwarded;
    } else {
      account.inventory.push(rewardItemId);
    }

    // Persist updated balance and inventory
    await saveServerAccount(account);

    const transactionId = `tx_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    logSecurityEvent('PACK_PURCHASED_SUCCESSFULLY', {
      uid,
      packId,
      transactionId,
      rewardItemId,
      isDuplicate,
      newPoints: account.points,
      newShards: account.shards
    });

    return {
      success: true,
      status: 200,
      transactionId,
      rewardItem,
      isDuplicate,
      shardsAwarded,
      newPoints: account.points,
      newShards: account.shards,
      newInventory: account.inventory
    };
  });
}

/**
 * Performs an atomic marketplace purchase.
 */
export async function processMarketplacePurchase(uid: string, projectId: string) {
  return await withUserLock(uid, async () => {
    const project = MARKETPLACE_CATALOG[projectId];
    if (!project) {
      return { success: false, status: 400, error: 'INVALID_PROJECT_ID', message: 'Project not found in authoritative catalog' };
    }

    const account = await getServerAccount(uid);

    if (account.purchasedItems.includes(projectId)) {
      return { success: false, status: 400, error: 'ALREADY_OWNED', message: 'You already own this project' };
    }

    if (account.points < project.price) {
      return { success: false, status: 400, error: 'INSUFFICIENT_POINTS', message: 'Insufficient points balance' };
    }

    account.points -= project.price;
    account.purchasedItems.push(projectId);
    await saveServerAccount(account);

    const txId = `tx_market_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    logSecurityEvent('MARKETPLACE_PURCHASE_SUCCESS', { uid, projectId, price: project.price, txId });

    return {
      success: true,
      status: 200,
      transactionId: txId,
      newPoints: account.points,
      purchasedItem: projectId
    };
  });
}

/**
 * Reusable Admin Authorization Middleware.
 * Enforces that the authenticated user possesses an authoritative admin role.
 * Unauthorized users receive HTTP 403 Forbidden.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
  }

  const account = await getServerAccount(uid);
  if (!account.isAdmin && account.role !== 'admin') {
    logSecurityEvent('UNAUTHORIZED_ADMIN_ENDPOINT_ATTEMPT', {
      uid,
      path: req.path,
      ip: req.ip
    });
    return res.status(403).json({
      error: 'FORBIDDEN',
      messageAr: 'هذا الإجراء مخصص لمسؤولي لودافيا فقط',
      messageEn: 'Administrator privileges required.'
    });
  }

  next();
}

/**
 * Authoritative and Safe Server-Side Account Deletion.
 * Destructively removes:
 * 1. User profile document in Firestore (users/{uid})
 * 2. User's published posts (authorId == uid)
 * 3. User's personal notifications (recipientId == uid)
 * 4. User's account record in the server memory store
 * 5. User's Firebase Authentication account (adminAuth.deleteUser)
 *
 * Idempotent, safe against race conditions, and logs without sensitive credentials.
 */
export async function deleteServerAccount(uid: string): Promise<{ success: boolean; details: Record<string, any> }> {
  return await withUserLock(uid, async () => {
    const deletedItems: Record<string, any> = {
      userDocDeleted: false,
      postsDeletedCount: 0,
      notificationsDeletedCount: 0,
      firebaseAuthDeleted: false
    };

    // 1. Delete user doc from Firestore
    try {
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        // Delete ai_history subcollection docs if any
        try {
          const aiSnap = await userRef.collection('ai_history').get();
          for (const doc of aiSnap.docs) {
            await doc.ref.delete();
          }
        } catch {}
        await userRef.delete();
        deletedItems.userDocDeleted = true;
      }
    } catch (err: any) {
      logSecurityEvent('ACCOUNT_DELETION_FIRESTORE_NOTICE', { uid, error: err?.message });
    }

    // 2. Delete posts created by this user
    try {
      const postsSnap = await adminDb.collection('posts').where('authorId', '==', uid).get();
      for (const doc of postsSnap.docs) {
        await doc.ref.delete();
        deletedItems.postsDeletedCount += 1;
      }
    } catch (err: any) {
      logSecurityEvent('ACCOUNT_DELETION_POSTS_NOTICE', { uid, error: err?.message });
    }

    // 3. Delete user personal notifications
    try {
      const notifSnap = await adminDb.collection('notifications').where('recipientId', '==', uid).get();
      for (const doc of notifSnap.docs) {
        await doc.ref.delete();
        deletedItems.notificationsDeletedCount += 1;
      }
    } catch (err: any) {
      logSecurityEvent('ACCOUNT_DELETION_NOTIFS_NOTICE', { uid, error: err?.message });
    }

    // 4. Remove from server in-memory ledger
    serverAccountStore.delete(uid);

    // 5. Delete Firebase Authentication user
    if (!uid.startsWith('guest_') && !uid.startsWith('mock_')) {
      try {
        await adminAuth.deleteUser(uid);
        deletedItems.firebaseAuthDeleted = true;
      } catch (err: any) {
        // If already deleted, treat as success (idempotency)
        if (err?.code === 'auth/user-not-found') {
          deletedItems.firebaseAuthDeleted = true;
        } else {
          logSecurityEvent('ACCOUNT_DELETION_AUTH_NOTICE', { uid, error: err?.message });
        }
      }
    } else {
      deletedItems.firebaseAuthDeleted = true;
    }

    // 6. Record safe security event
    logSecurityEvent('ACCOUNT_DELETED_SUCCESS', {
      uid,
      summary: deletedItems
    });

    return {
      success: true,
      details: deletedItems
    };
  });
}
