import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, EmailAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initAppCheck } from './appCheck';

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

// Check if we have a valid configuration (non-empty API Key and Project ID)
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "YOUR_API_KEY"
);

let app: any;
let auth: any = null;
let db: any = null;
let storage: any = null;
let appCheck: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Initialize Firebase App Check before services are engaged
    appCheck = initAppCheck(app);
    auth = getAuth(app);
    db = getFirestore(app);
  try {
    setLogLevel('silent');
  } catch (e) {}
    storage = getStorage(app);
    console.log("🚀 Lodavia Firebase successfully initialized with App Check protection!");
  } catch (error) {
    console.warn("⚠️ Firebase initialization notice:", error);
    db = null;
    auth = null;
    storage = null;
  }
} else {
  console.log("ℹ️ Running in high-performance Local Offline Mock Backend mode.");
}

export { app, auth, db, storage, appCheck };
