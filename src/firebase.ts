import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAaiVLx8i2HmR0VfeuLBrZtZLmjafjJ1o",
  authDomain: "ksw-twitter.firebaseapp.com",
  projectId: "ksw-twitter",
  storageBucket: "ksw-twitter.firebasestorage.app",
  messagingSenderId: "238977092055",
  appId: "1:238977092055:web:e9d008c3ba75fa753aa392"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);