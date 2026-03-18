import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import {
  enableIndexedDbPersistence,
  getFirestore,
  initializeFirestore,
  type Firestore,
} from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseReady() {
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId)
}

let _app: FirebaseApp | null = null
let _db: Firestore | null = null
let _persistenceStarted = false

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseReady()) return null
  if (!_app) _app = getApps()[0] ?? initializeApp(cfg)
  return _app
}

export function getAuthInstance(): Auth | null {
  const app = getFirebaseApp()
  return app ? getAuth(app) : null
}

/** Safari/WebKit often hangs on Firestore’s default transport; long polling fixes it. */
function isLikelyWebKitBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari\//.test(ua) && !/Chrom(e|ium)|Edg\//.test(ua)
}

export function getDb(): Firestore | null {
  const app = getFirebaseApp()
  if (!app) return null
  if (!_db) {
    try {
      if (isLikelyWebKitBrowser()) {
        _db = initializeFirestore(app, { experimentalForceLongPolling: true })
      } else {
        _db = getFirestore(app)
      }
    } catch {
      // Already initialized (e.g. hot reload)
      _db = getFirestore(app)
    }
    if (_db && !_persistenceStarted) {
      _persistenceStarted = true
      enableIndexedDbPersistence(_db).catch(() => {
        /* multi-tab or private mode */
      })
    }
  }
  return _db
}

export const googleProvider = new GoogleAuthProvider()
