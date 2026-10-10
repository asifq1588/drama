import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, Firestore } from 'firebase/firestore';
import { Drama, FirebaseConfig, ContinueWatchItem } from '../types/drama';
import { INITIAL_DRAMAS } from '../data/mockDramas';

const CONFIG_STORAGE_KEY = 'free_drama_firebase_config';
const DRAMAS_STORAGE_KEY = 'free_drama_dramas_list';
const WATCH_HISTORY_KEY = 'free_drama_continue_watching';
const BOOKMARKS_KEY = 'free_drama_bookmarks';

export const USER_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyDcCpAp4wM20XvqgVDEOslcMFbLizgAUcE",
  authDomain: "kukuflix-53188.firebaseapp.com",
  databaseURL: "https://kukuflix-53188-default-rtdb.firebaseio.com",
  projectId: "kukuflix-53188",
  storageBucket: "kukuflix-53188.firebasestorage.app",
  messagingSenderId: "370567182067",
  appId: "1:370567182067:web:d56c3ba75220a5db3e6986",
  enabled: true
};

export const DEMO_FIREBASE_CONFIG: FirebaseConfig = USER_FIREBASE_CONFIG;

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If user had previous demo config, ensure user's new real config is active
      if (parsed.projectId === 'free-drama-streaming' || !parsed.apiKey) {
        saveStoredFirebaseConfig(USER_FIREBASE_CONFIG);
        return USER_FIREBASE_CONFIG;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored firebase config', e);
  }
  saveStoredFirebaseConfig(USER_FIREBASE_CONFIG);
  return USER_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  // Reset instance to reinit with new config
  firebaseAppInstance = null;
  firestoreInstance = null;
  if (config.enabled && config.apiKey && config.projectId) {
    initFirebase(config);
  }
}

export function initFirebase(config: FirebaseConfig): { app: FirebaseApp | null; db: Firestore | null; error?: string } {
  if (!config.enabled || !config.apiKey || !config.projectId) {
    return { app: null, db: null };
  }

  try {
    if (!getApps().length) {
      firebaseAppInstance = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        databaseURL: config.databaseURL,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
    } else {
      firebaseAppInstance = getApp();
    }
    firestoreInstance = getFirestore(firebaseAppInstance);
    return { app: firebaseAppInstance, db: firestoreInstance };
  } catch (err: any) {
    console.warn('Firebase init warning:', err?.message);
    return { app: null, db: null, error: err?.message || 'Firebase initialization failed' };
  }
}

export async function testFirebaseConnection(config: FirebaseConfig): Promise<{ success: boolean; message: string }> {
  if (!config.apiKey || !config.projectId) {
    return { success: false, message: 'API Key ও Project ID অবশ্যই দিতে হবে।' };
  }

  try {
    const { db, error } = initFirebase(config);
    if (error || !db) {
      return { success: false, message: error || 'সংযোগ স্থাপন ব্যর্থ হয়েছে।' };
    }
    // Attempt reading from test collection or health check
    const dramasRef = collection(db, 'dramas');
    await getDocs(dramasRef);
    return { success: true, message: 'ফায়ারবেস ফায়ারস্টোর সফলভাবে সংযুক্ত হয়েছে! (Connected Successfully)' };
  } catch (err: any) {
    // If permission denied or project not found
    return {
      success: false,
      message: `ফায়ারবেস ত্রুটি: ${err.message || 'সংযোগ করা যায়নি। অনুগ্রহ করে Security Rules এবং Config নিশ্চিত করুন।'}`
    };
  }
}

export async function loadDramasFromStorage(): Promise<Drama[]> {
  const config = getStoredFirebaseConfig();
  
  // Try Firebase first if enabled
  if (config.enabled && config.apiKey && config.projectId) {
    try {
      const { db } = initFirebase(config);
      if (db) {
        const dramasCol = collection(db, 'dramas');
        const snapshot = await getDocs(dramasCol);
        if (!snapshot.empty) {
          const list: Drama[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          // Cache in localStorage
          localStorage.setItem(DRAMAS_STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch (e) {
      console.warn('Failed to load from Firebase, falling back to LocalStorage', e);
    }
  }

  // Fallback to LocalStorage
  try {
    const raw = localStorage.getItem(DRAMAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage parse error', e);
  }

  // Initial seed
  localStorage.setItem(DRAMAS_STORAGE_KEY, JSON.stringify(INITIAL_DRAMAS));
  return INITIAL_DRAMAS;
}

export async function saveDramasToStorage(dramas: Drama[]): Promise<boolean> {
  // Always update localStorage
  localStorage.setItem(DRAMAS_STORAGE_KEY, JSON.stringify(dramas));

  // Sync to Firebase if enabled
  const config = getStoredFirebaseConfig();
  if (config.enabled && config.apiKey && config.projectId) {
    try {
      const { db } = initFirebase(config);
      if (db) {
        for (const item of dramas) {
          const dramaRef = doc(db, 'dramas', item.id);
          await setDoc(dramaRef, item, { merge: true });
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to sync dramas to Firebase Firestore', e);
    }
  }
  return true;
}

// Watch History Management
export function getContinueWatchingList(): ContinueWatchItem[] {
  try {
    const raw = localStorage.getItem(WATCH_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Default sample history matching Screenshot 3
  return [
    {
      dramaId: 'drama-3',
      episodeId: 'ep-3-8',
      episodeNumber: 8,
      progressPercent: 40,
      lastWatchedAt: new Date().toISOString()
    },
    {
      dramaId: 'drama-4',
      episodeId: 'ep-4-2',
      episodeNumber: 2,
      progressPercent: 65,
      lastWatchedAt: new Date().toISOString()
    }
  ];
}

export function saveContinueWatchProgress(dramaId: string, episodeId: string, episodeNumber: number, progressPercent: number): void {
  const current = getContinueWatchingList();
  const filtered = current.filter(item => item.dramaId !== dramaId);
  filtered.unshift({
    dramaId,
    episodeId,
    episodeNumber,
    progressPercent,
    lastWatchedAt: new Date().toISOString()
  });
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(filtered.slice(0, 10)));
}

// Bookmarks
export function getBookmarkedIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return ['drama-1', 'drama-5'];
}

export function toggleBookmarkId(dramaId: string): string[] {
  const ids = getBookmarkedIds();
  const exists = ids.includes(dramaId);
  const updated = exists ? ids.filter(id => id !== dramaId) : [...ids, dramaId];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}
