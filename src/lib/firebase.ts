// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXyajMRJG398lt08A7AxtV6PX_j2sbNcA",
  authDomain: "ricbookshow.firebaseapp.com",
  projectId: "ricbookshow",
  storageBucket: "ricbookshow.appspot.com",
  messagingSenderId: "16164380326",
  appId: "1:16164380326:web:600d2b0b8aae9a10491e67",
  measurementId: "G-F1Q0QJH32F"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
