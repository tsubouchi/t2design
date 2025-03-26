import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized with config:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey?.slice(0, 5) + "...",
    appId: firebaseConfig.appId,
  });
} else {
  app = getApps()[0];
  console.log("Using existing Firebase app");
}

const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const functions = getFunctions(app, 'asia-northeast1');

// エミュレータに接続（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  console.log('Using Firebase emulators');
  connectAuthEmulator(auth, 'http://0.0.0.0:9299');
  connectFirestoreEmulator(db, '0.0.0.0', 8281);
  connectDatabaseEmulator(realtimeDb, '0.0.0.0', 9113);
  connectFunctionsEmulator(functions, '0.0.0.0', 5001);
}

// 認証状態の永続化を設定
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// 認証状態の変更を監視
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("User is signed out");
  }
});

export { app, auth, db, realtimeDb, functions };