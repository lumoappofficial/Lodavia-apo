import { 
  auth, 
  db, 
  isFirebaseConfigured 
} from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  OAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { AppUser } from '../types';
import { initialUser } from '../data';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
};

const syncOAuthUser = async (fbUser: any, providerType: 'google' | 'apple'): Promise<AppUser> => {
  let userDoc;
  try {
    userDoc = await getDoc(doc(db, 'users', fbUser.uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
  }

  if (userDoc && userDoc.exists()) {
    return userDoc.data() as AppUser;
  } else {
    const isGoogle = providerType === 'google';
    const newUser: AppUser = {
      id: fbUser.uid,
      name: fbUser.displayName || (isGoogle ? 'مستكشف Lodavia' : 'مستخدم آبل الكوني'),
      email: fbUser.email || '',
      avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      bio: isGoogle ? 'تسجيل دخول عبر جوجل! مرحباً بك 🌌' : 'مسجل عبر منصة آبل العريقة! 🪐',
      country: 'المملكة العربية السعودية',
      language: 'العربية',
      interests: isGoogle ? ['برمجة', 'ذكاء اصطناعي'] : ['تصميم', 'برمجة'],
      achievements: isGoogle 
        ? [{ id: 'ach_google', title: 'الربط الرقمي', description: 'ربط الحساب بجوجل بنجاح', icon: '🌐' }]
        : [{ id: 'ach_apple', title: 'مبدع التفاحة الكونية', description: 'ربط حساب آبل بنجاح', icon: '🍎' }],
      joinedCommunities: ['comm_prog'],
      enrolledCourses: [],
      followersCount: 1,
      followingCount: isGoogle ? 0 : 1,
      points: 150,
      purchasedItems: []
    };
    try {
      await setDoc(doc(db, 'users', fbUser.uid), newUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
    }
    return newUser;
  }
};

export const authService = {
  // Email/Password Log In
  login: async (email: string, password: string): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
        }

        if (userDoc && userDoc.exists()) {
          const loadedUser = userDoc.data() as AppUser;
          return {
            ...loadedUser,
            emailVerified: fbUser.emailVerified,
            isAnonymous: fbUser.isAnonymous
          };
        } else {
          // Create user doc if not found
          const newUser: AppUser = {
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0],
            email: email,
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            bio: 'مرحباً بك في فضائي الإبداعي على Lodavia! 🚀',
            country: 'المملكة العربية السعودية',
            language: 'العربية',
            interests: ['برمجة', 'ذكاء اصطناعي'],
            achievements: [{ id: 'ach_1', title: 'عضو مستكشف', description: 'انضمام ناجح إلى المنصة', icon: '✨' }],
            joinedCommunities: ['comm_prog'],
            enrolledCourses: [],
            followersCount: 0,
            followingCount: 0,
            points: 100,
            purchasedItems: [],
            emailVerified: fbUser.emailVerified,
            isAnonymous: fbUser.isAnonymous
          };
          try {
            await setDoc(doc(db, 'users', fbUser.uid), newUser);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
          }
          return newUser;
        }
      } catch (err: any) {
        throw new Error(err.message || "خطأ في تسجيل الدخول.");
      }
    } else {
      // Offline fallback
      const users = storage.load<Record<string, AppUser>>('lumo_users', {});
      const matchedUser = Object.values(users).find((u: any) => u.email === email) as AppUser | undefined;
      if (matchedUser) {
        return matchedUser;
      }
      throw new Error("خطأ في تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
  },

  // Email/Password Registration with automatic Email Verification
  signup: async (email: string, name: string, phone: string, password: string, country: string, language: string, interests: string[]): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
        // Authoritatively send Firebase email verification link to user's registered inbox
        try {
          await sendEmailVerification(fbUser);
        } catch (vErr) {
          console.warn("[Auth] sendEmailVerification notice:", vErr);
        }

        const newUser: AppUser = {
          id: fbUser.uid,
          name: name,
          email: email,
          phone: phone,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          bio: 'مبدع كوني يبحث عن الإلهام والتطوير الرقمي 🌌',
          country: country,
          language: language,
          interests: interests,
          achievements: [{ id: 'ach_1', title: 'صانع الحساب', description: 'بدء الرحلة الرقمية بنجاح', icon: '🎉' }],
          joinedCommunities: ['comm_prog'],
          enrolledCourses: [],
          followersCount: 0,
          followingCount: 0,
          points: 150, // Welcome points
          purchasedItems: [],
          emailVerified: false,
          isAnonymous: false
        };
        
        try {
          await setDoc(doc(db, 'users', fbUser.uid), newUser);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
        }
        return newUser;
      } catch (err: any) {
        throw new Error(err.message || "خطأ في إنشاء الحساب.");
      }
    } else {
      // Offline fallback
      const users = storage.load<Record<string, AppUser>>('lumo_users', {});
      const existingUser = Object.values(users).find((u: any) => u.email === email);
      if (existingUser) {
        throw new Error("البريد الإلكتروني مسجل بالفعل!");
      }
      const newId = `user_${Date.now()}`;
      const newUser: AppUser = {
        id: newId,
        name: name,
        email: email,
        phone: phone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        bio: 'مبدع كوني يبحث عن الإلهام والتطوير الرقمي 🌌',
        country: country,
        language: language,
        interests: interests,
        achievements: [{ id: 'ach_1', title: 'صانع الحساب', description: 'بدء الرحلة الرقمية بنجاح', icon: '🎉' }],
        joinedCommunities: ['comm_prog'],
        enrolledCourses: [],
        followersCount: 0,
        followingCount: 0,
        points: 150,
        purchasedItems: []
      };
      users[newId] = newUser;
      storage.save('lumo_users', users);
      return newUser;
    }
  },

  // Google Sign In
  signInWithGoogle: async (): Promise<AppUser | void> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        if (isMobileBrowser()) {
          await signInWithRedirect(auth, provider);
          return;
        }
        const result = await signInWithPopup(auth, provider);
        return await syncOAuthUser(result.user, 'google');
      } catch (err: any) {
        throw new Error(err.message || "خطأ في تسجيل الدخول بـ Google.");
      }
    } else {
      // Mock Google Log In
      const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
      const mockGoogleId = 'user_google';
      const newUser: AppUser = {
        id: mockGoogleId,
        name: 'ضيف جوجل المميز',
        email: 'google.guest@lodavia.com',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        bio: 'تسجيل دخول عبر جوجل (تجريبي)! مرحباً بك 🌌',
        country: 'المملكة العربية السعودية',
        language: 'العربية',
        interests: ['ألعاب', 'موسيقى'],
        achievements: [{ id: 'ach_google', title: 'الربط الرقمي', description: 'ربط الحساب بجوجل بنجاح', icon: '🌐' }],
        joinedCommunities: ['comm_prog'],
        enrolledCourses: [],
        followersCount: 15,
        followingCount: 5,
        points: 200,
        purchasedItems: []
      };
      users[mockGoogleId] = newUser;
      storage.save('lumo_users', users);
      return newUser;
    }
  },

  // Apple Sign In
  signInWithApple: async (): Promise<AppUser | void> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new OAuthProvider('apple.com');
        if (isMobileBrowser()) {
          await signInWithRedirect(auth, provider);
          return;
        }
        const result = await signInWithPopup(auth, provider);
        return await syncOAuthUser(result.user, 'apple');
      } catch (err: any) {
        throw new Error(err.message || "خطأ في تسجيل الدخول بـ Apple.");
      }
    } else {
      // Mock Apple Log In
      const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
      const mockAppleId = 'user_apple';
      const newUser: AppUser = {
        id: mockAppleId,
        name: 'مبدع آبل التجريبي',
        email: 'apple.guest@lodavia.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        bio: 'تم تسجيل الدخول بنجاح عبر نظام آبل التجريبي 🍎🌌',
        country: 'الإمارات العربية المتحدة',
        language: 'العربية',
        interests: ['برمجة', 'تصميم'],
        achievements: [{ id: 'ach_apple', title: 'مبدع التفاحة الكونية', description: 'ربط حساب آبل بنجاح', icon: '🍎' }],
        joinedCommunities: ['comm_prog'],
        enrolledCourses: [],
        followersCount: 42,
        followingCount: 12,
        points: 250,
        purchasedItems: []
      };
      users[mockAppleId] = newUser;
      storage.save('lodavia_users', users);
      return newUser;
    }
  },

  // Complete Pending Redirect Sign-In (For Mobile Browser Return Flow)
  completeRedirectSignIn: async (): Promise<AppUser | null> => {
    if (!isFirebaseConfigured || !auth) return null;
    try {
      const result = await getRedirectResult(auth);
      if (!result || !result.user) {
        return null;
      }
      const providerId = result.providerId || result.user.providerData?.[0]?.providerId || '';
      const providerType = providerId.includes('apple') ? 'apple' : 'google';
      return await syncOAuthUser(result.user, providerType);
    } catch (err: any) {
      throw new Error(err.message || "خطأ أثناء إكمال تسجيل الدخول عبر التوجيه.");
    }
  },

  // Phone Authentication: reCAPTCHA initialization
  setupRecaptcha: (containerId: string): RecaptchaVerifier | null => {
    if (!isFirebaseConfigured || !auth) return null;
    try {
      if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {}
      }
      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // reCAPTCHA expired
        }
      });
      if (typeof window !== 'undefined') {
        (window as any).recaptchaVerifier = verifier;
      }
      return verifier;
    } catch (err) {
      console.warn("[Auth] Failed to initialize reCAPTCHA verifier:", err);
      return null;
    }
  },

  // Phone Authentication: Send real Firebase SMS Verification Code
  sendPhoneOtp: async (phone: string, appVerifier?: any): Promise<ConfirmationResult> => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("خدمة المصادقة عبر الهاتف تتطلب إعدادات Firebase النشطة.");
    }
    try {
      const verifier = appVerifier || (typeof window !== 'undefined' ? (window as any).recaptchaVerifier : null);
      if (!verifier) {
        throw new Error("يتطلب إرسال رمز التحقق تهيئة reCAPTCHA أولاً.");
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      return confirmationResult;
    } catch (err: any) {
      if (err?.code === 'auth/billing-not-enabled') {
        throw new Error("المصادقة عبر الرسائل القصيرة (SMS) تتطلب خطة Firebase Blaze أو تسجيل أرقام هواتف اختبار في وحدة تحكم Firebase.");
      }
      if (err?.code === 'auth/operation-not-allowed') {
        throw new Error("تسجيل الدخول بالهاتف غير مفعّل في لوحة Firebase Console (Sign-in method -> Phone).");
      }
      if (err?.code === 'auth/invalid-phone-number') {
        throw new Error("رقم الهاتف غير صحيح. يرجى إدخال الرقم بالصيغة الدولية الكاملة مثل (+966...).");
      }
      if (err?.code === 'auth/quota-exceeded') {
        throw new Error("تم تجاوز الحصة اليومية للرسائل النصية. يرجى المحاولة غداً.");
      }
      throw new Error(err?.message || "فشل إرسال رمز التحقق إلى الهاتف.");
    }
  },

  // Phone Authentication: Confirm SMS Code and complete Sign-In
  verifyPhoneOtpAndSignIn: async (confirmationResult: ConfirmationResult, code: string): Promise<AppUser> => {
    if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
      throw new Error("جلسة التحقق من الهاتف غير صالحة. يرجى إعادة إرسال الرمز.");
    }
    try {
      const userCredential = await confirmationResult.confirm(code);
      const fbUser = userCredential.user;

      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
      }

      if (userDoc && userDoc.exists()) {
        const loaded = userDoc.data() as AppUser;
        return {
          ...loaded,
          phone: fbUser.phoneNumber || loaded.phone,
          emailVerified: true
        };
      }

      const phoneStr = fbUser.phoneNumber || '';
      const newUser: AppUser = {
        id: fbUser.uid,
        name: `مستكشف رقم ${phoneStr.slice(-4) || 'جديد'}`,
        email: `${phoneStr.replace(/[^0-9]/g, '') || fbUser.uid}@lodavia-phone.com`,
        phone: phoneStr,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        bio: 'دخلت فضاء Lodavia الآمن عبر المصادقة الرقمية للهاتف 📱🚀',
        country: 'المملكة العربية السعودية',
        language: 'العربية',
        interests: ['ألعاب', 'برمجة'],
        achievements: [{ id: 'ach_phone', title: 'المصادقة السريعة', description: 'دخول آمن عبر الهاتف', icon: '📱' }],
        joinedCommunities: ['comm_prog'],
        enrolledCourses: [],
        followersCount: 0,
        followingCount: 0,
        points: 100,
        purchasedItems: [],
        emailVerified: true,
        isAnonymous: false
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      return newUser;
    } catch (err: any) {
      if (err?.code === 'auth/invalid-verification-code') {
        throw new Error("رمز التحقق غير صحيح. يرجى مراجعة الرمز المدخل.");
      }
      if (err?.code === 'auth/code-expired') {
        throw new Error("انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.");
      }
      throw new Error(err?.message || "فشل تأكيد رمز التحقق.");
    }
  },

  // Phone Authentication: Legacy or Test Direct Sign-In fallback
  signInWithPhone: async (phone: string): Promise<AppUser> => {
    // If Firebase is available, notify that SMS OTP verification is standard
    const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
    const matchedUser = Object.values(users).find((u: any) => u.phone === phone) as AppUser | undefined;
    if (matchedUser) {
      return matchedUser;
    }
    const newId = `user_phone_${Date.now()}`;
    const newUser: AppUser = {
      id: newId,
      name: `مستكشف رقم ${phone.slice(-4)}`,
      email: `${phone.replace(/\s+/g, '')}@lodavia-phone.com`,
      phone: phone,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      bio: 'دخلت فضاء Lodavia الآمن عبر المصادقة الرقمية للهاتف 📱🚀',
      country: 'المملكة العربية السعودية',
      language: 'العربية',
      interests: ['ألعاب', 'برمجة'],
      achievements: [{ id: 'ach_phone', title: 'المصادقة السريعة', description: 'دخول آمن عبر الهاتف', icon: '📱' }],
      joinedCommunities: ['comm_prog'],
      enrolledCourses: [],
      followersCount: 0,
      followingCount: 0,
      points: 100,
      purchasedItems: [],
      emailVerified: true
    };
    users[newId] = newUser;
    storage.save('lodavia_users', users);
    
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', newId), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${newId}`);
      }
    }
    return newUser;
  },

  // Resend Email Verification link with rate-limiting cooldown
  resendVerificationEmail: async (): Promise<{ success: boolean; messageAr: string; messageEn: string }> => {
    if (!auth?.currentUser) {
      throw new Error("لا يوجد مستخدم مسجل حالياً.");
    }
    if (auth.currentUser.emailVerified) {
      return {
        success: true,
        messageAr: "البريد الإلكتروني مفعل بالفعل! ✨",
        messageEn: "Email is already verified! ✨"
      };
    }
    const lastSentKey = 'lodavia_last_email_verification_sent';
    const lastSent = Number(sessionStorage?.getItem(lastSentKey) || 0);
    const now = Date.now();
    const elapsed = Math.floor((now - lastSent) / 1000);
    if (elapsed < 60) {
      const remaining = 60 - elapsed;
      throw new Error(`يرجى الانتظار ${remaining} ثانية قبل إعادة إرسال رابط التفعيل.`);
    }

    try {
      await sendEmailVerification(auth.currentUser);
      sessionStorage?.setItem(lastSentKey, String(now));
      return {
        success: true,
        messageAr: "تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني بنجاح 📧",
        messageEn: "A new verification link has been sent to your email 📧"
      };
    } catch (err: any) {
      if (err?.code === 'auth/too-many-requests') {
        throw new Error("تم تجاوز عدد المحاولات المسموح بها مؤقتاً. يرجى الانتظار بضع دقائق.");
      }
      throw new Error(err?.message || "تعذر إرسال رابط التفعيل.");
    }
  },

  // Check Email Verification status from Firebase
  checkEmailVerification: async (): Promise<boolean> => {
    if (!auth?.currentUser) return false;
    try {
      await auth.currentUser.reload();
      return Boolean(auth.currentUser.emailVerified);
    } catch (err) {
      console.warn("[Auth] checkEmailVerification error:", err);
      return false;
    }
  },

  // Change Password with Reauthentication
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!auth?.currentUser) {
      throw new Error("لا يوجد مستخدم مسجل حالياً.");
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error("يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.");
    }

    // Re-authenticate user if email credentials exist
    if (auth.currentUser.email) {
      try {
        const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, cred);
      } catch (reauthErr: any) {
        if (reauthErr?.code === 'auth/wrong-password' || reauthErr?.code === 'auth/invalid-credential') {
          throw new Error("كلمة المرور الحالية غير صحيحة.");
        }
        throw new Error("فشل تأكيد الهوية. يرجى التحقق من كلمة المرور الحالية.");
      }
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
        throw new Error("تتطلب هذه العملية إعادة تسجيل الدخول حديثاً لتأكيد هويتك.");
      }
      throw new Error(err?.message || "فشل تحديث كلمة المرور.");
    }
  },

  // Anonymous Guest Mode
  signInAsGuest: async (): Promise<AppUser> => {
    const fallbackGuestId = `guest_${Date.now()}`;
    const defaultGuestUser: AppUser = {
      id: fallbackGuestId,
      name: 'مستكشف مجهول 🛸',
      email: 'guest@lodavia.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      bio: 'أطوف حول مدارات Lodavia في وضع التخفي الرقمي الكوني.',
      country: 'الكون المفتوح',
      language: 'العربية',
      interests: ['ذكاء اصطناعي', 'فلسفة'],
      achievements: [{ id: 'ach_guest', title: 'طاقة مجهولة', description: 'تصفح المنصة دون أي قيود', icon: '🛸' }],
      joinedCommunities: ['comm_prog'],
      enrolledCourses: [],
      followersCount: 0,
      followingCount: 0,
      points: 50,
      purchasedItems: [],
      isAnonymous: true,
      emailVerified: false
    };

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInAnonymously(auth);
        const fbUser = userCredential.user;
        const newUser: AppUser = {
          ...defaultGuestUser,
          id: fbUser.uid,
        };
        try {
          if (db) {
            await setDoc(doc(db, 'users', fbUser.uid), newUser);
          }
        } catch (dbErr) {
          console.warn("Firestore error saving guest user document (continuing with local guest):", dbErr);
        }
        const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
        users[newUser.id] = newUser;
        storage.save('lodavia_users', users);
        storage.save('lodavia_current_user', newUser);
        return newUser;
      } catch (err: any) {
        console.warn("Firebase anonymous auth failed, proceeding with local guest session:", err);
      }
    }

    // Local storage fallback
    const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
    users[defaultGuestUser.id] = defaultGuestUser;
    storage.save('lodavia_users', users);
    storage.save('lodavia_current_user', defaultGuestUser);
    return defaultGuestUser;
  },

  // Password Reset with anti-enumeration protection
  resetPassword: async (email: string): Promise<void> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      throw new Error("يرجى إدخال بريد إلكتروني صالح.");
    }

    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
      } catch (err: any) {
        // Silently catch auth/user-not-found or invalid credentials to prevent account enumeration
        if (
          err?.code === 'auth/user-not-found' ||
          err?.code === 'auth/invalid-email' ||
          err?.code === 'auth/invalid-credential'
        ) {
          // Account enumeration defense: return silently without leaking whether account exists
          return;
        }
        if (err?.code === 'auth/too-many-requests') {
          throw new Error("تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة بعد قليل.");
        }
        throw new Error("حدث خطأ أثناء إرسال رابط استعادة كلمة المرور.");
      }
    }
  },

  // Real Destructive Account Deletion
  deleteAccount: async (currentPassword?: string): Promise<void> => {
    const currentUser = auth?.currentUser;

    // 1. Re-authenticate if user signed in with email/password and password provided
    if (currentUser && currentUser.email && currentPassword) {
      try {
        const cred = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, cred);
      } catch (reauthErr: any) {
        if (reauthErr?.code === 'auth/wrong-password' || reauthErr?.code === 'auth/invalid-credential') {
          throw new Error("كلمة المرور الحالية غير صحيحة لتأكيد حذف الحساب.");
        }
      }
    }

    // 2. Call server-authoritative deletion endpoint
    try {
      let token = '';
      if (currentUser) {
        token = await currentUser.getIdToken(true);
      }

      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ confirmDelete: true })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.error === 'REAUTHENTICATION_REQUIRED') {
          throw new Error("تتطلب عملية حذف الحساب تسجيل دخول حديث لتأكيد الهوية.");
        }
        throw new Error(errData.messageAr || errData.messageEn || "فشل حذف بيانات الحساب على الخادم.");
      }
    } catch (serverErr: any) {
      console.warn("[Auth] Notice from server deletion:", serverErr?.message);
    }

    // 3. Delete Firebase Auth user if still exists
    if (currentUser) {
      try {
        await deleteUser(currentUser);
      } catch (deleteErr: any) {
        if (deleteErr?.code === 'auth/requires-recent-login') {
          throw new Error("تتطلب عملية الحذف تسجيل دخول حديث لتأكيد هويتك.");
        }
      }
    }

    // 4. Invalidate local session & clear private storage
    await authService.logout();
    try {
      localStorage.removeItem('lodavia_current_user');
      localStorage.removeItem('lumo_current_user');
      localStorage.removeItem('lodavia_chats');
      localStorage.removeItem('lumo_chats');
    } catch {}
  },

  logout: async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("[Auth] Sign out notice:", e);
      }
    }
    try {
      localStorage.removeItem('lodavia_current_user');
      localStorage.removeItem('lumo_current_user');
    } catch {}
  }
};
