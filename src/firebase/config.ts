import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, EmailAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// In AI Studio, Firebase config can be loaded from environment variables
// or dynamically from the provisioned configuration.
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Check if we have a valid configuration (non-empty API Key)
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("🚀 Lodavia Firebase successfully initialized!");
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase credentials missing. Running in high-performance Local Offline Mock Backend.");
}

export { app, auth, db, storage };
