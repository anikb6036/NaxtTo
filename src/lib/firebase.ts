import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

const isBrowser = typeof window !== 'undefined';
let firestoreInstance;

try {
  if (isBrowser) {
    // In sandboxed iframe & Cloud Run preview environments, force long-polling so WebChannel HTTP streams
    // are not buffered or severed by reverse proxies, preventing [code=unavailable] errors
    firestoreInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId || undefined);
  } else {
    firestoreInstance = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const firestore = firestoreInstance;
export const db = firestore;

// Validate connection per Firebase skill guidelines
export async function testConnection() {
  if (!isBrowser) return;
  try {
    const { doc, getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(firestore, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}

if (isBrowser) {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1200);
}
