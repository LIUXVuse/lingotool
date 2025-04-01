import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 配置信息
// 注意：在實際部署時，這些值應從環境變量獲取
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "PLACEHOLDER_APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 獲取 Firebase 服務
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 