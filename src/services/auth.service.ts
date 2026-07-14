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
  GoogleAuthProvider, 
  OAuthProvider,
  signInAnonymously
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

        if (userDoc.exists()) {
          return userDoc.data() as AppUser;
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
            purchasedItems: []
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

  // Email/Password Registration
  signup: async (email: string, name: string, phone: string, password: string, country: string, language: string, interests: string[]): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        
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
          purchasedItems: []
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
  signInWithGoogle: async (): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
        }

        if (userDoc.exists()) {
          return userDoc.data() as AppUser;
        } else {
          const newUser: AppUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'مستكشف Lodavia',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            bio: 'تسجيل دخول عبر جوجل! مرحباً بك 🌌',
            country: 'المملكة العربية السعودية',
            language: 'العربية',
            interests: ['برمجة', 'ذكاء اصطناعي'],
            achievements: [{ id: 'ach_google', title: 'الربط الرقمي', description: 'ربط الحساب بجوجل بنجاح', icon: '🌐' }],
            joinedCommunities: ['comm_prog'],
            enrolledCourses: [],
            followersCount: 1,
            followingCount: 0,
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
  signInWithApple: async (): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new OAuthProvider('apple.com');
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        
        let userDoc;
        try {
          userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
        }

        if (userDoc.exists()) {
          return userDoc.data() as AppUser;
        } else {
          const newUser: AppUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'مستخدم آبل الكوني',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            bio: 'مسجل عبر منصة آبل العريقة! 🪐',
            country: 'المملكة العربية السعودية',
            language: 'العربية',
            interests: ['تصميم', 'برمجة'],
            achievements: [{ id: 'ach_apple', title: 'مبدع التفاحة الكونية', description: 'ربط حساب آبل بنجاح', icon: '🍎' }],
            joinedCommunities: ['comm_prog'],
            enrolledCourses: [],
            followersCount: 1,
            followingCount: 1,
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

  // Phone Authentication (Mock or real)
  signInWithPhone: async (phone: string): Promise<AppUser> => {
    const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
    const matchedUser = Object.values(users).find((u: any) => u.phone === phone) as AppUser | undefined;
    if (matchedUser) {
      return matchedUser;
    }
    // Auto register phone users
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
      purchasedItems: []
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

  // Anonymous Guest Mode
  signInAsGuest: async (): Promise<AppUser> => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInAnonymously(auth);
        const fbUser = userCredential.user;
        const newUser: AppUser = {
          id: fbUser.uid,
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
          purchasedItems: []
        };
        try {
          await setDoc(doc(db, 'users', fbUser.uid), newUser);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
        }
        return newUser;
      } catch (err: any) {
        throw new Error(err.message || "خطأ في الدخول كضيف.");
      }
    } else {
      const guestId = `guest_${Date.now()}`;
      const newUser: AppUser = {
        id: guestId,
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
        purchasedItems: []
      };
      const users = storage.load<Record<string, AppUser>>('lodavia_users', {});
      users[guestId] = newUser;
      storage.save('lodavia_users', users);
      return newUser;
    }
  },

  logout: async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
  }
};
