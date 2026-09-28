import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface OnlineStatusResult {
  isOnline: boolean;
  lastSeenText: string;
}

/**
 * Parses diverse timestamp formats (Firestore Timestamp, Date, string ISO, millis) into a JS Date.
 */
export function parseTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  if (timestamp instanceof Date) {
    return isNaN(timestamp.getTime()) ? null : timestamp;
  }
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  if (typeof timestamp === 'string') {
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Calculates whether a user is currently online (active within 2.5 minutes)
 * and formats human-readable lastSeen text in Arabic or English.
 */
export function getOnlineStatus(
  lastActiveTimestamp: any,
  lang: string = 'ar'
): OnlineStatusResult {
  const isAr = lang === 'ar';
  const date = parseTimestampToDate(lastActiveTimestamp);

  if (!date) {
    return {
      isOnline: false,
      lastSeenText: isAr ? 'غير متصل' : 'Offline'
    };
  }

  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const thresholdMs = 2.5 * 60 * 1000; // 2.5 minutes in ms (150,000ms)

  // Within 2.5 minutes = Online Now
  if (diffMs <= thresholdMs) {
    return {
      isOnline: true,
      lastSeenText: isAr ? 'متصل الآن' : 'Online now'
    };
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Less than 60 minutes
  if (diffMinutes < 60) {
    return {
      isOnline: false,
      lastSeenText: isAr
        ? `آخر ظهور قبل ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : diffMinutes === 2 ? 'دقيقتين' : diffMinutes <= 10 ? 'دقائق' : 'دقيقة'}`
        : `Last seen ${diffMinutes}m ago`
    };
  }

  // Check if today or yesterday
  const nowDay = new Date();
  const isSameDay =
    date.getDate() === nowDay.getDate() &&
    date.getMonth() === nowDay.getMonth() &&
    date.getFullYear() === nowDay.getFullYear();

  const yesterday = new Date(nowDay);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeString = date.toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  if (isSameDay) {
    return {
      isOnline: false,
      lastSeenText: isAr
        ? `آخر ظهور اليوم الساعة ${timeString}`
        : `Last seen today at ${timeString}`
    };
  }

  if (isYesterday) {
    return {
      isOnline: false,
      lastSeenText: isAr
        ? `آخر ظهور أمس الساعة ${timeString}`
        : `Last seen yesterday at ${timeString}`
    };
  }

  if (diffDays < 7) {
    return {
      isOnline: false,
      lastSeenText: isAr
        ? `آخر ظهور منذ ${diffDays} ${diffDays === 1 ? 'يوم' : diffDays === 2 ? 'يومين' : diffDays <= 10 ? 'أيام' : 'يوماً'}`
        : `Last seen ${diffDays}d ago`
    };
  }

  // Older than a week: format full date
  const dateString = date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric'
  });

  return {
    isOnline: false,
    lastSeenText: isAr
      ? `آخر ظهور في ${dateString}`
      : `Last seen on ${dateString}`
  };
}

/**
 * Updates the user's lastActive timestamp in Firestore with serverTimestamp().
 * Completely skips anonymous and guest accounts to prevent permission errors.
 */
export async function updateUserPresence(uid?: string | null, isGuest: boolean = true): Promise<void> {
  if (!uid || isGuest || uid === 'guest' || uid === 'user_1' || !isFirebaseConfigured || !db) {
    return;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      lastActive: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    // Fail silently in background without impacting UX
  }
}
