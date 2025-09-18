// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbAesQWNzSEmdcHGlkFfyNsT_Y1HVBiH4",
  authDomain: "studio-7798022864-95d4a.firebaseapp.com",
  projectId: "studio-7798022864-95d4a",
  storageBucket: "studio-7798022864-95d4a.firebasestorage.app",
  messagingSenderId: "544924222308",
  appId: "1:544924222308:web:6a952dc75072b6066f3071"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
